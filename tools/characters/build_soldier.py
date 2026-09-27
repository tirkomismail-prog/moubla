"""Build the rigged soldier model for the 3D battles.

Runs inside Blender's Python (the `bpy` module from PyPI works headless):

    python -m venv .venv && .venv/bin/pip install bpy==5.0.1
    git clone --depth 1 https://github.com/makehumancommunity/mpfb2 /tmp/mpfb2
    .venv/bin/python tools/characters/build_soldier.py --mpfb /tmp/mpfb2/src/mpfb --out assets/characters/soldier.glb

The body, its skeleton and skin weights and the helper shells used for the
clothes come from MakeHuman / MPFB (assets under CC0). Everything else
(clothes, hair, eyes, level of detail) is generated here.
"""
import argparse
import importlib
import math
import os
import sys

import bpy  # noqa: I001  (must come first: it provides the modules below)
import addon_utils
import bmesh
from mathutils import Vector
from mathutils.bvhtree import BVHTree

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import garments  # noqa: E402
import mocap  # noqa: E402

ARGS = None


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('--mpfb', required=True, help='path to the mpfb2 source folder (src/mpfb)')
    p.add_argument('--out', default='assets/characters/soldier.glb')
    p.add_argument('--bvh', default='', help='folder with CMU BVH files (optional, adds mocap clips)')
    p.add_argument('--lod1', type=float, default=0.3, help='decimation ratio of the far model')
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
    return p.parse_args(argv)


# ---------------------------------------------------------------------------
# MPFB
# ---------------------------------------------------------------------------

def setup_mpfb(src):
    ext_dir = os.path.join(bpy.utils.user_resource('EXTENSIONS'), 'user_default')
    os.makedirs(ext_dir, exist_ok=True)
    link = os.path.join(ext_dir, 'mpfb')
    if not os.path.exists(link):
        os.symlink(os.path.abspath(src), link)
    addon_utils.enable('bl_ext.user_default.mpfb', default_set=True)
    hs = importlib.import_module('bl_ext.user_default.mpfb.services.humanservice').HumanService
    ts = importlib.import_module('bl_ext.user_default.mpfb.services.targetservice').TargetService
    return hs, ts


def make_human(hs, ts):
    macro = ts.get_default_macro_info_dict()
    macro.update(gender=1.0, age=0.45, muscle=0.68, weight=0.55, height=0.56, proportions=0.5)
    macro['race'] = {'caucasian': 0.8, 'asian': 0.1, 'african': 0.1}
    body = hs.create_human(macro_detail_dict=macro, detailed_helpers=True, extra_vertex_groups=True, mask_helpers=False)
    rig = hs.add_builtin_rig(body, 'game_engine')
    bake_shape_keys(body)
    body.name = 'Human'
    rig.name = 'Soldier'
    rig.data.name = 'Soldier'
    return body, rig


# ---------------------------------------------------------------------------
# Mesh helpers
# ---------------------------------------------------------------------------

def bake_shape_keys(obj):
    """Freeze the MakeHuman targets (shape keys) into the mesh."""
    keys = obj.data.shape_keys
    if not keys:
        return
    mix = obj.shape_key_add(name='mix', from_mix=True)
    coords = [p.co.copy() for p in mix.data]
    obj.shape_key_clear()
    for v, co in zip(obj.data.vertices, coords):
        v.co = co


def group_weight(v, dl, gi):
    return v[dl][gi] if gi in v[dl] else 0.0


def copy_object(src, name):
    new = src.copy()
    new.data = src.data.copy()
    new.name = name
    new.data.name = name
    for m in list(new.modifiers):
        if m.type != 'ARMATURE':
            new.modifiers.remove(m)
    bpy.context.collection.objects.link(new)
    return new


def extract(src, groups, name, keep=None):
    """New object with the faces whose vertices all belong to one of `groups`
    (and pass the optional `keep(vertex)` test)."""
    new = copy_object(src, name)
    gis = [src.vertex_groups[g].index for g in groups]
    bm = bmesh.new()
    bm.from_mesh(new.data)
    dl = bm.verts.layers.deform.active
    ok = set()
    for v in bm.verts:
        if any(group_weight(v, dl, gi) > 0.5 for gi in gis) and (keep is None or keep(v)):
            ok.add(v)
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if v not in ok], context='VERTS')
    bm.to_mesh(new.data)
    bm.free()
    new.data.materials.clear()
    return new


def dominant_bone(v, dl, bone_idx):
    best, bw = None, 0.0
    for gi, w in v[dl].items():
        if gi in bone_idx and w > bw:
            best, bw = bone_idx[gi], w
    return best


def bone_index(obj, rig):
    names = {b.name for b in rig.data.bones}
    return {g.index: g.name for g in obj.vertex_groups if g.name in names}


def offset(obj, dist, mask=None):
    """Push vertices out along their normals (optionally only where mask(v))."""
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bm.normal_update()
    moves = [(v, v.normal.copy()) for v in bm.verts if mask is None or mask(v)]
    for v, n in moves:
        v.co += n * dist
    bm.to_mesh(obj.data)
    bm.free()


def smooth_verts(obj, iterations=1, factor=0.5, mask=None):
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    verts = [v for v in bm.verts if mask is None or mask(v)]
    for _ in range(iterations):
        bmesh.ops.smooth_vert(bm, verts=verts, factor=factor, use_axis_x=True, use_axis_y=True, use_axis_z=True)
    bm.to_mesh(obj.data)
    bm.free()


def set_material(obj, name):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    for p in obj.data.polygons:
        p.material_index = 0


def shade_smooth(obj):
    for p in obj.data.polygons:
        p.use_smooth = True


