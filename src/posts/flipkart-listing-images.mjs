export default {
  slug: 'flipkart-listing-image-size-guide',
  marketplace: 'flipkart',
  keyword: 'Flipkart listing image size',
  type: 'Type 2 — How-to / Guide',
  sentiment: '0.70 to 0.90 · Encouraging + Confidence-building',
  title: 'How to Get Flipkart Listing Images Right (Size, Background, Batch Workflow)',
  metaTitle: 'Flipkart Listing Image Size & Setup — A Simple Guide',
  description: 'A practical guide to Flipkart listing images: what resolution to shoot, how to get a clean white background cheaply, and how to batch-resize a catalog fast.',
  excerpt: 'Good Flipkart images are mostly a process, not a talent. Here is the shoot setup, the pixel targets, and a batch workflow that handles fifty photos at once.',
  published: '2026-09-19',
  updated: '2026-09-19',
  cover: 'frame',
  coverAlt: 'Diagram of a landscape product photo being padded into a square frame instead of stretched',
  tools: ['product-image-resizer', 'image-compressor', 'pdf-to-images'],
  faq: [
    { q: 'What size should Flipkart listing images be?', a: 'Flipkart publishes image requirements in Seller Hub and they vary by category. A square image of at least 1000 x 1000 pixels is a safe, widely compatible target, and larger masters give you room for zoom. Confirm your category spec before a bulk upload.' },
    { q: 'Does Flipkart need a white background?', a: 'The primary image is expected to be clean and uncluttered, with a plain background, so the category grid stays comparable. Additional gallery images usually allow more context, like the product in use.' },
    { q: 'How many images should a listing have?', a: 'Use every slot the category allows. More angles reduce uncertainty, and uncertainty is what produces returns. At minimum: front, back, detail or texture, and a scale or size reference.' },
    { q: 'Can I use the same images on Flipkart and Amazon?', a: 'Usually yes if you shoot clean on white and keep high-resolution masters. Each platform needs its own crop and pixel size, which is a fast batch job.' },
  ],
  body: `
The first product shoot I helped with used a bedsheet taped to a wall, an old study lamp, and a phone from 2019. The photos were genuinely good. The seller's previous photos, taken on a much better phone in a dim room at 11pm, were not.

Here is the good news: Flipkart listing images are mostly about process, not equipment. Once you set the process up, a fifty-product catalog takes an afternoon instead of a week.

Let me walk you through it in the order you will actually do it.

## Step 1: shoot bigger than you need

This part is easy and it is the decision that saves you the most rework.

Shoot at your camera's full resolution. Do not shoot "for Flipkart", shoot a master you can crop for anything.

Why this matters: you can always shrink a big photo. You can never genuinely enlarge a small one. When you later need a different size for Amazon, for Instagram, or for a banner, the master is already there.

Two rules that cost nothing:

- **Never let a product photo pass through WhatsApp.** WhatsApp compresses images hard. A 4000 pixel photo can arrive as 900 pixels, which fails upload checks. Transfer by cable, or share as a Drive link or a "document" attachment.
- **Keep masters in a folder per SKU.** \`KRT-RAYON-BLU-M/front.jpg\` and so on. This one habit removes most future reshoots.

## Step 2: build a background for about Rs. 100

You do not need a lightbox.

Tape a sheet of white chart paper to the wall and curve it down onto a table so there is no visible corner line. That curve is the entire trick behind a "studio" look. A roll of white chart paper costs around Rs. 20 to Rs. 40 (well under USD 1).

For light, stand near a window during the day, with the window to the side of the product rather than behind the camera. Indirect daylight is softer and more colour-accurate than almost any cheap lamp.

Switch the room's tube lights **off** while you shoot. Mixing daylight and fluorescent light is what creates that green or yellow colour cast that makes fabric look wrong. Mixed lighting is one of the most common causes of "colour was different" returns.

## Step 3: shoot the four angles that actually reduce returns

A lot of people shoot one hero image and stop. Every extra angle removes a reason for the buyer to guess.

1. **Front, flat and square on.** This is your primary image.
2. **Back.** Especially for apparel, bags and anything with a print.
3. **Detail or texture.** Close enough to show weave, stitching, print quality, material.
4. **Scale reference.** Product next to a common object, or worn, or a measurement graphic.

That fourth one is underrated. Buyers cannot judge size from a floating object on white, and size confusion is the single biggest driver of apparel returns.

## Step 4: set your Flipkart listing image size in one batch

This is the part that used to take people hours and now takes minutes.

Open the [Product Image Resizer](/product-image-resizer/) and drop in the whole folder of masters.

Then set three things:

- **Preset:** square 1000 x 1000 as a safe default, or 2000 x 2000 if you want extra headroom for zoom. For apparel, the 1200 x 1600 portrait option suits how clothing photographs.
- **Fit mode: Pad.** This is important. Pad keeps your whole product visible and fills the rest of the frame with white. **Never use Stretch.** Stretching makes a kurta look wider than it is, and a buyer who orders based on a stretched photo is a return waiting to happen.
- **Padding colour:** white.

Download, and you get a ZIP with every file resized and renamed with its dimensions.

The tool runs entirely in your browser, so your unreleased product photos are not being uploaded to anyone's server. You can disconnect from the internet after the page loads and it still works.

## Step 5: check the file weight

Uploads that time out halfway can look like rejections.

Your resized images should land somewhere around 300 KB to 1 MB each. If any are heavier, run them through the [Image Compressor](/image-compressor/) at about 80 percent quality. At that level most product photos are visually identical and a fraction of the size.

The compressor shows before and after size per file, so you can see exactly what you saved.

## What to keep off the primary image

Worth a short list, because these cause avoidable rejections:

- Price tags, discount badges, "Sale" graphics
- Your logo pasted in a corner
- Watermarks
- Decorative borders or frames
- Collages of several products in one image

Save all of that for the additional gallery slots where the rules are usually more relaxed. Check your category guidelines in Seller Hub, since requirements do differ and do get updated.

## A small thing that helps buyers a lot

If you sell apparel, make one of your gallery images a **measurement graphic**: a plain image with the garment measurements written clearly in both inches and centimetres (chest 40 in / 101 cm, length 28 in / 71 cm).

Most buyers shop on a phone and never open the description. A size chart they can see in the image carousel gets read. One buried in the description does not.

You can build these in any basic design tool and then run them through the same resizer so they match your other images exactly.

## Putting the whole thing together

Here is the workflow, start to finish, for a new product:

1. Shoot four angles at full resolution against white chart paper in daylight.
2. Transfer by cable into a folder named after the SKU.
3. Batch resize with Pad to your target size.
4. Compress if any file is over about 1 MB.
5. Upload, with the front shot as primary.
6. Add a measurement graphic to the gallery for apparel.

Once you have done this once, it genuinely becomes second nature. The second product takes about ten minutes.

## My honest take

I think sellers overrate cameras and underrate consistency. A catalog where every photo has the same background, the same framing and the same light looks more professional than a catalog with one brilliant photo and forty inconsistent ones.

And remember what these images are really for. They are not decoration. They are the only information a buyer has about a physical object they cannot touch. Every honest detail you show is a return you do not have to process later.

Set the process up once. Then it is just an afternoon per catalog refresh, forever.
`,
};
