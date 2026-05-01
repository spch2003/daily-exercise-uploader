# Free 3D Pet Pipeline (No-cost tools)

This guide is tailored to your app and naming style.

## Tools (free)
1. Meshy free tier (generate base 3D pet + outfit variants)
2. Blender (free, cleanup/optimization/export)
3. Optional: Mixamo (free auto-rig, if you later want simple animations)

## What I already prepared for you in this folder
- prompts/base_pet.txt
- prompts/outfit_variant.txt
- prompts/mood_variant.txt
- prompts/negative_prompt.txt
- manifest-template.json
- checklist.md
- streak-mood-rules.md

## Target output files (put into `pet-kit/exports/`)
- pet_base.glb
- pet_happy.glb
- pet_unhappy.glb
- outfit_school_uniform.glb
- outfit_sport.glb
- outfit_formal.glb
- outfit_fun.glb

You can add more outfits later with same naming pattern.

## Step-by-step

### Step 1 (You do): Generate base pet in Meshy
- Open Meshy text-to-3D.
- Copy prompt from prompts/base_pet.txt.
- Add negative prompt from prompts/negative_prompt.txt.
- Generate until you get one cute result.
- Export GLB as `pet_base.glb` into `pet-kit/exports/`.

### Step 2 (You do): Generate mood variants
- Use prompts/mood_variant.txt and replace `[MOOD]` with `happy`, then `unhappy`.
- Keep same character identity as base.
- Export as:
  - `pet_happy.glb`
  - `pet_unhappy.glb`

### Step 3 (You do): Generate outfit variants
- Use prompts/outfit_variant.txt.
- Replace `[OUTFIT_NAME]` each time.
- Recommended first 4 outfits:
  - school uniform
  - sport
  - formal
  - fun/casual
- Export as:
  - `outfit_school_uniform.glb`
  - `outfit_sport.glb`
  - `outfit_formal.glb`
  - `outfit_fun.glb`

### Step 4 (You do): Blender cleanup (quick)
For each GLB:
1. Import GLB.
2. Apply shade smooth.
3. Remove tiny floating parts.
4. Keep only one character object hierarchy.
5. Export GLB with:
   - Apply Modifiers ON
   - +Y up / -Z forward defaults
   - Include textures

### Step 5 (I can do next after you finish Step 4)
I will:
1. Validate all filenames and manifest.
2. Prepare a drop-in `pet_assets` manifest aligned with your existing app data model.
3. Give exact minimal code patch plan to show pet/outfit/mood by streak.

## Important notes
- Keep each GLB small (target < 5 MB, ideally 1-3 MB).
- Use same pet proportions across variants.
- Do not change character species between outfits/moods.
