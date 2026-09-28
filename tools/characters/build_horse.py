"""Build the horse model for the battles.

Runs inside Blender's Python like build_soldier.py:

    .venv/bin/python tools/characters/build_horse.py --out assets/characters/horse.glb

The horse is "Rigged Horse" from OpenGameArt (CC0): Lyndon Daniels' horse
from the Realtime Ranchers pack, rigged by ChadM. It is downloaded into
--cache. This script scales it to metres (the saddle at the origin, the
hooves on the ground), skins the mane, tail and eyes to its skeleton, adds
the tack (saddle, saddle cloth, stirrups, bridle, reins) and a caparison
for barded horses, makes three levels of detail and writes the textures:
the coat in grey with a mask of the white markings (the game tints it by
the horse's colour) and the hair of the mane and tail.

Meshes: Horse_LOD<n> (the horse with saddle and bridle) and
Piece_Cloth_LOD<n> / Piece_Barding_LOD<n> (saddle cloth, or caparison and
chanfron), which the game joins into one mesh like the soldiers' outfits.
The armature's extras hold what the game's gait and rider need: the tails of
the bones (the hooves), the seat of the saddle and the stirrups.
"""
import argparse
import json
import math
import os
import sys
import urllib.request

import bpy  # noqa: I001
import bmesh
from mathutils import Matrix, Vector
from mathutils.bvhtree import BVHTree

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_soldier as bs  # noqa: E402

URL = 'https://opengameart.org/sites/default/files/riggedHorse.blend'
SCALE = 0.185  # model units -> metres (withers about 1.6 m)
SADDLE_Y = -2.2  # where the saddle sits along the back (model units, -Y is forward)
# the tread of the stirrups (metres: out to the side, along the back, up)
STIRRUP = (0.37, -0.16, 0.93)
POMMEL_Y = -0.28  # where the reins lie on the saddle

PARTS = ['Coat', 'Mane', 'Eyes', 'Saddle', 'Tack', 'Iron', 'Cloth', 'Barding', 'Chanfron']
PART_IDS = {n: i for i, n in enumerate(PARTS)}
# unique texture layers of the horse: coat (grey, alpha = white markings) and hair
LAYERS = ['coat', 'mane']
PART_LAYERS = {'Coat': 'coat', 'Mane': 'mane'}
CARDS = {'Mane'}
LAYER_SIZE = 1024


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('--out', default='assets/characters/horse.glb')
    p.add_argument('--cache', default=os.path.join(os.path.expanduser('~'), '.cache', 'makehuman-assets'))
    p.add_argument('--lod1', type=float, default=0.35)
    p.add_argument('--lod2', type=float, default=0.12)
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
    return p.parse_args(argv)


def fetch(cache):
    path = os.path.join(cache, 'riggedHorse.blend')
    if not os.path.exists(path):
        os.makedirs(cache, exist_ok=True)
        print('downloading', URL)
        req = urllib.request.Request(URL, headers={'User-Agent': 'moubla-build'})
        with urllib.request.urlopen(req) as r, open(path, 'wb') as f:
            f.write(r.read())
    return path


def world_bbox(o):
    ws = [o.matrix_world @ v.co for v in o.data.vertices]
    return (Vector((min(p.x for p in ws), min(p.y for p in ws), min(p.z for p in ws))),
            Vector((max(p.x for p in ws), max(p.y for p in ws), max(p.z for p in ws))))


# ---------------------------------------------------------------------------
# The horse
# ---------------------------------------------------------------------------

