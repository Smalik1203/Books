# Class 10 · Mathematics I · Chapter 3 — Pair of Linear Equations in Two Variables

## Solved examples in examination formats, 24 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 14 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-10/ch03-linear-equations/`.

Source `build/jee-class10.mjs`; check `build/check-jee-class10.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p111; the answers stage still opens a fresh page.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) $(9, 5)$ |
| 2 | Single correct | (b) $-6$ |
| 3 | Single correct | (c) coincident |
| 4 | Single correct | (d) 31 |
| 5 | Single correct | (a) ₹20 |
| 6 | Single correct | (b) $(5, -2)$ |
| 7 | Multiple correct | (a), (d) |
| 8 | Multiple correct | (a), (b), (c) |
| 9 | Multiple correct | (a), (b), (d) |
| 10 | Multiple correct | (a), (b) |
| 11 | Numerical answer | 30 |
| 12 | Numerical answer | 20 |
| 13 | Numerical answer | 3 |
| 14 | Matching | (a) P–2, Q–4, R–1, S–3 |
| 15 | Matching | (d) P–2, Q–3, R–4, S–1 |


## Syllabus audit fixes, 17 September 2026

Two borderline findings, both confirmed. The body never teaches stream speed
or relative speed. **Pages: 24 before (11 body + 13 Beyond), 24 after
(11 + 13).** The body was not touched.

- **Example 11, the boat downstream and upstream** (speeds $u + v$ and
  $u - v$), from the old reducible-equations section. It is replaced by a
  price problem that is linear from the start: 4 notebooks and 3 pens cost
  ₹255, and 3 notebooks and 5 pens cost ₹260. It is solved by the body's
  elimination steps (multiply by 3 and by 4, subtract, substitute back), so a
  notebook is ₹45 and a pen ₹25. It does not repeat Example 12 (a ticket
  count), Q27 (a symmetric purchase) or any body exercise.
- **Practice Q30, cars from A and B** (same direction uses the difference of
  the speeds, towards each other the sum). It is replaced by a long-answer
  fraction problem, since Q29 is already a two-digit number: the denominator
  is 4 more than twice the numerator, and taking 2 and 3 away gives
  $\frac{1}{3}$, so the fraction is $\frac{7}{18}$. The student forms the
  pair, eliminates and checks. Its numbers differ from the body's fraction
  questions and from Example 10. The key row and `ANSWERS.md` were rewritten
  with the check.
- **Not flagged and left alone:** Example 9 adds and subtracts two equations.
  That is elimination as the body teaches it, not a separate method.
- `check-numbers.mjs`: Example 11 is solved from its text, and each step's
  totals (765, 1040, 275, 180) are re-derived. Q30 is solved from its three
  conditions, with its printed equations and check fraction. `ANSWERS.md` 30
  is compared with the key. Twelve deliberate breaks were all caught. It
  passes with 492 claims.
- `check-no-repeats`: no pair involves a changed item.
- `refit … bridge` once, then p109 ran 1.3 mm into the margin. Q11's second
  sentence was shortened (*Lata says $(4, 0)$ and $(0, -2)$ both solve it.*),
  which removed a line, and the page fits. Orphans 0, options fit, labels
  clear. p107 (59%) is held open by the Type 6 head and its panel, and p111
  (58%) is the short page before Answers.

## Brought to the Class 7 standard, 17 September 2026

Phase 4 of `PLAN-MATHS-CONSISTENCY.md`, worked from the brief built on
Chapter 1. The page move, the examples, Beyond the Book and the answers were
done in one pass, and every check was run on the chapter.

**Pages: 19 before (12 body + 7 Beyond, Crown Quarto), 24 after (11 body + 13
Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`. The body was
refitted once, then placed by hand where the refit left a panel short of its
gap (below).

**All ten body examples set as steps**, the Class 10 decision. Each example's
working moved out of the running text into its panel as *Solution*, Steps and
*Answer*; a remark that is not a step stays after the panel.
- **Examples 1 and 3** (graphical) carry their table and figure inside the
  panel, after the work rows, so Table 3.2 and Fig. 3.1, and Table 3.3 and
  Fig. 3.2, print with the working that uses them.
- **Examples 4 and 8** had labelled steps in a separate block after the panel.
  They are now the panel's own rows.
