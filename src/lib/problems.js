import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import {
  CLUSTERS,
  FAMILIES,
  ASYMPTOTICS,
  COUPLINGS,
  EQUATION_LEVELS,
  REGIMES,
  RELEVANCE,
  FV_SUITABILITY,
  THEOREM_STATUSES,
  PROBLEM_TYPES,
  MATURITY_LEVELS,
  EVIDENCE_LEVELS,
  VERIFICATION_STATES,
  ASYMPTOTICS_LABELS,
} from './taxonomy.js';

const PROBLEMS_DIR = path.join(process.cwd(), 'problems');
const CLUSTERS_PATH = path.join(process.cwd(), 'data', 'clusters.yaml');

const LEGACY_FAMILY = {
  'related-rotating': 'related-rotating-black-hole',
};

const LEGACY_RELEVANCE = {
  'math-heavy': 'pure-math',
  'mixed-math-physics': 'mixed',
  'physics-facing': 'physics-facing',
};

const ALLOWED_REGIME = new Set(REGIMES);

function toArray(v) {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

function uniq(arr) {
  return [...new Set(arr.filter(Boolean))];
}

/** Normalize family / asymptotics: allow string or array in YAML; site uses arrays internally. */
export function normalizeTaxonomyList(values, allowedSet, legacyMap = {}) {
  const raw = toArray(values);
  const out = [];
  for (const x of raw) {
    if (x == null) continue;
    const s = String(x).trim();
    const mapped = legacyMap[s] || s;
    if (allowedSet.has(mapped)) out.push(mapped);
  }
  return uniq(out);
}

function mapEquationLevelFromLegacy(list) {
  const raw = toArray(list);
  const out = [];
  for (const x of raw) {
    const s = String(x || '').trim();
    if (EQUATION_LEVELS.includes(s)) out.push(s);
  }
  return uniq(out);
}

function mapRegimeFromLegacy(list) {
  const raw = toArray(list);
  const out = [];
  for (const x of raw) {
    const s = String(x || '').trim();
    if (ALLOWED_REGIME.has(s)) out.push(s);
  }
  return uniq(out);
}

function legacyCoupling(matterModel, id) {
  const m = matterModel == null ? 'vacuum' : String(matterModel);
  if (m === 'einstein-maxwell' || m === 'other-matter') return 'matter-coupled';
  return 'vacuum';
}

function defaultFvReason(suitability) {
  if (suitability === 'high') {
    return 'Stationary, algebraic, ODE/separable, or finite-dimensional substatements admit clearer formalization boundaries.';
  }
  if (suitability === 'low') {
    return 'Global nonlinear PDE or open-ended dynamics; not a practical first formalization target without major scoping.';
  }
  return 'Intermediate: useful lemmas or restricted versions may formalize before the full statement.';
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
  return notes || null;
}

function pickEnum(value, allowed, fallback) {
  const v = value == null ? '' : String(value).trim();
  return allowed.includes(v) ? v : fallback;
}

function inferLinearity(regList) {
  const r = new Set(regList || []);
  if (r.has('nonlinear') && r.has('linear')) return 'both linearized and fully nonlinear settings';
  if (r.has('nonlinear')) return 'nonlinear';
  if (r.has('linear')) return 'linearized';
  return 'see regime tags';
}

function normalizeReferenceEntry(r, idx) {
  if (!r || typeof r !== 'object') return null;
  const arxiv = r.arxiv ? String(r.arxiv).trim() : '';
  const doi = r.doi ? String(r.doi).trim() : '';
  const note = r.note != null ? String(r.note) : '';
  const placeholder = r.placeholder != null ? String(r.placeholder) : '';
  const hasPointer = Boolean(arxiv || doi || (r.url && String(r.url).trim()));
  if (!hasPointer && !note && !placeholder) return null;
  const url =
    (r.url && String(r.url).trim()) ||
    (arxiv ? `https://arxiv.org/abs/${arxiv}` : '') ||
    (doi ? `https://doi.org/${doi}` : '');
  let kind = pickEnum(r.kind, ['primary', 'survey', 'secondary'], '');
  if (!kind) {
    if (arxiv || doi) kind = 'primary';
    else kind = 'secondary';
  }
  return {
    key: (r.key && String(r.key).trim()) || `ref-${idx + 1}`,
    authors: r.authors != null ? String(r.authors).trim() : '',
    title: r.title != null ? String(r.title).trim() : '',
    venue: r.venue != null ? String(r.venue).trim() : '',
    year: r.year != null && r.year !== '' ? Number(r.year) : null,
    url,
    arxiv: arxiv || undefined,
    doi: doi || undefined,
    kind,
    relevance: (r.relevance && String(r.relevance).trim()) || note || placeholder || '',
  };
}

function normalizeReferencesList(arr) {
  if (!Array.isArray(arr)) return [];
  const out = [];
  arr.forEach((r, i) => {
    const n = normalizeReferenceEntry(r, i);
    if (n) out.push(n);
  });
  return out;
}

function computeEvidenceLevel(refs) {
  if (!refs.length) return 'refs_missing';
  const hasPrimary = refs.some(x => x.kind === 'primary');
  if (hasPrimary) return 'primary_refs_present';
  return 'secondary_refs_only';
}

function normalizeKnownResults(raw) {
  const kr = raw.known_results;
  if (!Array.isArray(kr)) return [];
  return kr
    .filter(x => x && typeof x === 'object')
    .map(x => ({
      statement: String(x.statement || '').trim(),
      regime: String(x.regime || '').trim(),
      significance: String(x.significance || '').trim(),
    }))
    .filter(x => x.statement);
}

function buildScope(raw, regime, equation_level, asymptoticsPrimary) {
  const s = raw.scope && typeof raw.scope === 'object' ? raw.scope : {};
  const eqLabel = equation_level.join(', ');
  const regLabel = regime.join(', ');
  return {
    background:
      (s.background && String(s.background).trim()) ||
      `${ASYMPTOTICS_LABELS[asymptoticsPrimary] || asymptoticsPrimary} black-hole exterior/interior context as indicated by cluster and family tags.`,
    equation_type:
      (s.equation_type && String(s.equation_type).trim()) ||
      `PDE level: ${eqLabel}.`,
    linearity: (s.linearity && String(s.linearity).trim()) || inferLinearity(regime),
    regularity:
      (s.regularity && String(s.regularity).trim()) ||
      'Regularity class is as stated in the problem text unless a dedicated literature review adds sharper hypotheses.',
    parameter_regime:
      (s.parameter_regime && String(s.parameter_regime).trim()) ||
      'See problem statement and known-results blocks for subextremal vs near-extremal windows.',
    asymptotics:
      (s.asymptotics && String(s.asymptotics).trim()) ||
      ASYMPTOTICS_LABELS[asymptoticsPrimary] ||
      asymptoticsPrimary,
    gauge_or_formulation: s.gauge_or_formulation != null ? String(s.gauge_or_formulation).trim() : null,
  };
}

/**
 * Normalize raw YAML into the canonical shape used by the site.
 * Accepts legacy keys: equationType, matterModel, relevanceProfile, formalizationReadiness,
 * dependsOn, relatedProblems, knownProgress, family spelling related-rotating, status -> theorem_status.
 */
export function normalizeProblem(raw) {
  if (!raw || typeof raw !== 'object') return raw;

  const familySet = new Set(FAMILIES);
  let family = raw.family;
  if (typeof family === 'string' && LEGACY_FAMILY[family]) {
    family = LEGACY_FAMILY[family];
  }
  const families = normalizeTaxonomyList(family, familySet, LEGACY_FAMILY);
  const familyPrimary = families[0] || 'near-kerr-vacuum';

  const asymSet = new Set(ASYMPTOTICS);
  const asymptoticsList = normalizeTaxonomyList(raw.asymptotics, asymSet);
  const asymptoticsPrimary = asymptoticsList[0] || 'asymptotically-flat';

  let equation_level = mapEquationLevelFromLegacy(raw.equation_level ?? raw.equationType);
  if (equation_level.length === 0) equation_level = ['full-einstein'];

  let regime = mapRegimeFromLegacy(raw.regime);
  if (regime.length === 0) regime = ['exterior'];

  let coupling = raw.coupling;
  if (!COUPLINGS.includes(coupling)) {
    coupling = legacyCoupling(raw.matterModel, raw.id);
  }

  let relevance = raw.relevance;
  if (!RELEVANCE.includes(relevance)) {
    const rp = raw.relevanceProfile;
    relevance = LEGACY_RELEVANCE[rp] || 'mixed';
  }

  let fv_suitability = raw.fv_suitability;
  if (!FV_SUITABILITY.includes(fv_suitability)) {
    const fr = raw.formalizationReadiness;
    fv_suitability = FV_SUITABILITY.includes(fr) ? fr : 'medium';
  }

  const fv_reason =
    raw.fv_reason && String(raw.fv_reason).trim()
      ? String(raw.fv_reason).trim()
      : defaultFvReason(fv_suitability);

  const dependencies = uniq(
    toArray(raw.dependencies ?? raw.dependsOn).map(String),
  );
  const relatedIds = uniq([
    ...toArray(raw.related ?? raw.relatedProblems).map(String),
    ...toArray(raw.related_problem_ids).map(String),
  ]);

  let theorem_status = pickEnum(
    raw.theorem_status ?? raw.status,
    THEOREM_STATUSES,
    'needs_review',
  );

  const problem_type = pickEnum(raw.problem_type, PROBLEM_TYPES, 'classical_frontier');
  const maturity = pickEnum(raw.maturity, MATURITY_LEVELS, 'mostly_scoped');
  let verification_state = pickEnum(
    raw.verification_state,
    VERIFICATION_STATES,
    'imported_unverified',
  );

  const references = normalizeReferencesList(raw.references);
  let evidence_level = EVIDENCE_LEVELS.includes(raw.evidence_level)
    ? raw.evidence_level
    : computeEvidenceLevel(references);
  if (references.length === 0) {
    evidence_level = 'refs_missing';
  }

  const problem_statement = String(raw.problem_statement || raw.statement || '').trim();
  const title = String(raw.title || '').trim();

  let progress_summary = raw.progress_summary;
  if (!progress_summary || !String(progress_summary).trim()) {
    const kp = raw.knownProgress;
    if (Array.isArray(kp) && kp.length && kp.some(Boolean)) {
      progress_summary = kp.filter(Boolean).join(' ');
    } else {
      progress_summary =
        'Editorial summary pending: consult known results, remaining gap, and references on this page.';
    }
  } else if (/references\/TODO|TODO\(editorial\)|see\s+for\s+precise/i.test(String(progress_summary))) {
    progress_summary = String(progress_summary)
      .replace(/\s*see references\/TODO[^\n]*/gi, '')
      .replace(/\s*see\s+for\s+precise[^\n]*/gi, '')
      .replace(/TODO\(editorial\):[^\n]*/gi, '')
      .trim();
    if (!progress_summary) {
      progress_summary =
        'Editorial summary pending: consult known results, remaining gap, and references on this page.';
    }
  }

  const known_results = normalizeKnownResults(raw);
  const remaining_gap = String(raw.remaining_gap || raw.completion_criteria || '').trim();
  const status_explanation = String(raw.status_explanation || '').trim();
  const summary =
    (raw.summary && String(raw.summary).trim()) ||
    (title ? title.slice(0, 220) + (title.length > 220 ? '…' : '') : '');
  const short_title =
    (raw.short_title && String(raw.short_title).trim()) ||
    (title.length > 90 ? `${title.slice(0, 87)}…` : title);

  const scope = buildScope(raw, regime, equation_level, asymptoticsPrimary);

  const tags = uniq(toArray(raw.tags).map(String));
  const aliases = uniq(toArray(raw.aliases).map(String));
  const priority = raw.priority != null ? String(raw.priority).trim() : 'normal';
  const last_verified_at = raw.last_verified_at != null ? String(raw.last_verified_at).trim() : null;
  const last_verified_by = raw.last_verified_by != null ? String(raw.last_verified_by).trim() : null;
  const editorial_notes = raw.editorial_notes != null ? String(raw.editorial_notes).trim() : null;
  const public_notes = raw.public_notes != null ? String(raw.public_notes).trim() : null;

  return {
    ...raw,
    family: familyPrimary,
    families,
    asymptotics: asymptoticsPrimary,
    asymptotics_list: asymptoticsList.length ? asymptoticsList : [asymptoticsPrimary],
    coupling,
    equation_level,
    regime,
    relevance,
    fv_suitability,
    fv_reason,
    dependencies,
    related: relatedIds,
    related_problem_ids: relatedIds,
    progress_summary: String(progress_summary).trim(),
    related_families_note: raw.related_families_note ?? null,
    caution_note: raw.caution_note ?? null,
    references,
    notes: mergeNotes(raw),
    theorem_status,
    status: theorem_status,
    problem_type,
    maturity,
    evidence_level,
    verification_state,
    problem_statement,
    statement: problem_statement,
    summary,
    short_title,
    known_results,
    remaining_gap,
    status_explanation,
    scope,
    tags,
    aliases,
    priority,
    last_verified_at,
    last_verified_by,
    editorial_notes,
    public_notes,
    _sortDate: raw.last_updated || '0000-00-00',
  };
}

let _clustersCache = null;

export function loadClustersYaml() {
  if (_clustersCache) return _clustersCache;
  const raw = fs.readFileSync(CLUSTERS_PATH, 'utf8');
  const doc = yaml.load(raw);
  _clustersCache = doc.clusters || {};
  return _clustersCache;
}

export function getClusterMeta(slug) {
  const c = loadClustersYaml()[slug];
  return c || null;
}

export const CLUSTER_LABELS = Object.fromEntries(
  CLUSTERS.map(slug => {
    const m = getClusterMeta(slug);
    return [slug, m?.label || slug];
  }),
);

export function getAllProblems() {
  return fs
    .readdirSync(PROBLEMS_DIR)
    .filter(f => f.endsWith('.yaml'))
    .map(f => {
      const raw = yaml.load(fs.readFileSync(path.join(PROBLEMS_DIR, f), 'utf8'));
      return normalizeProblem(raw);
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function getProblemById(id) {
  const all = getAllProblems();
  return all.find(p => p.id === id) || null;
}

export function getStats(problems) {
  const ts = x => problems.filter(p => p.theorem_status === x).length;
  return {
    total: problems.length,
    open: ts('open'),
    partial: ts('partial'),
    conditional: ts('conditional'),
    solved: ts('solved'),
    needs_review: ts('needs_review'),
  };
}

function matchesFilterValue(problemValue, filterValues) {
  if (!filterValues || filterValues.length === 0) return true;
  const pv = toArray(problemValue);
  return filterValues.some(f => pv.includes(f));
}

function matchesFilterMultiArray(problemArrays, filterValues) {
  if (!filterValues || filterValues.length === 0) return true;
  const flat = problemArrays.flat();
  return filterValues.some(f => flat.includes(f));
}

/**
 * @param {object[]} problems
 * @param {object} filters - keys: status, cluster, family, asymptotics, coupling, equation_level, regime, relevance, fv_suitability
 * Each value: string[] or undefined
 */
function recentlyVerified(p, days = 365) {
  const d = p.last_verified_at;
  if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
  const t = new Date(`${d}T12:00:00Z`).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t < days * 86400000;
}

export function filterProblems(problems, filters = {}) {
  if (!filters || typeof filters !== 'object') return problems;
  return problems.filter(p => {
    const tStatus = filters.theorem_status || filters.status;
    if (!matchesFilterValue(p.theorem_status, tStatus)) return false;
    if (!matchesFilterValue(p.problem_type, filters.problem_type)) return false;
    if (!matchesFilterValue(p.maturity, filters.maturity)) return false;
    if (filters.has_primary === true && !p.references?.some(r => r.kind === 'primary')) return false;
    if (filters.has_primary === false && p.references?.some(r => r.kind === 'primary')) return false;
    if (filters.recently_verified === true && !recentlyVerified(p)) return false;
    if (filters.recently_verified === false && recentlyVerified(p)) return false;
    if (!matchesFilterValue(p.cluster, filters.cluster)) return false;
    if (!matchesFilterValue([p.family, ...(p.families || [])], filters.family)) return false;
    if (!matchesFilterValue([p.asymptotics, ...(p.asymptotics_list || [])], filters.asymptotics))
      return false;
    if (!matchesFilterValue(p.coupling, filters.coupling)) return false;
    if (!matchesFilterMultiArray([p.equation_level], filters.equation_level)) return false;
    if (!matchesFilterMultiArray([p.regime], filters.regime)) return false;
    if (!matchesFilterValue(p.relevance, filters.relevance)) return false;
    if (!matchesFilterValue(p.fv_suitability, filters.fv_suitability)) return false;
    return true;
  });
}

export function groupProblemsByCluster(problems) {
  const map = Object.fromEntries(CLUSTERS.map(s => [s, []]));
  for (const p of problems) {
    if (map[p.cluster]) map[p.cluster].push(p);
  }
  return map;
}

function incrementCount(obj, key) {
  if (!key) return;
  obj[key] = (obj[key] || 0) + 1;
}

/**
 * Tag counts for filter UI (per dimension).
 */
export function getTagCounts(problems) {
  const counts = {
    status: {},
    theorem_status: {},
    problem_type: {},
    maturity: {},
    cluster: {},
    family: {},
    asymptotics: {},
    coupling: {},
    equation_level: {},
    regime: {},
    relevance: {},
    fv_suitability: {},
  };
  for (const p of problems) {
    incrementCount(counts.status, p.theorem_status);
    incrementCount(counts.theorem_status, p.theorem_status);
    incrementCount(counts.problem_type, p.problem_type);
    incrementCount(counts.maturity, p.maturity);
    incrementCount(counts.cluster, p.cluster);
    incrementCount(counts.family, p.family);
    for (const a of p.asymptotics_list || [p.asymptotics]) incrementCount(counts.asymptotics, a);
    incrementCount(counts.coupling, p.coupling);
    for (const e of p.equation_level || []) incrementCount(counts.equation_level, e);
    for (const r of p.regime || []) incrementCount(counts.regime, r);
    incrementCount(counts.relevance, p.relevance);
    incrementCount(counts.fv_suitability, p.fv_suitability);
  }
  return counts;
}

export function getDependenciesGraph(problems) {
  const ids = new Set(problems.map(p => p.id));
  const edges = [];
  for (const p of problems) {
    for (const d of p.dependencies || []) {
      if (ids.has(d)) edges.push({ from: p.id, to: d });
    }
  }
  return { nodes: [...ids], edges };
}

/** Reverse map: id -> list of problems that depend on it */
export function getUnlocksMap(problems) {
  const map = Object.fromEntries(problems.map(p => [p.id, []]));
  for (const p of problems) {
    for (const d of p.dependencies || []) {
      if (map[d]) map[d].push(p.id);
    }
  }
  return map;
}

export function getFormalVerificationProblems(problems, minLevel = 'medium') {
  const order = { high: 0, medium: 1, low: 2 };
  const threshold = order[minLevel] ?? 1;
  return problems
    .filter(p => order[p.fv_suitability] <= threshold)
    .sort((a, b) => {
      const c = order[a.fv_suitability] - order[b.fv_suitability];
      if (c !== 0) return c;
      return a.id.localeCompare(b.id);
    });
}

export function getRelatedByTags(problem, all, limit = 6) {
  const scores = new Map();
  for (const o of all) {
    if (o.id === problem.id) continue;
    let s = 0;
    if (o.family === problem.family) s += 3;
    if (o.cluster === problem.cluster) s += 2;
    for (const e of problem.equation_level || []) {
      if ((o.equation_level || []).includes(e)) s += 1;
    }
    if (o.asymptotics === problem.asymptotics) s += 1;
    if (o.relevance === problem.relevance) s += 1;
    if (s > 0) scores.set(o.id, s);
  }
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([id]) => all.find(p => p.id === id))
    .filter(Boolean);
}

/** Visible when entry should not be cited as literature-grounded yet. */
export function needsEditorialBanner(p) {
  return p.theorem_status === 'needs_review' || p.evidence_level === 'refs_missing';
}

export function hasPrimaryReference(p) {
  return Array.isArray(p.references) && p.references.some(r => r.kind === 'primary');
}

/** @deprecated use needsEditorialBanner */
export function needsReferencesCuration(p) {
  return needsEditorialBanner(p);
}
