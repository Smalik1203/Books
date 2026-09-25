# Class 9 · Mathematics I · Chapter 8 — What Comes Next

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set — *Exercise Set 8.2, Q1* — so it can be used beside the book
without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file.** A question renumbered in the book and
not here is how this goes wrong.

Where a question asks for your own example, the answers vary; one worked
instance is given.

---

## 8.1 Introduction

### Think and Reflect (the four lists)

1. The natural numbers go up by $1$: next $7, 8, 9$. The odd numbers go up by
   $2$: next $13, 15, 17$. The triangular numbers add the next natural number
   each time: next $28, 36, 45$. The square numbers add the next odd number:
   next $49, 64, 81$. Each rule is the right one because it comes from how the
   list is made — counting, the rows of a triangle of dots, the L-shaped layer
   added to a square — and not only from the six numbers shown.

### Exercise Set 8.1

1. (a) $18, 22, 26$ — add $4$ each time.
   (b) $16, 32, 64$ — double each time.
   (c) $64, 55, 46$ — take away $9$ each time.
2. $t_5 = 15$, $t_6 = 21$, $t_7 = 28$, $t_8 = 36$.
3. $13$. The seventh square is the sixth square with the seventh odd number
   added, and the seventh odd number is $2 \times 7 - 1 = 13$: $49 - 36 = 13$.
4. Answers vary. $2, 4, 6, 8$ is finite and $2, 4, 6, 8, \ldots$ is infinite.
   Nothing in the numbers tells them apart; only whether the list is said to
   stop.

## 8.2 The Explicit Rule

### Think and Reflect (squares and primes)

1. The square numbers have the explicit rule $t_n = n^2$. The primes have none
   that anyone knows: each prime is found by checking the numbers before it,
   and no formula names the $n$th prime from $n$ alone.

### Exercise Set 8.2

1. (a) $-1, 2, 5, 8, 11$
   (b) $-3, -8, -13, -18, -23$
   (c) $2, 3, 6, 11, 18$
2. $t_{10} = 47$ and $t_{15} = 72$.
3. Neither is a term. $5n + 3 = 97$ gives $5n = 94$, and $5n + 3 = 172$ gives
   $5n = 169$; neither is a multiple of $5$.
4. $5n - 3 = 607$ gives $5n = 610$, so $607$ is the $122$nd term.
5. $t_1 = 10$, $t_2 = 13$, $t_3 = 16$, $t_{12} = 43$, $t_{50} = 157$.
   $3n + 7 = 331$ gives $3n = 324$, so $331$ is the $108$th term. $557$ is not
   a term: $3n = 550$, not a multiple of $3$. Every term is $7$ more than a multiple of
   $3$, so it leaves remainder $1$ on division by $3$; $557$ leaves $2$.

## 8.3 The Recursive Rule

### Exercise Set 8.3

1. $-5, -2, 1, 4, 7$. The $n$th term is $-5 + 3(n - 1) = 3n - 8$, and
   $3n - 8 = 52$ gives $n = 20$: $52$ is the $20$th term.
2. $T_4 = 7$, $T_5 = 13$, $T_6 = 24$, $T_7 = 44$, $T_8 = 81$.
3. Recursive: $t_1 = 2$, $t_n = t_{n-1} + 3$. Explicit: $t_n = 3n - 1$.
   Which came first varies; usually the recursive one, since it is what the
   list shows.
4. By the recursive rule: $1, 4, 7, 10, 13, 16, 19, 22$, so $t_8 = 22$, after
   $7$ additions. By the explicit rule: $t_8 = 3 \times 8 - 2 = 22$, one
   multiplication and one subtraction.

## 8.4 Arithmetic Progressions

### Think and Reflect (which are APs)

1. APs so far: the natural numbers, the odd numbers, the tile pattern
   $4n - 3$, and the sequences $2n - 1$, $5n - 2$, $3n + 7$, $5n - 3$ and
   $5n + 3$. Not APs: the triangular numbers (differences $2, 3, 4, \ldots$
   grow), the square numbers (differences $3, 5, 7, \ldots$ grow), the primes
   (differences $1, 2, 2, 4, 2, \ldots$ follow no rule), and the recursions
   $u_n = 2u_{n-1} + 3$ and $s_n = s_{n-1}(s_{n-1} - 1)$, whose differences
   grow. In each case the precise failure is that the difference between
   consecutive terms is not the same every time.

