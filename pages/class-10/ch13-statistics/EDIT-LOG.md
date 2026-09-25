# Class 10 · Mathematics I · Chapter 13 — Statistics

## Solved examples in examination formats, 24 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 16 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-10/ch13-statistics/`.

Source `build/jee-class10.mjs`; check `build/check-jee-class10.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p112; the answers stage still opens a fresh page.

**Body, p007.** The page ran 2.4mm into the foot margin. The female-teachers example now reads "by each of the three methods" and "Education Survey by NCERT" (was "methods of this section", "Survey conducted by NCERT"), which takes back one line. Nothing else changed.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) 15 |
| 2 | Single correct | (b) 4.6 |
| 3 | Single correct | (c) 20–30 |
| 4 | Single correct | (d) 24.4 |
| 5 | Single correct | (a) 26 |
| 6 | Single correct | (b) 20–30 |
| 7 | Multiple correct | (a), (b), (c) |
| 8 | Multiple correct | (a), (b) |
| 9 | Multiple correct | (a), (b), (c) |
| 10 | Multiple correct | (a), (b), (d) |
| 11 | Numerical answer | 24 |
| 12 | Numerical answer | 5 |
| 13 | Numerical answer | 25.8 |
| 14 | Matching | (a) P–3, Q–4, R–2, S–1 |
| 15 | Matching | (b) P–3, Q–4, R–1, S–2 |


## Brought to the Class 7 standard, 17 September 2026

Phase 4 of `PLAN-MATHS-CONSISTENCY.md`, worked from the Class 10 Chapter 1
model. Page move, examples, Beyond the Book and answers were done in one
pass, and every check was run on the chapter.

**Pages: 29 before (21 body + 8 Beyond, Crown Quarto), 36 after (20 body +
16 Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`. The body was
refitted once, then placed by hand (below). `p021.html` is gone.

**All eight body examples set as steps.** Each was a question-only panel
with its working in the running text after it. That working moved into the
panel as *Solution*, Steps and *Answer*.
- **Working tables stay with their example.** Tables 13.1, 13.6, 13.7,
  13.8 and 13.16, Example 4's frequency table and Example 8's cumulative
  frequency tables now sit inside their panels, after the work rows. Each
  step names the table it reads.
- **Table 13.16 is set as rows** (classes across, frequency and
  cumulative frequency down). The column form made Example 7 too tall.
- **Table 13.7's first head** reads *Female teachers (%)*, as Table 13.6
  already did, so the table fits inside the panel.
- **Chains were split** only where a row would wrap: Example 5's formula
  and its values are two rows.
- **Words dropped:** *Putting these values into the formula* and *Let us use
  this formula in some examples* (the second at a page join, to pull
  Example 5 onto page 11). Example 5's Step 1 was shortened to one line.

**Verified** by `build/check-body-maths.mjs`: 241 expressions and 1,326
numbers compared, with none lost and none added. The only gains are numbers
restated in Answer rows and in the reprinted table.

**A question and its table.**
- **Example 6** names Table 13.3, eight pages back. The table is reprinted
  inside the panel as *Table 13.3 (repeated from Section 13.2, for
  Example 6)*. It is set as rows, with a Total column.
- **Activity 1** said *the data in Table 13.3*, which is overleaf from it.
  It now says *Table 13.4*, which is on the same page and holds the same
  classes, frequencies and class marks. This is the smallest fix, since a
  reprint would not fit on that page.
- **Stage 1's first question** names Table 13.3 too. The same reprint sits
  inside its `.c-try`, captioned *for this question*.
- Every other table reference prints on its page or facing it:
  *From Table 13.11* and *Use the table* (Table 13.12) are on pages 14–15,
  and practice Q11's *Question 10* is on the same page.

**Hand placement after the refit.**
- `unsettle` pulled Example 5 onto page 11 and a run of blocks forward
  through page 16.
- `settle` moved *Now try these ideas* and Activity 2's lead onto page 9,
  so the activity is no longer cut from its task list.
