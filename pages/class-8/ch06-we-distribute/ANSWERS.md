# Class 8 · Mathematics I · Chapter 6 — We Distribute, Yet Things Multiply

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except the key at the end of Beyond the Book.

Numbered by section and set — *Exercise Set 6.3, Q4* — so it can be used
beside the book without a contents page. The questions put in the running
text (Think and Reflect, and the plain questions between them) are answered
under the section they sit in, in the order they come. **Every value below is
re-derived by `check-numbers.mjs` beside this file.**

Rewritten for the maths-v2 conversion, 26 September 2026: every context,
number and question in the body is now the book's own (see EDIT-LOG.md).

---

## 6.1 Some Properties of Multiplication

### 6.1.1 Think and Reflect (how $24 \times 35$ changes)

1. By **35**: $25 \times 35 = 24 \times 35 + 35$, one more group of 35.
2. By **24**: $24 \times 36 = 24 \times 35 + 24$.
3. By **60**: $25 \times 36 = 900$ and $24 \times 35 = 840$, and
   $24 + 35 + 1 = 60$.

The rule: increasing one number by 1 adds the *other* number; increasing both
adds their sum and 1.

### Expanding $(a + 1)(b + 1)$ with $(b + 1)$ as the single term

$(a + 1)(b + 1) = a(b + 1) + 1(b + 1) = ab + a + b + 1$, the same expression.

### Think and Reflect (does the product always go up?)

1. **No.** The change is $b - a - 1$, which is negative or zero whenever $b$ is
   not more than $a$. *Answers will vary*, for example: $5 \times 3 = 15$
   becomes $6 \times 2 = 12$; $8 \times 8 = 64$ becomes $9 \times 7 = 63$;
   $9 \times 2 = 18$ becomes $10 \times 1 = 10$.
2. **Yes, the rules hold.** With $a = -6$, $b = 9$: $ab = -54$;
   $(a + 1)(b + 1) = -5 \times 10 = -50$, a change of $4 = a + b + 1$; and
   $(a + 1)(b - 1) = -5 \times 8 = -40$, a change of $14 = b - a - 1$.
   With $a = -3$, $b = -7$: $ab = 21$; $(a + 1)(b + 1) = -2 \times -6 = 12$, a
   change of $-9 = a + b + 1$; and $(a + 1)(b - 1) = -2 \times -8 = 16$, a change
   of $-5 = b - a - 1$.

### Think and Reflect (using Identity 1)

1. $(a - 3)(b + 2) = ab + 2a - 3b - 6$: the product changes by $2a - 3b - 6$.
   With $a = 12$, $b = 10$: $9 \times 12 = 108 = 120 + 24 - 30 - 6$.
2. $(a - 2)(b - 5) = ab - 5a - 2b + 10$: the product changes by
   $-5a - 2b + 10$. With $a = 12$, $b = 10$: $10 \times 5 = 50 = 120 - 60 - 20 + 10$.

### Example 3 (why is $x \times x^2 = x^3$?)

$x \times x^2 = x \times (x \times x)$, three $x$s multiplied together, which is
$x^3$.

### Think and Reflect (multiplication by parts)

1. $37 \times 26 = 37 \times 20 + 37 \times 6 = 740 + 222 = 962$, and
   $37 \times 26 = 37 \times 30 - 37 \times 4 = 1110 - 148 = 962$.
2. *Answers will vary.*

### Exercise Set 6.1

1. (i) $4n - 8 + mn - 2m$ (ii) $6 + 9b$ (iii) $-x^2 + 7x - 10$
   (iv) $-3pr - 3ps + qr + qs$ (v) $7z + 28 + yz + 4y$
   (vi) $8ac + 2ad - 12bc - 3bd$
2. $(a + 3)(b - 2) = ab - 2a + 3b - 6$, so the product stays the same when
   $3b = 2a + 6$. *Answers will vary*: $3 \times 4 = 6 \times 2 = 12$;
   $6 \times 6 = 9 \times 4 = 36$; $9 \times 8 = 12 \times 6 = 72$.
3. (i) $2x^2 + xy + 5x + 4y - 12$ (ii) $-p^3 + 5p^2 - 11p + 15$
4. $x^2 + 3x + 2$, $x^2 + 5x + 6$ and $x^2 + 7x + 12$. The middle number is the
   sum of the two numbers in the brackets and the last is their product. So
   $(x + 9)(x + 10)$ is $x^2 + 19x + 90$.
5. $(45 + 2)(60 + 3) = 45 \times 60 + 3 \times 45 + 2 \times 60 + 6$, so it is more
   by $135 + 120 + 6 = 261$. (Indeed $2961 - 2700 = 261$.)

