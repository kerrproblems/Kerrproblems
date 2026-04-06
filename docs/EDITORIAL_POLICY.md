# Editorial policy

## Goals

1. Present Kerr Problems as a **curated** database, not an informal notebook.
2. Separate **what is proved** (with citations), **what is conjectured**, and **which hypotheses/regimes** apply.
3. Never ship TODO/FIXME/“references pending” strings on public-facing fields.
4. Do not fabricate citations, solved statuses, or theorem attributions.

## Axes

- **theorem_status** — solution state of the mathematical target **as recorded on this site** (not a substitute for a bibliography).
- **research_state** — whether the target is classically solved in the literature, open there, or a synthesized / high-value unformalized direction.
- **problem_type** — intellectual genre (classical vs quantitative sharpening vs formalization, etc.).
- **maturity** — how complete the scoping metadata is.
- **evidence_level** — whether primary literature is attached.
- **verification_state** — editorial pipeline state.
- **publish** — if `false`, the entry stays out of the main index, clusters, and RSS until promoted (see `data/problems_provisional/` and `/audit/provisional-problems/`).

## Solved entries

Use **`theorem_status: solved`** only together with a filled **`solution_pointer`** (theorem text + attribution or citation key) and references that verify the claim. Manifest or conversational hints of “solved” are **not** sufficient.

## References

Entries that are not `theorem_status: needs_review` should list **at least two** references, including **at least one `kind: primary`**, and each item needs a short `relevance` note. If this cannot be met, use `needs_review` and keep the page visibly flagged in the UI.

## Uncertainty

When literature support cannot be confirmed, prefer `needs_review`, `editorial_revision_needed`, and explicit `status_explanation` text over speculative certainty.
