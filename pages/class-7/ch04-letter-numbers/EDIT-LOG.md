# Class 7 · Mathematics I · Chapter 4 — Letter-Numbers

## Solved examples in examination formats, 23 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 15 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-7/ch04-letter-numbers/`.

Source `build/jee-class7.mjs`; check `build/check-jee-class7.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p112; the answers stage still opens a fresh page.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (b) $100 - (4p + 3n)$ |
| 2 | Single correct | (c) $3x + 3$ |
| 3 | Single correct | (d) $4a + b$ |
| 4 | Single correct | (a) 9 times the centre date |
| 5 | Single correct | (d) $5h + 1$ |
| 6 | Single correct | (b) 11 |
| 7 | Multiple correct | (a), (c), (d) |
| 8 | Multiple correct | (a), (b) |
| 9 | Multiple correct | (a), (b), (c) |
| 10 | Multiple correct | (a), (c) |
| 11 | Numerical answer | 210 |
| 12 | Numerical answer | 150 |
| 13 | Numerical answer | 29 |
| 14 | Matching | (b) P–3, Q–4, R–1, S–2 |
| 15 | Matching | (d) P–2, Q–4, R–3, S–1 |


## Syllabus audit fixes, 17 September 2026

Beyond the Book checked against what the chapter body teaches. The chapter
has no `ANSWERS.md` or `check-numbers.mjs`, so every changed value was
verified by hand, below.

- **Practice Q2, "coefficient".** The body never uses the word. Now "In
  $5x - 8y + 3$, the number that $y$ is multiplied by is"; options and key
  (d) $-8$ unchanged (the body writes such terms as $+(-8y)$).
- **Practice Q27, "constant term".** Now "Which term is only a number?", the
  body's own wording; the answer line says the same. Answer still 2.
- **Example 9, Step 2, negative times negative.** That product is taught in
  Part 2 Chapter 2. The step is now $-2(a - 2b) = -(2a - 4b) = -2a + 4b$,
  the body's sign-change rule, with a `.work__why` in place of the `.chip`
  that carried the product. The check in Step 4 used $-2 \times (-1)$ as
  well, so it now uses $a = 3$, $b = 1$: $3 \times 5 - 2 \times 1 = 13 =
  4 \times 3 + 1$. Key (c) unchanged.
- **Practice Q19 and answer 33(c), the same product.** Answer 33(c) now
  reads $-3(p - 2q) = -(3p - 6q) = -3p + 6q$. Q19 kept as it is (it can be
  done by the body's rule) and given a why-line with that working:
  $8m - 4n - 3m + 6n + m = 6m + 2n$, key (a). Neha's $7p - 11q + 4$ and the
  value 17 at $p = 2$, $q = -1$ re-worked; neither needs the product.
- **Gap, "Formula detective".** New Example 14 under a new *Type 6 ·
  Finding a rule, and finding a position*: a machine table (4, 2 → 10;
  5, 7 → 8; 3, 0 → 9; 6, 6 → 12), rule $3a - b$, every pair re-checked.
  Different from Table 4.9 ($2a - b$) and both machines of Set 4.5
  ($a + b - 2$ and $ab + 1$).
- **Gap, "Describing patterns".** New Example 15: a garland of four
  flowers, positions $4n - 3$ to $4n$, and position 150 ($= 4 \times 38 -
  2$) is a rose. Not 148 (Table 4.11) nor 90, 190, 343 (End-of-Chapter
  Q13, also a pattern of four).
- Both new examples sit after Example 13, so nothing was renumbered.
  Fifteen examples now (thirteen before).

Beyond refitted with `refit.mjs … bridge` (10 pages in, 11 out). Pages
29 → 30. All pages fit, 0 stranded openers, option rows fit, no labels
collide, `check-no-repeats` finds nothing. Short Beyond pages, logged not
padded: 25 (78%, Example 15 would not fit under Example 14), 30 (76%, the
last page).

## Examples set as steps, 16 September 2026

The chapter proper's **12 worked examples** — Examples 1–12, all of them —
were reset as stepped maths, to the shape Beyond the Book already uses and
§5a of DESIGN-MATHS asks for: the question as written, then *Solution.*, then
a step to a `.work__row`, the reason two to four words in a `.chip`, and an
*Answer* row. Only `p001`–`p019` were touched. `p101`–`p110` were not.

**Nothing but the layout changed.** No number, no expression, no question
wording, no order, no section structure. Every reason in a chip is lifted
from the sentence the example already used; where that sentence carried
maths, the clause went into the row's text rather than into a chip, so no
expression was lost to a label. Sentences that explain rather than work —
Example 2's *to use the expression, we replace $n$ by the number of Ls*,
Example 7's *for 3 chairs and 2 tables, that is ₹232*, Example 8's account
of what $p$ and $q$ mean, Example 11's *there are many ways to add them*,
Example 10's *complete Table 4.5 and compare* — stayed as prose before or
after the `.work` block.

**Verification.** `verify.mjs` in the session scratchpad
(`steps-ch04-letter-numbers/`) reads every body page of `HEAD` and of the
working tree as one flow, pulls the twelve `.c-example` blocks out of each,
and compares them example by example:

- the same twelve examples in the same order, under the same tabs;
- each question's first paragraph word for word;
- the set of maths atoms — numbers, letter-numbers, operators — identical
  in both directions. Nothing was dropped and nothing introduced. The only
  differences are counts: a chain split across two rows, or a result
  restated in the *Answer* row (Examples 4, 11, 12 restate; 5, 7, 9 state
  once where the prose had said it twice);
- the set of printed numbers identical in both directions;
- 49 substitutions re-deriving every printed value — the ages, the three
  matchstick counts, the laddu bill, the perimeter, $5c + 3c + 10c = 18c$
  and $4v + 3v = 7v$ at several values, the chair-and-table bill at three
  pairs and the ₹232 check, Charu's total at three pairs and her 25,
  $4(x + y) - y = 4x + 3y$, that $5u$ and $5 + u$ disagree at $u = 2$, all
  three ways of adding Fig. 4.5 against $2r + 2s + 24$ and the 30, and the
  saree positions against the border ABCABCABC.

All pass: *12 examples checked. no difference but the layout.*

**Pages: the chapter proper 18 → 19; the chapter 28 → 29.** Beyond the Book
is unchanged at 10. Refitted with `refit … body`; the stale
`build/class-7/_refit-ch04-letter-numbers*` were deleted.

Builder: **all pages fit**, no `!`, and **no page runs into the bottom
margin at all** — page 8's 2.4 mm, flagged below under the old section, is
gone. No `--head`/`--tail`; `p019` carries `data-close`; every `p1xx` still
carries `data-bridge`. `orphans` **0 stranded openers** — the `h2` stranded
4.8 lines from the foot of page 11 is gone and nothing replaced it.
`fit-options` and `check-labels` clean.

Fill `1:100% 2:86% 3:87% 4:79% 5:87% 6:99% 7:78% 8:88% 9:95% 10:88% 11:87%
12:88% 13:96% 14:97% 15:100% 16:90% 17:97% 18:81% 19:76% 20:98% 21:98%
22:97% 23:89% 24:98% 25:93% 26:96% 27:89% 28:97% 29:68%`.

**Short pages, reported and not padded.** `gaps` names the block holding
each one open; every one is a whole block too tall for the space left, so
repack cannot move it and the only lever would be editing the prose at the
join, which is outside this change.

| page | fill | held by |
|---|---|---|
| 2 | 86% | the next page opens with a table, 31 mm |
| 3 | 87% | a table, 55 mm |
| 4 | 79% | an `h2`, which may not be stranded at the foot |
| 5 | 87% | a `.c-keyidea` — a panel, never divided |
| 7 | 78% | a `.c-example` — a panel, never divided |
| 11 | 87% | an exercise band, 39 mm, already one block per question |
| 18 | 81% | a table, 52 mm |

Page 19 at 76% carries `data-close` and is exempt.

**Flagged.**

| where | what | needs |
|---|---|---|
| Example 10 | **No *Answer* row.** The example asks whether $5u$ and $5 + u$ are equal and deliberately does not say: it sets up the comparison and hands the reader Table 4.5, and the chapter states the result in the paragraph after the table. An *Answer* row here would print the answer above the table that asks for it | nothing, unless the chapter would rather state it and drop the table |
| Example 2, Step 3 | the step is *if $n$ stands for the number of Ls*, which names a letter rather than working a line | nothing — the naming is the step the example makes |
| pages 2, 3, 4, 5, 7, 11, 18 | under 88%, each held by a block that cannot move | a prose edit at the join, not a refit |

## Beyond the Book, rebuilt 15 September 2026

Only `p101`–`p110` changed. The chapter proper (`p001`–`p018`) was not
touched. The §5 rebuild of the body made the same day was reverted at the
user's request; its pages and `ANSWERS.md` are kept as a backup in the
session scratchpad (`rebuilt/pages/class-7/ch04-letter-numbers/`), and were
used here only as a source. The old section, eight pages, is in
`beyond-ch04-letter-numbers/before/` beside it. The *Beyond the Book* and
*Fitting* notes further down describe that old section and are superseded.

**The four stages, 8 pages → 10.**

1. **Using What You Know** — the chapter's existing stage, word for word
   (checked by script against the old pages). Only its `.c-stage__for`
   line was removed.
2. **Solved Examples** — 13 examples in five types, in the chapter's order,
   each a question, *Solution*, stepped working with a short reason, and an
   *Answer* row (a letter for a multiple-choice example).
   - Type 1 · Writing an expression from a situation (1): Ex 1, change from ₹100 — old Problem 2.
   - Type 2 · Arithmetic expressions with brackets (3): Ex 2–4 — the reverted rebuild's Examples 5, 6, 7 ($45 - 3 \times (8 + 2)$; Sameer's ₹500; $50 - (20 - 6)$).
   - Type 3 · Values of algebraic expressions (3): Ex 5–7 — rebuild Examples 8, 10, 9 ($6p - 7$; $3(a - b)$ at $b = -5$; the auto-rickshaw fare).
   - Type 4 · Simplifying expressions (2): Ex 8–9 — old Problems 1 and 4.
   - Type 5 · Patterns that always hold (4): Ex 10 the 3 × 3 calendar square (old Problem 5), Ex 11 hexagons (old Problem 3), Ex 12 no step uses 150 matchsticks (rebuild Example 20), Ex 13 tables in a row (rebuild Example 19).

   The old problems' option-by-option paragraphs and the stage's two linking
   paragraphs went with the prose format; the working is now the steps.
3. **Practice** — one band, 36 questions in one run.
   - Choose the correct option, Q1–21: old Set A 1, 4, 9, 7, 10, 8; old Set B 8, 7, 2, 4, 5; old Set C 1, 3, 4, 5, 6; rebuild End Q1, Q6, Q2, Q3, Q4. Easier first. In Q2 and Q6 the options were reordered so the key is not mostly (a) and (b).
   - Assertion and reason, Q22–25: rebuild End Q9, Q10, Q11; old Set B 6 (recast from four printed options to the note's key).
   - Very short answer, Q26–30: rebuild End Q13, Q12, Q15, Q16, Q14.
   - Short answer, Q31–32: **new** (a rectangle's perimeter from $2x + 3$ and $x - 1$; a triangle's third side). Every short-answer question in the rebuild is already one of the body's End-of-Chapter questions.
   - Long answer, Q33–34: **new** ($5(2p - q) - 3(p - 2q) + 4$ simplified, checked at a value, and a sign mistake found; Meena's family's ages). Same reason.
   - Case-based, Q35–36: rebuild End Q31 (the trip) and Q32 (Kavya's tiles). The *Case study* label and the Table 4.15 caption were dropped, as in the approved Chapter 1, and each scene was cut by a line while fitting.
4. **Answers** — the key for 1–11, 12–21 and 22–25; answers for 26–36 as
   trace rows; *Why the other options are wrong* for Q14, 18, 21, 23 and 25.
   The old stage's closing *three things to keep* paragraph is not in the
   approved shape and went.

**Excluded as duplicates of the chapter proper.** Rebuild Examples 1–4 and
11–18 (the body's Examples 1–12). Rebuild End Q7–8 and Q17–30 (the body's
End-of-Chapter Q1–16). Old Set A 6, the perimeter of a triangle with three
equal sides (Exercise Set 4.1 Q1). Old Set C 2, row 20 column 3 of Table
4.14 (End Q15). Old Set C 7, Charu and Krishita's scores (Example 8 and its
follow-up). Rebuild End Q5, the $n$th term of 3, 6, 9, … (the 4.3 text on
4, 8, 12, …).

**Excluded as near-duplicates inside the run.** Old Set A 3 ($4 \times p
\times q$; Q26 kept), A 5 ($6y - y$; Q29 kept), A 2 ($3k - 2$ at $k = 5$;
Q30 kept); old Set B 1 ($2(n + 4) = 2n + 4$; Q24 kept) and B 3 ($3x + 2x$;
Q22 kept).

**Verification.** `verify.mjs` in the session scratchpad
(`beyond-ch04-letter-numbers/`), 131 checks, all passing: the numbers in
Stage 1; every step of every example; each multiple-choice question and
example tested at 180 substitutions to have exactly one correct option,
and that option the printed letter; the hexagon and table counts by
simulation; the truth of each assertion and reason; every trace answer and
every *why* row. A second script compared the printed key with the verified
letters. No reused item was wrong.

**Fitting.** `refit … bridge` four times, with block heights measured on the
built page and a small packing search over example orders
(`heights.mjs`, `plan.mjs`). What changed to close the white:

- Examples 3 and 6 each merged two lines of working into one.
- The fare example moved from Type 1 to the end of Type 3 (it finds a value as well as writing an expression), leaving Type 1 with one example. Type 5 follows the chapter: calendar, then the two matchstick patterns, then the tables.
- Example 9 gained a *check with values* row at $a = b = 1$, like the checks in Examples 10–12. It was added while fitting and lifts page 22 from 86% to 89%.
- The two case scenes were each cut by a line. Q34's parts became phrases under one instruction, set in two columns. Answer rows 33 and 36 and the five *why* rows were shortened.

Builder: all pages fit. Beyond the Book fills `19:98% 20:98% 21:97% 22:89%
23:98% 24:93% 25:96% 26:89% 27:97% 28:68%`, the last page exempt. Nothing
on a Beyond page runs into the bottom margin; no stranded opener; no
`--head`/`--tail`; `fit-options` and `check-labels` clean; every `p1xx`
carries `data-bridge`.

**Flagged.**

| where | what | needs |
|---|---|---|
| body page 8 | runs 2.4 mm into the bottom margin | the body refit, not this section |
| body page 11 | an `h2` 4.8 lines from the foot (`orphans`) | the same |
| body pages 3, 5, 10, 11, 12, 17 | under 88% full | the same |
| Example 9, Step 4 | added while fitting | nothing, unless it reads as one step too many |
| Q16, Q20 | close in idea to Stage 1's three numbers in a row and its number trick | nothing — practice after the idea, in new numbers |
| Q36 | the same expression, $2n + 2$, as Example 13, in a new setting | nothing |

Written new from NCERT *Ganita Prakash*, Grade 7 Part I, Chapter 4,
*Expressions Using Letter-Numbers* (textbook pages 81–105, answer key after
them). Original LearnLab text in NCERT's order of topics and questions; no
sentence is carried over. Crown Quarto, house design, palette `violet`.

Sections keep NCERT's numbering: 4.1 Letters for Numbers · 4.2 Arithmetic
Expressions Again · 4.3 Leaving Out the Multiplication Sign · 4.4 Simplifying
Algebraic Expressions · 4.5 Patterns and Relationships. The source's
subtopics (*Formula Detective*, *Algebraic Expressions to Describe Patterns*,
*Patterns in a Calendar*, *Matchstick Patterns*) are `h3`. Its *Figure it
Out* and *Mind the Mistake* blocks are Exercise Sets 4.1–4.5, and its closing
set is the End-of-Chapter Exercises, Questions 1–16.

## Every printed number re-derived

| where | answers |
|---|---|
| 4.1 in text | Shabnam 21 · Aftab 17 when Shabnam is 20 · 8 coconuts and 9 kg: ₹820 · 7 and 4: ₹485 · square of side 7 cm: 28 cm |
| Set 4.1 | 1: $3a$, $5a$, $6a$ · 2: $20 + k$ · 3: 430; 560; $880 + 5z$; $100x + 20y + 5z$ · 4: (d) · 5: $d + 5$, $d - 4$, $13 \times d - 2$, $2 \times d - 13$ · 6: open · 7: top row $w - 8$, $w - 7$, $w - 6$; bottom right $w + 1$ |
| Set 4.2 | 40, 56, 82, 100 |
| Set 4.3 | 1 (a) 14, the minus sign of $-4$ lost (b) 18, $3d$ read as the digits 36 (c) 19, worked as $3 \times (7 - 2)$ (d) 17, $2r$ read as 28 (e) correct (f) $-15$, 19 is $3 \times 6 + 1$ · 2 (a) 4 (b) 11, worked as $2 \times 4 \times 3$ (c) 8, since $3 - 6 = -3$ · 3 ($x = 3$, $y = -2$): 10, 10, $-1$, 11 |
| 4.4 in text | pencils at $c = 50$: ₹900 · erasers $4d + 6d + d = 11d$ · total $18c + 11d$ · Charu, $p = 4$, $q = 1$: rounds 25, 28, 22; total $21p - 9q = 75$ · no penalty: $q = 0$ · Krishita more by $2p + 2q$ · Table 4.5: 25, 10; 40, 13; 55, 16 · Table 4.6: $-3$, $-30$; 67, 40; 97, 70 |
| Set 4.4 | 1: $10y + 2x - 4$; $8p + 12q + 2$; $60k - 20g$ · 2: $4p$, $3p + q$, $2p$, $2p - 2q$, $2q$, 0, $-2q$, $-d$, $-c$, $c$, $2d - c$, $d - 2c$ · 3 (Table 4.7): $3a + 2b$; 0 is right; $6p + 12$; $x - y$; $3 + 6z$; $x + 5$ · 4 (Table 4.8): $5y - 6$; $6p + 3q$; $30w + 15x$; $3j + 6k + 9h + 12$; $8r + 12s + 20$ · 5: at most one term per letter-number, plus at most one number term |
| 4.5 in text | Table 4.9: $2 \times 9 - 3 = 15$, $2 \times 6 - 5 = 7$, $2 \times 8 - 6 = 10$ · positions 99 C, 122 B, 148 A · plus shape $(a - 7) + (a - 1) + a + (a + 1) + (a + 7) = 5a$ · matchsticks: Step 33 67, Step 84 169, Step 108 217; flat $y$, sloping $y + 1$ (Step 3: 3 and 4; Step 4: 4 and 5) |
| Set 4.5 | Machine A $a + b - 2$ · Machine B $ab + 1$ |
| End | 1 (a) · 2 (a) · 3 (a) $10u - 10d$ (b) it ends below where it started, by $10(d - u)$ cm (c) $10u - 9d$ · 4: $105 + 21z$ · 5 (Table 4.13): $w - 3$, $3w - 9$; $w - 2$, multiply by 3; $2w + 4$, $2w - 4$ · 6: 22 minutes; $4t + 6$ · 7: $4a + 5b + 10$; $a - 13b - 16$; $12x + 6$; $6x + 15$; $h + 4$; $21m - 20n + 5$ · 8: $13d + c - 2$; $7f + 4s - 4$; $2c - d - 2$; $-7f - 4s + 3$; 0; 0 · 9: $-3a + 15b - 32$; $18x + 16y - 23$; $-27g + 10h + 2$; $-3a - 3b - 32$; $-13x - 13y + 6$; $-16g + 3h + 30$ · 10: open · 11: 12 pieces; $r + 2$ · 12: 31; $3w + 1$ · 13: 90 yellow, 190 yellow, 343 green; red $4n - 3$, green $4n - 1$, yellow $2n$ · 14: 17, 41, 201; $4n + 1$; counting corners $16n + 4$ · 15: column $c$ holds $4(r - 1) + c$; 124 row 31 column 4, 147 row 37 column 3, 201 row 51 column 1; open · 16: both diagonals $2a + 5$ |

Beyond the Book: Stage 1 — $3n$ and $n + 3$ differ at $n = 5$; the trick gives
$2n$; three in a row sum to $3m$; $2(n + 5)$ is larger by 5; 99 is the 24th
term of 7, 11, 15, … and 100 is not a term. Stage 2 — (a) $3x + 3$; (b); (d)
$5h + 1$; (c) $4a + b$; (a) $9a$, checked on the dates 3–5, 10–12, 17–19
(sum 99). Set A c d a b c d a d b c; Set B d c a d b b c b; Set C d d b a c c b.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| *Math Talk*, *Try This* | plain questions or Think and Reflect | no such labels in the library |
| Fig. 4.1, a table of ages drawn as a picture | Table 4.1 | a table is the book's form for it |
| seven expressions to evaluate, three worked | the three worked in the text; Exercise Set 4.2 asks the other four | a set printed below the working that answers it gives the answers away |
| *Mind the Mistake* (values): nine items in one list | Set 4.3, Q1 (one letter-number) and Q2 (two) | the single 96 mm block held a page open; the split follows the maths |
| *Mind the Mistake* (simplest forms): one table of eleven | Tables 4.7 and 4.8, Set 4.4 Q3–Q4 | the same, for a 108 mm table |
| row 6 of that table, given form "2x − 6" | "2x + 3" | the printed form cannot be read reliably; either is a wrong answer to find |
| number machines drawn as Y shapes | Tables 4.9 and 4.10, with invented inputs | see FLAGGED |
| the path diagram from $w + 2$ | Table 4.13 | see FLAGGED |
| Example 11 and Set 4.4 Q1 pictures | Figs. 4.5 and 4.6, drawn from the working and the key | see FLAGGED |
| Table 4.3 (Krithika): four rows | five (5, 0, 12 added) | added while fitting; answer 560 |
| snail question: two parts | three ((c) 10 days, 9 nights) | added while fitting |
| rope folded "10 times" | folded back and forth like a zig-zag, $r$ times, lying in $r + 1$ layers | the key's $r + 2$ is true only for that kind of folding; halving the rope each time gives $2^r + 1$ |
| squares pattern: "count the vertices" | "count 4 corners for every square, even where squares share a corner" | the key's $16n + 4$ counts shared corners more than once |
| grid of 4 columns: four rows shown; 15 questions | five rows; Q16 on diagonal sums in the grid | added while fitting; answer $2a + 5$ |
| the snail key: "will never reach the top" | "ends below where it started" | the question has no top |

## Errors found in the source

| where | source says | correct | note |
|---|---|---|---|
| End Q3(b) (key) | the snail "will never reach the top" | it finishes $10(d - u)$ cm below its start | the question asks about the movement, not a top |
| End Q11 (key) | $r + 2$ pieces | $r + 2$ only for zig-zag folds | the question now says so |
| End Q14 (key) | $16n + 4$ vertices | true only counting shared corners again | reworded |
| *Mind the Mistake* key, row 6 | the given form printed garbled | — | replaced, see above |
| p. 89 | "sale" printed as "scale" | — | spelling |

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| Tables 4.9 and 4.10 (number machines) | — | **Invented inputs.** The source pictures could not be read. Machine rules are the key's ($a + b - 2$, $ab + 1$); every pair was chosen to fit them, and the worked machine $2a - b$ has invented pairs | check against the source, or keep as original |
| Table 4.13 (path from $w + 2$) | — | **Reconstructed.** The given ends ($4w + 20$, $3w - 6$) are the source's; the other operations were chosen | as above |
| Figs. 4.5 and 4.6 | — | **Reconstructed** from Example 11's working and the key's column sums; (ii) has four empty places | as above |
| Figs. 4.1, 4.2, 4.3, 4.4, 4.7–4.11 and the opener sketch | — | Drawn from the text's description | check against the source pictures |
| Fig. 4.5 before Example 11 | — | The figure precedes the example that uses it, so the two face each other across the spread | nothing, unless a later refit parts them |
| Set 4.3 Q2(c) | C4 | The given value 4 has no obvious slip behind it | nothing — the task is still to find the right value, 8 |
| Stage 1, three numbers in a row | M3 | Uses $(m - 1) + m + (m + 1)$ with the middle number as $m$; the chapter never chose a letter this way | nothing — the choice is explained in the text |

## Beyond the Book

Four stages, 8 pages. Stage 1: $3n$ against $n + 3$; the add-5-double-take-10
trick; three counting numbers in a row; $2(n + 5)$ against $2n + 5$; whether 99
and 100 are in 7, 11, 15, …. Stage 2: a bracket after a minus sign; change from
₹100; hexagons in a row; two brackets; a 3 × 3 square of dates. Sets A (10),
B (8, three assertion–reason), C (7, tiered). No named method, no coaching
vocabulary, no examination named.

## Fitting

Result: 20 pages of chapter proper and 8 of Beyond the Book. Every page is
at least 88% full except the two closing pages (page 20, which carries
`data-close` and holds the summary and tip, and the answer page). No
stranded openers, no colliding labels, every option row fits, and nothing
runs past the measure.

The first refit left eight short pages, most held open by a few tall
blocks: a nine-part list (96 mm), an eleven-row table (108 mm), and two
examples a line too short to count as seated openers. Those were split
(Set 4.3 into two questions; the simplest-form table into Tables 4.7 and
4.8, renumbering 4.8–4.13 to 4.9–4.14) or lengthened. The remaining joins
were closed with line-sized edits chosen by replaying `repack`'s packing
rule on the measured blocks and searching for the smallest set that left no
page short: a line added to the opening paragraph, the Aftab and Parthiv
paragraphs, Examples 7, 8 and 11, the question after Example 7, Charu's
follow-up and the Set 4.4 Q1 stem; a line cut from the 4.5 opening. Page 6
took the rule that a number next to a bracket means multiply, which Set 4.3
used before the text had said so, and a third question on values; page 12
took two lines under the 4.5 heading so the heading seats five lines.

Proofs: the chapter title *Expressions with Letter-Numbers* ran into the
opener sketch, so the chapter is titled *Letter-Numbers*. A formula at the
end of a sentence in Example 12 pushed its full stop onto the next line;
the sentence was rephrased.


## 21 September 2026 — figure/table reference review

Reviewed this chapter in the all-maths reference audit. Figures and tables now use one chapter sequence, including Beyond the Book; captions and references were updated together. 3 dependent text/visual group(s) were kept together and the body refitted. Questions, calculations and artwork were preserved. The chapter and its volume were rebuilt; detailed layout checks and any remaining warnings are recorded in build/_all-maths-reference-checks/.

## 24 September 2026 — NCERT title

The chapter now carries NCERT's own title, *Expressions using Letter-Numbers*, taken from the chapter's first page in the NCERT textbook, in place of the house title it had. Changed in `chapter.json` and the opener heading in `p001.html`; nothing else in the chapter uses the title.
