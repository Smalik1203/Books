# Class 7 · Mathematics I · Chapter 6 — Number Play

## Beyond the Book, rebuilt 15 September 2026

Rebuilt to the four-stage shape at the top of DESIGN-MATHS §6a, on the model
of Class 7 Chapters 1 and 2. Only `p101`–`p110` and this log were edited; the
chapter body (`p001`–`p014`) was not touched. **The §5 body rebuild of the
same day** — worked examples, checks and end-of-chapter exercises written into
the body — **was reverted at the user's request.** Its pages are kept in the
session scratchpad (`rebuilt/pages/class-7/ch06-number-play/`, with its
`ANSWERS.md`) and were used here only as a source. The Beyond pages this
replaces are backed up in `scratchpad/beyond-ch06-number-play/backup-p1xx/`.

**1 · Using What You Know.** The existing stage, word for word: the parity of
$37 + 58 + 91 + 12$, the line calling 0 to 5, the corner opposite 8
(Fig. 6.18), and the rhythms of 10 beats. Only its `.c-stage__for` line was
deleted. A script compared the stage's text with the old p101–p102 and found
it identical.

**2 · Solved Examples.** 18 examples in five types, in the chapter's order,
each set as Solution, Step 1 …, Answer. The five *Behind Each Answer* problems
keep their options, and their Answer row gives the letter.

| type | examples | from |
|---|---|---|
| 1 Reading a line of heights | 1–3 | rebuild Ex 1–3 |
| 2 Odd and even | 4–7 | old Problem 1; rebuild Ex 5, 6; old Problem 5 |
| 3 Magic squares | 8–11 | rebuild Ex 7; old Problem 2; rebuild Ex 8, 9 |
| 4 Virahanka numbers | 12–15 | rebuild Ex 10, 11; old Problem 3; rebuild Ex 12 |
| 5 Letters for digits | 16–18 | rebuild Ex 14; old Problem 4; rebuild Ex 15 |

