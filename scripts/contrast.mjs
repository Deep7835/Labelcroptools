// WCAG contrast audit of the palette pairs actually used in main.css.
const hex = (h) => { h = h.replace('#',''); if (h.length===3) h = [...h].map(c=>c+c).join(''); return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)); };
const lin = (c) => { c/=255; return c<=0.03928 ? c/12.92 : ((c+0.055)/1.055)**2.4; };
const lum = (h) => { const [r,g,b]=hex(h).map(lin); return 0.2126*r+0.7152*g+0.0722*b; };
const ratio = (a,b) => { const l1=lum(a), l2=lum(b); const [hi,lo]=l1>l2?[l1,l2]:[l2,l1]; return (hi+0.05)/(lo+0.05); };

import fs from 'node:fs';
const css = fs.readFileSync(new URL('../src/assets/css/main.css', import.meta.url), 'utf8');
// Read tokens straight from the stylesheet so this never drifts from the design system.
const block = (re) => (css.match(re) || [,''])[1];
const tok = (src, name, fallback) => { const m = src.match(new RegExp('--' + name + ':\\s*(#[0-9A-Fa-f]{3,8})')); return m ? m[1] : fallback; };
const rootBlock = block(/:root \{([\s\S]*?)\n\}/);
const darkBlock = block(/:root\[data-theme="dark"\] \{([\s\S]*?)\}/);
const pick = (src, names) => Object.fromEntries(Object.entries(names).map(([k, [n, d]]) => [k, tok(src, n, d)]));
const names = { paper:['paper','#FBF9F4'], paper2:['paper-2','#F2EEE3'], card:['card','#FFFFFF'], ink:['ink','#12110F'],
  ink2:['ink-2','#3B3934'], muted:['muted','#6E6A61'], accent:['accent','#FFD23F'], ok:['ok','#177B46'],
  danger:['danger','#C53539'], info:['info','#2B66DA'], lineField:['line-field','#8A9098'], surface:['surface','#E3E7EB'], cta:['cta','#0B0C0E'], ctaInk:['cta-ink','#FFFFFF'], accent2:['accent-2','#DCE9F3'] };
const light = pick(rootBlock, names);
const dark = { ...light, ...pick(darkBlock, names) };
const pairs = (p) => [
  ['body text', p.ink, p.paper, 4.5],
  ['secondary text (.lede/.benefit p)', p.ink2, p.paper, 4.5],
  ['muted text (.muted/.dz-sub/.status)', p.muted, p.paper, 4.5],
  ['muted on card', p.muted, p.card, 4.5],
  ['muted on paper-2 (table head)', p.muted, p.paper2, 4.5],
  ['body on card', p.ink, p.card, 4.5],
  ['primary button label', p.ctaInk, p.cta, 4.5],
  ['accent text (.hl / links)', p.accent, p.paper, 4.5],
  ['accent on card', p.accent, p.card, 4.5],
  ['badge text on accent-2', p.accent, p.accent2, 4.5],
  ['body on gray bento surface', p.ink, p.surface, 4.5],
  ['muted on gray bento surface', p.muted, p.surface, 4.5],
  ['success text (.status.ok)', p.ok, p.paper, 4.5],
  ['success on card', p.ok, p.card, 4.5],
  ['error text (.status.err)', p.danger, p.paper, 4.5],
  ['error on card', p.danger, p.card, 4.5],
  ['info/note text', p.info, p.card, 4.5],
  ['focus ring vs paper (non-text 3:1)', p.info, p.paper, 3],
  ['control border vs paper (non-text 3:1)', p.lineField, p.paper, 3],
  ['control border vs card (non-text 3:1)', p.lineField, p.card, 3],
  ['control border vs paper-2 (non-text 3:1)', p.lineField, p.paper2, 3],
];

let fails = 0;
for (const [mode, p] of [['LIGHT', light], ['DARK', dark]]) {
  console.log(`\n── ${mode} ──`);
  for (const [name, fg, bg, min] of pairs(p)) {
    const r = ratio(fg, bg); const ok = r >= min;
    if (!ok) fails++;
    console.log(`${ok?'  ok ':'  FAIL'} ${r.toFixed(2).padStart(6)}:1  (min ${min})  ${name}  ${fg} on ${bg}`);
  }
}
console.log(`\n${fails} pair(s) below threshold`);
process.exit(fails ? 1 : 0);
