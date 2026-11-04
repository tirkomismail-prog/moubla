import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { groundFit, fitNormal, layFlat, footprint, lowest, handOnAxis, secondGrip, rigidGrip } from '../src/battle/grips.js';
import { Agent } from '../src/battle/agent.js';
import { NEUTRAL } from '../src/battle/stature.js';
import { buildHuman } from '../src/battle/models.js';

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

test('a weapon let go over a bank beyond his feet lies on the ground by him, not inside the bank', () => {
  // a bank rising 2.2 m over 2 m (the terrain's grid at the foot of the
  // siege's cliff) behind the feet of the body lying along +x
  const bank = (x) => 2.2 * Math.min(1, Math.max(0, (-0.2 - x) / 2));
  const heightAt = (x) => bank(x);
  // a sword pointing back over the bank, its middle a metre beyond the feet
  const m = new THREE.Matrix4().makeRotationY(-Math.PI / 2).setPosition(-0.66, 1.5, 0.3);
  const out = new THREE.Matrix4();
  assert.ok(layFlat(heightAt, SWORD, m, BODY, out, false, flatPlane(0)));
  const low = lowest(heightAt, SWORD, out);
  assert.ok(low >= 0.01 && low <= 0.03, `lowest corner ${low}`);
  const c = SWORD.getCenter(new THREE.Vector3()).applyMatrix4(out);
  let near = Infinity;
  for (let i = 0; i < BODY.length; i += 2) near = Math.min(near, Math.hypot(BODY[i] - c.x, BODY[i + 1] - c.z));
  assert.ok(near < 1, `${near} m from the body`);
  // nowhere on his ground (a trench as wide as he is): on the ground beside
  // it, not inside its banks
  const trench = (x, z) => (Math.abs(z) > 0.3 ? 3 * (Math.abs(z) - 0.3) : 0);
  assert.equal(layFlat(trench, SWORD, new THREE.Matrix4().setPosition(0.8, 1, 0.45), BODY, out, false, flatPlane(0)), false);
  const lowT = lowest(trench, SWORD, out);
  assert.ok(lowT >= 0.01 && lowT <= 0.03, `in the trench: lowest corner ${lowT}`);
});

test('a dropped weapon keeps off the bodies lying by his, where it can', () => {
  const heightAt = plane(13, 0.6, 1);
  const m = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(-1.2, 1.5, 0.3)).setPosition(0.8, heightAt(0.8, 0.45) + 0.3, 0.45);
  const alone = new THREE.Matrix4();
  layFlat(heightAt, SWORD, m, BODY, alone);
  // another body lying where it would lie alone
  const c0 = SWORD.getCenter(new THREE.Vector3()).applyMatrix4(alone);
  const other = [];
  for (let t = -0.8; t <= 0.8; t += 0.2) other.push(c0.x + t, c0.z + 0.05);
  const out = new THREE.Matrix4();
  assert.ok(layFlat(heightAt, SWORD, m, BODY, out, false, null, [], { body: other, items: [] }));
  const c = SWORD.getCenter(new THREE.Vector3()).applyMatrix4(out);
  const dir = new THREE.Vector3().setFromMatrixColumn(out, 2);
  let near = Infinity;
  for (let i = 0; i < other.length; i += 2) {
    for (let t = -0.45; t <= 0.45; t += 0.05) near = Math.min(near, Math.hypot(other[i] - (c.x + dir.x * t), other[i + 1] - (c.z + dir.z * t)));
  }
  assert.ok(near > 0.14, `${near} m from the other body`);
});

// A soldier as fallHeading, lieSketch and the poses see him (no scene).
function soldier(heightAt, { id = 7, x = 0, z = 0, yaw = 0, corpses = [], weapon = 'spear', isPlayer = false } = {}) {
  const a = Object.create(Agent.prototype);
  Object.assign(a, {
    id, yaw, bodyYaw: yaw, isPlayer, stature: NEUTRAL, body: null, horse: null, couched: false,
    pos: new THREE.Vector3(x, heightAt(x, z), z), vel: new THREE.Vector3(),
    battle: { terrain: { heightAt }, corpses },
    weapons: [weapon], wi: 0, action: { s: 'idle', t: 0, dur: 0 }, _poses: null, _idle: null,
  });
  a.rig = buildHuman({ look: 'cloth', team: '#7a2a20', team2: '#d8c9a0', skin: '#c89a78', hair: '#3a2a1c', pants: '#4a4038', stature: NEUTRAL });
  return a;
}

