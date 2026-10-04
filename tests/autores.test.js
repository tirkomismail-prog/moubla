import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AutoResolution } from '../src/battle/autores.js';

// a renderer whose context has the timer queries (the times are fed in by hand)
const renderer = (timers = true) => ({ getContext: () => ({ getExtension: () => (timers ? {} : null) }) });

// `frames` frames 1/30 s apart, each taking cost(scale) ms of GPU time (or,
// without the timer queries, that long between frames)
function run(ar, cost, frames) {
  for (let i = 0; i < frames; i++) {
    const ms = cost(ar.scale);
    if (ar.ext) ar.times.push(ms);
    ar.update(ar.ext ? 1 / 30 : ms / 1000);
  }
}
// most of a frame's cost goes with the pixels
const pixels = (ms) => (s) => ms * s * s;

test('the resolution goes down while the frames take too long, to a floor', () => {
  const ar = new AutoResolution(renderer());
  run(ar, pixels(40), 300);
  assert.ok(ar.scale < 1 && ar.scale >= 0.8, `scale ${ar.scale}`);
  run(ar, pixels(120), 600);
  assert.equal(ar.scale, 0.6);
});

test('it comes back up when there is room, never above the setting', () => {
  const ar = new AutoResolution(renderer());
  run(ar, pixels(100), 600);
  assert.equal(ar.scale, 0.6);
  run(ar, pixels(10), 600);
  assert.equal(ar.scale, 1);
});

test('frames within the budget leave it as it is', () => {
  const ar = new AutoResolution(renderer());
  run(ar, () => 24, 600);
  assert.equal(ar.scale, 1);
});

test('without timer queries only frames that missed lower it', () => {
  const ar = new AutoResolution(renderer(false));
  run(ar, () => 1000 / 30, 600);
  assert.equal(ar.scale, 1);
  run(ar, pixels(50), 300);
  assert.ok(ar.scale < 1, `scale ${ar.scale}`);
});

test('a step down that does not help is undone and not tried again soon', () => {
  const ar = new AutoResolution(renderer());
  // the frames take 40 ms whatever the resolution (the processor is slow)
  let lowest = 1;
  for (let i = 0; i < 20; i++) {
    run(ar, () => 40, 30);
    lowest = Math.min(lowest, ar.scale);
  }
  assert.equal(ar.scale, 1);
  // one try, then none for a while
  assert.ok(lowest >= 0.8, `lowest ${lowest}`);
});
