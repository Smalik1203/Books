# Class 10 · Mathematics I · Chapter 12 — Surface Areas and Volumes

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set, as in *Exercise Set 12.1, Q2*, so it can be used beside the
book without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file.** A question renumbered in the book and
not here is how this goes wrong.

Each answer names the value of $\pi$ it uses. Both exercise sets take
$\pi = \frac{22}{7}$ unless a question gives another value. A value marked
*about* is rounded; the rounding is said where it happens.

---

## 12.1 Introduction

### The questions in the running text

- *Is the container one of the four basic solids?* No. It is a cylinder with
  a hemisphere at each end (Fig. 12.2), as the text goes on to say.
- *Can you name it?* (Fig. 12.3) A test tube: a cylinder with a hemisphere
  at the bottom.
- *How would you find the surface area, the volume or the capacity of such an
  object?* Answered by the chapter: break it into basic solids, add the
  surfaces that can still be seen, and add (or subtract) the volumes.

## 12.2 Surface Area of a Combination of Solids

### The question in the running text

*How much paint would we need to colour its surface?* (the toy of Fig. 12.5)
Enough for the CSA of the hemisphere plus the CSA of the cone, as the text
says; the flat faces are hidden.

### Exercise Set 12.1

1. With $\pi = \frac{22}{7}$ (not needed). Each cube has edge 4 cm, since
   $4^3 = 64$. The cuboid is 8 cm by 4 cm by 4 cm.
   - Surface area $= 2(8 \times 4 + 4 \times 4 + 8 \times 4) = 160$ cm².
   - Check: two cubes have $2 \times 6 \times 16 = 192$ cm², less the two
     hidden faces, $192 - 32 = 160$.

2. With $\pi = \frac{22}{7}$. The hemisphere has radius 7 cm, so the cylinder
   is $13 - 7 = 6$ cm high.
   - Inner surface $=$ CSA of the hemisphere $+$ CSA of the cylinder
     $= 2 \times \frac{22}{7} \times 7 \times 7 + 2 \times \frac{22}{7} \times 7 \times 6 = 308 + 264 = 572$ cm².

3. With $\pi = \frac{22}{7}$. The cone is $15.5 - 3.5 = 12$ cm high.
   - Slant height $l = \sqrt{3.5^2 + 12^2} = \sqrt{156.25} = 12.5$ cm.
   - TSA $=$ CSA of the cone $+$ CSA of the hemisphere
     $= \frac{22}{7} \times 3.5 \times 12.5 + 2 \times \frac{22}{7} \times 3.5 \times 3.5 = 137.5 + 77 = 214.5$ cm².

4. With $\pi = \frac{22}{7}$. The greatest diameter is **7 cm**, the side of
   the cube; the hemisphere's flat face must lie on the top face.
   - Surface area $= 6 \times 7 \times 7 - \frac{22}{7} \times 3.5 \times 3.5 + 2 \times \frac{22}{7} \times 3.5 \times 3.5 = 294 - 38.5 + 77 = 332.5$ cm².

5. The hemisphere has radius $\frac{l}{2}$.
   - Surface area $=$ TSA of the cube $-$ the circle removed $+$ the inside of
     the hollow $= 6l^2 - \pi \left(\frac{l}{2}\right)^2 + 2\pi \left(\frac{l}{2}\right)^2 = 6l^2 + \frac{\pi l^2}{4} = \frac{l^2}{4}(24 + \pi)$.

6. With $\pi = \frac{22}{7}$. The radius is 2.5 mm, so the cylinder is
   $14 - 5 = 9$ mm long.
   - Surface area $= 2 \times \frac{22}{7} \times 2.5 \times 9 + 4 \times \frac{22}{7} \times 2.5 \times 2.5 = \frac{990}{7} + \frac{550}{7} = 220$ mm².

7. With $\pi = \frac{22}{7}$. The radius is 2 m.
   - Canvas $=$ CSA of the cylinder $+$ CSA of the cone
     $= 2 \times \frac{22}{7} \times 2 \times 2.1 + \frac{22}{7} \times 2 \times 2.8 = 26.4 + 17.6 = 44$ m².
   - Cost $= 44 \times 500 = 22000$, that is, **₹22000**.

