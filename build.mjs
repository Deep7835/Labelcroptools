#!/usr/bin/env node
// ─── Zero-dependency static site generator ───────────────────────────────
// Reads src/site.config.mjs + src/tools.mjs and writes a fully static site
// to dist/ with per-page SEO (title, description, canonical, OG, JSON-LD),
// sitemap.xml, robots.txt, manifest, service worker and hashed assets.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { site, categories, brands, brandRotateMs, analytics, consentRequiredFor, edgeAnalytics } from './src/site.config.mjs';
import { tools } from './src/tools.mjs';
import { sprite, icon } from './src/icons.mjs';
import { blog, marketplaces } from './src/blog.mjs';
import { posts as allPosts } from './src/posts/index.mjs';
import { markdown, readingTime } from './src/markdown.mjs';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

// ── helpers ──────────────────────────────────────────────────────────────
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const write = (rel, content) => {
  const p = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};
const copyDir = (from, to) => {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    e.isDirectory() ? copyDir(a, b) : fs.copyFileSync(a, b);
  }
};
const BUILD_ID = crypto.createHash('md5').update(String(Date.now())).digest('hex').slice(0, 8);
const hashOf = (rel) => {
  const p = path.join(SRC, rel);
  return fs.existsSync(p) ? crypto.createHash('md5').update(fs.readFileSync(p)).digest('hex').slice(0, 8) : '0';
};
const asset = (rel) => `/${rel}?v=${hashOf(rel)}`;
// Cover art is generated into dist/ after the HTML is written, so it is versioned by
// build id rather than by file hash.
const genAsset = (rel) => `/${rel}?v=${BUILD_ID}`;
const abs = (p) => site.url + p;
const catOf = (slug) => categories.find((c) => c.slug === slug);
const toolsIn = (cat) => tools.filter((t) => t.category === cat);

// ── reset dist ───────────────────────────────────────────────────────────
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
copyDir(path.join(SRC, 'assets'), path.join(DIST, 'assets'));
copyDir(path.join(SRC, 'vendor'), path.join(DIST, 'vendor'));
if (fs.existsSync(path.join(SRC, 'static'))) copyDir(path.join(SRC, 'static'), DIST);

// ── JSON-LD builders ─────────────────────────────────────────────────────
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  url: site.url + '/',
  logo: abs('/icon-512.png'),
  email: site.email,
  foundingDate: String(site.foundingYear),
  areaServed: 'IN',
  sameAs: [],
};
const siteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: site.name,
  url: site.url + '/',
  inLanguage: site.lang,
  description: site.description,
  potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: site.url + '/?q={search_term_string}' }, 'query-input': 'required name=search_term_string' },
};
const breadcrumbLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.url) })),
});
const faqLd = (faq) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
const toolLd = (t) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: t.name,
  url: abs(`/${t.slug}/`),
  description: t.description,
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: catOf(t.category).name,
  operatingSystem: 'Any (Web browser)',
  browserRequirements: 'Requires JavaScript. Works in Chrome, Edge, Firefox and Safari.',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  featureList: t.features.map((f) => f.title).join(', '),
  keywords: t.keywords.join(', '),
  inLanguage: site.lang,
  dateModified: t.updated,
  author: { '@type': 'Organization', name: site.name, url: site.url + '/' },
  image: abs(`/og/${t.slug}.png`),
});
const howToLd = (t) => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: `How to use the ${t.name}`,
  description: t.tagline,
  totalTime: 'PT1M',
  tool: [{ '@type': 'HowToTool', name: 'A web browser' }],
  step: t.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.text, url: abs(`/${t.slug}/#step-${i + 1}`) })),
});

// ── analytics / consent ──────────────────────────────────────────────────
const needsConsent = consentRequiredFor.includes(analytics.provider);
// Origins the page may load a script from, and the origin that script then beacons to.
// These are different hosts for most providers, so they need separate CSP entries —
// allowing only the script host leaves the beacon itself blocked by connect-src.
const ANALYTICS_ORIGINS = {
  plausible: { script: ['https://plausible.io'], connect: ['https://plausible.io'] },
  umami: { script: [analytics.scriptUrl], connect: [analytics.scriptUrl] },
  cloudflare: { script: ['https://static.cloudflareinsights.com'], connect: ['https://cloudflareinsights.com'] },
  // Measured live: the injected beacon POSTs to /cdn-cgi/rum on our own origin, which
  // 'self' already covers. The third-party entry is a fallback if that endpoint moves.
  'cloudflare-edge': { script: ['https://static.cloudflareinsights.com'], connect: ['https://cloudflareinsights.com'] },
  // gtag loads from googletagmanager, then beacons to google-analytics. GA4 picks a
  // regional endpoint (region1.google-analytics.com and friends), so the wildcard is
  // required or collection fails in some countries while working fine in others.
  ga4: {
    script: ['https://www.googletagmanager.com'],
    connect: ['https://www.google-analytics.com', 'https://*.google-analytics.com', 'https://www.googletagmanager.com'],
    img: ['https://www.google-analytics.com'],
  },
};
// A bare origin passes straight through, including a wildcard host, which CSP accepts
// but URL() cannot parse. Anything else is a user-supplied script URL, so parse it and
// keep only the origin.
const originOf = (u) => {
  if (!u) return '';
  if (/^https:\/\/[*A-Za-z0-9.-]+$/.test(u)) return u;
  try { return new URL(u).origin; } catch { return ''; }
};

// Cloudflare Web Analytics is switched on at the zone with automatic setup, so its beacon
// is injected by the proxy no matter what `provider` says. It is therefore listed
// separately: the build emits no tag for it, but the policy still has to permit it.
const activeAnalytics = [analytics.provider, edgeAnalytics].filter(Boolean);
const analyticsOrigin = (kind = 'script') => [...new Set(
  activeAnalytics.flatMap((p) => (ANALYTICS_ORIGINS[p] || {})[kind] || []).map(originOf).filter(Boolean),
)].join(' ');
// Tag markup. Cookie-less providers load immediately; a consent-gated one is parked in
// a type="text/plain" block that core.js activates only after the visitor accepts.
const analyticsTag = () => {
  const p = analytics.provider;
  if (p === 'plausible' && analytics.domain)
    return `<script defer data-domain="${esc(analytics.domain)}" src="${esc(analytics.scriptUrl || 'https://plausible.io/js/script.js')}"></script>`;
  if (p === 'umami' && analytics.websiteId && analytics.scriptUrl)
    return `<script defer data-website-id="${esc(analytics.websiteId)}" src="${esc(analytics.scriptUrl)}"></script>`;
  if (p === 'cloudflare-edge') return ''; // injected by Cloudflare's proxy, not by us
  if (p === 'cloudflare' && analytics.websiteId)
    return `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${esc(analytics.websiteId)}"}'></script>`;
  if (p === 'ga4' && analytics.measurementId)
    return `<script type="text/plain" data-consent-src="https://www.googletagmanager.com/gtag/js?id=${esc(analytics.measurementId)}"></script>
<script type="text/plain" data-consent-inline>${ga4InlineCode}</script>`;
  return '';
};
// Privacy copy is generated from the configured provider so the page can never
// claim something the build does not actually do.
// Cloudflare's beacon runs alongside whatever provider is configured, so the privacy
// page has to mention it too. Describing only `provider` would make the page incomplete
// rather than merely terse.
const edgeAnalyticsCopy = () => edgeAnalytics
  ? '<p>Separately, Cloudflare Web Analytics runs on the CDN that serves this site. It is cookie-less, stores nothing on your device and does not build a profile of you, so it runs without a banner.</p>'
  : '';
