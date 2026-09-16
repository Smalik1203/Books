# Class 6 · Mathematics I · Chapter 2 — Lines and Angles

## Brought to the Class 7 standard, 16 September 2026

Phase 1 of `PLAN-MATHS-CONSISTENCY.md`, following the model chapter
(`math-ch05-prime-time`) and Class 7's geometry chapters
(`ch05-parallel-lines`, `ch07-three-lines`). Every page was read before
anything changed, and every check below was run on the whole chapter.

**Pages: 39 before (31 body + 8 Beyond), 43 after (32 body + 11 Beyond).**

### What changed

**Palette.** `chapter.json` gains `"palette": "lagoon"`. `palette-lagoon.css`
sets `--teal: #03526b`, byte-identical to `CHAPTER_ACCENTS[2]` in
`build/build.mjs`. Nothing else in `chapter.json` changed.

**Both body examples set as steps** — *Solution*, a step to a `.work__row`,
an *Answer* row, the reason in a `.work__why`. Layout only.
`check-example-stepping.mjs`: 2 compared against `HEAD`, 0 lost mathematics,
no number gained. The sentences recast as rows:

| example | before | after |
|---|---|---|
| 1 (p016) | *The vertex $A$ is on the centre of the protractor. So count the $1^\circ$ units between the arms $\overrightarrow{AL}$ and $\overrightarrow{AK}$. From $\overrightarrow{AL}$ to $\overrightarrow{AK}$ there are three long marks, one every 10 units.* then the display $\angle KAL = 10^\circ + 10^\circ + 10^\circ = 30^\circ$ | Step 1 *count the $1^\circ$ units between the arms $\overrightarrow{AL}$ and $\overrightarrow{AK}$* (why: *vertex $A$ on the centre*); Step 2 *from $\overrightarrow{AL}$ to $\overrightarrow{AK}$: three long marks* (why: *one every 10 units*); Step 3 the display; Answer $\angle KAL = 30^\circ$. The paragraph on counting medium marks is explanation and stays a paragraph, unchanged. |
| 2 (p025) | *Draw the base $\overrightarrow{QR}$ pointing to the right. Place the centre of the protractor on $Q$, with $\overrightarrow{QR}$ along the 0 line. The 0 on $\overrightarrow{QR}$ belongs to the inner scale, so count up the inner scale to 120, and then 5 more marks. Mark $P$ there, and join $Q$ to $P$.* | Step 1 *draw the base $\overrightarrow{QR}$ pointing to the right*; Step 2 *centre of the protractor on $Q$, with $\overrightarrow{QR}$ along the 0 line*; Step 3 *count up the inner scale to 120, and then 5 more marks; mark $P$ there* (why: *the 0 on $\overrightarrow{QR}$ is inner*); Step 4 *join $Q$ to $P$*; Answer $\angle PQR = 125^\circ$. The *Check:* paragraph stays, unchanged. |

No other body sentence was reworded. Two blocks were moved between pages,
unchanged (see *Fitting*).

**Five figures repaired — each drew a line past the edge of its own
viewBox, so the printed page clipped it** (found by measuring every
coordinate against its viewBox, then confirmed on the proofs):

| figure | what was wrong | what was done |
|---|---|---|
| **Fig. 2.50** (Step 4, $\angle TIN = 30^\circ$) | the arm $\overrightarrow{IT}$ ran to $y = -19$ in a 0–82 box: **the arrowhead, the point $T$ and the label $T$ were all cut off**, while the caption and Step 4 name $T$ | arm shortened to end inside the box at the same 30°; arrowhead moved with it; point $T$ redrawn on the arm; label $T$ set beside it |
| Fig. 2.17 | both $\overrightarrow{OX}$ arms ran above the box; their arrowheads were cut off | tips and heads pulled back along the same direction |
| Fig. 2.30 | the 30° arm ran above the box | the same |
| Fig. 2.56 | $\overrightarrow{MS}$ ran below the box, head cut off | the same; the point $S$ moved 8 units nearer $M$ on the same ray so the head clears it |
| Fig. 2.61 (e) | one arm of the right angle ran 8 units below the box (no arrowhead) | both arms of (e) shortened equally; still 90° |

