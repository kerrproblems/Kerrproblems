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

/**
 * Normalize raw YAML into the canonical shape used by the site.
 * Accepts legacy keys: equationType, matterModel, relevanceProfile, formalizationReadiness,
 * dependsOn, relatedProblems, knownProgress, family spelling related-rotating.
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
  const related = uniq(toArray(raw.related ?? raw.relatedProblems).map(String));

  let progress_summary = raw.progress_summary;
  if (!progress_summary || !String(progress_summary).trim()) {
    const kp = raw.knownProgress;
    if (Array.isArray(kp) && kp.length && kp.some(Boolean)) {
      progress_summary = kp.filter(Boolean).join(' ');
    } else {
      progress_summary =
        'Partial progress exists in adjacent regimes; see references/TODO for precise theorem-level milestones.';
    }
  }

  const references = Array.isArray(raw.references) ? raw.references : [];

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
    related,
    progress_summary: String(progress_summary).trim(),
    related_families_note: raw.related_families_note ?? null,
    caution_note: raw.caution_note ?? null,
    references,
    notes: mergeNotes(raw),
    /** Sort key: last_updated or id */
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
  return {
    total: problems.length,
    open: problems.filter(p => p.status === 'open').length,
    partial: problems.filter(p => p.status === 'partial').length,
    conditional: problems.filter(p => p.status === 'conditional').length,
    solved: problems.filter(p => p.status === 'solved').length,
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
export function filterProblems(problems, filters = {}) {
  if (!filters || typeof filters !== 'object') return problems;
  return problems.filter(p => {
    if (!matchesFilterValue(p.status, filters.status)) return false;
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
    incrementCount(counts.status, p.status);
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

export function needsReferencesCuration(p) {
  return !p.references || p.references.length === 0;
}
