# Class 7 · Mathematics I · Chapter 7 — A Tale of Three Intersecting Lines

Written new from NCERT *Ganita Prakash*, Grade 7 Part I, Chapter 7, *A Tale of
Three Intersecting Lines* (textbook pages 146–172, answer key after them).
Original LearnLab text in NCERT's order of topics and questions; no sentence
is carried over. Crown Quarto, house design, palette `cobalt`.

Sections keep NCERT's numbering, with plainer names where the source's were
long: 7.1 Equilateral Triangles · 7.2 A Triangle From Its Three Sides
(*Constructing a Triangle When its Sides are Given*) · 7.3 Triangles From
Sides and Angles (*Construction of Triangles When Some Sides and Angles are
Given*) · 7.4 Altitudes (*Constructions Related to Altitudes of Triangles*) ·
7.5 Types of Triangles. The source's subtopics are `h3`. Its *Construct* block
and eight *Figure it Out* blocks are Exercise Sets 7.1–7.9; the closing
puzzle, *Shortest Path in a Box*, is an `h3` after Set 7.9.

## Every figure is drawn new

All 25 figures come from `fig7.mjs` in the session scratchpad, from computed
geometry: arcs are drawn at the radii they are labelled with, angles at the
sizes they are labelled with, and altitudes at the true foot of the
perpendicular. Pictures the text extraction lost were redrawn from the
prose: the tent, pole and tree (Fig. 7.7), the paper-folding check of the
angle sum (Fig. 7.17, drawn schematically), the set square steps (Fig. 7.22)
and the spider's box (Fig. 7.25). Fig. 7.5, a circle with five named points,
is **invented**: the source's figure could not be read, and the question was
reworded to name the points.

## Every printed number re-derived

| where | answers |
|---|---|
| 7.2 in text | C is 5 cm from A and 6 cm from B · isosceles defined |
| Set 7.1 | 1 constructions · 2 any △OXY with X, Y on the circle, e.g. △OPQ, △OQR · 3 (i) △ABX is equilateral for either crossing point X; △ABY is isosceles for any Y on either circle · (ii) △ABC is equilateral |
| Triangle inequality | 10, 15, 30: $30 \gt 10 + 15$, no triangle · 3, 3, 7: $7 \gt 6$, no triangle |
| Set 7.2 | 1 $8 \gt 3 + 4$, $6 \gt 2 + 3$ · 2 all three impossible: $25 \gt 20$, $20 \gt 15$, $40 \gt 32$ · 3 yes, the two shorter lengths are each less than the longest, so less than any sum including it; only the longest needs checking |
| 4, 5, 8 | $8 \lt 9$; BX $= 4$ cm $\lt$ 5 cm, circles cross |
| Set 7.3 | (a) no (b) yes (c) no (d) yes (e) yes (f) no (g) yes |
| Set 7.4 | 1 (a) yes (b) no, $9 = 3 + 6$ (c) no (d) yes · 2 yes, for every length, since $s \lt 2s$ · 3 (a) strictly between 99 and 101 (b) strictly between 0 and 10 (c) strictly between 4 and 10 |
| Two sides, included angle | a triangle exists whenever the included angle is less than $180^\circ$ |
| Set 7.7 | 1 the other angle must be less than $150^\circ$, $110^\circ$, $126^\circ$, $36^\circ$ · 2 (a) no (b) yes (c) yes (d) no · 3 sum less than $180^\circ$ |
| 7.3 in text | $\angle B = 140^\circ$ is the limit · third angle $60^\circ$ · exterior angle $110^\circ$, equal to $\angle A + \angle B$ |
| Set 7.8 | 1 $72^\circ$, $15^\circ$, $60^\circ$, $60^\circ$ · 2 no; $40^\circ$; $60^\circ$ · 3 $65^\circ$ each |
| Set 7.9 | 1, 2 constructions; in 2, $\angle R$ is obtuse and the altitude from T meets RY extended beyond R · 3 infinitely many, any $\angle A + \angle C = 90^\circ$ · 4 an equilateral triangle is never right- or obtuse-angled (all angles $60^\circ$); isosceles right $45^\circ, 45^\circ, 90^\circ$; isosceles obtuse, e.g. $30^\circ, 30^\circ, 120^\circ$ |
| Box | left open: unfold the box and join S to T with a straight line |

Beyond the Book: Stage 1 — third side 4 to 14 cm (eleven lengths);
$40^\circ$ and $40^\circ$; third angle $55^\circ$; no triangle has two right
angles. Stage 2 — (c); (b) $65^\circ$; (a) $36^\circ$; (d) $70^\circ$; (a) 9.
Set A c a b d b c b a b d; Set B d a a b c b c b; Set C a c a b b b d.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| *Math Talk*, *Try This* | plain questions or Think and Reflect | no such labels in the library |
| "Recall … Playing with Constructions" | "In Class 6 you found the top point of a house shape" | names what was done, not a chapter title from another book |
| the red and yellow paths | a straight path and a dashed path | the house palette has no red or yellow to name |
| Set 7.1 Q2, points on a circle unlabelled | points O, P, Q, R, S, T named | a question answered by naming triangles needs names |
| the three circle cases, relations as $\lt$, $=$, $\gt$ in display | said in words | two symbols at the end of a line broke onto their own line |
| Euclid's book *The Elements* | the *Elements* | the usual English title |
| — | Think and Reflect on acute-angled triangles | the source's *Math Talk* question, given a box |

## Checks

Builder: 17 body pages and 8 Beyond the Book pages, every page at 88% or
more except the two closing pages; the body's carries `data-close`.
`gaps`, `check-labels`, `orphans`, `fit-options` and the width probe report
nothing. Every page proof was viewed.

Fitting took line-sized edits only: a sentence off the opening of *Can any
three lengths make a triangle?*, a clause added to *Only in (iii)*, a hint
added to *Altitudes by folding*, a second sentence on Set 7.9 Questions 1
and 2, and four lines trimmed from the solutions to Beyond the Book Problems
3–5 so that Problem 5 moves back and closes a 68 mm gap.
