// Realistic trees (built by tools/trees/build_trees.py and packed into
// dist/characters.js): broadleaf trees and firs at real size, the trunk and
// branches with bark, the crown made of cards with real foliage. Three
// levels of detail: the full tree near the camera, a lighter one further and
// an impostor (two crossed pictures of the whole tree) far away. A Forest
// draws all trees of a battlefield instanced (one draw per variant and
// level) and sorts the trees into the levels on every frame; their shadows
// come from the lighter model, on a layer only the shadow pass draws.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { bytesOf, decodeLayers, SHADOW_LAYER } from './partmat.js';

// the full trees closer than LOD_DIST[0] metres, the lighter ones up to
// LOD_DIST[1], the impostors further; a tree changes its level only HYST
// metres past a limit (no flicker when the camera stands on it)
const LOD_DIST = [28, 60];
const HYST = 3;

let T = null;

export async function loadTrees(assets) {
  const gltf = await new Promise((resolve, reject) => new GLTFLoader().parse(bytesOf(assets.trees).buffer, '', resolve, reject));
  const geos = {};
  gltf.scene.traverse((o) => {
    if (o.isMesh) geos[o.name] = o.geometry;
  });
  const tex = assets.treeTextures;
  const kinds = {};
  for (const [name, k] of Object.entries(tex.kinds)) {
    const variants = [];
    for (let v = 0; v < k.variants; v++) {
      const g = (part, level) => {
        const geo = geos[`Tree_${name}_${v}_${part}_LOD${level}`];
        if (!geo) throw new Error(`no ${name} ${v} ${part} LOD${level}`);
        return geo;
      };
      const bark = [g('Bark', 0), g('Bark', 1)];
      const leaves = [g('Leaves', 0), g('Leaves', 1), g('Leaves', 2)];
      // bounds of the full tree (model space, the foot of the trunk at 0)
      const box = new THREE.Box3().setFromBufferAttribute(bark[0].attributes.position);
      box.union(new THREE.Box3().setFromBufferAttribute(leaves[0].attributes.position));
      variants.push({ bark, leaves, sphere: box.getBoundingSphere(new THREE.Sphere()) });
    }
    kinds[name] = {
      variants,
      atlas: await image(tex.atlasSize, k.atlas, THREE.SRGBColorSpace, false),
      bark: await image(tex.barkSize, [k.bark[0]], THREE.SRGBColorSpace, true),
      barkNormal: await image(tex.barkSize, [k.bark[1]], THREE.NoColorSpace, true),
    };
  }
  T = { kinds, atlasSize: tex.atlasSize };
}

export function treesReady() {
  return !!T;
}

// a colour image (+ its alpha image) as a texture with mipmaps
async function image(size, files, colorSpace, repeat) {
  const { texture } = await decodeLayers(size, { image: files }, colorSpace);
  const t = new THREE.DataTexture(texture.image.data, size, size);
  t.colorSpace = colorSpace;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 4;
  t.wrapS = t.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  t.needsUpdate = true;
  return t;
}

// ---------------------------------------------------------------------------
// Materials
// ---------------------------------------------------------------------------

// The wind bends the whole tree, more towards the top (model space: the
// trunk's foot at 0), each tree in its own rhythm; the leaves also flutter.
const SWAY = `
  #ifdef USE_INSTANCING
    vec3 treeAt = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
  #else
    vec3 treeAt = vec3(0.0);
  #endif
  float treePhase = treeAt.x * 0.071 + treeAt.z * 0.053;
  float treeBend = max(transformed.y, 0.0) * 0.08;
  treeBend *= treeBend;
  transformed.x += (sin(windTime * 0.8 + treePhase) * 0.7 + sin(windTime * 1.9 + treePhase * 2.3) * 0.3) * treeBend * 0.18;
  transformed.z += sin(windTime * 0.63 + treePhase * 1.7) * treeBend * 0.12;
  #ifdef TREE_LEAVES
    transformed += objectNormal * sin(windTime * 3.7 + dot(transformed, vec3(2.1, 1.3, 1.7)) + treePhase) * 0.035 * min(treeBend + 0.2, 1.0);
  #endif`;

// Far away the mipmaps average the leaves' alpha with the gaps between them
// and the crowns would thin out: the alpha is raised with the mipmap level
// (from the second one: nearer, the gaps stay).
const ALPHA_MIP = `
  #ifdef USE_MAP
  {
    vec2 tdx = dFdx(vMapUv * atlasSize);
    vec2 tdy = dFdy(vMapUv * atlasSize);
    float mip = max(0.0, 0.5 * log2(max(dot(tdx, tdx), dot(tdy, tdy))));
    diffuseColor.a *= 1.0 + 0.2 * max(mip - 1.0, 0.0);
  }
  #endif
  #include <alphatest_fragment>
  #ifdef TREE_PREPASS
    gl_FragColor = vec4(0.0);
    return;
  #endif`;

