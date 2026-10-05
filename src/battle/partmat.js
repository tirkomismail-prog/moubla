// Materials of the realistic models (soldiers, horses): each model is one
// skinned mesh whose vertices carry the number of their part (_part); a
// palette per look gives each part its colour, roughness, metalness, texture
// layer, normal map and tileable material, and can hide a part (no beard,
// hair under a helmet). Also the decoding of the packed textures.
import * as THREE from 'three';
import { MeshoptSimplifier } from 'meshoptimizer/simplifier';

export function bytesOf(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// Texture layers as one array texture. Each layer is a colour image plus,
// for see-through ones, a separate alpha image. `layers`: {name: [colour,
// alpha or null]} (base64 WebP).
export async function decodeLayers(size, layers, colorSpace, channel = 0) {
  const names = Object.keys(layers);
  const data = new Uint8Array(size * size * 4 * names.length);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const pixels = async (b64) => {
    const img = await createImageBitmap(new Blob([bytesOf(b64)], { type: 'image/webp' }));
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);
    img.close();
    return ctx.getImageData(0, 0, size, size).data;
  };
  for (let i = 0; i < names.length; i++) {
    const files = layers[names[i]];
    const off = i * size * size * 4;
    data.set(await pixels(files[channel]), off);
    if (channel === 0 && files[1]) {
      const a = await pixels(files[1]);
      for (let k = 0; k < size * size; k++) data[off + k * 4 + 3] = a[k * 4];
    }
  }
  const texture = new THREE.DataArrayTexture(data, size, size, names.length);
  texture.colorSpace = colorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.generateMipmaps = true;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return { texture, size, index: Object.fromEntries(names.map((n, i) => [n, i])) };
}

// Tileable cloth and armour materials: colour and surface (normal x, y and
// roughness) arrays, and how often each repeats per metre.
export async function decodeTiles({ size, layers, repeat }) {
  const color = await decodeLayers(size, layers, THREE.SRGBColorSpace, 0);
  const surface = await decodeLayers(size, layers, THREE.NoColorSpace, 1);
  return { color: color.texture, surface: surface.texture, index: color.index, repeat };
}

// a part's look: a plain colour, or a tint of a tileable material (see
// tools/characters/materials.py) with a factor for the roughness it gives
export const surface = (color, roughness, metalness = 0) => ({ color, roughness, metalness });
export const tiled = (tile, color, roughness = 1, metalness = 0) => ({ color, roughness, metalness, tile });

// Each model's own look is a row of a palette texture (PalettePool): per
// part four texels, (colour, roughness), (metalness, texture layer, kind,
// normal map layer), (tile, tile repeats per metre, hidden), (mark colour).
// The row comes with the model's meshes (boneBase.y, see poolBones), so one
// material draws all the models of a kind in a battle.
const PALETTE_TEXELS = 4;
const PART_VERTEX = `
  attribute float _part;
  attribute vec4 boneBase;
  uniform highp sampler2D partPalette;
  varying vec3 vPartTex;
  varying vec2 vPartTile;
  varying vec2 vPartUv;`;
