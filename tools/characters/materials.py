"""Tileable surface textures for the clothes, armour, helmets, weapons and
shields (CC0, from ambientCG and Poly Haven), see
assets/characters/CREDITS.md. The game picks a material for each garment by
the soldier's armour (src/battle/character.js); the helmets name theirs per
vertex (helmets.py), the weapons and shields per colour (src/battle/models.js)."""
import os
import urllib.request
import zipfile

# material -> (source, asset, metres covered by one repeat of the texture,
# mean albedo (linear) the colour is scaled to: light for cloth the game
# tints, like real steel for the metals). New ones go at the end: the
# helmets name theirs by the position in this list.
TILES = {
    'wool': ('ambientcg', 'Fabric062', 0.22, 0.75),
    'quilted': ('ambientcg', 'Fabric008', 0.32, 0.5),
    'leather': ('ambientcg', 'Leather014', 0.45, 0.1),
    # (rings and dirt between them, smaller than a pixel from 2-3 m on: the
    # average of worn mail, darker than polished steel)
    'mail': ('ambientcg', 'Chainmail004', 0.1, 0.28),
    # bright steel: the weapons
    'plate': ('ambientcg', 'Metal038', 0.6, 0.5),
    'lamellar': ('ambientcg', 'Metal039', 0.35, 0.4),
    'fur': ('polyhaven', 'curly_teddy_natural', 0.2, 0.3),
    'wood': ('ambientcg', 'Wood060', 0.35, 0.18),
    'planks': ('ambientcg', 'Planks039', 0.7, 0.3),
    'paint': ('ambientcg', 'PaintedWood003', 0.5, 0.6),
    # worn iron, rough in places: plate armour, helmets, the chanfron (a
    # little darker than bright steel: the dull skin of worn iron)
    'iron': ('ambientcg', 'Metal052C', 0.6, 0.42),
}
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


def write_tiles(cache, out_dir):
    """For each material a colour image and a 'surface' image (normal x, y
    and roughness in red, green, blue). Returns {material: [colour, surface]}."""
    from PIL import Image, ImageChops, ImageEnhance

    size = TILE_SIZE
    os.makedirs(out_dir, exist_ok=True)
    out = {}
    for name, (source, asset, _, mean) in TILES.items():
        folder = os.path.join(cache, source, asset)

        def img(kind, mode):
            path = os.path.join(folder, FILES[source].get(kind, '-').format(id=asset))
            return Image.open(path).convert(mode).resize((size, size), Image.LANCZOS) if os.path.exists(path) else None

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
        color = scale_albedo(color, mean)
        normal = img('normal', 'RGB')
        rough = img('rough', 'L') or Image.new('L', (size, size), 200)
        if name in EVENER:
            m = sum(i * n for i, n in enumerate(rough.histogram())) / (size * size)
            rough = rough.point(lambda v, m=m, e=EVENER[name]: round(m + (v - m) * e))
        if name in ROUGHER:
            rough = rough.point(lambda v, k=ROUGHER[name]: min(255, round(v * k)))
        nx, ny, _ = normal.split()
        surf = Image.merge('RGB', (nx, ny, rough))
        files = []
        for image, suffix in ((color, ''), (surf, '_surface')):
            path = os.path.join(out_dir, f'tile_{name}{suffix}.webp')
            image.save(path, 'WEBP', quality=90, method=6)
            files.append(os.path.basename(path))
            print('texture', path, os.path.getsize(path), 'bytes')
        out[name] = files
    return out


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
    layers['tiles'] = {'size': TILE_SIZE, 'layers': tiles,
                       'repeat': {name: round(1 / metres, 3) for name, (_, _, metres, _) in TILES.items()}}
    with open(manifest, 'w', encoding='utf-8') as f:
        json.dump(layers, f, indent=1)
    print('wrote', manifest)