- `settle` could not move a Beyond block (the known failure), so practice
  Q30 was moved by hand to page 34. This keeps Q31 from sitting alone
  before the Answers.
- The moves left some blocks with odd indentation in the source. The
  markup is balanced, and the build's tag check is clean.

**Beyond the Book rebuilt to the four stages:**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, each explained in running text | **kept word for word**; `.c-stage__for` removed; Table 13.3 reprinted in the first question |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems | **16 stepped examples** under eight `Type` heads; the 5 old problems are Examples 1, 5, 8, 11 and 12, options kept, *Answer* gives the letter |
| 3 Problem Sets → **Practice** | 3 sets, 19 questions | **one run of 31**: 14 multiple choice, 4 assertion–reason, 4 very short, 4 short, 3 long, 2 case-based |
| 4 Answers & Takeaways → **Answers** | key and why for 8 | key (a 3, b 4, c 4, d 3 in the MCQs; a b c d once each in AR), every other answer, why the options are wrong for 10, the closing paragraph |

**Types:** class marks and class size (including closing the gaps between
classes); the direct and assumed mean methods; the step-deviation method;
a missing frequency from the mean; the mode (including a modal class with
nothing before it); cumulative frequency, less than and more than; the
median (including two missing frequencies); the three measures together
(the empirical relationship, and a board-style mean, median and mode of one
table). **Worked examples in the chapter: 24** (8 body + 16 Beyond).

**Practice reused from the old sets:** A2–A8, B1–B6, C1, C3 and C4, the
last recast as assertion–reason in the Class 7 form. A1's class 25 – 40
became 35 – 50, since the body prints 32.5 as a class mark.
- **Dropped: old C2** (*x* and *y* from a median). It was the third
  question of that one kind after body Example 8 and Exercise Set 13.3 Q2.
  Beyond now has the kind once as Example 14 and once as practice Q29.
- **Dropped: old C5.** It sent the reader back to *Example 3 of the
  chapter*, 22 pages away.

**No give-aways.** Every value Beyond prints was read against the body's
exercise answers:
- New Example 7 first had $k = 20$, the answer to Exercise Set 13.1 Q3. Its
  mean was changed so that $k = 5$.
- Nothing else matches a body answer.
- `check-no-repeats` reports two pairs above 50%: practice Q29 and Q27
  against Set 13.3 Q2. Both are only the same table head
  (0 – 10 … 50 – 60) with different data and questions.

**`ANSWERS.md` written** for:
- Exercise Sets 13.1–13.3, with the working for each: the Σ terms, $a$ and
  $h$, the modal or median class and its values;
- the two questions in the running text (*why the means differ*, and
  *Why?* in Section 13.4);
- Activity 1 (two choices of $a$ worked, and why $a$ cancels);
- Activities 2 and 3 (*answers will vary*, with one worked instance: 30
  heights, mean 153 cm, mode 152.86 cm);
- Stage 1, and all 31 practice questions.

### Verified

`check-numbers.mjs` passes **543 claims**, including 172 printed identities.
A side printed to *d* places is checked as a rounding to *d* places. Every
distribution is **read from the table cells on the page**, never retyped.

What it checks in the body:
- **Working tables:** Table 13.1's products and totals; Table 13.2 as a
  regrouping of Example 1; Tables 13.3–13.8 column by column, totals
  included; both reprints of Table 13.3 against the original.
- **Cumulative frequencies:** Tables 13.9–13.11 and 13.13–13.15; Table
  13.16 against Example 7's less than table; Example 8's symbolic
  cumulative row, evaluated at the $x$ and $y$ found.
- **Example answers:** each Answer row is recomputed. Example 4's
  frequency table is recounted from the listed wickets. Example 8's $x$
  and $y$ come from a search, which confirms that the answer is unique.
- **Exercise answers:** every mean, median and mode in `ANSWERS.md` is
  recomputed from its question's table, as are the solved frequencies
  ($f$; $x$, $y$). The Σ term lists in the working are checked against
  the page's table with the stated $a$ and $h$.
- **Special classes:** Set 13.3 Q3 uses a first class of 18 – 20, from the
  question's *aged 18 years or more*. Q4 uses the closed classes that its
  hint prints.

