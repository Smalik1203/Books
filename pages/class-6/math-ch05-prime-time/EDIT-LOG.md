# Class 6 · Mathematics I · Chapter 5 — Prime Time

## The maths-v2 conversion, 26 September 2026

**This supersedes every description of Beyond the Book, its examples, its
practice and its key further down this log.** Converted to CONVERT-V2.md,
with Class 6 Chapter 1 as the model. `chapter.json` now reads `maths-v2`,
palette `prism`, edition `196x276-large`, `keepExerciseSets`, accent
`#1e4e8c`. 36 pages:

* **Body p001–p021**: NCERT's six sections in NCERT's order (20 pages),
  ending on a **Summary** page (p021, `data-close`, nine points, key terms
  in bold, following NCERT's summary).
* **By the Book p090–p094**, five pages, 50 questions written to
  BY-THE-BOOK.md at Class 6: very short 10, short 10, long 10, assertion
  and reason 5 (key a, b, d, c, a), case-based 5, objective 10 (key
  c, a, a, d, b, c, c, d, b, d; one multi-statement item, one named
  student's claim, one table item). Several reuse the old practice set's
  board-form questions (co-prime 105/88, 980, 2016, the chairs and stools,
  the three bells, Anshu's 4-and-6 claim, the 1–100 multiples count and
  the 7248 and 35/48 assertion–reason pairs), recast as single modelled
  problems; the rest are new. None copies a body exercise.
* **Beyond the Book p101–p110**: the tried-and-explained questions with no
  head, then Single correct · More than one correct · Numerical answer ·
  Matching · Paragraph-based, each two solved examples then practice
  (4 · 4 · 3 · 2 · 2). Answers opens p109 with no stage numeral: By the
  Book's key, then Beyond's.

### The body

* **Key ideas.** Three that had two paragraphs (common factors, prime and
  composite, prime factorisation) are now `c-keyidea__points` of two
  points, as the model sets them. Two added, so every section has one:
  5.5 *Divisibility tests* (the tests for 10, 5, 2, 4 and 8, after the
  Think and Reflects that ask the reader to find them) and 5.6 *Numbers
  and puzzles*. Every section already had a Think and Reflect.
* **Plain English and fitting.** The larger edition put two pages at 31%
  and 58% in front of Exercise Sets 5.2 and 5.3, which `keepExerciseSets`
  holds whole, and set 5.2 no longer fitted one page. Both were closed by
  tightening prose at the join, not by cutting anything NCERT asks: the
  idli-vada rules and figure note, the Jump Jackpot set-up, "Take care not
  to mix up…", the figs set-up, the sieve steps 3–4 (the example multiples
  after "cross out every multiple of 3/5" dropped), the Sieve paragraph
  (the "a sieve keeps some things" gloss and the 2200 years dropped),
  "Primes through the ages" (two paragraphs made one), the 5.4 product
  paragraphs, the 75/21 and 42/12 paragraphs, the divisibility-by-4
  explorations and the 5.6 paragraphs. "neat way" became "quick way", and
  "It is not magic" (C8) and "like building blocks" (simile) went.
  Example 5's first two steps are now one row (both factorisations).
* **Exercise wording shortened, questions unchanged**: 5.2 Q2 (Who am I?),
  Q3 (perfect number), Q6, Q7, Q8, Q9 ("Is 40 the first of them?"), Q10
  and Q11 ("the smallest multiple of every number from 1 to 10"); 5.3 Q11
  ("3-digit primes … using each of 2, 4 and 5 once"); 5.4 Q2; 5.5 Q1 and
  Q3. No NCERT question was cut.
* **Figures**: Fig. 5.4 lg → md, Fig. 5.6 xl → lg, Fig. 5.12 xl → lg (the
  class and `data-size`; viewBoxes unchanged, so their strokes print a
  little finer). `check-labels` finds no collisions.

### By the Book and Beyond

* **Tried questions** kept word for word except one sentence: the 6-and-8
  idli-vada explanation ended "This happened because 6 and 8 are not
  co-prime: they share the factor 2", which answers the body's Think and
  Reflect on when the first common multiple is the product (§6a: the
  rule wins). It was deleted. The stage head went, as in the model.
* **Examples.** From the old fifteen, kept and reworded: old 3 (exactly
  three factors), old 7 (co-prime pairs), old 11 (factors of 72, now by
  factor pairs, not by counting choices of primes), old 12 (remainder 1 on
  4, 6 and 9, now by listing multiples of 9), old 14 (matching; "greatest
  common factor" and "least common multiple" became "largest common
  factor" and "first common multiple", the chapter's words) and old 15
  (matching). Dropped: old 1, 5 and 13, which lean on the least common
  multiple or on *co-prime numbers have their product as first common
  multiple* (the answer to a body Think and Reflect, see 17 September);
  old 2 and 10 (greatest common factor, LCM); old 4 (the test for 9, not
  taught here); old 6 ("the only even prime is 2", the answer to Exercise
  Set 5.3 Q1); old 8 and 9 (digit-sum test; statements). New: Example 2
  (the smallest number to add to 1234 for 8), Example 4 (factors of
  $2 \times 3 \times 3 \times 5$), and two paragraph-based examples (a 2 by
  2 prime puzzle; two flashing lights). All fifteen practice questions are
  new.
* Formats are named once by the part head; no "Choose one correct option"
  lines, no format on the tab.

### Checks at close

* `build.mjs`: all 36 pages fit; every page 88% or more except the Summary
  (77%, `data-close`) and By the Book's last page (74%, `data-close`).
  Pages 5, 9, 24 and 29 are at 88–89%.
* `lone-words`: 0. `check-sums`: 141 identities, 0 wrong. `orphans`: 0
  stranded in 36 pages. `check-labels`: no labels collide. `fit-options`:
  every option row fits.
* **`check-numbers.mjs` was rewritten** for this layout (the old 708-line
  script is in git history; it also solved the body's prime puzzles A–D
  from their SVGs, which the new one does not): 430 checks, 0 failed. It
  recomputes every By the Book objective and assertion–reason answer,
  every Beyond single, multiple-correct and matching answer, every
  example's Answer row (the 2 by 2 puzzle is solved by search and has one
  solution), and every number in both keys. Planted errors (a key letter,
  a numerical key, a key value in a case answer, a shelf digit, a row
  value) were all caught.
* Fitting: `refit` body (twice, the Summary held aside so it keeps a page
  of its own), `refit` board, `refit` bridge (twice), judged on the real
  build; the scratch builds reported overruns the real build does not.

### Flagged

| where | what | what it needs |
|---|---|---|
| body 5.6 | "Here is one way to begin puzzle A" still gives the first two moves of Think and Reflect puzzle A (kept from before) | Decide whether a worked start is wanted there |
| p006 | the source of "about 6500 pages" for the largest known prime is not recorded | A source |
| Figs 5.4, 5.6, 5.12 | set one step smaller than their viewBoxes were drawn for | Redraw at the new step if the finer strokes read too light in proof |

## Solved examples in examination formats, 20 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 15 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-6/math-ch05-prime-time/`.

Source `build/jee-class6.mjs`; check `build/check-jee-class6.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p111; the answers stage still opens a fresh page.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (c) 10:12 |
| 2 | Single correct | (a) 5 |
| 3 | Single correct | (b) 25 |
| 4 | Single correct | (d) 7 |
| 5 | Single correct | (b) 420 |
| 6 | Single correct | (a) 74 |
| 7 | Multiple correct | (a), (c) |
| 8 | Multiple correct | (a), (b), (c) |
| 9 | Multiple correct | (a), (c), (d) |
| 10 | Multiple correct | (a), (c), (d) |
| 11 | Numerical answer | 12 |
| 12 | Numerical answer | 37 |
| 13 | Numerical answer | 936 |
| 14 | Matching | (d) P–3, Q–2, R–4, S–1 |
| 15 | Matching | (b) P–2, Q–4, R–1, S–3 |


## Syllabus audit fixes, 17 September 2026

The Beyond the Book syllabus audit made five findings about this chapter. All five were checked against the pages and fixed. The body and Stage 1 were not touched.

**Pages: 32 before (21 body + 11 Beyond), 33 after (21 body + 12 Beyond).**

| finding | what was done |
|---|---|
| borderline: Beyond Ex 1 finds the smallest common multiple of 4, 6 and 10 by taking *the most of each prime*, which the body never teaches | Reworked to list the multiples of 10, the largest number: 10, 20, 30, 40, 50, 60. 10, 30 and 50 are not multiples of 4, and 20 and 40 are not multiples of 6, so the answer is **60**. It is the same question with the same answer |
| borderline: Beyond Ex 14 step 1, Practice Q16 and its answer lean on *co-prime numbers have their product as first common multiple* | Confirmed, and it went further than the audit said. `ANSWERS.md` gives this fact as the answer to the body's Think and Reflect after Example 1, and the body leaves the question open. So the fact is **not** stated. Instead three items were changed. **Ex 14** now uses only the tests for 5 and 8: a multiple of 8 is even, so it must end in 0; $999 = 8 \times 124 + 7$, so 9992 is the largest 4-digit multiple of 8; counting down in 8s gives 9960. The answer is unchanged. **Q16** was replaced by another assertion–reason question with the same key **(a)**: *A: 221 is a composite number. R: $221 = 13 \times 17$.* Its *why* note was rewritten. **Q29(d)**, whose answer leaned on the same fact, now lists the multiples of 8 until one ends in 0 or 5 (8, 16, 24, 32, 40) and then counts on 80, 120 |
| borderline: Practice Q31, the three bells, is a smallest-common-multiple word problem | Kept, but (a) now asks for the multiples of 12, the longest gap, to be listed up to 60. (b) now asks which of them are also multiples of 6 and of 8, which gives 24 minutes. Parts (c) and (d) and their answers are unchanged |
| borderline: Practice Q30(c) asks for the largest row length, a largest-common-factor problem | (c) and (d) were replaced. (c) now asks, for rows of 14, how many rows of chairs and of stools there are: **6 and 9**. (d) asks whether the rows can hold 4 seats each: **no**, because 126 has only one 2 in its prime factorisation. (b), all possible row lengths, stays |
| gap: the prime puzzles (§5.6) | **New Ex 15** under a new head, *Type 6 · Prime puzzles*, with a new **Fig. 5.14**. It is a 3 by 3 grid with row products 30, 28 and 99 and column products 42, 18 and 110. The solution is 2, 3, 5 / 7, 2, 2 / 3, 3, 11, and it is the only one. The figure copies the left half of Fig. 5.12 (`dg-thin`, `dg-fill-b-soft`, `dg-tick`) at the same scale, as a 211-unit viewBox in `c-figure--sm`. The grid is none of the body's puzzles A–D |

**Renumbering.** No existing example moved, because Ex 15 comes last. Beyond now has **15 examples**, where it had 14, under 6 Type heads. The count in `ANSWERS.md` was updated, along with its answers to Q29(d), Q30(c), Q30(d), Q31(a) and Q31(b), and a note for AR 16.

**`check-numbers.mjs`.**

- Ex 1 is now read step by step from the page. There is a check that *most of each prime* is gone.
- Ex 14 is re-derived from its steps: the largest 4-digit multiple of 8, and the count down to the first one ending in 0.
- One check confirms that no Beyond item uses *co-prime, so … first common multiple*.
- For Ex 15, Fig. 5.14 is read from its SVG, solved by search, and found to have exactly one solution. Each step is checked against it, and the puzzle is confirmed not to be one of the body's.
- AR 16 is now graded on the new A and R, and its note is checked number by number.
- Q29(d), Q30(c), Q30(d), Q31(a) and Q31(b) are checked one part at a time.
- The new `ANSWERS.md` values are checked.

The script passes 435 checks and reports all clear. 17 values were broken on purpose in a scratch copy, and all 17 were caught. The first break of Fig. 5.14 crashed the script instead of reporting, so it was fixed to report and run again.

**Fitting.**

- `refit … bridge` was run once and gave 12 pages. Answers opens p111.
- p107 (page 28) holds only the Type 6 head and Ex 15, and is **60% full**. Practice is kept whole, so it starts on p108.
- p112 is the chapter's last page, at 12%. It holds the AR 16 note and the closing paragraph, as the old p111 did.

**Checks.**

- The build fits all 33 pages.
- orphans: 0.
- fit-options: clean.
- check-labels: clean.
- check-colour on page 28: 2.1% ink-dark, 0.4% mid band.
- `data-bridge` is on p101–p112.
- check-no-repeats reports one older pair at 60%, which is not new: Beyond Ex 9 ($84 \times 50$) against Exercise Set 5.4 Q4. The wording is the same, but the numbers differ.

## Brought to the Class 7 standard, 16 September 2026

Phase 1 of `PLAN-MATHS-CONSISTENCY.md`, worked by hand as the model for the
other nine Class 6 chapters. The chapter was read whole before anything was
changed, and every check below was run on the chapter, not on a page.

**Pages: 28 before (20 body + 8 Beyond), 32 after (21 body + 11 Beyond).**
The four extra pages are the cost of stepped examples and of a practice
stage that now runs to 31 questions in six forms. Beyond the Book is 11
pages, inside §6a's "ten or so".

### What changed

**A palette of its own.** `chapter.json` gains `"palette": "olive"`. Class 6
declared none, so its three working colours were the book's throughout; §11
item 1 and the plan's phase 1 move it to a palette per chapter, as Classes
7–10 have. The palette is chosen to match the chapter's own accent slot:
`palette-olive.css` sets `--teal: #564a02`, which is byte-identical to
`CHAPTER_ACCENTS[5]` in `build/build.mjs`. So the furniture accent and the
structure colour are the same colour rather than two, no stylesheet changed,
and the accent list's interleaving still keeps consecutive chapters about
140 degrees apart. **The rest of `maths-clear` is untouched** — ragged-right
setting, no hyphenation, and the outline tip disc all survive, checked on a
proof.

**All five body examples set as steps.** *Solution*, a step to a
`.work__row`, an *Answer* row, the reason in two to four words in a
`.work__why`. Layout only: no number, no question, no order, none of
NCERT's structure. Three sentences that were conclusions became a step row
or a reason — Example 1's two *so they are (not) co-prime* lines, and
Example 5's *we can multiply in any order*.

**Verified,** by a script that pulls every number and every maths span out
of each `.c-example` at `HEAD` and after the change and compares them.
Nothing was lost in any of the five. One example gains two mentions: the new
*Answer* row in Example 1 names 15, 39, 4 and 9 again, which the original
had no line for. That is the only direction the check tolerates, and it
reports the gains so they can be read.

**Beyond the Book rebuilt to the four current stages** (§6a):

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, explained in running text | **kept word for word**; only `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems solved in prose | **14 stepped examples**, Examples 1–14, under five `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, A/B/C | **one numbered run of 31**, all six forms, band carrying the numeral |
| 4 Answers & Takeaways → **Answers** | key plus why the options are wrong | same, renamed; `.c-stage__for` removed |

Nineteen worked examples in the chapter now (5 body + 14), against §5a's bar
of twelve. Every topic the chapter teaches is worked under a type: common
multiples and factors, primes and composites, prime factorisation,
co-primes, divisibility tests.

**Nothing repeats the body.** Checked by script, question against question,
not by eye. One repeat was found and removed: a practice question read *In
Jump Jackpot, Grumpy puts the treasures on 45 and 75 … which jump sizes land
on both?*, which is Exercise 5.2 Q7 with new numbers. It was replaced by one
that runs the idea backwards — the common factors are given and the second
treasure has to be found. The seven pairs that remain above 50% similarity
are all *same type, different instance*, which is what a Solved Example and
a practice question are for.

**`ANSWERS.md` written** for every question the chapter sets: the six
exercise sets, every Think and Reflect, and Beyond the Book's practice, with
the working, what a drawing must show, and a worked instance under each
*answers will vary*.

### Verified

`check-numbers.mjs` is kept beside the pages and re-derives **386 claims**
from first principles — trial division, divisor lists, common multiples —
and compares them with what is printed. It has three parts: every arithmetic
identity read off the pages and evaluated (144 of them); the claims
arithmetic cannot check, such as whether a factor is prime or a list of
factors complete; and every multiple-choice and assertion–reason question,
checked to have exactly one right option that matches the printed key. Part
D does the same for `ANSWERS.md`.

Two spans are not arithmetic and are skipped, both on p010, both containing
the chapter's own `???` placeholder. The script names them rather than
dropping them silently.

**Three wrong numbers were caught and fixed**, which is what the script is
for:

| where | printed | should be |
|---|---|---|
| Beyond, answer to Q27 | factors of 252 above 10 listed without **42** | 12, 14, 18, 21, 28, 36, **42**, 63, 84, 126, 252 |
| the script itself | `73□4` read as `7000 + 100d + 4` | the digit is in the tens place: `7304 + 10d` |
| the script itself | Q27's expected list typed by hand, so it drifted the moment the page was corrected | the answer rows are now read back **out of the page** |

The script was then tested against injected errors rather than trusted:
changing `40 × 249 = 9960` to 9860, changing question 30's largest row
length from 42 to 21, changing 29(a) from 20 to 13, changing 31(b) from 24
minutes to 12, and changing an `ANSWERS.md` value — each was caught. A
whole-row check was **not** enough for a lettered answer (the 42 in part (b)
masked the wrong 42 in part (c)), so each part is now read out on its own.

**The prime puzzles are solved by the script**, and the chapter's claim that
*each puzzle has only one solution* is verified for all four, and for the
worked one on Fig. 5.12.

**Fitting.** Nothing is clipped. Page 29 runs 2.6 mm into the bottom margin,
inside §5a's 3 mm. Ten short pages, each held by a block that cannot move —
see below. `orphans`: 0 stranded openers in 32 pages. `check-labels`: no
collisions. `fit-options`: every option row fits.

**Colour.** Read in greyscale and under simulated deuteranopia, protanopia
and tritanopia. Nothing depends on hue alone: the two panels are told apart
by their labels and their shape, every term chip is also bold, and the
worked-example tab carries its word. Olive and the palette's action blue
stay distinct under all three simulations.

### Short pages, logged

`gaps` names the block holding each one open. None can be closed by the
packer, and §11 forbids closing the exercise-set ones by splitting the set.

| page | fill | held by |
|---|---|---|
| 12 | 75% | next page opens with a `.c-example` — a panel, never divided |
| 16 | 86% | a `.c-reflect` panel |
| 17 | 60% | an exercise band; `keepExerciseSets` holds the set whole (§11) |
| 20 | 48% | the `.c-summary`, indivisible by design |
| 24, 25 | 82% | a `.c-example` panel too tall for the gap |
| 26 | 85% | an `h3` that may not be stranded, and the example under it |
| 27 | 77% | the Practice band, whose set is kept whole |
| 30 | 83% | questions 28–31: **held by the Answers stage, which always opens a page** |

**Answers starts a fresh page** — decided 16 September 2026, after this
chapter showed the key to questions 17–27 printed under question 31 on the
same page, in view while that question was being worked. `refit` had put the
head back under question 31 when it was moved by hand, so the rule went into
`build/repack.mjs` (a `.c-stage` titled *Answers* always opens a page).

**Beyond's examples numbered from 1**, corrected the same day: they were
first numbered 6–19, on from the body's five, which is what the phase-1 brief
said. Every Class 7 chapter starts Beyond's examples again at Example 1, and
the Chapter 1 agent noticed the difference. `check-numbers.mjs` now checks
both runs — body 1–5, Beyond 1–14.

**Assertion–reason set in Class 7's form**, corrected the same day: the four
choices are stated once in a `<p class="c-practice__note">`, and each
question is two lines, *Assertion (A):* and *Reason (R):*, with no option
list. This chapter first printed an (a)–(d) list under every question, and
Chapters 7 and 10 copied it from here. `check-numbers.mjs` now also checks
that the assertion and reason printed under each number are the ones its
truth values were worked for — a reworded assertion fails it (tested).

The shorter questions left page 29 at 57%, so the division was refitted once
more: 12 pages became 11, question 31 moved up beside 28–30, and the
*Why the other options are wrong* head sits under the key with three of its
four notes. The last page holds the fourth note and the closing paragraph.
One build reported *overflow check did not report* — the measurement had not
run, with other chapters building at the same time; a rebuild measured every
page and all fit.

### Flagged

| what | why it is flagged |
|---|---|
| **`settle.mjs` on the last body page writes into the Bridge opener.** Pushing a block off p020 when there is no p021 landed the chapter's summary and tip inside `p101.html`, under the *Beyond the Book* band. | Recovered by hand, and `p101` restored from `HEAD`. A trap for anyone refitting a chapter body: check what `settle` wrote before building. |
| **`refit` prefers a 3.4 mm overflow to a 21st page.** Run on the body after the examples were stepped, it packs to 20 pages with page 20 over the bar, twice. | The 21st page was made by hand instead, with the summary and tip opening it. Do not re-run `refit … body` on this chapter without re-checking page 20. |

### Not changed

NCERT's structure in the chapter body. No example, check or exercise was
added inside it; the six exercise sets, every Think and Reflect, and every
figure are as they were. None of §5's unused components
(`.c-goals`, `.c-check`, `.c-fact`, `.c-mistake`, `.c-mindmap`, `.c-vocab`)
was introduced.


## 20 September 2026 — reference numbering and reading order

- Figures and tables now share one chapter sequence; caption labels and prose references were migrated together, including cross-chapter references within Class 6.
- Dependent text and diagrams are kept together with c-figure-context where the revised layout needs it. The final bound-book audit distinguishes facing pages from page turns.
- Source content was checked against build/_class6-reference-before. All questions, worked mathematics and illustrations were preserved. The Data Handling closing paragraph alone was shortened to avoid an isolated final page.
- Validation and mapping: build/_class6-reference-checks; reproducible source check: build/check-class6-reference-revision.mjs.
