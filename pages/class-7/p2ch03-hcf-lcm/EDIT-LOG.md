# Class 7 · Mathematics II · Chapter 3 — Finding Common Ground

## Syllabus audit fixes, 17 September 2026

Two findings.

1. **Borderline: "Questions with remainders" (now Type 7, Examples 15–16).**
   Example 15's working used to begin "take away the remainders", which is a
   rule the body never states. **The Type was kept**, because the body does
   set this kind of question (Exercise Set 3.6 Q8). Its working now derives
   the step in the body's own terms. 70 is a multiple of the number plus 5,
   so the number divides $70 - 5 = 65$ exactly, and in the same way it
   divides 117. So it is a common factor of the two, and the largest one is
   the HCF, 13. A check row was added:
   $70 = 13 \times 5 + 5$, $125 = 13 \times 9 + 8$. Example 16 (remainder 1
   on dividing by 2 to 6) likewise now says why it is an LCM question.
   Taking 1 away leaves a number that each divisor divides exactly, so that
   number is a common multiple, and the smallest one is wanted.
2. **Gap: conjectures, counterexamples and general statements** (§3.1,
   §3.3). A new **Type 6 · Conjectures and general statements** holds two
   examples, one for each idea:
   - Example 13, a counterexample. Kiran's conjecture is that if $a$, $b$
     are co-prime and $b$, $c$ are co-prime, then $a$, $c$ are co-prime.
     4, 9 and 10 disprove it: the HCF of 4 and 10 is 2.
   - Example 14, a general statement with its reason. The HCF of two
     numbers is a factor of their sum: $h \times p + h \times q = h \times (p + q)$.
   The audit's suggestion (the HCF of two consecutive numbers is 1) was **not
   used**, because it is Exercise Set 3.5 Q1(d) and the example would have
   answered it. The two examples above answer no body question.
   The new Type sits **before** the remainders, which follows the body's
   order (§3.3 comes before Exercise Set 3.6), and also packed a page
   shorter than putting it last. So the remainders Type became Type 7, and
   its Examples 13–14 became **15–16**. Nothing in the chapter refers to an
   example by number.

Class 7 has no `ANSWERS.md` or `check-numbers.mjs`, so every value was
checked by hand: $65 = 5 \times 13$, $117 = 9 \times 13$, $13 \times 5 + 5 = 70$,
$13 \times 9 + 8 = 125$, and 13 is larger than both remainders. The HCFs of
4 and 9, 9 and 10, and 4 and 10 are 1, 1 and 2. $12 + 18 = 30 = 6 \times 5$.
`check-no-repeats` reports one pair at 50%, and it was already there
("Two numbers whose HCF is 1 are called" against Exercise Set 3.6 Q4). The
two are different questions.

Pages 21 → 22 (body 12, Beyond 9 → 10). `refit bridge` was run after the
reorder. Answers opens p110. p109 (Q29–Q33) is 70% full, which is the short
page before Answers and is logged, not padded. All pages fit, 0 stranded
openers, every option row fits, no labels collide, `data-bridge` on
p101–p110.

## Examples set as steps, 16 September 2026

**All 7 worked examples in the chapter body are now stepped maths** —
*Solution*, a step to a `.work__row`, the reason two to four words in a
`.chip`, ending on an `Answer` row — so the chapter matches Beyond the Book,
which the student meets second.

**Only the layout changed.** No number, no question, no order, no NCERT
structure. Sentences that are explanation rather than a step stayed as
paragraphs: Example 1's *every factor of 45 is a part of…* lead-in, Example
3's *co-prime* closing line, Example 4's *the HCF is the largest part common
to both* and its closing *any larger common part…*, Example 6's *for
example… is $2 \times 3 \times 5 \times 7$ one?* Example 5 keeps its
factorisations in the question line, where NCERT prints them.

**Verified** by a script that pulls every number and every maths span out of
each `.c-example` at `HEAD` and after the change and compares them as
multisets (step labels excluded, since they are new furniture): identical for
all 7. The same script re-derives every HCF and LCM by computation —
HCF(45,75)=15, HCF(112,84)=28, HCF(96,275)=1, HCF(30,72)=6, HCF(225,750)=75,
LCM(14,35)=70, LCM(96,360)=1440 — checks each printed factorisation multiplies
back to its number, and checks Example 1's list of common factors against the
divisors of the HCF. All pass.

