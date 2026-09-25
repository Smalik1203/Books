# Class 9 · Mathematics I · Chapter 6 — Measuring Space: Perimeter and Area

## Written from NCERT, 24 September 2026

A new chapter. The Chapter 6 this book carried taught lines and angles, which
NCERT's current book does not have; it is kept, untouched, in
`retired/class-9/ch06-lines-and-angles/`, and nothing of it is reused here.
This chapter is NCERT's own Chapter 6, *Measuring Space: Perimeter and Area*,
from *Ganita Manjari*, Grade 9 Part I, First Edition April 2026, pages
118–154, read from `Chapter 6.pdf` (text by `pdftotext -layout`, every figure
page rendered and read as an image).

**Pages: 46 — 34 body (p001–p034) + 12 Beyond the Book (p101–p112), on the
196 × 276 page.** `chapter.json`: palette indigo, edition 196x276, subject
Mathematics I, opener title in two parts as Chapter 1 sets it.

### What was built

**The body is NCERT's chapter in NCERT's order**, every section, subsection,
figure, example, exercise set, puzzle, Think and Reflect, activity and box,
with NCERT's numbering, rewritten in the house register (DESIGN-MATHS §10):

| NCERT | here |
|---|---|
| opener: the relay start, the stagger, Think and Reflect (200 m track) | p001 |
| 6.1 Perimeter of a Shape (Figs 6.2–6.5, Think and Reflect) | 6.1 |
| 6.2 The C/D ratio; Home Measurement; *C/D's adventurous journey* (Figs 6.6, 6.7); William Jones box | 6.2, with the history under an `h3` and the box as a `.c-tip` |
| 6.3 π Is Irrational; Fun Fact | 6.3, the Fun Fact as a `.c-tip` |
| 6.4 Length of an Arc (Figs 6.8–6.10); A Closer Look at a 400 m Track (Fig. 6.11, Think and Reflect) | 6.4, the track working as stepped `.work` rows |
| 6.5 Problems, Puzzles and Paradoxes: Examples 1–2 (Figs 6.12, 6.13); Exercise Set 6.1 (Q1–8, Figs 6.14, 6.15) | 6.5 |
| 6.6 Area of a Rectangle (Fig. 6.16) | 6.6 |
| 6.7 Area of a Parallelogram (Figs 6.17–6.19, two Think and Reflects) | 6.7 |
| 6.8 Area of a Triangle (Figs 6.20A/B, 6.21A/B); median theorem (Fig. 6.22); three Think and Reflects | 6.8 |
| 6.8.1 Heron's formula: Examples 3–5 (Figs 6.23–6.25); circumcircle and incircle formulas (Fig. 6.26) | 6.8.1 |
| Brahmagupta's formula (Figs 6.27, 6.28): Examples 6–7 (Fig. 6.29); *Special Cases and Generalisation* box; *Brahmagupta generalises Heron* | three `h3` subsections |
| 6.9 Squaring a Rectangle (Fig. 6.30); *Why does this method work?*; Think and Reflect; Exercise Set 6.2 (Q1–11, Figs 6.31–6.34) | 6.9 |
| 6.10 Area of a Circle: Think and Reflect, P²:A, Babylonian and Egyptian rules, the familiar formula (Figs 6.36, 6.37) | 6.10 |
| 6.10.1 Area of a Sector (Figs 6.38–6.40); segment; Exercise Set 6.3 (Q1–10, Q7–10 starred) | 6.10.1 |
| End-of-Chapter Exercises Q1–27 (Figs 6.41–6.55; Q10, 16, 19–27 starred) | End-of-Chapter Exercises |
| Chapter Summary | p034, a `.c-keyidea` list as Chapter 5 sets it; `data-close` |

