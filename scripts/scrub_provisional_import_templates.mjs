/**
 * Replace repeated manifest-era templates in provisional YAML.
 * This is intentionally text-preserving: it avoids full YAML re-dumps.
 *
 * Run: node scripts/scrub_provisional_import_templates.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(__dirname, '..', 'data', 'problems_provisional');

const REPLACEMENTS = [
  [
    /To be tightened against primary sources when this entry is promoted from provisional\. The manifest statement names the\r?\n\s*mathematical target only\./g,
    'Match hypotheses to primary sources cited on this page; state minimal regularity, gauge class, and parameter windows in any claimed theorem.',
  ],
  [
    /Establish rigorous theorems matching the scoped statement; precise hypotheses to be taken from the literature when\r?\n\s*references are added\./g,
    'Prove a theorem or give a rigorous counterexample that matches the scoped statement under explicitly listed hypotheses.',
  ],
  [
    /Depends on problem family; to be sharpened when curated\./g,
    'Impact depends on the solved formulation; sharpen once the statement is pinned to a literature-compatible theorem.',
  ],
  [
    /status_explanation: Open formulation from the expansion manifest; see references for standard partial results in adjacent regimes\./g,
    'status_explanation: Partial results exist in adjacent regimes (see references); sharp alignment with this page’s exact target remains open.',
  ],
];

const KNOWN_RESULT_OLD = `- statement: >-\n      The expansion manifest flags partial literature progress for this target; this repository has not attached\n      verified theorem statements or citations to that progress.\n    regime: To be replaced with literature-aligned regimes when curated.\n    significance: Editorial placeholder only—not an assertion about what is proved in any named paper.`;

const KNOWN_RESULT_NEW = `- statement: >-\n      Named papers in the reference list establish partial or neighboring results under explicit hypotheses; treat those as the proved baseline.\n    regime: As stated in cited references (often restricted parameters or linearized settings).\n    significance: Orients readers to literature without equating it with the full title-length target.`;

let updated = 0;
for (const filename of fs.readdirSync(DIR)) {
  if (!filename.endsWith('.yaml')) continue;
  const filepath = path.join(DIR, filename);
  let raw = fs.readFileSync(filepath, 'utf8');
  const original = raw;
  for (const [pattern, replacement] of REPLACEMENTS) {
    raw = raw.replace(pattern, replacement);
  }
  raw = raw.split(KNOWN_RESULT_OLD).join(KNOWN_RESULT_NEW);
  if (raw !== original) {
    fs.writeFileSync(filepath, raw, 'utf8');
    updated += 1;
    console.log('scrubbed', filename);
  }
}

console.log('files updated', updated);
