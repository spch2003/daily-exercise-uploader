"""
Blender script: apply richer cute materials and export GLB.
Usage:
blender --background --python blender-scripts/apply_materials_and_export.py -- \
  --input "pet-kit/exports/pet_happy_3d.glb" \
  --output "pet-kit/exports/pet_happy_3d.glb" \
  --mood "streak_3d"
"""
import bpy
import sys
from pathlib import Path

PALETTES = {
    "default": {"fur_main": "#CC7A2B", "fur_shadow": "#A45E1E", "mood_tint": "#B8792E"},
    "streak_broken": {"fur_main": "#B87333", "fur_shadow": "#8A5526", "mood_tint": "#7E8A98"},
    "streak_3d": {"fur_main": "#C97A2D", "fur_shadow": "#9A5E22", "mood_tint": "#7CBF78"},
    "streak_7d": {"fur_main": "#CF7E2D", "fur_shadow": "#A56322", "mood_tint": "#59B978"},
    "streak_14d": {"fur_main": "#DA8730", "fur_shadow": "#AD6826", "mood_tint": "#E3B14A"},
}

def hex_to_rgba(h):
    h = h.lstrip('#')
    r = int(h[0:2], 16) / 255.0
    g = int(h[2:4], 16) / 255.0
    b = int(h[4:6], 16) / 255.0
    return (r, g, b, 1.0)

def arg_value(name, default=None):
    argv = sys.argv
    if "--" not in argv:
        return default
    args = argv[argv.index("--") + 1 :]
    if name in args:
        i = args.index(name)
        if i + 1 < len(args):
            return args[i + 1]
    return default

def new_principled(name, hex_color, rough=0.55, clearcoat=0.0, spec=0.5):
    m = bpy.data.materials.new(name)
    # Blender 5.x prefers node_tree over deprecated use_nodes flag
    m.node_tree
    p = m.node_tree.nodes.get("Principled BSDF")
    if not p:
        return m
    # Robust socket assignment by name (works across Blender versions)
    if "Base Color" in p.inputs:
        p.inputs["Base Color"].default_value = hex_to_rgba(hex_color)
    if "Roughness" in p.inputs:
        p.inputs["Roughness"].default_value = float(rough)
    if "Specular" in p.inputs:
        p.inputs["Specular"].default_value = float(spec)
    elif "Specular IOR Level" in p.inputs:
        p.inputs["Specular IOR Level"].default_value = float(spec)
    if "Clearcoat" in p.inputs:
        p.inputs["Clearcoat"].default_value = float(clearcoat)
    elif "Coat Weight" in p.inputs:
        p.inputs["Coat Weight"].default_value = float(clearcoat)
    return m

inp = arg_value("--input")
outp = arg_value("--output")
mood = arg_value("--mood", "default")
if not inp or not outp:
    raise SystemExit("Need --input and --output")

inp = str(Path(inp).resolve())
outp = str(Path(outp).resolve())
palette = PALETTES.get(mood, PALETTES["default"])

# reset scene
bpy.ops.wm.read_factory_settings(use_empty=True)

# import glb
bpy.ops.import_scene.gltf(filepath=inp)

# materials per your requirement:
# eyes: white surround + black eyeball
# nose: black
# ears: fur color surrounding + white inner ear
# limbs/body: fur color (brown-orange)
# tail tip + feet: white
mat_fur_main = new_principled("PetFurMain", palette["fur_main"], rough=0.62, clearcoat=0.02, spec=0.38)
mat_fur_shadow = new_principled("PetFurShadow", palette["fur_shadow"], rough=0.66, clearcoat=0.0, spec=0.30)
mat_white = new_principled("PetWhite", "#F7F4EA", rough=0.48, clearcoat=0.05, spec=0.45)
mat_black = new_principled("PetBlack", "#121212", rough=0.35, clearcoat=0.10, spec=0.55)
mat_mood = new_principled("PetMoodTint", palette["mood_tint"], rough=0.58, clearcoat=0.02, spec=0.40)

meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
for idx, obj in enumerate(meshes):
    name = obj.name.lower()
    obj.data.materials.clear()

    if "nose" in name:
        obj.data.materials.append(mat_black)
    elif "pupil" in name or "eyeball" in name or "iris" in name:
        obj.data.materials.append(mat_black)
    elif "eye" in name:
        obj.data.materials.append(mat_white)
    elif "ear_inner" in name or ("ear" in name and ("inner" in name or "inside" in name)):
        obj.data.materials.append(mat_white)
    elif "ear" in name:
        obj.data.materials.append(mat_fur_main)
    elif "tail_tip" in name or ("tail" in name and "tip" in name):
        obj.data.materials.append(mat_white)
    elif "foot" in name or "paw" in name:
        obj.data.materials.append(mat_white)
    elif "tail" in name:
        obj.data.materials.append(mat_fur_shadow)
    elif "body" in name or "leg" in name or "limb" in name or "arm" in name:
        obj.data.materials.append(mat_fur_main)
    elif "mood" in name or "acc" in name:
        obj.data.materials.append(mat_mood)
    else:
        if idx % 4 == 0:
            obj.data.materials.append(mat_fur_shadow)
        else:
            obj.data.materials.append(mat_fur_main)

# Do not force black/white fallback on generic meshes.
# Some models are a single mesh; forcing fallback can paint the whole pet black.

# export glb
bpy.ops.export_scene.gltf(
    filepath=outp,
    export_format="GLB",
    export_apply=True,
    export_texcoords=True,
    export_normals=True,
    export_materials="EXPORT",
)
print(f"Exported: {outp}")
