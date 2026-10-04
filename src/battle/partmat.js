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

const PART_VERTEX = (n) => `
  attribute float _part;
  uniform float partHidden[${n}];
  uniform vec3 partTex[${n}];
  uniform vec2 partTile[${n}];
  varying vec3 vPartTex;
  varying vec2 vPartTile;
  varying vec2 vPartUv;`;
const PART_BEGIN = `
  int part = int(_part + 0.5);
  vPartTex = partTex[part];
  vPartTile = partTile[part];
  vPartUv = uv;`;
// moves the vertices of a hidden part out of the view: its triangles vanish
const HIDE_VERTEX = `
  if (partHidden[part] > 0.5) gl_Position = vec4(0.0, 0.0, -2.0, 1.0);`;
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
// (sharing the buffers) with the boneBase attribute.
export function poolBones(owner, skeleton, meshes) {
  let pool = bonePools.get(owner);
  if (!pool) bonePools.set(owner, (pool = new BonePool()));
  const base = new THREE.InstancedBufferAttribute(new Float32Array([pool.add(skeleton)]), 1);
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
const SKINNING = THREE.ShaderChunk.skinning_pars_vertex
  .replace('uniform mat4 bindMatrix;', 'attribute float boneBase;\n\tuniform mat4 bindMatrix;')
  .replace('int j = int( i ) * 4;', 'int j = ( int( i ) + int( boneBase + 0.5 ) ) * 4;');

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

const materials = new Map();

// One material per look, shared by all models that look alike.
//   key       identifies the look
//   program   name of the shader program (one per model: the number of parts differs)
//   parts     part names in the order of their numbers
//   palette   {part: surface() or tiled()}
//   layerOf   part -> name of its texture layer
//   layers    colour layers (decodeLayers), normals: normal map layers (by
//             the same names), tiles: tileable materials (decodeTiles)
//   cards     parts made of see-through cards; marked: parts whose texture
//             alpha selects markColor (a horse's white markings)
//   hidden    per part 1 = not drawn
export function partMaterial(o) {
  let m = materials.get(o.key);
  if (m) return m;
  const { parts, layers, normals, tiles } = o;
  const n = parts.length;
  const colors = new Float32Array(n * 3);
  const surfaces = new Float32Array(n * 2);
  const tex = new Float32Array(n * 3);
  const tile = new Float32Array(n * 2).fill(-1);
  const c = new THREE.Color();
  parts.forEach((name, i) => {
    const s = o.palette[name] || surface('#888888', 0.9);
    c.set(s.color).toArray(colors, i * 3);
    surfaces[i * 2] = s.roughness;
    surfaces[i * 2 + 1] = s.metalness;
    const layer = o.layerOf(name);
    tex[i * 3] = layers && layer in layers.index ? layers.index[layer] : -1;
    tex[i * 3 + 1] = o.cards && o.cards.has(name) ? 1 : o.marked && o.marked.has(name) ? 2 : 0;
    tex[i * 3 + 2] = normals && layer in normals.index ? normals.index[layer] : -1;
    if (tiles && s.tile in tiles.index) {
      tile[i * 2] = tiles.index[s.tile];
      tile[i * 2 + 1] = tiles.repeat[s.tile];
    }
  });
  const shared = {
    partHidden: { value: new Float32Array(o.hidden || n) },
    partTex: { value: tex },
    partLayers: { value: layers ? layers.texture : null },
    layerSize: { value: layers ? layers.size : 1 },
    partTile: { value: tile },
  };
  m = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, metalness: 0, vertexColors: true });
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, shared);
    shader.uniforms.partColor = { value: colors };
    shader.uniforms.partSurface = { value: surfaces };
    shader.uniforms.markColor = { value: new THREE.Color(o.markColor || '#ffffff') };
    shader.uniforms.partNormals = { value: normals ? normals.texture : null };
    shader.uniforms.tileColor = { value: tiles ? tiles.color : null };
    shader.uniforms.tileSurface = { value: tiles ? tiles.surface : null };
    shader.vertexShader = shader.vertexShader
      .replace('#include <skinning_pars_vertex>', SKINNING)
      .replace('#include <common>', `#include <common>${PART_VERTEX(n)}
        uniform vec3 partColor[${n}];
        uniform vec2 partSurface[${n}];
        varying vec3 vPartColor;
        varying vec2 vPartSurface;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>${PART_BEGIN}
        vPartColor = partColor[part];
        vPartSurface = partSurface[part];`)
      .replace('#include <project_vertex>', `#include <project_vertex>${HIDE_VERTEX}`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>${PART_FRAGMENT}${TILE_FRAGMENT}
        uniform highp sampler2DArray partNormals;
        uniform vec3 markColor;
        varying vec3 vPartColor;
        varying vec2 vPartSurface;`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        vec4 partTex = partTexel();
        vec3 partTint = vPartTex.y > 1.5 ? mix(vPartColor, markColor, partTex.a) : vPartColor;
        diffuseColor.rgb *= partTint * partTex.rgb;
        diffuseColor.a = 1.0;
        vec3 tileSurf = vec3(0.5, 0.5, -1.0);
        if (vPartTile.x > -0.5) {
          vec3 tileUv = vec3(vPartUv * vPartTile.y, vPartTile.x);
          diffuseColor.rgb *= texture(tileColor, tileUv).rgb;
          tileSurf = texture(tileSurface, tileUv).rgb;
        }`)
      .replace('#include <roughnessmap_fragment>', `float roughnessFactor = tileSurf.z < 0.0 ? vPartSurface.x
          : clamp(tileSurf.z * vPartSurface.x, 0.04, 1.0);`)
      .replace('#include <metalnessmap_fragment>', 'float metalnessFactor = vPartSurface.y;')
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        if (vPartTex.z > -0.5) {
          vec3 partN = texture(partNormals, vec3(vPartUv, vPartTex.z)).xyz * 2.0 - 1.0;
          normal = normalize(tileFrame(-vViewPosition, normal, vPartUv) * partN);
        } else if (tileSurf.z >= 0.0) {
          mat3 frame = tileFrame(-vViewPosition, normal, vPartUv * vPartTile.y);
          normal = normalize(frame * vec3(tileSurf.xy * 2.0 - 1.0, 1.0));
        }`);
  };
  const program = `${o.program}:${n}`;
  m.customProgramCacheKey = () => program;
  // shadows: hidden parts cast none, cards only where they are not see-through
  const depth = new THREE.MeshDepthMaterial();
  depth.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, shared);
    shader.vertexShader = shader.vertexShader
      .replace('#include <skinning_pars_vertex>', SKINNING)
      .replace('#include <common>', `#include <common>${PART_VERTEX(n)}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>${PART_BEGIN}`)
      .replace('#include <project_vertex>', `#include <project_vertex>${HIDE_VERTEX}`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>${PART_FRAGMENT}`)
      .replace('#include <alphatest_fragment>', '#include <alphatest_fragment>\n  partTexel();');
  };
  depth.customProgramCacheKey = () => `${program}-depth`;
  m.userData.depth = depth;
  materials.set(o.key, m);
  return m;
}
