# Class 7 · Mathematics I · Chapter 2 — Terms and Brackets

## Beyond the Book, rebuilt 15 September 2026

Only `p101`–`p110` changed. The chapter body (`p001`–`p016`) was not
touched. The §5 body rebuild made earlier the same day was **reverted at the
user's request**; its pages, `ANSWERS.md` and log are kept as a backup in the
session scratchpad (`scratchpad/rebuilt/pages/class-7/ch02-arithmetic-expressions/`),
and were used below only as a source. The Beyond pages as they stood before
this rebuild (p101–p109) are backed up in
`scratchpad/beyond-ch02-arithmetic-expressions/old-beyond/`.

**Pages.** 9 → 10 (`p101`–`p110`), every one `data-bridge`, no `--head` or
`--tail`. Fill: 96 · 98 · 95 · 100 · 97 · 95 · 89 · 99 · 97 · 81 (last).

**The four stages**, in the shape of Chapter 1:

1. **Using What You Know** — the chapter's existing tried-and-explained stage,
   five `.c-try` questions, word for word. Only its `.c-stage__for` line was
   deleted.
2. **Solved Examples** — 14 examples, stepped (Solution → Step → Answer),
   under six `h3` types in the chapter's order:
   Type 1 · Comparing without finding the values (2) · Type 2 · Brackets (2) ·
   Type 3 · Terms and the order of working (2) · Type 4 · Adding terms in any
   order (2) · Type 5 · Removing brackets (2) · Type 6 · The distributive
   property (4).
3. **Practice** — one band, one run of 33 questions: choose the correct option
   16 · assertion and reason 5 · very short answer 5 · short answer 3 · long
   answer 2 · case-based 2.
4. **Answers** — letter key in two rows (1–11, 12–21), a `.work--trace` row
   for each of 22–33, and six rows of *Why the other options are wrong* (5,
   12, 16, 18, 19, 20).

The old stage heads *Behind Each Answer*, *Problem Sets* and *Answers &
Takeaways*, the Set A/B/C bands and the closing takeaways paragraph are gone.

### What came from where

**Examples.**
- Reverted rebuild's worked examples, converted to steps: its Example 2 (27 + 8 = __ + 10) → Ex 1; 5 (Anil and Bina) → Ex 2; 7 (4 × (12 − 5)) → Ex 3; 9 (terms of 25 − 4 × 3 + 8 ÷ 2) → Ex 5; 11 (136 + (−58) + 64 + (−42)) → Ex 7.
- Reverted rebuild's Exercise 2.6 items, which are not in this body: Q3(a), 102 × 45 → Ex 11; Q4, Rehana's 25 × 16 = 400 → Ex 13.
- The old *Behind Each Answer* problems, kept with their options and turned into steps: Problem 1 (250 − (80 − 30)) → Ex 10; 2 (40 − 4 × 6 + 12) → Ex 6; 3 (Tinku, 27 × 99) → Ex 12; 4 (6 × 13 + 6 × 7) → Ex 14; 5 (Kiran) → Ex 4.
- New: Ex 8 (487 − 256 + 113 − 44) and Ex 9 (64 − (−18 + 30)), so that Types 4 and 5 each have two.