const analyticsPrivacyCopy = () => {
  const p = analytics.provider;
  if (p === 'none') return '<p>We currently run no analytics at all. No page-view data is collected.</p>';
  if (p === 'ga4') return `<p>We use Google Analytics 4 to count visits. It sets cookies, so it only loads after you press Accept on the cookie banner. Decline and no tag is loaded at all. IP anonymisation is enabled. File contents and tool inputs are never sent.</p>${edgeAnalyticsCopy()}`;
  if (p === 'cloudflare-edge') return '<p>We use Cloudflare Web Analytics to count page views. Cloudflare adds it at the CDN that serves this site, so it is not part of the page source. It is cookie-less, stores nothing on your device and does not build a profile of you. File contents and tool inputs are never sent.</p>';
  const names = { plausible: 'Plausible', umami: 'Umami', cloudflare: 'Cloudflare Web Analytics' };
  return `<p>We use ${names[p] || p} to count page views. It is cookie-less, stores nothing on your device and does not build a profile of you. File contents and tool inputs are never sent.</p>`;
};
const cookiePrivacyCopy = () => needsConsent
  ? '<p>Analytics cookies are set only if you accept them on the cookie banner. You can change your mind any time with the “Cookie settings” link in the footer. Tool preferences are stored in localStorage, not cookies, and never leave your device.</p>'
  : '<p>The site sets no cookies at all. Tool preferences (your last chosen layout, saved seller details) are stored in your browser’s localStorage on this device and never leave it.</p>';

const consentBanner = () => needsConsent ? `
<div class="consent" id="consent" role="dialog" aria-modal="false" aria-labelledby="consent-t" hidden>
  <div class="consent-box">
    <div>
      <h2 id="consent-t">Cookies</h2>
      <p>We'd like to set analytics cookies to count visits. Nothing you upload is ever tracked — the tools run entirely on your device. See our <a href="/privacy/">Privacy Policy</a>.</p>
    </div>
    <div class="consent-actions">
      <button class="btn" id="consent-no">Decline</button>
      <button class="btn btn-primary" id="consent-yes">Accept</button>
    </div>
  </div>
</div>` : '';
const consentFooterLink = () => needsConsent ? '<button class="linklike" id="consent-reopen">Cookie settings</button>' : '';


// Inline scripts are hashed into the CSP so the policy never needs 'unsafe-inline'.
const sha = (code) => "'sha256-" + crypto.createHash('sha256').update(code, 'utf8').digest('base64') + "'";
// core.js re-creates this as a real inline <script> when the visitor accepts, so its
// hash has to be in the policy. A dynamically inserted inline script is still checked
// against script-src, and this CSP carries no 'unsafe-inline' to fall back on.
const ga4InlineCode = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${analytics.measurementId}',{anonymize_ip:true});`;
const themeCode = `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`;
const siteCode = `window.__SITE={name:${JSON.stringify(site.name)},build:${JSON.stringify(BUILD_ID)},consent:${needsConsent}};`;
const themeScript = `<script>${themeCode}</script>`;
const siteScript = `<script>${siteCode}</script>`;
// frame-ancestors is only honoured as a real header, so the meta copy leaves it out
// and _headers carries the full policy.
const cspDirectives = [
  "default-src 'self'",
  `script-src 'self' ${sha(themeCode)} ${sha(siteCode)} ${needsConsent && analytics.measurementId ? sha(ga4InlineCode) : ''} ${analyticsOrigin('script')}`.replace(/\s+/g, ' ').trim(),
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${analyticsOrigin('img')}`.trim(),
  "font-src 'self'",
  `connect-src 'self' blob: ${analyticsOrigin('connect')}`.trim(),
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
];
const csp = cspDirectives.join('; ');
const cspHeader = [...cspDirectives, "frame-ancestors 'self'"].join('; ');

// ── layout ───────────────────────────────────────────────────────────────
const head = ({ title, description, url, ogImage, extraLd = [], noindex = false, preload = '' }) => `<!doctype html>
<html lang="${site.lang}">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${site.googleSiteVerification ? `<meta name="google-site-verification" content="${esc(site.googleSiteVerification)}">\n` : ''}<meta name="robots" content="${noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'}">
<link rel="canonical" href="${abs(url)}">
<link rel="alternate" hreflang="en-IN" href="${abs(url)}">
<link rel="alternate" hreflang="en" href="${abs(url)}">
<link rel="alternate" hreflang="x-default" href="${abs(url)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="${site.locale}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(url)}">
<meta property="og:image" content="${abs(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(title)}">
<meta name="twitter:card" content="summary_large_image">
${site.twitter ? `<meta name="twitter:site" content="${site.twitter}">\n` : ''}<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${abs(ogImage)}">
<meta name="theme-color" content="#E8EBEE" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0C0D0F" media="(prefers-color-scheme: dark)">
<meta name="color-scheme" content="light dark">
<meta name="application-name" content="${esc(site.name)}">
<meta name="apple-mobile-web-app-title" content="${esc(site.name)}">
<meta name="format-detection" content="telephone=no">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="alternate" type="application/rss+xml" title="${esc(site.name)} — ${esc(blog.title)}" href="/blog/rss.xml">
<link rel="preload" href="/assets/fonts/outfit-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/instrument-latin.woff2" as="font" type="font/woff2" crossorigin>
${preload || ''}
<link rel="stylesheet" href="${asset('assets/css/main.css')}">
${themeScript}
${analyticsTag()}
${ld(orgLd)}
${ld(siteLd)}
${extraLd.map(ld).join('\n')}
</head>`;

const navTools = () => categories
  .map((c) => `<div class="mega-col"><h3>${icon(c.icon)} <a href="/${c.slug}/">${c.short}</a></h3><ul>${toolsIn(c.slug)
    .map((t) => `<li><a href="/${t.slug}/">${t.name}</a></li>`).join('')}</ul></div>`).join('');

const header = (active = '') => `
<a class="skip" href="#main">Skip to content</a>
${sprite}
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/" aria-label="${esc(site.name)} home">
      <span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32"><rect x="1" y="1" width="30" height="30" rx="9" fill="var(--cta)"/><path d="M9 11h14M9 16h14M9 21h8" stroke="var(--cta-ink)" stroke-width="2.6" stroke-linecap="round"/></svg></span>
      <span class="brand-name">${esc(site.name)}</span>
    </a>
    <nav class="main-nav" aria-label="Primary">
      <div class="has-mega">
        <button class="nav-btn" aria-expanded="false" aria-controls="mega">All tools ${icon('chevron', 'ic ic-sm')}</button>
        <div class="mega" id="mega">${navTools()}</div>
      </div>
      ${categories.map((c) => `<a href="/${c.slug}/" ${active === c.slug ? 'aria-current="page"' : ''}>${c.short}</a>`).join('')}
      <a href="${blog.base}/" ${active === 'blog' ? 'aria-current="page"' : ''}>Guides</a>
    </nav>
    <div class="header-actions">
      <button class="icon-btn" id="search-btn" aria-label="Search tools (Ctrl+K)" title="Search · Ctrl K">${icon('search')}<kbd>⌘K</kbd></button>
      <button class="icon-btn" id="theme-btn" aria-label="Toggle dark mode">${icon('sun', 'ic sun')}${icon('moon', 'ic moon')}</button>
      <a class="btn btn-primary header-cta" href="#tools">Browse tools</a>
      <button class="icon-btn menu-btn" id="menu-btn" aria-label="Open menu" aria-expanded="false">${icon('menu')}</button>
    </div>
  </div>
  <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile" hidden>${navTools()}</nav>
