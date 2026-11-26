// Japan by Numbers — entrypoint (Node 22, standard library only).
//
// The site is app/, plain static files a browser opens at app/index.html
// (ES modules, CSS, no build step), its figures held in its own files:
// nothing it runs, styles or shows loads over the network. The program hands
// it in: it copies app/ and screenshots/ from beside this file to /output and
// writes /output/dossier.json, the summary the judge reads (your screenshots,
// the first load's files and bytes, and your source), with the vendored
// make.fun library. Leave vendor/makefun-frontend.ts as it is: the scorer
// requires dossier.json to be byte for byte what its own copy writes.
//
// Serve it locally with any static server rooted at app/, for example
// `python3 -m http.server --directory app 8080`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 16 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
const dossier = buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 });
writeFileSync(join(out, 'dossier.json'), dossier);

// Output check: refuse to report success when the hand-in is incomplete, so a
// silent copy failure can never pass as a good run.
const problems: string[] = [];
if (!existsSync(join(out, 'app', 'index.html'))) problems.push('app/index.html missing from output');
try {
  const parsed = JSON.parse(readFileSync(join(out, 'dossier.json'), 'utf8'));
  if (typeof parsed.text !== 'string' || parsed.text.length === 0) problems.push('dossier.json has no text');
} catch {
  problems.push('dossier.json does not parse');
}
const shots = existsSync(join(out, 'screenshots')) ? readdirSync(join(out, 'screenshots')).filter((f) => !f.startsWith('.')) : [];
if (shots.length < 3 || shots.length > 4) problems.push(`expected 3-4 screenshots, found ${shots.length}`);
for (const shot of shots) {
  if (statSync(join(out, 'screenshots', shot)).size > 262144) problems.push(`screenshot ${shot} is over 256 KiB`);
}
if (problems.length > 0) {
  console.error(`japan-by-numbers: output check failed: ${problems.join('; ')}`);
  process.exit(1);
}

console.log(`japan-by-numbers: app/ and screenshots/ copied to ${out}, dossier.json written (${shots.length} screenshots checked)`);
