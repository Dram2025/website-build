import { esc, icon, telHref, smsHref } from '../lib/util.js';

// ── Photos ──────────────────────────────────────────────────────────────────
// A named slot. Real file → <img>. Missing → labelled slot in preview builds,
// a branded illustrated tile in production (so the site never looks broken).
export function photo(ctx, slot, alt, { cls = '', eager = false, art = 'truck', sizes = '(min-width: 900px) 50vw, 100vw' } = {}) {
  const p = ctx.photos[slot];
  if (p) {
    return `<figure class="ph ${cls}"><img src="${p.src}" alt="${esc(alt)}" width="${p.w}" height="${p.h}" sizes="${sizes}"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}></figure>`;
  }
  ctx.missingPhotos.add(slot);
  return `<figure class="ph ph--art ${cls}" aria-hidden="true"><span class="ph__icon">${icon(art)}</span>${ctx.PROD ? '' : `<span class="ph__slot">Photo slot: <code>${esc(slot)}</code></span>`}</figure>`;
}

export const hasPhoto = (ctx, slot) => Boolean(ctx.photos[slot]);

// ── Buttons ─────────────────────────────────────────────────────────────────
export const ctaRow = (site, { light = false } = {}) => `
<div class="ctas">
  <a class="btn btn--gold btn--lg" href="/quote/">Get my free quote ${icon('arrow')}</a>
  <a class="btn ${light ? 'btn--line' : 'btn--ghost'} btn--lg" href="${smsHref(site, 'Hi! I’d like a quote. Here’s a photo:')}" data-sms>${icon('camera')} Text a photo</a>
</div>`;

export const ratingBadge = (site, { dark = false } = {}) => {
  const inner = `<span class="stars">${icon('star', 'i i--fill')}${icon('star', 'i i--fill')}${icon('star', 'i i--fill')}${icon('star', 'i i--fill')}${icon('star', 'i i--fill')}</span><span><strong>${esc(site.google.rating)}</strong> on Google · ${site.google.reviewCount} reviews</span>`;
  return site.google.profileUrl
    ? `<a class="rating${dark ? ' rating--dark' : ''}" href="${esc(site.google.profileUrl)}" rel="noopener" target="_blank">${inner}</a>`
    : `<p class="rating${dark ? ' rating--dark' : ''}">${inner}</p>`;
};

// ── Forms ───────────────────────────────────────────────────────────────────
const hidden = (name) => `
<input type="hidden" name="form-name" value="${name}">
<p class="hp" aria-hidden="true"><label>Leave blank <input name="company_website" tabindex="-1" autocomplete="off"></label></p>
<input type="hidden" name="page_url" data-attr="page_url">
<input type="hidden" name="landing_page" data-attr="landing_page">
<input type="hidden" name="referrer" data-attr="referrer">
<input type="hidden" name="utm_source" data-attr="utm_source">
<input type="hidden" name="utm_medium" data-attr="utm_medium">
<input type="hidden" name="utm_campaign" data-attr="utm_campaign">
<input type="hidden" name="gclid" data-attr="gclid">`;

export function serviceSelect(ctx, { id, selected = '', required = true }) {
  const { groups, services } = ctx;
  return `<select id="${id}" name="service"${required ? ' required' : ''}>
    <option value="">Choose a service…</option>
    ${groups.map((g) => `<optgroup label="${esc(g.name)}">${services.filter((s) => s.group === g.key)
      .map((s) => `<option${s.name === selected ? ' selected' : ''}>${esc(s.name)}</option>`).join('')}</optgroup>`).join('')}
    <option${selected === 'Something else' ? ' selected' : ''}>Something else</option>
  </select>`;
}

let qfCount = 0;
export function quickForm(ctx, { heading = 'Get a free quote', sub = 'We usually reply within the hour during business hours.', service = '' } = {}) {
  const n = ++qfCount;
  const id = (f) => `qf${n}-${f}`;
  return `
<form class="qform" name="quick-quote" method="POST" action="/thank-you/" data-netlify="true" netlify-honeypot="company_website" data-lead-form>
  ${hidden('quick-quote')}
  <p class="qform__h">${esc(heading)}</p>
  <p class="qform__sub">${esc(sub)}</p>
  <div class="field"><label for="${id('name')}">Your name</label><input id="${id('name')}" name="name" autocomplete="name" required></div>
  <div class="field"><label for="${id('phone')}">Phone</label><input id="${id('phone')}" name="phone" type="tel" autocomplete="tel" inputmode="tel" required></div>
  <div class="field"><label for="${id('zip')}">ZIP code</label><input id="${id('zip')}" name="zip" autocomplete="postal-code" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" required></div>
  <div class="field"><label for="${id('service')}">What do you need?</label>${serviceSelect(ctx, { id: id('service'), selected: service })}</div>
  <div class="field"><label for="${id('details')}">What’s going? <span class="opt">(optional)</span></label><textarea id="${id('details')}" name="details" rows="2" placeholder="e.g. old couch, fridge and about 10 boxes in the garage"></textarea></div>
  <button class="btn btn--gold btn--block btn--lg" type="submit">Get my price ${icon('arrow')}</button>
  <p class="form__status" role="status" aria-live="polite"></p>
  <p class="qform__alt">Faster? <a href="${smsHref(ctx.site, 'Hi! I’d like a quote. Here’s a photo:')}" data-sms>Text a photo to ${esc(ctx.site.phone)}</a></p>
</form>`;
}

