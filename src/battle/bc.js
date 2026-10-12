// Block compression of the texture layers when the game loads (stage 4.0):
// colour as BC3 (DXT5: the colour in 4x4 blocks of two 16-bit colours and
// their mixes, the alpha as eight levels), normal maps as BC5 (RGTC2: x and
// y, the shader works out z). Four to eight times less video memory than
// the decoded RGBA8 layers, and less of it to read per frame. The mipmaps
// are made here (a compressed texture cannot make its own): colour averaged
// in linear light, as the GPU does for an sRGB texture.
//
// The encoder runs in workers made from its own source (bcKit is one
// self-contained function), so it works in the bundled game opened from
// disk. Without workers or the WebGL extensions the layers stay RGBA8.

// The encoder: everything inside one function, so that a worker can be made
// from its source. chain(rgba, size, kind) -> the encoded mipmaps, largest
// first; kind: 'bc3s' (sRGB colour + alpha), 'bc3' (linear) or 'bc5'.
export function bcKit() {
  const toLinear = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const c = i / 255;
    toLinear[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  const SRGB_STEPS = 16384;
  const toSrgb = new Uint8Array(SRGB_STEPS + 1);
  for (let i = 0; i <= SRGB_STEPS; i++) {
    const l = i / SRGB_STEPS;
    toSrgb[i] = Math.round(255 * (l <= 0.0031308 ? l * 12.92 : 1.055 * Math.pow(l, 1 / 2.4) - 0.055));
  }

  // the next mipmap of a square RGBA8 image: each 2x2 averaged (the colour
  // in linear light if srgb; the alpha always as it is)
  function mip(src, size, srgb) {
    const s = Math.max(1, size >> 1);
    const out = new Uint8Array(s * s * 4);
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const x0 = Math.min(2 * x, size - 1);
        const x1 = Math.min(2 * x + 1, size - 1);
        const y0 = Math.min(2 * y, size - 1);
        const y1 = Math.min(2 * y + 1, size - 1);
        const a = (y0 * size + x0) * 4;
        const b = (y0 * size + x1) * 4;
        const c = (y1 * size + x0) * 4;
        const d = (y1 * size + x1) * 4;
        const o = (y * s + x) * 4;
        for (let k = 0; k < 4; k++) {
          if (srgb && k < 3) {
            const l = (toLinear[src[a + k]] + toLinear[src[b + k]] + toLinear[src[c + k]] + toLinear[src[d + k]]) / 4;
            out[o + k] = toSrgb[Math.round(l * SRGB_STEPS)];
          } else {
            out[o + k] = (src[a + k] + src[b + k] + src[c + k] + src[d + k] + 2) >> 2;
          }
        }
      }
    }
    return out;
  }

  // one channel of a block as BC4: its lowest and highest value and six
  // levels between them, 3 bits per texel
  const vals = new Uint8Array(16);
  function channelBlock(src, size, bx, by, ch, out, o) {
    let lo = 255;
    let hi = 0;
    for (let i = 0; i < 16; i++) {
      const x = Math.min(bx + (i & 3), size - 1);
      const y = Math.min(by + (i >> 2), size - 1);
      const v = (vals[i] = src[(y * size + x) * 4 + ch]);
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
    // (r0 > r1: eight levels; r0 is index 0, r1 index 1, then r0 to r1)
    out[o] = hi;
    out[o + 1] = lo;
    const scale = hi > lo ? 7 / (hi - lo) : 0;
    let bits0 = 0;
    let bits1 = 0;
    for (let i = 0; i < 16; i++) {
      const q = Math.round((vals[i] - lo) * scale);
      const idx = q === 7 ? 0 : q === 0 ? 1 : 8 - q;
      if (i < 8) bits0 |= idx << (3 * i);
      else bits1 |= idx << (3 * (i - 8));
    }
    out[o + 2] = bits0 & 255;
    out[o + 3] = (bits0 >> 8) & 255;
    out[o + 4] = (bits0 >> 16) & 255;
    out[o + 5] = bits1 & 255;
    out[o + 6] = (bits1 >> 8) & 255;
    out[o + 7] = (bits1 >> 16) & 255;
  }

  // the colour of a block as in BC1 (always the four-colour mode, as BC3
  // reads it): two 5:6:5 end colours along the colours' main axis, then
  // moved by least squares to fit the texels that chose each mix
  const px = new Float32Array(48);
  const pal = new Float32Array(12);
  const idxA = new Uint8Array(16);
  const idxB = new Uint8Array(16);
  const quant = (r, g, b) => {
    const q = (v, m) => Math.max(0, Math.min(m, Math.round((v * m) / 255)));
    return (q(r, 31) << 11) | (q(g, 63) << 5) | q(b, 31);
  };
  // the texels' best mixes for two end colours; returns the squared error
  function fit(c0, c1, idx) {
    const r0 = (c0 >> 11) & 31;
    const g0 = (c0 >> 5) & 63;
    const b0 = c0 & 31;
    const r1 = (c1 >> 11) & 31;
    const g1 = (c1 >> 5) & 63;
    const b1 = c1 & 31;
    pal[0] = (r0 << 3) | (r0 >> 2);
    pal[1] = (g0 << 2) | (g0 >> 4);
    pal[2] = (b0 << 3) | (b0 >> 2);
    pal[3] = (r1 << 3) | (r1 >> 2);
    pal[4] = (g1 << 2) | (g1 >> 4);
    pal[5] = (b1 << 3) | (b1 >> 2);
    for (let k = 0; k < 3; k++) {
      pal[6 + k] = (2 * pal[k] + pal[3 + k]) / 3;
      pal[9 + k] = (pal[k] + 2 * pal[3 + k]) / 3;
    }
    let err = 0;
    for (let i = 0; i < 16; i++) {
      let best = 0;
      let bd = Infinity;
      for (let k = 0; k < 4; k++) {
        const dr = px[i * 3] - pal[k * 3];
        const dg = px[i * 3 + 1] - pal[k * 3 + 1];
        const db = px[i * 3 + 2] - pal[k * 3 + 2];
        const d = dr * dr + dg * dg + db * db;
        if (d < bd) {
          bd = d;
          best = k;
        }
      }
      idx[i] = best;
      err += bd;
    }
    return err;
  }
  // end colours by least squares for the mixes the texels chose (weight of
  // the first end colour per mix: 1, 0, 2/3, 1/3)
  const WEIGHT = [1, 0, 2 / 3, 1 / 3];
  function refit(idx) {
    let aa = 0;
    let ab = 0;
    let bb = 0;
    const ax = [0, 0, 0];
    const bx = [0, 0, 0];
    for (let i = 0; i < 16; i++) {
      const a = WEIGHT[idx[i]];
      const b = 1 - a;
      aa += a * a;
      ab += a * b;
      bb += b * b;
      for (let k = 0; k < 3; k++) {
        ax[k] += a * px[i * 3 + k];
        bx[k] += b * px[i * 3 + k];
      }
    }
    const det = aa * bb - ab * ab;
    if (Math.abs(det) < 1e-6) return null;
    const e0 = [0, 0, 0];
    const e1 = [0, 0, 0];
    for (let k = 0; k < 3; k++) {
      e0[k] = (bb * ax[k] - ab * bx[k]) / det;
      e1[k] = (aa * bx[k] - ab * ax[k]) / det;
    }
    return [quant(e0[0], e0[1], e0[2]), quant(e1[0], e1[1], e1[2])];
  }
  function colorBlock(src, size, bx, by, out, o) {
    let mr = 0;
    let mg = 0;
    let mb = 0;
    for (let i = 0; i < 16; i++) {
      const x = Math.min(bx + (i & 3), size - 1);
      const y = Math.min(by + (i >> 2), size - 1);
      const k = (y * size + x) * 4;
      mr += px[i * 3] = src[k];
      mg += px[i * 3 + 1] = src[k + 1];
      mb += px[i * 3 + 2] = src[k + 2];
    }
    mr /= 16;
    mg /= 16;
    mb /= 16;
    let crr = 0;
    let crg = 0;
    let crb = 0;
    let cgg = 0;
    let cgb = 0;
    let cbb = 0;
    for (let i = 0; i < 16; i++) {
      const r = px[i * 3] - mr;
      const g = px[i * 3 + 1] - mg;
      const b = px[i * 3 + 2] - mb;
      crr += r * r;
      crg += r * g;
      crb += r * b;
      cgg += g * g;
      cgb += g * b;
      cbb += b * b;
    }
    // the main axis by power iteration, from the channel that varies most
    // (never at right angles to the spread of the colours)
    let ar = crr >= cgg && crr >= cbb ? 1 : 0;
    let ag = ar ? 0 : cgg >= cbb ? 1 : 0;
    let ab = ar || ag ? 0 : 1;
    for (let it = 0; it < 4; it++) {
      const r = crr * ar + crg * ag + crb * ab;
      const g = crg * ar + cgg * ag + cgb * ab;
      const b = crb * ar + cgb * ag + cbb * ab;
      const m = Math.max(Math.abs(r), Math.abs(g), Math.abs(b)) || 1;
      ar = r / m;
      ag = g / m;
      ab = b / m;
    }
    let tmin = Infinity;
    let tmax = -Infinity;
    for (let i = 0; i < 16; i++) {
      const t = (px[i * 3] - mr) * ar + (px[i * 3 + 1] - mg) * ag + (px[i * 3 + 2] - mb) * ab;
      if (t < tmin) tmin = t;
      if (t > tmax) tmax = t;
    }
    const n2 = ar * ar + ag * ag + ab * ab || 1;
    let c0 = quant(mr + (ar * tmax) / n2, mg + (ag * tmax) / n2, mb + (ab * tmax) / n2);
    let c1 = quant(mr + (ar * tmin) / n2, mg + (ag * tmin) / n2, mb + (ab * tmin) / n2);
    let idx = idxA;
    let err = fit(c0, c1, idx);
    // (a block already within about 4 levels per channel is left as it is:
    // the refit gains nothing there and costs a fifth of the time)
    const better = err > 768 ? refit(idx) : null;
    if (better) {
      const e = fit(better[0], better[1], idxB);
      if (e < err) {
        [c0, c1] = better;
        idx = idxB;
        err = e;
      }
    }
    // (first end colour the larger: the order does not matter in BC3, but
    // swapping them swaps the mixes too)
    if (c0 < c1) {
      const t = c0;
      c0 = c1;
      c1 = t;
      for (let i = 0; i < 16; i++) idx[i] ^= 1;
    }
    out[o] = c0 & 255;
    out[o + 1] = c0 >> 8;
    out[o + 2] = c1 & 255;
    out[o + 3] = c1 >> 8;
    let bits = 0;
    for (let i = 0; i < 16; i++) bits |= (c0 === c1 ? 0 : idx[i]) << (2 * i);
    out[o + 4] = bits & 255;
    out[o + 5] = (bits >>> 8) & 255;
    out[o + 6] = (bits >>> 16) & 255;
    out[o + 7] = (bits >>> 24) & 255;
  }

  // one level: 16 bytes per 4x4 block, rows of blocks from the first row of
  // the image
  function level(src, size, kind) {
    const n = Math.max(1, Math.ceil(size / 4));
    const out = new Uint8Array(n * n * 16);
    let o = 0;
    for (let by = 0; by < size; by += 4) {
      for (let bx = 0; bx < size; bx += 4) {
        if (kind === 'bc5') {
          channelBlock(src, size, bx, by, 0, out, o);
          channelBlock(src, size, bx, by, 1, out, o + 8);
        } else {
          channelBlock(src, size, bx, by, 3, out, o);
          colorBlock(src, size, bx, by, out, o + 8);
        }
        o += 16;
      }
    }
    return out;
  }

  function chain(rgba, size, kind) {
    const levels = [];
    let img = rgba;
    for (let s = size; ; s >>= 1) {
      levels.push(level(img, s, kind));
      if (s === 1) break;
      img = mip(img, s, kind === 'bc3s');
    }
    return levels;
  }

  return { chain, mip, level };
}

