# Class 10 · Mathematics I · Chapter 4 — Quadratic Equations

## Syllabus audit fixes, 17 September 2026

Two borderline findings, both confirmed. **Pages: 22 before (9 body + 13
Beyond), 22 after (9 + 13).** The body was not touched. No completing the
square appears anywhere.

- **Practice Q27, the motorboat 24 km upstream** (speeds $18 \mp s$), which
  needs stream speed. The body never teaches it, and the question is from
  the old Exercise 4.3. It is replaced by a long-answer time-difference
  problem: a cyclist rides 60 km out and comes back 5 km/h slower, taking
  1 hour longer. So $300 = x^2 - 5x$, she rides at 20 km/h and back at
  15 km/h, and the round trip takes 7 hours. It differs from Example 7 (a
  train, faster and sooner) and from the body's 480 km train.
- **Practice Q28, two taps** (work rates $\frac{1}{x} + \frac{1}{x - 10}$),
  from the old Exercise 4.3. It is replaced by a consecutive-integer problem:
  the square of the smallest of three consecutive positive integers, added to
  the product of the other two, is 46. So $2x^2 + 3x - 44 = 0$, the rejected
  root is $-\frac{11}{2}$, and the integers are 4, 5 and 6. It is not the
  body's (product 306; squares adding to 365), Example 6 or Q8.
- Both key rows and `ANSWERS.md` were rewritten, including the check and the
  discriminant $361 = 19^2$.
- `check-numbers.mjs`: Q27 is solved from the numbers in its text, with the
  single positive root, the return speed, the total time and the cleared
  equation checked. Q28 is found by search from its target, with the
  expanded equation, both roots and the discriminant in `ANSWERS.md`
  checked. Twelve value breaks were caught. One wording change (*round* to
  *whole*) was not, which is harmless. It passes with 566 claims.
- `check-no-repeats`: no pair involves a changed item.
- `refit … bridge` once: 13 pages, no overflow, orphans 0, options fit,
  labels clear. p111 (57%) is the short page before Answers. The other
  short pages are held open by example panels.

## Brought to the Class 7 standard, 17 September 2026

Phase 4 of `PLAN-MATHS-CONSISTENCY.md`, done to the Class 10 brief with
Chapter 1 as the model. The page move, examples, Beyond the Book and answers
were done in one pass, and every check was run on the chapter.

