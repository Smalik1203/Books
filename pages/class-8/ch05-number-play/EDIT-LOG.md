# Class 8 · Mathematics I · Chapter 5 — Number Play

## The maths-v2 conversion, 26 September 2026

**This supersedes every description of the body, Beyond the Book and the
checks further down this log.** Converted with CONVERT-V2.md, Class 6
Chapter 1 as the model. `chapter.json`: design `maths-v2`, palette
`prism-amethyst`, edition `196x276-large`, `keepExerciseSets`, accent
`#644d75`. **38 pages**: body p001–p020 (20, Summary p020 `data-close`), By the
Book p090–p095 (6, p095 `data-close`), Beyond the Book p101–p112 (12).

**No NCERT expression.** The body keeps NCERT's topics, order, definitions and
methods, and everything else is rewritten with our own contexts, numbers and
names (Meher, Nisha, Kiran, Farid, Aarav, Ishita). Gone: Anshu, Guna,
Tathagat, Snehal, Sreelatha, Deepak and their claims; the pebble and
digital-root riddles; NCERT's statement list (8, 7, 12, 9 and 4, 6 and 4) —
now 6, 5, 18, 5, 5 and 6, 10 and 4, 4; the tree for 3, 4, 5, 6 (now 7, 8, 9, 10
with every leaf written); the token explanation and its figure; NCERT's
cryptarithms (A1 + 1B, ON + ON + ON, PQ × 8, GH × H, BYE × 6 and the rest);
the numbers 427, 7309, 320185, 328105, 462 and Table 5.13's rows; the
Navakankari game corner. Section and subsection heads are in our own words
(5.1 Reasoning About Multiples, 5.2 Quick Tests for Divisibility, 5.3 Puzzles
With Hidden Digits). New figures in `.dg-*`: the sign tree, rows of six
(Statement 1), blocks of five (Statement 3), 6k + 4, 538 in bars, four
addition cryptarithms, Venn diagrams for 3, 6, 18; the two rows-of-four
figures were kept. Figures and tables renumbered in one sequence (5.1–5.14)
after the token figure went.

Added teaching: sums of two and three consecutive numbers with letters; the
term *counterexample*; the two parts of Statement 2 always going together; the
test for 2 worked; a key idea and **Example 1** (the remainder of a sum) in
§5.1; a fourth Think and Reflect question; Think and Reflect in §5.2 (digital
roots) and §5.3. Body examples 1–6. Every section has a key idea and a Think
and Reflect.

**Exercise sets** 5.1 (8 Q), 5.2 (4), 5.3 (4), 5.4 (8) are all new questions,
each kept whole on one page, each ending in a `.c-practice__note` citing NCERT
by section — *NCERT, Figure it Out, §5.1, Q1–8*; *§5.2 (the test for 9),
Q1–4*; *§5.2 (digital roots), Q1–4*; *§5.3, Q1–16*. Page numbers were not
cited: the log below gives only scattered NCERT pages (125, 128, 129, 131,
133, 135), not the start of each set.

**By the Book** (p090–p095): 50 questions, 10 · 10 · 10 · 5 · 5 · 10, one
numbered run, BY-THE-BOOK.md §4 Class 8: letters in word problems (Q16, 21, 26,
27, 28), algebraic *Show that* (Q6, 10, 12, 22, 23, 25, 29, 30), *In the given
figure* (Q17, a Venn diagram), a find-the-mistake short answer (Q14), a
multi-statement MCQ (Q48), a named student's method (Q49), case passages of
52–60 words, four with a table. Raw material from the old practice set: Q2–4,
15, 24, 25, 31–34, 36–37, 41–44, 50. A–R keys a d b c a; objective keys a ×2,
b ×3, c ×3, d ×2. Six pages, not five: the 50 questions came to 5.7 pages.

