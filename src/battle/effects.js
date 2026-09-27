// Cheap particle effects: blood on hits, sparks on blocks, dust on impacts.
import * as THREE from 'three';

const MAX = 600;

const KINDS = {
  blood: { color: [0.55, 0.04, 0.03], n: 9, speed: 2.2, up: 1.2, life: 0.55, size: 1 },
  spark: { color: [1.0, 0.85, 0.45], n: 10, speed: 3.5, up: 1.5, life: 0.28, size: 0.8 },
  wood: { color: [0.55, 0.38, 0.2], n: 7, speed: 2.2, up: 1.2, life: 0.4, size: 1 },
  dust: { color: [0.55, 0.5, 0.4], n: 6, speed: 1.2, up: 1.4, life: 0.6, size: 1.3 },
};

export class Effects {
  constructor(scene) {
    this.pos = new Float32Array(MAX * 3);
    this.col = new Float32Array(MAX * 3);
    this.vel = new Float32Array(MAX * 3);
    this.life = new Float32Array(MAX);
    this.count = 0;
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    this.geo.setAttribute('color', new THREE.BufferAttribute(this.col, 3));
    this.geo.setDrawRange(0, 0);
    this.mat = new THREE.PointsMaterial({ size: 0.09, vertexColors: true, sizeAttenuation: true, depthWrite: false });
    this.points = new THREE.Points(this.geo, this.mat);
    this.points.frustumCulled = false;
    scene.add(this.points);
  }

  spawn(kind, x, y, z, dirX = 0, dirZ = 0) {
    const k = KINDS[kind];
    if (!k) return;
    for (let i = 0; i < k.n; i++) {
      if (this.count >= MAX) this.kill(0);
      const j = this.count++;
      this.pos[j * 3] = x + (Math.random() - 0.5) * 0.15;
      this.pos[j * 3 + 1] = y + (Math.random() - 0.5) * 0.15;
      this.pos[j * 3 + 2] = z + (Math.random() - 0.5) * 0.15;
      const s = k.speed * (0.4 + Math.random() * 0.8);
      const a = Math.random() * Math.PI * 2;
      this.vel[j * 3] = Math.cos(a) * s * 0.6 + dirX * s;
      this.vel[j * 3 + 1] = k.up * (0.3 + Math.random());
      this.vel[j * 3 + 2] = Math.sin(a) * s * 0.6 + dirZ * s;
      const shade = 0.8 + Math.random() * 0.4;
      this.col[j * 3] = k.color[0] * shade;
      this.col[j * 3 + 1] = k.color[1] * shade;
      this.col[j * 3 + 2] = k.color[2] * shade;
      this.life[j] = k.life * (0.6 + Math.random() * 0.8);
    }
  }

  kill(j) {
    const last = --this.count;
    if (j !== last) {
      for (let c = 0; c < 3; c++) {
        this.pos[j * 3 + c] = this.pos[last * 3 + c];
        this.vel[j * 3 + c] = this.vel[last * 3 + c];
        this.col[j * 3 + c] = this.col[last * 3 + c];
      }
      this.life[j] = this.life[last];
    }
  }

  update(dt) {
    for (let j = this.count - 1; j >= 0; j--) {
      this.life[j] -= dt;
      if (this.life[j] <= 0) {
        this.kill(j);
        continue;
      }
      this.vel[j * 3 + 1] -= 9.8 * dt;
      this.pos[j * 3] += this.vel[j * 3] * dt;
      this.pos[j * 3 + 1] += this.vel[j * 3 + 1] * dt;
      this.pos[j * 3 + 2] += this.vel[j * 3 + 2] * dt;
    }
    this.geo.setDrawRange(0, this.count);
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.color.needsUpdate = true;
  }
}
