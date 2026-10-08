// ─────────────────────────────────────────────────────────────────────────────
// PROJECT PORTFOLIO — one entry per completed job at /projects/<slug>/.
//
// The entries below marked `sample: true` are LAYOUT EXAMPLES ONLY. They show a
// visible "sample" banner in preview builds and are automatically excluded from
// production builds (`npm run build:prod`). Replace them with real jobs.
//
// Photos: put files in src/assets/photos/ named <slug>-before, <slug>-during,
// <slug>-after (.jpg / .webp / .png). Shoot before/after from the SAME spot.
// ─────────────────────────────────────────────────────────────────────────────

export const projects = [
  {
    sample: true,
    slug: 'fullerton-driveway-removal',
    title: 'Driveway & Walkway Removal',
    city: 'fullerton',
    service: 'driveway-removal',
    date: '2026-06',
    scope: 'Approx. 900 sq ft of 4–5 in. reinforced concrete driveway plus front walkway',
    equipment: ['Compact track loader', 'Walk-behind saw', 'Hydraulic breaker', '10-wheel dump truck'],
    summary:
      'A heaved and root-damaged driveway removed and hauled to recycling so the homeowner’s paver contractor could start the next morning.',
    challenge:
      'A mature parkway tree had lifted the driveway near the street, and the city sidewalk had to stay intact.',
    solution:
      'We saw-cut at the sidewalk joint, removed the driveway in sections working away from the tree, and exposed the roots for the homeowner’s arborist before hauling.',
    result: 'Level, clean subgrade handed to the paver installer; city sidewalk undamaged.',
    testimonial: null, // { quote: '…', name: 'First L.', role: 'Homeowner' } — real, permission-granted only
  },
  {
    sample: true,
    slug: 'anaheim-garage-demolition-adu',
    title: 'Detached Garage Demolition for ADU',
    city: 'anaheim',
    service: 'garage-demolition',
    date: '2026-04',
    scope: 'Approx. 400 sq ft wood-frame detached garage, slab and footings',
    equipment: ['Mini excavator', 'Skid steer', 'Roll-off bins', 'Dump truck'],
    summary:
      'A 1950s single-car garage removed down to dirt so the owner’s ADU builder could pour a new foundation.',
    challenge:
      'The garage sat against a property-line block wall shared with the neighbor, and the only access was a single driveway.',
    solution:
      'We pulled the structure inward, away from the wall, and staged loading on the driveway so the street stayed clear.',
    result: 'Pad rough-graded and ready for the ADU foundation; neighbor’s wall untouched.',
    testimonial: null,
  },
  {
    sample: true,
    slug: 'santa-ana-warehouse-slab',
    title: 'Warehouse Floor Slab Removal',
    city: 'santa-ana',
    service: 'concrete-slab-removal',
    date: '2026-02',
    scope: 'Approx. 2,500 sq ft section of 6 in. reinforced warehouse slab for new trench drains',
    equipment: ['Excavator with breaker', 'Concrete saw', 'Skid steer', 'Dump trucks'],
    summary:
      'Interior slab sections removed for a tenant improvement so the plumbing contractor could install new trench drains.',
    challenge:
      'The building remained partially occupied, and work had to happen without dust reaching the active side.',
    solution:
      'We sealed the work area with poly barriers, cut with water, and scheduled breaking and loading for early mornings before tenants arrived.',
    result: 'Slab removed on schedule and the work area handed to the plumbing contractor broom-clean.',
    testimonial: null,
  },
];
