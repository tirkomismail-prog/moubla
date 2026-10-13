"""Tileable surface textures for the clothes, armour, helmets, weapons and
shields (CC0, from ambientCG and Poly Haven, and our own: proctiles.py), see
assets/characters/CREDITS.md. The game picks a material for each garment by
the soldier's armour (src/battle/character.js); the helmets name theirs per
vertex (helmets.py), the weapons and shields per colour (src/battle/models.js)."""
import os
import sys
import urllib.request
import zipfile

# the mean (linear, per channel) of the cloth the game dyes in the sides'
# colours: a tint is the colour over it (clothColor in character.js), so
# every tile dyed so is made to it
WOOL = (0.77, 0.729, 0.669)
# material -> (source, asset, metres covered by one repeat of the texture,
# mean albedo (linear) the colour is scaled to: light for cloth the game
# tints, like real steel for the metals; three numbers: each channel's).
# New ones go at the end: the helmets name theirs by the position in this
# list. (A 'procedural' asset is a function of proctiles.py.)
TILES = {
    'wool': ('ambientcg', 'Fabric062', 0.22, 0.75),
    # a gambeson quilted in vertical channels
    'quilted': ('procedural', 'gambeson', 0.3, WOOL),
    # (Leather014's colour: the tints were chosen on it)
    'leather': ('ambientcg', 'Leather006', 0.45, (0.171, 0.082, 0.071)),
    # (rings and dirt between them, smaller than a pixel from 2-3 m on: the
    # average of worn mail, darker than polished steel)
    'mail': ('ambientcg', 'Chainmail004', 0.1, 0.28),
    # bright steel: the weapons
    'plate': ('ambientcg', 'Metal038', 0.6, 0.5),
    # plates laced in rows, light: the game makes them worn iron or black
    # lacquer
    'lamellar': ('procedural', 'lamellar', 0.36, 0.55),
    'fur': ('polyhaven', 'curly_teddy_natural', 0.2, 0.3),
    'wood': ('ambientcg', 'Wood060', 0.35, 0.18),
    'planks': ('ambientcg', 'Planks039', 0.7, 0.3),
    'paint': ('ambientcg', 'PaintedWood003', 0.5, 0.6),
    # worn iron, rough in places: plate armour, helmets, the chanfron (a
    # little darker than bright steel: the dull skin of worn iron)
    'iron': ('ambientcg', 'Metal052C', 0.6, 0.42),
    # a brigandine's cloth and its rivet heads
    'brigandine': ('procedural', 'brigandine', 0.3, WOOL),
    'linen': ('procedural', 'linen', 0.192, WOOL),
}
# the second material of a procedural tile (where its mask is), made to this
# mean: the lamellar's lacing dyed like the sides' wool (else as drawn, the
# brigandine's tinned rivets)
SECOND = {'lamellar': WOOL}
# surface images stored without loss: lossy WebP mixes the normal and the
# roughness packed in them at the sharp edges of plates, rivets and seams
# (their weave is in the colour only: so they stay small)
LOSSLESS = {'quilted', 'lamellar', 'brigandine'}
# only the colour's lightness, made in linear light from the twice as large
# scan (it is dark: scaled up nine times from 8 bits it would band; and its
# own colour is blotchy)
LIGHTNESS = {'leather'}
# the masks of the second materials: a grey image each, this size
MASK_SIZE = 256
# made grey (the game paints them in the team colours)
GREY = {'paint'}
# roughness made rougher by this much (worn metal, not a mirror; mail seen
# as a whole, not ring by ring)
ROUGHER = {'mail': 2.15, 'iron': 1.4}
# and its patches brought this much closer to its mean first (the scan's
# smooth patches shine out of the shade like flecks of snow)
EVENER = {'iron': 0.5}
# colour with this much of its contrast (the scan's stains look like
# camouflage on a whole harness in the shade)
FLATTER = {'iron': 0.55}
TILE_SIZE = 512

URLS = {
    'ambientcg': ['https://ambientcg.com/get?file={id}_1K-JPG.zip'],
    'polyhaven': ['https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/{id}/{id}_{map}_1k.jpg'],
}
# file name of each map in the downloaded folder
FILES = {
    'ambientcg': {'color': '{id}_1K-JPG_Color.jpg', 'normal': '{id}_1K-JPG_NormalGL.jpg',
                  'rough': '{id}_1K-JPG_Roughness.jpg', 'opacity': '{id}_1K-JPG_Opacity.jpg'},
    'polyhaven': {'color': '{id}_diff_1k.jpg', 'normal': '{id}_nor_gl_1k.jpg', 'rough': '{id}_rough_1k.jpg'},
}


def download(url, path):
    print('downloading', url)
    req = urllib.request.Request(url, headers={'User-Agent': 'moubla-build'})
    with urllib.request.urlopen(req) as r, open(path, 'wb') as f:
        f.write(r.read())


