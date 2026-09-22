/* home.js — smart drop zone: detect marketplace, hand file to the right cropper */
(() => {
  const S = window.SKUD, { $ } = S;
  const st = $('#home-status'); if (!$('#home-drop')) return;
  const say = (m, k = '') => { st.textContent = m; st.className = 'status ' + k; };
  S.dropzone('#home-drop', '#home-file', async ([file]) => {
    try {
      say('Reading label…');
      const bytes = await S.readFile(file);
      const doc = await S.openPdf(bytes);
      const votes = {};
      for (let i = 1; i <= Math.min(doc.numPages, 5); i++) { const t = await S.pageText(doc, i); const m = S.detectMarket(t.text); votes[m] = (votes[m] || 0) + 1; }
      const best = Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
      const slug = { meesho: 'meesho-label-cropper', flipkart: 'flipkart-label-cropper', amazon: 'amazon-label-cropper' }[best] || 'shipping-label-cropper';
      say(`Detected ${best === 'unknown' ? 'generic label' : best} · opening cropper…`, 'ok');
      const db = await new Promise((res, rej) => { const r = indexedDB.open('skud', 1); r.onupgradeneeded = () => r.result.createObjectStore('handoff'); r.onsuccess = () => res(r.result); r.onerror = rej; });
      const tx = db.transaction('handoff', 'readwrite'); tx.objectStore('handoff').put({ bytes, name: file.name, t: Date.now() }, 'file');
      tx.oncomplete = () => (location.href = `/${slug}/`);
    } catch (e) { console.error(e); say('Could not read that PDF.', 'err'); }
  }, { accept: (f) => /pdf$/i.test(f.name) || f.type === 'application/pdf' });
})();
