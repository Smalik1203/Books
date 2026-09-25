#!/usr/bin/env node
/* Stage 2 of Beyond the Book for Class 8, Mathematics I, Chapter 5 (Number
   Play): the 15 solved examples in examination formats (DESIGN-MATHS §6a,
   18 September 2026 contract), 6 single correct, 4 multiple correct,
   3 numerical answer, 2 matching.

   Built with panel() and matching() from build/jee-tools.mjs, with the same
   conventions as build/jee-class8.mjs: maths in formula type, a TeX
   backslash written twice in this source, the ×/÷ spacing tie, and the
   "Each entry has exactly one match." sentence folded into the matching
   panel's opening line.

   Every option and every keyed answer is re-derived in check-numbers.mjs.

     node pages/class-8/ch05-number-play/stage2-bank.mjs    (writes the pages)

   Run directly, it puts the 15 blocks into the p1xx pages: at a
   <!--STAGE2--> marker if one is there, otherwise over the existing
   Example 1 … Example 15 blocks in place, so a refitted division keeps its
   page breaks. Imported, it only exports `bank`. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { panel, matching } from '../../../build/jee-tools.mjs';

const tie = x => typeof x === 'string' ? x.replace(/ ([×÷]) /g, ' $1 ') : Array.isArray(x) ? x.map(tie) : x;
const p = (...a) => panel(...a.map(tie)), m = (...a) => matching(...a.map(tie))
  .replace('Match List I with List II.</p>', 'Match List I with List II. Each entry has exactly one match.</p>')
  .replace('<p>Each entry has exactly one match.</p>', '');
const S = 'Single correct', M = 'Multiple correct', N = 'Numerical answer';

export const bank = [
p(1, S, 'Which of these expressions is odd for every whole number $n$?',
  ['$n + 7$', '$3n + 1$', '$2n^2 + 7$', '$5n + 2$'],
  ['$2n^2$ is even for every $n$, and even $+$ odd is odd, so $2n^2 + 7$ is always odd.',
   'The others change with $n$: $n + 7$ and $3n + 1$ are even when $n$ is odd, and $5n + 2$ is even when $n$ is even.'],
  '(c) $2n^2 + 7$'),
p(2, S, 'For which digit $d$ is the five-digit number $7d241$ divisible by 9?',
  ['4', '5', '3', '0'],
  ['The digit sum is $7 + d + 2 + 4 + 1 = 14 + d$.',
   'The only multiple of 9 that $14 + d$ can reach with a single digit $d$ is 18, so $d = 4$: $74241 = 9 \\times 8249$.'],
  '(a) 4'),
p(3, S, 'What is the remainder when 70413 is divided by 11?',
  ['1', '3', '13', '2'],
  ['From the units digit, add and subtract in turn: $3 - 1 + 4 - 0 + 7 = 13$.',
   '13 is 2 more than 11, so 70413 is 2 more than a multiple of 11: $70413 = 11 \\times 6401 + 2$.'],
  '(d) 2'),
p(4, S, 'A number leaves a remainder of 5 when divided by 8. What remainder does 3 times the number leave when divided by 8?',
  ['15', '7', '5', '3'],
  ['Write the number as $8k + 5$. Then $3(8k + 5) = 24k + 15$.',
   '$24k + 15 = 8(3k + 1) + 7$, so the remainder is 7. A remainder is always less than 8, so 15 cannot be one.'],
  '(b) 7'),
p(5, S, 'A number leaves a remainder of 4 when divided by 9. What is the digital root of the number that is 7 more than it?',
  ['2', '11', '4', '7'],
  ['Write the number as $9k + 4$. Then $(9k + 4) + 7 = 9k + 11 = 9(k + 1) + 2$.',
   'So the new number leaves a remainder of 2 when divided by 9, and its digital root is 2. For example, $13 + 7 = 20$ and $2 + 0 = 2$.'],
  '(a) 2'),
p(6, S, 'In the cryptarithm $\\text{AB} \\times 7 = \\text{CBA}$, what is the two-digit number AB?',
  ['79', '69', '96', '97'],
  ['The units digit of $7 \\times \\text{B}$ is A, and the product starts with C and ends with A.',
   'Trying the options: $97 \\times 7 = 679$, which is C $= 6$, B $= 7$, A $= 9$. The others give 553, 483 and 672, which do not fit CBA.'],
  '(d) 97'),
p(7, M, 'Which of these numbers are divisible by 6?',
  ['5412', '2358', '4215', '7322'],
  ['A number is divisible by 6 when it is divisible by both 2 and 3.',
   '5412 is even with digit sum 12, and 2358 is even with digit sum 18. 4215 is odd, and 7322 has digit sum 14.'],
  '(a), (b)'),
p(8, M, '$M$ and $N$ are both multiples of 7, and $N$ is not 0. Which of these must be multiples of 7?',
  ['$M + N$', '$M - N$', '$M \\times N$', '$M \\div N$'],
  ['Write $M = 7a$ and $N = 7b$. Then $M + N = 7(a + b)$, $M - N = 7(a - b)$ and $M \\times N = 7(7ab)$.',
   '$M \\div N$ need not be: $M = 14$ and $N = 7$ give $14 \\div 7 = 2$.'],
  '(a), (b), (c)'),
p(9, M, 'The digital root of a number $N$ is 6. Which statements are correct?',
  ['$N$ leaves a remainder of 6 when divided by 9.', '$N + 3$ is divisible by 9.', '$2N$ has digital root 3.', '$N - 6$ is divisible by 18.'],
  ['A digital root of 6 means $N = 9k + 6$. So $N + 3 = 9(k + 1)$, and $2N = 18k + 12 = 9(2k + 1) + 3$.',
   '$N - 6 = 9k$ is a multiple of 9 but not always of 18: for $N = 15$, $N - 6 = 9$.'],
  '(a), (b), (c)'),
p(10, M, 'Which statements are true for every set of five consecutive whole numbers?',
  ['Their sum is a multiple of 5.', 'Their sum is odd.', 'Exactly one of them is a multiple of 5.', 'At least two of them are even.'],
  ['With middle number $m$, the sum is $(m - 2) + (m - 1) + m + (m + 1) + (m + 2) = 5m$.',
   '$5m$ is odd only when $m$ is odd: $1 + 2 + 3 + 4 + 5 = 15$ but $2 + 3 + 4 + 5 + 6 = 20$. Five numbers in a row meet exactly one multiple of 5, and contain two or three even numbers.'],
  '(a), (c), (d)'),
p(11, N, 'Find the digit $d$ for which the five-digit number $6d875$ is divisible by 11.',
  [],
  ['From the units digit: $5 - 7 + 8 - d + 6 = 12 - d$.',
   'For a digit $d$, $12 - d$ is a multiple of 11 only when $d = 1$: $61875 = 11 \\times 5625$.'],
  '1'),
p(12, N, 'How many whole numbers from 1 to 200 have digital root 7?',
  [],
  ['A digital root of 7 means the number is 7 more than a multiple of 9: $7, 16, 25, \\ldots$',
   'The largest up to 200 is $196 = 9 \\times 21 + 7$, so the numbers are $9k + 7$ for $k = 0$ to 21: 22 of them.'],
  '22'),
p(13, N, 'What is the remainder when $10^{25}$ is divided by 11?',
  [],
  ['The place values 10, 1000, 100000, … — odd powers of 10 — are each 1 less than a multiple of 11.',
   '$10^{25}$ is an odd power, so it is 1 less than a multiple of 11, which is 10 more than the one before.'],
  '10'),
m(14, ['4512', '8807', '7777', '36036'], ['5', '0', '3', '1'], [3, 1, 4, 2],
  ['The digit sums are 12, 23, 28 and 18, with digital roots 3, 5, 1 and 9.',
   'A digital root of 9 means a remainder of 0; the others are the remainders.'], 2)
  .replace('Match List I with List II.', 'Match each number in List I with the remainder it leaves when divided by 9 in List II.'),
m(15, ['The number formed by the last three digits is a multiple of 8', 'The digit sum is a multiple of 3 and the units digit is even', 'Adding and subtracting the digits in turn gives a multiple of 11', 'The number formed by the last two digits is a multiple of 4'],
  ['4', '11', '6', '8'], [4, 3, 2, 1],
  ['The last three digits test 8 and the last two digits test 4, as in the shortcuts you learnt earlier.',
   'Divisible by 2 and by 3 is divisible by 6, and the alternating sum tests 11.'], 1)
  .replace('Match List I with List II.', 'Match each test in List I with the number whose divisibility it checks in List II.'),
];

/* ---- write into the pages ----------------------------------------- */
const DIR = path.dirname(fileURLToPath(import.meta.url));
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const files = fs.readdirSync(DIR).filter(f => /^p1\d\d\.html$/.test(f)).sort();
  let done = false;
  for (const f of files) {
    const fp = path.join(DIR, f);
    let h = fs.readFileSync(fp, 'utf8');
    if (h.includes('<!--STAGE2-->')) {
      h = h.split('<!--STAGE2-->').join(bank.join('\n\n      '));
      fs.writeFileSync(fp, h); done = true;
    }
  }
  if (!done) {
    let n = 0;
    for (const f of files) {
      const fp = path.join(DIR, f);
      let h = fs.readFileSync(fp, 'utf8');
      const out = h.replace(/<div class="c-example" data-question-type="[^"]*"><div class="c-example__tab">Example (\d+) ·[\s\S]*?<\/div><\/div><\/div><\/div>(?=\s)/g, (mm, k) => { n++; return bank[Number(k) - 1]; });
      if (out !== h) fs.writeFileSync(fp, out);
    }
    if (n !== 15) throw Error(`replaced ${n} examples, expected 15`);
  }
  console.log('stage 2: 15 examples written (6 single, 4 multiple, 3 numerical, 2 matching)');
}
