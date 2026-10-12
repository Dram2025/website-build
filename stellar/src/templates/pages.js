import { esc, icon, telHref, smsHref } from '../lib/util.js';
import { layout, breadcrumbs, faqSchema, abs, fmtTime } from './layout.js';
import {
  photo, hasPhoto, ctaRow, ratingBadge, quickForm, quoteForm, contactForm, faqBlock, serviceCard, steps,
  loadCards, ctaBand, reviewsBlock,
} from './components.js';

const HOME = { label: 'Home', href: '/' };

const homeFaqs = [
  ['How does pricing work?', 'Junk removal is priced by how much space your items take up in our trailer, from a single item to a full load. Heavy materials like concrete, dirt and roofing are priced by weight. Text a photo and we’ll send an upfront price.'],
  ['Do you do all the lifting?', 'Yes. You don’t need to move anything to the curb. We carry items out of garages, backyards, bedrooms and upstairs rooms, load them and sweep up.'],
  ['What areas do you serve?', 'We’re based in Fullerton and serve North Orange County: Anaheim, Placentia, Brea, Buena Park, La Habra, Yorba Linda, Orange and nearby cities. Not sure if we come to you? Just ask.'],
  ['What won’t you take?', 'Hazardous materials: paint, chemicals, solvents, fuel, oil, pesticides, propane tanks, asbestos and medical waste. Your county’s household hazardous waste center accepts those for free.'],
  ['Do you do demolition?', 'We do light demolition: sheds, fences, hot tubs, decks, playsets and interior tear-outs. Large concrete and structural demolition goes to our sister company, D.RAM Demolition & Hauling.'],
];

const takeList = [
  ['sofa', 'Furniture & mattresses'], ['fridge', 'Appliances'], ['garage', 'Garage clutter'], ['box', 'Boxes & household junk'],
  ['leaf', 'Yard waste'], ['hardhat', 'Remodel debris'], ['hottub', 'Hot tubs & spas'], ['shed', 'Sheds & playsets'],
  ['fence', 'Old fencing'], ['tearout', 'Cabinets & flooring'], ['building', 'Office & rental clean-outs'], ['truck', 'Exercise equipment'],
];