def world_bvh(objs):
    """BVH tree over several objects (in their rest shape)."""
    bm = bmesh.new()
    for o in objs:
        tmp = bmesh.new()
        tmp.from_mesh(o.data)
        tmp.transform(o.matrix_world)
        m = bpy.data.meshes.new('tmp')
        tmp.to_mesh(m)
        bm.from_mesh(m)
        bpy.data.meshes.remove(m)
        tmp.free()
    tree = BVHTree.FromBMesh(bm)
    bm.free()
    return tree


def delete_covered(body, covers, max_dist=0.06, keep=None):
    """Remove body faces hidden under clothes: a vertex is covered when a ray
    along its normal hits a garment within `max_dist`."""
    tree = world_bvh(covers)
    bm = bmesh.new()
    bm.from_mesh(body.data)
    bm.normal_update()
    covered = set()
    for v in bm.verts:
        if keep and keep(v):
            continue
        hit = tree.ray_cast(v.co + v.normal * 0.001, v.normal, max_dist)
        if hit[0] is not None:
            covered.add(v)
    faces = [f for f in bm.faces if all(v in covered for v in f.verts)]
    bmesh.ops.delete(bm, geom=faces, context='FACES_ONLY')
    loose = [v for v in bm.verts if not v.link_faces]
    bmesh.ops.delete(bm, geom=loose, context='VERTS')
    bm.to_mesh(body.data)
    bm.free()


def decimate(obj, ratio, name):
    lod = copy_object(obj, name)
    mod = lod.modifiers.new('Decimate', 'DECIMATE')
    mod.ratio = ratio
    mod.use_collapse_triangulate = True
    names = [m.name for m in lod.modifiers]
    lod.modifiers.move(names.index('Decimate'), 0)
    bpy.context.view_layer.objects.active = lod
    bpy.ops.object.modifier_apply(modifier='Decimate')
    return lod


def to_gltf(v):
    """Blender (Z up, facing -Y) to glTF (Y up, facing +Z) coordinates."""
    return [round(v.x, 4), round(v.z, 4), round(-v.y, 4)]


def store_fit(rig, human, parts):
    """Measurements the game needs to fit helmets and hold weapons (exported
    as glTF extras on the armature)."""
    pts = [v.co for v in parts['Hair'].data.vertices]
    mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    rig['hair_center'] = to_gltf((mn + mx) / 2)
    rig['hair_half'] = [round((mx.x - mn.x) / 2, 4), round((mx.z - mn.z) / 2, 4), round((mx.y - mn.y) / 2, 4)]
    le, _ = garments.group_center(human, 'helper-l-eye')
    re, _ = garments.group_center(human, 'helper-r-eye')
    rig['eye_mid'] = to_gltf((le + re) / 2)


def tri_count(obj):
    return sum(len(p.vertices) - 2 for p in obj.data.polygons)


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------

def build():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    hs, ts = setup_mpfb(ARGS.mpfb)
    human, rig = make_human(hs, ts)

    parts = garments.build_all(human, rig, {
        'extract': extract, 'offset': offset, 'smooth_verts': smooth_verts, 'set_material': set_material,
        'shade_smooth': shade_smooth, 'bone_index': bone_index, 'dominant_bone': dominant_bone,
        'group_weight': group_weight, 'copy_object': copy_object,
    })

    # the visible skin: head, neck and hands (everything under the clothes is removed)
    body = extract(human, ['body'], 'Body')
    covers = [parts[k] for k in ('Shirt', 'Hose', 'Boots', 'Skirt', 'Belt')]
    L = garments.L
    # keep the skin where clothes meet or open up (waist, neck): if they part
    # in some pose, skin shows instead of a hole
    delete_covered(body, covers, keep=lambda v: abs(v.co.z - (L['belt_top'] - 0.02)) < 0.07 or v.co.z > L['neck'] - 0.1)
    set_material(body, 'skin')
    shade_smooth(body)
    garments.paint_face(body, human)
    store_fit(rig, human, parts)
    bpy.data.objects.remove(human)
    parts['Body'] = body

    # far models
    lods = {}
    for name, obj in list(parts.items()):
        ratio = 1.0 if tri_count(obj) < 400 else ARGS.lod1
        if ratio < 1.0:
            lods[name + '_LOD1'] = decimate(obj, ratio, name + '_LOD1')
    parts.update(lods)

    for name, obj in parts.items():
        obj.parent = rig
        if not any(m.type == 'ARMATURE' for m in obj.modifiers):
            m = obj.modifiers.new('Armature', 'ARMATURE')
            m.object = rig
        print(f'{name:14s} {tri_count(obj):6d} tris')

    if ARGS.bvh:
        mocap.add_clips(rig, ARGS.bvh)

    os.makedirs(os.path.dirname(os.path.abspath(ARGS.out)), exist_ok=True)
    bpy.ops.object.select_all(action='DESELECT')
    rig.select_set(True)
    for obj in parts.values():
        obj.select_set(True)
    bpy.context.view_layer.objects.active = rig
    bpy.ops.export_scene.gltf(
        filepath=os.path.abspath(ARGS.out), export_format='GLB', use_selection=True, export_apply=True,
        export_yup=True, export_animations=bool(ARGS.bvh), export_animation_mode='ACTIONS',
        export_force_sampling=True, export_morph=False, export_skins=True, export_all_influences=False,
        export_vertex_color='ACTIVE', export_normals=True, export_tangents=False, export_texcoords=True,
        export_extras=True)
    print('wrote', ARGS.out, os.path.getsize(ARGS.out), 'bytes')


if __name__ == '__main__':
    ARGS = parse_args()
    build()
