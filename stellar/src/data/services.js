// Services, grouped into three lines of work. Each group has a "pillar" page
// (junk-removal, light-demolition, material-delivery) that lists its children.
//
// Fields: slug, group, name, icon, short (card text), title + description
// (SEO), h1, lead, body (paragraphs), lists ([heading, items[]]), faqs
// ([q, a]), related (slugs), photos (photo slot names, see README).

export const groups = [
  { key: 'junk', name: 'Junk Removal', pillar: 'junk-removal', icon: 'truck', blurb: 'Furniture, appliances, garage and home clean-outs, yard waste and construction debris. Point at it and it’s gone.' },
  { key: 'demo', name: 'Light Demolition', pillar: 'light-demolition', icon: 'hammer', blurb: 'Sheds, fences, hot tubs, decks and interior tear-outs, torn down and hauled off in one visit.' },
  { key: 'delivery', name: 'Material Delivery', pillar: 'material-delivery', icon: 'gravel', blurb: 'Gravel, sand, soil, mulch and base rock delivered to your driveway. Small loads welcome.' },
];

const junkFaqs = [
  ['How much does junk removal cost?', 'Pricing is based on how much of the truck your items fill, plus anything heavy like concrete or dirt. Text us a photo and we’ll send an upfront price. The price we quote is the price you pay, unless the job turns out to be bigger than what was shown.'],
  ['Do I need to move anything to the curb?', 'No. We pick items up wherever they are: garage, backyard, upstairs bedroom, attic or side yard. Lifting and loading are included.'],
  ['What can’t you take?', 'Hazardous materials: paint, solvents, chemicals, fuel, motor oil, pesticides, propane tanks, asbestos and medical waste. Your city’s household hazardous waste center takes those for free.'],
  ['How soon can you come?', 'Often within a day or two, and sometimes the same day. Call or text and we’ll give you the next available time.'],
];

