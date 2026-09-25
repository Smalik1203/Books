# Class 7 · Mathematics II · Chapter 7 — Finding the Unknown

## Solved examples in examination formats, 23 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 14 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-7/p2ch07-equations/`.

Source `build/jee-class7.mjs`; check `build/check-jee-class7.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p111; the answers stage still opens a fresh page.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) 7 |
| 2 | Single correct | (c) ₹6 |
| 3 | Single correct | (b) 112 |
| 4 | Single correct | (b) His first step is wrong, and the solution is 21. |
| 5 | Single correct | (d) 2 |
| 6 | Single correct | (a) $3n + 4 = 19$ |
| 7 | Multiple correct | (a), (c), (d) |
| 8 | Multiple correct | (a), (c) |
| 9 | Multiple correct | (a), (b), (c) |
| 10 | Multiple correct | (a), (b), (d) |
| 11 | Numerical answer | 20 |
| 12 | Numerical answer | 6 |
| 13 | Numerical answer | 12 |
| 14 | Matching | (d) P–3, Q–4, R–1, S–2 |
| 15 | Matching | (c) P–2, Q–4, R–1, S–3 |


## Syllabus audit fixes, 17 September 2026

One finding, a borderline gap. No Solved Example worked making equations from
a given solution (body p014–p015), or finding a real-life situation for an
equation (body Example 13). Two examples were added at the end of Type 1
(*Writing an equation and checking a solution*), one per topic:

- **Example 4.** Write two equations whose solution is $m = -4$. Start from
  $m = -4$ and do the same operation on both sides, as in the body's
  Table 7.4. Multiplying by 2 and adding 5 gives $2m + 5 = -3$. Changing
  both signs and adding 6 gives $6 - m = 10$. Both are then checked with
  $m = -4$. The audit's value ($x = -2$) was **not used**, because it is
  Exercise Set 7.2 Q1. `check-no-repeats` pairs this example at 60% with
  that question and with the body's "four equations whose solution is
  $u = 6$". Both are the same kind of task with a different value, and the
  example answers neither.
- **Example 5.** A real-life situation for $3x - 20 = 70$. The terms are
  read the way body Example 13 reads them: a term that changes with $x$, and
  a fixed amount, here taken away. One situation is 3 notebooks at ₹$x$ each
  with ₹20 off, and a bill of ₹70. Solving gives $x = 30$. The equation
  differs from Example 13's and from the case question Q34 (a bus and
  museum tickets).

Examples 4–12 became **6–14**. Nothing refers to an example by number. Class
7 has no `ANSWERS.md` or `check-numbers.mjs`, so the values were checked by
hand: $2 \times (-4) + 5 = -3$, $6 - (-4) = 10$, and
$3 \times 30 - 20 = 70$.

Pages 33 → 34 (body 23, Beyond 10 → 11). Before this edit, Answers sat under
Q35 on p109, which is against the fresh-page rule. `refit bridge` moved it
to the top of p111, but left Q35 alone on p110. So Q34, with its
*Case-based questions* sub-head, was moved by hand from p109 to p110. p109
(59%) and p110 (50%) are the short run before Answers, logged here and not
padded. Beyond pages all fit. Body page 7 runs 1.3 mm into the margin, but
the body source was not touched. 0 stranded openers, every option row fits,
no labels collide, `data-bridge` on p101–p111.

## Examples set as steps, 16 September 2026

The chapter body's worked examples now read the way Beyond the Book's do
(DESIGN-MATHS §5a, *examples are stepped*): *Solution.*, a step to a
`.work__row`, the reason two to four words in a `.chip`, an *Answer* row last,
and a *Check* row before it where the example already checked its result.
**Only the layout changed.** No mathematics, no number, no question wording,
no example order and no NCERT structure was touched.

**Seven of the fourteen were set as steps: Examples 1–6 and 14.** These are
the ones whose working is inside the panel. The other seven were left as they
are, and why is worth recording:

- **Examples 7–12** are question-only panels. The chapter poses the problem,
  then works it in running text — with Fig. 7.8–7.11, Table 7.3 and, for
  Examples 8 and 10, two or three different students' methods, Example 10's
  running from `p011` to `p012`. Pulling that into the panel would move
  matter from outside the panel, put a figure inside a box that may never be
  divided over a page break, and recast NCERT's *pose, then discuss* shape.
  Left alone deliberately.
- **Example 13** ("think of a real-life situation the equation could
  describe") has no working to step: its answer is a story about a plumber's
  bill, which is explanation, not a row of maths.

A reason that moved into a chip left the sentence it came from; nothing else
was cut. A lead-in or a closing observation stayed as a `<p>` before or after
the `.work` block — Example 1 keeps "This works because addition and
subtraction are inverse operations", Example 3 keeps the note on the additive
inverse.

**Verification.** `scratchpad/steps-p2ch07-equations/verify.mjs` reads every
`.c-example` from `git show HEAD:` and from disk, keyed by its tab so a refit
moving examples between pages does not confuse it, strips the tab and the step
labels as furniture, and compares the numbers and the `$…$` spans. Result: 14
examples before, 14 after; **no number dropped and none invented in any
example**; the only count shifts are the *Answer* and *Check* rows restating a
result. Every printed solution was substituted back into its printed equation
($11y + (-5) = 61$ at $y = 6$; $6y + 7 = 4y + 21$ at $y = 7$;
$300 + 6x = 10x - 100$ at $x = 100$) and every arithmetic result re-derived —
13 checks, all passing. A word-token diff of the whole body confirmed the only
words lost are the parenthetical reasons that became chips.

**Fitting.** `refit.mjs … body`, then a rebuild. **22 body pages → 23**
(chapter 32 → 33; Beyond the Book, `p101`–`p110`, untouched). `data-close`
moved with the last body page to `p023`.

| check | before | after |
|---|---|---|
| overflow | `!` page 5 after the edit, before the refit | none |
| bottom margin | page 2 ran **4.8 mm** in | deepest **1.3 mm** (pages 7 and 30) |
| `orphans` | 0 stranded | 0 stranded |
| `fit-options` | — | every option row fits its columns |
| `check-labels` | — | no labels collide |
| `--head`/`--tail` | none | none |

Page 2's 4.8 mm overrun, which this chapter has carried, is cleared.

**Short pages, reported and not padded.** 1 (79%), 3 (86%), 4 (62%),
6 (63%), 15 (85%), 21 (79%), 31 (85%) — four before, seven now. `gaps.mjs`
names what holds each: pages 1 and 21 a figure, pages 3, 4 and 15 a heading
that may not be stranded at the foot, page 31 an exercise band, and **page 6
the Example 3 panel**, 81 mm of panel against 85 mm of gap. That last one is
the cost of the change: two examples now fill page 6 where three prose ones
once did.

**Flagged: `refit.mjs` is not idempotent on this chapter.** Refitting the
settled 23 pages a second time puts page 2 back to 102% — 4.8 mm into the
bottom margin — and adds short pages at 5 (77%) and 7 (74%). The pages as
committed come from one refit of the pre-edit body. Do not refit again without
reading the fill line afterwards.

## Beyond the Book, rebuilt 15 September 2026

Rebuilt to the shape in DESIGN-MATHS.md §6a, "The shape since 15 September
2026", on the pattern of Class 7 Chapters 1 and 4. The chapter body
(`p001`–`p022`) was not touched. The §5 body rebuild made earlier the same
day was **reverted at the user's request**; its backup is in the session
scratchpad (`scratchpad/rebuilt/pages/class-7/p2ch07-equations/`), and it
was used here only as a source of examples, questions and answers.

Seven pages before (`p101`–`p107`, with a three-set multiple-choice Stage 3
and "Answers & Takeaways") → ten pages after (`p101`–`p110`).

| stage | contents | from |
|---|---|---|
| 1 Using What You Know | the five tried-and-explained questions, **word for word** (checked against the committed text); only the `.c-stage__for` line is gone | the existing stage |
| 2 Solved Examples | 12 examples in five types, each Solution → Step … → Answer with a short reason chip; an equation ends with a check by substitution | see below |
| 3 Practice | one band, one run of 35 questions | see below |
| 4 Answers | letter key 1–25 in three rows; one `.work--trace` row each for 26–35; "Why the other options are wrong" for 12, 17, 20, 21, 25 | worked here |

**Stage 2, by type.** Type 1 · Writing an equation and checking a solution: 3
(Examples 1–3, from the reverted rebuild's Examples 1–3). Type 2 · Solving an
equation step by step: 3 (Example 4, old Problem 1; Example 5, new; Example 6,
the reverted rebuild's end-of-chapter Q15). Type 3 · Making an equation from a
problem: 2 (old Problems 3 and 5). Type 4 · Finding and mending a mistake: 3
(the reverted rebuild's Examples 17 and 18; old Problem 2). Type 5 ·
Brahmagupta's rule: 1 (the reverted rebuild's Example 20). The old problems'
prose solutions became steps; a multiple-choice problem keeps its options and
its Answer row gives the letter. Options were re-ordered in old Problem 3 so
the answer is (c). "Transposing" is not the body's word, so the chips say
"move … across", after the body's key idea *Moving a term or a factor*.

**Stage 3, by form.** Choose the correct option 21 (old Sets A, B, C: 18; the
reverted rebuild's end-of-chapter 1, 3, 6: 3). Assertion and reason 4 (the
reverted rebuild's 7–9; one new, Q23, so that the four answers are a, b, c, d).
Very short answer 3, short answer 3, long answer 2 — all new, since every
reverted-rebuild question in those forms except two is in the body's Exercise
Set 7.3. Case-based 2 (the reverted rebuild's 32 and 33, without the *Case
study* label; Q35's three weights are now a table). Letters 1–21: a 5, b 5,
c 5, d 6.

**Excluded as duplicates.**

| item | why |
|---|---|
| reverted rebuild Examples 4–16 and 19 | in the body as Examples 1–14 (the arithmetic of inverse operations, $11y + (-5) = 61$, $6y + 7 = 4y + 21$, Ranjana's tiles, Madhubanti's party, the savings, $28(x + 4) + 300 = 1000$, Riyaz's trick, the marbles, $100x + 75 = 250$, the horses) |
| reverted rebuild end-of-chapter 10–13 and 16–31 | the body's Exercise Set 7.3, word for word or nearly (blanks, $28p - 36 = 98$, $u = 6$, the number increased by 36, Ranju, blobs, machines, taxi, 76, grill, juice, Bakhshali, giraffe, donkeys, Table 7.7, triangles, stick patterns, the eight equations, the maze) |
| reverted rebuild end-of-chapter 2 ($7 - x = 2$) | the same form as the body's $13 - z = 8$ |
| reverted rebuild end-of-chapter 4 ($3m + 4 = m + 10$) | near-duplicate of old Set A Q8, $3z + 4 = z + 12$, which was kept |
| reverted rebuild end-of-chapter 5 (a number plus 3 times it is 36) | near-duplicate of old Set B Q1 and of the body's "increased by 36" |
| reverted rebuild end-of-chapter 14 (is $z = -3$ a solution of $2z + 9 = 3$) | near-duplicate of assertion–reason Q24 |
| old Set A Q4 (adding 5 to both sides of $2x - 5 = 9$) | near-duplicate of Q6, moving 6 in $2x + 6 = 18$ |
| old Problem 4 ($7y - 3 = 25$, find $\frac{7y}{2} + 1$) | the question Stage 1 opens with, and the body's Set 7.2 Q6 and Set 7.3's $28p - 36 = 98$ |
| old closing paragraph "Three things from this section are worth keeping" | a takeaway list; the Answers stage has none in this shape |

**Verification.** `scratchpad/beyond-p2ch07-equations/verify.mjs` checks every
number in Stage 1, every example step and check, every question, every
distractor explained in "Why the other options are wrong", and every answer,
substituting each solution back into its equation: 162 checks, 0 failures.
The printed letter key was compared with the script's key and matches. No
reused item was found wrong.

**Fit.** Written into `p101`, refitted with `refit.mjs … bridge`. To close
short pages, four examples lost a row by merging two steps (Examples 3, 7, 9,
11) and Example 3's question was shortened; no step lost its working or its
check. Builder fill for the Beyond pages (folios 23–32): 93 97 90 99 94 98
101 85 99 38; page 29 runs 1.3 mm into the bottom margin; no `!` overflow, no
violations. orphans: 0 stranded; fit-options: every row fits; check-labels:
no collisions. No `--head`/`--tail`; every `p1xx` carries `data-bridge`.

**Flagged.**

| location | what | note |
|---|---|---|
| Beyond page 8 (folio 30) | 85% full, 34 mm free | held by case Q34 (52 mm), one question that cannot be divided; page 10 is 38% full, so closing it would not save a page |
| body page 2 (folio 2) | runs 4.8 mm into the bottom margin | in the body, which was not to be touched; reported by every build |
| Q15, Q31 | use the angle sum of a triangle and the perimeter of a rectangle | both are used by the body's Exercise Set 7.3 and by earlier Class 7 chapters |

Written new from NCERT *Ganita Prakash*, Grade 7 Part II, Chapter 7,
*Finding the Unknown* (textbook pages 165–190). Original LearnLab text in
NCERT's order of topics and questions; no sentence is carried over. Crown
Quarto, house design, palette `lagoon`: every palette is now used once in
Class 7, and this one is reused from Mathematics I Chapter 2, which is in the
other volume. The source PDF has no answer key; every answer below was worked
here.

Sections: 7.1 Find the Unknowns · 7.2 Solving Equations Systematically ·
7.3 Mind the Mistake, Mend the Mistake · 7.4 A Pinch of History. The source's
subtopics are `h3`; its three *Figure it Out* blocks are Exercise Sets 7.1–7.3.
*Math Talk* and *Try This* prompts are plain questions, and the closing
puzzle, *A Magic Trick*, is a `c-reflect`.

## Every figure is drawn new

All 18 figures come from `fig7.mjs` (with `geo.mjs`) in the session scratchpad.
Source pages were rendered with pdf.js, and the numbers in the pictures were
read from 3x crops.

| figure | note |
|---|---|
| Figs. 7.1–7.4 | the source's hanging toys carry pictures (leaves, fish, books, bread, eggs, fruit); here they are shapes (triangle, square, circle, diamond, hexagon) with the **same weights**. The source's two unnumbered rule pictures are Fig. 7.1; its Figs. 7.1–7.3, 7.4–7.5 and 7.6–7.8 are Figs. 7.2, 7.3 and 7.4 |
| Figs. 7.5, 7.6 | the source's four scales (7.9–7.12) as two figures of two |
| Fig. 7.9 | Methods 1 and 2 for Step 4 only; the source also draws Steps 1–3 for each method, which the text now gives as $3k + 1$ |
| Fig. 7.10 | Fatima's diagram with its brace marked ₹500 |
| Fig. 7.14 | the two machines of Set 7.3 Q5 side by side |
| Fig. 7.15 | **redrawn to scale** from the question's numbers: bars 3 cm, five rods 2 cm, six equal gaps of 3 cm, 34 cm in all |
| Fig. 7.17 | pattern 2 at positions 1–3; the source shows 4 |
| Fig. 7.18 | **redrawn**: the source's maze of arrows could not be read reliably from the picture. The same twelve equations sit in a 4 × 3 board, with numbered doors placed so that exactly one path runs Start → End; every wrong door leads to a box with no way on |
| left out | the LHS/RHS labelled equation (said in the text), the savings diagram of Example 9, the marbles photograph, the Riyaz and Akash picture, the tangram cut-out pages at the end of the PDF |

## Every answer worked

| where | answers |
|---|---|
| Figs. 7.2–7.4 | (a) square 2, circle 8 · (b) hexagon 8, circle 4 · (c) square 4, triangle 2 · 7.3 (a) square 1, triangle 3 · (b) triangle 5, hexagon 3 · 7.4 (a) circle 3 · (b) circle 6 · (c) diamond 3 |
| Figs. 7.5, 7.6 | 10 kg · 14 kg · 7 kg ($5s = 21 + 2s$) · 15 kg ($90s + 50 = 60s + 500$) |
| matchsticks | $n = 49$; 200 sticks is impossible, $2n + 1$ is odd |
| 7.2 | $5x - 4 = 7$ gives $\frac{11}{5}$; Example 1 13265; Example 2 82,984; Example 3 7024; Example 4 $\frac{11760}{113}$ |
| Set 7.1 | 1 (a) 15 (b) 0 (c) 10 (d) $-10$ (e) 90 · 2 e.g. $x + 4 = x + 5$ |
| Examples 7–12 | $k = 33$ · 13 friends · 7 months (₹8550 each) · $x = 21$ · 7, and the rule "divide by 4, add 1" · Suresh 15, Ramesh 45 |
| chains | every equation in both chains has the solution $y = 5$ |
| Set 7.2 | 1 e.g. $x + 2 = 0$ · 2 (a) 30 (b) $-1$ (c) 9 (d) 5 (e) 2 (f) $-\frac{1}{2}$ (g) 5 · 3 258 · 4 2 kg · 5 12 · 6 (a) 26 (b) 12 (c) 3 (d) 11 (e) $-5$ |
| 7.3 | 1 $4x = 10 - 6$, $x = 1$ · 2 steps right to $8z = 2$, then $z = \frac{1}{4}$ · 3 $2v = 10$, $v = 5$ · 4 $2z = -6$, $z = -3$ · 5 $11w = 26$, $w = \frac{26}{11}$ · 6 $3x = -13$, $x = -\frac{13}{3}$ · 7 the 2 is multiplied too: $16q = 42$, $q = \frac{21}{8}$ · 8 $-6 + 8x = 14$, $x = \frac{5}{2}$ · 9 5y is not divided, and $2y = 4 - 3$ has the wrong sign: $16y = -3$, $y = -\frac{3}{16}$ |
| 7.4 | horse ₹100 · Brahmagupta's rule: 2, 10, $m = 7$, and $2x + 3 = 4x + 5$ gives $-1$ |
| Set 7.3 | 1 (a) 9 (b) 31 (c) $-4$ · 2 five of each · 3 7 dots, $3b + 4 = 25$ · 4 (a) 9 (b) 17 (c) 33 (d) 115 · 5 45 and $-3$ · 6 70 km · 7 19 and 57 · 8 3 cm · 9 juice ₹45, milkshake ₹60 · 10 48 and 96 · 11 (a) the 6 was cancelled from $6x$ and 66 alone: $6x = 57$, $x = \frac{19}{2}$ (b) correct (c) $-5$ moved without changing sign, and the last step inverted the fraction: $-5x = 13$, $x = -\frac{13}{5}$ · 12 $50^\circ, 65^\circ, 65^\circ$ and $60^\circ, 50^\circ, 70^\circ$ · 13 e.g. $u - 6 = 0$ · 14 4 ($33a = 132$) · 15 5 m · 16 pattern 1 ($3n + 3$ sticks): 11 squares, 36 sticks, 85 no, 150 yes at 49 · pattern 2 ($3n + 1$ squares, $9n + 4$ sticks): 34 squares, 103 sticks, 85 yes at 9, 150 no · 17 4 · 18 (a) 0 (b) $-\frac{4}{5}$ (c) 5 (d) $-4$ (e) 0 (f) $-1$ (g) 2 (h) $\frac{4}{3}$ · 19 4 → 3 → 21 → 13 → 8 → 4 → End · 20 12 donkeys, 16 children |
| magic trick | $\frac{2x + 10}{2} - x + 3 = 8$ for every $x$ |

Beyond the Book: Stage 1 — 44; Meena is right; no solution; the son is 12;
the rule divides by 0 and the equation has no solution. Stage 2 — (a), (b),
(a), (a), (b). Set A b a d b c b a c; Set B b c d a b c; Set C d a c b a.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| "Grade 6", "Grade 7" | Class | house usage |
| *bījagaṇita*, *Brāhmasphuṭasiddhānta*, *yā*, *kā*, *nī*, *rūpa*, *Bhāskarācārya*, *Bakhshālī* | set without diacritics | the body face would fall back to a third face for the marked letters |
| Example 3 working "12345 − 5432 + 132 − 24" | 135 | a typo; the question has 135, and 7024 is right only for 135 |
| Mistake 8 "−6v − 8x = 14" | "−6 − 8x = 14" | a stray letter; the mistake being tested is the sign of $8x$ |
| Example 16 (after Example 13) | Example 14 | the source's numbering skips 14 and 15 |
| Example 13: "100 as the number of units and x as the cost per unit", a plate of snacks | a plumber's visit charge of ₹75 and ₹100 an hour, $x$ hours | the same equation; the source's reading makes a plate cost ₹1.75 |
| Set 7.3 Q8: a picture marked 3 cm, 2 cm and an unmarked gap | the question says which parts are 3 cm and 2 cm, and that the gaps are equal | without that the question cannot be answered from the text |
| Set 7.3 Q4: three pictures for each machine | one picture of each machine with its worked input, and the outputs listed as parts (a)–(d) | the picture carries the rule; the parts carry the questions |
| David Mumford's words, quoted | reported, not quoted | no sentence of the source is carried over |
| Note to the Teacher | a sentence asking the reader to compare methods | the book has no teacher's notes |
| Summary, four points | five: the fifth is the key idea *Moving a term or a factor* | a stated result the summary left out |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| Set 7.2 Q2(c) | C4 | the source prints "− 53w = −15" in flat type; the text layer shows every fraction in the chapter collapsed the same way (u/15 as "u15"), so this is set as $-\frac{5}{3}w = -15$, answer 9 | confirm; if 53 was meant, the answer is $\frac{15}{53}$ |
| Fig. 7.18 | C4 | the maze is a different board from the source's | confirm, or supply the source's door layout |
| Set 7.3 Q8 | C4 | the source figure does not say that the gaps are equal | confirm the reading (answer 3 cm) |
| 7.4 | C6 | the dates (Aryabhata 499 CE, Brahmagupta 628 CE, Al-Khwarizmi c. 825 CE, Bhaskaracharya 1150 CE, Bakhshali Manuscript 300 CE) and the Mumford attribution are the source's and were not checked against another source | check if the history page is to be cited |
| Table 7.5 | — | the nine solutions are three tables of three, so that the section can start at the foot of a page; the caption is on the first | none, unless a single table is preferred |

## Checks

Builder: all pages fit, and every page is at 88% or more except the two
closing pages (the magic trick and the tip, and the last page of Beyond the
Book). `gaps`, `orphans`, `check-labels`, `fit-options` and the width probe
report nothing, and a scan finds no maths command without its backslash. All
18 figures were checked in the PNG proofs: the triangle labels were moved
apart, the blobs made rounder, the matchsticks enlarged, and the maze and the
grill drawn smaller. One answer row had a line break between $-3 = 2$ and its
comma; it was reworded.

`css/components.css` gains `data-start` 19 and 20 (Set 7.3 has 20 questions)
and `.table--top`, so that columns of stepped working start together at the
top of their cells.

Fitting, in the chapter proper: the first draft's two tables of the shorter
way are one table with two `tbody` groups; the two chains of equations are set
across the page; the nine solutions of 7.3 are three tables of three, so the
section can start under Exercise Set 7.2; the definition of trial and error
moved above Table 7.1 so the section head seats on the page before it.
Sentences were added, after checking each in the simulator, on the rule for
level toys, the balance on arithmetic, Examples 1–3, the shorter way, and the
history (restoring and balancing, *ya* 2); two questions of Set 7.3 and one
paragraph in 7.1 were shortened. The two machines of Fig. 7.14 are side by
side. `fit-options --fix` set three part lists to one column, which added two
pages; the proofs show two columns fit, `fit-options` passes them, and two are
used.


## 21 September 2026 — figure/table reference review

Reviewed this chapter in the all-maths reference audit. Figures and tables now use one chapter sequence, including Beyond the Book; captions and references were updated together. Questions, calculations and artwork were preserved. The chapter and its volume were rebuilt; detailed layout checks and any remaining warnings are recorded in build/_all-maths-reference-checks/.
