export default {
  slug: 'amazon-easy-ship-label-4x6-printing',
  marketplace: 'amazon',
  keyword: 'Amazon Easy Ship label 4x6 printing',
  type: 'Type 2 — How-to / Guide',
  sentiment: '0.70 to 0.90 · Encouraging + Confidence-building',
  title: 'How to Print Amazon Easy Ship Labels at True 4x6 (Without the Invoice Pages)',
  metaTitle: 'Print Amazon Easy Ship Labels at True 4x6 — Simple Guide',
  description: 'Amazon Easy Ship label PDFs put a 4x6 label on an A4 page and add invoice pages. Here is how to crop to true 4x6 for thermal rolls or fit four per A4 sheet.',
  excerpt: 'Amazon gives you a 4x6 label stranded on an A4 page, plus invoice pages you may not want to print. Both are a one-minute fix.',
  published: '2026-09-22',
  updated: '2026-09-22',
  cover: 'label-4x6',
  coverAlt: 'Diagram of a four by six inch shipping label being cropped out of a larger A4 page',
  tools: ['amazon-label-cropper', 'pages-per-sheet', 'pdf-crop'],
  faq: [
    { q: 'What size is an Amazon Easy Ship label?', a: 'The label artwork is designed for the standard 4 x 6 inch (100 x 150 mm) thermal label format, but the PDF places it on a larger page, which is why it needs cropping before it prints correctly on a roll.' },
    { q: 'How do I remove invoice pages from an Amazon label PDF?', a: 'Invoice pages carry headings like Tax Invoice or Bill of Supply and no shipping barcode block, so a cropper can detect and skip them. Always keep the original PDF, since you need invoices for your records.' },
    { q: 'Why will my Amazon barcode not scan after printing?', a: 'Almost always because the print dialog scaled the page. Turn off Fit to page and choose Actual size. A barcode printed at 92 percent can fall below the scanner tolerance.' },
    { q: 'Can I print Amazon labels without a thermal printer?', a: 'Yes. Crop the labels and arrange two or four per A4 sheet on a normal printer, then cut. It works well and costs nothing to start.' },
  ],
  body: `
The first time I opened an Amazon Easy Ship label PDF on a thermal printer, it printed a 4x6 label about the size of a postage stamp in the corner of the roll. Nothing was broken. The printer was faithfully shrinking an A4 page onto a 4x6 label.

Here is the good news: this is a two-setting fix, and once you set it up you never think about it again. Let me walk through it.

## What is actually inside the PDF

When you print labels from Seller Central (Manage Orders, then Buy Shipping or print labels), you get a PDF that usually contains two kinds of page.

**Label pages.** A 4 x 6 inch shipping label block placed on a larger page, typically A4. It carries the Ship To address, the shipment ID, the AWB barcode and your SKU and quantity.

**Invoice pages.** Full pages headed Tax Invoice, Bill of Supply or Cash Memo, with the seller GSTIN, item table and totals.

The courier needs the first kind. Your accounts need the second kind, but they do not need to be printed and stuck on a parcel.

So the job is: keep the label block at its true size, and decide separately what to do with the invoices.

## Why the label comes out tiny (or cut off)

This is worth understanding because it explains both failure modes people hit.

A PDF page has a size. Your thermal printer has a 4 x 6 inch roll. When you send an A4 page to a 4x6 printer, the driver has two options: shrink the whole page to fit (tiny label), or print at full size and clip everything outside the roll (cut-off label).

Neither is the printer misbehaving. The page is simply the wrong size.

The fix is to change the page itself so it **is** 4 x 6 inches, with the label filling it. Then the printer has nothing to decide.

> Key point: crop the page, do not scale the print. Scaling at print time is what makes barcodes fail. Cropping changes the page box while leaving the artwork at exactly its original size.

## Printing Amazon Easy Ship labels at true 4x6: the three-step fix

This part is actually really easy.

### Step 1: drop the PDF into the cropper

Open the [Amazon Label Cropper](/amazon-label-cropper/) and drop your file in. You can add several days' files at once.

It reads each page, works out whether it is a label page or an invoice page, and crops label pages to their printed content.

### Step 2: choose invoice handling and layout

**Invoice mode.** Choose *Without invoice* and pages headed Tax Invoice or Bill of Supply are skipped entirely. Choose *With invoice* and they are kept, trimmed of blank margin.

A word of caution here. Keep your original PDF. Amazon makes invoices available in Seller Central, but having your own copy of what you dispatched is genuinely useful at filing time. Crop a copy, never your only copy.

**Output layout.**

- For a thermal roll printer: choose **Label printer** and switch on **Fit to 4 x 6 in**. Every label is scaled onto a true 100 x 150 mm page, so the roll prints edge to edge.
- For a normal printer: choose **A4, 4 per sheet** with the cut border on.

### Step 3: print at actual size, then test one

In the print dialog, turn off "Fit to page" and "Shrink oversized pages", and choose **Actual size** or 100 percent.

Print one label. Scan the barcode with your phone. If it reads, print the rest.

That ten-second test has saved me from reprinting an entire batch more than once.

## Will the barcode survive cropping?

Yes, and here is why it is worth knowing the difference.

A good cropper changes the page's crop box, which is a lossless operation. The barcode stays as vector artwork at full print quality, exactly as Amazon generated it.

A tool that converts each page into an image and then trims it will give you a barcode made of pixels. It may look fine on screen and still fail at the scanner, especially at small sizes.

If a PDF tool asks you to choose a DPI or image quality while cropping, it is rasterising. For shipping labels, you want the other kind.

## Sorting, if you dispatch more than a few orders

Once cropping is sorted, there is a second gain available.

Sort the batch by SKU before printing. All orders of the same ASIN come out together, so your packer pulls a stack of one item rather than walking back and forth.

There is also an option to stamp the SKU and quantity in large text under each label. Multi-unit orders are where packing mistakes cluster, and a big "QTY 2" is much harder to miss than a small number in the product block.

## When the automatic detection is not sure

Amazon has several label formats and they do get revised. Most of the time detection works cleanly, but if you ever get a file where something looks off, you have two fallbacks.

**Use the universal cropper.** The [Universal Label Cropper](/shipping-label-cropper/) detects the marketplace per page, so a merged file with Amazon, Flipkart and Meesho labels in it still crops correctly.

**Draw the crop yourself.** The [PDF Crop](/pdf-crop/) tool gives you a live preview and a draggable box, with exact millimetre values. For a true 4x6, type a width of 101.6 mm and a height of 152.4 mm and position it over the label.

That manual option is also useful for any courier or aggregator label that no automatic tool recognises.

## Thermal or A4: a quick steer

Both work. The honest dividing line is volume.

Under roughly forty orders a day, A4 with four labels per sheet is completely fine and costs nothing to start. You cut once in the morning and get on with it.

Past that, a thermal printer (roughly Rs. 6,000 to Rs. 12,000, about USD 70 to USD 145) usually pays back within a few months on saved paper and toner, and it removes cutting entirely.

If you want to arrange labels into a custom grid, the [Pages per Sheet](/pages-per-sheet/) tool lets you set 2, 4, 6, 8, 9 or 16 per sheet with your own margins and cut borders.

## One thing about privacy

Your label PDF contains customer names, full addresses and phone numbers.

A lot of free online PDF tools upload your file to a server to process it. The tools on this site do the work in your browser instead, so nothing is transmitted. You can turn off your Wi-Fi after the page loads and cropping still works.

If you use a different tool, read their privacy policy for what happens to uploaded files and how long they are retained. Customer addresses are not something to hand over casually.

## Putting it together

Your Easy Ship routine, once it is set up:

1. Print the day's orders from Seller Central.
2. Drop the PDF in the cropper, invoices off, Fit to 4 x 6 in, sorted by SKU.
3. Print one, scan it, print the rest.
4. Pack in label order.

That is under two minutes of setup on top of work you were already doing, and you get true-size labels that scan first time.

Once you do this once, it becomes second nature. You've got this.
`,
};
