# Class 6 · Mathematics I · Chapter 9 — Symmetry

## Syllabus audit fixes, 17 September 2026

The Beyond the Book audit made two findings here, both borderline. I confirmed both against the pages, with the one exception noted in the first row. The chapter body was not touched. No example was added: neither finding was a gap.

| finding | what I did |
|---|---|
| Stage 1 Q2 and Q5, and Example 13, rely on "two lines of symmetry at right angles bring a half turn with them". The body never teaches combining two reflections. | **Dropped the general claim, and kept the half-turn check itself.** <br>• **Q2** ended *Reflecting a figure in one of these lines and then in the other has the same effect as a half turn*. It now reads *H and X pass both tests, but each test had to be tried on its own*. The half turn is still found by turning each letter, as the paragraph already does. <br>• **Q5** ended *two lines of symmetry at right angles bring a half turn with them*. It now reads *As with the letters, the half turn was found by turning the figure, not by folding it*. <br>• **Example 13: finding rejected.** Its Step 3 checks the half turn directly (*top bar onto bottom bar, upper right onto lower left*) and makes no general claim, so it is unchanged. |
| Example 9 and Practice Q24 combine two turns (90° and 120° give 30°). The body leaves *are the angles always multiples of the smallest?* open. | As the coordinator directed, **the working now derives the result**, and neither item is labelled. <br>• Two facts come from within the book: Stage 1 Q3 shows that a turn which fits can be repeated from the new position, and the body states that *a full turn of 360° brings every figure back* (§9.2). <br>• **Example 9's steps:** 120° fits, so the picture is the start again. From there a quarter turn fits, and so do three of them, 270° (*as in Stage 1*). 120 + 270 = 390 = 360 + 30, and the full turn brings every figure back (*from the chapter*). The closing line now says the 12 angles come from repeating 30°, as in Stage 1. <br>• **Q24:** the answer row and `ANSWERS.md` give the same derivation: each 80° turn returns the start picture, so five fit (Stage 1, question 3); 400 = 360 + 40, and the full turn brings it back. |

**Solved Examples:** 13, unchanged. **Pages: 32 before (18 body + 14 Beyond), 32 after (18 + 14).**

**Fitting.** One refit, and the layout is the same as before. Short pages, all as before:
- p105: 75%.
- p106: 73%.
- p112: 54%, Q30–Q31 before the Answers page.

