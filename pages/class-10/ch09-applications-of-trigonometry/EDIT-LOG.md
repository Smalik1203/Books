# Class 10 · Mathematics I · Chapter 9 — Some Applications of Trigonometry

## Syllabus audit fixes, 17 September 2026

The audit found three items built on two angles of elevation that add up to
$90^\circ$, the question type the 2023 book deleted along with complementary
angles. All three were confirmed on the pages and replaced. **Pages: 25 before
(11 body + 14 Beyond), 25 after (11 + 14).** The body was not touched.

- **Stage 1, fifth try (4 m and 9 m, angles adding to 90°).** Replaced by a
  try of the same kind, again with no lengths: from a point where the
  elevation is 30°, walk until you are a third as far away. What is the angle
  now, and is it three times as large? The explanation shows the tangent is
  multiplied by 3, so the angle is 60°: it doubles and does not reach 90°. It
  uses only the ratio $\frac{h}{d}$ and Table 8.1, as the first try does.
  Every other Stage 1 item is word for word.
- **Type 8, Example 15 ($h = \sqrt{ab}$).** Type 8 *Proving a result* is kept.
  Example 15 now proves that two objects on the same side, seen at angles of
  depression α > β from a tower $h$ m high, are $h(\cot\beta - \cot\alpha)$ m
  apart. It is stepped (alternate angles, cot in each right triangle, same
  side so subtract).
- **Practice Q28** was that same proof, so it was replaced by another long
  proof that uses only this chapter: a pole $h$ m tall stands on a tower, and
  the bottom and top of the pole are seen at α and β; prove the tower is
  $\frac{h\tan\alpha}{\tan\beta - \tan\alpha}$ m high. Its key row and
  `ANSWERS.md` were rewritten as a stepped proof.
- **Practice Q14 (2 m and 8 m, angles adding to 90°).** Replaced by an MCQ on
  angles of depression from the same side: a tower 30 m high, cars at 60° and
  30°, so the cars are $20\sqrt{3}$ m apart. Options: $40\sqrt{3}$ (sum),
  $20\sqrt{3}$, $10\sqrt{3}$ (the nearer car), 30 (the height). The key stays
  (b). The why-wrong row and `ANSWERS.md` were rewritten. It is not body Q13
  (lighthouse 75 m, 30° and 45°), and its answer is not that question's.
- **The closing paragraph** said *the same angle in two triangles* can give
  the answer, which pointed at the removed item. It now reads *a ratio in
  which the lengths cancel*.
- `check-numbers.mjs`: Stage 1 Q5 now checks the start angle, the new angle
  from $3\tan 30^\circ$ at three distances, and the printed claims. Ex 15 is
  checked on three sets of numbers and for the nearer-object claim. Q14 is
  solved from its text, with its distractors and why-row checked. For Q28,
  the formula gives three towers back from their angles. `ANSWERS.md` is
  checked for 14, 28 and Stage 1 (5). Each new value was broken on purpose
  and caught (17 mutations). One was missed at first: the Stage 1 angle check
  searched every page after the try, and was narrowed to the try itself. It
  passes with 377 claims.
- `check-no-repeats`: no pair involves a changed item.
- `refit … bridge` once: 14 pages, no overflow in Beyond, orphans 0, options
  fit, labels clear. Page 2 of the body runs 1.9 mm into the margin; the body
  is untouched by this pass. The short Beyond pages are pairs of example
  panels, as before.

## Brought to the Class 7 standard, 17 September 2026

Phase 4 of `PLAN-MATHS-CONSISTENCY.md`, worked to the Chapter 1 model. Page
move, examples, Beyond the Book and answers were done in one pass, and every
check was run on the chapter.

