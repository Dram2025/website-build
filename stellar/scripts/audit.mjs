#!/usr/bin/env node
// Post-build checks: broken internal links/assets, missing titles/descriptions,
// duplicate titles, one <h1> per page, valid JSON-LD.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const files = fs.readdirSync(DIST, { recursive: true }).filter((f) => f.endsWith('.html'));
const problems = [];
const titles = new Map();
const exists = (u) => {
  const p = path.join(DIST, decodeURIComponent(u.split(/[?#]/)[0]));
  return fs.existsSync(p) && (fs.statSync(p).isFile() || fs.existsSync(path.join(p, 'index.html')));
};
for (const f of files) {
  const html = fs.readFileSync(path.join(DIST, f), 'utf8');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  if (!title) problems.push(`${f}: no <title>`);
  else if (!f.includes('thank-you') && f !== '404.html') titles.set(title, [...(titles.get(title) || []), f]);
  if (!/<meta name="description" content="[^"]{50,}/.test(html) && f !== '404.html' && !f.includes('thank-you')) problems.push(`${f}: short/missing meta description`);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) problems.push(`${f}: ${h1} <h1> tags`);
  for (const [, u] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) if (!u.startsWith('//') && !exists(u)) problems.push(`${f}: broken link ${u}`);
  for (const [, j] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(j); } catch { problems.push(`${f}: invalid JSON-LD`); }
  }
}
for (const [t, fs_] of titles) if (fs_.length > 1) problems.push(`duplicate title "${t}": ${fs_.join(', ')}`);
if (problems.length) { console.error(`✖ ${problems.length} problem(s):\n  ` + problems.join('\n  ')); process.exit(1); }
console.log(`✓ Audit passed: ${files.length} pages, no broken links, titles unique.`);
