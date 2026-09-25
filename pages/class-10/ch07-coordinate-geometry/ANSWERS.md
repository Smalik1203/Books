# Class 10 · Mathematics I · Chapter 7 — Coordinate Geometry

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set — *Exercise Set 7.1, Q2* — so it can be used beside the book
without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file.** A question renumbered in the book and
not here is how this goes wrong.

A proof is set out one statement to a line, with its reason.

---

## 7.1 Introduction

### Activity 1 (What picture have you got?)

**A cat's face.** The drawing must show:

- the outline A–B–C–D–E–F–G–H–I–J–K–L–A: a face with two pointed ears, at
  $B(3, 9)$ and $K(6, 9)$;
- two eyes, the triangles PQR and XYZ, pointing upwards;
- a nose, the triangle STU, pointing downwards, with $S(4, 5)$ and $U(5, 5)$
  on top;
- whiskers: S joined to $(0, 5)$ and $(0, 6)$ on the $y$-axis, and U joined
  to $(9, 5)$ and $(9, 6)$.

## 7.2 Distance Formula

### The questions in the running text

- *The distance of B from D in Fig. 7.2:* $BD = \sqrt{6^2 + 8^2} = 10$ units.
- *Why is $PT = 11$ and $QT = 7$ (Fig. 7.4)?* T is $(-5, 4)$, level with P
  and straight above Q. So $PT = 6 - (-5) = 11$ and $QT = 4 - (-3) = 7$.
- *Why can we also write $PQ = \sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$?*
  Because $(x_1 - x_2)^2 = (x_2 - x_1)^2$: a number and its negative have the
  same square. The same holds for the $y$ terms.

### Exercise Set 7.1

1. - (i) $\sqrt{(4 - 2)^2 + (1 - 3)^2} = \sqrt{8} = 2\sqrt{2}$
   - (ii) $\sqrt{(-1 + 5)^2 + (3 - 7)^2} = \sqrt{32} = 4\sqrt{2}$
   - (iii) $\sqrt{(2a)^2 + (2b)^2} = 2\sqrt{a^2 + b^2}$

2. $\sqrt{36^2 + 15^2} = \sqrt{1296 + 225} = \sqrt{1521} = 39$. Yes: with A
   as the origin and 1 km as one unit, B is $(36, 15)$, so the towns are
   **39 km** apart.

3. **Not collinear.** With $A(1, 5)$, $B(2, 3)$, $C(-2, -11)$:
   - $AB = \sqrt{1 + 4} = \sqrt{5}$
   - $BC = \sqrt{16 + 196} = \sqrt{212} = 2\sqrt{53}$
   - $AC = \sqrt{9 + 256} = \sqrt{265}$
   - $AB + BC \approx 2.236 + 14.560 = 16.796$, but $AC \approx 16.279$. No
     distance is the sum of the other two.

4. **Yes.** With $A(5, -2)$, $B(6, 4)$, $C(7, -2)$: $AB = \sqrt{1 + 36} = \sqrt{37}$,
   $BC = \sqrt{1 + 36} = \sqrt{37}$ and $AC = \sqrt{4 + 0} = 2$. Two sides are
   equal, and $\sqrt{37} + \sqrt{37} > 2$, so it is an isosceles triangle.

5. From Fig. 7.8: $A(3, 4)$, $B(6, 7)$, $C(9, 4)$, $D(6, 1)$.
   - $AB = BC = CD = DA = \sqrt{9 + 9} = \sqrt{18}$
   - $AC = \sqrt{36 + 0} = 6$ and $BD = \sqrt{0 + 36} = 6$
   - Four equal sides and equal diagonals, so ABCD is a square. **Champa is
     right.**

6. - (i) **A square.** With $A(-1, -2)$, $B(1, 0)$, $C(-1, 2)$, $D(-3, 0)$:
     every side is $\sqrt{4 + 4} = \sqrt{8}$, and the diagonals are
     $AC = \sqrt{0 + 16} = 4$ and $BD = \sqrt{16 + 0} = 4$.
   - (ii) **No quadrilateral.** $(0, 3)$ is the mid-point of $(-3, 5)$ and
     $(3, 1)$, since $\left(\frac{-3 + 3}{2}, \frac{5 + 1}{2}\right) = (0, 3)$.
     So three of the points lie on one line.
   - (iii) **A parallelogram.** With $A(4, 5)$, $B(7, 6)$, $C(4, 3)$,
     $D(1, 2)$: $AB = CD = \sqrt{10}$ and $BC = DA = \sqrt{18}$, so opposite
     sides are equal; the diagonals $AC = 2$ and $BD = \sqrt{36 + 16} = \sqrt{52}$
     are not equal, so it is not a rectangle, and $AB \neq BC$, so it is not a
     rhombus.

7. Let the point be $(x, 0)$. Then $(x - 2)^2 + 25 = (x + 2)^2 + 81$, so
   $-8x = 56$ and $x = -7$. The point is **$(-7, 0)$**. Check: both
   distances are $\sqrt{81 + 25} = \sqrt{106}$ and $\sqrt{25 + 81} = \sqrt{106}$.

