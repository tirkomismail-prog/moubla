// Performance benchmark (bench.html): a fixed field battle of ~150 soldiers
// and ~50 horses, filmed by an orbiting camera, at several graphics presets
// and internal resolutions. Reports frame times, draw calls and triangles as
// a table and as JSON to send back to the developer.
const ARMY = {
  allies: [['velmar_sergeant', 30], ['velmar_crossbow', 15], ['velmar_knight', 25]],
  enemies: [['nord_veteran', 40], ['nord_archer', 15], ['kag_horse_archer', 25]],
};
const PRESETS = ['low', 'medium', 'high'];
const HEIGHTS = [720, 900, 1080];
const WARMUP = 2.5; // seconds before measuring after each change
const MEASURE = 10; // seconds of measurement per case

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
    battle.frame = (dt) => {
      info.reset();
      const t0 = performance.now();
      origFrame(dt);
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

function orbit(battle) {
  // circle the middle of the armies at 30 m, 9 m up
  let angle = 0;
  const timer = setInterval(() => {
    if (!battle.agents) return;
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
    angle += 0.012;
    const y = battle.terrain.heightAt(cx, cz);
    battle.debugCam = { x: cx + Math.cos(angle) * 30, y: y + 9, z: cz + Math.sin(angle) * 30, tx: cx, ty: y + 1.2, tz: cz };
  }, 33);
  return () => clearInterval(timer);
}

async function startBattle(game, preset) {
  if (game.battle) {
    game.battle.finish('retreat');
    await wait(300);
    game.ui.windows.closeAll();
  }
  game.settings.graphics = preset;
  game.settings.battleSize = 200;
  game.debugBattle('field', { terrain: 'plains', hour: 14, ...ARMY });
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
  const out = panel();
  out.innerHTML = '<b>Бенчмарк битви</b><br>Не чіпайте мишу й клавіатуру ≈3 хвилини. Підключіть зарядку.';
  // a tab opened in the background does not draw: start once it is shown
  while (document.hidden) await wait(250);
  await game.charactersLoading;
  await wait(500);
  const results = [];
  let device = null;
  for (const preset of PRESETS) {
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
    for (const h of HEIGHTS) {
      battle.setRenderHeight(h);
      out.innerHTML = `<b>Бенчмарк битви</b><br>Графіка: ${preset}, роздільність: ${h}p… (${results.length + 1} з ${PRESETS.length * HEIGHTS.length})`;
      await wait(WARMUP * 1000);
      const r = await measure(game, MEASURE);
      results.push({ preset, height: h, ...r });
    }
    stop();
  }
  if (game.battle) game.battle.setRenderHeight(null);
  const report = { date: new Date().toISOString(), device, army: ARMY, results };
  const rows = results
    .map((r) => `<tr><td>${r.preset}</td><td>${r.height}p</td><td><b>${r.fps}</b></td><td>${r.p50}</td><td>${r.p90}</td><td>${r.cpuP50}</td><td>${r.calls}</td><td>${(r.triangles / 1e6).toFixed(2)}M</td></tr>`)
    .join('');
  out.innerHTML = `<b>Готово.</b> Скопіюйте JSON нижче й надішліть його.<br>
    <small>${device.gpu}</small>
    <table style="border-collapse:collapse;margin:8px 0;width:100%" cellpadding="3">
      <tr style="text-align:left;border-bottom:1px solid #8a7"><th>Графіка</th><th>Висота</th><th>FPS</th><th>кадр p50, мс</th><th>p90, мс</th><th>CPU, мс</th><th>виклики</th><th>трикутники</th></tr>
      ${rows}
    </table>
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