def load(path):
    bpy.ops.wm.open_mainfile(filepath=path)
    # (saved in pose mode) the rest pose, in object mode
    bpy.ops.pose.select_all(action='SELECT')
    bpy.ops.pose.transforms_clear()
    bpy.ops.object.mode_set(mode='OBJECT')
    for o in list(bpy.data.objects):
        if o.type in ('CAMERA', 'LIGHT'):
            bpy.data.objects.remove(o)
    arm = bpy.data.objects['Armature']
    body = bpy.data.objects['Plane']
    hair = [o for o in bpy.data.objects if o.type == 'MESH' and o.name.startswith('BezierCurve')]
    eyes = [o for o in bpy.data.objects if o.type == 'MESH' and o.name.startswith('Sphere')]
    # the lowest point of the hooves
    hoof = world_bbox(body)[0].z
    # scale to metres with the saddle point at the origin and the hooves at z = 0
    m = Matrix.Scale(SCALE, 4) @ Matrix.Translation(Vector((0.0, -SADDLE_Y, -hoof)))
    for o in [body] + hair + eyes:
        mw = o.matrix_world.copy()
        o.parent = None
        o.matrix_world = mw
    for o in [arm, body] + hair + eyes:
        o.matrix_world = m @ o.matrix_world
    bpy.ops.object.select_all(action='DESELECT')
    for o in [arm, body] + hair + eyes:
        o.select_set(True)
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    for o in [body] + hair + eyes:
        o.data.validate()
    return arm, body, hair, eyes


def subdivide(obj):
    """One level of subdivision: rounder than the low-poly original (the
    levels of detail thin it out again)."""
    mod = obj.modifiers.new('Subsurf', 'SUBSURF')
    mod.levels = 1
    mod.uv_smooth = 'PRESERVE_BOUNDARIES'
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_move_to_index(modifier=mod.name, index=0)
    bpy.ops.object.modifier_apply(modifier=mod.name)


def rename_bones(arm):
    """Readable bone names; the horse faces -Y, so its left side is +X."""
    names = {'Bone': 'spine', 'Bone.001': 'neck', 'Bone.002': 'head', 'Bone.003': 'tail_1', 'Bone.004': 'tail_2'}
    for b in arm.data.bones:
        side = 'l' if b.tail_local.x > 0 else 'r'
        if b.name.startswith('Bone.001_'):
            names[b.name] = 'ear_' + side
        elif b.name.startswith(('Bone_L', 'Bone_R')):
            k = {'': 1, '.001': 2, '.002': 3, '.003': 1, '.004': 2, '.005': 3}[b.name[6:]]
            front = b.name[6:] in ('', '.001', '.002')
            names[b.name] = f"{'front' if front else 'hind'}_{side}_{k}"
    for old, new in names.items():
        arm.data.bones[old].name = new
    # one root for everything, at the hips: the game moves and tilts it
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.mode_set(mode='EDIT')
    eb = arm.data.edit_bones
    hip = eb['spine'].head.copy()
    root = eb.new('root')
    root.head = hip
    root.tail = hip + Vector((0, 0, 0.2))
    for n in ('spine', 'hind_l_1', 'hind_r_1', 'tail_1'):
        eb[n].parent = root
    bpy.ops.object.mode_set(mode='OBJECT')


def skin_to_body(obj, body, arm):
    """Weights from the nearest skin of the body (mane, tail)."""
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    for g in body.vertex_groups:
        if g.name not in obj.vertex_groups:
            obj.vertex_groups.new(name=g.name)
    mod = obj.modifiers.new('weights', 'DATA_TRANSFER')
    mod.object = body
    mod.use_vert_data = True
    mod.data_types_verts = {'VGROUP_WEIGHTS'}
    mod.vert_mapping = 'POLYINTERP_NEAREST'
    mod.layers_vgroup_select_src = 'ALL'
    mod.layers_vgroup_select_dst = 'NAME'
    bpy.ops.object.modifier_apply(modifier=mod.name)
    add_armature(obj, arm)