</header>`;

// Footer tool columns: exactly four links each, so the grid reads as clean rows
// instead of the 7-2 ragged columns the raw category counts produce (PDF Tools has
// seven tools, Image Tools has two). Each heading links to its hub, which carries
// the tools that do not fit here; nothing becomes unreachable.
const FOOTER_COLS = [
  { title: 'Shipping labels',  href: '/label-tools/', slugs: ['meesho-label-cropper', 'flipkart-label-cropper', 'amazon-label-cropper', 'shipping-label-cropper'] },
  { title: 'PDF tools',        href: '/pdf-tools/',   slugs: ['pdf-crop', 'pages-per-sheet', 'merge-pdf', 'split-pdf'] },
  { title: 'Calculators & GST', href: '/calculators/', slugs: ['profit-calculator', 'gst-calculator', 'volumetric-weight-calculator', 'gst-invoice-generator'] },
  { title: 'Generators & images', href: '/generators/', slugs: ['barcode-generator', 'qr-code-generator', 'product-image-resizer', 'image-compressor'] },
];

// Fail the build rather than ship a lopsided footer or a dead link.
for (const col of FOOTER_COLS) {
  if (col.slugs.length !== 4) throw new Error(`Footer column "${col.title}" has ${col.slugs.length} links, expected 4`);
  for (const slug of col.slugs) if (!tools.some((t) => t.slug === slug)) throw new Error(`Footer column "${col.title}" links to unknown tool "${slug}"`);
}
if (!categories.every((c) => FOOTER_COLS.some((col) => col.href === `/${c.slug}/`) || c.slug === 'image-tools'))
  throw new Error('A category hub lost its footer link');

// Footer-only short labels. The full name is right everywhere else, but at footer
// column width this one wraps to two lines and breaks the four-row rhythm.
const FOOTER_LABEL = { 'volumetric-weight-calculator': 'Volumetric Weight' };

const footerCol = ({ title, href, slugs }) => `<div class="footer-col"><h3><a href="${href}">${esc(title)}</a></h3><ul>${slugs
  .map((slug) => tools.find((t) => t.slug === slug))
  .map((t) => `<li><a href="/${t.slug}/">${esc(FOOTER_LABEL[t.slug] || t.name)}</a></li>`).join('')}</ul></div>`;

const footer = () => `
<footer class="site-footer">
  <div class="barcode-strip" aria-hidden="true"></div>
  <div class="wrap footer-grid">
    <div class="footer-brand">
      <a class="brand" href="/"><span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32"><rect x="2" y="2" width="28" height="28" rx="7" fill="var(--accent)" stroke="var(--ink)" stroke-width="2"/><path d="M9 11h14M9 16h14M9 21h8" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/></svg></span><span class="brand-name">${esc(site.name)}</span></a>
      <p>${esc(site.tagline)}. Every tool runs in your browser — your PDFs, photos and order data never leave your device.</p>
      <p class="muted">Made in India 🇮🇳 for sellers on Meesho, Flipkart, Amazon and beyond. Not affiliated with any marketplace.</p>
      <a class="footer-all" href="/#tools">Browse all ${tools.length} tools ${icon('arrow', 'ic ic-sm')}</a>
    </div>
    ${FOOTER_COLS.map(footerCol).join('')}
    <div class="footer-col"><h3><a href="${blog.base}/">Seller guides</a></h3><ul>${marketplaces.map((m) => `<li><a href="${blog.base}/${m.slug}/">${m.name} guides</a></li>`).join('')}<li><a href="${blog.base}/rss.xml">RSS feed</a></li></ul></div>
  </div>
  <div class="wrap footer-bottom">
    <p>© ${new Date().getFullYear()} ${esc(site.name)}. Free forever.</p>
    <nav aria-label="Footer"><a href="${blog.base}/">Guides</a><a href="/about/">About</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/contact/">Contact</a><a href="/sitemap.xml">Sitemap</a>${consentFooterLink()}</nav>
  </div>
</footer>
<div class="cmdk" id="cmdk" hidden role="dialog" aria-modal="true" aria-label="Search tools">
  <div class="cmdk-box">
    <div class="cmdk-input">${icon('search')}<input type="search" id="cmdk-q" placeholder="Search tools… e.g. crop, meesho, gst" autocomplete="off" aria-label="Search tools"><kbd>Esc</kbd></div>
    <ul class="cmdk-list" id="cmdk-list" role="listbox"></ul>
  </div>
</div>
${consentBanner()}
<div class="toast" id="toast" role="status" aria-live="polite" hidden></div>
${siteScript}
<script src="${asset('assets/js/core.js')}" defer></script>`;

const page = (opts, body, { active = '', scripts = '' } = {}) => `${head(opts)}
<body>
${header(active)}
<main id="main">${body}</main>
${footer()}
${scripts}
</body>
</html>`;

// ── components ───────────────────────────────────────────────────────────
// Rotating marketplace-logo slot used in the hero H1. The real phrase stays in the
// heading as screen-reader text, so the H1 still reads "…for Meesho, Flipkart & Amazon sellers."
const brandDims = (() => {
  try { return JSON.parse(fs.readFileSync(path.join(SRC, 'assets/img/brands/index.json'), 'utf8')); }
  catch { return {}; }
})();
const brandPhrase = brands.map((b) => b.name).join(', ').replace(/, ([^,]*)$/, ' & $1');
const brandRotator = () => {
  const items = brands.map((b, i) => {
    const d = brandDims[b.slug];
    // alt="" is deliberate: the logo is decorative here because the H1 already carries
    // "Meesho, Flipkart & Amazon" as screen-reader text.
    const inner = d
      ? `<picture><source srcset="${asset(`assets/img/brands/${b.slug}.webp`)}" type="image/webp"><img src="${asset(`assets/img/brands/${b.slug}.png`)}" width="${d.w}" height="${d.h}" alt="" decoding="async"${i === 0 ? ' fetchpriority="high"' : ''}></picture>`
      : `<span class="br-word" data-word="${esc(b.name)}"></span>`;
    // data-ar lets the slot size itself from the logo's aspect ratio without waiting for the image to load.
    return `<span class="br-item${i === 0 ? ' is-active' : ''}" data-i="${i}"${d ? ` data-ar="${(d.w / d.h).toFixed(3)}"` : ''}>${inner}</span>`;
  });
  const first = brandDims[brands[0].slug];
  const ar = first ? (first.w / first.h).toFixed(3) : 3.2;
  return `<span class="brand-rotator" aria-hidden="true" style="--ar:${ar}" data-interval="${brandRotateMs}">${items.join('')}</span><span class="sr-only">${esc(brandPhrase)}</span>`;
};

const toolCard = (t) => `<a class="tool-card" href="/${t.slug}/" data-cat="${t.category}" data-name="${esc(t.name.toLowerCase())}" data-kw="${esc(t.keywords.join(' ').toLowerCase())}">
  <span class="tool-icon">${icon(t.icon)}</span>
  ${t.badge ? `<span class="badge">${esc(t.badge)}</span>` : ''}
  <span class="tool-name">${esc(t.name)}</span>
  <span class="tool-short">${esc(t.short)}</span>
  <span class="tool-go">${icon('arrow')}</span>
</a>`;

const breadcrumbs = (items) => `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items
  .map((it, i) => (i === items.length - 1 ? `<li aria-current="page">${esc(it.name)}</li>` : `<li><a href="${it.url}">${esc(it.name)}</a></li>`)).join('')}</ol></nav>`;

const faqBlock = (faq, h = 'Frequently asked questions') => `<section class="faq" id="faq"><h2>${h}</h2>${faq
  .map((f) => `<details class="faq-item"><summary>${esc(f.q)}</summary><div class="faq-a"><p>${esc(f.a)}</p></div></details>`).join('')}</section>`;

// ── tool page ────────────────────────────────────────────────────────────
const toolPage = (t) => {
  const cat = catOf(t.category);
  const url = `/${t.slug}/`;
  const crumbs = [{ name: 'Home', url: '/' }, { name: cat.short, url: `/${cat.slug}/` }, { name: t.name, url }];
  const libs = (t.libs || []).join(',');
  const related = t.related.map((s) => tools.find((x) => x.slug === s));
  const body = `
