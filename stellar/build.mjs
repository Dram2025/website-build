#!/usr/bin/env node
// Static site generator for Stellar Haul Away. Zero dependencies.
//   node build.mjs          → preview build (shows labelled photo slots)
//   node build.mjs --prod   → production build (empty photo slots become branded tiles)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

import { site, nav } from './src/data/site.js';
import { services, groups, bySlug, groupByKey } from './src/data/services.js';
import { areas, otherCities, areaBySlug } from './src/data/areas.js';
import { reviews } from './src/data/reviews.js';
import { indexPhotos } from './src/lib/util.js';
import * as P from './src/templates/pages.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, 'dist');
const PROD = process.argv.includes('--prod');

const hashDir = (dir) => {
  const h = crypto.createHash('md5');
  for (const f of fs.readdirSync(dir, { recursive: true }).sort()) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isFile()) h.update(fs.readFileSync(p));
  }
  return h.digest('hex').slice(0, 8);
};

const ctx = {
  site, nav, services, groups, bySlug, groupByKey, areas, otherCities, areaBySlug, reviews, PROD,
  photos: indexPhotos(path.join(ROOT, 'src/assets/photos')),
  missingPhotos: new Set(),
  assetVersion: hashDir(path.join(ROOT, 'src/assets')),
};

// ── Validate data ───────────────────────────────────────────────────────────
const errors = [];
for (const s of services) {
  if (!groupByKey[s.group]) errors.push(`service ${s.slug}: unknown group "${s.group}"`);
  for (const r of s.related) if (!bySlug[r]) errors.push(`service ${s.slug}: unknown related "${r}"`);
}
for (const g of groups) if (!bySlug[g.pillar]) errors.push(`group ${g.key}: unknown pillar "${g.pillar}"`);
for (const a of areas) {
  for (const f of a.featured) if (!bySlug[f]) errors.push(`area ${a.slug}: unknown service "${f}"`);
  for (const n of a.nearby) if (!areaBySlug[n]) errors.push(`area ${a.slug}: unknown nearby "${n}"`);
}
const titles = new Map();
for (const s of services) titles.set(s.title, (titles.get(s.title) || 0) + 1);
for (const [t, n] of titles) if (n > 1) errors.push(`duplicate <title>: ${t}`);
if (errors.length) { console.error('✖ Data errors:\n  ' + errors.join('\n  ')); process.exit(1); }

// ── Render ──────────────────────────────────────────────────────────────────
const pages = [
  ['/', P.home(ctx), 1.0],
  ['/services/', P.servicesHub(ctx), 0.9],
  ...services.map((s) => [`/services/${s.slug}/`, P.servicePage(ctx, s), s.pillar ? 0.9 : 0.8]),
  ['/pricing/', P.pricing(ctx), 0.8],
  ['/service-areas/', P.areasHub(ctx), 0.8],
  ...areas.map((a) => [`/service-areas/${a.slug}/`, P.areaPage(ctx, a), 0.8]),
  ['/about/', P.about(ctx), 0.6],
  ['/quote/', P.quote(ctx), 0.8],
  ['/contact/', P.contact(ctx), 0.6],
  ['/privacy/', P.privacy(ctx), 0.2],
  ['/thank-you/', P.thankYou(ctx), null],
];

fs.rmSync(OUT, { recursive: true, force: true });
for (const [p, html] of pages) {
  const dir = path.join(OUT, p);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}
fs.writeFileSync(path.join(OUT, '404.html'), P.notFound(ctx));
fs.cpSync(path.join(ROOT, 'src/assets'), path.join(OUT, 'assets'), { recursive: true, filter: (f) => !f.endsWith('.gitkeep') });

// ── sitemap.xml, robots.txt, _redirects ─────────────────────────────────────
const base = site.url.replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.filter(([, , pr]) => pr !== null).map(([p, , pr]) => `  <url><loc>${base}${p}</loc><lastmod>${today}</lastmod><priority>${pr.toFixed(1)}</priority></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /thank-you/\n\nSitemap: ${base}/sitemap.xml\n`);

const host = new URL(base).host;
const alt = host.startsWith('www.') ? host.slice(4) : `www.${host}`;
fs.writeFileSync(path.join(OUT, '_redirects'), `# Canonical host
https://${alt}/*  ${base}/:splat  301!
http://${alt}/*   ${base}/:splat  301!

# Friendly URLs
/estimate        /quote/          301
/free-quote      /quote/          301
/get-a-quote     /quote/          301
/contact-us      /contact/        301
/areas           /service-areas/  301
/prices          /pricing/        301
/index.html      /                301
${services.map((s) => `/${s.slug}  /services/${s.slug}/  301`).join('\n')}
${areas.map((a) => `/${a.slug}  /service-areas/${a.slug}/  301`).join('\n')}
`);

// ── Report ──────────────────────────────────────────────────────────────────
console.log(`✓ ${PROD ? 'Production' : 'Preview'} build: ${pages.length + 1} pages → dist/`);
if (ctx.missingPhotos.size) console.log(`  ${ctx.missingPhotos.size} photo slots still empty (branded tiles shown): ${[...ctx.missingPhotos].sort().join(', ')}`);
if (site.confirm.length) console.log(`  Before launch, confirm:\n    - ${site.confirm.join('\n    - ')}`);
