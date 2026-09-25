# Class 8 · Mathematics I · Chapter 6 — We Distribute, Yet Things Multiply

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by section and set — *Exercise Set 6.3, Q5* — so it can be used
beside the book without a contents page. The questions put in the running
text (Think and Reflect, Math Talk, Try This, and the plain questions between
them) are answered under the section they sit in, in the order they come.
**Every value below is re-derived by `check-numbers.mjs` beside this file.**

Where a question asks the reader to choose or explain, the answer gives one
worked instance under *answers will vary*.

---

## 6.1 Some Properties of Multiplication

### 6.1.1 Think and Reflect (increments in $23 \times 27$)

(i) The product increases by **27**: $24 \times 27 = 23 \times 27 + 27$, one more
group of 27. (ii) By **23**: $23(27 + 1) = 23 \times 27 + 23$. (iii) By
**51**: $(23 + 1)(27 + 1) = 23 \times 27 + 23 + 27 + 1$. The pattern: increasing
one number by 1 adds the *other* number; increasing both adds their sum and 1.

### Expanding $(a + 1)(b + 1)$ with $(b + 1)$ as the single term

$(a + 1)(b + 1) = a(b + 1) + 1(b + 1) = ab + a + b + 1$ — the same expression.

### Think and Reflect (will the product always increase?)

**No.** When one number goes up by 1 and the other down by 1, the change is
$b - a - 1$, which is negative whenever $b$ is not more than $a$. Answers will
vary; three examples:

- $a = 5$, $b = 3$: $15$ becomes $6 \times 2 = 12$, a decrease of 3.
- $a = 10$, $b = 10$: $100$ becomes $11 \times 9 = 99$, a decrease of 1.
- $a = 7$, $b = 2$: $14$ becomes $8 \times 1 = 8$, a decrease of 6.

Increasing both numbers by 1 can also decrease the product when the numbers
are negative: the increase $a + b + 1$ is negative when $a + b < -1$.

**Negative integers.** The identities still hold. With $a = -5$, $b = 8$:
$ab = -40$ and $(a + 1)(b + 1) = -4 \times 9 = -36$, an increase of
$4 = a + b + 1$. With $a = -4$, $b = -5$: $ab = 20$ and
$(a + 1)(b + 1) = -3 \times -4 = 12$, a change of $-8 = a + b + 1$.

### Think and Reflect (using Identity 1)

1. (i) $(a - 2)(b + 3) = ab + 3a - 2b - 6$: the product changes by
   $3a - 2b - 6$.
2. (ii) $(a - 3)(b - 4) = ab - 4a - 3b + 12$: the product changes by
   $-4a - 3b + 12$.

Checked without turning subtractions into additions, for instance with
$a = 10$, $b = 7$: (i) $8 \times 10 = 80 = 70 + 30 - 14 - 6$;
(ii) $7 \times 3 = 21 = 70 - 40 - 21 + 12$.

### Expanding $(a - u)(b + v)$ and $(a - u)(b - v)$

Answered in the text: $ab - ub + av - uv$ and $ab - ub - av + uv$.

### Example 3 (why is $a \times a^2 = a^3$?)

$a \times a^2 = a \times (a \times a)$, three $a$s multiplied together, which is
$a^3$.

### Exercise Set 6.1

1. With $pq$ in the middle, the row above has first number $p - 1$ and the row
   below $p + 1$; the column to the left has second number $q - 1$ and the
   column to the right $q + 1$:

   | | | |
   |---|---|---|
   | $(p - 1)(q - 1)$ | $(p - 1)q$ | $(p - 1)(q + 1)$ |
   | $p(q - 1)$ | $pq$ | $p(q + 1)$ |
   | $(p + 1)(q - 1)$ | $(p + 1)q$ | $(p + 1)(q + 1)$ |

   In Fig. 6.3, $p = 4$ and $q = 6$, and the nine products are $15, 18, 21, 20,
   24, 28, 25, 30, 35$.

2. (i) $3v - 9 + uv - 3u$ (ii) $10 + 4a$ (iii) $100ac + 10ad + 10bc + bd$
   (iv) $-x^2 + 9x - 18$ (v) $-5ac - 5ad + bc + bd$ (vi) $5y + 45 + yz + 9z$

