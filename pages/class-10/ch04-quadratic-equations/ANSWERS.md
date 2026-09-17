# Class 10 · Mathematics I · Chapter 4 — Quadratic Equations

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set — *Exercise Set 4.2, Q3* — so it can be used beside the book
without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file.** A question renumbered in the book and
not here is how this goes wrong.

A reason is given beside each step, as Class 10 papers expect.

---

## 4.2 Quadratic Equations

### The questions in the running text

- **Example 1, "(Why?)"**: John and Jivanti have 45 marbles together, so if
  John has $x$, Jivanti has $45 - x$.

### Exercise Set 4.1

1. Each side is expanded and everything is taken to the left.
   - (i) $x^2 + 2x + 1 = 2x - 6$, so $x^2 + 7 = 0$. **Yes**, quadratic.
   - (ii) $x^2 - 2x = -6 + 2x$, so $x^2 - 4x + 6 = 0$. **Yes.**
   - (iii) $x^2 - x - 2 = x^2 + 2x - 3$, so $-3x + 1 = 0$. **No**: the $x^2$
     terms cancel.
   - (iv) $2x^2 - 5x - 3 = x^2 + 5x$, so $x^2 - 10x - 3 = 0$. **Yes.**
   - (v) $2x^2 - 7x + 3 = x^2 + 4x - 5$, so $x^2 - 11x + 8 = 0$. **Yes.**
   - (vi) $x^2 + 3x + 1 = x^2 - 4x + 4$, so $7x - 3 = 0$. **No.**
   - (vii) $x^3 + 6x^2 + 12x + 8 = 2x^3 - 2x$, so
     $x^3 - 6x^2 - 14x - 8 = 0$. **No**: it is of degree 3.
   - (viii) $x^3 - 4x^2 - x + 1 = x^3 - 6x^2 + 12x - 8$, so
     $2x^2 - 13x + 9 = 0$. **Yes**: the cubes cancel.

2. - (i) Breadth $x$ m, length $(2x + 1)$ m: $x(2x + 1) = 528$, that is,
     $2x^2 + x - 528 = 0$.
   - (ii) The integers $x$ and $x + 1$: $x(x + 1) = 306$, that is,
     $x^2 + x - 306 = 0$.
   - (iii) Rohan is $x$ years old and his mother $x + 26$. In 3 years:
     $(x + 3)(x + 29) = 360$, that is, $x^2 + 32x - 273 = 0$.
   - (iv) Speed $u$ km/h: $\dfrac{480}{u - 8} - \dfrac{480}{u} = 3$, so
     $3840 = 3u(u - 8)$, that is, $u^2 - 8u - 1280 = 0$.

## 4.3 Solution of a Quadratic Equation by Factorisation

### The question in the running text

- **Example 3, "Check that both of them satisfy the equation"**:
  $2 \times 1^2 - 5 \times 1 + 3 = 0$, and
  $2 \times \frac{9}{4} - 5 \times \frac{3}{2} + 3 = \frac{9}{2} - \frac{15}{2} + 3 = 0$.

### Exercise Set 4.2

1. - (i) $x^2 - 3x - 10 = (x - 5)(x + 2)$: roots **5 and $-2$**.
   - (ii) $2x^2 + x - 6 = 2x^2 + 4x - 3x - 6 = (2x - 3)(x + 2)$: roots
     **$\frac{3}{2}$ and $-2$**.
   - (iii) $\sqrt{2}x^2 + 7x + 5\sqrt{2} = \sqrt{2}x^2 + 2x + 5x + 5\sqrt{2}
     = (x + \sqrt{2})(\sqrt{2}x + 5)$: roots **$-\sqrt{2}$ and
     $-\frac{5}{\sqrt{2}}$**.
   - (iv) Multiply by 8: $16x^2 - 8x + 1 = (4x - 1)^2$: roots
     **$\frac{1}{4}$ and $\frac{1}{4}$**.
   - (v) $100x^2 - 20x + 1 = (10x - 1)^2$: roots **$\frac{1}{10}$ and
     $\frac{1}{10}$**.

2. - (i) $x^2 - 45x + 324 = (x - 9)(x - 36) = 0$, so $x = 9$ or $x = 36$.
     John had 36 marbles and Jivanti 9, or John 9 and Jivanti 36. Check:
     $31 \times 4 = 124$.
   - (ii) $x^2 - 55x + 750 = (x - 25)(x - 30) = 0$: **25 or 30** toys. Check:
     $25 \times 30 = 750$.

3. $x(27 - x) = 182$, so $x^2 - 27x + 182 = (x - 13)(x - 14) = 0$. The numbers
   are **13 and 14**.

