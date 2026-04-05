# kerrproblems.com — Complete Agent Build Plan

**Objective:** Take a purchased domain and zero code to a fully live, production-quality website tracking 46 open problems in Kerr black hole physics. Every action is listed in execution order. No steps are assumed.

**Agent assumptions:**
- Domain is already purchased (kerrproblems.com) and DNS is accessible
- `Erdos_Open_Problems.md` is present in the local repo root
- Node.js ≥18 and Python ≥3.11 are available
- Git is configured with a remote (GitHub)
- Cloudflare account exists (free tier is sufficient)

---

## PHASE 0 — Repository Bootstrap

### Action 0.1 — Initialise the repo
```bash
git init kerrproblems
cd kerrproblems
git remote add origin https://github.com/YOUR_USERNAME/kerrproblems.git
```

### Action 0.2 — Create the top-level directory structure
```
kerrproblems/
├── problems/              # one YAML file per problem
├── src/
│   ├── pages/             # Astro pages
│   ├── components/        # Astro/HTML components
│   ├── layouts/           # base layout
│   └── styles/            # global CSS
├── public/                # static assets, favicon
├── scripts/               # Python utility scripts
├── data/
│   └── clusters.yaml      # cluster metadata
├── Erdos_Open_Problems.md # source file (already here)
├── CONTRIBUTING.md
├── README.md
├── astro.config.mjs
├── package.json
└── .gitignore
```

Run:
```bash
mkdir -p problems src/pages src/components src/layouts src/styles public scripts data
```

---

## PHASE 1 — Schema and Data

### Action 1.1 — Write the problem schema definition

Create `data/schema.md`:

```markdown
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
```

### Action 1.2 — Write the cluster metadata file

Create `data/clusters.yaml`:

```yaml
clusters:
  exterior-stability:
    label: "Exterior Stability"
    slug: exterior-stability
    description: >
      Global exterior dynamics, decay, scattering, and radiation for 
      near-Kerr spacetimes. Includes the main Kerr stability conjecture 
      and its extensions to matter fields and near-extremal regimes.
    color: "#1a6b5a"

  interior-scc:
    label: "Interior / SCC"
    slug: interior-scc
    description: >
      Cauchy horizon structure, blue-shift instability, strong cosmic 
      censorship, and the singularity structure of the Kerr interior.
    color: "#6b1a2a"

  extremal:
    label: "Extremal / Near-Extremal"
    slug: extremal
    description: >
      Zero surface gravity, Aretakis instability, NHEK geometry, 
      and the transition from subextremal to extremal dynamics.
    color: "#1a3d6b"

  rigidity-uniqueness:
    label: "Rigidity / Uniqueness"
    slug: rigidity-uniqueness
    description: >
      Stationary black hole characterization, hidden symmetries, 
      Mars–Simon tensor, and near-Kerr recognition theorems.
    color: "#4a1a6b"

  spectral-scattering:
    label: "Spectral / Scattering"
    slug: spectral-scattering
    description: >
      Quasinormal modes, resolvents, inverse problems, scattering maps, 
      pseudospectrum, and excitation factors.
    color: "#6b4a1a"
```

### Action 1.3 — Write the Python conversion script

Create `scripts/convert_problems.py`. This script reads `Erdos_Open_Problems.md` and writes one YAML file per problem into `problems/`.

```python
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
```

### Action 1.4 — Run the conversion script
```bash
pip install pyyaml --break-system-packages
python scripts/convert_problems.py
```

Verify: `ls problems/ | wc -l` should return 46.

### Action 1.5 — Manually patch titles

The script extracts titles from body text which may be imperfect. Run this audit:
```bash
python -c "
import yaml, os
for f in sorted(os.listdir('problems')):
    d = yaml.safe_load(open(f'problems/{f}'))
    print(d['id'], '|', d['title'][:60])
"
```

Then open each YAML where the title looks wrong and correct it to match the index table in the source markdown. The correct titles are:

