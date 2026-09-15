# Class 10 · Mathematics I · Chapter 10 — Circles

Written new from NCERT *Mathematics, Textbook for Class X* (reprint 2026-27),
Chapter 10, *Circles* (textbook pages 144–153). Original LearnLab text in
NCERT's order of topics, activities, examples and questions; no sentence is
carried over. Crown Quarto, house design, palette `amethyst`. The source PDF
has no answer key; every answer below was worked here.

Sections: 10.1 Introduction · 10.2 Tangent to a Circle · 10.3 Number of
Tangents from a Point on a Circle. *Exercise 10.1* and *10.2* are Exercise Sets
10.1 and 10.2. Theorems 10.1 and 10.2, the tangent as a special secant and the
three cases of Activity 3 are `c-keyidea` blocks; proofs and working are
`.work--list` rows with the reason in brackets. The source's *10.4 Summary* is
the chapter summary.

## Figures

All 15 come from `fig10.mjs` in the session scratchpad (unfilled copy
`c10-src`) and are drawn from the source's pictures, not traced.

| figure | note |
|---|---|
| Fig. 10.1 | the arrowheads on the lines are not drawn: the book's one arrowhead is the measurement colour |
| Fig. 10.2 | the pulley is an outline with a bucket on one end of the rope |
| Fig. 10.3 (i) | two secants on each side of the tangent (Q<sub>1</sub>, Q<sub>2</sub>, R<sub>1</sub>, R<sub>2</sub>) instead of three, and no A, A″, B, B″ labels; the text names only what the figure shows |
| Fig. 10.3 (ii) | seven parallel lines; P′Q′, PQ and P″Q″ are drawn heavier |
| Fig. 10.4 | a sixteen-spoke wheel with the spoke to the ground drawn heavier |
| Fig. 10.6 | the source's three figures stacked down the margin are set side by side as (i), (ii), (iii) |
| Figs. 10.5, 10.7–10.14 | redrawn to the source's lettering; Fig. 10.14 is drawn to scale (sides 13, 14 and 15 cm), so its incircle really has radius 4 |

## Every answer worked

| where | answers |
|---|---|
| Set 10.1 | 1 infinitely many, one at each point of the circle · 2 (i) one (ii) secant (iii) two (iv) the point of contact · 3 (d) ${\sqrt{119}}$ cm · 4 a tangent parallel to a line $l$ touches the circle at an end of the diameter perpendicular to $l$; any line parallel to $l$ between the two tangents is a secant |
| Set 10.2 Q1–Q7 | 1 (a) 7 cm · 2 (b) $70^\circ$ · 3 (a) $50^\circ$ · 4 both tangents are perpendicular to the diameter · 5 the radius at the point of contact is perpendicular to the tangent there, and only one line through that point is perpendicular to the tangent · 6 3 cm · 7 8 cm |
| Set 10.2 Q8–Q13 | 8 add the four pairs of equal tangents · 9 OA and OB bisect the angles at A and B, which add up to $180^\circ$ (co-interior angles), so ${\angle OAB + \angle OBA = 90^\circ}$ · 10 the quadrilateral formed with the centre has two right angles · 11 by Q8 and the equal opposite sides, ${2AB = 2AD}$ · 12 ${AB = 15}$ cm, ${AC = 13}$ cm: the tangent from A is $x$ cm, and the area found by Heron's formula equals ${4(x + 14)}$, which gives ${x = 7}$ · 13 the lines to the centre make eight angles in four equal pairs adding up to $360^\circ$ |
| Examples 1–3 | as set out in the chapter, each re-derived; ${TP = \frac{20}{3}}$ cm by both methods |

Beyond the Book: Stage 1 — ${\frac{120}{13}}$ cm; 7, 5 and 3 cm; no; 12 cm and ${6\sqrt{3}}$ cm; 1 cm. Stage 2 — (b), (c), (b), (b), (a).
Set A a b c c d c a b; Set B b c a c a b; Set C b a c d d.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| Theorem 10.1: "So OP is perpendicular to XY (as shown in Theorem A1.7)" | a short argument: drop the perpendicular OM; if M were not P, OP would be the hypotenuse of a right triangle and longer than OM | C6: Theorem A1.7 is in an appendix this book does not have |
| footnote: the word *tangent* "introduced by the Danish mathematician Thomas Fineke in 1583" | in the running text, spelt Fincke | the book has no footnotes; the name is Thomas Fincke (1561–1656) |
| Activity 1: Q<sub>1</sub>–Q<sub>3</sub>, R<sub>1</sub>–R<sub>3</sub> and the positions A′B′, A″B″ | two points on each side and the one tangent position A′B′ | the figure is legible at its printed size with fewer lines |
| Remark 1 after Theorem 10.1 | adds that the tangent is the line perpendicular to the radius | M3: says why there is only one |
| Example 3: "TO is the angle bisector of ∠PTQ. So, OT ⊥ PQ" and "(Why?)" | the reasons given: Remark 2, the bisector in an isosceles triangle, and the angle sum of the right triangle TRP | M2 |
| Exercise 10.1 Q2 blanks; Q3 options (A)–(D) | KaTeX blanks; (a)–(d) | the book's style |
| Exercise 10.2: "In Q.1 to 3, choose the correct option and give justification" | the first sentence of Question 1 | the book has no text between a band and its first question |
| Exercise 10.2 Q5: "the perpendicular at the point of contact to the tangent" | "the perpendicular to a tangent at its point of contact" | L3 |
| Exercise 10.2 Q8: "drawn to circumscribe a circle" | glossed at first use: each side touches the circle | the term is not defined in the chapter |
| summary point 1: "The meaning of a tangent to a circle" | the meaning itself | a summary point should state the fact |
| line-sized additions: in Activity 2 (try a secant through the centre); in Example 3 (the isosceles fact is from Class 9; the right angles at R complete AA; the Pythagoras route needs no similar triangles) | added | fitting |
| the proof of Theorem 10.2 introduced with one sentence instead of two | shorter | fitting |
| Beyond the Book: solutions to Problems 1–5 cut to one line of working a step and a shorter option paragraph; stage 1's fourth and fifth explanations shortened; Set A Q1 and Q6 options in two columns | changed | fitting and legibility |
| lengths with units (${AB = 10}$ cm) | kept on one line with `.nb` | KaTeX broke before the unit |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| Exercise 10.2 Q12 | M2 | the answer needs the area of the triangle two ways (Heron's formula, or joining the centre to the vertices), which no example in the chapter shows | a hint, or a worked example of area = radius × semi-perimeter |
| Exercise 10.1 Q4 | C4 | asks for a tangent to be drawn, but drawing a tangent is not taught; only Remark 1 implies it (the perpendicular to the radius) | a pointer to Remark 1 |
| Activity 1 | C6 | "This shows that a tangent exists at the point P" — the activity suggests it; Theorem 10.1 and Remark 1 are what show it | none at this level |
