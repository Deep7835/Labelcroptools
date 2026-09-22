/* gst.js — GST add/remove with CGST/SGST/IGST split */
(() => {
  const S = window.SKUD, { $ } = S;
  const ui = $('.tool-ui'); if (!ui) return;
  const out = $('#out'); const f = (n) => S.fmtINR(n);
  function calc() {
    const mode = $('input[name=mode]:checked').value, amt = +$('#amount').value || 0, rsel = $('input[name=rate]:checked').value, rate = rsel === 'custom' ? +$('#crate').value || 0 : +rsel, intra = $('input[name=supply]:checked').value === 'intra';
    const base = mode === 'excl' ? amt : amt / (1 + rate / 100), tax = base * rate / 100, total = base + tax;
    out.innerHTML = `<div class="lbl">${mode === 'excl' ? 'Total including GST' : 'Base amount excluding GST'}</div><div class="big">${f(mode === 'excl' ? total : base)}</div>
      <table><tr><td>Base amount (taxable value)</td><td>${f(base)}</td></tr>
      ${intra ? `<tr><td>CGST @ ${(rate / 2).toFixed(2).replace(/\.?0+$/, '')}%</td><td>${f(tax / 2)}</td></tr><tr><td>SGST / UTGST @ ${(rate / 2).toFixed(2).replace(/\.?0+$/, '')}%</td><td>${f(tax / 2)}</td></tr>` : `<tr><td>IGST @ ${rate}%</td><td>${f(tax)}</td></tr>`}
      <tr class="total"><td>Total GST</td><td>${f(tax)}</td></tr><tr class="total"><td>Total amount</td><td>${f(total)}</td></tr></table>
      <div class="btns" style="margin-top:12px"><button class="btn btn-sm" id="copy">Copy breakdown</button></div>`;
    $('#copy').addEventListener('click', () => { navigator.clipboard?.writeText(`Taxable: ${f(base)}\n${intra ? `CGST: ${f(tax / 2)}\nSGST: ${f(tax / 2)}` : `IGST: ${f(tax)}`}\nTotal GST: ${f(tax)}\nTotal: ${f(total)}`); S.toast('Copied'); });
  }
  ui.addEventListener('input', calc); ui.addEventListener('change', calc); calc();
})();
