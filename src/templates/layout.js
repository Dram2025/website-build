import { esc, real, icon, telHref } from '../lib/util.js';

const abs = (site, p) => site.url.replace(/\/$/, '') + p;

export function businessSchema(ctx) {
  const { site, services, locations, otherCities, reviews } = ctx;
  const id = abs(site, '/#business');
  const s = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': id,
    name: site.name,
    alternateName: site.shortName,
    url: abs(site, '/'),
    logo: abs(site, '/assets/img/logo-960.png'),
    image: abs(site, '/assets/img/og-default.jpg'),
    telephone: site.phoneE164,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      ...(site.address.street && { streetAddress: site.address.street }),
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      ...(site.address.postalCode && { postalCode: site.address.postalCode }),
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Orange County, California' },
      ...locations.map((l) => ({ '@type': 'City', name: `${l.name}, CA`, url: abs(site, `/service-areas/${l.slug}/`) })),
      ...otherCities.map((c) => ({ '@type': 'City', name: `${c}, CA` })),
    ],
    openingHoursSpecification: site.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification', dayOfWeek: h.schemaDays, opens: h.open, closes: h.close,
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Demolition, concrete removal and hauling services',
      itemListElement: services.map((sv) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: sv.name, url: abs(site, `/services/${sv.slug}/`) },
      })),
    },
  };
  const email = real(site.email);
  if (email) s.email = email;
  const lic = real(site.license.number);
  if (lic) s.hasCredential = { '@type': 'EducationalOccupationalCredential', credentialCategory: 'license', name: `California CSLB License #${lic}`, recognizedBy: { '@type': 'GovernmentOrganization', name: 'Contractors State License Board', url: 'https://www.cslb.ca.gov/' } };
  const year = real(site.foundingYear);
  if (year) s.foundingDate = year;
  const sameAs = Object.entries(site.social).filter(([k, v]) => v && k !== 'googleReviewLink').map(([, v]) => v);
  if (sameAs.length) s.sameAs = sameAs;
  if (reviews.length) {
    const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
    s.aggregateRating = { '@type': 'AggregateRating', ratingValue: avg.toFixed(1), reviewCount: reviews.length, bestRating: 5 };
  }
  return s;
}

export function breadcrumbSchema(site, crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: abs(site, c.href) })),
  };
}

export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
}

function tracking(site) {
  const t = site.tracking;
  let h = '';
  if (t.gtmId) {
    h += `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${esc(t.gtmId)}');</script>`;
  }
  const gtagId = t.ga4Id || t.googleAdsId;
  if (gtagId) {
    h += `<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(gtagId)}"></script>`;
    h += `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${t.ga4Id ? `gtag('config','${esc(t.ga4Id)}');` : ''}${t.googleAdsId ? `gtag('config','${esc(t.googleAdsId)}');` : ''}</script>`;
  }
  h += `<script>window.DRAM=${JSON.stringify({ adsId: t.googleAdsId, leadLabel: t.googleAdsLeadLabel, callLabel: t.googleAdsCallLabel })};</script>`;
  return h;
}

function header(ctx, path) {
  const { site, nav } = ctx;
  const lic = site.license.number;
  const cred = lic && site.insurance ? `Licensed &amp; insured · CSLB Lic. #${esc(lic)}` : lic ? `CSLB Lic. #${esc(lic)}` : `Locally owned · Based in ${esc(site.address.city)}, CA`;
  const links = nav
    .map((n) => `<li><a href="${n.href}"${path.startsWith(n.href) ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`)
    .join('');
  return `
<a class="skip" href="#main">Skip to content</a>
<div class="topbar">
  <div class="wrap topbar__in">
    <p>${icon(lic ? 'shield' : 'pin', 'i i--sm')} ${cred}</p>
    <p class="topbar__hide-sm">${icon('pin', 'i i--sm')} Serving all of Orange County</p>
    <p class="topbar__hide-sm">${icon('clock', 'i i--sm')} ${esc(site.hours[0].days)} ${fmtTime(site.hours[0].open)}–${fmtTime(site.hours[0].close)}</p>
  </div>
</div>
<header class="hdr" data-header>
  <div class="wrap hdr__in">
    <a class="hdr__logo" href="/" aria-label="${esc(site.name)} — home">
      <img src="/assets/img/logo-480.webp" srcset="/assets/img/logo-480.webp 480w, /assets/img/logo-960.webp 960w" sizes="(min-width: 1100px) 228px, 168px" width="228" height="76" alt="${esc(site.name)}">
    </a>
    <nav class="hdr__nav" id="site-nav" aria-label="Main">
      <ul>${links}</ul>
      <div class="hdr__navcta">
        <a class="btn btn--primary btn--block" href="/estimate/">Get a Free Estimate</a>
        <a class="btn btn--ghost btn--block" href="${telHref(site)}" data-call>${icon('phone')} Call ${esc(site.phone)}</a>
      </div>
    </nav>
    <div class="hdr__actions">
      <a class="hdr__phone" href="${telHref(site)}" data-call>${icon('phone')}<span><small>Call now — free estimate</small>${esc(site.phone)}</span></a>
      <a class="btn btn--primary hdr__cta" href="/estimate/">Free Estimate</a>
      <button class="hdr__menu" type="button" aria-controls="site-nav" aria-expanded="false" data-menu>${icon('menu')}<span class="sr">Menu</span></button>
    </div>
  </div>
</header>`;
}

export const fmtTime = (t) => {
  const [h, m] = t.split(':').map(Number);
  const hh = ((h + 11) % 12) + 1;
  return `${hh}${m ? ':' + String(m).padStart(2, '0') : ''}${h < 12 ? 'am' : 'pm'}`;
};

