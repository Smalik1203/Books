# Class 9 · Mathematics I · Chapter 5 — Exploring Circles

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set — *Exercise Set 5.4, Q3* — so it can be used beside the book
without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file.** A question renumbered in the book and
not here is how this goes wrong.

A proof is set out one statement to a line, with its reason, as Class 9
papers expect.

---

## 5.1 Introduction

### Think and Reflect

1. **Yes, it matters.** Both pairs of creases cross at the centre, but two
   creases that are nearly the same line cross at a very flat angle, so a
   small error in either fold moves the crossing a long way along them. Two
   creases nearly at right angles cross sharply, and a small error in a fold
   moves the crossing only a little. The pair at right angles locates the
   centre more surely.

## 5.2 What a Circle Is

### Think and Reflect

1. The longest chord is a diameter: $2 \times 5 = 10$ units.
2. **There is no shortest chord.** Any chord can be replaced by a shorter
   one, nearer the edge of the circle. Shrink it towards a point and its
   length falls towards $0$, but a chord of length $0$ is a single point,
   which is not a chord. So every chord has a shorter one, and none is the
   shortest.

## 5.3 Symmetries of a Circle

### Exercise Set 5.1

1. - (i) The longest chord is a diameter: $2 \times 6.5 = 13$ cm.
   - (ii) **No.** No chord is longer than a diameter, and $14 > 13$.

2. - (i) **True.** A diameter is a chord that passes through the centre.
   - (ii) **False.** A chord that misses the centre is not a diameter.
   - (iii) **False.** Every diameter is a line of symmetry, so a circle has
     infinitely many.
   - (iv) **True.** If two points were each at distance $r$ from every point
     of the circle, every point of the circle would lie on the perpendicular
     bisector of the segment joining them, and a circle does not lie on a
     line (Section 5.3).

3. A square turns onto itself through $90^\circ$, $180^\circ$, $270^\circ$
   (and $360^\circ$); it has $4$ lines of symmetry. A regular pentagon turns
   onto itself through multiples of $360^\circ \div 5 = 72^\circ$ and has
   $5$ lines of symmetry. A regular hexagon turns through multiples of
   $360^\circ \div 6 = 60^\circ$ and has $6$.

4. **Yes.** Every crease that folds the boundary onto itself is a line of
   symmetry, and every line of symmetry passes through the centre. The first
   two creases crossed at the centre, so the third passes through that same
   point.

## 5.4 How Many Circles?

### Think and Reflect (circles through two points)

1. The radii **grow**: the radius is the distance from the centre to $A$,
   and it increases as the centre moves away from $AB$. There is **no
   largest** circle; the radius grows without limit.
2. The smallest has its centre at the midpoint of $AB$; its radius is
   $\tfrac{1}{2}AB$, and $AB$ is a diameter.
3. **Less curved.** As the centre moves away the arc between $A$ and $B$
   flattens towards the segment $AB$, but it never becomes straight, since
   every circle is curved.

### Think and Reflect (collinear points)

The two bisectors are both perpendicular to the line $ABC$, so they are
parallel. As $C$ is nudged off the line the bisectors meet, and as $C$ comes
back towards the line their meeting point runs off further and further. The
circumcentre goes far away and the circle through the three points grows
without limit, flattening towards the line.

### Exercise Set 5.2

1. $\angle C = 180^\circ - 70^\circ - 60^\circ = 50^\circ$. All three angles
   are acute, so the centre is **inside** the triangle.
2. $\angle A = 100^\circ$ is obtuse, so the centre is **outside** the
   triangle. That agrees with Fig. 5.5.
3. $OA$, $OB$ and $OC$ must be **equal** (up to drawing error): $O$ is on
   the perpendicular bisectors of the sides, so it is equidistant from all
   three vertices, and all three are radii of the circumcircle.
4. The smallest circle has the segment as a diameter: radius
   $8 \div 2 = 4$ cm.
5. **No.** If a line met a circle at three points, those three collinear
   points would lie on one circle, and three collinear points have no circle
   through them (Section 5.4).
6. **Yes, infinitely many.** Turn the triangle about the centre through any
   angle: the turned triangle is congruent to $ABC$ and its vertices are
   still on the circle. Reflecting it in any diameter gives more. (Answer
   read as: triangles different in position.)

