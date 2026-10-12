"""The Norse clothes of MakeHuman's suits02 pack (by Rehman Polanski, CC0,
fitted to the body by mhassets.fit_garments): a tunic with short sleeves
over long under-sleeves, a mail panel on the chest and a belt; baggy
trousers; soft knee-high boots with straps.

The tunic is one mesh with several parts, told apart per face (a FACE
attribute `_sub`, see SUBPARTS; merge_parts turns it into _PART): the mail
is found in the pack's texture (its fine pattern), the under-sleeves by
where they lie on the texture, the belt and its hanging end are islands of
their own. One mesh decimated as a whole has no cracks where its parts meet.
"""
import bmesh
import bpy
import numpy as np
from PIL import Image

import coif
import conform
import garments as G
import hood
import mhassets

# the parts of each piece, by the value of its `_sub` face attribute
SUBPARTS = {
    'VikingTunic': ['Tunic', 'Vest', 'Oversleeves', 'Undersleeves', 'Belt'],
    'VikingBoots': ['Boots', 'Wraps', 'Belt'],
}
# the mail on the tunic's texture: a fine pattern (the brightness varies by
# more than MAIL[0] in a square of 2 * MAIL[2] + 1 texels round a point, whose
# mean is over MAIL[1])
MAIL = (0.075, 0.17, 6)
# on the tunic's texture: the under-sleeves (two squares at the bottom left,
# u under UNDER[0], v under UNDER[1]) and the short over-sleeves (the top row,
# v over OVER)
UNDER = (0.54, 0.28)
OVER = 0.86
# the vest: mail patches of at least VEST[0] triangles; the collar, VEST[1]
# round the neck opening, stays cloth; VEST[2] rounds even out its edges
VEST = (60, 0.04, 3)
SKIN = 0.004          # the tunic over the skin, its push carried CARRY (see hood.fit)
CARRY = (0.010, 0.030)
# triangles each part of the tunic must have (the marking checked)
EXPECT = {'Vest': (1300, 2100), 'Oversleeves': (850, 1000), 'Undersleeves': (1150, 1400), 'Belt': (836, 836)}
TUCK = (0.004, 0.01, 0.04)  # trousers this far inside the boots, fully up to TUCK[1] under their top, none TUCK[2] over it
HIDDEN = (0.045, 0.002)     # trouser faces this far under the boots' top and this far inside them are removed
SHRINK = (0.009, 0.003, 0.75)  # the trousers under the skirts pulled in, at most to this over the skin, from this height up
PULL = (0.003, 0.0015)      # the trousers under the garments over them, never closer to the skin
SOLE = 0.04                 # the boots' open edges under this height are their soles


def islands(bm):
    """Island number of each face, and the number of the biggest."""
    isl = [-1] * len(bm.faces)
    sizes = []
    for f in bm.faces:
        if isl[f.index] >= 0:
            continue
        k = len(sizes)
        stack = [f]
        isl[f.index] = k
        n = 0
        while stack:
            x = stack.pop()
            n += 1
            for e in x.edges:
                for y in e.link_faces:
                    if isl[y.index] < 0:
                        isl[y.index] = k
                        stack.append(y)
        sizes.append(n)
    return isl, sizes.index(max(sizes))


def box_mean(a, r):
    n = 2 * r + 1
    c = np.cumsum(np.cumsum(np.pad(a, ((r + 1, r), (r + 1, r)), mode='edge'), 0), 1)
    return (c[n:, n:] - c[:-n, n:] - c[n:, :-n] + c[:-n, :-n]) / (n * n)


