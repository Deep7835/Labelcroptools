export default {
  slug: 'sort-meesho-labels-by-sku',
  marketplace: 'meesho',
  keyword: 'sort Meesho labels by SKU',
  type: 'Type 2 — How-To / Guide',
  sentiment: '0.70 to 0.90 · Encouraging + Confidence-building',
  title: 'How to Sort Meesho Labels by SKU Before You Print a Single Page',
  metaTitle: 'Sort Meesho Labels by SKU Before Printing: How and Why',
  description: 'Sort Meesho labels by SKU before printing and your packing order matches your shelf order. Here is the method, and why it beats sorting parcels later.',
  excerpt: 'Printing in download order makes you walk the shelf once per parcel. Printing in SKU order makes you walk it once per product. That is the whole trick.',
  published: '2026-09-23',
  updated: '2026-09-23',
  cover: 'sort-sku',
  coverAlt: 'Diagram showing shuffled shipping labels being reordered into groups by product code',
  tools: ['meesho-label-cropper', 'picklist-generator', 'pages-per-sheet'],
  faq: [
    { q: 'Why sort Meesho labels by SKU instead of by order?', a: 'Because your shelf is arranged by product, not by order time. Sorting by SKU means you pick one product once and pack every parcel needing it, instead of returning to the same shelf twenty times.' },
    { q: 'Does sorting change the label itself?', a: 'No. Sorting only changes the page order inside the PDF. Every barcode, address and courier detail stays exactly as Meesho generated it.' },
    { q: 'What if one order has several different SKUs?', a: 'A multi-item order gets one label, so it can only sit in one place. Group it under its first SKU and pull the rest of the items while you are there, using a picklist as your cross-check.' },
    { q: 'Can I sort by courier instead?', a: 'Yes, and many sellers do both. Sort by courier first if you have separate pickup times, then by SKU inside each courier group.' },
  ],
  body: `
I watched a seller pack forty parcels one afternoon. He walked to the same shelf of kurtis eleven separate times, because the labels came out in whatever order Meesho generated them.

Here is the good news. If you sort Meesho labels by SKU before printing, that same forty parcels needs one visit per product instead of one visit per order. Nothing about the labels changes. Only their order does.

## Why the download order works against you

Meesho hands you labels in order-creation sequence. That order is meaningless to your shelf.

Your inventory is arranged by product. Blue kurti in one place, phone case in another. So picking in order sequence means bouncing between shelves, and every bounce is a chance to grab the wrong variant.

This is the part most people underestimate. The walking is annoying, but the real cost is picking errors, which turn into returns later.

### Quick note on what a SKU actually is

A SKU (stock keeping unit) is your own code for one exact sellable thing. Not the product family, the specific variant.

A blue kurti in size M is one SKU. The same kurti in size L is a different one. If your codes do not separate size and colour, sorting will group together things your shelf keeps apart, and most of the benefit disappears.

Fixing your codes is worth an evening of work. Picking, counting and returns all lean on them.

## How to sort Meesho labels by SKU

This part is actually easier than it sounds, because the SKU is already printed on every label.

### Step 1: crop the pages first

Run the download through the [Meesho Label Cropper](/meesho-label-cropper/). It reads the text on each page, cuts away the tax invoice, and keeps the label block.

Cropping first matters because the cropper is already reading each page to find the invoice heading. The SKU is right there in the same pass.

### Step 2: choose SKU as the sort order

Pick the SKU sorting option before you generate the output. The tool reorders the pages so every parcel needing the same product sits together.

### Step 3: print in that order and pack straight down the stack

Do not shuffle the stack afterwards. The whole point is that the paper order now matches your shelf order.

## What changes on the packing table

The difference shows up immediately in how you move.

| | Download order | Sorted by SKU |
| --- | --- | --- |
| Shelf visits for 40 parcels | Up to 40 | One per distinct product |
| Chance of grabbing wrong variant | Higher, you revisit constantly | Lower, you handle one product at a time |
| Easy to count stock as you go | No | Yes, you see the full run at once |

That last row is the one sellers tell me about afterwards. When every parcel for a product is together, you notice you are short before you have packed half the batch.

## A quick check before you trust the stack

Fan the printed stack once and look at the SKU line on a handful of pages.

You are looking for runs of the same code sitting together. If you see the codes jumping around, the sort did not apply, usually because the output was generated before the sort option was selected.

Ten seconds of checking saves you from packing a whole batch in the wrong sequence.

## Add a picklist and it gets better

Sorting fixes the order. A picklist fixes the counting.

The [Picklist Generator](/picklist-generator/) reads the same file and gives you totals per SKU, size and colour. So you can pull all eleven blue kurtis in one trip, check them against the number on the sheet, then pack.

I would use both together. Sorted labels tell you the sequence. The picklist tells you the quantity. Neither one replaces the other.

## What this means for a normal day

Work it out with your own numbers, because the saving scales with how many parcels share a product.

If you sell 40 orders a day across 12 distinct products, download order means roughly 40 shelf trips. Sorted order means about 12. At even 20 seconds of walking per trip, that is close to 10 minutes back.

The error reduction matters more than the minutes. Based on what I have seen, most wrong-item returns start as a pick made in a hurry while walking past the right shelf on the way to another one.

## One honest limitation

Sorting cannot help a multi-item order much. That parcel gets a single label, so it lives in one group only.

The fix is not clever software, it is sequence. Pack your single-item runs first, then handle multi-item orders at the end with the picklist in front of you. Those are the parcels worth slowing down for.

## What I would do tomorrow

Try it on one day's batch before changing anything else about your process.

Crop, sort by SKU, print, and pack straight down the stack without rearranging. You will know within half an hour whether it suits how your shelves are laid out.

Once you sort Meesho labels by SKU a few times, going back to download order feels like packing with your eyes closed. You have got this, and it costs nothing to test.
`,
};
