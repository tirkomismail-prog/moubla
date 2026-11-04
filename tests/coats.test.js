import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { ITEMS, COATS } from '../src/data/items.js';
import { coatFor, ownCoat, breedCoats } from '../src/battle/coats.js';
import { buildHorse } from '../src/battle/models.js';

const HORSES = Object.values(ITEMS).filter((it) => it.type === 'horse');
const ids = (n, from = 1) => Array.from({ length: n }, (_, i) => from + i);
const lightness = (hex) => new THREE.Color(hex).getHSL({}).l;

test('a horse’s coat is the same every time it is picked for its rider’s id, and differs from his neighbours’', () => {
  for (const it of HORSES) {
    for (const id of [1, 2, 77, 4096, 123457]) assert.deepEqual(coatFor(it, id), coatFor(it, id));
    const seen = new Set(ids(40).map((id) => coatFor(it, id).key));
    assert.ok(seen.size >= Math.min(5, breedCoats(it).length), `${it.id}: ${seen.size} coats among 40 riders`);
  }
  // a companion's by his name: the same in every battle
  const it = ITEMS.sumpter;
  assert.deepEqual(coatFor(it, 'comp:lesia'), coatFor(it, 'comp:lesia'));
  const named = new Set(['comp:borys', 'comp:lesia', 'comp:torvi', 'comp:aibek', 'comp:hilda', 'comp:ostap'].map((n) => coatFor(it, n).key));
  assert.ok(named.size >= 2, 'companions’ horses differ');
});

test('the player’s horse is the breed’s own coat, today’s colour, without markings', () => {
  const today = { sumpter: '#7b5a3c', steppe_horse: '#b08850', courser: '#3a2a20', hunter: '#5b3b25', destrier: '#dcdcdc', charger: '#222222' };
  for (const it of HORSES) {
    const own = ownCoat(it);
    assert.equal(own.body, today[it.id], it.id);
    assert.equal(own.key, Object.keys(it.coats)[0], it.id);
    assert.equal(own.marks, false);
    assert.deepEqual(ownCoat(it), own);
  }
  // (and a chosen one: the breed's colour of it, any natural coat besides)
  assert.equal(ownCoat(ITEMS.steppe_horse, 'dun', true).body, '#b08850');
  assert.equal(ownCoat(ITEMS.steppe_horse, 'dun', true).marks, true);
  assert.equal(ownCoat(ITEMS.sumpter, 'dun').body, COATS.dun.body);
  assert.equal(ownCoat(ITEMS.steppe_horse, 'ironGrey').body, COATS.ironGrey.body);
  assert.equal(ownCoat(ITEMS.steppe_horse, 'nonesuch').key, 'dun');
});

test('every breed’s coats are natural ones, in colours, weighted in percent', () => {
  const hex = /^#[0-9a-f]{6}$/;
  for (const [key, c] of Object.entries(COATS)) {
    assert.ok(hex.test(c.body) && hex.test(c.mane), key);
    assert.equal(typeof c.points, 'boolean', key);
    assert.ok(c.name && /[а-яіїєґ]/i.test(c.name), `${key}: a Ukrainian name`);
  }
  for (const it of HORSES) {
    assert.ok(hex.test(it.coat), it.id);
    assert.ok(it.marks > 0 && it.marks < 1, it.id);
    let sum = 0;
    for (const [key, w] of Object.entries(it.coats)) {
      assert.ok(key in COATS, `${it.id}: ${key}`);
      assert.ok(Number.isInteger(w) && w > 0, `${it.id}: ${key} ${w}`);
      sum += w;
    }
    assert.equal(sum, 100, it.id);
    // no coat more than three in ten of a breed (a troop's horses vary)
    assert.ok(Math.max(...Object.values(it.coats)) <= 30, it.id);
  }
});

test('the manes go with the coats: black on a bay, a dun and a black horse, flaxen or self-coloured on a chestnut, light on a grey', () => {
  for (const [key, c] of Object.entries(COATS)) {
    // (black points come with a black mane and tail)
    if (c.points) assert.ok(lightness(c.mane) < 0.12, `${key}: black mane`);
  }
  assert.ok(lightness(COATS.black.mane) < 0.12 && lightness(COATS.black.body) < 0.2);
  for (const key of ['grey', 'whiteGrey', 'ironGrey', 'flaxen', 'palomino']) assert.ok(lightness(COATS[key].mane) > lightness(COATS[key].body), `${key}: a lighter mane`);
  const chestnut = new THREE.Color(COATS.chestnut.mane).getHSL({});
  assert.ok(chestnut.h < 0.1 && chestnut.s > 0.3, 'a chestnut’s own red mane');
  // (bays and duns are the coats with points, chestnuts and greys without)
  for (const key of ['bay', 'lightBay', 'darkBay', 'dun', 'grullo', 'buckskin', 'bayRoan']) assert.equal(COATS[key].points, true, key);
  for (const key of ['chestnut', 'flaxen', 'liver', 'grey', 'whiteGrey', 'ironGrey', 'palomino']) assert.equal(COATS[key].points, false, key);
});

