# Class 10 · Mathematics I · Chapter 5 — Arithmetic Progressions

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set — *Exercise Set 5.2, Q7* — so it can be used beside the book
without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file.** A question renumbered in the book and
not here is how this goes wrong.

Throughout, $a$ is the first term, $d$ the common difference, $a_n$ the $n$th
term and $S_n$ the sum of the first $n$ terms.

---

## 5.2 Arithmetic Progressions

### The questions in the running text

*Try to explain for yourself why each of the lists (a) to (e) is an AP.* In
each, every term is the one before it plus a fixed number:
(a) $148 - 147 = 1$, so $d = 1$;
(b) $-3.0 - (-3.1) = 0.1$, so $d = 0.1$;
(c) $900 - 950 = -50$, so $d = -50$ (each payment takes ₹50 off);
(d) $250 - 200 = 50$, so $d = 50$;
(e) $100 - 50 = 50$, so $d = 50$ (₹50 is added each month).

*What is the least you need to know to write down an AP?* Answered in the
text: the first term $a$ and the common difference $d$, both of them.

### Exercise Set 5.1

1. - (i) **An AP.** The fares are $15, 23, 31, 39, \ldots$ rupees; each is
     8 more than the one before, so $d = 8$.
   - (ii) **Not an AP.** Each time $\frac{3}{4}$ of the air is left, so the
     amounts are $1, \frac{3}{4}, \frac{9}{16}, \ldots$ of the air at the
     start. The differences $-\frac{1}{4}$ and $-\frac{3}{16}$ are not equal.
   - (iii) **An AP.** The costs are $150, 200, 250, \ldots$ rupees, so
     $d = 50$.
   - (iv) **Not an AP.** The amounts are $10000, 10800, 11664, \ldots$
     rupees; the differences 800 and 864 are not equal.

2. - (i) $10, 20, 30, 40$
   - (ii) $-2, -2, -2, -2$
   - (iii) $4, 1, -2, -5$
   - (iv) $-1, -\frac{1}{2}, 0, \frac{1}{2}$
   - (v) $-1.25, -1.50, -1.75, -2.00$

3. - (i) $a = 3$, $d = 1 - 3 = -2$
   - (ii) $a = -5$, $d = -1 - (-5) = 4$
   - (iii) $a = \frac{1}{3}$, $d = \frac{5}{3} - \frac{1}{3} = \frac{4}{3}$
   - (iv) $a = 0.6$, $d = 1.7 - 0.6 = 1.1$

4. - (i) Not an AP: the differences are 2, 4, 8.
   - (ii) An AP with $d = \frac{1}{2}$; next terms $4, \frac{9}{2}, 5$.
   - (iii) An AP with $d = -2$; next terms $-9.2, -11.2, -13.2$.
   - (iv) An AP with $d = 4$; next terms $6, 10, 14$.
   - (v) An AP with $d = \sqrt{2}$; next terms $3 + 4\sqrt{2}$,
     $3 + 5\sqrt{2}$, $3 + 6\sqrt{2}$.
   - (vi) Not an AP: the differences are 0.02, 0.002, 0.0002.
   - (vii) An AP with $d = -4$; next terms $-16, -20, -24$.
   - (viii) An AP with $d = 0$; next terms $-\frac{1}{2}, -\frac{1}{2}, -\frac{1}{2}$.
   - (ix) Not an AP: the differences are 2, 6, 18.
   - (x) An AP with $d = a$; next terms $5a, 6a, 7a$.
   - (xi) Not an AP in general: the differences $a^2 - a$ and $a^3 - a^2$
     are equal only when $a = 0$ or $a = 1$. (For those two values every
     term is 0, or every term is 1, which is an AP with $d = 0$.)
   - (xii) The terms are $\sqrt{2}, 2\sqrt{2}, 3\sqrt{2}, 4\sqrt{2}$, so it
     is an AP with $d = \sqrt{2}$; next terms $5\sqrt{2} = \sqrt{50}$,
     $6\sqrt{2} = \sqrt{72}$, $7\sqrt{2} = \sqrt{98}$.
   - (xiii) Not an AP: $\sqrt{6} - \sqrt{3}$ is about 0.717 and
     $\sqrt{9} - \sqrt{6}$ about 0.551.
   - (xiv) Not an AP: the terms are 1, 9, 25, 49, with differences 8, 16, 24.
   - (xv) The terms are 1, 25, 49, 73, so it is an AP with $d = 24$; next
     terms 97, 121, 145.

