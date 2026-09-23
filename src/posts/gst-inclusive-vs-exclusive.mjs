export default {
  slug: 'gst-inclusive-vs-exclusive-price',
  marketplace: 'tools',
  keyword: 'GST inclusive vs exclusive price',
  type: 'Type 1 — Comparison',
  sentiment: '0.65 to 0.85 · Positive + Empowering',
  title: 'GST Inclusive vs Exclusive Price: Which One Are You Actually Quoting?',
  metaTitle: 'GST Inclusive vs Exclusive Price: Know Which You Quote',
  description: 'GST inclusive vs exclusive price, explained with real numbers. Both are correct in the right place. Here is which to quote, and the reverse formula.',
  excerpt: 'Both ways of quoting a price are perfectly correct. Mixing them up on a single order is what quietly costs you the tax amount out of your own margin.',
  published: '2026-09-23',
  updated: '2026-09-23',
  cover: 'statement',
  coverAlt: 'Diagram comparing a price with GST added on top against a price with GST already contained inside it',
  tools: ['gst-calculator', 'gst-invoice-generator', 'profit-calculator'],
  faq: [
    { q: 'What is the difference between GST inclusive and exclusive price?', a: 'An exclusive price is the value before tax, so GST gets added on top. An inclusive price already contains the tax inside it, so nothing is added at checkout. Both describe the same sale, just measured at different points.' },
    { q: 'How do I remove GST from an inclusive price?', a: 'Divide by 1 plus the rate. At 18 percent, divide the inclusive price by 1.18. So Rs. 1,180 inclusive is Rs. 1,000 base plus Rs. 180 GST.' },
    { q: 'Do marketplace listing prices include GST?', a: 'Consumer-facing listed prices in India are shown inclusive of GST, so the figure a shopper sees already contains the tax. Your settlement report then separates the base value and the tax for you.' },
    { q: 'Which price do I use to work out my profit?', a: 'Always the exclusive base value. The GST portion is collected on the government behalf and passed on, so counting it as revenue will make every margin look healthier than it is.' },
  ],
  body: `
A seller once showed me two quotes he had sent the same week, for the same item, at what he thought was the same price. One said Rs. 1,000 and the other said Rs. 1,180.

He had not made a mistake in either. He had just quoted one exclusive and one inclusive, without saying which. Understanding GST inclusive vs exclusive price is one of those small things that stops a whole category of confusion.

Both are completely correct ways to state a price. They simply measure the sale at different points.

## What the two phrases actually mean

Let me explain with the plainest version I can.

**Exclusive** means the tax is not in the number yet. You quote the base value, and GST gets added on top at billing.

**Inclusive** means the tax is already sitting inside the number. Nothing gets added. The figure you quoted is the figure the buyer pays.

India runs on five main GST rate slabs set by the GST Council: 0, 5, 12, 18 and 28 percent, administered by the Central Board of Indirect Taxes and Customs. Which slab applies depends on your product category, not on which way you quote.

## GST inclusive vs exclusive price, side by side

Here is the same sale written both ways, at 18 percent.

| | Exclusive quoting | Inclusive quoting |
| --- | --- | --- |
| Figure you quote | Rs. 1,000 (about $12) | Rs. 1,180 (about $14) |
| GST added at billing | Rs. 180 | Nothing, already inside |
| Buyer pays | Rs. 1,180 | Rs. 1,180 |
| Your base revenue | Rs. 1,000 | Rs. 1,000 |

Look at the last two rows. The buyer pays the same and you keep the same. Nothing about the economics changes. Only the point at which you stated the number changes.

## The reverse calculation people get wrong

This is where it gets interesting, and it is the single most common slip I see.

To go from exclusive to inclusive you multiply. At 18 percent, that is times 1.18.

To go the other way you do not subtract 18 percent. You divide by 1.18.

Those are genuinely different answers. Take Rs. 1,180 inclusive:

- Divide by 1.18 and you get the correct base of Rs. 1,000, with Rs. 180 tax.
- Subtract 18 percent and you get Rs. 967.60, which is wrong by Rs. 32.40 on every single unit.

On 500 units a month that error is over Rs. 16,000 (roughly $190) of margin you thought you had. The [GST Calculator](/gst-calculator/) runs the division both directions so you are not doing this in your head at eleven at night.

### The same trick at every other rate

The divisor is always 1 plus the rate written as a decimal. There is no separate formula to memorise per slab.

- 5 percent: divide the inclusive price by 1.05
- 12 percent: divide by 1.12
- 18 percent: divide by 1.18
- 28 percent: divide by 1.28

That is the whole thing. Once you have that one line, you never need a lookup table again, and you can sanity-check any invoice in about five seconds.

## Which one should you quote?

You genuinely cannot go wrong with either, as long as you label it. The right choice depends on who is reading.

**Quote inclusive for consumers.** Retail buyers want the number they will actually pay. Marketplace listing prices in India are shown inclusive of GST for exactly this reason.

**Quote exclusive for businesses.** A GST-registered buyer claims the tax back as input credit, so the base value is the number that matters to them. Quoting inclusive to a wholesale buyer usually just means they ask you to restate it.

The one rule that covers both: write the word. "Rs. 1,180 inclusive of GST" removes every argument before it starts.

## Where this quietly costs sellers money

The damage almost never comes from choosing wrong. It comes from switching between the two without noticing.

The classic version is pricing a product against a competitor's inclusive listing using your own exclusive cost sheet. You look cheaper on paper, win the sale, and hand over the tax amount from your own pocket.

The other version is counting inclusive revenue as profit. That tax portion is collected on the government behalf and paid onward, so treating it as income makes every margin look better than it is. Feed the base value into the [Seller Profit Calculator](/profit-calculator/), never the inclusive figure.

## What this means for your invoices

A tax invoice has to show the base value, the rate, and the tax amount separately. That is not a formatting preference, it is what makes the document usable by a buyer claiming credit.

So even if you quote inclusive all day, your invoice still has to break the number apart. The [GST Invoice Generator](/gst-invoice-generator/) splits it for you and keeps the CGST and SGST halves right for an in-state sale.

## My take

Pick one convention for each audience and never mix them inside a single conversation.

I would quote inclusive to consumers, exclusive to businesses, and write the word "inclusive" or "exclusive" next to every figure that leaves my desk. It looks almost too simple to matter. It removes the most expensive small mistake in this whole topic.

Get GST inclusive vs exclusive price straight once, and pricing stops being something you second-guess.
`,
};
