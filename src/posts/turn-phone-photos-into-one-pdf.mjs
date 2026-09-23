export default {
  slug: 'turn-phone-photos-into-one-pdf',
  marketplace: 'tools',
  keyword: 'turn phone photos into one PDF',
  type: 'Type 2 — How-To / Guide',
  sentiment: '0.70 to 0.90 · Encouraging + Confidence-building',
  title: 'How to Turn Phone Photos into One PDF You Can Actually Send',
  metaTitle: 'Turn Phone Photos into One PDF: The Easy Way',
  description: 'Turn phone photos into one PDF in your browser. Why pages come out sideways, how to keep the file small enough to email, and the order that saves rework.',
  excerpt: 'Two things go wrong with photo PDFs: pages land sideways, and the file is too big to send. Both have the same cause and both are easy to avoid.',
  published: '2026-09-23',
  updated: '2026-09-23',
  cover: 'photo',
  coverAlt: 'Diagram showing several phone photographs being stacked into a single PDF document',
  tools: ['images-to-pdf', 'image-compressor', 'pdf-crop'],
  faq: [
    { q: 'Why are my photos sideways after making a PDF?', a: 'Phone cameras store the picture in sensor orientation plus a separate EXIF rotation flag. Tools that ignore that flag place the raw image, so a photo you took upright lands on its side.' },
    { q: 'How do I turn phone photos into one PDF without an app?', a: 'Your browser can do it. Select the photos, order them, and export a single document, with no upload and no install needed.' },
    { q: 'Why is my photo PDF so large?', a: 'Because photos are large. A 12 megapixel picture can be 4 MB, so twenty of them make an 80 MB document. Resizing before you build the PDF is what fixes it.' },
    { q: 'Should I compress before or after building the PDF?', a: 'Before. Shrinking the photos first means the PDF is small from the start, and you avoid a second round of compression on top of the first.' },
  ],
  body: `
A seller needed to send twelve photos of a damaged consignment to a courier claims team. He attached all twelve to one email, it bounced for size, and he spent twenty minutes sending them in batches of three.

Here is the good news. You can turn phone photos into one PDF in about a minute, in your browser, and end up with a single file small enough to send in one go. Once you do this once, it becomes second nature.

## Why one PDF beats twelve attachments

A claims team, a supplier or an accountant opens one file in the order you chose.

Twelve loose images arrive in whatever order the mail client feels like, named something like IMG_4471, and whoever receives them has to work out the sequence themselves.

The PDF also travels as one unit. Nothing gets separated when it is forwarded, and page order carries the story you meant to tell.

## How to turn phone photos into one PDF

This part is actually really easy, and the order of operations is what keeps it painless.

### Step 1: shrink the photos first

Run them through the [Image Compressor](/image-compressor/) before anything else. A 12 megapixel phone photo is roughly 4000 x 3000 pixels, which is far more than a document page needs.

Doing this first is the single biggest difference between a 6 MB PDF and an 80 MB one.

### Step 2: add them in the order you want

Open [Images to PDF](/images-to-pdf/) and add your photos. Drag them into sequence before exporting, because reordering pages afterwards is more work than reordering thumbnails now.

### Step 3: export and open the result

Export the single document, then open it and scroll through. You are checking orientation and order, which takes about ten seconds.

## Why photos come out sideways

This is where it gets interesting, and it explains a bug that has annoyed people for years.

Your phone camera sensor has a fixed orientation. When you turn the phone, the sensor does not turn with it. The camera stores the image the way the sensor saw it, then writes a separate note saying how it should be displayed.

That note is an EXIF orientation flag, part of the metadata standard used by digital cameras. Photo apps read it and quietly turn the picture for you, which is why your gallery always looks right.

Tools that ignore the flag place the raw sensor image instead. The photo you took in portrait lands in landscape, and you swear the tool rotated it. It did not. It just skipped the note.

So when you pick a tool for this job, orientation handling is the thing worth checking on the first file.

## Keeping the file small enough to send

Most mail systems cap attachments somewhere around 20 MB to 25 MB, so this matters more than it sounds.

Run the arithmetic on your own photos. Twenty pictures at 4 MB each is 80 MB, which nothing will accept. The same twenty resized for document use might be 300 KB each, giving a 6 MB file that sends first time.

| | Straight from the camera | Resized first |
| --- | --- | --- |
| Per photo | About 4 MB | About 300 KB |
| Twenty photos | Around 80 MB | Around 6 MB |
| Emailable | No | Yes |

Treat those figures as a guide from my own files rather than a rule. A photo of a plain box compresses far better than a photo of patterned fabric.

## Shoot with the PDF in mind

A small habit at the camera end saves all the fiddling later.

Take every photo in the same orientation, ideally portrait, so the pages line up instead of alternating between tall and wide. A document that flips orientation every page is genuinely harder to read.

Take them in the order you want them to appear, too. Photo apps sort by capture time, so shooting in sequence means the import order is already correct and you skip the dragging entirely.

Neither takes extra effort once you are thinking about it while shooting.

## What this means for claims and records

For evidence photos, resolution beyond a point stops helping.

A claims assessor needs to see the damage clearly, not count the threads. A photo around 1600 pixels on the long side shows damage perfectly and takes a fraction of the space.

I would keep the originals on your phone regardless. Send the small PDF, keep the full resolution copies, and if anyone ever asks for more detail you still have it.

## One habit that saves rework

Name the file before you send it.

A document called scan.pdf tells the recipient nothing, and it tells you nothing when you go looking for it in four months. Something like courier-claim-order-12345.pdf costs three seconds now and saves a search later.

## My take

Compress, order, export, check. That sequence handles both of the things that normally go wrong.

The compression step is the one people skip, because the photos look fine on screen and the problem only appears at the mail server. Doing it first means you never meet that problem at all.

Turn phone photos into one PDF this way and the whole job stays under two minutes, every time. You have got this.
`,
};
