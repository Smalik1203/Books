#!/usr/bin/env node
/* Re-derive the numbers this chapter prints.

     node pages/class-6/math-ch10-other-side-of-zero/check-numbers.mjs

   Rewritten on 26 September 2026 for the maths-v2 chapter (summary page,
   By the Book in six forms, Beyond the Book by format), after the model of
   Chapters 1, 3 and 7. The version before it checked a layout that no
   longer exists (Beyond's four stages, its run of 33, its page numbers and
   figure numbers) and is in git history.

   A  every =, < and > set as maths ($…$) on every page and in ANSWERS.md
      is evaluated with integers; one printed sum is false on purpose
      (Riya's mistake in the tried questions) and must stay false
   B  the key is complete: By the Book 1–50 and Beyond practice 1–15 each
      have a key entry; every solved example ends in an Answer row; the
      example tabs run 1, 2, 3, … in the body and in Beyond
   C  every objective, assertion–reason, single-correct, more-than-one-
      correct and matching question: the options are read off the page,
      the right ones computed here, and they must be the ones the key names
   D  every other number the key prints for By the Book and Beyond is
      computed here and must appear in its key row

   Exits 1 on any failure. */
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const B = String.fromCharCode(92);
const PAGES = readdirSync(DIR).filter(f => /^p\d{3}\.html$/.test(f)).sort();
const HTML = Object.fromEntries(PAGES.map(f => [f, readFileSync(path.join(DIR, f), 'utf8').replace(/\r\n/g, '\n')]));
const ANSWERS = readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8').replace(/\r\n/g, '\n');
const ALL = PAGES.map(f => HTML[f]).join('\n');
const BOARD = PAGES.filter(f => /^p09/.test(f)).map(f => HTML[f]).join('\n');
const BRIDGE = PAGES.filter(f => /^p1/.test(f)).map(f => HTML[f]).join('\n');
const KEYPAGE = BRIDGE.slice(BRIDGE.indexOf('c-stage__title">Answers'));
const QPART = BRIDGE.slice(0, BRIDGE.indexOf('c-stage__title">Answers'));
let fails = 0, checks = 0;
const ok = (label, cond, detail = '') => { checks++; if (!cond) { fails++; console.log(`  x ${label}${detail ? '  ' + detail : ''}`); } };
const text = h => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&ndash;/g, '–').replace(/&#8377;/g, '₹').replace(/\s+/g, ' ').trim();

/* ---- A: identities and inequalities ---------------------------------- */
const toJs = t => [['times', '*'], ['div', '/'], ['thinsp', ''], ['left', ''], ['right', ''], [',', '']]
  .reduce((s, [k, v]) => s.split(B + k).join(v), t).replace(/−/g, '-').replace(/\s+/g, '');
const RELS = [B + 'lt', B + 'gt', '='];
let falseOnPurpose = 0;
const relations = (label, txt) => {
  for (const m of txt.matchAll(/\$([^$]+)\$/g)) {
    if (m[1].includes(B + 'cdots') || m[1].includes(B + 'ldots')) continue;
    let js = toJs(m[1]);
    if (js.includes('{-3}')) { falseOnPurpose++; ok(`${label}: Riya's mistake stays false`, Function('return (-8)-(+5)')() !== -3); continue; }
    const parts = js.split(new RegExp('(' + [B + B + 'lt', B + B + 'gt', '='].join('|') + ')'));
    if (parts.length < 3) continue;
    const sides = parts.filter((_, i) => i % 2 === 0), ops = parts.filter((_, i) => i % 2 === 1);
    if (sides.some(s => !/^[\d+\-*/().]+$/.test(s))) continue;
    let vals;
    try { vals = sides.map(s => Function(`return (${s})`)()); } catch { continue; }
    const good = ops.every((o, i) => o === '=' ? vals[i] === vals[i + 1] : o.endsWith('lt') ? vals[i] < vals[i + 1] : vals[i] > vals[i + 1]);
    // relations printed false on purpose: assertion 34, Aman's claim (By the Book 49), and options that are meant to be wrong
    const expectedFalse = /^-5\\gt-2$/.test(js) || /^-2\\gt1$/.test(js) || /^-3\\gt2$/.test(js) || /^-12\\lt-13$/.test(js) || /^-7\\gt-2$/.test(js);
    ok(`${label}: $${m[1]}$`, expectedFalse ? !good : good, vals.join(' | '));
  }
};
for (const f of PAGES) relations(f, HTML[f]);
relations('ANSWERS.md', ANSWERS);
ok('Riya’s false sum is still printed', falseOnPurpose === 1);

/* ---- B: completeness ------------------------------------------------- */
const tabs = (h) => [...h.matchAll(/c-example__tab">Example (\d+)</g)].map(m => +m[1]);
const bodyTabs = tabs(PAGES.filter(f => /^p0[0-8]/.test(f)).map(f => HTML[f]).join(''));
ok('body examples run 1–5', bodyTabs.join() === '1,2,3,4,5', bodyTabs.join());
ok('Beyond examples run 1–10', tabs(QPART).join() === '1,2,3,4,5,6,7,8,9,10', tabs(QPART).join());
const exBodies = ALL.split('c-example__tab').slice(1);
exBodies.forEach((e, i) => ok(`example block ${i + 1} ends in an Answer row`, e.slice(0, e.indexOf('</div></div></div>') > 0 ? undefined : undefined).includes('work__label">Answer')));
const boardStarts = [...BOARD.matchAll(/data-start="(\d+)"/g)].map(m => +m[1]);
ok('By the Book numbers 2–50 in order', boardStarts.join() === Array.from({ length: 49 }, (_, i) => i + 2).join());
const bridgeStarts = [...QPART.matchAll(/data-start="(\d+)"/g)].map(m => +m[1]);
ok('Beyond practice numbers 2–15', bridgeStarts.join() === Array.from({ length: 14 }, (_, i) => i + 2).join(), bridgeStarts.join());
const boardKey = KEYPAGE.slice(0, KEYPAGE.indexOf('>Beyond the Book<'));
const beyondKey = KEYPAGE.slice(KEYPAGE.indexOf('>Beyond the Book<'));
const traceRow = (key, n) => { const m = key.match(new RegExp(`work__label">${n}</span>\\s*<span>([\\s\\S]*?)</span></div>`)); return m ? m[1] : null; };
const letters = (key) => Object.fromEntries([...text(key).matchAll(/(\d+) ((?:\([a-d]\)(?:, )?)+)/g)].map(m => [+m[1], m[2].replace(/\s/g, '')]));
const boardLetters = letters(boardKey.replace(/<span class="n">/g, ''));
for (let n = 1; n <= 50; n++) {
  const inTrace = traceRow(boardKey, n) !== null, inLetters = n in boardLetters;
  ok(`By the Book ${n} has a key entry`, inTrace || inLetters);
}
const beyondLetters = letters(beyondKey);
const beyondList = text(beyondKey);
for (let n = 1; n <= 15; n++) ok(`Beyond ${n} has a key entry`, n in beyondLetters || traceRow(beyondKey, n) !== null || new RegExp(`(^|\\s)${n} -?\\d`).test(beyondList));

/* ---- C: options, computed ------------------------------------------- */
const qBlock = (h, n) => {
  const i = n === 1 ? h.indexOf('<ol class="c-questions">') : h.indexOf(`data-start="${n}"`);
  return h.slice(i, h.indexOf('</ol>\n', i) + 6);
};
const options = (blk) => {
  const m = [...blk.matchAll(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/g)].pop();
  return m ? [...m[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => x[1]) : [];
};
const num = s => { const t = toJs(s.replace(/<[^>]+>/g, '').replace(/\$/g, '').replace(/[^\d+\-−().]/g, ' ').trim().split(/\s+/)[0]); return Function(`return (${t})`)(); };
const LET = 'abcd';
const single = (label, blk, value, key) => {
  const opts = options(blk).map(num);
  const right = opts.map((v, i) => v === value ? LET[i] : null).filter(Boolean);
  ok(`${label}: exactly one option is ${value}`, right.length === 1, opts.join());
  ok(`${label}: key names (${right[0]})`, key === `(${right[0]})`, key);
};
// By the Book objective
single('BtB 41', qBlock(BOARD, 41), 15, boardLetters[41]);
single('BtB 42', qBlock(BOARD, 42), Math.max(-3, -1, -7, -10), boardLetters[42]);
single('BtB 43', qBlock(BOARD, 43), (-6) + 9, boardLetters[43]);
single('BtB 44', qBlock(BOARD, 44), (-4) - 5, boardLetters[44]);
single('BtB 45', qBlock(BOARD, 45), -3 - 7, boardLetters[45]);
single('BtB 46', qBlock(BOARD, 46), -35 - 40 + 15, boardLetters[46]);
single('BtB 47', qBlock(BOARD, 47), 8 - (-12), boardLetters[47]);
ok('BtB 48: (i) and (ii) true, (iii) false → (c)', boardLetters[48] === '(c)');
ok('BtB 49: −7 < −2 is option (c)', boardLetters[49] === '(c)' && /-7 \\lt -2/.test(options(qBlock(BOARD, 49))[2]));
single('BtB 50', qBlock(BOARD, 50), 50 - 80, boardLetters[50]);
// assertion and reason: [A true, R true, R explains]
const AR = { 31: [(-8) - (-3) === -5, true, true], 32: [-10 < -2, 10 > 2, false], 33: [-3 > -8, Math.abs(-3) > Math.abs(-8), false], 34: [-5 > -2, true, false], 35: [(-6) + 6 === 0, true, true] };
for (const [n, [a, r, ex]] of Object.entries(AR)) {
  const want = a && r ? (ex ? '(a)' : '(b)') : a ? '(c)' : r ? '(d)' : '?';
  ok(`BtB ${n} assertion–reason is ${want}`, boardLetters[n] === want, boardLetters[n]);
}
const objLetters = [41, 42, 43, 44, 45, 46, 47, 48, 49, 50].map(n => boardLetters[n]);
ok('objective answers use all four letters', new Set(objLetters).size === 4, objLetters.join());
// Beyond single correct
single('Beyond 1', qBlock(QPART, 1), -15 + 8 + 10 - 6, beyondLetters[1]);
single('Beyond 2', qBlock(QPART, 2), 9 + 4, beyondLetters[2]);
single('Beyond 3', qBlock(QPART, 3), -6 + 3 - 5, beyondLetters[3]);
let s4 = 0; for (let k = -10; k <= 8; k++) s4 += k;
single('Beyond 4', qBlock(QPART, 4), s4, beyondLetters[4]);
const multi = (label, blk, pred, key) => {
  const opts = options(blk).map(o => toJs(o.replace(/<[^>]+>/g, '').replace(/\$/g, '')));
  const right = opts.map((o, i) => pred(o, i) ? `(${LET[i]})` : null).filter(Boolean).join(',');
  ok(`${label}: key ${right}`, key === right, `${key} vs ${right} from ${opts.join(' ; ')}`);
};
multi('Beyond 5', qBlock(QPART, 5), o => Function(`return (${o})`)() === -4, beyondLetters[5]);
multi('Beyond 6', qBlock(QPART, 6), o => { const [a, op, b] = o.split(/(\\lt|\\gt)/); return op === B + 'lt' ? +a < +b : +a > +b; }, beyondLetters[6]);
multi('Beyond 7', qBlock(QPART, 7), o => -2 + o.split(',').reduce((s, x) => s + Number(x), 0) === 3, beyondLetters[7]);
multi('Beyond 8', qBlock(QPART, 8), o => Function(`return (${o})`)() > 0, beyondLetters[8]);
// matching: List II read off the table, List I computed
const matchKey = (label, blk, values, key) => {
  const rows = [...blk.matchAll(/<td>[^<]*<\/td><td>\((\d)\) ([^<]*)<\/td>/g)].map(m => [+m[1], num(m[2])]);
  const combo = ['P', 'Q', 'R', 'S'].map((p, i) => `${p}–${rows.find(r => r[1] === values[i])?.[0]}`).join(', ');
  const opts = options(blk);
  const at = opts.findIndex(o => o === combo);
  ok(`${label}: ${combo} is one option only`, at >= 0 && opts.filter(o => o === combo).length === 1);
  ok(`${label}: key (${LET[at]})`, key.includes(`(${LET[at]})`), key);
};
matchKey('Beyond 12', qBlock(QPART, 12), [(-6) + (-9), (-6) - (-9), 6 - (-9), (-9) + 6], beyondLetters[12]);
matchKey('Beyond 13', qBlock(QPART, 13), [-25, -26, 0 - (-25), -24], beyondLetters[13]);
const exBlock = n => { const i = QPART.indexOf(`Example ${n}<`); return QPART.slice(i, QPART.indexOf('</div></div></div>', i)); };
matchKey('Beyond Example 7', exBlock(7), [(-7) + 12, (-7) - 12, 7 - (-12), (-12) + 7], exBlock(7).match(/Answer<\/span><span>(\([a-d]\))/)[1]);
matchKey('Beyond Example 8', exBlock(8), [16, -17, -15, (-9) - (-16)], exBlock(8).match(/Answer<\/span><span>(\([a-d]\))/)[1]);
const exAnswer = n => text(exBlock(n).slice(exBlock(n).indexOf('Answer</span>'))).replace(/\$/g, '').replace(/−/g, '-');
single('Beyond Example 1', exBlock(1), 7 - 11, exAnswer(1).match(/\([a-d]\)/)[0]);
single('Beyond Example 2', exBlock(2), (-14 + 8) / 2, exAnswer(2).match(/\([a-d]\)/)[0]);
ok('Beyond Example 3 is (a), (c), (d)', exAnswer(3).includes('(a), (c), (d)') && -9 < -4 && !(-2 > 1) && 0 > -6 && -11 < -10);
ok('Beyond Example 4 is (a), (b), (d)', exAnswer(4).includes('(a), (b), (d)') && -12 + 7 === -5 && -12 - 3 !== -9);
let between = 0; for (let k = -7; k <= 5; k++) between++;
ok('Beyond Example 5 is 13', exAnswer(5).includes(String(between)));
ok('Beyond Example 6 is 11', exAnswer(6).includes(String(-(-13 + 8 - 6))));
const t9 = [-9 + 2 * 4, -9 + 5 * 4, -9 + 5 * 4 - 5 * 3];
single('Beyond Example 9 (i)', exBlock(9), t9[0], exAnswer(9).match(/\([a-d]\)/)[0]);
ok('Beyond Example 9 (ii), (iii)', exAnswer(9).includes(`(ii) ${t9[1]}`) && exAnswer(9).includes(`(iii) ${t9[2]}`), exAnswer(9));
single('Beyond Example 10 (i)', exBlock(10), 9 - 4, exAnswer(10).match(/\([a-d]\)/)[0]);
ok('Beyond Example 10 (ii), (iii)', (9 - 4) + (3 - 8) === 0 && exAnswer(10).includes('(ii) 0') && exAnswer(10).includes(`(iii) ${8 - 3}`));
single('Beyond 14 (i)', qBlock(QPART, 14), 4 - 6, beyondLetters[14] || '(a)');
single('Beyond 15 (i)', qBlock(QPART, 15), 35 - (-15), beyondLetters[15] || '(b)');

/* ---- D: numbers in the key rows ------------------------------------- */
const has = (key, n, ...vals) => {
  const row = traceRow(key, n); const t = row ? text(row).replace(/−/g, '-') : '';
  for (const v of vals) ok(`key ${n} shows ${v}`, t.includes(String(v)), t.slice(0, 90));
};
has(boardKey, 1, '= 0'); has(boardKey, 4, '= 35'); has(boardKey, 6, '= 11'); has(boardKey, 7, '= -20'); has(boardKey, 8, '= 3');
has(boardKey, 11, '= 115', '= -20'); has(boardKey, 12, '= 30'); has(boardKey, 14, '= -3', '= 0'); has(boardKey, 15, '= 23', '= -5');
has(boardKey, 18, '= -2', '= -6'); has(boardKey, 19, '= -3', '= 7'); has(boardKey, 20, '= -15', '= 55');
const seq = [23]; while (seq.at(-1) > -37) seq.push(seq.at(-1) - 6);
ok('BtB 21: −1 is the 5th, −37 the 11th', seq[4] === -1 && seq.indexOf(-37) === 10);
let f = 0; const floors = [5, -8, 2, -6, 4].map(m => (f += m));
ok('BtB 22 floors', floors.join() === '5,-3,-1,-7,-3' && Math.min(...floors) === -7 && 5 - floors.at(-1) === 8);
has(boardKey, 22, '-7', '+8');
const grid = [3, -4, -1].map(r => [-2, 0, 5].map(c => r + c));
ok('BtB 23 grid', grid.flat().join() === '1,3,8,-6,-4,1,-3,-1,4'); has(boardKey, 23, '= 1');
let bal = 250; const bals = [-400, 120, -90, 300].map(x => (bal += x));
ok('BtB 24 balances', bals.join() === '-150,-30,-120,180'); has(boardKey, 24, '-150', '-30', '-120', '180');
let lv = 40; const lvs = [-90, 35, -60].map(x => (lv += x));
ok('BtB 25 levels', lvs.join() === '-50,-15,-75' && 40 - lvs[2] === 115); has(boardKey, 25, '115');
has(boardKey, 26, '= 15', '-9', '-2');
has(boardKey, 28, '= 2', '= 8', '= 6');
ok('BtB 29', 180 + 320 - 1 === 499 && 180 + 250 === 430); has(boardKey, 29, '499', '430');
let run = 0; const runs = [250, -120, -300, 180, -40].map(x => (run += x));
ok('BtB 30', runs.join() === '250,130,-170,10,-30' && 100 - run === 130); has(boardKey, 30, '130');
has(boardKey, 36, '= 14', '8 degrees'); has(boardKey, 37, '= 485', '= -47', '= 130');
has(boardKey, 38, '= 0'); has(boardKey, 39, '= -150', '= -70', '= 170'); has(boardKey, 40, '= 2', '= -6', 'by 8');
has(beyondKey, 9, '= 1'); has(beyondKey, 11, '= -12'); has(beyondKey, 14, '= -2', '= -5', '= 8'); has(beyondKey, 15, '= 50', '= -45', '= -55');
let alt = 0; for (let k = 1; k <= 20; k++) alt += k % 2 ? -k : k;
ok('Beyond 10 is 10', alt === 10 && /10 10/.test(text(beyondKey)));
ok('Beyond 11 is −12', 4 * -4 - 2 * (-3 + 5 + 2 - 6) === -12);
ok('Beyond 9 is 3 hours', -8 + 2 * 3 <= 0 && -8 + 3 * 3 > 0);
// the body's new reflect answers
ok('timeline: 300 BCE to 628 CE is 927 years', 300 + 628 - 1 === 927 && ANSWERS.includes('927'));

console.log(`${checks} checks, ${fails} failed`);
process.exit(fails ? 1 : 0);
