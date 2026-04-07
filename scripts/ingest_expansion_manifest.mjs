/**
 * Read data/expansion_from_manifest.tsv (authoritative curated rows),
 * normalize to site schema, detect title overlap with problems/*.yaml,
 * emit data/problems_provisional/K-601.yaml … K-700.yaml and an audit sidecar.
 *
 * Run: node scripts/ingest_expansion_manifest.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const TSV = path.join(ROOT, 'data', 'expansion_from_manifest.tsv');
const OUT_DIR = path.join(ROOT, 'data', 'problems_provisional');
const EXISTING_DIR = path.join(ROOT, 'problems');
const AUDIT = path.join(ROOT, 'docs', 'audit', 'expansion_ingest_notes.md');

const RELATED_BY_CLUSTER = {
  'exterior-stability': ['K-001', 'K-003', 'K-005', 'K-012'],
  'interior-scc': ['K-006', 'K-007', 'K-008', 'K-009'],
  extremal: ['K-201', 'K-202', 'K-203', 'K-204'],
  'rigidity-uniqueness': ['K-301', 'K-302', 'K-303', 'K-304'],
  'spectral-scattering': ['K-401', 'K-402', 'K-403', 'K-404'],
};

const FORMAL_N = new Set([49, 50, 95, 96]);
const SPEC_N = new Set([70, 81, 89, 90, 93, 94]);

function parseLit(lit) {
  const L = String(lit).toLowerCase();
  if (/likely solved|not re-verified/.test(L)) {
    return { research_state: 'high_value_unformalized_direction', theorem_status: 'needs_review' };
  }
  if (/solved classically \(formalization/.test(L)) {
    return { research_state: 'high_value_unformalized_direction', theorem_status: 'open' };
  }
  if (/solved in literature \(formalization/.test(L)) {
    return { research_state: 'solved_in_literature', theorem_status: 'needs_review' };
  }
  if (/solved \(claim in preprint|solved \(new proof/.test(L)) {
    return { research_state: 'solved_in_literature', theorem_status: 'needs_review' };
  }
  if (/open \(as a community/.test(L)) {
    return { research_state: 'high_value_unformalized_direction', theorem_status: 'open' };
  }
  if (
    /open \/ speculative|open\/speculative/.test(L) ||
    /novel conceptual|not standard in gr|stochastic|numerical truncation|potentially interesting/.test(L)
  ) {
    return { research_state: 'high_value_unformalized_direction', theorem_status: 'open' };
  }
  if (
    /partially solved|partial \(existence|partially rigorous|partial progress|partially solved numerically|instability exists|slow rotation \+ microlocal|scalar\/extremal|partially solved \/ active|open \/ partially|open \(partial|open \(partially|open \(strong evidence|open \(criteria known|open \(codimension|key for scattering and decay|partial literature exists/.test(
      L,
    )
  ) {
    return { research_state: 'open_in_literature', theorem_status: 'partial' };
  }
  if (/open \(conditional|conditional progress/.test(L)) {
    return { research_state: 'open_in_literature', theorem_status: 'conditional' };
  }
  if (/^solved\b/.test(L.trim()) && !/formalization/.test(L)) {
    return { research_state: 'solved_in_literature', theorem_status: 'needs_review' };
  }
  if (/^open\b/.test(L.trim())) {
    return { research_state: 'open_in_literature', theorem_status: 'open' };
  }
  return { research_state: 'open_in_literature', theorem_status: 'open' };
}

function inferCluster(n, statement) {
  const s = statement.toLowerCase();
  const overrides = {
    24: 'spectral-scattering',
    36: 'spectral-scattering',
    62: 'spectral-scattering',
    37: 'spectral-scattering',
    38: 'spectral-scattering',
    88: 'spectral-scattering',
    66: 'interior-scc',
    67: 'interior-scc',
    65: 'exterior-stability',
    8: 'exterior-stability',
    9: 'exterior-stability',
    63: 'exterior-stability',
    35: 'exterior-stability',
    83: 'spectral-scattering',
  };
  if (overrides[n]) return overrides[n];

  if (/kerr-ads|kerr-ad\b|ads\b|geon|resonator|mirror|black hole bomb|confining/.test(s)) return 'spectral-scattering';
  if (/kerr-de sitter|kerr-ds|kn-ds|lambda>0.*scc|cosmological constant.*cauchy/.test(s)) {
    if (/cauchy|interior|scc|horizon instability/.test(s)) return 'interior-scc';
    return 'exterior-stability';
  }
  if (
    /cauchy horizon|interior|scc|mgdh|price law inside|blue-shift|mass inflation|weak null|inextendib|characteristic ivp.*interior|interior from exterior|interior.*theorem|threshold.*interior|extendibility.*interior/.test(
      s,
    )
  ) {
    return 'interior-scc';
  }
  if (
    /nhek\b|near-extremal|extremal kerr|aretakis|photon region|uniform.*kappa|kappa=0|redshift estimates.*near-extremal|conserved quantities.*extremal|extremal.*newman|dichotomy.*extremal/.test(
      s,
    ) &&
    !/kerr-de sitter.*cauchy/.test(s)
  ) {
    return 'extremal';
  }
  if (
    /uniqueness|rigidity|mars-simon|killing spinor|multipole|inverse problem|stationary black hole|carter operator|symmetry operators|second-order symmetry/.test(s)
  ) {
    return 'rigidity-uniqueness';
  }
  if (
    /qnm|quasinormal|resonance|scattering|pseudospectrum|spectral|ringdown|branch-cut|inverse spectral|excitation factor|trapped set|normally hyperbolic|embedded eigenvalues|nonlinear qnm|semiclassical quantization/.test(
      s,
    )
  ) {
    return 'spectral-scattering';
  }
  return 'exterior-stability';
}

function inferFamily(statement, cluster) {
  const s = statement;
  if (/Kerr–Newman|Kerr-Newman|gravito-electromagnetic|charged rotating|extremal Kerr-Newman/i.test(s)) {
    return 'kerr-newman';
  }
  if (/Kerr-de Sitter|Kerr-dS|slowly rotating Kerr-de Sitter|Kerr–de Sitter/i.test(s)) return 'kerr-de-sitter';
  if (/Kerr-AdS|Kerr-AdS|AdS endstates/i.test(s)) return 'kerr-ads';
  if (/\bNHEK\b/i.test(s)) return 'nhek';
  if (/Schwarzschild|Myers-Perry|higher-dimensional Kerr/i.test(s)) return 'related-rotating-black-hole';
  if (/de Sitter|Λ>0|cosmological/i.test(s) && cluster !== 'interior-scc') return 'kerr-de-sitter';
  return 'near-kerr-vacuum';
}

function inferAsymptotics(statement) {
  const s = statement.toLowerCase();
  if (/kerr-ad|ads\b|anti-de sitter|mirror/.test(s)) return 'anti-de-sitter';
  if (/de sitter|kerr-ds|lambda>0|cosmological constant|\bkd?s\b/i.test(statement)) return 'de-sitter';
  return 'asymptotically-flat';
}

function inferCoupling(statement) {
  const s = statement.toLowerCase();
  if (/einstein-maxwell|kerr-newman|electromagnetic|klein-gordon|vlasov|matter-coupled|maxwell\/dirac/.test(s)) {
    return 'matter-coupled';
  }
  return 'vacuum';
}

function inferEquationLevel(statement) {
  const s = statement.toLowerCase();
  const out = [];
  if (/maxwell|dirac|electromagnetic|gravito-electromagnetic/.test(s)) out.push('maxwell');
  if (
    /teukolsky|spin-2|linearized gravity|linearized-gravity|linearized einstein|linear stability|linearized gravity scattering/.test(
      s,
    )
  ) {
    out.push('linearized-gravity');
  }
  if (/scalar wave|scalar field|scalar waves at/.test(s)) out.push('scalar-wave');
  if (/geodesic|carter constant|conserved quantities for geodesics/.test(s)) out.push('null-geodesics');
  if (/qnm|quasinormal|resonance|pseudospectrum|spectral|resolvent|scattering operator|inverse problem.*resonances/.test(s)) {
    out.push('spectral-operator');
  }
  if (/uniqueness among stationary|stationary vacua|stationary black hole/.test(s)) out.push('stationary-reduction');
  if (/einstein-klein-gordon|klein-gordon/.test(s)) out.push('full-einstein');
  if (out.length === 0) out.push('full-einstein');
  return [...new Set(out)];
}

function extremalTokensWithoutSubextremal(s) {
  const t = s.replace(/subextremal/gi, ' ');
  return /\bextremal\b|near-extremal|nhek\b|aretakis|photon region|uniform.*kappa|kappa=0|surface gravity/.test(t);
}

function inferRegime(statement, cluster) {
  const s = statement.toLowerCase();
  const r = new Set();
  if (/nonlinear|mgdh|vacuum perturbations|nonlinear stability|nonlinear outcomes|nonlinear evolution|nonlinear near-kerr|nonlinear instability|nonlinear superradiant|nonlinear ringdown|nonlinear interior|nonlinear characteristic|nonlinear backreaction|nonlinear stability of schwarzschild|nonlinear stability of kerr-newman|nonlinear stability of kerr\b/.test(s)) {
    r.add('nonlinear');
  }
  if (
    /linear stability|linearized|linear |teukolsky equation|mode stability|resolvent.*linearized|linearized gravity|linearized einstein|linearized-gravity/.test(
      s,
    )
  ) {
    r.add('linear');
  }
  if (cluster === 'interior-scc' || /interior|cauchy horizon|inside kerr|event horizon data to the interior/.test(s)) {
    r.add('interior');
  }
  if (/exterior|scattering map exterior|null infinity|\\\\mathcal\{i\}|scri|i\^\+/.test(s)) r.add('exterior');
  if (extremalTokensWithoutSubextremal(s)) {
    r.add('near-extremal');
    r.add('extremal');
  }
  if (/stationary|uniqueness among stationary/.test(s)) r.add('stationary');
  if (!r.has('interior')) r.add('exterior');
  if (r.size === 0) r.add('exterior');
  return [...r];
}

function inferProblemType(n, statement) {
  if (n === 100) return 'literature_reformulation';
  if (FORMAL_N.has(n) || n === 34) return 'formalization_target';
  if (SPEC_N.has(n)) return 'speculative_direction';
  const s = statement.toLowerCase();
  if (
    /quantif|computable constants|sharp.*bound|explicit remainder|tail constants|finite set of|universal bounds|uniform in a\/m|mapping properties|weighted sobolev|extraction formula|backreaction|semiclassical|error bounds|stability bounds|pseudospectrum/.test(
      s,
    )
  ) {
    return 'quantitative_sharpening';
  }
  return 'classical_frontier';
}

function inferFv(statement, problemType) {
  if (problemType === 'formalization_target') {
    return {
      fv: 'high',
      reason: 'Formalization targets map naturally to proof-assistant-sized subtasks once scoped.',
    };
  }
  if (problemType === 'speculative_direction') {
    return { fv: 'low', reason: 'Speculative or open-ended; formalization boundary unclear.' };
  }
  const s = statement.toLowerCase();
  if (/formalize|proof assistant/.test(s)) return { fv: 'high', reason: 'Explicit formalization ask.' };
  return { fv: 'low', reason: 'Global PDE or phenomenological target; lemma-level formalization may be possible after scoping.' };
}

function difficultyFromPriority(p) {
  if (p === 'high') return 4;
  if (p === 'medium') return 3;
  return 2;
}

function pickRelated(cluster, statement) {
  const base = RELATED_BY_CLUSTER[cluster] || RELATED_BY_CLUSTER['exterior-stability'];
  const extra = [];
  if (/Kerr-Newman|KN|charged/i.test(statement)) extra.push('K-101', 'K-106');
  if (/Kerr-de Sitter|K-dS/i.test(statement)) extra.push('K-205', 'K-206');
  if (/AdS/i.test(statement)) extra.push('K-107', 'K-108');
  const merged = [...new Set([...extra, ...base])].slice(0, 5);
  return merged;
}

function loadExistingTitles() {
  const map = new Map();
  for (const f of fs.readdirSync(EXISTING_DIR).filter(x => x.endsWith('.yaml'))) {
    const raw = yaml.load(fs.readFileSync(path.join(EXISTING_DIR, f), 'utf8'));
    const t = String(raw.title || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^a-z0-9 $]/g, '')
      .slice(0, 72);
    if (t) map.set(t, raw.id);
  }
  return map;
}

function titleKey(title) {
  return String(title)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 $]/g, '')
    .slice(0, 72);
}

function parseTsv() {
  const text = fs.readFileSync(TSV, 'utf8');
  const lines = text.trim().split('\n');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split('\t');
    if (parts.length < 5) continue;
    const nid = parts[0].trim();
    const n = parseInt(nid.replace(/^N-/, ''), 10);
    rows.push({
      n,
      statement: parts[1].trim(),
      priority: parts[2].trim(),
      lit: parts[3].trim(),
      rationale: parts[4].trim(),
    });
  }
  return rows;
}

function buildRecord(row) {
  const id = `K-${600 + row.n}`;
  const cluster = inferCluster(row.n, row.statement);
  const { research_state, theorem_status } = parseLit(row.lit);
  const problem_type = inferProblemType(row.n, row.statement);
  const { fv: fv_suitability, reason: fv_reason } = inferFv(row.statement, problem_type);
  const family = inferFamily(row.statement, cluster);
  const asymptotics = inferAsymptotics(row.statement);
  const coupling = inferCoupling(row.statement);
  const equation_level = inferEquationLevel(row.statement);
  const regime = inferRegime(row.statement, cluster);
  const related = pickRelated(cluster, row.statement);

  const status_explanation = [
    `Imported from the site expansion manifest row N-${String(row.n).padStart(3, '0')}. `,
    `Manifest “Solved in literature?” note: ${row.lit}. `,
    'No bibliographic packet was supplied in that manifest; this entry is not a literature-grounded status summary until references are curated. ',
    theorem_status === 'needs_review' && /solved|preprint|proof/.test(row.lit.toLowerCase())
      ? 'A “solved” indication in the manifest is not upgraded to theorem_status: solved here without a verified solution_pointer and primary citations. '
      : '',
    research_state === 'high_value_unformalized_direction'
      ? 'Research state is marked as a high-value unformalized or synthesized direction where the manifest frames the target that way. '
      : '',
    theorem_status === 'conditional'
      ? 'Conditional results in the literature are understood modulo explicit spectral, mode-stability, or gauge hypotheses to be spelled out when this entry is curated. '
      : '',
  ].join('');

  const known_results =
    theorem_status === 'partial'
      ? [
          {
            statement:
              'The expansion manifest flags partial literature progress for this target; this repository has not attached verified theorem statements or citations to that progress.',
            regime: 'To be replaced with literature-aligned regimes when curated.',
            significance:
              'Editorial placeholder only—not an assertion about what is proved in any named paper.',
          },
        ]
      : [];

  const scope = {
    background: `${asymptotics.replace(/-/g, ' ')} general relativity context; see family and coupling tags for matter model.`,
    equation_type: `Taxonomy equation levels: ${equation_level.join(', ')}.`,
    linearity: regime.includes('nonlinear') && regime.includes('linear') ? 'both linearized and fully nonlinear aspects' : regime.includes('nonlinear') ? 'nonlinear' : 'linearized',
    regularity: 'Smooth / Sobolev hypotheses must be stated precisely in any final theorem; this provisional entry does not fix minimal regularity.',
    parameter_regime: 'Subextremal vs extremal/near-extremal windows must be read from the problem statement and future literature; not fixed here.',
    asymptotics: asymptotics.replace(/-/g, ' '),
    gauge_or_formulation: null,
  };

  if (theorem_status === 'conditional') {
    scope.gauge_or_formulation =
      'Conditional results depend on explicit spectral/mode-stability or gauge hypotheses; see status_explanation when curated.';
  }

  const math_required = 'To be tightened against primary sources when this entry is promoted from provisional. The manifest statement names the mathematical target only.';

  const progress_summary = `Manifest rationale: ${row.rationale}`;

  return {
    id,
    title: row.statement,
    short_title: row.statement.length > 100 ? `${row.statement.slice(0, 97)}…` : row.statement,
    cluster,
    theorem_status,
    problem_type,
    research_state,
    maturity: 'provisional',
    evidence_level: 'refs_missing',
    verification_state: 'imported_unverified',
    publish: true,
    priority: row.priority,
    summary: row.statement,
    problem_statement: row.statement,
    statement: row.statement,
    why_it_matters: row.rationale,
    scope,
    known_results,
    remaining_gap: row.statement,
    partial_progress: null,
    frontier_gap: null,
    solution_pointer: null,
    status_explanation,
    references: [],
    origin_type: 'synthesized_from_field-needs',
    motivation: row.rationale,
    why_this_should_be_a_problem: row.rationale,
    minimal_formal_statement: row.statement,
    last_verified_at: null,
    last_verified_by: null,
    editorial_notes: `Source manifest: N-${String(row.n).padStart(3, '0')} (expansion_from_manifest.tsv). Numeric footnotes from the original table are not reproduced in this repository.`,
    related_problem_ids: related,
    related,
    dependencies: [],
    aliases: [`N-${String(row.n).padStart(3, '0')}`],
    tags: ['expansion-2026', `manifest-N-${String(row.n).padStart(3, '0')}`],
    public_notes: null,
    math_required,
    completion_criteria: `Establish rigorous theorems matching the scoped statement; precise hypotheses to be taken from the literature when references are added.`,
    implications: 'Depends on problem family; to be sharpened when curated.',
    difficulty: difficultyFromPriority(row.priority),
    family,
    asymptotics,
    coupling,
    equation_level,
    regime,
    relevance: 'pure-math',
    fv_suitability,
    fv_reason,
    progress_summary,
    related_families_note: null,
    caution_note: null,
    notes: null,
    last_updated: '2026-04-06',
  };
}

function main() {
  const rows = parseTsv();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const titles = loadExistingTitles();
  const dupNotes = [];
  const written = [];

  for (const row of rows) {
    const rec = buildRecord(row);
    const tk = titleKey(rec.title);
    const hit = titles.get(tk);
    if (hit) dupNotes.push(`- **${rec.id}** — title near-duplicate of **${hit}** (heuristic key).`);
    const y = yaml.dump(rec, { lineWidth: 120, noRefs: true, quotingType: '"' });
    const fp = path.join(OUT_DIR, `${rec.id}.yaml`);
    fs.writeFileSync(fp, y, 'utf8');
    written.push(rec.id);
  }

  fs.mkdirSync(path.dirname(AUDIT), { recursive: true });
  const auditBody = [
    '# Expansion manifest ingest notes',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    `- Rows ingested: **${written.length}**`,
    `- Output directory: \`data/problems_provisional/\``,
    '- Entries default to `publish: true` (listed on the main index) but remain under `data/problems_provisional/` until moved to `problems/`; references are still empty until curated.',
    '- Theorem-level “solved” indications in the manifest are **not** mapped to `theorem_status: solved` without `solution_pointer` and verified URLs.',
    '',
    '## Possible title overlaps (heuristic)',
    dupNotes.length ? dupNotes.join('\n') : '_(none flagged)_',
    '',
  ].join('\n');
  fs.writeFileSync(AUDIT, auditBody, 'utf8');

  console.log(`Wrote ${written.length} files to ${OUT_DIR}`);
  console.log(`Audit: ${AUDIT}`);
  if (dupNotes.length) console.log(`Title warnings: ${dupNotes.length}`);
}

main();
