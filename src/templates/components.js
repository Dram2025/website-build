import { esc, icon, telHref } from '../lib/util.js';
import { breadcrumbs } from './layout.js';

// ── Photos ──────────────────────────────────────────────────────────────────
// Renders a real photo when src/assets/photos/<name>.* exists; otherwise a
// branded placeholder (labelled with the file name in preview builds).
export function photo(ctx, name, alt, { cls = '', eager = false, sizes = '(min-width: 900px) 50vw, 100vw', ratio = '4/3' } = {}) {
  const p = ctx.photos[name];
  if (p) {
    return `<img class="photo ${cls}" src="${p.src}" width="${p.w}" height="${p.h}" alt="${esc(alt)}" sizes="${sizes}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" style="aspect-ratio:${ratio}">`;
  }
  ctx.missingPhotos.add(name);
  return `<div class="photo photo--ph ${cls}" role="img" aria-label="${esc(alt)}" style="aspect-ratio:${ratio}">${
    ctx.PROD ? '' : `<span>${icon('camera')}<b>Add photo</b><code>${esc(name)}.jpg</code><em>${esc(alt)}</em></span>`
  }</div>`;
}

export function beforeAfter(ctx, base, label) {
  const b = ctx.photos[`${base}-before`];
  const a = ctx.photos[`${base}-after`];
  if (b && a) {
    return `<figure class="ba" data-ba>
  <div class="ba__stage" style="aspect-ratio:${a.w}/${a.h}">
    <img src="${a.src}" width="${a.w}" height="${a.h}" alt="After: ${esc(label)}" loading="lazy" decoding="async">
    <div class="ba__before" data-ba-before><img src="${b.src}" width="${b.w}" height="${b.h}" alt="Before: ${esc(label)}" loading="lazy" decoding="async"></div>
    <span class="ba__tag ba__tag--b">Before</span><span class="ba__tag ba__tag--a">After</span>
    <span class="ba__handle" data-ba-handle aria-hidden="true"></span>
  </div>
  <label class="sr" for="ba-${esc(base)}">Drag to compare before and after</label>
  <input class="ba__range" id="ba-${esc(base)}" type="range" min="0" max="100" value="50" data-ba-range>
</figure>`;
  }
  return `<div class="ba-pair">
  <figure>${photo(ctx, `${base}-before`, `Before: ${label}`)}<figcaption><span class="tag tag--dark">Before</span></figcaption></figure>
  <figure>${photo(ctx, `${base}-after`, `After: ${label}`)}<figcaption><span class="tag">After</span></figcaption></figure>
</div>`;
}

// ── Page hero ───────────────────────────────────────────────────────────────
export function pageHero(ctx, { crumbs, eyebrow, h1, lede, photoName, aside, ctas = true, compact = false }) {
  const { site } = ctx;
  const bg = photoName && ctx.photos[photoName];
  return `<section class="phero${bg ? ' phero--photo' : ''}${compact ? ' phero--compact' : ''}">
  ${bg ? `<img class="phero__bg" src="${bg.src}" alt="" width="${bg.w}" height="${bg.h}" fetchpriority="high">` : ''}
  <div class="wrap phero__in${aside ? ' phero__in--aside' : ''}">
    <div class="phero__copy">
      ${crumbs ? breadcrumbs(crumbs) : ''}
      ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
      <h1>${esc(h1)}</h1>
      ${lede ? `<p class="lede">${esc(lede)}</p>` : ''}
      ${ctas ? `<div class="btnrow">
        <a class="btn btn--primary btn--lg" href="/estimate/">Get a Free Estimate ${icon('arrow')}</a>
        <a class="btn btn--outline btn--lg" href="${telHref(site)}" data-call>${icon('phone')} ${esc(site.phone)}</a>
      </div>` : ''}
      ${ctas ? trustTicks(ctx) : ''}
    </div>
    ${aside ? `<div class="phero__aside">${aside}</div>` : ''}
  </div>
</section>`;
}

export function trustTicks(ctx) {
  const { site } = ctx;
  const first = site.license.number && site.insurance ? 'Licensed &amp; insured' : site.license.number ? 'CSLB licensed' : 'Locally owned in Fullerton';
  return `<ul class="ticks">
  <li>${icon('check')} ${first}</li>
  <li>${icon('check')} Free written estimates</li>
  <li>${icon('check')} Haul-off included</li>
</ul>`;
}

