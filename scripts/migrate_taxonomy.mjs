/**
 * One-time / idempotent migration: legacy YAML → canonical taxonomy fields.
 * Run: npm run migrate:taxonomy
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PROBLEMS = path.join(ROOT, 'problems');

const LEGACY_FAMILY = { 'related-rotating': 'related-rotating-black-hole' };
const LEGACY_REL = { 'math-heavy': 'pure-math', 'mixed-math-physics': 'mixed', 'physics-facing': 'physics-facing' };

const ALLOWED_REGIME = new Set([
  'stationary', 'linear', 'nonlinear', 'exterior', 'interior', 'extremal', 'near-extremal',
]);

const EQUATION_LEVELS = new Set([
  'null-geodesics', 'scalar-wave', 'maxwell', 'linearized-gravity', 'full-einstein',
  'einstein-maxwell', 'stationary-reduction', 'spectral-operator', 'inverse-problem',
]);

function toArr(v) {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

function uniq(a) {
  return [...new Set(a.filter(Boolean))];
}

function defaultFvReason(s) {
  if (s === 'high') return 'Stationary, algebraic, ODE/separable, or finite-dimensional substatements admit clearer formalization boundaries.';
  if (s === 'low') return 'Global nonlinear PDE or open-ended dynamics; not a practical first formalization target without major scoping.';
  return 'Some subquestions may formalize before the full statement.';
}

function legacyCoupling(matterModel) {
  const m = matterModel == null ? 'vacuum' : String(matterModel);
  if (m === 'einstein-maxwell' || m === 'other-matter') return 'matter-coupled';
  return 'vacuum';
}

function mergeNotes(raw) {
  let notes = raw.notes;
  const sn = raw.statusNotes;
  if (sn && String(sn).trim()) {
    const block = String(sn).trim();
    notes = notes && String(notes).trim()
      ? `${String(notes).trim()}\n\n(Editorial status note)\n${block}`
      : block;
  }
  if (notes === null || notes === undefined) return null;
  return String(notes).trim() || null;
}

/** Per-ID taxonomy corrections (per product spec). */
const OVERRIDES = {
  'K-001': {
    family: 'near-kerr-vacuum',
    fv_suitability: 'low',
    fv_reason: 'Full nonlinear vacuum Einstein stability is a global PDE program; formalization should target lemmas and restricted regimes first.',
  },
  'K-010': {
    family: 'kerr-ads',
    asymptotics: 'anti-de-sitter',
    related_families_note: 'Title says Kerr–AdS: the geometry is a distinct asymptotic class from asymptotically flat Kerr.',
    caution_note: 'Not a plain asymptotically flat Kerr exterior problem; boundary conditions and AdS global structure differ materially from the AF setting.',
  },
  'K-108': {
    family: 'kerr-de-sitter',
    asymptotics: 'de-sitter',
    coupling: 'matter-coupled',
    caution_note: 'Positive Λ and Kerr–Newman–de Sitter variants make this conceptually distinct from asymptotically flat interior/SCC formulations; do not conflate decay rates or thresholds with the Λ=0 case.',
    related_families_note: 'Spelled Kerr–de Sitter / Kerr–Newman–de Sitter in the statement.',
  },
  'K-008': {
    coupling: 'matter-coupled',
    equation_level_extra: ['einstein-maxwell'],
    fv_reason: 'Coupled Einstein–Maxwell perturbation theory; full nonlinear theorem remains large, but structured linearized subproblems exist.',
  },
  'K-308': {
    coupling: 'matter-coupled',
    equation_level_extra: ['einstein-maxwell'],
  },
  'K-007': {
    coupling: 'matter-coupled',
    equation_level_extra: ['einstein-maxwell'],
  },
  'K-307': {
    caution_note: 'Photon-region/trapping sits at the boundary between geometric rigidities and microlocal/spectral exterior analysis; some formulations align as naturally with spectral-scattering as with rigidity-uniqueness.',
  },
  'K-402': {
    dependencies: ['K-001', 'K-401'],
    related: ['K-305', 'K-406'],
    caution_note: 'Connects nonlinear exterior stability intuitions with spectral/QNM-level statements; dependencies are conceptual, not logical prerequisites in a proof assistant sense.',
  },
};