// ── Home ────────────────────────────────────────────────────────────────────
export function home(ctx) {
  const { site, services, groups, areas } = ctx;
  const heroPhoto = ctx.photos['home-hero'];
  const body = `
<section class="hero${heroPhoto ? ' hero--photo' : ''}">
  ${heroPhoto ? `<img class="hero__bg" src="${heroPhoto.src}" alt="" width="${heroPhoto.w}" height="${heroPhoto.h}" fetchpriority="high">` : ''}
  <div class="wrap hero__in">
    <div class="hero__copy">
      ${ratingBadge(site, { dark: true })}
      <h1 class="hero__h">Junk removal in Fullerton &amp; North Orange County</h1>
      <p class="hero__tag">Point at it. <span>We make it disappear.</span></p>
      <ul class="ticks">
        <li>${icon('check')} We do all the lifting, from any room</li>
        <li>${icon('check')} Upfront price before we start</li>
        <li>${icon('check')} Swept clean when we leave</li>
      </ul>
      ${ctaRow(site, { light: true })}
    </div>
    <div class="hero__form">${quickForm(ctx)}</div>
  </div>
</section>

<section class="strip" aria-label="Why customers choose us">
  <div class="wrap strip__in">
    <p>${icon('star')}<span><strong>${esc(site.google.rating)}-star</strong> Google rating</span></p>
    <p>${icon('pin')}<span><strong>Locally owned</strong> in ${esc(site.address.city)}</span></p>
    <p>${icon('tag')}<span><strong>Upfront</strong> pricing</span></p>
    <p>${icon('broom')}<span><strong>Swept clean</strong> every job</span></p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec__head">
      <p class="eyebrow">What we do</p>
      <h2 class="h2">Three ways we make your life easier</h2>
    </div>
    <div class="pillars">
      ${groups.map((g) => `
      <article class="pillar">
        <div class="pillar__top">
          <span class="pillar__icon">${icon(g.icon)}</span>
          <h3><a href="/services/${g.pillar}/">${esc(g.name)}</a></h3>
          <p>${esc(g.blurb)}</p>
        </div>
        <ul>${services.filter((s) => s.group === g.key && !s.pillar).map((s) => `<li><a href="/services/${s.slug}/">${icon('arrow', 'i i--sm')} ${esc(s.name)}</a></li>`).join('')}</ul>
        <a class="btn btn--ghost btn--block" href="/services/${g.pillar}/">Explore ${esc(g.name.toLowerCase())}</a>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="sec sec--navy">
  <div class="wrap">
    <div class="sec__head">
      <p class="eyebrow">If it’s junk, it’s gone</p>
      <h2 class="h2">What we haul away</h2>
      <p class="sec__sub">Nearly everything that isn’t hazardous, from a single recliner to a whole house.</p>
    </div>
    <ul class="take">${takeList.map(([i, t]) => `<li>${icon(i)}<span>${esc(t)}</span></li>`).join('')}</ul>
    <p class="take__no">${icon('shield', 'i i--sm')} We can’t take paint, chemicals, fuel, propane tanks, asbestos or medical waste.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec__head">
      <p class="eyebrow">How it works</p>
      <h2 class="h2">Gone in three easy steps</h2>
    </div>
    ${steps()}
    <div class="center">${ctaRow(site)}</div>
  </div>
</section>

<section class="sec sec--soft">
  <div class="wrap">
    <div class="sec__head">
      <p class="eyebrow">Simple pricing</p>
      <h2 class="h2">You pay for the space you use</h2>
      <p class="sec__sub">Junk removal is priced by how much of our trailer your items fill. Labor, loading, hauling and disposal are included.</p>
    </div>
    ${loadCards(site)}
    <p class="center"><a class="link" href="/pricing/">How our pricing works ${icon('arrow', 'i i--sm')}</a></p>
  </div>
</section>

<section class="sec">
  <div class="wrap split">
    <div class="split__media">${photo(ctx, 'home-about', 'The Stellar Haul Away truck loaded after a garage clean-out', { art: 'truck' })}</div>
    <div>
      <p class="eyebrow">Your neighbors in ${esc(site.address.city)}</p>
      <h2 class="h2">A local crew that shows up and does it right</h2>
      <p>Stellar Haul Away is a small, locally owned business that started in ${esc(site.address.city)} in ${esc(site.foundingYear)}. We’re not a franchise or a call center. You talk to the people who actually do the work.</p>
      <ul class="why">
        <li>${icon('clock')}<div><strong>On time, every time</strong><span>We give you an arrival window and stick to it, and we text if anything changes.</span></div></li>
        <li>${icon('tag')}<div><strong>Upfront, honest pricing</strong><span>You get the price before we start. No surprise fees.</span></div></li>
        <li>${icon('heart')}<div><strong>Careful with your home</strong><span>We protect floors and door frames and work around what you’re keeping.</span></div></li>
        <li>${icon('recycle')}<div><strong>Not everything goes to the dump</strong><span>Usable items go to donation when we can, and metal, cardboard and green waste get recycled.</span></div></li>
      </ul>
    </div>
  </div>
</section>

${reviewsBlock(ctx)}

<section class="sec sec--soft">
  <div class="wrap">
    <div class="sec__head">
      <p class="eyebrow">Service area</p>
      <h2 class="h2">Serving Fullerton &amp; North Orange County</h2>
      <p class="sec__sub">Based in Fullerton. Most jobs within about 20 miles, and further on request.</p>
    </div>
    <ul class="areas">${areas.map((a) => `<li><a href="/service-areas/${a.slug}/">${icon('pin', 'i i--sm')} ${esc(a.name)}</a></li>`).join('')}</ul>
    <p class="center muted">Also serving ${ctx.otherCities.slice(0, 8).map(esc).join(', ')} and more.</p>
  </div>
</section>

${faqBlock(homeFaqs)}
${ctaBand(ctx)}`;
  return layout(ctx, {
    path: '/',
    title: 'Stellar Haul Away | Junk Removal in Fullerton & North Orange County',
    description: `Junk removal, light demolition and material delivery in Fullerton, Anaheim, Brea, Placentia and North OC. ${site.google.rating}★ on Google. Text a photo for an upfront price.`,
    body,
    schema: [faqSchema(homeFaqs)],
    bodyClass: 'pg-home',
  });
}

// ── Services hub ────────────────────────────────────────────────────────────
export function servicesHub(ctx) {
  const { services, groups } = ctx;
  const crumbs = [HOME, { label: 'Services', href: '/services/' }];
  const body = `
<section class="phero">
  <div class="wrap">
    ${breadcrumbs(crumbs)}
    <h1 class="phero__h">Our services</h1>
    <p class="phero__lead">Junk removal, light demolition and material delivery, all from one local crew in Fullerton.</p>
    ${ctaRow(ctx.site, { light: true })}
  </div>
</section>
${groups.map((g, i) => `
<section class="sec${i % 2 ? ' sec--soft' : ''}">
  <div class="wrap">
    <div class="sec__head sec__head--row">
      <div><h2 class="h2">${esc(g.name)}</h2><p class="sec__sub">${esc(g.blurb)}</p></div>
      <a class="link" href="/services/${g.pillar}/">All ${esc(g.name.toLowerCase())} ${icon('arrow', 'i i--sm')}</a>
    </div>
    <div class="cards">${services.filter((s) => s.group === g.key && !s.pillar).map(serviceCard).join('')}</div>
  </div>
</section>`).join('')}
${ctaBand(ctx)}`;
  return layout(ctx, {
    path: '/services/', crumbs, body,
    title: 'Junk Removal, Light Demolition & Material Delivery | Stellar Haul Away',
    description: 'Every service Stellar Haul Away offers in Fullerton and North Orange County: junk removal, clean-outs, light demolition and gravel, soil and mulch delivery.',
  });
}

// ── Service page ────────────────────────────────────────────────────────────
export function servicePage(ctx, s) {
  const { site, services, bySlug, groupByKey, areas } = ctx;
  const g = groupByKey[s.group];
  const crumbs = [HOME, { label: 'Services', href: '/services/' }, ...(s.pillar ? [] : [{ label: g.name, href: `/services/${g.pillar}/` }]), { label: s.name, href: `/services/${s.slug}/` }];
  const children = s.pillar ? services.filter((x) => x.group === s.group && !x.pillar) : [];
  const related = s.related.map((r) => bySlug[r]).filter((r) => !children.includes(r));
  const shownPhotos = s.photos.filter((p) => hasPhoto(ctx, p) || !ctx.PROD);
  const body = `
<section class="phero">
  <div class="wrap">
    ${breadcrumbs(crumbs)}
    <p class="eyebrow eyebrow--gold">${icon(s.icon, 'i i--sm')} ${esc(g.name)}</p>
    <h1 class="phero__h">${esc(s.h1)}</h1>
    <p class="phero__lead">${esc(s.lead)}</p>
    ${ctaRow(site, { light: true })}
    ${ratingBadge(site, { dark: true })}
  </div>
</section>

<section class="sec">
  <div class="wrap withside">
    <div class="prose">
      ${s.body.map((p) => `<p>${esc(p)}</p>`).join('')}
      ${s.lists.map(([h, items]) => `<h2>${esc(h)}</h2><ul class="checklist">${items.map((i) => `<li>${icon('check')} ${esc(i)}</li>`).join('')}</ul>`).join('')}
      ${shownPhotos.length ? `<div class="gallery gallery--${Math.min(shownPhotos.length, 2)}">${shownPhotos.map((p) => photo(ctx, p, `${s.name} by Stellar Haul Away`, { art: s.icon })).join('')}</div>` : ''}
      ${s.group === 'junk' ? `<h2>What it costs</h2><p>Junk removal is priced by volume, meaning how much of our trailer your items fill. Heavy materials are priced by weight. Labor, loading, hauling and disposal fees are all included. <a href="/pricing/">See how pricing works</a>.</p>` : ''}
    </div>
    <aside class="side">${quickForm(ctx, { heading: `Quote for ${s.name.toLowerCase()}`, service: s.name })}</aside>
  </div>
</section>

${children.length ? `
<section class="sec sec--soft">
  <div class="wrap">
    <h2 class="h2">${esc(g.name)} services</h2>
    <div class="cards">${children.map(serviceCard).join('')}</div>
  </div>
</section>` : ''}

<section class="sec${children.length ? '' : ' sec--soft'}">
  <div class="wrap">
    <div class="sec__head"><h2 class="h2">How it works</h2></div>
    ${steps()}
  </div>
</section>

${faqBlock(s.faqs, `${s.name}: common questions`)}

${related.length ? `
<section class="sec sec--soft">
  <div class="wrap">
    <h2 class="h2">Related services</h2>
    <div class="cards">${related.map(serviceCard).join('')}</div>
  </div>
</section>` : ''}

<section class="sec">
  <div class="wrap wrap--narrow center">
    <h2 class="h3">${esc(s.name)} near you</h2>
    <ul class="areas areas--inline">${areas.map((a) => `<li><a href="/service-areas/${a.slug}/">${esc(a.name)}</a></li>`).join('')}</ul>
  </div>
</section>
${ctaBand(ctx)}`;
  return layout(ctx, { path: `/services/${s.slug}/`, title: s.title, description: s.description, crumbs, body, schema: [faqSchema(s.faqs), {
    '@context': 'https://schema.org', '@type': 'Service', name: s.name, serviceType: s.name, description: s.description,
    provider: { '@id': abs(site, '/#business') }, areaServed: areas.map((a) => `${a.name}, CA`), url: abs(site, `/services/${s.slug}/`),
  }] });
}

// ── Pricing ─────────────────────────────────────────────────────────────────
const pricingFaqs = [
  ['Is the quote really the final price?', 'Yes, as long as the job matches what we were shown. If there’s more stuff than in the photos, or something heavy wasn’t mentioned, we tell you the new price before loading anything extra.'],
  ['Are there extra fees for stairs or disposal?', 'Disposal and standard labor are included. Very heavy items like pianos, safes or large amounts of concrete or dirt may cost more, and we’ll tell you upfront.'],
  ['How do you price material delivery?', 'By material and amount, with delivery included in one price. Tell us what you need and where, and we’ll send a quote.'],
  ['How do you price light demolition?', 'By the job: size, materials and access. Photos and rough dimensions get you the quickest quote.'],
  ['How do I pay?', 'Payment is due when the job is done. Ask us which payment methods we accept when you book.'],
];

export function pricing(ctx) {
  const { site } = ctx;
  const crumbs = [HOME, { label: 'Pricing', href: '/pricing/' }];
  const body = `
<section class="phero">
  <div class="wrap">
    ${breadcrumbs(crumbs)}
    <h1 class="phero__h">Simple, upfront pricing</h1>
    <p class="phero__lead">No hourly meter running, and no surprise fees. You know the price before we lift a thing.</p>
    ${ctaRow(site, { light: true })}
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec__head">
      <h2 class="h2">Junk removal: priced by load size</h2>
      <p class="sec__sub">The price depends on how much space your items take up in our trailer. Labor, loading, hauling, disposal and cleanup are all included.</p>
    </div>
    ${loadCards(site)}
  </div>
</section>
<section class="sec sec--soft">
  <div class="wrap grid3">
    <div class="tile">${icon('check')}<h3>Always included</h3><ul class="checklist">${['All lifting and loading', 'Hauling and disposal fees', 'Sweeping up the area', 'Separating donations and recyclables'].map((i) => `<li>${icon('check')} ${esc(i)}</li>`).join('')}</ul></div>
    <div class="tile">${icon('tag')}<h3>What changes the price</h3><ul class="checklist">${['How much space it takes up', 'Very heavy materials (concrete, dirt, roofing)', 'Long carries or lots of stairs', 'Items that need special handling'].map((i) => `<li>${icon('arrow')} ${esc(i)}</li>`).join('')}</ul></div>
    <div class="tile">${icon('camera')}<h3>Fastest way to a price</h3><p>Take a few photos that show everything that’s going and text them to <a href="${smsHref(site, 'Hi! I’d like a quote. Here’s a photo:')}" data-sms>${esc(site.phone)}</a>. Most quotes come back within the hour during business hours.</p></div>
  </div>
</section>
${faqBlock(pricingFaqs, 'Pricing questions')}
${ctaBand(ctx)}`;
  return layout(ctx, {
    path: '/pricing/', crumbs, body, schema: [faqSchema(pricingFaqs)],
    title: 'Junk Removal Prices & How Pricing Works | Stellar Haul Away',
    description: 'How Stellar Haul Away prices junk removal (by load size), light demolition and material delivery in Fullerton & North OC. Upfront quotes, no surprise fees.',
  });
}

// ── Service areas ───────────────────────────────────────────────────────────
export function areasHub(ctx) {
  const { areas, otherCities } = ctx;
  const crumbs = [HOME, { label: 'Service Areas', href: '/service-areas/' }];
  const body = `
<section class="phero">
  <div class="wrap">
    ${breadcrumbs(crumbs)}
    <h1 class="phero__h">Service areas</h1>
    <p class="phero__lead">Based in Fullerton, serving North Orange County and nearby cities.</p>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="acards">${areas.map((a) => `
      <a class="acard" href="/service-areas/${a.slug}/">
        <span class="acard__name">${icon('pin')} ${esc(a.name)}${a.home ? ' <em>Home base</em>' : ''}</span>
        <span class="acard__txt">${esc(a.intro)}</span>
      </a>`).join('')}
    </div>
    <h2 class="h3">Also serving</h2>
    <p>${otherCities.map(esc).join(' · ')}</p>
    <p class="muted">Don’t see your city? Call or text ${esc(ctx.site.phone)} and ask. We often go further for bigger jobs.</p>
  </div>
</section>
${ctaBand(ctx)}`;
  return layout(ctx, {
    path: '/service-areas/', crumbs, body,
    title: 'Junk Removal Service Areas in North Orange County | Stellar Haul Away',
    description: 'Stellar Haul Away serves Fullerton, Anaheim, Placentia, Brea, Buena Park, La Habra, Yorba Linda, Orange and nearby North Orange County cities.',
  });
}

export function areaPage(ctx, a) {
  const { site, bySlug, areaBySlug } = ctx;
  const crumbs = [HOME, { label: 'Service Areas', href: '/service-areas/' }, { label: a.name, href: `/service-areas/${a.slug}/` }];
  const faqs = [
    [`Do you serve all of ${a.name}?`, `Yes. We serve every neighborhood in ${a.name}, including ${a.neighborhoods.slice(0, 3).join(', ')} and more.`],
    [`How soon can you come to ${a.name}?`, a.home ? 'Fullerton is our home base, so we can often come the same or next day.' : `${a.name} is close to our Fullerton base, so we can often schedule within a day or two.`],
    ...homeFaqs.slice(0, 1),
    ...homeFaqs.slice(3, 4),
  ];
  const body = `
<section class="phero">
  <div class="wrap">
    ${breadcrumbs(crumbs)}
    <p class="eyebrow eyebrow--gold">${icon('pin', 'i i--sm')} ${esc(a.name)}, CA</p>
    <h1 class="phero__h">Junk removal in ${esc(a.name)}, CA</h1>
    <p class="phero__lead">${esc(a.intro)}</p>
    ${ctaRow(site, { light: true })}
    ${ratingBadge(site, { dark: true })}
  </div>
</section>
<section class="sec">
  <div class="wrap withside">
    <div class="prose">
      <h2>Local service from a ${esc(site.address.city)} crew</h2>
      <p>${esc(a.local)}</p>
      <p>Whatever the job, a single couch, a packed garage, a backyard shed or a few yards of gravel, you get the same thing: an upfront price, a crew that does all the lifting, and a clean space when we leave.</p>
      <h2>Neighborhoods we serve in ${esc(a.name)}</h2>
      <ul class="tags">${a.neighborhoods.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
      ${hasPhoto(ctx, `area-${a.slug}`) ? photo(ctx, `area-${a.slug}`, `Stellar Haul Away job in ${a.name}`) : ''}
    </div>
    <aside class="side">${quickForm(ctx, { heading: `Free quote in ${a.name}` })}</aside>
  </div>
</section>
<section class="sec sec--soft">
  <div class="wrap">
    <h2 class="h2">Popular in ${esc(a.name)}</h2>
    <div class="cards">${a.featured.map((f) => serviceCard(bySlug[f])).join('')}</div>
    <p class="center"><a class="link" href="/services/">See all services ${icon('arrow', 'i i--sm')}</a></p>
  </div>
</section>
${faqBlock(faqs, `${a.name} junk removal FAQs`)}
<section class="sec">
  <div class="wrap wrap--narrow center">
    <h2 class="h3">Nearby cities we serve</h2>
    <ul class="areas areas--inline">${a.nearby.map((n) => `<li><a href="/service-areas/${n}/">${esc(areaBySlug[n].name)}</a></li>`).join('')}</ul>
  </div>
</section>
${ctaBand(ctx, { heading: `Junk gone in ${a.name}, without the hassle` })}`;
  return layout(ctx, {
    path: `/service-areas/${a.slug}/`, crumbs, body, schema: [faqSchema(faqs)],
    title: `Junk Removal in ${a.name}, CA | Stellar Haul Away`,
    description: `Junk removal, clean-outs, light demolition and material delivery in ${a.name}, CA. Local Fullerton crew, upfront pricing, ${site.google.rating}★ on Google. Text a photo for a quote.`,
  });
}

// ── About ───────────────────────────────────────────────────────────────────
export function about(ctx) {
  const { site } = ctx;
  const crumbs = [HOME, { label: 'About', href: '/about/' }];
  const body = `
<section class="phero">
  <div class="wrap">
    ${breadcrumbs(crumbs)}
    <h1 class="phero__h">About Stellar Haul Away</h1>
    <p class="phero__lead">A locally owned ${esc(site.address.city)} business built on showing up on time, being straight about price and leaving every space cleaner than we found it.</p>
  </div>
</section>
<section class="sec">
  <div class="wrap split">
    <div class="split__media">${photo(ctx, 'about-team', 'The Stellar Haul Away crew', { art: 'heart' })}</div>
    <div class="prose">
      <h2>Why we started</h2>
      <p>Stellar Haul Away started in ${esc(site.address.city)} in ${esc(site.foundingYear)} with one idea: getting rid of junk shouldn’t be stressful. No call centers, no vague hourly rates, no crew that shows up three hours late. Just a clear price, people who work hard, and a clean space at the end.</p>
      <p>We’ve grown by word of mouth and a ${esc(site.google.rating)}-star Google rating, one garage, backyard and move-out at a time.</p>
      <h2>Our promise</h2>
      <ul class="checklist">${['You get a price before we start, and it doesn’t change unless the job does', 'We show up when we say we will', 'We treat your home like our own', 'We donate and recycle what we can', 'We sweep up before we leave'].map((i) => `<li>${icon('check')} ${esc(i)}</li>`).join('')}</ul>
      <h2>Need something bigger?</h2>
      <p>For full demolition, concrete and driveway removal, block walls and heavy hauling, our sister company <a href="${esc(site.sister.url)}" rel="noopener">${esc(site.sister.name)}</a> has the equipment and crew for it.</p>
    </div>
  </div>
</section>
${reviewsBlock(ctx)}
${ctaBand(ctx)}`;
  return layout(ctx, {
    path: '/about/', crumbs, body,
    title: 'About Stellar Haul Away | Locally Owned Junk Removal in Fullerton, CA',
    description: `Stellar Haul Away is a locally owned junk removal, light demolition and material delivery company in Fullerton, CA, serving North Orange County since ${site.foundingYear}.`,
  });
}

// ── Quote ───────────────────────────────────────────────────────────────────
export function quote(ctx) {
  const { site } = ctx;
  const crumbs = [HOME, { label: 'Free Quote', href: '/quote/' }];
  const body = `
<section class="phero phero--short">
  <div class="wrap">
    ${breadcrumbs(crumbs)}
    <h1 class="phero__h">Get a free, upfront quote</h1>
    <p class="phero__lead">Tell us about the job. Add photos and we can usually give you an exact price.</p>
  </div>
</section>
<section class="sec">
  <div class="wrap withside">
    <div>${quoteForm(ctx)}</div>
    <aside class="side">
      <div class="tile tile--navy">
        <h2 class="h3">Prefer to text?</h2>
        <p>Snap a few photos and text them to us. It’s the fastest way to get a price.</p>
        <a class="btn btn--gold btn--block" href="${smsHref(site, 'Hi! I’d like a quote. Here’s a photo:')}" data-sms>${icon('camera')} Text ${esc(site.phone)}</a>
        <a class="btn btn--line btn--block" href="${telHref(site)}" data-call>${icon('phone')} Or call us</a>
      </div>
      <div class="tile">
        <h2 class="h3">What happens next</h2>
        <ol class="mini-steps"><li>We review your request, usually within the hour during business hours.</li><li>We send your price by text, call or email.</li><li>You pick a time that works and we take it from there.</li></ol>
      </div>
      ${ratingBadge(site)}
    </aside>
  </div>
</section>`;
  return layout(ctx, {
    path: '/quote/', crumbs, body,
    title: 'Free Junk Removal Quote | Stellar Haul Away, Fullerton CA',
    description: 'Request a free, upfront quote for junk removal, light demolition or material delivery in Fullerton and North Orange County. Add photos for an exact price.',
  });
}

// ── Contact ─────────────────────────────────────────────────────────────────
export function contact(ctx) {
  const { site } = ctx;
  const crumbs = [HOME, { label: 'Contact', href: '/contact/' }];
  const body = `
<section class="phero phero--short">
  <div class="wrap">
    ${breadcrumbs(crumbs)}
    <h1 class="phero__h">Contact us</h1>
    <p class="phero__lead">Call, text or send a message. We’re happy to answer questions, even if you’re just pricing things out.</p>
  </div>
</section>
<section class="sec">
  <div class="wrap withside">
    <div>${contactForm()}</div>
    <aside class="side">
      <div class="tile">
        <ul class="contact-list">
          <li>${icon('phone')}<div><strong>Call</strong><a href="${telHref(site)}" data-call>${esc(site.phone)}</a></div></li>
          <li>${icon('sms')}<div><strong>Text</strong><a href="${smsHref(site)}" data-sms>${esc(site.phone)}</a></div></li>
          ${site.email ? `<li>${icon('mail')}<div><strong>Email</strong><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></div></li>` : ''}
          <li>${icon('pin')}<div><strong>Based in</strong>${esc(site.address.city)}, CA, serving North Orange County</div></li>
          <li>${icon('clock')}<div><strong>Hours</strong>${site.hours.map((h) => `${esc(h.days)}, ${fmtTime(h.open)}–${fmtTime(h.close)}`).join('<br>')}</div></li>
        </ul>
      </div>
    </aside>
  </div>
</section>`;
  return layout(ctx, {
    path: '/contact/', crumbs, body,
    title: 'Contact Stellar Haul Away | Junk Removal in Fullerton, CA',
    description: `Call or text Stellar Haul Away at ${site.phone} for junk removal, light demolition and material delivery in Fullerton and North Orange County.`,
  });
}

// ── Privacy, thank-you, 404 ─────────────────────────────────────────────────
export function privacy(ctx) {
  const { site } = ctx;
  const crumbs = [HOME, { label: 'Privacy Policy', href: '/privacy/' }];
  const body = `
<section class="phero phero--short"><div class="wrap">${breadcrumbs(crumbs)}<h1 class="phero__h">Privacy Policy</h1></div></section>
<section class="sec"><div class="wrap wrap--narrow prose">
  <p><em>Last updated: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</em></p>
  <p>${esc(site.legalName)} (“we”, “us”) respects your privacy. This policy explains what we collect through this website and our ads, and how we use it.</p>
  <h2>What we collect</h2>
  <p>When you request a quote or contact us, by web form, Facebook/Instagram lead form, text or phone, we collect the details you give us: your name, phone number, email, city or ZIP code, a description of the job and any photos you send. We also collect basic website analytics (pages visited, device type and how you found us) through cookies.</p>
  <h2>How we use it</h2>
  <p>Only to respond to your request, give you a quote, schedule and complete your job, and follow up about that job. We may use anonymous analytics to improve our website and advertising.</p>
  <h2>Text messages</h2>
  <p>If you text us or ask us to text you, we’ll text you about your quote and job. Message and data rates may apply. Reply STOP at any time to stop receiving texts. We never sell or share your phone number for marketing.</p>
  <h2>Sharing</h2>
  <p>We don’t sell your personal information. We only share it with service providers that help us run the business (for example, website hosting and form processing), and only as needed.</p>
  <h2>Photos</h2>
  <p>Photos you send are used to price your job. We may photograph completed work for our portfolio, but never in a way that shows your address or identifies you without permission.</p>
  <h2>Your choices</h2>
  <p>California residents can ask us what information we have about them, or ask us to delete it. Call or text ${esc(site.phone)}${site.email ? ` or email ${esc(site.email)}` : ''}.</p>
</div></section>`;
  return layout(ctx, { path: '/privacy/', crumbs, body, title: 'Privacy Policy | Stellar Haul Away', description: `How ${site.name} collects and uses information submitted through this website and our ads.` });
}

export function thankYou(ctx) {
  const { site } = ctx;
  const body = `
<section class="sec">
  <div class="wrap wrap--narrow center ty">
    <span class="ty__icon">${icon('check')}</span>
    <h1 class="h2">Got it, thank you!</h1>
    <p class="lead">Your request is in. We’ll reach out shortly, usually within the hour during business hours.</p>
    <p>Want an exact price even faster? Text a few photos of the job to <a href="${smsHref(site, 'Hi! I just sent a quote request. Here are photos:')}" data-sms>${esc(site.phone)}</a>.</p>
    <div class="ctas ctas--center"><a class="btn btn--gold" href="${smsHref(site, 'Hi! I just sent a quote request. Here are photos:')}" data-sms>${icon('camera')} Text photos</a><a class="btn btn--ghost" href="/">Back to home</a></div>
  </div>
</section>
<script>window.SHA_LEAD=new URLSearchParams(location.search).get('form')||'quote';</script>`;
  return layout(ctx, { path: '/thank-you/', body, noindex: true, title: 'Thank you | Stellar Haul Away', description: 'Thanks for your request.' });
}

export function notFound(ctx) {
  const body = `
<section class="sec">
  <div class="wrap wrap--narrow center">
    <p class="eyebrow">404</p>
    <h1 class="h2">Looks like this page got hauled away</h1>
    <p class="lead">The page you’re looking for doesn’t exist. Try one of these instead:</p>
    <div class="ctas ctas--center"><a class="btn btn--gold" href="/">Home</a><a class="btn btn--ghost" href="/services/">Services</a><a class="btn btn--ghost" href="/quote/">Free quote</a></div>
  </div>
</section>`;
  return layout(ctx, { path: '/404.html', body, noindex: true, title: 'Page not found | Stellar Haul Away', description: 'Page not found.' });
}
