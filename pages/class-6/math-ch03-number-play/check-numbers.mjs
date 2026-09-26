#!/usr/bin/env node
/* Re-derive the numbers this chapter prints.

     node pages/class-6/math-ch03-number-play/check-numbers.mjs

   Rewritten on 26 September 2026 for the maths-v2 chapter (summary page,
   By the Book in six forms, Beyond the Book by format), after the model of
   Chapter 1's. The version before it checked a layout that no longer
   exists (Beyond's "Type" heads, its old practice run of 30, its page
   numbers) and is in git history.

   A  every arithmetic identity set as maths ($…$) on every page and in
      ANSWERS.md
   B  the key is complete: By the Book 1–50, Beyond practice 1–15, every
      solved example ends in an Answer row, and the body's example tabs
      run 1, 2, 3, … in page order
   C  every objective question, single or multiple correct, and every
      matching question: the right option is computed here from the
      chapter's own rules (supercells, digit sums, palindromes, Kaprekar,
      Collatz, winning numbers) and must be the one the key names
   D  every other number the key prints for By the Book and Beyond is
      computed here and must appear in its key row; the body's worked
      examples and the new Think and Reflect answers are recomputed

   Exits 1 on any failure. */
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const B = String.fromCharCode(92);
const PAGES = readdirSync(DIR).filter(f => /^p\d{3}\.html$/.test(f)).sort();
const HTML = Object.fromEntries(PAGES.map(f => [f, readFileSync(path.join(DIR, f), 'utf8').replace(/\r\n/g, '\n')]));
const ANSWERS = readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8').replace(/\r\n/g, '\n');
let fails = 0, checks = 0;
const ok = (label, cond, detail = '') => { checks++; if (!cond) { fails++; console.log(`  x ${label}${detail ? '  ' + detail : ''}`); } };
const text = h => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&ndash;/g, '–').replace(/&#8377;/g, '₹').replace(/&rsquo;/g, '’').replace(/\s+/g, ' ').trim();

/* ---- the chapter's rules -------------------------------------------- */
const digits = n => String(n).split('').map(Number);
const digitSum = n => digits(n).reduce((a, b) => a + b, 0);
const isPal = s => { s = String(s).replace(/\D/g, ''); return s === [...s].reverse().join(''); };
const rev = n => +String(n).split('').reverse().join('');
const kap = (n, w = 4) => { const d = String(n).padStart(w, '0').split('').sort(); return +[...d].reverse().join('') - +d.join(''); };
const kapRounds = (n) => { let r = 0, x = n; while (x !== 6174) { x = kap(x); r++; if (r > 20) return -1; } return r; };
const collatzNext = n => n % 2 ? 3 * n + 1 : n / 2;
const collatz = n => { const s = [n]; while (n !== 1) { n = collatzNext(n); s.push(n); } return s; };
const steps = n => collatz(n).length - 1;
const supercells = row => row.filter((v, i) => (i === 0 || v > row[i - 1]) && (i === row.length - 1 || v > row[i + 1]));
const gridSuper = g => { const out = []; g.forEach((r, i) => r.forEach((v, j) => {
  const nb = [[i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1]].filter(([a, b]) => g[a] && g[a][b] !== undefined).map(([a, b]) => g[a][b]);
  if (nb.every(x => v > x)) out.push(v); })); return out; };
const reverseAdd = n => { const seq = []; let x = n; do { x = x + rev(x); seq.push(x); } while (!isPal(x) && seq.length < 30); return seq; };
const winning = (target, most) => { const w = []; for (let x = target; x > 0; x -= most + 1) w.unshift(x); return w; };
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const fmt = n => [String(n), n >= 10000 ? n.toLocaleString('en-IN') : null, n >= 1000 ? n.toLocaleString('en-US') : null].filter(Boolean);

/* ---- A: identities -------------------------------------------------- */
const strip = t => [['times', '*'], ['div', '/'], ['thinsp', ''], ['left', ''], ['right', '']]
  .reduce((s, [k, v]) => s.split(B + k).join(v), t).replace(/\{,\}/g, '').replace(/,/g, '').replace(/[{} ]/g, '');
const DOTS = B + 'cdots';
const identities = (label, txt) => {
  for (const m of txt.matchAll(/\$([^$]+)\$/g)) {
    if (m[1].includes(DOTS)) continue;
    const js = strip(m[1]).replace(/−/g, '-');
    if (!js.includes('=')) continue;
    // a leading "A =" names the value; the rest must agree
    const sides = js.split('=').filter(s => s !== '' && !/^[A-Z]$/.test(s))
      .map(s => s.replace(/\b0+(\d)/g, '$1'));
    if (sides.length < 2 || sides.some(s => !/^[\d+\-*/().]+$/.test(s))) continue;
    const vals = sides.map(s => Function(`return (${s})`)());
    ok(`${label}: $${m[1]}$`, vals.every(v => Math.abs(v - vals[0]) < 1e-9), vals.join(' vs '));
  }
};
for (const f of PAGES) identities(f, HTML[f]);
identities('ANSWERS.md', ANSWERS);

/* ---- B: the key is complete ----------------------------------------- */
const keyStart = PAGES.findIndex(f => HTML[f].includes('c-stage__title">Answers'));
ok('the Answers stage exists', keyStart > 0);
ok('the Answers stage opens its page', /^[\s\S]*?page__main">\s*<div class="c-stage">/.test(HTML[PAGES[keyStart]]));
const key = PAGES.slice(keyStart).map(f => HTML[f]).join('\n');
const [boardKey, beyondKey] = key.split('c-practice__sub">Beyond the Book');
const rowText = (k, n) => { const m = k.match(new RegExp(`work__label">${n}</span>\\s*<span>([\\s\\S]*?)</span></div>`)); return m ? text(m[1]) : null; };
const numbered = s => new Set([...s.matchAll(/work__label">(\d+)<|class="n">(\d+)</g)].map(m => +(m[1] || m[2])));
const board = numbered(boardKey);
for (let n = 1; n <= 50; n++) ok(`By the Book key has ${n}`, board.has(n));
const beyondList = (beyondKey.match(/c-answers__list">([\s\S]*?)<\/span>\s*<\/li>/) || [, ''])[1].replace(/&nbsp;/g, ' ');
const beyondLetters = {}; for (const m of beyondList.matchAll(/(\d+) ((?:\([a-d]\)(?:, )?)+|\d+)/g)) beyondLetters[+m[1]] = m[2].trim();
const beyond = new Set([...numbered(beyondKey), ...Object.keys(beyondLetters).map(Number)]);
for (let n = 1; n <= 15; n++) ok(`Beyond key has ${n}`, beyond.has(n));
const bridgePages = PAGES.filter(f => /^p1/.test(f)).map(f => HTML[f]).join('\n');
const practice = bridgePages.slice(0, bridgePages.indexOf('c-stage__title">Answers'));
const exBlocks = src => [...src.matchAll(/c-example__tab">Example (\d+)<([\s\S]*?)(?=c-example__tab"|c-stage__title">Answers|$)/g)];
const beyondEx = exBlocks(practice);
ok('Beyond has 10 solved examples', beyondEx.length === 10, `found ${beyondEx.length}`);
beyondEx.forEach((e, i) => { ok(`Beyond Example ${e[1]} numbered in order`, +e[1] === i + 1); ok(`Beyond Example ${e[1]} ends in an Answer row`, /work__label">Answer</.test(e[2])); });
const bodyPages = PAGES.filter(f => /^p0[0-8]/.test(f)).map(f => HTML[f]).join('\n');
const bodyEx = exBlocks(bodyPages);
bodyEx.forEach((e, i) => { ok(`body Example ${e[1]} numbered in order`, +e[1] === i + 1); ok(`body Example ${e[1]} ends in an Answer row`, /work__label">Answer</.test(e[2])); });
const answerRow = e => text((e[2].match(/work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span>/) || [, ''])[1]);

/* ---- C: objective questions, recomputed ----------------------------- */
const letter = s => 'abcd'.indexOf(s);
const L = i => '(' + 'abcd'[i] + ')';
const qChunk = (html, n) => {
  const start = n === 1 ? html.search(/<ol class="c-questions">/) : html.indexOf(`data-start="${n}"`);
  if (start < 0) return null;
  return html.slice(start, html.indexOf('</ol>\n      </div>', start));
};
const optionsOf = (chunk) => {
  const all = [...chunk.matchAll(/c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/g)];
  return all.length ? [...all.at(-1)[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => text(m[1])) : null;
};
const boardPages = PAGES.filter(f => /^p09/.test(f)).map(f => HTML[f]).join('\n');
const boardLetters = Object.fromEntries([...boardKey.matchAll(/class="n">(\d+)<\/span> \((\w)\)/g)].map(m => [+m[1], m[2]]));
const pick = (opts, pred) => opts.map((o, i) => pred(o) ? i : -1).filter(i => i >= 0);
const single = (label, opts, keyL, pred) => {
  if (!opts) return ok(`${label}: options found`, false);
  const right = pick(opts, pred);
  ok(`${label}: exactly one option is right`, right.length === 1, `right: ${right.map(L).join(', ') || 'none'}`);
  ok(`${label}: the key (${keyL}) is the right option`, right.length === 1 && letter(keyL) === right[0], `options ${opts.join(' | ')}`);
};
const num = s => +String(s).replace(/[^\d]/g, '');
// By the Book 41–50
const boardQ = n => optionsOf(qChunk(boardPages, n) || '');
const pal3 = range(100, 999).filter(isPal);
single('BtB Q41', boardQ(41), boardLetters[41], o => num(o) === digitSum(70809));
single('BtB Q42', boardQ(42), boardLetters[42], o => pal3.filter(p => digitSum(p) === 7 && digits(p)[1] === 3).includes(num(o)));
single('BtB Q43', boardQ(43), boardLetters[43], o => num(o) === Math.max(...range(1000, 9999).filter(p => isPal(p) && digitSum(p) === 10)));
single('BtB Q44', boardQ(44), boardLetters[44], o => num(o) === kap(3522));
single('BtB Q45', boardQ(45), boardLetters[45], o => num(o) === collatz(9)[collatz(9).indexOf(28) + 1]);
single('BtB Q46', boardQ(46), boardLetters[46], o => num(o) === 600 - (650 - 600));
single('BtB Q47', boardQ(47), boardLetters[47], o => num(o) === [38, 42, 29].reduce((a, b) => a + Math.round(b / 10) * 10, 0));
{ // Q48: which statements must be true
  const s1 = range(10, 99).filter(isPal).every(p => digitSum(p) % 2 === 0);
  const s2 = range(1000, 9999).every(a => a - 1000 < 1000 || true) && (1000 - 999 >= 1000); // 1000 - 999 = 1 already fails
  const s3 = pal3.every(p => p % 2 === 1);
  const truth = [s1, s2, s3];
  const want = ['(i) only', '(i) and (ii)', '(ii) and (iii)', 'all three'];
  const which = want.findIndex(w => { const has = [/\(i\)(?! and \(ii\))/.test(w) || w === 'all three' || w.startsWith('(i) and'), w.includes('(ii)') || w === 'all three', w.includes('(iii)') || w === 'all three']; return has.every((h, i) => h === truth[i]); });
  single('BtB Q48', boardQ(48), boardLetters[48], o => o === want[which]);
}
single('BtB Q49', boardQ(49), boardLetters[49], o => o.includes(`${999 + 999}`) && 999 + 999 >= 1000);
single('BtB Q50', boardQ(50), boardLetters[50], o => num(o) === 9 - 4 - 1);
// assertion and reason: A, R, and whether R explains A (the last is a judgement, recorded here)
const AR = {
  31: [supercells([5, 9, 2]).includes(9), true, true],
  32: [range(1000, 9999).every(n => kapRounds(n) >= 0), kap(6174) === 6174, false],
  33: [isPal(4554), digitSum(4554) === 18, false],
  34: [steps(16) === 4, range(1, 99).filter(n => n % 2).every(n => collatzNext(n) % 2 === 1), false],
  35: [Math.max(...pal3.concat(range(100, 999)).filter(n => digitSum(n) === 5)) === 500, true, true],
};
for (const [q, [a, r, ex]] of Object.entries(AR)) {
  const code = a && r ? (ex ? 'a' : 'b') : a ? 'c' : r ? 'd' : '?';
  ok(`BtB Q${q} (assertion and reason): key is (${code})`, boardLetters[q] === code, `key says (${boardLetters[q]})`);
}
// Beyond single correct 1–4
const bq = n => optionsOf(qChunk(practice, n) || '');
single('Beyond Q1', bq(1), beyondLetters[1]?.[1], o => num(o) === Math.max(...range(10000, 99999).filter(p => isPal(p) && digitSum(p) === 20)));
single('Beyond Q2', bq(2), beyondLetters[2]?.[1], o => num(o) === range(100, 999).filter(n => digitSum(n) === 3).length);
single('Beyond Q3', bq(3), beyondLetters[3]?.[1], o => steps(num(o)) === 7);
const make = (n, parts) => { const ok2 = new Set([0]); for (let x = 1; x <= n; x++) if (parts.some(p => x >= p && ok2.has(x - p))) ok2.add(x); return ok2.has(n); };
single('Beyond Q4', bq(4), beyondLetters[4]?.[1], o => make(num(o), [700, 300]));
// more than one correct 5–8
const multi = (label, opts, keyStr, pred) => {
  if (!opts) return ok(`${label}: options found`, false);
  const right = pick(opts, pred).map(L).join(', ');
  ok(`${label}: the key names exactly the right options`, right === keyStr, `computed ${right}, key ${keyStr}`);
};
multi('Beyond Q5', bq(5), beyondLetters[5], o => supercells([31, 58, 44, 72, 16, 29]).includes(num(o)));
multi('Beyond Q6', bq(6), beyondLetters[6], o => kap(num(o)) === 6174);
multi('Beyond Q7', bq(7), beyondLetters[7], o => isPal(o));
{ const lens = new Set(); for (const a of [100, 999]) for (const b of [10, 99]) lens.add(String(a + b).length);
  multi('Beyond Q8', bq(8), beyondLetters[8], o => lens.has(num(o))); }
// numerical 9–11
const smallestDistinct = range(1000, 9999).find(n => new Set(String(n)).size === 4 && digitSum(n) === 10);
ok('Beyond Q9: 1027', +beyondLetters[9] === smallestDistinct, `key ${beyondLetters[9]}, computed ${smallestDistinct}`);
const gap = (1650 - 1450) / (6 - 2);
ok('Beyond Q10: 1850', +beyondLetters[10] === 1650 + 4 * gap);
ok('Beyond Q11: 2', +beyondLetters[11] === winning(50, 5)[0]);
// matching 12–13: compute what each of P, Q, R, S is, then read it off List II
const matching = (label, chunk, values, keyL) => {
  const table = (chunk.match(/<table>[\s\S]*?<\/table>/) || [''])[0];
  const list2 = Object.fromEntries([...table.matchAll(/<td>\((\d)\) ([\d,]+)<\/td>/g)].map(m => [num(m[2]), +m[1]]));
  const code = ['P', 'Q', 'R', 'S'].map((p, i) => `${p}–${list2[values[i]]}`).join(', ');
  const opts = optionsOf(chunk);
  const i = opts ? opts.indexOf(code) : -1;
  ok(`${label}: ${code} is option ${L(i)}, and the key says ${keyL}`, i >= 0 && L(i) === keyL);
};
matching('Beyond Q12', qChunk(practice, 12), [digitSum(99999), range(10, 99).filter(isPal).length, kap(7110), collatzNext(15)], beyondLetters[12]);
matching('Beyond Q13', qChunk(practice, 13), [range(10000, 99999).find(n => digitSum(n) === 2), Math.max(...range(100, 999).filter(n => new Set(String(n)).size === 3)), Math.max(...pal3), range(1000, 1100).find(isPal)], beyondLetters[13]);
// paragraph-based practice 14–15
{ const s = collatz(24), firstOdd = s.find(n => n % 2);
  const opts = optionsOf(qChunk(practice, 14).split('c-parts c-parts--1')[1]);
  const r14 = rowText(beyondKey, 14) || '';
  ok(`Beyond Q14(i): first odd number ${firstOdd} is (c)`, opts && opts[2] === String(firstOdd) && r14.includes('(c) 3'));
  ok(`Beyond Q14(ii), (iii): ${steps(24)} steps, largest after 24 is ${Math.max(...s.slice(1))}`, r14.includes(`(ii) ${steps(24)}`) && r14.includes(`(iii) ${Math.max(...s.slice(1))}`)); }
{ const est = [38, 42, 57].reduce((a, b) => a + Math.round(b / 10) * 10, 0), exact = 38 + 42 + 57;
  const opts = optionsOf(qChunk(practice, 15).split('c-parts c-parts--1')[1]);
  const r15 = rowText(beyondKey, 15) || '';
  ok(`Beyond Q15: ${est} kg is (b), ${exact} kg, ₹${exact * 12}`, opts && opts[1] === `${est} kg` && r15.includes(`${exact * 12}`) && r15.includes(`${exact}`)); }

/* ---- D: the other numbers ------------------------------------------- */
const has = (label, row, ...vals) => ok(label, !!row && vals.every(v => fmt(v).some(s => row.includes(s))), row ? `row: ${row.slice(0, 90)}` : 'row missing');
const r = n => rowText(boardKey, n);
has('BtB 1 supercells', r(1), ...supercells([42, 57, 31, 68, 90, 74]));
{ const pals = range(1000, 9999).filter(isPal); const i = pals.indexOf(5995); has('BtB 2 neighbours of 5995', r(2), pals[i - 1], pals[i + 1]); }
has('BtB 3 one Kaprekar round', r(3), 9542, 2459, kap(5294));
has('BtB 4 Collatz from 11', r(4), steps(11));
{ const n = range(10, 99).find(x => digitSum(x) === 11 && digits(x)[0] - digits(x)[1] === 3); has('BtB 5', r(5), n); }
has('BtB 6 digits 1 to 30', r(6), range(1, 30).join('').length);
has('BtB 7', r(7), 400 + 300 + 600, 412 + 289 + 596);
has('BtB 8', r(8), 9876, digitSum(9876));
has('BtB 9', r(9), 97310, 10379);
has('BtB 10', r(10), 4275 + 25, 4275 + 50);
{ const s = reverseAdd(68); has('BtB 11', r(11), s.length, s.at(-1)); }
has('BtB 12', r(12), ...supercells([15, 22, 18, 30, 25, 12]));
ok('BtB 12: 26 in place of 12 gives 3 supercells', supercells([15, 22, 18, 30, 25, 26]).length === 3);
has('BtB 13', r(13), Math.ceil(11 / 2));
{ const f4 = range(1000, 9999).filter(n => digitSum(n) === 20); has('BtB 14', r(14), f4[0], f4.at(-1)); }
has('BtB 15', r(15), 1000 - 999, 9999 - 100);
has('BtB 16', r(16), 50 * 20, 48 * 21);
{ const before = t => range(1, 100).filter(n => collatzNext(n) === t); ok('BtB 17: before 10 are 3 and 20, before 3 only 6', JSON.stringify(before(10)) === '[3,20]' && JSON.stringify(before(3)) === '[6]'); }
has('BtB 18', r(18), kapRounds(3087));
has('BtB 19', r(19), ...winning(20, 3));
ok('BtB 19: 20 is a multiple of 4, so the second player wins', winning(20, 3)[0] === 4);
{ const ns = [247, 274, 427, 472, 724, 742]; has('BtB 20', r(20), ...ns, Math.max(...ns) + Math.min(...ns)); }
{ const g = [[12, 45, 30], [51, 18, 62], [27, 70, 39]]; const sc = gridSuper(g);
  let c = 19; while (!gridSuper([[12, 45, 30], [51, c, 62], [27, 70, 39]]).includes(c)) c++;
  has('BtB 21', r(21), ...sc, c); ok('BtB 21: then 1 supercell', gridSuper([[12, 45, 30], [51, c, 62], [27, 70, 39]]).length === 1); }
has('BtB 22', r(22), kapRounds(2019));
{ const codes = range(90009, 99999).filter(n => isPal(n) && digitSum(n) === 25 && digits(n)[2] % 2 === 1 && String(n)[0] === '9');
  has('BtB 23', r(23), ...codes); ok('BtB 23: four codes', codes.length === 4); }
ok('BtB 24: 125 is not a multiple of 50', 125 % 50 !== 0 && [5000, 2000, 300, 50].every(x => x % 50 === 0));
has('BtB 25', r(25), 187 + 212 + 196 + 318, 1200 - (187 + 212 + 196 + 318));
has('BtB 26', r(26), steps(15), Math.max(...collatz(15)), steps(30), steps(60));
has('BtB 27', r(27), ...winning(25, 4), winning(27, 4)[0]);
{ const d = n => range(1, n).join('').length; let p = 1; while (d(p) < 492) p++; has('BtB 28', r(28), d(150), p); ok('BtB 28: 492 digits is exactly 200 pages', d(200) === 492); }
has('BtB 29', r(29), 36800, 37200);
ok('BtB 29: the marks', 36500 + 3 * 100 === 36800 && 36500 + 7 * 100 === 37200 && 37150 > 37100 && 37150 < 37200);
has('BtB 30', r(30), 15 * 40 + 12 * 25, 12 * 25);
{ const h = [1240, 1510, 980, 1730, 1655, 2010, 1120]; const peaks = h2 => supercells(h2).map(v => h2.indexOf(v) + 1);
  ok('BtB 36: peaks 2, 4, 6, then 4, 6', peaks(h).join() === '2,4,6' && peaks([1240, 1510, 1600, 1730, 1655, 2010, 1120]).join() === '4,6');
  has('BtB 36 (ii)', r(36), Math.max(...h) - Math.min(...h)); }
{ const lucky = range(1000, 1100).filter(n => digitSum(n) === 10); has('BtB 37', r(37), range(1000, 9999).find(n => digitSum(n) === 10), lucky.length); ok('BtB 37: 3421 is lucky', digitSum(3421) === 10); }
{ const t = 118 + 96 + 104 + 89; has('BtB 38', r(38), [118, 96, 104, 89].reduce((a, b) => a + Math.round(b / 10) * 10, 0), t, Math.ceil(t / 24)); }
{ const s = reverseAdd(87); has('BtB 39', r(39), s[0], s.length, s.at(-1)); }
{ let x = 2025, seq = []; while (x !== 6174) { x = kap(x); seq.push(x); } has('BtB 40', r(40), 5220, kap(2025), seq.length); }
// Beyond solved examples, from their Answer rows
const ans = n => answerRow(beyondEx[n - 1]);
{ const mx = +'8520', mn = +'2058'; ok('Beyond Ex 1: 6462 is (b)', ans(1).includes(`(b) ${mx - mn}`)); }
{ const p = pal3.filter(n => digitSum(n) === 17 && digits(n)[1] === digits(n)[0] + 2); ok(`Beyond Ex 2: only ${p}`, p.length === 1 && ans(2).includes(`(a) ${p[0]}`)); }
{ const s = [range(1, 99).filter(n => n % 2).every(n => collatzNext(n) % 2 === 0), range(2, 98).filter(n => n % 2 === 0).every(n => collatzNext(n) % 2 === 1), collatz(12)[2] === 3, collatz(5)[1] === 16];
  ok('Beyond Ex 3: (a), (c), (d)', s.map((v, i) => v ? L(i) : '').filter(Boolean).join(', ') === ans(3)); }
{ const ds = range(100, 999).map(digitSum); const s = [Math.max(...ds) === 27, ds.includes(1), ds.includes(28), new Set(ds).size < ds.length];
  ok('Beyond Ex 4: (a), (b), (d)', s.map((v, i) => v ? L(i) : '').filter(Boolean).join(', ') === ans(4)); }
ok('Beyond Ex 5: 5 palindromes', +ans(5) === pal3.filter(n => digitSum(n) === 12).length);
ok('Beyond Ex 6: 245', +ans(6) === 125 + 4 * (305 - 125) / 6);
matching('Beyond Ex 7', beyondEx[6][2], [digitSum(8097), +String(3021).split('').reverse().join(''), range(1000, 9999).find(isPal), Math.max(...range(100, 999).filter(n => digitSum(n) === 4))], ans(7).slice(0, 3));
matching('Beyond Ex 8', beyondEx[7][2], [collatzNext(18), collatzNext(9), kap(2111), kap(5553)], ans(8).slice(0, 3));
{ const h = [6, 9, 4, 7, 12, 5, 8, 3]; const isSuperAt = (row, i) => (i === 0 || row[i] > row[i - 1]) && (i === row.length - 1 || row[i] > row[i + 1]);
  let add = 1; while (!isSuperAt([6, 9, 4, 7 + add, 12, 5, 8, 3], 3)) add++;
  const after = supercells([6, 9, 4, 7 + add, 12, 5, 8, 3]).length;
  ok(`Beyond Ex 9: ${supercells(h).length}, ${add}, ${after}`, ans(9) === `(i) (b) ${supercells(h).length}; (ii) ${add}; (iii) ${after}`); }
{ const a = reverseAdd(39), b = reverseAdd(93); ok(`Beyond Ex 10: ${a[0]}, ${a.length}, ${b.length}`, ans(10) === `(i) (a) ${a[0]}; (ii) ${a.length}; (iii) ${b.length}`); }
// the body's worked examples
const bans = n => answerRow(bodyEx[n - 1]);
ok('body Ex 1: supercells 35, 41, 39', supercells([18, 35, 27, 41, 12, 39]).join() === '35,41,39' && bans(1).includes('35, 41 and 39'));
ok('body Ex 2: 7060 and 7150', 7080 - 2 * (7120 - 7080) / 4 === 7060 && 7120 + 3 * 10 === 7150 && bans(2).includes('7060') && bans(2).includes('7150'));
ok('body Ex 3: 15 and 21', digitSum(40506) === 15 && digitSum(3981) === 21 && bans(3).startsWith('3981'));
ok('body Ex 4: 34, 29 in one step; 48, 76 in two', [34, 29].every(n => reverseAdd(n).length === 1) && [48, 76].every(n => reverseAdd(n).length === 2));
ok('body Ex 5: 6382 in 3 rounds', kapRounds(6382) === 3 && bans(5).includes('3 rounds'));
ok('body Ex 6: 5:15, 11:11, 9:59 but not 12:12', ['5:15', '11:11', '9:59'].every(isPal) && !isPal('12:12'));
ok('body Ex 7: 3 or 4 digits', String(1000 - 99).length === 3 && String(9999 - 10).length === 4);
ok('body Ex 8: about 500', 32 + 29 + 35 === 96 && 5 * 100 === 500);
ok('body Ex 9: 1, 4, 7, 10', winning(10, 2).join() === '1,4,7,10' && bans(9).includes('1, 4, 7 and 10'));
// the Think and Reflect answers written for this conversion, and a few older ones
ok('3.2 Think and Reflect: 80, then 79, 70, 34', (() => { let x = 76; while (!supercells([43, 79, x, 63, 10, 29, 28, 34]).includes(x)) x++; return x === 80; })()
  && supercells([43, 79, 75, 63, 70, 29, 28, 34]).join() === '79,70,34');
{ const nums = [1500, 3600, 9950, 9590, 1050, 3050, 5030, 5300, 8400, 2180, 2754].sort((a, b) => a - b);
  const gaps = nums.slice(1).map((v, i) => [v - nums[i], nums[i], v]).sort((a, b) => a[0] - b[0]);
  ok('3.3 Think and Reflect: 5030 and 5300 closest', gaps[0][1] === 5030 && gaps[0][2] === 5300 && ANSWERS.includes('**5030 and 5300**')); }
ok('3.6 Think and Reflect: 1000 takes 5 rounds; 2836 as 6382', kapRounds(1000) === 5 && kapRounds(2836) === kapRounds(6382));
ok('Exercise Set 3.5 Q4: 5683 takes 7 rounds', kapRounds(5683) === 7);
ok('Exercise Set 3.9 Q2: 2014 takes 7 rounds, 2013 takes 3', kapRounds(2014) === 7 && kapRounds(2013) === 3);
ok('Exercise Set 3.9 Q9: 100 takes 25 steps', steps(100) === 25);
{ const odd5 = range(35000, 75000).filter(n => digits(n).every(d => d % 2));
  ok('Exercise Set 3.9 Q3: 73,999, 35,111, 51,111', Math.max(...odd5) === 73999 && Math.min(...odd5) === 35111
    && odd5.reduce((b, n) => Math.abs(n - 50000) < Math.abs(b - 50000) ? n : b) === 51111); }
ok('Exercise Set 3.9 Q10: first player says 2 for 22', winning(22, 3)[0] === 2);
ok('Exercise Set 3.9 Q1: swapping 6 and 1 gives 4 supercells', gridSuper([[16200, 39344, 29765], [23609, 12876, 45306], [19381, 50319, 38408]]).length === 4);
ok('Exercise Set 3.2 Q1: 6828, 9435, 8000', supercells([6828, 670, 9435, 3780, 3708, 7308, 8000, 5583, 52]).join() === '6828,9435,8000');
ok('Stage 1: 5 and 32 take 5 steps; 9 takes 19', range(1, 100).filter(n => steps(n) === 5).join() === '5,32' && steps(9) === 19);

console.log(`${checks} checks, ${fails} failed`);
process.exit(fails ? 1 : 0);
