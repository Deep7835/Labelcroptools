/* img2pdf.js — images → PDF */
(() => {
  const S = window.SKUD, { $, $$ } = S;
  const ui = $('.tool-ui'); if (!ui) return;
  let files = [];
  S.dropzone('#drop', '#file', (list) => { files.push(...list); render(); }, { accept: (f) => /^image\//.test(f.type) });
  function render() {
    S.fileList($('#files'), files, { onRemove: (i) => { files.splice(i, 1); render(); } });
    S.sortable($('#files'), '.file-row', () => { files = $$('.file-row', $('#files')).map((r) => files[+r.dataset.i]); render(); });
    $('#iopts').hidden = !files.length; $('#run').disabled = !files.length; S.status(files.length ? `${files.length} image${files.length > 1 ? 's' : ''}` : '');
  }
  const loadBitmap = async (f) => { try { return await createImageBitmap(f, { imageOrientation: 'from-image' }); } catch { return createImageBitmap(f); } };
  $('#run').addEventListener('click', async () => {
    $('#run').disabled = true;
    try {
      const { PDFDocument } = await S.lib('pdflib'); const out = await PDFDocument.create();
      const mode = $('input[name=page]:checked').value, orient = $('input[name=orient]:checked').value, margin = S.mm2pt(+$('#margin').value || 0), q = (+$('#quality').value || 90) / 100;
      for (let i = 0; i < files.length; i++) {
        S.status(`Adding ${i + 1}/${files.length}…`);
        const bm = await loadBitmap(files[i]); const c = document.createElement('canvas'); c.width = bm.width; c.height = bm.height; const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(bm, 0, 0); bm.close?.();
        const blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', q)); const img = await out.embedJpg(await blob.arrayBuffer());
        let W, H; if (mode === 'fit') { W = img.width * 0.75 + 2 * margin; H = img.height * 0.75 + 2 * margin; } else { [W, H] = S.PAPER[mode]; const land = orient === 'landscape' || (orient === 'auto' && img.width > img.height); if (land) [W, H] = [H, W]; }
        const page = out.addPage([W, H]); const s = Math.min((W - 2 * margin) / img.width, (H - 2 * margin) / img.height); const dw = img.width * s, dh = img.height * s;
        page.drawImage(img, { x: (W - dw) / 2, y: (H - dh) / 2, width: dw, height: dh });
      }
      S.download(new Blob([await out.save()], { type: 'application/pdf' }), (files.length === 1 ? S.baseName(files[0].name) : 'images') + '.pdf'); S.status(`Done · ${files.length} pages`, 'ok'); S.toast('PDF downloaded');
    } catch (e) { S.status('Failed: ' + e.message, 'err'); }
    $('#run').disabled = false;
  });
})();