function migrateRecord(raw) {
  const id = raw.id;
  const ov = OVERRIDES[id] || {};

  let family = raw.family;
  if (typeof family === 'string' && LEGACY_FAMILY[family]) family = LEGACY_FAMILY[family];
  if (ov.family) family = ov.family;

  let asymptotics = ov.asymptotics ?? raw.asymptotics ?? 'asymptotically-flat';

  let coupling = ov.coupling ?? raw.coupling;
  if (coupling !== 'vacuum' && coupling !== 'matter-coupled') {
    coupling = legacyCoupling(raw.matterModel);
  }

  const eqFromLegacy = uniq(
    toArr(raw.equation_level ?? raw.equationType)
      .map(String)
      .filter(x => EQUATION_LEVELS.has(x)),
  );
  let equation_level = eqFromLegacy.length ? eqFromLegacy : ['full-einstein'];
  if (ov.equation_level_extra) {
    equation_level = uniq([...equation_level, ...ov.equation_level_extra]);
  }

  const regime = uniq(
    toArr(raw.regime)
      .map(String)
      .filter(x => ALLOWED_REGIME.has(x)),
  );
  const regimeOut = regime.length ? regime : ['exterior'];

  let relevance = raw.relevance;
  if (!['pure-math', 'mixed', 'physics-facing'].includes(relevance)) {
    relevance = LEGACY_REL[raw.relevanceProfile] || 'mixed';
  }

  let fv_suitability = raw.fv_suitability;
  if (!['high', 'medium', 'low'].includes(fv_suitability)) {
    fv_suitability = ['high', 'medium', 'low'].includes(raw.formalizationReadiness)
      ? raw.formalizationReadiness
      : 'medium';
  }
  if (ov.fv_suitability) fv_suitability = ov.fv_suitability;

  const fv_reason = ov.fv_reason || raw.fv_reason || defaultFvReason(fv_suitability);

  let progress_summary = raw.progress_summary;
  if (!progress_summary || !String(progress_summary).trim()) {
    const kp = raw.knownProgress;
    if (Array.isArray(kp) && kp.some(Boolean)) {
      progress_summary = kp.filter(Boolean).join(' ');
    } else {
      progress_summary =
        'Partial progress exists in adjacent regimes; see references/TODO for precise theorem-level milestones.';
    }
  }

  const dependencies = uniq(toArr(ov.dependencies ?? raw.dependencies ?? raw.dependsOn).map(String));
  const related = uniq(toArr(ov.related ?? raw.related ?? raw.relatedProblems).map(String));

  const related_families_note =
    ov.related_families_note ?? raw.related_families_note ?? null;
  const caution_note = ov.caution_note ?? raw.caution_note ?? null;

  const out = {
    id: raw.id,
    title: raw.title,
    cluster: raw.cluster,
    status: raw.status,
    family,
    asymptotics,
    coupling,
    equation_level,
    regime: regimeOut,
    relevance,
    fv_suitability,
    fv_reason,
    progress_summary: String(progress_summary).trim(),
    related_families_note,
    caution_note,
    statement: raw.statement,
    math_required: raw.math_required,
    why_it_matters: raw.why_it_matters,
    completion_criteria: raw.completion_criteria,
    implications: raw.implications,
    difficulty: raw.difficulty,
    dependencies,
    related,
    references: Array.isArray(raw.references) ? raw.references : [],
    posed_by: raw.posed_by ?? null,
    posed_year: raw.posed_year ?? null,
    prizes: raw.prizes ?? null,
    notes: mergeNotes(raw),
    last_updated: raw.last_updated ?? '2026-04-05',
  };

  return out;
}

function main() {
  const files = fs.readdirSync(PROBLEMS).filter(f => f.endsWith('.yaml')).sort();
  for (const f of files) {
    const fp = path.join(PROBLEMS, f);
    const raw = yaml.load(fs.readFileSync(fp, 'utf8'));
    if (!raw?.id) continue;
    const next = migrateRecord(raw);
    const text = yaml.dump(next, {
      lineWidth: 100,
      noRefs: true,
      quotingType: "'",
      forceQuotes: false,
    });
    fs.writeFileSync(fp, text, 'utf8');
    console.log('migrated', f);
  }
  console.log('done:', files.length, 'files');
}

main();
