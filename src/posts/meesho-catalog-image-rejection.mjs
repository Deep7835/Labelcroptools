export default {
  slug: 'meesho-catalog-image-rejection-fix',
  marketplace: 'meesho',
  keyword: 'Meesho catalog image rejected',
  type: 'Type 5 — Problem / Solution',
  sentiment: '0.60 to 0.80 · Reassuring + Solution-focused',
  title: 'Meesho Catalog Image Rejected? Here Is What to Check First',
  metaTitle: 'Meesho Catalog Image Rejected — Quick Fixes That Work',
  description: 'Most Meesho catalog image rejections come down to five fixable things: size, background, borders, text overlays and file weight. Here is how to fix each.',
  excerpt: 'Image rejections feel random until you know what the checks are looking for. Five things cause almost all of them, and each takes minutes to fix.',
  published: '2026-09-19',
  updated: '2026-09-19',
  cover: 'photo',
  coverAlt: 'Diagram of three product photo frames, one marked rejected for being too small and two marked approved',
  tools: ['product-image-resizer', 'image-compressor', 'images-to-pdf'],
  faq: [
    { q: 'What image size does Meesho need?', a: 'Meesho publishes catalog image requirements in the supplier panel and they differ by category. A safe general starting point is a square image of at least 1000 x 1000 pixels, or a 3:4 portrait around 1200 x 1600 for apparel. Always confirm the current spec for your category in your panel.' },
    { q: 'Why does Meesho reject images with text on them?', a: 'Promotional text, price tags, watermarks, logos and borders are usually disallowed on the main catalog image because they interfere with a clean, comparable product grid. Keep the main image as just the product.' },
    { q: 'Can I reuse the same photo across marketplaces?', a: 'Often yes, if you shoot clean on white and keep a high-resolution master. Each platform then needs its own crop and size, which is a quick batch job rather than a reshoot.' },
    { q: 'Does image quality actually affect sales?', a: 'Clear, well-lit images help buyers judge a product correctly, which reduces the size and colour disappointment that drives returns. Better photos are a returns fix as much as a conversion fix.' },
  ],
  body: `
A seller sent me eleven catalog uploads that had all been rejected. He was convinced the system had something against him. We looked at the files together: every single one was 640 pixels wide, exported from WhatsApp.

Don't worry, this is one of the most common issues for new suppliers, and the fix took him about fifteen minutes for the whole batch.

Here is exactly what to check, in the order that catches the most problems fastest.

## Check 1: resolution, the reason most Meesho catalog images get rejected

The single biggest cause of Meesho catalog image rejection is a file that is simply too small.

This usually happens for one reason. The photo travelled through WhatsApp. WhatsApp compresses images hard, and a 4000 pixel photo can arrive as a 900 pixel one. It looks fine on a phone screen and fails every upload check.

The fix: get the original file off the camera or phone directly, by cable, or share it through Google Drive or as a "document" attachment rather than a photo.

Then check the actual pixel dimensions. On Windows, right-click, Properties, Details. On a Mac, select the file and press the spacebar.

You are looking for at least 1000 x 1000 pixels for a square, or around 1200 x 1600 for a 3:4 portrait. More is fine. Less is the problem.

> One rule that will save you repeatedly: never let a product photo pass through WhatsApp before upload. Treat WhatsApp as a preview channel, not a file transfer channel.

## Check 2: background

Meesho's catalog is a grid. A grid only looks shoppable when the backgrounds are consistent.

A plain white or very light, uncluttered background is the safe choice for the main image. What causes trouble is the household background: a bedsheet with a pattern, a tiled floor, a doorway with a bit of furniture in shot.

Here is the good news. You do not need a studio. A sheet of white chart paper (about Rs. 20) taped to a wall and curved onto a table gives you a clean background, and indirect daylight near a window is genuinely better than most artificial lighting.

## Check 3: text, logos, borders and watermarks

This one catches experienced sellers who are used to other channels.

Anything added on top of the photo tends to be disallowed on the primary catalog image. That includes:

- Price tags or discount badges
- "Best quality" or "Free delivery" text
- Your brand logo pasted in the corner
- Decorative borders or frames
- Watermarks

The logic is straightforward. A buyer scrolling a category should be comparing products, not promotional graphics.

Keep the main image as the product, nothing else. If you want to show size charts or detail callouts, those belong in the additional gallery images, and the rules for those are usually more relaxed. Check your category guidelines.

## Check 4: the product does not fill the frame

A photo where the product occupies a quarter of the frame, floating in white space, reads as low effort and performs badly even when it is accepted.

Aim for the product to fill most of the frame with a comfortable margin. Not touching the edges, not lost in the middle.

This is where padding matters. If your photo is landscape and you need a square, do not stretch it. Stretching makes a kurta look wider than it is, which is a size return waiting to happen.

Pad it instead. The [Product Image Resizer](/product-image-resizer/) has a "Pad" mode that puts your whole photo into the target frame and fills the rest with white, so proportions stay honest. It runs in your browser and handles a folder of photos at once.

## Check 5: file weight

Large files time out during upload, and an upload that fails halfway can look like a rejection.

A 12 megapixel phone photo straight off the camera can be 6 MB. You do not need that. Around 300 KB to 1 MB at the right pixel dimensions is plenty for a catalog image.

The [Image Compressor](/image-compressor/) lets you set quality and a maximum dimension and shows you the before and after size per file. At 80 percent quality most product photos are visually identical and a fraction of the weight.

## A batch workflow that takes ten minutes

Once you do this once it becomes second nature.

1. Copy the original, full-resolution photos into one folder.
2. Open the [Product Image Resizer](/product-image-resizer/), drop the whole folder in.
3. Choose your target: square 1000 x 1000 for general categories, or 1200 x 1600 portrait for apparel.
4. Choose **Pad** and white as the padding colour.
5. Download. You get a ZIP with every file renamed with its size.
6. If any file is still heavy, run the ZIP contents through the [Image Compressor](/image-compressor/) at 80 percent.

Both tools process the images on your own device, so your unreleased product photos are not being uploaded to someone else's server.

## What this means for your returns, not just your uploads

Here is why this actually matters beyond getting approved.

Most people treat image rules as a compliance chore. They are also a returns lever. A buyer who can see the true colour, the real texture and an honest size reference is far less likely to send the item back.

So when you reshoot to pass the check, resist the urge to boost saturation to make the colour "pop". The photo that sells best is not always the photo that keeps the sale.

## My take

Image rejections feel personal and random when you are in the middle of them. They are neither. Five checks cover almost everything, and four of them are settings rather than skill.

If you only do one thing after reading this: find your original, uncompressed product photos and store them properly in a folder, organised by SKU. Every future resize, every other marketplace, every reshoot you avoid, all of it comes from having good masters.

Once you know this, you will not make the WhatsApp mistake again.
`,
};
