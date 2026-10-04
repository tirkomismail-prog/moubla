// Visual environment of a battle: sky, sun, image based lighting, fog and
// post-processing, driven by a graphics quality preset.
import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { FXAAPass } from 'three/examples/jsm/postprocessing/FXAAPass.js';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

export const GFX_PRESETS = {
  // aa: anti-aliasing (MSAA doubles the frame time on integrated GPUs, FXAA is
  // a cheap full-screen filter); maxPixelRatio caps rendering on HiDPI screens
  low: { name: 'Низька', standard: false, sky: false, post: false, ao: false, aa: 'none', grass: 0, shadowSize: 1024, shadows: false, msaa: 0, maxPixelRatio: 1 },
  medium: { name: 'Середня', standard: true, sky: true, post: true, ao: false, aa: 'fxaa', grass: 9000, shadowSize: 2048, shadows: true, msaa: 0, maxPixelRatio: 1 },
  high: { name: 'Висока', standard: true, sky: true, post: true, ao: true, aa: 'msaa', grass: 22000, shadowSize: 4096, shadows: true, msaa: 4, maxPixelRatio: 1.5 },
};

// The order of the opaque things (three.js draws by renderOrder first): the
// ground after everything standing on it, the sky last. What covers them is
// drawn by then, their hidden pixels are skipped by the depth test.
export const DRAW_ORDER = { ground: 1, sky: 2 };

export function gfxPreset(settings) {
  return GFX_PRESETS[settings.graphics] || GFX_PRESETS.medium;
}

// Sun direction, colours and intensities for an hour of the day.
// `dome` is the sky light used for image based lighting: zenith, horizon.
function lighting(hour) {
  if (hour < 5 || hour >= 21) {
    return { night: true, elev: 0.75, sunCol: '#a8bcff', sunI: 0.75, hemiI: 0.35, envI: 1.0, exposure: 1.3, dome: ['#101d40', '#2a3960'] };
  }
  if (hour < 7.5 || hour >= 18.5) {
    return { night: false, elev: 0.09, sunCol: '#ffb77a', sunI: 2.6, hemiI: 0.45, envI: 0.75, exposure: 0.9, dome: ['#4a5f95', '#e6a67c'] };
  }
  const noon = 1 - Math.abs(hour - 13) / 6;
  return { night: false, elev: 0.35 + noon * 0.55, sunCol: '#fff1dc', sunI: 3.0, hemiI: 0.55, envI: 0.8, exposure: 0.85, dome: ['#5b8fd0', '#d4e2ec'] };
}