```
K-001: Full nonlinear stability of subextremal Kerr
K-002: Uniform nonlinear stability as a→M−
K-003: Nonlinear asymptotic completeness near Kerr
K-004: Peeling and polyhomogeneous null infinity for near-Kerr
K-005: Sharp nonlinear Price law for curvature
K-006: Kerr stability with BMS charges and nonlinear memory
K-007: Einstein–Maxwell stability near Kerr
K-008: Full stability of asymptotically flat Kerr–Newman
K-009: Einstein–massive Klein–Gordon near Kerr endstates
K-010: Nonlinear superradiant endstates in Kerr–AdS
K-011: Spin fields on dynamical near-Kerr backgrounds
K-012: Low-regularity Kerr stability threshold
K-013: Formation plus relaxation to Kerr
K-014: Nonlinear decay versus resonance expansions
K-101: Strong Cosmic Censorship threshold for Kerr interiors
K-102: Derive the interior theorem directly from exterior data
K-103: Vacuum curvature blow-up rates on the Kerr Cauchy horizon
K-104: Generic C²- or Lipschitz-inextendibility of near-Kerr MGHDs
K-105: Critical horizon-decay exponent controlling extendibility
K-106: Genericity of lower bounds for linearized-gravity interior instability
K-107: Scattering map to the Cauchy horizon for linearized gravity
K-108: Strong Cosmic Censorship in rotating Λ>0 backgrounds
K-109: Near-extremal interior scaling laws
K-110: Bifurcation-sphere stability and full interior series completion
K-111: Global interior boundary type: null versus spacelike pieces
K-112: Teukolsky interior asymptotics beyond the current state of the art
K-201: Nonlinear codimension-1 stability of extremal Kerr with horizon hair
K-202: Full linear theory for extremal Kerr (spin 2)
K-203: Nonlinear fate of Aretakis instability
K-204: Uniform estimates in the surface-gravity limit κ→0
K-205: Rigorous near-horizon scattering theory for NHEK
K-206: Extremal interior SCC and Cauchy-horizon regularity
K-207: Extremal tail asymptotics versus conserved charges
K-208: Near-extremal QNM accumulation and branch-cut structure
K-209: Codimension and modulation theory for extremal endstates
K-301: Global Kerr uniqueness without analyticity
K-302: Rigidity for extremal horizons
K-303: Quantitative Kerr characterization via the Mars–Simon tensor
K-304: Near-Kerr implies Kerr with computable constants
K-305: Kerr characterization from horizon intrinsic data
K-306: Hidden symmetries under perturbation
K-307: Photon-region and trapping stability in dynamical near-Kerr spacetimes
K-308: Rigidity and uniqueness with matter: full Kerr–Newman regime
K-401: QNM completeness for Kerr ringdown expansions
K-402: Nonlinear QNMs from full Einstein evolution
K-403: Scattering theory for linearized gravity on Kerr
K-404: Zero-frequency structure and tail universality
K-405: Inverse scattering for Kerr parameters
K-406: Spectral stability and pseudospectrum of Kerr QNMs
K-407: QNM excitation factors and universality theorems
```

---

## PHASE 2 — Static Site Setup (Astro)

### Action 2.1 — Initialise Astro project
```bash
npm create astro@latest . -- --template minimal --no-install --no-git
npm install
npm install js-yaml gray-matter
```

### Action 2.2 — Write astro.config.mjs
```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kerrproblems.com',
  output: 'static',
  build: {
    assets: 'assets'
  }
});
```

### Action 2.3 — Write package.json scripts section
Ensure these scripts exist:
```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview"
}
```

---

## PHASE 3 — Design System

### Action 3.1 — Write global CSS

Create `src/styles/global.css`:

