/* profit.js — marketplace profit calculator with indicative presets */
(() => {
  const S = window.SKUD, { $, $$ } = S;
  const ui = $('.tool-ui'); if (!ui) return;
  const PRESETS = {
    meesho: { comm: 0, fixed: 0, collect: 0, ship: 0, feegst: 18, ret: 10, retcost: 100, note: 'Meesho preset: 0 % commission. Forward shipping is charged to the customer; you typically bear reverse-shipping on returns/RTO (set “Cost per return”). Verify on your supplier panel.' },
    flipkart: { comm: 12, fixed: 20, collect: 2, ship: 60, feegst: 18, ret: 10, retcost: 120, note: 'Flipkart preset: indicative commission 12 %, fixed fee ₹20, collection fee 2 %, local shipping ₹60. Actual rates vary by category, price band and zone — copy them from your Seller Hub rate card.' },
    amazon: { comm: 12, fixed: 20, collect: 0, ship: 65, feegst: 18, ret: 8, retcost: 120, note: 'Amazon preset: indicative referral fee 12 %, closing fee ₹20, Easy Ship local charge ₹65. Check your category on the Seller Central fee schedule.' },
    custom: { note: 'Custom: enter the exact figures from your rate card.' },
  };
  const ids = ['price', 'cost', 'gst', 'comm', 'fixed', 'collect', 'ship', 'feegst', 'ret', 'retcost', 'ads'];
  const v = (id) => +$('#' + id).value || 0;
  const out = $('#out'); let target = 20;
  const applyPreset = (k) => { const p = PRESETS[k]; Object.entries(p).forEach(([id, val]) => { if (id !== 'note' && $('#' + id)) $('#' + id).value = val; }); $('#mpnote').textContent = p.note; };
  $$('input[name=mp]').forEach((r) => r.addEventListener('change', () => { applyPreset(r.value); calc(); }));
  const f = (n) => S.fmtINR(n);
  function calc() {
    const P = v('price'), cost = v('cost'), g = v('gst'), comm = v('comm'), fixed = v('fixed'), collect = v('collect'), ship = v('ship'), fg = v('feegst'), r = v('ret') / 100, retcost = v('retcost'), ads = v('ads');
    const taxable = P / (1 + g / 100), gstSale = P - taxable;
    const commission = P * comm / 100, collection = P * collect / 100, fees = commission + fixed + collection + ship, feeGst = fees * fg / 100;
    const settlement = P - fees - feeGst;
    const profit = settlement - gstSale + feeGst - cost - ads; // ITC on fee GST assumed claimable
    const margin = P ? profit / P * 100 : 0, roi = cost ? profit / cost * 100 : 0;
    const expected = (1 - r) * profit - r * retcost;
    const A = 1 - (comm + collect) / 100 - g / (100 + g), B = fixed + ship + cost + ads;
    const breakeven = A > 0 ? B / A : NaN, targetPrice = A - target / 100 > 0 ? B / (A - target / 100) : NaN;
    const cls = (n) => (n < 0 ? 'neg' : 'pos');
    out.innerHTML = `
      <div class="lbl">Profit per delivered order</div><div class="big ${cls(profit)}">${f(profit)}</div>
      <div class="kpis"><div class="kpi"><b>${margin.toFixed(1)}%</b><span>Margin</span></div><div class="kpi"><b>${roi.toFixed(0)}%</b><span>ROI on cost</span></div><div class="kpi"><b class="${cls(expected)}">${f(expected)}</b><span>Expected after ${(r * 100).toFixed(0)}% returns</span></div></div>
      <table>
        <tr><td>Selling price (incl. GST)</td><td>${f(P)}</td></tr>
        <tr class="sub"><td>− Commission ${comm}%</td><td>${f(commission)}</td></tr>
        <tr class="sub"><td>− Fixed / closing fee</td><td>${f(fixed)}</td></tr>
        <tr class="sub"><td>− Collection fee ${collect}%</td><td>${f(collection)}</td></tr>
        <tr class="sub"><td>− Shipping fee</td><td>${f(ship)}</td></tr>
        <tr class="sub"><td>− GST on fees ${fg}%</td><td>${f(feeGst)}</td></tr>
        <tr class="total"><td>Marketplace settlement</td><td>${f(settlement)}</td></tr>
        <tr class="sub"><td>− GST on sale (${g}% of taxable ${f(taxable)})</td><td>${f(gstSale)}</td></tr>
        <tr class="sub"><td>+ ITC on fee GST (if registered)</td><td>${f(feeGst)}</td></tr>
        <tr class="sub"><td>− Product cost incl. packaging</td><td>${f(cost)}</td></tr>
        <tr class="sub"><td>− Ads / other</td><td>${f(ads)}</td></tr>
        <tr class="total"><td>Profit per delivered order</td><td>${f(profit)}</td></tr>
        <tr><td>Break-even selling price</td><td>${isFinite(breakeven) ? f(breakeven) : '—'}</td></tr>
        <tr><td>Price for <input type="number" id="target" value="${target}" min="0" max="90" style="width:58px;padding:2px 6px;font-size:.85rem"> % margin</td><td>${isFinite(targetPrice) ? f(targetPrice) : '—'}</td></tr>
      </table>
      <p class="warn">Per 100 orders at a ${(r * 100).toFixed(0)}% return rate: ${f(expected * 100)} expected profit. Fee presets are indicative — verify with your seller panel.</p>`;
    $('#target').addEventListener('change', (e) => { target = +e.target.value || 0; calc(); });
    const u = new URL(location.href); ids.forEach((id) => u.searchParams.set(id, v(id))); u.searchParams.set('mp', $('input[name=mp]:checked').value); history.replaceState(null, '', u);
  }
  ui.addEventListener('input', (e) => { if (e.target.id !== 'target') calc(); });
  // restore from URL or apply preset
  const u = new URL(location.href);
  if (u.searchParams.has('price')) { ids.forEach((id) => { if (u.searchParams.has(id)) $('#' + id).value = u.searchParams.get(id); }); const mp = u.searchParams.get('mp'); if (mp && $(`input[name=mp][value=${mp}]`)) $(`input[name=mp][value=${mp}]`).checked = true; $('#mpnote').textContent = PRESETS[mp]?.note || ''; }
  else applyPreset($('input[name=mp]:checked').value);
  calc();
})();