## 5.3 *n*th Term of an AP

### The questions in the running text

*These numbers are in AP. (Why?)* Each year's salary is ₹500 more than the
year before, so $d = 500$.

*Her salary in the 6th year? The 15th? The 25th?*
6th year: $8000 + 5 \times 500 = 10500$; 15th year: 15000; 25th year: 20000
(worked on the page).

*Example 6: $n$ must be a positive integer. (Why?)* $n$ counts the place of
a term in the list — first, second, third — so it is a whole number.

*Example 8: the 11th term from the last is the 15th term, not the 14th.
(Why?)* The last term is the 25th, and counting back 11 terms includes the
last one: the 25th, 24th, …, 15th is 11 terms, since $25 - 15 + 1 = 11$.
*The reversed AP has common difference 3. (Why?)* Read backwards, each term
is 3 more than the one before it, because forwards it was 3 less.

*Example 10: these numbers form an AP. (Why?)* Each row has 2 plants fewer
than the row before, so $d = -2$.

### Exercise Set 5.2

1. - (i) $a_8 = 7 + 7 \times 3 = 28$
   - (ii) $0 = -18 + 9d$, so $d = 2$
   - (iii) $-5 = a + 17 \times (-3)$, so $a = 46$
   - (iv) $3.6 = -18.9 + (n - 1) \times 2.5$, so $n - 1 = 9$ and $n = 10$
   - (v) $a_{105} = 3.5 + 104 \times 0 = 3.5$

2. - (i) **(c)** $a_{30} = 10 + 29 \times (-3) = -77$
   - (ii) **(b)** $d = -\frac{1}{2} - (-3) = \frac{5}{2}$, so
     $a_{11} = -3 + 10 \times \frac{5}{2} = 22$

3. - (i) $2, 14, 26$ ($2d = 24$)
   - (ii) $18, 13, 8, 3$ ($d = -5$)
   - (iii) $5, 6\frac{1}{2}, 8, 9\frac{1}{2}$ ($3d = 4\frac{1}{2}$)
   - (iv) $-4, -2, 0, 2, 4, 6$ ($5d = 10$)
   - (v) $53, 38, 23, 8, -7, -22$ ($4d = -60$, so $d = -15$)

4. $78 = 3 + (n - 1) \times 5$, so $n - 1 = 15$: **the 16th term**.

5. - (i) $205 = 7 + (n - 1) \times 6$, so $n - 1 = 33$: **34 terms**.
   - (ii) $d = -\frac{5}{2}$, and $-47 = 18 + (n - 1) \times (-\frac{5}{2})$
     gives $n - 1 = 26$: **27 terms**.

6. **No.** $-150 = 11 + (n - 1) \times (-3)$ gives $n - 1 = \frac{161}{3}$,
   which is not a whole number.

7. $a + 10d = 38$ and $a + 15d = 73$, so $5d = 35$, $d = 7$ and $a = -32$.
   $a_{31} = -32 + 30 \times 7 = 178$.

8. $a + 2d = 12$ and $a + 49d = 106$, so $47d = 94$, $d = 2$ and $a = 8$.
   $a_{29} = 8 + 28 \times 2 = 64$.

9. $a + 2d = 4$ and $a + 8d = -8$, so $6d = -12$, $d = -2$ and $a = 8$.
   $8 + (n - 1)(-2) = 0$ gives $n = 5$: **the 5th term**.

