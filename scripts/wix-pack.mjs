#!/usr/bin/env node
// Generates handoff/launch-guide.html: a single, self-contained page with
//   1. Netlify setup steps (host this custom site)
//   2. Wix setup steps (rebuild it in the Wix editor)
//   3. Copy-ready Wix content for every page: SEO title, description, URL,
//      headings, body copy, FAQs and structured data, with copy buttons.
// Content is read from the built site (dist/), so run `npm run build:prod`
// first — `npm run handoff` does both. Re-run whenever content changes.
import fs from 'node:fs';
import path from 'node:path';
import { site } from '../src/data/site.js';
import { services } from '../src/data/services.js';
import { locations, otherCities } from '../src/data/locations.js';
import { timelines, customerTypes } from '../src/templates/components.js';

const DIST = path.resolve('dist');
const OUT = path.resolve('handoff/launch-guide.html');
const base = site.url.replace(/\/$/, '');

// ── Wix URLs: Wix static pages use single-level slugs ───────────────────────
const wixUrl = (p) => {
  p = p.replace(base, '');
  let m;
  if (p === '/' || p === '') return '/';
  if ((m = p.match(/^\/services\/([^/]+)\/?/))) return `/${m[1]}`;
  if ((m = p.match(/^\/service-areas\/([^/]+)\/?/))) return `/demolition-${m[1]}`;
  if ((m = p.match(/^\/projects\/([^/]+)\/?/))) return `/projects/${m[1]}`;
  if (p.startsWith('/privacy')) return '/privacy-policy';
  return p.replace(/\/$/, '');
};
const mapUrlsInJson = (obj) =>
  JSON.parse(JSON.stringify(obj).replace(new RegExp(base.replace(/[.]/g, '\\.') + '(/[^"#]*)?', 'g'), (_, p = '/') => base + wixUrl(p)));