**Seven worked examples, all stepped** — *Solution*, Step rows, *Answer*,
the reason in `.work__why`, never a `.chip`. Examples 3–7 are NCERT's
verifications (Heron and Brahmagupta on shapes whose area is known); each
is set as the formula, then the check, then *Answer: both ways give …*.
Key ideas state every rule used: π, circumference, arc length, area of a
rectangle, parallelogram and triangle, the median theorem, Heron's formula,
Brahmagupta's formula, area of a circle, area of a sector. Terms glossed
with `.term` where they first appear: perimeter, circumference, C/D ratio,
irrational, rational number, subtend, infinite series, calculus, stagger,
area, unit, parallelogram, median, Heron's formula, semi-perimeter,
circumcircle, incircle, rhombus, cyclic, special case, generalisation,
square (a shape), segment, minor/major segment, minor/major sector,
quadrilateral.

**Every figure is redrawn as inline SVG in the `.dg-*` vocabulary**: 59
figure numbers, including one new one in Beyond (Fig. 6.56). Figures a question names
print with the question: each such question and its figure are one
`.c-figure-context`.

**Beyond the Book: the four stages of Chapter 5, in its form.**

| stage | what |
|---|---|
| 1 Using What You Know | five `.c-try` questions, each explained in running text: the wire bent from a square into a circle (why the circle encloses more, through P²:A); a sector's area from its perimeter without its angle; the shortest altitude from Heron; a 4-gon with a diagonal whose halves are right-angled (area both ways, and the Brahmagupta check; Fig. 6.56); the cut that halves a disc's area. All new |
| 2 Solved Examples | 15, in the order 6 single correct, 4 multiple correct, 3 numerical answer, 2 matching, built by `stage2-bank.mjs` with `panel()` and `matching()` from `build/jee-tools.mjs`, under `build/jee-class9.mjs`'s conventions |
| 3 Practice | one numbered run of 31: 15 multiple choice, 4 assertion–reason (the Class 7 form: the choices once in a `.c-practice__note`), 3 very short, 4 short, 3 long, 2 case-based. Key letters: a 5, b 4, c 5, d 5 across Q1–19 |
| 4 Answers | a fresh page (p112): the letter key and the working for Q20–31 |

`build/jee-class9.mjs` and `build/check-jee-class9.mjs` were **not** edited:
the bank lives in `stage2-bank.mjs` beside the pages (`node stage2-bank.mjs
--write` puts it between the Stage 2 head and the practice band) and is
checked by `check-numbers.mjs` part C. The pages were compared with the bank
after the last write: the fifteen blocks are identical.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) 440 m |
| 2 | Single correct | (b) $60^\circ$ |
| 3 | Single correct | (c) 308 cm |
| 4 | Single correct | (d) 12 cm² |
| 5 | Single correct | (a) 21% |
| 6 | Single correct | (b) $4\pi$ cm |
| 7 | Multiple correct | (a), (b), (d) |
| 8 | Multiple correct | (a), (c) |
| 9 | Multiple correct | (a), (b), (c) |
| 10 | Multiple correct | (a), (c), (d) |
| 11 | Numerical answer | 56 |
| 12 | Numerical answer | 36 |
| 13 | Numerical answer | 28 |
| 14 | Matching | (b) P–2, Q–4, R–3, S–1 |
| 15 | Matching | (c) P–3, Q–4, R–1, S–2 |

**Nothing in Beyond repeats the body.** `build/check-no-repeats.mjs` finds
three pairs at 50–53%, all judged by hand and all different questions:
Example 11 (minor *segment*, radius 14, right angle) against Exercise Set 6.3
Q4 (minor and major *sectors*, radius 10); Practice Q28 (segment of
$120^\circ$, radius 12) against Exercise Set 6.3 Q5 ($60^\circ$, radius 15);
Practice Q3 (sector of $40^\circ$, radius 21) against Exercise Set 6.3 Q1.
Every value Beyond prints was read against the body's answers for give-aways
(PLAN §7): none states a body answer. No circle in Beyond of radius 7 or
10.5 has its length or area worked, because a circle of radius 7 has circumference 44 (Exercise Set
6.1 Q1) and area 154 (the step to Exercise Set 6.3 Q1–3), and one of radius
10.5 has circumference 66 (End Q8).

