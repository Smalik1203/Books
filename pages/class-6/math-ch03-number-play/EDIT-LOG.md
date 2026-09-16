# Class 6 · Mathematics I · Chapter 3 — Number Play

## Brought to the Class 7 standard, 16 September 2026

This is phase 1 of `PLAN-MATHS-CONSISTENCY.md`, following the model in
`math-ch05-prime-time`. The whole chapter was read before any change, and
every check below was run on the whole chapter.

**Pages: 26 before (18 body + 8 Beyond), 29 after (18 body + 11 Beyond).**
The body needed no refit after its examples were stepped. Beyond the Book
is 11 pages, within §6a's "ten or so".

### What changed

**Palette.** `chapter.json` gains `"palette": "bronze"`, from chapter 3's
slot in the mapping. `palette-bronze.css` sets `--teal: #664203`, which is
byte-identical to `CHAPTER_ACCENTS[3]` in `build/build.mjs`. Nothing else in
`chapter.json` changed.

**All four body examples set as steps.** Each now reads *Solution*, then its
steps in `.work__row`, then an *Answer* row, with reasons in `.work__why`.
Only the layout changed: no number, question or order moved, and NCERT's
structure is untouched. Two sentences that explain rather than work stay as
paragraphs after the working: body Example 2's *every round after this gives
6174*, and body Example 3's *we did not need to try the differences in between*.
`build/check-example-stepping.mjs` compares all four examples with `HEAD`:
**0 lost mathematics** and no gained occurrences.

**Beyond the Book rebuilt to the four current stages.**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 8 `.c-try`, explained in running text | **kept word for word**; only `.c-stage__for` removed (checked with `git diff`) |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems, solved in prose | **15 stepped examples** (Beyond Examples 1–15) under nine `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, A/B/C, 25 questions | **one numbered run of 30** in all six forms; the band carries the numeral |
| 4 Answers & Takeaways → **Answers** | key, and why the options are wrong | a letter key for 1–16, `work--trace` answers for 17–30, and *why the other options are wrong* for Q4, 7, 10 and 14 |

The chapter now has **19 worked examples** (4 in the body and 15 in Beyond),
against §5a's bar of twelve. Every topic is worked under a type:

1. taller neighbours
2. supercells
3. digits and digit sums
4. palindromes
5. the Kaprekar steps
6. adding and subtracting large numbers, with the pattern totals of §3.9
7. the Collatz rule
8. estimation
9. winning strategies

**Practice forms and their questions:**

| form | questions |
|---|---|
| multiple choice | 1–12 |
| assertion–reason | 13–16 |
| very short answer | 17–21 |
| short answer | 22–25 |
| long answer | 26–28 |
| case-based | 29–30 |

The key uses each letter four times. The assertion–reason questions follow
Class 7's form: the choices are stated once in the note, and no option list
is repeated under each question. That saved about 80 mm. The case-based
questions carry no *Case study* label.

**What was kept from the old stages 2 and 3.** Old Problem 1 (Kaprekar from
1000) and old Problem 2 (the 3 × 3 grid) became stepped Beyond Examples 10 and 4.
Eight old options survive as practice questions: A2, A3, A5, A7, B1, B2, B4
and B6, and C1, C5 and C6.

**Old items dropped because they repeat the body:**

| old item | the body question it repeats |
|---|---|
| A4 (smallest number with digit sum 20) | Ex 3.4 Q1(b) |
| A6 (3-digit Kaprekar) | the §3.6 question |
| A8 (how many 3-digit numbers) | Table 3.1 |
| A9 (largest 4-digit number with digit sum 10) | Ex 3.4 Q1(c) |
| A10 (the digit 5 from 1 to 100) | the digit-7 Think and Reflect |
| A11 (smallest plus largest 3-digit palindrome) | Ex 3.5 Q2 |
| B3 (4-digit plus 2-digit) | Ex 3.6 Q3(c) |
| B5 (ii) | Ex 3.2 Q7 |
| B7 (Collatz for powers of 2) | Ex 3.9 Q8 |
| B8 (palindromic times) | §3.7 Think and Reflect |
| C2 (closest to 50,000) | Ex 3.9 Q3 |
| C3 (making 1,000) | §3.8 Think and Reflect |
| C4 (Game 2) | §3.12 |
| Problem 3 (next palindromic time after 9:59) | Ex 3.5 Q3 |
| Problem 4 (Collatz from 6) | stage 1, which already states it |

Problem 5 (4-digit plus 3-digit) was written as a stepped example and then
cut for fitting (see below), because body Example 3 already works the same
method.

**Nothing repeats the body.** `build/check-no-repeats.mjs` printed 10 pairs
at first. One was a real repeat: *the smallest 4-digit number whose digit
sum is 30* was the body's *smallest number whose digit sum is 14* with new
numbers. It was recast as *four different digits adding up to 30*, which
has a different argument (only 6, 7, 8 and 9 work). Five pairs remain, and
all were judged by hand to be the same type with a different instance:

- practice Q3 (reverse and add from 57) against body Example 1, twice
- Beyond Example 10 (Kaprekar from 1000, where leading zeros are the point) against Ex 3.5 Q4
- practice Q10 (seven children's total) against Ex 3.1 Q4
- practice Q27(b) (a game to 32) against the Game 1 Think and Reflect

**`ANSWERS.md` written.** It answers the opening Think and Reflect, every
exercise set from 3.1 to 3.9, every Think and Reflect, and the in-text
tasks: Fig. 3.3, the Fig. 3.7 grid, Fig. 3.8, Table 3.1, the palindromes
from 1, 2 and 3, Puzzle time, the Kaprekar and 3-digit Kaprekar tasks,
Fig. 3.12, Table 3.3, the §3.9 pattern totals, Games 1 and 2, and your own
version. It also has Beyond's key, the working for each option, and every
other answer. Each *answers will vary* item has a worked instance, checked
by the script.

### Verified

**`check-numbers.mjs`**, kept beside the pages, gives **635 checks passed,
0 failed**. It has four parts:

- **A** evaluates **170 arithmetic identities** from the pages and from
  `ANSWERS.md`. It names the 13 spans it skips as not arithmetic: the
  body Example 2 `$A = …# Class 6 · Mathematics I · Chapter 3 — Number Play

