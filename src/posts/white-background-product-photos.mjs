export default {
  slug: 'white-background-product-photos',
  marketplace: 'tools',
  keyword: 'white background product photos',
  type: 'Type 2 — How-To / Guide',
  sentiment: '0.70 to 0.90 · Encouraging + Confidence-building',
  title: 'White Background Product Photos Without a Studio or a Lightbox',
  metaTitle: 'White Background Product Photos Without a Studio',
  description: 'Get white background product photos with a window, a sheet of paper and your phone. Why marketplaces want pure white, and how to hit it without a studio.',
  excerpt: 'Pure white is a number, not a mood. Once you know which number marketplaces check for, getting there with a window and a sheet of paper is straightforward.',
  published: '2026-09-23',
  updated: '2026-09-23',
  cover: 'sweep',
  coverAlt: 'Diagram of a product photographed against a curved white sheet lit from a window',
  tools: ['product-image-resizer', 'image-compressor', 'images-to-pdf'],
  faq: [
    { q: 'What counts as a white background for marketplaces?', a: 'Usually pure white, meaning an RGB value of 255, 255, 255. A slightly grey or cream background can read as off-white to an automated check even though it looks white to you.' },
    { q: 'Can I get white background product photos with just a phone?', a: 'Yes. A phone, a sheet of white paper or card, and light from a window will get you there for most small products. The lighting matters far more than the camera does.' },
    { q: 'Why does my white paper look grey in photos?', a: 'Cameras expose for an average, so a bright white scene gets darkened toward grey. Raising exposure slightly in the camera or afterwards brings it back to white.' },
    { q: 'Should I resize before or after editing?', a: 'Edit first, then resize and compress last. Resizing at the end means your export exactly matches the size the marketplace wants without another round of processing.' },
  ],
  body: `
The first product photos I helped a seller fix were taken on a perfectly good phone, on a perfectly clean white sheet. Every single one got flagged for the background.

The sheet was white. The photos were not. Here is the good news: white background product photos are easier than they look once you realise that pure white is a specific number rather than a general impression, and your camera is actively working against you.

## Why marketplaces care so much

Most people assume it is about looking tidy. It is really about consistency.

A search results grid puts your product next to twenty others. If every background is white, the products are what the eye compares. If one background is cream, that listing looks slightly broken.

Marketplaces commonly specify pure white for main catalogue images, which in practice means an RGB value of 255, 255, 255. Automated checks can read that value directly, which is why a background that looks white to you can still fail.

Requirements differ by platform and category and they do get updated, so confirm the current spec in your seller panel before a big shoot.

## Why your white sheet photographs grey

This is where it gets genuinely interesting, and it is the cause of most rejections I have seen.

Camera metering assumes an average scene. Point it at something mostly white and it decides the picture is too bright, so it reduces exposure to bring everything toward a middle grey.

Your white sheet becomes light grey. Your camera did exactly what it was designed to do, and the result is wrong for this one purpose.

Once you know that, the fix is obvious: tell the camera to be brighter than it wants to be.

## How to get white background product photos

Four steps, no studio, and most of it is about light rather than gear.

### Step 1: use one big soft light source

A window on an overcast day is close to ideal. Large and diffuse means soft shadows, which is what you want.

Direct sunlight is the one to avoid. It creates hard shadows on the background that no amount of editing removes cleanly.

### Step 2: curve the paper instead of laying it flat

Tape a sheet of white card to a wall and let it curve down onto the table rather than meeting it at a corner.

That curve removes the horizon line where the wall meets the surface. Without it you get a visible seam behind the product that has to be edited out later.

### Step 3: raise the exposure

On a phone, tap the product to focus, then slide the exposure control up until the background looks genuinely white rather than nearly white.

Watch the product while you do it. You are looking for the point just before its highlights start losing detail.

### Step 4: resize last

Edit first, then size the image for the destination using the [Product Image Resizer](/product-image-resizer/), which can pad to a square without stretching the product.

Doing this at the end means one export at exactly the right dimensions, rather than resizing twice.

## A quick check before uploading

This takes ten seconds and it catches the grey problem before a rejection does.

Open the image and use any colour picker, including the one in a basic phone editor, on a corner of the background. You want 255, 255, 255 or very close to it.

If it reads something like 238, 240, 238, your background is very slightly grey and green. Raising brightness a little will bring it up.

| Corner reading | What it means |
| --- | --- |
| 255, 255, 255 | Pure white, safe |
| Around 245 | Usually passes, worth lifting |
| Around 230 or lower | Reads as grey, likely to be flagged |

## What this means for your listing

The background is the easy half. The product still has to be shown honestly.

I would resist the urge to brighten the whole image until the product itself loses texture. A washed-out product on a perfect background sells worse than a slightly imperfect background with an honest product, and it causes returns when the real item looks different.

Finish by running the file through the [Image Compressor](/image-compressor/) so it uploads quickly without a visible quality change.

## The one thing a white background cannot hide

Worth knowing before you spend an afternoon on lighting.

A perfect background makes a dusty product look like a carefully photographed dusty product. Marks, loose threads and fingerprints all become more obvious against clean white, not less.

So clean the item before the shoot. It takes a minute and it does more for the final image than any exposure adjustment will.

## My take

Fix the light before you reach for editing tools.

Almost every white background problem I have seen was a lighting problem being solved in software afterwards, which takes longer and looks worse. A window, a curved sheet and a raised exposure gets you most of the way in the camera.

White background product photos stop being a chore once the setup is repeatable. Tape the card up once, leave it there, and every future shoot takes minutes. You have got this.
`,
};
