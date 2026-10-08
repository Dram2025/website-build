// ─────────────────────────────────────────────────────────────────────────────
// SITE CONFIGURATION — the single place to edit business details.
// Any value wrapped in [BRACKETS] is a placeholder. `npm run check` lists every
// remaining placeholder, and `npm run build:prod` refuses to build until they
// are filled in, so nothing unverified ever goes live.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  name: 'D.RAM Demolition & Hauling',
  shortName: 'D.RAM Demolition',
  url: 'https://www.dramdemo.com', // used for canonicals + sitemap; dramdemo.com redirects here
  phone: '714-872-6566',
  phoneE164: '+17148726566',
  email: 'david@dramdemo.com',

  // California Contractors State License Board. While `number` is empty the
  // site makes NO license claims and shows the not-licensed advertising
  // disclosure (Bus. & Prof. Code §7027.2) in the footer. When you're licensed,
  // fill these in — badges, schema and the "verify" link switch on automatically.
  license: {
    number: '', // e.g. '1234567'
    classification: '', // e.g. 'C-21 Building Moving/Demolition'
  },
  // Set to a description (e.g. 'General liability & workers’ compensation')
  // only once policies are active. Empty = no insurance claims anywhere.
  insurance: '',
  bonded: false,
  yearsExperience: '', // personal years of demolition experience, e.g. '10+' (empty = hidden)
  foundingYear: '2024',

  // Service-area business: leave street blank to hide it (Google allows hidden
  // addresses for SABs). City/region are still used in schema.
  address: {
    street: '',
    city: 'Fullerton',
    region: 'CA',
    postalCode: '',
    country: 'US',
  },
  geo: { lat: 33.8704, lng: -117.9242 }, // approximate (city center) — street address stays hidden

  hours: [
    { days: 'Monday – Friday', open: '07:00', close: '18:00', schemaDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
  ],

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
