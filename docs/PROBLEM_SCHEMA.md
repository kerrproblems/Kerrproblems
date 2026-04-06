# Problem YAML schema (authoritative field list)

Published files live in `problems/K-XXX.yaml`. **Provisional** batches may live in `data/problems_provisional/K-XXX.yaml` with `publish: false`. The loader in `src/lib/problems.js` normalizes legacy keys (`status` → `theorem_status`, etc.) and merges both directories.

## Required for build + taxonomy validator

- `id`, `title`, `cluster`, `theorem_status` (or legacy `status`)
- `problem_statement` (or legacy `statement`)
- `math_required`, `why_it_matters`, `completion_criteria`, `implications`, `difficulty`
- `family`, `asymptotics`, `coupling`, `equation_level[]`, `regime[]`
- `relevance`, `fv_suitability`, `fv_reason`, `progress_summary`
- `dependencies[]`, `related[]` (or `related_problem_ids[]`)
- `references[]` (may be empty only when `theorem_status: needs_review`)

## Editorial metadata (required for editorial validator on non–needs_review rows)

- `research_state` (`solved_in_literature` \| `open_in_literature` \| `high_value_unformalized_direction`; defaulted in the loader when omitted)
- `publish` (`boolean`; default `true` under `problems/`, default `false` when loading `data/problems_provisional/`)
- `problem_type`, `maturity`, `evidence_level`, `verification_state`
- `origin_type` (optional; e.g. `synthesized_from_field-needs` for manifest imports)
- `solution_pointer` (required when `theorem_status: solved`): `{ theorem_statement, solved_by?, year?, citation_key? }`
- `short_title`, `summary`
- `scope` object with at least: `background`, `equation_type`, `linearity`, `regularity`, `parameter_regime`, `asymptotics`
- `known_results[]` (may be empty; encouraged for `partial`)
- `remaining_gap` (often mirrors `completion_criteria` until refined)
- `status_explanation` (especially for `conditional`)

## Reference object

```yaml
references:
  - key: stable-id
    authors: ...
    title: ...
    venue: ...
    year: 2024
    url: https://...
    arxiv: '2104.11857'   # optional
    doi: ...              # optional
    kind: primary|survey|secondary
    relevance: One sentence on why this pointer matters.
```

## Machine schema

See `data/schema.json` for a structural sketch (not every constraint is expressed in JSON Schema).