**Pages: 17 before (10 body + 7 Beyond, Crown Quarto), 22 after (9 body + 13
Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`. The body was
refitted once. After that I placed pages by hand, because the refit left
page 2 at 47%, a page holding only Example 7 (25%) and a page holding only
the tip (7%). Examples 1, 6 and 8 were tightened so each fits beside its
neighbour: steps were merged and no maths was dropped.

**All nine body examples are set as steps** (the Class 10 decision). Each
example's working moves into its panel as *Solution*, Steps and *Answer*.
- **Examples 1 and 2** have more than one part, so each part's first step
  starts with its numeral.
- **Example 8** carries Fig. 4.2 inside its panel, after the work rows. The
  figure is now `c-figure--sm` (47 mm), so the example fits on page 8 with
  Example 7.
- **Remarks that are not steps stay as paragraphs:**
  - after Example 1, what each equation describes;
  - after Example 3, the zero-product fact and "check that both roots
    satisfy";
  - after Example 5, the repeated root;
  - after Example 2, "Be careful".
- **NCERT's two "(Why?)" questions** stay inside their steps (Examples 1
  and 8).
- **Cut:** the sentence "So the pole can be put up only if…" after
  Example 8. Its content is Step 6.
- **Verified** by `check-body-maths`: 167 expressions and 68 numbers, with
  none lost and none added. The only gains are numbers restated in Answer
  rows.

**Beyond the Book rebuilt to the four stages:**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, each explained in running text | **kept word for word**; only `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems | **16 stepped examples** under seven `Type` heads. The old problems are Examples 3, 6, 7, 9 and 11, with their options kept; *Answer* gives the letter |
| 3 Problem Sets → **Practice** | 3 sets, 19 questions | **one run of 31** in six forms: 15 MCQ, 4 assertion–reason, 3 very short, 4 short, 3 long, 2 case-based |
| 4 Answers & Takeaways → **Answers** | key and why the options are wrong for 14 | key; every other answer in `.work--trace`; why the options are wrong for 12; the closing paragraph, whose third point was rewritten |

**The seven types:**
1. recognising and forming quadratic equations
2. roots by factorisation (including a surd equation and one with a
   fraction)
3. word problems (numbers, motion, a path round a park)
4. the discriminant and the nature of the roots
5. a letter in the equation (real roots, equal roots, a given root)
6. the quadratic formula (including a fractional equation)
7. is it possible?

**Worked examples in the chapter: 25** (9 body + 16 Beyond).

**Reused from the old Problem Sets:** 14 of the 19 questions, with options
reordered to spread the key (a 4, b 5, c 4, d 6).
- **Dropped:**
  - A5 ($x^2 + x + 1$), which is a weaker copy of C3;
  - A7 (the largest number of roots is 2), which is too slight;
  - B3 (a rectangle with perimeter 30 and area 56), which is too close to
    Example 16 and to Exercise Set 4.3 Q5.
- **B4 was a give-away.** Its assertion "$2x^2 - 4x + 3 = 0$ has no real
  roots; the discriminant is $-8$" is body Example 7 word for word. It was
  replaced by four new assertion–reason questions in the Class 7 form.
- **New:** very short, short and long answers, and the two cases (a ball
  thrown up, and chairs in a hall).

**Nothing repeats or answers the body.**
- `check-no-repeats` reports 6 pairs at 50% or more. Each is the same kind
  of question with a different equation:
  - $(x + 1)^3 = x^3 + 2x - 5$ against Example 2 and Set 4.1 Q1;
  - three discriminant and $k$ questions against Set 4.3 Q1 and Q2.
- **Every value Beyond prints was read against the body's exercise
  answers.** Nothing gives one away.
  - Example 7 (a 360 km train, speed 40 km/h) is near Set 4.1 Q2 (iv), a
    480 km train whose speed also comes to 40 km/h. But Set 4.1 Q2 (iv)
    asks only for the equation, not the speed.
  - Example 16's remark that a square gives the largest area was not
    written, because it would answer Set 4.3 Q5.

**`ANSWERS.md` written.** It covers:
- Exercise Sets 4.1–4.3, with the reduced equation for every part of
  Set 4.1 Q1;
- the two "(Why?)" questions and the two "check" requests in the running
  text;
- Stage 1;
- all 31 practice questions with their working, and the proof in Q24 set
  one statement to a line.

### Verified

`check-numbers.mjs` passes **552 claims**. The Chapter 1 model evaluates only
arithmetic, so this script has a small LaTeX parser: implicit products,
surds, fractions, mixed numbers and ±. It reads 758 maths spans and checks
497 statements.

**A, on every page and in `ANSWERS.md`:**
- every chain of equal sides holds as functions of its letters;
- a row that opens with "=" must be an identity;
- an equation whose sides differ by a constant fails;
- two equations joined by *so*, *that is*, *gives*, *becomes* or *when*
  must be the same polynomial (up to a factor), or have the same roots;
- every "$x = $ number" must satisfy an equation in its row.

**B:** every quadratic the chapter sets is solved, and its roots and
discriminant are read back off the page. Every word problem is solved
again from its words, by search:
- the hall, the marbles, the toys and the pole;
- Set 4.2 Q2–Q6 and Set 4.3 Q2–Q5;
- Stage 1;
- the 16 Beyond examples;
- practice 20–31. These are read from the key rows and from `ANSWERS.md`,
  a lettered part at a time, and word answers are checked as phrases
  ("after 4 s", "bought 16 books").

**C and D:** each multiple-choice question has exactly one right option,
and it matches the key. The four assertion–reason letters are derived. The
key and the working letters in `ANSWERS.md` match the page.

**Break tests: 18 of 18 caught.** They covered:
- body steps, a discriminant and an answer root;
- Beyond steps and answers;
- a Stage 1 value;
- a key letter and key rows, and a lettered part;
- two options;
- an `ANSWERS.md` value, reduced equation, nature, key and working row.

The first run missed two:
- a broken factorisation in a row that opens with "=" was read as an
  equation, so such rows must now be identities;
- key 30 (c) "after 5 s" passed because $t = 4$ is also in the row, so the
  word answers are now checked as phrases.

**No wrong printed number was found.** The earlier flag on Set 4.3 Q2 (ii)
is answered: `ANSWERS.md` gives $k = 6$ only, and says why $k = 0$ is
excluded.

**Fitting:**
- Nothing is clipped. Page 6 runs 1.1 mm into the bottom margin.
- `orphans` finds 0 stranded openers.
- `check-labels` finds no collisions.
- `fit-options` finds every option row fits. Practice Q1's options were
  moved from one column to two, and they fit.
- I read the proofs of every body page with an example (2, 3, 5, 7, 8) and
  of pages 11, 12, 14, 15 and 17–22. They led to two fixes:
  - Example 6 Step 2 had broken inside $25(x - 12)$;
  - key rows 26–30 had broken inside equations, so they were reworded and
    their equations braced.

**Colour:** pages 1 and 8 were checked in greyscale and in deuteranopia.
Neither figure uses colour to carry anything; the labels do.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 6 | 80% | placed by hand. The next paragraph (11 mm) would fit, but moving it and its display would leave page 7, which ends before Example 8's 160 mm panel, at about 70% instead. Pages 6 and 7 were balanced at 80% and 85% |
| 7 | 85% | Example 8 with Fig. 4.2, a panel of 160 mm |
| 9 | 81% | the last body page (`data-close`) |
| 11 | 81% | the Type 2 head and Example 3 |
| 13–15 | 68–76% | Solved Examples: example panels that do not fit in the space left |
| 20 | 57% | **the Answers stage, which always opens a page**; the page holds the two case-based questions |
| 21 | 80% | the "Why the other options are wrong" head with its rows |
| 22 | 78% | the last page |

### Flagged, not done

- **Example 8's figure** now follows the steps inside the panel, so Step 1's
  "in Fig. 4.2" points down the page. The alternative, the figure before the
  panel, would have put it on a different leaf from the example (pages 7
  and 8 are back to back).
- **KaTeX breaks the summary's point 5** between $b^2 -$ and $4ac$ (page 9).
  This is class-wide and needs a stylesheet fix.
- **Unsourced history** in 4.1 (dates, Sridharacharya "as quoted by Bhaskara
  II") is still as flagged below.
- The earlier note that "page 9 runs 1.3 mm into the margin" no longer
  applies. The pages have changed, and page 6 now reports 1.1 mm.
- The "Every answer worked" table below still lists the old Beyond key
  (Set A/B/C). It is history; `ANSWERS.md` is current.

Written new from NCERT *Mathematics, Textbook for Class X* (reprint 2026-27),
Chapter 4, *Quadratic Equations* (textbook pages 38–47). Original LearnLab
text in NCERT's order of topics, examples and questions; no sentence is
carried over. Crown Quarto, house design, palette `garnet`. The source PDF has
no answer key; every answer below was worked here.

Sections: 4.1 Introduction · 4.2 Quadratic Equations · 4.3 Solution of a
Quadratic Equation by Factorisation · 4.4 Nature of Roots. *Exercise 4.1*–*4.3*
are Exercise Sets 4.1–4.3. The definitions (quadratic equation, root), the
quadratic formula and the discriminant cases are `c-keyidea` blocks. The
source's *4.5 Summary* is the chapter summary.

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted: `check-body-maths` reports no mathematics lost or added, `check-numbers.mjs` passes, 0 stranded openers, every option row fits, no label collisions.

## Figures

Both figures come from `fig4.mjs` in the session scratchpad.

| figure | note |
|---|---|
| Fig. 4.1 | the prayer hall floor, breadth $x$ m and length $(2x + 1)$ m, area 300 m², drawn in the solved proportion 12 : 25 |
| Fig. 4.2 | the circular park, diameter $AB$ = 13 m, pole $P$ with $BP = x$ and $AP = x + 7$, drawn to scale for $x = 5$, right angle at $P$ |

## Every answer worked

| where | answers |
|---|---|
| 4.1 hall | $2x^2 + x - 300 = 0$; breadth 12 m, length 25 m (Example 6) |
| Example 1 | (i) $x^2 - 45x + 324 = 0$ (ii) $x^2 - 55x + 750 = 0$ |
| Example 2 | (i) quadratic (ii) not (iii) quadratic (iv) quadratic |
| Examples 3–9 | 1, $\frac{3}{2}$ · $\frac{2}{3}$, $-\frac{1}{2}$ · $\sqrt{\frac{2}{3}}$ twice · 12 m by 25 m · no real roots ($D = -8$) · 5 m from $B$, 12 m from $A$ · $\frac{1}{3}$ twice |
| Set 4.1 Q1 | (i) yes, $x^2 + 7 = 0$ (ii) yes, $x^2 - 4x + 6 = 0$ (iii) no, $-3x + 1 = 0$ (iv) yes, $x^2 - 10x - 3 = 0$ (v) yes, $x^2 - 11x + 8 = 0$ (vi) no, $7x - 3 = 0$ (vii) no, $x^3 - 6x^2 - 14x - 8 = 0$ (viii) yes, $2x^2 - 13x + 9 = 0$ |
| Set 4.1 Q2 | (i) $2x^2 + x - 528 = 0$ (ii) $x^2 + x - 306 = 0$ (iii) $x^2 + 32x - 273 = 0$ (iv) $u^2 - 8u - 1280 = 0$ |
| Set 4.2 | 1 (i) 5, $-2$ (ii) $\frac{3}{2}$, $-2$ (iii) $-\sqrt{2}$, $-\frac{5}{\sqrt{2}}$ (iv) $\frac{1}{4}$, $\frac{1}{4}$ (v) $\frac{1}{10}$, $\frac{1}{10}$ · 2 marbles 36 and 9; toys 25 or 30 · 3 13 and 14 · 4 13 and 14 · 5 5 cm and 12 cm · 6 6 articles at ₹15 each |
| Set 4.3 | 1 (i) no real roots (ii) equal, $\frac{2}{\sqrt{3}}$ twice (iii) distinct, $\frac{3 \pm \sqrt{3}}{2}$ · 2 (i) $k = \pm 2\sqrt{6}$ (ii) $k = 6$ · 3 yes, 40 m by 20 m · 4 not possible ($x^2 - 20x + 112 = 0$ has $D = -48$) · 5 yes, a square of side 20 m |

Beyond the Book: Stage 1 — $k = \pm 6$, roots $\mp 3$; $k = 6$, other root 3;
not possible; 11 and 13, or $-13$ and $-11$; $D = p^2 + 4 \gt 0$. Stage 2 —
(a), (b), (d), (a), (a). Set A b a a b c b b b; Set B b b b a a c;
Set C a a c c a.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| 4.4 opens "The equation ax² + bx + c = 0 are given by" and uses the quadratic formula, which this edition no longer derives | one sentence says why a formula is needed, and the formula is stated as a key idea; a paragraph checks that its two roots have sum $-\frac{b}{a}$ and product $\frac{c}{a}$ | the source sentence is broken, and the formula arrives with no reason; the check uses only Chapter 2 |
| Example 8: "x = 7 ± √289 over 2" | $\frac{-7 \pm \sqrt{289}}{2}$ | a lost minus sign; the roots 5 and $-12$ need it |
| Example 5's factorisation shown with the middle term $2\sqrt{6}x$ split | the same, as three lines of working | layout |
| "C.E. 598-665" and similar | 598–665 CE | house style |
| Example 2 Remark "Be careful!" | "Be careful." as the start of a paragraph | C8 |
| Example 9: "hence find the nature" | "use it to find the nature" | L1 |
| the tip on checking roots against the problem | added | the chapter sets aside a negative root twice and says so each time |
| the history paragraph in 4.1 | two paragraphs | one 61mm paragraph could not start on the opening page |
| Set 4.1 Q2, four word problems in one question | parts in two blocks of two (`li.cont`, `c-parts[data-start]`) | the same numbering; the question can now run over a page |
| a sentence on what the discriminant tells us, one on working it out first, and a check of both integer pairs in Stage 1 | added | line-sized fitting edits; each says what the page already shows |
| three sentences reworded so a full stop is not set alone at the head of a line after an equation | reworded | layout |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| 4.4, quadratic formula | C6 / M3 | the formula is used without a derivation; the source's history paragraph names completing the square, but the section that did it is not in this edition | a derivation, or a note that it is taken as known |
| Example 8 | C5 | "$\angle APB = 90^\circ$ (Why?)" relies on the angle in a semicircle, which the reader meets in Class IX; the chapter leaves it as a question | none |
| Set 4.3 Q2 (ii) | C4 | $kx(x - 2) + 6 = 0$ has equal roots for $k = 6$; $k = 0$ also makes $4k^2 - 24k = 0$ but then the equation is not quadratic | none, but the key should say $k = 6$ only |
| page 9 (p009) | — | the builder reports "~ page 9 runs 1.3mm into the bottom margin" on every build, although its fill is 93% and the proof ends well above the foot. The report appeared when two Beyond the Book pages (p103, p104) were shortened; p009 itself was not changed. Not explained | find what the overflow probe is measuring on that page before the volume goes to press |
| 4.1 history | C6 | the dates and the attribution of the formula to Sridharacharya "as quoted by Bhaskara II" are the source's and were not checked against another source | check if the history is to be cited |
