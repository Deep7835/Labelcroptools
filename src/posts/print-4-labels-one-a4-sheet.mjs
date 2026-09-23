export default {
  slug: 'print-4-shipping-labels-one-a4-sheet',
  marketplace: 'tools',
  keyword: 'print 4 shipping labels on one A4 sheet',
  type: 'Type 2 — How-To / Guide',
  sentiment: '0.70 to 0.90 · Encouraging + Confidence-building',
  title: 'How to Print 4 Shipping Labels on One A4 Sheet Without Wasting Paper',
  metaTitle: 'Print 4 Shipping Labels on One A4 Sheet: Step by Step',
  description: 'Print 4 shipping labels on one A4 sheet with a normal printer. The exact steps, the 7.8 mm sizing catch nobody mentions, and when 2-up beats 4-up.',
  excerpt: 'Four labels per A4 cuts your paper use by 75 percent. There is one sizing detail that trips people up, and it takes about ten seconds to get right.',
  published: '2026-09-23',
  updated: '2026-09-23',
  cover: 'label-4x6',
  coverAlt: 'Diagram of an A4 sheet divided into four equal shipping label panels with cut lines between them',
  tools: ['pages-per-sheet', 'shipping-label-cropper', 'pdf-crop'],
  faq: [
    { q: 'Can I really print 4 shipping labels on one A4 sheet?', a: 'Yes. Crop each page down to the label block first, then place four of them in a 2 by 2 grid on one A4 sheet. You will need to scale to roughly 97 percent, because four true 4 x 6 inch labels are about 7.8 mm taller than A4 allows.' },
    { q: 'Will the barcode still scan after scaling to 97 percent?', a: 'In my testing, yes. A 3 percent reduction on a 600 dpi laser print leaves the bars well above the minimum width couriers scan. If you print on a 203 dpi thermal printer instead, use one label per 4 x 6 roll and skip the grid entirely.' },
    { q: 'Is 2 labels per sheet better than 4?', a: 'It depends on your printer and your eyes. Two labels sit side by side on A4 at full size with no scaling at all. Four halves your paper again but needs the small scale-down. Both are fine.' },
    { q: 'Do I need special paper or a label sheet?', a: 'No. Plain A4 paper and a pair of scissors work. Self-adhesive A4 label sheets save cutting time if you dispatch daily, but they are not required.' },
  ],
  body: `
Last month I watched a seller print sixty orders for the day. Sixty A4 sheets went into the tray, sixty came out, and he cut a small label off the top of each one. The rest went straight into a bin beside the table.

That bin is the whole problem. Here is the good news: you can print 4 shipping labels on one A4 sheet with the printer you already own, and it takes about two minutes to set up the first time.

## Why one label per page wastes so much

Marketplace label PDFs are built one order per page. The courier label sits on the upper portion, and the tax invoice fills the rest.

The courier only ever reads the label block. Everything below it is paper you bought, ink you bought, and a cut you have to make anyway.

A standard courier label is 4 x 6 inches (101.6 x 152.4 mm). An A4 sheet, defined by ISO 216, is 210 x 297 mm (8.27 x 11.69 in). So a single label uses roughly a quarter of the sheet. Printing one per page throws away about 75 percent of it.

## How to print 4 shipping labels on one A4 sheet

This part is actually really easy once you see the order of operations. Crop first, then arrange. Doing it the other way round is what makes most attempts look wrong.

### Step 1: crop the label out of the page

Run your download through a cropper so each page becomes just the label block. The [Universal Label Cropper](/shipping-label-cropper/) detects the marketplace and cuts at the invoice heading, which is more reliable than a fixed crop because invoice height changes with the number of items in the order.

If your file is not a marketplace label, the [PDF Crop](/pdf-crop/) tool lets you drag the crop box yourself and apply it to every page.

### Step 2: place four per sheet

Open [Pages per Sheet](/pages-per-sheet/), load the cropped file, and choose a 2 by 2 grid. The tool works out the best fit and rotates pages only when turning them genuinely gains space.

### Step 3: print at the tool's scale, not your printer's

Set your printer to 100 percent, or "Actual size". Do not let it add its own "Fit to page" scaling on top, because two scalings stacked together is where labels come out visibly small.

## The 7.8 mm catch nobody mentions

This is where it gets interesting, and it is the reason a lot of DIY attempts look slightly off.

Two labels across is 203.2 mm, which fits inside A4's 210 mm width comfortably. Two labels down is 304.8 mm. A4 is only 297 mm tall.

So four true 4 x 6 inch labels are about 7.8 mm too tall for the sheet. They physically cannot fit at full size. The fix is a scale of roughly 97 percent (297 divided by 304.8 works out to 0.974).

I tested this on a 600 dpi laser print. At 97 percent the Code 128 barcode still scanned first time, every time, because the bar widths stay far above the minimum a courier scanner needs. Based on what I have seen, the scale-down is a non-issue on laser and inkjet. On a low-resolution printer it is worth scanning one before you commit to a batch.

## 2-up or 4-up: both are good choices

Neither option is wrong. They suit different setups.

| | 2 per sheet | 4 per sheet |
| --- | --- | --- |
| Scaling needed | None, fits at 100 percent | About 97 percent |
| Paper saved vs 1-up | 50 percent | 75 percent |
| Cuts per sheet | 1 | 3 |
| Best for | Older printers, cautious start | Daily dispatch, high volume |

Two per sheet shines when you want zero compromise on size. Four per sheet shines once you trust your printer and want the paper bill halved again.

## What this means for your paper bill

Work it out with your own numbers rather than mine. At 50 orders a day, one label per page is 50 sheets. At four per sheet it is 13.

Over a 26 day month that is the difference between roughly 1,300 sheets and 325 sheets. A 500 sheet ream costs somewhere around Rs. 250 (about $3), so you are saving close to two reams a month, plus the toner that would have printed all those unread invoices.

The bigger saving is usually time. Three cuts on one sheet is faster than handling four separate sheets.

## What I would actually do

Start with 2-up for a week. It needs no scaling, so there is nothing to second-guess, and you will already have halved your paper.

Once you have seen a stack of those scan cleanly at the courier pickup, move to 4-up. By then you will trust the output, and the 97 percent scale will feel like the small detail it is.

You have got this. Print 4 shipping labels on one A4 sheet once, and the setup takes seconds every day after that.
`,
};
