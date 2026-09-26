# Class 6 · Mathematics I · Chapter 8 — Playing with Constructions

## The maths-v2 conversion, 26 September 2026

**This supersedes every description of Beyond the Book, its examples,
practice and answers further down this log.** Converted by CONVERT-V2.md,
with Class 6 Chapter 1 as the model. `chapter.json` now declares `maths-v2`,
palette `prism`, edition `196x276-large`, `keepExerciseSets: true` and
accent `#1e4e8c`. **40 pages**:

* **Body p001–p022**, NCERT's sections, construction steps and exercise
  questions in NCERT's order, ending on a **Summary** page (p022,
  `data-close`, nine points following NCERT's four, in our words).
* **By the Book p090–p095**, six pages (the fifty questions would not go
  into five without cutting the long answers), written to BY-THE-BOOK.md at
  Class 6: very short 10, short 10, long 10, assertion and reason 5,
  case-based 5, objective 10. Constructions are asked as steps of
  construction with a justification and a measurement.
* **Beyond the Book p101–p112**: tried and explained (no stage head), then
  Single correct · More than one correct · Numerical answer · Matching ·
  Paragraph-based, each two solved examples and its practice (4 · 4 · 3 · 2
  · 2). Answers on a fresh page (p110–p112): By the Book key, then Beyond.

### The body

* **Every section now has a key idea and a Think and Reflect.** New key
  ideas: *Constructing a rectangle* (8.3), *Recording in a table*, *A rough
  diagram* and *Carrying a length* (8.4), *A rectangle from a side and a
  diagonal* (8.5), *Two circles that cross* (8.6, taking the sentence that
  said it out of the paragraph). New Think and Reflects: the designs of
  Fig. 8.1 (8.1), turned squares and rectangles (8.2), a side of 7 cm with a
  diagonal of 5 cm (8.5), and points equidistant from $B$ and $C$ (8.6).
  8.3's questions after the construction (*Why must $PS$ be 6 cm? Measure
  $RS$, $\angle R$, $\angle S$*) were running text and are now its Think and
  Reflect, word for word. The three-squares Think and Reflect in 8.4 gained
  an item (*how many times its width is its length*). Every new answer is
  in ANSWERS.md.
* **Exercise figures moved into their questions** (Figs 8.13, 8.22–8.25),
  so each set is one tinted field. Q4–Q6 of Exercise 8.4 share Fig. 8.25,
  which sits in Q4 with the three held together.
* **Fig. 8.16 redrawn smaller** (four 7 by 4 rectangles at 12 units to the
  centimetre, same positions of $X$ and $Y$), so that it seats under the 8.4
  opening. Fig. 8.21 set a step larger (md). Tables 8.17 and 8.18 take
  `table--raw`.
* **Plain-English and fitting edits, wording only:** a sentence each added
  in the house construction (*Short arcs are quicker to draw…*, *These two
  lines are the sides of the roof*, *Check it: measure every line round its
  border*, *Measure its distance from each of them…*) and Exercise 8.6 Q2
  (*Where must the needle go for each curve?*); Fig. 8.21, Fig. 8.26 and
  Step 4 Method 1 reworded at their ends so no line ends on a lone word.
  Every paragraph's last two words are bound with a no-break space.
* No NCERT section, construction step, exercise question or hint was cut.

### By the Book

New, to BY-THE-BOOK.md. Settings: Onam rangoli, a kabaddi court, a Jaipur
window grill, a village hut, a Republic Day flag. Long answers are single
constructions set out as steps, justified and measured (a rectangle from its
sides, the house, a rectangle from a diagonal's angle, a garden plan, a
divided rectangle, two equidistant points, a rectangle from a side and a
diagonal, two arcs in a square, falling squares, two circles through each
other's centres). Measured answers use 3-4-5, 6-8-10, 5-12-13 and 9-12-15
so they come out whole. Assertion–reason a, d, c, b, a; objective answers
a 3 · b 2 · c 2 · d 3, one multi-statement item (Q49) and one named
student's claim (Q50). About one in five works backwards (Q8, Q9, Q16, Q40,
LA 29).

### Beyond the Book

