// Performance benchmark (bench.html): a fixed field battle of ~150 soldiers
// and ~50 horses, filmed by an orbiting camera, at several graphics presets
// and internal resolutions. Reports frame times, draw calls and triangles as
// a table and as JSON to send back to the developer.
import * as THREE from 'three';
import { mulberry32 } from './core/rng.js';

// the commit the game was built on (tools/build.mjs)
const BUILD = typeof __BUILD__ !== 'undefined' ? __BUILD__ : 'dev';
const ARMY = {
  allies: [['velmar_sergeant', 30], ['velmar_crossbow', 15], ['velmar_knight', 25]],
  enemies: [['nord_veteran', 40], ['nord_archer', 15], ['kag_horse_archer', 25]],
};
const PRESETS = ['low', 'medium', 'high'];
const BATTLE_SEED = 20261004;
const HEIGHTS = [720, 900, 1080];
const WARMUP = 4; // seconds before measuring after each change
const MEASURE = 10; // seconds of measurement per case

// Where the frame time of the medium preset goes: the same battle with one
// part left out at a time
// (bench.html?parts: only this, about a minute and a half)
const BREAKDOWN = { preset: 'medium', height: 900, warmup: 2.5, measure: 6 };
const PART_NAMES = {
  base: 'усе',
  noShadows: 'без проходу тіней',
  noPost: 'без постобробки',
  noGrass: 'без трави',
  noTrees: 'без дерев і каміння',
  noGround: 'земля простим матеріалом (без фототекстур)',
  noSky: 'без неба',
  noSoldiers: 'без воїнів (і їхніх речей)',
  noHorses: 'без коней',
  baseAgain: 'усе ще раз (розкид замірів)',
  groundNoSurface: 'земля без рельєфу шарів (нормалей і висот)',
  groundOneLayer: 'земля одним шаром (без змішування шарів)',
  groundNoShadow: 'земля без тіней на ній',
  groundNoTextures: 'земля без читання текстур (решта її шейдера та сама)',
  groundLod: 'земля, текстури читаються з рівнем (textureLod)',
};
// hide objects (those shown), give back what shows them again
const hide = (objects) => {
  const shown = objects.filter((o) => o && o.visible);
  for (const o of shown) o.visible = false;
  return () => shown.forEach((o) => (o.visible = true));
};
const find = (b, test) => {
  const out = [];
  b.scene.traverse((o) => test(o) && out.push(o));
  return out;
};
// each switches a part off and returns what switches it back on
const PARTS = {
  base: () => () => {},
  // the shadow map stays as it was, it is just not drawn again
  noShadows: (b) => {
    const s = b.renderer.shadowMap;
    s.autoUpdate = false;
    return () => (s.autoUpdate = true);
  },
  noPost: (b) => {
    const post = b.post;
    b.post = null;
    return () => (b.post = post);
  },
  noGrass: (b) => hide(find(b, (o) => o.isInstancedMesh && o.material.customProgramCacheKey().startsWith('grass'))),
  noTrees: (b) => hide(find(b, (o) => o.name === 'vegetation')),
  // the terrain in a plain material instead of the photographed layers
  noGround: (b) => {
    const mesh = b.terrain.mesh;
    const mat = mesh.material;
    mesh.material = variantOf(mat, 'plain', () => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 }));
    return () => (mesh.material = mat);
  },
  // the sky is the scene's background (baked once) or a dome
  noSky: (b) => {
    const background = b.scene.background;
    b.scene.background = null;
    const show = hide([b.sky]);
    return () => {
      b.scene.background = background;
      show();
    };
  },
  noSoldiers: (b) => {
    const show = hide(b.agents.map((a) => a.rig.root));
    // and what they carry
    const props = b.props;
    const sync = props.sync;
    props.sync = (camera) => {
      sync.call(props, camera);
      for (const m of props.models.values()) for (const mesh of [m.near, m.far]) if (mesh) mesh.visible = false;
    };
    return () => {
      show();
      props.sync = sync;
    };
  },
  noHorses: (b) => hide([...b.agents.map((a) => a.horse && a.horse.rig.root), ...[...b.looseHorses, ...b.deadHorses].map((h) => h.rig.root)]),
  // the first measurement again at the end: how much the numbers drift
  baseAgain: () => () => {},
};

