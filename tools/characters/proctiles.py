"""Tileable textures of our own (stage 4.2), for what has no free scan: a
gambeson quilted in channels, steppe lamellar, a brigandine's rivets, linen.
numpy only, seeded (the same files on every build), drawn at the tile's own
size and seamless: every period divides the tile, and the noise and the
shapes wrap round its edges.

Each returns a dict: 'a' the colour of its (first) material and 'b' that of
a second one (the lamellar's lacing, the brigandine's rivet heads) where
'mask' (0..1) says which, linear RGB (H x W x 3), drawn light: the game tints
them (materials.py scales them to their mean first); 'height' in metres, the
surface the normal map is worked out from (see slopes); 'rough' 0..1. Row 0
of an image is its top, which the garments' UVs turn towards the head
(uvs.py). Detail of a texel or two (the weave, the slubs) goes in the colour
only: in the surface image it would not survive lossy WebP, and stored
without loss it costs ten times as much.
"""
import numpy as np

SIZE = 512


def grid(T, n=SIZE):
    """Coordinates (x right, y down the image) of the texel centres, metres."""
    c = (np.arange(n) + 0.5) / n * T
    return np.meshgrid(c, c)


def noise(rng, fx, fy, octaves=3, gain=0.5, n=SIZE):
    """Smooth value noise with fx x fy cells across the tile (and twice as
    many each octave), about -1..1, periodic."""
    y, x = np.mgrid[0:n, 0:n] / n
    acc = np.zeros((n, n))
    amp, total = 1.0, 0.0
    for o in range(octaves):
        nx, ny = fx * 2 ** o, fy * 2 ** o
        g = rng.standard_normal((ny, nx))
        xi, yi = x * nx, y * ny
        x0, y0 = np.floor(xi).astype(int), np.floor(yi).astype(int)
        sx, sy = xi - x0, yi - y0
        sx, sy = sx * sx * (3 - 2 * sx), sy * sy * (3 - 2 * sy)
        a, b = g[y0 % ny, x0 % nx], g[y0 % ny, (x0 + 1) % nx]
        c, d = g[(y0 + 1) % ny, x0 % nx], g[(y0 + 1) % ny, (x0 + 1) % nx]
        acc += amp * (a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy)
        total += amp
        amp *= gain
    return acc / total


def blur(a, sigma):
    """Gaussian blur (sigma in texels) round the tile's edges."""
    n = a.shape[0]
    ky = np.fft.fftfreq(n)[:, None]
    kx = np.fft.rfftfreq(n)[None, :]
    return np.fft.irfft2(np.fft.rfft2(a) * np.exp(-2 * (np.pi * sigma) ** 2 * (kx ** 2 + ky ** 2)), s=a.shape)


def wrap(d, T):
    """A difference of coordinates folded into -T/2..T/2."""
    return (d + T / 2) % T - T / 2


def cover(sdf, px):
    """How much of a texel (px metres wide) lies inside a shape (sdf < 0)."""
    return np.clip(0.5 - sdf / px, 0, 1)


def slopes(h, T):
    """The normal map of a height field: (-dh/dx, -dh/dy) with y up the
    image (as ambientCG's NormalGL), clamped to 45 degrees. The game takes
    the normal as (x, y, 1) normalized, which gives the height field's own
    normal back; and the mipmaps of slopes are the slopes of the averaged
    height, so far away the relief fades as it should."""
    h = blur(h, 0.6)   # (no steps a texel wide)
    px = T / h.shape[0]
    dx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) / (2 * px)
    drow = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) / (2 * px)
    return np.clip(-dx, -1, 1), np.clip(drow, -1, 1)


def weave(T, threads, depth):
    """A plain weave of `threads` threads each way per tile (two texels or
    more a thread): (height, albedo factor). It shows only within a metre."""
    X, Y = grid(T)
    p = T / threads
    i, j = np.floor(X / p).astype(int), np.floor(Y / p).astype(int)
    u, v = (X / p) % 1, (Y / p) % 1
    warp = (i + j) % 2 == 0   # the warp (up the body) on top
    bump = np.where(warp, np.sin(np.pi * u), np.sin(np.pi * v)) ** 0.7
    return depth * bump, 1 + 0.035 * (bump - 0.64)


