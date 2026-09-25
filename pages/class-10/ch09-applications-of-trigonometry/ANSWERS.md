# Class 10 · Mathematics I · Chapter 9 — Some Applications of Trigonometry

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set — *Exercise Set 9.1, Q2* — so it can be used beside the book
without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file.** A question renumbered in the book and
not here is how this goes wrong.

Where a question gives no value for $\sqrt{3}$, the exact answer is the
answer; the decimal beside it uses $\sqrt{3} \approx 1.732$ and is rounded to
two places. A drawing for any of these must show the right angle, the angle
given (at the ground for an angle of elevation, moved down to the object for
an angle of depression) and the lengths given.

---

## 9.1 Heights and Distances

### The questions in the running text

- *Suppose you want to find the height CD of the minar. What do you need to
  know?* Answered in the text that follows it: the distance DE, the angle
  of elevation $\angle BAC$ and the height AE of the student.
- *Example 6, "(Why?)"*: ABDC is a rectangle (AB and DC are vertical, BD and
  AC are horizontal), and opposite sides of a rectangle are equal, so
  ${AC = BD}$ and ${DC = AB = 8}$ m.

### Think and Reflect (Fig. 8.3)

The lines of sight are the lines from the girl's eye to the balloon at A and
to the balloon at B. Both points are above the horizontal level of her eye,
so both angles are **angles of elevation**. The angle at B is the smaller one,
because B is further away at the same height.

### Exercise Set 9.1

1. The rope is the hypotenuse and the pole is opposite the $30^\circ$ angle:
   $AB = 20 \sin 30^\circ = 20 \times \frac{1}{2} = 10$. **10 m.**

2. Let the part left standing be AB and the broken part AC, with its top C
   on the ground 8 m from the foot B.
   - $\tan 30^\circ = \frac{AB}{8}$, so $AB = \frac{8}{\sqrt{3}}$.
   - $\cos 30^\circ = \frac{8}{AC}$, so $AC = \frac{16}{\sqrt{3}}$.
   - Height $= \frac{8}{\sqrt{3}} + \frac{16}{\sqrt{3}} = \frac{24}{\sqrt{3}} = 8\sqrt{3}$.
     **${8\sqrt{3}}$ m, about 13.86 m.**

3. Each slide is the hypotenuse.
   - Younger children: $\frac{1.5}{\sin 30^\circ} = 3$. **3 m.**
   - Older children: $\frac{3}{\sin 60^\circ} = \frac{6}{\sqrt{3}} = 2\sqrt{3}$.
     **${2\sqrt{3}}$ m, about 3.46 m.**

4. $30 \tan 30^\circ = \frac{30}{\sqrt{3}} = 10\sqrt{3}$. **${10\sqrt{3}}$ m,
   about 17.32 m.**

5. The string is the hypotenuse: $\frac{60}{\sin 60^\circ} = \frac{120}{\sqrt{3}} = 40\sqrt{3}$.
   **${40\sqrt{3}}$ m, about 69.28 m.**

6. The top is $30 - 1.5 = 28.5$ m above his eyes.
   - At $30^\circ$ he is $28.5\sqrt{3}$ m from the building (horizontally from his eyes).
   - At $60^\circ$ he is $\frac{28.5}{\sqrt{3}}$ m from it.
   - He walked $28.5\sqrt{3} - \frac{28.5}{\sqrt{3}} = \frac{57}{\sqrt{3}} = 19\sqrt{3}$.
     **${19\sqrt{3}}$ m, about 32.91 m.**

7. From the $45^\circ$ angle, the point is $20$ m from the foot
   ($\tan 45^\circ = 1$). The top of the tower is then
   $20 \tan 60^\circ = 20\sqrt{3}$ m high, so the tower is
   $20\sqrt{3} - 20 = 20(\sqrt{3} - 1)$. **${20(\sqrt{3} - 1)}$ m, about 14.64 m.**

8. Let the pedestal be $h$ m. From $45^\circ$, the point is $h$ m from the
   foot. From $60^\circ$, $h + 1.6 = h\sqrt{3}$, so
   $h = \frac{1.6}{\sqrt{3} - 1} = 0.8(\sqrt{3} + 1)$.
   **${0.8(\sqrt{3} + 1)}$ m, about 2.19 m.**

9. From the foot of the building, $\tan 60^\circ = \frac{50}{d}$, so the feet
   are $d = \frac{50}{\sqrt{3}}$ m apart. From the foot of the tower, the
   building is $d \tan 30^\circ = \frac{50}{\sqrt{3}} \times \frac{1}{\sqrt{3}} = \frac{50}{3}$ m high.
   **${\frac{50}{3}}$ m, that is, ${16\frac{2}{3}}$ m.**

