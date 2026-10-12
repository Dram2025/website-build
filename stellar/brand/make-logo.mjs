#!/usr/bin/env node
// Generates the Stellar Haul Away logo set (SVG sources + PNG/WebP exports).
//   node brand/make-logo.mjs
// Needs Playwright + Chromium (for PNG export) and the Inter Display font.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const C = { navy: '#0F1B2D', gold: '#F5B82E', cream: '#FFF8EC', white: '#FFFFFF' };
const FONT = "'Inter Display','Inter',system-ui,sans-serif";

// 5-point star path, centred on (cx, cy), outer radius R, rotated by deg.
function star(cx, cy, R, ratio = 0.5, deg = -14) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? R * ratio : R;
    const a = ((-90 + i * 36 + deg) * Math.PI) / 180;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join('L')}Z`;
}

// The mark: a shooting star — junk gone in a flash.
function mark({ x = 0, y = 0, s = 100, bg = C.navy, fg = C.gold, tile = true } = {}) {
  const k = s / 100;
  const p = (v) => (v * k).toFixed(2);
  // Streaks trail the star at 30° toward the lower left, clear of its points.
  const [cx, cy, dx, dy, nx, ny] = [63, 41, -0.866, 0.5, 0.5, 0.866];
  const streak = (off, len, gap = 31) => {
    const x1 = cx + dx * gap + nx * off, y1 = cy + dy * gap + ny * off;
    return `<line x1="${p(x1)}" y1="${p(y1)}" x2="${p(x1 + dx * len)}" y2="${p(y1 + dy * len)}" stroke="${fg}" stroke-width="${p(7)}" stroke-linecap="round"/>`;
  };
  return `<g transform="translate(${x} ${y})">
  ${tile ? `<rect width="${p(100)}" height="${p(100)}" rx="${p(24)}" fill="${bg}"/>` : ''}
  <path d="${star(cx * k, cy * k, 24 * k, 0.48)}" fill="${fg}" stroke="${fg}" stroke-width="${p(3)}" stroke-linejoin="round"/>
  ${streak(-12, 12)}${streak(0, 28)}${streak(12, 18)}
</g>`;
}

const svg = (w, h, inner, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : ''}${inner}</svg>`;

// Horizontal lockup: mark + two-line wordmark
function horizontal({ dark = false } = {}) {
  const word = dark ? C.white : C.navy;
  const sub = dark ? C.gold : C.navy;
  return svg(720, 200, `
  ${mark({ x: 10, y: 10, s: 180, bg: dark ? C.gold : C.navy, fg: dark ? C.navy : C.gold })}
  <text x="222" y="118" font-family="${FONT}" font-weight="900" font-size="104" letter-spacing="1" fill="${word}">STELLAR</text>
  <rect x="226" y="146" width="70" height="9" rx="4.5" fill="${C.gold}"/>
  <text x="312" y="160" font-family="${FONT}" font-weight="800" font-size="40" letter-spacing="18" fill="${sub}">HAUL AWAY</text>`);
}

// Stacked lockup (square) for profile pictures
function stacked({ dark = false, bg } = {}) {
  const word = dark ? C.white : C.navy;
  return svg(600, 600, `
  ${mark({ x: 190, y: 70, s: 220, bg: dark ? C.gold : C.navy, fg: dark ? C.navy : C.gold })}
  <text x="300" y="418" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="104" letter-spacing="1" fill="${word}">STELLAR</text>
  <text x="306" y="476" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="36" letter-spacing="12" fill="${dark ? C.gold : C.navy}">HAUL AWAY</text>
  <text x="300" y="528" text-anchor="middle" font-family="${FONT}" font-weight="600" font-size="20" letter-spacing="5" fill="${dark ? '#9FB0C8' : '#5A6B82'}">JUNK REMOVAL · FULLERTON, CA</text>`, bg);
}

const files = {
  'stellar-mark.svg': svg(100, 100, mark()),
  'stellar-logo.svg': horizontal(),
  'stellar-logo-dark.svg': svg(720, 200, horizontal({ dark: true }).replace(/^<svg[^>]*>|<\/svg>$/g, ''), C.navy),
  'stellar-logo-stacked.svg': stacked({ bg: C.white }),
  'stellar-logo-stacked-dark.svg': stacked({ dark: true, bg: C.navy }),
};
for (const [f, s] of Object.entries(files)) fs.writeFileSync(path.join(DIR, f), s);