**Beyond the Book** (p101–p112): the six tried-and-explained questions kept
word for word with no stage head; then Single correct · More than one correct
· Numerical answer · Matching · Paragraph-based. Examples kept from the old 15:
old 1, 6 (single), 9, 10 (multiple), 12, 13 (numerical), 14 (matching); old 15
(matching tests, 115 mm, would not pack) was replaced by a new matching example
on remainders; two new paragraph-based examples (a locker code, a list rising
by 8). Format tags and "Choose one correct option" lines removed; Check rows
added to Examples 5, 6 and 10. Fifteen new practice questions (4 · 4 · 3 · 2 ·
2). Answers stage without numeral on a fresh page: By the Book key in two-row
`.work--trace` runs and `.c-answers` letters, then Beyond's key.

`stage2-bank.mjs` is deleted (it generated the old Stage 2). `ANSWERS.md` and
`check-numbers.mjs` are rewritten for this layout.

**Checks at close.** `build.mjs`: all pages fit, every page ≥ 88% except the
Summary, p095 and p112. `lone-words` 0; `check-sums` 149 identities, 0 wrong
(three `4(2 + 5)` spans rewritten as `4 \times (2 + 5)`, which the tool cannot
parse); `orphans` 0 stranded; `check-labels` no collisions; `fit-options` every
row fits (two option lists narrowed with `--fix`). `check-numbers.mjs`: 449
checks, 0 failed — identities, key completeness, every objective, A–R, single
and multiple-correct option recomputed, every cryptarithm solved by brute
force, exercise answers recomputed; a planted wrong key letter is caught.

## Written from the NCERT chapter, 24 September 2026

The chapter did not exist: Class 8 Part I was found to be missing NCERT's
current Chapter 5. It was written new, body and Beyond the Book, in one pass.

**Source.** NCERT *Ganita Prakash*, Grade 8 Part I, Chapter 5 *Number Play*,
Reprint 2026-27 (book pages 113–135; the PDF also carries NCERT's own answer
pages, which were read but not trusted — every answer here was re-derived).
The pages are original LearnLab text that follows NCERT's order of sections,
subsections, figures and questions; no sentence is copied, and the pebble
poem and the digital-root riddle, which are verse in NCERT, are set as prose
riddles with the same conditions.

**Pages: 32** — 20 body (p001–p020) + 12 Beyond the Book (p101–p112), on the
196 × 276 page, palette teal. Build: *all pages fit*.

### The body, in NCERT's order

| NCERT | here |
|---|---|
| 5.1 Is This a Multiple Of? — Sum of Consecutive Numbers; signs between four numbers, Explanations 1–3; Breaking Even; Pairs to Make Fours; Always, Sometimes, or Never (Statements 1–8); What Remains?; Figure it Out (8) | §5.1, the same subsections, **Exercise Set 5.1** (Q1–8) |
| 5.2 Checking Divisibility Quickly — 10, 5, 2; the shortcut for 9; Figure it Out (4); 3; 11; the fill-in table; More on Divisibility Shortcuts; Digital Roots; Figure it Out (4) | §5.2, **Exercise Set 5.2** (Q1–4) and **5.3** (Q1–4) |
| 5.3 Digits in Disguise — four addition cryptarithms, PQ × 8, GH × H, BYE × 6, six to solve; Figure it Out (16) | §5.3, **Exercise Set 5.4** (Q1–16) |
| Summary; *Navakankari* | `.c-summary`; the game and its board, on the last body page (`data-close`) |

NCERT's *Figure it Out* sets are *Exercise Set 5.1–5.4*, the volume's name
for them. NCERT prints no numbered examples; five of its own worked
instances are set as stepped examples (Solution, Step rows, Answer), with
their numbers unchanged: **Example 1** 427 ÷ 9, **Example 2** 7309 ÷ 9,
**Example 3** 320185 and 11 (excess and shortfall), **Example 4** 328105
(alternating signs), **Example 5** Guna's PQ × 8 = RS. Nothing else was
added to the body. Key ideas state the rules the chapter proves (parity of
sums; sums and differences of multiples; multiples of a multiple; factors of
a divisor; LCM; divisibility by 9, 3 and 11). Terms glossed with `.term`:
*consecutive numbers, parity, conjecture, digital root, cryptarithms*.

