# Class 10 · Mathematics I · Chapter 1 — Real Numbers

## Solved examples in examination formats, 24 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 13 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-10/ch01-real-numbers/`.

Source `build/jee-class10.mjs`; check `build/check-jee-class10.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p111; the answers stage still opens a fresh page.

**Body, p005.** The page ran 3.4mm into the foot margin (first seen once the builder measured the column rather than the page body). The Section 1.3 opening now reads "you met irrational numbers and their properties" and "you located some irrational numbers" (was "many of their properties", "you even located"), which takes back one line. Nothing else changed.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) 4 |
| 2 | Single correct | (b) 360 |
| 3 | Single correct | (c) 153 |
| 4 | Single correct | (d) $3 + \sqrt{5}$ |
| 5 | Single correct | (a) 72 |
| 6 | Single correct | (b) $3^2 \times 5^2 \times 17$ |
| 7 | Multiple correct | (a), (b) |
| 8 | Multiple correct | (a), (c), (d) |
| 9 | Multiple correct | (a), (b), (d) |
| 10 | Multiple correct | (a), (b) |
| 11 | Numerical answer | 36 |
| 12 | Numerical answer | 288 |
| 13 | Numerical answer | 17 |
| 14 | Matching | (a) P–4, Q–1, R–2, S–3 |
| 15 | Matching | (b) P–3, Q–4, R–2, S–1 |

## Brought to the Class 7 standard, 17 September 2026

Phase 4 of `PLAN-MATHS-CONSISTENCY.md`, worked by hand as the model for the
other thirteen Class 10 chapters. Page move, examples, Beyond the Book and
answers were done in one pass, and every check was run on the chapter.

**Pages: 16 before (9 body + 7 Beyond, Crown Quarto), 21 after (9 body + 12
Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`, and the body was
refitted once.

**All seven body examples set as steps: a decision for Class 10.** Every
example here, and 113 of the 117 in Class 10, was a question-only panel with
its working in the running text after it. The Class 7 rule leaves such
panels alone, which would have left Class 10's examples as prose. The user
decided on 17 September 2026 to step them. Each example's working moves
into its panel as *Solution*, Steps and *Answer*, and a remark that is not a
step stays as a paragraph after the panel.
- **Proofs** (Examples 1, 5, 6, 7) are set one statement to a row with the
  reason beside it, as DESIGN-MATHS asks of Classes 9–10. Example 5's
  conclusion, which had run onto the next page, is now its Step 7 and
  Answer.
- **Example 2's** remark on powers stays after the panel, since it leads to
  the key idea.

**Verified** by a new tool, `build/check-body-maths.mjs`. The old stepping
check compares only what is inside each panel, so it would report every
moved line as new. The new tool compares every maths span and every number
in the whole body, before and after: 130 expressions and 106 numbers, with
none lost and none added. The only gains are numbers restated in Answer
rows.