def mark_tunic(obj, png, belt_top, shoulder):
    """The tunic's `_sub` face attribute (SUBPARTS): 0 cloth, 1 the vest, 2
    the short over-sleeves, 3 the under-sleeves, 4 the belt and its end (the
    islands other than the biggest). The sleeves are where they lie on the
    pack's texture; the vest is everything of the body from the bottom of
    the mail on its texture up (the armholes' rims and the side strips too,
    so that mail sleeves meet a mail chest), except the collar. Uses the
    pack's UVs: run before they are replaced. Returns the triangles of each
    part and the height of the vest's bottom."""
    a = np.asarray(Image.open(png).convert('L'), dtype=np.float64) / 255.0
    h, w = a.shape
    mean = box_mean(a, MAIL[2])
    std = np.sqrt(np.maximum(box_mean(a * a, MAIL[2]) - mean ** 2, 0.0))
    mail_tex = (std > MAIL[0]) & (mean > MAIL[1])

    def at(u, v):
        return mail_tex[min(h - 1, max(0, int((1 - v) * h))), min(w - 1, max(0, int(u * w)))]
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bm.faces.ensure_lookup_table()
    uv = bm.loops.layers.uv.active
    isl, main = islands(bm)
    sub = [0] * len(bm.faces)
    mail = [False] * len(bm.faces)
    for f in bm.faces:
        if isl[f.index] != main:
            sub[f.index] = 4
            continue
        cu = sum(lp[uv].uv.x for lp in f.loops) / len(f.loops)
        cv = sum(lp[uv].uv.y for lp in f.loops) / len(f.loops)
        if cu < UNDER[0] and cv < UNDER[1]:
            sub[f.index] = 3
            continue
        if cv > OVER:
            sub[f.index] = 2
            continue
        # (the middle and points towards the corners: most must be on mail)
        pts = [(cu, cv)] + [(lp[uv].uv.x * 0.6 + cu * 0.4, lp[uv].uv.y * 0.6 + cv * 0.4) for lp in f.loops]
        mail[f.index] = sum(1 for u, v in pts if at(u, v)) * 2 > len(pts)
    # the mail: patches of some size above the belt (stitches on the skirt
    # look like mail too)
    seen = [False] * len(bm.faces)
    bottom = None
    for f in bm.faces:
        if not mail[f.index] or seen[f.index]:
            continue
        stack = [f]
        seen[f.index] = True
        patch = []
        while stack:
            x = stack.pop()
            patch.append(x)
            for e in x.edges:
                for y in e.link_faces:
                    if mail[y.index] and not seen[y.index]:
                        seen[y.index] = True
                        stack.append(y)
        zs = [x.calc_center_median().z for x in patch]
        if sum(len(x.verts) - 2 for x in patch) >= VEST[0] and sum(zs) / len(zs) > belt_top - 0.06:
            bottom = min(zs) if bottom is None else min(bottom, min(zs))
    # the collar: the cloth round the neck opening (the edge of the sheet
    # over the shoulders)
    neck = [v.co.copy() for v in bm.verts if v.is_boundary and v.co.z > shoulder and abs(v.co.x) < 0.12]
    vest = [False] * len(bm.faces)
    for f in bm.faces:
        if sub[f.index] or f.calc_center_median().z < bottom:
            continue
        c = f.calc_center_median()
        if not mail[f.index] and neck and min((c - p).length for p in neck) < VEST[1]:
            continue
        vest[f.index] = True
    # its edges evened out: a face of the body goes with most of its
    # neighbours (not across the sleeves or the belt)
    for _ in range(VEST[2]):
        new = vest[:]
        for f in bm.faces:
            if sub[f.index]:
                continue
            nb = [y.index for e in f.edges for y in e.link_faces if y is not f and not sub[y.index]]
            if nb:
                on = sum(1 for i in nb if vest[i])
                new[f.index] = on * 2 > len(nb) or (on * 2 == len(nb) and vest[f.index])
        vest = new
    for f in bm.faces:
        if vest[f.index]:
            sub[f.index] = 1
    tris = {name: 0 for name in SUBPARTS['VikingTunic']}
    for f in bm.faces:
        tris[SUBPARTS['VikingTunic'][sub[f.index]]] += len(f.verts) - 2
    bm.free()
    attr = obj.data.attributes.new('_sub', 'INT', 'FACE')
    attr.data.foreach_set('value', sub)
    return tris, bottom


def mark_boots(obj):
    """The boots' `_sub` (SUBPARTS): 0 the feet, 1 the shafts above the
    cords (leg wraps on the poorer soldiers), 2 the cords (the small
    islands). Returns the height of the cords' top."""
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    isl, _ = islands(bm)
    sizes = {}
    for k in isl:
        sizes[k] = sizes.get(k, 0) + 1
    big = sorted(sizes, key=lambda k: -sizes[k])[:2]
    cords = max(v.co.z for f in bm.faces if isl[f.index] not in big for v in f.verts)
    sub = [(1 if f.calc_center_median().z > cords else 0) if isl[f.index] in big else 2 for f in bm.faces]
    bm.free()
    attr = obj.data.attributes.new('_sub', 'INT', 'FACE')
    attr.data.foreach_set('value', sub)
    return cords