4. $x^2 + (x + 1)^2 = 365$, so $x^2 + x - 182 = (x + 14)(x - 13) = 0$. As the
   integers are positive, $x = 13$: **13 and 14**.

5. Base $x$ cm, altitude $(x - 7)$ cm: $x^2 + (x - 7)^2 = 169$, so
   $x^2 - 7x - 60 = (x - 12)(x + 5) = 0$. A length is positive, so the base is
   **12 cm** and the altitude **5 cm**.

6. $x$ articles at $(2x + 3)$ rupees each: $x(2x + 3) = 90$, so
   $2x^2 + 3x - 90 = (2x + 15)(x - 6) = 0$. **6 articles**, at **₹15** each.

## 4.4 Nature of Roots

### The questions in the running text

- **"You can check that these two numbers fit what you learnt in Chapter 2"**:
  the sum is $\frac{-2b}{2a} = -\frac{b}{a}$ and the product is
  $\frac{b^2 - (b^2 - 4ac)}{4a^2} = \frac{c}{a}$, as the text shows.
- **Example 8, "(Why?)"**: $AB$ is a diameter, and the angle in a semicircle
  is a right angle, so $\angle APB = 90^\circ$.

### Exercise Set 4.3

1. - (i) $b^2 - 4ac = 9 - 40 = -31$: **no real roots**.
   - (ii) $b^2 - 4ac = 48 - 48 = 0$: **two equal real roots**,
     $\frac{4\sqrt{3}}{6} = \frac{2}{\sqrt{3}}$ and $\frac{2}{\sqrt{3}}$.
   - (iii) $b^2 - 4ac = 36 - 24 = 12$: **two distinct real roots**,
     $\frac{6 \pm 2\sqrt{3}}{4}$, that is, $\frac{3 + \sqrt{3}}{2}$ and
     $\frac{3 - \sqrt{3}}{2}$.

2. - (i) $k^2 - 24 = 0$, so $k = 2\sqrt{6}$ or $k = -2\sqrt{6}$.
   - (ii) $kx^2 - 2kx + 6 = 0$ has $b^2 - 4ac = 4k^2 - 24k = 4k(k - 6)$. This
     is 0 for $k = 0$ and $k = 6$, but $k = 0$ leaves no $x^2$ term, so
     **$k = 6$** only.

3. Breadth $x$ m: $2x^2 = 800$, that is, $x^2 - 400 = 0$, whose discriminant
   is $1600$, positive. So **yes**: $x = 20$, and the grove is **40 m long and
   20 m broad**.

4. Ages $x$ and $20 - x$: $(x - 4)(16 - x) = 48$, so
   $x^2 - 20x + 112 = 0$. Its discriminant is $400 - 448 = -48$, negative, so
   the situation is **not possible**.

5. Sides $x$ and $40 - x$: $x(40 - x) = 400$, so $x^2 - 40x + 400 = 0$. Its
   discriminant is $1600 - 1600 = 0$, so **yes**, with $x = 20$: a square of
   side **20 m**.

---

## Beyond the Book

### Stage 1 · Using What You Know

Each of the five questions is answered in the running text that follows it
on the page: (1) $k = 6$ with root $-3$, or $k = -6$ with root 3; (2) $k = 6$,
other root 3; (3) no: $2x^2 - 3x + 2 = 0$ has discriminant $-7$; (4) 11 and
13, or $-13$ and $-11$; (5) the discriminant is $p^2 + 4$, always positive.

### Stage 3 · Practice

Multiple choice and assertion–reason, as the key prints it:
1 (b), 2 (c), 3 (d), 4 (a), 5 (d), 6 (c), 7 (b), 8 (d), 9 (a), 10 (d),
11 (b), 12 (a), 13 (c), 14 (b), 15 (d), 16 (a), 17 (d), 18 (b), 19 (c).

The working for each:

1. (b) $x^3 - x^2 = x^3 + 1$ gives $-x^2 - 1 = 0$; the others are linear.
2. (c) $x^2 - 9x + 20 = (x - 4)(x - 5)$: roots 4 and 5.
3. (d) $25 - 24 = 1$.
4. (a) $4 + 2k - 6 = 0$, so $k = 1$.
5. (d) $x^2 - 49 = (x - 7)(x + 7)$: roots 7 and $-7$.
6. (c) $x(2x + 3) = 0$: roots 0 and $-\frac{3}{2}$.
7. (b) $4k^2 - 64 = 0$, so $k = 4$ or $k = -4$.
8. (d) $x(x + 1) = 132$ gives $(x + 12)(x - 11) = 0$; the integers are 11 and
   12, and the larger is 12.