// A material standing in for `mat`, made once and kept (made anew each
// time, its shader would be compiled anew: the first frames after are slow)
const variants = new WeakMap();
function variantOf(mat, key, make) {
  let m = variants.get(mat);
  if (!m) variants.set(mat, (m = new Map()));
  if (!m.has(key)) m.set(key, make());
  return m.get(key);
}

// What the ground's cost is made of: its shader changed in a copy of its
// material (the photographed layers only).
function groundVariant(key, edit) {
  return (b) => {
    const mesh = b.terrain.mesh;
    const mat = mesh.material;
    if (!mat.customProgramCacheKey || mat.customProgramCacheKey() !== 'ground') return () => {};
    mesh.material = variantOf(mat, key, () => {
      const copy = mat.clone();
      copy.onBeforeCompile = (shader, renderer) => {
        mat.onBeforeCompile(shader, renderer);
        shader.fragmentShader = edit(shader.fragmentShader);
      };
      copy.customProgramCacheKey = () => `ground-${key}`;
      return copy;
    });
    return () => (mesh.material = mat);
  };
}
const STILL_PARTS = {
  ...Object.fromEntries(Object.entries(PARTS).filter(([name]) => name !== 'baseAgain')),
  groundNoSurface: groundVariant('no-surface', (f) => f.split('if (surface1 > 0.001) {').join('if (false) {')),
  groundOneLayer: groundVariant('one-layer', (f) => f.replace(/vec4 use = [^;]*;/, 'vec4 use = step(wTop, w);')),
  // (the look-ups: textureGrad(ground<Color|Surface><i>, uv, dx, dy))
  groundNoTextures: groundVariant('no-textures', (f) => f.replace(/textureGrad\((ground(?:Color|Surface)\d), [^()]*\)/g, 'vec4(0.5)')),
  groundLod: groundVariant('lod', (f) =>
    f.replace(/textureGrad\((ground(?:Color|Surface)\d), ([^,()]*), ([^,()]*), ([^,()]*)\)/g, 'textureLod($1, $2, log2(max(length($3), length($4)) * float(textureSize($1, 0).x)))'),
  ),
  groundNoShadow: (b) => {
    const mesh = b.terrain.mesh;
    mesh.receiveShadow = false;
    return () => (mesh.receiveShadow = true);
  },
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function percentile(sorted, p) {
  if (!sorted.length) return 0;
  return sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];
}

function gpuName(renderer) {
  const gl = renderer.getContext();
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
}

// A fixed piece of JavaScript work, timed: how fast the processor runs right
// now (a hot laptop or one in power saving mode runs it slower), so that
// runs on different days can be compared. Best of three, in milliseconds.
function calibrate() {
  let best = Infinity;
  for (let k = 0; k < 3; k++) {
    const t0 = performance.now();
    const a = new Float64Array(20000);
    let x = 1;
    for (let r = 0; r < 60; r++) {
      for (let i = 0; i < a.length; i++) {
        x = (x * 1.000001 + Math.sin(i * 0.01)) % 1000;
        a[i] = x;
      }
      a.sort();
    }
    best = Math.min(best, performance.now() - t0);
    if (a[0] < -1) console.log(a[0]);
  }
  return +best.toFixed(1);
}

