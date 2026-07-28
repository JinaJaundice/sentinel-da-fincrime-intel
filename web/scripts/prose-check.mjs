// Prose check: keep the words in the product plain.
//
// The decks are gated on this already (build/ey_qa.py). The application was
// not, so the copy drifted into the same habits: em-dashes, "X, not Y"
// antithesis, short slogan sentences, consulting filler, and a signposting tic
// that tells the reader something is important instead of just saying it.
//
// This reads user-visible strings out of the source and fails on those
// patterns. It is deliberately narrow: it checks copy a reader sees, not
// comments and not identifiers, because a comment explaining a decision to the
// next engineer is doing a different job from a sentence on a page.
//
// The Overview surface is excluded. It is the marketing landing page and it is
// allowed a different register.
//
//   node scripts/prose-check.mjs           report
//   node scripts/prose-check.mjs --fail     exit non-zero on any finding

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("../src/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

// Surfaces whose register is deliberately different, and generated or
// vendored content the check does not own.
const SKIP = [
  ".test.",
];

const RULES = [
  [/—/g, "em-dash", "Use a comma, a full stop, or restructure."],
  [/–(?=\s)/g, "en-dash used as an em-dash", "Use a comma or a full stop."],
  [
    /\b([a-z][\w' ]{2,28}), not ([a-z][\w' ]{2,28})\b/g,
    '"X, not Y" antithesis',
    "State the positive on its own.",
  ],
  [
    /\bnot (?:a|an|the) [\w' ]{2,24}(?:\.|,) (?:It|They|This) (?:is|are)\b/g,
    '"not X. It is Y" split',
    "Say what it is and stop.",
  ],
  [
    /\b(?:seamless(?:ly)?|leverage[sd]?|robust|cutting-edge|best-in-class|world-class|state-of-the-art)\b/gi,
    "consulting filler",
    "Say what it does instead.",
  ],
  [
    /\b(?:it'?s worth (?:noting|stating)|importantly|crucially|notably|it is worth stating plainly)\b/gi,
    "filler signpost",
    "Delete it and state the point.",
  ],
  [
    /\b(?:genuinely|deliberately|actually|truly|simply put|in essence)\b/gi,
    "intensifier",
    "Cut it. The sentence is stronger without.",
  ],
  [
    /\bunlock(?:s|ing)? (?:value|potential|the)\b|\bjourney of\b|\bin today's [\w-]+ landscape\b|\bever-(?:changing|evolving)\b/gi,
    "marketing filler",
    "Replace with the concrete thing.",
  ],
  [
    /\bthe (?:wedge|moat|mandate|ask|window|north star|play)\b/gi,
    "codename",
    "Use the real noun.",
  ],
];

// A slogan: two very short complete sentences in a row, neither carrying
// detail. Real copy that happens to be brief is fine; a pair reads as a
// tagline.
const SLOGAN = /(^|[.!?]\s)([A-Z][a-z][^.!?]{4,34}\.)\s([A-Z][a-z][^.!?]{4,34}\.)(\s|$)/;

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    else if (/\.(tsx?|md)$/.test(name)) out.push(path);
  }
  return out;
}

// Pull out string and template literals plus JSX text. Comments are stripped
// first, so an explanatory comment is never treated as copy.
function copyStrings(source) {
  // Blank comments out rather than deleting them, so the line numbers still
  // point at the original file. Deleting them shifts every later report by
  // however many comment lines came before it, which sends you to the wrong
  // place and wastes the time the check was meant to save.
  const blank = (match) => match.replace(/[^\n]/g, " ");
  const withoutComments = source
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, lead) => lead + blank(m.slice(lead.length)));
  const found = [];
  const literal = /"((?:[^"\\]|\\.){12,})"|'((?:[^'\\]|\\.){12,})'|`((?:[^`\\$]|\\.){12,})`/g;
  let m;
  while ((m = literal.exec(withoutComments)) !== null) {
    const text = m[1] ?? m[2] ?? m[3];
    // Skip anything that is plainly not prose: class lists, urls, ids.
    if (/^[\w\-/.:#]+$/.test(text)) continue;
    // A lone em-dash is the standard way to render an empty cell. That is
    // typography, not prose, so it is not the thing this check is about.
    if (/^[\s—–-]+$/.test(text)) continue;
    // A quote pair can straddle two JSX attributes, capturing the markup
    // between them and reporting whatever punctuation it contained. Anything
    // holding a tag or an attribute is not a sentence.
    if (/<\/|\/>|className=|<[a-zA-Z]/.test(text)) continue;
    if (/(?:^|\s)(?:flex|grid|text-|bg-|border-|rounded|px-|py-|mt-|mb-)/.test(text)) continue;
    if (/^https?:/.test(text)) continue;
    // A quote or backtick pair can also straddle two real literals and capture
    // the code between them (seen with two template literals: the match ran
    // from one closing backtick to the next opening one). Code is not prose.
    if (/(?:const |return |=> |for \(|if \()/.test(text)) continue;
    const line = withoutComments.slice(0, m.index).split("\n").length;
    found.push({ text, line });
  }
  return found;
}

const findings = [];
for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  if (SKIP.some((s) => rel.includes(s))) continue;
  const source = readFileSync(file, "utf8");
  for (const { text, line } of copyStrings(source)) {
    for (const [pattern, why, fix] of RULES) {
      pattern.lastIndex = 0;
      const hit = pattern.exec(text);
      if (hit) findings.push({ rel, line, why, fix, sample: hit[0].slice(0, 60) });
    }
    const slogan = SLOGAN.exec(text);
    if (slogan) {
      findings.push({
        rel,
        line,
        why: "reads as a slogan (two short sentences)",
        fix: "Join them, or add the detail that makes them worth two.",
        sample: `${slogan[2]} ${slogan[3]}`.slice(0, 70),
      });
    }
  }
}

const byRule = new Map();
for (const f of findings) byRule.set(f.why, (byRule.get(f.why) ?? 0) + 1);

if (findings.length === 0) {
  console.log("prose check: clean");
} else {
  console.log(`prose check: ${findings.length} findings\n`);
  for (const [why, count] of [...byRule].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(count).padStart(4)}  ${why}`);
  }
  console.log("");
  for (const f of findings.slice(0, 60)) {
    console.log(`${f.rel}:${f.line}  ${f.why}`);
    console.log(`    ${f.sample}`);
  }
  if (findings.length > 60) console.log(`\n... and ${findings.length - 60} more`);
}

if (process.argv.includes("--fail") && findings.length > 0) process.exitCode = 1;