export class Environment {
  constructor(battle, hour) {
    this.battle = battle;
    const scene = battle.scene;
    const renderer = battle.renderer;
    const preset = battle.gfx;
    const pal = battle.terrain.pal;
    const L = lighting(hour);
    this.night = L.night;
    const az = 0.6 + (hour / 24) * Math.PI;
    this.sunDir = new THREE.Vector3(Math.cos(az) * Math.cos(L.elev), Math.sin(L.elev), Math.sin(az) * Math.cos(L.elev)).normalize();

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = preset.standard ? L.exposure : 1;

    // --- lights
    // with image based lighting the hemisphere light only adds a little bounce
    const hemi = new THREE.HemisphereLight(L.night ? '#35456e' : '#bcd4f0', L.night ? '#101418' : pal.grass, preset.standard ? L.hemiI * 0.25 : L.hemiI * 2.4);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(L.sunCol, preset.standard ? L.sunI : L.sunI * 0.75);
    sun.castShadow = preset.shadows && battle.settings.shadows !== false;
    sun.shadow.mapSize.set(preset.shadowSize, preset.shadowSize);
    const sc = sun.shadow.camera;
    sc.left = -45;
    sc.right = 45;
    sc.top = 45;
    sc.bottom = -45;
    sc.near = 1;
    sc.far = 320;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.04;
    scene.add(sun, sun.target);
    this.sun = sun;

    // --- sky
    let fogCol;
    if (L.night) {
      fogCol = '#1a2340';
      this.sky = gradientDome('#070d22', '#26345a');
    } else if (preset.sky) {
      const sky = new Sky();
      sky.scale.setScalar(1000);
      const u = sky.material.uniforms;
      u.turbidity.value = battle.terrain.type === 'steppe' || battle.terrain.type === 'desert' ? 8 : 5;
      u.rayleigh.value = L.elev < 0.2 ? 2.4 : 1.4;
      u.mieCoefficient.value = 0.004;
      u.mieDirectionalG.value = 0.82;
      u.sunPosition.value.copy(this.sunDir).multiplyScalar(1000);
      // the sun stands still during a battle: the sky is drawn once into a
      // cube map instead of on every pixel of every frame
      this.skyTarget = bakeSky(renderer, sky);
      // shown by a triangle over the screen drawn after everything else,
      // only where nothing covers it (the scene's background is drawn
      // first, on every pixel);
      // not with ambient occlusion, whose pass draws the scene's normals
      // with its own material (the sky would cover them)
      this.sky = preset.ao ? null : skyScreen(this.skyTarget.texture);
      fogCol = L.elev < 0.2 ? '#d3a88c' : pal.fog;
    } else {
      fogCol = L.elev < 0.2 ? '#c8a088' : pal.fog;
      this.sky = gradientDome(L.elev < 0.2 ? '#5a6aa0' : pal.sky[0], L.elev < 0.2 ? '#f0a870' : pal.sky[1]);
    }
    if (this.sky) {
      this.sky.renderOrder = DRAW_ORDER.sky;
      scene.add(this.sky);
    }
    scene.background = this.skyTarget && !this.sky ? this.skyTarget.texture : new THREE.Color(fogCol);
    const far = battle.config.kind === 'arena' ? 260 : 460;
    scene.fog = preset.standard ? new THREE.FogExp2(fogCol, L.night ? 0.009 : 0.0042) : new THREE.Fog(fogCol, 70, far);

    // --- image based lighting (makes metal and cloth read properly). It comes
    // from a simple sky dome with a soft sun glow rather than from the physical
    // sky shader, whose raw radiance is far too strong to light the scene with.
    if (preset.standard) {
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envScene = new THREE.Scene();
      const ground = new THREE.Color(L.night ? '#0c1016' : pal.grass).multiplyScalar(0.55);
      const dome = gradientDome(L.dome[0], L.dome[1], ground, this.sunDir, new THREE.Color(L.sunCol).multiplyScalar(L.night ? 0.2 : 1.6));
      envScene.add(dome);
      const rt = pmrem.fromScene(envScene, 0.04, 0.1, 2000);
      scene.environment = rt.texture;
      scene.environmentIntensity = L.envI;
      this.envRT = rt;
      pmrem.dispose();
      dome.geometry.dispose();
      dome.material.dispose();
    }
  }

  // keep the shadow frustum and sky centred on what the camera looks at
  follow(pivot, camera) {
    const d = this.sunDir;
    this.sun.position.set(pivot.x + d.x * 150, pivot.y + d.y * 150, pivot.z + d.z * 150);
    this.sun.target.position.copy(pivot);
    if (this.sky) this.sky.position.copy(camera.position);
  }

  dispose() {
    if (this.envRT) this.envRT.dispose();
    if (this.skyTarget) this.skyTarget.dispose();
    if (this.sky) {
      this.sky.geometry.dispose();
      this.sky.material.dispose();
    }
  }
}

// The physical sky drawn once into a cube map (linear, the renderer tone maps
// the background like any sky); the sky mesh is not needed afterwards.
function bakeSky(renderer, sky) {
  const target = new THREE.WebGLCubeRenderTarget(256, { type: THREE.HalfFloatType });
  const scene = new THREE.Scene();
  scene.add(sky);
  new THREE.CubeCamera(1, 2000, target).update(renderer, scene);
  sky.geometry.dispose();
  sky.material.dispose();
  return target;
}

