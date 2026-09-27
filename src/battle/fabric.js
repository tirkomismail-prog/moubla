// Surface detail for the soldiers' clothes, armour and skin: small tileable
// patterns (weave, quilting, mail rings, plates, leather grain, pores) painted
// procedurally, applied with triplanar mapping in the mesh's rest space so
// the pattern sticks to the cloth as the body moves. Each texel stores
// R = height (bump), G = albedo, B = roughness, A = large-scale mottling.
import * as THREE from 'three';
import { mulberry32 } from '../core/rng.js';

const SIZE = 256;
const cache = new Map();

// tileable value noise on a `cells` x `cells` lattice
function tileNoise(rand, cells) {
  const g = new Float32Array(cells * cells);
  for (let i = 0; i < g.length; i++) g[i] = rand();
  return (x, y) => {
    const fx = (x / SIZE) * cells;
    const fy = (y / SIZE) * cells;
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const tx = fx - x0;
    const ty = fy - y0;
    const sx = tx * tx * (3 - 2 * tx);
    const sy = ty * ty * (3 - 2 * ty);
    const at = (i, j) => g[(((j % cells) + cells) % cells) * cells + (((i % cells) + cells) % cells)];
    const a = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * sx;
    const b = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * sx;
    return a + (b - a) * sy;
  };
}

function fbm(noises, x, y) {
  let v = 0;
  let w = 0.5;
  let t = 0;
  for (const n of noises) {
    v += n(x, y) * w;
    t += w;
    w *= 0.5;
  }
  return v / t;
}

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const TAU = Math.PI * 2;