No angle changed in any of them; `check-numbers.mjs` measures each.

**Beyond the Book rebuilt to the four stages** (§6a):

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, explained in running text | `.c-stage__for` removed; otherwise word for word **except four items that answered body questions**, changed by the user's decision below |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems in prose | **14 stepped examples, Beyond Examples 1–14** (numbered from 1, as Class 7 does — the coordinator's correction of the brief, 16 September), under nine `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 sets, A/B/C, 23 questions | **one run of 29**, six forms, band carries the numeral |
| 4 Answers & Takeaways → **Answers** | key and notes | on a fresh page: letter key, every other answer in `work--trace`, *why the other options are wrong* for Q10, Q11, Q12 |

The nine types: points, segments, lines and rays; naming angles; comparing
angles; turns, right and straight angles; reading a protractor; equal parts
of a turn; types of angles by measure; angles that fill a straight angle or a
full turn; bisecting and drawing angles. With the body's two, **16 examples**.

**Three new figures**, numbered after the body's last (2.62), drawn only
with the classes the body's figures use (`dg-line`, `dg-thin`, `dg-dim`,
`dg-dim-label`, `dg-label`, the point pair of circles, the body's
arrowhead path), generated from exact angles:

- **Fig. 2.63** — triangle $ABC$ with $D$ on $BC$ and $AD$ joined; inside Beyond Example 2's panel.
- **Fig. 2.64** — line $AB$ through $O$, rays $OC$, $OD$, printed 35° and 55°; inside Beyond Example 11's panel.
- **Fig. 2.65** — line $AB$ through $O$, rays $OP$, $OQ$, $OR$, printed 30°, 45°, 60°; placed straight after practice Q27, same page.

**Practice forms:**

| form | questions |
|---|---|
| multiple choice | 1–12 |
| assertion–reason (Class 7 form: the note once, *Assertion (A)* / *Reason (R)*, no option list) | 13–16 |
| very short answer | 17–21 |
| short answer | 22–26 |
| long answer | 27–28 |
| case-based (no *Case study* label) | 29 |

Key: a 4, b 4, c 4, d 4.

**Cut while fitting**, each logged: Beyond examples on three lines
crossing and on doubling an obtuse angle (the second repeated the type
example before it); a long-answer question on clock-hand turns; a case-based
question on a giant wheel, which on its own held a page at 22% in front of
the Answers page and repeated Type 6; the *why* note for Q15. The practice
run went 31 → 29 and Beyond 14 → 11 pages.

**Stage 1, four items changed — the user's decision, 16 September 2026:**
*nothing in Beyond answers a body question* wins over *Stage 1 word for
word*, with the smallest edit that works. Stage 1 was reread whole against
the body. Item 1 (Ravi, north to south-west) answers nothing and is
unchanged, as are the opening paragraph, *Notice that you did not need a
protractor*, and the closing paragraph.

| item | before | after | why |
|---|---|---|---|
| 2, a straight angle split | *One of them is 40° bigger…* worked to **70° and 110°**, *Check: 70° + 110° = 180°* | the same sentences with **50°**: $180° - 50° = 130°$, each 65°, **65° and 115°**, *Check: 65° + 115° = 180°* | 70° and 110° adding to 180° is Exercise Set 2.9 Q6's answer (draw ∠BOC = 70°, measure ∠AOC, add) |
| 3, counting angles | **Four** rays, *3 + 2 + 1 = 6* angles; *With 5 rays … 4 + 3 + 2 + 1 = 10* | **Five** rays $OA$–$OE$, *4 + 3 + 2 + 1 = 10* angles; *With 6 rays … 5 + 4 + 3 + 2 + 1 = 15*; the Chapter 1 sentence kept | counting the pairs among four things to get 6 is Exercise Set 2.2 Q6's count (four points, 6 lines) |
| 4, Meena's claim | *Take 30°… Double it and you get 60°* | *Take 20°… Double it and you get 40°* | half of 60° is 30° is Exercise Set 2.9 Q4's answer. *Double 45° is 90°* stays: Exercise 2.9 Q7 prints 45° in the question |
| 5, replaced | *What is the angle between the hands of a clock at 5 o'clock?* explained with *Each part is $360° \div 12 = 30°$*, 150° and 210° | *Kiran faces north-east. She turns clockwise until she faces north. Through how many degrees has she turned?* explained as 45° + 3 × 90° = **315°**, reflex, and the short way **45°**, $315° + 45° = 360°$ | *each part is 30°* is Exercise Set 2.8 Q1(a)'s answer, and the rest follows for 2, 4 and 6 o'clock |

The new item is the same kind as the old — a turn broken into parts the
reader knows, no protractor, one plain observation at the end — and
duplicates nothing in Beyond: Ravi turns 225° from north, Beyond Example 4
turns three right angles from east, MCQ 7 turns 270° anticlockwise from
east, and Q29's robot turns from north or back to north from east. Fit:
page 33 stays 98%, page 34 goes from 70% to 75%; nothing else moved, and no
refit was run.

**Nothing repeats the body, and nothing gives a body answer away.**
`check-no-repeats.mjs` now finds no pair close to a body question (the one
pair it printed before was the 5 o'clock item). Reading every Beyond
item against the body found, and replaced, five that gave body answers
away through an inverse fact:

| item | why it went | replaced by |
|---|---|---|
| practice Q24, *spokes 24° apart — how many?* (15) | $360 \div 24 = 15$ is Exercise 2.11 Q6's answer (24 spokes → 15°) | two spokes three gaps apart make 60° → 18 spokes |
| long answer (c), *numbers of parts from 13 to 20* | listed *15 parts of 24°*, the same fact | parts from 17 to 20 |
| Beyond Example 11, *at which hours is there a right angle?* | its first step printed *one part of the dial is 30°*, Exercise 2.8 Q1(a)'s answer | a circle cut into parts of 10° |
| AR 14's reason, and the *why* note on MCQ 8 | both printed *each part is 30°* | reason *a quarter of the way round the dial*; MCQ 8 now asks which angle is reflex |
| MCQ 6, *18 equal parts* (20°) | the exact inverse of Beyond Example 8 | *how many 1° units make a straight angle* |

**`ANSWERS.md` written** for every question the chapter sets: all eleven
exercise sets, every Think and Reflect, Let's Explore, the questions put in
the running text (Figs 2.10, 2.15–2.21, 2.27, 2.51, 2.54–2.56, 2.60), the
folding blanks, Stage 1 and the Solved Examples by their Beyond numbers,
and the practice. Measures of drawn angles are those the script reads off
the figure; drawing answers say what the drawing must show; *answers will
vary* carries a worked instance. Part labels follow the book: roman for the
body's part lists, letters where a figure labels its panels.

### Verified

**`check-numbers.mjs` exits 0 with 503 checks passed.** Six parts:

- **A. Arithmetic.** 60 identities off the pages and 74 off `ANSWERS.md`,
  evaluated. 43 spans relate a named angle to a measure and have only one
  numeric side; `--show` lists them.
- **B. The figures.** Every ray's direction is measured from the SVG
  coordinates, and every angle a question needs is computed from those
  directions: Figs 2.10, 2.12–2.47, 2.49–2.65. Printed values (40°, 50°,
  75°, 110°, 130°, 80°, 110°/250°, 30°, the Fig. 2.51 set, 35°/55°,
  30°/45°/60°, the student's six readings) are compared with the drawing.
  Every protractor numeral in Figs 2.34, 2.35, 2.43, 2.46 (U–Y) and 2.49
  is checked to sit at its own reading (outer = 180 − direction, inner =
  direction), which is what makes *the 0 on a base pointing right is on the
  inner scale* true. Also: the tick lengths of Fig. 2.33 (long every 10°,
  medium every 5°) and the *three long marks, six medium marks* of Example
  1; the 360, 30, 180 and 90 unit wedges; the ten divided circles of Fig.
  2.32, radii and marked part; the paper-protractor creases; the grid ways
  of Exercise 2.4, counted on the dot grid; the acute angles of Fig. 2.28
  (3, 12, 21, and 30 for the next figure, by building it); the three angle
  groups of Fig. 2.27; the six wrong readings of Fig. 2.46 and what went
  wrong with each; the clock hands of Fig. 2.47; the equal-spoke wheel.
  Claims in the text: 360 is the lcm of 1–10 without 7; the puzzle of
  Exercise 2.11 Q7 solved by search (19–22); an instance for Q3 (exactly 3
  acute, 1 right, 2 obtuse).
- **C. Answer rows.** Both body examples and all 14 Beyond examples; every
  practice answer read back off the page, one lettered part at a time; the
  robot of Q29 simulated, and every command list printed in (d) run.
- **D. Keys.** Each MCQ has exactly one right option and it matches the
  key; each MCQ's stem is checked to be the one worked; each AR key follows
  from computed truth values, tied to the assertion and reason printed under
  that number; key spread 4/4/4/4; the *why* notes checked against the
  options they explain.
- **E. `ANSWERS.md`.** Every value recomputed and looked for in the file.
- **F. The page.** Every question naming a figure prints with it or facing it
  (36 references); Beyond's shape (`c-stage__for` 0, `c-case__label` 0,
  `c-practice__num` 1, three stage heads named as §6a, `data-bridge` on
  every p1xx, `data-close` only on p032, practice numbered 1–29, six forms
  in order, body Examples 1–2 and Beyond 1–14, every example stepped,
  Answers opening its own page).

**The script was tested by breaking numbers on purpose,** each in a scratch
copy of the chapter; all nine were caught:
1. Fig. 2.65's printed 45° changed to 50°;
2. practice Q22's answer 30° → 40°;
3. key 13 (c) → (b);
4. `ANSWERS.md`, ∠BDC *about 74°* → 76°;
5. Fig. 2.33's ray $AW$ moved from 70° to about 75° (caught as a changed Exercise 2.6 answer);
6. p025 game score $49 - 39 = 10$ → 11;
7. Q27(a) alone 45° → 40°, while part (d) still prints 45°;
8. AR 14's reason reworded;
9. Beyond Example 7's Answer row 85° → 95°.

After the Stage 1 change, five more, all caught: Kiran's total 315° → 305°; the question changed to *faces north-west* with the answer left alone; the short way 45° → 55°; `ANSWERS.md` 315° → 325°; the straight-angle split 115° → 125°.

**Wrong numbers found: none in the printed body or the old Beyond key.**
The old Beyond was replaced, and its questions kept in the new run are
re-derived. Errors found and fixed were in my own work before it was done:
`ANSWERS.md` first had Exercise 2.7 Q8 wrong (the second fold makes the
other diagonal) and an Exercise 2.11 Q3 instance that did not have the
required angles; the practice answer to Q27(d) named only one of the two
equal pairs; and the script had a duplicated name, a floating-point
wrap-around in Fig. 2.20, a wrong class name for Fig. 2.37's numerals, and
a ray lookup that returned nothing (not a wrong value) when a ray moved.

**Fitting.** `refit … body` once (after stepping, page 24 overran by
25.9 mm), `refit … bridge` once on the first Beyond draft and once on the
trimmed flow. Final build: all pages fit, nothing past the text block.
`orphans`: 0 stranded openers in 43 pages. `fit-options`: every option row
fits. `check-labels`: no labels collide.

**A question and its figure.** At `HEAD`, Exercise 2.7 Q9 (p021) named Fig.
2.45, printed overleaf on p022. Q9's block was moved to the head of p022,
above the figure (p021 89%, p022 98%). The running-text question *Which
angle is bigger?* about Fig. 2.17 sat at the foot of p007 with the figure
overleaf; that paragraph was moved, unchanged, to the head of p008 (p007
86%, p008 92%). `refit … body` changed no break before page 24, so no other
pair moved; every figure reference was checked after it.

**Colour.** `check-colour.mjs` on pages 5, 12, 16, 22, 35, 38 and 42. p22
read in greyscale and p38 under deuteranopia: the example tab and panel keep
their value contrast, the measure labels carry their degree sign, and no
figure separates anything by hue alone.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 7 | 86% | the paragraph asking about Fig. 2.17, moved to p008 so the question prints with its figure |
| 24 | 74% | Example 2, a panel (81 mm stepped), too tall for the 61 mm left |
| 26 | 43% | Exercise Set 2.9, kept whole (`keepExerciseSets`, §11); the *Guessing well* section and its Think and Reflect stand alone before it |
| 32 | 46% | the chapter's close (`data-close`) |
| 34 (p102) | 75% | the *Type 2* head and Beyond Example 2 with Fig. 2.63 |
| 35 (p103) | 86% | the *Type 4* head and Beyond Example 4 |
| 37 (p105) | 83% | the *Type 7* head and Beyond Example 10 |
| 38 (p106) | 85% | Beyond Example 12, a panel |
| 43 | — | last page, exempt |

No short page stands before the Answers page: page 42 (Q27–29) is 93%.

### Flagged

| where | code | what is wrong | what it needs |
|---|---|---|---|
| Stage 1 (p101) | C8 | *Notice that you did not need a protractor.* — a narrator's instruction. The user has not asked for it to change. | A decision, if wanted. |
| Fig. 2.15 caption | C3 | *Four angles. Two of them are close in size.* As drawn, two pairs are close: (a) 72° and (b) 78°, (c) 38° and (d) 42°. | Either the caption or one drawing. `ANSWERS.md` names both pairs. |
| p015 → Fig. 2.33 | §5a | *Fig. 2.33 shows a half-circle protractor…* ends p015; the figure is overleaf. A description, not a question; Example 1 and Exercise 2.6 are with the figure on p016. | Nothing unless p015–p016 are refitted. |
| p008 → Fig. 2.16 | — | A paragraph on p008 refers back to Fig. 2.16 on p007. Not a question. | Nothing. |
| Fig. 2.52 (Exercise Set 2.9 Q1) | M2 | The slanting lines are drawn at 84.3° and 105.4°, so the measures are not whole degrees. | Fine for a guess-and-measure question; `ANSWERS.md` says *about 84° and 96°*, *about 105° and 75°*. |
| Fig. 2.46, U | — | The true angle is 38°, not a multiple of 5, where the other five are round numbers. | Nothing; `ANSWERS.md` gives 38°. |
| Fig. 2.46 | — | Some tick numerals are struck through by the arms (the arms must cross the scale). Pre-existing. | A drawing pass, if wanted. |
| `refit … body` | tool | Page 26 at 43% is the price of keeping Exercise Set 2.9 whole after Example 2 grew. | Do not re-run `refit … body` without re-checking Fig. 2.45 / Q9 and Fig. 2.17. |
| the brief vs Class 7 | — | The brief numbered Beyond's examples on from the body's; Class 7 restarts at 1. Corrected by the coordinator; this chapter follows Class 7. | — |

### Not changed

NCERT's structure in the chapter body: no example, check or exercise was
added; the eleven exercise sets, every Think and Reflect, Let's Explore and
Figs 2.1–2.62 are as they were, apart from the five clipped lines repaired
above. None of §5's unused components was introduced. No *Did you know?*
was added.
