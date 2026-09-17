# Class 10 · Mathematics I · Chapter 13 — Statistics

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set — *Exercise Set 13.1, Q2* — so it can be used beside the book
without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file**, from the tables printed on the pages.
A question renumbered in the book and not here is how this goes wrong.

Each mean is worked by the step-deviation method unless the question asks
for another; $a$ is the assumed mean and $h$ the class size. Values are
rounded to two decimal places where they do not come out exactly.

---

## 13.2 Mean of Grouped Data

### The questions in the running text

*Tables 13.1 and 13.3 use the same data and the same formula, but the two
means are different. Why, and which one is more accurate?* Answered in the
text that follows: the grouped mean takes every mark in a class to be the
class mark, so 62 is an estimate; 59.3, from the marks themselves, is exact.

### Activity 1

With $a = 17.5$ the $d_i$ are 0, 15, 30, 45, 60 and 75, so
$\sum f_id_i = 0 + 45 + 210 + 270 + 360 + 450 = 1335$ and
$\bar{x} = 17.5 + \dfrac{1335}{30} = 17.5 + 44.5 = 62$.
With $a = 92.5$, $\sum f_id_i = -150 - 180 - 315 - 180 - 90 + 0 = -915$ and
$\bar{x} = 92.5 - 30.5 = 62$. Every choice of $a$ gives 62.

Why:
- $\dfrac{\sum f_i(x_i - a)}{\sum f_i} = \bar{x} - a$ for every number $a$.
- So $a + \dfrac{\sum f_id_i}{\sum f_i} = a + (\bar{x} - a) = \bar{x}$, and
  $a$ cancels.

### Activity 2

Answers will vary with each class's data. One worked instance, the heights
of 30 students:

| Height (in cm) | 140 – 145 | 145 – 150 | 150 – 155 | 155 – 160 | 160 – 165 |
|---|---|---|---|---|---|
| Number of students | 3 | 6 | 10 | 7 | 4 |

With $a = 152.5$ and $h = 5$, the $u_i$ are $-2$, $-1$, 0, 1, 2 and
$\sum f_iu_i = -6 - 6 + 0 + 7 + 8 = 3$, so
$\bar{x} = 152.5 + 5 \times \dfrac{3}{30} = 153$ cm. The step-deviation
method suits it, because the class marks are large and the classes are of
equal size. A table must have classes with no gaps and no overlaps, and
frequencies that add up to the number of students.

### Exercise Set 13.1

1. Class marks 1, 3, 5, 7, 9, 11, 13; $\sum f_i = 20$.
   $\sum f_ix_i = 1 + 6 + 5 + 35 + 54 + 22 + 39 = 162$, so
   $\bar{x} = \dfrac{162}{20} = 8.1$. **Mean 8.1 plants.** The direct method,
   because the class marks and frequencies are small.
2. $a = 550$, $h = 20$: $\sum f_iu_i = -24 - 14 + 0 + 6 + 20 = -12$,
   $\sum f_i = 50$, so $\bar{x} = 550 + 20 \times \dfrac{-12}{50} = 545.2$.
   **Mean ₹545.20.**
3. $a = 18$, $h = 2$: $\sum f_iu_i = -21 - 12 - 9 + 0 + f + 10 + 12 = f - 20$.
   The mean is $a$ itself, so $\sum f_iu_i = 0$. **$f = 20$.**
   Check: $\dfrac{1152}{64} = 18$.
4. $a = 75.5$, $h = 3$: $\sum f_iu_i = -6 - 8 - 3 + 0 + 7 + 8 + 6 = 4$,
   $\sum f_i = 30$, so $\bar{x} = 75.5 + 3 \times \dfrac{4}{30} = 75.9$.
   **Mean 75.9 beats a minute.**
5. Class marks 51, 54, 57, 60, 63 (the gaps do not move a class mark).
   $a = 57$, $h = 3$: $\sum f_iu_i = -30 - 110 + 0 + 115 + 50 = 25$,
   $\sum f_i = 400$, so $\bar{x} = 57 + 3 \times \dfrac{25}{400} = 57.19$.
   **Mean 57.19 mangoes.** The step-deviation method, because the
   frequencies are large.
6. $a = 225$, $h = 50$: $\sum f_iu_i = -8 - 5 + 0 + 2 + 4 = -7$,
   $\sum f_i = 25$, so $\bar{x} = 225 + 50 \times \dfrac{-7}{25} = 211$.
   **Mean ₹211.**
