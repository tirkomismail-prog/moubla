// Automatic resolution: when the graphics card takes too long over a frame,
// the battle is drawn at a lower internal resolution (and back up once there
// is room), so that the frames come evenly. The browser shows a frame at the
// screen's refresh: a frame that takes a little over two refreshes waits for
// a third, a visible hitch. The goal is 30 frames a second: the GPU time of
// most frames (the 80th percentile) under BUDGET.
//
// The GPU time comes from timer queries (EXT_disjoint_timer_query_webgl2);
// without them, from the time between frames, which only shows the frames
// that already missed (then the resolution only goes down).
const BUDGET = 28; // ms, of the 33.3 a frame at 30 frames a second has
const MIN_SCALE = 0.6; // of the resolution chosen in the settings
const STEP = 0.05;
const EVERY = 24; // frames between decisions
const SETTLE = 1; // seconds after a change before the next one
// a step down that did not make the frames at least this much quicker:
// the time goes elsewhere (the processor), the resolution goes back up and
// stays for LOCK seconds
const GAIN = 0.92;
const LOCK = 10;

export class AutoResolution {
  constructor(renderer) {
    this.gl = renderer.getContext();
    this.ext = this.gl.getExtension('EXT_disjoint_timer_query_webgl2');
    this.scale = 1;
    this.times = [];
    this.pending = [];
    this.active = null;
    // (the first frames of a battle are slow anyway: shaders are compiled)
    this.wait = 3;
    this.down = null; // the last step down: {from, t}
    this.lock = 0;
    // (results of frames drawn before the last change are left out)
    this.epoch = 0;
  }

  // around the drawing of a frame
  begin() {
    if (!this.ext || this.active) return;
    this.active = { q: this.gl.createQuery(), epoch: this.epoch };
    this.gl.beginQuery(this.ext.TIME_ELAPSED_EXT, this.active.q);
  }

  end() {
    const gl = this.gl;
    if (!this.active) return;
    gl.endQuery(this.ext.TIME_ELAPSED_EXT);
    this.pending.push(this.active);
    this.active = null;
    // (the results come a few frames late)
    while (this.pending.length && gl.getQueryParameter(this.pending[0].q, gl.QUERY_RESULT_AVAILABLE)) {
      const { q, epoch } = this.pending.shift();
      const ms = gl.getQueryParameter(q, gl.QUERY_RESULT) / 1e6;
      if (epoch === this.epoch && !gl.getParameter(this.ext.GPU_DISJOINT_EXT)) this.times.push(ms);
      gl.deleteQuery(q);
    }
  }

  // after each frame (dt: seconds since the last); true when the scale
  // changed (the renderer is to be resized)
  update(dt) {
    this.wait -= dt;
    this.lock -= dt;
    if (!this.ext) this.times.push(dt * 1000);
    if (this.times.length < EVERY) return false;
    const sorted = this.times.sort((a, b) => a - b);
    const t = sorted[Math.floor(sorted.length * 0.8)];
    this.times = [];
    if (this.wait > 0) return false;
    // the last step down did not help: back up, and no lower for a while
    const down = this.down;
    this.down = null;
    if (down && t > down.t * GAIN) {
      this.lock = LOCK;
      return this.set(down.from);
    }
    // the cost goes with the pixels, the square of the scale
    let s = this.scale;
    if (this.ext) {
      if (t > BUDGET) s *= Math.max(0.8, Math.sqrt(BUDGET / t));
      else if (t < BUDGET * 0.7) s *= Math.min(1.12, Math.sqrt((BUDGET * 0.85) / t));
    } else if (t > (1000 / 30) * 1.2) s *= 0.9;
    s = Math.min(1, Math.max(MIN_SCALE, Math.round(s / STEP) * STEP));
    if (s < this.scale) {
      if (this.lock > 0) return false;
      this.down = { from: this.scale, t };
    }
    return this.set(s);
  }

  set(s) {
    if (s === this.scale) return false;
    this.scale = s;
    this.wait = SETTLE;
    this.epoch++;
    this.times = [];
    return true;
  }

  dispose() {
    for (const p of this.pending) this.gl.deleteQuery(p.q);
    if (this.active) this.gl.deleteQuery(this.active.q);
    this.pending = [];
    this.active = null;
  }
}
