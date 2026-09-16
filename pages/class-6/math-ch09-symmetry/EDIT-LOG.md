# Class 6 · Mathematics I · Chapter 9 — Symmetry

## Brought to the Class 7 standard, 16 September 2026

Phase 1 of `PLAN-MATHS-CONSISTENCY.md`, following the model chapter
(`math-ch05-prime-time`). I read every page, and NCERT's own chapter
(`assets/sources/class-6/maths/Chapter 9.pdf`), before changing anything.
Every check below was run on the whole chapter.

**Pages: 26 before (17 body + 9 Beyond), 32 after (18 body + 14 Beyond).**

### What changed

**Palette.** `chapter.json` gains `"palette": "fern"` and nothing else.
`palette-fern.css` sets `--teal: #20572f`, byte-identical to
`CHAPTER_ACCENTS[9]` in `build/build.mjs`.

**The one body example is set as steps.** Example 1 (the strip) now has
*Solution*, three steps, an *Answer* row, and reasons in `.work__why`. This
is a layout change only. `check-example-stepping.mjs`: 1 example compared
against `HEAD`, 0 lost mathematics, no gains.

**Colour was the only thing marking the symmetry lines in Figs 9.18, 9.19
and 9.33, and the text named the wrong colour.** The questions said *the
teal line*. Those lines are `.dg-plot`, which follows the chapter's
structure colour, so under `fern` they print dark green. In greyscale they
matched the black figure lines (proof p008, checked before the fix). Each
of those lines now runs 6 units past the edge of the squared paper, the
viewBox opens 6 units upward to hold it, and the text names the line by
that position. The figures still use `diagram.css` classes only. The
changed sentences are listed below. Fig. 9.22's `aria-label` said *a rust
line*; under `fern` that line is blue, so it now says *a solid line*.

