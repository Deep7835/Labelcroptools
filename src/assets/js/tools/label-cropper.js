/* label-cropper.js — Meesho / Flipkart / Amazon / auto label cropper */
(() => {
  const S = window.SKUD, { $, $$ } = S;
  const ui = $('.tool-ui'); if (!ui) return;
  const market = ui.dataset.market || 'auto';
  const run = $('#run'), preview = $('#preview'), thumbs = $('#thumbs');
  let files = []; // {file, bytes, doc, lib, pages}
  let busy = false, previewT;
  const opt = () => ({
    invoice: $('input[name=invoice]:checked').value, layout: $('input[name=layout]:checked').value, size: $('input[name=size]:checked').value,
    sort: $('input[name=sort]:checked').value, stamp: $('#stamp').checked, border: $('#border').checked,
  });

  S.dropzone('#drop', '#file', addFiles, { accept: (f) => /pdf$/i.test(f.name) || f.type === 'application/pdf' });

  async function addFiles(list) {
    if (busy) return; busy = true; run.disabled = true;
    try {
      const { PDFDocument } = await S.lib('pdflib');
      for (const f of list) {
        const bytes = await S.readFile(f);
        const doc = await S.openPdf(bytes);
        const lib = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = []; let lastLabel = null;
        for (let i = 1; i <= doc.numPages; i++) {
          S.status(`Analysing ${f.name} · page ${i}/${doc.numPages}`);
          const p = await S.analyzePage(doc, i, market);
          if (p.isInvoicePage) p.ref = lastLabel; else lastLabel = p;
          pages.push(p);
        }
        files.push({ file: f, bytes, doc, lib, pages });
      }
      renderList(); summarize(); schedulePreview();
    } catch (e) { console.error(e); S.status('Could not read that PDF: ' + e.message, 'err'); }
    busy = false; run.disabled = !files.length;
  }
  function renderList() {
    const tags = files.map((f) => { const ms = [...new Set(f.pages.filter((p) => !p.empty && !p.isInvoicePage).map((p) => p.market))]; return ms.map((m) => m === 'unknown' ? 'generic' : m).join(' + ') || '—'; });
    const meta = files.map((f) => `${f.pages.filter((p) => !p.isInvoicePage && !p.empty).length} labels · ${f.doc.numPages} pages`);
    S.fileList($('#files'), files.map((f) => f.file), { tags, meta, onRemove: (i) => { files.splice(i, 1); renderList(); summarize(); schedulePreview(); run.disabled = !files.length; } });
    S.sortable($('#files'), '.file-row', () => { const order = $$('.file-row', $('#files')).map((r) => +r.dataset.i); files = order.map((i) => files[i]); renderList(); schedulePreview(); });
  }
  function entries(o) {
    const list = [];
    files.forEach((f, fi) => f.pages.forEach((p, pi) => {
      if (p.empty) return;
      if (p.isInvoicePage && o.invoice === 'without') return;
      const box = o.invoice === 'with' ? p.fullBox : (p.labelBox || p.fullBox);
      const m = p.ref || p;
      const stamp = o.stamp && !p.isInvoicePage ? `SKU ${p.sku || '—'}   QTY ${p.qty}${p.size ? '   ' + p.size : ''}${p.color ? '   ' + p.color : ''}` : null;
      list.push({ src: f.lib, idx: pi, box, stamp, key: keyOf(m, o.sort), seq: list.length, courier: m.courier, sku: m.sku });
    }));
    if (o.sort !== 'none') list.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : a.seq - b.seq));
    return list;
  }
  const keyOf = (p, sort) => sort === 'sku' ? (p.sku || '￿').toLowerCase().padEnd(40) : sort === 'courier' ? (p.courier === 'Other' ? '￿' : p.courier) + (p.sku || '') : sort === 'qty' ? String(999 - p.qty).padStart(3, '0') + (p.sku || '') : '';
  function summarize() {
    if (!files.length) { S.status(''); preview.hidden = true; return; }
    const all = files.flatMap((f) => f.pages).filter((p) => !p.empty);
    const labels = all.filter((p) => !p.isInvoicePage), inv = all.length - labels.length;
    const couriers = {}; labels.forEach((p) => (couriers[p.courier] = (couriers[p.courier] || 0) + 1));
    const cs = Object.entries(couriers).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · ');
    S.status(`${labels.length} labels found${inv ? ` · ${inv} invoice page${inv > 1 ? 's' : ''}` : ''}${labels.filter((p) => p.sku).length ? ` · ${new Set(labels.map((p) => p.sku).filter(Boolean)).size} SKUs` : ''}${cs ? ' · ' + cs : ''}`, 'ok');
  }
  function schedulePreview() { clearTimeout(previewT); previewT = setTimeout(renderPreview, 150); }
  async function renderPreview() {
    if (!files.length) { preview.hidden = true; return; }
    const o = opt(); const list = entries(o); if (!list.length) { preview.hidden = true; return; }
    try {
      const bytes = await S.buildLabels(list, o, { limit: o.layout === 'thermal' ? 8 : 8 });
      preview.hidden = false;
      const caps = o.layout === 'thermal' ? list.slice(0, 8).map((e) => e.sku ? `${e.sku} · ${e.courier}` : e.courier) : [];
      await S.renderThumbs(bytes, thumbs, { count: 8, width: 180, captions: caps });
    } catch (e) { console.error(e); }
  }
  ui.addEventListener('change', (e) => { if (e.target.matches('input')) schedulePreview(); });

  run.addEventListener('click', async () => {
    if (!files.length || busy) return; busy = true; run.disabled = true;
    const o = opt(); const list = entries(o);
    try {
      S.status(`Cropping ${list.length} pages…`);
      const t0 = performance.now();
      const bytes = await S.buildLabels(list, o);
      const base = files.length === 1 ? S.baseName(files[0].file.name) : 'labels';
      const suffix = o.layout === 'thermal' ? 'thermal' : o.layout === 'a4x4' ? 'A4-4up' : 'A4-2up';
      S.download(new Blob([bytes], { type: 'application/pdf' }), `${base}-cropped-${suffix}${o.sort !== 'none' ? '-by-' + o.sort : ''}.pdf`);
      S.status(`Done · ${list.length} labels in ${((performance.now() - t0) / 1000).toFixed(1)}s · nothing was uploaded`, 'ok');
      S.toast('Cropped PDF downloaded');
    } catch (e) { console.error(e); S.status('Failed: ' + e.message, 'err'); }
    busy = false; run.disabled = false;
  });

  // Accept a file handed over from the home page smart drop zone.
  addEventListener('load', async () => {
    try {
      const db = await new Promise((res, rej) => { const r = indexedDB.open('skud', 1); r.onupgradeneeded = () => r.result.createObjectStore('handoff'); r.onsuccess = () => res(r.result); r.onerror = rej; });
      const tx = db.transaction('handoff', 'readwrite'); const st = tx.objectStore('handoff'); const g = st.get('file');
      g.onsuccess = () => { const v = g.result; st.delete('file'); if (v && Date.now() - v.t < 60000) addFiles([new File([v.bytes], v.name, { type: 'application/pdf' })]); };
    } catch {}
  });
})();
