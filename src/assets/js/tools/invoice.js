/* invoice.js — GST invoice builder → PDF (pdf-lib) */
(() => {
  const S = window.SKUD, { $, $$ } = S;
  const ui = $('.tool-ui'); if (!ui) return;
  const SELLER = ['sname', 'sgstin', 'saddr', 'sstate', 'sstatecode', 'sphone', 'semail', 'bank', 'notes'];
  const saved = S.store.get('invoice:seller', {}); SELLER.forEach((id) => { if (saved[id] != null) $('#' + id).value = saved[id]; });
  const lastNo = S.store.get('invoice:lastno', ''); if (lastNo) { const m = lastNo.match(/^(.*?)(\d+)$/); $('#invno').value = m ? m[1] + String(+m[2] + 1).padStart(m[2].length, '0') : lastNo; }
  $('#invdate').value = new Date().toISOString().slice(0, 10);
  ui.addEventListener('input', (e) => { if (SELLER.includes(e.target.id)) { saved[e.target.id] = e.target.value; S.store.set('invoice:seller', saved); } summary(); });
  const tbody = $('#items tbody');
  let rowSeq = 0;
  const addRow = (r = {}) => { const tr = document.createElement('tr'); const rid = `item-${++rowSeq}`; tr.innerHTML = `<td></td><td><input type="text" class="d" id="${rid}" value="${r.d || ''}" placeholder="Item description" aria-label="Description"></td><td><input type="text" class="h" value="${r.h || ''}" placeholder="6109" style="width:80px" aria-label="HSN"></td><td><input type="number" class="q" value="${r.q ?? 1}" min="0" step="1" style="width:64px" aria-label="Qty"></td><td><input type="number" class="rt" value="${r.rt ?? ''}" min="0" step="0.01" style="width:90px" aria-label="Rate"></td><td><input type="number" class="dc" value="${r.dc ?? 0}" min="0" step="0.01" style="width:80px" aria-label="Discount"></td><td><input type="number" class="g" value="${r.g ?? 5}" min="0" step="0.01" style="width:70px" aria-label="GST %"></td><td class="r amt">0.00</td><td><button type="button" class="del" aria-label="Remove line"><svg class="ic ic-sm"><use href="#i-x"/></svg></button></td>`; tbody.appendChild(tr); renumber(); };
  const renumber = () => $$('tr', tbody).forEach((tr, i) => (tr.firstElementChild.textContent = i + 1));
  $('#additem').addEventListener('click', () => addRow()); tbody.addEventListener('click', (e) => { if (e.target.closest('.del')) { e.target.closest('tr').remove(); renumber(); summary(); } });
  addRow({ q: 1, g: 5 });
  const num = (el) => +el.value || 0;
  function compute() {
    const incl = $('#price').value === 'incl'; const lines = [];
    $$('tr', tbody).forEach((tr) => { const q = num($('.q', tr)), rt = num($('.rt', tr)), dc = num($('.dc', tr)), g = num($('.g', tr)); let gross = q * rt - dc; if (gross < 0) gross = 0; const taxable = incl ? gross / (1 + g / 100) : gross; const tax = taxable * g / 100; $('.amt', tr).textContent = (taxable + tax).toFixed(2); lines.push({ d: $('.d', tr).value.trim(), h: $('.h', tr).value.trim(), q, rt, dc, g, taxable, tax }); });
    const shipChg = num($('#shipchg')), shipG = num($('#shipgst')); if (shipChg > 0) { const taxable = incl ? shipChg / (1 + shipG / 100) : shipChg; lines.push({ d: 'Shipping & handling', h: '9965', q: 1, rt: taxable, dc: 0, g: shipG, taxable, tax: taxable * shipG / 100, ship: true }); }
    const sc = $('#sstatecode').value.trim(), bc = $('#bstatecode').value.trim(); const sup = $('#supply').value; const inter = sup === 'inter' || (sup === 'auto' && sc && bc && sc !== bc);
    const taxable = lines.reduce((n, l) => n + l.taxable, 0), tax = lines.reduce((n, l) => n + l.tax, 0); const gross = taxable + tax; const total = $('#roundoff').value === '1' ? Math.round(gross) : gross; const roundoff = total - gross;
    const byRate = {}; lines.forEach((l) => { const k = l.g; byRate[k] = byRate[k] || { taxable: 0, tax: 0 }; byRate[k].taxable += l.taxable; byRate[k].tax += l.tax; });
    return { lines, inter, taxable, tax, gross, total, roundoff, byRate };
  }
  function summary() { const c = compute(); const f = (n) => S.fmtINR(n); $('#invsummary').innerHTML = [['Taxable value', f(c.taxable)], c.inter ? ['IGST', f(c.tax)] : ['CGST', f(c.tax / 2)], c.inter ? null : ['SGST', f(c.tax / 2)], ['Round off', f(c.roundoff)], ['Invoice total', f(c.total)]].filter(Boolean).map(([l, v]) => `<div class="stat"><b style="font-size:1.2rem">${v}</b><span>${l}</span></div>`).join(''); }
  ui.addEventListener('change', summary); summary();
  // Indian number to words
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'], tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const two = (n) => (n < 20 ? ones[n] : tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : ''));
  const three = (n) => (n >= 100 ? ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + two(n % 100) : '') : two(n));
  const words = (n) => { n = Math.round(n); if (!n) return 'Zero'; const cr = Math.floor(n / 1e7), la = Math.floor((n % 1e7) / 1e5), th = Math.floor((n % 1e5) / 1000), rest = n % 1000; return [cr ? three(cr) + ' Crore' : '', la ? two(la) + ' Lakh' : '', th ? two(th) + ' Thousand' : '', rest ? three(rest) : ''].filter(Boolean).join(' '); };
  const amountWords = (n) => { const r = Math.floor(n), p = Math.round((n - r) * 100); return `Rupees ${words(r)}${p ? ' and ' + words(p) + ' Paise' : ''} Only`; };
  // Validate before building the PDF: a wrong GSTIN or a missing line makes the
  // invoice useless, and the failure is much cheaper to catch here than after printing.
  function validate() {
    let bad = 0;
    const req = (id, msg) => { bad += S.setError($('#' + id), $('#' + id).value.trim() ? '' : msg) ? 1 : 0; };
    req('sname', 'Enter your business name — it must appear on a tax invoice.');
    req('invno', 'Give the invoice a number.');
    req('bname', 'Enter the buyer’s name.');
    for (const id of ['sgstin', 'bgstin']) {
      const el = $('#' + id), v = el.value.trim();
      const needed = id === 'sgstin';
      if (!v) { bad += S.setError(el, needed ? 'A GSTIN is required on a tax invoice.' : '') ? 1 : 0; continue; }
      bad += S.setError(el, S.gstinValid(v) ? '' : 'That GSTIN is not valid — check the 15 characters and the last check digit.') ? 1 : 0;
    }
    for (const id of ['sstatecode', 'bstatecode']) {
      const el = $('#' + id), v = el.value.trim();
      bad += S.setError(el, !v || /^[0-9]{2}$/.test(v) ? '' : 'State code is two digits, e.g. 09.') ? 1 : 0;
    }
    const c = compute();
    const items = c.lines.filter((l) => !l.ship);
    const firstDesc = $('.d', tbody);
    bad += S.setError(firstDesc, items.some((l) => l.taxable > 0 && l.d) ? '' : 'Add at least one line with a description and a rate.') ? 1 : 0;
    return bad === 0;
  }
  $('#invform').addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid')) S.setError(e.target, ''); });

  $('#run').addEventListener('click', async () => {
    if (!validate()) { S.status('Please fix the highlighted fields.', 'err'); $('[aria-invalid]')?.focus(); return; }
    const c = compute();
    $('#run').disabled = true;
    try {
      const { PDFDocument, StandardFonts, rgb } = await S.lib('pdflib'); const doc = await PDFDocument.create(); const F = await doc.embedFont(StandardFonts.Helvetica), B = await doc.embedFont(StandardFonts.HelveticaBold);
      const [W, H] = S.PAPER.A4; let page = doc.addPage([W, H]); const M = 40; let y = H - M; const ink = rgb(0.07, 0.07, 0.06), grey = rgb(0.45, 0.45, 0.45), line = rgb(0.8, 0.8, 0.8);
      const clean = (s) => String(s || '').replace(/₹/g, 'Rs.').replace(/[–—]/g, '-').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/×/g, 'x').replace(/·/g, '-').replace(/…/g, '...').replace(/[^\x20-\x7E\n]/g, '');
      const txt = (s, x, yy, size = 9, font = F, color = ink, o = {}) => page.drawText(clean(s), { x, y: yy, size, font, color, ...o });
      const right = (s, xr, yy, size = 9, font = F, color = ink) => txt(s, xr - font.widthOfTextAtSize(clean(s), size), yy, size, font, color);
      const wrapT = (s, maxW, size, font = F) => { const out = []; for (const para of clean(s).split('\n')) { let cur = ''; for (const w of para.split(/\s+/)) { const t = cur ? cur + ' ' + w : w; if (font.widthOfTextAtSize(t, size) > maxW && cur) { out.push(cur); cur = w; } else cur = t; } out.push(cur); } return out; };
      const block = (lines, x, yy, size = 9, lh = 12, font = F, color = ink) => { lines.forEach((l, i) => txt(l, x, yy - i * lh, size, font, color)); return yy - lines.length * lh; };
      const money = (n) => 'Rs. ' + (Math.round(n * 100) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      // header
      txt('TAX INVOICE', M, y - 4, 16, B); right(c.inter ? 'Inter-state supply (IGST)' : 'Intra-state supply (CGST + SGST)', W - M, y, 8, F, grey); y -= 26;
      page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 1.2, color: ink }); y -= 16;
      // seller / invoice meta
      const sy = y; let y1 = block([$('#sname').value.trim()], M, y, 11, 14, B); y1 = block(wrapT($('#saddr').value, 240, 9), M, y1, 9, 12);
      y1 = block([`GSTIN: ${$('#sgstin').value.trim().toUpperCase() || '—'}`, `State: ${$('#sstate').value.trim()} (${$('#sstatecode').value.trim() || '—'})`, [$('#sphone').value.trim(), $('#semail').value.trim()].filter(Boolean).join('  ·  ')].filter((s) => s.trim() !== '' && s !== 'State:  (—)'), M, y1, 9, 12);
      const meta = [['Invoice No.', $('#invno').value.trim()], ['Invoice Date', new Date($('#invdate').value || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })], $('#orderno').value.trim() ? ['Order / PO No.', $('#orderno').value.trim()] : null, ['Place of Supply', $('#pos').value.trim() || $('#bstate').value.trim() || '—']].filter(Boolean);
      let y2 = sy; meta.forEach(([k, v]) => { txt(k, W - M - 200, y2, 8, F, grey); right(v, W - M, y2, 9, B); y2 -= 13; });
      y = Math.min(y1, y2) - 14;
      // buyer
      page.drawRectangle({ x: M, y: y - 6, width: W - 2 * M, height: 16, color: rgb(0.95, 0.94, 0.9) }); txt('BILL TO / SHIP TO', M + 6, y - 2, 8, B); y -= 22;
      y = block([$('#bname').value.trim() || 'Customer'], M, y, 10, 13, B); y = block(wrapT($('#baddr').value, 300, 9), M, y, 9, 12);
      y = block([$('#bgstin').value.trim() ? `GSTIN: ${$('#bgstin').value.trim().toUpperCase()}` : 'Unregistered (B2C)', [$('#bstate').value.trim() ? `State: ${$('#bstate').value.trim()} (${$('#bstatecode').value.trim() || '—'})` : '', $('#bphone').value.trim() ? `Phone: ${$('#bphone').value.trim()}` : ''].filter(Boolean).join('   ')].filter(Boolean), M, y, 9, 12); y -= 10;
      // table
      const cols = c.inter ? [['#', 18], ['Description', 150], ['HSN', 42], ['Qty', 30], ['Rate', 60], ['Taxable', 62], ['IGST %', 40], ['IGST', 55], ['Amount', 0]] : [['#', 18], ['Description', 128], ['HSN', 40], ['Qty', 26], ['Rate', 56], ['Taxable', 58], ['GST %', 34], ['CGST', 50], ['SGST', 50], ['Amount', 0]];
      const tw = W - 2 * M; cols[cols.length - 1][1] = tw - cols.slice(0, -1).reduce((n, cc) => n + cc[1], 0);
      const headRow = () => { page.drawRectangle({ x: M, y: y - 5, width: tw, height: 16, color: rgb(0.07, 0.07, 0.06) }); let x = M + 4; cols.forEach(([n, w], i) => { if (i >= 3) right(n, x + w - 8, y - 1, 7.5, B, rgb(1, 1, 1)); else txt(n, x, y - 1, 7.5, B, rgb(1, 1, 1)); x += w; }); y -= 20; };
      headRow();
      c.lines.forEach((l, i) => {
        const dl = wrapT(l.d || '—', cols[1][1] - 8, 8.5); const rh = Math.max(12, dl.length * 10 + 4);
        if (y - rh < 150) { page = doc.addPage([W, H]); y = H - M; headRow(); }
        let x = M + 4; const cells = c.inter ? [String(i + 1), null, l.h, String(l.q), money(l.rt), money(l.taxable), l.g + '%', money(l.tax), money(l.taxable + l.tax)] : [String(i + 1), null, l.h, String(l.q), money(l.rt), money(l.taxable), l.g + '%', money(l.tax / 2), money(l.tax / 2), money(l.taxable + l.tax)];
        cells.forEach((cell, k) => { const w = cols[k][1]; if (k === 1) block(dl, x, y, 8.5, 10); else if (k >= 3) right(cell, x + w - 8, y, 8.5); else txt(cell, x, y, 8.5); x += w; });
        y -= rh; page.drawLine({ start: { x: M, y: y + 4 }, end: { x: W - M, y: y + 4 }, thickness: 0.4, color: line });
      });
      y -= 8;
      // totals
      const tx = W - M - 220; const row = (k, v, bold) => { txt(k, tx, y, 9, bold ? B : F); right(v, W - M, y, 9, bold ? B : F); y -= 14; };
      row('Taxable value', money(c.taxable)); if (c.inter) row('IGST', money(c.tax)); else { row('CGST', money(c.tax / 2)); row('SGST / UTGST', money(c.tax / 2)); } if (Math.abs(c.roundoff) >= 0.005) row('Round off', money(c.roundoff));
      page.drawLine({ start: { x: tx, y: y + 10 }, end: { x: W - M, y: y + 10 }, thickness: 1, color: ink }); y -= 2; row('TOTAL', money(c.total), true);
      // tax summary by rate + words
      let ly = y + 14 * (c.inter ? 4 : 5) + 2; txt('Tax summary', M, ly, 8, B, grey); ly -= 12;
      Object.entries(c.byRate).sort((a, b) => +a[0] - +b[0]).forEach(([r, v]) => { txt(`${r}% on ${money(v.taxable)}  =  ${money(v.tax)}${c.inter ? ' IGST' : ` (CGST ${money(v.tax / 2)} + SGST ${money(v.tax / 2)})`}`, M, ly, 8); ly -= 11; });
      y -= 10; txt('Amount in words:', M, y, 8, F, grey); y -= 12; y = block(wrapT(amountWords(c.total), tw, 9, B), M, y, 9, 12, B); y -= 8;
      if ($('#bank').value.trim()) { txt('Bank / UPI details', M, y, 8, B, grey); y -= 11; y = block(wrapT($('#bank').value, 300, 8.5), M, y, 8.5, 11); y -= 6; }
      if ($('#notes').value.trim()) { txt('Notes', M, y, 8, B, grey); y -= 11; y = block(wrapT($('#notes').value, tw, 8), M, y, 8, 10); }
      // signature
      const sx = W - M - 180; right(`For ${$('#sname').value.trim()}`, W - M, Math.max(y - 30, 70), 9, B); page.drawLine({ start: { x: sx, y: Math.max(y - 62, 48) }, end: { x: W - M, y: Math.max(y - 62, 48) }, thickness: 0.5, color: grey }); right('Authorised Signatory', W - M, Math.max(y - 74, 36), 8, F, grey);
      txt('This is a computer-generated invoice.', M, 30, 7, F, grey);
      S.download(new Blob([await doc.save()], { type: 'application/pdf' }), `${$('#invno').value.trim().replace(/[^\w-]+/g, '_') || 'invoice'}.pdf`);
      S.store.set('invoice:lastno', $('#invno').value.trim()); S.status('Invoice PDF downloaded', 'ok'); S.toast('Invoice downloaded');
    } catch (e) { console.error(e); S.status('Failed: ' + e.message, 'err'); }
    $('#run').disabled = false;
  });
  $('#clearbuyer').addEventListener('click', () => { ['bname', 'bgstin', 'baddr', 'bstate', 'bstatecode', 'bphone', 'pos', 'orderno'].forEach((id) => ($('#' + id).value = '')); tbody.innerHTML = ''; addRow({ q: 1, g: 5 }); summary(); });
})();
