export default {
  slug: 'amazon-india-fees-real-profit-per-order',
  marketplace: 'amazon',
  keyword: 'Amazon India seller fees profit per order',
  type: 'Type 3 — Informational / Educational',
  sentiment: '0.55 to 0.75 · Curious + Warm + Trustworthy',
  title: 'Amazon India Fees Explained: What You Actually Keep From a Rs. 499 Order',
  metaTitle: 'Amazon India Seller Fees — What You Keep Per Order',
  description: 'Referral fee, closing fee, shipping, GST on fees and returns all come out before your payout. Here is the order they apply in and how to work out real profit.',
  excerpt: 'Follow one Rs. 499 order all the way from the customer paying to the money reaching your bank, and every deduction becomes obvious.',
  published: '2026-09-21',
  updated: '2026-09-21',
  cover: 'chart',
  coverAlt: 'Diagram of an order value bar with slices removed for referral fee, closing fee, shipping and tax',
  tools: ['profit-calculator', 'gst-calculator', 'volumetric-weight-calculator'],
  faq: [
    { q: 'What is the referral fee on Amazon India?', a: 'The referral fee is a percentage of the item price and it varies by category and sometimes by price band. Amazon publishes a fee schedule in Seller Central, and it is revised periodically, so check the current rate for your exact category.' },
    { q: 'What is the closing fee?', a: 'A flat per-item fee that applies in addition to the referral fee. The amount depends on the fulfilment channel and the price band of the item.' },
    { q: 'Is GST charged on Amazon seller fees?', a: 'Yes. Marketplace fees are a service, and GST applies to them at the standard rate for services. If you are GST registered you can generally claim input credit on that tax, so include it as a deduction but remember you may recover it.' },
    { q: 'Why is my payout lower than expected?', a: 'The most common reasons are a fee band you did not expect, a chargeable weight higher than actual weight, or returns from earlier orders settling in the current cycle.' },
  ],
  body: `
A seller showed me two screens side by side: a Rs. 499 order, and an Amazon India payout that did not look anything like Rs. 499. His question about the seller fees was fair. "Which one of these is lying to me?"

Neither. Here is something most sellers are never walked through: the deductions happen in a specific order, and once you follow one order all the way through, the whole thing stops feeling arbitrary.

Let me trace a single Rs. 499 sale from the customer's card to your bank.

## The Amazon India seller fees that come out, in order

Think of it as a chain. Each link takes something.

**1. Referral fee.** A percentage of the item price, set by category. This is the main marketplace commission. Rates differ a lot between, say, apparel and electronics accessories, and Amazon revises the schedule periodically.

**2. Closing fee.** A flat per-item amount, which varies by fulfilment channel and price band.

**3. Shipping / weight handling fee.** If you use Easy Ship or FBA, Amazon arranges the delivery and charges for it based on the chargeable weight and the destination zone (local, regional, national).

**4. GST on those fees.** The fees above are a service being sold to you, so GST applies to them at the standard services rate. Important nuance: if you are GST registered, you can generally claim input credit on this, so it is a cash-flow cost rather than a permanent one.

**5. GST on your sale.** Your listed price is what the customer pays, and it is inclusive of the GST on the product. That portion is a tax liability, not revenue.

Only after all five do you get to subtract what the product actually cost you.

## Following the Rs. 499

Let me use round numbers to show the shape. Do not treat these as current rates, treat them as an illustration of the sequence. Your real numbers come from the Seller Central fee schedule for your category.

Say the product is apparel at 5 percent GST, costing you Rs. 220 including packaging.

- Customer pays: **Rs. 499**
- Taxable value of your sale: 499 ÷ 1.05 = **Rs. 475.24**
- GST on the sale: **Rs. 23.76** (a liability, not yours)
- Referral fee (illustrative 12 percent): **Rs. 59.88**
- Closing fee (illustrative): **Rs. 20**
- Shipping (illustrative, local, under 500 g): **Rs. 65**
- GST on those fees at 18 percent: **Rs. 25.66** (claimable as input credit)

Amazon settles roughly: 499 − 59.88 − 20 − 65 − 25.66 = **Rs. 328.46**

Then you still owe the Rs. 23.76 GST on the sale and you paid Rs. 220 for the product.

Rough profit on a **delivered** order: about **Rs. 109**, plus the Rs. 25.66 you can reclaim as input credit if registered.

That is a workable margin. Now watch what returns do to it.

## The number that actually matters: expected profit

This is where it gets interesting, and it is the calculation most sellers never do.

Profit on a delivered order is a best case. If eight percent of your orders come back, you do not earn Rs. 109 per order. You earn Rs. 109 on 92 out of 100 orders, and you **lose** money on the other eight.

A return costs you the reverse shipping, the packaging you cannot reuse, the handling time, and sometimes a unit that comes back unsellable. Call it Rs. 120 all in.

Expected profit per order = (0.92 x 109) − (0.08 x 120) = 100.3 − 9.6 = **about Rs. 90.7**

So the real figure is roughly 17 percent lower than the headline. That gap is exactly where sellers get into trouble when they price aggressively for a sale event.

The [Seller Profit Calculator](/profit-calculator/) on this site does this whole chain for you. It has an Amazon preset as a starting point, and every field is editable so you can enter the real rates from your own fee schedule. It shows profit per delivered order, margin, ROI, break-even price, and expected profit after returns side by side.

## Two places money quietly leaks

**Weight bands.** Shipping is charged on **chargeable weight**, which is whichever is greater: actual weight, or volumetric weight (length x width x height in cm, divided by 5000 on most rate cards). A light but bulky product gets billed on its volume.

If your best-selling product sits just above a band boundary, a slightly smaller bag can move it below, and that saving applies to every order forever. The [Volumetric Weight Calculator](/volumetric-weight-calculator/) shows you which weight is governing and how close you are to a boundary.

**Price bands.** Some fees change at price thresholds. Pricing at Rs. 505 instead of Rs. 495 can occasionally push you into a higher band and cost more than the extra ten rupees earns. Worth checking against the current schedule for your category.

## Where to get the real numbers

I have been deliberately vague about exact percentages, and I want to be upfront about why.

Amazon publishes its fee schedule in Seller Central, broken down by category, and it gets revised. Any specific percentage in an article (including this one) has a shelf life. The structure is stable; the numbers are not.

So use this article for the **sequence** and use Seller Central for the **rates**. Then put the real rates into the calculator once, and it becomes your own tool rather than a generic one.

If you need to split a GST-inclusive price to check taxable values while you do this, the [GST Calculator](/gst-calculator/) handles both directions and shows the CGST/SGST or IGST split.

## What this means for you

Three practical habits come out of understanding the chain.

**Price from expected profit, not delivered profit.** Put your real return rate in before you decide a price is viable.

**Check your break-even before any sale event.** The calculator gives you the price at which profit hits zero. Discounting below that is buying orders with your own money, which is sometimes a deliberate strategy and should never be an accident.

**Review your top five SKUs quarterly.** Fee schedules change, your weights change as packaging changes, and your return rate moves. A product that was profitable in March may not be in September.

## My honest opinion

The single most useful thing you can do is spend twenty minutes entering your real category rates into a calculator once, and then reuse it.

Most sellers I talk to are carrying a rough number in their head, usually from a category they used to sell in, and they price against that. The gap between the remembered number and the current one is where a whole month's margin goes.

You do not need to become an accountant. You need one accurate model of one order. Build that, and every pricing decision after it gets easier.
`,
};
