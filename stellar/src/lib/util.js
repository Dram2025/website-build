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
  sms: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  truck: '<path d="M1 4h14v12H1zM15 9h4l4 4v3h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
  recycle: '<path d="M7 19H4.8a1.8 1.8 0 0 1-1.6-2.7L7.4 9M11 19h8.2a1.8 1.8 0 0 0 1.6-2.7l-1.2-2M14 16l-3 3 3 3M8.3 13.4 7.3 9.3 3.2 10.4M9.3 5.6l1.1-1.8a1.8 1.8 0 0 1 3.1 0l3.9 6.7M13.4 9.8l4.1 1.1 1.1-4.1"/>',
  house: '<path d="M3 10.5 12 3l9 7.5V21H3z"/><path d="M9 21v-6h6v6"/>',
  garage: '<path d="M3 21V9l9-6 9 6v12"/><path d="M7 21v-9h10v9M7 15h10M7 18h10"/>',
  sofa: '<path d="M4 11V8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3"/><path d="M2 13a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v5H2zM5 18v2M19 18v2"/>',
  fridge: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M5 10h14M9 5v2M9 13v3"/>',
  box: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.4 5.2-6"/>',
  hardhat: '<path d="M2 18h20M4 18v-3a8 8 0 0 1 16 0v3"/><path d="M10 7V5h4v2M10 7v5M14 7v5"/>',
  hammer: '<path d="m15 12-8.5 8.5a2.1 2.1 0 0 1-3-3L12 9"/><path d="M17.6 15 22 10.6M20.9 11.7l-6.6-6.6-1.4-.4L10 2l-.7.7 3.5 6.3.4 1.4 6.6 6.6"/>',
  shed: '<path d="M2 10 12 4l10 6M4 9v12h16V9"/><path d="M9 21v-7h6v7"/>',
  fence: '<path d="M4 21V6l2-3 2 3v15M10 21V6l2-3 2 3v15M16 21V6l2-3 2 3v15M2 10h20M2 16h20"/>',
  hottub: '<path d="M3 12h18v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z"/><path d="M8 8c0-1.5 1-1.5 1-3M12 8c0-1.5 1-1.5 1-3M16 8c0-1.5 1-1.5 1-3"/>',
  tearout: '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 12h7l2-3 2 3h7M12 9V3"/>',
  gravel: '<path d="M2 20h20"/><circle cx="6" cy="16" r="2.5"/><circle cx="12" cy="15" r="3"/><circle cx="18" cy="16.5" r="2"/><circle cx="9" cy="10.5" r="2"/><circle cx="15" cy="10" r="1.6"/>',
  shovel: '<path d="M2 22l1-1h3l9-9M3 21v-3l9-9M15 6l3-3 3 3-3 3M14 7l3 3"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1.5"/>',
  broom: '<path d="M19 3 11 11M8 12l4 4M5 14l5 5c-2 2-6 2-8 0 0-2 1-4 3-5zM9.5 12.5l2-2 2 2-2 2"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
};

export const icon = (name, cls = 'i') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[name] || P.check}</svg>`;

export const smsHref = (site, body = '') => `sms:${site.phoneE164}${body ? `?&body=${encodeURIComponent(body)}` : ''}`;