```css
/* ============================================
   kerrproblems.com — Design System
   Aesthetic: scientific precision meets deep space.
   Dark background, high-contrast type, 
   no decorative noise — only structural clarity.
   ============================================ */

@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@300;400&family=Cormorant+Garamond:wght@300;400;600&display=swap');

:root {
  /* Palette */
  --bg:          #0a0a0f;
  --bg-surface:  #10101a;
  --bg-raised:   #16161f;
  --border:      #2a2a3a;
  --border-light: #3a3a50;
  --text:        #e8e4dc;
  --text-muted:  #8a8699;
  --text-faint:  #4a4860;
  --accent:      #c8b97a;        /* warm gold — Kerr ring */
  --accent-dim:  #7a6e40;
  --open:        #e05a5a;
  --partial:     #c8903a;
  --conditional: #7a9ae0;
  --solved:      #5ab87a;

  /* Cluster colours */
  --exterior:    #3a9a7a;
  --interior:    #9a3a4a;
  --extremal:    #3a5a9a;
  --rigidity:    #7a3a9a;
  --spectral:    #9a7a3a;

  /* Typography */
  --font-serif:  'EB Garamond', 'Cormorant Garamond', Georgia, serif;
  --font-mono:   'JetBrains Mono', 'Fira Code', monospace;

  /* Layout */
  --max-width:   860px;
  --sidebar:     260px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-serif);
  font-size: 18px;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

body {
  min-height: 100vh;
}

a {
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid var(--accent-dim);
  transition: border-color 0.15s, color 0.15s;
}
a:hover {
  color: #fff;
  border-color: var(--accent);
}

h1, h2, h3, h4 {
  font-family: var(--font-serif);
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 1.3;
}

h1 { font-size: 2.4rem; }
h2 { font-size: 1.6rem; color: var(--accent); margin-bottom: 0.5rem; }
h3 { font-size: 1.2rem; }

code, pre {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 3px;
}
code { padding: 0.1em 0.4em; }
pre  { padding: 1rem; overflow-x: auto; }

hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2.5rem 0;
}

/* Status badges */
.badge {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.2em 0.6em;
  border-radius: 2px;
  border: 1px solid;
  font-weight: 400;
}
.badge-open        { color: var(--open);        border-color: var(--open);        background: rgba(224,90,90,0.08); }
.badge-partial     { color: var(--partial);     border-color: var(--partial);     background: rgba(200,144,58,0.08); }
.badge-conditional { color: var(--conditional); border-color: var(--conditional); background: rgba(122,154,224,0.08); }
.badge-solved      { color: var(--solved);      border-color: var(--solved);      background: rgba(90,184,122,0.08); }

/* Cluster badges */
.cluster-tag {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.15em 0.5em;
  border-radius: 2px;
}
.cluster-exterior-stability   { background: rgba(58,154,122,0.15); color: var(--exterior); }
.cluster-interior-scc         { background: rgba(154,58,74,0.15);  color: var(--interior); }
.cluster-extremal             { background: rgba(58,90,154,0.15);  color: var(--extremal); }
.cluster-rigidity-uniqueness  { background: rgba(122,58,154,0.15); color: var(--rigidity); }
.cluster-spectral-scattering  { background: rgba(154,122,58,0.15); color: var(--spectral); }

/* Problem card */
.problem-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 1.2rem 1.4rem;
  transition: border-color 0.15s, background 0.15s;
  display: block;
  color: inherit;
  text-decoration: none;
  border-bottom: none;
}
.problem-card:hover {
  border-color: var(--border-light);
  background: var(--bg-raised);
  color: inherit;
}
.problem-card .card-id {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-faint);
  letter-spacing: 0.08em;
  margin-bottom: 0.3rem;
}
.problem-card .card-title {
  font-size: 1.05rem;
  color: var(--text);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}
.problem-card .card-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

/* Layout containers */
.site-header {
  border-bottom: 1px solid var(--border);
  padding: 1.2rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 100;
}
.site-header .wordmark {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  color: var(--accent);
  border-bottom: none;
}
.site-header nav a {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  margin-left: 1.8rem;
  color: var(--text-muted);
  border-bottom: none;
  letter-spacing: 0.04em;
}
.site-header nav a:hover { color: var(--text); }

.page-main {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 3rem 2rem 6rem;
}

.site-footer {
  border-top: 1px solid var(--border);
  padding: 1.5rem 2rem;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-faint);
  letter-spacing: 0.04em;
}

/* Problem detail sections */
.problem-section {
  margin: 2rem 0;
}
.problem-section h3 {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin-bottom: 0.6rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.4rem;
}
.problem-section p {
  color: var(--text);
  max-width: 66ch;
}

/* Filter bar */
.filter-bar {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
}
.filter-btn {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 0.3em 0.8em;
  border-radius: 2px;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: all 0.12s;
}
.filter-btn:hover, .filter-btn.active {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--bg-raised);
}

/* Stats bar */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 4px;
  margin-bottom: 3rem;
  overflow: hidden;
}
.stat-cell {
  background: var(--bg-surface);
  padding: 1rem 1.2rem;
  text-align: center;
}
.stat-cell .stat-number {
  font-family: var(--font-mono);
  font-size: 1.8rem;
  font-weight: 300;
  display: block;
  line-height: 1;
  margin-bottom: 0.3rem;
}
.stat-cell .stat-label {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-faint);
}

/* Problem grid */
.problem-grid {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

/* Difficulty pips */
.difficulty-pips {
  display: inline-flex;
  gap: 3px;
  align-items: center;
}
.pip {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--border-light);
}
.pip.filled { background: var(--accent-dim); }

/* Hero */
.hero {
  padding: 4rem 0 3rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 3rem;
}
.hero .tagline {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-faint);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}
.hero h1 {
  color: var(--text);
  max-width: 20ch;
  line-height: 1.25;
  margin-bottom: 1.5rem;
}
.hero p {
  font-size: 1rem;
  color: var(--text-muted);
  max-width: 58ch;
  margin-bottom: 2rem;
}

/* Responsive */
@media (max-width: 600px) {
  .stats-bar { grid-template-columns: repeat(2, 1fr); }
  h1 { font-size: 1.8rem; }
  .site-header { padding: 1rem; }
  .page-main  { padding: 2rem 1rem 4rem; }
}
```

---

## PHASE 4 — Astro Components and Pages

### Action 4.1 — Base layout

Create `src/layouts/Base.astro`:

```astro
---
const { title, description } = Astro.props;
const siteTitle = "Kerr Problems";
const fullTitle = title ? `${title} — ${siteTitle}` : siteTitle;
const desc = description || "A living database of open problems in Kerr black hole physics.";
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{fullTitle}</title>
  <meta name="description" content={desc} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={desc} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://kerrproblems.com" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="stylesheet" href="/styles/global.css" />
  <link rel="alternate" type="application/rss+xml" title="Kerr Problems — Recent Updates" href="/rss.xml" />
</head>
<body>
  <header class="site-header">
    <a href="/" class="wordmark">kerrproblems.com</a>
    <nav>
      <a href="/problems">Problems</a>
      <a href="/clusters">Clusters</a>
      <a href="/about">About</a>
      <a href="https://github.com/YOUR_USERNAME/kerrproblems" target="_blank" rel="noopener">GitHub ↗</a>
    </nav>
  </header>

  <main class="page-main">
    <slot />
  </main>

  <footer class="site-footer">
    kerrproblems.com — a community database of open problems in Kerr black hole physics.
    <br/>
    All problem statements traced to primary sources. Contributions welcome via GitHub pull request.
  </footer>
</body>
</html>
```

### Action 4.2 — Problem loader utility

Create `src/lib/problems.js`:

```js
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const PROBLEMS_DIR = path.join(process.cwd(), 'problems');

export function getAllProblems() {
  return fs
    .readdirSync(PROBLEMS_DIR)
    .filter(f => f.endsWith('.yaml'))
    .map(f => {
      const raw = fs.readFileSync(path.join(PROBLEMS_DIR, f), 'utf8');
      return yaml.load(raw);
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function getProblemById(id) {
  const all = getAllProblems();
  return all.find(p => p.id === id) || null;
}

export function getStats(problems) {
  return {
    total: problems.length,
    open: problems.filter(p => p.status === 'open').length,
    partial: problems.filter(p => p.status === 'partial').length,
    conditional: problems.filter(p => p.status === 'conditional').length,
    solved: problems.filter(p => p.status === 'solved').length,
  };
}

export const CLUSTER_LABELS = {
  'exterior-stability':  'Exterior Stability',
  'interior-scc':        'Interior / SCC',
  'extremal':            'Extremal / Near-Extremal',
  'rigidity-uniqueness': 'Rigidity / Uniqueness',
  'spectral-scattering': 'Spectral / Scattering',
};
```

### Action 4.3 — Index page

Create `src/pages/index.astro`:

```astro
---
import Base from '../layouts/Base.astro';
import { getAllProblems, getStats, CLUSTER_LABELS } from '../lib/problems.js';

const problems = getAllProblems();
const stats = getStats(problems);

const flagship = ['K-001', 'K-101', 'K-201'];
const flagshipProblems = flagship.map(id => problems.find(p => p.id === id));
---
<Base>
  <div class="hero">
    <div class="tagline">Open Problems in Mathematical General Relativity</div>
    <h1>The Kerr Problem Archive</h1>
    <p>
      A living, community-maintained database of open problems concerning 
      the Kerr spacetime — the rotating black hole solution to Einstein's vacuum equations. 
      Every problem is traceable to a primary source. Status updates as the field moves.
    </p>
    <a href="/problems" style="font-family: var(--font-mono); font-size: 0.82rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent); border-bottom: 1px solid var(--accent-dim);">
      Browse all {stats.total} problems →
    </a>
  </div>

  <!-- Stats -->
  <div class="stats-bar">
    <div class="stat-cell">
      <span class="stat-number" style="color: var(--text)">{stats.total}</span>
      <span class="stat-label">Total</span>
    </div>
    <div class="stat-cell">
      <span class="stat-number" style="color: var(--open)">{stats.open}</span>
      <span class="stat-label">Open</span>
    </div>
    <div class="stat-cell">
      <span class="stat-number" style="color: var(--partial)">{stats.partial}</span>
      <span class="stat-label">Partial</span>
    </div>
    <div class="stat-cell">
      <span class="stat-number" style="color: var(--solved)">{stats.solved + stats.conditional}</span>
      <span class="stat-label">Conditional / Solved</span>
    </div>
  </div>

  <!-- Flagship problems -->
  <h2>Flagship Problems</h2>
  <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">
    The three deepest open questions in the archive.
  </p>
  <div class="problem-grid" style="margin-bottom: 3rem">
    {flagshipProblems.map(p => (
      <a href={`/problems/${p.id}`} class="problem-card">
        <div class="card-id">{p.id}</div>
        <div class="card-title">{p.title}</div>
        <div class="card-meta">
          <span class={`badge badge-${p.status}`}>{p.status}</span>
          <span class={`cluster-tag cluster-${p.cluster}`}>{CLUSTER_LABELS[p.cluster]}</span>
        </div>
      </a>
    ))}
  </div>

  <!-- Clusters -->
  <h2>By Cluster</h2>
  <div style="display: grid; gap: 0.5rem; margin-top: 1rem;">
    {Object.entries(CLUSTER_LABELS).map(([slug, label]) => {
      const count = problems.filter(p => p.cluster === slug).length;
      const openCount = problems.filter(p => p.cluster === slug && p.status === 'open').length;
      return (
        <a href={`/clusters/${slug}`} class="problem-card" style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div class="card-id" style="margin-bottom: 0.2rem">{label}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--font-mono);">
              {openCount} open of {count}
            </div>
          </div>
          <span style="font-family: var(--font-mono); color: var(--text-faint); font-size: 0.72rem;">→</span>
        </a>
      );
    })}
  </div>
</Base>
```