def tail_weights(obj, arm):
    """The hair of the tail (behind the rump) follows the tail bones only:
    the nearest skin would be the hind legs'."""
    t1, t2 = arm.data.bones['tail_1'], arm.data.bones['tail_2']
    top = t1.tail_local.z
    groups = {g.name: g for g in obj.vertex_groups}
    tail = [v.index for v in obj.data.vertices if v.co.y > t1.head_local.y - 0.2]
    for g in obj.vertex_groups:
        g.remove(tail)
    for i in tail:
        z = obj.data.vertices[i].co.z
        w2 = min(1.0, max(0.0, (top - z) / 0.3))
        groups['tail_1'].add([i], 1 - w2, 'REPLACE')
        groups['tail_2'].add([i], w2, 'REPLACE')


def add_armature(obj, arm):
    obj.parent = arm
    if not any(m.type == 'ARMATURE' for m in obj.modifiers):
        m = obj.modifiers.new('Armature', 'ARMATURE')
        m.object = arm


def rigid(obj, bone):
    for g in list(obj.vertex_groups):
        obj.vertex_groups.remove(g)
    g = obj.vertex_groups.new(name=bone)
    g.add([v.index for v in obj.data.vertices], 1.0, 'REPLACE')


def join(objs, name):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    obj = bpy.context.view_layer.objects.active
    obj.name = obj.data.name = name
    return obj


# ---------------------------------------------------------------------------
# Tack: shells laid over the body by casting rays at it
# ---------------------------------------------------------------------------

class Surface:
    def __init__(self, body):
        bm = bmesh.new()
        bm.from_mesh(body.data)
        self.tree = BVHTree.FromBMesh(bm)
        bm.free()

    def hit(self, origin, direction, dist=3.0):
        loc, normal, _, _ = self.tree.ray_cast(origin, direction, dist)
        return loc, normal


def drape(surf, name, ys, angles, centre, offset, hang=None):
    """A sheet over the body: rows along the body (ys, metres, -Y forward),
    columns round it (angles from the top, radians, + to the left (+X)).
    Each point is where a ray from outside towards the centre line (at height
    centre(y)) meets the body, pushed out by `offset`. With `hang`, columns
    below the widest point drop straight down to z = hang (a skirt)."""
    rows = []
    for y in ys:
        c = Vector((0.0, y, centre(y)))
        row = []
        for a in angles:
            d = Vector((math.sin(a), 0.0, math.cos(a)))
            loc, _ = surf.hit(c + d * 2.0, -d)
            p = (loc if loc is not None else c + d * 0.3) + d * offset
            row.append(p)
        if hang is not None:
            # below the widest point of each side the cloth falls straight
            for side in (1, -1):
                idx = [i for i, a in enumerate(angles) if a * side > 0]
                idx.sort(key=lambda i: abs(angles[i]))
                widest = max(idx, key=lambda i: abs(row[i].x)) if idx else None
                if widest is None:
                    continue
                w = row[widest]
                for i in idx:
                    if abs(angles[i]) > abs(angles[widest]):
                        t = (abs(angles[i]) - abs(angles[widest])) / max(1e-6, (math.pi * 0.62 - abs(angles[widest])))
                        row[i] = Vector((w.x, w.y, w.z + (hang - w.z) * min(1.0, t)))
        rows.append(row)
    return grid_object(name, rows)


