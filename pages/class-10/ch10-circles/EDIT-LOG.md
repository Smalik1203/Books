# Class 10 · Mathematics I · Chapter 10 — Circles

## Syllabus audit fixes, 17 September 2026

One minor gap, confirmed: §10.3, the number of tangents through a point
inside, on or outside the circle, was worked by no example. **Pages: 23 before
(11 body + 12 Beyond), 24 after (11 + 13).** The body was not touched.

- **New Example 4**, at the end of Type 1 (*The radius and the tangent*),
  stepped like the others. A circle of radius 5 cm, with P, Q and R at 3, 5
  and 13 cm from O, has 0, 1 and 2 tangents through them. Each step cites
  Case 1, 2 or 3, and the key is (b). The note says why (a), (c) and (d) are
  wrong and gives the 12 cm tangent from R. Old Examples 4–13 are now
  **5–14**. Nothing in the division or `ANSWERS.md` cited them by number
  (the one *Example 1* reference is the chapter's own). **Solved Examples:
  14** (was 13).
- **Practice Q1** asked how many tangents pass through a point inside the
  circle, which the new example now answers. It is replaced by an MCQ of the
  same kind: how many tangents are parallel to a given secant? The answer is
  2, from Activity 2. The options were reordered so the key stays (c).
  `ANSWERS.md` 1 was rewritten. It does not answer Exercise Set 10.1 Q4,
  which asks for a drawing.
- `check-numbers.mjs`: Example 4 is judged from its radius and distances
  (the option, one point of each kind, the three wrong options, the 12 cm
  tangent, and the Case citations). Q1's solver now wants 2 and checks the
  stem. The checks for Examples 5–14 were renumbered, and the count is now
  1–14. Nine deliberate breaks were all caught, including a renumbering. It
  passes with 277 claims.
- `check-no-repeats`: no pair involves a changed item.
- `refit … bridge` once. Example 4's steps were then shortened (*…so P is
  inside: no tangent*) so their *Case N* reasons stop wrapping in the reason
  column. No overflow, orphans 0, options fit, labels clear. p107 (59%) is
  held open by the Type 6 head and its panel.

## Brought to the Class 7 standard, 17 September 2026

Phase 4 of `PLAN-MATHS-CONSISTENCY.md`, worked whole by one agent against
the Class 10 brief, with Chapter 1 as the model. Page move, examples, Beyond
the Book and answers were done in one pass, and every check was run on the
chapter.

