# Class 10 · Mathematics I · Chapter 6 — Triangles

## Solved examples in examination formats, 24 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 15 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-10/ch06-triangles/`.

Source `build/jee-class10.mjs`; check `build/check-jee-class10.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p111; the answers stage still opens a fresh page.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) 6 cm |
| 2 | Single correct | (b) 12 cm |
| 3 | Single correct | (c) $3 : 5$ |
| 4 | Single correct | (d) 30 m |
| 5 | Single correct | (a) $DE \parallel BC$ |
| 6 | Single correct | (b) $60^\circ$ |
| 7 | Multiple correct | (a), (b), (d) |
| 8 | Multiple correct | (a), (b), (c) |
| 9 | Multiple correct | (a), (b), (d) |
| 10 | Multiple correct | (a), (b), (c) |
| 11 | Numerical answer | 3.6 |
| 12 | Numerical answer | 42 |
| 13 | Numerical answer | 12 |
| 14 | Matching | (b) P–3, Q–4, R–1, S–2 |
| 15 | Matching | (c) P–4, Q–1, R–2, S–3 |


## Syllabus audit fixes, 17 September 2026

Findings from the Beyond the Book syllabus audit, each confirmed on the pages.
**Pages: 37 before (24 body + 13 Beyond), 37 after (24 + 13).** The body was
not touched.

- **Stage 1, second try: $BD^2 = AD \cdot DC$ (dropped).** This is old
  Theorem 6.7, from the Pythagoras section removed in 2023. Replaced by a try
  of the same kind, a proof with no lengths: in parallelogram ABCD, a line
  through A meets BD at P, DC at Q and BC produced at R; show
  $AP^2 = PQ \cdot PR$. The explanation uses two AA pairs (△APD ~ △RPB,
  △QPD ~ △APB) that both give $\frac{DP}{PB}$. It does not repeat Exercise
  Set 6.3 Q8 or practice Q26, which use different figures and claims.
- **Stage 1, fifth try: the mirror on the ground (borderline, needs the law
  of reflection).** Replaced by a shadow-stick AA try: a 1.2 m stick casts
  1.6 m, and a flagpole's shadow is 10 m longer than the pole, so the pole is
  30 m tall with a 40 m shadow. It is set as an equation so that it does not
  repeat Exercise Set 6.3 Q15, Example 13 or case Q29.
- **Practice Q11: BD from AD = 4, DC = 9 (dropped result).** Replaced by an
  MCQ on DE ∥ BC: AD 3, DB 7, BC 20, so DE = 6 cm. Options: 8.6 (AD : DB),
  14 (DB : AB), 10 (half of BC), 6. The key stays (d), so the letter spread
  is unchanged. The why-wrong row and `ANSWERS.md` were rewritten.
- **Gap: RHS was never worked.** New **Example 12** under Type 6, renamed
  *The SSS, SAS and RHS criteria*: right triangles with hypotenuse and side
  10, 6 and 15, 9, so they are similar by RHS and QR = 12 cm. Old Examples
  12–14 become **13–15**. No text cited them by number. **Solved Examples:
  15** (was 14).
- `check-numbers.mjs`: Stage 1 Q2 is now checked on coordinates, with three
  lines through A on a slanted parallelogram. Q5 now checks the flagpole and
  its shadow. Ex 12 checks its RHS ratios, QR, and that both triangles are
  right-angled. Q11 checks the key and every distractor. The example numbers
  were updated. Each new value was broken on purpose and caught (flagpole
  height, shadow and difference; the Q2 claim; Ex 12's QR and PQ; Q11's BC,
  a distractor, the key letter and `ANSWERS.md`; the numbering). It passes
  with 277 claims.
- `check-no-repeats`: the same four pairs as before, all judged already.
- **Fitting.** `refit … bridge` left p110 and p111 running 1.9 mm and
  3.7 mm into the margin. Q24 was reworded (*Prove that two similar
  triangles have perimeters in the ratio of their corresponding sides.*) and
  Q28 lost *with D on BC and M on QR* (now *with altitudes AD and PM*); each
  saved a line. Example 13's Step 1 was shortened so that Example 14 fits on
  p107 (`unsettle` 108). Practice questions were then pulled back a page at a
  time (`unsettle` 109 ×3, 110 ×2, 111 ×2). p111 (72%) is the short page
  before Answers, which opens a fresh page. p102 (69%) and p103 (74%) are
  held open by the next example's panel. Page 21 of the body runs 1.3 mm into
  the margin, but the body is untouched by this pass. Orphans 0, options fit,
  labels clear.

## Brought to the Class 7 standard, 17 September 2026

Phase 4 of `PLAN-MATHS-CONSISTENCY.md`, worked from the brief built on
Chapter 1. The page move, the examples, Beyond the Book and the answers were
done in one pass, and every check was run on the chapter.

**Pages: 33 before (26 body + 7 Beyond, Crown Quarto), 37 after (24 body + 13
Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`. The body was
refitted once and then placed by hand (below).