**Pages: 12 body pages before, 12 after.** Beyond the Book untouched (9
pages); 21 in the chapter either way.

Flagged:

- **page 5 runs 1.3 mm into the bottom margin** (101% fill). Within the 3 mm
  the bar allows, and the proof shows no clipping. Closing it would mean
  moving Example 5 whole to page 6, which reopens a 53 mm gap on page 5.
- **page 10 is 82% full** — 42 mm held open because the next page opens with
  an exercise band. Not padded.
- **page 2 is 84% full** — pre-existing, held by the `h3` that opens page 3.
- Orphans improved: the chapter had **1 stranded opener** (page 7, an exercise
  band 3.3 lines from the foot) before this work and has **0** after.
  `fit-options` and `check-labels` clear.

## Beyond the Book, rebuilt 15 September 2026

**The chapter body is NCERT's structure, unchanged.** A rebuild of the body to
DESIGN-MATHS §5 (worked examples, checks, key ideas and end-of-chapter
exercises inside the chapter) was reverted the same day at the user's request.
The `p0xx` pages were not touched in this rebuild; a backup of the §5 version
is in the session scratchpad (`rebuilt/pages/class-7/p2ch03-hcf-lcm/`).

**Beyond the Book is four stages, 9 pages (was 7), in DESIGN-MATHS §6a's
15 September shape.**

1. **Using What You Know** — the existing stage, word for word: four
   questions tried first and explained. Only its `.c-stage__for` line went.
2. **Solved Examples** — 14 examples, each *Solution*, *Step 1* … *Answer*
   with a short reason as a chip. Type 1 prime factorisation and factors 2;
   Type 2 finding the HCF 3; Type 3 finding the LCM 3; Type 4 dividing both
   numbers together, and doubling 2; Type 5 the HCF, the LCM and the product
   2; Type 6 questions with remainders 2. Sources: the reverted rebuild's
   Examples 1, 2, 10, 11, 12 and Exercise 3.4 Q4, Exercise 3.6 Q5 (all recast
   as steps); the old stage 2's Problems 1–4 (options kept, letter in the
   Answer row); old Set C Q1, Q2 and Q4, recast as examples.
3. **Practice** — one band carrying the numeral, 33 questions: 16 multiple
   choice, 4 assertion–reason, 5 very short, 3 short, 3 long, 2 case-based.
   Sources: the reverted rebuild's end-of-chapter Q2–6, 8–13, 16, 24, 29–33,
   Check yourself (25 and 36; 60 and 4, 5, 6), Exercise 3.6 Q1; old Sets A–C.
   Question 20 (assertion–reason, answer (b)) is new, because the reused
   ones gave no (b). Key letters spread 5 a, 5 b, 5 c, 5 d.
4. **Answers** — the key for 1–20, every other answer as a `.work--trace`
   row (21–33 in one block, under the stage head on the same page), and
   *Why the other options are wrong* for 12, 13, 14, 16 and 18. The old
   "three things worth keeping" paragraph and the "mark every answer" line
   went with the old stage 4.

### Left out as duplicates

