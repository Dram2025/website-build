import { esc, icon, telHref, monthLabel } from '../lib/util.js';
import { layout, faqSchema, fmtTime } from './layout.js';
import {
  photo, beforeAfter, pageHero, trustBar, ctaBand, faqList, steps, checklist, serviceCard, projectCard,
  reviewsBlock, citiesBlock, quickForm, estimateForm, bidForm, contactForm,
} from './components.js';

const abs = (site, p) => site.url.replace(/\/$/, '') + p;
const HOME = { label: 'Home', href: '/' };

// ═════════════════════════════════════════════════════════════════════════════
// HOME
// ═════════════════════════════════════════════════════════════════════════════
const homeFaqs = [
  ['How much does demolition or concrete removal cost?', 'It depends on size, thickness, reinforcement, access and haul distance. We don’t quote blind: we measure on site (or price from your photos for simple jobs) and give you a free written estimate that spells out exactly what’s included.'],
  ['Are you a local company?', 'Yes. D.RAM is based in Fullerton and works throughout Orange County. The person who estimates your job stays your point of contact until it’s done.'],
  ['Do you haul away the debris?', 'Yes — haul-off is included in every demolition and removal estimate. Concrete, asphalt and metal go to recyclers whenever possible.'],
  ['Do you handle permits?', 'For jobs that need a demolition permit, we coordinate the permit, required asbestos survey and utility disconnect sign-offs, and tell you up front what your city requires.'],
  ['How soon can you start?', 'Small concrete and hauling jobs can often be scheduled within one to two weeks. Permitted demolition depends on the city’s permit timeline. Tell us your deadline when you request an estimate.'],
  ['Do you work with general contractors?', 'Yes. We work as a demolition subcontractor for GCs with written bids, clear scopes and reliable scheduling. Use our commercial bid form to send plans.'],
];

