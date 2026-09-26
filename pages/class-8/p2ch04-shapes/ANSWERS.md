# Class 8 · Mathematics II · Chapter 4 — Exploring Some Geometric Themes

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except By the Book's and Beyond the Book's own key.

Numbered by set — *Exercise Set 4.2, Q6* — so it can be used beside the book
without a contents page. **The values below are re-derived by
`check-numbers.mjs` beside this file.** A question renumbered in the book and
not here is how this goes wrong.

Where a question asks the reader to draw or choose, the answer says what the
drawing must show, or gives one worked instance under *answers will vary*.

---

## 4.1 Shapes Inside Shapes

### Think and Reflect

1. *Answers will vary.* For example: a cauliflower floret, a broom made of
   twigs, the branching cracks in dry mud, a rangoli with small copies of its
   central motif.
2. A branch stops after a few levels, when the twigs are too small to split
   again. A shape that follows a rule for ever never stops: however closely
   you look, there is more detail of the same kind.

## 4.2 The Sierpiński Carpet

### Think and Reflect

1. Each square left makes **one** new hole at the next step, but it also
   becomes **eight** squares. So the squares are multiplied by 8 at every
   step, while the holes only gain one for each square.
2. Each square leaves $16 - 4 = 12$ squares, so step 2 has
   $12 \times 12 = 144$ squares.

## 4.3 The Sierpiński Triangle

### Think and Reflect

1. The side is halved at each step: $32 \div 2 \div 2 \div 2 = 4$ cm.
2. **13 holes.** Each triangle left makes one hole at the next step:
   $1 + 3 + 9 = 13$.

## 4.4 The Koch Snowflake

### Think and Reflect

1. The perimeter would be multiplied by $4 \times \tfrac14 = 1$ at every
   step, so it would **stay the same**.
2. **Yes.** Every bump in Step 2 is inside the circle round Step 0, so the
   area is always less than the area of that circle.

### Exercise Set 4.1

1. A drawing. On a 9 by 9 square: step 1 removes the middle 3 by 3 square
   (8 squares left, 1 hole); step 2 removes the middle 1 by 1 square of each
   of those 8 (64 squares left, $1 + 8 = 9$ holes). The triangle: a full
   triangle; the middle triangle joining the midpoints removed, leaving 3;
   then the middle of each of those removed, leaving 9.
2. $R_4 = 8^4 = 4096$ and $H_4 = 1 + 8 + 64 + 512 = 585$.
   At step 5, $H_5 = H_4 + R_4 = 585 + 4096 = 4681$ holes.
3. $3^5 = 243$ and $3^6 = 729$, so **step 6**. The holes then number
   $1 + 3 + 9 + 27 + 81 + 243 = 364$.
4. Carpet: $\left(\tfrac89\right)^2 = \tfrac{64}{81} \approx 0.79$.
   Triangle: $\left(\tfrac34\right)^2 = \tfrac{9}{16} \approx 0.56$.
   **The triangle's is smaller**, because each step removes a quarter of
   what is left, and the carpet removes only a ninth.
5. $S_4 = 3 \times 4^4 = 768$ sides, each $81 \div 81 = 1$ cm long, so the
   perimeter is **768 cm**.
6. **Step 6.** The perimeter is the start multiplied by
   $\left(\tfrac43\right)^n$. $\left(\tfrac43\right)^5 = \tfrac{1024}{243}
   \approx 4.21$ and $\left(\tfrac43\right)^6 = \tfrac{4096}{729} \approx 5.62$.

## 4.5 Fractals People Built

### Think and Reflect

1. The detail comes from applying the rule **to its own result**, again and
   again. Each step starts from everything the last step made, so the number
   of pieces the rule works on multiplies at every step (8, 64, 512, … for
   the carpet).
2. *Answers will vary.* For example: cut the square into four and remove the
   top-right quarter; then do the same to each of the three quarters left.
   Step 1 has 3 squares, step 2 has 9.

## 4.6 Solids and Their Flat Parts