### 6.1.2 Fast multiplication

- (a) $4786 \times 11 = 52646$ (worked in the text). (b) $6395 \times 11 = 70345$:
  from the right, 5; $9 + 5 = 14$, write 4, carry 1; $3 + 9 + 1 = 13$, write 3,
  carry 1; $6 + 3 + 1 = 10$, write 0, carry 1; $6 + 1 = 7$.

**Think and Reflect (the rule for 11).** Write the last digit. Then, moving
left, write each digit plus the digit on its right, carrying as usual. Finish
with the first digit plus any carry. $86 \times 11 = 946$,
$572 \times 11 = 6292$, $4958 \times 11 = 54538$ and
$3620917 \times 11 = 39830087$.

**Multiplying by 101.** $4786 \times 101 = 478600 + 4786 = 483386$. Each digit is
added to the digit two places to its right. For $1001$ the number is moved
three places, for $10001$ four places, and so on.

**Think and Reflect (using the rules).** (i) $76 \times 101 = 7676$
(ii) $358 \times 101 = 36158$ (iii) $412736 \times 1001 = 413148736$
(iv) $2323 \times 1001 = 2325323$ (v) $6857 \times 99 = 685700 - 6857 = 678843$
(vi) $31694 \times 999 = 31694000 - 31694 = 31662306$.

## 6.2 Special Cases of the Distributive Property

### The square of side 43

The four parts are $1600$, $9$, $120$ and $120$; together $1849$.
$(20 + 23)^2 = 400 + 920 + 529 = 1849$ and $(33 + 10)^2 = 1089 + 660 + 100 = 1849$.

### Think and Reflect (is $(a + b)^2$ always more than $a^2 + b^2$?)

$(a + b)^2 - (a^2 + b^2) = 2ab$. With $a = 4$, $b = -1$: $(a + b)^2 = 9$ but
$a^2 + b^2 = 17$, so **no**. It is more exactly when $ab$ is positive (both
numbers positive or both negative), equal when $a$ or $b$ is 0, and less when
they have opposite signs.

### Using Identity 1A

$103^2 = 10000 + 600 + 9 = 10609$; $52^2 = 2500 + 200 + 4 = 2704$.
(i) $(n + 4)^2 = n^2 + 8n + 16$ (ii) $(7 + q)^2 = 49 + 14q + q^2$.
$(5p + 2q)^2 = 25p^2 + 20pq + 4q^2$ both ways.

### Think and Reflect (Identity 1B)

1. Draw a square of side $a$ with a square of side $a - b$ in one corner. Take
   away the two strips $a$ by $b$: $a^2 - ab - ab$. The strips overlap in a
   square $b$ by $b$, taken away twice, so add it back once:
   $(a - b)^2 = a^2 - 2ab + b^2$.
2. $98^2 = 10000 - 400 + 4 = 9604$; $69^2 = 4900 - 140 + 1 = 4761$.
3. $(c - 5)^2 = c^2 - 10c + 25$; $(-3m + 2)^2 = 9m^2 - 12m + 4$;
   $\left(5x - \frac{2}{3y}\right)^2 = 25x^2 - \frac{20x}{3y} + \frac{4}{9y^2}$.

### Pattern 1

*Answers will vary.* For 5 and 2: $2(25 + 4) = 58 = 49 + 9 = 7^2 + 3^2$.

### Identity 1C

$97 \times 103 = 10000 - 9 = 9991$; $36 \times 44 = 1600 - 16 = 1584$.

### Think and Reflect (Fig. 6.6)

Cut off the right-hand piece, $b$ wide and $a - b$ tall, and turn it through a
right angle. It fits along the bottom of the left-hand piece, and the shape
made is a square of side $a$ with a square of side $b$ missing from one
corner, of area $a^2 - b^2$. Nothing was added or lost, so
$(a + b)(a - b) = a^2 - b^2$.

### Sridharacharya's identity

$(a + b)(a - b) = a^2 - b^2$ by Identity 1C; adding $b^2$ to both sides gives
$a^2 = (a + b)(a - b) + b^2$.

### Exercise Set 6.2

1. $(p^2 + 2pq + q^2) - (p^2 - 2pq + q^2) = 4pq$. With $p = 50$ and $q = 25$:
   $75^2 - 25^2 = 4 \times 50 \times 25 = 5000$.
2. $48 = 7^2 - 1^2 = 8^2 - 4^2 = 13^2 - 11^2$ (any two; these are the only
   three ways in whole numbers).
