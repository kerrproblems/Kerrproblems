/** Canonical taxonomy enums and human-readable labels (single source for site + scripts). */

export const CLUSTERS = [
  'exterior-stability',
  'interior-scc',
  'extremal',
  'rigidity-uniqueness',
  'spectral-scattering',
];

export const STATUSES = ['open', 'partial', 'conditional', 'solved'];

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
