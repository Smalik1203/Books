# Class 10 · Mathematics I · Chapter 2 — Polynomials

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set — *Exercise Set 2.1, Q1* — so it can be used beside the book
without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file**, and the counts of zeroes are read off
the figures' own drawn curves, not typed. A question renumbered in the book
and not here is how this goes wrong.

---

## 2.1 Introduction

### The questions in the running text

*What is the value of $x^2 - 3x - 4$ at $x = -1$?* Answered in the text that
follows: $p(-1) = 1 + 3 - 4 = 0$, and $p(4) = 16 - 12 - 4 = 0$, so $-1$ and 4
are its zeroes.

*Are the zeroes of a quadratic polynomial also tied to its coefficients?*
Answered in Section 2.3: yes, $\alpha + \beta = -\frac{b}{a}$ and
$\alpha\beta = \frac{c}{a}$.

## 2.2 Geometrical Meaning of the Zeroes of a Polynomial

### The questions in the running text

*Why are the zeroes of a polynomial so important?* and *What do you expect the
zeroes of a cubic polynomial to mean on a graph?* Both are answered in the
text: the zeroes of $p(x)$ are the $x$-coordinates of the points where the
graph of $y = p(x)$ meets the $x$-axis, for a cubic as for a quadratic
(Fig. 2.6, where $x^3 - 4x$ meets it at $-2$, 0 and 2).

### Example 1, the "Why?" in each part

The number of zeroes is the number of points where the graph meets the
$x$-axis. The counts are:

- (i) 1
- (ii) 2
- (iii) 3 — the graph cuts the $x$-axis at three points.
- (iv) 1 — the graph is a straight line that cuts the $x$-axis once.
- (v) 1 — the graph touches the $x$-axis at one point and does not cross it.
- (vi) 4 — the graph cuts the $x$-axis at four points.

### Exercise Set 2.1

1. Count the points where each graph in Fig. 2.9 meets the $x$-axis.
   - (i) 0 — the line is parallel to the $x$-axis and never meets it.
   - (ii) 1
   - (iii) 3
   - (iv) 2
   - (v) 4
   - (vi) 3

## 2.3 Relationship between Zeroes and Coefficients of a Polynomial

### The checks the running text leaves to the reader

*Check that $p(x) = 0$ for $x = 4$, $-2$ and $\frac{1}{2}$*, where
$p(x) = 2x^3 - 5x^2 - 14x + 8$:

- $p(4) = 128 - 80 - 56 + 8 = 0$
- $p(-2) = -16 - 20 + 28 + 8 = 0$
- $p\left(\frac{1}{2}\right) = \frac{1}{4} - \frac{5}{4} - 7 + 8 = 0$

*Check that any other quadratic polynomial with this sum and product of
zeroes has the form $k(x^2 + 3x + 2)$* (Example 4):

- Let $ax^2 + bx + c$ have zeroes with sum $-3$ and product 2.
- Then $-\frac{b}{a} = -3$, so $b = 3a$. *(sum of the zeroes)*
- And $\frac{c}{a} = 2$, so $c = 2a$. *(product of the zeroes)*
- So $ax^2 + bx + c = ax^2 + 3ax + 2a = a(x^2 + 3x + 2)$, with $a \neq 0$:
  the form $k(x^2 + 3x + 2)$ with $k = a$.

### Exercise Set 2.2

1. - (i) $x^2 - 2x - 8 = (x - 4)(x + 2)$. Zeroes: $4$, $-2$.
     Sum $2 = \frac{-(-2)}{1}$; product $-8 = \frac{-8}{1}$.
   - (ii) $4s^2 - 4s + 1 = (2s - 1)^2$. Zeroes: $\frac{1}{2}$, $\frac{1}{2}$.
     Sum $1 = \frac{-(-4)}{4}$; product $\frac{1}{4} = \frac{1}{4}$.
   - (iii) $6x^2 - 7x - 3 = (3x + 1)(2x - 3)$. Zeroes: $\frac{3}{2}$, $-\frac{1}{3}$.
     Sum $\frac{7}{6} = \frac{-(-7)}{6}$; product $-\frac{1}{2} = \frac{-3}{6}$.
   - (iv) $4u^2 + 8u = 4u(u + 2)$. Zeroes: $0$, $-2$.
     Sum $-2 = \frac{-8}{4}$; product $0 = \frac{0}{4}$.
   - (v) $t^2 - 15 = (t - \sqrt{15})(t + \sqrt{15})$. Zeroes: $\sqrt{15}$, $-\sqrt{15}$.
     Sum $0 = \frac{-0}{1}$; product $-15 = \frac{-15}{1}$.
   - (vi) $3x^2 - x - 4 = (3x - 4)(x + 1)$. Zeroes: $\frac{4}{3}$, $-1$.
     Sum $\frac{1}{3} = \frac{-(-1)}{3}$; product $-\frac{4}{3} = \frac{-4}{3}$.

2. Each answer is $x^2 - Sx + P$, or a non-zero multiple of it; the multiple
   with integer coefficients is given.
   - (i) Polynomial: $4x^2 - x - 4$
   - (ii) Polynomial: $3x^2 - 3\sqrt{2}x + 1$
   - (iii) Polynomial: $x^2 + \sqrt{5}$
   - (iv) Polynomial: $x^2 - x + 1$
   - (v) Polynomial: $4x^2 + x + 1$
   - (vi) Polynomial: $x^2 - 4x + 1$

   Parts (iii), (iv) and (v) have no real zeroes: the sum and product still
   come from the coefficients, but the graph does not meet the $x$-axis.

