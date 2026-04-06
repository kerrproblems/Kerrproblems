# Problem schema reference

Each file in `/problems/` is `{id}.yaml` (e.g. `K-001.yaml`). The `id` must match the filename stem.

## Required fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | `K-` + three digits |
| `title` | string | Short descriptive title |
| `cluster` | string | One of: `exterior-stability`, `interior-scc`, `extremal`, `rigidity-uniqueness`, `spectral-scattering` |
| `theorem_status` | string | `open` \| `partial` \| `conditional` \| `solved` \| `needs_review` |
| `problem_type` | string | `classical_frontier` \| `literature_reformulation` \| `quantitative_sharpening` \| `formalization_target` \| `speculative_direction` |
| `maturity` | string | `well_scoped` \| `mostly_scoped` \| `provisional` |
| `evidence_level` | string | `primary_refs_present` \| `secondary_refs_only` \| `refs_missing` |
| `verification_state` | string | `verified_recently` \| `imported_unverified` \| `editorial_revision_needed` |
| `scope` | object | Background, equation type, linearity, regularity, parameter regime, asymptotics, optional gauge |
| `known_results` | list | `{ statement, regime?, significance? }` |
| `remaining_gap` | string | What remains open (often mirrors completion criteria until refined) |
| `status_explanation` | string | Especially for `conditional` / editorial nuance |
| `summary` / `short_title` | string | One-line summary and card title |
| `related_problem_ids` | list | IDs (merged with `related` in the loader) |
| `last_verified_at` / `last_verified_by` | string | Editorial audit trail |
| `editorial_notes` / `public_notes` | string | Maintainer-only vs public-facing notes |
| `statement` | string | Precise problem statement (multiline OK) |
| `math_required` | string | Mathematical prerequisites |
| `why_it_matters` | string | Motivation |
| `completion_criteria` | string | What counts as a solution |
| `implications` | string | Consequences if solved |
| `difficulty` | int | 1 (accessible)–5 (frontier) |
| `family` | string | Kerr geometry class (see enums below) |
| `asymptotics` | string | Asymptotic structure |
| `coupling` | string | `vacuum` \| `matter-coupled` |
| `equation_level` | string[] | Non-empty; PDE / model level (see enums) |
| `regime` | string[] | Non-empty; dynamical / spatial regime |
| `relevance` | string | `pure-math` \| `mixed` \| `physics-facing` |
| `fv_suitability` | string | `high` \| `medium` \| `low` (formal verification) |
| `fv_reason` | string | Short justification for FV suitability |
| `progress_summary` | string | Conservative summary of what is known (no fabricated theorems) |
| `dependencies` | string[] | Problem IDs this entry conceptually builds on |
| `related` | string[] | Related problems (peer links; may be empty) |
| `references` | list | Structured entries with `kind` + `relevance` (empty allowed only for `theorem_status: needs_review`) |

## Optional fields

| Field | Type | Description |
|-------|------|-------------|
| `related_families_note` | string \| null | When “Kerr” in the title is broader or ambiguous |
| `caution_note` | string \| null | Subtle categorization or scope warnings |
| `posed_by` | string \| null | |
| `posed_year` | int \| null | |
| `prizes` | string \| null | |
| `notes` | string \| null | Maintainer notes |
| `last_updated` | date | `YYYY-MM-DD` |

## `references` item shape

Each entry may include any of:

- `arxiv`: arXiv id (e.g. `2104.11857`)
- `doi`: DOI string
- `note`: free-text description or curation comment
- `placeholder`: explicit TODO when nothing is verified locally

Do **not** invent arXiv IDs or DOIs.

## Taxonomy enums

### `family`

- `exact-kerr` — the fixed Kerr geometry or exact solution class
- `near-kerr-vacuum` — perturbations / dynamics near vacuum Kerr
- `kerr-newman` — charged rotating family
- `kerr-de-sitter` — positive Λ extensions
- `kerr-ads` — AdS extensions
- `nhek` — near-horizon extremal Kerr–like limits
- `related-rotating-black-hole` — other rotating black-hole models tied to the same mathematical circle

### `asymptotics`

- `asymptotically-flat`
- `de-sitter`
- `anti-de-sitter`
- `mixed`

### `equation_level`

- `null-geodesics`
- `scalar-wave`
- `maxwell`
- `linearized-gravity`
- `full-einstein`
- `einstein-maxwell`
- `stationary-reduction`
- `spectral-operator`
- `inverse-problem`

### `regime`

- `stationary`, `linear`, `nonlinear`, `exterior`, `interior`, `extremal`, `near-extremal`

### `relevance`

- `pure-math` — primarily mathematical relativity / analysis
- `mixed` — substantial overlap
- `physics-facing` — closer to observationally motivated or modeling language (still may be rigorous mathematics)

## Machine-readable schema

See `data/schema.json` (structural reference; the authoritative checks are `npm run validate`).

## Legacy fields (removed by migration)

Older files used `equationType`, `matterModel`, `relevanceProfile`, `formalizationReadiness`, `dependsOn`, `relatedProblems`, etc. The site loader still maps those for safety, but new edits should use the canonical names above.
