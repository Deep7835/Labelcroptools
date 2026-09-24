// ─── Tool definitions: SEO content + UI panel markup ──────────────────────
// Each tool becomes /<slug>/ with its own title, description, HowTo, FAQ,
// SoftwareApplication + BreadcrumbList JSON-LD, and related-tool links.

const UPDATED = '2026-09-22';

// ── small markup helpers ─────────────────────────────────────────────────
const dropzone = (opts = {}) => `
<div class="dropzone" id="drop" tabindex="0" role="button" aria-label="${opts.label || 'Select PDF file'}">
  <input type="file" id="file" accept="${opts.accept || 'application/pdf'}" ${opts.multiple ? 'multiple' : ''} hidden>
  <div class="dz-inner">
    <span class="dz-icon"><svg class="ic" aria-hidden="true"><use href="#i-upload"/></svg></span>
    <p class="dz-title">${opts.title || 'Drop your PDF here'}</p>
    <p class="dz-sub">${opts.sub || 'or click to browse · stays on your device'}</p>
    <span class="dz-choose">${opts.accept?.startsWith('image') ? 'Choose images' : opts.multiple ? 'Choose PDFs' : 'Choose PDF'}</span>
  </div>
</div>
<div class="file-list" id="files" aria-live="polite"></div>`;

const radios = (name, legend, items, checked = 0, extra = '') => `
<fieldset class="opt" ${extra}>
  <legend>${legend}</legend>
  <div class="seg">
    ${items
      .map(
        (it, i) =>
          `<label><input type="radio" name="${name}" value="${it.v}" ${i === checked ? 'checked' : ''}><span>${it.l}</span></label>`,
      )
      .join('')}
  </div>
</fieldset>`;

const check = (id, label, checked = false) =>
  `<label class="chk"><input type="checkbox" id="${id}" ${checked ? 'checked' : ''}><span>${label}</span></label>`;

const num = (id, label, value, attrs = '') =>
  `<label class="field"><span>${label}</span><input type="number" id="${id}" value="${value}" ${attrs}></label>`;

const text = (id, label, value = '', attrs = '') =>
  `<label class="field"><span>${label}</span><input type="text" id="${id}" value="${value}" ${attrs}></label>`;

const select = (id, label, items, attrs = '') =>
  `<label class="field"><span>${label}</span><select id="${id}" ${attrs}>${items
    .map((it) => `<option value="${it.v}" ${it.s ? 'selected' : ''}>${it.l}</option>`)
    .join('')}</select></label>`;

const runbar = (btn, id = 'run', extra = '') => `
<div class="runbar">
  <button class="btn btn-primary btn-lg" id="${id}" disabled>${btn} <svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg></button>
  ${extra}
  <p class="status" id="status" role="status" aria-live="polite"></p>
</div>
<p class="local-note"><svg class="ic" aria-hidden="true"><use href="#i-shield"/></svg> Everything runs locally in your browser — this file is never uploaded.</p>`;

const preview = (title = 'Preview') =>
  `<div class="preview" id="preview" hidden><h3 class="preview-title">${title}</h3><div class="thumbs" id="thumbs"></div></div>`;

// Common feature blocks reused across the label croppers
const cropperFeatures = (mp) => [
  { title: 'Unlimited & free', text: `No daily limit, no watermark, no account. Crop as many ${mp} label PDFs as your order volume demands.` },
  { title: 'Runs in your browser', text: 'The PDF is processed with WebAssembly on your own device. Nothing is uploaded, so it also works on slow connections.' },
  { title: 'Batch in one pass', text: 'A 300-page label file is cropped, sorted and rebuilt in a few seconds — not page by page.' },
  { title: 'Thermal or A4 output', text: 'One label per page for 4×6 thermal printers, or 2 / 4 labels per A4 sheet for a normal inkjet or laser printer.' },
  { title: 'Sort by SKU or courier', text: 'Reorder the whole batch so identical products are picked together and courier bags are packed in one go.' },
  { title: 'SKU & Qty stamp', text: 'Optionally print the SKU and quantity in large text under each label so packers never squint at the small product table.' },
];

const labelPanel = (market) => `
<div class="tool-ui" data-tool="label-cropper" data-market="${market}">
  ${dropzone({ multiple: true, title: 'Drop your label PDF here', sub: 'Multiple files allowed · they are merged in order · nothing is uploaded' })}
  <div class="opts">
    ${radios('invoice', 'Invoice', [{ v: 'without', l: 'Without invoice' }, { v: 'with', l: 'With invoice' }])}
    ${radios('layout', 'Output layout', [{ v: 'thermal', l: 'Label printer (1 per page)' }, { v: 'a4x4', l: 'A4 · 4 per sheet' }, { v: 'a4x2', l: 'A4 · 2 per sheet' }])}
    ${radios('size', 'Label page size', [{ v: 'auto', l: 'Auto (cropped size)' }, { v: '4x6', l: 'Fit to 4 × 6 in' }], 0, 'data-show="layout=thermal"')}
    ${radios('sort', 'Sort labels by', [{ v: 'none', l: 'Original order' }, { v: 'sku', l: 'SKU' }, { v: 'courier', l: 'Courier partner' }, { v: 'qty', l: 'Qty (multi-qty first)' }])}
    <fieldset class="opt"><legend>Extras</legend>
      <div class="chks">
        ${check('stamp', 'Stamp SKU &amp; Qty in big text under each label')}
        ${check('border', 'Draw a cut border around each label on A4', true)}
      </div>
    </fieldset>
  </div>
  ${preview('Preview (first 8 labels)')}
  ${runbar('Crop & download PDF')}
</div>`;

const cropperFaqCommon = (mp) => [
  {
    q: `Does my ${mp} label PDF get uploaded to a server?`,
    a: 'No. The cropping engine runs inside your browser using WebAssembly. You can switch off Wi-Fi after the page loads and it still works. Files, order data and customer addresses never leave your device.',
  },
  {
    q: 'Should I choose Label Printer or A4 output?',
    a: 'Choose Label printer if you use a thermal printer with 4 × 6 inch (100 × 150 mm) rolls — each label becomes its own page. Choose A4 · 4 per sheet or A4 · 2 per sheet for a normal inkjet or laser printer; labels are arranged on a sheet with optional cut borders.',
  },
  {
    q: 'What does “Fit to 4 × 6 in” do?',
    a: 'It scales every cropped label to a standard 4 × 6 inch page so thermal printers with a fixed roll size print edge-to-edge without asking you to pick a custom paper size.',
  },
  {
    q: 'Can I crop several PDFs at once?',
    a: 'Yes. Select multiple label PDFs — they are merged in the order shown, then cropped and sorted as one batch, so you get a single print-ready file for the day’s dispatch.',
  },
];

