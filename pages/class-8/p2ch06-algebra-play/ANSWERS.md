# Class 8 · Mathematics II · Chapter 6 — Why the Trick Always Works

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set — *Exercise Set 6.3, Q2* — so it can be used beside the book
without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file.** A question renumbered in the book and
not here is how this goes wrong.

Where a question asks the reader to choose, design or explain, the answer
gives one worked instance under *answers will vary*.

---

## 6.2 Think of a Number · 6.3 A Date in One Number

### Exercise Set 6.1

1. With *add four* replaced by *add* $k$, the steps give
   $\dfrac{2x + k}{2} - x = \dfrac{k}{2}$, so the answer is half of what is added.
   - (a) add $12$: **$6$**.
   - (b) add $9$: **$4.5$**. The trick still ends at one number for everybody,
     but $2x + 9$ is odd, so the halving no longer gives a whole number.
   - (c) add $0$: **$0$**.

2. Answers will vary. One trick: *think of a number, double it, add $20$,
   halve it, subtract the number you thought of.* In letters:
   $x \to 2x \to 2x + 20 \to x + 10$, and $x + 10 - x = 10$.

3. **$3$.** $x \to x + 5 \to 2x + 10 \to 2x + 6 \to x + 3$, and
   $x + 3 - x = 3$. The unknown disappears at the last step, when the number
   thought of is subtracted; the halving before it has already brought $2x$
   back to $x$.

4. **Subtract $175$.** $(5m + 6) \times 4 = 20m + 24$, then
   $(20m + 24 + 11) \times 5 = 100m + 175$, and the day is added.

5. **The fourteenth of July.** $879 - 165 = 714 = 100 \times 7 + 14$.

6. The multipliers give $20m + d$ plus a fixed number $K$, so two dates with
   the same $20m + d$ give the same answer. Answers will vary; for example
   **21 January and 1 February**: $20 \times 1 + 21 = 41$ and
   $20 \times 2 + 1 = 41$. A day can be as large as $31$, so it spills into
   the month's place, which only moves in steps of $20$.

## 6.4 Number Pyramids · 6.5 What the Top Counts

### Think and Reflect (the Virahānka–Fibonacci pyramid)

The numbers run $1, 2, 3, 5, 8, 13, 21, \ldots$, each the sum of the two
before it. With $1, 2, 3$ along the bottom, the middle row is $1 + 2 = 3$
and $2 + 3 = 5$, and the top is $3 + 5 = 8$.

Every entry is one of these numbers because two neighbours in the list add to
the next number in the list: a row of consecutive terms makes, above it, a row
of consecutive terms that starts two places further on.

- Four rows, bottom $1, 2, 3, 5$: then $3, 5, 8$; then $8, 13$; top **$21$**,
  the 7th number. (Check: $1 + 3 \times 2 + 3 \times 3 + 5 = 21$.)
- Twenty-nine rows, bottom the first 29 numbers: each row up moves two
  places along, so the top is the number in place $1 + 2 \times 28 = 57$,
  which is **$591\,286\,729\,879$**. Saying *the 57th number* is a full
  answer at this level.

### Exercise Set 6.2

1. The top is $a + 2b + c$.
   - (a) $4 + 26 + 8 =$ **$38$**
   - (b) $7 + 22 + 3 =$ **$32$**
   - (c) $10 + 28 + 25 =$ **$63$**

2. The top is $a + 3b + 3c + d$.
   - (a) $8 + 57 + 63 + 13 =$ **$141$**
   - (b) $7 + 54 + 57 + 6 =$ **$124$**
   - (c) $9 + 21 + 15 + 11 =$ **$56$**

3. **$a + 4b + 6c + 4d + e$.** The next row of Fig. 6.4 is made by adding
   neighbours in $1, 3, 3, 1$: it is $1, 4, 6, 4, 1$.

4. Call the middle of the bottom row $c$; the top is (left end) $+ 2c +$
   (right end).
   - (a) $4 + 2c + 6 = 50$, $c = 20$: bottom **$4, 20, 6$**, middle
     **$24, 26$**, top $50$.
   - (b) $5 + 2c + 7 = 40$, $c = 14$: bottom **$5, 14, 7$**, middle
     **$19, 21$**, top $40$.
   - (c) $9 + 2c + 7 = 36$, $c = 10$: bottom **$9, 10, 7$**, middle
     **$19, 17$**, top $36$.