* **Tried and explained, kept word for word, with two changes.** The
  sentence *A rectangle 10 cm long and 4 cm wide cannot be divided like
  this, because $10 \div 4$ is not a whole number* was cut: it answers the
  8.4 Think and Reflect (*give the side lengths of a rectangle that cannot
  be divided into … identical squares*). The opening paragraph (not a
  question) was shortened by a line so the page fills.
* **Examples kept from the 20 September fifteen:** the 4 + 3 = 7 circles and
  the square's fourth corner (single correct); every rectangle's properties
  and the circle of radius 6 (more than one correct), both recast — the
  first had *the diagonals have equal length*, which answers the 8.5
  question *are the two diagonals the same length?*, and the second used
  *diameter*, a word the chapter does not teach; the touching circles and
  the perimeter (numerical); the lengths match (recast in the chapter's own
  words, with Fig. 8.38, new) and the circle-separation match. **Dropped:**
  the 4.5 cm diameter and the 8.5 cm compass opening (decimals, not taught
  in Class 6), the rectangle's half-diagonal (*diagonals bisect each other*
  is not taught and answers the same 8.5 question), the perpendicular
  bisector (not taught), and *sufficient to determine* (Class 7 wording).
  **Written new:** two paragraph-based examples (a house front, Leela's
  card), each with an options part and two numerical parts.
* Check rows were added to Examples 2–6 and 9; they teach, and they close
  the short pages.
* Fifteen new practice questions in competitive formats.

### Checks at close

* build: **all pages fit**, 40 pages, no `!` and no `~`. Every page 88% or
  more except the Summary (p022, 76%, `data-close`), By the Book's last
  page (p095, 44%, `data-close`) and the chapter's last page (p112, 57%).
* `lone-words` 0 · `check-sums` 36 identities, 0 wrong · `orphans` 0 ·
  `check-labels` no collision · `fit-options` every option row fits.
* `check-numbers.mjs` **rewritten** for the new layout (the old one
  measured figure numbers from before the reference revision and already
  failed): 59 identities and 273 checks, 0 failed. It recomputes every
  single-correct option, every assertion–reason code, every multi-correct,
  numerical and matching key, every measured length and angle in the key
  from coordinates, and reads Figs 8.7, 8.13, 8.16, 8.19, 8.22, 8.23 and
  8.38 from their drawings.

## Solved examples in examination formats, 20 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 17 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-6/math-ch08-constructions/`.

