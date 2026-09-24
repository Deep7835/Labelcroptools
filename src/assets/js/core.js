/* core.js — shared UI: theme, nav, ⌘K search, toast, option memory, data-show */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };

  // ── theme ────────────────────────────────────────────────────────────
  $('#theme-btn')?.addEventListener('click', () => {
    const root = document.documentElement;
    const sysDark = matchMedia('(prefers-color-scheme: dark)').matches;
    const cur = root.getAttribute('data-theme') || (sysDark ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch {}
  });

  // ── mobile + mega nav ────────────────────────────────────────────────
  const menuBtn = $('#menu-btn'), mobileNav = $('#mobile-nav');
  menuBtn?.addEventListener('click', () => {
    const open = mobileNav.hidden;
    mobileNav.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  // Mega panels open on mouse hover (after a short intent delay, so sweeping across the
  // header doesn't flash them) and on keyboard focus. Touch taps just follow the link to
  // the category page. data-instant skips the entrance when swapping between panels or
  // opening from the keyboard; only a fresh open or a close animates.
  const hdr = $('.site-header'), megas = $$('.has-mega');
  let openT, closeT, quiet = false;
  const setMega = (m, instant = false) => {
    clearTimeout(openT); clearTimeout(closeT);
    const cur = megas.find((x) => x.classList.contains('open'));
    if (cur === m) return;
    hdr.toggleAttribute('data-instant', instant || Boolean(cur && m));
    for (const [el, on] of [[cur, false], [m, true]]) {
      if (!el) continue;
      el.classList.toggle('open', on);
      $('.nav-link', el).setAttribute('aria-expanded', String(on));
    }
  };
  megas.forEach((m) => {
    m.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      clearTimeout(closeT); clearTimeout(openT);
      openT = setTimeout(() => setMega(m), megas.some((x) => x.classList.contains('open')) ? 0 : 80);
    });
    m.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'mouse') return;
      clearTimeout(openT);
      closeT = setTimeout(() => setMega(null), 120);
    });
    m.addEventListener('focusin', () => { if (!quiet) setMega(m, true); });
  });
  document.addEventListener('focusin', (e) => { if (!e.target.closest('.has-mega')) setMega(null, true); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.has-mega')) setMega(null); });
  document.addEventListener('keydown', (e) => {
    const cur = megas.find((x) => x.classList.contains('open'));
    if (e.key !== 'Escape' || !cur) return;
    setMega(null, true);
    // Return focus to the trigger without its focusin reopening the panel.
    quiet = true; $('.nav-link', cur).focus(); quiet = false;
  });

  // ── toast ────────────────────────────────────────────────────────────
  let toastT;
  const toast = (msg, kind = '') => {
    const t = $('#toast'); if (!t) return;
    t.textContent = msg; t.className = 'toast ' + kind; t.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(() => (t.hidden = true), 3200);
  };

  // ── command palette ──────────────────────────────────────────────────
  const cmdk = $('#cmdk'), q = $('#cmdk-q'), list = $('#cmdk-list');
  let index = null, sel = 0;
  const openCmdk = async () => {
    cmdk.hidden = false; q.value = ''; q.focus();
    if (!index) { try { index = await (await fetch('/search-index.json')).json(); } catch { index = []; } }
    render('');
  };
  const closeCmdk = () => { cmdk.hidden = true; };
  const render = (term) => {
    const t = term.trim().toLowerCase();
    const rows = (index || []).map((it) => {
      let score = 0;
      if (!t) score = 1;
      else {
        const n = it.n.toLowerCase();
        if (n.startsWith(t)) score += 10; else if (n.includes(t)) score += 6;
        if (it.k.toLowerCase().includes(t)) score += 3;
        if (it.d.toLowerCase().includes(t)) score += 2;
        if (it.c.toLowerCase().includes(t)) score += 1;
      }
      return [score, it];
    }).filter((r) => r[0] > 0).sort((a, b) => b[0] - a[0]).slice(0, 12);
    sel = 0;
    list.innerHTML = rows.length
      ? rows.map(([, it], i) => `<li class="${i === 0 ? 'active' : ''}" role="option"><a href="/${it.s}/"><b>${it.n}</b><span class="d">${it.d}</span><span class="c">${it.c}</span></a></li>`).join('')
      : '<li class="none">No tools match.</li>';
  };
  if (cmdk) {
    $('#search-btn')?.addEventListener('click', openCmdk);
    q.addEventListener('input', () => render(q.value));
    q.addEventListener('keydown', (e) => {
      const items = $$('li[role=option]', list);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault(); sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items.forEach((li, i) => li.classList.toggle('active', i === sel)); items[sel]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') { const a = items[sel]?.querySelector('a'); if (a) location.href = a.href; }
    });
    cmdk.addEventListener('click', (e) => { if (e.target === cmdk) closeCmdk(); });
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); cmdk.hidden ? openCmdk() : closeCmdk(); }
      else if (e.key === 'Escape' && !cmdk.hidden) closeCmdk();
      else if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement?.tagName || '') && cmdk.hidden) { e.preventDefault(); openCmdk(); }
    });
  }

  // ── data-show="name=value" / "name!=value" conditional fields ────────
  const applyShow = (root = document) => {
    $$('[data-show]', root).forEach((el) => {
      const m = el.dataset.show.match(/^(\w+)(!?=)(.+)$/); if (!m) return;
      const [, name, op, val] = m;
      const scope = el.closest('.tool-ui') || document;
      const input = scope.querySelector(`input[name="${name}"]:checked`) || scope.querySelector(`#${name}`);
      const cur = input ? (input.type === 'checkbox' ? String(input.checked) : input.value) : '';
      const match = op === '=' ? cur === val : cur !== val;
      el.hidden = !match;
    });
  };
  document.addEventListener('change', (e) => { if (e.target.matches('input,select')) applyShow(); });
  applyShow();

  // ── form validation ──────────────────────────────────────────────────
  // Keep every number input inside its declared min/max so a stray "-5" or "9999"
  // can't produce a nonsense layout or a negative tax figure.
  const clampNumber = (el) => {
    if (el.value === '') return;
    const v = parseFloat(el.value); if (Number.isNaN(v)) { el.value = ''; return; }
    const min = el.min !== '' ? parseFloat(el.min) : -Infinity;
    const max = el.max !== '' ? parseFloat(el.max) : Infinity;
    const c = Math.min(max, Math.max(min, v));
    if (c !== v) el.value = String(c);
  };
  document.addEventListener('change', (e) => { if (e.target.matches('input[type=number]')) clampNumber(e.target); });

  // Inline, accessible field errors.
  const setError = (el, msg) => {
    const id = (el.id || 'f') + '-err';
    let box = document.getElementById(id);
    if (!msg) { box?.remove(); el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); return false; }
    if (!box) {
      box = document.createElement('p'); box.className = 'field-err'; box.id = id; box.setAttribute('role', 'alert');
      (el.closest('.field') || el.parentNode).appendChild(box);
    }
    box.textContent = msg; el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', id);
    return true;
  };

  // GSTIN: 15 chars, then the standard mod-36 check digit.
  const gstinValid = (v) => {
    v = String(v || '').toUpperCase().trim();
    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(v)) return false;
    const set = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let sum = 0;
    for (let i = 0; i < 14; i++) {
      const p = set.indexOf(v[i]) * (i % 2 ? 2 : 1);
      sum += Math.floor(p / 36) + (p % 36);
    }
    return set[(36 - (sum % 36)) % 36] === v[14];
  };

  // ── remember tool options (radios/selects/checkboxes) per page ───────
  const ui = $('.tool-ui');
  if (ui && !ui.classList.contains('calc')) {
    const key = 'opts:' + location.pathname;
    const saved = store.get(key, {});
    $$('input[type=radio],select,input[type=checkbox]', ui).forEach((el) => {
      const id = el.name || el.id; if (!id || !(id in saved) || el.closest('.tbl')) return;
      if (el.type === 'radio') { if (el.value === saved[id]) el.checked = true; }
      else if (el.type === 'checkbox') el.checked = !!saved[id];
      else el.value = saved[id];
    });
    ui.addEventListener('change', (e) => {
      const el = e.target; if (!el.matches('input[type=radio],select,input[type=checkbox]') || el.closest('.tbl')) return;
      const id = el.name || el.id; if (!id) return;
      saved[id] = el.type === 'checkbox' ? el.checked : el.value; store.set(key, saved);
    });
    applyShow();
  }

  // ── home page tool filter ────────────────────────────────────────────
  const filter = $('#tool-filter');
  if (filter) {
    const chips = $$('.chips .chip'), blocks = $$('.cat-block'), cards = $$('.tool-grid .tool-card', $('#tools'));
    let cat = 'all';
    const apply = () => {
      const t = filter.value.trim().toLowerCase(); let any = false;
      cards.forEach((c) => { const ok = (cat === 'all' || c.dataset.cat === cat) && (!t || c.dataset.name.includes(t) || c.dataset.kw.includes(t)); c.hidden = !ok; any ||= ok; });
      blocks.forEach((b) => { b.hidden = !$$('.tool-card:not([hidden])', b).length; });
      $('#no-results').hidden = any;
    };
    filter.addEventListener('input', apply);
    chips.forEach((ch) => ch.addEventListener('click', () => { chips.forEach((x) => x.classList.remove('active')); ch.classList.add('active'); cat = ch.dataset.cat; apply(); }));
    const u = new URL(location.href).searchParams.get('q'); if (u) { filter.value = u; apply(); }
  }

  // ── hero brand-logo rotator ──────────────────────────────────────────
  const rotator = $('.brand-rotator');
  if (rotator) {
    const items = $$('.br-item', rotator);
    const interval = +rotator.dataset.interval || 2200;
    let i = items.findIndex((el) => el.classList.contains('is-active'));
    if (i < 0) i = 0;
    let timer = null, paused = false;

    // Logos size the slot from their aspect ratio (known from the markup, so no waiting
    // on image load); a wordmark fallback has to be measured once the webfont is ready.
    const widths = new Array(items.length).fill(0);
    const measure = () => {
      items.forEach((el, k) => { if (!el.dataset.ar) widths[k] = el.firstElementChild?.offsetWidth || 0; });
      setWidth();
    };
    const setWidth = () => {
      const ar = parseFloat(items[i].dataset.ar);
      if (ar) rotator.style.width = `calc(${ar} * var(--logo-h) + 2 * var(--chip-pad))`;
      else if (widths[i]) rotator.style.width = `calc(${widths[i]}px + 2 * var(--chip-pad))`;
    };
    const show = (next) => {
      if (next === i) return;
      const prev = items[i];
      prev.classList.remove('is-active');
      prev.classList.add('is-leaving');
      setTimeout(() => prev.classList.remove('is-leaving'), Math.min(340, interval - 40));
      i = next;
      items[i].classList.add('is-active');
      setWidth();
    };
    const tick = () => { if (!paused) show((i + 1) % items.length); };
    const start = () => { stop(); timer = setInterval(tick, interval); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

    measure();
    document.fonts?.ready.then(measure);
    addEventListener('load', measure);
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(measure, 150); });

    // Don't animate off-screen or in a background tab, and let people stop it.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? start() : stop())), { threshold: 0 }).observe(rotator);
    } else start();
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    rotator.addEventListener('pointerenter', () => (paused = true));
    rotator.addEventListener('pointerleave', () => (paused = false));
  }

  // ── cookie consent ───────────────────────────────────────────────────
  // Only rendered when a consent-requiring analytics provider is configured. Tags are
  // parked as type="text/plain" in the HTML and only activated on an explicit Accept.
  const consent = $('#consent');
  if (consent && window.__SITE?.consent) {
    const KEY = 'consent:analytics';
    const activate = () => {
      $$('script[data-consent-src]').forEach((old) => {
        const sc = document.createElement('script');
        sc.src = old.dataset.consentSrc; sc.async = true;
        old.replaceWith(sc);
      });
      $$('script[data-consent-inline]').forEach((old) => {
        const sc = document.createElement('script');
        sc.textContent = old.textContent;
        old.replaceWith(sc);
      });
    };
    const decide = (yes) => { store.set(KEY, yes ? 'granted' : 'denied'); consent.hidden = true; if (yes) activate(); };
    const saved = store.get(KEY, null);
    if (saved === 'granted') activate();
    else if (saved !== 'denied') consent.hidden = false;
    $('#consent-yes')?.addEventListener('click', () => decide(true));
    $('#consent-no')?.addEventListener('click', () => decide(false));
    // Consent must be withdrawable, so the footer gets a way back to this dialog.
    $('#consent-reopen')?.addEventListener('click', () => { consent.hidden = false; $('#consent-yes')?.focus(); });
    consent.addEventListener('keydown', (e) => { if (e.key === 'Escape') decide(false); });
  }

  // ── service worker (offline shell) ───────────────────────────────────
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  }

  // ── shared helpers for tool scripts ──────────────────────────────────
  window.SKUD = Object.assign(window.SKUD || {}, {
    $, $$, store, toast,
    setError, gstinValid, clampNumber,
    fmtBytes: (b) => (b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(2) + ' MB'),
    fmtINR: (n, d = 2) => '₹' + (Math.round(n * 100) / 100).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d }),
    download(blob, name) {
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
    },
    status(msg, kind = '') { const s = $('#status'); if (s) { s.textContent = msg; s.className = 'status ' + kind; } },
    baseName: (n) => n.replace(/\.[^.]+$/, ''),
    // Wire a dropzone: returns nothing; calls onFiles(File[]) for drops, picks & pastes.
    dropzone(zoneSel, inputSel, onFiles, { accept = () => true } = {}) {
      const zone = $(zoneSel), input = $(inputSel); if (!zone || !input) return;
      const handle = (files) => { const ok = [...files].filter(accept); if (ok.length) onFiles(ok); else toast('That file type is not supported here.', 'err'); };
      zone.addEventListener('click', () => input.click());
      zone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
      input.addEventListener('change', () => { if (input.files.length) handle(input.files); input.value = ''; });
      ['dragenter', 'dragover'].forEach((ev) => zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.add('over'); }));
      ['dragleave', 'drop'].forEach((ev) => zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.remove('over'); }));
      zone.addEventListener('drop', (e) => { if (e.dataTransfer.files.length) handle(e.dataTransfer.files); });
      document.addEventListener('paste', (e) => { const fs = [...(e.clipboardData?.files || [])]; if (fs.length) handle(fs); });
    },
    // Parse "1-3, 5, 8-10" → [1,3,5,8,9,10] clamped to n
    parseRanges(str, n) {
      const out = new Set();
      String(str || '').split(/[,\s]+/).filter(Boolean).forEach((p) => {
        const m = p.match(/^(\d+)(?:-(\d+))?$/); if (!m) return;
        let a = +m[1], b = m[2] ? +m[2] : a; if (a > b) [a, b] = [b, a];
        for (let i = Math.max(1, a); i <= Math.min(n, b); i++) out.add(i);
      });
      return [...out];
    },
    // Simple list reordering by drag (HTML5 DnD) for .file-row / .pg items
    sortable(container, itemSel, onChange) {
      let drag = null;
      container.addEventListener('dragstart', (e) => { drag = e.target.closest(itemSel); if (!drag) return; drag.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
      container.addEventListener('dragend', () => { drag?.classList.remove('dragging'); drag = null; onChange?.(); });
      container.addEventListener('dragover', (e) => {
        e.preventDefault(); const over = e.target.closest(itemSel); if (!drag || !over || over === drag) return;
        const r = over.getBoundingClientRect(); const horiz = getComputedStyle(container).display === 'grid';
        const after = horiz ? (e.clientX - r.left) / r.width > 0.5 : (e.clientY - r.top) / r.height > 0.5;
        over.parentNode.insertBefore(drag, after ? over.nextSibling : over);
      });
    },
  });
})();
