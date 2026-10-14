// Materials of the realistic models (soldiers, horses): each model is one
// skinned mesh whose vertices carry the number of their part (_part); a
// palette per look gives each part its colour, roughness, metalness, texture
// layer, normal map and tileable material, and can hide a part (no beard,
// hair under a helmet). Also the decoding of the packed textures.
import * as THREE from 'three';
import { MeshoptSimplifier } from 'meshoptimizer/simplifier';
import { bcSupport, encodeLayer, noteTextureMemory } from './bc.js';

export function bytesOf(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// The RGBA8 pixels of a WebP (or PNG) image (base64), drawn at size x
// size; with `alpha` (another image) its grey in the alpha channel. (Masks
// never go in a WebP's own alpha: the canvas premultiplies it.)
export async function pixels(size, b64, alpha = null) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const draw = async (b) => {
    const type = b.startsWith('iVBORw0KGgo') ? 'image/png' : 'image/webp';
    const img = await createImageBitmap(new Blob([bytesOf(b)], { type }));
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);
    img.close();
    return new Uint8Array(ctx.getImageData(0, 0, size, size).data.buffer);
  };
  const data = await draw(b64);
  if (alpha) {
    const a = await draw(alpha);
    for (let k = 0; k < size * size; k++) data[k * 4 + 3] = a[k * 4];
  }
  return data;
}

// Layers as one array texture: block-compressed (bc.js: the mipmaps of
// each layer, encoded) or as RGBA8 pixels (size x size each; a mask, `red`,
// keeps only the red: R8). Pixel rows go up the texture (row 0 at v = 0)
// either way.
// colour (sRGB) layers as BC3, normal maps as BC5, masks as BC4, if the
// browser can
const KIND = (colorSpace) => (colorSpace === THREE.SRGBColorSpace ? 'bc3s' : 'bc5');
const FORMAT = { bc3s: THREE.RGBA_S3TC_DXT5_Format, bc5: THREE.RED_GREEN_RGTC2_Format, bc4: THREE.RED_RGTC1_Format };
function compressedArray(chains, size, colorSpace, kind = KIND(colorSpace)) {
  const mipmaps = chains[0].map((first, level) => {
    const data = new Uint8Array(first.length * chains.length);
    chains.forEach((c, i) => data.set(c[level], i * first.length));
    const s = Math.max(1, size >> level);
    return { data, width: s, height: s };
  });
  const texture = new THREE.CompressedArrayTexture(mipmaps, size, size, chains.length, FORMAT[kind]);
  texture.userData.bytes = mipmaps.reduce((n, m) => n + m.data.length, 0);
  return finish(texture, colorSpace);
}

function rawArray(layers, size, colorSpace, red = false) {
  const n = size * size;
  const data = new Uint8Array(n * (red ? 1 : 4) * layers.length);
  if (red) layers.forEach((l, i) => { for (let k = 0; k < n; k++) data[i * n + k] = l[k * 4]; });
  else layers.forEach((l, i) => data.set(l, i * n * 4));
  const texture = new THREE.DataArrayTexture(data, size, size, layers.length);
  if (red) texture.format = THREE.RedFormat;
  texture.generateMipmaps = true;
  texture.userData.bytes = Math.round((data.length * 4) / 3);
  return finish(texture, colorSpace);
}

// (what the layers take in video memory, for the benchmark's report)
function note(texture) {
  noteTextureMemory(texture.userData.bytes, texture.image.depth, !!texture.isCompressedArrayTexture);
  return texture;
}

