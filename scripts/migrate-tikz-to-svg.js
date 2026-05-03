const path = require("path");
const crypto = require("crypto");
const zlib = require("zlib");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.QUESTION_FIGURE_BUCKET || "question-figures";
const KROKI_BASE_URL = process.env.KROKI_BASE_URL || "https://kroki.io";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
const startIdArg = process.argv.find((arg) => arg.startsWith("--start-id="));
const limit = limitArg ? Math.max(1, Number(limitArg.split("=")[1] || 0)) : 1000;
const startId = startIdArg ? Math.max(1, Number(startIdArg.split("=")[1] || 0)) : 1;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

function usage() {
  console.log(`
Usage:
  node scripts/migrate-tikz-to-svg.js --dry-run
  node scripts/migrate-tikz-to-svg.js --limit=50
  node scripts/migrate-tikz-to-svg.js --start-id=1001 --limit=1000

Options:
  --dry-run       Count/show rows that would be changed without uploading or updating.
  --limit=N       Process at most N rows from the selected range. Default: 1000.
  --start-id=N    Start from problem id N. Default: 1.

Environment:
  QUESTION_FIGURE_BUCKET=question-figures
  KROKI_BASE_URL=https://kroki.io
`);
}

if (args.has("--help") || args.has("-h")) {
  usage();
  process.exit(0);
}

function hasTikz(text) {
  return /\[TIKZ\][\s\S]*?\[\/TIKZ\]/i.test(String(text || "")) ||
    /\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\}/.test(String(text || ""));
}

function normalizeTikz(block) {
  return String(block || "")
    .trim()
    .replace(/\\n(?![A-Za-z])/g, "\n");
}

function wrapLatexDocument(tikzSource) {
  const source = normalizeTikz(tikzSource);
  if (/\\begin\{document\}/.test(source)) return source;
  return [
    "\\documentclass[tikz,border=2pt]{standalone}",
    "\\usepackage{amsmath}",
    "\\usepackage{tikz}",
    "\\usetikzlibrary{angles,quotes,calc,arrows.meta,positioning,decorations.pathreplacing}",
    "\\begin{document}",
    source,
    "\\end{document}"
  ].join("\n");
}

function toBase64Url(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function buildKrokiUrl(tikzSource) {
  const latexDoc = wrapLatexDocument(tikzSource);
  const compressed = zlib.deflateSync(Buffer.from(latexDoc, "utf8"), { level: 9 });
  return `${KROKI_BASE_URL.replace(/\/+$/g, "")}/tikz/svg/${toBase64Url(compressed)}`;
}

function hashText(text) {
  return crypto.createHash("sha256").update(String(text || "")).digest("hex").slice(0, 16);
}

function sanitizeSvg(svg) {
  const value = String(svg || "").trim();
  if (!value.includes("<svg")) {
    throw new Error("Renderer did not return SVG content.");
  }
  return value;
}

async function ensureBucket() {
  if (dryRun) return;
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;
  if ((buckets || []).some((bucket) => bucket.name === BUCKET)) return;

  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 1024 * 1024,
    allowedMimeTypes: ["image/svg+xml"]
  });
  if (error && !/already exists/i.test(error.message || "")) throw error;
}

async function renderTikzToSvg(tikzSource) {
  const url = buildKrokiUrl(tikzSource);
  const res = await fetch(url, {
    headers: { Accept: "image/svg+xml" }
  });
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`Kroki render failed (${res.status}): ${body.slice(0, 300)}`);
  }
  return sanitizeSvg(body);
}

