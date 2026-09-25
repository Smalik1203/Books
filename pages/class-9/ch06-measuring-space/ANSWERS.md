# Class 9 · Mathematics I · Chapter 6 — Measuring Space: Perimeter and Area

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set — *Exercise Set 6.2, Q3* — so it can be used beside the book
without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file.** A question renumbered in the book and
not here is how this goes wrong.

Unless a question says otherwise, $\pi \approx \frac{22}{7}$, as the book
instructs. A proof is set out one statement to a line, with its reason, as
Class 9 papers expect.

---

## Opening

### Think and Reflect (the $200$ m track)

**No — answers will vary in the reasoning, but the stagger is not smaller.**
A lane further out by $w$ metres adds $\pi w$ to every semicircular bend,
whatever the size of the track. The stagger has to make up the extra length
of all the bends a runner goes round in lane, so it depends on the lane width
and on how many bends are run, not on the radius of the track.

Worked instance, with lanes $1.22$ m wide and runners staying in lane for the
whole race: on a $400$ m track, $400$ m is one lap, two bends, one full circle
of turning, and the stagger between two lanes is
$2\pi \times 1.22 \approx 7.67$ m. On a $200$ m track, $400$ m is two laps,
four bends, and the stagger is twice as large, about $15.33$ m.

## 6.1 Perimeter of a Shape

### Think and Reflect

1. The stagger has to make up the extra distance run on the curved parts of
   the track, and those are arcs of circles. To work it out we need the
   length round a circle, which is the perimeter of Fig. 6.3.

## 6.2 Perimeter of a Circle

### Home Measurement

**Answers will vary.** The ratio should come out between $3.1$ and $3.2$.
Worked instance: a reel of diameter $D = 2.5$ cm; twenty turns of thread
measure $L = 157.5$ cm; $\frac{L}{20D} = \frac{157.5}{50} = 3.15$.

The ratio can be estimated by pure geometry by trapping the circle between
polygons drawn inside and outside it, as Archimedes did (Fig. 6.7).

### Fig. 6.6 — why $\pi \gt 3$

The six triangles from $O$ to the sides of the hexagon are equilateral, so
each side of the hexagon is $1$ and its perimeter is $6$. The circle is
longer than the hexagon inside it, so $2\pi \gt 6$ and $\pi \gt 3$.

### Fig. 6.7 — why $3 \lt \pi \lt 2\sqrt{3}$

- inside hexagon: perimeter $6 \lt 2\pi$, so $\pi \gt 3$
- outside hexagon: each side $a$ is the base of an equilateral triangle of
  height $1$, so $a^2 = 1^2 + \left(\frac{a}{2}\right)^2$, $a^2 = \frac{4}{3}$
  and $a = \frac{2}{\sqrt{3}}$ — Baudhāyana–Pythagoras
- its perimeter is $6a = \frac{12}{\sqrt{3}} = 4\sqrt{3}$, and
  $2\pi \lt 4\sqrt{3}$, so $\pi \lt 2\sqrt{3} \approx 3.46$

## 6.4 Length of an Arc of a Circle

### Think and Reflect (the stagger in Fig. 6.11)

The radii of the first and second lanes differ by the lane width, $1.22$ m.
Over one lap, the two semicircles make a full circle, so the runner in the
second lane runs $2 \times 3.1416 \times 1.22 = 7.67$ m further, to two
decimal places, and needs a stagger of about $7.67$ m. The third lane is
again $1.22$ m further out, so **yes**, the same stagger is needed between the
third and second lanes. (Real tracks measure lanes other than the first
$0.2$ m from the inner line, which changes the staggers slightly; the book's
model uses one distance throughout.)

## 6.5 Problems, Puzzles and Paradoxes on Perimeter

### Exercise Set 6.1

1. $2 \times \frac{22}{7} \times r = 44$, so $r = 7$ cm.
2. $2 \times \frac{22}{7} \times r$:
   - (i) $44.0$ cm
   - (ii) $\frac{440}{7} = 62.857\ldots$, so $62.9$ cm
   - (iii) $\frac{528}{7} = 75.428\ldots$, so $75.4$ cm
3. - (i) $\frac{60}{360} \times 2 \times \frac{22}{7} \times 3.5 = \frac{11}{3} \approx 3.67$ cm
   - (ii) $\frac{120}{360} \times 2 \times \frac{22}{7} \times 6.3 = 13.2$ m
