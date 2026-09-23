export default {
  slug: 'profit-per-order-calculation',
  marketplace: 'tools',
  keyword: 'profit per order calculation',
  type: 'Type 3 — Informational / Educational',
  sentiment: '0.55 to 0.75 · Curious + Warm + Trustworthy',
  title: 'Profit per Order Calculation: The Costs Most Sellers Forget',
  metaTitle: 'Profit per Order Calculation: What Sellers Miss',
  description: 'A profit per order calculation that includes the costs people leave out: returns, GST treatment, packaging and the weight you were actually charged for.',
  excerpt: 'Selling price minus cost price minus commission is where most people stop. Three more lines decide whether the number is real.',
  published: '2026-09-23',
  updated: '2026-09-23',
  cover: 'chart',
  coverAlt: 'Diagram breaking an order value down into product cost, fees, shipping, returns and remaining profit',
  tools: ['profit-calculator', 'gst-calculator', 'volumetric-weight-calculator'],
  faq: [
    { q: 'What should a profit per order calculation include?', a: 'Product cost, marketplace commission, shipping at the chargeable weight, packaging, payment and collection charges, and an allowance for returns spread across every order you sell.' },
    { q: 'Should I use the GST inclusive or exclusive price?', a: 'Exclusive. The tax portion is collected and passed on, so treating it as revenue makes every margin look healthier than it is.' },
    { q: 'How do I account for returns in per-order profit?', a: 'Spread the cost. If a share of orders comes back and each one costs you both legs of shipping plus handling, divide that total across all orders sold rather than ignoring it.' },
    { q: 'Why does my bank settlement not match my calculation?', a: 'Usually because of fees deducted at settlement, returns adjusted in a later cycle, or GST on the fees themselves. Reconciling against the settlement statement is the only reliable check.' },
  ],
  body: `
A seller told me his margin was about 22 percent. We sat down with one month of settlement statements and worked through an actual profit per order calculation. The real figure was closer to 9 percent.

Nothing was wrong with his arithmetic. He was doing selling price, minus cost price, minus commission, and stopping there. Here is something most people do not realise: the lines after that one are usually where the margin goes.

## How a profit per order calculation actually works

Let me build it up in order, because each line changes the one before it.

Start with the base value of the sale, not the amount the customer paid. If you sell at Rs. 1,180 (about $14) inclusive of 18 percent GST, your base revenue is Rs. 1,000. That tax portion is collected on the government behalf and passed on.

From that base, subtract in this order:

1. **Product cost**, what you actually paid for the item.
2. **Marketplace commission**, on the value the marketplace calculates it on.
3. **Shipping**, at the weight you were charged for rather than the weight you measured.
4. **Packaging**, the box, the tape, the filler and the label.
5. **Payment and collection charges**, which differ between prepaid and cash on delivery.
6. **A returns allowance**, spread across every order.

The first two are the ones everyone includes. The last four are where the surprises live.

## The weight you were charged for, not the one you measured

This one catches people constantly, and it is genuinely interesting once you see it.

Couriers charge on whichever is greater: the actual weight, or the volumetric weight calculated from the box dimensions. The usual formula in India divides length by width by height in centimetres by 5000.

So a 30 x 25 x 20 cm box holding an 800 g item works out at 15,000 divided by 5000, which is 3 kg. You get billed for 3 kg, not 0.8 kg.

If your profit per order calculation uses the scale reading, every bulky item is quietly costing you more than your sheet says. The [Volumetric Weight Calculator](/volumetric-weight-calculator/) gives you the chargeable figure to put in the row instead.

## Returns are a cost of every order, not some orders

Here is the shift that changes the number most.

When a parcel comes back, you usually pay to send it out and pay again to bring it home, plus handling time, plus the item being off the shelf for a week.

It is tempting to treat that as a separate problem. It is not: it is a cost of doing business at your return rate, and it belongs in the per-order figure.

The method is simple. Take your total return cost for a month, divide it by the number of orders you shipped that month, and put that number in every calculation. Use your own return rate, because it varies enormously by category.

## What GST does to your fees

Most people are surprised by this one.

Marketplace fees generally carry GST themselves. If you are GST registered, that portion is normally claimable as input credit, which means the fee costs you less than the invoice line suggests.

If you are not registered, it is a straight cost. Two sellers with identical products and identical fees can therefore have genuinely different margins.

I would not guess at this. Reconcile one month against your settlement statement and see which lines carry tax and which do not.

## Why your calculation and your bank never match

Even a careful sheet drifts from the bank figure, and the reasons are mundane.

Fees are deducted at settlement rather than billed separately. Returns get adjusted in a later cycle than the sale. Some charges appear as a lump rather than per order.

So treat the per-order figure as a decision tool and the settlement statement as the truth. The first one tells you whether to list a product. The second one tells you what actually happened.

## What this means for pricing

The practical use is not knowing your margin to two decimal places. It is knowing which products are quietly unprofitable.

Run the calculation on your best seller and your bulkiest item. Sellers are often surprised that a high-volume small item beats a higher-priced large one, because the volumetric weight and the return rate eat the difference.

The [Seller Profit Calculator](/profit-calculator/) takes these rows at once so you can compare two products side by side rather than rebuilding a sheet each time.

## A warm takeaway

You do not need perfect numbers to get value from this. You need honest ones.

Even rough figures for returns and packaging will move your margin estimate closer to reality than leaving those rows blank. A profit per order calculation with approximate costs in every line beats an exact calculation that quietly assumes three of them are zero.

Do it for one product rather than your whole catalogue, because a single honest example teaches you more than a spreadsheet of guesses. Run it once on one product this week. The number may be lower than you expected, and knowing that is what lets you do something about it.
`,
};
