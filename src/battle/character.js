// Realistic soldiers: a skinned MakeHuman body with motion-captured walking,
// running and idling (CMU mocap), whose arms, torso and head follow the
// procedural pose rig of an Agent (weapons, blocks, aiming). Built by
// tools/characters/build_soldier.py and packed into dist/characters.js.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { helmetGeo } from './models.js';
import { clamp, wrapAngle, smoothstep } from '../core/util.js';

const state = { status: 'idle', promise: null, t: null };

export function loadCharacters() {
  if (state.promise) return state.promise;
  const assets = typeof window !== 'undefined' && window.__CHARACTER_ASSETS;
  if (!assets || !assets.soldier) {
    state.status = 'missing';
    state.promise = Promise.resolve(false);
    return state.promise;
  }
  state.status = 'loading';
  state.promise = (async () => {
    try {
      const gltf = await new Promise((resolve, reject) => new GLTFLoader().parse(bytesOf(assets.soldier).buffer, '', resolve, reject));
      const t = prepare(gltf);
      const tex = assets.textures;
      t.layers = tex ? await decodeLayers(tex.size, tex.layers, THREE.SRGBColorSpace) : null;
      t.tiles = tex && tex.tiles ? await decodeTiles(tex.tiles) : null;
      state.t = t;
      state.status = 'ready';
      return true;
    } catch (e) {
      console.warn('Character model unusable:', e);
      state.status = 'failed';
      return false;
    }
  })();
  return state.promise;
}