### Exercise Set 8.4

1. $a = 3$, $d = 5$: $t_9 = 3 + 8 \times 5 = 43$ and $t_{26} = 3 + 25 \times 5 = 128$.
2. $t_n = 21 - 3(n - 1) = 24 - 3n$. $24 - 3n = -81$ gives $n = 35$: the $35$th
   term. **$0$ is a term:** $24 - 3n = 0$ gives $n = 8$, a whole number, so
   $0$ is the $8$th term.
3. $t_n = 11 - 3(n - 1) = 14 - 3n$. Recursive: $t_1 = 11$, $t_n = t_{n-1} - 3$.
4. (a) differences all $3$: $t_n = 3n - 1$
   (b) differences all $4$: $t_n = 4n - 9$
   (c) differences all $2$: $t_n = 2n - 0.5$

## 8.5 Adding Up the Naturals

### Think and Reflect (sums and triangular numbers)

1. $S_{20} = \dfrac{20 \times 21}{2} = 210$, $S_{50} = 1275$ and
   $S_{1000} = 500\,500$. The $10$th, $17$th and $80$th triangular numbers are
   $55$, $153$ and $3240$. The formula applies because the $n$th triangular
   number is exactly $1 + 2 + \cdots + n$: its rows hold $1, 2, \ldots, n$
   dots.

### Exercise Set 8.5

1. $a + 2d = 12$ and $a + 49d = 106$ give $47d = 94$, so $d = 2$ and $a = 8$.
   $t_{29} = 8 + 28 \times 2 = 64$.
2. The two-digit multiples of $3$ run $12, 15, \ldots, 99$: $\dfrac{99 - 12}{3} + 1 = 30$
   of them, with sum $\dfrac{30}{2}(12 + 99) = 1665$.
3. $5\,00\,000 + 20\,000k = 7\,00\,000$ gives $k = 10$: after $10$ years.
4. $1 + 2 + \cdots + 25 = \dfrac{25 \times 26}{2} = 325$ marbles.
5. $S_{100} - S_{99} = 100$. The first sum is the second with the $100$th term
   added, and the $100$th natural number is $100$.

## 8.6 Geometric Progressions

### Think and Reflect (the tile and doubling patterns)

1. The tile pattern $t_n = 4n - 3$ reaches $81$ at stage $21$. The doubling
   pattern $3 \times 2^{n-1}$ has $48$ at stage $5$ and $96$ at stage $6$, so it
   first passes $81$ at stage $6$. For a thousand: the tile pattern first
   exceeds $1000$ at stage $251$ (with $1001$), the doubling pattern at stage
   $10$ (with $1536$; stage $9$ has $768$). A GP with ratio above $1$ overtakes
   any AP, however slowly it starts.

### Think and Reflect (the Sierpiński triangle)

1. Stage $4$ has $3^4 = 81$ shaded triangles covering $\left(\tfrac34\right)^4 = \tfrac{81}{256}$
   of the first triangle; stage $5$ has $243$, covering $\tfrac{243}{1024}$.
   Count: explicit $T_n = 3^n$, recursive $T_0 = 1$, $T_n = 3T_{n-1}$. Area:
   explicit $A_n = \left(\tfrac34\right)^n$, recursive $A_0 = 1$,
   $A_n = \tfrac34 A_{n-1}$. As $n$ increases the area shrinks towards $0$,
   becoming smaller than any positive amount, while the count grows without
   limit.

### Exercise Set 8.6

1. $t_{10} = 5^{10} = 9\,765\,625$ and $t_n = 5^n$.
2. $t_{12} = t_8 \times 2^4 = 192 \times 16 = 3072$.
3. $2 \times 3^{n-1} = 4374$ gives $3^{n-1} = 2187 = 3^7$, so $n = 8$: the
   $8$th term. Explicit $t_n = 2 \times 3^{n-1}$; recursive $t_1 = 2$,
   $t_n = 3t_{n-1}$.
4. (a) a GP with $r = 5$: $t_n = 2 \times 5^{n-1}$
   (b) a GP with $r = \tfrac12$: $t_n = 4 \times \left(\tfrac12\right)^{n-1}$
   (c) not a GP: the ratios $2, \tfrac32, \tfrac43$ are not equal (it is an AP)