def fetch(cache):
    for source, asset, _, _ in TILES.values():
        if source == 'procedural':
            continue
        folder = os.path.join(cache, source, asset)
        if os.path.isdir(folder):
            continue
        os.makedirs(folder, exist_ok=True)
        if source == 'ambientcg':
            path = folder + '.zip'
            if not os.path.exists(path):
                download(URLS[source][0].format(id=asset), path)
            with zipfile.ZipFile(path) as z:
                z.extractall(folder)
        else:
            for m in ('diff', 'nor_gl', 'rough'):
                download(URLS[source][0].format(id=asset, map=m), os.path.join(folder, f'{asset}_{m}_1k.jpg'))


def scale_albedo(img, mean):
    """Scale an sRGB image so that its mean linear luminance is `mean`
    (measured on every pixel in linear light: the mean of a smaller copy
    made in sRGB comes out too dark for a contrasty texture like mail)."""
    import numpy as np

    def lin(c):
        c /= 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    def srgb(v):
        v = min(1.0, max(0.0, v))
        return round(255 * (v * 12.92 if v <= 0.0031308 else 1.055 * v ** (1 / 2.4) - 0.055))

    to_lin = np.array([lin(float(i)) for i in range(256)])
    rgb = to_lin[np.asarray(img.convert('RGB'))].reshape(-1, 3).mean(0)
    lum = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
    k = mean / max(lum, 1e-4)
    table = [srgb(lin(float(i)) * k) for i in range(256)]
    return img.point(table * 3)


def to_linear(c):
    """sRGB (0..255) to linear light."""
    import numpy as np
    c = np.asarray(c, dtype=np.float64) / 255
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def to_srgb8(c):
    """Linear light to sRGB, 8 bits."""
    import numpy as np
    c = np.clip(c, 0, 1)
    return np.round(255 * np.where(c <= 0.0031308, c * 12.92, 1.055 * c ** (1 / 2.4) - 0.055)).astype(np.uint8)


def mean_of(lin, weight, target):
    """The mean of a linear image (weighted) as `target` gives it: each
    channel's for three numbers, the luminance for one."""
    import numpy as np
    m = (lin * weight[..., None]).reshape(-1, 3).sum(0) / max(weight.sum(), 1e-9)
    return m if np.ndim(target) else np.array([0.2126, 0.7152, 0.0722]) @ m


def box(a, n):
    """An image (H x W [x C]) made n x n by averaging blocks (the tiles'
    scans are twice their size: exact, and seamless round the edges)."""
    k = a.shape[0] // n
    return a.reshape(n, k, n, k, *a.shape[2:]).mean((1, 3))


def save(image, path, lossless=False):
    if lossless:
        image.save(path, 'WEBP', lossless=True, quality=100, method=6, exact=True)
    else:
        image.save(path, 'WEBP', quality=90, method=6)
    print('texture', path, os.path.getsize(path), 'bytes')


def colour_to_mean(parts, path):
    """Writes the colour image of the materials `parts` [(linear image,
    weight, weight as the game sees it, target mean or None)] laid over each
    other by their weights, each scaled to its mean as the game reads the
    file back (lossy WebP and the 8 bits shift it a little: measured on the
    decoded image and corrected, the best of a few tries kept)."""
    import numpy as np
    from PIL import Image

    gains = [np.ones(3) if t is None else np.broadcast_to(np.asarray(t) / mean_of(img, w, t), 3).astype(np.float64)
             for img, _, w, t in parts]
    best = None
    for _ in range(6):
        lin = sum(img * gain * w[..., None] for (img, w, _, _), gain in zip(parts, gains))
        save(Image.fromarray(to_srgb8(lin)), path)
        back = to_linear(Image.open(path).convert('RGB'))
        off = [np.asarray(t) / mean_of(back, w, t) if t is not None else np.ones(3) for _, _, w, t in parts]
        worst = max(float(np.max(np.abs(o - 1))) for o in off)
        if best is None or worst < best[0]:
            best = (worst, [g.copy() for g in gains])
        if worst < 0.003:
            break
        # (damped: the encoder's answer to a small change jumps about)
        gains = [g * o ** 0.7 for g, o in zip(gains, off)]
    if worst > best[0]:
        lin = sum(img * gain * w[..., None] for (img, w, _, _), gain in zip(parts, best[1]))
        save(Image.fromarray(to_srgb8(lin)), path)
    assert best[0] < 0.01, (path, best[0])


