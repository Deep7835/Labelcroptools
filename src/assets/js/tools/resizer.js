/* resizer.js — batch product image resize with pad/cover/stretch */
(() => {
  const S = window.SKUD, { $, $$ } = S;
  const ui = $('.tool-ui'); if (!ui) return;
  let files = [];
  const grid = $('#imgs');
  S.dropzone('#drop', '#file', (list) => { list.forEach((f) => files.push({ f, url: URL.createObjectURL(f) })); render(); }, { accept: (f) => /^image\//.test(f.type) });
  function render() {
    grid.innerHTML = files.map((x, i) => `<div class="im"><img src="${x.url}" alt="Thumbnail of ${x.f.name}" loading="lazy" decoding="async"><div class="cap" title="${x.f.name}">${x.f.name}</div><div class="cap">${S.fmtBytes(x.f.size)}${x.out ? ` → <b>${x.out}</b>` : ''}</div><button class="x" data-i="${i}" aria-label="Remove"><svg class="ic ic-sm"><use href="#i-x"/></svg></button></div>`).join('');
    $$('.x', grid).forEach((b) => b.addEventListener('click', () => { URL.revokeObjectURL(files[+b.dataset.i].url); files.splice(+b.dataset.i, 1); render(); }));
    $('#ropts').hidden = !files.length; $('#run').disabled = !files.length; S.status(files.length ? `${files.length} image${files.length > 1 ? 's' : ''}` : '');
  }
  const loadBitmap = async (f) => { try { return await createImageBitmap(f, { imageOrientation: 'from-image' }); } catch { return createImageBitmap(f); } };
  S.resizeImage = async (file, { w, h, fit = 'pad', bg = '#fff', fmt = 'jpeg', q = 0.9 }) => {
    const bm = await loadBitmap(file); const c = document.createElement('canvas'); c.width = w; c.height = h; const ctx = c.getContext('2d');
    if (fmt !== 'png' || fit === 'pad') { ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h); }
    if (fit === 'stretch') ctx.drawImage(bm, 0, 0, w, h);
    else { const s = fit === 'cover' ? Math.max(w / bm.width, h / bm.height) : Math.min(w / bm.width, h / bm.height); const dw = bm.width * s, dh = bm.height * s; ctx.drawImage(bm, (w - dw) / 2, (h - dh) / 2, dw, dh); }
    bm.close?.(); return new Promise((r) => c.toBlob(r, 'image/' + fmt, q));
  };
  $('#run').addEventListener('click', async () => {
    $('#run').disabled = true;
    try {
      const preset = $('#preset').value; const [w, h] = preset === 'custom' ? [+$('#cw').value || 1000, +$('#ch').value || 1000] : preset.split('x').map(Number);
      const fit = $('input[name=fit]:checked').value, bg = $('#bg').value, fmt = $('#fmt').value, q = (+$('#q').value || 90) / 100, ext = fmt === 'jpeg' ? 'jpg' : fmt, suffix = $('#suffix').checked ? `-${w}x${h}` : '';
      const outs = [];
      for (let i = 0; i < files.length; i++) { S.status(`Resizing ${i + 1}/${files.length}…`); const blob = await S.resizeImage(files[i].f, { w, h, fit, bg, fmt, q }); files[i].out = S.fmtBytes(blob.size); outs.push({ name: `${S.baseName(files[i].f.name)}${suffix}.${ext}`, blob }); }
      render();
      if (outs.length === 1) S.download(outs[0].blob, outs[0].name); else { const JSZip = await S.lib('jszip'); const zip = new JSZip(); outs.forEach((o) => zip.file(o.name, o.blob)); S.download(await zip.generateAsync({ type: 'blob' }), `resized-${w}x${h}.zip`); }
      S.status(`Done · ${outs.length} image${outs.length > 1 ? 's' : ''} at ${w} × ${h}`, 'ok'); S.toast('Download started');
    } catch (e) { S.status('Failed: ' + e.message, 'err'); }
    $('#run').disabled = false;
  });
})();