What it checks in Beyond:
- **Stage 1:** each question is re-derived from its own table or list.
- **Solved Examples:** each is recomputed, and each option example's wrong
  options are checked against the explanation given for them.
- **Multiple choice:** each question has exactly one right option, worked
  from the data in its own stem, and it matches the key. The four
  assertion–reason letters are derived.
- **Answer rows:** read a lettered part at a time, as phrases
  (*30 plants*, *only Meera*).
- **Why rows:** the values they print are checked.
- **`ANSWERS.md`:** its key is compared with the page's key, and its
  practice working is read back row by row.

**Break tests: 22 of 22 caught**, on a copy in the scratch folder:
- Body: a Table 13.7 cell, Example 5 and Example 2 answers (a rounding),
  a Table 13.16 cumulative frequency, an exercise table's frequency, a
  Table 13.13 cell, and Table 13.4's total.
- Beyond: Example 6's answer, Stage 1's median, and an Example 13 table
  cell.
- Key and options: a key letter, key row 27, lettered parts 30 (a),
  30 (c) and 31 (a), option Q10 (b), and Q3's stem data.
- `ANSWERS.md`: a median, the key, practice working 30 (b), a Σ term list,
  and a mean's rounding.

The first run found faults in the check itself, all fixed:
- the refit writes mixed line ends;
- settle and unsettle re-indent blocks, so blocks are now cut by counting
  `div`s;
- a whole-number option passed as a *rounding* of 35.33;
- *8.5.* at a sentence end read as NaN.

**Found and fixed in the numbers:** none printed on the pages. The old log's
*mean 35.37 years* for Set 13.2 Q1 is 35.375, which rounds to 35.38; that
is what `ANSWERS.md` prints. Example 3's first why, *20 divides every
$d_i$*, was wrong ($-75$ is not a multiple of 20). It was replaced before
the build.

**Fitting:**
- Nothing is clipped. Pages 7, 13 and 35 run 0.8, 1.1 and 1.3 mm into the
  bottom margin. Example 2's panel is 232 mm, a whole text block.
- `orphans` finds 0 stranded openers, `check-labels` finds no collisions,
  and every table is inside the 160 mm measure (checked by rendering).
- `fit-options` narrowed Beyond Example 1's options to two columns.
- Proofs read: pages 2, 5, 7, 11, 12, 17, 21, 23, 31 and 35.
- **Colour:** pages 1, 21 and 35 were read in greyscale and in the
  deuteranopia simulation. The opener's histogram is lines only.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 1 | 72% | the opener; Example 1 (208 mm) cannot join it |
| 5 | 78% | the mean key idea, a panel, 7 mm short |
| 6 | 49% | Example 2, a panel as tall as the text block |
| 8 | 80% | Activity 2's lead, kept with its list |
| 16 | 56% | Example 7, a panel (157 mm) |
| 17 | 68% | Example 8, a panel (187 mm) |
| 19 | 83% | Exercise Set 13.3 Q4, with two tables |
| 20 | 98% | the last body page (`data-close`) |
| 22–29 | 71–82% | Solved Examples: two tall stepped panels a page, and `Type` heads kept with their examples |
| 33 | 69% | practice Q30, a case-based question moved to keep Q31 company |
| 34 | 51% | **the Answers stage, which always opens a page** |
| 36 | 70% | the last page |

### Flagged, not done

- **Example 3 and the Remark before it.** The Remark says to take $h$ as a
  number that divides every $d_i$. Example 3 then takes $h = 20$, although
  $d_i = -75$ gives $u_i = -3.75$. This is NCERT's own inconsistency (C3),
  and it is kept.
- **Set 13.2 Q5:** the frequencies add up to 49, as in NCERT. The question
  does not state a total, so nothing contradicts it.
- **The data source** in Example 2 is NCERT's; nothing else in the chapter
  is a fact needing a source.

