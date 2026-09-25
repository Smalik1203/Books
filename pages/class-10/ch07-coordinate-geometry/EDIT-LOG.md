# Class 10 · Mathematics I · Chapter 7 — Coordinate Geometry

## Solved examples in examination formats, 24 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 14 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-10/ch07-coordinate-geometry/`.

Source `build/jee-class10.mjs`; check `build/check-jee-class10.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p111; the answers stage still opens a fresh page.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) $2\sqrt{2}$ |
| 2 | Single correct | (b) $(1, 3)$ |
| 3 | Single correct | (c) $(1.5, 1)$ |
| 4 | Single correct | (d) $(-7, 0)$ |
| 5 | Single correct | (a) $5 : 1$ |
| 6 | Single correct | (b) 4 |
| 7 | Multiple correct | (a), (b), (c) |
| 8 | Multiple correct | (a), (b), (d) |
| 9 | Multiple correct | (a), (b), (c) |
| 10 | Multiple correct | (a), (b), (d) |
| 11 | Numerical answer | 13 |
| 12 | Numerical answer | 13 |
| 13 | Numerical answer | 24 |
| 14 | Matching | (a) P–3, Q–4, R–2, S–1 |
| 15 | Matching | (d) P–3, Q–4, R–1, S–2 |


## Brought to the Class 7 standard, 17 September 2026

Phase 4 of `PLAN-MATHS-CONSISTENCY.md`, worked from the brief built on
Chapter 1. Page move, examples, Beyond the Book and answers were done in one
pass, and every check was run on the chapter.

**Pages: 23 before (16 body + 7 Beyond, Crown Quarto), 27 after (15 body + 12
Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`. The body was
refitted once and then placed by hand (see *Fitting*).

**All ten body examples set as steps.** Each was a question-only panel with
its working in the running text after it. That working is now inside the
panel as *Solution*, Steps and *Answer*, reusing the printed maths exactly.
- **Examples 5 and 7** end on *Check* rows: the check the running text did
  (AP and BP both $\sqrt{52}$; the $y$-coordinate giving 6).
- **Example 7's** "Recall that if $(x, y) = (a, b)$…" is now the reason on
  Step 3. Its chained check is split over two rows.
- **Example 6's** $x$ and $y$ share one row, as they shared one line before.
- **Fig. 7.6** is set just before Example 3, which names it. **Fig. 7.11** is
  inside Example 8's panel, after the work rows.
