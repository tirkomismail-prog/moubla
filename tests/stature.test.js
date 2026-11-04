import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stature, scaledY, hitZone, handsOut, NEUTRAL, SPREAD } from '../src/battle/stature.js';
import { groundFit, secondFor, SECOND } from '../src/battle/grips.js';
import { buildHuman } from '../src/battle/models.js';
import { Agent } from '../src/battle/agent.js';
import { SkinnedHuman } from '../src/battle/character.js';

const ids = (n, from = 1) => Array.from({ length: n }, (_, i) => from + i);
const near = (a, b, eps, what) => assert.ok(Math.abs(a - b) <= eps, `${what}: ${a} vs ${b}`);

test('a soldier’s build is the same every time it is made from his id, and differs from his neighbours’', () => {
  for (const id of [1, 2, 77, 4096, 123457]) assert.deepEqual(stature(id), stature(id));
  const seen = new Set(ids(200).map((id) => stature(id).height.toFixed(6)));
  assert.ok(seen.size > 190, `${seen.size} heights of 200`);
});

test('a companion’s build is his name’s: the same in every battle, whatever id he gets there', () => {
  for (const key of ['comp:lesia', 'comp:torvi', 'Борис Сірий']) assert.deepEqual(stature(key), stature(key));
  const keys = ['comp:lesia', 'comp:torvi', 'comp:borys', 'comp:aibek', 'comp:hilda', 'comp:ostap'];
  assert.equal(new Set(keys.map((k) => stature(k).height)).size, keys.length);
  for (const k of keys) assert.ok(Math.abs(stature(k).height - 1) < SPREAD.height, `${k}: ${stature(k).height}`);
});

test('every build is within its spreads, the head smaller for a taller man', () => {
  for (const id of ids(5000)) {
    const s = stature(id);
    assert.ok(Math.abs(s.height - 1) < SPREAD.height, `height ${s.height}`);
    assert.ok(Math.abs(s.waist - 1) < SPREAD.waist, `waist ${s.waist}`);
    assert.ok(Math.abs(s.chest - 1) < SPREAD.chest, `chest ${s.chest}`);
    // (the ribs between the waist and the chest, the same way)
    assert.ok((s.ribs - s.waist) * (s.ribs - s.chest) <= 1e-12, `ribs ${s.ribs} between ${s.waist} and ${s.chest}`);
    // (his arms out as far as his chest is wider, his collarbones a little
    // longer or shorter besides: his hands, as his collarbones put them,
    // within 7 mm of where they hang by the model's hips)
    assert.ok(Math.abs(handsOut(s)) < 0.007, `shoulders ${s.shoulders} of a waist ${s.waist}`);
    assert.ok(Math.abs(s.shoulders - 1) < SPREAD.chest + SPREAD.shoulders, `shoulders ${s.shoulders}`);
    assert.ok(Math.abs(s.shoulders - s.chest) < SPREAD.shoulders, `shoulders ${s.shoulders} of a chest ${s.chest}`);
    const own = s.head / Math.pow(s.height, -0.3);
    assert.ok(Math.abs(own - 1) < SPREAD.head, `head ${s.head} of a man ${s.height} tall`);
  }
});

test('heights are bell-shaped round the model’s: two in three within half the spread, the extremes reached but rare', () => {
  const h = ids(1000).map((id) => stature(id).height);
  const mean = h.reduce((a, b) => a + b, 0) / h.length;
  near(mean, 1, 0.005, 'mean');
  const half = h.filter((x) => Math.abs(x - 1) <= SPREAD.height / 2).length / h.length;
  assert.ok(half > 0.6 && half < 0.74, `within half the spread: ${half}`);
  assert.ok(Math.max(...h) > 1 + 0.9 * SPREAD.height && Math.min(...h) < 1 - 0.9 * SPREAD.height, `${Math.min(...h)} .. ${Math.max(...h)}`);
  const far = h.filter((x) => Math.abs(x - 1) > 0.9 * SPREAD.height).length / h.length;
  assert.ok(far < 0.02, `beyond 0.9 of the spread: ${far}`);
});

