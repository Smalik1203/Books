# Class 8 · Mathematics I · Chapter 4 — Quadrilaterals

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set — *Exercise Set 4.3, Q4* — so it can be used beside the book
without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file**, which reads the answers back out of
this file set by set and question by question. A question renumbered in the
book and not here is how this goes wrong.

Where a question asks the reader to draw or explain, the answer says what the
drawing must show, and gives one worked instance under *answers will vary*.

---

## 4.2 Polygons

### Exercise Set 4.1

1. (i) **hexagon** (ii) **octagon** (iii) **pentagon** (iv) **decagon**.

2. A heptagon has **7** vertices. A figure with fourteen vertices has
   **14** sides, since a polygon has as many sides as vertices.

3. Answers will vary. The drawing must show a closed figure made of straight
   segments that fails one of the three conditions. For example, four
   segments joined into a bow-tie, with two of its sides crossing in the
   middle: it is closed and its sides are straight, but **two sides meet at a
   point that is not an end of either**, so it is not a polygon.

4. Using $\dfrac{n(n-3)}{2}$:
   - (i) hexagon: $\dfrac{6 \times 3}{2} = 9$
   - (ii) octagon: $\dfrac{8 \times 5}{2} = 20$
   - (iii) decagon: $\dfrac{10 \times 7}{2} = 35$
   - (iv) $12$-gon: $\dfrac{12 \times 9}{2} = 54$

5. $\dfrac{n(n-3)}{2} = 35$, so $n(n-3) = 70$. Two whole numbers three apart
   with product 70 are 10 and 7, so $n = 10$: the polygon has **10** sides.

6. A polygon is concave exactly when one of its angles is bigger than
   $180^\circ$. A triangle's three angles add to $180^\circ$, so no one of
   them can be as large as $180^\circ$. So a triangle is **never concave**.

7. The drawing must show a quadrilateral $ABCD$ with one angle, say at $D$,
   bigger than $180^\circ$, marked; and both diagonals. The diagonal $BD$,
   **from the reflex vertex**, lies inside. The diagonal $AC$, **joining the
   two neighbours of the reflex vertex**, falls outside: the corner $D$ is
   pushed in past the line $AC$, so the segment $AC$ passes across the dent,
   outside the figure.

8. - (i) a square: **regular** — sides all equal and angles all right.
   - (ii) a rhombus: **not regular** unless it is a square — its sides are
     equal but its angles need not be.
   - (iii) an equilateral triangle: **regular** — its sides are equal and so
     are its angles, each $60^\circ$.
   - (iv) a rectangle: **not regular** unless it is a square — its angles
     are equal but its sides need not be.

9. **No** to both. A rhombus that is not a square has all its sides equal and
   is not regular. A rectangle that is not a square has all its angles equal
   and is not regular.

10. $n$ and $n - 3$ differ by 3, an odd number, so one of them is even and
    the other odd. So their product $n(n-3)$ is **always even**, and half of
    it is a whole number. For example $n = 7$: $7 \times 4 = 28$.

## 4.3 The Angle Sum

### Exercise Set 4.2

1. (i) pentagon: $3 \times 180 = 540$, so $540^\circ$
   (ii) octagon: $6 \times 180 = 1080$, so $1080^\circ$
   (iii) $15$-gon: $13 \times 180 = 2340$, so $2340^\circ$
   (iv) $100$-gon: $98 \times 180 = 17640$, so $17640^\circ$

2. (i) $360 - (70 + 95 + 105) = 90$, so $90^\circ$
   (ii) $360 - (60 + 60 + 120) = 120$, so $120^\circ$
   (iii) $360 - (90 + 90 + 58) = 122$, so $122^\circ$

3. Divide by 180 and add 2.
   (i) $900 \div 180 = 5$, so **7** sides
   (ii) $1620 \div 180 = 9$, so **11** sides
   (iii) $2340 \div 180 = 13$, so **15** sides
   (iv) $1000 \div 180$ is not a whole number, so **no polygon** has this angle sum.

4. Each angle is $\dfrac{(n-2) \times 180}{n}$.
   (i) 8 sides: $1080 \div 8 = 135$, so $135^\circ$
   (ii) 9 sides: $1260 \div 9 = 140$, so $140^\circ$
   (iii) 12 sides: $1800 \div 12 = 150$, so $150^\circ$
   (iv) 20 sides: $3240 \div 20 = 162$, so $162^\circ$

