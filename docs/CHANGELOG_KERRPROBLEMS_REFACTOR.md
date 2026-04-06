# Changelog — Kerr Problems editorial refactor (2026-04)

## Site

- Problem detail page reordered: summary → motivation → scope → status explanation → statement → known / gap → references → related.
- Problems index: filters for theorem status, problem type, maturity, primary-reference presence, recent verification.
- New pages: `/methodology`, `/contribute`. Navigation updated in `Base.astro`.
- Editorial banner when `theorem_status: needs_review` or `evidence_level: refs_missing`.

## Data

- YAML schema expanded; `status` renamed to `theorem_status` in migrated files.
- Bulk migration via `scripts/migrate_editorial_schema.mjs`; hand-curated rewrites for priority IDs (K-001, K-004, K-006, K-008, K-009, K-108, K-301, K-304, K-306, K-307, K-308, K-501, K-503, K-504, K-505, K-506, K-508, K-510).
- Cross-links merged for cluster ranges and specific pairs (e.g. K-304 ↔ K-501, K-306 ↔ K-508, K-307 ↔ K-504).

## Tooling

- `src/lib/problems.js` normalization for new fields and reference shape.
- `src/lib/taxonomy.js` enums + labels for new axes.
- `scripts/validate_editorial.mjs` + report output.
- `package.json` `validate` runs both validators.

## Docs

- Added `docs/EDITORIAL_POLICY.md`, `STATUS_TAXONOMY.md`, `PROBLEM_SCHEMA.md`, `AUDIT_SUMMARY_2026_04.md`, `PROVISIONAL_ENTRIES.md`, this changelog, and `docs/audit/problem_validation_report.md` (generated).