### Action 4.4 — Problems index page

Create `src/pages/problems/index.astro`:

```astro
---
import Base from '../../layouts/Base.astro';
import { getAllProblems, getStats, CLUSTER_LABELS } from '../../lib/problems.js';

const problems = getAllProblems();
const stats = getStats(problems);
---
<Base title="All Problems">
  <h1 style="margin-bottom: 0.3rem">All Problems</h1>
  <p style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.78rem; margin-bottom: 2rem;">
    {stats.total} problems · {stats.open} open · {stats.partial} partial · status: April 2026
  </p>

  <!-- Client-side filter bar -->
  <div class="filter-bar">
    <button class="filter-btn active" data-filter="all">All</button>
    <button class="filter-btn" data-filter="open">Open</button>
    <button class="filter-btn" data-filter="partial">Partial</button>
    <button class="filter-btn" data-filter="conditional">Conditional</button>
    {Object.entries(CLUSTER_LABELS).map(([slug, label]) => (
      <button class="filter-btn" data-filter={slug}>{label}</button>
    ))}
  </div>

  <div class="problem-grid" id="problem-grid">
    {problems.map(p => (
      <a 
        href={`/problems/${p.id}`} 
        class="problem-card"
        data-status={p.status}
        data-cluster={p.cluster}
      >
        <div class="card-id">{p.id}</div>
        <div class="card-title">{p.title}</div>
        <div class="card-meta">
          <span class={`badge badge-${p.status}`}>{p.status}</span>
          <span class={`cluster-tag cluster-${p.cluster}`}>{CLUSTER_LABELS[p.cluster]}</span>
        </div>
      </a>
    ))}
  </div>
</Base>

<script>
const btns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.problem-card[data-status]');

btns.forEach(btn => {
  btn.addEventListener('click', () => {
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach(card => {
      const show = f === 'all' 
        || card.dataset.status === f 
        || card.dataset.cluster === f;
      card.style.display = show ? 'block' : 'none';
    });
  });
});
</script>
```

### Action 4.5 — Individual problem page

Create `src/pages/problems/[id].astro`:

```astro
---
import Base from '../../layouts/Base.astro';
import { getAllProblems, CLUSTER_LABELS } from '../../lib/problems.js';

export async function getStaticPaths() {
  const problems = getAllProblems();
  return problems.map(p => ({
    params: { id: p.id },
    props: { problem: p, all: problems },
  }));
}

const { problem: p, all } = Astro.props;
const related = (p.related || []).map(id => all.find(x => x.id === id)).filter(Boolean);

function pips(n) {
  return Array.from({length: 5}, (_, i) => `<span class="pip${i < n ? ' filled' : ''}"></span>`).join('');
}
---
<Base title={`${p.id} — ${p.title}`} description={p.statement}>
  <!-- Breadcrumb -->
  <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-faint); margin-bottom: 2rem; letter-spacing: 0.04em;">
    <a href="/problems" style="color: var(--text-faint); border-bottom: none;">Problems</a>
    <span style="margin: 0 0.5rem">→</span>
    <a href={`/clusters/${p.cluster}`} style="color: var(--text-faint); border-bottom: none;">{CLUSTER_LABELS[p.cluster]}</a>
    <span style="margin: 0 0.5rem">→</span>
    {p.id}
  </div>

  <!-- Header -->
  <div style="margin-bottom: 2.5rem">
    <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-faint); letter-spacing: 0.1em; margin-bottom: 0.6rem">{p.id}</div>
    <h1 style="font-size: 2rem; margin-bottom: 1rem; line-height: 1.2">{p.title}</h1>
    <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: center">
      <span class={`badge badge-${p.status}`}>{p.status}</span>
      <span class={`cluster-tag cluster-${p.cluster}`}>{CLUSTER_LABELS[p.cluster]}</span>
      <span class="difficulty-pips" set:html={pips(p.difficulty)} style="margin-left: 0.4rem" title={`Difficulty: ${p.difficulty}/5`}></span>
    </div>
  </div>

  <hr />

  <!-- Statement -->
  <div class="problem-section">
    <h3>Statement</h3>
    <p>{p.statement}</p>
  </div>

  <!-- Math required -->
  <div class="problem-section">
    <h3>Mathematical prerequisites</h3>
    <p>{p.math_required}</p>
  </div>

  <!-- Why it matters -->
  <div class="problem-section">
    <h3>Why it matters</h3>
    <p>{p.why_it_matters}</p>
  </div>

  <!-- Completion criteria -->
  <div class="problem-section">
    <h3>Completion criteria</h3>
    <p>{p.completion_criteria}</p>
  </div>

  <!-- Implications -->
  <div class="problem-section">
    <h3>Implications if solved</h3>
    <p>{p.implications}</p>
  </div>

  <!-- References -->
  {p.references && p.references.length > 0 && (
    <div class="problem-section">
      <h3>Key references</h3>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
        {p.references.map(ref => (
          <li style="font-family: var(--font-mono); font-size: 0.78rem;">
            {ref.arxiv
              ? <a href={`https://arxiv.org/abs/${ref.arxiv}`} target="_blank" rel="noopener">arXiv:{ref.arxiv}</a>
              : null}
            {ref.note ? <span style="color: var(--text-muted); margin-left: 0.6rem">— {ref.note}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  )}

  <!-- Related problems -->
  {related.length > 0 && (
    <div class="problem-section">
      <h3>Related problems</h3>
      <div class="problem-grid" style="margin-top: 0.6rem">
        {related.map(r => (
          <a href={`/problems/${r.id}`} class="problem-card">
            <div class="card-id">{r.id}</div>
            <div class="card-title">{r.title}</div>
            <div class="card-meta">
              <span class={`badge badge-${r.status}`}>{r.status}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )}

  <!-- Notes -->
  {p.notes && (
    <div class="problem-section">
      <h3>Maintainer notes</h3>
      <p style="color: var(--text-muted); font-style: italic">{p.notes}</p>
    </div>
  )}

  <hr />
  <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-faint);">
    Last updated: {p.last_updated || 'April 2026'} · 
    <a href={`https://github.com/YOUR_USERNAME/kerrproblems/blob/main/problems/${p.id}.yaml`} 
       target="_blank" rel="noopener" style="color: var(--text-faint)">
      Edit on GitHub →
    </a>
  </div>
</Base>
```

### Action 4.6 — Cluster pages

Create `src/pages/clusters/[slug].astro`:

```astro
---
import Base from '../../layouts/Base.astro';
import { getAllProblems, getStats, CLUSTER_LABELS } from '../../lib/problems.js';
import clustersData from '../../../data/clusters.yaml';

export async function getStaticPaths() {
  return Object.keys(CLUSTER_LABELS).map(slug => ({
    params: { slug },
  }));
}

const { slug } = Astro.params;
const allProblems = getAllProblems();
const problems = allProblems.filter(p => p.cluster === slug);
const stats = getStats(problems);
const label = CLUSTER_LABELS[slug];
---
<Base title={label}>
  <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-faint); margin-bottom: 1.5rem">
    <a href="/problems" style="color: var(--text-faint); border-bottom: none">Problems</a>
    <span style="margin: 0 0.5rem">→</span>
    {label}
  </div>

  <h1 style="margin-bottom: 1rem">{label}</h1>

  <div style="display: flex; gap: 1.5rem; font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted); margin-bottom: 2.5rem">
    <span>{stats.total} problems</span>
    <span style="color: var(--open)">{stats.open} open</span>
    <span style="color: var(--partial)">{stats.partial} partial</span>
  </div>

  <div class="problem-grid">
    {problems.map(p => (
      <a href={`/problems/${p.id}`} class="problem-card">
        <div class="card-id">{p.id}</div>
        <div class="card-title">{p.title}</div>
        <div class="card-meta">
          <span class={`badge badge-${p.status}`}>{p.status}</span>
        </div>
      </a>
    ))}
  </div>
</Base>
```

Create `src/pages/clusters/index.astro`:

```astro
---
import Base from '../../layouts/Base.astro';
import { getAllProblems, CLUSTER_LABELS } from '../../lib/problems.js';

const problems = getAllProblems();
---
<Base title="Clusters">
  <h1 style="margin-bottom: 2rem">Problem Clusters</h1>
  <div style="display: grid; gap: 1rem">
    {Object.entries(CLUSTER_LABELS).map(([slug, label]) => {
      const clusterProblems = problems.filter(p => p.cluster === slug);
      const openCount = clusterProblems.filter(p => p.status === 'open').length;
      return (
        <a href={`/clusters/${slug}`} class="problem-card">
          <div class="card-title">{label}</div>
          <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted); margin-top: 0.4rem">
            {clusterProblems.length} problems · {openCount} open
          </div>
        </a>
      );
    })}
  </div>