function finish(texture, colorSpace) {
  texture.colorSpace = colorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

// (a failure is caught where all the layers are awaited, maybe later)
const quiet = (job) => {
  job.catch(() => {});
  return job;
};


// Texture layers as one array texture. Each layer is a colour image plus,
// for see-through ones, a separate alpha image (sRGB colour), or a normal
// map (NoColorSpace: only its x and y are kept, the shader works out z).
// `layers`: {name: [image, alpha image or null]} (base64 WebP). Each layer
// goes to the workers as soon as it is drawn.
export async function decodeLayers(size, layers, colorSpace, compress = true) {
  const names = Object.keys(layers);
  const index = Object.fromEntries(names.map((n, i) => [n, i]));
  const kind = KIND(colorSpace);
  const zip = compress && bcSupport()[kind];
  const out = [];
  for (const n of names) {
    const px = await pixels(size, layers[n][0], colorSpace === THREE.SRGBColorSpace ? layers[n][1] : null);
    out.push(zip ? quiet(encodeLayer(px, size, kind)) : px);
  }
  if (!zip) return { texture: note(rawArray(out, size, colorSpace)), size, index };
  try {
    return { texture: note(compressedArray(await Promise.all(out), size, colorSpace)), size, index };
  } catch (e) {
    // (the workers failed, and the pixels went with them)
    console.warn('Texture compression failed, layers left uncompressed:', e);
    return decodeLayers(size, layers, colorSpace, false);
  }
}

// Tileable cloth and armour materials: a colour array with the roughness in
// its alpha (BC3 keeps that alpha well) and a surface array with the normal
// (x, y), and how often each repeats per metre. The images: colour, and
// surface (normal x, y, roughness). A few have a second material (the
// lamellar's lacing, a brigandine's rivets: a tint and metalness of their
// own, see partLook): a mask array of those only, where it is (masks.size
// each, maskIndex its layer).
export async function decodeTiles(tiles, compress = true) {
  const { size, layers, repeat, masks = { size: 0, layers: {} } } = tiles;
  const names = Object.keys(layers);
  const zipColor = compress && bcSupport().bc3s;
  const zipSurface = compress && bcSupport().bc5;
  const colors = [];
  const surfaces = [];
  for (const n of names) {
    const [col, surf] = await Promise.all([pixels(size, layers[n][0]), pixels(size, layers[n][1])]);
    for (let k = 0; k < size * size; k++) col[k * 4 + 3] = surf[k * 4 + 2];
    colors.push(zipColor ? quiet(encodeLayer(col, size, 'bc3s')) : col);
    surfaces.push(zipSurface ? quiet(encodeLayer(surf, size, 'bc5')) : surf);
  }
  const index = Object.fromEntries(names.map((n, i) => [n, i]));
  const masked = Object.keys(masks.layers);
  const maskIndex = Object.fromEntries(masked.map((n, i) => [n, i]));
  const zipMask = compress && bcSupport().bc4;
  const maskPixels = [];
  for (const n of masked) {
    const px = await pixels(masks.size, masks.layers[n]);
    maskPixels.push(zipMask ? quiet(encodeLayer(px, masks.size, 'bc4')) : px);
  }
  try {
    const [c, s, m] = await Promise.all([Promise.all(colors), Promise.all(surfaces), Promise.all(maskPixels)]);
    const color = zipColor ? compressedArray(c, size, THREE.SRGBColorSpace) : rawArray(c, size, THREE.SRGBColorSpace);
    const surface = zipSurface ? compressedArray(s, size, THREE.NoColorSpace) : rawArray(s, size, THREE.NoColorSpace);
    const mask = !m.length ? null
      : zipMask ? compressedArray(m, masks.size, THREE.NoColorSpace, 'bc4') : rawArray(m, masks.size, THREE.NoColorSpace, true);
    return { color: note(color), surface: note(surface), mask: mask && note(mask), index, maskIndex, repeat };
  } catch (e) {
    console.warn('Texture compression failed, tiles left uncompressed:', e);
    return decodeTiles(tiles, false);
  }
}

// a part's look: a plain colour, or a tint of a tileable material (see
// tools/characters/materials.py) with a factor for the roughness it gives,
// and for a tile with a second material its {color, metalness} (its
// roughness is the tile's own)
export const surface = (color, roughness, metalness = 0) => ({ color, roughness, metalness });
export const tiled = (tile, color, roughness = 1, metalness = 0, second = null) => ({ color, roughness, metalness, tile, second });

// Each model's own look is a row of a palette texture (PalettePool): per
// part four texels, (colour, roughness), (metalness, texture layer, kind,
// normal map layer), (tile, tile repeats per metre, hidden, the tile's mask
// layer), (mark colour, or the tile's second material: colour, metalness).
// The row comes with the model's meshes (boneBase.y, see poolBones), so one
// material draws all the models of a kind in a battle.
const PALETTE_TEXELS = 4;
const PART_VERTEX = `
  attribute float _part;
  attribute vec4 boneBase;
  uniform highp sampler2D partPalette;
  varying vec3 vPartTex;
  varying vec3 vPartTile;
  varying vec2 vPartUv;`;
const PART_BEGIN = `
  int part = int(_part + 0.5);
  int partRow = int(boneBase.y + 0.5);
  vec4 pal0 = texelFetch(partPalette, ivec2(part * ${PALETTE_TEXELS}, partRow), 0);
  vec4 pal1 = texelFetch(partPalette, ivec2(part * ${PALETTE_TEXELS} + 1, partRow), 0);
  vec4 pal2 = texelFetch(partPalette, ivec2(part * ${PALETTE_TEXELS} + 2, partRow), 0);
  vPartTex = pal1.yzw;
  vPartTile = pal2.xyw;
  vPartUv = uv;`;
// moves the vertices of a hidden part out of the view: its triangles vanish
const HIDE_VERTEX = `
  if (pal2.z > 0.5) gl_Position = vec4(0.0, 0.0, -2.0, 1.0);`;
// texture layer (x < 0: none), kind (y: 1 see-through card, 2 the alpha
// marks where the colour is markColor instead of the part's) and normal map
// layer (z < 0: none) of a part. Cards are cut out where the texture's alpha
// is below 0.5; the alpha is raised with the mipmap level so that hair does
// not thin out far away.
const PART_FRAGMENT = `
  uniform highp sampler2DArray partLayers;
  uniform float layerSize;
  varying vec3 vPartTex;
  varying vec3 vPartTile;
  varying vec2 vPartUv;
  vec4 partTexel() {
    if (vPartTex.x < -0.5) return vec4(1.0);
    vec4 tex = texture(partLayers, vec3(vPartUv, vPartTex.x));
    if (vPartTex.y > 0.5 && vPartTex.y < 1.5) {
      vec2 dx = dFdx(vPartUv * layerSize);
      vec2 dy = dFdy(vPartUv * layerSize);
      float mip = max(0.0, 0.5 * log2(max(dot(dx, dx), dot(dy, dy))));
      if (tex.a * (1.0 + 0.25 * mip) < 0.5) discard;
    }
    return tex;
  }`;
// Tileable materials: UVs in metres times the repeats per metre (y) of
// layer x (x < 0: none; z: the layer of its second material's mask). The
// colour texture's alpha holds the roughness, the surface texture the
// normal (x, y); there are no tangents, the frame comes from derivatives.
// The normal maps' y is up the image (as ambientCG's NormalGL), and the
// images' rows go down the UVs' v: tileNormal turns it round.
export const TILE_FRAGMENT = `
  uniform highp sampler2DArray tileColor;
  uniform highp sampler2DArray tileSurface;
  vec3 tileNormal(vec2 xy) {
    return vec3(xy.x * 2.0 - 1.0, 1.0 - xy.y * 2.0, 1.0);
  }
  mat3 tileFrame(vec3 eyePos, vec3 n, vec2 uv) {
    vec3 q0 = dFdx(eyePos);
    vec3 q1 = dFdy(eyePos);
    vec2 st0 = dFdx(uv);
    vec2 st1 = dFdy(uv);
    vec3 q1perp = cross(q1, n);
    vec3 q0perp = cross(n, q0);
    vec3 t = q1perp * st0.x + q0perp * st1.x;
    vec3 b = q1perp * st0.y + q0perp * st1.y;
    float det = max(dot(t, t), dot(b, b));
    float scale = det == 0.0 ? 0.0 : inversesqrt(det);
    return mat3(t * scale, b * scale, n);
  }`;

// The bones of a skinned model taken out of the scene into a space of their
// own, the model's: the scene graph no longer walks them and updates their
// world matrices every frame, and the bone matrices (and the bone texture)
// are recomputed only after the model was posed (see posed()). The meshes
// stay in the scene; they are skinned in "detached" mode, which gives the
// same result with bones in the model's space. Items held in a bone's space
// name that space's place in the world (userData.space) for props.js.
// Returns the bones' space: the root for animation clips.
export function ownSpaceSkeleton(object, meshes) {
  object.updateMatrixWorld(true);
  let root = null;
  object.traverse((o) => {
    if (!root && o.isBone) root = o;
  });
  const space = new THREE.Object3D();
  root.parent.matrixWorld.decompose(space.position, space.quaternion, space.scale);
  space.add(root);
  space.updateMatrixWorld(true);
  for (const m of meshes) {
    m.bindMode = THREE.DetachedBindMode;
    m.bindMatrixInverse.copy(m.bindMatrix).invert();
  }
  const skeleton = meshes[0].skeleton;
  const update = skeleton.update;
  skeleton.posed = true;
  skeleton.update = function () {
    if (!this.posed) return;
    update.call(this);
    this.posed = false;
  };
  return space;
}

// A lighter copy of an indexed geometry: its triangles simplified to about
// `share` of them (meshoptimizer) on the same vertices, whose attributes
// (skin weights and all) it shares, only the index is new. `error`: how far
// the surface may move, a share of the model's size. Null without the
// simplifier (simplifierReady, once before).
let simplifier = false;

export async function simplifierReady() {
  try {
    await MeshoptSimplifier.ready;
    simplifier = MeshoptSimplifier.supported;
  } catch (e) {
    console.warn('No mesh simplifier:', e);
  }
  return simplifier;
}

export function simplified(geo, share, error) {
  const pos = geo.getAttribute('position');
  if (!simplifier || !geo.index || !(pos.array instanceof Float32Array) || pos.itemSize !== 3 || pos.isInterleavedBufferAttribute) return null;
  const index = Uint32Array.from(geo.index.array);
  const target = Math.max(3, Math.floor((index.length * share) / 3) * 3);
  const [out] = MeshoptSimplifier.simplify(index, pos.array, 3, target, error);
  const g = new THREE.BufferGeometry();
  for (const [name, a] of Object.entries(geo.attributes)) g.setAttribute(name, a);
  g.setIndex(new THREE.BufferAttribute(pos.count < 65536 ? Uint16Array.from(out) : out, 1));
  return g;
}

// One more level of detail of a skinned model: `geo` drawn like the mesh
// `src` (a level of the model), next to it.
export function lodMesh(src, geo, mat, name) {
  const m = new THREE.SkinnedMesh(geo, mat);
  m.name = name;
  m.position.copy(src.position);
  m.quaternion.copy(src.quaternion);
  m.scale.copy(src.scale);
  m.bind(src.skeleton, src.bindMatrix);
  src.parent.add(m);
  return m;
}

// The bones of all the skinned models of a battle in one texture (instead
// of a texture per skeleton, uploaded and bound again for every model drawn:
// on integrated graphics each such texture costs a stall). Each skeleton
// writes its rows (its boneMatrices are a view into the pool's), the
// texture is uploaded once per frame (flushBones) and stays bound; each
// model's meshes carry where its rows start (the boneBase attribute, one
// value for the whole draw, see SKINNING).
class BonePool {
  constructor() {
    this.skeletons = [];
    this.used = 0;
    this.data = null;
    this.texture = null;
  }

  add(skeleton) {
    const n = skeleton.bones.length;
    if (!this.data || (this.used + n) * 16 > this.data.length) this.grow((this.used + n) * 2);
    const base = this.used;
    this.used += n;
    this.skeletons.push([skeleton, base]);
    this.attach(skeleton, base);
    // (the texture is the pool's: a skeleton let go keeps it)
    skeleton.dispose = () => {};
    return base;
  }

  attach(skeleton, base) {
    const view = this.data.subarray(base * 16, (base + skeleton.bones.length) * 16);
    view.set(skeleton.boneMatrices);
    skeleton.boneMatrices = view;
    if (skeleton.boneTexture && skeleton.boneTexture !== this.texture) skeleton.boneTexture.dispose();
    skeleton.boneTexture = this.texture;
  }

  grow(bones) {
    // 256 bones a row (4 texels each)
    const width = 1024;
    const rows = Math.ceil((bones * 4) / width);
    const data = new Float32Array(width * rows * 4);
    if (this.data) data.set(this.data);
    const old = this.texture;
    this.data = data;
    this.texture = new THREE.DataTexture(data, width, rows, THREE.RGBAFormat, THREE.FloatType);
    this.texture.needsUpdate = true;
    for (const [skeleton, base] of this.skeletons) this.attach(skeleton, base);
    if (old) old.dispose();
  }

  // the posed skeletons' matrices into the texture, one upload
  flush() {
    let posed = false;
    for (const [skeleton] of this.skeletons) {
      if (!skeleton.posed) continue;
      skeleton.update();
      posed = true;
    }
    if (posed) this.texture.needsUpdate = true;
  }
}

const bonePools = new WeakMap();

// Puts a model's skeleton (an ownSpaceSkeleton) into the bone pool of
// `owner` (one per battle) and gives each of `meshes` its own geometry
// (sharing the buffers) with the boneBase attribute: the first bone, the
// model's palette row (partLook), how dirty it is and how worn its clothes'
// edges are (0..1, PART_MASKS).
export function poolBones(owner, skeleton, meshes, row = 0, dirt = 0, wear = 0) {
  let pool = bonePools.get(owner);
  if (!pool) bonePools.set(owner, (pool = new BonePool()));
  const base = new THREE.InstancedBufferAttribute(new Float32Array([pool.add(skeleton), row, dirt, wear]), 4);
  for (const m of meshes) m.geometry = withBoneBase(m.geometry, base);
  return base;
}

// a geometry like `geo` (the same buffers) with the boneBase attribute;
// drawn as one instance (an attribute per instance in a plain draw is not
// read the same way everywhere)
export function withBoneBase(geo, base) {
  const g = new THREE.InstancedBufferGeometry();
  g.instanceCount = 1;
  g.setIndex(geo.index);
  for (const [name, a] of Object.entries(geo.attributes)) if (name !== 'boneBase') g.setAttribute(name, a);
  g.setAttribute('boneBase', base);
  g.boundingSphere = geo.boundingSphere;
  g.boundingBox = geo.boundingBox;
  return g;
}

// once per frame, after posing, before drawing
export function flushBones(owner) {
  const pool = bonePools.get(owner);
  if (pool) pool.flush();
}

// three.js's skinning, with the bones from the pool's rows
const SKINNING = THREE.ShaderChunk.skinning_pars_vertex.replace('int j = int( i ) * 4;', 'int j = ( int( i ) + int( boneBase.x + 0.5 ) ) * 4;');

// after posing the bones of an ownSpaceSkeleton
export function posed(space, skeleton) {
  space.updateMatrixWorld(true);
  skeleton.posed = true;
}

// Shadow-only stand-in of a skinned model: its lightest level of detail
// `lod`, sharing the skeleton, on a layer only the shadow pass draws (see
// Battle.setupRenderer). Characters at the middle distance cast their shadow
// with it instead of with the mesh that is seen. Hidden until used.
export const SHADOW_LAYER = 1;

export function shadowStandIn(lod, mat, sphere) {
  const s = new THREE.SkinnedMesh(lod.geometry, mat);
  s.name = `${lod.name}_shadow`;
  s.position.copy(lod.position);
  s.quaternion.copy(lod.quaternion);
  s.scale.copy(lod.scale);
  s.bind(lod.skeleton, lod.bindMatrix);
  s.bindMode = lod.bindMode;
  s.layers.set(SHADOW_LAYER);
  s.castShadow = true;
  s.customDepthMaterial = mat.userData.depth;
  s.boundingSphere = sphere;
  s.visible = false;
  lod.parent.add(s);
  return s;
}

// A palette texture: a row per model, PALETTE_TEXELS texels per part
// (see PART_VERTEX); grows as models are added.
class PalettePool {
  constructor(parts) {
    this.width = parts * PALETTE_TEXELS;
    this.rows = 0;
    this.data = null;
    this.uniform = { value: null };
  }

  add(row) {
    const size = this.width * 4;
    if (!this.data || (this.rows + 1) * size > this.data.length) this.grow(Math.max(16, this.rows * 2));
    this.data.set(row, this.rows * size);
    this.uniform.value.needsUpdate = true;
    return this.rows++;
  }

  grow(rows) {
    const data = new Float32Array(this.width * rows * 4);
    if (this.data) data.set(this.data);
    const old = this.uniform.value;
    this.data = data;
    this.uniform.value = new THREE.DataTexture(data, this.width, rows, THREE.RGBAFormat, THREE.FloatType);
    this.uniform.value.needsUpdate = true;
    if (old) old.dispose();
  }
}

// per owner (a battle) and program: the palette and the materials
const kinds = new WeakMap();

// The material of one kind of model (o.program: 'soldier', 'horse') in a
// battle (`owner`), and the palette row of one model's look in it.
//   o (the kind)  program, parts (part names in the order of their numbers),
//                 layers (colour layers, decodeLayers), normals (normal map
//                 layers by the same names), tiles (tileable materials,
//                 decodeTiles), mud (colour of the dirt, linear), masks
//                 (the vertex colours are masks, see PART_MASKS; else a
//                 shade; with masks, parts has 'Hair'), deco (the army's
//                 sign and the knights' arms, DECO_FRAGMENT), heraldry (the
//                 arms' array texture, decodeLayers)
//   look          palette {part: surface() or tiled(); on the part that
//                 bears a sign or arms with `deco`: deco()}, layerOf (part ->
//                 name of its texture layer), cards (parts made of
//                 see-through cards), marked (parts whose texture alpha
//                 selects the mark colour, a horse's white markings),
//                 markColor, hidden (per part 1 = not drawn)
// Returns {material, row}: the row goes to poolBones.
export function partLook(owner, o, look) {
  let byProgram = kinds.get(owner);
  if (!byProgram) kinds.set(owner, (byProgram = new Map()));
  let kind = byProgram.get(o.program);
  if (!kind) byProgram.set(o.program, (kind = makeKind(o)));
  const { parts, layers, normals, tiles } = o;
  const row = new Float32Array(parts.length * PALETTE_TEXELS * 4);
  const c = new THREE.Color();
  const mark = new THREE.Color(look.markColor || '#ffffff');
  parts.forEach((name, i) => {
    const s = look.palette[name] || surface('#888888', 0.9);
    const k = i * PALETTE_TEXELS * 4;
    c.set(s.color);
    row.set([c.r, c.g, c.b, s.roughness], k);
    const layer = look.layerOf(name);
    row.set([
      s.metalness,
      layers && layer in layers.index ? layers.index[layer] : -1,
      look.cards && look.cards.has(name) ? 1 : look.marked && look.marked.has(name) ? 2 : 0,
      normals && layer in normals.index ? normals.index[layer] : -1,
    ], k + 4);
    const tiled = tiles && s.tile in tiles.index;
    const second = tiled && s.second && tiles.maskIndex && s.tile in tiles.maskIndex;
    row.set([
      tiled ? tiles.index[s.tile] : -1,
      tiled ? tiles.repeat[s.tile] : -1,
      look.hidden ? look.hidden[i] : 0,
      second ? tiles.maskIndex[s.tile] : -1,
    ], k + 8);
    if (second) c.set(s.second.color);
    // (a sign or arms: its code with the second metalness, decoCoder)
    const code = s.deco && kind.decoCode ? kind.decoCode(s.deco) : 0;
    row.set(second ? [c.r, c.g, c.b, s.second.metalness + 2 * code] : [mark.r, mark.g, mark.b, 2 * code], k + 12);
  });
  return { material: kind.material, row: kind.palette.add(row) };
}

// What a part bears (character.js palette): the army's sign (shape 'cross',
// 'saltire', 'bend' or 'armbands', in `color`, on a `patch` of another
// cloth or null) or a coat of arms (shape 'coat', `coat` its layer in the
// heraldry array); colours as tints of the part's cloth; `weave`: the part
// is dyed cloth (the sign in its weave), else the sign is cloth sewn on
// (mail, leather, lamellar).
export const deco = (shape, { color = null, patch = null, coat = -1, weave = true } = {}) => ({ shape, color, patch, coat, weave });
const DECO_SHAPES = { cross: 1, saltire: 2, bend: 3, armbands: 4, coat: 5 };
// The code in a palette row (texel 3's alpha, with the second material's
// metalness: a = metalness + 2 * code; next to the largest codes a float
// keeps the metalness to 1/64): bits 0-2 the shape, 3 woven, 4-7 the sign's
// tint, 8-11 the patch's (0: none), 12-16 the coat's layer + 1. The tints
// are a table of the kind (uniform decoTint).
function decoCoder(tints) {
  const index = new Map();
  const slot = (color) => {
    if (!color) return 0;
    const key = color.getHexString();
    if (!index.has(key)) {
      if (index.size >= 15) return 0;
      index.set(key, index.size + 1);
      tints.value[index.size].copy(color);
    }
    return index.get(key);
  };
  return (d) => (DECO_SHAPES[d.shape] || 0) | (d.weave ? 8 : 0) | (slot(d.color) << 4) | (slot(d.patch) << 8) | ((d.coat + 1) << 12);
}

function makeKind(o) {
  const { parts, layers, normals, tiles } = o;
  const palette = new PalettePool(parts.length);
  const shared = {
    partPalette: palette.uniform,
    partLayers: { value: layers ? layers.texture : null },
    layerSize: { value: layers ? layers.size : 1 },
  };
  const m = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, metalness: 0, vertexColors: true });
  m.defines = {};
  if (o.masks) Object.assign(m.defines, { PART_MASKS: '', PART_HAIR: Math.max(0, parts.indexOf('Hair')) });
  // the army's sign and the arms (DECO_FRAGMENT)
  const decoTint = { value: Array.from({ length: 16 }, () => new THREE.Color(0, 0, 0)) };
  if (o.deco) m.defines.PART_DECO = '';
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, shared);
    shader.uniforms.partNormals = { value: normals ? normals.texture : null };
    shader.uniforms.tileColor = { value: tiles ? tiles.color : null };
    shader.uniforms.tileSurface = { value: tiles ? tiles.surface : null };
    shader.uniforms.tileMask = { value: tiles ? tiles.mask : null };
    shader.uniforms.mudColor = { value: new THREE.Color(o.mud || '#4a3b2a') };
    shader.uniforms.decoTint = decoTint;
    shader.uniforms.heraldry = { value: o.heraldry ? o.heraldry.texture : null };
    shader.vertexShader = shader.vertexShader
      .replace('#include <skinning_pars_vertex>', SKINNING)
      .replace('#include <common>', `#include <common>${PART_VERTEX}
        varying vec3 vPartColor;
        varying vec3 vPartSurface;
        varying vec3 vMarkColor;
        varying vec3 vDirt;
        #ifdef PART_MASKS
        varying float vMottle;
        varying float vShade;
        #endif
        #ifdef PART_DECO
        flat varying float vDeco;
        varying vec2 vDecoXY;
        #endif`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>${PART_BEGIN}
        vec4 pal3 = texelFetch(partPalette, ivec2(part * ${PALETTE_TEXELS} + 3, partRow), 0);
        vPartColor = pal0.rgb;
        vPartSurface = vec3(pal0.a, pal1.x, pal3.a);
        vMarkColor = pal3.rgb;
        // (the height in the bind pose: the feet at 0)
        vDirt = vec3(boneBase.z, position.y, boneBase.w);
        #ifdef PART_MASKS
        // blotches of the noise (B), others on each model
        vMottle = sin(6.2832 * (color.b * 2.0 + fract(boneBase.x * 0.618)));
        // the outfit's shade; A with the hair hidden (a helmet, hood or coif)
        vShade = texelFetch(partPalette, ivec2(PART_HAIR * ${PALETTE_TEXELS} + 2, partRow), 0).z > 0.5 ? color.a : color.r;
        #endif
        #ifdef PART_DECO
        // a sign or arms (texel 3's alpha: the second metalness + 2 * code)
        vDeco = floor(pal3.a * 0.5);
        vPartSurface.z = pal3.a - 2.0 * vDeco;
        // where in the bind pose: across the body (x), and how squarely the
        // surface faces the front (+) or the back (-) (the height: vDirt.y)
        vDecoXY = vec2(position.x, sign(normal.z) * smoothstep(0.55, 0.75, abs(normal.z)));
        #endif`)
      .replace('#include <project_vertex>', `#include <project_vertex>${HIDE_VERTEX}`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>${PART_FRAGMENT}${TILE_FRAGMENT}
        uniform highp sampler2DArray partNormals;
        uniform highp sampler2DArray tileMask;
        uniform vec3 mudColor;
        varying vec3 vPartColor;
        varying vec3 vPartSurface;
        varying vec3 vMarkColor;
        varying vec3 vDirt;
        #ifdef PART_MASKS
        varying float vMottle;
        varying float vShade;
        #endif
        #ifdef PART_DECO
        uniform vec3 decoTint[16];
        uniform highp sampler2DArray heraldry;
        flat varying float vDeco;
        varying vec2 vDecoXY;
        #endif`)
      .replace('#include <color_fragment>', `
        #ifndef PART_MASKS
        #include <color_fragment>
        #endif
        vec4 partTex = partTexel();
        vec3 partTint = vPartTex.y > 1.5 ? mix(vPartColor, vMarkColor, partTex.a) : vPartColor;
        #ifdef PART_DECO${DECO_FRAGMENT}
        #endif
        vec3 tileSurf = vec3(0.5, 0.5, -1.0);
        // (how much of the texel is the tile's second material: its tint,
        // metalness and own roughness; filtered like the rest, so that far
        // away it is its share)
        float second = 0.0;
        if (vPartTile.x > -0.5) {
          vec3 tileUv = vec3(vPartUv * vPartTile.y, vPartTile.x);
          vec4 tileCol = texture(tileColor, tileUv);
          if (vPartTile.z > -0.5) second = texture(tileMask, vec3(tileUv.xy, vPartTile.z)).r;
          partTint = mix(partTint, vMarkColor, second);
          diffuseColor.rgb *= tileCol.rgb;
          tileSurf = vec3(texture(tileSurface, tileUv).xy, tileCol.a);
        }
        diffuseColor.rgb *= partTint * partTex.rgb;
        diffuseColor.a = 1.0;
        float mudLine = vDirt.y;
        float wear = 0.0;
        float partMetal = mix(vPartSurface.y, vPartSurface.z, second);
        #ifdef PART_DECO
        // (a sign sewn on mail, leather or lamellar: cloth)
        diffuseColor.rgb = mix(diffuseColor.rgb, decoCol * vec3(0.77, 0.729, 0.669), decoSewn);
        partMetal *= 1.0 - decoSewn;
        #endif
        #ifdef PART_MASKS
        // the vertex colours are masks (tools/characters/masks.py): R (or A)
        // the outfit's shade (vShade, below), G the distance to the
        // garment's open edge, B a noise. Cloth and armour a little blotchy; worn at the edges,
        // as much as the model's (boneBase.w): metal rubbed bright, cloth and
        // leather faded (gone by the far level, too small there); the mud's
        // edge uneven
        if (vPartTile.x > -0.5) {
          diffuseColor.rgb *= 1.0 + 0.1 * vMottle;
          wear = (1.0 - smoothstep(0.0, 0.08, vColor.g)) * vDirt.z * clamp(0.6 + 0.8 * vColor.b, 0.0, 1.0)
            * (1.0 - smoothstep(12.0, 18.0, length(vViewPosition)));
          // (the dye worn off: towards the undyed fibre, as light as the lightest channel)
          vec3 faded = mix(diffuseColor.rgb, max(diffuseColor.r, max(diffuseColor.g, diffuseColor.b)) * vec3(1.0, 0.94, 0.84), 0.45);
          diffuseColor.rgb = mix(diffuseColor.rgb, mix(faded, diffuseColor.rgb * 1.5, partMetal), wear);
        }
        mudLine += 0.3 * (vColor.b - 0.5);
        #endif
        // mud and dust from the ground: most above the boots, less up to the
        // knees, as dirty as the model
        float mud = vDirt.x * (1.0 - smoothstep(0.1, 0.8, mudLine));
        diffuseColor.rgb = mix(diffuseColor.rgb, mudColor, mud);
        #ifdef PART_MASKS
        diffuseColor.rgb *= vShade;
        #endif`)
      .replace('#include <roughnessmap_fragment>', `float roughnessFactor = tileSurf.z < 0.0 ? vPartSurface.x
          : clamp(tileSurf.z * mix(vPartSurface.x, 1.0, second), 0.04, 1.0);
        roughnessFactor *= 1.0 - 0.45 * wear * partMetal;
        #ifdef PART_DECO
        roughnessFactor = mix(roughnessFactor, 0.9, decoSewn);
        #endif
        roughnessFactor = mix(roughnessFactor, 0.95, mud);`)
      .replace('#include <metalnessmap_fragment>', 'float metalnessFactor = mix(partMetal, 0.0, mud);')
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        if (vPartTex.z > -0.5) {
          vec2 partXY = texture(partNormals, vec3(vPartUv, vPartTex.z)).xy * 2.0 - 1.0;
          vec3 partN = vec3(partXY, sqrt(max(0.0, 1.0 - dot(partXY, partXY))));
          normal = normalize(tileFrame(-vViewPosition, normal, vPartUv) * partN);
        } else if (tileSurf.z >= 0.0) {
          mat3 frame = tileFrame(-vViewPosition, normal, vPartUv * vPartTile.y);
          normal = normalize(frame * tileNormal(tileSurf.xy));
        }`)
      .replace('#include <lights_fragment_end>', `#include <lights_fragment_end>${DULL_METAL}`);
  };
  m.customProgramCacheKey = () => `${o.program}:${parts.length}${o.masks ? ':masks' : ''}${o.deco ? ':deco' : ''}`;
  // shadows: hidden parts cast none, cards only where they are not see-through
  const depth = new THREE.MeshDepthMaterial();
  depth.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, shared);
    shader.vertexShader = shader.vertexShader
      .replace('#include <skinning_pars_vertex>', SKINNING)
      .replace('#include <common>', `#include <common>${PART_VERTEX}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>${PART_BEGIN}`)
      .replace('#include <project_vertex>', `#include <project_vertex>${HIDE_VERTEX}`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>${PART_FRAGMENT}`)
      .replace('#include <alphatest_fragment>', '#include <alphatest_fragment>\n  partTexel();');
  };
  depth.customProgramCacheKey = () => `${o.program}:${parts.length}-depth`;
  m.userData.depth = depth;
  // (the palette texture, a row per model: for the tests)
  m.userData.palette = palette.uniform;
  return { material: m, palette, decoCode: o.deco ? decoCoder(decoTint) : null };
}

// The army's sign or a knight's arms on the part that bears them (DECO),
// projected from the bind pose onto the chest and the back (the outer
// garments are cut alike: these rectangles are on each of them, flat, under
// the coif's mantle and above the belt), faded out from 24 to 32 m (beyond,
// the side's big garment tells the sides apart; and the bars would be under
// a pixel). The arms cover the whole garment: a heater's field (6:7) on the
// chest and on the back (as a viewer behind sees it), its edges carried on
// to the seams; the sign is a cross or saltire with 5 cm bars in a 24 cm
// field (on a patch of other cloth where it would not show), a sash over
// the right shoulder, or bands round the upper arms. Mixed into the cloth's
// tint (under its weave, the brigandine's rivets, mud and wear), or sewn on
// over mail, leather or lamellar (decoSewn: after the tile).
const DECO_FRAGMENT = `
  vec3 decoCol = vec3(0.0);
  float decoSewn = 0.0;
  // (derivatives before any branch)
  vec2 decoP = vec2(vDecoXY.x, vDirt.y);
  vec2 decoDx = dFdx(decoP);
  vec2 decoDy = dFdy(decoP);
  float decoPx = max(0.7 * (length(decoDx) + length(decoDy)), 1e-4);
  float decoFade = 1.0 - smoothstep(24.0, 32.0, length(vViewPosition));
  if (vDeco > 0.5 && decoFade > 0.0) {
    int code = int(vDeco + 0.5);
    int shape = code & 7;
    float back = vDecoXY.y > 0.0 ? 0.0 : 1.0;
    if (shape == 5) {
      vec2 frame = mix(vec2(0.21, 0.245), vec2(0.22, 0.257), back);
      float flip = 1.0 - 2.0 * back;
      vec2 g = vec2(flip, -1.0) / frame;
      vec2 uv = vec2(0.5, 0.5) + vec2(decoP.x, decoP.y - mix(1.215, 1.225, back)) * g;
      vec3 coat = textureGrad(heraldry, vec3(uv, float((code >> 12) - 1)), decoDx * g, decoDy * g).rgb;
      // (the coat's dyes as tints of the wool: 0.75 / its mean)
      partTint = mix(partTint, coat * vec3(0.974, 1.029, 1.121), decoFade);
    } else {
      vec2 q = vec2(decoP.x, decoP.y - mix(1.205, 1.215, back));
      vec2 a = abs(q);
      float box = max(a.x, a.y) - 0.12;
      float d;
      float facing = abs(vDecoXY.y);
      if (shape == 1) d = max(min(a.x, a.y) - 0.025, box);
      else if (shape == 2) d = max(abs(a.x - a.y) * 0.7071 - 0.025, box);
      else if (shape == 3) d = abs(0.8 * decoP.x + 0.6 * (decoP.y - 1.2)) - 0.04;
      else {
        // (the upper arm in the bind pose: from the shoulder down and out)
        vec2 arm = vec2(abs(decoP.x) - 0.184, decoP.y - 1.386);
        float along = dot(arm, vec2(0.658, -0.752));
        float off = abs(arm.x * -0.752 - arm.y * 0.658);
        d = max(abs(along - 0.13) - 0.025, off - 0.09);
        facing = 1.0;
      }
      float cov = clamp(0.5 - d / decoPx, 0.0, 1.0) * facing * decoFade;
      int patchTint = (code >> 8) & 15;
      float patchCov = patchTint > 0 ? clamp(0.5 - box / decoPx, 0.0, 1.0) * facing * decoFade : 0.0;
      float decoCov = max(cov, patchCov);
      decoCol = mix(decoTint[patchTint], decoTint[(code >> 4) & 15], cov / max(decoCov, 1e-4));
      if ((code & 8) != 0) partTint = mix(partTint, decoCol, decoCov);
      else decoSewn = decoCov;
    }
  }`;

// Metal reflects a third less of the surroundings: the sky dome's glow
// otherwise lights armour in the shade like chrome.
export const DULL_METAL = `
  reflectedLight.indirectSpecular *= mix(1.0, 0.65, metalnessFactor);`;