test('ten men in a row (consecutive ids) differ in height, never as much as the whole spread', () => {
  const h = ids(2000).map((id) => stature(id).height);
  const ranges = [];
  for (let i = 0; i + 10 <= h.length; i += 10) ranges.push(Math.max(...h.slice(i, i + 10)) - Math.min(...h.slice(i, i + 10)));
  ranges.sort((a, b) => a - b);
  // (of a man of 1.75 m: from 7 to 25 cm, about 17)
  const median = ranges[ranges.length >> 1];
  assert.ok(median > 0.08 && median < 0.11, `median ${median}`);
  assert.ok(ranges[0] > 0.04 && ranges[ranges.length - 1] < 0.14, `${ranges[0]} .. ${ranges[ranges.length - 1]}`);
});

test('the build’s parts go together: broad shoulders with a stocky build, a smaller head with height', () => {
  const s = ids(2000).map((id) => stature(id));
  const corr = (f, g) => {
    const x = s.map(f);
    const y = s.map(g);
    const mx = x.reduce((a, b) => a + b) / x.length;
    const my = y.reduce((a, b) => a + b) / y.length;
    let c = 0;
    let vx = 0;
    let vy = 0;
    for (let i = 0; i < x.length; i++) {
      c += (x[i] - mx) * (y[i] - my);
      vx += (x[i] - mx) ** 2;
      vy += (y[i] - my) ** 2;
    }
    return c / Math.sqrt(vx * vy);
  };
  const shoulders = corr((t) => t.waist, (t) => t.shoulders);
  assert.ok(shoulders > 0.85 && shoulders < 0.99, `waist and shoulders ${shoulders}`);
  assert.ok(corr((t) => t.height, (t) => t.head) < -0.5, 'height and head');
  assert.ok(Math.abs(corr((t) => t.height, (t) => t.waist)) < 0.1, 'height and waist');
});

test('the model’s heights stay where they were for the neutral man (the player), his hit zone as before the builds', () => {
  for (const y of [0, 0.1, 0.93, 1.5, 1.62, 1.75, 2.85]) near(scaledY(NEUTRAL, y), y, 1e-12, `standing ${y}`);
  for (const y of [1.55, 1.645, 2.3, 2.35, 2.85]) near(scaledY(NEUTRAL, y, true), y, 1e-12, `mounted ${y}`);
  // (projectiles.js before stage 4.5: from 0.1 to 1.85 m above his feet,
  // the head from 1.55; on a horse from 1.55 to 2.6, the head from 2.3)
  assert.deepEqual(hitZone(NEUTRAL), { base: 0.1, top: 1.85, head: 1.55 });
  const m = hitZone(NEUTRAL, true);
  near(m.base, 1.55, 1e-9, 'mounted base');
  near(m.top, 2.6, 1e-9, 'mounted top');
  near(m.head, 2.3, 1e-9, 'mounted head');
});

test('the hit zone and the head follow a man’s height, his head’s size above his neck; a rider’s hips stay on the saddle', () => {
  const tall = { ...NEUTRAL, height: 1.07, head: 0.95 };
  const short = { ...NEUTRAL, height: 0.93, head: 1.05 };
  // standing: scaled from his feet, the neck and the head by their own size
  // above the root of the neck (1.48 m on the model)
  near(hitZone(tall).top, (1.48 + 0.37 * 0.95) * 1.07, 1e-9, 'tall top');
  near(hitZone(short).top, (1.48 + 0.37 * 1.05) * 0.93, 1e-9, 'short top');
  near(hitZone(tall).head, (1.48 + 0.07 * 0.95) * 1.07, 1e-9, 'tall head line');
  near(scaledY(tall, 1.62), (1.48 + 0.14 * 0.95) * 1.07, 1e-9, 'tall eyes');
  // on a horse: his hips at 1.645 m whatever his height
  near(scaledY(tall, 1.645, true), 1.645, 1e-12, 'hips');
  near(scaledY(tall, 2.335, true) - scaledY(NEUTRAL, 2.335, true), scaledY(tall, 1.62) - 1.62 - 0.07 * 0.93, 1e-9, 'rider’s eyes rise less than a standing man’s');
  assert.ok(hitZone(tall, true).top > hitZone(NEUTRAL, true).top && hitZone(short, true).top < hitZone(NEUTRAL, true).top);
  // (continuous at the root of the neck)
  near(scaledY(tall, 1.48 - 1e-9), scaledY(tall, 1.48 + 1e-9), 1e-8, 'at the neck');
  // higher on the model, higher on him
  for (const st of [tall, short]) for (let y = 0; y < 2.9; y += 0.05) assert.ok(scaledY(st, y + 0.05) > scaledY(st, y) && scaledY(st, y + 0.05, true) > scaledY(st, y, true));
});