**Figures** (inline SVG in the `.dg-*` vocabulary; figures and tables numbered
in one sequence): Fig. 5.1 the sign tree for 3, 4, 5, 6; Table 5.2; Fig. 5.3
the tree for a, b, c, d; Fig. 5.4 the two kinds of even number; Table 5.5 the
cases; Fig. 5.6 (4p + 2) + (4q + 2); Fig. 5.7 8a + 8b; Fig. 5.8 (7j) × m;
Fig. 5.9 5k + 3; Table 5.10; Fig. 5.11 427 in bars of 99 and 9; Table 5.12
place values and 11; Table 5.13 the fill-in table; Fig. 5.14 the addition
cryptarithms; Fig. 5.15 the Venn diagrams (with Q16 in one
`.c-figure-context`, so question and figure print together); Fig. 5.16 the
Navakankari board.

### Beyond the Book — the four stages of the model chapter

1. **Using What You Know** — six questions, each tried in a `.c-try` and
   explained in running text: two piles of cards (parity of a total); 36
   fours and 9, 11, 12; numbers equal to 4 × their digit sum; AB + BA = 121;
   checking a product by digital roots; abcabc and 1001 = 7 × 11 × 13. New
   (there was no earlier stage to keep word for word).
2. **Solved Examples** — 15, in the order 6 single, 4 multiple, 3 numerical,
   2 matching, generated by `stage2-bank.mjs` with `panel()` and `matching()`
   from `build/jee-tools.mjs` and the conventions of `build/jee-class8.mjs`
   (which was not edited). Single-correct keys c a d b a d.
3. **Practice** — 31 questions, one numbered run: 15 multiple choice, 4
   assertion–reason, 3 very short, 4 short, 3 long, 2 case-based. Key letters
   a ×5, b ×5, c ×4, d ×5.
4. **Answers** — the letter key and the written answers, on a fresh page.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (c) $2n^2 + 7$ |
| 2 | Single correct | (a) 4 |
| 3 | Single correct | (d) 2 |
| 4 | Single correct | (b) 7 |
| 5 | Single correct | (a) 2 |
| 6 | Single correct | (d) 97 |
| 7 | Multiple correct | (a), (b) |
| 8 | Multiple correct | (a), (b), (c) |
| 9 | Multiple correct | (a), (b), (c) |
| 10 | Multiple correct | (a), (c), (d) |
| 11 | Numerical answer | 1 |
| 12 | Numerical answer | 22 |
| 13 | Numerical answer | 10 |
| 14 | Matching | (c) P–3, Q–1, R–4, S–2 |
| 15 | Matching | (b) P–4, Q–3, R–2, S–1 |

**Nothing repeats or answers the body**, read question by question and run
through `build/check-no-repeats.mjs` (six pairs at 50–67%, all the same
*kind* of question with other numbers: a remainder by 9, a digital root).
Three drafts were replaced because they gave a body answer away: a Stage 1
question on ±1 ± 2 ± … ± 10 (its reasoning answered the body's *is it
limited to four numbers?*); a Stage 2 example squaring 9k + 4 (it needed
an identity the volume has not taught, and was replaced by *7 more than*);
and a matching step explaining the 4 and 8 tests by 100 and 1000 (the body
asks the reader to explain exactly that). Practice avoids n(n + 1) and three
consecutive numbers (Exercise Set 5.4 Q14, Q12(ii)).

### Verified

- `check-numbers.mjs` — **452 claims hold**: every arithmetic equation on
  every page, in `ANSWERS.md` and in the bank (224 evaluated); every body
  exercise answer by search or brute force (all cryptarithms solved over
  every digit assignment; the 48a23b and 3p7q8 pairs; Table 5.13 row by row);
  every Stage 2 option recomputed, so a secretly right distractor fails; each
  practice MCQ and A–R has exactly one right option and it is the keyed one;
  the written key read back part by part; `ANSWERS.md` carries the same key.
  Break-tested: a wrong key letter, a wrong table value, a wrong Stage 2 key
  and a wrong code digit were each caught.