Written new from NCERT *Mathematics, Textbook for Class X* (reprint 2026-27),
Chapter 13, *Statistics* (textbook pages 171–201). Original LearnLab text in
NCERT's order of topics, examples, activities and questions; no sentence is
carried over. Crown Quarto, house design, palette `ember`. The source PDF has
no answer key; every answer below was worked here.

Sections: 13.1 Introduction · 13.2 Mean of Grouped Data · 13.3 Mode of Grouped
Data · 13.4 Median of Grouped Data. *Exercise 13.1*, *13.2* and *13.3* are
Exercise Sets 13.1–13.3. Each section's formula is a `c-keyidea`; working is
`.work--list` rows and displayed `.eq` lines. The source's *13.5 Summary* and
its *Note to the Reader* are the chapter summary.

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted: `check-body-maths` reports no mathematics lost or added, `check-numbers.mjs` passes, 0 stranded openers, every option row fits, no label collisions.

## Tables, not figures

The chapter has no figures; the opener carries a five-bar histogram sketch.
Its 16 numbered tables and every data table in the questions use the new
`table--data` modifier (see CROSS-CHAPTER.md). The source prints most
distributions as rows and most working as columns; here a table is set in
whichever direction fits the 140mm measure.

| table | here |
|---|---|
| Example 1 data (13 marks) | two row tables inside the panel |
| Tables 13.9, 13.11, 13.13, 13.14 | turned into rows; 13.13 and 13.14 drop the running sums (5 + 3 = 8, 53 − 5 = 48), which the prose beside them gives |
| Tables 13.10, 13.12, 13.15 and the Example 8 working table | turned into rows and split into two tables, the caption on the first |
| Tables 13.4, 13.8 | column heads *Number of students (f_i)*, *Class mark (x_i)*, *Number of bowlers (f_i)* shortened to $f_i$ and $x_i$, as in the source's Table 13.5 |
| Set 13.1 Q7; Set 13.2 Q3, Q5; Set 13.3 Q1, Q4, Q5 | split into two row tables |
| Example 7, Set 13.3 Q3 | *Less than 140 …* and *Below 20 …* as a row headed *Height less than* / *Age below* |
| row names | *Percentage of female teachers* → *Female teachers (%)*; *Number of States/U.T.* → *States/U.T.*; *Number of wickets / bowlers* → *Wickets / Bowlers*; *Daily pocket allowance* → *Pocket money*; *Number of heartbeats per minute* → *Heartbeats*; *Number of cars* → *Cars*. Each question's stem still says what is counted |

## Every answer worked

| where | answers |
|---|---|
| Examples 1–3 | 59.3 exact, 62 from the grouped data by all three methods; 39.71; 152.89. The source's values are correct |
| Examples 4–6 | mode 2; 3.286; 52 |
| Section 13.4, Examples 7–8 | median 28.5 (ungrouped); 66.4 (66.43); 149.03 cm; ${x = 9}$, ${y = 15}$ |
| Set 13.1 | 1 8.1 plants (direct method: small numbers) · 2 ₹545.20 · 3 ${f = 20}$ · 4 75.9 · 5 57.19 mangoes · 6 ₹211 · 7 0.099 ppm · 8 12.48 days · 9 69.43% |
| Set 13.2 | 1 mode 36.82 years, mean 35.37 years · 2 65.625 hours · 3 mode ₹1847.83, mean ₹2662.50 · 4 mode 30.6, mean 29.2 · 5 4608.7 runs · 6 44.7 cars |
| Set 13.3 | 1 median 137, mean 137.06, mode 135.77 units · 2 ${x = 8}$, ${y = 7}$ · 3 35.76 years · 4 146.75 mm · 5 3406.98 hours · 6 median 8.05, mean 8.32, mode 7.88 letters · 7 56.67 kg |

