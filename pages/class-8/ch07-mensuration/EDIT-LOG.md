# Class 8 · Mathematics I · Chapter 7 — Covering and Filling

## Syllabus audit fixes, 17 September 2026

The audit ("Audit Class 8 Maths I Beyond") found three Stage 1 tries that
move a volume from one shape to another — melting and recasting, digging and
spreading, displacement — which the body never teaches (the Class 10 Ch 12
pattern), and one borderline Solved Example. Each was confirmed against the
pages. Only Beyond was changed.

| finding | what was done |
|---|---|
| Stage 1 Q2, wax block melted and cast into 2 cm cubes (off-syllabus) | replaced by a try of the same kind: how many 2 cm cubes pack into a box 12 × 6 × 4, counted along the edges and by volume (36 both ways), and whether dividing volumes still counts them in a box 13 cm long (it promises 39; only 36 fit) |
| Stage 1 Q3, well dug and the earth spread over a field (off-syllabus) | replaced by a cylindrical tank 7 m across holding 385 000 litres: how deep? (10 m). The explanation keeps its point, the diameter given for the radius (radius 7 gives four times the base and 2.5 m) |
| Stage 1 Q4, a stone's volume by the water it displaces (off-syllabus) | replaced by 4 litres poured into a tank 50 cm by 40 cm: how far does the level rise? (2 cm) |
| the two paragraphs after Q4 (*the volume does not change when the shape does*; the stone) | replaced by one: the three questions run the volume formula backwards |
| Solved Example 16, the metal in a pipe (borderline) | kept, as the audit allows, as cut-and-subtract; Step 1 now shows the step, $\pi \times 4^2 - \pi \times 3^2 = \pi(4^2 - 3^2)$, instead of starting from $4^2 - 3^2$ |
| Answers closing paragraph | *water, earth, wax and juice* → *water, bricks, cartons and juice*, since earth and wax are no longer in the division |

`ANSWERS.md` Stage 1 line and `check-numbers.mjs` (S1 Q2–Q4, and a check
that no melting, wax or stone is left) updated; each new value was broken
on purpose and caught. 602 claims hold.

`refit … bridge` put Q31 alone before Answers again; Q30 was moved to its
page by hand, as before (48% / 65%). One try was shortened by a line so
p102 no longer runs 1.3 mm into the margin.

