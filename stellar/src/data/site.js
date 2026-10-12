// ─────────────────────────────────────────────────────────────────────────────
// SITE CONFIGURATION: the one place to edit business details.
// Anything listed in `confirm` below is printed by every build as a reminder to
// double-check it before launch. Leave a value '' to hide it everywhere.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  name: 'Stellar Haul Away',
  legalName: 'Stellar Haul Away LLC',
  url: 'https://stellarhaulaway.com', // ← change to your real domain before launch
  phone: '(714) 872-6566',
  phoneE164: '+17148726566',
  email: '', // e.g. 'hello@stellarhaulaway.com'; empty = hidden (the contact form still works)
  foundingYear: '2024',

  // Service-area business: street stays hidden (matches the Google profile).
  address: { street: '', city: 'Fullerton', region: 'CA', postalCode: '', country: 'US' },
  geo: { lat: 33.8704, lng: -117.9242 }, // city centre, not your home

  // Google shows "Opens 8 AM Mon". Confirm the closing time and Saturday hours.
  hours: [
    { days: 'Monday – Saturday', open: '08:00', close: '18:00', schemaDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
  ],

  // From the Google Business Profile. Update as reviews come in.
  google: {
    rating: '5.0',
    reviewCount: 5,
    profileUrl: '', // "Share" link from the profile, e.g. https://g.page/r/XXXX
    reviewLink: '', // "Ask for reviews" link from the profile
  },

  social: { facebook: '', instagram: '', yelp: '', nextdoor: '' },

  // Sister company: bigger concrete and structural jobs get referred here.
  sister: { name: 'D.RAM Demolition & Hauling', url: 'https://dramdemo.com' },

  // Optional starting prices by load size. '' = "Text a photo for a price".
  // Only enter prices you actually charge.
  pricing: {
    minimum: '', // e.g. '$99'
    quarter: '',
    half: '',
    threeQuarter: '',
    full: '',
  },

  tracking: {
    ga4Id: '', // G-XXXXXXXXXX
    googleAdsId: '', // AW-XXXXXXXXX
    googleAdsLeadLabel: '',
    googleAdsCallLabel: '',
    metaPixelId: '',
    gscVerification: '',
  },

  // Printed by every build until you've checked each one.
  confirm: [
    'site.url: the real domain',
    'site.hours: closing time and Saturday hours',
    'site.email: business email (optional)',
    'site.google.profileUrl / reviewLink: from the Google Business Profile',
    'Donation & recycling wording (home, pricing, about): keep only if true',
    'Photos: add real job photos to photos-raw/ and run scripts/prep_photos.py',
  ],
};

export const nav = [
  { label: 'Junk Removal', href: '/services/junk-removal/' },
  { label: 'Light Demolition', href: '/services/light-demolition/' },
  { label: 'Material Delivery', href: '/services/material-delivery/' },
  { label: 'Pricing', href: '/pricing/' },
  { label: 'Service Areas', href: '/service-areas/' },
  { label: 'About', href: '/about/' },
];
