import { esc, icon, telHref, smsHref } from '../lib/util.js';

export const abs = (site, p) => site.url.replace(/\/$/, '') + p;

export const fmtTime = (t) => {
  const [h, m] = t.split(':').map(Number);
  const hh = ((h + 11) % 12) + 1;
  return `${hh}${m ? ':' + String(m).padStart(2, '0') : ''}${h < 12 ? 'am' : 'pm'}`;
};

export function businessSchema(ctx) {
  const { site, services, areas, otherCities } = ctx;
  const s = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': abs(site, '/#business'),
    name: site.name,
    legalName: site.legalName,
    url: abs(site, '/'),
    logo: abs(site, '/assets/img/logo-960.png'),
    image: abs(site, '/assets/img/og-default.png'),
    telephone: site.phoneE164,
    priceRange: '$$',
    foundingDate: site.foundingYear,
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
      ...areas.map((a) => ({ '@type': 'City', name: `${a.name}, CA`, url: abs(site, `/service-areas/${a.slug}/`) })),
      ...otherCities.map((c) => ({ '@type': 'City', name: `${c}, CA` })),
    ],
    openingHoursSpecification: site.hours.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.schemaDays, opens: h.open, closes: h.close })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Junk removal, light demolition and material delivery',
      itemListElement: services.map((sv) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: sv.name, url: abs(site, `/services/${sv.slug}/`) } })),
    },
  };
  if (site.email) s.email = site.email;
  const sameAs = [site.google.profileUrl, ...Object.values(site.social)].filter(Boolean);
  if (sameAs.length) s.sameAs = sameAs;
  return s;
}

export const breadcrumbSchema = (site, crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: abs(site, c.href) })),
});

export const faqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});

function tracking(site) {
  const t = site.tracking;
  let h = '';
  const gtagId = t.ga4Id || t.googleAdsId;
  if (gtagId) {
    h += `<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(gtagId)}"></script>`;
    h += `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${t.ga4Id ? `gtag('config','${esc(t.ga4Id)}');` : ''}${t.googleAdsId ? `gtag('config','${esc(t.googleAdsId)}');` : ''}</script>`;
  }
  if (t.metaPixelId) {
    h += `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${esc(t.metaPixelId)}');fbq('track','PageView');</script>`;
  }
  h += `<script>window.SHA=${JSON.stringify({ adsId: t.googleAdsId, leadLabel: t.googleAdsLeadLabel, callLabel: t.googleAdsCallLabel })};</script>`;
  return h;
}

function header(ctx, path) {
  const { site, nav } = ctx;
  const h = site.hours[0];
  const links = nav.map((n) => `<li><a href="${n.href}"${path.startsWith(n.href) ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`).join('');
  return `
<a class="skip" href="#main">Skip to content</a>
<div class="topbar">
  <div class="wrap topbar__in">
    <p>${icon('star', 'i i--sm i--fill')} <strong>${esc(site.google.rating)}</strong> on Google · ${site.google.reviewCount} reviews</p>
    <p class="hide-sm">${icon('pin', 'i i--sm')} Locally owned in ${esc(site.address.city)}, CA</p>
    <p class="hide-sm">${icon('clock', 'i i--sm')} ${esc(h.days)} ${fmtTime(h.open)}–${fmtTime(h.close)}</p>
  </div>
</div>
<header class="hdr">
  <div class="wrap hdr__in">
    <a class="hdr__logo" href="/" aria-label="${esc(site.name)}: home">
      <img src="/assets/img/logo-480.webp" srcset="/assets/img/logo-480.webp 480w, /assets/img/logo-960.webp 960w" sizes="200px" width="200" height="56" alt="${esc(site.name)}">
    </a>
    <nav class="hdr__nav" id="site-nav" aria-label="Main">
      <ul>${links}</ul>
      <div class="hdr__navcta">
        <a class="btn btn--gold btn--block" href="/quote/">Get a Free Quote</a>
        <a class="btn btn--line btn--block" href="${telHref(site)}" data-call>${icon('phone')} Call ${esc(site.phone)}</a>
      </div>
    </nav>
    <div class="hdr__actions">
      <a class="hdr__phone" href="${telHref(site)}" data-call>${icon('phone')}<span><small>Call or text</small>${esc(site.phone)}</span></a>
      <a class="btn btn--gold hdr__cta" href="/quote/">Free Quote</a>
      <button class="hdr__menu" type="button" aria-controls="site-nav" aria-expanded="false" data-menu>${icon('menu')}<span class="sr">Menu</span></button>
    </div>
  </div>
</header>`;
}

