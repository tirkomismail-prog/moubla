"""Thickness budget for the soldier's garments.

The garments of outfits.py are pushed off the MakeHuman helper shells by a
fixed amount each, so the layers know nothing about each other: a surcoat
would float 2 cm above the mail, a cuirass 3.5 cm above the tunic, sleeves
swell into balloons. This pass re-fits each layer onto the one under it:

* fit (tops and sleeves): the smooth part of the vertex's distance to the
  inner surface is replaced by the budget for its region (torso, shoulder ->
  wrist taper); the fine detail of the shell (sleeve folds, pleats) is kept,
  because only a smoothed offset is applied.
* clear (skirts, hems): vertices only move out, to keep a minimum gap over
  the inner layer (skirts hang free; their size comes from outfits.SKIRTS).
* weights: where an outer layer lies on an inner skirt (surcoat over the
  hauberk skirt, cuirass tassets, the jerkin's hips over the tunic skirt)
  the skin weights are copied from the inner layer, so the two move alike
  and the gap survives the animation.

Gaps are metres from the inner surface; the numbers are real garment
thickness plus a little ease (see BUDGET).
"""
import bmesh
import bpy
from mathutils.bvhtree import BVHTree

import garments as G
import outfits as O

H = None
RIG = None

# inner layer, torso gap, sleeve gap at the shoulder and at the wrist, min gap
BUDGET = {
    'Tunic': ('body', 0.009, 0.010, 0.006, 0.004),
    'Gambeson': ('body', 0.020, 0.017, 0.012, 0.008),
    'Hauberk': ('body', 0.013, 0.011, 0.008, 0.005),
    'Jerkin': (('Tunic',), 0.006, None, None, 0.005),
    'Surcoat': (('Hauberk',), 0.006, None, None, 0.004),
    'Cuirass': (('Tunic', 'Hauberk'), 0.008, None, None, 0.004),
    'Plates': (('Hauberk', 'Hose', 'Boots'), 0.007, None, None, 0.005),
}
# how far the hose is pulled in under the skirts
HOSE_SHRINK = 0.009
# weights copied from the inner layer below this height (belt line)
WEIGHTS_FROM = {'Surcoat': 'Hauberk', 'Cuirass': 'Tunic', 'Jerkin': 'Tunic'}


def tree_of(objs):
    bm = bmesh.new()
    for o in objs:
        bm.from_mesh(o.data)
    bm.normal_update()
    t = BVHTree.FromBMesh(bm)
    bm.free()
    return t


def neighbours(bm):
    return [[e.other_vert(v).index for e in v.link_edges] for v in bm.verts]


def smooth_field(vals, nb, iters, mask=None):
    vals = list(vals)
    for _ in range(iters):
        new = vals[:]
        for i, ns in enumerate(nb):
            if mask is not None and not mask[i]:
                continue
            ns = [j for j in ns if mask is None or mask[j]]
            if ns:
                new[i] = 0.5 * vals[i] + 0.5 * sum(vals[j] for j in ns) / len(ns)
        vals = new
    return vals


def signed(trees, co, strict=False):
    """Distance to the outermost of the inner surfaces (+ = outside). With
    strict, points beyond an open edge of the inner layer (under a hem, past
    a cuff), where the side is not defined, count as far outside."""
    best = None
    for t in trees:
        loc, n, _, dist = t.find_nearest(co, 0.4)
        if loc is None:
            continue
        s = (co - loc).dot(n)
        if strict and abs(s) < 0.8 * dist:
            continue
        # the binding layer is the one this point is least outside of
        best = s if best is None else min(best, s)
    return 0.4 if best is None else best


def is_skirt(obj):
    """Vertices from the skirt helper (reweighted, no helper groups left)."""
    gi = obj.vertex_groups.get('helper-tights')
    if gi is None:
        return [False] * len(obj.data.vertices)
    return [not any(g.group == gi.index for g in v.groups) for v in obj.data.vertices]


def conform(obj, inner_objs, torso, sh, wr, mn, smooth_iters=12, pick=None):
    """pick(v) -> indices of inner_objs that apply to vertex v (default all)."""
    all_trees = [tree_of([o]) for o in inner_objs]
    skirt = is_skirt(obj)
    bidx = H['bone_index'](obj, RIG)
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bm.normal_update()
    bm.verts.ensure_lookup_table()
    dl = bm.verts.layers.deform.active
    nb = neighbours(bm)
    tsel = [[all_trees[k] for k in (pick(v) if pick else range(len(all_trees)))] for v in bm.verts]
    d = [signed(tsel[v.index], v.co) for v in bm.verts]
    ds = smooth_field(d, nb, smooth_iters)
    delta = []
    for i, v in enumerate(bm.verts):
        if skirt[i]:
            delta.append(0.0)  # skirts: clear pass only
            continue
        s = O.arm_pos(v.co, H['dominant_bone'](v, dl, bidx)) if sh is not None else None
        target = torso if s is None else sh + (wr - sh) * s
        # cloth rests on the shoulders and the top of the arms
        target *= 1 - 0.35 * max(0.0, v.normal.z)
        delta.append(target - ds[i])
    delta = smooth_field(delta, nb, 4)
    for i, v in enumerate(bm.verts):
        v.co += v.normal * delta[i]
    # clear pass: nothing closer than `mn` to the inner layer
    for _ in range(2):
        bm.normal_update()
        push = []
        for v in bm.verts:
            s = signed(tsel[v.index], v.co, strict=True)
            push.append(max(0.0, mn - s))
        push = [max(p, q) for p, q in zip(push, smooth_field(push, nb, 2))]
        for v, p in zip(bm.verts, push):
            v.co += v.normal * p
    bm.to_mesh(obj.data)
    bm.free()
    obj.data.update()
    after = [signed(tsel[v.index], v.co) for v in obj.data.vertices]
    return d, after