- **Of the body:** the reverted rebuild's Examples 3–9 (the body's Examples
  1–7); end-of-chapter Q7 (306 and 36), Q14 (multiple of $5 \times 7 \times 7
  \times 11 \times 2$), Q15 (LCM of 1–10), Q17–23 (stars, factorisations, HCF 1
  LCM 66, cowherd, box, Fire in the Mountain, dog and rabbit), Q25 (the largest
  prime's digits, asked on p012), Q26 (two primes), Q27 (remainder 10), Q28
  (Mahaviracharya; fraction addition is also not taught); Q1 (72 is factorised
  in body Example 4); old Set A Q4 and Set C Q6 (consecutive numbers, and
  $n$, $n + 2$ odd: body Set 3.5); old Set A Q8 (4 and 6: the Idli-Vada pair).
- **Of Stage 1:** old stage 2 Problem 5 (HCF 4, LCM 30); old Set A Q1 (HCF
  of 18 and 24, worked in Stage 1); Exercise 3.4 Q2 (12 and 18 days, the bells).
- **Near-duplicates inside the run:** old Set A Q5, Q7, Q9, Set B Q6, Q7
  (ribbons 72 and 120, Example 9's numbers), Q8; Exercise 3.6 Q2 and Check
  "HCF 4, product 240" (both Example 11 again).
- **Not taught:** Exercise 3.6 Q3 and Check "HCF of 42 and 63" multiply by 3
  (the chapter explains doubling only); Exercise 3.6 Q6 needs "a common factor
  divides the difference".

### Changed in reused items

No reused number was wrong. These were changed so nothing repeats the body or
Stage 1: tanks 45, 60, 75 → 32, 48, 80 (body Example 1 is 45 and 75 → 15);
Practice Q6 option 28 → 35 (body shows 28 is a factor of 840); Q18 LCM of 8
and 12 → 6 and 9; Q22 common factors of 18 and 30 → 20 and 28 (Stage 1's
tiles); Q29 60, 90, 150 → 40, 60, 100 (body asks 90 and 150); Q30 18 and 24 →
20 and 30 (Stage 1 Q1); case Q32 lost its part (a) "factorise 96 and 120"
(96 is factorised in the body). Options were reordered to spread the key.

### Verification

`scratchpad/beyond-p2ch03-hcf-lcm/verify.mjs` recomputes every number in
Stage 1, every example step, every option set (exactly one option correct,
at the printed letter), every answer and every *why wrong* row: HCF and LCM
by Euclid, factorisations by trial division, pair counts and remainder
questions by search. 75 checks plus the Q31 ladder, all pass. (Its example
labels are the draft's: draft Example 12, 35 and 56, was cut in fitting;
final numbering is 252 · 42 and 8 · tanks · HCF of factorisations · beads ·
LCM 24 · LCM 12, 15, 20 · drums · 72 and 120 · doubling · product 1080 ·
pairs HCF 5 LCM 60 · 70 and 125 · remainder 1.)

### Fitting

`refit bridge`: Beyond fill 93 97 89 97 97 95 100 98 97, all fit, nothing into
the margin. To close three short example pages, Examples 7 and 10 lost a
check step, Example 9's two division steps became one, draft Example 12 was
cut, and Types 2, 3 and 6 are not in easiest-first order (the tanks before
the plain HCF, LCM 24 before LCM of 12, 15, 20). `orphans`, `gaps`,
`fit-options`, `check-labels` report nothing in Beyond. Flagged, not touched:
body pages 2, 4, 5, 7 under 88%, and an exercise opener stranded on page 7.

Written new from NCERT *Ganita Prakash*, Grade 7 Part II, Chapter 3, *Finding
Common Ground* (textbook pages 47–66). Original LearnLab text in NCERT's order
of topics and questions; no sentence is carried over. Crown Quarto, house
design, palette `fern`. The source PDF has no answer key; every answer below
was worked here.

Sections keep NCERT's numbering, with plainer names: 3.1 The Highest Common
Factor (*The Greatest of All*) · 3.2 The Lowest Common Multiple (*Least, but
not Last!*) · 3.3 Patterns and Properties (*Patterns, Properties, and a Pretty
Procedure!*). The source's subheads are `h3`. Its six *Figure it Out* blocks are
Exercise Sets 3.1–3.6; the Jump Jackpot and Idli-Vada questions stay in the
running text, as in the source.

## Figures

Eight figures from `fig3.mjs` (with `geo.mjs`) in the session scratchpad: the
tiled floor, four division ladders, the strips of cloth, and the rows of stars.
Fig. 3.8 is **redesigned**: the source's coloured stars could not be matched
exactly, so row 1 repeats a group of six and row 2 a group of four, each with a
dark fourth star; the answer below is for this figure. *Mystery Colours*, the
closing puzzle about the source's page-number designs, is left out: this book
has no such designs.

## Every printed number re-derived

| where | answers |
|---|---|
| 3.1 | tiles 4 ft, 12 tiles; a fractional side cannot exceed 4 ft, so no change · rice 12 kg, $7 + 9 = 16$ bags · Jump Jackpot 2, 1, 10, 14 · $1200 = 2 \times 2 \times 2 \times 2 \times 3 \times 5 \times 5$ · 14 and 8 are factors of 840, 27 is not |
| Set 3.1 | 90: 1, 2, 3, 5, 6, 9, 10, 15, 18, 30, 45, 90 · 105: 1, 3, 5, 7, 15, 21, 35, 105 · 132: 1, 2, 3, 4, 6, 11, 12, 22, 33, 44, 66, 132 · 360: 24 factors · 840: 32 factors |
| Examples 1–5 | 15 · 28 · 1 · 6 · 75 |
| Set 3.2 | (a) 1, 2, 5, 10; 10 (b) 1, 5; 5 (c) 1; 1 (d) 1, 2, 37, 74; 74 (e) 1, 3, 9, 27, 81; 81 |
| Set 3.3 | 1 (a) 12 (b) 3 (c) 6 (d) 100 (e) 100 · 2 no: 72 is itself a factor of 144; composite factorisations hide common primes |
| 3.2 | torans 24 cm; no largest common multiple · gajak 70 days · Idli-Vada 12, 77, 210, 165 · Example 6: 70, and $2 \times 3 \times 5 \times 7 = 210$ is a common multiple · Example 7: 1440 |
| Set 3.4 | 360 · 108 · 1365 · 1110 |
| 3.3 | other number $km$ for any $k$ · a multiple of $7k$, or a factor of it |
| Set 3.5 | 1 (a) 2 (b) 1 (c) even, at least 2 (d) 1 (e) 1 · 2 one number a multiple of the other; $n$ and $kn$ have LCM $kn$ · 3 (a) a multiple of 3 (b) half their product, $2n(n + 1)$ for $2n$ and $2n + 2$ (c) their product (d) their product |
| Doubling | 10 then 20 · $14 \times 6$, $14 \times 9$: 42 · (a) 90 (b) 10 (c) 5 (d) 48; equal to the multiplier in (b) and (c), when the other multipliers are co-prime |
| Ladders | 84, 180: HCF 12, LCM 1260 · 300, 150: 150, 300 · 630, 770: 70, 6930 · 90, 150: 30, 450 · 84, 132: 12, 924 |
| Product | 105, 95: LCM 1995, product $9975 = 1995 \times 5$ · (a) 15, 315 (b) 11, 8800 (c) 74, 1110; the multiplier is the HCF each time · fails for three numbers, e.g. 2, 4, 8 |
| Set 3.6 | 1 the 16th star · 2 (a) no (b) no · 3 (a) HCF $3 \times 7$, LCM $2 \times 2 \times 3 \times 3 \times 5 \times 7 \times 7 \times 11$ (b) HCF $3 \times 3$, LCM $2 \times 2 \times 3 \times 3 \times 5$ · 4 1 and 66, 2 and 33, 3 and 22, 6 and 11 · 5 105 · 6 (b), (d), (e) · 7 (c) 18 · 8 2100 · 9 (a) and (e) · 10 (c) only · 11 75 jumps · 12 360 · 13 $\frac{672 + 63 + 245 + 220 + 60}{1260} = 1$ |

The Beyond the Book before the rebuild above (superseded): Stage 1 — 24; no, 4 does not divide 30; 15 tiles; 9:36.
Stage 2 — (a), (c), (b), (d), (c). Set A b c a b c a d b a b; Set B b c a d a
a b a; Set C b a c c a d b.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| $90 = 3 \times 3 \times 2 \times 5$ | $2 \times 3 \times 3 \times 5$ | primes in increasing order, as everywhere else |
| subparts | *parts* of a factorisation | plainer word |
| the procedure pictures with circles | division ladders only | the circled version adds nothing the ladder does not show |
| Q10 "tick the correct statement(s)" | "which statements can be true" | the book's question voice |
| *Math Talk*, *Try This* | plain questions | no such labels in the library |
| the Karnataka cowherd, Mahaviracharya's sum, the largest prime | kept, with the prime's digit count in Indian grouping | |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| 3.1, uniqueness of prime factorisation | C6 | asserted from examples, as in the source | acceptable at this class |
| Set 3.6 Q13 | M1 | adding fractions with unlike denominators via the LCM is not taught in Mathematics I Chapter 8 | a teacher's word, or a hint |

## Checks

Builder, before the Beyond rebuild above: 13 body pages and 7 Beyond the Book pages, every page at 88% or more
except the closing pages. `gaps`, `orphans`, `check-labels`, `fit-options` and
the width probe report nothing. Fitting took line-sized edits: sentences added
on the division method, co-prime numbers, Example 4, Set 3.2 and in three
Stage 2 solutions; Example 5's factorisations set inline; a line under the
answer key so the stage head is not stranded.