5. $1 + 2 + 3 + 4 = 10$ parts make $360^\circ$, so one part is $36^\circ$.
   The angles are **$36^\circ$, $72^\circ$, $108^\circ$ and $144^\circ$**.

6. $(360 - 120) \div 3 = 80$, so each of the three is **$80^\circ$**.

7. Each exterior angle is $180 - 150 = 30$, and $360 \div 30 = 12$, so it
   has **12** sides.

8. **Three obtuse angles: yes.** Three angles just over $90^\circ$ add to just
   over $270^\circ$, which leaves a fourth angle less than $90^\circ$ but
   more than nothing, as long as the three add to less than $360^\circ$. For
   example $100^\circ$, $100^\circ$, $100^\circ$ and $60^\circ$.
   **Four obtuse angles: no.** Four angles each more than $90^\circ$ add to
   more than $360^\circ$, and a quadrilateral's angles add to exactly
   $360^\circ$.

9. The drawing must show a quadrilateral cut by the diagonal not used in the
   text, the two triangles' angles marked, and the total $360^\circ$. The
   choice cannot matter, because either diagonal cuts the figure into two
   triangles whose angles are exactly the four angles of the quadrilateral:
   $180 + 180 = 360$ both times.

10. For each angle to be $145^\circ$, each exterior angle would be
    $180 - 145 = 35$, and $360 \div 35$ is not a whole number, so there is
    **no such polygon**. The nearest possible values are **$144^\circ$**
    below (10 sides, exterior angle $36^\circ$) and **$147\tfrac{3}{11}^\circ$**
    above (11 sides, exterior angle $32\tfrac{8}{11}^\circ$).

## 4.4 Turning the Corners

### Exercise Set 4.3

1. (i) $360 \div 4 = 90$, so $90^\circ$ (ii) $360 \div 6 = 60$, so $60^\circ$
   (iii) $360 \div 10 = 36$, so $36^\circ$ (iv) $360 \div 18 = 20$, so $20^\circ$

2. (i) $360 \div 45 = 8$ sides (ii) $360 \div 30 = 12$ sides
   (iii) $360 \div 18 = 20$ sides (iv) $360 \div 5 = 72$ sides

3. The fifth exterior angle is $360 - (65 + 80 + 70 + 55) = 90$, so
   $90^\circ$. The interior angles are $180$ less each:
   **$115^\circ$, $100^\circ$, $110^\circ$, $125^\circ$ and $90^\circ$**.
   Check: $115 + 100 + 110 + 125 + 90 = 540$.

4. Each exterior angle is $180 - 162 = 18$, and $360 \div 18 = 20$, so it
   has **20** sides.

5. $360 \div 7$ is not a whole number, so no regular polygon has an exterior
   angle of $7^\circ$. An interior angle of $130^\circ$ means an exterior
   angle of $180 - 130 = 50$, and $360 \div 50 = 7.2$ is not a whole
   number either.

6. The interior angle is $180 - 45 = 135$ and three times the exterior angle
   is $3 \times 45 = 135$. **They are equal.** It happens because the two
   are equal exactly when the exterior angle is a quarter of $180^\circ$,
   which is $45^\circ$ — and that is the octagon's.

7. Interior and exterior add to $180^\circ$, and the interior is five times
   the exterior, so six exterior angles make $180^\circ$: each is
   $180 \div 6 = 30$, and $360 \div 30 = 12$. It has **12** sides.

8. From the interior formula: $2160 \div 180 = 12$, so $n - 2 = 12$ and
   $n = 14$. From the exterior angles: all the interior and exterior angles
   together make $180n$, and the exterior ones make $360$, so
   $180n = 2160 + 360 = 2520$ and $2520 \div 180 = 14$. **14** sides both
   ways.

9. Each exterior angle is $\dfrac{360^\circ}{n}$. As $n$ grows this gets
   smaller and smaller, but it is never zero. The interior angle is
   $180^\circ$ less that, so it gets closer and closer to $180^\circ$ and
   never reaches it.

10. If $k$ copies meet at a point, each angle is $360 \div k$. An angle of a
    regular polygon is at least $60^\circ$ and less than $180^\circ$, so $k$
    is 3, 4, 5 or 6.
    - $k = 3$: $120^\circ$, the **regular hexagon**.
    - $k = 4$: $90^\circ$, the **square**.
    - $k = 5$: $72^\circ$, which would need an exterior angle of $108^\circ$,
      and $360 \div 108$ is not a whole number — no polygon.
    - $k = 6$: $60^\circ$, the **equilateral triangle**.

