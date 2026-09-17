# Class 8 · Mathematics II · Chapter 4 — Taking a Shape Apart

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set — *Exercise Set 4.2, Q6* — so it can be used beside the book
without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file.** A question renumbered in the book and
not here is how this goes wrong.

Where a question asks the reader to draw or choose, the answer says what the
drawing must show and gives one worked instance under *answers will vary*.

---

## 4.2–4.4 The Sierpiński Carpet, Triangle and Koch Snowflake

### Exercise Set 4.1

1. A drawing. It must show:
   - **Carpet**, steps 0, 1, 2: a full square; the square with its middle
     ninth removed (8 squares left, 1 hole); then each of those 8 with its
     own middle ninth removed (64 squares left, $1 + 8 = 9$ holes). On
     squared paper a 9 by 9 square works: the step 1 hole is 3 by 3 and the
     step 2 holes are 1 by 1.
   - **Triangle**, steps 0, 1, 2: a full triangle; the middle triangle
     (joining the midpoints) removed, leaving 3; then the middle of each of
     those removed, leaving 9.

2. $R_4 = 8^4 = 4096$ and $H_4 = 1 + 8 + 64 + 512 = 585$.
   At step 5, $H_5 = H_4 + R_4 = 585 + 4096 = 4681$ holes.

3. $3^4 = 81$ triangles remain. Each remaining triangle makes one hole at the
   next step, so the holes are $1 + 3 + 9 + 27 = 40$.

4. Carpet: $\left(\tfrac89\right)^3 = \tfrac{512}{729} \approx 0.70$.
   Triangle: $\left(\tfrac34\right)^3 = \tfrac{27}{64} \approx 0.42$.
   **The triangle shrinks faster**, because each step throws away a quarter
   of what is left, and the carpet throws away only a ninth.

5. $S_4 = 3 \times 4^4 = 768$ sides. Each side is $\tfrac{1}{81}$ cm, so the
   perimeter is $768 \div 81 = \tfrac{256}{27} \approx 9.48$ cm, which is
   $3 \times \left(\tfrac43\right)^4$.

6. **Step 9.** The perimeter is the start multiplied by
   $\left(\tfrac43\right)^n$. $\left(\tfrac43\right)^8 = \tfrac{65536}{6561}
   \approx 9.99$, just short of 10, and $\left(\tfrac43\right)^9 =
   \tfrac{262144}{19683} \approx 13.32$.

## 4.5 Fractals People Built

### Think and Reflect

The detail comes from applying the rule **to its own output**, again and
again. Each step starts from everything the last step made, so the number of
pieces the rule works on multiplies at every step (8, 64, 512, … for the
carpet). A sentence-long rule, repeated, makes more and more pieces, each a
smaller copy of the whole.

## 4.6–4.8 Solids, Nets and the Shortest Way Across a Box

### Exercise Set 4.2

1. Faces, edges, vertices:
   - (a) pentagonal prism: $5 + 2 = 7$ faces, $3 \times 5 = 15$ edges,
     $2 \times 5 = 10$ vertices.
   - (b) hexagonal pyramid: $6 + 1 = 7$ faces, $2 \times 6 = 12$ edges,
     $6 + 1 = 7$ vertices.
   - (c) prism with 12-sided ends: $12 + 2 = 14$ faces, $3 \times 12 = 36$
     edges, $2 \times 12 = 24$ vertices.

2. Cube: $6 + 8 - 12 = 2$. Triangular prism: $5 + 6 - 9 = 2$. Square
   pyramid: $5 + 5 - 8 = 2$.

3. Edges $= 8 + 12 - 2 = 18$. (A hexagonal prism is such a solid.)

4. A drawing; answers will vary. Two nets that fold: the cross of Fig. 4.5
   (a column of four with one square on each side of the second), and a
   column of four with one square on the left of the top square and one on
   the right of the bottom square. One that does not: **a straight row of six
   squares** — four of them wrap round into a tube, the other two land on
   faces already covered, and both ends of the tube are left open.

5. A drawing. The triangular prism's net has **2 triangles** (and 3
   rectangles); the square pyramid's net has **4 triangles** (and 1 square).

6. The three unfoldings:
   - $8$ and $6 + 4 = 10$: $\sqrt{64 + 100} = \sqrt{164} \approx 12.8$ cm
   - $8 + 6 = 14$ and $4$: $\sqrt{196 + 16} = \sqrt{212} \approx 14.6$ cm
   - $8 + 4 = 12$ and $6$: $\sqrt{144 + 36} = \sqrt{180} \approx 13.4$ cm

   **The first is shortest, about 12.8 cm** — the longest dimension set
   against the other two added together.

7. $6$ against $4 + 3 = 7$: $\sqrt{36 + 49} = \sqrt{85} \approx 9.2$ m. The
   other unfoldings give $\sqrt{100 + 9} = \sqrt{109} \approx 10.4$ m and
   $\sqrt{81 + 16} = \sqrt{97} \approx 9.8$ m. Along three edges is
   $6 + 4 + 3 = 13$ m, so the shortest route is about $13 - 9.2 = 3.8$ m
   shorter.

## 4.9–4.10 Three Views, and Drawing a Solid Whole

### Exercise Set 4.3

1. A drawing.
   - Standing upright: front view a **rectangle**, top view a **circle**,
     side view a **rectangle**.
   - Lying on its side, its axis running left to right: front view a
     **rectangle**, top view a **rectangle**, side view a **circle**.

