"""Build the rigged soldier model for the 3D battles.

Runs inside Blender's Python (the `bpy` module from PyPI works headless):

    python -m venv .venv && .venv/bin/pip install bpy==5.0.1 pillow
    git clone --depth 1 https://github.com/makehumancommunity/mpfb2 /tmp/mpfb2
    .venv/bin/python tools/characters/build_soldier.py --mpfb /tmp/mpfb2/src/mpfb --out assets/characters/soldier.glb --bvh <cmu>

(<cmu>: the CMU BVH files in Bruce Hahne's conversion, 007/07_01.bvh and so on;
without them the model only has the standing clips.)

The body, its skeleton and skin weights and the helper shells used for the
clothes come from MakeHuman / MPFB; the skin texture, eyes, eyebrows,
eyelashes, hair, beards and gloves from MakeHuman asset packs and the tileable cloth
and armour textures from ambientCG (all CC0, downloaded into --cache, see
mhassets.py and materials.py). The clothes, helmets, ambient occlusion and
three levels of detail are generated here; each level is exported as one mesh whose vertices name their
part (_PART attribute), and the textures as layers next to the model.
"""
import argparse
import importlib
import json
import math
import os
import sys

import bpy  # noqa: I001  (must come first: it provides the modules below)
import addon_utils
import bmesh
import numpy as np
from mathutils import Vector
from mathutils.bvhtree import BVHTree

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import garments  # noqa: E402
import helmets  # noqa: E402
import materials  # noqa: E402
import mhassets  # noqa: E402
import mocap  # noqa: E402
import outfits  # noqa: E402
import conform  # noqa: E402
import coif  # noqa: E402

ARGS = None


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('--mpfb', required=True, help='path to the mpfb2 source folder (src/mpfb)')
    p.add_argument('--out', default='assets/characters/soldier.glb')
    p.add_argument('--cache', default=os.path.join(os.path.expanduser('~'), '.cache', 'makehuman-assets'),
                   help='folder for the downloaded MakeHuman asset packs')
    p.add_argument('--bvh', default='', help='folder with the CMU BVH files (walking and running clips)')
    p.add_argument('--lod1', type=float, default=0.3, help='decimation ratio of the middle-distance model')
    p.add_argument('--lod2', type=float, default=0.1, help='decimation ratio of the far model')
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


def store_fit(rig, human, scalp):
    """Measurements the game needs to fit helmets (exported as glTF extras on
    the armature)."""
    pts = [v.co for v in scalp.data.vertices]
    mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    rig['hair_center'] = to_gltf((mn + mx) / 2)
    rig['hair_half'] = [round((mx.x - mn.x) / 2, 4), round((mx.z - mn.z) / 2, 4), round((mx.y - mn.y) / 2, 4)]
    le, _ = garments.group_center(human, 'helper-l-eye')
    re, _ = garments.group_center(human, 'helper-r-eye')
    rig['eye_mid'] = to_gltf((le + re) / 2)


# the head (in every soldier) and the garments (by outfit; the bare hands are
# cut from the body for the outfits without gloves, split_hands)
COMMON = ['Body', 'Hair', 'Beard', 'Eyes', 'Brows', 'Lashes', 'Moustache']
# (new parts go at the end: the game's palettes are indexed by these)
PARTS = COMMON + ['Hose', 'Boots', 'Belt', 'Tunic', 'Gambeson', 'Hauberk', 'Surcoat', 'Jerkin', 'Cuirass', 'Plates', 'Jupon', 'Coif',
                  'Hands', 'Gloves', 'Shoes']
PART_IDS = {name: i for i, name in enumerate(PARTS)}


def part_of(name):
    """'Belt-Tunic_LOD1' -> 'Belt'"""
    return name.split('_LOD')[0].split('-')[0]