5. (a) $80 \times 0.6^5 = 6.2208$ m.
   (b) Down $80$, then up and down after each of the first five bounces:
   $80 + 2(48 + 28.8 + 17.28 + 10.368 + 6.2208) = 301.3376$ m.
6. The terms are $2, 4, 10, 28, 82, 244, 730$, so $730$ is the $7$th term
   (each term is $3^{n-1} + 1$).
7. $t_{16} - t_{11} = 5d = 35$, so $d = 7$ and $a = 38 - 10 \times 7 = -32$.
8. $2d = t_7 - t_5 = 12$, so $d = 6$, and $a + 2d = 16$ gives $a = 4$: the AP
   is $4, 10, 16, 22, \ldots$
9. $128$. The smallest is $105 = 7 \times 15$ and the largest $994 = 7 \times 142$,
   and $142 - 15 + 1 = 128$.
10. $60$: the multiples of $4$ from $12$ to $248$, and $\dfrac{248 - 12}{4} + 1 = 60$.
11. $120$ after $2$ hours, $480$ after $4$, and $30 \times 2^n$ after $n$.
12. $2a + 10d = 24$ and $2a + 14d = 44$ give $d = 5$ and $a = -13$: the first
    three terms are $-13, -8, -3$.
13. $45$: $\dfrac{44 \times 45}{2} = 990$ and $\dfrac{45 \times 46}{2} = 1035$.
14. Two ways: $18 + 19 + 20 + 21 + 22$ and $9 + 10 + \cdots + 16$.

---

## Beyond the Book

### Stage 1 · Using What You Know

1. Neither: the differences $4, 6, 8, 10$ and the ratios $3, 2, \tfrac53, \tfrac32$
   both change. The $n$th term is $n(n + 1)$.
2. $a = 4$, $d = 5$: $3d = t_9 - t_6 = 15$ and $a + 3d = 19$.
3. No. A positive number halved stays positive, so every term is positive,
   however small.
4. $100$: from $108 = 9 \times 12$ to $999 = 9 \times 111$, and $111 - 12 + 1 = 100$.
5. $1, 4, 9, 16, 25$ — the square numbers.
6. $9$ makes an AP ($d = 3$) and $12$ a GP ($r = 2$). Two terms fix neither
   kind of sequence.
7. Five ways: $22 + 23$, $14 + 15 + 16$, $7 + 8 + \cdots + 11$,
   $5 + 6 + \cdots + 10$ and $1 + 2 + \cdots + 9$.
8. $r = -\tfrac34$ or $r = -\tfrac43$; the terms are $\tfrac43, -1, \tfrac34$
   (in one order or the other).

### Stage 2 · Solved Examples

The 23 September 2026 examples, in examination formats. Each is worked in full on
its page; these are the keys.

1. (a) 63 *(single correct)*
2. (b) 37 *(single correct)*
3. (c) $-486$ *(single correct)*
4. (d) 1275 *(single correct)*
5. (a) 41 *(single correct)*
6. (b) 48 *(single correct)*
7. (a), (c), (d) *(multiple correct)*
8. (a), (c) *(multiple correct)*
9. (a), (b), (c) *(multiple correct)*
10. (a), (c), (d) *(multiple correct)*
11. 816 *(numerical answer)*
12. 32 *(numerical answer)*
13. 98 *(numerical answer)*
14. (a) P–3, Q–4, R–1, S–2 *(matching)*
15. (c) P–4, Q–1, R–2, S–3 *(matching)*

### Stage 3 · Practice — the key, as the key prints it

1–12: (b) (b) (b) (c) (c) (c) (c) (c) (c) (c) (c) (b)
13–24: (b) (b) (b) (b) (c) (b) (c) (c) (b) (b) (a) (a)
25–28: (d) (a) (a) (c)

### The working for the rest

29. $34$
30. $\tfrac13$
31. $37$
32. $50$ terms: $t_{50} = 199$ and $t_{51} = 203$.
33. $3$ ($r = 2$).
34. $765$
35. $4, 5, 7, 11, 19$
36. (a) ₹105 (b) ₹1150 (c) the $40$th week
37. (a) $3000$, $4500$, $6750$ (b) $2000 \times \left(\tfrac32\right)^n$ (c) after $6$ weeks
38. (a) $38$ (b) $68$ (c) $1100$ (d) the $16$th row
39. (a) $0.8$ mm (b) $0.1 \times 2^n$ mm (c) $102.4$ mm (d) $14$ folds
