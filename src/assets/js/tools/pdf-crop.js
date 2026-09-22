/* pdf-crop.js — drag-to-crop with per-page or global crop box (PDF user space) */
(() => {
  const S = window.SKUD, { $, $$ } = S;
  const ui = $('.tool-ui'); if (!ui) return;
  const wrap = $('#wrap'), cv = $('#cv'), box = $('#box'), run = $('#run'), stage = $('#stage');
  let file, bytes, doc, lib, cur = 1, zoom = 1, vp = null, boxes = {}, globalBox = null, view = null;
  const inner = document.createElement('div'); inner.className = 'crop-inner'; wrap.appendChild(inner); inner.appendChild(cv); inner.appendChild(box); box.tabIndex = 0;
  const scope = () => $('input[name=scope]:checked').value;
  const pageBox = () => (scope() === 'current' ? boxes[cur] : globalBox) || { x0: view[0], y0: view[1], x1: view[2], y1: view[3] };
  const setPageBox = (b) => { if (scope() === 'current') boxes[cur] = b; else globalBox = b; };

  S.dropzone('#drop', '#file', async ([f]) => {
    try {
      S.status('Opening…'); file = f; bytes = await S.readFile(f); doc = await S.openPdf(bytes);
      const { PDFDocument } = await S.lib('pdflib'); lib = await PDFDocument.load(bytes, { ignoreEncryption: true });
      boxes = {}; globalBox = null; cur = 1; zoom = 1; $('#pc').textContent = doc.numPages; $('#pg').max = doc.numPages;
      stage.hidden = false; $('#drop').hidden = true; await render(); run.disabled = false; S.status(`${doc.numPages} page${doc.numPages > 1 ? 's' : ''} · drag the box to crop`, 'ok');
    } catch (e) { S.status('Could not open PDF: ' + e.message, 'err'); }
  }, { accept: (f) => /pdf$/i.test(f.name) || f.type === 'application/pdf' });

  async function render() {
    const page = await doc.getPage(cur); view = page.view;
    const fit = Math.min(1.6, (wrap.clientWidth - 44) / page.getViewport({ scale: 1 }).width);
    ({ viewport: vp } = await S.renderPage(doc, cur, { scale: fit * zoom, canvas: cv }));
    $('#pg').value = cur; $('#zoom').textContent = Math.round(zoom * 100) + '%'; placeBox();
  }
  // PDF box → screen rect
  const toScreen = (b) => { const [ax, ay] = vp.convertToViewportPoint(b.x0, b.y1), [bx, by] = vp.convertToViewportPoint(b.x1, b.y0); return { l: Math.min(ax, bx), t: Math.min(ay, by), w: Math.abs(bx - ax), h: Math.abs(by - ay) }; };
  const toPdf = (r) => { const [x0, y0] = vp.convertToPdfPoint(r.l, r.t), [x1, y1] = vp.convertToPdfPoint(r.l + r.w, r.t + r.h); return { x0: Math.min(x0, x1), y0: Math.min(y0, y1), x1: Math.max(x0, x1), y1: Math.max(y0, y1) }; };
  function placeBox() {
    const r = toScreen(pageBox()); Object.assign(box.style, { left: r.l + 'px', top: r.t + 'px', width: r.w + 'px', height: r.h + 'px' }); dims();
  }
  function dims() {
    const b = pageBox(); const w = S.pt2mm(b.x1 - b.x0), h = S.pt2mm(b.y1 - b.y0);
    $('#dims').textContent = `Crop: ${w.toFixed(1)} × ${h.toFixed(1)} mm  (${(w / 25.4).toFixed(2)} × ${(h / 25.4).toFixed(2)} in) · page ${S.pt2mm(view[2] - view[0]).toFixed(0)} × ${S.pt2mm(view[3] - view[1]).toFixed(0)} mm`;
    if (!$('#exact').hidden) { $('#mx').value = S.pt2mm(b.x0 - view[0]).toFixed(1); $('#my').value = S.pt2mm(view[3] - b.y1).toFixed(1); $('#mw').value = w.toFixed(1); $('#mh').value = h.toFixed(1); }
  }
  // pointer interactions
  let drag = null;
  const rectNow = () => ({ l: parseFloat(box.style.left), t: parseFloat(box.style.top), w: parseFloat(box.style.width), h: parseFloat(box.style.height) });
  box.addEventListener('pointerdown', (e) => { e.preventDefault(); box.setPointerCapture(e.pointerId); drag = { h: e.target.dataset.h || 'move', x: e.clientX, y: e.clientY, r: rectNow() }; });
  box.addEventListener('pointermove', (e) => {
    if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; let { l, t, w, h } = drag.r; const W = cv.width, H = cv.height, MIN = 16;
    const k = drag.h;
    if (k === 'move') { l = Math.max(0, Math.min(W - w, l + dx)); t = Math.max(0, Math.min(H - h, t + dy)); }
    else {
      if (k.includes('e')) w = Math.max(MIN, Math.min(W - l, w + dx));
      if (k.includes('s')) h = Math.max(MIN, Math.min(H - t, h + dy));
      if (k.includes('w')) { const nl = Math.max(0, Math.min(l + w - MIN, l + dx)); w += l - nl; l = nl; }
      if (k.includes('n')) { const nt = Math.max(0, Math.min(t + h - MIN, t + dy)); h += t - nt; t = nt; }
    }
    Object.assign(box.style, { left: l + 'px', top: t + 'px', width: w + 'px', height: h + 'px' }); setPageBox(toPdf({ l, t, w, h })); dims();
  });
  box.addEventListener('pointerup', () => (drag = null)); box.addEventListener('pointercancel', () => (drag = null));
  box.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 10 : 1; const r = rectNow(); const m = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key]; if (!m) return; e.preventDefault();
    r.l = Math.max(0, Math.min(cv.width - r.w, r.l + m[0])); r.t = Math.max(0, Math.min(cv.height - r.h, r.t + m[1])); setPageBox(toPdf(r)); placeBox();
  });
  // nav & zoom
  const go = (n) => { cur = Math.max(1, Math.min(doc.numPages, n)); render(); };
  $('#prev').addEventListener('click', () => go(cur - 1)); $('#next').addEventListener('click', () => go(cur + 1));
  $('#pg').addEventListener('change', (e) => go(+e.target.value || 1));
  $('#zin').addEventListener('click', () => { zoom = Math.min(3, zoom * 1.25); render(); }); $('#zout').addEventListener('click', () => { zoom = Math.max(0.4, zoom / 1.25); render(); });
  $$('input[name=scope]').forEach((r) => r.addEventListener('change', placeBox));
  $('#reset').addEventListener('click', () => { boxes = {}; globalBox = null; placeBox(); });
  $('#exact').closest('.chks').querySelector('input').addEventListener('change', (e) => { $('#exact').hidden = !e.target.checked; dims(); });
  ['mx', 'my', 'mw', 'mh'].forEach((id) => $('#' + id).addEventListener('change', () => {
    const x0 = view[0] + S.mm2pt(+$('#mx').value), y1 = view[3] - S.mm2pt(+$('#my').value), w = S.mm2pt(+$('#mw').value), h = S.mm2pt(+$('#mh').value);
    setPageBox({ x0: Math.max(view[0], x0), y0: Math.max(view[1], y1 - h), x1: Math.min(view[2], x0 + w), y1: Math.min(view[3], y1) }); placeBox();
  }));
  addEventListener('resize', () => { if (doc) render(); });

  run.addEventListener('click', async () => {
    if (!lib) return; run.disabled = true; S.status('Cropping…');
    try {
      const pages = lib.getPages();
      pages.forEach((p, i) => {
        const b = scope() === 'current' ? boxes[i + 1] : globalBox; if (!b) return;
        const mb = p.getMediaBox(); const x0 = Math.max(mb.x, b.x0), y0 = Math.max(mb.y, b.y0), x1 = Math.min(mb.x + mb.width, b.x1), y1 = Math.min(mb.y + mb.height, b.y1);
        if (x1 - x0 < 4 || y1 - y0 < 4) return;
        p.setMediaBox(x0, y0, x1 - x0, y1 - y0); p.setCropBox(x0, y0, x1 - x0, y1 - y0);
      });
      const out = await lib.save(); S.download(new Blob([out], { type: 'application/pdf' }), S.baseName(file.name) + '-cropped.pdf');
      S.status('Cropped PDF downloaded', 'ok'); S.toast('Cropped PDF downloaded');
      const { PDFDocument } = await S.lib('pdflib'); lib = await PDFDocument.load(bytes, { ignoreEncryption: true }); // reload pristine for further edits
    } catch (e) { S.status('Failed: ' + e.message, 'err'); }
    run.disabled = false;
  });
})();