8. With $\pi = \frac{22}{7}$. The radius is 0.7 cm.
   - Slant height of the hollow $l = \sqrt{0.7^2 + 2.4^2} = \sqrt{6.25} = 2.5$ cm.
   - TSA $=$ CSA of the cylinder $+$ the base left $+$ the inside of the hollow
     $= 2 \times \frac{22}{7} \times 0.7 \times 2.4 + \frac{22}{7} \times 0.7 \times 0.7 + \frac{22}{7} \times 0.7 \times 2.5 = 10.56 + 1.54 + 5.5 = 17.6$ cm², which is **18 cm²** to the nearest cm².

9. With $\pi = \frac{22}{7}$ (Fig. 12.11).
   - TSA $=$ CSA of the cylinder $+$ the insides of two hemispheres
     $= 2 \times \frac{22}{7} \times 3.5 \times 10 + 2 \times 2 \times \frac{22}{7} \times 3.5 \times 3.5 = 220 + 154 = 374$ cm².

## 12.3 Volume of a Combination of Solids

### Exercise Set 12.2

1. The cone and the hemisphere both have radius 1 cm, and the cone is 1 cm high.
   - Volume $= \frac{1}{3}\pi \times 1^2 \times 1 + \frac{2}{3}\pi \times 1^3 = \pi$ cm³.

2. With $\pi = \frac{22}{7}$. The radius is 1.5 cm, and the cylinder is
   $12 - 2 - 2 = 8$ cm long.
   - Volume $= \frac{22}{7} \times 1.5 \times 1.5 \times 8 + 2 \times \frac{1}{3} \times \frac{22}{7} \times 1.5 \times 1.5 \times 2 = 21\pi = 66$ cm³.

3. With $\pi = \frac{22}{7}$ (Fig. 12.15). The radius is 1.4 cm, and the
   cylinder is $5 - 2.8 = 2.2$ cm long.
   - One gulab jamun $= \frac{22}{7} \times 1.4 \times 1.4 \times 2.2 + \frac{4}{3} \times \frac{22}{7} \times 1.4 \times 1.4 \times 1.4 = 13.552 + 11.4987 = 25.0507$ cm³, about 25.05 cm³.
   - 45 of them $= 45 \times 25.0507 = 1127.28$ cm³.
   - Syrup $= 0.3 \times 1127.28 = 338.184$, **about 338 cm³**.

4. With $\pi = \frac{22}{7}$ (Fig. 12.16).
   - Cuboid $= 15 \times 10 \times 3.5 = 525$ cm³.
   - One hollow $= \frac{1}{3} \times \frac{22}{7} \times 0.5 \times 0.5 \times 1.4 = 0.3667$ cm³.
   - Wood $= 525 - 4 \times 0.3667 = 523.53$ cm³.

5. The vessel holds $\frac{1}{3}\pi \times 5^2 \times 8 = \frac{200}{3}\pi$ cm³,
   and a quarter of it, $\frac{50}{3}\pi$ cm³, flows out. One shot has volume
   $\frac{4}{3}\pi \times 0.5^3 = \frac{1}{6}\pi$ cm³.
   - Number of shots $= \frac{50}{3}\pi \div \frac{1}{6}\pi = 100$.

6. With $\pi = 3.14$. The lower cylinder has radius 12 cm.
   - Volume $= 3.14 \times 12 \times 12 \times 220 + 3.14 \times 8 \times 8 \times 60 = 99475.2 + 12057.6 = 111532.8$ cm³.
   - Mass $= 111532.8 \times 8 = 892262.4$ g, **about 892.26 kg**.

7. With $\pi = \frac{22}{7}$.
   - Cylinder $= \pi \times 60^2 \times 180 = 648000\pi$ cm³.
   - Cone $= \frac{1}{3}\pi \times 60^2 \times 120 = 144000\pi$ cm³, and
     hemisphere $= \frac{2}{3}\pi \times 60^3 = 144000\pi$ cm³.
   - Water left $= 648000\pi - 144000\pi - 144000\pi = 360000\pi$ cm³.
   - $360000 \times \frac{22}{7} = 1131428.57$ cm³, **about 1.131 m³**.

