import fs from 'node:fs';
import path from 'node:path';

export const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const isPlaceholder = (v) => typeof v === 'string' && /\[[^\]]+\]/.test(v);

// Returns the value, or '' when it is still a [PLACEHOLDER] — for schema/meta
// where an unfilled value must never be emitted.
export const real = (v) => (isPlaceholder(v) ? '' : v);

export const telHref = (site) => `tel:${site.phoneE164}`;

export const monthLabel = (ym) => {
  const [y, m] = ym.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
};

// ── Image dimensions (PNG / JPEG / WebP) without dependencies ───────────────
export function imageSize(file) {
  const b = fs.readFileSync(file);
  if (b.toString('ascii', 1, 4) === 'PNG') return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if ((m >= 0xc0 && m <= 0xcf) && ![0xc4, 0xc8, 0xcc].includes(m)) return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
      i += 2 + len;
    }
  }
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const fmt = b.toString('ascii', 12, 16);
    if (fmt === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    if (fmt === 'VP8L') {
      const n = b.readUInt32LE(21);
      return { w: (n & 0x3fff) + 1, h: ((n >> 14) & 0x3fff) + 1 };
    }
    if (fmt === 'VP8X') return { w: b.readUIntLE(24, 3) + 1, h: b.readUIntLE(27, 3) + 1 };
  }
  return { w: 1600, h: 1067 };
}

// ── Photo index: src/assets/photos/<name>.(webp|jpg|jpeg|png|mp4) ──────────
export function indexPhotos(dir) {
  const map = {};
  if (!fs.existsSync(dir)) return map;
  for (const f of fs.readdirSync(dir)) {
    const ext = path.extname(f).toLowerCase();
    const name = path.basename(f, ext);
    if (['.webp', '.jpg', '.jpeg', '.png'].includes(ext)) {
      const prev = map[name];
      if (!prev || ext === '.webp') map[name] = { src: `/assets/photos/${f}`, ...imageSize(path.join(dir, f)) };
    } else if (ext === '.mp4') {
      map[`${name}.video`] = { src: `/assets/photos/${f}` };
    }
  }
  return map;
}

// ── Inline SVG icons (24px stroke) ──────────────────────────────────────────
const P = {
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  badge: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="11" r="2.5"/><path d="M5.5 17c.6-1.7 2-2.5 3.5-2.5s2.9.8 3.5 2.5M14 9h4M14 13h4"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  truck: '<path d="M1 4h14v12H1zM15 9h4l4 4v3h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
  recycle: '<path d="M7 19H4.8a1.8 1.8 0 0 1-1.6-2.7L7.4 9M11 19h8.2a1.8 1.8 0 0 0 1.6-2.7l-1.2-2M14 16l-3 3 3 3M8.3 13.4 7.3 9.3 3.2 10.4M9.3 5.6l1.1-1.8a1.8 1.8 0 0 1 3.1 0l3.9 6.7M13.4 9.8l4.1 1.1 1.1-4.1"/>',
  house: '<path d="M3 10.5 12 3l9 7.5V21H3z"/><path d="M9 21v-6h6v6"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
  hammer: '<path d="m15 12-8.5 8.5a2.1 2.1 0 0 1-3-3L12 9"/><path d="M17.6 15 22 10.6M20.9 11.7l-6.6-6.6-1.4-.4L10 2l-.7.7 3.5 6.3.4 1.4 6.6 6.6"/>',
  concrete: '<path d="M2 20h20M4 20V10l4-2 4 2 4-2 4 2v10"/><path d="M8 14h.01M12 16h.01M16 13h.01"/>',
  driveway: '<path d="M8 3 4 21M16 3l4 18M12 5v2M12 11v2M12 17v2"/>',
  patio: '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
  sidewalk: '<path d="M6 3 3 21M18 3l3 18M5 9h14M4 15h16"/>',
  slab: '<path d="m2 12 10-5 10 5-10 5z"/><path d="m2 12v3l10 5 10-5v-3"/>',
  garage: '<path d="M3 21V9l9-6 9 6v12"/><path d="M7 21v-9h10v9M7 15h10M7 18h10"/>',
  wall: '<rect x="2" y="4" width="20" height="16"/><path d="M2 9.3h20M2 14.6h20M8 4v5.3M16 4v5.3M12 9.3v5.3M8 14.6V20M16 14.6V20"/>',
  retaining: '<path d="M3 21h18M5 21V9M5 9c5 0 9 3 14 3v9"/><path d="M5 13h3M5 17h3"/>',
  chimney: '<path d="M2 21h20M4 21V12l8-6 8 6v9"/><path d="M15 8V3h3v7"/>',
  asphalt: '<path d="M3 20 9 4h6l6 16z"/><path d="M12 7v2M12 12v2M12 17v2"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
  hardhat: '<path d="M2 18h20M4 18v-3a8 8 0 0 1 16 0v3"/><path d="M10 7V5h4v2M10 7v5M14 7v5"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  clipboard: '<rect x="5" y="3" width="14" height="19" rx="2"/><path d="M9 3h6v3H9zM9 12h6M9 16h4"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
};

export const icon = (name, cls = 'i') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[name] || P.check}</svg>`;
