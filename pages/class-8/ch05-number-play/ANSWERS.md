# Class 8 · Mathematics I · Chapter 5 — Number Play

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by section and set — *Exercise Set 5.2, Q3* — so it can be used
beside the book without a contents page. **Every value below is re-derived
by `check-numbers.mjs` beside this file.** A question renumbered in the book
and not here is how this goes wrong.

Where a question asks the reader to explore, choose or explain, the answer
gives one worked instance under *answers will vary*.

---

## 5.1 Is This a Multiple Of?

### Think and Reflect (Anshu's questions)

Answers will vary; these are what a class should reach.

- **Not every natural number.** The powers of 2 ($1, 2, 4, 8, 16, \ldots$)
  cannot be written as a sum of two or more consecutive natural numbers;
  every other number can. For example, $9 = 4 + 5 = 2 + 3 + 4$.
- **More than one way:** the numbers with at least two odd factors greater
  than 1, such as $9$ ($4 + 5 = 2 + 3 + 4$), $15$
  ($7 + 8 = 4 + 5 + 6 = 1 + 2 + 3 + 4 + 5$) and $21$
  ($10 + 11 = 6 + 7 + 8 = 1 + 2 + 3 + 4 + 5 + 6$).
- **Even numbers:** some can ($6 = 1 + 2 + 3$, $10 = 1 + 2 + 3 + 4$), but not
  the powers of 2, such as $8$.
- **Zero:** yes, with negative numbers: $0 = -1 + 0 + 1$, or
  $0 = -2 + (-1) + 0 + 1 + 2$.

### How many expressions with signs (3, 4, 5, 6)

**Eight**, since each of the three gaps takes one of two signs:
$2 \times 2 \times 2 = 8$. Their values are $3 + 4 + 5 + 6 = 18$,
$3 + 4 + 5 - 6 = 6$, $3 + 4 - 5 + 6 = 8$, $3 + 4 - 5 - 6 = -4$,
$3 - 4 + 5 + 6 = 10$, $3 - 4 + 5 - 6 = -2$, $3 - 4 - 5 + 6 = 0$,
$3 - 4 - 5 - 6 = -12$. Every value is even.

For $5, 6, 7, 8$ (Table 5.2): $26, 10, 12, -4, 14, -2, 0, -16$ — all even.
*Your own four* will vary; with $1, 2, 3, 4$ the values are
$10, 2, 4, -4, 6, -2, 0, -8$. Two values recur for every choice of $n$:
$n - (n + 1) - (n + 2) + (n + 3) = 0$ and
$n + (n + 1) - (n + 2) - (n + 3) = -4$.

**Switching a $-$ to a $+$** (Explanation 1): in $a + b - c - d$, replacing
$-c$ by $+c$ changes the value by $(a + b + c - d) - (a + b - c - d) = 2c$,
which is even. So the two values have the same parity.

**Only four numbers?** No. The same argument works for any count of numbers:
switching one sign changes the value by twice that number, so all the
expressions $a \pm b \pm c \pm \cdots$ share one parity.

### Breaking Even

Arithmetic expressions:

| expression | even? | reason |
|---|---|---|
| $43 + 37$ | even | odd $+$ odd |
| $672 - 348$ | even | even $-$ even |
| $4 \times 347 \times 3$ | even | a factor $4$ |
| $708 - 477$ | odd | even $-$ odd |
| $809 + 214$ | odd | odd $+$ even |
| $119 \times 303$ | odd | odd $\times$ odd |
| $543 - 479$ | even | odd $-$ odd |
| $513^3$ | odd | odd $\times$ odd $\times$ odd |

Algebraic expressions, for integers:

| expression | always even? | example / non-example |
|---|---|---|
| $2a + 2b$ | yes, $= 2(a + b)$ | $a = 1, b = 2$: $6$ |
| $3g + 5h$ | no | $g = 1, h = 1$: $8$; $g = 1, h = 0$: $3$ |
| $4m + 2n$ | yes, $= 2(2m + n)$ | $m = 1, n = 1$: $6$ |
| $2u - 4v$ | yes, $= 2(u - 2v)$ | $u = 1, v = 1$: $-2$ |
| $13k - 5k$ | yes, $= 8k$ | $k = 3$: $24$ |
| $6m - 3n$ | no | $m = 1, n = 2$: $0$; $m = 1, n = 1$: $3$ |
| $x^2 + 2$ | no | $x = 6$: $38$; $x = 3$: $11$ |
| $b^2 + 1$ | no | $b = 3$: $10$; $b = 2$: $5$ |
| $4k \times 3j$ | yes, $= 12kj$ | $k = 1, j = 1$: $12$ |

