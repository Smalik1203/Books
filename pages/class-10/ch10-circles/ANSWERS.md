# Class 10 · Mathematics I · Chapter 10 — Circles

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set — *Exercise Set 10.2, Q8* — so it can be used beside the book
without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file.** A question renumbered in the book and
not here is how this goes wrong.

A proof is set out one statement to a line, with its reason, as Class 10
papers expect.

---

## 10.1 Introduction

### The question in the running text

*Can a line lie in any other position with respect to a circle?* No. A line
and a circle have no common point, exactly one, or exactly two: a line meets
a circle in at most two points.

## 10.2 Tangent to a Circle

### The questions in the running text

- **Activity 1.** As the wire AB turns, it cuts the circle at P and a second
  point, except in the one position A′B′, where P is its only common point.
  That position is the tangent at P, and there is only one.
- **Activity 2.** With a secant through the centre, the parallel chords still
  shrink on each side of it, and the two tangents parallel to it touch the
  circle at the ends of the diameter perpendicular to it.
- **The wheel.** Yes: the ground is a tangent to the circle of the wheel, and
  its point of contact is where the wheel touches the ground.
- **Theorem 10.1, "Why?"** Answered in the text: a point of XY inside the
  circle would make XY meet the circle twice, so XY would be a secant.

### Exercise Set 10.1

1. **Infinitely many**: one at each point of the circle.

2. - (i) one
   - (ii) secant
   - (iii) two
   - (iv) point of contact

3. **(d)** $\sqrt{119}$ cm. The radius OP is perpendicular to the tangent PQ
   (Theorem 10.1), so $PQ = \sqrt{12^2 - 5^2} = \sqrt{119}$ cm.

4. A construction. One way:
   - Draw a line $l$ and a circle with centre O.
   - Through O, draw the diameter AB perpendicular to $l$.
   - Through A, draw the line perpendicular to OA. It is parallel to $l$
     (both are perpendicular to AB), and it is the tangent at A (Remark 1
     after Theorem 10.1).
   - Through O, or any point of AB between A and B, draw a line parallel to
     $l$. It cuts the circle in two points, so it is a secant.

   The drawing must show the circle, the line $l$, one parallel line touching
   the circle at an end of the diameter perpendicular to $l$ (with the right
   angle marked), and one parallel line cutting the circle twice.

## 10.3 Number of Tangents from a Point on a Circle

### The questions in the running text

- **Activity 3.** No tangent can be drawn through a point inside the circle;
  one through a point on it; exactly two through a point outside it.
- *What do PT₁ and PT₂ have in common? Are they equal?* Yes, they are equal
  (Theorem 10.2).

### The examples

Example 1 proves AP = BP; Example 2 proves ∠PTQ = 2∠OPQ; Example 3 finds
$TP = \frac{20}{3}$ cm by similar triangles, and the Note finds it again with
$y = \frac{16}{3}$ and $x = \frac{20}{3}$.

### Exercise Set 10.2

1. **(a)** 7 cm. The radius to the point of contact is perpendicular to the
   tangent, so the radius is $\sqrt{25^2 - 24^2} = \sqrt{49} = 7$ cm.

2. **(b)** $70^\circ$.
   - $\angle OPT = \angle OQT = 90^\circ$. *(Theorem 10.1)*
   - The angles of the quadrilateral OPTQ add up to $360^\circ$.
   - So $\angle PTQ = 360^\circ - 90^\circ - 90^\circ - 110^\circ = 70^\circ$.

3. **(a)** $50^\circ$.
   - OP bisects $\angle APB$, so $\angle APO = 40^\circ$. *(Remark 2 after Theorem 10.2)*
   - $\angle OAP = 90^\circ$. *(Theorem 10.1)*
   - So $\angle POA = 180^\circ - 90^\circ - 40^\circ = 50^\circ$.

4. Let AB be a diameter of a circle with centre O, and let PQ and RS be the
   tangents at A and B.
   - $OA \perp PQ$ and $OB \perp RS$. *(Theorem 10.1)*
   - A, O and B lie on one line, so $AB \perp PQ$ and $AB \perp RS$.
   - So $\angle PAB = \angle ABS = 90^\circ$, and these are alternate angles
     made by the transversal AB.
   - So $PQ \parallel RS$.

5. Let XY be the tangent at P to a circle with centre O.
   - $OP \perp XY$. *(Theorem 10.1)*
   - Through P there is only one line perpendicular to XY.
   - So the perpendicular to XY at P is the line PO, and it passes through
     the centre O.

6. The radius is $\sqrt{5^2 - 4^2} = 3$ cm. *(Theorem 10.1 and the Pythagoras theorem)*

