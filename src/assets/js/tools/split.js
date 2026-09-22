/* split.js — extract ranges / every N / single pages (ZIP) */
(() => {
  const S = window.SKUD, { $, $$ } = S;
  const ui = $('.tool-ui'); if (!ui) return;
  let file, bytes, total = 0;
  S.dropzone('#drop', '#file', async ([f]) => {
    try { file = f; bytes = await S.readFile(f); const d = await S.openPdf(bytes); total = d.numPages; d.destroy(); $('#sopts').hidden = false; $('#run').disabled = false; $('#sinfo').textContent = `${total} pages in ${f.name}`; $('#ranges').placeholder = `1-${Math.min(3, total)}, ${Math.min(5, total)}`; S.fileList($('#files'), [f], { draggable: false, meta: [`${total} p`], onRemove: () => location.reload() }); }
    catch (e) { S.status('Could not open PDF: ' + e.message, 'err'); }
  }, { accept: (f) => /pdf$/i.test(f.name) || f.type === 'application/pdf' });
  const pad = (n, w = 3) => String(n).padStart(w, '0');
  $('#run').addEventListener('click', async () => {
    $('#run').disabled = true; S.status('Splitting…');
    try {
      const { PDFDocument } = await S.lib('pdflib'); const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const base = S.baseName(file.name); const mode = $('input[name=mode]:checked').value;
      const make = async (idx) => { const d = await PDFDocument.create(); const ps = await d.copyPages(src, idx); ps.forEach((p) => d.addPage(p)); return d.save(); };
      const parts = []; // {name, idx}
      if (mode === 'ranges') {
        const str = $('#ranges').value.trim(); if (!str) throw new Error('Enter the pages to extract');
        if ($('#separate').checked) str.split(',').map((s) => s.trim()).filter(Boolean).forEach((seg) => { const idx = S.parseRanges(seg, total); if (idx.length) parts.push({ name: `${base}-pages-${seg.replace(/\s/g, '')}.pdf`, idx: idx.map((p) => p - 1) }); });
        else { const idx = S.parseRanges(str, total); if (!idx.length) throw new Error('No valid pages in that range'); parts.push({ name: `${base}-pages-${str.replace(/\s/g, '')}.pdf`, idx: idx.map((p) => p - 1) }); }
      } else if (mode === 'every') {
        const n = Math.max(1, +$('#every').value || 1); for (let s = 0, k = 1; s < total; s += n, k++) parts.push({ name: `${base}-part-${pad(k, 2)}.pdf`, idx: [...Array(Math.min(n, total - s)).keys()].map((i) => s + i) });
      } else for (let i = 0; i < total; i++) parts.push({ name: `${base}-page-${pad(i + 1)}.pdf`, idx: [i] });
      if (parts.length === 1) { const b = await make(parts[0].idx); S.download(new Blob([b], { type: 'application/pdf' }), parts[0].name); }
      else { const JSZip = await S.lib('jszip'); const zip = new JSZip(); for (let i = 0; i < parts.length; i++) { S.status(`Writing ${i + 1}/${parts.length}…`); zip.file(parts[i].name, await make(parts[i].idx)); } S.download(await zip.generateAsync({ type: 'blob' }), `${base}-split.zip`); }
      S.status(`Done · ${parts.length} file${parts.length > 1 ? 's' : ''}`, 'ok'); S.toast('Download started');
    } catch (e) { S.status(e.message, 'err'); }
    $('#run').disabled = false;
  });
})();