*Expressions of your own* will vary: for example $6p + 10q$, $2x + 8$, $4y^2$.

### Pairs to Make Fours

A multiple of $4$ plus an even number that is not a multiple of $4$ is
**never** a multiple of $4$: $4p + (4q + 2) = 4(p + q) + 2$, which leaves a
remainder of $2$. It is like even $+$ odd, which is never even. Examples:
$4 + 6 = 10$, $12 + 2 = 14$, $16 + 10 = 26$ — each is $2$ more than a
multiple of $4$. The rows: $p$ full rows and $q$ full rows make $p + q$ full
rows, and the $2$ left over stay left over.

### Always, Sometimes, or Never

- Statement 1 with subtraction: **always true**, $8a - 8b = 8(a - b)$. For
  example $56 - 16 = 40 = 8 \times 5$.
- Statement 6: **always true.** $9$ and $4$ share no factor, so the LCM of
  $9$ and $4$ is $36$; a number divisible by both is divisible by $36$.
- Statement 7: **sometimes true.** The LCM of $6$ and $4$ is $12$, not $24$.
  $12$ is divisible by $6$ and $4$ but not by $24$; $48$ is divisible by all
  three.

### What Remains?

Numbers leaving $3$ when divided by $5$: $3, 8, 13, 18, 23, \ldots$
(answers will vary). **(iv) $5k + 3$** ($k = 0, 1, 2, \ldots$) and
**(v) $5k - 2$** ($k = 1, 2, 3, \ldots$) describe them all. The others do
not: $3k + 5$ gives $5, 8, 11$; $3k - 5$ gives $-2, 1, 4$; $3k$ gives
multiples of $3$; $5k - 3$ gives $2, 7, 12$, which leave $2$.

*Other expressions* will vary: $5k + 8$ ($k \geq -1$), $5k - 7$ ($k \geq 2$),
or $5k + 3$ with any whole-number shift of $k$.

### Exercise Set 5.1

1. **7, 8, 9, 10.** Four consecutive numbers are $n, n + 1, n + 2, n + 3$,
   with sum $4n + 6 = 34$, so $4n = 28$ and $n = 7$.

2. **$p - 1$, $p - 2$, $p - 3$, $p - 4$.**

3. 1. **Sometimes true.** $2 + 4 = 6$ is a multiple of $3$; $2 + 6 = 8$ is
      not. In algebra, $2a + 2b = 2(a + b)$ is a multiple of $3$ only when
      $a + b$ is.
   2. **Sometimes true.** $10$ is divisible by neither $18$ nor $9$; but
      $27$ is not divisible by $18$ and is divisible by $9$.
   3. **Sometimes true.** $1$ and $2$ are not divisible by $6$, and nor is
      their sum $3$; but $1$ and $5$ are not divisible by $6$, and their sum
      $6$ is.
   4. **Always true.** $6x + 9y = 3(2x + 3y)$.
   5. **Sometimes true.** $18 + 9 = 27$ is a multiple of $9$;
      $12 + 9 = 21$ is not. $6x + 3y = 3(2x + y)$ is a multiple of $9$ only
      when $2x + y$ is a multiple of $3$.

4. A few: **2, 14, 26, 38** (answers will vary). Such a number is $2$ more
   than a multiple of $3$ and of $4$, so $2$ more than a multiple of the LCM
   of $3$ and $4$, which is $12$: **$12k + 2$**, $k = 0, 1, 2, \ldots$

5. **91.** One left over in threes, twos and fives means $1$ more than a
   multiple of the LCM of $3$, $2$ and $5$, which is $30$: $31, 61, 91$ below
   $100$. Only $91 = 7 \times 13$ is a multiple of $7$.

6. **True.** $(6a + 2) + (6b + 2) + (6c + 2) = 6a + 6b + 6c + 6 = 6(a + b + c + 1)$.

