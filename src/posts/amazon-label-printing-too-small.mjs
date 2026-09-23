export default {
  slug: 'amazon-label-printing-too-small',
  marketplace: 'amazon',
  keyword: 'Amazon label printing too small',
  type: 'Type 5 — Problem / Solution',
  sentiment: '0.60 to 0.80 · Reassuring + Solution-focused',
  title: 'Amazon Label Printing Too Small? Here Is What Is Actually Happening',
  metaTitle: 'Amazon Label Printing Too Small? The Real Fix',
  description: 'Amazon label printing too small is almost always double scaling, not a broken file. Here is the arithmetic behind it and the three settings that fix it.',
  excerpt: 'A label that comes out at half size has usually been scaled twice, once by the tool and once by the printer driver. The fix is to let only one of them do it.',
  published: '2026-09-23',
  updated: '2026-09-23',
  cover: 'scale-small',
  coverAlt: 'Diagram comparing a correctly sized shipping label with the same label shrunk by page fitting',
  tools: ['amazon-label-cropper', 'pdf-crop', 'pages-per-sheet'],
  faq: [
    { q: 'Why is my Amazon label printing too small?', a: 'Nearly always because the page got scaled twice. The A4 page is shrunk to fit 4 x 6 inch label stock, which is about a 48 percent reduction, and any crop or fit setting on top of that shrinks it again.' },
    { q: 'What print setting should I use for Amazon labels?', a: 'Set scaling to Actual size or 100 percent and turn off fit to page. Crop the page to the label first, so there is nothing left that needs fitting.' },
    { q: 'Will a slightly small barcode still scan?', a: 'Usually yes down to small reductions, because scanners read bar width ratios rather than absolute size. Below roughly half size the bars get too narrow to read reliably on a standard 203 dpi print.' },
    { q: 'Do I need a thermal printer to get this right?', a: 'No. A normal laser or inkjet printing cropped labels onto A4 works fine. Thermal helps with speed and running cost at higher volume, not with correctness.' },
  ],
  body: `
A seller sent me a photo of his printouts last month. The Amazon Easy Ship label was sitting in the middle of a 4 x 6 inch sticker, taking up maybe half of it, with white space all around.

He was convinced the download was faulty. It was not. If your Amazon label printing too small is the problem you are hitting, the file is almost certainly fine and the fix takes one setting. Do not worry, this is one of the most common printing issues sellers run into.

## Why your Amazon label is printing too small

Let me explain with the arithmetic, because once you see it the whole thing makes sense.

Amazon Easy Ship gives you an A4 page. Under ISO 216 that is 210 mm wide (8.27 in). Your label stock is 4 x 6 inches, so 101.6 mm wide (4 in).

To make a 210 mm page fit on 101.6 mm stock, the printer driver shrinks it to about 48 percent. That shrink applies to everything on the page, including the label block that was already the right size.

So you asked for a label and got roughly half a label, surrounded by the empty margin that used to be the rest of the A4 sheet.

## The double scaling trap

This is the version that confuses people most, because they have already done something right.

You crop the page down to the label, which is correct. Then you send it to the printer with fit to page still switched on. The driver sees a page it wants to fit, and shrinks your already-correct label a second time.

Two scalings stack. A 90 percent crop and an 85 percent fit leave you at about 77 percent, and nobody set out to ask for 77 percent.

The rule that solves it: exactly one thing in the chain is allowed to resize. Never two.

## The three settings that fix it

Here is exactly what to do, in order.

1. **Crop the page to the label block first.** Use the [Amazon Label Cropper](/amazon-label-cropper/), which detects Easy Ship pages, drops invoice pages and cuts to a true 4 x 6 proportion.
2. **Set the printer to Actual size.** Some drivers call it 100 percent, some call it None under scaling. Turn off fit to page, shrink to printable area and any similar option.
3. **Match the paper size to your stock.** If you are on 4 x 6 sticker rolls, set the paper size to 4 x 6, not A4. Mismatched paper size is what makes the driver want to rescale in the first place.

Once the page and the stock are the same size, there is nothing left to fit, and the driver stops interfering.

## How to tell if a barcode will still scan

Most people are surprised by how tolerant barcode scanning is, and by where the real limit sits.

Scanners read the ratio between wide and narrow bars, not the absolute size. That is why a modestly reduced label still reads fine.

What breaks is the narrow bar getting too thin for the print resolution. On a common 203 dpi thermal print, one dot is about 0.125 mm. Shrink a barcode far enough and a narrow bar stops being reliably more than one or two dots wide, and scans start failing intermittently.

Intermittent is the dangerous word there. A label that scans on your phone but fails at the courier hub is worse than one that clearly looks wrong.

| Scale | Typical outcome |
| --- | --- |
| 97 to 100 percent | Scans normally |
| Around 90 percent | Scans normally in my testing |
| Around 50 percent | Unreliable, often fails at the hub |

Treat the middle row as my own observation rather than a published threshold. Your printer resolution decides the exact point.

## What this means for your setup

Pick one printing path and keep it.

If you print on A4, crop to the label and place two or four per sheet with [Pages per Sheet](/pages-per-sheet/), then print at 100 percent. If you print on 4 x 6 stock, crop to the label, set paper to 4 x 6, and print at 100 percent.

Both paths are good. What causes trouble is mixing them, like sending A4-sized pages to 4 x 6 stock and letting the driver sort it out.

## The one case where small is correct

Worth knowing before you chase a setting that is not wrong.

If you print two labels side by side on an A4 sheet, each one genuinely is smaller than a standalone 4 x 6 sticker, and that is fine. Two labels across measures 203.2 mm inside A4's 210 mm width, so they fit at full size with room to spare.

What you are checking for is a label that is much smaller than its own panel, with dead space around it. That is scaling. A label that fills its panel neatly is working as intended.

## My take

Before you change anything, print a single label and measure it with a ruler.

A correct Easy Ship label block should come out close to 101.6 x 152.4 mm (4 x 6 in). If it measures much less, you have a scaling setting switched on somewhere, and now you know exactly which three places to look.

Amazon label printing too small is a settings problem, not a file problem. One measurement tells you which setting, and the fix sticks for good.
`,
};
