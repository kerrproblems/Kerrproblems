# Problem Schema Reference

Every file in /problems/ is a YAML file named {ID}.yaml (e.g. K-001.yaml).

## Required fields

id:           string   # e.g. K-001. Must match filename.
title:        string   # short descriptive title
cluster:      string   # one of: exterior-stability | interior-scc | 
                       #   extremal | rigidity-uniqueness | spectral-scattering
status:       string   # one of: open | partial | conditional | solved
statement:    string   # precise problem statement (multiline ok)
math_required: string  # mathematical prerequisites
why_it_matters: string
completion_criteria: string
implications: string
difficulty:   integer  # 1 (accessible) to 5 (frontier)

## Optional fields

posed_by:     string
posed_year:   integer
references:   list
  - arxiv: string      # arXiv ID e.g. 2104.11857
    note:   string
related:      list     # list of IDs e.g. [K-002, K-003]
prizes:       string   # null if none
notes:        string   # maintainer notes
last_updated: date     # YYYY-MM-DD