7. Write $4779 = 7p + 5$ and $661 = 7q + 3$.
   1. **1.** $4779 + 661 = 7p + 7q + 8 = 7(p + q + 1) + 1$.
   2. **2.** $4779 - 661 = 7p - 7q + 2 = 7(p - q) + 2$.

   The picture: $p$ rows of seven with $5$ over, and $q$ rows of seven with
   $3$ over. Together the $5$ and $3$ make one more row of seven and $1$ over.
   Taking away, the $q$ full rows come off full rows and $3$ of the $5$ come
   off, leaving $2$.

8. **59.** Each remainder is one less than its divisor, so the number plus
   $1$ is a multiple of $3$, $4$ and $5$, that is of $60$. The smallest such
   number is $60 - 1 = 59$; the next is $119$.

## 5.2 Checking Divisibility Quickly

### Divisibility by 10, 5, 2, 4 and 8, with algebra

Answers will vary in wording. For a number $\ldots dcba$:

- **5 and 2:** $10b + 100c + \cdots$ is a multiple of $10$, so of $5$ and of
  $2$; the number is divisible by $5$ (or $2$) exactly when $a$ is. So the
  units digit is $0$ or $5$ (for $5$), or even (for $2$).
- **4:** $100c + 1000d + \cdots$ is a multiple of $100 = 4 \times 25$, so the
  number is divisible by $4$ exactly when $10b + a$, the number made by the
  last two digits, is.
- **8:** $1000d + \cdots$ is a multiple of $1000 = 8 \times 125$, so the
  number is divisible by $8$ exactly when $100c + 10b + a$, the last three
  digits, is.

### A Shortcut for Divisibility by 9

- **Remainder of 10:** $10 = 9 + 1$, so $1$. Multiples of $10$: $20$
  leaves $2$, $30$ leaves $3$, … $80$ leaves $8$, $90$ leaves $0$.
- **Multiples of 100:** $100$ leaves $1$, $200$ leaves $2$, and so on,
  since $100 = 99 + 1$.
- **427:** remainder **4** (Example 1).
- **Statements (i)–(iv): all four are correct**, because a number and its
  digit sum leave the same remainder when divided by $9$. (i) and (ii) are
  the rule and its converse; (iii) and (iv) say the same two things the other
  way round.

### Exercise Set 5.2

1. Digit sums: $123 \to 6$, $405 \to 9$, $8888 \to 32$, $93547 \to 28$,
   $358095 \to 30$. **Only (ii) $405$ is divisible by $9$.**
2. **288.** The digits must all be even ($0, 2, 4, 6, 8$), so the digit sum
   is even; a multiple of $9$ that is even is at least $18$. The smallest
   number with even digits adding to $18$ is $288$.
3. **6003.** $6000$ has digit sum $6$, so $6000 = 9 \times 666 + 6$. The
   multiples either side are $5994$ ($6$ below) and $6003$ ($3$ above).
4. **11.** They run from $4302 = 9 \times 478$ to $4392 = 9 \times 488$,
   and $488 - 478 + 1 = 11$.

### A Shortcut for Divisibility by 3

$10 = 9 + 1$, $100 = 99 + 1$, and $9, 99, 999, \ldots$ are multiples of $3$,
so every place value leaves $1$ when divided by $3$. So a number leaves the
same remainder as its digit sum when divided by $3$.

### A Shortcut for Divisibility by 11

- **462:** yes. $462 = 400 + 60 + 2$ is $4$ more, $6$ less, and $2$ more than
  multiples of $11$: $4 - 6 + 2 = 0$. Indeed $462 = 11 \times 42$.
- **A general method:** add the digits in the places $1, 100, 10000, \ldots$,
  add the digits in the places $10, 1000, \ldots$, and subtract. The number
  is divisible by $11$ exactly when the difference is $0$ or a multiple of
  $11$.
- **If the difference is $0$, $11$ or a multiple of $11$**, the remainder is
  $0$: the number is divisible by $11$.
- The list:

  | number | alternating sum | remainder |
  |---|---|---|
  | $158$ | $8 - 5 + 1 = 4$ | **4** |
  | $841$ | $1 - 4 + 8 = 5$ | **5** |
  | $481$ | $1 - 8 + 4 = -3$ | **8** |
  | $5529$ | $9 - 2 + 5 - 5 = 7$ | **7** |
  | $90904$ | $4 - 0 + 9 - 0 + 9 = 22$ | **0, divisible** |
  | $857076$ | $6 - 7 + 0 - 7 + 5 - 8 = -11$ | **0, divisible** |

