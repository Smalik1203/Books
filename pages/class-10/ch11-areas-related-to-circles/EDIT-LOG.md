# Class 10 · Mathematics I · Chapter 11 — Areas Related to Circles

## Brought to the Class 7 standard, 17 September 2026

Phase 4 of `PLAN-MATHS-CONSISTENCY.md`, worked by one agent from the Class 10
brief, with Chapter 1 as the model. Page move, examples, Beyond the Book and
answers were done in one pass, and every check was run on the whole chapter.

**Pages: 15 before (8 body + 7 Beyond, Crown Quarto), 19 after (7 body + 12
Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`. The body was
refitted once, then placed by hand (below). `p008.html` is gone; `p007` is the
last body page and carries `data-close`.

**Both body examples set as steps** (the Class 10 decision of 17 September
2026). The working that ran in prose and `.work--list` lines after each
question-only panel is now inside it as *Solution*, Steps and *Answer*.
- **Example 1**: the sector, the major sector by subtraction, and the direct
  $330^\circ$ check are Steps 1–4. Fig. 11.5 sits inside the panel, after the
  rows.
- **Example 2**: ten steps and an Answer. The equation labels (1), (2) and (3)
  stay as the reasons of the steps they label, and Step 10 says *from (1), (2)
  and (3)*. The congruence (RHS) and the mid-point are steps with reasons.
- **Verified** by `build/check-body-maths.mjs`: 79 expressions and 74 numbers
  compared, nothing lost or added (8 body pages at HEAD, 7 now). The only gains
  are 4.19 and 46.05 restated in Example 1's Answer row.

**Placed by hand, not by the refit.** The refit left page 3 at 44%: Example 1
with its figure (149 mm) missed the gap by 20 mm, and would have gone overleaf.
- Page 3: Example 1's rows were made one line each, and the running-text
  sentence *Let us look at some examples.* was cut at the join (one rendered
  line, no mathematics). The page runs 1.3 mm into the margin.
- Page 4: Figs. 11.6 and 11.7 are set side by side just before Example 2, in
  a `.c-figure--pair` grid (two `<figure>` children; the modifier was added to `css/components.css` by the coordinator, sharing `.c-figure--keyed`'s rules), so the whole
  panel fits under them. Fig. 11.6 now prints a little larger than `--sm`.
  **Coordinator: check this use of `--keyed`**; stacked, the two figures and
  the panel did not fit one page.
- Pages 5–7: the exercise blocks were pulled back with `unsettle`. Q8 and
  Fig. 11.8 share page 5; Q9–Q13 and Figs. 11.9–11.10 share page 6; Q13's
  Fig. 11.11 is on page 7, which faces page 6.

**Beyond the Book rebuilt to the four stages:**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, each explained in running text | **kept word for word**; only `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | 5 `.c-problem` / `.c-solution` | **12 stepped examples** under five `Type` heads; old Problems 1, 5, 2 and 4 are Examples 2, 3, 6 and 9, options kept; old Problem 3 is Example 4 with new numbers (below) |
| 3 Problem Sets → **Practice** | 3 sets, 19 questions | **one run of 31** in six forms |
| 4 Answers & Takeaways → **Answers** | key and 11 trace rows | key, every other answer, why the options are wrong for 11, the closing paragraph kept |

**Worked examples in the chapter: 14** (2 body + 12 Beyond). Types: area of a
sector and length of an arc; working back from an arc or an area (radius,
angle); area of a segment (60°, 90°, and a *show that* for the 60° segment);
sectors in everyday problems (grazing, a flower bed with costs in ₹); segments
in objects and figures (a trimmed mirror, a semicircle less its triangle).
See the follow-up below.

**Practice:** 15 multiple choice, 4 assertion–reason, 3 very short, 4 short,
3 long (two with a *show that*), 2 case-based with tables. Key letters:
a 4, b 5, c 5, d 5. Reused from the old sets: A3, A4, A5, A7, B2, B4 (new
numbers), B5, B6, C2, C4, C5; A2, A6, A8 and B1 were given new numbers.

### Give-aways found and fixed

- **Old Problem 3** (a sector of radius 21 cm with an arc of 22 cm has area
  231 cm², with *the angle, 60°* in its option note) printed both answers of
  Exercise Set 11.1 Q5 (i) and (ii). It is now radius 35 cm, arc 22 cm, area
  385 cm² (Example 4), and the note no longer names an angle.
- **Old Set A Q6** (a 21 cm minute hand in 10 minutes sweeps 231 cm²) is the
  same sector as Q5 (ii). Now a 7 cm hand in 15 minutes (Practice Q5).
- **Old Set A Q1** repeated Exercise Set 11.1 Q14 (the sector-area formula as
  four options). Dropped.
- **Old Set A Q2** (radius 14 cm, 45°, arc 11 cm) repeated Stage 1's first
  question. Now radius 28 cm (Practice Q1).
- **Avoided while writing:** a radius-28 cm, 60° question (it is one design of
  Q13), and printing the circle area 2464 cm² as an option (Q13's first step).
- **Stage 1's third question** (the minor segment for a right angle is
  $\frac{1}{11}$ of the circle) shows the method of Q4 (i) but not its answer:
  it uses $\pi = \frac{22}{7}$ and no radius, where Q4 uses 3.14 and 10 cm.
  Kept word for word.
- `check-no-repeats` reports 6 pairs at 50% or more. Each is a segment or arc
  question of the same kind as the body's, with different numbers. None
  prints a body answer.

### Wrong numbers found

- **Exercise Set 11.1 Q5 (iii)**: the old log's *about 40.05 cm²* is 40.04 with
  $\sqrt{3}$ to its full value ($231 - 190.959 = 40.041$); 40.05 needs
  $\sqrt{3} = 1.732$. `ANSWERS.md` says 40.04 and keeps the surd form as the
  answer. Nothing printed in the book changes.
- The old Beyond answer line at the foot of *Every answer worked* below
  describes the old stages and is superseded by `ANSWERS.md`.

### Verified

`check-numbers.mjs` passes **371 claims**: 174 printed identities, 7 identities
in $r$ and $\theta$ checked at two sample points, and the rest below.
- Part A takes $\pi$ as $\frac{22}{7}$, 3.14 or exact, and $\sqrt{3}$ as 1.73,
  1.7 or exact, whichever the question names. A bare decimal side is allowed
  only its own rounding. A row that carries one equation across several spans
  (`$= a$ cm² $= b$`) is joined into one chain first.
- Part B computes every Exercise Set 11.1 answer and finds it in `ANSWERS.md`,
  item by item and part by part. It does the same for every example's Answer
  row, Stage 1's values, and the key rows 20–31, a lettered part at a time.
  The radius in Q23 is checked as a phrase. It also checks that the two
  quadrants of Example 11 really cover the square.
- Part C: each of the 15 multiple-choice questions and the 5 multiple-choice
  examples has exactly one right option, and it matches the key. The 4
  assertion–reason letters are derived.
- Part D: the `ANSWERS.md` key matches the page, and its practice rows agree
  with the page's.

**Break tests: 17 of 17 caught**, run on a copy in the scratch folder. They
covered body values, a body Answer, a Beyond example Answer phrase, a ₹ amount,
a Stage 1 value, a key letter, key rows, a lettered key part, an option, an
assertion, an example option, and `ANSWERS.md` values, a lettered part and the
key. The first run missed two, both body values printed as a continued span
(`$= 4.19$`, `$= 462$`). Joining such runs into chains fixed it. The check's own
first-run faults are fixed too: floats compared as printed strings, `^\circ`
and `\pi` in option text, and a superscript 2 read as a number.

**Fitting:** nothing is clipped. Page 3 runs 1.3 mm into the bottom margin, and
page 16 runs 1.1 mm. `orphans` finds 0, `fit-options` finds every row fits, and
`check-labels` finds no collisions. I read the proofs of pages 3–7 and 8–19.

**Colour:** pages 1–7 were rendered in greyscale and in the colour-vision
simulations. Each shaded region is bounded by drawn lines and named in the
text, so the tint does not carry the meaning alone.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 7 | 51% | the last body page (`data-close`) |
| 11 | 72% | Example 8, a panel too tall for the gap |
| 12 | 77% | Example 10, a panel |
| 13 | 70% | Example 12, a panel |
| 16 | 80% | case-based Q30 with its table |
| 17 | 63% | **the Answers stage, which always opens a page** |
| 18 | 86% | a trace group |
| 19 | 64% | the last page |

### Follow-up, 17 September 2026: out-of-syllabus items replaced

NCERT dropped *Areas of Combinations of Plane Figures* from the Class 10
syllabus in 2023, and this chapter's body is 11.1 only. The coordinator asked
for the same fix the user approved for Chapter 12. Three Beyond items that
cut pieces from a square or triangle, or overlapped regions, were replaced
like for like with items on sectors, arcs and segments only.

| was | now |
|---|---|
| Stage 1, fifth question: a square of side 14 cm with a quadrant at each corner (42 cm²) | Chords subtending $60^\circ$ and $120^\circ$: is the larger minor segment twice the smaller? It is tried first and explained in running text. The two triangles are equal ($\frac{\sqrt{3}}{4}r^2$), so the larger segment is **more than** twice the smaller. This overrides the word-for-word rule, on the coordinator's instruction |
| Example 11: the leaf inside two quadrants of a square (112 cm²) | A round mirror of radius 35 cm trimmed along a chord at a right angle: 350 cm² trimmed away, 3500 cm² left, stepped |
| Practice Q12: an equilateral triangle with three sectors cut off (7.77 cm², key (d)) | A 10 cm chord in a circle of radius 10 cm, so the angle is $60^\circ$ and the minor segment is $52.33 - 43.25 = 9.08$ cm² (π 3.14, √3 1.73). The key stays (d); the other options are the sector, the triangle and their sum |

- **Type 5** is now *Segments in objects and figures* (Examples 11 and 12).
  Examples stay numbered 1–12.
- **The closing paragraph's** third point was about adding the angles of
  pieces. It now says a segment is a sector less a triangle, and that the two
  parts should be worked out separately.
- **Updated to match:** the key's why row 12, `ANSWERS.md` (Stage 1 and
  Practice 12), and `check-numbers.mjs`. The checker now derives Q12's angle
  from the chord. It checks at three radii that the two triangles are equal
  and that the larger segment is more than twice the smaller. It also checks
  `ANSWERS.md`'s Stage 1 summary, which it did not check before.