4. The arc is $\frac{75}{360} \times 2 \times \frac{22}{7} \times 14 = \frac{55}{3} \approx 18.33$ cm;
   with the two radii the perimeter is $\frac{55}{3} + 28 = \frac{139}{3} \approx 46.33$ cm.
5. Each arc is a semicircle or a quarter circle; add the arcs and any straight
   edges that are part of the boundary, then put $\pi \approx \frac{22}{7}$.
   - (i) two semicircles of diameter $60$ m make one circle: $60\pi + 2 \times 80$, which is $60 \times \frac{22}{7} + 160 = \frac{2440}{7} \approx 348.57$ m
   - (ii) half of the outer circle, half of the inner, and two ends of $2$ cm: $6\pi + 4\pi + 4$, which is $10 \times \frac{22}{7} + 4 = \frac{248}{7} \approx 35.43$ cm
   - (iii) four semicircles of diameter $10$ cm: $4 \times 5\pi = 20\pi$, which is $20 \times \frac{22}{7} = \frac{440}{7} \approx 62.86$ cm
   - (iv) three semicircles of diameter $12$ cm: $3 \times 6\pi = 18\pi$, which is $18 \times \frac{22}{7} = \frac{396}{7} \approx 56.57$ cm
   - (v) four semicircles of diameter $14$ cm and four quarter circles of radius $14$ cm: $4 \times 7\pi + 4 \times 7\pi = 56\pi$, which is $56 \times \frac{22}{7} = 176$ cm
   - (vi) a semicircle of diameter $28$ cm and four of diameter $7$ cm: $14\pi + 4 \times 3.5\pi = 28\pi$, which is $28 \times \frac{22}{7} = 88$ cm
   - (vii) semicircles on $8$, $6$ and the hypotenuse $10$ cm: $4\pi + 3\pi + 5\pi = 12\pi$, which is $12 \times \frac{22}{7} = \frac{264}{7} \approx 37.71$ cm
   - (viii) a semicircle of diameter $12$ cm and three of diameter $4$ cm: $6\pi + 3 \times 2\pi = 12\pi$, which is $\frac{264}{7} \approx 37.71$ cm
   - (ix) a semicircle of diameter $20$ cm and two of diameter $10$ cm: $10\pi + 5\pi + 5\pi = 20\pi$, which is $\frac{440}{7} \approx 62.86$ cm
6. - (i) one turn: $\frac{22}{7} \times 56 = 176$ cm
   - (ii) $10$ km $= 1\,000\,000$ cm, and $1\,000\,000 \div 176 = 5681.8\ldots$:
     about $5682$ turns ($5681$ complete turns)
7. - (i) Each petal is two quarter circles of radius $7$ cm (Fig. 6.15A), so the
     four petals are eight quarter circles, two whole circles:
     $2 \times 2 \times \frac{22}{7} \times 7 = 88$ cm
   - (ii) Each petal is two arcs of $60^\circ$ and radius $42$ cm, centred at
     neighbouring vertices: $2 \times \frac{60}{360} \times 2 \times \frac{22}{7} \times 42 = 88$ cm
     a petal, and $6 \times 88 = 528$ cm for the six
8. Perimeter is $2\pi r$, so the radii are in the same ratio, $5 : 4$.

## 6.7 Area of a Parallelogram

### Think and Reflect (the thin parallelogram)

Repeat the step of Fig. 6.19: each step slides the top side along without
changing the area (a triangle is cut from one end and added at the other),
until the foot of the perpendicular from $C$ lies on the top side. Then the
cut of Fig. 6.17 works.

### Think and Reflect (the sides of a parallelogram)

**No.** The area is base $\times$ height, and the height depends on the angle
between the sides. With sides $a$ and $b$ fixed, the height can be anything up
to $b$: the area is largest, $ab$, for the rectangle, and shrinks towards $0$
as the parallelogram is squashed flat.

## 6.8 Area of a Triangle

### The obtuse triangle of Fig. 6.20B

Drop the perpendicular $EH$ from $E$ to $GF$ produced, with $FH = x$ and
$EH = h$. Then
- area$(\triangle EHG) = \frac{1}{2}(b + x)h$ and area$(\triangle EHF) = \frac{1}{2}xh$ — right-angled triangles, each half a rectangle
- area$(\triangle EFG) = \frac{1}{2}(b + x)h - \frac{1}{2}xh = \frac{1}{2}bh$

### Think and Reflect (cutting $\triangle ABD$ to cover $\triangle ACD$)

