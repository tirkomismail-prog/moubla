// 2D strategic map: terrain texture, decorations, settlements, parties, input.
import { WORLD_W, WORLD_H, BIOME, CELL } from '../world/terrain.js';
import { VISION } from '../world/world.js';
import { factionInfo } from '../data/factions.js';
import { totalCount } from '../world/party.js';
import { clamp, dist2, hexToRgb } from '../core/util.js';
import { mulberry32 } from '../core/rng.js';

const TEX_STEP = 3; // world units per terrain texel

const BIOME_RGB = {
  [BIOME.BEACH]: [214, 198, 146],
  [BIOME.PLAINS]: [128, 160, 88],
  [BIOME.FOREST]: [84, 122, 62],
  [BIOME.STEPPE]: [186, 172, 108],
  [BIOME.DESERT]: [214, 190, 136],
  [BIOME.SNOW]: [226, 232, 234],
  [BIOME.TAIGA]: [80, 112, 90],
  [BIOME.MOUNTAIN]: [132, 120, 104],
  [BIOME.PEAK]: [236, 238, 240],
};

export class MapView {
  constructor(canvas, game) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.game = game;
    this.cam = { x: WORLD_W / 2, y: WORLD_H / 2, zoom: 1 };
    this.follow = true;
    this.hover = null;
    this.mouse = { x: 0, y: 0, down: false, dragging: false, sx: 0, sy: 0 };
    this.keys = new Set();
    this.texture = null;
    this.onClickEntity = null;
    this.bindInput();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  get world() {
    return this.game.world;
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.dpr = dpr;
    this.canvas.width = Math.floor(window.innerWidth * dpr);
    this.canvas.height = Math.floor(window.innerHeight * dpr);
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
  }

  // ---- terrain texture ---------------------------------------------------------

