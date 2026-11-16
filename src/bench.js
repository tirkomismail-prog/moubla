// Performance benchmark (bench.html): a fixed field battle of ~150 soldiers
// and ~50 horses, filmed by an orbiting camera, at several graphics presets
// and internal resolutions, and from behind a soldier in the fight as the
// player sees it. Reports frame times (and how many of the display's
// refreshes each frame took), draw calls and triangles as a table and as
// JSON to send back to the developer.
// bench.html?parts: only the breakdown of the medium preset;
// bench.html?corpses: the same battle with half the soldiers fallen.
import * as THREE from 'three';
import { mulberry32, nameSeed } from './core/rng.js';
import { AutoResolution } from './battle/autores.js';
import { textureMemory } from './battle/bc.js';

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
  soldiersNoDeco: 'воїни без знаків військ і гербів (етап 4.4)',
  soldiersNoMasks: 'воїни без масок вершин, знаків і гербів (етапи 4.3–4.4; вигляд хибний, лише ціна)',
  soldiersFlat: 'воїни зі старою програмою: код знака flat (ANGLE на Direct3D 11 додає геометричний шейдер; економія від’ємна на його ціну)',
  decoNoData: 'знаки й герби в шейдері, але в жодного воїна їх немає (та сама програма: ціна знака на піксель)',
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
  // what the soldiers' shader costs of the later stages of the plan: the
  // army's sign and the knights' arms (4.4), and the vertex masks (4.3:
  // the outfit's shade, wear at the edges, mottling)
  soldiersNoDeco: soldierVariant('no-deco', ['PART_DECO']),
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

// the soldiers' meshes: every level of detail (one material in a battle,
// partmat.js)
const isSoldier = (o) => o.isMesh && o.material && o.material.customProgramCacheKey && o.material.customProgramCacheKey().startsWith('soldier:');