---

## Beyond the Book

### Stage 1 · Using What You Know

Each of the five questions is answered in the running text that follows it
on the page: (1) 13; (2) the other zero is $-4$ and $k = 1$; (3) Riya is not
right, since a cubic polynomial has at most three zeroes; (4)
$x^2 - 2x - 4$; (5) $x^2 + 6x + 8$.

### Stage 2 · Solved Examples

Worked in full on the page.

### Stage 3 · Practice

Multiple choice and assertion–reason, as the key prints it:
1 (b), 2 (c), 3 (d), 4 (b), 5 (c), 6 (a), 7 (d), 8 (a), 9 (b), 10 (d),
11 (c), 12 (c), 13 (c), 14 (b), 15 (d), 16 (a), 17 (a), 18 (b), 19 (c), 20 (d).

The working for each:

1. The highest power is $x^7$, so the degree is 7.
2. $3 - 2x^2 + x$ has degree 2; $\sqrt{x}$ and $\frac{1}{x^2}$ are not allowed in a polynomial.
3. $2x + 5 = 0$ gives $x = -\frac{5}{2}$.
4. $-\frac{-6}{3} = 2$.
5. $\frac{-8}{4} = -2$.
6. Each point where the graph cuts the $x$-axis gives one zero: 2.
7. $x^2 - 0x + (-5) = x^2 - 5$.
8. The other zero is $6 - 2 = 4$, and $k = 2 \times 4 = 8$.
9. $7^2 - 2 \times 10 = 29$.
10. $\frac{-7}{12}$.
11. The product is $\frac{c}{a} = 1$, so $c = a$.
12. $2x^2 - 8 = 2(x - 2)(x + 2)$, zeroes 2 and $-2$; sum 0, product $\frac{-8}{2} = -4$. Both are right.
13. $-\frac{6}{2} = -3$.
14. The zeroes are 1 and $-2$: two.
15. $-\frac{2}{k} = 3$ gives $k = -\frac{2}{3}$.
16. A quadratic polynomial has at most two zeroes, so its graph cannot cut the $x$-axis at three points.
17. (a) $x^2 + 4 \geq 4$ for every $x$, so the graph is above the axis and there is no zero; R explains A.
18. (b) The sum is $\frac{8}{2} = 4$, so A is true; R is true but is about the product.
19. (c) $x^3 - x = x(x - 1)(x + 1)$ has three zeroes; R is false, since $x^3$ has only one.
20. (d) The product is $\frac{-6}{1} = -6$, so A is false; R is true.
21. $2 \times (-8) + 6 + 1 = -9$.
22. $x^2 + \frac{3}{2}x - 1$, or $2x^2 + 3x - 2$. Check: $2x^2 + 3x - 2 = (2x - 1)(x + 2)$, zeroes $\frac{1}{2}$ and $-2$.
23. $\alpha + \beta = -\frac{2}{3}$ and $\alpha\beta = -\frac{7}{3}$, so the answer is $-3$.
24. The graph in Fig. 2.11 cuts the $x$-axis at $-3$, 1 and 2. Sum 0, sum of products two at a time $-3 + 2 - 6 = -7$, product $-6$. With $a = 1$: $b = 0$, $c = -7$, $d = 6$, so $p(x) = x^3 - 7x + 6$. Check: $p(0) = 6$, as the graph shows.
25. $x^2 - 2\sqrt{2}x - 6 = (x - 3\sqrt{2})(x + \sqrt{2})$; zeroes $3\sqrt{2}$ and $-\sqrt{2}$. Sum $2\sqrt{2}$, product $-6$, as the coefficients give.
26. $(\alpha - \beta)^2 = (\alpha + \beta)^2 - 4\alpha\beta = 4^2 - 4 \times 2 = 8$.
27. $8 - 6 + k = 0$, so $k = -2$. Product $\frac{-2}{2} = -1$, so the other zero is $-\frac{1}{2}$. Check: sum $2 - \frac{1}{2} = \frac{3}{2}$, as the coefficients give.
28. $x^3 - 3x^2 - x + 3$. $1 - 3 - 1 + 3 = 0$, so 1 is a zero. The other two have sum 2 and product $-3$: they are 3 and $-1$.
29. - Sum: $(a - b) + a + (a + b) = 3a = 6$, so $a = 2$.
    - Product: $(2 - b) \times 2 \times (2 + b) = -10$, so $4 - b^2 = -5$ and $b^2 = 9$.
    - So $b = 3$ or $b = -3$; either way the zeroes are $-1$, 2 and 5.
    - Check: $(-1) \times 2 + 2 \times 5 + 5 \times (-1) = 3$, the coefficient of $x$.
30. (a) $\alpha^2 + \beta^2 = 25 - 6 = 19$ (b) sum $\frac{5}{3}$, product $\frac{1}{3}$, so $3x^2 - 5x + 1$
31. (a) quadratic, degree 2 (b) $-5(t - 3)(t + 1)$, zeroes 3 and $-1$ (c) 3 seconds; a time cannot be negative (d) sum $2 = -\frac{10}{-5}$, product $-3 = \frac{15}{-5}$
32. (a) $-3$ and 2 (b) $b = 1$, $c = -6$, so $p(x) = x^2 + x - 6$ (c) $(0, -6)$ (d) $p(4) = 16 + 4 - 6 = 14$
