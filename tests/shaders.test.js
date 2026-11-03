// The soldiers' and horses' shaders (partmat.js) as the video card gets
// them, against what they were when their cost was last measured: stage 4.4
// (commit 16e61f2), the soldiers' fragment shader in 48 registers, so that
// the weak Intel cards run it at full width (partmat.js DECO_FRAGMENT). A
// change to them is measured again (bench.html?parts, and the registers),
// then its fingerprint here is updated with it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import * as THREE from 'three';
import { partLook, surface } from '../src/battle/partmat.js';

// the material's program as three.js would compile it: its key, its
// #defines, its vertex and fragment shaders
function program(material, lib) {
  const shader = { uniforms: {}, vertexShader: THREE.ShaderLib[lib].vertexShader, fragmentShader: THREE.ShaderLib[lib].fragmentShader };
  material.onBeforeCompile(shader);
  return JSON.stringify([material.customProgramCacheKey(), material.defines, shader.vertexShader, shader.fragmentShader]);
}
const fingerprint = (text) => crypto.createHash('sha256').update(text).digest('hex').slice(0, 16);

function material(kind) {
  const look = { palette: Object.fromEntries(kind.parts.map((p) => [p, surface('#808080', 0.8)])), layerOf: () => null };
  return partLook({}, kind, look).material;
}

test('the soldiers’ shaders are the ones measured (stage 4.4)', () => {
  const m = material({
    program: 'soldier',
    parts: ['Body', 'Hands', 'Hair', 'Gambeson', 'Surcoat'],
    tiles: { index: { linen: 0, wool: 1 }, repeat: { linen: 5, wool: 6 } },
    masks: true,
    deco: true,
    heraldry: { size: 128 },
  });
  assert.equal(fingerprint(program(m, 'standard')), 'd93ae8ccfb6bb630');
  assert.equal(fingerprint(program(m.userData.depth, 'depth')), '69a725777ca17ce3');
});

test('the horses’ shaders are the ones measured (stage 4.4)', () => {
  const m = material({ program: 'horse', parts: ['Body', 'Mane', 'Tail'], tiles: { index: {}, repeat: {} } });
  assert.equal(fingerprint(program(m, 'standard')), 'a76c41cccc73e3c5');
  assert.equal(fingerprint(program(m.userData.depth, 'depth')), '4ee9b73a37ac17bc');
});