**Pages: 18 before (11 body + 7 Beyond, Crown Quarto), 23 after (11 body +
12 Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`, and the body was
refitted once, then placed by hand in four places (below).

**All three body examples set as steps.** Each was a question-only panel
with its working in the running text after it; the working is now inside
the panel as *Solution*, Steps and *Answer*.
- **Examples 1 and 2 are proofs**, set one statement to a row with the
  reason beside it. Their "We are given … We need to prove" sentences open
  the Solution.
- **Example 3's** working ran onto the next page; all of it is in the panel
  now (Steps 1–8). The Class 9 fact behind Step 2 (the bisector in an
  isosceles triangle) stays as a paragraph after the panel, and NCERT's
  **Note** (the Pythagoras route) stays after it as it was.
- **Figures 10.8–10.10 sit just before their panels**, not inside them.
  Inside, each panel was 59% of a page and the three examples took four
  pages; before them, the body packs in 11.
- Theorem proofs and their `.work--list` rows are unchanged.

**Verified** by `build/check-body-maths.mjs`: 84 expressions and 116 numbers
compared, no mathematics lost or added. The only gains are numbers restated
in Answer rows and step references.

**Hand placement after the body refit.**
- Refit left page 4 at 3.4 mm into the margin: Ex 10.1 Q4 moved to page 5.
- Refit split Theorem 10.2's proof paragraph (page 5) from Fig. 10.7
  (page 6, overleaf): the theorem and its proof paragraph moved to page 6.
- Refit put Ex 10.2 Q8 on page 9 and Fig. 10.12 overleaf on page 10: Q8
  moved to page 10, and Q12 moved to page 10 with Fig. 10.14 at the top of
  page 11, facing it.
- Every question naming a figure now prints with it or facing it: Q2 and
  Fig. 10.11 (page 9), Q8/Q9 and Figs. 10.12/10.13 (page 10), Q12 (page 10)
  and Fig. 10.14 (page 11). No figure was reprinted.

**Beyond the Book rebuilt to the four stages:**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, each explained in running text | kept word for word except one item (below); `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems | **13 stepped examples** under six `Type` heads; the old problems are Examples 1, 4, 7, 8 and 10, options kept, *Answer* gives the letter |
| 3 Problem Sets → **Practice** | 3 sets, 19 questions | **one run of 30** in six forms: 14 MCQ, 4 A–R, 3 very short, 4 short, 3 long, 2 case-based |
| 4 Answers & Takeaways → **Answers** | key and why the options are wrong for 10 | key, every other answer, why the options are wrong for 12, the closing paragraph |

**Worked examples in the chapter: 16** (3 body + 13 Beyond). Types: the
radius and the tangent (including a word problem), angles made by tangents,
equal tangents from a point, concentric circles, proofs with tangents, and a
circle inside a triangle (area two ways).

The key is spread a 4, b 4, c 5, d 5.

### Give-aways found and fixed

| where | what it gave away | fix |
|---|---|---|
| Stage 1, rectangle item | *l + l = b + b, so l = b*: the proof of Ex 10.2 Q11 (a circumscribing parallelogram is a rhombus) | replaced with an item of the same kind: a quadrilateral with sides 5, 7, 9, 6 cm, ruled out by Q8's result |
| Set A Q5 | Ex 10.1 Q2(ii), *secant*, word for word | dropped |
| Set A Q6 | Ex 10.1 Q2(iii), two parallel tangents | dropped |
| Set A Q7 | ∠APB = 70°, ∠AOB = 110°: the answer to Ex 10.2 Q2 | numbers changed, then recast (next row) |
| Set A Q8 | Ex 10.2 Q4, tangents at the ends of a diameter are parallel | dropped |
| Set B Q4 | a circumscribing parallelogram's perimeter is 4 × side: Ex 10.2 Q11 | dropped |
| Set B Q6 | ∠AOB + ∠COD = 180°: Ex 10.2 Q13 | dropped |
| Set C Q5 (d) | "three parallel tangents" is false: Ex 10.1 Q2(iii) | option (d) replaced by "a tangent can pass through a point inside the circle" |
| new Practice Q5 and Q20 (first draft) | their answer rows set out ∠AOB = 360° − 180° − ∠APB, which is the proof of Ex 10.2 Q10 | recast to use only Remark 2 (OP bisects ∠APB): Q5 asks for ∠APO, Q20 for ∠APB and ∠AOP from ∠APO = 25° |
| Example 4 (old Problem 2) remark | "(d) is ∠POQ" printed a Q10 instance | now "(d) is 180° − 50°" |

Chosen to avoid body answers: no Beyond item uses the 7–24–25 triangle
(Ex 10.2 Q1), 80° with 50° (Q3), or 70° with 110° (Q2). Example 7 cites
*Exercise Set 10.2, Question 8* for AB + CD = AD + BC and does not prove it.
`check-no-repeats` reports 9 pairs at 50% or more. Each is the same type
with different numbers (for example concentric radii 13 and 5, or 53 and 28,
against the body's 5 and 3), and none answers a body question.

**`ANSWERS.md` written** for Exercise Sets 10.1 and 10.2 (every proof one
statement to a line; what the Ex 10.1 Q4 drawing must show), the running-text
questions and Activities 1–3, the examples, Stage 1, and all 30 practice
questions.

### Verified

`check-numbers.mjs` passes **269 claims**, evaluating 100 printed
identities. It reads degrees, `\sqrt`, `\frac`, juxtaposed surds, and sin,
cos and tan at the standard angles. It also:
- reads the figures out of the SVG: the labels of Figs. 10.10, 10.11 and
  10.14 against the questions that name them, and the drawings themselves
  (Fig. 10.10 to scale, ∠POQ drawn at 110°, Fig. 10.14 drawn with AB = 15
  and AC = 13, the answer to Q12);
- solves Ex 10.1 Q3 and Ex 10.2 Q1–3, Q6, Q7 and Q12 and checks the
  ANSWERS.md letters and values;
- checks Example 3's TP and the Note's *y* and *x*;
- checks Stage 1, all 13 Solved Examples (answer letters, answer rows, and
  what each remark says a wrong option is);
- checks the practice key rows as phrases, a lettered part at a time;
- checks every MCQ (exactly one right option, matching the key), every
  assertion–reason letter derived, and the wrong options the "why" rows
  name;
- checks the ANSWERS.md key and its working, row by row.

**Break tests: 19 of 19 caught**, run on a copy in the scratch folder. They
covered the body answer, figure labels, a body option, a Stage 1 value,
Beyond example answers and a letter, a key letter, key rows, lettered parts,
an option, an assertion, and ANSWERS.md values, a phrase and the key. The
first run showed two faults in the tests, not the check. One test's search
string did not match the page. The other passed `$&` in a `String.replace`
replacement, which pasted the match back in.

**Fitting:** nothing is clipped. Page 22 runs 1.3 mm into the bottom
margin. `orphans` finds 0 stranded openers, `check-labels` finds no
collisions, and `fit-options` finds every option row fits. The bridge was
refitted twice. The first refit left pages 15–17 at 66–70%. Example 6 lost
a row (Steps 2 and 3 merged) and Example 12 lost one (Steps 4 and 5
merged); a dry run then packed better, so it was applied. PNG proofs of
pages 7, 8, 10, 13, 17, 21, 22 and 23 were read.

**Colour:** `check-colour` on pages 1–11. Pages 8 and 11 were read in
greyscale and deuteranopia; the figures are line art with text labels and
carry no fills.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 3, 5 | 86% | Fig. 10.5, a figure; Theorem 10.2, moved to sit with Fig. 10.7 |
| 9 | 79% | Q8 moved to face Fig. 10.12 |
| 10 | 76% | Fig. 10.14, which cannot fit and faces Q12 |
| 11 | 49% | the last body page (`data-close`) |
| 13 | 73% | Example 2, a panel |
| 14 | 86% | Example 5, a panel |
| 16 | 70% | the Type 4 head with Example 10 |
| 19 | 84% | practice blocks too tall for the gap |
| 21 | 84% | **the Answers stage, which always opens a page** |
| 22 | 87% | the "Why the other options are wrong" head with its rows |
| 23 | 80% | the last page |

### Flagged, not done

- **Example 13's remark** (a triangle's area is half the radius of this
  circle times its perimeter) is the method Ex 10.2 Q12 needs; the old
  Beyond C1 already used it. It gives the method, not the answer. The
  coordinator should confirm this is acceptable.
- **Unsourced history:** "Thomas Fincke in 1583" is not sourced in this log.
- **Stage 1 Q4** uses sin 30° and tan 30°. Chapter 8 teaches them, so
  Stage 1 relies on an earlier chapter.
- The flags in the log below (Ex 10.2 Q12 M2, Ex 10.1 Q4 C4, Activity 1 C6)
  still stand.


Written new from NCERT *Mathematics, Textbook for Class X* (reprint 2026-27),
Chapter 10, *Circles* (textbook pages 144–153). Original LearnLab text in
NCERT's order of topics, activities, examples and questions; no sentence is
carried over. Crown Quarto, house design, palette `amethyst`. The source PDF
has no answer key; every answer below was worked here.

Sections: 10.1 Introduction · 10.2 Tangent to a Circle · 10.3 Number of
Tangents from a Point on a Circle. *Exercise 10.1* and *10.2* are Exercise Sets
10.1 and 10.2. Theorems 10.1 and 10.2, the tangent as a special secant and the
three cases of Activity 3 are `c-keyidea` blocks; proofs and working are
`.work--list` rows with the reason in brackets. The source's *10.4 Summary* is
the chapter summary.

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted: `check-body-maths` reports no mathematics lost or added, `check-numbers.mjs` passes, 0 stranded openers, every option row fits, no label collisions.

## Figures

All 15 come from `fig10.mjs` in the session scratchpad (unfilled copy
`c10-src`) and are drawn from the source's pictures, not traced.

| figure | note |
|---|---|
| Fig. 10.1 | the arrowheads on the lines are not drawn: the book's one arrowhead is the measurement colour |
| Fig. 10.2 | the pulley is an outline with a bucket on one end of the rope |
| Fig. 10.3 (i) | two secants on each side of the tangent (Q<sub>1</sub>, Q<sub>2</sub>, R<sub>1</sub>, R<sub>2</sub>) instead of three, and no A, A″, B, B″ labels; the text names only what the figure shows |
| Fig. 10.3 (ii) | seven parallel lines; P′Q′, PQ and P″Q″ are drawn heavier |
| Fig. 10.4 | a sixteen-spoke wheel with the spoke to the ground drawn heavier |
| Fig. 10.6 | the source's three figures stacked down the margin are set side by side as (i), (ii), (iii) |
| Figs. 10.5, 10.7–10.14 | redrawn to the source's lettering; Fig. 10.14 is drawn to scale (sides 13, 14 and 15 cm), so its incircle really has radius 4 |

## Every answer worked

| where | answers |
|---|---|
| Set 10.1 | 1 infinitely many, one at each point of the circle · 2 (i) one (ii) secant (iii) two (iv) the point of contact · 3 (d) ${\sqrt{119}}$ cm · 4 a tangent parallel to a line $l$ touches the circle at an end of the diameter perpendicular to $l$; any line parallel to $l$ between the two tangents is a secant |
| Set 10.2 Q1–Q7 | 1 (a) 7 cm · 2 (b) $70^\circ$ · 3 (a) $50^\circ$ · 4 both tangents are perpendicular to the diameter · 5 the radius at the point of contact is perpendicular to the tangent there, and only one line through that point is perpendicular to the tangent · 6 3 cm · 7 8 cm |
| Set 10.2 Q8–Q13 | 8 add the four pairs of equal tangents · 9 OA and OB bisect the angles at A and B, which add up to $180^\circ$ (co-interior angles), so ${\angle OAB + \angle OBA = 90^\circ}$ · 10 the quadrilateral formed with the centre has two right angles · 11 by Q8 and the equal opposite sides, ${2AB = 2AD}$ · 12 ${AB = 15}$ cm, ${AC = 13}$ cm: the tangent from A is $x$ cm, and the area found by Heron's formula equals ${4(x + 14)}$, which gives ${x = 7}$ · 13 the lines to the centre make eight angles in four equal pairs adding up to $360^\circ$ |
| Examples 1–3 | as set out in the chapter, each re-derived; ${TP = \frac{20}{3}}$ cm by both methods |

Beyond the Book: Stage 1 — ${\frac{120}{13}}$ cm; 7, 5 and 3 cm; no; 12 cm and ${6\sqrt{3}}$ cm; 1 cm. Stage 2 — (b), (c), (b), (b), (a).
Set A a b c c d c a b; Set B b c a c a b; Set C b a c d d.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| Theorem 10.1: "So OP is perpendicular to XY (as shown in Theorem A1.7)" | a short argument: drop the perpendicular OM; if M were not P, OP would be the hypotenuse of a right triangle and longer than OM | C6: Theorem A1.7 is in an appendix this book does not have |
| footnote: the word *tangent* "introduced by the Danish mathematician Thomas Fineke in 1583" | in the running text, spelt Fincke | the book has no footnotes; the name is Thomas Fincke (1561–1656) |
| Activity 1: Q<sub>1</sub>–Q<sub>3</sub>, R<sub>1</sub>–R<sub>3</sub> and the positions A′B′, A″B″ | two points on each side and the one tangent position A′B′ | the figure is legible at its printed size with fewer lines |
| Remark 1 after Theorem 10.1 | adds that the tangent is the line perpendicular to the radius | M3: says why there is only one |
| Example 3: "TO is the angle bisector of ∠PTQ. So, OT ⊥ PQ" and "(Why?)" | the reasons given: Remark 2, the bisector in an isosceles triangle, and the angle sum of the right triangle TRP | M2 |
| Exercise 10.1 Q2 blanks; Q3 options (A)–(D) | KaTeX blanks; (a)–(d) | the book's style |
| Exercise 10.2: "In Q.1 to 3, choose the correct option and give justification" | the first sentence of Question 1 | the book has no text between a band and its first question |
| Exercise 10.2 Q5: "the perpendicular at the point of contact to the tangent" | "the perpendicular to a tangent at its point of contact" | L3 |
| Exercise 10.2 Q8: "drawn to circumscribe a circle" | glossed at first use: each side touches the circle | the term is not defined in the chapter |
| summary point 1: "The meaning of a tangent to a circle" | the meaning itself | a summary point should state the fact |
| line-sized additions: in Activity 2 (try a secant through the centre); in Example 3 (the isosceles fact is from Class 9; the right angles at R complete AA; the Pythagoras route needs no similar triangles) | added | fitting |
| the proof of Theorem 10.2 introduced with one sentence instead of two | shorter | fitting |
| Beyond the Book: solutions to Problems 1–5 cut to one line of working a step and a shorter option paragraph; stage 1's fourth and fifth explanations shortened; Set A Q1 and Q6 options in two columns | changed | fitting and legibility |
| lengths with units (${AB = 10}$ cm) | kept on one line with `.nb` | KaTeX broke before the unit |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| Exercise 10.2 Q12 | M2 | the answer needs the area of the triangle two ways (Heron's formula, or joining the centre to the vertices), which no example in the chapter shows | a hint, or a worked example of area = radius × semi-perimeter |
| Exercise 10.1 Q4 | C4 | asks for a tangent to be drawn, but drawing a tangent is not taught; only Remark 1 implies it (the perpendicular to the radius) | a pointer to Remark 1 |
| Activity 1 | C6 | "This shows that a tangent exists at the point P" — the activity suggests it; Theorem 10.1 and Remark 1 are what show it | none at this level |
