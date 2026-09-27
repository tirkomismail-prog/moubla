// Small decorative SVG vignettes for game menus.
import { h } from './dom.js';

const SKIES = {
  day: ['#9cc6e8', '#e9dcb8'],
  dusk: ['#5a4a7a', '#e7a266'],
  night: ['#101a33', '#34426b'],
};

function sky(hour) {
  if (hour >= 7 && hour < 18) return SKIES.day;
  if ((hour >= 18 && hour < 21) || (hour >= 5 && hour < 7)) return SKIES.dusk;
  return SKIES.night;
}

export function scene(kind, color = '#8b2b20', hour = 12) {
  const [top, bottom] = sky(hour);
  const ground = kind === 'snow' ? '#dfe6ea' : '#6f8a4c';
  let art = '';
  if (kind === 'town') {
    art = `
      <rect x="40" y="70" width="320" height="50" fill="#b9ab8e" stroke="#3b2a1c"/>
      ${[40, 110, 190, 270, 340].map((x) => `<rect x="${x - 12}" y="45" width="24" height="75" fill="#a89a7c" stroke="#3b2a1c"/><path d="M${x - 16} 45 L${x} 22 L${x + 16} 45Z" fill="#7d3326" stroke="#3b2a1c"/>`).join('')}
      <rect x="182" y="85" width="36" height="35" fill="#3b2a1c" rx="16"/>
      <line x1="200" y1="22" x2="200" y2="4" stroke="#3b2a1c" stroke-width="2"/>
      <path d="M200 4 L226 9 L200 15Z" fill="${color}"/>
      ${[70, 150, 240, 310].map((x) => `<rect x="${x - 6}" y="58" width="12" height="12" fill="#3b2a1c" opacity=".4"/>`).join('')}`;
  } else if (kind === 'castle') {
    art = `
      <path d="M60 120 L110 60 L290 60 L340 120Z" fill="#7a8a5a"/>
      <rect x="120" y="50" width="160" height="50" fill="#a39c8e" stroke="#3b2a1c"/>
      ${[120, 150, 180, 210, 240, 270].map((x) => `<rect x="${x}" y="42" width="14" height="10" fill="#a39c8e" stroke="#3b2a1c"/>`).join('')}
      <rect x="175" y="18" width="50" height="82" fill="#978f80" stroke="#3b2a1c"/>
      ${[175, 193, 211].map((x) => `<rect x="${x}" y="10" width="12" height="10" fill="#978f80" stroke="#3b2a1c"/>`).join('')}
      <rect x="192" y="75" width="16" height="25" rx="8" fill="#3b2a1c"/>
      <line x1="200" y1="10" x2="200" y2="-8" stroke="#3b2a1c" stroke-width="2"/>
      <path d="M200 -8 L226 -3 L200 3Z" fill="${color}"/>`;
  } else if (kind === 'village') {
    art = [60, 140, 230, 310].map((x, i) => `
      <rect x="${x}" y="${80 - (i % 2) * 8}" width="46" height="34" fill="#c8a878" stroke="#3b2a1c"/>
      <path d="M${x - 6} ${80 - (i % 2) * 8} L${x + 23} ${56 - (i % 2) * 8} L${x + 52} ${80 - (i % 2) * 8}Z" fill="#8a6a3a" stroke="#3b2a1c"/>
      <rect x="${x + 18}" y="${98 - (i % 2) * 8}" width="10" height="16" fill="#3b2a1c"/>`).join('') +
      '<path d="M0 118 Q100 104 200 116 T400 112 L400 130 L0 130Z" fill="#c9b36a"/>';
  } else if (kind === 'camp') {
    art = [80, 180, 280].map((x) => `<path d="M${x - 40} 115 L${x} 55 L${x + 40} 115Z" fill="#d8ccb0" stroke="#3b2a1c"/><path d="M${x - 8} 115 L${x} 85 L${x + 8} 115Z" fill="#3b2a1c"/>`).join('') +
      `<line x1="330" y1="115" x2="330" y2="40" stroke="#3b2a1c" stroke-width="2"/><path d="M330 40 L360 46 L330 52Z" fill="${color}"/>`;
  } else if (kind === 'battle') {
    art = `
      <g stroke="#2b2118" stroke-width="3">
        ${[60, 110, 160].map((x) => `<line x1="${x}" y1="118" x2="${x + 18}" y2="30"/>`).join('')}
        ${[240, 290, 340].map((x) => `<line x1="${x}" y1="118" x2="${x - 18}" y2="30"/>`).join('')}
      </g>
      <path d="M150 60 L250 110 M250 60 L150 110" stroke="#c9c9c9" stroke-width="7" stroke-linecap="round"/>
      <path d="M150 60 L250 110 M250 60 L150 110" stroke="#555" stroke-width="2" stroke-linecap="round"/>
      <circle cx="200" cy="85" r="8" fill="${color}" stroke="#2b2118"/>`;
  } else if (kind === 'arena') {
    art = `<ellipse cx="200" cy="100" rx="170" ry="30" fill="#c9b07a" stroke="#3b2a1c"/>
      <path d="M30 100 L30 60 Q200 30 370 60 L370 100" fill="none" stroke="#7a5a3a" stroke-width="10"/>
      ${[60, 110, 160, 240, 290, 340].map((x) => `<line x1="${x}" y1="98" x2="${x}" y2="58" stroke="#5a3a1a" stroke-width="4"/>`).join('')}`;
  }
  const svg = `<svg viewBox="0 -12 400 142" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
    <defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs>
    <rect x="0" y="-12" width="400" height="142" fill="url(#skyg)"/>
    <path d="M0 100 Q80 80 160 96 T320 90 T400 94 L400 130 L0 130Z" fill="${ground}" opacity=".85"/>
    <path d="M0 112 Q120 100 220 112 T400 108 L400 130 L0 130Z" fill="${ground}"/>
    ${art}
  </svg>`;
  return h('div', { class: 'scene', html: svg });
}
