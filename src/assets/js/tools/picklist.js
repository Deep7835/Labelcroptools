/* picklist.js — SKU-wise picklist from label PDFs */
(() => {
  const S = window.SKUD, { $, $$ } = S;
  const ui = $('.tool-ui'); if (!ui) return;
  let files = [], rows = new Map(), orders = new Set(), couriers = {}, nLabels = 0, invoices = [];
  // Your own SKU codes and short names (SKU Mapping tool), kept in this browser.
  let map = S.skuMap.all();
  const nameOf = (r) => [...r.mskus].map((k) => map[k]?.name).find(Boolean) || r.desc || '';
  const saveName = (r, name) => {
    r.mskus.forEach((k) => { if (k === '(no SKU)') return; const e = (map[k] ||= {}); if (name && name !== r.desc) e.name = name; else delete e.name; if (!e.code && !e.name && !e.market) delete map[k]; });
    S.skuMap.save(map);
  };
  const esc = (v) => String(v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  S.dropzone('#drop', '#file', addFiles, { accept: (f) => /pdf$/i.test(f.name) || f.type === 'application/pdf' });
  async function addFiles(list) {
    map = S.skuMap.all();
    for (const f of list) {
      const bytes = await S.readFile(f); const doc = await S.openPdf(bytes);
      for (let i = 1; i <= doc.numPages; i++) {
        S.status(`Reading ${f.name} · page ${i}/${doc.numPages}`);
        const p = await S.analyzePage(doc, i, 'auto'); if (p.isInvoicePage) invoices.push(p.invoiceLines); if (p.empty || p.isInvoicePage) continue;
        if (p.orderNo) { if (orders.has(p.orderNo)) continue; orders.add(p.orderNo); }
        nLabels++; couriers[p.courier] = (couriers[p.courier] || 0) + 1;
        const recs = p.rows.length ? p.rows : [{ sku: '', qty: '1', desc: p.desc }];
        for (const r of recs) {
          const msku = r.sku || '(no SKU)', code = S.mapSku(map, r.sku) || '(no SKU)', qty = parseInt(r.qty, 10) || 1;
          // A mapped SKU groups on your code alone: the same product listed on several
          // marketplaces becomes one pick row even though only Meesho prints size and colour.
          const mapped = code !== msku;
          const key = mapped ? `${code}||` : [code, r.size || '', r.color || ''].join('|');
          const cur = rows.get(key) || { key, sku: code, mapped, mskus: new Set(), size: r.size || '', color: r.color || '', orders: 0, units: 0, couriers: {}, desc: r.desc || '' };
          cur.mskus.add(msku); cur.size ||= r.size || ''; cur.color ||= r.color || '';
          if (!cur.desc && r.desc) cur.desc = r.desc; cur.orders++; cur.units += qty; cur.couriers[p.courier] = (cur.couriers[p.courier] || 0) + 1; rows.set(key, cur);
        }
      }
      files.push(f); doc.destroy();
    }
    // Amazon prints the product title only on the invoice page that follows the label.
    rows.forEach((r) => { if (!r.desc) r.desc = [...r.mskus].filter((k) => k !== '(no SKU)').map((k) => invoices.map((l) => S.invoiceNameForSku(l, k)).find(Boolean)).find(Boolean) || ''; });
    S.fileList($('#files'), files, { draggable: false, onRemove: () => { files = []; invoices = []; rows = new Map(); orders = new Set(); couriers = {}; nLabels = 0; $('#files').innerHTML = ''; render(); S.toast('Cleared — add files again'); } });
    const nMapped = [...rows.values()].filter((r) => r.mapped).length;
    render(); S.status(`${nLabels} labels read · ${rows.size} SKU rows${nMapped ? ` · ${nMapped} using your SKU codes` : ''}`, 'ok');
  }
  function render() {
    const has = rows.size > 0; $('#stats').hidden = !has; $('#tablewrap').hidden = !has; if (!has) return;
    const units = [...rows.values()].reduce((n, r) => n + r.units, 0);
    $('#stats').innerHTML = [['Labels', nLabels], ['Units to pick', units], ['SKU rows', rows.size], ['Couriers', Object.keys(couriers).length]].map(([l, v]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`).join('');
    const q = $('#q').value.trim().toLowerCase();
    const list = [...rows.values()].filter((r) => !q || `${r.sku} ${[...r.mskus].join(' ')} ${nameOf(r)} ${r.size} ${r.color}`.toLowerCase().includes(q)).sort((a, b) => b.units - a.units || a.sku.localeCompare(b.sku));
    $('#tbl tbody').innerHTML = list.map((r, i) => {
      const from = r.mapped ? `<div class="muted msku">${[...r.mskus].map(esc).join(', ')}</div>` : '';
      const name = r.sku === '(no SKU)' ? esc(r.desc) : `<span class="pn-print">${esc(nameOf(r))}</span><input type="text" value="${esc(nameOf(r))}" placeholder="Add product name" aria-label="Product name for ${esc(r.sku)}" title="${esc(nameOf(r))}">`;
      return `<tr data-k="${esc(r.key)}" data-sku="${esc(r.sku)}" class="${r.picked ? 'picked' : ''}"><td>${i + 1}</td><td><b>${esc(r.sku)}</b>${from}</td><td class="pname">${name}</td><td>${esc(r.size)}</td><td>${esc(r.color)}</td><td class="r">${r.orders}</td><td class="r"><b>${r.units}</b></td><td>${Object.entries(r.couriers).map(([k, v]) => `${k} ${v}`).join(', ')}</td><td><input type="checkbox" ${r.picked ? 'checked' : ''} aria-label="Picked"></td></tr>`;
    }).join('');
    $('#couriers').innerHTML = Object.entries(couriers).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<span class="chip">${k}: <b>${v}</b></span>`).join('');
  }
  $('#q').addEventListener('input', render);
  $('#tbl').addEventListener('change', (e) => {
    const tr = e.target.closest('tr'); const r = tr && rows.get(tr.dataset.k); if (!r) return;
    if (e.target.type === 'text') {
      const v = e.target.value.trim(); saveName(r, v);
      // Size and colour variants share the SKU's name, so update their rows too.
      $$('#tbl tbody tr').filter((row) => row.dataset.sku === r.sku).forEach((row) => { const i = row.querySelector('.pname input'); const rr = rows.get(row.dataset.k); if (i && rr) { i.value = nameOf(rr); i.title = i.value; row.querySelector('.pn-print').textContent = i.value; } });
      return;
    }
    r.picked = e.target.checked; tr.classList.toggle('picked', r.picked);
  });
  $('#allpick').addEventListener('change', (e) => { rows.forEach((r) => (r.picked = e.target.checked)); render(); });
  $('#csv').addEventListener('click', () => {
    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const lines = [['SKU', 'Marketplace SKUs', 'Product', 'Size', 'Colour', 'Orders', 'Units', 'Couriers'].join(',')];
    [...rows.values()].sort((a, b) => b.units - a.units).forEach((r) => lines.push([r.sku, [...r.mskus].join('; '), nameOf(r), r.size, r.color, r.orders, r.units, Object.entries(r.couriers).map(([k, v]) => `${k} ${v}`).join('; ')].map(esc).join(',')));
    S.download(new Blob(['﻿' + lines.join('\n')], { type: 'text/csv' }), `picklist-${new Date().toISOString().slice(0, 10)}.csv`);
  });
  $('#print').addEventListener('click', () => print());
})();