**Yes, it is possible.** Answers will vary. One way: cut a triangle along
the line joining the midpoints of its two slanting sides, and turn the small
top triangle about one of those midpoints so that it fills the gap. The
triangle becomes a parallelogram with the same base and half the height.
$\triangle ABD$ and $\triangle ACD$ have equal bases and the same height, so
they become parallelograms with equal bases and equal heights, and two such
parallelograms can be cut into each other by the sliding of Fig. 6.17 and
Fig. 6.19. The book does not give the least number of pieces, and neither
does this key.

### Think and Reflect (polygons of equal area)

**Answers will vary.** All three pairs can be done: for example, a
$4 \times 1$ rectangle cut in half across its length gives two $2 \times 1$
rectangles, which fit together as a $2 \times 2$ square. The conjecture to
reach: *any two polygons of equal area can be cut, one into finitely many
pieces, that rearrange to cover the other exactly.* This is true; it is the
Wallace–Bolyai–Gerwien theorem.

### Think and Reflect (rectangles with perimeter $40$)

1. **Infinitely many**: the sides are $x$ and $20 - x$ for any $x$ between
   $0$ and $20$.
2. The area $x(20 - x)$ is largest for the square, $10 \times 10$, area $100$.
3. **There is no smallest.** Taking $x$ close to $0$ makes the area as small
   as we like, but it never reaches $0$, and every rectangle has a thinner one
   with a smaller area.

## 6.9 Squaring a Rectangle

### Think and Reflect

First turn the triangle into a rectangle of the same area: a triangle of
base $b$ and height $h$ has the area of a rectangle $b \times \frac{h}{2}$
(cut along the midline, as above). Then square that rectangle by
Baudhāyana's construction.

### Exercise Set 6.2

1. Base $AD = BC = 8$ cm, and the height from $E$ to $AD$ is $DC = 10$ cm, so
   the area is $\frac{1}{2} \times 8 \times 10 = 40$ cm$^2$.
2. The perpendiculars from the shorter side cut $\frac{40 - 20}{2} = 10$ cm off
   each end, so the height is $\sqrt{26^2 - 10^2} = \sqrt{576} = 24$ cm and the
   area is $\frac{1}{2}(40 + 20) \times 24 = 720$ cm$^2$.
3. The third side is $32 - 8 - 11 = 13$ cm and $s = 16$:
   $\sqrt{16 \times 8 \times 5 \times 3} = \sqrt{1920} = 8\sqrt{30} \approx 43.82$ cm$^2$.
4. The sides are $60$, $100$ and $140$ m, and $s = 150$:
   $\sqrt{150 \times 90 \times 50 \times 10} = \sqrt{6750000} = 1500\sqrt{3} \approx 2598.08$ m$^2$.
5. With diagonals $d$ and $2d$, the area is $\frac{1}{2} \times d \times 2d = d^2 = 128$,
   so the shorter diagonal is $d = \sqrt{128} = 8\sqrt{2} \approx 11.31$ cm.
6. **$1 : 1$.** Both triangles have base $CD$ and height equal to the
   distance between $AB$ and $CD$; each is half the parallelogram.
7. - area$(\triangle PQR)$ = area$(\triangle PSR)$ — the diagonal $PR$ halves the parallelogram
   - these triangles share the base $PR$, so $Q$ and $S$ are at equal heights above $PR$
   - $\triangle PQO$ and $\triangle PSO$ share the base $PO$ and have those equal heights
   - so area$(\triangle PSO)$ = area$(\triangle PQO)$
8. Let $P$, $Q$, $R$, $S$ be the midpoints of $AB$, $BC$, $CD$, $DA$.
   - in $\triangle ABD$, $DP$ is a median, so area$(\triangle APD) = \frac{1}{2}$ area$(\triangle ABD)$
   - in $\triangle APD$, $PS$ is a median, so area$(\triangle APS) = \frac{1}{2}$ area$(\triangle APD) = \frac{1}{4}$ area$(\triangle ABD)$
   - in the same way area$(\triangle CRQ) = \frac{1}{4}$ area$(\triangle CDB)$; $\triangle ABD$ and $\triangle CDB$ make up $ABCD$, so the two corners at $A$ and $C$ together are $\frac{1}{4}$ area$(ABCD)$
   - the corners at $B$ and $D$ together are $\frac{1}{4}$ area$(ABCD)$ too, using the diagonal $AC$
   - so $PQRS$ is $1 - \frac{1}{4} - \frac{1}{4} = \frac{1}{2}$ of $ABCD$