def tuck(pants, boots, rig):
    """The trousers tucked into the boots: the faces deep inside the shafts
    (never seen) removed, the rest under the boots' top pulled in to TUCK[0]
    inside them (fading out above the top), and skinned like the boots up to
    a little over their top, so the two move together."""
    tree = coif.tree_of([boots])
    top = max(v.co.z for v in boots.data.vertices if v.co.z > 0.2)

    def inside(co):
        loc, n, _, d = tree.find_nearest(co, 0.08)
        if loc is None:
            return None, None, None
        return (co - loc).dot(n), n, d
    # faces wholly under HIDDEN[0] below the top and HIDDEN[1] inside
    bm = bmesh.new()
    bm.from_mesh(pants.data)
    deep = set()
    for v in bm.verts:
        s, _, d = inside(v.co)
        if v.co.z < top - HIDDEN[0] and s is not None and s < -HIDDEN[1] and abs(s) > 0.8 * d:
            deep.add(v.index)
    gone = [f for f in bm.faces if all(v.index in deep for v in f.verts)]
    n_gone = sum(len(f.verts) - 2 for f in gone)
    bmesh.ops.delete(bm, geom=gone, context='FACES_ONLY')
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
    bm.to_mesh(pants.data)
    bm.free()
    moved = 0
    for v in pants.data.vertices:
        k = max(0.0, min(1.0, (top + TUCK[2] - v.co.z) / (TUCK[2] + TUCK[1])))
        if k <= 0:
            continue
        s, n, d = inside(v.co)
        if s is not None and s > -TUCK[0]:
            v.co += n * ((-TUCK[0] - s) * k)
            moved += 1
    pants.data.update()
    # (as conform.copy_weights, by height)
    mask = pants.vertex_groups.new(name='tuck_mask')
    for v in pants.data.vertices:
        mask.add([v.index], max(0.0, min(1.0, (top + 0.03 - v.co.z) / 0.04)), 'REPLACE')
    for g in boots.vertex_groups:
        if g.name in rig.data.bones and g.name not in pants.vertex_groups:
            pants.vertex_groups.new(name=g.name)
    m = pants.modifiers.new('DT', 'DATA_TRANSFER')
    m.object = boots
    m.use_vert_data = True
    m.data_types_verts = {'VGROUP_WEIGHTS'}
    m.vert_mapping = 'POLYINTERP_NEAREST'
    m.layers_vgroup_select_src = 'ALL'
    m.layers_vgroup_select_dst = 'NAME'
    m.mix_mode = 'REPLACE'
    m.mix_factor = 1.0
    m.vertex_group = 'tuck_mask'
    bpy.context.view_layer.objects.active = pants
    while pants.modifiers[0].name != 'DT':
        bpy.ops.object.modifier_move_up(modifier='DT')
    bpy.ops.object.modifier_apply(modifier='DT')
    pants.vertex_groups.remove(pants.vertex_groups['tuck_mask'])
    return n_gone, moved


def shrink(pants, skin, lo, hi):
    """The trousers under the skirts (between heights lo and hi, where every
    Norse skirt covers them) pulled in by SHRINK[0], never closer than
    SHRINK[1] to the skin: a thigh lifted in a stride stays under the skirt."""
    bm = bmesh.new()
    bm.from_mesh(pants.data)
    bm.normal_update()
    for v in bm.verts:
        k = max(0.0, min(1.0, (v.co.z - lo) / 0.06)) * max(0.0, min(1.0, (hi - v.co.z) / 0.06))
        if k <= 0:
            continue
        loc, n, _, d = skin.find_nearest(v.co, 0.1)
        room = (v.co - loc).dot(n) - SHRINK[1] if loc is not None else SHRINK[0]
        v.co -= v.normal * max(0.0, min(SHRINK[0] * k * k * (3 - 2 * k), room))
    bm.to_mesh(pants.data)
    bm.free()


