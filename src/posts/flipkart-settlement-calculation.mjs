export default {
  slug: 'flipkart-settlement-calculation',
  marketplace: 'flipkart',
  keyword: 'Flipkart settlement calculation',
  type: 'Type 2 — How-To / Guide',
  sentiment: '0.60 to 0.80 · Clear + Reassuring + Practical',
  title: 'Flipkart Settlement Calculation: What Actually Reaches Your Bank per Order',
  metaTitle: 'Flipkart Settlement Calculation, Line by Line',
  description: 'A Flipkart settlement calculation from selling price to bank credit: commission, fixed fee, collection fee, shipping, GST on fees, TCS and TDS, then returns.',
  excerpt: 'A ₹499 order does not put ₹499 in your account. Here is every deduction in the order Flipkart takes it, and the two that are actually money you get back.',
  published: '2026-10-12',
  updated: '2026-10-12',
  cover: 'settlement',
  coverAlt: 'Diagram of a selling price split into fee slices, with the remainder flowing into a bank',
  tools: ['profit-calculator', 'volumetric-weight-calculator', 'gst-calculator'],
  faq: [
    { q: 'Why is my Flipkart settlement lower than the selling price?', a: 'Because Flipkart deducts its marketplace fees, the shipping fee and 18 percent GST on those fees before paying you, and also withholds TCS and TDS. On a low-priced product these can add up to a third of the selling price or more.' },
    { q: 'Are TCS and TDS a cost to the seller?', a: 'No. TCS under GST and TDS under section 194-O are tax collected on your behalf. If your details are correct, they appear against your GSTIN and PAN and can be claimed back, so treat them as delayed money rather than lost money.' },
    { q: 'Can I claim the GST charged on Flipkart fees?', a: 'If you are a regular GST-registered seller, the GST on marketplace fees is usually available as input tax credit against the GST you owe on your sales. Confirm with your accountant, because eligibility depends on your registration and filings.' },
    { q: 'Is there a Flipkart settlement calculator?', a: 'The Seller Profit Calculator on this site has a Flipkart preset that walks the same chain: fees, GST on fees, net settlement, GST on the sale, profit per order and profit after returns. Replace the preset rates with the ones on your Seller Hub rate card.' },
  ],
  body: `
A seller showed me two numbers that would not agree. His Flipkart listing said ₹499. His bank said ₹319 for the same order, ten days later. He assumed something had gone wrong.

Nothing had. A Flipkart settlement calculation always starts at the selling price and works down through a fixed sequence of deductions. Once you can do it by hand for one order, the statement stops being a surprise and starts being a pricing tool.

## Quick answers

### How is Flipkart settlement calculated?

Settlement is the selling price minus Flipkart's fees (commission, fixed fee, collection fee and shipping), minus 18 percent GST on those fees, minus TCS and TDS withheld for the government. Returns are adjusted later, often in a different cycle.

### Which deductions come back to me?

TCS and TDS are credited against your GSTIN and PAN, so they come back through your tax filings. GST on the fees can usually be claimed as input tax credit if you are a regular registered seller. Commission, fees and shipping do not come back.

## The Flipkart settlement calculation, step by step

I will use one example the whole way through: a product listed at ₹499 including 5 percent GST. The fee rates below are illustrations, close to what many categories pay, not your actual rates.

Flipkart's rate card varies by category, price band, weight and shipping zone, and it has been revised several times, sometimes with waivers for low-priced items. Copy the real numbers from your Seller Hub rate card before trusting any total, including mine.

| Line | How it is worked out | Example |
|---|---|---|
| Selling price | What the customer pays, GST included | ₹499.00 |
| Commission | 12% of selling price | − ₹59.88 |
| Fixed fee | Flat per order | − ₹20.00 |
| Collection fee | 2% of selling price | − ₹9.98 |
| Shipping fee | Depends on weight and zone | − ₹60.00 |
| GST on fees | 18% of the four lines above | − ₹26.97 |
| **Marketplace settlement** | | **₹322.17** |
| TCS (GST) | 0.5% of the taxable value, ₹475.24 | − ₹2.38 |
| TDS (194-O) | 0.1% of the sale | − ₹0.50 |
| **Bank credit** | | **₹319.29** |

That is the seller's ₹319, explained to the paisa. Roughly 36 percent of the listed price never reached his account, and most of that is fees plus the GST charged on them.

## Why the shipping line matters more than commission

Commission gets all the attention, but on a ₹499 product the shipping fee is the bigger single deduction in my example. It is also the one you control most.

Flipkart charges shipping on the higher of actual weight and volumetric weight, then rounds up to the next weight slab. A soft product packed in an oversized box can be billed a slab or two above what it really weighs.

Check this before you touch your price. The [Volumetric Weight Calculator](/volumetric-weight-calculator/) shows which weight is being billed and how close you are to the slab boundary. Moving a best seller from a box into a courier bag can save more per order than a commission negotiation ever will.

## TCS and TDS: deducted, but not lost

These two lines confuse people because they look like fees. They are not.

**TCS** is tax collected at source under GST. Marketplaces collect it on the net taxable value of your sales, and the rate was cut from 1 percent to 0.5 percent in July 2024. It shows up in your GST portal and can be used against your GST liability.

**TDS under section 194-O** is income tax deducted on your sales. The rate dropped from 1 percent to 0.1 percent in October 2024. It appears in your Form 26AS and counts toward your income tax.

Both only come back if your GSTIN and PAN on Seller Hub match your filings. If they do not match, the credit sits in limbo. That is worth checking once, today.

Rates like these get revised in budgets, so verify the current ones rather than relying on any article's figures.

## GST on the sale, and the credit that offsets it

There is one more line that the settlement statement does not show you, because Flipkart does not deduct it: the GST you owe on the sale itself.

At ₹499 including 5 percent GST, the taxable value is ₹475.24 and the GST is ₹23.76. You owe that to the government whatever Flipkart pays you.

The useful part: the ₹26.97 of GST on Flipkart's fees is usually available to a regular registered seller as input tax credit. In this example it more than covers the ₹23.76 owed. The [GST Calculator](/gst-calculator/) splits any inclusive price into taxable value and tax if you want to check your own products.

## From settlement to profit

Settlement is not profit. Take the ₹322.17 settlement, subtract a product cost of ₹220 including packaging and the ₹23.76 GST on the sale, and you have about ₹78 on a delivered order, before counting the input tax credit.

Now add returns. If one order in ten comes back and each return costs you ₹120 in reverse shipping and repacking, your expected profit per order drops to about ₹59. That is the number to price against, not the ₹78.

The [Seller Profit Calculator](/profit-calculator/) runs this whole chain from a Flipkart preset, including the expected profit after returns. Change the preset rates to your rate card's and it becomes your own Flipkart settlement calculator.

## Reconciling your statement in ten minutes

Once a cycle, pick five orders from the settlement report and check them against this sequence.

1. Start from the selling price in the order details.
2. Subtract each fee line exactly as the statement lists it.
3. Add 18 percent GST on the fee total.
4. Subtract TCS and TDS.
5. Compare with the amount credited for that order.

If one order is off, look for a weight slab change or a return adjusted in the same cycle. If every order is off by the same proportion, your rate card has probably changed and your pricing sheet has not.

## What I would do this week

Run your three best sellers through the calculation by hand once, so you know where each rupee goes. Then put the real rates into the calculator and save the link, because the inputs are kept in the URL.

The order matters. Fix the shipping slab first, check your GSTIN and PAN so TCS and TDS come back, and only then decide whether the price itself needs to move.
`,
};