Beyond the Book: Stage 1 — 72 and 124; ${p = 5}$, ${q = 3}$; mode about 36; median class 20 – 30, median 23.85; mean ₹888.57, median ₹540. Stage 2 — (c), (a), (b), (c), (b).
Set A b c d c a b a d; Set B c a b d b c; Set C c b b a d.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| 13.1: "how to draw cumulative frequency curves, called ogives"; Note to the Reader: "Same condition also apply for construction of an ogive …" | not promised; the note keeps only the sentence on continuous classes | the ogive section is not in this edition |
| "numerical representatives … also called measures of central tendency, namely …" | "three numbers that each describe the centre of a set of ungrouped data … called measures of central tendency" | L1, L6 |
| "devise some method", "compute", "tedious and time consuming" | "find a way", "work out", "takes a long time" | L1 |
| "Substituting the values … from Table 14.5" | Table 13.5 | typing |
| the three methods' notes as bullets | a key idea with the three formulas, one paragraph and a tip | structure |
| Example 2 "Source : Seventh All India School Education Survey conducted by NCERT" under the table | a sentence in brackets in the question | the panel has no source line |
| Example 6: "given in Table 13.3 of Example 1" | "Table 13.3" | Table 13.3 is not part of Example 1 |
| Example 6: "the maximum number of students obtained 52 marks" | "more students got about 52 marks than any other mark" | C4, flagged below |
| "3 Median = Mode + 2 Mean", "There is a empirical relationship" | "related, roughly, by the empirical relationship … It was found from data, not proved." with the formula inline | M3; inline for fitting |
| Summary 3: "adding the frequencies of all the classes preceding the given class" | "the sum of its own frequency and the frequencies of all the classes before it" | C3, flagged below |
| Summary: formulas "where symbols have their usual meanings" | "with the symbols as in Section 13.3 / 13.4" | C1 |
| Set 13.1 Q3: "daily pocket allowance … Rs 18" | "daily pocket money … ₹18" | L1; one currency sign |
| Set 13.3 Q6: "the number of letters in the English alphabets in the surnames"; "Find the mean number of letters in the surnames?" | "the number of letters in each was counted"; a statement | L3 |
| Activity 2's three tasks as a numbered list | roman parts | the book's parts style |
| line-sized additions: after the step-deviation method (same answer, smaller numbers); the common factor 15 in Table 13.4; the tip's last sentence; Beyond the Book stage 1 (one peak; either table gives the median) | added | fitting |
| "which measure suits": "When all the classes have about the same frequency, the mean represents the data well"; "It also enables us to compare two or more distributions. For example, by comparing …" | the first dropped; the second shortened into the sentence before | fitting: the chapter was closing on a page holding only the summary |
| Problem 1 and 2 option notes in Beyond the Book | one line each | fitting |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| Summary 3 | C3 | the definition leaves out the class's own frequency; the text itself gives the cumulative frequency of 10 – 20 as ${5 + 3}$ | fixed here as above |
| Section 13.4, "which measure" | C6 | "if one class has frequency, say 2, and the five others have frequency 20, 25, 20, 21, 18, then the mean will certainly not reflect the way the data behaves" — a small frequency does not by itself distort the mean; an extreme observation does | an example with an extreme value, as in Beyond the Book stage 1 |
| Example 6 | C4 | "the maximum number of students obtained 52 marks": a grouped mode is an estimate inside the modal class, and no student need have got 52 | rephrased here |
| Set 13.1 Q5 | C4 | the classes 50 – 52, 53 – 55, … have gaps; the mean is unaffected, but the summary tells the reader to make classes continuous first | classes 49.5 – 52.5, … or a note that the mean does not need it |
| Set 13.3 Q3 | C4 | "Below 20" with policies only from age 18 makes a first class 18 – 20, two years wide beside classes five years wide; the median is not affected | none needed for the answer |
| 13.1 and Note to the Reader | C3 | promise and describe ogives, which the chapter does not teach | dropped here |
| Example 3 | M5 | "the mean number of wickets … in one-day cricket is 152.89" reads as wickets per match | "wickets in their one-day careers" |


## 21 September 2026 — figure/table reference review

Reviewed this chapter in the all-maths reference audit. Figures and tables now use one chapter sequence, including Beyond the Book; captions and references were updated together. Questions, calculations and artwork were preserved. The chapter and its volume were rebuilt; detailed layout checks and any remaining warnings are recorded in build/_all-maths-reference-checks/.
