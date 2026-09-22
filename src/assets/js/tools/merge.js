/* merge.js — combine PDFs in chosen order */
(() => {
  const S = window.SKUD, { $, $$ } = S;
  const ui = $('.tool-ui'); if (!ui) return;
  let files = []; // {file, bytes, pages}
  S.dropzone('#drop', '#file', async (list) => {
    for (const f of list) { const bytes = await S.readFile(f); let pages = '?'; try { const d = await S.openPdf(bytes); pages = d.numPages; d.destroy(); } catch {} files.push({ file: f, bytes, pages }); }
    render();
  }, { accept: (f) => /pdf$/i.test(f.name) || f.type === 'application/pdf' });
  function render() {
    S.fileList($('#files'), files.map((f) => f.file), { meta: files.map((f) => `${f.pages} p · ${S.fmtBytes(f.file.size)}`), onRemove: (i) => { files.splice(i, 1); render(); } });
    S.sortable($('#files'), '.file-row', () => { files = $$('.file-row', $('#files')).map((r) => files[+r.dataset.i]); render(); $('input[name=order][value=manual]').checked = true; });
    $('#mopts').hidden = files.length < 1; $('#run').disabled = files.length < 2;
    S.status(files.length ? `${files.length} files · ${files.reduce((n, f) => n + (+f.pages || 0), 0)} pages` : '');
  }
  $$('input[name=order]').forEach((r) => r.addEventListener('change', () => {
    if (r.value === 'name') files.sort((a, b) => a.file.name.localeCompare(b.file.name, undefined, { numeric: true }));
    if (r.value === 'date') files.sort((a, b) => a.file.lastModified - b.file.lastModified);
    render();
  }));
  $('#run').addEventListener('click', async () => {
    $('#run').disabled = true; S.status('Merging…');
    try {
      const { PDFDocument } = await S.lib('pdflib'); const out = await PDFDocument.create();
      for (const f of files) { const d = await PDFDocument.load(f.bytes, { ignoreEncryption: true }); const ps = await out.copyPages(d, d.getPageIndices()); ps.forEach((p) => out.addPage(p)); }
      const bytes = await out.save(); S.download(new Blob([bytes], { type: 'application/pdf' }), 'merged.pdf'); S.status(`Merged ${files.length} files · ${out.getPageCount()} pages`, 'ok'); S.toast('Merged PDF downloaded');
    } catch (e) { S.status('Failed: ' + e.message, 'err'); }
    $('#run').disabled = false;
  });
})();