3. Answers will vary. For $(a + 2)(b - 4) = ab$ we need
   $ab - 4a + 2b - 8 = ab$, that is $b = 2a + 4$. Three examples:
   $1 \times 6 = 3 \times 2 = 6$; $2 \times 8 = 4 \times 4 = 16$;
   $3 \times 10 = 5 \times 6 = 30$.

4. (i) $4a + 5ab - 12b^2 + ab^2 - 3b^3$ (working: $4(a + ab - 3b^2) +
   b(a + ab - 3b^2) = 4a + 4ab - 12b^2 + ab + ab^2 - 3b^3$)
   (ii) $4y^2 + 44yz - 5y + 77z - 21$ (working: $4y^2 + 44yz - 12y + 7y + 77z - 21$)

5. (i) $a^2 - b^2$ (ii) $a^3 - b^3$ (iii) $a^4 - b^4$. The pattern: $(a - b)$ times
   the sum of all the terms $a^{n-1}, a^{n-2}b, \ldots, b^{n-1}$ gives
   $a^n - b^n$, because every middle product cancels with its neighbour. The next
   identity says that $(a - b)(a^4 + a^3b + a^2b^2 + ab^3 + b^4)$ is $a^5 - b^5$; expanding,
   the ten products are $a^5, a^4b, a^3b^2, a^2b^3, ab^4$ and
   $-a^4b, -a^3b^2, -a^2b^3, -ab^4, -b^5$, and all but $a^5$ and $-b^5$ cancel.

### 6.1.2 Fast multiplication

- (a) $3874 \times 11 = 42614$ (worked in the text). (b) $5678 \times 11 = 62458$:
  from the right, 8; $7 + 8 = 15$, write 5 carry 1; $6 + 7 + 1 = 14$, write 4
  carry 1; $5 + 6 + 1 = 12$, write 2 carry 1; $5 + 1 = 6$.

**Math Talk (the rule for 11).** Write the last digit of the number. Then,
moving left, write each digit plus the digit on its right, carrying as usual.
Finish with the first digit plus any carry. (i) $94 \times 11 = 1034$
(ii) $495 \times 11 = 5445$ (iii) $3279 \times 11 = 36069$
(iv) $4791256 \times 11 = 52703816$.

**Multiplying by 101.** $3874 \times 101 = 391274$: the digits are
$3, 8, (7 + 3), (4 + 8), 7, 4$, that is $3, 8, 10, 12, 7, 4$, and carrying from
the right gives $391274$. The rule: add the number to itself moved two places to
the left, so each digit is added to the digit two places to its right. For
$1001$ the number is moved three places, for $10001$ four places, and so on.

**Math Talk (using the rules).** (i) $89 \times 101 = 8989$
(ii) $949 \times 101 = 95849$ (iii) $265831 \times 1001 = 266096831$
(iv) $1111 \times 1001 = 1112111$ (v) $9734 \times 99 = 973400 - 9734 = 963666$
(vi) $23478 \times 999 = 23478000 - 23478 = 23454522$. For (v) and (vi) the
multiplier is $100 - 1$ and $1000 - 1$, so the number is subtracted rather than
added.

## 6.2 Special Cases of the Distributive Property

### The square of side 65

The four parts are $3600$, $25$, $300$ and $300$; together $4225$.
$(30 + 35)^2 = 900 + 2100 + 1225 = 4225$ and $(52 + 13)^2 = 2704 + 1352 + 169 =
4225$. A drawing shows a square of side 65 cut at 30 (or at 52): a square of 30
(of 52), a square of 35 (of 13), and two rectangles 30 by 35 (52 by 13).

### Math Talk (is $(a + b)^2$ always greater than $a^2 + b^2$?)

$(a + b)^2 - (a^2 + b^2) = 2ab$. So $(a + b)^2$ is greater exactly when $ab > 0$,
that is when $a$ and $b$ are both positive or both negative. It is equal when
$a$ or $b$ is 0, and smaller when they have opposite signs: $(3 + (-2))^2 = 1$
but $9 + 4 = 13$.

### Using Identity 1A

$104^2 = (100 + 4)^2 = 10000 + 800 + 16 = 10816$; $37^2 = (30 + 7)^2 = 900 + 420 +
49 = 1369$. (i) $(m + 3)^2 = m^2 + 6m + 9$ (ii) $(6 + p)^2 = 36 + 12p + p^2$.