## 5.5 Chords and the Angles They Subtend

### Exercise Set 5.3

1. Let $AB$ be a chord of a circle with centre $O$.
   - $OA = r$ and $OB = r$ — both are radii
   - so $OA = OB$, and triangle $OAB$ has two equal sides — it is isosceles

2. Let the triangles be $OAB$ and $OCD$ with $AB = CD$.
   - $OA = OC$ — radii
   - $OB = OD$ — radii
   - $AB = CD$ — given
   - so $\triangle OAB \cong \triangle OCD$ — SSS

3. Each chord is $10$ cm: the triangle made with the two radii has apex
   angle $60^\circ$, so it is equilateral, as in Example 5.

4. The two radii and the chord make a right-angled triangle with legs of
   $8$ cm, so the chord is $\sqrt{8^2 + 8^2} = \sqrt{128} = 8\sqrt{2}$ cm.

5. **No.** The $60^\circ$ chord is $r$ (an equilateral triangle). The
   $120^\circ$ chord is $\sqrt{3}\,r$, about $1.73r$, not $2r$: the
   perpendicular from the centre halves the $120^\circ$ angle, making a
   right-angled triangle with hypotenuse $r$ and a $30^\circ$ angle at the
   chord, whose half-chord is $\tfrac{\sqrt{3}}{2}r$. More simply, a chord
   of $2r$ would be a diameter, which subtends $180^\circ$.

6. **Yes to both** (Theorems 3 and 2). Each statement is the converse of the
   other: one goes from equal angles to equal chords, the other from equal
   chords to equal angles. Proving one does **not** prove the other; each
   needed its own proof (SAS for one, SSS for the other).

## 5.6 Chords, Midpoints and Perpendiculars

### Exercise Set 5.4

1. Let $AB$ be the chord and $O$ the centre.
   - $OA = OB$ — radii
   - every point equidistant from $A$ and $B$ lies on the perpendicular
     bisector of $AB$ — Section 5.4
   - so $O$ lies on the perpendicular bisector of $AB$

2. Let $O$ be the centre.
   - $AB = AC$, so $A$ is equidistant from $B$ and $C$, and lies on the
     perpendicular bisector of $BC$ — Section 5.4
   - $O$ is equidistant from $B$ and $C$ (radii), so $O$ lies on the same
     bisector — Section 5.4
   - the altitude from $A$ is the line through $A$ perpendicular to $BC$,
     and the perpendicular bisector of $BC$ is such a line; there is only
     one, so they are the same line, and it passes through $O$

3. Half the chord is $12$ cm, so $r = \sqrt{12^2 + 5^2} = \sqrt{169} = 13$ cm.

4. The $6$ cm chord lies $\sqrt{5^2 - 3^2} = 4$ cm from the centre and the
   $8$ cm chord $\sqrt{5^2 - 4^2} = 3$ cm. On opposite sides the midpoints
   are $4 + 3 = 7$ cm apart.

5. On the same side, $4 - 3 = 1$ cm.

6. $r = 13$ cm, as in Q3. A chord $12$ cm from the centre has length
   $2\sqrt{13^2 - 12^2} = 2\sqrt{25} = 10$ cm. **Flagged**: the first part
   repeats Q3 word for word.

7. The $16$ cm chord lies $\sqrt{10^2 - 8^2} = 6$ cm from the centre and the
   $12$ cm chord $\sqrt{10^2 - 6^2} = 8$ cm. Opposite sides: $6 + 8 = 14$ cm;
   the same side: $8 - 6 = 2$ cm. **Flagged**: this is Example 8 with the
   same numbers, and its working is printed there.

## 5.7 How Far a Chord Lies from the Centre

### Exercise Set 5.5

1. $2\sqrt{13^2 - 5^2} = 2\sqrt{144} = 24$ cm; and a $10$ cm chord lies
   $\sqrt{13^2 - 5^2} = 12$ cm from the centre (its half is $5$ cm).

2. $2\sqrt{7^2 - 6^2} = 2\sqrt{13}$ cm, about $7.21$ cm.