8. $(10 - 2)^2 + (y + 3)^2 = 100$, so $(y + 3)^2 = 36$ and $y + 3 = \pm 6$:
   **$y = 3$ or $y = -9$**.

9. $QP^2 = 25 + 16 = 41$ and $QR^2 = x^2 + 25$. So $x^2 = 16$ and
   **$x = 4$ or $x = -4$**.
   - $QR = \sqrt{41}$ in both cases.
   - For $R(4, 6)$: $PR = \sqrt{1 + 81} = \sqrt{82}$.
   - For $R(-4, 6)$: $PR = \sqrt{81 + 81} = 9\sqrt{2}$.

10. $(x - 3)^2 + (y - 6)^2 = (x + 3)^2 + (y - 4)^2$ gives
    $-6x - 12y + 45 = 6x - 8y + 25$, that is, $-12x - 4y + 20 = 0$:
    **$3x + y = 5$**.

## 7.3 Section Formula

### The questions in the running text

- *Check that $P(12, 5)$ satisfies $OP : PB = 1 : 2$:*
  $OP = \sqrt{144 + 25} = 13$ and $PB = \sqrt{576 + 100} = 26$, and
  $13 : 26 = 1 : 2$.
- *Check the $y$-coordinate in Example 7 (Another way):* with $k = \frac{2}{7}$,
  $\frac{-8k + 10}{k + 1} = \frac{54}{7} \div \frac{9}{7} = 6$.

### Exercise Set 7.2

1. $x = \frac{2(4) + 3(-1)}{5} = 1$ and $y = \frac{2(-3) + 3(7)}{5} = 3$:
   **$(1, 3)$**.

2. The points divide the segment in the ratios $1 : 2$ and $2 : 1$.
   - $\left(\frac{1(-2) + 2(4)}{3}, \frac{1(-3) + 2(-1)}{3}\right) = \left(2, -\frac{5}{3}\right)$
   - $\left(\frac{2(-2) + 1(4)}{3}, \frac{2(-3) + 1(-1)}{3}\right) = \left(0, -\frac{7}{3}\right)$

3. Take A as the origin, AB along the $x$-axis and AD along the $y$-axis, 1 m
   to a unit. The chalk lines are $x = 1, 2, \ldots, 10$, and $AD = 100$ m.
   - Green flag: $\frac{1}{4} \times 100 = 25$ m up the 2nd line, at $(2, 25)$.
   - Red flag: $\frac{1}{5} \times 100 = 20$ m up the 8th line, at $(8, 20)$.
   - Distance: $\sqrt{6^2 + 5^2} = \sqrt{61}$ m, about 7.81 m.
   - Blue flag: the mid-point, $\left(\frac{2 + 8}{2}, \frac{25 + 20}{2}\right) = (5, 22.5)$:
     on the 5th line, 22.5 m from AB.

4. Ratio $k : 1$: $\frac{6k - 3}{k + 1} = -1$, so $7k = 2$ and the ratio is
   **$2 : 7$**. Check: $\frac{2(-8) + 7(10)}{9} = 6$.

5. On the $x$-axis $y = 0$: $\frac{5k - 5}{k + 1} = 0$, so $k = 1$. The ratio
   is **$1 : 1$**, and the point is
   $\left(\frac{-4 + 1}{2}, 0\right) = \left(-\frac{3}{2}, 0\right)$.

6. The diagonals bisect each other: $\left(\frac{1 + x}{2}, \frac{2 + 6}{2}\right) = \left(\frac{4 + 3}{2}, \frac{y + 5}{2}\right)$.
   So $1 + x = 7$ and $8 = y + 5$: **$x = 6$, $y = 3$**.

7. The centre is the mid-point of AB, so A is
   $(2 \times 2 - 1, 2 \times (-3) - 4) = (3, -10)$: **$A(3, -10)$**.

8. $AP = \frac{3}{7}AB$, so $AP : PB = 3 : 4$.
   $x = \frac{3(2) + 4(-2)}{7} = -\frac{2}{7}$ and
   $y = \frac{3(-4) + 4(-2)}{7} = -\frac{20}{7}$:
   **$P\left(-\frac{2}{7}, -\frac{20}{7}\right)$**.

9. The three points divide AB in the ratios $1 : 3$, $1 : 1$ and $3 : 1$:
   **$\left(-1, \frac{7}{2}\right)$, $(0, 5)$ and $\left(1, \frac{13}{2}\right)$**.

10. The diagonals join $(3, 0)$ to $(-1, 4)$ and $(4, 5)$ to $(-2, -1)$:
    $\sqrt{16 + 16} = 4\sqrt{2}$ and $\sqrt{36 + 36} = 6\sqrt{2}$.
    Area $= \frac{1}{2} \times 4\sqrt{2} \times 6\sqrt{2} = 24$ **square units**.

---

## Beyond the Book

### Stage 1 · Using What You Know

Each of the five questions is answered in the running text that follows it
on the page: (1) $AB = AC = 5$ and $BC = \sqrt{50}$, a right angle at A;
(2) $(3, 4)$; (3) $3 : 4$; (4) $D(4, 3)$; (5) no such point.