export function trustBar(ctx) {
  const { site } = ctx;
  // Credential badges appear only once the matching site.js value is filled in.
  const items = [
    site.license.number ? ['badge', 'CSLB Licensed', `Lic. #${site.license.number}`] : ['pin', 'Locally Owned', `Based in ${site.address.city}, CA`],
    site.insurance ? ['shield', site.bonded ? 'Insured & Bonded' : 'Fully Insured', site.insurance] : null,
    site.yearsExperience ? ['hardhat', `${site.yearsExperience} Years`, 'Demolition experience'] : ['calendar', `Since ${site.foundingYear}`, 'Serving Orange County'],
    ['clipboard', 'Written Estimates', 'Free, itemized, on site'],
    site.insurance ? null : ['truck', 'Haul-Off Included', 'Loaded, hauled, swept'],
    ['recycle', 'Debris Recycled', 'Concrete, asphalt & metal'],
  ].filter(Boolean);
  return `<section class="trust" aria-label="Why customers trust D.RAM">
  <div class="wrap trust__in">
    ${items.map(([ic, t, s]) => `<div class="trust__item">${icon(ic, 'i i--lg')}<div><strong>${esc(t)}</strong><span>${esc(s)}</span></div></div>`).join('')}
  </div>
</section>`;
}

export function ctaBand(ctx, { title = 'Ready to clear the way?', text = 'Tell us about your project and get a free, written estimate — usually within one business day.' } = {}) {
  const { site } = ctx;
  return `<section class="ctaband">
  <div class="wrap ctaband__in">
    <div>
      <h2>${esc(title)}</h2>
      <p>${esc(text)}</p>
    </div>
    <div class="btnrow">
      <a class="btn btn--dark btn--lg" href="/estimate/">Get a Free Estimate ${icon('arrow')}</a>
      <a class="btn btn--dark-outline btn--lg" href="${telHref(site)}" data-call>${icon('phone')} Call ${esc(site.phone)}</a>
    </div>
  </div>
</section>`;
}

export function faqList(faqs) {
  return `<div class="faq">${faqs
    .map(([q, a]) => `<details><summary><h3>${esc(q)}</h3><span class="faq__x" aria-hidden="true"></span></summary><div><p>${esc(a)}</p></div></details>`)
    .join('')}</div>`;
}

export function steps(list) {
  return `<ol class="steps">${list
    .map(([t, d], i) => `<li><span class="steps__n">${String(i + 1).padStart(2, '0')}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`)
    .join('')}</ol>`;
}

export function checklist(items, cls = '') {
  return `<ul class="checks ${cls}">${items.map((i) => `<li>${icon('check')}<span>${esc(i)}</span></li>`).join('')}</ul>`;
}

export function serviceCard(s) {
  return `<a class="scard" href="/services/${s.slug}/">
  <span class="scard__ic">${icon(s.icon, 'i i--lg')}</span>
  <h3>${esc(s.name)}</h3>
  <p>${esc(s.card)}</p>
  <span class="scard__more">Learn more ${icon('arrow', 'i i--sm')}</span>
</a>`;
}

export function projectCard(ctx, p) {
  const loc = ctx.locBySlug[p.city];
  const svc = ctx.bySlug[p.service];
  return `<a class="pcard" href="/projects/${p.slug}/">
  ${photo(ctx, `${p.slug}-after`, `${p.title} in ${loc.name}, CA — completed`, { sizes: '(min-width: 900px) 33vw, 100vw' })}
  <div class="pcard__body">
    ${p.sample && !ctx.PROD ? '<span class="tag tag--warn">Sample layout</span>' : ''}
    <p class="pcard__meta">${esc(svc.name)} · ${esc(loc.name)}</p>
    <h3>${esc(p.title)}</h3>
    <p>${esc(p.summary)}</p>
  </div>
</a>`;
}

