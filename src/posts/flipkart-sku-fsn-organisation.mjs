export default {
  slug: 'flipkart-sku-id-fsn-organisation',
  marketplace: 'flipkart',
  keyword: 'Flipkart SKU ID and FSN',
  type: 'Type 3 — Informational / Educational',
  sentiment: '0.55 to 0.75 · Curious + Warm + Trustworthy',
  title: 'Flipkart SKU ID vs FSN: What They Are and How to Name SKUs Properly',
  metaTitle: 'Flipkart SKU ID vs FSN — And How to Name SKUs Properly',
  description: 'SKU ID and FSN do different jobs on Flipkart. Here is what each one means, who controls it, and a naming system that keeps picking accurate as your catalog grows.',
  excerpt: 'One of these you control, one you do not. Getting the difference right (and naming your SKUs properly) is what keeps picking accurate past 50 products.',
  published: '2026-09-21',
  updated: '2026-09-21',
  cover: 'barcode',
  coverAlt: 'Diagram of shelf bins tagged with structured SKU barcodes',
  tools: ['picklist-generator', 'barcode-generator', 'flipkart-label-cropper'],
  faq: [
    { q: 'What is the difference between SKU ID and FSN on Flipkart?', a: 'SKU ID is your own internal identifier for a specific variant, which you choose when listing. FSN (Flipkart Serial Number) is the identifier Flipkart assigns to a product on its own catalog. You control the SKU ID, Flipkart controls the FSN.' },
    { q: 'Can two sellers share the same FSN?', a: 'Yes. An FSN identifies a product in the Flipkart catalog, so multiple sellers listing the same product can map to the same FSN while each keeps their own SKU ID.' },
    { q: 'Should my SKU ID be the same across marketplaces?', a: 'Ideally yes. Keeping one internal SKU per physical variant across every channel is what makes stock counts, picklists and barcodes work. Map each marketplace identifier to your single internal SKU.' },
    { q: 'How long should a SKU code be?', a: 'Short enough to read on a label at a glance, long enough to be unique and meaningful. Around 12 to 20 characters in a fixed structure works well for most catalogs.' },
  ],
  body: `
A seller asked me to help work out why his picking kept going wrong. He had 180 products. His SKU list read like this: \`blue1\`, \`blue2\`, \`bluenew\`, \`blue2final\`, \`kurta-blue-M-new-2\`.

Nothing was broken technically. Every listing was live. But no human could look at a label and know which shelf to walk to.

Here is something most people do not realise until it starts hurting: SKU naming is not admin work, it is operations infrastructure. Let me explain the two identifiers first, because people mix them up constantly.

## Flipkart SKU ID and FSN do different jobs

**SKU ID** is yours. When you list a product on Flipkart, you choose this code. It identifies one specific sellable variant: this product, in this colour, in this size. You can change it (carefully), and it means whatever you decide it means.

**FSN (Flipkart Serial Number)** belongs to Flipkart. It identifies a product within Flipkart's own catalog. If three sellers list the same water bottle, they can all map to the same FSN while each having a completely different SKU ID.

What I find interesting is what this implies. The FSN answers "what product is this in the Flipkart catalog". Your SKU ID answers "which box on which shelf in my godown". Those are genuinely different questions, and you only control the answer to the second one.

> Practical takeaway: never try to make your SKU ID mirror the FSN. You will lose the thing that makes SKU IDs useful, which is that they describe your own physical stock.

## Why naming matters more as you grow

At ten products you can remember everything. At fifty you cannot, and neither can a helper who started last week.

The moment that matters is the packing table. Your Flipkart label carries the SKU ID in the product block. Someone reads it and has to walk to the right shelf without thinking.

If your SKU is \`blue2final\`, they have to think. If it is \`KRT-BLU-M\`, they do not.

## A naming system that holds up

Based on what I have seen working in real godowns, a good SKU code has three properties: it is structured, it is fixed-width where possible, and it reads left to right from general to specific.

A simple pattern:

\`CATEGORY-PRODUCT-COLOUR-SIZE\`

Some real examples:

- \`KRT-RAYON-BLU-M\` (kurta, rayon, blue, medium)
- \`KRT-RAYON-BLU-L\`
- \`BTL-STEEL-750\` (bottle, steel, 750 ml)
- \`PSTR-A4-FILM-01\` (poster set, A4, film theme, design 1)

A few rules that make this work in practice:

1. **Use uppercase and hyphens only.** No spaces, no slashes, no \`#\` or \`&\`. These break CSV uploads and file names.
2. **Keep segment lengths consistent.** \`BLU\` not sometimes \`BLUE\` and sometimes \`BL\`. Consistency is what lets you sort and filter.
3. **Never reuse a retired code.** If a product is discontinued, that code is gone forever. Reusing it corrupts your own history.
4. **Put the variant at the end.** Size and colour last means all variants of one product sort together alphabetically, which is exactly how you want them on a picklist.
5. **Avoid characters that look alike.** The digit 0 and the letter O, 1 and I. At speed, under warehouse lighting, they get confused.

## The part that pays off immediately

Here is why this actually matters to you today, not in a year.

Once SKUs are structured, two things become possible that were not before.

**Picklists become readable.** Drop your Flipkart label PDF into the [Picklist Generator](/picklist-generator/) and it reads the SKU, size, colour and quantity from every label and rolls them up into one table. With structured SKUs, all variants of one product appear together and the picker walks the shelf once. With \`blue2final\` scattered among \`bluenew\`, they do not.

**Barcodes become worth printing.** A barcode on each shelf bin, scanned against the pick, catches the wrong-variant mistake before the parcel is sealed. The [Barcode Generator](/barcode-generator/) takes a pasted list of SKU codes and prints them onto standard A4 sticker sheets. Code 128 is the right symbology here because it encodes letters, digits and hyphens compactly.

That second one is only useful if your codes are meaningful. Scanning a barcode that says \`blue2final\` tells the picker nothing they can verify.

## One internal SKU, many marketplace identifiers

This is the bit that saves you when you are on more than one platform.

Keep **one internal SKU per physical variant**, and treat every marketplace identifier as something that maps to it.

A small sheet with these columns is enough:

| Internal SKU | Flipkart SKU ID | Flipkart FSN | Meesho SKU | Amazon SKU / ASIN | Stock |
|---|---|---|---|---|---|
| KRT-RAYON-BLU-M | KRT-RAYON-BLU-M | (assigned) | KRT-RAYON-BLU-M | KRT-RAYON-BLU-M | 42 |

Ideally your marketplace SKU IDs are simply identical to your internal SKU, which is the simplest possible mapping. Where a platform forces something different, the sheet absorbs it.

The stock column is the reason this exists. One physical pile of medium blue kurtas is being sold on three channels. If each channel has its own idea of what it is called, you will oversell.

## Renaming existing SKUs: proceed carefully

If your current codes are a mess, the instinct is to fix everything this weekend. I would not.

Changing a SKU ID on a live listing can affect order history and reporting, and the exact behaviour depends on current Flipkart Seller Hub rules. Confirm before you touch anything at scale.

A safer approach:

1. Decide your naming standard and write it down in one paragraph.
2. Apply it to **every new listing** from today.
3. Build the mapping sheet for existing products, with your new internal SKU in the first column, even while the marketplace code stays old.
4. Migrate old listings only when you have a reason to edit them anyway.

Your picklists and barcodes can run off the internal SKU column immediately, so you get most of the benefit without a risky bulk edit.

## My honest opinion

SKU naming is the least glamorous thing in this whole business and one of the highest leverage. It costs one afternoon to define and then pays back every single dispatch day.

The test I would use: hand your label to someone who has worked with you for one week, and see whether they can find the item without asking. If they can, your system works. If they hesitate, the SKU is the problem, not the person.

Write the standard down, stick it on the wall above the packing table, and apply it to everything new from tomorrow. Future you, at three times the volume, will be very grateful.
`,
};
