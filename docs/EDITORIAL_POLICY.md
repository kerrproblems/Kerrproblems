# Editorial policy

## Goals

1. Present Kerr Problems as a **curated** database, not an informal notebook.
2. Separate **what is proved** (with citations), **what is conjectured**, and **which hypotheses/regimes** apply.
3. Never ship TODO/FIXME/“references pending” strings on public-facing fields.
4. Do not fabricate citations, solved statuses, or theorem attributions.

## Axes

- **theorem_status** — solution state of the mathematical target.
- **problem_type** — intellectual genre (classical vs quantitative sharpening vs formalization, etc.).
- **maturity** — how complete the scoping metadata is.
- **evidence_level** — whether primary literature is attached.
- **verification_state** — editorial pipeline state.

## References

Entries that are not `theorem_status: needs_review` should list **at least two** references, including **at least one `kind: primary`**, and each item needs a short `relevance` note. If this cannot be met, use `needs_review` and keep the page visibly flagged in the UI.

## Uncertainty

When literature support cannot be confirmed, prefer `needs_review`, `editorial_revision_needed`, and explicit `status_explanation` text over speculative certainty.
