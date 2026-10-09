# SEO Strategy — D.RAM Demolition

No one can honestly guarantee a #1 ranking. What this site does is give Google every legitimate reason to rank D.RAM: one strong page per search intent, real local content, clean technical SEO and a structure that grows as you add projects and reviews.

## 1. Keyword → page map

One primary intent per page. Don't create a second page for the same intent, because the two will compete with each other.

| Page | Primary query | Supporting queries |
|---|---|---|
| `/` | demolition contractor Orange County | demolition company OC, concrete removal Orange County, demolition near me |
| `/services/residential-demolition/` | residential demolition Orange County | house demolition, tear down house cost OC, home demolition contractor |
| `/services/commercial-demolition/` | commercial demolition contractor OC | building demolition Orange County, demolition subcontractor |
| `/services/selective-demolition/` | interior selective demolition contractor | interior demolition, tenant improvement demolition, remodel demo |
| `/services/concrete-demolition/` | concrete demolition Orange County | concrete removal, concrete breaking, concrete removal near me |
| `/services/driveway-removal/` | driveway removal near me | driveway demolition, remove concrete driveway, asphalt driveway removal |
| `/services/patio-removal/` | concrete patio demolition | patio removal, pool deck removal, backyard concrete removal |
| `/services/sidewalk-removal/` | sidewalk concrete removal | walkway removal, trip hazard concrete removal |
| `/services/concrete-slab-removal/` | concrete slab demolition contractor | slab removal, foundation removal, post tension slab demolition |
| `/services/garage-demolition/` | detached garage demolition | garage tear down, ADU site prep, shed demolition |
| `/services/block-wall-demolition/` | block wall removal contractor | cinder block wall demolition, masonry wall removal |
| `/services/retaining-wall-removal/` | retaining wall demolition | retaining wall removal, railroad tie wall removal |
| `/services/debris-hauling/` | construction debris removal | concrete hauling, dirt haul away, C&D debris hauling |
| `/services/chimney-demolition/` | chimney removal contractor | brick chimney removal, chimney demolition cost |
| `/services/asphalt-removal/` | asphalt demolition and hauling | parking lot asphalt removal, asphalt removal near me |
| `/service-areas/fullerton/` | demolition contractor Fullerton | driveway demolition Fullerton, concrete removal Fullerton |
| `/service-areas/anaheim/` | demolition contractor Anaheim | concrete removal Anaheim, Anaheim Hills retaining wall removal |
| `/service-areas/orange/` | demolition Orange CA | concrete removal Orange, Old Towne Orange demolition |
| `/service-areas/santa-ana/` | demolition contractor Santa Ana | commercial demolition Santa Ana, concrete removal Santa Ana |
| `/service-areas/irvine/` | demolition contractor Irvine | residential demolition Irvine, TI demolition Irvine |
| `/service-areas/huntington-beach/` | demolition Huntington Beach | garage demolition Huntington Beach, concrete removal HB |
| `/residential/` | (journey page) homeowner demolition | demolition cost factors, demolition contractor for homeowners |
| `/commercial/` | demolition subcontractor for general contractors | commercial demo sub Orange County |

**Next step with real data:** after 60–90 days, export queries from Search Console (Performance → Queries, filter by page). Add the questions people actually search to that page's FAQ, and tune titles where impressions are high but clicks are low.

## 2. On-page (already built)

- Unique `<title>` and meta description on every page. The audit (`npm test`) flags duplicates and bad lengths.
- One `<h1>` per page, with descriptive H2/H3 structure.
- Original copy per service and city (no city-name swapping).
- Structured data:
  - `HomeAndConstructionBusiness` on every page (NAP, hours, area served, offer catalog, CSLB credential once filled in, `aggregateRating` only when real reviews exist).
  - `Service` on service and city pages.
  - `FAQPage` and `BreadcrumbList`.
- Canonical URLs, XML sitemap, robots.txt, apex→www and legacy-URL 301s.
- Fast by default: static HTML, about 30 KB of CSS/JS, lazy-loaded images with explicit dimensions (no layout shift), one font family.

## 3. Internal linking

- Every service page links to all six city pages ("Driveway Removal in Fullerton").
- Every city page links to its four most relevant services with city-specific anchors, plus all other services.
- Related-service blocks connect services that are often done together.
- Projects link to their service and city. Service and city pages list their projects automatically.
- Footer links every service and city.

**When you add a project,** pick the right `service` and `city` slugs. Those links are created for you.

## 4. Google Business Profile (the biggest local lever)

1. Primary category: **Demolition contractor**. Secondary: Concrete contractor, Excavating contractor, Debris removal service (choose only ones you actually do).
2. Website link: `https://dramdemo.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp`. GA4 then separates GBP traffic, and the form captures it on every lead.
3. Services list: mirror the 14 service names.
4. Service areas: the cities you actually serve (max 20).
5. Name, phone and city must match the site exactly (NAP consistency).
6. Post photos weekly: before/after from every job.
7. **Reviews:** ask every satisfied customer the day the job wraps, with your GBP review short link (also put it in `site.social.googleReviewLink`). Reply to every review.

## 5. Local link-building plan (earned, not bought)

Aim for 2–4 quality local links a month. Relevance beats volume.

| Source | How |
|---|---|
| Citations (one-time) | Yelp, BBB, Angi, Houzz, Nextdoor business page, Bing Places, Apple Business Connect, Thumbtack. Use identical NAP everywhere. |
| Trade partners | Concrete, paver, pool, ADU and general contractors you work with. Ask to be listed as their recommended demo sub, and link to them in return on a "Partners" section. |
| Supplier/recycler pages | Recycling facilities and equipment dealers sometimes list contractors. |
| Associations | Chambers of commerce in Fullerton/Anaheim/Orange, Building Industry Association of Southern California (BIA/SC), local AGC chapter. |
| Community | Sponsor a youth team or school fundraiser (sponsor pages link out). |
| Content others cite | E.g. "What Orange County cities require for a demolition permit" or "Post-tension slab safety". Practical guides that realtors, ADU builders and HOAs link to. |
| Local press | Notable projects (historic-area work, large commercial jobs) → Patch, OC Register community sections. |

Avoid paid link packages and private blog networks. They risk a Google penalty.

## 6. Content roadmap (after launch)

1. **Projects first:** 10–20 documented jobs over the first 6 months. Each one adds a unique local page with photos.
2. A new city page only when you have real work and local knowledge there (Garden Grove, Costa Mesa, Placentia, Brea, Tustin, Yorba Linda are the likely next ones).
3. 4–6 genuinely useful guides answering questions customers ask on estimates: permits, cost factors, ADU site prep, pool barrier rules during wall removal.

## 7. Measure

- **Search Console:** impressions/clicks per page and query, indexing coverage.
- **GA4:** `generate_lead` (by `form_name`), `click_to_call`, `form_start`, `estimate_step`. Mark `generate_lead` and `click_to_call` as **key events**.
- **CRM:** every lead carries `landingPage`, `utm_*`, `gclid` and `heardFrom`, so you can tie closed jobs back to channels and pages.
- Review monthly: which pages produce leads (not just traffic), and which leads become jobs.
