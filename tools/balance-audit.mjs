#!/usr/bin/env node
/**
 * Balance audit.
 *
 * The bottleneck in writing a topic page is not prose, it is balance - nobody writes
 * two positions equally well, because everybody has a side. This checks the tells that
 * give a writer's preference away, mechanically, before anyone reads the page.
 *
 * Errors fail the build. Warnings are for a human to look at and overrule if wrong.
 *
 *   npm run audit            all topics
 *   npm run audit -- <slug>  one topic
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { parse } from 'yaml';

const DIR = join(process.cwd(), 'src', 'content', 'topics');

/** Ratio of longest to shortest before we call it lopsided. */
const LENGTH_TOLERANCE = 1.4;

const HEDGES = [
  'some argue', 'some claim', 'some say', 'critics say', 'critics claim',
  'it is claimed', 'allegedly', 'purportedly', 'so-called', 'supposedly',
  'many believe', 'proponents claim', 'advocates claim', 'would have you believe',
];

const ASSERTIONS = [
  'studies show', 'research shows', 'evidence shows', 'data shows', 'the data show',
  'proven', 'demonstrates that', 'clearly', 'obviously', 'undeniably', 'the fact is',
];

const LOADED = [
  'radical', 'extremist', 'regime', 'cabal', 'brainwashed', 'hysteria', 'bloodlust',
  'fanatic', 'zealot', 'bigot', 'snowflake', 'indoctrination', 'sheeple', 'shill',
  'apologist', 'mere', 'merely', 'simply ignores', 'refuses to admit',
];

const errors = [];
const warnings = [];
const err  = (t, m) => errors.push(`${t}: ${m}`);
const warn = (t, m) => warnings.push(`${t}: ${m}`);

const words  = (s) => s.trim().split(/\s+/).filter(Boolean).length;
const textOf = (claims) => claims.map((c) => c.text).join(' ');
const countPhrases = (text, phrases) => {
  const low = text.toLowerCase();
  return phrases.filter((p) => low.includes(p)).map((p) => p);
};

function auditTopic(file) {
  const raw = readFileSync(join(DIR, file), 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const slug = basename(file, '.md');
  if (!m) return err(slug, 'no frontmatter found');

  let fm;
  try { fm = parse(m[1]); }
  catch (e) { return err(slug, `frontmatter is not valid YAML - ${e.message}`); }

  const positions = fm.positions ?? [];
  if (positions.length < 2) return err(slug, 'needs at least 2 positions');
  if (!fm.crux?.question) err(slug, 'no crux - a page without one is a list of talking points');

  const rows = positions.map((p) => {
    const all = [...(p.case ?? []), ...(p.cost ?? [])];
    const text = textOf(all);
    return {
      name: p.name ?? p.id,
      caseWords: words(textOf(p.case ?? [])),
      costWords: words(textOf(p.cost ?? [])),
      caseCount: (p.case ?? []).length,
      costCount: (p.cost ?? []).length,
      cited: all.filter((c) => c.source).length,
      empirical: all.filter((c) => c.type === 'empirical').length,
      values: all.filter((c) => c.type === 'values').length,
      hedges: countPhrases(text, HEDGES),
      assertions: countPhrases(text, ASSERTIONS),
      loaded: countPhrases(text, LOADED),
      missingSource: all.filter((c) => c.type === 'empirical' && !c.source).length,
    };
  });

  const spread = (key) => {
    const vals = rows.map((r) => r[key]);
    const lo = Math.min(...vals), hi = Math.max(...vals);
    return { lo, hi, ratio: lo === 0 ? Infinity : hi / lo };
  };

  // 1. Length parity - the bluntest tell, and the most reliable.
  for (const key of ['caseWords', 'costWords']) {
    const { lo, hi, ratio } = spread(key);
    if (ratio > LENGTH_TOLERANCE) {
      const label = key === 'caseWords' ? 'case' : 'cost';
      warn(slug, `${label} sections are lopsided - ${lo} vs ${hi} words (${ratio.toFixed(2)}x). ` +
        `The longer side usually belongs to the writer.`);
    }
  }

  // 2. Claim-count parity.
  for (const key of ['caseCount', 'costCount']) {
    const { lo, hi } = spread(key);
    if (hi - lo > 1) warn(slug, `uneven ${key === 'caseCount' ? 'case' : 'cost'} claim counts: ${lo} vs ${hi}`);
  }

  // 3. Evidentiary balance. Missing sources are an error (below); this is the subtler
  //    version - one position argued mostly from data and the other mostly from
  //    principle. Sometimes that is true of the topic, sometimes it is the writer
  //    doing homework for the side they like. A human has to decide which.
  const emp = spread('empirical');
  if (emp.hi - emp.lo > 2) {
    warn(slug, `one position rests on far more empirical claims than another ` +
      `(${emp.lo} vs ${emp.hi}). Check whether that is the topic or the writer.`);
  }

  // 4. Claim-type coverage. A position that is all values or all facts is under-written.
  for (const r of rows) {
    if (r.missingSource) err(slug, `${r.name}: ${r.missingSource} empirical claim(s) with no source`);
    if (r.values === 0)    warn(slug, `${r.name}: no values claims - almost every real position rests on one`);
    if (r.empirical === 0) warn(slug, `${r.name}: no empirical claims - is this position really unfalsifiable?`);
  }

  // 5. Hedging asymmetry - "some argue" on one side, "studies show" on the other.
  for (const r of rows) {
    if (r.hedges.length && r.assertions.length === 0) {
      warn(slug, `${r.name}: hedged but never assertive (${r.hedges.join(', ')})`);
    }
    if (r.assertions.length && r.hedges.length === 0) {
      warn(slug, `${r.name}: assertive but never hedged (${r.assertions.join(', ')})`);
    }
  }

  // 6. Loaded language, anywhere.
  for (const r of rows) {
    if (r.loaded.length) warn(slug, `${r.name}: loaded language - ${r.loaded.join(', ')}`);
  }

  // Report card.
  console.log(`\n  ${slug}  (${fm.status ?? 'draft'})`);
  for (const r of rows) {
    console.log(
      `    ${r.name.padEnd(14)} case ${String(r.caseWords).padStart(4)}w/${r.caseCount}` +
      `   cost ${String(r.costWords).padStart(4)}w/${r.costCount}` +
      `   cited ${r.cited}   values ${r.values}  empirical ${r.empirical}`
    );
  }
}

const only = process.argv[2];
const files = readdirSync(DIR).filter((f) => f.endsWith('.md'))
  .filter((f) => !only || basename(f, '.md') === only);

if (files.length === 0) {
  console.error(only ? `No topic named "${only}".` : 'No topics found.');
  process.exit(1);
}

console.log('Balance audit');
files.forEach(auditTopic);

if (warnings.length) {
  console.log(`\n  ${warnings.length} warning(s):`);
  warnings.forEach((w) => console.log(`    ! ${w}`));
}
if (errors.length) {
  console.log(`\n  ${errors.length} error(s):`);
  errors.forEach((e) => console.log(`    x ${e}`));
  console.log('\nAudit failed.\n');
  process.exit(1);
}
console.log(`\n  ${files.length} topic(s) audited, no errors.\n`);