- **Left after their panels as remarks:** *Another way* (Examples 2 and 7,
  Example 7's with its display and three lines of working), and the notes
  and remark after Examples 1, 4, 5, 7 and 8. The sentence "One way to show
  that ABCD is a square…" became "To show that ABCD is a square, we showed…"
  after Example 2.

**Verified.** `build/check-body-maths.mjs` compares 416 expressions and 57
numbers: no mathematics lost or added. The only gains are the numbers 3 and
4, from "from Step 3" and "so Step 4 holds too" in reasons.

**Beyond the Book rebuilt to the four stages:**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, each explained in running text | **kept word for word**; only `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems | **14 stepped examples** under seven `Type` heads; the old problems are Examples 2, 3, 9, 11 and 13, options kept, *Answer* gives the letter |
| 3 Problem Sets → **Practice** | 3 sets, 19 questions | **one run of 31** in six forms |
| 4 Answers & Takeaways → **Answers** | key and why the options are wrong | key, every other answer, why the options are wrong for 12, the closing paragraph |

- **The types:** distance; an unknown coordinate from a distance; proving a
  shape (collinear points, a rectangle); equidistant points (a point on an
  axis, and the proof that $3x = 2y$); the section formula (including a map
  word problem); the ratio a point or an axis divides in; mid-points
  (including the mid-point theorem checked with coordinates).
- **Worked examples in the chapter: 24** (10 body + 14 Beyond).
- **Practice:** 15 multiple choice (reused from the old sets, options
  reordered), 4 assertion–reason, 3 very short, 4 short, 3 long and 2
  case-based. Letters: a 5, b 4, c 5, d 5.
- **Old items dropped:** Set A5 (too easy), Set B5, Set C4 (a rhombus area,
  the same exercise as Set 7.2 Q10), and Set C5. The two coaching
  instructions ("Work out all three sides, and then choose"; "Draw a rough
  figure…") were cut from the questions they led.
- **Examples 5 and 6 were swapped** after the refit, so that the shorter
  proof (collinear points) could follow its `Type` head on the page before.

**Nothing repeats or answers the body.** `check-no-repeats` reports 5 pairs
at 50%; each is the same type with other numbers. Reading every value
Beyond prints against the body's exercise answers found no give-away. Two
coincidences were left: Beyond Example 2's perimeter 24 is also Set 7.2
Q10's area, and Example 12's $y = \frac{7}{2}$ is also a coordinate in the
answer to Set 7.2 Q9. Neither says anything about the body question.
Practice 14, 26 and 27 are the same kinds as Set 7.2 Q7, Q6 and Q2, with
other numbers.

**`ANSWERS.md` written** for Activity 1 (what the drawing must show), the
questions in the running text of 7.2 and 7.3, Exercise Sets 7.1 and 7.2,
Stage 1 (pointing to its explanations) and all 31 practice questions. Proofs
are set one statement to a line.

### Verified

`check-numbers.mjs` passes **564 claims**:
- **193 printed identities** are evaluated. It reads $\sqrt{}$, fractions,
  surds written beside a number, tuples compared coordinate by coordinate,
  and ratios. A distance name (AB, $PQ^2$) is read as the distance between
  the points printed before it in the same example, question or answer. A
  printed decimal is held to its own places.
- **123 equations in $x$, $y$, $k$, $p$, $m_1$, $m_2$, $a$, $b$** are checked
  at the block's own answer: each step of Example 4 at three points of
  $x - y = 2$, each step of Example 5 at $y = 9$, and so on.
- **Re-derived from the printed coordinates:** every body example and
  exercise answer, including the Sports Day flags from the fractions and
  line numbers in the question; Stage 1; all 14 Solved Examples; and the
  practice answers, read back from the key rows a lettered part at a time.
  A named point is checked as the phrase "Q(5, −1)", not as any pair nearby.
- **Figures:** 21 plotted points are checked against their labels on the
  grid their axes and tick numerals set (Figs. 7.2–7.4, 7.6–7.8). Also
  checked: the line in Fig. 7.7 is $x - y = 2$, Fig. 7.9's P sits a third of
  the way along AB, Fig. 7.11's P and Q sit at the thirds, and the aria
  labels of Figs. 7.6 and 7.8 give the seats the text uses.
- **Multiple choice and assertion–reason:** every question has exactly one
  right option, and it matches the key. Every assertion–reason letter is
  derived, and so is each lettered example.
- **`ANSWERS.md`:** its key and working match the page.

**Break tests: 19 of 19 caught**, run on a copy in the session scratchpad.
They covered body decimals, an Answer row, an expanded algebra step and an
exercise question; Beyond steps and Stage 1; a key letter; key rows and
lettered parts; an option; an assertion; two plotted points; and
`ANSWERS.md` values, working and key. The first run missed one:
`ANSWERS.md` practice 27 with a wrong Q passed, because the same pair
appears as "the mid-point of PB". Named points are now read as phrases.

**Wrong numbers found:** none. The old key, Stage 1 and the old problems all
re-derived correctly.

**Fitting:** nothing is clipped. Pages 4 and 15 run 0.8 and 1.1 mm into the
bottom margin. `orphans` finds 0 stranded openers, `check-labels` finds no
collisions, and `fit-options --fix` narrowed practice Q2 and Q3 to two
columns.
- **The body was refitted once and then placed by hand.** The refit left
  Exercise Set 7.2 Q3 on a recto with Fig. 7.12 overleaf. At 14 pages the
  only arrangements either divided that pair or stranded the Set 7.2 band
  under two lines. At 15 pages, Q3 and Fig. 7.12 share page 14.
- **Hand fitting elsewhere:** two of Example 4's rows were merged so that it
  fits on page 6. Beyond was hand-placed after its one refit, which came to
  13 pages; it is now 12.

I read the proofs of pages 5, 12, 13, 14, 17, 19, 25 and 26.

**Colour:** pages 2–4, 6–9, 13 and 14 were checked in greyscale and in the
colour-vision simulations. In Fig. 7.7 the line $x - y = 2$ carries its
label, and the segment AB has labelled end dots, so neither depends on hue.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 1 | 73% | the chapter opener; 7.2 opens the next page |
| 4 | 81% | Example 1, a panel (97 mm) |
| 7 | 82% | Exercise Set 7.1, whose band may not start this low |
| 11 | 61% | Example 7, a panel (108 mm). This is the extra page that keeps Set 7.2 Q3 with Fig. 7.12 |
| 12 | 82% | Example 8, a panel with its figure (110 mm) |
| 15 | 58% | the last body page (`data-close`) |
| 20–22 | 68–72% | Solved Examples: a `Type` head and two tall panels a page |
| 27 | 40% | the last page |

### Flagged, not done

- **Example 7's Note** speaks of "PA and PB", but the example never names
  the point P. This is NCERT's wording and is kept.
- **The HTML indentation** of hand-moved blocks is uneven. It does not
  affect the page.

Written new from NCERT *Mathematics, Textbook for Class X* (reprint 2026-27),
Chapter 7, *Coordinate Geometry* (textbook pages 99–112). Original LearnLab
text in NCERT's order of topics, examples and questions; no sentence is carried
over. Crown Quarto, house design, palette `lagoon`. The source PDF has no answer
key; every answer below was worked here.

Sections: 7.1 Introduction · 7.2 Distance Formula · 7.3 Section Formula.
*Exercise 7.1* and *7.2* are Exercise Sets 7.1 and 7.2. The distance formula,
the section formula and the mid-point formula are `c-keyidea` blocks. The
source's "play" with plotted points is **Activity 1**; working is set as
`.work--list` rows. The source's *7.4 Summary* is the chapter summary; its
*A note to the reader* (external division) is a `c-tip` carrying the
coordinates mark, placed straight after the section formula.

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted: `check-body-maths` reports no mathematics lost or added, `check-numbers.mjs` passes, 0 stranded openers, every option row fits, no label collisions.

## Figures

All 12 come from `fig7.mjs` in the session scratchpad (unfilled copy
`c7-src`) and are drawn from the source's pictures, not traced.

| figure | note |
|---|---|
| Figs. 7.2, 7.3, 7.4, 7.7 | ruled grids in the house graph style (the source draws bare axes with ticks); a tick numeral that would sit under a plotted point or on a line is left out or moved to the empty side of the axis |
| Fig. 7.4 | the source also marks a point L near the origin that the text never names; not drawn |
| Figs. 7.6, 7.8 | the pictures of the children at the desks are not drawn; the seats are dots on a 10 × 10 grid with the source's row and column numbers |
| Fig. 7.7 | the line ${x - y = 2}$ is drawn in the second plot colour so that it reads apart from the segment AB |
| Fig. 7.12 | the runners and the flags are not drawn, so the figure does not show where the flags go; the flower pots are a row of marks beside AD, fewer than 100 |

## Every answer worked

| where | answers |
|---|---|
| Activity 1 | a cat's face (not printed) |
| Set 7.1 Q1–Q5 | 1 (i) ${2\sqrt{2}}$ (ii) ${4\sqrt{2}}$ (iii) ${2\sqrt{a^2 + b^2}}$ · 2 39; the towns are 39&nbsp;km apart · 3 not collinear: $\sqrt{5}$, ${2\sqrt{53}}$ and ${\sqrt{265}}$, and ${\sqrt{5} + 2\sqrt{53} \approx 16.80 \neq 16.28}$ · 4 yes: two sides are ${\sqrt{37}}$ and the third is 2 · 5 A(3, 4), B(6, 7), C(9, 4), D(6, 1): all sides ${\sqrt{18}}$, both diagonals 6, so ABCD is a square and Champa is right |
| Set 7.1 Q6 | (i) a square: sides ${\sqrt{8}}$, diagonals 4 and 4 (ii) no quadrilateral: $(0, 3)$ is the mid-point of $(-3, 5)$ and $(3, 1)$, so three of the points are collinear (iii) a parallelogram: opposite sides ${\sqrt{10}}$ and ${\sqrt{18}}$, diagonals 2 and ${\sqrt{52}}$ |
| Set 7.1 Q7–Q10 | 7 $(-7, 0)$ · 8 ${y = 3}$ or ${y = -9}$ · 9 ${x = \pm 4}$; ${QR = \sqrt{41}}$; ${PR = \sqrt{82}}$ for $R(4, 6)$ and ${9\sqrt{2}}$ for $R(-4, 6)$ · 10 ${3x + y = 5}$ |
| Set 7.2 Q1–Q5 | 1 $(1, 3)$ · 2 ${\left(2, -\frac{5}{3}\right)}$ and ${\left(0, -\frac{7}{3}\right)}$ · 3 with AD = 100&nbsp;m, the green flag is at $(2, 25)$ and the red at $(8, 20)$; they are ${\sqrt{61}}$&nbsp;m apart, and the blue flag goes at $(5, 22.5)$, on the 5th line 22.5&nbsp;m from AB · 4 ${2 : 7}$ · 5 ${1 : 1}$, at ${\left(-\frac{3}{2}, 0\right)}$ |
| Set 7.2 Q6–Q10 | 6 ${x = 6}$, ${y = 3}$ · 7 $(3, -10)$ · 8 ${\left(-\frac{2}{7}, -\frac{20}{7}\right)}$ · 9 ${\left(-1, \frac{7}{2}\right)}$, $(0, 5)$, ${\left(1, \frac{13}{2}\right)}$ · 10 diagonals ${4\sqrt{2}}$ and ${6\sqrt{2}}$, area 24 square units |
| Examples 1–10 | as set out in the chapter, each re-derived: Example 9's point is ${\left(0, -\frac{13}{3}\right)}$, as in the source |

Beyond the Book: Stage 1 — ${AB = AC = 5}$ and ${BC = \sqrt{50}}$, right-angled at A; $(3, 4)$; ${3 : 4}$; $D(4, 3)$; no such point. Stage 2 — (c), (c), (b), (b), (c).
Set A c b a b d c b c; Set B a b c b c d; Set C a c b d c.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| Example 4 goes from the expanded equation straight to ${x - y = 2}$ | a row taking $x^2 + y^2$ from both sides, and the row ${8y - 8x = -16}$ | M2 |
| Example 5: ${36 + 25 + y^2 - 10y = \ldots}$ then ${4y = 36}$ | a row ${61 - 10y = 25 - 6y}$ between them | M2 |
| the section formula: "Taking $\frac{m_1}{m_2} = \frac{x - x_1}{x_2 - x}$, we get $x = \ldots$" | the cross-multiplied row and the collected row before $x$ | M2 |
| Example 7's check of the $y$-coordinate ends in a stacked fraction | the step ${\frac{54}{7} \div \frac{9}{7} = 6}$ | M2 |
| Section 7.3, Fig. 7.9: "These equations give $x = 12$ and $y = 5$" | ${2x = 36 - x}$ and ${2y = 15 - y}$ shown | M2 |
| "Recall that if $(x, y) = (a, b)$ then $x = a$ and $y = b$" | kept, as a sentence | — |
| *A note to the reader* at the end of the chapter | a tip after the section formula | the note is about that formula, and a chapter ending on a note that points to higher classes ends on the wrong thing |
| the "play" of plotted points | **Activity 1**, the joins set as three rows | the house convention for activities |
| "digonals", "Thereore", "is such a way", "on both the axis" | corrected | typing |
| lengths in running text ("OA = 4 units") | set as maths | layout: roman letters beside italic maths on one line read as two notations |
| Example 8 | the meaning of *points of trisection* moved into the question as its own sentence | L4 |
| Set 7.2 Q3 | "posts a green flag", "posts a red flag" kept; "on the 2nd line" becomes "along the 2nd line" | L1 |
| line-sized additions: in 7.1 (the point $(-3, 2)$ as an example of the signs), in Activity 1 (the same scale on both axes), after Fig.&nbsp;7.4 (${\sqrt{170}}$ is a little more than 13), before Fig.&nbsp;7.5 (why the figure puts both points in the first quadrant), in Example 1 (equal sums would mean one line), in Example 2 (four equal sides alone are not enough); in Beyond the Book, Set A Q7 and Q8 and Set B Q1 | added | fitting: the chapter was a page longer, with six short pages; each says what the page already shows |
| Example 8: "Therefore, P divides AB internally in the ratio 1 : 2. Therefore, the coordinates of P, by applying the section formula, are" | one sentence | fitting |
| the summary's two formulas | fractions at text size | layout: display fractions opened the word spaces of the line above them |
| Beyond the Book trace row B6 | the second clause dropped | it did not say where options (b) and (c) come from |
| Beyond the Book trace rows A3, A4, A8 and B4 | one clause shorter each | the section was ending on a page holding only the takeaways |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| Set 7.2 Q3 | C4 | the length of AD is not given; "100 flower pots 1 m apart" gives 100&nbsp;m only if the first pot stands 1&nbsp;m from A (99&nbsp;m if it stands at A) | state AD = 100&nbsp;m, or say where the first pot stands |
| 7.1 | C2 | the $x$-coordinate is defined as "the distance of a point from the $y$-axis", which is never negative, but negative coordinates are used from Fig.&nbsp;7.4 on | "the signed distance", or a note that the sign shows the side of the axis |
| Set 7.1 Q6 (ii) | — | the four points do not form a quadrilateral; "if any" allows for this, but a student may force a name | none, but the key should say why |
| Example 3 | C5 | in the source, collinearity is read from ${AB + BC = AC}$ with no reason; here Example 1 now says that a distance equal to the sum of the other two means one line, which covers it | nothing further, unless the sentence in Example 1 is cut |