// Pattern painters: return [height, albedo, roughness] in 0..1 for a texel.
const PAINTERS = {
  // twill wool: diagonal ribs, thread noise
  wool(rand) {
    const fine = tileNoise(rand, 64);
    const mid = tileNoise(rand, 16);
    return (x, y) => {
      const rib = 0.5 + 0.5 * Math.sin(((x + y * 2) / SIZE) * TAU * 24);
      const n = fine(x, y);
      return [rib * 0.7 + n * 0.3, 0.5 + (n - 0.5) * 0.16 + (mid(x, y) - 0.5) * 0.12 - rib * 0.05, 0.5 + (n - 0.5) * 0.2];
    };
  },
  // plain-woven linen / knit hose: fine grid of threads
  knit(rand) {
    const fine = tileNoise(rand, 64);
    return (x, y) => {
      const a = 0.5 + 0.5 * Math.sin((x / SIZE) * TAU * 40);
      const b = 0.5 + 0.5 * Math.sin((y / SIZE) * TAU * 28 + Math.sin((x / SIZE) * TAU * 40) * 1.5);
      const h = a * 0.6 + b * 0.4;
      const n = fine(x, y);
      return [h * 0.8 + n * 0.2, 0.5 + (n - 0.5) * 0.12 - (1 - h) * 0.06, 0.5];
    };
  },
  // quilted gambeson: vertical padded channels with stitched seams
  quilt(rand) {
    const fine = tileNoise(rand, 64);
    const mid = tileNoise(rand, 8);
    return (x, y) => {
      const u = (x / SIZE) * 4; // 4 channels per tile
      const f = u - Math.floor(u);
      const puff = Math.sin(f * Math.PI);
      const stitch = f < 0.04 || f > 0.96 ? (Math.floor(y / 6) % 2 ? 0.2 : 0) : 0;
      const n = fine(x, y);
      return [puff * 0.85 + n * 0.1 - stitch, 0.52 - (1 - puff) * 0.18 + (mid(x, y) - 0.5) * 0.1 + (n - 0.5) * 0.06, 0.55];
    };
  },
  // riveted mail: rows of interlinked rings
  mail(rand) {
    const fine = tileNoise(rand, 64);
    const rows = 16;
    const cols = 16;
    const R = 0.36; // ring radius in cell units
    return (x, y) => {
      const cx = (x / SIZE) * cols;
      const cy = (y / SIZE) * rows;
      let h = 0;
      for (let dj = -1; dj <= 1; dj++) {
        for (let di = -1; di <= 1; di++) {
          const j = Math.floor(cy) + dj;
          const off = j % 2 ? 0.5 : 0;
          const i = Math.floor(cx - off) + di;
          const px = i + off + 0.5;
          const py = j + 0.5;
          const d = Math.hypot((cx - px) * 1.0, (cy - py) * 1.25);
          const ring = 1 - Math.min(1, Math.abs(d - R) / 0.14);
          h = Math.max(h, ring * ring * (3 - 2 * ring));
        }
      }
      const n = fine(x, y);
      return [h, 0.12 + h * 0.62 + (n - 0.5) * 0.08, 0.95 - h * 0.6];
    };
  },
  // lamellar: overlapping rows of small laced plates
  lamellar(rand) {
    const fine = tileNoise(rand, 64);
    return (x, y) => {
      const cy = (y / SIZE) * 4;
      const row = Math.floor(cy);
      const cx = (x / SIZE) * 10 + (row % 2 ? 0.5 : 0);
      const fx = cx - Math.floor(cx);
      const fy = cy - row;
      const edge = Math.min(fx, 1 - fx) * 3;
      let h = clamp01(edge) * (0.6 + 0.4 * fy);
      const hole = Math.hypot(fx - 0.5, fy - 0.2) < 0.06 ? 0.4 : 0;
      h -= hole;
      const n = fine(x, y);
      return [h, 0.4 + h * 0.35 + (n - 0.5) * 0.1, 0.55 - h * 0.25 + (n - 0.5) * 0.1];
    };
  },
  // plate: horizontal lames with rolled edges, brushed and dented
  plate(rand) {
    const brush = tileNoise(rand, 64);
    const dent = tileNoise(rand, 12);
    return (x, y) => {
      const cy = (y / SIZE) * 3;
      const fy = cy - Math.floor(cy);
      const ridge = fy > 0.9 ? (fy - 0.9) * 10 : fy < 0.05 ? 1 - fy * 20 : 0;
      const streak = brush(x * 0.25, y * 4);
      const d = dent(x, y);
      const h = 0.4 + ridge * 0.5 + (d - 0.5) * 0.3;
      return [h, 0.52 - (fy < 0.05 ? 0.2 : 0) + (streak - 0.5) * 0.08, 0.5 + (streak - 0.5) * 0.35];
    };
  },
  leather(rand) {
    const grain = tileNoise(rand, 96);
    const wr = tileNoise(rand, 12);
    const mid = tileNoise(rand, 6);
    return (x, y) => {
      const g = grain(x, y);
      const w = Math.abs(wr(x, y) - 0.5) * 2;
      const crease = w < 0.08 ? 1 - w / 0.08 : 0;
      return [g * 0.7 - crease * 0.4 + 0.2, 0.5 + (mid(x, y) - 0.5) * 0.25 - crease * 0.12 + (g - 0.5) * 0.06, 0.5 + (g - 0.5) * 0.3];
    };
  },
  // skin: pores and very fine wrinkles
  skin(rand) {
    const n1 = tileNoise(rand, 128);
    const n2 = tileNoise(rand, 32);
    const pores = [];
    for (let i = 0; i < 900; i++) pores.push([rand() * SIZE, rand() * SIZE, 0.8 + rand() * 1.2]);
    const grid = new Float32Array(SIZE * SIZE);
    for (const [px, py, r] of pores) {
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          const d = Math.hypot(dx, dy) / r;
          if (d < 1) {
            const i = ((Math.round(py + dy) + SIZE) % SIZE) * SIZE + ((Math.round(px + dx) + SIZE) % SIZE);
            grid[i] = Math.max(grid[i], 1 - d);
          }
        }
      }
    }
    return (x, y) => {
      const p = grid[y * SIZE + x];
      const n = n1(x, y);
      return [0.6 - p * 0.4 + (n - 0.5) * 0.2, 0.5 + (n2(x, y) - 0.5) * 0.1 - p * 0.03, 0.5 + p * 0.2];
    };
  },
};

function patternTexture(kind) {
  let tex = cache.get(kind);
  if (tex) return tex;
  const rand = mulberry32(kind.length * 7919 + kind.charCodeAt(0));
  const paint = PAINTERS[kind](rand);
  const mott = [tileNoise(rand, 4), tileNoise(rand, 8), tileNoise(rand, 16)];
  const data = new Uint8Array(SIZE * SIZE * 4);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const [h, a, r] = paint(x, y);
      const o = (y * SIZE + x) * 4;
      data[o] = clamp01(h) * 255;
      data[o + 1] = clamp01(a) * 255;
      data[o + 2] = clamp01(r) * 255;
      data[o + 3] = clamp01(fbm(mott, x, y)) * 255;
    }
  }
  tex = new THREE.DataTexture(data, SIZE, SIZE, THREE.RGBAFormat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  cache.set(kind, tex);
  return tex;
}