5. Answers will vary. The top is $a + 2b + c = 14$, so choose the middle
   entry $b$ first and then two ends adding to $14 - 2b$. For example
   **$6, 3, 2$**: middle row $9, 5$, top $14$. (Other whole-number rows
   include $1, 6, 1$ and $3, 4, 3$.)

6. **$x = 14$.** $6 + 3x + 3x + 10 = 6x + 16 = 100$, so $6x = 84$.
   A top of $101$ would need $6x + 16 = 101$, that is $6x = 85$, and $85$ is
   not a multiple of $6$. (Put another way: $6x + 16$ is always even, and
   $101$ is odd.)

7. The fifth row of multipliers is **$1, 4, 6, 4, 1$**. The **middle** box has
   the most routes to the top, **$6$** of them, so raising the middle entry by
   $1$ lifts the top the most, by $6$.

## 6.6 A Square on a Calendar · 6.7 Shapes That Stand for Numbers

### Exercise Set 6.3

1. The total is $4a + 16$ for the top-left date $a$.
   - (a) $4a + 16 = 60$, $a = 11$: **$11, 12, 18, 19$**
   - (b) $4a + 16 = 96$, $a = 20$: **$20, 21, 27, 28$**
   - (c) $4a + 16 = 84$, $a = 17$: **$17, 18, 24, 25$**

2. **$44$, $76$ and $92$** can; **$58$** cannot. A total less $16$ must be a
   multiple of $4$: $44$ gives $a = 7$, $76$ gives $a = 15$, $92$ gives
   $a = 19$, but $58 - 16 = 42$ is not a multiple of $4$.

3. **$171$.** Nine times the centre: $9 \times 19 = 171$. On the August page
   the square holds $11, 12, 13$; $18, 19, 20$; $25, 26, 27$, and
   $36 + 57 + 78 = 171$.

4. The six dates are $a$, $a + 1$, $a + 7$, $a + 8$, $a + 14$, $a + 15$, and
   they total **$6a + 45 = 3(2a + 15)$**: always a multiple of $3$ (and
   always odd).

5. Three squares make $18$, so a **square is $6$**; then $6$ and two stars make
   $22$, so a **star is $8$**.

6. $2c + t = 21$ and $c + 2t = 18$. From the first, $t = 21 - 2c$; then
   $c + 42 - 4c = 18$, so $3c = 24$: a **circle is $8$** and a **triangle is
   $5$**. Check: $8 + 10 = 18$.

7. The total is $4a + 16$, and the square needs $a + 8 \le 31$, so the total
   is at most $4 \times 23 + 16 = 108$. The only multiple of $100$ it can be
   is $100$, which gives $a = 21$: the one square is **$21, 22, 28, 29$**, on
   any month with at least $29$ days in which the $21$st is not the last day
   of its week.

## 6.8 The Largest Product · 6.9 Turning a Number Round

### Exercise Set 6.4

1. The largest digit multiplies and the other two go in decreasing order.
   - (a) $31 \times 7 =$ **$217$**
   - (b) $62 \times 8 =$ **$496$**
   - (c) $54 \times 9 =$ **$486$**

2. **The smallest digit multiplies, and the other two go in increasing
   order:** $qr \times p$ for $p < q < r$.
   - (a) $37 \times 1 = 37$ (b) $68 \times 2 = 136$ (c) $59 \times 4 = 236$

   Why: in each pair sharing a multiplier the smaller two-digit number wins,
   leaving $qr \times p$, $pr \times q$ and $pq \times r$, that is
   $10pq + pr$, $10pq + qr$ and $10pr + qr$. The first two share $10pq$, and
   $pr < qr$ because $p < q$. The third exceeds the first by
   $10p(r - q) + r(q - p)$, which is positive. So $qr \times p$ is smallest.

3. The difference is $9$ times the gap between the digits, and
   $45 \div 9 = 5$, so **the digits differ by $5$**. Answers will vary:
   **$16$, $27$, $38$** (or $49$, $61$, $72$, $83$, $94$; and $50$, if its
   reverse is read as $5$). Check: $61 - 16 = 45$.

4. The sum is $11(a + b)$, so **the digits add to $132 \div 11 = 12$**. The
   numbers are **$39, 48, 57, 66, 75, 84, 93$**.

5. $(100a + 10b + c) - (100c + 10b + a) = 99a - 99c = 99(a - c)$, a multiple
   of $99$. The tens digit cancels entirely.

