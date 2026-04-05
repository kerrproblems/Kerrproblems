# Contributing to kerrproblems.com

All problems are stored in `problems/` as YAML files, one per problem.
The site rebuilds automatically from these files on every push to `main`.

## How to propose a correction

1. Fork the repository
2. Edit the relevant `problems/K-XXX.yaml` file
3. Open a pull request with a short explanation

For status updates, cite the paper that justifies the change in the PR description.

## How to propose a new problem

1. Copy `problems/K-001.yaml` as a template
2. Assign the next available ID in the appropriate cluster range:
   - K-001 to K-099: Exterior stability
   - K-101 to K-199: Interior / SCC
   - K-201 to K-299: Extremal / near-extremal
   - K-301 to K-399: Rigidity / uniqueness
   - K-401 to K-499: Spectral / scattering
3. Fill in all required fields (see `data/schema.md`)
4. Open a pull request

## Field definitions

| Field | Required | Values |
|-------|----------|--------|
| id | yes | e.g. K-042 |
| title | yes | short string |
| cluster | yes | exterior-stability, interior-scc, extremal, rigidity-uniqueness, spectral-scattering |
| status | yes | open, partial, conditional, solved |
| statement | yes | precise mathematical statement |
| math_required | yes | prerequisites |
| why_it_matters | yes | motivation |
| completion_criteria | yes | what a full answer must establish |
| implications | yes | what follows if solved |
| difficulty | yes | integer 1–5 |
| references | no | list of {arxiv, note} |
| related | no | list of problem IDs |
| notes | no | maintainer notes |
| last_updated | yes | YYYY-MM-DD |

## What makes a good problem statement

- Precise enough that a specialist could say definitively whether it is solved
- Traceable to a primary source (paper, talk, or known conjecture)
- Scoped to Kerr or near-Kerr vacuum or near-vacuum settings

Problems that are too vague, too broad (covering all of GR), or not traceable 
to a source will be returned with a request for revision.
