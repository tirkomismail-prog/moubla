"""MakeHuman community assets used by the soldier: skin, eyes, eyebrows,
eyelashes, hair and beards (CC0, see assets/characters/CREDITS.md).

The asset packs are downloaded once into a cache folder, fitted to the body
with MPFB (which also transfers the skin weights) and their textures are
packed into the texture layers the game samples (see `LAYERS`).
"""
import os
import urllib.request
import zipfile

import bmesh

PACK_URL = 'https://files2.makehumancommunity.org/asset_packs/{pack}/{zip}'
PACKS = {
    'makehuman_system_assets': 'makehuman_system_assets_cc0.zip',
    'skins02': 'skins02_cc0.zip',
    'bodyparts05': 'bodyparts05_cc0.zip',
}

SYSTEM = 'makehuman_system_assets'

# part name -> (pack, mhclo file in the pack, MPFB asset type, texture in the pack)
FITTED = {
    'Eyes': (SYSTEM, 'eyes/low-poly/low-poly.mhclo', 'Eyes', 'eyes/materials/brownlight_eye.png'),
    'Brows': (SYSTEM, 'eyebrows/eyebrow001/eyebrow001.mhclo', 'Eyebrows', 'eyebrows/eyebrow001/eyebrow001.png'),
    'Lashes': (SYSTEM, 'eyelashes/eyelashes01/eyelashes01.mhclo', 'Eyelashes', 'eyelashes/eyelashes01/eyelashes01.png'),
    'Hair': (SYSTEM, 'hair/short02/short02.mhclo', 'Hair', 'hair/short02/short02_diffuse.png'),
    'Beard': ('bodyparts05', 'clothes/rehmanpolanski_beard_viking/rehmanpolanski_beard_viking.mhclo', 'Clothes',
              'clothes/rehmanpolanski_beard_viking/BeardViking.png'),
    'Moustache': ('bodyparts05', 'clothes/rehmanpolanski_moustache_viking/rehmanpolanski_moustache_viking.mhclo', 'Clothes',
                  'clothes/rehmanpolanski_moustache_viking/MoustacheViking.png'),
}

SKINS = {
    'skin': (SYSTEM, 'skins/middleage_caucasian_male/middleage_lightskinned_male_diffuse.png'),
    'skin_stubble': ('skins02', 'skins/jartur69_middleage_slavic_male_with_genitals_and_beard/'
                                'Jartur_mid_old_Slavic_Male_with_Genitals_and_Beard_lsdif_lighter.png'),
}

# Texture layers (all LAYER_SIZE squared). Small textures share the `face`
# layer, one quarter each: (layer, x, y) of the quarter, y from the top.
LAYER_SIZE = 1024
LAYERS = ['skin', 'skin_stubble', 'hair', 'beard', 'face']
PLACE = {
    'Body': ('skin', None),
    'Hair': ('hair', None),
    'Beard': ('beard', None),
    'Brows': ('face', (0, 0)),
    'Lashes': ('face', (1, 0)),
    'Eyes': ('face', (0, 1)),
    'Moustache': ('face', (1, 1)),
}
# hair-like textures are stored grey (the game tints them with the hair colour)
TINTED = {'hair', 'beard', 'Brows', 'Moustache'}
# parts made of cards with transparent texture: seen from both sides
CARDS = {'Hair', 'Beard', 'Moustache', 'Brows', 'Lashes'}


def fetch(cache):
    """Download and unpack the asset packs that are not in `cache` yet."""
    os.makedirs(cache, exist_ok=True)
    for pack, name in PACKS.items():
        folder = os.path.join(cache, pack)
        if os.path.isdir(folder):
            continue
        path = os.path.join(cache, name)
        if not os.path.exists(path):
            url = PACK_URL.format(pack=pack, zip=name)
            print('downloading', url)
            urllib.request.urlretrieve(url, path)
        with zipfile.ZipFile(path) as z:
            z.extractall(folder)


def pack_file(cache, pack, rel):
    return os.path.join(cache, pack, rel)


def fit(hs, human, cache):
    """Fit the eyes, eyebrows, eyelashes, hair and beards to the body; they
    are skinned to the same rig. Returns {part name: object}."""
    out = {}
    for name, (pack, mhclo, kind, _) in FITTED.items():
        obj = hs.add_mhclo_asset(pack_file(cache, pack, mhclo), human, asset_type=kind, subdiv_levels=0, material_type='NONE')
        obj.name = name
        obj.data.name = name
        for m in list(obj.modifiers):
            if m.type != 'ARMATURE':
                obj.modifiers.remove(m)
        out[name] = obj
    return out