<div class="wrap">
  ${breadcrumbs(crumbs)}
  <section class="tool-hero">
    <div class="tool-hero-icon">${icon(t.icon)}</div>
    <h1>${esc(t.h1)}</h1>
    <p class="lede">${esc(t.tagline)}</p>
    <ul class="trust" aria-label="Highlights">
      <li>${icon('check')} Free forever</li><li>${icon('shield')} Nothing uploaded</li><li>${icon('zap')} Unlimited use</li><li>${icon('wifioff')} Works offline</li>
    </ul>
  </section>
  <section class="tool-panel ticket" id="tool" data-libs="${libs}" aria-label="${esc(t.name)}">
    <div class="ticket-tab">${esc(cat.short)} · ${esc(t.name)}</div>
    ${t.panel}
    <noscript><p class="note">This tool needs JavaScript. Enable it in your browser to use the ${esc(t.name)}.</p></noscript>
  </section>

  <article class="tool-content">
    <section class="howto" id="how-to">
      <h2>How to use the ${esc(t.name)}</h2>
      <ol class="steps">${t.steps.map((s, i) => `<li id="step-${i + 1}"><span class="step-n">0${i + 1}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></li>`).join('')}</ol>
    </section>
    <section class="why">
      <h2>Why sellers use this ${esc(t.name.toLowerCase())}</h2>
      ${t.intro.map((p) => `<p>${esc(p)}</p>`).join('')}
    </section>
    <section class="benefits">
      <h2>What you get</h2>
      <div class="grid-2">${t.benefits.map((b) => `<div class="benefit"><h3>${esc(b.title)}</h3><p>${esc(b.text)}</p></div>`).join('')}</div>
    </section>
    <section class="features">
      <h2>Features of the ${esc(t.name)}</h2>
      <div class="grid-3">${t.features.map((f) => `<div class="feature">${icon('check')}<div><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></div></div>`).join('')}</div>
    </section>
    ${faqBlock(t.faq)}
    <div class="cta-band">
      <div>
        <h2>Ready to run today's batch?</h2>
        <p>${esc(t.tagline)}</p>
      </div>
      <a class="btn btn-primary btn-lg" href="#tool">${icon(t.icon)} Open the ${esc(t.name)}</a>
    </div>
    <section class="related">
      <h2>Related tools</h2>
      <div class="tool-grid">${related.map(toolCard).join('')}</div>
    </section>
    <p class="updated muted">Last updated ${t.updated}. ${esc(site.name)} is an independent tool site and is not affiliated with Meesho, Flipkart or Amazon.</p>
  </article>
</div>`;
  const scripts = `<script src="${asset('assets/js/engine.js')}" defer></script>\n<script src="${asset(`assets/js/tools/${t.script}.js`)}" defer></script>`;
  return page(
    { title: t.title, description: t.description, url, ogImage: `/og/${t.slug}.png`, extraLd: [toolLd(t), breadcrumbLd(crumbs), howToLd(t), faqLd(t.faq)] },
    body,
    { active: cat.slug, scripts },
  );
};

// ── category page ────────────────────────────────────────────────────────
const categoryPage = (c) => {
  const url = `/${c.slug}/`;
  const list = toolsIn(c.slug);
  const crumbs = [{ name: 'Home', url: '/' }, { name: c.name, url }];
  const faq = list.slice(0, 4).map((t) => t.faq[0]);
  const body = `
<div class="wrap">
  ${breadcrumbs(crumbs)}
  <section class="cat-hero">
    <div class="tool-hero-icon">${icon(c.icon)}</div>
    <h1>${esc(c.name)}</h1>
    <p class="lede">${esc(c.intro)}</p>
  </section>
  <section class="tool-grid big" aria-label="${esc(c.name)}">${list.map(toolCard).join('')}</section>
  ${faqBlock(faq, `Common questions about ${esc(c.name.toLowerCase())}`)}
  <section class="related"><h2>Other categories</h2><div class="cat-links">${categories.filter((x) => x.slug !== c.slug).map((x) => `<a class="chip" href="/${x.slug}/">${icon(x.icon)} ${esc(x.name)}</a>`).join('')}</div></section>
</div>`;
  const itemList = { '@context': 'https://schema.org', '@type': 'ItemList', name: c.name, itemListElement: list.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, url: abs(`/${t.slug}/`) })) };
  return page({ title: c.title, description: c.description, url, ogImage: `/og/${c.slug}.png`, extraLd: [breadcrumbLd(crumbs), itemList, faqLd(faq)] }, body, { active: c.slug });
};

// ── home page ────────────────────────────────────────────────────────────
const homeFaq = [
  { q: 'Are these tools really free?', a: `Yes. Every tool on ${site.name} is free with no signup, no daily limits and no watermark. The site is supported by the sellers who share it.` },
  { q: 'Do you upload my label PDFs or photos?', a: 'No. All processing — cropping, merging, resizing, calculations — happens inside your browser using WebAssembly and the Canvas API. Files never leave your device, which is why the tools also work offline.' },
  { q: 'Which marketplaces are supported?', a: 'Label croppers are tuned for Meesho, Flipkart and Amazon.in, with a universal cropper that auto-detects the format and a manual PDF crop for anything else. Calculators and generators work for any channel.' },
  { q: 'Can I use these tools on my phone?', a: 'Yes. Everything is responsive and touch-friendly. Heavy PDF jobs are faster on a laptop, but cropping a day’s labels on a phone works fine.' },
  { q: 'Is there a limit on file size or pages?', a: 'No fixed limit. Processing happens in your device’s memory, so very large files depend on your RAM. Several hundred pages is routine.' },
];
const homePage = () => {
  const body = `
<section class="hero">
  <div class="wrap hero-bento">

    <div class="bento bento-copy">
      <p class="eyebrow">${tools.length} free tools · no signup · nothing uploaded</p>
      <h1 class="hero-h1">Free tools for ${brandRotator()}<br>sellers. <span class="hl">Print-ready.</span></h1>
      <p class="lede">Crop shipping labels, sort by SKU, print 4 per sheet, build picklists, barcodes and GST invoices — all inside your browser.</p>
      <div class="hero-cta">
        <a class="btn btn-primary btn-lg" href="/meesho-label-cropper/">Start cropping free ${icon('arrow')}</a>
        <div class="proof">
          <span class="proof-icons" aria-hidden="true">${['scissors', 'list', 'calculator'].map((i) => `<span class="proof-dot">${icon(i, 'ic ic-sm')}</span>`).join('')}</span>
          <span class="proof-text"><b>${tools.length} tools</b><br>free forever</span>
        </div>
      </div>
    </div>

    <div class="bento bento-drop">
      <div class="dropzone" id="home-drop" tabindex="0" role="button" aria-label="Drop any shipping label PDF to auto-detect the marketplace">
        <input type="file" id="home-file" accept="application/pdf" hidden>
        <div class="dz-inner">
          <span class="dz-tab">ANY LABEL PDF</span>
          ${icon('upload', 'ic ic-xl')}
          <p class="dz-title">Drop any shipping label PDF</p>
          <p class="dz-sub">We detect Meesho / Flipkart / Amazon and open the right cropper</p>
        </div>
      </div>
      <p class="status" id="home-status" role="status" aria-live="polite"></p>
      <a class="float-pill" href="#tools">Browse all ${tools.length} tools ${icon('plus', 'ic ic-sm')}</a>
    </div>

    <div class="bento bento-icons" aria-hidden="true">
      <span class="ic-float f1">${icon('scissors')}</span>
      <span class="ic-float f2">${icon('grid')}</span>
      <span class="ic-float f3">${icon('calculator')}</span>
      <span class="ic-float f4">${icon('barcode')}</span>
      <span class="ic-float f5">${icon('qr')}</span>
      <span class="ic-float f6">${icon('crop')}</span>
      <span class="ic-float f7">${icon('receipt')}</span>
      <span class="ic-float f8">${icon('image')}</span>
      <span class="ic-float f9">${icon('list')}</span>
    </div>

    <div class="bento bento-list">
      ${['meesho-label-cropper', 'picklist-generator'].map((sl) => { const t = tools.find((x) => x.slug === sl); return `
      <a class="list-row" href="/${t.slug}/">
        <span class="row-icon">${icon(t.icon)}</span>
        <span class="row-body"><b>${esc(t.name)}</b><span class="row-sub">${esc(t.short)}</span></span>
        <span class="row-go">${icon('arrowup')}</span>
      </a>`; }).join('')}
    </div>

    <div class="bento bento-stat">
      <b class="stat-num">300</b>
      <p>labels cropped, sorted and printed in seconds — not one page at a time.</p>
    </div>

    <div class="bento bento-tag">
      <div class="tag-top">
        <span class="pill-tag">Privacy by default</span>
        <a class="round-btn" href="/privacy/" aria-label="Read the privacy policy">${icon('arrowup')}</a>
      </div>
      <h2>Nothing is ever uploaded</h2>
      <p>PDFs and photos are processed on your own device, so order data never leaves it.</p>
    </div>

  </div>