$(3j + 2k)^2 = 9j^2 + 12jk + 4k^2$ both ways: $(3j)^2 + 2 \times 3j \times 2k +
(2k)^2$, and $(3j + 2k)(3j + 2k) = 9j^2 + 6jk + 6jk + 4k^2$.

### Think and Reflect (Identity 1B)

- **Geometry.** Draw a square of side $a$ and mark a square of side $a - b$ in
  one corner. Take away the two strips $a$ by $b$ along the other two sides:
  $a^2 - ab - ab$. The strips overlap in a square $b$ by $b$, which has gone
  twice, so add it back once: $(a - b)^2 = a^2 - 2ab + b^2$.
- (a) $99^2 = (100 - 1)^2 = 10000 - 200 + 1 = 9801$
  (b) $58^2 = (60 - 2)^2 = 3600 - 240 + 4 = 3364$.
- (i) $(b - 6)^2 = b^2 - 12b + 36$ (ii) $(-2a + 3)^2 = 4a^2 - 12a + 9$
  (iii) $\left(7y - \frac{3}{4z}\right)^2 = 49y^2 - \frac{21y}{2z} + \frac{9}{16z^2}$.
  By the distributive property each is the bracket times itself, for example
  $(b - 6)(b - 6) = b^2 - 6b - 6b + 36$.

### Pattern 1

Answers will vary. For 4 and 7: $2(16 + 49) = 130 = 121 + 9 = 11^2 + 3^2$. Twice
the sum of the squares of two numbers is the square of their sum plus the square
of their difference, $2(a^2 + b^2) = (a + b)^2 + (a - b)^2$, as shown in the text.

### Pattern 2, and using Identity 1C

The pattern is $a^2 - b^2 = (a + b)(a - b)$, shown in the text.
$98 \times 102 = (100 - 2)(100 + 2) = 10000 - 4 = 9996$;
$45 \times 55 = (50 - 5)(50 + 5) = 2500 - 25 = 2475$.

### Try This (Fig. 6.7)

The rectangle is $(a + b)$ by $(a - b)$. Cut off the piece $b$ wide on the right
and turn it through a right angle: it is $a - b$ long and $b$ wide, and fits in
the strip below the left piece. The shape made is a square of side $a$ with a
square of side $b$ missing from one corner, of area $a^2 - b^2$. Nothing was
added or lost, so $(a + b)(a - b) = a^2 - b^2$.

### Sridharacharya's identity

$a^2 = (a + b)(a - b) + b^2$ because $(a + b)(a - b) = a^2 - b^2$ by Identity 1C;
adding $b^2$ to both sides gives it.

### Exercise Set 6.2

1. **They are equal.** $b - a = -(a - b)$, and a number and its negative have
   the same square: $(b - a)^2 = b^2 - 2ab + a^2 = (a - b)^2$.

2. $100 = 26^2 - 24^2$, since $(26 + 24)(26 - 24) = 50 \times 2$. (Also
   $100 = 10^2 - 0^2$; these are the only two ways with whole numbers.)

3. $406^2 = (400 + 6)^2 = 160000 + 4800 + 36 = 164836$;
   $72^2 = (70 + 2)^2 = 4900 + 280 + 4 = 5184$;
   $145^2 = (140 + 5)^2 = 19600 + 1400 + 25 = 21025$;
   $1097^2 = (1100 - 3)^2 = 1210000 - 6600 + 9 = 1203409$;
   $124^2 = (125 - 1)^2 = 15625 - 250 + 1 = 15376$.

4. **They hold for all numbers** — negative integers and fractions included —
   because both are identities, proved from the distributive property, which
   holds for all numbers. For example $a = -3$, $b = 5$: $2(9 + 25) = 68 = 2^2 +
   (-8)^2$, and $9 - 25 = -16 = 2 \times (-8)$.

## 6.3 Mind the Mistake, Mend the Mistake

1. **Wrong.** $-3p$ must multiply both terms, and it was left out of the
   products: $-3p \times -5p = 15p^2$ and $-3p \times 2q = -6pq$. Correct:
   $15p^2 - 6pq$.
