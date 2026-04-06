/**
 * Validate problem YAML against taxonomy rules and internal consistency.
 * Run: npm run validate
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import {
  CLUSTERS,
  STATUSES,
  FAMILIES,
  ASYMPTOTICS,
  COUPLINGS,
  EQUATION_LEVELS,
  REGIMES,
  RELEVANCE,
  FV_SUITABILITY,
} from '../src/lib/taxonomy.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROBLEMS_DIR = path.join(__dirname, '..', 'problems');

const ID_RE = /^K-[0-9]{3}$/;
let errors = 0;
let warnings = 0;

function err(msg) {
  console.error('ERROR:', msg);
  errors += 1;
}

function warn(msg) {
  console.warn('WARN:', msg);
  warnings += 1;
}

function checkEnum(label, value, allowed) {
  if (!allowed.includes(value)) err(`${label}: invalid "${value}" (allowed: ${allowed.join(', ')})`);
}

function physicsFacingHeuristic(text) {
  if (!text) return false;
  const t = String(text).toLowerCase();
  return /\b(ligo|virgo|kagra|observat|astrophys|instrument|detector|waveform)\b/.test(t);
}

function main() {
  const files = fs.readdirSync(PROBLEMS_DIR).filter(f => f.endsWith('.yaml'));
  const allIds = new Set();

  for (const f of files) {
    const raw = yaml.load(fs.readFileSync(path.join(PROBLEMS_DIR, f), 'utf8'));
    if (!raw || typeof raw !== 'object') {
      err(`${f}: empty or invalid YAML`);
      continue;
    }
    const id = raw.id;
    if (!ID_RE.test(id || '')) err(`${f}: bad id "${id}"`);
    if (`${id}.yaml` !== f) err(`${f}: filename does not match id ${id}`);
    allIds.add(id);

    [
      ['title', raw.title],
      ['statement', raw.statement],
      ['math_required', raw.math_required],
      ['why_it_matters', raw.why_it_matters],
      ['completion_criteria', raw.completion_criteria],
      ['implications', raw.implications],
    ].forEach(([k, v]) => {
      if (v == null || !String(v).trim()) err(`${id}: missing ${k}`);
    });

    if (typeof raw.difficulty !== 'number' || raw.difficulty < 1 || raw.difficulty > 5) {
      err(`${id}: difficulty must be integer 1–5`);
    }

    checkEnum(`${id} cluster`, raw.cluster, CLUSTERS);
    checkEnum(`${id} status`, raw.status, STATUSES);
    checkEnum(`${id} family`, raw.family, FAMILIES);
    checkEnum(`${id} asymptotics`, raw.asymptotics, ASYMPTOTICS);
    checkEnum(`${id} coupling`, raw.coupling, COUPLINGS);
    checkEnum(`${id} relevance`, raw.relevance, RELEVANCE);
    checkEnum(`${id} fv_suitability`, raw.fv_suitability, FV_SUITABILITY);

    if (!raw.fv_reason || !String(raw.fv_reason).trim()) err(`${id}: fv_reason required`);

    if (!Array.isArray(raw.equation_level) || raw.equation_level.length === 0) {
      err(`${id}: equation_level must be non-empty array`);
    } else {
      for (const e of raw.equation_level) {
        if (!EQUATION_LEVELS.includes(e)) err(`${id}: bad equation_level "${e}"`);
      }
    }

    if (!Array.isArray(raw.regime) || raw.regime.length === 0) {
      err(`${id}: regime must be non-empty array`);
    } else {
      for (const r of raw.regime) {
        if (!REGIMES.includes(r)) err(`${id}: bad regime "${r}"`);
      }
    }

    if (!raw.progress_summary || !String(raw.progress_summary).trim()) err(`${id}: progress_summary required`);

    if (!Array.isArray(raw.dependencies)) err(`${id}: dependencies must be array`);
    if (!Array.isArray(raw.related)) err(`${id}: related must be array`);
    if (!Array.isArray(raw.references)) err(`${id}: references must be array`);

    for (const d of raw.dependencies || []) {
      if (!ID_RE.test(d)) err(`${id}: bad dependency id "${d}"`);
    }
    for (const r of raw.related || []) {
      if (!ID_RE.test(r)) err(`${id}: bad related id "${r}"`);
    }

    if (!raw.references.length) {
      warn(`${id}: references empty — needs curation`);
    }

    if (
      raw.relevance === 'pure-math' &&
      physicsFacingHeuristic(`${raw.title} ${raw.statement}`) &&
      !(raw.caution_note && String(raw.caution_note).trim())
    ) {
      warn(`${id}: pure-math with physics-facing wording but no caution_note — check taxonomy`);
    }
  }

  for (const f of files) {
    const raw = yaml.load(fs.readFileSync(path.join(PROBLEMS_DIR, f), 'utf8'));
    for (const d of raw.dependencies || []) {
      if (!allIds.has(d)) err(`${raw.id}: dependency ${d} not found`);
    }
    for (const r of raw.related || []) {
      if (!allIds.has(r)) err(`${raw.id}: related ${r} not found`);
    }
  }

  console.log(`Validated ${files.length} files. Errors: ${errors}, warnings: ${warnings}.`);
  if (errors) process.exit(1);
}

main();