- **Examples 6 and 10** keep their chained display equations
  (*…, that is, …, that is, …*) whole in one row, since splitting them would
  change the expressions `check-body-maths` compares.
- Remarks kept after their panels: Example 2's *plot a few points*, Example
  4's *check these values*, Example 5's *check these ages*, Example 6's reason
  the statement gives no value, Example 8's check, Example 10's check.

**Verified** by `build/check-body-maths.mjs`: 201 expressions and 145 numbers,
none lost and none added. The only gains are 3 and 4, restated in rows.

**Hand-fitting in the body, logged:**
- Example 7's question read *Two rails are represented by the equations …
  Will the rails cross each other?* It now reads *Two rails lie along the
  lines … Will they cross each other?* This saves a line, so Exercise Set 3.2
  Q3 (v)–(vi) fit on page 8.
- Example 10's rows were tightened. The tens and units digits moved into a
  reason, and *if $x - y = 2$* went from Steps 5 and 6, since Step 4 states
  both cases. This made room for the example on page 10.
- The elimination key idea moved back to page 9, and Example 10 and Exercise
  Set 3.3 Q1 to page 10. The old last body page (the summary and the tip) was
  folded into page 11, which now carries `data-close`. `p012.html` is deleted.

**Beyond the Book rebuilt to the four stages:**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, each explained in running text | **kept word for word**; only `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems | **14 stepped examples** under six `Type` heads. The 5 old problems are Examples 3, 2, 5, 8 and 10, with options kept and *Answer* giving the letter. New: a graphical solution with its own Fig. 3.3, $a$ and $b$ for infinitely many solutions, two substitution examples, a swapped-coefficient elimination, a boat and stream, ticket sales, the angles of a triangle, and a case with a table |
| 3 Problem Sets → **Practice** | 3 sets, 19 questions | **one run of 32** in six forms |
| 4 Answers & Takeaways → **Answers** | key and why the options are wrong | key, every other answer, why the options are wrong for 10, the closing paragraph |

**Worked examples in the chapter: 24** (10 body + 14 Beyond). The six types:
- solving a pair graphically;
- reading a pair from its ratios;
- substitution;
- elimination;
- word problems;
- reading a pair from data.

**Fig. 3.3** is new, drawn in the house graph style for Beyond Example 1
($x - y = 3$ and $x + 2y = 6$, meeting at $R(4, 1)$). Each line carries its
equation, so colour is not the only thing that tells them apart.

### Give-aways and wrong statements, fixed

- **Old Problem 4 answered body Exercise Set 3.1 Q7.** It used $x - y = -1$,
  which is the body's $x - y + 1 = 0$. It printed $(2, 3)$ as that line's
  meeting point with the other line, and $(-1, 0)$ in an option, and both are
  vertices the body question asks for. It is now Example 2, with
  $2x + y = 10$ and $x - y = 2$.
- **Old Problem 2's remark was wrong.** It said that option (a),
  $x = 2$, $y = 3$, *fits the first equation*. It does not
  ($2 \times 2 + 3 \times 3 = 13$). Now: *(a), (b) and (d) fit neither
  equation.*
- **Old Set A Q8** printed $(2, 3)$, a body answer (Exercise Set 3.2 Q1 (iv),
  (vi)), as the meeting point of $y = 3$ and $x = 2$. It is now $y = 4$ and
  $x = -1$.
- **Old Set B Q5** (the taxi) came to ₹10 a km, the body answer to Exercise
  Set 3.2 Q3 (iv). Its numbers are now 8 km for ₹130 and 12 km for ₹178.
- **Dropped:**
  - old Set C Q4, supplementary angles differing by $30^\circ$, which is the
    form of Exercise Set 3.2 Q3 (ii);
  - old Set A Q5 and Q6, a definition and a one-step rearrangement;
  - old Set B Q2, the sum and difference of two numbers, which is the form of
    Exercise Set 3.2 Q3 (i).
- New practice values were chosen so that no printed solution equals a body
  answer: Q17 is $(5, 3)$ and Q24 is $(5, 2)$, not $(4, 2)$ (Akhila) or
  $(3, 5)$ (Exercise Set 3.1 Q1 (ii)).
- `check-no-repeats` finds no question in Beyond close to one in the body.
  Reading every value Beyond prints against the body's exercise answers
  found only the four items above.
- Stage 1 was read against the body. Nothing in it answers a body question.

**Practice: 32 questions**:
- 14 multiple choice;
- 5 assertion–reason, set in the Class 7 form;
- 4 very short, 4 short, 3 long;
- 2 case-based.

Key letters: a 4, b 5, c 5, d 5. The old items kept are the old Set A 1–4, 7
and 8, Set B 1, 3, 5 and 6, and Set C 1, 2, 3 and 5. Some have their options
reordered to spread the key. Old Set B 4 is now assertion–reason Q15.

**`ANSWERS.md` written.** It covers Akhila's question (4 rides, 2 games), the
running-text questions of §3.2 and §3.3, Exercise Sets 3.1–3.3 with what each
graph must show, and one worked instance for each *answers will vary*. It
also points to Stage 1's explanations and gives all 32 practice answers with
their working.

### Verified

`check-numbers.mjs` passes **484 claims**, evaluating 72 printed identities.
None of the 620 skipped spans is pure arithmetic. The check:
- reads every pair of equations off the page as linear equations, solves it,
  and checks the printed solution in both equations and against its own:
  - Akhila, Table 3.1 and the ten body examples;
  - every part of Exercise Sets 3.1–3.3, answered in `ANSWERS.md`;
  - Stage 1, all 14 Solved Examples, and practice Q20–Q32, a lettered part at
    a time;
- **reads each graph back out of its SVG** (Figs. 3.1, 3.2 and 3.3):
  - the axis scale, from the ticks;
  - each plotted line against its printed equation label, and against the
    caption;
  - each marked point against its label, and that it lies on a line;
  - the lines' intersection against the marked point, the `aria-label` and
    the example's printed Answer;
- checks every multiple-choice question: exactly one right option, and it
  matches the key. Every assertion–reason letter is derived;
- checks the numbers in the *why the other options are wrong* rows;
- checks the `ANSWERS.md` key and practice working against the page.

**Break tests: 25 of 25 caught.** Each value was broken in a copy of the
chapter, never on the page. The script is `breaks.mjs` in the session
scratchpad. The breaks covered:
- body answers, a table cell and a step;
- a Beyond example, and a Stage 1 value;
- two key letters, key rows and lettered parts;
- options;
- a point moved in Fig. 3.3, a label changed in Fig. 3.1 and a line redrawn
  in Fig. 3.2;
- `ANSWERS.md` values, the `ANSWERS.md` key and its practice working.

**Faults in the check itself, fixed on the way:**
- `+` in a variable name (`x + y = …`) was read as a regex quantifier;
- the caption was sliced past;
- graph endpoints are set to 0.1 px, so they are compared with a tolerance;
- the printed false statements ($-4 = 0$, $0 = 9$) and Stage 1's
  *can never hold* inequality are read as statements the page calls false.

**Fitting:**
- Nothing is clipped. Page 20 runs 1.3 mm into the bottom margin.
- `orphans` finds 0 stranded openers, `fit-options` finds every option row
  fits, and `check-labels` finds no collisions.
- I read the proofs of pages 3, 4, 7, 10, 11, 13, 16, 17, 19, 20, 22 and 23.
  The Answers page's *₹90 a kg* and $2x - y = 0$ are held together with `.nb`.

**Colour:** pages 3, 4 and 13 were read in greyscale and deuteranopia. Each
plotted line carries its equation, so the two lines are told apart without
colour.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 4 | 83% | Exercise Set 3.1's band with Q1 (52 mm) |
| 5 | 83% | the § 3.3 head, which needs its opening paragraph with it |
| 7 | 83% | Example 7, a panel (53 mm) |
| 11 | 74% | the last body page (`data-close`) |
| 14 | 84% | Example 4, a panel (79 mm) |
| 15 | 76% | the Type 3 head with Example 6 |
| 18 | 59% | the Type 6 head with Example 14, a panel with a table (127 mm) |
| 21 | 86% | case-based Q31 (65 mm) |
| 22 | 58% | **the Answers stage, which always opens a page** |
| 24 | 43% | the last page |

### Flagged, not done

- **Stage 1, fifth question** still gives ages of 17.5 and 32.5 years (kept
  word for word, as flagged before).
- **Stage 1** keeps a mild coaching sentence (*it is worth noticing that …*)
  under the rule that it is kept word for word.
- **The "Every answer worked" table below** describes the old Beyond the
  Book (Stage 2 letters and Sets A–C). It is superseded by `ANSWERS.md`.


Written new from NCERT *Mathematics, Textbook for Class X* (reprint 2026-27),
Chapter 3, *Pair of Linear Equations in Two Variables* (textbook pages 24–37).
Original LearnLab text in NCERT's order of topics, examples and questions; no
sentence is carried over. Crown Quarto, house design, palette `indigo` (a cool
structure hue, so the two plotted lines in each graph — structure colour and
rust — are told apart). The source PDF has no answer key; every answer below
was worked here.

Sections: 3.1 Introduction · 3.2 Graphical Method of Solution of a Pair of
Linear Equations · 3.3 Algebraic Methods of Solving a Pair of Linear
Equations, with the source's 3.3.1 *Substitution Method* and 3.3.2
*Elimination Method* as `h3` heads. The definitions (consistent, inconsistent,
dependent), the ratio test and the steps of each method are `c-keyidea`
blocks; Examples 4 and 8 set their steps as labelled working.

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted: `check-body-maths` reports no mathematics lost or added, `check-numbers.mjs` passes, 0 stranded openers, every option row fits, no label collisions. Stage 1's mother-and-daughter ages come to 17.5 and 32.5 years; the text says so on purpose, and it is left for the user to judge.

## Figures and tables

Both figures come from `fig3.mjs` in the session scratchpad, plotted from their
equations: Fig. 3.1, $x + 3y = 6$ and $2x - 3y = 12$ through A, B, P, Q;
Fig. 3.2, $y = 2x - 2$ and $y = 4x - 4$ through A, B, P, Q. The first line of
each pair is the structure colour and the second rust (`dg-plot--b`).
Table 3.1 drops the source's *Sl No.* column; its last two columns are headed
*Graph* and *Solutions*. Tables 3.2 and 3.3 each set the source's two small
tables side by side in one table.

## Every answer worked

| where | answers |
|---|---|
| 3.1 (Akhila) | not solved in the source; $x = 4$, $y = 2$ |
| Examples | 1: $(6, 0)$ · 2: coincident · 3: $(1, 0)$ · 4: $x = \frac{49}{29}$, $y = \frac{19}{29}$ · 5: 42 and 12 · 6: infinitely many · 7: no solution · 8: ₹18,000 and ₹14,000 · 9: no solution · 10: 42 and 24 |
| Set 3.1 | 1 (i) 3 boys, 7 girls (ii) pencil ₹3, pen ₹5 · 2 (i) intersect (ii) coincide (iii) parallel · 3 (i) consistent (ii) inconsistent (iii) consistent (iv) consistent (coincident) (v) consistent (coincident) · 4 (i) consistent, infinitely many, e.g. $(0, 5)$, $(5, 0)$ (ii) inconsistent (iii) consistent, $(2, 2)$ (iv) inconsistent · 5 20 m by 16 m · 6 e.g. (i) $3x + 2y - 7 = 0$ (ii) $4x + 6y - 12 = 0$ (iii) $6x + 9y - 24 = 0$ · 7 vertices $(-1, 0)$, $(4, 0)$, $(2, 3)$ |
| Set 3.2 | 1 (i) $(9, 5)$ (ii) $s = 9$, $t = 6$ (iii) infinitely many, $y = 3x - 3$ (iv) $(2, 3)$ (v) $(0, 0)$ (vi) $(2, 3)$ · 2 $x = -2$, $y = 5$, $m = -1$ · 3 (i) 39 and 13 (ii) $99^\circ$ and $81^\circ$ (iii) bat ₹500, ball ₹50 (iv) fixed ₹5, ₹10 a km, 25 km ₹255 (v) $\frac{7}{9}$ (vi) Jacob 40, son 10 |
| Set 3.3 | 1 (i) $\left(\frac{19}{5}, \frac{6}{5}\right)$ (ii) $(2, 1)$ (iii) $\left(\frac{9}{13}, -\frac{5}{13}\right)$ (iv) $(2, -3)$ · 2 (i) $\frac{3}{5}$ (ii) Nuri 50, Sonu 20 (iii) 18 (iv) 10 notes of ₹50 and 15 of ₹100 (v) fixed ₹15, ₹3 a day |

Beyond the Book: Stage 1 — $x + y = 3$, $x - y = 7$; $k = 6$, and no $k$ gives
no solution; Riya is not right; area 4; 32.5 and 17.5 years. Stage 2 — (b),
(c), (d), (b), (d). Set A b c b c a c d d; Set B a b c a d c; Set C b a c d c.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| 3.2 uses $a_1, b_1, c_1$ "given in the general form in Section 3.2", which this edition never states | the general form $a_1x + b_1y + c_1 = 0$, $a_2x + b_2y + c_2 = 0$ stated at the start of 3.2 | M1: notation used before it is introduced; the form is Class IX's |
| Step 2 of the substitution method: "as in Examples 9 and 10 below" | Examples 6 and 7 | those are the examples that end in a statement with no variable |
| Example 5: "Represent this situation algebraically and graphically by the method of substitution" | write it as a pair of equations and find the ages by substitution | no graph is drawn, and a graph cannot be drawn "by substitution" |
| Example 5: "(Isn't this interesting?)" | not carried | C8 |
| Example 6: "The pair of linear equations formed were" with no variables named | a pencil ₹$x$, an eraser ₹$y$ | the variables are used before they are defined |
| Summary 4(i): "$\frac{a_1}{a_2} \neq \frac{b_1}{b_1}$" | $\frac{b_1}{b_2}$ | a misprint |
| Summary 5: equations "not linear to start with" reduced to linear ones | not carried | that section is not in this edition of the chapter |
| Example 3: "the number of pants she purchased is 1" | "1 pair of pants" | plain English |
| "unit's", "ten's" digit | units digit, tens digit | house usage |
| the tip on comparing $\frac{a_1}{a_2}$ and $\frac{b_1}{b_2}$ first | added | states the chapter's ratio test once, as a habit |
| Set 3.2 Q3 and Set 3.3 Q2, six and five word problems in one question | the same questions, their parts set in blocks of two that can run over a page | each was 109mm of indivisible type and left a page half empty; the numbering (i)–(vi) is unchanged |
| a check of Example 1's solution, a check of the savings in Example 8, and a sentence that any method gives the same solution | added | line-sized fitting edits that close short pages; each says something the example already implies |
| Example 3's "Check that this answer fits both of her statements" | not carried | fitting |
| Set 3.1 Q2 and Q3: "On comparing the ratios $\frac{a_1}{a_2}$, $\frac{b_1}{b_2}$ and $\frac{c_1}{c_2}$, find out whether…" | "Using the ratios, …" | the ratios are named in the section just before; each stem now sets on one line |
| Example 8 amounts written ₹$9x$, ₹$4y$ | $9x$ rupees, $4y$ rupees | the rupee sign was set apart from its amount at a line break |

## System

`css/components.css` gains a continued-parts block: `li.cont` in a
`c-questions` list prints no number, and `c-parts[data-start="2"]` to `"8"`
carries the roman numbering on. It is used for the two long word-problem
questions above, and is the way any question with many parts can now run over
a page break the way an exercise set does.

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| 3.1, Akhila | C6 | the question "can we find the solutions of this pair?" is never answered in the chapter | none; the reader can solve it by either method later ($x = 4$, $y = 2$) |
| 3.2, ratio test | C6 | "the converse is also true" is asserted and never shown | none at this class |
| Example 3 | M5 | the answer, 1 pair of pants and no skirts, reads oddly for a shopping story | none; it is the source's |
| Stage 1, fifth question | — | the ages come out as 32.5 and 17.5 years; the explanation says so and uses it to make a point about checking | replace with whole-number ages if preferred |


## 21 September 2026 — figure/table reference review

Reviewed this chapter in the all-maths reference audit. Figures and tables now use one chapter sequence, including Beyond the Book; captions and references were updated together. Questions, calculations and artwork were preserved. The chapter and its volume were rebuilt; detailed layout checks and any remaining warnings are recorded in build/_all-maths-reference-checks/.
