"""Build the trees of the battles (Blender's Python, headless):

    .venv/bin/python tools/trees/build_trees.py --out assets/trees/trees.glb

Two kinds: a broadleaf tree (oak-like) and a fir, each in a few variants.
The trunk and branches are generated here, at real size, as tubes with the
bark wrapped along them. The crown is made of cards with see-through
textures baked from real foliage (CC0, Poly Haven, downloaded into --cache):
- broadleaf: crops of the crown of "Island Tree 02" (its leaves with their
  twigs), rendered square;
- fir: fronds put together from the twig cards of "Fir Tree 01".
Three levels of detail: the full tree, a lighter one (fewer, bigger cards,
only the big branches) and an impostor (two crossed quads showing the whole
tree, rendered from two sides).

Per kind: one texture atlas (colour + alpha; 8 foliage tiles and the
impostor views, 256 px each) and a bark texture (colour, normal map).
Meshes: Tree_<kind>_<variant>_<Bark|Leaves>_LOD<0|1> and
Tree_<kind>_<variant>_Leaves_LOD2 (the impostor).
"""
import argparse
import json
import math
import os
import random
import sys
import urllib.request

import bpy  # noqa: I001
import bmesh
from mathutils import Quaternion, Vector

API = 'https://api.polyhaven.com/files/'
TILE = 256  # pixels of a tile in the atlas (4 x 4 tiles)
ATLAS = TILE * 4
FOLIAGE_TILES = 8  # slots 0..7; the impostors follow
BARK = 512  # pixels of the bark textures

KINDS = {
    'oak': {'type': 'broadleaf', 'variants': 3, 'height': (10.0, 13.0), 'seed': 11},
    'fir': {'type': 'conifer', 'variants': 3, 'height': (14.0, 18.0), 'seed': 23},
}
# metres of bark one repeat of its texture covers (around, along)
BARK_TILE = {'oak': (0.9, 1.4), 'fir': (0.8, 1.2)}


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('--out', default='assets/trees/trees.glb')
    p.add_argument('--cache', default=os.path.join(os.path.expanduser('~'), '.cache', 'polyhaven-trees'))
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
    return p.parse_args(argv)


# ---------------------------------------------------------------------------
# Sources
# ---------------------------------------------------------------------------

def download(url, path):
    if os.path.exists(path):
        return path
    os.makedirs(os.path.dirname(path), exist_ok=True)
    print('downloading', url)
    req = urllib.request.Request(url, headers={'User-Agent': 'moubla-build'})
    with urllib.request.urlopen(req) as r, open(path + '.part', 'wb') as f:
        f.write(r.read())
    os.replace(path + '.part', path)
    return path


def files(asset):
    with urllib.request.urlopen(urllib.request.Request(API + asset, headers={'User-Agent': 'moubla-build'})) as r:
        return json.load(r)


def fetch(cache):
    """The broadleaf crown (glTF, 1k textures, leaf alpha) and the fir's
    twig and bark textures. Returns local paths."""
    out = {}
    folder = os.path.join(cache, 'island_tree_02')
    gltf = os.path.join(folder, 'island_tree_02.gltf')
    if not os.path.exists(gltf):
        fl = files('island_tree_02')
        g = fl['gltf']['1k']['gltf']
        for rel, entry in g['include'].items():
            download(entry['url'], os.path.join(folder, rel))
        download(fl['leaves_alpha']['1k']['jpg']['url'], os.path.join(folder, 'textures', 'island_tree_02_leaves_alpha_1k.jpg'))
        download(g['url'], gltf)
    out['crown'] = gltf
    out['leaf_alpha'] = os.path.join(folder, 'textures', 'island_tree_02_leaves_alpha_1k.jpg')
    out['leaf_diff'] = os.path.join(folder, 'textures', 'island_tree_02_leaves_diff_1k.jpg')
    out['twig_diff'] = os.path.join(folder, 'textures', 'island_tree_02_branches_diff_1k.jpg')
    out['oak_bark'] = out['twig_diff']
    out['oak_bark_nor'] = os.path.join(folder, 'textures', 'island_tree_02_branches_nor_gl_1k.jpg')
    folder = os.path.join(cache, 'fir_tree_01')
    names = {'fir_twig': 'twig_diff', 'fir_twig_alpha': 'twig_alpha', 'fir_bark': 'bark_diff', 'fir_bark_nor': 'bark_nor_gl'}
    need = {k: os.path.join(folder, f'fir_tree_01_{v}_1k.jpg') for k, v in names.items()}
    if not all(os.path.exists(p) for p in need.values()):
        fl = files('fir_tree_01')
        for k, v in names.items():
            download(fl[v]['1k']['jpg']['url'], need[k])
    out.update(need)
    return out


# ---------------------------------------------------------------------------
# Geometry
# ---------------------------------------------------------------------------

