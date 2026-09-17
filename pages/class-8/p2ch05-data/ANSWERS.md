# Class 8 · Mathematics II · Chapter 5 — Dots, and the Lines Between Them

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set — *Exercise Set 5.2, Q4* — so it can be used beside the book
without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file.** A question renumbered in the book and
not here is how this goes wrong.

Where a question asks the reader to choose or explain, the answer gives one
worked instance under *answers will vary*.

---

## 5.1–5.6 The mean and the median

### Exercise Set 5.1

1. - (i) $1 + 2 + \cdots + 50 = 1275$, and $1275 \div 50 = 25.5$.
   - (ii) $1 + 3 + \cdots + 99 = 2500$, and $2500 \div 50 = 50$.
   - (iii) $4 + 8 + \cdots + 200 = 5100$, and $5100 \div 50 = 102$.
   - The third mean is $4 \times 25.5 = 102$: every value of (iii) is $4$
     times the matching value of (i), so the mean is $4$ times as large.

2. Below $8$: $3 + 2 = 5$ (from $5$ and $6$). Above $8$: $1 + 4 = 5$ (from
   $9$ and $12$). The totals balance, so the mean is $8$.

3. $10.375 \times 8 = 83$ and $8 + 13 + 10 + 4 + 5 + 20 + 10 = 70$, so
   **$y = 13$**.

4. $15 \times 134 = 2010$.

5. **$20$.** The two new values have their own mean $(12 + 28) \div 2 = 20$,
   which is the collection's mean: $12$ is $8$ below and $28$ is $8$ above, so
   they balance each other and the fulcrum does not move.

6. Sixteen values: the median is the average of the 8th and 9th, which are
   $41$ and $41$, so the **median is $41$**.
   - (i) **Any value at all.** With seventeen values the median is the 9th.
     A new value at or below $41$ pushes the old 8th ($41$) into 9th place;
     one at or above $41$ leaves the old 9th ($41$) there.
   - (ii) **Any value.** With fifteen values the median is the 8th. Removing
     a value from the lower half makes the old 9th ($41$) the 8th; removing
     one from the upper half leaves the old 8th ($41$) in place.
   - (iii) The two middle values are equal. Whichever way the middle shifts
     by one place, it lands on a $41$.

7. - (i) **Never true.** Removing a value below the median can only move the
     middle up or leave it. Example: $1, 5, 9$ has median $5$; remove $1$
     and it is $(5 + 9) \div 2 = 7$.
   - (ii) **Always true.** A value below the mean adds more to the left of the
     balance than to the right. Example: $2, 4, 6$ has mean $4$; include $1$
     and it is $13 \div 4 = 3.25$.
   - (iii) **Sometimes true.** $1, 2, 3$ with $0, 0, 5, 5$ included keeps
     median $2$; with $10, 10, 10, 10$ included the median is $10$.
   - (iv) **Never true.** Four values below the median push the middle down
     or leave it. Example: $4, 5, 6$ has median $5$; include $1, 1, 1, 1$
     and the median is the 4th of seven, $1$.

8. The ten known values sorted: $8, 8, 12, 18, 25, 29, 35, 39, 47, 73$. With
   $p$ there are eleven, and the median is the 6th. For $p \ge 29$ the 6th is
   $29$; for $p$ below $29$ the 6th is $25$ or $p$. So $p$ could be
   **$29$, $30$, $40$, $47$ or $100$**, and not $10$ or $25$.

9. The six days total $6 \times 4200 = 25200$ rupees. With the seventh the total
   is $25200 + 11000 = 36200$, so the mean becomes $36200 \div 7$, about
   ₹5,171.43 — **pinned down exactly**. The median of seven values is the 4th,
   which is the upper of the old two middle values: at least ₹3,900, and it
   **rises or stays**, but by how much cannot be said without the six figures.

### Examples 1–6 (worked on the page)

Example 1: balance $9$ both ways. Example 2: $12$; any pair adding to $24$.
Example 3: $149.2$ cm. Example 4: $43$ kg. Example 5: $25.4$. Example 6:
mean $28$ degrees; the peak is a peak among six readings only.

## 5.7 When the Data Comes in a Table

The thirty answers tally to $3$: 4, $4$: 7, $5$: 9, $6$: 5, $7$: 3, $8$: 2
(Fig. 5.3). Mean $152 \div 30 = 5.07$; median $5$.

### Exercise Set 5.2