## Brought to the Class 7 standard, 16 September 2026

This is phase 1 of `PLAN-MATHS-CONSISTENCY.md`, following the model in
`math-ch05-prime-time`. The whole chapter was read before any change, and
every check below was run on the whole chapter.

**Pages: 26 before (18 body + 8 Beyond), 29 after (18 body + 11 Beyond).**
The body needed no refit after its examples were stepped. Beyond the Book
is 11 pages, within §6a's "ten or so".

### What changed

**Palette.** `chapter.json` gains `"palette": "bronze"`, from chapter 3's
slot in the mapping. `palette-bronze.css` sets `--teal: #664203`, which is
byte-identical to `CHAPTER_ACCENTS[3]` in `build/build.mjs`. Nothing else in
`chapter.json` changed.

**All four body examples set as steps.** Each now reads *Solution*, then its
steps in `.work__row`, then an *Answer* row, with reasons in `.work__why`.
Only the layout changed: no number, question or order moved, and NCERT's
structure is untouched. Two sentences that explain rather than work stay as
paragraphs after the working: body Example 2's *every round after this gives
6174*, and body Example 3's *we did not need to try the differences in between*.
`build/check-example-stepping.mjs` compares all four examples with `HEAD`:
**0 lost mathematics** and no gained occurrences.