def slubs(T, rng, count, strength, across=True, n=SIZE):
    """Hand-spun thread is uneven: thick stretches (slubs) 1-6 cm long and a
    thread or two wide, mostly in the weft (across the body). An albedo
    factor, at most `strength` off 1."""
    out = np.ones((n, n))
    px = T / n
    for _ in range(count):
        cx, cy = rng.uniform(0, T, 2)
        length = rng.uniform(0.01, 0.06)
        width = rng.uniform(0.0006, 0.0014)
        gain = rng.choice([-1, 1]) * rng.uniform(0.4, 1.0) * strength
        if not across:
            cx, cy = cy, cx
        # (only the texels round it, wrapped round the tile's edges)
        cols = np.arange(int((cx - length / 2) / px) - 1, int((cx + length / 2) / px) + 2)
        rows = np.arange(int((cy - 3 * width) / px) - 1, int((cy + 3 * width) / px) + 2)
        along = wrap((cols + 0.5) * px - cx, T)[None, :]
        off = wrap((rows + 0.5) * px - cy, T)[:, None]
        shape = np.exp(-(off / width) ** 2) * np.clip(1 - (along / (length / 2)) ** 2, 0, 1) ** 0.5
        window = np.ix_(rows % n, cols % n) if across else np.ix_(cols % n, rows % n)
        out[window] *= 1 + gain * (shape if across else shape.T)
    return out


def gambeson(T=0.30, channels=6, seed=11):
    """A gambeson (aketon): two layers of linen with wadding between, quilted
    by hand in vertical channels 5 cm wide (each its own width, +-8 %) with a
    running stitch of linen thread (4 mm on top, 2.4 mm under). The stitched
    lines pull the cloth into valleys; the wadding puffs up 6 mm between
    them. The valleys are darkened in the colour too, a narrow line and a
    broad shade: far away, where the relief has gone from the mipmaps, it is
    what tells a gambeson from a tunic (still faint at 15 m: there a channel
    is 2.4 pixels at 900p; 4 cm ones would be under the sampling limit)."""
    rng = np.random.default_rng(seed)
    X, Y = grid(T)
    px = T / SIZE
    widths = (T / channels) * (1 + rng.uniform(-0.08, 0.08, channels))
    seams0 = np.concatenate([[0.0], np.cumsum(widths * T / widths.sum())[:-1]]) + rng.uniform(0, T)
    left = np.full(X.shape, np.inf)
    right = np.full(X.shape, np.inf)
    kid = np.zeros(X.shape, int)
    for k in range(channels):
        # (sewn by hand: each line wanders half a millimetre, 5 waves a tile)
        seam = seams0[k] + 0.0005 * noise(rng, 1, 5, 2)[:, :1]
        dl = (X - seam) % T
        dr = (seam - X) % T
        kid = np.where(dl < left, k, kid)
        left = np.minimum(left, dl)
        right = np.minimum(right, dr)
    u = left / (left + right)            # 0..1 across the channel
    d = np.minimum(left, right)          # metres to the nearest seam
    loft = 1 + 0.12 * rng.uniform(-1, 1, channels)[kid]
    crease = 0.0007 * noise(rng, 2, 9, 3) * np.sin(np.pi * u)
    pinch = 0.0012 * np.exp(-(d / 0.0016) ** 2)
    # the running stitch, 47 a tile along each seam
    stitches = 47
    pitch = T / stitches
    phase = rng.uniform(0, 1, channels)[np.where(left < right, kid, (kid + 1) % channels)]
    t = (Y / pitch + phase) % 1
    thread = cover(np.abs(t - 0.31) * pitch - 0.002, px) * cover(d - 0.0006, px)
    height = 0.006 * loft * np.sin(np.pi * u) ** 0.55 + crease - pinch + 0.0005 * thread
    shade = (1 - 0.40 * np.exp(-(d / 0.0028) ** 2)) * (1 - 0.25 * np.exp(-(d / 0.0095) ** 2))
    shade = shade * (1 - 0.06 * np.clip(-crease / 0.0007, 0, 1))
    _, cloth = weave(T, 240, 0)
    cloth = cloth * slubs(T, rng, 160, 0.06) * (1 + 0.035 * noise(rng, 4, 4, 3))
    linen = np.array([0.62, 0.57, 0.47])
    a = linen * (shade * cloth)[..., None]
    a = a * (1 - thread)[..., None] + (np.array([0.70, 0.66, 0.56]) * shade[..., None]) * thread[..., None]
    rough = 0.80 + 0.08 * (1 - shade) / 0.55 + 0.03 * noise(rng, 8, 8, 2) + 0.04 * thread
    return {'a': a, 'height': height, 'rough': np.clip(rough, 0.78, 0.9)}