**Practice**, by question number:
- From the old Set A: 1 (A2), 2 (A6), 4 (A1), 9 (A9), 10 (A8), 11 (A10).
- From the old Set B: 13 (B7), 17 (B8), 20 (B3), 21 (B6).
- From the old Set C: 14 (C1), 15 (C6), 16 (C5).
- From the reverted rebuild's end-of-chapter set: 3, 5, 6, 7, 8 and 12 (its 3, 1, 2, 4, 5 and 8); 19 (its 10); 22–25 (its 15, 12, 13, 16); 27 (its 17); 29 (its 18); 30 (its 24, wording tightened); 32 and 33 (its case studies 30 and 31).
- From the reverted rebuild's Exercise 2.3: 26 (its Q1(e)).
- New: 18 (an assertion–reason with answer (b), which the run otherwise lacked); 28 (Rohan, 15 × (8 − 3), after the rebuild's common mistake with 6 × (10 + 2)); 31 (a long answer on terms and removing brackets).
- Option orders were changed in 3, 6, 8, 12 and 14 so that the sixteen answers are spread four to each letter.

### Excluded

**As duplicates of the chapter body.**
- The reverted rebuild's Examples 1, 3, 4, 6, 8, 10 and 12–23 are the body's Examples 1–18.
- Its end-of-chapter 19–23 and 25–29 are the body's End-of-Chapter 1–10.
- Its assertion–reason 9 uses 30 + 5 × 4 = 50, which is the body's marbles example.
- Old Set B2 (three samosas and teas, 3 × (15 + 10)) repeats the body's Example 15 (Lhamo and Norbu).
- Old Set B4 (1 − 2 + … − 8) and C4 (1 − 3 + … − 19) repeat End-of-Chapter 3(a).
- Old Set C3 (a snail on a pole) repeats End-of-Chapter 1(c).

**As near-duplicates inside the run.**
- Reverted rebuild's end-of-chapter items:
  - End 6 (commutative property of −9 + 23), kept A9.
  - End 7 (46 × 12 → 47 × 12), covered by Ex 13 and Q15.
  - End 11 (6 × 99 = 594), same as B3.
  - End 14 (45 − (18 − 7)), same as Q7.
- Old Set items:
  - A3 (12 × (10 + 5)), same as Q8.
  - A4 (90 − (40 + 20)).
  - A5 (356 + 147 against 355 + 149), same as Q12.
  - A7 (5 + 3 × 4), same as Q5.
  - B1 (500 − (120 + 80)), same reason as Q19.
  - B5 (Rahul and Anita), same as Q7.
  - C2 (25 × 36 + 75 × 36), same as Q11.

**Kept, noted.** Ex 12 (27 × 99) and Ex 14 (6 × 13 + 6 × 7) use the same
property as Stage 1's 99 × 37 and Asha's pens, with different numbers and
as multiple choice.

### Fitting

`refit.mjs … bridge` five times. To close short pages without padding:
- The answer rows were set one `.work--trace` block per row so they flow.
- Ex 8 was recast as two term pairs.
- Ex 9 (then Ex 10) lost a repeated check row.
- Ex 11 and Ex 12 each merged two steps.
- Within Type 5 the non-multiple-choice example now comes first, as in Types 2 and 3.
- Within Type 6, Rehana (forwards) now comes before 6 × 13 + 6 × 7 (backwards).
- The Tinku stem and Q30's stem and part (c) were tightened. Q30 took p108 back from 4 mm into the bottom margin.

Final build: all pages fit, no Beyond page under 88% except the last. The other tools:
- `orphans`: nothing stranded in Beyond.
- `fit-options`: every option row fits.
- `gaps`: all its short pages are body pages.
- `check-labels`: no collisions.

The stale `build/class-7/_refit-ch02-arithmetic-expressions.html` was deleted.

### Verification

Every number in Stage 1, the 14 examples, the 33 questions and the answers
(options and distractors included) is checked by
`scratchpad/beyond-ch02-arithmetic-expressions/verify.mjs`: **144 checks, 0
failed**. Q16 is checked by trying every bracketing of 12 − 6 − 4 − 2. Each
multiple-choice question is checked to have exactly one correct option. No
reused item was wrong. One slip in new writing was caught by the script
before the build: the trace row for Q12 had said 326 + 149 is "3 more" than
325 + 148, and it is 2 more.

### Flagged

| location | what | needs |
|---|---|---|
| body, folio 1 | `orphans` reports the *Comparing expressions* `h3` opening 4.4 lines from the foot | a body fix; the body was out of scope today |
| Stage 4 | no *three things to keep* paragraph, following the approved Chapter 1 shape | nothing |

Written new from NCERT *Ganita Prakash*, Grade 7 Part I, Chapter 2,
*Arithmetic Expressions* (textbook pages 24–45, answer key after them).
Original LearnLab text in NCERT's order of topics and questions; no sentence
is carried over. Crown Quarto, house design, palette `lagoon`, following
Chapter 1.

Sections keep NCERT's numbering: 2.1 Simple Expressions · 2.2 Reading Longer
Expressions. The source's unnumbered subtopics are `h3`: comparing
expressions, brackets, terms, swapping and grouping, more expressions and
their terms, removing brackets I and II, and the two "tinker the terms"
subtopics (here *Changing one term* and *Changing a number in a product*).
The closing puzzle *Expression Engineer* ends the End-of-Chapter Exercises as
Questions 7–10.

**Every printed number re-derived**, including: the answers to Exercise Sets
2.1–2.5 and the End-of-Chapter set; Examples 1–18; the five Stage 1
explanations (300 against 196; 30 against 80; 3663; the two bracket placings
giving 6 and 0; ₹350); the five Stage 2 solutions; all 24 multiple-choice
answers (Set A a c d c c b a d b c; Set B a c c b d d c a; Set C c a c b b a)
and the six trace rows.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| terms marked with boxes drawn round them | terms shaded with `.chip` | the book's own token for a highlighted piece of an expression; the text says it is only a learning aid, as the source does |
| a sentence about a girl and her friend, read with and without a comma | two notices at a school gate, "No, parking here" and "No parking here" | same point, original example |
| hat-and-shoes / socks-and-shoes | a watch and a cap / socks and shoes | original example of order not mattering and mattering |
| *Try This*, *Math Talk* | Think and Reflect panels, or plain questions | no such labels in the component library |
| "Tinker the Terms I" table, garbled in the source | Table 2.2, one expression per row with a "why" column; the second family (−87 + −16 …) as a sentence | a clear table the reader can fill |
| Figure it Out Q1(d) `24 − 6 − 4 = 24 − 6 ___` | `24 − 6 − 4 = 24 − (6 ☐ 4)` | the source form has no single correct fill |
| Figure it Out Q4(b): the same expression printed three times with different term markings | the three groupings written with brackets | the markings do not survive; brackets carry the same idea |
| End Q4(a): the same expression twice with different markings | `(49 − 7) + 8` against `49 − (7 − 8)` | the grouping must be visible in print |
| one question of sixteen distributive fill-ins | two questions, sums then differences (Exercise Set 2.5 Q1–2) | sixteen one-column parts made a 143 mm block that held a page at 52%; the split follows the maths |
| Melvin, Begur market, Binu, the snail, Queen Alia, metro tickets, Kannan, Raghu, Ruby's game, Manasa, Lhamo and Norbu, the parade, Hira, Irfan | kept | the source's situations, retold |

## Errors found in the source's answer key

| question | key says | correct | note |
|---|---|---|---|
| Removing Brackets — I, Figure it Out Q2 (remove the brackets in six expressions) | "(a) and (f)" | 14 + 12 + 10; 14 − 12 − 10; 14 + 12 − 10; 14 − 12 + 10; −14 + 12 − 10; 14 + 12 + 10 | the key answers a different question (which two are equal) |
| 2.2 Figure it Out Q1(e), terms of 6 × 3 − 4 × 8 × 5 | "6 × 3, 4 × 8 × 5" | 6 × 3 and −4 × 8 × 5 | the key drops the sign that the chapter's whole method depends on |
| Figure it Out Q6(a), `423 + __ = 419 + __` | 423 + 419 = 419 + 423 | any pair where the second blank is 4 more than the first | the key's answer is true but not "using only how terms change"; left open in print |
| Tinker the Terms I table | answer shown only as "8" | 38, 36 and −103, −104, −123 | garbled |

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| Fig. 2.3 (window) | — | **Drawn from the key, not the picture.** The key's 7 × 5 + 6 × 2 + 2 × 3 = 53 cm was read as a 3 cm border top and bottom, 6 grill bars of 2 cm and 7 gaps of 5 cm; the figure labels one of each. | check against the source picture |
| Fig. 2.5 (number grids) | — | **Invented.** The source's two pictures could not be seen; the grids were designed to match the key's totals (52 = 5 × 4 + 4 × 8; 88 = 8 × 5 + 8 × 6). | check against the source picture, or keep as original |
| Figs. 2.1, 2.2, 2.4 and the opener sketch | — | Drawn from the text's description (marble bars; the 5 × 2 + 3 and 2 × (5 + 3) arrangements; the parade rows). | check against the source pictures |
| 2.2, Swapping and grouping | C5 | "Subtracting a number is the same as adding its inverse" is given with a Class 6 token model as the reason, and the Think and Reflect asks for it; nothing in this chapter proves it. | nothing — Class 6 Chapter 10 (integers) carries it |
| Expressions with both × and ÷ in one term | M1 | The chapter never says how to work out a term like 12 ÷ 3 × 2, and none is printed. Beyond the Book avoids them too. | a later chapter must not assume a left-to-right rule has been taught |
| End Q9 (digits 0–9 once, value 100) | C4 | open question with no answer in the source key; starred | nothing |

## Beyond the Book

Four stages, 9 pages. Stage 1: brackets against a bare product; Riya's
misplaced bracket; 99 × 37; bracket placings for 6 and for 0; seven pens and
seven notebooks. Stage 2: removing a bracket after a minus sign; the terms of
40 − 4 × 6 + 12; Tinku's 27 × 99; a common factor outside a bracket; Kiran's
money. Sets A (10), B (8, three assertion–reason), C (6, tiered). No named
method, no coaching vocabulary, no examination named.

## Fitting

The first build failed on markup, not on fitting: `&lt;` and `&gt;` inside
`$…$` (KaTeX cannot read entities — use `\lt`, `\gt`), and an opening `$`
followed by a space straight after a blank (`</span>$ + 4)`). Both are now in
CROSS-CHAPTER.md so the next chapter avoids them.

Gaps were closed by: splitting Exercise Set 2.5's sixteen fill-ins; putting four
one-column option lists back into two columns (`fit-options` narrowed the ones
that did not fit); a five-line introduction under *Changing a number in a
product*; a fifth line under *Brackets in expressions*; a closing observation
after Stage 2 Problems 2 and 4; splitting the six trace rows into separate
blocks; and small cuts at the joins in Examples 7, 8 and 15. Lines added say
something the chapter needed (reading "13 + 2 = 15" aloud; the Saturday case
in Example 1; 7 written two ways; how brackets nest).
