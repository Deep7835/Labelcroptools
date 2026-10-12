/* mapping.js — SKU mapping: marketplace SKUs → your own SKU codes and short product names */
(() => {
  const S = window.SKUD, { $ } = S;
  const ui = $('.tool-ui'); if (!ui) return;
  let map = S.skuMap.all();
  const esc = (v) => String(v ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const save = () => S.skuMap.save(map);
  const MARKETS = { meesho: 'Meesho', flipkart: 'Flipkart', amazon: 'Amazon' };

  // ── read SKUs (and product names) from label PDFs ──────────────────
  S.dropzone('#drop', '#file', addFiles, { accept: (f) => /pdf$/i.test(f.name) || f.type === 'application/pdf' });
  async function addFiles(list) {
    map = S.skuMap.all();
    let seen = 0, added = 0;
    for (const f of list) {
      const doc = await S.openPdf(await S.readFile(f)); const found = new Map(), inv = [];
      for (let i = 1; i <= doc.numPages; i++) {
        S.status(`Reading ${f.name} · page ${i}/${doc.numPages}`);
        const p = await S.analyzePage(doc, i, 'auto');
        if (p.isInvoicePage) { inv.push(p.invoiceLines); continue; }
        if (p.empty) continue;
        for (const r of p.rows) {
          if (!r.sku) continue;
          const v = found.get(r.sku) || { name: '', market: p.market }; if (!v.name && r.desc) v.name = r.desc; found.set(r.sku, v);
        }
      }
      for (const [sku, v] of found) {
        if (!v.name) v.name = inv.map((l) => S.invoiceNameForSku(l, sku)).find(Boolean) || '';
        const market = MARKETS[v.market] || '';
        seen++;
        if (!map[sku]) { map[sku] = { code: '', name: v.name, market }; added++; }
        else { map[sku].market ||= market; if (!map[sku].name && v.name) map[sku].name = v.name; }
      }
      doc.destroy();
    }
    save(); render();
    S.status(`${seen} SKU${seen === 1 ? '' : 's'} read · ${added} new · type your own codes in the table below`, 'ok');
  }

  // ── table ──────────────────────────────────────────────────────────
  function render() {
    const all = Object.entries(map);
    const mapped = all.filter(([, e]) => e.code).length;
    $('#stats').innerHTML = [['Marketplace SKUs', all.length], ['Mapped', mapped], ['Still to map', all.length - mapped], ['Your SKU codes', new Set(all.map(([, e]) => e.code).filter(Boolean)).size]]
      .map(([l, v]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`).join('');
    const q = $('#q').value.trim().toLowerCase(), todo = $('#todo').checked;
    const list = all.filter(([k, e]) => (!todo || !e.code) && (!q || `${k} ${e.code || ''} ${e.name || ''} ${e.market || ''}`.toLowerCase().includes(q)))
      .sort(([a, x], [b, y]) => (!!x.code - !!y.code) || (x.code || '').localeCompare(y.code || '') || a.localeCompare(b));
    $('#tbl tbody').innerHTML = list.map(([k, e]) => `<tr data-k="${esc(k)}">
      <td><b>${esc(k)}</b>${e.market ? `<div class="muted msku">${esc(e.market)}</div>` : ''}</td>
      <td><input type="text" data-f="code" list="codes" value="${esc(e.code)}" placeholder="Your SKU" aria-label="Your SKU for ${esc(k)}" autocomplete="off" spellcheck="false"></td>
      <td class="pname"><input type="text" data-f="name" value="${esc(e.name)}" placeholder="Short product name" aria-label="Product name for ${esc(k)}"></td>
      <td><button class="btn-icon del" type="button" aria-label="Remove ${esc(k)}" title="Remove">×</button></td></tr>`).join('');
    $('#empty').hidden = all.length > 0;
    $('#tablewrap').hidden = all.length === 0;
    // Codes already in use, offered as suggestions while typing.
    $('#codes').innerHTML = [...new Set(all.map(([, e]) => e.code).filter(Boolean))].sort().map((c) => `<option value="${esc(c)}">`).join('');
  }
  $('#tbl').addEventListener('change', (e) => {
    const tr = e.target.closest('tr'), f = e.target.dataset.f; if (!tr || !f) return;
    const k = tr.dataset.k; map[k] ||= {}; map[k][f] = e.target.value.trim(); save();
    if (f === 'code') render();
  });
  $('#tbl').addEventListener('click', (e) => {
    const b = e.target.closest('.del'); if (!b) return;
    delete map[b.closest('tr').dataset.k]; save(); render();
  });
  $('#q').addEventListener('input', render);
  $('#todo').addEventListener('change', render);

  // ── add one by hand ────────────────────────────────────────────────
  $('#addform').addEventListener('submit', (e) => {
    e.preventDefault();
    const k = $('#new-msku').value.trim(); if (!k) return;
    map[k] = { ...(map[k] || {}), code: $('#new-code').value.trim(), name: $('#new-name').value.trim() || map[k]?.name || '' };
    save(); render(); e.target.reset(); $('#new-msku').focus();
  });

  // ── CSV import / export ────────────────────────────────────────────
  const parseCsv = (text) => {
    const out = []; let row = [], cell = '', q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
      else if (c === '"') q = true;
      else if (c === ',' || c === '\t') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); out.push(row); row = []; cell = ''; }
      else cell += c;
    }
    if (cell || row.length) { row.push(cell); out.push(row); }
    return out.map((r) => r.map((c) => c.trim())).filter((r) => r.some(Boolean));
  };
  $('#importbtn').addEventListener('click', () => $('#csvfile').click());
  $('#csvfile').addEventListener('change', async (e) => {
    const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    const rowsIn = parseCsv((await f.text()).replace(/^﻿/, ''));
    if (!rowsIn.length) return S.toast('That CSV is empty', 'err');
    // Header names decide the columns when present; otherwise: marketplace SKU, your SKU, name.
    let cols = { msku: 0, code: 1, name: 2, market: 3 }, start = 0;
    const h = rowsIn[0].map((c) => c.toLowerCase());
    // A header cell is a column name like "Your SKU" or "Product name", not a value that
    // merely contains "sku" (NEW-SKU-1 is data).
    const HEAD = /^((marketplace|seller|channel|listing|your|my|internal|warehouse|master)\s*)?(sku|sku\s*id|sku\s*code|code)$|^(product\s*)?(name|title)$|^product$|^(marketplace|channel|platform)$/;
    if (h.some((c) => HEAD.test(c))) {
      const find = (re, not) => h.findIndex((c) => re.test(c) && !(not && not.test(c)));
      cols = { msku: find(/marketplace|channel|seller sku|listing/), code: find(/your|internal|warehouse|master|my sku|^code$/), name: find(/name|product|title/), market: find(/^marketplace$|^channel$|platform/, /sku/) };
      if (cols.msku < 0) cols.msku = 0; if (cols.code < 0) cols.code = 1; start = 1;
    }
    let n = 0;
    for (const r of rowsIn.slice(start)) {
      const k = r[cols.msku]; if (!k) continue;
      const e2 = (map[k] ||= {});
      if (r[cols.code]) e2.code = r[cols.code];
      if (cols.name >= 0 && r[cols.name]) e2.name = r[cols.name];
      if (cols.market >= 0 && r[cols.market]) e2.market = r[cols.market];
      n++;
    }
    save(); render(); S.toast(`${n} mapping${n === 1 ? '' : 's'} imported`);
  });
  $('#exportbtn').addEventListener('click', () => {
    const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [['Marketplace SKU', 'Your SKU', 'Product name', 'Marketplace'].join(',')];
    Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).forEach(([k, e]) => lines.push([k, e.code, e.name, e.market].map(q).join(',')));
    S.download(new Blob(['﻿' + lines.join('\n')], { type: 'text/csv' }), `sku-mapping-${new Date().toISOString().slice(0, 10)}.csv`);
  });
  $('#clearbtn').addEventListener('click', () => {
    if (!Object.keys(map).length || !confirm('Remove every SKU mapping saved in this browser? Export a CSV first if you may need them again.')) return;
    map = {}; save(); render(); S.toast('All mappings removed');
  });

  render();
})();