**Not changed, for the coordinator:** the body leans on Pythagoras at
Exercise Set 7.2 (p006: a rhombus's side "using a result from Chapter 5",
and a square's diagonal $s\sqrt{2}$).

**Pages: 29 before → 29 after** (14 body + 15 Beyond). No Solved Example
added (the audit found no gap); count stays 18 in Beyond.

## Brought to the Class 7 standard, 17 September 2026

Phase 3 of `PLAN-MATHS-CONSISTENCY.md`, done against the Chapter 1 model.
The chapter was read whole before anything was changed, and every check
below was run on the chapter, not on a page.

**Pages: 27 before (15 body + 12 Beyond, Crown Quarto), 29 after (14 body +
15 Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`. The body was
refitted once, after the examples were stepped; `p015` is gone, and the
summary closes the body on page 14, which carries `data-close`.

**All seven body examples set as steps**: *Solution*, Step rows with a
`.work__why`, an *Answer* row. The wide labels (`formula`, `substitute`,
`the sevens go`, `solve`) became Step rows and reasons. The closing remarks
of Examples 1, 2, 5, 6 and 7 stay as paragraphs after the working. Example
7's `$154h = 3080$, $h = 20$ cm` was split into a step and the answer.
`build/check-example-stepping.mjs`: 7 examples, 0 lost mathematics.

**One body sentence corrected** (p012, the 1 : 50 tip): *a model car …
weighs a hundred-thousandth of the real thing* is now *weighs less than a
hundred-thousandth*. At 1 : 50 the volumes are 125 000 times smaller, so a
solid model weighs 1/125 000 of the real thing, not 1/100 000.

**Beyond the Book rebuilt to the four current stages** (§6a):

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 8 `.c-try` questions, answered in the next stage; `.c-stage__for` | **the same questions, each followed by its own explanation**, word for word except as below; no `__for` |
| 2 Behind Each Answer → **Solved Examples** | the worked answers to stage 1 (*The same questions, worked*) | **18 stepped examples**, Examples 1–18, under eight `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, 38 questions | **one numbered run of 31**, all six forms, the band carrying the numeral |
| 4 Answers & Takeaways → **Answers** | key, why the options are wrong, three *carry forward* paragraphs | key, every other answer, why the options are wrong for 13 questions, one closing paragraph |

The old Stage 2 explanations were moved under their own questions and lost
only their `.c-solution` wrapper and titles. Sentences that pointed forward
were corrected: *try it before turning the page* → *before reading what
follows it*; *Three of these are questions …* (now placed after the stone,
the third of the three) → *The last three are questions …*; *The last
question has an answer …* → *The question of the three tins has an answer
…* (it prints at the head of the next page, above its explanation).

**Types in Solved Examples** — every topic the chapter teaches is worked:
1 area by cutting up (a path, a wall with openings) · 2 the trapezium (sides
from the area; the cut-into-pieces way checked against the formula) · 3 any
quadrilateral, the rhombus and the square · 4 nets, cuboids and cubes
(cm² to m², four walls with openings, the open box from a cut card) · 5 the
surface of a cylinder (a roller; the radius from the curved surface) · 6
volume and capacity (cartons in mL; rainfall in litres) · 7 the volume of a
cylinder (a tank in litres; the metal in a pipe) · 8 how area and volume
grow (halving a cube; a 1 : 20 model). **Worked examples in the chapter:
25** (7 body + 18 Beyond).

**Practice**: 15 multiple choice (key letters a 4, b 4, c 4, d 3), 4
assertion–reason (a, b, c, d), 3 very short, 4 short, 3 long, 2
case-based. The old sets were dropped whole: most items repeated a body
question or a Stage 1 item (the boxes of 1000 cm³, the cube whose two
numbers agree, the cylinder with $r = h = 2$).

### Give-aways found and fixed

| where | printed | answered | now |
|---|---|---|---|
| Stage 1 Q1 | cube of surface 216; *$6a^2 = a^3$ exactly when $a = 6$* | Ex 7.5 Q9 (the cube whose surface and volume agree) | replaced with one of the same kind: a cylinder, $r = 2$, $h = 7$, whose volume and curved surface are both 88 |
| Stage 1 Q7 | area × 9, so lengths × 3 and weight × 27 | Ex 7.5 Q1 (edge tripled: 3, 9, 27) and Q7 (9 : 1, 27 : 1) | area × 25, lengths × 5, weight × 125 |
| Stage 1 Q8 | three 1000 cm³ boxes; *the nearer a box is to a cube, the less cardboard* | Ex 7.4 Q11 (cuboid against a cube of the same volume: which takes less material) | replaced with one of the same kind: three tins holding 616 cm³ (429, 484, 1320 cm²), and a note that the thinnest is not best either |
| Solved Example 17 (draft) | a cube of side 4: $4^3 = 64$, $6 \times 4^2 = 96$ | Ex 7.4 Q2 (a) | side 18 halved to 9 |

`build/check-no-repeats.mjs` reports 8 pairs at 50% or more; every one is
*same type, different numbers* (cube surface, cylinder volume and curved
surface, a rolled sheet, cube volume to surface, trapezium backwards).
Stage 1 Q8 still shows that doubling a tin's radius at fixed volume raises
its surface, which is the direction Ex 7.5 Q10 asks for; the numbers and
the tin differ, and it is left for the coordinator to judge.

**An old title was wrong**, and went with the titles: Stage 2's *Nine times
the area, a thousand times the weight* — the working below it said 27.

### Unit conversions

Every conversion in the chapter was read against its arithmetic, and
`check-numbers.mjs` recomputes each from named constants (1 m³ = 1000 L,
1 L = 1000 cm³, 1 m = 100 cm, 1 m² = 10 000 cm², 1 ha = 10 000 m²):
Example 6 (3 m³ = 3000 L = 3 000 000 cm³), the p010 table and its
*a million millilitres* sentence, Ex 7.2 Q5 (hectares), Ex 7.4 Q5–6,
Ex 7.5 Q3 (1 : 100 roof, cm² to m²) and Q5 (1 mm cubes), Ex 7.5 Q10 (1 L),
and in Beyond Examples 8, 13, 14, 15, 18, Practice 5, 10, 21, 25, 28, 30.
No mismatch was found. (The p010 sentence says *two conversions carry
everything* above a table of three; the third follows from the second.
Flagged below, not changed.)

### Figures and questions

No body question names a figure, and none depends on one: the L-shaped
room (Ex 7.1 Q4) and the rhombus drawings (Ex 7.2 Q8) are to be drawn by
the reader. Nothing to reprint or place by hand.

### Verified

`check-numbers.mjs` passes **591 claims**: 246 printed identities
evaluated on the pages and in `ANSWERS.md` (including `\approx` values
rounded to their printed places), and **70 one-unknown equations solved**,
each root required in the working beside it and each bare `x = …` required
to agree with the equation just before it. It re-derives every body
example and Solved Example answer from the question's own measurements,
every exercise answer in `ANSWERS.md` one lettered part at a time, every
Stage 1 value (including the radius-7 mistake giving 5 m and the radius-2
tin needing about 641 cm²), both case tables against the key, and every
practice answer read back out of the key rows. Every multiple-choice
question is solved and has exactly one right option matching the key; the
explained distractors are recomputed; the four assertion–reason letters are
derived; `ANSWERS.md`'s key matches the page's. 63 spans are skipped as
algebra or definitions (`--skipped` lists them).

**Break tests, 14, all caught** (run on a copy in the scratch folder): body
Example 7's $h = 20$ changed to 30; key 15 (b) → (c); Q25's 1875 bricks in
`ANSWERS.md`; Q30 (c)'s 7272 litres; Ex 7.3 Q1 (ii)'s 290 in `ANSWERS.md`;
Stage 1's 1.25 m; a Q9 option 64 → 63; Solved Example 13's 60 cartons;
Q30's table edge 1.2 m; the body's *1000 cm³ = 1 litre*; Example 8's
₹37.60; `ANSWERS.md` key 13; Q31 (b)'s 380; Example 3's $x = 12$ → 13.
The last was **missed** at first, because a bare `x = 13` was accepted as
its own root; bare assignments are now checked against the equation above.

**Fitting.** `build.mjs`: 29 pages, all fit, nothing into the margin.
`orphans`: 0 stranded openers. `fit-options`: every option row fits.
`check-labels`: no collisions. Proofs of pages 3, 10, 18, 26 and 28 were
read; the stepped examples and the Beyond pages set cleanly.

**Colour.** Pages 1, 2, 4, 6, 7 and 12 were read in greyscale and under
simulated deuteranopia, protanopia and tritanopia (`build/check-colour.mjs`).
Nothing depends on hue alone: Fig. 7.2's two trapeziums differ in lightness
and in position, Fig. 7.1's removed corner is white and dashed, and the
opener's filled box is marked *fill it*.

### Short pages, logged

| page | fill | held by (`gaps`) |
|---|---|---|
| 6 | 80% | the § 7.5 `h2`, which may not be stranded |
| 9 | 87% | the § 7.7.1 `h3` |
| 13 | 69% | the summary, indivisible; page 14 (60%) is the close |
| 20 | 81% | Example 12, a panel |
| 22 | 77% | the Type 7 `h3` with its example |
| 26 | 81% | Q31, a case question that cannot be divided |
| 27 | 31% | **Q31 alone, before the Answers stage, which always opens a page** |
| 29 | 51% | the last page |

### Flagged, not done

- Stage 1 keeps its coaching sentences (*the trick is the same*, *the trap,
  and it is set on purpose*), because it is kept word for word.
- Ex 7.2 Q7 asks for the rhombus's side from its diagonals *using a result
  from Chapter 5*; the side needs Pythagoras (Mathematics II), as Q9 does
  (flagged below since the language edit). `ANSWERS.md` gives 5 cm and says
  so.
- p010 (built page 10): *two conversions carry everything* stands above a
  table of three.
- § 7.8's cake, ice, mouse and elephant are general claims, not dated
  facts; no *Did you know?* in the chapter needs a source.
- The π note on built page 8 still says only which approximation is used;
  the older flag below stands.

Language edit, 27 pages (p001–p015 chapter proper, p101–p112 Beyond the Book).
Build after editing: 27 pages, 0 stranded openers, no label collisions, every
option row fits. All 38 answers in Stage 4 checked against the questions — all
correct, including every π calculation and every scale factor.

8 fixes in 27 pages — the lowest count in the volume. The chapter is built on
two sentences ("cut the figure into pieces whose areas you already know" and
"volume is the area of the base times the height") and it keeps saying so; every
formula is derived rather than issued, including the trapezium by the
two-copies-make-a-parallelogram argument, which is the best page in the chapter.
§ 7.8 on why area and volume do not grow together is the most useful thing in
the volume for a reader who will never study mathematics again.

Its one repeated instruction is the right one: check the unit. "An area that
comes out in metres, or a volume in square centimetres, is wrong before the
arithmetic is looked at."

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted. Practice Q30 was moved by hand from the page before to the page with Q31, so both case-based questions sit together under their head and Q31 no longer stands alone before the Answers stage (fills 81% / 31% → 48% / 65%). Every rupee amount written as `₹$…$` is wrapped in `<span class="nb">`, so the sign can no longer end a line with its number on the next. Nothing reflowed; `check-numbers.mjs` gives the same count of claims with and without the spans.

## FIXED

| before | after | check |
|---|---|---|
| **p001** "Keeping the two apart is the whole discipline of this chapter" | "…the whole job of this chapter" | L1 |
| "A great deal of the marks lost here are lost by…" | "Most of the marks lost here are lost by…" | L3 — *marks* are countable; the original is not English |
| **p003** "The formula runs backwards, and where it does the work is Chapter 6's" | "…and when it does, the work is Chapter 6's" | L3 |
| **p004** Q9 "Somebody computes the area of a trapezium" | "Somebody works out the area of a trapezium" | L1 |
| **p007** "That last remark is not a throwaway." | "That last point is worth taking seriously." | L3 — idiom |
| **p011** "a great deal more opportunity to drop a nought" | "a great deal more chance of dropping a zero" | L1 — *nought* is British-only |
| **p014** Q1 "A cube's edge is trebled." | "A cube's edge is tripled." | L1 — and matches the *triple* used in Chapters 1 and 2 after their edit |

No refitting needed for the chapter proper.

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p006 Exercise 7.2 Q9 | M1 | "Show that the formula $\tfrac12 d_1 d_2$ gives the right answer for a square of side $s$, **given that a square's diagonals are each $s\sqrt{2}$ long**." Two problems in one clause. The diagonal of a square is $s\sqrt{2}$ only by Pythagoras, which is taught in **Mathematics II** Chapter 2 — the next volume, exactly as in Chapter 5's Example 7. And $s\sqrt{2}$ is a surd: Chapter 1 fixed $\sqrt{\ }$ as a number's positive square root, but a length written as a multiple of $\sqrt{2}$ appears nowhere else in Class 8, and Chapter 1 p014 says plainly that $\sqrt{2}$ cannot be written down exactly. | Drop the question, or defer it. Note that it is *given* the fact, so a student can grind through it — but the question is then asking them to trust a number the book has told them is not writable. Second cross-volume Pythagoras dependency in this volume; see CROSS-CHAPTER.md. |
| p008, p011, and every π question | M1 | $\pi$, the circumference $2\pi r$ and the circle's area $\pi r^2$ are used throughout, and none is introduced. p008 says only "Throughout this chapter $\pi$ is taken as $\tfrac{22}{7}$ where the numbers invite it and $3.14$ otherwise" — a note about which approximation, not about what $\pi$ is. Class 7 met circles, and Class 9 Chapter 5 (Exploring Circles) is where this book treats them; between the two, this chapter is the only one in Class 8 that needs them. | One sentence of the kind p004 of Chapter 5 uses for the triangle angle sum: say that the circle results are assumed here and come back in Class 9. |
| p013 | M1 | "the strength of a leg goes up with the area of its **cross-section**" — a term from science, unglossed, in the sentence that carries the chapter's best idea. The elephant-and-mouse paragraph is the part a reader will remember, and this is the one phrase in it that can stop them. | "…with the area of the slice across it", or a two-word gloss. |
| p102 (built page 17), p107 (built page 22) | — | Page 17 runs 1.1mm into the bottom margin; page 22 is 79% full with 43mm of white at the foot. **Neither file was touched by this edit.** Both pre-date it. | `refit bridge` would settle both. Recorded so they are not later attributed to the language pass. |
| p010 Q9 | C5 | "Show that if all three measurements are doubled, the surface area becomes four times as large — and say what that has to do with Chapter 1." Chapter 1 is squares and cubes, and the intended link is presumably that doubling a length squares into a factor of four. But § 7.8, three pages later, is the section that actually makes this point, and it credits Chapter 2 for the exponents rather than Chapter 1. So the question points at one chapter and the explanation at another. | Point the question at § 7.8, or at Chapter 2 where § 7.8 sends the reader. |
