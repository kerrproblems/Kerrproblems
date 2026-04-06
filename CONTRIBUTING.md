# Contributing to kerrproblems.com

All problems live in `problems/` as YAML (`K-XXX.yaml`). Pushes to `main` should pass `npm run validate`.

## Quick rules

1. **No TODO/FIXME/references-pending** text in fields that render on the public site.
2. Use **`theorem_status`** (not legacy `status`) plus **`problem_type`**, **`maturity`**, **`evidence_level`**, **`verification_state`**.
3. Fill the **`scope`** block and structured **`known_results`** / **`remaining_gap`** when possible.
4. **References:** at least two items with at least one `kind: primary`, each with a `relevance` sentence—**unless** the row is explicitly `theorem_status: needs_review`.
5. **`solved`** only if `known_results` states the exact matching theorem and references back it up.
6. **`quantitative_sharpening`** must point to the known qualitative baseline (usually in `known_results`).

See also:

- `/methodology` on the built site (or `docs/STATUS_TAXONOMY.md`)
- `docs/EDITORIAL_POLICY.md`, `docs/PROBLEM_SCHEMA.md`
- `docs/contribute` page source: `src/pages/contribute.astro`

## Scripts

- `npm run validate` — taxonomy (`scripts/validate_problems.mjs`) + editorial report (`scripts/validate_editorial.mjs` → `docs/audit/problem_validation_report.md`).
- `node scripts/migrate_editorial_schema.mjs` — idempotent bulk cleanup / cross-links (run only when you understand the diff).

## PR expectations

Explain literature changes in the PR body; cite papers for status upgrades or new `known_results` bullets.
