export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const dist2 = (ax, ay, bx, by) => {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
};
export const dist = (ax, ay, bx, by) => Math.sqrt(dist2(ax, ay, bx, by));

export function wrapAngle(a) {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

export function approachAngle(current, target, maxStep) {
  const d = wrapAngle(target - current);
  if (Math.abs(d) <= maxStep) return target;
  return current + Math.sign(d) * maxStep;
}

export function smoothstep(a, b, x) {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

let uidCounter = 1;
export function uid(prefix = 'id') {
  return `${prefix}${Date.now().toString(36)}${(uidCounter++).toString(36)}`;
}
export function setUidCounter(n) {
  uidCounter = Math.max(uidCounter, n);
}

export function formatHour(hours) {
  const day = Math.floor(hours / 24) + 1;
  const h = Math.floor(hours % 24);
  const m = Math.floor((hours % 1) * 60);
  return { day, text: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}` };
}

// Ukrainian plural helper: plural(5, 'воїн', 'воїни', 'воїнів')
export function plural(n, one, few, many) {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return one;
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return few;
  return many;
}

export function hexToRgb(hex) {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

export function shade(hex, f) {
  const [r, g, b] = hexToRgb(hex);
  const s = (c) => clamp(Math.round(c * f), 0, 255);
  return `rgb(${s(r)},${s(g)},${s(b)})`;
}
