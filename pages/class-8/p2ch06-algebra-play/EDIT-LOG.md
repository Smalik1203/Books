# Class 8 · Mathematics II · Chapter 6 — Why the Trick Always Works

## Brought to the Class 7 standard, 17 September 2026

Phase 3 of `PLAN-MATHS-CONSISTENCY.md`, worked against the Class 8
Chapter 1 model. The chapter was read whole first, and every check below was
run on the chapter.

**Pages: 30 before (19 body + 11 Beyond, Crown Quarto), 34 after (19 body +
15 Beyond, 196 × 276).** The taller page and the stepped examples cancelled
out in the body. Beyond grew by four: Stage 1 now carries its own
explanations, and there are 17 solved examples and 31 practice questions.

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`. The body was
refitted once (`refit … body`), after the examples were stepped.

**All six body examples set as steps.** *Solution*, a step to a `.work__row`,
an *Answer* row, the reason in a `.work__why`. The old wide labels (*add 3*,
*the six steps*, *by the rule*, *what repeating does*) went into the step text
or became the reason. The closing remarks of Examples 1–6 stay as paragraphs
after the working. `build/check-example-stepping.mjs`: 6 examples, 0 lost
mathematics.

**Two figures reprinted beside the questions that use them** (the rule that a
question and its figure print on the same page or facing):

| figure | printed on | question | on | done |
|---|---|---|---|---|
| Fig. 6.4, the multipliers | p. 7 | Ex 6.2 Q3 and Q7 (*extend Fig. 6.4*) | p. 8, a page turn away | reprinted after Q2, caption *(repeated from Section 6.5, for Questions 3 and 7)* |
| Fig. 6.5, August 2025 | p. 9 | Ex 6.3 Q3 (*the August page … add the nine dates*) | p. 11, a page turn away | reprinted after Q2, caption *(repeated from Section 6.6, for Question 3) August 2025* |

Neither reprint gives an answer away, so no question was reworded. Fig. 6.6
(p. 10) and Ex 6.3 Q5 (p. 11) face each other. The reprint pushed § 6.8's
opening (head, two paragraphs, the six products) from p. 11 to p. 12 by hand
(`settle`), which took p. 12 from 72% to 99%.

**Beyond the Book rebuilt to the four current stages** (§6a):

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 8 `.c-try` questions, answered in the next stage; `.c-stage__for` | **the same questions, each followed by its own explanation**, word for word except as below; no `__for` |
| 2 Behind Each Answer → **Solved Examples** | the worked answers to stage 1 | **17 stepped examples** under ten `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, 36 questions | **one numbered run of 31**: 15 MCQ, 4 assertion–reason, 3 very short, 4 short, 3 long, 2 case-based; band carries the numeral |
| 4 Answers & Takeaways → **Answers** | key, six *why wrong* paragraphs, *What to carry forward* | key, every other answer in `.work--trace` blocks, *why wrong* for 10 questions, one closing paragraph |

Stage 2 was *The same eight questions, worked*, so its explanations were moved
under their own questions and only the `.c-solution` wrappers and titles
dropped. Two sentences were changed: *Try each before turning the page* →
*before reading what follows it*; the stage 2 opener *The eight are answered
below in the order they were asked* became *Each question is explained
straight after it*, and moved to the stage's introduction.

**Stage 1 items that answered the body, repaired with the smallest change:**

| item | printed | answered | now |
|---|---|---|---|
| Q6 (best of all digits) | *and which gives the smallest?* with the rule turned over and its justification ($23 \times 1$ against $13 \times 2$) | Ex 6.4 Q2 (smallest arrangement, *state the rule and justify it*) | the smallest half of the question and its paragraph deleted |
| Q8 (genie) | start $15$, four rounds, $c = 16$ | Ex 6.5 Q8 (four shrines: $15$ flowers, $16$ each — the same equation $16x = 15c$) | start $45$, $c = 48$ |
| Q8 (genie) | *a charge of $2^{\,n}x \div (2^{\,n} - 1)$ … travellers with 7, 15 or 31 coins* and *the same one-coin margin* | the Think and Reflect on p. 17 (charge for three rounds, two rounds) and Ex 6.5 Q7, Q8 | the paragraph deleted |
| Q3 (pyramid) | *a top of $101$ or $102$ would have had no answer* | echoes Ex 6.2 Q6 (*why no such pyramid can have $101$*) | *$102$ or $103$* |

