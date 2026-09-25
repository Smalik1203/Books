# Class 7 · Mathematics I · Chapter 8 — Working with Fractions

## Solved examples in examination formats, 23 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 12 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-7/ch08-fractions/`.

Source `build/jee-class7.mjs`; check `build/check-jee-class7.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p111; the answers stage still opens a fresh page.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (b) $\frac{2}{3}$ |
| 2 | Single correct | (d) 6 |
| 3 | Single correct | (b) 5 ÷ $\frac{7}{8}$ |
| 4 | Single correct | (a) 10 |
| 5 | Single correct | (c) $\frac{1}{5}$ |
| 6 | Single correct | (a) Both drink the same amount. |
| 7 | Multiple correct | (b), (d) |
| 8 | Multiple correct | (a), (b), (d) |
| 9 | Multiple correct | (b), (c), (d) |
| 10 | Multiple correct | (a), (b), (d) |
| 11 | Numerical answer | 16 |
| 12 | Numerical answer | 44 |
| 13 | Numerical answer | 60 |
| 14 | Matching | (b) P–3, Q–1, R–4, S–2 |
| 15 | Matching | (d) P–2, Q–4, R–3, S–1 |


## Examples set as steps, 16 September 2026

**All 5 worked examples in the chapter body are now stepped maths** —
*Solution*, a step to a `.work__row`, the reason two to four words in a
`.chip`, ending on an `Answer` row — so the chapter matches Beyond the Book,
which the student meets second.

**Only the layout changed.** No number, no question, no order, no NCERT
structure. Sentences that are method rather than a step stayed as paragraphs
before the `Solution`: Example 2's *divide the multiplicand, 8, by the
denominator 4…* and Example 5's *count how many times each fountain fills the
tank in one day.* Example 3 keeps Fig. 8.9 where it was, after the panel.

**Verified** by a script that pulls every number and every maths span out of
each `.c-example` at `HEAD` and after the change and compares them as
multisets (step labels excluded, since they are new furniture): identical for
all 5. The same script re-derives each example in exact fractions —
$5 \times \frac{2}{3} = \frac{10}{3}$; $1\frac{1}{4} \times 8 = 10$;
$\frac{1}{4} \div 5 = \frac{1}{20}$; $7\frac{1}{2} \div \frac{1}{25} =
\frac{375}{2}$; $1 + 2 + 4 + 5 = 12$ fillings a day, so $\frac{1}{12}$ of a
day — and checks each printed result is the one on the page. All pass.

**Pages: 13 body pages before, 13 after.** Beyond the Book untouched (9
pages); 22 in the chapter either way.

Flagged:

- **page 9 is 80% full** — 47 mm held open by Example 5, which is 74 mm and
  cannot be divided. Not padded.
- **page 2 is 86% full** — 31 mm held open by the `h3` that opens page 3.
- **page 10 runs 1.1–1.6 mm into the bottom margin**, within the 3 mm the bar
  allows; the proof shows no clipping.
- Pages 14, 20 and 22 also run 1.1–1.3 mm into the bottom margin. Those are
  Beyond the Book pages, untouched by this work; pre-existing.
- Orphans unchanged at **0 stranded openers**, before and after.
  `fit-options` and `check-labels` clear; `data-close` still on `p013`.

## Beyond the Book, rebuilt 15 September 2026

Only the Beyond pages changed. The chapter body (`p001`–`p013`) and
`chapter.json` were not touched.

The §5 body rebuild made earlier the same day was **reverted at the user's
request**. Its pages, `ANSWERS.md` and log are kept as a backup in the session
scratchpad (`scratchpad/rebuilt/pages/class-7/ch08-fractions/`), and were used
below only as a source. The Beyond pages as they stood before this rebuild
(`p101`–`p108`) are backed up in `scratchpad/beyond-ch08-fractions/old-beyond/`.

**Pages.** 8 → 9 (`p101`–`p109`). Every page carries `data-bridge`, and none
has `--head` or `--tail`. Fill: 88 · 93 · 100 · 93 · 93 · 89 · 94 · 93 · 89.
The last page is 89%, so no Beyond page is under 88%.

**The four stages**, in the shape of Chapter 1:

1. **Using What You Know** — the chapter's existing tried-and-explained stage:
   four `.c-try` questions, word for word. Only its `.c-stage__for` line was
   deleted, which was checked by a whitespace-insensitive comparison with the
   backup.
2. **Solved Examples** — 12 examples, stepped (Solution → Step → Answer),
   under six `h3` types in the chapter's order:
   - Type 1 · Multiplying by a fraction (2)
   - Type 2 · Cancelling, and mixed fractions (3)
   - Type 3 · Is the product larger or smaller? (1)
   - Type 4 · Dividing fractions (2)
   - Type 5 · Is the quotient larger or smaller? (2)
   - Type 6 · Multiply or divide? (2)
3. **Practice** — one band, then one run of 36 questions:
   - choose the correct option 15
   - assertion and reason 5
   - very short answer 5
   - short answer 7
   - long answer 2
   - case-based 2
4. **Answers** — the letter key in two rows (1–15, 16–20), one `.work--trace`
   block per answer for 21–36, and five rows of *Why the other options are
   wrong* (4, 6, 11, 14, 19).

These are gone:
- the old stage heads *Behind Each Answer*, *Problem Sets* and *Answers &
  Takeaways*
- the Set A/B/C bands
- the paragraph after Problem 5
- the closing takeaways paragraph

### What came from where

**Examples.**
- From the reverted rebuild's worked examples:
  - its Example 3 (Meena, $\frac34 \times 8$) → Ex 1
  - 6 (Tara and Ravi) → Ex 2
  - 7 ($\frac{9}{16} \times \frac{8}{15}$) → Ex 4
  - 8 (the floor mat) → Ex 5
  - 9 ($\frac78 \times \frac53$) → Ex 6
  - 10 ($\frac49 \div \frac23$) → Ex 7
  - 12 ($\frac25 \div 4$) → Ex 9
- The old *Behind Each Answer* problems, kept with their options and turned
  into steps:
  - Problem 1 ($\frac35 \times \frac{10}{9}$) → Ex 3
  - 2 ($\frac34 \div \frac18$) → Ex 8
  - 4 (which is greatest) → Ex 10
  - 3 (the ribbon) → Ex 11
  - 5 (girls who play football) → Ex 12

**Practice.**
- Reverted rebuild's end-of-chapter questions:
  - End 1 → Q1; 2 → Q2; 8 → Q3; 3 → Q4; 4 → Q5
  - 7 → Q6 (options reordered, so the answer is (d))
  - 9 → Q7; 6 → Q9
  - 11 → Q17; 13 → Q18; 12 → Q19
  - 14 → Q21; 15 → Q22; 18 → Q23; 17 → Q24; 19 → Q25
  - 20 → Q26; 21 → Q27; 24 → Q28; 22 → Q29; 25 → Q30; 26 → Q31; 23 → Q32
  - 27 → Q33; 28 → Q34
  - 31 → Q35 (the *Case study* label and the *Table 8.2* caption were removed)
  - 32 → Q36 (label removed)
- Old Problem Sets:
  - A10 → Q8 (options reordered, so the answer is (a))
  - B7 → Q10 ("along the same road" cut from the stem)
  - B2 → Q11; B5 → Q12
  - C1 → Q13; C2 → Q14; C5 → Q15
- New, so that the assertion–reason answers spread across the letters:
  - Q16: $3 \times \frac25 = \frac65$, with a false reason (c)
  - Q20: $\frac23 \div \frac16 = 4$ (a)

### Excluded

**As duplicates of the chapter body.**
- Reverted rebuild's Example 1 (farmer), 2 (internet), 13 (Leena), 14 (bricks)
  and 15 (fountains) are the body's Examples 1–5.
- Reverted rebuild's Example 5 (vegetable bed, $\frac45 \times \frac23$)
  repeats Exercise Set 8.2 Q2(a).
- End 30 (queens) is the body's closing puzzle.
- Old B8 ($\left(1 - \frac12\right)\left(1 - \frac13\right)\left(1 - \frac14\right)$)
  repeats Exercise Set 8.4 Q12.
- Old C3 (two taps filling a tank) is the method of body Example 5.
- Old C7 (square tiles on a floor) is body Example 4.
- Old A2 ($\frac13 \times \frac14$) repeats Exercise Set 8.2 Q1(b).
- Old C6 ($p$ between 0 and 1, $q$ greater than 1) is the "one of each" row of
  Table 8.1.

**As near-duplicates of Stage 1.**
- End 16 (what number times $\frac49$ gives 1), against the fourth question.
- Old C4 ($\frac12$ of $\frac23$ of $\frac34$ of $\frac45$ of 100), against
  the first.
- Old A8 (a fraction times its reciprocal), which restates the body's key idea.

**As near-duplicates inside the run, or off the chapter.**
- Old A1, A3, A4, A5, A6, A7 and A9, which are Q1, Q4, Q28, Q2, Q7, Q3 and Q6
  with other numbers.
- Old B1 (same form as Q19), B3 (same form as Q18), B4 (same form as Q7) and
  B6 (same pattern as Q18).
- End 5 (which is improper) and End 10 ($\frac{18}{24}$ in lowest form):
  Class 6 material.
- End 29 (the product of $1 + \frac1n$ brackets): modelled directly on
  Exercise Set 8.4 Q12.
- Reverted rebuild's Example 11 (the tailor): the same question as the ribbon
  in Ex 11.
- Reverted rebuild's Example 4 ($\frac37 \times \frac25$): written in, then
  dropped at fitting as a bare use of the rule the body already shows several
  times.

**Kept, noted.**
- Ex 9 ($\frac25 \div 4$, greater or less?) has the form of Stage 1's second
  question, but with a divisor greater than 1 where Stage 1's is less than 1.
- Q35 (kheer) scales a recipe, as Stage 1's third question does, with its own
  table and four different parts.

### Verification

Every number in Stage 1, the 12 examples, the 36 questions and the answers
(options and distractors included) is checked in exact fraction arithmetic by
`scratchpad/beyond-ch08-fractions/verify.mjs`: **141 checks, 0 failed**.
- Each multiple-choice question is checked to have exactly one correct option.
  Q2 is also checked for its "lowest form" condition, since option (a) $\frac{10}{40}$
  equals the answer.
- Q15 is checked for several numbers.
- Q16's reason is checked to be false.
- Letters for Q1–15: a 4, b 4, c 4, d 3. Assertion–reason: c a b d a.
- No reused item was wrong. One slip was in the script, not the book: a helper
  ignored its denominator, and was fixed before any answer was printed.

### Fitting

`refit.mjs … bridge` seven times. The block heights were measured with
`scratchpad/beyond-ch08-fractions/measure.mjs`. Changes, none of them padding:
- Example $\frac37 \times \frac25$ was dropped, and Types 1 and 2 were merged
  as *Multiplying by a fraction*. This closed a 79% page.
- Ex 6 lost its check row ("Then check." left the stem).
- Ex 5 was set as one conversion row and "$= 3$".
- Ex 4's first step became the reason (the common factors), with the whole
  working in step 2.
- One-line reason rows and Answer rows use `\frac`, not `\dfrac`. A `\dfrac`
  row is about 2 mm taller.
- Answer rows 33–36 were cut to their results, and the *Why* rows were
  shortened. This took a last page of three rows (8%) back onto `p109`.

Final build, and the other tools:
- Build: all pages fit; no Beyond page is under 88%; the worst run into the
  bottom margin is 1.3 mm.
- `orphans`: 0 stranded openers.
- `fit-options`: every option row fits.
- `gaps`: its three short pages (folios 2, 10, 12) are body pages.
- `check-labels`: no collisions.

The stale `build/class-7/_refit-ch08-fractions.html` was deleted.

### Flagged

| location | what | needs |
|---|---|---|
| this log, *Every printed number re-derived* | the line "Beyond the Book: Stage 1 — … Set C b c a b c d c" gives the old Stage 2 and Set A/B/C key | superseded by this section; delete when the log is next tidied |
| body, folios 2, 10, 12 | 80%, 80%, 78% full (`gaps`) | a body fix; the body was out of scope today |
| Stage 4 | no *three things to keep* paragraph, following the approved Chapter 1 shape | nothing |

Written new from NCERT *Ganita Prakash*, Grade 7 Part I, Chapter 8, *Working
with Fractions* (textbook pages 173–199, answer key after them). Original
LearnLab text in NCERT's order of topics and questions; no sentence is
carried over. Crown Quarto, house design, palette `emerald`. This is the last
chapter of Mathematics I.

Sections keep NCERT's numbering, with plainer names: 8.1 Multiplying
Fractions · 8.2 Dividing Fractions · 8.3 Problems With Fractions (*Some
Problems Involving Fractions*). The source's subtopics are `h3`. Its four
*Figure it Out* blocks are Exercise Sets 8.1–8.4; *A Pinch of History* is
folded into the text twice, and the closing chess puzzle is an `h3` after the
summary.

## Every figure is drawn new

All 13 figures come from `fig8.mjs` in the session scratchpad, from computed
geometry: every shaded region is the fraction the text says it is. Fig. 8.5
draws $\frac{3}{2}$ as three half-rows, which is what makes the source's
"2 rows, 4 columns, 3 parts shaded" come out. Figs. 8.11 and 8.12 are
**invented**: the source's figures for those questions could not be read, so
the shaded square and the ants' branching paths were designed here, and the
answers below are for these figures.

## Every printed number re-derived

| where | answers |
|---|---|
| 8.1 in text | $5 \times 3 = 15$ · $3 \times \frac14 = \frac34$ · $\frac15 \times 3 = \frac35$ · $\frac25 \times 3 = \frac65$ · Ex 1 $\frac{10}{3}$ acres · Ex 2 ₹10 |
| Set 8.1 | 1 $\frac72$ glasses a week, $\frac{31}{2}$ in January · 2 $\frac18$ km, $\frac58$ km · 3 $\frac53$ L, $\frac{20}{3}$ L · 4 $3 \times \frac56 = \frac52$ hours, so 12:30 am · 5 $4\frac15$, $1\frac13$, $7\frac57$, $7\frac{1}{11}$ |
| Two fractions | $\frac12 \times \frac14 = \frac18$ · $\frac34 \times \frac25 = \frac{3}{10}$ · $\frac54 \times \frac32 = \frac{15}{8}$ · rectangle $\frac18$ |
| Set 8.2 | 1 $\frac{1}{15}$, $\frac{1}{12}$, $\frac{1}{10}$, $\frac{1}{30}$; $\frac{1}{216}$ · 2 $\frac{8}{15}$, $\frac16$, $\frac{3}{10}$, $\frac25$ |
| Rule and cancelling | $\frac{35}{216}$ · $\frac94$ · $\frac{12}{5}$ · $\frac{5}{14}$ · $\frac59$ |
| Set 8.3 | 1 $\frac{7}{30}$, $\frac{7}{15}$, $\frac{21}{40}$, $\frac{49}{100}$; full in $\frac{10}{7}$ hours · 2 left $\frac56$; (a) $\frac{5}{12}$ (b) $\frac{5}{18}$ (c) $\frac{5}{36}$ · 3 36 sq ft · 4 $\frac94$ m · 5 400 g against 600 g, so $\frac{3}{20}$ of 4 kg |
| Table 8.1 | $\frac{16}{3}$, $\frac{3}{10}$, $\frac{15}{4}$ · blanks: less, greater |
| 8.2 in text | $\frac32$, $\frac92$, $\frac25$, $\frac{10}{9}$ · $6 \div \frac14 = 24$ · $\frac18 \div \frac14 = \frac12$ |
| 8.3 in text | Ex 3 $\frac{1}{20}$ L · Ex 4 $\frac{375}{2} = 187\frac12$ bricks · Ex 5 $\frac{1}{12}$ day · Fig. 8.10 $\frac{3}{32}$ · dramma $\frac{6}{7680} = \frac{1}{1280}$, one cowrie · 1 cowrie $= \frac{1}{30}$ pana $= \frac{1}{1440}$ dinar |
| Set 8.4 | 1 $\frac73$, 6, $\frac{18}{7}$, 1, $\frac{49}{4}$, $\frac{16}{15}$, $\frac95$, $\frac{11}{72}$, $\frac83$ · 2 $8 \div \frac14 = 32$; $\frac12 \div 8 = \frac{1}{16}$ m; $5 \div \frac16 = 30$ · 3 $\frac18$ kg for 6 rotis, $\frac38$ kg for 18 · 4 $6 + 10 + 13 + 9 + 2 = 40$ · 5 200 pages · 6 44 km · 7 $4\frac23$ hours · 8 $\frac{1}{15}$ · 9 (a), (c) and (e) · 10 $\frac{1}{12}$ · 11 mango $\frac13 + \frac16 + \frac{1}{12} = \frac{7}{12}$, sugarcane $\frac16 + \frac{3}{12} = \frac{5}{12}$ · 12 $\frac12$, $\frac13$, $\frac15$, $\frac{1}{10}$; the product up to $\left(1 - \frac1n\right)$ is $\frac1n$, because $\frac12 \times \frac23 \times \cdots \times \frac{n-1}{n}$ cancels |
| Queens | 4 queens: second, fourth, first, third squares of the four rows; 8 queens: 92 solutions |

Beyond the Book: Stage 1 — 12; greater, $\frac54$; $\frac54$ cups; $\frac37$.
Stage 2 — (b) $\frac23$; (b) 6; (a) 10; (b); (b) $\frac15$. Set A b c a d c b d a
c d; Set B d a a c b b c a; Set C b c a b c d c.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| *Math Talk*, *Try This*, *Discussion* | plain prose and questions | no such labels in the library |
| Set 8.4 Q1, nine expressions | nine expressions **reconstructed** | the extracted source could not be read reliably; the new set keeps its mix of products, quotients and mixed numbers |
| Set 8.4 Q2, choose one of four expressions | write the expression, then simplify | the four-way option lists nested inside sub-parts could not be set cleanly |
| *Fractional Relations*, further figures to try | "draw a figure of your own" | the source's figures could not be read |
| the coin conversions, with mashakas | mashakas left out | no question used them |
| quoted verses of Brahmagupta and Bhaskara II | described, not quoted | the rules are already given as formulas |
| Somu's land, question (e) of the tank | folded into the stems | fewer one-line parts |
| names with diacritics | *Brahmasphutasiddhanta*, *Sulbasutra*, *Lilavati*, *Patiganita*, Prithudakasvami | plain Latin letters, as in the rest of the book |

## Fraction size

Set by DESIGN-MATHS §5 and applied by script, not by eye: a fraction that is
a whole expression — an option, a line of working, a displayed rule — is
`\dfrac`, and every option list holding one is `.c-parts--tall`; a fraction
inside a sentence, a question stem or a table cell is `\frac`. The first
draft set display fractions in running prose and in stems, which pushed
lines apart unevenly; 67 were set inline and 24 option lists made tall. The
two key ideas that ran a formula into a sentence now give the formula a line
of its own.

## Checks

Builder: 15 body pages and 8 Beyond the Book pages, every page at 88% or
more except the two closing pages; the body's carries `data-close`. `gaps`,
`check-labels`, `orphans`, `fit-options` and the width probe report nothing.
Every page proof was viewed.

Fitting took line-sized edits only. Body: a sentence each on Aaron's first
walk, Safia's moon, the area of Fig. 8.6, the blanks after Table 8.1 and the
end of the Fig. 8.4 explanation; a second question on the rotis and a
request on the *Patiganita* sum; half a sentence off the opening of 8.2.
Beyond the Book: four lines out of the solutions to Problems 3–5, so that
Problem 5 moves back and closes a 66 mm gap, and a line into the Stage 1
reciprocal answer and four Set B questions (the pens question was reworded
from "a number" to a shopkeeper's stock).


## 21 September 2026 — figure/table reference review

Reviewed this chapter in the all-maths reference audit. Figures and tables now use one chapter sequence, including Beyond the Book; captions and references were updated together. Questions, calculations and artwork were preserved. The chapter and its volume were rebuilt; detailed layout checks and any remaining warnings are recorded in build/_all-maths-reference-checks/.
