// Editorial compliance check for the blog articles.
import { posts } from '../src/posts/index.mjs';

const BANNED = ['in conclusion', 'furthermore', 'moreover', "in today's fast-paced world",
  'in the ever-evolving', 'it is important to note', 'delve into', 'navigating the world of',
  'unlock the power', 'game-changer', 'when it comes to'];
const problems = [];

for (const p of posts) {
  const body = p.body;
  const lower = body.toLowerCase();
  const first100 = body.split(/\s+/).filter(Boolean).slice(0, 110).join(' ').toLowerCase();
  const h2s = [...body.matchAll(/^##\s+(.*)$/gm)].map((m) => m[1].toLowerCase());
  const words = body.split(/\s+/).filter(Boolean).length;
  const kw = p.keyword.toLowerCase();
  const kwParts = kw.split(/\s+/).filter((w) => w.length > 3);
  const has = (hay) => kwParts.filter((w) => hay.includes(w)).length / kwParts.length;

  const add = (m) => problems.push(`${p.slug}: ${m}`);

  // Markdown table separators and horizontal rules legitimately contain hyphens,
  // so only flag dashes used as sentence punctuation.
  const proseLines = body.split('\n').filter((l) => !/^[\s|:-]+$/.test(l));
  if (proseLines.some((l) => l.includes('—'))) add('contains an em dash');
  if (proseLines.some((l) => /\w\s*--\s*\w/.test(l))) add('contains a double hyphen used as punctuation');
  for (const b of BANNED) if (lower.includes(b)) add(`banned phrase "${b}"`);
  if (words < 850) add(`short (${words} words)`);
  if (!p.metaTitle || p.metaTitle.length > 60) add(`metaTitle length ${p.metaTitle?.length}`);
  if (!p.description || p.description.length > 165) add(`description length ${p.description?.length}`);
  if (has((p.title + ' ' + p.metaTitle).toLowerCase()) < 0.5) add('keyword weak in title');
  if (has(first100) < 0.5) add('keyword weak in first 100 words');
  if (!h2s.some((h) => has(h) >= 0.4)) add('keyword not in any H2');
  if (!/^##\s/m.test(body)) add('no H2 headings');
  if (!p.faq?.length) add('no FAQ');
  if (!p.tools?.length) add('no related tools');
  // internal links to tools, which is the whole point of the funnel
  const links = [...body.matchAll(/\]\((\/[^)]+)\)/g)].map((m) => m[1]);
  if (links.length < 2) add(`only ${links.length} internal link(s)`);
  // Paragraph length: keep them short. Lists, tables and headings are measured
  // per item rather than per block, otherwise a long list reads as a long paragraph.
  const isProse = (b) => !/^[|#>]/.test(b) && !/^([-*]|\d+\.)\s/.test(b);
  const longParas = body.split('\n\n').map((b) => b.trim()).filter((b) => isProse(b) && b.split(/\s+/).length > 95);
  if (longParas.length) add(`${longParas.length} paragraph(s) over 95 words`);
  const longItems = body.split('\n').filter((l) => /^([-*]|\d+\.)\s/.test(l.trim()) && l.split(/\s+/).length > 60);
  if (longItems.length) add(`${longItems.length} list item(s) over 60 words`);
}

const total = posts.reduce((n, p) => n + p.body.split(/\s+/).filter(Boolean).length, 0);
console.log(`${posts.length} articles · ${total.toLocaleString()} words · avg ${Math.round(total / posts.length)} words`);
console.log(problems.length ? problems.join('\n') : 'All editorial checks passed ✔');
process.exit(problems.length ? 1 : 0);