- **Example 3 and Example 4:** the same method. The alternating signs add the
  digits in the "one more" places and subtract those in the "one less"
  places in a single line.

### Table 5.13

| number | 2 | 3 | 4 | 5 | 6 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|
| 128 | Yes | No | Yes | No | No | Yes | No | No | No |
| 990 | Yes | Yes | No | Yes | Yes | No | Yes | Yes | Yes |
| 1586 | Yes | No | No | No | No | No | No | No | No |
| 275 | No | No | No | Yes | No | No | No | No | Yes |
| 6686 | Yes | No | No | No | No | No | No | No | No |
| 639210 | Yes | Yes | No | Yes | Yes | No | No | Yes | Yes |
| 429714 | Yes | Yes | No | No | Yes | No | Yes | No | No |
| 2856 | Yes | Yes | Yes | No | Yes | Yes | No | No | No |
| 3060 | Yes | Yes | Yes | Yes | Yes | No | Yes | Yes | No |
| 406839 | No | Yes | No | No | No | No | No | No | No |

A quick way: settle $2$, $5$, $10$ from the units digit and $4$, $8$ from the
last two and three digits; find the digit sum once for $3$ and $9$; then
$6$ is "$2$ and $3$".

### More on Divisibility Shortcuts

- **By 6:** $38$ is even but its digit sum $11$ is not a multiple of $3$ —
  not divisible. $225$ is odd — not divisible. $186$ is even with digit sum
  $15$ — divisible ($186 = 6 \times 31$). $64$ has digit sum $10$ — not
  divisible. Checking $2$ and $3$ works.
- **By 24, with 3 and 8:** $24 = 2^3 \times 3$. A number divisible by $8$
  contains $2^3$, and one divisible by $3$ contains $3$, so it contains
  $2^3 \times 3$. With $4 = 2^2$ and $6 = 2 \times 3$, a number divisible by
  both need only contain $2^2 \times 3 = 12$; the third $2$ is not
  guaranteed, as $12$ itself shows.

### Digital Roots

- **The property:** the digital root is the remainder on division by $9$,
  except that a multiple of $9$ has digital root $9$.
- **600 to 700, digital root 5:** $608, 617, 626, 635, 644, 653, 662, 671, 680, 689, 698$.
- **Digital root 7:** $601, 610, 619, 628, 637, 646, 655, 664, 673, 682, 691$ (and $700$, if $700$ itself is counted).
- **Digital root 3:** $606, 615, 624, 633, 642, 651, 660, 669, 678, 687, 696$.
- **12 consecutive numbers:** the digital roots run $1$ to $9$ in turn and
  start again. From $20$ to $31$: $2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4$.
- **Consecutive multiples:** of $3$ — $3, 6, 9, 3, 6, 9, \ldots$; of $4$ —
  $4, 8, 3, 7, 2, 6, 1, 5, 9$, then again; of $6$ — $6, 3, 9, 6, 3, 9, \ldots$
- **1 more than a multiple of 6:** $1, 7, 4, 1, 7, 4, \ldots$ ($1, 7, 13,
  19, 25, 31, \ldots$). $6k + 1$ is $1$ more than a multiple of $3$, so its
  root is $1$, $4$ or $7$, and adding $6$ adds $6$ to the root, taking it
  round $1 \to 7 \to 4 \to 1$.
- **The riddle:** **111111111**, nine ones — eleven crore eleven lakh eleven
  thousand one hundred and eleven (11,11,11,111). It has $9$ digits, digit sum
  $9$ and digital root $9$.

### Exercise Set 5.3

1. **6.** The number is $5$ more than a multiple of $9$, so $10$ more than it
   is $15$ more, which is $6$ more than a multiple of $9$. (Answers will vary
   for the number itself: $10000004$ has root $5$, and $10000014$ has root
   $6$.)
2. Answers will vary. Adding $11 = 9 + 2$ adds $2$ to the remainder on
   division by $9$, so each digital root is $2$ more than the last, going
   round after $9$. From $10$: $10, 21, 32, 43, 54, 65, 76, 87, 98, 109$ have
   roots $1, 3, 5, 7, 9, 2, 4, 6, 8, 1$ — every root appears once before the
   pattern repeats.
