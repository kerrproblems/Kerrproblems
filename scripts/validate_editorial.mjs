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
  RESEARCH_STATES,
} from '../src/lib/taxonomy.js';
import { normalizeProblem } from '../src/lib/problems.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PROBLEMS_DIR = path.join(ROOT, 'problems');
const PROVISIONAL_DIR = path.join(ROOT, 'data', 'problems_provisional');
const REPORT_PATH = path.join(ROOT, 'docs', 'audit', 'problem_validation_report.md');

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

function listYamlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.yaml')).map(f => path.join(dir, f));
}

function isProvisionalPath(fp) {
  return fp.includes(`${path.sep}problems_provisional${path.sep}`) || fp.includes('/problems_provisional/');
}

function main() {
  const allFiles = [...listYamlFiles(PROBLEMS_DIR), ...listYamlFiles(PROVISIONAL_DIR)];
  const issues = [];
  const warnings = [];
  const titleMap = new Map();

  for (const fp of allFiles) {
    const raw = yaml.load(fs.readFileSync(fp, 'utf8'));
    const id = raw.id;
    const provPath = isProvisionalPath(fp);
    const p = normalizeProblem(raw, {
      yamlRelativePath: provPath ? `data/problems_provisional/${id}.yaml` : `problems/${id}.yaml`,
      defaultPublish: !provPath,
    });
    const relax = provPath || p.publish === false;

    if (provPath && p.publish !== false) {
      warnings.push({
        id,
        code: 'PROVISIONAL_DIR_BUT_PUBLISH_TRUE',
        detail: 'YAML under data/problems_provisional/ should use publish: false',
      });
    }

    const ph = scanObjectStrings(raw);
    for (const loc of ph) {
      issues.push({ level: 'error', id, code: 'PLACEHOLDER_TEXT', detail: `${loc}: TODO/FIXME/pending` });
    }

    if (!ID_RE.test(id || '')) {
      issues.push({ level: 'error', id: id || fp, code: 'BAD_ID', detail: String(id) });
    }

    if (!THEOREM_STATUSES.includes(p.theorem_status)) {
      issues.push({ level: 'error', id, code: 'BAD_THEOREM_STATUS', detail: p.theorem_status });
    }
    if (!PROBLEM_TYPES.includes(p.problem_type)) {
      issues.push({ level: 'error', id, code: 'BAD_PROBLEM_TYPE', detail: p.problem_type });
    }
    if (!RESEARCH_STATES.includes(p.research_state)) {
      issues.push({ level: 'error', id, code: 'BAD_RESEARCH_STATE', detail: p.research_state });
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
      const intScc = p.cluster === 'interior-scc';
      const needsReg =
        intScc ||
        /\bextendib|inextendib|strong cosmic|cauchy horizon|interior\b/i.test(
          `${p.title} ${p.problem_statement}`,
        );
      if (needsReg && !String(p.scope.regularity || '').trim()) {
        if (!relax) {
          warnings.push({
            id,
            code: 'MISSING_SCOPE_REGULARITY',
            detail: 'SCC/interior-style problem should set scope.regularity',
          });
        }
      }
    }

    const refs = p.references || [];
    if (!relax && p.theorem_status !== 'needs_review') {
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
        if (!String(r.url || '').trim()) {
          warnings.push({ id, code: 'REF_MISSING_URL', detail: r.key || '' });
        }
      }
    }

    if (relax) {
      for (const r of refs) {
        if (r && !String(r.url || '').trim() && (r.title || r.authors)) {
          warnings.push({ id, code: 'REF_MISSING_URL', detail: r.key || '' });
        }
      }
    }

    if (p.theorem_status === 'partial' && (!p.known_results || p.known_results.length === 0)) {
      if (!relax) {
        issues.push({ level: 'error', id, code: 'PARTIAL_NO_KNOWN_RESULTS', detail: '' });
      } else {
        warnings.push({ id, code: 'PARTIAL_NO_KNOWN_RESULTS', detail: 'provisional — fill when curating' });
      }
    }

    if (p.theorem_status === 'conditional') {
      const se = String(p.status_explanation || '');
      if (!/\b(condition|hypothesis|assum|if\b|bridge|formulation|mode-stability|spectral)/i.test(se)) {
        warnings.push({ id, code: 'CONDITIONAL_WEAK_EXPLANATION', detail: 'spell condition in status_explanation' });
      }
    }

    if (p.problem_type === 'quantitative_sharpening' && !relax) {
      const blob = `${p.known_results?.map(k => k.statement).join(' ') || ''} ${p.progress_summary || ''}`;
      if (!/qualitative|classical|exact|known|already|baseline|vanishing|theorem/i.test(blob)) {
        warnings.push({
          id,
          code: 'QUANT_NO_QUALITATIVE_POINTER',
          detail: 'mention known qualitative result in known_results or progress_summary',
        });
      }
    }

    if (p.research_state === 'high_value_unformalized_direction') {
      const blob = `${p.status_explanation || ''} ${p.origin_type || ''} ${p.problem_statement || ''}`;
      if (!/synthes|unformal|manifest|proposed|community|speculative|novel|direction|formalization/i.test(blob)) {
        warnings.push({
          id,
          code: 'HIGH_VALUE_UNFORMALIZED_WEAK_LABEL',
          detail: 'state explicitly that this is a synthesized / proposed / FV-oriented target',
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
      const sp = p.solution_pointer;
      const stmt = sp && String(sp.theorem_statement || '').trim();
      const who = sp && (String(sp.solved_by || '').trim() || String(sp.citation_key || '').trim());
      if (!stmt || !who) {
        issues.push({
          level: 'error',
          id,
          code: 'SOLVED_NO_SOLUTION_POINTER',
          detail: 'need solution_pointer.theorem_statement and solved_by or citation_key',
        });
      }
      const kr = p.known_results || [];
      if (!kr.some(x => /proved|theorem|established|shown/i.test(x.statement || ''))) {
        warnings.push({
          id,
          code: 'SOLVED_NO_KNOWN_RESULT_BULLET',
          detail: 'consider mirroring the theorem in known_results',
        });
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
    `- Scanned **published** dir: \`problems/\` and **provisional** dir: \`data/problems_provisional/\`.`,
    `- Relaxed reference / partial rules apply to provisional entries (\`publish: false\` or provisional path).`,
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
