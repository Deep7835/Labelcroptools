export default {
  slug: 'flipkart-volumetric-weight-shipping-fee',
  marketplace: 'flipkart',
  keyword: 'Flipkart volumetric weight shipping fee',
  type: 'Type 5 — Problem / Solution',
  sentiment: '0.60 to 0.80 · Reassuring + Solution-focused',
  title: 'Paying Too Much Shipping on Flipkart? Check Your Volumetric Weight',
  metaTitle: 'Flipkart Shipping Fee Too High? Check Volumetric Weight',
  description: 'Couriers bill the greater of actual and volumetric weight. Here is the formula, how to check which one you are being charged on, and how to drop a weight slab.',
  excerpt: 'If a light product is costing you heavy shipping, you are almost certainly being billed on volume, not weight. The formula and the fix are both simple.',
  published: '2026-09-20',
  updated: '2026-09-20',
  cover: 'box',
  coverAlt: 'Diagram comparing a large light box against a small dense parcel on a weighing scale',
  tools: ['volumetric-weight-calculator', 'profit-calculator', 'gst-calculator'],
  faq: [
    { q: 'What is the volumetric weight formula?', a: 'Volumetric weight in kilograms equals length x width x height in centimetres, divided by a divisor. Most Indian courier rate cards use 5000. Some contracts and air cargo use 4000 or 6000, so check your own rate card.' },
    { q: 'Which weight does the courier charge on?', a: 'Whichever is greater, actual weight or volumetric weight. That figure is called the chargeable weight and it is usually rounded up to the next slab, commonly 500 g.' },
    { q: 'Why is my light product expensive to ship?', a: 'Because it is bulky. A cushion or a plastic organiser weighs very little but occupies a lot of space on the truck, so volumetric weight governs and you are billed for the space.' },
    { q: 'How can I reduce volumetric weight?', a: 'Use the smallest packaging that protects the item, switch from a box to a courier bag for soft goods, and remove unnecessary void fill. Reducing each dimension by 10 percent cuts volumetric weight by about 27 percent.' },
  ],
  body: `
A seller messaged me genuinely upset. His product weighed 380 grams. His shipping charge looked like he was posting a brick.

Nothing was wrong with his account. He was shipping a light item in a big box, and the courier was billing him for the air inside it.

Don't worry, this is one of the most common surprises in e-commerce shipping, and the fix is simpler than you would expect. Let me show you the maths first, because once you see it you cannot unsee it.

## Why Flipkart shipping fees follow volumetric weight, not just scale weight

A delivery van has a fixed volume. A parcel that weighs nothing but fills a quarter of the van costs the courier the same as a dense parcel that fills the same space.

So the industry uses a second measure called **volumetric weight** (also called dimensional weight). It converts the space your parcel occupies into an equivalent weight.

The formula used on most Indian rate cards is:

**Volumetric weight (kg) = Length x Width x Height (cm) ÷ 5000**

The courier then charges you on the **chargeable weight**, which is whichever is greater: your actual weight, or your volumetric weight.

## A worked example

Take a cushion cover set in a box measuring 30 x 25 x 12 cm, actual weight 380 g.

Volumetric weight = (30 x 25 x 12) ÷ 5000 = 9000 ÷ 5000 = **1.8 kg**

Actual weight = 0.38 kg

Chargeable weight = 1.8 kg, rounded to the slab.

So he was paying for 1.8 kg to ship 380 grams. Nearly five times the weight he thought he was shipping.

Here is the good news. He was not being cheated, and the fix was entirely in his hands.

## The fix: change the shape, not the product

This is where it gets interesting, because the maths rewards you more than you would expect.

Volume is three-dimensional. Shrink every dimension by 10 percent and the volume does not drop by 10 percent, it drops by about 27 percent (0.9 x 0.9 x 0.9 = 0.729).

Three practical moves, in order of impact:

**1. Move soft goods out of boxes.** A courier bag follows the shape of the contents. That cushion set in a bag rather than a box might measure 28 x 22 x 5 cm, giving a volumetric weight of 0.62 kg. Now actual weight governs and the chargeable weight drops to the 500 g slab.

**2. Use the smallest box that still protects.** Not the box you have most of. Keep three or four box sizes, not one.

**3. Cut the void fill.** Filler stops movement, which prevents damage, so do not remove it entirely. But filling a box that is twice too big with paper is paying to ship paper.

## How to check your own SKUs in ten minutes

You've got this, and you only need to do it once per product.

1. Pack one unit of a SKU exactly as you normally would.
2. Measure the outside of the packed parcel: length, width, height.
3. Weigh it.
4. Put those numbers into the [Volumetric Weight Calculator](/volumetric-weight-calculator/).

It shows you both weights side by side, tells you which one is governing, rounds to the 500 g slab most rate cards use, and shows a comparison across the common divisors (3000, 4000, 4500, 5000, 6000) in case your contract differs.

Do this for your top ten SKUs by volume. That covers most of your shipping spend.

> Anything where volumetric weight is higher than actual weight is a candidate for repackaging. Anything where actual weight governs is already efficient, and shrinking the box further will not save you money.

That second sentence matters. Do not re-engineer packaging for products that are already billed on real weight. You will add damage risk for zero saving.

## Feeding this back into your pricing

Once you know the true chargeable weight per SKU, you can price properly.

Take that figure, find the matching rate on your Flipkart rate card, and put the real shipping cost into the [Seller Profit Calculator](/profit-calculator/). Add your commission, fixed fee, collection fee and return rate.

Most sellers discover one of two things. Either a product they thought was marginal is actually fine, or a product they thought was their best seller is barely breaking even because of a slab boundary.

If you need to split a GST-inclusive selling price to check your taxable value while doing this, the [GST Calculator](/gst-calculator/) handles it.

## The slab boundary trick

This is the one that produces the fastest win, so it is worth stating on its own.

Rate cards charge in slabs, commonly 500 g steps. A parcel at 510 g and a parcel at 990 g often cost exactly the same.

But a parcel at 510 g and one at 490 g do not.

So look at your highest-volume SKU and check where it sits relative to a slab boundary. If it is just over, a slightly smaller bag or 20 grams less filler moves it under, and that saving applies to **every single order of your best seller, forever**.

That is a permanent, compounding change from one afternoon of measuring.

## One honest caveat on rate cards

I have used 5000 as the divisor throughout because it is the most common on Indian domestic rate cards, including the logistics partners Flipkart works with.

But divisors do change, they differ between air and surface, and large sellers sometimes negotiate different terms. Your own rate card in Seller Hub is the source of truth. The calculator lets you switch divisors so you can model whatever yours says.

Marketplace fee structures also get revised, so treat any rate you read in an article (including this one) as a starting point to verify, not a fact to rely on.

## What to do next

Here is exactly what I would do this week:

1. Measure and weigh your top ten packed SKUs. One afternoon.
2. Run each through the calculator and note which are volume-billed.
3. For those, try one smaller pack format and re-measure.
4. Check whether your best seller can be moved under a slab boundary.
5. Update your profit calculation with real chargeable weights.

Most sellers find at least one product where a bag instead of a box, or one box size down, saves a full slab. On a product you ship every day, that is not a small number by the end of the year.

The shipping fee felt like something happening to you. It is actually something you control, and the lever is the tape measure.
`,
};
