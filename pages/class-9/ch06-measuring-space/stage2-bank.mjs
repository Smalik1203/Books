#!/usr/bin/env node
/* Beyond the Book, Stage 2 — the fifteen solved examples in examination
   formats for Class 9 Chapter 6, Measuring Space: Perimeter and Area.

   Built with panel() and matching() from build/jee-tools.mjs under the
   conventions of build/jee-class9.mjs (DESIGN-MATHS §6a): 6 single correct,
   4 multiple correct, 3 numerical answer, 2 matching, in that order; every
   piece of maths in formula type; a TeX backslash written twice in this
   source ('\\times'); no digit/digit fraction written bare (panel() would
   turn it into a \frac inside the formula), so fractions are written
   \\frac{a}{b}; and "Each entry has exactly one match." folded into a
   matching panel's opening sentence.

     import { bank } from './stage2-bank.mjs'      the 15 blocks
     node stage2-bank.mjs --write                   put them into p1xx

   --write replaces whatever lies between the "Solved Examples" stage head
   and the practice band, and leaves both untouched. The pages it writes
   are grouped conservatively; refit the bridge afterwards:
     node build/refit.mjs class-9/ch06-measuring-space bridge
   Every option and every keyed answer is re-derived in check-numbers.mjs. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { panel, matching, pageBlocks } from '../../../build/jee-tools.mjs';

const tie = x => typeof x === 'string' ? x.replace(/ ([×÷]) /g, ' $1 ') : Array.isArray(x) ? x.map(tie) : x;
const p = (...a) => panel(...a.map(tie)), m = (...a) => matching(...a.map(tie))
  .replace('Match List I with List II.</p>', 'Match List I with List II. Each entry has exactly one match.</p>')
  .replace('<p>Each entry has exactly one match.</p>', '');
const S = 'Single correct', M = 'Multiple correct', N = 'Numerical answer';
const PI = 'Use $\\pi \\approx \\frac{22}{7}$.';
const CM2 = '$\\text{cm}^2$';

export const bank = [
p(1, S, `A wheel of radius 35 cm turns 200 times as it rolls along a straight road. How far does it roll? (${PI})`,
  ['440 m', '220 m', '880 m', '44 m'],
  ['One turn covers one circumference: $2 \\times \\frac{22}{7} \\times 35 = 220$ cm.',
   '200 turns cover $200 \\times 220 = 44\\,000$ cm, which is 440 m.'],
  '(a) 440 m'),
p(2, S, `An arc of a circle of radius 21 cm is 22 cm long. What angle does it subtend at the centre? (${PI})`,
  ['$30^\\circ$', '$60^\\circ$', '$90^\\circ$', '$120^\\circ$'],
  ['The whole circumference is $2 \\times \\frac{22}{7} \\times 21 = 132$ cm.',
   'The arc is $\\frac{22}{132} = \\frac{1}{6}$ of it, so the angle is $\\frac{1}{6} \\times 360^\\circ = 60^\\circ$.'],
  '(b) $60^\\circ$'),
p(3, S, `A circle has area 7546 ${CM2}. What is its circumference? (${PI})`,
  ['98 cm', '154 cm', '308 cm', '616 cm'],
  ['$\\frac{22}{7}r^2 = 7546$ gives $r^2 = 2401$, so $r = 49$ cm.',
   '$C = 2 \\times \\frac{22}{7} \\times 49 = 308$ cm.'],
  '(c) 308 cm'),
p(4, S, 'What is the area of a triangle with sides 5 cm, 5 cm and 6 cm?',
  [`15 ${CM2}`, `30 ${CM2}`, `24 ${CM2}`, `12 ${CM2}`],
  ['$s = \\frac{1}{2}(5 + 5 + 6) = 8$.',
   `Area $= \\sqrt{8 \\times 3 \\times 3 \\times 2} = \\sqrt{144} = 12$ ${CM2}.`],
  `(d) 12 ${CM2}`),
p(5, S, 'The radius of a circle is increased by 10%. By what percentage does its area increase?',
  ['21%', '10%', '20%', '11%'],
  ['The new radius is $1.1r$, so the new area is $\\pi(1.1r)^2 = 1.21\\pi r^2$.',
   'The area grows by $0.21$ of itself, which is 21%.'],
  '(a) 21%'),
p(6, S, `A sector of a circle of radius 6 cm has area $12\\pi$ ${CM2}. How long is its arc?`,
  ['$2\\pi$ cm', '$4\\pi$ cm', '$6\\pi$ cm', '$8\\pi$ cm'],
  ['$\\pi \\times 6^2 \\times \\frac{\\theta}{360} = 12\\pi$ gives $\\theta = 120$, so the angle is $120^\\circ$.',
   'The arc is $2\\pi \\times 6 \\times \\frac{120}{360} = 4\\pi$ cm.'],
  '(b) $4\\pi$ cm'),
p(7, M, `A circle has radius 17.5 cm. Which statements are correct? (${PI})`,
  ['Its circumference is 110 cm.', `Its area is 962.5 ${CM2}.`, 'A semicircle of it has perimeter 55 cm.', 'A quarter of its circumference is 27.5 cm.'],
  [`$C = 2 \\times \\frac{22}{7} \\times 17.5 = 110$ cm and $A = \\frac{22}{7} \\times 17.5^2 = 962.5$ ${CM2}.`,
   'A semicircle has perimeter $55 + 35 = 90$ cm, and $\\frac{1}{4} \\times 110 = 27.5$ cm.'],
  '(a), (b), (d)'),
p(8, M, 'A triangle has sides 6 cm, 8 cm and 10 cm. Which statements are correct?',
  [`Its area is 24 ${CM2}.`, 'Its semi-perimeter is 24 cm.', 'Its altitude to the 10 cm side is 4.8 cm.', `Its area is 48 ${CM2}.`],
  [`$s = 12$, so the area is $\\sqrt{12 \\times 6 \\times 4 \\times 2} = \\sqrt{576} = 24$ ${CM2}.`,
   'The altitude $h$ to the 10 cm side has $\\frac{1}{2} \\times 10 \\times h = 24$, so $h = 4.8$ cm.'],
  '(a), (c)'),
p(9, M, 'Which statements about approximations of $\\pi$ are correct?',
  ['$\\frac{22}{7} \\gt \\pi$', '$3.14 \\lt \\pi$', '$\\frac{355}{113}$ is closer to $\\pi$ than $\\frac{22}{7}$ is.', '$\\sqrt{10} \\lt \\pi$'],
  ['$\\pi = 3.14159\\ldots$ and $\\frac{22}{7} = 3.14285\\ldots$, so (a) and (b) hold.',
   '$\\frac{355}{113} = 3.1415929\\ldots$ is far closer; $\\sqrt{10} = 3.1622\\ldots$ is more than $\\pi$.'],
  '(a), (b), (c)'),
p(10, M, 'A parallelogram has sides 10 cm and 6 cm. Which statements about its area are correct?',
  [`It can be 30 ${CM2}.`, `It can be 70 ${CM2}.`, `It is at most 60 ${CM2}.`, `It is 60 ${CM2} only for a rectangle.`],
  [`On the 10 cm base the height is at most 6 cm, and is 6 cm only at a right angle.`,
   `So the area is at most $10 \\times 6 = 60$ ${CM2}; a height of 3 cm gives 30 ${CM2}.`],
  '(a), (c), (d)'),
p(11, N, `A chord of a circle of radius 14 cm subtends a right angle at the centre. Find the area of the minor segment, in ${CM2}. (${PI})`, [],
  ['The sector is $\\frac{1}{4} \\times \\frac{22}{7} \\times 14^2 = 154$.',
   'The triangle is $\\frac{1}{2} \\times 14 \\times 14 = 98$, so the segment is $154 - 98 = 56$.'],
  '56'),
p(12, N, `Find the area of a triangle with sides 9 cm, 10 cm and 17 cm, in ${CM2}.`, [],
  ['$s = \\frac{1}{2}(9 + 10 + 17) = 18$.',
   'Area $= \\sqrt{18 \\times 9 \\times 8 \\times 1} = \\sqrt{1296} = 36$.'],
  '36'),
p(13, N, `An isosceles trapezium has parallel sides 4 cm and 10 cm, and each slanting side is 5 cm. Use Brahmagupta’s formula to find its area, in ${CM2}.`, [],
  ['An isosceles trapezium is cyclic, and $s = \\frac{1}{2}(4 + 5 + 10 + 5) = 12$.',
   'Area $= \\sqrt{(12 - 4)(12 - 5)(12 - 10)(12 - 5)} = \\sqrt{784} = 28$.'],
  '28'),
m(14, ['circumference (cm)', `area of a semicircle (${CM2})`, 'perimeter of a semicircle (cm)', `area of a quadrant (${CM2})`],
  ['346.5', '132', '108', '693'], [2, 4, 3, 1],
  ['$C = 2 \\times \\frac{22}{7} \\times 21 = 132$; the area is $\\frac{22}{7} \\times 21^2 = 1386$.',
   'Semicircle: area 693, perimeter $66 + 42 = 108$. Quadrant: 346.5.'], 1)
  .replace('Match List I with List II.', `A circle has radius 21 cm. Match List I with List II. (${PI})`),
m(15, ['sides 5, 12, 13', 'sides 10, 10, 12', 'sides 9, 12, 15', 'sides 10, 17, 21'],
  ['54', '84', '30', '48'], [3, 4, 1, 2],
  ['$5^2 + 12^2 = 13^2$ and $9^2 + 12^2 = 15^2$: half base times height gives 30 and 54.',
   '$\\sqrt{16 \\times 6 \\times 6 \\times 4} = 48$ and $\\sqrt{24 \\times 14 \\times 7 \\times 3} = 84$.'], 2)
  .replace('Match List I with List II.', `The sides of each triangle are in cm. Match each with its area in ${CM2}.`),
];

/* ---- --write: put the bank into the Beyond the Book pages -------- */
const DIR = path.dirname(fileURLToPath(import.meta.url));
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url) && process.argv.includes('--write')) {
  const files = fs.readdirSync(DIR).filter(f => /^p1\d\d\.html$/.test(f)).sort();
  const blocks = files.flatMap(f => pageBlocks(fs.readFileSync(path.join(DIR, f), 'utf8')));
  const start = blocks.findIndex(b => b.includes('c-stage__title">Solved Examples'));
  const end = blocks.findIndex((b, i) => i > start && /c-practice__num">3</.test(b));
  if (start < 0 || end < 0) throw Error('stage boundaries not found');
  const all = [...blocks.slice(0, start + 1), ...bank, ...blocks.slice(end)];
  const pages = []; let cur = [];
  for (const b of all) {
    if (cur.length && (/^<div class="c-example"/.test(b) || /c-stage__title">Answers/.test(b))) { pages.push(cur); cur = []; }
    cur.push(b);
    if (/^<div class="c-example"/.test(b)) { pages.push(cur); cur = []; }
  }
  if (cur.length) pages.push(cur);
  for (const f of files) fs.unlinkSync(path.join(DIR, f));
  pages.forEach((bs, i) => fs.writeFileSync(path.join(DIR, `p${101 + i}.html`),
    `<section class="page" data-bridge><div class="page__body"><div class="page__main">\n${bs.join('\n\n')}\n</div></div></section>\n`));
  console.log(`wrote ${pages.length} Beyond the Book pages with 15 examples (6/4/3/2)`);
}
