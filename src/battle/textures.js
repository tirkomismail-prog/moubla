// Procedurally painted, tileable textures (no image files needed).
import * as THREE from 'three';
import { mulberry32 } from '../core/rng.js';

const SIZE = 512;
const canvasCache = new Map();

function canvas(size = SIZE) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  return c;
}

// Draw something at (x, y) and its wrapped copies so the texture tiles.
function wrap(size, x, y, r, fn) {
  for (const dx of [-size, 0, size]) {
    for (const dy of [-size, 0, size]) {
      const px = x + dx;
      const py = y + dy;
      if (px + r < 0 || py + r < 0 || px - r > size || py - r > size) continue;
      fn(px, py);
    }
  }
}

// Normal map from a grayscale height canvas (tileable Sobel).
function normalFromHeight(src, strength = 2) {
  const size = src.width;
  const sctx = src.getContext('2d');
  const h = sctx.getImageData(0, 0, size, size).data;
  const out = canvas(size);
  const octx = out.getContext('2d');
  const img = octx.createImageData(size, size);
  const at = (x, y) => h[(((y + size) % size) * size + ((x + size) % size)) * 4] / 255;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
      const l = Math.hypot(dx, dy, 1);
      const o = (y * size + x) * 4;
      img.data[o] = ((-dx / l) * 0.5 + 0.5) * 255;
      img.data[o + 1] = ((-dy / l) * 0.5 + 0.5) * 255;
      img.data[o + 2] = ((1 / l) * 0.5 + 0.5) * 255;
      img.data[o + 3] = 255;
    }
  }
  octx.putImageData(img, 0, 0);
  return out;
}

