"""
Batch runner for your four mood files.
Run after Blender installation:
blender --background --python blender-scripts/batch_colorize_moods.py
"""
import subprocess
from pathlib import Path
import sys

root = Path(__file__).resolve().parents[1]
exports = root / "exports"
script = root / "blender-scripts" / "apply_materials_and_export.py"

jobs = [
    ("pet_sad_broken.glb", "streak_broken"),
    ("pet_happy_3d.glb", "streak_3d"),
    ("pet_happy_7d.glb", "streak_7d"),
    ("pet_happy_14d.glb", "streak_14d"),
]

for fname, mood in jobs:
    f = exports / fname
    if not f.exists():
        print(f"Skip missing: {f}")
        continue
    cmd = [
        "blender", "--background", "--python", str(script), "--",
        "--input", str(f),
        "--output", str(f),
        "--mood", mood,
    ]
    print("Running:", " ".join(cmd))
    subprocess.run(cmd, check=True)

print("Done batch colorize.")
