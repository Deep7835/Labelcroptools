export default {
  slug: 'sort-meesho-labels-by-courier',
  marketplace: 'meesho',
  keyword: 'sort Meesho labels courier wise',
  type: 'Type 2 — How-To / Guide',
  sentiment: '0.70 to 0.90 · Encouraging + Confidence-building',
  title: 'How to Sort Meesho Labels Courier Wise, So Every Pickup Is One Stack',
  metaTitle: 'Sort Meesho Labels Courier Wise: One Stack per Pickup',
  description: 'Sort Meesho labels courier wise before printing so Valmo, Delhivery, Xpressbees and Shadowfax parcels come off the printer as separate stacks for each pickup.',
  excerpt: 'When three couriers collect at three different times, a mixed pile of parcels means sorting twice. Sort the labels instead and the parcels sort themselves.',
  published: '2026-10-12',
  updated: '2026-10-12',
  cover: 'courier-groups',
  coverAlt: 'Diagram of mixed shipping labels being grouped into separate stacks, one for each courier partner',
  tools: ['meesho-label-cropper', 'picklist-generator', 'pages-per-sheet'],
  faq: [
    { q: 'How do I sort Meesho labels courier wise?', a: 'Open the label PDF in the Meesho Label Cropper and choose Sort labels by: Courier partner. It reads the courier name printed on each label, groups the pages by courier, and orders the labels by SKU inside each group before you print.' },
    { q: 'Which couriers does the sorting recognise?', a: 'Valmo, Delhivery, Xpressbees, Shadowfax, Ecom Express and Ekart, along with other common Indian couriers such as Blue Dart, DTDC and India Post. Labels without a recognised name are grouped together at the end as Other.' },
    { q: 'Should I sort Meesho labels by courier or by SKU?', a: 'By courier if different partners collect at different times, because a mixed pile has to be sorted again at handover. The courier sort already orders labels by SKU inside each courier group, so you keep most of the picking benefit as well.' },
    { q: 'Does sorting change the barcode or the label?', a: 'No. Only the order of the pages changes. Every barcode, address and routing code stays exactly as Meesho generated it.' },
  ],
  body: `
A seller I helped had three pickups a day. Valmo came in the morning, Delhivery around lunch, Xpressbees late afternoon. Every morning someone stood over a pile of sixty sealed parcels, reading courier names off labels and making three heaps.

That job disappears if you sort Meesho labels courier wise before you print. The parcels come off the packing table in the same groups the labels came off the printer, and each pickup gets handed one ready stack.

## Quick answers

### Can I sort Meesho labels courier wise for free?

Yes. The [Meesho Label Cropper](/meesho-label-cropper/) has a Courier partner sort. It reads the courier printed on each label, groups the pages, and crops the invoice off in the same pass. Nothing is uploaded.

### What happens to labels with an unknown courier?

They are grouped together at the end of the file as Other, so they never get mixed into a known courier's stack.

## Why a mixed pile costs you twice

Meesho assigns the courier for each order, and a normal day's download mixes them in order sequence. Print it as it comes and the courier names are shuffled through the stack.

So the sorting still happens, just later. Somebody reads every sealed parcel at handover and splits them by courier. That is a second pass over work you already did, and it is where parcels end up in the wrong bag.

The pickup agent scans their own parcels against their own manifest. A parcel handed to the wrong partner is not scanned out, sits in your dispatch area, and can show up as a late dispatch. A parcel missing from a stack slows the handover while everyone searches.

## How to sort Meesho labels courier wise

The whole routine takes under a minute once you have done it once.

### Step 1: load the day's label file

Download the labels from your supplier panel and drop the PDF into the [Meesho label cropper](/meesho-label-cropper/). If you downloaded in several batches, drop all the files in together; they are merged in order.

### Step 2: choose the courier sort

Under Sort labels by, pick Courier partner. Pick Without invoice if you only print the label, and choose thermal or A4 four per sheet to match your printer.

### Step 3: read the count before printing

The status line shows how many labels went to each partner, something like Valmo 31, Delhivery 18, Xpressbees 11. That is your handover checklist. Write the three numbers on a sticky note at the dispatch table.

### Step 4: print and pack in file order

Pack in the same order the labels came out. Each courier's parcels stay together on the table, and the stack for the next pickup is finished before the agent arrives.

## SKU order inside every courier group

Here is the part people do not expect. Courier sorting does not throw away the picking benefit of sorting by SKU.

Inside each courier group, labels are ordered by SKU. So within the Valmo stack, all the blue kurtis come together, then the phone cases, then the next product. You still pick each product once per courier group instead of once per order.

If you only have one pickup a day, sort by SKU instead. The guide to [sorting Meesho labels by SKU](/blog/sort-meesho-labels-by-sku/) covers that routine, and it gives a tighter picking path when the courier split does not matter.

## Thermal or A4: one detail to know

On a thermal printer each label is its own page, so courier groups split cleanly. Tear the roll between groups and you are done.

On A4 with four labels per sheet, a group usually does not end exactly at the bottom of a sheet. The last Valmo labels can share a sheet with the first Delhivery ones. Keep the cut border switched on, cut the sheets in order, and check the courier name on the first label of each new group as you stack.

If that bothers you, crop with the one-label-per-page layout instead, use [Split PDF](/split-pdf/) to cut the sorted file at the group boundaries, then put each part through [Pages per Sheet](/pages-per-sheet/). Every courier then starts on a fresh sheet.

## Add a picklist for the morning pull

Sorting tells you the packing order. A picklist tells you what to pull from the shelf before packing starts.

The [Picklist Generator](/picklist-generator/) reads the same label PDF and rolls the SKU, size, colour and quantity into one table. Pull everything on that list first, then pack courier stack by courier stack.

## A quick check at handover

Before each pickup, count the stack and compare it to the number from the status line. If the Delhivery count said 18 and you have 17 parcels, you know before the agent leaves, not when a late dispatch shows up a day later.

It takes ten seconds and it is the cheapest dispatch insurance I know.

## What I would do tomorrow

Download tomorrow's labels, choose the courier sort, and write the counts on a note before printing. Pack in file order.

Most sellers notice the difference at the first pickup. The agent gets one stack, the count matches, and nobody is reading labels off sealed parcels anymore.
`,
};