# small parts left out of the far models: {part: first level without it}
DROP = {'Lashes': 1, 'Eyes': 2, 'Brows': 2}
# dense parts simplified already in the near model (the texture carries the detail)
NEAR_RATIO = {'Body': 0.6, 'Hair': 0.6, 'Beard': 0.4, 'Moustache': 0.5,
              'Tunic': 0.7, 'Gambeson': 0.7, 'Hauberk': 0.7, 'Surcoat': 0.7, 'Jupon': 0.7,
              'Gloves': 0.6}


HAND = ('hand_', 'thumb_', 'index_', 'middle_', 'ring_', 'pinky_')


def split_hands(body, name):
    """Cut the hands off a level's body: the faces whose every vertex has
    some weight on a bone of the hand (or lies past the wrist), as an object
    of their own, so that gloved outfits leave them out. Run on each level
    after it is simplified, so that the cut matches. Both halves keep the
    whole body's normals ('_nrm', see keep_normals): no seam at the wrist."""
    me = body.data
    nrm = me.attributes.new('_nrm', 'FLOAT_VECTOR', 'POINT')
    nrm.data.foreach_set('vector', [c for v in me.vertices for c in v.normal])
    names = {g.index: g.name for g in body.vertex_groups}

    def in_hand(v):
        if any(g.weight > 1e-4 and names.get(g.group, '').startswith(HAND) for g in v.groups):
            return True
        side = 'l' if v.co.x > 0 else 'r'
        return any(names.get(g.group) == 'lowerarm_' + side and g.weight > 0.5 for g in v.groups) and \
            outfits.along(v.co, 'lowerarm_' + side) > 0.93
    hand = [in_hand(v) for v in me.vertices]
    hands = copy_object(body, name)
    for obj, keep in ((hands, True), (body, False)):
        bm = bmesh.new()
        bm.from_mesh(obj.data)
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if all(hand[v.index] for v in f.verts) != keep], context='FACES_ONLY')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bm.to_mesh(obj.data)
        bm.free()
    return hands


def keep_normals(me):
    """Normals stored before a cut ('_nrm', split_hands) as the mesh's
    custom normals (after joining: a join loses them); the other vertices
    keep their own."""
    a = me.attributes.get('_nrm')
    if a is None:
        return
    keep = np.zeros(len(me.vertices) * 3)
    a.data.foreach_get('vector', keep)
    keep = keep.reshape(-1, 3)
    me.attributes.remove(a)
    loops = np.zeros(len(me.loops), dtype=np.int32)
    me.loops.foreach_get('vertex_index', loops)
    own = np.zeros(len(me.loops) * 3)
    me.corner_normals.foreach_get('vector', own)
    own = own.reshape(-1, 3)
    k = keep[loops]
    use = np.where((np.linalg.norm(k, axis=1) > 0.5)[:, None], k, own)
    cn = me.attributes.new('custom_normal', 'FLOAT_VECTOR', 'CORNER')
    cn.data.foreach_set('vector', use.ravel())


def fit_cuffs(gloves, human, rig, gap=0.002, top=1.0, blend=(1.1, 1.2)):
    """The gloves' cuffs (up the forearm from the wrist, `top` along it)
    pulled in to at most `gap` over the skin, and the gloves round the wrist
    skinned like the skin under them (fully up to blend[0] along the
    forearm, none from blend[1]): they stay inside the sleeves, which follow
    the skin, when the wrist bends."""
    body = extract(human, ['body'], 'CuffBody')
    tree = world_bvh([body])
    mask = gloves.vertex_groups.new(name='cuff_mask')
    moved = 0
    for v in gloves.data.vertices:
        side = 'l' if v.co.x > 0 else 'r'
        t = outfits.along(v.co, 'lowerarm_' + side)
        mask.add([v.index], max(0.0, min(1.0, (blend[1] - t) / (blend[1] - blend[0]))), 'REPLACE')
        if t >= top:
            continue
        loc, n, _, _ = tree.find_nearest(v.co, 0.05)
        if loc is None:
            continue
        s = (v.co - loc).dot(n)
        if s > gap:
            v.co = loc + n * gap
            moved += 1
    for g in body.vertex_groups:
        if g.name in rig.data.bones and g.name not in gloves.vertex_groups:
            gloves.vertex_groups.new(name=g.name)
    m = gloves.modifiers.new('DT', 'DATA_TRANSFER')
    m.object = body
    m.use_vert_data = True
    m.data_types_verts = {'VGROUP_WEIGHTS'}
    m.vert_mapping = 'POLYINTERP_NEAREST'
    m.layers_vgroup_select_src = 'ALL'
    m.layers_vgroup_select_dst = 'NAME'
    m.mix_mode = 'REPLACE'
    m.mix_factor = 1.0
    m.vertex_group = 'cuff_mask'
    bpy.context.view_layer.objects.active = gloves
    while gloves.modifiers[0].name != 'DT':
        bpy.ops.object.modifier_move_up(modifier='DT')
    bpy.ops.object.modifier_apply(modifier='DT')
    gloves.vertex_groups.remove(gloves.vertex_groups['cuff_mask'])
    bpy.data.objects.remove(body)
    print('glove cuffs: squeezed', moved, 'points')