// The soldiers' material without some of its shader (its #defines, see
// partmat.js makeKind), or with it edited (`edit` the shader after
// partmat.js), in a copy: on every soldier's levels of detail.
// (Parts of the signs' and arms' code cut out by editing the shader made it
// slower, not faster, on an Intel UHD 630: the Direct3D compiler handles a
// smaller branch otherwise.)
function soldierVariant(key, drop, edit = null) {
  return (b) => {
    const meshes = find(b, isSoldier);
    const back = meshes.map((o) => [o, o.material]);
    for (const [o, mat] of back) {
      o.material = variantOf(mat, key, () => {
        // (not its userData: the shadows' material and the palette, shared)
        const userData = mat.userData;
        mat.userData = {};
        const copy = mat.clone();
        mat.userData = userData;
        copy.userData = userData;
        copy.defines = { ...mat.defines };
        for (const d of drop) delete copy.defines[d];
        copy.onBeforeCompile = edit
          ? (shader, renderer) => {
              mat.onBeforeCompile(shader, renderer);
              edit(shader);
            }
          : mat.onBeforeCompile;
        copy.customProgramCacheKey = () => `${mat.customProgramCacheKey()}-${key}`;
        return copy;
      });
    }
    return () => back.forEach(([o, mat]) => (o.material = mat));
  };
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
// a piece of a shader replaced, once (a warning if it is not there once:
// the measurement would be of something else)
function replaced(text, from, to) {
  if (text.split(from).length !== 2) console.warn('bench: not once in the shader:', from);
  return text.replace(from, to);
}
const STILL_PARTS = {
  ...Object.fromEntries(Object.entries(PARTS).filter(([name]) => name !== 'baseAgain')),
  soldiersNoMasks: soldierVariant('no-masks', ['PART_DECO', 'PART_MASKS', 'PART_HAIR']),
  // the soldiers' program with the sign's code (vDeco) a flat varying
  // again, as it was, for which ANGLE on Direct3D 11 runs a geometry shader
  // on every triangle drawn (partmat.js); nothing else differs (the code
  // stays moved below 4096: a few operations a vertex), the picture the
  // same. Its saving is below zero by what that costs.
  soldiersFlat: soldierVariant('flat', [], (shader) => {
    shader.vertexShader = replaced(shader.vertexShader, 'varying float vDeco;', 'flat varying float vDeco;');
    shader.fragmentShader = replaced(shader.fragmentShader, 'varying float vDeco;', 'flat varying float vDeco;');
  }),
  // the signs and arms taken off by the data, not the code: the same
  // program, the code in every palette row zeroed (texel 3's alpha: the
  // second metalness + 2 * code; the metalness kept), so that no pixel goes
  // into the sign's branch: what the sign's work per pixel costs. Put back
  // as it was, bit for bit.
  decoNoData: (b) => {
    const textures = new Set(find(b, isSoldier).map((o) => o.material.userData.palette.value));
    const saved = [...textures].map((tex) => {
      const data = tex.image.data;
      const copy = data.slice();
      for (let i = 15; i < data.length; i += 16) data[i] -= 2 * Math.floor(data[i] * 0.5);
      tex.needsUpdate = true;
      return [tex, copy];
    });
    return () =>
      saved.forEach(([tex, copy]) => {
        tex.image.data.set(copy);
        tex.needsUpdate = true;
      });
  },
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

// The intervals (ms) between `n` animation frames, by their own timestamps
// (requestAnimationFrame's: the display's refreshes they were drawn for)
function frameStamps(n) {
  return new Promise((resolve) => {
    const out = [];
    let last = null;
    const tick = (stamp) => {
      if (last != null) out.push(stamp - last);
      last = stamp;
      if (out.length < n) requestAnimationFrame(tick);
      else resolve(out);
    };
    requestAnimationFrame(tick);
  });
}

// The display's refresh period (ms) from the intervals between frames: a
// frame is shown at a refresh, so they come at its multiples; the shortest
// of them that are not rare
function refreshOf(intervals) {
  const sorted = intervals.filter((d) => d > 2).sort((a, b) => a - b);
  if (sorted.length < 10) return null;
  const low = percentile(sorted, 0.1);
  return percentile(sorted.filter((d) => d < low * 1.25), 0.5);
}

// The share of frames that took 1, 2, 3 and 4 or more of the display's
// refreshes (`refresh` ms): two refreshes are 30 frames a second on a 60 Hz
// screen, three a visible hitch
function pacing(intervals, refresh) {
  if (!refresh || !intervals.length) return null;
  const n = [0, 0, 0, 0];
  for (const d of intervals) n[Math.min(4, Math.max(1, Math.round(d / refresh))) - 1]++;
  return n.map((k) => +(k / intervals.length).toFixed(3));
}

function gpuName(renderer) {
  const gl = renderer.getContext();
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
}

// The browser's full version (the user agent string has only the major
// one), and the system's
async function browserVersion() {
  try {
    const v = await navigator.userAgentData.getHighEntropyValues(['fullVersionList', 'platformVersion']);
    return { versions: v.fullVersionList.map((b) => `${b.brand} ${b.version}`).join(', '), platform: `${v.platform} ${v.platformVersion}` };
  } catch {
    return null;
  }
}

// The soldiers' programs as the browser translated them for the video card
// (WEBGL_debug_shaders; on Windows, ANGLE's HLSL): a short hash and the
// length of each shader ('hash/length'), so that two runs show whether the
// translation changed (a new browser or ANGLE). three.js deletes a
// program's shaders once it is linked, and a deleted shader's translation
// can no longer be read: each is read as it is deleted, from the battle's
// start (watchShaders).
const translated = new WeakMap();
function watchShaders(renderer) {
  const gl = renderer.getContext();
  const ext = gl.getExtension('WEBGL_debug_shaders');
  if (!ext) return;
  const del = gl.deleteShader.bind(gl);
  gl.deleteShader = (shader) => {
    if (shader && !translated.has(shader)) {
      const text = ext.getTranslatedShaderSource(shader) || '';
      translated.set(shader, `${nameSeed(text).toString(16)}/${text.length}`);
    }
    del(shader);
  };
}
function soldierShaders(renderer) {
  if (!renderer.getContext().getExtension('WEBGL_debug_shaders')) return null;
  const out = {};
  for (const p of renderer.info.programs || []) {
    const key = /soldier:[^,]*/.exec(p.cacheKey);
    if (!key) continue;
    const [vs, fs] = [translated.get(p.vertexShader), translated.get(p.fragmentShader)];
    let name = key[0];
    for (let k = 2; name in out; k++) name = `${key[0]}#${k}`;
    out[name] = vs && fs ? { vs, fs } : null;
  }
  return out;
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
// intervals, CPU time of battle.frame(), draw calls, triangles. (Not in
// the result's JSON: `stamps`, the intervals between the frames' own
// timestamps, for their pacing once the display's refresh is known; `span`,
// when the measured frames began and ended.)
function measure(game, seconds, timeGpu = true) {
  return new Promise((resolve) => {
    const battle = game.battle;
    const frames = [];
    const cpu = [];
    const anim = [];
    // how many soldiers (living, fallen) are at each level of detail, summed
    // over the frames
    const lods = { alive: [0, 0, 0, 0], dead: [0, 0, 0, 0] };
    let calls = 0;
    let tris = 0;
    let n = 0;
    const origFrame = battle.frame.bind(battle);
    // count every pass of the frame (post-processing renders several times)
    const info = battle.renderer.info;
    info.autoReset = false;
    // (not when the automatic resolution times the frames: one timer at a time)
    const gpu = timeGpu ? gpuTimer(battle.renderer) : null;
    battle.frame = (dt) => {
      info.reset();
      const t0 = performance.now();
      if (gpu) gpu.begin();
      origFrame(dt);
      if (gpu) gpu.end();
      cpu.push(performance.now() - t0);
      if (battle.animMs != null) anim.push(battle.animMs);
      for (const a of battle.agents) if (a.body && a.body.lodLevel >= 0) lods[a.alive ? 'alive' : 'dead'][a.body.lodLevel]++;
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
    const stamps = [];
    let lastStamp = null;
    let start = last;
    const tick = (stamp) => {
      const now = performance.now();
      const dt = now - last;
      last = now;
      if (first || paused) paused = document.hidden;
      else {
        frames.push(dt);
        measured += dt;
        stamps.push(stamp - lastStamp);
      }
      if (first) start = now;
      first = false;
      lastStamp = stamp;
      // slow machines: at least a few frames even if they take long
      if (measured < seconds * 1000 || frames.length < 5) requestAnimationFrame(tick);
      else {
        document.removeEventListener('visibilitychange', onVisibility);
        battle.frame = origFrame;
        info.autoReset = true;
        const sorted = [...frames].sort((a, b) => a - b);
        const avg = frames.reduce((a, b) => a + b, 0) / Math.max(1, frames.length);
        const cpuSorted = [...cpu].sort((a, b) => a - b);
        const gpuSorted = gpu ? [...gpu.times].sort((a, b) => a - b) : [];
        const gl = battle.renderer.getContext();
        const r = {
          fps: +(1000 / avg).toFixed(1),
          p50: +percentile(sorted, 0.5).toFixed(1),
          p90: +percentile(sorted, 0.9).toFixed(1),
          p99: +percentile(sorted, 0.99).toFixed(1),
          cpuP50: +percentile(cpuSorted, 0.5).toFixed(1),
          cpuP90: +percentile(cpuSorted, 0.9).toFixed(1),
          // (of it: posing the soldiers, battle.js frame)
          animMs: anim.length ? +percentile([...anim].sort((a, b) => a - b), 0.5).toFixed(2) : null,
          gpuP50: gpuSorted.length ? +percentile(gpuSorted, 0.5).toFixed(1) : null,
          gpuP90: gpuSorted.length ? +percentile(gpuSorted, 0.9).toFixed(1) : null,
          calls: Math.round(calls / Math.max(1, n)),
          triangles: Math.round(tris / Math.max(1, n)),
          // the drawing buffer at the end (the internal resolution)
          buffer: `${gl.drawingBufferWidth}x${gl.drawingBufferHeight}`,
          realistic: !!battle.agents.find((a) => a.body),
          agents: battle.agents.filter((a) => a.alive).length,
          horses: battle.agents.filter((a) => a.alive && a.horse).length,
          fallen: battle.agents.filter((a) => !a.alive).length,
          lods: { alive: lods.alive.map((k) => +(k / Math.max(1, n)).toFixed(1)), dead: lods.dead.map((k) => +(k / Math.max(1, n)).toFixed(1)) },
        };
        Object.defineProperties(r, { stamps: { value: stamps }, span: { value: [start, now] } });
        resolve(r);
      }
    };
    requestAnimationFrame(tick);
  });
}

// The automatic resolution at work in a row (an auto row), watched from
// now on: its decisions (every few frames: the GPU time's 80th percentile it
// went by, the scale after, and what it did: down, up, undo, a step down
// undone, keep, or settle, waiting after a change), the scale of each frame
// and the GPU times of its own timer (the drawing only, not the whole frame
// as the rows' gpuP50). `done(span)`: what of it fell in the measured
// frames, the decisions' times in seconds from their start (below zero: in
// the warm-up).
function watchAutoRes(auto) {
  const decisions = [];
  const scales = [];
  const gpu = [];
  let seen = 0;
  const update = auto.update;
  auto.update = function (dt) {
    const now = performance.now();
    const times = this.times;
    if (this.ext) for (let i = seen; i < times.length; i++) gpu.push([now, times[i]]);
    const { scale, lock } = this;
    const changed = update.call(this, dt);
    // (it decides once it has enough frames, and starts on new ones)
    if (this.times !== times) {
      const action = this.scale < scale ? 'down' : this.scale > scale ? (this.lock !== lock - dt ? 'undo' : 'up') : this.wait > 0 ? 'settle' : 'keep';
      decisions.push([now, times[Math.floor(times.length * 0.8)], this.scale, action]);
      seen = 0;
    } else seen = times.length;
    scales.push([now, this.scale]);
    return changed;
  };
  return {
    done([from, to]) {
      const within = (list) => list.filter(([t]) => t >= from && t <= to).map(([, v]) => v);
      const s = within(scales);
      const g = within(gpu).sort((a, b) => a - b);
      return {
        decisions: decisions.map(([t, p80, scale, action]) => [+((t - from) / 1000).toFixed(1), +p80.toFixed(1), +scale.toFixed(2), action]),
        scaleMean: s.length ? +(s.reduce((a, b) => a + b, 0) / s.length).toFixed(3) : null,
        scaleMin: s.length ? +Math.min(...s).toFixed(2) : null,
        scaleMax: s.length ? +Math.max(...s).toFixed(2) : null,
        gpuP50: g.length ? +percentile(g, 0.5).toFixed(1) : null,
        gpuP90: g.length ? +percentile(g, 0.9).toFixed(1) : null,
      };
    },
  };
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

// Circle the middle of the armies, ORBIT_STEP radians every 33 ms; `angle`
// where the camera is on the circle (set: it goes there now)
const ORBIT_STEP = 0.012;
const ORBIT_SPEED = ORBIT_STEP / 0.033; // radians a second
function orbit(battle) {
  let angle = 0;
  const timer = setInterval(() => {
    if (!battle.agents) return;
    angle += ORBIT_STEP;
    viewAt(battle, angle);
  }, 33);
  return {
    stop: () => clearInterval(timer),
    get angle() {
      return angle;
    },
    set angle(a) {
      angle = a;
      if (battle.agents) viewAt(battle, angle);
    },
  };
}

// The camera as the player's (battle.js updateCamera): 3.1 m behind a foot
// soldier, 2 m up, a little to his right, looking the way he faces; on the
// living foot soldier nearest the middle of the armies (picked again when
// he falls). The soldiers up close at their full level of detail.
function closeView(battle) {
  let who = battle.benchClose;
  if (!who || !who.alive) {
    const alive = battle.agents.filter((a) => a.alive);
    if (!alive.length) return;
    const cx = alive.reduce((s, a) => s + a.pos.x, 0) / alive.length;
    const cz = alive.reduce((s, a) => s + a.pos.z, 0) / alive.length;
    let best = Infinity;
    for (const a of alive) {
      const d = Math.hypot(a.pos.x - cx, a.pos.z - cz);
      if (!a.horse && !a.isPlayer && d < best) {
        best = d;
        who = a;
      }
    }
    battle.benchClose = who;
  }
  if (!who) return;
  const fx = Math.sin(who.yaw);
  const fz = Math.cos(who.yaw);
  const y = battle.terrain.heightAt(who.pos.x, who.pos.z);
  battle.debugCam = { x: who.pos.x - fx * 3.1 - fz * 0.45, y: y + 2, z: who.pos.z - fz * 3.1 + fx * 0.45, tx: who.pos.x + fx * 4, ty: y + 1.2, tz: who.pos.z + fz * 4 };
}

function follow(battle) {
  battle.benchClose = null;
  closeView(battle);
  const timer = setInterval(() => battle.agents && closeView(battle), 33);
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

// (`parts`: their names in STILL_PARTS, 'base' first; `views`: what puts the
// camera at each place)
const ORBIT_VIEWS = Array.from({ length: STILL.views }, (_, v) => (battle) => viewAt(battle, 0.4 + (v / STILL.views) * Math.PI * 2));
export async function stillBreakdown(battle, show, { parts = Object.keys(STILL_PARTS), views = ORBIT_VIEWS } = {}) {
  if (!gpuTimer(battle.renderer)) return null;
  const names = parts;
  const times = Object.fromEntries(names.map((name) => [name, []]));
  battle.paused = true;
  for (let r = 0; r < STILL.rounds; r++) {
    for (let v = 0; v < views.length; v++) {
      views[v](battle);
      // (the new view settles first: shadows, levels of detail, sorting)
      await stillGpu(battle, 0, STILL.settle * 4);
      // everything at the start and again at the end of the view; the
      // parts the other way round every second round (whatever drifts
      // within a view falls on all alike)
      const order = names.slice(1);
      if (r % 2) order.reverse();
      for (const name of ['base', ...order, 'base']) {
        show(`Нерухомі кадри (${r * views.length + v + 1} з ${STILL.rounds * views.length}): ${PART_NAMES[name]}…`);
        const restore = STILL_PARTS[name](battle);
        const t = await stillGpu(battle, STILL.frames);
        restore();
        if (times[name].length > r * views.length + v) {
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

async function startBattle(game, preset, fallen = false) {
  if (game.battle) {
    game.battle.finish('retreat');
    await wait(300);
    game.ui.windows.closeAll();
  }
  game.settings.graphics = preset;
  game.settings.battleSize = 200;
  // the same field, trees and ranks in every run (the battle itself then
  // goes as fast as the frames come); each soldier from a stream of his own
  // (Battle.seedSoldier), the same men in a build that makes more or fewer
  // objects for them (as stage 4.5's bowstrings): to compare builds
  const random = Math.random;
  Math.random = mulberry32(BATTLE_SEED);
  try {
    game.debugBattle('field', { terrain: 'plains', hour: 14, armySeed: BATTLE_SEED, ...ARMY });
  } finally {
    Math.random = random;
  }
  const b = game.battle;
  // (before its first frame compiles the programs)
  watchShaders(b.renderer);
  b.debugStart();
  b.hud.root.style.display = 'none';
  // nobody dies: the load stays the same through the whole run
  for (const a of b.agents) {
    a.hp = a.maxHp = 1e6;
    if (a.horse) a.horse.hp = a.horse.maxHp = 1e6;
  }
  // bring the armies into contact before measuring
  b.debugSimulate(9);
  // bench.html?corpses: every second soldier falls, the camera behind a
  // soldier in the middle of the fight as when the player fights there (the
  // fallen near him fall up close), and lies there
  if (fallen) {
    closeView(b);
    b.updateCamera(0);
    b.camera.updateMatrixWorld();
    b.agents.forEach((a, i) => i % 2 && !a.isPlayer && a.die(null, 'cut'));
    b.debugSimulate(3);
  }
  return b;
}

// From behind a soldier in the fight: the moving battle, then still frames
// with `parts` left out
const CLOSE_PARTS = ['base', 'noSoldiers', 'soldiersNoDeco', 'soldiersFlat', 'decoNoData'];
async function closeCase(game, battle, show, parts) {
  const unfollow = follow(battle);
  show('ближній вид, як у гравця…');
  await wait(WARMUP * 1000);
  const row = await measure(game, MEASURE);
  unfollow();
  const still = await stillBreakdown(battle, (text) => show(`ближній вид. ${text}`), { parts, views: [closeView] });
  return { row, still };
}

// The battle as it is played: the window's own resolution, lowered by the
// automatic resolution when the frames take too long (the camera as it is);
// a row with what the automatic resolution did (watchAutoRes)
async function autoCase(game, battle) {
  battle.setRenderHeight(null);
  battle.autoRes = new AutoResolution(battle.renderer);
  battle.resize();
  const watch = watchAutoRes(battle.autoRes);
  await wait(WARMUP * 2000);
  const r = await measure(game, MEASURE, false);
  const row = { height: 'auto', scale: battle.autoRes.scale, ...r, autores: watch.done(r.span) };
  battle.autoRes.dispose();
  battle.autoRes = null;
  return [row, r.stamps];
}

export async function runBenchmark(game) {
  // bench.html?parts: only the breakdown of the medium preset
  const partsOnly = /[?&]parts\b/.test(location.search);
  // bench.html?corpses: the medium preset with half the soldiers fallen
  const corpsesOnly = /[?&]corpses\b/.test(location.search);
  const presets = partsOnly || corpsesOnly ? [BREAKDOWN.preset] : PRESETS;
  const heights = partsOnly || corpsesOnly ? [] : HEIGHTS;
  const out = panel();
  const show = (text) => (out.innerHTML = `<b>Бенчмарк битви</b><br>${text}`);
  out.innerHTML = `<b>Бенчмарк битви</b><br>Не чіпайте мишу й клавіатуру ≈${partsOnly ? 4 : corpsesOnly ? 2 : 8} хвилин. Підключіть зарядку.`;
  // a tab opened in the background does not draw: start once it is shown
  while (document.hidden) await wait(250);
  await game.charactersLoading;
  await wait(500);
  // the display's refresh, from frames that take one (nothing is drawn yet)
  const refresh = refreshOf(await frameStamps(90));
  const results = [];
  let device = null;
  const calib = [calibrate()];
  const breakdown = {};
  let breakdownArc = null;
  let still = null;
  let stillClose = null;
  // (the close view at the window's resolution: a row after all the others,
  // which keep their places in the results)
  let closeAuto = null;
  let fixedRows = 0;
  // (each row or part with its frames' intervals: their pacing at the end)
  const paced = [];
  const row = (r, stamps, fields = {}) => {
    const o = { ...fields, ...r };
    paced.push([o, stamps || r.stamps]);
    return o;
  };
  for (const preset of presets) {
    const battle = await startBattle(game, preset, corpsesOnly);
    const cam = orbit(battle);
    if (!device) {
      const gl = battle.renderer.getContext();
      device = {
        gpu: gpuName(battle.renderer),
        userAgent: navigator.userAgent,
        // (the full version, where the browser tells it)
        browser: await browserVersion(),
        screen: `${screen.width}x${screen.height}`,
        window: `${window.innerWidth}x${window.innerHeight}`,
        devicePixelRatio: window.devicePixelRatio,
        refreshMs: refresh && +refresh.toFixed(2),
        cores: navigator.hardwareConcurrency,
        // the models' texture layers: video memory, how many compressed
        textures: textureMemory(),
        // whether the browser can draw with the first vertex as the
        // provoking one (WEBGL_provoking_vertex: flat varyings without
        // ANGLE's geometry shader on Direct3D 11), and show the shaders'
        // translations (WEBGL_debug_shaders, soldierShaders)
        provokingVertex: !!gl.getExtension('WEBGL_provoking_vertex'),
        debugShaders: !!gl.getExtension('WEBGL_debug_shaders'),
      };
    }
    for (const h of heights) {
      battle.setRenderHeight(h);
      out.innerHTML = `<b>Бенчмарк битви</b><br>Графіка: ${preset}, роздільність: ${h}p… (${++fixedRows} з ${presets.length * heights.length})`;
      await wait(WARMUP * 1000);
      results.push(row(await measure(game, MEASURE), null, { preset, height: h }));
    }
    // the medium preset as it is played: the window's own resolution, lowered
    // by the automatic resolution when the frames take too long
    if (preset === BREAKDOWN.preset && !partsOnly && !corpsesOnly) {
      out.innerHTML = `<b>Бенчмарк битви</b><br>Графіка: ${preset}, автоматична роздільність…`;
      const [r, stamps] = await autoCase(game, battle);
      results.push(row(r, stamps, { preset }));
    }
    if (preset === BREAKDOWN.preset && corpsesOnly) {
      battle.setRenderHeight(BREAKDOWN.height);
      show(`Графіка: ${preset}, ${BREAKDOWN.height}p, половина воїнів полягла…`);
      await wait(WARMUP * 1000);
      results.push(row(await measure(game, MEASURE), null, { preset, height: BREAKDOWN.height }));
      cam.stop();
      still = await stillBreakdown(battle, show, { parts: ['base', 'noSoldiers'] });
    } else if (preset === BREAKDOWN.preset) {
      battle.setRenderHeight(BREAKDOWN.height);
      // every part on the same arc of the orbit, the first's (else each
      // part looks from another side: one part's turn is half the circle):
      // the camera put back by its warm-up, and at the arc's start as the
      // measurement starts
      let arc = null;
      for (const [name, off] of Object.entries(PARTS)) {
        out.innerHTML = `<b>Бенчмарк битви</b><br>Розклад середньої графіки: ${PART_NAMES[name]}…`;
        const restore = off(battle);
        // (longer first: the resolution has just changed)
        const warmup = name === 'base' ? WARMUP : BREAKDOWN.warmup;
        if (arc != null) cam.angle = arc - warmup * ORBIT_SPEED;
        await wait(warmup * 1000);
        if (arc == null) arc = cam.angle;
        else cam.angle = arc;
        const r = await measure(game, BREAKDOWN.measure);
        restore();
        // (p50, p90: whether the frames come evenly with this part left out)
        breakdown[name] = row({ fps: r.fps, p50: r.p50, p90: r.p90, cpuP50: r.cpuP50, cpuP90: r.cpuP90, gpuP50: r.gpuP50, gpuP90: r.gpuP90, triangles: r.triangles }, r.stamps);
      }
      // (the arc: from, to, radians on the circle)
      const from = arc % (Math.PI * 2);
      breakdownArc = [+from.toFixed(2), +(from + BREAKDOWN.measure * ORBIT_SPEED).toFixed(2)];
      cam.stop();
      still = await stillBreakdown(battle, show);
    }
    // up close, as the player sees the fight (last: the measurements before
    // it stay comparable with earlier runs); then as he plays it, at the
    // window's resolution with the automatic one
    if (preset === BREAKDOWN.preset) {
      const close = await closeCase(game, battle, show, corpsesOnly ? ['base', 'noSoldiers'] : CLOSE_PARTS);
      results.push(row(close.row, null, { preset, height: BREAKDOWN.height, view: 'close' }));
      stillClose = close.still;
      if (!partsOnly && !corpsesOnly) {
        show('ближній вид, як у гравця, з автоматичною роздільністю…');
        const unfollow = follow(battle);
        const [r, stamps] = await autoCase(game, battle);
        unfollow();
        closeAuto = row(r, stamps, { preset, view: 'close' });
      }
      // (before the next battle takes the programs away)
      device.soldierShaders = soldierShaders(battle.renderer);
    }
    cam.stop();
  }
  if (closeAuto) results.push(closeAuto);
  calib.push(calibrate());
  if (game.battle) game.battle.setRenderHeight(null);
  for (const [r, stamps] of paced) r.pacing = pacing(stamps, refresh);
  // calibMs: the processor test before and after the run (lower is faster)
  // still: GPU ms of still frames per part left out, and what that saves
  // (stillClose: the same from behind a soldier in the fight); results:
  // animMs the CPU ms of posing, lods how many soldiers (living, fallen) at
  // each level of detail, buffer the drawing buffer's size, pacing the
  // share of frames that took 1, 2, 3, 4+ of the display's refreshes
  // (device.refreshMs), autores what the automatic resolution did (auto
  // rows); breakdownArc: where on the orbit every part of the breakdown was
  // measured; fallen: half the soldiers fallen (?corpses)
  const report = { date: new Date().toISOString(), build: BUILD, device, calibMs: calib, army: ARMY, fallen: corpsesOnly, results, breakdown, breakdownArc, still, stillClose };
  const share = (p) => (p ? p.map((k) => Math.round(k * 100)).join('/') : '–');
  const rows = results
    .map((r) => `<tr><td>${r.preset}</td><td>${r.height === 'auto' ? `авто ×${+r.scale.toFixed(2)}` : `${r.height}p`}${r.view === 'close' ? ', ближче' : ''}</td><td><b>${r.fps}</b></td><td>${r.p50}</td><td>${r.p90}</td><td>${share(r.pacing)}</td><td>${r.cpuP50}</td><td>${r.animMs ?? '–'}</td><td>${r.gpuP50 ?? '–'}</td><td>${r.calls}</td><td>${(r.triangles / 1e6).toFixed(2)}M</td></tr>`)
    .join('');
  const breakdownRows = Object.entries(breakdown)
    .map(([name, r]) => `<tr><td>${PART_NAMES[name]}</td><td><b>${r.fps}</b></td><td>${r.cpuP50}</td><td>${r.gpuP50 ?? '–'}</td><td>${(r.triangles / 1e6).toFixed(2)}M</td></tr>`)
    .join('');
  const stillRows = (parts) => Object.entries(parts || {})
    .map(([name, r]) => `<tr><td>${PART_NAMES[name]}</td><td>${r.gpu}</td><td><b>${name === 'base' ? '' : r.saves}</b></td></tr>`)
    .join('');
  const stillTable = (parts, title) => parts ? `<small>${title}</small>
    <table style="border-collapse:collapse;margin:4px 0 8px;width:100%" cellpadding="3">
      <tr style="text-align:left;border-bottom:1px solid #8a7"><th>Варіант</th><th>GPU, мс</th><th>економія, мс</th></tr>
      ${stillRows(parts)}
    </table>` : '';
  // the processor slower at the end than at the start: it got hot
  const hot = calib[1] > calib[0] * 1.25;
  out.innerHTML = `<b>Готово.</b> Скопіюйте JSON нижче й надішліть його.<br>
    <small>Версія ${BUILD}; ${device.gpu}; екран оновлюється кожні ${device.refreshMs ?? '?'} мс; тест процесора: ${calib.join(' / ')} мс${hot ? ' — <b>під кінець процесор сповільнився (перегрів чи режим економії): числа занижені</b>' : ''}</small>
    ${corpsesOnly ? '<br><small>Половина воїнів полягла (bench.html?corpses).</small>' : ''}
    <table style="border-collapse:collapse;margin:8px 0;width:100%" cellpadding="3">
      <tr style="text-align:left;border-bottom:1px solid #8a7"><th>Графіка</th><th>Висота</th><th>FPS</th><th>кадр p50, мс</th><th>p90, мс</th><th>кадри в 1/2/3/4+ оновлення екрана, %</th><th>CPU, мс</th><th>пози, мс</th><th>GPU, мс</th><th>виклики</th><th>трикутники</th></tr>
      ${rows}
    </table>
    ${breakdownRows ? `<small>Середня графіка, ${BREAKDOWN.height}p, без однієї частини (кожна на тій самій дузі обльоту):</small>
    <table style="border-collapse:collapse;margin:4px 0 8px;width:100%" cellpadding="3">
      <tr style="text-align:left;border-bottom:1px solid #8a7"><th>Варіант</th><th>FPS</th><th>CPU, мс</th><th>GPU, мс</th><th>трикутники</th></tr>
      ${breakdownRows}
    </table>` : ''}
    ${stillTable(still, `Нерухомі кадри, ${BREAKDOWN.height}p: GPU без однієї частини і скільки це економить:`)}
    ${stillTable(stillClose, `Те саме з-за спини воїна в бою, як у гравця:`)}
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