7. By Example 1, the radius of the smaller circle to the point of contact
   bisects the chord at right angles. Half the chord is
   $\sqrt{5^2 - 3^2} = 4$ cm, so the chord is **8 cm**.

8. Let AB, BC, CD and DA touch the circle at P, Q, R and S.
   - $AP = AS$, $BP = BQ$, $CR = CQ$ and $DR = DS$. *(Theorem 10.2)*
   - Adding: $AP + BP + CR + DR = AS + BQ + CQ + DS$.
   - That is, $(AP + BP) + (CR + DR) = (AS + DS) + (BQ + CQ)$.
   - So $AB + CD = AD + BC$.

9. Join OC. Let XY touch the circle at P and X′Y′ at Q.
   - $\angle OAP = \angle OAC$, since the tangents AP and AC from A give
     congruent triangles OAP and OAC (RHS). *(Theorem 10.2, Remark 2)*
   - In the same way, $\angle OBQ = \angle OBC$.
   - $XY \parallel X'Y'$, so $\angle PAB + \angle QBA = 180^\circ$.
     *(co-interior angles)*
   - So $2\angle OAB + 2\angle OBA = 180^\circ$, that is,
     $\angle OAB + \angle OBA = 90^\circ$.
   - In the triangle AOB, $\angle AOB = 180^\circ - 90^\circ = 90^\circ$.

10. Let PA and PB be the tangents from P to a circle with centre O.
    - $\angle OAP = \angle OBP = 90^\circ$. *(Theorem 10.1)*
    - The angles of the quadrilateral OAPB add up to $360^\circ$.
    - So $\angle APB + \angle AOB = 360^\circ - 180^\circ = 180^\circ$: the two
      angles are supplementary.

11. Let the parallelogram ABCD circumscribe a circle.
    - $AB + CD = AD + BC$. *(Q8)*
    - $AB = CD$ and $AD = BC$. *(opposite sides of a parallelogram)*
    - So $2AB = 2AD$, that is, $AB = AD$.
    - All four sides are then equal, so ABCD is a rhombus.

12. **AB = 15 cm and AC = 13 cm.**
    - Let the circle touch AB at F and AC at E, and let $AF = AE = x$ cm.
    - $BF = BD = 8$ and $CE = CD = 6$. *(Theorem 10.2)*
    - So $AB = x + 8$, $AC = x + 6$ and $BC = 14$; half the perimeter is $x + 14$.
    - Joining O to A, B and C: area $= \frac{1}{2} \times 4 \times (2x + 28) = 4(x + 14)$.
    - Heron's formula: area $= \sqrt{(x + 14) \times x \times 8 \times 6}$.
    - So $16(x + 14)^2 = 48x(x + 14)$, that is, $x + 14 = 3x$, and $x = 7$.
    - $AB = 7 + 8 = 15$ cm and $AC = 7 + 6 = 13$ cm. Check: the area is
      $4 \times 21 = 84$ cm², and $\sqrt{21 \times 7 \times 8 \times 6} = 84$.

13. Let the sides AB, BC, CD and DA touch the circle, centre O, at P, Q, R and S.
    - $\triangle OAP \cong \triangle OAS$ (RHS), so $\angle AOP = \angle AOS$.
      In the same way $\angle BOP = \angle BOQ$, $\angle COQ = \angle COR$ and
      $\angle DOR = \angle DOS$.
    - The eight angles at O add up to $360^\circ$, so
      $2(\angle AOP + \angle BOP + \angle COR + \angle DOR) = 360^\circ$.
    - So $\angle AOB + \angle COD = 180^\circ$.
    - In the same way, $\angle BOC + \angle AOD = 180^\circ$.

---

## Beyond the Book

### Stage 1 · Using What You Know

Each of the five questions is answered in the running text that follows it
on the page: (1) $AB = \frac{120}{13}$ cm; (2) 7 cm, 5 cm and 3 cm;
(3) no, since $5 + 9 = 14$ but $6 + 7 = 13$; (4) 12 cm and $6\sqrt{3}$ cm;
(5) 1 cm.

### Stage 2 · Solved Examples

The 24 September 2026 examples, in examination formats. Each is worked in full on
its page; these are the keys.

1. (a) 12 cm *(single correct)*
2. (b) $90^\circ$ *(single correct)*
3. (c) $100^\circ$ *(single correct)*
4. (d) 0 *(single correct)*
5. (a) 7 cm *(single correct)*
6. (b) 8 cm *(single correct)*
7. (a), (b), (d) *(multiple correct)*
8. (a), (b), (c) *(multiple correct)*
9. (a), (b) *(multiple correct)*
10. (a), (b), (c) *(multiple correct)*
11. 15 *(numerical answer)*
12. 70 *(numerical answer)*
13. 24 *(numerical answer)*
14. (c) P–3, Q–4, R–1, S–2 *(matching)*
15. (d) P–2, Q–1, R–4, S–3 *(matching)*