**All eight body examples set as steps**, the Class 10 decision. Each
example's working moved from the `.work--list` block after its panel into
the panel as *Solution*, Steps and *Answer*, a statement to a row with its
reason in `.work__why` (Theorem 6.1, AA similarity, alternate angles …).
- Every example is a proof or leans on its figure, so **each figure moved
  inside its panel, after the work rows**, as in Chapter 3. Example 2 carries
  both Fig. 6.14 and Fig. 6.15.
- Equation tags (1)–(10) are kept in the rows, and the reasons cite them
  (*from (1) and (2)*), so the proofs read as NCERT's do.
- **Example 8** (three parts) is one panel: a short line for each part —
  *(i) Since …*, *(ii) From (5) and (1),*, *(iii) Again using (1) and (8),* —
  then Steps 1–12 across three `.work` blocks, and one *Answer*. Its closing
  remark (part (iii) by SAS) stays after the panel.
- The theorem proofs (6.1–6.5) and their (Why?)/(How?) lists are running
  text and are untouched.

**Verified** by `build/check-body-maths.mjs`: 275 expressions and 229
numbers, none lost and none added. The gains are 1, 6, 9 and 6.1, restated in
reasons and Answer rows.

**Hand-fitting in the body, logged:**
- The refit gave 25 pages with Examples 4–7 alone on four short pages.
  Examples 5 and 6 missed sharing a page by about 7 mm, so each lost one
  row: Example 5's *∠C = ∠P* row became its Answer (*∠P = ∠C = 40°, as
  corresponding angles …*); Example 6's Steps 2 and 3 became one row
  (*∠AOD = ∠COB (2); by (1) and (2), △AOD ~ △COB*). **Example 6's
  question lost the words "Here the segments AB and CD meet at O"**; the
  figure's caption, *AB and CD meet at O*, still says it. Example 6 now
  shares page 18 with Example 5, and the later body pages were renumbered
  (p020–p025 became p019–p024).
- **A question and its figure.** The refit put Exercise Set 6.2 Q6 on page 11
  and Fig. 6.21 overleaf. Q6 moved to the head of page 12, and three prose
  blocks moved on a page each (pages 12→13→14) to make room. After the
  renumbering, Set 6.3 Q4 and Q12 were also a page turn from Figs 6.36 and
  6.41; Q4 moved to page 22, Q8 to page 23 and Q12 to page 24. Every
  question that names a figure is now on the figure's page.
- **Four figures drew a line past the side it ends on.** DE in Fig. 6.13,
  DE and DE′ in Fig. 6.12, and DE in both parts of Fig. 6.17 ran 11–18 units
  beyond AC, though E is *on* AC. Their end points were moved onto AC,
  computed as the intersection. Found with a scratch overshoot check; the
  rays in Figs 6.9, 6.11 and 6.23 and the ground in Fig. 6.32 run on by
  design and were left.

**Beyond the Book rebuilt to the four stages:**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, explained in running text | **kept word for word** except `.c-stage__for`, and one give-away (below) |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems | **14 stepped examples** under eight `Type` heads; old Problems 1–4 are Examples 3, 7, 9 and 12, old Problem 5 is recast as Example 14 |
| 3 Problem Sets → **Practice** | 3 sets, 19 questions | **one run of 30** in six forms |
| 4 Answers & Takeaways → **Answers** | key and why the options are wrong | key, every other answer, why the options are wrong for 13, the closing paragraph |

**Class 10's old Stage 2 is separate problems** (*Five multiple-choice
problems, each solved*), so Stage 1 stays as it is and the problems become
Solved Examples.