6. The total is $111(a + b + c)$, so **the digits add to
   $1554 \div 111 = 14$**. Answers will vary: **$158$**, since
   $158 + 581 + 815 = 1554$.

7. Writing $\overline{ab}$ twice gives $100 \times (10a + b) + (10a + b) =
   101 \times (10a + b)$; for example $3737 = 37 \times 101$. **$101$ is a
   prime**: it is not divisible by $2$, $3$, $5$ or $7$, and $11 \times 11 =
   121$ is already bigger than $101$. So it cannot be split into smaller whole
   factors, whereas $1001 = 7 \times 11 \times 13$.

## 6.10 Undoing What Was Done

### Think and Reflect (the genie's charge)

- Emptied in exactly three rounds: $2^{\,3}(x - c) + c = 0$, so $8x = 7c$
  and **$c = \dfrac{8x}{7}$**. Check: $x = 7$ gives $c = 8$, Karim's genie.
- In two rounds: $4(x - c) + c = 0$, so $4x = 3c$ and
  **$c = \dfrac{4x}{3}$**.
- The genie that waits charges less per round but collects more in all:
  three charges of $\dfrac{8x}{7}$ make $\dfrac{24x}{7}$, about $3.4x$, while
  two charges of $\dfrac{4x}{3}$ make $\dfrac{8x}{3}$, about $2.7x$. With
  $x = 7$: $3 \times 8 = 24$ coins against $2 \times \dfrac{28}{3}$, which is
  not even a whole number of coins.

### Exercise Set 6.5

1. Read as *the same number $c$ at each of the three shrines, and nothing
   left after the third* (see the flag in `EDIT-LOG.md`). With $x$ flowers:
   $2x - c$, then $4x - 3c$, then $8x - 7c = 0$. So $8x = 7c$, and the
   smallest whole answer is **$7$ flowers, with $8$ left at each shrine**:
   $14 - 8 = 6$, $12 - 8 = 4$, $8 - 8 = 0$.

2. **$20$ horses** (and $35$ hens).
   - (a) With $h$ horses: $4h + 2(55 - h) = 150$, so $2h + 110 = 150$ and
     $h = 20$.
   - (b) If all $55$ were hens there would be $110$ legs. The other $40$ legs
     come two at a time from each horse, so there are $40 \div 2 = 20$
     horses.

3. **$6$ years.** $5d + 6 = 3(d + 6)$, so $2d = 12$. The mother is $30$; in
   six years they are $36$ and $12$.

4. **Gauri $6$, Naina $12$.** With Gauri's $g$: $2g - 3 = g + 3$, so $g = 6$.
   After the gift both have $9$.

5. - (a) Costs are $5000 + 100 \times 10 = 6000$ rupees, so the sales must
     bring in $6000 + 2000 = 8000$: a price of **₹$80$**.
   - (b) Each dosa then earns $50 - 10 = 40$ rupees, and $5000 + 2000 = 7000$
     rupees are needed: **$175$ dosas**, since $7000 \div 40 = 175$.

6. Each fraction is **$\dfrac{1}{3}$**: $\dfrac{1 + 3}{5 + 7} = \dfrac{4}{12}$
   and $\dfrac{1 + 3 + 5}{7 + 9 + 11} = \dfrac{9}{27}$. The next is
   $\dfrac{1 + 3 + 5 + 7}{9 + 11 + 13 + 15} = \dfrac{16}{48} = \dfrac{1}{3}$.
   Why: the top is the first $n$ odd numbers, which add to $n^2$; top and
   bottom together are the first $2n$ odd numbers, which add to
   $(2n)^2 = 4n^2$. So the bottom is $4n^2 - n^2 = 3n^2$, and the fraction is
   $\dfrac{n^2}{3n^2} = \dfrac{1}{3}$.

7. **$14$ coins.** After the third doubling he holds $8x - 6c$, and this is
   the charge: $8x - 6 \times 16 = 16$, so $8x = 112$. Check:
   $28 - 16 = 12$, $24 - 16 = 8$, $16 - 16 = 0$.

8. Four shrines: $16x - 15c = 0$, so the smallest start is **$15$ flowers,
   with $16$ at each shrine**. For $n$ shrines: $2^{\,n}x = (2^{\,n} - 1)c$,
   and since $2^{\,n}$ and $2^{\,n} - 1$ share no factor, the smallest start
   is **$2^{\,n} - 1$ flowers, with $2^{\,n}$ left at each shrine**: one less
   than a power of two, and that power of two.

