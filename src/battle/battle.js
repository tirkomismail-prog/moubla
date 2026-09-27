// A 3D battle: scene setup, spawning, player control, orders, combat
// resolution, end conditions and results.
import * as THREE from 'three';
import { TROOPS } from '../data/troops.js';
import { ITEMS } from '../data/items.js';
import { clamp, wrapAngle, shade } from '../core/util.js';
import { BattleTerrain } from './terrain.js';
import { Agent } from './agent.js';
import { aiControl } from './ai.js';
import { Projectiles } from './projectiles.js';
import { BattleHud } from './hud.js';
import { BattleInput } from './input.js';
import { Effects } from './effects.js';
import { gfxPreset, Environment, PostFX } from './graphics.js';
import { setMaterialQuality } from './models.js';
import { Props } from './props.js';
import { T, findMeleeTarget, isBlocked, attackDamage, computeDamage, speedBonus, requiredBlock } from './combat.js';
import { autoResolve } from '../world/autoresolve.js';
import { h } from '../ui/dom.js';

const GROUP_OF_TYPE = { inf: 'inf', arch: 'arch', cav: 'cav', harch: 'cav' };
const BLOCK_TO_HUD = { left: 'left', right: 'right', up: 'up', down: 'down' };
const ARENA_LOADOUTS = [
  { weapons: ['train_sword'], shield: 'shield_wood', armor: 'padded', helmet: 'leather_cap' },
  { weapons: ['train_greatsword'], shield: null, armor: 'padded', helmet: 'nasal' },
  { weapons: ['train_spear'], shield: 'shield_round', armor: 'leather', helmet: null },
  { weapons: ['train_sword'], shield: 'shield_kite', armor: 'gambeson', helmet: 'kettle' },
];

function lighten(hex, f) {
  return shade(hex, f);
}