</section>

<section class="wrap tools-section" id="tools">
  <div class="section-head">
    <h2>All ${tools.length} tools</h2>
    <div class="filter">
      <input type="search" id="tool-filter" placeholder="Filter tools… (e.g. crop, gst, barcode)" aria-label="Filter tools">
      <div class="chips" role="group" aria-label="Filter by category">
        <button class="chip active" data-cat="all">All</button>
        ${categories.map((c) => `<button class="chip" data-cat="${c.slug}">${icon(c.icon)} ${esc(c.short)}</button>`).join('')}
      </div>
    </div>
  </div>
  ${categories.map((c) => `<div class="cat-block" data-cat="${c.slug}"><h3 class="cat-title"><a href="/${c.slug}/">${icon(c.icon)} ${esc(c.name)}</a> <span class="muted">${toolsIn(c.slug).length}</span></h3><div class="tool-grid">${toolsIn(c.slug).map(toolCard).join('')}</div></div>`).join('')}
  <p class="empty" id="no-results" hidden>No tool matches that — try “label”, “pdf”, “gst” or “image”.</p>
</section>

<section class="wrap why-us">
  <h2>Built like a packing station, not a SaaS funnel</h2>
  <div class="grid-4">
    <div class="why-card">${icon('shield')}<h3>Nothing leaves your device</h3><p>PDF and image processing runs in your browser via WebAssembly. Customer addresses, order numbers and photos are never uploaded — there is no server to leak from.</p></div>
    <div class="why-card">${icon('tag')}<h3>Made for Indian marketplaces</h3><p>Croppers understand Meesho, Flipkart and Amazon label layouts, courier names like Valmo and Xpressbees, and GST slabs — not generic “PDF tools” with a label sticker on top.</p></div>
    <div class="why-card">${icon('zap')}<h3>Batch first</h3><p>Every tool is built for the 300-order day: multi-file input, one-click sorting, ZIP output, and previews that don’t block the download.</p></div>
    <div class="why-card">${icon('wifioff')}<h3>Works offline, free forever</h3><p>Install it as an app and it keeps working when the internet drops mid-dispatch. No signup, no plan, no watermark.</p></div>
  </div>
</section>

<section class="wrap how-it-works">
  <h2>Dispatch in three steps</h2>
  <ol class="steps big">
    <li><span class="step-n">01</span><div><h3>Drop the day’s label PDF</h3><p>Meesho, Flipkart or Amazon — one file or ten. Detection and cropping happen instantly, locally.</p></div></li>
    <li><span class="step-n">02</span><div><h3>Print the picklist, then the labels</h3><p>Generate a SKU-wise picklist to pull stock, then print sorted labels — thermal or 4 per A4.</p></div></li>
    <li><span class="step-n">03</span><div><h3>Pack, insert, ship</h3><p>Slip in a thank-you card with a WhatsApp QR and hand the courier a stack sorted by partner.</p></div></li>
  </ol>
</section>

<div class="wrap">${faqBlock(homeFaq)}</div>`;
  const itemList = { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Free e-commerce seller tools', itemListElement: tools.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, url: abs(`/${t.slug}/`) })) };
  return page(
    { title: `${site.name} – Free Meesho, Flipkart & Amazon Seller Tools`, description: site.description, url: '/', ogImage: '/og/home.png', extraLd: [itemList, faqLd(homeFaq)], preload: brandDims[brands[0].slug] ? `<link rel="preload" href="${asset(`assets/img/brands/${brands[0].slug}.webp`)}" as="image" type="image/webp">` : '' },
    body,
    { scripts: `<script src="${asset('assets/js/engine.js')}" defer></script><script src="${asset('assets/js/tools/home.js')}" defer></script>` },
  );
};

// ── static pages ─────────────────────────────────────────────────────────
const staticPage = ({ slug, title, description, h1, html, noindex = false }) => {
  const url = `/${slug}/`;
  const crumbs = [{ name: 'Home', url: '/' }, { name: h1, url }];
  const body = `<div class="wrap narrow">${breadcrumbs(crumbs)}<article class="prose"><h1>${esc(h1)}</h1>${html}</article></div>`;
  return page({ title, description, url, ogImage: '/og/home.png', extraLd: [breadcrumbLd(crumbs)], noindex }, body);
};
const pages = [
  {
    slug: 'about', h1: `About ${site.name}`, title: `About ${site.name} – Free, Private Tools for Indian Sellers`,
    description: `${site.name} builds free browser-based tools for Meesho, Flipkart and Amazon sellers. Learn why everything runs locally and who it is for.`,
    html: `
<p>${esc(site.name)} started at a packing table. Every marketplace hands sellers the same badly shaped PDF, every printer wastes the same half page, and every “free online tool” wants the file uploaded to a server somewhere along with the customer’s address. We thought the tools sellers use fifty times a day should be fast, private and free — so we built them that way.</p>
<h2>What we believe</h2>
<ul>
<li><strong>Your data is yours.</strong> Every tool processes files inside your browser. There is no upload endpoint, no queue, no “your file will be deleted after 1 hour”. It never arrives.</li>
<li><strong>Built for the Indian marketplace reality.</strong> Valmo and Xpressbees, GST slabs, 4 × 6 thermal rolls and ₹ 20 fixed fees. Tools should know these things.</li>
<li><strong>Batch is the default.</strong> A tool that handles one page at a time is a demo, not a tool.</li>
<li><strong>Free means free.</strong> No signup wall, no daily limit, no watermark, no premium tier for the useful features.</li>
</ul>
<h2>Who it is for</h2>
<p>Suppliers on Meesho, sellers on Flipkart and Amazon.in, D2C brands shipping through aggregators, and the packers and accountants who work with them. If you print labels, count SKUs, or write GST invoices, the tools are for you.</p>
<h2>How it works technically</h2>
<p>PDFs are rendered and analysed with PDF.js and rebuilt with pdf-lib — both open-source libraries running as JavaScript/WebAssembly in your browser. Images are processed with the Canvas API. The site is a set of static pages served from a CDN; there is no application server and no database of user files.</p>
<h2>Not affiliated</h2>
<p>${esc(site.name)} is independent and is not affiliated with, endorsed by, or connected to Meesho, Flipkart, Amazon or any courier company. Marketplace names are used only to describe which label formats the tools support.</p>
<p>Questions or a tool request? <a href="/contact/">Contact us</a>.</p>`,
  },
  {
    slug: 'privacy', h1: 'Privacy Policy', title: `Privacy Policy – ${site.name}`,
    description: `${site.name} does not upload, store or see your files. Read exactly what data the site handles and what it never touches.`,
    html: `
