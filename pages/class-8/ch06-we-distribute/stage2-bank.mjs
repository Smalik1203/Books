#!/usr/bin/env node
/* Beyond the Book, Stage 2: the fifteen solved examples of Chapter 6, in the
   order 6 single correct, 4 multiple correct, 3 numerical answer, 2 matching
   (DESIGN-MATHS §6a, the solved-example contract).

   Built with panel() and matching() from build/jee-tools.mjs, with the same
   conventions as build/jee-class8.mjs: the same tie(), and a matching panel
   carries "Each entry has exactly one match." in its opening sentence. That
   file is not edited; this bank lives beside the chapter instead.

   Twelve items come from the retired chapter's bank (banks['ch04-expressions']
   in build/jee-class8.mjs), some reworded; three are new (Examples 1, 5 and
   15). Every option and every key is re-derived in check-numbers.mjs.

     node pages/class-8/ch06-we-distribute/stage2-bank.mjs     writes the blocks

   Imported, it only exports `bank`. Run, it removes any Stage 2 examples
   already in p1xx.html and puts these fifteen straight after the Solved
   Examples stage head. Refit the bridge afterwards.

   In this source a TeX backslash is written twice ('\\times'). */
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
p(1, S, 'The product $36 \\times 45$ is changed to $37 \\times 44$. How does the product change?', ['it increases by 10', 'it increases by 8', 'it decreases by 8', 'it does not change'], ['One number goes up by 1 and the other comes down by 1: $(a + 1)(b - 1) = ab + b - a - 1$, with $a = 36$ and $b = 45$.', 'The change is $45 - 36 - 1 = 8$, and it is positive, so the product increases by 8.'], '(b) it increases by 8'),
p(2, S, '$(3a - 2b)(a + 4b)$ is equal to', ['$3a^2 + 14ab - 8b^2$', '$3a^2 - 10ab - 8b^2$', '$3a^2 + 10ab - 8b^2$', '$3a^2 + 10ab + 8b^2$'], ['Each term of the first bracket multiplies each term of the second: $3a^2$, $12ab$, $-2ab$ and $-8b^2$.', '$12ab - 2ab = 10ab$, so the result is $3a^2 + 10ab - 8b^2$.'], '(c) $3a^2 + 10ab - 8b^2$'),
p(3, S, 'Using an identity, $59^2$ is', ['3421', '3541', '3419', '3481'], ['$59^2 = (60 - 1)^2 = 60^2 - 2 \\times 60 + 1$.', '$= 3600 - 120 + 1 = 3481$.'], '(d) 3481'),
p(4, S, 'If $x + y = 8$ and $x^2 + y^2 = 34$, what is $xy$?', ['15', '30', '17', '13'], ['$(x + y)^2 = x^2 + y^2 + 2xy$, so $64 = 34 + 2xy$.', '$2xy = 30$ and $xy = 15$.'], '(a) 15'),
p(5, S, 'What is $6384 \\times 11$?', ['70214', '70224', '71224', '70124'], ['$6384 \\times 11 = 63840 + 6384$: each digit is added to the digit on its right. From the right: 4; $8 + 4 = 12$, write 2 and carry 1; $3 + 8 + 1 = 12$, write 2 and carry 1; $6 + 3 + 1 = 10$, write 0 and carry 1; $6 + 1 = 7$.', 'Reading the digits from the left: 70224.'], '(b) 70224'),
p(6, S, '$(y - 7)(y + 3)$ is equal to', ['$y^2 + 4y - 21$', '$y^2 - 4y + 21$', '$y^2 - 4y - 21$', '$y^2 - 10y - 21$'], ['The four products are $y^2$, $3y$, $-7y$ and $-21$.', '$3y - 7y = -4y$, so the result is $y^2 - 4y - 21$.'], '(c) $y^2 - 4y - 21$'),
p(7, M, 'Which of these are identities, true for every value of $x$?', ['$(x - 2)^2 = x^2 - 4x + 4$', '$(x - 2)(x + 2) = x^2 - 4$', '$(x + 3)^2 = x^2 + 9$', '$x + 3 = 7$'], ['(a) is Identity 1B and (b) is Identity 1C, each with $a = x$ and $b = 2$.', '$(x + 3)^2 = x^2 + 6x + 9$, so (c) fails for $x = 1$; $x + 3 = 7$ is true only for $x = 4$.'], '(a), (b)'),
p(8, M, 'Which of these are equal to $9a^2 - 30ab + 25b^2$?', ['$(3a - 5b)^2$', '$(5b - 3a)^2$', '$(3a + 5b)^2 - 60ab$', '$(3a - 5b)(3a + 5b)$'], ['$(3a - 5b)^2 = 9a^2 - 30ab + 25b^2$, and $(5b - 3a)^2$ is the same square. $(3a + 5b)^2 - 60ab = 9a^2 + 30ab + 25b^2 - 60ab$.', '$(3a - 5b)(3a + 5b) = 9a^2 - 25b^2$.'], '(a), (b), (c)'),
p(9, M, 'Which statements are correct?', ['$64^2 - 36^2 = (64 - 36)(64 + 36)$', '$64^2 - 36^2 = 2800$', '$6.4^2 - 3.6^2 = 2.8$', '$64^2 - 36^2 = 100 \\times 28$'], ['$a^2 - b^2 = (a - b)(a + b)$ gives $28 \\times 100 = 2800$.', '$6.4^2 - 3.6^2 = 2.8 \\times 10 = 28$, not 2.8.'], '(a), (b), (d)'),
p(10, M, 'Two positive numbers $a$ and $b$ have $a - b = 3$ and $ab = 28$. Which statements are correct?', ['$a^2 + b^2 = 65$', '$(a + b)^2 = 121$', '$a + b = 11$', '$a = 4$'], ['$a^2 + b^2 = (a - b)^2 + 2ab = 9 + 56 = 65$, and $(a + b)^2 = 65 + 56 = 121$.', '$a + b$ is positive, so it is 11; then $a = 7$ and $b = 4$.'], '(a), (b), (c)'),
p(11, N, 'Using an identity, find $7.9^2$.', [], ['$7.9^2 = (8 - 0.1)^2 = 64 - 1.6 + 0.01$.', '$= 62.41$.'], '62.41'),
p(12, N, 'If $x + y = 8$ and $x^2 + y^2 = 34$, find $(x - y)^2$.', [], ['$2xy = (x + y)^2 - (x^2 + y^2) = 64 - 34 = 30$.', '$(x - y)^2 = x^2 + y^2 - 2xy = 34 - 30 = 4$.'], '4'),
p(13, N, 'Simplify $3x(2x - y) - 2y(x - 4y) + xy$, and find its value when $x = 2$ and $y = 1$.', [], ['$6x^2 - 3xy - 2xy + 8y^2 + xy = 6x^2 - 4xy + 8y^2$.', 'When $x = 2$, $y = 1$: $24 - 8 + 8 = 24$.'], '24'),
m(14, ['$(2m - 1)^2$', '$(2m + 1)(2m - 1)$', '$(2m + 1)^2$', '$(2m + 3)(2m - 1)$'], ['$4m^2 + 4m - 3$', '$4m^2 - 1$', '$4m^2 - 4m + 1$', '$4m^2 + 4m + 1$'], [3, 2, 4, 1], ['The two squares give $4m^2 - 4m + 1$ and $4m^2 + 4m + 1$, the difference of squares gives $4m^2 - 1$, and $(2m + 3)(2m - 1) = 4m^2 + 4m - 3$.'], 1),
m(15, ['$43 \\times 101$', '$57 \\times 1001$', '$1003^2 - 3^2$', '$52^2$'], ['2704', '4343', '1006000', '57057'], [2, 4, 3, 1], ['$43 \\times 101 = 4300 + 43$ and $57 \\times 1001 = 57000 + 57$.', '$1003^2 - 3^2 = (1003 + 3)(1003 - 3) = 1006 \\times 1000$, and $52^2 = (50 + 2)^2 = 2500 + 200 + 4$.'], 3),
];