</Base>
```

### Action 4.7 — About page

Create `src/pages/about.astro`:

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="About">
  <h1 style="margin-bottom: 2rem">About</h1>

  <div style="max-width: 62ch; display: flex; flex-direction: column; gap: 1.4rem; font-size: 1rem; color: var(--text)">

    <p>
      This site tracks open problems in the mathematics and physics of the Kerr 
      spacetime — the exact rotating black hole solution to Einstein's vacuum field equations, 
      discovered by Roy Kerr in 1963.
    </p>

    <p>
      The database was started in April 2026. Every problem statement is traced to a 
      primary source: a paper, a survey, or a recorded lecture by a researcher working 
      in the field. This site curates and organises — it does not adjudicate.
    </p>

    <p>
      The status labels mean:
    </p>

    <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem; padding-left: 0">
      <li><span class="badge badge-open">open</span> <span style="margin-left: 0.6rem; color: var(--text-muted)">No theorem in the stated form is currently known.</span></li>
      <li><span class="badge badge-partial">partial</span> <span style="margin-left: 0.6rem; color: var(--text-muted)">Important special cases, reductions, or adjacent results exist.</span></li>
      <li><span class="badge badge-conditional">conditional</span> <span style="margin-left: 0.6rem; color: var(--text-muted)">The problem is reduced to a specific missing input.</span></li>
      <li><span class="badge badge-solved">solved</span> <span style="margin-left: 0.6rem; color: var(--text-muted)">A complete theorem in the stated form is known.</span></li>
    </ul>

    <p>
      Difficulty ratings (1–5) are heuristic estimates based on the current state of the 
      field, not permanent verdicts. A problem rated 5 today may become 3 tomorrow.
    </p>

    <h2 style="margin-top: 1rem">Contributing</h2>

    <p>
      All problems are stored as YAML files in the 
      <a href="https://github.com/YOUR_USERNAME/kerrproblems">GitHub repository</a>.
      To propose a correction, a new problem, or a status update, open a pull request.
      See <a href="https://github.com/YOUR_USERNAME/kerrproblems/blob/main/CONTRIBUTING.md">CONTRIBUTING.md</a> 
      for the full guide.
    </p>

    <p>
      If you have worked on one of these problems and believe the statement or status 
      is wrong, please open an issue or email the maintainer. Accuracy is the 
      site's only claim to authority.
    </p>

  </div>
</Base>
```

### Action 4.8 — RSS feed

Create `src/pages/rss.xml.js`:

```js
import { getAllProblems } from '../lib/problems.js';

export async function GET() {
  const problems = getAllProblems();
  const recent = problems
    .sort((a, b) => (b.last_updated || '').localeCompare(a.last_updated || ''))
    .slice(0, 20);

  const items = recent.map(p => `
    <item>
      <title>${p.id} — ${p.title}</title>
      <link>https://kerrproblems.com/problems/${p.id}</link>
      <description>${p.statement?.slice(0, 200) || ''}...</description>
      <pubDate>${new Date(p.last_updated || '2026-04-01').toUTCString()}</pubDate>
      <guid>https://kerrproblems.com/problems/${p.id}</guid>
    </item>
  `).join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Kerr Problems — Recent Updates</title>
    <link>https://kerrproblems.com</link>
    <description>Open problems in Kerr black hole physics</description>
    ${items}
  </channel>
</rss>`, {
    headers: { 'Content-Type': 'application/xml' }
  });
}
```

### Action 4.9 — 404 page

Create `src/pages/404.astro`:

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Not found">
  <div style="text-align: center; padding: 6rem 0">
    <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-faint); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 1rem">404</div>
    <h1 style="font-size: 1.8rem; margin-bottom: 1rem">Problem not found</h1>
    <p style="color: var(--text-muted); margin-bottom: 2rem">This page does not exist, but many problems do.</p>
    <a href="/problems">← Back to all problems</a>
  </div>
</Base>
```

### Action 4.10 — Favicon

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="14" fill="none" stroke="#c8b97a" stroke-width="1.5"/>
  <ellipse cx="16" cy="16" rx="14" ry="5" fill="none" stroke="#c8b97a" stroke-width="1" 
    transform="rotate(-20 16 16)" opacity="0.6"/>
  <circle cx="16" cy="16" r="2.5" fill="#c8b97a"/>
</svg>
```

---

## PHASE 5 — Supporting Files

### Action 5.1 — CONTRIBUTING.md

Create `CONTRIBUTING.md`:

```markdown
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
```

### Action 5.2 — README.md

Create `README.md`:

```markdown
# kerrproblems.com

A living database of open problems in the mathematics and physics of the Kerr spacetime.