**Checks.**
- `check-numbers.mjs` passes 424 checks. New checks confirm that:
  - the general claim is gone in three wordings;
  - the new Stage 1 sentences are printed;
  - H and X each have 2 lines and order 2, found separately;
  - every printed step of Example 9 holds (120, 270 = 3 × 90, 390, 30, the Stage 1 citation, the body's full-turn sentence, 12 angles);
  - Q24's row and `ANSWERS.md` carry the derivation.
- 10 deliberate breaks were all caught. The scratch copy needs `math-ch01-patterns` beside it, because the checker reads Chapter 1's regular polygons.
- `build.mjs --png`: all pages fit.
- `orphans`: 0.
- `fit-options`: clean.
- `check-labels`: clean.
- `check-no-repeats`: only the three pairs it already reported, all different questions.

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
| 1 Using What You Know | 6 `.c-try` | `.c-stage__for` removed; **kept word for word except where it answered the body** — four items replaced and one edited, by the user's decision (see *Stage 1 repaired*) |
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
and none of them states a body answer. Stage 1 did, and has been repaired;
see the next section.

### Stage 1 repaired, 16 September 2026

At first I kept Stage 1 word for word, as the brief asked, and flagged that
five of its items answered body questions. **The user decided that
"nothing in Beyond answers a body question" wins over "Stage 1 word for
word"**, with the smallest repair that works. So:

- Where a sentence pointing back to the body was the whole problem, it was
  deleted.
- Where an item's reasoning was itself the answer, the item was replaced
  with a new `.c-try` and explanation of the same kind and about the same
  length. The new items answer no body question and repeat nothing in
  Stage 2 or Practice (`check-no-repeats` lists no Stage 1 pair; I also
  read them against the body).
- The letters item and the opening paragraph are unchanged.
- No new figure was needed.

| item | the body question it answered | repair |
|---|---|---|
| 1 · the regular octagon: *How many lines of symmetry does a regular octagon have? What are its angles of symmetry?*, with two paragraphs giving 8 lines and the multiples of 45° | Ex. 9.4 Q8 and Q9 (regular polygons, including the octagon) | **replaced** (the reasoning was the answer): *A circle is drawn with one of its diameters. How many lines of symmetry does this figure have? What are its angles of symmetry?* The explanation: a fold must leave the drawn diameter in place, so only it and the diameter at right angles to it work, giving 2 lines; only a half turn leaves it in place, giving 180° and 360°. |
| 3 · *The smallest angle of symmetry of a figure is 40°. How many angles of symmetry does it have? Is 100° one of them?*, answered from *The angles of symmetry are the multiples of the smallest one* | the Think and Reflect *Will the angles of symmetry of a figure always be the multiples of its smallest angle of symmetry?* (the whole working rests on it, so deleting the one sentence was not enough) | **replaced**: *A figure fits on itself after a turn of 90°. Must it fit after 180°, 270° and 45°?* The explanation: two and three quarter turns make 180° and 270°, so both must fit; a square fits after 90° but not after 45°, so 45° need not. |
| 4 · equal radial arms: *…a whole number of degrees: 7, 8, 9, 11, 12?* … *But $360 \div 7 = 51\frac{3}{7}$ and $360 \div 11 = 32\frac{8}{11}$, so 7 and 11 arms do not.* | the 7-arm Think and Reflect (*…exactly 7 angles of symmetry… write it as a mixed fraction*) | **edited** (only the 7 gave it away): *…a whole number of degrees: 8, 9, 11, 12?* … *But $360 \div 11 = 32\frac{8}{11}$, so 11 arms do not.* The rest of the item is unchanged. |
| 5 · *Look back at the game on a grid of 6 rows of 6 squares. How can the second player always win?*, with two paragraphs giving the half-turn strategy | the Think and Reflect after the grid game (*Can you find a way to play that always wins?*) | **replaced**: *The words TOOT, NUN, SOS and MOM are written in capital letters. Which of them look exactly the same after a half turn? Which look the same in a mirror held along an up-and-down line beside them?* The explanation: a half turn needs every letter to survive a half turn and the word to read the same backwards, so only SOS works; a mirror needs every letter to have an up-and-down line, so TOOT and MOM work. |
| 6 · *Draw a four-sided figure that has exactly 2 lines of symmetry. Does it also have rotational symmetry?*, answered with a rectangle and a rhombus, each of order 2 | Ex. 9.4 Q2 (two figures, other than a circle and a square, with both kinds of symmetry) | **replaced**: *Two equal squares touch at one corner only, and a diagonal of each lies along the same straight line. How many lines of symmetry does this figure have? Does it have rotational symmetry?* The explanation: the line through the diagonals and the line through the shared corner at right angles to it, so 2 lines; a half turn about the corner, so order 2. Its last sentence, on H and X, is kept from the old item. |

**Fitting, by hand, with no refit.** The new items ran p101 9.5 mm over.
The trims, each logged:

1. The circle item's closing remark was cut: *One straight line took away
   all but 2 of the circle's lines, and all but 2 of its angles.*
2. Its first two sentences were joined into *A circle on its own folds
   along every diameter, but now a fold must also leave the drawn diameter
   where it was.*
3. The 90° question was set on one line, with no named speaker: *A figure
   looks exactly the same after a turn of 90°. Priya says it must also look
   the same after turns of 180° and 270°. Must it also look the same after
   a turn of 45°?* became *A figure fits on itself after a turn of 90°. Must
   it fit after 180°, 270° and 45°?*, and *Priya is right, and we did not
   need to see the figure.* became *So both of these turns must fit, and we
   did not need to see the figure.*

The second sentence of the circle's turning paragraph was also shortened
to *A half turn about the centre does, because it swaps the two ends. Any
other turn short of a full turn moves it to where nothing is drawn.*

p101 now fills to 100% with nothing in the margin, and p102 to 94% (it was
82%, a short page, which no longer is). Pages p103–p114 are unchanged, and
Answers still opens p113. p101 and p102 had mixed line endings, which
broke an exact-text replacement; both are now plain LF.

**Checked.** `check-numbers.mjs` re-derives every new value and reads each
printed claim back off the two pages:

- the circle with one diameter (2 lines; 180°, 360°);
- a square fits after 90°, 180° and 270° but not 45°;
- the arms offered (8, 9, 11, 12) and those that work (8, 9, 12);
- every word drawn letter by letter (half turn: SOS; mirror: TOOT, MOM),
  with each letter's own symmetries;
- the two squares (2 lines, order 2);
- a guard that Beyond no longer prints *octagon*, $51\frac{3}{7}$, *second
  player*, *rhombus* or *multiples of the smallest one*;
- Stage 1 still has six questions.

**Tested by breaking it**, in the scratch copy; all four were caught:

1. the circle's 2 lines → 3;
2. the mirror words *TOOT and MOM* → *TOOT and NUN*;
3. the arms *8, 9 and 12* → *8, 11 and 12*;
4. the two squares' order 2 → 4.

The flag this repair answers has been cleared.

### Verified

**`check-numbers.mjs` exits 0: 409 checks passed, 66 arithmetic identities
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
chapter (with Chapter 1's p008 beside it). All 12 were caught (exit 1), and so were four more after the Stage 1 repair (below),
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
| 23 (p105) | 75% | the Type 4 head and Beyond Example 7 with its figure, too tall for the gap |
| 24 (p106) | 73% | Beyond Example 9, a panel (82 mm) |
| 30 (p112) | 54% | the Answers stage, which always opens a page |
| 32 (p114) | 31% | the last page |

### Flagged

| where | what | what it needs |
|---|---|---|
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
