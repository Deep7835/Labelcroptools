#!/usr/bin/env node
// Notify IndexNow (Bing, Yandex, Naver, Seznam) about URLs that changed in this build.
//
// Bing's webmaster guidelines name IndexNow in four separate sections and say
// "Avoid batch submissions when possible. Streaming submissions provide faster updates,
// reduce server load, and improve indexing accuracy." So this hashes every built page,
// compares against what was last submitted, and sends only the URLs that actually moved.
// Resubmitting all 72 URLs on every deploy is what earns a 429.
//
//   node scripts/indexnow.mjs          submit changed URLs
//   node scripts/indexnow.mjs --all    resubmit everything
//   node scripts/indexnow.mjs --dry    show what would be sent
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { site, indexNow } from '../src/site.config.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIST = path.join(ROOT, 'dist');
const STATE = path.join(ROOT, 'indexnow-state.json');
const all = process.argv.includes('--all');
const dry = process.argv.includes('--dry');

const fail = (m) => { console.error(`indexnow: ${m}`); process.exit(1); };
if (!indexNow?.key) fail('no key configured in src/site.config.mjs');

const sitemap = path.join(DIST, 'sitemap.xml');
if (!fs.existsSync(sitemap)) fail('dist/sitemap.xml missing — run npm run build first');
const urls = [...fs.readFileSync(sitemap, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

// Map each sitemap URL back to the file that produced it, so the hash reflects the
// content a crawler would actually receive rather than just the URL existing.
const fileFor = (url) => {
  const p = new URL(url).pathname;
  return path.join(DIST, p.endsWith('/') ? p + 'index.html' : p);
};
const hashes = {};
for (const u of urls) {
  const f = fileFor(u);
  if (fs.existsSync(f)) hashes[u] = crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex').slice(0, 16);
}

const prev = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : {};
const changed = all ? Object.keys(hashes) : Object.keys(hashes).filter((u) => prev[u] !== hashes[u]);
const removed = Object.keys(prev).filter((u) => !(u in hashes));

if (removed.length) console.log(`indexnow: ${removed.length} URL(s) no longer in the sitemap (submitting as changed so engines recrawl and see the 404)`);
const payload = [...new Set([...changed, ...removed])];

if (!payload.length) { console.log('indexnow: nothing changed, nothing to submit'); process.exit(0); }
console.log(`indexnow: ${payload.length} of ${urls.length} URL(s) changed`);
for (const u of payload.slice(0, 8)) console.log('  ' + u);
if (payload.length > 8) console.log(`  … and ${payload.length - 8} more`);
if (dry) process.exit(0);

// The key file has to be reachable before submitting or the engine answers 403.
const keyUrl = `${site.url}/${indexNow.key}.txt`;
const probe = await fetch(keyUrl, { headers: { 'cache-control': 'no-cache' } }).catch(() => null);
if (!probe?.ok) fail(`key file not reachable at ${keyUrl} — deploy before submitting`);
if ((await probe.text()).trim() !== indexNow.key) fail(`key file at ${keyUrl} does not contain the key`);

const res = await fetch(indexNow.endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: new URL(site.url).host,
    key: indexNow.key,
    keyLocation: keyUrl,
    urlList: payload.slice(0, 10000),
  }),
});
// 200 accepted, 202 accepted with key validation still pending. Both are successes.
const ok = res.status === 200 || res.status === 202;
console.log(`indexnow: ${res.status} ${res.statusText}${ok ? '' : ' — ' + (await res.text()).slice(0, 200)}`);
if (!ok) process.exit(1);
fs.writeFileSync(STATE, JSON.stringify(hashes, null, 2) + '\n');
console.log(`indexnow: state written for ${Object.keys(hashes).length} URL(s)`);