10. Let the point be $x$ m from the pole seen at $60^\circ$, so $80 - x$ m
    from the other. The heights are equal:
    $x \tan 60^\circ = (80 - x) \tan 30^\circ$, so $3x = 80 - x$ and $x = 20$.
    Height $= 20\sqrt{3}$. **The poles are ${20\sqrt{3}}$ m (about 34.64 m)
    high; the point is 20 m from one pole and 60 m from the other.**

11. In Fig. 9.12, let $AB = h$ and $BC = x$.
    - $\tan 60^\circ = \frac{h}{x}$, so $h = x\sqrt{3}$.
    - $\tan 30^\circ = \frac{h}{x + 20}$, so $3x = x + 20$ and $x = 10$.
    - $h = 10\sqrt{3}$.
    **The tower is ${10\sqrt{3}}$ m (about 17.32 m) high; the canal is 10 m wide.**

12. From the $45^\circ$ depression, the tower is 7 m from the building. The
    top of the tower rises $7 \tan 60^\circ = 7\sqrt{3}$ m above the top of
    the building. Height $= 7 + 7\sqrt{3} = 7(\sqrt{3} + 1)$.
    **${7(\sqrt{3} + 1)}$ m, about 19.12 m.**

13. The ship at $45^\circ$ is 75 m from the foot; the ship at $30^\circ$ is
    $75\sqrt{3}$ m from it. Both are on the same side, so the distance is
    $75\sqrt{3} - 75 = 75(\sqrt{3} - 1)$. **${75(\sqrt{3} - 1)}$ m, about 54.9 m.**

14. In Fig. 9.13, the balloon is $88.2 - 1.2 = 87$ m above her eyes.
    - At $60^\circ$ it is $\frac{87}{\sqrt{3}} = 29\sqrt{3}$ m from her,
      horizontally.
    - At $30^\circ$ it is $87\sqrt{3}$ m from her.
    - It travelled $87\sqrt{3} - 29\sqrt{3} = 58\sqrt{3}$.
    **${58\sqrt{3}}$ m, about 100.46 m.**

15. Let the tower be $h$ m. At $30^\circ$ the car is $h\sqrt{3}$ m from the
    foot; at $60^\circ$ it is $\frac{h}{\sqrt{3}}$ m. In 6 seconds it covers
    $h\sqrt{3} - \frac{h}{\sqrt{3}} = \frac{2h}{\sqrt{3}}$ m, which is twice the
    $\frac{h}{\sqrt{3}}$ m still to go. At a steady speed the rest takes half
    as long. **3 seconds.**

---

## Beyond the Book

### Stage 1 · Using What You Know

Each of the five questions is answered in the running text that follows it
on the page: (1) $30^\circ$; (2) ${20\sqrt{3}}$ m, by the isosceles triangle
ADC; (3) $30^\circ$, and ${14\sqrt{3}}$ m, about 24.25 m; (4) no — it comes
as close to $90^\circ$ as you like but never reaches it; (5) $60^\circ$, since
the tangent is multiplied by 3, from $\frac{1}{\sqrt{3}}$ to $\sqrt{3}$; the angle
doubles, and does not become three times as large.

### Stage 2 · Solved Examples

The 24 September 2026 examples, in examination formats. Each is worked in full on
its page; these are the keys.

1. (a) 30 m *(single correct)*
2. (b) $20\sqrt{3}$ m *(single correct)*
3. (c) $30^\circ$ *(single correct)*
4. (d) $30\sqrt{3}$ m *(single correct)*
5. (a) $5\sqrt{3}$ m *(single correct)*
6. (b) $45^\circ$ *(single correct)*
7. (a), (b), (c) *(multiple correct)*
8. (a), (b) *(multiple correct)*
9. (a), (b), (d) *(multiple correct)*
10. (a), (b), (c) *(multiple correct)*
11. 50 *(numerical answer)*
12. 60 *(numerical answer)*
13. 17.32 *(numerical answer)*
14. (a) P–3, Q–4, R–1, S–2 *(matching)*
15. (b) P–3, Q–4, R–2, S–1 *(matching)*

### Stage 3 · Practice

Multiple choice and assertion–reason, as the key prints it:
1 (c), 2 (a), 3 (d), 4 (b), 5 (d), 6 (a), 7 (c), 8 (a), 9 (c), 10 (b),
11 (b), 12 (d), 13 (a), 14 (b), 15 (c), 16 (a), 17 (c), 18 (b), 19 (d).

The working for each:

1. $\tan\theta = \frac{6}{2\sqrt{3}} = \sqrt{3}$, so $60^\circ$.
2. $25 \tan 60^\circ = 25\sqrt{3}$ m.
3. $12 \cos 60^\circ = 6$ m.
4. $\frac{50}{\tan 45^\circ} = 50$ m.
5. $\frac{45}{\sin 60^\circ} = \frac{90}{\sqrt{3}} = 30\sqrt{3}$ m.
6. The two horizontals are parallel, so the angles are alternate angles: $\theta$.
7. $\tan\theta = \frac{1}{\sqrt{3}}$, so $30^\circ$.
8. $\tan\theta = \frac{h}{d}$ grows as $d$ shrinks, so the angle gets larger.
9. The building is $\frac{20}{\sqrt{3}}$ m high and the top of the flagstaff 20 m, so the flagstaff is $20 - \frac{20}{\sqrt{3}} = \frac{20(\sqrt{3} - 1)}{\sqrt{3}}$ m.
10. Standing part $10\tan 60^\circ = 10\sqrt{3}$ m, broken part $\frac{10}{\cos 60^\circ} = 20$ m; height $20 + 10\sqrt{3} = 10(2 + \sqrt{3})$ m.
11. Height $s\sqrt{3}$; new shadow $s\sqrt{3} \times \sqrt{3} = 3s$ m.
12. Both are $45^\circ$, since $\tan\theta = \frac{20}{20} = 1$ and the two angles are alternate angles: both are right.
13. Height $20 \times \frac{3}{4} = 15$ m; distance $\sqrt{20^2 + 15^2} = 25$ m.
14. The cars are $\frac{30}{\tan 30^\circ} = 30\sqrt{3}$ m and $\frac{30}{\tan 60^\circ} = 10\sqrt{3}$ m from the foot, on the same side, so $30\sqrt{3} - 10\sqrt{3} = 20\sqrt{3}$ m apart, about 34.64 m (Example 15).
15. (c) is false: a higher Sun gives a shorter shadow.
16. (a) $\sin\theta = \frac{5}{10} = \frac{1}{2}$, so $30^\circ$; R gives it.
17. (c) A is true; R is false, since the two angles are equal.
18. (b) $8 \sin 60^\circ = 4\sqrt{3}$, so A is true; R is true but is not the reason.
19. (d) The shadow is $\frac{6}{\tan 30^\circ} = 6\sqrt{3}$ m, so A is false; R is true.
20. $\frac{2.5}{\cos 60^\circ} = 5$ m.
21. $\frac{33}{\sqrt{3}} = 11\sqrt{3}$ m, about 19.05 m.
22. $\tan\theta = \sqrt{3}$, so $60^\circ$.
23. The top is 18.8 m above his eyes; the tree is $18.8 + 1.2 = 20$ m high.
24. The distance is $\frac{90}{\sqrt{3}} = 30\sqrt{3}$ m; the tower is $30\sqrt{3}$ m higher than the pole, which is $90 - 30\sqrt{3} = 30(3 - \sqrt{3})$ m, about 38.04 m.
25. $60\sqrt{3} + 60 = 60(\sqrt{3} + 1)$ m, about 163.92 m.
26. $\tan\theta = \frac{22 - 1.5}{20.5} = 1$, so $45^\circ$.
27. - Let the tower be $H$ m and the distance $d$ m.
    - From the bottom of the building, $\tan 60^\circ = \frac{H}{d}$, so $d = \frac{H}{\sqrt{3}}$.
    - From its top, $H - 10 = d \tan 30^\circ = \frac{H}{3}$, so $H = 15$.
    - The tower is **15 m** high and $d = 5\sqrt{3}$ m, about **8.66 m**.
28. - Let the tower be $H$ m high and $d$ m from the point.
    - The bottom of the pole: $\tan\alpha = \frac{H}{d}$, so $d = \frac{H}{\tan\alpha}$.
    - The top of the pole: $\tan\beta = \frac{H + h}{d}$, so $H + h = d\tan\beta = \frac{H\tan\beta}{\tan\alpha}$.
    - Multiplying by $\tan\alpha$: $H\tan\alpha + h\tan\alpha = H\tan\beta$, so $H(\tan\beta - \tan\alpha) = h\tan\alpha$.
    - So $H = \frac{h\tan\alpha}{\tan\beta - \tan\alpha}$.
29. The balloon is at $100 \tan 30^\circ = \frac{100}{\sqrt{3}}$ m, then at $100 \tan 60^\circ = 100\sqrt{3}$ m. It rises $\frac{200}{\sqrt{3}}$ m, about 115.47 m, in 20 seconds: about **5.77 m** per second.
30. (a) $16\sqrt{3}$ m, about 27.71 m (b) about 29.21 m (c) 48 m (d) 32 m
31. (a) 50 m (b) $50\sqrt{3}$ m, about 86.6 m (c) $\frac{100}{\sqrt{3}}$ m, about 57.73 m (d) 100 m