test('a lying body’s ground is sampled as far from his pelvis as he is tall', () => {
  // a ridge under the feet of the model (0.85 m behind the pelvis) only
  const ridge = (x, z) => (Math.abs(z + 0.85) < 0.02 ? 0.3 : 0);
  const model = groundFit(ridge, 0, 0, 0, 1);
  assert.ok(model.err > 0.05 && model.a < -0.1, 'the model’s feet on the ridge');
  const tall = groundFit(ridge, 0, 0, 0, 1, null, {}, 1.07);
  assert.ok(tall.err < 1e-9 && Math.abs(tall.a) < 1e-9, 'a taller man’s past it');
  // (a slope fitted alike at any height)
  const slope = (x, z) => 0.2 * z + 0.1 * x;
  for (const k of [0.93, 1, 1.07]) {
    const fit = groundFit(slope, 1, 2, 0, 1, null, {}, k);
    near(fit.a, 0.2, 1e-9, `rise along at ${k}`);
    near(fit.b, 0.1, 1e-9, `rise to the left at ${k}`);
    near(fit.y, slope(1, 2), 1e-9, `height at ${k}`);
  }
});

test('a taller man’s second hand is as much farther from the first on a weapon, the end of its grip where it is', () => {
  const out = [0, 0, 0];
  // a spear: ahead of the right hand
  assert.deepEqual(secondFor(SECOND.spear[0], 1, out), SECOND.spear[0]);
  const [want, from, to] = secondFor(SECOND.spear[0], 1.07, out);
  near(want, 0.4 * 1.07, 1e-12, 'spear want');
  near(from, 0.12 * 1.07, 1e-12, 'spear near end');
  near(to, 0.9, 1e-12, 'spear far end');
  // a great sword's grip: behind it, its pommel where it is
  const g = secondFor(SECOND.greatsword[0], 0.93, out);
  near(g[0], -0.13 * 0.93, 1e-12, 'sword want');
  near(g[1], -0.17, 1e-12, 'sword far end');
  near(g[2], -0.1 * 0.93, 1e-12, 'sword near end');
  for (const k of [0.93, 1.07]) for (const r of Object.values(SECOND)) {
    const [w, a, b] = secondFor(r[0], k, out);
    assert.ok(a < b && w >= a && w <= b, `${r[0]} at ${k}: ${[w, a, b]}`);
  }
});

test('the pose tables are made for the model’s shoulder: a few for all, though each man’s arms are where his collarbones put them', () => {
  const spec = { look: 'mail', team: '#7a2a20', team2: '#d8c9a0', skin: '#c89a78', hair: '#3a2a1c', pants: '#4a4038', helmet: 'nasal' };
  // (the realistic body's shoulders, character.js t.shoulder: the model's)
  const t = { shoulder: { r: { x: -0.184, y: 1.386, z: 0.02 }, l: { x: 0.184, y: 1.386, z: 0.02 } }, reach: 0.53 };
  for (const driverOnly of [false, true]) {
    const tables = new Set();
    const arms = new Set();
    for (const id of ids(300)) {
      const st = stature(id);
      const rig = buildHuman({ ...spec, driverOnly, stature: st });
      const s = rig.shoulder;
      arms.add(rig.armR.position.x);
      assert.ok(Math.abs(rig.armR.position.x - s.x) < 0.007, `${driverOnly}: arm ${rig.armR.position.x} of ${s.x}`);
      // (the realistic body moves the rig's shoulders to its own)
      const body = driverOnly ? { t } : null;
      if (body) SkinnedHuman.prototype.fitDriver.call(body, rig);
      // the tables agent.js keeps for good (Agent.poses)
      tables.add(Agent.prototype.poses.call({ rig, body, stature: st, _poses: null }));
    }
    assert.ok(tables.size <= 10, `${driverOnly}: ${tables.size} tables`);
    assert.ok(arms.size > 250, `${driverOnly}: ${arms.size} shoulders`);
  }
});