**`ANSWERS.md`** answers every question the chapter sets: every Think and
Reflect, the Home Measurement and the figure questions of Figs 6.6, 6.7 and
6.20B, Exercise Sets 6.1–6.3, the End-of-Chapter Exercises, and Beyond's
three stages. *Answers will vary* items (the 200 m track, Home Measurement,
the equal-area dissections, why circles, End Q1, Q20) carry a worked
instance or what a drawing must show.

### Verified

- **Builder**: 46 pages, no overflow, no design violation. p011 runs 2.4 mm
  into the bottom margin (under the 3 mm bar).
- **`check-numbers.mjs`**: 548 claims hold, nothing failed. It evaluates
  156 identities and 70 approximations on every page and in `ANSWERS.md`
  (a rounded side compared at the places it prints; $\pi$ evaluated), tries
  the symbolic examples on numbers, re-derives the history of $\pi$ (the
  bounds, $3.14159265359$, the brute-force claim that no fraction with
  denominator under 15 000 is closer than $\frac{355}{113}$, the mnemonic),
  reads every exercise answer back off `ANSWERS.md`, measures 32 figures from
  their coordinates (Fig. 6.27's three areas 9, 8.01, 5.41 by the shoelace
  formula; Fig. 6.49's two regions by counting cells; Fig. 6.30's
  construction; Fig. 6.34's half-area; the tangencies of Fig. 6.26), recomputes
  every option of the fifteen solved examples and the fifteen practice
  multiple-choice questions (exactly the keyed options are right), works the
  four assertion–reason items, and checks that `ANSWERS.md` prints the same
  keys.
- **`orphans`**: 0 stranded openers. **`fit-options`**: every option row
  fits. **`check-labels`**: no labels collide. **`check-maths-captions`**:
  no figure caption out of place (it runs over every class).
- **§4.8 greps**: `c-stage__for` 0, `c-case__label` 0, `c-practice__num` 1,
  `data-bridge` on all twelve p1xx, `data-close` on p034, no `--head` or
  `--tail`; 7 body examples, 7 stepped.
- **`check-example-stepping.mjs` and `check-body-maths.mjs`** do not apply:
  both compare the chapter against its version at `HEAD`, and a new chapter
  has none (each reports *0 at HEAD, 7 now*).
- Every page read in its 2x proof.

### Decisions, and departures from the NCERT page

- **Fig. 6.1** is a photograph in NCERT. It is drawn here as a plan of a
  bend with four lanes and staggered start marks.
- **Fig. 6.11** keeps the straights and the inner radius to scale
  ($84.39 : 36.5$, checked); the eight lanes are drawn wider than to scale,
  and the caption says so.
- **Colour words are gone from questions**, since a palette recolours
  figures and a greyscale print loses them: Fig. 6.8's red and blue
  semicircles are *upper* and *lower*; Exercise Set 6.2 Q10's red and green
  regions are the *shaded* and *unshaded* regions, named by their triangles;
  End Q20's blue and red triangles are $\triangle ABP$ and $\triangle AQC$
  (vertices lettered for the purpose); End Q22's blue flower and Q23's green
  ring are *shaded*.
- **End Q16 and Q17** are captions only in NCERT; question text was written
  for them, stating what the equal-length marks mean.
- **Exercise Set 6.1 Q5 (v)**: NCERT's *14 cm* sits inside a grid cell with
  no dimension line. It is drawn as the side of one of the nine equal squares,
  which gives the whole-number answer 176 cm.
- **Exercise Set 6.3 Q10** says *a hexagon*; the ratio holds only for a
  regular one, and it now says so.
- **NCERT Example 7** prints $s - 2b = c + a - 2b$; it is $c + a - b$ (the
  next line of NCERT uses the right value). Corrected.
- **Rounding**: NCERT prints $\frac{22}{7} \approx 3.1428$ and
  $\sqrt{10} \approx 3.1622$ (truncated); here $3.1429$ and $3.1623$.
  The mnemonic gives $\pi = 3.141592\ldots$, not $\pi \approx 3.141592$
  (which would round to $\ldots593$).
- **The P²:A ratio** of an equilateral triangle is $36 : \sqrt{3}$.
- **Home Measurement** is a `.c-reflect` titled *Home Measurement*: Class 9
  bodies have no activity component, and the box asks the reader questions.
- **The pair figures were merged.** `.c-figure--pair` was used for 6.2A/B,
  6.15A/B, 6.21A/B, 6.32/6.33, 6.39/6.40, 6.43/6.44, 6.45/6.46 and
  6.52/6.53, and each proof showed the two halves with labels at different
  sizes. The builder stamps the label scale on the first `<svg>` after a
  `c-figure--*` class only, and with the pair's width: the first drawing's
  labels print at about half size and the second's unscaled. Each pair is now
  one drawing with one caption carrying both figure numbers, *(left)* and
  *(right)*. Class 10 Chapter 11 uses the pair and will have the same fault.
- **Labels are never inside a translated group** (Fig. 6.14's nine panels,
  the merged pairs, Fig. 6.37): `check-labels` reads `x` and `y` as written,
  so the text sits at absolute coordinates beside the group.
- **Dropped**: NCERT's aside that two planets colliding *actually happened in
  the early history of the solar system* — a science claim with no source,
  in a sentence about Heron's formula. The joke about planets stays.

### Fitting

`refit … body` and `refit … bridge` were each run after content changes,
with the pages backed up before each run; the last runs are the ones above.
`flow.mjs` could not be used: it assumes the chapter's files are numbered
without a gap and fails on reaching p035 (Beyond starts at p101). Pages
under 88%, each held by a block that cannot move:

| page | fill | held by |
|---|---|---|
| p004 | 85% | a paragraph (flow unavailable) |
| p005 | 81% | the 6.3 heading, which needs five lines under it |
| p015 | 84% | a Think and Reflect panel |
| p022 | 77% | the *Why does this method work?* head and its stepped working |
| p024 | 86% | the 6.10 heading |
| p025 | 84% | the *familiar formula* head |
| p030, p031, p032 | 74–85% | End-of-Chapter questions, each kept with its figure |
| p034 | 75% | the chapter's last page (`data-close`) |
| p104, p106 | 82%, 80% | a solved example (a panel) |
| p107 | 74% | Example 14, a 112 mm matching panel |
| p110 | 80% | case-based Q30, one 86 mm question |
| p111 | 72% | the Answers stage, which always opens a page |
| p112 | 78% | the last page |

### Flagged, for the user

| where | what | what it needs |
|---|---|---|
| End Q19 | With area $72$ cm² the small rectangle is $\sqrt{10}$ by $\frac{4}{5}\sqrt{10}$ cm and the perimeter is $\frac{18}{5}\sqrt{10} \approx 11.38$ cm — irrational, in a question that reads as though it expects a whole number. $720$ cm² would give $10 \times 8$ and $36$ cm. NCERT's number is kept and answered | a decision: keep 72, or print 720 |
| End Q26 | As NCERT prints it, the claim is true only if triangle $C$ has one side upright and one level, as the figure shows; the text does not say so, and for a general point it is false. The condition is now stated in the question | confirm |
| Fig. numbering | NCERT has no Fig. 6.35 (6.34 is followed by 6.36). NCERT's numbers are kept, so the chapter has a gap; Beyond's figure continues at 6.56 | a decision, if the book's rule (one sequence, no gaps) should win |
| Exercise Set 6.1 Q5 | The instruction mentions arcs that are *three-quarters of a circle*; none of the nine shapes has one | kept as NCERT wrote it |
| builder | the label-scale stamp covers only the first drawing of a `c-figure--pair` (above) | a fix in `build/build.mjs`, `stampFigureScale` |
| tools | `flow.mjs` stops on a chapter whose Beyond starts at p101 | a fix in `build/flow.mjs` |

**Historical and factual claims.** All come from NCERT's pages 120–124,
136–137 and 144–146; that is the source recorded for each. The ones below
were also checked here, or are flagged because they were not:

| claim | status |
|---|---|
| Mesopotamia, c. 1900 BCE, $\pi = 3\frac{1}{8}$ from the inscribed hexagon | NCERT; the value checked |
| Archimedes, c. 250 BCE: hexagons give $3 \lt \pi \lt 2\sqrt{3}$; 96 sides give $3\frac{10}{71} \lt \pi \lt 3\frac{1}{7}$ | NCERT; both bounds checked numerically, 96 = 6 × 2⁴ |
| Ptolemy, c. 150 CE, $\frac{377}{120} \approx 3.14167$ | NCERT; value checked |
| Liu Hui 263 CE; Zu Chongzhi *480 CE*, 24 576 sides, $\frac{22}{7}$ and $\frac{355}{113}$ | NCERT; values checked, 24 576 = 6 × 2¹². **Flag**: Zu lived c. 429–500 CE; *480 CE* is NCERT's date and is kept |
| $\frac{355}{113}$ the most accurate value anywhere for over 800 years | NCERT. **Flag**: not checked here |
| no fraction with denominator under 15 000 is as close to $\pi$ as $\frac{355}{113}$ | checked by brute force in `check-numbers.mjs` |
| Āryabhaṭa, 499 CE, $\frac{62832}{20000}$, called *āsanna* | NCERT; value checked |
| Brahmagupta, 628 CE, $\sqrt{10}$; its later use in the Arab world and medieval Europe | NCERT. **Flag**: the second half not checked here |
| Mādhava's series; $\pi$ to 11 places, 3.14159265359 | NCERT; the series and the digits checked |
| Nīlakaṇṭha (c. 1500), Machin (1706), Ramanujan (1914), Chudnovsky (1988); *hundreds of trillions of digits* | NCERT. **Flag**: dates and the digit count not checked here |
| William Jones, 1706; Euler made $\pi$ popular | NCERT |
| Lambert, 1761, $\pi$ irrational; Āryabhaṭa and Zu *seem to have regarded* it so | NCERT |
| Pi Day 14 March; Pi Approximation Day 22 July | NCERT |
| Babylonians, before 1500 BCE, $A \approx \frac{C^2}{12}$; Egyptians, c. 1500 BCE, $A \approx \left(\frac{8d}{9}\right)^2$ | NCERT; the algebra to $\frac{256}{81}r^2$ checked |
| **the same formula appears in the Baudhāyana Śulbasūtra** | NCERT. **Flag**: the circle-squaring rule usually quoted from Baudhāyana gives the square's side as about $\frac{13}{15}$ of the diameter, not $\frac{8}{9}$; this needs a source before press |
| Nīlakaṇṭha Somayājī *first* gave the slice rearrangement, in his *Āryabhaṭīya* commentary | NCERT. **Flag**: *first* not checked here |
| Heron taught at the Museum in Alexandria | NCERT |
| Brahmagupta 598–668 CE; his formula in 628 CE | NCERT |
| Baudhāyana's *Śulbasūtra*, 800 BCE, squaring a rectangle | NCERT |
| Any two polygons of equal area can be cut into each other (ANSWERS.md) | the Wallace–Bolyai–Gerwien theorem; a standard result, named in the answers booklet only |

## 24 September 2026 — page 11 refit

Page 11 ran 2.4mm into the bottom margin once the chapter was rebuilt beside the rest of the volume. It holds Exercise Set questions 5–7, two of them with their figures, so nothing could move without parting a question from its figure. Fig. 6.15 (the flowers) was stepped from `c-figure--xl` to `c-figure--lg`; the page now fits and `check-labels` reports no collisions.
