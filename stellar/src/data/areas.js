// City pages. Add a city only when you can say something genuinely local
// about it; a completed job there is the best starting point.
// `featured` = service slugs to highlight; `nearby` = other area slugs.

export const areas = [
  {
    slug: 'fullerton', name: 'Fullerton', home: true,
    intro: 'Fullerton is home base. Our trucks start every day here, so Fullerton customers get the quickest scheduling we offer.',
    local: 'We work all over town: the older homes around Downtown Fullerton and the SOCO district, Sunny Hills, Golden Hills and Raymond Hills, and the apartments around Cal State Fullerton and Fullerton College, where move-out season means a lot of mattresses and desks left behind.',
    neighborhoods: ['Downtown & SOCO', 'Sunny Hills', 'Golden Hills', 'Raymond Hills', 'Cal State Fullerton area', 'Fullerton College area', 'Coyote Hills'],
    featured: ['junk-removal', 'garage-cleanouts', 'estate-cleanouts', 'furniture-removal'],
    nearby: ['anaheim', 'placentia', 'brea', 'buena-park', 'la-habra'],
  },
  {
    slug: 'anaheim', name: 'Anaheim',
    intro: 'Right next door to Fullerton, Anaheim is one of our busiest service areas, from West Anaheim to the Colony to Anaheim Hills.',
    local: 'Anaheim Hills homes tend to have big garages, side yards and slopes, which means yard waste, hot tubs and playsets. Closer in, around the Anaheim Colony and West Anaheim, it’s more often garage clean-outs, furniture and rental turnovers.',
    neighborhoods: ['Anaheim Hills', 'Anaheim Colony', 'West Anaheim', 'Platinum Triangle', 'East Anaheim'],
    featured: ['junk-removal', 'hot-tub-removal', 'yard-waste-removal', 'estate-cleanouts'],
    nearby: ['fullerton', 'placentia', 'orange', 'yorba-linda', 'buena-park'],
  },
  {
    slug: 'placentia', name: 'Placentia',
    intro: 'Placentia borders Fullerton to the east, just a few minutes from our base.',
    local: 'From Old Town Placentia to the neighborhoods around Tri-City Park, we haul garage junk, old furniture and yard debris, and we deliver soil and mulch for weekend garden projects.',
    neighborhoods: ['Old Town Placentia', 'Tri-City Park area', 'Morse Ranch area', 'East Placentia'],
    featured: ['garage-cleanouts', 'yard-waste-removal', 'soil-mulch-delivery', 'furniture-removal'],
    nearby: ['fullerton', 'yorba-linda', 'brea', 'anaheim'],
  },
  {
    slug: 'brea', name: 'Brea',
    intro: 'Brea is just north of Fullerton on the 57, a quick trip from our base.',
    local: 'Brea homes, from the neighborhoods near Downtown Brea to Olinda Ranch and Brea Hills, call us for garage clean-outs, shed and fence removal, and gravel and DG for backyard projects.',
    neighborhoods: ['Downtown Brea', 'Olinda Ranch', 'Brea Hills', 'Country Hills'],
    featured: ['garage-cleanouts', 'shed-removal', 'fence-removal', 'gravel-rock-delivery'],
    nearby: ['fullerton', 'la-habra', 'placentia', 'yorba-linda'],
  },
  {
    slug: 'buena-park', name: 'Buena Park',
    intro: 'Buena Park borders Fullerton to the west, and we’re in town most weeks.',
    local: 'Lots of Buena Park homes are classic mid-century single-story houses with attached garages, perfect for garage clean-outs. Apartment and rental owners call us for fast move-out turnovers.',
    neighborhoods: ['Central Buena Park', 'Northwest Buena Park', 'Buena Park Mall area', 'Knott’s area'],
    featured: ['garage-cleanouts', 'estate-cleanouts', 'appliance-removal', 'junk-removal'],
    nearby: ['fullerton', 'anaheim', 'la-habra'],
  },
  {
    slug: 'la-habra', name: 'La Habra',
    intro: 'La Habra sits just north of Fullerton on Harbor Blvd, close enough for quick, flexible scheduling.',
    local: 'We help La Habra homeowners clear garages and backyards, remove old appliances and furniture, and get material delivered for DIY landscaping.',
    neighborhoods: ['Downtown La Habra', 'Westridge', 'La Habra Heights border', 'East La Habra'],
    featured: ['junk-removal', 'appliance-removal', 'yard-waste-removal', 'material-delivery'],
    nearby: ['fullerton', 'brea', 'buena-park'],
  },
  {
    slug: 'yorba-linda', name: 'Yorba Linda',
    intro: 'Yorba Linda’s larger lots and hillside homes mean bigger backyard projects, and we’re a short drive away.',
    local: 'Hot tubs, sheds, playsets, old fencing and big piles of yard debris are the most common Yorba Linda jobs, along with soil, mulch and decorative rock for landscaping.',
    neighborhoods: ['Vista del Verde', 'East Lake', 'Savi Ranch area', 'Old Town Yorba Linda'],
    featured: ['hot-tub-removal', 'shed-removal', 'yard-waste-removal', 'soil-mulch-delivery'],
    nearby: ['placentia', 'brea', 'anaheim'],
  },
  {
    slug: 'orange', name: 'Orange',
    intro: 'From Old Towne Orange to Orange Park Acres, we serve the whole city of Orange.',
    local: 'Old Towne’s historic homes often have detached garages full of decades of storage. Near Chapman University, move-outs leave furniture and mattresses that need a fast pickup.',
    neighborhoods: ['Old Towne Orange', 'Chapman University area', 'Orange Park Acres', 'El Modena', 'Orange Hills'],
    featured: ['garage-cleanouts', 'furniture-removal', 'estate-cleanouts', 'interior-tear-out'],
    nearby: ['anaheim', 'placentia', 'fullerton'],
  },
];

// Also served (no dedicated page yet).
export const otherCities = ['Garden Grove', 'Santa Ana', 'Tustin', 'Cypress', 'La Palma', 'Stanton', 'Westminster', 'Irvine', 'La Mirada', 'Whittier', 'Cerritos', 'Long Beach'];

export const areaBySlug = Object.fromEntries(areas.map((a) => [a.slug, a]));