## 4.5 A Family, Not a List

### Think and Reflect (which are always true)

- A rhombus is a kite: **always** — its two pairs of adjacent sides are equal.
- A kite is a rhombus: **only sometimes** — the drawing shows a kite with
  sides 3, 3, 5, 5, which is not a rhombus.
- A rectangle is a square: **only sometimes** — the drawing shows a
  rectangle 2 by 5.
- A square is a rhombus: **always**.

### Exercise Set 4.4

1. (i) **always** (ii) **sometimes** — only when its sides are equal
   (iii) **always** — both pairs of opposite sides are parallel, so one pair is
   (iv) **sometimes** — only when the kite is a rhombus

2. (i) **square** (ii) **parallelogram** (it may be a rhombus, but it is not a
   rectangle or a square) (iii) **trapezium** (iv) **kite**

3. **No.** It must be a rhombus, and a rhombus need not have right angles.
   The drawing must show a rhombus leaning over, with no right angle.

4. **No.** Four equal angles are each $90^\circ$, so it is a rectangle, and a
   rectangle need not have equal sides. The drawing must show a rectangle
   that is not a square.

5. **Two**: all four sides equal (which makes a rhombus, and so a
   parallelogram), and one angle a right angle (which in a parallelogram
   makes every angle right).

6. Its two pairs of equal sides must also be equal to each other, so that
   all four sides are equal.

7. $AB$ and $DC$ are parallel and $AD$ crosses them, so $\angle A$ and
   $\angle D$ are interior angles on the same side of $AD$, and add to
   $180^\circ$. So $\angle D = 180 - 72 = 108$, which is **$108^\circ$**.

8. **No** — a parallelogram has two pairs of parallel sides, not exactly
   one. The fact that changes is *every parallelogram is a trapezium*: the
   parallelograms, and with them the rhombus, rectangle and square, would no
   longer sit under the trapezium.

9. Answers will vary. The drawing must show four unequal sides with no two
   parallel, for example sides of 2, 3, 4 and 5 cm with no pair parallel.
   It shows that the six names cover only a small part of all
   quadrilaterals: most have no special name.

## 4.6 What a Parallelogram Guarantees

### Exercise Set 4.5

1. Adjacent angles add to $180^\circ$ and opposite angles are equal.
   (i) $50^\circ$: $130^\circ$, $50^\circ$, $130^\circ$
   (ii) $90^\circ$: $90^\circ$, $90^\circ$, $90^\circ$
   (iii) $128^\circ$: $52^\circ$, $128^\circ$, $52^\circ$
   (iv) $37^\circ$: $143^\circ$, $37^\circ$, $143^\circ$

2. $CD = 9$ cm and $DA = 5$ cm; the perimeter is $2 \times (9 + 5) = 28$ cm.

3. $2 + 3 = 5$ parts make $180^\circ$, so one part is $36^\circ$. The angles
   are **$72^\circ$, $108^\circ$, $72^\circ$ and $108^\circ$**.

4. The diagonals bisect each other: $PR = 2 \times 7 = 14$ cm and
   $QS = 2 \times 4 = 8$ cm.

5. $2y + 1 = y + 8$, so $y = 7$ and $AB = 2 \times 7 + 1 = 15$ cm.

6. Call the shorter side $a$. Then $2 \times (a + a + 3) = 48$, so
   $4a + 6 = 48$ and $a = 10.5$. The sides are **10.5 cm** and **13.5 cm**.

7. Two equal angles that add to $180^\circ$ are each $90^\circ$, and then
   the opposite angles are $90^\circ$ too. So the figure is a
   **rectangle**. There is no other answer, because the two conditions fix
   every angle at $90^\circ$.

8. Let $AB$ be equal and parallel to $DC$, and draw the diagonal $AC$. In
   triangles $ABC$ and $CDA$: $AB = CD$ (given), $AC$ is common, and
   $\angle BAC = \angle DCA$ (alternate angles, since $AB$ is parallel to
   $DC$). So the triangles are congruent (SAS), and
   $\angle BCA = \angle DAC$. These are alternate angles for the lines $BC$
   and $AD$, so $BC$ is parallel to $AD$. Both pairs of opposite sides are
   parallel: the figure is a **parallelogram**.

9. $O$ is the midpoint of each diagonal, so it is half a diagonal away from
   each end. It is the same distance from all four vertices **only when the
   two diagonals are equal** — that is, when the parallelogram is a
   rectangle (or a square). Otherwise it is nearer the ends of the shorter
   diagonal.