9. - area$(\triangle ABD)$ = area$(\triangle ACD)$ — $AD$ is a median of $\triangle ABC$
   - area$(\triangle PBD)$ = area$(\triangle PCD)$ — $PD$ is a median of $\triangle PBC$
   - subtract: area$(\triangle ABP)$ = area$(\triangle ACP)$
10. **$1 : 1$.** With side $s$, $\triangle PAB$ and $\triangle PCD$ have base $s$
    and heights that add up to $s$, so together they have area
    $\frac{1}{2}s \times s$, half the square. The other two make the other half.
11. - area$(\triangle DPQ)$ = area$(\triangle DPC)$ — same base $PD$, and $Q$, $C$ lie on a line parallel to $PD$
    - area$(\triangle BPQ)$ = area$(\triangle BPD)$ + area$(\triangle DPQ)$ = area$(\triangle BPD)$ + area$(\triangle DPC)$ = area$(\triangle BDC)$
    - $CD$ is a median of $\triangle ABC$, so area$(\triangle BDC) = \frac{1}{2}$ area$(\triangle ABC)$

## 6.10 Area of a Circle

### Think and Reflect

**Answers will vary.** Practical reasons: a circle encloses the most area for
a given length of wall or fence; a round shape has no corners to weaken or
wear; a wheel or a round pot is the same in every direction. Other reasons:
circles appear in nature — the sun, the full moon, ripples — and in art,
worship and games.

### Exercise Set 6.3

1. $\frac{60}{360} \times \frac{22}{7} \times 7^2 = \frac{154}{6} = \frac{77}{3} \approx 25.67$ cm$^2$.
2. $2 \times \frac{22}{7} \times r = 44$ gives $r = 7$ cm; the quadrant is
   $\frac{1}{4} \times \frac{22}{7} \times 49 = 38.5$ cm$^2$.
3. In $10$ minutes the hand turns $\frac{10}{60} \times 360^\circ = 60^\circ$:
   $\frac{60}{360} \times \frac{22}{7} \times 7^2 = \frac{77}{3} \approx 25.67$ cm$^2$.
4. - (i) $\frac{90}{360} \times 3.14 \times 10^2 = 78.5$ cm$^2$
   - (ii) $\frac{270}{360} \times 3.14 \times 10^2 = 235.5$ cm$^2$
5. The sector is $\frac{60}{360} \times 3.14 \times 15^2 = 117.75$ cm$^2$. The
   chord and the radii make an equilateral triangle of side $15$ cm, with area
   $\frac{\sqrt{3}}{4} \times 15^2 \approx \frac{1.73}{4} \times 225 = 97.3125$ cm$^2$.
   - minor segment: $117.75 - 97.3125 = 20.4375 \approx 20.44$ cm$^2$
   - major segment: $3.14 \times 225 - 20.4375 = 706.5 - 20.4375 = 686.0625 \approx 686.06$ cm$^2$
6. Each wiper sweeps $\frac{120}{360} \times \frac{22}{7} \times 28^2 = \frac{2464}{3}$ cm$^2$;
   the two together clean $\frac{4928}{3} \approx 1642.67$ cm$^2$.
7. - the sector is $\frac{60}{360} \times \pi r^2 = \frac{\pi r^2}{6}$
   - the chord and radii make an equilateral triangle of side $r$, area $\frac{\sqrt{3}}{4}r^2$
   - the segment is $\frac{\pi r^2}{6} - \frac{\sqrt{3}}{4}r^2 = r^2\left(\frac{\pi}{6} - \frac{\sqrt{3}}{4}\right)$
8. - each side subtends $120^\circ$ at the centre; the perpendicular from the centre to a side is $\frac{r}{2}$, so half a side is $\sqrt{r^2 - \frac{r^2}{4}} = \frac{\sqrt{3}}{2}r$ and a side is $\sqrt{3}r$
   - area of the triangle $= \frac{\sqrt{3}}{4}(\sqrt{3}r)^2 = \frac{3\sqrt{3}}{4}r^2$
   - ratio $= \frac{3\sqrt{3}}{4}r^2 \div \pi r^2 = \frac{3\sqrt{3}}{4\pi} \approx 0.413$
9. - the diagonals of the square are diameters, $2r$, and cross at right angles
   - area of the square $= \frac{1}{2} \times 2r \times 2r = 2r^2$
   - ratio $= \frac{2r^2}{\pi r^2} = \frac{2}{\pi} \approx 0.637$