// ── Raster exports ───────────────────────────────────────────────────────────
const pw = await import(process.env.PLAYWRIGHT_PATH || 'playwright');
const chromium = pw.chromium || pw.default.chromium;
const browser = await chromium.launch();
const page = await browser.newPage();
async function render(svgStr, w, h, out, { pad = 0, bg = 'transparent', fit = 1 } = {}) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<html><body style="margin:0;background:${bg};width:${w}px;height:${h}px;display:grid;place-items:center">
    <div style="width:${(w - pad * 2) * fit}px;height:${h - pad * 2}px;display:grid;place-items:center">${svgStr.replace(/width="\d+" height="\d+"/, 'style="max-width:100%;max-height:100%;width:100%;height:100%"')}</div></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  const file = path.join(DIR, 'exports', out);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await page.screenshot({ path: file, omitBackground: bg === 'transparent' });
  return file;
}
const H = files['stellar-logo.svg'], HD = horizontal({ dark: true });
await render(H, 1440, 400, 'logo-horizontal-1440.png');
await render(HD, 1440, 400, 'logo-horizontal-dark-1440.png', { bg: C.navy, pad: 30 });
await render(files['stellar-logo-stacked.svg'], 1200, 1200, 'logo-square-1200.png');
await render(files['stellar-logo-stacked-dark.svg'], 1200, 1200, 'logo-square-dark-1200.png');
await render(files['stellar-logo-stacked.svg'], 720, 720, 'google-profile-720.png');
await render(H, 1200, 300, 'logo-wide-1200x300.png', { bg: C.white, pad: 30 });
await render(H, 1200, 628, 'logo-landscape-1200x628.png', { bg: C.white, pad: 150 });
await render(files['stellar-mark.svg'], 512, 512, 'icon-512.png');
await render(files['stellar-mark.svg'], 180, 180, 'apple-touch-icon.png', { bg: C.navy });
await render(files['stellar-mark.svg'], 64, 64, 'favicon-64.png');
// website copies
await render(H, 480, 134, '../../src/assets/img/logo-480.png');
await render(H, 960, 268, '../../src/assets/img/logo-960.png');
await render(HD, 480, 134, '../../src/assets/img/logo-dark-480.png');
await render(HD, 960, 268, '../../src/assets/img/logo-dark-960.png');
await render(files['stellar-mark.svg'], 512, 512, '../../src/assets/img/icon-512.png');
await render(files['stellar-mark.svg'], 180, 180, '../../src/assets/img/apple-touch-icon.png', { bg: C.navy });
await render(files['stellar-mark.svg'], 64, 64, '../../src/assets/img/favicon.png');
fs.copyFileSync(path.join(DIR, 'stellar-mark.svg'), path.join(DIR, '../src/assets/img/favicon.svg'));

// Social share card (Facebook, iMessage, Google link previews)
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(`<html><body style="margin:0;width:1200px;height:630px;background:${C.navy};font-family:${FONT};display:flex;flex-direction:column;justify-content:center;padding:0 90px;box-sizing:border-box;color:#fff">
  <div style="width:620px">${HD.replace(/width="\d+" height="\d+"/, 'style="width:100%;height:auto"')}</div>
  <p style="font-weight:900;font-size:64px;line-height:1.05;letter-spacing:-2px;margin:48px 0 18px">Point at it.<br><span style="color:${C.gold}">We make it disappear.</span></p>
  <p style="font-weight:600;font-size:28px;color:#C9D3E2;margin:0">Junk removal · Light demolition · Material delivery · Fullerton, CA</p>
</body></html>`);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(DIR, '../src/assets/img/og-default.png') });
await browser.close();

// WebP copies for the website (Pillow)
const { execFileSync } = await import('node:child_process');
execFileSync('python3', ['-c', `
import sys
from PIL import Image
for f in sys.argv[1:]:
    Image.open(f).save(f[:-4] + '.webp', 'WEBP', quality=90, method=6)
`, ...['logo-480', 'logo-960', 'logo-dark-480', 'logo-dark-960'].map((n) => path.join(DIR, `../src/assets/img/${n}.png`))]);
console.log('✓ logo set written to brand/ and brand/exports/');