10. $a_{17} - a_{10} = 7d = 7$, so $d = 1$.

11. $a_{54} = 3 + 53 \times 12 = 639$, and $639 + 132 = 771$.
    $771 = 3 + (n - 1) \times 12$ gives $n - 1 = 64$: **the 65th term**.

12. **100.** The $n$th terms are $a + (n - 1)d$ and $b + (n - 1)d$, whose
    difference is $a - b$ for every $n$.

13. The numbers are $105, 112, \ldots, 994$.
    $994 = 105 + (n - 1) \times 7$ gives $n - 1 = 127$: **128**.

14. The multiples are $12, 16, \ldots, 248$.
    $248 = 12 + (n - 1) \times 4$ gives $n - 1 = 59$: **60**.

15. $63 + 2(n - 1) = 3 + 7(n - 1)$, so $5(n - 1) = 60$ and $n = 13$.

16. $a_7 - a_5 = 2d = 12$, so $d = 6$, and $a + 2d = 16$ gives $a = 4$.
    The AP is $4, 10, 16, 22, \ldots$

17. $253 = 3 + (n - 1) \times 5$ gives $n = 51$. The 20th term from the last
    is the 32nd term: $a_{32} = 3 + 31 \times 5 = 158$.

18. $2a + 10d = 24$ and $2a + 14d = 44$, so $4d = 20$, $d = 5$ and
    $a = -13$. The first three terms are $-13, -8, -3$.

19. $7000 = 5000 + (n - 1) \times 200$ gives $n = 11$. His 1st year was
    1995, so his 11th year is **2005**.

20. $20.75 = 5 + (n - 1) \times 1.75$ gives $n - 1 = 9$, so $n = 10$.

## 5.4 Sum of First *n* Terms of an AP

### Exercise Set 5.3

1. - (i) $S_{10} = 5[4 + 9 \times 5] = 245$
   - (ii) $S_{12} = 6[-74 + 11 \times 4] = -180$
   - (iii) $S_{100} = 50[1.2 + 99 \times 1.1] = 5505$
   - (iv) $d = \frac{1}{12} - \frac{1}{15} = \frac{1}{60}$, and
     $S_{11} = \frac{11}{2}[\frac{2}{15} + \frac{10}{60}] = \frac{33}{20}$

2. - (i) $d = \frac{7}{2}$; $84 = 7 + (n - 1) \times \frac{7}{2}$ gives
     $n = 23$, so $S = \frac{23}{2}(7 + 84) = \frac{2093}{2} = 1046\frac{1}{2}$
   - (ii) $d = -2$; $10 = 34 + (n - 1)(-2)$ gives $n = 13$, so
     $S = \frac{13}{2}(34 + 10) = 286$
   - (iii) $d = -3$; $-230 = -5 + (n - 1)(-3)$ gives $n = 76$, so
     $S = 38 \times (-5 - 230) = -8930$

3. - (i) $50 = 5 + 3(n - 1)$ gives $n = 16$; $S_{16} = 8 \times (5 + 50) = 440$
   - (ii) $35 = 7 + 12d$ gives $d = \frac{7}{3}$;
     $S_{13} = \frac{13}{2}(7 + 35) = 273$
   - (iii) $37 = a + 11 \times 3$ gives $a = 4$;
     $S_{12} = 6 \times (4 + 37) = 246$
   - (iv) $a + 2d = 15$ and $5(2a + 9d) = 125$ give $d = -1$ and $a = 17$;
     $a_{10} = 17 + 9 \times (-1) = 8$
   - (v) $\frac{9}{2}(2a + 8 \times 5) = 75$ gives $a = -\frac{35}{3}$;
     $a_9 = -\frac{35}{3} + 8 \times 5 = \frac{85}{3}$
   - (vi) $\frac{n}{2}[4 + 8(n - 1)] = 90$ gives $2n^2 - n - 45 = 0$, that is,
     $(n - 5)(2n + 9) = 0$, so $n = 5$; $a_5 = 2 + 4 \times 8 = 34$
   - (vii) $\frac{n}{2}(8 + 62) = 210$ gives $n = 6$; $62 = 8 + 5d$ gives
     $d = \frac{54}{5}$
   - (viii) $a = 4 - 2(n - 1)$, and $\frac{n}{2}(a + 4) = -14$ gives
     $n^2 - 5n - 14 = 0$, that is, $(n - 7)(n + 2) = 0$, so $n = 7$ and
     $a = -8$
   - (ix) $4 \times (6 + 7d) = 192$ gives $d = 6$
   - (x) $\frac{9}{2}(a + 28) = 144$ gives $a = 4$