// GPU time of each frame, if the browser offers timer queries
// (EXT_disjoint_timer_query_webgl2); results arrive a few frames later.
function gpuTimer(renderer) {
  const gl = renderer.getContext();
  const ext = gl.getExtension('EXT_disjoint_timer_query_webgl2');
  if (!ext) return null;
  const pending = [];
  const times = [];
  let active = null;
  return {
    begin() {
      if (active) return;
      active = gl.createQuery();
      gl.beginQuery(ext.TIME_ELAPSED_EXT, active);
    },
    end() {
      if (!active) return;
      gl.endQuery(ext.TIME_ELAPSED_EXT);
      pending.push(active);
      active = null;
      this.poll();
    },
    // collect the results that have arrived
    poll() {
      while (pending.length && gl.getQueryParameter(pending[0], gl.QUERY_RESULT_AVAILABLE)) {
        const q = pending.shift();
        if (!gl.getParameter(ext.GPU_DISJOINT_EXT)) times.push(gl.getQueryParameter(q, gl.QUERY_RESULT) / 1e6);
        gl.deleteQuery(q);
      }
    },
    get waiting() {
      return pending.length;
    },
    times,
  };
}

function panel() {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;left:12px;top:12px;z-index:100;max-width:min(760px,calc(100vw - 24px));max-height:calc(100vh - 24px);overflow:auto;background:rgba(20,16,12,.88);color:#f3e9d2;font:14px/1.45 system-ui,sans-serif;padding:12px 16px;border-radius:8px;box-shadow:0 4px 18px rgba(0,0,0,.5)';
  document.body.append(el);
  return el;
}

// Measure the running battle for `seconds` of visible frames: frame
// intervals, CPU time of battle.frame(), draw calls, triangles.
function measure(game, seconds) {
  return new Promise((resolve) => {
    const battle = game.battle;
    const frames = [];
    const cpu = [];
    let calls = 0;
    let tris = 0;
    let n = 0;
    const origFrame = battle.frame.bind(battle);
    // count every pass of the frame (post-processing renders several times)
    const info = battle.renderer.info;
    info.autoReset = false;
    const gpu = gpuTimer(battle.renderer);
    battle.frame = (dt) => {
      info.reset();
      const t0 = performance.now();
      if (gpu) gpu.begin();
      origFrame(dt);
      if (gpu) gpu.end();
      cpu.push(performance.now() - t0);
      calls += info.render.calls;
      tris += info.render.triangles;
      n++;
    };
    // a hidden tab stops drawing: the interval over such a pause is left out
    let paused = document.hidden;
    const onVisibility = () => {
      if (document.hidden) paused = true;
    };
    document.addEventListener('visibilitychange', onVisibility);
    let last = performance.now();
    let measured = 0;
    let first = true; // the interval up to the first frame is partial
    const tick = () => {
      const now = performance.now();
      const dt = now - last;
      last = now;
      if (first || paused) paused = document.hidden;
      else {
        frames.push(dt);
        measured += dt;
      }
      first = false;
      // slow machines: at least a few frames even if they take long
      if (measured < seconds * 1000 || frames.length < 5) requestAnimationFrame(tick);
      else {
        document.removeEventListener('visibilitychange', onVisibility);
        battle.frame = origFrame;
        info.autoReset = true;
        const sorted = [...frames].sort((a, b) => a - b);
        const avg = frames.reduce((a, b) => a + b, 0) / Math.max(1, frames.length);
        const cpuSorted = [...cpu].sort((a, b) => a - b);
        resolve({
          fps: +(1000 / avg).toFixed(1),
          p50: +percentile(sorted, 0.5).toFixed(1),
          p90: +percentile(sorted, 0.9).toFixed(1),
          p99: +percentile(sorted, 0.99).toFixed(1),
          cpuP50: +percentile(cpuSorted, 0.5).toFixed(1),
          gpuP50: gpu && gpu.times.length ? +percentile([...gpu.times].sort((a, b) => a - b), 0.5).toFixed(1) : null,
          calls: Math.round(calls / Math.max(1, n)),
          triangles: Math.round(tris / Math.max(1, n)),
          realistic: !!battle.agents.find((a) => a.body),
          agents: battle.agents.filter((a) => a.alive).length,
          horses: battle.agents.filter((a) => a.alive && a.horse).length,
        });
      }
    };
    requestAnimationFrame(tick);
  });
}