// A card takes the crown's normal on both sides (lit as one soft volume);
// where that normal points away from the camera (the far side of the crown,
// seen through the gaps) it is mirrored towards it: one sees the side of
// the leaves turned away from the light, not a sheen at a grazing angle.
const CROWN_NORMAL = THREE.ShaderChunk.normal_fragment_begin.replace(
  'normal *= faceDirection;',
  `float crownNV = dot(normal, normalize(vViewPosition));
  if (crownNV < 0.0) normal = normalize(normal - 2.0 * crownNV * normalize(vViewPosition));`,
);

// Leaves let sunlight through: they glow when one looks towards the sun
// (the sun is the last directional light; through other leaves, in their
// shadow, less).
const THROUGH = `
  #include <lights_fragment_begin>
  #if NUM_DIR_LIGHTS > 0
  {
    vec3 sunColor = directionalLights[NUM_DIR_LIGHTS - 1].color;
    float sunLit = dot(directLight.color, vec3(1.0)) / max(dot(sunColor, vec3(1.0)), 1e-4);
    float through = max(dot(normalize(-vViewPosition), directLight.direction), 0.0);
    reflectedLight.directDiffuse += diffuseColor.rgb * sunColor * (through * through * (0.3 + 0.7 * sunLit) * 0.9 * RECIPROCAL_PI);
  }
  #endif`;

// The impostor is two flat pictures: its normals lean towards the camera,
// so that it is lit like a round crown seen from there.
const FACING = `
  #include <defaultnormal_vertex>
  #ifdef TREE_IMPOSTOR
    transformedNormal = normalize(normalize(transformedNormal) + vec3(0.0, 0.0, 1.2));
  #endif`;

// Leaves are dark (they keep the light they do not let through): the sheen
// of the sky on them, at full strength, would wash their green out.
const DULL = `
  #include <lights_fragment_end>
  reflectedLight.indirectSpecular *= 0.35;
  reflectedLight.directSpecular *= 0.6;`;

// (invariant: the leaves' depth pass and colour pass place their vertices
// exactly alike, see materials())
function windy(material, wind, key, fragment) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.windTime = wind;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float windTime;\n#ifdef TREE_LEAVES\ninvariant gl_Position;\n#endif')
      .replace('#include <begin_vertex>', `#include <begin_vertex>\n${SWAY}`)
      .replace('#include <defaultnormal_vertex>', FACING);
    if (fragment) fragment(shader);
  };
  material.customProgramCacheKey = () => key;
  return material;
}

const cutout = (size, leaves) => (shader) => {
  shader.uniforms.atlasSize = { value: size };
  let f = shader.fragmentShader
    .replace('#include <common>', '#include <common>\nuniform float atlasSize;')
    .replace('#include <alphatest_fragment>', ALPHA_MIP);
  if (leaves) {
    f = f
      .replace('#include <normal_fragment_begin>', CROWN_NORMAL)
      .replace('#include <lights_fragment_begin>', THROUGH)
      .replace('#include <lights_fragment_end>', DULL);
  }
  shader.fragmentShader = f;
};

function materials(kind, wind) {
  const bark = windy(
    new THREE.MeshStandardMaterial({ map: kind.bark, normalMap: kind.barkNormal, vertexColors: true, roughness: 0.95, metalness: 0 }),
    wind,
    'tree-bark',
  );
  const leafMat = (key, defines) => {
    const m = windy(
      new THREE.MeshStandardMaterial({ map: kind.atlas, vertexColors: true, roughness: 0.85, metalness: 0, alphaTest: 0.5, side: THREE.DoubleSide }),
      wind,
      key,
      cutout(T.atlasSize, true),
    );
    m.defines = defines;
    return m;
  };
  // The cards of a crown lie on top of each other: their depth is drawn
  // first (only the cut-out, before everything else), then their colour
  // only where they are in front - each pixel of a crown is lit once.
  const leaves = leafMat('tree-leaves', { TREE_LEAVES: '' });
  const leavesDepth = leafMat('tree-leaves-depth', { TREE_LEAVES: '', TREE_PREPASS: '' });
  const impostor = leafMat('tree-impostor', { TREE_LEAVES: '', TREE_IMPOSTOR: '' });
  const impostorDepth = leafMat('tree-impostor-depth', { TREE_LEAVES: '', TREE_IMPOSTOR: '', TREE_PREPASS: '' });
  for (const m of [leaves, impostor]) m.depthWrite = false;
  for (const m of [leavesDepth, impostorDepth]) m.colorWrite = false;
  // the shadow pass copies map and alphaTest from the leaves
  const depth = windy(new THREE.MeshDepthMaterial(), wind, 'tree-depth', cutout(T.atlasSize, false));
  return { bark, leaves, leavesDepth, impostor, impostorDepth, depth };
}

