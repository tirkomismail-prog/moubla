import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { groundFit, fitNormal, layFlat, footprint, lowest } from '../src/battle/grips.js';

// a plane rising `deg` degrees towards the heading `dir` (rad, from +z towards +x)
const plane = (deg, dir, h0 = 3) => {
  const k = Math.tan((deg * Math.PI) / 180);
  return (x, z) => h0 + k * (x * Math.sin(dir) + z * Math.cos(dir));
};

// the five places groundFit samples (as in grips.js FIT), in the world
const samples = (x, z, dx, dz) => [[-0.85, 0], [0, 0], [0.75, 0], [0, 0.25], [0, -0.25]].map(([u, v]) => [x + dx * u + dz * v, z + dz * u - dx * v, u, v]);

test('a lying body is fitted to a plane of 0, 13 and 30 degrees: all five samples within 3 cm', () => {
  for (const deg of [0, 13, 30]) {
    for (const slopeDir of [0, 1.1, 2.5, -2]) {
      const heightAt = plane(deg, slopeDir);
      for (const bodyDir of [0, 0.7, 1.9, Math.PI, -1.2]) {
        const dx = Math.sin(bodyDir);
        const dz = Math.cos(bodyDir);
        const x = 4.2;
        const z = -7.5;
        const fit = groundFit(heightAt, x, z, dx, dz, { x: x - dx * 0.4, y: heightAt(x - dx * 0.4, z - dz * 0.4), z: z - dz * 0.4 });
        for (const [sx, sz, u, v] of samples(x, z, dx, dz)) {
          const on = fit.y + fit.a * u + fit.b * v;
          assert.ok(Math.abs(on - heightAt(sx, sz)) <= 0.03, `${deg}° ${slopeDir} ${bodyDir}: ${on} vs ${heightAt(sx, sz)}`);
        }
        // its up: the plane's normal (its tilt and the way it leans)
        const n = fitNormal(fit, dx, dz);
        const k = Math.tan((deg * Math.PI) / 180);
        const normal = new THREE.Vector3(-k * Math.sin(slopeDir), 1, -k * Math.cos(slopeDir)).normalize();
        assert.ok((n.angleTo(normal) * 180) / Math.PI < 0.5, `normal ${n.toArray()} for ${deg}° ${slopeDir} ${bodyDir}`);
        assert.equal(fit.off, 0);
        // the body's length rises as the plane does along it
        const rise = Math.tan((deg * Math.PI) / 180) * Math.cos(bodyDir - slopeDir);
        assert.ok(Math.abs(fit.a - rise) < 1e-6 && Math.abs(Math.tan(fit.pitch) - rise) < 1e-6);
      }
    }
  }
});

test('on uneven ground the pelvis never lies under the ground', () => {
  // a bump under the pelvis
  const heightAt = (x, z) => Math.max(0, 0.2 - Math.hypot(x, z) * 0.5);
  const fit = groundFit(heightAt, 0, 0, 0, 1);
  assert.ok(fit.y >= heightAt(0, 0));
});

test('a drop (the edge of the siege plateau) is not a slope to lie down: he lies on the level he stood on', () => {
  // the plateau at 7.5 m ends at z = 0.5 (on a 13° slope down along x)
  const k = Math.tan((13 * Math.PI) / 180);
  const heightAt = (x, z) => (z < 0.5 ? 7.5 : 0) - k * x;
  const at = { x: 0, y: 7.5, z: -0.2 };
  // his head over the edge
  let fit = groundFit(heightAt, 0, 0.3, 0, 1, at);
  assert.ok(Math.abs(fit.pitch) < 0.01 && Math.abs(fit.y - 7.5) < 0.01, `head over: pitch ${fit.pitch}, y ${fit.y}`);
  assert.ok(Math.abs(fit.roll + Math.atan(k)) < 0.01, `roll ${fit.roll}`);
  // along the edge, his right side over it: the plateau's slope along him
  fit = groundFit(heightAt, 0, 0.3, 1, 0, at);
  assert.ok(Math.abs(fit.pitch + Math.atan(k)) < 0.01 && Math.abs(fit.roll) < 0.01 && Math.abs(fit.y - 7.5) < 0.01, `along: ${fit.pitch} ${fit.roll} ${fit.y}`);
  // without where he stood: the drop is fitted as a slope
  fit = groundFit(heightAt, 0, 0.3, 0, 1);
  assert.ok(fit.pitch < -0.5);
});