export function reviewsBlock(ctx, { limit = 6 } = {}) {
  const { reviews, site } = ctx;
  if (!reviews.length) return '';
  const avg = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);
  const stars = (n) => `<span class="stars" aria-label="${n} out of 5 stars">${Array.from({ length: 5 }, (_, i) => icon('star', i < n ? 'i i--star' : 'i i--star off')).join('')}</span>`;
  return `<section class="sec sec--light">
  <div class="wrap">
    <div class="sec__head">
      <p class="eyebrow">Reviews</p>
      <h2>What our customers say</h2>
      <p>${stars(Math.round(avg))} <strong>${avg}</strong> average from ${reviews.length} review${reviews.length > 1 ? 's' : ''}${site.social.googleBusiness ? ` · <a href="${esc(site.social.googleBusiness)}" target="_blank" rel="noopener">See all on Google</a>` : ''}</p>
    </div>
    <div class="reviews">
      ${reviews.slice(0, limit).map((r) => `<blockquote class="review">${stars(r.rating)}<p>“${esc(r.text)}”</p><footer><strong>${esc(r.name)}</strong> · ${esc(r.city)}${r.service ? ` · ${esc(r.service)}` : ''} <span class="review__src">via ${esc(r.source)}</span></footer></blockquote>`).join('')}
    </div>
  </div>
</section>`;
}

export function citiesBlock(ctx, { title = 'Proudly serving Orange County', intro } = {}) {
  const { locations, otherCities, regionalMarkets } = ctx;
  return `<section class="sec sec--dark" id="service-area">
  <div class="wrap areas">
    <div class="areas__copy">
      <p class="eyebrow">Service area</p>
      <h2>${esc(title)}</h2>
      <p>${esc(intro || 'Our crews work throughout Orange County every week, with priority scheduling in north and central OC. We also take on projects in neighboring Los Angeles, Riverside and San Bernardino County cities by arrangement.')}</p>
      <div class="btnrow"><a class="btn btn--primary" href="/service-areas/">View all service areas ${icon('arrow')}</a></div>
    </div>
    <div class="areas__lists">
      <ul class="cityp">${locations.map((l) => `<li><a href="/service-areas/${l.slug}/">${icon('pin', 'i i--sm')} ${esc(l.name)}</a></li>`).join('')}</ul>
      <p class="areas__also"><strong>Also serving:</strong> ${otherCities.map(esc).join(' · ')}</p>
      <p class="areas__also"><strong>By arrangement:</strong> ${regionalMarkets.map(esc).join(' · ')}</p>
    </div>
  </div>
</section>`;
}

// ── Forms ───────────────────────────────────────────────────────────────────
const attribution = () =>
  ['page_url', 'landing_page', 'referrer', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'gclid']
    .map((n) => `<input type="hidden" name="${n}" data-attr="${n}">`).join('');

const honeypot = () =>
  `<p class="hp" aria-hidden="true"><label>Leave this field empty <input name="company_website" tabindex="-1" autocomplete="off"></label></p>`;

const consent = (ctx) =>
  `<p class="form__fine">${icon('lock', 'i i--sm')} Your information is used only to respond to your request — never sold. See our <a href="/privacy/">Privacy Policy</a>.</p>`;

export const timelines = ['As soon as possible', 'Within 2 weeks', 'Within 1 month', '1–3 months', 'Just planning / budgeting'];
export const customerTypes = ['Homeowner', 'General contractor', 'Property manager / HOA', 'Commercial property owner / business', 'Other'];

function serviceOptions(ctx, selected) {
  return `<option value="">Select a service…</option>${ctx.services
    .map((s) => `<option${s.slug === selected ? ' selected' : ''} value="${esc(s.name)}">${esc(s.name)}</option>`).join('')}<option value="Not sure / multiple services">Not sure / multiple services</option>`;
}

function cityOptions(ctx, selected) {
  const all = [...ctx.locations.map((l) => l.name), ...ctx.otherCities].sort();
  return `<option value="">Select a city…</option>${all
    .map((c) => `<option${c === selected ? ' selected' : ''}>${esc(c)}</option>`).join('')}<option>Other city</option>`;
}

