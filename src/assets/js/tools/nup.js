/* nup.js — multiple pages per sheet with exact live preview */
(() => {
  const S = window.SKUD, { $, $$ } = S;
  const ui = $('.tool-ui'); if (!ui) return;
  let file, lib, total = 0, t, gen = 0;
  const opts = () => ({ n: +$('#n').value, paper: $('#paper').value, orient: $('input[name=orient]:checked').value, dir: $('input[name=dir]:checked').value, rtl: $('input[name=ltr]:checked').value === 'rtl',
    mt: +$('#mt').value || 0, mr: +$('#mr').value || 0, mb: +$('#mb').value || 0, ml: +$('#ml').value || 0, gap: +$('#gap').value || 0, border: $('#border').checked, fill: $('#fill').checked, numbers: $('#numbers').checked, autoRotate: $('#autorotate').checked });
  S.dropzone('#drop', '#file', async ([f]) => {
    try {
      S.status('Opening…'); file = f; const bytes = await S.readFile(f); const { PDFDocument } = await S.lib('pdflib'); lib = await PDFDocument.load(bytes, { ignoreEncryption: true }); total = lib.getPageCount();
      $('#nupui').hidden = false; $('#drop').hidden = true; $('#run').disabled = false; preview();
    } catch (e) { S.status('Could not open PDF: ' + e.message, 'err'); }
  }, { accept: (f) => /pdf$/i.test(f.name) || f.type === 'application/pdf' });
  ui.addEventListener('input', () => { clearTimeout(t); t = setTimeout(preview, 200); });
  async function preview() {
    if (!lib) return; const g = ++gen;
    try {
      const o = opts(); const { bytes, sheets, W, H, grid, rotated } = await S.nup(lib, o, { maxSheets: 1 });
      if (g !== gen) return;
      const doc = await S.openPdf(bytes); const width = Math.min($('#sheet').clientWidth - 32, 560);
      const { canvas } = await S.renderPage(doc, 1, { width: W > H ? width : Math.round(width * 0.8) }); doc.destroy();
      if (g !== gen) return;
      const pv = $('#pv'); pv.width = canvas.width; pv.height = canvas.height; pv.getContext('2d').drawImage(canvas, 0, 0);
      $('#nupinfo').textContent = `${total} pages → ${sheets} sheet${sheets > 1 ? 's' : ''} · ${o.paper} ${W > H ? 'landscape' : 'portrait'} · grid ${grid.cols} × ${grid.rows}${rotated ? ' · pages rotated 90° to fit' : ''}`;
      S.status('');
    } catch (e) { console.error(e); S.status('Preview failed: ' + e.message, 'err'); }
  }
  $('#run').addEventListener('click', async () => {
    if (!lib) return; $('#run').disabled = true; S.status('Building…');
    try { const o = opts(); const { bytes, sheets } = await S.nup(lib, o); S.download(new Blob([bytes], { type: 'application/pdf' }), `${S.baseName(file.name)}-${o.n}up.pdf`); S.status(`Done · ${sheets} sheets`, 'ok'); S.toast('PDF downloaded'); }
    catch (e) { S.status('Failed: ' + e.message, 'err'); }
    $('#run').disabled = false;
  });
})();
