"""Build the ground textures of the battles (Python with Pillow and numpy):

    python tools/ground/build_ground.py --out assets/ground

Photographed ground surfaces from Poly Haven and ambientCG (CC0, downloaded
into --cache).
Per layer two images:
- <name>.webp: the colour (1024 px), darkened in the hollows by the
  ambient occlusion map;
- <name>_surface.webp: the surface (512 px, linear): red and green the
  normal (OpenGL convention: green up in the image), blue the height
  (0..1 over the texture), for blending the layers by height (grass
  grows between the stones, sand fills the hollows).
ground.json lists the layers with the metres one repeat covers (the size
Poly Haven gives), their roughness and their mean colour (the far terrain).
"""
import argparse
import io
import json
import os
import urllib.request
import zipfile

import numpy as np
from PIL import Image, ImageFilter

API = 'https://api.polyhaven.com/'
ACG = 'https://ambientcg.com/'
COLOR = 1024
SURFACE = 512

# name -> Poly Haven asset (acg:<id> an ambientCG one), roughness, options: 'clean' (dark specks such
# as twigs on snow painted over with the surrounding colour, no ambient
# occlusion), a number (the mean brightness, linear, the photo is scaled
# to: photographed snow comes out grey)
LAYERS = {
    'meadow': ('acg:Grass004', 0.95),
    'moss_ground': ('acg:Ground037', 0.95),
    'grass_twigs': ('forrest_ground_01', 0.95),
    'dry_grass': ('grass_ground', 0.95),
    'dirt': ('forest_ground_04', 0.9),
    'needles': ('forrest_ground_03', 0.95),
    'cracked_earth': ('dry_ground_01', 0.9),
    'sand_gravel': ('sandy_gravel_02', 0.9),
    'snow': ('snow_02', 0.75, 'clean', 0.62),
    'trodden_snow': ('snow_03', 0.8, 0.4),
    'mossy_rock': ('mossy_rock', 0.85),
    'rock': ('rock_face', 0.85),
}


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('--out', default='assets/ground')
    p.add_argument('--cache', default=os.path.join(os.path.expanduser('~'), '.cache', 'polyhaven-ground'))
    return p.parse_args()


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'moubla-build'})
    with urllib.request.urlopen(req) as r:
        return r.read()


def cached(cache, name, url):
    path = os.path.join(cache, name)
    if not os.path.exists(path):
        os.makedirs(cache, exist_ok=True)
        print('downloading', url)
        data = get(url)
        with open(path + '.part', 'wb') as f:
            f.write(data)
        os.replace(path + '.part', path)
    with open(path, 'rb') as f:
        return f.read()


def acg_maps(cache, asset):
    """The same from ambientCG (a zip of the 2K images)."""
    data = cached(cache, f'{asset}_2K-JPG.zip', ACG + f'get?file={asset}_2K-JPG.zip')
    info = json.loads(cached(cache, f'{asset}_acg.json', ACG + f'api/v2/full_json?id={asset}&include=dimensionsData'))['foundAssets'][0]
    out = {}
    with zipfile.ZipFile(io.BytesIO(data)) as z:
        for key, suffix in (('Diffuse', 'Color'), ('nor_gl', 'NormalGL'), ('Displacement', 'Displacement'), ('AO', 'AmbientOcclusion')):
            name = f'{asset}_2K-JPG_{suffix}.jpg'
            if name in z.namelist():
                out[key] = Image.open(io.BytesIO(z.read(name)))
    meta = {'name': info.get('displayName', asset), 'authors': {'ambientCG (Lennart Demes)': 'All'}, 'url': f'https://ambientcg.com/a/{asset}'}
    return out, (info.get('dimensionX') or 200) / 100, meta


def maps(cache, asset):
    """Colour, normal, height and ambient occlusion images of an asset, and
    its size in metres."""
    if asset.startswith('acg:'):
        return acg_maps(cache, asset[4:])
    files = json.loads(cached(cache, f'{asset}.json', API + 'files/' + asset))
    info = json.loads(cached(cache, f'{asset}_info.json', API + 'info/' + asset))
    out = {}
    for key, res in (('Diffuse', '2k'), ('nor_gl', '1k'), ('Displacement', '1k'), ('AO', '1k')):
        if key not in files:
            continue
        url = files[key][res]['jpg']['url']
        out[key] = Image.open(io.BytesIO(cached(cache, f'{asset}_{key}_{res}.jpg', url)))
    return out, info['dimensions'][0] / 1000, info


