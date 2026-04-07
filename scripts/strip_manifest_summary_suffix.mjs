/**
 * Remove repeated expansion-manifest trailer from folded summaries (`summary: >-`).
 * Only rewrites the summary block lines; other YAML is preserved byte-for-byte aside from newline normalization.
 * Run: node scripts/strip_manifest_summary_suffix.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const DIRS = [path.join(ROOT, 'problems'), path.join(ROOT, 'data', 'problems_provisional')];

const SUFFIX_RE = new RegExp(
  String.raw`\s+In the\s+(?:asymptotically flat exterior vacuum|extremal and near-extremal horizon regimes|interior and Cauchy-horizon regularity formulations|spectral and scattering formulations on black-hole backgrounds|stationary rigidity and hidden-symmetry reductions)[\s\S]*?milestones and the remaining gap\.\s*`,
  'g',
);

function stripSummary(text) {
  if (typeof text !== 'string' || !text.includes('expansion manifest')) return text;
  return text.replace(SUFFIX_RE, '').trimEnd();
}

/** Folded block: join continuation lines with spaces (YAML `>-` semantics). */
function processRawYaml(raw) {
  const lines = raw.split(/\r?\n/);
  const idx = lines.findIndex(l => /^summary:\s*>-\s*$/.test(l));
  if (idx === -1) return { raw, changed: false };

  const cont = [];
  let j = idx + 1;
  while (j < lines.length && /^  /.test(lines[j])) {
    cont.push(lines[j].slice(2));
    j += 1;
  }
  const folded = cont.join(' ').trim();
  if (!folded.includes('expansion manifest')) return { raw, changed: false };

  const stripped = stripSummary(folded);
  if (stripped === folded) return { raw, changed: false };

  const out = [...lines.slice(0, idx), `summary: >-`, `  ${stripped}`, ...lines.slice(j)];
  const nl = raw.endsWith('\n') ? '\n' : '';
  return { raw: out.join('\n') + nl, changed: true };
}

let n = 0;
for (const dir of DIRS) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.yaml')) continue;
    const fp = path.join(dir, f);
    const raw = fs.readFileSync(fp, 'utf8');
    const { raw: next, changed } = processRawYaml(raw);
    if (changed) {
      fs.writeFileSync(fp, next, 'utf8');
      n += 1;
      console.log('stripped', path.relative(ROOT, fp));
    }
  }
}
console.log('total updated', n);
