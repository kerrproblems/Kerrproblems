/** Canonical taxonomy enums and human-readable labels (single source for site + scripts). */

export const CLUSTERS = [
  'exterior-stability',
  'interior-scc',
  'extremal',
  'rigidity-uniqueness',
  'spectral-scattering',
];

/** Legacy single-axis status (kept for YAML migration); prefer `theorem_status`. */
export const STATUSES = ['open', 'partial', 'conditional', 'solved', 'needs_review'];

/** Theorem / solution status (orthogonal to problem_type). */
export const THEOREM_STATUSES = ['open', 'partial', 'conditional', 'solved', 'needs_review'];

export const PROBLEM_TYPES = [
  'classical_frontier',
  'literature_reformulation',
  'quantitative_sharpening',
  'formalization_target',
  'speculative_direction',
];

export const MATURITY_LEVELS = ['well_scoped', 'mostly_scoped', 'provisional'];

export const EVIDENCE_LEVELS = ['primary_refs_present', 'secondary_refs_only', 'refs_missing'];

export const VERIFICATION_STATES = [
  'verified_recently',
  'imported_unverified',
  'editorial_revision_needed',
];

export const FAMILIES = [
  'exact-kerr',
  'near-kerr-vacuum',
  'kerr-newman',
  'kerr-de-sitter',
  'kerr-ads',
  'nhek',
  'related-rotating-black-hole',
];

export const ASYMPTOTICS = [
  'asymptotically-flat',
  'de-sitter',
  'anti-de-sitter',
  'mixed',
];

export const COUPLINGS = ['vacuum', 'matter-coupled'];

export const EQUATION_LEVELS = [
  'null-geodesics',
  'scalar-wave',
  'maxwell',
  'linearized-gravity',
  'full-einstein',
  'einstein-maxwell',
  'stationary-reduction',
  'spectral-operator',
  'inverse-problem',
];

export const REGIMES = [
  'stationary',
  'linear',
  'nonlinear',
  'exterior',
  'interior',
  'extremal',
  'near-extremal',
];

export const RELEVANCE = ['pure-math', 'mixed', 'physics-facing'];

export const FV_SUITABILITY = ['high', 'medium', 'low'];

export const FAMILY_LABELS = {
  'exact-kerr': 'Exact Kerr',
  'near-kerr-vacuum': 'Near-Kerr (vacuum)',
  'kerr-newman': 'Kerr–Newman',
  'kerr-de-sitter': 'Kerr–de Sitter',
  'kerr-ads': 'Kerr–AdS',
  nhek: 'NHEK / near-horizon',
  'related-rotating-black-hole': 'Related rotating BH',
};

export const ASYMPTOTICS_LABELS = {
  'asymptotically-flat': 'Asymptotically flat',
  'de-sitter': 'de Sitter',
  'anti-de-sitter': 'Anti-de Sitter',
  mixed: 'Mixed / multiple',
};

export const COUPLING_LABELS = {
  vacuum: 'Vacuum',
  'matter-coupled': 'Matter-coupled',
};

export const EQUATION_LEVEL_LABELS = {
  'null-geodesics': 'Null geodesics',
  'scalar-wave': 'Scalar wave',
  maxwell: 'Maxwell',
  'linearized-gravity': 'Linearized gravity',
  'full-einstein': 'Full Einstein',
  'einstein-maxwell': 'Einstein–Maxwell',
  'stationary-reduction': 'Stationary reduction',
  'spectral-operator': 'Spectral operator',
  'inverse-problem': 'Inverse problem',
};

export const REGIME_LABELS = {
  stationary: 'Stationary',
  linear: 'Linear',
  nonlinear: 'Nonlinear',
  exterior: 'Exterior',
  interior: 'Interior',
  extremal: 'Extremal',
  'near-extremal': 'Near-extremal',
};

export const RELEVANCE_LABELS = {
  'pure-math': 'Pure math',
  mixed: 'Mixed',
  'physics-facing': 'Physics-facing',
};

export const FV_LABELS = {
  high: 'FV: high',
  medium: 'FV: medium',
  low: 'FV: low',
};

export const THEOREM_STATUS_LABELS = {
  open: 'Open',
  partial: 'Partial progress',
  conditional: 'Conditional',
  solved: 'Solved',
  needs_review: 'Needs review',
};

export const PROBLEM_TYPE_LABELS = {
  classical_frontier: 'Classical frontier',
  literature_reformulation: 'Literature reformulation',
  quantitative_sharpening: 'Quantitative sharpening',
  formalization_target: 'Formalization target',
  speculative_direction: 'Speculative direction',
};

export const MATURITY_LABELS = {
  well_scoped: 'Well scoped',
  mostly_scoped: 'Mostly scoped',
  provisional: 'Provisional',
};

export const EVIDENCE_LEVEL_LABELS = {
  primary_refs_present: 'Primary refs present',
  secondary_refs_only: 'Secondary / survey only',
  refs_missing: 'References missing',
};

export const VERIFICATION_STATE_LABELS = {
  verified_recently: 'Verified recently',
  imported_unverified: 'Imported, unverified',
  editorial_revision_needed: 'Editorial revision needed',
};