10. The angle next to the right angle is $180 - 90 = 90$, and opposite
    angles are equal, so all four angles are $90^\circ$. The figure is a
    **rectangle**.

## 4.7 Three Special Parallelograms

### Exercise Set 4.6

1. (i) parallelogram, rhombus, rectangle, square
   (ii) rectangle, square
   (iii) kite, rhombus, square
   (iv) square

2. The half-diagonals are 5 cm and 12 cm, and $5^2 + 12^2 = 25 + 144 = 169 = 13^2$.
   The side is **13 cm** and the perimeter $4 \times 13 = 52$ cm.

3. $8^2 + 15^2 = 64 + 225 = 289 = 17^2$, so each diagonal is **17 cm**.

4. Half the known diagonal is 5 cm, and $13^2 - 5^2 = 169 - 25 = 144 = 12^2$.
   The other half-diagonal is 12 cm, so the other diagonal is **24 cm**.

5. The diagonals of a square cross at right angles, so
   $\angle AOB = 90^\circ$. They cut the corner angles in half, so
   $\angle OAB = 90 \div 2 = 45$, which is $45^\circ$. (The side of 7 cm is
   not needed.)

6. A **rectangle** that is not a square. The drawing must show a rectangle
   with its equal diagonals crossing at an angle other than $90^\circ$.

7. Answers will vary. A **kite** does it: for example, diagonals of 6 cm and
   8 cm crossing at right angles, with the 8 cm one cut at its midpoint and
   the 6 cm one cut into 2 cm and 4 cm. Its sides are not all equal, so it
   is not a rhombus.

8. In a rectangle, triangles $ABC$ and $BAD$ are congruent, which makes the
   diagonals equal; but the diagonals cross at right angles only when the
   sides are all equal, which makes it a square. In a rhombus, the equal
   sides make the diagonals cross at right angles; but the diagonals are
   equal only when the angles are right, which again makes it a square.

9. The shorter diagonal joins the ends of the two 10 cm sides that make the
   $60^\circ$ angle. That triangle has two equal sides, so its other two
   angles are equal, and each is $(180 - 60) \div 2 = 60$. It is
   equilateral, so the shorter diagonal is **10 cm**.

10. **Yes, it must be a parallelogram.** In a kite, the diagonal along its
    line of symmetry does divide it into two triangles of equal area, but
    the other diagonal usually does not, so a kite does not meet the
    condition. If diagonal $AC$ halves the area, then $B$ and $D$ are the
    same distance from $AC$, so $AC$ passes through the midpoint of $BD$. In
    the same way $BD$ passes through the midpoint of $AC$. So the diagonals
    meet at the midpoint of each: they bisect each other, and the figure is
    a parallelogram.

---

## Beyond the Book

### Stage 1 · Using What You Know

Each of the eight questions is answered in the running text that follows it
on the page. The results, for reference: (1) $3240^\circ$; (2) the
quadrilateral, $n = 4$; (3) with the diagonal $BD$, the two triangles would need
$20 < 3 + 4 + 5 = 12$; (4) the fourth must be $90^\circ$, but a
pentagon with four right angles cannot exist; (5) the other diagonal lies
inside, so the sum is still $360^\circ$; (6) triangles $AOB$ and $COD$ are
congruent, so $AB$ is parallel to $CD$, and likewise $BC$ to $AD$; (7) the
square; (8) 22 values (the divisors of 360, listed in pairs, less 1 and 2).

### Stage 2 · Solved Examples

The 23 September 2026 examples, in examination formats. Each is worked in full on
its page; these are the keys.

1. (c) 11 *(single correct)*
2. (a) $160^\circ$ *(single correct)*
3. (b) 30 *(single correct)*
4. (d) $110^\circ$ *(single correct)*
5. (a) 24 *(single correct)*
6. (b) $35^\circ$ *(single correct)*
7. (a), (c) *(multiple correct)*
8. (a), (b), (d) *(multiple correct)*
9. (a), (b), (c) *(multiple correct)*
10. (a), (c), (d) *(multiple correct)*
11. 13 *(numerical answer)*
12. 128 *(numerical answer)*
13. 18 *(numerical answer)*
14. (a) P–3, Q–4, R–2, S–1 *(matching)*
15. (c) P–3, Q–4, R–1, S–2 *(matching)*

