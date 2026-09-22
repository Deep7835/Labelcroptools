/* pdf2img.js — PDF pages → JPG/PNG (ZIP for many) */
(() => {
  const S = window.SKUD, { $ } = S;
  const ui = $('.tool-ui'); if (!ui) return;
  let file, doc;
  S.dropzone('#drop', '#file', async ([f]) => {
    try { file = f; doc = await S.openPdf(await S.readFile(f)); $('#popts').hidden = false; $('#run').disabled = false; $('#pinfo').textContent = `${doc.numPages} pages`; S.fileList($('#files'), [f], { draggable: false, meta: [`${doc.numPages} p`], onRemove: () => location.reload() }); }
    catch (e) { S.status('Could not open PDF: ' + e.message, 'err'); }
  }, { accept: (f) => /pdf$/i.test(f.name) || f.type === 'application/pdf' });
  $('#run').addEventListener('click', async () => {
    $('#run').disabled = true;
    try {
      const fmt = $('input[name=fmt]:checked').value, dpi = +$('input[name=dpi]:checked').value, ext = fmt === 'png' ? 'png' : 'jpg';
      const pages = $('#pages').value.trim() ? S.parseRanges($('#pages').value, doc.numPages) : [...Array(doc.numPages).keys()].map((i) => i + 1);
      if (!pages.length) throw new Error('No valid pages');
      const base = S.baseName(file.name); const blobs = [];
      for (let k = 0; k < pages.length; k++) {
        S.status(`Rendering page ${pages[k]} (${k + 1}/${pages.length})…`);
        const { canvas } = await S.renderPage(doc, pages[k], { scale: dpi / 72 });
        blobs.push({ name: `${base}-page-${String(pages[k]).padStart(3, '0')}.${ext}`, blob: await new Promise((r) => canvas.toBlob(r, 'image/' + fmt, 0.92)) });
      }
      if (blobs.length === 1) S.download(blobs[0].blob, blobs[0].name);
      else { const JSZip = await S.lib('jszip'); const zip = new JSZip(); blobs.forEach((b) => zip.file(b.name, b.blob)); S.download(await zip.generateAsync({ type: 'blob' }), `${base}-images.zip`); }
      S.status(`Done · ${blobs.length} image${blobs.length > 1 ? 's' : ''} at ${dpi} DPI`, 'ok'); S.toast('Download started');
    } catch (e) { S.status(e.message, 'err'); }
    $('#run').disabled = false;
  });
})();