class Mesh:
    """Vertices with per-vertex UV, normal (None: computed) and colour."""

    def __init__(self):
        self.v, self.uv, self.n, self.col, self.f = [], [], [], [], []

    def add(self, p, uv, n=None, col=1.0):
        self.v.append(Vector(p))
        self.uv.append(uv)
        self.n.append(n)
        self.col.append(col)
        return len(self.v) - 1

    def tris(self):
        return len(self.f)

    def to_object(self, name):
        me = bpy.data.meshes.new(name)
        me.from_pydata([tuple(v) for v in self.v], [], self.f)
        uv = me.uv_layers.new(name='UVMap')
        col = me.color_attributes.new('Col', 'FLOAT_COLOR', 'POINT')
        me.color_attributes.active_color = col
        for poly in me.polygons:
            poly.use_smooth = True
            for li in poly.loop_indices:
                uv.data[li].uv = self.uv[me.loops[li].vertex_index]
        for i, c in enumerate(self.col):
            col.data[i].color = (c, c, c, 1.0)
        if all(n is not None for n in self.n):
            me.normals_split_custom_set_from_vertices([tuple(n.normalized()) for n in self.n])
        obj = bpy.data.objects.new(name, me)
        bpy.context.collection.objects.link(obj)
        return obj


def frames(points):
    """Parallel-transport frames along a polyline: (tangent, side, up)."""
    out = []
    t0 = (points[1] - points[0]).normalized()
    side = t0.cross(Vector((0, 0, 1)))
    if side.length < 1e-3:
        side = t0.cross(Vector((1, 0, 0)))
    side.normalize()
    for i in range(len(points)):
        a = points[max(i - 1, 0)]
        b = points[min(i + 1, len(points) - 1)]
        t = (b - a).normalized()
        side = (side - t * side.dot(t))
        if side.length < 1e-4:
            side = t.cross(Vector((0, 0, 1)))
        side.normalize()
        out.append((t, side, t.cross(side).normalized()))
    return out


def tube(m, points, radii, sides, tile, shade=lambda p: 1.0):
    """A tapered tube; UVs: around (whole repeats) and along, in bark tiles."""
    fr = frames(points)
    around = max(1, round(2 * math.pi * max(radii) / tile[0]))
    rows = []
    along = 0.0
    for i, (p, r) in enumerate(zip(points, radii)):
        if i:
            along += (points[i] - points[i - 1]).length
        t, s, u = fr[i]
        row = []
        for k in range(sides + 1):
            a = 2 * math.pi * k / sides
            d = s * math.cos(a) + u * math.sin(a)
            row.append(m.add(p + d * r, (k / sides * around, along / tile[1]), None, shade(p)))
        rows.append(row)
    for i in range(len(rows) - 1):
        for k in range(sides):
            m.f.append((rows[i][k], rows[i][k + 1], rows[i + 1][k + 1]))
            m.f.append((rows[i][k], rows[i + 1][k + 1], rows[i + 1][k]))


def quad(m, center, right, up, uv0, uv1, normal_fn, col):
    """A card: centre, half extents along `right` and `up`; UV rectangle."""
    corners = [(-1, -1), (1, -1), (1, 1), (-1, 1)]
    idx = []
    for cx, cy in corners:
        p = center + right * cx + up * cy
        uv = (uv0[0] + (uv1[0] - uv0[0]) * (cx + 1) / 2, uv0[1] + (uv1[1] - uv0[1]) * (cy + 1) / 2)
        idx.append(m.add(p, uv, normal_fn(p), col))
    m.f.append((idx[0], idx[1], idx[2]))
    m.f.append((idx[0], idx[2], idx[3]))


# Outline of the content of each atlas slot (see outlines()): the cards are
# cut to it, so that the graphics card does not run the leaves' shader over
# the empty corners of the tiles only to throw it away.
SHAPES = {}


def card(m, center, right, up, slot, inset, normal_fn, col):
    """A card showing atlas slot `slot` (inset: the UV margin, as in
    tile_rect), cut to the slot's outline (a square without one)."""
    uv0, uv1 = tile_rect(slot, inset)
    idx = []
    for s, t in SHAPES.get(slot, [(0, 0), (1, 0), (1, 1), (0, 1)]):
        cx = max(-1.0, min(1.0, 2 * (s - inset) / (1 - 2 * inset) - 1))
        cy = max(-1.0, min(1.0, 2 * (t - inset) / (1 - 2 * inset) - 1))
        p = center + right * cx + up * cy
        uv = (uv0[0] + (uv1[0] - uv0[0]) * (cx + 1) / 2, uv0[1] + (uv1[1] - uv0[1]) * (cy + 1) / 2)
        idx.append(m.add(p, uv, normal_fn(p), col))
    for k in range(1, len(idx) - 1):
        m.f.append((idx[0], idx[k], idx[k + 1]))