def lamellar(T=0.36, across=18, rows=6, seed=5):
    """Steppe lamellar, "a finger wide and a palm long" (Carpini): plates
    2.6 cm wide and 9 cm tall with rounded tops, each lying on its right-hand
    neighbour by 6 mm (2 cm of each seen), laced into rows, each row lying
    over the one above it (Met, Tibetan lamellar) 6 cm lower: the rounded
    tops and the upper 6 cm of every plate show. The lacing (material b, a
    3 mm thong): a loop over the top of each plate and a binding lace 4.2 cm
    below the row's top, outside over each overlap. Each plate its own tone
    and roughness (0.47-0.58 before the game's factor: iron 0.42-0.52)."""
    rng = np.random.default_rng(seed)
    X, Y = grid(T)
    px = T / SIZE
    pitch = T / across
    W = pitch + 0.006          # a plate's width
    tall = 0.09
    step = T / rows
    assert tall < 2 * step     # (a plate reaches one row down at most)
    corner = 0.009
    height = np.full(X.shape, -0.002)
    plate = np.full(X.shape, -1)
    yl = np.zeros(X.shape)     # down from the plate's top
    xl = np.zeros(X.shape)     # across from its middle
    offset = rng.uniform(0, pitch, rows)
    for rr in range(-1, rows):                  # the top row first: each lower row in front
        r = rr % rows
        yy = Y - rr * step
        for k in range(across - 1, -1, -1):     # each plate over its right-hand neighbour
            dx = wrap(X - (offset[r] + k * pitch) - W / 2, T)
            qx = np.abs(dx) - (W / 2 - corner)
            rounded = np.hypot(np.maximum(qx, 0), np.maximum(corner - yy, 0)) - corner
            sdf = np.where((qx > 0) & (yy < corner), rounded, np.maximum(np.abs(dx) - W / 2, -yy))
            inside = np.maximum(sdf, yy - tall) < 0
            h = 0.0024 * (1 - yy / tall) + 0.0010 * (0.5 + dx / W) + 0.0008 * np.sqrt(np.clip(1 - (2 * dx / W) ** 2, 0, 1))
            height = np.where(inside, h, height)
            plate = np.where(inside, r * across + k, plate)
            yl = np.where(inside, yy, yl)
            xl = np.where(inside, dx, xl)
    on = plate >= 0
    loop = cover(np.abs(xl) - 0.0015, px) * cover(np.abs(yl - 0.011) - 0.007, px)
    binding = cover(np.abs(yl - 0.042) - 0.0015, px) * cover(np.abs(xl - W / 2 + 0.003) - 0.006, px)
    lace = np.clip(loop + binding, 0, 1) * on

    def hole(cx, cy):
        return cover(np.hypot(xl - cx, yl - cy) - 0.0012, px)
    holes = np.clip(hole(0, 0.0025) + hole(0, 0.0195) + hole(-W / 2 + 0.004, 0.042), 0, 1) * on * (1 - lace)
    # (the thong's twist, about 4 mm: a whole number of them across the tile)
    twist = 0.5 + 0.5 * np.sin(2 * np.pi * round(T / 0.004) * (X + Y) / T)
    height = height + lace * (0.0012 + 0.0003 * twist) - holes * 0.0012
    n = rows * across
    tone = rng.uniform(0.80, 1.15, n)
    own = rng.uniform(0.47, 0.58, n)
    pid = np.clip(plate, 0, None)
    grain = noise(rng, 16, 16, 3)
    rubbed = np.clip(np.exp(-((W / 2 - xl) / 0.0012) ** 2) + np.exp(-(yl / 0.0012) ** 2), 0, 1) * on
    shade = np.clip(1 - 0.55 * np.clip(blur(height, 3) - height, 0, None) / 0.001, 0.45, 1)
    # the shade where a row goes in under the next one's tops (and between
    # them): the rows' line, what still shows of them at 15 m
    shade = shade * (1 - 0.35 * np.exp(-((step - yl) / 0.007) ** 2) * on)
    grey = 0.60 * tone[pid] * (1 + 0.06 * grain) * (1 + 0.08 * rubbed) * (1 - 0.7 * holes) * shade
    cord = 0.42 * (0.85 + 0.3 * twist) * shade
    rough = np.clip(own[pid] + 0.02 * grain - 0.03 * rubbed, 0.44, 0.61)
    rough = rough * (1 - lace) + (0.78 + 0.05 * twist) * lace
    return {'a': np.dstack([grey] * 3), 'b': np.dstack([cord] * 3), 'mask': lace, 'height': height, 'rough': rough}