**Worked examples in the chapter: 22** (8 body + 14 Beyond). Types: similar
polygons; the BPT; its converse; reading a similarity statement; AA; SSS and
SAS (with a proof from $AP \cdot AB = AQ \cdot AC$); heights and distances
(with a lamp-post word problem); two lines crossing between parallels.

**Practice: 30 questions** — 13 multiple choice, 4 assertion–reason, 4 very
short, 4 short (including the perimeter-ratio proof), 3 long (the
parallelogram EL = 2BL proof, a DE ∥ BC calculation and the altitude ratio
proof), 2 case-based (shadows; a ramp on posts). Key letters: a 3, b 5, c 5,
d 4. Old set items were reused where they answer no body question.
`fit-options --fix` narrowed Example 2's options and practice Q13's; the
second made p109 overrun by 9.5 mm, so Q17 moved to p110 and Q28 to p111.

**Give-aways found and fixed:**
- **Stage 1, question 4** asked *Are any two isosceles triangles similar?*,
  and its explanation showed they are not. That rules out *isosceles* in
  Exercise Set 6.1 Q1 (iii) and leaves *equilateral*. The first half of the
  question and its two sentences were deleted; the right-angled isosceles
  half stays word for word.
- **Old Problem 5 and old Set B Q4** proved △AOB ~ △COD in a trapezium from
  alternate angles, which is Exercise Set 6.3 Q3. Problem 5 became Example
  14, the same numbers in two segments crossing between parallels, citing
  Example 4 of the chapter rather than re-proving it; Set B Q4 was dropped.
- **Old Set C Q1** worked △ADC ~ △BAC to get $CA^2 = CB \cdot CD$, which is
  Exercise Set 6.3 Q13. Dropped.
- **Old Set C Q3** stated △ABE ~ △CFB, the claim of Exercise Set 6.3 Q8.
  Dropped.
- **Old Set A Q8's** answer proved DE ∥ BC by Theorem 6.2, which is
  Exercise Set 6.2 Q8. Kept as practice Q6, answered by the mid-point
  theorem from Class IX instead.
- **Old Set A Q1** had *two squares* as its answer and **old Set C Q5** had
  *All equilateral triangles are similar* as a true option: both answer
  Exercise Set 6.1 Q1. Replaced by Example 2 (regular hexagons) and practice
  Q13 (regular pentagons).
- **New Example 4 printed AD = 2.4 cm** in a DE ∥ BC triangle, which is the
  answer to Exercise Set 6.2 Q1 (ii). Its numbers were changed (AD 3, AE 2.5,
  EC 4; AB 7.8 cm).
- `check-no-repeats` then reports 4 pairs at 50% or more, each judged: the
  Q2-style ratio test (practice Q7) with other numbers, the Stage 1 item
  above (now fixed), and practice Q13's *All congruent triangles are
  similar* against the body's circles and squares, which the body already
  states on page 1.

**`ANSWERS.md` written** for Exercise Sets 6.1–6.3, the questions in the
running text (including every (Why?)/(How?) in the proofs of Theorems
6.2–6.5 and what each activity should show), Stage 1 and all 30 practice
questions. Proofs are one statement to a line; constructions say what the
figure must show; Set 6.1 Q2 gives a worked instance.

### Verified

`check-numbers.mjs` passes **259 claims**, evaluating 67 printed identities
(fractions, surds, degrees, and proportions with one unknown solved against
the value printed after them). It reads **figure labels back by geometry** —
each measure to the nearest side, each angle to the vertex of its arc — and
re-derives from them:
- Fig. 6.5's four ratios and angles, Figs 6.6–6.8, 6.25, 6.27, 6.30;
- Exercise Set 6.2 Q1 from Fig. 6.17 (and that D divides AB in the printed
  ratio), Q2 from the question's own values;
- **every verdict in Set 6.3 Q1 from Fig. 6.34**, including that the 80° in
  (v) is not between the marked sides, and the correspondence *ABC ~ QRP*;
- Set 6.3 Q2 from Fig. 6.35, Q15, Examples 5 and 7, Activities 2–6 (the
  Activity 4 lengths by the sine rule);
- Stage 1, every Solved Example, the practice answers a lettered part at a
  time, every multiple-choice question in both stages (exactly one right
  option, matching the key, and the distractors each example explains), and
  every assertion–reason letter;
- `ANSWERS.md`'s key and working.