**Nothing else in Beyond repeats or answers the body.** The old problem sets
were not reused: A2, A4, A10, A11, B7, B10–B12 and C10–C11 restated body text
or examples; B5 ($84 \to 17$) and C9 ($1554 \to 14$) printed body exercise
answers; B6 was Ex 6.3 Q2 word for word; C8 ($1, 4, 6, 4, 1$) answered Ex 6.2
Q3 and Q7; C1–C6 repeated Stage 1. Every value the new material prints was
read against the body's exercise answers. Four more were changed while
writing: practice Q6's total $100$ (which is Ex 6.3 Q7's only answer) became
$72$; an assertion–reason pair on $5252$ and *$101$ is prime* (Ex 6.4 Q7)
was replaced; Q31's $x = 10$ became $12$, and Q26's ₹$80$ (the dosa price of
Ex 6.5 Q5) became ₹$84$. `build/check-no-repeats.mjs`: one pair at 50%,
Example 11 against Ex 6.3 Q5 — both shape grids, different equations and
numbers.

**Worked examples in the chapter: 23** (6 body + 17 Beyond). Types: think-of-a-number
tricks; two numbers packed into one; filling in a pyramid; the top from the
bottom row; calendar squares; shapes for numbers; the largest product;
reversing and cycling digits; undoing a chain of steps; word problems with a
letter-number. MCQ key letters: a 4, b 4, c 4, d 3 (with the
assertion–reason, 5, 5, 5, 4).

**`ANSWERS.md` written** for every question: Exercise Sets 6.1–6.5, both
Think and Reflects (the Virahānka–Fibonacci top of 29 rows is
$591\,286\,729\,879$, the 57th number), Stage 1 (pointing to its
explanations) and the 31 practice questions with working. Ex 6.5 Q1 is
answered on the reading *the same number at each shrine*, as the flag below
asks.

### Verified

`check-numbers.mjs` is kept beside the pages and passes **569 claims**. Part A
reads display maths before inline maths and evaluates **217 identities and
sums**; a side with letters is evaluated at eight sets of random values, so
$2(x + k) - 8 = 2x + 2k - 8$, $111(a + b + c)$ and $\dfrac{6x + 18}{3} - 2x = 6$
are tested as identities. 150 equations (one side depends on the letters,
such as $4a + 16 = 70$) are solved by search in part B instead. Part B runs
every trick on every allowed start (Mukta for 1–10 000, the date trick on all
366 dates, the age trick on every age to 120 and house to 99, the two new date
tricks), checks every two- and three-digit number for the reversal, cycling,
$1001$ and $101$ facts, every digit triple for the largest *and* smallest
rules, every 2 × 2 and 3 × 3 square on every month shape for the calendar
claims (Ex 6.3 Q7's only square is $21, 22, 28, 29$), and the genie formula
for $n \le 6$. Printed answers are read back off the pages — body working,
Stage 1 text, each example's Answer row, each key row one lettered part at a
time — and out of `ANSWERS.md`, rather than typed as expected values. Part C
solves every MCQ from its printed options (exactly one right, matching the
key) and derives the assertion–reason letters; part D matches `ANSWERS.md`'s
key to the page's.

**Tested by breaking values on purpose, 19 times.** Caught: body
$100m + 165$ → $175$; body Example 3's $c = 14$ → $15$; body Example 5's
$465$ → $456$; key 6 (d) → (c); practice Q3 option (a) made a second right
answer; Example 9's answer $30$ → $31$; Example 2's $\dfrac{k}{2}$ → $\dfrac{k}{3}$;
Example 14's digit sum $20$ → $21$; Stage 1 $c = 48$ → $46$; Stage 1 Q5's
$48$ → $46$; key 29 (b) $17$ → $16$; key 30 (b) *31st* → *30th of October*;
key 31 (b) $12$ → $13$; `ANSWERS.md` $9 \times 19 = 171$ → $172$, 6.2 Q2 (c)
$56$ → $62$, 6.3 Q1 (c) $25$ → $26$, Q30 *31 October* → *30 October*.
**Missed at first, now caught:** key 28's *raises the top by 2* → *3* (the
bare number check found a 2 elsewhere in the row; it is now read as a
phrase), and the body's $9(a + 8)$ → $9(a + 9)$ (not an equation, so part A
did not see it; the calendar sums are now read back as phrases).