// Pattern settings: world size of one tile (m), bump strength, and how much
// the pattern changes the colour, roughness and metalness.
export const PATTERNS = {
  wool: { tile: 0.06, bump: 0.6, albedo: 0.9, rough: 0.3, metal: 0, mottle: 0.25 },
  knit: { tile: 0.035, bump: 0.5, albedo: 0.8, rough: 0.2, metal: 0, mottle: 0.2 },
  quilt: { tile: 0.22, bump: 2.2, albedo: 1.0, rough: 0.2, metal: 0, mottle: 0.25 },
  mail: { tile: 0.1, bump: 1.4, albedo: 1.5, rough: 1.0, metal: 0.7, mottle: 0.3 },
  lamellar: { tile: 0.24, bump: 2.0, albedo: 1.0, rough: 0.8, metal: 0.3, mottle: 0.3 },
  plate: { tile: 0.3, bump: 1.2, albedo: 0.8, rough: 1.0, metal: 0, mottle: 0.35 },
  leather: { tile: 0.12, bump: 0.8, albedo: 1.0, rough: 0.8, metal: 0, mottle: 0.4 },
  skin: { tile: 0.035, bump: 0.25, albedo: 0.6, rough: 0.5, metal: 0, mottle: 0.15 },
};

// Add a pattern to a MeshStandardMaterial (chains an existing onBeforeCompile).
export function applyPattern(material, kind) {
  const p = PATTERNS[kind];
  const tex = patternTexture(kind);
  const prev = material.onBeforeCompile;
  const prevKey = material.customProgramCacheKey ? material.customProgramCacheKey() : '';
  material.onBeforeCompile = (shader, renderer) => {
    if (prev && prev !== THREE.Material.prototype.onBeforeCompile) prev(shader, renderer);
    shader.uniforms.patTex = { value: tex };
    shader.uniforms.patParams = { value: new THREE.Vector4(1 / p.tile, p.bump * 0.02, p.albedo, p.rough) };
    shader.uniforms.patExtra = { value: new THREE.Vector2(p.metal, p.mottle) };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vPatPos;\nvarying vec3 vPatNrm;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvPatPos = position;\nvPatNrm = normal;');
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform sampler2D patTex;
        uniform vec4 patParams;
        uniform vec2 patExtra;
        varying vec3 vPatPos;
        varying vec3 vPatNrm;
        vec4 patSample(vec3 p, vec3 n, float scale) {
          vec3 w = pow(abs(n), vec3(4.0));
          w /= (w.x + w.y + w.z + 1e-5);
          return texture2D(patTex, p.zy * scale) * w.x + texture2D(patTex, p.xz * scale) * w.y + texture2D(patTex, p.xy * scale) * w.z;
        }
        vec3 patBumpNormal(vec3 surfPos, vec3 surfNorm, float h, float strength, float faceDir) {
          vec3 sx = dFdx(surfPos);
          vec3 sy = dFdy(surfPos);
          vec3 r1 = cross(sy, surfNorm);
          vec3 r2 = cross(surfNorm, sx);
          float det = dot(sx, r1) * faceDir;
          vec2 dh = vec2(dFdx(h), dFdy(h)) * strength;
          vec3 grad = sign(det) * (dh.x * r1 + dh.y * r2);
          return normalize(abs(det) * surfNorm - grad);
        }`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        vec3 patN = normalize(vPatNrm);
        vec4 pat = patSample(vPatPos, patN, patParams.x);
        float patMott = patSample(vPatPos, patN, patParams.x * 0.083).a;
        diffuseColor.rgb *= clamp(1.0 + (pat.g - 0.5) * 2.0 * patParams.z, 0.05, 2.0);
        diffuseColor.rgb *= 1.0 + (patMott - 0.5) * 2.0 * patExtra.y;`,
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
        roughnessFactor = clamp(roughnessFactor * (1.0 + (pat.b - 0.5) * 2.0 * patParams.w), 0.05, 1.0);`,
      )
      .replace(
        '#include <metalnessmap_fragment>',
        `#include <metalnessmap_fragment>
        metalnessFactor *= 1.0 - (1.0 - pat.r) * patExtra.x;`,
      )
      .replace(
        '#include <normal_fragment_maps>',
        `#include <normal_fragment_maps>
        normal = patBumpNormal(-vViewPosition, normal, pat.r, patParams.y * patParams.x, faceDirection);`,
      );
  };
  material.customProgramCacheKey = () => `${prevKey}+pattern`;
  material.needsUpdate = true;
  return material;
}