10. - the hexagon is six equilateral triangles of side $r$, area $6 \times \frac{\sqrt{3}}{4}r^2 = \frac{3\sqrt{3}}{2}r^2$
    - ratio $= \frac{3\sqrt{3}}{2\pi} \approx 0.827$
    - it is exactly twice Question 8's answer: joining alternate vertices of the hexagon gives the inscribed equilateral triangle, and the three triangles cut off outside it together have the same area as the triangle, so the hexagon is twice the triangle

## End-of-Chapter Exercises

1. **What the drawings must show.** For $(a + b)(a - b) = a^2 - b^2$: a square
   of side $a$ with a square of side $b$ cut from one corner; the L-shape left
   is cut into two rectangles, $a \times (a - b)$ and $b \times (a - b)$, which
   join into one rectangle $(a + b) \times (a - b)$. For
   $(a + b + c)^2$: a square of side $a + b + c$, each side split into $a$, $b$,
   $c$, making three squares $a^2$, $b^2$, $c^2$ on the diagonal and six
   rectangles, two each of $ab$, $bc$ and $ca$.
2. The base is $40 - 2 \times 15 = 10$ cm; the height is
   $\sqrt{15^2 - 5^2} = \sqrt{200} = 10\sqrt{2}$ cm; the area is
   $\frac{1}{2} \times 10 \times 10\sqrt{2} = 50\sqrt{2} \approx 70.71$ cm$^2$.
3. The height is $\frac{2 \times 60}{10} = 12$ cm, and half the base is $5$ cm, so
   each equal side is $\sqrt{12^2 + 5^2} = 13$ cm.
4. The other side at the right angle is $\frac{2 \times 54}{12} = 9$ cm, the
   hypotenuse is $\sqrt{12^2 + 9^2} = 15$ cm, and the perimeter is
   $12 + 9 + 15 = 36$ cm.
5. The sides are $10$, $15$ and $20$ cm, and $s = 22.5$:
   $\sqrt{22.5 \times 12.5 \times 7.5 \times 2.5} = \frac{75\sqrt{15}}{4} \approx 72.62$ cm$^2$.
6. $7^2 + 24^2 = 625 = 25^2$, so the triangle is right-angled and its area is
   $\frac{1}{2} \times 7 \times 24 = 84$ cm$^2$. By Heron's formula, $s = 28$ and
   $\sqrt{28 \times 21 \times 4 \times 3} = \sqrt{7056} = 84$ cm$^2$.
7. $100 \times \frac{22}{7} \times 60 = \frac{132000}{7} \approx 18857.14$ cm, about $188.57$ m.
8. $2 \times \frac{22}{7} \times r = 66$ gives $r = 10.5$ cm; the quadrant is
   $\frac{1}{4} \times \frac{22}{7} \times 10.5^2 = 86.625$ cm$^2$.
9. One turn: $2 \times \frac{22}{7} \times 28 = 176$ cm. In $1$ km $= 100\,000$ cm,
   $100\,000 \div 176 = 568.18\ldots$: about $568$ turns.
10. **Yes.** If the sides are $x$ and $y$, then $x + y$ is half the perimeter
    and $xy$ is the area, so both are fixed. The two numbers with a given sum
    and product are fixed too: $(x - y)^2 = (x + y)^2 - 4xy$ fixes $x - y$.
    So the two rectangles have the same sides, and are congruent.
11. - a line through one end of the top side, parallel to a slanting side, cuts the trapezium into a parallelogram (base $a$, height $h$) and a triangle (base $b - a$, height $h$)
    - area $= ah + \frac{1}{2}(b - a)h = \frac{1}{2}(a + b)h$
12. - a diagonal cuts the trapezium into two triangles, one on the side $a$ and one on the side $b$, both of height $h$
    - area $= \frac{1}{2}ah + \frac{1}{2}bh = \frac{1}{2}(a + b)h$
13. Turn a copy through half a turn and put it beside the original, the
    slanting sides together: the parallel sides line up into two sides of
    length $a + b$, and the figure is a parallelogram of base $a + b$ and height
    $h$. The trapezium is half of it: $\frac{1}{2}(a + b)h$.
14. Let the kite be $ABCD$ with $AB = AD$ and $CB = CD$, and diagonals $AC = d_1$
    and $BD = d_2$, which cross at right angles at $O$, with $BO = OD$.
    - (i) algebra: $\triangle ABC$ and $\triangle ADC$ each have base $d_1$ and height $\frac{d_2}{2}$, so the area is $2 \times \frac{1}{2} \times d_1 \times \frac{d_2}{2} = \frac{1}{2}d_1 d_2$
    - (ii) geometry: the kite fits inside the rectangle with sides $d_1$ and $d_2$ whose sides pass through its vertices; the four triangles of the kite are each half of one of the four rectangles made by the diagonals, so the kite is half the rectangle, $\frac{1}{2}d_1 d_2$
