# Class 9 · Mathematics I · Chapter 1 — Orienting Yourself: The Use of Coordinates

## Solved examples in examination formats, 23 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 16 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-9/ch01-coordinates/`.

Source `build/jee-class9.mjs`; check `build/check-jee-class9.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p112; the answers stage still opens a fresh page.

Also, same day. Figs. 1.12 and 1.13 belonged to the old examples and were the last figures in the chapter, so nothing was renumbered.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) $k \lt 3$ |
| 2 | Single correct | (b) 17 |
| 3 | Single correct | (c) $(-6, 4)$ |
| 4 | Single correct | (d) $(0, -1)$ |
| 5 | Single correct | (a) $(-1, -5)$ |
| 6 | Single correct | (b) 8 |
| 7 | Multiple correct | (a), (b) |
| 8 | Multiple correct | (a), (b), (c) |
| 9 | Multiple correct | (a), (b), (c), (d) |
| 10 | Multiple correct | (a), (b), (c) |
| 11 | Numerical answer | 8 |
| 12 | Numerical answer | 5 |
| 13 | Numerical answer | 11 |
| 14 | Matching | (b) P–3, Q–2, R–4, S–1 |
| 15 | Matching | (c) P–3, Q–4, R–1, S–2 |


## Brought to the Class 7 standard, 17 September 2026

Phase 5 of `PLAN-MATHS-CONSISTENCY.md`, worked from the Class 9 brief with
Chapter 6 as the model. Page move, body, Beyond the Book and answers were
done in one pass, and every check was run on the chapter.

**Pages: 29 before (17 body + 12 Beyond, Crown Quarto), 33 after (16 body +
17 Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`, and the body was
refitted once (17 → 16 pages; the stale p017 went with the refit, and
`data-close` is on p016). Three blocks were then settled forward by hand:
the paragraph that names Fig. 1.6 had ended page 9, with the figure
overleaf on a page that does not face it, so it now opens page 10 beside
the figure, and the two blocks that closed page 10 went to page 11.

**Body examples.** The chapter has none, and it has no reason chips (the
`.work` lines on pp. 10–12 are bare statements), so there was nothing to
step and nothing to recast. `check-body-maths` reports 174 expressions and
84 numbers, none lost and none added.

**Body fixes.**
- **Exercise Set 1.2 had two questions numbered 3** (flagged below since the
  language edit). The first, *The shower stands in the corner…*, was added
  as page filler in commit bb264e3 and asked again what NCERT's Q3 (ii)
  asks; it was removed, and the set reads 1–4 again. Nothing it printed is
  lost: `$SHWR$` is still in Q3 (ii).
- *Grade* → *Class* in four places (p002 *Classes 9 and 10*, p003 *Class 9*,
  p010 *Class 8*, p016 *Class 10*), and once in Stage 1 (*Class 8*).
  DESIGN-MATHS §10, *Words that stay*.
- p004 *In the chapters on integers, rational numbers and decimals you
  worked with the number line* → *In earlier classes you worked with the
  number line*. The book has no such chapters (the earlier C5 flag).