9. (a) Equal roots need $b^2 = 4ac$, so $c = \frac{b^2}{4a}$.
10. (d) $3x^2 - 6x + 3 = 3(x - 1)^2$, so both roots are 1, and
    $36 - 36 = 0$: both are right.
11. (b) $x^2 + x - 42 = (x + 7)(x - 6)$: 6 or $-7$.
12. (a) $x(x + 30) = 400$ gives $(x + 40)(x - 10) = 0$: the son is 10.
13. (c) $x^2 - 2x + 5 = 0$ has discriminant $4 - 20 = -16$.
14. (b) No real roots needs $p^2 \lt 64$; of the options only 5 does.
15. (d) $x^2 + (x + 5)^2 = 625$ gives $(x + 20)(x - 15) = 0$: sides 15, 20
    and 25 cm.
16. (a) $16 - 20 = -4$, negative, and R is the rule that gives A.
17. (d) A is false: $x(x + 3) = x^2 - 2$ becomes $3x + 2 = 0$. R is true.
18. (b) $9 - 3 - 6 = 0$, so A is true; R is true but says nothing about 3.
19. (c) $36 - 36 = 0$, so A is true; R is false, since a positive discriminant
    gives two distinct roots.
20. $5^2 - 4 \times 2 \times (-3) = 25 + 24 = 49$.
21. $x^2 - 11x + 30 = (x - 5)(x - 6)$: roots 5 and 6.
22. $9k - 15 - 3 = 0$, so $k = 2$.
23. $3x^2 - 5x - 2 = (3x + 1)(x - 2)$: roots 2 and $-\frac{1}{3}$.
24. - $b^2 - 4ac = 4a^2 - 4(a^2 - b^2) = 4b^2$. *(the discriminant)*
    - $4b^2 \geq 0$ for every real $b$. *(a square is never negative)*
    - So the roots are real, and they are $\frac{2a \pm 2b}{2}$, that is,
      $a + b$ and $a - b$. Check: $(x - a - b)(x - a + b) = x^2 - 2ax + a^2 - b^2$.
25. $b^2 - 4ac = 1 + 32 = 33$, so $x = \frac{-1 + \sqrt{33}}{4}$ or
    $x = \frac{-1 - \sqrt{33}}{4}$.
26. The numbers $x$ and $15 - x$: $\frac{15}{x(15 - x)} = \frac{3}{10}$, so
    $x(15 - x) = 50$ and $x^2 - 15x + 50 = (x - 5)(x - 10) = 0$. The numbers
    are 5 and 10. Check: $\frac{1}{5} + \frac{1}{10} = \frac{3}{10}$.
27. Her speed to the town is $x$ km/h:
    $\frac{60}{x - 5} - \frac{60}{x} = 1$, so $300 = x^2 - 5x$ and
    $x^2 - 5x - 300 = (x - 20)(x + 15) = 0$. A speed cannot be negative, so
    she rides at 20 km/h and comes back at 15 km/h. The round trip takes
    $3 + 4 = 7$ hours.
28. The smallest integer is $x$:
    $x^2 + (x + 1)(x + 2) = 46$, so $2x^2 + 3x - 44 = 0$, with discriminant
    $361 = 19^2$. So $x = 4$ or $x = -\frac{11}{2}$; the second is not a
    positive integer. The integers are 4, 5 and 6. Check: $16 + 30 = 46$.
29. $x$ books: $\frac{80}{x} - \frac{80}{x + 4} = 1$, so
    $x^2 + 4x - 320 = (x + 20)(x - 16) = 0$. He bought 16 books, at ₹5 each;
    20 books would have cost ₹4 each.
30. (a) $20t - 5t^2 = 15$ gives $t^2 - 4t + 3 = 0$: at 1 s and 3 s
    (b) $20t - 5t^2 = 25$ gives $t^2 - 4t + 5 = 0$, with discriminant
    $16 - 20 = -4$: no (c) $20t - 5t^2 = 0$ gives $t = 0$ or $t = 4$: after
    4 s (d) $20t - 5t^2 = 20$ gives $t^2 - 4t + 4 = 0$, with discriminant 0,
    so there is one time, 2 s.
31. (a) $r(r + 4) = 396$, that is, $r^2 + 4r - 396 = 0$
    (b) $(r + 22)(r - 18) = 0$: 18 rows of 22 chairs
    (c) no: $r^2 + 4r - 400 = 0$ has discriminant 1616, which lies between
    $40^2$ and $41^2$, so it is not a perfect square and $r$ is not a whole
    number.
