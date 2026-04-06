# Provisional entries

Problems with `maturity: provisional`, `verification_state: editorial_revision_needed`, or **`publish: false`** should be read as **works in progress**.

## Pipeline directory

The April 2026 **expansion batch** (manifest rows N-001–N-100) lives as **K-601–K-700** under `data/problems_provisional/`, all with `publish: false`, `evidence_level: refs_missing`, and **no references** until curators attach verified pointers. Listing: [`/audit/provisional-problems`](/audit/provisional-problems) (built site) or this repo’s `src/pages/audit/provisional-problems.astro`.

## Older in-repo examples (published path, still fragile)

- **K-503** — Carter-operator uniqueness split into explicit variants (a)(b)(c); needs a pinned formulation.
- **K-510** — Ernst-domain uniqueness; PDE domain not literature-locked in-repo (`theorem_status: needs_review`).

Update this document as entries graduate: add references, set `publish: true`, move YAML from `data/problems_provisional/` to `problems/` when appropriate, and tighten `maturity`.