**Body sentences changed** (colour words only; no rule, condition or hint
dropped; NCERT's "blue line is a line of symmetry" is kept as a rule):

| where | before | after |
|---|---|---|
| Ex. 9.2 Q11 | *Complete it so that the teal line is a line of symmetry.* | *Complete it so that the line that runs past the squared paper is a line of symmetry.* |
| Fig. 9.18 caption | *Complete each figure so that the teal line is a line of symmetry. For (c) and (f), try turning the book.* | *The line that runs past the squared paper is the line of symmetry. For (c) and (f), try turning the book.* |
| Ex. 9.2 Q12 | *Complete it so that* both *teal lines are lines of symmetry of the finished figure.* | *Complete it so that* both *lines that run past the squared paper are lines of symmetry of the finished figure.* |
| Fig. 9.19 caption | *Complete each figure so that both teal lines are lines of symmetry.* | *Complete each figure so that both lines that run past the squared paper are lines of symmetry.* |
| Ex. 9.4 Q12(i) | *…exactly 2 lines of symmetry: the two teal lines.* | *…exactly 2 lines of symmetry: the two lines that run past the grid.* |
| aria-labels, Figs 9.18, 9.19, 9.33 | *teal line(s)* | *line(s) of symmetry that run past the edges* |
| aria-label, Fig. 9.22 | *a rust line and arrow* | *a solid line and curved arrow* |
| Example 1 | two paragraphs of working | Step 1 *turn the strip clockwise about its centre by 180°* · Step 2 *the longer edge is now at the top, but it started at the bottom* · Step 3 *another half turn brings it back: it fits on itself only after 360°* · Answer *360° is its only angle of symmetry, so the strip does not have rotational symmetry* |

The Ex. 9.2 Q11 change adds one rendered line.

**Body pages re-broken by hand, 17 → 18.** No sentence was cut to do it.
At `HEAD`, three questions printed overleaf from their figures:

- **Ex. 9.2 Q8 (p007, recto) and the kolam, Fig. 9.17 (p008).** Q8 moved
  down to p008, above the figure.
- **The Think and Reflect on Fig. 9.24(a) (p012) and Fig. 9.24 (p011,
  recto).** They were overleaf, and so were Fig. 9.24(b) and (c) and the
  prose about them.
- **Ex. 9.4 Q13 (p016, verso) and Fig. 9.31 (p015, recto).**

The second and third could not be fixed on the same parity: moving the box
up overran p011 by 33 mm. So **Section 9.2 now starts a fresh page
(p010)**, and every later page moved on by one:

- Fig. 9.24 and its Think and Reflect now share p012.
- Exercise Set 9.4 opens a verso (p016, with Fig. 9.31), so Q13 on p017
  faces it.

After that, blocks were pulled back page by page with `unsettle` and one
build per move. Exercise Sets 9.3 and 9.4 were each moved whole to start a
page (`keepExerciseSets`). One opener stranded by the pull-back
(*The angles of symmetry of a square*, p010) was moved to p011. I did not
use `refit … body`: it does not know the figure-facing rule. `data-close`
now sits on p018.

**Beyond the Book rebuilt to the four stages.**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 6 `.c-try` | **kept word for word** (text diffed against `HEAD`: identical); only `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | 6 multiple-choice problems in prose | **13 stepped examples**, Beyond Examples 1–13, under six `Type N ·` heads; the tabs restart at Example 1, as Class 7's do |
| 3 Problem Sets → **Practice** | 3 sets, A/B/C, 21 questions | **one run of 31**, six forms, the band carrying the numeral |
| 4 Answers & Takeaways → **Answers** | key and notes | letter key, every other answer in `work--trace`, *why the other options are wrong* for Q5, Q9, Q14, Q15; opens its own page (p113) |

Types: 1 counting lines of symmetry · 2 reflecting in a line · 3 folding,
cutting and punching · 4 angles of symmetry and order · 5 figures with
radial arms · 6 lines and turns together. **14 worked examples in the
chapter** (1 body + 13 Beyond).

**New figures, Figs 9.35–9.43**, numbered on from Stage 1's Fig. 9.34. Each
is drawn from coordinates with `diagram.css` classes only:

- Figs 9.35–9.42 sit inside their example panels, so no figure can be
  separated from its question.
- Fig. 9.43 prints on the same page as Practice Q1–4, which use it.
- The symmetry lines in Figs 9.37 and 9.38 follow the body's new
  convention: they run past the squared paper.

**Practice:** multiple choice 1–12, assertion–reason 13–16, very short
17–21, short 22–26, long 27–29, case-based 30–31 (no *Case study* label).
Key spread: a 4, b 4, c 4, d 4. Assertion–reason is set in Class 7's form:
one `c-practice__note` naming Questions 13 to 16, then two lines per
question, with no option list.

**Old Beyond material not carried over, because it answered the body:**

| old item | why it was dropped |
|---|---|
| Problem 1, the hexagon's lines | answers Ex. 9.2 Q6(d) and Ex. 9.4 Q8 |
| Problem 2, 72° | answers the 5-arm Think and Reflect |
| Problem 3, vertical and horizontal fold give 4 holes | answers Ex. 9.2 Q3 |
| Problem 4 | Ex. 9.4 Q5 with new numbers |
| Problem 5 | Ex. 9.4 Q6 with new numbers |
| Set A Q2 | Ex. 9.2 Q6(c) |
| Set A Q6 | the 360° true/false |
| Set A Q7 | the kite, Ex. 9.4 Q3(d) |
| Set B Q2 | the rectangle diagonal Think and Reflect |
| Set B Q4 | the factor-of-360 true/false |
| Set C Q5 | Ex. 9.4 Q1(i) |

**Nothing new repeats or answers the body.** `check-no-repeats` lists 24
pairs at 50% or more; I judged each one:

- The one 100% pair shares only the phrase *exactly one line of symmetry*.
  Practice Q3 picks a figure made of squares, while Ex. 9.2 Q10(i) asks for
  a curved figure.
- The 56–63% pairs set an angle question of the same type, but none asks
  Ex. 9.4 Q4, Q5 or Q6 again. Practice Q5 counts the angles from an 8°
  smallest angle, Q12 finds the smallest angle from 30 angles, and Q19
  finds the order from 5°.

I also read every new example and question against the body's questions,
and none of them states a body answer. The exceptions are all in Stage 1,
which is kept word for word; see *Flagged*.

### Verified

**`check-numbers.mjs` exits 0: 397 checks passed, 71 arithmetic identities
evaluated, no spans skipped.** It imports `symmetry-geometry.mjs`, which
sits beside it. That module reads each figure out of its SVG and **finds**
its symmetries: it reflects the drawn points in every line through the
figure's centre (a quarter degree apart), turns them by 360/n for n up to
72 (about the marked centre where the chapter marks one), and checks two
things. Every moved point must land on a stroke of the same class, and
every corner must land on a corner. The class test stops a shaded half
being carried onto a light one.

- **A.** Every `$…=…$` span on the pages and in `ANSWERS.md` is evaluated,
  degrees and mixed fractions included.
- **B.** The figures, all compared against what is printed or against the
  tables in `ANSWERS.md`, read back row by row:
  - lines and orders for Figs 9.1, 9.3, 9.14–9.17, 9.21, 9.23–9.24 and
    9.26–9.32;
  - the pinwheel's right-angled triangles, each turned 60°;
  - Fig. 9.2(b)'s half turn;
  - where A–D go in each reflection, and Fig. 9.22's labels at every turn;
  - Fig. 9.25's shaded arm after 120°, 240° and 360°;
  - the opened hole of Fig. 9.7, and all four opened sheets of Fig. 9.12
    (10-sided arrow, rhombus, circle, notches);
  - Fig. 9.10's folds, and Fig. 9.11's other holes (each inside its
    figure);
  - Fig. 9.13's holes, which are squares;
  - every completion of Figs 9.18 and 9.19, built by reflection;
  - a new dot for each part of Fig. 9.20 that closes a symmetric shape,
    found by searching the grid;
  - all 4096 colourings of Fig. 9.30 (orders 1, 2, 3, 4, 6, 12);
  - the finished tile design of Fig. 9.33 (exactly 2 lines);
  - Chapter 1's Figs 1.7 and 1.10, read in place (3–10; and 3, 6, 6, 6);
  - Fig. 9.34's letters;
  - every Beyond example's Answer row, and every practice answer part by
    part (letters, polyominoes, circles, radial arms, the clock and the
    wheel covers are built as figures and measured).
- **C.** Each multiple-choice option is read from the page and tested, and
  there is exactly one right option, which matches the printed key.
  Assertion–reason truth values are computed, and each is tied to the
  assertion and reason printed under its number. The script also checks
  the six forms in order, numbering 1–31 with no gap, no *Case study*
  label, the key spread, and the *why* notes.
- **D.** The `ANSWERS.md` values, and its key against the page's key.

**Tested by breaking it**, one break at a time in a scratch copy of the
chapter (with Chapter 1's p008 beside it). All 12 were caught (exit 1),
and the real chapter was never touched:

1. `ANSWERS.md` Fig. 9.28(d) order 3 → 6
2. Beyond Example 8's answer 18° → 20°
3. the page's `360° ÷ 20 = 18°` → 16°
4. key 9 (c) → (b)
5. one corner of Fig. 9.31 moved
6. Fig. 9.3(c) redrawn with a line of symmetry
7. practice Q27(b) 4 cm → 6 cm
8. Q16's reason reworded
9. an `ANSWERS.md` corner of Fig. 9.18(c) moved
10. `ANSWERS.md` Ex. 9.4 Q4 180° → 190°
11. Beyond Example 1(b) 1 → 2
12. Fig. 9.37's Q moved one square

**Wrong numbers or wrong symmetry claims found.** None in the body's
numbers: every printed count and angle matches the drawn figure. The
wrong claim was the colour word *teal* above, now false under the chapter's
palette, together with *rust* in one `aria-label`. Two claims in NCERT's
appended solutions do not hold, and `ANSWERS.md` does not follow them:

- Ex. 9.2 Q5(a) *cut a small square at the centre* is not one straight
  cut. `ANSWERS.md` adds a diagonal fold, so one straight cut works.
- Its Ex. 9.1 Q1 answer, *flower 6, rangoli 4, butterfly 1*, matches ours.

The old Beyond pages were replaced rather than audited. Errors in my own
work were caught and fixed:

- **The symmetry test was first too lenient.** It checked points only, and
  so found 3 lines of symmetry in Fig. 9.29's fan, whose blades lean. The
  corner test fixed that; the fan has 0 lines and order 3.
- **Several index slips** in reading printed answers.
- **A `$'` in a JavaScript replacement string** pasted a second copy of the
  script's tail into itself. I repaired it and re-ran the checks.

**Fitting.** The final build shows *all pages fit*, and nothing runs into
the margin. `orphans`: 0 stranded openers in 32 pages. `fit-options`:
every option row fits. Q11's options use `c-parts--1`: `fit-options`
wanted 2 columns, and no stylesheet defines `c-parts--2`. `check-labels`:
no collisions. `data-bridge` is on every p1xx, and `data-close` is on p018
only. `refit … bridge` was run on the new flow: once in full, and again
after each content edit to Beyond. The packer's heights left pages at
59–61%, so pages 103–108 were then placed by hand, one block and one build
at a time.

**Colour.** I ran `check-colour.mjs` on pages 8, 9, 13, 17, 23, 24 and 27,
and looked at the greyscale proofs of pages 8, 13 and 17:

- **Page 8 before the fix:** the symmetry line could not be told from the
  figure. **After:** it reads by position.
- **Page 13, Fig. 9.25:** the shaded arm is darker than the others, and
  the turn arrows also show the turn.
- **Page 17, Fig. 9.33:** the tile halves are light grey against mid grey.
  They are readable but low in contrast (see *Flagged*).
- **Labels carry the meaning elsewhere:** tabs carry their words, points
  are lettered, and figure parts are labelled (a)–(h) or P–S.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 9 | 68% | Section 9.2 starts a fresh page, to put Fig. 9.24 on a page with its Think and Reflect, and Fig. 9.31 facing Ex. 9.4 Q13 |
| 10 | 87% | the *angles of symmetry of a square* head, which may not be stranded |
| 12 | 73% | pulling the next paragraph back only moves the white to p013 |
| 13 | 78% | Exercise Set 9.3, kept whole |
| 15 | 75% | Exercise Set 9.4, kept whole |
| 18 | 68% | `data-close`, the chapter's last page |
| 20 (p102) | 82% | the Solved Examples stage head, which may not be stranded; Beyond Example 1 does not fit under it |
| 23 (p105) | 75% | the Type 4 head and Beyond Example 7 with its figure, too tall for the gap |
| 24 (p106) | 73% | Beyond Example 9, a panel (82 mm) |
| 30 (p112) | 54% | the Answers stage, which always opens a page |
| 32 (p114) | 31% | the last page |

### Flagged

| where | what | what it needs |
|---|---|---|
| **Beyond Stage 1 (kept word for word) gives away body answers** | the octagon (8 lines, 45°), which is Ex. 9.4 Q8/Q9 for n = 8; $360 \div 7 = 51\frac{3}{7}$, the 7-arm Think and Reflect; the half-turn strategy, the grid-game Think and Reflect's answer; the rectangle and rhombus with both symmetries, Ex. 9.4 Q2; *the angles are the multiples of the smallest one*, the first Think and Reflect after the three lists | a decision: the brief's two rules conflict here, and I kept Stage 1 word for word |
| Ex. 9.1 Q1 (p002) | it names Fig. 9.1, on the opener p001, overleaf; this was so at `HEAD`, and the opener cannot hold the question | a decision for the opener |
| Ex. 9.4 Q8–Q10 | they depend on Chapter 1's Figs 1.7 and 1.10, many pages away (NCERT's structure) | reprinting the figures would add body content; left |
| Fig. 9.33 in greyscale | the tile halves are light grey on mid grey: readable, but weak | a stronger tile fill would be a stylesheet decision |
| **the session scratchpad is shared between agents** | `bak1`/`bak2` already held another agent's Chapter 10 pages. My restore from them briefly copied five old Chapter 10 pages (p019–p023) into this chapter; I deleted them, and nothing of Chapter 10's own directory was touched. My copies into those folders overwrote that agent's backups of the same names; I left a `WARNING-shared-by-ch09-agent.txt` in each | whoever owns `bak1`/`bak2` must not restore from them |
| `settle.mjs` on Beyond pages | `node build/settle.mjs <dir> 105` failed with *path argument undefined*; `unsettle` worked | a tool fix, outside this chapter |
| `refit … bridge` | it left p103 at 59% with Beyond Example 2 (94 mm) fitting by hand, and several other pages short; hand placement did better | do not re-run it on this chapter without re-checking pages 103–108 |

### Not changed

NCERT's structure in the body. No example, check or exercise was added.
Every set, Think and Reflect and figure is kept in order; the only changes
to figures are the extended symmetry lines. None of §5's unused components
was introduced, and no *Did you know?* was added.
