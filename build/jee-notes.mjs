// Bring a class's per-chapter notes up to date with its solved examples.
//
//   node build/jee-notes.mjs class-6 "20 September 2026"
//   node build/jee-notes.mjs class-7 "23 September 2026"
//
// EDIT-LOG.md gets a dated entry under its title (newest first, as the logs
// are kept), with the example count it replaced and the new answer key.
// ANSWERS.md, where a chapter has one, gets its Stage 2 section replaced by
// the same key. Both are read from the pages, so the notes cannot disagree
// with the book. Running it twice changes nothing.
import fs from 'node:fs';
import path from 'node:path';
import {root, readChapter} from './jee-tools.mjs';

const [cls, date] = process.argv.slice(2);
if (!/^class-\d+$/.test(cls || '') || !date) throw Error('usage: node build/jee-notes.mjs class-N "D Month YYYY"');
const n = cls.split('-')[1];
const HEAD = `## Solved examples in examination formats, ${date}`;

const text = html => html.replace(/<[^>]*>/g, ' ').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
const key = rel => readChapter(rel).examples.map((e, i) => {
  const type = e.match(/data-question-type="([^"]+)"/)[1];
  const answer = text(e.match(/<span class="work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span>/)[1]);
  return {n: i + 1, type, answer};
});

for (const name of fs.readdirSync(path.join(root, 'pages', cls)).sort()) {
  const rel = `${cls}/${name}`, dir = path.join(root, 'pages', rel);
  if (!fs.existsSync(path.join(dir, 'chapter.json'))) continue;
  if (!fs.readdirSync(dir).some(f => /^p1\d\d\.html$/.test(f) && fs.readFileSync(path.join(dir, f), 'utf8').includes('data-question-type'))) continue;
  const rows = key(rel);
  const backup = path.join(root, 'build', '_jee-backups', rel);
  const before = fs.existsSync(backup) ? readChapter(rel, true).examples.length : null;
  const bridge = fs.readdirSync(dir).filter(f => /^p1\d\d\.html$/.test(f)).sort();

  const log = path.join(dir, 'EDIT-LOG.md');
  if (fs.existsSync(log)) {
    const src = fs.readFileSync(log, 'utf8');
    if (!src.includes(HEAD)) {
      const entry = [
        HEAD, '',
        `Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single`,
        `correct, 4 multiple correct, 3 numerical answer and 2 matching, under the`,
        `contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2`,
        `further down this log**: the ${before ?? 'earlier'} examples it records, their \`Type N\` heads`,
        `and the reasons set in \`.work__why\` are gone. Stage 1, the practice`,
        `questions and the practice answers are unchanged, and are checked word for`,
        `word against the pre-edit snapshot in \`build/_jee-backups/${rel}/\`.`, '',
        `Source \`build/jee-class${n}.mjs\`; check \`build/check-jee-class${n}.mjs\`,`,
        `which recomputes every option as well as the keyed one. The division was`,
        `refit and now runs ${bridge[0].slice(0, 4)}–${bridge.at(-1).slice(0, 4)}; the answers stage still opens a fresh page.`, '',
        '| Example | Format | Answer |', '|---:|---|---|',
        ...rows.map(r => `| ${r.n} | ${r.type} | ${r.answer.replace(/\|/g, '\\|')} |`), '', '',
      ].join('\n');
      const at = src.indexOf('\n') + 1;
      fs.writeFileSync(log, src.slice(0, at) + '\n' + entry + src.slice(at).replace(/^\n+/, ''));
      console.log(`${rel}: EDIT-LOG entry added`);
    }
  }

  const ans = path.join(dir, 'ANSWERS.md');
  if (fs.existsSync(ans)) {
    const src = fs.readFileSync(ans, 'utf8');
    const lines = src.split('\n');
    const beyond = lines.findIndex(l => /^## Beyond the Book/.test(l));
    const isStage = l => /^### (Stage )?\d\b/.test(l) || /^### Stage \d/.test(l);
    let s2 = lines.findIndex((l, i) => i > beyond && /^### (Stage 2 · |2 )Solved Examples/.test(l));
    const heading = s2 >= 0 ? lines[s2] : '### Stage 2 · Solved Examples';
    const body = [
      heading, '',
      `The ${date} examples, in examination formats. Each is worked in full on`,
      `its page; these are the keys.`, '',
      ...rows.map(r => `${r.n}. ${r.answer} *(${r.type.toLowerCase()})*`), '',
    ];
    let out;
    if (s2 >= 0) {
      let end = lines.findIndex((l, i) => i > s2 && isStage(l));
      if (end < 0) end = lines.length;
      out = [...lines.slice(0, s2), ...body, ...lines.slice(end)];
    } else {
      const s3 = lines.findIndex((l, i) => i > beyond && /^### (Stage 3|3 )/.test(l));
      if (s3 < 0) throw Error(`${rel}: no place for Stage 2 in ANSWERS.md`);
      out = [...lines.slice(0, s3), ...body, ...lines.slice(s3)];
    }
    const next = out.join('\n');
    if (next !== src) { fs.writeFileSync(ans, next); console.log(`${rel}: ANSWERS.md Stage 2 replaced`); }
  }
}