2. **A cone** standing on its base. Answers will vary for the second: a
   cylinder standing upright, a sphere, or a hemisphere all have a circular
   top view.

3. In a row, left to right: front view a row of 4 squares, top view a row of
   4 squares, side view 1 square. In a column: front view a column of 4
   squares, top view 1 square, side view a column of 4 squares. **All three
   views change.**

4. A drawing on isometric paper showing three faces of the big cube, each
   made of 4 small squares. **7** small cubes can be seen (the one at the
   hidden back corner cannot), and there are $2 \times 2 \times 2 = 8$
   altogether.

5. A drawing. Along the length axis: 3 units along the length, 1 along the
   depth and 1 up. Along the depth axis: 3 units along the depth, 1 along the
   length and 1 up. The two drawings have the same edge lengths but point in
   different directions on the paper.

6. **No.** Answers will vary. A cube, and a triangular prism of the same
   size lying on a square face with its triangular ends facing left and
   right: both have a square for the front view and a square for the top
   view. The side view tells them apart — a square for the cube, a triangle
   for the prism.

---

## Beyond the Book

### Stage 1 · Using What You Know

Each of the eight questions is answered in the running text that follows it
on the page. The results, for reference: (1) side 1 cm, 32768 squares;
(2) step 3; (3) the prism 12 faces, the pyramid 16; (4) $\sqrt{125} \approx
11.2$ cm; (5) front 3 cm by 1 cm, top 3 cm by 2 cm, side 2 cm by 1 cm;
(6) $\tfrac{243}{1024} \approx 0.24$, more than a tenth; (7) 27 cubes, 1
hidden; (8) 52 cm².

### Stage 3 · Practice

Multiple choice and assertion–reason, as the key prints it:
1 (b), 2 (d), 3 (c), 4 (b), 5 (c), 6 (d), 7 (a), 8 (c), 9 (b), 10 (c),
11 (b), 12 (a), 13 (d), 14 (a), 15 (a), 16 (a), 17 (d), 18 (b), 19 (c).

The working for each:

1. A fractal.
2. $9 \div 3 \div 3 = 1$ cm.
3. $\tfrac89 \times \tfrac89 = \tfrac{64}{81}$.
4. $\left(\tfrac34\right)^5 = \tfrac{243}{1024} \approx 0.24$ and
   $\left(\tfrac34\right)^6 = \tfrac{729}{4096} \approx 0.18$: step 6.
5. $3 \times 4 = 12$.
6. $3 \times 4^3 = 192$.
7. $3n = 24$, so $n = 8$.
8. $2n = 16$, so $n = 8$ and there are $8 + 1 = 9$ faces.
9. $11 + 11 - 2 = 20$.
10. The prism has $7 + 2 = 9$ faces; a pyramid with 9 faces has an
    8-sided base.
11. $9$ against $4 + 3$: $\sqrt{81 + 49} = \sqrt{130}$.
12. $10$ against $10 + 1$: $\sqrt{100 + 121} = \sqrt{221}$.
13. A regular hexagon.
14. The lengths of its edges.
15. $\left(\tfrac43\right)^2 = \tfrac{16}{9} \approx 1.78$ and
    $\left(\tfrac43\right)^3 = \tfrac{64}{27} \approx 2.37$: step 3.
16. (a) $3^2 = 9$, and R is why.
17. (d) $20$ is not a multiple of 3, so A is false; R is true, since a prism
    has $3n$ edges.
18. (b) Both true, but the perimeter grows because it is multiplied by
    $\tfrac43$ each step; the number of sides alone does not explain it.
19. (c) Every edge is drawn at its true length, so A is true; the right
    angles come out as $60^\circ$ and $120^\circ$, so R is false.
20. $8$ faces, $14$ edges, $8$ vertices.
21. $\tfrac{1}{3^5} = \tfrac{1}{243}$.
22. A prism with nine-sided ends; $3 \times 9 = 27$ edges.
23. Side $135 \div 27 = 5$ cm; $8^3 = 512$ squares; area
    $512 \times 25 = 12800$ cm².
24. $2 + 16 - 10 = 8$ vertices. A prism with 10 faces has 24 edges and a
    pyramid with 10 faces has 18, so it is neither. (A square antiprism is
    such a solid.)
25. $40 + 48 + 30 = 118$ cm².
26. $\sqrt{144 + 81} = \sqrt{225} = 15$ cm. (Others: $\sqrt{289 + 16} =
    \sqrt{305}$, $\sqrt{256 + 25} = \sqrt{281}$.)
27. Step 1: 12 sides, 324 cm. Step 2: 48 sides, 432 cm. Step 3: 192 sides,
    576 cm. $576 > 2 \times 243 = 486$.
28. Prism: 8-sided ends, 24 edges, 16 vertices. Pyramid: 12-sided base,
    13 faces, 13 vertices. $10 + 16 - 24 = 2$ and $13 + 13 - 24 = 2$.
29. Front: 4 squares (a row of 3, one above the left). Top: 4 squares (a row
    of 3, one behind the right). Side from the right: 3 squares (two side by
    side, one above the front one). The fifth cube is hidden in the front
    view, and the fourth is hidden in the top view.
30. (a) step 3: 512 squares, side 3 cm (b) $64 \times 81 = 5184$ cm²
    (c) $\tfrac{17}{81}$.
31. (a) P: $\sqrt{100} = 10$ cm, Q: $\sqrt{289} = 17$ cm, R: $\sqrt{625} =
    25$ cm (b) $31 - 25 = 6$ cm (c) $2 \times 180 = 360$ cm².