export function quickForm(ctx, { title = 'Get a free estimate', sub = 'Takes 30 seconds. We respond within one business day.', service, city, dark = false } = {}) {
  return `<form class="qform${dark ? ' qform--dark' : ''}" name="quick-estimate" method="POST" action="/thank-you/?form=quick-estimate" data-netlify="true" netlify-honeypot="company_website" data-lead-form>
  <input type="hidden" name="form-name" value="quick-estimate">
  ${attribution()}${honeypot()}
  <h2 class="qform__t">${esc(title)}</h2>
  <p class="qform__s">${esc(sub)}</p>
  <div class="field"><label for="qf-name-${service || city || 'x'}">Name</label><input id="qf-name-${service || city || 'x'}" name="name" autocomplete="name" required></div>
  <div class="field"><label for="qf-phone-${service || city || 'x'}">Phone</label><input id="qf-phone-${service || city || 'x'}" name="phone" type="tel" autocomplete="tel" inputmode="tel" required></div>
  <div class="field"><label for="qf-svc-${service || city || 'x'}">Service needed</label><select id="qf-svc-${service || city || 'x'}" name="service" required>${serviceOptions(ctx, service)}</select></div>
  <div class="field"><label for="qf-city-${service || city || 'x'}">Project city</label><select id="qf-city-${service || city || 'x'}" name="city" required>${cityOptions(ctx, city)}</select></div>
  <button class="btn btn--primary btn--block btn--lg" type="submit">Request My Free Estimate</button>
  <p class="form__status" role="status" aria-live="polite"></p>
  ${consent(ctx)}
  <p class="qform__more">Have photos or plans? <a href="/estimate/">Use the detailed form</a></p>
</form>`;
}

export function estimateForm(ctx) {
  const radios = (name, opts, req = true) =>
    opts.map((o, i) => `<label class="opt"><input type="radio" name="${name}" value="${esc(o)}"${req && i === 0 ? ' required' : ''}><span>${esc(o)}</span></label>`).join('');
  const checks = (name, opts) => opts.map((o) => `<label class="opt"><input type="checkbox" name="${name}" value="${esc(o)}"><span>${esc(o)}</span></label>`).join('');
  return `<form class="lform" id="estimate-form" name="estimate" method="POST" action="/thank-you/?form=estimate" enctype="multipart/form-data" data-netlify="true" netlify-honeypot="company_website" data-lead-form data-steps novalidate>
  <input type="hidden" name="form-name" value="estimate">
  ${attribution()}${honeypot()}
  <ol class="lform__progress" aria-hidden="true"><li class="is-on">Project</li><li>Details &amp; photos</li><li>Contact</li></ol>

  <fieldset class="lform__step" data-step="1">
    <legend>1. About your project</legend>
    <div class="field"><span class="label" id="ct-l">I am a…</span><div class="opts" role="radiogroup" aria-labelledby="ct-l">${radios('customer_type', customerTypes)}</div></div>
    <div class="grid2">
      <div class="field"><label for="ef-service">Service needed</label><select id="ef-service" name="service" required>${serviceOptions(ctx)}</select></div>
      <div class="field"><label for="ef-city">Project city</label><select id="ef-city" name="city" required>${cityOptions(ctx)}</select></div>
    </div>
    <div class="field"><label for="ef-address">Project address <small>(street address or nearest cross streets)</small></label><input id="ef-address" name="project_address" autocomplete="street-address" required></div>
    <div class="field"><span class="label" id="tl-l">Timeline</span><div class="opts" role="radiogroup" aria-labelledby="tl-l">${radios('timeline', timelines)}</div></div>
    <div class="lform__nav"><span></span><button class="btn btn--primary btn--lg" type="button" data-next>Next: details ${icon('arrow')}</button></div>
  </fieldset>

  <fieldset class="lform__step" data-step="2">
    <legend>2. Size, materials &amp; photos</legend>
    <div class="grid2">
      <div class="field"><label for="ef-dims">Approximate size <small>(e.g. 20 ft × 30 ft, 600 sq ft, 80 linear ft)</small></label><input id="ef-dims" name="dimensions"></div>
      <div class="field"><label for="ef-thick">Concrete thickness (if known)</label><select id="ef-thick" name="thickness"><option>Not sure</option><option>4 in. or less</option><option>5–6 in.</option><option>More than 6 in.</option><option>Not applicable</option></select></div>
    </div>
    <div class="field"><span class="label" id="mt-l">Materials involved <small>(check all that apply)</small></span><div class="opts opts--wrap" role="group" aria-labelledby="mt-l">${checks('materials', ['Concrete', 'Asphalt', 'Block / brick masonry', 'Rebar or wire mesh', 'Wood framing', 'Stucco / drywall', 'Pavers or tile', 'Dirt / soil', 'Not sure'])}</div></div>
    <div class="field"><label for="ef-access">Access for equipment</label><select id="ef-access" name="access"><option>Not sure</option><option>Open — driveway or street access</option><option>Side yard 4 ft or wider</option><option>Narrow side yard (under 4 ft) or steps</option><option>Hillside / sloped lot</option><option>Commercial site with truck access</option><option>Interior / upper floor</option></select></div>
    <div class="field"><label for="ef-details">Project details</label><textarea id="ef-details" name="details" rows="4" placeholder="What needs to come out, what needs to stay, anything we should know about access, neighbors or deadlines."></textarea></div>
    <div class="field">
      <span class="label">Photos <small>(up to 5 — strongly recommended; most jobs can be priced from good photos)</small></span>
      <label class="drop" for="ef-photos" data-drop>
        ${icon('upload', 'i i--lg')}
        <span><strong>Tap to add photos</strong> or drag them here</span>
        <small>JPG, PNG or HEIC · large photos are resized automatically</small>
        <input id="ef-photos" name="photo_1" type="file" accept="image/*" multiple data-photos>
      </label>
      <ul class="thumbs" data-thumbs></ul>
      <div hidden><input type="file" name="photo_2"><input type="file" name="photo_3"><input type="file" name="photo_4"><input type="file" name="photo_5"></div>
    </div>
    <div class="lform__nav"><button class="btn btn--ghost-dark" type="button" data-prev>Back</button><button class="btn btn--primary btn--lg" type="button" data-next>Next: contact ${icon('arrow')}</button></div>
  </fieldset>

  <fieldset class="lform__step" data-step="3">
    <legend>3. How do we reach you?</legend>
    <div class="grid2">
      <div class="field"><label for="ef-name">Full name</label><input id="ef-name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="ef-company">Company <small>(optional)</small></label><input id="ef-company" name="company" autocomplete="organization"></div>
      <div class="field"><label for="ef-phone">Phone</label><input id="ef-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required></div>
      <div class="field"><label for="ef-email">Email</label><input id="ef-email" name="email" type="email" autocomplete="email" required></div>
    </div>
    <div class="field"><span class="label" id="pc-l">Preferred contact</span><div class="opts" role="radiogroup" aria-labelledby="pc-l">${radios('preferred_contact', ['Phone call', 'Text message', 'Email'])}</div></div>
    <div class="field"><label for="ef-src">How did you hear about us? <small>(optional)</small></label><select id="ef-src" name="heard_from"><option value="">Choose one…</option><option>Google search</option><option>Google Maps</option><option>Referral / word of mouth</option><option>Yelp</option><option>Nextdoor</option><option>Saw our truck or job sign</option><option>Social media</option><option>Other</option></select></div>
    <label class="consent"><input type="checkbox" name="sms_consent" value="yes"><span>Text me my estimate confirmation and appointment updates from D.RAM Demolition at the number above. Message frequency varies; msg &amp; data rates may apply. Reply STOP to opt out, HELP for help. Consent is not required to get an estimate. <a href="/privacy/#sms">SMS Terms</a></span></label>
    ${consent(ctx)}
    <div class="lform__nav"><button class="btn btn--ghost-dark" type="button" data-prev>Back</button><button class="btn btn--primary btn--lg" type="submit">Send My Estimate Request</button></div>
    <p class="form__status" role="status" aria-live="polite"></p>
  </fieldset>
</form>`;
}