3. **4.** $9a + 36b + 13 = 9(a + 4b + 1) + 4$.
4. 1. **No pattern:** $10$ (even) and $19$ (odd) both have digital root $1$.
   2. The digital root leaves the same remainder as the number on division
      by $3$ (roots $1, 4, 7$ leave $1$; $2, 5, 8$ leave $2$; $3, 6, 9$ leave
      $0$). On division by $9$, the digital root is the remainder, with a root
      of $9$ meaning $0$.

## 5.3 Digits in Disguise

### Fig. 5.14

1. **A = 7, B = 9:** $71 + 19 = 90$.
2. **A = 2, B = 5:** $25 + 37 = 62$.
3. **Three answers:** $17 + 17 + 17 = 51$ (O = 1, N = 7, P = 5),
   $24 + 24 + 24 = 72$ (O = 2, N = 4, P = 7) and $31 + 31 + 31 = 93$
   (O = 3, N = 1, P = 9).
4. **Q = 8, R = 5, P = 2:** $85 + 85 + 85 = 255$.

### The multiplication cryptarithms in the text

- $\text{GH} \times \text{H} = 9\text{K}$: **$24 \times 4 = 96$**. The
  multiplier must equal the units digit of GH, which rules out
  $12 \times 8$, $46 \times 2$, $47 \times 2$ and $31 \times 3$; $11 \times 9$
  repeats a digit, and in $16 \times 6 = 96$ the units digits H and K would
  both be $6$.
- $\text{BYE} \times 6 = \text{RAY}$: **$105 \times 6 = 630$**. B $= 1$ and Y
  is even and less than $7$; the units digit of $6 \times \text{E}$ is Y. Only
  Y $= 0$, E $= 5$ works: $105 \times 6 = 630$.
- $\text{UT} \times 3 = \text{PUT}$: **$50 \times 3 = 150$**.
- $\text{AB} \times 5 = \text{BC}$: **$19 \times 5 = 95$**.
- $\text{L2N} \times 2 = \text{2NP}$: **two answers**, $124 \times 2 = 248$
  and $125 \times 2 = 250$.
- $\text{XY} \times 4 = \text{ZX}$: **$23 \times 4 = 92$**.
- $\text{PP} \times \text{QQ} = \text{PRP}$: **three answers**,
  $22 \times 11 = 242$, $33 \times 11 = 363$ and $44 \times 11 = 484$.
- $\text{JK} \times 6 = \text{KKK}$: **$74 \times 6 = 444$**.

### Exercise Set 5.4

1. **z = 0 or 9.** The digit sum is $3 + 1 + z + 5 = 9 + z$, which is a
   multiple of $9$ when $z = 0$ or $z = 9$. There are two answers because
   adding $9$ to a multiple of $9$ gives another: $3105$ and $3195$.
2. **The claim is false.** $(12n + 8) + (12m - 4) = 12(n + m) + 4$, which is
   not always a multiple of $8$: $20 + 8 = 28$ is not, though $8 + 8 = 16$
   is.
3. $3m + 3n = 3(m + n)$ is a multiple of $6$ exactly when $m + n$ is even:
   both multiples of $3$ are even multiples ($6 + 12 = 18$) or both are odd
   multiples ($3 + 9 = 12$). One of each gives an odd multiple of $3$
   ($3 + 6 = 9$), which is not a multiple of $6$.
4. 1. **True for every multiple of 9:** reversing the digits does not change
      their sum.
   2. **Yes — every shuffle.** Any rearrangement keeps the digit sum, so the
      new number is still a multiple of $9$ (for example $4536$, $6345$,
      $3456$).
5. $48a23b$ must be divisible by $2$ and $9$: $b$ even, and $17 + a + b$ a
   multiple of $9$. The pairs $(a, b)$ are **$(1, 0)$, $(8, 2)$, $(6, 4)$,
   $(4, 6)$, $(2, 8)$**.
6. $3p7q8$ must be divisible by $4$ and $11$. By $4$: $q8$ is a multiple of
   $4$, so $q$ is even. By $11$: $8 - q + 7 - p + 3 = 18 - (p + q)$ must be
   $0$ or $11$; $p + q = 18$ is impossible with $q$ even, so $p + q = 7$. The
   pairs $(p, q)$ are **$(7, 0)$, $(5, 2)$, $(3, 4)$, $(1, 6)$**.
7. **2, 3, 4.** They come round every $12$ numbers (the LCM of $2$, $3$ and
   $4$): $14, 15, 16$; $26, 27, 28$; $38, 39, 40$; and so on.
