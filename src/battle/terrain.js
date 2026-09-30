// Battle terrain: heightfield, meshes, vegetation, fortifications.
import * as THREE from 'three';
import { createNoise2D, fbm } from '../core/noise.js';
import { mulberry32 } from '../core/rng.js';
import { clamp, smoothstep } from '../core/util.js';
import { GeoBuilder } from './models.js';
import { groundTextures, stoneTextures, woodTextures, antiTiling } from './textures.js';

// cells of trees whose middle is further from the camera get the lighter
// crowns; cells of grass further than GRASS_NEAR show a share of their tufts
const TREE_NEAR = 70;
const GRASS_NEAR = 60;
const GRASS_FAR_SHARE = 0.35;

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
  material(params, std = this.std) {
    if (std) return new THREE.MeshStandardMaterial({ roughness: 0.95, metalness: 0, ...params });
    // Lambert has no roughness or metalness
    const lambert = { ...params };
    delete lambert.roughness;
    delete lambert.metalness;
    return new THREE.MeshLambertMaterial(lambert);
  }

  build(scene, gfx = {}) {
    this.gfx = gfx;
    this.std = !!gfx.standard;
    const { res, half, pal } = this;
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
      const slope = this.slopeAt(x, z);
      const n = this.noise(x * 0.08, z * 0.08) * 0.5 + 0.5;
      const n2 = this.dirtNoise(x, z);
      c.copy(cGrass).lerp(cGrass2, n);
      if (n2 > 0.72 && this.type !== 'arena') c.lerp(cDirt, Math.min(1, (n2 - 0.72) * 2.5));
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
    const tex = groundTextures(GROUND_KIND[this.type] || 'grass');
    const tile = 3.5;
    tex.map.repeat.set(this.size / tile, this.size / tile);
    tex.normalMap.repeat.copy(tex.map.repeat);
    const mat = this.material({ vertexColors: true, map: tex.map, normalMap: this.std ? tex.normalMap : null, normalScale: new THREE.Vector2(0.8, 0.8) });
    antiTiling(mat);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    this.group.add(mesh);
    this.mesh = mesh;

    // skirt of distant terrain so the edge is not visible
    const far = new THREE.Mesh(new THREE.RingGeometry(half * 0.98, half * 6, 48, 1), this.material({ color: pal.grass2 }));
    far.rotation.x = -Math.PI / 2;
    far.position.y = -0.8;
    this.group.add(far);

    this.buildVegetation();
    this.buildGrass(gfx.grass || 0);
    if (this.fort) this.buildFort();
    if (this.kind === 'arena') this.buildArena();
    scene.add(this.group);
  }

  slopeAt(x, z) {
    const s = this.step;
    const gx = this.heightAt(x + s, z) - this.heightAt(x - s, z);
    const gz = this.heightAt(x, z + s) - this.heightAt(x, z - s);
    return Math.hypot(gx, gz) / (2 * s);
  }

  dirtNoise(x, z) {
    return this.noise(x * 0.3 + 11, z * 0.3) * 0.5 + 0.5;
  }

  // Animate what moves by itself (grass in the wind).
  update(time) {
    if (this.grassTime) this.grassTime.value = time;
  }

  // Trees in the cells far from the camera: the lighter crowns. Grass there:
  // only some of the tufts (they are in no order, so the field thins out).
  lod(camera) {
    const cam = camera.position;
    const d2 = TREE_NEAR * TREE_NEAR;
    for (const t of this.treeLods || []) {
      const near = cam.distanceToSquared(t.center) < d2;
      t.near.visible = near;
      t.far.visible = !near;
    }
    const g2 = GRASS_NEAR * GRASS_NEAR;
    for (const g of this.grassCells || []) {
      g.mesh.count = cam.distanceToSquared(g.center) < g2 ? g.all : Math.ceil(g.all * GRASS_FAR_SHARE);
    }
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
      if (this.fort && Math.abs(x) < 55 && z > -110 && z < 80) return false;
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
    // (farGeo: a lighter model shown in the cells far from the camera, see lod())
    const addInstanced = (geo, mat, list, scaleFn, yOff, colorVar = 0, farGeo = null) => {
      const chunks = new Chunks(50);
      for (const [x, z, s] of list) {
        dummy.position.set(x, this.heightAt(x, z) + yOff * s, z);
        const sc = scaleFn(s);
        dummy.scale.set(sc[0], sc[1], sc[2]);
        dummy.rotation.set((rand() - 0.5) * 0.08, rand() * 6.28, (rand() - 0.5) * 0.08);
        dummy.updateMatrix();
        let col = null;
        if (colorVar) {
          const v = 1 - colorVar + rand() * colorVar * 2;
          col = new THREE.Color().setRGB(v * (0.95 + rand() * 0.1), v, v * (0.9 + rand() * 0.1));
        }
        chunks.add(x, z, dummy.matrix, col);
      }
      for (const m of chunks.meshes(geo, mat)) {
        m.name = 'vegetation';
        m.castShadow = true;
        m.receiveShadow = true;
        this.group.add(m);
        if (!farGeo) continue;
        // the same instances with the lighter model
        const far = new THREE.InstancedMesh(farGeo, mat, m.count);
        far.instanceMatrix = m.instanceMatrix;
        far.instanceColor = m.instanceColor;
        far.boundingSphere = m.boundingSphere;
        far.name = m.name;
        far.castShadow = true;
        far.receiveShadow = true;
        far.visible = false;
        this.group.add(far);
        this.treeLods.push({ near: m, far, center: m.boundingSphere.center });
      }
    };
    this.treeLods = [];
    const dry = this.type === 'steppe' || this.type === 'desert';
    const bark = this.material({ vertexColors: true, roughness: 1 });
    const leaves = this.material({ vertexColors: true, roughness: 0.85 });
    addInstanced(trunkGeo('#5a4028'), bark, trees, (s) => [s, s, s], 0, 0.1);
    const crown = dry ? ['#5f6d33', '#76803d', '#4f5c2a'] : ['#2f5a22', '#3f6a2b', '#4d7832', '#2a4f1f'];
    addInstanced(canopyGeo(crown, 5), leaves, trees, (s) => [s, s * 0.95, s], 4.1, 0.16, canopyGeo(crown, 5, 0));
    addInstanced(trunkGeo('#4a3422', 0.8), bark, pines, (s) => [s * 0.8, s, s * 0.8], 0, 0.1);
    const needles = this.type === 'snow' ? ['#23402f', '#2f4d3c', '#e4ecef'] : ['#1f4230', '#28503a', '#315c43'];
    addInstanced(pineGeo(needles), leaves, pines, (s) => [s, s, s], 0.6, 0.12, pineGeo(needles, 6));
    addInstanced(rockGeo(pal.rock), this.material({ vertexColors: true, roughness: 0.85, flatShading: true }), rocks, (s) => [s * 1.3, s * 0.8, s], 0.15, 0.12);
    for (const [x, z, s] of trees) this.obstacles.push({ x, z, r: 0.35 * s });
    for (const [x, z, s] of pines) this.obstacles.push({ x, z, r: 0.3 * s });
    for (const [x, z, s] of rocks) this.obstacles.push({ x, z, r: 1.0 * s });
  }

  // Instanced tufts of grass that sway in the wind.
  buildGrass(count) {
    const gc = GRASS[this.type];
    if (!gc || count <= 0) return;
    const rand = mulberry32(99);
    const geo = grassClumpGeo(gc, rand);
    const mat = this.material({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.9 });
    const time = { value: 0 };
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = time;
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uTime;')
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
          #ifdef USE_INSTANCING
            vec3 ip = vec3( instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2] );
          #else
            vec3 ip = vec3( 0.0 );
          #endif
          float sway = sin( uTime * 1.6 + ip.x * 0.21 + ip.z * 0.17 ) * 0.6 + sin( uTime * 2.9 + ip.x * 0.7 - ip.z * 0.4 ) * 0.25;
          float bend = transformed.y * transformed.y;
          transformed.x += sway * bend * 0.45;
          transformed.z += sway * bend * 0.2;`,
        );
    };
    mat.customProgramCacheKey = () => 'grass';
    this.grassTime = time;
    const dummy = new THREE.Object3D();
    const tint = new THREE.Color();
    const chunks = new Chunks(40);
    let n = 0;
    const R = Math.min(this.half - 4, 125);
    for (let tries = 0; tries < count * 4 && n < count; tries++) {
      // denser in the middle of the field where the fighting happens
      const r = R * Math.sqrt(rand()) * (rand() < 0.6 ? 0.75 : 1);
      const a = rand() * Math.PI * 2;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      if (this.dirtNoise(x, z) > 0.74 - gc.sparse * 0.2) continue;
      if (this.noise(x * 0.05 - 7, z * 0.05 + 3) < -0.35 + gc.sparse) continue;
      if (this.slopeAt(x, z) > 0.45) continue;
      if (this.fort && (this.level(x, z) !== 0 || (Math.abs(x) < 8 && z > -40 && z < -5))) continue;
      dummy.position.set(x, this.heightAt(x, z) - 0.02, z);
      dummy.rotation.set(0, rand() * 6.28, 0);
      const sc = 0.75 + rand() * 0.6;
      dummy.scale.set(sc, sc * (0.8 + rand() * 0.5), sc);
      dummy.updateMatrix();
      const v = 0.85 + rand() * 0.3;
      tint.setRGB(v * (0.95 + rand() * 0.12), v, v * 0.95);
      chunks.add(x, z, dummy.matrix, tint);
      n++;
    }
    this.grassCells = [];
    for (const mesh of chunks.meshes(geo, mat)) {
      mesh.receiveShadow = true;
      mesh.castShadow = false;
      this.group.add(mesh);
      this.grassCells.push({ mesh, center: mesh.boundingSphere.center, all: mesh.count });
    }
  }

  buildFort() {
    const f = this.fort;
    const stoneTex = stoneTextures();
    const woodTex = woodTextures();
    const stone = this.material({ color: '#b3ada2', map: stoneTex.map, normalMap: this.std ? stoneTex.normalMap : null, roughness: 0.9 });
    const dark = this.material({ color: '#948d82', map: stoneTex.map, normalMap: this.std ? stoneTex.normalMap : null, roughness: 0.95 });
    const wood = this.material({ color: '#b08a60', map: woodTex.map, normalMap: this.std ? woodTex.normalMap : null, roughness: 0.85 });
    const H = f.height;
    const wallH = 1.3;
    const addBox = (w, hh, d, x, y, z, mat = stone, tile = 3) => {
      const g = new THREE.BoxGeometry(w, hh, d);
      boxUV(g, w, hh, d, tile);
      const m = new THREE.Mesh(g, mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      this.group.add(m);
      return m;
    };
    // outer cliff faces (masonry)
    const faceH = H - this.heightAt(0, -30) + 2;
    addBox(f.x1 - f.x0 + 1, faceH, 1, (f.x0 + f.x1) / 2, H - faceH / 2, f.z1 + 0.3, dark, 4);
    addBox(f.x1 - f.x0 + 1, faceH, 1, (f.x0 + f.x1) / 2, H - faceH / 2, f.z0 - 0.3, dark, 4);
    addBox(1, faceH, f.z1 - f.z0 + 1, f.x0 - 0.3, H - faceH / 2, (f.z0 + f.z1) / 2, dark, 4);
    addBox(1, faceH, f.z1 - f.z0 + 1, f.x1 + 0.3, H - faceH / 2, (f.z0 + f.z1) / 2, dark, 4);
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
    const roof = new THREE.Mesh(new THREE.ConeGeometry(8.6, 5, 4), this.material({ color: '#7d3326', roughness: 0.8, flatShading: true }));
    roof.position.set(0, H + 12.5, f.z0 + 9);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    this.group.add(roof);
    this.obstacles.push({ x: 0, z: f.z0 + 9, r: 6.5 });
    // siege ramp planks
    const len = Math.hypot(f.rampZ1 - f.z1, H - this.heightAt(f.rampX, f.rampZ1));
    const rampGeo = new THREE.BoxGeometry(f.rampW + 0.6, 0.25, len);
    boxUV(rampGeo, f.rampW + 0.6, 0.25, len, 2.5);
    const ramp = new THREE.Mesh(rampGeo, wood);
    const midZ = (f.z1 + f.rampZ1) / 2;
    ramp.position.set(f.rampX, (H + this.heightAt(f.rampX, f.rampZ1)) / 2 - 0.05, midZ);
    ramp.rotation.x = Math.atan2(H - this.heightAt(f.rampX, f.rampZ1), f.rampZ1 - f.z1);
    ramp.receiveShadow = true;
    ramp.castShadow = true;
    this.group.add(ramp);
    for (const sx of [-1, 1]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, len), wood);
      rail.position.copy(ramp.position);
      rail.position.x += sx * (f.rampW / 2 + 0.3);
      rail.position.y += 0.4;
      rail.rotation.x = ramp.rotation.x;
      rail.castShadow = true;
      this.group.add(rail);
    }
    // banners
    this.bannerSpots = [[f.x0, H + 7, f.z1], [f.x1, H + 7, f.z1], [0, H + 15, f.z0 + 9]];
  }

  buildArena() {
    const woodTex = woodTextures();
    const wood = this.material({ color: '#8f6a45', map: woodTex.map, normalMap: this.std ? woodTex.normalMap : null });
    const standA = this.material({ color: '#a48058', map: woodTex.map });
    const standB = this.material({ color: '#8f6a45', map: woodTex.map });
    const R = 25;
    const n = 48;
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2;
      const fg = new THREE.BoxGeometry(3.4, 2.2, 0.3);
      boxUV(fg, 3.4, 2.2, 0.3, 2);
      const m = new THREE.Mesh(fg, wood);
      m.position.set(Math.cos(a) * R, 1.1, Math.sin(a) * R);
      m.rotation.y = -a + Math.PI / 2;
      m.castShadow = true;
      m.receiveShadow = true;
      this.group.add(m);
      // stands
      const sg = new THREE.BoxGeometry(3.6, 1, 4);
      boxUV(sg, 3.6, 1, 4, 2);
      const s = new THREE.Mesh(sg, k % 2 ? standA : standB);
      s.position.set(Math.cos(a) * (R + 4), 0.5 + (k % 3) * 0.1, Math.sin(a) * (R + 4));
      s.rotation.y = -a + Math.PI / 2;
      s.receiveShadow = true;
      this.group.add(s);
    }
    this.arenaR = R - 0.8;
  }
}

// ---------------------------------------------------------------------------
// Geometry helpers for scenery
// ---------------------------------------------------------------------------

const GROUND_KIND = { plains: 'grass', forest: 'grass', steppe: 'steppe', desert: 'sand', snow: 'snow', taiga: 'grass', hills: 'grass', arena: 'sand' };

// grass blade colours per battlefield type; `sparse` thins the cover
const GRASS = {
  plains: { base: '#2f4f1c', tip: '#8fb152', sparse: 0 },
  forest: { base: '#284418', tip: '#78a044', sparse: 0.05 },
  hills: { base: '#34501f', tip: '#94ad55', sparse: 0.1 },
  steppe: { base: '#6b6231', tip: '#d4c47c', sparse: 0.05 },
  taiga: { base: '#2c4424', tip: '#7f9a58', sparse: 0.25 },
  snow: { base: '#6f7262', tip: '#c9cbb4', sparse: 0.45 },
};

// Instances grouped into square cells of the map, one InstancedMesh per cell,
// so that cells outside the view (or outside the sun's shadow box) are culled.
class Chunks {
  constructor(size) {
    this.size = size;
    this.cells = new Map();
  }

  add(x, z, matrix, color) {
    const key = `${Math.floor(x / this.size)},${Math.floor(z / this.size)}`;
    let c = this.cells.get(key);
    if (!c) this.cells.set(key, (c = []));
    c.push([matrix.clone(), color ? color.clone() : null]);
  }

  meshes(geo, mat) {
    const out = [];
    for (const items of this.cells.values()) {
      const m = new THREE.InstancedMesh(geo, mat, items.length);
      items.forEach(([matrix, color], k) => {
        m.setMatrixAt(k, matrix);
        if (color) m.setColorAt(k, color);
      });
      m.computeBoundingSphere();
      out.push(m);
    }
    return out;
  }
}

// Scale box UVs so textures keep a constant world size (`tile` metres).
function boxUV(geo, w, h, d, tile) {
  const uv = geo.attributes.uv;
  // BoxGeometry faces: +x, -x, +y, -y, +z, -z (4 vertices each)
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let face = 0; face < 6; face++) {
    const [su, sv] = dims[face];
    for (let i = 0; i < 4; i++) {
      const k = face * 4 + i;
      uv.setXY(k, (uv.getX(k) * su) / tile, (uv.getY(k) * sv) / tile);
    }
  }
  uv.needsUpdate = true;
}

function jitter(geo, amount, seed) {
  const rand = mulberry32(seed);
  const p = geo.attributes.position;
  const seen = new Map();
  for (let i = 0; i < p.count; i++) {
    const key = `${p.getX(i).toFixed(3)},${p.getY(i).toFixed(3)},${p.getZ(i).toFixed(3)}`;
    let off = seen.get(key);
    if (!off) {
      off = [(rand() - 0.5) * amount, (rand() - 0.5) * amount, (rand() - 0.5) * amount];
      seen.set(key, off);
    }
    p.setXYZ(i, p.getX(i) + off[0], p.getY(i) + off[1], p.getZ(i) + off[2]);
  }
  return geo;
}

function trunkGeo(color, scale = 1) {
  const b = new GeoBuilder();
  b.cyl(0.14 * scale, 0.3 * scale, 3.4, 8, color, [0, 1.7, 0]);
  b.cyl(0.05, 0.1, 1.4, 5, color, [0.45, 2.8, 0], [0, 0, -0.9]);
  b.cyl(0.05, 0.09, 1.2, 5, color, [-0.35, 3.1, 0.2], [0.3, 0, 0.8]);
  // roots
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    b.box(0.16, 0.16, 0.7, color, [Math.cos(a) * 0.3, 0.05, Math.sin(a) * 0.3], [0, -a + Math.PI / 2, 0]);
  }
  return b.build();
}

// Broadleaf crown: a core plus clusters of leaves around it (`detail` 0: the
// same crown, coarser, for far away).
function canopyGeo(colors, seed, detail = 1) {
  const b = new GeoBuilder();
  const rand = mulberry32(seed);
  b.add(jitter(new THREE.IcosahedronGeometry(1.75, detail), 0.5, seed), colors[0], [0, 0, 0]);
  const n = 11;
  for (let i = 0; i < n; i++) {
    // spread the clusters evenly over an ellipsoid, a bit more on top
    const u = 1 - ((i + 0.5) / n) * 1.7;
    const a = i * 2.39996 + rand() * 0.5;
    const rr = Math.sqrt(Math.max(0, 1 - u * u));
    const dist = 1.35 + rand() * 0.5;
    const r = 0.8 + rand() * 0.45;
    const g = jitter(new THREE.IcosahedronGeometry(r, detail), r * 0.32, Math.floor(rand() * 1e6));
    b.add(g, colors[Math.floor(rand() * colors.length)], [Math.cos(a) * rr * dist * 1.12, u * dist * 0.85 + 0.2, Math.sin(a) * rr * dist * 1.12]);
  }
  return foliage(b.build(), (p, out) => out.set(p.x, p.y - 0.1, p.z), 2.9, -2, 2.6, 0.55, 1.12);
}

function pineGeo(colors, segments = 11) {
  const b = new GeoBuilder();
  const tiers = [[2.1, 2.4, 1.6], [1.75, 2.2, 2.6], [1.45, 2.0, 3.5], [1.1, 1.8, 4.35], [0.75, 1.6, 5.1], [0.4, 1.2, 5.8]];
  tiers.forEach(([r, h, y], i) => {
    // drooping tier: the rim hangs lower than a plain cone
    const g = jitter(new THREE.ConeGeometry(r, h, segments, 2), 0.2, 31 + i);
    const p = g.attributes.position;
    for (let k = 0; k < p.count; k++) {
      const rad = Math.hypot(p.getX(k), p.getZ(k)) / r;
      p.setY(k, p.getY(k) - rad * rad * 0.35);
    }
    b.add(g, colors[i % 2], [0, y, 0], [0, i * 0.5, 0]);
    if (colors[2] && i % 2 === 0) b.add(new THREE.ConeGeometry(r * 0.55, h * 0.35, segments), colors[2], [0, y + h * 0.33, 0]);
  });
  // normals lean outwards and up like a cone, so the tree is lit softly
  return foliage(b.build(), (p, out) => out.set(p.x, Math.hypot(p.x, p.z) * 0.7, p.z), 0, 0.5, 6, 0.55, 1.12);
}

// Soft lighting for foliage: normals mostly follow the overall shape of the
// crown (given by `shapeNormal`) instead of every facet, and vertices deep
// inside or low in the crown are darkened (fake ambient occlusion).
const _fn = new THREE.Vector3();
const _fp = new THREE.Vector3();
function foliage(geo, shapeNormal, radius, y0, y1, lo, hi) {
  geo.computeVertexNormals();
  const p = geo.attributes.position;
  const nr = geo.attributes.normal;
  const c = geo.attributes.color;
  for (let i = 0; i < p.count; i++) {
    _fp.set(p.getX(i), p.getY(i), p.getZ(i));
    shapeNormal(_fp, _fn);
    if (_fn.lengthSq() < 1e-6) _fn.set(0, 1, 0);
    _fn.normalize().multiplyScalar(0.8);
    _fn.x += nr.getX(i) * 0.2;
    _fn.y += nr.getY(i) * 0.2;
    _fn.z += nr.getZ(i) * 0.2;
    _fn.normalize();
    nr.setXYZ(i, _fn.x, _fn.y, _fn.z);
    let f = lo + (hi - lo) * smoothstep(y0, y1, _fp.y);
    if (radius) f *= 0.62 + 0.38 * smoothstep(0.35, 0.95, _fp.length() / radius);
    c.setXYZ(i, c.getX(i) * f, c.getY(i) * f, c.getZ(i) * f);
  }
  return geo;
}

function rockGeo(color) {
  const g = jitter(new THREE.IcosahedronGeometry(1, 1), 0.35, 7);
  const b = new GeoBuilder();
  b.add(g, color, [0, 0, 0]);
  return shadeByHeight(b.build(), -1, 1, 0.75, 1.15);
}

// Darken the lower part of a vertex coloured geometry (fake ambient occlusion).
function shadeByHeight(geo, y0, y1, lo, hi) {
  const p = geo.attributes.position;
  const c = geo.attributes.color;
  for (let i = 0; i < p.count; i++) {
    const t = smoothstep(y0, y1, p.getY(i));
    const f = lo + (hi - lo) * t;
    c.setXYZ(i, c.getX(i) * f, c.getY(i) * f, c.getZ(i) * f);
  }
  geo.computeVertexNormals();
  return geo;
}

function grassClumpGeo(gc, rand) {
  const pos = [];
  const col = [];
  const nrm = [];
  const base = new THREE.Color(gc.base);
  const tip = new THREE.Color(gc.tip);
  const mid = base.clone().lerp(tip, 0.55);
  const blades = 9;
  for (let b = 0; b < blades; b++) {
    const ang = rand() * Math.PI * 2;
    const ox = (rand() - 0.5) * 0.5;
    const oz = (rand() - 0.5) * 0.5;
    const h = 0.28 + rand() * 0.38;
    const w = 0.028 + rand() * 0.02;
    const lean = (rand() - 0.2) * 0.22;
    const ca = Math.cos(ang);
    const sa = Math.sin(ang);
    // blade in local (u across, y up, v lean) coordinates
    const P = (u, y, v) => [ox + u * ca - v * sa, y, oz + u * sa + v * ca];
    const bl = P(-w, 0, 0);
    const br = P(w, 0, 0);
    const ml = P(-w * 0.7, h * 0.55, lean * 0.4);
    const mr = P(w * 0.7, h * 0.55, lean * 0.4);
    const tp = P(0, h, lean);
    const tris = [[bl, br, mr], [bl, mr, ml], [ml, mr, tp]];
    const cols = [[base, base, mid], [base, mid, mid], [mid, mid, tip]];
    tris.forEach((t, i) => {
      for (let k = 0; k < 3; k++) {
        pos.push(...t[k]);
        nrm.push(0, 1, 0);
        const cc = cols[i][k];
        col.push(cc.r, cc.g, cc.b);
      }
    });
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.computeBoundingSphere();
  return g;
}
