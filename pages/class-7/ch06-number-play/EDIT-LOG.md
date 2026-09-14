# Class 7 · Mathematics I · Chapter 6 — Number Play

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
