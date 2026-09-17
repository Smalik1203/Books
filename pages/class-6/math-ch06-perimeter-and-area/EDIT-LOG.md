# Class 6 · Mathematics I · Chapter 6 — Perimeter and Area

## Syllabus audit fixes, 17 September 2026

The Beyond the Book audit made two findings here, and both were gaps: topics the
body teaches that no Solved Example worked. I read the body and all of
Beyond, and confirmed both. The chapter proper was not touched.

| finding | what I did |
|---|---|
| gap: comparing tangram areas (§6.5) | **New Example 9** under Type 5. A 4 cm square card is cut into four pieces (new **Fig. 6.23**). The pieces are compared by covering: C covers D, C and D cover B, and B, C and D cover A. That gives A = 4C and B = 2C. The card is 8C = 16 sq cm, so C = 2 sq cm. The dissection is new on purpose, because working the body's own tangram (Fig. 6.12) answers Exercise 6.5. That is why the earlier tangram example was removed (see below). |
| gap: figures of unit squares, and how adding or moving one changes the perimeter (Exercise Set 6.10) | **New Example 11** under Type 6. An L of 6 unit squares (new **Fig. 6.24**) with two dashed places. The new square at P covers 2 sides and adds 2, so the perimeter stays 14. At Q it covers 1 and adds 3, so the perimeter is 16. No general rule is stated, and nothing about 9 squares, so Exercise 6.10 and the Think and Reflect after Fig. 6.18 stay unanswered. |

**Renumbering.** Beyond's old Examples 9–13 are now Examples 10, 12, 13, 14 and 15. I updated `ANSWERS.md`'s example table (now 1–15) and `check-numbers.mjs` to match. No running text or Answers row cited those numbers.

**Fitting.** The two examples first took Beyond from 11 to 13 pages, and Example 15 sat alone on a page at 24%. Practice cannot start under it, because
`keepExerciseSets` keeps the three-page run whole. Three trims closed the gap:
- Example 11's question now fits on one line, and its closing remark became Step 2's reason (*same perimeter*).
- Fig. 6.24 was set on a wider grid, so it prints shorter at the same width.
- Beyond Example 10's Step 3 (*the area grows as the two sides get closer*)
was folded into its Answer row. No mathematics was lost.

After these trims, Type 7 and Example 12 fit on p106, and Example 15 joins p107.
Short pages left: p103 76% and p105 84%, both held by a whole example panel.

**Pages: 30 before (19 body + 11 Beyond), 31 after (19 + 12).** Solved
Examples: 15 in Beyond (was 13).

**Checks.**
- `check-numbers.mjs`: 653 checks pass. It now reads Fig. 6.23: piece areas, each covering claimed, the areas in units of C, and that C and D have equal sides. It also reads Fig. 6.24: cell perimeters, the sides shared at P and Q, the step arithmetic and the outline. Both Answer rows and both captions are checked.
- Seven deliberate breaks, made in a scratch copy, were all caught:
  - B 4 → 5;
  - a corner of D moved;
  - a square of Fig. 6.24 moved;
  - Q 16 → 18;
  - Step 1 14 → 12;
  - `ANSWERS.md` 16 → 15;
  - Example 11's tab renumbered.
- `build.mjs --png`: all pages fit.
- `orphans`: 0.
- `fit-options`: clean.
- `check-labels`: clean.
- `check-colour`: run on p024 and p025.
- `check-no-repeats`: the new examples raise no pair.

## Brought to the Class 7 standard, 16 September 2026

Phase 1 of `PLAN-MATHS-CONSISTENCY.md`, following the model chapter
(`math-ch05-prime-time`). I read every page before changing anything, and
ran every check on the whole chapter.

**Pages: 27 before (18 body + 9 Beyond), 30 after (19 body + 11 Beyond).**

### What changed

