"""The masks in the soldiers' vertex colours (read by src/battle/partmat.js):
R the ambient occlusion of the whole outfit, G the distance to the
garment's open edge (worn hems, cuffs and rims), B a smooth noise in the
model's space (mottled cloth, the uneven edge of the mud); A is 1 (the
game puts there the shade with the hair hidden). The helmets' A is the
distance to their rims (rims).

The occlusion is baked for each outfit the game puts together
(outfits.contexts): a garment is shaded by the ones over it, the neck by
the collar, the head by the hood or the coif, or with its hair hidden by
a helmet. R holds a piece's shade in the first outfit that wears it; its
shades in the others, where they differ, go with it packed four to an
attribute (_ao0, _ao1, ...; which outfit uses which in the rig's 'ao'),
and the game puts the right ones into R and A when it joins an outfit
(src/battle/character.js outfitGeometry).
"""
import heapq

import numpy as np

import outfits

# the beard and the moustache shade themselves but not the skin: three
# soldiers in four have neither, and their chins would be dark
BEARD = ('Beard', 'Moustache')
# legs keep half of their shade: the skirts cover them in the rest pose,
# but walking they come out
SOFT = {'Hose': 0.5, 'VikingPants': 0.5}
# an outfit's shade is packed only if it differs from R and from every one
# packed before by more than SAME at one vertex in a hundred, or by more
# than NEAR at more than FEW vertices (a collar's shade on the neck is a
# few dozen of the head's thousands)
SAME = 0.03
NEAR = 0.1
FEW = 5

# distance to the edge (m) at which G reaches 1
EDGE = 0.25
# pieces with no worn edges: the skin; the hose, the Norse trousers and the
# gloves (other garments cover their edges); the belts (narrow: all edge);
# the hoods have none
NO_EDGE = {'Hose', 'VikingPants', 'Gloves'}
# garments sewn of a torso and a skirt: the seam between them (two open
# loops round the waist, under the belt) is not an edge
SEWN = {'Tunic', 'Gambeson', 'Hauberk', 'Surcoat', 'Cuirass', 'Jupon'}
# size of the noise's blobs (m)
NOISE = 0.35
# helmets: distance to the rim (m) at which A reaches 1
RIM = 0.05
# the helmet that shades the head under all of them (each comes down to
# about the brows; a dome with a rim)
SHELL = 'cap'

# the shades packed with each mesh, and the one each outfit uses (R if none):
# {'Soldier': {'kept': [outfit, ...], 'use': {outfit: outfit kept}}, 'Piece_Tunic': ...}
TABLE = {}


def colours(me):
    """The 'Col' colour attribute (one RGBA per vertex) and its values."""
    col = me.color_attributes['Col']
    c = np.empty(len(me.vertices) * 4, np.float32)
    col.data.foreach_get('color', c)
    return col, c.reshape(-1, 4)


def set_colours(me, c):
    me.color_attributes['Col'].data.foreach_set('color', np.ascontiguousarray(c, np.float32).ravel())


def read(me, name):
    a = np.empty(len(me.vertices), np.float32)
    me.attributes[name].data.foreach_get('value', a)
    return a


def store(me, name, values):
    a = me.attributes.get(name) or me.attributes.new(name, 'FLOAT', 'POINT')
    a.data.foreach_set('value', np.ascontiguousarray(values, np.float32))


def world(obj):
    me = obj.data
    co = np.empty(len(me.vertices) * 3)
    me.vertices.foreach_get('co', co)
    m = np.array(obj.matrix_world)
    return co.reshape(-1, 3) @ m[:3, :3].T + m[:3, 3]


def bake(common, pieces, helmets, bake_ao):
    """The occlusion of every outfit of outfits.contexts, into 'ao <outfit>'
    (a float per vertex; not exported) of each object it shades, and R of
    the first. Only what the game shows of the outfit is seen while it is
    baked: not the hair under a hood, a coif or a helmet, nor the helmets
    (carried items; under one, the head is shaded by the SHELL of
    `helmets` {look: object}); the beard and moustache shaded with the
    first outfit."""
    everything = {**common, **pieces}
    looks = outfits.contexts()
    for obj in helmets.values():
        obj.hide_render = True

    def show(names):
        for n, o in everything.items():
            o.hide_render = n not in names

    show(set(common) | set(next(iter(looks.values()))))
    bake_ao([common[n] for n in BEARD if n in common])
    skin = [n for n in common if n not in BEARD]
    for ctx, names in looks.items():
        head = ctx.partition(':')[2]
        seen = [n for n in skin + list(names) if n in everything and not (head and n == 'Hair')]
        show(set(seen))
        # (under a helmet only the head: the clothes are as without it)
        helmets[SHELL].hide_render = head != 'helmet'
        shaded = [n for n in seen if head != 'helmet' or n in common]
        bake_ao([everything[n] for n in shaded])
        for n in shaded:
            me = everything[n].data
            _, c = colours(me)
            store(me, 'ao ' + ctx, 1 - (1 - c[:, 0]) * SOFT.get(n, 1))
    for obj in everything.values():
        obj.hide_render = False
    for obj in helmets.values():
        obj.hide_render = False
    # R: the shade in the first outfit; the outfits without the object
    # (hidden in them) the same, so that the meshes joined later agree
    for name, obj in everything.items():
        me = obj.data
        own = [ctx for ctx in looks if me.attributes.get('ao ' + ctx)]
        _, c = colours(me)
        if own:
            c[:, 0] = read(me, 'ao ' + own[0])
        else:
            assert name in BEARD, name
        c[:, 3] = 1
        set_colours(me, c)
        for ctx in looks:
            if ctx not in own:
                store(me, 'ao ' + ctx, c[:, 0])


