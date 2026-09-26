# Class 8 · Mathematics II · Chapter 1 — Fractions in Disguise

## The maths-v2 conversion, 26 September 2026

**This supersedes every description of the body, the exercises, By the Book
and Beyond the Book further down this log.** Converted by CONVERT-V2.md
against the Class 6 Chapter 1 model. `chapter.json`: design `maths-v2`,
palette `prism-marine`, edition `196x276-large`, `keepExerciseSets`, accent
`#226174`. 40 pages:

* **Body p001–p019**: sections 1.1–1.8 in the old order, p019 the Summary
  (`data-close`, nine points).
* **By the Book p090–p096** (`data-board`): 50 questions, 10 · 10 · 10 · 5 ·
  5 · 10, one numbered run; p096 (`data-close`) holds only Q50.
* **Beyond the Book p101–p114** (`data-bridge`): the eight tried-and-explained
  questions with no stage head, then Single correct · More than one correct ·
  Numerical answer · Matching · Paragraph-based, two examples each and
  4 · 4 · 3 · 2 · 2 practice; Answers (no numeral) on a fresh page, By the
  Book key then Beyond key.

### No NCERT expression

Every context in the body was treated as NCERT's and replaced: Surya's paint
(now Gauri, 3/5), Madhu and Madhav's biscuits (Pooja and Dev's juice), millet
kanji (a 3 : 11 lemon sherbet), Eesha/Reema/Vishu's marks (Rohan, Anjali,
Kiran), the badam drink table (two breakfast cereals), tomatoes and the
cinema (onions, a bus route), the 1961/1991 town (a tree's height),
Kishanlal's sweaters (Farida's school bags, ₹400/₹640/₹560), Shambhavi,
Raghu, the shirts' GST bill, the ₹6,000 deposit (₹8,000), the television
(a motorbike), Surbhi's 50/50 cookware (Harish, 40/40, even at 2/7) and
Ariba/Arun's marbles (Salma/Vikram, 125%). The introduction's unsourced
water fact is now "about 70% of the Earth's surface is covered by water".
Every exercise question is new, and each set ends with
`<p class="c-practice__note">NCERT, Figure it Out, §1.x</p>`; **no NCERT page
number could be established**, so the sections cited are this chapter's own
section numbers.

### Added teaching

Every section now has a key idea and a Think and Reflect (1.1, 1.4, 1.7 and
1.8 gained key ideas; all but 1.8 gained Think and Reflect). §1.7 now names
**simple interest** and **compound interest** (the older flag below) and
credits powers to Part I, Chapter 2; it gained the interest as amount less
principal and a six-monthly Think and Reflect. §1.8 gained Example 8 (a rise
and fall undone by dividing by 0.96) and two questions in Exercise Set 1.7.
Diagram fill `dg-fill-d` (beige, not used in maths-v2) became the soft fills.

### Beyond the Book

The tried-and-explained questions are word for word except: three
"$x\%$ of $y = z$" spans now read "… is $z$" (check-sums read them as false
identities); "a markup of 50% needed a discount of a third" now reads "40% …
two sevenths", because the body example it points to changed; and `&nbsp;`
binds a last word in three paragraphs. Kept from the old 15 examples: 2, 6
(single), 8, 9 (multiple), 11, 13 (numerical), 14, 15 (matching), without
their format tags or "Choose…" lines; Check rows added to several. Examples
9–10 (shoes in a sale; fish in a lake) and all 15 practice questions are new.
The old board-form practice became raw material for By the Book (A–R items,
the school-shop and deposit cases, Q43–47).

### Checks at close