3. $502^2 = 252004$; $89^2 = 8100 - 180 + 1 = 7921$; $215^2 = 46225$;
   $998^2 = 996004$; $61^2 = 3600 + 120 + 1 = 3721$.
4. **Yes.** $\left(\frac{3}{2}\right)^2 - \left(\frac{1}{2}\right)^2 = \frac{9}{4} - \frac{1}{4} = 2$,
   and $\left(\frac{3}{2} + \frac{1}{2}\right)\left(\frac{3}{2} - \frac{1}{2}\right) = 2 \times 1 = 2$.
   It must hold, because it was proved from the distributive property, which
   holds for fractions too.

## 6.3 Finding and Fixing Mistakes

1. **Wrong.** $4a$ must multiply both terms fully: $8a^2 - 12ab$.
2. **Wrong.** $-2 \times -1 = +2$: $3y + 6 - 2y + 2$, which is $y + 8$.
3. **Wrong.** The middle term is missing: $p^2 + 6p + 9$.
4. **Correct:** $4m^2 - 4mn + n^2$.
5. **Wrong.** $5k$ and $2k^2$ are not like terms: $2k^2 + 5k$ is already simplest.
6. **Correct:** $a^2 + 2a - 15$.

**Think and Reflect.** 1. With every letter 1, Item 2 gives $9$ against $5$,
so the test finds it; Items 1 and 5 agree at 1 ($-4$ and $-4$; $7$ and $7$)
and are found only with 2 ($8$ against $4$; $18$ against $56$). 2. **No.**
$x^2 + x$ and $2x$ agree at $x = 1$ but not at $x = 2$ ($6$ against $4$). One
value can show a mistake; it cannot prove an identity.

## 6.4 Many Ways to See One Pattern

**Think and Reflect (the plus pattern).** Step 4 has $16 + 16 = 32$ dots,
Step 10 has $100 + 40 = 140$, and Step $k$ has $k^2 + 4k$. Step 15:
$225 + 60 = 285$.

**Think and Reflect (the tiles).** Steps 1, 2, 3 have **10, 16, 22** tiles;
Step 4 has **28** and Step 10 has **64**. Step $n$ has $6n + 4$. Two ways
(*answers will vary*): the whole rectangle less the space,
$(n + 2)(2n + 2) - 2n^2$; or two long rows of $2n + 2$ and two short columns of
$n$, $2(2n + 2) + 2n$. Both simplify to $6n + 4$.

**Farah and Kiran.** $(m + n)^2 - 4mn = m^2 - 2mn + n^2 = (n - m)^2$. With
$m = 2$, $n = 5$: $49 - 40 = 9$.

**Example 4** is worked in the text: all three are $2xy - y^2$, and the
painted area is $204$ cm².

**Think and Reflect (the rug).** The floor less the rug:
$lb - (l - 2r)(b - 2r) = 2lr + 2br - 4r^2$. Or two strips $l$ by $r$ and two
strips $(b - 2r)$ by $r$: $2lr + 2r(b - 2r)$, the same. With $l = 5$, $b = 4$,
$r = 0.5$: $20 - 4 \times 3 = 8$ m².

### Exercise Set 6.3

1. $53^2 = 2500 + 300 + 9 = 2809$; $79^2 = 6400 - 160 + 1 = 6241$;
   $296 \times 304 = 90000 - 16 = 89984$; $61 \times 63 = 3844 - 1 = 3843$.
2. (i) $q^2 + 11q - 26$ (ii) $16m^2 - 49n^2$ (iii) $-3x^2 - 17x - 10$
   (iv) $25a^2 + 30ab + 9b^2$ (v) $9y^2 - 2y + \frac{1}{9}$ (vi) $8s^2t - 24st$
3. $(n + 5)^2 - (n - 5)^2 = (n^2 + 10n + 25) - (n^2 - 10n + 25) = 20n$.
4. (i) **True**: $m^2 + 5m + 6 - m^2 - 5m = 6$. (ii) **False**:
   $4k^2 + 8k + 3 = 2(2k^2 + 4k + 1) + 1$ is odd. (iii) **False**:
   $(n + 4)^2 - (n + 2)^2 = 4n + 12$, which is 12 at $n = 0$. (iv) **True**:
   $(3p + 1)^2 - (3p - 1)^2 = 12p$.
5. $(2m + 1)(2n + 1) = 4mn + 2m + 2n + 1 = 2(2mn + m + n) + 1$, which is odd.
6. $(10n + 5)^2 = 100n^2 + 100n + 25 = 100n(n + 1) + 25$.
   $65^2 = 100 \times 42 + 25 = 4225$; $105^2 = 100 \times 110 + 25 = 11025$.