<p class="muted">Last updated ${site.updated}</p>
<h2>The short version</h2>
<p>Your files never leave your device. We do not have a server that receives PDFs, images, invoice details or calculator inputs. There is nothing for us to store, sell or leak.</p>
<h2>Files you open in a tool</h2>
<p>PDFs and images are read into your browser’s memory, processed there, and offered back to you as a download. They are not transmitted anywhere. Closing the tab discards them.</p>
<h2>Data saved in your browser</h2>
<p>Some tools remember your preferences (for example the last output layout you picked, or your seller details in the GST Invoice Generator) using your browser’s localStorage. This data stays on your device and can be cleared through your browser’s “clear site data” option.</p>
<h2>Analytics</h2>
${analyticsPrivacyCopy()}
<h2>Cookies</h2>
${cookiePrivacyCopy()}
<h2>Offline / installed app</h2>
<p>A service worker caches the site’s own files so it works offline. It does not cache your documents.</p>
<h2>Contact</h2>
<p>Privacy questions: <a href="mailto:${site.email}">${site.email}</a>.</p>`,
  },
  {
    slug: 'terms', h1: 'Terms of Use', title: `Terms of Use – ${site.name}`,
    description: `Terms for using ${site.name}'s free seller tools.`,
    html: `
<p class="muted">Last updated ${site.updated}</p>
<p>By using ${esc(site.name)} you agree to these terms.</p>
<h2>Free service, provided as-is</h2>
<p>The tools are provided free of charge, “as is”, without warranty of any kind. We work hard to make them accurate, but you are responsible for checking output before printing, shipping or filing — especially calculator results and invoices, which depend on the numbers you enter and on marketplace fee schedules that change.</p>
<h2>Acceptable use</h2>
<p>Use the tools only for lawful purposes and for documents you are entitled to process. Do not attempt to overload, reverse-engineer for malicious purposes, or misrepresent the service.</p>
<h2>Trademarks</h2>
<p>Meesho, Flipkart, Amazon and courier names are trademarks of their respective owners and are used only to describe compatibility. ${esc(site.name)} is not affiliated with them.</p>
<h2>Liability</h2>
<p>To the fullest extent permitted by law, ${esc(site.name)} is not liable for any loss arising from the use of these tools, including printing errors, mis-shipped parcels or tax calculations.</p>
<h2>Changes</h2>
<p>We may update these terms and the tools at any time. Continued use means acceptance of the current terms.</p>`,
  },
  {
    slug: 'contact', h1: 'Contact', title: `Contact – ${site.name}`,
    description: `Request a tool, report a label format that did not crop correctly, or say hello to the ${site.name} team.`,
    html: `
<p>We read everything. The most useful message you can send is “this label format didn’t crop right” with a sample PDF (remove customer details first).</p>
<div class="contact-cards">
  <a class="ticket contact-card" href="mailto:${site.email}">${icon('mail', 'ic ic-lg')}<h3>Email</h3><p>${site.email}</p></a>
  ${site.whatsapp ? `<a class="ticket contact-card" href="https://wa.me/${site.whatsapp}" rel="noopener">${icon('chat', 'ic ic-lg')}<h3>WhatsApp</h3><p>Chat with support</p></a>` : ''}
</div>
<h2>Request a tool</h2>
<p>Tell us the marketplace, the job you do by hand today, and what the output should look like. Popular requests get built.</p>
<h2>Report a bug</h2>
<p>Include the tool name, your browser, and what you expected to happen. Never send files containing customer data.</p>`,
  },
];

// ── blog ─────────────────────────────────────────────────────────────────
const posts = [...allPosts].sort((a, b) => (a.published < b.published ? 1 : -1));
const mp = (slug) => marketplaces.find((m) => m.slug === slug);
const postsOf = (slug) => posts.filter((p) => p.marketplace === slug);
const postUrl = (p) => `${blog.base}/${p.slug}/`;
const fmtDate = (d) => new Date(d + 'T00:00:00Z').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

// Cover art is 1200x750 (8:5). Width/height are always emitted so the browser can
// reserve the box before the image lands, which keeps CLS at zero.
const coverPic = (p, { cls = 'cover', sizes = '(max-width: 720px) 92vw, 380px', eager = false } = {}) => `<picture>
  <source type="image/webp" sizes="${sizes}" srcset="${genAsset(`covers/${p.slug}-600.webp`)} 600w, ${genAsset(`covers/${p.slug}.webp`)} 1200w">
  <img class="${cls}" src="${genAsset(`covers/${p.slug}-600.png`)}" sizes="${sizes}" srcset="${genAsset(`covers/${p.slug}-600.png`)} 600w, ${genAsset(`covers/${p.slug}.png`)} 1200w" width="1200" height="750" alt="${esc(p.coverAlt)}" decoding="async" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>
</picture>`;

const meta = (p) => `${esc(mp(p.marketplace).name)} <span class="dot">·</span> <time datetime="${p.published}">${fmtDate(p.published)}</time>`;

const postCard = (p) => `<a class="post-card" href="${postUrl(p)}">
  <span class="post-thumb">${coverPic(p, { cls: 'cover', sizes: '(max-width: 720px) 92vw, 330px' })}</span>
  <span class="post-mp">${esc(mp(p.marketplace).name)}</span>
  <span class="post-title">${esc(p.title)}</span>
  <span class="post-excerpt">${esc(p.excerpt)}</span>
  <span class="post-meta"><time datetime="${p.published}">${fmtDate(p.published)}</time> · ${readingTime(p.body)} min read</span>
</a>`;

const blogLd = (p) => ({
  '@context': 'https://schema.org', '@type': 'BlogPosting',
  headline: p.title, description: p.description,
  datePublished: p.published, dateModified: p.updated,
  author: { '@type': 'Organization', name: blog.author.name, url: site.url + '/' },
  publisher: { '@type': 'Organization', name: site.name, logo: { '@type': 'ImageObject', url: abs('/icon-512.png') } },
  mainEntityOfPage: { '@type': 'WebPage', '@id': abs(postUrl(p)) },
  image: { '@type': 'ImageObject', url: abs(`/covers/${p.slug}.png`), width: 1200, height: 750, caption: p.coverAlt },
  inLanguage: site.lang, articleSection: mp(p.marketplace).name,
  keywords: p.keyword, wordCount: p.body.split(/\s+/).filter(Boolean).length,
  isAccessibleForFree: true,
});

const postPage = (p) => {
  const m = mp(p.marketplace);
  const url = postUrl(p);
  const { html, headings } = markdown(p.body);
  const crumbs = [{ name: 'Home', url: '/' }, { name: blog.title, url: blog.base + '/' }, { name: m.name, url: `${blog.base}/${m.slug}/` }, { name: p.title, url }];
  const related = posts.filter((x) => x.slug !== p.slug && x.marketplace === p.marketplace).slice(0, 3);
  const relTools = (p.tools || []).map((sl) => tools.find((t) => t.slug === sl)).filter(Boolean);
  const body = `
<div class="wrap narrow">
  ${breadcrumbs(crumbs)}
  <article class="post">
    <header class="post-head">
      <a class="post-mp-link" href="${blog.base}/${m.slug}/">${esc(m.name)} guides</a>
      <h1>${esc(p.title)}</h1>
      <p class="lede">${esc(p.excerpt)}</p>
      <p class="post-byline">
        <span>${esc(blog.author.name)}</span> ·
        <time datetime="${p.published}">${fmtDate(p.published)}</time>
        ${p.updated !== p.published ? ` · updated <time datetime="${p.updated}">${fmtDate(p.updated)}</time>` : ''}
        · ${readingTime(p.body)} min read
      </p>
    </header>
    <figure class="post-hero">${coverPic(p, { cls: 'cover', sizes: '(max-width: 860px) 92vw, 800px', eager: true })}</figure>
    ${headings.length > 2 ? `<nav class="toc" aria-label="On this page"><p class="toc-t">On this page</p><ol>${headings.map((h) => `<li><a href="#${h.id}">${esc(h.text)}</a></li>`).join('')}</ol></nav>` : ''}
    <div class="prose post-body">${html}</div>
    ${relTools.length ? `<section class="post-tools"><h2>Tools used in this guide</h2><div class="tool-grid">${relTools.map(toolCard).join('')}</div></section>` : ''}
    ${p.faq?.length ? faqBlock(p.faq) : ''}
    ${related.length ? `<section class="related"><h2>More ${esc(m.name)} guides</h2><div class="post-grid">${related.map(postCard).join('')}</div></section>` : ''}
    <p class="updated muted">Published ${fmtDate(p.published)}${p.updated !== p.published ? `, updated ${fmtDate(p.updated)}` : ''}. ${esc(site.name)} is an independent tool site and is not affiliated with Meesho, Flipkart or Amazon. Marketplace fees and policies change — always confirm current rules in your seller panel.</p>
  </article>
</div>`;
  return page(
    { title: p.metaTitle, description: p.description, url, ogImage: `/og/post-${p.slug}.png`,
      extraLd: [blogLd(p), breadcrumbLd(crumbs), ...(p.faq?.length ? [faqLd(p.faq)] : [])] },
    body, { active: 'blog' },
  );
};