`build.mjs`: all pages fit, every page ≥ 88% except p019 (Summary), p096
(By the Book's last) and p114 (last). `lone-words` 0; `check-sums` 79
identities, 0 wrong; `orphans` 0 stranded; `check-labels` no collisions;
`fit-options` every row fits. `check-numbers.mjs` rewritten for this layout
(identities with fractions, per cent and rounding; key complete; every
computable single-correct option recomputed; A–R and objective letters
spread): 472 checks, 0 failed, and planted errors are caught.


## Solved examples in examination formats, 23 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 18 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-8/p2ch01-percentages/`.

Source `build/jee-class8.mjs`; check `build/check-jee-class8.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p113; the answers stage still opens a fresh page.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) 820 |
| 2 | Single correct | (b) ₹700 |
| 3 | Single correct | (c) $26\%$ |
| 4 | Single correct | (d) ₹13 891.50 |
| 5 | Single correct | (a) $35\%$ |
| 6 | Single correct | (b) $60\%$ |
| 7 | Multiple correct | (a), (b), (d) |
| 8 | Multiple correct | (a), (b), (c) |
| 9 | Multiple correct | (a), (b) |
| 10 | Multiple correct | (a), (b), (c) |
| 11 | Numerical answer | 40 |
| 12 | Numerical answer | 51200 |
| 13 | Numerical answer | 30 |
| 14 | Matching | (a) P–2, Q–4, R–3, S–1 |
| 15 | Matching | (c) P–3, Q–4, R–2, S–1 |


## Brought to the Class 7 standard, 17 September 2026

Phase 3 of `PLAN-MATHS-CONSISTENCY.md`, done against the Class 8 Chapter 1
model (`pages/class-8/ch01-square-and-cube/`). I read the whole chapter before
changing anything, and ran every check on the whole chapter.

**Pages: 26 before (16 body + 10 Beyond, Crown Quarto), 30 after (15 body +
15 Beyond, 196 × 276).** The taller page saved one body page, even though
every example is now set as steps. Beyond grew by five pages. Stage 1 now
carries its own explanations, and there are 18 new solved examples and 30
practice questions.

### What changed

**The page.** `chapter.json` now has `"edition": "196x276"`. I refitted the
body once, after stepping the examples. Refit left page 15 at 43% and page 16
holding only the summary. So I moved the summary onto page 15 by hand, and
took three summary items down by a line each so that it fits: item 2 (*Read
it either way*), item 9 (*A multiplier below 1 gives depreciation*) and item
5, which now keeps *2 : 7* on one line. No fact changed. Page 15 closes the
body and carries `data-close`. After that I placed pages by hand, one block
at a time with a build after each, to close the gaps refit left: Example 7
on page 12, Example 3 on page 7, the fractions table on page 2, Fig. 1.1 on
page 1, Figs. 1.2, 1.3 and 1.6 beside their own text, and Stage 2's type
heads with their examples. Three prose edits were made at the joins, each to
remove one whole rendered line. No maths changed in any of them:

| page | before | after |
|---|---|---|
| p002 | *A few of these are worth knowing by sight, because they turn up constantly and because recognising one saves you the arithmetic.* | *A few are worth knowing by sight, because they turn up often and save you the arithmetic.* |
| p012 | *Compounding is not only about money, and it is not only about growth. … and the arithmetic is the multiplier again — this time smaller than one.* | *… and not only about growth. … compounding downwards, with a multiplier smaller than one.* |
| p013 | *Call the wholesale price of the stock $x$* | *Call the wholesale price $x$* |

**A pointer made true.** p012 said *what the repeated multiplication did in
the table opposite*. On the new page the ₹6,000 table is overleaf, so the
sentence now reads *in the year-by-year working*. That wording stays true
however the pages break.

**Fig. 1.6.** The *0.75x* label printed across the end of its own bar and
into the dotted line. It now sits to the right of the dotted line, as the top
bar's *x* label does. `check-labels`: no collisions.

**All seven body examples are set as steps**: *Solution*, one step per
`.work__row`, an *Answer* row, and the reason in a `.work__why`. The old wide
labels (*by equal fractions*, *after the rise*, *notebook*, *after 3 years*)
became the reasons. In Example 3 the two statements are part of the
question, so they stay as they were, with *Solution* before the line that
names $p$ and $q$. The closing remarks stay as paragraphs after the working.
`build/check-example-stepping.mjs` compares 7 examples and reports **one
difference, which is deliberate**: Example 7's corrected value (below).
Nothing else was lost or added.

**Example 7 corrected (the user's instruction).** The page printed
$21{,}000 \times 0.95^3 =$ ₹18,015 (to the nearest rupee). In fact
$0.95^3 = 0.857375$ and $21{,}000 \times 0.857375 = 18{,}004.875$, which is
**₹18,005**. The working now prints the exact value, $18{,}004.875$, and the
Answer row gives *₹18,005 after three, to the nearest rupee*, so the rounding
is stated. Nothing else in the chapter used this figure. `ANSWERS.md` records
the correction, and `check-numbers.mjs` works the value out from
$21000 \times 0.95^3$ and checks the printed sentence against it.

**Money rounding, checked throughout.** Every money value is either exact,
exact to the paisa (₹43.20, ₹492.80, ₹13,891.50, ₹1,769.60, ₹31,492.80,
₹6,298.56), or marked *to the nearest rupee* (₹18,005, ₹16,105, ₹17,716).
Stage 1's ₹16,105 and ₹17,716 had been printed with no rounding stated. They
now say *to the nearest rupee*. Percentages that do not come out exactly are
printed to one decimal place (43.3%, 10.4%, 14.3%, 33.3%, 83.3%, 16.7%, 90.9%).
Example 6's answer and the exercise answers say so where it matters.

**Beyond the Book rebuilt to the four current stages** (§6a):

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 8 `.c-try` questions, answered in the next stage | **the same questions, each followed by its own explanation**, word for word except as below; `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | the worked answers to stage 1 (*The same eight questions, worked*) | **18 stepped examples**, Examples 1–18, under eight `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, 36 questions | **one numbered run of 30**: 14 multiple choice, 4 assertion–reason, 3 very short, 4 short, 3 long, 2 case-based; band carries the numeral |
| 4 Answers & Takeaways → **Answers** | key and why the options are wrong | key, every other answer in `.work--trace` blocks, why the options are wrong for 9 questions, and two paragraphs of the old *What to carry forward* kept without their head. The third was dropped (see give-aways) |

**Stage 2 was stage 1's answers.** The old stage 2 explanations were moved
under their own questions, word for word, keeping their `.work` blocks and
dropping only the `.c-solution` wrapper and its title. The old stage 2
intro paragraphs now open stage 1. Two sentences that pointed at the next
page were corrected: *Try each before turning the page* became *Try each
before reading what follows it*, and *The eight are answered below in the
order they were asked* became *Each question is answered straight after it*.

**Two sentences in stage 1 corrected:**

| was | why | now |
|---|---|---|
| *Taking 12% off ₹560 instead gives ₹492.80, which is the answer to a different question: what 12% of the bill would have been.* | 12% of the bill is ₹67.20; ₹492.80 is what is left after taking it off | *… what is left of the bill once 12% of it is taken off.* |
| *Simple interest would have taken it to ₹15,000 in exactly five as well — but a year later the two are ₹16,000 and ₹17,716 apart* | *simple interest* is used nowhere else in the chapter (flagged below); the two values are the amounts, not a gap; and the rounding was not stated | *With the interest paid out each year, it would have reached ₹15,000 in exactly five as well — but a year later the two stand at ₹16,000 and ₹17,716, to the nearest rupee* |

**Give-aways found and fixed.** I checked every value Beyond prints against
the body's exercise answers by reading, question by question.
`build/check-no-repeats.mjs` reports one pair above 50%: Solved Example 2
against Exercise Set 1.1 Q2. They are the same type with different numbers,
so the pair stands.

| where | printed | answered | now |
|---|---|---|---|
| Stage 1 Q2 | up 20% then down 20%, and *the order makes no difference — 0.8 × 1.2 is the same product — so a cut before a rise leaves you exactly as short* | the Think and Reflect in § 1.8 (which shop is lower), and Ex 1.4 Q4 (the same 20%) | numbers changed to **30%** (1.3 × 0.7 = 0.91, a fall of 9%); the order sentence deleted |
| Stage 1 Q7 | rice up 25%, so cut the amount by 20%: *a rise of a quarter is undone by a cut of a fifth* | Ex 1.7 Q4 (the discount that undoes a 25% markup) | rice up **60%**, cut 37.5%, *three fifths … three eighths* |
| old Set A 5–6 key | ₹40 to ₹50: *a rise of 25% and a fall of 20%* | Ex 1.7 Q4 | now Practice 5–6, **₹60 to ₹80** (33.3% and 25%) |
| old Set B 7 | ₹8,000 at 10% for two years, the difference is ₹80 | Ex 1.6 Q1 exactly | dropped |
| old Set B 10 | a rise of 25% is undone by a fall of 20% | Ex 1.7 Q4 | dropped |
| old Set B 2, Set C 12 | up 20% and down 20% gives ₹192; down 10% and up 10% gives 1% lower | Ex 1.4 Q4 and the Think and Reflect | dropped |
| old Set C 4 | 10% a year first more than doubles after 8 years | Ex 1.6 Q4 exactly | dropped |
| old Set B 1 | 10% twice is 21% | the body prints $1.1$ twice $= 1.21$ | now Practice 11, 20% twice (44%) |
| old *carry forward*, third paragraph | *up and down by the same percentage always leaves you lower* | Ex 1.4 Q4 (*without calculating, say whether…*) | dropped |

The other old multiple-choice items were either kept as they were (old Set A
1–4, 7–10 and Set B 4 became Practice 1–4, 7–10 and 12) or not reused.

**Worked examples in the chapter: 25** (7 body + 18 Beyond), against §5a's
twelve. Every topic has a type: fractions, decimals and percentages; a
percentage of a quantity, and the whole from a part; ratios and mixtures;
comparing with percentages; percentage change and multipliers (with changes
in a row); profit, loss, discount and tax; interest, growth and depreciation;
undoing a change, and *more than* against *less than*.

**Exercise numbering.** All seven body sets run 1, 2, 3 … with no repeat, and
Practice runs 1 to 30. `check-numbers.mjs` checks both.

**`ANSWERS.md` written.** It answers every question the chapter sets: the
seven exercise sets, the in-text questions (Surya's paint, Madhu and Madhav),
the Think and Reflect, the Example 7 correction, stage 1 (each explained on
the page, with a one-line answer here), and the 30 practice questions with
their working. Exercise Set 1.2 Q1 (*estimate first*) gives one worked
estimate for each part.

### Verified

`check-numbers.mjs` is kept beside the pages and passes **550 claims**. It
evaluates **275 printed identities** on the pages and in `ANSWERS.md`. A side
printed as $n\%$ may be read as $n$ or as $n/100$. A decimal side may be
rounded only to its printed places, and a side cut short with … may only be
truncated. The script joins identities the book splits across a rupee sign
or across *of*. It also checks what arithmetic alone cannot: the fractions
table, the badam table and its totals, the figure labels (₹130/₹50,
₹7,800/₹7,986), every money value printed after a rupee sign, the year-count
searches (Stage 1 Q8, Ex 1.6 Q4), and every solved example's Answer
sentence. It reads each practice answer back out of the page's key rows,
part by part for 29 and 30. It solves every multiple-choice question and
requires exactly one right option, the one the key prints. It derives the
assertion–reason letters, checks that the key letters are spread (a 4, b 5,
c 5, d 4), and checks that `ANSWERS.md`'s key and bold answers match the
page and the computation. The 40 spans it skips contain letters, such as
$0.28 \times n = 196$; section B covers their values.

**Tested by breaking values on purpose: 12 of 12 caught.** Example 7's answer
set back to ₹18,015; key 14 changed to (a); $1580 \times 1.12 = 1796.6$ in
`ANSWERS.md`; 30 (b) *₹160 less* changed to ₹170; $130/300 \times 100 =
43.8\%$ in the body; the right option of Practice 12 changed to ₹20,500; the
badam row *50 g → 25%* changed to 35%; `ANSWERS.md` key 14 changed to (b);
29 (a) ₹1,020 changed to ₹1,002; Solved Example 13's ₹1,408 changed to
₹1,480; Stage 1's ₹17,716 changed to ₹17,761; and `ANSWERS.md` Ex 1.6 Q3
*about 911* changed to 915. The last was **missed at first**, because the
check for 911 matched the front of 911.25. A number must now not be followed
by a digit or by a point and a digit, and the change is caught.

**Faults found in the check itself**, fixed: floating-point noise
(499.99999…); `\%` left in the plain text; values cut short with … being
treated as rounded; and a percent sign inside an expression ($20\%$ of $60$)
being skipped rather than read as /100.

**Fitting.** Nothing is clipped. Page 6 runs 1.1 mm and page 9 runs 1.6 mm
into the bottom margin, both inside §5a's 3 mm. `orphans`: 0 stranded
openers in 30 pages. `fit-options`: every option row fits.
`check-labels`: no collisions. I read the proofs of pages 1, 2, 7, 10, 12,
13, 15, 16, 20, 21, 26, 27, 29 and 30. On page 30 the fractions in row 1
collided with the next line, so they were set as `\tfrac`. On page 29 the ₹
of ₹31,492.80 was left at a line end, so that row now ends in *rupees*.

**Colour.** Pages 1, 3, 5, 9, 12 and 13 (every figure) were checked in
greyscale and under simulated deuteranopia, protanopia and tritanopia with
`build/check-colour.mjs`. No figure depends on hue alone. Every bar row
carries its name (*no compounding*, *with compounding*, *she paid*,
*marked*, *sold*, *English*, *Science*), and every value carries a label.

### Short pages, logged

Each is held by a block `gaps` names, which cannot move up.

| page | fill | held by |
|---|---|---|
| 7, 8 | 86% | the key idea *A change is a multiplier* (misses by 0.2 mm past the limit when moved); the § 1.6 heading |
| 9 | 84% | Example 5, a panel |
| 14 | 78% | the chapter summary, which cannot be divided |
| 15 | 51% | the body's closing page (`data-close`) |
| 19 | 83% | the *Type 2* head with its example |
| 22, 24 | 84–86% | the next solved example, a panel |
| 26 | 87% | the *Very short answer* group |
| 28 | 24% | **case question 30 alone: the Answers stage always opens a page** |
| 29 | 73% | the *Why the other options are wrong* head with its rows |
| 30 | 66% | the last page |

### Flagged, not done

- **The syllabus names *simple interest* and *compound interest* are not in
  the body.** § 1.7 says *interest paid out* and *left in*, and the formulas
  are labelled *without compounding* and *with compounding*. The one Beyond
  use of *simple interest* was reworded to the chapter's own phrase rather
  than left undefined. §10 asks for the paper's terms in the body. This
  needs an authoring decision (see the older flag below).
- *The base* (p007 key idea, the closing paragraph of Answers) is the fourth
  meaning of *base* in the book. It is still flagged, as below.
- The exponent in $p(1+r)^t$ is still not credited to Part I Chapter 2
  (older flag, C5).
- Example 5 says she sells crayon boxes *also at a profit of 25%* after a
  profit of 20% on notebooks. The *also* reads wrongly. Not changed, because
  it sits inside a worked example's question.
- In Example 5's question, the ₹ sign can end a line with its number on the
  next line. Fixing this needs a no-break maths-and-rupee span in the system,
  not an inline style.
- The introduction's *Only 12% of the water on Earth is fresh* has no
  source. The usual figure is about 2.5–3%, so this is probably wrong. It is
  a fact claim, so §5a needs a source or a correction before press.
- Stage 1 keeps its old coaching sentences (*the habit of asking … is worth
  more than the seven rupees suggests*), because it is kept word for word.
- Stage 1 Q2 (up 30%, down 30%) is the same type as Ex 1.7 Q1, with
  different numbers, which the rule allows. It does show that equal rises
  and falls do not cancel, which Ex 1.4 Q4 asks the reader to say *without
  calculating*. § 1.8's own heading says the same, so it was left.

---

Language edit, 26 pages (p001–p016 chapter proper, p101–p110 Beyond the Book).
Build after editing: 26 pages, 0 stranded openers, no label collisions, every
option row fits. All 36 answers in Stage 4 checked against the questions — all
correct.

8 fixes in 26 pages. The chapter is well made and well localised: Surya mixing
paint, millet kanji at $2:7$, badam drink mixes, Kishanlal's sweaters, GST on a
bill the reader is told to go and check at home, ₹ and lakh throughout. It
teaches percentage change as a **multiplier** and then spends the rest of the
chapter on the one thing that actually confuses people — which amount the
percentage is *of*. § 1.8 (a rise and a fall do not cancel) and the Ariba/Arun
marbles paragraph are the clearest treatment of that I have seen at this level.

**One arithmetic error, and it is in a worked example.** See the first row of
FLAGGED. Everything else in the chapter computes correctly, including the
compound-interest table, the two-vases loss and the salt-solution questions.

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted. The stepping check's one difference is the intended Example 7 correction (18,015 → 18,004.875, ₹18,005). Three edits: p001's *Only 12% of the water on Earth is fresh* now reads *About 3%* — the usual figure is 2.5–3%, and it still needs a source before press; Example 5's *also at a profit of 25%* lost the *also*, which did not fit after the 20% just before it; and practice Q29 was moved onto the page with Q30, so both case-based questions sit together and Q30 no longer stands alone before the Answers stage (95% / 24% → 62% / 58%). Every rupee amount written as `₹$…$` is wrapped in `<span class="nb">`, so the sign can no longer end a line with its number on the next. Nothing reflowed; `check-numbers.mjs` gives the same count of claims with and without the spans. `check-numbers.mjs` now unwraps that span before joining `= $ ₹$…$` into one identity; without that it fell from 550 claims to 536 and failed three answer rows. A value changed inside a span is still caught.

## FIXED

| before | after | check |
|---|---|---|
| **p001** "a bank account does not pay you interest on the amount you first deposited for very long" | "a bank account soon stops paying interest on just the amount you first put in" | L3, L6 — the original has to be read twice to find the verb |
| **p005** "this is that rule earning its keep" | "this is that rule doing its work" | L1 — idiom; the same one was removed from Part I Chapter 1 |
| **p010** "and it is not arbitrary" | "and it is not an accident" | L1 |
| **p015** "What discount would have brought her out level?" | "What discount would have left her exactly even?" | L3 — idiom |
| **p110** "the single commonest slip in this chapter" | "the most common slip in this chapter" | L1 |

**Correction to an earlier version of this log.** It recorded that the p010 fix
had closed a pre-existing 1.6mm overflow on built page 10. It has not. Re-tested
properly — the chapter copied to a scratch directory, *an accident* reverted to
*arbitrary*, built, and the fill maps compared — page 10 runs 1.6mm into the
bottom margin either way, and so do pages 1 and 4, with page 25 at 1.3mm. **All
four are pre-existing and none is affected by this edit** ("an accident" is one
character longer than "arbitrary", so it could not have helped). Every figure is
under the 12mm clipping threshold, so nothing is cut. Recorded so the pass is
not credited with a repair it did not make.

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p013, Example 7 | C4 | **The answer is wrong by ₹10.** "A television bought for ₹21,000 loses 5% of its value every year… after 3 years $21{,}000 \times 0.95^3 =$ ₹18,015 (to the nearest rupee)." But $0.95^3 = 0.857375$ and $21{,}000 \times 0.857375 = 18{,}004.875$, which is **₹18,005** to the nearest rupee. The year-one figure in the same example (₹19,950) is right, so a reader who checks by multiplying three times — which is exactly what the chapter has just taught them to do — gets 19,950 → 18,952.50 → 18,004.88 and will not reach the printed answer. It is a number in a worked solution, so I have not changed it. | Correct to ₹18,005. Worth checking whether the same figure appears in any answer key or question elsewhere; it does not in this chapter. |
| p012, p105 | M1 | The chapter deliberately avoids the syllabus names, saying "if the interest is paid out every year" and "if the interest is left in the account", and its formulas are labelled "without compounding" and "with compounding". That is clearer than *simple* and *compound interest* and I would not touch it — except that p105, in Beyond the Book, then writes "**Simple interest** would have taken it to ₹15,000 in exactly five as well", using a term the chapter never introduces, once. A reader meets the exam's word for the first time in a solution, undefined. | Either introduce both names in § 1.7 alongside the plain phrasing (they are what every exam paper and bank form will call them), or remove the term from p105. The first is better: the plain wording is the teaching, the names are the vocabulary a student will be marked on. |
| p008 key idea, p110 | M1 | "**The base is where you started**", and later "Name the base out loud". This is the fourth distinct meaning of *base* in the book: the base of a power (Part I Ch 2), the base of a number system (Part I Ch 3), the base of a triangle or a cuboid (Part I Ch 7), and now the amount a percentage is taken of. Nothing acknowledges any of the others. | The chapter's own prose mostly says "the original amount", which is unambiguous and needs no gloss. Either use that consistently or note that *base* is being borrowed. See CROSS-CHAPTER.md. |
| p013 | C5 | "the exponent is doing exactly what the repeated multiplication did in the table opposite" — the exponent notation $p(1+r)^t$ is Part I Chapter 2's, and this is the first place in Mathematics II that spends it. Every other borrowing in this chapter is credited by name ("Chapter 6 of Part I said that anything may be done to an equation…", p005). This one is not. | Name it, as p005 does. A reader who has forgotten what an exponent counts has nowhere to look. |

## 24 September 2026 — NCERT title

The chapter now carries NCERT's own title, *Fractions in Disguise*, taken from the chapter's first page in the NCERT textbook, in place of the house title it had. Changed in `chapter.json` and the opener heading in `p001.html`; nothing else in the chapter uses the title.
