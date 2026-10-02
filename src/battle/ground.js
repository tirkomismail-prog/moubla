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
  G = { layers };
}

export function groundReady() {
  return !!G;
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