2. **Wrong.** The 2 and the 3 multiply only the first term in each bracket.
   $2x - 2 + 3x + 12$, so correct: $5x + 10$.
3. **Wrong.** $y$ was treated as a bracket multiplying $(y + 2)$. It is added:
   $y + 2y + 4$, so correct: $3y + 4$.
4. **Wrong.** The middle term $2 \times 5m \times 6n$ is missing. Correct:
   $25m^2 + 60mn + 36n^2$.
5. **Correct:** $q^2 - 4q + 4$ (the square of $-q$ is $q^2$).
6. **Wrong.** $3a$ multiplied both factors of a product, as though it were a sum.
   $3a \times 2b \times 3c$, so correct: $18abc$.
7. **Correct:** $5s$.
8. **Wrong.** $5w^2$ and $6w$ are not like terms and cannot be added. Correct
   (already simplest): $5w^2 + 6w$.
9. **Wrong.** $6a^2b$ and $6ab^2$ are not like terms, and adding them does not
   multiply the letters. Correct: $5a^3 + 6a^2b + 6ab^2$.
10. **Correct:** $x^2 + 7x + 10$.
11. **Wrong.** Only two of the four products were kept. Correct:
    $ab + 4a + 2b + 8$.
12. **Correct:** $ab(a + b + ab)$ — expanding gives $a^2b + ab^2 + a^2b^2$.

## 6.4 This Way or That Way, All Ways Lead to the Bay

### Math Talk (the circles)

Step 4 is a $5 \times 5$ square of circles with one corner missing: **24**
circles. Step 10 has $11^2 - 1 = $ **120**. Step $k$ has $(k + 1)^2 - 1 = k^2 + 2k$.
(Answers will vary in form; any of the four methods is right.)

**Step 15:** $15^2 + 2 \times 15 = 255$ circles.

### Math Talk (the tiles)

Steps 1, 2, 3 have **8, 12, 16** tiles. Step 4 has **20**, Step 10 has **44**.
Step $n$ has $(n + 2)^2 - n^2 = 4n + 4$ tiles. Other ways (answers will vary):
four sides of $n + 1$ tiles each, $4(n + 1)$; or two rows of $n + 2$ and two
columns of $n$, $2(n + 2) + 2n$. All simplify to $4n + 4$.

### Tadang and Yusuf

$(m + n)^2 - 4mn = m^2 + 2mn + n^2 - 4mn = m^2 - 2mn + n^2$, and
$(n - m)^2 = n^2 - 2mn + m^2$: the same.

### Anusha, Vaishnavi and Aditya

$x^2 - xy$; $x(x + 2y) - 3xy = x^2 + 2xy - 3xy = x^2 - xy$; $x(x - y) = x^2 - xy$.
All three are $x^2 - xy$. With $x = 8$ and $y = 3$ the area is
$64 - 24 = 40$ square units.

### Math Talk (the region with slanting lines, Fig. 6.14)

It is a rectangle $(s - r)$ wide and $(p - r)$ tall, so its area is
$(s - r)(p - r) = ps - pr - rs + r^2$. Another way: the whole rectangle $ps$
less the strip, which is $rs$ along the bottom and $r(p - r)$ up the side:
$ps - rs - r(p - r) = ps - pr - rs + r^2$. With $p = 6$, $r = 3.5$, $s = 9$:
$5.5 \times 2.5 = 13.75$ square units.

### Exercise Set 6.3

1. (i) $46^2 = (40 + 6)^2 = 1600 + 480 + 36 = 2116$
   (ii) $397 \times 403 = (400 - 3)(400 + 3) = 160000 - 9 = 159991$
   (iii) $91^2 = (100 - 9)^2 = 10000 - 1800 + 81 = 8281$
   (iv) $43 \times 45 = (44 - 1)(44 + 1) = 1936 - 1 = 1935$

2. (i) $p^2 + 10p - 11$ (ii) $9a^2 - 81b^2$ (iii) $-6y^2 - 23y - 20$
   (iv) $36x^2 + 60xy + 25y^2$ (v) $4x^2 - 2x + \frac{1}{4}$ (vi) $21p^2r + 42pr$

