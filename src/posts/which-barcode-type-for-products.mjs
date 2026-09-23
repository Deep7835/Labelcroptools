export default {
  slug: 'which-barcode-type-for-products',
  marketplace: 'tools',
  keyword: 'which barcode type for products',
  type: 'Type 1 — Comparison',
  sentiment: '0.65 to 0.85 · Positive + Empowering',
  title: 'Which Barcode Type for Products? Code 128 and EAN-13 Compared',
  metaTitle: 'Which Barcode Type for Products? A Simple Guide',
  description: 'Which barcode type for products: Code 128 for your own SKUs, EAN-13 for retail. What each one is for, and why you cannot invent an EAN-13 yourself.',
  excerpt: 'Both are excellent, for completely different jobs. One is yours to use freely today. The other has to be allocated to you before it means anything.',
  published: '2026-09-23',
  updated: '2026-09-23',
  cover: 'code-types',
  coverAlt: 'Diagram comparing an internal stock barcode with a retail product barcode side by side',
  tools: ['barcode-generator', 'picklist-generator', 'qr-code-generator'],
  faq: [
    { q: 'Which barcode type should I use for my own stock?', a: 'Code 128. It encodes letters and numbers, so your existing SKU codes work as they are, and you can start using it today without registering anything.' },
    { q: 'Can I create my own EAN-13 barcode?', a: 'Not meaningfully. EAN-13 numbers are allocated through GS1 company prefixes so they stay globally unique. Inventing one risks clashing with a real product somewhere.' },
    { q: 'Do marketplaces need a GS1 barcode?', a: 'It depends on the marketplace and the category, and the rules change. Check your seller panel, because some listings accept your own codes while others require a registered one.' },
    { q: 'Does barcode size matter for scanning?', a: 'Yes. Scanners read the ratio between bars, but the narrow bar still has to print wide enough to be resolved. Printing too small is the usual reason a barcode fails intermittently.' },
  ],
  body: `
A seller printed 500 stickers with a barcode he had generated from a number he made up. They scanned perfectly on his phone. They were also, as far as any retail system is concerned, meaningless.

That is the trap worth avoiding, and it comes down to one question: which barcode type for products actually suits what you are doing. Both of the main options are genuinely good. They were built for different jobs.

## The two you will actually choose between

Let me introduce them properly, because the names give nothing away.

**Code 128** is a general purpose barcode, standardised as ISO/IEC 15417. It encodes letters, numbers and symbols, so a SKU like KRT-BLU-M goes in exactly as written.

**EAN-13** is the retail barcode, standardised as ISO/IEC 15420. It is the one on a shampoo bottle. It holds 13 digits and nothing else, and those digits are allocated rather than chosen.

## Which barcode type for products suits your case

Here is the distinction that decides it, and it is not about the bars at all.

Code 128 is yours to use. You invent the code, you print it, your systems read it. Nobody needs to know it exists outside your warehouse.

EAN-13 is a shared namespace. The whole point is that the number identifies one product globally, which only works if numbers are issued rather than picked. GS1, the organisation that maintains these standards, allocates company prefixes for exactly that reason.

So an EAN-13 you invented is not a shortcut, it is a number that may already belong to someone else's product.

| | Code 128 | EAN-13 |
| --- | --- | --- |
| Characters | Letters and numbers | 13 digits only |
| Who assigns it | You | Allocated via a GS1 prefix |
| Cost to start | None | Registration fee |
| Best for | Internal stock, picking, bins | Retail shelves, global listings |
| Can you start today | Yes | Not until allocated |

You genuinely cannot go wrong with either one, as long as you match it to the job.

## When Code 128 is the right answer

For most sellers reading this, it is.

If the barcode exists so that you and your team can identify stock faster, Code 128 does everything you need. It holds your real SKU, which means the scan result is already the code your spreadsheet uses.

That last point matters more than it sounds. A barcode that scans to your actual SKU removes a translation step. A numeric-only barcode means mapping numbers back to product codes somewhere.

Print your own with the [Barcode Generator](/barcode-generator/) and pair them with the [Picklist Generator](/picklist-generator/), so the codes on the shelf match the codes on the sheet you are picking against.

## When EAN-13 is worth the registration

If your products will sit on a physical retail shelf, or a marketplace category requires a registered identifier, this is the one.

The fee buys uniqueness, and uniqueness is the entire product. A retailer's system needs confidence that your number means your item and nobody else's.

Requirements differ by marketplace and category, and they do get updated, so check the current rule in your seller panel rather than relying on what was true last year.

## What about QR codes?

Worth a short answer, because people often ask about them in the same breath.

A QR code holds far more data and can be scanned from any angle by a phone camera. That makes it excellent for links, payment details and instructions on a card.

It is usually the wrong choice for stock identification. Warehouse scanners are built around linear barcodes, a QR takes more printed area for the same short code, and a SKU does not need the extra capacity.

Use a QR when the thing being encoded is a link or a payment. Use a linear barcode when it is an item.

## The sizing mistake that affects both

This is the practical failure I see most, and it applies whichever type you pick.

Scanners read the ratio between wide and narrow bars, which is why a modestly scaled barcode still works. What breaks is the narrow bar getting too thin for the printer to render cleanly.

On a common 203 dpi thermal print one dot is about 0.125 mm. Shrink far enough and a narrow bar stops being reliably more than a dot or two wide, and scans start failing sometimes rather than always.

Intermittent failure is the worst outcome, because it passes your test and fails at the counter. Print a test sticker at final size and scan it ten times, not once.

## What I would do

Start with Code 128 today, and treat EAN-13 as a decision for when a channel actually requires it.

Most sellers need faster internal identification long before they need a globally unique number. Solving the real problem now costs nothing, and the registered barcode can come later if a retailer asks for it.

Deciding which barcode type for products fits your case takes one question: does this code need to mean something outside my own business? Answer that, and the rest follows.
`,
};