7. Class marks 0.02, 0.06, …, 0.22. $a = 0.10$, $h = 0.04$:
   $\sum f_iu_i = -8 - 9 + 0 + 2 + 8 + 6 = -1$, $\sum f_i = 30$, so
   $\bar{x} = 0.10 + 0.04 \times \dfrac{-1}{30} = 0.099$.
   **Mean 0.099 ppm.**
8. The classes are of different sizes, so use the direct method. Class marks
   3, 8, 12, 17, 24, 33, 39.
   $\sum f_ix_i = 33 + 80 + 84 + 68 + 96 + 99 + 39 = 499$, so
   $\bar{x} = \dfrac{499}{40} = 12.48$. **Mean 12.48 days.**
9. $a = 70$, $h = 10$: $\sum f_iu_i = -6 - 10 + 0 + 8 + 6 = -2$,
   $\sum f_i = 35$, so $\bar{x} = 70 + 10 \times \dfrac{-2}{35} = 69.43$.
   **Mean 69.43%.**

## 13.3 Mode of Grouped Data

### Activity 3

Answers will vary. For the heights in Activity 2 the modal class is
150 – 155, with $f_1 = 10$, $f_0 = 6$, $f_2 = 7$, so the mode is
$150 + \dfrac{10 - 6}{20 - 6 - 7} \times 5 = 152.86$ cm, against the mean of
153 cm. The mode says which height is most common; the mean is the average
height. The two are close because the frequencies rise to one peak and fall
away evenly.

### Exercise Set 13.2

1. Modal class 35 – 45: $l = 35$, $f_1 = 23$, $f_0 = 21$, $f_2 = 14$,
   $h = 10$. Mode $= 35 + \dfrac{23 - 21}{46 - 21 - 14} \times 10 = 36.82$.
   Mean: $a = 30$, $h = 10$, $\sum f_iu_i = -12 - 11 + 0 + 23 + 28 + 15 = 43$,
   $\sum f_i = 80$, so $\bar{x} = 30 + 10 \times \dfrac{43}{80} = 35.38$.
   **Mode 36.82 years, mean 35.38 years.** More patients were about 36.82
   years old than any other age, while the average age of a patient was
   35.38 years.
2. Modal class 60 – 80: $l = 60$, $f_1 = 61$, $f_0 = 52$, $f_2 = 38$,
   $h = 20$. Mode $= 60 + \dfrac{61 - 52}{122 - 52 - 38} \times 20 = 65.625$.
   **Modal lifetime 65.625 hours.**
3. Modal class 1500 – 2000: $l = 1500$, $f_1 = 40$, $f_0 = 24$, $f_2 = 33$,
   $h = 500$. Mode $= 1500 + \dfrac{40 - 24}{80 - 24 - 33} \times 500 = 1847.83$.
   Mean: $a = 2750$, $h = 500$,
   $\sum f_iu_i = -72 - 80 - 33 + 0 + 30 + 44 + 48 + 28 = -35$,
   $\sum f_i = 200$, so $\bar{x} = 2750 + 500 \times \dfrac{-35}{200} = 2662.5$.
   **Mode ₹1847.83, mean ₹2662.50.**
4. Modal class 30 – 35: $l = 30$, $f_1 = 10$, $f_0 = 9$, $f_2 = 3$, $h = 5$.
   Mode $= 30 + \dfrac{10 - 9}{20 - 9 - 3} \times 5 = 30.625$.
   Mean: $a = 32.5$, $h = 5$,
   $\sum f_iu_i = -9 - 16 - 9 + 0 + 3 + 0 + 0 + 8 = -23$, $\sum f_i = 35$, so
   $\bar{x} = 32.5 + 5 \times \dfrac{-23}{35} = 29.21$.
   **Mode 30.6, mean 29.2 students per teacher.** Most states have about
   30.6 students per teacher; on average a state has 29.2.
5. Modal class 4000 – 5000: $l = 4000$, $f_1 = 18$, $f_0 = 4$, $f_2 = 9$,
   $h = 1000$. Mode $= 4000 + \dfrac{18 - 4}{36 - 4 - 9} \times 1000 = 4608.70$.
   **Mode 4608.7 runs.**