### Think and Reflect

1. A pyramid on an $n$-sided base has $2n$ edges, which is always even.
2. **20: yes**, a prism with 10-sided ends ($2n = 20$). **21: no**, because
   a prism has $2n$ vertices, an even number.

## 4.7 Unfolding a Solid

### Think and Reflect

1. **Four.** Five in a line would put two squares on the same face.
2. Think of the middle square as the bottom of the cube and its four
   neighbours as the walls. The sixth square is the lid, and it must join the
   free outer edge of a wall: **above the top square**, or on the **outer side
   of the left or the right square** (as well as below the column, where
   Fig. 4.5 puts it). Joined to the side of the third square, it would land on
   a wall already there.

## 4.8 The Shortest Way Across a Box

### Think and Reflect

1. A route along three edges is a path on the net made of straight pieces
   with corners in it. The straight line between the same two points on the
   net is shorter than any path with a corner.
2. **Shorter.** It goes straight through the box:
   $\sqrt{81 + 25 + 9} = \sqrt{115} \approx 10.7$ cm, against about 12.0 cm.

### Exercise Set 4.2

1. Faces, edges, vertices:
   - (i) prism with 8-sided ends: $10$ faces, $24$ edges, $16$ vertices.
   - (ii) pentagonal pyramid: $6$ faces, $10$ edges, $6$ vertices.
   - (iii) prism with 11-sided ends: $13$ faces, $33$ edges, $22$ vertices.
2. Hexagonal pyramid: $7 + 7 - 12 = 2$. Pentagonal prism: $7 + 10 - 15 = 2$.
   Tetrahedron: $4 + 4 - 6 = 2$.
3. Vertices $= 2 + 16 - 9 = 9$. An octagonal pyramid has these counts.
4. A drawing; answers will vary. A net that folds: a column of four with one
   square on the left of the top square and one on the right of the bottom
   square. One that does not: **a row of six squares** — four of them wrap
   into a tube, the other two land on faces already covered, and both ends of
   the tube stay open.
5. A drawing. The pentagonal prism's net has **2 pentagons and 5
   rectangles**; the tetrahedron's net has **4 triangles**.
6. The three unfoldings:
   - $10$ and $6 + 4$: $\sqrt{100 + 100} = \sqrt{200} \approx 14.1$ cm
   - $6$ and $10 + 4$: $\sqrt{36 + 196} = \sqrt{232} \approx 15.2$ cm
   - $4$ and $10 + 6$: $\sqrt{16 + 256} = \sqrt{272} \approx 16.5$ cm

   **The first is shortest, about 14.1 cm.**
7. $7$ against $5 + 3 = 8$: $\sqrt{49 + 64} = \sqrt{113} \approx 10.6$ m.
   The others give $\sqrt{125} \approx 11.2$ m and $\sqrt{153} \approx 12.4$ m.
   Along three edges is $7 + 5 + 3 = 15$ m, so the route is about
   **4.4 m shorter**.

## 4.9 Three Views

### Think and Reflect

1. **A cube.**
2. Put the new cube on top of the right-hand cube. The top view stays two
   squares; the front view becomes a 2 by 2 square; the side view does not
   change.

## 4.10 Drawing a Solid Whole

### Think and Reflect

1. A **rhombus**, with angles of $60^\circ$ and $120^\circ$.
2. An **oval** (an ellipse).

### Exercise Set 4.3

1. Front view: a triangle. Side view: a triangle. Top view: a square with
   its two diagonals (the slant edges seen from above).
2. **A cone** standing on its base.
3. In a row: front view 5 squares in a row, top view 5 squares in a row,
   side view 1 square. After the move: front view a row of 4 with one square
   on the left end (5 squares), top view a row of 4, side view a column of 2.
   **All three views change.**
4. A drawing showing three faces of the cuboid. **10** cubes can be seen
   (the $2 \times 1 \times 1$ block at the hidden corner cannot), and there
   are $3 \times 2 \times 2 = 12$ altogether.
