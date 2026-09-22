// ─── Tiny Markdown renderer ───────────────────────────────────────────────
// Deliberately small: it supports only what the articles use (headings, lists,
// tables, blockquotes, bold/italic/code, links). No third-party dependency.

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const inline = (s) =>
  esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');

export const slugify = (s) =>
  s.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60);

// Returns { html, headings } so the page can build a table of contents.
export function markdown(src) {
  const lines = src.replace(/\r/g, '').split('\n');
  const out = [];
  const headings = [];
  let i = 0;
  const flushPara = (buf) => { if (buf.length) out.push(`<p>${inline(buf.join(' '))}</p>`); buf.length = 0; };
  const para = [];

  while (i < lines.length) {
    const ln = lines[i];

    // heading
    const h = ln.match(/^(#{2,4})\s+(.*)$/);
    if (h) {
      flushPara(para);
      const level = h[1].length, text = h[2].trim(), id = slugify(text);
      if (level === 2) headings.push({ id, text });
      out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      i++; continue;
    }

    // horizontal rule
    if (/^---+$/.test(ln.trim())) { flushPara(para); out.push('<hr>'); i++; continue; }

    // blockquote (used for the key-takeaway callouts)
    if (/^>\s?/.test(ln)) {
      flushPara(para);
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, '')); i++; }
      out.push(`<blockquote>${markdown(buf.join('\n')).html}</blockquote>`);
      continue;
    }

    // table
    if (/^\|/.test(ln) && /^\|[\s:|-]+\|$/.test(lines[i + 1] || '')) {
      flushPara(para);
      const cells = (r) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(ln);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) { rows.push(cells(lines[i])); i++; }
      out.push(`<div class="table-scroll"><table class="post-table"><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows
        .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }

    // lists
    const isUl = /^[-*]\s+/.test(ln), isOl = /^\d+\.\s+/.test(ln);
    if (isUl || isOl) {
      flushPara(para);
      const tag = isUl ? 'ul' : 'ol';
      const items = [];
      const re = isUl ? /^[-*]\s+/ : /^\d+\.\s+/;
      while (i < lines.length && re.test(lines[i])) {
        let item = lines[i].replace(re, ''); i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i])) { item += ' ' + lines[i].trim(); i++; }
        items.push(`<li>${inline(item)}</li>`);
      }
      out.push(`<${tag}>${items.join('')}</${tag}>`);
      continue;
    }

    if (!ln.trim()) { flushPara(para); i++; continue; }
    para.push(ln.trim()); i++;
  }
  flushPara(para);
  return { html: out.join('\n'), headings };
}

// ~200 wpm, rounded up, for the "5 min read" label.
export const readingTime = (src) => Math.max(1, Math.round(src.split(/\s+/).length / 200));
export const wordCount = (src) => src.split(/\s+/).filter(Boolean).length;