def outlines(alpha_path, slots, threshold=0.2, pad=3):
    """For each slot: the 8-sided outline (axis-aligned and diagonal sides,
    counter-clockwise, tile coordinates with t up) around the texels whose
    alpha is above `threshold` (raised far away, see trees.js), `pad` texels
    out."""
    from PIL import Image
    import numpy as np
    alpha = np.asarray(Image.open(alpha_path).convert('L'), dtype=np.float32) / 255
    out = {}
    for slot in slots:
        x0, y0 = (slot % 4) * TILE, (slot // 4) * TILE
        a = alpha[y0:y0 + TILE, x0:x0 + TILE]
        ys, xs = np.nonzero(a > threshold)
        if len(xs) == 0:
            continue
        s = (xs + 0.5) / TILE
        t = 1 - (ys + 0.5) / TILE
        d = pad / TILE
        d2 = d * math.sqrt(2)
        s0, s1, t0, t1 = s.min() - d, s.max() + d, t.min() - d, t.max() + d
        a0, a1 = (s + t).min() - d2, (s + t).max() + d2
        b0, b1 = (s - t).min() - d2, (s - t).max() + d2
        pts = [(a0 - t0, t0), (b1 + t0, t0), (s1, s1 - b1), (s1, a1 - s1),
               (a1 - t1, t1), (b0 + t1, t1), (s0, s0 - b0), (s0, a0 - s0)]
        poly = []
        for ps, pt in pts:
            q = (min(max(ps, s0, 0.0), s1, 1.0), min(max(pt, t0, 0.0), t1, 1.0))
            if not poly or abs(q[0] - poly[-1][0]) + abs(q[1] - poly[-1][1]) > 1e-4:
                poly.append(q)
        if len(poly) > 2 and abs(poly[0][0] - poly[-1][0]) + abs(poly[0][1] - poly[-1][1]) <= 1e-4:
            poly.pop()
        out[slot] = poly
    return out


def tile_rect(slot, inset=0.0):
    """UV rectangle of atlas slot (row-major from the top-left, glTF UVs
    with v up)."""
    cx, cy = slot % 4, slot // 4
    u0 = cx / 4 + inset / 4
    u1 = (cx + 1) / 4 - inset / 4
    v1 = 1 - cy / 4 - inset / 4
    v0 = 1 - (cy + 1) / 4 + inset / 4
    return (u0, v0), (u1, v1)


def bend(a, b, sag, n):
    """Points from a to b along a curve sagging by `sag` (a vector)."""
    return [a.lerp(b, i / n) + sag * (4 * (i / n) * (1 - i / n)) for i in range(n + 1)]


# ---------------------------------------------------------------------------
# Broadleaf tree
# ---------------------------------------------------------------------------

def broadleaf(rng, H, tile):
    """Trunk, limbs, branches (tubes) and leaf clumps (anchors)."""
    r0 = 0.024 * H + rng.uniform(0, 0.04)
    base = rng.uniform(0.2, 0.28) * H
    R = rng.uniform(0.42, 0.5) * H
    centre = Vector((0, 0, base + (H - base) * 0.52))
    half = Vector((R, R, (H - base) * 0.55))
    lean = Vector((rng.uniform(-1, 1), rng.uniform(-1, 1), 0)) * 0.04 * H
    trunk = [Vector((0, 0, 0))]
    for i in range(1, 9):
        z = i / 8 * H * 0.78
        trunk.append(Vector((rng.uniform(-0.12, 0.12), rng.uniform(-0.12, 0.12), z)) + lean * (z / H) ** 1.5)
    trunk_r = [r0 * (1.25 if i == 0 else 1) * (1 - 0.6 * i / 8) for i in range(9)]

    def on_trunk(z):
        k = min(7, int(z / (H * 0.78) * 8))
        t = z / (H * 0.78) * 8 - k
        return trunk[k].lerp(trunk[k + 1], t), trunk_r[k] + (trunk_r[k + 1] - trunk_r[k]) * t

    limbs, branches, anchors = [], [], []
    n = rng.randint(7, 9)
    for i in range(n):
        z = base + (H * 0.72 - base) * (i + rng.uniform(0, 0.7)) / n
        start, rs = on_trunk(z)
        az = i * 2.39996 + rng.uniform(-0.35, 0.35)
        out = rng.uniform(0.75, 1.0)
        target = centre + Vector((math.cos(az) * half.x * out, math.sin(az) * half.y * out, rng.uniform(-0.05, 0.75) * half.z))
        pts = bend(start, target, Vector((0, 0, rng.uniform(0.3, 0.9))), 5)
        limbs.append((pts, rs * 0.62, 0.05))
    # the leader: the trunk going on into the crown
    top = trunk[-1] + Vector((rng.uniform(-0.4, 0.4), rng.uniform(-0.4, 0.4), H * 0.2))
    limbs.append((bend(trunk[-1], top, Vector((0.2, 0, 0)), 4), trunk_r[-1], 0.04))
    for pts, r1, r2 in limbs:
        length = sum((pts[i + 1] - pts[i]).length for i in range(len(pts) - 1))
        m = rng.randint(6, 9)
        for j in range(m):
            t = rng.uniform(0.3, 0.95)
            k = min(len(pts) - 2, int(t * (len(pts) - 1)))
            p = pts[k].lerp(pts[k + 1], t * (len(pts) - 1) - k)
            d = (pts[k + 1] - pts[k]).normalized()
            axis = d.cross(Vector((rng.uniform(-1, 1), rng.uniform(-1, 1), rng.uniform(-1, 1)))).normalized()
            d = Quaternion(axis, math.radians(rng.uniform(35, 65))) @ d
            d.z += 0.25
            d.normalize()
            L = rng.uniform(0.28, 0.48) * min(R, length)
            end = p + d * L
            # keep it in the crown
            rel = Vector(((end.x - centre.x) / half.x, (end.y - centre.y) / half.y, (end.z - centre.z) / half.z))
            if rel.length > 1.05:
                end = centre + Vector((rel.x * half.x, rel.y * half.y, rel.z * half.z)) * (1.05 / rel.length)
            bpts = bend(p, end, Vector((0, 0, -0.08 * L)), 3)
            rr = r1 * (1 - 0.6 * t) * 0.5
            branches.append((bpts, max(0.02, rr), 0.008))
            for s in (0.55, 1.0):
                q = bpts[0].lerp(bpts[-1], s) + Vector((0, 0, -0.08 * L * 4 * s * (1 - s)))
                anchors.append(q)
        for s in (0.82, 1.0):
            anchors.append(pts[0].lerp(pts[-1], s))
    # and clumps filling the outer part of the crown between the branches,
    # so that it reads as one mass of leaves
    for _ in range(len(anchors) // 3):
        d = Vector((rng.gauss(0, 1), rng.gauss(0, 1), rng.gauss(0, 1))).normalized() * rng.uniform(0.55, 0.95)
        anchors.append(centre + Vector((d.x * half.x, d.y * half.y, d.z * half.z)))
    return {
        'trunk': (trunk, trunk_r), 'limbs': limbs, 'branches': branches, 'anchors': anchors,
        'centre': centre, 'half': half, 'height': H, 'radius': R,
    }


def broadleaf_meshes(rng, tree, tile, level):
    """Bark and leaves of a level of detail (0 full, 1 lighter)."""
    bark = Mesh()
    leaves = Mesh()
    trunk, trunk_r = tree['trunk']
    shade = lambda p: 0.75 + 0.25 * min(1.0, p.z / 2.0)  # noqa: E731  (darker at the foot)
    tube(bark, trunk, trunk_r, 10 if level == 0 else 6, tile, shade)
    for pts, r1, r2 in tree['limbs']:
        radii = [r1 + (r2 - r1) * i / (len(pts) - 1) for i in range(len(pts))]
        tube(bark, pts, radii, 7 if level == 0 else 4, tile)
    if level == 0:
        for pts, r1, r2 in tree['branches']:
            tube(bark, pts, [r1, (r1 + r2) / 2, (r1 + r2) / 3, r2], 4, tile)
    centre, half = tree['centre'], tree['half']
    anchors = list(tree['anchors'])
    # one card per clump, turned and tilted at random: about four cards on
    # top of each other across the crown (the gaps of one show the next)
    size = (0.75, 1.0)
    if level == 1:
        anchors = merge(anchors, max(20, len(anchors) // 3), rng)
        size = (1.25, 1.55)

    def normal(p):
        # leaves lit as one soft volume: normals point out of the crown
        d = Vector(((p.x - centre.x) / half.x, (p.y - centre.y) / half.y, (p.z - centre.z) / half.z + 0.35))
        return d.normalized()

    for a in anchors:
        rel = Vector(((a.x - centre.x) / half.x, (a.y - centre.y) / half.y, (a.z - centre.z) / half.z))
        # deeper in the crown and lower: darker
        ao = 0.55 + 0.45 * min(1.0, rel.length) * (0.75 + 0.25 * max(-1.0, min(1.0, rel.z)))
        s = rng.uniform(*size)
        ang = rng.uniform(0, math.pi)
        right = Vector((math.cos(ang), math.sin(ang), 0)) * s
        tilt = rng.uniform(-0.6, 0.6)
        up = Vector((-math.sin(ang) * tilt, math.cos(ang) * tilt, 1)).normalized() * s
        card(leaves, a, right, up, rng.randrange(FOLIAGE_TILES), 0.02, normal, ao)
    return bark, leaves


def merge(points, k, rng):
    """k-means: k representative points of `points`."""
    cent = rng.sample(points, k)
    for _ in range(12):
        groups = [[] for _ in cent]
        for p in points:
            j = min(range(len(cent)), key=lambda i: (p - cent[i]).length_squared)
            groups[j].append(p)
        cent = [sum(g, Vector()) / len(g) if g else cent[i] for i, g in enumerate(groups)]
    return cent


# ---------------------------------------------------------------------------
# Fir
# ---------------------------------------------------------------------------

def conifer(rng, H, tile):
    r0 = 0.012 * H + rng.uniform(0, 0.02)
    first = rng.uniform(1.4, 2.4)
    R = rng.uniform(0.21, 0.26) * H
    lean = Vector((rng.uniform(-1, 1), rng.uniform(-1, 1), 0)) * 0.015 * H
    trunk = [Vector((0, 0, 0)) + lean * (i / 10) ** 2 + Vector((0, 0, H * i / 10)) for i in range(11)]
    trunk_r = [r0 * (1.2 if i == 0 else 1) * (1 - 0.92 * i / 10) for i in range(11)]
    branches = []
    h = first
    az0 = rng.uniform(0, 6.28)
    while h < H - 0.5:
        rel = (H - h) / (H - first)
        k = rng.randint(5, 7)
        az0 += rng.uniform(0.4, 1.0)
        for j in range(k):
            az = az0 + j * 2 * math.pi / k + rng.uniform(-0.2, 0.2)
            L = max(0.35, R * rel ** 0.85 * rng.uniform(0.85, 1.1))
            d = Vector((math.cos(az), math.sin(az), 0))
            start = Vector((lean.x * (h / H) ** 2, lean.y * (h / H) ** 2, h))
            droop = 0.18 + 0.12 * (1 - rel)
            end = start + d * L + Vector((0, 0, -droop * L + 0.12 * L * (1 - rel)))
            branches.append((start, end, L, rel))
        h += rng.uniform(0.4, 0.55)
    return {'trunk': (trunk, trunk_r), 'branches': branches, 'height': H, 'radius': R}


def conifer_meshes(rng, tree, tile, level):
    bark = Mesh()
    leaves = Mesh()
    trunk, trunk_r = tree['trunk']
    tube(bark, trunk, trunk_r, 9 if level == 0 else 5, tile, lambda p: 0.75 + 0.25 * min(1.0, p.z / 2.0))
    H, R = tree['height'], tree['radius']
    branches = tree['branches'] if level == 0 else tree['branches'][::2]
    grow = 1.0 if level == 0 else 1.3

    def normal(p):
        d = Vector((p.x, p.y, 0))
        return (d.normalized() * 0.8 + Vector((0, 0, 0.6))).normalized() if d.length > 1e-3 else Vector((0, 0, 1))

    for start, end, L, rel in branches:
        d = (end - start)
        along = d.normalized()
        side = along.cross(Vector((0, 0, 1))).normalized()
        mid = start.lerp(end, 0.55)
        ao = 0.6 + 0.4 * (1 - rel) ** 0.5
        half_len = d.length * 0.55 * grow
        half_w = max(0.18, d.length * 0.32) * grow
        slot = rng.randrange(FOLIAGE_TILES)
        # a flat frond and a steep one (seen from the side); the lighter
        # level: one, half way
        tilts = (rng.uniform(-0.35, -0.15), rng.uniform(0.9, 1.3)) if level == 0 else (rng.uniform(0.45, 0.7),)
        for tilt in tilts:
            # the frond flat along the branch, then turned about it
            w = (side * math.cos(tilt) + Vector((0, 0, 1)) * math.sin(tilt)).normalized()
            card(leaves, mid, along * half_len, w * half_w, slot, 0.02, normal, ao)
    return bark, leaves


# ---------------------------------------------------------------------------
# Rendering (Cycles, transparent film, soft white light from all around:
# the colour with the shade of the leaves on each other, not lit by a sun)
# ---------------------------------------------------------------------------

def setup_render(res):
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = 48
    sc.cycles.use_denoising = False
    sc.render.film_transparent = True
    sc.render.resolution_x = res
    sc.render.resolution_y = res
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    sc.view_settings.view_transform = 'Standard'
    sc.view_settings.look = 'None'
    if sc.world is None:
        sc.world = bpy.data.worlds.new('World')
    sc.world.use_nodes = True
    bg = sc.world.node_tree.nodes.get('Background')
    bg.inputs[0].default_value = (1, 1, 1, 1)
    bg.inputs[1].default_value = 1.0


def image_material(name, color_path, alpha_path=None, alpha_channel=False, flat=False):
    """Diffuse material from an image; see-through by an alpha image (its
    red channel) or the image's own alpha. flat: unlit, the image's colour
    times the mesh's 'Col' (its baked shade) - the game lights it."""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    tex = nt.nodes.new('ShaderNodeTexImage')
    tex.image = bpy.data.images.load(color_path, check_existing=True)
    if flat:
        diff = nt.nodes.new('ShaderNodeEmission')
        shade = nt.nodes.new('ShaderNodeAttribute')
        shade.attribute_name = 'Col'
        mul = nt.nodes.new('ShaderNodeVectorMath')
        mul.operation = 'MULTIPLY'
        nt.links.new(tex.outputs['Color'], mul.inputs[0])
        nt.links.new(shade.outputs['Color'], mul.inputs[1])
        nt.links.new(mul.outputs['Vector'], diff.inputs['Color'])
    else:
        diff = nt.nodes.new('ShaderNodeBsdfDiffuse')
        nt.links.new(tex.outputs['Color'], diff.inputs['Color'])
    if alpha_path or alpha_channel:
        mix = nt.nodes.new('ShaderNodeMixShader')
        tr = nt.nodes.new('ShaderNodeBsdfTransparent')
        if alpha_path:
            at = nt.nodes.new('ShaderNodeTexImage')
            at.image = bpy.data.images.load(alpha_path, check_existing=True)
            at.image.colorspace_settings.name = 'Non-Color'
            nt.links.new(at.outputs['Color'], mix.inputs['Fac'])
        else:
            nt.links.new(tex.outputs['Alpha'], mix.inputs['Fac'])
        nt.links.new(tr.outputs[0], mix.inputs[1])
        nt.links.new(diff.outputs[0], mix.inputs[2])
        nt.links.new(mix.outputs[0], out.inputs['Surface'])
    else:
        nt.links.new(diff.outputs[0], out.inputs['Surface'])
    return mat


def ortho_camera(location, look_at, scale, clip=None):
    cam = bpy.data.cameras.new('cam')
    cam.type = 'ORTHO'
    cam.ortho_scale = scale
    if clip:
        cam.clip_start, cam.clip_end = clip
    else:
        cam.clip_start, cam.clip_end = 0.01, 500
    obj = bpy.data.objects.new('cam', cam)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    d = (Vector(look_at) - Vector(location)).normalized()
    obj.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    bpy.context.scene.camera = obj
    return obj


def render(path):
    bpy.context.scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
    return path


def clear_scene():
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o)


# ---------------------------------------------------------------------------
# Foliage tiles
# ---------------------------------------------------------------------------

def broadleaf_tiles(src, work, rng):
    """Square crops of a real crown (leaves with their twigs), seen from the
    side, faded out towards the edge: the clumps of the broadleaf cards."""
    clear_scene()
    bpy.ops.import_scene.gltf(filepath=src['crown'])
    tree = [o for o in bpy.data.objects if o.type == 'MESH'][0]
    leaves_mat = image_material('leaves', src['leaf_diff'], src['leaf_alpha'])
    twig_mat = image_material('twigs', src['twig_diff'])
    # the trunk is not part of the clumps
    hidden = bpy.data.materials.new('hidden')
    hidden.use_nodes = True
    hidden.node_tree.nodes.clear()
    hout = hidden.node_tree.nodes.new('ShaderNodeOutputMaterial')
    htr = hidden.node_tree.nodes.new('ShaderNodeBsdfTransparent')
    hidden.node_tree.links.new(htr.outputs[0], hout.inputs['Surface'])
    for i, m in enumerate(tree.data.materials):
        tree.data.materials[i] = leaves_mat if 'leaves' in m.name else twig_mat if 'branches' in m.name else hidden
    setup_render(TILE * 2)
    # clump centres: leaves on the outside of the crown
    me = tree.data
    leaf_idx = [i for i, m in enumerate(tree.data.materials) if m == leaves_mat]
    pts = [tree.matrix_world @ p.center for p in me.polygons if p.material_index in leaf_idx]
    c = sum(pts[::50], Vector()) / len(pts[::50])
    outer = sorted(pts[::40], key=lambda p: -(p - c).length)[: len(pts[::40]) // 2]
    # where the leaves are densest
    dense = sorted(outer, key=lambda p: -sum(1 for q in outer if (q - p).length_squared < 0.16))[: len(outer) // 4]
    paths = []
    r = 0.5
    depth = 0.8  # a slab of the crown this deep (each way): many leaves on top of each other
    tries = 0
    while len(paths) < FOLIAGE_TILES:
        p = rng.choice(dense if tries % 2 else outer)
        out = Vector((p.x - c.x, p.y - c.y, 0)).normalized()
        cam = ortho_camera(p + out * 5, p, 2 * r, (5 - depth, 5 + depth))
        path = render(os.path.join(work, f'leaf_{len(paths)}.png'))
        bpy.data.objects.remove(cam)
        tries += 1
        # neither a solid disc of leaves nor a few twigs (the last tries take anything)
        if 0.35 <= coverage(path) <= 0.65 or tries > 60:
            paths.append(path)
    return paths


def coverage(path):
    """Share of the inner disc of a rendered tile that is leaves."""
    from PIL import Image
    import numpy as np
    a = np.asarray(Image.open(path).convert('RGBA').split()[3], dtype=np.float32) / 255
    n = a.shape[0]
    y, x = np.mgrid[0:n, 0:n]
    inner = (x - n / 2) ** 2 + (y - n / 2) ** 2 < (n * 0.4) ** 2
    return float((a[inner] > 0.5).mean())


def fir_tiles(src, work, rng):
    """Fronds of a fir: twig cards (cut out of the twig texture) along a
    stem, seen from above."""
    from PIL import Image
    clear_scene()
    alpha = Image.open(src['fir_twig_alpha']).convert('L')
    rects = components(alpha)
    twig_mat = image_material('twig', src['fir_twig'], src['fir_twig_alpha'])
    setup_render(TILE * 2)
    paths = []
    W, Hh = alpha.size
    for k in range(FOLIAGE_TILES):
        m = Mesh()
        n = rng.randint(14, 20)
        for i in range(n):
            t = i / (n - 1)
            x = -0.5 + t * 0.95
            side = 1 if i % 2 else -1
            x0, y0, x1, y1 = rng.choice(rects)
            aspect = (y1 - y0) / max(1, x1 - x0)
            length = (0.42 - 0.22 * t) * rng.uniform(0.85, 1.15)
            ang = math.radians(rng.uniform(30, 55)) * side
            d = Vector((math.cos(ang), math.sin(ang), 0))
            right = d.cross(Vector((0, 0, 1))) * (length / aspect / 2)
            centre = Vector((x, 0, rng.uniform(-0.02, 0.02))) + d * length / 2
            uv0 = (x0 / W, 1 - y1 / Hh)
            uv1 = (x1 / W, 1 - y0 / Hh)
            # the twig image stands up (its stem at the bottom): along d
            quad(m, centre, right, d * length / 2, uv0, uv1, lambda p: Vector((0, 0, 1)), 1.0)
        # the tip
        x0, y0, x1, y1 = rng.choice(rects)
        aspect = (y1 - y0) / max(1, x1 - x0)
        quad(m, Vector((0.55, 0, 0)), Vector((0, -1, 0)) * (0.22 / aspect), Vector((1, 0, 0)) * 0.22, (x0 / W, 1 - y1 / Hh), (x1 / W, 1 - y0 / Hh), lambda p: Vector((0, 0, 1)), 1.0)
        obj = m.to_object('frond')
        obj.data.materials.append(twig_mat)
        stem = Mesh()
        tube(stem, [Vector((-0.55, 0, 0)), Vector((0.62, 0, 0))], [0.012, 0.004], 5, (0.1, 0.5))
        sobj = stem.to_object('stem')
        sobj.data.materials.append(image_material('stem', src['fir_bark']))
        cam = ortho_camera(Vector((0.04, 0, 5)), Vector((0.04, 0, 0)), 1.3)
        paths.append(render(os.path.join(work, f'fir_{k}.png')))
        for o in (obj, sobj, cam):
            bpy.data.objects.remove(o)
    return paths


def components(alpha):
    """Bounding boxes (pixels) of the separate twigs of an alpha image."""
    small = alpha.resize((128, 128))
    px = small.load()
    seen = set()
    boxes = []
    sx = alpha.size[0] / 128
    sy = alpha.size[1] / 128
    for y in range(128):
        for x in range(128):
            if (x, y) in seen or px[x, y] < 128:
                continue
            stack = [(x, y)]
            seen.add((x, y))
            xs, ys = [], []
            while stack:
                a, b = stack.pop()
                xs.append(a)
                ys.append(b)
                for da, db in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    q = (a + da, b + db)
                    if 0 <= q[0] < 128 and 0 <= q[1] < 128 and q not in seen and px[q] >= 128:
                        seen.add(q)
                        stack.append(q)
            # the twigs: big enough, not the strips of bark at the bottom
            if len(xs) > 60 and max(ys) < 100:
                boxes.append((int(min(xs) * sx), int(min(ys) * sy), int((max(xs) + 1) * sx), int((max(ys) + 1) * sy)))
    return boxes


# ---------------------------------------------------------------------------
# Atlas
# ---------------------------------------------------------------------------

def atlas(tiles, impostors, out_dir, kind):
    """One RGB image and one alpha image: foliage tiles in slots 0..7, the
    impostor views after them. The foliage fades out towards its edge."""
    from PIL import Image, ImageDraw, ImageFilter
    color = Image.new('RGB', (ATLAS, ATLAS), (60, 70, 40))
    alpha = Image.new('L', (ATLAS, ATLAS), 0)
    import numpy as np
    disc = Image.new('L', (TILE, TILE), 0)
    ImageDraw.Draw(disc).ellipse((TILE * 0.06, TILE * 0.06, TILE * 0.94, TILE * 0.94), fill=255)
    disc = np.asarray(disc.filter(ImageFilter.GaussianBlur(TILE * 0.06)), dtype=np.float32) / 255
    noise = np.random.default_rng(5)
    for slot, path in enumerate(tiles + impostors):
        im = Image.open(path).convert('RGBA').resize((TILE, TILE), Image.LANCZOS)
        r, g, b, a = im.split()
        if slot < FOLIAGE_TILES and kind == 'oak':
            # faded out towards a ragged edge (no round outline of the card)
            blobs = Image.fromarray((noise.random((TILE, TILE)) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(TILE * 0.03))
            blobs = np.asarray(blobs, dtype=np.float32) / 255
            blobs = (blobs - blobs.mean()) / (blobs.std() + 1e-6)
            fade = np.clip(disc * 1.25 + blobs * 0.22 - 0.12, 0, 1)
            # and nothing beyond 0.46 of the tile from its middle: the card is
            # cut to an octagon around that (see outlines())
            yy, xx = np.mgrid[0:TILE, 0:TILE]
            rad = np.hypot(xx + 0.5 - TILE / 2, yy + 0.5 - TILE / 2) / TILE
            fade *= np.clip((0.46 - rad) / 0.04, 0, 1)
            a = Image.fromarray((np.asarray(a, dtype=np.float32) * fade).astype(np.uint8))
        # colour bleeds under the transparent parts (no dark fringes)
        rgb = Image.merge('RGB', (r, g, b))
        solid = a.point(lambda v: 255 if v > 40 else 0)
        bleed = rgb.filter(ImageFilter.BoxBlur(6))
        rgb = Image.composite(rgb, bleed, solid)
        x, y = (slot % 4) * TILE, (slot // 4) * TILE
        color.paste(rgb, (x, y))
        alpha.paste(a, (x, y))
    files = [f'tree_{kind}.webp', f'tree_{kind}_alpha.webp']
    color.save(os.path.join(out_dir, files[0]), 'WEBP', quality=88, method=6)
    alpha.save(os.path.join(out_dir, files[1]), 'WEBP', quality=90, method=6)
    return files


def bark_texture(src, kind, out_dir):
    from PIL import Image
    files = [f'bark_{kind}.webp', f'bark_{kind}_normal.webp']
    Image.open(src[f'{kind}_bark']).convert('RGB').resize((BARK, BARK), Image.LANCZOS).save(os.path.join(out_dir, files[0]), 'WEBP', quality=85, method=6)
    Image.open(src[f'{kind}_bark_nor']).convert('RGB').resize((BARK, BARK), Image.LANCZOS).save(os.path.join(out_dir, files[1]), 'WEBP', quality=90, method=6)
    return files


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------

def impostor_views(kind, height, width, work, v):
    """The full tree (in the scene) from two sides (0 and 90 degrees), for
    the impostor."""
    S = max(height, width) * 1.04
    paths = []
    for k, ang in enumerate((0.0, math.pi / 2)):
        d = Vector((math.cos(ang), math.sin(ang), 0))
        cam = ortho_camera(d * 60 + Vector((0, 0, S / 2)), Vector((0, 0, S / 2)), S)
        paths.append(render(os.path.join(work, f'{kind}_{v}_view{k}.png')))
        bpy.data.objects.remove(cam)
    return paths


def build(args):
    src = fetch(args.cache)
    out_dir = os.path.dirname(os.path.abspath(args.out))
    tex_dir = os.path.join(out_dir, 'textures')
    work = os.path.join(args.cache, 'work')
    os.makedirs(tex_dir, exist_ok=True)
    os.makedirs(work, exist_ok=True)
    manifest = {'atlasSize': ATLAS, 'barkSize': BARK, 'kinds': {}}
    meshes = []
    for kind, spec in KINDS.items():
        rng = random.Random(spec['seed'])
        tiles = broadleaf_tiles(src, work, rng) if spec['type'] == 'broadleaf' else fir_tiles(src, work, rng)
        # the atlas with the foliage alone first (for rendering the impostors)
        files = atlas(tiles, [], tex_dir, kind)
        SHAPES.clear()
        SHAPES.update(outlines(os.path.join(tex_dir, files[1]), range(FOLIAGE_TILES)))
        from PIL import Image
        png = os.path.join(work, f'{kind}_atlas.png')
        rgb = Image.open(os.path.join(tex_dir, files[0])).convert('RGB')
        a = Image.open(os.path.join(tex_dir, files[1])).convert('L')
        rgb.putalpha(a)
        rgb.save(png)
        clear_scene()
        setup_render(TILE * 2)
        # the impostors show the colour of the tree with the shade baked into
        # its cards and bark, unlit: the game lights them like the cards
        leaf_mat = image_material('leafcards', png, alpha_channel=True, flat=True)
        bark_mat = image_material('bark', src[f'{kind}_bark'], flat=True)
        views = []
        sizes = []
        built = []
        for v in range(spec['variants']):
            H = rng.uniform(*spec['height'])
            if spec['type'] == 'broadleaf':
                tree = broadleaf(rng, H, BARK_TILE[kind])
                make = broadleaf_meshes
            else:
                tree = conifer(rng, H, BARK_TILE[kind])
                make = conifer_meshes
            levels = []
            for level in (0, 1):
                bark, leaves = make(random.Random(spec['seed'] * 100 + v), tree, BARK_TILE[kind], level)
                levels.append((bark, leaves))
            # the impostor views from the full tree
            bobj = levels[0][0].to_object('b')
            bobj.data.materials.append(bark_mat)
            lobj = levels[0][1].to_object('l')
            lobj.data.materials.append(leaf_mat)
            width = 2 * tree['radius'] * 1.05
            views += impostor_views(kind, H * 1.05, width, work, v)
            bpy.data.objects.remove(bobj)
            bpy.data.objects.remove(lobj)
            sizes.append(max(H * 1.05, width) * 1.04)
            built.append(levels)
        files = atlas(tiles, views, tex_dir, kind)
        SHAPES.update(outlines(os.path.join(tex_dir, files[1]), range(FOLIAGE_TILES, FOLIAGE_TILES + len(views))))
        for slot, poly in sorted(SHAPES.items()):
            area = 0.5 * abs(sum(poly[k][0] * poly[k - 1][1] - poly[k - 1][0] * poly[k][1] for k in range(len(poly))))
            print(f'{kind} slot {slot:2d}: outline {len(poly)} sides, {area:.2f} of the tile')
        manifest['kinds'][kind] = {'atlas': files, 'bark': bark_texture(src, kind, tex_dir), 'variants': spec['variants']}
        # the meshes, with the impostor quads
        for v, levels in enumerate(built):
            for level, (bark, leaves) in enumerate(levels):
                meshes.append((f'Tree_{kind}_{v}_Bark_LOD{level}', bark))
                meshes.append((f'Tree_{kind}_{v}_Leaves_LOD{level}', leaves))
            imp = Mesh()
            S = sizes[v]
            for k, ang in enumerate((0.0, math.pi / 2)):
                d = Vector((math.cos(ang), math.sin(ang), 0))
                right = d.cross(Vector((0, 0, 1))) * (-S / 2)
                # lit as one round crown
                centre = Vector((0, 0, S * 0.55))
                card(imp, Vector((0, 0, S / 2)), right, Vector((0, 0, S / 2)), FOLIAGE_TILES + v * 2 + k, 0.0,
                     lambda p, c=centre: ((p - c).normalized() + Vector((0, 0, 0.4))).normalized(), 1.0)
            meshes.append((f'Tree_{kind}_{v}_Leaves_LOD2', imp))
    clear_scene()
    objs = []
    for name, m in meshes:
        print(f'{name:28s} {m.tris():6d} tris')
        obj = m.to_object(name)
        mat = bpy.data.materials.get('tree') or bpy.data.materials.new('tree')
        obj.data.materials.append(mat)
        objs.append(obj)
    with open(os.path.join(tex_dir, 'trees.json'), 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=1)
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.export_scene.gltf(
        filepath=os.path.abspath(args.out), export_format='GLB', use_selection=True, export_yup=True,
        export_animations=False, export_skins=False, export_vertex_color='ACTIVE', export_normals=True,
        export_tangents=False, export_texcoords=True, export_materials='NONE', export_extras=False)
    print('wrote', args.out, os.path.getsize(args.out), 'bytes')


if __name__ == '__main__':
    build(parse_args())
