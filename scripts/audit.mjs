#!/usr/bin/env node
// SEO / integrity audit for the built site (run after `npm run build`).
// Checks every page for: one <h1>, title & description length, canonical,
// valid JSON-LD, image alt text, broken internal links, duplicate titles.
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const files = fs.readdirSync(DIST, { recursive: true }).filter((f) => f.endsWith('.html'));
const problems = [];
const seenTitles = new Map();
const seenDesc = new Map();

const exists = (href) => {
  const clean = href.split(/[?#]/)[0];
  if (!clean || clean === '/') return fs.existsSync(path.join(DIST, 'index.html'));
  const p = path.join(DIST, clean);
  return fs.existsSync(p) && (fs.statSync(p).isFile() || fs.existsSync(path.join(p, 'index.html')));
};

for (const f of files) {
  const html = fs.readFileSync(path.join(DIST, f), 'utf8');
  const page = '/' + f.replace(/index\.html$/, '');
  const noindex = /name="robots" content="noindex/.test(html);
  const decode = (t) => t.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] || '');
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] || '');
  const h1s = (html.match(/<h1[\s>]/g) || []).length;

  if (h1s !== 1) problems.push(`${page}: ${h1s} <h1> tags`);
  if (!noindex) {
    if (title.length < 30 || title.length > 70) problems.push(`${page}: title length ${title.length} — "${title}"`);
    if (desc.length < 70 || desc.length > 165) problems.push(`${page}: description length ${desc.length}`);
    if (!/<link rel="canonical"/.test(html)) problems.push(`${page}: missing canonical`);
    seenTitles.set(title, [...(seenTitles.get(title) || []), page]);
    seenDesc.set(desc, [...(seenDesc.get(desc) || []), page]);
  }
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { problems.push(`${page}: invalid JSON-LD (${e.message})`); }
  }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(m[0])) problems.push(`${page}: <img> without alt`);
  for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
    if (m[1].startsWith('//')) continue;
    if (!exists(m[1])) problems.push(`${page}: broken link ${m[1]}`);
  }
  for (const m of html.matchAll(/src="(\/[^"]*)"/g)) if (!exists(m[1])) problems.push(`${page}: missing asset ${m[1]}`);
}
for (const [t, pages] of seenTitles) if (pages.length > 1) problems.push(`duplicate title "${t}" on ${pages.join(', ')}`);
for (const [d, pages] of seenDesc) if (pages.length > 1) problems.push(`duplicate description on ${pages.join(', ')}`);

const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
for (const u of urls) if (!exists(u)) problems.push(`sitemap lists missing page ${u}`);

console.log(`Audited ${files.length} HTML files, ${urls.length} sitemap URLs.`);
if (problems.length) {
  console.log(`\n✖ ${problems.length} issue(s):\n  ` + problems.join('\n  '));
  process.exit(1);
}
console.log('✔ No issues found.');