5. **No.** Answers will vary. A cube of side 2 cm and an upright cylinder
   2 cm across and 2 cm high both have a square for the front view and for
   the side view. The top view tells them apart — a square for the cube, a
   circle for the cylinder.

---

## By the Book

Marks: very short answer 2, short answer 3, long answer 5, assertion and
reason 1, case-based 4, objective 1.

### Very short answer

1. $8$ faces, $18$ edges, $12$ vertices.
2. $81 \div 27 = 3$ cm.
3. No. A prism has $3n$ edges, a multiple of 3, and 25 is not.
4. $\left(\tfrac34\right)^3 = \tfrac{27}{64}$.
5. The base has $11 - 1 = 10$ sides; $2 \times 10 = 20$ edges.
6. $768 \div 3 = 256 = 4^4$: step 4.
7. $7 + 10 - 2 = 15$ edges; a pentagonal prism.
8. $6 \times 49 = 294$ cm².
9. Front view a triangle, top view a circle. From the front the sloping sides
   show; from above only the round base shows.
10. $\sqrt{9 + 36} = \sqrt{45} \approx 6.7$ cm.

### Short answer

11. Faces $n + 2$, vertices $2n$, edges $3n$: $(n + 2) + 2n - 3n = 2$.
12. $8^n$ squares, each $\tfrac{1}{9^n}$ of the area:
    $\tfrac{8^n}{9^n} = \left(\tfrac89\right)^n$. From side 36:
    $1296 \times \tfrac{64}{81} = 1024$ cm².
13. **Step 2** is wrong: each step removes a quarter of what is left, not of
    the first card. Area left $= 128 \times \tfrac{27}{64} = 54$ cm².
14. Step 2 has 48 sides of 3 cm: **144 cm**. It began at 81 cm, so it has
    grown by **63 cm**.
15. Faces $= 2 + 18 - 12 = 8$. A prism with $3n = 18$ has $n = 6$ and 12
    vertices, which fits; a pyramid with $2n = 18$ would have 10 vertices.
    **A hexagonal prism.**
16. $96 + 120 + 80 = 296$ cm².
17. $15$ cm, $\sqrt{261} \approx 16.2$ cm and $\sqrt{333} \approx 18.2$ cm;
    the shortest is **15 cm**.
18. **6** hidden; $60 - 24 = $ **36** seen.
19. **4 cubes.** Side view: 2 squares side by side.
20. **No.** The hole counts are 0, 1, 9, 73, 585, …, and 100 falls between
    73 and 585.

### Long answer

21. $16$ against $12$: $\sqrt{400} = 20$ cm; $7$ against $21$:
    $\sqrt{490} \approx 22.1$ cm; $5$ against $23$: $\sqrt{554} \approx 23.5$ cm.
    Shortest **20 cm**; along three edges 28 cm, so **8 cm shorter**.
22. $8H_4 - H_4 = 4096 - 1$, so $7H_4 = 4095$ and $H_4 = 585$. In the same way
    $7H_6 = 262144 - 1$, so $H_6 = 37449$.
23. $3n = 36$, $n = 12$; the prism uses 24 balls. The pyramid's base has 14
    sides: **28 straws, 15 balls**. Balls in all: **39**. Checks:
    $14 + 24 - 36 = 2$ and $15 + 15 - 28 = 2$.
24. $324$ cm, $432$ cm, $576$ cm. Cost at step 3: $5.76 \times 10 =$
    **₹57.60**. Step 4 needs 768 cm and step 5 needs 1024 cm: **step 5**.
25. Step 2: 9, 16 cm, $\tfrac{9}{16}$. Step 3: 27, 8 cm, $\tfrac{27}{64}$.
    The side is 1 cm at step 6 and $\tfrac12$ cm at step 7: **step 7, with
    2187 triangles**.
26. $800$ cm²; with 10% extra **880 cm²**; for 50 boxes $44000$ cm² $=$
    **4.4 m²**.