// The baked sky (a cube map) drawn after the opaque things and only where
// none of them was drawn: one triangle over the whole screen just in front
// of the far plane (so that it passes the depth test against the cleared
// depth), each pixel looking the sky up in its own direction. (A box around
// the camera with its depth pushed to the far plane is cut by the near
// plane behind the camera, and some rasterisers then give those pieces a
// depth in front of everything.)
function skyScreen(texture) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  const mat = new THREE.ShaderMaterial({
    name: 'SkyScreen',
    uniforms: { envMap: { value: texture }, skyMatrix: { value: new THREE.Matrix4() } },
    vertexShader: `
      varying vec2 vNdc;
      void main() {
        vNdc = position.xy;
        gl_Position = vec4(position.xy, 0.99999, 1.0);
      }`,
    fragmentShader: `
      uniform samplerCube envMap;
      uniform mat4 skyMatrix;
      varying vec2 vNdc;
      void main() {
        vec4 p = skyMatrix * vec4(vNdc, 1.0, 1.0);
        gl_FragColor = vec4(textureCube(envMap, normalize(p.xyz / p.w)).rgb, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    depthWrite: false,
    fog: false,
  });
  const sky = new THREE.Mesh(geo, mat);
  sky.frustumCulled = false;
  // a point of the screen to its direction in the world: the projection
  // undone, then the camera's turn
  const turn = new THREE.Matrix4();
  sky.onBeforeRender = (renderer, scene, camera) => {
    turn.extractRotation(camera.matrixWorld);
    mat.uniforms.skyMatrix.value.multiplyMatrices(turn, camera.projectionMatrixInverse);
  };
  return sky;
}

// Sky dome: zenith/horizon gradient, optional ground colour below the
// horizon and an optional glow around the sun.
function gradientDome(top, horizon, ground = null, sunDir = null, sunCol = null) {
  const geo = new THREE.SphereGeometry(900, 32, 16);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      top: { value: new THREE.Color(top) },
      horizon: { value: new THREE.Color(horizon) },
      ground: { value: new THREE.Color(ground || horizon) },
      sunDir: { value: sunDir ? sunDir.clone() : new THREE.Vector3(0, 1, 0) },
      sunCol: { value: sunCol ? new THREE.Color(sunCol) : new THREE.Color(0, 0, 0) },
      hasGround: { value: ground ? 1 : 0 },
    },
    vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform vec3 top; uniform vec3 horizon; uniform vec3 ground; uniform vec3 sunDir; uniform vec3 sunCol; uniform float hasGround; varying vec3 vP;
      void main(){
        vec3 d = normalize(vP);
        vec3 c = mix(horizon, top, pow(clamp(d.y * 1.4 + 0.05, 0.0, 1.0), 0.7));
        if (hasGround > 0.5) c = mix(c, ground, smoothstep(0.0, -0.08, d.y));
        float s = max(dot(d, sunDir), 0.0);
        c += sunCol * (pow(s, 8.0) * 0.5 + pow(s, 64.0) * 2.0);
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  return new THREE.Mesh(geo, mat);
}

// The post-processing a preset needs: without ambient occlusion and MSAA
// (medium) the light FastPost, else the full chain.
export function createPost(renderer, scene, camera, preset) {
  if (!preset.ao && !preset.msaa && preset.aa === 'fxaa') return new FastPost(renderer, scene, camera);
  return new PostFX(renderer, scene, camera, preset);
}

// FXAA in its light form (as FXAA 3.11's console version): four looks
// between the pixels and the pixel itself; where they differ enough, two or
// four more along the edge. three.js's FXAAShader looks up 9 to 22 times per
// pixel, on a textured field nearly everywhere (it costs several
// milliseconds on integrated graphics).
const LIGHT_FXAA = `
  uniform sampler2D tDiffuse;
  uniform vec2 resolution;
  varying vec2 vUv;
  float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
  void main() {
    vec4 m = texture(tDiffuse, vUv);
    // (each the mean of four pixels: half a pixel off, bilinear)
    float nw = luma(texture(tDiffuse, vUv + vec2(-0.5, 0.5) * resolution).rgb);
    float ne = luma(texture(tDiffuse, vUv + vec2(0.5, 0.5) * resolution).rgb);
    float sw = luma(texture(tDiffuse, vUv + vec2(-0.5, -0.5) * resolution).rgb);
    float se = luma(texture(tDiffuse, vUv + vec2(0.5, -0.5) * resolution).rgb);
    float lm = luma(m.rgb);
    float lo = min(lm, min(min(nw, ne), min(sw, se)));
    float hi = max(lm, max(max(nw, ne), max(sw, se)));
    if (hi - lo < max(0.04, hi * 0.125)) {
      gl_FragColor = m;
      return;
    }
    // across the edge, blurred along it
    vec2 dir = vec2((sw + se) - (nw + ne), (nw + sw) - (ne + se));
    float reduce = max((nw + ne + sw + se) * 0.03125, 1.0 / 128.0);
    dir = clamp(dir / (min(abs(dir.x), abs(dir.y)) + reduce), -8.0, 8.0) * resolution;
    vec3 a = 0.5 * (texture(tDiffuse, vUv - dir / 6.0).rgb + texture(tDiffuse, vUv + dir / 6.0).rgb);
    vec3 b = 0.5 * a + 0.25 * (texture(tDiffuse, vUv - dir * 0.5).rgb + texture(tDiffuse, vUv + dir * 0.5).rgb);
    float lb = luma(b);
    gl_FragColor = vec4(lb < lo || lb > hi ? a : b, m.a);
  }`;

// FXAA alone, cheaply: the scene is drawn straight into an 8-bit target
// that three.js treats like the screen (the materials tone map and encode
// for display themselves), then one FXAA pass (LIGHT_FXAA) puts it on the
// screen. No half-float buffer and no separate tone mapping pass.
export class FastPost {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.UnsignedByteType });
    this.target.texture.colorSpace = THREE.SRGBColorSpace;
    // stored as the materials write it (already encoded), read as such
    this.target.texture.internalFormat = 'RGBA8';
    this.target.isXRRenderTarget = true;
    this.material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(FXAAShader.uniforms),
      vertexShader: FXAAShader.vertexShader,
      fragmentShader: LIGHT_FXAA,
      depthTest: false,
      depthWrite: false,
    });
    this.material.uniforms.tDiffuse.value = this.target.texture;
    this.quad = new FullScreenQuad(this.material);
    this.resize(window.innerWidth, window.innerHeight, renderer.getPixelRatio());
  }

  render() {
    const r = this.renderer;
    r.setRenderTarget(this.target);
    r.render(this.scene, this.camera);
    r.setRenderTarget(null);
    this.quad.render(r);
  }

  resize(w, h, pixelRatio = this.renderer.getPixelRatio()) {
    const W = Math.max(1, Math.floor(w * pixelRatio));
    const H = Math.max(1, Math.floor(h * pixelRatio));
    this.target.setSize(W, H);
    this.material.uniforms.resolution.value.set(1 / W, 1 / H);
  }

  dispose() {
    this.target.dispose();
    this.material.dispose();
    this.quad.dispose();
  }
}

// Post-processing chain: ambient occlusion, tone mapping, then FXAA.
export class PostFX {
  constructor(renderer, scene, camera, preset) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const pr = renderer.getPixelRatio();
    const rt = new THREE.WebGLRenderTarget(Math.floor(w * pr), Math.floor(h * pr), { type: THREE.HalfFloatType, samples: preset.msaa });
    this.composer = new EffectComposer(renderer, rt);
    this.composer.addPass(new RenderPass(scene, camera));
    if (preset.ao) {
      const ao = new GTAOPass(scene, camera, w, h);
      ao.output = GTAOPass.OUTPUT.Default;
      ao.blendIntensity = 0.85;
      ao.updateGtaoMaterial({ radius: 0.9, distanceExponent: 1.4, thickness: 1.2, scale: 1.1, samples: 12 });
      ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 4, rings: 2, samples: 12 });
      this.composer.addPass(ao);
      this.ao = ao;
    }
    this.composer.addPass(new OutputPass());
    if (preset.aa === 'fxaa') this.composer.addPass(new FXAAPass());
  }

  render() {
    this.composer.render();
  }

  resize(w, h, pixelRatio) {
    if (pixelRatio) this.composer.setPixelRatio(pixelRatio);
    this.composer.setSize(w, h);
  }

  dispose() {
    this.composer.dispose();
    if (this.ao) this.ao.dispose();
  }
}