def place_uvs(obj, part):
    """Move a part's UVs into its quarter of a shared layer; keep only one UV map."""
    me = obj.data
    while len(me.uv_layers) > 1:
        me.uv_layers.remove(me.uv_layers[-1])
    if not me.uv_layers:
        return
    me.uv_layers[0].name = 'UVMap'
    spot = PLACE.get(part, (None, None))[1]
    if spot is None:
        return
    qx, qy = spot
    for d in me.uv_layers[0].data:
        u, v = d.uv
        # Blender's v grows upwards, image rows downwards
        d.uv = (qx * 0.5 + u * 0.5, (1 - qy) * 0.5 + v * 0.5)


def double_side(obj):
    """Add back faces to a card mesh (the game culls back faces)."""
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    faces = list(bm.faces)
    dup = bmesh.ops.duplicate(bm, geom=faces)
    back = [g for g in dup['geom'] if isinstance(g, bmesh.types.BMFace)]
    bmesh.ops.reverse_faces(bm, faces=back)
    bm.to_mesh(obj.data)
    bm.free()


def write_textures(cache, out_dir):
    """Build the texture layers from the asset textures. Each layer is saved
    as an opaque colour image, plus a grey alpha image if it has transparent
    parts (browsers lose the colour of fully transparent texels when they
    decode an image with alpha, which would darken the edges of the hair).
    Returns the layers as [colour file, alpha file or None]."""
    from PIL import Image, ImageOps

    size = LAYER_SIZE
    os.makedirs(out_dir, exist_ok=True)
    rgb = {name: Image.new('RGB', (size, size), (128, 128, 128)) for name in LAYERS}
    alpha = {name: Image.new('L', (size, size), 255) for name in LAYERS}

    def load(pack, rel):
        return Image.open(pack_file(cache, pack, rel)).convert('RGBA')

    def split(img, tinted):
        """Colour with the transparent texels filled with the mean visible
        colour (grey and brightened to a mean of 0.8 if `tinted`), alpha."""
        a = img.getchannel('A')
        mask = a.point(lambda x: 255 if x > 128 else 0)
        col = img.convert('RGB')
        if tinted:
            lum = ImageOps.grayscale(col)
            hist = lum.histogram(mask=mask)
            mean = sum(i * h for i, h in enumerate(hist)) / max(1, sum(hist))
            k = 0.8 * 255 / max(mean, 1)
            lum = lum.point(lambda x: min(255, int(x * k)))
            col = Image.merge('RGB', (lum, lum, lum))
        stat = [sum(i * h for i, h in enumerate(col.getchannel(c).histogram(mask=mask))) / max(1, sum(col.getchannel(c).histogram(mask=mask)))
                for c in range(3)]
        fill = Image.new('RGB', col.size, tuple(int(v) for v in stat))
        fill.paste(col, (0, 0), a.point(lambda x: 255 if x > 0 else 0))
        return fill, a

    for name, (pack, rel) in SKINS.items():
        rgb[name] = load(pack, rel).convert('RGB').resize((size, size), Image.LANCZOS)
    for part, (layer, spot) in PLACE.items():
        if part == 'Body':
            continue
        pack, _, _, tex = FITTED[part]
        col, a = split(load(pack, tex), part in TINTED or layer in TINTED)
        if spot is None:
            rgb[layer] = col.resize((size, size), Image.LANCZOS)
            alpha[layer] = a.resize((size, size), Image.LANCZOS)
        else:
            half = size // 2
            at = (spot[0] * half, spot[1] * half)
            rgb[layer].paste(col.resize((half, half), Image.LANCZOS), at)
            alpha[layer].paste(a.resize((half, half), Image.LANCZOS), at)
    files = []
    for name in LAYERS:
        entry = []
        for img, suffix in ((rgb[name], ''), (alpha[name], '_alpha')):
            if suffix and img.getextrema()[0] == 255:
                entry.append(None)
                continue
            path = os.path.join(out_dir, f'{name}{suffix}.webp')
            img.save(path, 'WEBP', quality=88, method=6)
            entry.append(os.path.basename(path))
            print('texture', path, os.path.getsize(path), 'bytes')
        files.append(entry)
    return files
