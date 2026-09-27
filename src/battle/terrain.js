// Battle terrain: heightfield, meshes, vegetation, fortifications.
import * as THREE from 'three';
import { createNoise2D, fbm } from '../core/noise.js';
import { mulberry32 } from '../core/rng.js';
import { clamp, smoothstep } from '../core/util.js';

const PALETTES = {
  plains: { grass: '#6f9a46', grass2: '#8aab55', dirt: '#8c7650', rock: '#7d7870', trees: 0.004, pines: 0.0005, rocks: 0.0008, relief: 4, sky: ['#8fbfe6', '#dfe9ef'], fog: '#c9d8e0' },
  forest: { grass: '#557f3a', grass2: '#6b8f45', dirt: '#6f5a3c', rock: '#6f6b64', trees: 0.02, pines: 0.004, rocks: 0.0008, relief: 5, sky: ['#86b4d8', '#d6e3e8'], fog: '#b9cbc8' },
  steppe: { grass: '#b3a45e', grass2: '#c4b46c', dirt: '#9c8456', rock: '#8e8272', trees: 0.0006, pines: 0, rocks: 0.0006, relief: 2.5, sky: ['#9cc8ec', '#f0e8d4'], fog: '#e2dcc8' },
  desert: { grass: '#d2b882', grass2: '#dcc493', dirt: '#b99a64', rock: '#a08a6a', trees: 0.0002, pines: 0, rocks: 0.0012, relief: 3, sky: ['#a6cdee', '#f3e8cf'], fog: '#eadfc6' },
  snow: { grass: '#e4eaee', grass2: '#d2dce2', dirt: '#b0b4b0', rock: '#8a8e92', trees: 0.0006, pines: 0.006, rocks: 0.001, relief: 5, sky: ['#a9c3dc', '#e8eef2'], fog: '#dfe7ee' },
  taiga: { grass: '#5d7a55', grass2: '#dfe6ea', dirt: '#6d6450', rock: '#707478', trees: 0.001, pines: 0.02, rocks: 0.001, relief: 5, sky: ['#96b4cf', '#dbe4ea'], fog: '#c8d4dc' },
  hills: { grass: '#7a8f4e', grass2: '#8f9a5a', dirt: '#86735a', rock: '#7c7770', trees: 0.003, pines: 0.003, rocks: 0.004, relief: 11, sky: ['#8fb9e0', '#dfe6ea'], fog: '#c8d3d8' },
  arena: { grass: '#c9b07a', grass2: '#bfa36a', dirt: '#b0935a', rock: '#8a7a60', trees: 0, pines: 0, rocks: 0, relief: 0, sky: ['#8fbfe6', '#e9e2cf'], fog: '#e0d6c0' },
};

export class BattleTerrain {
  constructor(kind, type, seed = (Math.random() * 1e9) | 0) {
    this.kind = kind; // field | siege | arena
    this.type = PALETTES[type] ? type : 'plains';
    this.pal = PALETTES[this.type];
    this.size = kind === 'arena' ? 70 : 260;
    this.half = this.size / 2;
    this.res = kind === 'arena' ? 36 : 131;
    this.step = this.size / (this.res - 1);
    this.h = new Float32Array(this.res * this.res);
    this.rand = mulberry32(seed);
    this.noise = createNoise2D(seed);
    this.obstacles = []; // {x, z, r}
    this.group = new THREE.Group();
    this.fort = null;
    this.generate();
  }

  idx(i, j) {
    return j * this.res + i;
  }

  generate() {
    const { res, step, half, pal } = this;
    for (let j = 0; j < res; j++) {
      for (let i = 0; i < res; i++) {
        const x = -half + i * step;
        const z = -half + j * step;
        let hgt = 0;
        if (this.kind !== 'arena') {
          hgt = fbm(this.noise, x * 0.012, z * 0.012, 4) * pal.relief;
          // gentle flattening of the central battlefield
          const c = smoothstep(40, 120, Math.hypot(x, z));
          hgt *= 0.55 + 0.45 * c;
          hgt += c * fbm(this.noise, x * 0.02 + 7, z * 0.02 - 3, 3) * pal.relief * 0.8;
        }
        this.h[this.idx(i, j)] = hgt;
      }
    }
    if (this.kind === 'siege') this.buildFortHeights();
  }