**Break tests: 18 of 18 caught**, run on a scratch copy (body answers,
figure labels, a question's given value, Beyond examples, Stage 1, a key
letter, key rows, a lettered part set without maths, an option, a
distractor, `ANSWERS.md` values and key). Two tests were themselves wrong at
first — one aimed at the wrong page file, one added text without changing a
value — and were rewritten.

**A number found wrong and fixed while writing `ANSWERS.md`:** my own
Activity 4 lengths (AB ≈ 2.05, CA ≈ 2.76) did not match the sine rule; the
check caught it and they are 1.96, 2.64, 3.26 and 4.40 cm.

**Fitting:** nothing is clipped; page 21 runs 1.3 mm into the bottom margin.
`orphans` finds 0 stranded openers, `check-labels` no collisions,
`fit-options` every row fits. I read the proofs of pages 8, 10, 18, 19, 26,
30, 35 and 36.

**Colour:** pages 3, 21 and 36 read in greyscale and deuteranopia. Fig. 6.4's
one fill is a pale shadow named in the caption; nothing depends on colour.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 7 | 83% | Example 1 overleaf, a panel with its figure (138 mm) |
| 8 | 60% | Example 1 alone; Example 2 overleaf (169 mm, two figures) |
| 9 | 73% | Example 2 alone; Example 3 overleaf (124 mm) |
| 17 | 58% | Example 4 alone; Examples 5 and 6 fill page 18 |
| 19 | 67% | Example 7 alone; Example 8 overleaf (222 mm) |
| 23 | 82% | Set 6.3 Q12, moved to face Fig. 6.41 on page 24 (`data-close`) |
| 26, 27 | 71%, 74% | Solved Examples panels |
| 29, 31 | 74%, 67% | a `Type` head with its example |
| 34, 35 | 83%, 75% | practice blocks moved after `fit-options`; page 35 ends before **the Answers stage, which always opens a page** |
| 36, 37 | 75%, 74% | the answers; the last page |

### Flagged, not done

- **Fig. 6.34 (iv):** the 70° label sits nearer N than M, though its arc is
  at M. A reader could take it as ∠N. Left, since moving a label is a
  drawing change beyond this pass.
- **Unsourced history:** Thales' dates (below, already flagged).
- **Body examples are tall:** stepped with their figures, Examples 1–8 hold
  five pages open. Setting a figure beside its rows would need a component.
- The *Every answer worked* table below predates this pass; for the current
  Beyond key, see `ANSWERS.md`.

---

Written new from NCERT *Mathematics, Textbook for Class X* (reprint 2026-27),
Chapter 6, *Triangles* (textbook pages 73–98). Original LearnLab text in
NCERT's order of topics, activities, examples and questions; no sentence is
carried over. Crown Quarto, house design, palette `bronze`. The source PDF has
no answer key; every answer below was worked here.

Sections: 6.1 Introduction · 6.2 Similar Figures · 6.3 Similarity of
Triangles · 6.4 Criteria for Similarity of Triangles. *Exercise 6.1*–*6.3* are
Exercise Sets 6.1–6.3. The definitions of similar polygons and similar
triangles, Theorems 6.1–6.5 and the AA criterion are `c-keyidea` blocks. The
activities are paragraphs led by **Activity N.**; proofs and solutions are
`.work--list` rows with the reason in brackets. The source's *6.5 Summary* is
the chapter summary; its *A note to the reader* (the RHS criterion) is a
`c-tip`.

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted: `check-body-maths` reports no mathematics lost or added, `check-numbers.mjs` passes, 0 stranded openers, every option row fits, no label collisions. One coordinator edit: in Fig. 6.34 (iv) the 70° label sat at (227.8, 159.5), nearer N than M, and read as the angle at N. It is now at (228.5, 155), inside the angle at M just past its arc. `check-labels` is clean, and the proof was read.

## Figures

All 41 come from `fig6.mjs` in the session scratchpad and are drawn from the
source's pictures, not traced.