6. Modal class 40 – 50: $l = 40$, $f_1 = 20$, $f_0 = 12$, $f_2 = 11$,
   $h = 10$. Mode $= 40 + \dfrac{20 - 12}{40 - 12 - 11} \times 10 = 44.71$.
   **Mode 44.7 cars.**

## 13.4 Median of Grouped Data

### The question in the running text

*From Table 13.11, the 50th observation is 28 and the 51st observation is
29. (Why?)* The cumulative frequency up to 25 marks is 26 and up to 28 marks
is 50, so the 27th to the 50th observations are all 28. The cumulative
frequency up to 29 is 78, so the 51st to the 78th are all 29.

### Exercise Set 13.3

1. Cumulative frequencies 4, 9, 22, 42, 56, 64, 68; $n = 68$,
   $\frac{n}{2} = 34$, median class 125 – 145 with $cf = 22$, $f = 20$.
   Median $= 125 + \dfrac{34 - 22}{20} \times 20 = 137$.
   Mean: $a = 135$, $h = 20$, $\sum f_iu_i = -12 - 10 - 13 + 0 + 14 + 16 + 12 = 7$,
   so $\bar{x} = 135 + 20 \times \dfrac{7}{68} = 137.06$.
   Mode: modal class 125 – 145, $f_1 = 20$, $f_0 = 13$, $f_2 = 14$:
   $125 + \dfrac{20 - 13}{40 - 13 - 14} \times 20 = 135.77$.
   **Median 137 units, mean 137.06 units, mode 135.77 units** — all three
   nearly equal.
2. $5 + x + 20 + 15 + y + 5 = 60$, so $x + y = 15$. The median 28.5 lies in
   20 – 30, with $cf = 5 + x$ and $f = 20$:
   $28.5 = 20 + \dfrac{30 - 5 - x}{20} \times 10$, so $8.5 \times 2 = 25 - x$
   and $x = 8$. **$x = 8$, $y = 7$.**
3. The classes are 18 – 20, 20 – 25, 25 – 30, …, 55 – 60, with frequencies
   2, 4, 18, 21, 33, 11, 3, 6, 2. $n = 100$, $\frac{n}{2} = 50$; the
   cumulative frequencies are 2, 6, 24, 45, 78, …, so the median class is
   35 – 40, with $cf = 45$, $f = 33$.
   Median $= 35 + \dfrac{50 - 45}{33} \times 5 = 35.76$. **Median age 35.76
   years.**
4. Continuous classes 117.5 – 126.5, …, 171.5 – 180.5; cumulative
   frequencies 3, 8, 17, 29, 34, 38, 40. $\frac{n}{2} = 20$, median class
   144.5 – 153.5 with $cf = 17$, $f = 12$, $h = 9$.
   Median $= 144.5 + \dfrac{20 - 17}{12} \times 9 = 146.75$.
   **Median length 146.75 mm.**
5. Cumulative frequencies 14, 70, 130, 216, 290, 352, 400.
   $\frac{n}{2} = 200$, median class 3000 – 3500 with $cf = 130$, $f = 86$.
   Median $= 3000 + \dfrac{200 - 130}{86} \times 500 = 3406.98$.
   **Median lifetime 3406.98 hours.**
6. Cumulative frequencies 6, 36, 76, 92, 96, 100. $\frac{n}{2} = 50$, median
   class 7 – 10 with $cf = 36$, $f = 40$:
   median $= 7 + \dfrac{50 - 36}{40} \times 3 = 8.05$.
   Mean: $a = 8.5$, $h = 3$, $\sum f_iu_i = -12 - 30 + 0 + 16 + 8 + 12 = -6$,
   so $\bar{x} = 8.5 + 3 \times \dfrac{-6}{100} = 8.32$.
   Mode: modal class 7 – 10, $f_1 = 40$, $f_0 = 30$, $f_2 = 16$:
   $7 + \dfrac{40 - 30}{80 - 30 - 16} \times 3 = 7.88$.
   **Median 8.05, mean 8.32, mode 7.88 letters.**
7. Cumulative frequencies 2, 5, 13, 19, 25, 28, 30. $\frac{n}{2} = 15$,
   median class 55 – 60 with $cf = 13$, $f = 6$.
   Median $= 55 + \dfrac{15 - 13}{6} \times 5 = 56.67$.
   **Median weight 56.67 kg.**

---

## Beyond the Book

### Stage 1 · Using What You Know

