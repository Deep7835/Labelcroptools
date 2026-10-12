export default {
  slug: 'print-sku-barcodes-in-bulk',
  marketplace: 'tools',
  keyword: 'bulk barcode generator for SKUs',
  type: 'Type 2 — How-To / Guide',
  sentiment: '0.70 to 0.90 · Encouraging + Practical',
  title: 'Bulk Barcode Generator for SKUs: From a Spreadsheet Column to a Sticker Sheet',
  metaTitle: 'Bulk Barcode Generator for SKUs: List to A4 Sheet',
  description: 'Use a bulk barcode generator to turn your SKU list into sticker sheets: which A4 layout to pick, how long a SKU can be, and how to test before printing 500.',
  excerpt: 'Typing barcodes one at a time stops making sense around SKU number ten. Paste the whole column, pick the sticker sheet you already own, and print the lot.',
  published: '2026-10-12',
  updated: '2026-10-12',
  cover: 'barcode-sheet',
  coverAlt: 'Diagram of a list of product codes becoming a full A4 sheet of barcode stickers',
  tools: ['barcode-generator', 'picklist-generator', 'meesho-label-cropper'],
  faq: [
    { q: 'How do I generate barcodes in bulk for free?', a: 'Paste your SKU list into the Barcode Generator in Bulk mode, one code per line, choose Code 128 and the A4 sticker layout you own, and download the PDF label sheet. It runs in your browser with no signup and no limit.' },
    { q: 'Which sticker sheet should I buy for SKU barcodes?', a: 'For bins and shelves, 24 or 40 labels per A4 gives room for a readable caption. For small poly bags or tags, 65 per A4 works if your SKU codes are short.' },
    { q: 'Why will my printed barcode not scan?', a: 'Usually because the PDF was printed at Fit to page instead of Actual size, which shrinks the bars, or because a long SKU was squeezed onto a very small sticker. Print at 100 percent and use a larger sticker for long codes.' },
    { q: 'Can I print several copies of each barcode?', a: 'Yes. Set Copies of each and every value in the list is repeated that many times on the sheet, which suits labelling every unit of a product rather than just its bin.' },
  ],
  body: `
A seller sent me a photo of his desk: a printed list of 140 SKUs and a free barcode website open on the laptop. He had done 23 of them, one at a time, copying each image into a Word document.

A bulk barcode generator for SKUs does that whole job in one go. You paste the column from your spreadsheet, pick the sticker sheet sitting in your drawer, and download a PDF that prints all 140 at once.

## Quick answers

### What is the fastest way to print barcodes for all my SKUs?

Copy the SKU column from your spreadsheet, paste it into the [Barcode Generator](/barcode-generator/) in Bulk mode, choose Code 128, and download the PDF label sheet. One code per line is all it needs.

### Which barcode type should I use for SKUs?

Code 128. It encodes letters, digits and hyphens, so the barcode holds your actual SKU and the scan result matches your spreadsheet. EAN-13 is for retail products with a registered GS1 number.

## How to use a bulk barcode generator for SKUs

This is a ten minute job the first time and two minutes every time after.

### Step 1: clean the column first

Open your product sheet and copy the SKU column only. Check for trailing spaces and duplicates before you paste, because a barcode encodes exactly what you give it. \`KRT-BLU-M \` with a space is a different code from \`KRT-BLU-M\`.

### Step 2: paste and add captions

Switch to Bulk mode and paste, one SKU per line. If you want a readable name above the bars, add a pipe and the caption after each code:

\`KRT-BLU-M | Blue Kurta M\`

The caption is printed text only. The barcode still encodes just the SKU, which is what you want the scanner to return.

### Step 3: choose the sheet you own

Pick the layout that matches your sticker paper. Getting this right matters more than any other setting, because a mismatched layout prints across the gaps between stickers.

### Step 4: download, then test one sheet

Download the PDF label sheet and print one page on plain paper first. Hold it against a sticker sheet up to the light. If the barcodes sit inside the sticker outlines, print the rest on the real stock.

## Which A4 sticker layout to pick

The generator matches the standard A4 sheets sold in most Indian stationery shops.

| Layout | Sticker size | Good for |
|---|---|---|
| 65 per A4 | 38.1 x 21.2 mm | Small tags, poly bags, short SKUs |
| 40 per A4 | 52.5 x 29.7 mm | Product units with a short caption |
| 24 per A4 | 70 x 37 mm | Shelf bins, longer SKUs with captions |
| 12 per A4 | 105 x 48 mm | Large bins and cartons read from a distance |
| 4 x 6 thermal | One per label | Sellers with a thermal label printer |

If you are unsure, buy 24 per A4. It has room for a caption the picker can read without scanning, and it fits SKUs that are longer than you planned.

## How long can a SKU be on a small sticker?

Code 128 gets wider as the SKU gets longer. On a 38.1 mm sticker, a long code squeezes the bars so thin that a phone camera struggles to read them.

My rule of thumb: keep SKUs on 65-up stickers to around ten characters. Beyond that, move to the 40 or 24 layouts rather than shrinking the bar width.

This is one more reason to keep SKU codes short and structured. The guide on [naming seller SKU IDs](/blog/flipkart-sku-id-fsn-organisation/) has a pattern that stays readable at small sizes.

## Bin labels versus unit labels

Decide what the barcode is for before you print 500 of them.

**Bin or shelf labels** need one copy per SKU. They let a picker confirm they are at the right shelf, and they rarely need replacing.

**Unit labels** go on every individual product, so set Copies of each to your stock count. Use the smaller sheets here, and print them as stock arrives rather than all at once.

Most small sellers get 80 percent of the benefit from bin labels alone. Start there.

## Make the shipping label match the shelf

The barcode on the bin is only half of the check. The other half is the SKU on the shipping label the packer is holding.

The [Meesho label cropper](/meesho-label-cropper/) and the [Flipkart label cropper](/flipkart-label-cropper/) can stamp the SKU and quantity in large text under every label. Now the packer reads \`KRT-BLU-M\` on the label, walks to the bin with \`KRT-BLU-M\` on it, and the two match without anyone squinting at a product table.

Add the [Picklist Generator](/picklist-generator/) for the morning pull and the loop is closed: the picklist, the shelf barcode and the label all use the same code.

## The printing mistake that ruins a whole sheet

Print at Actual size, or 100 percent. Never Fit to page.

Fit to page shrinks everything by a few percent. The barcodes drift off the stickers, and the bars get thinner, which hurts scanning. If one sheet comes out misaligned, check this setting before blaming the sticker paper.

## What I would do this week

Copy your SKU column, generate bin labels on a 24 per A4 sheet, and stick them on your top twenty products first.

Scan five of them with your phone before you label the rest. If all five read cleanly, print the remainder. The whole catalog is usually labelled in one afternoon.
`,
};