  // ---- siege fortress on a raised plateau with a single ramp -------------------
  buildFortHeights() {
    const fort = {
      x0: -34,
      x1: 34,
      z0: -92,
      z1: -38,
      height: 0,
      rampX: 0,
      rampW: 5,
      rampZ0: -38, // top of the ramp (at the wall)
      rampZ1: -12, // foot of the ramp
    };
    // plateau height = local ground + 7
    const base = this.rawHeight(0, -60);
    fort.height = base + 7.5;
    for (let j = 0; j < this.res; j++) {
      for (let i = 0; i < this.res; i++) {
        const x = -this.half + i * this.step;
        const z = -this.half + j * this.step;
        const k = this.idx(i, j);
        const inside = x >= fort.x0 && x <= fort.x1 && z >= fort.z0 && z <= fort.z1;
        if (inside) this.h[k] = fort.height;
        // ramp
        if (Math.abs(x - fort.rampX) <= fort.rampW / 2 + 0.01 && z > fort.z1 && z <= fort.rampZ1) {
          const t = (z - fort.z1) / (fort.rampZ1 - fort.z1);
          const ground = this.h[k];
          this.h[k] = fort.height + (ground - fort.height) * t;
        }
      }
    }
    this.fort = fort;
  }

  rawHeight(x, z) {
    const fi = clamp((x + this.half) / this.step, 0, this.res - 1.001);
    const fj = clamp((z + this.half) / this.step, 0, this.res - 1.001);
    const i = Math.floor(fi);
    const j = Math.floor(fj);
    const u = fi - i;
    const v = fj - j;
    const h00 = this.h[this.idx(i, j)];
    const h10 = this.h[this.idx(i + 1, j)];
    const h01 = this.h[this.idx(i, j + 1)];
    const h11 = this.h[this.idx(i + 1, j + 1)];
    return (h00 * (1 - u) + h10 * u) * (1 - v) + (h01 * (1 - u) + h11 * u) * v;
  }

  heightAt(x, z) {
    return this.rawHeight(x, z);
  }

  // Does a point hit one of the fortress walls (used for missiles)?
  hitsWall(x, y, z) {
    if (!this.walls) return false;
    for (const w of this.walls) if (x >= w.x0 && x <= w.x1 && z >= w.z0 && z <= w.z1 && y <= w.top) return true;
    return false;
  }

  // 0 = ground, 1 = fortress plateau, 0.5 = ramp
  level(x, z) {
    const f = this.fort;
    if (!f) return 0;
    if (x >= f.x0 - 0.5 && x <= f.x1 + 0.5 && z >= f.z0 - 0.5 && z <= f.z1 + 0.3) return 1;
    if (Math.abs(x - f.rampX) <= f.rampW / 2 + 0.6 && z > f.z1 && z <= f.rampZ1 + 1) return 0.5;
    return 0;
  }

  // Is it OK to step from (x0,z0) to (x1,z1)?
  walkable(x0, z0, x1, z1) {
    const lim = this.size / 2 - 2;
    if (Math.abs(x1) > lim || Math.abs(z1) > lim) return false;
    const h0 = this.heightAt(x0, z0);
    const h1 = this.heightAt(x1, z1);
    const d = Math.hypot(x1 - x0, z1 - z0) || 1e-3;
    if (Math.abs(h1 - h0) / d > 1.25) return false;
    if (this.fort) {
      // walls: cannot cross the plateau border except through the ramp
      const la = this.level(x0, z0);
      const lb = this.level(x1, z1);
      if ((la === 1 && lb === 0) || (la === 0 && lb === 1)) return false;
      if (la === 0.5 && lb === 0 && z1 < this.fort.rampZ1 - 0.5) return false;
      if (la === 0 && lb === 0.5 && z1 < this.fort.rampZ1 - 0.5) return false;
    }
    return true;
  }