1. | Siblings | 0 | 1 | 2 | 3 | 4 |
   |---|---|---|---|---|---|
   | Students | 5 | 10 | 6 | 3 | 1 |

   Sum $0 + 10 + 12 + 9 + 4 = 35$, so the **mean is $35 \div 25 = 1.4$**.
   The median is the 13th value; the running totals are $5, 15, \ldots$, so
   the **median is $1$**.

2. $62$ students. Smallest $1$, largest $10$. Sum
   $1 + 4 + 20 + 54 + 84 + 120 + 90 + 100 = 473$, so the **mean is
   $473 \div 62 = 7.63$**, to two places. The median is the average of the
   31st and 32nd; the running totals are $1, 1, 1, 2, 6, 15, 27, 42, \ldots$,
   so both are $8$ and the **median is $8$**.

3. - (i) Sum $0 + 5 + 8 + 9 + 4 = 26$, **mean $26 \div 15 = 1.73$**. The
     median is the 8th; running totals $2, 7, 11$, so the **median is $2$**.
   - (ii) Every value goes up by $1$, so the **mean is $41 \div 15 = 2.73$**
     and the **median is $3$**.
   - (iii) *Everyone used a cycle at least once* is **not valid**: two said
     none. *Almost everyone used one a few times* is loose: $13$ of $15$
     used one, but $5$ of those only once. Answers will vary on whether that
     is *a few*.

4. Sum $10 + 3f + 24 + 20 = 54 + 3f$ over $15 + f$ values, so
   $54 + 3f = 3.5 \times (15 + f) = 52.5 + 3.5f$, giving $0.5f = 1.5$ and
   **$f = 3$**.

5. The **mean is larger**. The table has a long tail on the large side:
   households of $7$ and $8$ are far above $5$ and pull the mean up, while
   the median only counts them as *above*.

6. $80 + 4x = 12 \times 12 = 144$, so $4x = 64$ and **$x = 16$**.

7. **Yes.** The sum must be $20 \times 3 = 60$, and the average of the 10th
   and 11th values must be $2$. Worked instance (answers will vary):

   | Value | 1 | 2 | 3 | 4 | 5 |
   |---|---|---|---|---|---|
   | Frequency | 0 | 11 | 3 | 1 | 5 |

   Sum $22 + 9 + 4 + 25 = 60$, mean $3$; the 10th and 11th are both $2$.

## 5.8–5.10 Lines, graphs and pictures

### In-text: three claims about Fig. 5.4

Answered on the page: not settled; true; not settled.

### Think and Reflect (rainfall in west-coast and east-coast cities)

Answers will vary. Worked instance: *Is the pattern the same every year?*
and *Do other cities on each coast follow it?* can be answered with more
rainfall data of the same kind. *Why do the peaks fall in different months?*
cannot: it needs data of another kind — the direction of the monsoon winds
in each season, and where the mountains stand.

### Exercise Set 5.3

1. At 7:30 am the line is halfway between $22$ and $26$: **about $24$
   degrees**. At 4:30 pm it is halfway between $34$ and $30$: **about $32$
   degrees**. Answers will vary on which is closer; a good answer: the
   **7:30 am** estimate, because the morning warms steadily, while the
   afternoon stretch contains the day's true peak, which could lie anywhere
   between the readings, so the line may be well off there.

2. - (i) The drawing must show months January to June evenly spaced on the
     horizontal axis, levels in metres on the vertical axis from $0$, the six
     points $9, 8, 6, 3, 2, 1$ plotted, and joined by straight segments.
   - (ii) The falls are $1, 2, 3, 1, 1$: fastest **in March** (from $6$ m on
     1 March to $3$ m on 1 April). It is the steepest segment.
   - (iii) About **$2.5$ m**, halfway between $3$ and $2$. It assumes the level
     fell steadily through April.

3. - (i) **Follows**: $34$ at 3 pm against $26$ at 9 am, both measured.
   - (ii) **Does not follow**: the line reads a little over $28$ there, and it
     is an estimate, not a measurement.
   - (iii) **Not settled**: three readings rose, but nothing was measured in
     between.
   - (iv) **Not settled**: $34$ is the highest *reading*; the day may have been
     hotter between readings.

4. - (i) The axis does not start at $0$, so the bar lengths are not in
     proportion to the scores and small differences look large.
   - (ii) The gaps between the years are $20$, $10$ and $20$ years but are
     drawn equal, so the slopes (the rates of growth) are wrong.
   - (iii) Without a unit the values cannot be read — a reader cannot tell
     what the numbers measure.