test('a man falling by a wall lies with his hands and feet off it, not only his trunk', () => {
  // the wall (a bank 4 m up over 0.6 m) to his right, parallel to the way
  // he faces; he falls on his back away from a blow from the front
  const wall = (x) => 4 * Math.min(1, Math.max(0, (x - 1) / 0.6));
  const heightAt = (x) => wall(x);
  for (let id = 1; id <= 40; id++) {
    const a = soldier(heightAt, { id, x: 0.55 });
    const fall = a.fallHeading(Math.PI);
    for (let i = 0; i < fall.at.length; i += 2) {
      // (no higher than his hands and feet follow the ground: 25 cm)
      const h = heightAt(fall.at[i], fall.at[i + 1]);
      assert.ok(h <= 0.28, `id ${id} variant ${fall.variant}: point ${i / 2} ${h.toFixed(2)} m up the wall`);
    }
  }
});

test('a man falls clear of a body lying where he would, turning no farther than a right angle or so', () => {
  const flat = () => 0;
  // (his points within 35 cm of the other's: lieSketch)
  const over = (pts, q) => {
    let n = 0;
    for (let i = 0; i < pts.length; i += 2) {
      let hit = false;
      for (let j = 0; j < q.length; j += 2) if (Math.hypot(pts[i] - q[j], pts[i + 1] - q[j + 1]) < 0.35) hit = true;
      if (hit) n++;
    }
    return n;
  };
  // the first falls on his back; the second, killed beside him (0.6 or 0.9
  // m) by the same blow, falls the same way unless he knows of him
  for (const dx of [0.6, 0.9]) {
    let n0 = 0;
    let n1 = 0;
    for (let id = 1; id <= 20; id++) {
      const first = soldier(flat, { id: 100 + id });
      const f1 = first.fallHeading(Math.PI);
      first.lieAt = Float64Array.from(f1.at);
      const alone = soldier(flat, { id, x: dx }).fallHeading(Math.PI);
      const fall = soldier(flat, { id, x: dx, corpses: [first] }).fallHeading(Math.PI);
      const turn = Math.abs(Math.atan2(Math.sin(fall.head - Math.PI), Math.cos(fall.head - Math.PI)));
      assert.ok(turn <= 1.05 + 1e-6, `${dx} id ${id}: turned ${turn}`);
      const a = over(alone.at, f1.at);
      const b = over(fall.at, f1.at);
      assert.ok(b <= a, `${dx} id ${id}: ${b} points over him, ${a} alone`);
      // (0.9 m apart there is room: at most their feet by each other)
      if (dx > 0.8) assert.ok(b <= 1, `${dx} id ${id}: ${b} points over him`);
      n0 += a;
      n1 += b;
    }
    assert.ok(n1 <= n0 / 2, `${dx}: ${n1} points over him of ${n0} alone`);
  }
});

test('a spear stands on the ground at rest, is carried off it on the move, and the player keeps his at the trail', () => {
  const flat = () => 0;
  const pose = () => ({ q: new THREE.Quaternion(), wrist: 0, twist: 0, pitch: 0, ext: 1, ground: 0, free: 0, floor: 0 });
  for (const weapon of ['spear', 'pitchfork']) {
    const a = soldier(flat, { weapon });
    const p = pose();
    a.rightPose(p);
    assert.equal(p.ground, 1, `${weapon} at rest`);
    for (const speed of [1.4, 2, 4.5]) {
      a.vel.set(0, 0, speed);
      a.rightPose(p);
      assert.equal(p.ground, 0, `${weapon} at ${speed} m/s`);
      assert.ok(p.free > 0.99, `${weapon}: the left hand hangs`);
    }
    const player = soldier(flat, { weapon, isPlayer: true });
    player.rightPose(p);
    assert.equal(p.ground, 0, `the player's ${weapon} at rest`);
  }
  // a lance on foot too
  const lance = soldier(flat, { weapon: 'lance' });
  const p = pose();
  lance.rightPose(p);
  assert.equal(p.ground, 1);
  lance.vel.set(3, 0, 0);
  lance.rightPose(p);
  assert.equal(p.ground, 0);
});