def merge_parts(objs, name):
    """Join parts into one mesh with one material. Each vertex keeps the
    number of its part (_PART) so the game can colour it from a palette."""
    for o in objs:
        me = o.data
        pid = PART_IDS[part_of(o.name)]
        attr = me.attributes.get('_PART') or me.attributes.new('_PART', 'FLOAT', 'POINT')
        for i in range(len(me.vertices)):
            attr.data[i].value = float(pid)
        col = me.color_attributes.get('Col')
        if col is None:
            col = me.color_attributes.new('Col', 'FLOAT_COLOR', 'POINT')
            for i in range(len(me.vertices)):
                col.data[i].color = (1.0, 1.0, 1.0, 1.0)
        me.color_attributes.active_color = col
        me.color_attributes.render_color_index = me.color_attributes.active_color_index
        if not me.uv_layers:
            me.uv_layers.new(name='UVMap')
        if o.name.split('_LOD')[0] in mhassets.CARDS:
            mhassets.double_side(o)
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    merged = bpy.context.view_layer.objects.active
    merged.name = name
    merged.data.name = name
    keep_normals(merged.data)
    mat = bpy.data.materials.get('soldier') or bpy.data.materials.new('soldier')
    merged.data.materials.clear()
    merged.data.materials.append(mat)
    for p in merged.data.polygons:
        p.material_index = 0
    return merged




def world_uvs(obj):
    """UVs measured in metres (for tileable textures): a smart projection,
    scaled so that one UV unit is one metre on the garment."""
    me = obj.data
    while me.uv_layers:
        me.uv_layers.remove(me.uv_layers[0])
    me.uv_layers.new(name='UVMap')
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=0.0, scale_to_bounds=False)
    bpy.ops.object.mode_set(mode='OBJECT')
    uv = me.uv_layers['UVMap']  # (leaving edit mode reallocates the layer)
    area3 = sum(p.area for p in me.polygons)
    area2 = 0.0
    for p in me.polygons:
        pts = [uv.data[i].uv.copy() for i in p.loop_indices]
        area2 += abs(sum(pts[i].x * pts[i - 1].y - pts[i - 1].x * pts[i].y for i in range(len(pts)))) / 2
    k = math.sqrt(area3 / max(area2, 1e-9))
    for d in uv.data:
        d.uv = d.uv * k


def bake_ao(objs, distance=0.12, floor=0.4):
    """Ambient occlusion in the vertex colours (folds, the neck under the
    chin, the skin under the hair), from `floor` in closed corners to 1.
    Everything visible in the scene casts it."""
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'CPU'
    scene.cycles.samples = 64
    if scene.world is None:
        scene.world = bpy.data.worlds.new('World')
    scene.world.light_settings.distance = distance
    mat = bpy.data.materials.get('bake') or bpy.data.materials.new('bake')
    for o in objs:
        me = o.data
        if not me.materials:
            me.materials.append(mat)
        col = me.color_attributes.get('Col') or me.color_attributes.new('Col', 'FLOAT_COLOR', 'POINT')
        me.color_attributes.active_color = col
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.bake(type='AO', target='VERTEX_COLORS')
    for o in objs:
        for d in o.data.color_attributes['Col'].data:
            v = floor + (1 - floor) * d.color[0]
            d.color = (v, v, v, 1.0)


