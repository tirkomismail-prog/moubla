// The soldiers' and horses' shaders (partmat.js) as the video card gets
// them, against what they were when their cost was last measured: stage 4.4
// (commit 16e61f2), the soldiers' fragment shader in 48 registers, so that
// the weak Intel cards run it at full width (partmat.js DECO_FRAGMENT). A
// change to them is measured again (bench.html?parts, and the registers),
// then its fingerprint here is updated with it.
// Since 16e61f2: the sign's code (vDeco) is no longer a flat varying, for
// which ANGLE on Direct3D 11 ran a geometry shader on every soldier
// triangle. The code is the same at a triangle's three vertices (each
// triangle is of one part), but interpolated it can come out off by a share
// of it (SwiftShader: up to ~1e-4, and a coat's code of 61453 lost its arms
// in rare pixels), so the vertex shader keeps it below 4096: a coat's layer
// moved down from bits 12-16 to 3-7 (the fragment shader reads it there;
// nothing else changed in it). The picture is the same. It is measured on
// the laptop by the benchmark's soldiersFlat part (bench.js: this program
// with the code flat again against it, still frames from the orbit and up
// close). The horses' text changed with it only inside #ifdef PART_DECO,
// which they do not define: the same program.
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

test('the soldiers’ shaders are the ones measured (stage 4.4, vDeco not flat)', () => {
  const m = material({
    program: 'soldier',
    parts: ['Body', 'Hands', 'Hair', 'Gambeson', 'Surcoat'],
    tiles: { index: { linen: 0, wool: 1 }, repeat: { linen: 5, wool: 6 } },
    masks: true,
    deco: true,
    heraldry: { size: 128 },
  });
  assert.equal(fingerprint(program(m, 'standard')), '3a23dc1a2a8cc2f2');
  assert.equal(fingerprint(program(m.userData.depth, 'depth')), '69a725777ca17ce3');
});

test('the horses’ shaders are the ones measured (stage 4.4)', () => {
  const m = material({ program: 'horse', parts: ['Body', 'Mane', 'Tail'], tiles: { index: {}, repeat: {} } });
  assert.equal(fingerprint(program(m, 'standard')), '44d8da97345618bf');
  assert.equal(fingerprint(program(m.userData.depth, 'depth')), '4ee9b73a37ac17bc');
});