test('a pole stood on a slope has its butt on the ground where it stands, not at the level of his feet', () => {
  const geo = { boundingBox: new THREE.Box3(new THREE.Vector3(-0.03, -0.03, -0.55), new THREE.Vector3(0.03, 0.03, 1.67)) };
  // (the realistic body's hand at rest, in his own space; the pole about upright)
  const hand = new THREE.Vector3(-0.36, 1.2, 0.18);
  const dir = new THREE.Vector3(0.017, 1, -0.05).normalize();
  for (const deg of [0, 14, 30]) {
    const heightAt = plane(deg, 0.4, 2);
    for (let yaw = 0; yaw < 6.28; yaw += Math.PI / 4) {
      const a = soldier(heightAt, { x: 1.5, z: -2, yaw });
      a.weaponMesh = { userData: { prop: { geo } } };
      const slide = a.slideFor(hand, dir);
      // the butt in his space, then in the world
      const butt = hand.clone().addScaledVector(dir, geo.boundingBox.min.z - slide);
      const wx = a.pos.x + butt.x * Math.cos(yaw) + butt.z * Math.sin(yaw);
      const wz = a.pos.z - butt.x * Math.sin(yaw) + butt.z * Math.cos(yaw);
      const over = a.pos.y + butt.y - heightAt(wx, wz);
      // (the ground taken where the pole meets the level of his feet: a few mm
      // off on a steep slope)
      assert.ok(Math.abs(over - 0.03) < (deg > 20 ? 0.01 : 0.004), `${deg}° heading ${yaw.toFixed(2)}: butt ${over.toFixed(3)} m over the ground`);
    }
  }
});

test('a weapon held point down is raised clear of the ground rising under its point, lowered over ground falling away', () => {
  const geo = { boundingBox: SWORD };
  // the sword point down and forward from a hand 1.2 m up, on a 14° slope
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, -0.91, 0.41).normalize());
  for (const rise of [1, -1]) {
    const heightAt = plane(14 * rise, 0, 0);
    const a = soldier(heightAt);
    a.weaponMesh = { userData: { prop: { geo } } };
    const m = new THREE.Matrix4().compose(new THREE.Vector3(0, 1.2 - 0.25, 0.3), q, new THREE.Vector3(1, 1, 1));
    const lift = a.floorLift(m);
    m.elements[13] += lift;
    const low = lowest(heightAt, SWORD, m);
    if (rise > 0) assert.ok(lift > 0 && Math.abs(low - 0.02) < 1e-6, `uphill: lift ${lift}, lowest ${low}`);
    else assert.ok(lift < 0 && low >= 0.1 - 1e-6 && low < 0.3, `downhill: lift ${lift}, lowest ${low}`);
  }
});

// ---------------------------------------------------------------------------
// The second hand on a held weapon (grips.js secondGrip, handOnAxis)
// ---------------------------------------------------------------------------

// the realistic body's left arm (character.js t.limbs.arm_l a + b) and its
// hand's grip point behind and beside the wrist (t.hands.l.grip)
const ARM = 0.512;
const BACK = 0.09;
const SIDE = 0.028;
const hand = () => ({ grip: new THREE.Vector3(), wrist: new THREE.Vector3(), len: new THREE.Vector3(), knuck: new THREE.Vector3(), palm: new THREE.Vector3() });
const SHOULDER = new THREE.Vector3(0.184, 1.386, 0.02);
const offAxis = (q, p, dir) => q.clone().sub(p).addScaledVector(dir, -q.clone().sub(p).dot(dir)).length();

