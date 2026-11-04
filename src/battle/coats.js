// Each horse's coat (stage 4.5): one of its breed's natural coats (items.js
// COATS, the breed's `coats` by their weights), with white markings or
// without, by its rider's id (the same id, the same horse: no Math.random).
// Plain data, kept apart from the scene so that the tests can run it in
// node: horse.js and models.js paint the horses by it.
import { mulberry32 } from '../core/rng.js';
import { COATS } from '../data/items.js';

// (each id's own stream, not his build's (stature.js) nor the other things
// his id picks: the way he falls, a knight's arms)
const SALT = 0x27d4eb2f;

const breeds = new Map();

// A breed's (a horse item's) coats, each with its weight: the first is the
// breed's own, its body the item's `coat`.
export function breedCoats(item) {
  let list = breeds.get(item.id);
  if (!list) {
    list = Object.entries(item.coats).map(([key, weight], i) => ({ key, ...COATS[key], ...(i ? {} : { body: item.coat }), weight }));
    breeds.set(item.id, list);
  }
  return list;
}

// A name's number (FNV-1a): a named rider's horse by his name, the same in
// every battle (an agent's id is not).
function nameSeed(name) {
  let h = 0x811c9dc5;
  for (let i = 0; i < name.length; i++) h = Math.imul(h ^ name.charCodeAt(i), 0x01000193);
  return h >>> 0;
}

// The coat of the horse of breed `item` ridden by `who`: a soldier's id, or
// a named rider's name (a companion's key). {key, name, body, mane, points,
// marks}
export function coatFor(item, who) {
  const seed = typeof who === 'string' ? nameSeed(who) : who;
  const rand = mulberry32((Math.imul(seed, 2654435761) ^ SALT) >>> 0);
  const list = breedCoats(item);
  let r = rand() * list.reduce((s, c) => s + c.weight, 0);
  let coat = list[list.length - 1];
  for (const c of list) {
    r -= c.weight;
    if (r < 0) {
      coat = c;
      break;
    }
  }
  return { ...coat, marks: rand() < item.marks };
}

// The breed's own coat, without markings: the player's horse, the same in
// every battle. Or a chosen one: COATS `key` (the breed's colour of it).
export function ownCoat(item, key = null, marks = false) {
  const list = breedCoats(item);
  const coat = list.find((c) => c.key === key) || (COATS[key] ? { key, ...COATS[key], weight: 0 } : list[0]);
  return { ...coat, marks };
}
