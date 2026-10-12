"""MakeHuman community assets used by the soldier: skin, eyes, eyebrows,
eyelashes, hair, beards, gloves and a hood (CC0, see assets/characters/CREDITS.md).

The asset packs are downloaded once into a cache folder, fitted to the body
with MPFB (which also transfers the skin weights) and their textures are
packed into the texture layers the game samples (see `LAYERS`).
"""
import hashlib
import io
import os
import urllib.request
import zipfile

import bmesh

PACK_URL = 'https://files2.makehumancommunity.org/asset_packs/{pack}/{zip}'
PACKS = {
    'makehuman_system_assets': 'makehuman_system_assets_cc0.zip',
    'skins02': 'skins02_cc0.zip',
    'bodyparts05': 'bodyparts05_cc0.zip',
    'gloves01': 'gloves01_cc0.zip',
}

# single files of big packs, read out of the zip on the server (HTTP Range
# requests) instead of downloading all of it: pack -> (zip, {file: sha256})
MEMBERS = {
    'suits02': ('suits02_cc0.zip', {
        'clothes/donitz_monk_robe_hood/donitz_monk_robe_hood.mhclo':
            '5f32a69d26f68b9c5dd9076e9b6859c154291759726831def4bc5c7afc315aa7',
        'clothes/donitz_monk_robe_hood/Monks_Hood.obj':
            '989f2632ccce50d4cf99973167ecc10e6f33911a60e8e378d50d8b30d06306fc',
        'clothes/rehmanpolanski_viking_tunic/rehmanpolanski_viking_tunic.mhclo':
            '349b5b7b2abc44a7bd0b52ca99bd352e7d3b316cd4be5d539bbd9587462e801c',
        'clothes/rehmanpolanski_viking_tunic/tunicviking.obj':
            '78c593d23151c4f9cd63481bd7f5101cae920623404bbf5f3daa01a5f2ea050b',
        # (only to find the mail on the tunic, see viking.py)
        'clothes/rehmanpolanski_viking_tunic/TUNIC_Viking.png':
            '9fcb9e17fad6ec1a36e3a0e0562cac3ca0ea72208da617875eed9bf294d9f870',
        'clothes/rehmanpolanski_viking_pants/rehmanpolanski_viking_pants.mhclo':
            '2afe050edefda93d4e47a58b31e6e65a14ac09e0d466d9debcacbe376f956c0f',
        'clothes/rehmanpolanski_viking_pants/pantsviking.obj':
            '44644ac6aeec9cb56fbfd77225eaa8b02613b2587cd809fe6f3755bef7e2d709',
        'clothes/rehmanpolanski_viking_boots/rehmanpolanski_viking_boots.mhclo':
            'd864ac895a662031026615b5e042fb2160e63f432029576fa6faaf2ad692eb92',
        'clothes/rehmanpolanski_viking_boots/bootsviking.obj':
            '9cc5a9cc4160ff2230144490244117eaddc4596152556304ca59d1129e4c196b',
    }),
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

# garments from the packs (pieces of the outfits, coloured by the game's
# tiles, so their textures are not used): part name -> (pack, mhclo file)
GARMENTS = {
    'Gloves': ('gloves01', 'clothes/toigo_gloves_short/toigo_gloves_short.mhclo'),
    'Hood': ('suits02', 'clothes/donitz_monk_robe_hood/donitz_monk_robe_hood.mhclo'),
    'VikingTunic': ('suits02', 'clothes/rehmanpolanski_viking_tunic/rehmanpolanski_viking_tunic.mhclo'),
    'VikingPants': ('suits02', 'clothes/rehmanpolanski_viking_pants/rehmanpolanski_viking_pants.mhclo'),
    'VikingBoots': ('suits02', 'clothes/rehmanpolanski_viking_boots/rehmanpolanski_viking_boots.mhclo'),
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
    """Download and unpack the asset packs (and files of packs, MEMBERS) that
    are not in `cache` yet."""
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
    fetch_members(cache)


class RemoteFile(io.RawIOBase):
    """A file on a web server, read in pieces as it is asked for (HTTP Range)."""

    def __init__(self, url):
        self.url = url
        self.pos = 0
        with urllib.request.urlopen(urllib.request.Request(url, method='HEAD'), timeout=60) as r:
            self.size = int(r.headers['Content-Length'])

    def readable(self):
        return True

    def seekable(self):
        return True

    def tell(self):
        return self.pos

    def seek(self, offset, whence=0):
        self.pos = offset if whence == 0 else self.pos + offset if whence == 1 else self.size + offset
        return self.pos

    def readinto(self, b):
        n = min(len(b), self.size - self.pos)
        if n <= 0:
            return 0
        req = urllib.request.Request(self.url, headers={'Range': f'bytes={self.pos}-{self.pos + n - 1}'})
        with urllib.request.urlopen(req, timeout=120) as r:
            if r.status != 206:
                raise RuntimeError(f'{self.url}: the server does not send parts of the file (HTTP {r.status})')
            data = r.read()
        b[:len(data)] = data
        self.pos += len(data)
        return len(data)


def fetch_members(cache):
    """Read the files of MEMBERS that are not in `cache` yet out of their packs
    (checked against their sha256)."""
    for pack, (name, files) in MEMBERS.items():
        missing = {f: h for f, h in files.items() if not os.path.exists(os.path.join(cache, pack, f))}
        if not missing:
            continue
        url = PACK_URL.format(pack=pack, zip=name)
        print('reading', len(missing), 'files out of', url)
        with zipfile.ZipFile(io.BufferedReader(RemoteFile(url), buffer_size=1 << 16)) as z:
            for f, sha in missing.items():
                data = z.read(f)
                if hashlib.sha256(data).hexdigest() != sha:
                    raise RuntimeError(f'{pack}/{f}: not the expected file')
                path = os.path.join(cache, pack, f)
                os.makedirs(os.path.dirname(path), exist_ok=True)
                with open(path, 'wb') as out:
                    out.write(data)


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


def fit_garments(hs, human, cache):
    """Fit the garments of GARMENTS to the body (skinned to the same rig).
    Returns {part name: object}."""
    out = {}
    for name, (pack, mhclo) in GARMENTS.items():
        obj = hs.add_mhclo_asset(pack_file(cache, pack, mhclo), human, asset_type='Clothes', subdiv_levels=0, material_type='NONE')
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