def grid_object(name, rows, closed=False):
    bm = bmesh.new()
    vs = [[bm.verts.new(p) for p in row] for row in rows]
    n = len(rows[0])
    for r in range(len(rows) - 1):
        for i in range(n if closed else n - 1):
            j = (i + 1) % n
            bm.faces.new((vs[r][i], vs[r][j], vs[r + 1][j], vs[r + 1][i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    obj = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(obj)
    for p in me.polygons:
        p.use_smooth = True
    return obj


def ring_around(surf, a, b, t, offset, n=16, width=0.022):
    """A strap round the body part between points a and b (a band at t)."""
    axis = (b - a).normalized()
    c = a + (b - a) * t
    side = axis.cross(Vector((0, 0, 1)))
    if side.length < 1e-3:
        side = Vector((1, 0, 0))
    side.normalize()
    up = side.cross(axis).normalized()
    rows = []
    for dz in (-width / 2, width / 2):
        row = []
        for i in range(n):
            ang = 2 * math.pi * i / n
            d = side * math.cos(ang) + up * math.sin(ang)
            loc, _ = surf.hit(c + axis * dz + d * 0.6, -d, 1.0)
            p = (loc if loc is not None else c + d * 0.1) + d * offset
            row.append(p)
        rows.append(row)
    return grid_object('strap', rows, closed=True)


def tube(points, radius, name, seg=5):
    """A thin round strap through points (reins, stirrup leathers)."""
    rows = []
    for i, p in enumerate(points):
        d = (points[min(i + 1, len(points) - 1)] - points[max(i - 1, 0)]).normalized()
        s = d.cross(Vector((0, 0, 1)))
        if s.length < 1e-3:
            s = d.cross(Vector((1, 0, 0)))
        s.normalize()
        u = s.cross(d).normalized()
        rows.append([p + (s * math.cos(2 * math.pi * k / seg) + u * math.sin(2 * math.pi * k / seg)) * radius for k in range(seg)])
    return grid_object(name, rows, closed=True)


def tack(body, arm):
    """Saddle, saddle cloth, stirrups, bridle, reins; caparison."""
    surf = Surface(body)
    bones = arm.data.bones
    spine_top = max(v.co.z for v in body.data.vertices if abs(v.co.y) < 0.05 and abs(v.co.x) < 0.05)
    centre = lambda y: spine_top - 0.28  # noqa: E731
    out = {}

    # saddle cloth: a square blanket over the back and down the sides
    ys = [i * 0.05 for i in range(-7, 8)]
    angles = [math.radians(a) for a in range(-78, 79, 6)]
    out['Cloth'] = drape(surf, 'Cloth', ys, angles, centre, 0.012)

    # saddle: seat, raised pommel and cantle, flaps
    ys = [i * 0.04 for i in range(-6, 7)]
    angles = [math.radians(a) for a in range(-55, 56, 5)]
    seat = drape(surf, 'Saddle', ys, angles, centre, 0.03)
    for v in seat.data.vertices:
        # a high pommel in front and a cantle behind, rounded across the seat
        front = smooth(0.1, 0.24, -v.co.y) * 0.11
        back = smooth(0.12, 0.24, v.co.y) * 0.08
        across = math.cos(min(1.0, abs(v.co.x) / 0.2) * math.pi / 2) ** 2
        v.co.z += (front + back) * across + 0.01
    out['Saddle'] = seat

    # stirrups hanging where the rider's feet go, on leathers from the saddle
    # that lie along the barrel
    iron = []
    straps = []
    stirrups = []
    for side in (1, -1):
        top = Vector((side * 0.2, STIRRUP[1], spine_top - 0.06))
        foot = Vector((side * STIRRUP[0], STIRRUP[1], STIRRUP[2]))
        pts = [top.lerp(foot + Vector((0, 0, 0.05)), i / 8) for i in range(9)]
        straps.append(tube(outside(surf, pts, side, 0.014), 0.009, 'leather'))
        ring = []
        for i in range(12):
            a = 2 * math.pi * i / 12
            ring.append(foot + Vector((0.0, math.cos(a) * 0.06, math.sin(a) * 0.05)))
        iron.append(tube(ring + ring[:1], 0.007, 'stirrup'))
        stirrups.append(foot - Vector((0, 0, 0.05)))

    # bridle: straps round the head (browband/headstall, noseband) and reins
    head = bones['head']
    hh, ht = head.head_local.copy(), head.tail_local.copy()
    for t, off in ((0.08, 0.004), (0.62, 0.004), (0.35, 0.004)):
        straps.append(ring_around(surf, hh, ht, t, off))
    bit = hh.lerp(ht, 0.8)
    neck = bones['neck']
    na, nb = neck.head_local.copy(), neck.tail_local.copy()
    bits = []
    for side in (1, -1):
        mouth = bit + Vector((side * 0.06, 0, -0.02))
        loc, _ = surf.hit(mouth + Vector((side * 0.3, 0, 0)), Vector((-side, 0, 0)), 0.6)
        mouth = (loc or mouth) + Vector((side * 0.008, 0, 0))
        bits.append(tube([mouth + Vector((0, 0.02, 0)), mouth + Vector((0, -0.02, 0))], 0.01, 'bit'))
        # reins: from the bit up the side of the neck to the pommel, lying
        # on the neck below the crest
        pts = [mouth]
        for k in range(1, 8):
            y = nb.y + (POMMEL_Y - nb.y) * k / 8
            loc, _ = surf.hit(Vector((0, y, 3.0)), Vector((0, 0, -1)), 3.0)
            crest = loc.z if loc is not None else spine_top
            pts.append(Vector((side * 0.3, y, crest - 0.14 + 0.06 * k / 8)))
        pts.append(Vector((side * 0.13, POMMEL_Y, spine_top + 0.02)))
        straps.append(tube([pts[0]] + onto(surf, pts[1:], side, 0.012), 0.006, 'rein'))
    out['Tack'] = join(straps, 'Tack')
    # the stirrups hang from the saddle, the bits are in the mouth
    stirrup_irons = join(iron, 'Iron')
    rigid(stirrup_irons, 'spine')
    bit = join(bits, 'Bit')
    rigid(bit, 'head')
    out['Iron'] = join([stirrup_irons, bit], 'Iron')

    # caparison: a cloth from the chest over the rump hanging to the knees,
    # and a cover over the neck (crinet)
    front = min(v.co.y for v in body.data.vertices if v.co.z > 1.0 and abs(v.co.x) < 0.1 and v.co.y > -0.9)
    ys = [front + 0.06 + i * 0.07 for i in range(int((1.2 - front) / 0.07))]
    angles = [math.radians(a) for a in range(-110, 111, 8)]
    barding = drape(surf, 'Barding', ys, angles, centre, 0.04, hang=0.62)
    rows = []
    for k in range(9):
        t = k / 8 * 0.85
        c = na.lerp(nb, t)
        axis = (nb - na).normalized()
        side = Vector((1, 0, 0))
        up = side.cross(axis).normalized()
        row = []
        for i in range(-10, 11):
            ang = math.radians(i * 12)
            d = up * math.cos(ang) + side * math.sin(ang)
            loc, _ = surf.hit(c + d * 0.8, -d, 1.2)
            row.append((loc if loc is not None else c + d * 0.15) + d * 0.03)
        rows.append(row)
    crinet = grid_object('Crinet', rows)
    out['Barding'] = join([barding, crinet], 'Barding')
    # chanfron: a steel plate over the face, from the poll to the nostrils
    rows = []
    axis = (ht - hh).normalized()
    side = Vector((1, 0, 0))
    front = axis.cross(side).normalized()
    if front.y > 0:
        front = -front
    for k in range(8):
        c = hh.lerp(ht, 0.12 + k / 7 * 0.66)
        row = []
        for i in range(-6, 7):
            ang = math.radians(i * 11)
            d = front * math.cos(ang) + side * math.sin(ang)
            loc, _ = surf.hit(c + d * 0.6, -d, 0.9)
            row.append((loc if loc is not None else c + d * 0.1) + d * 0.014)
        rows.append(row)
    out['Chanfron'] = grid_object('Chanfron', rows)

    # thickness: the saddle's leather, the cloths seen from both sides
    for name, width in (('Saddle', 0.04), ('Cloth', 0.008), ('Barding', 0.01), ('Chanfron', 0.004)):
        solidify(out[name], width)
    # weights: the saddle on the back, the chanfron on the head; the straps
    # (bridle on the head, reins from the head to the back) and cloths from
    # the skin under them
    rigid(out['Saddle'], 'spine')
    rigid(out['Chanfron'], 'head')
    for name in ('Cloth', 'Barding', 'Tack'):
        skin_to_body(out[name], body, arm)
    for o in out.values():
        add_armature(o, arm)
    # the seat: the top of the saddle above the saddle point
    bm = bmesh.new()
    bm.from_mesh(seat.data)
    loc, _, _, _ = BVHTree.FromBMesh(bm).ray_cast(Vector((0, 0, 3)), Vector((0, 0, -1)), 5)
    bm.free()
    return out, {'seat': loc, 'stirrups': stirrups}


def solidify(obj, width):
    """Give a sheet a thickness towards the body (closed at the edges)."""
    mod = obj.modifiers.new('Solidify', 'SOLIDIFY')
    mod.thickness = width
    mod.offset = -1
    mod.use_even_offset = True
    mod.use_rim = True
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=mod.name)


def smooth(a, b, x):
    t = min(1.0, max(0.0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


def onto(surf, pts, side, clearance):
    """Move points on the given side (+1: +X) onto the body's surface."""
    out = []
    for p in pts:
        loc, _ = surf.hit(Vector((side * 1.2, p.y, p.z)), Vector((-side, 0, 0)), 1.5)
        out.append(Vector((loc.x + side * clearance, p.y, p.z)) if loc is not None else p)
    return out


def outside(surf, pts, side, clearance):
    """Push points on the given side (+1: +X) out of the body."""
    out = []
    for p in pts:
        loc, _ = surf.hit(Vector((side * 1.2, p.y, p.z)), Vector((-side, 0, 0)), 1.5)
        if loc is not None and (loc.x + side * clearance - p.x) * side > 0:
            p = Vector((loc.x + side * clearance, p.y, p.z))
        out.append(p)
    return out


# ---------------------------------------------------------------------------
# Textures
# ---------------------------------------------------------------------------

def write_textures(tex_dir):
    """Coat (grey, the alpha marks the white markings; its ambient occlusion
    map multiplied in) with its normal map, and mane/tail hair (grey, with
    transparency), from the images packed in the .blend."""
    from PIL import Image, ImageOps
    os.makedirs(tex_dir, exist_ok=True)
    imgs = {os.path.basename(i.filepath): i for i in bpy.data.images if i.packed_file}

    def read(name):
        import io
        return Image.open(io.BytesIO(imgs[name].packed_file.data))

    size = LAYER_SIZE
    coat = read('HorseMain2k00.png').convert('RGB').resize((size, size), Image.LANCZOS)
    hsv = coat.convert('HSV')
    _, sat, val = hsv.split()
    # white markings: bright and unsaturated
    import numpy as np
    s = np.asarray(sat, dtype=np.float32) / 255
    v = np.asarray(val, dtype=np.float32) / 255
    white = np.clip((v - 0.55) / 0.25, 0, 1) * np.clip((0.35 - s) / 0.2, 0, 1)
    # only the blaze and the socks: the other light spots are the sheen of
    # the photographed coat. (Where they are on this texture, 0..1 down and
    # across; the hooves at the ends of the legs are not white.)
    y, x = np.mgrid[0:size, 0:size] / size
    box = lambda x0, x1, y0, y1, e=0.02: (  # noqa: E731
        np.clip((x - x0) / e, 0, 1) * np.clip((x1 - x) / e, 0, 1) * np.clip((y - y0) / e, 0, 1) * np.clip((y1 - y) / e, 0, 1))
    region = np.maximum.reduce([box(0.0, 0.3, 0.42, 0.56), box(0.3, 1.0, 0.09, 0.21), box(0.3, 1.0, 0.79, 0.91)])
    white = white * region
    mask = Image.fromarray((white * 255).astype(np.uint8))
    lum = ImageOps.grayscale(coat)
    arr = np.asarray(lum, dtype=np.float32)
    # the sheen: highlights of the coat pressed down
    m = np.median(arr[white < 0.5])
    arr = np.where((arr > m * 1.25) & (white < 0.5), m * 1.25 + (arr - m * 1.25) * 0.3, arr)
    # the baked occlusion (dark in folds, 1 in the open)
    ao = np.asarray(read('HorseMain2k00AO00.png').convert('L').resize((size, size), Image.LANCZOS), dtype=np.float32)
    ao = np.clip(ao / max(np.percentile(ao[ao > 8], 95), 1), 0, 1)
    arr = arr * (0.55 + 0.45 * ao)
    mean = arr[white < 0.5].mean() if (white < 0.5).any() else arr.mean()
    lum = Image.fromarray(np.clip(arr * (0.8 * 255 / max(mean, 1)), 0, 255).astype(np.uint8))
    files = {}
    grey = Image.merge('RGB', (lum, lum, lum))
    grey.save(os.path.join(tex_dir, 'horse_coat.webp'), 'WEBP', quality=88, method=6)
    mask.save(os.path.join(tex_dir, 'horse_coat_alpha.webp'), 'WEBP', quality=88, method=6)
    files['coat'] = ['horse_coat.webp', 'horse_coat_alpha.webp']
    normal = read('HorseMain2k00Norm00.png').convert('RGB').resize((size, size), Image.LANCZOS)
    normal.save(os.path.join(tex_dir, 'horse_coat_normal.webp'), 'WEBP', quality=90, method=6)
    files['coat_normal'] = ['horse_coat_normal.webp']

    hair = read('Hair12Main2k.png').convert('RGBA').resize((size, size), Image.LANCZOS)
    a = hair.getchannel('A')
    col = ImageOps.grayscale(hair.convert('RGB'))
    arr = np.asarray(col, dtype=np.float32)
    am = np.asarray(a) > 128
    k = 0.8 * 255 / max(arr[am].mean() if am.any() else arr.mean(), 1)
    fill = float(np.clip(arr[am].mean() * k, 0, 255)) if am.any() else 200.0
    arr = np.where(np.asarray(a) > 0, np.clip(arr * k, 0, 255), fill).astype(np.uint8)
    g = Image.fromarray(arr)
    Image.merge('RGB', (g, g, g)).save(os.path.join(tex_dir, 'horse_mane.webp'), 'WEBP', quality=88, method=6)
    a.save(os.path.join(tex_dir, 'horse_mane_alpha.webp'), 'WEBP', quality=88, method=6)
    files['mane'] = ['horse_mane.webp', 'horse_mane_alpha.webp']
    for f in sum(files.values(), []):
        print('texture', f, os.path.getsize(os.path.join(tex_dir, f)), 'bytes')
    return files


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------

def merge(objs, name):
    for o in objs:
        me = o.data
        pid = PART_IDS[o.name.split('_LOD')[0]]
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
        while len(me.uv_layers) > 1:
            me.uv_layers.remove(me.uv_layers[-1])
        if not me.uv_layers:
            me.uv_layers.new(name='UVMap')
        me.uv_layers[0].name = 'UVMap'
        if o.name.split('_LOD')[0] in CARDS:
            import mhassets
            mhassets.double_side(o)
    obj = join(objs, name)
    mat = bpy.data.materials.get('horse') or bpy.data.materials.new('horse')
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    for p in obj.data.polygons:
        p.material_index = 0
    return obj


def build(args):
    path = fetch(args.cache)
    arm, body, hair, eyes = load(path)
    rename_bones(arm)
    body.name = body.data.name = 'Coat'
    subdivide(body)
    # the mane and tail are one part; the eyes follow the head
    mane = join(hair, 'Mane')
    skin_to_body(mane, body, arm)
    tail_weights(mane, arm)
    eye = join(eyes, 'Eyes')
    mod = eye.modifiers.new('Decimate', 'DECIMATE')
    mod.ratio = 0.3
    bpy.context.view_layer.objects.active = eye
    bpy.ops.object.modifier_apply(modifier=mod.name)
    rigid(eye, 'head')
    add_armature(eye, arm)
    add_armature(body, arm)
    parts = {'Coat': body, 'Mane': mane, 'Eyes': eye}
    gear, points = tack(body, arm)
    parts.update(gear)
    for name, obj in parts.items():
        if name not in ('Coat', 'Mane'):
            bs.world_uvs(obj)
        print(f'{name:10s} {bs.tri_count(obj):6d} tris')
    tex_dir = os.path.join(os.path.dirname(os.path.abspath(args.out)), 'textures')
    files = write_textures(tex_dir)
    # ambient occlusion: the horse with its saddle and bridle
    common = ['Coat', 'Mane', 'Eyes', 'Saddle', 'Tack', 'Iron']
    pieces = {'Cloth': ['Cloth'], 'Barding': ['Barding', 'Chanfron']}
    for n, o in parts.items():
        o.hide_render = n not in common
    bs.bake_ao([parts[n] for n in common])
    for piece, names in pieces.items():
        for n, o in parts.items():
            o.hide_render = n not in common + names
        bs.bake_ao([parts[n] for n in names])
    for o in parts.values():
        o.hide_render = False

    # the hair of the mane and tail (two-sided cards) is the heaviest part:
    # thinned more
    ratios = {name: (1.0, args.lod1, args.lod2) for name in parts}
    ratios['Mane'] = (1.0, 0.12, 0.04)
    ratios['Coat'] = (0.5, 0.07, 0.028)  # of the subdivided coat
    levels = {}
    for level in range(3):
        levels[level] = {}
        for name, obj in parts.items():
            if level == 2 and name == 'Eyes':
                continue
            ratio = ratios[name][level]
            lod = f'{name}_LOD{level}'
            if ratio >= 1 or bs.tri_count(obj) < 300:
                levels[level][name] = obj if level == 0 else bs.copy_object(obj, lod)
            else:
                levels[level][name] = bs.decimate(obj, ratio, lod)
    out = {}
    for level, objs in levels.items():
        out[f'Horse_LOD{level}'] = merge([objs[n] for n in common if n in objs], f'Horse_LOD{level}')
        for piece, names in pieces.items():
            out[f'Piece_{piece}_LOD{level}'] = merge([objs[n] for n in names], f'Piece_{piece}_LOD{level}')
    for name, obj in out.items():
        print(f'{name:22s} {bs.tri_count(obj):6d} tris')

    arm['parts'] = PARTS
    arm['part_layers'] = PART_LAYERS
    # points for the game, in glTF axes (x, z, -y)
    gl = lambda v: [round(v.x, 4), round(v.z, 4), round(-v.y, 4)]  # noqa: E731
    arm['bone_tails'] = {b.name: gl(b.tail_local) for b in arm.data.bones}
    arm['seat'] = gl(points['seat'])
    arm['stirrups'] = [gl(p) for p in points['stirrups']]
    with open(os.path.join(tex_dir, 'horse.json'), 'w', encoding='utf-8') as f:
        json.dump({'size': LAYER_SIZE, 'layers': {k: files[k] for k in LAYERS},
                   'normals': {'coat': files['coat_normal'][0]}}, f, indent=1)

    bpy.ops.object.select_all(action='DESELECT')
    arm.select_set(True)
    for obj in out.values():
        obj.select_set(True)
    bpy.context.view_layer.objects.active = arm
    bpy.ops.export_scene.gltf(
        filepath=os.path.abspath(args.out), export_format='GLB', use_selection=True, export_apply=True,
        export_yup=True, export_animations=False, export_skins=True, export_all_influences=False,
        export_vertex_color='ACTIVE', export_normals=True, export_tangents=False, export_texcoords=True,
        export_extras=True, export_attributes=True, export_materials='NONE')
    print('wrote', args.out, os.path.getsize(args.out), 'bytes')


if __name__ == '__main__':
    build(parse_args())
