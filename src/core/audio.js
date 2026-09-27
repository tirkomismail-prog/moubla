// Tiny procedural sound effects via WebAudio (no asset files needed).

export class Sfx {
  constructor(settings) {
    this.settings = settings;
    this.ctx = null;
    this.noiseBuf = null;
    this.last = {};
  }

  ensure() {
    if (this.ctx) return this.ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    this.ctx = new AC();
    const len = this.ctx.sampleRate * 1;
    this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return this.ctx;
  }

  resume() {
    const c = this.ensure();
    if (c && c.state === 'suspended') c.resume();
  }

  gain(v) {
    return v * (this.settings.volume ?? 0.6);
  }

  // throttle identical sounds that fire many times per frame
  allow(name, ms) {
    const now = performance.now();
    if (this.last[name] && now - this.last[name] < ms) return false;
    this.last[name] = now;
    return true;
  }

  noise(dur, freq, q, vol, type = 'bandpass', delay = 0, pan = 0) {
    const c = this.ensure();
    if (!c || this.gain(1) <= 0) return;
    const t = c.currentTime + delay;
    const src = c.createBufferSource();
    src.buffer = this.noiseBuf;
    const f = c.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = c.createGain();
    g.gain.setValueAtTime(this.gain(vol), t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = g;
    if (c.createStereoPanner && pan) {
      const p = c.createStereoPanner();
      p.pan.value = Math.max(-1, Math.min(1, pan));
      g.connect(p);
      node = p;
    }
    src.connect(f).connect(g);
    node.connect(c.destination);
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur + 0.05);
  }

  tone(freq, dur, vol, type = 'sine', delay = 0, slide = 0) {
    const c = this.ensure();
    if (!c || this.gain(1) <= 0) return;
    const t = c.currentTime + delay;
    const o = c.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq * slide), t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(this.gain(vol), t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  // distance attenuation helper: d in metres
  att(d) {
    return 1 / (1 + (d || 0) * 0.08);
  }

  clang(d = 0) {
    if (!this.allow('clang', 40)) return;
    const a = this.att(d);
    this.noise(0.08, 3200, 3, 0.5 * a, 'bandpass');
    const base = 900 + Math.random() * 500;
    this.tone(base, 0.35, 0.12 * a, 'triangle');
    this.tone(base * 2.7, 0.25, 0.06 * a, 'sine');
  }

  woodBlock(d = 0) {
    if (!this.allow('wood', 40)) return;
    const a = this.att(d);
    this.noise(0.12, 500, 2, 0.6 * a, 'bandpass');
    this.tone(180, 0.12, 0.2 * a, 'sine', 0, 0.6);
  }

  hit(d = 0, heavy = false) {
    if (!this.allow('hit', 30)) return;
    const a = this.att(d);
    this.noise(heavy ? 0.22 : 0.14, heavy ? 450 : 700, 1.2, 0.8 * a, 'lowpass');
    this.tone(heavy ? 90 : 120, 0.15, 0.25 * a, 'sine', 0, 0.5);
  }

  swing(d = 0) {
    if (!this.allow('swing', 60)) return;
    const a = this.att(d);
    this.noise(0.22, 1400, 0.8, 0.18 * a, 'bandpass');
  }

  bowRelease(d = 0) {
    if (!this.allow('bow', 30)) return;
    const a = this.att(d);
    this.tone(220, 0.12, 0.15 * a, 'triangle', 0, 0.7);
    this.noise(0.1, 2500, 1, 0.12 * a, 'highpass');
  }

  arrowHit(d = 0) {
    if (!this.allow('ahit', 30)) return;
    this.noise(0.06, 1800, 1.5, 0.35 * this.att(d), 'bandpass');
  }

  hoof(d = 0) {
    this.noise(0.05, 300 + Math.random() * 120, 3, 0.18 * this.att(d), 'bandpass');
  }

  grunt(d = 0) {
    if (!this.allow('grunt', 120)) return;
    const a = this.att(d);
    const f = 110 + Math.random() * 60;
    this.tone(f, 0.25, 0.12 * a, 'sawtooth', 0, 0.7);
    this.noise(0.2, 600, 1, 0.1 * a, 'lowpass');
  }

  horn() {
    this.tone(196, 1.1, 0.18, 'sawtooth', 0, 1.0);
    this.tone(294, 0.9, 0.1, 'sawtooth', 0.15, 1.0);
  }

  cheer() {
    for (let i = 0; i < 6; i++) this.noise(0.6, 900 + i * 150, 0.8, 0.1, 'bandpass', i * 0.05);
  }

  ui() {
    this.tone(660, 0.06, 0.05, 'sine');
  }
}
