/* engine.js — PDF engine: lazy libs, PDF.js rendering/text, pdf-lib building,
   marketplace label detection + cropping, N-up layout. Everything is local. */
(() => {
  'use strict';
  const S = (window.SKUD = window.SKUD || {});
  const VENDOR = '/vendor/';
  const loaded = {};
  const loadScript = (src) => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Failed to load ' + src)); document.head.appendChild(s); });
  const libs = {
    pdfjs: async () => { const m = await import(VENDOR + 'pdf.min.mjs'); m.GlobalWorkerOptions.workerSrc = VENDOR + 'pdf.worker.min.mjs'; return m; },
    pdflib: async () => { await loadScript(VENDOR + 'pdf-lib.min.js'); return window.PDFLib; },
    jszip: async () => { await loadScript(VENDOR + 'jszip.min.js'); return window.JSZip; },
    jsbarcode: async () => { await loadScript(VENDOR + 'JsBarcode.all.min.js'); return window.JsBarcode; },
    qrcode: async () => { await loadScript(VENDOR + 'qrcode.js'); return window.qrcode; },
  };
  const lib = (name) => (loaded[name] ||= libs[name]());
  const loadLibs = (names) => Promise.all(names.map(lib));
  // Preload the libs a tool page declares (data-libs) so the first action is instant.
  addEventListener('DOMContentLoaded', () => { const l = document.getElementById('tool')?.dataset.libs; if (l) requestIdleCallback ? requestIdleCallback(() => loadLibs(l.split(',').filter(Boolean))) : loadLibs(l.split(',').filter(Boolean)); });

  const PT = 72 / 25.4; // points per mm
  const mm2pt = (mm) => mm * PT, pt2mm = (pt) => pt / PT;
  const PAPER = { A4: [595.28, 841.89], A3: [841.89, 1190.55], A5: [419.53, 595.28], Letter: [612, 792], Legal: [612, 1008], '4x6': [288, 432] };
  const readFile = (file) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(new Uint8Array(r.result)); r.onerror = rej; r.readAsArrayBuffer(file); });

  // ── PDF.js helpers ───────────────────────────────────────────────────
  const openPdf = async (bytes) => { const pdfjs = await lib('pdfjs'); return pdfjs.getDocument({ data: bytes.slice(0), isEvalSupported: false }).promise; };
  const renderPage = async (doc, num, { scale, width, canvas } = {}) => {
    const page = await doc.getPage(num);
    let vp = page.getViewport({ scale: 1 });
    const s = scale || (width ? width / vp.width : 1);
    vp = page.getViewport({ scale: s });
    // Always render to a fresh canvas, then blit into the target: pdf.js forbids overlapping
    // renders on one canvas, and tools re-render on every option change.
    const off = document.createElement('canvas');
    off.width = Math.ceil(vp.width); off.height = Math.ceil(vp.height);
    // intent:'print' → pdf.js skips requestAnimationFrame scheduling, so rendering continues in background tabs.
    await page.render({ canvasContext: off.getContext('2d', { alpha: false }), viewport: vp, intent: 'print' }).promise;
    if (canvas) { canvas.width = off.width; canvas.height = off.height; canvas.getContext('2d').drawImage(off, 0, 0); return { canvas, viewport: vp, page }; }
    return { canvas: off, viewport: vp, page };
  };
  // Text items in PDF user space (origin bottom-left, y up) + joined lines.
  const pageText = async (doc, num) => {
    const page = await doc.getPage(num);
    const tc = await page.getTextContent();
    const [vx0, vy0, vx1, vy1] = page.view;
    const items = tc.items.filter((it) => it.str && it.str.trim()).map((it) => {
      const [a, b, c, d, e, f] = it.transform; const h = Math.hypot(c, d) || it.height || 0;
      return { s: it.str, x: e, y: f, w: it.width, h };
    });
    // group into lines by baseline
    const sorted = [...items].sort((p, q) => q.y - p.y || p.x - q.x);
    const lines = [];
    for (const it of sorted) {
      const ln = lines.find((l) => Math.abs(l.y - it.y) <= Math.max(2, it.h * 0.4));
      if (ln) { ln.items.push(it); } else lines.push({ y: it.y, items: [it] });
    }
    for (const ln of lines) {
      ln.items.sort((p, q) => p.x - q.x);
      ln.text = ln.items.map((i) => i.s).join(' ').replace(/\s+/g, ' ').trim();
      ln.x0 = Math.min(...ln.items.map((i) => i.x)); ln.x1 = Math.max(...ln.items.map((i) => i.x + i.w));
      ln.h = Math.max(...ln.items.map((i) => i.h)); ln.top = ln.y + ln.h;
    }
    return { items, lines, text: lines.map((l) => l.text).join('\n'), view: [vx0, vy0, vx1, vy1], w: vx1 - vx0, h: vy1 - vy0, rotate: page.rotate || 0 };
  };

  // ── marketplace detection ────────────────────────────────────────────
  const FP = {
    meesho: [/customer address/i, /if undelivered,? return to/i, /product details/i, /prepaid: do not collect cash/i, /meesho/i, /pickup/i, /valmo/i],
    flipkart: [/flipkart/i, /e-?kart/i, /fkmp|fmpp/i, /shipped by/i, /not for resale/i, /standard delivery|express delivery/i, /seller hub/i, /\bfsn\b/i],
    amazon: [/amazon/i, /easy ship/i, /\bats\b/i, /ship to/i, /shipment id/i, /bill of supply/i, /seller central/i, /\basin\b/i],
  };
  const detectMarket = (text) => {
    const scores = {};
    for (const [m, res] of Object.entries(FP)) scores[m] = res.reduce((n, re) => n + (re.test(text) ? 1 : 0), 0);
    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    return best && best[1] >= 2 ? best[0] : 'unknown';
  };
  const COURIERS = [
    ['Valmo', /valmo/i], ['Delhivery', /delhivery/i], ['Xpressbees', /xpress\s?bees/i], ['Ekart', /e-?kart/i], ['Shadowfax', /shadowfax/i],
    ['Ecom Express', /ecom\s?express/i], ['Amazon Shipping', /amazon (shipping|transportation)|\bats\b/i], ['Blue Dart', /blue\s?dart/i], ['DTDC', /\bdtdc\b/i],
    ['Shiprocket', /shiprocket/i], ['Smartr', /smartr/i], ['India Post', /india post|speed post/i], ['Loadshare', /loadshare/i], ['Gati', /\bgati\b/i],
  ];
  const detectCourier = (text) => { for (const [n, re] of COURIERS) if (re.test(text)) return n; return 'Other'; };
  const INVOICE_RE = /^(tax\s*invoice|tax\s*invoice\s*\/?\s*bill\s*of\s*supply|bill\s*of\s*supply|invoice)(\s*[-–:]?\s*(original|duplicate|for recipient|for consignee|cum.*)?)?$/i;

  // Column-table extraction: find a header line containing SKU/Qty/… and read rows under it.
  const HEAD = { sku: /^sku(\s*(id|code))?\.?$/i, size: /^size$/i, qty: /^(qty|quantity|total\s*qty)\.?$/i, color: /^colou?r$/i, order: /^order\s*(no\.?|id|number|#)?$/i, desc: /^(description|product\s*(name|details|description)|item(\s*name)?|product)$/i };
  const extractTable = (lines, region) => {
    const inRegion = lines.filter((l) => l.y >= region.y0 && l.top <= region.y1);
    for (let li = 0; li < inRegion.length; li++) {
      const ln = inRegion[li];
      const cols = [];
      for (const it of ln.items) for (const [k, re] of Object.entries(HEAD)) if (re.test(it.s.trim())) { cols.push({ k, x: it.x }); break; }
      if (!cols.find((c) => c.k === 'sku')) continue;
      cols.sort((a, b) => a.x - b.x);
      const rows = [];
      for (let r = li + 1; r < inRegion.length && rows.length < 12; r++) {
        const row = inRegion[r]; if (ln.y - row.y > 120 * (rows.length + 1)) break;
        if (INVOICE_RE.test(row.text) || /^total/i.test(row.text)) break;
        const rec = {};
        for (const it of row.items) {
          let col = cols[0]; for (const c of cols) if (it.x + 1 >= c.x - 3) col = c; // rightmost header whose x <= item.x
          rec[col.k] = (rec[col.k] ? rec[col.k] + ' ' : '') + it.s.trim();
        }
        if (!rec.sku) { if (rows.length) break; else continue; }
        if (rec.qty && !/^\d+$/.test(rec.qty)) { const m = rec.qty.match(/\d+/); rec.qty = m ? m[0] : ''; }
        rows.push(rec);
      }
      if (rows.length) return rows;
    }
    // Inline "SKU: value" fallback
    const m = lines.map((l) => l.text).join('\n').match(/sku(?:\s*id)?\s*[:\-]\s*([^\s|]+)/i);
    const q = lines.map((l) => l.text).join('\n').match(/qty(?:\s*\.)?\s*[:\-]?\s*(\d+)/i);
    return m ? [{ sku: m[1], qty: q ? q[1] : '1' }] : [];
  };

  // Analyse one page → crop boxes + metadata.
  const analyzePage = async (doc, num, forced = 'auto') => {
    const t = await pageText(doc, num);
    const market = forced === 'auto' ? detectMarket(t.text) : forced;
    const [vx0, vy0, vx1, vy1] = t.view;
    const PAD = 10;
    const all = t.items;
    const bounds = (arr) => arr.length ? { x0: Math.min(...arr.map((i) => i.x)), x1: Math.max(...arr.map((i) => i.x + i.w)), y0: Math.min(...arr.map((i) => i.y)), y1: Math.max(...arr.map((i) => i.y + i.h)) } : null;
    const clamp = (b) => ({ x0: Math.max(vx0, b.x0 - PAD), y0: Math.max(vy0, b.y0 - PAD), x1: Math.min(vx1, b.x1 + PAD), y1: Math.min(vy1, b.y1 + PAD) });
    const invLine = t.lines.find((l) => INVOICE_RE.test(l.text)) || t.lines.find((l) => /^(tax\s*invoice|bill\s*of\s*supply)/i.test(l.text));
    const labelMarkers = /customer address|ship to|deliver to|return to|order no|awb|tracking|barcode|pickup|cod|prepaid/i.test(t.text);
    const full = bounds(all);
    let labelBox = null, fullBox = null, isInvoicePage = false;
    if (!full) return { num, market, empty: true, isInvoicePage: false };
    fullBox = clamp(full);
    if (invLine) {
      const above = all.filter((i) => i.y >= invLine.top - 1);
      const b = bounds(above);
      // Invoice heading with essentially nothing above it → invoice-only page.
      if (!b || above.length < 6 || (b.y1 - b.y0) < 40 || !labelMarkers) isInvoicePage = true;
      else { labelBox = clamp({ x0: b.x0, x1: b.x1, y0: invLine.top, y1: b.y1 }); labelBox.y0 = Math.max(vy0, invLine.top + 1.5); }
    }
    if (!labelBox && !isInvoicePage) labelBox = fullBox;
    const region = labelBox || fullBox;
    const rows = extractTable(t.lines, { y0: region.y0, y1: region.y1 });
    const labelText = t.lines.filter((l) => l.y >= region.y0).map((l) => l.text).join('\n');
    const orderNo = (labelText.match(/order\s*(?:no\.?|id|number)?\s*[:#]?\s*([0-9][0-9_\-]{6,})/i) || [])[1] || (rows[0] && rows[0].order) || '';
    return { num, market, isInvoicePage, labelBox, fullBox, rows, sku: rows[0]?.sku || '', qty: parseInt(rows[0]?.qty || '1', 10) || 1, size: rows[0]?.size || '', color: rows[0]?.color || '', desc: rows[0]?.desc || '', courier: detectCourier(labelText), orderNo, rotate: t.rotate };
  };

  // ── pdf-lib builders ─────────────────────────────────────────────────
  const A4 = PAPER.A4;
  // entries: [{src: PDFDocument, idx, box:{x0,y0,x1,y1}, stamp}]
  const buildLabels = async (entries, opts, { limit } = {}) => {
    const { PDFDocument, StandardFonts, rgb, degrees } = await lib('pdflib');
    const out = await PDFDocument.create();
    const font = await out.embedFont(StandardFonts.HelveticaBold);
    const list = limit ? entries.slice(0, limit) : entries;
    const STRIP = 24;
    const stampText = (page, x, y, w, text) => { page.drawRectangle({ x, y, width: w, height: STRIP, color: rgb(1, 1, 1) }); let size = 13; while (font.widthOfTextAtSize(text, size) > w - 8 && size > 6) size -= 1; page.drawText(text, { x: x + 4, y: y + 7, size, font, color: rgb(0, 0, 0) }); };
    const bboxOf = (e) => ({ left: e.box.x0, bottom: e.box.y0, right: e.box.x1, top: e.box.y1 });
    if (opts.layout === 'thermal' && opts.size === 'auto') {
      for (const e of list) {
        const [p] = await out.copyPages(e.src, [e.idx]); out.addPage(p);
        const w = e.box.x1 - e.box.x0, h = e.box.y1 - e.box.y0;
        if (e.stamp) { p.setMediaBox(e.box.x0, e.box.y0 - STRIP, w, h + STRIP); p.setCropBox(e.box.x0, e.box.y0 - STRIP, w, h + STRIP); stampText(p, e.box.x0, e.box.y0 - STRIP, w, e.stamp); }
        else { p.setMediaBox(e.box.x0, e.box.y0, w, h); p.setCropBox(e.box.x0, e.box.y0, w, h); }
      }
    } else if (opts.layout === 'thermal') {
      // Fit to 4 x 6 in. Wide (landscape-shaped) labels are rotated 90° so the long edge runs along the roll.
      const [W, H] = PAPER['4x6'], m = 6;
      for (const e of list) {
        const ep = await out.embedPage(e.src.getPage(e.idx), bboxOf(e));
        const page = out.addPage([W, H]);
        const strip = e.stamp ? STRIP : 0, availW = W - 2 * m, availH = H - strip - 2 * m;
        const rot = ep.width > ep.height * 1.15;
        const fw = rot ? ep.height : ep.width, fh = rot ? ep.width : ep.height;
        const s = Math.min(availW / fw, availH / fh), footW = fw * s, footH = fh * s;
        const x0 = m + (availW - footW) / 2, y0 = strip + m + (availH - footH) / 2;
        if (rot) page.drawPage(ep, { x: x0 + ep.height * s, y: y0, xScale: s, yScale: s, rotate: degrees(90) });
        else page.drawPage(ep, { x: x0, y: y0, width: ep.width * s, height: ep.height * s });
        if (e.stamp) stampText(page, 4, 2, W - 8, e.stamp);
      }
    } else {
      // A4 sheets: 2 or 4 labels. Orientation is chosen automatically for the best fit of the label shape.
      const per = opts.layout === 'a4x2' ? 2 : 4, M = 20, G = 12;
      const strip = list.some((e) => e.stamp) ? STRIP : 0;
      const avgW = list.reduce((n, e) => n + (e.box.x1 - e.box.x0), 0) / list.length, avgH = list.reduce((n, e) => n + (e.box.y1 - e.box.y0), 0) / list.length;
      const cand = [{ W: A4[0], H: A4[1], cols: per === 2 ? 1 : 2, rows: 2 }, { W: A4[1], H: A4[0], cols: 2, rows: per === 2 ? 1 : 2 }].map((c) => {
        c.cw = (c.W - 2 * M - (c.cols - 1) * G) / c.cols; c.ch = (c.H - 2 * M - (c.rows - 1) * G) / c.rows; c.scale = Math.min((c.cw - 8) / avgW, (c.ch - strip - 8) / avgH); return c;
      });
      const L = cand[1].scale > cand[0].scale * 1.05 ? cand[1] : cand[0];
      const { W, H, cols, cw, ch } = L;
      let page = null;
      for (let i = 0; i < list.length; i++) {
        const e = list[i];
        const ep = await out.embedPage(e.src.getPage(e.idx), bboxOf(e));
        const k = i % per; if (k === 0) page = out.addPage([W, H]);
        const c = k % cols, r = Math.floor(k / cols);
        const cx = M + c * (cw + G), cy = H - M - (r + 1) * ch - r * G;
        const inner = ch - strip;
        const s = Math.min((cw - 8) / ep.width, (inner - 8) / ep.height);
        const dw = ep.width * s, dh = ep.height * s;
        page.drawPage(ep, { x: cx + (cw - dw) / 2, y: cy + strip + (inner - dh) / 2, width: dw, height: dh });
        if (e.stamp) stampText(page, cx + 2, cy + 2, cw - 4, e.stamp);
        if (opts.border) page.drawRectangle({ x: cx, y: cy, width: cw, height: ch, borderColor: rgb(0.6, 0.6, 0.6), borderWidth: 0.6, borderDashArray: [4, 3] });
      }
    }
    return out.save();
  };

  // N-up: srcLib = pdf-lib PDFDocument; opts = {n, paper, orient, dir, rtl, mt, mr, mb, ml, gap, border, fill, numbers, autoRotate}
  const ROTATE_GAIN = 1.12; // a turned page must be >12% larger before auto-rotate kicks in
  const factorPairs = (n) => { const out = []; for (let cols = 1; cols <= n; cols++) if (n % cols === 0) out.push({ cols, rows: n / cols }); return out; };

  // A source page's visible box (CropBox, falling back to MediaBox) plus the size a
  // viewer actually shows once /Rotate is applied.
  const pageBox = (p) => {
    const b = (p.getCropBox && p.getCropBox()) || p.getMediaBox();
    const rot = (((p.getRotation().angle || 0) % 360) + 360) % 360;
    return { left: b.x, bottom: b.y, right: b.x + b.width, top: b.y + b.height, rot,
             w: rot % 180 ? b.height : b.width, h: rot % 180 ? b.width : b.height };
  };

  const nup = async (srcLib, opts, { maxSheets } = {}) => {
    const PL = await lib('pdflib');
    const { PDFDocument, StandardFonts, rgb, degrees, pushGraphicsState, popGraphicsState, rectangle, clip, endPath } = PL;
    const n = +opts.n, total = srcLib.getPageCount();
    const [pw0, ph0] = PAPER[opts.paper] || A4;
    const autoRotate = opts.autoRotate !== false;
    const mt = mm2pt(opts.mt), mr = mm2pt(opts.mr), mb = mm2pt(opts.mb), ml = mm2pt(opts.ml), gap = mm2pt(opts.gap);
    const ref = pageBox(srcLib.getPage(0));

    // Try every cols × rows split of n on every allowed sheet orientation and keep the
    // one that scales the source page largest — that is what "6 per A4" should mean.
    const sheetSizes = opts.orient === 'portrait' ? [[pw0, ph0]] : opts.orient === 'landscape' ? [[ph0, pw0]] : [[pw0, ph0], [ph0, pw0]];
    let best = null;
    for (const [W, H] of sheetSizes) for (const { cols, rows } of factorPairs(n)) {
      const cw = (W - ml - mr - (cols - 1) * gap) / cols;
      const ch = (H - mt - mb - (rows - 1) * gap) / rows;
      if (cw <= 2 || ch <= 2) continue;
      const flat = Math.min(cw / ref.w, ch / ref.h);
      const turned = autoRotate ? Math.min(cw / ref.h, ch / ref.w) : 0;
      // Only turn pages when it is a real win — a few percent is not worth making
      // every label sideways on the packing table.
      const useTurn = turned > flat * ROTATE_GAIN;
      const scale = useTurn ? turned : flat;
      // On a near-tie prefer the grid whose shape matches the sheet's.
      const balance = -Math.abs(Math.log((cols / rows) * (H / W)));
      if (!best || scale > best.scale * 1.004 || (scale > best.scale * 0.996 && balance > best.balance))
        best = { W, H, cols, rows, cw, ch, scale, turn: useTurn, balance };
    }
    const { W, H, cols, rows, cw, ch } = best;

    const sheets = Math.ceil(total / n), count = maxSheets ? Math.min(sheets, maxSheets) : sheets;
    const out = await PDFDocument.create();
    const font = opts.numbers ? await out.embedFont(StandardFonts.Helvetica) : null;

    // Embed with an explicit bounding box. Without one pdf-lib clips to a box at the
    // origin with an identity matrix, which silently crops any page whose CropBox does
    // not start at (0,0) — e.g. anything that has been through a cropper.
    const take = Math.min(total, count * n);
    const srcPages = [], boxes = [];
    for (let i = 0; i < take; i++) {
      const p = srcLib.getPage(i), b = pageBox(p);
      srcPages.push(p); boxes.push({ left: b.left, bottom: b.bottom, right: b.right, top: b.top });
    }
    const embedded = await out.embedPages(srcPages, boxes);

    for (let s = 0; s < count; s++) {
      const page = out.addPage([W, H]);
      for (let k = 0; k < n; k++) {
        const pi = s * n + k; if (pi >= embedded.length) break;
        let r, c;
        if (opts.dir === 'col') { c = Math.floor(k / rows); r = k % rows; } else { r = Math.floor(k / cols); c = k % cols; }
        if (opts.rtl) c = cols - 1 - c;
        const x = ml + c * (cw + gap), y = H - mt - (r + 1) * ch - r * gap;
        const ep = embedded[pi];
        // /Rotate is clockwise, drawPage's rotate is counter-clockwise, hence 360 - rot.
        const rot = ((360 - pageBox(srcPages[pi]).rot) + (best.turn ? 90 : 0)) % 360;
        const dispW = rot % 180 ? ep.height : ep.width, dispH = rot % 180 ? ep.width : ep.height;
        const sc = opts.fill ? Math.max(cw / dispW, ch / dispH) : Math.min(cw / dispW, ch / dispH);
        const dw = dispW * sc, dh = dispH * sc;
        const dx = x + (cw - dw) / 2, dy = y + (ch - dh) / 2;
        if (opts.fill) page.pushOperators(pushGraphicsState(), rectangle(x, y, cw, ch), clip(), endPath());
        const o = { xScale: sc, yScale: sc, rotate: degrees(rot) };
        // Rotation happens about the anchor, so the anchor moves to whichever corner
        // ends up at the cell's bottom-left once the page has been turned.
        if (rot === 90) { o.x = dx + dw; o.y = dy; }
        else if (rot === 180) { o.x = dx + dw; o.y = dy + dh; }
        else if (rot === 270) { o.x = dx; o.y = dy + dh; }
        else { o.x = dx; o.y = dy; }
        page.drawPage(ep, o);
        if (opts.fill) page.pushOperators(popGraphicsState());
        if (opts.border) page.drawRectangle({ x, y, width: cw, height: ch, borderColor: rgb(0.45, 0.45, 0.45), borderWidth: 0.5 });
        if (font) page.drawText(String(pi + 1), { x: x + 3, y: y + 3, size: 7, font, color: rgb(0.4, 0.4, 0.4) });
      }
    }
    return { bytes: await out.save(), sheets, W, H, grid: { cols, rows }, rotated: best.turn };
  };

  // Render first N pages of PDF bytes as thumbnails into container.
  const renderThumbs = async (bytes, container, { count = 8, width = 160, captions = [] } = {}) => {
    container.innerHTML = '';
    const doc = await openPdf(bytes);
    const n = Math.min(count, doc.numPages);
    for (let i = 1; i <= n; i++) {
      const { canvas } = await renderPage(doc, i, { width });
      const d = document.createElement('div'); d.className = 'th'; d.appendChild(canvas);
      const cap = document.createElement('div'); cap.className = 'cap'; cap.textContent = captions[i - 1] || `Page ${i}`; d.appendChild(cap);
      container.appendChild(d);
    }
    doc.destroy();
  };

  // File list UI (shared by multi-file tools)
  const fileList = (container, files, { onRemove, tags = [], meta = [], draggable = true } = {}) => {
    container.innerHTML = files.map((f, i) => `<div class="file-row" draggable="${draggable}" data-i="${i}">
      ${draggable ? '<svg class="ic grip" aria-hidden="true"><use href="#i-grip"/></svg>' : ''}
      <span class="name" title="${f.name}">${f.name}</span>
      ${tags[i] ? `<span class="tag">${tags[i]}</span>` : ''}
      <span class="meta">${meta[i] || S.fmtBytes(f.size)}</span>
      <button class="x" data-rm="${i}" aria-label="Remove ${f.name}"><svg class="ic ic-sm"><use href="#i-x"/></svg></button></div>`).join('');
    container.querySelectorAll('[data-rm]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); onRemove?.(+b.dataset.rm); }));
  };

  Object.assign(S, { lib, loadLibs, mm2pt, pt2mm, PAPER, readFile, openPdf, renderPage, pageText, detectMarket, detectCourier, analyzePage, buildLabels, nup, renderThumbs, fileList });
})();
