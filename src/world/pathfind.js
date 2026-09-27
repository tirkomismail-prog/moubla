// A* pathfinding over the world NavGrid.
import { CELL } from './terrain.js';

class MinHeap {
  constructor() {
    this.items = [];
    this.prio = [];
  }
  get size() {
    return this.items.length;
  }
  push(item, p) {
    const a = this.items;
    const q = this.prio;
    a.push(item);
    q.push(p);
    let i = a.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (q[parent] <= q[i]) break;
      [a[parent], a[i]] = [a[i], a[parent]];
      [q[parent], q[i]] = [q[i], q[parent]];
      i = parent;
    }
  }
  pop() {
    const a = this.items;
    const q = this.prio;
    const top = a[0];
    const lastI = a.pop();
    const lastP = q.pop();
    if (a.length) {
      a[0] = lastI;
      q[0] = lastP;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < a.length && q[l] < q[m]) m = l;
        if (r < a.length && q[r] < q[m]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        [q[m], q[i]] = [q[i], q[m]];
        i = m;
      }
    }
    return top;
  }
}

const DIRS = [
  [1, 0, 1],
  [-1, 0, 1],
  [0, 1, 1],
  [0, -1, 1],
  [1, 1, Math.SQRT2],
  [1, -1, Math.SQRT2],
  [-1, 1, Math.SQRT2],
  [-1, -1, Math.SQRT2],
];

export class Pathfinder {
  constructor(nav) {
    this.nav = nav;
    const n = nav.w * nav.h;
    this.g = new Float32Array(n);
    this.from = new Int32Array(n);
    this.stamp = new Uint32Array(n);
    this.closed = new Uint32Array(n);
    this.run = 0;
  }

  cellSpeed(c) {
    return this.nav.speed[c] * (this.nav.road[c] ? 1.25 : 1);
  }

  // Returns array of [x, y] waypoints (world units) or null.
  find(sx, sy, tx, ty, maxExpand = 60000) {
    const nav = this.nav;
    const w = nav.w;
    let start = nav.cellAt(sx, sy);
    let goal = nav.cellAt(tx, ty);
    if (nav.speed[goal] <= 0 || nav.region[goal] !== nav.region[start]) {
      // retarget to nearest reachable cell near the goal
      const alt = this.nearestPassable(goal, nav.region[start]);
      if (alt < 0) return null;
      goal = alt;
      tx = ((goal % w) + 0.5) * CELL;
      ty = (((goal / w) | 0) + 0.5) * CELL;
    }
    if (nav.speed[start] <= 0) {
      const alt = this.nearestPassable(start, -1);
      if (alt < 0) return null;
      start = alt;
    }
    if (start === goal) return [[tx, ty]];

    this.run++;
    const run = this.run;
    const heap = new MinHeap();
    const gx = goal % w;
    const gy = (goal / w) | 0;
    const maxSpeed = 1.3;
    const h = (c) => {
      const dx = Math.abs((c % w) - gx);
      const dy = Math.abs(((c / w) | 0) - gy);
      return (Math.max(dx, dy) + (Math.SQRT2 - 1) * Math.min(dx, dy)) / maxSpeed;
    };
    this.g[start] = 0;
    this.stamp[start] = run;
    this.from[start] = -1;
    heap.push(start, h(start));
    let expanded = 0;
    let found = false;
    while (heap.size) {
      const c = heap.pop();
      if (this.closed[c] === run) continue;
      this.closed[c] = run;
      if (c === goal) {
        found = true;
        break;
      }
      if (++expanded > maxExpand) break;
      const cx = c % w;
      const cy = (c / w) | 0;
      const gc = this.g[c];
      for (const [dx, dy, len] of DIRS) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= nav.h) continue;
        const n = ny * w + nx;
        const sp = this.cellSpeed(n);
        if (sp <= 0) continue;
        if (dx && dy) {
          // no corner cutting through impassable cells
          if (nav.speed[cy * w + nx] <= 0 || nav.speed[ny * w + cx] <= 0) continue;
        }
        const ng = gc + len / Math.min(sp, this.cellSpeed(c));
        if (this.stamp[n] !== run || ng < this.g[n]) {
          this.stamp[n] = run;
          this.g[n] = ng;
          this.from[n] = c;
          heap.push(n, ng + h(n));
        }
      }
    }
    if (!found) return null;
    const cells = [];
    for (let c = goal; c !== -1; c = this.from[c]) cells.push(c);
    cells.reverse();
    return this.smooth(cells, tx, ty);
  }

  nearestPassable(c0, region) {
    const nav = this.nav;
    const w = nav.w;
    const cx0 = c0 % w;
    const cy0 = (c0 / w) | 0;
    for (let r = 1; r < 60; r++) {
      let best = -1;
      let bestD = Infinity;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
          const nx = cx0 + dx;
          const ny = cy0 + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= nav.h) continue;
          const n = ny * w + nx;
          if (nav.speed[n] <= 0) continue;
          if (region >= 0 && nav.region[n] !== region) continue;
          const d = dx * dx + dy * dy;
          if (d < bestD) {
            bestD = d;
            best = n;
          }
        }
      }
      if (best >= 0) return best;
    }
    return -1;
  }

  // Straight-line walkability: all cells passable and not slower than minSpeed.
  lineClear(c0, c1, minSpeed) {
    const nav = this.nav;
    const w = nav.w;
    let x0 = c0 % w;
    let y0 = (c0 / w) | 0;
    const x1 = c1 % w;
    const y1 = (c1 / w) | 0;
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      const sp = this.cellSpeed(y0 * w + x0);
      if (sp <= 0 || sp < minSpeed - 1e-6) return false;
      if (x0 === x1 && y0 === y1) return true;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  smooth(cells, tx, ty) {
    const w = this.nav.w;
    const pts = [];
    let i = 0;
    while (i < cells.length - 1) {
      let minSp = this.cellSpeed(cells[i]);
      let j = i + 1;
      let best = i + 1;
      while (j < cells.length) {
        minSp = Math.min(minSp, this.cellSpeed(cells[j]));
        if (j - i > 40) break;
        if (this.lineClear(cells[i], cells[j], minSp)) best = j;
        j++;
      }
      pts.push(cells[best]);
      i = best;
    }
    const out = pts.map((c) => [((c % w) + 0.5) * CELL, (((c / w) | 0) + 0.5) * CELL]);
    if (out.length) out[out.length - 1] = [tx, ty];
    else out.push([tx, ty]);
    return out;
  }

  // Mark the cells of a path as road.
  markRoad(sx, sy, tx, ty) {
    const path = this.find(sx, sy, tx, ty);
    if (!path) return null;
    const nav = this.nav;
    const pts = [[sx, sy], ...path];
    for (let k = 0; k < pts.length - 1; k++) {
      const [ax, ay] = pts[k];
      const [bx, by] = pts[k + 1];
      const steps = Math.ceil(Math.hypot(bx - ax, by - ay) / (CELL * 0.5));
      for (let s = 0; s <= steps; s++) {
        const t = s / Math.max(1, steps);
        const c = nav.cellAt(ax + (bx - ax) * t, ay + (by - ay) * t);
        if (nav.speed[c] > 0) nav.road[c] = 1;
      }
    }
    return pts;
  }
}
