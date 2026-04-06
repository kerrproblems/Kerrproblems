/**
 * Editorial validation + markdown report.
 * Run: node scripts/validate_editorial.mjs
 * Writes: docs/audit/problem_validation_report.md
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import {
  THEOREM_STATUSES,
  PROBLEM_TYPES,
  MATURITY_LEVELS,
  EVIDENCE_LEVELS,
  VERIFICATION_STATES,
} from '../src/lib/taxonomy.js';
import { normalizeProblem } from '../src/lib/problems.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROBLEMS_DIR = path.join(__dirname, '..', 'problems');
const REPORT_PATH = path.join(__dirname, '..', 'docs', 'audit', 'problem_validation_report.md');

const PLACEHOLDER_RE = /\b(TODO|FIXME|references\s+pending)\b|references\/TODO/i;
const ID_RE = /^K-[0-9]{3}$/;

function scanObjectStrings(obj, pathPrefix = '') {
  const hits = [];
  if (obj == null) return hits;
  if (typeof obj === 'string') {
    if (PLACEHOLDER_RE.test(obj)) hits.push(pathPrefix || '(root)');
    return hits;
  }
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => hits.push(...scanObjectStrings(v, `${pathPrefix}[${i}]`)));
    return hits;
  }
  if (typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      const p = pathPrefix ? `${pathPrefix}.${k}` : k;
      hits.push(...scanObjectStrings(v, p));
    }
  }
  return hits;
}

function titleKey(t) {
  return String(t || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .slice(0, 80);
}

function main() {
  const files = fs.readdirSync(PROBLEMS_DIR).filter(f => f.endsWith('.yaml'));
  const issues = [];
  const warnings = [];
  const titleMap = new Map();

  for (const f of files) {
    const raw = yaml.load(fs.readFileSync(path.join(PROBLEMS_DIR, f), 'utf8'));
    const id = raw.id;
    const p = normalizeProblem(raw);

    const ph = scanObjectStrings(raw);
    for (const loc of ph) {
      issues.push({ level: 'error', id, code: 'PLACEHOLDER_TEXT', detail: `${loc}: TODO/FIXME/pending` });
    }

    if (!THEOREM_STATUSES.includes(p.theorem_status)) {
      issues.push({ level: 'error', id, code: 'BAD_THEOREM_STATUS', detail: p.theorem_status });
    }
    if (!PROBLEM_TYPES.includes(p.problem_type)) {
      issues.push({ level: 'error', id, code: 'BAD_PROBLEM_TYPE', detail: p.problem_type });
    }
    if (!MATURITY_LEVELS.includes(p.maturity)) {
      issues.push({ level: 'error', id, code: 'BAD_MATURITY', detail: p.maturity });
    }
    if (!EVIDENCE_LEVELS.includes(p.evidence_level)) {
      issues.push({ level: 'error', id, code: 'BAD_EVIDENCE', detail: p.evidence_level });
    }
    if (!VERIFICATION_STATES.includes(p.verification_state)) {
      issues.push({ level: 'error', id, code: 'BAD_VERIFICATION', detail: p.verification_state });
    }

    if (!p.scope || typeof p.scope !== 'object') {
      issues.push({ level: 'error', id, code: 'MISSING_SCOPE', detail: '' });
    } else {
      if (!String(p.scope.parameter_regime || '').trim()) {
        warnings.push({ id, code: 'EMPTY_PARAMETER_REGIME', detail: '' });
      }
    }

    const refs = p.references || [];
    if (p.theorem_status !== 'needs_review') {
      if (refs.length < 2) {
        issues.push({ level: 'error', id, code: 'REFS_LT_2', detail: `count=${refs.length}` });
      }
      const primary = refs.filter(r => r.kind === 'primary');
      if (primary.length < 1) {
        issues.push({ level: 'error', id, code: 'NO_PRIMARY_REF', detail: '' });
      }
      for (const r of refs) {
        if (!String(r.relevance || '').trim()) {
          warnings.push({ id, code: 'REF_MISSING_RELEVANCE', detail: r.key || '' });
        }
      }
    }

    if (p.theorem_status === 'partial' && (!p.known_results || p.known_results.length === 0)) {
      warnings.push({ id, code: 'PARTIAL_NO_KNOWN_RESULTS', detail: '' });
    }

    if (p.theorem_status === 'conditional') {
      const se = String(p.status_explanation || '');
      if (!/\b(condition|hypothesis|assum|if\b|bridge|formulation)/i.test(se)) {
        warnings.push({ id, code: 'CONDITIONAL_WEAK_EXPLANATION', detail: 'spell condition in status_explanation' });
      }
    }

    if (p.problem_type === 'quantitative_sharpening') {
      const blob = `${p.known_results?.map(k => k.statement).join(' ') || ''} ${p.progress_summary || ''}`;
      if (!/qualitative|classical|exact|known|already|baseline|vanishing|theorem/i.test(blob)) {
        warnings.push({
          id,
          code: 'QUANT_NO_QUALITATIVE_POINTER',
          detail: 'mention known qualitative result in known_results or progress_summary',
        });
      }
    }

    const tk = titleKey(p.title);
    if (tk) {
      const prev = titleMap.get(tk);
      if (prev && prev !== id) {
        warnings.push({ id, code: 'NEAR_DUPLICATE_TITLE', detail: `similar to ${prev}` });
      } else titleMap.set(tk, id);
    }

    if (p.theorem_status === 'solved') {
      const kr = p.known_results || [];
      if (!kr.some(x => /proved|theorem|established|shown/i.test(x.statement || ''))) {
        issues.push({ level: 'error', id, code: 'SOLVED_WITHOUT_MATCH', detail: '' });
      }
    }
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  const errCount = issues.filter(i => i.level === 'error').length;
  const warnCount = warnings.length;

  const lines = [
    '# Problem validation report',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    `**Errors:** ${errCount} · **Warnings:** ${warnCount}`,
    '',
    '## Errors',
    '',
  ];
  if (!issues.filter(i => i.level === 'error').length) lines.push('_(none)_', '');
  else {
    for (const i of issues.filter(x => x.level === 'error')) {
      lines.push(`- **${i.id}** — \`${i.code}\` ${i.detail}`);
    }
    lines.push('');
  }
  lines.push('## Warnings', '');
  if (!warnings.length) lines.push('_(none)_', '');
  else {
    for (const w of warnings) {
      lines.push(`- **${w.id}** — \`${w.code}\` ${w.detail}`);
    }
    lines.push('');
  }

  fs.writeFileSync(REPORT_PATH, lines.join('\n'), 'utf8');
  console.log('Wrote', REPORT_PATH);
  console.log(`Errors: ${errCount}, warnings: ${warnCount}`);
  if (errCount) process.exit(1);
}

main();