function bytesOf(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// Texture layers as one array texture. Each layer is a colour image plus,
// for see-through ones, a separate alpha image. `layers`: {name: [colour,
// alpha or null]} (base64 WebP).
async function decodeLayers(size, layers, colorSpace, channel = 0) {
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
async function decodeTiles({ size, layers, repeat }) {
  const color = await decodeLayers(size, layers, THREE.SRGBColorSpace, 0);
  const surface = await decodeLayers(size, layers, THREE.NoColorSpace, 1);
  return { color: color.texture, surface: surface.texture, index: color.index, repeat };
}

export function charactersReady() {
  return state.status === 'ready';
}

// ---------------------------------------------------------------------------
// Template: things measured once on the loaded model in its rest pose
// ---------------------------------------------------------------------------


function prepare(gltf) {
  const scene = gltf.scene;
  scene.updateMatrixWorld(true);
  const rest = [];
  scene.traverse((o) => {
    if (o.isBone) rest.push([o, o.position.clone(), o.quaternion.clone(), o.scale.clone()]);
  });
  const bones = {};
  let armature = null;
  scene.traverse((o) => {
    if (o.isBone) bones[o.name] = o;
    if (o.userData && o.userData.hair_center) armature = o;
  });
  const fit = armature ? armature.userData : {};
  const clips = {};
  for (const clip of gltf.animations) {
    const [name, speed] = clip.name.split('|');
    clips[name] = { clip, speed: Number(speed) || 0, dur: clip.duration, offset: 0 };
  }
  const t = { scene, clips, fit, hands: {}, limbs: {} };
  // the parts in the order of their numbers (_part) and their texture layers
  t.parts = fit.parts || ['Body', 'Shirt', 'Skirt', 'Hose', 'Boots', 'Belt', 'Hair', 'Beard', 'Eyes'];
  t.partLayers = fit.part_layers || {};
  const wpos = (b) => b.getWorldPosition(new THREE.Vector3());
  for (const s of ['l', 'r']) {
    const hand = bones[`hand_${s}`];
    // hand frame in the hand bone's local space: length (wrist -> knuckles),
    // knuckle line (little finger -> index finger), palm normal
    const len = bones[`middle_01_${s}`].position.clone().normalize();
    const knuck = bones[`index_01_${s}`].position.clone().sub(bones[`pinky_01_${s}`].position);
    knuck.addScaledVector(len, -knuck.dot(len)).normalize();
    const palm = s === 'r' ? new THREE.Vector3().crossVectors(knuck, len) : new THREE.Vector3().crossVectors(len, knuck);
    const basis = new THREE.Matrix4().makeBasis(len, knuck, palm);
    const knuckDist = bones[`middle_01_${s}`].position.length();
    const grip = len.clone().multiplyScalar(knuckDist * 0.9).addScaledVector(palm, 0.028);
    // weapon frame in hand space: +Z along the knuckle line, +Y back to the wrist
    const wy = len.clone().negate();
    const wx = new THREE.Vector3().crossVectors(wy, knuck);
    const gripQ = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(wx, wy, knuck));
    t.hands[s] = { len, knuck, palm, basisQ: new THREE.Quaternion().setFromRotationMatrix(basis), grip, gripQ };
    t.limbs[`arm_${s}`] = limbInfo(bones[`upperarm_${s}`], bones[`lowerarm_${s}`], hand, new THREE.Vector3(1, 0, 0));
    t.limbs[`leg_${s}`] = limbInfo(bones[`thigh_${s}`], bones[`calf_${s}`], bones[`foot_${s}`], new THREE.Vector3(1, 0, 0));
    t.hands[s].fist = fingerPose(bones, s, t.hands[s], 1);
    t.hands[s].relaxed = fingerPose(bones, s, t.hands[s], 0.35);
  }
  t.shoulder = { l: wpos(bones.upperarm_l), r: wpos(bones.upperarm_r) };
  t.reach = t.limbs.arm_r.a + t.limbs.arm_r.b + bones.middle_01_r.position.length() * 0.9;
  t.pelvisY = wpos(bones.pelvis).y;
  t.headRestQ = bones.head.getWorldQuaternion(new THREE.Quaternion());
  t.headRestInv = new THREE.Matrix4().copy(bones.head.matrixWorld).invert();
  // garments (Piece_<name>_LOD<n>): joined with the head and hands of each
  // level of detail (Soldier_LOD<n>) into one mesh per outfit, see outfitGeometry
  t.common = [];
  t.pieces = {};
  const pieces = [];
  scene.traverse((o) => {
    const m = o.isSkinnedMesh && /^(Soldier|Piece_(.+))_LOD(\d)$/.exec(o.name);
    if (!m) return;
    if (m[2]) {
      (t.pieces[m[2]] ||= [])[+m[3]] = o.geometry;
      pieces.push(o);
    } else t.common[+m[3]] = o.geometry;
  });
  for (const o of pieces) o.removeFromParent();
  // helmets (tools/characters/helmets.py), moved into the head bone's space;
  // they are drawn as carried items (props.js), not as part of the body
  t.helmets = {};
  const loose = [];
  scene.traverse((o) => {
    if (o.isMesh && !o.isSkinnedMesh && o.name.startsWith('Helmet_')) loose.push(o);
  });
  for (const o of loose) {
    t.helmets[o.name.slice('Helmet_'.length)] = o.geometry.clone().applyMatrix4(o.matrixWorld).applyMatrix4(t.headRestInv);
    o.removeFromParent();
  }
  // phase of each walking clip at which the left foot is furthest forward,
  // so that walk and run can be blended in step
  const mixer = new THREE.AnimationMixer(scene);
  for (const k of ['walk', 'run', 'walk_back']) {
    const c = clips[k];
    if (!c) continue;
    const act = mixer.clipAction(c.clip);
    act.play();
    let best = -Infinity;
    for (let i = 0; i < 32; i++) {
      act.time = (i / 32) * c.dur;
      mixer.update(0);
      scene.updateMatrixWorld(true);
      const z = wpos(bones.foot_l).z - wpos(bones.pelvis).z;
      const score = k === 'walk_back' ? -z : z;
      if (score > best) {
        best = score;
        c.offset = i / 32;
      }
    }
    act.stop();
  }
  mixer.stopAllAction();
  mixer.uncacheRoot(scene);
  for (const [o, p, q, sc] of rest) {
    o.position.copy(p);
    o.quaternion.copy(q);
    o.scale.copy(sc);
  }
  scene.updateMatrixWorld(true);
  return t;
}

// lengths and the rest-pose hinge axis (in the upper bone's local space) of a
// two-bone limb
function limbInfo(upper, lower, end, fallback) {
  const a = lower.position.length();
  const b = end.position.length();
  const u = lower.position.clone().normalize();
  const l = end.position.clone().applyQuaternion(lower.quaternion).normalize();
  const hinge = new THREE.Vector3().crossVectors(u, l);
  if (hinge.length() < 0.05) {
    // straight in the rest pose: use the given axis (upper bone world frame)
    const inv = upper.getWorldQuaternion(new THREE.Quaternion()).invert();
    hinge.copy(fallback).applyQuaternion(inv);
  }
  hinge.normalize();
  return { a, b, hinge, lowerDir: u, endDir: end.position.clone().normalize() };
}

// local rotations of the finger bones for a hand curled by `amount` (1 = fist)
function fingerPose(bones, s, hand, amount) {
  const out = {};
  const sign = s === 'r' ? 1 : -1;
  const handQ = bones[`hand_${s}`].getWorldQuaternion(new THREE.Quaternion());
  const knuckW = hand.knuck.clone().applyQuaternion(handQ);
  const lenW = hand.len.clone().applyQuaternion(handQ);
  const curls = { index: [1.1, 1.3, 0.9], middle: [1.2, 1.35, 0.9], ring: [1.25, 1.35, 0.9], pinky: [1.3, 1.3, 0.9] };
  for (const [f, angles] of Object.entries(curls)) {
    for (let j = 0; j < 3; j++) {
      const b = bones[`${f}_0${j + 1}_${s}`];
      const bw = b.getWorldQuaternion(new THREE.Quaternion());
      const axis = knuckW.clone().applyQuaternion(bw.clone().invert());
      const rot = new THREE.Quaternion().setFromAxisAngle(axis, sign * angles[j] * amount);
      out[b.name] = b.quaternion.clone().multiply(rot);
    }
  }
  // thumb: fold across the palm and bend
  for (let j = 0; j < 3; j++) {
    const b = bones[`thumb_0${j + 1}_${s}`];
    const bw = b.getWorldQuaternion(new THREE.Quaternion());
    const axis = (j === 0 ? lenW : knuckW).clone().applyQuaternion(bw.clone().invert());
    const rot = new THREE.Quaternion().setFromAxisAngle(axis, sign * [0.5, 0.6, 0.5][j] * amount);
    out[b.name] = b.quaternion.clone().multiply(rot);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Material: the whole body is one mesh (one draw call per soldier). Every
// vertex carries the number of its part (_part); a palette per soldier type
// gives each part its colour, roughness, metalness and texture layer, and can
// hide a part (no beard, hair under a helmet). Shared between soldiers who
// look alike.
// ---------------------------------------------------------------------------

const METALS = {
  mail: { color: '#7d848c', roughness: 0.5, metalness: 0.85 },
  lamellar: { color: '#6f757a', roughness: 0.42, metalness: 0.85 },
  plate: { color: '#aab2ba', roughness: 0.28, metalness: 0.95 },
};
const CLOTH = { padded: '#cdbf9a', leather: '#6f4c2e' };
// hair-like textures are grey with a mean of 0.8; skin textures are this light tone
const HAIR_MEAN = 0.8;
const SKIN_REF = new THREE.Color('#e8c3a0');
const surface = (color, roughness, metalness = 0) => ({ color, roughness, metalness });

function palette(spec) {
  const look = spec.look || 'cloth';
  // tileable materials (see tools/characters/materials.py): a tint, and a
  // factor for the roughness the texture gives
  const tiled = (tile, color, roughness = 1, metalness = 0) => ({ color, roughness, metalness, tile });
  const team = tiled('wool', spec.team);
  const mail = tiled('mail', '#ffffff', 1.2, 0.75);
  const plate = tiled('plate', '#ffffff', 1, 0.9);
  // a gambeson dyed a little towards the team colour
  const dyed = new THREE.Color('#ffffff').lerp(new THREE.Color(spec.team), 0.3);
  const skin = new THREE.Color(spec.skin);
  skin.setRGB(skin.r / SKIN_REF.r, skin.g / SKIN_REF.g, skin.b / SKIN_REF.b);
  const hair = new THREE.Color(spec.hair).multiplyScalar(1 / HAIR_MEAN);
  return {
    Body: surface(skin, 0.55),
    Tunic: team,
    Gambeson: tiled('quilted', dyed),
    Hauberk: mail,
    Surcoat: team,
    Jerkin: tiled('leather', '#ffffff'),
    Cuirass: look === 'plate' ? plate : tiled('lamellar', '#ffffff', 0.8, 0.85),
    Plates: plate,
    Hose: look === 'plate' || look === 'mail' ? mail : tiled('wool', spec.pants),
    Boots: tiled('leather', '#b0a090'),
    Belt: tiled('leather', '#8a7a6a'),
    Hair: surface(hair, 0.7),
    Beard: surface(hair, 0.7),
    Moustache: surface(hair, 0.7),
    Brows: surface(hair, 0.7),
    Lashes: surface('#2a211b', 0.7),
    Eyes: surface('#ffffff', 0.12),
  };
}

// The garments of each armour look (see tools/characters/outfits.py)
const OUTFITS = {
  cloth: ['Tunic', 'Belt-Tunic', 'Hose', 'Boots'],
  padded: ['Gambeson', 'Belt-Gambeson', 'Hose', 'Boots'],
  leather: ['Tunic', 'Jerkin', 'Belt-Jerkin', 'Hose', 'Boots'],
  mail: ['Hauberk', 'Surcoat', 'Belt-Surcoat', 'Hose', 'Boots'],
  lamellar: ['Tunic', 'Cuirass', 'Belt-Cuirass', 'Hose', 'Boots'],
  plate: ['Hauberk', 'Cuirass', 'Plates', 'Belt-Cuirass', 'Hose', 'Boots'],
};

// The head and hands with the garments of `look`, for one level of detail.
const outfits = new Map();

function outfitGeometry(look, level) {
  const t = state.t;
  const names = (OUTFITS[look] || OUTFITS.cloth).filter((n) => t.pieces[n] && t.pieces[n][level]);
  if (!names.length) return null;
  const key = `${look}:${level}`;
  let geo = outfits.get(key);
  if (!geo) {
    geo = mergeGeometries([t.common[level], ...names.map((n) => t.pieces[n][level])]);
    outfits.set(key, geo);
  }
  return geo;
}

// parts made of see-through cards
const CARDS = new Set(['Hair', 'Beard', 'Moustache', 'Brows', 'Lashes']);

const PART_VERTEX = (n) => `
  attribute float _part;
  uniform float partHidden[${n}];
  uniform vec2 partTex[${n}];
  uniform vec2 partTile[${n}];
  varying vec2 vPartTex;
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
// texture layer (x < 0: none) and see-through card (y > 0.5) of a part.
// Cards are cut out where the texture's alpha is below 0.5; the alpha is
// raised with the mipmap level so that hair does not thin out far away.
const PART_FRAGMENT = `
  uniform highp sampler2DArray partLayers;
  uniform float layerSize;
  varying vec2 vPartTex;
  varying vec2 vPartTile;
  varying vec2 vPartUv;
  vec4 partTexel() {
    if (vPartTex.x < -0.5) return vec4(1.0);
    vec4 tex = texture(partLayers, vec3(vPartUv, vPartTex.x));
    if (vPartTex.y > 0.5) {
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
const TILE_FRAGMENT = `
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

const materials = new Map();

function soldierMat(spec, hidden) {
  const t = state.t;
  const n = t.parts.length;
  const layers = t.layers;
  const key = `${spec.look}|${spec.team}|${spec.pants}|${spec.skin}|${spec.hair}|${spec.stubble}|${hidden.join('')}`;
  let m = materials.get(key);
  if (m) return m;
  const colors = new Float32Array(n * 3);
  const surfaces = new Float32Array(n * 2);
  const tex = new Float32Array(n * 2);
  const tile = new Float32Array(n * 2).fill(-1);
  const tiles = t.tiles;
  const pal = palette(spec);
  const c = new THREE.Color();
  t.parts.forEach((name, i) => {
    const s = pal[name] || surface('#888888', 0.9);
    c.set(s.color).toArray(colors, i * 3);
    surfaces[i * 2] = s.roughness;
    surfaces[i * 2 + 1] = s.metalness;
    let layer = t.partLayers[name];
    if (name === 'Body' && spec.stubble && layers && 'skin_stubble' in layers.index) layer = 'skin_stubble';
    tex[i * 2] = layers && layer in layers.index ? layers.index[layer] : -1;
    tex[i * 2 + 1] = CARDS.has(name) ? 1 : 0;
    if (tiles && s.tile in tiles.index) {
      tile[i * 2] = tiles.index[s.tile];
      tile[i * 2 + 1] = tiles.repeat[s.tile];
    }
  });
  const shared = {
    partHidden: { value: new Float32Array(hidden) },
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
    shader.uniforms.tileColor = { value: tiles ? tiles.color : null };
    shader.uniforms.tileSurface = { value: tiles ? tiles.surface : null };
    shader.vertexShader = shader.vertexShader
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
        varying vec3 vPartColor;
        varying vec2 vPartSurface;`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        diffuseColor.rgb *= vPartColor * partTexel().rgb;
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
        if (tileSurf.z >= 0.0) {
          mat3 frame = tileFrame(-vViewPosition, normal, vPartUv * vPartTile.y);
          normal = normalize(frame * vec3(tileSurf.xy * 2.0 - 1.0, 1.0));
        }`);
  };
  m.customProgramCacheKey = () => 'soldier';
  // shadows: hidden parts cast none, cards only where they are not see-through
  const depth = new THREE.MeshDepthMaterial();
  depth.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, shared);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>${PART_VERTEX(n)}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>${PART_BEGIN}`)
      .replace('#include <project_vertex>', `#include <project_vertex>${HIDE_VERTEX}`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>${PART_FRAGMENT}`)
      .replace('#include <alphatest_fragment>', '#include <alphatest_fragment>\n  partTexel();');
  };
  depth.customProgramCacheKey = () => 'soldier-depth';
  m.userData.depth = depth;
  materials.set(key, m);
  return m;
}

// ---------------------------------------------------------------------------
// Carried items with tileable materials (the helmets): each vertex names its
// material (_tile, -1: plain colour) and metalness (_metal); the colour is a
// tint. Drawn instanced by props.js, so one material for all of them.
// ---------------------------------------------------------------------------

let itemMat = null;

function itemMaterial() {
  if (itemMat) return itemMat;
  const tiles = state.t.tiles;
  const names = tiles ? Object.keys(tiles.index) : [];
  const repeat = new Float32Array(Math.max(1, names.length)).fill(1);
  names.forEach((n, i) => (repeat[i] = tiles.repeat[n]));
  itemMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.7, metalness: 0, vertexColors: true });
  if (!tiles) return itemMat;
  itemMat.onBeforeCompile = (shader) => {
    shader.uniforms.tileColor = { value: tiles.color };
    shader.uniforms.tileSurface = { value: tiles.surface };
    shader.uniforms.tileRepeat = { value: repeat };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
        attribute float _tile;
        attribute float _metal;
        varying float vTile;
        varying float vMetal;
        varying vec2 vTileUv;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vTile = _tile;
        vMetal = _metal;
        vTileUv = uv;`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>${TILE_FRAGMENT}
        uniform float tileRepeat[${repeat.length}];
        varying float vTile;
        varying float vMetal;
        varying vec2 vTileUv;`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        vec3 tileSurf = vec3(0.5, 0.5, -1.0);
        vec2 tileUv = vTileUv;
        if (vTile > -0.5) {
          tileUv *= tileRepeat[int(vTile + 0.5)];
          diffuseColor.rgb *= texture(tileColor, vec3(tileUv, vTile)).rgb;
          tileSurf = texture(tileSurface, vec3(tileUv, vTile)).rgb;
        }`)
      .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = tileSurf.z < 0.0 ? 0.7 : clamp(tileSurf.z, 0.04, 1.0);')
      .replace('#include <metalnessmap_fragment>', 'float metalnessFactor = vMetal;')
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        if (tileSurf.z >= 0.0) {
          mat3 frame = tileFrame(-vViewPosition, normal, tileUv);
          normal = normalize(frame * vec3(tileSurf.xy * 2.0 - 1.0, 1.0));
        }`);
  };
  itemMat.customProgramCacheKey = () => 'tiled-item';
  return itemMat;
}

// A helmet of `look` with the parts marked _team painted in `team`.
const helmetCache = new Map();

function helmetFor(look, team) {
  const base = state.t.helmets && state.t.helmets[look];
  if (!base) return null;
  const key = `${look}:${team}`;
  let geo = helmetCache.get(key);
  if (geo) return geo;
  geo = base;
  const flags = base.getAttribute('_team');
  const color = base.getAttribute('color');
  if (flags && color && flags.array.some((v) => v > 0.5)) {
    geo = base.clone();
    const col = geo.getAttribute('color');
    const c = new THREE.Color(team);
    for (let i = 0; i < col.count; i++) {
      if (flags.getX(i) > 0.5) col.setXYZ(i, c.r * col.getX(i), c.g * col.getY(i), c.b * col.getZ(i));
    }
  }
  helmetCache.set(key, geo);
  return geo;
}

// ---------------------------------------------------------------------------
// One soldier
// ---------------------------------------------------------------------------

const LOCO = ['idle', 'walk', 'run', 'walk_back'];
const CULL_SPHERE = new THREE.Sphere(new THREE.Vector3(0, 1.0, 0), 1.6);
// levels of detail: full model up close, then 30 % and 10 % of the triangles
const LOD_DIST = [17, 45];

export class SkinnedHuman {
  // `props` draws the helmet (see props.js)
  constructor(spec, props) {
    const t = state.t;
    this.t = t;
    this.spec = spec;
    this.object = cloneSkinned(t.scene);
    this.bones = {};
    this.lod = [];
    this.object.traverse((o) => {
      if (o.isBone) this.bones[o.name] = o;
      const m = o.isSkinnedMesh && /_LOD(\d)$/.exec(o.name);
      if (m) this.lod[+m[1]] = o;
    });
    this.addHelmet(spec, props);
    // beards: none, a moustache or a full beard; helmets hide the hair
    const hide = new Set();
    if (spec.beard !== 'full') hide.add('Beard');
    if (!spec.beard) hide.add('Moustache');
    if (this.helmet) hide.add('Hair');
    const mat = soldierMat(spec, t.parts.map((name) => (hide.has(name) ? 1 : 0)));
    // the levels of detail share one skeleton: one bone update and one bone
    // texture per soldier
    const shared = this.lod[0].skeleton;
    this.lod.forEach((o, level) => {
      if (o.skeleton !== shared) o.bind(shared, o.bindMatrix);
      o.geometry = outfitGeometry(spec.look || 'cloth', level) || o.geometry;
      o.material = mat;
      o.customDepthMaterial = mat.userData.depth;
      o.castShadow = level < 2;
      o.receiveShadow = true;
      // a sphere that holds the body in any pose (arms up, lying dead), in
      // the mesh's own space: soldiers outside the view are not drawn
      o.boundingSphere = CULL_SPHERE;
    });
    this.lodLevel = -1;
    this.setLod(0);
    this.frameNo = Math.floor(Math.random() * 4);
    this.pending = 0;
    this.mixer = new THREE.AnimationMixer(this.object);
    this.actions = {};
    for (const k of LOCO) {
      const c = t.clips[k];
      if (!c) continue;
      const a = this.mixer.clipAction(c.clip);
      a.play();
      a.setEffectiveWeight(k === 'idle' ? 1 : 0);
      this.actions[k] = { action: a, clip: c, weight: k === 'idle' ? 1 : 0 };
    }
    this.phase = Math.random();
    this.idleTime = Math.random() * (t.clips.idle ? t.clips.idle.dur : 1);
    this.hipYaw = 0;
    // grips: where a held item sits in each hand
    this.grip = {};
    for (const s of ['l', 'r']) {
      const g = new THREE.Object3D();
      g.position.copy(t.hands[s].grip);
      g.quaternion.copy(t.hands[s].gripQ);
      this.bones[`hand_${s}`].add(g);
      this.grip[s] = g;
    }
    this.handPose = { l: 'relaxed', r: 'relaxed' };
  }

  setLod(level) {
    if (level === this.lodLevel) return;
    this.lodLevel = level;
    this.lod.forEach((o, i) => (o.visible = i === level));
  }

  addHelmet(spec, props) {
    const fitted = helmetFor(spec.helmet, spec.team);
    if (fitted) {
      const m = props.add(fitted, itemMaterial());
      this.bones.head.add(m);
      this.helmet = m;
      return;
    }
    const geo = helmetGeo(spec.helmet, spec.team);
    if (!geo) return;
    const fit = this.t.fit;
    const m = props.add(geo);
    // the procedural helmets are sized for a head whose hair is 0.12 m wide
    // (half) around (0, 0.19, 0) above the neck: scale and place them on
    // this head
    const hh = fit.hair_half || [0.08, 0.09, 0.1];
    const s = (Math.max(hh[0], hh[2] * 0.9) + 0.012) / 0.132;
    const c = new THREE.Vector3().fromArray(fit.hair_center || [0, 1.65, 0.04]);
    c.y -= hh[1] * 0.35;
    const local = c.applyMatrix4(this.t.headRestInv);
    const holder = new THREE.Object3D();
    holder.quaternion.copy(this.t.headRestQ).invert();
    holder.position.copy(local);
    m.scale.setScalar(s);
    m.position.set(0, -0.19 * s, 0);
    holder.add(m);
    this.bones.head.add(holder);
    this.helmet = m;
  }

  // Move the pose rig's shoulders and hands to where this body's are, so that
  // the targets it produces are within reach.
  fitDriver(rig) {
    const t = this.t;
    const hipY = rig.hips.position.y;
    rig.armR.position.set(t.shoulder.r.x, t.shoulder.r.y - hipY, t.shoulder.r.z);
    rig.armL.position.set(t.shoulder.l.x, t.shoulder.l.y - hipY, t.shoulder.l.z);
    rig.handR.position.y = -t.reach * 0.96;
    rig.handL.position.y = -t.reach * 0.96;
  }

  attach(obj, side) {
    this.grip[side].add(obj);
    obj.position.set(0, 0, 0);
    obj.rotation.set(0, 0, 0);
  }

  // ---- per frame ----------------------------------------------------------------------

  update(agent, dt) {
    const r = agent.rig;
    const b = this.bones;
    const cam = agent.battle.camera;
    const d2 = cam.position.distanceToSquared(agent.pos);
    const level = d2 < LOD_DIST[0] ** 2 ? 0 : d2 < LOD_DIST[1] ** 2 ? 1 : 2;
    this.setLod(level);
    // animation level of detail: distant soldiers are posed less often
    this.pending += dt;
    const every = [1, 2, 4][level];
    if (dt > 0 && this.frameNo++ % every !== 0) return;
    dt = this.pending;
    this.pending = 0;
    this.locomotion(agent, dt);
    b.pelvis.updateWorldMatrix(true, false);
    const rootQ = r.root.getWorldQuaternion(U.rootQ);

    if (agent.horse && agent.alive) this.ride(rootQ);

    // hips turn towards the walking direction; the torso follows the aim
    if (Math.abs(this.hipYaw) > 1e-3) rotateWorld(b.pelvis, worldRot(rootQ, U.a.setFromAxisAngle(Y, this.hipYaw), U.inc));
    if (agent.alive) {
      const torsoQ = U.a.copy(r.torso.quaternion).premultiply(U.b.setFromAxisAngle(Y, -this.hipYaw));
      const step = U.c.identity().slerp(torsoQ, 1 / 3);
      const inc = worldRot(rootQ, step, U.inc);
      rotateWorld(b.spine_01, inc);
      rotateWorld(b.spine_02, inc);
      rotateWorld(b.spine_03, inc);
      // look up and down
      const torsoWorld = U.d.copy(rootQ).multiply(r.torso.quaternion);
      const half = U.c.identity().slerp(r.neck.quaternion, 0.5);
      const neckInc = worldRot(torsoWorld, half, U.inc);
      rotateWorld(b.neck_01, neckInc);
      rotateWorld(b.head, neckInc);
      this.arms(agent, rootQ);
    }
    this.fingers();
  }

  locomotion(agent, dt) {
    const acts = this.actions;
    const t = this.t;
    let sp = 0;
    let rel = 0;
    if (agent.alive && !agent.horse) {
      sp = Math.hypot(agent.vel.x, agent.vel.z);
      rel = wrapAngle(Math.atan2(agent.vel.x, agent.vel.z) - agent.yaw);
    }
    const moving = smoothstep(0.15, 0.7, sp);
    const backward = Math.abs(rel) > 1.95;
    const wRun = backward ? 0 : smoothstep(2.0, 3.3, sp);
    const target = {
      idle: 1 - moving,
      walk: backward ? 0 : moving * (1 - wRun),
      run: backward ? 0 : moving * wRun,
      walk_back: backward ? moving : 0,
    };
    let hip = 0;
    if (moving > 0.01) hip = clamp(backward ? wrapAngle(rel - Math.PI) : rel, -1.1, 1.1) * moving;
    const k = Math.min(1, dt * 8);
    this.hipYaw += (hip - this.hipYaw) * k;
    // step frequency
    const cyc = (c) => (c ? Math.max(0.3, c.speed * c.dur) : 1);
    let freq;
    if (backward) freq = sp / cyc(t.clips.walk_back);
    else freq = (sp / cyc(t.clips.walk)) * (1 - wRun) + (sp / cyc(t.clips.run)) * wRun;
    freq = clamp(freq, 0.35, 2.4);
    this.phase = (this.phase + dt * freq) % 1;
    this.idleTime += dt;
    for (const [name, a] of Object.entries(acts)) {
      a.weight += (target[name] - a.weight) * k;
      a.action.setEffectiveWeight(a.weight);
      const c = a.clip;
      a.action.time = name === 'idle' ? this.idleTime % c.dur : ((this.phase + c.offset) % 1) * c.dur;
    }
    this.mixer.update(0);
  }

  ride(rootQ) {
    const b = this.bones;
    for (const s of ['l', 'r']) {
      const side = s === 'l' ? 1 : -1;
      const hip = b[`thigh_${s}`].getWorldPosition(U.v1);
      const foot = U.v2.set(side * 0.3, -0.78, 0.18).applyQuaternion(rootQ).add(hip);
      const pole = U.v3.set(side * 0.3, 0, 1).applyQuaternion(rootQ).add(hip);
      solveLimb(b[`thigh_${s}`], b[`calf_${s}`], b[`foot_${s}`], this.t.limbs[`leg_${s}`], foot, pole);
    }
  }

  arms(agent, rootQ) {
    const r = agent.rig;
    const w = agent.weapon;
    // right hand: the weapon grip of the pose rig
    const wristQ = r.wristR.getWorldQuaternion(A.wristQ);
    const wristP = r.wristR.getWorldPosition(A.wristP);
    this.placeHand('r', wristP, wristQ, rootQ);
    this.handPose.r = 'fist';
    // left hand
    const sh = agent.activeShield();
    if (w.cls === 'bow') {
      this.placeHand('l', r.handL.getWorldPosition(A.pos), r.handL.getWorldQuaternion(A.q), rootQ);
      this.handPose.l = 'fist';
    } else if (sh && agent.shieldMesh) {
      agent.shieldMesh.updateWorldMatrix(true, false);
      const grip = agent.shieldMesh.localToWorld(A.pos.set(0, 0, -0.05));
      // hold the shield's handle: knuckles along the shield's up axis
      const q = agent.shieldMesh.getWorldQuaternion(A.q).multiply(A.q2.setFromAxisAngle(X, -Math.PI / 2));
      this.placeHand('l', grip, q, rootQ);
      this.handPose.l = 'fist';
    } else if (w.lance && agent.horse) {
      // reins in the left hand
      this.placeHand('l', r.handL.getWorldPosition(A.pos), r.handL.getWorldQuaternion(A.q), rootQ);
      this.handPose.l = 'fist';
    } else if (w.twoHanded || w.cls === 'spear' || w.cls === 'crossbow') {
      const dir = A.dir.set(0, 0, 1).applyQuaternion(wristQ);
      const along = w.cls === 'spear' ? 0.42 : w.cls === 'crossbow' ? 0.34 : -0.13;
      this.placeHand('l', A.pos.copy(wristP).addScaledVector(dir, along), wristQ, rootQ);
      this.handPose.l = 'fist';
    } else {
      // a free hand hangs by the side when standing and swings with the
      // captured walk when moving
      const idleW = this.actions.idle ? this.actions.idle.weight : 0;
      if (idleW > 0.02) {
        const b = this.bones;
        const wrist = b.hand_l.getWorldPosition(A.pos);
        const shoulder = b.upperarm_l.getWorldPosition(A.dir);
        wrist.lerp(A.hang.set(0.08, -0.55, 0.035).applyQuaternion(rootQ).add(shoulder), idleW);
        const hangQ = this.handWorld('l', rootQ, A.q2);
        const q = worldQuat(b.hand_l, A.q).slerp(hangQ, idleW);
        this.placeWrist('l', wrist, q, rootQ);
      }
      this.handPose.l = 'relaxed';
    }
  }

  // World orientation of hand `s` holding an item whose frame is `q` (item
  // along +Z, the arm along -Y).
  handWorld(s, q, out) {
    const hand = this.t.hands[s];
    const len = H.len.set(0, -1, 0).applyQuaternion(q);
    const knuck = H.knuck.set(0, 0, 1).applyQuaternion(q);
    const palm = s === 'r' ? H.palm.crossVectors(knuck, len) : H.palm.crossVectors(len, knuck);
    H.m.makeBasis(len, knuck, palm);
    return out.setFromRotationMatrix(H.m).multiply(H.inv.copy(hand.basisQ).invert());
  }

  placeWrist(s, wrist, handWorldQ, rootQ) {
    const b = this.bones;
    const side = s === 'l' ? 1 : -1;
    const shoulder = b[`upperarm_${s}`].getWorldPosition(H.shoulder);
    const pole = H.pole.set(side * 0.55, -0.55, -0.45).applyQuaternion(rootQ).add(shoulder);
    solveLimb(b[`upperarm_${s}`], b[`lowerarm_${s}`], b[`hand_${s}`], this.t.limbs[`arm_${s}`], wrist, pole);
    setWorldQuat(b[`hand_${s}`], handWorldQ);
  }

  // Put hand `s` so that its grip sits at `pos` with the held item oriented
  // like the pose rig's `q` (item along +Z, the arm along -Y).
  placeHand(s, pos, q, rootQ) {
    const handWorld = this.handWorld(s, q, H.q);
    // wrist position = grip minus the grip offset
    const wrist = H.wrist.copy(this.t.hands[s].grip).applyQuaternion(handWorld);
    wrist.subVectors(pos, wrist);
    this.placeWrist(s, wrist, handWorld, rootQ);
  }

  fingers() {
    const b = this.bones;
    for (const s of ['l', 'r']) {
      const pose = this.t.hands[s][this.handPose[s]];
      for (const name in pose) b[name].quaternion.copy(pose[name]);
    }
  }
}

// ---------------------------------------------------------------------------
// Bone math (world space). Every function has its own scratch objects so
// that callers can pass theirs in safely.
// ---------------------------------------------------------------------------

const Y = new THREE.Vector3(0, 1, 0);
const X = new THREE.Vector3(1, 0, 0);
const scratch = (vs, qs, extra = {}) => {
  const o = { ...extra };
  for (const n of vs) o[n] = new THREE.Vector3();
  for (const n of qs) o[n] = new THREE.Quaternion();
  return o;
};
const U = scratch(['v1', 'v2', 'v3'], ['rootQ', 'a', 'b', 'c', 'd', 'inc']);
const A = scratch(['wristP', 'pos', 'dir', 'hang'], ['wristQ', 'q', 'q2']);
const H = scratch(['len', 'knuck', 'palm', 'wrist', 'shoulder', 'pole'], ['q', 'inv'], { m: new THREE.Matrix4() });
const WR = scratch([], ['inv']);
const WQ = scratch(['p', 's'], []);
const RW = scratch([], ['p', 'inv']);
const SQ = scratch([], ['p']);
const AI = scratch(['from', 'pos', 'to'], ['q', 'r']);
const SL = scratch(['S', 'dir', 'p', 'E', 'T', 'n', 'h', 'axis', 'tmp'], ['q', 'r']);

// a rotation given in the frame `frameQ` (e.g. the soldier's root) as a world rotation
function worldRot(frameQ, local, out) {
  return out.copy(frameQ).multiply(local).multiply(WR.inv.copy(frameQ).invert());
}

function worldQuat(o, out) {
  o.matrixWorld.decompose(WQ.p, out, WQ.s);
  return out;
}

// Recompute a bone's world matrix from its (up to date) parent's, without
// touching its children: the pose code walks down each chain in order and
// the renderer updates everything once more before drawing.
function refresh(bone) {
  bone.updateMatrix();
  bone.matrixWorld.multiplyMatrices(bone.parent.matrixWorld, bone.matrix);
}

// rotate a bone by the world rotation R about its own pivot
function rotateWorld(bone, R) {
  worldQuat(bone.parent, RW.p);
  // local' = P^-1 * R * P * local
  RW.inv.copy(RW.p).invert();
  bone.quaternion.premultiply(RW.p).premultiply(R).premultiply(RW.inv);
  refresh(bone);
}

function setWorldQuat(bone, q) {
  worldQuat(bone.parent, SQ.p);
  bone.quaternion.copy(SQ.p.invert()).multiply(q);
  refresh(bone);
}

// rotate `bone` (minimally) so that its local direction `localDir` points at `target`
function aim(bone, localDir, target) {
  refresh(bone);
  const q = worldQuat(bone, AI.q);
  const from = AI.from.copy(localDir).applyQuaternion(q).normalize();
  const pos = AI.pos.setFromMatrixPosition(bone.matrixWorld);
  const to = AI.to.subVectors(target, pos).normalize();
  rotateWorld(bone, AI.r.setFromUnitVectors(from, to));
}

// Two-bone IK: put the end of the limb at `target`, bending in the plane that
// contains `pole` and keeping the middle joint a hinge.
function solveLimb(upper, lower, end, info, target, pole) {
  upper.updateWorldMatrix(true, false);
  const S = SL.S.setFromMatrixPosition(upper.matrixWorld);
  const { a, b } = info;
  const dir = SL.dir.subVectors(target, S);
  let d = dir.length();
  if (d < 1e-4) return;
  dir.divideScalar(d);
  d = clamp(d, Math.abs(a - b) + 1e-3, (a + b) * 0.999);
  const cosA = clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1);
  const sinA = Math.sqrt(1 - cosA * cosA);
  const p = SL.p.subVectors(pole, S);
  p.addScaledVector(dir, -p.dot(dir));
  if (p.lengthSq() < 1e-8) p.set(0, -1, 0).addScaledVector(dir, -dir.y);
  p.normalize();
  const E = SL.E.copy(S).addScaledVector(dir, a * cosA).addScaledVector(p, a * sinA);
  const T = SL.T.copy(S).addScaledVector(dir, d);
  // upper bone: aim at the elbow, then roll its hinge axis into the bend plane
  aim(upper, info.lowerDir, E);
  const n = SL.n.subVectors(E, S).cross(SL.tmp.subVectors(T, E));
  if (n.lengthSq() > 1e-10) {
    n.normalize();
    const h = SL.h.copy(info.hinge).applyQuaternion(worldQuat(upper, SL.q));
    const axis = SL.axis.subVectors(E, S).normalize();
    h.addScaledVector(axis, -h.dot(axis)).normalize();
    n.addScaledVector(axis, -n.dot(axis)).normalize();
    const ang = Math.atan2(SL.tmp.crossVectors(h, n).dot(axis), h.dot(n));
    rotateWorld(upper, SL.r.setFromAxisAngle(axis, ang));
  }
  aim(lower, info.endDir, T);
}
