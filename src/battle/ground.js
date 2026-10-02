// Photographed ground (built by tools/ground/build_ground.py and packed into
// dist/characters.js): layers of grass, earth, sand, snow and rock, four per
// battlefield type, painted onto the terrain by the weights each vertex
// carries (`splat`: two kinds of the ground of the place, bare earth, rock).
// Where layers meet, the one standing higher at that point of its surface
// wins (grass between the stones, sand in the hollows). The layers repeat
// at their real size; further than GROUND_FAR they are also drawn four
// times larger and blended in, so that the repetition does not show.
import * as THREE from 'three';
import { bytesOf } from './partmat.js';

// the four layers of each battlefield type: the ground of the place, its
// second kind (in patches), bare earth, rock (the steep slopes); a layer
// with a colour is tinted by it (grey cracked earth warmed to go with sand)
const WARM = [1.2, 1.0, 0.76];
export const GROUND_LAYERS = {
  plains: ['meadow', 'grass_twigs', 'dirt', 'mossy_rock'],
  forest: ['grass_twigs', 'moss_ground', 'dirt', 'mossy_rock'],
  hills: ['meadow', 'dry_grass', 'dirt', 'mossy_rock'],
  steppe: ['dry_grass', ['cracked_earth', WARM], 'dirt', 'rock'],
  desert: ['sand_gravel', ['cracked_earth', WARM], 'dirt', 'rock'],
  snow: ['snow', 'snow', 'trodden_snow', 'mossy_rock'],
  taiga: ['needles', 'snow', 'dirt', 'mossy_rock'],
  arena: ['sand_gravel', ['cracked_earth', WARM], 'dirt', 'rock'],
};
const layerName = (l) => (Array.isArray(l) ? l[0] : l);
const layerTint = (l) => (Array.isArray(l) ? l[1] : [1, 1, 1]);

let G = null;

export async function loadGround(assets) {
  const g = assets.ground;
  const bitmap = (b64) =>
    createImageBitmap(new Blob([bytesOf(b64)], { type: 'image/webp' }), { colorSpaceConversion: 'none', premultiplyAlpha: 'none' });
  const layers = {};
  for (const [name, l] of Object.entries(g.layers)) {
    const [color, surface] = await Promise.all([bitmap(l.color), bitmap(l.surface)]);
    layers[name] = { color, surface, tile: l.tile, roughness: l.roughness, mean: l.mean, textures: null };
  }
  let grass = null;
  if (g.grass) {
    const color = {};
    for (const [k, b64] of Object.entries(g.grass.color)) color[k] = await bitmap(b64);
    grass = { ...g.grass, color, alpha: await bitmap(g.grass.alpha), textures: {} };
  }
  G = { layers, grass };
}

export function groundReady() {
  return !!G;
}

export function grassReady() {
  return !!(G && G.grass);
}

// The mean colour (linear) of a layer: the terrain beyond the battlefield.
export function groundMean(type) {
  const l = G.layers[layerName((GROUND_LAYERS[type] || GROUND_LAYERS.plains)[0])];
  return new THREE.Color().setRGB(l.mean[0], l.mean[1], l.mean[2], THREE.LinearSRGBColorSpace);
}

function textures(l) {
  if (!l.textures) {
    const make = (image, colorSpace) => {
      const t = new THREE.Texture(image);
      t.colorSpace = colorSpace;
      // (an ImageBitmap is not flipped on upload: the shader reads the
      // normal's green channel the other way round)
      t.flipY = false;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.anisotropy = 4;
      t.needsUpdate = true;
      return t;
    };
    l.textures = { color: make(l.color, THREE.SRGBColorSpace), surface: make(l.surface, THREE.NoColorSpace) };
  }
  return l.textures;
}

// metres from the camera where the ground starts to be blended with its
// larger copy, and where only that is left
const GROUND_NEAR = 18;
const GROUND_FAR = 60;

const VERTEX = `
  attribute vec4 splat;
  varying vec4 vSplat;
  varying vec3 vGround;`;

const FRAGMENT = `
  uniform sampler2D groundColor0, groundColor1, groundColor2, groundColor3;
  uniform sampler2D groundSurface0, groundSurface1, groundSurface2, groundSurface3;
  uniform vec4 groundScale;
  uniform vec4 groundRough;
  uniform vec3 groundTint[4];
  varying vec4 vSplat;
  varying vec3 vGround;`;

// one layer: its colour near and far (by the blend of the two), its surface
// near (normal, height); inactive layers are not looked up. textureGrad:
// the derivatives come from outside the branches.
const LAYER = (i, c) => `
  if (w.${c} > 0.004) {
    vec2 uv = gp * groundScale.${c} + vec2(${(0.37 * i).toFixed(2)}, ${(0.61 * i).toFixed(2)});
    vec2 dx = gdx * groundScale.${c};
    vec2 dy = gdy * groundScale.${c};
    vec3 near = vec3(0.0);
    if (far < 0.999) {
      near = textureGrad(groundColor${i}, uv, dx, dy).rgb;
      vec4 s = textureGrad(groundSurface${i}, uv, dx, dy);
      gn${i} = s.rg * 2.0 - 1.0;
      gh.${c} = s.b;
    }
    vec3 farC = far > 0.001 ? textureGrad(groundColor${i}, uv * 0.23 + 0.5, dx * 0.23, dy * 0.23).rgb : near;
    gc${i} = mix(near, farC, far) * groundTint[${i}];
  }`;

