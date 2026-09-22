/* thankyou.js — thank-you card designer (canvas @300dpi) + A4 PDF sheet */
(() => {
  const S = window.SKUD, { $ } = S;
  const ui = $('.tool-ui'); if (!ui) return;
  const cv = $('#card'), ctx = cv.getContext('2d'); let t, qrCache = { key: '', qr: null };
  const SIZES = { bc: { w: 88.9, h: 50.8, cols: 2, rows: 5 }, a7: { w: 105, h: 74, cols: 2, rows: 4 }, a6: { w: 105, h: 148, cols: 2, rows: 2 } };
  const px = (mm) => Math.round(mm / 25.4 * 300);
  const val = (id) => $('#' + id).value.trim();
  const qrData = () => { const k = $('#qrkind').value; if (k === 'wa') { const n = val('wa').replace(/\D/g, ''); return n ? `https://wa.me/${n}` : ''; } if (k === 'ig') { const h = val('ig').replace(/^@/, ''); return h ? `https://instagram.com/${h}` : ''; } if (k === 'web') { const w = val('web'); return w ? (/^https?:/.test(w) ? w : 'https://' + w) : ''; } return ''; };
  const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const isLight = (h) => { const [r, g, b] = hexToRgb(h); return (r * 299 + g * 587 + b * 114) / 1000 > 150; };
  function wrap(text, maxW, font) { ctx.font = font; const words = text.split(/\s+/); const lines = []; let cur = ''; for (const w of words) { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; } if (cur) lines.push(cur); return lines; }
  async function drawQR(x, y, size, fg, bg) {
    const data = qrData(); if (!data) return false; const qrcode = await S.lib('qrcode');
    if (qrCache.key !== data) { const q = qrcode(0, 'M'); q.addData(data); q.make(); qrCache = { key: data, qr: q }; }
    const q = qrCache.qr, n = q.getModuleCount(), cell = size / (n + 2); ctx.fillStyle = bg; ctx.fillRect(x, y, size, size); ctx.fillStyle = fg;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) ctx.fillRect(x + (c + 1) * cell, y + (r + 1) * cell, Math.ceil(cell), Math.ceil(cell));
    return true;
  }
  async function draw() {
    await document.fonts.load('800 40px "Bricolage Grotesque"'); await document.fonts.load('500 20px "Instrument Sans"'); await document.fonts.load('600 20px "IBM Plex Mono"');
    const sz = SIZES[$('#size').value]; const W = px(sz.w), H = px(sz.h); cv.width = W; cv.height = H;
    const tpl = $('input[name=tpl]:checked').value, accent = $('#accent').value, brand = val('brand') || 'Your Brand', head = val('headline') || 'Thank you!', msg = val('msg'), ig = val('ig').replace(/^@/, ''), wa = val('wa'), web = val('web'), cta = val('cta');
    const portrait = H > W; const ink = '#12110F', paper = '#FFFDF7';
    const S_ = W / 1050, P = 60 * S_;
    const onAccentInk = isLight(accent) ? ink : '#fff';
    const hasQR = $('#qrkind').value !== 'none' && !!qrData();
    const textX = tpl === 'minimal' ? P + 26 * S_ : P, textW = W - textX - P;
    // measure header (brand + headline)
    const brandF = `600 ${Math.round(24 * S_)}px "IBM Plex Mono", monospace`;
    const hFont = `800 ${Math.round((portrait ? 72 : 60) * S_)}px "Bricolage Grotesque", sans-serif`, hLH = (portrait ? 76 : 64) * S_;
    const hLines = wrap(head, textW, hFont).slice(0, 2);
    const headerH = P + 34 * S_ + hLines.length * hLH + 16 * S_;
    // background + template chrome
    ctx.fillStyle = paper; ctx.fillRect(0, 0, W, H);
    if (tpl === 'bold') { ctx.fillStyle = accent; ctx.fillRect(0, 0, W, headerH); }
    if (tpl === 'elegant') { ctx.strokeStyle = accent; ctx.lineWidth = 6 * S_; ctx.strokeRect(P * 0.45, P * 0.45, W - P * 0.9, H - P * 0.9); ctx.lineWidth = 2 * S_; ctx.strokeRect(P * 0.45 + 12 * S_, P * 0.45 + 12 * S_, W - P * 0.9 - 24 * S_, H - P * 0.9 - 24 * S_); }
    if (tpl === 'playful') { ctx.fillStyle = accent; ctx.globalAlpha = 0.28; for (let i = 0; i < 16; i++) { ctx.beginPath(); ctx.arc((i * 173 + 40) % W, (i * 97 + 30) % H, (8 + (i % 4) * 6) * S_, 0, Math.PI * 2); ctx.fill(); } ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(W - P * 0.8, P * 0.8, 70 * S_, 0, Math.PI * 2); ctx.fill(); }
    if (tpl === 'minimal') { ctx.fillStyle = accent; ctx.fillRect(0, 0, 22 * S_, H); }
    // header text
    let y = P; ctx.textBaseline = 'top'; ctx.textAlign = 'left';
    ctx.fillStyle = tpl === 'bold' ? onAccentInk : (isLight(accent) ? ink : accent); ctx.font = brandF; ctx.fillText(brand.toUpperCase(), textX, y, textW); y += 34 * S_;
    ctx.fillStyle = tpl === 'bold' ? onAccentInk : ink; ctx.font = hFont; for (const ln of hLines) { ctx.fillText(ln, textX, y); y += hLH; }
    y = headerH + 12 * S_;
    // lower region: message (left) + QR (right, landscape) or QR bottom-right (portrait)
    const footerH = 30 * S_; const lowerH = H - headerH - P - footerH;
    let qrSize = 0, qx = 0, qy = 0;
    if (hasQR) { qrSize = portrait ? Math.round(Math.min(W * 0.46, lowerH * 0.55)) : Math.round(Math.min(lowerH - 26 * S_, H * 0.4, W * 0.28)); qx = portrait ? Math.round((W - qrSize) / 2) : W - P - qrSize; qy = portrait ? H - P - footerH - qrSize - 40 * S_ : headerH + 8 * S_ + Math.max(0, (lowerH - qrSize - 26 * S_) / 2); }
    const bodyW = hasQR && !portrait ? qx - 30 * S_ - textX : textW;
    const mFont = `500 ${Math.round((portrait ? 30 : 25) * S_)}px "Instrument Sans", sans-serif`, mLH = (portrait ? 40 : 33) * S_;
    ctx.fillStyle = ink; ctx.font = mFont; const maxLines = Math.max(1, Math.floor((H - P - footerH - y - (portrait && hasQR ? qrSize + 40 * S_ : 0)) / mLH));
    for (const ln of wrap(msg, bodyW, mFont).slice(0, maxLines)) { ctx.fillText(ln, textX, y); y += mLH; }
    // footer handles
    const handles = [ig ? '@' + ig : '', wa ? '+' + wa.replace(/^\+/, '') : '', web].filter(Boolean).join('   ·   ');
    ctx.font = `600 ${Math.round(20 * S_)}px "IBM Plex Mono", monospace`; ctx.fillStyle = ink; ctx.textBaseline = 'alphabetic'; ctx.fillText(handles, textX, H - P, hasQR && !portrait ? bodyW : textW);
    // QR
    if (hasQR) {
      ctx.fillStyle = '#fff'; ctx.fillRect(qx - 8 * S_, qy - 8 * S_, qrSize + 16 * S_, qrSize + 16 * S_); ctx.strokeStyle = ink; ctx.lineWidth = 3 * S_; ctx.strokeRect(qx - 8 * S_, qy - 8 * S_, qrSize + 16 * S_, qrSize + 16 * S_);
      await drawQR(qx, qy, qrSize, ink, '#fff');
      if (cta) { ctx.font = `600 ${Math.round(16 * S_)}px "Instrument Sans", sans-serif`; ctx.fillStyle = ink; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillText(cta, qx + qrSize / 2, qy + qrSize + 14 * S_, qrSize + 60 * S_); ctx.textAlign = 'left'; }
    }
  }
  ui.addEventListener('input', () => { clearTimeout(t); t = setTimeout(draw, 120); }); draw();
  $('#png').addEventListener('click', () => cv.toBlob((b) => S.download(b, 'thank-you-card.png')));
  $('#pdf').addEventListener('click', async () => {
    $('#pdf').disabled = true; S.status('Building sheet…');
    try {
      await draw(); const { PDFDocument, rgb } = await S.lib('pdflib'); const out = await PDFDocument.create(); const sz = SIZES[$('#size').value];
      const png = await out.embedPng(await new Promise((r) => cv.toBlob(r, 'image/png')).then((b) => b.arrayBuffer()));
      const [PW, PH] = S.PAPER.A4; const w = S.mm2pt(sz.w), h = S.mm2pt(sz.h); const gx = (PW - sz.cols * w) / 2, gy = (PH - sz.rows * h) / 2; const page = out.addPage([PW, PH]);
      for (let r = 0; r < sz.rows; r++) for (let c = 0; c < sz.cols; c++) { const x = gx + c * w, y = PH - gy - (r + 1) * h; page.drawImage(png, { x, y, width: w, height: h }); if ($('#cut').checked) page.drawRectangle({ x, y, width: w, height: h, borderColor: rgb(0.7, 0.7, 0.7), borderWidth: 0.4, borderDashArray: [3, 3] }); }
      S.download(new Blob([await out.save()], { type: 'application/pdf' }), `thank-you-cards-${sz.cols * sz.rows}-per-A4.pdf`); S.status(`Done · ${sz.cols * sz.rows} cards per sheet`, 'ok'); S.toast('PDF downloaded');
    } catch (e) { S.status('Failed: ' + e.message, 'err'); }
    $('#pdf').disabled = false;
  });
})();