3. In Fig. 5.8, $CE$ is perpendicular to $AB$ and $E$ is its midpoint
   (Theorem 5), so triangle $CEA$ is right-angled at $E$ with hypotenuse
   $CA = r$, one leg $CE = d$ and the other $AE = \tfrac{1}{2}AB$.
   - $r^2 = d^2 + AE^2$ — Baudhāyana–Pythagoras
   - $AE = \sqrt{r^2 - d^2}$
   - $AB = 2\,AE = 2\sqrt{r^2 - d^2}$

4. The chord $6$ cm out is $2\sqrt{10^2 - 6^2} = 16$ cm; the chord $8$ cm out
   is $2\sqrt{10^2 - 8^2} = 12$ cm. The first is longer, by $4$ cm.

5. **No.** The length is $2\sqrt{r^2 - d^2}$, which does not halve when $d$
   doubles. Counter-example: $r = 5$, $CD$ at $d = 2$ has length
   $2\sqrt{21}$, about $9.17$; $AB$ at $d = 4$ has length $2\sqrt{9} = 6$,
   and $2 \times 6 = 12$, not $9.17$.

6. As $d$ creeps up to $r$ the length $2\sqrt{r^2 - d^2}$ falls to $0$, and
   it falls fastest at the end. **Infinitely many** chords of a given length
   (less than $2r$): they all lie at one distance from the centre, and a
   chord at that distance can be drawn in every direction.

7. $\sqrt{25^2 - 7^2} = \sqrt{576} = 24$ cm. **Flagged**: this is half of
   Example 9, whose working prints it.

8. The chord touches the smaller circle at its midpoint, so it lies $5$ cm
   from the centre: its length is $2\sqrt{13^2 - 5^2} = 24$ cm. **Yes**,
   every such chord is $5$ cm from the centre, so every one is $24$ cm long
   (Theorem 7).

## 5.8 Angles Subtended by an Arc

### Exercise Set 5.6

1. $OA = OB = 12$ cm and $\angle AOB = 60^\circ$, so triangle $OAB$ is
   equilateral and $AB = 12$ cm.
2. $70^\circ \div 2 = 35^\circ$.
3. $250^\circ \div 2 = 125^\circ$.
4. - (i) **No.** Points on the same arc all see $AB$ under the same angle
     (angles in the same segment).
   - (ii) **No.** Points on opposite arcs see $AB$ under supplementary
     angles, which are equal when both are $90^\circ$: if $AB$ is a
     diameter, $X$ and $Y$ may lie on opposite sides.
5. The chord and two radii make an equilateral triangle, so the angle at the
   centre is $60^\circ$, and at a point of the major arc it is
   $60^\circ \div 2 = 30^\circ$.
6. $110^\circ \div 2 = 55^\circ$. With $180^\circ$ it becomes
   $180^\circ \div 2 = 90^\circ$: that is the corollary, the angle in a
   semicircle. **Flagged**: the first part is Example 10's first answer.

## 5.9 Points on One Circle

### Exercise Set 5.7

1. $\angle C = 180^\circ - 75^\circ = 105^\circ$ and
   $\angle D = 180^\circ - 110^\circ = 70^\circ$.
2. **Yes, it can be cyclic**: $80 + 100 = 180$ and $110 + 70 = 180$. **Yes,
   it can be drawn**: $80 + 110 + 100 + 70 = 360$, as the angles of a
   quadrilateral must total.
3. $(2x + 10) + (3x - 20) = 180$, so $5x - 10 = 180$ and $x = 38$. Then
   $\angle P = 86^\circ$ and $\angle R = 94^\circ$.
4. Let $ABCD$ be a parallelogram inscribed in a circle.
   - $\angle A = \angle C$ — opposite angles of a parallelogram
   - $\angle A + \angle C = 180^\circ$ — Theorem 11
   - so $\angle A = \angle C = 90^\circ$, and likewise $\angle B = \angle D = 90^\circ$
   - a parallelogram with a right angle is a rectangle

   And every rectangle can be inscribed: its opposite angles add to
   $180^\circ$ (Theorem 12).
5. - $\angle BCE + \angle BCD = 180^\circ$ — linear pair on $DE$
   - $\angle BAD + \angle BCD = 180^\circ$ — Theorem 11
   - so $\angle BCE = \angle BAD$

## End-of-Chapter Exercises