  // Waypoint to walk to when heading from a to b across levels (siege).
  waypoint(ax, az, bx, bz) {
    const f = this.fort;
    if (!f) return null;
    const la = this.level(ax, az);
    const lb = this.level(bx, bz);
    if (la === lb) return null;
    const bottom = [f.rampX, f.rampZ1 + 3];
    const foot = [f.rampX, f.rampZ1 - 1.5];
    const top = [f.rampX, f.z1 - 3];
    const upper = [f.rampX, f.z1 + 1.5];
    const near = (p) => Math.hypot(ax - p[0], az - p[1]) < 2.5;
    if (lb > la) {
      if (la === 0) return near(bottom) ? foot : bottom;
      return top;
    }
    if (la === 1) return near(top) ? upper : top;
    return bottom;
  }

  // ---- meshes -------------------------------------------------------------------------
  build(scene) {
    const { res, step, half, pal } = this;
    const geo = new THREE.PlaneGeometry(this.size, this.size, res - 1, res - 1);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const cGrass = new THREE.Color(pal.grass);
    const cGrass2 = new THREE.Color(pal.grass2);
    const cDirt = new THREE.Color(pal.dirt);
    const cRock = new THREE.Color(pal.rock);
    const cStone = new THREE.Color('#8f8a82');
    const cWood = new THREE.Color('#7a5a36');
    const c = new THREE.Color();
    for (let k = 0; k < pos.count; k++) {
      const x = pos.getX(k);
      const z = pos.getZ(k);
      const hgt = this.heightAt(x, z);
      pos.setY(k, hgt);
      const gx = this.heightAt(x + step, z) - this.heightAt(x - step, z);
      const gz = this.heightAt(x, z + step) - this.heightAt(x, z - step);
      const slope = Math.hypot(gx, gz) / (2 * step);
      const n = this.noise(x * 0.08, z * 0.08) * 0.5 + 0.5;
      const n2 = this.noise(x * 0.3 + 11, z * 0.3) * 0.5 + 0.5;
      c.copy(cGrass).lerp(cGrass2, n);
      if (n2 > 0.72 && this.type !== 'arena') c.lerp(cDirt, (n2 - 0.72) * 2);
      c.lerp(cRock, smoothstep(0.35, 0.9, slope));
      if (this.fort) {
        const lv = this.level(x, z);
        if (lv === 1) c.copy(cStone).lerp(cDirt, n * 0.5);
        else if (lv === 0.5) c.copy(cWood);
        else if (slope > 1) c.copy(cStone);
      }
      if (this.type === 'arena') {
        const r = Math.hypot(x, z);
        if (r > 25) c.copy(cGrass2).multiplyScalar(0.8);
      }
      const shade = 0.92 + n2 * 0.12;
      colors[k * 3] = c.r * shade;
      colors[k * 3 + 1] = c.g * shade;
      colors[k * 3 + 2] = c.b * shade;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    this.group.add(mesh);
    this.mesh = mesh;

    // skirt of distant terrain so the edge is not visible
    const far = new THREE.Mesh(new THREE.RingGeometry(half * 0.98, half * 6, 48, 1), new THREE.MeshLambertMaterial({ color: pal.grass2 }));
    far.rotation.x = -Math.PI / 2;
    far.position.y = -0.8;
    this.group.add(far);

    this.buildVegetation();
    if (this.fort) this.buildFort();
    if (this.kind === 'arena') this.buildArena();
    scene.add(this.group);
  }

  buildVegetation() {
    const { half, pal } = this;
    const rand = this.rand;
    const trees = [];
    const pines = [];
    const rocks = [];
    const area = this.size * this.size;
    const clear = (x, z) => {
      // keep spawn areas and the centre mostly clear
      if (Math.abs(x) < 70 && Math.abs(z) > 55 && Math.abs(z) < 100) return false;
      if (this.fort && this.level(x, z) !== 0) return false;
      if (this.fort && Math.abs(x) < 45 && z < -5 && z > -110) return false;
      return true;
    };
    const place = (arr, n, minR) => {
      for (let k = 0; k < n; k++) {
        const x = (rand() * 2 - 1) * (half - 3);
        const z = (rand() * 2 - 1) * (half - 3);
        const central = Math.hypot(x, z) < 45;
        if (central && rand() < 0.75) continue;
        if (!clear(x, z)) continue;
        arr.push([x, z, minR + rand() * 0.6]);
      }
    };
    place(trees, Math.round(area * pal.trees), 0.8);
    place(pines, Math.round(area * pal.pines), 0.7);
    place(rocks, Math.round(area * pal.rocks), 0.6);

    const dummy = new THREE.Object3D();
    const addInstanced = (geo, color, list, scaleFn, yOff) => {
      if (!list.length) return;
      const m = new THREE.InstancedMesh(geo, new THREE.MeshLambertMaterial({ color }), list.length);
      list.forEach(([x, z, s], k) => {
        dummy.position.set(x, this.heightAt(x, z) + yOff * s, z);
        const sc = scaleFn(s);
        dummy.scale.set(sc[0], sc[1], sc[2]);
        dummy.rotation.set(0, rand() * 6.28, 0);
        dummy.updateMatrix();
        m.setMatrixAt(k, dummy.matrix);
      });
      m.castShadow = true;
      m.receiveShadow = true;
      this.group.add(m);
    };
    const trunk = new THREE.CylinderGeometry(0.18, 0.28, 3, 6);
    addInstanced(trunk, '#5a4028', trees, (s) => [s, s, s], 1.5);
    addInstanced(new THREE.IcosahedronGeometry(2.2, 0), this.type === 'steppe' || this.type === 'desert' ? '#7a8a44' : '#4f7a35', trees, (s) => [s, s * 0.9, s], 4.2);
    addInstanced(trunk, '#4a3422', pines, (s) => [s * 0.8, s, s * 0.8], 1.5);
    addInstanced(new THREE.ConeGeometry(1.9, 6.5, 7), this.type === 'snow' ? '#3d5c4a' : '#2f5a3e', pines, (s) => [s, s, s], 5.4);
    addInstanced(new THREE.DodecahedronGeometry(1, 0), pal.rock, rocks, (s) => [s * 1.3, s * 0.8, s], 0.3);
    for (const [x, z, s] of trees) this.obstacles.push({ x, z, r: 0.35 * s });
    for (const [x, z, s] of pines) this.obstacles.push({ x, z, r: 0.3 * s });
    for (const [x, z, s] of rocks) this.obstacles.push({ x, z, r: 1.0 * s });
    // grass tufts for texture (no collision)
    if (this.type !== 'arena' && this.type !== 'desert') {
      const tufts = [];
      for (let k = 0; k < 900; k++) tufts.push([(rand() * 2 - 1) * (half - 2), (rand() * 2 - 1) * (half - 2), 0.5 + rand() * 0.5]);
      const col = this.type === 'snow' ? '#b9c7c0' : this.type === 'steppe' ? '#a89a55' : '#4f7f35';
      addInstanced(new THREE.ConeGeometry(0.25, 0.6, 4), col, tufts.filter(([x, z]) => !this.fort || this.level(x, z) === 0), (s) => [s, s, s], 0.25);
    }
  }

  buildFort() {
    const f = this.fort;
    const stone = new THREE.MeshLambertMaterial({ color: '#9a948a' });
    const dark = new THREE.MeshLambertMaterial({ color: '#7d776e' });
    const wood = new THREE.MeshLambertMaterial({ color: '#7a5a36' });
    const H = f.height;
    const wallH = 1.3;
    const addBox = (w, hh, d, x, y, z, mat = stone) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      this.group.add(m);
      return m;
    };
    // outer cliff faces (masonry)
    const faceH = H - this.heightAt(0, -30) + 2;
    addBox(f.x1 - f.x0 + 1, faceH, 1, (f.x0 + f.x1) / 2, H - faceH / 2, f.z1 + 0.3, dark);
    addBox(f.x1 - f.x0 + 1, faceH, 1, (f.x0 + f.x1) / 2, H - faceH / 2, f.z0 - 0.3, dark);
    addBox(1, faceH, f.z1 - f.z0 + 1, f.x0 - 0.3, H - faceH / 2, (f.z0 + f.z1) / 2, dark);
    addBox(1, faceH, f.z1 - f.z0 + 1, f.x1 + 0.3, H - faceH / 2, (f.z0 + f.z1) / 2, dark);
    // parapet with crenellations along the front (except the ramp gap)
    const gap = f.rampW / 2 + 0.5;
    this.walls = [];
    const seg = (xa, xb, z) => {
      const w = xb - xa;
      if (w <= 0) return;
      this.walls.push({ x0: xa, x1: xb, z0: z - 0.35, z1: z + 0.35, top: H + wallH + 0.3 });
      addBox(w, wallH, 0.6, (xa + xb) / 2, H + wallH / 2, z);
      for (let x = xa + 0.5; x < xb - 0.3; x += 1.6) addBox(0.8, 0.6, 0.6, x + 0.4, H + wallH + 0.3, z);
    };
    seg(f.x0, f.rampX - gap, f.z1 - 0.2);
    seg(f.rampX + gap, f.x1, f.z1 - 0.2);
    this.walls.push({ x0: f.x0 - 0.2, x1: f.x0 + 0.6, z0: f.z0, z1: f.z1, top: H + wallH });
    this.walls.push({ x0: f.x1 - 0.6, x1: f.x1 + 0.2, z0: f.z0, z1: f.z1, top: H + wallH });
    // side and back walls
    addBox(0.6, wallH, f.z1 - f.z0, f.x0 + 0.2, H + wallH / 2, (f.z0 + f.z1) / 2);
    addBox(0.6, wallH, f.z1 - f.z0, f.x1 - 0.2, H + wallH / 2, (f.z0 + f.z1) / 2);
    addBox(f.x1 - f.x0, wallH * 2, 0.6, (f.x0 + f.x1) / 2, H + wallH, f.z0 + 0.2);
    // corner towers
    for (const [x, z] of [[f.x0, f.z1], [f.x1, f.z1], [f.x0, f.z0], [f.x1, f.z0]]) {
      addBox(4, 6, 4, x, H + 3, z);
      for (const [dx, dz] of [[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]]) addBox(0.9, 0.8, 0.9, x + dx, H + 6.4, z + dz);
      this.obstacles.push({ x, z, r: 2.4 });
    }
    // keep in the back
    addBox(12, 10, 10, 0, H + 5, f.z0 + 9);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(8.6, 5, 4), new THREE.MeshLambertMaterial({ color: '#7d3326' }));
    roof.position.set(0, H + 12.5, f.z0 + 9);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    this.group.add(roof);
    this.obstacles.push({ x: 0, z: f.z0 + 9, r: 6.5 });
    // siege ramp planks
    const len = Math.hypot(f.rampZ1 - f.z1, H - this.heightAt(f.rampX, f.rampZ1));
    const ramp = new THREE.Mesh(new THREE.BoxGeometry(f.rampW + 0.6, 0.25, len), wood);
    const midZ = (f.z1 + f.rampZ1) / 2;
    ramp.position.set(f.rampX, (H + this.heightAt(f.rampX, f.rampZ1)) / 2 - 0.05, midZ);
    ramp.rotation.x = Math.atan2(H - this.heightAt(f.rampX, f.rampZ1), f.rampZ1 - f.z1);
    ramp.receiveShadow = true;
    this.group.add(ramp);
    for (const sx of [-1, 1]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, len), wood);
      rail.position.copy(ramp.position);
      rail.position.x += sx * (f.rampW / 2 + 0.3);
      rail.position.y += 0.4;
      rail.rotation.x = ramp.rotation.x;
      this.group.add(rail);
    }
    // banners
    this.bannerSpots = [[f.x0, H + 7, f.z1], [f.x1, H + 7, f.z1], [0, H + 15, f.z0 + 9]];
  }

  buildArena() {
    const wood = new THREE.MeshLambertMaterial({ color: '#6b4a2a' });
    const R = 25;
    const n = 48;
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2;
      const m = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.2, 0.3), wood);
      m.position.set(Math.cos(a) * R, 1.1, Math.sin(a) * R);
      m.rotation.y = -a + Math.PI / 2;
      m.castShadow = true;
      this.group.add(m);
      // stands
      const s = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1, 4), new THREE.MeshLambertMaterial({ color: k % 2 ? '#8a6a42' : '#7a5a36' }));
      s.position.set(Math.cos(a) * (R + 4), 0.5 + (k % 3) * 0.1, Math.sin(a) * (R + 4));
      s.rotation.y = -a + Math.PI / 2;
      this.group.add(s);
    }
    this.arenaR = R - 0.8;
  }
}