def copy_weights(obj, src, below):
    """Skin weights of `src` (nearest face, interpolated) for the vertices of
    obj under the height `below`, blended in over 4 cm."""
    mask = obj.vertex_groups.get('conform_mask') or obj.vertex_groups.new(name='conform_mask')
    for v in obj.data.vertices:
        w = max(0.0, min(1.0, (below - v.co.z) / 0.04))
        mask.add([v.index], w, 'REPLACE')
    # every bone group of src must exist on obj
    for g in src.vertex_groups:
        if g.name in RIG.data.bones and g.name not in obj.vertex_groups:
            obj.vertex_groups.new(name=g.name)
    m = obj.modifiers.new('DT', 'DATA_TRANSFER')
    m.object = src
    m.use_vert_data = True
    m.data_types_verts = {'VGROUP_WEIGHTS'}
    m.vert_mapping = 'POLYINTERP_NEAREST'
    m.layers_vgroup_select_src = 'ALL'
    m.layers_vgroup_select_dst = 'NAME'
    m.mix_mode = 'REPLACE'
    m.mix_factor = 1.0
    m.vertex_group = 'conform_mask'
    bpy.context.view_layer.objects.active = obj
    while obj.modifiers[0].name != 'DT':
        bpy.ops.object.modifier_move_up(modifier='DT')
    bpy.ops.object.modifier_apply(modifier='DT')
    obj.vertex_groups.remove(obj.vertex_groups['conform_mask'])


def plates_over(plates):
    """For the Plates (inner layers Hauberk, Hose, Boots): which of them each
    plate lies on, by the bone it follows."""
    names = {g.index: g.name for g in plates.vertex_groups}
    verts = plates.data.vertices

    def pick(v):
        leg = any(names.get(g.group, '').startswith(('calf', 'thigh')) for g in verts[v.index].groups)
        return [1, 2] if leg else [0]
    return pick


def run(out, human, rig, helpers, hose=None, boots=None):
    global H, RIG
    H, RIG = helpers, rig
    body = H['extract'](human, ['body'], 'ConformBody')
    layers = dict(out)
    if hose is not None:
        layers['Hose'] = hose
    if boots is not None:
        layers['Boots'] = boots
    stats = {}
    for name in ('Tunic', 'Gambeson', 'Hauberk', 'Jerkin', 'Surcoat', 'Cuirass', 'Plates'):
        inner, torso, sh, wr, mn = BUDGET[name]
        inner_objs = [body] if inner == 'body' else [layers[n] for n in inner]
        # arm plates over the mail sleeves, leg plates over the hose and boots
        pick = plates_over(out[name]) if name == 'Plates' else None
        before, after = conform(out[name], inner_objs, torso, sh, wr, mn,
                                smooth_iters=40 if name in ('Cuirass', 'Plates') else 12, pick=pick)
        stats[name] = (sorted(before)[len(before) // 2], sorted(after)[len(after) // 2])
        print(f'conform {name:9s} median gap {stats[name][0] * 1000:5.1f} -> {stats[name][1] * 1000:5.1f} mm')
        if name == 'Tunic':
            # cloth sagging over the belt, after the fit (which would flatten
            # it) and before the layers over the tunic are fitted onto it
            O.blouse(out['Tunic'], 0.012)
    for name, src in WEIGHTS_FROM.items():
        copy_weights(out[name], out[src], G.L['belt_top'] - 0.012)
    bpy.data.objects.remove(body)
    return stats


def shrink_hose(hose):
    """The hose under the skirts (every outfit covers the thigh down to the
    gambeson's hem) pulled in towards the bone, so that a thigh lifted in a
    stride does not push through a closer-fitting skirt. Only seen through
    the riding slits. Run after the covered skin has been removed (else the
    skin under it is no longer covered and stays)."""
    lo, hi = G.L['knee'] + 0.21, G.L['belt_top'] - 0.12
    bm = bmesh.new()
    bm.from_mesh(hose.data)
    bm.normal_update()
    for v in bm.verts:
        k = max(0.0, min(1.0, (v.co.z - lo) / 0.06)) * max(0.0, min(1.0, (hi - v.co.z) / 0.06))
        v.co -= v.normal * HOSE_SHRINK * k * k * (3 - 2 * k)
    bm.to_mesh(hose.data)
    bm.free()
