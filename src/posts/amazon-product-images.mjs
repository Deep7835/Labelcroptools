export default {
  slug: 'amazon-product-image-requirements',
  marketplace: 'amazon',
  keyword: 'Amazon product image requirements',
  type: 'Type 2 — How-to / Guide',
  sentiment: '0.70 to 0.90 · Encouraging + Confidence-building',
  title: 'Amazon Product Images: How to Hit the White Background and Zoom Rules',
  metaTitle: 'Amazon Product Image Requirements — Simple Setup Guide',
  description: 'Amazon is strict about main images: pure white background, product filling the frame, and enough pixels for zoom. Here is how to hit all three without a studio.',
  excerpt: 'Amazon image rules look intimidating until you see them as three simple targets. Hit those three and uploads just work.',
  published: '2026-09-20',
  updated: '2026-09-20',
  cover: 'whitebox',
  coverAlt: 'Diagram of a product centred in a pure white square frame with zoom corner markers',
  tools: ['product-image-resizer', 'image-compressor', 'images-to-pdf'],
  faq: [
    { q: 'What size should Amazon product images be?', a: 'Amazon requires a minimum of 1000 pixels on the longest side for the zoom feature to work, and recommends larger. A 2000 x 2000 pixel square is a comfortable target. Confirm the current requirement for your category in Seller Central.' },
    { q: 'Does the Amazon main image need a pure white background?', a: 'Yes. The main image is expected to be on a pure white background (RGB 255, 255, 255) with no text, logos, watermarks or props. Additional gallery images allow lifestyle context.' },
    { q: 'How much of the frame should the product fill?', a: 'Amazon guidance is that the product should fill about 85 percent of the image frame. Too small and it looks weak in search results; touching the edges risks looking cropped.' },
    { q: 'Can I put text or a logo on Amazon images?', a: 'Not on the main image. Text, logos, watermarks, borders and promotional badges are not allowed there. Save them for gallery or A+ content where the rules differ.' },
  ],
  body: `
Amazon has a reputation for being fussy about images. I would argue that is actually good news, and here is why: fussy means specific, and specific means you can hit it exactly and stop guessing.

There are really only three targets. Get these three right and your uploads stop being a source of anxiety.

1. Pure white background on the main image
2. Product filling about 85 percent of the frame
3. At least 1000 pixels on the longest side, ideally more

Let me take them one at a time.

## Amazon product image requirements start with genuinely pure white

This is where most people quietly fail, and it is worth being precise.

"White background" in Amazon terms means RGB 255, 255, 255. Not off-white. Not cream. Not a white wall in slightly warm light that photographs at 246, 243, 238.

Here is the thing. Amazon displays your main image on a white page. If your background is 246 instead of 255, the buyer sees a faint grey rectangle around your product. It looks amateurish even when nobody consciously notices why.

**How to get there cheaply**

You do not need a lightbox. Tape white chart paper (around Rs. 20 to Rs. 40, well under USD 1) to a wall and curve it onto a table so there is no corner line.

Then two things matter more than the paper:

- **Shoot in indirect daylight**, with the window to the side. Daylight is more colour-accurate than cheap lamps.
- **Turn the room's tube lights off.** Mixing daylight and fluorescent creates a colour cast that pushes your white off-white and your product's colour off too.

If your background still photographs slightly grey, that is normal and fixable in any basic editor by lifting the white point. Just check the corners read as true white afterwards.

## Target 2: fill the frame

Amazon's guidance is that the product should occupy roughly 85 percent of the image.

Here is why this matters practically. In search results your image appears as a small thumbnail next to competitors. A product floating in white space at 40 percent of the frame looks smaller and less substantial than a competitor's that fills it, even for an identical item.

But do not go to the other extreme. Touching the edges reads as cropped and can fail review.

The practical target: product large, with a comfortable margin of white all round.

This is also where **padding versus stretching** matters enormously.

If your photo is landscape and you need a square, never stretch it. Stretching a kurta makes it look wider than it is, and a buyer ordering on a stretched photo is a return waiting to happen.

Pad instead. The [Product Image Resizer](/product-image-resizer/) has a Pad mode that places your whole photo into the target frame and fills the rest with white, keeping proportions honest. Set the padding colour to pure white and it matches the background seamlessly.

## Target 3: enough pixels for zoom

Amazon's zoom feature needs a minimum of 1000 pixels on the longest side. Below that, zoom does not activate.

That matters more than it sounds. Zoom is how a buyer inspects fabric texture, stitching, print quality, the things that decide whether they trust the listing.

My recommendation: shoot at your camera's full resolution and export at 2000 x 2000. That comfortably clears the threshold and gives genuinely useful zoom detail.

One warning worth repeating: **never let a product photo pass through WhatsApp.** WhatsApp compresses hard, and a 4000 pixel photo can arrive as 900. It looks fine on a phone and fails the zoom threshold. Transfer by cable, or share as a Drive link or a document attachment.

## The batch workflow

This part is actually really easy once set up.

1. Shoot everything at full resolution against white paper in daylight.
2. Transfer originals into a folder per SKU. Keep these masters forever.
3. Open the [Product Image Resizer](/product-image-resizer/), drop the whole folder in.
4. Choose the **2000 x 2000** square preset, **Pad** mode, padding colour white.
5. Download the ZIP.
6. If any file is over about 1 MB, run it through the [Image Compressor](/image-compressor/) at 85 percent.

Both tools work inside your browser, so your unreleased product photos are never uploaded anywhere. You can disconnect from the internet after the page loads and they still run.

Fifty photos takes a couple of minutes.

## What belongs on the main image (and what does not)

Keep the main image clean. Not allowed there:

- Text of any kind, including size or price
- Your brand logo
- Watermarks
- Borders or frames
- Props, models' accessories that are not for sale, or additional items

Everything creative goes in the gallery slots and A+ content, where the rules are different and lifestyle imagery is welcome.

## The gallery images that reduce returns

Here is why this actually matters beyond compliance.

Use every gallery slot the category gives you. Each one removes a reason for the buyer to guess, and guessing is what produces returns.

The four I would always include:

1. **Back view.** Especially apparel, bags, anything printed.
2. **Detail shot.** Close enough to show weave, stitching or print resolution.
3. **Scale reference.** The product next to a common object, or worn.
4. **Measurement graphic.** A plain image with real numbers in inches and centimetres (chest 40 in / 101 cm, length 28 in / 71 cm).

That last one is the highest-value image you can make for apparel. Most buyers shop on a phone and never open the description. A size chart in the carousel gets seen. One in the description does not.

## A note on honesty in editing

Resist the urge to push saturation to make a colour pop.

A boosted photo sells better and returns harder. A buyer who receives a duller version of what they saw feels misled, and that becomes a return plus a bad review, which costs far more than the extra click the vivid photo earned.

I would rather have a slightly flat photo and a customer who keeps the item.

## Putting it together

Amazon's strictness is genuinely a gift once you reframe it. There is no ambiguity about what "good" means: white is 255, the product fills 85 percent, the longest side clears 1000 pixels.

Hit those three, keep your masters organised by SKU, and batch-resize when you need a different size. Your uploads stop failing and your listings start looking like they belong next to established brands.

Set the paper up once. Everything after that is a ten-minute job per product.
`,
};