**Fitting.** Nothing clipped, nothing into the bottom margin (two Beyond
pages that ran 3.4 and 3.7 mm were settled by hand, and Example 13's check
row went into its Answer row). `orphans`: 0 in 34 pages. `check-labels`: no
collisions. `fit-options`: every option row fits. Beyond was refitted once;
after it, blocks were moved by hand (`settle`/`unsettle`) to close a 64% and a
66% page and to keep the assertion–reason note with its four questions.
Proofs of pages 8, 11, 19, 24 and 33 were read, and every Beyond page's fill
checked.

**Colour.** Pages 1, 5, 7, 8, 9, 10 and 11 were read in greyscale and under
simulated colour-blindness (`build/check-colour.mjs`). Nothing depends on hue:
the shape grid carries triangles and circles by shape, the calendar square by
its heavy outline, and the pyramids by their numbers.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 2, 4, 6, 17 | 79–86% | the next section's `h2`, which may not be stranded |
| 3, 9 | 79%, 85% | Examples 2 and 4, panels |
| 7 | 82% | the Think and Reflect, a panel |
| 13 | 86% | a paragraph at the join |
| 14 | 82% | Exercise Set 6.4's band |
| 18 | 46% | **the summary (140 mm), which cannot divide**; 125 mm were free. Trimming it by four lines would fit it here and leave the closing paragraph alone on p. 19, so it was left |
| 23 | 87% | Example 5, a panel |
| 30 | 82% | the assertion–reason group, kept with its note |
| 32 | 74% | **the Answers stage, which always opens a page** |
| 34 | 36% | the last page |

### Flagged, not done

- The three flags below from the language pass still stand: p. 8's Think and
  Reflect (M1), Ex 6.5 Q1's *some … the same number* (C4; `ANSWERS.md`
  answers the intended reading), and Ex 6.5 Q8's *n shrines* (M2).
- *A calendar with a ten-day week — and there have been such calendars*
  (§ 6.6) and the naming of Virahānka (Think and Reflect) are facts with no
  source in this log.