def tri_count(obj):
    return sum(len(p.vertices) - 2 for p in obj.data.polygons)


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------

def build():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    hs, ts = setup_mpfb(ARGS.mpfb)
    human, rig = make_human(hs, ts)

    mhassets.fetch(ARGS.cache)
    fitted = mhassets.fit(hs, human, ARGS.cache)
    worn = mhassets.fit_garments(hs, human, ARGS.cache)

    helpers = {
        'extract': extract, 'offset': offset, 'smooth_verts': smooth_verts, 'set_material': set_material,
        'shade_smooth': shade_smooth, 'bone_index': bone_index, 'dominant_bone': dominant_bone,
        'group_weight': group_weight, 'copy_object': copy_object,
    }
    basic = garments.build_all(human, rig, helpers)
    scalp = basic.pop('Scalp')
    pieces = outfits.build_all(human, rig, helpers)
    pieces['Hose'] = basic.pop('Hose')
    pieces['Boots'] = basic.pop('Boots')
    pieces['Shoes'] = basic.pop('Shoes')
    pieces['Gloves'] = worn['Gloves']
    fit_cuffs(pieces['Gloves'], human, rig)
    set_material(pieces['Gloves'], 'gloves')
    shade_smooth(pieces['Gloves'])
    # each layer fitted onto the one under it, then the belts round them
    conform.run(pieces, human, rig, helpers, hose=pieces['Hose'], boots=pieces['Boots'])
    pieces.update(outfits.belts(pieces, rig.data.bones['pelvis'].head_local.y))
    # mail coifs, their mantles over the fitted garments
    pieces.update(coif.build_all(pieces, human, rig, helpers))

    # the visible skin: head, neck and hands (everything under the clothes is
    # removed; the basic tight clothes are what every outfit covers at least)
    body = extract(human, ['body'], 'Body')
    covers = [basic['Shirt'], basic['Skirt'], basic['Belt'], pieces['Hose'], pieces['Boots']]
    L = garments.L
    # keep the skin where clothes meet or open up (waist, neck): if they part
    # in some pose, skin shows instead of a hole
    delete_covered(body, covers, keep=lambda v: abs(v.co.z - (L['belt_top'] - 0.02)) < 0.07 or v.co.z > L['neck'] - 0.1)
    set_material(body, 'skin')
    shade_smooth(body)
    # (after the covered skin is gone: it is found under the hose as it was)
    conform.shrink_hose(pieces['Hose'])
    store_fit(rig, human, scalp)
    helmet_objs = helmets.build_all(human, rig, garments.L)
    for obj in [scalp, human] + list(basic.values()):
        bpy.data.objects.remove(obj)
    common = {'Body': body, **fitted}
    for name, obj in pieces.items():
        world_uvs(obj)
    for name, obj in common.items():
        mhassets.place_uvs(obj, name)
    for name, ratio in NEAR_RATIO.items():
        group = common if name in common else pieces
        near = decimate(group[name], ratio, name + '_near')
        bpy.data.objects.remove(group[name])
        near.name = near.data.name = name
        group[name] = near

    everything = {**common, **pieces}
    for name, obj in everything.items():
        obj.parent = rig
        if not any(m.type == 'ARMATURE' for m in obj.modifiers):
            m = obj.modifiers.new('Armature', 'ARMATURE')
            m.object = rig
        print(f'{name:16s} {tri_count(obj):6d} tris')
    # ambient occlusion: the head and hands with the legs' clothes; each
    # garment with the head and hands only (outfits combine them freely)
    for obj in pieces.values():
        obj.hide_render = True
    for name in ('Hose', 'Boots'):
        pieces[name].hide_render = False
    bake_ao(list(common.values()))
    for name, obj in pieces.items():
        for other in pieces.values():
            other.hide_render = other is not obj
        bake_ao([obj])
    for obj in everything.values():
        obj.hide_render = False
    for obj in helmet_objs.values():
        obj.hide_render = False

    # levels of detail. The head of each level is one mesh (Soldier_LOD<n>),
    # each garment and the bare hands another (Piece_<name>_LOD<n>); the game
    # joins them into one mesh per outfit, so a soldier is a single draw
    # call. Each vertex remembers which part it belongs to (_PART) for the
    # game's palette. Small parts are copied as they are, some are left out
    # far away.
    levels = {0: dict(everything)}
    for level, ratio in ((1, ARGS.lod1), (2, ARGS.lod2)):
        levels[level] = {}
        for name, obj in everything.items():
            if level >= DROP.get(name, 3):
                continue
            lod = f'{name}_LOD{level}'
            levels[level][name] = copy_object(obj, lod) if tri_count(obj) < 400 else decimate(obj, ratio, lod)
    # the hands, a piece of their own (bare-handed outfits; the others wear gloves)
    for level, objs in levels.items():
        objs['Hands'] = split_hands(objs['Body'], f'Hands_LOD{level}')
    parts = {}
    for level, objs in levels.items():
        parts[f'Soldier_LOD{level}'] = merge_parts([o for n, o in objs.items() if n in common], f'Soldier_LOD{level}')
        for name in list(pieces) + ['Hands']:
            parts[f'Piece_{name}_LOD{level}'] = merge_parts([objs[name]], f'Piece_{name}_LOD{level}')
    for name, obj in parts.items():
        print(f'{name:24s} {tri_count(obj):6d} tris')

    # (standing from ACCAD, downloaded; walking and running from the CMU
    # files in --bvh, left out without them)
    mocap.add_clips(rig, ARGS.bvh, mocap.fetch_accad(ARGS.cache))

    # textures: the game finds each part's layer by name
    tex_dir = os.path.join(os.path.dirname(os.path.abspath(ARGS.out)), 'textures')
    files = mhassets.write_textures(ARGS.cache, tex_dir)
    materials.fetch(ARGS.cache)
    tiles = materials.write_tiles(ARGS.cache, tex_dir)
    with open(os.path.join(tex_dir, 'layers.json'), 'w', encoding='utf-8') as f:
        json.dump({
            'size': mhassets.LAYER_SIZE, 'layers': dict(zip(mhassets.LAYERS, files)),
            'tiles': {'size': materials.TILE_SIZE, 'layers': tiles,
                      'repeat': {name: round(1 / metres, 3) for name, (_, _, metres, _) in materials.TILES.items()}},
        }, f, indent=1)
    rig['parts'] = PARTS
    rig['part_layers'] = {**{part: layer for part, (layer, _) in mhassets.PLACE.items()}, 'Hands': 'skin'}

    os.makedirs(os.path.dirname(os.path.abspath(ARGS.out)), exist_ok=True)
    bpy.ops.object.select_all(action='DESELECT')
    rig.select_set(True)
    for obj in list(parts.values()) + list(helmet_objs.values()):
        obj.select_set(True)
    bpy.context.view_layer.objects.active = rig
    bpy.ops.export_scene.gltf(
        filepath=os.path.abspath(ARGS.out), export_format='GLB', use_selection=True, export_apply=True,
        export_yup=True, export_animations=True, export_animation_mode='ACTIONS',
        export_force_sampling=True, export_morph=False, export_skins=True, export_all_influences=False,
        export_vertex_color='ACTIVE', export_normals=True, export_tangents=False, export_texcoords=True,
        export_extras=True, export_attributes=True)
    print('wrote', ARGS.out, os.path.getsize(ARGS.out), 'bytes')


if __name__ == '__main__':
    ARGS = parse_args()
    build()
