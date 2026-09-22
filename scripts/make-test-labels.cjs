// Generates synthetic marketplace label PDFs for testing the croppers (not part of the site).
const fs = require('fs'); const path = require('path');
const m = { exports: {} }; new Function('module', 'exports', fs.readFileSync(path.join(__dirname, '..', 'src', 'vendor', 'pdf-lib.min.js'), 'utf8'))(m, m.exports);
const { PDFDocument, StandardFonts, rgb } = m.exports;
const out = process.argv[2] || path.join(__dirname, '..', 'dist', 'test');
fs.mkdirSync(out, { recursive: true });
const black = rgb(0, 0, 0), white = rgb(1, 1, 1);
const bars = (p, x, y, w, h) => { let cx = x; let i = 0; while (cx < x + w) { const bw = [1, 2, 1, 3, 1, 2][i++ % 6]; p.drawRectangle({ x: cx, y, width: bw, height: h, color: black }); cx += bw + [1, 1, 2, 1][i % 4]; } };

async function meesho() {
  const doc = await PDFDocument.create(); const F = await doc.embedFont(StandardFonts.Helvetica), B = await doc.embedFont(StandardFonts.HelveticaBold);
  const orders = [['79GeLuqN', 'Free Size', 1, 'Multi', '333518318483411528_1', 'Valmo', 'Antony TJ'], ['KURTA-BLUE-M', 'M', 2, 'Blue', '333518318483411600_1', 'Delhivery', 'Priya S'], ['79GeLuqN', 'Free Size', 1, 'Multi', '333518318483411777_1', 'Xpressbees', 'Rahul K'], ['SAREE-RED', 'Free Size', 1, 'Red', '333518318483411812_1', 'Valmo', 'Meena R'], ['KURTA-BLUE-M', 'M', 1, 'Blue', '333518318483411901_1', 'Shadowfax', 'Arjun M'], ['KURTA-BLUE-M', 'M', 3, 'Blue', '333518318483411955_1', 'Delhivery', 'Sana K']];
  for (const [sku, size, qty, color, order, courier, name] of orders) {
    const p = doc.addPage([595.28, 841.89]); const t = (s, x, y, size = 9, f = F, color = black) => p.drawText(s, { x, y, size, font: f, color });
    p.drawRectangle({ x: 32, y: 470, width: 530, height: 340, borderColor: black, borderWidth: 1 });
    p.drawLine({ start: { x: 300, y: 810 }, end: { x: 300, y: 530 }, thickness: 1, color: black }); p.drawLine({ start: { x: 32, y: 530 }, end: { x: 562, y: 530 }, thickness: 1, color: black });
    t('Customer Address', 40, 795, 9, B); t(name, 40, 780, 10, B); t('101, 1st floor, Tejaswi homes', 40, 766); t('Thomas Layout, Hadosiddapura, Hado', 40, 753); t('Bengaluru, Karnataka, 560035', 40, 740);
    p.drawLine({ start: { x: 32, y: 700 }, end: { x: 300, y: 700 }, thickness: 1, color: black });
    t('If undelivered, return to:', 40, 686, 8, B); t('Sidharth Communication', 40, 673); t('SECTOR-68, NOIDA, Gautam Buddha Nagar', 40, 660); t('Uttar Pradesh, 201301', 40, 647);
    p.drawRectangle({ x: 305, y: 790, width: 250, height: 16, color: black }); t('Prepaid: Do not collect cash', 310, 794, 9, F, white);
    t(courier, 310, 765, 16, B); t('Pickup', 400, 768, 8); t('JVV-R0', 310, 745, 12, B); t('PCDB', 310, 715, 12, B);
    bars(p, 440, 700, 110, 80);
    p.drawRectangle({ x: 305, y: 620, width: 250, height: 18, color: black }); t('VL0085494713789', 360, 625, 11, B, white); bars(p, 320, 560, 220, 40);
    t('Product Details', 40, 515, 9, B);
    const hx = [40, 200, 280, 330, 400]; ['SKU', 'Size', 'Qty', 'Color', 'Order No.'].forEach((h, i) => t(h, hx[i], 497, 9, B)); [sku, size, String(qty), color, order].forEach((v, i) => t(v, hx[i], 482, 9));
    // invoice
    p.drawRectangle({ x: 32, y: 120, width: 530, height: 345, borderColor: black, borderWidth: 1 });
    t('TAX INVOICE', 250, 452, 9, B); t('Original For Recipient', 470, 452, 6, B);
    p.drawLine({ start: { x: 32, y: 445 }, end: { x: 562, y: 445 }, thickness: 0.5, color: black });
    t('BILL TO / SHIP TO', 40, 432, 7, B); t(`${name} - , Bengaluru, Karnataka, 560035, Place of Supply: Karnataka`, 40, 420, 7);
    t('Sold by : ASHWANI KUMAR MISHRA', 300, 432, 7); t('GSTIN - 09BCPPM7207M1ZX', 300, 408, 7, B); t('Purchase Order No.  Invoice No.  Order Date  Invoice Date', 300, 392, 7); t(`${order.split('_')[0]}  dde16278728  21.09.2026  22.09.2026`, 300, 382, 7, B);
    t('Description   HSN   Qty   Gross Amount   Discount   Taxable Value   Taxes   Total', 40, 350, 7, B);
    t('Movie Poster Set | A4 Size HD Wall Art   491191   1   Rs.114.00   Rs.25.00   Rs.75.42   IGST @18.0% Rs.13.58   Rs.89.00', 40, 335, 7);
    t('Other Charges   491191   NA   Rs.10.00   Rs.0   Rs.8.47   IGST @18.0% Rs.1.53   Rs.10.00', 40, 320, 7);
    t('Total   Rs.15.11   Rs.99.00', 40, 300, 7, B);
    t('Tax is not payable on reverse charge basis. This is a computer generated invoice and does not require signature.', 40, 135, 6);
  }
  fs.writeFileSync(path.join(out, 'meesho-sample.pdf'), await doc.save());
}
async function flipkart() {
  const doc = await PDFDocument.create(); const F = await doc.embedFont(StandardFonts.Helvetica), B = await doc.embedFont(StandardFonts.HelveticaBold);
  const orders = [['FK-SHIRT-L', 'Mens Cotton Shirt L Blue', 1, 'OD4321'], ['FK-SHIRT-M', 'Mens Cotton Shirt M Blue', 2, 'OD4322'], ['FK-SHIRT-L', 'Mens Cotton Shirt L Blue', 1, 'OD4323']];
  for (const [sku, desc, qty, od] of orders) {
    const p = doc.addPage([595.28, 841.89]); const t = (s, x, y, size = 9, f = F, color = black) => p.drawText(s, { x, y, size, font: f, color });
    p.drawRectangle({ x: 30, y: 520, width: 535, height: 290, borderColor: black, borderWidth: 1 });
    t('Flipkart', 40, 790, 14, B); t('E-Kart Logistics', 400, 790, 10, B); t('Standard Delivery', 400, 776, 8);
    bars(p, 40, 700, 250, 60); t('FMPP1234567890', 40, 688, 9, B);
    t('Deliver To:', 320, 760, 8, B); t('Rahul Verma', 320, 748, 10, B); t('12, MG Road, Pune, Maharashtra 411001', 320, 736, 8); t('Shipped by (Seller): Sidharth Communication', 320, 700, 7);
    t('Not for resale', 40, 660, 8, B);
    const hx = [40, 120, 470, 520]; ['SKU ID', 'Description', 'QTY', 'Order ID'].forEach((h, i) => t(h, hx[i], 600, 8, B)); [sku, desc, String(qty), od].forEach((v, i) => t(v, hx[i], 585, 8));
    p.drawRectangle({ x: 30, y: 150, width: 535, height: 360, borderColor: black, borderWidth: 1 });
    t('Tax Invoice', 260, 495, 10, B); t('Sold By: Sidharth Communication, GSTIN 09BCPPM7207M1ZX', 40, 475, 8); t('Invoice No: FAAB123 Date: 22-09-2026', 40, 462, 8);
    t('Product  Qty  Gross  Discount  Taxable  IGST  Total', 40, 430, 8, B); t(`${desc}  ${qty}  499.00  0.00  475.24  23.76  499.00`, 40, 415, 8);
    t('Total  499.00', 40, 390, 8, B); t('Declaration: This is a computer generated invoice.', 40, 160, 6);
  }
  fs.writeFileSync(path.join(out, 'flipkart-sample.pdf'), await doc.save());
}
async function amazon() {
  const doc = await PDFDocument.create(); const F = await doc.embedFont(StandardFonts.Helvetica), B = await doc.embedFont(StandardFonts.HelveticaBold);
  for (const [sku, name] of [['AMZ-MUG-01', 'Neha G'], ['AMZ-MUG-02', 'Vikram P']]) {
    const p = doc.addPage([595.28, 841.89]); const t = (s, x, y, size = 9, f = F, color = black) => p.drawText(s, { x, y, size, font: f, color });
    p.drawRectangle({ x: 40, y: 400, width: 290, height: 420, borderColor: black, borderWidth: 1, borderDashArray: [3, 3] });
    t('amazon.in', 50, 800, 12, B); t('Easy Ship', 200, 800, 9); t('Amazon Transportation Services', 50, 785, 7);
    t('Ship To:', 50, 750, 8, B); t(name, 50, 738, 10, B); t('45, Anna Nagar, Chennai, Tamil Nadu 600040', 50, 726, 8);
    bars(p, 50, 620, 260, 70); t('Shipment ID: 4032-1122-3344', 50, 605, 8); t('AWB 1234567890', 50, 592, 8, B); t(`SKU: ${sku}   Qty: 1`, 50, 560, 8);
    t('Fold here', 50, 380, 6);
    const inv = doc.addPage([595.28, 841.89]); const ti = (s, x, y, size = 9, f = F) => inv.drawText(s, { x, y, size, font: f });
    ti('Tax Invoice/Bill of Supply/Cash Memo', 180, 800, 11, B); ti('(Original for Recipient)', 240, 786, 7); ti('Sold By: Sidharth Communication', 40, 760, 8); ti('GST Registration No: 09BCPPM7207M1ZX', 40, 748, 8); ti('Billing Address: ' + name, 350, 760, 8);
    ti('Sl. No  Description  Unit Price  Qty  Net Amount  Tax Rate  Tax Amount  Total', 40, 700, 7, B); ti(`1  Ceramic Coffee Mug (${sku})  169.49  1  169.49  18%  30.51  200.00`, 40, 686, 7); ti('TOTAL: 200.00', 40, 660, 8, B); ti('Amount in Words: Two Hundred only', 40, 640, 7);
  }
  fs.writeFileSync(path.join(out, 'amazon-sample.pdf'), await doc.save());
}
Promise.all([meesho(), flipkart(), amazon()]).then(() => console.log('test PDFs written to', out));