Each of the five questions is answered in the running text that follows it
on the page: (1) 72, and 124 when the class marks are doubled;
(2) $p = 5$, $q = 3$; (3) the mode is about 36; (4) median class 20 – 30,
median 23.85; (5) mean ₹888.57, median ₹540, and the median describes a
typical wage better.

### Stage 3 · Practice

Multiple choice and assertion–reason, as the key prints it:
1 (b), 2 (c), 3 (d), 4 (a), 5 (a), 6 (d), 7 (c), 8 (b), 9 (d), 10 (b),
11 (c), 12 (c), 13 (b), 14 (a), 15 (a), 16 (c), 17 (b), 18 (d).

The working for each:

1. $\dfrac{35 + 50}{2} = 42.5$.
2. $u_i = \dfrac{x_i - a}{h}$, by definition.
3. The highest frequency, 12, is in 10 – 15.
4. $\dfrac{2 + 2 + 3 + 4 + 25}{10} = 3.6$.
5. $3\,\text{Median} = \text{Mode} + 2\,\text{Mean}$, rearranged.
6. Adding 5 to every $x_i$ adds $5 \times \sum f_i$ to $\sum f_ix_i$.
7. $a = 25$, $h = 10$: $\sum f_iu_i = 2 - k = 0$, so $k = 2$.
8. $\dfrac{21 + 2 \times 24}{3} = 23$.
9. $34 - 12 = 22$.
10. $\dfrac{4 + 36 + 80 + 56}{20} = 8.8$.
11. Cumulative frequencies 2, 8, 16, 20; median $8 + \dfrac{10 - 8}{8} \times 4 = 9$, so only Meera is right.
12. Mean 22.2, median 22.5, mode 23.64.
13. The median, because a few extreme wages pull the mean up.
14. Mode 36, median 35.33.
15. (a) $a + h\bar{u}$ is the same for every $a$; R is the reason.
16. (c) The mode is $10 + \dfrac{9 - 4}{18 - 4 - 4} \times 10 = 15$, but R fails when $f_0 \neq f_2$.
17. (b) Both are true; R is about the mean, not the median.
18. (d) Doubling every frequency leaves the mean unchanged; R is true.
19. Class size $52 - 47 = 5$; classes 44.5 – 49.5, 49.5 – 54.5, 54.5 – 59.5, 59.5 – 64.5.
20. $\dfrac{1015}{25} = 40.6$.
21. $\dfrac{24 + 2 \times 30}{3} = 28$.
22. Frequency $29 - 14 = 15$; $\frac{n}{2} = 17.5$, so the median class is 10 – 15.
23. $a = 150$, $h = 20$, $\sum f_iu_i = -11$, $\sum f_i = 60$: $150 + 20 \times \dfrac{-11}{60} = 146.33$.
24. Modal class 15 – 20: $15 + \dfrac{17 - 13}{34 - 13 - 9} \times 5 = 16.67$.
25. Cumulative frequencies 7, 20, 40, 56, 60; median $40 + \dfrac{30 - 20}{20} \times 20 = 50$.
26. $156 + 10p = 9.8 \times (16 + p)$, so $0.2p = 0.8$ and $p = 4$. Check: $\dfrac{196}{20} = 9.8$.
27. Mean $\dfrac{1500}{50} = 30$; median $30 + \dfrac{25 - 24}{15} \times 10 = 30.67$; mode $30 + \dfrac{15 - 10}{30 - 10 - 5} \times 10 = 33.33$.
28. Frequencies 5, 10, 15, 18, 8, 4. Median class 30 – 40 (the first cumulative frequency above 30 is 48): median $30 + \dfrac{30 - 30}{18} \times 10 = 30$. Mode $30 + \dfrac{18 - 15}{36 - 15 - 8} \times 10 = 32.31$.
29. $p + q = 19$; $35 = 30 + \dfrac{25 - 14 - p}{12} \times 10$ gives $11 - p = 6$, so $p = 5$ and $q = 14$.
30. (a) 70 – 80 (b) $75 + 10 \times \dfrac{2}{40} = 75.5$ (c) $70 + \dfrac{20 - 12}{14} \times 10 = 75.71$ (d) $70 + \dfrac{14 - 8}{28 - 8 - 10} \times 10 = 76$
31. (a) 30 plants (b) $30 - 12 = 18$ (c) 20 – 25, since the less than cumulative frequencies are 8, 20, 38, 46, 50 (d) $20 + \dfrac{25 - 20}{18} \times 5 = 21.39$ cm
