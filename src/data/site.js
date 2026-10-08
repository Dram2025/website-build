// ─────────────────────────────────────────────────────────────────────────────
// SITE CONFIGURATION — the single place to edit business details.
// Any value wrapped in [BRACKETS] is a placeholder. `npm run check` lists every
// remaining placeholder, and `npm run build:prod` refuses to build until they
// are filled in, so nothing unverified ever goes live.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  name: 'D.RAM Demolition & Hauling',
  shortName: 'D.RAM Demolition',
  url: 'https://www.dramdemolition.com', // [CONFIRM DOMAIN] — used for canonicals + sitemap
  phone: '714-872-6566',
  phoneE164: '+17148726566',
  email: '[LEAD EMAIL, e.g. estimates@dramdemolition.com]',

  // California Contractors State License Board. Shown in header trust bar,
  // footer, and schema. Verify at https://www.cslb.ca.gov/
  license: {
    number: '[CSLB LICENSE #]',
    classification: '[LICENSE CLASS, e.g. C-21 Building Moving/Demolition]',
  },
  insurance: 'General liability & workers’ compensation', // certificates available on request
  yearsExperience: '[YEARS]', // e.g. "15+"
  foundingYear: '[YEAR FOUNDED]',

  // Service-area business: leave street blank to hide it (Google allows hidden
  // addresses for SABs). City/region are still used in schema.
  address: {
    street: '',
    city: 'Fullerton', // [CONFIRM base city]
    region: 'CA',
    postalCode: '',
    country: 'US',
  },
  geo: { lat: 33.8704, lng: -117.9242 }, // [CONFIRM] approximate base location

  hours: [
    { days: 'Monday – Friday', open: '07:00', close: '18:00', schemaDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    { days: 'Saturday', open: '08:00', close: '14:00', schemaDays: ['Saturday'] },
  ], // [CONFIRM HOURS]

  // Profiles — leave '' to hide. Google Business Profile is the most important.
  social: {
    googleBusiness: '', // e.g. https://g.page/r/XXXX
    googleReviewLink: '', // "Write a review" short link from GBP
    yelp: '',
    facebook: '',
    instagram: '',
    nextdoor: '',
  },

  // Analytics & conversion tracking (leave '' to disable).
  tracking: {
    ga4Id: '', // G-XXXXXXXXXX
    gtmId: '', // GTM-XXXXXXX (optional; use instead of / alongside GA4)
    googleAdsId: '', // AW-XXXXXXXXX
    googleAdsLeadLabel: '', // conversion label for form leads
    googleAdsCallLabel: '', // conversion label for phone-click
    gscVerification: '', // Google Search Console HTML-tag token
  },

  // Rating summary is only rendered when real reviews exist in reviews.js.
  serviceRadiusMiles: 35,
};

export const nav = [
  { label: 'Residential', href: '/residential/' },
  { label: 'Commercial', href: '/commercial/' },
  { label: 'Services', href: '/services/' },
  { label: 'Service Areas', href: '/service-areas/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'About', href: '/about/' },
];