**Beyond the Book rebuilt to the four stages:**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, each explained in running text | Q1, Q2, Q3 and Q5 kept word for word (Q3 gains one clause, below); **Q4 replaced**; closing sentence now says *The examples that follow*; `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems | **16 stepped examples** under ten `Type` heads; old Problems 1–5 are Examples 12, 6, 5, 7 and 15 |
| 3 Problem Sets → **Practice** | 3 sets, 25 questions | **one run of 30** in six forms |
| 4 Answers & Takeaways → **Answers** | key, four trace rows, three takeaway paragraphs | key, every other answer, why the options are wrong for eight |

**Stage 1 Q4 answered the body.** It settled whether three points are in
line by checking $PQ + QR = PR$, and said *This is the method that Question
6 of the chapter's exercises asked you to find*. End-of-Chapter Q6 asks the
reader to suggest exactly that method, and Q7 uses it. Replaced with a
question of the same kind, answered from distances alone: *Is there a point
that is 3 units from the origin and 5 units from $(10, 0)$?* (no: such a
point has $x$ between $-3$ and $3$, so it is at least 7 from $(10, 0)$).
The method of the old Q4 appears nowhere in Beyond now; old Set B Q4, which
used it, was not carried over.

The other four were checked against every body question and are not
give-aways: Q1 (points of the x-axis 5 from a point) and Q5 (a point 5 from
two points) are not asked in the body; Q2 asks about $(b, a)$, $(-a, b)$,
$(a, -b)$, where the body's Think and Reflect asks only about $(y, x)$; Q3
is a triangle the body never names.

**Other give-aways fixed:** old Set A Q9 (*$(a, b)$ and $(b, a)$ name the
same point only when $a = b$*) is the body's Think and Reflect Q3 and
summary item 6, and was dropped; old Set C Q3 (inside a circle through
$(6, 8)$) was dropped as End Q12's question with other numbers. No value
Beyond prints is a body answer: $(8, 7)$, $3.5$, $2.5$, $(-17, 6)$,
$(8, 4)$, $(12, 1)$, $\sqrt{65}$, $61$, $81$, $(1, 7)$, $(-1, -1)$,
$(11, 3)$, $170$ and $\sqrt{10}$ were each searched for.
`check-no-repeats` reports four pairs at 50–60%, all Practice Q13's options
(*isosceles*, *right-angled*) against End Q8's *right-angled isosceles
triangle*; Q13 classifies a given triangle, End Q8 asks for one to be
drawn at the origin, so they stay.

**Audit findings, all fixed:**
- *Stage 1 Q3 leans on the converse of Pythagoras* (borderline): the
  sentence now says the theorem holds the other way round *as you learnt
  with the theorem in Class 8*. Examples 12 and 13 cite it the same way in
  their reason column (*converse, from Class 8*).
- *Problem 1 and Set C Q4 lean on quadrilateral tests* (borderline): Set C
  Q4 (*equal opposite sides make a parallelogram*) was not carried over.
  Problem 1, now Example 12, needs only *four equal sides* and *a rhombus
  with a right angle is a square*, which is Class 8 work; End Q16 in the
  body asks for the same judgement.
- *Coverage gap, midpoint and trisection*: **Type 6**, with Example 9 (find
  $B$ from $A$ and the midpoint), Example 10 (points of trisection) and
  Example 11 (unknown coordinates from a midpoint, multiple choice), plus
  Practice Q11, Q23, Q24 and Q28. They work by equal shifts, the idea the
  body's own hint to End Q10 gives, and never print the averaging rule End
  Q9 asks the reader to find.

**Worked examples in the chapter: 16** (0 body + 16 Beyond). The types: the
axes, quadrants and signs; shapes with sides along the grid lines; the
distance between two points; a distance with an unknown coordinate; a point
equidistant from two or three points; midpoints and trisection; right
angles and shapes from side lengths (Example 13 is a proof, a statement to a
row); reflection in an axis; whole-number points at a distance; coordinates
on a map.

**Figures.** Figs 1B.1 and 1B.2 keep their numbers; old Fig. 1B.3 (the
square) now sits inside Example 12 and old Fig. 1B.4 (twelve points) inside
Example 15; old Fig. 1B.5 went with Set C Q2. Two labels were moved after
reading the proofs: *A (1, 1)* in Fig. 1B.2 sat on the x-axis ticks
(y 192 → 188), and *D (6, 1)* in Fig. 1B.3 likewise (y 226 → 221). The
captions of Figs 1B.2 and 1B.3 said *one of $\sqrt{50}$*, and the radical
printed as a blank in the italic caption; they now say *whose square is
$50$* (flagged below). No figure needed redrawing: every labelled point is
drawn where its label says.

**`ANSWERS.md` written** for Exercise Sets 1.1 and 1.2, the seventeen
end-of-chapter questions, the four Think and Reflect boxes, the questions
in the running text, Stage 1, and all 30 practice questions, with a worked
instance under every *answers will vary*.

### Verified

`check-numbers.mjs` passes **573 claims**. It evaluates 202 printed
identities (square roots, powers, bars, and a point set equal to a point,
coordinate by coordinate), checking a chain such as
$AD = \sqrt{4^2 + 3^2} = 5$ on the sides that are numbers, and every
equation in one unknown against the value its block solves it to. It also:
- re-derives each example's Answer row from the coordinates the question
  prints (Example 8 and practice Q26 by search);
- reads every exercise answer back off `ANSWERS.md`, including Set 1.2's
  door against the wardrobe, the washbasin-and-toilet instance, the dining
  table's feet, End Q7's near miss and End Q13's vertices by their
  midpoints;
- measures every labelled point of every coordinate figure (Figs 1.2–1.9,
  1B.1–1B.4) from its SVG, the 18 unlabelled plan points of Figs 1.3 and
  1.5 against the list `ANSWERS.md` reads off them, and Fig. 1B.4's twelve
  points;
- settles Stage 1 by search (Q4 by sweeping the circle of radius 3);
- checks every multiple-choice question and example has exactly one right
  option, reading the points from the question, and derives each
  assertion–reason letter;
- checks that `ANSWERS.md`'s key and practice working agree with the page.

**Break tests: 22 of 22 caught** (example answers and steps, key letters,
key rows a part at a time, an option, a question's own point, Stage 1,
`ANSWERS.md` values and key, three figure points, a body value). The first
run missed two:
- practice Q12 was solved against a point typed into the script, so a
  question whose point changed still passed; the multiple-choice solver now
  reads each question's points off the page;
- key row 29 (d) was checked value by value, so an extra number beside the
  right ones passed; it is now checked as a phrase.

The check found nothing wrong in what the chapter already printed.

**Fitting:** nothing is clipped and nothing runs into the margin (page 29
ran 1.1 mm until its last question was settled forward). `orphans` finds 0
stranded openers, `check-labels` finds no collisions, and `fit-options`
passes. I read the proofs of pages 9–10 and 17–33.

**Colour:** the figures are line drawings with lettered points and printed
coordinates; the soft fills (room, furniture) carry no meaning a label does
not also give. Pages 3, 4, 5, 8, 10, 12, 17, 18, 25 and 27 were run through
`check-colour`.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 6 | 80% | Fig. 1.4 |
| 8, 12, 13 | 81–87% | an exercise question too tall for the gap |
| 15 | 55% | the chapter summary, a panel |
| 16 | 44% | the last body page (`data-close`) |
| 19–27 | 63–83% | a `Type` head with its example, or an example panel |
| 30 | 82% | a case-based question |
| 31 | 69% | **the Answers stage, which always opens a page** |
| 32 | 72% | the *Why the other options are wrong* head with its rows |
| 33 | 51% | the last page |

### Flagged, not done

- **End-of-Chapter Q7** still cannot be settled by the method Q6 asks for,
  at two decimal places ($14.2195\ldots$ against $14.2127\ldots$).
  `ANSWERS.md` settles it exactly ($10\sqrt{85} > 92$) and flags it. A body
  question; it needs other numbers.
- **End-of-Chapter Q17** (moving the origin) was also added as page filler
  in commit bb264e3 and is not NCERT's. It was left in place, because
  moving it would lose body mathematics; the decision is the user's
  (Class 6 moved such questions to Practice).
- **End-of-Chapter Q14** does not say how the streets are numbered;
  counted outward from the main roads, $(4, 3)$ names four crossings.
  Answered for numbering from one edge, and flagged in `ANSWERS.md`.
- **End-of-Chapter Q13** does not say which midpoint is on which side;
  answered with the usual lettering.
- **End-of-Chapter Q9–Q13** still rest on a midpoint rule the body never
  states (the earlier flag). Beyond now works midpoints by shifts, but the
  body gap is the body's.
- **The converse of Pythagoras is attributed to Class 8.** I believe the
  Class 8 book states it with the theorem; if it does not, the clause in
  Stage 1 Q3 and the two reason cells need another source.
- **A `\sqrt{}` in an italic figure caption printed without its radical**
  (Figs 1B.2 and 1B.3, worded round it here). A stylesheet matter, not
  fixed.
- p002 *named after him twice over* (the earlier C5 flag) and the p010/p012
  bars (the earlier C3 flag) are unchanged.
- The history on pp. 1–2 has no source recorded in this log.

Language edit, 29 pages (p001–p017 chapter proper, p101–p112 Beyond the Book).
Build after editing: 29 pages, all pages fit, 0 stranded openers, no label
collisions, every option row fits. Every numerical answer in the chapter and the
bridge re-derived, including Q12's circle of radius $\sqrt{65}$, Q13's
vertices-from-midpoints, Q15's overlapping icons (centres 170 pixels apart,
radii summing to 180) and Q16's square of area 10.

7 fixes in 29 pages. The register is close to the Class 8 Mathematics II
standard, and two things about this chapter are better than anything in Class 8:

- **The history is sourced and honest.** The Sindhu–Sarasvatī street grid,
  Baudhāyana's two directions, Ujjayinī as the prime meridian (entering Arabic
  geography as 'Arin'), Āryabhaṭa's sines, Brahmagupta's zero and negatives,
  al-Bīrūnī, Ömar Khayyām, then Descartes — and then, unusually, p002 says
  plainly what Descartes did **not** do: "he did not insist that the second be
  perpendicular, and he had no use for negative coordinates at all. The tidy
  cross of two axes … were assembled by others over the century that followed."
  A textbook that names the limits of its own hero story is rare.
- **Reiaan is blind, and the chapter is built round that without fuss.** His
  sister builds the room in pins and thread so he can feel the directions; the
  exercises then ask whether a doorway is wide enough for a wheelchair and
  whether the school's own doors are. The accessibility questions are
  mathematics, not decoration.

## FIXED

| before | after | check |
|---|---|---|
| **p001** "a framework of reference" | "a framework you measure from" | L1 |
| **p002** "far easier to compute" | "far easier to work out" | L1 |
| **p002** "formalised zero and the negative numbers as algebraic objects in their own right" | "set out zero and the negative numbers as numbers in their own right" | L1, L2 — two hard words in the sentence that carries the chapter's debt to Brahmagupta |
| **p004** "arbitrary once, then permanent" | "a free choice once, then fixed for ever" | L1 |
| **p008** "the system does something rather complete" | "the system does something complete" | L3 |

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p014 Q7 | C4 | **The question cannot be answered by the method it tells you to use.** Q6 asks whether $M(-3,-4)$, $A(0,0)$, $G(6,8)$ are collinear and suggests finding a way without plotting — the intended method is the chapter's own: $MA + AG = 5 + 10 = 15 = MG$ exactly. Q7 then says "Use your method from Question 6" on $R(-5,-1)$, $B(-2,-5)$, $C(4,-12)$. There $RB = 5$, $BC = \sqrt{85} = 9.2195\ldots$, $RC = \sqrt{202} = 14.2127\ldots$, so $RB + BC = 14.2195\ldots$ — the points are **not** collinear, but the gap is $0.007$. A student working to two decimal places gets $14.22$ against $14.21$ and cannot tell a real difference from a rounding error. Contrast the bridge (p103), which does the same question with $\sqrt{13}$, $2\sqrt{13}$, $3\sqrt{13}$ — exact, and the sum is unmistakable. | Choose numbers whose surds are exact multiples, as the bridge does, or say in the question that the answer turns on a very small difference and the arithmetic must be kept exact. As written the question punishes a correct method. |
| p009 Q3 / p010 Q3 | C4 | **Two questions numbered 3 in Exercise Set 1.2.** p009 ends with `data-start="3"` ("The shower stands in the corner of the bathroom") and p010 opens again at `data-start="3"` ("Look at the bathroom"), then continues at 4. The set reads 1, 2, 3, 3, 4 — and the two 3s are about the same bathroom, so a student cannot tell them apart by content either. | Renumber p010's blocks. This is the third chapter in the book with this exact `data-start` fault (Class 8 Part I Ch 2 and Ch 3), and it still is not caught by any build check. |
| throughout, and p103 | C3 | **"Grade" here, "Class" everywhere else.** This chapter says "Grade 9" (p003), "Grade 8" (p010, p103) and "Grade 10" (p016). Class 8 Part I says "Class 9's work on factorisation" (Ch 4 p017) and "assumed here and proved in Class 9" (Ch 5 p004). Two volumes, two words for the same thing, and Indian schools say *Class*. | One word, book-wide. *Class* is the Indian usage and the one the earlier volumes already use. |
| p004 | C5 | "In the chapters on integers, rational numbers and decimals you worked with the **number line**." There are no such chapters in this book. Integers and decimals are Class 7 material, and this book's own number chapter — Class 9 Chapter 3, The World of Numbers — comes *after* this one. | Say "in earlier classes", or point forward to Chapter 3. As written it sends a reader looking for chapters that are not there. |
| p014 Q9–Q13 | M2 | Five end-of-chapter questions rest on the **midpoint formula**, which the chapter never teaches. Q9 is fair — it gives a table and a hint asking the student to find the connection themselves, which is discovery. But Q11 needs trisection points found from two midpoint statements, and Q13's hint hands over a result ("Add two of the midpoints and subtract the third") that no reader could have derived from Q9. | Either a short section on the midpoint, or trim to Q9 and Q10. Q13's hint is doing the teaching that the chapter skipped, in eleven words, inside a hint. |
| p010 vs p012, p013 | C3 | p010 makes a point of the modulus bars — "The bars matter. Subtract the other way round and the arithmetic hands you a negative number, and no length has ever been negative." Then p012 writes the general legs as $x_2 - x_1$ and $y_2 - y_1$ with no bars, and p013 explains that the squaring throws the sign away. Both are right, but the reader is told the bars are essential and then shown them dropped two pages later. | One sentence at the point of dropping them: the bars are unnecessary here *because* the value is about to be squared. p013 says it, but after the formula has already appeared without them. |
| p002 | C5 | "it is *Cartesius* that survives in **Cartesian** — so every time the plane is named, it is named after him twice over." *Twice over* does not follow from what precedes it: the plane is named once, in disguise. | Either drop the clause or say what was meant. |


## 21 September 2026 — figure/table reference review

Reviewed this chapter in the all-maths reference audit. Figures and tables now use one chapter sequence, including Beyond the Book; captions and references were updated together. Questions, calculations and artwork were preserved. The chapter and its volume were rebuilt; detailed layout checks and any remaining warnings are recorded in build/_all-maths-reference-checks/.