// ─── TOOL LIST ────────────────────────────────────────────────────────────
export const tools = [
  // ═══════════════════════ LABEL TOOLS ═══════════════════════
  {
    slug: 'meesho-label-cropper',
    short: "Remove invoices, sort by SKU or courier, print thermal or 4-per-A4.",
    category: 'label-tools',
    name: 'Meesho Label Cropper',
    h1: 'Meesho Label Cropper',
    title: 'Meesho Label Cropper – Crop Shipping Labels Free, No Upload',
    description:
      'Crop Meesho shipping label PDFs in seconds: remove the tax invoice, sort by SKU or courier, and print on thermal 4x6 or A4 (4 per sheet). Free, unlimited, runs in your browser.',
    tagline: 'Trim Meesho label PDFs to just the shipping label, sort by SKU or courier, and download a print-ready file — free, no signup, nothing uploaded.',
    keywords: ['meesho label cropper', 'meesho label crop', 'crop meesho shipping label', 'meesho label cutter', 'meesho label pdf crop online', 'meesho thermal label'],
    icon: 'scissors',
    badge: 'Most used',
    script: 'label-cropper',
    libs: ['pdfjs', 'pdflib'],
    panel: labelPanel('meesho'),
    intro: [
      'Meesho’s “Download Labels” file puts the shipping label and the full tax invoice on the same A4 page. Print it as-is and you get one label per sheet, a lot of blank paper, and an invoice the courier doesn’t need. Multiply that by 100 orders and you are paying for ink and time you don’t have to.',
      'The Meesho Label Cropper reads each page, finds where the label ends and the TAX INVOICE begins, and cuts exactly there. Choose “With invoice” to keep both while trimming the empty space, or “Without invoice” to keep only the label. It also reads the SKU, quantity and courier (Valmo, Delhivery, Xpressbees, Ekart, Shadowfax and others) printed on every label so the batch can be sorted before printing.',
    ],
    steps: [
      { title: 'Select your Meesho label PDF', text: 'Drop the file downloaded from the Meesho Supplier Panel (Orders → Download Labels). You can add more than one file — they are merged in order.' },
      { title: 'Pick invoice, layout and sort options', text: 'Keep or remove the invoice, choose Label printer (thermal) or A4 sheets, and sort by SKU, courier or quantity. Optionally stamp SKU & Qty under every label.' },
      { title: 'Crop & download', text: 'Preview the first labels, then click Crop & download. The cropped PDF is generated on your device and downloads immediately.' },
    ],
    benefits: [
      { title: 'Half the paper, half the ink', text: 'Removing invoices and packing 4 labels per A4 sheet cuts a 100-order print run from 100 sheets to 25.' },
      { title: 'Pick faster with SKU sorting', text: 'All orders for the same product come out together, so the packer picks once and packs many.' },
      { title: 'Pack by courier bag', text: 'Sort by courier partner and every Valmo, Delhivery or Xpressbees label is grouped for its own pickup bag.' },
      { title: 'Thermal-printer ready', text: '“Fit to 4 × 6 in” scales each label to the exact roll size so nothing is cut off and no printer dialog fiddling is needed.' },
    ],
    features: cropperFeatures('Meesho'),
    faq: [
      {
        q: 'How do I crop a Meesho label PDF without the invoice?',
        a: 'Upload the label PDF, keep “Without invoice” selected, choose your printer layout and click Crop & download. The tool detects the TAX INVOICE heading on each page and keeps only the label block above it.',
      },
      {
        q: 'Which couriers does the sort-by-courier option recognise?',
        a: 'Valmo, Delhivery, Xpressbees, Ekart, Shadowfax, Ecom Express, Amazon Shipping, Blue Dart, DTDC and Shiprocket. Labels from an unrecognised courier are grouped under “Other” at the end.',
      },
      {
        q: 'Does it work with Meesho labels that have multiple quantities?',
        a: 'Yes. The Qty printed in the product table is read for every label. Sort by “Qty (multi-qty first)” to pack multi-unit orders first, and switch on the SKU & Qty stamp so quantities are impossible to miss.',
      },
      ...cropperFaqCommon('Meesho'),
      {
        q: 'Is this an official Meesho tool?',
        a: 'No. It is an independent, free utility built for suppliers. It only processes the PDF you choose; it does not connect to your Meesho account.',
      },
    ],
    related: ['flipkart-label-cropper', 'picklist-generator', 'pages-per-sheet', 'thank-you-card-maker'],
  },

  {
    slug: 'flipkart-label-cropper',
    short: "Label-only or with invoice, thermal 4×6 or A4 sheets, SKU sorted.",
    category: 'label-tools',
    name: 'Flipkart Label Cropper',
    h1: 'Flipkart Label Cropper',
    title: 'Flipkart Label Cropper – Crop Shipping Labels Online Free',
    description:
      'Crop Flipkart shipping label PDFs: keep or remove the invoice, sort by SKU, and print on thermal 4x6 or A4 with 2 or 4 labels per sheet. Free, no upload, no signup.',
    tagline: 'Cut Flipkart label PDFs down to the label, with or without the tax invoice, sorted and ready for your thermal or A4 printer.',
    keywords: ['flipkart label cropper', 'flipkart label crop', 'crop flipkart shipping label', 'flipkart label cutter', 'flipkart label pdf a4', 'flipkart thermal label'],
    icon: 'scissors',
    script: 'label-cropper',
    libs: ['pdfjs', 'pdflib'],
    panel: labelPanel('flipkart'),
    intro: [
      'Flipkart Seller Hub label PDFs bundle the Ekart shipping label with the tax invoice on one page, and some formats add an extra invoice page per order. Printed raw, every order eats a full A4 sheet even though the label needs a quarter of it.',
      'This cropper locates the label block and the “Tax Invoice” section on each page and separates them. Keep both, trimmed of blank space, or drop the invoice and print just labels. The SKU ID and quantity are read from every label so a batch of 200 orders can be sorted by product before it reaches the packing table.',
    ],
    steps: [
      { title: 'Select your Flipkart label PDF', text: 'Use the file from Seller Hub → Orders → Download Labels. Add several files if you dispatch from more than one listing group.' },
      { title: 'Choose invoice and layout', text: 'Pick Without or With invoice, then Label printer, A4 · 4 per sheet or A4 · 2 per sheet. Sort by SKU or courier if needed.' },
      { title: 'Crop & download', text: 'Check the preview, click Crop & download, and print the resulting PDF at 100 % scale.' },
    ],
    benefits: [
      { title: 'Print only what the parcel needs', text: 'Drop the invoice for prepaid orders that don’t require a physical copy and save a sheet per order.' },
      { title: 'A4 or thermal, your choice', text: 'Sellers with a normal printer get 2 or 4 labels per sheet; thermal users get one 4 × 6 label per page.' },
      { title: 'Sorted before you print', text: 'SKU-sorted output means the packer handles one product at a time instead of hunting through the stack.' },
      { title: 'Works with all Flipkart label formats', text: 'Standard, express and multi-quantity labels are handled by content detection rather than fixed page coordinates.' },
    ],
    features: cropperFeatures('Flipkart'),
    faq: [
      {
        q: 'How do I crop a Flipkart label to A4 with 4 labels per page?',
        a: 'Upload the label PDF, select Without invoice (or With invoice), choose “A4 · 4 per sheet” and click Crop & download. Each A4 page carries four labels with a light cut border.',
      },
      {
        q: 'Can I keep the Flipkart invoice with the label?',
        a: 'Yes. Choose “With invoice” — the label and invoice stay together on the same page while the blank margin at the bottom is trimmed. Invoice-only pages are kept in that mode and dropped in “Without invoice” mode.',
      },
      {
        q: 'Why does the tool detect text instead of using fixed crop sizes?',
        a: 'Flipkart changes its label layout from time to time and the invoice height varies with the number of items. Reading the page content makes the crop land in the right place for every order instead of cutting through a line of text.',
      },
      ...cropperFaqCommon('Flipkart'),
    ],
    related: ['meesho-label-cropper', 'amazon-label-cropper', 'picklist-generator', 'pages-per-sheet'],
  },

  {
    slug: 'amazon-label-cropper',
    short: "Easy Ship labels to true 4×6, invoice pages dropped automatically.",
    category: 'label-tools',
    name: 'Amazon Label Cropper',
    h1: 'Amazon Label Cropper (Easy Ship & Self Ship)',
    title: 'Amazon Label Cropper – Crop Amazon Easy Ship Labels to 4x6 Free',
    description:
      'Crop Amazon Easy Ship and Self Ship label PDFs to 4x6 thermal size or A4 sheets, drop invoice pages, and sort by SKU. Free, unlimited, processed in your browser.',
    tagline: 'Turn Amazon.in Easy Ship label PDFs into clean 4 × 6 labels or A4 sheets, without the invoice pages you don’t want to print.',
    keywords: ['amazon label cropper', 'amazon easy ship label crop', 'amazon shipping label 4x6', 'crop amazon label pdf', 'amazon self ship label cropper'],
    icon: 'scissors',
    script: 'label-cropper',
    libs: ['pdfjs', 'pdflib'],
    panel: labelPanel('amazon'),
    intro: [
      'Amazon.in Easy Ship label PDFs place a 4 × 6 label on an A4 page and often follow it with a full-page tax invoice. Thermal printers need the label alone at its real size; A4 printers waste most of the sheet.',
      'The Amazon Label Cropper detects invoice pages by their headings, crops label pages to their printed content, and rebuilds the file as one label per 4 × 6 page or as 2 / 4 labels per A4 sheet. Sorting by SKU keeps identical ASINs together during packing.',
    ],
    steps: [
      { title: 'Select your Amazon label PDF', text: 'Download labels from Seller Central (Manage Orders → Buy Shipping / Print labels) and drop the file here.' },
      { title: 'Set invoice, layout and sorting', text: 'Without invoice removes invoice pages; With invoice keeps them trimmed. Choose Label printer with Fit to 4 × 6 in for thermal rolls.' },
      { title: 'Crop & download', text: 'Preview the result and download your print-ready PDF.' },
    ],
    benefits: [
      { title: 'True 4 × 6 thermal output', text: 'Each label is scaled to a 100 × 150 mm page so a roll printer prints it edge to edge.' },
      { title: 'Invoice pages removed automatically', text: 'Pages headed Tax Invoice / Bill of Supply are recognised and skipped in “Without invoice” mode.' },
      { title: 'A4 batch printing', text: 'Fit 2 or 4 labels on a sheet with cut borders when you don’t own a thermal printer.' },
      { title: 'Keeps barcodes crisp', text: 'Cropping changes the page box, not the content, so barcodes stay vector-sharp and scan on the first try.' },
    ],
    features: cropperFeatures('Amazon'),
    faq: [
      {
        q: 'Will the Amazon barcode still scan after cropping?',
        a: 'Yes. The tool crops by changing the page’s visible area rather than rasterising it, so the barcode remains an exact vector graphic and prints at full quality.',
      },
      {
        q: 'How are invoice pages detected?',
        a: 'A page whose text contains a Tax Invoice, Bill of Supply or Invoice Number heading without a shipping barcode block is treated as an invoice page. In rare custom formats a page may be mis-classified; use the With invoice mode or the manual PDF Crop tool for those.',
      },
      {
        q: 'Can I use this for FBA shipment labels?',
        a: 'FBA box and item labels are already generated at 4 × 6 or on label sheets, so they rarely need cropping. For custom sheet layouts use the Pages per Sheet tool instead.',
      },
      ...cropperFaqCommon('Amazon'),
    ],
    related: ['shipping-label-cropper', 'flipkart-label-cropper', 'pdf-crop', 'pages-per-sheet'],
  },

  {
    slug: 'shipping-label-cropper',
    short: "Drop any marketplace label PDF — format detected, cropped right.",
    category: 'label-tools',
    name: 'Universal Label Cropper',
    h1: 'Universal Shipping Label Cropper',
    title: 'Shipping Label Cropper – Auto-Detects Meesho, Flipkart, Amazon',
    description:
      'One label cropper for every marketplace. Drop any shipping label PDF and it auto-detects Meesho, Flipkart or Amazon formats, crops to the label, and exports thermal or A4 output. Free.',
    tagline: 'Not sure which marketplace a file came from? Drop it here — the format is detected automatically and cropped the right way.',
    keywords: ['shipping label cropper', 'label crop tool', 'crop shipping label pdf', 'label cropper online', 'ecommerce label cutter', 'courier label crop'],
    icon: 'wand',
    badge: 'Auto-detect',
    script: 'label-cropper',
    libs: ['pdfjs', 'pdflib'],
    panel: labelPanel('auto'),
    intro: [
      'If you sell on more than one marketplace, you end up with a folder of label PDFs in three different layouts. The Universal Label Cropper reads the text of each page, works out whether it is a Meesho, Flipkart or Amazon label, and applies the matching crop rules — page by page, so even a merged file mixing marketplaces comes out right.',
      'Files from other platforms (Myntra, Ajio, JioMart, Shopify apps, courier aggregators) fall back to a smart “crop to content” mode that trims blank margins and removes obvious invoice pages, which is usually all they need.',
    ],
    steps: [
      { title: 'Drop any label PDF', text: 'Add one or several PDFs from any marketplace. Each page is analysed and tagged with the detected source.' },
      { title: 'Review detection and pick options', text: 'The file list shows what was detected. Choose invoice handling, layout, sorting and extras exactly as in the dedicated croppers.' },
      { title: 'Crop & download', text: 'A single print-ready PDF is generated locally with all labels cropped and sorted.' },
    ],
    benefits: [
      { title: 'One workflow for every channel', text: 'Meesho in the morning, Flipkart at noon, Amazon in the evening — same tool, same options, same output.' },
      { title: 'Mixed files welcome', text: 'Detection happens per page, so a merged PDF with different marketplaces still crops correctly.' },
      { title: 'Graceful fallback', text: 'Unknown formats are cropped to their printed content instead of being rejected.' },
      { title: 'Same speed and privacy', text: 'Detection uses the PDF’s embedded text — no OCR, no upload, no waiting.' },
    ],
    features: cropperFeatures('marketplace'),
    faq: [
      {
        q: 'How does auto-detection work?',
        a: 'Each page’s text is scored against marketplace fingerprints — phrases such as “Customer Address” and “If undelivered, return to” for Meesho, Ekart and Seller Hub markers for Flipkart, and Easy Ship / amazon.in markers for Amazon. The highest score wins; a low score triggers content-based cropping.',
      },
      {
        q: 'What if detection picks the wrong marketplace?',
        a: 'Open the dedicated Meesho, Flipkart or Amazon cropper, which forces that format. For anything unusual, the manual PDF Crop tool lets you draw the exact crop area.',
      },
      ...cropperFaqCommon('marketplace'),
    ],
    related: ['meesho-label-cropper', 'flipkart-label-cropper', 'amazon-label-cropper', 'pdf-crop'],
  },

  {
    slug: 'picklist-generator',
    short: "SKU-wise units, sizes, colours and courier counts from label PDFs.",
    category: 'label-tools',
    name: 'Picklist Generator',
    h1: 'Picklist Generator from Label PDF',
    title: 'Picklist Generator from Meesho & Flipkart Label PDFs',
    description:
      'Upload Meesho or Flipkart shipping label PDFs and get an instant SKU-wise picklist with quantities, sizes, colours and courier counts. Export to CSV or print. Free, no upload.',
    tagline: 'Turn today’s label PDF into a SKU-wise pick list in one click — know exactly how many of each product to pull from the shelf before you print a single label.',
    keywords: ['meesho picklist generator', 'picklist from label pdf', 'flipkart pick list', 'sku wise order summary', 'meesho order summary tool', 'packing list generator'],
    icon: 'list',
    badge: 'Unique',
    script: 'picklist',
    libs: ['pdfjs'],
    panel: `
<div class="tool-ui" data-tool="picklist">
  ${dropzone({ multiple: true, title: 'Drop Meesho / Flipkart / Amazon label PDFs', sub: 'Multiple files allowed · nothing is uploaded' })}
  <div class="stats" id="stats" hidden></div>
  <div class="tablewrap" id="tablewrap" hidden>
    <div class="table-tools">
      <input type="search" id="q" placeholder="Filter by SKU, size, colour…" aria-label="Filter picklist">
      <div class="btns">
        <button class="btn" id="csv"><svg class="ic" aria-hidden="true"><use href="#i-download"/></svg> CSV</button>
        <button class="btn" id="print"><svg class="ic" aria-hidden="true"><use href="#i-printer"/></svg> Print</button>
      </div>
    </div>
    <table class="tbl" id="tbl">
      <thead><tr><th>#</th><th>SKU</th><th>Size</th><th>Colour</th><th class="r">Orders</th><th class="r">Units</th><th>Couriers</th><th><input type="checkbox" aria-label="Mark all picked" id="allpick"></th></tr></thead>
      <tbody></tbody>
    </table>
    <div class="courier-summary" id="couriers"></div>
  </div>
  <p class="status" id="status" role="status" aria-live="polite"></p>
  <p class="local-note"><svg class="ic" aria-hidden="true"><use href="#i-shield"/></svg> Everything runs locally in your browser — label data never leaves this device.</p>
</div>`,
    intro: [
      'Before labels are printed, someone has to walk the shelves and pull stock. Reading 150 labels one by one to count “how many blue kurtas in size M” is slow and error-prone — and the mistake only surfaces when a parcel is already sealed.',
      'The Picklist Generator reads the SKU, size, colour and quantity from every page of your Meesho, Flipkart or Amazon label PDF and rolls them up into a clean table: units per SKU, orders per SKU, and how many parcels go to each courier. Tick items off as you pick, export to CSV for your inventory sheet, or print it for the floor.',
    ],
    steps: [
      { title: 'Drop your label PDFs', text: 'Add all of today’s label files. Each page is read for SKU, size, colour, quantity and courier partner.' },
      { title: 'Review the picklist', text: 'Rows are grouped by SKU + size + colour and sorted by units. Use the filter box to find a product, and tick rows as you pick.' },
      { title: 'Export or print', text: 'Download CSV for Excel / Google Sheets, or print the list to carry through the warehouse.' },
    ],
    benefits: [
      { title: 'Pick once per SKU', text: 'Know the total units of each product up front instead of discovering them label by label.' },
      { title: 'Courier bag counts', text: 'See how many parcels go to Valmo, Delhivery, Xpressbees and others so bags are ready before pickup.' },
      { title: 'Zero data entry', text: 'Quantities come straight from the labels — nothing is typed, nothing is mis-typed.' },
      { title: 'Feeds your inventory sheet', text: 'CSV export drops straight into the stock sheet you already use.' },
    ],
    features: [
      { title: 'Multi-marketplace', text: 'Meesho, Flipkart and Amazon labels are parsed in the same session and combined into one list.' },
      { title: 'Groups variants', text: 'Same SKU in different sizes or colours are separate rows, so the picker pulls the right variant.' },
      { title: 'Tick-off mode', text: 'Check rows as you pick; progress is kept until the page is refreshed.' },
      { title: 'Print-optimised', text: 'A clean black-and-white print layout with large text fits 40+ rows on one A4 sheet.' },
      { title: 'CSV export', text: 'Columns: SKU, Size, Colour, Orders, Units, Couriers — ready for Excel or Sheets.' },
      { title: 'Private by design', text: 'Customer names and addresses are never extracted or stored; only product and courier fields are read.' },
    ],
    faq: [
      { q: 'Which fields are read from each label?', a: 'SKU, size, colour, quantity, order number (for de-duplication) and courier partner. Customer details are ignored entirely.' },
      { q: 'What if a label has no SKU printed?', a: 'The row is listed under “(no SKU)” with the product description where available, so nothing is silently dropped from the count.' },
      { q: 'Can I use it with cropped label PDFs?', a: 'Yes, as long as the product table is still present on the page. If you cropped labels “Without invoice”, the SKU table is kept and the picklist works normally.' },
      { q: 'Does it double count if the same order appears in two files?', a: 'Orders are de-duplicated by order number when it can be read, so re-downloaded labels are not counted twice.' },
    ],
    related: ['meesho-label-cropper', 'flipkart-label-cropper', 'barcode-generator', 'profit-calculator'],
  },

  // ═══════════════════════ PDF TOOLS ═══════════════════════
  {
    slug: 'pdf-crop',
    short: "Drag a box over the preview, crop all pages or one, vector-sharp.",
    category: 'pdf-tools',
    name: 'PDF Crop',
    h1: 'Crop PDF Online',
    title: 'Crop PDF Online Free – Drag to Crop Pages, No Upload',
    description:
      'Crop PDF pages by dragging a box over the preview. Apply to all pages or just one, keep vector quality, and download instantly. Free, unlimited, files never leave your browser.',
    tagline: 'Draw the area you want to keep, apply it to every page or just the current one, and download a cropped PDF — vector-sharp, never uploaded.',
    keywords: ['crop pdf', 'crop pdf online', 'pdf cropper', 'crop pdf pages', 'trim pdf margins', 'crop shipping label pdf manually'],
    icon: 'crop',
    script: 'pdf-crop',
    libs: ['pdfjs', 'pdflib'],
    panel: `
<div class="tool-ui" data-tool="pdf-crop">
  ${dropzone({ title: 'Drop a PDF to crop', sub: 'Click to browse · stays on your device' })}
  <div class="crop-stage" id="stage" hidden>
    <div class="crop-canvas-wrap" id="wrap">
      <canvas id="cv"></canvas>
      <div class="cropbox" id="box" role="group" aria-label="Crop area">
        <div class="h nw" data-h="nw"></div><div class="h n" data-h="n"></div><div class="h ne" data-h="ne"></div>
        <div class="h w" data-h="w"></div><div class="h e" data-h="e"></div>
        <div class="h sw" data-h="sw"></div><div class="h s" data-h="s"></div><div class="h se" data-h="se"></div>
      </div>
    </div>
    <div class="crop-side">
      <div class="note"><svg class="ic" aria-hidden="true"><use href="#i-info"/></svg> Drag the box or its handles to select the area to keep.</div>
      <div class="crop-nav">
        <button class="btn btn-sm" id="prev" aria-label="Previous page">‹</button>
        <span><input type="number" id="pg" value="1" min="1" aria-label="Page number"> / <span id="pc">1</span></span>
        <button class="btn btn-sm" id="next" aria-label="Next page">›</button>
        <button class="btn btn-sm" id="zout" aria-label="Zoom out">−</button>
        <span id="zoom">100%</span>
        <button class="btn btn-sm" id="zin" aria-label="Zoom in">+</button>
      </div>
      ${radios('scope', 'Apply to', [{ v: 'all', l: 'All pages' }, { v: 'current', l: 'Current page only' }])}
      <div class="crop-dims" id="dims"></div>
      <div class="chks">${check('exact', 'Use exact values (mm)')}</div>
      <div class="crop-exact" id="exact" hidden>
        <div class="grid4">${num('mx', 'X', 0, 'step="0.1"')}${num('my', 'Y', 0, 'step="0.1"')}${num('mw', 'Width', 0, 'step="0.1"')}${num('mh', 'Height', 0, 'step="0.1"')}</div>
      </div>
      <button class="btn btn-ghost btn-sm" id="reset">Reset all</button>
    </div>
  </div>
  ${runbar('Crop PDF')}
</div>`,
    intro: [
      'Sometimes an automatic cropper is the wrong tool — a courier manifest with an odd layout, a scanned document with a black border, a label from a platform nobody has heard of. PDF Crop gives you a live preview and a crop box you drag with your mouse or finger, the way you would crop a photo.',
      'Because cropping adjusts the page’s crop box instead of re-rendering it as an image, text, barcodes and lines stay perfectly sharp and the file stays small. Apply the same area to every page, or crop individual pages differently.',
    ],
    steps: [
      { title: 'Open your PDF', text: 'Drop the file. The first page renders in the preview with a crop box covering the full page.' },
      { title: 'Draw the crop area', text: 'Drag the box or its eight handles. Navigate between pages to check the fit, zoom for precision, or type exact millimetre values.' },
      { title: 'Apply and download', text: 'Choose All pages or Current page only and click Crop PDF. The cropped file downloads immediately.' },
    ],
    benefits: [
      { title: 'See exactly what you keep', text: 'Live preview with resize handles — no guessing margins in millimetres unless you want to.' },
      { title: 'Vector quality preserved', text: 'Nothing is rasterised; barcodes and text print as crisp as the original.' },
      { title: 'Per-page or whole document', text: 'Same crop for all pages, or a different area per page for mixed documents.' },
      { title: 'Handles big files', text: 'Crop a 500-page file in seconds — only the page boxes change, so the output is instant.' },
    ],
    features: [
      { title: 'Drag & resize', text: 'Eight handles, touch support, and arrow-key nudging for fine adjustment.' },
      { title: 'Exact values', text: 'Type X, Y, width and height in millimetres for repeatable crops.' },
      { title: 'Page navigation & zoom', text: 'Step through pages and zoom in to place the box against fine lines.' },
      { title: 'Reset any time', text: 'One click restores the full page.' },
      { title: 'Unlimited & free', text: 'No page limits, no watermark, no signup.' },
      { title: 'Local processing', text: 'The PDF never leaves your device.' },
    ],
    faq: [
      { q: 'Does cropping reduce the PDF quality?', a: 'No. The tool changes the page’s crop and media boxes, which is a lossless operation. Text stays selectable and vector graphics stay sharp.' },
      { q: 'Can I crop different pages differently?', a: 'Yes. Select “Current page only”, set the box for that page, then move to the next page and adjust again. Pages you don’t touch keep the full page.' },
      { q: 'Can I crop a shipping label to 4 × 6 inches?', a: 'Yes — switch on exact values and enter a width of 101.6 mm and height of 152.4 mm, then position the box. For Meesho, Flipkart and Amazon labels the dedicated croppers do this automatically.' },
      { q: 'Is there a file size limit?', a: 'There is no hard limit. Processing happens in your browser’s memory, so very large files (hundreds of MB) depend on your device’s RAM.' },
    ],
    related: ['pages-per-sheet', 'shipping-label-cropper', 'rotate-pdf', 'split-pdf'],
  },

  {
    slug: 'pages-per-sheet',
    short: "2, 4, 6, 8, 9 or 16 pages per sheet with borders and live preview.",
    category: 'pdf-tools',
    name: 'Pages per Sheet',
    h1: 'Multiple Pages per Sheet (N-up PDF)',
    title: 'Pages per Sheet PDF – Print 2, 4, 6, 8, 9, 16 Pages on One Sheet',
    description:
      'Arrange 2, 4, 6, 8, 9 or 16 PDF pages on one A4 or Letter sheet with borders, margins and reading order. Live preview, print-ready output, no upload. Free N-up PDF tool.',
    tagline: 'Put 2, 4, 6, 8, 9 or 16 pages on a single sheet — perfect for printing label batches, catalogues and invoices on less paper.',
    keywords: ['multiple pages per sheet pdf', 'n-up pdf', '4 pages per sheet pdf', '2 pages per sheet pdf online', 'pdf pages per sheet online free', 'print 4 labels on one page'],
    icon: 'grid',
    badge: 'Popular',
    script: 'nup',
    libs: ['pdfjs', 'pdflib'],
    panel: `
<div class="tool-ui" data-tool="nup">
  ${dropzone({ title: 'Drop a PDF to arrange', sub: 'Click to browse · stays on your device' })}
  <div class="nup-layout" id="nupui" hidden>
    <div class="opts">
      ${select('n', 'Pages per sheet', [{ v: 2, l: '2 pages' }, { v: 4, l: '4 pages', s: true }, { v: 6, l: '6 pages' }, { v: 8, l: '8 pages' }, { v: 9, l: '9 pages' }, { v: 16, l: '16 pages' }])}
      ${select('paper', 'Sheet size', [{ v: 'A4', l: 'A4 (210 × 297 mm)', s: true }, { v: 'A3', l: 'A3 (297 × 420 mm)' }, { v: 'Letter', l: 'Letter (8.5 × 11 in)' }, { v: 'Legal', l: 'Legal (8.5 × 14 in)' }, { v: '4x6', l: '4 × 6 in label' }])}
      ${radios('orient', 'Orientation', [{ v: 'auto', l: 'Auto' }, { v: 'portrait', l: 'Portrait' }, { v: 'landscape', l: 'Landscape' }])}
      ${radios('dir', 'Reading direction', [{ v: 'row', l: 'Row by row' }, { v: 'col', l: 'Column by column' }])}
      ${radios('ltr', 'Order', [{ v: 'ltr', l: 'Left to right' }, { v: 'rtl', l: 'Right to left' }])}
      <fieldset class="opt"><legend>Margins (mm)</legend>
        <div class="grid4">${num('mt', 'Top', 5, 'min="0" step="0.5"')}${num('mr', 'Right', 5, 'min="0" step="0.5"')}${num('mb', 'Bottom', 5, 'min="0" step="0.5"')}${num('ml', 'Left', 5, 'min="0" step="0.5"')}</div>
        <div class="grid4">${num('gap', 'Gap between pages', 4, 'min="0" step="0.5"')}</div>
      </fieldset>
      <fieldset class="opt"><legend>Extras</legend><div class="chks">
        ${check('autorotate', 'Auto-rotate pages to fill the sheet', true)}
        ${check('border', 'Draw border around each page', true)}
        ${check('fill', 'Scale to fill cell (crop margins)')}
        ${check('numbers', 'Print page numbers')}
      </div></fieldset>
    </div>
    <div class="nup-preview">
      <h3 class="preview-title">Live preview · sheet 1</h3>
      <div class="sheet" id="sheet"><canvas id="pv"></canvas></div>
      <p class="muted" id="nupinfo"></p>
    </div>
  </div>
  ${runbar('Create PDF')}
</div>`,
    intro: [
      'Printing one page per sheet is fine for a contract and terrible for a batch of 120 shipping labels. Pages per Sheet (also called N-up printing) tiles several PDF pages onto one physical sheet, exactly like a printer’s “pages per sheet” setting — but you get a real PDF you can preview, save, and print anywhere.',
      'Pick 2, 4, 6, 8, 9 or 16 per sheet, set outer margins and the gap between pages, choose row-by-row or column-by-column reading order, and add a thin border so cutting is easy. The live preview updates as you change any option.',
    ],
    steps: [
      { title: 'Select the PDF', text: 'Drop any PDF: labels, invoices, catalogue pages, handouts.' },
      { title: 'Set the layout', text: 'Choose pages per sheet, sheet size and orientation, margins, gap, reading order and borders. Watch the preview.' },
      { title: 'Create and download', text: 'Click Create PDF. Print the result at 100 % scale (no “fit to page”) so borders match your cuts.' },
    ],
    benefits: [
      { title: 'Cut paper cost by 75 %', text: 'Four labels per A4 sheet turns 100 sheets into 25.' },
      { title: 'Exact print preview', text: 'The preview is the real first sheet of the output — what you see is what prints.' },
      { title: 'Borders for cutting', text: 'Thin cut borders around each cell make guillotine or scissor cuts straight.' },
      { title: 'Any sheet, any page mix', text: 'A4, A3, Letter, Legal or 4 × 6 — source pages of different sizes are scaled to fit each cell.' },
    ],
    features: [
      { title: 'Best-fit grid', text: 'Every rows × columns split of 2, 4, 6, 8, 9 or 16 is tried against your sheet and margins; the one that prints your pages largest wins.' },
      { title: 'Auto-rotate to fill', text: 'Pages are turned 90° when that makes them meaningfully bigger — landscape labels on a portrait sheet, or 2-up handouts. Switch it off to keep the original orientation.' },
      { title: 'Never crops', text: 'Each page is scaled to fit its cell in full, including PDFs that have already been cropped. Only “Scale to fill cell” trims, and only when you ask for it.' },
      { title: 'Reading order control', text: 'Row-by-row or column-by-column, left-to-right or right-to-left.' },
      { title: 'Margins & gap in mm', text: 'Match your printer’s non-printable area and leave room for cutting.' },
      { title: 'Page numbers', text: 'Optionally print the original page number under each cell.' },
      { title: 'Vector output', text: 'Pages are embedded, not rasterised — text and barcodes stay sharp.' },
    ],
    faq: [
      { q: 'How do I print 4 PDF pages on one A4 page?', a: 'Drop the PDF, keep “4 pages” and “A4” selected, tick “Draw border”, and click Create PDF. Print the downloaded file at 100 % (actual size).' },
      { q: 'Why does my printer say the pages are scaled?', a: 'Turn off “Fit to page” / “Shrink oversized pages” in the print dialog and choose Actual size. The tool already places everything within your chosen margins.' },
      { q: 'Can I put 2 pages on a 4 × 6 label?', a: 'Yes. Choose the 4 × 6 in sheet size with 2 pages per sheet. It is handy for printing two small labels on one thermal label.' },
      { q: 'What happens with pages of different sizes?', a: 'Each page is scaled to fit its cell while keeping its aspect ratio, so a mix of A4 and A5 pages still lines up on the grid.' },
      { q: 'Why did my pages come out rotated?', a: 'With “Auto-rotate pages to fill the sheet” on, pages are turned 90° when that makes them bigger — for example landscape shipping labels on a portrait sheet. Untick it to keep the original orientation.' },
      { q: 'Are any pages cropped?', a: 'No. Every page is scaled to fit inside its cell in full, including pages that have already been through a cropper. The only exception is “Scale to fill cell”, which deliberately trims the overflow.' },
      { q: 'Is there a page limit?', a: 'No. A 1000-page PDF becomes 250 four-up sheets in a few seconds on a normal laptop.' },
    ],
    related: ['pdf-crop', 'meesho-label-cropper', 'merge-pdf', 'split-pdf'],
  },

  {
    slug: 'merge-pdf',
    short: "Combine PDFs in any order — drag to arrange, merge instantly.",
    category: 'pdf-tools',
    name: 'Merge PDF',
    h1: 'Merge PDF Files',
    title: 'Merge PDF Online Free – Combine PDFs in Any Order, No Upload',
    description:
      'Combine multiple PDF files into one in the order you choose. Drag to reorder, see page counts, merge instantly in your browser. Free, unlimited, no upload, no watermark.',
    tagline: 'Combine label files, invoices and manifests into one PDF in the exact order you want — instantly, privately.',
    keywords: ['merge pdf', 'combine pdf', 'merge pdf online free', 'join pdf files', 'merge shipping labels pdf', 'pdf merger'],
    icon: 'merge',
    script: 'merge',
    libs: ['pdfjs', 'pdflib'],
    panel: `
<div class="tool-ui" data-tool="merge">
  ${dropzone({ multiple: true, title: 'Drop two or more PDFs', sub: 'Drag rows to reorder · nothing is uploaded' })}
  <div class="opts" id="mopts" hidden>
    ${radios('order', 'Order', [{ v: 'manual', l: 'As listed' }, { v: 'name', l: 'By file name' }, { v: 'date', l: 'By date modified' }])}
  </div>
  ${runbar('Merge PDF')}
</div>`,
    intro: [
      'Orders arrive in batches, and so do label files. Merging them before cropping or printing means one print job instead of ten, and one file to archive for the day. Merge PDF joins any number of files in the order you set — drag them into place or sort by name or date.',
      'Merging keeps every page exactly as it was: bookmarks, form fields and vector content are copied, not re-rendered.',
    ],
    steps: [
      { title: 'Add your PDFs', text: 'Drop or select two or more files. Each shows its page count and size.' },
      { title: 'Arrange the order', text: 'Drag rows, use the arrows, or sort by file name or modified date.' },
      { title: 'Merge & download', text: 'Click Merge PDF and save the combined file.' },
    ],
    benefits: [
      { title: 'One print job', text: 'Send a single file to the printer instead of opening ten.' },
      { title: 'Prepares batch cropping', text: 'Merge first, then run the result through a label cropper or Pages per Sheet.' },
      { title: 'Order stays under your control', text: 'Drag-and-drop ordering with page counts visible.' },
      { title: 'No upload wait', text: 'Merging happens locally, so a 100 MB batch takes seconds, not minutes.' },
    ],
    features: [
      { title: 'Unlimited files', text: 'No cap on the number of PDFs or total pages.' },
      { title: 'Drag to reorder', text: 'Touch-friendly reordering with keyboard fallback.' },
      { title: 'Sort helpers', text: 'By file name or last-modified date in one click.' },
      { title: 'Lossless', text: 'Pages are copied as-is; nothing is compressed or rasterised.' },
      { title: 'Private', text: 'Files never leave your device.' },
      { title: 'Free forever', text: 'No watermark, no signup.' },
    ],
    faq: [
      { q: 'Is there a limit on file size or count?', a: 'No fixed limit. Very large merges depend on your device memory; a few hundred MB is normally fine on a laptop.' },
      { q: 'Will merging change the quality?', a: 'No. Pages are copied structurally, so text, images and barcodes are byte-for-byte identical.' },
      { q: 'Can I merge password-protected PDFs?', a: 'Only if they open without a password. Encrypted files that require a password to open must be unlocked first.' },
    ],
    related: ['split-pdf', 'pages-per-sheet', 'rotate-pdf', 'shipping-label-cropper'],
  },

  {
    slug: 'split-pdf',
    short: "Extract ranges, split every N pages or explode to single pages.",
    category: 'pdf-tools',
    name: 'Split PDF',
    h1: 'Split PDF',
    title: 'Split PDF Online Free – Extract Pages or Split Every N Pages',
    description:
      'Split a PDF by page ranges, into chunks of N pages, or into single pages. Extract only the pages you need. Runs in your browser — free, unlimited, no upload.',
    tagline: 'Pull out the pages you need, chop a big file into fixed-size chunks, or explode it into single pages — all locally.',
    keywords: ['split pdf', 'split pdf online', 'extract pdf pages', 'split pdf by pages', 'separate pdf pages', 'pdf splitter free'],
    icon: 'split',
    script: 'split',
    libs: ['pdfjs', 'pdflib', 'jszip'],
    panel: `
<div class="tool-ui" data-tool="split">
  ${dropzone({ title: 'Drop a PDF to split', sub: 'Click to browse · stays on your device' })}
  <div class="opts" id="sopts" hidden>
    ${radios('mode', 'Split mode', [{ v: 'ranges', l: 'Extract page ranges' }, { v: 'every', l: 'Every N pages' }, { v: 'single', l: 'Each page separately' }])}
    <div data-show="mode=ranges">${text('ranges', 'Pages to extract (e.g. 1-3, 5, 8-10)', '', 'placeholder="1-3, 5, 8-10"')}
      <div class="chks">${check('separate', 'Save each range as a separate file (ZIP)')}</div></div>
    <div data-show="mode=every">${num('every', 'Pages per file', 10, 'min="1"')}</div>
    <p class="muted" id="sinfo"></p>
  </div>
  ${runbar('Split PDF')}
</div>`,
    intro: [
      'A single label PDF from a marketplace can hold every order of the day; sometimes you only need the ten that go with a particular courier, or you need to hand different page ranges to different packers. Split PDF extracts exactly the pages you list, cuts the file into equal chunks, or saves every page as its own file.',
      'Page ranges use the familiar “1-3, 5, 8-10” syntax. Multiple outputs are bundled into a ZIP so you get a single download.',
    ],
    steps: [
      { title: 'Open the PDF', text: 'Drop the file. Its page count appears so you know the valid range.' },
      { title: 'Choose how to split', text: 'Extract ranges (one file or one per range), every N pages, or each page separately.' },
      { title: 'Split & download', text: 'A single PDF or a ZIP of PDFs downloads immediately.' },
    ],
    benefits: [
      { title: 'Only the pages you need', text: 'Extract a courier’s labels or a customer’s invoice without touching the rest.' },
      { title: 'Chunk large files', text: 'Split a 400-page file into 50-page parts for sharing on WhatsApp or email.' },
      { title: 'Single pages for records', text: 'One file per order when you need to attach labels or invoices to tickets.' },
      { title: 'ZIP bundling', text: 'Many outputs, one download.' },
    ],
    features: [
      { title: 'Range syntax', text: 'Commas and dashes, in any order; duplicates are removed.' },
      { title: 'Fixed-size chunks', text: 'Every N pages → part-1, part-2, … automatically named.' },
      { title: 'Explode to single pages', text: 'Each page becomes its own PDF.' },
      { title: 'Preserves quality', text: 'Pages are copied without re-encoding.' },
      { title: 'Private', text: 'No upload; everything is local.' },
      { title: 'No limits', text: 'Free, unlimited, no watermark.' },
    ],
    faq: [
      { q: 'How do I extract only specific pages from a PDF?', a: 'Choose “Extract page ranges”, type the pages (e.g. 2, 5-7, 12) and click Split PDF. You get one PDF with just those pages, in the order typed.' },
      { q: 'Can I split every page into a separate PDF?', a: 'Yes. Choose “Each page separately”. The pages are saved as individual PDFs inside a ZIP file.' },
      { q: 'What naming do the output files use?', a: 'Original name plus a suffix: -pages-1-3.pdf for ranges, -part-01.pdf for chunks, and -page-007.pdf for single pages.' },
    ],
    related: ['merge-pdf', 'rotate-pdf', 'pdf-to-images', 'pages-per-sheet'],
  },

  {
    slug: 'rotate-pdf',
    short: "Rotate, delete and reorder pages with thumbnails, saved permanently.",
    category: 'pdf-tools',
    name: 'Rotate & Delete Pages',
    h1: 'Rotate PDF & Delete Pages',
    title: 'Rotate PDF Online Free – Rotate, Delete & Reorder Pages',
    description:
      'Rotate PDF pages 90°, 180° or 270°, delete unwanted pages and reorder the rest with visual thumbnails. Saved permanently, not just in the viewer. Free and private.',
    tagline: 'Fix sideways scans, throw away blank or invoice pages, and reorder what’s left — with thumbnails, in your browser.',
    keywords: ['rotate pdf', 'rotate pdf online', 'rotate pdf pages permanently', 'delete pdf pages', 'remove pages from pdf', 'reorder pdf pages'],
    icon: 'rotate',
    script: 'rotate',
    libs: ['pdfjs', 'pdflib'],
    panel: `
<div class="tool-ui" data-tool="rotate">
  ${dropzone({ title: 'Drop a PDF to rotate or edit', sub: 'Click to browse · stays on your device' })}
  <div class="rot-tools" id="rtools" hidden>
    <button class="btn btn-sm" id="rall">Rotate all 90°</button>
    <button class="btn btn-sm" id="rallccw">Rotate all −90°</button>
    <button class="btn btn-sm" id="revert">Revert</button>
    <span class="muted" id="rinfo"></span>
  </div>
  <div class="page-grid" id="pages"></div>
  ${runbar('Save PDF')}
</div>`,
    intro: [
      'Scanned invoices come in sideways, courier manifests arrive upside down, and label files often carry blank or duplicate pages. Rotate & Delete Pages shows every page as a thumbnail so you can rotate individual pages, mark pages for deletion, and drag to reorder — then saves a new PDF with those changes baked in.',
      'The rotation is written into the page itself, so it stays rotated in every viewer and on every printer, unlike rotating in a PDF reader which only changes the on-screen view.',
    ],
    steps: [
      { title: 'Open the PDF', text: 'Thumbnails of all pages appear in a grid.' },
      { title: 'Rotate, delete, reorder', text: 'Use the buttons on each page, rotate all at once, click the bin to delete, and drag pages to reorder.' },
      { title: 'Save', text: 'Click Save PDF to download the modified file.' },
    ],
    benefits: [
      { title: 'Permanent rotation', text: 'Rotation is saved in the file, so it prints correctly everywhere.' },
      { title: 'Visual page management', text: 'See what you are deleting or moving before you commit.' },
      { title: 'Bulk actions', text: 'Rotate all pages in one click for sideways scans.' },
      { title: 'Lossless', text: 'Content is untouched; only page attributes change.' },
    ],
    features: [
      { title: 'Per-page rotate', text: '90° clockwise or counter-clockwise on any page.' },
      { title: 'Delete pages', text: 'Toggle pages off; they are excluded from the saved file.' },
      { title: 'Drag to reorder', text: 'Move pages by dragging thumbnails.' },
      { title: 'Revert', text: 'Undo all edits without reloading the file.' },
      { title: 'Private & free', text: 'No upload, no limits, no watermark.' },
      { title: 'Fast thumbnails', text: 'Hundreds of pages render progressively.' },
    ],
    faq: [
      { q: 'Why does the PDF still look rotated in my viewer after rotating there?', a: 'Most viewers only rotate the on-screen view and forget it on close. This tool writes the rotation into the file so it is permanent.' },
      { q: 'Can I delete several pages at once?', a: 'Yes. Click the bin icon on each page you want to remove (or use Rotate all for bulk rotation) and save once.' },
      { q: 'Does reordering affect bookmarks?', a: 'Bookmarks that point to moved pages may point to the new position of that page; links inside the content are preserved.' },
    ],
    related: ['split-pdf', 'merge-pdf', 'pdf-crop', 'pdf-to-images'],
  },

  {
    slug: 'images-to-pdf',
    short: "JPG, PNG, WebP → one PDF with the page size and margins you choose.",
    category: 'pdf-tools',
    name: 'Images to PDF',
    h1: 'Convert Images to PDF',
    title: 'Images to PDF Online Free – JPG, PNG, WebP to PDF (No Upload)',
    description:
      'Convert JPG, PNG and WebP photos into a single PDF. Choose page size, margins and orientation, reorder images, and download instantly. Free, private, unlimited.',
    tagline: 'Turn product photos, packing proofs or scanned bills into one tidy PDF — page size and order under your control.',
    keywords: ['jpg to pdf', 'image to pdf', 'png to pdf online', 'photos to pdf', 'convert images to pdf free', 'webp to pdf'],
    icon: 'image',
    script: 'img2pdf',
    libs: ['pdflib'],
    panel: `
<div class="tool-ui" data-tool="img2pdf">
  ${dropzone({ multiple: true, accept: 'image/*', title: 'Drop JPG, PNG or WebP images', sub: 'Drag to reorder · nothing is uploaded' })}
  <div class="opts" id="iopts" hidden>
    ${radios('page', 'Page size', [{ v: 'fit', l: 'Fit to image' }, { v: 'A4', l: 'A4' }, { v: 'Letter', l: 'Letter' }, { v: '4x6', l: '4 × 6 in' }])}
    ${radios('orient', 'Orientation', [{ v: 'auto', l: 'Auto' }, { v: 'portrait', l: 'Portrait' }, { v: 'landscape', l: 'Landscape' }], 0, 'data-show="page!=fit"')}
    <div class="grid4">${num('margin', 'Margin (mm)', 10, 'min="0"')}${num('quality', 'JPEG quality (%)', 90, 'min="30" max="100"')}</div>
  </div>
  ${runbar('Create PDF')}
</div>`,
    intro: [
      'Marketplace claims teams, courier disputes and GST audits all ask for the same thing: “send the photos as a PDF”. Images to PDF converts any number of JPG, PNG or WebP images into one document, each image on its own page, sized to A4, Letter, 4 × 6 or to the image itself.',
      'Images are re-encoded as JPEG at the quality you choose so the PDF stays a sensible size for WhatsApp and email.',
    ],
    steps: [
      { title: 'Add images', text: 'Drop photos in any order; drag rows to rearrange.' },
      { title: 'Choose page settings', text: 'Fit each page to its image, or use A4 / Letter / 4 × 6 with margins and orientation.' },
      { title: 'Create PDF', text: 'One PDF, one page per image, downloads instantly.' },
    ],
    benefits: [
      { title: 'One file instead of twenty photos', text: 'Share evidence or catalogues as a single attachment.' },
      { title: 'Controlled size', text: 'JPEG quality slider keeps the PDF small enough for messaging apps.' },
      { title: 'Right page size', text: 'A4 for printing, 4 × 6 for label printers, or exact image dimensions.' },
      { title: 'Private', text: 'Photos never leave your device.' },
    ],
    features: [
      { title: 'JPG, PNG, WebP, HEIC*', text: 'Any format the browser can open (*HEIC on Safari).' },
      { title: 'Reorder by drag', text: 'Touch-friendly ordering.' },
      { title: 'Auto orientation', text: 'Landscape photos get landscape pages when Auto is selected.' },
      { title: 'Margins in mm', text: 'Keep a border for printing or set 0 for edge-to-edge.' },
      { title: 'Quality control', text: '30–100 % JPEG quality.' },
      { title: 'Free & unlimited', text: 'No watermark, no signup.' },
    ],
    faq: [
      { q: 'Will PNG transparency be kept?', a: 'Transparent areas are flattened onto white, which is what printers and most viewers expect.' },
      { q: 'How big will the PDF be?', a: 'Roughly the sum of the re-encoded JPEGs. At 85 % quality a 12-megapixel photo is typically 1–2 MB.' },
      { q: 'Can I make each page exactly the image size?', a: 'Yes — choose “Fit to image”. The page takes the image’s pixel dimensions at screen resolution (96 dpi) with your margin added.' },
    ],
    related: ['pdf-to-images', 'merge-pdf', 'product-image-resizer', 'image-compressor'],
  },

  {
    slug: 'pdf-to-images',
    short: "Export pages as JPG or PNG at up to 300 DPI, zipped.",
    category: 'pdf-tools',
    name: 'PDF to Images',
    h1: 'Convert PDF to JPG / PNG',
    title: 'PDF to JPG / PNG Online Free – Convert Pages to Images',
    description:
      'Convert every PDF page to a high-resolution JPG or PNG at 72–300 DPI. Download a single image or a ZIP. Runs in your browser — free, unlimited, private.',
    tagline: 'Export PDF pages as sharp JPG or PNG images — for WhatsApp, listings, or sharing a label with a courier.',
    keywords: ['pdf to jpg', 'pdf to png', 'pdf to image online', 'convert pdf to jpg free', 'pdf page to image', 'label pdf to image'],
    icon: 'image',
    script: 'pdf2img',
    libs: ['pdfjs', 'jszip'],
    panel: `
<div class="tool-ui" data-tool="pdf2img">
  ${dropzone({ title: 'Drop a PDF to convert', sub: 'Click to browse · stays on your device' })}
  <div class="opts" id="popts" hidden>
    ${radios('fmt', 'Format', [{ v: 'jpeg', l: 'JPG' }, { v: 'png', l: 'PNG' }])}
    ${radios('dpi', 'Resolution', [{ v: 96, l: '96 DPI (screen)' }, { v: 150, l: '150 DPI', }, { v: 300, l: '300 DPI (print)' }], 1)}
    ${text('pages', 'Pages (blank = all)', '', 'placeholder="e.g. 1-3, 7"')}
    <p class="muted" id="pinfo"></p>
  </div>
  ${runbar('Convert')}
</div>`,
    intro: [
      'Couriers ask for a label “as a photo”, marketplace chat tools accept images but not PDFs, and a size chart PDF needs to become a listing image. PDF to Images renders each page with the same engine browsers use to display PDFs, at 96, 150 or 300 DPI, into JPG or PNG.',
      'Convert all pages or a range; multiple images are zipped into a single download.',
    ],
    steps: [
      { title: 'Open the PDF', text: 'Drop the file; the page count is shown.' },
      { title: 'Pick format and resolution', text: 'JPG for photos and sharing, PNG for text and barcodes. 300 DPI for print-quality output.' },
      { title: 'Convert', text: 'Single page → one image; multiple pages → ZIP.' },
    ],
    benefits: [
      { title: 'Share anywhere', text: 'Images work in every chat app and listing form.' },
      { title: 'Print-grade resolution', text: '300 DPI keeps barcodes scannable.' },
      { title: 'Selective pages', text: 'Convert only what you need.' },
      { title: 'Private', text: 'Rendering happens on your device.' },
    ],
    features: [
      { title: 'JPG or PNG', text: 'Lossy for small files, lossless for crisp text.' },
      { title: '96 / 150 / 300 DPI', text: 'Choose size versus quality.' },
      { title: 'Page ranges', text: '“1-3, 7” syntax.' },
      { title: 'ZIP download', text: 'One archive for many pages.' },
      { title: 'Progress feedback', text: 'See pages render one by one.' },
      { title: 'Free & unlimited', text: 'No watermark.' },
    ],
    faq: [
      { q: 'Which DPI should I use for a shipping label?', a: 'Use 300 DPI and PNG so the barcode edges stay sharp. At 96 DPI barcodes may fail to scan.' },
      { q: 'Why is the ZIP large?', a: '300 DPI PNGs of full A4 pages are ~2500 × 3500 pixels. Use JPG or 150 DPI for smaller files.' },
      { q: 'Can I convert only one page?', a: 'Yes — type the page number in the Pages field. A single page downloads as a plain image, not a ZIP.' },
    ],
    related: ['images-to-pdf', 'split-pdf', 'image-compressor', 'pdf-crop'],
  },

  // ═══════════════════════ CALCULATORS ═══════════════════════
  {
    slug: 'profit-calculator',
    short: "Net profit after commission, fees, GST and returns — with presets.",
    category: 'calculators',
    name: 'Seller Profit Calculator',
    h1: 'Meesho, Flipkart & Amazon Profit Calculator',
    title: 'Meesho, Flipkart & Amazon Profit Calculator – Net After Fees',
    description:
      'Calculate your real profit per order after marketplace commission, fixed fees, shipping, GST on fees and returns. Presets for Meesho, Flipkart and Amazon India with editable fees.',
    tagline: 'See what actually reaches your bank after commission, shipping, GST on fees and returns — with editable presets for Meesho, Flipkart and Amazon.',
    keywords: ['meesho profit calculator', 'flipkart profit calculator', 'amazon seller calculator india', 'ecommerce profit margin calculator', 'meesho settlement calculator', 'marketplace fee calculator'],
    icon: 'calculator',
    badge: 'Popular',
    script: 'profit',
    libs: [],
    panel: `
<div class="tool-ui calc" data-tool="profit">
  <div class="calc-grid">
    <div class="calc-in">
      ${radios('mp', 'Marketplace preset', [{ v: 'meesho', l: 'Meesho' }, { v: 'flipkart', l: 'Flipkart' }, { v: 'amazon', l: 'Amazon' }, { v: 'custom', l: 'Custom' }])}
      <div class="grid2">
        ${num('price', 'Selling price (₹, incl. GST)', 499, 'min="0" step="1"')}
        ${num('cost', 'Product cost incl. packaging (₹)', 220, 'min="0" step="1"')}
        ${num('gst', 'GST on product (%)', 5, 'min="0" step="0.1"')}
        ${num('comm', 'Commission / referral (%)', 0, 'min="0" step="0.1"')}
        ${num('fixed', 'Fixed / closing fee (₹)', 0, 'min="0" step="1"')}
        ${num('collect', 'Payment / collection fee (%)', 0, 'min="0" step="0.1"')}
        ${num('ship', 'Shipping fee charged to you (₹)', 0, 'min="0" step="1"')}
        ${num('feegst', 'GST on marketplace fees (%)', 18, 'min="0" step="1"')}
        ${num('ret', 'Return / RTO rate (%)', 10, 'min="0" max="100" step="1"')}
        ${num('retcost', 'Cost per return (₹)', 0, 'min="0" step="1"')}
        ${num('ads', 'Ads / other cost per order (₹)', 0, 'min="0" step="1"')}
      </div>
      <p class="muted" id="mpnote"></p>
    </div>
    <div class="calc-out" id="out"></div>
  </div>
</div>`,
    intro: [
      'A ₹499 order is not ₹499 of revenue. Commission, a fixed fee, a collection fee, the shipping charge, 18 % GST on all of those, and the GST you owe on the sale itself come off before settlement — and every tenth order might come back as an RTO that costs you twice. Sellers who price without this arithmetic discover the problem in their bank balance.',
      'This calculator lays the chain out line by line: net receivable from the marketplace, GST payable, profit per delivered order, margin and ROI, then a realistic “expected profit” that accounts for your return rate. Presets fill in indicative fee structures for Meesho (zero commission), Flipkart and Amazon India; every field stays editable so you can match the exact rate card of your category.',
    ],
    steps: [
      { title: 'Pick a marketplace preset', text: 'Meesho, Flipkart, Amazon or Custom. Presets are indicative — adjust them to your category’s rate card.' },
      { title: 'Enter price and costs', text: 'Selling price, product cost including packaging, GST rate, and your typical return rate.' },
      { title: 'Read the breakdown', text: 'Results update live: fees, GST, net settlement, profit per order, margin, ROI, break-even price and expected profit after returns.' },
    ],
    benefits: [
      { title: 'Price with the real numbers', text: 'Know the minimum selling price that still leaves a margin.' },
      { title: 'Returns included', text: 'RTO rate and cost per return show the profit you actually keep across a hundred orders.' },
      { title: 'Compare marketplaces', text: 'Switch presets to see where the same product earns more.' },
      { title: 'Break-even at a glance', text: 'The price at which profit is zero — your floor for discounts and campaigns.' },
    ],
    features: [
      { title: 'Meesho / Flipkart / Amazon presets', text: 'Indicative fee structures you can edit line by line.' },
      { title: 'GST-aware', text: 'Separates GST on the sale from GST on marketplace fees.' },
      { title: 'Return modelling', text: 'Return rate and per-return cost feed an expected-profit figure.' },
      { title: 'Break-even & target price', text: 'Solve for the price that gives your desired margin.' },
      { title: 'Shareable', text: 'Inputs are kept in the URL so you can bookmark or share a scenario.' },
      { title: 'Instant', text: 'No signup, no waiting, works offline.' },
    ],
    faq: [
      { q: 'Are the preset fees exact?', a: 'No. Marketplace fees change by category, price band, weight and region, and marketplaces revise them regularly. Presets are starting points; copy the numbers from your seller panel’s fee card for exact results.' },
      { q: 'How is GST handled?', a: 'The selling price is treated as GST-inclusive. GST on the sale is separated out as a liability (you may offset input credit). Marketplace fees attract 18 % GST, which is added to the deductions.' },
      { q: 'What does “expected profit after returns” mean?', a: 'It weights profit on delivered orders against the loss on returned orders using your return rate: expected = (1 − r) × profit − r × return cost, where r is the return rate.' },
      { q: 'Does Meesho really charge zero commission?', a: 'Meesho has advertised 0 % commission for suppliers since 2021, but you still bear return shipping in many cases and GST on any fees. The Meesho preset reflects this; adjust the cost per return to match your experience.' },
    ],
    related: ['gst-calculator', 'volumetric-weight-calculator', 'gst-invoice-generator', 'picklist-generator'],
  },

  {
    slug: 'gst-calculator',
    short: "Add or remove GST, with the CGST/SGST or IGST split.",
    category: 'calculators',
    name: 'GST Calculator',
    h1: 'GST Calculator (Inclusive & Exclusive)',
    title: 'GST Calculator India – Inclusive, Exclusive, CGST/SGST/IGST',
    description:
      'Add or remove GST at 0, 3, 5, 12, 18 or 28 %. Get the base amount, tax and total with CGST/SGST or IGST split for intra- or inter-state sales. Free, instant.',
    tagline: 'Add GST to a base price or pull it out of an inclusive price, with the CGST/SGST or IGST split ready for your invoice.',
    keywords: ['gst calculator', 'gst calculator india', 'reverse gst calculator', 'gst inclusive calculator', 'cgst sgst calculator', 'igst calculator'],
    icon: 'percent',
    script: 'gst',
    libs: [],
    panel: `
<div class="tool-ui calc" data-tool="gst">
  <div class="calc-grid">
    <div class="calc-in">
      ${radios('mode', 'Amount is', [{ v: 'excl', l: 'Excluding GST (add)' }, { v: 'incl', l: 'Including GST (remove)' }])}
      ${num('amount', 'Amount (₹)', 1000, 'min="0" step="0.01"')}
      <fieldset class="opt"><legend>GST rate</legend><div class="seg" id="rates">
        ${[0, 3, 5, 12, 18, 28].map((r) => `<label><input type="radio" name="rate" value="${r}" ${r === 18 ? 'checked' : ''}><span>${r}%</span></label>`).join('')}
        <label><input type="radio" name="rate" value="custom"><span>Custom</span></label>
      </div></fieldset>
      <div data-show="rate=custom">${num('crate', 'Custom rate (%)', 7.5, 'min="0" step="0.01"')}</div>
      ${radios('supply', 'Type of supply', [{ v: 'intra', l: 'Intra-state (CGST + SGST)' }, { v: 'inter', l: 'Inter-state (IGST)' }])}
    </div>
    <div class="calc-out" id="out"></div>
  </div>
</div>`,
    intro: [
      'Marketplace prices are GST-inclusive, purchase bills are usually exclusive, and invoices need the tax shown as CGST + SGST for sales within your state or IGST for sales outside it. The GST Calculator does both directions — add tax to a base amount or extract it from an inclusive price — and shows the split you need to write on the bill.',
      'Rates cover the standard slabs (0, 3, 5, 12, 18, 28 %) plus a custom field for cess or special rates.',
    ],
    steps: [
      { title: 'Choose direction', text: '“Excluding GST” adds tax to your amount; “Including GST” removes it to reveal the base price.' },
      { title: 'Enter amount and rate', text: 'Type the amount, pick the slab, and choose intra- or inter-state.' },
      { title: 'Read the split', text: 'Base amount, total GST, CGST/SGST or IGST, and the final amount update instantly.' },
    ],
    benefits: [
      { title: 'Reverse GST in one step', text: 'Find the base price hidden inside a marketplace selling price.' },
      { title: 'Invoice-ready split', text: 'CGST/SGST halves or IGST — copy straight to the bill.' },
      { title: 'All slabs', text: '0, 3, 5, 12, 18, 28 % and custom rates.' },
      { title: 'Instant and offline', text: 'Works without internet once loaded.' },
    ],
    features: [
      { title: 'Inclusive & exclusive', text: 'Both directions of the calculation.' },
      { title: 'Intra / inter-state', text: 'Correct CGST/SGST or IGST presentation.' },
      { title: 'Custom rate', text: 'Any percentage, including decimals.' },
      { title: 'Rounded to paise', text: 'Two-decimal rounding as used on invoices.' },
      { title: 'Copy results', text: 'One click copies the breakdown.' },
      { title: 'Free', text: 'No signup or limits.' },
    ],
    faq: [
      { q: 'How do I calculate the base price from a GST-inclusive price?', a: 'Base = Inclusive price ÷ (1 + rate/100). For ₹1,180 at 18 %: 1180 ÷ 1.18 = ₹1,000, so GST is ₹180. Choose “Including GST” and the tool does this for you.' },
      { q: 'When is IGST charged instead of CGST + SGST?', a: 'IGST applies when the place of supply is in a different state from the seller (inter-state). Within the same state, GST is split equally into CGST and SGST.' },
      { q: 'Which GST rate applies to my product?', a: 'It depends on the HSN code. Common e-commerce categories: apparel under ₹1,000 at 5 %, above ₹1,000 at 12 %; most electronics accessories at 18 %. Check the HSN on the CBIC GST rate finder.' },
    ],
    related: ['profit-calculator', 'gst-invoice-generator', 'volumetric-weight-calculator', 'barcode-generator'],
  },

  {
    slug: 'volumetric-weight-calculator',
    short: "L × W × H ÷ divisor vs actual weight → chargeable slab.",
    category: 'calculators',
    name: 'Volumetric Weight Calculator',
    h1: 'Volumetric Weight Calculator',
    title: 'Volumetric Weight Calculator – Courier Chargeable Weight',
    description:
      'Calculate volumetric (dimensional) weight from length, width and height with the 5000, 4000 or 6000 divisor used by Indian couriers, compare with actual weight and see the chargeable weight.',
    tagline: 'Find out whether the courier will bill by size or by scale — and how much shrinking the box would save.',
    keywords: ['volumetric weight calculator', 'dimensional weight calculator', 'chargeable weight calculator', 'courier weight calculator india', 'volumetric weight formula', 'delhivery volumetric weight'],
    icon: 'box',
    script: 'volumetric',
    libs: [],
    panel: `
<div class="tool-ui calc" data-tool="volumetric">
  <div class="calc-grid">
    <div class="calc-in">
      ${radios('unit', 'Dimension unit', [{ v: 'cm', l: 'Centimetres' }, { v: 'in', l: 'Inches' }])}
      <div class="grid3">${num('l', 'Length', 30, 'min="0" step="0.1"')}${num('w', 'Width', 20, 'min="0" step="0.1"')}${num('h', 'Height', 10, 'min="0" step="0.1"')}</div>
      <div class="grid2">${num('actual', 'Actual weight (g)', 450, 'min="0" step="1"')}${select('div', 'Divisor', [{ v: 5000, l: '5000 (most couriers / Meesho / Flipkart)', s: true }, { v: 4000, l: '4000' }, { v: 4500, l: '4500' }, { v: 6000, l: '6000' }, { v: 3000, l: '3000' }])}</div>
      ${radios('round', 'Round chargeable weight to', [{ v: 500, l: 'Nearest 500 g slab' }, { v: 0, l: 'Exact' }, { v: 1000, l: 'Nearest 1 kg' }])}
    </div>
    <div class="calc-out" id="out"></div>
  </div>
</div>`,
    intro: [
      'Couriers charge for whichever is greater: the parcel’s real weight or its volumetric weight — the space it takes on the truck, calculated as length × width × height divided by a factor (usually 5000 for cm and kg). A light but bulky item like a cushion or a plastic organiser is almost always billed by volume.',
      'Enter your box dimensions and actual weight to see both numbers, the chargeable weight the courier will use (rounded to the 500 g slab most rate cards use), and a comparison across common divisors.',
    ],
    steps: [
      { title: 'Measure the packed box', text: 'Length, width and height of the outer packaging in cm or inches.' },
      { title: 'Enter actual weight and divisor', text: 'Weigh the packed parcel. Keep the 5000 divisor unless your courier contract specifies otherwise.' },
      { title: 'Read the chargeable weight', text: 'The higher of actual and volumetric weight, rounded to the billing slab, plus a table of alternatives.' },
    ],
    benefits: [
      { title: 'No surprise weight disputes', text: 'Know what the courier will bill before you ship.' },
      { title: 'Right-size packaging', text: 'See how much a smaller box lowers the chargeable slab.' },
      { title: 'Price shipping correctly', text: 'Feed the chargeable weight into your profit calculation.' },
      { title: 'Works for any courier', text: 'Adjustable divisor covers Delhivery, Xpressbees, Ekart, Blue Dart, DTDC and aggregator contracts.' },
    ],
    features: [
      { title: 'cm or inches', text: 'Automatic unit conversion.' },
      { title: 'Divisor options', text: '3000–6000 to match your rate card.' },
      { title: 'Slab rounding', text: '500 g or 1 kg slabs, or exact.' },
      { title: 'Comparison table', text: 'All divisors side by side.' },
      { title: 'Instant', text: 'Updates as you type.' },
      { title: 'Free', text: 'No signup.' },
    ],
    faq: [
      { q: 'What is the volumetric weight formula?', a: 'Volumetric weight (kg) = Length × Width × Height (cm) ÷ 5000. Some couriers use 4000 or 6000; air cargo often uses 6000.' },
      { q: 'Which divisor do Meesho and Flipkart use?', a: 'Both platforms’ logistics partners generally apply the 5000 divisor with 500 g slabs. Always confirm on your current rate card.' },
      { q: 'How do I reduce volumetric weight?', a: 'Use the smallest box that fits, avoid excess void fill, and switch to poly bags or courier bags for soft goods — they follow the product shape and reduce volume drastically.' },
    ],
    related: ['profit-calculator', 'gst-calculator', 'shipping-label-cropper', 'pages-per-sheet'],
  },

  // ═══════════════════════ GENERATORS ═══════════════════════
  {
    slug: 'barcode-generator',
    short: "Bulk Code 128 / EAN-13 barcodes to PNG, SVG or A4 label sheets.",
    category: 'generators',
    name: 'Barcode Generator',
    h1: 'Bulk Barcode Generator & Label Sheet',
    title: 'Bulk Barcode Generator – Code 128 & EAN-13 to PDF Label Sheet',
    description:
      'Generate Code 128, EAN-13, EAN-8, UPC-A and Code 39 barcodes one at a time or in bulk from a list. Download PNG/SVG or print a PDF label sheet (65/40/24 per A4). Free.',
    tagline: 'Paste a list of SKUs, get a printable barcode sheet. Single barcodes export as PNG or SVG.',
    keywords: ['barcode generator', 'bulk barcode generator', 'sku barcode generator', 'code 128 barcode generator', 'ean 13 barcode generator', 'barcode label sheet a4'],
    icon: 'barcode',
    script: 'barcode',
    libs: ['jsbarcode', 'pdflib', 'jszip'],
    panel: `
<div class="tool-ui" data-tool="barcode">
  <div class="gen-grid">
    <div class="gen-in">
      ${radios('mode', 'Mode', [{ v: 'single', l: 'Single' }, { v: 'bulk', l: 'Bulk (one per line)' }])}
      <div data-show="mode=single">${text('value', 'Value', 'SKU-12345', 'autocomplete="off"')}</div>
      <div data-show="mode=bulk"><label class="field"><span>Values (one per line, optional “value | caption”)</span><textarea id="values" rows="6" placeholder="SKU-001 | Blue Kurta M&#10;SKU-002 | Blue Kurta L"></textarea></label></div>
      <div class="grid2">
        ${select('type', 'Symbology', [{ v: 'CODE128', l: 'Code 128 (any text)', s: true }, { v: 'EAN13', l: 'EAN-13 (12–13 digits)' }, { v: 'EAN8', l: 'EAN-8 (7–8 digits)' }, { v: 'UPC', l: 'UPC-A (11–12 digits)' }, { v: 'CODE39', l: 'Code 39' }, { v: 'ITF14', l: 'ITF-14' }])}
        ${select('sheet', 'Print sheet layout', [{ v: '65', l: '65 per A4 (38.1 × 21.2 mm)', s: true }, { v: '40', l: '40 per A4 (52.5 × 29.7 mm)' }, { v: '24', l: '24 per A4 (70 × 37 mm)' }, { v: '12', l: '12 per A4 (105 × 48 mm)' }, { v: '4x6', l: '4 × 6 in thermal · 1 per label' }])}
      </div>
      <div class="grid3">${num('bw', 'Bar width (px)', 2, 'min="1" max="4"')}${num('bh', 'Height (px)', 60, 'min="20" max="200"')}${num('fs', 'Font size', 14, 'min="8" max="30"')}</div>
      <div class="chks">${check('showval', 'Show value under barcode', true)}${check('copies', 'Print caption above barcode', true)}</div>
      ${num('ncopies', 'Copies of each (sheet)', 1, 'min="1" max="500"')}
    </div>
    <div class="gen-out">
      <div class="bc-preview" id="bcpreview"></div>
      <div class="btns">
        <button class="btn" id="png"><svg class="ic" aria-hidden="true"><use href="#i-download"/></svg> PNG</button>
        <button class="btn" id="svg"><svg class="ic" aria-hidden="true"><use href="#i-download"/></svg> SVG</button>
        <button class="btn btn-primary" id="sheetbtn"><svg class="ic" aria-hidden="true"><use href="#i-printer"/></svg> PDF label sheet</button>
      </div>
      <p class="status" id="status" role="status" aria-live="polite"></p>
    </div>
  </div>
</div>`,
    intro: [
      'Once you pass a few dozen SKUs, picking by reading product names stops working. A barcode on every bin or poly bag lets a ₹1,500 scanner (or a phone app) confirm the right item in half a second. This generator makes Code 128 barcodes — which encode any SKU text — and retail EAN/UPC codes for products that need them.',
      'Paste your whole SKU list and print a label sheet in the standard A4 layouts (65, 40, 24 or 12 stickers) or one barcode per 4 × 6 thermal label. Each barcode can carry a caption such as the product name and size.',
    ],
    steps: [
      { title: 'Enter values', text: 'A single SKU, or a bulk list with one per line. Add “| caption” after a value to print a readable name above the bars.' },
      { title: 'Choose symbology and sheet', text: 'Code 128 for SKUs, EAN-13 for retail. Pick the label sheet your printer uses.' },
      { title: 'Download', text: 'PNG or SVG for a single code; PDF label sheet for bulk printing on sticker paper.' },
    ],
    benefits: [
      { title: 'Zero picking errors', text: 'Scan-to-confirm beats reading tiny text on a label.' },
      { title: 'Bulk in one go', text: 'Hundreds of SKUs to a print-ready sheet in seconds.' },
      { title: 'Fits standard sticker sheets', text: 'Layouts match the common A4 label sheets sold in India.' },
      { title: 'Vector export', text: 'SVG for packaging artwork, PNG for listings.' },
    ],
    features: [
      { title: 'Code 128 / EAN-13 / EAN-8 / UPC-A / Code 39 / ITF-14', text: 'Retail and internal symbologies.' },
      { title: 'Captions', text: 'Product name above, value below.' },
      { title: 'Copies per value', text: 'Print several stickers of each SKU.' },
      { title: 'Checksum validation', text: 'Invalid EAN/UPC digits are flagged before printing.' },
      { title: 'Thermal mode', text: 'One barcode per 4 × 6 label.' },
      { title: 'Free & offline', text: 'Nothing is uploaded.' },
    ],
    faq: [
      { q: 'Which barcode type should I use for internal SKUs?', a: 'Code 128. It encodes letters, digits and symbols compactly and every scanner reads it.' },
      { q: 'Can I generate a legitimate EAN-13 for retail?', a: 'The tool generates the barcode image for any valid 12- or 13-digit number, but retail EAN numbers must be licensed from GS1 India to be unique worldwide.' },
      { q: 'Will these barcodes scan from a phone?', a: 'Yes. Print at 100 % scale with at least 2 px bar width and 40 px height; most phone scanner apps read Code 128 reliably.' },
    ],
    related: ['qr-code-generator', 'picklist-generator', 'thank-you-card-maker', 'pages-per-sheet'],
  },

  {
    slug: 'qr-code-generator',
    short: "UPI payment, WhatsApp chat, Instagram or link QR codes.",
    category: 'generators',
    name: 'QR Code Generator',
    h1: 'QR Code Generator (UPI, WhatsApp, URL)',
    title: 'QR Code Generator – UPI Payment, WhatsApp & Link QR Codes',
    description:
      'Create QR codes for UPI payments with amount, WhatsApp chat links with a pre-filled message, Instagram, websites or any text. Custom colours, PNG/SVG download. Free, private.',
    tagline: 'UPI payment QR with fixed amount, WhatsApp “chat with us” QR, review-link QR — generated on your device, exported as PNG or SVG.',
    keywords: ['qr code generator', 'upi qr code generator', 'whatsapp qr code generator', 'qr code for thank you card', 'instagram qr code', 'free qr code generator no signup'],
    icon: 'qr',
    script: 'qr',
    libs: ['qrcode'],
    panel: `
<div class="tool-ui" data-tool="qr">
  <div class="gen-grid">
    <div class="gen-in">
      ${radios('kind', 'QR type', [{ v: 'url', l: 'Link / text' }, { v: 'wa', l: 'WhatsApp' }, { v: 'upi', l: 'UPI payment' }, { v: 'ig', l: 'Instagram' }])}
      <div data-show="kind=url">${text('url', 'URL or text', 'https://', 'autocomplete="off"')}</div>
      <div data-show="kind=wa">${text('wanum', 'WhatsApp number (with country code)', '91', 'inputmode="numeric"')}${text('wamsg', 'Pre-filled message (optional)', 'Hi! I just received my order.')}</div>
      <div data-show="kind=upi"><div class="grid2">${text('pa', 'UPI ID (VPA)', '', 'placeholder="yourname@upi"')}${text('pn', 'Payee name', '')}${num('am', 'Amount (₹, optional)', '', 'min="0" step="0.01"')}${text('tn', 'Note (optional)', '')}</div></div>
      <div data-show="kind=ig">${text('ig', 'Instagram username', '', 'placeholder="yourbrand"')}</div>
      <div class="grid3">
        ${num('size', 'Size (px)', 512, 'min="128" max="2048" step="64"')}
        ${select('ecl', 'Error correction', [{ v: 'L', l: 'L (7%)' }, { v: 'M', l: 'M (15%)', s: true }, { v: 'Q', l: 'Q (25%)' }, { v: 'H', l: 'H (30%)' }])}
        ${num('margin', 'Quiet zone (modules)', 2, 'min="0" max="10"')}
      </div>
      <div class="grid2"><label class="field"><span>Foreground</span><input type="color" id="fg" value="#12110F"></label><label class="field"><span>Background</span><input type="color" id="bg" value="#FFFFFF"></label></div>
      ${text('label', 'Caption under QR (optional)', '')}
    </div>
    <div class="gen-out">
      <div class="qr-preview" id="qrpreview"></div>
      <p class="muted mono" id="qrdata"></p>
      <div class="btns">
        <button class="btn btn-primary" id="png"><svg class="ic" aria-hidden="true"><use href="#i-download"/></svg> PNG</button>
        <button class="btn" id="svg"><svg class="ic" aria-hidden="true"><use href="#i-download"/></svg> SVG</button>
      </div>
      <p class="status" id="status" role="status" aria-live="polite"></p>
    </div>
  </div>
</div>`,
    intro: [
      'A QR code on the thank-you card is the cheapest repeat-order channel a seller has. Scan → WhatsApp chat opens with “Hi, I received my order” already typed; scan → UPI app opens with your VPA and the amount filled in; scan → your Instagram or review page. This generator builds each of those payloads correctly so the code works in every scanner app.',
      'Codes are generated on your device as crisp vector SVG or PNG at any size, with custom colours and an optional caption.',
    ],
    steps: [
      { title: 'Pick the QR type', text: 'Link/text, WhatsApp, UPI payment or Instagram. Fill in the fields — the payload is built for you.' },
      { title: 'Style it', text: 'Size, error-correction level, colours and quiet zone. Keep strong contrast for reliable scans.' },
      { title: 'Download', text: 'PNG for cards and stickers, SVG for print artwork.' },
    ],
    benefits: [
      { title: 'Repeat orders via WhatsApp', text: 'Customers reach you in one scan, with context pre-filled.' },
      { title: 'UPI with fixed amount', text: 'Collect COD balances or reorders without typing errors.' },
      { title: 'Print-safe output', text: 'Vector SVG scales to any label or packaging size.' },
      { title: 'No tracking, no expiry', text: 'Static codes that never stop working and never phone home.' },
    ],
    features: [
      { title: 'WhatsApp deep link', text: 'wa.me format with URL-encoded message.' },
      { title: 'UPI intent', text: 'upi://pay with pa, pn, am, tn and INR currency.' },
      { title: 'Error correction L–H', text: 'Use H when printing small or over a logo.' },
      { title: 'Custom colours', text: 'Brand colours with a contrast warning.' },
      { title: 'Caption', text: 'Text under the code such as “Scan to chat”.' },
      { title: 'Free & private', text: 'Generated locally.' },
    ],
    faq: [
      { q: 'Does the UPI QR work with all apps?', a: 'Yes — the payload follows the NPCI upi://pay format that PhonePe, Google Pay, Paytm, BHIM and bank apps all read. Amount is optional; when set, the customer cannot edit it in most apps.' },
      { q: 'Why is my QR not scanning after adding colours?', a: 'Scanners need dark modules on a light background with strong contrast. Avoid light foregrounds, and keep at least a 2-module quiet zone.' },
      { q: 'Do these QR codes expire or need an account?', a: 'No. They are static codes containing the data itself, so they work forever and need no dashboard or subscription.' },
    ],
    related: ['thank-you-card-maker', 'barcode-generator', 'gst-invoice-generator', 'product-image-resizer'],
  },

  {
    slug: 'thank-you-card-maker',
    short: "Branded insert cards with a WhatsApp QR, 10 per A4 sheet.",
    category: 'generators',
    name: 'Thank You Card Maker',
    h1: 'Thank You Card Maker for Order Inserts',
    title: 'Thank You Card Maker – Printable Order Inserts with QR',
    description:
      'Design thank-you cards for your parcels: brand name, message, WhatsApp / Instagram QR, four templates and custom colours. Download PNG or a print-ready A4 PDF with 10 cards per sheet. Free.',
    tagline: 'A branded thank-you card in every parcel, with a scan-to-WhatsApp QR — designed in a minute, printed 10 per A4 sheet.',
    keywords: ['thank you card maker', 'thank you card for online orders', 'meesho thank you card', 'order insert card', 'packaging insert design', 'thank you card printable free'],
    icon: 'heart',
    script: 'thankyou',
    libs: ['qrcode', 'pdflib'],
    panel: `
<div class="tool-ui" data-tool="thankyou">
  <div class="gen-grid">
    <div class="gen-in">
      ${radios('tpl', 'Template', [{ v: 'minimal', l: 'Minimal' }, { v: 'bold', l: 'Bold' }, { v: 'elegant', l: 'Elegant' }, { v: 'playful', l: 'Playful' }])}
      <div class="grid2">
        ${text('brand', 'Brand / shop name', 'Your Brand')}
        ${text('headline', 'Headline', 'Thank you for your order!')}
      </div>
      <label class="field"><span>Message</span><textarea id="msg" rows="3">We hope you love it. If anything is not right, message us on WhatsApp before raising a return — we’ll fix it fast.</textarea></label>
      <div class="grid2">
        ${text('wa', 'WhatsApp number (for QR)', '', 'placeholder="91XXXXXXXXXX" inputmode="numeric"')}
        ${text('ig', 'Instagram handle', '', 'placeholder="yourbrand"')}
        ${text('web', 'Website (optional)', '')}
        ${text('cta', 'QR caption', 'Scan to chat on WhatsApp')}
      </div>
      <div class="grid3">
        <label class="field"><span>Accent colour</span><input type="color" id="accent" value="#FFD23F"></label>
        ${select('size', 'Card size', [{ v: 'bc', l: '3.5 × 2 in · 10 per A4', s: true }, { v: 'a7', l: 'A7 74 × 105 mm · 8 per A4' }, { v: 'a6', l: 'A6 105 × 148 mm · 4 per A4' }])}
        ${select('qrkind', 'QR links to', [{ v: 'wa', l: 'WhatsApp chat', s: true }, { v: 'ig', l: 'Instagram' }, { v: 'web', l: 'Website' }, { v: 'none', l: 'No QR' }])}
      </div>
      <div class="chks">${check('cut', 'Print cut marks on the sheet', true)}</div>
    </div>
    <div class="gen-out">
      <div class="card-preview" id="cardpreview"><canvas id="card"></canvas></div>
      <div class="btns">
        <button class="btn" id="png"><svg class="ic" aria-hidden="true"><use href="#i-download"/></svg> PNG</button>
        <button class="btn btn-primary" id="pdf"><svg class="ic" aria-hidden="true"><use href="#i-printer"/></svg> A4 PDF sheet</button>
      </div>
      <p class="status" id="status" role="status" aria-live="polite"></p>
    </div>
  </div>
</div>`,
    intro: [
      'A thank-you card costs less than a rupee to print and does three jobs: it makes the parcel feel like a brand rather than a marketplace order, it gives the customer a way to reach you before they raise a return, and it plants your Instagram or WhatsApp for the next order. The Thank You Card Maker designs that card in your colours with a working QR code.',
      'Four templates, your brand name, message and handles, and an output that is ready to print: a single PNG, or an A4 PDF with 10 business-card-size cards (or 8 A7 / 4 A6) with cut marks.',
    ],
    steps: [
      { title: 'Fill in your details', text: 'Brand name, headline, message, WhatsApp number and Instagram handle. Pick a template and accent colour.' },
      { title: 'Check the live preview', text: 'The card redraws as you type. Choose what the QR should open.' },
      { title: 'Download', text: 'PNG for a print shop, or the A4 PDF sheet for your own printer — cut along the marks.' },
    ],
    benefits: [
      { title: 'Fewer returns', text: '“Message us before returning” routed to WhatsApp resolves size and colour issues cheaply.' },
      { title: 'Repeat customers', text: 'Instagram and WhatsApp QR bring buyers back outside the marketplace.' },
      { title: 'Professional look', text: 'Consistent branding on every parcel.' },
      { title: 'Print at home', text: '10 cards per A4 on 250–300 gsm card stock.' },
    ],
    features: [
      { title: '4 templates', text: 'Minimal, Bold, Elegant, Playful.' },
      { title: 'Working QR', text: 'WhatsApp, Instagram or website.' },
      { title: '3 card sizes', text: 'Business card, A7, A6 with matching A4 sheet layouts.' },
      { title: 'Cut marks', text: 'Guillotine-friendly guides on the sheet.' },
      { title: '300 DPI output', text: 'Sharp text and QR at print size.' },
      { title: 'Free', text: 'No watermark, no signup.' },
    ],
    faq: [
      { q: 'What paper should I print thank-you cards on?', a: '250–300 gsm matte card stock on a laser or inkjet printer. Print the A4 PDF at 100 % scale and cut along the marks.' },
      { q: 'Can I get a print shop to print them?', a: 'Yes. Download the PNG (300 DPI) or the PDF and send it; both are print-ready.' },
      { q: 'Is adding a WhatsApp QR allowed by marketplaces?', a: 'Policies differ. Most marketplaces discourage steering customers off-platform for the same order; a support contact for order issues is generally acceptable. Check your marketplace’s packaging insert policy.' },
    ],
    related: ['qr-code-generator', 'meesho-label-cropper', 'barcode-generator', 'images-to-pdf'],
  },

  {
    slug: 'gst-invoice-generator',
    short: "Tax invoice PDF with HSN, CGST/SGST/IGST and amount in words.",
    category: 'generators',
    name: 'GST Invoice Generator',
    h1: 'GST Invoice Generator (PDF)',
    title: 'GST Invoice Generator – Free Tax Invoice PDF (CGST/SGST/IGST)',
    description:
      'Create GST-compliant tax invoices as PDF: seller and buyer GSTIN, HSN codes, per-line tax rates, automatic CGST/SGST or IGST, totals in words. Details saved on your device. Free.',
    tagline: 'A proper tax invoice in two minutes: your GSTIN, HSN per line, automatic tax split, amount in words — downloaded as a clean PDF.',
    keywords: ['gst invoice generator', 'free gst invoice generator', 'tax invoice format', 'gst bill generator online', 'invoice generator india pdf', 'ecommerce invoice generator'],
    icon: 'receipt',
    script: 'invoice',
    libs: ['pdflib'],
    panel: `
<div class="tool-ui" data-tool="invoice">
  <form class="inv-form" id="invform" autocomplete="on">
    <div class="inv-cols">
      <fieldset class="opt"><legend>Seller (saved on this device)</legend>
        ${text('sname', 'Business name', '', 'required autocomplete="organization"')}${text('sgstin', 'GSTIN', '', 'placeholder="09ABCDE1234F1Z5" maxlength="15" required spellcheck="false"')}
        <label class="field"><span>Address</span><textarea id="saddr" rows="2"></textarea></label>
        <div class="grid2">${text('sstate', 'State', '')}${text('sstatecode', 'State code', '', 'placeholder="09" maxlength="2" inputmode="numeric" pattern="[0-9]{2}"')}</div>
        <div class="grid2">${text('sphone', 'Phone', '')}${text('semail', 'Email', '', 'type="email" autocomplete="email"')}</div>
      </fieldset>
      <fieldset class="opt"><legend>Buyer</legend>
        ${text('bname', 'Name', '', 'required')}${text('bgstin', 'GSTIN (optional)', '', 'maxlength="15" spellcheck="false"')}
        <label class="field"><span>Address</span><textarea id="baddr" rows="2"></textarea></label>
        <div class="grid2">${text('bstate', 'State', '')}${text('bstatecode', 'State code', '', 'placeholder="27" maxlength="2" inputmode="numeric" pattern="[0-9]{2}"')}</div>
        <div class="grid2">${text('bphone', 'Phone', '')}${text('pos', 'Place of supply', '')}</div>
      </fieldset>
    </div>
    <div class="grid4">
      ${text('invno', 'Invoice no.', 'INV-0001', 'required')}
      <label class="field"><span>Invoice date</span><input type="date" id="invdate"></label>
      ${text('orderno', 'Order / PO no. (optional)', '')}
      ${select('supply', 'Supply type', [{ v: 'auto', l: 'Auto (by state code)', s: true }, { v: 'intra', l: 'Intra-state (CGST+SGST)' }, { v: 'inter', l: 'Inter-state (IGST)' }])}
    </div>
    <div class="items">
      <table class="tbl" id="items">
        <thead><tr><th>#</th><th>Description</th><th>HSN/SAC</th><th class="r">Qty</th><th class="r">Rate (₹)</th><th class="r">Disc (₹)</th><th class="r">GST %</th><th class="r">Amount</th><th></th></tr></thead>
        <tbody></tbody>
      </table>
      <button type="button" class="btn btn-sm" id="additem">+ Add line</button>
    </div>
    <div class="grid4">
      ${num('shipchg', 'Shipping charges (₹)', 0, 'min="0" step="0.01"')}
      ${num('shipgst', 'GST on shipping (%)', 18, 'min="0"')}
      ${select('roundoff', 'Round off total', [{ v: '1', l: 'Yes', s: true }, { v: '0', l: 'No' }])}
      ${select('price', 'Rates are', [{ v: 'excl', l: 'Exclusive of GST', s: true }, { v: 'incl', l: 'Inclusive of GST' }])}
    </div>
    <label class="field"><span>Notes / terms (optional)</span><textarea id="notes" rows="2">Thank you for your business. Goods once sold are not returnable except as per the marketplace policy.</textarea></label>
    <label class="field"><span>Bank details / UPI (optional)</span><textarea id="bank" rows="2"></textarea></label>
  </form>
  <div class="inv-summary" id="invsummary"></div>
  <div class="runbar">
    <button class="btn btn-primary btn-lg" id="run">Download invoice PDF <svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg></button>
    <button class="btn" id="clearbuyer">Clear buyer & items</button>
    <p class="status" id="status" role="status" aria-live="polite"></p>
  </div>
  <p class="local-note"><svg class="ic" aria-hidden="true"><use href="#i-shield"/></svg> Seller details are stored only in this browser (localStorage). Nothing is sent to a server.</p>
</div>`,
    intro: [
      'Marketplaces generate invoices for marketplace orders, but every seller also bills directly — wholesale buyers, Instagram orders, B2B customers, replacement shipments. Those need a tax invoice that carries your GSTIN, the buyer’s details, HSN codes, and CGST/SGST or IGST worked out correctly. The GST Invoice Generator produces exactly that as a PDF.',
      'Your seller details are remembered in your browser so the next invoice takes a minute. Line items support quantity, rate, discount and a per-line GST rate; the total is shown in words as the GST rules require.',
    ],
    steps: [
      { title: 'Enter seller and buyer details', text: 'Seller details are saved on your device for next time. Buyer GSTIN is optional for B2C.' },
      { title: 'Add line items', text: 'Description, HSN, quantity, rate, discount and GST rate per line. Choose whether rates include GST.' },
      { title: 'Download the PDF', text: 'The tax split (intra/inter-state) is decided from state codes, totals are rounded and written in words.' },
    ],
    benefits: [
      { title: 'Compliant format', text: 'Mandatory fields — GSTIN, HSN, tax breakup, place of supply, amount in words.' },
      { title: 'Correct tax every time', text: 'CGST/SGST vs IGST decided automatically from state codes.' },
      { title: 'Repeat fast', text: 'Saved seller profile; sequential invoice numbers suggested.' },
      { title: 'Private', text: 'No invoice data ever leaves your browser.' },
    ],
    features: [
      { title: 'Per-line GST rate', text: 'Mix 5 %, 12 % and 18 % items on one bill.' },
      { title: 'Inclusive or exclusive rates', text: 'Back-calculate tax from MRP-style prices.' },
      { title: 'Discounts & shipping', text: 'Line discounts and taxable shipping charges.' },
      { title: 'Amount in words', text: 'Indian numbering (lakh, crore).' },
      { title: 'Notes & bank details', text: 'Terms, UPI ID and bank block on the invoice.' },
      { title: 'Clean PDF', text: 'Vector text, prints crisp on A4.' },
    ],
    faq: [
      { q: 'What must a GST tax invoice contain?', a: 'Supplier name, address and GSTIN; a consecutive invoice number and date; recipient details (GSTIN if registered); HSN/SAC codes; description, quantity and value; taxable value; rate and amount of CGST/SGST/IGST; place of supply; and the total. This tool includes all of them.' },
      { q: 'How does it decide between CGST+SGST and IGST?', a: 'In Auto mode, if the seller and buyer state codes match it is intra-state (CGST + SGST); otherwise IGST. You can force either.' },
      { q: 'Where are my details stored?', a: 'In your browser’s localStorage on this device only. Clear site data to remove them.' },
      { q: 'Can I use this for marketplace orders?', a: 'Marketplaces already issue invoices for orders placed on them; use this for direct sales, B2B, replacements or when a customer asks for a reissued invoice.' },
    ],
    related: ['gst-calculator', 'profit-calculator', 'images-to-pdf', 'qr-code-generator'],
  },

  // ═══════════════════════ IMAGE TOOLS ═══════════════════════
  {
    slug: 'product-image-resizer',
    short: "Batch resize to 1000×1000, 2000×2000 or 3:4 with white padding.",
    category: 'image-tools',
    name: 'Product Image Resizer',
    h1: 'Product Image Resizer for Marketplaces',
    title: 'Product Image Resizer – Meesho, Flipkart, Amazon Sizes Free',
    description:
      'Batch-resize product photos to marketplace dimensions (1000×1000, 2000×2000, 3:4 portrait) with white padding or center crop. JPG/PNG/WebP output, ZIP download. Free, private.',
    tagline: 'Batch-fit product photos to the exact size and ratio each marketplace asks for — pad with white or crop to fill, export as JPG, PNG or WebP.',
    keywords: ['product image resizer', 'meesho image size', 'flipkart image size 1000x1000', 'amazon product image resizer', 'resize image to 1000x1000', 'bulk image resizer online'],
    icon: 'resize',
    script: 'resizer',
    libs: ['jszip'],
    panel: `
<div class="tool-ui" data-tool="resizer">
  ${dropzone({ multiple: true, accept: 'image/*', title: 'Drop product photos', sub: 'JPG, PNG, WebP · batch supported · nothing is uploaded' })}
  <div class="opts" id="ropts" hidden>
    ${select('preset', 'Preset', [{ v: '1000x1000', l: 'Square 1000 × 1000 (Flipkart / Amazon min)', s: true }, { v: '2000x2000', l: 'Square 2000 × 2000 (Amazon zoom)' }, { v: '1500x1500', l: 'Square 1500 × 1500' }, { v: '1200x1600', l: 'Portrait 3:4 1200 × 1600 (fashion)' }, { v: '1080x1350', l: 'Portrait 4:5 1080 × 1350 (Instagram)' }, { v: '1080x1080', l: 'Square 1080 × 1080 (Instagram)' }, { v: 'custom', l: 'Custom' }])}
    <div class="grid2" data-show="preset=custom">${num('cw', 'Width (px)', 1000, 'min="50"')}${num('ch', 'Height (px)', 1000, 'min="50"')}</div>
    ${radios('fit', 'Fit mode', [{ v: 'pad', l: 'Pad (keep whole image)' }, { v: 'cover', l: 'Crop to fill' }, { v: 'stretch', l: 'Stretch' }])}
    <div class="grid3">
      <label class="field"><span>Padding colour</span><input type="color" id="bg" value="#FFFFFF"></label>
      ${select('fmt', 'Output format', [{ v: 'jpeg', l: 'JPG', s: true }, { v: 'png', l: 'PNG' }, { v: 'webp', l: 'WebP' }])}
      ${num('q', 'Quality (%)', 90, 'min="30" max="100"')}
    </div>
    <div class="chks">${check('suffix', 'Add size suffix to file name (e.g. -1000x1000)', true)}</div>
  </div>
  <div class="img-grid" id="imgs"></div>
  ${runbar('Resize & download')}
</div>`,
    intro: [
      'Flipkart wants at least 500 × 500 and prefers square; Amazon rejects anything under 1000 px on the longest side and wants the product filling 85 % of a white frame; fashion catalogues look best at 3:4. Photographers deliver whatever ratio the camera shot. The Product Image Resizer batch-converts a folder of photos to the exact dimensions each platform expects.',
      '“Pad” keeps the whole product and fills the rest with white (or any colour); “Crop to fill” centres and trims; “Stretch” is there if you really need it. Output as JPG, PNG or WebP, each file renamed with its size, zipped for download.',
    ],
    steps: [
      { title: 'Drop your photos', text: 'Any number of JPG, PNG or WebP files. Thumbnails show the original size.' },
      { title: 'Choose a preset and fit mode', text: 'Square 1000 or 2000, portrait 3:4, or custom pixels. Pad with white for marketplace main images.' },
      { title: 'Resize & download', text: 'One image downloads directly; several are zipped.' },
    ],
    benefits: [
      { title: 'No more rejected images', text: 'Exact pixel sizes and ratios for each marketplace.' },
      { title: 'Batch in seconds', text: 'Fifty photos in one go instead of one-by-one in an editor.' },
      { title: 'White-background padding', text: 'Meets the plain-background rule without cutting off the product.' },
      { title: 'Private', text: 'Photos never leave your device.' },
    ],
    features: [
      { title: 'Marketplace presets', text: '1000², 1500², 2000², 3:4, 4:5 and custom.' },
      { title: 'Pad / crop / stretch', text: 'Three fit modes.' },
      { title: 'JPG, PNG, WebP', text: 'Quality control for lossy formats.' },
      { title: 'Renamed outputs', text: 'Size suffix on every file.' },
      { title: 'ZIP download', text: 'One archive for the batch.' },
      { title: 'Free & unlimited', text: 'No signup.' },
    ],
    faq: [
      { q: 'What image size does Amazon India require?', a: 'At least 1000 px on the longest side (1600+ recommended for zoom), product covering about 85 % of the frame, pure white background for the main image. Use the 2000 × 2000 preset with Pad.' },
      { q: 'What size should Meesho product images be?', a: 'Meesho accepts standard JPG/PNG catalog images; a 3:4 portrait around 1200 × 1600 works well for apparel and square 1000 × 1000 for other categories. Check the current catalog guidelines in your supplier panel.' },
      { q: 'Does upscaling small photos improve quality?', a: 'No — pixels are interpolated. Start from the highest-resolution original you have.' },
    ],
    related: ['image-compressor', 'images-to-pdf', 'thank-you-card-maker', 'qr-code-generator'],
  },

  {
    slug: 'image-compressor',
    short: "Bulk compress JPG / PNG / WebP with before-and-after sizes.",
    category: 'image-tools',
    name: 'Image Compressor',
    h1: 'Image Compressor',
    title: 'Image Compressor Online Free – Bulk JPG, PNG, WebP, No Upload',
    description:
      'Compress product photos in bulk with a quality slider and optional max dimension. See before/after sizes and download a ZIP. Runs locally — free, private, unlimited.',
    tagline: 'Shrink catalog photos to a fraction of their size without visible loss — with a live before/after size readout.',
    keywords: ['image compressor', 'compress jpg online', 'compress image without losing quality', 'bulk image compressor', 'reduce image size for upload', 'compress product photos'],
    icon: 'compress',
    script: 'compressor',
    libs: ['jszip'],
    panel: `
<div class="tool-ui" data-tool="compressor">
  ${dropzone({ multiple: true, accept: 'image/*', title: 'Drop images to compress', sub: 'JPG, PNG, WebP · batch supported · nothing is uploaded' })}
  <div class="opts" id="copts" hidden>
    <div class="grid3">
      ${num('q', 'Quality (%)', 80, 'min="10" max="100"')}
      ${num('maxdim', 'Max width/height (px, 0 = keep)', 2000, 'min="0"')}
      ${select('fmt', 'Output format', [{ v: 'keep', l: 'Same as input', s: true }, { v: 'jpeg', l: 'JPG' }, { v: 'webp', l: 'WebP' }, { v: 'png', l: 'PNG' }])}
    </div>
  </div>
  <div class="img-grid" id="imgs"></div>
  ${runbar('Compress & download')}
</div>`,
    intro: [
      'Catalog uploads time out, WhatsApp shrinks images badly, and marketplace bulk-upload sheets have per-image size caps. The Image Compressor re-encodes photos with a quality you choose and an optional maximum dimension, showing the size saved for every file before you download.',
      'Compression uses your browser’s own encoder — the same quality as a desktop app — and photos stay on your device.',
    ],
    steps: [
      { title: 'Drop images', text: 'Thumbnails appear with their original size.' },
      { title: 'Set quality and max size', text: '80 % quality is visually lossless for most photos; a 2000 px cap keeps zoom quality while cutting size sharply.' },
      { title: 'Compress & download', text: 'See the saving per file, then download one image or a ZIP.' },
    ],
    benefits: [
      { title: 'Faster uploads', text: 'A 6 MB phone photo becomes ~400 KB.' },
      { title: 'Visual control', text: 'Quality slider with size preview.' },
      { title: 'Batch', text: 'Hundreds of files at once.' },
      { title: 'Private', text: 'No upload.' },
    ],
    features: [
      { title: 'JPG / PNG / WebP', text: 'Keep format or convert.' },
      { title: 'Max dimension', text: 'Downscale huge camera photos.' },
      { title: 'Size readout', text: 'Before → after per file and total.' },
      { title: 'ZIP output', text: 'One download.' },
      { title: 'EXIF orientation', text: 'Rotated phone photos come out upright.' },
      { title: 'Free', text: 'No limits.' },
    ],
    faq: [
      { q: 'Will compressing reduce the quality visibly?', a: 'At 75–85 % JPEG quality most product photos are indistinguishable from the original on screen. Below 60 % you may see artefacts in smooth gradients.' },
      { q: 'Why did my PNG get bigger as PNG?', a: 'PNG is lossless; the quality slider has no effect on it. Convert to JPG or WebP for photos, keep PNG for graphics with flat colours.' },
      { q: 'Is EXIF data kept?', a: 'No. Re-encoding strips metadata (camera model, GPS), which also removes private location data from photos.' },
    ],
    related: ['product-image-resizer', 'images-to-pdf', 'pdf-to-images', 'thank-you-card-maker'],
  },
];

for (const t of tools) t.updated = t.updated || UPDATED;
