// ─── Site-wide configuration ──────────────────────────────────────────────
// Change the brand / domain here and rebuild. Everything (canonical URLs,
// sitemap, JSON-LD, OG tags, manifest) is generated from this file.

export const site = {
  name: 'LabelCropTools',
  shortName: 'LabelCrop',   // PWA short_name: Android truncates past ~12 chars
  tagline: 'Free tools for Indian e-commerce sellers',
  // No trailing slash. Used for canonical, sitemap, OG and JSON-LD.
  url: 'https://labelcroptools.com',
  description:
    'Free browser-based tools for Meesho, Flipkart and Amazon sellers: crop shipping labels, sort by SKU, print multiple pages per sheet, generate picklists, barcodes, GST invoices and more. Nothing is uploaded — files never leave your device.',
  locale: 'en_IN',
  lang: 'en-IN',
  themeColor: '#0B0C0E',
  bgColor: '#E8EBEE',
  twitter: '',   // '@handle' once registered; the meta tag is skipped while this is empty
  email: 'hello@labelcroptools.com',
  whatsapp: '', // e.g. '919999999999' → adds a WhatsApp support link when set
  foundingYear: 2026,
  updated: '2026-09-23',
};

// ─── Analytics ────────────────────────────────────────────────────────────
// provider: 'none' | 'plausible' | 'umami' | 'cloudflare' | 'ga4'
// The first three are cookie-less and need no consent banner. 'ga4' writes cookies,
// so the banner appears automatically and the tag only loads after an explicit Accept.
export const analytics = {
  provider: 'none',
  domain: '',          // plausible: the site domain you registered
  scriptUrl: '',       // plausible / umami: self-hosted script URL (optional)
  websiteId: '',       // umami website id, or Cloudflare Web Analytics token
  measurementId: '',   // ga4: G-XXXXXXXXXX
};

// Providers that store or read anything on the visitor's device.
export const consentRequiredFor = ['ga4'];

// ─── Marketplace logos shown in the rotating hero slot ────────────────────
// Order = rotation order. A brand gets an image when logos/<slug>.(png|webp|jpg)
// exists and `python3 scripts/prep-logos.py` has been run; otherwise it falls back
// to a plain wordmark set in the site's own typeface.
export const brands = [
  { slug: 'meesho', name: 'Meesho' },
  { slug: 'flipkart', name: 'Flipkart' },
  { slug: 'amazon', name: 'Amazon' },
];

// How long each logo stays before the slot rotates (ms).
export const brandRotateMs = 1250;

export const categories = [
  {
    slug: 'label-tools',
    name: 'Shipping Label Tools',
    short: 'Labels',
    icon: 'tag',
    title: 'Label Cropper & Sorter Tools – Meesho, Flipkart, Amazon',
    description:
      'Crop Meesho, Flipkart and Amazon shipping label PDFs, remove invoices, sort by SKU or courier, and print on thermal or A4. Free, no upload, no signup.',
    intro:
      'Every marketplace hands you the same problem: a label PDF that wastes half the page on an invoice you don’t need on the parcel. These tools trim each page to the label, keep or drop the invoice, sort the batch the way your packing table works, and export a printer-ready PDF — all inside your browser.',
  },
  {
    slug: 'pdf-tools',
    name: 'PDF Tools',
    short: 'PDF',
    icon: 'file',
    title: 'Free PDF Tools – Crop, N-up, Merge, Split, Rotate (No Upload)',
    description:
      'Crop PDFs, print multiple pages per sheet, merge, split, rotate and convert PDFs to images. Runs entirely in your browser — your files are never uploaded.',
    intro:
      'Label PDFs, invoices, catalogues, courier manifests — sellers touch a lot of PDFs. These tools do the everyday jobs (crop, arrange pages per sheet, merge, split, rotate, convert) locally in your browser, so a 200-page label file processes in seconds and never leaves your laptop.',
  },
  {
    slug: 'calculators',
    name: 'Seller Calculators',
    short: 'Calculators',
    icon: 'calculator',
    title: 'Seller Calculators – Profit, GST & Volumetric Weight (Free)',
    description:
      'Calculate net profit after Meesho, Flipkart or Amazon fees, split GST into CGST/SGST/IGST, and find chargeable volumetric weight for couriers. Free and instant.',
    intro:
      'Pricing on a marketplace is a chain of deductions — commission, fixed fees, shipping, GST on fees, returns. These calculators make the chain visible so you can price with confidence instead of guessing from last month’s settlement report.',
  },
  {
    slug: 'generators',
    name: 'Generators & Print',
    short: 'Generators',
    icon: 'sparkles',
    title: 'Barcode, QR, Thank-You Card & GST Invoice Generators',
    description:
      'Generate SKU barcodes, UPI / WhatsApp QR codes, printable thank-you cards and GST-compliant invoices as PDF. Free, unlimited, no signup.',
    intro:
      'The small printed things that make a parcel look professional: a clean SKU barcode, a thank-you card with a WhatsApp QR, a proper GST invoice. Generate them here in bulk and print them on plain A4 or label sheets.',
  },
  {
    slug: 'image-tools',
    name: 'Image Tools',
    short: 'Images',
    icon: 'image',
    title: 'Product Image Resizer & Compressor for Marketplace Sellers',
    description:
      'Resize product photos to marketplace dimensions with white padding, and compress images for faster catalog uploads. Batch processing in your browser.',
    intro:
      'Marketplaces reject images for the most boring reasons — wrong ratio, too small, too large a file. Batch-fix product photos to the exact size each platform wants without opening Photoshop.',
  },
];
