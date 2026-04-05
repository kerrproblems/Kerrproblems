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