15. - (i) Area $4ab$ against $ab$. **Yes**: four copies fit, two by two.
    - (ii) Heron: $s$ doubles and each of $s - a$, $s - b$, $s - c$ doubles, so the
      product under the root is $16$ times as large and the area $4$ times.
      **Yes**: the lines joining the midpoints of the sides of $\triangle PQR$ cut
      it into four triangles, each with sides $a$, $b$, $c$.
    - (iii) Each factor triples, so the area is $\sqrt{81} = 9$ times. **Yes**:
      lines through the points that cut each side into three equal parts,
      parallel to the sides, cut $\triangle PQR$ into nine triangles with sides
      $a$, $b$, $c$.
16. - Fig. 6.43: with $T$ the area of $\triangle ABC$, area$(\triangle ABQ) = \frac{2}{3}T$
      and area$(\triangle AMP) = \frac{1}{2} \times \frac{1}{3}T = \frac{1}{6}T$; the shaded part is
      $\frac{2}{3}T - \frac{1}{6}T = \frac{1}{2}T$: **one half**.
    - Fig. 6.44: **one fifth**. Each of the four small triangles that touch the
      midpoints of the sides can be turned half a turn about that midpoint to
      complete a square the same size as the shaded one. The whole square is
      then five equal squares. (Check: with side $2$, the shaded square has side
      $\frac{2}{\sqrt{5}}$ and area $\frac{4}{5}$, a fifth of $4$.)
17. With circles of radius $r$: Fig. 6.45, $\frac{3\pi r^2}{6r \times 2r} = \frac{\pi}{4}$;
    Fig. 6.46, $\frac{4\pi r^2}{8r \times 2r} = \frac{\pi}{4}$. Both are
    $\frac{\pi}{4} \approx \frac{11}{14} \approx 0.79$.
18. Conjecture: the fraction is always $\frac{\pi}{4}$. For $n$ circles,
    $\frac{n\pi r^2}{2nr \times 2r} = \frac{\pi}{4}$, so $10$, $20$ and $50$ circles all
    give $\frac{\pi}{4}$.
19. Let each small rectangle be $L$ by $W$. The top row is $4L$ wide and the
    bottom row $5W$, so $4L = 5W$. The area is $9LW = 72$, so $LW = 8$ and
    $\frac{5}{4}W^2 = 8$, $W^2 = 6.4$, $W = \frac{4\sqrt{10}}{5} \approx 2.53$ cm and
    $L = \sqrt{10} \approx 3.16$ cm. The perimeter is
    $2(L + W) = \frac{18\sqrt{10}}{5} \approx 11.38$ cm.
20. $BP = QC$ and both triangles have the height of $A$ above $BC$, so their
    areas are equal. **Answers will vary** for the cutting; one way is the one
    given for the Think and Reflect in Section 6.8: both triangles become
    parallelograms with equal bases and heights, and those can be cut into each
    other.
21. Let the square have side $2t$.
    - the quarter circle has area $\frac{1}{4}\pi(2t)^2 = \pi t^2$
    - the two semicircles have total area $2 \times \frac{1}{2}\pi t^2 = \pi t^2$
    - the semicircles overlap in $A$, so the part of the quarter circle they cover is $\pi t^2 - A$; what is left is $B = \pi t^2 - (\pi t^2 - A) = A$
22. Each petal is bounded by two quarter circles of radius $1$.
    - perimeter: eight quarter circles, two whole circles: $4\pi$, which is $4 \times \frac{22}{7} = \frac{88}{7} \approx 12.57$ units
    - area: each petal is two quarter circles less two right-angled triangles, $2\left(\frac{\pi}{4} - \frac{1}{2}\right) = \frac{\pi}{2} - 1$, so the flower is $2\pi - 4$, which is $2 \times \frac{22}{7} - 4 = \frac{16}{7} \approx 2.29$ sq. units
23. - $OA \perp BC$ and $A$ is the midpoint of $BC$, so $BA = \frac{l}{2}$
    - $OB^2 = OA^2 + \frac{l^2}{4}$ — Baudhāyana–Pythagoras
    - ring $= \pi \cdot OB^2 - \pi \cdot OA^2 = \frac{\pi l^2}{4}$
