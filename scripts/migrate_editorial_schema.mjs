/**
 * One-time / idempotent YAML migration: editorial schema, cross-links, TODO stripping.
 * Run: node scripts/migrate_editorial_schema.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROBLEMS_DIR = path.join(__dirname, '..', 'problems');

const TODO_RE = /references\/TODO|TODO\(editorial\)|TODO:|FIXME:|references pending/gi;

/** These files are fully rewritten by hand after migration; do not force needs_review here. */
const HAND_CURATED_IDS = new Set([
  'K-001',
  'K-004',
  'K-006',
  'K-008',
  'K-009',
  'K-108',
  'K-301',
  'K-304',
  'K-306',
  'K-307',
  'K-308',
  'K-501',
  'K-503',
  'K-504',
  'K-505',
  'K-506',
  'K-508',
  'K-510',
]);

function relatedGroupMerge(id) {
  const flat101 = Array.from({ length: 12 }, (_, i) => `K-${String(101 + i).padStart(3, '0')}`);
  const flat201 = Array.from({ length: 9 }, (_, i) => `K-${String(201 + i).padStart(3, '0')}`);
  const flat301 = Array.from({ length: 8 }, (_, i) => `K-${String(301 + i).padStart(3, '0')}`);
  const flat401 = Array.from({ length: 7 }, (_, i) => `K-${String(401 + i).padStart(3, '0')}`);
  const flat501 = Array.from({ length: 10 }, (_, i) => `K-${String(501 + i).padStart(3, '0')}`);

  const realGroups = [
    ['K-001', 'K-003', 'K-005', 'K-006', 'K-012', 'K-013'],
    flat101,
    flat201,
    flat301,
    flat401,
    flat501,
  ];

  const out = new Set();
  for (const g of realGroups) {
    if (g.includes(id)) for (const x of g) if (x !== id) out.add(x);
  }
  const pairs = [
    ['K-304', 'K-501'],
    ['K-306', 'K-508'],
    ['K-307', 'K-504'],
    ['K-008', 'K-007'],
    ['K-008', 'K-308'],
    ['K-007', 'K-308'],
  ];
  for (const [a, b] of pairs) {
    if (id === a) out.add(b);
    if (id === b) out.add(a);
  }
  const k108Adj = ['K-101', 'K-102', 'K-103', 'K-104', 'K-105', 'K-106', 'K-107', 'K-109', 'K-110', 'K-111', 'K-112'];
  if (id === 'K-108') for (const x of k108Adj) out.add(x);
  for (const x of k108Adj) if (id === x) out.add('K-108');

  return [...out].sort();
}

function cleanStr(s) {
  if (s == null || typeof s !== 'string') return s;
  let t = s.replace(TODO_RE, '').replace(/\n{3,}/g, '\n\n').trim();
  return t;
}

function refCount(refs) {
  if (!Array.isArray(refs)) return 0;
  return refs.filter(r => {
    if (!r || typeof r !== 'object') return false;
    return Boolean(
      (r.arxiv && String(r.arxiv).trim()) ||
        (r.doi && String(r.doi).trim()) ||
        (r.url && String(r.url).trim()) ||
        (r.note && String(r.note).trim() && !/TODO|FIXME|references pending/i.test(String(r.note))),
    );
  }).length;
}

function defaultScope(doc) {
  const cluster = doc.cluster || '';
  const af =
    doc.asymptotics === 'de-sitter'
      ? 'Rotating black-hole models with positive cosmological constant (Kerr–de Sitter family and variants).'
      : doc.asymptotics === 'anti-de-sitter'
        ? 'Anti-de Sitter asymptotics as tagged.'
        : 'Asymptotically flat four-dimensional general relativity unless the statement specifies otherwise.';
  const interior =
    cluster === 'interior-scc'
      ? 'Cauchy horizon / interior regularity formulations of strong cosmic censorship are in play; distinguish $C^0$ vs higher regularity notions.'
      : '';
  return {
    background: [af, interior].filter(Boolean).join(' '),
    equation_type: `Taxonomy equation levels: ${(doc.equation_level || []).join(', ')}.`,
    linearity: (doc.regime || []).includes('nonlinear')
      ? 'Includes or emphasizes nonlinear dynamics.'
      : 'Primarily stationary or linearized reductions unless the statement says otherwise.',
    regularity:
      cluster === 'interior-scc'
        ? 'State intended regularity class for extensions across horizons explicitly (e.g. $C^0$, Lipschitz, $C^2$).'
        : 'Smooth / Sobolev classes as in the problem statement; tighten when citing a specific theorem.',
    parameter_regime:
      'Use the problem text for subextremal vs near-extremal windows; this database entry still needs literature-aligned parameter annotations.',
    asymptotics: doc.asymptotics || 'asymptotically-flat',
    gauge_or_formulation: null,
  };
}

