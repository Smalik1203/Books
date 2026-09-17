# Class 10 · Mathematics I · Chapter 2 — Polynomials

## Brought to the Class 7 standard, 17 September 2026

Phase 4 of `PLAN-MATHS-CONSISTENCY.md`, worked to the brief built from
Chapter 1. The page move, the examples, Beyond the Book and the answers were
done in one pass, and every check was run on the whole chapter.

**Pages: 19 before (12 body + 7 Beyond, Crown Quarto), 24 after (11 body +
13 Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`, and the body was
refitted once. The refit left page 10 at 41%, because Example 5 missed it by
a few millimetres. Example 5's first row was shortened: its reason became
*comparing coefficients*, and its two long chains are split across rows. The
example was then moved back by hand. The exercise set, the summary and the
tip then fitted on page 11, so the old last body page (p012) was deleted.
`data-close` is now on p011.

**All five body examples are set as steps** (the Class 10 decision). Each
example's working moves into its panel as *Solution*, Steps and *Answer*.
- **Example 1:** Fig. 2.8 now stands just before the panel, which reads it.
  NCERT's "(iii) 3. Why?" questions are kept, as one row.
- **Examples 2–5:** the working that ran after each panel, and in Example 2's
  case onto the next page, is now inside the panel.
- **Example 4:** the remark about $k(x^2 + 3x + 2)$ stays after the panel.

`check-body-maths` reports **195 expressions and 74 numbers, none lost or
added**. The only gains are numbers restated in Answer rows. The figure
and the Example 1 panel sit on facing pages (6 and 7).

**Beyond the Book rebuilt to the four stages:**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, each explained in running text | kept word for word, except one give-away (below); `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems | **13 stepped examples** under eight `Type` heads. The 5 old problems are Examples 2, 5, 7, 9 and 11, with their options kept |
| 3 Problem Sets → **Practice** | 3 sets, 20 questions | **one run of 32** in six forms |
| 4 Answers & Takeaways → **Answers** | key and why the options are wrong | key, every other answer, why the options are wrong for 11, the closing paragraph |

**Worked examples in the chapter: 18** (5 body + 13 Beyond). Each topic has a
type:
1. degree, values and zeroes;
2. zeroes and graphs;
3. finding zeroes and checking the relationship;
4. a quadratic from its zeroes;
5. expressions in the zeroes;
6. an unknown coefficient;
7. cubic polynomials;
8. a proof (equal and opposite zeroes give $b = 0$).

**Two new figures, numbered after the body's last.** Both are drawn from
their equations by a script in the session scratchpad, in Fig. 2.2's style.
- **Fig. 2.10** ($y = x^2 - x - 6$, for Beyond Example 3) is inside that
  example's panel.
- **Fig. 2.11** ($y = x^3 - 7x + 6$, for Practice Q24) is set as a block
  straight after its question.
- The question does not print the equation of either graph. The reader
  reads the zeroes off the marked crossing points.
- Neither figure prints a tick number under a crossing point, as in
  Fig. 2.2. Fig. 2.11 also leaves out the $y$ ticks 6 and 8, where the
  curve runs through them.

**The practice run.** 16 multiple-choice questions, reused from the old
sets. Two old Set A items were dropped: the most zeroes a cubic can have
(Q16 asks the same of a quadratic), and "a zero of $x^2 - 9$". Old Set B Q3 is now
$x^2 + 7x + 12$, because Example 9's remark prints the zeroes of
$x^2 + 5x + 6$. Then come 4 assertion–reason questions (new, in the Class 7
form), 3 very short, 4 short, 3 long and 2 case-based (a thrown stone, and a
table of values). The key is a 4, b 5, c 6, d 5, counting the
assertion–reason letters.

### Give-aways found and fixed

- **Stage 1 Q4** asked for the quadratic with zeroes $2 \pm \sqrt{3}$ and
  printed sum 4, product 1 and $x^2 - 4x + 1$. That is the answer to
  **Exercise Set 2.2 Q2(vi)** (sum 4, product 1). Its numbers are changed to
  $1 \pm \sqrt{5}$, giving $x^2 - 2x - 4$. The explanation is otherwise word
  for word.
- Every other value Beyond prints was read against Exercise Sets 2.1 and 2.2.
  No other polynomial, zero, sum or product there is a body answer.
- `check-no-repeats` reports 7 pairs at 50–63%. Each is the same kind of
  question with different numbers, such as "find the zeroes of
  $5x^2 - 13x - 6$ and check the relationship" against the body's Examples 2
  and 3. None was changed.

### Verified

`check-numbers.mjs` passes **696 claims**. It checks:
- 102 arithmetic chains;
- 41 polynomial identities, each compared at random values;
- 34 values $p(k)$, each checked against the $p(x)$ last defined before it;
- 23 equations, each against the "letter = value" that follows it.

**The figures are read from their SVG coordinates:**
- Every grid graph (Figs. 2.1, 2.2, 2.6, 2.7, 2.10, 2.11) lies on its
  equation within 1.2 px.
- Every labelled point is marked where its label says, and lies on the
  curve.
- The points where each curve meets the $x$-axis are the zeroes of its
  polynomial.
- Each sketch is counted. Figs. 2.3–2.5 are counted against their captions,
  Fig. 2.8 against Example 1's answer row, and Fig. 2.9 against the
  Exercise Set 2.1 answers in `ANSWERS.md`.
- The zeroes that Beyond Example 3 and Practice Q24 read off their graphs are
  the crossings of the drawn curve.

It also checks:
- both tables of values;
- every stated set of zeroes;
- the coefficients named in steps;
- Stage 1 and every Solved Example;
- every multiple-choice question: exactly one right option, and it matches
  the key (5 examples and 16 practice questions);
- every assertion–reason letter, derived;
- the practice answers, read back from the key rows and from `ANSWERS.md`
  one lettered part at a time;
- the Exercise Set 2.2 answers against the page's own questions;
- that `ANSWERS.md`'s key matches the page.

**Break tests: 19 of 19 caught.** They covered:
- in the body: an example answer, a table value, an equation's solution and
  a coefficient;
- in Beyond: an example answer, the Stage 1 polynomial, a Fig. 2.10 label,
  and a point moved off Fig. 2.11's curve;
- the key: a key letter, key rows and a lettered part;
- an option, and a question's own number;
- in `ANSWERS.md`: a zero, the key, a sketch count, a polynomial and a set of
  zeroes.

**Faults in the check itself, fixed while writing it:**
- a bare number before a full stop was not read;
- a coordinate pair was read as one value;
- a question's first polynomial was taken to be $\alpha$;
- the touching-point test used the cubic coefficient slots for a quadratic;
- a graph's touching point came out 0.05 off, so crossings are now compared
  with a tolerance of 0.08.

**Fitting:** nothing is clipped. Page 21 runs 1.1 mm into the bottom margin.
The other tools report:
- `orphans`: 0 stranded openers;
- `check-labels`: no collisions;
- `fit-options`: every option row fits.

Other checks:
- `check-body-maths` reports no mathematics lost or added.
- **Colour:** pages 2, 7, 14 and 21 were read in greyscale and deuteranopia.
  The curves are one ink, and the points are marked with dots and
  coordinate labels.
- **Proofs read:** pages 7, 9, 11 and 13–24.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 4 | 86% | Fig. 2.3–2.5 block, a figure |
| 6 | 83% | Example 1 (a panel); Fig. 2.8 faces it on page 6 |
| 11 | 76% | the last body page (`data-close`) |
| 14 | 65% | Beyond Example 3 with Fig. 2.10 inside it; Type 3 and Example 4 do not fit below it |
| 15, 16 | 75% | Solved Examples: the next example panel does not fit |
| 21 | 82% | the case-based question 31, too tall for the gap |
| 22 | 55% | **the Answers stage, which always opens a page** (two case questions stand before it) |
| 24 | 34% | the last page |

### Judgement calls

- **Example 1 (body):** the figure was moved from after the panel to before
  it. The steps keep NCERT's "Why?" questions word for word, and the Answer
  row also restates the counts.
- **Beyond Example 11's remark** was cut to one line, and Example 13's
  closing remark was dropped, so that Type 8 fitted on page 18.
- **Old Set A Q6 and Q9 were dropped** to hold the multiple-choice run at 16.

### Flagged, not done

- Nothing in this chapter prints a fact or history needing a source.


Written new from NCERT *Mathematics, Textbook for Class X* (reprint 2026-27),
Chapter 2, *Polynomials* (textbook pages 10–23). Original LearnLab text in
NCERT's order of topics, examples and questions; no sentence is carried over.
Crown Quarto, house design, palette `violet`. The source PDF has no answer
key; every answer below was worked here.

Sections: 2.1 Introduction · 2.2 Geometrical Meaning of the Zeroes of a
Polynomial · 2.3 Relationship between Zeroes and Coefficients of a
Polynomial. *Exercise 2.1* and *2.2* are Exercise Sets 2.1 and 2.2. The
definitions and results are `c-keyidea` blocks (value of a polynomial, zeroes
on the graph, at most n zeroes, zeroes and coefficients of a quadratic and of
a cubic). The source's *2.4 Summary* is the chapter summary.

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted: `check-body-maths` reports no mathematics lost or added, `check-numbers.mjs` passes, 0 stranded openers, every option row fits, no label collisions.

## Every figure is drawn new

All figures come from `fig2.mjs` in the session scratchpad. The graphs are
plotted from their equations, not traced; the sketches are drawn to have the
same number of zeroes, in the same places relative to O, as the source's.

| figure | note |
|---|---|
| Fig. 2.1 | $y = 2x + 3$ on a grid, through (−2, −1), (0, 3), (2, 7), crossing at (−3/2, 0) |
| Fig. 2.2 | $y = x^2 - 3x - 4$ on a grid, the points of Table 2.1 marked; the source labels every point, here only the two zeroes are labelled |
| Figs. 2.3–2.5 | the three cases, two sketches each, with A and A′ |
| Fig. 2.6 | $y = x^3 - 4x$ on a grid, cut at $y = \pm 4$ (the source runs to ±4 as well) |
| Fig. 2.7 | **the source's Figs. 2.7 and 2.8 as one figure**, (a) $y = x^3$ and (b) $y = x^3 - x^2$; so the source's Figs. 2.9 and 2.10 are Figs. 2.8 and 2.9 |
| Figs. 2.8, 2.9 | the six graphs of Example 1 and of Exercise 2.1, drawn as sketches with the source's counts of zeroes |
| left out | the source's two small parabola marks in running text (the shapes are named instead) |

## Every answer worked

| where | answers |
|---|---|
| 2.1 | $p(2) = -6$, $p(0) = -4$, $p(-1) = p(4) = 0$; zero of $2x + 3$ is $-\frac{3}{2}$ |
| Table 2.1 | 6, 0, −4, −6, −6, −4, 0, 6 for $x = -2$ to 5; Table 2.2: 0, 3, 0, −3, 0 |
| Example 1 | (i) 1 (ii) 2 (iii) 3 (iv) 1 (v) 1 (vi) 4 |
| Set 2.1 | (i) 0 (ii) 1 (iii) 3 (iv) 2 (v) 4 (vi) 3 — the sketches in Fig. 2.9 were drawn to these counts |
| 2.3 | $2x^2 - 8x + 6$: zeroes 1, 3; $3x^2 + 5x - 2$: $\frac{1}{3}$, −2 |
| Examples 2–5 | −2, −5 · $\pm\sqrt{3}$ · $x^2 + 3x + 2$ · $2x^3 - 5x^2 - 14x + 8$: 4, −2, $\frac{1}{2}$, with sum $\frac{5}{2}$, pairwise −7, product −4 · $3x^3 - 5x^2 - 11x - 3$: sum $\frac{5}{3}$, pairwise $-\frac{11}{3}$, product 1, and $p(-\frac{1}{3}) = 0$ checked |
| Set 2.2 Q1 | (i) 4, −2 (ii) $\frac{1}{2}$, $\frac{1}{2}$ (iii) $\frac{3}{2}$, $-\frac{1}{3}$ (iv) 0, −2 (v) $\pm\sqrt{15}$ (vi) $\frac{4}{3}$, −1 |
| Set 2.2 Q2 | (i) $4x^2 - x - 4$ (ii) $3x^2 - 3\sqrt{2}x + 1$ (iii) $x^2 + \sqrt{5}$ (iv) $x^2 - x + 1$ (v) $4x^2 + x + 1$ (vi) $x^2 - 4x + 1$ |

Beyond the Book: Stage 1 — 13; other zero −4 and $k = 1$; Riya is not right;
$x^2 - 4x + 1$; $x^2 + 6x + 8$. Stage 2 — (c), (a), (b), (c), (b). Set A
b c d b c a d a b; Set B a b d c a c; Set C b c b d a.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| 2.1 "We will also study the division algorithm for polynomials" | not said | the division algorithm is not in this edition of the chapter |
| footnote: plotting graphs of quadratic or cubic polynomials "is not meant to be done by the students, nor is to be evaluated" | one sentence in brackets: the reader is not asked to draw them and only reads them | the book has no footnotes and names no evaluation |
| Example 5 marked "*Not from the examination point of view" | printed without the mark | the book names no examination |
| Figs. 2.7 and 2.8 | one figure, 2.7 (a) and (b) | they are read together in one paragraph; later figures renumbered |
| Example 1 answers "(Why?)" | kept as questions to the reader, set as a line of working | the source leaves them for the reader |
| Example 4: "where k is real" | "where k is a real number other than 0" | with $k = 0$ there is no quadratic polynomial |
| $\alpha$, $\beta$, $\gamma$ explained in a footnote | explained in brackets at first use | no footnotes |
| a sentence on how to find the value of a polynomial (2.1); a paragraph on why the zero of $2x + 3$ is where its line meets the $x$-axis (2.2); the tip on $x^2 - Sx + P$ | added | the first two close short pages; the third states Example 4's method once |
| the untitled table of two points on $y = 2x + 3$ | no caption | the source gives it no number, and a caption set to a two-column table's width wrapped |
| Stage 2, Problem 3, option (d) | $\frac{15}{2}$ | every option now has a reason in the solution |
| Exercise 2.2 Q1 stem | shortened | fitting |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| 2.1, first paragraph | C4 | the text layer of the source prints the degree-3 example as "5x³ − 4x² + x − 2"; the rendered page could not be read at this scale, and it is set here as $5x^3 - 4x^2 + x - \sqrt{2}$, as in earlier printings | confirm the last term |
| 2.2, Cases (i)–(iii) | C6 | "a polynomial of degree 2 has at most two zeroes" and the degree-n remark are read off pictures, not shown | none at this class; the source does the same |
| cubic relations | C6 | "it can be proved that" — the three relations for a cubic are stated without proof | none; the source does the same |
| Figs. 2.8, 2.9 | C4 | the sketches are new drawings with the source's counts of zeroes, not copies of its curves | confirm the counts against the printed book: Example 1 1, 2, 3, 1, 1, 4; Set 2.1 0, 1, 3, 2, 4, 3 |
| Set A Q9 | — | added to Beyond the Book to fill a page; its answer is in the key | none |
