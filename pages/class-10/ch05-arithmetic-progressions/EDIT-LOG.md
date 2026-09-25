# Class 10 · Mathematics I · Chapter 5 — Arithmetic Progressions

## Solved examples in examination formats, 24 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 15 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-10/ch05-arithmetic-progressions/`.

Source `build/jee-class10.mjs`; check `build/check-jee-class10.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p111; the answers stage still opens a fresh page.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) 47 |
| 2 | Single correct | (b) 16 |
| 3 | Single correct | (c) 590 |
| 4 | Single correct | (d) $-2$ |
| 5 | Single correct | (a) 203 |
| 6 | Single correct | (b) 11 |
| 7 | Multiple correct | (b), (c) |
| 8 | Multiple correct | (a), (b), (d) |
| 9 | Multiple correct | (a), (b), (c) |
| 10 | Multiple correct | (a), (b) |
| 11 | Numerical answer | 4920 |
| 12 | Numerical answer | 860 |
| 13 | Numerical answer | 15 |
| 14 | Matching | (a) P–3, Q–4, R–1, S–2 |
| 15 | Matching | (d) P–3, Q–1, R–4, S–2 |


## Brought to the Class 7 standard, 17 September 2026

Phase 4 of `PLAN-MATHS-CONSISTENCY.md`, worked by an agent from the Class 10
brief, with Chapter 1 as the model. Page move, examples, Beyond the Book and
answers were done in one pass, and every check was run on the chapter.

**Pages: 29 before (22 body + 7 Beyond, Crown Quarto), 32 after (20 body +
12 Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`. The body was
refitted once, and then placed by hand (below).

**All sixteen body examples set as steps.** Each was a question-only panel
with its working in the running text after it. The working now sits in the
panel as *Solution*, Steps and *Answer*, with the reason in `.work__why`.
- Examples 2, 14 and 16 have lettered parts; each step names its part.
- Examples 8, 10 and 16 ran onto the next page file; all their working is
  now inside the panel.
- The "(Why?)" questions in Examples 6, 8 and 10 are kept in their steps.
- Remarks that are not steps stay as paragraphs after the panel: Example 1's
  "any two consecutive terms give us $d$", Example 8's *Another way*, and
  Example 13's "Two answers make sense here".
- Example 3's "check by writing out the first ten terms" is a *Check* row.
- Example 9's "Simple interest is given by the formula" display is Step 1.

**Verified** by `build/check-body-maths.mjs`: 414 expressions and 365
numbers compared, none lost and none added. The only gains are numbers
restated in Answer rows (28, 34, 80, 160, 240).

**Hand fitting, after the one refit:**
- p014 (page 14): "Using the formula made the problem much easier to solve."
  became "The formula made this much easier." This drops one rendered line,
  so Example 12 now fits under Example 11.
- Example 16's Answer row was shortened to one line ("(i) 550 sets (ii) 775
  sets in the 10th year (iii) 4375 sets in the first 7 years"). This lets
  Exercise Set 5.3's head and its first two questions sit on page 16 without
  being stranded.
- Blocks were then pulled back page by page. Set 5.4 Q3 now prints on the
  same page as Fig. 5.7; after the refit, the figure had been overleaf and
  not facing. The body lost a page, and the summary and the arithmetic-mean
  tip close page 20.
- **Every question that names a figure now prints on its figure's page or
  facing it:** Q18 with Fig. 5.4 (page 18); Q19 with Fig. 5.5 (page 18);
  Q20 (page 18) facing Fig. 5.6 (page 19); Set 5.4 Q3 with Fig. 5.7
  (page 19); Q5 with Fig. 5.8 (page 20).