**Beyond the Book rebuilt to the four stages:**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, each explained in running text | **kept word for word**; only `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems in `.c-problem` / `.c-solution` | **13 stepped examples** under seven `Type` heads; the 5 old problems are Examples 2, 3, 5, 11 and 13, options kept, *Answer* gives the letter |
| 3 Problem Sets → **Practice** | 3 sets, 19 questions | **one run of 31** in six forms |
| 4 Answers & Takeaways → **Answers** | key and why the options are wrong | key, every other answer, why the options are wrong for 12, the closing paragraph |

**Unlike Class 8, Class 10's old Stage 2 is separate problems.** Its line
reads *Five multiple-choice problems, each solved*, and Stage 1 already
explains each of its own questions. So Stage 1 is untouched, and the old
problems become Solved Examples, as in Classes 6 and 7.

**Worked examples in the chapter: 20** (7 body + 13 Beyond). Every topic is
worked under a type: prime factorisation, HCF and LCM, HCF × LCM, word
problems, composite numbers, irrationality proofs, and sums and products
with an irrational number.

**Nothing repeats or answers the body.** `check-no-repeats` reports 18 pairs
above 50%, each the same type with different numbers (for example √7 against
the body's √3, and 11 × 13 × 17 + 17 against Exercise Set 1.1 Q6). Reading
every value Beyond prints against the body's exercises found nothing that
answers one. The old problem sets were reused with their options reordered
to spread the key (a 4, b 5, c 5, d 5). Three were dropped as weak or
duplicated, and the old assertion–reason and "who is right" items were
recast in the Class 7 forms.

**`ANSWERS.md` written** for Exercise Sets 1.1 and 1.2, the running-text
question in § 1.2, the Note to the Reader's check, Stage 1, and all 31
practice questions. Proofs are set one statement to a line.

### Verified

`check-numbers.mjs` passes **320 claims**, evaluating 205 printed identities.
It reads `HCF(…)` and `LCM(…)` as functions, so identities printed with them
are checked too; the 101 spans it skips are algebra. It also re-derives:
- the primality of 3803 and 3607;
- every exercise answer in `ANSWERS.md`, including checking that each
  factorisation lists only primes;
- Stage 1's numbers and every Solved Example;
- the practice answers, read back from the key rows a lettered part at a
  time;
- every multiple-choice question (exactly one right option, matching the
  key) and every assertion–reason letter;
- the key and practice working in `ANSWERS.md`.

**Break tests: 13 of 13 caught** (the body, a Beyond example, a key letter,
key rows, an option, `ANSWERS.md` values and key). The first run missed
three:
- key 30 (d) "9 times" passed because 8 also appears in "432 × 8" in the
  same part, so that answer is now checked as a phrase;
- `ANSWERS.md`'s practice working was not checked at all; it is now, row by
  row;
- one test added a value instead of replacing it, which was not a fair test.

**Faults in the check itself, fixed:**
- a comma inside `HCF(6, 20)` split the span;
- a `\sqrt` inside a `\dfrac` defeated the fraction parser;
- $\sqrt{2} \times \sqrt{8}$ was compared with 4 exactly, in floating point.

**Fitting:** nothing is clipped. Pages 16 and 20 run 1.3 mm into the bottom
margin. `orphans` finds 0 stranded openers, `check-labels` finds no
collisions, and `fit-options` narrowed practice Q7's options to two
columns. I read the proofs of pages 7 and 17.

**Colour:** pages 1 and 2 were read in greyscale. The factor tree marks its
primes with boxes, not colour.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 6 | 87% | Example 5, a panel |
| 7 | 74% | Example 7, a panel |
| 8 | 84% | the Note to the Reader, a panel |
| 9 | 28% | the last body page (`data-close`) |
| 13–15 | 64–78% | Solved Examples: a `Type` head with its example, and example panels |
| 16, 18 | 84% | practice blocks too tall for the gap |
| 19 | 65% | **the Answers stage, which always opens a page** |
| 21 | 55% | the last page |

### Flagged, not done

- **Unsourced history:** Euclid's Book IX Proposition 14, Gauss's proof, and
  "counted with Archimedes and Newton" are stated without a source in this
  log.
- **Ex 1.1 Q7:** "drive once round the field" is NCERT's wording and is kept.



Written new from NCERT *Mathematics, Textbook for Class X* (reprint 2026-27),
Chapter 1, *Real Numbers* (textbook pages 1–9). Original LearnLab text in
NCERT's order of topics, examples and questions; no sentence is carried over.
Crown Quarto, house design, palette `cobalt` — the first chapter of Class 10,
so no palette is taken yet in this class. The source PDF has no answer key;
every answer below was worked here.

Sections: 1.1 Introduction · 1.2 The Fundamental Theorem of Arithmetic ·
1.3 Revisiting Irrational Numbers. The source's *Exercise 1.1* and
*Exercise 1.2* are Exercise Sets 1.1 and 1.2. Theorems 1.1–1.3 are
`c-keyidea` blocks, their proofs running text; the proof of Theorem 1.3 is
stepped working with a reason on every line. The source's *1.4 Summary* is
the chapter summary (not a numbered section, as in every other chapter), and
its *Note to the Reader* is a `c-reflect`.

### Accepted, 17 September 2026

Accepted as the model.

## The one figure

Fig. 1.1, the factor tree for 32760, is drawn new from `fig1.mjs` in the
session scratchpad: the same splits as the source (2, 2, 2, 3, 3, 5, 7 and
13), with each prime boxed. The source's portrait of Gauss is left out; his
note is running text.

## Every answer worked

| where | answers |
|---|---|
| 1.2 products | 1771 · 5313 · 10626 · $2^3 \times 3 \times 7^3 = 8232$ · 21252; $123456789 = 3^2 \times 3803 \times 3607$, and 3803 and 3607 were checked prime |
| Examples 1–4 | no $n$ · HCF 2, LCM 60 · HCF 4, LCM 9696 · HCF 6, LCM 360; $6 \times 72 \times 120 = 51840 \neq 2160$ |
| Set 1.1 | 1 (i) $2^2 \times 5 \times 7$ (ii) $2^2 \times 3 \times 13$ (iii) $3^2 \times 5^2 \times 17$ (iv) $5 \times 7 \times 11 \times 13$ (v) $17 \times 19 \times 23$ · 2 (i) HCF 13, LCM 182 (ii) HCF 2, LCM 23460 (iii) HCF 6, LCM 3024 · 3 (i) HCF 3, LCM 420 (ii) HCF 1, LCM 11339 (iii) HCF 1, LCM 1800 · 4 22338 · 5 no: $6^n = 2^n \times 3^n$ has no 5 · 6 $13 \times 78 = 1014$ and $5 \times 1009 = 5045$ · 7 36 minutes |
| Set 1.2 | proofs; each follows Theorem 1.3 or Examples 6–7 |
| Note to the Reader | both formulas checked on 6, 72, 120: $51840 \times 6 \div 864 = 360$ and $51840 \times 360 \div 3110400 = 6$; both hold in general (the exponents of each prime satisfy max = sum − pairwise mins + min, and the same with max and min exchanged) |

Beyond the Book: Stage 1 — LCM 720, and no pair has HCF 18 with LCM 380
(18 does not divide 380; a pair with the first property is 90 and 144);
625; 1085; no ($\sqrt{2} \times \sqrt{8} = 4$); irrational. Stage 2 — (b),
(c), (d), (b), (c). Set A a b c b c d d c; Set B d c c b a b; Set C b b d b c.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| 1.1 promises Euclid's division algorithm and a study of terminating decimal expansions | not mentioned | neither is in this edition of the chapter; an introduction that promises them contradicts the pages after it |
| the Gauss note: "an equivalent version of Theorem 1.2" | Theorem 1.1 | the note is about the Fundamental Theorem of Arithmetic |
| Note to the Reader: "(see Example 8)" | Example 4 | the chapter has seven examples; the product of 6, 72 and 120 is in Example 4 |
| proof of Theorem 1.2 marked "*Not from the examination point of view" | printed without the mark | the book names no examination |
| "discussed in some detail in Appendix 1" | the method is described in one sentence where it is first used | this book has no appendix |
| *1.4 Summary* as a numbered section | the summary component, five points | house style; the source's third point, "To prove that √2, √3 are irrationals", is a topic, not a result, and the HCF–LCM results the chapter states were missing |
| Example 5's working, "a = 3c" on a line of its own | joined to the next line | fitting; nothing is lost |
| the factorisation of 32760 run into a sentence | two lines of working under the figure | a long product in a justified line either breaks at a × or opens the word spaces into holes |
| a paragraph on how a factor tree ends, and a sentence reading the powers in Example 2 | added | each closes a short page; both say what the figure and the example already show |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| 1.2, HCF × LCM | M3 | "for any two positive integers a and b, HCF × LCM = a × b" is stated after one example and never shown; the reason (for each prime, the smaller power plus the larger power is the sum of the two powers) is one line | a sentence of reason, if the class is to be shown it |
| 1.3 opening | C6 | "√p is irrational for every prime p" is claimed; only p = 2 and p = 3 are proved, and p = 5 is an exercise | none if the general case is left as a remark |
| 1.2, 123456789 | C4 | "check that 3803 and 3607 are primes" means trial division by every prime up to 61, which the chapter does not show how to do | a hint, or accept it as a stretch |
| Note to the Reader | C6 | the two formulas for three numbers are stated without any reason, and a reader checking them has no way to see why they hold | none; the note is an aside |
| Stage 2, Problem 4 and Set B Q3 | — | Set B Q3 (c) needs $\sqrt{6}$ irrational only for the reader's own interest; the question asks for the value, so no proof is needed | none |