// the camera 30 m from the middle of the armies, 9 m up, looking at it from
// `angle`
function viewAt(battle, angle) {
  let cx = 0;
  let cz = 0;
  let k = 0;
  for (const a of battle.agents) {
    if (!a.alive) continue;
    cx += a.pos.x;
    cz += a.pos.z;
    k++;
  }
  if (!k) return;
  cx /= k;
  cz /= k;
  const y = battle.terrain.heightAt(cx, cz);
  battle.debugCam = { x: cx + Math.cos(angle) * 30, y: y + 9, z: cz + Math.sin(angle) * 30, tx: cx, ty: y + 1.2, tz: cz };
}

function orbit(battle) {
  // circle the middle of the armies
  let angle = 0;
  const timer = setInterval(() => {
    if (!battle.agents) return;
    angle += 0.012;
    viewAt(battle, angle);
  }, 33);
  return () => clearInterval(timer);
}

// The GPU time of each part on still frames: the battle paused, the camera
// at a few fixed places, each part left out in turn, round after round (slow
// drift, heat and clocks, falls on all parts alike). Exact where the
// breakdown of the moving battle is not; GPU only.
// (late: at most so many frames more for the timer results)
export const STILL = { views: 3, rounds: 2, settle: 6, frames: 16, late: 40 };

// median GPU time (ms) of `n` frames drawn from now on, after `skip` left
// out (a changed shader is compiled on its first); the results come some
// frames later, a few more frames are drawn (untimed) until they are in
function stillGpu(battle, n, skip = STILL.settle) {
  return new Promise((resolve) => {
    const gpu = gpuTimer(battle.renderer);
    const frame = battle.frame;
    let k = 0;
    battle.frame = (dt) => {
      const timed = k >= skip && k < skip + n;
      k++;
      if (timed) gpu.begin();
      frame.call(battle, dt);
      if (timed) gpu.end();
      else gpu.poll();
      if (k >= skip + n && (!gpu.waiting || k > skip + n + STILL.late)) {
        battle.frame = frame;
        const t = [...gpu.times].sort((a, b) => a - b);
        resolve(t.length ? percentile(t, 0.5) : null);
      }
    };
  });
}

export async function stillBreakdown(battle, show) {
  if (!gpuTimer(battle.renderer)) return null;
  const names = Object.keys(STILL_PARTS);
  const times = Object.fromEntries(names.map((name) => [name, []]));
  battle.paused = true;
  for (let r = 0; r < STILL.rounds; r++) {
    for (let v = 0; v < STILL.views; v++) {
      viewAt(battle, 0.4 + (v / STILL.views) * Math.PI * 2);
      // (the new view settles first: shadows, levels of detail, sorting)
      await stillGpu(battle, 0, STILL.settle * 4);
      // everything at the start and again at the end of the view; the
      // parts the other way round every second round (whatever drifts
      // within a view falls on all alike)
      const order = names.slice(1);
      if (r % 2) order.reverse();
      for (const name of ['base', ...order, 'base']) {
        show(`Нерухомі кадри (${r * STILL.views + v + 1} з ${STILL.rounds * STILL.views}): ${PART_NAMES[name]}…`);
        const restore = STILL_PARTS[name](battle);
        const t = await stillGpu(battle, STILL.frames);
        restore();
        if (times[name].length > r * STILL.views + v) {
          const first = times.base[times.base.length - 1];
          times.base[times.base.length - 1] = first != null && t != null ? (first + t) / 2 : first ?? t;
        } else times[name].push(t);
      }
    }
  }
  battle.paused = false;
  // per part: the GPU time, and how much less it is than with everything
  // (the mean over the views and rounds, each against its own base)
  const out = {};
  for (const name of names) {
    const pairs = times[name].map((t, i) => [t, times.base[i]]).filter(([t, b]) => t != null && b != null);
    if (!pairs.length) continue;
    const mean = (f) => +(pairs.reduce((a, p) => a + f(p), 0) / pairs.length).toFixed(1);
    out[name] = { gpu: mean(([t]) => t), saves: mean(([t, b]) => b - t) };
  }
  return out;
}

