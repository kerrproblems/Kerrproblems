# Status taxonomy

## theorem_status

| Value | Meaning |
|-------|---------|
| `open` | No theorem matching the conclusion is documented in-repo under the stated scope. |
| `partial` | Nontrivial proved subcases exist; list them in `known_results`. |
| `conditional` | Conclusion assumes an explicit bridge hypothesis; explain in `status_explanation`. |
| `solved` | Only with `solution_pointer` (theorem + attribution/citation key) **and** references that support it; mirror the theorem in `known_results` when helpful. |
| `needs_review` | Bibliography/scoping not yet verified; may omit references by policy. |

## research_state

Orthogonal to `theorem_status`: how the target relates to published mathematics.

| Value | Meaning |
|-------|---------|
| `solved_in_literature` | Classical literature is understood to contain a proof; site still requires curated `solution_pointer` + refs before `theorem_status: solved`. |
| `open_in_literature` | Standard research question once references are attached. |
| `high_value_unformalized_direction` | Synthesized roadmap, FV-first packaging, or community-artifact goal; say so in `status_explanation` / `origin_type`. |

## problem_type

| Value | Meaning |
|-------|---------|
| `classical_frontier` | Standard community-level targets. |
| `literature_reformulation` | Packaging or synthesis of published threads. |
| `quantitative_sharpening` | Constants, remainders, effective bounds atop qualitative theorems. |
| `formalization_target` | Structured for staged proof-assistant work. |
| `speculative_direction` | Exploratory; use sparingly. |

## maturity

`well_scoped` · `mostly_scoped` · `provisional`

## evidence_level

`primary_refs_present` · `secondary_refs_only` · `refs_missing`

## verification_state

`verified_recently` · `imported_unverified` · `editorial_revision_needed`