/* ---- write the blocks into the bridge pages ----------------------------- */
const DIR = path.dirname(fileURLToPath(import.meta.url));
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const files = fs.readdirSync(DIR).filter(f => /^p1\d\d\.html$/.test(f)).sort();
  const EX = /\n?[ \t]*<div class="c-example" data-question-type="[^"]+">.*<\/div><\/div><\/div>[ \t]*\n?/g;
  const HEAD = /(<div class="c-stage">\s*<div class="c-stage__num">2<\/div>\s*<div class="c-stage__text">\s*<div class="c-stage__title">Solved Examples<\/div>\s*<\/div>\s*<\/div>)/;
  let placed = false;
  for (const f of files) {
    const fp = path.join(DIR, f);
    let s = fs.readFileSync(fp, 'utf8');
    const before = s;
    s = s.replace(EX, '\n');
    if (HEAD.test(s)) {
      const blocks = bank.map(b => '      ' + b).join('\n\n');
      s = s.replace(HEAD, (h) => `${h}\n\n${blocks}\n`);
      placed = true;
    }
    if (s !== before) fs.writeFileSync(fp, s);
  }
  if (!placed) throw Error('Solved Examples stage head not found in p1xx.html');
  console.log('class-8/ch06-we-distribute: installed 15 examples (6/4/3/2)');
}