def procedural(name, asset, metres, mean, out_dir):
    """A tile of our own (proctiles.py): its colour, surface and, with a
    second material, mask images. Returns (files, mask file or None)."""
    import numpy as np
    from PIL import Image

    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import proctiles  # noqa: E402

    r = proctiles.ALL[asset](T=metres)
    mask = r.get('mask')
    ones = np.ones(r['rough'].shape)
    if mask is None:
        parts = [(r['a'], ones, ones, mean)]
    else:
        # (the game mixes the two by the mask as shipped, MASK_SIZE)
        k = mask.shape[0] // MASK_SIZE
        seen = np.kron(box(mask, MASK_SIZE), np.ones((k, k)))
        parts = [(r['a'], 1 - mask, 1 - seen, mean), (r['b'], mask, seen, SECOND.get(name))]
    colour = os.path.join(out_dir, f'tile_{name}.webp')
    colour_to_mean(parts, colour)
    sx, sy = proctiles.slopes(r['height'], metres)
    surf = np.dstack([sx * 127.5 + 127.5, sy * 127.5 + 127.5, r['rough'] * 255])
    if name in LOSSLESS:
        # (even levels only: a third smaller without loss, at most 0.6 degrees
        # off; BC5 errs by more)
        surf = 2 * np.round(surf / 2)
    surface = os.path.join(out_dir, f'tile_{name}_surface.webp')
    save(Image.fromarray(np.clip(np.round(surf), 0, 255).astype(np.uint8)), surface, name in LOSSLESS)
    files = [os.path.basename(colour), os.path.basename(surface)]
    if mask is None:
        return files, None
    path = os.path.join(out_dir, f'tile_{name}_mask.webp')
    save(Image.fromarray(np.round(box(mask, MASK_SIZE) * 255).astype(np.uint8)), path, True)
    return files, os.path.basename(path)


def write_tiles(cache, out_dir):
    """For each material a colour image and a 'surface' image (normal x, y
    and roughness in red, green, blue), and for those with a second material
    a grey mask image of where it is. Returns their entry in layers.json:
    {size, layers: {material: [colour, surface]}, repeat: {material: per
    metre}, masks: {size, layers: {material: mask}}}."""
    import numpy as np
    from PIL import Image, ImageChops, ImageEnhance

    size = TILE_SIZE
    os.makedirs(out_dir, exist_ok=True)
    out = {}
    masks = {}
    for name, (source, asset, metres, mean) in TILES.items():
        if source == 'procedural':
            out[name], masks[name] = procedural(name, asset, metres, mean, out_dir)
            if masks[name] is None:
                del masks[name]
            continue
        folder = os.path.join(cache, source, asset)

        def img(kind, mode):
            path = os.path.join(folder, FILES[source].get(kind, '-').format(id=asset))
            if not os.path.exists(path):
                return None
            image = Image.open(path).convert(mode)
            if name in LIGHTNESS:
                return Image.fromarray(np.round(box(np.asarray(image, dtype=np.float64), size)).astype(np.uint8))
            return image.resize((size, size), Image.LANCZOS)

        normal = img('normal', 'RGB')
        rough = img('rough', 'L') or Image.new('L', (size, size), 200)
        if name in LIGHTNESS:
            path = os.path.join(folder, FILES[source]['color'].format(id=asset))
            lum = box(to_linear(Image.open(path).convert('RGB')) @ np.array([0.2126, 0.7152, 0.0722]), size)
            colour = os.path.join(out_dir, f'tile_{name}.webp')
            colour_to_mean([(np.dstack([lum] * 3), np.ones(lum.shape), np.ones(lum.shape), mean)], colour)
        else:
            color = img('color', 'RGB')
            opacity = img('opacity', 'L')
            if opacity is not None:
                # gaps between the rings of mail: the dark padding underneath
                dark = opacity.point(lambda x: int(60 + 195 * x / 255))
                color = ImageChops.multiply(color, Image.merge('RGB', (dark, dark, dark)))
            if name in GREY:
                color = color.convert('L').convert('RGB')
            if name in FLATTER:
                color = ImageEnhance.Contrast(color).enhance(FLATTER[name])
            colour = os.path.join(out_dir, f'tile_{name}.webp')
            save(scale_albedo(color, mean), colour)
        if name in EVENER:
            m = sum(i * n for i, n in enumerate(rough.histogram())) / (size * size)
            rough = rough.point(lambda v, m=m, e=EVENER[name]: round(m + (v - m) * e))
        if name in ROUGHER:
            rough = rough.point(lambda v, k=ROUGHER[name]: min(255, round(v * k)))
        nx, ny, _ = normal.split()
        surface = os.path.join(out_dir, f'tile_{name}_surface.webp')
        save(Image.merge('RGB', (nx, ny, rough)), surface, name in LOSSLESS)
        out[name] = [os.path.basename(colour), os.path.basename(surface)]
    return {'size': size, 'layers': out,
            'repeat': {name: round(1 / metres, 3) for name, (_, _, metres, _) in TILES.items()},
            'masks': {'size': MASK_SIZE, 'layers': masks}}


if __name__ == '__main__':
    # the tiles alone, without building the soldier again: written next to the
    # model's other textures, and their entry in its layers.json
    #   python3 tools/characters/materials.py --cache <cache> [--out assets/characters/textures]
    import argparse
    import json

    p = argparse.ArgumentParser()
    p.add_argument('--cache', default=os.path.join(os.path.expanduser('~'), '.cache', 'makehuman-assets'))
    p.add_argument('--out', default='assets/characters/textures')
    args = p.parse_args()
    fetch(args.cache)
    tiles = write_tiles(args.cache, args.out)
    manifest = os.path.join(args.out, 'layers.json')
    with open(manifest, encoding='utf-8') as f:
        layers = json.load(f)
    layers['tiles'] = tiles
    with open(manifest, 'w', encoding='utf-8') as f:
        json.dump(layers, f, indent=1)
    print('wrote', manifest)
