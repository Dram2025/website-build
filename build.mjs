#!/usr/bin/env node
// Static site generator for D.RAM Demolition. Zero dependencies.
//   node build.mjs          → preview build (shows photo slots + sample projects)
//   node build.mjs --prod   → production build (fails on unfilled placeholders,
//                             excludes sample projects)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

import { site, nav } from './src/data/site.js';
import { services, serviceGroups, bySlug } from './src/data/services.js';
import { locations, otherCities, regionalMarkets, locBySlug } from './src/data/locations.js';
import { projects as allProjects } from './src/data/projects.js';
import { reviews } from './src/data/reviews.js';
import { indexPhotos } from './src/lib/util.js';
import * as P from './src/templates/pages.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, 'dist');
const PROD = process.argv.includes('--prod');

const hashDir = (dir) => {
  const h = crypto.createHash('md5');
  for (const f of fs.readdirSync(dir, { recursive: true })) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isFile()) h.update(fs.readFileSync(p));
  }
  return h.digest('hex').slice(0, 8);
};

const projects = PROD ? allProjects.filter((p) => !p.sample) : allProjects;

const ctx = {
  site, nav, services, serviceGroups, bySlug, locations, otherCities, regionalMarkets, locBySlug,
  projects, reviews, PROD,
  photos: indexPhotos(path.join(ROOT, 'src/assets/photos')),
  missingPhotos: new Set(),
  assetVersion: hashDir(path.join(ROOT, 'src/assets')),
};

// ── Validate data integrity ─────────────────────────────────────────────────
const errors = [];
for (const s of services) for (const r of s.related) if (!bySlug[r]) errors.push(`service ${s.slug}: unknown related "${r}"`);
for (const l of locations) {
  for (const f of l.featured) if (!bySlug[f]) errors.push(`location ${l.slug}: unknown service "${f}"`);
  for (const n of l.nearby) if (!locBySlug[n]) errors.push(`location ${l.slug}: unknown nearby "${n}"`);
}
for (const p of allProjects) {
  if (!bySlug[p.service]) errors.push(`project ${p.slug}: unknown service "${p.service}"`);
  if (!locBySlug[p.city]) errors.push(`project ${p.slug}: unknown city "${p.city}"`);
}
const titles = new Map();
for (const s of services) titles.set(s.title, (titles.get(s.title) || 0) + 1);
for (const l of locations) titles.set(l.title, (titles.get(l.title) || 0) + 1);
for (const [t, n] of titles) if (n > 1) errors.push(`duplicate <title>: ${t}`);
if (errors.length) { console.error('✖ Data errors:\n  ' + errors.join('\n  ')); process.exit(1); }

// ── Render pages ────────────────────────────────────────────────────────────
const pages = [
  ['/', P.home(ctx), 1.0],
  ['/services/', P.servicesHub(ctx), 0.9],
  ...services.map((s) => [`/services/${s.slug}/`, P.servicePage(ctx, s), 0.9]),
  ['/residential/', P.residential(ctx), 0.8],
  ['/commercial/', P.commercial(ctx), 0.8],
  ['/commercial-bid/', P.commercialBid(ctx), 0.7],
  ['/estimate/', P.estimate(ctx), 0.8],
  ['/service-areas/', P.areasHub(ctx), 0.8],
  ...locations.map((l) => [`/service-areas/${l.slug}/`, P.locationPage(ctx, l), 0.8]),
  ['/projects/', P.projectsHub(ctx), 0.7],
  ...projects.map((p) => [`/projects/${p.slug}/`, P.projectPage(ctx, p), p.sample ? null : 0.6]),
  ['/about/', P.about(ctx), 0.6],
  ['/contact/', P.contact(ctx), 0.6],
  ['/privacy/', P.privacy(ctx), 0.2],
  ['/thank-you/', P.thankYou(ctx), null],
];

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
for (const [p, html] of pages) {
  const dir = path.join(OUT, p);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}
fs.writeFileSync(path.join(OUT, '404.html'), P.notFound(ctx));
fs.cpSync(path.join(ROOT, 'src/assets'), path.join(OUT, 'assets'), { recursive: true });
fs.renameSync(path.join(OUT, 'assets/favicon.ico'), path.join(OUT, 'favicon.ico'));

// ── sitemap.xml, robots.txt, _redirects ─────────────────────────────────────
const base = site.url.replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.filter(([, , pr]) => pr !== null).map(([p, , pr]) => `  <url><loc>${base}${p}</loc><lastmod>${today}</lastmod><priority>${pr.toFixed(1)}</priority></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *
Allow: /
Disallow: /thank-you/

Sitemap: ${base}/sitemap.xml
`);

const host = new URL(base).host;
const apex = host.replace(/^www\./, '');
fs.writeFileSync(path.join(OUT, '_redirects'), `# Canonical host (apex → www) — keeps one indexable version of every URL
https://${apex}/*  ${base}/:splat  301!
http://${apex}/*   ${base}/:splat  301!

# Friendly / legacy URLs
/quote            /estimate/          301
/free-estimate    /estimate/          301
/get-a-quote      /estimate/          301
/contact-us       /contact/           301
/bid              /commercial-bid/    301
/request-a-bid    /commercial-bid/    301
/portfolio        /projects/          301
/gallery          /projects/          301
/areas            /service-areas/     301
/locations        /service-areas/     301
/home             /                   301
/index.html       /                   301
${services.map((s) => `/${s.slug}  /services/${s.slug}/  301`).join('\n')}
${locations.map((l) => `/${l.slug}  /service-areas/${l.slug}/  301`).join('\n')}
`);

// ── Report ──────────────────────────────────────────────────────────────────
const placeholderRe = /\[(?:[A-Z][A-Z0-9 #\/\-&]{2,})[^\]\n]{0,800}\]/g;
const found = new Map();
for (const f of fs.readdirSync(OUT, { recursive: true })) {
  if (!f.endsWith('.html')) continue;
  const text = fs.readFileSync(path.join(OUT, f), 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
  for (const m of text.matchAll(placeholderRe)) {
    if (!found.has(m[0])) found.set(m[0], new Set());
    found.get(m[0]).add(f);
  }
}

console.log(`✔ Built ${pages.length + 1} pages → dist/ (${PROD ? 'production' : 'preview'})`);
if (ctx.missingPhotos.size) {
  console.log(`\n📷 ${ctx.missingPhotos.size} photo slots still empty (add files to src/assets/photos/):`);
  console.log('   ' + [...ctx.missingPhotos].sort().join(', '));
}
if (found.size) {
  console.log(`\n⚠ ${found.size} placeholder value(s) still to fill in (src/data/site.js, pages):`);
  for (const [k, v] of found) console.log(`   ${k}  (${v.size} page${v.size > 1 ? 's' : ''})`);
  if (PROD) { console.error('\n✖ Production build blocked: replace every [PLACEHOLDER] first.'); process.exit(1); }
}
