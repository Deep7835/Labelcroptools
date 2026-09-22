/* rotate.js — rotate / delete / reorder pages with thumbnails */
(() => {
  const S = window.SKUD, { $, $$ } = S;
  const ui = $('.tool-ui'); if (!ui) return;
  let file, bytes, doc, pages = []; // {i, rot, del}
  const grid = $('#pages');
  S.dropzone('#drop', '#file', async ([f]) => {
    try {
      file = f; bytes = await S.readFile(f); doc = await S.openPdf(bytes); pages = [...Array(doc.numPages).keys()].map((i) => ({ i, rot: 0, del: false }));
      $('#rtools').hidden = false; $('#drop').hidden = true; $('#run').disabled = false; info(); await thumbs();
    } catch (e) { S.status('Could not open PDF: ' + e.message, 'err'); }
  }, { accept: (f) => /pdf$/i.test(f.name) || f.type === 'application/pdf' });
  const info = () => { $('#rinfo').textContent = `${pages.length} pages · ${pages.filter((p) => p.del).length} to delete · ${pages.filter((p) => p.rot).length} rotated`; };
  async function thumbs() {
    grid.innerHTML = pages.map((p, k) => `<div class="pg" draggable="true" data-i="${p.i}"><canvas></canvas><div class="pg-n">${p.i + 1}</div><div class="pg-btns">
      <button data-a="ccw" title="Rotate −90°" aria-label="Rotate left"><svg class="ic ic-sm"><use href="#i-rotateccw"/></svg></button>
      <button data-a="cw" title="Rotate 90°" aria-label="Rotate right"><svg class="ic ic-sm"><use href="#i-rotate"/></svg></button>
      <button data-a="del" title="Delete page" aria-label="Delete page"><svg class="ic ic-sm"><use href="#i-trash"/></svg></button></div></div>`).join('');
    S.sortable(grid, '.pg', () => { const order = $$('.pg', grid).map((el) => +el.dataset.i); pages = order.map((i) => pages.find((p) => p.i === i)); info(); });
    for (const el of $$('.pg', grid)) { const p = pages.find((x) => x.i === +el.dataset.i); await S.renderPage(doc, p.i + 1, { width: 240, canvas: el.querySelector('canvas') }); }
  }
  const apply = (el, p) => { el.querySelector('canvas').style.transform = `rotate(${p.rot}deg)`; el.classList.toggle('deleted', p.del); info(); };
  grid.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return; const el = b.closest('.pg'); const p = pages.find((x) => x.i === +el.dataset.i);
    if (b.dataset.a === 'cw') p.rot = (p.rot + 90) % 360; else if (b.dataset.a === 'ccw') p.rot = (p.rot + 270) % 360; else p.del = !p.del; apply(el, p);
  });
  $('#rall').addEventListener('click', () => { pages.forEach((p) => (p.rot = (p.rot + 90) % 360)); $$('.pg', grid).forEach((el) => apply(el, pages.find((x) => x.i === +el.dataset.i))); });
  $('#rallccw').addEventListener('click', () => { pages.forEach((p) => (p.rot = (p.rot + 270) % 360)); $$('.pg', grid).forEach((el) => apply(el, pages.find((x) => x.i === +el.dataset.i))); });
  $('#revert').addEventListener('click', () => { pages = [...Array(doc.numPages).keys()].map((i) => ({ i, rot: 0, del: false })); thumbs(); info(); });
  $('#run').addEventListener('click', async () => {
    $('#run').disabled = true; S.status('Saving…');
    try {
      const { PDFDocument, degrees } = await S.lib('pdflib'); const src = await PDFDocument.load(bytes, { ignoreEncryption: true }); const out = await PDFDocument.create();
      const keep = pages.filter((p) => !p.del); if (!keep.length) throw new Error('All pages are marked for deletion');
      const copied = await out.copyPages(src, keep.map((p) => p.i));
      copied.forEach((pg, k) => { const p = keep[k]; if (p.rot) pg.setRotation(degrees((pg.getRotation().angle + p.rot) % 360)); out.addPage(pg); });
      S.download(new Blob([await out.save()], { type: 'application/pdf' }), S.baseName(file.name) + '-edited.pdf'); S.status(`Saved ${keep.length} pages`, 'ok'); S.toast('PDF downloaded');
    } catch (e) { S.status(e.message, 'err'); }
    $('#run').disabled = false;
  });
})();