3. (i) **$s^2 + 2$** (option (c)).
   (ii) **$m^2 + (m + 1)^2$** (option (d)). Also correct, and worth accepting:
   $m^2 + (m - 1)^2$ (option (e)), the squares of $m - 1$ and $m$, and
   $(2m)^2 + (2m + 1)^2$ (option (g)), the squares of $2m$ and $2m + 1$, which are
   consecutive too (though only when the first is even). NCERT's key gives (d)
   alone; see EDIT-LOG.

4. The two diagonal products always differ by **7**. With $a$, $a + 1$ on top
   and $a + 7$, $a + 8$ below: $(a + 1)(a + 7) - a(a + 8) = a^2 + 8a + 7 - a^2 - 8a
   = 7$. For example $5 \times 11 - 4 \times 12 = 55 - 48 = 7$, and
   $4 \times 10 - 3 \times 11 = 7$.

5. (i) **False.** $(k + 1)(k + 2) - (k + 3) = k^2 + 2k - 1$, which is 2 only when
   $k = 1$ (for $k = 2$ it is 7). (ii) **False.** $(2q + 1)(2q - 3) = 4q^2 - 4q - 3$,
   which is odd. (iii) **True.** $(2m)^2 = 4m^2$; $(2m + 1)^2 = 4m^2 + 4m + 1 =
   4m(m + 1) + 1$, and $m(m + 1)$ is even, so this is 1 more than a multiple of 8.
   (iv) **False.** $(6n + 2)^2 - (4n + 3)^2 = 20n^2 - 5$; adding 5 gives $20n^2$,
   which is not a square for $n = 1, 2, 3, \ldots$

6. Write the numbers $7a + 3$ and $7b + 5$. Sum: $7(a + b) + 8 = 7(a + b + 1) + 1$,
   remainder **1**. Difference, second less first: $7(b - a) + 2$, remainder
   **2** (first less second leaves remainder 5). Product:
   $49ab + 35a + 21b + 15 = 7(7ab + 5a + 3b + 2) + 1$, remainder **1**.

7. The answer is always **1**. Answers will vary: $5^2 - 4 \times 6 = 1$,
   $10^2 - 9 \times 11 = 1$. As an equation, $n^2 - (n - 1)(n + 1) = 1$; expanding,
   $(n - 1)(n + 1) = n^2 - 1$, so the left side is $n^2 - n^2 + 1 = 1$.

8. For numbers $a$ and $b$: $(a + b) \times \frac{a + b}{2} = \frac{(a + b)^2}{2}$,
   which is half the square of the sum.

9. (i) $16 \times 24$ is larger, by 20: $14 \times 26 = (16 - 2)(24 + 2) = 16
   \times 24 + 32 - 48 - 4$. (Or $20^2 - 6^2 < 20^2 - 4^2$.) (ii) $26 \times 74$
   is larger, by 49: $25 \times 75 = (26 - 1)(74 + 1) = 26 \times 74 + 26 - 74 - 1$.

10. The park is $w + g + 2w + g + w = 2g + 4w$ feet long and $g + 2w$ feet wide.
    Tiled area $= (2g + 4w)(g + 2w) - 2g^2 = 8gw + 8w^2 = 8w(w + g)$ square feet.

11. (a) Step 4 has a middle block 6 wide and 4 tall, with a column of 6 up from
    its right end and one of 6 down from its left end: 36 units. Step 10:
    $(10 + 2)^2 = 144$. Step $y$: $(y + 2)^2$, since the block is $y(y + 2)$ and
    the columns add $2(y + 2)$.
    (b) Step 4 is a $5 \times 5$ square with a row of 4 below it: 29 units.
    Step 10: $11^2 + 10 = 131$. Step $y$: $(y + 1)^2 + y$.

### Puzzle time: Coin Conjoin

**3 moves for 10 coins:** move the top coin to below the middle of the bottom
row, and the two end coins of the bottom row to the two ends of the second row.
The rows are now 4, 3, 2, 1 from the top. For 15 coins the fewest moves is
**5**; for 21 coins, 7; for 28, 9. In general the fewest moves for a triangle
of $T$ coins is the whole-number part of $T \div 3$. (Answers will vary in how
the moves are found; the counts do not.)

---

## Beyond the Book

### Stage 1 · Using What You Know