def brigandine(T=0.30, rows=6, plates=4, seed=7):
    """A 15th-century brigandine: small plates riveted inside a cover of
    cloth dyed the side's colour. The rows 5 cm apart overlap upward, so the
    cloth steps out over each row's top edge with the rivets just below it;
    each plate (7.5 cm, the rows staggered by half) held by three rivets in a
    triangle. The heads (material b): 9 mm, domed 2 mm, tinned iron."""
    rng = np.random.default_rng(seed)
    X, Y = grid(T)
    px = T / SIZE
    step = T / rows
    width = T / plates
    ry = Y % step                                 # down from the row's top
    row = np.floor(Y / step).astype(int) % rows
    xs = X - (row % 2) * width / 2
    xp = xs % width                               # from the plate's left edge
    pid = row * plates + np.floor((xs % T) / width).astype(int) % plates
    edge = 0.0016 * np.clip(ry / 0.003, 0, 1) ** 0.5
    dome = 0.0010 * np.sin(np.pi * np.clip(ry / step, 0, 1)) * np.sin(np.pi * xp / width) ** 0.3
    joint = 0.0003 * np.exp(-(np.minimum(xp, width - xp) / 0.0025) ** 2)
    R = 0.0045
    rivet = np.zeros(X.shape)
    head = np.zeros(X.shape)
    near = np.full(X.shape, 9.0)
    pucker = np.zeros(X.shape)
    jitter = rng.uniform(-0.0012, 0.0012, (rows * plates, 3, 2))
    for i, (ax, ay) in enumerate([(-0.018, 0.010), (0.018, 0.010), (0.0, 0.021)]):
        r = np.hypot(wrap(xp - (width / 2 + ax + jitter[pid, i, 0]), width), ry - (ay + jitter[pid, i, 1]))
        c = cover(r - R, px)
        head = np.maximum(head, 0.0020 * np.sqrt(np.clip(1 - (r / R) ** 2, 0, 1)) * (c > 0))
        rivet = np.maximum(rivet, c)
        near = np.minimum(near, r)
        pucker += np.exp(-((r - R - 0.0012) / 0.0010) ** 2)
    pucker = np.clip(pucker, 0, 1)
    height = edge + dome - joint - 0.0005 * pucker
    height = height * (1 - rivet) + (0.0016 + head) * rivet
    # the cloth: worn lighter over the plates' edges, a little darker in the
    # joints, round the rivets and in the shadow of the next row's edge
    worn = np.clip(1 - ry / 0.004, 0, 1) * 0.8
    _, cloth = weave(T, 240, 0)
    cloth = 0.62 * cloth * slubs(T, rng, 80, 0.05) * (1 + 0.04 * noise(rng, 4, 4, 3))
    cloth = cloth * (1 + 0.07 * worn) * (1 - 0.05 * np.exp(-(np.minimum(xp, width - xp) / 0.003) ** 2))
    # (and a broad shade over the bottom of each row, above the next one's
    # edge: the rows' line, what still shows of them at 15 m whatever the
    # cloth's colour)
    cloth = cloth * (1 - 0.22 * pucker) * (1 - 0.40 * np.exp(-((step - ry) / 0.011) ** 2))
    rim = np.clip((near / R - 0.75) / 0.25, 0, 1)
    tin = 0.72 * (1 - 0.45 * rim) * (1 + 0.05 * noise(rng, 32, 32, 2))
    rough_cloth = np.clip(0.86 - 0.06 * worn + 0.04 * pucker + 0.03 * noise(rng, 8, 8, 2), 0.76, 0.96)
    rough_tin = np.clip(0.40 + 0.08 * rim + 0.03 * noise(rng, 32, 32, 2), 0.34, 0.52)
    return {'a': np.dstack([cloth] * 3), 'b': np.dstack([tin] * 3), 'mask': rivet, 'height': height,
            'rough': rough_cloth * (1 - rivet) + rough_tin * rivet}


def linen(T=0.192, threads=128, seed=3):
    """Coarse linen of hand-spun flax, about 7 threads a centimetre (four
    texels a thread): the weave shows only within a metre, beyond it the
    faint slubs and linen's sheen (smoother than wool). No bands or
    blotches: they would repeat with the tile and show its square on a whole
    tunic."""
    rng = np.random.default_rng(seed)
    height, cloth = weave(T, threads, 0.00007)
    cloth = cloth * slubs(T, rng, 220, 0.008) * slubs(T, rng, 60, 0.006, across=False)
    rough = 0.78 + 0.16 * (1 - cloth) + 0.02 * noise(rng, 8, 8, 2)
    return {'a': np.dstack([cloth * 0.78, cloth * 0.77, cloth * 0.74]), 'height': height, 'rough': np.clip(rough, 0.7, 0.86)}


ALL = {'gambeson': gambeson, 'lamellar': lamellar, 'brigandine': brigandine, 'linen': linen}
