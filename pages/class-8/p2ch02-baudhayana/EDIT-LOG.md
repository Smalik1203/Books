# Class 8 · Mathematics II · Chapter 2 — Two Squares Make One

## Brought to the Class 7 standard, 17 September 2026

Phase 3 of `PLAN-MATHS-CONSISTENCY.md`, done against the Class 8 Chapter 1
model. The page move and the conversion were done in one pass. The chapter
was read whole before anything changed, and every check below was run on the
chapter, not on a page.

**Pages: 24 before (14 body + 10 Beyond, Crown Quarto), 27 after (13 body +
14 Beyond, 196 × 276).** The taller page took one page off the body. Beyond
grew by four: Stage 1 carries its own explanations, 16 solved examples are
new, and the practice runs to 33 questions in six forms.

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`. The body was
refitted once, after the examples were stepped.

**All four body examples set as steps.** *Solution*, a step to a
`.work__row`, an *Answer* row, the reason in a `.work__why`. The old wide
labels (*the theorem*, *so*, *expand*, *half-diagonals*) became Step rows.
Examples 3 and 4 keep their setting-up paragraph (*Let $x$ be the depth…*,
*Part I's Chapter 5 established…*) before *Solution*, as the model's
Example 1 does; the closing remarks stay as paragraphs after the working.
Chained `$b^2 = 1681 - 1600 = 81$, and $b = 9$` and `$9 = 2x + 1$, so
$x = 4$` were split into two steps each. `check-example-stepping`: 4 examples,
0 lost mathematics.

**Placed by hand after the refit.** The refit left page 8 at 35%: Example 3
(its figure is inside the panel) missed the foot by about 2 mm. It was moved
onto page 8 by hand, which ran 1.6 mm into the margin, so the sentence at the
join was cut by one rendered line — *Bhāskarāchārya, writing in the twelfth
century, set the following in his Līlāvatī. It looks at first as though it
cannot be done, because the depth of the lake is never mentioned.* became
*Bhāskarāchārya set this in his Līlāvatī, in the twelfth century. No depth is
given.* (same facts). Pages 9–12 were then filled forward one block at a time
with `unsettle`, backing off each overflow with `settle`, and the § 2.8 head
was moved off the foot of page 11 so it is not stranded. The old p014 is gone;
p013 closes the body and carries `data-close`. No body question names a
figure, so no question and figure were separated.

**Beyond the Book rebuilt to the four current stages** (§6a):

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 8 `.c-try` questions, answered in the next stage | **the same questions, each followed by its own explanation**, word for word except as below; `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | the worked answers to stage 1 (*The same eight questions, worked*) | **16 stepped examples**, Examples 1–16, under eight `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, 36 questions | **one numbered run of 33**, all six forms, band carrying the numeral |
| 4 Answers & Takeaways → **Answers** | key and why the options are wrong for 7 | key, every other answer, why the options are wrong for 8 questions; the *carry forward* paragraphs kept as one closing paragraph without their head |

**Stage 2 was Stage 1's answers**, so the explanations were moved under their
own questions as running text, dropping only the `.c-solution` wrapper and
its title (*A half-area square, found without its side*, etc.); the `.work`
blocks are unchanged. The old Stage 2 lead paragraph (*The eight are answered
below in the order they were asked…*) now opens Stage 1 as *Each question is
answered straight after it…*. *Try each before turning the page* became
*Try each before reading what follows it*.

**One Stage 1 claim corrected.** *None of them mentions a right angle* was
false — Q7 says *right-angled triangle*. Now *most of the questions below …
do not mention a right angle*.

**Give-aways found and fixed.** Read number by number against the body's
exercise list:

| where | printed | answered | now |
|---|---|---|---|
| Stage 1 Q2 | rectangle 8 by 15; $8^2 + 15^2 = 289$, $d = 17$ | Ex 2.2 Q6 (a) (8, 15, 17), Q2 (c) | rectangle 11 by 60, diagonal 61, square 3721 |
| Stage 1 Q7 | hypotenuse 29, sides differ by 1: $(20, 21, 29)$, *from $m=5$, $n=2$* | Ex 2.3 Q3 ($m=5$, $n=2$), Ex 2.3 Q1 (c), Ex 2.2 Q6 (c) | hypotenuse 53, sides differ by 17: 28 and 45, from $m=7$, $n=2$ |
| Stage 1 Q5 | *every second square has a whole-number side … the ones in between … never will* | Ex 2.1 Q6 (which sides are exact) | sentence deleted |
| carry forward | $(8,15,17)$, $(7,24,25)$, $(5,12,13)$ listed | Ex 2.2 Q1 (b), Q2 (b), (c), Q6 (a) | only $(3,4,5)$ and $(12,16,20)$ named |

The old multiple-choice questions that repeated or answered the body were
dropped, not reworded: hypotenuse of 3, 4 (Fig. 2.6); 13 and 5 → 12 and the
rectangle 5 by 12 (Ex 2.2 Q1 (b)); $(6, 8, 10)$, squares of side 8 and 6,
short sides 6 and 8 (Ex 2.2 Q1 (a)); the ladder 17/8 (Ex 2.2 Q2 (c)); the box
3 by 4 by 12 (§ 2.6.2 itself); $9, 40, 41$ (Ex 2.2 Q1 (c)); two diagonal
squares from side 1 (Ex 2.1 Q2); $m=5$, $n=2$ (Ex 2.3 Q3); 8, 15, 17 as an
area; 7 and 24 into 25 (Ex 2.2 Q2 (b)); the room 12 by 5; *at least one is
even* (Ex 2.3 Q4); $\sqrt2$ between 1.4 and 1.5, $\sqrt2$ as the diagonal and
*doubling the side gives 4* (all stated in the body); $(20, 21, 29)$ as an
option. `build/check-no-repeats.mjs` reports 12 pairs at 50–60%, every one
*same type, different numbers* (e.g. hypotenuse of 20 and 48 against the
body's 9 and 12; a square of area 18 against Exercise 2.1 Q1's 36).

**Worked examples in the chapter: 20** (4 body + 16 Beyond). Every topic is
worked under a type: doubling and halving a square; trapping a square root;
finding the hypotenuse; finding a short side; testing for a right angle;
using the theorem twice; multiples of a triple; the triple machine. Two parts
of the body have no type, deliberately: the proof of the theorem (§ 2.5) is
an argument, not a method to practise, though Practice Q16 asks about the
doubling proof; and § 2.8 (Fermat) is history.

**Practice** answers spread a 5, b 5, c 6, d 5 over the 21 lettered
questions (17 multiple choice, 4 assertion–reason). Numbering runs 1–33 with
no repeats (the script checks it). `fit-options --fix` narrowed three option
rows (Q4, Q10, Q14) to two columns.

**`ANSWERS.md` written** for every question the chapter sets: Exercise Sets
2.1–2.3, the in-text *Why should that be?*, the Think and Reflect, Stage 1
and Stage 2 (pointing to the page, with results), and all 33 practice
questions with working.

### Verified

`check-numbers.mjs` is kept beside the pages. It passes **450 claims**: 211
printed identities evaluated on the pages and in `ANSWERS.md` (display maths
taken out before inline maths), 12 printed traps $a < \sqrt n < b$, and
Baudhāyana's sum checked against its truncated decimal. It re-derives by
computation or search: every triple on § 2.7's list and which are primitive,
the machine's five pairs against that list, the lotus depth, every body and
Beyond example's Answer row read back off the page, every practice answer
read back out of the key a lettered part at a time, all triples up to 20
against `ANSWERS.md`, and that no triple of three odd numbers exists up to
200. Every multiple-choice question has exactly one right option matching
the key; assertion–reason letters are derived; `ANSWERS.md`'s key matches
the page's. 91 spans are skipped as algebra or single values (`--skipped`).

**Tested by breaking values on purpose — 14 of 14 caught:** $61^2 = 3712$
on the page; key 7 (c) → (b); $23.04$ → $23.40$ in `ANSWERS.md`; Q33 (c)
60 cm → 50 cm (a lettered part); Example 7's answer 63 → 62; the body's
$169 + 7056$ → $7065$; Q13's option 45 → 44; $(9, 12, 15)$ removed from
`ANSWERS.md`'s Ex 2.3 Q2 list; body Example 3's $x = 4$ → $5$; Stage 1's
$a = 28$ → $27$; `ANSWERS.md` key 21 (b) → (a); Example 12's 77 → 78; the
trap $1.73 < \sqrt3 < 1.74$ → $1.74 < \sqrt3 < 1.75$; Q32 (b) 60 → 70.
A fault in the first draft of the check itself was found by reading it: body
Example 3 and Stage 1 Q7 were computed but never read off the page, so a
wrong printed answer would have passed. Checks that read the page were added
before the break tests, and the two breaks above confirm them.

**No wrong numbers were found** in the printed chapter.

**Fitting.** Nothing is clipped and nothing runs into the bottom margin.
`orphans`: 0 stranded openers in 27 pages. `check-labels`: no collisions.
`fit-options`: every option row fits. Proofs of pages 8, 9 (stepped examples,
hand-fitted), 14, 17, 23, 25, 26 and 27 were read.

**Colour.** Pages 1, 2, 3, 4, 6 and 8 were read in greyscale and under
simulated colour-vision deficiency (`build/check-colour.mjs`). The fills in
Figs 2.2–2.7 differ in lightness as well as hue and every region is named by a
label or the caption; nothing depends on hue alone.

### Short pages, logged

Each is held by a block `gaps` names, which the packer cannot move.

| page | fill | held by |
|---|---|---|
| 1 | 80% | the § 2.2 head, which may not be stranded |
| 2 | 77% | Fig. 2.3 |
| 7 | 86% | Example 2, a panel |
| 11 | 87% | the § 2.8 head, moved off the foot |
| 13 | 47% | the body's last page (`data-close`) |
| 18–21 | 77–84% | Solved Examples: each page is held by the next example panel or a `Type` head with its example |
| 24 | 75% | case-based Q32 with its table |
| 25 | 67% | **the Answers stage, which always opens a page** |
| 27 | 41% | the last page |

### Flagged, not done

- **Historical claims without a source in this log** (§5a): Baudhāyana and
  the *Śulbasūtra* dated *around 800 BCE* (usually given as 800–500 BCE; e.g.
  Plofker, *Mathematics in India*, 2009 — not checked here); the verse numbers
  **1.9** and **1.12** (editions number the Baudhāyana *Śulbasūtra*
  differently — Sen and Bag's edition is usually cited as 1.45 and 1.48 for
  these two statements; needs checking against the edition meant); the
  √2 value and *decimals were still more than a thousand years away*;
  Pythagoras *some three centuries later*; Bhāskarāchārya's *Līlāvatī* in the
  twelfth century (the lotus problem); Fermat's margin note in the 1630s;
  Wiles reading of it at ten in 1963 and proving it in 1994 at forty-one;
  *more than a hundred pages*. The arithmetic of the dates is checked by the
  script, the facts are not.
- *A fifth of a hair's breadth* assumes a hair about 0.1 mm thick; the script
  checks it on that assumption.
- **The body prints values that answer its own exercises**, earlier than §
  2.7's reading order would suggest: § 2.6.1 says *$9$, $12$, $15$ would have
  been a right angle* (Ex 2.3 Q1 (a)), § 2.6.2 names $(5,12,13)$ (Ex 2.2 Q1
  (b)), and § 2.7's list prints $(8,15,17)$ and $(7,24,25)$ after Exercise Set
  2.2 asks for them. Body structure, not changed.
- Stage 1 keeps its coaching sentences (*That is worth generalising*,
  *which is worth spotting*, *Notice that*), because it is kept word for word.
- The earlier flags below (the M1 forward reference on p010 and the M2 fast
  line on p012) still stand; neither was in scope.

Language edit, 24 pages (p001–p014 chapter proper, p101–p110 Beyond the Book).
Build after editing: 24 pages, 0 stranded openers, no label collisions, every
option row fits. All 36 answers in Stage 4 checked against the questions — all
correct, including every triple, every root and the two "not enough is known"
traps.

11 fixes in 24 pages, and every one of them a single word. This is the best
chapter in the book so far and it is worth saying why, since the rest is being
measured against it:

- **The theorem is derived, twice, and named for Baudhāyana first.** The
  doubling rule is proved by counting four triangles (p002) before any algebra;
  the general theorem is proved by counting one square two ways (p007) and
  spends Part I Chapter 4's $(a+b)^2$ to do it. The Śulbasūtra is quoted at
  1.9 and 1.12, dated to around 800 BCE, and Pythagoras is placed "some three
  centuries later" — accurately, and without either overclaiming or the usual
  silence.
- **It knows the difference between a construction and a number.** p004: "a
  rule you can carry out with a cord and two pegs is worth more on a building
  site than a decimal". Then it gives Baudhāyana's own fractional value for
  $\sqrt2$ and checks it: right to five decimal places, "a fifth of a hair's
  breadth" on a ten-metre altar. I verified that sum — $1 + \tfrac13 +
  \tfrac{1}{12} - \tfrac{1}{408} = 1.4142157\ldots$ — and it is correct.
- **§ 2.8 is honest about what a hard question looks like.** Fermat's margin,
  three hundred years, Wiles at ten and at forty-one, and the closing point:
  two squares can be cut up and laid over a third, and there is no such picture
  for cubes. A Class 8 reader is told plainly that nobody can tell which
  questions are easy by looking at them.

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted.

## FIXED

| before | after | check |
|---|---|---|
| **p004** Q3 "when the side is trebled" | "when the side is tripled" | L1 — matches the *triple* used after Part I Chapters 1, 2 and 7 were edited |
| **p005** "It can be cornered." | "It can be trapped." | L3 — and *trapped* is the chapter's own word in the very next sentence. (An earlier version of this log said the fix also closed a pre-existing 1.1mm overflow on that page. Re-tested in a scratch copy with *cornered* restored: built page 5 runs 1.1mm into the bottom margin either way. The overflow is pre-existing and untouched.) |
| **p010** "if the three sides happen to satisfy $a^2+b^2=c^2$" | "…happen to make $a^2+b^2=c^2$ true" | L1 — *satisfy* is jargon |
| **p012** Q3 "Check both answers satisfy $a^2+b^2=c^2$" | "Check that both answers make $a^2+b^2=c^2$ true" | L1 |
| **p107** Q10 "If every side is trebled" | "If every side is tripled" | L1 |
| **p110** "Trebling every side treble the hypotenuse" | "Tripling every side triples the hypotenuse" | L1 — and the original does not parse |
| **p110** "$8$, $15$, $17$ satisfies $a^2+b^2=c^2$" | "…makes $a^2+b^2=c^2$ true" | L1 |
| **p110** "the commonest way to lose a mark" | "the most common way to lose a mark" | L1 |

## FLAGGED

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p010 § 2.6.2 vs p011 § 2.7 | M1 | "Two **Baudhāyana triples** went by on the way: $(3,4,5)$ across the floor and $(5,12,13)$ up to the corner." The term is defined on the next page — "Three whole numbers with $a^2+b^2=c^2$ are called a **Baudhāyana triple**" — in § 2.7, which is where the whole idea is introduced. So the reader meets the term one page before it exists, in the sentence that closes a worked example. | Either move that sentence into § 2.7 or say "two sets of whole numbers you will meet by name on the next page". A one-page forward reference, and the only one in the chapter. |
| p110 (built page 24) | — | Runs 0.8mm into the bottom margin. **Pre-existing** — I verified by reverting all four of this page's word changes and rebuilding, and the overflow is identical. Under the 12mm clipping threshold, so nothing is cut. | Recorded so it is not later attributed to the language pass. Five such pages now across the two volumes. |
| p012 | M2 | The triple-machine identity is given as one line: $(m^2-n^2)^2 + (2mn)^2 = m^4 - 2m^2n^2 + n^4 + 4m^2n^2 = m^4 + 2m^2n^2 + n^4 = (m^2+n^2)^2$. Expanding $(m^2-n^2)^2$ needs Part I Chapter 4's square-of-a-difference applied to squares rather than to letters — $a = m^2$, $b = n^2$ — which is exactly the substitution Part I § 4.6 warns is the hard step ("Writing down what $a$ and $b$ are before starting is the difference between using an identity and misremembering one"). Here nothing is written down; three expansions happen in one line. | Name the substitution, or split the line. The chapter is careful everywhere else; this is the one place it goes fast. |
