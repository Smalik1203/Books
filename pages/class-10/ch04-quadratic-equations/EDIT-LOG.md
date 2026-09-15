# Class 10 · Mathematics I · Chapter 4 — Quadratic Equations

Written new from NCERT *Mathematics, Textbook for Class X* (reprint 2026-27),
Chapter 4, *Quadratic Equations* (textbook pages 38–47). Original LearnLab
text in NCERT's order of topics, examples and questions; no sentence is
carried over. Crown Quarto, house design, palette `garnet`. The source PDF has
no answer key; every answer below was worked here.

Sections: 4.1 Introduction · 4.2 Quadratic Equations · 4.3 Solution of a
Quadratic Equation by Factorisation · 4.4 Nature of Roots. *Exercise 4.1*–*4.3*
are Exercise Sets 4.1–4.3. The definitions (quadratic equation, root), the
quadratic formula and the discriminant cases are `c-keyidea` blocks. The
source's *4.5 Summary* is the chapter summary.

## Figures

Both figures come from `fig4.mjs` in the session scratchpad.

| figure | note |
|---|---|
| Fig. 4.1 | the prayer hall floor, breadth $x$ m and length $(2x + 1)$ m, area 300 m², drawn in the solved proportion 12 : 25 |
| Fig. 4.2 | the circular park, diameter $AB$ = 13 m, pole $P$ with $BP = x$ and $AP = x + 7$, drawn to scale for $x = 5$, right angle at $P$ |

## Every answer worked

| where | answers |
|---|---|
| 4.1 hall | $2x^2 + x - 300 = 0$; breadth 12 m, length 25 m (Example 6) |
| Example 1 | (i) $x^2 - 45x + 324 = 0$ (ii) $x^2 - 55x + 750 = 0$ |
| Example 2 | (i) quadratic (ii) not (iii) quadratic (iv) quadratic |
| Examples 3–9 | 1, $\frac{3}{2}$ · $\frac{2}{3}$, $-\frac{1}{2}$ · $\sqrt{\frac{2}{3}}$ twice · 12 m by 25 m · no real roots ($D = -8$) · 5 m from $B$, 12 m from $A$ · $\frac{1}{3}$ twice |
| Set 4.1 Q1 | (i) yes, $x^2 + 7 = 0$ (ii) yes, $x^2 - 4x + 6 = 0$ (iii) no, $-3x + 1 = 0$ (iv) yes, $x^2 - 10x - 3 = 0$ (v) yes, $x^2 - 11x + 8 = 0$ (vi) no, $7x - 3 = 0$ (vii) no, $x^3 - 6x^2 - 14x - 8 = 0$ (viii) yes, $2x^2 - 13x + 9 = 0$ |
| Set 4.1 Q2 | (i) $2x^2 + x - 528 = 0$ (ii) $x^2 + x - 306 = 0$ (iii) $x^2 + 32x - 273 = 0$ (iv) $u^2 - 8u - 1280 = 0$ |
| Set 4.2 | 1 (i) 5, $-2$ (ii) $\frac{3}{2}$, $-2$ (iii) $-\sqrt{2}$, $-\frac{5}{\sqrt{2}}$ (iv) $\frac{1}{4}$, $\frac{1}{4}$ (v) $\frac{1}{10}$, $\frac{1}{10}$ · 2 marbles 36 and 9; toys 25 or 30 · 3 13 and 14 · 4 13 and 14 · 5 5 cm and 12 cm · 6 6 articles at ₹15 each |
| Set 4.3 | 1 (i) no real roots (ii) equal, $\frac{2}{\sqrt{3}}$ twice (iii) distinct, $\frac{3 \pm \sqrt{3}}{2}$ · 2 (i) $k = \pm 2\sqrt{6}$ (ii) $k = 6$ · 3 yes, 40 m by 20 m · 4 not possible ($x^2 - 20x + 112 = 0$ has $D = -48$) · 5 yes, a square of side 20 m |

Beyond the Book: Stage 1 — $k = \pm 6$, roots $\mp 3$; $k = 6$, other root 3;
not possible; 11 and 13, or $-13$ and $-11$; $D = p^2 + 4 \gt 0$. Stage 2 —
(a), (b), (d), (a), (a). Set A b a a b c b b b; Set B b b b a a c;
Set C a a c c a.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| 4.4 opens "The equation ax² + bx + c = 0 are given by" and uses the quadratic formula, which this edition no longer derives | one sentence says why a formula is needed, and the formula is stated as a key idea; a paragraph checks that its two roots have sum $-\frac{b}{a}$ and product $\frac{c}{a}$ | the source sentence is broken, and the formula arrives with no reason; the check uses only Chapter 2 |
| Example 8: "x = 7 ± √289 over 2" | $\frac{-7 \pm \sqrt{289}}{2}$ | a lost minus sign; the roots 5 and $-12$ need it |
| Example 5's factorisation shown with the middle term $2\sqrt{6}x$ split | the same, as three lines of working | layout |
| "C.E. 598-665" and similar | 598–665 CE | house style |
| Example 2 Remark "Be careful!" | "Be careful." as the start of a paragraph | C8 |
| Example 9: "hence find the nature" | "use it to find the nature" | L1 |
| the tip on checking roots against the problem | added | the chapter sets aside a negative root twice and says so each time |
| the history paragraph in 4.1 | two paragraphs | one 61mm paragraph could not start on the opening page |
| Set 4.1 Q2, four word problems in one question | parts in two blocks of two (`li.cont`, `c-parts[data-start]`) | the same numbering; the question can now run over a page |
| a sentence on what the discriminant tells us, one on working it out first, and a check of both integer pairs in Stage 1 | added | line-sized fitting edits; each says what the page already shows |
| three sentences reworded so a full stop is not set alone at the head of a line after an equation | reworded | layout |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| 4.4, quadratic formula | C6 / M3 | the formula is used without a derivation; the source's history paragraph names completing the square, but the section that did it is not in this edition | a derivation, or a note that it is taken as known |
| Example 8 | C5 | "$\angle APB = 90^\circ$ (Why?)" relies on the angle in a semicircle, which the reader meets in Class IX; the chapter leaves it as a question | none |
| Set 4.3 Q2 (ii) | C4 | $kx(x - 2) + 6 = 0$ has equal roots for $k = 6$; $k = 0$ also makes $4k^2 - 24k = 0$ but then the equation is not quadratic | none, but the key should say $k = 6$ only |
| page 9 (p009) | — | the builder reports "~ page 9 runs 1.3mm into the bottom margin" on every build, although its fill is 93% and the proof ends well above the foot. The report appeared when two Beyond the Book pages (p103, p104) were shortened; p009 itself was not changed. Not explained | find what the overflow probe is measuring on that page before the volume goes to press |
| 4.1 history | C6 | the dates and the attribution of the formula to Sridharacharya "as quoted by Bhaskara II" are the source's and were not checked against another source | check if the history is to be cited |
