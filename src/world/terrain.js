// Procedural world terrain for the strategic map.
import { createNoise2D, fbm, ridged } from '../core/noise.js';
import { smoothstep } from '../core/util.js';

export const WORLD_W = 3200;
export const WORLD_H = 2200;
export const CELL = 12;
export const GW = Math.ceil(WORLD_W / CELL);
export const GH = Math.ceil(WORLD_H / CELL);

export const BIOME = {
  WATER: 0,
  BEACH: 1,
  PLAINS: 2,
  FOREST: 3,
  STEPPE: 4,
  DESERT: 5,
  SNOW: 6,
  TAIGA: 7,
  MOUNTAIN: 8,
  PEAK: 9,
};

export const BIOME_NAMES = ['Вода', 'Узбережжя', 'Рівнина', 'Ліс', 'Степ', 'Пустище', 'Сніги', 'Тайга', 'Гори', 'Вершини'];
export const BIOME_SPEED = [0, 1, 1, 0.72, 1.05, 0.85, 0.8, 0.7, 0.55, 0];
// battle scene flavour for each biome
export const BIOME_BATTLE = ['plains', 'plains', 'plains', 'forest', 'steppe', 'desert', 'snow', 'taiga', 'hills', 'hills'];

export class TerrainGen {
  constructor(seed) {
    this.seed = seed;
    this.nHeight = createNoise2D(seed);
    this.nRidge = createNoise2D(seed + 11);
    this.nMask = createNoise2D(seed + 23);
    this.nMoist = createNoise2D(seed + 37);
    this.nTemp = createNoise2D(seed + 51);
  }

  // Returns [height, biome]
  sample(x, y) {
    const nx = x / WORLD_W;
    const ny = y / WORLD_H;
    const ar = WORLD_W / WORLD_H;
    let h = fbm(this.nHeight, nx * 3.2 * ar, ny * 3.2, 5) * 1.05 + 0.24;
    // continent mask: a noisy super-ellipse, sea around the edges
    const dx = (nx - 0.5) / 0.5;
    const dy = (ny - 0.5) / 0.5;
    const d = Math.pow(dx ** 4 + dy ** 4, 0.25) + fbm(this.nMask, nx * 4 * ar, ny * 4, 4) * 0.22;
    const mask = smoothstep(1.0, 0.74, d);
    h = h * mask - (1 - mask) * 0.6;
    // mountain ranges
    const rangeMask = smoothstep(0.08, 0.45, this.nMask(nx * 1.7 + 3.1, ny * 1.7 - 1.3));
    const rid = ridged(this.nRidge, nx * 4.5 * ar, ny * 4.5, 4);
    h += rid * rangeMask * 0.95 * mask;
    if (h <= 0) return [h, BIOME.WATER];
    if (h < 0.035) return [h, BIOME.BEACH];
    if (h > 0.86) return [h, BIOME.PEAK];
    if (h > 0.64) return [h, BIOME.MOUNTAIN];

    const moist = fbm(this.nMoist, nx * 5 * ar, ny * 5, 4) * 0.7 + 0.5 - smoothstep(0.55, 0.9, nx) * 0.42 * smoothstep(0.25, 0.45, ny);
    const temp = ny + this.nTemp(nx * 4, ny * 4) * 0.08 - h * 0.25;
    if (temp < 0.27) return [h, moist > 0.5 ? BIOME.TAIGA : BIOME.SNOW];
    if (moist < 0.3) return [h, temp > 0.8 ? BIOME.DESERT : BIOME.STEPPE];
    if (moist > 0.6) return [h, BIOME.FOREST];
    return [h, BIOME.PLAINS];
  }

  // Build a regular grid of samples: every `step` world units.
  field(step) {
    const w = Math.ceil(WORLD_W / step);
    const h = Math.ceil(WORLD_H / step);
    const height = new Float32Array(w * h);
    const biome = new Uint8Array(w * h);
    for (let j = 0; j < h; j++) {
      const y = (j + 0.5) * step;
      for (let i = 0; i < w; i++) {
        const s = this.sample((i + 0.5) * step, y);
        height[j * w + i] = s[0];
        biome[j * w + i] = s[1];
      }
    }
    return { w, h, step, height, biome };
  }
}

// Cell-level navigation grid with connectivity labelling.
export class NavGrid {
  constructor(gen) {
    const f = gen.field(CELL);
    this.w = f.w;
    this.h = f.h;
    this.height = f.height;
    this.biome = f.biome;
    this.speed = new Float32Array(this.w * this.h);
    this.road = new Uint8Array(this.w * this.h);
    for (let i = 0; i < this.speed.length; i++) this.speed[i] = BIOME_SPEED[this.biome[i]];
    this.labelRegions();
  }

  labelRegions() {
    const { w, h } = this;
    this.region = new Int32Array(w * h).fill(-1);
    let best = -1;
    let bestSize = 0;
    let label = 0;
    const stack = [];
    for (let i = 0; i < w * h; i++) {
      if (this.region[i] !== -1 || this.speed[i] <= 0) continue;
      let size = 0;
      stack.push(i);
      this.region[i] = label;
      while (stack.length) {
        const c = stack.pop();
        size++;
        const cx = c % w;
        const cy = (c / w) | 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue;
            const nx = cx + dx;
            const ny = cy + dy;
            if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
            const n = ny * w + nx;
            if (this.region[n] !== -1 || this.speed[n] <= 0) continue;
            this.region[n] = label;
            stack.push(n);
          }
        }
      }
      if (size > bestSize) {
        bestSize = size;
        best = label;
      }
      label++;
    }
    this.mainRegion = best;
    this.mainSize = bestSize;
  }

  cellAt(x, y) {
    const cx = Math.max(0, Math.min(this.w - 1, Math.floor(x / CELL)));
    const cy = Math.max(0, Math.min(this.h - 1, Math.floor(y / CELL)));
    return cy * this.w + cx;
  }

  biomeAt(x, y) {
    return this.biome[this.cellAt(x, y)];
  }

  speedAt(x, y) {
    const c = this.cellAt(x, y);
    return this.speed[c] * (this.road[c] ? 1.25 : 1);
  }

  isMainland(x, y) {
    return this.region[this.cellAt(x, y)] === this.mainRegion;
  }

  // Find nearest mainland cell centre to (x, y).
  nearestMainland(x, y) {
    const c0 = this.cellAt(x, y);
    if (this.region[c0] === this.mainRegion) return [x, y];
    const cx0 = c0 % this.w;
    const cy0 = (c0 / this.w) | 0;
    for (let r = 1; r < 80; r++) {
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
          const nx = cx0 + dx;
          const ny = cy0 + dy;
          if (nx < 0 || ny < 0 || nx >= this.w || ny >= this.h) continue;
          if (this.region[ny * this.w + nx] === this.mainRegion) return [(nx + 0.5) * CELL, (ny + 0.5) * CELL];
        }
      }
    }
    return [x, y];
  }
}