function footer(ctx) {
  const { site, services, locations } = ctx;
  const year = new Date().getFullYear();
  const svc = services.map((s) => `<li><a href="/services/${s.slug}/">${esc(s.name)}</a></li>`).join('');
  const loc = locations.map((l) => `<li><a href="/service-areas/${l.slug}/">${esc(l.name)}</a></li>`).join('');
  const social = Object.entries({ 'Google': site.social.googleBusiness, Yelp: site.social.yelp, Facebook: site.social.facebook, Instagram: site.social.instagram, Nextdoor: site.social.nextdoor })
    .filter(([, v]) => v).map(([k, v]) => `<li><a href="${esc(v)}" rel="noopener" target="_blank">${k}</a></li>`).join('');
  return `
<footer class="ftr">
  <div class="wrap ftr__grid">
    <div class="ftr__brand">
      <img src="/assets/img/logo-480.webp" width="240" height="80" alt="${esc(site.name)}" loading="lazy">
      <p>Residential and commercial demolition, concrete removal and debris hauling across Orange County and neighboring Southern California.</p>
      <p class="ftr__nap">
        <a href="${telHref(site)}" data-call>${icon('phone', 'i i--sm')} ${esc(site.phone)}</a><br>
        <a href="mailto:${esc(site.email)}" data-email>${icon('mail', 'i i--sm')} ${esc(site.email)}</a><br>
        ${icon('pin', 'i i--sm')} ${site.address.street ? esc(site.address.street) + ', ' : ''}${esc(site.address.city)}, ${esc(site.address.region)} ${esc(site.address.postalCode)}
      </p>
      ${site.license.number
        ? `<p class="ftr__lic">CSLB License #${esc(site.license.number)}<br><a href="https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/CheckLicense.aspx" rel="noopener" target="_blank">Verify our license at cslb.ca.gov</a></p>`
        : `<p class="ftr__lic">${esc(site.name)} is not licensed by the California Contractors State License Board.</p>`}
      <ul class="ftr__hours">${site.hours.map((h) => `<li><span>${esc(h.days)}</span> ${fmtTime(h.open)} – ${fmtTime(h.close)}</li>`).join('')}</ul>
    </div>
    <div><h2 class="ftr__h">Services</h2><ul class="ftr__list ftr__list--2">${svc}</ul></div>
    <div><h2 class="ftr__h">Service Areas</h2><ul class="ftr__list">${loc}<li><a href="/service-areas/">All service areas</a></li></ul></div>
    <div>
      <h2 class="ftr__h">Company</h2>
      <ul class="ftr__list">
        <li><a href="/residential/">For Homeowners</a></li>
        <li><a href="/commercial/">For Contractors &amp; Commercial</a></li>
        <li><a href="/projects/">Project Portfolio</a></li>
        <li><a href="/about/">About D.RAM</a></li>
        <li><a href="/estimate/">Free Estimate</a></li>
        <li><a href="/commercial-bid/">Request a Commercial Bid</a></li>
        <li><a href="/contact/">Contact</a></li>
      </ul>
      ${social ? `<h2 class="ftr__h">Find us</h2><ul class="ftr__list">${social}</ul>` : ''}
    </div>
  </div>
  <div class="wrap ftr__legal">
    <p>© ${year} ${esc(site.name)}. All rights reserved.</p>
    <p><a href="/privacy/">Privacy Policy</a> · <a href="/privacy/#sms">SMS Terms</a> · <a href="/sitemap.xml">Sitemap</a></p>
  </div>
</footer>
<div class="mbar" aria-label="Quick actions">
  <a class="mbar__call" href="${telHref(site)}" data-call>${icon('phone')} Call Now</a>
  <a class="mbar__est" href="/estimate/">${icon('clipboard')} Free Estimate</a>
</div>`;
}

export function breadcrumbs(crumbs) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${crumbs
    .map((c, i) => (i === crumbs.length - 1 ? `<li aria-current="page">${esc(c.label)}</li>` : `<li><a href="${c.href}">${esc(c.label)}</a></li>`))
    .join('')}</ol></nav>`;
}

export function layout(ctx, { path, title, description, body, schema = [], crumbs, noindex = false, ogImage, bodyClass = '' }) {
  const { site, assetVersion } = ctx;
  const url = abs(site, path);
  const og = ogImage ? abs(site, ogImage) : abs(site, '/assets/img/og-default.jpg');
  const allSchema = [businessSchema(ctx), ...(crumbs ? [breadcrumbSchema(site, crumbs)] : []), ...schema];
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>document.documentElement.classList.add('js')</script>
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<meta name="theme-color" content="#0b0b0b">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
${site.tracking.gscVerification ? `<meta name="google-site-verification" content="${esc(site.tracking.gscVerification)}">` : ''}
<meta name="geo.region" content="US-CA">
<meta name="geo.placename" content="Orange County">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/assets/img/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/assets/css/main.css?v=${assetVersion}">
<link rel="preload" as="image" href="/assets/img/logo-480.webp" imagesrcset="/assets/img/logo-480.webp 480w, /assets/img/logo-960.webp 960w" imagesizes="(min-width: 1100px) 228px, 168px">
${tracking(site)}
${allSchema.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}
<script src="/assets/js/main.js?v=${assetVersion}" defer></script>
</head>
<body class="${bodyClass}${ctx.PROD ? '' : ' is-preview'}">
${site.tracking.gtmId ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${esc(site.tracking.gtmId)}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>` : ''}
${header(ctx, path)}
<main id="main">
${body}
</main>
${footer(ctx)}
</body>
</html>
`;
}
