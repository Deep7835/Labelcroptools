/* compressor.js — batch image compression with size readout */
(() => {
  const S = window.SKUD, { $, $$ } = S;
  const ui = $('.tool-ui'); if (!ui) return;
  let files = []; const grid = $('#imgs');
  S.dropzone('#drop', '#file', (list) => { list.forEach((f) => files.push({ f, url: URL.createObjectURL(f) })); render(); }, { accept: (f) => /^image\//.test(f.type) });
  function render() {
    grid.innerHTML = files.map((x, i) => `<div class="im"><img src="${x.url}" alt="Thumbnail of ${x.f.name}" loading="lazy" decoding="async"><div class="cap" title="${x.f.name}">${x.f.name}</div><div class="cap">${S.fmtBytes(x.f.size)}${x.out ? ` → <b>${S.fmtBytes(x.out)} (−${Math.max(0, 100 - x.out / x.f.size * 100).toFixed(0)}%)</b>` : ''}</div><button class="x" data-i="${i}" aria-label="Remove"><svg class="ic ic-sm"><use href="#i-x"/></svg></button></div>`).join('');
    $$('.x', grid).forEach((b) => b.addEventListener('click', () => { files.splice(+b.dataset.i, 1); render(); }));
    $('#copts').hidden = !files.length; $('#run').disabled = !files.length; S.status(files.length ? `${files.length} image${files.length > 1 ? 's' : ''} · ${S.fmtBytes(files.reduce((n, x) => n + x.f.size, 0))}` : '');
  }
  const loadBitmap = async (f) => { try { return await createImageBitmap(f, { imageOrientation: 'from-image' }); } catch { return createImageBitmap(f); } };
  $('#run').addEventListener('click', async () => {
    $('#run').disabled = true;
    try {
      const q = (+$('#q').value || 80) / 100, max = +$('#maxdim').value || 0, fsel = $('#fmt').value; const outs = []; let before = 0, after = 0;
      for (let i = 0; i < files.length; i++) {
        S.status(`Compressing ${i + 1}/${files.length}…`); const f = files[i].f; const bm = await loadBitmap(f);
        const s = max ? Math.min(1, max / Math.max(bm.width, bm.height)) : 1; const c = document.createElement('canvas'); c.width = Math.round(bm.width * s); c.height = Math.round(bm.height * s);
        const fmt = fsel === 'keep' ? (f.type === 'image/png' ? 'png' : f.type === 'image/webp' ? 'webp' : 'jpeg') : fsel; const ctx = c.getContext('2d'); if (fmt === 'jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); } ctx.drawImage(bm, 0, 0, c.width, c.height); bm.close?.();
        let blob = await new Promise((r) => c.toBlob(r, 'image/' + fmt, q)); if (fmt === (f.type.split('/')[1] === 'jpg' ? 'jpeg' : f.type.split('/')[1]) && blob.size >= f.size) blob = f; // never make it bigger
        files[i].out = blob.size; before += f.size; after += blob.size; outs.push({ name: `${S.baseName(f.name)}-min.${fmt === 'jpeg' ? 'jpg' : fmt}`, blob });
      }
      render();
      if (outs.length === 1) S.download(outs[0].blob, outs[0].name); else { const JSZip = await S.lib('jszip'); const zip = new JSZip(); outs.forEach((o) => zip.file(o.name, o.blob)); S.download(await zip.generateAsync({ type: 'blob' }), 'compressed.zip'); }
      S.status(`Done · ${S.fmtBytes(before)} → ${S.fmtBytes(after)} (−${Math.max(0, 100 - after / before * 100).toFixed(0)}%)`, 'ok'); S.toast('Download started');
    } catch (e) { S.status('Failed: ' + e.message, 'err'); }
    $('#run').disabled = false;
  });
})();