**Palette.** `chapter.json` gains `"palette": "indigo"`. In
`palette-indigo.css`, `--teal` is `#404479`, the same value as
`CHAPTER_ACCENTS[6]`. Nothing else in `chapter.json` changed.

**All six body examples are set as steps.** Each one now has *Solution*, a
step to a `.work__row`, an *Answer* row, and a two-to-four-word
`.work__why`. The change is layout only.
`check-example-stepping.mjs`: 6 compared against `HEAD`, 0 lost
mathematics. Two numbers gained an occurrence, both expected: body Example 5's
Answer row restates 21, and body Example 6's reason ("the shared side is 4 cm")
restates 4. Body Example 5's prose explanation became its Steps 1–2. Its three
sentences were merged into two rows so the page fits (see *Fitting*). The
merged rows keep every expression, `$12 \div 8 = 1\frac{1}{2}$` included.

**Beyond the Book, rebuilt to the four stages.**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 6 `.c-try` | **kept word for word**; only `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | 6 multiple-choice problems in prose | **13 stepped examples**, Beyond Examples 1–13, under eight `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 sets, A/B/C, 23 questions | **one run of 31**, six forms, the band carries the numeral |
| 4 Answers & Takeaways → **Answers** | key and notes | letter key, every other answer in `work--trace`, *why the other options are wrong* for Q8, Q10, Q13, Q16 |

The eight types: perimeter of rectangles, squares and regular polygons;
going round more than once; straight and diagonal units; area of rectangles
and squares; areas made of pieces; same perimeter, different areas; area of
a triangle in a rectangle; plans and area mazes. Every topic in the chapter
is worked at least once. With the body's six, the chapter has **19
examples**.

**One new figure,** numbered after the body's last and drawn only with
`diagram.css` classes: **Fig. 6.22**, a shape on dot paper, for Beyond Example 4.
It reuses Fig. 6.5's dot grid and plot classes, and it sits inside the
example's panel, so it cannot leave its question.

**Beyond Example 8 was replaced in review.** The first version (then numbered Example 14) found the areas
of tangram pieces on an 8 cm square, drawn as a Fig. 6.23. Its steps
answered Exercise 6.5: the square is 16 copies of Shape $C$ (Q6), $G$ is two
$C$s and $A$ four (Q5), next to Q2's relation between $C$, $D$ and $E$. That
breaks the rule that nothing in Beyond answers a body question. It is now a
**lawn 10 m by 8 m with a 2 m square pond in the middle, whose grass area
(76 sq m) is found two ways**: whole take away hole, and strips around the
pond. It stays in Type 5, *Areas made of pieces*, beside Beyond Example 7. Fig.
6.23 was removed with it, so Fig. 6.22 is the last figure and no number is
skipped.

The new example is shorter, which left the page before Practice at 57%. So
**Beyond Example 11 was added** to Type 7: triangle $ABC$ with a 6 cm base and its
corner 4 cm above a point 4 cm along, cut along the height into two halves
of rectangles (8 + 4 = 12 sq cm). It applies Section 6.3's method to a new
triangle and answers no body question. It is not practice Q27, which works
from an area back to a width. The two examples after it are now Beyond Examples 12 and 13.

**Practice forms and numbering:**

| form | questions |
|---|---|
| multiple choice | Q1–12 |
| assertion–reason | Q13–16 |
| very short answer | Q17–21 |
| short answer | Q22–27 |
| long answer | Q28–30 |
| case-based (no *Case study* label) | Q31 |

The key uses each letter four times (a 4, b 4, c 4, d 4). Some old Set A–C questions were kept
where they did not repeat the body. Old Set A Q9 (counting squares) and Set
C Q3 (a 10 cm rectangle cut into 24 and 36) were dropped: they are Exercise
6.6 Q3 and Exercise 6.12 Q2 with new numbers.

Assertion–reason follows Class 7's form, as the coordinator corrected on 16
September. One `<p class="c-practice__note">` states the four choices once
for Q13–16, and each question is *Assertion (A): … / Reason (R): …*, with
no option list of its own.

