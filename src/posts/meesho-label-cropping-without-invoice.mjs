export default {
  slug: 'crop-meesho-labels-without-invoice',
  marketplace: 'meesho',
  keyword: 'crop Meesho label without invoice',
  type: 'Type 2 — How-to / Guide',
  sentiment: '0.70 to 0.90 · Encouraging + Confidence-building',
  title: 'How to Crop Meesho Labels Without the Invoice (and Print 4 on One Page)',
  metaTitle: 'Crop Meesho Labels Without Invoice — Save Paper Daily',
  description: 'A tested, step-by-step way to remove the tax invoice from Meesho label PDFs, sort by SKU, and fit four labels on one A4 sheet. Free, no upload, takes about a minute.',
  excerpt: 'Meesho puts the label and the tax invoice on one A4 page. Here is how to keep just the label, sort the batch by SKU, and cut a 100-order print run from 100 sheets to 25.',
  published: '2026-09-22',
  updated: '2026-09-22',
  cover: 'label-crop',
  coverAlt: 'Diagram of an A4 page where the shipping label block is kept and the tax invoice below it is trimmed away',
  tools: ['meesho-label-cropper', 'pages-per-sheet', 'picklist-generator'],
  faq: [
    { q: 'Can I remove the tax invoice from a Meesho label PDF?', a: 'Yes. The invoice sits below the shipping label on the same page, so a cropper can cut at the TAX INVOICE heading and keep only the label block. Keep a digital copy of the full PDF for your records before you crop.' },
    { q: 'Do I legally need to stick the invoice on the parcel?', a: 'Meesho generates the tax invoice for the order and makes it available in your supplier panel. Whether a printed copy must travel with the parcel depends on the current Meesho policy and your state e-way bill rules, so check your supplier panel before you stop printing invoices.' },
    { q: 'How many Meesho labels fit on one A4 sheet?', a: 'Four cropped labels fit comfortably on one A4 sheet in a 2x2 grid, and two fit if you want them larger. That takes a 100-order run from 100 sheets down to 25.' },
    { q: 'Will the barcode still scan after cropping?', a: 'It will, as long as the tool crops the page box instead of turning the page into an image. Cropping the page box keeps the barcode as vector artwork at full print quality.' },
  ],
  body: `
Last dispatch season I watched a friend print 120 Meesho labels. One hundred and twenty sheets of A4, each one with a shipping label on the top half and a tax invoice on the bottom half that nobody would ever read. He cut them apart with scissors for forty minutes.

That is the job this guide fixes. Here is the good news: you can crop Meesho labels without the invoice in about a minute, and the fix works the same whether you ship five orders a day or five hundred.

## Why Meesho label PDFs waste so much paper

When you download labels from the Meesho Supplier Panel, each order comes out as a full A4 page with two very different things stacked on it.

The top block is the shipping label. It carries the customer address, the return address, the courier name (Valmo, Delhivery, Xpressbees, Ekart and others), the AWB barcode and a small product table with your SKU, size, colour and quantity.

The bottom block is the tax invoice. It repeats the buyer and seller details, GSTIN, HSN code, taxable value and the GST split.

The courier only needs the top block. Your parcel only needs the top block. But the PDF hands you both, sized for a full sheet.

Let me explain why this matters in rupees. At roughly Rs. 0.60 per A4 sheet plus toner, 120 sheets a day works out to around Rs. 2,100 (about USD 25) a month in paper alone, before you count the time spent cutting. Four labels per sheet drops that to a quarter.

## What "cropping" actually means here

This is where it gets interesting, and it is worth understanding because it decides whether your barcodes still scan.

Every PDF page has a box that tells a viewer which part of the page to show. It is called the crop box. A good cropper changes that box so only the label area is visible. The underlying artwork is untouched.

The alternative, which some online tools do, is to turn each page into a picture and then trim the picture. That works visually, but it converts your crisp barcode into pixels. Print it small and scanners start failing.

> Rule of thumb: if a tool asks you to pick an image quality or DPI when cropping a PDF, it is rasterising your page. For shipping labels, you want the kind that edits the page box instead.

I tested this while building the [Meesho Label Cropper](/meesho-label-cropper/) on this site. Cropping by page box kept the AWB barcode as vector artwork, so it printed exactly as sharp as the original at any size.

## How to crop Meesho labels without the invoice

This part is actually really easy. The whole thing is three steps.

### Step 1: Download your label PDF

In the Meesho Supplier Panel, go to your orders, select the ones you are dispatching, and download the labels. You will get a single PDF with one page per order.

Keep that original file. Crop a copy, not the only copy you have. Your invoices live inside it and you may want them later for your books.

### Step 2: Crop and choose your layout

Open the [Meesho Label Cropper](/meesho-label-cropper/) and drop the PDF in. You can drop several days' files at once and they get merged in order.

Then pick three things:

- **Invoice: Without invoice.** This cuts each page at the TAX INVOICE heading and keeps the label block above it.
- **Output layout.** Choose *Label printer* if you feed 4x6 inch (100 x 150 mm) thermal rolls. Choose *A4, 4 per sheet* if you print on a normal inkjet or laser printer.
- **Sort by.** This is the step most people skip, and it is the one that saves the most time. More on it below.

### Step 3: Download and print

Hit crop and the new PDF downloads straight away. When you print it, turn off "Fit to page" or "Shrink oversized pages" in the print dialog and choose Actual size. The tool has already placed everything inside your margins, so letting the printer scale it again is what causes labels to come out slightly small.

You've got this. Once you do it a single time, the whole thing takes under a minute.

## The sorting trick that saves more time than the cropping

Here is the thing most guides miss. Cropping saves paper. Sorting saves labour.

By default your labels come out in whatever order Meesho generated them, which means a packer walks to the shelf, picks one kurta, packs it, walks back, picks one water bottle, packs it, and so on.

Sort the same batch by SKU and every order for the same product comes out together. The packer pulls twelve of one item once.

Sort by courier partner instead and all your Valmo labels group together, then Delhivery, then Xpressbees. Each courier bag gets filled in one pass instead of being opened and closed all day.

Based on what I have seen, SKU sorting is the better default for most sellers, because picking stock is usually slower than bagging parcels.

There is one more option worth switching on: stamping the SKU and quantity in large text under each label. Multi-quantity orders are the most common packing mistake, and a 14pt "QTY 3" under the label is much harder to miss than a number in a small table.

## Thermal roll or A4: which one should you use

Both work well. They suit different volumes.

| | Thermal printer (4x6) | A4 printer, 4 per sheet |
|---|---|---|
| Upfront cost | Rs. 6,000 to Rs. 12,000 | You likely own one |
| Running cost | No ink, thermal rolls only | Paper plus toner or ink |
| Speed | Very fast, one label at a time | Fast, then you cut |
| Cutting | None | Yes, four per sheet |
| Best for | Roughly 40+ orders a day | Lower and mixed volumes |

If you are dispatching under about forty orders a day, the A4 route is genuinely fine and you do not need to spend anything. Past that, a thermal printer usually pays for itself in a couple of months of saved paper and cutting time.

## What this means for you

Put together, a normal dispatch morning now looks like this:

1. Download the day's label PDF.
2. Run it through the [Picklist Generator](/picklist-generator/) first to get a SKU-wise list of what to pull from the shelf.
3. Pull the stock in one pass.
4. Crop and sort the labels, print 4 per A4.
5. Pack in the same order the labels came out.

The picklist step is the one sellers skip most often, and it is the one that stops you from discovering halfway through packing that you are short two units of something.

## A note on privacy, because labels are personal data

Your label PDF contains customer names, full addresses and phone numbers. That is personal data, and a lot of free "crop PDF online" sites upload your file to their server to process it.

The safer pattern is a tool that processes the file in your browser, so nothing is transmitted at all. The tools on this site work that way: you can switch off your Wi-Fi after the page loads and cropping still works, because the PDF never leaves your device.

If you use a different tool, it is worth checking their privacy policy for what happens to uploaded files and how long they keep them.

## My honest take

I think label cropping is the single highest-return ten minutes a new Meesho supplier can spend. It is not clever, it is not growth hacking, it just removes a repetitive cost that quietly compounds every day.

The sorting is the part I would push you hardest on. Paper is cheap. Your packer's attention is not, and mis-packed orders turn into returns, which cost far more than a sheet of A4.

Crop the invoice off, sort by SKU, stamp the quantity, print four to a page. That is the whole playbook, and you can set it up before your next dispatch.
`,
};
