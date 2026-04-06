/**
 * Refresh fv_reason / fv_suitability defaults for problems missing explicit FV metadata.
 * Prefer editing YAML directly; this is a safety net.
 * Run: npm run migrate:formal-verification
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROBLEMS = path.join(__dirname, '..', 'problems');

function defaultFvReason(s) {
  if (s === 'high') return 'Stationary, algebraic, ODE/separable, or finite-dimensional substatements admit clearer formalization boundaries.';
  if (s === 'low') return 'Global nonlinear PDE or open-ended dynamics; not a practical first formalization target without major scoping.';
  return 'Some subquestions may formalize before the full statement.';
}

function main() {
  for (const f of fs.readdirSync(PROBLEMS).filter(x => x.endsWith('.yaml'))) {
    const fp = path.join(PROBLEMS, f);
    const raw = yaml.load(fs.readFileSync(fp, 'utf8'));
    if (!raw?.id) continue;
    let changed = false;
    if (!raw.fv_reason || !String(raw.fv_reason).trim()) {
      raw.fv_reason = defaultFvReason(raw.fv_suitability || 'medium');
      changed = true;
    }
    if (changed) {
      fs.writeFileSync(fp, yaml.dump(raw, { lineWidth: 100, noRefs: true }), 'utf8');
      console.log('updated', f);
    }
  }
}

main();
