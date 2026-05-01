const path = require("path");
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const app = express();
const PORT = process.env.PORT || 3000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

const DIFF = ["lv2", "lv3", "lv4", "lv5", "lv5*", "lv5**"];
const GRADES = ["F1", "F2", "F3", "F4", "F5", "F6"];

const hasCloudConfig = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
const hasAIConfig = Boolean(OPENAI_API_KEY);

const supabase = hasCloudConfig
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  : null;

app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "..", "public")));

function ensureCloud(req, res, next) {
  if (!supabase) {
    return res.status(500).json({
      error:
        "Cloud database is not configured yet. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env, then restart the server."
    });
  }
  return next();
}

function ensureAI(req, res, next) {
  if (!hasAIConfig) {
    return res.status(500).json({
      error: "AI is not configured yet. Add OPENAI_API_KEY to .env and restart the server."
    });
  }
  return next();
}

function norm(body) {
  return {
    latex_code: (body.latex_code || "").trim(),
    solution_latex: (body.solution_latex || "").trim(),
    difficulty: (body.difficulty || "").trim(),
    topic: (body.topic || "").trim(),
    sub_type: (body.sub_type || "").trim(),
    grade: (body.grade || "").trim()
  };
}

function validateLabels(p) {
  if (!DIFF.includes(p.difficulty)) {
    return "Difficulty must be one of: lv2, lv3, lv4, lv5, lv5*, lv5**.";
  }
  if (!p.topic) return "Topic is required.";
  if (!p.sub_type) return "Sub-topic is required.";
  if (!GRADES.includes(p.grade)) return "Grade is invalid.";
  return null;
}

function validateProblem(p) {
  if (!p.latex_code) return "LaTeX code is required.";
  return validateLabels(p);
}

function isMissingSolutionColumn(error) {
  const message = (error && error.message) || "";
  return message.toLowerCase().includes("solution_latex");
}

async function insertWithSolutionFallback(problem) {
  const payload = {
    latex_code: problem.latex_code,
    solution_latex: problem.solution_latex || null,
    difficulty: problem.difficulty,
    topic: problem.topic,
    sub_type: problem.sub_type,
    grade: problem.grade
  };

  let result = await supabase.from("problems").insert(payload).select("*").single();
  if (!result.error) return { ...result, solution_saved: true };

  if (!isMissingSolutionColumn(result.error)) return { ...result, solution_saved: false };

  const fallbackPayload = {
    latex_code: problem.latex_code,
    difficulty: problem.difficulty,
    topic: problem.topic,
    sub_type: problem.sub_type,
    grade: problem.grade
  };
  result = await supabase.from("problems").insert(fallbackPayload).select("*").single();
  return { ...result, solution_saved: false };
}

async function updateWithSolutionFallback(id, problem) {
  const payload = {
    latex_code: problem.latex_code,
    solution_latex: problem.solution_latex || null,
    difficulty: problem.difficulty,
    topic: problem.topic,
    sub_type: problem.sub_type,
    grade: problem.grade
  };

  let result = await supabase.from("problems").update(payload).eq("id", id).select("*").maybeSingle();
  if (!result.error) return { ...result, solution_saved: true };

  if (!isMissingSolutionColumn(result.error)) return { ...result, solution_saved: false };

  const fallbackPayload = {
    latex_code: problem.latex_code,
    difficulty: problem.difficulty,
    topic: problem.topic,
    sub_type: problem.sub_type,
    grade: problem.grade
  };
  result = await supabase.from("problems").update(fallbackPayload).eq("id", id).select("*").maybeSingle();
  return { ...result, solution_saved: false };
}

async function batchInsertWithSolutionFallback(baseLabels, items) {
  const withSolution = items.map((item) => ({
    latex_code: item.latex_code,
    solution_latex: item.solution_latex || null,
    difficulty: baseLabels.difficulty,
    topic: baseLabels.topic,
    sub_type: baseLabels.sub_type,
    grade: baseLabels.grade
  }));

  let result = await supabase.from("problems").insert(withSolution).select("id");
  if (!result.error) return { ...result, solution_saved: true };

  if (!isMissingSolutionColumn(result.error)) return { ...result, solution_saved: false };

  const withoutSolution = items.map((item) => ({
    latex_code: item.latex_code,
    difficulty: baseLabels.difficulty,
    topic: baseLabels.topic,
    sub_type: baseLabels.sub_type,
    grade: baseLabels.grade
  }));

  result = await supabase.from("problems").insert(withoutSolution).select("id");
  return { ...result, solution_saved: false };
}

