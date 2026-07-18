import { getPublishedProblems } from '../lib/problems.js';

const origin = 'https://kerrproblems.com';
const staticPaths = [
  '/',
  '/about',
  '/contribute',
  '/formal-verification',
  '/methodology',
  '/problems',
  '/clusters',
  '/contributors/rahim-iqbal',
];

export function GET() {
  const problemPaths = getPublishedProblems().map(problem => `/problems/${problem.id}`);
  const urls = [...staticPaths, ...problemPaths];
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(path => `  <url><loc>${origin}${path}</loc></url>`),
    '</urlset>',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