- Stage 1 keeps its coaching sentences (*Notice the shape of the question*,
  *the whole of the designer's control*), because it is kept word for word.
- Ex 6.1 Q1 (b) (*add 9*) lands on $4.5$; the question does not say whether a
  non-whole answer counts. `ANSWERS.md` says so.

Language edit, 30 pages (p001–p019 chapter proper, p101–p111 Beyond the Book).
Build after editing: 30 pages, all pages fit, 0 stranded openers, no label
collisions, every option row fits. Stage 4's Set A checked question by question
against the key — all 12 correct — and every worked result in the chapter proper
re-derived, including $2^n(x-c)+c$, $111(a+b+c)$, $1001 = 7 \times 11 \times 13$
and the largest-product argument in letters.

4 fixes in 30 pages. The chapter is the best answer in the book to the question
*what is algebra for*, and it answers it without once saying "algebra is
useful": every section starts with something that looks like cleverness and ends
with the letters showing there was nothing to see through. The closing sentence
is the thesis — "A trick is a piece of arithmetic arranged so that what you
cannot see cancels out."

Four things worth recording:

- **The design is always done backwards, and the chapter says so.** § 6.2:
  "First decide how the $x$ will be removed … and only then arrange the constant
  so that what is left comes to $7$." § 6.11 repeats it as a method: "write the
  algebra first, and turn it into instructions afterwards."
- **It names the camouflage.** The date trick's *add 6* and *add 9* "contribute
  nothing but the $165$ that has to be taken off again. They are camouflage."
  Strip them and the trick is transparent. Very few textbooks tell a reader
  which parts of a procedure are there to confuse them.
- **The division step is justified, not assumed.** § 6.2 answers the reader who
  worries about halving an odd number: the step before it doubles, so "a trick
  that divides has to manufacture its own divisibility first, which is why the
  doubling stands where it does".
- **The genie is turned into a general result.** After Karim, $2^n(x-c)+c$ is
  derived and read three ways — $x > c$, $x = c$, $x < c$ — and then used to
  show that the genie only had to name a charge above seven. A story problem
  becomes a statement about every such deal.

Virahānka is named alongside Fibonacci (p008), and the contexts are local
throughout: Republic Day and Independence Day in the date trick, the pilgrim's
flowers at three shrines, Gauri and Naina's cows, a dosa cart's daily rent.

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted. Every rupee amount written as `₹$…$` is wrapped in `<span class="nb">`, so the sign can no longer end a line with its number on the next. Nothing reflowed; `check-numbers.mjs` gives the same count of claims with and without the spans.

## FIXED

| before | after | check |
|---|---|---|
| **p002** Example 1 "treble it" / "by trebling and then subtracting" | "triple it" / "by tripling and then subtracting" | L1 — matches the *triple* settled on in Part I Chapters 1, 2 and 7 and Mathematics II Chapter 2 |
| **p011** "it is an equation in one unknown and gives up its answer at once" | "…and gives its answer at once" | L3 — idiom; the same one was removed from Chapter 3 p002 |
| **p016** "The forwards one earns its keep as soon as the question changes" | "The forwards one is the one to have as soon as the question changes" | L1 — idiom; also removed from Part I Chapter 1 and Mathematics II Chapter 1 |

## FLAGGED

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p008 | M1 | The Think and Reflect asks the reader to put "the first three Virahānka–Fibonacci numbers $1$, $2$, $3$" along a pyramid's bottom row, "where each number is the sum of the two before it". The sequence is defined inside a subordinate clause, in the one place in the chapter where it appears, and the numbering is unusual — most books start $1, 1, 2, 3$, so "the first three" being $1, 2, 3$ needs saying. Then the question asks which number stands at the top of a pyramid "with twenty-nine" rows, which is a serious jump. | The sequence deserves a sentence of its own, and the twenty-nine-row part deserves either a hint or a lower number. The naming (Virahānka before Fibonacci) is right and worth keeping. |
| p017 Exercise 6.5 Q1 | C4 | "Three shrines each have a magical pond … dips his flowers in the first pond and leaves **some** at the first shrine; dips what is left in the second pond and leaves **the same number** at the second shrine; dips what is left in the third pond and leaves **all of them**." The question then asks for the smallest starting number. As written, *some* is never pinned down and *the same number* points back to it, so the reader has two unknowns and one equation — the puzzle only works if the number left at each shrine is the same at all three, which the wording half-says. | One clause: "leaves the same number of flowers at each of the three shrines". The intended answer (7 flowers, 8 at each shrine) needs that reading. |
| p018 Q8 | M2 | The four-shrine version, then "Do the same for $n$ shrines, and say what the two numbers have to do with powers of two." Generalising to $n$ needs the pattern $2^n$ and a sum of a geometric kind that the chapter never sets up — § 6.10's $2^n(x-c)+c$ is the closest, and it is a different shape (one charge repeated, not one charge at each of $n$ stops). Marked hard, which is honest, but hard is not the same as supported. | Either give the three- and four-shrine answers and ask only for the pattern, or add the line that connects it to § 6.10. |
| p106 (built page 28) | — | 87% full, 27mm of white at the foot. Pre-existing; p106 untouched. | Recorded so it is not attributed to the language pass. |