4. $\frac{n}{2}[18 + 8(n - 1)] = 636$ gives $4n^2 + 5n - 636 = 0$, that is,
   $(n - 12)(4n + 53) = 0$: **12 terms**.

5. $\frac{n}{2}(5 + 45) = 400$ gives $n = 16$; $45 = 5 + 15d$ gives
   $d = \frac{8}{3}$.

6. $350 = 17 + 9(n - 1)$ gives $n = 38$; $S_{38} = 19 \times (17 + 350) = 6973$.

7. $149 = a + 21 \times 7$ gives $a = 2$; $S_{22} = 11 \times (2 + 149) = 1661$.

8. $d = 18 - 14 = 4$ and $a = 10$; $S_{51} = \frac{51}{2}(20 + 50 \times 4) = 5610$.

9. $\frac{7}{2}(2a + 6d) = 49$ and $\frac{17}{2}(2a + 16d) = 289$ give
   $a + 3d = 7$ and $a + 8d = 17$, so $d = 2$ and $a = 1$.
   $S_n = \frac{n}{2}[2 + 2(n - 1)] = n^2$.

10. - (i) $a_{n+1} - a_n = 4$ for every $n$, so it is an AP with $a_1 = 7$;
      $S_{15} = \frac{15}{2}(7 + 63) = 525$
    - (ii) $a_{n+1} - a_n = -5$ for every $n$, so it is an AP with $a_1 = 4$;
      $S_{15} = \frac{15}{2}(4 - 66) = -465$

11. $S_1 = 4 - 1 = 3$, so the first term is 3. $S_2 = 8 - 4 = 4$, so the
    second term is $4 - 3 = 1$. $S_3 = 12 - 9 = 3$, so the 3rd term is
    $3 - 4 = -1$. $S_{10} = 40 - 100 = -60$ and $S_9 = 36 - 81 = -45$, so
    the 10th term is $-60 + 45 = -15$. In general the $n$th term is
    $S_n - S_{n-1} = 5 - 2n$.

12. The numbers are $6, 12, \ldots, 240$: $S_{40} = 20 \times (6 + 240) = 4920$.

13. The multiples are $8, 16, \ldots, 120$: $S_{15} = \frac{15}{2}(8 + 120) = 960$.

14. The odd numbers $1, 3, \ldots, 49$ are 25 in number:
    $S_{25} = \frac{25}{2}(1 + 49) = 625$.

15. $S_{30} = 15 \times (400 + 29 \times 50) = 27750$: **₹27750**.

16. $\frac{7}{2}[2a + 6 \times (-20)] = 700$ gives $a = 160$. The prizes are
    **₹160, ₹140, ₹120, ₹100, ₹80, ₹60 and ₹40**.

17. Each class plants $3 \times$ its number, so the total is
    $3 \times (1 + 2 + \cdots + 12) = 3 \times 78 = 234$ trees.

18. The radii are $0.5, 1.0, \ldots, 6.5$ cm, and a semicircle of radius $r$
    has length $\pi r$. The radii add to $\frac{13}{2}(0.5 + 6.5) = 45.5$,
    so the spiral is $\frac{22}{7} \times 45.5 = 143$ cm long.