test('the second hand takes the haft where it is wanted, on the axis, its wrist within reach', () => {
  // a spear held low at the right hip, pointing forward (and a little up)
  const p = new THREE.Vector3(-0.1, 1.05, 0.15);
  const dir = new THREE.Vector3(0, 0.15, 1).normalize();
  const s = secondGrip(SHOULDER, p, dir, 0.12, 0.95, 0.2, ARM, BACK, SIDE);
  assert.equal(s, 0.2);
  const h = handOnAxis(SHOULDER, p, dir, s, BACK, SIDE, hand());
  assert.ok(offAxis(h.grip, p, dir) < 1e-9);
  assert.ok(h.wrist.distanceTo(SHOULDER) <= ARM, `wrist ${h.wrist.distanceTo(SHOULDER)} from the shoulder`);
  // its frame: unit and square; the knuckles along the haft (slanted a little at most),
  // the index towards the point, the hand reaching away from the shoulder
  for (const v of [h.len, h.knuck, h.palm]) assert.ok(Math.abs(v.length() - 1) < 1e-9);
  assert.ok(Math.abs(h.len.dot(h.knuck)) < 1e-9 && Math.abs(h.palm.dot(h.len)) < 1e-9 && Math.abs(h.palm.dot(h.knuck)) < 1e-9);
  assert.ok(h.knuck.dot(dir) > Math.cos(0.5) - 1e-9);
  assert.ok(h.len.dot(h.grip.clone().sub(SHOULDER)) > 0);
  // the grip point: `BACK` along the hand from the wrist and `SIDE` towards the palm
  const g = h.wrist.clone().addScaledVector(h.len, BACK).addScaledVector(h.palm, SIDE);
  assert.ok(g.distanceTo(h.grip) < 1e-9);
});

test('out of reach where it is wanted, the second hand takes the nearest point it reaches', () => {
  // a spear thrust forward at shoulder height from the right shoulder
  const p = new THREE.Vector3(-0.18, 1.35, 0.6);
  const dir = new THREE.Vector3(0, 0, 1);
  // forward of the right hand it is out of reach; behind it, it reaches
  assert.ok(Number.isNaN(secondGrip(SHOULDER, p, dir, 0.12, 0.95, 0.45, ARM, BACK, SIDE)));
  const s = secondGrip(SHOULDER, p, dir, -0.5, -0.05, -0.05, ARM, BACK, SIDE);
  assert.ok(s < -0.05 && s > -0.5, `s ${s}`);
  const h = handOnAxis(SHOULDER, p, dir, s, BACK, SIDE, hand());
  assert.ok(Math.abs(h.wrist.distanceTo(SHOULDER) - ARM) < 1e-4, `at the edge of the reach: ${h.wrist.distanceTo(SHOULDER)}`);
  // a haft wholly beyond reach: none
  assert.ok(Number.isNaN(secondGrip(SHOULDER, new THREE.Vector3(-1.2, 1.3, 0.5), dir, -0.5, 1, 0.3, ARM, BACK, SIDE)));
});

test('a straight arm (the low graphics) takes the haft within its lengths, or not at all', () => {
  const shoulder = new THREE.Vector3(0.28, 1.45, 0);
  const p = new THREE.Vector3(-0.1, 1.2, 0.35);
  const dir = new THREE.Vector3(0.2, 0.1, 1).normalize();
  const at = (s) => p.clone().addScaledVector(dir, s).distanceTo(shoulder);
  // exactly its length
  const s = rigidGrip(shoulder, p, dir, -0.5, 1, 0.3, 0.6, 0.6);
  assert.ok(!Number.isNaN(s));
  assert.ok(Math.abs(at(s) - 0.6) < 1e-9);
  assert.ok(Number.isNaN(rigidGrip(shoulder, p, dir, -0.5, 1, 0.3, 0.2, 0.2)));
  // (and only within [from, to])
  const t = rigidGrip(shoulder, p, dir, -0.5, s - 0.01, 0.3, 0.6, 0.6);
  assert.ok(Number.isNaN(t) || t <= s - 0.01);
  // within a range of lengths: where wanted if it lies so, else the nearest point that does
  for (const want of [-0.4, 0, 0.3, 0.8]) {
    const u = rigidGrip(shoulder, p, dir, -0.5, 1, want, 0.5, 0.66);
    assert.ok(!Number.isNaN(u) && at(u) >= 0.5 - 1e-9 && at(u) <= 0.66 + 1e-9, `${want}: ${u} at ${at(u)}`);
    if (at(want) >= 0.5 && at(want) <= 0.66) assert.ok(Math.abs(u - want) < 1e-9);
    for (let v = -0.5; v <= 1; v += 0.01) if (at(v) >= 0.5 && at(v) <= 0.66) assert.ok(Math.abs(v - want) >= Math.abs(u - want) - 1e-9);
  }
});
