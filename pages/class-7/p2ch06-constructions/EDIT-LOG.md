# Class 7 · Mathematics II · Chapter 6 — Constructions and Tilings

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
in Sets 6.1, 6.4, 6.5, 6.7 and 6.9; in Beyond the Book, one sentence in each
of Problems 3 and 5. `fit-options` narrowed two option lists.