async function startBattle(game, preset) {
  if (game.battle) {
    game.battle.finish('retreat');
    await wait(300);
    game.ui.windows.closeAll();
  }
  game.settings.graphics = preset;
  game.settings.battleSize = 200;
  // the same field, trees and ranks in every run (the battle itself then
  // goes as fast as the frames come)
  const random = Math.random;
  Math.random = mulberry32(BATTLE_SEED);
  try {
    game.debugBattle('field', { terrain: 'plains', hour: 14, ...ARMY });
  } finally {
    Math.random = random;
  }
  const b = game.battle;
  b.debugStart();
  b.hud.root.style.display = 'none';
  // nobody dies: the load stays the same through the whole run
  for (const a of b.agents) {
    a.hp = a.maxHp = 1e6;
    if (a.horse) a.horse.hp = a.horse.maxHp = 1e6;
  }
  // bring the armies into contact before measuring
  b.debugSimulate(9);
  return b;
}

export async function runBenchmark(game) {
  // bench.html?parts: only the breakdown of the medium preset
  const partsOnly = /[?&]parts\b/.test(location.search);
  const presets = partsOnly ? [BREAKDOWN.preset] : PRESETS;
  const heights = partsOnly ? [] : HEIGHTS;
  const out = panel();
  out.innerHTML = `<b>Бенчмарк битви</b><br>Не чіпайте мишу й клавіатуру ≈${partsOnly ? 3 : 6} хвилин. Підключіть зарядку.`;
  // a tab opened in the background does not draw: start once it is shown
  while (document.hidden) await wait(250);
  await game.charactersLoading;
  await wait(500);
  const results = [];
  let device = null;
  const calib = [calibrate()];
  const breakdown = {};
  let still = null;
  for (const preset of presets) {
    const battle = await startBattle(game, preset);
    const stop = orbit(battle);
    if (!device) {
      device = {
        gpu: gpuName(battle.renderer),
        userAgent: navigator.userAgent,
        screen: `${screen.width}x${screen.height}`,
        window: `${window.innerWidth}x${window.innerHeight}`,
        devicePixelRatio: window.devicePixelRatio,
        cores: navigator.hardwareConcurrency,
      };
    }
    for (const h of heights) {
      battle.setRenderHeight(h);
      out.innerHTML = `<b>Бенчмарк битви</b><br>Графіка: ${preset}, роздільність: ${h}p… (${results.length + 1} з ${presets.length * heights.length})`;
      await wait(WARMUP * 1000);
      const r = await measure(game, MEASURE);
      results.push({ preset, height: h, ...r });
    }
    if (preset === BREAKDOWN.preset) {
      battle.setRenderHeight(BREAKDOWN.height);
      for (const [name, off] of Object.entries(PARTS)) {
        out.innerHTML = `<b>Бенчмарк битви</b><br>Розклад середньої графіки: ${PART_NAMES[name]}…`;
        const restore = off(battle);
        // (longer first: the resolution has just changed)
        await wait((name === 'base' ? WARMUP : BREAKDOWN.warmup) * 1000);
        const r = await measure(game, BREAKDOWN.measure);
        restore();
        // (p50, p90: whether the frames come evenly with this part left out)
        breakdown[name] = { fps: r.fps, p50: r.p50, p90: r.p90, cpuP50: r.cpuP50, gpuP50: r.gpuP50, triangles: r.triangles };
      }
      stop();
      still = await stillBreakdown(battle, (text) => (out.innerHTML = `<b>Бенчмарк битви</b><br>${text}`));
    }
    stop();
  }
  calib.push(calibrate());
  if (game.battle) game.battle.setRenderHeight(null);
  // calibMs: the processor test before and after the run (lower is faster)
  // still: GPU ms of still frames per part left out, and what that saves
  const report = { date: new Date().toISOString(), build: BUILD, device, calibMs: calib, army: ARMY, results, breakdown, still };
  const rows = results
    .map((r) => `<tr><td>${r.preset}</td><td>${r.height}p</td><td><b>${r.fps}</b></td><td>${r.p50}</td><td>${r.p90}</td><td>${r.cpuP50}</td><td>${r.gpuP50 ?? '–'}</td><td>${r.calls}</td><td>${(r.triangles / 1e6).toFixed(2)}M</td></tr>`)
    .join('');
  const breakdownRows = Object.entries(breakdown)
    .map(([name, r]) => `<tr><td>${PART_NAMES[name]}</td><td><b>${r.fps}</b></td><td>${r.cpuP50}</td><td>${r.gpuP50 ?? '–'}</td><td>${(r.triangles / 1e6).toFixed(2)}M</td></tr>`)
    .join('');
  const stillRows = Object.entries(still || {})
    .map(([name, r]) => `<tr><td>${PART_NAMES[name]}</td><td>${r.gpu}</td><td><b>${name === 'base' ? '' : r.saves}</b></td></tr>`)
    .join('');
  // the processor slower at the end than at the start: it got hot
  const hot = calib[1] > calib[0] * 1.25;
  out.innerHTML = `<b>Готово.</b> Скопіюйте JSON нижче й надішліть його.<br>
    <small>Версія ${BUILD}; ${device.gpu}; тест процесора: ${calib.join(' / ')} мс${hot ? ' — <b>під кінець процесор сповільнився (перегрів чи режим економії): числа занижені</b>' : ''}</small>
    <table style="border-collapse:collapse;margin:8px 0;width:100%" cellpadding="3">
      <tr style="text-align:left;border-bottom:1px solid #8a7"><th>Графіка</th><th>Висота</th><th>FPS</th><th>кадр p50, мс</th><th>p90, мс</th><th>CPU, мс</th><th>GPU, мс</th><th>виклики</th><th>трикутники</th></tr>
      ${rows}
    </table>
    <small>Середня графіка, ${BREAKDOWN.height}p, без однієї частини:</small>
    <table style="border-collapse:collapse;margin:4px 0 8px;width:100%" cellpadding="3">
      <tr style="text-align:left;border-bottom:1px solid #8a7"><th>Варіант</th><th>FPS</th><th>CPU, мс</th><th>GPU, мс</th><th>трикутники</th></tr>
      ${breakdownRows}
    </table>
    ${still ? `<small>Нерухомі кадри, ${BREAKDOWN.height}p: GPU без однієї частини і скільки це економить:</small>
    <table style="border-collapse:collapse;margin:4px 0 8px;width:100%" cellpadding="3">
      <tr style="text-align:left;border-bottom:1px solid #8a7"><th>Варіант</th><th>GPU, мс</th><th>економія, мс</th></tr>
      ${stillRows}
    </table>` : ''}
    <textarea readonly style="width:100%;height:140px;font:12px monospace">${JSON.stringify(report)}</textarea>
    <button id="bench-copy" style="margin-top:6px;padding:6px 14px">Копіювати JSON</button>`;
  const ta = out.querySelector('textarea');
  out.querySelector('#bench-copy').onclick = () => {
    ta.select();
    try {
      navigator.clipboard.writeText(ta.value);
    } catch {
      document.execCommand('copy');
    }
  };
  window.__benchReport = report;
  return report;
}