**→ [kerrproblems.com](https://kerrproblems.com)**

## Structure

```
problems/        one YAML file per problem
data/            cluster metadata and schema
src/             Astro site source
public/          static assets
scripts/         utility scripts
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Tech

- Static site generated by [Astro](https://astro.build)
- Problems stored as YAML, schema in `data/schema.md`
- Deployed to Cloudflare Pages
- Zero backend, zero database

## License

Problem statements are derived from published mathematical literature and are 
factual descriptions of open problems. The site code is MIT licensed.
```

### Action 5.3 — .gitignore

```
node_modules/
dist/
.astro/
.env
.DS_Store
```

---

## PHASE 6 — Build Verification

### Action 6.1 — Install dependencies and verify YAML loading
```bash
npm install
node -e "const {getAllProblems} = await import('./src/lib/problems.js'); console.log(getAllProblems().length + ' problems loaded')"
```
Expected output: `46 problems loaded`

### Action 6.2 — Run dev server and verify all routes
```bash
npm run dev
```
Manually verify (or use curl/fetch in a script) that these routes return 200:
- `/`
- `/problems`
- `/problems/K-001`
- `/problems/K-101`
- `/problems/K-407`
- `/clusters`
- `/clusters/exterior-stability`
- `/about`
- `/rss.xml`

### Action 6.3 — Production build
```bash
npm run build
```
Must complete with zero errors. Check `dist/` exists and contains HTML files.

### Action 6.4 — Verify problem count in build output
```bash
ls dist/problems/ | wc -l
```
Expected: 46 directories (one per problem).

---

## PHASE 7 — Deployment (Cloudflare Pages)

### Action 7.1 — Push to GitHub
```bash
git add -A
git commit -m "Initial build: 46 Kerr problems, Astro site"
git push origin main
```

### Action 7.2 — Connect to Cloudflare Pages

In the Cloudflare dashboard:
1. Go to **Workers & Pages → Create → Pages → Connect to Git**
2. Select the `kerrproblems` repository
3. Set build configuration:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Click **Save and Deploy**

Wait for first deploy to complete (usually 2–4 minutes).

### Action 7.3 — Configure custom domain in Cloudflare Pages

In Cloudflare Pages project settings:
1. Go to **Custom domains → Set up a custom domain**
2. Enter `kerrproblems.com`
3. Cloudflare will prompt to add a CNAME record — if the domain is registered through Cloudflare this happens automatically; if not, add the CNAME manually in your DNS registrar

### Action 7.4 — Verify DNS propagation
```bash
dig kerrproblems.com +short
curl -I https://kerrproblems.com
```
Expected: 200 response with correct HTML.

### Action 7.5 — Enable HTTPS (automatic in Cloudflare Pages)
Cloudflare issues and renews TLS automatically. Verify in browser that the padlock appears and the certificate is valid.

---

## PHASE 8 — Final QA Checklist

The agent should verify every item before marking the project complete.

**Content**
- [ ] All 46 problems are live and accessible at `/problems/K-XXX`
- [ ] Every problem page renders: statement, math required, why it matters, completion criteria, implications
- [ ] Status badges render in correct colours (open=red, partial=amber, conditional=blue)
- [ ] Cluster tags render correctly on all cards
- [ ] Flagship problems (K-001, K-101, K-201) appear on homepage
- [ ] Stats bar on homepage shows correct counts (total=46)
- [ ] Cluster pages each list the correct subset of problems

**Navigation**
- [ ] Header links (Problems, Clusters, About, GitHub) all work
- [ ] Breadcrumb on problem pages is correct
- [ ] Filter buttons on /problems filter correctly by status and cluster
- [ ] Related problems links resolve (where related fields are populated)

**Technical**
- [ ] `/rss.xml` is valid XML
- [ ] `/404` page renders for unknown routes
- [ ] Favicon appears in browser tab
- [ ] Page titles follow pattern: `K-001 — Full nonlinear stability... — Kerr Problems`
- [ ] No console errors in browser dev tools
- [ ] HTTPS is active, no mixed-content warnings
- [ ] `og:title` and `og:description` meta tags present on all pages
- [ ] GitHub link in header and footer points to correct repo URL

**Performance**
- [ ] Lighthouse score >90 on homepage (run via Chrome DevTools)
- [ ] All pages load in <1 second on a standard connection
- [ ] No external JavaScript dependencies loaded at runtime (everything is static)

---

## PHASE 9 — Post-Launch

These actions are for the human maintainer, not the agent.

**Week 1**
- Set up a GitHub Discussions board on the repo with one thread per cluster
- Set up an arXiv email alert for: `Kerr stability`, `Kerr interior`, `Teukolsky`, `quasinormal modes Kerr`
- Write a brief post explaining the project (personal site, or submitted to community forums like MathOverflow meta or relevant mailing lists)

**Month 1**
- Email one researcher whose work is cited — not asking for endorsement, asking if a problem statement is accurate
- Add `references` and `related` fields to at least 10 problems based on a literature review
- Update `last_updated` fields in any YAML that gets revised

**Ongoing**
- When a new arXiv paper touches a tracked problem, update the relevant YAML and commit with a descriptive message
- The commit history becomes the changelog — keep messages clear: `K-101: add Dafermos-Luk 2024 reference` not `update`

---

## Appendix — Replace Before Launch

Search the entire codebase for `YOUR_USERNAME` and replace with the actual GitHub username before the first push. It appears in:
- `src/layouts/Base.astro` (GitHub link)
- `src/pages/about.astro` (two links)
- `src/pages/problems/[id].astro` (edit on GitHub link)
- `README.md`
