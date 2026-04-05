#!/usr/bin/env python3
"""
Convert Erdos_Open_Problems.md into individual YAML problem files.
Run from repo root: python scripts/convert_problems.py
"""

import re
import yaml
import os
from pathlib import Path
from datetime import date

SOURCE = Path("Erdos_Open_Problems.md")
OUT_DIR = Path("problems")
OUT_DIR.mkdir(exist_ok=True)

CLUSTER_MAP = {
    "Exterior stability": "exterior-stability",
    "Interior / SCC": "interior-scc",
    "Extremal / near-extremal": "extremal",
    "Rigidity / uniqueness": "rigidity-uniqueness",
    "Spectral / scattering": "spectral-scattering",
}

STATUS_MAP = {
    "Open": "open",
    "Partial": "partial",
    "Conditional": "conditional",
    "Solved": "solved",
}

DIFFICULTY_MAP = {
    # Assign difficulty heuristically by cluster and status
    # Agent should not change these — they are manually curated defaults
    "open": 4,
    "partial": 3,
    "conditional": 3,
    "solved": 2,
}

text = SOURCE.read_text()

# Split on problem headers: ## K-XXX —
sections = re.split(r'\n## (K-\d+) — ', text)
# sections[0] is preamble, then alternating id / content

problems = []
for i in range(1, len(sections), 2):
    pid = sections[i].strip()
    body = sections[i+1]

    def extract(label):
        pattern = rf'\*\*{re.escape(label)}\*\*\s*\n(.*?)(?=\n\*\*|\n---|\Z)'
        m = re.search(pattern, body, re.DOTALL)
        return m.group(1).strip() if m else ""

    # Extract cluster and status from header lines
    cluster_raw = ""
    status_raw = ""
    cm = re.search(r'\*\*Cluster:\*\*\s*(.+)', body)
    sm = re.search(r'\*\*Status:\*\*\s*(.+)', body)
    if cm:
        cluster_raw = cm.group(1).strip()
    if sm:
        status_raw = sm.group(1).strip()

    # Derive title from index table (fallback: first line of body)
    title_raw = body.strip().split('\n')[0].strip().lstrip('#').strip()
    # Remove cluster/status header lines from title if bleed-through
    if title_raw.startswith('**'):
        title_raw = pid  # fallback

    status_key = STATUS_MAP.get(status_raw, "open")

    problem = {
        "id": pid,
        "title": title_raw,
        "cluster": CLUSTER_MAP.get(cluster_raw, "exterior-stability"),
        "status": status_key,
        "statement": extract("Statement"),
        "math_required": extract("Math required"),
        "why_it_matters": extract("Why it matters"),
        "completion_criteria": extract("Completion criteria"),
        "implications": extract("Implications if solved"),
        "difficulty": DIFFICULTY_MAP.get(status_key, 3),
        "posed_by": None,
        "posed_year": None,
        "references": [],
        "related": [],
        "prizes": None,
        "notes": None,
        "last_updated": str(date.today()),
    }
    problems.append(problem)

for p in problems:
    out_path = OUT_DIR / f"{p['id']}.yaml"
    with open(out_path, 'w') as f:
        yaml.dump(p, f, allow_unicode=True, default_flow_style=False,
                  sort_keys=False, width=80)
    print(f"Written {out_path}")

print(f"\nDone. {len(problems)} problems written to {OUT_DIR}/")