| figure | note |
|---|---|
| Fig. 6.1 | circles, squares and equilateral triangles in three sizes, in one row with (i)–(iii) |
| Fig. 6.3 | the source's three photographs of the Taj Mahal are drawn as outlines of one domed monument in three sizes; the text still names the Taj Mahal |
| Fig. 6.4 | the source's classroom picture is reduced to the bulb O, the card ABCD, the shadow A′B′C′D′ and the rays |
| Fig. 6.5 | drawn from AB, BC, DA and the angles at A and B; CD and the angles at C and D then come out close to, not exactly at, the marked 2.4 cm, 70° and 85°, which the source rounds; the two quadrilaterals are drawn at nearly the same size, not in the ratio 1 : 2, so that the labels of the smaller one can be read |
| Figs. 6.24, 6.26, 6.28 | one drawing, used three times, as in the source |
| Fig. 6.34 | six pairs in three rows; the drawings follow the marked measures but not one scale, and the question now says so |
| Fig. 6.35 | drawn with the answer's angles (70°, 55°, 55°), so the figure agrees with the key |
| Fig. 6.36 | ∠1 at Q and ∠2 at R (∠PRQ), which is the reading under which the question is provable |
| the Thales portrait | not drawn; his name and dates stay in the text |

## Every answer worked

| where | answers |
|---|---|
| Set 6.1 | 1 (i) similar (ii) similar (iii) equilateral (iv) equal, proportional · 2 (i) for example two circles of different radii, two squares of sides 2 cm and 5 cm (ii) for example a square and a rectangle that is not a square, a triangle and a square · 3 not similar: the sides are in the same ratio, but the rhombus has no right angles |
| Set 6.2 Q1, Q2 | 1 (i) EC = 2 cm (ii) AD = 2.4 cm · 2 (i) $\frac{PE}{EQ} = 1.3$, $\frac{PF}{FR} = 1.5$: not parallel (ii) both $\frac{8}{9}$: parallel (iii) EQ = 1.10, FR = 2.20, both ratios $\frac{9}{55}$: parallel |
| Set 6.2 Q3–Q10 | 3 $\frac{AM}{AB} = \frac{AL}{AC} = \frac{AN}{AD}$ by Example 1 in △ABC and △ADC · 4 $\frac{BD}{DA} = \frac{BE}{EC}$ (DE ∥ AC) and $\frac{BD}{DA} = \frac{BF}{FE}$ (DF ∥ AE) · 5 $\frac{PE}{EQ} = \frac{PD}{DO} = \frac{PF}{FR}$, then Theorem 6.2 · 6 $\frac{OB}{BQ} = \frac{OA}{AP} = \frac{OC}{CR}$, then Theorem 6.2 · 7, 8 the mid-point theorem and its converse · 9 draw OE ∥ AB meeting AD at E; Theorem 6.1 in △ADC and △DAB gives $\frac{AO}{OC} = \frac{BO}{OD}$ · 10 the line through O parallel to AB meets AD at E; Theorem 6.2 gives EO ∥ DC, so AB ∥ DC |
| Set 6.3 Q1 | (i) similar, AAA, △ABC ~ △PQR (ii) similar, SSS, △ABC ~ △QRP (iii) not similar, $\frac{2.7}{5} \neq \frac{1}{2}$ (iv) similar, SAS, △MNL ~ △QPR (v) not similar by any criterion: the 80° angle in △ABC is not between the two sides given (vi) similar, AA (∠F = 30°, ∠P = 70°), △DEF ~ △PQR |
| Set 6.3 Q2, Q15 | 2 ∠DOC = 55°, ∠DCO = 55°, ∠OAB = 55° · 15 42 m |
| Set 6.3 proofs | 3 △OAB ~ △OCD (alternate angles, AA) · 4 ∠1 = ∠2 gives PQ = PR, so $\frac{QS}{QR} = \frac{QP}{QT}$ with ∠Q common (SAS) · 5 ∠R common (AA) · 6 AD = AE and AB = AC, so $\frac{AD}{AB} = \frac{AE}{AC}$ with ∠A common (SAS) · 7 each pair shares an angle and has a right angle (AA) · 8 ∠A = ∠C and ∠AEB = ∠CBF (alternate angles, AD ∥ BC) · 9 ∠A common and right angles at B and M · 10 half-angles of equal angles are equal, then AA · 11 ∠ABD = ∠ACB = ∠ECF and right angles at D and F · 12 △ABD ~ △PQM (SSS, BD and QM are halves), so ∠B = ∠Q, then SAS · 13 △ADC ~ △BAC (AA), so $\frac{CA}{CB} = \frac{CD}{CA}$ · 14 extend AD to E and PM to L with DE = AD and ML = PM; then △ABE ~ △PQL (SSS) and △ACE ~ △PRL, which gives ∠A = ∠P, then SAS · 16 △ABD ~ △PQM (SAS) |
| Examples 1–8 | as set out in the chapter: ∠P = 40° (Example 5), shadow 1.6 m (Example 7) |