**Beyond the Book rebuilt to the four stages:**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, each explained in running text | kept word for word except one item (below); `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems | **15 stepped examples** under eight `Type` heads; the old problems are Examples 1, 3, 9, 10 and 11, with their options kept and *Answer* giving the letter |
| 3 Problem Sets → **Practice** | 3 sets, 19 questions | **one run of 30** in six forms |
| 4 Answers & Takeaways → **Answers** | key and why the options are wrong | key, every other answer, why the options are wrong for 13 questions, the closing paragraph |

As in Chapter 1, the old Stage 2 was separate problems, not Stage 1's
answers, so Stage 1 stays as it was.

**Solved Examples by type:**
1. recognising an AP (includes a proof that $(a-b)^2$, $a^2+b^2$, $(a+b)^2$
   are in AP);
2. finding a term, and which term;
3. an AP from two conditions;
4. terms from the end, and counting;
5. sums;
6. terms from a formula for the sum;
7. three numbers in AP;
8. word problems.

With the body, the chapter has **31 worked examples**.

**Practice:**

| form | questions | letters |
|---|---|---|
| multiple choice | 13, from the old Sets A to C | a 3, b 3, c 3, d 4 |
| assertion–reason | 4: old B4 recast, and three new | a, b, c, d |
| very short answer | 4 | |
| short answer | 4 | |
| long answer | 3 | |
| case-based | 2 | |

Old items A6 and C4 were dropped: A6 (sum of odd numbers is $n^2$) sits too
near body Set 5.3 Q9, and C4 repeats Stage 1's question type. C5 became
very short answer Q19, and C2 became short answer Q22.

**Give-aways found and fixed:**
- **Stage 1, the odd-numbers item** ("Can $1 + 3 + 5 + \cdots$ ever be
  200?"). Its explanation printed "the sum of the first $n$ of them is
  $n^2$", which is exactly the answer to body Set 5.3 Q9 (that AP has
  $a = 1$, $d = 2$), and the method of Q14. It was replaced with an item of
  the same kind: "Can $2 + 4 + 6 + \cdots$ ever be 200?" (the sum is
  $n(n + 1)$; 182 and 210 lie either side).
- **New Example 15**, while it was being written. Its first numbers gave
  "the 11th year", the same $n$ as body Set 5.2 Q19. It now reaches
  ₹24900, in the 12th year.
- **New Example 5**, while it was being written. Its first numbers printed
  the AP 2, 7, 12, which is body Example 3's. It now uses 7, 12, 17.

`check-no-repeats` reports 5 pairs at or above 50%. Each is the same type
with different numbers, for example 54, 51, 48 summing to 513 against the
body's 24, 21, 18 summing to 78. I also read every value Beyond prints
against the body's exercise answers, and none answers one.

**`ANSWERS.md` written** for:
- Exercise Sets 5.1 to 5.4;
- the running-text questions (why lists (a)–(e) are APs; Reena's 6th, 15th
  and 25th years; the "(Why?)"s in Examples 6, 8 and 10);
- Stage 1;
- all 30 practice questions, with proofs set one statement to a line.

Three items the old log flagged are now answered in full:
- Set 5.1 Q4 (xi) says "not an AP unless $a = 0$ or 1";
- Set 5.3 Q19 gives the reason 25 rows is rejected;
- Set 5.4 Q2 gives both sums, 76 and 20.

### Verified

`check-numbers.mjs` passes **640 claims**.
- It evaluates 190 printed identities.
- It checks 26 chains written in letters as expressions (at two sets of
  values, under the condition a chain is written under).
- It recomputes every term, count and sum from $a$, $d$ and $n$, or finds
  it by search. That covers:
  - every body example's Answer row, a lettered part at a time;
  - every exercise answer in `ANSWERS.md`, part by part, including which
    lists in Set 5.1 Q4 are APs;
  - Stage 1 and all 15 Solved Examples, with their options;
  - every practice answer read back off the key rows.
- Every MCQ has exactly one right option, and it matches the key; every
  AR letter is derived.
- The `ANSWERS.md` key and practice working agree with the page.

**Break tests: 21 of 21 caught.** They cover:
- the body: an identity, an Answer row, a lettered part and a phrase;
- two Beyond answers and a Beyond letter;
- a key letter, a key identity, a key lettered part and a key phrase;
- two options;
- in `ANSWERS.md`: a value, a phrase, the key, a practice lettered part, a
  practice phrase and an AP verdict;
- a letters chain.

The first run missed one: key 22's "20 weeks" passed with 21 because
"(n − 20)" is in the same row. It is now checked as a phrase.

**Faults in the check itself, fixed:**
- a roman-numeral alternation without a group cut parts at "next" and
  "gives";
- the check first read option (d) of Beyond Example 10 as 44 terms of the
  AP, when the remark means 44 terms from 11 to 99. The remark was right.

**Fitting:**
- Nothing is clipped, and nothing runs into the bottom margin.
- `orphans` finds 0, `check-labels` finds no collisions, and `fit-options`
  finds every option row fits.
- I read the proofs of pages 9, 14, 18, 25, 27, 29 and 31.
- In Beyond, `settle.mjs` fails outright, so blocks were moved by hand and
  checked by building.

**Colour:** I read pages 2 and 18 in greyscale and deuteranopia; pages 1,
19 and 20 were also rendered. The figures are single-ink line drawings, and
the logs' fill is not doing any work.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 2 | 85% | the heading of 5.2 must open page 3 with its lists |
| 3 | 81% | the list (a)–(e), a block of working |
| 5 | 72% | Example 2, a panel |
| 15 | 71% | Example 15, a panel |
| 20 | 69% | the last body page (`data-close`) |
| 26 | 67% | Example 14 with its `Type` head |
| 29 | 71% | case-based Q29 and its table |
| 30 | 62% | **the Answers stage, which always opens a page** |
| 32 | 53% | the last page |

### Flagged, not done

- **KaTeX breaks before punctuation.** Body Set 5.3 Q18 prints "$B$" and its
  comma across a line break. This is the stylesheet issue logged
  class-wide.
- **Gauss "in Chapter 1"** is kept, as the earlier log checked.
- **The `.work__why` of body Example 6, Step 3** ("suppose 301 is the $n$th
  term") is five words, one over the two-to-four guide. It carries the
  source's assumption and is kept.

---

Written new from NCERT *Mathematics, Textbook for Class X* (reprint 2026-27),
Chapter 5, *Arithmetic Progressions* (textbook pages 49–72). Original LearnLab
text in NCERT's order of topics, examples and questions; no sentence is
carried over. Crown Quarto, house design, palette `moss`. The source PDF has
no answer key; every answer below was worked here.

Sections: 5.1 Introduction · 5.2 Arithmetic Progressions · 5.3 *n*th Term of
an AP · 5.4 Sum of First *n* Terms of an AP. *Exercise 5.1*–*5.4* are Exercise
Sets 5.1–5.4, the last marked (Optional) with the source's footnote turned
into a sentence before it. The definition of an AP, the *n*th term and the sum
formula are `c-keyidea` blocks. The source's *5.5 Summary* is the chapter
summary, and its *A note to the reader* (the arithmetic mean) is the closing
`c-tip`. 22 chapter pages, 7 Beyond the Book pages.

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted: `check-body-maths` reports no mathematics lost or added, `check-numbers.mjs` passes, 0 stranded openers, every option row fits, no label collisions.

## Figures

All eight come from `fig5.mjs` in the session scratchpad and are drawn from
the source's pictures, not traced.

| figure | note |
|---|---|
| Fig. 5.1 | eight rungs, 45 cm to 31 cm, drawn to scale; bottom and top rungs labelled |
| Fig. 5.2 | unit squares in squares of side 1, 2, 3 |
| Fig. 5.3 | the rabbit pairs as pairs of circles in a tree, 1, 1, 2, 3, 5, 8, with the counts at the left; the source draws rabbits |
| Fig. 5.4 | four semicircles, centres alternately at A and B (0.5 cm apart), radii 0.5–2 cm to scale, a dashed fifth begun; labels l1–l4 |
| Fig. 5.5 | the bottom four rows of logs (20, 19, 18, 17), end on, as in the source; drawing all sixteen rows would give the answer away |
| Fig. 5.6 | bucket and ten potatoes to scale, 5 m then 3 m apart; the source's runner and tree left out |
| Fig. 5.7 | the ladder of Set 5.4 Q3, middle drawn dashed, 45 cm, 25 cm, 25 cm apart and 2½ m marked |
| Fig. 5.8 | 15 steps, rise ¼ m and tread ½ m to scale; the 50 m length drawn short, receding |

## Every answer worked

| where | answers |
|---|---|
| Examples 1–2 | $a = \frac{3}{2}$, $d = -1$ · (i) AP, $d = 6$, next 28, 34 (ii) AP, $d = -2$, next $-7$, $-9$ (iii) not (iv) not |
| Examples 3–10 | 47 · 35th term; 8th term is 0 · 3, 4, 5, 6, 7, … · $n = \frac{151}{3}$, so no · 30 · 25 terms, 11th from last $-32$ · interests 80, 160, 240, …; 30th year ₹2400 · 10 rows |
| 5.4 text | Gauss 5050; Shakila's box ₹12600 |
| Examples 11–16 | $-979$ · $d = 10$, $a_{20} = 200$ · $n = 4$ or 13 · 500500; $\frac{n(n + 1)}{2}$ · 672 · 550, 775, 4375 |
| Set 5.1 Q1 | (i) AP, 15, 23, 31, …, $d = 8$ (ii) not an AP (the air left is 1, $\frac{3}{4}$, $\frac{9}{16}$, … of the start) (iii) AP, 150, 200, 250, …, $d = 50$ (iv) not an AP (10800, 11664, …) |
| Set 5.1 Q2 | (i) 10, 20, 30, 40 (ii) $-2$, $-2$, $-2$, $-2$ (iii) 4, 1, $-2$, $-5$ (iv) $-1$, $-\frac{1}{2}$, 0, $\frac{1}{2}$ (v) $-1.25$, $-1.50$, $-1.75$, $-2.00$ |
| Set 5.1 Q3 | (i) 3, $-2$ (ii) $-5$, 4 (iii) $\frac{1}{3}$, $\frac{4}{3}$ (iv) 0.6, 1.1 |
| Set 5.1 Q4 | (i) no (ii) $\frac{1}{2}$: 4, $\frac{9}{2}$, 5 (iii) $-2$: $-9.2$, $-11.2$, $-13.2$ (iv) 4: 6, 10, 14 (v) $\sqrt{2}$: $3 + 4\sqrt{2}$, $3 + 5\sqrt{2}$, $3 + 6\sqrt{2}$ (vi) no (vii) $-4$: $-16$, $-20$, $-24$ (viii) 0: $-\frac{1}{2}$ three times (ix) no (x) $a$: $5a$, $6a$, $7a$ (xi) no (xii) $\sqrt{2}$: $\sqrt{50}$, $\sqrt{72}$, $\sqrt{98}$ (xiii) no (xiv) no (xv) 24: 97, 121, 145 |
| Set 5.2 | 1 (i) 28 (ii) 2 (iii) 46 (iv) 10 (v) 3.5 · 2 (i) (c) (ii) (b) · 3 (i) 14 (ii) 18, 8 (iii) $6\frac{1}{2}$, 8 (iv) $-2$, 0, 2, 4 (v) 53, 23, 8, $-7$ · 4 16th · 5 (i) 34 (ii) 27 · 6 no ($n - 1 = \frac{161}{3}$) · 7 178 · 8 64 · 9 5th · 10 1 · 11 65th · 12 100 · 13 128 · 14 60 · 15 13 · 16 4, 10, 16, 22, … · 17 158 · 18 $-13$, $-8$, $-3$ · 19 2005 (his 11th year) · 20 10 |
| Set 5.3 Q1–Q3 | 1 (i) 245 (ii) $-180$ (iii) 5505 (iv) $\frac{33}{20}$ · 2 (i) $\frac{2093}{2} = 1046\frac{1}{2}$ (ii) 286 (iii) $-8930$ · 3 (i) $n = 16$, $S_n = 440$ (ii) $d = \frac{7}{3}$, $S_{13} = 273$ (iii) $a = 4$, $S_{12} = 246$ (iv) $d = -1$, $a_{10} = 8$ (v) $a = -\frac{35}{3}$, $a_9 = \frac{85}{3}$ (vi) $n = 5$, $a_n = 34$ (vii) $n = 6$, $d = \frac{54}{5}$ (viii) $n = 7$, $a = -8$ (ix) $d = 6$ (x) $a = 4$ |
| Set 5.3 Q4–Q20 | 4 12 · 5 16 terms, $d = \frac{8}{3}$ · 6 38 terms, 6973 · 7 1661 · 8 5610 · 9 $n^2$ · 10 (i) 525 (ii) $-465$ · 11 $S_1 = 3$, $S_2 = 4$, $a_2 = 1$, $a_3 = -1$, $a_{10} = -15$, $a_n = 5 - 2n$ · 12 4920 · 13 960 · 14 625 · 15 ₹27750 · 16 ₹160, 140, 120, 100, 80, 60, 40 · 17 234 · 18 143 cm · 19 16 rows, 5 logs · 20 370 m |
| Set 5.4 | 1 32nd term ($-3$) · 2 76 or 20 · 3 385 cm · 4 $x = 35$ · 5 750 m³ |

Beyond the Book: Stage 1 — 5, 8, 11; $k = 18$; yes, $a = 8$, $d = 6$; no;
the middle angle is $60^\circ$. Stage 2 — (a), (b), (c), (b), (d).
Set A c c a d b a b b; Set B a b b c c b; Set C b c b d d.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| 5.1 (v): the amounts "in the box" on each birthday were 100, 150, 200, … | the amounts *put in* on each birthday | 5.4 treats them as amounts put in and sums them; the two places disagreed (C3) |
| Set 5.1 Q1 (iii): "the cost of digging a well after every metre of digging" | the cost of digging each metre | read as the running total, 150, 350, 600, … is not an AP; the intended list is the cost of each metre (C4) |
| Example 5: "Solving the pair of linear equations (1) and (2), we get a = 3, d = 1" | subtracting (1) from (2) shown | M2 |
| the Remark $a_n = S_n - S_{n-1}$ in a box of its own | a sentence of running text before Example 11 | one idea in one sentence; the tip is kept for the arithmetic mean |
| *A note to the reader*: $b = \frac{a + c}{2}$ stated | the tip gives the one-step reason, $b - a = c - b$ | M3 |
| the footnote on Exercise 5.4 | a sentence before the set | a footnote on one exercise set has nowhere to sit on a page with no notes |
| "(in Rs)" once in 5.4 | "in rupees" | the chapter's own usage |
| Set 5.2 Q1 "Fill in the blanks in the following table" | "Copy the table and fill in the blanks" | the blanks are printed rules |
| Set 5.1 Q1 and Q4, Set 5.3 Q3 | parts continued in a second block (`li.cont`, `c-parts[data-start]`) | the same numbering; the question can run over a page. `components.css` gained `.c-parts[data-start]` 9–12, since the rules stopped at 8 and (x) printed as (i) |
| a sentence on writing out the first ten terms (Example 3); the four differences of 1, 1, 2, 3, 5; "as many terms of the AP as you like"; "Subtracting each term from the term just after it"; in Beyond the Book a sentence after the formulas, a check of 5, 8, 11 and a check of Problem 5 | added | line-sized fitting edits; each says what the page already shows |
| Beyond the Book Problems 2 and 3 | swapped, and the five solutions shortened | two problems and their solutions did not fit a page, so Stage 2 ran to three half-empty pages |
| expressions such as $a_n = a + (n - 1)d$ in running text | braced so they do not break after an operator | layout |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| Set 5.1 Q4 (xi) | C2 | $a, a^2, a^3, a^4, \ldots$ is an AP when $a = 0$ or $a = 1$; "not an AP" is right only in general | the key should say "not an AP unless $a = 0$ or 1" |
| Set 5.3 Q19 | C5 | $n(41 - n) = 400$ gives $n = 16$ or 25; 25 rows would need a top row of $-4$ logs, and the question does not say why it is rejected | the key should give the reason |
| Set 5.4 Q2 | — | two APs fit (the 3rd and 7th terms are 2 and 4 in either order), so the sum is 76 or 20 | the key should give both |
| 5.1 (vi) and (iii) | — | the rabbits (a Fibonacci list) and the savings scheme (a geometric list) are shown only as patterns that are not APs; neither is named | none |
| Example 6, Example 8, Example 10 | C5 | "(Why?)" is left for the reader, as in the source | none |
| 5.4 | — | Gauss is said to be "in Chapter 1"; Class 10 Chapter 1 does name him (checked) | none |


## 21 September 2026 — figure/table reference review

Reviewed this chapter in the all-maths reference audit. Figures and tables now use one chapter sequence, including Beyond the Book; captions and references were updated together. 1 dependent text/visual group(s) were kept together and the body refitted. Questions, calculations and artwork were preserved. The chapter and its volume were rebuilt; detailed layout checks and any remaining warnings are recorded in build/_all-maths-reference-checks/.