Left out: rebuild Ex 4 ($23 + 36 + 41 + 57 + 18$ is Stage 1's first question)
and rebuild Ex 13 (P3 $+$ P3 $=$ RSS is solved in the body's 6.5 text).
Tightened to fit, with no number changed: Ex 12 asks for "the next two";
Ex 14 and Ex 15 each had two rows merged; Ex 16 (7A $-$ A7 $=$ B5) lost
Neha's smudged page and its column array, and its check moved into the
Answer.

**3 · Practice.** One run of 27.

| form | questions | from |
|---|---|---|
| Choose the correct option | 1–12 | rebuild End 1, 2, 3, 4, 5, 7, 8; old Set B 2; old Set C 4, 5, 6, 7 |
| Assertion and reason | 13–17 | rebuild End 9, 10, 11; new 14, 15 |
| Very short answer | 18–20 | rebuild End 16; new 18, 20 |
| Short answer | 21–23 | rebuild End 22, 23; new 23 |
| Long answer | 24–25 | rebuild End 28, 29 |
| Case-based | 26–27 | rebuild End 30, 31, without the *Case study* label |

New questions: 14 (21 is a Virahanka number; 21 is odd: (b)); 15 (the
product of two consecutive numbers is even; their sum is even: (c)); 18
($101 \times 103 + 105$ is even); 20 (the first 10 Virahanka numbers add up
to 231, odd); 23 (AB $-$ BA $= 63$: 81 or 92). Options were reordered so the
key for 1–12 is three each of (a) to (d). Q11 (old Set C 6, the bulb) pairs
the state with the count, replacing the option *broken*; Q9 reads *never*
for *NOT*.

Left out as the body's own questions: rebuild End 12, 13, 14, 17, 18, 19,
20, 21, 25, 26 and 27 (all Exercise Set 6.5); old Set A 2 (100th even
number, 6.2 text), 3 (the 5th Virahanka number, 6.4 text), 4 and 5 (magic
sum 15 and centre 5, Observations 1 and 2), 7 ($n$th odd number, key idea),
8 (the front child calls 0, Set 6.1 Q2), 9 (A $+$ A $+$ A $=$ BA, 6.5 text)
and 10 (odd $-$ even, Set 6.2 Q3); old Set B 1 (ages adding up to 112, 6.2
text), 3 (3 added to a magic square, Set 6.3 Q3), 4 ($2n + 1$ is odd, the
6.2 key idea), 5 (6 steps, 13 rhythms of 6 beats in 6.4), 6 (row sum $3m$,
Set 6.4 Q2) and 8 (parity of the 30th Virahanka number, Set 6.5 asks the
20th); old Set C 1 ($4 \times 4$ magic sum 34, the Khajuraho square), 2
(Liswini, Set 6.5) and 3 (magic sum 60, Set 6.4 Q4).
Left out as near-duplicates inside the run: rebuild End 6 (6-beat rhythms
beginning short; Q10 kept), End 15 (75th odd number; Q3 kept), End 24
($n \times (n + 1)$ even; now Q15); old Set A 1 ($45 + 62$; Q1 kept), Set A 6
($13 \times 17$ grid; Q2 kept), Set B 7 (M4 $+$ 4M $= 121$; Q7 and Example 17
kept).

**4 · Answers.** The letter key for 1–17, a trace row for each of 18–27, and
*Why the other options are wrong* for 4, 9, 11 and 15. A fifth row, for 16,
was cut: it was all that reached an eleventh page.

**Verification.** `scratchpad/beyond-ch06-number-play/verify.mjs`, 111
checks, all passing: every number in every example step, question, option
key and answer, reused ones included. Puzzles are checked by search: height
lines over every order of the children (Ex 2, Q24 unique; Ex 3 and Q9 (c)
impossible); magic squares over every arrangement (8 squares of 1 to 9,
corners only 2, 4, 6, 8, the top row 2 9 4 completes one way; 18 in a corner
of 11 to 19 forces centre 15 and opposite corner 12); cryptarithms over every
digit (7A $-$ A7 $=$ B5 only A $= 2$, B $= 4$; AB $+$ B $=$ BCC none;
C3 $+$ 3C $= 88$ only 5; AB $-$ BA $= 63$ only 81 and 92); Q26 (d)
$7i + 5t = 36$ only 3 and 3. No reused answer was found wrong.

**Fit.** Written into one page and refitted with
`refit.mjs … bridge`. Beyond the Book is `p101`–`p110`, 10 pages (it was 9):
fill 91 100 94 95 98 98 97 98 90 97, all pages fit, nothing into the bottom
margin. `orphans` 0 stranded, `fit-options` every row fits, `check-labels` no
collisions, and `gaps` names no Beyond page. Every `p1xx` carries
`data-bridge`; none carries `--head` or `--tail`. The stale
`build/class-7/_refit-ch06-number-play.html` was deleted. Proofs (`--png`)
of the first Solved Examples page (folio 16), the Practice band page (21)
and a case-question page (23) were viewed. They showed one fault, fixed:
Ex 18's `A1 $+ 1 =$ A2` set as "+1", because a sign opening its own maths
span has nothing to be binary against. It is now `${} + 1 = {}$`, and
Ex 16's `A $- 7$` is `${} - 7$`.

**Flagged, not changed.** `gaps` still reports body pages 1, 3, 4, 7 and 11
under 88%, and the body's `data-close` page p014 sets at 7%; the body was not
to be touched. The line *Beyond the Book: Stage 1 — …* under *Every printed
number re-derived* below describes the old stages and is superseded by this
section.

Written new from NCERT *Ganita Prakash*, Grade 7 Part I, Chapter 6,
*Number Play* (textbook pages 127–145, answer key after them). Original
LearnLab text in NCERT's order of topics and questions; no sentence is
carried over. Crown Quarto, house design, palette `ember`.

Sections keep NCERT's numbering, with plainer names: 6.1 Numbers That Tell Us
Things · 6.2 Odd and Even (*Picking Parity*) · 6.3 Sums in Grids (*Some
Explorations in Grids*) · 6.4 The Virahanka Numbers · 6.5 Letters for Digits
(*Digits in Disguise*). The subtopics *Small Squares in Grids*, *Parity of
Expressions*, the three questions that build the magic square, *Generalising
a 3 × 3 Magic Square*, the Khajuraho square and *Magic Squares in History and
Culture* are `h3`. The five *Figure it Out* blocks are Exercise Sets 6.1–6.5.

## Every figure is drawn new

All 18 figures come from `fig6.mjs` in the session scratchpad. The height
lines (Figs. 6.1–6.3) use invented heights, and the numbers above the heads
are computed from them by the rule; the source's own lines could not be read.
The photographs of daisies, the Palani pillar and the Navagraha Yantra are
not reproduced; the text mentions them and Fig. 6.15 shows the Lo Shu square
and the Kubera Yantra instead.

## Every printed number re-derived

| where | answers |
|---|---|
| Figs. 6.1–6.3 | 0, 1, 0, 3, 2, 0, 4 · 0, 0, 1, 0, 1, 1, 1 · Fig. 6.3: 0, 0, 2, 1, 3, 0, 4 |
| Set 6.1 | 1 open · 2 (a) sometimes (b) always (c) always (d) sometimes (e) sometimes · 3: 7 |
| 6.2 in text | Kishor: five odd cards give an odd sum, never 30 · Maria: consecutive ages give an odd sum, never 112 · Table 6.1: 13 odd, 28 even, 34 even · 100th odd number 199 |
| Set 6.2 | 1 even, even, even, even · 2 odd + odd + even is even, so ₹205 is a mistake · 3 even, even, odd, odd · 4 odd, even, even |
| Fig. 6.9 | (i) 1 5 3 / 2 4 7 / 6 8 9 · (ii) 1 5 9 / 4 3 8 / 7 2 6 — both checked solvable; other fillings exist |
| 6.3 in text | 3,62,880 fillings · magic sum 15 · centre 5 · finished square 8 1 6 / 3 5 7 / 4 9 2 |
| Set 6.3 | 1 one, up to turning and flipping (8 arrangements) · 2 add 1 to every number · 3 (a) yes, 18 (b) yes, 30 · 4 add, subtract or multiply every number by the same number · 5 add the same number to the square of 1 to 9 |
| Set 6.4 | 1: 28 21 26 / 23 25 27 / 24 29 22 · 2: $3m$ · 3 (a) centre $m + 1$, sum $3m + 3$ (b) centre $2m$, sum $6m$ · 4: 23 16 21 / 18 20 22 / 19 24 17 · 5 yes, e.g. double the square of 1 to 9 |
| Khajuraho | every row, column, diagonal, the corners and all nine $2 \times 2$ blocks add up to 34 |
| Fig. 6.15 | Lo Shu 15 · Kubera Yantra 72 |
| 6.4 in text | 8 rhythms of 5 beats, 13 of 6, 34 of 8 · after 89: 144, 233, 377 · parities odd, even, odd repeating, so the number after 89 is even |
| 6.5 in text | A $= 5$, B $= 1$ · P $= 8$, S $= 6$, R $= 1$ · MM $+$ N: $99 + 1 = 100$ · A4 $+$ 5B: $54 + 50 = 104$ · XY three times: $85 \times 3 = 255$ · D1 $+$ D: $91 + 9 = 100$ |
| Set 6.5 | 1 off · 2 no: each sheet adds an odd amount, and 25 odd amounts make an odd total · 3 e.g. o e e / o e o · 4 e.g. 3 −4 1 / −2 0 2 / −1 4 −3; the centre must be 0 · 5 even, even, even, odd, even · 6 even (5050) · 7 after: 2584, 4181; before: 610, 377 · 8: 34 · 9 even · 10 only (a) · 11 $91 + 10 = 101$ |

Beyond the Book: Stage 1 — $37 + 58 + 91 + 12$ is even; 0, 1, 2, 3, 4, 5
means tallest at the front, shortest at the back; the opposite corner is 2;
89 rhythms of 10 beats, 144 of 11. Stage 2 — (b); (c) 45; (a) 21; (d) 11;
(c). Set A b c d a c b c d a b; Set B d a b a b b c b; Set C a b a c c a b.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| *Math Talk*, *Try This* | plain questions or Think and Reflect | no such labels in the library |
| stick-figure cut-outs at the back of the book | draw the figures | the book has no cut-out pages |
| cryptarithms YY + Z = ZOO, B5 + 3D = ED5, KP + KP = PRR, C1 + C = 1FF | MM + N = NQQ, A4 + 5B = C04, XY three times = ZYY, D1 + D = 1EE | new puzzles of the same kinds; each checked to have one answer |
| the light switch toggled 77 times | 63 times | a different number, same idea |
| Liswini's 50 sheets and 6000 | 25 sheets and 5000 | with 50 sheets the source's answer is *possible*, which parity alone cannot show; 25 sheets makes parity decide it |
| Set 6.5 Q5, four blanks | a fifth blank, any number of even numbers | a line for the page, and the case the other four leave out |
| — | Think and Reflect on the general square (outer numbers add to $2m$) | closes the white on that page; uses only Fig. 6.13 |
| — | a paragraph after Fig. 6.15 working out both magic sums from the centre | the page asked the question and was short |

## Checks

Builder: 15 body pages, 9 Beyond the Book; the closing page carries
`data-close`. `check-labels`, `orphans`, `fit-options` and the width probe
report nothing. Every page proof was viewed.