const mpHubPage = (m) => {
  const url = `${blog.base}/${m.slug}/`;
  const list = postsOf(m.slug);
  const crumbs = [{ name: 'Home', url: '/' }, { name: blog.title, url: blog.base + '/' }, { name: m.name, url }];
  const [top, ...rest] = list;
  const body = `
<div class="wrap">
  ${breadcrumbs(crumbs)}
  <div class="blog-head">
    <div>
      <h1 class="display">${esc(m.name)} guides</h1>
      <p class="lede">${esc(m.intro)}</p>
    </div>
    <a class="btn btn-lg" href="${blog.base}/">All ${posts.length} guides ${icon('arrow')}</a>
  </div>
  ${top ? `<a class="mo mo-hub" href="${postUrl(top)}">
    <span class="mo-badge" aria-hidden="true">${icon('zap')}</span>
    <span class="mo-art side">${coverPic(top, { sizes: '(max-width: 720px) 92vw, 420px', eager: true })}</span>
    <span class="mo-body"><span class="mo-cat">${meta(top)}</span>
    <span class="mo-mid">
      <span class="mo-kicker">Latest in ${esc(m.name)}</span>
      <h2 class="mo-h">${esc(top.title)}</h2>
      <span class="mo-ex">${esc(top.excerpt)}</span>
    </span>
    <span class="mo-foot">${readingTime(top.body)} min read <span class="round-btn sm" aria-hidden="true">${icon('arrowup')}</span></span></span>
  </a>` : ''}
  <div class="post-grid big">${rest.map(postCard).join('')}</div>
  <section class="related"><h2>Other marketplaces</h2><div class="cat-links">${marketplaces.filter((x) => x.slug !== m.slug).map((x) => `<a class="chip" href="${blog.base}/${x.slug}/">${esc(x.name)} guides</a>`).join('')}</div></section>
</div>`;
  const ld = { '@context': 'https://schema.org', '@type': 'Blog', name: `${m.name} seller guides`, url: abs(url), description: m.description,
    blogPost: list.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: abs(postUrl(p)), datePublished: p.published })) };
  return page({ title: m.title, description: m.description, url, ogImage: `/og/blog-${m.slug}.png`, extraLd: [ld, breadcrumbLd(crumbs)] }, body, { active: 'blog' });
};

const blogIndexPage = () => {
  const crumbs = [{ name: 'Home', url: '/' }, { name: blog.title, url: blog.base + '/' }];
  // Editorial mosaic: one lead story, a tinted feature with two stacked links,
  // a tall column, a wide secondary card and a topics tile.
  const [lead, feature, linkA, linkB, tall, wide] = posts;

  const mosaic = `
<div class="mosaic">
  <a class="mo mo-lead" href="${postUrl(lead)}">
    <span class="mo-badge" aria-hidden="true">${icon('zap')}</span>
    <span class="mo-art">${coverPic(lead, { sizes: '(max-width: 720px) 92vw, 480px', eager: true })}</span>
    <span class="mo-cat">${meta(lead)}</span>
    <span class="mo-mid">
      <span class="mo-kicker">Latest guide</span>
      <h2 class="mo-h">${esc(lead.title)}</h2>
      <span class="mo-ex">${esc(lead.excerpt)}</span>
    </span>
    <span class="mo-foot">${readingTime(lead.body)} min read <span class="round-btn sm" aria-hidden="true">${icon('arrowup')}</span></span>
  </a>

  <div class="mo-col mid">
    <div class="mo mo-feature">
      <span class="round-btn mo-corner" aria-hidden="true">${icon('arrowup')}</span>
      <span class="mo-cat">${meta(feature)}</span>
      <a class="mo-h-link" href="${postUrl(feature)}"><h2 class="mo-h big">${esc(feature.title)}</h2></a>
      <p class="mo-ex">${esc(feature.excerpt)} <a href="${postUrl(feature)}">More</a></p>
      <div class="mo-rows">
        ${[linkA, linkB].map((p) => `<a class="mo-row" href="${postUrl(p)}"><span>${esc(p.title)}</span>${icon('arrow')}</a>`).join('')}
      </div>
    </div>
    <a class="mo mo-wide" href="${postUrl(wide)}">
      <span class="mo-art side">${coverPic(wide, { sizes: '(max-width: 720px) 92vw, 220px' })}</span>
      <span class="mo-body"><span class="mo-cat">${meta(wide)}</span>
      <h2 class="mo-h">${esc(wide.title)}</h2>
      <span class="mo-foot">${readingTime(wide.body)} min read <span class="round-btn sm" aria-hidden="true">${icon('arrowup')}</span></span></span>
    </a>
  </div>

  <div class="mo-col right">
    <a class="mo mo-tall" href="${postUrl(tall)}">
      <span class="mo-cat">${esc(mp(tall.marketplace).name)}</span>
      <span class="mo-hot">New <span class="dot">·</span> <time datetime="${tall.published}">${fmtDate(tall.published)}</time></span>
      <h2 class="mo-h">${esc(tall.title)}</h2>
      <span class="mo-art bleed">${coverPic(tall, { sizes: '(max-width: 720px) 92vw, 300px' })}</span>
      <span class="mo-foot">${readingTime(tall.body)} min read <span class="round-btn sm" aria-hidden="true">${icon('arrowup')}</span></span>
    </a>
    <div class="mo mo-topics">
      <div class="topic-pills">
        ${marketplaces.map((m) => `<a class="pill solid" href="${blog.base}/${m.slug}/">${esc(m.name)}</a>`).join('')}
        ${['Labels', 'Returns', 'Fees & GST', 'Images', 'Packing'].map((t) => `<span class="pill">${t}</span>`).join('')}
      </div>
      <a class="topics-cta" href="#all-guides">View all ${posts.length} guides <span class="round-btn" aria-hidden="true">${icon('arrow')}</span></a>
    </div>
  </div>
</div>`;

  const body = `
<div class="wrap">
  ${breadcrumbs(crumbs)}
  <div class="blog-head">
    <div>
      <h1 class="display">${esc(blog.title)}</h1>
      <p class="lede">${esc(blog.tagline)}</p>
    </div>
    <a class="btn btn-lg" href="${blog.base}/rss.xml">Follow by RSS ${icon('arrow')}</a>
  </div>
  ${mosaic}
  <div id="all-guides">
  ${marketplaces.map((m) => `<section class="cat-block"><h2 class="cat-title"><a href="${blog.base}/${m.slug}/">${esc(m.name)}</a> <span class="muted">${postsOf(m.slug).length}</span></h2><div class="post-grid">${postsOf(m.slug).map(postCard).join('')}</div></section>`).join('')}
  </div>
</div>`;
  const ld = { '@context': 'https://schema.org', '@type': 'Blog', name: blog.title, url: abs(blog.base + '/'), description: blog.description,
    publisher: { '@type': 'Organization', name: site.name }, inLanguage: site.lang };
  return page({ title: `${blog.title} — Meesho, Flipkart & Amazon Seller Guides`, description: blog.description, url: blog.base + '/', ogImage: '/og/blog.png', extraLd: [ld, breadcrumbLd(crumbs)] }, body, { active: 'blog' });
};

