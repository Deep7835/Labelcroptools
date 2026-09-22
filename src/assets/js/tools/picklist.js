/* picklist.js — SKU-wise picklist from label PDFs */
(() => {
  const S = window.SKUD, { $, $$ } = S;
  const ui = $('.tool-ui'); if (!ui) return;
  let files = [], rows = new Map(), orders = new Set(), couriers = {}, nLabels = 0;
  S.dropzone('#drop', '#file', addFiles, { accept: (f) => /pdf$/i.test(f.name) || f.type === 'application/pdf' });
  async function addFiles(list) {
    for (const f of list) {
      const bytes = await S.readFile(f); const doc = await S.openPdf(bytes);
      for (let i = 1; i <= doc.numPages; i++) {
        S.status(`Reading ${f.name} · page ${i}/${doc.numPages}`);
        const p = await S.analyzePage(doc, i, 'auto'); if (p.empty || p.isInvoicePage) continue;
        if (p.orderNo) { if (orders.has(p.orderNo)) continue; orders.add(p.orderNo); }
        nLabels++; couriers[p.courier] = (couriers[p.courier] || 0) + 1;
        const recs = p.rows.length ? p.rows : [{ sku: '', qty: '1', desc: p.desc }];
        for (const r of recs) {
          const sku = r.sku || '(no SKU)', size = r.size || '', color = r.color || '', qty = parseInt(r.qty, 10) || 1;
          const key = [sku, size, color].join('|');
          const cur = rows.get(key) || { sku, size, color, orders: 0, units: 0, couriers: {}, desc: r.desc || '' };
          cur.orders++; cur.units += qty; cur.couriers[p.courier] = (cur.couriers[p.courier] || 0) + 1; rows.set(key, cur);
        }
      }
      files.push(f); doc.destroy();
    }
    S.fileList($('#files'), files, { draggable: false, onRemove: () => { files = []; rows = new Map(); orders = new Set(); couriers = {}; nLabels = 0; $('#files').innerHTML = ''; render(); S.toast('Cleared — add files again'); } });
    render(); S.status(`${nLabels} labels read · ${rows.size} SKU rows`, 'ok');
  }
  function render() {
    const has = rows.size > 0; $('#stats').hidden = !has; $('#tablewrap').hidden = !has; if (!has) return;
    const units = [...rows.values()].reduce((n, r) => n + r.units, 0);
    $('#stats').innerHTML = [['Labels', nLabels], ['Units to pick', units], ['SKU rows', rows.size], ['Couriers', Object.keys(couriers).length]].map(([l, v]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`).join('');
    const q = $('#q').value.trim().toLowerCase();
    const list = [...rows.values()].filter((r) => !q || `${r.sku} ${r.size} ${r.color} ${r.desc}`.toLowerCase().includes(q)).sort((a, b) => b.units - a.units || a.sku.localeCompare(b.sku));
    $('#tbl tbody').innerHTML = list.map((r, i) => `<tr data-k="${r.sku}|${r.size}|${r.color}" class="${r.picked ? 'picked' : ''}"><td>${i + 1}</td><td><b>${r.sku}</b>${r.desc ? `<div class="muted" style="font-size:.8em">${r.desc}</div>` : ''}</td><td>${r.size}</td><td>${r.color}</td><td class="r">${r.orders}</td><td class="r"><b>${r.units}</b></td><td>${Object.entries(r.couriers).map(([k, v]) => `${k} ${v}`).join(', ')}</td><td><input type="checkbox" ${r.picked ? 'checked' : ''} aria-label="Picked"></td></tr>`).join('');
    $('#couriers').innerHTML = Object.entries(couriers).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<span class="chip">${k}: <b>${v}</b></span>`).join('');
  }
  $('#q').addEventListener('input', render);
  $('#tbl').addEventListener('change', (e) => { const tr = e.target.closest('tr'); if (!tr) return; const r = rows.get(tr.dataset.k); if (r) { r.picked = e.target.checked; tr.classList.toggle('picked', r.picked); } });
  $('#allpick').addEventListener('change', (e) => { rows.forEach((r) => (r.picked = e.target.checked)); render(); });
  $('#csv').addEventListener('click', () => {
    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const lines = [['SKU', 'Size', 'Colour', 'Orders', 'Units', 'Couriers'].join(',')];
    [...rows.values()].sort((a, b) => b.units - a.units).forEach((r) => lines.push([r.sku, r.size, r.color, r.orders, r.units, Object.entries(r.couriers).map(([k, v]) => `${k} ${v}`).join('; ')].map(esc).join(',')));
    S.download(new Blob(['﻿' + lines.join('\n')], { type: 'text/csv' }), `picklist-${new Date().toISOString().slice(0, 10)}.csv`);
  });
  $('#print').addEventListener('click', () => print());
})();
