# Class 7 · Mathematics II · Chapter 1 — Geometric Twins

## Beyond the Book, rebuilt 15 September 2026

Rebuilt to DESIGN-MATHS.md §6a, *The shape since 15 September 2026*. The §5
body rebuild of the same day (worked examples, checks and end-of-chapter
exercises inside the chapter) was reverted at the user's request; the body
`p001`–`p015` is NCERT's structure and was not touched here. The reverted
rebuild is kept in the session scratchpad (`rebuilt/`, and
`backup-class7-s5-rebuild/`), and was used only as a source.

Beyond the Book went from 8 pages (`p101`–`p108`) to 10 (`p101`–`p110`).

| stage | contents | from |
|---|---|---|
| 1 Using What You Know | four questions tried and explained, word for word | this chapter's existing stage 1; only its `.c-stage__for` line was deleted |
| 2 Solved Examples | 13 examples under five types, stepped as Solution, Step N, Answer | see below |
| 3 Practice | one numbered run of 30 questions in six forms | see below |
| 4 Answers | letter key 1–17; one `.work--trace` row each for 18–30; four rows of *why the other options are wrong* (9, 11, 12, 16) | worked here |

**Solved Examples.** Type 1 · Congruent figures: Examples 1–3 (reverted
rebuild's Examples 1–3). Type 2 · SSS and writing a congruence: Example 4
(rebuild Ex 5), Example 5 (old stage 2 Problem 1), Example 6 (rebuild Ex 6).
Type 3 · The SAS and ASA conditions: Example 7 (old Problem 2), Example 8
(rebuild Ex 8). Type 4 · The AAS and RHS conditions: Example 9 (rebuild Ex
10), Example 10 (rebuild Ex 12). Type 5 · Angles of isosceles triangles:
Example 11 (old Problem 3), Example 12 (old Problem 5), Example 13 (rebuild
Ex 15). Examples 12 and 13 were set in that order so the type packs whole;
no example needs a figure.

**Practice.** Choose the correct option 1–12 · Assertion and reason 13–17 ·
Very short answer 18–20 · Short answer 21–26 · Long answer 27–28 ·
Case-based 29–30. From the reverted rebuild's end-of-chapter questions:
2–6, 8, 9, 13, 14, 17–19, 21–30 (its 1, 3, 2, 8, 7, 4, 6, 11, 9, 10, 15, 12,
21, 22, 17, 18, 20, 19, 24, 26, 28, 27). From the old Set A: 1, 7; Set B: 16;
Set C: 10, 11, 12. New, and verified: 15 (assertion true, reason false — the
form had no (c)) and 20. The tile case is set before the roof case, so the
case group packs. Multiple
choice keys run a, b, c, d three times each; options were reordered for that.
The case questions carry no *Case study* label, and the tile table no caption.

**Left out as duplicates of the body or of stage 1.**

- Old Problem 4 and old Set C 7 (a point that is the midpoint of two segments): body Example 1, Fig. 1.17.
- Rebuild Example 9: the same, word for word.
- Old Set B 4 (a rectangle and its diagonal): the body's Fig. 1.10.
- Old Set C 4 (AB = AD, CB = CD): Exercise Set 1.2, Question 3.
- Old Set B 7 and Set C 3 (a triangle congruent to itself in two ways): Exercise Set 1.4, Question 4.
- Rebuild end-of-chapter 23 (the six-piece grid): the body's puzzle, Fig. 1.30.
- Rebuild end-of-chapter 25 (construct SSA, two triangles): the body's SSA construction, Figs. 1.15–1.16.
- Rebuild end-of-chapter 16 (what CPCT stands for): the body never uses the abbreviation.
- Rebuild Example 13 and old Set A 6 (base angle given, find the rest): stage 1's third question; rebuild end-of-chapter 5 and 14 and old Set B 1 and 2 for the same reason.
- Rebuild Example 11 (flagpole, RHS): the body's altitude argument (Fig. 1.24), and case question 30 applies it again.
- Rebuild Example 14 (jhoola, apex given): the body's $\angle A = 80^\circ$ calculation.

**Left out as near-duplicates inside the section.** Rebuild Example 4 (Example 4
does more); rebuild Example 7 (Example 7); old Set A 2, 7 and 10 (Questions 4
and 5); old Set A 3, Set B 8 (stage 1's second question, Question 17); old
Set A 4, rebuild 13 (Question 6); old Set A 5, Set A 9 (Questions 14, 29);
old Set B 3 (Example 6); old Set B 5 (Question 30); old Set C 6 (Example 10);
old Set C 8 (Question 10).

**Changed.** Example 3 used the body's own symbol, AB = 4 cm, BC = 8 cm and
$80^\circ$; it is now 5 cm, 9 cm and $75^\circ$, so it does not read as the
body's drawing exercise. Examples 8, 9 and 10 each lost a step row, merged
into the row before, to fit the page. No reused answer was found wrong.

**Verification.** `scratchpad/beyond-p2ch01-geometric-twins/verify.mjs`
recomputes every angle and length in the examples, questions and answers
from coordinates (102 checks, 0 failed), and reads the letter key and the
keyed option of Questions 1–12 back off the pages.

**Builder.** Beyond pages 95 · 93 · 88 · 96 · 95 · 95 · 96 · 98 · 95 · 34
(last). No overflow, no violations; every `p1xx` carries `data-bridge`; no
`--head`/`--tail`. `orphans`: 0 stranded. `fit-options`: every row fits.
`gaps`: nothing in Beyond (its short pages are body pages 1, 3, 5, 6, 10,
held by figures, headings and bands). `check-labels`: no collisions. Body
page 12 runs 1.6 mm into the margin, as before.

**Proofs viewed** (pages 17, 21, 24). **Flagged:** in the Answers, rows 21,
22 and 28 let KaTeX break an expression at an operator across two lines;
legible, left as set rather than re-break a fitted page.

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

Beyond the Book (superseded by the rebuild at the top of this log): Stage 1 — yes (SSS); not necessarily (SSA); $70^\circ$;
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
