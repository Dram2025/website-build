# Stellar Haul Away: Website

A lead-generation website for **Stellar Haul Away** (Fullerton, CA): junk removal, light demolition and material delivery. It uses the same no-framework static approach as the D.RAM Demolition site in the parent folder, with its own design, content, logo and Netlify site.

| | |
|---|---|
| **Pages** | 33: home, services hub, 15 service pages in 3 groups (Junk Removal, Light Demolition, Material Delivery), pricing, service-area hub + 8 city pages, about, quote, contact, privacy, thank-you, 404 |
| **Lead capture** | Quick quote form (hero + every service and city page), full quote form with photo upload, contact form, tap-to-call, and **"Text a photo"** buttons that open a pre-filled text message |
| **Tracking** | GA4, Google Ads and Meta Pixel hooks: click-to-call, click-to-text, form start, lead conversion, first-touch UTM + gclid on every lead |
| **SEO** | Unique titles/descriptions, canonicals, LocalBusiness + Service + FAQPage + Breadcrumb schema, sitemap, robots.txt, friendly 301 redirects |

## Quick start

```bash
cd stellar
npm run build        # preview build → dist/ (labels empty photo slots)
npm run serve        # http://localhost:4174 (forms simulate success on localhost)
npm test             # build + link/SEO audit
npm run build:prod   # production build (empty photo slots become branded tiles)
```

Requires Node 18+. There's nothing to install.

## Before launch

Every build prints a reminder list (`site.confirm` in `src/data/site.js`). Work through it:

1. **Domain**: set `site.url` to the real domain.
2. **Hours**: Google shows "Opens 8 AM Mon". Confirm the closing time and whether you work Saturdays.
3. **Google profile links**: paste the profile's *Share* link into `google.profileUrl` and the *Ask for reviews* link into `google.reviewLink`. Update `rating`/`reviewCount` as reviews come in.
4. **Reviews**: paste your Google reviews word for word into `src/data/reviews.js`. A reviews section appears automatically.
5. **Prices (optional)**: if you want "from $___" on the load-size cards, fill in `site.pricing`. Empty = "Text a photo for a price".
6. **Donation/recycling wording**: the home, pricing and about pages say usable items are donated and metal, cardboard and green waste are recycled when possible. Keep it only if that's true.
7. Remove items from `site.confirm` as you finish them.

## Photos

The site has a named slot for every photo. Empty slots show a branded navy-and-gold tile, so nothing looks broken, but **real job photos are the most valuable thing you can add**.

1. Put photos in `stellar/photos-raw/`, named after the slot (e.g. `garage-cleanout-before.jpg`, `home-about.jpg`, `home-hero.jpg`).
2. From `stellar/`, run `python3 scripts/prep_photos.py` (resizes, converts to WebP and **strips GPS data**).
3. Rebuild. The build lists any slots still empty.

Slot names: `home-hero` (optional, sits behind the homepage headline), `home-about`, `about-team`, `area-<city>` (optional), plus each service's `photos` list in `src/data/services.js`. Google Business Profile photos have to be downloaded from the profile by you (Google doesn't allow them to be pulled automatically).

## Editing content

| To change… | Edit |
|---|---|
| Phone, hours, links, prices, tracking IDs | `src/data/site.js` |
| Service pages (text, lists, FAQs, photo slots) | `src/data/services.js` |
| City pages | `src/data/areas.js` |
| Reviews | `src/data/reviews.js` |
| Layout / sections | `src/templates/*.js` |
| Colors & styles | `src/assets/css/main.css` (tokens at the top) |

## The logo

The new logo is a **shooting star** (junk gone in a flash) in midnight navy and gold, with a bold **STELLAR / HAUL AWAY** wordmark. "LLC" is dropped from the logo; the legal name stays in the footer and privacy policy.

- Sources: `brand/*.svg` (they use the Inter Display font; the PNG exports don't need it).
- Ready-to-use files in `brand/exports/`:
  - `google-profile-720.png`: Google Business Profile logo
  - `logo-square-1200.png` / `logo-square-dark-1200.png`: Facebook/Instagram profile picture, print
  - `logo-horizontal-1440.png` / `logo-horizontal-dark-1440.png`: truck decals, flyers, invoices
  - `logo-landscape-1200x628.png`, `logo-wide-1200x300.png`: Google Ads logo assets
  - `icon-512.png`, `apple-touch-icon.png`, `favicon-64.png`
- To change colors or spacing, edit `brand/make-logo.mjs` and run `PLAYWRIGHT_PATH=/path/to/playwright node brand/make-logo.mjs`. It regenerates every export and the website copies.

Colors: navy `#0F1B2D`, gold `#F5B82E`, cream `#FFF8EC`. Fonts: Inter Tight (headings), Inter (body).

## Hosting (Netlify)

This lives in the same GitHub repo as D.RAM but deploys as a **separate Netlify site**:

1. Netlify → *Add new site → Import from GitHub* → pick this repo.
2. Set **Base directory** to `stellar`. Netlify then reads `stellar/netlify.toml` (build `npm run build:prod`, publish `dist`).
3. Add your domain under *Domain management*, then update `site.url`.
4. **Forms**: Netlify detects the `quick-quote`, `quote` and `contact` forms automatically. Turn on email notifications under *Forms → Notifications* so every lead lands in your inbox (and phone).

Each site only rebuilds when its own files change: D.RAM ignores `stellar/`, and Stellar ignores everything outside it.