8. Answers will vary. A multiple of $36$ is a multiple of $4$ and of $9$. The
   first five strictly between them ($45000$ is itself one) are **45036, 45072, 45108, 45144, 45180**.
9. **$5p - 4$, $5p - 2$, $5p + 2$, $5p + 4$.**
10. Answers will vary. The number must end in $5$ (a number ending in $0$
    would lose its first digit when reversed), and the reversed number must
    be even and have a digit sum divisible by $3$. For example **200025**:
    $200025 = 15 \times 13335$, and $520002 = 6 \times 86667$.
11. **Deepak is wrong.** If $n = 11k$, then $2n = 22k = 11 \times 2k$, which
    is always a multiple of $11$.
12. 1. **Always true.** $6a \times 3b = 18ab = 9 \times 2ab$.
    2. **Always true.** $(2n - 2) + 2n + (2n + 2) = 6n$.
    3. **Always true.** Swapping $a$ with $b$ and $c$ with $d$ keeps the digit
       sum (so divisibility by $3$) and the units digit $f$ (so divisibility
       by $2$).
    4. **Never true.** $8(7b - 3) - 4(11b + 1) = 12b - 28 = 12(b - 3) + 8$,
       which leaves $8$ when divided by $12$.
13. Each number leaves a remainder of $0$, $1$ or $2$ when divided by $3$. The
    sum is divisible by $3$ exactly when the three remainders add to a
    multiple of $3$: when **all three remainders are the same** ($0 + 0 + 0$,
    $1 + 1 + 1$, $2 + 2 + 2$) or **all three are different** ($0 + 1 + 2$).
    For example $4 + 7 + 10 = 21$ and $3 + 4 + 5 = 12$; but $1 + 2 + 4 = 7$.
14. **Two:** yes, always a multiple of $2$ — one of two consecutive integers
    is even. **Three:** yes, always a multiple of $6$ — one is even and one
    is a multiple of $3$. **Four:** always a multiple of $24$ — among them are
    a multiple of $4$, another even number and a multiple of $3$, so
    $4 \times 2 \times 3$ divides the product. **Five:** always a multiple of
    $120$ — as for four, and one of them is a multiple of $5$.
15. 1. **E = 3, F = 7, G = 1:** $37 \times 3 = 111$.
    2. **W = 5, O = 7, M = 2, E = 8:** $575 \times 5 = 2875$.
16. **(iv).** Every multiple of $32$ is a multiple of $8$, and every multiple
    of $8$ is a multiple of $4$, so the circles nest with $4$ outside and $32$
    inside.

## Navakankari

A game; no answer.

## Beyond the Book

### Stage 1 — Using What You Know

Answered in the running text beneath each question in the book.

### Stage 2 — Solved Examples

Each example carries its own solution in the book.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (c) $2n^2 + 7$ |
| 2 | Single correct | (a) 4 |
| 3 | Single correct | (d) 2 |
| 4 | Single correct | (b) 7 |
| 5 | Single correct | (a) 2 |
| 6 | Single correct | (d) 97 |
| 7 | Multiple correct | (a), (b) |
| 8 | Multiple correct | (a), (b), (c) |
| 9 | Multiple correct | (a), (b), (c) |
| 10 | Multiple correct | (a), (c), (d) |
| 11 | Numerical answer | 1 |
| 12 | Numerical answer | 22 |
| 13 | Numerical answer | 10 |
| 14 | Matching | (c) P–3, Q–1, R–4, S–2 |
| 15 | Matching | (b) P–4, Q–3, R–2, S–1 |

### Stage 3 — Practice

Multiple choice and assertion–reason, as the key prints it:
1 (b) 2 (d) 3 (a) 4 (b) 5 (c) 6 (d) 7 (a) 8 (c) 9 (d) 10 (b)
11 (c) 12 (d) 13 (a) 14 (a) 15 (b) 16 (a) 17 (d) 18 (b) 19 (c)

Working for the multiple choice:

1. $4n + 6 = 2(2n + 3)$. The others are odd for some $n$.
2. $9 + 8 + 7 + 6 + 5 + 4 = 39$, $3 + 9 = 12$, $1 + 2 = 3$.
3. $2728$: $8 - 2 + 7 - 2 = 11$. The others give $12$, $10$ and $-10$.
4. $7 + 4 + 3 + 2 = 16$, $1 + 6 = 7$.
5. $72$ is a multiple of $4$, and $3 + d + 7 + 2 = 12 + d$ must be a
   multiple of $3$: of the options, only $d = 3$ ($3372 = 12 \times 281$).
