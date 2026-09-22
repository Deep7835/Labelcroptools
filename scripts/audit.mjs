// SEO + link audit over dist/. Run after `npm run build`.
import fs from 'node:fs'; import path from 'node:path';
const DIST='dist'; const pages=[]; const walk=(d)=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); if(e.isDirectory()) walk(p); else if(e.name.endsWith('.html')) pages.push(p);}}; walk(DIST);
const titles=new Map(), descs=new Map(); const problems=[]; let ldCount=0;
for (const p of pages) {
  const html=fs.readFileSync(p,'utf8');
  const title=(html.match(/<title>(.*?)<\/title>/)||[])[1]; const desc=(html.match(/<meta name="description" content="(.*?)">/)||[])[1];
  const h1s=(html.match(/<h1[\s>]/g)||[]).length; const canon=(html.match(/<link rel="canonical" href="(.*?)">/)||[])[1];
  if(!title) problems.push(p+': no title'); if(!desc) problems.push(p+': no description'); if(h1s!==1) problems.push(p+': h1 count '+h1s); if(!canon) problems.push(p+': no canonical');
  if(title){ if(titles.has(title)) problems.push('dup title: '+title); titles.set(title,p); if(title.length>65) problems.push(p+': title long '+title.length); }
  if(desc){ if(descs.has(desc)) problems.push('dup desc: '+p); descs.set(desc,p); }
  for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) { try { const j=JSON.parse(m[1]); ldCount++; if(!j['@type']) problems.push(p+': ld no type'); } catch(e){ problems.push(p+': bad JSON-LD '+e.message); } }
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) { const u=m[1]; const f=u.endsWith('/')?path.join(DIST,u,'index.html'):path.join(DIST,u); if(!fs.existsSync(f)) problems.push(p+': broken link '+u); }
  const og=(html.match(/<meta property="og:image" content="(.*?)">/)||[])[1]; if(!og) problems.push(p+': no og:image'); else if(!fs.existsSync(path.join(DIST, og.replace(/^https?:\/\/[^/]+/,'')))) problems.push(p+': missing og image');
  // accessibility + hardening
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt=/.test(m[0])) problems.push(p+': <img> without alt — '+m[0].slice(0,70));
    if (!/\swidth=/.test(m[0]) || !/\sheight=/.test(m[0])) problems.push(p+': <img> without width/height (CLS risk) — '+m[0].slice(0,70));
  }
  // every candidate in a srcset must resolve, not just the fallback src
  for (const m of html.matchAll(/srcset="([^"]+)"/g))
    for (const cand of m[1].split(',')) {
      const u = cand.trim().split(/\s+/)[0].split('?')[0];
      if (u.startsWith('/') && !fs.existsSync(path.join(DIST, u))) problems.push(p+': broken srcset '+u);
    }
  if(!/<meta name="viewport"/.test(html)) problems.push(p+': no viewport meta');
  if(!/<html lang="/.test(html)) problems.push(p+': no lang attribute');
  if(!/<meta http-equiv="Content-Security-Policy"/.test(html)) problems.push(p+': no CSP meta');
  if(!/<meta name="theme-color"/.test(html)) problems.push(p+': no theme-color');
  for (const m of html.matchAll(/\son(click|load|error|submit|mouseover)=/g)) problems.push(p+': inline event handler '+m[0].trim()+' (breaks CSP)');
  if(!/<link rel="icon"/.test(html)) problems.push(p+': no favicon link');
}
// site-level files
for (const f of ['robots.txt','sitemap.xml','manifest.webmanifest','404.html','favicon.svg','icon-192.png','icon-512.png','apple-touch-icon.png','_headers','sw.js','offline.html'])
  if(!fs.existsSync(path.join(DIST,f))) problems.push('missing '+f);
const headers = fs.existsSync(path.join(DIST,'_headers')) ? fs.readFileSync(path.join(DIST,'_headers'),'utf8') : '';
for (const h of ['Strict-Transport-Security','Content-Security-Policy','X-Content-Type-Options','Referrer-Policy'])
  if(!headers.includes(h)) problems.push('_headers missing '+h);
for (const f of ['privacy','terms'])
  if(!fs.existsSync(path.join(DIST,f,'index.html'))) problems.push('missing /'+f+'/ page');
const sm=fs.readFileSync(path.join(DIST,'sitemap.xml'),'utf8'); const locs=[...sm.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1].replace(/^https?:\/\/[^/]+/,'')); for(const l of locs){ if(!fs.existsSync(path.join(DIST,l,'index.html'))) problems.push('sitemap 404 '+l); }
const imgs = pages.reduce((n,p)=>n+(fs.readFileSync(p,'utf8').match(/<img\b/g)||[]).length,0);
console.log(`${pages.length} pages · ${ldCount} JSON-LD blocks · ${locs.length} sitemap URLs · ${imgs} <img> tags checked`); console.log(problems.length? problems.join('\n') : 'No problems found ✔');
process.exit(problems.length ? 1 : 0);