export function quoteForm(ctx, { service = '' } = {}) {
  const radio = (name, opts, req = true) => opts.map((o, i) => `<label class="chip"><input type="radio" name="${name}" value="${esc(o)}"${req && i === 0 ? ' required' : ''}><span>${esc(o)}</span></label>`).join('');
  const check = (name, opts) => opts.map((o) => `<label class="chip"><input type="checkbox" name="${name}" value="${esc(o)}"><span>${esc(o)}</span></label>`).join('');
  return `
<form class="lform" name="quote" method="POST" action="/thank-you/" enctype="multipart/form-data" data-netlify="true" netlify-honeypot="company_website" data-lead-form>
  ${hidden('quote')}
  <fieldset>
    <legend>1. What do you need?</legend>
    <div class="field"><label for="q-service">Service</label>${serviceSelect(ctx, { id: 'q-service', selected: service })}</div>
    <div class="field"><span class="label">About how much? <span class="opt">(best guess is fine)</span></span><div class="chips">${radio('amount', ['One or two items', 'A few items', 'Pickup-truck load', 'Half a trailer', 'Full trailer or more', 'Not sure'])}</div></div>
    <div class="field"><label for="q-details">Describe the job</label><textarea id="q-details" name="details" rows="4" required placeholder="What needs to go (or what material you need), where it is, and anything we should know."></textarea></div>
    <div class="field">
      <span class="label">Photos <span class="opt">(optional, but they get you an exact price)</span></span>
      <label class="drop" data-drop>${icon('camera')}<span><strong>Add up to 5 photos</strong> Tap to take or choose photos</span><input type="file" name="photo_1" accept="image/*" multiple data-photos></label>
      <div hidden><input type="file" name="photo_2"><input type="file" name="photo_3"><input type="file" name="photo_4"><input type="file" name="photo_5"></div>
      <ul class="thumbs" data-thumbs></ul>
    </div>
  </fieldset>
  <fieldset>
    <legend>2. Where and when?</legend>
    <div class="grid2">
      <div class="field"><label for="q-city">City</label><input id="q-city" name="city" autocomplete="address-level2" required></div>
      <div class="field"><label for="q-zip">ZIP code</label><input id="q-zip" name="zip" autocomplete="postal-code" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" required></div>
    </div>
    <div class="field"><span class="label">When do you need it done?</span><div class="chips">${radio('timing', ['As soon as possible', 'This week', 'Within 2 weeks', 'Flexible / just pricing'])}</div></div>
    <div class="field"><span class="label">Anything about access? <span class="opt">(optional)</span></span><div class="chips">${check('access', ['Stairs', 'Backyard / side yard', 'Apartment / condo', 'Gated community', 'Tight street parking'])}</div></div>
  </fieldset>
  <fieldset>
    <legend>3. How do we reach you?</legend>
    <div class="grid2">
      <div class="field"><label for="q-name">Name</label><input id="q-name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="q-phone">Phone</label><input id="q-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required></div>
    </div>
    <div class="field"><label for="q-email">Email <span class="opt">(optional)</span></label><input id="q-email" name="email" type="email" autocomplete="email"></div>
    <div class="field"><span class="label">Best way to reach you</span><div class="chips">${radio('contact_pref', ['Text', 'Call', 'Email'])}</div></div>
  </fieldset>
  <button class="btn btn--gold btn--lg" type="submit">Send my quote request ${icon('arrow')}</button>
  <p class="form__status" role="status" aria-live="polite"></p>
  <p class="fine">No spam, ever. We only use your info to reply to this request. <a href="/privacy/">Privacy policy</a>.</p>
</form>`;
}

export function contactForm() {
  return `
<form class="lform" name="contact" method="POST" action="/thank-you/" data-netlify="true" netlify-honeypot="company_website" data-lead-form>
  ${hidden('contact')}
  <div class="grid2">
    <div class="field"><label for="c-name">Name</label><input id="c-name" name="name" autocomplete="name" required></div>
    <div class="field"><label for="c-phone">Phone</label><input id="c-phone" name="phone" type="tel" autocomplete="tel" required></div>
  </div>
  <div class="field"><label for="c-email">Email <span class="opt">(optional)</span></label><input id="c-email" name="email" type="email" autocomplete="email"></div>
  <div class="field"><label for="c-msg">Message</label><textarea id="c-msg" name="message" rows="5" required></textarea></div>
  <button class="btn btn--gold btn--lg" type="submit">Send message ${icon('arrow')}</button>
  <p class="form__status" role="status" aria-live="polite"></p>
</form>`;
}