24. Let the sides be $a$, $b$ and the hypotenuse $c$, and $T$ the triangle's area.
    - the semicircles on $a$ and $b$ together are $\frac{\pi}{8}(a^2 + b^2) = \frac{\pi}{8}c^2$, the semicircle on $c$
    - the semicircle on $c$ passes through the right-angled corner, and covers the triangle and the parts of the two small semicircles that are not $A$ or $B$
    - so $\frac{\pi}{8}c^2 = T + (\text{small semicircles} - A - B)$, which gives $A + B = T$, the area $C$
25. The common region is two segments, each cut off by the chord $CD$, which
    subtends $120^\circ$ at each centre:
    - each sector is $\frac{120}{360}\pi r^2 = \frac{\pi r^2}{3}$, and each triangle $ACD$, $BCD$ is $\frac{\sqrt{3}}{4}r^2$
    - the region is $2\left(\frac{\pi r^2}{3} - \frac{\sqrt{3}}{4}r^2\right) = \left(\frac{2\pi}{3} - \frac{\sqrt{3}}{2}\right)r^2 \approx 1.23r^2$
26. Let the rectangle be $w$ wide and $h$ high, with $O$ its bottom left corner.
    Triangle $C$ has an upright side of length $p$, which is $x$ from the left
    side of the rectangle, and a level side of length $q$, which is $k$ above the
    bottom; its level side runs to the right side, so $x + q = w$, and its
    upright side runs to the top, so $k + p = h$.
    - $C = \frac{1}{2}pq$
    - triangle $A$ has the upright side $p$ as its base and height $x$, so $A = \frac{1}{2}px$ and $A + C = \frac{1}{2}p(x + q) = \frac{1}{2}pw$
    - triangle $B$ has the level side $q$ as its base and height $k$, so $B = \frac{1}{2}qk$ and $B + C = \frac{1}{2}q(k + p) = \frac{1}{2}qh$
    - so $\frac{2(A + C)(B + C)}{C} = \frac{2 \times \frac{1}{2}pw \times \frac{1}{2}qh}{\frac{1}{2}pq} = wh$, the area of the rectangle
27. Let the radius of the quarter circle be $r$, so $AB = \sqrt{2}r$.
    - the semicircle on $AB$ has area $\frac{1}{2}\pi\left(\frac{\sqrt{2}r}{2}\right)^2 = \frac{\pi r^2}{4}$
    - the segment $AFB$ is the quarter circle less $\triangle AOB$: $\frac{\pi r^2}{4} - \frac{r^2}{2}$
    - the crescent is the semicircle less the segment: $\frac{r^2}{2}$, which is the area of $\triangle AOB$

---

## Beyond the Book

### Stage 1 · Using What You Know

Each question is explained in the running text beneath it. The values it
reaches: Q1 the circle encloses $132$ cm$^2$ more ($616$ against $484$);
Q2 the sector has area $75$ cm$^2$; Q3 the shortest altitude is $12$ cm (area
$126$ cm$^2$); Q4 the area is $1764$ cm$^2$; Q5 the cut has radius
$7\sqrt{2} \approx 9.9$ cm.

### Stage 2 · Solved Examples

The examples, in examination formats. Each is worked in full on its page;
these are the keys.

1. (a) 440 m *(single correct)*
2. (b) $60^\circ$ *(single correct)*
3. (c) 308 cm *(single correct)*
4. (d) 12 cm$^2$ *(single correct)*
5. (a) 21% *(single correct)*
6. (b) $4\pi$ cm *(single correct)*
7. (a), (b), (d) *(multiple correct)*
8. (a), (c) *(multiple correct)*
9. (a), (b), (c) *(multiple correct)*
10. (a), (c), (d) *(multiple correct)*
11. 56 *(numerical answer)*
12. 36 *(numerical answer)*
13. 28 *(numerical answer)*
14. (b) P–2, Q–4, R–3, S–1 *(matching)*
15. (c) P–3, Q–4, R–1, S–2 *(matching)*

### Stage 3 · Practice — the key, as the key prints it

1 (d) &nbsp; 2 (b) &nbsp; 3 (c) &nbsp; 4 (a) &nbsp; 5 (d) &nbsp; 6 (a) &nbsp; 7 (b) &nbsp; 8 (c) &nbsp; 9 (a) &nbsp; 10 (d) &nbsp; 11 (c) &nbsp; 12 (a) &nbsp; 13 (b) &nbsp; 14 (c) &nbsp; 15 (d) &nbsp; 16 (a) &nbsp; 17 (c) &nbsp; 18 (d) &nbsp; 19 (b)

