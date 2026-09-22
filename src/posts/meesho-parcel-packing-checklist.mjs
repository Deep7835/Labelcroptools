export default {
  slug: 'meesho-parcel-packing-checklist',
  marketplace: 'meesho',
  keyword: 'Meesho parcel packing',
  type: 'Type 6 — Listicle / Top X',
  sentiment: '0.65 to 0.90 · Energetic + Useful + Positive',
  title: '8 Things Worth Putting in (and Leaving Out of) a Meesho Parcel',
  metaTitle: '8 Things to Put in a Meesho Parcel (Packing Checklist)',
  description: 'A practical packing checklist for Meesho suppliers: what genuinely belongs inside the parcel, what to leave out, and the small habits that cut damage and returns.',
  excerpt: 'What goes inside the bag decides how the order ends: kept, returned, or claimed. Here are eight things worth getting right, in the order they matter.',
  published: '2026-09-18',
  updated: '2026-09-18',
  cover: 'checklist',
  coverAlt: 'Diagram of a sealed parcel next to a ticked packing checklist',
  tools: ['thank-you-card-maker', 'barcode-generator', 'meesho-label-cropper'],
  faq: [
    { q: 'Do I need to put the invoice inside a Meesho parcel?', a: 'Meesho generates the tax invoice for the order. Whether a printed copy must accompany the parcel depends on the current Meesho policy and any e-way bill requirements for your consignment, so confirm in your supplier panel rather than assuming.' },
    { q: 'Can I put my own brand card in a Meesho parcel?', a: 'Policies on packaging inserts differ by marketplace and change over time. A support or care-instruction card is generally safer than one that pushes buyers to shop elsewhere. Check Meesho current insert rules before printing in bulk.' },
    { q: 'What packaging material should I use?', a: 'Courier bags for soft goods, and corrugated boxes for anything rigid or fragile. Soft goods in bags also keep volumetric weight down, which lowers your shipping charge.' },
    { q: 'How do I stop items getting damaged in transit?', a: 'Remove empty space. Movement inside the parcel causes most transit damage. Fill voids, tape edges properly, and use a box rather than a bag for anything with corners.' },
  ],
  body: `
I spent an afternoon at a seller's packing table watching three people work. What struck me was not the speed. It was that every parcel came out slightly different. Different tape, different filler, one with a card and one without.

The orders that came back later were not random either. They clustered around the parcels that were packed in a hurry.

Here is a checklist you can actually pin above the table. Eight items, ordered by how much difference each one makes.

## 1. The label, cropped and sorted before you start

This one makes a bigger difference than most people realise, because it changes the shape of the whole session.

If your labels come out in random order, your packer walks back and forth to the shelf all day. If they come out sorted by SKU, they pick twelve of one item once.

Crop the invoice off, sort by SKU, and stamp the quantity in large text under each label. The [Meesho Label Cropper](/meesho-label-cropper/) does all three in one pass and prints four labels per A4 sheet.

The quantity stamp deserves special mention. Multi-unit orders are the most common packing mistake I see, and a small "Qty 3" inside a product table is very easy to miss at speed.

## 2. The right bag or box for the shape

A lot of people skip this decision and use whatever is nearest, but it affects both damage and cost.

- **Soft goods** (clothing, dupattas, bedsheets): courier bag. It follows the shape of the item, which keeps volumetric weight low.
- **Rigid or fragile items** (mugs, frames, electronics, glass): corrugated box, always. A bag gives zero protection against a corner impact.
- **Mixed orders**: box, and pack the soft items around the hard one.

Here is why bags matter financially. Couriers bill on whichever is greater, actual weight or volumetric weight. Volumetric weight is length x width x height divided by a divisor (usually 5000 for centimetres). A bulky box of air gets billed as if it were heavy. The [Volumetric Weight Calculator](/volumetric-weight-calculator/) shows you the chargeable weight before you ship, and how much a smaller package would save.

## 3. Void fill, because movement causes damage

A lot of people skip this step, but it is worth it.

Most transit damage is not a crushing impact. It is the item moving inside the parcel for two days. Paper, bubble wrap, or even clean offcuts of packaging material stop that movement.

The test is simple: shake the sealed parcel gently near your ear. If you can hear or feel the contents shift, add filler.

## 4. A tamper-evident seal on the opening

Tape along the full opening rather than two small strips at the corners. It takes three extra seconds.

This protects you in two directions. It reduces genuine pilferage, and it gives you something concrete to point at if a claim is raised about a parcel arriving open.

## 5. The tax invoice, if your setup requires it

Meesho generates the invoice for the order. Whether a printed copy needs to travel with the parcel depends on the current supplier policy and, for higher-value consignments, e-way bill rules under the GST framework.

I am deliberately not giving you a yes or no here, because this is one of the areas that genuinely changes. Confirm it in your supplier panel and keep a digital copy of every invoice regardless, because you will need them at filing time.

## 6. A care or support card (the highest return per rupee)

This is the simplest change with the biggest payoff.

A small card costs well under a rupee to print and does three things: it makes the parcel feel like it came from a business, it tells the buyer how to reach you, and it gives them an alternative to raising a return when something is slightly off.

The wording matters more than the design. "Message us before raising a return, we will sort it out" converts far better than "Thank you for shopping".

The [Thank You Card Maker](/thank-you-card-maker/) generates these with a working WhatsApp QR code and prints ten per A4 sheet with cut marks. Print on 250 to 300 gsm card stock.

One honest caveat, and I will keep repeating it: marketplace rules on inserts change, and pushing buyers to buy elsewhere is usually not allowed. A support contact is a different thing from a sales pitch. Check current policy before a bulk print run.

## 7. Care instructions for anything fabric

Underrated, and almost free.

"First wash separately, cold water, do not bleach" printed on the same card prevents the colour-bleed complaint that otherwise arrives a week later as a quality claim.

You are not being thorough for its own sake. You are removing a specific, predictable reason for a bad rating.

## 8. A SKU barcode on the bin, not the parcel

This one is for you, not the customer.

Once you pass roughly fifty SKUs, picking by reading product names starts producing errors. A barcode on each shelf bin, scanned against the picklist, catches the mistake before the parcel is sealed.

The [Barcode Generator](/barcode-generator/) takes a pasted list of SKUs and prints them onto standard A4 label sheets (65, 40 or 24 per sheet). Code 128 is the right choice for internal SKUs because it encodes letters and numbers.

## What to leave out of a Meesho parcel

Shorter list, and worth saying plainly.

- **Anything that pushes buyers off the marketplace.** Discount codes for your own site, "order directly next time" messages. This risks your account.
- **Loose, unprotected promotional paper** that arrives creased and looks like litter.
- **Excess filler in a bag.** It inflates volumetric weight and costs you on every order.
- **Second-hand or reused printed packaging** with another brand on it.

## Putting it together

A good dispatch session looks like this: picklist first, stock pulled in one pass, labels cropped and sorted, then pack in the same order the labels came out. Card in, filler in, seal properly, done.

The compounding part is that none of these are one-time wins. Every one of them applies to every parcel you will ever ship, which is exactly why the small habits are worth setting up properly once.

Pin the list above the table. Your packer will follow it far more reliably than they will follow a conversation from three weeks ago.
`,
};
