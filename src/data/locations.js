// ─────────────────────────────────────────────────────────────────────────────
// SERVICE-AREA PAGES — one page per priority city at /service-areas/<slug>/.
// Each page carries genuinely local information (housing stock, soils, permit
// office, typical jobs) rather than a city name swapped into a template.
// Add a city only when you can write something specific about it.
// ─────────────────────────────────────────────────────────────────────────────

export const locations = [
  {
    slug: 'fullerton',
    name: 'Fullerton',
    title: 'Demolition & Concrete Removal in Fullerton, CA | D.RAM Demolition',
    description:
      'Fullerton demolition contractor for driveway removal, concrete demolition, garage tear-downs and hauling. Local crew, free estimates. Call 714-872-6566.',
    h1: 'Demolition & Concrete Removal in Fullerton',
    lede: 'Fullerton is our home market. From pre-war bungalows near downtown to mid-century homes in Sunny Hills, we know the housing stock, the streets and the permit counter.',
    intro: [
      'Fullerton has one of the most varied collections of homes in north Orange County. Neighborhoods close to downtown and the old Santa Fe depot include houses from the 1910s through the 1940s, many with detached garages on alleys and original concrete walks. Sunny Hills, Raymond Hills and the Golden Hills area are full of post-war and mid-century homes on larger, sloped lots, while Amerige Heights and the newer northwest tracts were built in the 2000s.',
      'That variety shows up in our work. Older central Fullerton lots generate detached-garage demolitions for ADUs and driveway replacements where tree roots have lifted the slab; the hillside neighborhoods produce patio, pool-deck and retaining-wall removals on sloped lots; and rental properties near Cal State Fullerton bring steady work for property managers turning units over.',
    ],
    considerations: [
      ['Historic preservation areas', 'Fullerton has designated preservation zones and local landmarks. Demolition or major exterior changes to properties in those areas may require additional review — check with the city before planning to remove a structure.'],
      ['Mature street trees', 'Many established Fullerton streets have large parkway trees whose roots lift driveways and walks. We saw-cut cleanly and expose roots for your arborist rather than tearing through them.'],
      ['Hillside access', 'Sloped lots in Sunny Hills and the Fullerton hills often need compact equipment and careful material handling from backyard to street.'],
    ],
    permitOffice: 'City of Fullerton Community & Economic Development Department — Building & Safety Division',
    neighborhoods: ['Downtown Fullerton', 'Sunny Hills', 'Raymond Hills', 'Golden Hills', 'Amerige Heights', 'Coyote Hills', 'East Fullerton', 'Fullerton College & CSUF area'],
    zips: ['92831', '92832', '92833', '92835'],
    featured: ['driveway-removal', 'garage-demolition', 'patio-removal', 'retaining-wall-removal'],
    nearby: ['anaheim', 'orange'],
    faqs: [
      ['Do you have a crew based near Fullerton?', 'Yes — Fullerton and the surrounding north Orange County cities are our primary service area, which means quicker estimate visits and easier scheduling.'],
      ['Can you demolish a detached garage in central Fullerton for an ADU?', 'Yes. Detached garage removal for ADUs is one of our most common Fullerton jobs. We coordinate the demolition permit and asbestos survey and leave a clean pad for your builder.'],
    ],
  },
  {
    slug: 'anaheim',
    name: 'Anaheim',
    title: 'Anaheim Demolition Contractor | Concrete Removal | D.RAM Demolition',
    description:
      'Anaheim demolition and concrete removal — from west Anaheim tract homes to Anaheim Hills slopes and commercial sites. Free estimates. Call 714-872-6566.',
    h1: 'Demolition Contractor in Anaheim',
    lede: 'Orange County’s largest city covers everything from 1950s flat-lot tracts to Anaheim Hills slopes and active commercial redevelopment. We work across all of it.',
    intro: [
      'Anaheim is really several different markets. West and central Anaheim are dominated by post-war single-story tract homes on flat lots — the kind of houses that are now being expanded, rebuilt or given an ADU in the back yard. Anaheim Hills, east of the 55, is hillside living: tiered back yards, pool decks, and retaining walls that are reaching the end of their service life.',
      'And Anaheim keeps building. Redevelopment around the Platinum Triangle near the stadium and the Honda Center, along with commercial turnover throughout the city, creates steady demand for commercial demolition, interior strip-outs and site concrete removal. We bid that work for general contractors and property owners across the city.',
    ],
    considerations: [
      ['Anaheim Hills slopes', 'Hillside lots often mean limited equipment access and retaining walls that support the yard. Removal is planned around soil stability and access from above or below.'],
      ['Historic Anaheim Colony', 'The original Anaheim Colony area around downtown includes some of the oldest homes in the county. Properties there may be subject to historic review before exterior demolition.'],
      ['Commercial redevelopment', 'Commercial demolition in active districts means traffic control, coordinated haul routes and tight schedules — we plan for them in the bid.'],
    ],
    permitOffice: 'City of Anaheim Planning & Building Department — Building Division',
    neighborhoods: ['West Anaheim', 'Central Anaheim', 'Anaheim Colony', 'Anaheim Hills', 'Platinum Triangle', 'Anaheim Resort District', 'East Anaheim', 'Canyon area'],
    zips: ['92801', '92802', '92804', '92805', '92806', '92807', '92808'],
    featured: ['concrete-demolition', 'residential-demolition', 'retaining-wall-removal', 'commercial-demolition'],
    nearby: ['fullerton', 'orange', 'santa-ana'],
    faqs: [
      ['Do you work in Anaheim Hills?', 'Yes. We regularly remove patios, pool decks and retaining walls on Anaheim Hills hillside lots, using compact equipment sized for limited access.'],
      ['Can you bid commercial demolition in Anaheim?', 'Yes. Send plans and a site address through our commercial bid form and we will walk the site and return a written bid.'],
    ],
  },
  {
    slug: 'orange',
    name: 'Orange',
    title: 'Demolition Contractor in Orange, CA | Concrete Removal | D.RAM',
    description:
      'Demolition and concrete removal in the City of Orange — Old Towne, Orange Park Acres, East Orange and beyond. Permit-aware, free estimates. Call 714-872-6566.',
    h1: 'Demolition & Concrete Removal in Orange, CA',
    lede: 'From Old Towne’s historic district to Orange Park Acres’ large lots and the hillside homes of East Orange, the City of Orange asks for a careful, permit-aware contractor.',
    intro: [
      'The City of Orange is home to Old Towne, one of the largest historic districts in California and listed on the National Register of Historic Places. Inside the district, demolition of a contributing structure — and many exterior changes — goes through design review. That does not mean nothing can change, but it does mean the paperwork comes before the excavator.',
      'Outside Old Towne, Orange is mostly a mix of post-war neighborhoods on flat lots, the semi-rural equestrian properties of Orange Park Acres, and newer hillside homes in East Orange. Large-lot properties generate a lot of flatwork, barn-slab and outbuilding removal, while hillside homes bring patio and retaining-wall work.',
    ],
    considerations: [
      ['Old Towne Historic District', 'Demolition of contributing structures in Old Towne requires review by the city. If your property is in the district, confirm with the city’s planning division before planning demolition.'],
      ['Large lots in Orange Park Acres', 'Large parcels often have long driveways, outbuildings, arena slabs and old fencing footings. We size equipment and trucks for bigger, rural-style sites.'],
      ['Chapman University area rentals', 'Rental properties near Chapman see frequent turnover and repair work; we schedule around tenants for property managers.'],
    ],
    permitOffice: 'City of Orange Community Development Department — Building Division & Planning Division',
    neighborhoods: ['Old Towne Orange', 'Orange Park Acres', 'East Orange', 'Orange Hills', 'Santiago Hills', 'El Modena', 'Olive', 'Chapman University area'],
    zips: ['92865', '92866', '92867', '92868', '92869'],
    featured: ['driveway-removal', 'concrete-demolition', 'garage-demolition', 'block-wall-demolition'],
    nearby: ['anaheim', 'santa-ana', 'irvine'],
    faqs: [
      ['Can you demolish a structure in Old Towne Orange?', 'If the structure is a contributing building in the historic district, demolition requires city review first. We are happy to perform the work once approvals are in place, and we can handle non-structural concrete and hauling work in the district that does not need that review.'],
      ['Do you work on large properties in Orange Park Acres?', 'Yes. We remove long driveways, outbuilding slabs, old foundations and fencing footings on larger parcels.'],
    ],
  },
  {
    slug: 'santa-ana',
    name: 'Santa Ana',
    title: 'Santa Ana Demolition & Concrete Removal Contractor | D.RAM',
    description:
      'Santa Ana demolition contractor: residential tear-downs, commercial and industrial demolition, concrete removal and hauling. Call 714-872-6566.',
    h1: 'Demolition & Concrete Removal in Santa Ana',
    lede: 'Santa Ana’s historic neighborhoods, dense residential streets and industrial south side each need a different approach to demolition — we bring the right one.',
    intro: [
      'As the county seat and one of Orange County’s oldest cities, Santa Ana has a deep stock of early-1900s homes in neighborhoods like French Park, Floral Park, Washington Square and Wilshire Square, alongside dense post-war neighborhoods and multi-family properties. Lots are often narrow, streets are full of parked cars, and alley access is common.',
      'South Santa Ana and the areas along the 55 and 5 freeways are heavily commercial and industrial. Warehouse floor-slab removal, interior office strip-outs, parking-lot asphalt and site concrete are regular work there, often for property owners repositioning older buildings for new tenants.',
    ],
    considerations: [
      ['Historic register properties', 'Santa Ana maintains a local register of historical properties and several historic districts. Listed properties may require review before demolition.'],
      ['Tight residential access', 'Narrow lots and crowded streets call for smaller equipment, alley loading and well-planned truck staging.'],
      ['Industrial slabs', 'Older industrial buildings often have thick, heavily reinforced floor slabs and pits. We price those from a site walk, never a guess.'],
    ],
    permitOffice: 'City of Santa Ana Planning & Building Agency — Building Safety Division',
    neighborhoods: ['French Park', 'Floral Park', 'Washington Square', 'Wilshire Square', 'Downtown Santa Ana', 'Riverview', 'South Coast Metro', 'Industrial South Santa Ana'],
    zips: ['92701', '92703', '92704', '92705', '92706', '92707'],
    featured: ['commercial-demolition', 'selective-demolition', 'concrete-slab-removal', 'debris-hauling'],
    nearby: ['orange', 'irvine', 'anaheim', 'huntington-beach'],
    faqs: [
      ['Do you do commercial and industrial demolition in Santa Ana?', 'Yes. We handle interior strip-outs, floor-slab removal, parking-lot asphalt and site concrete for property owners and general contractors in Santa Ana’s commercial and industrial areas.'],
      ['Can you work on a narrow lot with no driveway access?', 'Usually. We use compact equipment, alley access where available, and hand-loading where necessary.'],
    ],
  },
  {
    slug: 'irvine',
    name: 'Irvine',
    title: 'Irvine Demolition Contractor | Residential & Commercial | D.RAM',
    description:
      'Demolition in Irvine for homeowners, HOAs and commercial tenants — HOA-compliant hardscape removal, interior remodel demolition and TI strip-outs. Call 714-872-6566.',
    h1: 'Demolition Contractor in Irvine',
    lede: 'In master-planned Irvine, demolition is as much about HOA approvals, quiet hours and clean job sites as it is about concrete. We work the way Irvine communities expect.',
    intro: [
      'Irvine is one of the largest master-planned cities in the country, organized into villages with homeowner associations that review exterior changes. If you are replacing a backyard patio, removing a block wall or redoing a driveway, your HOA’s architectural committee will often need to approve the plan before work begins. We provide the scope details your application needs.',
      'Irvine homes were largely built from the 1970s onward, so they share features that affect demolition: post-tensioned slabs are common, and interior remodels typically involve modern drywall, tile and cabinetry rather than plaster and lath. On the commercial side, the Irvine Business Complex, Spectrum and office parks across the city see constant tenant turnover, and tenant-improvement demolition is regular work there.',
    ],
    considerations: [
      ['HOA architectural approval', 'Most Irvine villages require HOA approval for exterior hardscape and wall changes. We provide a written scope and timeline for your application.'],
      ['Post-tensioned slabs', 'Many Irvine homes and buildings are on post-tension slabs. We check for cables before cutting or breaking any slab.'],
      ['Tenant-improvement work', 'Office and retail TI demolition is scheduled around building hours, freight elevators and property-management rules.'],
    ],
    permitOffice: 'City of Irvine Community Development Department — Building & Safety',
    neighborhoods: ['Woodbridge', 'Northwood', 'University Park', 'Turtle Rock', 'Westpark', 'Portola Springs', 'Great Park Neighborhoods', 'Irvine Business Complex', 'Irvine Spectrum'],
    zips: ['92602', '92603', '92604', '92606', '92612', '92614', '92618', '92620'],
    featured: ['selective-demolition', 'patio-removal', 'concrete-slab-removal', 'commercial-demolition'],
    nearby: ['santa-ana', 'orange', 'huntington-beach'],
    faqs: [
      ['Do I need HOA approval to remove my patio in Irvine?', 'Often yes, especially if the replacement changes how the yard looks from the street or neighbors’ properties. Check your HOA’s architectural guidelines; we can supply the scope details you need.'],
      ['Do you do tenant-improvement demolition in Irvine office buildings?', 'Yes. We strip office, retail and restaurant suites to the extent shown on the TI plans and work within building rules and hours.'],
    ],
  },
  {
    slug: 'huntington-beach',
    name: 'Huntington Beach',
    title: 'Huntington Beach Demolition & Concrete Removal | D.RAM Demolition',
    description:
      'Demolition and concrete removal in Huntington Beach — coastal homes, garage tear-downs, patio and driveway removal. Salt-air concrete experience. Call 714-872-6566.',
    h1: 'Demolition & Concrete Removal in Huntington Beach',
    lede: 'Coastal demolition comes with its own conditions — salt-damaged concrete, sandy soils, Coastal Zone rules and tight beach-area lots. We plan for all of them.',
    intro: [
      'Huntington Beach has large neighborhoods of 1960s and 1970s tract homes inland, older cottages and newer rebuilds near downtown, and waterfront homes in Huntington Harbour. The common thread for demolition is the coast: salt air corrodes the steel inside concrete over decades, which is why so many patios, driveways and walls near the beach show rust staining, spalling and cracking.',
      'Properties within the California Coastal Zone can require a coastal development permit for certain work, including some demolition, in addition to a standard city permit. Near-coast lots also tend to have sandy soils and, in some low-lying areas, shallow groundwater — both of which matter if your project involves excavation after demolition.',
    ],
    considerations: [
      ['Coastal Zone permits', 'Portions of Huntington Beach lie within the Coastal Zone. Check with the city whether your project needs a coastal development permit before planning demolition.'],
      ['Corroded reinforcement', 'Salt air rusts rebar inside concrete, causing spalling. That concrete often breaks out differently and has more steel to separate and recycle.'],
      ['Beach-area access', 'Narrow streets, alley-loaded lots and summer traffic near downtown call for careful truck scheduling.'],
    ],
    permitOffice: 'City of Huntington Beach Community Development Department — Building & Safety Division',
    neighborhoods: ['Downtown Huntington Beach', 'Huntington Harbour', 'Seacliff', 'Huntington Seacliff', 'Southeast Huntington Beach', 'Central Park area', 'Bolsa Chica area'],
    zips: ['92646', '92647', '92648', '92649'],
    featured: ['garage-demolition', 'patio-removal', 'driveway-removal', 'residential-demolition'],
    nearby: ['santa-ana', 'irvine'],
    faqs: [
      ['Do I need a coastal permit to demolish in Huntington Beach?', 'It depends on where the property is and what is being removed. Properties in the Coastal Zone may need a coastal development permit in addition to a city demolition permit. Check with the city’s planning division early.'],
      ['Why is the concrete near my house cracking and showing rust?', 'Salt air causes the reinforcing steel inside concrete to rust and expand, which cracks and spalls the surface. Once it is widespread, replacement is usually more practical than repair.'],
    ],
  },
];

// Cities served without a dedicated page (yet). Write a page only when you can
// add genuinely local content — a completed project there is the best start.
export const otherCities = [
  'Aliso Viejo', 'Brea', 'Buena Park', 'Costa Mesa', 'Cypress', 'Dana Point', 'Fountain Valley',
  'Garden Grove', 'La Habra', 'La Palma', 'Laguna Beach', 'Laguna Hills', 'Laguna Niguel', 'Laguna Woods',
  'Lake Forest', 'Los Alamitos', 'Mission Viejo', 'Newport Beach', 'Placentia', 'Rancho Santa Margarita',
  'San Clemente', 'San Juan Capistrano', 'Seal Beach', 'Stanton', 'Tustin', 'Villa Park', 'Westminster',
  'Yorba Linda',
  // unincorporated communities
  'Coto de Caza', 'Ladera Ranch', 'Midway City', 'North Tustin', 'Rancho Mission Viejo', 'Rossmoor',
].sort();

// Neighboring Southern California markets — by arrangement.
export const regionalMarkets = ['Whittier', 'La Mirada', 'Long Beach', 'Cerritos', 'Chino Hills', 'Corona'];

export const locBySlug = Object.fromEntries(locations.map((l) => [l.slug, l]));