**Beyond the Book rebuilt to the four current stages.**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 8 `.c-try`, explained in running text | **kept word for word**; only `.c-stage__for` removed (checked with `git diff`) |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems, solved in prose | **15 stepped examples** (Beyond Examples 1–15) under nine `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, A/B/C, 25 questions | **one numbered run of 30** in all six forms; the band carries the numeral |
| 4 Answers & Takeaways → **Answers** | key, and why the options are wrong | a letter key for 1–16, `work--trace` answers for 17–30, and *why the other options are wrong* for Q4, 7, 10 and 14 |

The chapter now has **19 worked examples** (4 in the body and 15 in Beyond),
against §5a's bar of twelve. Every topic is worked under a type:

1. taller neighbours
2. supercells
3. digits and digit sums
4. palindromes
5. the Kaprekar steps
6. adding and subtracting large numbers, with the pattern totals of §3.9
7. the Collatz rule
8. estimation
9. winning strategies

**Practice forms and their questions:**

| form | questions |
|---|---|
| multiple choice | 1–12 |
| assertion–reason | 13–16 |
| very short answer | 17–21 |
| short answer | 22–25 |
| long answer | 26–28 |
| case-based | 29–30 |

The key uses each letter four times. The assertion–reason questions follow
Class 7's form: the choices are stated once in the note, and no option list
is repeated under each question. That saved about 80 mm. The case-based
questions carry no *Case study* label.

**What was kept from the old stages 2 and 3.** Old Problem 1 (Kaprekar from
1000) and old Problem 2 (the 3 × 3 grid) became stepped Beyond Examples 10 and 4.
Eight old options survive as practice questions: A2, A3, A5, A7, B1, B2, B4
and B6, and C1, C5 and C6.

**Old items dropped because they repeat the body:**

| old item | the body question it repeats |
|---|---|
| A4 (smallest number with digit sum 20) | Ex 3.4 Q1(b) |
| A6 (3-digit Kaprekar) | the §3.6 question |
| A8 (how many 3-digit numbers) | Table 3.1 |
| A9 (largest 4-digit number with digit sum 10) | Ex 3.4 Q1(c) |
| A10 (the digit 5 from 1 to 100) | the digit-7 Think and Reflect |
| A11 (smallest plus largest 3-digit palindrome) | Ex 3.5 Q2 |
| B3 (4-digit plus 2-digit) | Ex 3.6 Q3(c) |
| B5 (ii) | Ex 3.2 Q7 |
| B7 (Collatz for powers of 2) | Ex 3.9 Q8 |
| B8 (palindromic times) | §3.7 Think and Reflect |
| C2 (closest to 50,000) | Ex 3.9 Q3 |
| C3 (making 1,000) | §3.8 Think and Reflect |
| C4 (Game 2) | §3.12 |
| Problem 3 (next palindromic time after 9:59) | Ex 3.5 Q3 |
| Problem 4 (Collatz from 6) | stage 1, which already states it |

Problem 5 (4-digit plus 3-digit) was written as a stepped example and then
cut for fitting (see below), because body Example 3 already works the same
method.

**Nothing repeats the body.** `build/check-no-repeats.mjs` printed 10 pairs
at first. One was a real repeat: *the smallest 4-digit number whose digit
sum is 30* was the body's *smallest number whose digit sum is 14* with new
numbers. It was recast as *four different digits adding up to 30*, which
has a different argument (only 6, 7, 8 and 9 work). Five pairs remain, and
all were judged by hand to be the same type with a different instance:

- practice Q3 (reverse and add from 57) against body Example 1, twice
- Beyond Example 10 (Kaprekar from 1000, where leading zeros are the point) against Ex 3.5 Q4
- practice Q10 (seven children's total) against Ex 3.1 Q4
- practice Q27(b) (a game to 32) against the Game 1 Think and Reflect

**`ANSWERS.md` written.** It answers the opening Think and Reflect, every
exercise set from 3.1 to 3.9, every Think and Reflect, and the in-text
tasks: Fig. 3.3, the Fig. 3.7 grid, Fig. 3.8, Table 3.1, the palindromes
from 1, 2 and 3, Puzzle time, the Kaprekar and 3-digit Kaprekar tasks,
Fig. 3.12, Table 3.3, the §3.9 pattern totals, Games 1 and 2, and your own
version. It also has Beyond's key, the working for each option, and every
other answer. Each *answers will vary* item has a worked instance, checked
by the script.

### Verified

**`check-numbers.mjs`**, kept beside the pages, gives **635 checks passed,
0 failed**. It has four parts:

- **A** evaluates **170 arithmetic identities** from the pages and from
  `ANSWERS.md`. It names the 13 spans it skips as not arithmetic: the
 and `$B = …$` spans (these are checked in part B
  against the digits), the four blank Table 3.3 targets, and `$A - B = C$`.
- **B** re-derives what arithmetic alone cannot check, reading each value
  from the figure's SVG rather than typing it in:
  - Figs 3.1 and 3.2: what each child says, from the drawn heights
  - Figs 3.3, 3.4, 3.6 and 3.16: supercells against the coloured cells
  - Fig. 3.5 and Fig. 3.7: the completed instances in `ANSWERS.md`
  - Fig. 3.8: placements against the scale
  - Fig. 3.9: every mark
  - Fig. 3.12: arrow sums
  - Figs 3.13–3.15: dots counted per die face, and number tallies

  It also brute-forces:
  - every order of 5 to 8 children
  - every filling of a row of up to 9 cells, and of a 3 × 3 grid
  - every 4-digit and 3-digit Kaprekar chain
  - Collatz from every start up to 1,00,000
  - every clock time
  - every date from the year 1000 to 2026
  - every single-digit swap in Fig. 3.16 (exactly one gives four supercells)

  It checks all 19 examples' Answer rows.
- **C** reads each multiple-choice question's options off the page and
  checks that exactly one is right and that it matches the printed key. The
  assertion–reason questions are graded from computed A and R. The key's
  spread is a:4, b:4, c:4, d:4.
- **D** checks `ANSWERS.md` against the page: the key, every number in
  answers 17–30, and the option working.

**The script was tested against injected errors.** Six were introduced, and
all six were caught (9 failures, exit 1):

- body `$76 + 67 = 143$` → 153
- practice 26(b) 17 → 16
- key 9 (d) → (b)
- `ANSWERS.md` 3.2 Q1 8000 → 5583
- the colour moved to another cell in Fig. 3.6
- Example 17's *takes 9 steps* → 8 (now Beyond Example 13)

The files were then restored from backups, and their checksums were
verified identical. (That test ran before the renumbering below, so it
uses the old example numbers.)

**Wrong numbers found and fixed.** No printed number in the chapter was
wrong. The chapter's claims (Kaprekar, reverse and add, the 2026 calendar,
the supercell figures) all re-derive. Three errors were caught before they
reached print:

| where | what was wrong | fixed to |
|---|---|---|
| `ANSWERS.md`, Ex 3.5 Q3 (as drafted) | minutes from 10:01 to the second palindromic time, drafted as 130 | **140**: 10:01 → 11:11 is 70 minutes, and 11:11 → 12:21 is another 70 |
| a scratch edit script (not a page) | an escape collapse: a `sed` pass turned `\\times` into `\times`, which a template literal reads as a tab | the replacement failed to match, so nothing was written; all later script edits were made with the Edit tool |
| `check-numbers.mjs` | `figure()` matched from the first `<svg>` in the chapter, not the one before the caption | tempered regex; every figure check now reads its own figure |

**Fitting.** Nothing is clipped, and no page runs into the bottom margin.

| check | result |
|---|---|
| `orphans` | 0 stranded openers in 29 pages |
| `fit-options` | every option row fits |
| `check-labels` | no collisions |
| `gaps` | two short pages, below |

`refit … bridge` was run after each content change to Beyond. The last run
was after the content was final, and a later `&nbsp;` change moved nothing.
The page before Answers (page 28) holds only practice questions 27–30, and
the Answers stage opens page 29, as the new repack rule requires.

To get Beyond from 14 pages down to 11:

- the assertion–reason questions moved to Class 7's note form
- two examples were cut: *Anil's 4-digit plus 3-digit sum* (body Example 3
  already works that method) and *3524 and 4253 take the same Kaprekar
  rounds*
- rows were merged in Beyond Examples 2, 4, 5 and 12, and checks were folded into
  Answer rows
- one short Type 1 example (Beyond Example 3, *who can be tallest*) was added to
  fill page 21 from 71% to 93%

**Colour.** Pages 1, 3, 4, 13, 21 and 27 were run through
`build/check-colour.mjs`, and the greyscale and deuteranopia versions of
pages 3 and 13 were looked at. The supercell tint in Figs 3.3–3.7 and 3.16
still separates from white by value in greyscale. The dice keep their dots,
and the pattern boxes keep their printed numbers. On the full-colour proof
of page 21, bronze reads cleanly on the stage numeral, the heads, the
running head and the folio.

### Beyond renumbered to match Class 7 (same day)

Every Class 7 chapter starts Beyond's Solved Examples again at Example 1,
so Beyond's tabs were renumbered from 5–19 to **1–15**. The body keeps its
Examples 1–4. This log names each example as *body Example N* or *Beyond
Example N*. Beyond's one in-text reference, *Check the rule on
Example 5*, now reads *on the example above*, so it cannot be taken for body
Example 1.

- **`check-numbers.mjs`** checks that the body tabs read 1–4 and Beyond's
  read 1–15, both as sets and in page order. Every per-example check is now
  named *body Ex N* or *Beyond Ex N*. If a tab is wrong, the script stops
  and names the tab rather than checking the wrong example. It also checks
  that the new stage 2 list in `ANSWERS.md` matches each Answer row. The
  count went from 612 to **635 checks passed**.
- **`ANSWERS.md`** has a *Stage 2 · Solved Examples* section that lists
  Beyond Examples 1–15 under their own numbers.
- **Break test:** Beyond Example 7's tab was changed to 8. The script
  stopped with exit 1 and named both tab checks. The file was restored,
  its checksum verified, and the script then exits 0.
- **No refit.** The build is unchanged: 29 pages, with the same two short
  pages.
- The assertion–reason note was already a `<p class="c-practice__note">`.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 18 | 42% | the chapter's close (`data-close`); the summary and tip end the body |
| 22 | 83% | Beyond Example 7 (52 mm), a panel that is never divided; 39 mm free |
| 23 | 85% | the `Type 5` head with Beyond Example 10, a heading that may not be stranded; 35 mm free |

Pages 9, 17 and 20 are at 88%, on the bar.

### Flagged

| where | what | what it needs |
|---|---|---|
| Figs 3.3–3.7, 3.16 | Supercells are marked by a tint alone. It survives greyscale by value, but §5a asks for colour to be paired with a label, shape or position. | A decision for the figure style. Body figures were left untouched, since the brief allows layout-only changes to the body. |
| p008 | *In 1949 he discovered…* (Kaprekar) and p014 *In 1937 … Lothar Collatz* are dated facts with no source recorded here. | A source line: the Kaprekar date is usually given as 1946 or 1949 depending on the account, so check it. |
| `ANSWERS.md` 3.8 Q4 and Q6 | The Gandhinagar–Kohima distance is computed from assumed coordinates (23.22° N 72.65° E, 25.67° N 94.11° E). India's north–south extent is taken as about 3200 km (the Government of India figure is 3,214 km). | Confirm the sources before the booklet prints. |
| p017 Ex 3.9 Q8 | Cross-references Table 1.1 of Chapter 1. It exists (`math-ch01-patterns/p002.html`, *Powers of 2*), but it will break if Chapter 1 renumbers its tables. | Nothing now. |
| body, Ex 3.6 Q1(b), (d) | Answers reach 6 digits. `ANSWERS.md` writes them the Indian way (1,00,100), because the chapter prints no 6-digit numbers to follow. | Confirm the volume's convention. |
| stage 1, p102 | *the only one that gives 4 is 8, because 4 could also come from 1*: 4 comes from 8, or from 1 (since $3 \times 1 + 1 = 4$). The sentence is correct but hard to read (L3). | Kept word for word, as the brief requires. A language pass may rephrase it. |
| `settle` / `refit` traps | Not hit here. The body needed no refit, and `settle.mjs` was not used. | — |

### Not changed

NCERT's structure in the chapter body is unchanged. No example, check or
exercise was added inside the body. The nine exercise sets, every Think and
Reflect, and every figure are as they were. None of §5's unused components
was introduced.

## Supercells marked by outline as well as tint, 16 September 2026

A class-wide review (`build/check-fills.mjs`) found that Figs 3.3, 3.5, 3.6,
3.7 and 3.16 marked a supercell only by its pale green fill, which prints at
grey 221 on paper at 251 — the first thing a photocopier loses, and colour
carrying meaning alone, against §5a. Each tinted cell's outline is now the
structural `dg-line` stroke instead of the fine `dg-thin` one: 20 outlines,
nothing else moved, no text changed, no page refitted. `check-numbers.mjs`
reads either outline as a cell and **fails if a tinted cell lacks the heavy
one**, so the fix cannot quietly come undone. 635 checks still pass.