Source `build/jee-class6.mjs`; check `build/check-jee-class6.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p112; the answers stage still opens a fresh page.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (c) 9 cm |
| 2 | Single correct | (a) 9 cm, 6 cm |
| 3 | Single correct | (b) 1 |
| 4 | Single correct | (c) 2 |
| 5 | Single correct | (d) 7 cm |
| 6 | Single correct | (b) AD is perpendicular to AB and AD = 6 cm |
| 7 | Multiple correct | (a), (c), (d) |
| 8 | Multiple correct | (a), (c), (d) |
| 9 | Multiple correct | (a), (c) |
| 10 | Multiple correct | (a), (d) |
| 11 | Numerical answer | 8.5 |
| 12 | Numerical answer | 15 |
| 13 | Numerical answer | 1 |
| 14 | Matching | (a) P–3, Q–4, R–2, S–1 |
| 15 | Matching | (c) P–3, Q–1, R–2, S–4 |


## Syllabus audit fixes, 17 September 2026

The Beyond the Book audit made four findings here. I confirmed the first three against the pages and fixed them. The fourth (a gap row) named three topics: two now have examples, and the third is left, for the reason given below. The chapter body was not touched.

| finding | what I did |
|---|---|
| **The arc-crossing test** (borderline, and it recurs). Stage 1 Q2 and Q5, the roof examples, and Practice Q14, Q26, Q29(b) and Q31(b) all rely on "two arcs cross only if the radii add to more than the gap". The body only says that circles which cross do so at two points. | The fact is now **stated once, where Beyond first needs it**: in the explanation of Stage 1 Q2, in bold. It is derived from what the chapter shows about circles, in two parts: <br>• **when they cross:** along $PQ$ each circle reaches 4 cm towards the other centre, and 4 + 4 = 8 is more than the 6 cm gap, so the circles overlap. Circles that cross do so at two points (§8.6). <br>• **when they don't:** at 10 cm, a point on both circles would give a way from $P$ to $Q$ of 8 cm, and no way is shorter than the straight 10 cm. <br>At 8 cm the reaches just meet, so the circles touch at one point. <br>Stage 1 Q5 now cites that case (*as with P and Q at 8 cm apart*). The later items rely on the stated fact. Their notes cite it (note 14: *As Stage 1 showed…*; Example 16: *as in Stage 1*). The Stage 1 intro, Q1, Q3 and Q4 are unchanged, word for word. |
| **Example 14 → now 16** (borderline): a triangle from three sides (6, 5, 4) is a Class 7 construction | Recast to **two equal lines, as in the house**: $PQ = 4$ cm, and $R$ is 6 cm from both. Step 2 cites *6 + 6 is more than 4*. The example then asks the construct-and-see question: *could R be 2 cm from both?* Since 2 + 2 = 4, the arcs only touch, on $PQ$. **Practice Q23 had the same flaw** (4 cm from $A$, 3 cm from $B$), although the audit did not list it. It now asks for points 3 cm from both $A$ and $B$, 4 cm apart. The answer changed from 4 cm 8 mm to 4 cm 5 mm. |
| **"A diagonal is longer than a side"** (borderline), used in Example 13 (now 15), Practice Q15 and Q28(b) | Example 15 now shows the fact by drawing instead of assuming it. Its steps: <br>• Draw the 7 cm circle about $D$. It passes through $C$ and only touches $l$ there. <br>• So every other point of $l$ is outside that circle, more than 7 cm from $D$ (Example 1's inside and outside). <br>• A 5 cm arc stays inside it. <br>Q28(b) now says *Look at your drawing*, and its answer is what the drawing shows. Note 15 cites Example 15. |
| gap: arcs used for artwork (§8.1) | **New Example 3** under Type 1 (**Fig. 8.35**). A moon is drawn from two 3 cm circles with centres 2 cm apart. Along the line of centres, the first circle ends 3 cm from $O$ and the second ends 1 cm past $O$, so the moon is 2 cm wide. Nothing like it is in Fig. 8.1, and it answers no body question. |
| gap: turned squares on a dot grid (§8.2) | **New Example 6** under Type 2 (**Fig. 8.36**). $B$ is 3 dots right of $A$ and 1 up. The square is constructed with §8.3's instruments (perpendiculars and a carried length), and the example observes that $C$ and $D$ land on dots. The step differs from Exercise 8.2 Q5's (2 right, 1 down). The dot-counting rule that Exercise 8.2 Q3 asks the reader to find is not stated. |
| gap: the XY exploration inside a rectangle (§8.4) | **Not added.** §8.4 is an open exploration, and its findings are the answers to its own Think and Reflect questions: $XY = AB$ when the distances match, $ABYX$ is a rectangle, and the greatest $XY$ is a diagonal. Any worked example on it prints those answers, which §6a forbids. Left for the coordinator. |

**Renumbering.** Old Examples 1–2 keep their numbers. Old Examples 3–4 are now 4–5, and old Examples 5–15 are now 7–17. `ANSWERS.md` (the Stage 1 item 2, all seventeen Stage 2 items, *seventeen examples*, Q23, Q28) and `check-numbers.mjs` were updated to match. The only text that cites an example number is note 15, which cites the new Example 15.

**Fitting.** The first refit gave 14 pages, with Stage 1 running over and Answers split across two pages. These trims brought it to 13:
- The Stage 1 derivation was cut to its shortest form, so Q3's explanation fits on p101 again.
- Notes 14 and 15 and the Q23 row were shortened, so Answers fits on one page (99%).
- Fig. 8.36 was cropped to the dots it uses and drawn on a wider viewBox. Its dots are dark points, because the grid class printed too faint to read where C and D land.
- Example 6's closing remark became Step 3.

Short pages left, each held by a whole example panel:
- p104: 64%.
- p108: 61%.
- p109: 67%, the page before Practice, which `keepExerciseSets` starts on a fresh page.

p112 runs 1.3 mm into the margin (within 3 mm).

**Pages: 29 before (18 body + 11 Beyond), 31 after (18 + 13).** Solved
Examples: 17 in Beyond (was 15).

**Checks.**
- `check-numbers.mjs` passes 255 checks. New checks cover:
  - **the arc test**: checked against the circle geometry for every case the section uses, printed once in bold, and derived as printed; the roof citation; its line in `ANSWERS.md`.
  - **Fig. 8.35**: two equal circles, centres 2 cm apart, the moon's ends at the crossing points, and the printed widths.
  - **Fig. 8.36**: every corner on a dot, the dot steps of all four sides, equal sides and right angles, and each label beside its own corner.
  - **Example 15**: the tangent circle, the nearest point, and that the 5 cm arc misses.
  - **Example 16**: arcs of 6 cross twice, arcs of 2 touch at the middle, and the old three-sides wording is gone.
  - **Q23**: re-derived.
- 17 deliberate breaks in a scratch copy were all caught.
- `build.mjs --png`: all pages fit.
- `orphans`: 0.
- `fit-options`: clean.
- `check-labels`: clean.
- `check-colour`: run on p021 and p023.
- `check-no-repeats`: one existing pair only (Example 13's 50° and 50° against Exercise 8.5 Q1's 50° and 40°).

## Brought to the Class 7 standard, 16 September 2026

Phase 1 of `PLAN-MATHS-CONSISTENCY.md`, done by hand rather than by an agent,
because this chapter is unlike the other nine: it has no worked examples at
all, and its answers are drawings. Read whole before any change; every check
below was run on the chapter.

**Pages: 26 before (18 body + 8 Beyond), 29 after (18 body + 11 Beyond).**
The body is untouched, so its eighteen pages are exactly as they were.

### What changed

**A palette of its own.** `chapter.json` gains `"palette": "violet"`, whose
`--teal` is byte-identical to the accent chapter 8 already had.

**The body: nothing.** It holds no `.c-example` panels. Its constructions are
set as NCERT sets them — *Step 1*, *Step 2* in running text, with figures —
and that is the chapter's own structure, not a worked example to convert.
`check-example-stepping` compares 0 examples.

**Beyond the Book rebuilt to the four current stages.**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, explained in running text | **kept word for word**; only `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems in prose | **15 stepped examples** under six `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets | **one run of 31**, all six forms, band carrying the numeral; assertion–reason in the Class 7 form |
| 4 Answers & Takeaways → **Answers** | key and notes, run on under the last set | key, every answer, four notes; **opens its own page** |

The examples are Examples 1–15, since the body has none. Following Class 7's
Constructions chapter, they carry no figures of their own: each construction
is a sequence of step rows, and its *Answer* is what the finished drawing
measures. The six types cover the chapter: the circle and the compass; what
makes a rectangle; constructing from the sides; planning with a rough
diagram; rectangles from a diagonal; a point from two distances.

**Three old items gave the body's answers away**, and are gone:

- *Problem 3* set Exercise 8.5 Q2 (a $45^\circ$ split gives a square) and
  solved it;
- *Problem 5* was a row of Table 8.2, with its length and its shape;
- the note on *C5* said outright that its figure "answers Exercise Set 8.6,
  Question 3".

Two old practice questions went for the same reason: *6 cm by 4 cm into two
squares* is a worked instance of a Think and Reflect that asks for exactly
such a rectangle, and *the diagonals of a 7 cm by 4 cm rectangle are equal*
is the answer to the body's own *are the two diagonals the same length?*

**No decimals.** The old Problem 5 used 1.5 cm; the chapter itself writes
*1 cm 5 mm* (Table 8.2), because Class 6 has not met decimals. Every new
measurement is in whole centimetres, or centimetres and millimetres.

`check-no-repeats` lists one pair above 50%: Example 11 (*can a diagonal
split the angles into $50^\circ$ and $50^\circ$?*) against Exercise 8.5 Q1
(*construct one that splits them into $50^\circ$ and $40^\circ$*). A different
question, and it answers nothing the exercise asks. Every Beyond item was
also read against every body question for give-aways.

**`ANSWERS.md` written** for every question the chapter sets — six exercise
sets, every Think and Reflect, the questions in the running text, both
tables, and Beyond. Each drawing answer says what the drawing must show;
each *answers will vary* has a worked instance; measured lengths are given
to the millimetre, with a millimetre either way to be accepted.

### Verified

`check-numbers.mjs` passes **221 checks**. It works in coordinates: it builds
each construction, measures the result and rounds to the millimetre a
student reads.

- **The figures are read from their own drawings**: Fig. 8.7 ($AX = 4$ cm,
  radius 2 cm), Fig. 8.13 (only $A$ is a square — $B$ and $C$ have equal sides
  and no right angles, $D$ has right angles and unequal sides), Fig. 8.17,
  Fig. 8.20 (a 4 cm square, 2 cm from each end), Fig. 8.21 (each square meets
  the next at a corner; the figures fit 12 cm and 15 cm squares), Fig. 8.23
  (radius 6 cm, needles about 4 cm 5 mm outside), Fig. 8.24 ($a = d = e = h$,
  $b = c = f = g$, about $27^\circ$ and $63^\circ$) and Fig. 8.34 (the
  rhombus of Exercise 8.6 Q3 has four 5 cm sides and is not a square).
- **Tables 8.1 and 8.2** are computed: 7 cm 4 mm, 7 cm, 7 cm 3 mm; every
  row of 8.2 is 7 cm; the farthest $XY$ is 8 cm 1 mm; the shortest is 7 cm,
  found by searching every position.
- **Every Beyond answer is read back off the page** and compared, a lettered
  part at a time; each multiple-choice question has exactly one right option
  matching the key; each assertion and reason is checked against the text
  printed under its number.
- **Break tests**, each restored afterwards: key 7 (a → b), Q29's
  6 cm → 7 cm, Example 12's 8 cm → 9 cm, an `ANSWERS.md` table value,
  Fig. 8.20's divider moved 4 units, and Q15's assertion reworded. All six
  failed the script.

No wrong number was found in the body. The script had four faults of its own
on the way, all found by running it: a join written with a literal line break,
option lists read from the body's exercises (which share the markup), and two
readers that lost the last option.

**Fitting.** Nothing clipped; page 28 runs 1.3 mm into the margin.
`orphans`: 0 stranded openers in 29 pages. `fit-options`: every row fits.
`check-labels`: no collisions. **Colour:** the palette's action colour and
violet stay apart in greyscale and under deuteranopia; every panel carries
its label.

Two practice questions were tightened so that question 31 could share page
28 rather than stand alone on a page before Answers: Q31 names the wall tops
$B$ and $C$, and Q29 asks *how many, and how far apart* as one part. Two
answer rows were shortened to keep the Answers page inside the margin.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 24 | 81% | the Type 6 head and Example 14, which will not fit under Example 13 |
| 25 | 64% | the Practice band: `keepExerciseSets` starts the whole run on a fresh page |

### Flagged

| what | why |
|---|---|
| **The body states few of its rules as key ideas.** *The diagonals of a rectangle are equal* and *a diagonal splits the angles of a rectangle equally only in a square* are found by the reader and never stated. | An authoring pass for the class, not conversion. |
| **Exercise 8.2 Q1 and Q4, and Exercise 8.4 Q2–Q3, ask for drawings with no fixed answer.** `ANSWERS.md` says what each must show. | For the answers booklet's designer: these want small reference drawings. |
| **Exercise 8.3 Q3's answer is a reasoned *no*.** It is the right answer, but the reasoning is the kind a Class 6 reader will give only after trying. | Accept any answer that tries and finds the opposite sides always come out equal. |

### Not changed

The body: every page, every figure, every step of every construction.


## 20 September 2026 — reference numbering and reading order

- Figures and tables now share one chapter sequence; caption labels and prose references were migrated together, including cross-chapter references within Class 6.
- Dependent text and diagrams are kept together with c-figure-context where the revised layout needs it. The final bound-book audit distinguishes facing pages from page turns.
- Source content was checked against build/_class6-reference-before. All questions, worked mathematics and illustrations were preserved. The Data Handling closing paragraph alone was shortened to avoid an isolated final page.
- Validation and mapping: build/_class6-reference-checks; reproducible source check: build/check-class6-reference-revision.mjs.