7. (i) $35 \times 45 = 1600 - 25 = 1575$ is larger than
   $32 \times 48 = 1600 - 64 = 1536$, by 39. (ii) $59 \times 61 = 3599$ is
   larger than $58 \times 62 = 3596$, by 3.
8. Whole less lawn: $(x + 5)(x + 2) - x^2 = 7x + 10$. Pieces: a strip 5 by
   $(x + 2)$ and a strip $x$ by 2: $5x + 10 + 2x = 7x + 10$. At $x = 4$:
   $9 \times 6 - 16 = 38$ and $5 \times 6 + 8 = 38$.
9. $\big((a + b) + c\big)^2 = (a + b)^2 + 2(a + b)c + c^2 = a^2 + b^2 + c^2 + 2ab + 2bc + 2ca$.

---

## By the Book

Fifty questions in the order of NCERT's practice: very short answer (2
marks), short answer (3), long answer (5), assertion and reason (1),
case-based (4), objective (1). Written to BY-THE-BOOK.md, 26 September 2026.
The book's own key is in Beyond the Book's Answers stage; this is the same
key, set out in full.

### Very short answer

1. $3x^2 + 15x - 2x - 10 = 3x^2 + 13x - 10$.
2. $(100 + 4) \times (100 - 4) = 10000 - 16 = 9984$.
3. It is $(a + b)^2 = 40^2 = 1600$.
4. **No.** At $y = 1$ the sides are $4$ and $-8$; $(y - 3)^2 = y^2 - 6y + 9$.
5. $(a + 1)b = ab + b$, so $b = 195 - 180 = 15$.
6. $(7.2 + 2.8) \times (7.2 - 2.8) = 10 \times 4.4 = 44$.
7. $(x + y)^2 - 2xy = 81 - 28 = 53$.
8. **39292**: 2; $7 + 2 = 9$; $5 + 7 = 12$, carry 1; $3 + 5 + 1 = 9$; 3.
9. $(m^2 + 12m + 36) - (m^2 - 12m + 36) = 24m$.
10. $x^2 + (4 - k)x - 4k$, so $4 - k = 1$ and $-4k = -12$: $k = 3$.

### Short answer

11. $2a^2 + 3ab - 2b^2 + 3a + 6b$; at $a = b = 1$ both sides are 12.
12. $48p$; at $p = 5$ it is 240.
13. (i) $100 + 6 + 0.09 = 106.09$ (ii) $2500 - 0.25 = 2499.75$.
14. $16n$, a multiple of 16; $16n = 144$ gives $n = 9$.
15. $x^2 + 4x - 12$ m²; at $x = 10$, $16 \times 8 = 128$ m².
16. **Step 2**: $(2x)^2 = 4x^2$, not $2x^2$. Correct: $4x^2 - 12x + 9$; at
    $x = 2$, $16 - 24 + 9 = 1$.
17. $a^2 + b^2 = 25 + 48 = 73$; $(a + b)^2 = 73 + 48 = 121$.
18. $504700 + 5047 = 509747$; $63800 - 638 = 63162$.
19. $6s + 9 = 57$, so the side was **8 cm**.
20. $2 \times 37 + 55 + 2 = 131$.

### Long answer

21. $(x + 5)(x - 5) = x^2 - 25$: down by 25 m². $x^2 = 144$, $x = 12$ (a side is
    not negative). The new plot is 17 m by 7 m.
22. Card $(2x + 5)$ by $(x + 7)$: $2x^2 + 19x + 35$. Photograph:
    $2x^2 + 7x + 3$. Border $12x + 32$. At $x = 5$: **92 cm²**, and
    $180 - 88 = 92$.
23. $(p + 3)^2 = p^2 + 3p + 3p + 9 = p^2 + 6p + 9$. $p = 7$, so the area is
    **100 cm²**.
24. $4ab$; $289 - 49 = 240$, so $ab = 60$; the numbers are 12 and 5.
25. $(2n + 1)^2 = 4n(n + 1) + 1$, and $n(n + 1)$ is even. Remainder **1**:
    $1369 = 8 \times 171 + 1$.
26. $x^2 - 64$, which is 64 less than $x \times x$. $x^2 = 400$, $x = 20$:
    **12 notebooks at ₹28**.
27. $x^2 + 8x + 16$ and $x^2 + 8x + 7$: the square is larger by **9 cm²**. At
    $x = 6$: $100 - 91 = 9$.
28. $(n + 3)^2 - 9 = n^2 + 6n$; divided by $n$, $n + 6$; less 6, $n$. With 7:
    $100 - 9 = 91$, $91 \div 7 = 13$, $13 - 6 = 7$.