// ---------------------------------------------------------------------------
// Forest
// ---------------------------------------------------------------------------

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _p = new THREE.Vector3();
const _s = new THREE.Vector3();
const _c = new THREE.Vector3();
const _frustum = new THREE.Frustum();

const inside = (planes, x, y, z, r) => {
  for (let k = 0; k < 6; k++) {
    const p = planes[k];
    if (p.normal.x * x + p.normal.y * y + p.normal.z * z + p.constant < -r) return false;
  }
  return true;
};

// The trees of a battlefield. `list`: [{kind, variant, x, y, z, scale, yaw,
// tilt: [x, z], tint: THREE.Color}] (kind: 'oak' or 'fir'; y: the foot of
// the trunk). `shadows`: whether the trees cast shadows.
export class Forest {
  constructor(list, { shadows = true } = {}) {
    this.group = new THREE.Group();
    // (the benchmark hides the trees by this name)
    this.group.name = 'vegetation';
    this.wind = { value: 0 };
    this.shadows = shadows;
    const n = list.length;
    this.n = n;
    this.bounds = new Float32Array(n * 4);
    this.mats = new Float32Array(n * 16);
    this.tints = new Float32Array(n * 3);
    this.level = new Int8Array(n).fill(-1);
    this.setOf = new Uint16Array(n);
    this.dist = new Float32Array(n);
    this.order = [];
    this.sets = [];
    // the camera's matrices at the last update (doubles, like the matrices)
    this.last = new Float64Array(32);

    const mats = {};
    const index = new Map();
    list.forEach((t, i) => {
      const kind = T.kinds[t.kind];
      const v = kind.variants[t.variant % kind.variants.length];
      const key = `${t.kind}:${t.variant % kind.variants.length}`;
      if (!index.has(key)) {
        index.set(key, this.sets.length);
        if (!mats[t.kind]) mats[t.kind] = materials(kind, this.wind);
        this.sets.push({ v, mat: mats[t.kind], n: 0 });
      }
      const s = index.get(key);
      this.setOf[i] = s;
      this.sets[s].n++;
      _q.setFromEuler(_e.set(t.tilt ? t.tilt[0] : 0, t.yaw, t.tilt ? t.tilt[1] : 0));
      _m.compose(_p.set(t.x, t.y, t.z), _q, _s.setScalar(t.scale));
      _m.toArray(this.mats, i * 16);
      _c.copy(v.sphere.center).applyMatrix4(_m);
      this.bounds.set([_c.x, _c.y, _c.z, v.sphere.radius * t.scale], i * 4);
      t.tint.toArray(this.tints, i * 3);
    });

    // per set: an instance list per level (the bark and the leaves of a level
    // share it) and one of the shadow casters (the lighter model)
    for (const set of this.sets) {
      const { v, mat, n: cap } = set;
      const list = (parts, opts) => {
        const matrix = new THREE.InstancedBufferAttribute(new Float32Array(cap * 16), 16).setUsage(THREE.DynamicDrawUsage);
        const color = opts.tint ? new THREE.InstancedBufferAttribute(new Float32Array(cap * 3), 3).setUsage(THREE.DynamicDrawUsage) : null;
        const meshes = [];
        const add = (geo, m, opt) => {
          const mesh = new THREE.InstancedMesh(geo, m, 0);
          mesh.instanceMatrix = matrix;
          if (opt.tinted) mesh.instanceColor = color;
          mesh.frustumCulled = false;
          mesh.castShadow = !!opts.cast;
          mesh.receiveShadow = !!opts.receive;
          if (opt.first) mesh.renderOrder = -1;
          mesh.visible = false;
          this.group.add(mesh);
          meshes.push(mesh);
          return mesh;
        };
        for (const [geo, m, tinted] of parts) {
          if (opts.cast) {
            const mesh = add(geo, m, {});
            mesh.layers.set(SHADOW_LAYER);
            if (m === mat.leaves) mesh.customDepthMaterial = mat.depth;
            continue;
          }
          // the depth pass of the leaves (see materials())
          if (m === mat.leaves) add(geo, mat.leavesDepth, { first: true }).userData.depthPass = true;
          if (m === mat.impostor) add(geo, mat.impostorDepth, { first: true }).userData.depthPass = true;
          add(geo, m, { tinted });
        }
        return { meshes, matrix, color, k: 0, shown: -1 };
      };
      set.levels = [
        list([[v.bark[0], mat.bark], [v.leaves[0], mat.leaves, true]], { receive: true, tint: true }),
        list([[v.bark[1], mat.bark], [v.leaves[1], mat.leaves, true]], { receive: true, tint: true }),
        list([[v.leaves[2], mat.impostor, true]], { tint: true }),
      ];
      set.shadow = shadows ? list([[v.bark[1], mat.bark], [v.leaves[1], mat.leaves]], { cast: true }) : null;
    }
    this.byDistance = (a, b) => this.dist[a] - this.dist[b];
    this.depthPass = true;
    this.materials = Object.values(mats);
  }

