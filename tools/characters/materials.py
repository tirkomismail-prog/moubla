"""Tileable surface textures for the clothes and armour (CC0, ambientCG),
see assets/characters/CREDITS.md. The game picks a material for each
garment by the soldier's armour (src/battle/character.js)."""
import os
import urllib.request
import zipfile

URL = 'https://ambientcg.com/get?file={id}_1K-JPG.zip'

# material -> (ambientCG asset, metres covered by one repeat of the texture,
# mean albedo (linear) the colour is scaled to: light for cloth the game
# tints, like real steel for the metals)
TILES = {
    'wool': ('Fabric062', 0.22, 0.75),
    'quilted': ('Fabric008', 0.32, 0.5),
    'leather': ('Leather014', 0.45, 0.1),
    'mail': ('Chainmail004', 0.1, 0.35),
    'plate': ('Metal038', 0.6, 0.5),
    'lamellar': ('Metal039', 0.35, 0.4),
}
TILE_SIZE = 512


def fetch(cache):
    for asset, _, _ in TILES.values():
        folder = os.path.join(cache, 'ambientcg', asset)
        if os.path.isdir(folder):
            continue
        os.makedirs(folder, exist_ok=True)
        path = folder + '.zip'
        if not os.path.exists(path):
            url = URL.format(id=asset)
            print('downloading', url)
            req = urllib.request.Request(url, headers={'User-Agent': 'moubla-build'})
            with urllib.request.urlopen(req) as r, open(path, 'wb') as f:
                f.write(r.read())
        with zipfile.ZipFile(path) as z:
            z.extractall(folder)


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
    for name, (asset, _, mean) in TILES.items():
        folder = os.path.join(cache, 'ambientcg', asset)

        def img(kind, mode):
            path = os.path.join(folder, f'{asset}_1K-JPG_{kind}.jpg')
            return Image.open(path).convert(mode).resize((size, size), Image.LANCZOS) if os.path.exists(path) else None

        color = img('Color', 'RGB')
        opacity = img('Opacity', 'L')
        if opacity is not None:
            # gaps between the rings of mail: the dark padding underneath
            dark = opacity.point(lambda x: int(60 + 195 * x / 255))
            color = ImageChops.multiply(color, Image.merge('RGB', (dark, dark, dark)))
        color = scale_albedo(color, mean)
        normal = img('NormalGL', 'RGB')
        rough = img('Roughness', 'L') or Image.new('L', (size, size), 200)
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