A second case-based question (three photo frames with the same perimeter)
was written and then removed. On its own, it filled a Beyond page to 31%,
and its idea is Beyond Example 9's. Removing it took Beyond from 12 pages to 11;
31 questions remain.

**One example became a question.** Fitting first put the last example alone on a
page at 24%. I removed an earlier Type 7 example (find a rectangle's width from a
triangle's area), so the last two examples fit on the page before. That
question type returns as practice Q27, with new numbers.

**Nothing repeats the body.** I judged every pair that
`check-no-repeats.mjs` printed. The closest pairs are *same type, different
question*:
- Beyond Example 13 (three rectangles; their height must be found first) against
  Exercise 6.12 Q7.
- Q19 (counting squares worked backwards) against Exercise 6.6 Q3.
- Beyond Example 4 (a new shape, and its area too) against Exercise 6.3 Q1.

The other pairs share words only.

**`ANSWERS.md`** answers every question the chapter sets: all 13 exercise
sets, every Think and Reflect, the questions in the running text (Figs 6.5,
6.14, 6.18, the circle), and Beyond's practice. It gives the working, what
each drawing must show, and a worked instance under each *answers will
vary*.

**Body prose, edited only to fit** (§11 allows writing to fit; no content
was added):

| page | before | after |
|---|---|---|
| p011 | *Most shapes will cut through some squares, so follow these rules.* | *…some squares at their edge. These part squares are counted by four rules, and the rules give an estimate of the area, not an exact value.* (+1 line; the summary already says "found, or estimated") |
| p017 | *In an area maze, a figure is made of rectangles. Some areas and some side lengths are given. Use them to find the missing value. You will not need to find every length in the figure.* | *An area maze is a figure made of rectangles, with some areas and sides given. Find the missing one. You will not need every length in the figure.* The last sentence was first cut as a repeat of Example 5's closing line, and put back in review: the intro states the rule and Example 5's *we found the area without finding a single length* shows it working, so cutting it lost the rule. Page 17 now runs 2.6 mm into the margin, inside §5a's 3 mm. |
| p017 | *In some puzzles a length is missing instead of an area. Then work the other way: divide an area by a side you know, to find the side you do not know.* | *If a length is missing instead, divide an area by the side you know.* |

**Two decisions from review (the user's).**

- **Fig. 6.8 is printed a second time, beside Exercise Set 6.6.**
  - *Why:* Exercise 6.6 Q1 asks about the shapes in Fig. 6.8, which prints
    on p007 with Exercise 6.3, four pages earlier. §5a requires a question
    to be on its figure's page or facing it.
  - *What:* the SVG was copied, not redrawn, to the foot of p010, which
    faces Q1 on p011. Its caption reads *Fig. 6.8 (repeated from Section
    6.1, for Exercise Set 6.6)*, so no later figure is renumbered, and its
    aria-label is the original's with *(repeated)* added.
  - *Effect on the pages:* the copy fit into p010's white (70% → 94%), so
    no page was added and nothing else moved. No `refit … body` was run.
  - *Checks:* `check-numbers.mjs` confirms the two copies draw identical
    shapes, that Q1's areas (4, 9, 10, 11) read from the copy, and that the
    copy is on Q1's page or facing it. Moving one corner of the copy made it
    fail; the corner was restored.
- **The Think and Reflect after Fig. 6.20 was reworded.** This is our own
  wording, not NCERT's, and two pairs of rooms qualify.

  | before | after |
  |---|---|
  | *Which two rooms in Charan's house have the same area? Do they also have the same perimeter?* | *Which rooms in Charan's house have the same area? Do they also have the same perimeter?* |

  `ANSWERS.md` now answers it directly: kitchen and small bedroom (180 sq ft,
  54 ft each), and utility room and parking (45 sq ft, 36 ft each).

**Beyond renumbered to match Class 7.** Beyond the Book's Solved Examples
now start again at Example 1, as every Class 7 chapter's do. So the body
keeps Examples 1–6 and Beyond has Examples 1–13, where they were 7–19. The
tabs and Fig. 6.22's caption ("for Example 4") changed; nothing was
refitted. Throughout this log and in `check-numbers.mjs`, an example is
named *body* or *Beyond* so the two runs cannot be confused. `ANSWERS.md`
lists Beyond's examples by their own numbers.

### Verified

**`check-numbers.mjs` exits 0 with 625 checks passed.** It has four parts:
- **A. Arithmetic.** 119 identities read off the pages and 148 off
  `ANSWERS.md` are evaluated. Three spans have fewer than two numeric sides
  (`$CD = AB$`, `$DA = BC$`, and the equilateral-triangle line); the
  script names them.
- **B. The figures.** The script reads the geometry out of the SVGs:
  - rectangles, polygons, lines and circles for Figs 6.1–6.22, scaled by
    each figure's printed length;
  - straight and diagonal units, and areas, for Figs 6.5, 6.8 and 6.22;
  - contact lengths for Fig. 6.7;
  - shoelace areas for Figs 6.11, 6.12, 6.14, 6.15 and 6.16;
  - square-cell perimeters for Figs 6.17 and 6.18, plus every free place
    next to Fig. 6.18;
  - circle counts and overlap for Fig. 6.13;
  - every room of both house plans, checked against the sides and areas
    printed on the plans;
  - all four maze puzzles.

  It also covers the Exercise 6.2 track positions and race starts, and the
  Answer row of all 19 examples, named *body Ex N* or *Beyond Ex N*; the body's tabs must read 1–6 and Beyond's 1–13. Beyond Example 8's grass is also counted in 1 m squares, and Beyond Example 11's triangle is checked by shoelace. Every practice answer is read back from the
  page, one lettered part at a time.
- **C. Keys.** Each multiple-choice question has exactly one right option,
  and it matches the printed key. The options and the key are read from the
  page; the assertion–reason keys come from computed truth values. The key
  spread, the 1–31 numbering and the order of the six forms are checked
  too.
- **D. `ANSWERS.md`.** Its values are recomputed and looked for in the file.

**The script was tested by breaking numbers on purpose,** each in a scratch
copy of the chapter. Every break was caught:
1. practice Q27, 8 cm → 9 cm;
2. body Example 3, `= 11 sq m` → 12;
3. one corner of Fig. 6.16 (e) moved;
4. key 13, (c) → (b);
5. `ANSWERS.md`, Charan's hall 265 → 256;
6. Q29(b), perimeter 14 → 16 — a value that a whole-row check would have
   let hide behind (c)'s 16;
7. "Area = 225 sq ft" on Fig. 6.19 → 252;
8. the new Beyond Example 8's Answer row, 76 sq m → 67;
9. Beyond Example 5's tab changed to "Example 6" (the tab sequence check).

**Wrong numbers found:** none in the chapter body, whose every printed value is now re-derived. The old Beyond the Book was replaced rather than audited line by line; the old questions kept in the new practice run are all re-derived. The errors were in my own work, and each was fixed before
publishing:
- In the script: an attribute regex that skipped `x1`/`y1`, so every
  `<line>` read as 0; a wrong formula for maze (b) (6 instead of 9); Fig.
  6.17 cells read without their offsets; and a label filter that missed
  "5 ft ×".
- In an answer row: a collapsed escape (`\times` arrived as a tab), written
  through a JS string. I rewrote it with `String.fromCharCode(92)`.

**Fitting.**
- The final build clips nothing, and nothing runs into the margin.
- `orphans`: 0 stranded openers in 31 pages.
- `check-labels`: no labels collide.
- `fit-options`: every option row fits its columns.
- `data-close` is on p019 only; `data-bridge` is on every p1xx.
- The Answers stage opens folio 29 (p110), and the page before it (p109,
  97%) holds only practice questions (Q26–31). So no short page is left
  before Answers.
- The *why the other options are wrong* block was divided by hand, a row
  apart, so the first Answers page fills to 93%.

**How the body was refitted, and why not with `refit … body`.** Stepping
overflowed page 16 by 14.8 mm. `refit … body --dry` fixed that, but it put
Fig. 6.21 overleaf from Exercise 6.12. It also left Figs 6.19–6.20 overleaf
from Exercise 6.11, which was already the case at `HEAD`, and it left pages
at 62% and 54%. Instead I measured every block and searched for page breaks
that keep each question on its figure's page or spread. I dealt p008–p019
by hand.

At `HEAD`, three questions printed overleaf from their figures. All three
are now fixed:
- **Exercise 6.5 and the tangram, Fig. 6.12:** now on the same page (p010).
- **Exercise 6.11 and the house plans, Figs 6.19–6.20:** now facing
  (p016–p017).
- **Exercise 6.6 Q1 and Fig. 6.8:** a copy of the figure faces Q1 (p010–p011); see above.

Fitting the house plans cost one page of parity, which is where the short
pages below come from. Three trims made page 17 fit: body Example 5's rows and
the two p017 paragraphs above. Page 17 now runs 2.6 mm into the margin,
after the review restored one sentence there. That is inside the 3 mm bar.

**Colour.** I ran `check-colour.mjs` on pages 1, 7, 10, 13, 14, 18, 22 and
24, and looked at p22 in greyscale and at p24 (then carrying the tangram
figure, since removed) under deuteranopia. The
greyscale and deuteranopia versions of the other pages were written but not
opened. Nothing I looked at relies on hue alone: tangram pieces carry
letters, the example tab carries its word, and Fig. 6.22's sloping sides
are named in the working (as Fig. 6.5's are in the text).

### Short pages, logged

`gaps` names the block holding each page open:

| page | fill | held by |
|---|---|---|
| 9 | 70% | the tangram section (h3, paragraph, Fig. 6.12) must print with Exercise 6.5, and all four together do not fit here |
| 13 | 80% | the house-plan spread's parity; the next page opens with *So triangles BAD and ABE…*, and moving it up leaves page 14 at 77% |
| 14 | 84% | the same parity; the next page opens with the lead-in to Exercise 6.10, which stays with its set |
| 22 | 76% | the *Type 4* head and Beyond Example 5 (73 mm), a panel |
| 30 | 17% | the last page (the end of the Answers stage), exempt |

### Flagged

| where | code | what is wrong | what it needs |
|---|---|---|---|
| Exercise 6.12 Q1(d), Fig. 6.21 | M2 | The printed values make the right rectangle $18 \div 5$ cm high, a decimal the chapter has not taught. The answer (5 cm) can be reached without it. | `ANSWERS.md` uses an argument with no decimals; the puzzle's numbers are NCERT's and were left alone. |
| House plans prose (p015) | — | *Fig. 6.19 is the plan of Charan's house* is the foot of p015, and the figure is overleaf on p016. This is a paragraph, not a question, and was the price of putting the plans beside Exercise 6.11. | Nothing unless the house-plan spread is re-fitted. |
| `refit … body` | tool | It does not know the figure-facing rule. Re-running it on this chapter separates Fig. 6.21 from Exercise 6.12 and the house plans from Exercise 6.11. | Do not re-run it on this chapter without checking those two spreads. |

### Not changed

NCERT's structure in the chapter body: no example, check or exercise was
added, and the 13 exercise sets, the Think and Reflects (one reworded, above) and Figs 6.1–6.21
are as they were, with Fig. 6.8 printed a second time beside Exercise Set 6.6. None of §5's unused components was introduced. No *Did
you know?* was added.
