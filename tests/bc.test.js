import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bcKit } from '../src/battle/bc.js';

const kit = bcKit();

// a decoder of our own, as the GPU reads the blocks: BC4 (eight levels when
// r0 > r1, else six and 0, 255) and BC1 in its four-colour mode
function channel(b, o) {
  const r0 = b[o];
  const r1 = b[o + 1];
  const p = [r0, r1];
  if (r0 > r1) for (let k = 1; k < 7; k++) p.push(((7 - k) * r0 + k * r1) / 7);
  else {
    for (let k = 1; k < 5; k++) p.push(((5 - k) * r0 + k * r1) / 5);
    p.push(0, 255);
  }
  let bits = 0n;
  for (let i = 0; i < 6; i++) bits |= BigInt(b[o + 2 + i]) << BigInt(8 * i);
  return Array.from({ length: 16 }, (_, i) => p[Number((bits >> BigInt(3 * i)) & 7n)]);
}
function color(b, o) {
  const c = (v) => [(((v >> 11) & 31) << 3) | (((v >> 11) & 31) >> 2), (((v >> 5) & 63) << 2) | (((v >> 5) & 63) >> 4), ((v & 31) << 3) | ((v & 31) >> 2)];
  const c0 = c(b[o] | (b[o + 1] << 8));
  const c1 = c(b[o + 2] | (b[o + 3] << 8));
  const pal = [c0, c1, c0.map((x, k) => (2 * x + c1[k]) / 3), c0.map((x, k) => (x + 2 * c1[k]) / 3)];
  const bits = b[o + 4] | (b[o + 5] << 8) | (b[o + 6] << 16) | (b[o + 7] << 24);
  return Array.from({ length: 16 }, (_, i) => pal[(bits >>> (2 * i)) & 3]);
}
function decode(level, size, kind) {
  const out = new Float32Array(size * size * 4);
  let o = 0;
  for (let by = 0; by < size; by += 4) {
    for (let bx = 0; bx < size; bx += 4, o += 16) {
      const first = channel(level, o);
      const second = kind === 'bc5' ? channel(level, o + 8) : null;
      const col = kind === 'bc5' ? null : color(level, o + 8);
      for (let i = 0; i < 16; i++) {
        const x = bx + (i & 3);
        const y = by + (i >> 2);
        if (x >= size || y >= size) continue;
        const k = (y * size + x) * 4;
        if (kind === 'bc5') {
          out[k] = first[i];
          out[k + 1] = second[i];
        } else {
          out.set(col[i], k);
          out[k + 3] = first[i];
        }
      }
    }
  }
  return out;
}
// peak signal to noise ratio over the given channels, dB
function psnr(src, dec, channels) {
  let se = 0;
  let n = 0;
  for (let k = 0; k < src.length; k += 4) {
    for (const c of channels) {
      const d = src[k + c] - Math.round(dec[k + c]);
      se += d * d;
      n++;
    }
  }
  return se === 0 ? 99 : 10 * Math.log10((255 * 255) / (se / n));
}
// a test image: smooth colour gradients with some fine noise, alpha a ramp
function image(size, seed = 1) {
  let s = seed;
  const rnd = () => ((s = (s * 1103515245 + 12345) >>> 0) / 4294967296);
  const out = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const k = (y * size + x) * 4;
      out[k] = Math.round(40 + (150 * x) / size + 8 * rnd());
      out[k + 1] = Math.round(60 + (100 * y) / size + 8 * rnd());
      out[k + 2] = Math.round(30 + 60 * Math.sin((x + y) / 9) ** 2 + 8 * rnd());
      out[k + 3] = Math.round((255 * x) / (size - 1));
    }
  }
  return out;
}
// a normal map: a bumpy surface, x and y in red and green
function normals(size) {
  const out = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = 0.4 * Math.sin(x / 5);
      const ny = 0.4 * Math.cos(y / 7);
      const k = (y * size + x) * 4;
      out[k] = Math.round((nx * 0.5 + 0.5) * 255);
      out[k + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      out[k + 2] = Math.round((Math.sqrt(1 - nx * nx - ny * ny) * 0.5 + 0.5) * 255);
      out[k + 3] = 255;
    }
  }
  return out;
}

test('every mipmap down to 1x1, 16 bytes per 4x4 block', () => {
  const levels = kit.chain(image(64), 64, 'bc3s');
  assert.deepEqual(
    levels.map((l) => l.length),
    [64, 32, 16, 8, 4, 2, 1].map((s) => Math.max(1, Math.ceil(s / 4)) ** 2 * 16),
  );
});

test('BC3 keeps the colour and the alpha', () => {
  const src = image(64);
  const dec = decode(kit.chain(src, 64, 'bc3s')[0], 64, 'bc3s');
  assert.ok(psnr(src, dec, [0, 1, 2]) > 32, `colour ${psnr(src, dec, [0, 1, 2]).toFixed(1)} dB`);
  assert.ok(psnr(src, dec, [3]) > 40, `alpha ${psnr(src, dec, [3]).toFixed(1)} dB`);
});

test('a flat block comes back as its colour (within 5:6:5)', () => {
  const src = new Uint8Array(4 * 4 * 4);
  for (let k = 0; k < 16; k++) src.set([200, 120, 40, 255], k * 4);
  const dec = decode(kit.level(src, 4, 'bc3s'), 4, 'bc3s');
  for (let k = 0; k < 16; k++) {
    assert.ok(Math.abs(dec[k * 4] - 200) <= 4 && Math.abs(dec[k * 4 + 1] - 120) <= 2 && Math.abs(dec[k * 4 + 2] - 40) <= 4);
    assert.equal(dec[k * 4 + 3], 255);
  }
});

test('two flat colours whatever their direction come back as themselves', () => {
  // (100,100,100) and (130,73,100) differ at right angles to an arbitrary
  // starting axis (0.9, 1, 0.7): the block must not average them
  for (const [a, b] of [
    [[100, 100, 100], [130, 73, 100]],
    [[100, 100, 150], [100, 107, 140]],
  ]) {
    const src = new Uint8Array(4 * 4 * 4);
    for (let k = 0; k < 16; k++) src.set([...(k < 8 ? a : b), 255], k * 4);
    const dec = decode(kit.level(src, 4, 'bc3s'), 4, 'bc3s');
    for (let k = 0; k < 16; k++) {
      const want = k < 8 ? a : b;
      for (let c = 0; c < 3; c++) assert.ok(Math.abs(dec[k * 4 + c] - want[c]) <= 4, `texel ${k}: ${dec[k * 4 + c]} vs ${want[c]}`);
    }
  }
});

test('BC5 keeps the normal x and y', () => {
  const src = normals(64);
  const dec = decode(kit.chain(src, 64, 'bc5')[0], 64, 'bc5');
  assert.ok(psnr(src, dec, [0, 1]) > 40, `${psnr(src, dec, [0, 1]).toFixed(1)} dB`);
});

test('sRGB mipmaps average in linear light', () => {
  // black and white texels: their mean light is half, sRGB 188, not 128
  const src = new Uint8Array(2 * 2 * 4);
  src.set([0, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0]);
  assert.equal(kit.mip(src, 2, true)[0], 188);
  assert.equal(kit.mip(src, 2, false)[0], 128);
  // (the alpha is averaged as it is)
  assert.equal(kit.mip(src, 2, true)[3], 128);
});

test('the encoder works from its own source (as the workers run it)', () => {
  const again = new Function(`return (${bcKit.toString()})();`)();
  const src = image(16, 7);
  assert.deepEqual(again.chain(src, 16, 'bc3s'), kit.chain(src, 16, 'bc3s'));
});
