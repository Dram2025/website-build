# Photo Shot List

Your own crew, equipment and finished sites beat any stock photo. Customers can tell the difference, and so can Google. Shoot on a phone in landscape. Mornings and late afternoons give the best light. Keep logos and trucks visible, and keep faces and house numbers out unless you have permission.

## Must-have before launch
| File name | What to shoot |
|---|---|
| `home-hero.jpg` | Your best action shot: excavator or breaker mid-job, crew in PPE, truck with logo. Wide, landscape. (Optional: `home-hero.mp4`, a 6–10 s muted clip, under 4 MB.) |
| `audience-residential.jpg` | A home job, e.g. a driveway or patio removal in a neighborhood |
| `audience-commercial.jpg` | A commercial site: excavator, fencing, building or parking lot |
| `about-owner.jpg` | Owner on a job site (portrait orientation works) |
| `about-crew.jpg` | Crew lined up by the truck/equipment (optional hero for the About page) |
| `equipment-excavator.jpg`, `equipment-skidsteer.jpg`, `equipment-truck.jpg` | Clean shots of each machine type |

## Per service (names are listed in `src/data/services.js` → `photos`)
For each service, 2–3 photos: the work in progress and the finished result. Example: `driveway-removal-before.jpg`, `driveway-removal-during.jpg`, `driveway-removal-after.jpg`.

## Per project (`src/data/projects.js`)
| File | Tip |
|---|---|
| `<slug>-before.jpg` | Stand in one spot and note it, so the after shot matches |
| `<slug>-during.jpg` | Equipment working, dust control, protection in place |
| `<slug>-after.jpg` | Same spot and angle as the before shot. A clean, raked site sells. |

Matching before/after angles turn into a drag-to-compare slider on the site automatically.

## Optional city heroes
`city-fullerton.jpg`, `city-anaheim.jpg`, `city-orange.jpg`, `city-santa-ana.jpg`, `city-irvine.jpg`, `city-huntington-beach.jpg`: a job in that city.

## Processing
Put originals in `photos-raw/` and run `python3 scripts/prep_photos.py`. It resizes each photo, converts it to WebP and **removes GPS location data**. Then run `npm run build`.