test('over many riders each coat comes as often as its weight, the white markings as often as the breed has them', () => {
  const n = 10000;
  for (const it of HORSES) {
    const count = {};
    let marks = 0;
    for (const id of ids(n)) {
      const c = coatFor(it, id);
      count[c.key] = (count[c.key] || 0) + 1;
      if (c.marks) marks++;
    }
    for (const [key, w] of Object.entries(it.coats)) {
      const share = (count[key] || 0) / n;
      assert.ok(Math.abs(share - w / 100) < 0.02, `${it.id}: ${key} ${share} for ${w}%`);
    }
    assert.ok(Math.abs(marks / n - it.marks) < 0.02, `${it.id}: markings ${marks / n} for ${it.marks}`);
  }
});

test('eight steppe horses of a troop (consecutive ids) show at least three coats, mostly five or more', () => {
  const it = ITEMS.steppe_horse;
  const keys = ids(10007).map((id) => coatFor(it, id).key);
  const distinct = [];
  for (let s = 0; s + 8 <= keys.length; s++) distinct.push(new Set(keys.slice(s, s + 8)).size);
  const fewer = distinct.filter((d) => d < 3).length / distinct.length;
  assert.ok(fewer < 0.001, `fewer than three coats in ${fewer} of the troops`);
  assert.ok(Math.min(...distinct) >= 2, 'never one coat');
  distinct.sort((a, b) => a - b);
  assert.ok(distinct[distinct.length >> 1] >= 5, `median ${distinct[distinct.length >> 1]}`);
  // (the first fifty troops of a session, each of eight in a row)
  for (let s = 1; s + 7 <= 400; s += 8) assert.ok(new Set(keys.slice(s - 1, s + 7)).size >= 3, `ids ${s}..${s + 7}`);
});

test('the low graphics’ horse is painted in its coat, the mane and the points too, sharing its shape with the other coats', () => {
  const horse = (coat, team = '#a8322a') => {
    const { root } = buildHorse(coat, team, false);
    let mesh = null;
    root.traverse((o) => {
      if (o.isSkinnedMesh) mesh = o;
    });
    const set = new Set();
    const c = mesh.geometry.getAttribute('color');
    for (let i = 0; i < c.count; i++) set.add(`#${new THREE.Color(c.getX(i), c.getY(i), c.getZ(i)).getHexString()}`);
    return { set, geo: mesh.geometry };
  };
  const bay = horse(ownCoat(ITEMS.hunter, 'bay'));
  const chestnut = horse(ownCoat(ITEMS.hunter, 'chestnut'));
  // (the hunter's bay is its own: '#5b3b25'; the points '#1e1916', models.js)
  assert.ok(bay.set.has('#5b3b25') && bay.set.has(COATS.bay.mane) && bay.set.has('#1e1916'), 'a bay: its body, black mane and points');
  assert.ok(chestnut.set.has(COATS.chestnut.body) && chestnut.set.has(COATS.chestnut.mane) && !chestnut.set.has('#1e1916'), 'a chestnut: no points');
  // (no vertex left unpainted, models.js UNPAINTED)
  for (const h of [bay, chestnut]) assert.ok(!h.set.has('#808080'));
  // one shape for all coats of a team and barding: every buffer but the
  // colours shared, one geometry per coat
  assert.notEqual(bay.geo, chestnut.geo);
  for (const name of Object.keys(bay.geo.attributes)) {
    if (name === 'color') assert.notEqual(bay.geo.attributes.color, chestnut.geo.attributes.color);
    else assert.equal(bay.geo.attributes[name], chestnut.geo.attributes[name], name);
  }
  assert.equal(horse(ownCoat(ITEMS.hunter, 'bay')).geo, bay.geo);
  assert.notEqual(horse(ownCoat(ITEMS.hunter, 'bay'), '#2a4ea8').geo.attributes.position, bay.geo.attributes.position);
});