1. $2\sqrt{13^2 - 5^2} = 24$ cm. (The same as Exercise Set 5.5 Q1.)
2. The radius is $13$ cm; the distance is $\sqrt{13^2 - 12^2} = 5$ cm.
3. $r = \sqrt{8^2 + 6^2} = 10$ cm.
4. As Exercise Set 5.4 Q1: $OA = OB$, and every point equidistant from $A$
   and $B$ lies on the perpendicular bisector of $AB$, so $O$ does.
5. $\angle ACB = 90^\circ$. The arc $AB$ that avoids $C$ is a semicircle and
   sweeps $180^\circ$ at the centre; by Theorem 9 the angle at $C$ is half
   of that.
6. $\angle C = 105^\circ$ and $\angle D = 70^\circ$. **Flagged**: this
   repeats Exercise Set 5.7 Q1 word for word.
7. With sides $5, 5, 12, 12$ in order, the quadrilateral is a kite, and the
   diagonal from the corner between the two $5$ sides to the corner between
   the two $12$ sides splits it into two congruent triangles (SSS), so the angles between the $5$ and $12$ sides
   are equal. They are opposite angles of a cyclic quadrilateral, so each
   is $180^\circ \div 2 = 90^\circ$. The area is two right-angled
   triangles: $2 \times \tfrac{1}{2} \times 5 \times 12 = 60$ square units.
8. Let the radius be $r$. The $10$ cm chord lies $\sqrt{r^2 - 25}$ from the
   centre and the $24$ cm chord $\sqrt{r^2 - 144}$; the shorter is farther
   out, so $\sqrt{r^2 - 25} - \sqrt{r^2 - 144} = 7$. The difference of the
   squares is $119$, so the sum of the distances is $119 \div 7 = 17$; the
   distances are $12$ and $5$, and $r = \sqrt{144 + 25} = 13$ cm.
9. $r = \sqrt{3^2 + 3^2} = \sqrt{18} = 3\sqrt{2}$ cm, about $4.24$ cm.
10. First argument (Section 5.2): the ends of any chord are $r$ from the
    centre, so the path from one end to the other through the centre is
    $2r$, and the straight chord is no longer. Second (Section 5.7): a chord
    at distance $d$ has length $2\sqrt{r^2 - d^2}$, which is largest,
    $2r$, when $d = 0$.
11. **A circle** with the same centre. All the chords of one length lie at
    one distance $d$ from the centre (Theorem 6), and each midpoint is the
    foot of the perpendicular, so every midpoint is at distance $d$ from the
    centre. Every point at distance $d$ is such a midpoint.
12. $AB = AC$, so $\angle AOB = \angle AOC$ (Theorem 2), and
    $\triangle OAB \cong \triangle OAC$ (SSS: $OA$ common, $OB = OC$,
    $AB = AC$). So $\angle OAB = \angle OAC$, and $AO$ bisects
    $\angle BAC$: the centre lies on the bisector.
13. Let $PQ$ be any chord through $A$, and $M$ the foot of the perpendicular
    from $O$ to it.
    - $OM \le OA$ — $OM$ is a leg and $OA$ the hypotenuse of triangle $OMA$
      (or $M = A$)
    - the chord's length is $2\sqrt{r^2 - OM^2}$, which is least when $OM$
      is greatest
    - $OM$ is greatest, equal to $OA$, when $M = A$, that is when the chord
      is perpendicular to $OA$

    So the shortest chord through $A$ is the one perpendicular to $OA$.
14. Each side subtends $360^\circ \div 6 = 60^\circ$ at the centre, so each
    side is $r$ (an equilateral triangle). Its distance from the centre is
    $\sqrt{r^2 - (\tfrac{1}{2}r)^2} = \tfrac{\sqrt{3}}{2}r$.

---

## Beyond the Book

### Stage 1 · Using What You Know

Each question is explained in the running text beneath it. The values it
reaches: Q1 the radius is $7$ cm ($\angle AOB = 60^\circ$); Q2 the radius is
$7.5$ cm; Q3 $\angle APB = 65^\circ$ and $\angle AQB = 115^\circ$; Q4
$OP = 15$ cm ($OM = 12$ cm, $PM = 9$ cm); Q5 the circle has $AC$ as a
diameter, and its centre is the midpoint of $AC$.