- **Nothing new repeats or answers the body.** Q12's radius of 10 cm with
  π = 3.14 matches Exercise Set 11.1 Q4, but Q12 uses $60^\circ$, not
  $90^\circ$. The mirror uses π = 22/7 at $90^\circ$, which no body question
  uses. `check-no-repeats` reports the same 6 same-kind pairs as before, and
  none involves a new item.
- **Fitting:** the longer Stage 1 explanation pushed page 9 6.3 mm into the
  margin. The question was shortened to one line and two clauses were
  trimmed, which brought it to 1.6 mm. No refit was needed.
- **Gates re-run:** the build (19 pages, nothing clipped); `orphans` 0;
  `fit-options` and `check-labels` clean; `check-body-maths` reports nothing
  lost or added; `check-numbers` holds **378 claims** (176 identities, 9 in
  $r$ and $\theta$).
- **Break tests: 27 of 27 caught.** Ten of them target the new values. The
  first run missed the `ANSWERS.md` Stage 1 wording, which is now checked.
- **Grep of Beyond** for *square, rectangle, quadrants, cut off, inside both*:
  - legitimate: *radius squared*, *square metre*, and *cut off by CD* (a
    segment);
  - **still there: two ring pieces.** Stage 1's fourth question (a
    $60^\circ$ piece of the ring between radii 7 and 14 cm) and Practice Q29
    (a $90^\circ$ piece between radii 21 and 14 cm). Each is a difference of
    two sectors with one centre. They are not on the coordinator's list and
    were left alone. **Coordinator: decide whether a ring piece counts as a
    combination of figures.**