### The working for each

1. $\frac{22}{7}d = 220$: $70$ cm.
2. $\frac{45}{360} \times 2 \times \frac{22}{7} \times 28 = 22$: $22$ cm.
3. $\frac{40}{360} \times \frac{22}{7} \times 21^2 = 154$: $154$ cm$^2$.
4. $20^2 + 21^2 = 841 = 29^2$, so the area is $\frac{1}{2} \times 20 \times 21 = 210$: $210$ cm$^2$.
5. $\pi(3r)^2 = 9\pi r^2$: $9$ times.
6. The radii are in the ratio $\sqrt{16} : \sqrt{9} = 4 : 3$, and so are the circumferences.
7. $50 \div 2 = 25$: $25$ cm$^2$.
8. $12 \times 7 = 84$: $84$ cm$^2$.
9. $\frac{1}{2}(7 + 8 + 9) = 12$: $12$ cm.
10. Āryabhaṭa, in $499$ CE.
11. $r = 176 \div \left(2 \times \frac{22}{7}\right) = 28$ and $\frac{22}{7} \times 28^2 = 2464$: $2464$ cm$^2$.
12. $7^2 + 24^2 = 15^2 + 20^2 = 625$, so both halves are right-angled on the diameter: $\frac{1}{2} \times 7 \times 24 + \frac{1}{2} \times 15 \times 20 = 84 + 150 = 234$; Brahmagupta: $s = 33$, $\sqrt{26 \times 18 \times 13 \times 9} = \sqrt{54756} = 234$: $234$ cm$^2$.
13. $\frac{22}{7} \times 35 + 70 = 110 + 70 = 180$: $180$ cm.
14. (c): $\pi$ is irrational, so it is not equal to any fraction.
15. $\frac{\sqrt{3}}{4} \times (4\sqrt{3})^2 = \frac{\sqrt{3}}{4} \times 48 = 12\sqrt{3}$: $12\sqrt{3}$ cm$^2$.
16. (a): $s = 30$ and $\sqrt{30 \times 24 \times 5 \times 1} = \sqrt{3600} = 60$; Heron's formula is what gives it.
17. (c): A is the theorem of Section 6.8; R is false, since the two triangles are in general not congruent.
18. (d): A is false, since $\frac{22}{7}$ is only an approximation; R is true.
19. (b): A is true, since $\frac{22}{7} \times 21^2 = 1386$; R is true but does not give the area.
20. $\frac{22}{7}r^2 = 5544$ gives $r^2 = 1764$: $42$ cm.
21. $\frac{72}{360} \times 2 \times \frac{22}{7} \times 35 = 44$: $44$ cm.
22. $\frac{\sqrt{3}}{4} \times 8^2 = 16\sqrt{3}$: $16\sqrt{3}$ cm$^2$.
23. A quadrant of radius $14$ m: $\frac{1}{4} \times \frac{22}{7} \times 14^2 = 154$: $154$ m$^2$.
24. $s = 42$ and $\sqrt{42 \times 16 \times 14 \times 12} = \sqrt{112896} = 336$: $336$ m$^2$, and the cost is $336 \times 5 = 1680$ rupees.
25. The outer radius is $77$ m; $2 \times \frac{22}{7} \times 7 = 44$ m longer; the area is $\frac{22}{7}(77^2 - 70^2) = 3234$ m$^2$.
26. $AC = 41$; $\triangle ABC$ is $180$ cm$^2$ and $\triangle ACD$, with $s = 42$, is $\sqrt{42 \times 1 \times 14 \times 27} = 126$ cm$^2$: $306$ cm$^2$.
27. $\triangle ADC$ and $\triangle BDC$ have the same base $DC$ and the same height, so equal areas; take away $\triangle ODC$ from both.
28. Sector $150.72$ cm$^2$, triangle $36\sqrt{3} \approx 36 \times 1.73 = 62.28$ cm$^2$: the segment is $88.44$ cm$^2$.
29. $s = 21$, area $84$ cm$^2$; $r = 4$ cm; $R = \frac{2730}{336} = 8.125$ cm.
30. (a) $420$ m (b) $8.8$ m (c) $10850$ m$^2$ (d) $4.4$ m
31. (a) $150$ m (b) $3000$ m$^2$ (c) $50^2 + 120^2 = 130^2$, so $\frac{1}{2} \times 50 \times 120 = 3000$ m$^2$ (d) $2384$ m$^2$
