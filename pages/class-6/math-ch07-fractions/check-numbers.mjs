#!/usr/bin/env node
/* Re-derive the numbers this chapter prints.

     node pages/class-6/math-ch07-fractions/check-numbers.mjs

   Rewritten on 26 September 2026 for the maths-v2 chapter (summary page,
   By the Book in six forms, Beyond the Book by format), after the model of
   Chapters 1 and 5. The version before it checked a layout that no longer
   exists (Beyond's stages, its practice run of 31, the old figure numbers)
   and is in git history; it also measured the chikki pieces of Fig. 7.4 and
   the bars of Figs 7.7-7.10 off their SVGs, which this one does not.

   All arithmetic is exact: fractions are pairs of whole numbers.

   A  every relation set as maths ($...$) on every page and in ANSWERS.md:
      each =, < and > between numbers, fractions and mixed numbers must
      hold. Three printed sums are false on purpose and must stay false.
   B  the key is complete: By the Book 1-50 and Beyond practice 1-15 are all
      answered; every solved example ends in an Answer row; tabs run 1, 2, ...
   C  every objective, assertion-reason, multiple-correct and matching
      question: the right option is computed here from the page and must be
      the one the key (or the example's Answer row) names; exactly one option
      is right in each single-correct question
   D  every number the By the Book and Beyond keys print as an answer is
      computed here and must appear in its key row

   Exits 1 on any failure. */
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const B = String.fromCharCode(92);
const PAGES = readdirSync(DIR).filter(f => /^p\d{3}\.html$/.test(f)).sort();
const HTML = Object.fromEntries(PAGES.map(f => [f, readFileSync(path.join(DIR, f), 'utf8').replace(/\r\n/g, '\n')]));
const ALL = PAGES.map(f => HTML[f]).join('\n');
const ANSWERS = readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8').replace(/\r\n/g, '\n');
let fails = 0, checks = 0;
const ok = (label, cond, detail = '') => { checks++; if (!cond) { fails++; console.log(`  x ${label}${detail ? '  ' + detail : ''}`); } };

/* ---- exact fractions -------------------------------------------------- */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const F = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
const add = (x, y) => F(x[0] * y[1] + y[0] * x[1], x[1] * y[1]);
const sub = (x, y) => F(x[0] * y[1] - y[0] * x[1], x[1] * y[1]);
const mul = (x, y) => F(x[0] * y[0], x[1] * y[1]);
const div = (x, y) => F(x[0] * y[1], x[1] * y[0]);
const cmp = (x, y) => Math.sign(x[0] * y[1] - y[0] * x[1]);
const eq = (x, y) => cmp(x, y) === 0;
const str = x => (x[1] === 1 ? `${x[0]}` : `${x[0]}/${x[1]}`);

/* ---- a small evaluator for the book's LaTeX --------------------------- */
function toExpr(t) {
  let s = t.split(B + 'dfrac').join(B + 'frac').split(B + 'tfrac').join(B + 'frac');
  s = s.split(B + 'text{ times }').join('*').split(B + 'times').join('*').split(B + 'div').join('/');
  s = s.replace(/−/g, '-').split(B + ',').join('').split(B + ' ').join(' ').split(B + 'thinsp').join('');
  // innermost \frac{a}{b} first; a whole number right before \frac is a mixed number
  const re = new RegExp('(\\d*)\\s*' + B + B + 'frac\\{([^{}]*)\\}\\{([^{}]*)\\}');
  let m;
  while ((m = s.match(re))) {
    const frac = `((${m[2]})/(${m[3]}))`;
    s = s.slice(0, m.index) + (m[1] ? `(${m[1]}+${frac})` : frac) + s.slice(m.index + m[0].length);
  }
  return s;
}
function evaluate(e) {
  const tok = e.replace(/\s+/g, '').match(/\d+|[-+*/()]/g);
  if (!tok || tok.join('') !== e.replace(/\s+/g, '')) return null;
  let i = 0;
  const prim = () => { const t = tok[i++]; if (t === '(') { const v = expr(); i++; return v; } if (t === '-') return mul([-1, 1], prim()); return F(Number(t)); };
  const term = () => { let v = prim(); while (tok[i] === '*' || tok[i] === '/') { const o = tok[i++]; const w = prim(); v = o === '*' ? mul(v, w) : div(v, w); } return v; };
  const expr = () => { let v = term(); while (tok[i] === '+' || tok[i] === '-') { const o = tok[i++]; const w = term(); v = o === '+' ? add(v, w) : sub(v, w); } return v; };
  try { const v = expr(); return i === tok.length ? v : null; } catch { return null; }
}
const val = t => evaluate(toExpr(t));

