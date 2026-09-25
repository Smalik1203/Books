# Class 10 · Mathematics I · Chapter 8 — Introduction to Trigonometry

## Solved examples in examination formats, 24 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 15 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-10/ch08-trigonometry/`.

Source `build/jee-class10.mjs`; check `build/check-jee-class10.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p111; the answers stage still opens a fresh page.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) $\frac{4}{5}$ |
| 2 | Single correct | (b) $\frac{13}{12}$ |
| 3 | Single correct | (c) 1 |
| 4 | Single correct | (d) $\frac{11}{4}$ |
| 5 | Single correct | (a) $45^\circ$ |
| 6 | Single correct | (b) 1 |
| 7 | Multiple correct | (a), (b), (d) |
| 8 | Multiple correct | (a), (b), (c) |
| 9 | Multiple correct | (a), (b), (d) |
| 10 | Multiple correct | (a), (b) |
| 11 | Numerical answer | 2.5 |
| 12 | Numerical answer | 8 |
| 13 | Numerical answer | 60 |
| 14 | Matching | (b) P–3, Q–4, R–1, S–2 |
| 15 | Matching | (c) P–4, Q–3, R–2, S–1 |


## Brought to the Class 7 standard, 17 September 2026

Phase 4 of `PLAN-MATHS-CONSISTENCY.md`, worked by one agent from the Class 10
brief, with Chapter 1 as the model. Page move, examples, Beyond the Book and
answers were done in one pass, and every check was run on the chapter.

**Pages: 29 before (22 body + 7 Beyond, Crown Quarto), 37 after (24 body + 13
Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`, and the body was
refitted once.

**All twelve body examples set as steps**, as decided for Class 10. Each
example's working moved out of the running text and into its panel as
*Solution*, Steps and *Answer*.
- **Proofs** (Example 2, and the identities in Examples 10, 11 and 12) are set
  one statement to a row with the reason beside it. Example 12's working,
  which had run onto the next page, is now whole in its panel.
- **Figures** that a question names (Figs. 8.8–8.12, 8.19, 8.20) now sit
  inside their example's panel, between the question and the Solution, as
  Class 8 does. Fig. 8.20 had been printed after Example 6, a page from
  Example 7, which names it.
- **NCERT's *Why?* prompts** in the working are kept, in the reason column
  (*Why?*, and *Why this ratio?* in Example 6). They are answered in
  `ANSWERS.md`.
- **Remarks kept as paragraphs after the panel:** Example 2's SSS reminder and
  its point that a sine fixes an acute angle; Example 6's Pythagoras
  alternative, with one line added in front of it saying how to choose the
  ratio; Example 7's "one side and one other part"; Example 12's plan (divide
  by $\cos\theta$), which sits at the foot of its panel.

**Verified** by `build/check-body-maths.mjs`: 460 expressions and 106 numbers
compared, none lost and none added. The only gains are numbers restated in
Answer rows and "Table 8.1" in two reasons.

**Hand-fitting in the body after the refit:** the 30°/60° heading, its first
paragraph and the congruence working moved back to page 12, with Fig. 8.15
now heading page 13, facing them. The 0°/90° heading, its paragraph and
Fig. 8.16 moved back to page 13 (100%). The two 90° paragraphs moved back to
page 14, beside Fig. 8.18, which they describe. Fig. 8.13 moved back to
page 10, beside Ex 8.1 Q2, which names it (1.3 mm into the margin). No text
was changed for any of this.

**Beyond the Book rebuilt to the four stages:**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, each explained in running text | **kept word for word**; `.c-stage__for` removed; one check changed (below) |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems | **15 stepped examples** under seven `Type` heads; the old problems are Examples 2, 4, 6 and 8 (Problem 1 with new numbers), options kept, *Answer* gives the letter |
| 3 Problem Sets → **Practice** | 3 sets, 19 questions | **one run of 31** in six forms: 15 multiple choice, 4 assertion–reason, 4 very short, 4 short, 2 long, 2 case-based |
| 4 Answers & Takeaways → **Answers** | key and why the options are wrong | key, every other answer, why the options are wrong for 13, the closing paragraph |

