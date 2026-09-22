/* volumetric.js — dimensional weight vs actual */
(() => {
  const S = window.SKUD, { $ } = S;
  const ui = $('.tool-ui'); if (!ui) return;
  const out = $('#out');
  function calc() {
    const inch = $('input[name=unit]:checked').value === 'in'; const k = inch ? 2.54 : 1;
    const l = (+$('#l').value || 0) * k, w = (+$('#w').value || 0) * k, h = (+$('#h').value || 0) * k, actual = +$('#actual').value || 0, div = +$('#div').value, round = +$('input[name=round]:checked').value;
    const vol = l * w * h, volW = vol / div * 1000; // grams
    const charge = Math.max(actual, volW); const slab = round ? Math.ceil(charge / round) * round : charge;
    const by = volW > actual ? 'volumetric' : 'actual';
    out.innerHTML = `<div class="lbl">Chargeable weight</div><div class="big">${(slab / 1000).toFixed(round ? 1 : 3)} kg</div>
      <div class="kpis"><div class="kpi"><b>${(actual / 1000).toFixed(2)} kg</b><span>Actual</span></div><div class="kpi"><b>${(volW / 1000).toFixed(2)} kg</b><span>Volumetric ÷${div}</span></div><div class="kpi"><b>${by}</b><span>Billed by</span></div></div>
      <table><tr><td>Volume</td><td>${(vol / 1000).toFixed(2)} L (${vol.toFixed(0)} cm³)</td></tr><tr><td>Formula</td><td>${l.toFixed(1)} × ${w.toFixed(1)} × ${h.toFixed(1)} ÷ ${div}</td></tr>
      ${[3000, 4000, 4500, 5000, 6000].map((d) => `<tr class="${d === div ? 'total' : 'sub'}"><td>Divisor ${d}</td><td>${(vol / d).toFixed(2)} kg → ${(Math.max(actual, vol / d * 1000) / 1000).toFixed(2)} kg chargeable</td></tr>`).join('')}</table>
      ${volW > actual ? `<p class="warn">You are paying for ${((volW - actual) / 1000).toFixed(2)} kg of air. Reducing each dimension by 10 % cuts volumetric weight by ${(100 - 0.9 ** 3 * 100).toFixed(0)} %.</p>` : '<p class="warn">Actual weight governs — packaging size is not costing you extra.</p>'}`;
  }
  ui.addEventListener('input', calc); ui.addEventListener('change', calc); calc();
})();