29. $12x$ m²; $12x = 96$ gives $x = 8$: hall 11 m, carpet 5 m.
30. $(10a + b)(10 + 1) = 100a + 10(a + b) + b$. $400 + 70 + 3 = 473$;
    $700 + 130 + 6 = 836$, the 1 of 13 carried to the hundreds.

### Assertion and reason

31 (a) · 32 (b) · 33 (c) · 34 (d) · 35 (a)

- 31: $200^2 - 3^2 = 39991$, by R.
- 32: $500^2 - 1^2 = 249999$ is true, and R is a true identity, but the one used
  is Identity 1C.
- 33: R is false; the number part is squared too.
- 34: A is false ($4p$ and $5q$ are unlike terms); R is true.
- 35: R with $a = b = x$ gives $x + x + 1 = 2x + 1$.

### Case-based questions

36. (i) $x^2 - 9$ (ii) 225 cm² (iii) $12x$; $x = 15$.
37. (i) Identity 1C (ii) 5041 (iii) **No**: $99^2 = 10000 - 200 + 1 = 9801$.
38. (i) ₹2673 (ii) ₹6358 (iii) ₹20559.
39. (i) $(a + 2b)$ m (ii) $(a + 2b)^2 - a^2 = 4ab + 4b^2$ (iii) 176 m², ₹8800.
40. (i) 40 (ii) $n^2 + 5n + 4$ (iii) Step 6.

### Objective questions

41 (c) · 42 (a) · 43 (d) · 44 (b) · 45 (d) · 46 (c) · 47 (a) · 48 (b) ·
49 (b) · 50 (c)

## Beyond the Book

Organised by format since the maths-v2 conversion: the tried-and-explained
questions first, then five parts, each with two solved examples and its
practice questions. Beyond's example numbers are its own: *Beyond Example 1*
is not the chapter's Example 1 in §6.1.

### Tried and explained (no head in the book)

Each is answered in the running text after it: (1) $a^2 + b^2 = 58$,
$(a - b)^2 = 16$; (2) 2499 and 24.99; (3) the sum is 40 (the numbers are 17
and 23); (4) $24x$; (5) 272; (6) 487; (7) $x^2 - 6x + 10 = (x - 3)^2 + 1$, which
is 1 or more; (8) the answer is $(n^2 + 3n + 1)^2$.

### Solved examples

| Part | Example | Key |
|---|---|---|
| Single correct | 1 | (b) it increases by 8 |
| | 2 | (a) 15 |
| More than one correct | 3 | (a), (b), (c) |
| | 4 | (a), (b), (c) |
| Numerical answer | 5 | 62.41 |
| | 6 | 24 |
| Matching | 7 | (b) P–3, Q–2, R–4, S–1 |
| | 8 | (d) P–2, Q–4, R–3, S–1 |
| Paragraph-based | 9 | (i) (c) $4a + 4$; (ii) 289; (iii) 20 |
| | 10 | (i) (a) 11128; (ii) 9118; (iii) 10094 |

### Practice

| Part | Questions | Key |
|---|---|---|
| Single correct | 1–4 | 1 (b) 11 · 2 (c) 4000 · 3 (a) 7 · 4 (d) 12 |
| More than one correct | 5–8 | 5 (a), (b), (c) · 6 (a), (b) · 7 (a), (b), (d) · 8 (b), (c), (d) |
| Numerical answer | 9–11 | 9 **100** · 10 **1** · 11 **26** |
| Matching | 12–13 | 12 (a) · 13 (c) |
| Paragraph-based | 14–15 | 14 (i) (a); (ii) 96; (iii) 176 · 15 (i) (a) 21; (ii) 120; (iii) the 25th |

- Q1. $\left(x - \frac{1}{x}\right)^2 = x^2 - 2 + \frac{1}{x^2} = 9$, so the sum is 11.
- Q6. (c) is $2n^2 + 2$, which is 10 at $n = 2$; (d) is 5 at $n = 1$.
- Q8. $59 \times 61 = 3599$; (a) is 3601.
- Q9. $\frac{100 \times 74}{74} = 100$.
- Q10. $2ab = 225 - 113 = 112$, so $(a - b)^2 = 113 - 112 = 1$ (the numbers are 8
  and 7).
- Q11. $(n + 5)^2 - (n - 5)^2 = 20n$, first more than 500 at $n = 26$.
- Q14. The base is $(a + 2)$ by $(a - 2)$: $12 \times 8 = 96$; the card left is
  $16 \times 12 - 4 \times 4 = 176$.
- Q15. $(n + 1)^2 - n^2 = 2n + 1$; the first ten add to $11^2 - 1^2 = 120$.