6. $6k + 2 = 2(3k + 1)$ is even. $2$ and $8$ are not multiples of $3$, and
   $14$ is not a multiple of $4$.
7. With middle number $m$, the sum is $7m$. It is odd when $m$ is odd, not a
   multiple of $3$ when $m$ is not ($7 \times 1 = 7$).
8. $2 + 0 + 2 + 3 = 7$; adding $2$ gives $2025 = 9 \times 225$.
9. $c - b + a = c - (a + c) + a = 0$, so it is divisible by $11$. $121$ is
   not divisible by $9$, $3$ or $7$.
10. $a$ divides $36 + 60 = 96$. $a = 12$ divides $36$ and $60$ but not $30$,
    $50$ or $18$.
11. $7236$: last two digits $36$ (a multiple of $4$) and digit sum $18$. The
    others end in $62$, $54$ and $46$.
12. $82 \times 4 = 328$, so C $= 3$.
13. $5a$ is odd, so $5a + 1$ is even. The others are odd.
14. $2442$: digit sum $12$ and $2 - 4 + 4 - 2 = 0$. The others have digit sum
    $10$.
15. $2^{10} = 1024$; $1 + 0 + 2 + 4 = 7$.
16. (a) Both true, and the digit sum is the reason.
17. (d) $20$ is divisible by $4$ and $10$ but not by $40$ (the LCM is $20$);
    R is true.
18. (b) Both true; one fact does not explain the other.
19. (c) $9 + 0 + 8 + 1 + 6 = 24$, so A is true; R is false ($13$ is not
    divisible by $3$, and $12$ is).

Questions 20–31 are answered in the book's own key; their working:

20. **2.** $8 \times 7 = 56$, $5 + 6 = 11$, $1 + 1 = 2$.
21. **1001** $= 11 \times 91$.
22. **Yes.** $1 + 2 + \cdots + 9 = 45$, a multiple of $9$.
23. **$d = 0, 3, 6$ or $9$:** $64$ is a multiple of $4$ and $15 + d$ must be
    a multiple of $3$ ($5064, 5364, 5664, 5964$).
24. $2(4k + 3) = 8k + 6 = 4(2k + 1) + 2$.
25. **1, 3 and 1.** The number is $12k + 7$, and $12k$ is a multiple of $3$,
    $4$ and $6$, so the remainders are those of $7$.
26. **A = 1, B = 8, C = 5:** $185 \times 3 = 555$. ABC is $111\text{C} \div 3 = 37\text{C}$,
    whose units digit must be C, which happens only for C $= 5$.
27. **2178** $\times 4 = 8712$ (A = 2, B = 1, C = 7, D = 8). A is $1$ or $2$
    for a four-digit product, and even as the units digit of $4\text{D}$, so
    A $= 2$; then D is $8$ or $9$ and $4\text{D}$ ends in $2$, so D $= 8$;
    the tens and hundreds then force B $= 1$, C $= 7$.
28. $(100a + 10b + c) - (2a + 3b + c) = 98a + 7b = 7(14a + b)$. $581$: $10 + 24 + 1 = 35$, a
    multiple of $7$, and $581 = 7 \times 83$. $692$: $12 + 27 + 2 = 41$,
    which leaves $6$, so $692$ is not divisible by $7$ (it leaves $6$).
29. Digit sum $21$: **always** divisible by $3$, **never** by $9$. **Never**
    by $11$: the two alternating sums add to $21$, so their difference is odd
    and cannot be $0$, and it is at most $15 - 6 = 9$, so it cannot be
    $\pm 11$.
30. (a) **A and C** ($11$ and $22$; B gives $7$). (b) **8**: $61908$, since
    $d + 14$ must be $22$. (c) Swapping neighbours $x$ and $y$ changes the
    alternating sum by $2(x - y)$, which lies between $-18$ and $18$, is not
    $0$ and is even, so it is not a multiple of $11$: the new code is not
    divisible by $11$.
31. (a) **P and R** (digit sums $18$; Q has $21$). (b) **3**: $47313$.
    (c) **No.** A swap keeps the digit sum, so the wrong code still passes:
    $26352$ and $62352$ are both multiples of $9$.
