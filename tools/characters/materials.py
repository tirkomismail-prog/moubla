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
# tints, like real steel for the metals)
TILES = {
    'wool': ('ambientcg', 'Fabric062', 0.22, 0.75),
    'quilted': ('ambientcg', 'Fabric008', 0.32, 0.5),
    'leather': ('ambientcg', 'Leather014', 0.45, 0.1),
    'mail': ('ambientcg', 'Chainmail004', 0.1, 0.35),
    'plate': ('ambientcg', 'Metal038', 0.6, 0.5),
    'lamellar': ('ambientcg', 'Metal039', 0.35, 0.4),
    'fur': ('polyhaven', 'curly_teddy_natural', 0.2, 0.3),
    'wood': ('ambientcg', 'Wood060', 0.35, 0.18),
    'planks': ('ambientcg', 'Planks039', 0.7, 0.3),
    'paint': ('ambientcg', 'PaintedWood003', 0.5, 0.6),
}
# made grey (the game paints them in the team colours)
GREY = {'paint'}
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
    """Scale an sRGB image so that its mean linear luminance is `mean`."""
    def lin(c):
        c /= 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    def srgb(v):
        v = min(1.0, max(0.0, v))
        return round(255 * (v * 12.92 if v <= 0.0031308 else 1.055 * v ** (1 / 2.4) - 0.055))

    small = img.resize((64, 64))
    px = [small.getpixel((x, y)) for y in range(64) for x in range(64)]
    lum = sum(0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b) for r, g, b in px) / len(px)
    k = mean / max(lum, 1e-4)
    table = [srgb(lin(i) * k) for i in range(256)]
    return img.point(table * 3)


def write_tiles(cache, out_dir):
    """For each material a colour image and a 'surface' image (normal x, y
    and roughness in red, green, blue). Returns {material: [colour, surface]}."""
    from PIL import Image, ImageChops

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
        color = scale_albedo(color, mean)
        normal = img('normal', 'RGB')
        rough = img('rough', 'L') or Image.new('L', (size, size), 200)
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