// ── HTML → copy blocks ──────────────────────────────────────────────────────
const decode = (t) => t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
const text = (h) => decode(h.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function blocks(html) {
  let m = html.match(/<main id="main">([\s\S]*?)<\/main>/)[1];
  m = m
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<svg[\s\S]*?<\/svg>/g, '')
    .replace(/<form[\s\S]*?<\/form>/g, '')
    .replace(/<nav class="crumbs"[\s\S]*?<\/nav>/g, '')
    .replace(/<section class="trust"[\s\S]*?<\/section>/g, '')
    .replace(/<aside class="sidecard[\s\S]*?<\/aside>/g, '')
    .replace(/<div class="photo photo--ph[^"]*"[^>]*>[\s\S]*?<\/div>/g, '')
    .replace(/<details><summary><h3>([\s\S]*?)<\/h3>[\s\S]*?<\/summary><div><p>([\s\S]*?)<\/p><\/div><\/details>/g, (_, q, a) => `<faq q="${esc(text(q))}">${a}</faq>`);
  const out = [];
  const re = /<(h1|h2|h3|p|li|dt|dd)\b[^>]*>([\s\S]*?)<\/\1>|<a class="btn[^"]*" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>|<a class="(?:scard|lcard|pcard|aud__card)[^"]*" href="([^"]+)"|<faq q="([^"]*)">([\s\S]*?)<\/faq>/g;
  for (const x of m.matchAll(re)) {
    if (x[1]) { const t = text(x[2]); if (t) out.push({ t: x[1], v: t }); }
    else if (x[3]) out.push({ t: 'btn', v: text(x[4]), href: x[3] });
    else if (x[5]) out.push({ t: 'card', href: x[5] });
    else if (x[6]) out.push({ t: 'faq', q: decode(x[6]), a: text(x[7]) });
  }
  return out;
}

function renderBlocks(bl) {
  let h = '';
  let inList = false;
  const close = () => { if (inList) { h += '</ul>'; inList = false; } };
  const linkFor = (href) => (href.startsWith('tel:') ? `phone link ${href.slice(4)}` : href.startsWith('mailto:') ? `email link` : `link to <code>${esc(wixUrl(href))}</code>`);
  for (const b of bl) {
    if (b.t === 'li') { if (!inList) { h += '<ul>'; inList = true; } h += `<li>${esc(b.v)}</li>`; continue; }
    close();
    if (b.t === 'h1') h += `<h3 class="c-h1"><span class="lbl">H1</span>${esc(b.v)}</h3>`;
    else if (b.t === 'h2') h += `<h4 class="c-h2"><span class="lbl">H2</span>${esc(b.v)}</h4>`;
    else if (b.t === 'h3') h += `<h5 class="c-h3"><span class="lbl">H3</span>${esc(b.v)}</h5>`;
    else if (b.t === 'p' || b.t === 'dd') h += `<p>${esc(b.v)}</p>`;
    else if (b.t === 'dt') h += `<p class="dt">${esc(b.v)}</p>`;
    else if (b.t === 'btn') h += `<p class="btn-note">▢ Button: <b>${esc(b.v)}</b> → ${linkFor(b.href)}</p>`;
    else if (b.t === 'card') h += `<p class="card-note">↳ Card links to <code>${esc(wixUrl(b.href))}</code></p>`;
    else if (b.t === 'faq') h += `<div class="faq"><p class="q">Q: ${esc(b.q)}</p><p>A: ${esc(b.a)}</p></div>`;
  }
  close();
  return h;
}

// ── Collect pages in sitemap order ──────────────────────────────────────────
const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
paths.push('/thank-you/');

const pages = paths.map((p) => {
  const html = fs.readFileSync(path.join(DIST, p, 'index.html'), 'utf8');
  const title = decode(html.match(/<title>([^<]*)<\/title>/)[1]);
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)[1]);
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const own = ld.filter((s) => s['@type'] !== 'HomeAndConstructionBusiness' || p === '/').map(mapUrlsInJson);
  const h1 = text(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1]);
  const group = p === '/' ? 'Main' : p.startsWith('/services/') && p !== '/services/' ? 'Service pages' : p.startsWith('/service-areas/') && p !== '/service-areas/' ? 'City pages' : p.startsWith('/projects/') && p !== '/projects/' ? 'Projects (Wix CMS)' : 'Main';
  return { p, wix: wixUrl(p), title, desc, h1, ld: own, body: renderBlocks(blocks(html)), group, noindex: p === '/thank-you/' };
});