function blotches(ctx, size, rand, n, rMin, rMax, lo, hi, alpha) {
  for (let i = 0; i < n; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = rMin + rand() * (rMax - rMin);
    const v = Math.round(lo + rand() * (hi - lo));
    wrap(size, x, y, r, (px, py) => {
      const g = ctx.createRadialGradient(px, py, 0, px, py, r);
      g.addColorStop(0, `rgba(${v},${v},${v},${alpha})`);
      g.addColorStop(1, `rgba(${v},${v},${v},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(px - r, py - r, r * 2, r * 2);
    });
  }
}

// Ground detail: `kind` is grass | steppe | sand | snow.
function paintGround(kind) {
  const rand = mulberry32(kind.length * 977 + 13);
  const col = canvas();
  const hgt = canvas();
  const c = col.getContext('2d');
  const hc = hgt.getContext('2d');
  const base = kind === 'snow' ? 236 : kind === 'sand' ? 222 : 210;
  c.fillStyle = `rgb(${base},${base},${base})`;
  c.fillRect(0, 0, SIZE, SIZE);
  hc.fillStyle = 'rgb(128,128,128)';
  hc.fillRect(0, 0, SIZE, SIZE);
  // large soft variation
  blotches(c, SIZE, rand, 60, 30, 90, kind === 'snow' ? 200 : 150, 255, 0.35);
  blotches(hc, SIZE, rand, 80, 20, 70, 60, 200, 0.4);
  if (kind === 'grass' || kind === 'steppe') {
    // blades seen from above: short strokes
    const n = kind === 'grass' ? 16000 : 11000;
    for (let i = 0; i < n; i++) {
      const x = rand() * SIZE;
      const y = rand() * SIZE;
      const a = rand() * Math.PI * 2;
      const len = 4 + rand() * 11;
      const v = Math.round(130 + rand() * 125);
      const warm = kind === 'steppe' ? 12 : 4;
      wrap(SIZE, x, y, len, (px, py) => {
        c.strokeStyle = `rgba(${Math.min(255, v + warm)},${v},${Math.max(0, v - warm * 2)},0.55)`;
        c.lineWidth = 1 + rand() * 1.4;
        c.beginPath();
        c.moveTo(px, py);
        c.lineTo(px + Math.cos(a) * len, py + Math.sin(a) * len);
        c.stroke();
        hc.strokeStyle = `rgba(${v},${v},${v},0.5)`;
        hc.lineWidth = 1.5;
        hc.beginPath();
        hc.moveTo(px, py);
        hc.lineTo(px + Math.cos(a) * len, py + Math.sin(a) * len);
        hc.stroke();
      });
    }
    // small bare earth patches
    blotches(c, SIZE, rand, 40, 6, 22, 120, 160, 0.45);
  } else {
    // grains / snow crust speckles
    const n = kind === 'snow' ? 9000 : 14000;
    for (let i = 0; i < n; i++) {
      const x = rand() * SIZE;
      const y = rand() * SIZE;
      const r = 0.6 + rand() * (kind === 'snow' ? 1.6 : 1.2);
      const v = Math.round((kind === 'snow' ? 190 : 140) + rand() * (kind === 'snow' ? 65 : 115));
      c.fillStyle = `rgba(${v},${v},${v},0.6)`;
      c.fillRect(x, y, r, r);
      hc.fillStyle = `rgba(${v},${v},${v},0.6)`;
      hc.fillRect(x, y, r * 1.5, r * 1.5);
    }
    // wind ripples
    for (let i = 0; i < 70; i++) {
      const y = rand() * SIZE;
      const v = Math.round(110 + rand() * 60);
      hc.strokeStyle = `rgba(${v},${v},${v},0.35)`;
      hc.lineWidth = 2 + rand() * 3;
      hc.beginPath();
      for (let x = -10; x <= SIZE + 10; x += 16) hc.lineTo(x, y + Math.sin(x * 0.03 + i) * 6);
      hc.stroke();
    }
  }
  return { col, hgt };
}

function paintStone() {
  const rand = mulberry32(4242);
  const col = canvas();
  const hgt = canvas();
  const c = col.getContext('2d');
  const hc = hgt.getContext('2d');
  c.fillStyle = 'rgb(95,92,88)';
  c.fillRect(0, 0, SIZE, SIZE);
  hc.fillStyle = 'rgb(20,20,20)';
  hc.fillRect(0, 0, SIZE, SIZE);
  const rows = 8;
  const rh = SIZE / rows;
  for (let r = 0; r < rows; r++) {
    let x = -rand() * 60;
    while (x < SIZE) {
      const w = 45 + rand() * 60;
      const v = Math.round(165 + rand() * 60);
      const tint = Math.round(rand() * 10 - 5);
      const bx = x + 2;
      const by = r * rh + 2;
      const bw = Math.min(w, SIZE - x) - 4;
      const bh = rh - 4;
      c.fillStyle = `rgb(${v + tint},${v},${v - tint})`;
      c.fillRect(bx, by, bw, bh);
      const hv = 185 + Math.round(rand() * 45);
      hc.fillStyle = `rgb(${hv},${hv},${hv})`;
      hc.fillRect(bx + 1, by + 1, bw - 2, bh - 2);
      x += w;
    }
  }
  // weathering speckles
  for (let i = 0; i < 12000; i++) {
    const v = Math.round(90 + rand() * 120);
    c.fillStyle = `rgba(${v},${v},${v},0.25)`;
    c.fillRect(rand() * SIZE, rand() * SIZE, 1.5, 1.5);
  }
  blotches(c, SIZE, rand, 30, 20, 70, 110, 150, 0.25);
  return { col, hgt };
}

function paintWood() {
  const rand = mulberry32(777);
  const col = canvas(256);
  const hgt = canvas(256);
  const c = col.getContext('2d');
  const hc = hgt.getContext('2d');
  const S = 256;
  const planks = 6;
  const pw = S / planks;
  for (let p = 0; p < planks; p++) {
    const v = Math.round(170 + rand() * 60);
    c.fillStyle = `rgb(${v},${Math.round(v * 0.78)},${Math.round(v * 0.55)})`;
    c.fillRect(p * pw, 0, pw, S);
    hc.fillStyle = 'rgb(200,200,200)';
    hc.fillRect(p * pw + 1, 0, pw - 2, S);
    for (let g = 0; g < 14; g++) {
      const gx = p * pw + rand() * pw;
      const gv = Math.round(v * (0.6 + rand() * 0.3));
      c.strokeStyle = `rgba(${gv},${Math.round(gv * 0.75)},${Math.round(gv * 0.5)},0.6)`;
      c.lineWidth = 0.7 + rand();
      c.beginPath();
      for (let y = 0; y <= S; y += 8) c.lineTo(gx + Math.sin(y * 0.05 + g) * 1.5, y);
      c.stroke();
    }
    c.fillStyle = 'rgba(30,20,10,0.9)';
    c.fillRect(p * pw, 0, 1.5, S);
  }
  return { col, hgt };
}

function build(key, painter, normalStrength) {
  let entry = canvasCache.get(key);
  if (!entry) {
    const { col, hgt } = painter();
    entry = { col, nrm: normalFromHeight(hgt, normalStrength) };
    canvasCache.set(key, entry);
  }
  const map = new THREE.CanvasTexture(entry.col);
  map.colorSpace = THREE.SRGBColorSpace;
  const normalMap = new THREE.CanvasTexture(entry.nrm);
  for (const t of [map, normalMap]) {
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 4;
  }
  return { map, normalMap };
}

export function groundTextures(kind) {
  return build(`ground:${kind}`, () => paintGround(kind), kind === 'snow' ? 1.5 : 2.5);
}

export function stoneTextures() {
  return build('stone', paintStone, 4);
}

export function woodTextures() {
  return build('wood', paintWood, 3);
}

// Replace the standard map lookup by two samples at different scales, which
// hides the repetition of a tiled texture over large surfaces.
export function antiTiling(material) {
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `#ifdef USE_MAP
        vec4 t1 = texture2D( map, vMapUv );
        vec4 t2 = texture2D( map, vMapUv * 0.137 + vec2( 0.37, 0.71 ) );
        diffuseColor *= mix( t1, t2, 0.4 ) * 1.12;
      #endif`,
    );
  };
  material.customProgramCacheKey = () => 'antiTiling';
  return material;
}