const PART_BEGIN = `
  int part = int(_part + 0.5);
  int partRow = int(boneBase.y + 0.5);
  vec4 pal0 = texelFetch(partPalette, ivec2(part * ${PALETTE_TEXELS}, partRow), 0);
  vec4 pal1 = texelFetch(partPalette, ivec2(part * ${PALETTE_TEXELS} + 1, partRow), 0);
  vec4 pal2 = texelFetch(partPalette, ivec2(part * ${PALETTE_TEXELS} + 2, partRow), 0);
  vPartTex = pal1.yzw;
  vPartTile = pal2.xy;
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
  varying vec2 vPartTile;
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
// layer x (x < 0: none). The surface texture holds the normal (x, y) and
// the roughness; there are no tangents, the frame comes from derivatives.
export const TILE_FRAGMENT = `
  uniform highp sampler2DArray tileColor;
  uniform highp sampler2DArray tileSurface;
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
// model's palette row (partLook), how dirty it is (0..1).
export function poolBones(owner, skeleton, meshes, row = 0, dirt = 0) {
  let pool = bonePools.get(owner);
  if (!pool) bonePools.set(owner, (pool = new BonePool()));
  const base = new THREE.InstancedBufferAttribute(new Float32Array([pool.add(skeleton), row, dirt, 0]), 4);
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
//                 decodeTiles), mud (colour of the dirt, linear)
//   look          palette {part: surface() or tiled()}, layerOf (part ->
//                 name of its texture layer), cards (parts made of see-through
//                 cards), marked (parts whose texture alpha selects the mark
//                 colour, a horse's white markings), markColor, hidden (per
//                 part 1 = not drawn)
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
    row.set([tiled ? tiles.index[s.tile] : -1, tiled ? tiles.repeat[s.tile] : -1, look.hidden ? look.hidden[i] : 0, 0], k + 8);
    row.set([mark.r, mark.g, mark.b, 0], k + 12);
  });
  return { material: kind.material, row: kind.palette.add(row) };
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
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, shared);
    shader.uniforms.partNormals = { value: normals ? normals.texture : null };
    shader.uniforms.tileColor = { value: tiles ? tiles.color : null };
    shader.uniforms.tileSurface = { value: tiles ? tiles.surface : null };
    shader.uniforms.mudColor = { value: new THREE.Color(o.mud || '#4a3b2a') };
    shader.vertexShader = shader.vertexShader
      .replace('#include <skinning_pars_vertex>', SKINNING)
      .replace('#include <common>', `#include <common>${PART_VERTEX}
        varying vec3 vPartColor;
        varying vec2 vPartSurface;
        varying vec3 vMarkColor;
        varying vec2 vDirt;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>${PART_BEGIN}
        vPartColor = pal0.rgb;
        vPartSurface = vec2(pal0.a, pal1.x);
        vMarkColor = texelFetch(partPalette, ivec2(part * ${PALETTE_TEXELS} + 3, partRow), 0).rgb;
        // (the height in the bind pose: the feet at 0)
        vDirt = vec2(boneBase.z, position.y);`)
      .replace('#include <project_vertex>', `#include <project_vertex>${HIDE_VERTEX}`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>${PART_FRAGMENT}${TILE_FRAGMENT}
        uniform highp sampler2DArray partNormals;
        uniform vec3 mudColor;
        varying vec3 vPartColor;
        varying vec2 vPartSurface;
        varying vec3 vMarkColor;
        varying vec2 vDirt;`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        vec4 partTex = partTexel();
        vec3 partTint = vPartTex.y > 1.5 ? mix(vPartColor, vMarkColor, partTex.a) : vPartColor;
        diffuseColor.rgb *= partTint * partTex.rgb;
        diffuseColor.a = 1.0;
        vec3 tileSurf = vec3(0.5, 0.5, -1.0);
        if (vPartTile.x > -0.5) {
          vec3 tileUv = vec3(vPartUv * vPartTile.y, vPartTile.x);
          diffuseColor.rgb *= texture(tileColor, tileUv).rgb;
          tileSurf = texture(tileSurface, tileUv).rgb;
        }
        // mud and dust from the ground: most above the boots, less up to the
        // knees, as dirty as the model
        float mud = vDirt.x * (1.0 - smoothstep(0.1, 0.8, vDirt.y));
        diffuseColor.rgb = mix(diffuseColor.rgb, mudColor, mud);`)
      .replace('#include <roughnessmap_fragment>', `float roughnessFactor = tileSurf.z < 0.0 ? vPartSurface.x
          : clamp(tileSurf.z * vPartSurface.x, 0.04, 1.0);
        roughnessFactor = mix(roughnessFactor, 0.95, mud);`)
      .replace('#include <metalnessmap_fragment>', 'float metalnessFactor = mix(vPartSurface.y, 0.0, mud);')
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        if (vPartTex.z > -0.5) {
          vec3 partN = texture(partNormals, vec3(vPartUv, vPartTex.z)).xyz * 2.0 - 1.0;
          normal = normalize(tileFrame(-vViewPosition, normal, vPartUv) * partN);
        } else if (tileSurf.z >= 0.0) {
          mat3 frame = tileFrame(-vViewPosition, normal, vPartUv * vPartTile.y);
          normal = normalize(frame * vec3(tileSurf.xy * 2.0 - 1.0, 1.0));
        }`)
      .replace('#include <lights_fragment_end>', `#include <lights_fragment_end>${DULL_METAL}`);
  };
  m.customProgramCacheKey = () => `${o.program}:${parts.length}`;
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
  return { material: m, palette };
}

// Metal reflects a third less of the surroundings: the sky dome's glow
// otherwise lights armour in the shade like chrome.
export const DULL_METAL = `
  reflectedLight.indirectSpecular *= mix(1.0, 0.65, metalnessFactor);`;