def srgb_to_linear(c):
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def build(args):
    os.makedirs(args.out, exist_ok=True)
    manifest = {'size': COLOR, 'surfaceSize': SURFACE, 'layers': {}}
    credits = []
    for name, (asset, rough, *opts) in LAYERS.items():
        m, metres, info = maps(args.cache, asset)
        color = m['Diffuse'].convert('RGB').resize((COLOR, COLOR), Image.LANCZOS)
        c = np.asarray(color, dtype=np.float32) / 255
        if 'clean' in opts:
            around = np.asarray(color.filter(ImageFilter.MedianFilter(21)), dtype=np.float32) / 255
            dark = (around.mean(2) - c.mean(2)) > 0.03
            dark = np.asarray(Image.fromarray(dark.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(3)), dtype=np.float32)[..., None] / 255
            c = c * (1 - dark) + around * dark
        if 'AO' in m and 'clean' not in opts:
            ao = np.asarray(m['AO'].convert('L').resize((COLOR, COLOR), Image.LANCZOS), dtype=np.float32) / 255
            c = c * (0.55 + 0.45 * ao[..., None])
        # the photo's uneven light (brighter on one side of the tile) flattened:
        # repeated, it would draw stripes across the field
        # (blurred as a tile among copies of itself: no seams at its edges)
        tiled = Image.fromarray((np.tile(np.clip(c, 0, 1), (3, 3, 1)) * 255).astype(np.uint8))
        low = np.asarray(tiled.filter(ImageFilter.GaussianBlur(COLOR / 12)), dtype=np.float32)[COLOR:2 * COLOR, COLOR:2 * COLOR] / 255
        c = c * (c.reshape(-1, 3).mean(0) / np.maximum(low, 1e-3))
        target = next((o for o in opts if isinstance(o, float)), None)
        if target:
            lin = srgb_to_linear(c)
            lin *= target / lin.mean()
            c = np.where(lin <= 0.0031308, lin * 12.92, 1.055 * np.clip(lin, 0, 1) ** (1 / 2.4) - 0.055)
        Image.fromarray((np.clip(c, 0, 1) * 255 + 0.5).astype(np.uint8)).save(os.path.join(args.out, f'{name}.webp'), 'WEBP', quality=86, method=6)
        mean = srgb_to_linear(np.clip(c, 0, 1)).reshape(-1, 3).mean(0)
        nrm = np.asarray(m['nor_gl'].convert('RGB').resize((SURFACE, SURFACE), Image.LANCZOS), dtype=np.uint8)
        hgt = np.asarray(m['Displacement'].convert('L').resize((SURFACE, SURFACE), Image.LANCZOS), dtype=np.float32)
        lo, hi = np.percentile(hgt, 1), np.percentile(hgt, 99)
        hgt = np.clip((hgt - lo) / max(hi - lo, 1), 0, 1)
        surface = np.dstack([nrm[..., 0], nrm[..., 1], (hgt * 255 + 0.5).astype(np.uint8)])
        Image.fromarray(surface).save(os.path.join(args.out, f'{name}_surface.webp'), 'WEBP', quality=92, method=6)
        manifest['layers'][name] = {
            'color': f'{name}.webp', 'surface': f'{name}_surface.webp', 'tile': round(metres, 3),
            'roughness': rough, 'mean': [round(float(v), 4) for v in mean],
        }
        authors = ', '.join(info.get('authors', {}).keys())
        url = info.get('url', f'https://polyhaven.com/a/{asset}')
        credits.append(f'- **{name}**: "{info.get("name", asset)}" ({url}) by {authors}')
        print(f'{name:14s} {asset:20s} {metres:5.2f} m  mean {np.round(mean, 3)}')
    with open(os.path.join(args.out, 'ground.json'), 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=1)
    with open(os.path.join(args.out, 'CREDITS.md'), 'w', encoding='utf-8') as f:
        f.write('# Ground texture credits\n\n'
                'The textures here are generated by `tools/ground/build_ground.py` from these Poly Haven and\n'
                'ambientCG textures, all **CC0 1.0** (public domain); the script downloads them itself.\n\n'
                + '\n'.join(credits) + '\n\n'
                '`grass*.webp` (`tools/ground/build_grass.py`): clumps of "Grass Medium 01"\n'
                '(https://polyhaven.com/a/grass_medium_01, Rob Tuytel and Rico Cilliers) and "Grass Medium 02"\n'
                '(https://polyhaven.com/a/grass_medium_02, Rico Cilliers), Poly Haven, CC0, rendered from the side.\n')


if __name__ == '__main__':
    build(parse_args())