Each of the eight questions is answered in the running text that follows it on
the page. The results, for reference: (1) $a^2 + b^2 = 58$, $(a - b)^2 = 16$;
(2) 2499 and 24.99; (3) the sum is 40 (the numbers are 17 and 23); (4) $24x$;
(5) 272; (6) 487; (7) $x^2 - 6x + 10 = (x - 3)^2 + 1$, which is 1 or more;
(8) the answer is $(n^2 + 3n + 1)^2$.

### Stage 2 · Solved Examples

The fifteen examples, in examination formats, from `stage2-bank.mjs`. Each is
worked in full on its page; these are the keys.

1. (b) it increases by 8 *(single correct)*
2. (c) $3a^2 + 10ab - 8b^2$ *(single correct)*
3. (d) 3481 *(single correct)*
4. (a) 15 *(single correct)*
5. (b) 70224 *(single correct)*
6. (c) $y^2 - 4y - 21$ *(single correct)*
7. (a), (b) *(multiple correct)*
8. (a), (b), (c) *(multiple correct)*
9. (a), (b), (d) *(multiple correct)*
10. (a), (b), (c) *(multiple correct)*
11. 62.41 *(numerical answer)*
12. 4 *(numerical answer)*
13. 24 *(numerical answer)*
14. (b) P–3, Q–2, R–4, S–1 *(matching)*
15. (d) P–2, Q–4, R–3, S–1 *(matching)*

### Stage 3 · Practice

Multiple choice and assertion–reason, as the key prints it:
1 (b), 2 (c), 3 (d), 4 (b), 5 (c), 6 (a), 7 (a), 8 (d), 9 (d), 10 (a),
11 (c), 12 (d), 13 (b), 14 (c), 15 (b), 16 (a), 17 (b), 18 (c), 19 (d).

The working for each:

1. The term is $-5xy$, so the coefficient is $-5$.
2. $47 \times 11 = 470 + 47 = 517$: the digits 4, $4 + 7$, 7.
3. $-5yz$ and $\frac{1}{2}zy$ have the same letters, since $zy = yz$.
4. $7x - 2 - 3x + 5 = 4x + 3$.
5. $-6a^2 + 10a$.
6. $x^2 + 18x + 81$.
7. $9y^2 - 16$.
8. $p^2 + 9p - 2p - 18 = p^2 + 7p - 18$.
9. $(40 - 2)(40 + 2) = 1600 - 4 = 1596$.
10. $(78 + 22)(78 - 22) = 100 \times 56 = 5600$.
11. $25 - 2 \times 6 = 13$.
12. $29 - 2 \times 10 = 9$.
13. $1234 \times 101 = 123400 + 1234 = 124634$.
14. $(x - 7)^2 = x^2 - 14x + 49$.
15. $(x + 5)(x + k) = x^2 + (5 + k)x + 5k$, so $5 + k = 2$ and $5k = -15$: $k = -3$.
16. (a) A is true, and R shows it: one value where the sides differ is enough.
17. (b) $999 \times 1001 = (1000 - 1)(1000 + 1) = 999999$ is true, and R is a true
    identity, but the one used is Identity 1C, not the square of a sum.
18. (c) A is true; R is false, since the coefficient is squared too:
    $(3x)^2 = 9x^2$, not $3x^2$.
19. (d) A is false ($2x$ and $3y$ are unlike terms); R is true.
20. to 31. As the key prints them, in full on the Answers page. The worked
    values: 20 — coefficient $-3$, constant 5; 21 — 100; 22 — $2x^2 + 3x - 4$;
    23 — $2x^3 + x^2 - 7x + 3$, check $-1$; 24 — $12a + 8$; 25 — 990025;
    26 — area $2x^2 + x - 3$ cm², perimeter $6x + 4$ cm, 75 cm² at $x = 6$;
    27 — the difference is 4, and $225 - 221 = 4$; 28 — less by 9 m², $x = 11$;
    29 — $8n$, the numbers 23 and 25; 30 — $x^2 + 4x + 4$, $x^2 - 4x + 4$,
    $x^2 - 4$; $8x$ cm²; 144, 64 and 96 cm²; 31 — Identities 1C, 1A, 1B; 2484,
    3721, 39601; yes, $2500 - 16 = 2484$.