def pull_under(pants, outers, skin):
    """The trousers kept PULL[0] under the garments over them (the skirts of
    the tunic, the gambeson and the hauberk), never closer than PULL[1] to
    the skin; where an outer layer covers them only (the strict side test,
    so not below its hem)."""
    trees = [coif.tree_of([o]) for o in outers]
    bm = bmesh.new()
    bm.from_mesh(pants.data)
    bm.normal_update()
    nb = [[e.other_vert(v).index for e in v.link_edges] for v in bm.verts]
    need = []
    for v in bm.verts:
        best = 0.0
        for tree in trees:
            loc, n, _, d = tree.find_nearest(v.co, 0.1)
            if loc is None:
                continue
            s = (v.co - loc).dot(n)
            if abs(s) > 0.8 * d:
                best = max(best, s + PULL[0])
        need.append(best)
    smooth = conform.smooth_field(need, nb, 4)
    moved = 0
    for v, a, b in zip(bm.verts, need, smooth):
        pull = max(a, b)
        if pull <= 0:
            continue
        loc, n, _, d = skin.find_nearest(v.co, 0.1)
        room = (v.co - loc).dot(n) - PULL[1] if loc is not None else pull
        step = max(0.0, min(pull, room))
        if step > 0:
            v.co -= v.normal * step
            moved += 1
    bm.to_mesh(pants.data)
    bm.free()
    return moved


def cap_soles(boots):
    """Close the boots' soles if the pack left them open (the feet of the
    dead and of lifted legs are seen from below)."""
    bm = bmesh.new()
    bm.from_mesh(boots.data)
    edges = [e for e in bm.edges if e.is_boundary and max(v.co.z for v in e.verts) < SOLE]
    if edges:
        out = bmesh.ops.holes_fill(bm, edges=edges, sides=0)
        bmesh.ops.triangulate(bm, faces=out['faces'])
    n = len(edges)
    bm.to_mesh(boots.data)
    bm.free()
    if n:
        # (the new faces are feet)
        attr = boots.data.attributes['_sub']
        for p in boots.data.polygons:
            if max(boots.data.vertices[i].co.z for i in p.vertices) < SOLE:
                attr.data[p.index].value = 0
    return n


def prune(boots):
    """The boots without their cords, for the far levels (a few pixels
    there, and they decimate into splinters)."""
    bm = bmesh.new()
    bm.from_mesh(boots.data)
    sub = bm.faces.layers.int.get('_sub')
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if f[sub] == 2], context='FACES')
    bm.to_mesh(boots.data)
    bm.free()
    return boots


def build_all(worn, pieces, human, rig, helpers, cache):
    """{'VikingTunic', 'VikingPants', 'VikingBoots': object}, taken from the
    fitted pack garments in `worn`: parts marked, fitted to the body and to
    each other (the tunic off the skin, the trousers tucked into the boots
    and kept under the skirts)."""
    tunic, pants, boots = (worn.pop(n) for n in ('VikingTunic', 'VikingPants', 'VikingBoots'))
    png = mhassets.pack_file(cache, 'suits02', 'clothes/rehmanpolanski_viking_tunic/TUNIC_Viking.png')
    tris, bottom = mark_tunic(tunic, png, G.L['belt_top'], G.L['shoulder'])
    print('viking tunic parts', tris, 'vest from %.3f' % bottom)
    for name, (lo, hi) in EXPECT.items():
        if not lo <= tris[name] <= hi:
            raise RuntimeError(f'viking tunic: {tris[name]} triangles of {name}, expected {lo}-{hi}')
    body = helpers['extract'](human, ['body'], 'VikingBody')
    skin = coif.tree_of([body])
    moved = hood.fit(tunic, [(skin, SKIN)], rounds=4, carry=CARRY)
    cords = mark_boots(boots)
    soles = cap_soles(boots)
    pulled = pull_under(pants, [tunic, pieces['Gambeson'], pieces['Hauberk']], skin)
    shrink(pants, skin, SHRINK[2], G.L['belt_top'] - 0.12)
    gone, tucked = tuck(pants, boots, rig)
    print(f'viking: tunic {moved} points off the skin; boots cords to {cords:.3f}, {soles} sole edges closed; '
          f'trousers {pulled} pulled under the skirts, {gone} triangles inside the boots removed, {tucked} tucked')
    bpy.data.objects.remove(body)
    out = {'VikingTunic': tunic, 'VikingPants': pants, 'VikingBoots': boots}
    for name, obj in out.items():
        helpers['set_material'](obj, name.lower())
        helpers['shade_smooth'](obj)
    return out
