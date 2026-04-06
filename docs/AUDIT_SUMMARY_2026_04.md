# Audit summary — April 2026 editorial refactor

## Headline

The database was **conceptually strong** (problems align with real research frontiers) but **editorially immature**: many rows carried placeholder language, empty references, and a single overloaded “status” chip.

## Main issues addressed

- Bibliography and scope fields were incomplete on most imported rows.
- Status labels needed careful interpretation; “partial” was sometimes read as “almost done.”
- Quantitative sharpenings sat beside classical conjectures without distinction.
- TODO/FIXME strings appeared in public-facing YAML.

## What changed

- **Orthogonal metadata:** `theorem_status`, `problem_type`, `maturity`, `evidence_level`, `verification_state`.
- **Structured content:** `scope`, `known_results`, `remaining_gap`, `status_explanation`.
- **UI:** separate badges, editorial banner for `needs_review` / missing evidence, methodology and contribute pages.
- **Validation:** `npm run validate` runs taxonomy checks plus `scripts/validate_editorial.mjs` and writes `docs/audit/problem_validation_report.md`.
- **Migration:** `scripts/migrate_editorial_schema.mjs` (idempotent) for bulk cross-links and cleanup; priority IDs received hand edits.

## Residual risk

Rows marked `needs_review` remain until maintainers attach two vetted references (unless policy explicitly keeps them flagged). Human literature verification is still required for edge cases and for tightening conditional SCC wordings.

## Expansion batch (same month)

- **100** new stubs (**K-601–K-700**) ingested from `data/expansion_from_manifest.tsv` into `data/problems_provisional/`, **`publish: false`**, with explicit **`research_state`** and cross-links to existing cluster anchors.
- **Publication vs listing** is enforced in the Astro layer: the main index, clusters, RSS, and home highlights use **`getPublishedProblems()`** only; provisional rows remain addressable by direct URL and on **`/audit/provisional-problems/`**.
- **`research_state`** separates “open in the literature” from **high-value unformalized / synthesized** targets without collapsing them into `theorem_status`.
- References are **first-class** for promotion: provisional rows must not move to `problems/` with `publish: true` until the usual two-reference / primary-ref policy is met.
- Quantitative and formalization-style targets stay visible via **`problem_type`** and badges so they are not mistaken for classical flagship conjectures.