### Stage 3 · Practice — the key, as the key prints it

1 (d) &nbsp; 2 (b) &nbsp; 3 (c) &nbsp; 4 (a) &nbsp; 5 (d) &nbsp; 6 (a) &nbsp; 7 (b) &nbsp; 8 (c) &nbsp; 9 (a) &nbsp; 10 (d) &nbsp; 11 (c) &nbsp; 12 (a) &nbsp; 13 (b) &nbsp; 14 (c) &nbsp; 15 (d) &nbsp; 16 (a) &nbsp; 17 (b) &nbsp; 18 (d) &nbsp; 19 (c)

### The working for each

1. $\sqrt{41^2 - 9^2} = \sqrt{1600} = 40$: $40$ cm.
2. $2 \times 64 = 128$: $128^\circ$ (Theorem 9).
3. $180 - 68 = 112$: $112^\circ$ (Theorem 11).
4. Infinitely many: one for each point of the perpendicular bisector.
5. $90 \div 2 = 45$: $45^\circ$.
6. $\angle ACB = 90^\circ$, so $AB^2 = 64 + 225 = 289$, $AB = 17$ and the radius is $8.5$ cm.
7. $AB \lt CD$: the chord farther from the centre is the shorter (Theorem 8).
8. $(180 - 100) \div 2 = 40$: $40^\circ$ (isosceles triangle $OAB$).
9. $48^\circ$: angles in the same segment are equal.
10. $2 + 7 = 9$ parts make $180^\circ$, so $3 + k = 9$ and $k = 6$.
11. $70^\circ, 100^\circ, 100^\circ, 90^\circ$: its opposite angles make $70 + 100 = 170$.
12. $\angle ACB = 90^\circ$, so $3x = 90$ and $x = 30$: $30^\circ$.
13. $\angle BOC = 140^\circ$, so $\angle OBC = (180 - 140) \div 2 = 20$: $20^\circ$.
14. $360 \div 8 = 45$: $45^\circ$.
15. Any three points of a plane lie on some circle: false, since three collinear points do not.
16. (a): the meeting point of two bisectors is equidistant from all three vertices, so it lies on the third bisector too.
17. (b): A is true, since $2\sqrt{26^2 - 10^2} = 48$; R is true but does not give the length.
18. (d): A is false, since equal distances force equal lengths; R is Theorem 7.
19. (c): A is true (Section 5.9); R is false, since an obtuse-angled triangle has its circumcentre outside.
20. Half the chord is $6$ cm; $\sqrt{42.25 - 36} = \sqrt{6.25} = 2.5$: $2.5$ cm.
21. $360 - 136 = 224$, and $224 \div 2 = 112$: $112^\circ$.
22. $\angle P + \angle R = 180$ and $\angle P - \angle R = 40$, so $\angle P = 110^\circ$ and $\angle R = 70^\circ$.
23. The distances are $20$ cm and $15$ cm; opposite sides $35$ cm, the same side $5$ cm.
24. $\angle AOC = 150^\circ$; $\angle ACB = 45^\circ$, $\angle BAC = 60^\circ$, $\angle ABC = 75^\circ$.
25. $\angle CAD = 55^\circ$, $\angle BAD = 100^\circ$, so $\angle BCD = 80^\circ$.
26. If the common midpoint $M$ were not the centre $O$, both chords would be perpendicular to $OM$ at $M$ (Theorem 4) and so would be one line. So $M$ is the centre and both are diameters.
27. $\angle AOB = \angle COD$ (Theorem 2), and each angle at $P$ and $Q$ is half of these (Theorem 9), so $\angle APB = \angle CQD$.
28. $PM = 12$; the centres are $9$ cm and $16$ cm from $M$; $25$ cm apart on opposite sides, $7$ cm on the same side.
29. $\angle P + \angle R = 360^\circ - \tfrac{1}{2}(\angle A + \angle B + \angle C + \angle D) = 180^\circ$, so $PQRS$ is cyclic (Theorem 12).
30. (a) $30$ m (b) $14$ m (c) $44$ m (d) the south path, by Theorem 8
31. (a) $102^\circ$ (b) $84^\circ$ (c) $78 + 96 + 102 + 84 = 360$ (d) no, since $\angle A$ would be $90^\circ$
