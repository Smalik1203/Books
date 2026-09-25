# Class 7 · Mathematics II · Chapter 6 — Constructions and Tilings

## Solved examples in examination formats, 23 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 18 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-7/p2ch06-constructions/`.

Source `build/jee-class7.mjs`; check `build/check-jee-class7.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p110; the answers stage still opens a fresh page.

Fitting, same day. Body p009: “Remember the fact behind that method:” became “Recall why:”, and step 2 of the parallel-line construction was set as one sentence (“Draw an arc from A cutting m at C and l at D, and one of the same radius from B cutting l at F.”), to pull back the lines that ran 6.3mm into the margin.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) 7 cm |
| 2 | Single correct | (b) 75° |
| 3 | Single correct | (c) a regular hexagon, each angle 120° |
| 4 | Single correct | (d) the square in row 1, column 1 |
| 5 | Single correct | (b) 2 |
| 6 | Single correct | (d) 3 cm |
| 7 | Multiple correct | (a), (b), (d) |
| 8 | Multiple correct | (a), (b) |
| 9 | Multiple correct | (a), (d) |
| 10 | Multiple correct | (a), (b), (c) |
| 11 | Numerical answer | 4 |
| 12 | Numerical answer | 24 |
| 13 | Numerical answer | 22.5 |
| 14 | Matching | (b) P–3, Q–4, R–1, S–2 |
| 15 | Matching | (a) P–3, Q–4, R–2, S–1 |


## Syllabus audit fixes, 17 September 2026

Two findings, both gaps, both fixed with a new Solved Example. The examples
are set like the chapter's other construction examples: steps and a reason
or a `.chip` equality, and no figure, because none of Examples 1–8 has one.

1. **A line through a point parallel to a given line** (body p009,
   Fig. 6.15). **Example 9** was added at the end of Type 3 (*Bisecting and
   copying angles*), because the body builds the parallel by copying an
   angle. P is a point not on m. The steps are:
   - Draw any line l through P, crossing m at A. This is the transversal.
   - Draw an arc from A, cutting m at C and AP at D.
   - With the same radius, draw an arc from P, cutting l at F beyond P.
   - With radius CD, draw an arc from F, cutting the first arc at E on C's
     side of l.
   - Draw the line PE. It makes the same corresponding angle as m does, so
     it is parallel to m.

   The body's own setting chooses B on a transversal first. This example
   starts from a given point instead, so it does not repeat Exercise Set 6.5.
2. **The regular hexagon** (body p011–p013). **Example 12** was added at the
   end of Type 4 (*Angles around a point*). It constructs a regular hexagon
   whose corners lie on a circle of radius 3 cm. The radius is stepped round
   the circle, and each step makes an equilateral triangle with the centre,
   so each gives $60^\circ$. Since $6 \times 60^\circ = 360^\circ$, the sixth
   arc closes on A. Every side is 3 cm, and every angle is
   $60^\circ + 60^\circ = 120^\circ$. The audit's suggestion ("side 4 cm")
   was **not used**, because the body sets exactly that task on p012 (4 cm)
   and p013 (5 cm). The circle construction uses only the body's two facts:
   six equilateral triangles fill $360^\circ$, and each angle of the
   hexagon is two $60^\circ$ angles.

Examples 9–16 became **10–18**, renumbered in page order. The one reference
by number ("as in Example 4", in Example 5) was unaffected. Class 7 has no
`ANSWERS.md` or `check-numbers.mjs`, so the values were checked by hand:
$6 \times 60 = 360$ and $60 + 60 = 120$. `check-no-repeats`: no division
question is close to a body question.

Pages 30 → 32 (body 20, Beyond 10 → 12). The two examples take most of a
page. The fresh-page rule for Answers took the other. Before this edit,
Answers sat under Q26 on p109, and `refit bridge` moved it to the top of
p111. The refit left Q26 alone on p110, so Q25 (with its *Case-based
questions* sub-head) was moved by hand from p109 to p110. p109 is now 71%
full and p110 47%, and together they are the short run before Answers. The
last three *why the other options are wrong* rows take p112 (20%, the last
page). Beyond pages all fit. Body page 9 runs 1.3 mm into the margin; the
body source is unchanged (identical to the backup and not modified in git).
0 stranded openers, every option row fits, no labels collide, `data-bridge`
on p101–p112.

**Two give-aways fixed afterwards, at the coordinator's request.** Both were
answering body questions, so each got the smallest fix.

- **Example 11** used to construct $150^\circ$ by bisecting $60^\circ$, with
  the chip $\angle BOY = 30^\circ$. That answered the body's "How will you
  construct angles of $30^\circ$ and $15^\circ$?" (p014). It now builds
  $105^\circ$ as $60^\circ$ and $45^\circ$ side by side: an equilateral
  $\triangle OPA$ on OY, then the perpendicular to AO at O on X's side, then
  its bisector OB. So $\angle BOY = 60^\circ + 45^\circ = 105^\circ$, and no
  $30^\circ$ or $15^\circ$ angle is constructed or named. *(Changed again
  below: Stage 1 now reaches $105^\circ$ this same way, so Example 11 became
  $157.5^\circ$.)*
- **Practice Q24** began with the body's own task, "construct a regular
  hexagon with sides of 4 cm" (p012). The side is now **3.5 cm**. The answer
  now reads AC, CE, EA "about 6.1 cm each" ($3.5 \times 1.732 = 6.06$,
  where it had been 6.9 cm for 4 cm). The SAS reason now says 3.5 cm.

Pages unchanged at 32. All pages fit (p105 is 84%), 0 stranded openers,
every option row fits, no labels collide, and `check-no-repeats` is clean.

**The other four $30^\circ$/$15^\circ$ give-aways, also fixed at the
coordinator's request.** The standing rule is that Stage 1 is kept word for
word unless it gives away a body answer. Nothing left in the division now
constructs or names a $30^\circ$ or $15^\circ$ angle. The only $15^\circ$
still printed is the uncovered gap in Example 10, which is subtraction, not
a construction.

- **Stage 1, the angles try (p101).** The try is unchanged (75°, 105°,
  22.5°). Only its explanation changed, and its opening and closing
  sentences stay word for word:
  - It used to read "bisecting gives 30°, 15° and 45° … $75^\circ = 60^\circ + 15^\circ$
    and $105^\circ = 90^\circ + 15^\circ$".
  - It now reads "bisecting $90^\circ$ gives $45^\circ$ … $105^\circ = 60^\circ + 45^\circ$,
    and the angle beside it on a straight line is $180^\circ - 105^\circ = 75^\circ$".
- **Example 11, again.** Its 105° would now repeat Stage 1, so it builds
  **157.5°** instead:
  - the perpendicular OA ($\angle AOX = 90^\circ$);
  - the bisector OC of $\angle AOX$ ($\angle COY = 135^\circ$);
  - the bisector OB of $\angle COX$ ($\angle BOC = 22.5^\circ$);
  - so $\angle BOY = 135^\circ + 22.5^\circ = 157.5^\circ$.
- **Practice Q8 (MCQ).** The question is unchanged and the key stays (a)
  112.5°. Option (b) was 105°, whose explanation needed 15°; it is now
  157.5°. The *why the other options are wrong* row now reads "(b) adds both
  $45^\circ$ and $22.5^\circ$ to $90^\circ$", replacing "(b) uses 15°,
  which comes from bisecting 60° twice".
- **Practice Q20 (short answer).** "Construct an angle of 165° …" became
  **67.5°**. The answer now reads: construct $\angle AOY = 90^\circ$ and
  bisect it ($\angle COY = 45^\circ$); bisect $\angle AOC$
  ($\angle BOC = 22.5^\circ$); so $\angle BOY = 45^\circ + 22.5^\circ = 67.5^\circ$.
- **Practice Q22 (short answer).** The rangoli had 12 petals on 6 lines
  (30°); it now has **16 petals on 8 lines**. The answer is
  $360^\circ \div 16 = 22.5^\circ$: construct $90^\circ$, bisect it, and
  bisect one half. Eight petals were not used, because they would echo the
  body's eight-pointed star (Fig. 6.16, $45^\circ$).

Checked by hand:
- $90 + 45 = 135$ and $135 + 22.5 = 157.5$;
- $45 + 22.5 = 67.5$;
- $360 \div 16 = 22.5$;
- $180 - 105 = 75$;
- $90 + 45 + 22.5 = 157.5$, which is the slip option (b) describes.

Pages unchanged at 32. All pages fit (p101 unchanged; p112, the last page,
is 18%). There are 0 stranded openers, every option row fits, no labels
collide, and `check-no-repeats` is clean. I looked at the proofs of p101,
p105 and p111.

## Beyond the Book, rebuilt 15 September 2026

Rebuilt to DESIGN-MATHS §6a, *The shape since 15 September 2026*, on the model
of Class 7 Chapter 1 and Chapter 7. Only `p101`+ changed; no `p0xx.html` was
touched. The §5 body rebuild of the same day was **reverted at the user's
request**; its pages are backed up in the session scratchpad
(`backup-class7-s5-rebuild/`, and `rebuilt/pages/class-7/p2ch06-constructions/`,
which this rebuild drew on). The eight Beyond pages it replaces are kept in
`beyond-p2ch06-constructions/backup-p1xx/`. The paragraph near the foot of this
log beginning *Beyond the Book: Stage 1* describes those old pages and is
superseded by this section.

Pages: 8 (p101–p108) → 10 (p101–p110). Builder fill, pages 21–30:
92 · 93 · 93 · 98 · 97 · 98 · 95 · 95 · 101 · 39 (last page). Page 29 runs
1.6 mm into the bottom margin; no `!` overflow.

**Stage 1 · Using What You Know** — word for word; only its `.c-stage__for`
line was deleted (checked paragraph by paragraph against the backup).

**Stage 2 · Solved Examples** — 16 examples, stepped (Solution, Step N with a
reason chip, Answer), in the chapter's order:

| type | examples | from |
|---|---|---|
| 1 Perpendicular bisectors | 1–3 | rebuild Ex 1; old Problem 1 (keeps its options); rebuild Ex 2 |
| 2 Right angles and squares | 4–5 | rebuild Ex 3, Ex 4 |
| 3 Bisecting and copying angles | 6–8 | rebuild Ex 5, Ex 7, Ex 10 |
| 4 Angles around a point | 9–10 | rebuild Ex 11, Ex 13 |
| 5 Tiling a grid | 11–13 | rebuild Ex 15; **new** Ex 12 (4 × 5 grid, two dark squares removed); old Problem 4 |
| 6 Tiling the plane | 14–16 | old Problem 3; rebuild Ex 17, Ex 18 |

No example needed a figure, so no figure was added (the body's last is Fig. 6.34).

**Stage 3 · Practice** — one band, 26 questions: choose the correct option 1–9
(key c c b d a b d a b), assertion and reason 10–13 (a d b c), very short
answer 14–17, short answer 18–22, long answer 23–24, case-based 25–26.
From the rebuild's end-of-chapter questions: 2, 3, 4, 5, 6, 10, 14–19, 21–26.
From the old sets: A6 → 1, C3 → 8, B4 → 7, C2 → 9. **New:** 11, 12, 13
(assertion–reason, to cover (b), (c) and (d)) and 20 (a 165° angle).
Case questions carry no *Case study* label.

**Stage 4 · Answers** — the letter key, one `.work--trace` row for each of
14–26, and *Why the other options are wrong* for 4, 7, 8, 9 and 13.

**Excluded as duplicates of the body or of Stage 1.**
- Old Problem 2 (90° bisected twice, 22.5°): the body says it.
- Old Problem 5 (why the 60° construction is equilateral): the body asks it.
- Rebuild Ex 6 (eight-petal rangoli, 45° lines): the body's flower of eight petals and Set 6.3 Q2.
- Rebuild Ex 12 (30° at P): the body asks "How will you construct angles of 30° and 15°?"
- Rebuild Ex 16 (3 × 3 grid, top middle square removed): near-duplicate of Fig. 6.32; replaced by Example 12.
- Rebuild Ex 8 (copy 50°), Ex 9 (road parallel through V) and Ex 14 (3 × 10 grid): the body's own constructions and grid method, step for step.
- Rebuild end Q4 (the angle beside 60°): Fig. 6.21. Q5 (the three regular tilings): §6.2.
- Q10 (4 × 4 grid, opposite corners removed): Stage 1 and the body's 8 × 8.
- Old sets A3, A4, A5, A7, A8, B3, C4, C5: stated or asked in the body.
- B1, B2: Stage 1.

**Excluded as near-duplicates within the run.**
- Rebuild end Q3 (bisect 130°), Q11 (congruence in copying), Q15 (name the two tools) and Q21 (fourth angle at a point).
- Old A1, A2, B5, B6, C1.
- Q19 (135° at the end of a segment) repeated Example 7 and was replaced by the 165° question.

**Verification.** `beyond-p2ch06-constructions/verify.mjs` in the session
scratchpad: 109 checks, all passing. Every construction is simulated with
coordinates (circle intersections, bisectors, 60° arcs), and every tiling claim
is settled by a domino-tiling search (broken-profile count). Every explicit
tiling printed in an answer is checked square by square: the 7 × 9 corner, the
4 × 4 corner and neighbour, the 5 × 5 centre, and the 4 × 9 short side. Stage 1's numbers were re-checked too. No reused answer was
found wrong.

**Flagged.**
- Question 24 joins AC, CE and EA in a regular hexagon, the triangle of the body's star-in-a-hexagon (Fig. 6.27). It is kept because it asks for the length and an SAS proof, which the body does not.
- Questions 2 and 3 test definitions the body states, but not questions it sets.
- To fit, several examples lost a row. Example 16's question dropped "with no gap and no overlap", which its answer now says. Question 7 no longer says the hexagon is made of triangles; its *why* row does.
- The old stage 4's closing "three things worth keeping" paragraph is gone: the §6a Answers stage has none.

Written new from NCERT *Ganita Prakash*, Grade 7 Part II, Chapter 6,
*Constructions and Tilings* (textbook pages 137–164). Original LearnLab text in
NCERT's order of topics and questions; no sentence is carried over. Crown
Quarto, house design, palette `olive`, the last unused palette of the volume.
The source PDF has no answer key; every answer below was worked here.

Sections: 6.1 Geometric Constructions · 6.2 Tiling. The source's subtopics are
`h3`; its nine *Figure it Out* blocks are Exercise Sets 6.1–6.9; the steps of
each construction are numbered lists. *Math Talk* and *Try This* prompts are
plain questions.

## Every figure is drawn new

All 34 figures come from `fig6.mjs` (with `geo.mjs`) in the session scratchpad,
from computed geometry: arcs at their stated radii, angles at their stated sizes,
tangram pieces from the standard 4 × 4 dissection. Source pages were rendered
with pdf.js to read the figures.

| figure | note |
|---|---|
| Fig. 6.13 | the repeating unit is drawn as 60° sectors of equal radius, so the design can be constructed exactly |
| Fig. 6.16 | **redrawn**: the source's eight-pointed star of shaded parallelograms could not be measured; here it is eight rhombuses with 45° angles at the centre, constructible with parallel lines, labelled the same way |
| Fig. 6.17 | the trefoil arch drawn with 60° base angles: a half circle on BC and half circles bulging outwards on AB and DC |
| Fig. 6.20 | the angles around a point are the source's; the rays are labelled A to G, so the gap is ∠GOA (the source's ∠AOI) |
| Fig. 6.25(e) | **simplified**: the source's pattern of small triangles is drawn as a hexagon of six triangles with each triangle's centre joined to its corners |
| Fig. 6.29 | **replaced**: the source's ten silhouettes (letters, a bird, a cat, a fish, a runner) could not be checked as solvable from the picture. Three shapes that certainly can be made are used instead (see answers) |
| Fig. 6.32 | the source's two figures (the region, then the region beside its colouring) are one figure |
| left out | photographs of arches (Red Fort, Central Park), the compass photograph, the rope-in-hand pictures, the tangram arrow and the four Escher tilings, which are described in the text |

## Every answer worked

| where | answers |
|---|---|
| 6.1 | AB meets XY at its midpoint at 90° · C and D lie on AB · the eye is symmetric when $AX = BX$ |
| Set 6.1 | 1 no: A and B need only be at equal distances from X and Y, and the two pairs may use different radii · 2 yes, if the two pairs use different radii, so that they give two different points · 3 yes: with unequal radii the meeting point is not at equal distances from X and Y · 4 each petal is two arcs of equal radius through the centre and the tip |
| Set 6.2 | 1 the two halves of the rope are equal, so $AX = AY$ and $BX = BY$; A and B lie on the perpendicular bisector · 2 e.g. peg at O, mark X and Y at equal rope lengths, then the rope method on XY |
| 6.1, 45° | 360° ÷ 8 = 45° |
| Set 6.3 | 3 yes: C is still at equal distances from A and B, and so is O, so the line CO is the perpendicular bisector of AB, which bisects the angle; the bisector is the part of the line on the far side of O from C · 4 45°, 22.5°, 30°, 15°, 7.5° …; 65.5° cannot be made by bisecting and adding angles built from 60° and 90° (every such angle is a whole multiple of 15° ÷ 2, 15° ÷ 4, …, and 65.5 is not) · 5 e.g. mark equal lengths on the arms with the rope, then the rope construction on the two marks · 6 half circles drawn inwards on each side reach the centre, giving the largest petals |
| hexagons | gap angle 360° − 310° = 50°, so 70° does not fit · AOD straight: three 60° angles make 180° · 120° beside 60° · $\angle CAX = 60°$ because $AB = AC = BC$ · 30° bisects 60°; 15° bisects 30° · star points equilateral: the inner hexagon's angles are 120°, so each point has two 60° base angles |
| Set 6.7 | 2 a white triangle is seen that is not drawn; the cut-outs and V shapes line up along its edges · 4 draw an arc from P cutting l at X and Y; $PX = PY$, so the perpendicular bisector of XY passes through P |
| Set 6.8 | (a) the two large triangles and the other five pieces each make a right-angled triangle with legs 4 (the two halves of the square along a diagonal); join them along a leg · (b) the same two halves joined along a leg the other way · (c) the square with the medium triangle F moved from its corner to the opposite side |
| grids | 4 × 7 yes (fill each of the 7 columns with 2 upright tiles) · 5 × 7 no, 35 is odd · both even yes · one even yes, tile along the even side · both odd no · Fig. 6.31(a) yes, (b) yes · Fig. 6.32 no; any square whose row and column numbers add to an odd number (e.g. row 2, column 1) leaves an untileable region |
| Set 6.9 | 1 yes, 12 squares, 4 L tiles (a tiling was found) · 2 no: 62 squares, but the removed corners have the same colour, leaving 32 of one colour and 30 of the other |

Beyond the Book: Stage 1 — PQ is the perpendicular bisector; all three angles;
no (18 and 16); no (324° and 432°). Stage 2 — (a), (d), (b), (c), (a). Set A b c d
a b c b d; Set B a b c d b c; Set C d a c b b.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| "Grade 6", "Grade 7" | Class 6, Class 7 | house usage |
| Śulba-Sūtras, Kātyāyana-Śulbasūtra, Vedāṅgas | Sulba-sutras, Katyayana-sulbasutra, Vedangas | the body face would fall back to a third face for the marked letters |
| ∠AOI in the angles figure | ∠GOA | the rays are relabelled A to G |
| "Construct at least 4 different angles" (Sets 6.3, 6.4) | "Draw at least 4 different angles" | an arbitrary angle is drawn, not constructed |
| tangram silhouettes to solve | three shapes with known solutions, and a shape of the student's own | see Fig. 6.29 |
| "tiling (b) was found as recently as 2023" (a picture) | "a shape that tiles it without ever repeating its pattern was found as recently as 2023" | the picture is left out; the 2023 aperiodic tile is named by what it is |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| Fig. 6.29 | C4 | the source's silhouettes are replaced | redraw them if their solutions can be confirmed |
| Set 6.3 Q4 | C5 | whether 65.5° is constructible needs an argument the chapter does not give | a teacher may accept "not with the methods of this chapter" |
| Fig. 6.16 | C4 | the star is a different design from the source's | confirm, or supply the source's measurements |
| 6.2, Escher | M5 | the four tilings described in the source are not shown | add licensed pictures if wanted |

## Checks

Builder: every page at 88% or more except the two closing pages (the summary,
and the last page of Beyond the Book). `gaps`, `orphans`, `check-labels`,
`fit-options` and the width probe report nothing, and a scan finds no maths
command without its backslash. All 34 figures were checked in the PNG proofs;
labels that sat on arcs were moved, the eight petals narrowed, the pointed
arch's upper arcs flattened, and Figs. 6.26 and 6.27 shortened to fit.

Fitting took sentences found with the block search and checked with the
simulator before writing: in the chapter proper, additions to the eyes, the
perpendicular bisector method, the rope construction, the flower design, the
repeating unit and angle copying, parallel lines (two), the hexagon questions
(three), the 60° angle, the tangram (three), tiling, the plane, and questions
in Sets 6.4, 6.5, 6.7 and 6.9; in Beyond the Book, one sentence in each
of Problems 3 and 5. `fit-options` narrowed two option lists.