function footer(ctx) {
  const { site, services, groups, areas } = ctx;
  const col = (g) => `<div><h2 class="ftr__h">${esc(g.name)}</h2><ul class="ftr__list">${services.filter((s) => s.group === g.key)
    .map((s) => `<li><a href="/services/${s.slug}/">${esc(s.pillar ? `All ${g.name.toLowerCase()}` : s.name)}</a></li>`).join('')}</ul></div>`;
  const social = Object.entries({ Google: site.google.profileUrl, Facebook: site.social.facebook, Instagram: site.social.instagram, Yelp: site.social.yelp, Nextdoor: site.social.nextdoor })
    .filter(([, v]) => v).map(([k, v]) => `<li><a href="${esc(v)}" rel="noopener" target="_blank">${k}</a></li>`).join('');
  return `
<footer class="ftr">
  <div class="wrap ftr__grid">
    <div class="ftr__brand">
      <img src="/assets/img/logo-dark-480.webp" width="220" height="61" alt="${esc(site.name)}" loading="lazy">
      <p>Junk removal, light demolition and material delivery for Fullerton and North Orange County. Locally owned since ${esc(site.foundingYear)}.</p>
      <p class="ftr__nap">
        <a href="${telHref(site)}" data-call>${icon('phone', 'i i--sm')} ${esc(site.phone)}</a><br>
        <a href="${smsHref(site)}" data-sms>${icon('sms', 'i i--sm')} Text us a photo</a><br>
        ${site.email ? `<a href="mailto:${esc(site.email)}">${icon('mail', 'i i--sm')} ${esc(site.email)}</a><br>` : ''}
        ${icon('pin', 'i i--sm')} ${esc(site.address.city)}, ${esc(site.address.region)}
      </p>
      <ul class="ftr__hours">${site.hours.map((h) => `<li><span>${esc(h.days)}</span> ${fmtTime(h.open)}–${fmtTime(h.close)}</li>`).join('')}</ul>
    </div>
    ${groups.map(col).join('')}
    <div>
      <h2 class="ftr__h">Company</h2>
      <ul class="ftr__list">
        <li><a href="/pricing/">Pricing</a></li>
        <li><a href="/service-areas/">Service areas</a></li>
        <li><a href="/about/">About us</a></li>
        <li><a href="/quote/">Free quote</a></li>
        <li><a href="/contact/">Contact</a></li>
      </ul>
      ${social ? `<h2 class="ftr__h">Find us</h2><ul class="ftr__list">${social}</ul>` : ''}
    </div>
  </div>
  <div class="wrap ftr__areas"><p><strong>Serving:</strong> ${areas.map((a) => `<a href="/service-areas/${a.slug}/">${esc(a.name)}</a>`).join(' · ')} · and nearby Orange County cities</p></div>
  <div class="wrap ftr__legal">
    <p>© ${new Date().getFullYear()} ${esc(site.legalName)}. All rights reserved.</p>
    <p>Bigger demolition or concrete job? Our sister company <a href="${esc(site.sister.url)}" rel="noopener">${esc(site.sister.name)}</a> handles it.</p>
    <p><a href="/privacy/">Privacy Policy</a> · <a href="/sitemap.xml">Sitemap</a></p>
  </div>
</footer>
<div class="mbar" aria-label="Quick actions">
  <a class="mbar__a" href="${telHref(site)}" data-call>${icon('phone')} Call</a>
  <a class="mbar__a" href="${smsHref(site, 'Hi! I’d like a quote for junk removal. Here’s a photo:')}" data-sms>${icon('camera')} Text a photo</a>
  <a class="mbar__a mbar__a--gold" href="/quote/">${icon('tag')} Free quote</a>
</div>`;
}

export function breadcrumbs(crumbs) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${crumbs
    .map((c, i) => (i === crumbs.length - 1 ? `<li aria-current="page">${esc(c.label)}</li>` : `<li><a href="${c.href}">${esc(c.label)}</a></li>`))
    .join('')}</ol></nav>`;
}

export function layout(ctx, { path, title, description, body, schema = [], crumbs, noindex = false, bodyClass = '' }) {
  const { site, assetVersion } = ctx;
  const url = abs(site, path);
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
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">
<meta name="theme-color" content="#0F1B2D">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${abs(site, '/assets/img/og-default.png')}">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
${site.tracking.gscVerification ? `<meta name="google-site-verification" content="${esc(site.tracking.gscVerification)}">` : ''}
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/img/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/assets/css/main.css?v=${assetVersion}">
${tracking(site)}
${allSchema.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}
<script src="/assets/js/main.js?v=${assetVersion}" defer></script>
</head>
<body class="${bodyClass}${ctx.PROD ? '' : ' is-preview'}">
${header(ctx, path)}
<main id="main">
${body}
</main>
${footer(ctx)}
</body>
</html>
`;
}