export const services = [
  // ── JUNK REMOVAL ───────────────────────────────────────────────────────────
  {
    slug: 'junk-removal', group: 'junk', pillar: true, name: 'Junk Removal', icon: 'truck',
    short: 'Full-service junk removal: we lift, load, haul and sweep up.',
    title: 'Junk Removal in Fullerton & North Orange County | Stellar Haul Away',
    description: 'Full-service junk removal in Fullerton, Anaheim, Brea, Placentia and nearby. We lift, load and haul it away. Text a photo for an upfront price.',
    h1: 'Junk Removal in Fullerton & North Orange County',
    lead: 'You point, we lift. Stellar Haul Away clears out the stuff you’re done with, from one old couch to a whole garage, and leaves the space swept clean.',
    body: [
      'Most junk sits around because getting rid of it is a hassle. You need a truck, a second set of hands, a free Saturday and a trip to the dump. We handle all of it. Show us what goes, we give you a price, and we do the heavy lifting.',
      'We’re a small, locally owned crew based in Fullerton. You deal with the same people from the first text to the final sweep, not a call center.',
    ],
    lists: [
      ['What we haul', ['Furniture: couches, mattresses, dressers, desks', 'Appliances: fridges, washers, dryers, water heaters', 'Garage, attic and storage-unit clean-outs', 'Yard waste, branches and old planters', 'Construction and remodel debris', 'Electronics, TVs and exercise equipment', 'Boxes, bags, toys and household clutter', 'Carpet, pads and old flooring']],
    ],
    faqs: junkFaqs,
    related: ['garage-cleanouts', 'furniture-removal', 'appliance-removal', 'estate-cleanouts', 'yard-waste-removal', 'construction-debris-removal'],
    photos: ['junk-removal-1', 'junk-removal-2'],
  },
  {
    slug: 'garage-cleanouts', group: 'junk', name: 'Garage Clean-outs', icon: 'garage',
    short: 'Get your car (and your Saturdays) back in the garage.',
    title: 'Garage Clean-out Service in Fullerton, CA | Stellar Haul Away',
    description: 'Garage clean-outs in Fullerton and North OC. We sort, load and haul everything you don’t want, then sweep the floor. Text a photo for a price.',
    h1: 'Garage Clean-outs',
    lead: 'Years of “we’ll deal with it later,” gone in an afternoon. We clear what you don’t want, leave what you do, and sweep the floor on the way out.',
    body: [
      'Tell us what stays and what goes, or walk through it with us when we arrive. We pull everything out, load the truck and haul it away. Usable items can be set aside for donation, and the floor gets swept before we leave.',
      'Planning to sell the house, add a gym, or just park inside again? A clean-out is usually the first step, and it’s much faster with a crew and a truck.',
    ],
    lists: [['Typical garage haul', ['Old furniture and mattresses', 'Boxes of stuff nobody has opened in years', 'Broken tools, mowers and bikes', 'Shelving and workbenches', 'Old paint cans can’t go with us (hazardous), but we’ll set them aside for you', 'Holiday decorations and toys']]],
    faqs: [
      ['Do I need to sort everything before you come?', 'No. Point out anything you want to keep and we’ll work around it. If you’re unsure about something, we set it aside so you can decide.'],
      ['How long does a garage clean-out take?', 'Most single-car and two-car garages take one to three hours, depending on how full they are and what’s inside.'],
      ...junkFaqs.slice(0, 1),
    ],
    related: ['estate-cleanouts', 'furniture-removal', 'junk-removal'],
    photos: ['garage-cleanout-before', 'garage-cleanout-after'],
  },
  {
    slug: 'furniture-removal', group: 'junk', name: 'Furniture Removal', icon: 'sofa',
    short: 'Couches, mattresses, dressers and sectionals, from any room.',
    title: 'Furniture & Mattress Removal in Fullerton, CA | Stellar Haul Away',
    description: 'Couch, mattress, sectional and furniture removal in Fullerton and North OC. We carry it out from any room and haul it away. Single items welcome.',
    h1: 'Furniture & Mattress Removal',
    lead: 'Got a new couch coming and nowhere to put the old one? We carry furniture out of any room, down any stairs, and haul it away.',
    body: [
      'Single items are welcome. We’ll pick up one recliner as gladly as a whole house of furniture. We protect door frames and walls on the way out, and we disassemble bed frames and big pieces when needed.',
      'Furniture that’s still in good shape can often go to donation instead of the landfill.',
    ],
    lists: [['Furniture we remove', ['Couches, sofas and sectionals', 'Mattresses and box springs', 'Bed frames and headboards', 'Dressers, armoires and nightstands', 'Dining tables and chairs', 'Desks, office chairs and filing cabinets', 'Patio furniture', 'Entertainment centers and bookcases']]],
    faqs: [
      ['Can you take just one item?', 'Yes. Single-item pickups are priced on their own. Text a photo and we’ll send the price.'],
      ['Will you take it from upstairs?', 'Yes. We carry items from upstairs rooms, apartments and back bedrooms. Just mention stairs when you request a quote.'],
      ...junkFaqs.slice(2, 3),
    ],
    related: ['appliance-removal', 'junk-removal', 'estate-cleanouts'],
    photos: ['furniture-removal-1'],
  },
  {
    slug: 'appliance-removal', group: 'junk', name: 'Appliance Removal', icon: 'fridge',
    short: 'Fridges, washers, dryers, water heaters and more.',
    title: 'Appliance Removal in Fullerton, CA | Fridge, Washer & Dryer Haul Away',
    description: 'Old refrigerator, freezer, washer, dryer, stove or water heater? Stellar Haul Away removes and hauls appliances in Fullerton and North OC.',
    h1: 'Appliance Removal',
    lead: 'Refrigerators, freezers, washers, dryers, stoves, dishwashers and water heaters, unhooked where possible and carried out by us.',
    body: [
      'Appliances are heavy, awkward and in California many of them can’t just go in the trash. Fridges, freezers and AC units contain refrigerant that has to be recovered properly. We haul them to facilities that accept them, so you don’t have to figure out where they can go.',
      'Getting a new appliance delivered? We can take the old one the same day, even if the store won’t.',
    ],
    lists: [['Appliances we take', ['Refrigerators and freezers', 'Washers and dryers', 'Stoves, ovens and range hoods', 'Dishwashers and microwaves', 'Water heaters', 'Window and portable AC units', 'Treadmills and exercise equipment']]],
    faqs: [
      ['Do you disconnect the appliance?', 'We can unplug and move freestanding appliances. Gas lines and hard-wired or plumbed connections should be shut off and disconnected by you or a plumber/electrician before we arrive.'],
      ['Do you take refrigerators?', 'Yes. Fridges and freezers go to facilities that handle refrigerant recovery as California requires.'],
    ],
    related: ['furniture-removal', 'junk-removal', 'garage-cleanouts'],
    photos: ['appliance-removal-1'],
  },
  {
    slug: 'estate-cleanouts', group: 'junk', name: 'Estate & Move-out Clean-outs', icon: 'house',
    short: 'Whole-home clean-outs for estates, move-outs and rentals.',
    title: 'Estate & Move-out Clean-outs in Fullerton & OC | Stellar Haul Away',
    description: 'Respectful estate clean-outs, move-out and rental turnover clean-outs in Fullerton and North Orange County. Whole houses, apartments and storage units.',
    h1: 'Estate & Move-out Clean-outs',
    lead: 'Whole-house, apartment and storage-unit clean-outs for families, landlords and realtors, handled with care and on your timeline.',
    body: [
      'Clearing out a loved one’s home is hard enough. We work respectfully and at your pace. We set aside anything you want to keep, check with you before anything questionable goes, and keep photos and paperwork we find for you.',
      'For landlords and property managers, we turn units around fast after a move-out: furniture, trash, abandoned items and all. For realtors, we get listings clear and ready for photos.',
    ],
    lists: [['Who we help', ['Families settling an estate', 'Landlords and property managers turning over units', 'Realtors prepping a listing', 'Anyone moving out, downsizing or moving in', 'Storage unit clean-outs']]],
    faqs: [
      ['Do I need to be there?', 'Not necessarily. Many landlords and out-of-town families give us access and a list. We send photos when we’re done.'],
      ['What happens to items that are still useful?', 'Tell us what you’d like donated and we’ll set it aside. Usable furniture and household goods can often go to local donation centers.'],
      ...junkFaqs.slice(0, 1),
    ],
    related: ['garage-cleanouts', 'furniture-removal', 'junk-removal'],
    photos: ['estate-cleanout-1'],
  },
  {
    slug: 'yard-waste-removal', group: 'junk', name: 'Yard Waste Removal', icon: 'leaf',
    short: 'Branches, clippings, old planters, dirt and green waste.',
    title: 'Yard Waste & Green Waste Removal in Fullerton, CA | Stellar Haul Away',
    description: 'Branches, brush, palm fronds, clippings, old planters and yard debris hauled away in Fullerton and North OC. Text a photo for an upfront price.',
    h1: 'Yard Waste Removal',
    lead: 'Tree trimmings, palm fronds, brush piles, old planters and dead plants. If it won’t fit in the green bin, we’ll haul it.',
    body: [
      'Weekend yard projects make more green waste than any curbside bin can hold. We load it from wherever it’s piled, in the side yard, the backyard or the driveway, and haul it off the same day.',
      'Pairing yard cleanup with a refresh? We also deliver mulch, soil and decorative rock.',
    ],
    lists: [['Yard debris we haul', ['Branches, brush and tree trimmings', 'Palm fronds', 'Grass clippings and leaves', 'Old planters and pots', 'Sod, dirt and rocks (priced by weight)', 'Old patio furniture and playsets']]],
    faqs: [
      ['Do you cut down trees?', 'No, we don’t do tree work. We haul away the trimmings after your gardener or tree service cuts them.'],
      ...junkFaqs.slice(0, 1),
    ],
    related: ['soil-mulch-delivery', 'fence-removal', 'junk-removal'],
    photos: ['yard-waste-1'],
  },
  {
    slug: 'construction-debris-removal', group: 'junk', name: 'Construction Debris Removal', icon: 'hardhat',
    short: 'Remodel leftovers, drywall, wood, tile and job-site cleanup.',
    title: 'Construction Debris Removal in Fullerton & OC | Stellar Haul Away',
    description: 'Remodel and construction debris hauling for homeowners and contractors in Fullerton and North Orange County. Drywall, wood, tile, cabinets and more.',
    h1: 'Construction Debris Removal',
    lead: 'For homeowners finishing a DIY remodel and contractors who need a job site cleared without renting a dumpster.',
    body: [
      'A dumpster sits in your driveway for a week and you load it yourself. We show up, load it ourselves and leave. That’s often faster and cheaper for small and mid-size jobs.',
      'Contractors: we do one-time pickups and recurring job-site cleanups. Call to set up a schedule.',
    ],
    lists: [['Debris we haul', ['Drywall and plaster', 'Lumber, framing and trim', 'Tile, flooring and carpet', 'Old cabinets, counters and vanities', 'Windows and doors', 'Small amounts of broken concrete and brick (priced by weight)']]],
    faqs: [
      ['Is this cheaper than a dumpster?', 'For many small and mid-size jobs, yes. You only pay for what you actually haul, and you don’t do the loading. Send a photo and compare.'],
      ['Can you remove a whole concrete patio or driveway?', 'Large concrete jobs go to our sister company, D.RAM Demolition & Hauling, which has the equipment for them.'],
    ],
    related: ['interior-tear-out', 'light-demolition', 'junk-removal'],
    photos: ['construction-debris-1'],
  },

  // ── LIGHT DEMOLITION ───────────────────────────────────────────────────────
  {
    slug: 'light-demolition', group: 'demo', pillar: true, name: 'Light Demolition', icon: 'hammer',
    short: 'Sheds, fences, hot tubs, decks and interior tear-outs.',
    title: 'Light Demolition & Removal in Fullerton, CA | Stellar Haul Away',
    description: 'Shed, fence, hot tub, deck, playset and interior tear-out removal in Fullerton and North OC. We take it apart and haul it away in one visit.',
    h1: 'Light Demolition & Tear-outs',
    lead: 'Some junk is attached to the ground. We take down sheds, fences, hot tubs, decks and playsets, rip out old cabinets and flooring, and haul every piece away.',
    body: [
      'Light demolition is the in-between job: too big to handle yourself on a Saturday, too small to hire a demolition contractor. We bring the tools, break it down, load it and clean up the area.',
      'Bigger structural or concrete work, like removing driveways, patios, block walls or whole buildings, goes to our sister company, D.RAM Demolition & Hauling.',
    ],
    lists: [['Light demolition we do', ['Sheds and small outbuildings', 'Wood and chain-link fences', 'Hot tubs and spas', 'Decks, pergolas and gazebos', 'Playsets and swing sets', 'Kitchen cabinets, vanities and counters', 'Carpet, laminate and tile flooring', 'Non-structural drywall and closets']]],
    faqs: [
      ['Do I need a permit?', 'Most small removals, like sheds under 120 sq ft, fences and hot tubs, don’t need one, but rules vary by city. We’ll tell you if something looks like it needs a permit.'],
      ['Do you disconnect electrical and plumbing?', 'Power and water to hot tubs, sheds and fixtures must be shut off and disconnected by a licensed electrician or plumber before we start. We can recommend one.'],
      ['What about concrete pads under sheds and hot tubs?', 'Small pads may be included. Ask when you request a quote. Large slabs are handled by our sister company D.RAM Demolition.'],
    ],
    related: ['shed-removal', 'fence-removal', 'hot-tub-removal', 'interior-tear-out'],
    photos: ['light-demolition-1', 'light-demolition-2'],
  },
  {
    slug: 'shed-removal', group: 'demo', name: 'Shed & Playset Removal', icon: 'shed',
    short: 'Wood, metal and resin sheds, playsets and swing sets.',
    title: 'Shed Removal & Playset Removal in Fullerton, CA | Stellar Haul Away',
    description: 'Old shed, playset or swing set? We tear it down and haul it away. Wood, metal and resin sheds in Fullerton and North Orange County.',
    h1: 'Shed & Playset Removal',
    lead: 'That leaning shed or the playset the kids outgrew: we take it apart, haul every board, panel and screw, and rake the spot clean.',
    body: ['We remove wood, metal and resin sheds, plus wooden playsets, swing sets and trampolines. If the shed is still full, we clear the contents too in the same visit.'],
    lists: [['Included', ['Emptying the shed (if needed)', 'Tear-down and disassembly', 'Loading and hauling all materials', 'Raking and sweeping the area']]],
    faqs: [
      ['Can you remove the concrete pad too?', 'Small pads can often be included. Ask for a price. Larger slabs go to our sister company, D.RAM Demolition.'],
      ['My shed has electricity. Is that a problem?', 'Not if the power is disconnected by a licensed electrician first. We can’t remove a shed with live wiring.'],
    ],
    related: ['fence-removal', 'light-demolition', 'yard-waste-removal'],
    photos: ['shed-removal-before', 'shed-removal-after'],
  },
  {
    slug: 'fence-removal', group: 'demo', name: 'Fence Removal', icon: 'fence',
    short: 'Wood and chain-link fence tear-out, posts included.',
    title: 'Fence Removal in Fullerton & North OC | Stellar Haul Away',
    description: 'Old wood or chain-link fence removal in Fullerton and North Orange County. Panels, posts and footings pulled and hauled away.',
    h1: 'Fence Removal',
    lead: 'Replacing a fence or opening up the yard? We tear out wood and chain-link fencing, pull the posts, and haul it all away.',
    body: ['Getting a new fence installed? Many installers charge extra to remove the old one. Ask us and compare. We can have it cleared before your installer arrives.'],
    lists: [['Fence removal includes', ['Wood panels, pickets and rails', 'Chain-link fabric and posts', 'Pulling posts and small concrete footings', 'Hauling and cleanup']]],
    faqs: [
      ['Do you remove block walls?', 'Block and brick walls are heavier demolition. Our sister company D.RAM Demolition handles those.'],
      ['Do you install fences?', 'No, we only do removal. We’re happy to work around your installer’s schedule.'],
    ],
    related: ['shed-removal', 'yard-waste-removal', 'light-demolition'],
    photos: ['fence-removal-1'],
  },
  {
    slug: 'hot-tub-removal', group: 'demo', name: 'Hot Tub & Spa Removal', icon: 'hottub',
    short: 'Cut up, carried out and hauled, even from tight backyards.',
    title: 'Hot Tub & Spa Removal in Fullerton, CA | Stellar Haul Away',
    description: 'Hot tub and spa removal in Fullerton and North Orange County. We cut it up, carry it out of tight backyards and haul it away.',
    h1: 'Hot Tub & Spa Removal',
    lead: 'Hot tubs are big, heavy and rarely fit through the side gate in one piece. We cut them down to size, carry them out and haul them off.',
    body: ['Once the power is disconnected and the tub is drained, we cut it into manageable sections, carry the pieces out (cover and steps included) and leave the pad clean.'],
    lists: [['Before we arrive', ['Drain the tub', 'Have a licensed electrician disconnect the power', 'Make sure we can access the yard (unlock the gate)']]],
    faqs: [
      ['Can you remove an in-ground spa?', 'In-ground spas and pools are demolition projects. Our sister company D.RAM Demolition handles those.'],
      ['Do I need to drain it?', 'Yes, please drain it a day ahead. A full tub holds hundreds of gallons of water.'],
    ],
    related: ['shed-removal', 'light-demolition', 'junk-removal'],
    photos: ['hot-tub-removal-1'],
  },
  {
    slug: 'interior-tear-out', group: 'demo', name: 'Interior Tear-outs', icon: 'tearout',
    short: 'Cabinets, vanities, flooring and carpet removed before your remodel.',
    title: 'Kitchen, Bath & Flooring Tear-out in Fullerton, CA | Stellar Haul Away',
    description: 'Cabinet, vanity, carpet and flooring removal before your remodel. Interior tear-outs and debris hauling in Fullerton and North Orange County.',
    h1: 'Interior Tear-outs',
    lead: 'Getting ready for new floors, a kitchen refresh or a bathroom update? We do the messy part, removing the old stuff and hauling it away so your installer starts with a clean room.',
    body: ['We stick to non-structural removal: cabinets, counters, vanities, flooring, carpet, closet systems and non-load-bearing drywall. Plumbing and electrical should be disconnected by a licensed pro first.'],
    lists: [['Common tear-outs', ['Kitchen cabinets and countertops', 'Bathroom vanities, mirrors and toilets (disconnected)', 'Carpet and pad', 'Laminate, vinyl and engineered flooring', 'Closet shelving and built-ins', 'Non-load-bearing drywall']]],
    faqs: [
      ['Do you remove tile floors?', 'Small tile areas, yes. Large tile-over-concrete jobs can need heavier tools. Send photos and we’ll tell you.'],
      ['Can you remove walls?', 'Only non-structural partitions. Anything load-bearing needs a contractor and permits.'],
    ],
    related: ['construction-debris-removal', 'light-demolition', 'appliance-removal'],
    photos: ['interior-tear-out-1'],
  },

  // ── MATERIAL DELIVERY ──────────────────────────────────────────────────────
  {
    slug: 'material-delivery', group: 'delivery', pillar: true, name: 'Material Delivery', icon: 'gravel',
    short: 'Gravel, sand, soil, mulch and base delivered. Small loads welcome.',
    title: 'Gravel, Sand, Soil & Mulch Delivery in Fullerton, CA | Stellar Haul Away',
    description: 'Landscape and construction material delivery in Fullerton and North OC: gravel, sand, decomposed granite, base, soil and mulch. Small loads welcome.',
    h1: 'Landscape & Construction Material Delivery',
    lead: 'Need a few yards of gravel, sand or soil but not a full dump-truck load? We pick it up from local supply yards and deliver it to your driveway.',
    body: [
      'Big suppliers often have minimums or charge high delivery fees for small orders. Trying to haul it yourself means a borrowed truck, a sore back and a lot of trips. We bring exactly what your project needs.',
      'Tell us the material, the amount (or the size of the area and we’ll help you work it out) and where you want it dropped.',
    ],
    lists: [['Materials we deliver', ['Gravel: pea gravel, crushed rock, drain rock', 'Decorative rock and river rock', 'Decomposed granite (DG)', 'Sand: fill sand, play sand, mortar sand', 'Base rock / Class II base for pavers', 'Topsoil, planting mix and fill dirt', 'Mulch and wood chips', 'Your own store orders: pavers, bagged concrete, lumber']]],
    faqs: [
      ['How much material do I need?', 'Send us the length, width and depth of the area and we’ll help you estimate. As a rough guide, one cubic yard covers about 100 sq ft at 3 inches deep.'],
      ['Can you pick up an order I already paid for?', 'Yes. If you bought pavers, bagged concrete or other materials from a store or yard, we can pick them up and deliver them to you.'],
      ['Where do you drop it?', 'Usually on your driveway or right next to it. We can put down a tarp to protect the surface. Ask about placing material in the backyard.'],
    ],
    related: ['gravel-rock-delivery', 'soil-mulch-delivery', 'yard-waste-removal'],
    photos: ['material-delivery-1', 'material-delivery-2'],
  },
  {
    slug: 'gravel-rock-delivery', group: 'delivery', name: 'Gravel, Sand & Base Delivery', icon: 'gravel',
    short: 'Gravel, DG, sand and base rock for patios, paths and pavers.',
    title: 'Gravel, Sand & Base Rock Delivery in Fullerton, CA | Stellar Haul Away',
    description: 'Gravel, decomposed granite, sand and Class II base rock delivered in Fullerton and North Orange County. Small loads for DIY patios, paths and pavers.',
    h1: 'Gravel, Sand & Base Rock Delivery',
    lead: 'Laying pavers, building a path or adding drainage? We deliver gravel, decomposed granite, sand and base rock in the amount your project needs.',
    body: ['We source from local supply yards in North Orange County and deliver to your driveway. Tell us what you’re building and we’ll help you choose the right material and amount.'],
    lists: [['Popular for', ['Paver patios and walkways (base + sand)', 'Gravel paths and side yards', 'French drains (drain rock)', 'DG patios and xeriscape', 'Fence and post setting']]],
    faqs: [
      ['How much does gravel delivery cost?', 'It depends on the material, the amount and the distance. Tell us what you need and we’ll give you one price for the material and delivery.'],
    ],
    related: ['soil-mulch-delivery', 'material-delivery', 'fence-removal'],
    photos: ['gravel-delivery-1'],
  },
  {
    slug: 'soil-mulch-delivery', group: 'delivery', name: 'Soil & Mulch Delivery', icon: 'shovel',
    short: 'Topsoil, planting mix, fill dirt and mulch for gardens and beds.',
    title: 'Topsoil, Fill Dirt & Mulch Delivery in Fullerton, CA | Stellar Haul Away',
    description: 'Topsoil, planting mix, fill dirt and mulch delivered in Fullerton and North Orange County. Perfect for raised beds, lawns and garden refreshes.',
    h1: 'Soil & Mulch Delivery',
    lead: 'Fill the raised beds, level the yard or refresh the planters, without dozens of bags from the hardware store.',
    body: ['One cubic yard is roughly the same as 13–14 of the big 2 cu ft bags, delivered in one trip. We bring topsoil, planting mix, fill dirt and mulch from local yards straight to your driveway.'],
    lists: [['Good for', ['Raised garden beds', 'New lawns and leveling', 'Filling holes after tree or stump removal', 'Mulching beds to save water', 'Planter refreshes']]],
    faqs: [
      ['Topsoil or planting mix?', 'Planting mix (amended soil) is best for raised beds and flowers. Topsoil or fill dirt is for leveling and filling. Tell us the project and we’ll recommend one.'],
    ],
    related: ['gravel-rock-delivery', 'yard-waste-removal', 'material-delivery'],
    photos: ['soil-delivery-1'],
  },
];

export const bySlug = Object.fromEntries(services.map((s) => [s.slug, s]));
export const groupByKey = Object.fromEntries(groups.map((g) => [g.key, g]));