  buildTexture(world) {
    const gen = world.gen;
    const f = gen.field(TEX_STEP);
    const { w, h, height, biome } = f;
    const cv = document.createElement('canvas');
    cv.width = w;
    cv.height = h;
    const ctx = cv.getContext('2d');
    const img = ctx.createImageData(w, h);
    const d = img.data;
    const rand = mulberry32(world.state.seed + 5);
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        const k = j * w + i;
        const b = biome[k];
        const hh = height[k];
        let r;
        let g;
        let bl;
        if (b === BIOME.WATER) {
          const depth = clamp(-hh * 2.2, 0, 1);
          r = 70 - depth * 42;
          g = 128 - depth * 62;
          bl = 160 - depth * 58;
          if (hh > -0.025) {
            r += 30;
            g += 30;
            bl += 22;
          }
        } else {
          const c = BIOME_RGB[b];
          const hl = clamp((hh - 0.1) * 0.35, -0.05, 0.25);
          r = c[0] * (1 - hl * 0.4);
          g = c[1] * (1 - hl * 0.4);
          bl = c[2] * (1 - hl * 0.2);
          // hill shading
          const hx = height[k + (i < w - 1 ? 1 : 0)] - height[k - (i > 0 ? 1 : 0)];
          const hy = height[k + (j < h - 1 ? w : 0)] - height[k - (j > 0 ? w : 0)];
          const shade = clamp(1 - (hx + hy) * 5.5, 0.62, 1.28);
          const noise = 0.96 + rand() * 0.08;
          r *= shade * noise;
          g *= shade * noise;
          bl *= shade * noise;
        }
        const o = k * 4;
        d[o] = r;
        d[o + 1] = g;
        d[o + 2] = bl;
        d[o + 3] = 255;
      }
    }
    // light blur for softer biome borders
    const src = new Uint8ClampedArray(d);
    for (let j = 1; j < h - 1; j++) {
      for (let i = 1; i < w - 1; i++) {
        const o = (j * w + i) * 4;
        for (let c = 0; c < 3; c++) {
          d[o + c] = (src[o + c] * 4 + src[o + c - 4] + src[o + c + 4] + src[o + c - w * 4] + src[o + c + w * 4]) / 8;
        }
      }
    }
    ctx.putImageData(img, 0, 0);

    // roads
    ctx.save();
    ctx.scale(1 / TEX_STEP, 1 / TEX_STEP);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const pass of [[7, 'rgba(90,70,40,0.35)'], [4, 'rgba(196,170,120,0.85)']]) {
      ctx.lineWidth = pass[0];
      ctx.strokeStyle = pass[1];
      for (const road of world.roads) {
        ctx.beginPath();
        road.forEach(([x, y], n) => (n ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.stroke();
      }
    }
    ctx.restore();
    this.texture = cv;

    // decorations (trees and peaks), drawn as vectors each frame
    const nav = world.nav;
    const trees = [];
    const pines = [];
    const peaks = [];
    const r2 = mulberry32(world.state.seed + 9);
    for (let cy = 0; cy < nav.h; cy++) {
      for (let cx = 0; cx < nav.w; cx++) {
        const c = cy * nav.w + cx;
        if (nav.road[c]) continue;
        const b = nav.biome[c];
        const x = (cx + 0.5) * CELL;
        const y = (cy + 0.5) * CELL;
        if (b === BIOME.FOREST) {
          for (let n = 0; n < 2; n++) trees.push([x + (r2() - 0.5) * CELL, y + (r2() - 0.5) * CELL, 4 + r2() * 3]);
        } else if (b === BIOME.TAIGA) {
          for (let n = 0; n < 2; n++) pines.push([x + (r2() - 0.5) * CELL, y + (r2() - 0.5) * CELL, 5 + r2() * 3]);
        } else if (b === BIOME.PLAINS && r2() < 0.05) {
          trees.push([x + (r2() - 0.5) * CELL, y + (r2() - 0.5) * CELL, 3.5 + r2() * 2]);
        } else if ((b === BIOME.MOUNTAIN || b === BIOME.PEAK) && (cx + cy) % 2 === 0 && r2() < 0.8) {
          peaks.push([x + (r2() - 0.5) * CELL * 0.6, y + (r2() - 0.5) * CELL * 0.6, (b === BIOME.PEAK ? 13 : 9) + r2() * 5, b === BIOME.PEAK]);
        }
      }
    }
    // draw order by y for a slight 3D feeling
    trees.sort((a, b) => a[1] - b[1]);
    pines.sort((a, b) => a[1] - b[1]);
    peaks.sort((a, b) => a[1] - b[1]);
    this.decor = { trees, pines, peaks };
  }

  // ---- coordinates ---------------------------------------------------------------

  worldToScreen(x, y) {
    const z = this.cam.zoom * this.dpr;
    return [(x - this.cam.x) * z + this.canvas.width / 2, (y - this.cam.y) * z + this.canvas.height / 2];
  }

  screenToWorld(sx, sy) {
    const z = this.cam.zoom * this.dpr;
    return [(sx * this.dpr - this.canvas.width / 2) / z + this.cam.x, (sy * this.dpr - this.canvas.height / 2) / z + this.cam.y];
  }

  centerOnPlayer() {
    const pp = this.world.state.party;
    this.cam.x = pp.x;
    this.cam.y = pp.y;
    this.follow = true;
  }

  clampCam() {
    this.cam.x = clamp(this.cam.x, 0, WORLD_W);
    this.cam.y = clamp(this.cam.y, 0, WORLD_H);
  }

  // ---- input -----------------------------------------------------------------------

  bindInput() {
    const cv = this.canvas;
    cv.addEventListener('contextmenu', (e) => e.preventDefault());
    cv.addEventListener('mousedown', (e) => {
      this.mouse.down = true;
      this.mouse.button = e.button;
      this.mouse.sx = e.clientX;
      this.mouse.sy = e.clientY;
      this.mouse.camX = this.cam.x;
      this.mouse.camY = this.cam.y;
      this.mouse.dragging = false;
    });
    window.addEventListener('mouseup', (e) => {
      if (!this.mouse.down) return;
      this.mouse.down = false;
      if (!this.mouse.dragging && e.target === cv && this.mouse.button === 0) this.click(e.clientX, e.clientY);
      this.mouse.dragging = false;
    });
    cv.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      if (this.mouse.down) {
        const dx = e.clientX - this.mouse.sx;
        const dy = e.clientY - this.mouse.sy;
        if (!this.mouse.dragging && dx * dx + dy * dy > 36) this.mouse.dragging = true;
        if (this.mouse.dragging) {
          this.follow = false;
          this.cam.x = this.mouse.camX - dx / this.cam.zoom;
          this.cam.y = this.mouse.camY - dy / this.cam.zoom;
          this.clampCam();
        }
      }
    });
    cv.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const [wx, wy] = this.screenToWorld(e.clientX, e.clientY);
        const f = Math.exp(-e.deltaY * 0.0015);
        this.cam.zoom = clamp(this.cam.zoom * f, 0.3, 4);
        const [wx2, wy2] = this.screenToWorld(e.clientX, e.clientY);
        this.cam.x += wx - wx2;
        this.cam.y += wy - wy2;
        this.clampCam();
      },
      { passive: false },
    );
    cv.addEventListener('mouseleave', () => {
      this.hover = null;
    });
  }

  // Find the entity under the cursor.
  pick(sx, sy) {
    const world = this.world;
    if (!world) return null;
    const st = world.state;
    const [wx, wy] = this.screenToWorld(sx, sy);
    const z = this.cam.zoom;
    let best = null;
    let bd = Infinity;
    const consider = (type, e, r) => {
      const d = dist2(e.x, e.y, wx, wy);
      if (d < r * r && d < bd) {
        bd = d;
        best = { type, id: e.id, e };
      }
    };
    for (const b of st.battles) if (this.isVisible(b)) consider('battle', b, 16 / z);
    for (const p of st.parties) if (!p.inside && this.isVisible(p) && !p.battleId) consider('party', p, 12 / z);
    if (!best) {
      for (const s of st.settlements) consider('settlement', s, (s.kind === 'village' ? 14 : 20) / Math.min(z, 1.6));
    }
    if (!best) consider('player', st.party, 10 / z);
    return best;
  }

  isVisible(e) {
    const pp = this.world.state.party;
    const r = VISION * (this.world.isNight() ? 0.9 : 1.3);
    return dist2(e.x, e.y, pp.x, pp.y) < r * r;
  }

  click(sx, sy) {
    const hit = this.pick(sx, sy);
    const [wx, wy] = this.screenToWorld(sx, sy);
    if (this.onClickEntity) this.onClickEntity(hit, wx, wy);
  }

  update(dt) {
    const pan = 700 * dt / this.cam.zoom;
    let moved = false;
    if (this.keys.has('ArrowLeft') || this.keys.has('KeyA')) (this.cam.x -= pan), (moved = true);
    if (this.keys.has('ArrowRight') || this.keys.has('KeyD')) (this.cam.x += pan), (moved = true);
    if (this.keys.has('ArrowUp') || this.keys.has('KeyW')) (this.cam.y -= pan), (moved = true);
    if (this.keys.has('ArrowDown') || this.keys.has('KeyS')) (this.cam.y += pan), (moved = true);
    if (moved) {
      this.follow = false;
      this.clampCam();
    }
    if (this.follow && this.world) {
      const pp = this.world.state.party;
      const k = 1 - Math.exp(-dt * 5);
      this.cam.x += (pp.x - this.cam.x) * k;
      this.cam.y += (pp.y - this.cam.y) * k;
    }
    this.hover = this.mouse.down ? null : this.pick(this.mouse.x, this.mouse.y);
  }

  // ---- drawing ------------------------------------------------------------------------

  draw() {
    const world = this.world;
    const ctx = this.ctx;
    const cv = this.canvas;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#1c4266';
    ctx.fillRect(0, 0, cv.width, cv.height);
    if (!world || !this.texture) return;
    const st = world.state;
    const z = this.cam.zoom * this.dpr;
    ctx.setTransform(z, 0, 0, z, cv.width / 2 - this.cam.x * z, cv.height / 2 - this.cam.y * z);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(this.texture, 0, 0, this.texture.width * TEX_STEP, this.texture.height * TEX_STEP);

    // visible rect in world coords
    const [x0, y0] = this.screenToWorld(0, 0);
    const [x1, y1] = this.screenToWorld(window.innerWidth, window.innerHeight);
    const inView = (x, y, m = 30) => x > x0 - m && x < x1 + m && y > y0 - m && y < y1 + m;

    this.drawDecor(ctx, inView);

    // player path
    const pp = st.party;
    if (pp.path && pp.pi < pp.path.length) {
      ctx.save();
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 2 / this.cam.zoom;
      ctx.strokeStyle = 'rgba(255,240,200,0.8)';
      ctx.beginPath();
      ctx.moveTo(pp.x, pp.y);
      for (let i = pp.pi; i < pp.path.length; i++) ctx.lineTo(pp.path[i][0], pp.path[i][1]);
      ctx.stroke();
      ctx.restore();
      const last = pp.path[pp.path.length - 1];
      ctx.strokeStyle = 'rgba(255,240,200,0.9)';
      ctx.lineWidth = 2 / this.cam.zoom;
      ctx.beginPath();
      ctx.arc(last[0], last[1], 5 / this.cam.zoom, 0, Math.PI * 2);
      ctx.stroke();
    }

    // settlements
    for (const s of st.settlements) if (inView(s.x, s.y, 60)) this.drawSettlement(ctx, s);

    // quest markers
    for (const q of st.quests) {
      if (q.status !== 'active') continue;
      let tx = null;
      if (q.type === 'delivery') tx = world.sById.get(q.target);
      else if (q.type === 'bounty') {
        const giver = world.sById.get(q.giver);
        const p = world.pById.get(q.targetParty);
        tx = p && this.isVisible(p) ? p : giver;
      }
      if (tx && inView(tx.x, tx.y)) this.drawQuestMarker(ctx, tx.x, tx.y);
    }

    // battles
    for (const b of st.battles) if (this.isVisible(b) && inView(b.x, b.y)) this.drawBattle(ctx, b);

    // parties
    const sorted = st.parties.filter((p) => !p.inside && this.isVisible(p) && inView(p.x, p.y)).sort((a, b) => a.y - b.y);
    for (const p of sorted) this.drawParty(ctx, p, false);
    this.drawParty(ctx, pp, true);

    // vision circle (subtle)
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 2 / this.cam.zoom;
    ctx.beginPath();
    ctx.arc(pp.x, pp.y, VISION * (world.isNight() ? 0.9 : 1.3), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // day/night tint
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const hour = st.time % 24;
    let night = 0;
    if (hour < 5) night = 1;
    else if (hour < 7) night = 1 - (hour - 5) / 2;
    else if (hour >= 21) night = 1;
    else if (hour >= 19) night = (hour - 19) / 2;
    if (night > 0) {
      ctx.fillStyle = `rgba(12,20,52,${0.38 * night})`;
      ctx.fillRect(0, 0, cv.width, cv.height);
    }
    // hover highlight label
    if (this.hover) this.drawHoverRing(ctx);
  }

  drawDecor(ctx, inView) {
    const z = this.cam.zoom;
    if (!this.decor) return;
    const { trees, pines, peaks } = this.decor;
    // mountains
    for (const [x, y, s, peak] of peaks) {
      if (!inView(x, y)) continue;
      ctx.fillStyle = peak ? '#a8a29a' : '#7b705f';
      ctx.beginPath();
      ctx.moveTo(x - s, y + s * 0.45);
      ctx.lineTo(x, y - s * 0.8);
      ctx.lineTo(x + s, y + s * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = peak ? '#d9d6d0' : '#968a76';
      ctx.beginPath();
      ctx.moveTo(x, y - s * 0.8);
      ctx.lineTo(x + s, y + s * 0.45);
      ctx.lineTo(x + s * 0.15, y + s * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#f4f4f2';
      ctx.beginPath();
      ctx.moveTo(x, y - s * 0.8);
      ctx.lineTo(x - s * 0.32, y - s * 0.28);
      ctx.lineTo(x + s * 0.32, y - s * 0.28);
      ctx.closePath();
      ctx.fill();
    }
    if (z < 0.45) return;
    // deciduous trees: batched circles
    ctx.fillStyle = 'rgba(40,70,30,0.9)';
    ctx.beginPath();
    for (const [x, y, s] of trees) {
      if (!inView(x, y)) continue;
      ctx.moveTo(x + s, y);
      ctx.arc(x, y, s, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.fillStyle = 'rgba(88,128,60,0.9)';
    ctx.beginPath();
    for (const [x, y, s] of trees) {
      if (!inView(x, y)) continue;
      ctx.moveTo(x - s * 0.25 + s * 0.55, y - s * 0.3);
      ctx.arc(x - s * 0.25, y - s * 0.3, s * 0.55, 0, Math.PI * 2);
    }
    ctx.fill();
    // pines: batched triangles
    ctx.fillStyle = 'rgba(30,62,48,0.95)';
    ctx.beginPath();
    for (const [x, y, s] of pines) {
      if (!inView(x, y)) continue;
      ctx.moveTo(x - s * 0.55, y + s * 0.5);
      ctx.lineTo(x, y - s);
      ctx.lineTo(x + s * 0.55, y + s * 0.5);
      ctx.closePath();
    }
    ctx.fill();
  }

  iconScale() {
    return clamp(0.75 + this.cam.zoom * 0.35, 0.8, 1.6) / this.cam.zoom;
  }

  drawSettlement(ctx, s) {
    const k = this.iconScale();
    const f = factionInfo(s.faction);
    const x = s.x;
    const y = s.y;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(k, k);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = '#2a2018';
    if (s.kind === 'town') {
      ctx.fillStyle = '#d7cbb0';
      ctx.fillRect(-14, -6, 28, 12);
      ctx.strokeRect(-14, -6, 28, 12);
      for (const tx of [-15, -3, 9]) {
        ctx.fillStyle = '#c9bb9c';
        ctx.fillRect(tx, -12, 6, 18);
        ctx.strokeRect(tx, -12, 6, 18);
        ctx.fillStyle = '#8b3a2a';
        ctx.beginPath();
        ctx.moveTo(tx - 1, -12);
        ctx.lineTo(tx + 3, -18);
        ctx.lineTo(tx + 7, -12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      this.drawFlag(ctx, 0, -18, f.color, 1.1);
    } else if (s.kind === 'castle') {
      ctx.fillStyle = '#b9b2a4';
      ctx.fillRect(-9, -8, 18, 14);
      ctx.strokeRect(-9, -8, 18, 14);
      ctx.fillStyle = '#a39c8e';
      ctx.fillRect(-4, -16, 8, 10);
      ctx.strokeRect(-4, -16, 8, 10);
      for (const tx of [-9, -3, 3]) ctx.fillRect(tx, -10, 3, 2);
      this.drawFlag(ctx, 0, -16, f.color, 1);
    } else {
      for (const [hx, hy] of [[-7, 2], [2, -2], [6, 5]]) {
        ctx.fillStyle = '#c8a878';
        ctx.fillRect(hx - 3, hy - 2, 7, 5);
        ctx.strokeRect(hx - 3, hy - 2, 7, 5);
        ctx.fillStyle = '#7a5230';
        ctx.beginPath();
        ctx.moveTo(hx - 4, hy - 2);
        ctx.lineTo(hx + 0.5, hy - 6);
        ctx.lineTo(hx + 5, hy - 2);
        ctx.closePath();
        ctx.fill();
      }
    }
    if (s.siege) {
      ctx.strokeStyle = 'rgba(220,40,20,0.9)';
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -2, 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    // label
    const fs = s.kind === 'village' ? 10 : 12.5;
    ctx.font = `${s.kind === 'village' ? '' : 'bold '}${fs}px Alegreya, Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const label = s.name;
    const tw = ctx.measureText(label).width;
    const ly = s.kind === 'village' ? 9 : 9;
    ctx.fillStyle = 'rgba(20,16,10,0.55)';
    ctx.fillRect(-tw / 2 - 4, ly - 1, tw + 8, fs + 4);
    ctx.fillStyle = s.kind === 'village' ? '#efe6d2' : '#fff6e0';
    ctx.fillText(label, 0, ly + 1);
    ctx.fillStyle = f.color;
    ctx.fillRect(-tw / 2 - 4, ly + fs + 3, tw + 8, 2);
    if (s.owner === 'player') {
      ctx.fillStyle = '#f5d76e';
      ctx.fillText('★', tw / 2 + 10, ly + 1);
    }
    ctx.restore();
  }

  drawFlag(ctx, x, y, color, s) {
    ctx.strokeStyle = '#2a2018';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 9 * s);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - 9 * s);
    ctx.lineTo(x + 8 * s, y - 7 * s);
    ctx.lineTo(x, y - 5 * s);
    ctx.closePath();
    ctx.fill();
  }

  drawParty(ctx, p, isPlayer) {
    const k = this.iconScale();
    const f = isPlayer ? { color: '#f5d76e' } : factionInfo(p.faction);
    const n = totalCount(p.troops) + (isPlayer ? 1 : 0);
    const r = 5 + Math.min(5, Math.sqrt(n) * 0.6);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(k, k);
    // shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(1.5, 2.5, r, r * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = f.color;
    ctx.strokeStyle = isPlayer ? '#fff' : p.kind === 'bandit' ? '#c0392b' : '#1b140e';
    ctx.lineWidth = isPlayer ? 2.2 : 1.6;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = isPlayer ? '#3b2a10' : '#fff';
    ctx.font = `bold ${r * 1.25}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const sym = isPlayer ? '★' : p.kind === 'bandit' ? '☠' : p.kind === 'caravan' ? '⚖' : '⚑';
    ctx.fillText(sym, 0, 0.5);
    if (this.cam.zoom > 0.8 || isPlayer) {
      ctx.font = 'bold 9px sans-serif';
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      const txt = String(n);
      const tw = ctx.measureText(txt).width;
      ctx.fillRect(r + 1, -5, tw + 4, 10);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'left';
      ctx.fillText(txt, r + 3, 0.5);
    }
    ctx.restore();
  }

  drawBattle(ctx, b) {
    const k = this.iconScale();
    const t = performance.now() / 300;
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.scale(k, k);
    ctx.fillStyle = `rgba(200,40,20,${0.25 + 0.15 * Math.sin(t)})`;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeText('⚔', 0, 0);
    ctx.fillText('⚔', 0, 0);
    ctx.restore();
  }

  drawQuestMarker(ctx, x, y) {
    const k = this.iconScale();
    const t = performance.now() / 250;
    ctx.save();
    ctx.translate(x, y - 34 * k + Math.sin(t) * 2 * k);
    ctx.scale(k, k);
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd34d';
    ctx.strokeStyle = '#3a2a00';
    ctx.lineWidth = 3;
    ctx.strokeText('!', 0, 0);
    ctx.fillText('!', 0, 0);
    ctx.restore();
  }

  drawHoverRing(ctx) {
    const h = this.hover;
    if (!h || !h.e) return;
    const [sx, sy] = this.worldToScreen(h.e.x, h.e.y);
    ctx.strokeStyle = 'rgba(255,230,160,0.85)';
    ctx.lineWidth = 2 * this.dpr;
    ctx.beginPath();
    ctx.arc(sx, sy, (h.type === 'settlement' ? 24 : 14) * this.dpr, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export function factionRgb(id) {
  return hexToRgb(factionInfo(id).color);
}
