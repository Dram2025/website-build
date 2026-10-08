# Launch Checklist

Work top to bottom. Items marked ⚑ block launch.

## Content & accuracy
- [ ] ⚑ All `[PLACEHOLDERS]` replaced. `npm run build:prod` succeeds.
- [ ] ⚑ CSLB license number and classification verified on cslb.ca.gov.
- [ ] ⚑ Insurance wording matches your actual policies.
- [ ] ⚑ Hours, base city and coordinates confirmed.
- [ ] ⚑ Sample projects replaced (or removed). Samples are automatically excluded from production.
- [ ] Owner story written on the About page.
- [ ] At least `home-hero`, the two audience photos and one photo per service added.
- [ ] Real Google reviews added to `reviews.js` (word-for-word, with permission).
- [ ] Every service page read once by the owner. Remove anything you don't actually do.
- [ ] Privacy policy reviewed (ideally by your attorney or insurance broker).

## Hosting & domain
- [ ] Netlify site connected to the GitHub repo. The build passes.
- [ ] Custom domain added, HTTPS certificate issued, `site.url` matches.
- [ ] Apex → www redirect works (`curl -I https://dramdemolition.com`).
- [ ] If replacing an old site: map old URLs → new URLs in `build.mjs` (`_redirects` section).

## Forms & lead routing
- [ ] Netlify → Forms shows `quick-estimate`, `estimate`, `commercial-bid` and `contact`.
- [ ] Netlify form notification email turned on (baseline backup).
- [ ] Resend domain verified. `RESEND_API_KEY`, `LEAD_FROM` and `LEAD_NOTIFY_TO` set.
- [ ] Twilio number registered for A2P 10DLC. `TWILIO_*` and `OWNER_SMS_TO` set.
- [ ] `CRM_WEBHOOK_URL` set (Zapier/Make → your CRM or a Google Sheet).
- [ ] Test each form on a phone: with photos, without photos, with SMS opt-in. Confirm the office email, customer email, SMS and CRM row all arrive.
- [ ] Test a commercial bid with a PDF upload and with a plans link.

## Tracking
- [ ] GA4 property created **in the company's Google account**. `ga4Id` set.
- [ ] GA4 → Admin → Events: mark `generate_lead` and `click_to_call` as **key events**.
- [ ] (If running ads) Google Ads conversions created for form leads and phone clicks. `googleAdsId` and labels set. GA4 linked to Ads.
- [ ] (Optional) Call tracking such as CallRail with dynamic number insertion **for ad traffic only**. Keep 714-872-6566 as the number in the HTML for NAP consistency.
- [ ] Confirm events in GA4 → Realtime / DebugView after a test lead.

## Search
- [ ] Google Search Console: add the domain property, verify (DNS, or set `gscVerification`).
- [ ] Submit `https://www.dramdemolition.com/sitemap.xml`.
- [ ] URL Inspection → request indexing for home, 14 services, 6 cities.
- [ ] Bing Webmaster Tools: import from Search Console.
- [ ] Rich Results Test on home, one service and one city page: no errors.
- [ ] PageSpeed Insights (mobile) on home and one service page. Target 90+.

## Google Business Profile
- [ ] Website URL updated with the GBP UTM link (see SEO-STRATEGY.md).
- [ ] Categories, services, service areas and hours match the site.
- [ ] Logo, cover photo and 10+ job photos uploaded.
- [ ] `site.social.googleBusiness` and `googleReviewLink` filled in → rebuild.

## After launch
- [ ] Week 1: check Search Console coverage. All service and city pages should be indexed.
- [ ] Monthly: add 2+ projects, request reviews from every finished job, check which pages generate leads.
- [ ] Quarterly: refresh FAQs from Search Console queries. Add a city page where you have real work.