The seven types are the ratios from the sides of a right triangle; an
expression from one ratio; the values at the standard angles; finding an angle
from its ratio; one ratio in terms of another; proving an identity; and using
a given condition (eliminating $\theta$). With the body's 12, the chapter has
**27 worked examples**. Two examples I wrote were dropped again to save a
page, because they repeated the pattern of the examples beside them.

**Give-aways found and fixed** (every value Beyond printed was read against
the body's exercises):
- **Stage 1**, the check after the $\sec\theta + \tan\theta = p$ question: with
  $p = 2$ it printed $\tan\theta = \frac{3}{4}$, the value Ex 8.1 Q8 asks the
  reader to find first. Now $p = 7$: $\sec\theta = \frac{25}{7}$,
  $\tan\theta = \frac{24}{7}$.
- **Old Problem 1** ($\cos A = \frac{4}{5}$) and **Set A Q2**, **Set B Q2** and
  **Set B Q5** all printed the 3–4–5 values that answer Ex 8.1 Q8. They now use
  9–40–41, 33–56–65, $\tan A = \frac{1}{2}$ and 20–21–29.
- **Set C Q3** (a 6–8–10 triangle, the same values) was dropped.
- **Set A Q6** ($\sin R$ in a triangle PQR right-angled at Q) repeated
  Example 7's first step, so it now asks for $\cos Z$ in triangle XYZ.
- **Set A Q8** offered $\frac{4}{3}$, the value Ex 8.1 Q11 (v) asks about; now
  $\frac{5}{4}$.
- **Set B Q1** ($\sin\theta = \cos\theta$ gives $45^\circ$) answered Ex 8.2 Q4
  (iv), and was dropped.
- **Set B Q4** ($\sin 60^\circ = 2\sin 30^\circ$) ruled out an option of
  Ex 8.2 Q2 (iii). It is now the same question asked about $\cos 60^\circ$ and
  $1 - 2\sin^2 30^\circ$.
- `check-no-repeats` reports one pair above 50%: Beyond Example 9 (cos and sin
  in terms of tan) against body Example 9 (in terms of sin). This is the same
  kind of question about a different ratio, and neither Ex 8.3 Q1 nor Q2 asks
  for it, so it stays.

**`ANSWERS.md` written** for Exercise Sets 8.1–8.3 (every proof one statement
to a line, with the ten identities of 8.3 Q4 in full), the questions in the
running text (the ratios of C, the $\triangle QAN$ check, the $\sin A = \frac{1}{3}$
ratios, the ratios of $90^\circ$), every *Why?* in the text and the examples,
Stage 1, and all 31 practice questions with their working.

### Verified

`check-numbers.mjs` passes **918 claims**. It parses the LaTeX itself (sin,
cos, tan, cosec, sec, cot, roots, fractions, powers, degrees and implicit
products), so no value is looked up.
- **171 identities** hold at five random angles. **49 of them are proof
  rows:** a row that opens with "=" or says LHS or RHS is read against the
  identity being proved, so every step of every proof, in the book and in
  `ANSWERS.md`, is checked.
- **431 statements** hold under the data of the block they sit in. Each
  example, question and key row has its givens worked out in the script
  (Example 5: $OP = 7$ and $OQ - PQ = 1$ give $PQ$), so a value that is true
  somewhere else in the chapter does not pass.
- **95 arithmetic statements** hold at the standard angles.
- **5 statements the book prints as false** are checked to be false.
- 9 spans are skipped: the six worded definitions, and three "not defined"
  values.

B covers:
- Table 8.1, all 30 cells;
- every labelled figure, twice: its labels give the printed answer (Fig. 8.10
  gives Example 3; Fig. 8.13 gives Ex 8.1 Q2), and its drawn angle is within
  2° of the angle the text makes it;
- the answers that sit beside other numbers, a lettered part at a time, in
  both the key rows and `ANSWERS.md`;
- the true/false answers to Ex 8.1 Q11 and Ex 8.2 Q4.

C checks all 15 practice MCQs, the 4 Beyond example MCQs and the 8 option
questions in Exercise Sets 8.2 and 8.3. Each has exactly one right option,
matching the key or `ANSWERS.md`, and every assertion–reason letter is
derived. D checks that the two keys match.

**Break tests: 21 of 21 caught**, run on a copy in the scratch folder. They
changed a body step, a body Answer row with no equals sign, a Table 8.1 cell,
a proof row, a figure label, a Beyond answer, the Stage 1 check, two key
letters (one assertion–reason), a key row, a bare number in a lettered part,
an option, an example's answer letter, and in `ANSWERS.md` a value, an option
letter, a proof step, the key, a practice value, an area and a true/false.
The first run missed nothing, but one test's pattern did not match the
refitted markup, and it was rewritten.

**Faults in the check itself, fixed while writing it:**
- a stored false statement had its spaces stripped, which joined `\sin` to
  its angle;
- `ANSWERS.md`'s part markers carried past the end of Ex 8.3 Q4 into the
  practice working;
- Example 2's proof target ($\angle B = \angle Q$) is not an identity, so
  only identities are now taken as targets.

**Wrong printed numbers:** none were found in the body. The source's values
are all correct, as the earlier log below says.

**Fitting:** nothing is clipped. Page 16 runs 1.6 mm, page 10 runs 1.3 mm and
page 34 runs 0.8 mm into the bottom margin. `orphans` finds 0 stranded openers, `fit-options`
finds every option row fits, and `check-labels` finds no collisions. I read
the proofs of pages 7, 12, 14, 22, 26, 30, 35 and 36.

**Colour:** pages 1–14, 16, 17 and 19 were run through `check-colour`, and
pages 10 and 13 were read in greyscale and deuteranopia. Every figure is line
work with no fills, and angles are marked with arcs and labels, so nothing is
carried by colour.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 1, 3, 4, 12 | 85–89% | a figure or key idea too tall for the gap |
| 6, 8, 9 | 54–65% | Examples 2, 4 and 5: each a panel with its figure (126–165 mm) |
| 7 | 82% | Example 3, a panel |
| 11 | 61% | the 8.3 opener: pulling it back strands the heading or puts Fig. 8.14 overleaf from its text |
| 14 | 81% | Table 8.1 with its lead-in sentence |
| 15, 16 | 44–64% | Examples 6 and 7, panels with figures (114–126 mm) |
| 17, 22 | 78–85% | practice blocks with nested options, too tall for the gap |
| 18, 21, 23 | 77–86% | a heading, an example panel, and the summary |
| 24 | 28% | the last body page (`data-close`) |
| 26–29 | 65–75% | Solved Examples: a `Type` head with its example, and example panels. Pulling Example 2 onto page 26 by hand put that page 2.9 mm into the margin and left page 27 at 29%, so the refit's layout was kept |
| 30, 34, 36 | 81–83% | an example, a case question, and a block of answer rows |
| 35 | 57% | **the Answers stage, which always opens a page** |
| 37 | 49% | the last page |

### Flagged, not done

- **Fig. 8.15:** the $30^\circ$ label sits against the altitude AD. It is
  readable, and `check-labels` passes it. The label predates this pass.
- **Stage 1** keeps its old closing sentences ("The value of $\theta$ was
  never needed"). They are word for word, as the brief requires.
- **The older sections below** ("Every answer worked", the Beyond key line,
  and the Problem Sets fitting notes) describe the old Beyond shape. They are
  superseded by `ANSWERS.md` and the sections above.
- The earlier flags below still stand: the Herbart date, the *sinus* gloss,
  and the range in Ex 8.2 Q4 (ii), which `ANSWERS.md` now states.

Written new from NCERT *Mathematics, Textbook for Class X* (reprint 2026-27),
Chapter 8, *Introduction to Trigonometry* (textbook pages 113–132). Original
LearnLab text in NCERT's order of topics, examples and questions; no sentence
is carried over. Crown Quarto, house design, palette `fern`. The source PDF has
no answer key; every answer below was worked here.

Sections: 8.1 Introduction · 8.2 Trigonometric Ratios · 8.3 Trigonometric
Ratios of Some Specific Angles · 8.4 Trigonometric Identities. *Exercise
8.1*–*8.3* are Exercise Sets 8.1–8.3. The six definitions, the fact that the
ratios depend only on the angle, and the three identities are `c-keyidea`
blocks; Table 8.1 is a book table; working is set as `.work--list` rows. The
source's *8.5 Summary* is the chapter summary.

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted: `check-body-maths` reports no mathematics lost or added, `check-numbers.mjs` passes, 0 stranded openers, every option row fits, no label collisions. Body pages 6, 8, 9, 15 and 16 run 44–65%, each held by an example panel carrying its figure. The body went from 22 pages to 24. Listed for the user.

## Figures

All 21 come from `fig8.mjs` in the session scratchpad (unfilled copy
`c8-src`) and are drawn from the source's pictures, not traced.

| figure | note |
|---|---|
| Figs. 8.1–8.3 | the source's drawings of the Qutub Minar, the house and temple on two river banks, and the balloons are reduced to outlines, with the imagined right triangle dashed and its right angle marked |
| Figs. 8.4, 8.5 | the side names are set horizontally beside the sides, not rotated along them |
| Fig. 8.17 | the source's six triangles in one row are set in two rows of three, so that the labels of neighbouring triangles do not run together |
| Fig. 8.18 | five triangles in one row, as in the source, spaced wider |
| the Aryabhata portrait | not drawn; his name and dates stay in the text |

## Every answer worked

| where | answers |
|---|---|
| Set 8.1 Q1–Q5 | 1 ${AC = 25}$ cm; (i) ${\sin A = \frac{7}{25}}$, ${\cos A = \frac{24}{25}}$ (ii) ${\sin C = \frac{24}{25}}$, ${\cos C = \frac{7}{25}}$ · 2 ${QR = 5}$ cm, ${\tan P = \cot R = \frac{5}{12}}$, so the answer is 0 · 3 ${\cos A = \frac{\sqrt{7}}{4}}$, ${\tan A = \frac{3}{\sqrt{7}}}$ · 4 ${\sin A = \frac{15}{17}}$, ${\sec A = \frac{17}{8}}$ · 5 ${\sin\theta = \frac{5}{13}}$, ${\cos\theta = \frac{12}{13}}$, ${\tan\theta = \frac{5}{12}}$, ${\operatorname{cosec}\theta = \frac{13}{5}}$, ${\cot\theta = \frac{12}{5}}$ |
| Set 8.1 Q6–Q11 | 6 as Example 2, with cosine in place of sine · 7 (i) $\frac{49}{64}$, since the expression is ${\frac{\cos^2\theta}{\sin^2\theta}}$ (ii) $\frac{49}{64}$ · 8 yes: both sides are $\frac{7}{25}$ · 9 sides 1, $\sqrt{3}$, 2; (i) 1 (ii) 0 · 10 ${QR = 12}$ cm, ${PR = 13}$ cm; ${\sin P = \frac{12}{13}}$, ${\cos P = \frac{5}{13}}$, ${\tan P = \frac{12}{5}}$ · 11 (i) false: ${\tan 60^\circ = \sqrt{3}}$ (ii) true: a right triangle with hypotenuse 12 and adjacent side 5 (iii) false (iv) false (v) false: ${\sin\theta \leq 1}$ |
| Set 8.2 | 1 (i) 1 (ii) 2 (iii) ${\frac{3\sqrt{2} - \sqrt{6}}{8}}$ (iv) ${\frac{43 - 24\sqrt{3}}{11}}$ (v) $\frac{67}{12}$ · 2 (i) (a) (ii) (d) (iii) (a) (iv) (c) · 3 ${A = 45^\circ}$, ${B = 15^\circ}$ · 4 (i) false (take ${A = B = 30^\circ}$) (ii) true for ${0^\circ \leq \theta \leq 90^\circ}$ (iii) false (iv) false (only at $45^\circ$) (v) true |
| Set 8.3 Q1–Q3 | 1 ${\sin A = \frac{1}{\sqrt{1 + \cot^2 A}}}$, ${\sec A = \frac{\sqrt{1 + \cot^2 A}}{\cot A}}$, ${\tan A = \frac{1}{\cot A}}$ · 2 ${\cos A = \frac{1}{\sec A}}$, ${\sin A = \frac{\sqrt{\sec^2 A - 1}}{\sec A}}$, ${\tan A = \sqrt{\sec^2 A - 1}}$, ${\cot A = \frac{1}{\sqrt{\sec^2 A - 1}}}$, ${\operatorname{cosec} A = \frac{\sec A}{\sqrt{\sec^2 A - 1}}}$ · 3 (i) (b) (ii) (c) (iii) (d) (iv) (d) |
| Set 8.3 Q4 | (i) ${\frac{(1 - \cos\theta)^2}{\sin^2\theta} = \frac{(1 - \cos\theta)^2}{(1 - \cos\theta)(1 + \cos\theta)}}$ (ii) the sum is ${\frac{\cos^2 A + (1 + \sin A)^2}{(1 + \sin A)\cos A} = \frac{2(1 + \sin A)}{(1 + \sin A)\cos A}}$ (iii) in sines and cosines the LHS is ${\frac{\sin^3\theta - \cos^3\theta}{\sin\theta\cos\theta(\sin\theta - \cos\theta)} = \frac{1 + \sin\theta\cos\theta}{\sin\theta\cos\theta}}$ (iv) both sides equal ${1 + \cos A}$ (v) as Example 12, with $\operatorname{cosec} A$ and $\cot A$ (vi) multiply top and bottom inside the root by ${1 + \sin A}$ (vii) ${1 - 2\sin^2\theta = 2\cos^2\theta - 1}$ (viii) expanding gives ${5 + \operatorname{cosec}^2 A + \sec^2 A}$ (ix) both sides equal ${\sin A\cos A}$ (x) ${\frac{\sec^2 A}{\operatorname{cosec}^2 A} = \tan^2 A}$, and ${1 - \cot A = \frac{\tan A - 1}{\tan A}}$ |
| Examples 1–12 and the worked passages | as set out in the chapter, each re-derived; the source's values are all correct |

Beyond the Book: Stage 1 — $\frac{1}{\sqrt{3}}$; shown; $60^\circ$ or $0^\circ$; no, the sum is at least 2; $\frac{1}{p}$ and ${\frac{p^2 + 1}{2p}}$. Stage 2 — (b), (a), (b), (a), (a).
Set A b a c d c b d c; Set B b c d b a b; Set C a b c d c.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| the epigraph from J.&nbsp;F. Herbart, dated 1890 | one sentence in 8.1, without the date | the book has no epigraph component; the date is flagged below |
| "`gon' (meaning sides)" | *trigonon* (a triangle, a figure with three angles) and *metron* (measure) | the source's gloss is wrong: *gonia* means angle |
| the boxed history of the sine, with a portrait of Aryabhata | a paragraph led by **From history.**; "A.D. 500" as 500 CE, beside the source's own "C.E. 476–550"; "Aryabhatta" spelt Aryabhata throughout | one era notation and one spelling |
| Remark: sin A or cos A "is always less than 1 (or, in particular, equal to 1)" | less than 1 for an acute angle, and equal to 1 for one of them at $0^\circ$ or $90^\circ$ | the source's bracket is unclear before those angles are defined |
| the bold statement that the ratios do not vary with the sides | a key idea | it is the result the passage turns on |
| identities (2), (3) and (4) with their ranges | also collected in a key idea | structure |
| Example 3 (i) writes ${\left(\frac{20}{29}\right)^2 + \left(\frac{21}{29}\right)^2}$ for ${\cos^2\theta + \sin^2\theta}$ | $\cos^2\theta$ term first | M1: the terms were in the other order from the expression |
| Example 12's working goes from ${\tan^2\theta - \sec^2\theta}$ to $-1$ unstated | "(since ${\tan^2\theta - \sec^2\theta = -1}$)" | M2 |
| Exercise 8.2 Q2 and 8.3 Q3 options (A)–(D) | (a)–(d) | the book's option style |
| "intially", "not differ" | corrected | typing |
| summary point 1 as fractions of words | in words | layout: text fractions at summary size could not be read |
| long working in Examples 2, 3, 5, 9–12, the $45^\circ$ and $30^\circ$ derivations and the identity derivations | split into consecutive working blocks at row boundaries | fitting: a block of working may run over a page; the rows read the same |
| the history paragraph | one sentence shorter | fitting |
| Fig. 8.7 after the working it illustrates; Fig. 8.20 before Example 7 | moved | fitting: each was holding a page open under a block it could not seat beside |
| Set 8.1 Q11, Set 8.2 Q1 and Q4, Set 8.3 Q4 | parts split into continued blocks (`li.cont`, `c-parts[data-start]`) | fitting; the numbering is unchanged |
| summary points 1, 4 and 5 | shorter: point 1 as ratios of the sides, point 4 pointing to Table 8.1, point 5 as "never more than 1" and "never less than 1" | fitting: the chapter was closing on a page holding only the summary |
| line-sized additions in the chapter: in 8.1 (one length easy to measure, another not; finding a side from one side and one angle; Chapter 9 uses these ideas); in Example 2 (use two right triangles; the plan of the proof; Theorem 6.4 is the SSS criterion; a sine fixes an acute angle); in Example 7 and Example 10 (which ratio to use, where to start); in 8.4 (an identity against an equation that holds for one value); in Set 8.1 Q8 (find tan A, sin A and cos A first) | added | fitting: each says what the page already shows or what the working does next |
| line-sized additions in Beyond the Book: a numerical example and the least value after the $\tan A + \cot A$ question; a check with ${p = 2}$; a sentence in Problem 1 and in Problem 5; Set C Q2, Q3 and Q4 restated at more length | added | fitting |
| the opening sentence of 8.3 | one line shorter | fitting |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| 8.1, the epigraph | C3 | J.&nbsp;F. Herbart died in 1841, so "Herbart (1890)" cannot be when he wrote it; it is likely the date of a translation | a correct citation, or no date |
| 8.2, From history | — | *sinus* is given as meaning "curve"; the Latin word means a fold or a bay | check the gloss |
| Set 8.2 Q4 (ii) | C4 | "sin θ increases as θ increases" is true only over the chapter's range, $0^\circ$ to $90^\circ$ | the key should give the range |
| Set 8.1 Q9 | — | ${\tan A = \frac{1}{\sqrt{3}}}$ invites ${A = 30^\circ}$, which is not met until 8.3; the question is answerable from the sides | none |


## 21 September 2026 — figure/table reference review

Reviewed this chapter in the all-maths reference audit. Figures and tables now use one chapter sequence, including Beyond the Book; captions and references were updated together. 1 dependent text/visual group(s) were kept together and the body refitted. Questions, calculations and artwork were preserved. The chapter and its volume were rebuilt; detailed layout checks and any remaining warnings are recorded in build/_all-maths-reference-checks/.