### Flagged, not done

- The flags below (Q13's designs defined by a picture, Q5 with no value for
  $\sqrt{3}$, Q3's minute hand) still stand.
- Stage 1 keeps its *Notice that* (C8), as the rule for Stage 1 requires.
- KaTeX breaking before *.)* after an inline fraction happened once
  (Practice Q13), and was fixed by rewording. This is the class-wide
  stylesheet issue.

---

Written new from NCERT *Mathematics, Textbook for Class X* (reprint 2026-27),
Chapter 11, *Areas Related to Circles* (textbook pages 154–160). Original
LearnLab text in NCERT's order of topics, examples and questions; no sentence
is carried over. Crown Quarto, house design, palette `emerald`. The source PDF
has no answer key; every answer below was worked here.

Sections: 11.1 Areas of Sector and Segment of a Circle. *Exercise 11.1* is
Exercise Set 11.1. The area of a sector and the length of an arc are
`c-keyidea` blocks; the unitary-method derivation and the working of both
examples are `.work--list` rows. The source's *11.2 Summary* is the chapter
summary.

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted: `check-body-maths` reports no mathematics lost or added, `check-numbers.mjs` passes, 0 stranded openers, every option row fits, no label collisions. One coordinator edit: Figs 11.6 and 11.7 were set side by side in `.c-figure--keyed`, which is for a figure beside its key. `css/components.css` gains `.c-figure--pair`, sharing the same rules, and p004 uses it. The fill is unchanged.

## Figures

All 11 come from `fig11.mjs` in the session scratchpad (unfilled copy
`c11-src`) and are drawn from the source's pictures, not traced.

