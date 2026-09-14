# Class 7 · Mathematics II · Chapter 1 — Geometric Twins

Written new from NCERT *Ganita Prakash*, Grade 7 Part II, Chapter 1, *Geometric
Twins* (textbook pages 1–23). Original LearnLab text in NCERT's order of topics
and questions; no sentence is carried over. Crown Quarto, house design, palette
`indigo`. First chapter of Mathematics II; the directory carries the volume
(`p2ch01-…`), as Class 8's second volume does.

Sections keep NCERT's numbering, with plainer names: 1.1 Congruent Figures
(*Geometric Twins*) · 1.2 Congruence of Triangles · 1.3 Isosceles and
Equilateral Triangles (*Angles of Isosceles and Equilateral Triangles*). The
source's subtopics are `h3`. Its four *Figure it Out* blocks are Exercise Sets
1.1–1.4; the five congruence conditions and the isosceles fact are key ideas;
the *Puzzle Time* grid is an `h3` after the summary.

The source PDF has no answer key, so every answer below was worked here.

## Every figure is drawn new

All 30 figures come from `fig1.mjs` (with `geo.mjs`) in the session scratchpad,
from computed geometry: circles at their stated radii, angles at their stated
sizes, triangles from their stated sides. The source pages were rendered with
pdf.js to read the figures.

| figure | note |
|---|---|
| Fig. 1.5, 1.6, 1.7 | **invented** to the source's description: the drawn shapes are new, so the answers are for these figures — 1.5 congruent; 1.6 (a), (c), (d) congruent, (b) not; 1.7 pair (i) congruent, pair (ii) not (longer short arm) |
| Fig. 1.26 | a bridge frame drawn in place of the source's five photographs (Louvre, Giza, a dome, a rangoli, Howrah Bridge), which are named in the text |
| Fig. 1.29 | **replaced**: the source's single puzzle figure with fourteen marked angles was not drawn to scale and could not be rebuilt consistently. Three small figures use the same facts (base angles, SSS, square with an equilateral triangle) |
| the signboard and Meera and Rabia pictures, the cut-out photographs, the "corresponds to" arrow diagram | left out; the correspondence is set as text and a list |

## Every printed number re-derived

| where | answers |
|---|---|
| 1.1 | symbol fixed by AB, BC and $\angle ABC$ |
| Set 1.1 | 1 congruent (same arms and angle, turned) · 2 (a), (c), (d) · 3 circle: radius; rectangle: length and breadth · 4 the long segment's two parts, the short arm and the angle; (i) yes, (ii) no |
| SSS | circles of 4 cm about A and 8 cm about B, AB = 6 cm, meet at E and F; $\triangle ABE \cong \triangle ABF$ |
| Rectangle | $\triangle ABD \cong \triangle CDB$ (A↔C, B↔D, D↔B) |
| Set 1.2 | 1 $\triangle EHN \cong \triangle IBG$, $\triangle NEH \cong \triangle GIB$, $\triangle HNE \cong \triangle BGI$, $\triangle ENH \cong \triangle IGB$, $\triangle NHE \cong \triangle GBI$ · 2 $\triangle RED \cong \triangle JAM$ (SSS) · 3 $\triangle ABC \cong \triangle ADC$ (SSS); yes, both angles are halved · 4 $\triangle DFE \cong \triangle DGE$ (SSS) |
| SSA | $6 \sin 30^\circ = 3 \lt 4 \lt 6$, so the arc cuts $l$ twice, at 2.55 cm and 7.84 cm from P |
| Example 1 | $\triangle AOB \cong \triangle DOC$ (SAS), AB = CD |
| Set 1.3 | 1 SAS, $\triangle ABC \cong \triangle XZY$ · 2 $\angle CAB = \angle ACD$, $\angle ABD = \angle BDC$; ASA, $\triangle OAB \cong \triangle OCD$; OA = OC, OB = OD · 3 ASA, $\triangle ABC \cong \triangle DBC$ · 4 $\angle ABC = \angle DCB$, ASA $\triangle ABC \cong \triangle DCB$: AB = DC, AC = DB, $\angle BAC = \angle CDB$ |
| AAS | $\angle B = \angle Y = 70^\circ$ |
| RHS | $\triangle SQR$ is $\triangle PQR$ reflected in QR |
| 1.3 | $\angle B = \angle C = 50^\circ$ · equilateral $60^\circ$ |
| Set 1.4 | 1 A↔F, I↔L, R↔Y; AI↔FL, IR↔LY, AR↔FY · 2 (a) SSS $\triangle ABC \cong \triangle DEF$ (b) SAS $\triangle ABC \cong \triangle EFD$ (c) RHS $\triangle ABC \cong \triangle FDE$ (d) AAS $\triangle ABC \cong \triangle DEF$ (e) SSA, not necessarily · 3 SAS gives $\angle OAB = \angle ODC$, alternate angles on AD · 4 SSS both ways; isosceles two ways, equilateral six · 5 $30^\circ$ each · 6 (i) $x = y = 70^\circ$ (ii) $a = 40^\circ$, $b = 90^\circ$ (iii) $p = 30^\circ$, $q = 75^\circ$ |
| Puzzle | solvable with six L-shaped pieces of four squares (checked by search) |

Beyond the Book: Stage 1 — yes (SSS); not necessarily (SSA); $70^\circ$;
$\triangle ABD \cong \triangle CDB$ gives $\angle A = \angle C$. Stage 2 — (c);
(d); (b) $40^\circ$; (c) AC = BD; (d). Set A c c c b d a b a c b; Set B b c a c
b d b a; Set C a c b c d b d c.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| Set 1.2 Q4, "△DFE and △GED" | △DFE and △DGE, "write the congruence" | the source's naming does not match its vertices; the question asks for a correct statement |
| Set 1.4 Q3 repeats Fig. 1.17 | refers to Fig. 1.17 | the same figure, drawn once |
| Set 1.4 Q6 | three new figures | see above |
| *Figure it Out*, the ? prompts | Exercise Sets and plain questions | no such labels in the library |
| summary's "two angles and the included angle" | "two angles and the included side" | a slip in the source |
| AAA | named only as "three equal angles" | the source never names it |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| RHS, "Why?" | C5 | that $\triangle SQR$ is congruent to $\triangle PQR$ is asked, not shown (the source does the same) | a teacher can use SAS with QS = QP once the symmetry is seen |
| Set 1.4 Q3 | C4 | the converse of Chapter 5's alternate angles (equal alternate angles make lines parallel) is used; Chapter 5 states it only for corresponding angles | a line in Chapter 5 of Mathematics I, or a hint here |

## Checks

Builder: 17 body pages and 8 Beyond the Book pages, every page at 88% or more
except the two closing pages. `gaps`, `orphans`, `check-labels`, `fit-options`
and the width probe report nothing. Proofs viewed; figure labels moved where
they printed over a line (Figs. 1.1, 1.8, 1.11, 1.12, 1.14, 1.16, 1.18, 1.22,
1.23, 1.24).

Fitting took line-sized edits only: sentences added to the opening, the SSS
discussion, the ASA and RHS introductions and Set 1.4 Q6; two Stage 2
solutions shortened, the Stage 2 link paragraph moved after Problem 4, one
Set A question reworded to short options, and Set C Question 8 added.
