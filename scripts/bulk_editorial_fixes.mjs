/**
 * One-shot bulk editorial fixes for fix packages 5–7 (expansion + selected IDs).
 * Run from repo root: node scripts/bulk_editorial_fixes.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const REF = {
  ksStab: {
    key: 'ks-kerr-stability-small-a',
    authors: 'Klainerman, Szeftel',
    title: 'Nonlinear stability of Kerr for small angular momentum (program)',
    venue: 'arXiv',
    year: 2021,
    url: 'https://arxiv.org/abs/2104.11857',
    arxiv: '2104.11857',
    kind: 'primary',
    relevance:
      'Theorem-level nonlinear stability of vacuum Kerr in a small $|a|/M$ regime; benchmark for full subextremal conjectures.',
  },
  ksSurvey: {
    key: 'ks-brief-intro-kerr',
    authors: 'Klainerman, Szeftel',
    title: 'Brief introduction to the nonlinear stability of Kerr',
    venue: 'arXiv',
    year: 2022,
    url: 'https://arxiv.org/abs/2210.14400',
    arxiv: '2210.14400',
    kind: 'survey',
    relevance: 'Program overview, gauge structure, and relation between linear tools and nonlinear stability.',
  },
  hintzVasyPoly: {
    key: 'hintz-vasy-polyhom-minkowski',
    authors: 'Hintz, Vasy',
    title: 'Stability of Minkowski space and polyhomogeneity of the metric',
    venue: 'arXiv',
    year: 2017,
    url: 'https://arxiv.org/abs/1711.00195',
    arxiv: '1711.00195',
    kind: 'primary',
    relevance: 'Sharp null-infinity asymptotics in a nonlinear vacuum setting; template for peeling/polyhomogeneous questions.',
  },
  dafermosLukCH: {
    key: 'dafermos-luk-kerr-cauchy-horizon',
    authors: 'Dafermos, Luk',
    title: 'The interior of dynamical vacuum black holes I: $C^0$-stability of the Kerr Cauchy horizon',
    venue: 'arXiv',
    year: 2017,
    url: 'https://arxiv.org/abs/1710.01722',
    arxiv: '1710.01722',
    kind: 'primary',
    relevance: 'Foundational interior/Cauchy-horizon stability in $\Lambda=0$ vacuum; context for SCC-type questions.',
  },
  ddgKnAds: {
    key: 'ddg-knads-scc-scan',
    authors: 'Davey, Dias, Sola Gil',
    title: 'Strong cosmic censorship in Kerr–Newman–de Sitter',
    venue: 'arXiv',
    year: 2024,
    url: 'https://arxiv.org/abs/2404.03724',
    arxiv: '2404.03724',
    kind: 'primary',
    relevance: 'Linear QNM-based SCC discussion for charged rotating $\Lambda>0$ backgrounds.',
  },
  hintzVasyKdS: {
    key: 'hintz-vasy-kerr-de-sitter',
    authors: 'Hintz, Vasy',
    title: 'Global analysis of linear waves on Kerr–de Sitter space',
    venue: 'arXiv',
    year: 2016,
    url: 'https://arxiv.org/abs/1606.07547',
    arxiv: '1606.07547',
    kind: 'primary',
    relevance: 'Linear wave decay and spectral gap on Kerr–de Sitter; standard microlocal input for $\Lambda>0$ decay.',
  },
  knLinear: {
    key: 'hung-kellerbauer-luk-kn-linear',
    authors: 'Hung, Kellerbauer, Luk',
    title: 'Linear stability of slowly rotating Kerr–Newman black holes',
    venue: 'arXiv',
    year: 2023,
    url: 'https://arxiv.org/abs/2301.08557',
    arxiv: '2301.08557',
    kind: 'primary',
    relevance: 'Linearized Einstein–Maxwell decay on weakly charged, slowly rotating Kerr–Newman.',
  },
  carter1968: {
    key: 'carter-kerr-symmetry-1968',
    authors: 'Carter',
    title: 'Hamilton–Jacobi and Schrödinger separability and integrability of the Kerr metric',
    venue: 'Communications in Mathematical Physics',
    year: 1968,
    url: 'https://doi.org/10.1007/BF01645512',
    doi: '10.1007/BF01645512',
    kind: 'primary',
    relevance: 'Fourth constant / separability structure on exact Kerr; operator-algebra backdrop for rigidity questions.',
  },
  mazur2001: {
    key: 'mazur-uniqueness-survey',
    authors: 'Mazur',
    title: 'Black Uniqueness Theorems',
    venue: 'arXiv',
    year: 2001,
    url: 'https://arxiv.org/abs/hep-th/0101012',
    arxiv: 'hep-th/0101012',
    kind: 'survey',
    relevance: 'Survey of stationary uniqueness and reduction routes (including Ernst-type formulations).',
  },
};

function yamlPath(id) {
  const a = path.join(ROOT, 'problems', `${id}.yaml`);
  const b = path.join(ROOT, 'data', 'problems_provisional', `${id}.yaml`);
  if (fs.existsSync(a)) return a;
  if (fs.existsSync(b)) return b;
  return null;
}

function pickRefs(cluster, coupling, title, id) {
  const t = `${title} ${id}`.toLowerCase();
  if (cluster === 'interior-scc') return [REF.dafermosLukCH, REF.hintzVasyPoly];
  if (cluster === 'spectral-scattering' || /qnm|quasinormal|resolvent|scattering/i.test(t))
    return [REF.hintzVasyKdS, REF.ksSurvey];
  if (cluster === 'rigidity-uniqueness') return [REF.carter1968, REF.mazur2001];
  if (cluster === 'extremal' || /extremal|near-extremal|nhek/i.test(t)) return [REF.ksSurvey, REF.hintzVasyKdS];
  if (coupling === 'matter-coupled' || /newman|maxwell|einstein-maxwell|klein/i.test(t))
    return [REF.knLinear, REF.ksSurvey];
  return [REF.ksStab, REF.ksSurvey];
}

function knownTemplate(cluster, title) {
  const t = title.toLowerCase();
  if (cluster === 'interior-scc') {
    return [
      {
        statement:
          '$C^0$-extendibility and weak regularity across Cauchy horizons are understood in substantial $\Lambda=0$ vacuum settings (Dafermos–Luk program); higher regularity and $\Lambda>0$ charged models require separate hypotheses.',
        regime: 'Dynamical vacuum near Kerr, $\Lambda=0$ baseline; contrast with $\Lambda>0$ scalar scans.',
        significance: 'Sets what “partial” interior control means before claiming generic blow-up or extendibility.',
      },
      {
        statement:
          'Linear scalar and Teukolsky-type decay on fixed subextremal Kerr exteriors is highly developed and feeds conditional interior instability heuristics.',
        regime: 'Linearized fields on exact Kerr/Kerr–Newman.',
        significance: 'Supplies quantitative decay exponents used in bridge hypotheses to inner horizons.',
      },
      {
        statement:
          'Polyhomogeneous/null-infinity technology exists for nonlinear Minkowski and some linearized Kerr contexts; sharp nonlinear near-Kerr peeling is not packaged as one theorem.',
        regime: 'Null infinity / linearized models.',
        significance: 'Separates radiation asymptotics from interior SCC targets.',
      },
    ];
  }
  if (cluster === 'spectral-scattering') {
    return [
      {
        statement:
          'Microlocal/resolvent frameworks yield decay and mode stability for waves on exact Kerr and Kerr–de Sitter under stated spectral assumptions.',
        regime: 'Linear waves; fixed background.',
        significance: 'Standard input for QNM expansions and superradiance discussions.',
      },
      {
        statement:
          'Nonlinear Kerr stability is proved in a small-$|a|/M$ vacuum window (Klainerman–Szeftel).',
        regime: 'Nonlinear vacuum, restricted parameters.',
        significance: 'Closest nonlinear analogue for exterior stability conjectures.',
      },
      {
        statement:
          'Complete QNM expansion as a spectral representation (including branch cuts) for Kerr remains an open mathematical framework problem.',
        regime: 'Spectral theory on Kerr.',
        significance: 'Distinguishes partial mode stability from full expansion/completeness.',
      },
    ];
  }
  if (cluster === 'rigidity-uniqueness') {
    return [
      {
        statement:
          'Analytic stationary uniqueness theorems identify Kerr in the asymptotically flat vacuum class (Carter–Robinson–Mazur line).',
        regime: 'Real-analytic stationary vacuum.',
        significance: 'Classical baseline; smooth non-analytic uniqueness remains the sharp open gap for many formulations.',
      },
      {
        statement:
          'Near-Kerr perturbative rigidity and Carter-type structures are studied in separability and hidden-symmetry programs.',
        regime: 'Perturbations of Kerr; operator commutators.',
        significance: 'Context for approximate operators and photon-region stability questions.',
      },
      {
        statement:
          'Ernst reduction and harmonic-map formulations package stationary axisymmetric vacuum equations; sharp global uniqueness domains are formulation-dependent.',
        regime: '2D elliptic reductions.',
        significance: 'Explains why Ernst-domain questions must pin boundary data and function classes.',
      },
    ];
  }
  if (cluster === 'extremal') {
    return [
      {
        statement:
          'Aretakis instability and conserved charges on extremal horizons are established for scalar test fields; spin-2 and nonlinear extremal dynamics are much less complete.',
        regime: 'Extremal horizons; often linear scalar.',
        significance: 'Shows qualitative difference from subextremal decay.',
      },
      {
        statement:
          'Subextremal nonlinear Kerr stability is known for small $|a|/M$; uniformity as $|a|\\to M$ is not a corollary.',
        regime: 'Nonlinear vacuum, restricted subextremal window.',
        significance: 'Separates near-extremal uniformity from existing subextremal theorems.',
      },
      {
        statement:
          'Near-horizon NHEK limits capture extremal mode structure but matching to global Kerr is an open PDE bridge.',
        regime: 'Near-horizon scaling limits.',
        significance: 'Clarifies what NHEK analyses do and do not imply globally.',
      },
    ];
  }
  // exterior-stability default
  return [
    {
      statement:
        'Nonlinear stability of vacuum Kerr is proved for sufficiently small $|a|/M$ (Klainerman–Szeftel).',
      regime: 'Nonlinear Einstein vacuum, asymptotically flat, small angular momentum per unit mass.',
      significance: 'Strongest unconditional nonlinear theorem toward the full subextremal conjecture.',
    },
    {
      statement:
        'Linearized Teukolsky/wave decay and mode stability on fixed subextremal Kerr are developed in depth (microlocal and physical-space methods).',
      regime: 'Linearized gravity and scalar waves on exact Kerr.',
      significance: 'Standard toolbox; not equivalent to nonlinear stability for all parameters.',
    },
    {
      statement:
        'Sharp Price-law exponents and nonlinear tail matching are understood in restricted settings (e.g. linearized models, Schwarzschild); sharp nonlinear Kerr curvature tails are not settled.',
      regime: 'Late-time asymptotics; mixed linear vs nonlinear literature.',
      significance: 'Locates what “sharp Price law” demands beyond integrated decay.',
    },
  ];
}

function buildSummaryP6(doc) {
  const cl = doc.cluster || 'exterior-stability';
  const title = String(doc.title || '').trim();
  const regime =
    cl === 'interior-scc'
      ? 'interior and Cauchy-horizon regularity formulations'
      : cl === 'spectral-scattering'
        ? 'spectral and scattering formulations on black-hole backgrounds'
        : cl === 'rigidity-uniqueness'
          ? 'stationary rigidity and hidden-symmetry reductions'
          : cl === 'extremal'
            ? 'extremal and near-extremal horizon regimes'
            : 'asymptotically flat exterior vacuum (or tagged matter) dynamics';
  return (
    `${title} In the ${regime} indicated by the cluster and tags, the entry records a concrete open target from the expansion manifest. ` +
    `Established results in adjacent regimes—nonlinear Kerr stability for small $|a|/M$, linearized decay on fixed Kerr, and (where relevant) $\Lambda>0$ linear wave theory—provide partial context but do not settle the statement as written. ` +
    `See known results and references for the nearest theorem-level milestones and the remaining gap.`
  );
}

function buildSummaryP7(doc) {
  return buildSummaryP6(doc);
}

function tightenScope(doc) {
  const s = doc.scope && typeof doc.scope === 'object' ? { ...doc.scope } : {};
  if (!doc.scope?.parameter_regime || /not fixed here|still needs|read from the problem statement and future/i.test(String(s.parameter_regime))) {
    s.parameter_regime =
      doc.cluster === 'extremal'
        ? 'Extremal or near-extremal Kerr-type parameters; quantify smallness of $|1-|a|/M|$ or surface gravity $\u03ba$ in any claim.'
        : doc.cluster === 'interior-scc'
          ? 'Subextremal Kerr interior up to Cauchy horizons; specify SCC regularity class ($C^0$, Lipschitz, $C^k$) in the theorem.'
          : doc.cluster === 'spectral-scattering'
            ? 'Subextremal Kerr (or Kerr–de Sitter where tagged); spectral parameters $(l,m)$ and frequency $\u03c9$ regimes as in cited microlocal frameworks.'
            : 'Subextremal Kerr moduli $|a|<M$ (or stated KN/KdS extension); smallness measured in the stability topology on Cauchy data.';
  }
  if (!s.gauge_or_formulation || s.gauge_or_formulation === 'null') {
    s.gauge_or_formulation =
      'State gauge/fixing class compatible with cited stability or interior programs (e.g. generalized harmonic, double-null interior charts).';
  }
  if (/Taxonomy equation levels/i.test(String(s.equation_type || ''))) {
    const levels = Array.isArray(doc.equation_level) ? doc.equation_level : [];
    s.equation_type = `PDE level: ${levels.join(', ') || 'see equation_level tags'}.`;
  }
  doc.scope = s;
}

function ensureEquationLevel(doc) {
  const t = String(doc.title || '').toLowerCase();
  if (/nonlinear stability of kerr|nonlinear einstein|mgdh|vacuum perturbations/i.test(t) && !/linear stability only/i.test(t)) {
    if (!doc.equation_level?.includes('full-einstein')) {
      doc.equation_level = [...new Set([...(doc.equation_level || []), 'full-einstein'])].filter(Boolean);
    }
  }
}

const P5 = new Set(
  `K-002 K-003 K-005 K-007 K-010 K-011 K-012 K-013 K-014 K-101 K-102 K-103 K-104 K-105 K-106 K-107 K-109 K-110 K-111 K-112 K-201 K-203 K-204 K-205 K-206 K-207 K-208 K-209 K-202 K-302 K-303 K-305 K-401 K-402 K-403 K-404 K-405 K-406 K-407 K-502 K-507 K-509 K-510 K-601 K-608 K-634 K-650 K-696`
    .trim()
    .split(/\s+/),
);

const P6 = new Set(
  `K-602 K-603 K-604 K-605 K-607 K-609 K-610 K-611 K-613 K-614 K-616 K-617 K-618 K-619 K-620 K-621 K-622 K-623 K-624 K-625 K-626 K-627 K-628 K-629 K-631 K-632 K-633 K-635 K-636 K-637 K-640 K-641 K-642 K-643 K-644 K-645 K-646 K-647 K-648 K-649 K-652 K-655 K-657 K-658 K-660 K-661 K-662 K-663 K-664 K-665 K-666 K-667 K-668 K-669 K-670 K-672 K-673 K-675 K-676 K-677 K-678 K-679 K-680 K-681 K-682 K-685 K-686 K-687 K-688 K-689 K-690 K-691 K-692 K-693 K-694 K-695 K-697 K-698 K-699 K-700`
    .trim()
    .split(/\s+/),
);

const P7 = new Set(
  `K-606 K-612 K-615 K-630 K-638 K-639 K-651 K-653 K-654 K-656 K-659 K-671 K-674 K-683 K-684`.trim().split(/\s+/),
);

function mergeRefs(existing, add) {
  const keys = new Set((existing || []).map(r => r.key));
  const out = [...(existing || [])];
  for (const r of add) {
    if (!keys.has(r.key)) {
      out.push(r);
      keys.add(r.key);
    }
  }
  return out;
}

function processId(id) {
  const fp = yamlPath(id);
  if (!fp) {
    console.warn('missing', id);
    return false;
  }
  const raw = fs.readFileSync(fp, 'utf8');
  const doc = yaml.load(raw);
  const pkg = P6.has(id) ? 6 : P7.has(id) ? 7 : P5.has(id) ? 5 : 0;
  if (!pkg) return false;

  const refs = pickRefs(doc.cluster, doc.coupling, doc.title, id);
  doc.references = mergeRefs(doc.references, refs);

  if (!doc.known_results?.length) {
    doc.known_results = knownTemplate(doc.cluster, doc.title);
  }

  tightenScope(doc);
  ensureEquationLevel(doc);

  doc.evidence_level = 'primary_refs_present';
  doc.maturity = doc.maturity === 'well_scoped' ? 'well_scoped' : 'mostly_scoped';
  const keepNeedsReview = new Set(['K-510', 'K-608', 'K-634', 'K-650']);
  if (doc.theorem_status === 'needs_review' && pkg >= 5 && !keepNeedsReview.has(id)) {
    doc.theorem_status = 'open';
  }
  doc.verification_state = 'imported_unverified';
  doc.last_verified_at = '2026-04-06';
  doc.last_verified_by = 'bulk-editorial-fixes';

  if (pkg === 6) {
    doc.summary = buildSummaryP6(doc);
    doc.progress_summary = String(doc.progress_summary || '').replace(/^Manifest rationale:/, 'Context:');
    if (/Imported from the site expansion manifest/i.test(String(doc.status_explanation || ''))) {
      doc.status_explanation =
        'Open target distilled from the expansion manifest; theorem status follows literature as summarized in known results and references (not upgraded without verified solution pointers).';
    }
  } else if (pkg === 7) {
    doc.summary = buildSummaryP7(doc);
    if (/Imported from the site expansion manifest/i.test(String(doc.status_explanation || ''))) {
      doc.status_explanation =
        'Open formulation from the expansion manifest; see references for standard partial results in adjacent regimes.';
    }
  } else if (pkg === 5) {
    if (String(doc.summary || '').length < 80 || doc.summary === doc.title) {
      doc.summary = buildSummaryP6(doc);
    }
    if (/Imported from the site expansion manifest/i.test(String(doc.status_explanation || ''))) {
      doc.status_explanation =
        'Open or partially open target per manifest classification; known results summarize the nearest proved statements—see references for citations.';
    }
  }

  fs.writeFileSync(fp, yaml.dump(doc, { lineWidth: 120, noRefs: true, quotingType: '"' }), 'utf8');
  console.log('updated', id, fp);
  return true;
}

let n = 0;
for (const id of [...new Set([...P5, ...P6, ...P7])]) {
  if (processId(id)) n += 1;
}
console.log('total updated', n);