function toHex(c) {
  if (c.startsWith('#')) return c;
  const m = c.match(/\d+/g).map(Number);
  return `#${m.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

export class Battle {
  constructor(game, root, config, onFinish) {
    this.game = game;
    this.root = root;
    this.config = config;
    this.onFinish = onFinish;
    this.settings = game.settings;
    this.time = 0;
    this.attackSeq = 1;
    this.agents = [];
    this.corpses = [];
    this.looseHorses = [];
    this.deadHorses = [];
    this.playerKills = [];
    this.playerDown = false;
    this.ended = false;
    this.paused = true;
    this.started = false;
    this.victoryAt = 0;
    this.incoming = null;
    this.camYaw = 0;
    this.camPitch = 0.12;
    this.camTarget = null;
    this.teamAiT = 0;
    this.extraLosses = [new Map(), new Map()];

    this.gfx = gfxPreset(this.settings);
    setMaterialQuality(this.gfx.standard);
    try {
      this.setupRenderer();
      this.fx = new Effects(this.scene);
      this.terrain = new BattleTerrain(config.kind, config.terrain);
      this.terrain.build(this.scene, this.gfx);
      this.buildObstacleGrid();
      this.setupLights(config.hour ?? 12);
      this.projectiles = new Projectiles(this);
      this.hud = new BattleHud(this, root);
      this.input = new BattleInput(this, this.renderer.domElement);
      this.setupTeams();
      this.spawnInitial();
      this.showStartOverlay();
    } catch (e) {
      if (this.input) this.input.dispose();
      if (this.renderer) this.renderer.dispose();
      root.innerHTML = '';
      throw e;
    }
    this.onResize = () => this.resize();
    window.addEventListener('resize', this.onResize);
    window.__battle = this;
  }

  // ---- setup ----------------------------------------------------------------------------

  setupRenderer() {
    // anti-aliasing comes from the post-processing chain (FXAA / MSAA target)
    const r = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
    r.setPixelRatio(this.pixelRatio());
    r.setSize(window.innerWidth, window.innerHeight);
    r.shadowMap.enabled = this.gfx.shadows && this.settings.shadows !== false;
    r.shadowMap.type = THREE.PCFShadowMap;
    this.root.append(r.domElement);
    this.renderer = r;
    this.scene = new THREE.Scene();
    this.scene.matrixWorldAutoUpdate = false;
    this.props = new Props(this.scene);
    this.camera = new THREE.PerspectiveCamera(64, window.innerWidth / window.innerHeight, 0.1, 1500);
  }

  pixelRatio() {
    // a fixed internal resolution (benchmark) or the screen's, capped per preset
    if (this.renderHeight) return this.renderHeight / window.innerHeight;
    return Math.min(window.devicePixelRatio || 1, this.gfx.maxPixelRatio || 1) * (this.settings.quality || 1);
  }

  // Render at `height` pixels whatever the window size (null: back to normal).
  setRenderHeight(height) {
    this.renderHeight = height;
    this.resize();
  }

  resize() {
    const pr = this.pixelRatio();
    this.renderer.setPixelRatio(pr);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    if (this.post) this.post.resize(window.innerWidth, window.innerHeight, pr);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  setupLights(hour) {
    this.env = new Environment(this, hour);
    this.sun = this.env.sun;
    this.sunDir = this.env.sunDir;
    this.sky = this.env.sky;
    if (this.gfx.post) this.post = new PostFX(this.renderer, this.scene, this.camera, this.gfx);
  }

  buildObstacleGrid() {
    this.obsGrid = new Map();
    for (const o of this.terrain.obstacles) {
      const x0 = Math.floor((o.x - o.r) / 6);
      const x1 = Math.floor((o.x + o.r) / 6);
      const z0 = Math.floor((o.z - o.r) / 6);
      const z1 = Math.floor((o.z + o.r) / 6);
      for (let i = x0; i <= x1; i++) {
        for (let j = z0; j <= z1; j++) {
          const k = i * 10007 + j;
          let arr = this.obsGrid.get(k);
          if (!arr) this.obsGrid.set(k, (arr = []));
          arr.push(o);
        }
      }
    }
    this.grid = new Map();
  }

  obstaclesNear(x, z, r) {
    const out = [];
    const x0 = Math.floor((x - r) / 6);
    const x1 = Math.floor((x + r) / 6);
    const z0 = Math.floor((z - r) / 6);
    const z1 = Math.floor((z + r) / 6);
    for (let i = x0; i <= x1; i++) {
      for (let j = z0; j <= z1; j++) {
        const arr = this.obsGrid.get(i * 10007 + j);
        if (arr) for (const o of arr) if (!out.includes(o)) out.push(o);
      }
    }
    return out;
  }

  rebuildGrid() {
    for (const arr of this.grid.values()) arr.length = 0;
    for (const a of this.agents) {
      if (!a.alive) continue;
      const k = Math.floor(a.pos.x / 4) * 10007 + Math.floor(a.pos.z / 4);
      let arr = this.grid.get(k);
      if (!arr) this.grid.set(k, (arr = []));
      arr.push(a);
    }
  }

  nearby(x, z, r) {
    const out = [];
    const x0 = Math.floor((x - r) / 4);
    const x1 = Math.floor((x + r) / 4);
    const z0 = Math.floor((z - r) / 4);
    const z1 = Math.floor((z + r) / 4);
    for (let i = x0; i <= x1; i++) {
      for (let j = z0; j <= z1; j++) {
        const arr = this.grid.get(i * 10007 + j);
        if (arr) for (const a of arr) out.push(a);
      }
    }
    return out;
  }

  areEnemies(a, b) {
    return !!a && !!b && a.team !== b.team;
  }

  heroSkill(name) {
    const hero = this.config.sides[0].hero;
    return hero ? hero.skills[name] || 0 : 0;
  }

  sideName(s) {
    const n = this.config.sides[s].name || '';
    return n.length > 26 ? `${n.slice(0, 24)}…` : n;
  }

  sound(name, src) {
    const sfx = this.game.sfx;
    const d = src && src.pos ? this.camera.position.distanceTo(src.pos) : 0;
    if (d > 90) return;
    switch (name) {
      case 'swing':
        sfx.swing(d);
        break;
      case 'clang':
        sfx.clang(d);
        break;
      case 'wood':
        sfx.woodBlock(d);
        break;
      case 'hit':
        sfx.hit(d);
        break;
      case 'hitHeavy':
        sfx.hit(d, true);
        break;
      case 'bow':
        sfx.bowRelease(d);
        break;
      case 'arrowHit':
        sfx.arrowHit(d);
        break;
      case 'hoof':
        if (d < 40) sfx.hoof(d);
        break;
      case 'grunt':
        sfx.grunt(d);
        break;
      default:
    }
  }

  // ---- teams & spawning --------------------------------------------------------------------

  setupTeams() {
    const cfg = this.config;
    const siege = cfg.kind === 'siege';
    const f = this.terrain.fort;
    const mkGroups = (base, yaw) => {
      const fx = Math.sin(yaw);
      const fz = Math.cos(yaw);
      const rx = -Math.cos(yaw);
      const rz = Math.sin(yaw);
      return {
        inf: { order: 'charge', pos: { x: base.x, z: base.z }, facing: yaw, fire: true, engageR: 7 },
        arch: { order: 'hold', pos: { x: base.x - fx * 7, z: base.z - fz * 7 }, facing: yaw, fire: true, engageR: 6 },
        cav: { order: 'charge', pos: { x: base.x + rx * 26, z: base.z + rz * 26 }, facing: yaw, fire: true, engageR: 16 },
      };
    };
    const base0 = siege ? { x: 0, z: 48, yaw: Math.PI } : { x: 0, z: 66, yaw: Math.PI };
    const base1 = siege ? { x: 0, z: (f.z0 + f.z1) / 2, yaw: 0 } : { x: 0, z: -66, yaw: 0 };
    this.teams = [
      { base: base0, groups: mkGroups(base0, base0.yaw), reserve: [], all: [] },
      { base: base1, groups: mkGroups(base1, base1.yaw), reserve: [], all: [] },
    ];
    if (siege) {
      const g1 = this.teams[1].groups;
      g1.inf.order = 'hold';
      g1.inf.pos = { x: f.rampX, z: f.z1 - 6 };
      g1.inf.engageR = 9;
      g1.arch.order = 'hold';
      g1.arch.pos = { x: 0, z: f.z1 - 1.5 };
      g1.arch.width = Math.floor((f.x1 - f.x0 - 4) / 1.6);
      g1.cav.order = 'hold';
      g1.cav.pos = { x: f.rampX, z: f.z1 - 11 };
      g1.cav.engageR = 9;
      const g0 = this.teams[0].groups;
      g0.arch.pos = { x: 0, z: 14 };
      g0.arch.order = 'hold';
      g0.cav.pos = { x: 18, z: 52 };
    }

    // rosters
    for (let s = 0; s < 2; s++) {
      const side = cfg.sides[s];
      const list = [];
      for (const u of side.units) for (let i = 0; i < u.count; i++) list.push({ key: u.key, troopId: u.troopId, status: 'reserve', wounded: false });
      if (s === 1) {
        // mix enemy stacks so that different troop types show up together
        list.sort(() => Math.random() - 0.5);
      }
      this.teams[s].all = list;
      this.teams[s].reserve = [...list];
    }
    const total0 = this.teams[0].all.length + (cfg.sides[0].hero ? 1 : 0);
    const total1 = this.teams[1].all.length;
    const N = cfg.kind === 'arena' ? 8 : Math.max(10, this.settings.battleSize || 60);
    const share0 = total0 / Math.max(1, total0 + total1);
    let cap0 = Math.round(N * clamp(share0, 0.2, 0.8));
    let cap1 = N - cap0;
    cap0 = Math.max(Math.min(total0, 5), Math.min(total0, cap0));
    cap1 = Math.max(Math.min(total1, 5), Math.min(total1, cap1));
    this.teams[0].cap = cap0;
    this.teams[1].cap = cap1;
    // enemy tactic: hold if they have strong ranged support
    const rangedShare = this.teams[1].all.filter((e) => TROOPS[e.troopId].type === 'arch' || TROOPS[e.troopId].type === 'harch').length / Math.max(1, total1);
    if (!siege && cfg.kind === 'field' && rangedShare > 0.3) {
      this.teams[1].groups.inf.order = 'hold';
      this.teams[1].holdUntil = 40 + Math.random() * 20;
    }
  }

  colorsFor(team) {
    const c = toHex((this.config.factionColors || [])[team] || (team === 0 ? '#3f6fb5' : '#a8322a'));
    return { team: c, team2: toHex(lighten(c, 1.6)) };
  }

  spawnInitial() {
    const cfg = this.config;
    if (cfg.kind === 'arena') {
      this.spawnArena();
      return;
    }
    // player
    const hero = cfg.sides[0].hero;
    const b0 = this.teams[0].base;
    if (hero) {
      const fx = Math.sin(b0.yaw);
      const fz = Math.cos(b0.yaw);
      const p = new Agent(this, {
        team: 0,
        key: 'player',
        hero,
        isPlayer: true,
        x: b0.x + fx * 5,
        z: b0.z + fz * 5,
        yaw: b0.yaw,
        colors: { team: this.colorsFor(0).team, team2: '#f5d76e' },
        noHorse: cfg.kind === 'siege',
        name: hero.name,
      });
      this.player = p;
      this.agents.push(p);
      this.camYaw = b0.yaw;
    }
    // companions fight next to the player
    this.companions = [];
    const comps = cfg.sides[0].companions || [];
    comps.forEach((c, i) => {
      const eq = c.equipment;
      const firstRanged = eq.w1 && ITEMS[eq.w1].slot === 'ranged';
      const group = eq.horse && cfg.kind !== 'siege' ? 'cav' : firstRanged ? 'arch' : 'inf';
      const side = i % 2 ? 1 : -1;
      const a = new Agent(this, {
        team: 0,
        key: c.key,
        hero: c,
        x: b0.x + Math.cos(b0.yaw) * side * (2 + i),
        z: b0.z - Math.sin(b0.yaw) * side * (2 + i),
        yaw: b0.yaw,
        colors: { team: this.colorsFor(0).team, team2: '#f5d76e' },
        noHorse: cfg.kind === 'siege',
        group,
        name: c.name,
        preferRanged: firstRanged,
      });
      a.companionId = c.id;
      this.companions.push(a);
      this.agents.push(a);
    });
    for (let s = 0; s < 2; s++) this.spawnWave(s, this.teams[s].cap - (s === 0 && hero ? 1 + comps.length : 0), true);
    for (let s = 0; s < 2; s++) for (const g of ['inf', 'arch', 'cav']) this.assignSlots(s, g);
    this.rebuildGrid();
    // place everyone at their slots at the start
    for (const a of this.agents) {
      if (a.slot && !a.isPlayer) {
        a.pos.x = a.slot[0];
        a.pos.z = a.slot[1];
        a.pos.y = this.terrain.heightAt(a.pos.x, a.pos.z);
      }
    }
  }

  spawnWave(s, n, initial = false) {
    const team = this.teams[s];
    const cfg = this.config;
    const siege = cfg.kind === 'siege';
    let spawned = 0;
    while (spawned < n && team.reserve.length) {
      const e = team.reserve.shift();
      const t = TROOPS[e.troopId];
      const group = GROUP_OF_TYPE[t.type] || 'inf';
      const g = team.groups[group];
      let x;
      let z;
      if (initial) {
        x = g.pos.x + (Math.random() - 0.5) * 10;
        z = g.pos.z + (Math.random() - 0.5) * 6;
      } else if (siege && s === 1) {
        const f = this.terrain.fort;
        x = (Math.random() - 0.5) * 20;
        z = f.z0 + 14 + Math.random() * 6;
      } else {
        const b = team.base;
        x = b.x + (Math.random() - 0.5) * 30;
        z = b.z + (Math.random() - 0.5) * 8 - Math.cos(b.yaw) * 6;
      }
      const a = new Agent(this, {
        team: s,
        key: e.key,
        troopId: e.troopId,
        x,
        z,
        yaw: team.base.yaw,
        colors: this.colorsFor(s),
        noHorse: siege,
        group,
        name: t.name,
      });
      a.entry = e;
      e.status = 'field';
      e.agent = a;
      this.agents.push(a);
      spawned++;
    }
    return spawned;
  }

  spawnArena() {
    const hero = this.config.sides[0].hero;
    const n = this.config.arenaFighters || 7;
    const total = n + 1;
    const R = 13;
    for (let i = 0; i < total; i++) {
      const ang = (i / total) * Math.PI * 2;
      const x = Math.sin(ang) * R;
      const z = Math.cos(ang) * R;
      const yaw = Math.atan2(-x, -z);
      const lo = ARENA_LOADOUTS[Math.floor(Math.random() * ARENA_LOADOUTS.length)];
      const col = `hsl(${Math.floor((i / total) * 360)},55%,45%)`;
      const tmp = document.createElement('canvas').getContext('2d');
      tmp.fillStyle = col;
      const hex = tmp.fillStyle;
      if (i === 0) {
        const p = new Agent(this, {
          team: 0,
          key: 'player',
          hero,
          isPlayer: true,
          x,
          z,
          yaw,
          colors: { team: '#2f5aa0', team2: '#f5d76e' },
          noHorse: true,
          loadout: { weapons: ['train_sword'], shield: 'shield_wood', armor: 'padded', helmet: 'leather_cap' },
          name: hero.name,
        });
        p.hp = p.maxHp;
        this.player = p;
        this.agents.push(p);
        this.camYaw = yaw;
      } else {
        const a = new Agent(this, {
          team: i,
          key: `arena${i}`,
          x,
          z,
          yaw,
          colors: { team: hex, team2: '#dddddd' },
          loadout: lo,
          hp: 55 + Math.floor(Math.random() * 25),
          name: ['Кулачний боєць', 'Гладіатор', 'Ветеран арени', 'Новачок арени', 'Забіяка'][Math.floor(Math.random() * 5)],
        });
        a.group = 'inf';
        this.agents.push(a);
      }
    }
    for (const g of Object.values(this.teams[0].groups)) g.order = 'charge';
    for (const g of Object.values(this.teams[1].groups)) g.order = 'charge';
    this.rebuildGrid();
  }

  groupOf(a) {
    const team = this.teams[Math.min(a.team, 1)];
    return team.groups[a.group] || team.groups.inf;
  }

  // Compute formation slots for a group.
  assignSlots(s, key) {
    if (this.config.kind === 'arena') return;
    const g = this.teams[s].groups[key];
    const members = this.agents.filter((a) => a.alive && a.team === s && !a.isPlayer && a.group === key);
    const n = members.length;
    if (!n) return;
    const cav = key === 'cav' && members.some((m) => m.horse);
    const sp = cav ? 3.2 : 1.5;
    const W = g.width || clamp(Math.ceil(Math.sqrt(n * (cav ? 2 : 5))), 3, 24);
    const fx = Math.sin(g.facing);
    const fz = Math.cos(g.facing);
    const rx = -Math.cos(g.facing);
    const rz = Math.sin(g.facing);
    // keep soldiers roughly where they are: sort by lateral position
    members.sort((a, b) => (a.pos.x * rx + a.pos.z * rz) - (b.pos.x * rx + b.pos.z * rz));
    const rows = Math.ceil(n / W);
    let i = 0;
    for (let row = 0; row < rows; row++) {
      const inRow = Math.min(W, n - row * W);
      const rowMembers = members.slice(i, i + inRow);
      rowMembers.forEach((m, c) => {
        const lat = (c - (inRow - 1) / 2) * sp;
        const back = row * sp * 1.2;
        m.slot = [g.pos.x + rx * lat - fx * back, g.pos.z + rz * lat - fz * back];
        m.slotIndex = row * W + c;
      });
      i += inRow;
    }
  }

  teamCounts() {
    const out = [
      { alive: 0, reserve: this.teams[0].reserve.length },
      { alive: 0, reserve: this.teams[1].reserve.length },
    ];
    for (const a of this.agents) if (a.alive) out[Math.min(1, a.team)].alive++;
    return out;
  }

  // ---- orders ------------------------------------------------------------------------------------

  giveOrder(order) {
    const p = this.player;
    if (!p || !p.alive || this.config.kind === 'arena') return;
    const team = this.teams[0];
    const sel = [...this.input.selected];
    const fx = Math.sin(p.yaw);
    const fz = Math.cos(p.yaw);
    for (const key of sel) {
      const g = team.groups[key];
      if (order === 'fire') {
        g.fire = !g.fire;
        continue;
      }
      g.order = order;
      if (order === 'hold') {
        const offset = key === 'arch' && sel.includes('inf') ? -6 : key === 'cav' && sel.length > 1 ? -14 : 0;
        g.pos = { x: p.pos.x + fx * (2 + offset), z: p.pos.z + fz * (2 + offset) };
        g.facing = p.yaw;
      }
      this.assignSlots(0, key);
    }
    const names = { hold: 'Тримати позицію!', follow: 'За мною!', charge: 'В атаку!' };
    if (order === 'fire') {
      const f = team.groups.arch.fire;
      this.hud.centerMsg(f ? 'Стріляти за бажанням!' : 'Не стріляти!', 1.5);
    } else this.hud.centerMsg(names[order], 1.5);
    this.game.sfx.horn();
  }

  updateTeamAI(dt) {
    this.teamAiT -= dt;
    if (this.teamAiT > 0) return;
    this.teamAiT = 1;
    const cfg = this.config;
    if (cfg.kind === 'arena') return;
    // enemy team decides when to charge
    const t1 = this.teams[1];
    const g = t1.groups;
    if (cfg.kind === 'field') {
      if (g.inf.order === 'hold') {
        let near = false;
        for (const a of this.agents) {
          if (!a.alive || a.team !== 0) continue;
          if (Math.hypot(a.pos.x - g.inf.pos.x, a.pos.z - g.inf.pos.z) < 38) {
            near = true;
            break;
          }
        }
        const archersOut = !this.agents.some((a) => a.alive && a.team === 1 && a.group === 'arch' && a.hasAmmo() && a.isRanged());
        if (near || this.time > (t1.holdUntil || 0) || archersOut) g.inf.order = 'charge';
      }
      // enemy archers: once out of arrows join the melee
      if (g.arch.order === 'hold' && this.time > 30) {
        const withAmmo = this.agents.some((a) => a.alive && a.team === 1 && a.group === 'arch' && Object.values(a.ammo).some((n) => n > 0));
        if (!withAmmo) g.arch.order = 'charge';
      }
    }
    // player's own team when the player is down: everyone charges
    if (this.playerDown) for (const gg of Object.values(this.teams[0].groups)) gg.order = 'charge';
    // re-slot occasionally to close gaps in the ranks
    if (Math.floor(this.time) % 4 === 0) for (let s = 0; s < 2; s++) for (const k of ['inf', 'arch', 'cav']) if (this.teams[s].groups[k].order === 'hold') this.assignSlots(s, k);
    // reinforcements
    const counts = this.teamCounts();
    for (let s = 0; s < 2; s++) {
      const team = this.teams[s];
      if (!team.reserve.length) continue;
      const cap = team.cap;
      if (counts[s].alive < cap * 0.55) {
        const n = this.spawnWave(s, Math.ceil(cap - counts[s].alive));
        if (n > 0) {
          for (const k of ['inf', 'arch', 'cav']) this.assignSlots(s, k);
          this.hud.message(s === 0 ? `До вас прибуло підкріплення: ${n}` : `До ворога прибуло підкріплення: ${n}`, s === 0 ? '#9fd8ff' : '#ffb0a0');
          this.game.sfx.horn();
        }
      }
    }
  }

  // ---- combat resolution -------------------------------------------------------------------------

  resolveMelee(att) {
    const w = att.weapon;
    const dir = att.action.dir;
    const hit = findMeleeTarget(this, att, w, dir);
    if (!hit) return;
    const t = hit.target;
    if (!hit.horse && isBlocked(att, t, dir)) {
      att.setAction('bounce', T.bounce);
      const shieldBlock = !!t.activeShield();
      this.sound(shieldBlock ? 'wood' : 'clang', t);
      this.impactFx(shieldBlock ? 'wood' : 'spark', t, att);
      // heavy blows push the defender back a little
      if (!t.horse) {
        const dx = t.pos.x - att.pos.x;
        const dz = t.pos.z - att.pos.z;
        const d = Math.hypot(dx, dz) || 1;
        t.vel.x += (dx / d) * 1.2;
        t.vel.z += (dz / d) * 1.2;
      }
      if (t.isPlayer) this.hud.message('Удар заблоковано', '#cfe8ff');
      if (att.isPlayer) this.hud.message('Ваш удар заблоковано', '#ffd6a0');
      return;
    }
    const [base, dtype] = attackDamage(w, dir);
    const sb = speedBonus(att, t);
    // holding the swing a moment longer adds some power
    const hold = 1 + Math.min(0.18, (att.action.holdT || 0) * 0.3);
    const raw = base * att.power * sb * hold * (0.9 + Math.random() * 0.2);
    this.applyHit(att, t, raw, dtype, hit.horse, dir === 'overhead' || (dir === 'thrust' && Math.random() < 0.25), dir);
  }

  // Spawn particles on `t` facing the attacker.
  impactFx(kind, t, from, horse = false) {
    const dx = from ? from.pos.x - t.pos.x : 0;
    const dz = from ? from.pos.z - t.pos.z : 0;
    const d = Math.hypot(dx, dz) || 1;
    const y = t.pos.y + (horse ? 1.35 : t.horse ? 2.2 : 1.3);
    this.fx.spawn(kind, t.pos.x + (dx / d) * 0.3, y, t.pos.z + (dz / d) * 0.3, (-dx / d) * 0.6, (-dz / d) * 0.6);
  }

  applyHit(att, t, raw, dtype, horse, head, dir) {
    this.impactFx('blood', t, att, horse && !!t.horse);
    if (horse && t.horse) {
      const dmg = computeDamage(raw * 1.1, dtype, t.horse.armor);
      t.damageHorse(dmg, att);
      this.sound('hit', t);
      if (att.isPlayer) this.hud.message(`Коню завдано ${Math.round(dmg)} шкоди`, '#ffe9b0');
      return;
    }
    const armor = head ? t.headArmor : t.bodyArmor;
    const dmg = computeDamage(raw, dtype, armor) * (head ? 1.2 : 1);
    const dx = t.pos.x - att.pos.x;
    const dz = t.pos.z - att.pos.z;
    const d = Math.hypot(dx, dz) || 1;
    const push = dir === 'thrust' || dir === 'overhead' ? 1.6 : 1.1;
    if (att.isPlayer) this.hud.message(`Завдано ${Math.round(dmg)} шкоди${head ? ' (в голову)' : ''}`, '#ffe9b0');
    if (t.isPlayer) {
      this.hud.message(`Отримано ${Math.round(dmg)} шкоди`, '#ff9a8a');
      this.hud.damageFlash();
    }
    t.takeDamage(dmg, att, dtype, { push: [(dx / d) * push, (dz / d) * push] });
    this.sound(dmg > 20 ? 'hitHeavy' : 'hit', t);
    if (t.alive && Math.random() < 0.3) this.sound('grunt', t);
  }

  resolveCouch(att) {
    const w = att.weapon;
    const reach = w.reach + 1.2;
    const cands = this.nearby(att.pos.x, att.pos.z, reach + 1.5);
    let best = null;
    let bd = Infinity;
    for (const t of cands) {
      if (t === att || !t.alive || !this.areEnemies(att, t)) continue;
      const dx = t.pos.x - att.pos.x;
      const dz = t.pos.z - att.pos.z;
      const d = Math.hypot(dx, dz) - t.radius;
      if (d > reach) continue;
      const rel = Math.abs(wrapAngle(Math.atan2(dx, dz) - att.horse.yaw));
      if (rel > 0.32) continue;
      if (d < bd) {
        bd = d;
        best = t;
      }
    }
    if (!best) return;
    const sb = speedBonus(att, best, true);
    let raw = (w.thrust ? w.thrust[0] : 30) * att.power * sb;
    if (best.activeShield() && best.action.s === 'block') {
      raw *= 0.45;
      this.sound('wood', best);
    }
    const horseHit = !!best.horse && Math.random() < 0.35;
    this.applyHit(att, best, raw, 'pierce', horseHit, Math.random() < 0.2, 'thrust');
    att.couched = false;
    att.couchCd = 1.4;
    if (att.isPlayer) this.hud.centerMsg('Удар списом!', 1);
  }

  // Launch a projectile from agent `a` with weapon `w`.
  fireProjectile(a, w, dirOverride) {
    const origin = new THREE.Vector3(a.pos.x, a.pos.y + (a.horse ? 2.35 : 1.5), a.pos.z);
    origin.x += Math.sin(a.aimYaw) * 0.45;
    origin.z += Math.cos(a.aimYaw) * 0.45;
    let dir;
    if (dirOverride) {
      dir = new THREE.Vector3(dirOverride.x, dirOverride.y, dirOverride.z).normalize();
    } else {
      const target = this.cameraAimPoint();
      dir = target.sub(origin).normalize();
      const sp = a.spread();
      const yaw = Math.atan2(dir.x, dir.z) + (Math.random() - 0.5) * 2 * sp;
      const pitch = Math.asin(clamp(dir.y, -1, 1)) + (Math.random() - 0.5) * 2 * sp;
      dir.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
    }
    const power = w.cls === 'crossbow' ? 1 : a.rpower;
    this.projectiles.spawn({
      owner: a,
      pos: origin,
      vel: dir.multiplyScalar(w.projSpeed),
      dmg: w.dmg * power,
      dtype: w.dtype,
      model: w.model,
    });
    this.sound('bow', a);
  }

  cameraAimPoint() {
    const cam = this.camera;
    const dir = new THREE.Vector3();
    cam.getWorldDirection(dir);
    const p = cam.position.clone();
    const step = 1.5;
    for (let d = 3; d < 220; d += step) {
      const x = p.x + dir.x * d;
      const y = p.y + dir.y * d;
      const z = p.z + dir.z * d;
      if (y <= this.terrain.heightAt(x, z)) return new THREE.Vector3(x, y, z);
    }
    return p.addScaledVector(dir, 220);
  }

  // Direction to shoot at a (possibly moving) target, compensating for gravity.
  aimSolution(a, t, speed) {
    const ox = a.pos.x;
    const oy = a.pos.y + (a.horse ? 2.35 : 1.5);
    const oz = a.pos.z;
    let tx = t.pos.x;
    let tz = t.pos.z;
    const ty = t.pos.y + (t.horse ? 2.0 : 1.1);
    let dist = Math.hypot(tx - ox, tz - oz);
    const flight = dist / speed;
    tx += t.vel.x * flight;
    tz += t.vel.z * flight;
    dist = Math.hypot(tx - ox, tz - oz);
    const dy = ty - oy;
    const g = 9.8;
    const v2 = speed * speed;
    const disc = v2 * v2 - g * (g * dist * dist + 2 * dy * v2);
    if (disc < 0) return null;
    const ang = Math.atan2(v2 - Math.sqrt(disc), g * dist);
    const yaw = Math.atan2(tx - ox, tz - oz);
    return { x: Math.sin(yaw) * Math.cos(ang), y: Math.sin(ang), z: Math.cos(yaw) * Math.cos(ang) };
  }

  onRangedHit(owner, t, dmg, horse, head) {
    if (owner && owner.isPlayer) this.hud.message(`Влучання! ${Math.round(dmg)} шкоди${head ? ' (в голову)' : ''}${horse ? ' (кінь)' : ''}`, '#ffe9b0');
    if (t.isPlayer) {
      this.hud.message(`У вас влучили: ${Math.round(dmg)} шкоди`, '#ff9a8a');
      this.hud.damageFlash();
    }
  }

  woundChance(team) {
    if (team === 0) return 0.25 + this.heroSkill('surgery') * 0.05;
    return 0.3;
  }

  onDeath(a, killer, dtype) {
    if (a.companionId) {
      this.hud.message(`${a.name} втрачає свідомість`, '#ffb0a0');
    } else if (a.isPlayer) {
      this.playerDown = true;
      this.hud.centerMsg('Вас повалено!', 3);
      this.hud.message('Ви втратили свідомість.', '#ff9a8a');
    } else if (a.entry) {
      a.entry.status = 'down';
      a.entry.wounded = dtype === 'blunt' || Math.random() < this.woundChance(a.team);
    }
    if (a.ai.target && a.ai.target.ai) a.ai.target.ai.attackers = Math.max(0, (a.ai.target.ai.attackers || 1) - 1);
    const wounded = a.entry ? a.entry.wounded : true;
    if (killer && killer.isPlayer && !a.isPlayer) {
      this.playerKills.push(a.tier || 1);
      this.hud.message(`${wounded ? 'Ви оглушили' : 'Ви вбили'}: ${a.name}`, '#ffd66e');
    } else if (a.team === 0 && a.key === 'player' && !a.isPlayer) {
      this.hud.message(`${a.name} ${wounded ? 'поранений' : 'загинув'}`, '#ffb0a0');
    } else if (this.config.kind === 'arena' && killer) {
      this.hud.message(`${killer.name || 'Боєць'} повалив ${a.name}`, '#ddd');
    }
    if (killer) killer.kills++;
    this.sound('grunt', a);
    this.corpses.push(a);
    if (this.corpses.length > 110) {
      const old = this.corpses.shift();
      if (!old.isPlayer) old.dispose();
    }
  }

  releaseHorse(h) {
    h.pos = h.pos.clone();
    h.rider = null;
    this.looseHorses.push(h);
  }

  addCorpseHorse(h) {
    h.pos = h.pos.clone();
    h.fallT = 0;
    h.fallDir = Math.random() < 0.5 ? 1 : -1;
    this.deadHorses.push(h);
    const i = this.looseHorses.indexOf(h);
    if (i >= 0) this.looseHorses.splice(i, 1);
  }

  collideObstacles(a) {
    const r = a.radius;
    for (const o of this.obstaclesNear(a.pos.x, a.pos.z, r + 1)) {
      const dx = a.pos.x - o.x;
      const dz = a.pos.z - o.z;
      const d = Math.hypot(dx, dz);
      const min = o.r + r;
      if (d < min && d > 1e-4) {
        a.pos.x = o.x + (dx / d) * min;
        a.pos.z = o.z + (dz / d) * min;
        if (a.horse) a.horse.speed *= 0.6;
      }
    }
    if (this.terrain.arenaR) {
      const d = Math.hypot(a.pos.x, a.pos.z);
      if (d > this.terrain.arenaR) {
        a.pos.x *= this.terrain.arenaR / d;
        a.pos.z *= this.terrain.arenaR / d;
      }
    }
  }

  separate() {
    for (const a of this.agents) {
      if (!a.alive) continue;
      const near = this.nearby(a.pos.x, a.pos.z, a.radius + 1.0);
      for (const b of near) {
        if (b.id <= a.id || !b.alive) continue;
        const dx = a.pos.x - b.pos.x;
        const dz = a.pos.z - b.pos.z;
        const d = Math.hypot(dx, dz);
        const min = a.radius + b.radius;
        if (d >= min || d < 1e-5) continue;
        const nx = dx / d;
        const nz = dz / d;
        const overlap = min - d;
        const ma = a.horse ? 5 : 1;
        const mb = b.horse ? 5 : 1;
        const ka = mb / (ma + mb);
        const kb = ma / (ma + mb);
        const ax = a.pos.x + nx * overlap * ka;
        const az = a.pos.z + nz * overlap * ka;
        const bx = b.pos.x - nx * overlap * kb;
        const bz = b.pos.z - nz * overlap * kb;
        if (this.terrain.walkable(a.pos.x, a.pos.z, ax, az)) {
          a.pos.x = ax;
          a.pos.z = az;
        }
        if (this.terrain.walkable(b.pos.x, b.pos.z, bx, bz)) {
          b.pos.x = bx;
          b.pos.z = bz;
        }
        // horses trample enemies on foot
        this.bump(a, b, -nx, -nz);
        this.bump(b, a, nx, nz);
      }
    }
  }

  bump(rider, victim, nx, nz) {
    if (!rider.horse || victim.horse || !this.areEnemies(rider, victim) || rider.bumpCd > 0 || victim.bumpCd > 0) return;
    const sp = rider.horse.speed;
    const along = (rider.vel.x * nx + rider.vel.z * nz) / Math.max(0.01, Math.abs(sp));
    if (sp < 5 || along < 0.5) return;
    const dmg = computeDamage(sp * 1.7 * (rider.horse.item.barding ? 1.3 : 1), 'blunt', victim.bodyArmor);
    this.fx.spawn('dust', victim.pos.x, victim.pos.y + 0.4, victim.pos.z, nx, nz);
    victim.takeDamage(dmg, rider, 'blunt', { push: [nx * sp * 0.5, nz * sp * 0.5] });
    victim.stun(0.9);
    victim.bumpCd = 1;
    rider.bumpCd = 0.4;
    rider.horse.speed *= 0.7;
    this.sound('hitHeavy', victim);
    if (rider.isPlayer) this.hud.message(`Кінь збив ворога (${Math.round(dmg)})`, '#ffe9b0');
    if (victim.isPlayer) this.hud.message(`Вас збив кінь! ${Math.round(dmg)} шкоди`, '#ff9a8a');
  }

  // ---- player control ------------------------------------------------------------------------------

  playerAttackPress() {
    const p = this.player;
    if (!p || !p.alive || this.paused) return;
    p.beginAttack(this.input.attackDir);
  }

  playerAttackRelease() {
    const p = this.player;
    if (!p || !p.alive) return;
    p.releaseAttack();
  }

  playerBlockPress() {
    const p = this.player;
    if (!p || !p.alive || this.paused) return;
    p.beginBlock(this.blockDirForPlayer());
  }

  playerBlockRelease() {
    const p = this.player;
    if (!p) return;
    p.endBlock();
  }

  playerNextWeapon(d) {
    const p = this.player;
    if (!p || !p.alive || this.paused) return;
    p.nextWeapon(d);
    this.hud.message(`Зброя: ${ITEMS[p.weapons[(p.wi + d + p.weapons.length) % p.weapons.length]].name}`);
  }

  blockDirForPlayer() {
    if (this.settings.autoBlock && this.incoming) return this.incoming;
    return this.input.blockDir;
  }

  onKey(code) {
    if (this.ended && code !== 'Tab') return;
    const p = this.player;
    switch (code) {
      case 'KeyQ':
        this.playerNextWeapon(1);
        break;
      case 'Digit1':
        this.selectGroups(['inf']);
        break;
      case 'Digit2':
        this.selectGroups(['arch']);
        break;
      case 'Digit3':
        this.selectGroups(['cav']);
        break;
      case 'Digit0':
      case 'Backquote':
        this.selectGroups(['inf', 'arch', 'cav']);
        break;
      case 'KeyZ':
      case 'F1':
        this.giveOrder('hold');
        break;
      case 'KeyX':
      case 'F2':
        this.giveOrder('follow');
        break;
      case 'KeyC':
      case 'F3':
        this.giveOrder('charge');
        break;
      case 'KeyV':
        this.giveOrder('fire');
        break;
      case 'KeyF':
        if (p && p.alive) this.toggleMount();
        break;
      case 'Tab':
        this.onTab();
        break;
      case 'KeyN':
        if (this.playerDown) this.cycleSpectate();
        break;
      default:
    }
  }

  selectGroups(list) {
    if (this.config.kind === 'arena') return;
    this.input.selected = new Set(list);
  }

  toggleMount() {
    const p = this.player;
    if (p.horse) {
      if (Math.abs(p.horse.speed) > 2.5) {
        this.hud.message('Спочатку зупиніть коня');
        return;
      }
      const h = p.horse;
      h.speed = 0;
      h.rider = null;
      p.horse = null;
      p.radius = 0.36;
      this.releaseHorse(h);
      p.pos = p.pos.clone();
      p.pos.x += Math.cos(p.yaw) * 1.1;
      p.pos.z -= Math.sin(p.yaw) * 1.1;
      p.pos.y = this.terrain.heightAt(p.pos.x, p.pos.z);
      p.vel.set(0, 0, 0);
      p.setupMeshes();
      return;
    }
    let best = null;
    let bd = 3.2;
    for (const h of this.looseHorses) {
      const d = Math.hypot(h.pos.x - p.pos.x, h.pos.z - p.pos.z);
      if (d < bd) {
        bd = d;
        best = h;
      }
    }
    if (!best) {
      this.hud.message('Поруч немає вільного коня');
      return;
    }
    this.looseHorses.splice(this.looseHorses.indexOf(best), 1);
    best.speed = 0;
    p.mountHorse(best);
    p.setupMeshes();
    this.hud.message(`Ви сіли на коня: ${best.item.name}`);
  }

  onTab() {
    if (this.ended) return;
    if (this.victoryAt) {
      this.finish('victory');
      return;
    }
    if (this.config.kind === 'arena') {
      this.finish(this.player.alive && !this.agents.some((a) => a.alive && !a.isPlayer) ? 'victory' : 'defeat');
      return;
    }
    if (this.playerDown) {
      this.resolveRemainder();
      return;
    }
    const p = this.player;
    const near = this.agents.some((a) => a.alive && a.team !== 0 && Math.hypot(a.pos.x - p.pos.x, a.pos.z - p.pos.z) < 22);
    if (near) {
      this.hud.message('Не можна відступити: вороги надто близько!', '#ff9a8a');
      return;
    }
    this.finish('retreat');
  }

  cycleSpectate() {
    const allies = this.agents.filter((a) => a.alive && a.team === 0);
    if (!allies.length) return;
    const i = allies.indexOf(this.camTarget);
    this.camTarget = allies[(i + 1) % allies.length];
  }

  controlPlayer(dt) {
    const p = this.player;
    if (!p || !p.alive) return;
    const inp = this.input;
    const fwd = (inp.down('KeyW') || inp.down('ArrowUp') ? 1 : 0) - (inp.down('KeyS') || inp.down('ArrowDown') ? 1 : 0);
    const str = (inp.down('KeyD') || inp.down('ArrowRight') ? 1 : 0) - (inp.down('KeyA') || inp.down('ArrowLeft') ? 1 : 0);
    const walk = inp.down('ShiftLeft') || inp.down('ShiftRight');
    p.aimYaw = this.camYaw;
    p.aimPitch = this.camPitch;
    if (p.horse) {
      p.ride.throttle = fwd;
      p.ride.turn = -str;
      p.move.walk = walk;
    } else {
      const y = this.camYaw;
      const fx = Math.sin(y);
      const fz = Math.cos(y);
      const rx = -Math.cos(y);
      const rz = Math.sin(y);
      p.move.x = fx * fwd + rx * str;
      p.move.z = fz * fwd + rz * str;
      p.move.walk = walk;
      p.faceYaw = y;
    }
    // block direction follows the mouse / incoming attack while held
    if (inp.rmb && p.action.s === 'block') p.action.blockDir = this.blockDirForPlayer();
    else if (inp.rmb && (p.action.s === 'idle' || p.action.s === 'recover')) p.beginBlock(this.blockDirForPlayer());
  }

  computeIncoming() {
    const p = this.player;
    this.incoming = null;
    if (!p || !p.alive) return;
    let best = Infinity;
    for (const e of this.nearby(p.pos.x, p.pos.z, 6)) {
      if (!e.alive || !this.areEnemies(e, p) || e.ai.target !== p) continue;
      const s = e.action.s;
      if (s !== 'windup' && s !== 'hold' && !(s === 'swing' && !e.action.hitDone)) continue;
      const d = Math.hypot(e.pos.x - p.pos.x, e.pos.z - p.pos.z) - e.weapon.reach;
      if (d > 2.5) continue;
      if (d < best) {
        best = d;
        this.incoming = BLOCK_TO_HUD[requiredBlock(e.action.dir)];
      }
    }
  }

  // ---- camera ------------------------------------------------------------------------------------------

  updateCamera(dt) {
    if (this.debugCam) {
      const d = this.debugCam;
      this.camera.position.set(d.x, d.y, d.z);
      this.camera.lookAt(d.tx, d.ty, d.tz);
      this.env.follow(new THREE.Vector3(d.tx, d.ty, d.tz), this.camera);
      return;
    }
    let focus = this.player && this.player.alive ? this.player : null;
    if (!focus) {
      if (!this.camTarget || !this.camTarget.alive) {
        this.camTarget = this.agents.find((a) => a.alive && a.team === 0) || this.agents.find((a) => a.alive) || this.player;
      }
      focus = this.camTarget;
    }
    if (!focus) return;
    const mounted = !!focus.horse;
    const pivot = new THREE.Vector3(focus.pos.x, focus.pos.y + (mounted ? 2.85 : 1.65), focus.pos.z);
    const y = this.camYaw;
    const pch = this.camPitch;
    const dist = focus === this.player ? (mounted ? 5.4 : 3.1) : 6;
    const fx = Math.sin(y) * Math.cos(pch);
    const fy = Math.sin(pch);
    const fz = Math.cos(y) * Math.cos(pch);
    // shoulder offset to the right
    const rx = -Math.cos(y) * 0.45;
    const rz = Math.sin(y) * 0.45;
    const cam = this.camera;
    const target = new THREE.Vector3(pivot.x - fx * dist + rx, pivot.y - fy * dist + 0.35, pivot.z - fz * dist + rz);
    const gh = this.terrain.heightAt(target.x, target.z) + 0.4;
    if (target.y < gh) target.y = gh;
    if (!this.camInit) {
      cam.position.copy(target);
      this.camInit = true;
    } else cam.position.lerp(target, 1 - Math.exp(-dt * 25));
    cam.lookAt(pivot.x + fx * 30 + rx, pivot.y + fy * 30 + 0.35, pivot.z + fz * 30 + rz);
    // shadows follow the camera focus
    this.env.follow(pivot, cam);
  }

  // ---- loose / dead horses -----------------------------------------------------------------------------

  updateHorses(dt) {
    for (const h of this.looseHorses) {
      h.speed *= Math.exp(-dt * 0.8);
      if (Math.abs(h.speed) < 0.2) h.speed = 0;
      const nx = h.pos.x + Math.sin(h.yaw) * h.speed * dt;
      const nz = h.pos.z + Math.cos(h.yaw) * h.speed * dt;
      if (this.terrain.walkable(h.pos.x, h.pos.z, nx, nz)) {
        h.pos.x = nx;
        h.pos.z = nz;
      } else h.speed = 0;
      h.pos.y = this.terrain.heightAt(h.pos.x, h.pos.z);
      h.phase += Math.abs(h.speed) * dt * 1.25;
      const amp = Math.min(0.75, Math.abs(h.speed) * 0.085);
      h.rig.legs.forEach((l, i) => {
        l.rotation.x = Math.sin(h.phase + [0, 0.5, Math.PI, Math.PI + 0.5][i]) * amp;
      });
      h.rig.root.position.copy(h.pos);
      h.rig.root.rotation.y = h.yaw;
    }
    for (const h of this.deadHorses) {
      if (h.fallT >= 1) continue;
      h.fallT = Math.min(1, h.fallT + dt * 1.8);
      const f = h.fallT;
      h.rig.root.position.copy(h.pos);
      h.rig.root.position.y -= 0.35 * f;
      h.rig.root.rotation.y = h.yaw;
      h.rig.root.rotation.z = h.fallDir * (Math.PI / 2) * f;
      h.rig.body.position.y = -0.15 * f;
    }
  }

  // ---- main loop ------------------------------------------------------------------------------------------

  frame(dt) {
    dt = Math.min(dt, 0.05);
    if (!this.paused && !this.ended) {
      const steps = dt > 0.025 ? 2 : 1;
      for (let i = 0; i < steps && !this.ended; i++) this.step(dt / steps);
    }
    if (this.ended) return; // disposed inside step()
    this.updateCamera(dt);
    for (const a of this.agents) if (a.alive || a.fallT < 1) a.animate(this.paused ? 0 : dt);
    if (!this.paused) {
      this.fx.update(dt);
      this.terrain.update(this.time, this.camera);
    }
    this.hud.update();
    // world matrices once per frame (the renderer does not repeat it), then
    // the carried items follow their holders
    this.scene.updateMatrixWorld();
    this.camera.updateMatrixWorld();
    this.props.sync(this.camera);
    if (this.post) this.post.render();
    else this.renderer.render(this.scene, this.camera);
  }

  step(dt) {
    this.time += dt;
    if (this.tipUntil && this.time > this.tipUntil) {
      this.tipUntil = 0;
      this.hud.showHint(null);
    }
    this.input.decay(dt);
    this.rebuildGrid();
    this.controlPlayer(dt);
    this.computeIncoming();
    this.updateTeamAI(dt);
    for (const a of this.agents) {
      if (!a.alive || a.isPlayer) continue;
      aiControl(this, a, dt);
    }
    for (const a of this.agents) if (a.alive) a.updateAction(dt);
    for (const a of this.agents) a.integrate(dt);
    this.rebuildGrid();
    this.separate();
    this.updateHorses(dt);
    this.projectiles.update(dt);
    this.checkEnd();
  }

  checkEnd() {
    if (this.ended) return;
    const cfg = this.config;
    if (cfg.kind === 'arena') {
      const others = this.agents.filter((a) => a.alive && !a.isPlayer).length;
      if (this.playerDown && !this.endTimer) {
        this.endTimer = this.time + 2.5;
        this.hud.showHint('Вас повалено. Tab — покинути арену');
      }
      if (!this.playerDown && others === 0 && !this.victoryAt) {
        this.victoryAt = this.time;
        this.hud.centerMsg('Ви переможець арени!', 4);
        this.hud.showHint('Tab — покинути арену');
        this.game.sfx.cheer();
      }
      if (this.endTimer && this.time > this.endTimer + 1.5) this.finish('defeat');
      return;
    }
    const c = this.teamCounts();
    if (!this.victoryAt && c[1].alive === 0 && c[1].reserve === 0) {
      this.victoryAt = this.time;
      this.hud.centerMsg('Перемога!', 5);
      this.hud.showHint('Tab — завершити битву');
      this.game.sfx.cheer();
    }
    if (this.victoryAt && this.time > this.victoryAt + 6) this.finish('victory');
    if (c[0].alive === 0 && c[0].reserve === 0 && !this.victoryAt) {
      this.hud.centerMsg('Поразка…', 3);
      if (!this.endTimer) this.endTimer = this.time + 2.5;
    }
    if (this.endTimer && this.time > this.endTimer && !this.victoryAt) this.finish('defeat');
    if (this.playerDown && !this.victoryAt && c[0].alive > 0) this.hud.showHint('Вас повалено. Tab — доручити бій загону (автобій) · N — інший воїн');
  }

  // Player knocked out: settle the rest of the fight abstractly.
  resolveRemainder() {
    const sides = [0, 1].map((s) => {
      const stacks = [];
      for (const a of this.agents) if (a.alive && a.team === s && a.entry) stacks.push({ key: `e${a.id}`, troopId: a.troopId, count: 1, entry: a.entry });
      for (const e of this.teams[s].reserve) stacks.push({ key: `r${stacks.length}`, troopId: e.troopId, count: 1, entry: e });
      return stacks;
    });
    const heroes = (this.companions || []).filter((a) => a.alive).map((a) => ({ key: `comp:${a.companionId}`, hp: a.hp, power: 12 + a.tier * 2, armor: a.bodyArmor }));
    const res = autoResolve([
      { stacks: sides[0], heroes, bonus: 1 + this.heroSkill('tactics') * 0.04, woundChance: this.woundChance(0) },
      { stacks: sides[1], bonus: this.config.kind === 'siege' ? 1.3 : 1, woundChance: this.woundChance(1) },
    ]);
    for (let s = 0; s < 2; s++) {
      for (const st of sides[s]) {
        const loss = res.losses[s].get(st.key);
        if (!loss) continue;
        const wounded = Object.keys(loss.wounded).length > 0;
        st.entry.status = 'down';
        st.entry.wounded = wounded;
      }
    }
    for (const a of this.companions || []) if (res.heroesDown.has(`comp:${a.companionId}`)) a.hp = 1;
    this.finish(res.winner === 0 ? 'victory' : 'defeat');
  }

  finish(outcome) {
    if (this.ended) return;
    this.ended = true;
    const losses = [new Map(), new Map()];
    for (let s = 0; s < 2; s++) {
      for (const e of this.teams[s].all) {
        if (e.status !== 'down') continue;
        let l = losses[s].get(e.key);
        if (!l) losses[s].set(e.key, (l = { killed: {}, wounded: {} }));
        const b = e.wounded ? l.wounded : l.killed;
        b[e.troopId] = (b[e.troopId] || 0) + 1;
      }
    }
    const result = {
      outcome,
      losses,
      playerDown: this.playerDown,
      playerKills: this.playerKills,
      playerHp: this.player ? (this.player.alive ? this.player.hp : 3) : undefined,
      companionHp: Object.fromEntries((this.companions || []).map((a) => [a.companionId, a.alive ? a.hp : 1])),
    };
    this.dispose();
    this.onFinish(result);
  }

  // ---- overlays -------------------------------------------------------------------------------------------

  showStartOverlay() {
    const cfg = this.config;
    const c = this.teamCounts();
    const title = cfg.kind === 'arena' ? 'Арена' : cfg.kind === 'siege' ? `Штурм: ${cfg.fortName || ''}` : 'Битва';
    const lines = cfg.kind === 'arena'
      ? 'Всі проти всіх тренувальною зброєю. Останній на ногах перемагає.'
      : `${cfg.sides[0].name}: ${c[0].alive + c[0].reserve}  ·  ${cfg.sides[1].name}: ${c[1].alive + c[1].reserve}`;
    this.overlay = h('div', { class: 'pause-overlay' },
      h('div', { class: 'window narrow' },
        h('div', { class: 'window-title' }, title),
        h('div', { class: 'window-body' },
          h('p', null, lines),
          h('p', { class: 'muted', style: { fontSize: '14px' } }, 'Миша — огляд і напрям удару · ЛКМ — удар (утримуйте для замаху) · ПКМ — блок · WASD — рух · Q — зброя · 1/2/3/0 + Z/X/C — накази · Tab — відступ'),
          h('p', null, h('b', null, 'Клацніть по екрану, щоб почати.')),
        ),
      ),
    );
    this.overlay.addEventListener('click', () => this.input.lock());
    this.root.append(this.overlay);
  }

  onLock() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    this.paused = false;
    if (!this.started) {
      this.started = true;
      this.game.sfx.horn();
      if (!this.settings.seenBattleTips) {
        this.settings.seenBattleTips = true;
        this.game.saveSettings();
        this.tipUntil = this.time + 22;
        this.hud.showHint('Порада: рухніть мишею вліво, вправо, вгору чи вниз — і натисніть ЛКМ, щоб ударити з цього боку.<br>Утримуйте ПКМ, щоб блокувати. Червона стрілка показує, звідки летить ворожий удар.');
      }
    }
  }

  onUnlock() {
    if (this.ended) return;
    this.paused = true;
    if (this.overlay) return;
    const retreatBtn = h('button', { class: 'btn', onclick: (e) => { e.stopPropagation(); this.onTab(); } }, this.config.kind === 'arena' ? 'Покинути арену' : this.playerDown ? 'Завершити битву (автобій)' : 'Відступити');
    this.overlay = h('div', { class: 'pause-overlay' },
      h('div', { class: 'window narrow' },
        h('div', { class: 'window-title' }, 'Пауза'),
        h('div', { class: 'window-body' },
          h('div', { class: 'menu-list', style: { width: '100%' } },
            h('button', { class: 'btn primary', onclick: (e) => { e.stopPropagation(); this.input.lock(); } }, 'Продовжити бій'),
            retreatBtn,
          ),
          h('p', { class: 'muted', style: { fontSize: '13px', marginTop: '12px' } }, 'Відступити можна, коли поруч немає ворогів. Напрям удару — рух миші перед атакою; стрілка біля прицілу показує його.'),
        ),
      ),
    );
    this.root.append(this.overlay);
  }

  // Test / debug helpers: start without pointer lock, fast-forward the simulation.
  debugStart() {
    this.onLock();
  }

  debugSimulate(seconds, dt = 1 / 30) {
    const n = Math.round(seconds / dt);
    for (let i = 0; i < n && !this.ended; i++) {
      this.step(dt);
      if (i % 3 === 0) for (const a of this.agents) if (a.alive || a.fallT < 1) a.animate(dt * 3);
    }
  }

  dispose() {
    window.removeEventListener('resize', this.onResize);
    this.input.dispose();
    this.scene.traverse((o) => {
      if (o.isMesh && o.geometry && !o.geometry.__cached && o.geometry !== undefined) {
        // shared model geometries are cached in models.js; terrain and props are unique
        if (o.parent === this.terrain.group || o === this.sky) o.geometry.dispose();
      }
    });
    this.props.dispose();
    if (this.post) this.post.dispose();
    if (this.env) this.env.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss?.();
    if (window.__battle === this) window.__battle = null;
  }
}
