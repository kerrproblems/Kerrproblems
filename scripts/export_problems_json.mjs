/**
 * Emit public/problems-db.json for tooling (normalized view).
 * Run after build or via npm run export:problems
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllProblems } from '../src/lib/problems.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'problems-db.json');

function main() {
  const problems = getAllProblems();
  const payload = {
    generated: new Date().toISOString(),
    count: problems.length,
    problems: problems.map(p => {
      const { _sortDate, ...rest } = p;
      const clean = { ...rest };
      delete clean.families;
      delete clean.asymptotics_list;
      return clean;
    }),
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2), 'utf8');
  console.log('wrote', OUT);
}

main();