// the siege's cliff as the terrain's 2 m grid has it: the plateau 7.5 m up
// for z <= -2, the ground for z >= 0, a straight bank between
const cliff = (x, z) => 7.5 * Math.min(1, Math.max(0, -z / 2));

test('a wall (the cliff under the plateau) is not a slope to lie up: he lies on the level he stood on', () => {
  // at its foot, falling towards it: his pelvis would be 0.4 m in
  const at = { x: 3, y: 0, z: 0.1 };
  const fit = groundFit(cliff, 3, -0.35, 0, -1, at);
  assert.ok(fit.off >= 2, `off ${fit.off}`);
  assert.ok(Math.abs(fit.pitch) < 0.01 && Math.abs(fit.roll) < 0.01 && Math.abs(fit.y) < 0.3, `pitch ${fit.pitch}, roll ${fit.roll}, y ${fit.y}`);
  // without where he stood: up the cliff
  assert.ok(groundFit(cliff, 3, -0.35, 0, -1).pitch > 0.8);
});

test('at the edge of a drop with only his feet on the plateau he lies level on it, not head down', () => {
  const at = { x: 3, y: 7.5, z: -2.1 };
  const fit = groundFit(cliff, 3, -1.65, 0, 1, at);
  assert.ok(fit.off >= 3, `off ${fit.off}`);
  assert.ok(Math.abs(fit.pitch) < 0.01 && Math.abs(fit.roll) < 0.01 && Math.abs(fit.y - 7.5) < 0.01, `pitch ${fit.pitch}, roll ${fit.roll}, y ${fit.y}`);
});

// a sword's box (models.js weaponGeo: along +z from the grip, the blade's flat across x)
const SWORD = new THREE.Box3(new THREE.Vector3(-0.1, -0.03, -0.17), new THREE.Vector3(0.1, 0.03, 0.85));
// a body lying along +x from (0, 0): its feet, head, and bones in between
const BODY = [0, 0, 1.6, 0, 0.9, 0, 1.2, 0, 1.2, 0.2, 1.2, -0.2, 0.7, 0.1, 0.7, -0.1, 0.3, 0.1, 0.3, -0.1];

test('a dropped weapon lies flat on the slope, 1 to 3 cm above it, off the body and near it', () => {
  for (const deg of [0, 13, 30]) {
    const heightAt = plane(deg, 0.6, 1);
    // held upright in a hand just off the body, pointing across it
    const m = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(-1.2, 1.5, 0.3)).setPosition(0.8, heightAt(0.8, 0.45) + 0.3, 0.45);
    const out = new THREE.Matrix4();
    assert.ok(layFlat(heightAt, SWORD, m, BODY, out));
    const lows = [];
    for (let i = 0; i < 8; i++) {
      const p = new THREE.Vector3(i & 1 ? SWORD.max.x : SWORD.min.x, i & 2 ? SWORD.max.y : SWORD.min.y, i & 4 ? SWORD.max.z : SWORD.min.z).applyMatrix4(out);
      lows.push(p.y - heightAt(p.x, p.z));
    }
    const low = Math.min(...lows);
    assert.ok(low >= 0.01 && low <= 0.03, `${deg}°: lowest corner ${low}`);
    // flat: its thin axis (y) along the ground's normal
    const y = new THREE.Vector3().setFromMatrixColumn(out, 1);
    const k = Math.tan((deg * Math.PI) / 180);
    const n = new THREE.Vector3(-k * Math.sin(0.6), 1, -k * Math.cos(0.6)).normalize();
    assert.ok(Math.abs(Math.abs(y.dot(n)) - 1) < 0.02, `${deg}°: not flat`);
    // clear of the body's points, and within a metre of them
    const c = SWORD.getCenter(new THREE.Vector3()).applyMatrix4(out);
    const dir = new THREE.Vector3().setFromMatrixColumn(out, 2);
    let near = Infinity;
    for (let i = 0; i < BODY.length; i += 2) {
      for (let t = -0.45; t <= 0.45; t += 0.05) {
        near = Math.min(near, Math.hypot(BODY[i] - (c.x + dir.x * t), BODY[i + 1] - (c.z + dir.z * t)));
      }
    }
    assert.ok(near > 0.1 && near < 1, `${deg}°: ${near} m from the body`);
  }
});

