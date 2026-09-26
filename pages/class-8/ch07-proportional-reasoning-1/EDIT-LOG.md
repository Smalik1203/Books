# Class 8 · Mathematics I · Chapter 7 — Proportional Reasoning-1

## The maths-v2 conversion, 26 September 2026

**This supersedes every description of the body, Beyond the Book and the
checks further down this log.** Converted to CONVERT-V2.md with Class 6
Chapter 1 as the model. `chapter.json` now reads `maths-v2`, palette
`prism-garnet`, edition `196x276-large`, `keepExerciseSets`, accent
`#784756`. 36 pages:

* **Body p001–p018** (18 pages), NCERT's six sections in NCERT's order,
  ending on a **Summary** page (p018, `data-close`, nine points).
* **By the Book p090–p095** (6 pages, the last `data-close`): 50 questions to
  BY-THE-BOOK.md at Class 8 — very short 10, short 10 (Q12 an algebraic
  *Show that*, Q13 find-the-mistake), long 10 (Q21 and Q29 modelled with a
  letter, Q24 *In the given figure*), assertion and reason 5 (a, b, d, c, a),
  case-based 5 (each with a table), objective 10 (a, b, c, d, a, b, c, c, b, d;
  Q48 multi-statement, Q49 a named student's claim, Q47 a table). The old
  practice set's board-form questions were the raw material (the shadow, the
  16 : 9 screen, the sharing questions); none copies a body exercise.
* **Beyond the Book p101–p112** (12 pages): the old *Using What You Know*
  questions with no stage head, then Single correct · More than one correct
  · Numerical answer · Matching · Paragraph-based, two examples and then
  practice (4 · 4 · 3 · 2 · 2) each. Examples 1–8 are the old Examples 1, 4,
  7, 10, 11, 13, 14 and 15 (the two matching ones cut to three rows so the
  part fits); Examples 9 and 10 (paint shades; the tanker) are new; the 15
  practice questions are new. Answers opens a fresh page (p111): By the
  Book's key, then Beyond's.

### No NCERT expression

