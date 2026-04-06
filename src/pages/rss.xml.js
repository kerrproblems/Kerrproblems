import { getPublishedProblems } from '../lib/problems.js';

export const prerender = true;

function escapeXml(s) {
  if (s == null || s === '') return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function GET() {
  const problems = getPublishedProblems();
  const recent = problems
    .sort((a, b) => (b.last_updated || '').localeCompare(a.last_updated || ''))
    .slice(0, 20);

  const items = recent.map(p => `
    <item>
      <title>${escapeXml(`${p.id} — ${p.title}`)}</title>
      <link>https://kerrproblems.com/problems/${escapeXml(p.id)}</link>
      <description>${escapeXml((p.problem_statement || p.statement || '').slice(0, 200))}...</description>
      <pubDate>${new Date(p.last_updated || '2026-04-01').toUTCString()}</pubDate>
      <guid>https://kerrproblems.com/problems/${escapeXml(p.id)}</guid>
    </item>
  `).join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Kerr Problems — Recent Updates</title>
    <link>https://kerrproblems.com</link>
    <description>Mathematical relativity open problems — Kerr and Kerr-related families</description>
    ${items}
  </channel>
</rss>`, {
    headers: { 'Content-Type': 'application/xml' }
  });
}