### Stage 3 · Practice

Multiple choice and assertion–reason, as the key prints it:
1 (c), 2 (d), 3 (b), 4 (a), 5 (c), 6 (d), 7 (a), 8 (b), 9 (c), 10 (d),
11 (a), 12 (b), 13 (c), 14 (d), 15 (a), 16 (c), 17 (d), 18 (b).

The working for each:

1. Lines parallel to the secant cut shorter and shorter chords as they move
   away from it, and on each side the chord shrinks to one point once
   (Activity 2): 2 tangents.
2. Theorem 10.1: $90^\circ$.
3. $\sqrt{26^2 - 10^2} = 24$ cm.
4. $3x - 2 = x + 6$, so $x = 4$.
5. OP bisects $\angle APB$: $\frac{64^\circ}{2} = 32^\circ$.
6. $\angle OPA = 30^\circ$, so $OP = \frac{4}{\sin 30^\circ} = 8$ cm.
7. The hypotenuse is 15 cm; $r = \frac{9 + 12 - 15}{2} = 3$ cm.
8. $PQ = \sqrt{20^2 - 12^2} = 16$ cm; area $= \frac{1}{2} \times 12 \times 16 = 96$ cm².
9. Both statements are true (Theorem 10.1 and its Remark 1).
10. $\frac{1}{2} \times 3 \times 30 = 45$ cm².
11. Each tangent is 20 cm; $15 + 20 + 20 + 15 = 70$ cm.
12. The third side is 12 cm; $r = \frac{5 + 12 - 13}{2} = 2$ cm.
13. OPTQ is a square, so TP is 7 cm.
14. (d) is false: no tangent passes through a point inside a circle.
15. (a) $\sqrt{41^2 - 9^2} = 40$, and the right angle of Theorem 10.1 is why.
16. (c) A is Theorem 10.2; R is false for tangents from different points.
17. (d) The point is on the circle, so only one tangent passes through it.
18. (b) Both true; A holds because every line through an inside point cuts
    the circle twice, which R does not say.
19. $\sqrt{12^2 + 35^2} = 37$ cm.
20. $\angle APB = 2 \times 25^\circ = 50^\circ$ and $\angle AOP = 90^\circ - 25^\circ = 65^\circ$.
21. The radius is 6 cm; $\sqrt{10^2 - 6^2} = 8$ cm.
22. Half the perimeter is 17 cm. $AF = 17 - 11 = 6$ cm, $BD = 17 - 14 = 3$ cm,
    $CE = 17 - 9 = 8$ cm.
23. - Let the centres be O and O′.
    - $OP \perp l$ and $O'P \perp l$. *(Theorem 10.1)*
    - Only one line through P is perpendicular to $l$.
    - So O, P and O′ lie on that line.
24. $\angle OAB = 90^\circ$ and $\angle AOB = 45^\circ$, so $\angle OBA = 45^\circ$.
    $AB = OA = 8$ cm and $OB = \sqrt{8^2 + 8^2} = 8\sqrt{2}$ cm.
25. $\sqrt{53^2 - 28^2} = 45$, so the chord is 90 cm.
26. - $BD = BF$, $DC = CE$, $AF = AE$. *(Theorem 10.2)*
    - $BD - DC = BF - CE$.
    - $BF - CE = (AB - AF) - (AC - AE)$.
    - Since $AF = AE$, this is $AB - AC$.
27. (a) $\sqrt{39^2 - 15^2} = 36$ cm (b) $2 \times \frac{1}{2} \times 15 \times 36 = 540$ cm²
    (c) $\frac{1}{2} \times 39 \times AB = 540$, so $AB = \frac{360}{13}$ cm.
28. $AS = 23 - 5 = 18$, $AP = 18$, $BP = 29 - 18 = 11$. OPBQ is a square, so
    the radius is 11 cm.
29. (a) $90^\circ$, by Theorem 10.1 (b) $\sqrt{61^2 - 11^2} = 60$ m
    (c) 60 m, by Theorem 10.2 (d) $2 \times \frac{1}{2} \times 11 \times 60 = 660$ m².
30. (a) Half the perimeter is 30 m: 10 m from A, 5 m from B, 15 m from C
    (b) 5 m, the tangent from B, since the radii to AB and BC make a square
    with it (c) $\frac{1}{2} \times 15 \times 20 = 150$ m², and
    $\frac{1}{2} \times 5 \times 60 = 150$ m².
