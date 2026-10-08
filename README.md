# D.RAM Demolition & Hauling — Website

A lead-generation website for an Orange County demolition contractor. It is built to rank in Google, earn trust quickly, and turn visitors into estimate requests. It's a static site with no framework and no runtime dependencies. It's fast, cheap to host, and you own it outright.

| | |
|---|---|
| **Pages** | 36: home, 14 service pages, 6 city pages, services and service-area hubs, residential and commercial journeys, estimate, commercial bid, projects (hub + one page per project), about, contact, privacy, thank-you, 404 |
| **Lead capture** | Quick form (hero/sidebars), 3-step estimate form with photo upload, commercial bid form with plan uploads, contact form |
| **Lead routing** | Netlify Forms → `submission-created` function: lead scoring, office email, customer confirmation email/SMS, owner SMS for hot leads, CRM webhook |
| **Tracking** | GA4 / GTM / Google Ads: click-to-call, form start, step progress, file attach, lead conversion (thank-you page), first-touch UTM + gclid on every lead |
| **SEO** | Unique titles/meta, canonicals, LocalBusiness + Service + FAQPage + BreadcrumbList schema, XML sitemap, robots.txt, 301 redirects, internal service↔city linking |

---

## Quick start

```bash
npm run build        # preview build → dist/  (shows photo slots + sample projects)
npm run serve        # http://localhost:4173  (forms simulate success on localhost)
npm test             # build + SEO/link audit
npm run build:prod   # production build — FAILS until every [PLACEHOLDER] is filled in
```

Requires Node 18+. There's nothing to `npm install`.

## Before launch: fill in your details

Everything business-specific is in **`src/data/site.js`**. Values in `[BRACKETS]` are placeholders. The build lists every remaining one, and the production build refuses to run until they're all replaced, so no unverified claim can go live by accident.

1. **`site.js`**: CSLB license # and class, lead email, years in business, founding year, hours, domain, base city/coordinates, Google Business Profile and social links, GA4/Ads IDs.
2. **`src/templates/pages.js` → `about()`**: replace `[OWNER STORY …]` with your own story.
3. **`src/data/projects.js`**: replace the three `sample: true` projects with real jobs. Samples are excluded from production automatically.
4. **`src/data/reviews.js`**: paste real Google reviews word-for-word. The reviews section and star-rating schema stay hidden until this has entries.
5. **Photos**: see below.

## Photos (the most valuable thing on this site)

The site has a named slot for every photo. A slot with no file shows a labelled placeholder in preview builds and a plain branded tile in production. The build prints the full list of empty slots.

1. Put originals in `photos-raw/`, named to match the slot (e.g. `driveway-removal-before.jpg`, `home-hero.jpg`).
2. Run `python3 scripts/prep_photos.py`. This resizes each photo, converts it to WebP and **strips GPS/EXIF data** (it protects customers' addresses).
3. Run `npm run build`.

Key slots: `home-hero` (or `home-hero.mp4` for a short muted video loop), `audience-residential`, `audience-commercial`, `about-owner`, `about-crew`, `equipment-*`, `city-<slug>` (optional city hero), each service's `photos` list in `services.js`, and `<project-slug>-before / -during / -after` for each project. Before/after pairs become a drag slider automatically. See [docs/PHOTO-SHOT-LIST.md](docs/PHOTO-SHOT-LIST.md).

## Editing content

| To change… | Edit |
|---|---|
| Phone, license, hours, links, tracking IDs | `src/data/site.js` |
| A service page's text, FAQs, process, photos | `src/data/services.js` |
| A city page | `src/data/locations.js` (also `otherCities`, `regionalMarkets`) |
| Portfolio | `src/data/projects.js` |
| Reviews | `src/data/reviews.js` |
| Page layouts | `src/templates/pages.js`, `components.js`, `layout.js` |
| Styling | `src/assets/css/main.css` (color tokens at the top) |
| Form behavior, tracking | `src/assets/js/main.js` |

**Adding a project:** copy an entry in `projects.js`, set `slug`, `city` (a location slug), `service` (a service slug), add `<slug>-before/-during/-after` photos and rebuild. The project shows up on the portfolio, the matching service page and the matching city page.

**Adding a city page:** add an entry to `locations` only when you can write genuinely local content for it. A completed job there is the best starting point.

## Hosting & deployment (Netlify)

`netlify.toml` is preconfigured. Connect the GitHub repo in Netlify and it runs `npm run build:prod` and publishes `dist/`. Deploy previews use the preview build.

- **Forms** are detected automatically (Netlify → Forms). Turn on email notifications there as a baseline.
- **Spam protection:** Netlify's built-in Akismet filtering, a honeypot field, and a minimum time-to-submit check.
- **Domain:** set the custom domain in Netlify and update `site.url`. The generated `_redirects` 301s the apex domain to `www`.

### Lead routing environment variables

Set these in Netlify → Site configuration → Environment variables. Each channel switches on independently.

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY`, `LEAD_FROM` | Sends email via [Resend](https://resend.com) (verify your domain there). `LEAD_FROM` e.g. `D.RAM Demolition <estimates@dramdemo.com>` |
| `LEAD_NOTIFY_TO` | Office inbox(es) for lead alerts, comma-separated |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` | Customer confirmation texts (opt-in only) + owner alerts. US numbers need A2P 10DLC registration. |
| `OWNER_SMS_TO` | Your cell, for instant alerts on **Hot** or **High value** leads |
| `CRM_WEBHOOK_URL` | Receives each lead as JSON: Zapier/Make → Jobber, HubSpot, Housecall Pro, Google Sheets, etc. |
| `BUSINESS_PHONE` | Phone shown in confirmations (defaults to 714-872-6566) |

Every lead is tagged **Residential/Commercial**, **Hot/Warm/Nurture** (timeline or bid date), a **value tier** (service + approximate area), and a **priority score** 0–100. The tags appear in the email subject line and in the CRM payload.

> Not on Netlify? The site is plain static files and works on any host. Point the forms' `fetch('/')` in `main.js` at your own form endpoint (Formspree, Basin, a serverless function) and reuse `scoreLead()` from the function.

## Ownership

You own everything in this repository: code, design, written content and generated graphics. Keep the domain registrar, Netlify, Google (Search Console, Analytics, Business Profile, Ads), Resend and Twilio accounts **in the company's name and under your login**, and add any agency as a user rather than an owner.

## More docs

- [docs/SEO-STRATEGY.md](docs/SEO-STRATEGY.md): keyword map, local SEO, link-building plan
- [docs/LAUNCH-CHECKLIST.md](docs/LAUNCH-CHECKLIST.md): step-by-step launch, Search Console, GA4, GBP, conversion setup
- [docs/PHOTO-SHOT-LIST.md](docs/PHOTO-SHOT-LIST.md): what to photograph and how
