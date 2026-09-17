# Class 7 · Mathematics I · Chapter 7 — A Tale of Three Intersecting Lines

## Syllabus audit fixes, 17 September 2026

Beyond the Book checked against what the chapter body teaches. The audit
found one borderline item and marked it *keep*, and it was kept.

- **Stage 1 Q3; Practice Q26, Q31, Q32; case question 34(c) — the exterior
  angle property and exterior angles summing to $360^\circ$.** The body
  asks "What must be true?" and never states the property, but every one of
  these items reaches it from the linear pair and the angle sum, both of
  which the body teaches (Stage 1 Q3 works it through: $180^\circ -
  125^\circ = 55^\circ$, then the angle sum; answer 32 does the same with
  $3 \times 180^\circ - 180^\circ$). Nothing was changed.

Pages 25 → 25; no file in the chapter other than this log was edited, so
nothing was refitted or rebuilt.

## Beyond the Book, rebuilt 15 September 2026

Rebuilt to DESIGN-MATHS.md §6a, *The shape since 15 September 2026*, on the
pattern of Class 7 Chapters 1 and 2. Only `p101`–`p110` were touched. The §5
body rebuild of the same day was **reverted at the user's request**; its
backup, and the pages it wrote, are in the session scratchpad
(`scratchpad/rebuilt/pages/class-7/ch07-three-lines/`). The body here is the
refitted NCERT-order body and was not edited. The Beyond pages as they stood
before this rebuild are in `scratchpad/beyond-ch07-three-lines/before/`.

**Pages:** 8 before (p101–p108), 10 after (p101–p110). Fill 96 94 95 97 96
97 97 97 94, last page 56%.

### The four stages

| stage | contents | from |
|---|---|---|
| band | `.c-bridge`, unchanged | — |
| 1 Using What You Know | four tried-and-explained questions, **word for word**; only the `.c-stage__for` line removed | this chapter |
| 2 Solved Examples | 14 examples, Solution → Step → Answer with `.chip` reasons | see below |
| 3 Practice | one band, 34 questions in six forms | see below |
| 4 Answers | letter key 1–18, a `.work--trace` row for 19–34, *Why the other options are wrong* for 9, 11, 13, 14, 17 | written new against the script |

**Solved Examples, by type.** Type 1 constructing from the sides: Ex 1, 2
(reverted rebuild's Examples 1, 2). Type 2 can three lengths make a triangle:
Ex 3 (old Problem 1), Ex 4, 5, 6 (rebuild's Examples 4, 5, 6). Type 3 sides and
angles: Ex 7, 8 (rebuild's 7, 8). Type 4 angle sum and exterior angles: Ex 9,
10 (rebuild's 9, 10, with its figure), Ex 11 (old Problem 2), Ex 12 (old
Problem 4). Type 5 altitudes and types: Ex 13 (rebuild's 12, with its figure),
Ex 14 (rebuild's 13). Figures are numbered **Fig. 7.26** and **7.27**, after
the body's last, 7.25. The old solutions were recast from prose into steps; the
multiple-choice ones keep their options and answer with the letter.

**Practice, by form.** Choose the correct option 1–14 · Assertion and reason
15–18 · Very short answer 19–21 · Short answer 22–28 · Long answer 29–32 ·
Case-based 33–34. From the rebuild's end-of-chapter questions: 1, 2, 3, 4,
5, 7, 10 (its 1, 4, 2, 3, 6, 8, 5), 15 (its 9), 19–20 (its 12, 15) and 22–34
(its 17–29, reordered within each form). From the old Set B: 6, 11, 16, 17
(its 7, 4, 3, 6). From Set C: 8, 9, 12, 13, 14 (its 5, 2, 3, 1, 7). **Written new:** 18 (exterior angle
against the angle next to it) and 21 (can every angle be under $60^\circ$),
because dropping duplicates left assertion–reason with three and very short
answer with two. Options were reordered so the key spreads (a) 5, (b) 5,
(c) 4, (d) 4.

### Excluded as duplicates

Of the chapter body: old Set A 7 ($50^\circ$, $60^\circ$, exterior $110^\circ$ —
the worked case in *Exterior angles*); Set B 8 ($\angle A = 40^\circ$, limit
$140^\circ$ — *When do the arms meet?*); Set B 2 ($\angle B = \angle C$, find
them — Set 7.8 Q3); Set A 5 (each angle of an equilateral triangle — Set 7.8
Q2); Set C 4 and the rebuild's Example 14 (a side of a right triangle is an
altitude — 7.4 text); old Problem 3 ($72^\circ$, $72^\circ$, $36^\circ$ — Set 7.8
Q1 is the same triangle); the rebuild's Example 3 (the other crossing point —
7.2 text); its end question 7 (which pairs can be two angles — Set 7.7 Q2);
its question 10 (every triangle has two acute angles — the Think and Reflect
in 7.5).

Of Stage 1: old Problem 5 (whole-number third sides of 5 and 8 — Stage 1's
first question with other numbers); the rebuild's Example 11 (exterior
$125^\circ$ with $55^\circ$ and $70^\circ$ — Stage 1's third question).

Near-duplicates inside the run: Set A 1, 2, 3, 4, 6, 8, 9, 10; Set B 1, 5;
Set C 6; the rebuild's end questions 13, 14, 16. The rebuild's *Check
yourself* boxes and *Common mistake* notes were not used. Old Problem 1's
option (d), 2 cm, 3 cm, 6 cm, is a set the body tests, so it became 2 cm, 4 cm,
7 cm. The old stage 2 closing paragraph and the three takeaways are gone.

### Verification

`scratchpad/beyond-ch07-three-lines/verify.mjs` checks every angle and length
in Stage 1, the 14 examples, the 34 questions and their answers. That covers
triangle inequalities, whole-number ranges, angle sums, exterior angles,
constructed lengths by the cosine rule (PR ≈ 5.4 cm, roof sides ≈ 3.5 cm,
base angles ≈ $37^\circ$ and apex ≈ $106^\circ$, altitude 4.8 cm), both figures'
geometry, and that each multiple-choice question has exactly one correct
option matching the printed key. **319 checks, 0 failures.** No reused item
was wrong.

Fitting was done with wording, never padding. Ex 1 and 2 each lost a row, and
Ex 3, 4, 7, 12 and 13 had steps merged. The questions of Ex 4, 8 and 13, and
Practice 24, 27 and 33(d), were each cut to one line. Practice 12's options
went to two columns. Stage 2's type 4 order became direct, slide,
multiple-choice, exterior. The answers are one `.work--trace` block per row,
as in Chapter 2, so they flow.

Tools: builder — all Beyond pages fit, no overflow, no violations; `gaps` —
no short Beyond page; `orphans` — no stranded opener in Beyond; `fit-options`
— every option row fits; `check-labels` — no collisions. No `--head`/`--tail`;
every `p1xx` carries `data-bridge`. Proofs of pages 17, 21 and 23 were viewed.

**Flagged, in the body, not touched:** page 9 runs 3.2 mm into the bottom
margin; `orphans` reports an `h3` 3.8 lines from the foot of page 3; pages 7,
12 and 13 are under 88%.

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