function getOutputText(responseJson) {
  if (typeof responseJson.output_text === "string" && responseJson.output_text.trim()) {
    return responseJson.output_text;
  }

  const outputs = Array.isArray(responseJson.output) ? responseJson.output : [];
  for (const item of outputs) {
    const contents = Array.isArray(item.content) ? item.content : [];
    for (const content of contents) {
      if (content && typeof content.text === "string" && content.text.trim()) {
        return content.text;
      }
    }
  }

  return "";
}
async function generateVariants(seedLatex, count) {
  const schema = {
    type: "object",
    properties: {
      variants: {
        type: "array",
        minItems: count,
        maxItems: count,
        items: {
          type: "object",
          properties: {
            latex_code: { type: "string" },
            solution_latex: { type: "string" }
          },
          required: ["latex_code", "solution_latex"],
          additionalProperties: false
        }
      }
    },
    required: ["variants"],
    additionalProperties: false
  };

  const instructions = [
    "You are generating similar math questions.",
    "Keep the same structure and difficulty style.",
    "Only change numbers/constants/signs where appropriate.",
    "Do not change topic type.",
    "For each generated question, provide a concise but complete worked solution in LaTeX.",
    `Generate exactly ${count} variants.`
  ].join(" ");

  const payload = {
    model: OPENAI_MODEL,
    input: [
      {
        role: "system",
        content: [{ type: "input_text", text: instructions }]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Seed question LaTeX:\n${seedLatex}`
          }
        ]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "question_variants",
        strict: true,
        schema
      }
    }
  };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  const json = await response.json();
  if (!response.ok) {
    const msg = (json && json.error && json.error.message) || "OpenAI request failed.";
    throw new Error(msg);
  }

  const text = getOutputText(json);
  if (!text) throw new Error("Model returned empty output.");

  const parsed = JSON.parse(text);
  const variants = Array.isArray(parsed.variants) ? parsed.variants : [];

  if (variants.length !== count) {
    throw new Error("Generated variant count mismatch.");
  }

  const cleaned = variants.map((item) => ({
    latex_code: String(item.latex_code || "").trim(),
    solution_latex: String(item.solution_latex || "").trim()
  }));

  if (cleaned.some((v) => !v.latex_code || !v.solution_latex)) {
    throw new Error("Generated output missing question or solution.");
  }

  return cleaned;
}

app.get("/api/meta", (_req, res) => {
  res.json({ difficulties: DIFF, grades: GRADES, ai_enabled: hasAIConfig });
});

app.get("/api/problems", ensureCloud, async (req, res) => {
  const { difficulty, topic, grade, q } = req.query;

  let query = supabase.from("problems").select("*").order("id", { ascending: false });

  if (difficulty) query = query.eq("difficulty", difficulty);
  if (grade) query = query.eq("grade", grade);
  if (topic) query = query.ilike("topic", `%${topic}%`);
  if (q) query = query.or(`latex_code.ilike.%${q}%,topic.ilike.%${q}%,sub_type.ilike.%${q}%`);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

app.post("/api/problems", ensureCloud, async (req, res) => {
  const p = norm(req.body);
  const err = validateProblem(p);
  if (err) return res.status(400).json({ error: err });

  const { data, error, solution_saved } = await insertWithSolutionFallback(p);
  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json({ ...data, solution_saved });
});
app.post("/api/problems/batch", ensureCloud, async (req, res) => {
  const baseLabels = {
    difficulty: (req.body.difficulty || "").trim(),
    topic: (req.body.topic || "").trim(),
    sub_type: (req.body.sub_type || "").trim(),
    grade: (req.body.grade || "").trim()
  };

  const labelErr = validateLabels(baseLabels);
  if (labelErr) return res.status(400).json({ error: labelErr });

  const items = Array.isArray(req.body.items) ? req.body.items : [];
  if (!items.length) return res.status(400).json({ error: "No approved items to upload." });

  if (items.some((i) => !String(i.latex_code || "").trim())) {
    return res.status(400).json({ error: "Each item needs LaTeX code." });
  }

  const cleanItems = items.map((i) => ({
    latex_code: String(i.latex_code || "").trim(),
    solution_latex: String(i.solution_latex || "").trim()
  }));

  const { data, error, solution_saved } = await batchInsertWithSolutionFallback(baseLabels, cleanItems);
  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json({ inserted: (data || []).length, solution_saved });
});

app.post("/api/generate-variants", ensureAI, async (req, res) => {
  const seed = String(req.body.seed_latex || "").trim();
  const count = Number(req.body.count);

  if (!seed) return res.status(400).json({ error: "Seed LaTeX is required." });
  if (!Number.isInteger(count) || count < 1 || count > 20) {
    return res.status(400).json({ error: "Count must be an integer from 1 to 20." });
  }

  try {
    const variants = await generateVariants(seed, count);
    return res.json({ variants });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to generate variants." });
  }
});

app.put("/api/problems/:id", ensureCloud, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid problem id." });
  }

  const p = norm(req.body);
  const err = validateProblem(p);
  if (err) return res.status(400).json({ error: err });

  const { data, error, solution_saved } = await updateWithSolutionFallback(id, p);
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Problem not found." });

  return res.json({ ...data, solution_saved });
});

app.delete("/api/problems/:id", ensureCloud, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid problem id." });
  }

  const { data, error } = await supabase.from("problems").delete().eq("id", id).select("id").maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Problem not found." });
  return res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (!hasCloudConfig) {
    console.log("Missing cloud config. Create .env from .env.example and add Supabase credentials.");
  }
  if (!hasAIConfig) {
    console.log("AI generation is disabled until OPENAI_API_KEY is set in .env.");
  }
});