def edge(obj, name):
    """G: the distance along the surface to the nearest open edge of a
    garment, over EDGE (1: none near)."""
    me = obj.data
    n = len(me.vertices)
    g = np.ones(n)
    if name in NO_EDGE or name.startswith('Belt'):
        return g
    ev = np.empty(len(me.edges) * 2, np.int64)
    me.edges.foreach_get('vertices', ev)
    ev = ev.reshape(-1, 2)
    used = np.empty(len(me.loops), np.int64)
    me.loops.foreach_get('edge_index', used)
    rim = ev[np.bincount(used, minlength=len(ev)) == 1]
    if not len(rim):
        return g
    co = world(obj)
    # the open loops: sets of vertices joined by open edges
    root = list(range(n))

    def find(i):
        while root[i] != i:
            root[i] = root[root[i]]
            i = root[i]
        return i
    for a, b in rim:
        root[find(a)] = find(b)
    loops = {}
    for v in np.unique(rim):
        loops.setdefault(find(v), []).append(v)
    sources = []
    seams = 0
    for verts in loops.values():
        p = co[verts]
        if name in SEWN and np.abs(p[:, 0]).max() < 0.22 and 0.93 < p[:, 2].min() and p[:, 2].max() < 1.08:
            seams += 1
            continue
        sources += verts
    assert seams == (2 if name in SEWN else 0), (name, seams)
    # Dijkstra from all of them at once along the edges
    length = np.linalg.norm(co[ev[:, 0]] - co[ev[:, 1]], axis=1)
    order = np.argsort(np.concatenate([ev[:, 0], ev[:, 1]]), kind='stable')
    to = np.concatenate([ev[:, 1], ev[:, 0]])[order]
    w = np.concatenate([length, length])[order]
    start = np.searchsorted(np.concatenate([ev[:, 0], ev[:, 1]])[order], np.arange(n + 1))
    dist = np.full(n, np.inf)
    heap = [(0.0, int(v)) for v in sources]
    for _, v in heap:
        dist[v] = 0.0
    heapq.heapify(heap)
    while heap:
        d, v = heapq.heappop(heap)
        if d > dist[v]:
            continue
        for k in range(start[v], start[v + 1]):
            u, nd = to[k], d + w[k]
            if nd < dist[u]:
                dist[u] = nd
                heapq.heappush(heap, (nd, int(u)))
    return np.minimum(dist / EDGE, 1.0)


def value_noise(p, seed):
    """Smooth noise in 3D (values at the corners of a unit lattice, eased
    between them)."""
    rng = np.random.default_rng(seed)
    perm = rng.permutation(256)
    val = rng.random(256)
    i = np.floor(p).astype(np.int64)
    f = p - i
    u = f * f * (3 - 2 * f)

    def corner(dx, dy, dz):
        return val[perm[(perm[(perm[(i[:, 0] + dx) & 255] + i[:, 1] + dy) & 255] + i[:, 2] + dz) & 255]]
    x = [[corner(0, dy, dz) * (1 - u[:, 0]) + corner(1, dy, dz) * u[:, 0] for dy in (0, 1)] for dz in (0, 1)]
    y = [x[dz][0] * (1 - u[:, 1]) + x[dz][1] * u[:, 1] for dz in (0, 1)]
    return y[0] * (1 - u[:, 2]) + y[1] * u[:, 2]