5. Last year: $80 + 3 \times 10 = 110$. This year: $80 + 6 \times 10 = 140$.
   The rise is $30$, which is $\tfrac{3}{11}$ of last year's (about $27$ per
   cent), not double.

6. The lunch break starts at **noon** and lasts **one hour** (two boxes).
   The journey to school takes **one hour** (two boxes, 7:30 to 8:30 am).
   Answers will vary for the Sunday strip; worked instance: no school or
   travel blocks, a longer sleep in the morning, and more *other* boxes.

7. The values are $1, 2, 4, 8, 16, 32, 64$. The drawing must show years
   $0$ to $6$ and these seven points joined by straight segments. Halfway
   through the first year the straight segment reads $(1 + 2) \div 2 = 1.5$,
   but a quantity that doubles every year has grown only by the factor
   $\sqrt{2}$ in half a year, about $1.41$. Each year's growth happens
   faster at the end than at the start, so the curve sags below every
   segment and the segments overstate it.

---

## Beyond the Book

### Stage 1 · Using What You Know

Each of the eight questions is answered in the running text that follows it
on the page. The results, for reference: (1) $14$; (2) $18$; (3) $11$;
(4) the median stays $20$, the mean rises to $21$; (5) $x = 9$;
(6) $149.3$ cm; (7) same values, steeper-looking slopes, months under
$100$ mm not shown; (8) ₹4,300.

### Stage 2 · Solved Examples

Worked on the page, Examples 1 to 13.

### Stage 3 · Practice

Multiple choice and assertion–reason, as the key prints it:
1 (a), 2 (b), 3 (d), 4 (a), 5 (c), 6 (d), 7 (b), 8 (b), 9 (c), 10 (a),
11 (a), 12 (c), 13 (b), 14 (d).

The working for each:

1. The distances below and above the mean balance.
2. The median is the middle of the sorted data.
3. A value equal to the mean sits on the fulcrum.
4. Each value gains $6$, so the mean gains $6$.
5. The sum is multiplied by $4$ and the count is not, so the mean is $4a$.
6. Divide by the total of the frequencies.
7. Sorted: $3, 5, 7, 9, 12, 13$; $(7 + 9) \div 2 = 8$.
8. $6 \times 10 + 17 = 77$ and $77 \div 7 = 11$.
9. The running total says which value is in each position.
10. Time.
11. (a) $4 + 9 + 11 + 16 = 40$ and $40 \div 4 = 10$; below: $6 + 1 = 7$,
    above: $1 + 6 = 7$. R is why A holds.
12. (c) A is true; R is false, since $3, 6, 8, 9, 11, 14$ has median $8.5$.
13. (b) Both true ($110 \div 5 = 22$), but the mean does not decide the median.
14. (d) $(2 \times 5 + 6 \times 1) \div 6 = 16 \div 6$, about $2.67$, not $4$;
    R is true.
15. Mean $35 \div 5 = 7$; median $7$.
16. $8 \times 12.5 = 100$.
17. $36 \div 4 = 9$.
18. The 11th; for twenty, the average of the 10th and 11th.
19. $135 - 100 = 35$.
20. Mean $140 \div 10 = 14$; median $(14 + 15) \div 2 = 14.5$.
21. Mean $36 \div 20 = 1.8$; median $2$.
22. $1179 \div 30 = 39.3$.
23. $414 - 385 = 29$.
24. (a) A line graph of a few degrees' change: cutting the axis is allowed,
    and must be marked. (b) 2 pm to 4 pm, a fall of $1.5$. (c) About
    $102.75$. (d) $609 \div 6 = 101.5$. (e) No — $103$ is the highest reading
    only. The drawing must show the six times evenly spaced (two hours
    apart), the vertical axis marked from $98$, and the six points joined.
25. (a) Mean $84 \div 12 = 7$; median $(7 + 8) \div 2 = 7.5$. (b) Mean
    $91 \div 13 = 7$; median $7$. (c) The new score equals the mean, so the
    mean stays; it is below the old median, so the median falls.
26. (a) Mean $270 \div 6 = 45$; median $(42 + 45) \div 2 = 43.5$. (b) The mean,
    because of Saturday's $56$. (c) Mean $315 \div 7 = 45$; median $45$.
27. (a) $(160 + 220) \div 2 = 190$ mm. (b) Below: $70 + 40 = 110$; above:
    $90 + 20 = 110$. (c) Bars of $30$ and $190$: July's looks more than $6$
    times June's; really $290 \div 130$ is about $2.2$ times.
