# Class 6 · Mathematics II · Chapter 7 — Fractions

## The maths-v2 conversion, 26 September 2026

**This supersedes every description of Beyond the Book, its examples, its
practice, its key and the body's page breaks further down this log.**
Converted to CONVERT-V2.md, with Class 6 Chapter 1 as the model.
`chapter.json` now reads `maths-v2`, palette `prism`, edition
`196x276-large`, `keepExerciseSets`, accent `#1e4e8c` (subject left as
Mathematics II, which is what `chapter.json` already said). 40 pages:

* **Body p001–p025**: NCERT's nine sections in NCERT's order (24 pages),
  ending on a **Summary** page (p025, `data-close`, ten points, key terms in
  bold, following NCERT's summary).
* **By the Book p090–p094**, five pages, 50 questions written to
  BY-THE-BOOK.md at Class 6: very short 10, short 10, long 10, assertion
  and reason 5 (key a, d, b, c, a), case-based 5, objective 10 (key b, a,
  c, d, a, d, c, d, b, c; one table item, one multi-statement item, one
  named student's claim). The old practice set's water tank (Q27) is
  reused as long answer 29 with new numbers; the rest is new. No question
  copies a body exercise.
* **Beyond the Book p101–p110**: the tried-and-explained questions with no
  head, then Single correct · More than one correct · Numerical answer ·
  Matching · Paragraph-based, each two solved examples then practice
  (4 · 4 · 3 · 2 · 2). Answers opens p109 with no stage numeral: By the
  Book's key, then Beyond's.

### The body

* **Every section now has a key idea and a Think and Reflect.** Added:
  a Think and Reflect in 7.1 (1/7 against 1/10; can a unit be bigger than
  1/2?), 7.5 (after Exercise 7.7: 9/9, 17/5 between 3 and 4, 7/4 against
  1 1/2) and 7.7 (after Exercise 7.14: 90 as a common denominator; 3/5
  against 3/8); key ideas in 7.2 (*Naming a piece of a whole*), 7.4
  (*Fractions on the number line*) and 7.9 (*Fractions in history*). The
  key ideas that had two or three paragraphs (fractional units, numerator
  and denominator, comparing, both Brahmagupta methods) are now
  `c-keyidea__points` of two points, as the model sets them. Every new
  reflect item is answered in ANSWERS.md.
* **Two figures added, so the figure numbers moved.** Fig. 7.2 (one roti
  shared by 5 and by 9, for the Beni–Arvin question) and Fig. 7.7 (halves
  of a roti counted one at a time, after the table of halves; it shows the
  first four lines only, so Exercise 7.3 Q1 stays open). Old Figs 7.2–7.5
  are 7.3–7.6, old 7.6–7.18 are 7.8–7.20, and Table 7.11 is Table 7.13.
  Captions, prose references and ANSWERS.md were renumbered together by
  script. The Meena chikki figure (now Fig. 7.17) went from `sm` to `md`.
* **Teaching added at joins**, to fill pages the larger edition left short
  (no exercise, example or question added): a sentence and a list of three
  readings under *Reading fractions*; one line each in 7.7 (the 189 against
  63 remark; "only the numerators had to be compared"), 7.8 (Meena's two
  pieces; the same-unit remark; "subtract the numerators and keep the
  denominator"; the opening line of subtraction with different
  denominators) and a Check row in body Example 7. Second items in three
  7.8 reflects (1/2 + 1/4 on a strip; 3/8 + 4/8 by jumps; 5/6 − 1/6 by
  jumps back).
* **Trimmed**: the Pinch of History second paragraph was split and
  tightened (every date and name kept); its puzzle paragraph lost a clause;
  "This method works for any fractions" and the Brahmagupta sentence became
  one; "Mukta compares 1/2 and 5/8" went (Shabnam's comparison follows it);
  "We also read it as" became "and read it as" on the opener.
* **No NCERT question, example or section was cut or moved.** The new
  Think and Reflects of 7.5 and 7.7 sit after the section's last exercise
  set, because `keepExerciseSets` would otherwise leave 40 mm holes.
* Lone-word lines were closed with a non-breaking space between the last
  two words, which leaves the wording untouched; parts made only of maths
  (Exercises 7.12, 7.14, 7.17 Q2) are now one expression each, so a pair
  cannot wrap apart. Figure numbers carry a non-breaking space.

### By the Book and Beyond

* **Tried questions** kept word for word, with the stage head removed as in
  the model, except one sentence: the halfway-fraction explanation ended
  "Cutting each unit into smaller equal parts always makes room for a
  fraction in between", which answers Exercise 7.4 Q3 (how many fractions
  lie between 0 and 1). It was deleted (§6a: that rule wins).
* **Examples.** Kept from the old fifteen, reworded and stepped: old 1
  (tank, now with a Check row), old 2 (between 5/8 and 3/4), old 9
  (equalities, with a Check row), old 10 (twelfths on a number line, with a
  Check row), old 11 (48 students, three steps and a Check), old 12 (7/12
  in 84ths, extended to 84ths and 120ths: answer 119), old 14 and old 15
  (matching). Dropped: old 3 (the same form as By the Book Q16), old 4–8,
  and old 13 (cutting a rope into 3/4 m pieces is division by a fraction).
  Both paragraph-based examples are new (a cake in twelfths; a strip marked
  in eighths and sixths). All fifteen practice questions are new. Tabs read
  "Example N" only; no "Choose one correct option", "Select all" or "Each
  entry has exactly one match" lines. The two matching examples keep the
  question stem "Match List I with List II.", as the model does; to fit it
  on p106 each example's working is now one Step row listing the four
  values, as the model's Example 7 is set (restored at the coordinator's
  review, 26 September 2026).
* The matching practice questions have four entries in each list, with no
  spare fifth, so that Q13, the Paragraph-based head and Example 9 fit one
  page.

### Checks at close

* `build.mjs`: all 40 pages fit, no `~`, no `!`. Every page 88% or more
  except the Summary (81%, `data-close`) and the chapter's last page (81%).
  Pages 2, 10, 13 and 18 are at 88%.
* `lone-words`: 0. `check-sums`: 33 identities, 0 wrong. `orphans`: 0
  stranded in 40 pages. `check-labels`: no labels collide. `fit-options`:
  every option row fits (By the Book Q50 and Beyond Q14 were narrowed with
  `--fix`).
* **`check-numbers.mjs` was rewritten** for this layout (the old script is in
  git history; it also measured Figs 7.4 and 7.9–7.12 off their SVGs, which
  the new one does not): 724 checks, 438 relations, 0 failed. It evaluates
  every =, < and > in the pages and ANSWERS.md in exact fractions (three
  sums are false on purpose and must stay false), recomputes every By the
  Book objective and assertion–reason answer, every Beyond single,
  multiple-correct, numerical and matching answer, every example's Answer
  row, and the numbers in the By the Book key. Planted errors (a key
  letter, a mixed number in a key row, a numerical key, a paragraph part)
  were all caught.
* Fitting: the body by `refit … body` (several rounds, the Summary held
  aside); By the Book and Beyond by hand from measured block heights,
  because the scratch refit reported overruns the real build does not.

### Flagged

| where | what | what it needs |
|---|---|---|
| Beyond practice 12 and 13 | both count a mixed number in smaller units; a fraction table for Q13 did not fit | A second type, if a page can be found for it |
| p024 Pinch of History | the dates (Bakshali, Aryabhata, Sridharacharya, Mahaviracharya, Al-Hassar) still have no source recorded | A source |
| p001, p005 | Figs 7.2 and 7.7 are new artwork | A look in proof |

## Solved examples in examination formats, 20 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 19 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-6/math-ch07-fractions/`.

Source `build/jee-class6.mjs`; check `build/check-jee-class6.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p111; the answers stage still opens a fresh page.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (c) 40 litres |
| 2 | Single correct | (a) $\frac{11}{16}$ |
| 3 | Single correct | (b) $\frac{4}{15}$ |
| 4 | Single correct | (d) $\frac{11}{16}$ |
| 5 | Single correct | (b) $\frac{7}{12}$ m |
| 6 | Single correct | (a) $\frac{5}{8}$ of a cake |
| 7 | Multiple correct | (a), (b), (d) |
| 8 | Multiple correct | (a), (c) |
| 9 | Multiple correct | (a), (b), (d) |
| 10 | Multiple correct | (a), (b), (c) |
| 11 | Numerical answer | 18 |
| 12 | Numerical answer | 49 |
| 13 | Numerical answer | 8 |
| 14 | Matching | (b) P–3, Q–4, R–1, S–2 |
| 15 | Matching | (d) P–2, Q–4, R–1, S–3 |


## Syllabus audit fixes, 17 September 2026

The Beyond the Book audit made five findings here. I confirmed all five against the pages and fixed all five. The chapter body was not touched.

| finding | what I did |
|---|---|
| Stage 1 Q3 (borderline): cutting 3½ m into ¼ m pieces is division by a fraction | Replaced it with a try of the same kind: *Write 3½ as a number of quarters, then as a number of eighths.* The explanation counts wholes as 4 quarters (14/4), then each quarter as 2 eighths (28/8). The amount stays the same; only the unit changes. The body shows ½ = 2/4 = 4/8 on the strips, but it never writes 3½ in quarters or eighths (Exercise 7.7 uses other numbers). |
| Stage 1 Q5 (borderline): "one third of what is left" takes a fraction of a fraction | Replaced it, as the audit suggested, with fractions of the whole cake. Priya eats 2/5 and Sunil eats 1/4: is more than half left? In twentieths they eat 8 + 5 = 13, so 7/20 is left, which is less than 10/20. The closing paragraph's list of units now reads *quarters and eighths, twelfths or twentieths*. The other three tries are unchanged, word for word. |
| Practice Q25 (borderline): numerator + denominator = 64 was solved by ratio ("3 parts and 5 parts") | Reworked to the body's own method (Exercise 7.8, *write as many fractions as you can equivalent to…*). The question now says *List fractions equivalent to 3/5 to find it*. The answer lists 3/5, 6/10, 9/15, … whose sums are 8, 16, 24, …; since 64 = 8 × 8, it is the eighth fraction, 24/40. |
| gap: naming a piece as a part of the whole (§7.2) | **New Example 2** under Type 1, now headed *Fractional units, parts of a whole and the number line*. A 30-square chocolate bar has 5 rows of 6 squares. One row is 1/5, three rows are 3/5 and 15 squares are 1/2, each found by asking how many pieces of that size make the whole. A square count checks the result. It uses a different whole from Fig. 7.4, so Exercise 7.2 stays unanswered. |
| gap: a fraction as an equal share (§7.6) | **New Example 7** under Type 3. 4 rotis are shared by 5 children and 8 rotis by 10. Each share is 4 × 1/5 = 4/5 (so 4 ÷ 5 = 4/5) or 8 × 1/10 = 8/10. The second group is two copies of the first, so 4/5 = 8/10. The numbers avoid Exercise 7.9 (3 among 4, 2 among 4, 2 among 5) and the Think and Reflect after Fig. 7.13 (2 among 3, 4 among 6, 6 among 9). |

**Renumbering.** Old Example 1 keeps its number. Old Examples 2–5 are now 3–6, and old Examples 6–17 are now 8–19. `ANSWERS.md` (the Stage 1 items, the Stage 2 list, *Examples 1 to 19*) and `check-numbers.mjs` were updated to match. No page text cited a Beyond example number.

**Fitting.** The refit first gave 14 pages. Q31 stood alone before Answers, as it already had on the old p111, and Answers ran over two pages because Q25's answer row had grown. Four trims fixed this:
- Q29's parts are now in three columns (*Write each as a fraction / Find their sum / Find their difference*), and *as a mixed number* moved into the stem.
- Q28's pairs now sit in three columns, and (c) became *When must it work?* Its key is unchanged: pairs with the same numerator.
- The answer rows for Q20, Q25 and Q28 each lost a line. Q20 now reads *…but 15 and 27 share 3*.

After these trims, Q27–Q31 share p111, and Answers is back on one page.
- p108 (Examples 18–19) is 59% full. The page is held open because `keepExerciseSets` starts Practice on a fresh page, so I logged it and did not pad it.
- p112 runs 1.3 mm into the margin, which is within §5a's 3 mm.

**Pages: 32 before (20 body + 12 Beyond), 32 after (20 + 12).** Solved
Examples: 19 in Beyond (was 17).

**Checks.**
- `check-numbers.mjs` passes.
- New checks cover:
  - both new tries, including the printed working of the cake try;
  - Example 2: rows × columns, each answer, each step, and the square count;
  - Example 7: both groups, the doubling, each step, and the equal-share answer;
  - Q25's list, sums and multiplier, and that the question asks for the listing method;
  - `ANSWERS.md` for each of these.
- 17 deliberate breaks in a scratch copy were all caught. They are in `cases07.py` in the scratch folder.
- `build.mjs --png`: all pages fit.
- `orphans`: 0.
- `fit-options`: clean, with or without `--fix`.
- `check-labels`: clean.
- `check-no-repeats`: only the three existing *lowest terms* wording pairs remain.
- `data-bridge` is on every p1xx.

## Brought to the Class 7 standard, 16 September 2026

Phase 1 of `PLAN-MATHS-CONSISTENCY.md`, on the model of Chapter 5
(`math-ch05-prime-time`). I read the chapter whole before changing
anything, and ran every check below on the whole chapter.

**Pages: 27 before (19 body + 8 Beyond), 32 after (20 body + 12 Beyond).**

### What changed

**Palette.** `chapter.json` gains `"palette": "moss"`, slot 7. Its `--teal`
is `#405214`, byte-identical to `CHAPTER_ACCENTS[7]` in `build/build.mjs`.
Nothing else in `chapter.json` changed.

**All eight body examples set as steps.** Each now runs *Solution*, a step
to a `.work__row`, *Answer*, with the reason in a `.work__why`. The eight
are Example 1 (7.6), Examples 2–3 (7.7) and Examples 4–8 (7.8), in the
numbering described under *Examples renumbered* below. The stepping
itself is layout only. Sentences that gave a step became rows, for
example *Both 16 and 20 are divisible by 4* and *63 is a common multiple
of 9 and 21*. Sentences that explain stayed paragraphs: Example 6's
*3 is the largest common factor…* and Example 8's check by adding back.
Example 7's first working line holds two equalities, joined by `\quad`.
It stays one row, because splitting it would change the expressions that
`check-example-stepping` compares.

**Verified:** `node build/check-example-stepping.mjs`, run before the
renumbering, reports *8 example(s) compared against HEAD in the chapter
body: 0 lost mathematics.* The one gain it reports is in Example 4 (then
labelled Example 1 of 7.8): 1 and 7 each appear once more, from the
reason *7 sevenths make 1*.

**Examples renumbered, at the coordinator's request.** The body printed its
example tabs restarting per section — 1 in 7.6; 1, 2 in 7.7; 1–5 in 7.8 —
so three panels read *Example 1*, and Beyond's first example (then 6)
followed a body that had printed Examples 1–5 twice over. Every other
Class 6 and Class 7 chapter numbers straight through. The numbers are the
book's labels, not NCERT's structure, and nothing on any page refers to an
example by number, so the tabs were relabelled and nothing else:

- body, in page order: Examples 1–8 on p012–p019, one each;
- Beyond: Examples 9–25 (were 6–22) at first, then **Beyond Examples
  1–17** — see *Beyond renumbered to match Class 7* below.

References followed: `ANSWERS.md`'s *Think and Reflect (after Example 4)*
is now *(after Example 7)*, and its *Examples 6 to 22* is *Examples 9 to
25*; `check-numbers.mjs` now expects the body tabs to read Example 1–8 and
Beyond's to run on from Example 9, and every per-example check is keyed by
the printed number. Its pass count went from 787 to **788** — the one new
check is the body's 1–8 sequence.

`check-example-stepping` now reports six "numbers lost" (1, 2, 2, 3, 4, 5
in examples 2, 3, 5, 6, 7, 8): it reads the tab's number as one of the
example's numbers, and the tab numbers are what changed. With the old tab
labels put back temporarily it reports *0 lost mathematics*; the new
labels were then restored and checked byte for byte. So the stepping
still loses nothing, and the only difference from HEAD in those numbers
is the label. No refit was needed; the build's warnings are unchanged.

**Beyond renumbered to match Class 7.** The brief said to number Beyond's
examples on from the body's last; that was wrong. Every Class 7 chapter
starts Beyond's Solved Examples again at Example 1, so Beyond's tabs were
relabelled from 9–25 to **1–17**. The body keeps Examples 1–8. No page
sentence names a Beyond example by number, so only the tabs changed.
`ANSWERS.md` now says *Examples 1 to 17* and has a *Stage 2 · Solved
Examples* section listing each by its Beyond number with its answer.
`check-numbers.mjs` checks that the body tabs read 1–8 and Beyond's
1–17, names every per-example check *body Ex N* or *Beyond Ex N*, and
checks each Stage 2 answer in `ANSWERS.md` against the printed Answer
row; the count went from 795 to **820** (the Stage 2 list count, 17
answers, and 7 relations in the new section). Changing Beyond Example
10's tab to *Example 11* failed with *Beyond examples are numbered 1 to
17, on their own*, exit 1; restored byte for byte, exit 0.
`build/check-example-stepping.mjs` has since been changed (not by this
chapter) to strip the tab label before comparing, and it now reports
*8 example(s) compared against HEAD in the chapter body: 0 lost
mathematics.* without the temporary relabelling described above.

In the rest of this log, *Beyond Ex N* is Beyond's own number.

**Refit of the body.** Stepping pushed page 16 past the text block by
50.8 mm and page 18 by 29.6 mm. One `refit … body` packed the chapter
onto 21 pages, with the closing tip alone on page 21 at 7%. I moved the
tip by hand onto page 20, which it fits at 99% with no overrun. I also
moved `data-close` onto page 20 and deleted the 21st page. The body is
now 20 pages.

**Beyond the Book rebuilt to the four stages** (§6a):

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, explained in running text | **kept word for word**; only `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems solved in prose | **17 stepped examples**, Beyond Examples 1–17, under five `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, A/B/C, 24 questions | **one numbered run of 31**, all six forms, band carrying the numeral |
| 4 Answers & Takeaways → **Answers** | key, 6 notes, closing paragraph | key, answer rows 18–31, 5 notes; opens a fresh page |

The chapter now has 25 worked examples (8 body + 17 Beyond); §5a's bar
is 12. Each topic the chapter teaches has a type:

1. fractional units and the number line (Beyond Ex 1–2)
2. mixed numbers (Beyond Ex 3–4)
3. equivalent fractions and lowest terms (Beyond Ex 5–7)
4. comparing fractions (Beyond Ex 8–10)
5. adding and subtracting (Beyond Ex 11–17)

Beyond Examples 7, 10, 11 and 13 are old Problems 1, 3, 2 and 4, recast as
stepped examples. Old Problem 5 was dropped: its answer is one of the six
solutions to the body's last Think and Reflect (C7). I added Beyond
Examples 15–17 to close page 27. The Practice run always opens a page,
so without them Beyond Example 14 stood alone there at 26%.

Practice forms: 12 multiple choice (1–12), 5 assertion–reason (13–17),
5 very short (18–22), 4 short (23–26), 3 long (27–29), 2 case-based
(30–31). No case label is used. The key uses a 5 times and b, c and d 4
times each.

**Assertion–reason set in Class 7's form**, at the coordinator's request
(the per-question option list had been copied from the model chapter).
The four choices are stated once, in a `<p class="c-practice__note">`:
*In Questions 13 to 17, choose (a) if both A and R are true and R
explains A; (b) …; (c) …; (d) if A is false but R is true.* Each of
Q13–17 is now `<li><p>Assertion (A): …</p><p>Reason (R): …</p></li>`,
in its own `.c-practice--cont` block, with no option list. The
statements themselves did not change.

The closing paragraph (*Most of these questions came down to one
choice…*) was cut. It was the only thing on a 33rd page, at 7%.

**Nothing repeats the body.** I ran `check-no-repeats` and judged every
pair it printed. These were replaced:

- **Q7**, *How many pieces of length 1/8 make 3/4?* This is Exercise 7.8
  Q3–4 with new numbers. It is now *Which of these is not equal to 1?*
- **Q20**, *Write 56/70 in lowest terms.* This is Example 1 (7.6) and
  Exercise 7.13 again. It is now *Which of 15/28 and 15/27 is in lowest
  terms?*

These drills were replaced on the same judgement, although the script
scored them under 50%:

| question | was | copied | now |
|---|---|---|---|
| Q18 | 29/8 as a mixed number | Exercise 7.6 Q3 | *between which two whole numbers* |
| Q21 | find 7/10 − 2/5 | Exercise 7.17 | *what must be taken away* |
| Q22 | which is greater | Exercise 7.14 Q1 | *closer to 1/2 or to 1* |
| Q23 | ascending order | Exercise 7.14 Q2 | ordering plus the difference of the extremes |

The pairs still printed are a worked example of a type the body sets:

- Beyond Ex 1 and Beyond Ex 10 (ordering)
- Beyond Ex 6 and Beyond Ex 7 (lowest terms)
- Q4 (recognising an equivalent fraction)
- Q6 (a number-line mark)
- Q14 (an assertion about lowest terms)
- Q20 (which of two is reduced)

§5a asks for these: a type worked for each topic.

**`ANSWERS.md` written** for every question the chapter sets:

- all 17 exercise sets
- every Think and Reflect
- the Fig. 7.7 box and the fraction-wall check
- Beyond stage 1, and practice 1–31

It gives the working for each, says what each drawing must show, and
gives a worked instance under each *answers will vary*.

### Verified

`check-numbers.mjs` does all its arithmetic in exact fractions, with no
floating point. Its final run passes **820 checks**. It evaluates
**196 relations** off the pages and **180** out of `ANSWERS.md`. Each
`=`, `<` and `>` must hold.

Four spans are skipped and named: the three `\square` boxes in Exercise
7.10 and the boxes in Beyond Example 5. Their values are checked in part B
instead.

One printed sum is false on purpose: Rohan's
$\frac13 + \frac14 = \frac27$ in stage 1. The script requires it to stay
false and requires the text to call it wrong.

**Part B** reads each question off the page and recomputes its answer.

- **Answer forms.** It checks that each answer is in lowest terms or a
  proper mixed number.
- **Fig. 7.2 and Fig. 7.3.** The shoelace formula gives 18 and 6 squares
  for the Fig. 7.2 pieces, and 4 squares each for the Fig. 7.3 pieces.
- **Fig. 7.4.** It measures all eight pieces, a–h, off the drawing and
  gets 1/12, 1/4, 1/8, 1/6, 1/8, 1/6, 1/24 and 1/24.
- **Fig. 7.6.** It counts the cuts in each roti.
- **Figs 7.7–7.10.** It measures every bar against the unit.
- **Puzzles.** It finds every way of making 1 from different fractional
  units. There is exactly one with three units, which confirms the
  chapter's *only one answer*. There are exactly six with four units,
  which confirms *There are six ways*. `ANSWERS.md` lists exactly those
  six.

**Part C** reads options, stems and key letters from the pages. Each of
Q1–12 has exactly one right option and it matches the key. Q13–17 are
graded from the printed *Assertion (A)* and *Reason (R)* paragraphs, and
each printed reason is matched to the one graded. It also checks that no
assertion–reason question carries an option list and that the one note
states the four choices for Questions 13 to 17. The key uses all four
letters.

The move to Class 7's form took the count from 788 to 795: the five
per-question option-list checks became five "no option list" checks, and
seven were added (the note's wording, one note only, and five printed
reasons). Breaking the key for Q16 from (b) to (a) failed three checks
(*Q16: A is true, R is true → (b), the key prints (a)*, the note for 16,
and the ANSWERS.md key), exit 1; restored byte for byte, exit 0.

**Part D** reads each exercise part off the page and matches it to its
own line in `ANSWERS.md`. Lettered answers are read one part at a time.

**The script was tested against injected errors, and each was caught.**
Afterwards the directory was byte-identical to the backup.

- body Example 5 (then 7.8's Example 2) answer changed from 13/15 to 14/15
- Beyond Q31(d) changed from 5 1/4 to 5 3/4
- `ANSWERS.md` 7.15 (x) changed from 2 20/21 to 2 19/21
- key Q9 changed from (d) to (c)
- Fig. 7.10's bar D redrawn at 8/5
- Beyond Example 17's perimeter changed from 5 1/3 to 5 2/3

After the first renumbering the test was repeated on a Beyond example
(Beyond Example 5, then labelled 13): its printed answer *12 and 35*
changed to *13 and 35* failed with *the two boxes, computed [12,35],
printed [13,35]*, exit 1; restored byte for byte, exit 0.

**Wrong numbers found:** none in the chapter's printed values. Every old
Beyond key and note was re-derived and held. Writing the script turned up
eight faults in the script itself, all fixed before the final run:

- regexes that missed a line break
- a note lookup that read the wrong row
- a floating-point area from Fig. 7.4's rounded coordinates, now rounded
  to a whole number of squares, with a check that it was whole to begin
  with

**Fitting.** Nothing is clipped. Pages 9, 14, 17, 19, 29 and 32 each run
1.3 mm into the bottom margin, inside §5a's 3 mm.

- `orphans`: 0 stranded openers in 32 pages
- `check-labels`: no labels collide
- `fit-options`: every option row fits its columns

`refit … bridge` was run twice. The first run was on the draft; the
second was after the coordinator's Answers-on-a-fresh-page rule and after
the content was final. Page 31 (p111) holds only practice questions
29–31. Beyond Examples 15–17, the page-33 cut and the Q7/Q20 swaps were made by
hand after that; the build shows no overrun.

After the assertion–reason change the Practice pages got shorter (page 29
fell to 44%), and `refit … bridge` was tried once more. It packed the
practice run well but split the Answers stage over two pages, leaving the
five notes alone on a 33rd page. That undid the one-page Answers fit, so
the refit was discarded, the pre-refit pages restored, and the practice
refilled by hand with `unsettle`: page 29 (p109) now holds Q12–26,
page 30 (p110) Q27–30, and page 31 (p111) Q31 only. Q27 was tried on
page 29 and overran by 21.7 mm, so it went back. Q31 needs 68 mm and page
30 has 46 mm, so it cannot move up; pushing Q30 forward to keep the two
case-based questions together was tried and undone, because it left page
30 at 48% with nothing holding it open. The Answers stage still opens
page 32, and page 31 holds only a practice question.

**Colour.** I built with `--png` and ran `check-colour` on pages 1, 2, 3,
5, 6, 10, 15, 16, 22 and 29. I looked at the greyscale and deuteranopia
versions of page 15 (Figs 7.14 and 7.15). The labels carry each figure's
meaning, and shaded strips separate from empty ones by tone. Moss
furniture and the action blue stay distinct.

### Short pages, logged

`gaps` names the block holding each one open.

| page | fill | held by |
|---|---|---|
| 13 | 79% | next page opens with body Example 3, a panel (65 mm) |
| 22 | 86% | the `Type 2` head, which may not be stranded, and Beyond Example 3 under it |
| 23 | 86% | Beyond Example 6, a panel (76 mm) |
| 26 | 86% | Beyond Example 15, a panel (71 mm) |
| 30 | 80% | Q31, a case-based question with a table (68 mm), too tall for the 46 mm left |
| 31 | 29% | held by the Answers stage, which always opens a page |

### Flagged

| what | why it is flagged |
|---|---|
| **Page 13 at 79%** | Held by a panel. Closing it would need about 16 mm of new body prose, which this pass may not add. |
| **Pinch of History dates**: Bakshali about 300 CE, Aryabhata 499, Sridharacharya about 750, Mahaviracharya about 850, Al-Hassar in the 12th century | These are body text following NCERT, and were not changed. No source is recorded here. §5a's facts rule wants one before this is called finished. |
| ***ascending order*** is glossed with `.term` only in Beyond Example 10 | The body never uses *ascending* or *descending*, which papers use (§10, required terms). Adding the term to the body is an authoring pass, not this one. |
| **`refit` leaves `build/class-6/_refit-math-ch07-fractions.html`** | This is build output from the scratch chapter. It was not removed by hand. |

### Not changed

NCERT's structure in the chapter body. No example, check or exercise was
added inside it. All 17 exercise sets, every Think and Reflect and every
figure are as they were. Stage 1 of Beyond is word for word. None of
§5's unused components was introduced.


## 20 September 2026 — reference numbering and reading order

- Figures and tables now share one chapter sequence; caption labels and prose references were migrated together, including cross-chapter references within Class 6.
- Dependent text and diagrams are kept together with c-figure-context where the revised layout needs it. The final bound-book audit distinguishes facing pages from page turns.
- Source content was checked against build/_class6-reference-before. All questions, worked mathematics and illustrations were preserved. The Data Handling closing paragraph alone was shortened to avoid an isolated final page.
- Validation and mapping: build/_class6-reference-checks; reproducible source check: build/check-class6-reference-revision.mjs.