## Beyond the Book

### Stage 1 · Using What You Know

Each question is explained in the running text straight after it. The
answers:

1. $k = 10$.
2. The twenty-fifth of December: $1390 - 165 = 1225$.
3. $24$, $25$, $26$.
4. The top-left dates are $6$ and $13$, which differ by $7$: the second
   square sits directly below the first.
5. $12$, $24$, $36$ and $48$.
6. $87 \times 9 = 783$.
7. $24$, $25$, $26$, $27$.
8. $c = 48$.

### Stage 3 · Practice

Key, as the key prints it: 1 (c) 2 (b) 3 (c) 4 (a) 5 (a) 6 (d) 7 (a) 8 (b) 9 (c) 10 (d) 11 (b) 12 (c) 13 (d) 14 (b) 15 (a) 16 (d) 17 (a) 18 (b) 19 (c)

1. $2(x + 7) - 4 = 2x + 10$, halved is $x + 5$, and $x + 5 - x = 5$.
2. $1170 - 165 = 1005 = 100 \times 10 + 5$: the fifth of October.
3. $5 + 2 \times 8 + 3 = 24$.
4. $18 - 7 = 11$.
5. One row down is $+7$, one place left is $-1$: $a + 6$.
6. $4a + 16 = 72$ gives $a = 14$; the largest date is $a + 8 = 22$.
7. The total is $9$ times the centre; only $90$ is a multiple of $9$
   (centre $10$).
8. A circle is $21 \div 3 = 7$; two triangles are $19 - 7 = 12$; a triangle
   is $6$.
9. $64 \times 7 = 448$; the others are $304$, $444$ and $322$.
10. $9(a - b) = 63$, so the digits differ by $7$.
11. $11(a + b) = 143$, so $a + b = 13$.
12. $111(a + b + c)$, and $111 = 3 \times 37$.
13. $9(a - b) = 0$ only when $a = b$.
14. $15 \times 2 = 30$, $30 + 6 = 36$, $36 \div 4 = 9$.
15. $2^{\,3}(6 - 6) + 6 = 6$: each round $12 - 6 = 6$.
16. (d) A is false: $35$ is not a multiple of $9$. R is true.
17. (a) Both true; a multiple of $4$ is even.
18. (b) Both true; the reason is $11(a + b)$, not that $11$ is prime.
19. (c) A is true ($21 \times 3 = 63$ beats $31 \times 2 = 62$); R is false.
20. $4 \times 9 + 16 = 52$.
21. $10x + y$; reversed, $10y + x$.
22. $1 + 3 + 3 + 1 = 8$.
23. $\dfrac{6x + 18}{3} - 2x = 2x + 6 - 2x = 6$. Add $30$ in place of $18$:
    $\dfrac{6x + 30}{3} - 2x = 10$.
24. $6x + 6 = 48$, $x = 7$: bottom $7, 14, 13$; middle $21, 27$; top $48$.
25. $b - a = 3$ and $a + b = 11$: the number is $47$, and $74 - 47 = 27$.
26. Backwards from ₹$6$: $6 + 10 = 16$, doubled $32$; $32 + 10 = 42$,
    doubled $84$. She started with ₹$84$.
27. Centre $117 \div 9 = 13$; dates $5, 6, 7$; $12, 13, 14$; $19, 20, 21$,
    and $18 + 39 + 60 = 117$. In general $9a + 72 = 9(a + 8)$.
28. $2x + 24 = 60$, $x = 18$; rows $18, 3, 5, 18$; $21, 8, 23$; $29, 31$;
    $60$. Raising both ends by $1$ raises the top by $2$.
29. (a) $2x - 12$, $4x - 36$, $8x - 84$ (b) $8x - 84 = 52$, $x = 17$
    (c) when $x > 12$.
30. (a) $(2m + 3) \times 50 + d = 100m + 150 + d$ (b) Anu $979 - 150 = 829$:
    29 August; Bala $465 - 150 = 315$: 15 March; Chitra $1181 - 150 = 1031$:
    31 October (c) $1250 - 150 = 1100$ would be day $0$ of month $11$.
31. (a) $4 + 12 + 5 = 21$ (b) $3 + 2x + 7 = 34$, $x = 12$
    (c) $2 + 15 + 6 + 6 = 29$.