const MAP = `
  vec2 gp = vGround.xz;
  vec2 gdx = dFdx(gp);
  vec2 gdy = dFdy(gp);
  float far = smoothstep(${GROUND_NEAR.toFixed(1)}, ${GROUND_FAR.toFixed(1)}, distance(vGround, cameraPosition));
  vec4 w = vSplat / max(dot(vSplat, vec4(1.0)), 1e-4);
  vec3 gc0 = vec3(0.0), gc1 = vec3(0.0), gc2 = vec3(0.0), gc3 = vec3(0.0);
  vec2 gn0 = vec2(0.0), gn1 = vec2(0.0), gn2 = vec2(0.0), gn3 = vec2(0.0);
  vec4 gh = vec4(0.5);
  ${LAYER(0, 'x')}
  ${LAYER(1, 'y')}
  ${LAYER(2, 'z')}
  ${LAYER(3, 'w')}
  // the layer standing highest where they meet wins (heights count less
  // far away, where they are not looked up)
  vec4 hw = w + (gh - 0.5) * 0.6 * (1.0 - far) * step(0.004, w);
  float top = max(max(hw.x, hw.y), max(hw.z, hw.w));
  vec4 gb = max(hw - (top - 0.2), 0.0) * step(0.004, w);
  gb /= max(dot(gb, vec4(1.0)), 1e-4);
  diffuseColor.rgb *= gc0 * gb.x + gc1 * gb.y + gc2 * gb.z + gc3 * gb.w;
  vec2 groundNormal = (gn0 * gb.x + gn1 * gb.y + gn2 * gb.z + gn3 * gb.w) * (1.0 - far);
  float groundRoughness = dot(gb, groundRough);`;

// the surface's normal on the terrain: tangent along +x, the image's up
// (green) along -z in the world (the textures are not flipped)
const NORMAL = `
  {
    vec3 nw = normalize((vec4(normal, 0.0) * viewMatrix).xyz);
    vec3 tw = normalize(vec3(1.0, 0.0, 0.0) - nw * nw.x);
    vec3 bw = cross(nw, tw);
    vec3 pw = tw * groundNormal.x + bw * groundNormal.y + nw * sqrt(max(1.0 - dot(groundNormal, groundNormal), 0.0));
    normal = normalize(mat3(viewMatrix) * pw);
  }`;

// The terrain's material: `type` the battlefield type. The geometry needs
// the `splat` attribute (vec4 weights of the four layers) and colours (a
// shade over the ground).
export function groundMaterial(type) {
  const set = GROUND_LAYERS[type] || GROUND_LAYERS.plains;
  const layers = set.map((l) => G.layers[layerName(l)]);
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 });
  const uniforms = {
    groundScale: { value: new THREE.Vector4(...layers.map((l) => 1 / l.tile)) },
    groundRough: { value: new THREE.Vector4(...layers.map((l) => l.roughness)) },
    groundTint: { value: set.map((l) => new THREE.Vector3(...layerTint(l))) },
  };
  layers.forEach((l, i) => {
    const t = textures(l);
    uniforms[`groundColor${i}`] = { value: t.color };
    uniforms[`groundSurface${i}`] = { value: t.surface };
  });
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${VERTEX}`)
      .replace('#include <fog_vertex>', '#include <fog_vertex>\n  vSplat = splat;\n  vGround = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${FRAGMENT}`)
      .replace('#include <map_fragment>', MAP)
      .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = groundRoughness;')
      .replace('#include <normal_fragment_maps>', NORMAL);
  };
  mat.customProgramCacheKey = () => 'ground';
  return mat;
}

// ---------------------------------------------------------------------------
// Grass
// ---------------------------------------------------------------------------

// The grass of each battlefield type: the atlas (green or dried) and a tint.
export const GRASS_LOOK = {
  plains: ['green', [1.12, 1.12, 1.05]],
  forest: ['green', [0.98, 1.04, 0.94]],
  hills: ['green', [1.12, 1.1, 1.02]],
  taiga: ['green', [0.96, 1.0, 0.94]],
  steppe: ['dry', [1, 0.97, 0.9]],
  snow: ['dry', [1.05, 1.05, 1.08]],
};