- `build.mjs` — all pages fit, no design violations. `orphans` — 0 stranded
  openers. `fit-options` — every option row fits. `check-labels` — no labels
  collide. `check-maths-captions` — every caption follows its artwork.
- `check-example-stepping` and `check-body-maths` compare a chapter against
  git HEAD; this chapter has no HEAD, so both report everything as new ("0
  examples at HEAD, 5 now") — not applicable to a chapter written new.
- §4.8 greps: `c-stage__for` 0, `c-case__label` 0, `c-practice__num` 1;
  5 body examples, 5 Answer rows; `data-bridge` on every p1xx; `data-close`
  on p020; no `--head`/`--tail`, no inline style.
- Every page's PNG proof was read.

### Flagged

| where | what | needs |
|---|---|---|
| p016, Aryabhata II | *Aryabhata II (c. 950 CE), Mahāsiddhānta, describes the digital root; the method was used to check arithmetic.* Source: NCERT Ganita Prakash Grade 8 Part I, Reprint 2026-27, p. 131 — the only source. | an independent historical source before press (DESIGN-MATHS §5a, facts) |
| p020, Navakankari | the names *Sālu Mane Āṭa, Chār-Pār, Navkakri* and the equation with Nine Men's Morris are from NCERT p. 135 only | the same |
| NCERT p. 128 | NCERT works the excess/short method on **320185** and then says "the number 3,28,105 is 3 short"; its alternating-sign example uses **328105**. Both numbers give −3, so the mathematics survives. Here Example 3 is 320185 throughout and Example 4 is 328105 | none; recorded so a reader comparing with NCERT is not puzzled |
| NCERT p. 129, Table 5.13 | NCERT's printed first row gives 128 as **not** divisible by 4. 128 = 4 × 32; NCERT's own answer page says Yes. Printed here as Yes | none — a wrong number in the source, corrected |
| NCERT p. 125 | NCERT says repeated digit sums give "the remainder" on division by 9; for a multiple of 9 they give 9, not 0. The key idea here says so | none |
| NCERT p. 133, Q14 | NCERT reads "the product of these consecutive integers"; *three* is meant and is printed | none |
| NCERT answers | NCERT's key gives one solution each for ON + ON + ON = PO and L2N × 2 = 2NP and PP × QQ = PRP; brute force finds 3, 2 and 3. `ANSWERS.md` gives them all | none |
| body, *between 600 and 700* and *between 45000 and 47000* | read as strictly between: 700 (digital root 7) and 45000 (a multiple of 36) are left out, and `ANSWERS.md` says so | none |
| NCERT visuals not redrawn | the dot-row pictures for Statements 2, 4 and 5, the 11-row pictures beside Table 5.12, the bar pictures for 7309 and 320185 and the token model: each is carried by the table, the key idea or the stepped example beside it | redraw if a reviewer wants every NCERT picture |
| short pages | body p001 (84%, Fig. 5.1 next), p005 (80%, Fig. 5.6), p009 (73%, the Exercise Set 5.1 band cannot seat five lines), p010 (81%, the §5.2 heading); Beyond p103 (81%), p105–p107 (87%, 76%, 77%), each held by a whole Stage 2 panel; p111 (75%) before the Answers stage, which opens a fresh page. `gaps.mjs` names a figure, a panel, a band or a heading for each | nothing to pad |
| Stage 2 number style | as in the model chapter's bank, plain numerals sit beside $…$ maths in the examples | a volume-wide decision, not this chapter's |

Tools used and not kept: a figure generator and a cryptarithm solver in the
session scratchpad; the solver's logic is reproduced in `check-numbers.mjs`.
