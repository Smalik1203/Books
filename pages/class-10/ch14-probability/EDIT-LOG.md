# Class 10 · Mathematics I · Chapter 14 — Probability

## Syllabus audit fixes, 17 September 2026

Two borderline findings, both confirmed. **Pages: 26 before (13 body + 13
Beyond), 26 after (13 + 13).** The body was not touched.

- **Type 6, *Probability as a ratio of lengths*, Example 11** (a bus
  arriving between 8:00 and 8:30). The body marks its Examples 10–11 and the
  circle-on-a-rectangle question *not needed for the examination*, so this
  type taught unexamined material. The type is replaced in place, keeping
  its number: **Type 6 · Sure events, impossible events and a total of 1**.
  The new Example 11 has a bag of 18 red, black and white balls with P(red)
  $\frac{1}{6}$ and P(black) $\frac{1}{2}$. It finds P(white) $= \frac{1}{3}$
  (the three add up to 1), then 6 white balls, then P(green) $= 0$ (an
  impossible event) and P(red, black or white) $= 1$ (a sure event). It is
  stepped like the others. Its fractions differ from Q28 (60 coins,
  $\frac{1}{3}$ and $\frac{1}{4}$), which it now models, and it answers no
  body question: the body's lemon-sweet question asks about another bag.
  **Solved Examples: still 15**; no numbering moved.
- **Practice Q10, a leap year with 53 Sundays**, needed calendar reasoning
  the chapter never teaches. It is replaced by a numbered-cards MCQ (Q2 is
  already a letters-of-a-word question): cards 1 to 40, a multiple of both 2
  and 3, so 6 cards and $\frac{3}{20}$. The distractors are the multiples of
  2 ($\frac{1}{2}$), of 3 ($\frac{13}{40}$), and of 2 or 3
  ($\frac{27}{40}$). The key stays (d). The why-wrong row and `ANSWERS.md`
  were rewritten.
- `check-numbers.mjs`: Example 11 rebuilds the bag from the stated total and
  probabilities, and checks every printed value, the 0/18 and 18/18, and the
  sure and impossible labels. Q10 builds the cards from its stem and checks
  the key and all three distractors. The unused leap-year model was
  removed. Thirteen deliberate breaks were all caught. It passes with 590
  claims.
- `check-no-repeats`: no pair involves a changed item.
- `refit … bridge` once: 13 pages, no overflow, orphans 0, options fit,
  labels clear. The short pages are held open by headings and panels, as
  before.

## Brought to the Class 7 standard, 17 September 2026

Phase 4 of `PLAN-MATHS-CONSISTENCY.md`, against the Class 10 brief and the
Chapter 1 model. Page move, examples, Beyond the Book and answers were done
in one pass, and every check was run on the chapter.