  // The leaves with (true) or without their depth pass (for the benchmark).
  setDepthPass(on) {
    this.depthPass = on;
    for (const m of this.materials) m.leaves.depthWrite = m.impostor.depthWrite = !on;
    for (const s of this.sets) for (const l of s.levels) l.shown = -1;
    this.last.fill(0);
  }

  // Sorts the trees in view into the levels (near to far: the near crowns
  // hide the far ones before these are shaded) and the ones whose shadow can
  // fall into the shadow map into the casters. Nothing to do while the
  // camera stands still.
  update(camera, light) {
    const e = camera.matrixWorld.elements;
    const pr = camera.projectionMatrix.elements;
    let same = true;
    for (let k = 0; k < 16; k++) {
      if (this.last[k] !== e[k] || this.last[16 + k] !== pr[k]) {
        same = false;
        break;
      }
    }
    if (same) return;
    this.last.set(e);
    this.last.set(pr, 16);

    _m.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    _frustum.setFromProjectionMatrix(_m);
    const view = _frustum.planes;
    let sun = null;
    if (this.shadows && light && light.castShadow) {
      light.shadow.updateMatrices(light);
      sun = light.shadow.getFrustum().planes;
    }
    for (const s of this.sets) {
      for (const l of s.levels) l.k = 0;
      if (s.shadow) s.shadow.k = 0;
    }
    const { x: cx, y: cy, z: cz } = camera.position;
    const b = this.bounds;
    const order = this.order;
    order.length = 0;
    for (let i = 0; i < this.n; i++) {
      const x = b[i * 4];
      const y = b[i * 4 + 1];
      const z = b[i * 4 + 2];
      const r = b[i * 4 + 3];
      if (sun && inside(sun, x, y, z, r)) this.put(this.sets[this.setOf[i]].shadow, i);
      if (!inside(view, x, y, z, r)) continue;
      this.dist[i] = Math.hypot(x - cx, y - cy, z - cz);
      order.push(i);
    }
    order.sort(this.byDistance);
    for (const i of order) {
      const d = this.dist[i];
      let lv = this.level[i];
      const want = d < LOD_DIST[0] ? 0 : d < LOD_DIST[1] ? 1 : 2;
      if (want !== lv && (lv < 0 || Math.abs(want - lv) > 1 || Math.abs(d - LOD_DIST[Math.min(want, lv)]) > HYST)) {
        lv = this.level[i] = want;
      }
      this.put(this.sets[this.setOf[i]].levels[lv], i);
    }
    for (const s of this.sets) {
      for (const l of s.levels) this.done(l);
      if (s.shadow) this.done(s.shadow);
    }
  }

  put(l, i) {
    const a = l.matrix.array;
    const m = this.mats;
    const o = l.k * 16;
    const s = i * 16;
    for (let j = 0; j < 16; j++) a[o + j] = m[s + j];
    if (l.color) {
      const c = l.color.array;
      c[l.k * 3] = this.tints[i * 3];
      c[l.k * 3 + 1] = this.tints[i * 3 + 1];
      c[l.k * 3 + 2] = this.tints[i * 3 + 2];
    }
    l.k++;
  }

  // uploads only the part of the lists in use
  done(l) {
    if (l.k === 0 && l.shown === 0) return;
    l.shown = l.k;
    for (const m of l.meshes) {
      m.count = l.k;
      m.visible = l.k > 0 && (this.depthPass || !m.userData.depthPass);
    }
    if (l.k === 0) return;
    for (const a of l.color ? [l.matrix, l.color] : [l.matrix]) {
      a.clearUpdateRanges();
      a.addUpdateRange(0, l.k * a.itemSize);
      a.needsUpdate = true;
    }
  }

  setTime(time) {
    this.wind.value = time;
  }
}