19. $\frac{n}{2}[40 + (n - 1)(-1)] = 200$ gives $n^2 - 41n + 400 = 0$, that
    is, $(n - 16)(n - 25) = 0$. With 25 rows the top row would hold
    $20 - 24 = -4$ logs, which is impossible, so $n = 16$: **16 rows**,
    with $20 - 15 = 5$ **logs in the top row**.

20. For each potato she runs to it and back. The potatoes are 5, 8, 11, …,
    32 m from the bucket, so she runs
    $2 \times \frac{10}{2}(5 + 32) = 370$ m.

### Exercise Set 5.4 (Optional)

1. $121 + (n - 1)(-4) < 0$ gives $n - 1 > 30.25$, so $n = 32$:
   **the 32nd term**, $a_{32} = 121 - 31 \times 4 = -3$.

2. $a_3 + a_7 = 2a + 8d = 6$, so $a + 4d = 3$; write $a_3 = 3 - 2d$ and
   $a_7 = 3 + 2d$. Their product is $9 - 4d^2 = 8$, so $d = \frac{1}{2}$ or
   $d = -\frac{1}{2}$. The question does not say which, and both work:
   - $d = \frac{1}{2}$, $a = 1$: $S_{16} = 8 \times (2 + 15 \times \frac{1}{2}) = 76$
   - $d = -\frac{1}{2}$, $a = 5$: $S_{16} = 8 \times (10 - 15 \times \frac{1}{2}) = 20$

   **76 or 20.**

3. There are $\frac{250}{25} + 1 = 11$ rungs, from 45 cm to 25 cm. The wood
   needed is $\frac{11}{2}(45 + 25) = 385$ cm.

4. $\frac{(x - 1)x}{2} = \frac{49 \times 50}{2} - \frac{x(x + 1)}{2}$ gives
   $x^2 = 1225$, so $x = 35$. Check: $1 + 2 + \cdots + 34 = 595$ and
   $36 + 37 + \cdots + 49 = 595$.

5. Step $k$ is $\frac{k}{4}$ m high, $\frac{1}{2}$ m deep and 50 m long, so
   its volume is $6.25k$ m³. The total is $6.25 \times (1 + 2 + \cdots + 15)
   = 6.25 \times 120 = 750$ m³. The volumes $6.25, 12.5, 18.75, \ldots$ are
   an AP with $d = 6.25$.

---

## Beyond the Book

### Stage 1 · Using What You Know

Each of the five questions is answered in the running text that follows it
on the page: (1) 5, 8 and 11; (2) $k = 18$; (3) yes, an AP with first term 8
and common difference 6; (4) no — the sum of the first $n$ even numbers is
$n(n + 1)$, and 200 lies between 182 and 210; (5) the middle angle is
$60^\circ$.

### Stage 2 · Solved Examples

The 24 September 2026 examples, in examination formats. Each is worked in full on
its page; these are the keys.

1. (a) 47 *(single correct)*
2. (b) 16 *(single correct)*
3. (c) 590 *(single correct)*
4. (d) $-2$ *(single correct)*
5. (a) 203 *(single correct)*
6. (b) 11 *(single correct)*
7. (b), (c) *(multiple correct)*
8. (a), (b), (d) *(multiple correct)*
9. (a), (b), (c) *(multiple correct)*
10. (a), (b) *(multiple correct)*
11. 4920 *(numerical answer)*
12. 860 *(numerical answer)*
13. 15 *(numerical answer)*
14. (a) P–3, Q–4, R–1, S–2 *(matching)*
15. (d) P–3, Q–1, R–4, S–2 *(matching)*

### Stage 3 · Practice

Multiple choice and assertion–reason, as the key prints it:
1 (a), 2 (d), 3 (c), 4 (b), 5 (d), 6 (a), 7 (c), 8 (b), 9 (d),
10 (a), 11 (b), 12 (c), 13 (d), 14 (c), 15 (a), 16 (d), 17 (b).

The working for each:

1. $\frac{1 - p}{p} - \frac{1}{p} = -1$.
2. 5, 5, 5, 5 has $d = 0$; the others have unequal differences.
3. $a_{10} = 5 + 9 \times 4 = 41$.
4. The terms are $\sqrt{7}, 2\sqrt{7}, 3\sqrt{7}$, so the next is $4\sqrt{7} = \sqrt{112}$.
5. $43 = 7 + 3(n - 1)$ gives $n = 13$.
6. $x - 2 = 14 - x$ gives $x = 8$.
7. $\frac{n(n + 1)}{2} = 210$ gives $n = 20$.
8. $4d = 23 - 11 = 12$, $d = 3$, $a = 11 - 9 = 2$.
9. $a_5 = S_5 - S_4 = 65 - 44 = 21$.
10. $S_{16} = 8 \times (20 - 60) = -320$.
11. $n = 21$; the 11th term from the end is the 11th term, 43. Only Kiran is right.
12. $\frac{n}{2}(-4 + 146) = 7171$ gives $n = 101$.
13. $2a + 9d = 7$ and $2a + 19d = -3$ give $d = -1$, $a = 8$, $a_{10} = -1$.
14. (c) $d = 7 - 12 = -5$, so A is true; R has the subtraction the wrong way round.
15. (a) The differences are 3, 4, 5, not all equal; R is the reason.
16. (d) $a_{15} = 4 + 14 \times 5 = 74$, so A is false; R is true.
17. (b) $\frac{50 \times 51}{2} = 1275$; R is true but does not explain A.
18. $d = 2\sqrt{2}$; $a_8 = \sqrt{2} + 14\sqrt{2} = 15\sqrt{2}$.
19. 30 terms; $S = 15 \times 93 = 1395$.
20. $(2k - 1) - k = (2k + 1) - (2k - 1)$ gives $k = 3$; the terms are 3, 5, 7.
21. $S_{12} = 6 \times (10 + 33) = 258$.
22. $\frac{n}{2}[20 + 5(n - 1)] = 1150$ gives $(n + 23)(n - 20) = 0$, so
    **20** weeks.
23. $d = 5$, $a = 6$, $a_{20} = 6 + 95 = 101$.
24. $13, 17, \ldots, 97$: 22 terms, sum $11 \times 110 = 1210$.
25. - $a_9 = a + 8d = 0$, so $a = -8d$.
    - $a_{29} = a + 28d = -8d + 28d = 20d$.
    - $a_{19} = a + 18d = -8d + 18d = 10d$.
    - So $a_{29} = 2 \times 10d = 2a_{19}$.
26. - $d = b - a$. *(second term minus first)*
    - $c = a + (n - 1)(b - a)$, so $n - 1 = \dfrac{c - a}{b - a}$. *(the last term)*
    - $n = \dfrac{c - a + b - a}{b - a} = \dfrac{b + c - 2a}{b - a}$.
    - $S = \dfrac{n}{2}(a + c) = \dfrac{(a + c)(b + c - 2a)}{2(b - a)}$. *(sum from first and last terms)*

    Check with the AP 2, 5, 8, 11: $\dfrac{13 \times 12}{2 \times 3} = 26 = 2 + 5 + 8 + 11$.
27. The three middle terms are the 18th, 19th and 20th, and their sum is
    $3a_{19}$, so $a + 18d = 75$. The last three add to $3a_{36}$, so
    $a + 35d = 143$. Then $17d = 68$, $d = 4$, $a = 3$: the AP is
    $3, 7, 11, \ldots, 147$.
28. $5(2a + 900) = 33000$ gives $a = 2850$: **₹2850** in the first month.
    Month $n$: $2850 + 100(n - 1) > 3500$ needs $n - 1 > 6.5$, so **month 8**
    (₹3550).
29. (a) 78 seats (b) row 16 (c) 1350 seats
30. (a) 7.5 km (b) week 15 (c) 52.5 km