**Pages: 20 before (11 body + 9 Beyond, Crown Quarto), 25 after (11 body + 14
Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`, and the body was
refitted once.

**All seven body examples set as steps.** Each was a question-only panel with
its working, its figure and its answer in the running text after it. The
working moved into the panel as *Solution*, Steps and *Answer*, with the
reason in `.work__why`, and **each example's figure moved into its panel,
after the work rows**, so a figure never prints apart from the working that
reads it. Example 5's working, which had run onto the next page, is whole.
Example 6's *(Why?)* is kept in its Step 7. The only prose rewording is the
joining words a step needs ("in Fig. 9.4, …", "let …").

**Verified** by `build/check-body-maths.mjs`: 129 expressions and 75 numbers,
none lost and none added. The one gain is 17.32, restated in Example 4's
Answer row.

**Beyond the Book rebuilt to the four stages:**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, each explained in running text | **kept word for word**; `.c-stage__for` removed; one give-away value changed (below) |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems | **15 stepped examples** under eight `Type` heads; the 5 old problems are Examples 1, 5, 7, 9 and 13, and old Set B Q3 is Example 3, options kept, *Answer* gives the letter |
| 3 Problem Sets → **Practice** | 3 sets, 19 questions | **one run of 31**: 15 multiple choice, 4 assertion–reason, 3 very short, 4 short, 3 long, 2 case-based |
| 4 Answers & Takeaways → **Answers** | key and why the options are wrong | key, every other answer, why the options are wrong for 11, the closing paragraph |

The eight types: one right triangle; finding an angle; angles of depression;
one height seen from two points; same side or opposite sides; two heights
seen from one point; speed and time; proving a result (Example 15, the
$\sqrt{ab}$ proof, board style, done without complementary-angle identities,
which this edition of Chapter 8 does not teach). Examples 2, 6, 8, 10 and 14
are word problems with $\sqrt{3} = 1.732$ stated and the rounding shown.

**Worked examples in the chapter: 22** (7 body + 15 Beyond).

**Practice reused** 13 of the old set items (options reordered to spread the
key: a 4, b 4, c 4, d 3 among Q1–15; AR a, c, b, d). Dropped: old Set B Q6
(became Example 11, with new numbers), Set C Q3 (the car, the same type and
method as body Q15) and Set C Q4 (a give-away, below).

### Give-aways found and fixed

| where | what it gave away | fix |
|---|---|---|
| Stage 1, third question | printed $d = 10\sqrt{3}$, about 17.32 m — the answer to body Q4 (and to Q11's height) | building 10 m → **14 m**, so $14\sqrt{3}$, about 24.25 m; nothing else in the stage changed |
| old Problem 4 | "the answer when both ships are on the same side, as in Question 13 of Exercise Set 9.1" | the pointer to Q13 deleted (Example 9 now says only "right only when both ships are on the same side") |
| old Set B Q6 and its key row | building 7 m, elevation 60°, depression 30°, with option (b) $7(\sqrt{3} + 1)$ "the answer for an angle of depression of 45°" — that is body Q12's answer | recast as Example 11 with a 9 m building; option (b) is now the distance, and nothing names the 45° case |
| old Set C Q4 and its key row | the hill question with option (a) $\frac{50}{3}$ "as in Question 9 of Exercise Set 9.1" — Q9's answer | dropped |
| new practice Q24 (as first written) | its working printed $20\sqrt{3}$, body Q10's answer | tower 60 m → 90 m, so $30\sqrt{3}$ and $30(3 - \sqrt{3})$, about 38.04 m |

`check-no-repeats` reports 9 pairs at 50% or more; each was read, and each is
the same type with different numbers (for example Example 11 against body
Q12, practice Q10's tree at 60° from 10 m against Q2's at 30° from 8 m,
practice Q2 against Q4). None prints a body answer.

**Wrong numbers found:** none. Every body and old Beyond value re-derived
correctly.

**`ANSWERS.md` written** for Exercise Set 9.1 (exact answer and a two-place
decimal for each), the questions in the running text (including Example 6's
*(Why?)*), the Think and Reflect on Fig. 8.3, Stage 1 (pointing to its
explanations) and all 31 practice questions, with Q27–Q29 set one statement to
a line and Q28 as a proof.

### Verified

`check-numbers.mjs` passes **349 claims**, evaluating 127 printed identities.
It reads $\sin$, $\cos$, $\tan$ and $\cot$ of an angle in degrees as functions,
drops the letter sides of a chain such as $BD = 5 - 1.3 = 3.7$, and checks a
bare decimal or anything after $\approx$ as a rounding to its own places,
with $\sqrt{3}$ exact, 1.732 or 1.73. It also:
- reads every figure's SVG: each angle label is drawn at that angle (to 0.5°),
  each figure's angles and lengths are in the question that names it, and
  each such question prints on the same page as its figure or facing it;
- re-solves all seven examples from the figure labels and the question's own
  numbers, and all fifteen exercises against `ANSWERS.md`, exact form and
  decimal;
- checks Example 2's answers against the 1.73 it states (with 1.732 the
  ladder would be 4.27 m);
- re-solves every Solved Example, the Stage 1 values, and the practice
  answers read back from the key rows a lettered part at a time;
- every multiple-choice question (exactly one right option, matching the
  key), every assertion–reason letter, the key spread and the numbering;
- the `ANSWERS.md` key and practice working.

**Break tests: 19 of 19 caught** (body answer, body working, a body answer
phrase, a figure's length label, a figure's angle label, a body question's
height, Stage 1, two Beyond answers, a key letter, two key rows including a
lettered part, an option, two assertion–reason assertions, and `ANSWERS.md`
values, key and practice row), run on a copy in the session scratchpad. The
first run missed one: AR Q19 compared the shadow with a typed $2\sqrt{3}$
rather than the printed one. It and Q18 now read the value off the page.

**Faults in the check itself, fixed:** question numbers were read from maths
spans (Q9's 30° taken as the tower's height) and from the Example tab; a
chain after $\approx$ with a single decimal had no value; chains beginning
with a letter were skipped whole.

**Fitting:** nothing is clipped. Page 2 runs 1.9 mm into the bottom margin.
`orphans` finds 0 stranded openers, `check-labels` finds no collisions and
`fit-options` finds every option row fits. Q1 prints with Fig. 9.11 (page 9),
Q11 on page 10 faces Fig. 9.12 on page 11, and Q14 prints with Fig. 9.13
(page 11). I read the proofs of pages 4, 7, 8, 11, 20 and 24.

**Colour:** pages 1–9 and 11 were checked in greyscale and colour-vision
simulations. Every figure is line work with lettered and numbered labels, so
nothing depends on colour.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 3 | 76% | the tip and Example 1; Example 2 is a panel with its figure |
| 4 | 70% | Example 2 alone; Example 3 (142 mm) cannot follow |
| 5 | 61% | Example 3 alone; Example 4 (153 mm) cannot follow |
| 6 | 66% | Example 4 alone; Example 5 (162 mm) cannot follow |
| 7 | 68% | Example 5 alone; Example 6 (188 mm) cannot follow |
| 8 | 81% | Example 6 alone; Example 7 (133 mm) cannot follow |
| 10 | 83% | Fig. 9.12 (46 mm), which must follow Q11 |
| 11 | 99% | the last body page (`data-close`) |
| 15–19 | 71–84% | Solved Examples: two example panels a page |
| 24 | 85% | **the Answers stage, which always opens a page** |
| 25 | 46% | the last page |

The example panels with figures inside are 133–188 mm on a 231 mm text block,
so no two fit a page. This is the cost of keeping each figure with its
working; the alternative, the figure just before the panel, would let the
refit put a figure at the foot of one page and its example overleaf.

### Flagged, not done

- **Stage 1, second question** is kept word for word. Its closing rule ("the
  distance walked is equal to the second line of sight" when the second angle
  is twice the first) is a method that fits body Q6, Q11 and Q14. It prints
  no answer to them, so it stays; the coordinator may judge otherwise.
- **Example 11** (Beyond) is body Q12's type with a 30° depression instead
  of 45°. It is kept as the type's worked example.
- The earlier flags below still stand (eye height taken as the observer's
  height; *the Sun's altitude* never glossed; Q2's tree assumptions).

Written new from NCERT *Mathematics, Textbook for Class X* (reprint 2026-27),
Chapter 9, *Some Applications of Trigonometry* (textbook pages 133–143).
Original LearnLab text in NCERT's order of topics, examples and questions; no
sentence is carried over. Crown Quarto, house design, palette `mulberry`. The
source PDF has no answer key; every answer below was worked here.

Sections: 9.1 Heights and Distances. *Exercise 9.1* is Exercise Set 9.1. The
three definitions (line of sight, angle of elevation, angle of depression) are
collected in a `c-keyidea`; the source's question about Fig. 8.3 is a Think
and Reflect; working is set as `.work--list` rows. The source's *9.2 Summary*
is the chapter summary.

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted: `check-body-maths` reports no mathematics lost or added, `check-numbers.mjs` passes, 0 stranded openers, every option row fits, no label collisions.

## Figures

All 13 come from `fig9.mjs` in the session scratchpad (unfilled copy `c9-src`)
and are drawn from the source's pictures, not traced.

| figure | note |
|---|---|
| Fig. 9.1 | the source sets the minar picture and the bare triangle side by side; here one drawing: the minar in outline, with the triangle dashed over it and the points A to E named |
| Figs. 9.2, 9.3 | the kite, the landscape and the balcony are reduced to outlines; the words *line of sight*, *horizontal level*, *angle of elevation* / *depression* and *object* are set horizontally, not along the lines |
| Figs. 9.4–9.7, 9.12, 9.13 | the tower, pole, ladder, chimney, building and flag, TV tower and balloons are outlines; Fig. 9.6 draws the observer's height larger than to scale so that D and E can be told apart |
| Figs. 9.7, 9.9, 9.13 | two angles share an arm at one vertex; the smaller arc's value is set just beyond its outer arm, not inside the larger angle |
| Fig. 9.10 | the bridge's brick arches are not drawn; the horizontal through P is dashed across the figure |

## Every answer worked

| where | answers |
|---|---|
| Examples 1–7 | as set out in the chapter, each re-derived: ${15\sqrt{3}}$ m; 4.28 m and 2.14 m (with ${\sqrt{3} = 1.73}$); 30 m; 17.32 m and 7.32 m; ${20\sqrt{3}}$ m; ${4(3 + \sqrt{3})}$ m for both; ${3(1 + \sqrt{3})}$ m. The source's values are all correct |
| Set 9.1 Q1–Q5 | 1 10 m · 2 ${8\sqrt{3}}$ m (standing part ${\frac{8}{\sqrt{3}}}$, broken part ${\frac{16}{\sqrt{3}}}$), about 13.86 m · 3 3 m and ${2\sqrt{3}}$ m (about 3.46 m) · 4 ${10\sqrt{3}}$ m, about 17.32 m · 5 ${40\sqrt{3}}$ m, about 69.28 m |
| Set 9.1 Q6–Q10 | 6 ${19\sqrt{3}}$ m, about 32.91 m (the top is 28.5 m above his eyes) · 7 ${20(\sqrt{3} - 1)}$ m, about 14.64 m · 8 ${0.8(\sqrt{3} + 1)}$ m, about 2.19 m · 9 ${\frac{50}{3}}$ m, that is ${16\frac{2}{3}}$ m · 10 ${20\sqrt{3}}$ m (about 34.64 m); 20 m and 60 m |
| Set 9.1 Q11–Q15 | 11 ${10\sqrt{3}}$ m (about 17.32 m); the canal is 10 m wide · 12 ${7(\sqrt{3} + 1)}$ m, about 19.12 m · 13 ${75(\sqrt{3} - 1)}$ m, about 54.9 m · 14 ${58\sqrt{3}}$ m, about 100.46 m (the balloon is 87 m above her eyes) · 15 3 seconds |

Beyond the Book: Stage 1 — $30^\circ$; ${20\sqrt{3}}$ m; $30^\circ$ and ${10\sqrt{3}}$ m; no; 6 m. Stage 2 — (b), (a), (b), (c), (b).
Set A c b a b d d c c; Set B c b c b d c; Set C c b a d c.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| "Let us consider Fig. 8.1 of prvious chapter" | Fig. 8.1 named with what it shows | typing, and a reader arriving from another chapter |
| the definitions of line of sight, angle of elevation and angle of depression, each in a paragraph | also collected in a key idea | structure: they are the three terms the chapter teaches |
| "you may identify the lines of sight, and the angles so formed in Fig. 8.3" | a Think and Reflect | it is a question put to the reader |
| Example 7: "In right △APD, ∠A = 30°", with no reason | "As in Example 6, the angles of depression at P are equal to the angles at A and B, which are alternate angles" | M2: Example 6 gives the reason once; Example 7 used it silently |
| Example 2: "trigonometic"; Example 6: "multi-storeyed" and "multi-storyed"; Q11: "joing" | corrected | typing |
| Example 5: "the Sun's altitude" | kept, and read in the solution as the angle of elevation of the top of the tower from the tip of the shadow | the source does this; the word is not defined anywhere else |
| Q3: "she prefers to have a slide"; Q12: "Determine the height" | "she wants a slide"; "Find the height" | L1 |
| Q11: "From another point 20 m away from this point on the line joining this point to the foot of the tower" | "From another point 20 m further away, on the line joining the first point to the foot of the tower" | the source's words allow the second point to be nearer; its figure puts it further away |
| Q14: "the angle of elevation reduces to 30°" | "it has become 30°" | L1 |
| Q15: "the time taken by the car to reach the foot of the tower from this point" | "How much longer will the car take to reach the foot of the tower?" | L3 |
| summary point 1 (i)–(iii) and 2 | four numbered points, with the raised and lowered head kept | layout |
| line-sized additions in the chapter: in Example 5 (both triangles use the tangent); in Q9 (the tower and the building stand on the same level ground); in Q10 (the point and the feet of the poles lie on one line across the road) | added | fitting: each says what the figure or the working already assumes |
| line-sized additions in Beyond the Book: a check with 6.83 m in Problem 3; "the lighthouse is between the two ships" in Problem 4; Set B Q5 says who looks down and who looks up; Set C Q3 says the height is not given and the speed does not change | added | fitting |
| Beyond the Book: Problem 5's last row of working, set as two rows; Set B Q1, Q2 and Q6 options in two columns; rows A1, A5 and A6 of the answer page shortened; the "about 17.32" in stage 1 given its unit | changed | fitting and legibility: the four-column rows ran their options together |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| Example 3, Set 9.1 Q6, Q14 | C4 | the observer's height is used as the height of the eyes ("1.5 m tall … from her eyes") | "whose eyes are 1.5 m above the ground", or a note that the height is taken to eye level |
| Example 2 | — | the two answers are rounded with ${\sqrt{3} = 1.73}$; with 1.732 the ladder is 4.27 m, not 4.28 m | none: the question fixes 1.73 |
| Example 5 | M1 | "the Sun's altitude" is used without saying it is an angle of elevation | a gloss at first use |
| Set 9.1 Q2 | C4 | the tree is not said to be vertical, nor the broken part to stay joined to the trunk | the usual reading is assumed in the answer |