def paint(objs, bare):
    """G and B of the near model's objects ({name: object}; R baked); those
    named in `bare` (the skin, the hair) have no worn edges."""
    noise = {}
    for name, obj in objs.items():
        p = world(obj) / NOISE
        noise[name] = 0.65 * value_noise(p, 43) + 0.35 * value_noise(p * 2.03 + 17.3, 44)
    every = np.concatenate(list(noise.values()))
    mean, std = every.mean(), every.std()
    for name, obj in objs.items():
        me = obj.data
        _, c = colours(me)
        c[:, 1] = 1 if name in bare else edge(obj, name)
        c[:, 2] = np.clip(0.5 + (noise[name] - mean) / std * 0.2, 0, 1)
        set_colours(me, c)
        if c[:, 1].min() < 1:
            print(f'{name:16s} worn edges: {np.mean(c[:, 1] < 0.2) * 100:4.1f}% of the vertices')


def far(obj):
    """No worn edges on the far model (its vertices too far apart)."""
    _, c = colours(obj.data)
    c[:, 1] = 1
    set_colours(obj.data, c)


def pack(obj):
    """Before the export of a joined mesh (Soldier_LOD<n>,
    Piece_<name>_LOD<n>): the shades of the outfits that wear it, packed
    into _ao0, _ao1, ... (the floats removed). An outfit whose shade is
    close enough to R or to one kept before uses that one instead (where it
    is seen: what an outer garment covers in it is left out). Chosen on the
    near level, the same on the others."""
    me = obj.data
    looks = outfits.contexts()
    if not me.attributes.get('ao ' + next(iter(looks))):
        return
    shade = {}
    for ctx in looks:
        shade[ctx] = read(me, 'ao ' + ctx)
        me.attributes.remove(me.attributes['ao ' + ctx])
    base = obj.name.split('_LOD')[0]
    if base not in TABLE:
        piece = base[len('Piece_'):] if base.startswith('Piece_') else None
        _, c = colours(me)
        kept, use = [], {}
        for ctx, names in looks.items():
            if piece is not None and piece not in names:
                continue
            # (covered: at the floor of the bake)
            seen = 1 - (1 - shade[ctx]) / SOFT.get(piece, 1) > 0.45
            if not seen.any():
                continue
            diff, same = {}, []
            for k in [None] + kept:
                d = np.abs(shade[ctx] - (c[:, 0] if k is None else shade[k]))[seen]
                diff[k] = np.percentile(d, 99)
                if diff[k] <= SAME and np.count_nonzero(d > NEAR) <= FEW:
                    same.append(k)
            best = min(same, key=diff.get) if same else ctx
            if not same:
                kept.append(ctx)
            if best is not None:
                use[ctx] = best
            print(f'{base:22s} {ctx:18s} -> {best or "R"} ({min(diff.values()):.3f})')
        TABLE[base] = {'kept': kept, 'use': use}
    kept = TABLE[base]['kept']
    for i in range(0, len(kept), 4):
        v = np.ones((len(me.vertices), 4), np.float32)
        for k, ctx in enumerate(kept[i:i + 4]):
            v[:, k] = shade[ctx]
        me.color_attributes.new(f'_ao{i // 4}', 'BYTE_COLOR', 'POINT').data.foreach_set('color', v.ravel())
    me.color_attributes.active_color = me.color_attributes['Col']
    me.color_attributes.render_color_index = me.color_attributes.active_color_index


def rims(me, scale=RIM):
    """A per vertex of a helmet (Mesh lists, before it is an object): the
    distance along its surface to the nearest rim, over `scale`. Its pieces
    are made apart (each with its own vertices): those at one place are one
    vertex here."""
    co = np.array([tuple(v) for v in me.verts])
    key = np.round(co / 1e-5).astype(np.int64)
    _, weld = np.unique(key, axis=0, return_inverse=True)
    weld = weld.ravel()
    count = {}
    for f in me.faces:
        idx = [int(weld[i]) for i in f]
        for a, b in zip(idx, idx[1:] + idx[:1]):
            if a != b:
                e = (min(a, b), max(a, b))
                count[e] = count.get(e, 0) + 1
    m = weld.max() + 1
    p = np.zeros((m, 3))
    p[weld] = co
    nbrs = [[] for _ in range(m)]
    for a, b in count:
        d = float(np.linalg.norm(p[a] - p[b]))
        nbrs[a].append((b, d))
        nbrs[b].append((a, d))
    dist = np.full(m, np.inf)
    heap = []
    for (a, b), k in count.items():
        if k == 1:
            for v in (a, b):
                if dist[v] > 0:
                    dist[v] = 0.0
                    heap.append((0.0, v))
    heapq.heapify(heap)
    while heap:
        d, v = heapq.heappop(heap)
        if d > dist[v]:
            continue
        for u, w in nbrs[v]:
            if d + w < dist[u]:
                dist[u] = d + w
                heapq.heappush(heap, (d + w, u))
    return np.minimum(dist[weld] / scale, 1.0)