const id = (p) => 'pg' + (p.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home');
const groups = [...new Set(pages.map((x) => x.group))];
const redirects = pages.filter((x) => x.p !== x.wix + '/' && x.p !== '/').map((x) => `<tr><td><code>${esc(x.p)}</code></td><td><code>${esc(x.wix)}</code></td></tr>`).join('');

const hours = site.hours.map((h) => `${h.days}: ${h.open}–${h.close}`).join('; ');
const svcNames = services.map((s) => s.name);
const cities = [...locations.map((l) => l.name), ...otherCities].sort();

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>D.RAM Launch Guide</title>
<style>
:root{--o:#f26a1b;--k:#111;--m:#5a5e63;--l:#e2ded8;--p:#f6f4f1;--b:#fff}
*{box-sizing:border-box}body{margin:0;font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--k);background:var(--p)}
header{background:#000;color:#fff;padding:20px 16px;border-bottom:4px solid var(--o)}header h1{margin:0;font-size:1.5rem}header p{margin:4px 0 0;color:#bbb}
.tabs{display:flex;gap:6px;flex-wrap:wrap;padding:12px 16px;background:#111;position:sticky;top:0;z-index:5}
.tabs button{font:600 .95rem system-ui;padding:10px 14px;border-radius:6px;border:0;background:#2a2c2f;color:#fff;cursor:pointer}.tabs button[aria-selected=true]{background:var(--o);color:#000}
main{max-width:1100px;margin:0 auto;padding:20px 16px 80px}.tab{display:none}.tab.on{display:block}
h2{font-size:1.5rem;margin:28px 0 8px}h3{margin:20px 0 6px}
.box{background:var(--b);border:1px solid var(--l);border-radius:10px;padding:18px 20px;margin:14px 0}
.warn{background:#fff5d1;border-color:#f0d27a}.ok{background:#e9f6ee;border-color:#a9d9b9}
ol.steps>li{margin-bottom:12px}code{background:#efece7;padding:1px 5px;border-radius:4px;font-size:.9em}
table{border-collapse:collapse;width:100%;font-size:.92rem}td,th{border:1px solid var(--l);padding:6px 8px;text-align:left;vertical-align:top}
.layout{display:grid;gap:20px}@media(min-width:900px){.layout{grid-template-columns:240px 1fr}}
nav.toc{position:sticky;top:70px;align-self:start;max-height:80vh;overflow:auto;background:var(--b);border:1px solid var(--l);border-radius:10px;padding:12px;font-size:.9rem}
nav.toc b{display:block;margin:10px 0 4px;font-size:.78rem;text-transform:uppercase;letter-spacing:.08em;color:var(--m)}nav.toc a{display:block;padding:3px 0;color:var(--k);text-decoration:none}nav.toc a:hover{color:var(--o)}
@media(max-width:899px){nav.toc{position:static;max-height:none}}
.page{scroll-margin-top:70px;background:var(--b);border:1px solid var(--l);border-radius:12px;margin-bottom:24px;overflow:hidden}
.page>header{background:#1b1d20;border-bottom:3px solid var(--o);padding:14px 18px}.page>header h2{margin:0;font-size:1.2rem;color:#fff}.page>header p{margin:2px 0 0;font-size:.85rem}
.seo{display:grid;gap:8px;padding:14px 18px;background:#faf9f7;border-bottom:1px solid var(--l)}
.seo div{display:grid;grid-template-columns:130px 1fr auto;gap:8px;align-items:start}.seo span.k{font-weight:700;font-size:.85rem;color:var(--m)}
@media(max-width:600px){.seo div{grid-template-columns:1fr auto}.seo span.k{grid-column:1/-1}}
button.cp{font:600 .8rem system-ui;padding:5px 10px;border:1px solid var(--k);border-radius:5px;background:#fff;cursor:pointer;white-space:nowrap}button.cp.done{background:var(--o);border-color:var(--o)}
.content{padding:6px 18px 16px}.content .lbl{display:inline-block;font:700 .65rem system-ui;background:#000;color:var(--o);padding:2px 5px;border-radius:3px;margin-right:8px;vertical-align:middle}
.c-h1{font-size:1.4rem}.c-h2{font-size:1.15rem;margin:18px 0 6px}.c-h3{font-size:1rem;margin:12px 0 4px}
.btn-note,.card-note{font-size:.88rem;color:#7a4a00;background:#fff4e8;padding:4px 8px;border-radius:5px;display:inline-block;margin:2px 0}.dt{font-weight:700;margin-bottom:0}
.faq{border-left:3px solid var(--o);padding-left:10px;margin:8px 0}.faq .q{font-weight:700;margin-bottom:0}
details.ld{padding:0 18px 16px}details.ld pre{white-space:pre-wrap;word-break:break-all;background:#111;color:#eee;padding:12px;border-radius:8px;font-size:.78rem;max-height:300px;overflow:auto}
.sw{display:inline-block;width:18px;height:18px;border-radius:4px;vertical-align:-4px;border:1px solid #999;margin-right:6px}
</style></head><body>
<header><h1>D.RAM Demolition — Launch Guide</h1><p>Netlify setup · Wix setup · copy-ready Wix content for all ${pages.length} pages. Generated ${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}.</p></header>
<div class="tabs" role="tablist">
  <button role="tab" aria-selected="true" data-tab="t-start">Start here</button>
  <button role="tab" aria-selected="false" data-tab="t-netlify">Netlify setup</button>
  <button role="tab" aria-selected="false" data-tab="t-wix">Wix setup</button>
  <button role="tab" aria-selected="false" data-tab="t-pages">Wix page content</button>
</div>
<main>

<section class="tab on" id="t-start">
  <h2>You have two versions of the same website</h2>
  <div class="box"><b>Netlify version</b> — the custom-coded site already built for you: custom design, multi-step estimate form with photo upload, automatic lead scoring, confirmation emails/texts and full tracking. You change it by asking Claude or editing text files on GitHub.</div>
  <div class="box"><b>Wix version</b> — the same pages, text, SEO titles and Google data, rebuilt by you (or a Wix designer) in the Wix drag-and-drop editor using the content in the <b>Wix page content</b> tab. Easiest to change yourself; uses Wix's own forms and templates.</div>
  <div class="box warn"><b>Important: only one can be live on dramdemo.com.</b> A domain points to one website at a time, and publishing the same text on two public sites makes Google treat them as duplicates — both rank worse. Pick one to be the real site on dramdemo.com. Keep the other unpublished (Wix) or on its free test address (Netlify’s pages already tell Google the real address is www.dramdemo.com, so a Netlify test copy won’t compete).</div>
  <h3>Still needed from you (either version)</h3>
  <ul><li>Your own job photos — the single biggest trust and ranking factor</li><li>Your years of demolition experience, and weekend hours if any</li><li>Your own story for the About page (there is factual placeholder text for now)</li><li>Google Business Profile and social links when ready</li></ul>
</section>

<section class="tab" id="t-netlify">
  <h2>Put the custom site live on Netlify</h2>
  <div class="box ok"><b>Cost:</b> Netlify’s free plan covers this site. Optional paid add-ons only if you later want lots of form submissions or team members.</div>
  <h3>A. Full setup (recommended — everything works)</h3>
  <ol class="steps">
    <li>Go to <b>netlify.com</b> → <b>Sign up</b> → <b>Sign up with GitHub</b>, using the GitHub account that owns <code>Dram2025/website-build</code>.</li>
    <li>Click <b>Add new site → Import an existing project → GitHub</b>, choose <code>website-build</code>. For branch, pick <code>claude/dram-demolition-website-y8kc10</code> (or <code>main</code> once you merge it). Netlify reads the build settings automatically — just click <b>Deploy</b>.</li>
    <li>In a minute you get a free test address like <code>random-name.netlify.app</code>. Open it on your phone and click around.</li>
    <li><b>Turn on forms:</b> Site configuration → <b>Forms</b> → enable <b>form detection</b>, then <b>Deploys → Trigger deploy</b>. Under <b>Forms → Form notifications</b> add an email notification to <code>${esc(site.email)}</code> so every lead also lands in your inbox.</li>
    <li>Submit a test estimate on the live test site and confirm it shows up under <b>Forms</b> and in your email.</li>
    <li><b>Connect dramdemo.com</b> (when you’re ready to go live): <b>Domain management → Add a domain → dramdemo.com</b>. Netlify shows the exact DNS records to set. If your domain was bought through Wix: in Wix go to <b>Domains → ⋯ → Manage DNS records</b>, and replace the A record and the <code>www</code> CNAME with the values Netlify shows. HTTPS turns on automatically within an hour.</li>
    <li><b>Optional upgrades</b> (Site configuration → Environment variables), each switches on by itself:
      <table><tr><th>Feature</th><th>Sign up at</th><th>Variables</th></tr>
      <tr><td>Instant lead email with priority tags + customer confirmation email</td><td>resend.com (free tier)</td><td><code>RESEND_API_KEY</code>, <code>LEAD_FROM</code>, <code>LEAD_NOTIFY_TO</code></td></tr>
      <tr><td>Text alerts to your phone for hot leads; confirmation texts to customers who opt in</td><td>twilio.com (pay per text; requires business texting registration)</td><td><code>TWILIO_ACCOUNT_SID</code>, <code>TWILIO_AUTH_TOKEN</code>, <code>TWILIO_FROM</code>, <code>OWNER_SMS_TO</code></td></tr>
      <tr><td>Send leads to a CRM or Google Sheet</td><td>zapier.com or make.com (“Catch webhook”)</td><td><code>CRM_WEBHOOK_URL</code></td></tr></table>
      Ask Claude to walk you through any of these when you get there.</li>
    <li><b>Google:</b> create Google Analytics (GA4) and Search Console in the company’s Google account, then send Claude the GA4 ID (starts with <code>G-</code>) to add.</li>
  </ol>
  <h3>B. Quick look (no account linking)</h3>
  <p>Go to <b>app.netlify.com/drop</b> and drag in the <code>dram-site-netlify.zip</code> file (unzipped folder) Claude sent you. You get a live test link instantly. Forms appear in the dashboard, but the automatic emails/texts and auto-updates from GitHub need setup A.</p>
  <h3>Making changes later</h3>
  <ul><li>Ask Claude (“change the hours”, “add this project with these photos”) — changes go to GitHub and Netlify republishes automatically.</li><li>Or edit text yourself on github.com: open the file (e.g. <code>src/data/site.js</code>), click the ✏️ pencil, edit, <b>Commit changes</b>.</li></ul>
</section>

<section class="tab" id="t-wix">
  <h2>Rebuild the site in Wix</h2>
  <div class="box">Work in this order: settings → header/footer → forms → pages (copy from the <b>Wix page content</b> tab) → SEO → test → publish. Start from a blank or simple dark template; you’re only borrowing its layout.</div>
  <h3>1. Business info & design</h3>
  <ul>
    <li><b>Settings → Business Info:</b> name <b>${esc(site.name)}</b>, phone <b>${esc(site.phone)}</b>, email <b>${esc(site.email)}</b>, location Fullerton, CA (hide street address), hours ${esc(hours)}. Upload the logo.</li>
    <li><b>Site Design → Colors:</b>
      <span class="sw" style="background:#000"></span>Black #000000 (header/footer) ·
      <span class="sw" style="background:#f26a1b"></span>Orange #F26A1B (buttons, accents) ·
      <span class="sw" style="background:#1b1d20"></span>Steel #1B1D20 (dark sections) ·
      <span class="sw" style="background:#f5f3f0"></span>Off-white #F5F3F0 (light sections) ·
      <span class="sw" style="background:#1a1b1d"></span>Text #1A1B1D.
      Orange buttons should use <b>black text</b> (white on orange is hard to read).</li>
    <li><b>Fonts:</b> headings <b>Barlow Condensed</b> (bold, all caps); body <b>Barlow</b>. If Wix doesn’t list them, use <i>Site Design → Text → Upload font</i> (free from Google Fonts), or pick Oswald + Open Sans.</li>
  </ul>
  <h3>2. Header, footer & mobile</h3>
  <ul>
    <li><b>Header:</b> logo · menu (Residential, Commercial, Services, Service Areas, Projects, About) · phone as a clickable link (<code>tel:${esc(site.phoneE164)}</code>) · orange <b>Free Estimate</b> button. Set it to stay pinned when scrolling.</li>
    <li><b>Footer:</b> logo, phone, email, “Fullerton, CA · Serving all of Orange County”, hours, links to all services and city pages, Privacy Policy, and this line (required while unlicensed): <i>“${esc(site.name)} is not licensed by the California Contractors State License Board.”</i></li>
    <li><b>Mobile:</b> Mobile editor → <b>Quick Action Bar</b> → add <b>Call</b> (${esc(site.phone)}) and a link to the Free Estimate page. Check every page in mobile view.</li>
  </ul>
  <h3>3. Forms (Wix Forms)</h3>
  <p><b>Free Estimate form</b> (multi-step form if your Wix plan offers it, otherwise one long form):</p>
  <table>
    <tr><th>Field</th><th>Type</th><th>Options</th></tr>
    <tr><td>I am a…</td><td>Single choice, required</td><td>${customerTypes.map(esc).join(' · ')}</td></tr>
    <tr><td>Service needed</td><td>Dropdown, required</td><td>${svcNames.map(esc).join(' · ')} · Not sure / multiple services</td></tr>
    <tr><td>Project city</td><td>Dropdown, required</td><td>${cities.map(esc).join(' · ')} · Other city</td></tr>
    <tr><td>Project address</td><td>Short text, required</td><td></td></tr>
    <tr><td>Timeline</td><td>Single choice, required</td><td>${timelines.map(esc).join(' · ')}</td></tr>
    <tr><td>Approximate size</td><td>Short text</td><td>e.g. 20 ft × 30 ft, 600 sq ft</td></tr>
    <tr><td>Concrete thickness</td><td>Dropdown</td><td>Not sure · 4 in. or less · 5–6 in. · More than 6 in. · Not applicable</td></tr>
    <tr><td>Materials</td><td>Multiple choice</td><td>Concrete · Asphalt · Block / brick masonry · Rebar or wire mesh · Wood framing · Stucco / drywall · Pavers or tile · Dirt / soil · Not sure</td></tr>
    <tr><td>Access for equipment</td><td>Dropdown</td><td>Not sure · Open — driveway or street access · Side yard 4 ft or wider · Narrow side yard (under 4 ft) or steps · Hillside / sloped lot · Commercial site with truck access · Interior / upper floor</td></tr>
    <tr><td>Project details</td><td>Long text</td><td></td></tr>
    <tr><td>Photos</td><td>File upload (images, up to 5)</td><td></td></tr>
    <tr><td>Name, Phone, Email</td><td>required</td><td></td></tr>
    <tr><td>Preferred contact</td><td>Single choice</td><td>Phone call · Text message · Email</td></tr>
    <tr><td>How did you hear about us?</td><td>Dropdown</td><td>Google search · Google Maps · Referral · Yelp · Nextdoor · Saw our truck or job sign · Social media · Other</td></tr>
  </table>
  <p><b>Commercial Bid form:</b> Company, Contact name, Title, Company type, Email, Phone, Project name, City, Site address, Bid due date, Anticipated start, Approximate size/scope, Prevailing wage (Not sure/No/Yes), Scope includes (multiple choice), Subcontract & prequalification requirements, Scope notes, Link to plans, File upload (PDF/images).</p>
  <p><b>Quick form</b> (homepage/service pages): Name, Phone, Service, City.</p>
  <ul>
    <li>Under the submit button add: “Your information is used only to respond to your request — never sold. See our Privacy Policy.”</li>
    <li>After submit → <b>go to the Thank You page</b> (create it from the content tab; hide it from menus and search engines).</li>
    <li>Turn on Wix’s spam protection (reCAPTCHA) on each form.</li>
    <li><b>Automations:</b> “Form submitted” → send yourself an email notification; “Form submitted” → send the customer a confirmation email (“Thanks — we received your request and will contact you within one business day. Questions: ${esc(site.phone)}”). For a CRM or Google Sheet, connect Wix Forms through Zapier.</li>
  </ul>
  <h3>4. Pages</h3>
  <p>Create each page listed in the <b>Wix page content</b> tab. For each: set the page URL, then paste the content top to bottom. Every page should have the Free Estimate button and click-to-call near the top, and a call-to-action strip at the bottom. Use your real photos — never stock.</p>
  <p><b>Projects:</b> use the <b>Wix CMS</b> (Content Manager) to create a “Projects” collection with fields: Title, City, Service, Date, Scope, Equipment, Challenge, Solution, Result, Before photo, During photo, After photo, Testimonial. Then add a dynamic list page (<code>/projects</code>) and a dynamic item page (<code>/projects/{slug}</code>). A before/after slider app from the Wix App Market can show the photo pairs.</p>
  <h3>5. SEO (per page)</h3>
  <ol>
    <li>Page settings → <b>SEO basics</b>: paste the <b>URL slug</b>, <b>Title tag</b> and <b>Meta description</b> from the content tab.</li>
    <li>Page settings → <b>Advanced SEO → Structured data markup → Add new markup</b>: paste each structured-data block from the content tab (use the copy button).</li>
    <li>Make sure only one H1 per page (the first heading in each page’s content), and set the rest as H2/H3 as labelled.</li>
    <li><b>Marketing & SEO → SEO Setup Checklist</b>: connect Google Search Console; Wix creates the sitemap automatically.</li>
    <li><b>Settings → Marketing Integrations</b>: connect Google Analytics (GA4) and, if you advertise, Google Ads.</li>
    <li>If the Netlify version was ever live on dramdemo.com, add these in <b>SEO → URL Redirect Manager</b> so old links keep working:
      <table><tr><th>Old URL</th><th>New Wix URL</th></tr>${redirects}</table></li>
  </ol>
  <h3>6. Before publishing</h3>
  <ul><li>Test every form on your phone and confirm both emails arrive.</li><li>Tap the phone number on mobile — it should dial.</li><li>Check every page in mobile view.</li><li>Read every service page and remove anything you don’t actually do.</li></ul>
</section>

<section class="tab" id="t-pages">
  <h2>Copy-ready content for every Wix page</h2>
  <p>Labels show heading levels (H1/H2/H3). Orange notes show where buttons and cards go and what they link to. Sections for photos are left out — place your own photos where they fit.</p>
  <div class="layout">
    <nav class="toc">${groups.map((g) => `<b>${esc(g)}</b>${pages.filter((x) => x.group === g).map((x) => `<a href="#${id(x.p)}">${esc(x.h1.length > 42 ? x.h1.slice(0, 40) + '…' : x.h1)}</a>`).join('')}`).join('')}</nav>
    <div>
${pages.map((x) => `
      <article class="page" id="${id(x.p)}">
        <header><h2>${esc(x.h1)}</h2><p style="color:#bbb">Wix URL: <code>${esc(x.wix)}</code>${x.noindex ? ' · <b style="color:#f26a1b">Hide from search engines & menus</b>' : ''}</p></header>
        <div class="seo">
          <div><span class="k">URL slug</span><span>${esc(x.wix)}</span><button class="cp" data-copy="${esc(x.wix.replace(/^\//, ''))}">Copy</button></div>
          <div><span class="k">Title tag</span><span>${esc(x.title)}</span><button class="cp" data-copy="${esc(x.title)}">Copy</button></div>
          <div><span class="k">Meta description</span><span>${esc(x.desc)}</span><button class="cp" data-copy="${esc(x.desc)}">Copy</button></div>
        </div>
        <div class="content">${x.body}</div>
        ${x.ld.length && !x.noindex ? `<details class="ld"><summary><b>Structured data</b> (${x.ld.length} block${x.ld.length > 1 ? 's' : ''}) — paste each into Advanced SEO → Structured data markup</summary>${x.ld.map((s) => `<p><b>${esc(s['@type'])}</b> <button class="cp" data-copy="${esc(JSON.stringify(s, null, 2))}">Copy</button></p><pre>${esc(JSON.stringify(s, null, 2))}</pre>`).join('')}</details>` : ''}
      </article>`).join('')}
    </div>
  </div>
</section>
</main>
<script>
document.querySelectorAll('[data-tab]').forEach(function(b){b.addEventListener('click',function(){
  document.querySelectorAll('[data-tab]').forEach(function(x){x.setAttribute('aria-selected',x===b)});
  document.querySelectorAll('.tab').forEach(function(t){t.classList.toggle('on',t.id===b.dataset.tab)});
  window.scrollTo(0,0);
})});
document.addEventListener('click',function(e){var b=e.target.closest('button.cp');if(!b)return;
  var t=b.getAttribute('data-copy');var done=function(){b.textContent='Copied';b.classList.add('done');setTimeout(function(){b.textContent='Copy';b.classList.remove('done')},1500)};
  if(navigator.clipboard){navigator.clipboard.writeText(t).then(done,function(){fallback()})}else fallback();
  function fallback(){var ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');done()}catch(_){}ta.remove()}
});
</script>
</body></html>`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`✔ Launch guide → ${path.relative(process.cwd(), OUT)} (${pages.length} pages, ${(html.length / 1024).toFixed(0)} KB)`);
