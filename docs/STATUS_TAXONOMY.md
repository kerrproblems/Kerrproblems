# Status taxonomy

## theorem_status

| Value | Meaning |
|-------|---------|
| `open` | No theorem matching the conclusion is documented in-repo under the stated scope. |
| `partial` | Nontrivial proved subcases exist; list them in `known_results`. |
| `conditional` | Conclusion assumes an explicit bridge hypothesis; explain in `status_explanation`. |
| `solved` | Only if `known_results` states the matching theorem and references cite it. |
| `needs_review` | Bibliography/scoping not yet verified; may omit references by policy. |

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
