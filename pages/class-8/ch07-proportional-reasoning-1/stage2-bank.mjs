// Beyond the Book, Stage 2: the fifteen solved examples of Class 8 Chapter 7,
// in the order 6 single correct, 4 multiple correct, 3 numerical answer and
// 2 matching (DESIGN-MATHS §6a). Built with panel() and matching() exactly as
// build/jee-class8.mjs builds the other Class 8 chapters, with the same tie
// and replace conventions; kept here rather than in jee-class8.mjs so that
// this chapter's bank can be edited without touching the shared file.
//
//   node pages/class-8/ch07-proportional-reasoning-1/stage2-bank.mjs --install
//
// installs the blocks into the p1xx pages: a <!--STAGE2--> placeholder is
// replaced by all fifteen, and an existing "Example N · …" block is replaced
// in place by example N. Every option and key is re-derived by
// check-numbers.mjs beside this file.
//
// In this source a TeX backslash is written twice ('\\times'). Never write a
// digit/digit fraction: panel() turns it into \frac, and inside $…$ that
// breaks the formula. Write \\frac{a}{b} instead.
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
p(1,S,'In its simplest form, the ratio of 1.2 m to 45 cm is',['$8 : 3$','$3 : 8$','$24 : 9$','$4 : 15$'],['1.2 m is 120 cm, so in one unit the ratio is $120 : 45$.','The HCF of 120 and 45 is 15: $120 \\div 15 = 8$ and $45 \\div 15 = 3$. The ratio $24 : 9$ is equal to it but is not in simplest form.'],'(a) $8 : 3$'),
p(2,S,'Which ratio is proportional to $18 : 27$?',['$4 : 9$','$10 : 15$','$6 : 8$','$27 : 18$'],['Dividing by the HCF, 9, reduces $18 : 27$ to $2 : 3$.','Only $10 : 15$ also reduces to $2 : 3$. The ratio $27 : 18$ is $3 : 2$, the terms the other way round.'],'(b) $10 : 15$'),
p(3,S,'If $2.5 : x :: 10 : 36$, what is $x$?',['$14.4$','$90$','$9$','$4$'],['Cross multiply: $2.5 \\times 36 = x \\times 10$.','$90 = 10x$, so $x = 9$.'],'(c) $9$'),
p(4,S,'A machine caps 360 bottles in 15 minutes. Working at the same rate, how many bottles does it cap in $1\\tfrac{1}{4}$ hours?',['30','450','1500','1800'],['$1\\tfrac{1}{4}$ hours is 75 minutes, so the proportion is $15 : 360 :: 75 : x$.','$15x = 360 \\times 75$, so $x = 1800$.'],'(d) 1800'),
p(5,S,'₹5,600 is divided between two sisters in the ratio $3 : 4$. How much more does the second sister get than the first?',['₹800','₹1,400','₹2,400','₹3,200'],['$3 + 4 = 7$ parts, so one part is $5600 \\div 7 = 800$ rupees.','The shares are ₹2,400 and ₹3,200, which differ by one part, ₹800.'],'(a) ₹800'),
p(6,S,'A patient\'s temperature is 104 °F. What is it in degrees Celsius?',['72 °C','40 °C','58 °C','26 °C'],['$C = \\frac{5}{9} \\times (F - 32) = \\frac{5}{9} \\times (104 - 32)$.','$\\frac{5}{9} \\times 72 = 40$.'],'(b) 40 °C'),
p(7,M,'Which of these rectangles have the same shape as a rectangle 6 cm wide and 4 cm high?',['9 cm wide, 6 cm high','8 cm wide, 6 cm high','3 cm wide, 2 cm high','15 cm wide, 10 cm high'],['Width to height is $6 : 4$, which is $3 : 2$.','$9 : 6$, $3 : 2$ and $15 : 10$ all reduce to $3 : 2$; $8 : 6$ reduces to $4 : 3$, a different shape.'],'(a), (c), (d)'),
p(8,M,'Which statements about the ratio $3 : 5$ are correct?',['$(3 + 2) : (5 + 2)$ is proportional to $3 : 5$.','$(3 \\times 4) : (5 \\times 4)$ is proportional to $3 : 5$.','$3 : 5 :: 4.5 : 7.5$','$3 : 5 :: 5 : 3$'],['Multiplying both terms by 4 gives $12 : 20$, which reduces to $3 : 5$; and $3 \\times 7.5 = 22.5 = 5 \\times 4.5$.','Adding 2 gives $5 : 7$, and $3 \\times 7 = 21$ but $5 \\times 5 = 25$. And $5 : 3$ is the ratio reversed.'],'(b), (c)'),
p(9,M,'Which of these unit conversions are correct?',['1 hectare = 2.471 acres','1 litre = 1000 cc','1 square metre = 3.281 square feet','5 hectares = 50 000 square metres'],['(a) and (b) are in the table of conversions, and $5 \\times 10\\,000 = 50\\,000$.','3.281 changes metres into feet. A square metre is $3.281 \\times 3.281$, about 10.764 square feet.'],'(a), (b), (d)'),
p(10,M,'Rekha is 8 years old and her father is 32. Which statements are correct?',['Their ages are now in the ratio $1 : 4$.','In 8 years their ages will be in the ratio $1 : 4$.','In 8 years their ages will be in the ratio $2 : 5$.','Four years ago their ages were in the ratio $1 : 7$.'],['Now: $8 : 32 = 1 : 4$. In 8 years: $16 : 40 = 2 : 5$, not $1 : 4$.','Four years ago: $4 : 28 = 1 : 7$. Adding the same number to both ages changes the ratio.'],'(a), (c), (d)'),
p(11,N,'A can holds 45 litres of milk and water in the ratio $4 : 1$. How many litres of water must be added to make the ratio $3 : 2$?',[],['Milk is $\\frac{4}{5} \\times 45 = 36$ litres and water is 9 litres.','The milk stays 36 litres, so $3 : 2 :: 36 : w$ gives $w = 24$. Add $24 - 9 = 15$ litres.'],'15'),
p(12,N,'One acre of farmland costs ₹4,00,000. At the same rate, what does one hectare cost, in rupees? Use 1 hectare = 2.471 acres.',[],['$1 : 400\\,000 :: 2.471 : x$','$x = 2.471 \\times 400\\,000 = 988\\,400$.'],'988400'),
p(13,N,'$\\frac{3}{4}$ kg of dry fruit costs ₹510. What does 2.5 kg cost, in rupees?',[],['$\\frac{3}{4} : 510 :: 2.5 : x$, so $\\frac{3}{4} \\times x = 510 \\times 2.5 = 1275$.','$x = 1275 \\times \\frac{4}{3} = 1700$.'],'1700'),
m(14,['the ratio $45 : 60$','2 m to 80 cm','750 g to 2 kg','36 minutes to 1.5 hours'],['$2 : 5$','$3 : 8$','$3 : 4$','$5 : 2$'],[3,4,2,1],['$45 : 60 = 3 : 4$, dividing by 15; in centimetres, $200 : 80 = 5 : 2$.','In grams, $750 : 2000 = 3 : 8$; in minutes, $36 : 90 = 2 : 5$.'],1).replace('Match List I with List II.','Match each ratio in List I with its simplest form in List II.'),
m(15,['$1 : 2$','$1 : 3$','$4 : 5$','$5 : 7$'],['₹150','₹120','₹160','₹90'],[2,4,3,1],['One part is $360 \\div 3 = 120$ and $360 \\div 4 = 90$ rupees, so the smaller shares are ₹120 and ₹90.','One part is $360 \\div 9 = 40$, so $4 \\times 40 = 160$; and $360 \\div 12 = 30$, so $5 \\times 30 = 150$.'],2).replace('Match List I with List II.','₹360 is divided in each ratio of List I. Match it with the smaller share in List II.'),
];

if (process.argv.includes('--install')) {
  const dir = path.dirname(fileURLToPath(import.meta.url));
  for (const f of fs.readdirSync(dir).filter(f => /^p1\d\d\.html$/.test(f)).sort()) {
    const file = path.join(dir, f);
    let s = fs.readFileSync(file, 'utf8');
    const before = s;
    s = s.replace('<!--STAGE2-->', () => bank.join('\n\n'));
    s = s.replace(/^(\s*)<div class="c-example" data-question-type="[^"]+"><div class="c-example__tab">Example (\d+) ·.*$/gm,
      (line, ind, n) => ind + bank[Number(n) - 1]);
    if (s !== before) { fs.writeFileSync(file, s); console.log('installed into', f); }
  }
}
