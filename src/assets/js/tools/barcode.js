/* barcode.js — single/bulk barcodes, PNG/SVG, PDF label sheets */
(() => {
  const S = window.SKUD, { $, $$ } = S;
  const ui = $('.tool-ui'); if (!ui) return;
  const pv = $('#bcpreview'); let t;
  const SHEETS = { 65: { cols: 5, rows: 13, w: 38.1, h: 21.2, top: 10.7, left: 4.65, px: 40.64, py: 21.2 }, 40: { cols: 4, rows: 10, w: 52.5, h: 29.7, top: 0, left: 0, px: 52.5, py: 29.7 }, 24: { cols: 3, rows: 8, w: 70, h: 37, top: 0.5, left: 0, px: 70, py: 37 }, 12: { cols: 2, rows: 6, w: 105, h: 49.5, top: 0, left: 0, px: 105, py: 49.5 }, '4x6': { cols: 1, rows: 1, w: 101.6, h: 152.4, top: 0, left: 0, px: 0, py: 0, paper: '4x6' } };
  const opts = () => ({ type: $('#type').value, bw: +$('#bw').value || 2, bh: +$('#bh').value || 60, fs: +$('#fs').value || 14, show: $('#showval').checked, cap: $('#copies').checked });
  const values = () => { const mode = $('input[name=mode]:checked').value; const raw = mode === 'single' ? [$('#value').value] : $('#values').value.split('\n'); return raw.map((l) => l.trim()).filter(Boolean).map((l) => { const [v, c] = l.split('|').map((s) => s.trim()); return { v, c: c || '' }; }); };
  async function render() {
    const JsBarcode = await S.lib('jsbarcode'); const o = opts(); const list = values().slice(0, 60); pv.innerHTML = '';
    if (!list.length) { pv.innerHTML = '<p class="muted">Enter a value to preview.</p>'; return; }
    for (const { v, c } of list) {
      const d = document.createElement('div'); d.className = 'bc-item'; if (c && o.cap) { const cap = document.createElement('div'); cap.textContent = c; cap.style.fontWeight = '600'; d.appendChild(cap); }
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); d.appendChild(svg); let ok = true;
      try { JsBarcode(svg, v, { format: o.type, width: o.bw, height: o.bh, displayValue: o.show, fontSize: o.fs, margin: 6, valid: (x) => (ok = x) }); } catch { ok = false; }
      if (!ok) { svg.remove(); const e = document.createElement('div'); e.className = 'bc-err'; e.textContent = `“${v}” is not valid for ${o.type}`; d.appendChild(e); }
      pv.appendChild(d);
    }
    if (values().length > 60) pv.insertAdjacentHTML('beforeend', `<p class="muted">+${values().length - 60} more (all included in the sheet)</p>`);
  }
  ui.addEventListener('input', () => { clearTimeout(t); t = setTimeout(render, 150); }); render();
  // Render one barcode (with caption) to a canvas at scale k
  async function toCanvas({ v, c }, o, k = 3) {
    const JsBarcode = await S.lib('jsbarcode'); const bc = document.createElement('canvas');
    JsBarcode(bc, v, { format: o.type, width: o.bw * k, height: o.bh * k, displayValue: o.show, fontSize: o.fs * k, margin: 4 * k, valid: () => {} });
    if (!c || !o.cap) return bc;
    const capH = Math.round(o.fs * 1.5 * k); const out = document.createElement('canvas'); out.width = Math.max(bc.width, 40); out.height = bc.height + capH; const ctx = out.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, out.width, out.height);
    ctx.fillStyle = '#000'; ctx.font = `600 ${o.fs * k}px Helvetica, Arial, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(c, out.width / 2, capH / 2, out.width - 8); ctx.drawImage(bc, (out.width - bc.width) / 2, capH); return out;
  }
  $('#png').addEventListener('click', async () => { const [first] = values(); if (!first) return; const c = await toCanvas(first, opts()); c.toBlob((b) => S.download(b, `barcode-${first.v}.png`)); });
  $('#svg').addEventListener('click', async () => { const [first] = values(); if (!first) return; const JsBarcode = await S.lib('jsbarcode'); const o = opts(); const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); JsBarcode(svg, first.v, { format: o.type, width: o.bw, height: o.bh, displayValue: o.show, fontSize: o.fs, margin: 6, valid: () => {} }); svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); S.download(new Blob([svg.outerHTML], { type: 'image/svg+xml' }), `barcode-${first.v}.svg`); });
  $('#sheetbtn').addEventListener('click', async () => {
    const list = values(); if (!list.length) return; $('#sheetbtn').disabled = true; S.status('Building sheet…');
    try {
      const { PDFDocument, rgb } = await S.lib('pdflib'); const o = opts(); const L = SHEETS[$('#sheet').value]; const copies = Math.max(1, +$('#ncopies').value || 1);
      const [PW, PH] = S.PAPER[L.paper || 'A4']; const out = await PDFDocument.create(); const per = L.cols * L.rows; let page = null, k = 0;
      const all = list.flatMap((x) => Array(copies).fill(x));
      for (let i = 0; i < all.length; i++) {
        const cv = await toCanvas(all[i], o, 3); const png = await out.embedPng(await new Promise((r) => cv.toBlob(r, 'image/png')).then((b) => b.arrayBuffer()));
        const slot = k % per; if (slot === 0) page = out.addPage([PW, PH]);
        const c = slot % L.cols, r = Math.floor(slot / L.cols);
        const x = S.mm2pt(L.left + c * L.px), yTop = S.mm2pt(L.top + r * L.py), w = S.mm2pt(L.w), h = S.mm2pt(L.h); const pad = S.mm2pt(1.5);
        const s = Math.min((w - 2 * pad) / png.width, (h - 2 * pad) / png.height); const dw = png.width * s, dh = png.height * s;
        page.drawImage(png, { x: x + (w - dw) / 2, y: PH - yTop - h + (h - dh) / 2, width: dw, height: dh });
        k++; if (i % 20 === 0) S.status(`Placing ${i + 1}/${all.length}…`);
      }
      S.download(new Blob([await out.save()], { type: 'application/pdf' }), `barcodes-${all.length}.pdf`); S.status(`Done · ${all.length} labels on ${out.getPageCount()} sheet${out.getPageCount() > 1 ? 's' : ''}`, 'ok'); S.toast('Sheet downloaded');
    } catch (e) { S.status('Failed: ' + e.message, 'err'); }
    $('#sheetbtn').disabled = false;
  });
})();