async function uploadSvg(problemId, fieldName, index, tikzSource, svg) {
  const fileHash = hashText(tikzSource);
  const objectPath = `problems/${problemId}/${fieldName}_${index}_${fileHash}.svg`;
  const { error } = await supabase.storage.from(BUCKET).upload(objectPath, svg, {
    contentType: "image/svg+xml",
    cacheControl: "31536000",
    upsert: true
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
  if (!data?.publicUrl) throw new Error(`Could not build public URL for ${objectPath}`);
  return data.publicUrl;
}

async function replaceTikzBlocks(problemId, fieldName, text) {
  let count = 0;
  const replacements = [];

  async function convert(block) {
    count += 1;
    const tikzSource = normalizeTikz(block);
    if (dryRun) {
      replacements.push({ index: count, url: `[DRY_RUN:${fieldName}_${count}.svg]` });
      return `[FIGURE:DRY_RUN_${problemId}_${fieldName}_${count}.svg]`;
    }
    const svg = await renderTikzToSvg(tikzSource);
    const publicUrl = await uploadSvg(problemId, fieldName, count, tikzSource, svg);
    replacements.push({ index: count, url: publicUrl });
    return `[FIGURE:${publicUrl}]`;
  }

  let output = "";
  let cursor = 0;
  const source = String(text || "");
  const pattern = /\[TIKZ\]([\s\S]*?)\[\/TIKZ\]|(\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\})/gi;
  let match;

  while ((match = pattern.exec(source))) {
    output += source.slice(cursor, match.index);
    output += await convert(match[1] || match[2] || "");
    cursor = pattern.lastIndex;
  }
  output += source.slice(cursor);

  return { text: output, count, replacements };
}

async function fetchCandidateRows() {
  const { data, error } = await supabase
    .from("problems")
    .select("id, latex_code, solution_latex")
    .gte("id", startId)
    .order("id", { ascending: true })
    .limit(limit);
  if (error) throw error;

  return (data || []).filter((row) => {
    const questionNeedsWork = hasTikz(row.latex_code);
    const solutionNeedsWork = hasTikz(row.solution_latex);
    return questionNeedsWork || solutionNeedsWork;
  });
}

async function updateProblem(row, nextLatex, nextSolution) {
  const payload = {
    latex_code: nextLatex,
    solution_latex: nextSolution,
    latex_code_original: row.latex_code,
    solution_latex_original: row.solution_latex
  };

  const { error } = await supabase.from("problems").update(payload).eq("id", row.id);
  if (!error) return;

  if (/latex_code_original|solution_latex_original/i.test(error.message || "")) {
    throw new Error(
      "Backup columns are missing. Run this SQL first:\n" +
        "alter table public.problems add column if not exists latex_code_original text;\n" +
        "alter table public.problems add column if not exists solution_latex_original text;"
    );
  }
  throw error;
}

async function main() {
  console.log(`TikZ -> SVG migration`);
  console.log(`bucket=${BUCKET} startId=${startId} limit=${limit} dryRun=${dryRun}`);

  await ensureBucket();
  const rows = await fetchCandidateRows();
  console.log(`Found ${rows.length} candidate problem rows.`);

  let changedRows = 0;
  let convertedFigures = 0;
  const failures = [];

  for (const row of rows) {
    try {
      const questionHasWork = hasTikz(row.latex_code);
      const solutionHasWork = hasTikz(row.solution_latex);
      let nextLatex = row.latex_code;
      let nextSolution = row.solution_latex;
      let figureCount = 0;

      if (questionHasWork) {
        const result = await replaceTikzBlocks(row.id, "latex_code", row.latex_code);
        nextLatex = result.text;
        figureCount += result.count;
      }
      if (solutionHasWork) {
        const result = await replaceTikzBlocks(row.id, "solution_latex", row.solution_latex);
        nextSolution = result.text;
        figureCount += result.count;
      }

      if (!dryRun && figureCount > 0) {
        await updateProblem(row, nextLatex, nextSolution);
      }

      changedRows += 1;
      convertedFigures += figureCount;
      console.log(`OK problem ${row.id}: ${figureCount} figure(s)`);
    } catch (error) {
      failures.push({ id: row.id, error: error.message || String(error) });
      console.error(`FAIL problem ${row.id}: ${error.message || error}`);
    }
  }

  console.log("");
  console.log(`Done. rows=${changedRows}, figures=${convertedFigures}, failures=${failures.length}`);
  if (failures.length) {
    console.log("Failures:");
    for (const failure of failures) {
      console.log(`- problem ${failure.id}: ${failure.error}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