Beyond the Book: Stage 1 — $x = 4$; $BD^2 = AD \cdot DC$ from △ADB ~ △BDC;
ST ∥ QR and ST = 6 cm; no, and yes; 7.5 m. Stage 2 — (c), (b), (d), (b), (d).
Set A c b b a a c b c; Set B a c a b b c; Set C c d a b c.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| 6.1: similarity is to be used "in giving a simple proof of Pythagoras Theorem" | not said | this edition has no such proof; the sentence promised a result the chapter does not give (C3) |
| "(For the meaning of converse, see Appendix 1)" | the meaning given in brackets: the converse of "if P, then Q" is "if Q, then P" | the appendix is not part of this volume |
| Example 8's working, whose numbered steps (1)–(10) are out of order in the source | the same steps in order, with each reference pointing back to an earlier line | M2 |
| "similiar", "propogates" | corrected | typing |
| *A note to the reader* at the end, with a pointer to Example 2 of Chapter 8 | a tip after the SAS criterion; the pointer is not carried | the chapter was ending on a page holding only the note; the pointer names an example in another chapter that was not checked |
| Theorems 6.2–6.5: proofs sketched with (Why?) and (How?) | kept, with one sentence saying the marked steps are left for the reader | C5, as the source intends |
| Set 6.3 Q1 | adds that the drawings are not all to one scale | the figures follow the marked measures only |
| line-sized additions: in 6.2 (answering by looking without measuring, the ratios 3 : 3.5 and 3 : 3 in Fig. 6.6, checking Fig. 6.5 for yourself), in Activity 4 (a ruler and protractor, keeping and labelling the drawings), after it (measuring carefully), after the AAA criterion (what the name lists), before the proof of Theorem 6.3, in Example 7 (level ground, upright post, show each step), after Example 8, and in Set 6.3 Q2, Q8, Q9, Q13, Q14, Q15 and Q16 (drawing a figure first, naming the property used); in Beyond the Book, a check in Problem 2 and in Problem 3 and a sentence in Problem 4 | added | fitting a figure-heavy chapter: each says what the page already shows |
| Set 6.1 Q1 | part (iv) in a continued block (`li.cont`, `c-parts[data-start]`); Fig. 6.7 drawn with less white above it; "neither condition (i) nor condition (ii)" shortened to "neither condition" | fitting, after Fig. 6.5 was drawn shorter and every later break moved; the numbering is unchanged, and the set now opens page 5 |
| Set 6.2 Q1 and Q2 | one sentence each: write the ratio used; compare the two ratios and give a reason | fitting: page 11 was short under a figure too tall to move up |
| names, equals signs and units in prose ("DE = 4.5 cm"), and similarity statements such as △ABC ~ △DEF | kept on one line | layout: the proofs showed them broken across lines |
| Beyond the Book trace rows A2, B1, B4 and C3 | one clause shorter each | the section was ending on a page of three lines |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| Set 6.3 Q1 (v) | C4 | "not similar" is the expected answer, but strictly the marked parts only fail to show similarity: the 80° angle of △ABC is not between AB and BC | the key should say "cannot be shown similar from the marked measures" |
| Set 6.3 Q14 | M2 | the proof needs the medians extended to twice their length, a construction the chapter never shows | a hint, or a note in the key |
| 6.1 | — | "Chapters 8 and 9 of this book" are taken to be the trigonometry chapters; the volume's chapter list was not checked | check against the contents |
| 6.3 | — | Thales' dates are the source's 640–546 BCE; they are more often given as about 624–546 BCE | check if the dates are to be kept |
| Beyond the Book, Stage 1 | — | the mirror question uses the law of reflection (equal angles), which is science, not this chapter | none, but the explanation states it |


## 21 September 2026 — figure/table reference review

Reviewed this chapter in the all-maths reference audit. Figures and tables now use one chapter sequence, including Beyond the Book; captions and references were updated together. 6 dependent text/visual group(s) were kept together and the body refitted. Questions, calculations and artwork were preserved. The chapter and its volume were rebuilt; detailed layout checks and any remaining warnings are recorded in build/_all-maths-reference-checks/.
