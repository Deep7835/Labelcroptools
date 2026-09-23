export default {
  slug: 'pdf-pages-print-sideways',
  marketplace: 'tools',
  keyword: 'PDF pages print sideways',
  type: 'Type 5 — Problem / Solution',
  sentiment: '0.60 to 0.80 · Reassuring + Solution-focused',
  title: 'PDF Pages Print Sideways? Here Is Why, and the Permanent Fix',
  metaTitle: 'PDF Pages Print Sideways? The Permanent Fix',
  description: 'PDF pages print sideways because viewer rotation is not saved into the file. Here is the difference, and how to rotate pages permanently so it stops.',
  excerpt: 'Rotating a page on screen often changes only your view. The file still says portrait, and the printer believes the file. That is the whole problem.',
  published: '2026-09-23',
  updated: '2026-09-23',
  cover: 'frame',
  coverAlt: 'Diagram showing a page turned on screen but still stored upright in the file, printing in the wrong orientation',
  tools: ['rotate-pdf', 'pdf-crop', 'pages-per-sheet'],
  faq: [
    { q: 'Why do my PDF pages print sideways after I rotated them?', a: 'Most viewers rotate the display only. That view setting is not written into the document, so the printer still reads the original orientation stored on each page.' },
    { q: 'How do I rotate PDF pages permanently?', a: 'Use a tool that writes the rotation into the file and saves a new document. Reopen the saved file afterwards and it should already be the right way up before you touch anything.' },
    { q: 'Can I rotate only some pages?', a: 'Yes. Scanned batches often have a few pages fed the wrong way, so select just those and leave the rest alone.' },
    { q: 'Does rotating a page lose quality?', a: 'No. Rotation is recorded as an attribute of the page in quarter turns. The content is not redrawn, so text and images stay exactly as sharp as before.' },
  ],
  body: `
A seller messaged me a photo of a print run where every second page came out on its side. He had opened the file, turned the pages the right way up, and printed straight from that window.

Do not worry, this is one of the most common PDF issues there is, and nothing about your file is broken. If your PDF pages print sideways after you have already turned them, you have hit a genuine gap between what you see and what the file says.

## Why your PDF pages print sideways

Let me explain the difference, because it is the whole answer.

Every PDF page carries a rotation attribute, part of the format described in ISO 32000. It stores the page orientation in quarter turns: 0, 90, 180 or 270 degrees.

When you press the rotate button in a viewer, most of the time you change your view of the page. You did not change that stored attribute.

So the screen shows the page upright, the file still says it is on its side, and the printer reads the file. The printer is not being difficult, it is just reading the only thing that was actually saved.

## The two kinds of rotation

Once you can name these separately, the problem stops being mysterious.

**View rotation** is temporary. It affects your window, it is not saved, and closing the file usually discards it. It is meant for reading, not for output.

**Stored rotation** is part of the document. It travels with the file, so every viewer, printer and colleague sees the same orientation.

You want the second one. The fix is simply making sure you used a tool that writes it.

## How to rotate PDF pages permanently

Here is exactly what to do, and it takes under a minute.

1. Open the file in [Rotate and Delete Pages](/rotate-pdf/).
2. Turn the pages that need turning, either all of them or just the ones that are wrong.
3. Save the new document, which writes the rotation into the file.
4. Close everything, reopen the saved file, and look at it fresh.

That last step is the one that proves it. If the pages are already upright the moment the file opens, before you touch any view controls, the rotation is stored and the printer will agree with you.

## A quick test to tell which one you have

You can diagnose this in about fifteen seconds, without printing anything.

Rotate the page, save if the tool offers it, then close the document completely. Now reopen it.

If it opens upright, the rotation was written into the file. If it opens sideways again, your earlier rotation was view only, and that is exactly why the printer ignored it.

I would run this test before sending anything to a courier print run. It costs nothing and it catches the problem while it is still cheap.

## Why scanned batches are the usual culprit

Most of the sideways pages I have seen came out of a document feeder.

A feeder takes whatever orientation the paper was in. Put one sheet in turned, or feed a landscape page in a portrait stack, and that page is stored rotated while its neighbours are not.

So you end up with a mostly correct document containing a handful of wrong pages. That is why per-page rotation matters more than a single rotate-everything button: you only want to turn the pages that are actually wrong.

## The other cause: paper orientation, not page orientation

Worth ruling this one out before you rotate anything, because the fix is completely different.

Sometimes the pages are stored correctly and the printer is set to the wrong paper orientation. The document is portrait, the driver is set to landscape, and every page gets turned on the way out.

The tell is that everything is wrong rather than a few pages. Stored rotation problems usually affect a handful of pages from a scan. A driver setting affects the entire job, evenly.

If all 40 pages came out sideways, check the printer dialog first. Rotating a file that was already correct just moves the problem around.

## What this means when printing labels

There is a version of this that costs money rather than paper.

If you are placing several labels on one sheet, a page stored with the wrong rotation throws off the layout. The imposition tool arranges pages using their stored orientation, so one sideways page can leave a gap or overlap a neighbour.

Fix rotation before you impose, never after. Rotate first, then send the file to [Pages per Sheet](/pages-per-sheet/), and the grid comes out even.

## What I would do

Make reopening the file a habit rather than a check you remember sometimes.

Rotate, save, close, reopen. Four steps, about twenty seconds, and it converts a problem you discover at the printer into one you never have.

PDF pages print sideways for a boring reason, and boring reasons have reliable fixes. Once you know that view rotation and stored rotation are different things, this stops happening to you for good.
`,
};