export function bidForm(ctx) {
  const checks = (name, opts) => opts.map((o) => `<label class="opt"><input type="checkbox" name="${name}" value="${esc(o)}"><span>${esc(o)}</span></label>`).join('');
  return `<form class="lform" id="bid-form" name="commercial-bid" method="POST" action="/thank-you/?form=commercial-bid" enctype="multipart/form-data" data-netlify="true" netlify-honeypot="company_website" data-lead-form novalidate>
  <input type="hidden" name="form-name" value="commercial-bid">
  ${attribution()}${honeypot()}
  <fieldset>
    <legend>Your company</legend>
    <div class="grid2">
      <div class="field"><label for="bf-company">Company</label><input id="bf-company" name="company" autocomplete="organization" required></div>
      <div class="field"><label for="bf-name">Contact name</label><input id="bf-name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="bf-role">Title / role</label><input id="bf-role" name="role" placeholder="Estimator, PM, Superintendent…"></div>
      <div class="field"><label for="bf-type">Company type</label><select id="bf-type" name="customer_type" required><option value="">Select…</option><option>General contractor</option><option>Developer / owner</option><option>Property manager / HOA</option><option>Architect / engineer</option><option>Public agency</option><option>Other</option></select></div>
      <div class="field"><label for="bf-email">Email</label><input id="bf-email" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="bf-phone">Phone</label><input id="bf-phone" name="phone" type="tel" autocomplete="tel" required></div>
    </div>
  </fieldset>
  <fieldset>
    <legend>The project</legend>
    <div class="grid2">
      <div class="field"><label for="bf-pname">Project name</label><input id="bf-pname" name="project_name" required></div>
      <div class="field"><label for="bf-city">City</label><select id="bf-city" name="city" required>${cityOptions(ctx)}</select></div>
      <div class="field field--full"><label for="bf-addr">Site address</label><input id="bf-addr" name="project_address" required></div>
      <div class="field"><label for="bf-due">Bid due date</label><input id="bf-due" name="bid_due" type="date"></div>
      <div class="field"><label for="bf-start">Anticipated start</label><input id="bf-start" name="start_date" type="date"></div>
      <div class="field"><label for="bf-size">Approximate size / scope</label><input id="bf-size" name="dimensions" placeholder="e.g. 8,000 sq ft single-story retail, 30,000 sq ft parking lot"></div>
      <div class="field"><label for="bf-wage">Prevailing wage?</label><select id="bf-wage" name="prevailing_wage"><option>Not sure</option><option>No</option><option>Yes</option></select></div>
    </div>
    <div class="field"><span class="label" id="bs-l">Scope includes</span><div class="opts opts--wrap" role="group" aria-labelledby="bs-l">${checks('scope', ['Full building demolition', 'Interior / selective demolition', 'Slab & foundation removal', 'Site concrete & flatwork', 'Asphalt / parking lot removal', 'Walls & retaining walls', 'Hauling & export', 'Recycling documentation'])}</div></div>
    <div class="field"><label for="bf-ins">Subcontract &amp; prequalification requirements</label><textarea id="bf-ins" name="insurance_requirements" rows="2" placeholder="Insurance limits, prequalification platform, subcontract terms, etc."></textarea></div>
    <div class="field"><label for="bf-notes">Scope notes</label><textarea id="bf-notes" name="details" rows="4" placeholder="Phasing, working hours, abatement status, special conditions…"></textarea></div>
  </fieldset>
  <fieldset>
    <legend>Plans &amp; documents</legend>
    <div class="field"><label for="bf-link">Link to plans <small>(Dropbox, Google Drive, Box, Procore, BuildingConnected…)</small></label><input id="bf-link" name="plans_link" type="url" placeholder="https://"></div>
    <div class="field">
      <span class="label">Or upload files <small>(PDF, images, ZIP · up to 8 MB total — use a link for larger plan sets)</small></span>
      <label class="drop" for="bf-files" data-drop>
        ${icon('file', 'i i--lg')}
        <span><strong>Choose plans, drawings or scope documents</strong></span>
        <small>Files are transmitted over an encrypted connection and are accessible only to D.RAM staff.</small>
        <input id="bf-files" name="plans_1" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.heic,.zip,.doc,.docx,.xls,.xlsx,.dwg" data-docs>
      </label>
      <ul class="thumbs" data-thumbs></ul>
      <div hidden><input type="file" name="plans_2"><input type="file" name="plans_3"><input type="file" name="plans_4"></div>
    </div>
    ${consent(ctx)}
    <button class="btn btn--primary btn--lg" type="submit">Submit Bid Request ${icon('arrow')}</button>
    <p class="form__status" role="status" aria-live="polite"></p>
  </fieldset>
</form>`;
}

export function contactForm(ctx) {
  return `<form class="lform lform--compact" name="contact" method="POST" action="/thank-you/?form=contact" data-netlify="true" netlify-honeypot="company_website" data-lead-form>
  <input type="hidden" name="form-name" value="contact">
  ${attribution()}${honeypot()}
  <div class="grid2">
    <div class="field"><label for="cf-name">Name</label><input id="cf-name" name="name" autocomplete="name" required></div>
    <div class="field"><label for="cf-phone">Phone</label><input id="cf-phone" name="phone" type="tel" autocomplete="tel" required></div>
    <div class="field field--full"><label for="cf-email">Email</label><input id="cf-email" name="email" type="email" autocomplete="email"></div>
  </div>
  <div class="field"><label for="cf-msg">How can we help?</label><textarea id="cf-msg" name="details" rows="4" required></textarea></div>
  ${consent(ctx)}
  <button class="btn btn--primary btn--lg" type="submit">Send Message</button>
  <p class="form__status" role="status" aria-live="polite"></p>
</form>`;
}