27. **10 cubes.** Front: a staircase of 10 squares; top: a row of 4; side: a
    column of 4. Two deep: **20 cubes**; the front view is unchanged, the top
    and side views become 8 squares each.
28. $6 \times 3 \div 2 = 9$ edges; vertices $= 2 - 6 + 9 = 5$. Two
    triangular pyramids joined along their bases.
29. Holes of side 60 cm (one) and 20 cm (eight): $3600 + 3200 = 6800$ cm².
    Check: $32400 \times \tfrac{17}{81} = 6800$. Cost **₹136**.
30. 3 faces: 8 (the corners); 2 faces: 12 (the edges); 1 face: 6 (the
    faces); 0 faces: 1. $8 + 12 + 6 + 1 = 27$. For $4 \times 4 \times 4$:
    8, 24, 24 and 8, which add to 64.

### Assertion and reason

31. (a) 32. (d) 33. (b) 34. (c) 35. (a)

### Case-based questions

36. (i) 3, 512, 2 cm (ii) 9 (iii) $2304$ cm²; $\tfrac{17}{81}$ white.
37. (i) 10 cm (ii) 25 cm (iii) 17 cm, which is 6 cm shorter than 23 cm.
38. (i) 15 straws, 10 beads (ii) 5 faces (iii) A prism, yes: 9-sided ends,
    18 beads. A pyramid, no: a pyramid always has an even number of edges.
39. (i) 216 cm (ii) 3, 192, 2 cm (iii) 384 cm of lace, **₹96**.
40. (i) 10 (ii) 6 squares (iii) columns of 2 and 3, 5 squares; **8** more
    cubes.

### Objective questions

41 (b), 42 (a), 43 (c), 44 (b), 45 (d), 46 (a), 47 (c), 48 (d), 49 (b),
50 (c).

---

## Beyond the Book

### Tried and explained (no head in the book)

Each of the eight questions is answered in the running text that follows it
on the page: (1) side 1 cm, 32768 squares; (2) step 3; (3) the prism 12
faces, the pyramid 16; (4) $\sqrt{125} \approx 11.2$ cm; (5) front 3 cm by
1 cm, top 3 cm by 2 cm, side 2 cm by 1 cm; (6) $\tfrac{243}{1024} \approx
0.24$, more than a tenth; (7) 27 cubes, 1 hidden; (8) 52 cm².

### Solved examples

1. (b) 7 *(single correct)*
2. (b) an octagon *(single correct)*
3. (a), (b), (c) *(more than one correct)*
4. (a), (c), (d) *(more than one correct)*
5. 15 *(numerical answer)*
6. 5184 *(numerical answer)*
7. (c) P–3, Q–4, R–1, S–2 *(matching)*
8. (b) P–2, Q–1, R–4, S–3 *(matching)*
9. (i) (b) 27; (ii) 8; (iii) 40 *(paragraph-based)*
10. (i) (a); (ii) 12.8; (iii) 208 *(paragraph-based)*

### Practice

1 (b), 2 (a), 3 (c), 4 (d), 5 (a), (b), 6 (a), (b), (d), 7 (a), (b), (d),
8 (a), (c), (d), 9 22, 10 1536, 11 37, 12 (a), 13 (c),
14 (i) (a) (ii) 512 (iii) 217, 15 (i) (b) (ii) 180 (iii) 69.

1. $\left(\tfrac89\right)^5 \approx 0.55$ and $\left(\tfrac89\right)^6 \approx 0.49$.
2. Prism: 10-sided ends, 30 edges. Pyramid: 11-sided base, 22 edges.
3. $\left(\tfrac43\right)^4 = \tfrac{256}{81}$.
4. Each of the 12 edges has $5 - 2 = 3$ such cubes: 36.
9. $3n - (n + 2) = 20$, $n = 11$, $2n = 22$.
10. $162 \div 2 = 81 = 3^4$, step 4: $768 \times 2 = 1536$.
11. $64 - 27 = 37$.