The earlier draft kept NCERT's contexts and every exercise question. All of
them are replaced with our own: the resized pictures (tiger photographs in
NCERT) are now Aarav's sailing-boat drawing, P to T, with new sizes and a new
Fig. 7.1; lemonade, the cement walls, the teachers' ratio, the blackboard,
Neelima's age, the 14 : 21 example, filter coffee, the mid-day rice, the car,
the tea prices, the dish for guests, the Earth's orbit and the house plan,
Puneeth's father, the shampoo, the 12 and 42 counters, the food cart and the
sand-cement mixture are now kheer, painting groups, two schools, a notice
board, Sanjay and his grandfather, 12 : 18, Gopal's sherbet (Fig. 7.4 new),
the hostel atta, a goods train, honey, counting steps, heartbeats and a
garden wall, Divya's mother, toothpaste (Table 7.6), 20 and 63 counters
(Figs. 7.7–7.8), Tenzin and Rukhsar's stall and a 60 kg mixture. Every
exercise question is new, and each set ends with a
`c-practice__note` citing NCERT's *Figure it Out* by section and question
range. The Āryabhaṭa / *trairāśika* history and the conversion table are
facts, rewritten. Removed: the NCERT rectangle, brick-wall and house-plan
figures, the *Līlāvatī* saffron problem, the body-proportion task and the
**Binairo puzzle page** (NCERT's grids; not syllabus). Using What You Know
is kept word for word except three cross-references to the body (Picture T,
Sanjay's age) and "in this stage", which no longer exists.

### Also

* Every section now has a key idea (7.6 gained *Units first*) and a Think
  and Reflect (7.1, 7.2, 7.3, 7.5, 7.6 gained one).
* Exercise Set 7.1 is five questions and 7.4 eleven, so that each set fits
  one page whole.
* `stage2-bank.mjs` deleted: it wrote the old fifteen examples into pages
  that no longer have that shape.
* `check-numbers.mjs` rewritten on the model's pattern: every identity on
  every page and in ANSWERS.md, the key complete (By the Book 1–50, Beyond
  1–15, every example ending in an Answer row), and each single-correct
  question recomputed and matched to the keyed option (unique among the
  options on By the Book). **263 checks, 0 failed.**

### Checks at close

`build.mjs` all pages fit; every page 88% or more except the Summary (75%),
By the Book's last page (76%) and the chapter's last page. `lone-words` 0;
`check-sums` 104 identities, 0 wrong; `orphans` 0 stranded; `check-labels`
no collisions; `fit-options` every row fits; no exercise set split.

### Open for the user

* NCERT page numbers for the four *Figure it Out* sets could not be
  established from the chapter's files, so the notes cite sections
  (§7.4, §7.4 rule of three, §7.5, §7.6).
* The Binairo puzzle page was dropped rather than redrawn.

## Written from NCERT, 24 September 2026

A new chapter. Class 8 Mathematics I was found to lack the NCERT chapter
*Proportional Reasoning-1*; this directory writes it, to the Class 7/8
standard (DESIGN-MATHS §5, §5a, §6a, §10; PLAN-MATHS-CONSISTENCY §4–§7),
with `ch01-square-and-cube` as the model.

**Source.** NCERT *Ganita Prakash*, Grade 8 Part I, Chapter 7, **Reprint
2026-27** (`8 Math-1/Chapter 7.pdf`, 30 pp.: the chapter, the Binairo puzzle
page and NCERT's own appended answers). Text was extracted with
`pdftotext -layout`; figures were read from page renders. No sentence is
copied; the prose is rewritten in the house register and every question,
number and NCERT numbering is kept.

**Pages: 30** — 17 body (`p001`–`p017`, `data-close` on `p017`) and 13
Beyond the Book (`p101`–`p113`, every one `data-bridge`). Palette bronze,
page 196 × 276.

### What was built

**The body, in NCERT's order.** 7.1 Observing Similarity in Change; 7.2
Ratios; 7.3 Ratios in their Simplest Form; 7.4 Problem Solving with
Proportional Reasoning (Examples 1–7, *Filter coffee*, Exercise Set 7.1,
*Trairāśika — the rule of three* with Examples 8–10, Activity 1, Exercise Set
7.2, the Puneeth Think and Reflect, Activity 2); 7.5 Sharing, but Not Equally!
(Activity 3, Examples 11–12, Exercise Set 7.3); 7.6 Unit Conversions (Exercise
Set 7.4, 12 questions); Summary; Puzzle: Binairo. NCERT's four *Figure it Out*
sets are Exercise Sets 7.1–7.4, as the rest of Class 8 names them.

- **All 12 examples stepped** — Solution, Step rows, Answer, reasons in
  `.work__why`. NCERT's Examples 4 and 5 are open questions about the reader's
  own school; each is stepped as the procedure, with Example 5 worked on a
  stated instance ($360 : 120$).
- **Key ideas (5):** changing in proportion; ratio; simplest form and
  proportion; cross multiplication (extremes and means); dividing in a given
  ratio. One `.c-tip` (adding to both terms changes a ratio), with a
  similar-rectangles mark.
- **Terms glossed with `.term`:** proportional, ratio, terms, simplest form,
  proportion, equivalent ratios, similar, cross multiplication, extremes, means,
  rule of three, unitary method. *Equivalent ratios*, *extremes*, *means* and
  *unitary method* are not in NCERT's chapter and were added once each as the
  words school papers use (§10, *required terms*).
- **Figures and tables, one sequence:** Fig. 7.1 (the five images), Table 7.2,
  Fig. 7.3 (Example 7's factor), Fig. 7.4 (coffee cups), Table 7.5, Fig. 7.6
  (rectangles), Fig. 7.7, Fig. 7.8 (brick walls), Fig. 7.9 (house plan), Table
  7.10 (shampoo), Figs. 7.11–7.12 (sharing), Table 7.13 (conversions), Figs.
  7.14–7.15 (Binairo). Every figure is inline SVG in the `.dg-*` vocabulary,
  generated from computed coordinates so that each proportion the chapter asks
  about is exact in the drawing:
  - Fig. 7.1 replaces NCERT's five tiger **photographs** with one drawn scene
    (tree, hut, sun) mapped into the five frames of Table 7.2, so B is
    stretched and E squeezed by exactly the table's factors.
  - Fig. 7.6 is drawn to the millimetre at `--lg` (4 viewBox units a mm):
    A 8 × 24, B 18 × 12, C 25 × 10, D 30 × 10, E 15 × 6. NCERT's own rectangles
    measure about 1 : 3.07, 3 : 2, 2 : 2.51, 1 : 3.03, 2 : 2.54 in the PDF;
    ours are the exact ratios they approximate (A ~ D, C ~ E, B alone).
  - Fig. 7.7 prints at 40 mm × 30 mm; Fig. 7.8 keeps NCERT's patterns (3 : 2
    and 4 : 3, light to dark), and `check-numbers.mjs` counts the bricks in
    the SVG itself.
- **Questions kept with their figures** in `.c-figure-context`: Ex. 7.1 Q4–Q6,
  Ex. 7.2 Q2, and the Table 7.5 prompt.
- **Left out, as house convention:** NCERT's *Math Talk* labels (their
  questions stay, as plain questions or the Think and Reflect), the four *Note
  to the Teacher* boxes (Teacher's handbook material), and the decorative
  illustrations — lemonade, the coffee-seller, the children with counters,
  the crane and girl, the emoji, the puzzle banner. None carries data a
  question uses.

**Beyond the Book, the four stages of the model.**
1. *Using What You Know* — 8 tries, each explained in running text: photo and
   frame (shape is the ratio, not one side), boys and girls $5 : 4$ plus six,
   sharing 50 marbles, Celsius is not proportional to Fahrenheit (and $-40$),
   $4 : x :: x : 25$, mixing syrups, a clock that loses time, profit shared by
   money × months.
2. *Solved Examples* — 15, in the order 6 single / 4 multiple / 3 numerical /
   2 matching, generated by `stage2-bank.mjs` (imports `panel()`/`matching()`
   from `build/jee-tools.mjs`, same `tie` and replace conventions as
   `jee-class8.mjs`; `--install` writes them into the pages). Keys: a b c d a b;
   acd, bc, abd, acd; 15, 988400, 1700; (b), (c). `build/jee-class8.mjs` and
   `check-jee-class8.mjs` were **not** touched.
3. *Practice* — 31 questions: 15 multiple choice, 4 assertion–reason (Class 7
   form), 3 very short, 4 short, 3 long, 2 case-based. Key letters a5 b5 c5 d4.
4. *Answers* — opens a fresh page (`p113`).

**Against Proportional Reasoning-2** (`p2ch03-proportion`, read whole, not
edited). This chapter sets up what it assumes: ratio and simplest form,
$a : b :: c : d$, cross multiplication and the rule of three, dividing in
$m : n$, and the warning that speed and time are *not* direct (Part II
§3.7 takes it up; the Think and Reflect says so). Nothing in Beyond repeats a
Part II question or example: no three-term ratios, maps, pie charts, inverse
proportion, work-together, the $5 : 7$ plus six numbers or the $5 : 3$ ages.

### What was verified

- `node build/build.mjs class-8/ch07-proportional-reasoning-1` — **all pages
  fit**, no violations.
- `refit … body` and `refit … bridge`, then the prose at three joins was
  edited (an opening paragraph under *Trairāśika*, a longer opening to 7.6,
  Example 10 tightened by two rows) and the body refit again: body pages all
  89–99% but the closing page.
- `orphans` 0 stranded; `fit-options` every row fits; `check-labels` no
  collisions; `check-no-repeats` nothing in the division close to the body;
  `check-maths-captions` no caption out of place.
- `check-numbers.mjs` — **351 claims hold, nothing failed**: 144 identities
  evaluated; every body value, every exercise answer, every figure's own
  measurements (rectangles, bricks, house plan, Binairo givens read back out
  of the SVG), all three Binairo puzzles solved by exhaustive search (one
  solution each), Stage 1, all 15 Stage 2 examples with every option
  recomputed and the pages checked to carry the bank exactly, every practice
  option and assertion–reason letter, and ANSWERS.md's keys against the pages.
- Beyond checked for give-aways: it prints none of 15660, 18076923, 52.5,
  18.5, 3 : 13, 82645, 36364 or 7.85 (guarded in the script).
- §4.8 greps: `c-stage__for` 0, `c-case__label` 0, `c-practice__num` 1,
  `--head`/`--tail` 0, stepped examples 12 of 12.
- PNG proofs were read for pages 1, 2, 6, 7, 8, 10, 11, 13, 14, 16, 17, 18, 21, 25, 29 and 30 — every figure page, the opener, Stage 1, Stage 2, the case questions and the key; four repairs came of it (a misleading guide line in the opener sketch, rectangles B and A nearly touching in Fig. 7.6, fractions breaking across lines in a key idea and the summary, and a rupee sign split from its amount in Example 10).
- `check-example-stepping` and `check-body-maths` compare against git HEAD;
  the chapter is new and untracked, so both report "0 at HEAD" and have
  nothing to compare. Not applicable, not a failure.

### Short pages, logged not padded

| page | fill | held by |
|---|---|---|
| 22 (`p105`) | 86% | Stage 2 Example 6, a whole panel (59 mm) |
| 29 (`p112`) | 65% | the Answers stage, which always opens a fresh page |

### FLAGGED

| location | code | what is wrong | what it needs |
|---|---|---|---|
| p010, the rule of three | C3 / fact | NCERT prints "Āryabhaṭa (199 CE)". Āryabhaṭa's *Āryabhaṭīya* is dated 499 CE (it states he was 23 in Kali year 3600), as `ch01-square-and-cube` also prints. **Printed 499 CE.** The rule quoted is *Āryabhaṭīya*, Gaṇitapāda 26 (K. S. Shukla and K. V. Sarma, *Āryabhaṭīya of Āryabhaṭa*, INSA, New Delhi, 1976) | confirm the verse number against the edition before press |
| p016, Ex. 7.4 Q5 | fact | "an old problem from the *Līlāvatī*" — attribution is NCERT's; the verse was not traced in an edition here | find it in Colebrooke (1817) or Patwardhan et al. (2001) and record it, or print it without the attribution |
| p004, Example 2 | C4 | NCERT says Kesang's father asked for "18 **more** glasses" but solves for 18 glasses **in all** (30 spoons). Worded here as "18 glasses instead", which matches NCERT's numbers and solution | none, unless NCERT's intended 24 glasses (40 spoons) is preferred |
| p011, Ex. 7.2 Q2 | C4 | NCERT: "the inner wall that separates two rooms", but its plan has two inner walls (12 ft and 6 ft) and its own answer (108 ft, 15 660 bricks) counts both. Worded "the inner walls that separate the rooms" | none |
| p015, Ex. 7.3 Q5 | C4 | NCERT's answer ($3 : 13$) needs the added bucket to be the same size; the book now says so | none |
| p015, Ex. 7.4 Q2 | C3 | NCERT's question says "204 students"; its appended answer says "204 students and teachers". The question's wording is kept; the answer treats 204 as everyone going | none |
| p016, Ex. 7.4 Q7 | fact | $37 : 2$ makes a litre of gold 18.5 kg; gold's density is about 19.3 g/cm³, which would be 19.3 kg. NCERT's ratio is kept | decide whether to keep NCERT's number or change the ratio to $193 : 10$ |
| p016, Ex. 7.4 Q12 | fact | the ₹10 coin as 7.74 g of 75 : 25 cupro-nickel is NCERT's; current ₹10 coins are bimetallic (RBI), and the figures were not checked against an RBI specification | check RBI/SPMCIL coin specification before press |
| p016, Ex. 7.4 Q3 | fact | Delhi 1,484 sq km, Mumbai 550 sq km, populations "about" 30 and 20 million: NCERT's figures, kept, not independently sourced | none for a ratio exercise; source if kept as fact |
| p017, Fig. 7.14 | C6 | NCERT's worked Binairo has **two** solutions (the printed one, and the same grid with rows 2 and 6 exchanged), so "the solution" is not unique. Printed as NCERT's; the three puzzles to solve each have exactly one | add one given to the worked puzzle if a unique solution is wanted |
| Fig. 7.1 | — | NCERT's tiger photographs are replaced by a drawn scene; the proportions follow Table 7.2 exactly | none |