// Which formats this browser's WebGL 2 can take (asked of a context of its
// own: the battles make theirs later). bench.html?nobc and index.html?nobc
// leave everything uncompressed (to compare).
let support = null;
export function bcSupport() {
  if (broken) return { bc3: false, bc3s: false, bc5: false };
  if (support) return support;
  support = { bc3: false, bc3s: false, bc5: false };
  try {
    if (typeof location !== 'undefined' && /[?&]nobc\b/.test(location.search)) return support;
    if (typeof Worker === 'undefined' || typeof URL === 'undefined' || !URL.createObjectURL) return support;
    const gl = document.createElement('canvas').getContext('webgl2', { powerPreference: 'high-performance' });
    if (!gl) return support;
    const ext = gl.getSupportedExtensions() || [];
    support.bc3 = ext.includes('WEBGL_compressed_texture_s3tc');
    support.bc3s = support.bc3 && ext.includes('WEBGL_compressed_texture_s3tc_srgb');
    support.bc5 = ext.includes('EXT_texture_compression_rgtc');
    const lose = gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
  } catch {
    // (no compression)
  }
  return support;
}

// The workers, while there is work: a few, each taking the next layer.
// Once they fail (a page that does not allow them, say), the layers stay
// uncompressed from then on.
let pool = null;
let broken = false;
function workers() {
  if (pool) {
    clearTimeout(pool.idle);
    return pool;
  }
  const source = `const kit = (${bcKit.toString()})();
onmessage = (e) => {
  const { id, rgba, size, kind } = e.data;
  try {
    const levels = kit.chain(new Uint8Array(rgba), size, kind);
    postMessage({ id, levels }, levels.map((l) => l.buffer));
  } catch (err) {
    postMessage({ id, error: String(err) });
  }
};`;
  const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
  const cores = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 2;
  const n = Math.max(1, Math.min(4, cores - 1));
  const p = { url, list: [], queue: [], jobs: new Map(), next: 0, idle: 0 };
  const failAll = (err) => {
    broken = true;
    for (const job of p.jobs.values()) job.reject(err);
    p.jobs.clear();
    for (const job of p.queue) job.reject(err);
    p.queue.length = 0;
  };
  for (let i = 0; i < n; i++) {
    let w;
    try {
      w = new Worker(url);
    } catch (e) {
      broken = true;
      close(p);
      throw e;
    }
    w.busy = null;
    w.onmessage = (e) => {
      const job = p.jobs.get(e.data.id);
      p.jobs.delete(e.data.id);
      w.busy = null;
      if (job) {
        if (e.data.error) job.reject(new Error(e.data.error));
        else job.resolve(e.data.levels);
      }
      feed(p);
    };
    w.onerror = (e) => {
      e.preventDefault();
      failAll(new Error(e.message || 'texture worker failed'));
      close(p);
    };
    p.list.push(w);
  }
  pool = p;
  return p;
}
function feed(p) {
  for (const w of p.list) {
    if (w.busy || !p.queue.length) continue;
    const job = p.queue.shift();
    w.busy = job;
    p.jobs.set(job.id, job);
    w.postMessage({ id: job.id, rgba: job.rgba.buffer, size: job.size, kind: job.kind }, [job.rgba.buffer]);
  }
  // done: the workers go after a while without work
  if (!p.queue.length && !p.jobs.size) {
    clearTimeout(p.idle);
    p.idle = setTimeout(() => close(p), 2000);
  }
}
function close(p) {
  for (const w of p.list) w.terminate();
  URL.revokeObjectURL(p.url);
  if (pool === p) pool = null;
}

// The mipmaps of one layer, encoded (rgba: its RGBA8 pixels, handed over to
// the worker).
export function encodeLayer(rgba, size, kind) {
  return new Promise((resolve, reject) => {
    if (broken) throw new Error('texture workers unavailable');
    const p = workers();
    p.queue.push({ id: p.next++, rgba, size, kind, resolve, reject });
    feed(p);
  });
}

// What the texture layers take in video memory (MiB; with mipmaps), and how
// many of them are compressed: for the benchmark's report.
const memory = { compressed: 0, raw: 0, layers: 0, bcLayers: 0 };
export function noteTextureMemory(bytes, layers, compressed) {
  memory[compressed ? 'compressed' : 'raw'] += bytes;
  memory.layers += layers;
  if (compressed) memory.bcLayers += layers;
}
export function textureMemory() {
  return {
    mib: +((memory.compressed + memory.raw) / 1048576).toFixed(1),
    compressedMib: +(memory.compressed / 1048576).toFixed(1),
    layers: memory.layers,
    compressedLayers: memory.bcLayers,
  };
}