// ── Sections ────────────────────────────────────────────────────────────────
export const faqBlock = (faqs, heading = 'Frequently asked questions') => `
<section class="sec">
  <div class="wrap wrap--narrow">
    <h2 class="h2">${esc(heading)}</h2>
    <div class="faq">${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
  </div>
</section>`;

export const serviceCard = (s) => `
<a class="scard" href="/services/${s.slug}/">
  <span class="scard__icon">${icon(s.icon)}</span>
  <span class="scard__name">${esc(s.name)}</span>
  <span class="scard__txt">${esc(s.short)}</span>
  <span class="scard__more">Learn more ${icon('arrow', 'i i--sm')}</span>
</a>`;

export const steps = () => `
<ol class="steps">
  <li><span class="steps__n">1</span><h3>Show us the job</h3><p>Text a photo, fill out the quick form or call. A rough idea of what’s going is all we need.</p></li>
  <li><span class="steps__n">2</span><h3>Get an upfront price</h3><p>We send a clear price based on how much of the truck it fills. No hidden fees.</p></li>
  <li><span class="steps__n">3</span><h3>We lift, load &amp; sweep</h3><p>We show up on time, do all the heavy lifting, haul it away and leave the area swept clean.</p></li>
</ol>`;

// A trailer silhouette filled to the given fraction.
export function loadGraphic(fill) {
  const w = Math.round(150 * fill);
  return `<svg class="load" viewBox="0 0 200 92" aria-hidden="true" focusable="false">
  <rect x="20" y="14" width="160" height="52" rx="5" class="load__box"/>
  ${fill < 0.12 ? '<rect x="25" y="31" width="26" height="30" rx="3" class="load__fill"/>' : `<rect x="25" y="19" width="${w}" height="42" rx="3" class="load__fill"/>`}
  <path d="M8 66h184" class="load__line"/>
  <circle cx="72" cy="74" r="12" class="load__wheel"/><circle cx="104" cy="74" r="12" class="load__wheel"/>
  <path d="M180 56h14" class="load__line"/>
</svg>`;
}

export const loads = [
  { key: 'minimum', label: 'Single item', fill: 0.08, note: 'One couch, fridge or mattress' },
  { key: 'quarter', label: '¼ load', fill: 0.25, note: 'A few furniture pieces or a small pile' },
  { key: 'half', label: '½ load', fill: 0.5, note: 'A room’s worth or a light garage' },
  { key: 'threeQuarter', label: '¾ load', fill: 0.75, note: 'Most single-car garages' },
  { key: 'full', label: 'Full load', fill: 1, note: 'Packed two-car garage or small home clean-out' },
];

export const loadCards = (site) => `
<ul class="loads">${loads.map((l) => `<li>
  ${loadGraphic(l.fill)}
  <p class="loads__label">${esc(l.label)}</p>
  <p class="loads__price">${site.pricing[l.key] ? `from <strong>${esc(site.pricing[l.key])}</strong>` : 'Text a photo for a price'}</p>
  <p class="loads__note">${esc(l.note)}</p>
</li>`).join('')}</ul>`;

export const ctaBand = (ctx, { heading = 'Ready to get your space back?', sub = 'Send a photo and get an upfront price, usually within the hour.' } = {}) => `
<section class="band">
  <div class="wrap band__in">
    <div>
      <h2 class="band__h">${esc(heading)}</h2>
      <p>${esc(sub)}</p>
    </div>
    <div class="ctas">
      <a class="btn btn--gold btn--lg" href="/quote/">Get my free quote ${icon('arrow')}</a>
      <a class="btn btn--line btn--lg" href="${telHref(ctx.site)}" data-call>${icon('phone')} ${esc(ctx.site.phone)}</a>
    </div>
  </div>
</section>`;

export const reviewsBlock = (ctx) => {
  const { reviews, site } = ctx;
  if (!reviews.length) return '';
  return `
<section class="sec sec--soft">
  <div class="wrap">
    <div class="sec__head"><h2 class="h2">What customers say</h2>${ratingBadge(site)}</div>
    <div class="reviews">${reviews.map((r) => `<blockquote class="review">
      <p class="review__stars" aria-label="${r.rating} out of 5 stars">${icon('star', 'i i--fill').repeat(r.rating)}</p>
      <p>${esc(r.text)}</p>
      <footer>${esc(r.name)}${r.city ? ` · ${esc(r.city)}` : ''}${r.service ? ` · <span>${esc(r.service)}</span>` : ''}</footer>
    </blockquote>`).join('')}</div>
    ${site.google.reviewLink ? `<p class="center"><a class="btn btn--ghost" href="${esc(site.google.reviewLink)}" rel="noopener" target="_blank">Leave us a review</a></p>` : ''}
  </div>
</section>`;
};
