// Each soldier's build (stage 4.5): a little taller or shorter than the
// model, stockier or slimmer, broader or narrower in the shoulders, his head
// a little larger or smaller, by his id (the same id, the same man: no
// Math.random). Plain numbers, kept apart from the scene so that the tests
// can run them in node: character.js and models.js shape the bodies by
// them, agent.js, projectiles.js and battle.js follow his height.
import { mulberry32 } from '../core/rng.js';

// The model as it is: the player stays so (his camera, his reach and the
// feel of his fights as they were).
export const NEUTRAL = Object.freeze({ height: 1, waist: 1, ribs: 1, chest: 1, shoulders: 1, head: 1 });

// The spreads, the most a man is off the model (of its size): his height
// (a man of 1.75 m from 1.63 to 1.87 m); his build: the width and depth of
// his waist (his hips and belly) and, less, of his chest (his ribs between
// them); his collarbones' length, of his own (his shoulders 2 mm a side
// wider or narrower), besides his build's; his head's (and neck's) own
// size. (More than this, and the garments round his armpits and his chin
// part: a mail shirt shows through a surcoat's armhole, the chin through a
// coif.)
export const SPREAD = { height: 0.07, waist: 0.06, chest: 0.035, shoulders: 0.01, head: 0.015 };
// His arms are as far out as his chest is wider, by his armpits: his
// collarbones longer by ARMS_OUT times the share his chest is wider (the
// model's chest stands CHEST_SIDE m out to the side there, its collarbones
// are CLAVICLE m long; the garments round his armpits keep together so).
// The model's hips stand HIP_SIDE m out by its hanging hands. A taller man's
// head is smaller for his height (as a head grows less than the body), this
// power of his height.
export const CLAVICLE = 0.165;
const CHEST_SIDE = 0.165;
const HIP_SIDE = 0.175;
const ARMS_OUT = CHEST_SIDE / CLAVICLE;
const HEAD_FOLLOWS = -0.3;
// The spreads' shape: tanh of a normal deviate times this. Two in three men
// are within half the spread, one in a thousand beyond 0.95 of it; none
// beyond it.
const BELL = 0.568;

// (each id's own stream, not that of the other things his id picks: the
// way he falls, a knight's arms)
const SALT = 0x5bd1e995;

// A number in (-1, 1), bell-shaped (BELL), from two uniform ones.
function bell(rand) {
  const z = Math.sqrt(-2 * Math.log(1 - rand())) * Math.cos(2 * Math.PI * rand());
  return Math.tanh(BELL * z);
}

// The build of the soldier with the id `id`: his height, the width and
// depth of his waist, ribs and chest, his collarbones' length and his head's
// size (its share of his height's), each a factor of the model's.
export function stature(id) {
  const rand = mulberry32((Math.imul(id, 2654435761) ^ SALT) >>> 0);
  const height = bell(rand);
  const build = bell(rand);
  const shoulders = bell(rand);
  const head = bell(rand);
  const h = 1 + SPREAD.height * height;
  return {
    height: h,
    waist: 1 + SPREAD.waist * build,
    ribs: 1 + ((SPREAD.waist + SPREAD.chest) / 2) * build,
    chest: 1 + SPREAD.chest * build,
    shoulders: 1 + ARMS_OUT * SPREAD.chest * build + SPREAD.shoulders * shoulders,
    head: Math.pow(h, HEAD_FOLLOWS) * (1 + SPREAD.head * head),
  };
}

// How much farther out than his collarbones put them his hands hang, for
// his hips to be as far from them as the model's (m, of the model's size;
// less than 0: farther in).
export function handsOut(st) {
  return HIP_SIDE * (st.waist - 1) - CLAVICLE * (st.shoulders - 1);
}

// Heights on the model standing (m above his feet): the root of his neck
// (above it he is his head's size: his neck with his head, so that a hood or
// a coif round both fits), his hips (the pelvis bone). Sitting a horse his
// hips are SEAT above the ground (the saddle carries them: the horse is the
// same under any man) and the rest of him RISE higher than standing.
const NECK = 1.48;
const PELVIS = 0.93;
const SEAT = 1.645;
const RISE = SEAT - PELVIS;

// Where a point of the model at height `y` (m above his feet; on a horse
// above the ground under it) is on a man of stature `st`: standing, scaled
// with him from his feet; on a horse, from his hips in the saddle; above the
// root of his neck, by his head's size too.
export function scaledY(st, y, mounted = false) {
  const base = mounted ? SEAT : 0;
  const joint = NECK + (mounted ? RISE : 0);
  const h = st.height;
  if (y <= joint) return base + (y - base) * h;
  return base + (joint - base + (y - joint) * st.head) * h;
}

// The model's eyes (Agent.headPos), standing and on a horse.
export const EYES = 1.62;
export const EYES_MOUNTED = EYES + RISE;

// Where missiles hit a man (projectiles.js): a capsule round the line from
// `base` to `top` (the top of his head, m above his feet or the ground under
// his horse), his head from `head` up; the model's standing and on a horse.
const ZONE = { base: 0.1, top: 1.75, head: 1.55 };
const ZONE_MOUNTED = { base: 1.55, top: ZONE.top + RISE, head: 2.3 };

// The hit zone of a man of stature `st` (scaledY) into `out`.
export function hitZone(st, mounted = false, out = {}) {
  const z = mounted ? ZONE_MOUNTED : ZONE;
  out.base = scaledY(st, z.base, mounted);
  out.top = scaledY(st, z.top, mounted);
  out.head = scaledY(st, z.head, mounted);
  return out;
}