export function home(ctx) {
  const { site, services, projects } = ctx;
  const heroVideo = ctx.photos['home-hero.video'];
  const heroImg = ctx.photos['home-hero'];
  const featured = projects.slice(0, 3);

  const body = `
<section class="hero">
  ${heroVideo ? `<video class="hero__bg" autoplay muted loop playsinline ${heroImg ? `poster="${heroImg.src}"` : ''} aria-hidden="true"><source src="${heroVideo.src}" type="video/mp4"></video>`
    : heroImg ? `<img class="hero__bg" src="${heroImg.src}" width="${heroImg.w}" height="${heroImg.h}" alt="" fetchpriority="high">` : ''}
  <div class="wrap hero__in">
    <div class="hero__copy">
      <p class="eyebrow">Orange County demolition &amp; hauling contractor</p>
      <h1>Professional Demolition &amp; Concrete Removal in Orange County</h1>
      <p class="lede">Residential tear-downs, driveway and patio removal, commercial demolition and debris hauling — done safely, cleaned up completely, and priced in writing before we start.</p>
      <div class="btnrow">
        <a class="btn btn--primary btn--lg" href="/estimate/">Get a Free Estimate ${icon('arrow')}</a>
        <a class="btn btn--outline btn--lg" href="${telHref(site)}" data-call>${icon('phone')} Call ${esc(site.phone)}</a>
      </div>
      <ul class="ticks">
        <li>${icon('check')} Locally owned in Fullerton</li>
        <li>${icon('check')} Free on-site or photo estimates</li>
        <li>${icon('check')} Debris hauled &amp; recycled</li>
      </ul>
    </div>
    <div class="hero__form">${quickForm(ctx, { title: 'Get your free estimate', sub: 'Fast reply — usually the same business day.' })}</div>
  </div>
  ${heroImg || heroVideo ? '' : `<div class="hero__ph">${ctx.PROD ? '' : `<span>${icon('camera')} Add <code>home-hero.jpg</code> (or <code>home-hero.mp4</code>) — your crew &amp; equipment on a real job</span>`}</div>`}
</section>

${trustBar(ctx)}

<section class="sec sec--light">
  <div class="wrap">
    <div class="sec__head">
      <p class="eyebrow">Who we work for</p>
      <h2>Demolition for homeowners and for the trades</h2>
      <p>Two very different kinds of customers rely on us. We built a path for each.</p>
    </div>
    <div class="aud">
      <a class="aud__card" href="/residential/">
        ${photo(ctx, 'audience-residential', 'D.RAM crew removing a residential driveway in Orange County', { ratio: '16/9' })}
        <div class="aud__body">
          <p class="eyebrow">${icon('house', 'i i--sm')} Homeowners</p>
          <h3>Residential demolition &amp; concrete removal</h3>
          <p>Clear written pricing, your property protected, scheduling that works around your family, and a site left cleaner than we found it.</p>
          <span class="link">For homeowners ${icon('arrow', 'i i--sm')}</span>
        </div>
      </a>
      <a class="aud__card" href="/commercial/">
        ${photo(ctx, 'audience-commercial', 'D.RAM excavator on a commercial demolition site', { ratio: '16/9' })}
        <div class="aud__body">
          <p class="eyebrow">${icon('building', 'i i--sm')} GCs, property managers &amp; owners</p>
          <h3>Commercial demolition &amp; site work</h3>
          <p>Accurate bids from your plans, clear scopes of work, reliable crews and recycling paperwork for your diversion report.</p>
          <span class="link">For contractors &amp; commercial ${icon('arrow', 'i i--sm')}</span>
        </div>
      </a>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec__head">
      <p class="eyebrow">Services</p>
      <h2>Demolition, concrete removal &amp; hauling</h2>
      <p>Every service has its own page with our process, pricing factors and answers to common questions.</p>
    </div>
    <div class="sgrid sgrid--home">
      ${services.map(serviceCard).join('')}
      <a class="scard scard--cta" href="/estimate/"><span class="scard__ic">${icon('camera', 'i i--lg')}</span><h3>Not sure what you need?</h3><p>Send photos of the job. We’ll tell you what it involves and what it costs.</p><span class="scard__more">Send photos ${icon('arrow', 'i i--sm')}</span></a>
      <a class="scard scard--cta" href="/commercial-bid/"><span class="scard__ic">${icon('file', 'i i--lg')}</span><h3>Bidding a project?</h3><p>General contractors: upload plans and scope documents for a written bid.</p><span class="scard__more">Request a bid ${icon('arrow', 'i i--sm')}</span></a>
    </div>
  </div>
</section>

<section class="sec sec--dark">
  <div class="wrap">
    <div class="sec__head">
      <p class="eyebrow">How it works</p>
      <h2>From first call to clean site in four steps</h2>
    </div>
    ${steps([
      ['Request an estimate', 'Call, or send the form with a few photos. Most residential concrete jobs can be priced from good photos.'],
      ['Get a written price', 'We visit when needed, measure, and send an itemized estimate that lists what’s included — and what isn’t.'],
      ['We schedule & prepare', 'Permits, utility locates (DigAlert 811), surveys and neighbor notices are handled before the start date.'],
      ['Demo, haul & clean', 'We protect what stays, remove what goes, recycle the debris and leave the site ready for your next step.'],
    ])}
  </div>
</section>

<section class="sec sec--light">
  <div class="wrap">
    <div class="sec__head sec__head--row">
      <div>
        <p class="eyebrow">Our work</p>
        <h2>Before &amp; after</h2>
        <p>Real projects, documented from start to finish.</p>
      </div>
      <a class="btn btn--ghost-dark" href="/projects/">View all projects ${icon('arrow')}</a>
    </div>
    ${featured.length ? `<div class="feat">${beforeAfter(ctx, featured[0].slug, `${featured[0].title} in ${ctx.locBySlug[featured[0].city].name}`)}
      <div class="feat__copy">
        ${featured[0].sample && !ctx.PROD ? '<span class="tag tag--warn">Sample layout</span>' : ''}
        <p class="pcard__meta">${esc(ctx.bySlug[featured[0].service].name)} · ${esc(ctx.locBySlug[featured[0].city].name)}</p>
        <h3>${esc(featured[0].title)}</h3>
        <p>${esc(featured[0].summary)}</p>
        <p><strong>Scope:</strong> ${esc(featured[0].scope)}</p>
        <a class="link" href="/projects/${featured[0].slug}/">See the full project ${icon('arrow', 'i i--sm')}</a>
      </div></div>
      <div class="pgrid pgrid--2">${featured.slice(1).map((p) => projectCard(ctx, p)).join('')}</div>` : '<p>Project gallery coming soon.</p>'}
  </div>
</section>

<section class="sec">
  <div class="wrap why">
    <div>
      <p class="eyebrow">Why D.RAM</p>
      <h2>A demolition contractor you don’t have to babysit</h2>
      <p>Demolition is loud, heavy and permanent. The difference between a good contractor and a bad one shows up in the details nobody sees on a quote — so we put those details in writing.</p>
      <div class="btnrow"><a class="btn btn--primary" href="/about/">About our company ${icon('arrow')}</a></div>
    </div>
    <ul class="why__list">
      <li>${icon('clipboard', 'i i--lg')}<div><h3>Written, itemized scopes</h3><p>You see exactly what’s being removed, what’s protected and what’s included in the price.</p></div></li>
      <li>${icon('shield', 'i i--lg')}<div><h3>Your property protected</h3><p>Saw-cut edges, plywood paths and covered landscaping — we treat what stays as carefully as what goes.</p></div></li>
      <li>${icon('badge', 'i i--lg')}<div><h3>Permits &amp; compliance handled</h3><p>Demolition permits, SCAQMD asbestos surveys and DigAlert locates are coordinated before day one.</p></div></li>
      <li>${icon('recycle', 'i i--lg')}<div><h3>Debris recycled, not dumped</h3><p>Concrete, asphalt and metal go to recyclers, with weight tickets available for your records.</p></div></li>
      <li>${icon('calendar', 'i i--lg')}<div><h3>We show up when we say</h3><p>Scheduled start dates, a heads-up the day before, and a direct number for the person running your job.</p></div></li>
    </ul>
  </div>
</section>

${reviewsBlock(ctx)}

${citiesBlock(ctx)}

<section class="sec sec--light">
  <div class="wrap narrow">
    <div class="sec__head"><p class="eyebrow">FAQ</p><h2>Common questions</h2></div>
    ${faqList(homeFaqs)}
  </div>
</section>

${ctaBand(ctx)}`;

  return layout(ctx, {
    path: '/',
    title: 'Demolition Contractor Orange County | Concrete Removal | D.RAM',
    description: `Orange County demolition and hauling: residential and commercial demolition, driveway and concrete removal, debris hauling. Free estimates — ${site.phone}.`,
    body,
    schema: [faqSchema(homeFaqs), { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: abs(site, '/') }],
    bodyClass: 'pg-home',
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// SERVICES
// ═════════════════════════════════════════════════════════════════════════════
export function servicesHub(ctx) {
  const { services, serviceGroups } = ctx;
  const crumbs = [HOME, { label: 'Services', href: '/services/' }];
  const body = `
${pageHero(ctx, { crumbs, eyebrow: 'Services', h1: 'Demolition, Concrete Removal & Hauling Services', lede: 'Fourteen specialized services for homeowners, general contractors, property managers and commercial owners across Orange County. Pick a service to see our process, what affects the price and answers to common questions.' })}
<section class="sec">
  <div class="wrap">
    ${serviceGroups.map((g) => `<h2 class="grouph">${esc(g)}</h2><div class="sgrid">${services.filter((s) => s.group === g).map(serviceCard).join('')}</div>`).join('')}
  </div>
</section>
${citiesBlock(ctx)}
${ctaBand(ctx, { title: 'Not sure which service you need?', text: 'Send a few photos and a short description. We’ll tell you what the job involves and what it will cost.' })}`;
  return layout(ctx, {
    path: '/services/', crumbs, body,
    title: 'Demolition & Concrete Removal Services | Orange County | D.RAM',
    description: 'Residential, commercial and selective demolition, concrete, driveway, patio, slab, wall and asphalt removal, and debris hauling in Orange County.',
    schema: [{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: services.map((s, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(ctx.site, `/services/${s.slug}/`), name: s.name })) }],
  });
}

export function servicePage(ctx, s) {
  const { site, locations, bySlug, projects } = ctx;
  const crumbs = [HOME, { label: 'Services', href: '/services/' }, { label: s.name, href: `/services/${s.slug}/` }];
  const related = s.related.map((r) => bySlug[r]).filter(Boolean);
  const svcProjects = projects.filter((p) => p.service === s.slug);
  const cityLinks = locations.map((l) => `<li><a href="/service-areas/${l.slug}/">${esc(s.name)} in ${esc(l.name)}</a></li>`).join('');
  const aud = s.audience.includes('commercial') && !s.audience.includes('residential')
    ? `<a class="btn btn--ghost-dark btn--block" href="/commercial-bid/">${icon('file')} Send plans for a bid</a>`
    : s.audience.includes('commercial')
      ? `<a class="btn btn--ghost-dark btn--block" href="/commercial-bid/">${icon('building')} Contractors: request a bid</a>` : '';

  const body = `
${pageHero(ctx, { crumbs, eyebrow: `${s.group} · Orange County`, h1: s.h1, lede: s.lede, photoName: `${s.photos[0]}` , aside: quickForm(ctx, { title: `Free ${s.name.toLowerCase()} estimate`, service: s.slug }) })}
${trustBar(ctx)}
<section class="sec">
  <div class="wrap split">
    <div class="prose">
      <h2>${esc(s.name)} done right</h2>
      ${s.intro.map((p) => `<p>${esc(p)}</p>`).join('')}
      <h2>What’s included</h2>
      ${checklist(s.included)}
    </div>
    <aside class="sidecard">
      ${photo(ctx, s.photos[1] || s.photos[0], `${s.name} project by D.RAM Demolition in Orange County`, { sizes: '(min-width: 900px) 380px, 100vw' })}
      <div class="sidecard__body">
        <h2>Get a written price</h2>
        <p>Free on-site measurement — or send photos and we’ll often price it the same day.</p>
        <a class="btn btn--primary btn--block btn--lg" href="/estimate/">Get a Free Estimate</a>
        <a class="btn btn--ghost-dark btn--block" href="${telHref(site)}" data-call>${icon('phone')} ${esc(site.phone)}</a>
        ${aud}
      </div>
    </aside>
  </div>
</section>

<section class="sec sec--dark">
  <div class="wrap">
    <div class="sec__head"><p class="eyebrow">Our process</p><h2>How we handle ${esc(s.name.toLowerCase())}</h2></div>
    ${steps(s.process)}
  </div>
</section>

<section class="sec sec--light">
  <div class="wrap">
    <div class="sec__head"><p class="eyebrow">Photos</p><h2>${esc(s.name)} — recent work</h2></div>
    <div class="gallery">${s.photos.map((ph, i) => `<figure>${photo(ctx, ph, `${s.name} in Orange County — photo ${i + 1}`, { sizes: '(min-width: 900px) 33vw, 100vw' })}</figure>`).join('')}</div>
    ${svcProjects.length ? `<h3 class="grouph">Documented ${esc(s.name.toLowerCase())} projects</h3><div class="pgrid">${svcProjects.map((p) => projectCard(ctx, p)).join('')}</div>` : ''}
  </div>
</section>

<section class="sec">
  <div class="wrap split split--even">
    <div class="prose">
      <h2>What affects the price</h2>
      <p>Every estimate we write is based on measurements, not guesses. These are the factors that move the number most for ${esc(s.name.toLowerCase())}:</p>
      ${checklist(s.factors, 'checks--dots')}
      <p><a class="link" href="/estimate/">Get your free written estimate ${icon('arrow', 'i i--sm')}</a></p>
    </div>
    <div class="prose">
      <h2>${esc(s.name)} in Orange County</h2>
      <p>${esc(s.local)}</p>
      <h3>Find ${esc(s.name.toLowerCase())} near you</h3>
      <ul class="linklist">${cityLinks}</ul>
    </div>
  </div>
</section>

<section class="sec sec--light">
  <div class="wrap narrow">
    <div class="sec__head"><p class="eyebrow">FAQ</p><h2>${esc(s.name)} questions</h2></div>
    ${faqList(s.faqs)}
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec__head"><p class="eyebrow">Related services</p><h2>Often done together</h2></div>
    <div class="sgrid">${related.map(serviceCard).join('')}</div>
  </div>
</section>

${ctaBand(ctx, { title: `Get a free ${s.name.toLowerCase()} estimate`, text: 'Send photos and a few details — we’ll reply within one business day with next steps or a price.' })}`;

  return layout(ctx, {
    path: `/services/${s.slug}/`, crumbs, body,
    title: s.title, description: s.description,
    ogImage: ctx.photos[s.photos[0]]?.src,
    schema: [
      {
        '@context': 'https://schema.org', '@type': 'Service', name: s.name, serviceType: s.name,
        description: s.description, url: abs(site, `/services/${s.slug}/`),
        provider: { '@id': abs(site, '/#business') },
        areaServed: [{ '@type': 'AdministrativeArea', name: 'Orange County, California' }, ...locations.map((l) => ({ '@type': 'City', name: `${l.name}, CA` }))],
        audience: { '@type': 'Audience', audienceType: s.audience.map((a) => (a === 'residential' ? 'Homeowners' : 'General contractors and commercial property owners')).join(', ') },
      },
      faqSchema(s.faqs),
    ],
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// AUDIENCE JOURNEYS
// ═════════════════════════════════════════════════════════════════════════════
const resFaqs = [
  ['Will you give me a price before starting?', 'Always. You get a written, itemized estimate before any work is scheduled. If we uncover a hidden condition — buried concrete under a slab, for example — we stop and talk with you before doing extra work.'],
  ['How much of a deposit do you require?', 'California law limits the down payment on a home improvement contract to $1,000 or 10% of the contract price, whichever is less, and we follow it. Payment terms are written on your contract.'],
  ['Do I need to be home during the work?', 'Not necessarily. We need access to the work area and, ideally, a quick walk-through with you at the start and end of the job.'],
  ['What about my neighbors?', 'For larger jobs we let neighbors know when work is happening, keep the street clean and limit work to the city’s permitted hours.'],
  ['Can you price my job from photos?', 'For many concrete-removal and hauling jobs, yes. Upload several clear photos — wide shots and close-ups — with the size of the area, and we’ll either price it or tell you a quick site visit is needed.'],
];

export function residential(ctx) {
  const { site, services } = ctx;
  const crumbs = [HOME, { label: 'Homeowners', href: '/residential/' }];
  const resServices = services.filter((s) => s.audience.includes('residential'));
  const body = `
${pageHero(ctx, { crumbs, eyebrow: 'For homeowners', h1: 'Residential Demolition & Concrete Removal for Orange County Homeowners', lede: 'Clear pricing, careful crews, and a site left cleaner than we found it. Here’s exactly what to expect when you hire D.RAM.', photoName: 'audience-residential', aside: quickForm(ctx, { title: 'Get your free estimate' }) })}
${trustBar(ctx)}

<section class="sec">
  <div class="wrap">
    <div class="sec__head"><p class="eyebrow">Our promises to homeowners</p><h2>What you can count on</h2></div>
    <div class="cards4">
      <div class="icard">${icon('clipboard', 'i i--lg')}<h3>Clear pricing up front</h3><p>A free, written, itemized estimate before anything is scheduled — including haul-off and clean-up. No surprise “dump fees” at the end.</p></div>
      <div class="icard">${icon('shield', 'i i--lg')}<h3>Your property protected</h3><p>Saw-cut edges where concrete stays, plywood over lawns and walkways, and covered plants and windows near the work.</p></div>
      <div class="icard">${icon('calendar', 'i i--lg')}<h3>Easy scheduling</h3><p>We give you a firm start date, confirm the day before, and coordinate with your concrete, paver or ADU contractor so there’s no gap.</p></div>
      <div class="icard">${icon('truck', 'i i--lg')}<h3>Debris gone, site clean</h3><p>Every piece of debris is hauled and recycled where possible. We rake, sweep and blow off the site before we leave.</p></div>
    </div>
  </div>
</section>

<section class="sec sec--light">
  <div class="wrap split split--even">
    <div class="prose">
      <h2>Understanding your price</h2>
      <p>No two demolition jobs cost the same, which is why we don’t publish one-size-fits-all prices. What we can do is explain what drives the number so your estimate makes sense:</p>
      ${checklist(['Size — square footage or linear footage of what’s being removed', 'Thickness and reinforcement (rebar or wire mesh takes longer to break and separate)', 'Access — an open driveway is faster than a narrow side yard or hillside', 'Disposal — concrete and dirt are heavy; mixed debris costs more to dispose of', 'Permits and surveys, when the city requires them'], 'checks--dots')}
      <p>Your estimate lists each of these so you can compare it fairly against other bids.</p>
    </div>
    <div class="prose">
      <h2>Safety comes first</h2>
      <p>Demolition can be dangerous if it’s rushed. Before we start we:</p>
      ${checklist(['Call DigAlert (811) to mark underground gas, electric, water and communication lines', 'Confirm gas and electric to any structure are disconnected by the utility', 'Arrange the asbestos survey required by SCAQMD Rule 1403 for structure demolition', 'Set up barriers to keep children, pets and neighbors out of the work zone', 'Use water to control dust during breaking and loading'])}
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec__head"><p class="eyebrow">Residential services</p><h2>What homeowners hire us for</h2></div>
    <div class="sgrid">${resServices.map(serviceCard).join('')}</div>
  </div>
</section>

${reviewsBlock(ctx, { limit: 3 })}

<section class="sec sec--light">
  <div class="wrap narrow">
    <div class="sec__head"><p class="eyebrow">FAQ</p><h2>Homeowner questions</h2></div>
    ${faqList(resFaqs)}
  </div>
</section>
${ctaBand(ctx, { title: 'Get a clear, written price', text: 'Send a few photos of your project. We’ll reply within one business day.' })}`;
  return layout(ctx, {
    path: '/residential/', crumbs, body,
    title: 'Residential Demolition for Homeowners | Orange County | D.RAM',
    description: 'Homeowner demolition and concrete removal in Orange County with clear written pricing, property protection, easy scheduling and full debris haul-off. Free estimates.',
    schema: [faqSchema(resFaqs)],
  });
}

const comFaqs = [
  ['What do you need to prepare a bid?', 'Plans and specifications (or a scope narrative), the site address, your bid date and any subcontractor or prequalification requirements. A site walk is part of every commercial bid we prepare.'],
  ['How do you handle jobsite safety?', 'Every job starts with DigAlert (811) locates and verified utility disconnects. We control dust with water, keep work zones barricaded, and coordinate with abatement contractors and other trades before we start.'],
  ['Do you provide recycling documentation?', 'Yes. We keep weight tickets from recyclers and transfer stations for construction-waste diversion reporting.'],
  ['Can you work nights or weekends?', 'Where the property and city allow it, yes — common for occupied retail centers and parking lots.'],
];

export function commercial(ctx) {
  const { site, services } = ctx;
  const crumbs = [HOME, { label: 'Commercial', href: '/commercial/' }];
  const comServices = services.filter((s) => s.audience.includes('commercial'));
  const body = `
${pageHero(ctx, { crumbs, eyebrow: 'For general contractors, property managers & owners', h1: 'Commercial Demolition Subcontractor for Orange County Projects', lede: 'Accurate bids from your plans, clear scopes of work, crews that show up on schedule, and a clean turnover to the next trade.', photoName: 'audience-commercial', ctas: false, aside: `<div class="qform"><h2 class="qform__t">Bidding a project?</h2><p class="qform__s">Send plans, drawings and scope documents securely. We walk the site and return a written bid with clear inclusions and exclusions.</p><a class="btn btn--primary btn--block btn--lg" href="/commercial-bid/">Request a Commercial Bid ${icon('arrow')}</a><a class="btn btn--ghost-dark btn--block" href="${telHref(site)}" data-call>${icon('phone')} Estimating: ${esc(site.phone)}</a><p class="form__fine">${icon('lock', 'i i--sm')} Documents are transmitted encrypted and accessible only to D.RAM staff.</p></div>` })}
${trustBar(ctx)}

<section class="sec">
  <div class="wrap">
    <div class="sec__head"><p class="eyebrow">Why GCs use D.RAM</p><h2>What you get from your demolition sub</h2></div>
    <div class="cards4">
      <div class="icard">${icon('clipboard', 'i i--lg')}<h3>Clear scopes of work</h3><p>Bids built from your drawings with inclusions, exclusions, duration and assumptions spelled out — so change orders aren’t a surprise.</p></div>
      <div class="icard">${icon('calendar', 'i i--lg')}<h3>Scheduling reliability</h3><p>Committed mobilization dates, daily updates to your superintendent and enough equipment to hold the schedule.</p></div>
      <div class="icard">${icon('phone', 'i i--lg')}<h3>Clear communication</h3><p>One point of contact from bid to turnover, daily progress updates and photo documentation of completed work.</p></div>
      <div class="icard">${icon('hardhat', 'i i--lg')}<h3>Safety &amp; coordination</h3><p>DigAlert locates, dust control, barricaded work zones, and coordination with abatement, utilities and other trades.</p></div>
    </div>
  </div>
</section>

<section class="sec sec--dark">
  <div class="wrap">
    <div class="sec__head"><p class="eyebrow">Bid process</p><h2>From plans to turnover</h2></div>
    ${steps([
      ['Send the bid package', 'Upload plans or share a link, with your bid date and any subcontract requirements.'],
      ['Site walk', 'We walk the site, verify conditions and ask our questions early.'],
      ['Written bid', 'Clear line items, inclusions, exclusions, duration and assumptions.'],
      ['Pre-con & mobilization', 'Scope, safety plan, schedule and logistics confirmed with your team.'],
      ['Demo & haul', 'Sequenced work, daily updates, recycling with weight tickets.'],
      ['Turnover', 'Site walked with your superintendent and handed off clean.'],
    ])}
  </div>
</section>

<section class="sec sec--light">
  <div class="wrap split split--even">
    <div class="prose">
      <h2>Project types</h2>
      ${checklist(['Retail, restaurant and office tenant-improvement strip-outs', 'Small commercial and industrial building demolition', 'Warehouse slab, pit and trench removal', 'Parking lot asphalt and site concrete removal', 'Multi-family and HOA flatwork, walls and walkways', 'Site clearing and export ahead of new construction'], 'checks--dots')}
    </div>
    <div class="prose">
      <h2>Included with every bid</h2>
      ${checklist(['Written scope with inclusions and exclusions', 'Duration and proposed schedule', 'Assumptions and site conditions noted on the walk', 'W-9 on request', 'Recycling / diversion weight tickets after the job', 'Photo documentation of the completed site'])}
      <p><a class="link" href="/commercial-bid/">Request a bid ${icon('arrow', 'i i--sm')}</a></p>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec__head"><p class="eyebrow">Commercial services</p><h2>Capabilities</h2></div>
    <div class="sgrid">${comServices.map(serviceCard).join('')}</div>
  </div>
</section>

<section class="sec sec--light">
  <div class="wrap narrow">
    <div class="sec__head"><p class="eyebrow">FAQ</p><h2>Contractor &amp; commercial questions</h2></div>
    ${faqList(comFaqs)}
  </div>
</section>

<section class="ctaband">
  <div class="wrap ctaband__in">
    <div><h2>Have a project out to bid?</h2><p>Send plans and scope documents — we’ll confirm we can meet your bid date.</p></div>
    <div class="btnrow"><a class="btn btn--dark btn--lg" href="/commercial-bid/">Request a Commercial Bid ${icon('arrow')}</a><a class="btn btn--dark-outline btn--lg" href="${telHref(site)}" data-call>${icon('phone')} ${esc(site.phone)}</a></div>
  </div>
</section>`;
  return layout(ctx, {
    path: '/commercial/', crumbs, body,
    title: 'Commercial Demolition Subcontractor for GCs | Orange County | D.RAM',
    description: 'Commercial demolition subcontractor for GCs, developers and property managers in Orange County. Written bids, clear scopes, reliable scheduling.',
    schema: [faqSchema(comFaqs)],
  });
}

export function commercialBid(ctx) {
  const { site } = ctx;
  const crumbs = [HOME, { label: 'Commercial', href: '/commercial/' }, { label: 'Request a Bid', href: '/commercial-bid/' }];
  const body = `
${pageHero(ctx, { crumbs, eyebrow: 'Commercial & GC bids', compact: true, h1: 'Request a Commercial Demolition Bid', lede: 'Send plans, drawings and scope documents. We’ll confirm receipt, schedule a site walk, and return a written bid with clear inclusions and exclusions.', ctas: false })}
<section class="sec">
  <div class="wrap split">
    <div>${bidForm(ctx)}</div>
    <aside class="sidecard sidecard--plain">
      <div class="sidecard__body">
        <h2>What happens next</h2>
        ${steps([['Confirmation', 'You get an email confirming we received your package.'], ['Review & site walk', 'We review documents and schedule a walk.'], ['Written bid', 'Delivered before your bid date, with inclusions and exclusions.']])}
        <h3>Prefer to talk it through?</h3>
        <a class="btn btn--ghost-dark btn--block" href="${telHref(site)}" data-call>${icon('phone')} ${esc(site.phone)}</a>
        <a class="btn btn--ghost-dark btn--block" href="mailto:${esc(site.email)}" data-email>${icon('mail')} Email plans</a>
        <p class="form__fine">${icon('lock', 'i i--sm')} Uploaded documents travel over an encrypted HTTPS connection and are stored privately for D.RAM staff only. We never share your plans.</p>
      </div>
    </aside>
  </div>
</section>`;
  return layout(ctx, {
    path: '/commercial-bid/', crumbs, body,
    title: 'Request a Commercial Demolition Bid | Upload Plans | D.RAM Demolition',
    description: 'General contractors and commercial owners: upload plans, drawings and scope documents to request a written demolition bid for your Orange County project.',
  });
}

export function estimate(ctx) {
  const { site } = ctx;
  const crumbs = [HOME, { label: 'Free Estimate', href: '/estimate/' }];
  const body = `
${pageHero(ctx, { crumbs, eyebrow: 'Free estimate', compact: true, h1: 'Request Your Free Demolition Estimate', lede: 'Three quick steps. Add photos and most jobs can be priced without waiting for a site visit. We reply within one business day.', ctas: false })}
<section class="sec">
  <div class="wrap split">
    <div>${estimateForm(ctx)}</div>
    <aside class="sidecard sidecard--plain">
      <div class="sidecard__body">
        <h2>Rather call?</h2>
        <p>Talk to us directly — we answer during business hours and return every call.</p>
        <a class="btn btn--primary btn--block btn--lg" href="${telHref(site)}" data-call>${icon('phone')} ${esc(site.phone)}</a>
        <h3>Photo tips for a faster price</h3>
        ${checklist(['One wide shot showing the whole area', 'Close-ups of edges and any cracks (shows thickness)', 'The path from the work area to the street', 'Something for scale — a tape measure or a shoe'], 'checks--dots')}
        <h3>Contractors &amp; commercial</h3>
        <p>Need to send plans? <a href="/commercial-bid/">Use the commercial bid form</a>.</p>
      </div>
    </aside>
  </div>
</section>
${trustBar(ctx)}`;
  return layout(ctx, {
    path: '/estimate/', crumbs, body,
    title: 'Free Demolition & Concrete Removal Estimate | D.RAM Demolition',
    description: 'Request a free written estimate for demolition, concrete removal or debris hauling in Orange County. Upload project photos for a faster price.',
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// SERVICE AREAS
// ═════════════════════════════════════════════════════════════════════════════
export function areasHub(ctx) {
  const { locations, otherCities, regionalMarkets } = ctx;
  const crumbs = [HOME, { label: 'Service Areas', href: '/service-areas/' }];
  const body = `
${pageHero(ctx, { crumbs, eyebrow: 'Service areas', h1: 'Demolition Service Areas in Orange County', lede: 'Based in north Orange County, our crews work across the county every week — with neighboring Southern California cities served by arrangement.' })}
<section class="sec">
  <div class="wrap">
    <div class="sec__head"><h2>Primary service cities</h2><p>Each city page covers local housing stock, permit offices, neighborhoods and the jobs we do most there.</p></div>
    <div class="lgrid">${locations.map((l) => `<a class="lcard" href="/service-areas/${l.slug}/">${icon('pin', 'i i--lg')}<h3>${esc(l.name)}</h3><p>${esc(l.lede)}</p><span class="link">Demolition in ${esc(l.name)} ${icon('arrow', 'i i--sm')}</span></a>`).join('')}</div>
    <div class="split split--even areas-more">
      <div><h2>Also serving</h2><ul class="cols3">${otherCities.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>
      <div><h2>By arrangement</h2><p>Larger residential and commercial projects in neighboring counties:</p><ul class="cols3">${regionalMarkets.map((c) => `<li>${esc(c)}</li>`).join('')}</ul><p>Don’t see your city? <a href="/estimate/">Ask us</a> — we’ll tell you honestly whether we can serve it well.</p></div>
    </div>
  </div>
</section>
${ctaBand(ctx)}`;
  return layout(ctx, {
    path: '/service-areas/', crumbs, body,
    title: 'Service Areas | Demolition Contractor Orange County | D.RAM Demolition',
    description: 'D.RAM Demolition serves Fullerton, Anaheim, Orange, Santa Ana, Irvine, Huntington Beach and cities across Orange County and neighboring Southern California.',
  });
}

export function locationPage(ctx, l) {
  const { site, bySlug, locBySlug, projects, services } = ctx;
  const crumbs = [HOME, { label: 'Service Areas', href: '/service-areas/' }, { label: l.name, href: `/service-areas/${l.slug}/` }];
  const featured = l.featured.map((f) => bySlug[f]);
  const locProjects = projects.filter((p) => p.city === l.slug);
  const body = `
${pageHero(ctx, { crumbs, eyebrow: `${l.name}, California`, h1: l.h1, lede: l.lede, photoName: `city-${l.slug}`, aside: quickForm(ctx, { title: `Free estimate in ${l.name}`, city: l.name }) })}
${trustBar(ctx)}
<section class="sec">
  <div class="wrap split">
    <div class="prose">
      <h2>Demolition work in ${esc(l.name)}</h2>
      ${l.intro.map((p) => `<p>${esc(p)}</p>`).join('')}
      <h2>What’s different about demolition in ${esc(l.name)}</h2>
      <div class="notes">${l.considerations.map(([t, d]) => `<div class="note"><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('')}</div>
    </div>
    <aside class="sidecard sidecard--plain">
      <div class="sidecard__body">
        <h2>${esc(l.name)} at a glance</h2>
        <dl class="facts">
          <dt>Permits</dt><dd>${esc(l.permitOffice)}</dd>
          <dt>Neighborhoods we serve</dt><dd>${l.neighborhoods.map(esc).join(', ')}</dd>
          <dt>ZIP codes</dt><dd>${l.zips.join(', ')}</dd>
        </dl>
        <p class="form__fine">Permit requirements change — always confirm current requirements with the city. We’ll tell you what we typically see on the estimate visit.</p>
        <a class="btn btn--primary btn--block btn--lg" href="/estimate/">Free Estimate in ${esc(l.name)}</a>
        <a class="btn btn--ghost-dark btn--block" href="${telHref(site)}" data-call>${icon('phone')} ${esc(site.phone)}</a>
      </div>
    </aside>
  </div>
</section>

<section class="sec sec--light">
  <div class="wrap">
    <div class="sec__head"><p class="eyebrow">Popular in ${esc(l.name)}</p><h2>Our most-requested services in ${esc(l.name)}</h2></div>
    <div class="sgrid">${featured.map((s) => `<a class="scard" href="/services/${s.slug}/"><span class="scard__ic">${icon(s.icon, 'i i--lg')}</span><h3>${esc(s.name)} in ${esc(l.name)}</h3><p>${esc(s.card)}</p><span class="scard__more">Learn more ${icon('arrow', 'i i--sm')}</span></a>`).join('')}</div>
    <p class="more-svcs">Also available in ${esc(l.name)}: ${services.filter((s) => !l.featured.includes(s.slug)).map((s) => `<a href="/services/${s.slug}/">${esc(s.name.toLowerCase())}</a>`).join(', ')}.</p>
  </div>
</section>

${locProjects.length ? `<section class="sec"><div class="wrap"><div class="sec__head"><p class="eyebrow">Local work</p><h2>Projects in ${esc(l.name)}</h2></div><div class="pgrid">${locProjects.map((p) => projectCard(ctx, p)).join('')}</div></div></section>` : ''}

<section class="sec sec--light">
  <div class="wrap narrow">
    <div class="sec__head"><p class="eyebrow">FAQ</p><h2>${esc(l.name)} demolition questions</h2></div>
    ${faqList(l.faqs)}
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <h2 class="grouph">Nearby service areas</h2>
    <ul class="cityp">${l.nearby.map((n) => locBySlug[n]).map((n) => `<li><a href="/service-areas/${n.slug}/">${icon('pin', 'i i--sm')} ${esc(n.name)}</a></li>`).join('')}<li><a href="/service-areas/">All service areas</a></li></ul>
  </div>
</section>

${ctaBand(ctx, { title: `Demolition in ${l.name}? Let’s talk.`, text: `Free written estimates for ${l.name} homeowners, contractors and property managers.` })}`;
  return layout(ctx, {
    path: `/service-areas/${l.slug}/`, crumbs, body,
    title: l.title, description: l.description,
    schema: [
      {
        '@context': 'https://schema.org', '@type': 'Service', name: `Demolition and concrete removal in ${l.name}, CA`,
        provider: { '@id': abs(site, '/#business') },
        areaServed: { '@type': 'City', name: `${l.name}, CA`, containedInPlace: { '@type': 'AdministrativeArea', name: 'Orange County, California' } },
        hasOfferCatalog: { '@type': 'OfferCatalog', name: `Services in ${l.name}`, itemListElement: l.featured.map((f) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: bySlug[f].name, url: abs(site, `/services/${f}/`) } })) },
      },
      faqSchema(l.faqs),
    ],
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// PROJECTS
// ═════════════════════════════════════════════════════════════════════════════
export function projectsHub(ctx) {
  const { projects } = ctx;
  const crumbs = [HOME, { label: 'Projects', href: '/projects/' }];
  const body = `
${pageHero(ctx, { crumbs, eyebrow: 'Portfolio', h1: 'Demolition Projects: Before & After', lede: 'Documented jobs from across Orange County — what we removed, the equipment we used, the problems we solved and how we left the site.' })}
<section class="sec">
  <div class="wrap">
    ${projects.length ? `<div class="pgrid">${projects.map((p) => projectCard(ctx, p)).join('')}</div>` : `<div class="empty"><h2>New projects are being documented</h2><p>We’re photographing current jobs for this portfolio. Want to see examples of work like yours? Call us and we’ll share photos of similar projects.</p></div>`}
  </div>
</section>
${ctaBand(ctx, { title: 'Want results like these?', text: 'Send photos of your project for a free written estimate.' })}`;
  return layout(ctx, {
    path: '/projects/', crumbs, body,
    title: 'Demolition Projects: Before & After Photos | Orange County | D.RAM',
    description: 'Before-and-after demolition, concrete removal and hauling projects completed by D.RAM Demolition across Orange County.',
  });
}

export function projectPage(ctx, p) {
  const { site, bySlug, locBySlug, projects } = ctx;
  const loc = locBySlug[p.city];
  const svc = bySlug[p.service];
  const crumbs = [HOME, { label: 'Projects', href: '/projects/' }, { label: `${p.title} — ${loc.name}`, href: `/projects/${p.slug}/` }];
  const more = projects.filter((x) => x.slug !== p.slug).slice(0, 3);
  const body = `
${pageHero(ctx, { crumbs, eyebrow: `${svc.name} · ${loc.name}, CA`, h1: `${p.title} in ${loc.name}`, lede: p.summary, ctas: false })}
${p.sample && !ctx.PROD ? `<div class="wrap"><p class="banner-warn">${icon('camera', 'i i--sm')} <strong>Sample layout.</strong> This project is placeholder content showing the page structure. It is excluded from production builds — replace it in <code>src/data/projects.js</code> with a real job.</p></div>` : ''}
<section class="sec">
  <div class="wrap">
    ${beforeAfter(ctx, p.slug, `${p.title} in ${loc.name}`)}
    <div class="split proj">
      <div class="prose">
        <h2>The challenge</h2><p>${esc(p.challenge)}</p>
        <h2>Our solution</h2><p>${esc(p.solution)}</p>
        <h2>Completed site condition</h2><p>${esc(p.result)}</p>
        <h2>During the work</h2>
        ${photo(ctx, `${p.slug}-during`, `${p.title} in progress — ${loc.name}`, { ratio: '16/9' })}
        ${p.testimonial ? `<blockquote class="review review--big"><p>“${esc(p.testimonial.quote)}”</p><footer><strong>${esc(p.testimonial.name)}</strong> · ${esc(p.testimonial.role)}</footer></blockquote>` : ''}
      </div>
      <aside class="sidecard sidecard--plain">
        <div class="sidecard__body">
          <h2>Project details</h2>
          <dl class="facts">
            <dt>Service</dt><dd><a href="/services/${svc.slug}/">${esc(svc.name)}</a></dd>
            <dt>Location</dt><dd><a href="/service-areas/${loc.slug}/">${esc(loc.name)}, CA</a></dd>
            <dt>Completed</dt><dd>${esc(monthLabel(p.date))}</dd>
            <dt>Scope</dt><dd>${esc(p.scope)}</dd>
            <dt>Equipment</dt><dd>${p.equipment.map(esc).join(', ')}</dd>
          </dl>
          <a class="btn btn--primary btn--block btn--lg" href="/estimate/">Get a Similar Estimate</a>
          <a class="btn btn--ghost-dark btn--block" href="${telHref(site)}" data-call>${icon('phone')} ${esc(site.phone)}</a>
        </div>
      </aside>
    </div>
  </div>
</section>
${more.length ? `<section class="sec sec--light"><div class="wrap"><h2 class="grouph">More projects</h2><div class="pgrid">${more.map((x) => projectCard(ctx, x)).join('')}</div></div></section>` : ''}
${ctaBand(ctx)}`;
  return layout(ctx, {
    path: `/projects/${p.slug}/`, crumbs, body,
    title: `${p.title} in ${loc.name}, CA | D.RAM Demolition Project`,
    description: `${p.summary} ${svc.name} project in ${loc.name}, CA by D.RAM Demolition.`.slice(0, 158),
    ogImage: ctx.photos[`${p.slug}-after`]?.src,
    noindex: p.sample,
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// COMPANY
// ═════════════════════════════════════════════════════════════════════════════
export function about(ctx) {
  const { site } = ctx;
  const crumbs = [HOME, { label: 'About', href: '/about/' }];
  const body = `
${pageHero(ctx, { crumbs, eyebrow: 'About D.RAM', h1: 'About D.RAM Demolition & Hauling', lede: 'An Orange County demolition, concrete removal and hauling contractor built on one idea: do the heavy work carefully, and leave every site better than we found it.', photoName: 'about-crew' })}
${trustBar(ctx)}
<section class="sec">
  <div class="wrap split split--even">
    <div class="prose">
      <h2>Our story</h2>
      <p>[OWNER STORY — 2–3 short paragraphs in your own words: who founded D.RAM, when, why you got into demolition, and what you want customers to know about how you run jobs. Real details build more trust than polished copy.]</p>
      <h2>How we work</h2>
      ${checklist(['Every estimate is written and itemized', 'The person who estimates your job stays your point of contact', 'We protect what stays as carefully as we remove what goes', 'Debris is recycled whenever a recycler will take it', 'We leave every site raked, swept and clean'])}
    </div>
    <div>
      ${photo(ctx, 'about-owner', 'Owner of D.RAM Demolition on a job site', { ratio: '4/5', sizes: '(min-width: 900px) 45vw, 100vw' })}
    </div>
  </div>
</section>
<section class="sec sec--light">
  <div class="wrap">
    <div class="sec__head"><p class="eyebrow">The company</p><h2>${site.license.number ? 'Licensed and verifiable' : 'Local, accountable, easy to reach'}</h2></div>
    <div class="cards4">
      ${site.license.number
        ? `<div class="icard">${icon('badge', 'i i--lg')}<h3>CSLB License</h3><p>License #${esc(site.license.number)}<br>${esc(site.license.classification)}</p><a class="link" href="https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/CheckLicense.aspx" target="_blank" rel="noopener">Verify at CSLB ${icon('arrow', 'i i--sm')}</a></div>`
        : `<div class="icard">${icon('pin', 'i i--lg')}<h3>Based in ${esc(site.address.city)}</h3><p>Locally owned and operating across Orange County since ${esc(site.foundingYear)}.</p></div>`}
      ${site.insurance
        ? `<div class="icard">${icon('shield', 'i i--lg')}<h3>Insurance</h3><p>${esc(site.insurance)}. Certificates available on request.</p></div>`
        : `<div class="icard">${icon('phone', 'i i--lg')}<h3>One point of contact</h3><p>The person who estimates your job is the person you call — from first visit to final clean-up.</p></div>`}
      <div class="icard">${icon('hardhat', 'i i--lg')}<h3>Safety on every job</h3><p>DigAlert locates before any excavation, verified utility disconnects, and dust control on every job.</p></div>
      <div class="icard">${icon('recycle', 'i i--lg')}<h3>Recycling</h3><p>Concrete, asphalt and metal routed to recyclers, with weight tickets for diversion reports.</p></div>
    </div>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec__head"><p class="eyebrow">Equipment</p><h2>Our fleet</h2><p>The right-size machine for the access you have — from walk-behind breakers to full-size excavators.</p></div>
    <div class="gallery">
      <figure>${photo(ctx, 'equipment-excavator', 'D.RAM excavator with hydraulic breaker')}<figcaption>Excavators with hydraulic breakers</figcaption></figure>
      <figure>${photo(ctx, 'equipment-skidsteer', 'D.RAM compact track loader')}<figcaption>Compact track loaders for tight access</figcaption></figure>
      <figure>${photo(ctx, 'equipment-truck', 'D.RAM dump truck hauling debris')}<figcaption>Dump trucks for same-day haul-off</figcaption></figure>
    </div>
  </div>
</section>
${reviewsBlock(ctx)}
${ctaBand(ctx)}`;
  return layout(ctx, {
    path: '/about/', crumbs, body,
    title: 'About D.RAM Demolition & Hauling | Fullerton, Orange County',
    description: 'Meet D.RAM Demolition & Hauling — a locally owned Fullerton demolition, concrete removal and hauling company serving all of Orange County since 2024.',
  });
}

export function contact(ctx) {
  const { site } = ctx;
  const crumbs = [HOME, { label: 'Contact', href: '/contact/' }];
  const body = `
${pageHero(ctx, { crumbs, eyebrow: 'Contact', compact: true, h1: 'Contact D.RAM Demolition', lede: 'The fastest way to a price is a phone call or the estimate form with photos. For anything else, send us a message.', ctas: false })}
<section class="sec">
  <div class="wrap split">
    <div>
      <h2>Send a message</h2>
      ${contactForm(ctx)}
    </div>
    <aside class="sidecard sidecard--plain">
      <div class="sidecard__body">
        <h2>Reach us directly</h2>
        <a class="btn btn--primary btn--block btn--lg" href="${telHref(site)}" data-call>${icon('phone')} ${esc(site.phone)}</a>
        <a class="btn btn--ghost-dark btn--block" href="mailto:${esc(site.email)}" data-email>${icon('mail')} ${esc(site.email)}</a>
        <dl class="facts">
          <dt>Hours</dt><dd>${site.hours.map((h) => `${esc(h.days)}: ${fmtTime(h.open)} – ${fmtTime(h.close)}`).join('<br>')}</dd>
          <dt>Based in</dt><dd>${esc(site.address.city)}, CA — serving all of Orange County</dd>
          ${site.license.number ? `<dt>License</dt><dd>CSLB #${esc(site.license.number)}</dd>` : ''}
        </dl>
        <a class="btn btn--ghost-dark btn--block" href="/estimate/">${icon('clipboard')} Detailed estimate form</a>
        <a class="btn btn--ghost-dark btn--block" href="/commercial-bid/">${icon('building')} Commercial bid request</a>
      </div>
    </aside>
  </div>
</section>`;
  return layout(ctx, {
    path: '/contact/', crumbs, body,
    title: `Contact D.RAM Demolition | ${site.phone} | Orange County`,
    description: `Call ${site.phone} or send a message to D.RAM Demolition & Hauling — demolition, concrete removal and hauling across Orange County, CA.`,
  });
}

export function privacy(ctx) {
  const { site } = ctx;
  const crumbs = [HOME, { label: 'Privacy Policy', href: '/privacy/' }];
  const updated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const body = `
${pageHero(ctx, { crumbs, h1: 'Privacy Policy & SMS Terms', lede: `Last updated ${updated}.`, ctas: false })}
<section class="sec">
  <div class="wrap narrow prose">
    <p>${esc(site.name)} (“we,” “us”) respects your privacy. This policy explains what information we collect through this website, how we use it, and the choices you have, including rights under the California Consumer Privacy Act (CCPA) as amended by the CPRA.</p>
    <h2>Information we collect</h2>
    <ul>
      <li><strong>Information you give us:</strong> name, phone number, email, company, project address, project details, and photos or documents you upload with an estimate or bid request.</li>
      <li><strong>Information collected automatically:</strong> pages visited, referring website, approximate location derived from IP address, device and browser type, and advertising click identifiers (such as Google’s gclid) and campaign tags.</li>
    </ul>
    <h2>How we use it</h2>
    <ul>
      <li>To respond to your request, prepare estimates and bids, schedule and perform work.</li>
      <li>To send confirmations and project updates by email, phone or (with your consent) text message.</li>
      <li>To understand which pages and advertising bring us customers, and to improve this website.</li>
      <li>To protect against spam and fraud, and to comply with legal obligations.</li>
    </ul>
    <h2>Sharing</h2>
    <p>We do not sell or share your personal information for cross-context behavioral advertising, and we do not sell it for money. We share information only with service providers who help us operate — such as our website host and form processor, email and text-message providers, customer-management software and analytics providers — under contracts that limit their use of it, or when required by law.</p>
    <h2>Cookies &amp; analytics</h2>
    <p>We use Google Analytics and may use Google Ads conversion tracking to measure how visitors find and use this site. These tools use cookies. You can block cookies in your browser settings or use Google’s opt-out tools at <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener" target="_blank">tools.google.com/dlpage/gaoptout</a>. We honor Global Privacy Control signals as an opt-out of any sharing.</p>
    <h2>Uploaded photos and documents</h2>
    <p>Files you upload are transmitted over an encrypted (HTTPS) connection, stored privately, and accessible only to our staff for preparing your estimate or bid. We do not publish customer photos or plans without permission.</p>
    <h2>Retention</h2>
    <p>We keep estimate and project records for as long as needed to serve you and to meet business, tax and legal requirements, then delete them.</p>
    <h2>Your California privacy rights</h2>
    <p>California residents may request to know what personal information we hold about them, request correction or deletion, and opt out of any sale or sharing. We will not discriminate against you for exercising these rights. To make a request, call ${esc(site.phone)} or email ${esc(site.email)}. We will verify your request using information we already hold.</p>
    <h2 id="sms">SMS terms</h2>
    <p>If you check the text-message consent box, you agree to receive text messages from ${esc(site.name)} about your estimate request and project (confirmations, scheduling and updates). Message frequency varies. Message and data rates may apply. Reply <strong>STOP</strong> to opt out at any time and <strong>HELP</strong> for help. Consent is not a condition of any purchase. Mobile information is not shared with third parties or affiliates for marketing or promotional purposes.</p>
    <h2>Children</h2>
    <p>This site is not directed to children under 16 and we do not knowingly collect their information.</p>
    <h2>Contact</h2>
    <p>${esc(site.name)} · ${esc(site.address.city)}, CA · ${esc(site.phone)} · ${esc(site.email)}</p>
  </div>
</section>`;
  return layout(ctx, {
    path: '/privacy/', crumbs, body,
    title: 'Privacy Policy & SMS Terms | D.RAM Demolition',
    description: 'How D.RAM Demolition & Hauling collects, uses and protects information submitted through this website, including California privacy rights and SMS terms.',
  });
}

export function thankYou(ctx) {
  const { site } = ctx;
  const body = `
<section class="phero">
  <div class="wrap phero__in">
    <div class="phero__copy">
      <p class="eyebrow">Request received</p>
      <h1>Thank you — we’ve got your request.</h1>
      <p class="lede" data-ty-msg>We’ll review your project and contact you within one business day. A confirmation is on its way to your inbox.</p>
      <div class="btnrow"><a class="btn btn--primary btn--lg" href="${telHref(site)}" data-call>${icon('phone')} Need it sooner? Call ${esc(site.phone)}</a><a class="btn btn--outline btn--lg" href="/projects/">See our work</a></div>
    </div>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec__head"><h2>What happens next</h2></div>
    ${steps([['We review', 'Your details and photos go straight to our estimator.'], ['We reach out', 'Expect a call, text or email — whichever you chose — within one business day.'], ['You get a written price', 'From your photos, or after a quick on-site measurement.']])}
  </div>
</section>
<script>(function(){var f=new URLSearchParams(location.search).get('form')||'estimate';window.DRAM_LEAD=f;})();</script>`;
  return layout(ctx, {
    path: '/thank-you/', body, noindex: true,
    title: 'Thank You | D.RAM Demolition',
    description: 'Your request has been received.',
    bodyClass: 'pg-thanks',
  });
}

export function notFound(ctx) {
  const body = `
<section class="phero">
  <div class="wrap phero__in">
    <div class="phero__copy">
      <p class="eyebrow">404</p>
      <h1>This page has already been demolished.</h1>
      <p class="lede">The page you’re looking for doesn’t exist. Try one of these instead:</p>
      <div class="btnrow"><a class="btn btn--primary btn--lg" href="/">Home</a><a class="btn btn--outline btn--lg" href="/services/">Services</a><a class="btn btn--outline btn--lg" href="/estimate/">Free Estimate</a></div>
    </div>
  </div>
</section>`;
  return layout(ctx, { path: '/404.html', body, noindex: true, title: 'Page Not Found | D.RAM Demolition', description: 'Page not found.' });
}