8. With $\pi = 3.14$. The sphere has radius 4.25 cm, and the neck radius 1 cm.
   - Sphere $= \frac{4}{3} \times 3.14 \times 4.25 \times 4.25 \times 4.25 = 321.39$ cm³, to two decimal places.
   - Neck $= 3.14 \times 1 \times 1 \times 8 = 25.12$ cm³.
   - Volume $= 321.39 + 25.12 = 346.51$ cm³, so **she is not correct**: the
     vessel holds about 346.51 cm³, not 345 cm³.

### The chapter's worked examples

Set as steps on the pages; the values are 39.6 cm², 163.86 cm², 63.585 cm²
and 195.465 cm², 3.3 m², 1128.75 m³ and 827.15 m³, 196.25 cm³ and
163.54 cm³, and 25.12 cm³ twice.

---

## Beyond the Book

### Stage 1 · Using What You Know

Each of the five questions is answered in the running text that follows it
on the page: (1) 112 cm²; (2) the volumes are in the ratio $1 : 2 : 3$;
(3) the cone is 2 cm tall; (4) the surface area is 4 times as large and the volume 8 times;
(5) the surface area goes up, by $\pi r^2$.

### Stage 3 · Practice

Multiple choice and assertion–reason, as the key prints it:
1 (d), 2 (a), 3 (b), 4 (b), 5 (c), 6 (d), 7 (c), 8 (d), 9 (b), 10 (a),
11 (a), 12 (b), 13 (c), 14 (d), 15 (a), 16 (c), 17 (d), 18 (b), 19 (d).

The working for each:

1. Half of $\frac{4}{3}\pi r^3$ is $\frac{2}{3}\pi r^3$.
2. With $\pi = \frac{22}{7}$: $\frac{22}{7} \times 7 \times 15 = 330$ cm².
3. The two flat faces of the cylinder are hidden, and so are the flat faces of the hemispheres: CSA of the cylinder plus the CSA of the two hemispheres.
4. With $\pi = \frac{22}{7}$: $\frac{1}{3} \times \frac{22}{7} \times 6 \times 6 \times 7 = 264$ cm³.
5. The cone has radius 3 cm and height 6 cm: $\frac{1}{3}\pi \times 3^2 \times 6 = 18\pi$ cm³.
6. With $\pi = \frac{22}{7}$: $2 \times \frac{22}{7} \times 7 \times 7 = 308$ cm².
7. The sum of their volumes: nothing inside is hidden.
8. With $\pi = \frac{22}{7}$: $\frac{22}{7} \times 7 \times 7 \times 10 = 1540$ cm³.
9. One face of each cube is hidden: $2 \times 9 = 18$ cm².
10. Only Nila: volumes add, but the two flat faces are hidden, so the surface area is less than the sum.
11. The cone is a third of the cylinder, 20 cm³: $60 + 20 = 80$ cm³.
12. With $\pi = \frac{22}{7}$: $\frac{22}{7} \times 7 \times 7 \times 5 + \frac{1}{3} \times \frac{22}{7} \times 7 \times 7 \times 6 = 770 + 308 = 1078$ cm³.
13. The top of the cylinder is hidden: $\pi \times 3 \times 5 + 2\pi \times 3 \times 6 + \pi \times 3^2 = 15\pi + 36\pi + 9\pi = 60\pi$ cm².
14. (d) is false: the joined flat faces are hidden.
15. (a) Both are true, and the hidden flat faces are why the area is less.
16. (c) $\pi \times 9 \times 5 + \frac{2}{3}\pi \times 27 = 63\pi$, so A is true; R gives the volume of a sphere.
17. (d) The surface is $2 \times \pi \times 3 \times 5 = 30\pi$ cm², so A is false; R is true.
18. (b) $\pi \times 4 \times 5 + \frac{2}{3}\pi \times 8 = \frac{76}{3}\pi$, so A is true; R is true but is about a cone.
19. (d) The volume is $\pi \times 2^2 \times 3 + \frac{1}{3}\pi \times 2^2 \times 3 = 12\pi + 4\pi = 16\pi$ cm³, not $24\pi$, so A is false; R is true.
20. $\frac{4}{3}\pi \times 3^3 = 36\pi$ cm³.
21. The cone's base and the same area of the cube's top: $2 \times \pi \times 2^2 = 8\pi$ cm².
22. 3 cones.
23. With $\pi = 3.14$: $2\pi \times 5 \times 12 + 2\pi \times 5^2 + \pi \times 5^2 = 195\pi = 195 \times 3.14 = 612.3$ cm².
24. With $\pi = \frac{22}{7}$: $\frac{22}{7} \times 3.5 \times 3.5 \times 12 = 462$ and $\frac{2}{3} \times \frac{22}{7} \times 3.5 \times 3.5 \times 3.5 \approx 89.83$; the volume is $462 + 89.83 = 551.83$ cm³.
25. With $\pi = 3.14$: $12 \times 8 \times 6 - 3.14 \times 1 \times 1 \times 6 = 576 - 18.84 = 557.16$ cm³.
26. With $\pi = \frac{22}{7}$: $\frac{2}{3} \times \frac{22}{7} \times 10.5 \times 10.5 \times 10.5 = 2425.5$ cm³, which is 2.4255 litres, about 2.43 litres.
27. With $\pi = 3.14$:
    (a) $l = \sqrt{2.4^2 + 1.8^2} = 3$ m
    (b) $2 \times 3.14 \times 2.4 \times 2 + 3.14 \times 2.4 \times 3 = 52.752$ m², and the cost is $52.752 \times 120 = 6330.24$, that is, ₹6330.24
    (c) $3.14 \times 2.4 \times 2.4 \times 2 + \frac{1}{3} \times 3.14 \times 2.4 \times 2.4 \times 1.8 \approx 47.02$ m³