| figure | note |
|---|---|
| Figs. 11.1, 11.2 | the words *Major Sector*, *Minor Sector*, *Major Segment* and *Minor Segment* written inside the source's figures are left to the caption and the text |
| Fig. 11.5 | the $30^\circ$ is set beside the narrow sector, not inside it |
| Fig. 11.8 | the horse and the grass are not drawn; the square field, the peg, the rope and the quarter circle it reaches are |
| Figs. 11.9–11.11 | the brooch, the umbrella (seen from above only) and the table cover are outlines; in Fig. 11.11 the six designs are shaded as the segments outside a regular hexagon |

## Every answer worked

| where | answers |
|---|---|
| Examples 1 and 2 | 4.19 cm² and 46.05 cm² (46.1 cm²); ${\frac{21}{4}(88 - 21\sqrt{3})}$ cm², with ${AB = 21\sqrt{3}}$ cm and ${OM = \frac{21}{2}}$ cm. The source's values are all correct |
| Set 11.1 Q1–Q5 | 1 ${\frac{132}{7} = 18\frac{6}{7}}$ cm² · 2 radius 3.5 cm, quadrant ${\frac{77}{8} = 9.625}$ cm² · 3 ${\frac{154}{3} = 51\frac{1}{3}}$ cm² ($30^\circ$ in 5 minutes) · 4 (i) ${78.5 - 50 = 28.5}$ cm² (ii) 235.5 cm² · 5 (i) 22 cm (ii) 231 cm² (iii) ${\left(231 - \frac{441\sqrt{3}}{4}\right)}$ cm², about 40.05 cm² |
| Set 11.1 Q6–Q10 | 6 minor ${117.75 - 97.3125 = 20.4375}$ cm², major ${706.5 - 20.4375 = 686.0625}$ cm² · 7 ${150.72 - 36\sqrt{3} = 150.72 - 62.28 = 88.44}$ cm² · 8 (i) 19.625 m² (ii) ${78.5 - 19.625 = 58.875}$ m² · 9 (i) ${110 + 5 \times 35 = 285}$ mm (ii) 96.25 mm² · 10 ${\frac{22275}{28}}$ cm², about 795.54 cm² |
| Set 11.1 Q11–Q14 | 11 ${\frac{158125}{126}}$ cm², about 1254.96 cm² · 12 about 189.97 km² · 13 the designs are ${2464 - 1176\sqrt{3} = 2464 - 1999.2 = 464.8}$ cm², costing ₹162.68 · 14 (d) |

Beyond the Book: Stage 1 — $45^\circ$ and 11 cm; the area doubles and the arc is unchanged; $\frac{1}{11}$; 77 cm²; 42 cm². Stage 2 — (b), (a), (b), (b), (c).
Set A c b c d b a b c; Set B a b b c a d; Set C b c d b d.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| "For obvious reasons, OAPB is called the minor sector" (twice) | the reason given: it is the smaller of the two | C1: "obvious reasons" stands in for the reason |
| the derivation of the sector formula in three prose lines, and the formulas in bold | the derivation as working rows; the two formulas as key ideas; a tip that sector and arc take the same fraction of the circle | structure |
| Example 2's working for OM and AM run together in columns | three rows, with (1), (2) and (3) kept | layout |
| Exercise 11.1: "Unless stated otherwise, use π = 22/7" above the questions | the first sentence of Question 1 | the book has no text between a band and its first question |
| Q13: "six equal designs as shown in Fig. 11.11" | adds that the designs are the six segments between the edge and a regular hexagon | C4: the question cannot be answered from the words alone; the source relies on its picture |
| Q13: "₹ 0.35 per cm²" | ₹0.35 per cm², outside maths | the book's style |
| Q14 options (A)–(D); "Tick the correct answer" | (a)–(d); "Choose the correct answer" | the book's style |
| summary points as formulas set on their own lines | in sentences | layout |
| Example 1: "Give both answers correct to two decimal places."; "(approx.)" as "about" | added | fitting and one wrapped word |
| Beyond the Book, stage 1: the second explanation rewritten with factors instead of long inline expressions; Set C Q1: "Each circle touches the two circles next to it." | changed, added | legibility (justified lines opened wide around the long maths) and fitting |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| Set 11.1 Q13 | C4 | the designs are defined only by the picture | the words now in the question, or a labelled figure |
| Set 11.1 Q5 (iii), Q7 | — | Q5 uses ${\pi = \frac{22}{7}}$ with no value for $\sqrt{3}$, so its answer stays in surd form, while Q6 and Q7 give $\sqrt{3} = 1.73$ | a value for $\sqrt{3}$ in Q5, or accept the surd |
| Set 11.1 Q3 | M2 | the minute hand turning $6^\circ$ a minute is assumed, not stated | "the minute hand turns $360^\circ$ in 60 minutes" |
| Summary | — | the source's summary has no point for the major sector or the major segment, which the chapter defines and uses | none |