// ── write pages ──────────────────────────────────────────────────────────
write('index.html', homePage());
for (const t of tools) write(`${t.slug}/index.html`, toolPage(t));
for (const c of categories) write(`${c.slug}/index.html`, categoryPage(c));
for (const p of pages) write(`${p.slug}/index.html`, staticPage(p));
write(`${blog.base.slice(1)}/index.html`, blogIndexPage());
for (const m of marketplaces) write(`${blog.base.slice(1)}/${m.slug}/index.html`, mpHubPage(m));
for (const p of posts) write(`${blog.base.slice(1)}/${p.slug}/index.html`, postPage(p));

// RSS so readers and aggregators can follow the guides
const rssItems = posts.slice(0, 30).map((p) => `  <item>
    <title>${esc(p.title)}</title>
    <link>${abs(postUrl(p))}</link>
    <guid isPermaLink="true">${abs(postUrl(p))}</guid>
    <pubDate>${new Date(p.published + 'T09:00:00Z').toUTCString()}</pubDate>
    <category>${esc(mp(p.marketplace).name)}</category>
    <description>${esc(p.excerpt)}</description>
  </item>`).join('\n');
write(`${blog.base.slice(1)}/rss.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(blog.title)} — ${esc(site.name)}</title>
  <link>${abs(blog.base + '/')}</link>
  <atom:link href="${abs(blog.base + '/rss.xml')}" rel="self" type="application/rss+xml"/>
  <description>${esc(blog.description)}</description>
  <language>${site.lang}</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${rssItems}
</channel>
</rss>`);

write('404.html', page({ title: `Page not found – ${site.name}`, description: 'That page does not exist.', url: '/404.html', ogImage: '/og/home.png', noindex: true },
  `<div class="wrap narrow"><article class="prose center"><p class="eyebrow">404</p><h1>This label fell off the parcel.</h1><p>The page you asked for doesn’t exist. Try one of the tools below or go <a href="/">home</a>.</p><div class="tool-grid">${tools.slice(0, 6).map(toolCard).join('')}</div></article></div>`));

// ── search index, sitemap, robots, manifest, headers, sw ──────────────────
write('search-index.json', JSON.stringify(tools.map((t) => ({ n: t.name, s: t.slug, c: catOf(t.category).short, k: t.keywords.join(' '), d: t.short }))));

const urls = [
  { loc: '/', pri: '1.0', lastmod: site.updated, freq: 'weekly' },
  ...categories.map((c) => ({ loc: `/${c.slug}/`, pri: '0.8', lastmod: site.updated, freq: 'weekly' })),
  ...tools.map((t) => ({ loc: `/${t.slug}/`, pri: '0.9', lastmod: t.updated, freq: 'monthly' })),
  ...pages.map((p) => ({ loc: `/${p.slug}/`, pri: '0.3', lastmod: site.updated, freq: 'yearly' })),
  { loc: `${blog.base}/`, pri: '0.7', lastmod: posts[0]?.updated || site.updated, freq: 'weekly' },
  ...marketplaces.map((m) => ({ loc: `${blog.base}/${m.slug}/`, pri: '0.6', lastmod: postsOf(m.slug)[0]?.updated || site.updated, freq: 'weekly' })),
  ...posts.map((p) => ({ loc: postUrl(p), pri: '0.7', lastmod: p.updated, freq: 'monthly' })),
];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map((u) => `  <url><loc>${abs(u.loc)}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.freq}</changefreq><priority>${u.pri}</priority></url>`).join('\n')}
</urlset>`);
// Build-time manifests are consumed by the Python generators and have no business
// being served; .assetsignore keeps them (and macOS cruft) out of the upload.
write('.assetsignore', `og-manifest.json\ncover-manifest.json\n**/.DS_Store\n`);
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /404\n\nSitemap: ${abs('/sitemap.xml')}\n`);
write('manifest.webmanifest', JSON.stringify({
  name: `${site.name} – ${site.tagline}`, short_name: site.shortName, description: site.description, start_url: '/?source=pwa', scope: '/', display: 'standalone',
  background_color: site.bgColor, theme_color: site.themeColor, lang: site.lang, categories: ['business', 'productivity', 'utilities'],
  icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }, { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }],
  shortcuts: tools.slice(0, 4).map((t) => ({ name: t.name, url: `/${t.slug}/`, description: t.short })),
}, null, 2));
write('_headers', `/*
  Content-Security-Policy: ${cspHeader}
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Cross-Origin-Opener-Policy: same-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/vendor/*
  Cache-Control: public, max-age=31536000, immutable

/og/*
  Cache-Control: public, max-age=604800

/covers/*
  Cache-Control: public, max-age=31536000, immutable

/sw.js
  Cache-Control: no-cache
`);
write('sw.js', `// Service worker: offline shell. Never caches user documents.
const V = 'skud-${BUILD_ID}';
const SHELL = ['/', '/offline.html', '${asset('assets/css/main.css')}', '${asset('assets/js/core.js')}', '${asset('assets/js/engine.js')}'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((r) => { const c = r.clone(); caches.open(V).then((x) => x.put(req, c)); return r; }).catch(() => caches.match(req).then((r) => r || caches.match('/offline.html'))));
    return;
  }
  if (/^\\/(assets|vendor|search-index)/.test(url.pathname)) {
    e.respondWith(caches.match(req).then((r) => r || fetch(req).then((res) => { const c = res.clone(); caches.open(V).then((x) => x.put(req, c)); return res; })));
  }
});`);
write('offline.html', page({ title: `Offline – ${site.name}`, description: 'You are offline.', url: '/offline.html', ogImage: '/og/home.png', noindex: true },
  `<div class="wrap narrow"><article class="prose center"><p class="eyebrow">Offline</p><h1>No internet — but tools you’ve opened before still work.</h1><p>Any tool page you visited while online is cached on this device. Open it from the menu above.</p></article></div>`));


// ── OG manifest (consumed by scripts/make-og.py) + favicon ───────────────
write('og-manifest.json', JSON.stringify({ pages: [
  { slug: 'home', eyebrow: `${tools.length} free seller tools`, title: 'Free tools for Meesho, Flipkart & Amazon sellers', sub: site.tagline, brand: site.name, domain: site.url.replace(/^https?:\/\//, '') },
  ...categories.map((c) => ({ slug: c.slug, eyebrow: c.name, title: c.name, sub: c.description.split('. ')[0], brand: site.name, domain: site.url.replace(/^https?:\/\//, '') })),
  ...tools.map((t) => ({ slug: t.slug, eyebrow: catOf(t.category).name, title: t.h1, sub: t.short, brand: site.name, domain: site.url.replace(/^https?:\/\//, '') })),
  { slug: 'blog', eyebrow: blog.title, title: blog.title, sub: blog.tagline, brand: site.name, domain: site.url.replace(/^https?:\/\//, '') },
  ...marketplaces.map((m) => ({ slug: 'blog-' + m.slug, eyebrow: blog.title, title: `${m.name} seller guides`, sub: m.description.split('. ')[0], brand: site.name, domain: site.url.replace(/^https?:\/\//, '') })),
  ...posts.map((p) => ({ slug: 'post-' + p.slug, eyebrow: `${mp(p.marketplace).name} guide`, title: p.title, sub: p.excerpt.split('. ')[0], brand: site.name, domain: site.url.replace(/^https?:\/\//, '') })),
] }));
write('cover-manifest.json', JSON.stringify({ covers: posts.map((p) => ({ slug: p.slug, motif: p.cover, marketplace: p.marketplace })) }));
write('favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="#0B0C0E"/><path d="M9 11h14M9 16h14M9 21h8" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>`);

import('node:child_process').then(({ spawnSync }) => {
  for (const script of ['make-og.py', 'make-covers.py']) {
    const r = spawnSync('python3', [path.join(ROOT, 'scripts', script)], { stdio: 'inherit' });
    if (r.status !== 0) console.warn(`${script} skipped (python3 + Pillow required)`);
  }
});
console.log(`Built ${tools.length} tools, ${categories.length} categories, ${pages.length} pages → dist/ (build ${BUILD_ID})`);