28. - The cylinder holds $\pi r^2 \times 2r = 2\pi r^3$. *(its height is $2r$)*
    - The sphere holds $\frac{4}{3}\pi r^3 = \frac{2}{3} \times 2\pi r^3$, two thirds of the cylinder.
    - The cylinder's curved surface is $2\pi r \times 2r = 4\pi r^2$. *(CSA $= 2\pi rh$)*
    - The sphere's surface is $4\pi r^2$, the same.
29. With $\pi = 3.14$:
    (a) $\frac{1}{3} \times 3.14 \times 36 \times 8 + \frac{2}{3} \times 3.14 \times 216 = 753.6$ cm³
    (b) $753.6 \times 7.5 = 5652$ g, which is 5.652 kg
    (c) $l = \sqrt{6^2 + 8^2} = 10$, and the area is $3.14 \times 6 \times 10 + 2 \times 3.14 \times 36 = 414.48$ cm²
30. With $\pi = \frac{22}{7}$:
    (a) $\sqrt{3.5^2 + 8.4^2} = 9.1$ m
    (b) $\frac{22}{7} \times 12.25 \times 8 + \frac{1}{3} \times \frac{22}{7} \times 12.25 \times 8.4 = 415.8$ m³
    (c) $2 \times \frac{22}{7} \times 3.5 \times 8 + \frac{22}{7} \times 3.5 \times 9.1 = 276.1$ m²
    (d) $415.8 \times 800 = 332640$ kg, which is 332.64 tonnes
31. With $\pi = \frac{22}{7}$:
    (a) $\frac{22}{7} \times 0.1225 \times 14 + \frac{1}{3} \times \frac{22}{7} \times 0.1225 \times 1.2 = 5.544$ cm³
    (b) $2 \times \frac{22}{7} \times 0.35 \times 14 + \frac{22}{7} \times 0.1225 = 31.185$ cm²
    (c) $l = \sqrt{0.35^2 + 1.2^2} = 1.25$, and the area is $\frac{22}{7} \times 0.35 \times 1.25 = 1.375$ cm²
    (d) $31.185 \times 1000 = 31185$ cm², which is 3.1185 m²
