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
    const list = [], map = S.skuMap.all();
    files.forEach((f, fi) => f.pages.forEach((p, pi) => {
      if (p.empty) return;
      if (p.isInvoicePage && o.invoice === 'without') return;
      const box = o.invoice === 'with' ? p.fullBox : (p.labelBox || p.fullBox);
      // Your own SKU codes (SKU Mapping tool) replace marketplace SKUs for sorting and the stamp.
      const m = { ...(p.ref || p) }; m.sku = S.mapSku(map, m.sku);
      const stamp = o.stamp && !p.isInvoicePage ? `SKU ${S.mapSku(map, p.sku) || '—'}   QTY ${p.qty}${p.size ? '   ' + p.size : ''}${p.color ? '   ' + p.color : ''}` : null;
      const key = keyOf(m, o.sort);
      list.push({ src: f.lib, idx: pi, box, stamp, key, seq: list.length, courier: m.courier, sku: m.sku, invoice: !!p.isInvoicePage });
      // Separate pages: the invoice cut from the same page follows its label as its own page.
      if (o.invoice === 'split' && p.invoiceBox) list.push({ src: f.lib, idx: pi, box: p.invoiceBox, stamp: null, key, seq: list.length, courier: m.courier, sku: m.sku, invoice: true });
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
    const map = S.skuMap.all(), mapped = new Set(labels.map((p) => p.sku).filter((k) => map[k]?.code)).size;
    S.status(`${labels.length} labels found${inv ? ` · ${inv} invoice page${inv > 1 ? 's' : ''}` : ''}${labels.filter((p) => p.sku).length ? ` · ${new Set(labels.map((p) => p.sku).filter(Boolean)).size} SKUs` : ''}${mapped ? ` · ${mapped} mapped to your SKUs` : ''}${cs ? ' · ' + cs : ''}`, 'ok');
  }
  function schedulePreview() { clearTimeout(previewT); previewT = setTimeout(renderPreview, 150); }
  async function renderPreview() {
    if (!files.length) { preview.hidden = true; return; }
    const o = opt(); const list = entries(o); if (!list.length) { preview.hidden = true; return; }
    try {
      const bytes = await S.buildLabels(list, o, { limit: o.layout === 'thermal' ? 8 : 8 });
      preview.hidden = false;
      const caps = o.layout === 'thermal' ? list.slice(0, 8).map((e) => e.invoice ? 'Invoice' : e.sku ? `${e.sku} · ${e.courier}` : e.courier) : [];
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
      const name = `${base}-cropped-${suffix}${o.invoice === 'split' ? '-invoice-pages' : ''}${o.sort !== 'none' ? '-by-' + o.sort : ''}.pdf`;
      const blob = new Blob([bytes], { type: 'application/pdf' });
      S.download(blob, name);
      if (S.history.enabled) {
        const labels = list.filter((e) => !e.invoice).length;
        const summary = [{ thermal: o.size === '4x6' ? 'Thermal 4×6' : 'Thermal', a4x4: 'A4 · 4 per sheet', a4x2: 'A4 · 2 per sheet' }[o.layout], { without: 'without invoice', with: 'with invoice', split: 'invoice on separate pages' }[o.invoice], o.sort !== 'none' ? `sorted by ${o.sort === 'qty' ? 'quantity' : o.sort === 'sku' ? 'SKU' : o.sort}` : ''].filter(Boolean).join(' · ');
        S.history.add({ name, tool: TOOL, labels, pages: list.length, summary, size: blob.size, blob }).then(renderHistory).catch(() => S.toast('Could not save to history: browser storage may be full', 'err'));
      }
      S.status(`Done · ${list.length} pages in ${((performance.now() - t0) / 1000).toFixed(1)}s · nothing was uploaded`, 'ok');
      S.toast('Cropped PDF downloaded');
    } catch (e) { console.error(e); S.status('Failed: ' + e.message, 'err'); }
    busy = false; run.disabled = false;
  });

  // ── processing history (stored in this browser by engine.js) ──────
  const TOOL = { meesho: 'Meesho', flipkart: 'Flipkart', shopsy: 'Shopsy', amazon: 'Amazon' }[market] || 'Universal';
  const esc = (v) => String(v ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const when = (t) => new Date(t).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
  async function renderHistory() {
    const box = $('#histlist'); if (!box) return;
    $('#histon').checked = S.history.enabled;
    let list = []; try { list = await S.history.list(); } catch {}
    $('#histclear').hidden = !list.length;
    box.innerHTML = list.length
      ? list.map((r) => `<li data-id="${esc(r.id)}"><div class="h-main"><b>${esc(r.name)}</b><span class="muted">${when(r.t)} · ${esc(r.tool)} · ${r.labels} label${r.labels === 1 ? '' : 's'} · ${esc(r.summary)} · ${S.fmtBytes(r.size)}</span></div><div class="btns"><button class="btn btn-sm" type="button" data-act="dl">Download</button><button class="btn-icon del" type="button" data-act="rm" aria-label="Delete ${esc(r.name)}" title="Delete">×</button></div></li>`).join('')
      : `<li class="muted empty">${S.history.enabled ? 'No processing history yet. Files you crop here appear in this list, so you can download them again without re-cropping.' : 'History is off. Switch on “Keep on this device” to keep your cropped files here.'}</li>`;
  }
  $('#histlist')?.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const id = b.closest('li').dataset.id;
    try {
      if (b.dataset.act === 'dl') { const r = await S.history.get(id); if (r) S.download(r.blob, r.name); else S.toast('That file has expired', 'err'); }
      else { await S.history.remove(id); }
    } catch { S.toast('History is not available in this browser', 'err'); }
    renderHistory();
  });
  $('#histclear')?.addEventListener('click', async () => {
    if (!confirm('Delete every cropped file saved in this browser’s processing history?')) return;
    try { await S.history.clear(); } catch {} renderHistory();
  });
  $('#histon')?.addEventListener('change', async (e) => {
    if (e.target.checked) { S.history.enabled = true; return renderHistory(); }
    if (!confirm('Stop keeping history and delete the cropped files saved in this browser?')) { e.target.checked = true; return; }
    S.history.enabled = false; try { await S.history.clear(); } catch {} renderHistory();
  });
  renderHistory();

  // Accept a file handed over from the home page smart drop zone.
  addEventListener('load', async () => {
    try {
      const db = await new Promise((res, rej) => { const r = indexedDB.open('skud', 1); r.onupgradeneeded = () => r.result.createObjectStore('handoff'); r.onsuccess = () => res(r.result); r.onerror = rej; });
      const tx = db.transaction('handoff', 'readwrite'); const st = tx.objectStore('handoff'); const g = st.get('file');
      g.onsuccess = () => { const v = g.result; st.delete('file'); if (v && Date.now() - v.t < 60000) addFiles([new File([v.bytes], v.name, { type: 'application/pdf' })]); };
    } catch {}
  });
})();