// the ground a body lies on (its plane: a point on it and its normal)
const flatPlane = (y = 0) => ({ g: new THREE.Vector3(0.8, y, 0), n: new THREE.Vector3(0, 1, 0) });

test('a dropped item does not lie on a bank beside the body (the siege ramp\'s side): on the body\'s ground', () => {
  // a ramp 7.5 m up for z <= 0.6, its side bank down to 0 by z = 2.6 (the
  // terrain's 2 m grid); the body along its edge, the sword let go over the bank
  const ramp = (x, z) => 7.5 * Math.min(1, Math.max(0, (2.6 - z) / 2));
  const body = BODY.map((v, i) => (i % 2 ? v + 0.2 : v));
  const m = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(-1.2, 1.5, 0.3)).setPosition(0.8, 8.2, 0.75);
  const out = new THREE.Matrix4();
  assert.ok(layFlat(ramp, SWORD, m, body, out, false, flatPlane(7.5)));
  const c = SWORD.getCenter(new THREE.Vector3()).applyMatrix4(out);
  assert.ok(Math.abs(c.y - 7.5) < 0.1 && c.z < 0.6, `on the ramp: ${c.toArray()}`);
  const low = lowest(ramp, SWORD, out);
  assert.ok(low >= 0.01 && low <= 0.03, `lowest corner ${low}`);
  // flat (its thin axis up; tilted a little at most, where its side reaches the bank's top)
  assert.ok(new THREE.Vector3().setFromMatrixColumn(out, 1).y > Math.cos((15 * Math.PI) / 180));
});

// an axe (its head across y at the far end of its haft along z) and a round shield (its face across z)
const AXE = new THREE.Box3(new THREE.Vector3(-0.03, -0.032, -0.08), new THREE.Vector3(0.03, 0.176, 0.573));
const ROUND = new THREE.Box3(new THREE.Vector3(-0.33, -0.33, -0.06), new THREE.Vector3(0.33, 0.33, 0.03));

test('a weapon and a shield dropped by the same body do not lie through each other', () => {
  const heightAt = plane(13, 0.6, 1);
  // the shield let go just where the axe lies
  for (const [ax, az] of [[0.8, 0.45], [1.3, -0.5], [0.2, 0.6]]) {
    const items = [];
    const axe = new THREE.Matrix4();
    const ma = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(-1.4, 0.4, 0)).setPosition(ax, heightAt(ax, az) + 0.4, az);
    layFlat(heightAt, AXE, ma, BODY, axe, false, null, items);
    footprint(AXE, axe, items);
    const shield = new THREE.Matrix4();
    const ca = AXE.getCenter(new THREE.Vector3()).applyMatrix4(axe);
    const ms = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0.3, 0.2, 0)).setPosition(ca.x, ca.y + 0.5, ca.z);
    layFlat(heightAt, ROUND, ms, BODY, shield, true, null, items);
    // no point of the axe's footprint inside the shield's disc (in its plane)
    const inv = shield.clone().invert();
    const p = new THREE.Vector3();
    for (let i = 0; i < items.length; i += 2) {
      p.set(items[i], heightAt(items[i], items[i + 1]) + 0.03, items[i + 1]).applyMatrix4(inv);
      assert.ok(Math.hypot(p.x, p.y) > 0.33, `axe at ${items[i]}, ${items[i + 1]} under the shield`);
    }
  }
});