/* ---- A: relations ----------------------------------------------------- */
const FALSE_ON_PURPOSE = [
  B + 'frac{1}{3} + ' + B + 'frac{1}{4} = ' + B + 'frac{2}{7}',   // Rohan, tried and explained
  B + 'frac{2}{3} + ' + B + 'frac{1}{5} = ' + B + 'frac{3}{8}',   // By the Book 32, assertion (d)
  B + 'frac{2}{5} + ' + B + 'frac{1}{5} = ' + B + 'frac{3}{10}',  // Beyond Example 3, option (c)
];
let rel = 0;
function relations(label, src) {
  for (const m of src.matchAll(/\$([^$]+)\$/g)) {
    const t = m[1];
    if (!/[=<>]/.test(t) || /cdots|ldots|square|[a-z]\b(?![{])/.test(t.replace(/\\[a-z]+/g, ''))) continue;
    for (const part of t.split(B + 'quad').flatMap(p => p.split(/,\s/))) {
      const sides = part.split(/(=|<|>)/);
      if (sides.length < 3) continue;
      const vals = sides.filter((_, k) => k % 2 === 0).map(val);
      if (vals.some(v => v === null)) continue;
      const falseOK = FALSE_ON_PURPOSE.some(fp => part.includes(fp));
      let good = true;
      for (let k = 1; k < sides.length; k += 2) {
        const c = cmp(vals[(k - 1) / 2], vals[(k + 1) / 2]);
        if ((sides[k] === '=' && c !== 0) || (sides[k] === '<' && c !== -1) || (sides[k] === '>' && c !== 1)) good = false;
      }
      rel++;
      ok(`${label}: $${part.trim()}$`, falseOK ? !good : good, falseOK ? 'printed false on purpose, but holds' : 'does not hold');
    }
  }
}
for (const f of PAGES) relations(f, HTML[f]);
relations('ANSWERS.md', ANSWERS);
for (const fp of FALSE_ON_PURPOSE) ok('the false-on-purpose sum is still printed: ' + fp, ALL.includes(fp));
ok('Rohan is told he is wrong', /Rohan’s answer cannot be right/.test(ALL));

/* ---- page helpers ----------------------------------------------------- */
const text = h => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&ndash;/g, '–').replace(/&hellip;/g, '…').replace(/\s+/g, ' ').trim();
const BOARD = PAGES.filter(f => /^p09\d/.test(f)).map(f => HTML[f]).join('\n');
const BEYOND = PAGES.filter(f => /^p1\d\d/.test(f)).map(f => HTML[f]).join('\n');
const ansStart = BEYOND.indexOf('c-stage__title">Answers');
const BEY_Q = BEYOND.slice(0, ansStart), KEY = BEYOND.slice(ansStart);
const keyBB = KEY.slice(0, KEY.indexOf('c-practice__sub">Beyond the Book'));
const keyBY = KEY.slice(KEY.indexOf('c-practice__sub">Beyond the Book'));
function question(src, n) {                       // the <li> of question n
  const re = n === 1 ? /<ol class="c-questions">\s*<li>/ : new RegExp(`<ol class="c-questions" data-start="${n}">\\s*<li>`);
  const m = src.match(re); if (!m) return null;
  let i = m.index + m[0].length, depth = 1, j = i;
  while (depth) { const o = src.indexOf('<li', j), c = src.indexOf('</li>', j); if (o !== -1 && o < c) { depth++; j = o + 3; } else { depth--; j = c + 5; } }
  return src.slice(i, j - 5);
}
const optionsOf = q => { const m = [...q.matchAll(/<ol class="c-parts c-parts--alpha[^"]*">(.*?)<\/ol>/g)].pop(); return m ? [...m[1].matchAll(/<li>(.*?)<\/li>/g)].map(x => x[1]) : []; };
const mathOf = s => (s.match(/\$([^$]+)\$/) || [null, s])[1];
const L = 'abcd';
const traceRow = (src, n) => { const m = src.match(new RegExp(`work__label">${n}</span>\\s*<span>(.*?)</span></div>`, 's')); return m ? m[1] : null; };
const keyLetters = (src, n) => { const m = src.match(new RegExp(`<span class="n">${n}</span> \\(([a-d])\\)`)); return m ? m[1] : null; };

/* ---- B: completeness -------------------------------------------------- */
for (let n = 1; n <= 50; n++) ok(`By the Book Q${n} is printed`, !!question(BOARD, n));
for (let n = 1; n <= 15; n++) ok(`Beyond practice Q${n} is printed`, !!question(BEY_Q, n));
for (const n of [...Array(30).keys()].map(k => k + 1).concat([36, 37, 38, 39, 40])) ok(`By the Book key row ${n}`, !!traceRow(keyBB, n));
for (const n of [31, 32, 33, 34, 35, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]) ok(`By the Book key letter ${n}`, !!keyLetters(keyBB, n));
const byList = (keyBY.match(/c-answers__list">(.*?)<\/span>\s*<\/li>/s) || [null, ''])[1].replace(/&nbsp;/g, ' ');
const byKey = {};
for (const m of byList.matchAll(/(\d+) ((?:\([a-d]\)(?:, )?)+|\d+)/g)) byKey[m[1]] = m[2].replace(/[() ]/g, '');
for (let n = 1; n <= 13; n++) ok(`Beyond key has ${n}`, n in byKey);
for (const n of [14, 15]) ok(`Beyond key row ${n}`, !!traceRow(keyBY, n));
const tabs = [...BEYOND.matchAll(/c-example__tab">Example (\d+)</g)].map(m => +m[1]);
ok('Beyond example tabs run 1-10', tabs.join() === '1,2,3,4,5,6,7,8,9,10', tabs.join());
const bodyTabs = PAGES.filter(f => /^p0[0-8]\d/.test(f)).flatMap(f => [...HTML[f].matchAll(/c-example__tab">Example (\d+)</g)].map(m => +m[1]));
ok('body example tabs run 1-8', bodyTabs.join() === '1,2,3,4,5,6,7,8', bodyTabs.join());
const examples = [...BEYOND.matchAll(/<div class="c-example"[^>]*>(.*?)<\/div><\/div><\/div><\/div>/gs)].map(m => m[1]);
ok('ten Beyond examples', examples.length === 10, String(examples.length));
const answerRow = ex => (ex.match(/work__label">Answer<\/span><span>(.*?)<\/span>/) || [null, null])[1];
examples.forEach((ex, k) => ok(`Beyond Example ${k + 1} ends in an Answer row`, !!answerRow(ex)));

/* ---- C: options ------------------------------------------------------- */
function single(label, opts, isRight, keyed) {
  const right = opts.map((o, k) => (isRight(o, k) ? L[k] : null)).filter(Boolean);
  ok(`${label}: exactly one right option`, right.length === 1, right.join(','));
  ok(`${label}: key is (${right[0]})`, right[0] === keyed, `key prints (${keyed})`);
}
function multiple(label, opts, isRight, keyed) {
  const right = opts.map((o, k) => (isRight(o, k) ? L[k] : null)).filter(Boolean).join(',');
  ok(`${label}: right options ${right}`, right === keyed, `key prints ${keyed}`);
}
const V = o => val(mathOf(o));
// By the Book objective 41-50
const bb = n => question(BOARD, n), bbKey = n => keyLetters(keyBB, n);
{ const o = optionsOf(bb(41)); const m = o.map(V).reduce((a, b) => (cmp(a, b) < 0 ? a : b)); single('BB 41 smallest unit', o, x => eq(V(x), m), bbKey(41)); }
single('BB 42', optionsOf(bb(42)), x => eq(V(x), val('3' + B + 'frac{2}{5}')), bbKey(42));
single('BB 43', optionsOf(bb(43)), x => { const v = V(x); return eq(v, F(35, 49)) && mathOf(x).includes('{5}{7}'); }, bbKey(43));
single('BB 44', optionsOf(bb(44)), x => eq(V(x), sub(F(3, 4), F(1, 6))), bbKey(44));
single('BB 45', optionsOf(bb(45)), x => eq(F(3, 8), F(12, +x)), bbKey(45));
single('BB 46', optionsOf(bb(46)), x => eq(add(F(2, 3), V(x)), F(7, 6)), bbKey(46));
single('BB 47', optionsOf(bb(47)), x => eq(F(4, 5), F(28, +x)), bbKey(47));
{ const q = bb(48); const cells = [...q.matchAll(/<td>\$([^$]+)\$<\/td>/g)].map(m => val(m[1])); const names = ['Deepa', 'Esha', 'Farah'];
  const best = names[cells.indexOf(cells.reduce((a, b) => (cmp(a, b) > 0 ? a : b)))];
  single('BB 48 longest reader', optionsOf(q), x => x === best, bbKey(48)); }
{ const st = [cmp(F(5, 6), F(4, 5)) > 0, eq(F(7, 12), F(14, 24)), cmp(F(9, 7), F(1)) < 0];
  const want = st.map((s, k) => (s ? ['(i)', '(ii)', '(iii)'][k] : null)).filter(Boolean);
  const words = { '(i) only': ['(i)'], '(i) and (ii)': ['(i)', '(ii)'], '(ii) and (iii)': ['(ii)', '(iii)'], 'all three': ['(i)', '(ii)', '(iii)'] };
  single('BB 49 statements', optionsOf(bb(49)), x => (words[x] || []).join() === want.join(), bbKey(49)); }
single('BB 50 Salma', optionsOf(bb(50)), x => cmp(F(4, 7), F(4, 9)) > 0 && /4\}\{7\}\$ is greater/.test(x), bbKey(50));
// assertion and reason 31-35: truth of A and R, and whether R explains A (the last is the writer's judgement, recorded here)
const AR = { 31: [cmp(F(3, 7), F(3, 10)) > 0, true, true], 32: [eq(add(F(2, 3), F(1, 5)), F(3, 8)), true, false],
  33: [eq(F(15, 20), F(9, 12)), 20 % 4 === 0 && 12 % 4 === 0, false], 34: [cmp(F(2), F(9, 4)) < 0 && cmp(F(9, 4), F(3)) < 0, false, false],
  35: [eq(F(24, 36), F(2, 3)) && gcd(24, 36) === 12, gcd(24, 36) === 12, true] };
for (const [n, [a, r, why]] of Object.entries(AR)) {
  const code = a && r ? (why ? 'a' : 'b') : a ? 'c' : r ? 'd' : '?';
  ok(`BB ${n} assertion-reason is (${code})`, code === bbKey(+n), `key prints (${bbKey(+n)})`);
}
ok('assertion-reason key uses all four letters', new Set([31, 32, 33, 34, 35].map(bbKey)).size === 4);
ok('objective key uses all four letters', new Set([41, 42, 43, 44, 45, 46, 47, 48, 49, 50].map(bbKey)).size === 4);
// Beyond practice
const by = n => question(BEY_Q, n);
{ const o = optionsOf(by(1)); const gap = x => sub(F(1), V(x)); const m = o.map(gap).reduce((a, b) => (cmp(a, b) < 0 ? a : b)); single('Beyond 1 closest to 1', o, x => eq(gap(x), m), byKey[1]); }
{ let c = 0; for (let k = 1; k < 12; k++) if (cmp(F(k, 12), F(1, 3)) > 0 && cmp(F(k, 12), F(3, 4)) < 0) c++; single('Beyond 2 count', optionsOf(by(2)), x => +x === c, byKey[2]); }
single('Beyond 3', optionsOf(by(3)), x => eq(V(x), add(add(F(1, 2), F(1, 6)), F(1, 12))), byKey[3]);
single('Beyond 4', optionsOf(by(4)), x => { const [n, d] = mathOf(x).match(/\d+/g).map(Number); return d - n === 3 && eq(F(n, d), F(5, 8)); }, byKey[4]);
multiple('Beyond 5', optionsOf(by(5)), x => eq(V(x), F(2, 5)), byKey[5]);
multiple('Beyond 6', optionsOf(by(6)), x => cmp(V(x), F(1, 2)) > 0 && cmp(V(x), F(2, 3)) < 0, byKey[6]);
multiple('Beyond 7', optionsOf(by(7)), x => cmp(V(x), F(1)) > 0, byKey[7]);
{ const walk = F(2, 5), bus = F(1, 3), cyc = sub(sub(F(1), walk), bus);
  const whole = n => [walk, bus, cyc].every(f => (n * f[0]) % f[1] === 0);
  const st = [cmp(walk, bus) > 0, eq(cyc, F(4, 15)), cmp(cyc, bus) < 0, whole(25)];
  multiple('Beyond 8', ['a', 'b', 'c', 'd'], (x, k) => st[k], byKey[8]); }
{ let n = 0; while (cmp(F(5 + n, 12), F(3, 4)) <= 0) n++; ok(`Beyond 9 is ${n}`, byKey[9] === String(n), byKey[9]); }
{ const d = sub(F(7, 8), F(1, 3)); ok(`Beyond 10 is ${d[0] + d[1]}`, byKey[10] === String(d[0] + d[1]), byKey[10]); }
{ const s = [2, 4, 8, 16].map(k => F(1, k)).reduce(add); const d = sub(F(1), s); ok(`Beyond 11 is ${d[1]}`, d[0] === 1 && byKey[11] === String(d[1]), byKey[11]); }
function matching(label, pairs, list2, keyed, opts) {
  const code = pairs.map(([p, v]) => `${p}–${list2.findIndex(w => eq(w, v)) + 1}`).join(', ');
  const k = opts.indexOf(code);
  ok(`${label}: ${code}`, k !== -1 && L[k] === keyed, `key prints (${keyed})`);
  ok(`${label}: options distinct`, new Set(opts).size === 4);
}
matching('Beyond 12', [['P', mul(F(5, 2), F(6))], ['Q', mul(F(17, 4), F(4))], ['R', mul(F(5, 7), F(28))], ['S', mul(F(3, 5), F(45))]],
  [F(17), F(27), F(15), F(20)], byKey[12], optionsOf(by(12)));
matching('Beyond 13', [['P', mul(F(7, 2), F(2))], ['Q', mul(F(8, 3), F(3))], ['R', mul(F(9, 4), F(4))], ['S', mul(F(11, 5), F(5))]],
  [F(9), F(11), F(7), F(8)], byKey[13], optionsOf(by(13)));
{ const k = F(1, 4), d = F(1, 3), s = F(1, 6); const left = sub(F(1), add(add(k, d), s));
  const r = traceRow(keyBY, 14);
  ok('Beyond 14 (i) Dev paints most', cmp(d, k) > 0 && cmp(d, s) > 0 && /\(i\) \(b\) Dev/.test(r));
  ok(`Beyond 14 (ii) n = ${left[1]}`, left[0] === 1 && new RegExp(`left: ${left[1]} `).test(r));
  ok('Beyond 14 (iii) 5 panels', 12 / 4 + 12 / 6 === 5 && /= 5\$ panels/.test(r)); }
{ const r = traceRow(keyBY, 15); let n = 0; while (cmp(mul(F(n), F(3, 10)), F(2)) <= 0) n++;
  let m = 1; while (!((3 * m) % 2 === 0 && m > 0)) m++;
  ok('Beyond 15 (i) 4 jumps = 1 1/5', eq(mul(F(4), F(3, 10)), F(6, 5)) && /\(i\) \(b\)/.test(r));
  ok(`Beyond 15 (ii) ${n} jumps`, /: 7 \(iii\)/.test(r) && n === 7);
  ok(`Beyond 15 (iii) ${3 * m} tenths`, 3 * m === 6 && /tenths: 6/.test(r)); }
// Beyond examples, from the page
const exA = k => text(answerRow(examples[k - 1]) || '');
{ const cap = div(F(15), sub(F(3, 4), F(3, 8))); ok(`Example 1 capacity ${str(cap)} litres`, str(cap) === '40' && exA(1) === '(c) 40 litres'); }
single('Example 2', optionsOf(examples[1]), x => cmp(V(x), F(5, 8)) > 0 && cmp(V(x), F(3, 4)) < 0, (exA(2).match(/\(([a-d])\)/) || [])[1]);
{ const opts = optionsOf(examples[2]).map(o => mathOf(o)); const right = opts.map((o, k) => { const [l, r] = o.split('='); return eq(val(l), val(r)) ? `(${L[k]})` : null; }).filter(Boolean).join(', ');
  ok(`Example 3 right: ${right}`, exA(3) === right, exA(3)); }
{ const st = [eq(F(3, 12), F(1, 4)), eq(F(8, 12), F(2, 3)), eq(F(10, 12), F(5, 6)), eq(F(6, 12), F(1, 6))];
  ok('Example 4 right: (a), (b), (c)', exA(4) === st.map((s, k) => (s ? `(${L[k]})` : null)).filter(Boolean).join(', '), exA(4)); }
{ const not = mul(F(48), sub(F(1), F(5, 8))); ok(`Example 5 is ${str(not)}`, exA(5) === str(not)); }
{ const a = 7 * (84 / 12), b = 7 * (120 / 12); ok(`Example 6 is ${a + b}`, exA(6) === String(a + b)); }
{ const o = optionsOf(examples[6]); const want = 'P–3, Q–4, R–1, S–2';
  const vals = [sub(F(5, 6), F(1, 3)), add(F(2, 3), F(1, 4)), add(F(3, 5), F(1, 10)), sub(F(7, 8), F(1, 4))];
  const list2 = [F(7, 10), F(5, 8), F(1, 2), F(11, 12)];
  const code = vals.map((v, k) => `${'PQRS'[k]}–${list2.findIndex(w => eq(w, v)) + 1}`).join(', ');
  ok(`Example 7 ${code}`, code === want && exA(7) === `(${L[o.indexOf(code)]}) ${code}`, exA(7)); }
{ const o = optionsOf(examples[7]);
  const vals = [F(17, 5), F(23, 6), F(19, 4), F(11, 3)];
  const list2 = [val('4' + B + 'frac{3}{4}'), val('3' + B + 'frac{2}{5}'), val('3' + B + 'frac{2}{3}'), val('3' + B + 'frac{5}{6}')];
  const code = vals.map((v, k) => `${'PQRS'[k]}–${list2.findIndex(w => eq(w, v)) + 1}`).join(', ');
  ok(`Example 8 ${code}`, exA(8) === `(${L[o.indexOf(code)]}) ${code}`, exA(8)); }
{ const m = 12 / 4, n = 12 / 3; ok('Example 9', exA(9) === `(i) (a) ${m}; (ii) ${12 - m - n}`, exA(9)); }
{ let meet = 0; for (let k = 0; k <= 24; k++) if (k % 3 === 0 && k % 4 === 0) meet++;
  const apart = sub(F(5, 6), F(5, 8)); ok('Example 10', eq(apart, F(5, 24)) && exA(10) === `(i) (b); (ii) ${meet}; (iii) 5`, exA(10)); }

/* ---- D: the numbers in the By the Book key ---------------------------- */
const has = (n, re) => { const r = traceRow(keyBB, n) || ''; ok(`BB key ${n} prints ${re}`, r.includes(re), text(r).slice(0, 80)); };
const mixed = f => { const w = Math.floor(f[0] / f[1]), r = f[0] % f[1]; return w ? (r ? `${w}${B}frac{${r}}{${f[1]}}` : `${w}`) : `${B}frac{${f[0]}}{${f[1]}}`; };
const frac = f => (f[1] === 1 ? `${f[0]}` : `${B}frac{${f[0]}}{${f[1]}}`);
has(1, '= ' + mixed(F(23, 6))); has(2, frac(F(30, 7))); has(3, frac(F(18, 24))); has(4, String(40 / 8 * 5));
has(5, frac(F(50, 70)).replace('5}{7', '50}{70')); has(6, frac(add(F(3, 8), F(1, 6)))); has(7, frac(sub(F(5, 6), F(3, 10))));
has(8, frac(F(6, 8))); has(9, frac(sub(F(7, 8), F(1, 4)))); has(10, mixed(sub(F(2), F(3, 4))));
has(11, frac(sub(F(7, 10), F(3, 5)))); has(13, mixed(add(F(3, 2), F(11, 4)))); has(13, mixed(sub(F(11, 4), F(3, 2))));
has(14, frac(F(28, 63)).replace('4}{9', '28}{63')); has(15, frac(sub(F(1), add(add(F(1, 3), F(1, 4)), F(1, 5)))));
has(16, frac(add(F(2, 9), F(1, 3)))); has(16, frac(sub(F(1), add(F(2, 9), F(1, 3)))));
has(17, mixed(F(11, 3))); has(17, mixed(F(17, 5))); has(18, frac(F(84, 126)));
has(20, mixed(sub(F(11, 4), F(5, 4))));
has(21, frac(sub(F(1), add(add(F(1, 3), F(1, 4)), F(1, 6))))); has(21, frac(sub(sub(F(1), add(add(F(1, 3), F(1, 4)), F(1, 6))), F(1, 6))));
has(22, mixed(add(F(2, 3), F(5, 12))));
{ const left = sub(F(5), add(F(5, 3), F(9, 4))); has(23, mixed(left)); has(23, frac(sub(F(5, 4), left))); }
{ const t = add(add(F(3, 10), F(1, 4)), F(2, 5)); has(24, frac(t)); has(24, frac(sub(F(1), t))); }
{ const s = add(F(1, 3), F(1, 4)); has(25, frac(s)); has(25, frac(sub(F(1), s))); }
has(26, mixed(F(7, 3))); has(26, frac(sub(F(7, 3), F(10, 5))) + '$ roti');
has(27, frac(sub(F(5, 12), F(3, 8))));
has(28, mixed(sub(F(11, 6), F(1, 3))));
{ const e = add(sub(F(5, 8), F(1, 4)), F(1, 2)); has(29, frac(e) + '$ full'); has(29, frac(sub(F(1), e))); }
has(30, frac(sub(sub(F(1), F(1, 2)), F(1, 4))));
has(36, frac(F(4, 16))); has(36, frac(F(8, 16))); ok('BB 36 white = red', 16 - 4 - 6 - 2 === 4);
has(37, frac(add(F(1, 2), F(1, 3)))); has(37, frac(sub(F(1), add(F(1, 2), F(1, 3)))));
has(38, mixed(add(add(F(5, 2), F(13, 4)), F(11, 4)))); ok('BB 38 Tuesday most', cmp(F(13, 4), F(11, 4)) > 0 && cmp(F(13, 4), F(5, 2)) > 0);
{ const left = sub(F(1), add(F(1, 4), F(1, 5))); has(39, frac(add(F(1, 4), F(1, 5)))); has(39, frac(left)); has(39, frac(sub(left, F(1, 2))).replace('1}{20', '1}{20')); }
has(40, mixed(sub(sub(F(10), F(7, 2)), F(14, 3))));

// ANSWERS.md carries the same keys
for (const [n, k] of Object.entries({ 31: 'a', 32: 'd', 33: 'b', 34: 'c', 35: 'a' })) ok(`ANSWERS.md ${n} (${k})`, ANSWERS.includes(`${n} (${bbKey(+n)})`) && bbKey(+n) === k);
for (let n = 41; n <= 50; n++) ok(`ANSWERS.md ${n}`, ANSWERS.includes(`${n} (${bbKey(n)})`));
for (let n = 1; n <= 13; n++) ok(`ANSWERS.md Beyond ${n}`, new RegExp(`(^|· )${n}(:)? \\(?${byKey[n].replace(/,/g, '\\), \\(').replace(/^([a-d])/, '$1')}`, 'm').test(ANSWERS) || ANSWERS.includes(`${n}: ${byKey[n]}`));

console.log(`${checks} checks (${rel} relations), ${fails} failed`);
process.exit(fails ? 1 : 0);
