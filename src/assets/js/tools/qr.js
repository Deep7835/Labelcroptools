/* qr.js — URL / WhatsApp / UPI / Instagram QR codes */
(() => {
  const S = window.SKUD, { $ } = S;
  const ui = $('.tool-ui'); if (!ui) return;
  const pv = $('#qrpreview'); let t, last = null;
  const payload = () => {
    const k = $('input[name=kind]:checked').value;
    if (k === 'wa') { const n = $('#wanum').value.replace(/\D/g, ''); const m = $('#wamsg').value.trim(); return n ? `https://wa.me/${n}${m ? '?text=' + encodeURIComponent(m) : ''}` : ''; }
    if (k === 'upi') { const pa = $('#pa').value.trim(); if (!pa) return ''; const p = new URLSearchParams({ pa }); if ($('#pn').value.trim()) p.set('pn', $('#pn').value.trim()); if (+$('#am').value > 0) p.set('am', (+$('#am').value).toFixed(2)); p.set('cu', 'INR'); if ($('#tn').value.trim()) p.set('tn', $('#tn').value.trim()); return 'upi://pay?' + p.toString(); }
    if (k === 'ig') { const h = $('#ig').value.trim().replace(/^@/, ''); return h ? `https://instagram.com/${h}` : ''; }
    return $('#url').value.trim();
  };
  const lum = (hex) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  async function make() {
    const qrcode = await S.lib('qrcode'); const data = payload(); $('#qrdata').textContent = data;
    if (!data) { pv.innerHTML = '<p class="muted">Fill in the fields to generate a QR code.</p>'; last = null; return; }
    const ecl = $('#ecl').value, size = +$('#size').value || 512, margin = +$('#margin').value || 0, fg = $('#fg').value, bg = $('#bg').value, cap = $('#label').value.trim();
    let qr; try { qr = qrcode(0, ecl); qr.addData(data); qr.make(); } catch (e) { pv.innerHTML = `<p class="bc-err">Too much data for a QR code (${data.length} chars). Shorten the message.</p>`; return; }
    const n = qr.getModuleCount(), cell = size / (n + 2 * margin), capH = cap ? Math.round(size * 0.09) : 0;
    const cv = document.createElement('canvas'); cv.width = size; cv.height = size + capH; const ctx = cv.getContext('2d'); ctx.fillStyle = bg; ctx.fillRect(0, 0, cv.width, cv.height); ctx.fillStyle = fg;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) ctx.fillRect(Math.floor((c + margin) * cell), Math.floor((r + margin) * cell), Math.ceil(cell), Math.ceil(cell));
    if (cap) { ctx.font = `600 ${Math.round(size * 0.05)}px 'Uncut Sans', Helvetica, Arial, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(cap, size / 2, size + capH / 2, size - 16); }
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n + 2 * margin} ${n + 2 * margin}" width="${size}" height="${size}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="${bg}"/><path fill="${fg}" d="`;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) svg += `M${c + margin} ${r + margin}h1v1h-1z`;
    svg += '"/></svg>';
    pv.innerHTML = ''; pv.appendChild(cv); last = { cv, svg, data };
    const ratio = (Math.max(lum(fg), lum(bg)) + 0.05) / (Math.min(lum(fg), lum(bg)) + 0.05);
    if (ratio < 4 || lum(fg) > lum(bg)) pv.insertAdjacentHTML('beforeend', '<p class="bc-err">Low contrast or light-on-dark — many scanners will fail. Use a dark foreground on a light background.</p>');
  }
  ui.addEventListener('input', () => { clearTimeout(t); t = setTimeout(make, 120); }); make();
  $('#png').addEventListener('click', () => { if (last) last.cv.toBlob((b) => S.download(b, 'qr-code.png')); });
  $('#svg').addEventListener('click', () => { if (last) S.download(new Blob([last.svg], { type: 'image/svg+xml' }), 'qr-code.svg'); });
})();
