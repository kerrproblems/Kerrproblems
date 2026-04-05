#!/usr/bin/env python3
"""
Wrap mathematical notation in $...$ for KaTeX in problem YAML fields.
Run from repo root: python3 scripts/latexify_problems.py
"""

import re
from pathlib import Path

import yaml

PROBLEMS_DIR = Path("problems")
FIELDS = (
    "title",
    "statement",
    "math_required",
    "why_it_matters",
    "completion_criteria",
    "implications",
)

# Longest / most specific first
ORDERED_REPLACEMENTS = [
    ("ε=1−|a|/M", r"$\varepsilon = 1 - |a|/M$"),
    ("ε=1-|a|/M", r"$\varepsilon = 1 - |a|/M$"),
    ("a^2+Q^2<M^2", r"$a^2+Q^2<M^2$"),
    ("|a|<M", r"$|a|<M$"),
    ("a→M−", r"$a \to M^-$"),
    ("a→M-", r"$a \to M^-$"),
    ("κ→0", r"$\kappa \to 0$"),
    ("Λ>0", r"$\Lambda > 0$"),
    ("κ=0", r"$\kappa = 0$"),
    ("κ-dependence", r"$\kappa$-dependence"),
    ("parameter κ.", r"parameter $\kappa$."),
    ("C²-", r"$C^2$-"),
    ("C² ", r"$C^2$ "),
    ("C².", r"$C^2$."),
    ("C^2-", r"$C^2$-"),
    ("C^0-", r"$C^0$-"),
    ("C^0 ", r"$C^0$ "),
    ("C^0.", r"$C^0$."),
    ("C^2 ", r"$C^2$ "),
    ("C^2.", r"$C^2$."),
    ("r^p", r"$r^p$"),
    ("depend on ε and", r"depend on $\varepsilon$ and"),
    ("falloff δ,", r"falloff $\delta$,"),
    ("explicit regularity N and", r"explicit regularity $N$ and"),
]


def latexify_segment(s: str) -> str:
    if not s:
        return s
    out = s
    for old, new in ORDERED_REPLACEMENTS:
        out = out.replace(old, new)

    # (M,a) parameters
    out = re.sub(r"(?<!\$)\(M,a\)(?!\$)", r"$(M,a)$", out)

    # Remaining bare κ (unicode) not already \kappa
    out = re.sub(r"(?<![$\\])κ(?![a-zA-Z])", lambda _m: r"$\kappa$", out)

    # Fix doubled wrappers if κ sat next to existing math
    out = out.replace(r"$\kappa$$\kappa$", r"$\kappa$")

    return out


def latexify(s: str) -> str:
    if not s:
        return s
    if "$" not in s:
        return latexify_segment(s)
    parts = re.split(r"(\$[^$]*\$)", s)
    out = []
    for p in parts:
        if len(p) >= 2 and p.startswith("$") and p.endswith("$"):
            out.append(p)
        else:
            out.append(latexify_segment(p))
    return "".join(out)


def main():
    for path in sorted(PROBLEMS_DIR.glob("K-*.yaml")):
        data = yaml.safe_load(path.read_text())
        changed = False
        for key in FIELDS:
            if key not in data or data[key] is None:
                continue
            old = data[key]
            if not isinstance(old, str):
                continue
            new = latexify(old)
            if new != old:
                data[key] = new
                changed = True
        if changed:
            path.write_text(
                yaml.dump(
                    data,
                    allow_unicode=True,
                    default_flow_style=False,
                    sort_keys=False,
                    width=1000,
                )
            )
            print(f"updated {path.name}")


if __name__ == "__main__":
    main()