### Stage 2 · Solved Examples

The 24 September 2026 examples, in examination formats. Each is worked in full on
its page; these are the keys.

1. (a) $2\sqrt{2}$ *(single correct)*
2. (b) $(1, 3)$ *(single correct)*
3. (c) $(1.5, 1)$ *(single correct)*
4. (d) $(-7, 0)$ *(single correct)*
5. (a) $5 : 1$ *(single correct)*
6. (b) 4 *(single correct)*
7. (a), (b), (c) *(multiple correct)*
8. (a), (b), (d) *(multiple correct)*
9. (a), (b), (c) *(multiple correct)*
10. (a), (b), (d) *(multiple correct)*
11. 13 *(numerical answer)*
12. 13 *(numerical answer)*
13. 24 *(numerical answer)*
14. (a) P–3, Q–4, R–2, S–1 *(matching)*
15. (d) P–3, Q–4, R–1, S–2 *(matching)*

### Stage 3 · Practice

Multiple choice and assertion–reason, as the key prints it:
1 (d), 2 (a), 3 (c), 4 (d), 5 (b), 6 (b), 7 (d), 8 (c), 9 (b), 10 (c),
11 (a), 12 (c), 13 (d), 14 (a), 15 (a), 16 (a), 17 (b), 18 (c), 19 (d).

The working for each:

1. $\sqrt{36 + 64} = 10$.
2. $\sqrt{25 + 25} = 5\sqrt{2}$.
3. All three sides are 4: equilateral.
4. $AB^2 = CD^2 = 10$ and $BC^2 = DA^2 = 18$: a parallelogram, not a rhombus. Only Lata is right.
5. $25 + (y + 2)^2 = 9 + (y - 2)^2$ gives $8y = -16$: $(0, -2)$.
6. $\left(\frac{2 - 6}{2}, \frac{-3 + 7}{2}\right) = (-2, 2)$.
7. $B = (2 \times 1 + 3, 2 \times 2 - 5) = (5, -1)$.
8. $\left(\frac{9}{3}, \frac{6}{3}\right) = (3, 2)$.
9. $\frac{6k + 1}{k + 1} = 3$ gives $k = \frac{2}{3}$: the ratio $2 : 3$.
10. $\frac{7k - 6}{k + 1} = 0$ gives $k = \frac{6}{7}$: the ratio $6 : 7$.
11. $\left(\frac{-4 + 2}{3}, \frac{8 + 1}{3}\right) = \left(-\frac{2}{3}, 3\right)$.
12. $D = A + C - B = (-2, 1)$, from the shared mid-point $\left(\frac{1}{2}, 1\right)$.
13. The mid-point is $(1.5, 2)$, and $\sqrt{2.25 + 4} = 2.5$.
14. Radius $\sqrt{9 + 16} = 5$; $B = (5, 5)$.
15. Every side is $\sqrt{13}$; the diagonals are 4 and 6: a rhombus, not a square.
16. (a) A is true because of R.
17. (b) $\sqrt{25 + 144} = 13$; R is true but is about mid-points.
18. (c) A is true: $\frac{4k + 1}{k + 1} = 2$ gives $k = \frac{1}{2}$, and $\frac{7k + 1}{k + 1} = 3$ agrees. R is false: a mid-point divides in the ratio $1 : 1$.
19. (d) The distance is $\sqrt{9 + 16} = 5$, so A is false; R is the distance formula.
20. $\sqrt{64 + 225} = \sqrt{289} = 17$ units.
21. $(2, 1)$.
22. $k = 4$.
23. $(0, -1)$. Check: both distances are $\sqrt{20}$.
24. $2 : 5$, at $\left(0, -\frac{6}{7}\right)$.
25. $AB^2 = 106$, $BC^2 = 106$, $AC^2 = 212$.
    - $AB = BC$, so the triangle is isosceles.
    - $AB^2 + BC^2 = 212 = AC^2$, so the angle at B is $90^\circ$ (converse of the Pythagoras theorem).
26. $a = 1$ and $b = 3$.
27. $P(2, 1)$ and $Q(5, -1)$; the mid-point of PB is $(5, -1)$, which is Q.
28. - $AB^2 = 144 + 144 = 288$ and $CD^2 = 144 + 144 = 288$.
    - $BC^2 = 9 + 9 = 18$ and $DA^2 = 9 + 9 = 18$.
    - Opposite sides are equal, so ABCD is a parallelogram.
    - $AC^2 = 306$ and $BD^2 = 306$: the diagonals are equal, so it is a rectangle.
    - $AB^2 = 288$ and $BC^2 = 18$ differ, so it is not a square.
29. $k = 7$ or $k = -3$; the mid-points are $\left(\frac{9}{2}, 1\right)$ and $\left(-\frac{1}{2}, 1\right)$.
30. (a) 10 km (b) $(3.5, 5)$ (c) yes, 10 km (d) $(2, 11)$
31. (a) $AB = 4$ m, $BC = 6$ m (b) $2\sqrt{13}$ m (c) $(3, 5)$ (d) $\sqrt{13}$ m each