**Pages: 21 before (14 body + 7 Beyond, Crown Quarto), 26 after (13 body + 13
Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`. The body was
refitted once with `refit … body`, then placed by hand (below).

**All thirteen body examples set as steps.** Every one was a question-only
panel with its working after it, in prose and `.work--list` lines. The working
moved into the panel as *Solution*, Steps and *Answer*; remarks that are not
steps (Remark 1 and 2, the note on history, the Notes after Examples 4, 7 and
9, *Check that P(W) + P(B) + P(R) = 1*) stay as paragraphs after the panel.
- **Figures and tables with their working.** Fig. 14.1 sits inside Example 10
  after its rows; Table 14.1 inside Example 13 after its rows (its caption is
  shortened to *Blue die (rows) and grey die (columns)*). Fig. 14.2 stays just
  before Example 11, on the same page.
- **NCERT's "(Why?)" prompts inside the working** (Examples 1, 4, 7, 8, 12,
  13) became the step's `.work__why`, which gives the reason instead of
  asking for it. This is the one wording loss of the recast.
- To fit, several steps were said in fewer words (for example Example 9's
  "(H, T) is a head on the first and a tail on the second"; Example 13's
  "the sum is at most 12" for "less than or equal to 12" inside the step),
  and the body text after the "(i)" question on page 4 now ends *: getting 8
  is impossible* so that KaTeX no longer sets the full stop on a line of its
  own.

**Verified** by `build/check-body-maths.mjs`: 121 expressions and 339 numbers
compared, *no mathematics lost or added*; the only gains are numbers restated
in Answer rows (0.38, 0.88, 0.96, 36, 12 and one each of 0, 1, 14.1).

**Body fitting, by hand.** `refit` gave 14 pages with page 7 at 54% (Example
10 missed by 18 mm). Example 10's last two rows were merged into its Answer,
lines were shortened in Examples 3, 4, 6, 7, 9 and 13, and blocks were moved
back a page at a time, which lost one page: body is 13 pages.

**Beyond the Book rebuilt to the four stages:**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, each explained in running text | **kept word for word**; only `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems | **15 stepped examples** under nine `Type` heads. Old Problems 1, 2, 3 and 5 are Examples 1, 4, 9 and 13, options kept; old Set A Q8, Set B Q2 and Set C Q2, Q4, Q5 are Examples 2, 6, 12, 14 and 7 |
| 3 Problem Sets → **Practice** | 3 sets, 19 questions | **one run of 30**: 11 multiple choice, 4 assertion–reason, 5 very short, 5 short, 3 long, 2 case-based |
| 4 Answers & Takeaways → **Answers** | key and why for 8 | key, every other answer, why the options are wrong for 9, the closing paragraph |

Types: one experiment · the complement · coins, and a coin with a die · two
dice · playing cards · ratio of lengths · numbered cards · an unknown number
of objects · data in a table (a board-style case). Key letters: a 3, b 4,
c 4, d 4 (MCQ and assertion–reason together).

**Give-aways removed** (every value Beyond printed was read against Exercise
Set 14.1):
- Old Problem 4 (two dice, prime sum) printed the counts 1, 2, 4, 6, 2 for the
  sums 2, 3, 5, 7, 11 — four cells of Q22's table. Dropped. Old Set B Q6
  (sum 7 is $\frac{1}{6}$) and Set C Q1 (sum at least 10, listing the pairs)
  did the same and were dropped. **No two-dice question in Beyond is about a
  sum any more**; they use products, differences and doubles.
- Old Set A Q1 and Q7 were Q1 (ii) and (iv) of the exercise; Set A Q5 (face
  card, $\frac{3}{13}$) and Set B Q4 (red face card, $\frac{3}{26}$) were Q14
  (ii) and (iii); Set C Q3 was the "(ii)" question in the running text; Set A
  Q2 and Q3 repeated Q5 and Q4 with new numbers. All dropped.
- The old closing paragraph named HH, HT, TH, TT against *two heads, one of
  each, two tails*, which is the answer to Q25 (i). Its example is now a bag
  of 4 red and 5 green balls.
- `check-no-repeats` reports 14 pairs at 50–75%; every one is the shared
  stem "One card is drawn from a well-shuffled deck of 52 cards" or "A die is
  thrown once" with a different event.

**`ANSWERS.md` written** for the running-text questions, Exercise Set 14.1
(all 25, parts separately), Stage 1, and all 30 practice questions with their
working.

### Verified

`check-numbers.mjs` builds every sample space itself — one die, two dice, one
to three coins, a coin with a die, a 52-card deck as rank, suit and colour,
numbered cards, bags — and counts each probability as an exact fraction in
lowest terms. It passes **576 claims** and evaluates 170 printed identities
(`\pi` is read as a number, so Q20's area ratio is checked).
- **B** reads every value back off the page: each body example's Answer row a
  part at a time, Fig. 14.2's four dimension labels (the lake's area is worked
  from them), Fig. 14.1's end tick, the three given cells of Q22's table,
  every exercise answer in `ANSWERS.md` a part at a time, Stage 1's five
  paragraphs, all 15 solved examples, and the practice key rows a lettered
  part at a time, with the two case tables read back too. Complementary pairs
  printed together (Examples 4, 6, 7; Q8, Q21, Q24) are checked to add to 1.
  Solutions of equations (Examples 13 and 14, practice 25, on the page and in
  `ANSWERS.md`) are put back into every equation of their block.
- **C** finds exactly one right option for all 11 practice MCQs and all 9
  option examples, and derives the four assertion–reason letters.
- **D** `ANSWERS.md`'s key and practice working match the page.

**Break tests: 17 of 17 caught**, on a copy in the scratch folder: body
Examples 4, 11 and 12; a given cell of Q22's table; Beyond Example 10 (iii);
Beyond Example 7's answer letter; key letter 5; key rows 16 and 26 (iii); an
option of Q3; the Q30 case table; a Stage 1 value; `ANSWERS.md` Q14 (iii),
Q18 (i), key letter 11, practice 27 (iv) and practice 25's solution.

**No wrong numbers found** in the body or the old Beyond pages.

**Fitting:** nothing is clipped. Pages 4, 18 and 25 run 1.3 mm and page 15
0.8 mm into the bottom margin. `orphans` finds 0 stranded openers,
`check-labels` finds no collisions, `fit-options` finds every option row
fitting. Proofs of pages 3–9, 15, 18, 21 and 25 were read.

**Colour:** pages 1, 7, 8, 11 and 12 checked in greyscale and deuteranopia.
Fig. 14.2's lake is also outlined and labelled *Lake*; Fig. 14.1's first
half-minute is a heavier stroke under the words *first half-minute*.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 7 | 51% | Example 10 with Fig. 14.1; Fig. 14.2 must share a page with Example 11, and the two do not fit after it |
| 9 | 72% | Example 13 with Table 14.1; Exercise Set 14.1's band and Q1 (68 mm) miss by 8 mm |
| 13 | 60% | the last body page (`data-close`) |
| 19, 20 | 80%, 87% | Solved Examples: a `Type` head with its example, and a whole panel |
| 23 | 45% | practice Q25–Q28; Q29 moved on so Q30 does not stand alone before Answers |
| 24 | 81% | **the two case questions before the Answers stage, which always opens a page** |
| 26 | 60% | the last page |

### Flagged, not done

- **Stage 1's third question** lists the eight outcomes of three coins, which
  is the sample space Q23 needs (Hanif's game). It does not give Q23's
  answer, so it was kept word for word. The coordinator may prefer to
  replace it.
- **Fig. 14.1** marks the first half-minute with a heavier line in the
  chapter colour; in greyscale the weight and the label carry it, but only
  just.
- The flags below (Q7 C4, the Laplace date, Q2 (iv), Q10's 50p coins) still
  stand. Q10 keeps "50p" in the body.
- Unsourced history: Cardan, Bernoulli, de Moivre, Laplace's 1812 book.


Written new from NCERT *Mathematics, Textbook for Class X* (reprint 2026-27),
Chapter 14, *Probability* (textbook pages 202–217). Original LearnLab text in
NCERT's order of topics, examples and questions; no sentence is carried over.
Crown Quarto, house design, palette `teal`. The source PDF has no answer key;
every answer below was worked here.

One section, 14.1 *Probability — A Theoretical Approach*, with Examples 1–13.
*Exercise 14.1* is Exercise Set 14.1 (25 questions). The definition of
theoretical probability and the complement rule are `c-keyidea`s; working is
`.work--list` rows. The source's *14.2 Summary* and *A Note to the Reader* are
the chapter summary.

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted: `check-body-maths` reports no mathematics lost or added, `check-numbers.mjs` passes, 0 stranded openers, every option row fits, no label collisions. Stage 1's third question lists the eight outcomes of three coins, the sample space body Q23 needs, without its answer. It is kept and listed for the user.

## Figures

Five figures come from `fig14.mjs` in the session scratchpad (unfilled copy
`c14-src`); all are drawn from the source's pictures, not traced.

| figure | note |
|---|---|
| Fig. 14.1 | the number line from 0 to 2 with the first half-minute drawn heavier |
| Fig. 14.2 | the forest is a scatter of tree crowns; the lake is tinted with a few waves |
| source Fig. 14.3 | the 36 outcomes of two dice are a grid of text, so here they are **Table 14.1**, and the three references say "Table 14.1" |
| Fig. 14.4 | the tank and its 13 fish only; the woman netting a fish is not drawn, and the fish are not marked male or female (the source does not mark them either) |
| Fig. 14.5 | the spinner with eight sectors, numbered as in the source |
| Fig. 14.6 | the 3 m by 2 m rectangle and the circle of diameter 1 m |
| Laplace portrait | not reproduced |

## Every answer worked

| where | answers |
|---|---|
| Examples 1–7 | ½ and ½; ⅓ each; ⅓ and ⅔; 1/13 and 12/13; 0.38; 364/365 and 1/365; 5/8 and 3/8. The source's values are correct |
| Examples 8–13 | 2/9, 1/3, 4/9; 3/4; 1/4; 5/27 (lake 3 km by 2.5 km); 0.88 and 0.96; 5/36, 0, 1 |
| Set 14.1 Q1–Q9 | 1 (i) 1 (ii) 0, impossible event (iii) 1, sure or certain event (iv) 1 (v) 0 and 1 · 2 (i) no (ii) no (iii) yes (iv) yes · 3 a fair coin gives head and tail equally likely, so neither team is favoured · 4 (b) −1.5 · 5 0.95 · 6 0 and 1 · 7 0.008 · 8 3/8, 5/8 · 9 5/17, 8/17, 13/17 |
| Set 14.1 Q10–Q17 | 10 5/9, 17/18 (180 coins) · 11 5/13 · 12 1/8, 1/2, 3/4, 1 · 13 1/2, 1/2, 1/2 · 14 1/26, 3/13, 3/26, 1/52, 1/4, 1/52 · 15 1/5; 1/4 and 0 · 16 11/12 · 17 1/5, 15/19 |
| Set 14.1 Q18–Q25 | 18 9/10, 1/10, 1/5 · 19 1/3, 1/6 · 20 π/24 · 21 31/36, 5/36 · 22 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1 over 36; no, the 11 sums are not equally likely · 23 3/4 · 24 25/36, 11/36 · 25 (i) not correct: *one of each* has probability ½ and each of the others ¼ (ii) correct: 3 of the 6 outcomes are odd |

Beyond the Book: Stage 1 — 3/4; 7/13; 3/8; 18 blue balls; 1/3. Stage 2 — (b), (c), (a), (d), (b).
Set A b c d a c a b d; Set B b a a d b c; Set C c b a c d.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| the epigraph from R. S. Woodward | a sentence in the opening paragraph | the house page has no epigraph |
| the side box on Laplace, and the history beside it | "A note on history" after Remark 2 | the portrait is not drawn; placed where it fits the page |
| "unfeasible", "compute", "the phenomenon of an earthquake", "it is sure that" | "cannot be done", "find", "wait for earthquakes", "is sure to" | L1 |
| "the outcome of drawing a ball of any colour from the bag is equally likely" | "each of the five balls is as likely to be drawn as any other" | L3: the source's sentence says the opposite of what it means |
| `*` and the footnote "Not from the examination point of view" on Examples 10, 11 and Question 20 | a hint line saying the item is not needed for the examination | the book has no footnotes |
| source Fig. 14.3 | Table 14.1 | it is a table |
| Exercise 14.1 Q4 options (A)–(D) | (a)–(d) | the book's option style |
| Q6 "lemon flavoured candies" | "lemon-flavoured sweets" | L1 |
| Q13's part (iii) "an odd number", printed beside Fig. 14.5 in the source | set in Q13 | typesetting |
| Q22's table with two rows of 11 cells | one row table headed *Sum* | fitting |
| Example 11 | the lake's length and width worked from the figure (9 − 6 and 4.5 − 2) | M2 |
| Summary 1: the formula | the definition in words | the fraction was unreadable at caption size |
| A Note to the Reader | summary point 7 | structure |
| line-sized changes: Example 2's question shortened, parts inline; working rows split in Examples 12 and 13, and Example 6's bracketed "(using P(not E) = 1 − P(E))" dropped; Q6 parts as a list; Q7 "(Ignore leap years, and assume that every day of the year is equally likely to be a birthday.)"; Q8 "The balls are all of the same size."; Q25 asks for a reason per argument; Beyond the Book stage 1 two sentences | changed or added | fitting |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| Q7 | C4 | "in a group of 3 students, the probability of 2 students not having the same birthday is 0.992" does not say which 2 students; for 3 students the probability that no two share a birthday is (364 × 363)/365², about 0.9918 | "for two particular students" |
| 14.1 | C6 | "This definition of probability was given by Pierre Simon Laplace in 1795": the classical definition is usually dated to Laplace's work of 1812–1814; 1795 is the year of his lectures | check the date |
| Q2 (iv) | M5 | "A baby is born. It is a boy or a girl" is expected to be equally likely, but birth ratios are not exactly equal | "roughly equally likely", or another example |
| Q10 | M5 | 50 paise coins are no longer in everyday use | ₹1, ₹2, ₹5 and ₹10 coins |
| Example 6 | C5 | treats the 365 birthdays as equally likely without comment; the solution states the assumption, which is kept | none |