function migrateDoc(doc) {
  const id = doc.id;
  const out = { ...doc };
  delete out.status;

  out.theorem_status = out.theorem_status || doc.status || 'open';
  out.problem_type = out.problem_type || 'classical_frontier';
  out.maturity = out.maturity || 'mostly_scoped';
  out.evidence_level = out.evidence_level || 'refs_missing';
  out.verification_state = out.verification_state || 'imported_unverified';
  out.priority = out.priority || 'normal';

  out.problem_statement = out.problem_statement || doc.statement;
  out.statement = out.problem_statement;
  out.short_title = out.short_title || (doc.title && doc.title.length > 90 ? `${doc.title.slice(0, 87)}…` : doc.title);
  out.summary = out.summary || (doc.title ? doc.title.slice(0, 200) : '');

  out.scope = doc.scope && typeof doc.scope === 'object' ? { ...defaultScope(doc), ...doc.scope } : defaultScope(doc);

  out.known_results = Array.isArray(doc.known_results) ? doc.known_results : [];
  out.remaining_gap = out.remaining_gap || doc.completion_criteria || '';
  out.status_explanation =
    out.status_explanation ||
    (out.theorem_status === 'conditional'
      ? 'Conditional: the quantitative bridge between exterior inputs and the interior/SCC conclusion must be stated as an explicit hypothesis.'
      : '');

  out.related_problem_ids = [...new Set([...(doc.related_problem_ids || []), ...(doc.related || [])])];
  const auto = relatedGroupMerge(id);
  out.related_problem_ids = [...new Set([...out.related_problem_ids, ...auto])].sort();
  out.related = [...out.related_problem_ids];

  const textFields = [
    'title',
    'progress_summary',
    'why_it_matters',
    'completion_criteria',
    'implications',
    'math_required',
    'notes',
    'caution_note',
    'related_families_note',
    'problem_statement',
    'statement',
    'summary',
    'remaining_gap',
    'status_explanation',
  ];
  for (const k of textFields) {
    if (typeof out[k] === 'string') out[k] = cleanStr(out[k]);
  }

  if (Array.isArray(out.references)) {
    out.references = out.references.filter(r => {
      if (!r || typeof r !== 'object') return false;
      const note = String(r.note || '');
      if (/TODO|FIXME|references pending/i.test(note)) return false;
      if (r.placeholder && /TODO|FIXME/i.test(String(r.placeholder))) return false;
      return true;
    });
  }

  const nRefs = refCount(out.references);
  if (!HAND_CURATED_IDS.has(id) && nRefs < 2) {
    out.theorem_status = 'needs_review';
    out.references = [];
    out.evidence_level = 'refs_missing';
    out.verification_state = 'editorial_revision_needed';
    out.maturity = 'provisional';
    out.status_explanation =
      out.status_explanation ||
      'Entry imported without two independent bibliographic pointers in this repository; treat theorem-level claims as unverified here.';
  }

  if (!out.progress_summary) {
    out.progress_summary =
      'Editorial summary pending: use known results, remaining gap, and references on this page once curated.';
  }

  out.tags = Array.isArray(doc.tags) ? doc.tags : [];
  out.aliases = Array.isArray(doc.aliases) ? doc.aliases : [];
  out.editorial_notes = doc.editorial_notes ?? null;
  out.public_notes = doc.public_notes ?? null;
  out.last_verified_at = doc.last_verified_at ?? null;
  out.last_verified_by = doc.last_verified_by ?? null;

  return out;
}

function orderKeys(doc) {
  const order = [
    'id',
    'title',
    'short_title',
    'cluster',
    'theorem_status',
    'problem_type',
    'maturity',
    'evidence_level',
    'verification_state',
    'priority',
    'summary',
    'problem_statement',
    'statement',
    'why_it_matters',
    'scope',
    'known_results',
    'remaining_gap',
    'status_explanation',
    'math_required',
    'completion_criteria',
    'implications',
    'difficulty',
    'family',
    'asymptotics',
    'coupling',
    'equation_level',
    'regime',
    'relevance',
    'fv_suitability',
    'fv_reason',
    'progress_summary',
    'dependencies',
    'related_problem_ids',
    'related',
    'references',
    'tags',
    'aliases',
    'related_families_note',
    'caution_note',
    'posed_by',
    'posed_year',
    'prizes',
    'notes',
    'editorial_notes',
    'public_notes',
    'last_verified_at',
    'last_verified_by',
    'last_updated',
  ];
  const o = {};
  for (const k of order) {
    if (k in doc) o[k] = doc[k];
  }
  for (const k of Object.keys(doc)) {
    if (!(k in o)) o[k] = doc[k];
  }
  return o;
}

function main() {
  const files = fs.readdirSync(PROBLEMS_DIR).filter(f => f.endsWith('.yaml'));
  for (const f of files) {
    const p = path.join(PROBLEMS_DIR, f);
    const doc = yaml.load(fs.readFileSync(p, 'utf8'));
    const migrated = orderKeys(migrateDoc(doc));
    fs.writeFileSync(p, yaml.dump(migrated, { lineWidth: 100, noRefs: true, sortKeys: false }), 'utf8');
    console.log('migrated', f);
  }
}

main();