// A tuft: two crossed cards showing one clump of the atlas (which, from
// the tuft's place), cut to the outline around the clumps. The vertices
// carry the card's direction (position) and where they are on it (uv:
// across, up, 0..1 of the clump's box); the shader places them.
export function grassGeometry() {
  const outline = G.grass.outline;
  const pos = [];
  const uv = [];
  const col = [];
  const index = [];
  for (let c = 0; c < 2; c++) {
    const a = (c * Math.PI) / 2;
    const base = pos.length / 3;
    for (const [u, t] of outline) {
      pos.push(Math.cos(a), 0, Math.sin(a));
      uv.push(u, t);
      // darker at the foot, where the blades shade each other
      const v = 0.72 + 0.28 * t;
      col.push(v, v, v);
    }
    for (let k = 1; k < outline.length - 1; k++) index.push(base, base + k, base + k + 1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  // lit like the ground it stands on
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(pos.map((_, i) => (i % 3 === 1 ? 1 : 0)), 3));
  geo.setIndex(index);
  // (the shader moves the vertices: bounds of the largest tuft)
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0.2, 0), 0.5);
  return geo;
}

function grassTextures(variant) {
  const g = G.grass;
  if (!g.textures[variant]) {
    const make = (image, colorSpace) => {
      const t = new THREE.Texture(image);
      t.colorSpace = colorSpace;
      t.flipY = false;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.anisotropy = 4;
      t.needsUpdate = true;
      return t;
    };
    if (!g.textures.alpha) g.textures.alpha = make(g.alpha, THREE.NoColorSpace);
    g.textures[variant] = make(g.color[variant] || g.color.green, THREE.SRGBColorSpace);
  }
  return { map: g.textures[variant], alphaMap: g.textures.alpha };
}

const GRASS_VERTEX = `
  uniform vec3 grassBox[8];
  uniform float grassSize[8];
  uniform float grassTime;`;

// which clump a tuft shows (from its place; the two thin pale ones, which
// far away turn into light specks, are left out), the card's texture
// coordinates in the atlas (4 x 2 tiles, the first row on top, a clump's
// foot at the bottom of its tile) and its size
const GRASS_UV = `
  #include <uv_vertex>
  #ifdef USE_INSTANCING
    vec3 tuft = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
  #else
    vec3 tuft = vec3(0.0);
  #endif
  int tile = int(fract(sin(dot(tuft.xz, vec2(12.9898, 78.233))) * 43758.5453) * 6.0);
  vec3 box = grassBox[tile];
  float across = box.x + uv.x * (box.y - box.x);
  float up = uv.y * box.z;
  float column = mod(float(tile), 4.0);
  float row = floor(float(tile) / 4.0);
  vMapUv = vec2((column + across) / 4.0, (row + 1.0 - up) / 2.0);
  vAlphaMapUv = vMapUv;`;

const GRASS_SWAY = `
  #include <begin_vertex>
  float clump = grassSize[tile];
  transformed = vec3(position.x * (across - 0.5), up, position.z * (across - 0.5)) * clump;
  float sway = sin(grassTime * 1.6 + tuft.x * 0.21 + tuft.z * 0.17) * 0.6 + sin(grassTime * 2.9 + tuft.x * 0.7 - tuft.z * 0.4) * 0.25;
  float bend = up * up * clump;
  transformed.x += sway * bend * 0.25;
  transformed.z += sway * bend * 0.15;`;

// thin blades vanish far away (the mipmaps average them with the gaps):
// their alpha is raised with the mipmap level
const GRASS_ALPHA = `
  #include <alphamap_fragment>
  {
    vec2 tdx = dFdx(vAlphaMapUv * vec2(1024.0, 512.0));
    vec2 tdy = dFdy(vAlphaMapUv * vec2(1024.0, 512.0));
    float mip = max(0.0, 0.5 * log2(max(dot(tdx, tdx), dot(tdy, tdy))));
    diffuseColor.a *= 1.0 + 0.35 * mip;
  }`;

// The grass's material for a battlefield type; `time` drives the wind.
export function grassMaterial(type, time) {
  const [variant, tint] = GRASS_LOOK[type] || GRASS_LOOK.plains;
  const { map, alphaMap } = grassTextures(variant);
  const mat = new THREE.MeshStandardMaterial({ map, alphaMap, alphaTest: 0.5, side: THREE.DoubleSide, vertexColors: true, roughness: 1, metalness: 0 });
  mat.color.setRGB(tint[0], tint[1], tint[2]);
  const uniforms = {
    grassBox: { value: G.grass.boxes.map((b) => new THREE.Vector3(...b)) },
    grassSize: { value: G.grass.sizes },
    grassTime: time,
  };
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${GRASS_VERTEX}`)
      .replace('#include <uv_vertex>', GRASS_UV)
      .replace('#include <begin_vertex>', GRASS_SWAY);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <alphamap_fragment>', GRASS_ALPHA)
      // both sides lit as the ground (the normal points up either way)
      .replace('#include <normal_fragment_begin>', THREE.ShaderChunk.normal_fragment_begin.replace('normal *= faceDirection;', ''));
  };
  mat.customProgramCacheKey = () => 'grass-cards';
  return mat;
}