### Stage 3 · Practice

Multiple choice and assertion–reason, as the key prints it:
1 (c), 2 (a), 3 (d), 4 (b), 5 (c), 6 (c), 7 (d), 8 (a), 9 (b), 10 (d),
11 (b), 12 (d), 13 (a), 14 (c), 15 (b), 16 (d), 17 (c), 18 (b), 19 (a).

The working for each:

1. $(13 - 2) \times 180 = 1980$.
2. $\dfrac{7 \times 4}{2} = 14$.
3. $360 \div 45 = 8$.
4. $360 \div 60 = 6$ and $180 - 6 = 174$.
5. $360 \div 72 = 5$: a pentagon.
6. $360 \div 80 = 4.5$ is not a whole number. ($360 \div 15 = 24$, $360 \div 90 = 4$, $360 \div 60 = 6$.)
7. The kite's definition: two pairs of adjacent sides equal.
8. Opposite angles are equal: $\angle C = 58^\circ$.
9. $AO = 18 \div 2 = 9$ and $BD = 2 \times 5 = 10$.
10. $AO = 18 \div 2 = 9$ cm; a rhombus's diagonals cross at right angles, so $\angle AOB = 90^\circ$.
11. $(180 - 120) \div 2 = 30$.
12. Triangle $ABC$ needs $AC < 3 + 4 = 7$ and $4 < 3 + AC$; triangle $ACD$ needs $AC < 6 + 8 = 14$ and $8 < 6 + AC$. So $AC$ is more than 2 cm and less than 7 cm: only 5 cm. (1 cm is too short, 7 cm lays triangle $ABC$ flat, 10 cm is too long.)
13. $360 \div 12 = 30$, and $2 \times 30 = 60$.
14. $n(n-3) = 130 = 13 \times 10$, so $n = 13$.
15. $7 \times 360 = 2520$, $2520 \div 180 = 14$, so $n = 16$.
16. (d) $360 \div 70$ is not a whole number, so A is false; R is true.
17. (c) opposite angles are equal, so A is true; adjacent angles add to $180^\circ$, so R is false.
18. (b) both true; the number of diagonals does not explain the angle sum.
19. (a) With the 9 cm rod as $DA$ and the diagonal $BD$, the two triangles need $9 < AB + BD$ and $BD < BC + CD$, so $9 < 2 + 3 + 4 = 9$, which is false. So A is true, and R is why.
20. $15 - 3 = 12$ diagonals and $15 - 2 = 13$ triangles.
21. $(22 - 2) \times 180 = 3600$, so $3600^\circ$.
22. $\angle B = 180 - 64 = 116$, so $116^\circ$; $\angle C = 64^\circ$.
23. $3060 \div 180 = 17$, so 19 sides.
24. Yes: $180 - 171 = 9$ and $360 \div 9 = 40$, so 40 sides.
25. $6x + 14 = 38$, $x = 4$; $AB = 11$ cm, $BC = 8$ cm. Check: $2 \times (11 + 8) = 38$.
26. $3y - 2 = 2y + 5$, $y = 7$; $PR = 19$ cm, so $OQ = 9.5$ cm.
27. Interior $170^\circ$, exterior $10^\circ$; $360 \div 10 = 36$ sides; sum $(36 - 2) \times 180 = 6120$, so $6120^\circ$.
28. $AO = 15$ cm, $BO = 8$ cm, $\angle AOB = 90^\circ$, $\angle ABO = 180 - 90 - 28 = 62$, so $62^\circ$. Each triangle has legs 15 cm and 8 cm with a right angle between them, so they are the same triangle.
29. (a) each triangle has $90^\circ$, $37^\circ$ and $180 - 90 - 37 = 53$, so $53^\circ$ (in the top one the $37^\circ$ is an alternate angle) (b) two triangles, each fixed by its sides (c) $6 - 3 = 3$ braces, $6 - 2 = 4$ triangles.
30. (a) $540 - 430 = 110$, so $110^\circ$ (b) $60^\circ$, $85^\circ$, $70^\circ$, $75^\circ$, $70^\circ$; $60 + 85 + 70 + 75 + 70 = 360$ (c) at $B$, $85^\circ$.
31. (a) $CD = 40$ cm, $DA = 25$ cm, perimeter 130 cm (b) $\angle B = 115^\circ$, $\angle C = 65^\circ$, $\angle D = 115^\circ$ (c) a rectangle, every angle $90^\circ$, perimeter still 130 cm.
