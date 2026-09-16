# Class 6 · Mathematics I · Chapter 8 — Playing with Constructions

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
