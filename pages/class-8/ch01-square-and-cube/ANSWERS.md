# Class 8 · Mathematics I · Chapter 1 — The Shape of a Number

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set — *Exercise Set 1.4, Q2* — so it can be used beside the book
without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file.** A question renumbered in the book and
not here is how this goes wrong.

Where a question asks the reader to choose or explain, the answer gives one
worked instance under *answers will vary*.

---

## 1.1 Introduction

### Think and Reflect (the corridor of lockers)

Answered in the running text that follows it. A locker is touched once for
each factor of its number, so it ends open exactly when that count is odd,
which happens only for a square. The open lockers are
**1, 4, 9, 16, 25, 36, 49, 64, 81, 100**.

### Exercise Set 1.1

1. Factors, paired, and the locker:
   - $18$: $1 \times 18$, $2 \times 9$, $3 \times 6$ — 6 factors, **shut**.
   - $25$: $1 \times 25$, and $5$ alone — 3 factors, **open**.
   - $30$: $1 \times 30$, $2 \times 15$, $3 \times 10$, $5 \times 6$ — 8 factors, **shut**.
   - $49$: $1 \times 49$, and $7$ alone — 3 factors, **open**.

2. **Student 12.** Factors come in pairs that multiply to the number, and
   $60 \div 5 = 12$. Student 12 comes after student 5 and changes the locker
   back.

3. **14.** The open lockers are the squares up to 200: $1^2$ to $14^2 = 196$,
   since $15^2 = 225$ is past 200.

4. It has exactly three factors, so it is a square (an odd count), and its
   root must be a prime: the factors are $1$, $p$ and $p^2$. The two smallest
   are **4 and 9**.

## 1.2 Square Numbers

### Exercise Set 1.2

1. **4093**, **6250** and **8877** cannot be squares.
   - $4093$ ends in $3$; $8877$ ends in $7$ — no square ends in 3 or 7.
   - $6250$ ends in one zero, and a square ends in an even number of zeros.
   - $1444$ ends in $4$, so the test says nothing. (It is $38^2$.)

2. Answers will vary. Any four-digit numbers ending in 2, 3, 7 or 8 — for
   example **1002, 2003, 3007, 4008, 5552**.

3. **4 or 6**, since $4^2 = 16$ and $6^2 = 36$ are the only single-digit
   squares ending in 6.

4. **Six.** $4000$ ends in three zeros, and squaring doubles the count:
   $4000^2 = 16\,000\,000$.

5. $441$ is **odd**, so its root is **odd** too: squaring keeps a number odd
   or even, so an even root would give an even square. (The root is 21.)

6. **$108^2$ and $292^2$.** The last digit of a square depends only on the
   last digit of the number: $4^2 = 16$ ends in 6, $8^2 = 64$ and $2^2 = 4$ end
   in 4, and $6^2 = 36$ ends in 6.

### Exercise Set 1.3

1. Add **251**, the 126th odd number: $2 \times 126 - 1 = 251$, and
   $126^2 = 15625 + 251 = 15876$.

2. - $49$: $48, 45, 40, 33, 24, 13, 0$ — seven steps, so $49 = 7^2$.
   - $60$: $59, 56, 51, 44, 35, 24, 11, -4$ — it overshoots, so **not a square**.
   - $81$: $80, 77, 72, 65, 56, 45, 32, 17, 0$ — nine steps, so $81 = 9^2$.

3. There are $2n$ numbers strictly between $n^2$ and $(n+1)^2$:
   **32**, **80** and **198**.

4. $1, 3, 6, 10, 15, 21, 28, 36, 45, 55$. Neighbours add to squares; any four
   of $1 + 3 = 4$, $3 + 6 = 9$, $6 + 10 = 16$, $10 + 15 = 25$, $15 + 21 = 36$,
   $21 + 28 = 49$, $28 + 36 = 64$, $36 + 45 = 81$, $45 + 55 = 100$.

5. $4^2 + 5^2 + 20^2 = 21^2$, since $16 + 25 + 400 = 441$. **Pattern:** two
   consecutive numbers squared, plus the square of their product, give the
   square of one more than the product.

## 1.3 Square Roots

### Think and Reflect (after Example 7)

Divide by **3**: $9408 \div 3 = 3136 = 56^2$. It is the same number as in
Example 6, and that should be expected. $9408 = 2^6 \times 3 \times 7^2$ has
one prime with an odd count, the single 3. Multiplying by 3 makes that count
even by adding a copy, and dividing by 3 makes it even by taking one away.
Either way the unpaired prime is the one that has to be dealt with.

### Exercise Set 1.4

1. - $225 = 3^2 \times 5^2$, so $\sqrt{225} = 15$.
   - $1156 = 2^2 \times 17^2$, so $\sqrt{1156} = 34$.
   - $3025 = 5^2 \times 11^2$, so $\sqrt{3025} = 55$.
   - $7056 = 2^4 \times 3^2 \times 7^2$, so $\sqrt{7056} = 84$.

2. **21 m**, since $441 = 3^2 \times 7^2$ and $3 \times 7 = 21$.

3. $2800 = 2^4 \times 5^2 \times 7$. The 7 has no partner, so 2800 is not a
   square. Multiply by **7**: $19600 = 140^2$.

4. $2925 = 3^2 \times 5^2 \times 13$. Divide by **13**: $225 = 15^2$, so the
   root is **15**.

5. The LCM of 14, 20 and 35 is $2^2 \times 5 \times 7 = 140$. The 5 and the 7
   are unpaired, so multiply by 35: **4900** $= 70^2$.

6. - $\sqrt{80}$: $8^2 = 64$ and $9^2 = 81$; 80 is nearer 81, so **9**.
   - $\sqrt{300}$: $17^2 = 289$ and $18^2 = 324$; 300 is nearer 289, so **17**.
   - $\sqrt{1000}$: $31^2 = 961$ and $32^2 = 1024$; 1000 is nearer 1024, so **32**.

7. **67.** Between 60 and 70; 4489 ends in 9, so the root ends in 3 or 7:
   63 or 67. $65^2 = 4225$ is less than 4489, so it is 67. Check:
   $67^2 = 4489$.

8. The side is $\sqrt{1444} = 38$ m, so **152 m** of skirting board.

## 1.4 Cubic Numbers

### Think and Reflect (the taxicab numbers)

- $4104 = 2^3 + 16^3 = 8 + 4096$, and $4104 = 9^3 + 15^3 = 729 + 3375$.
- $13832 = 2^3 + 24^3 = 8 + 13824$, and $13832 = 18^3 + 20^3 = 5832 + 8000$.

The second part asks the reader to run the search themselves; what it must
show is that every number below 1729 gives at most one pair.

## 1.5 Cube Roots

### Exercise Set 1.5

1. - $512 = 2^9$, so $\sqrt[3]{512} = 2^3 = 8$.
   - $729 = 3^6$, so $\sqrt[3]{729} = 3^2 = 9$.
   - $27000 = 2^3 \times 3^3 \times 5^3$, so $\sqrt[3]{27000} = 30$.
   - $10648 = 2^3 \times 11^3$, so $\sqrt[3]{10648} = 22$.

2. $1323 = 3^3 \times 7^2$. Multiply by **7**: $9261 = 21^3$, so the cube root
   is **21**.

3. $8640 = 2^6 \times 3^3 \times 5$. Divide by **5**: $1728 = 12^3$.

4. - (a) **False.** An odd number cubed is odd: $3^3 = 27$.
   - (b) **False.** $2^3 = 8$ and $12^3 = 1728$ both end in 8.
   - (c) **False.** The smallest, $10^3 = 1000$, already has four digits.
   - (d) **False.** The largest, $99^3 = 970\,299$, has six digits.
   - (e) **False.** $8$ has the four factors 1, 2, 4, 8. Only squares have an
     odd count of factors.

5. **$67^3 - 66^3$ is greater**, and so is **$67^2 - 66^2$**. The gaps between
   consecutive squares, and between consecutive cubes, grow as the numbers
   grow. (For the record: $67^3 - 66^3 = 13267$, $43^3 - 42^3 = 5419$,
   $67^2 - 66^2 = 133$, $43^2 - 42^2 = 85$.)

## 1.6 Where the Words Came From

### Exercise Set 1.6

1. - $64 = 2^6$: **both** (six is even and a multiple of three).
   - $216 = 2^3 \times 3^3$: a **cube** only.
   - $1000 = 2^3 \times 5^3$: a **cube** only; its three zeros already rule
     out a square.
   - $4225 = 5^2 \times 13^2$: a **square** only ($65^2$).

2. The edge is $\sqrt[3]{1728} = 12$, and a face is $12 \times 12 = 144$ square
   units.

3. - $\sqrt[3]{2744}$: ends in 4, so the root ends in 4; $1^3 \le 2 < 2^3$, so
     **14**.
   - $\sqrt[3]{9261}$: ends in 1, so the root ends in 1; $2^3 \le 9 < 3^3$, so
     **21**.
   - $\sqrt[3]{54872}$: ends in 2, so the root ends in 8; $3^3 \le 54 < 4^3$,
     so **38**.

4. $199 = 2 \times 100 - 1$, so this is the first 100 odd numbers, and the sum
   is $100^2 = 10000$.

5. **4** squares strictly between 100 and 200: 121, 144, 169, 196. **5** cubes
   with three digits: 125, 216, 343, 512, 729.

6. **A square, and not a cube.** Ten 2s deal into two piles of five, so it is
   $(2^5)^2 = 32^2$; ten is not a multiple of three, so they cannot be dealt
   into three piles.

7. $7290 = 2 \times 3^6 \times 5$. Divide by **10**: $729 = 9^3$.

8. **Ten times the cubes is larger.** Squares below 10 000: $1^2$ to $99^2$, so
   99. Cubes below 10 000: $1^3$ to $21^3 = 9261$, since $22^3 = 10648$, so 21;
   ten times that is 210.

9. The new area is $2 \times 30 \times 30 = 1800$ m², and
   $1800 = 2^3 \times 3^2 \times 5^2$ has an unpaired 2, so its root is not a
   whole number. $42^2 = 1764$ and $43^2 = 1849$; 1800 is nearer 1764, so the
   nearest whole number is **42 m**.

10. Answers will vary in wording. A square can end in only six of the ten
    digits, so its last digit rules out four endings; a cube can end in any
    digit, so its last digit rules out nothing. But each cube ending comes from
    exactly one root ending, while most square endings come from two (a square
    ending in 6 may have a root ending in 4 or 6).

11. **14**: $196 = 14^2$ and $2744 = 14^3$. Answers will vary for the second
    pair: any $n^2$ and $n^3$, for example 25 and 125.

12. The new square has side $n + 1$, so its area is
    $(n+1)^2 = n^2 + 2n + 1$. For $n = 7$: $49 + 15 = 64 = 8^2$.

13. - (a) **Impossible.** A square ends in an even number of zeros.
    - (b) **Impossible.** A cube ends in a multiple of three zeros.
    - (c) **Possible** — 64 is one.
    - (d) **Impossible.** A square is odd exactly when its root is odd.

14. First differences $7, 19, 37, 61, 91$; second $12, 18, 24, 30$; third
    $6, 6, 6$. **Three rounds**, settling on 6, which is how cubes behave. Each
    entry is one more than a cube: $n^3 + 1$.

15. Every prime must appear a multiple of six times, so the number is a sixth
    power. The next two after $64 = 2^6$ are **$729 = 3^6$** and
    **$4096 = 4^6$**.

16. Edge $\sqrt[3]{216} = 6$ m; base $36$ m²; five faces $5 \times 36 = 180$ m².

17. $n^4 = n \times n \times n \times n$ and $n^5$ is five copies.
    $2^4 = 16$, $2^5 = 32$, $3^4 = 81$, and $10^7$ ends in **7** zeros.

18. The sums are $2, 12, 36, 80, 150$. First differences $10, 24, 44, 70$;
    second $14, 20, 26$; third $6, 6$. **Three rounds** — adding a square to a
    cube still leaves a list that behaves like a cube, because the cube is the
    part that grows fastest.

19. Answers will vary.
    - Not ruled out, and not a square: **26** ends in 6, which a square may,
      but $5^2 = 25$ and $6^2 = 36$ leave it out.
    - Needs factorising: **1001** ends in 1, is odd and has no zeros, so no
      test in the chapter rules it out; $1001 = 7 \times 11 \times 13$ has
      every prime alone, so it is not a square.

---

## Beyond the Book

### Stage 1 · Using What You Know

Each of the eight questions is answered in the running text that follows it
on the page. The results, for reference: (1) the fourth power of a prime —
16 and 81; (2) 1875; (3) $n^2 < n^2 + n < (n+1)^2$; (4) $n = 72$;
(5) $a^2 = 2b^2$ is impossible; (6) $(2k+1)^2 = 8m + 1$; (7) 3 or 4 digits;
(8) 50.

### Stage 3 · Practice

Multiple choice and assertion–reason, as the key prints it:
1 (d), 2 (a), 3 (b), 4 (c), 5 (d), 6 (c), 7 (a), 8 (b), 9 (c), 10 (b),
11 (d), 12 (a), 13 (b), 14 (c), 15 (d), 16 (b), 17 (a), 18 (c), 19 (d).

The working for each:

1. $17^2 = 289$.
2. $3087$ ends in 7. ($1296 = 36^2$, $2116 = 46^2$, $5476 = 74^2$.)
3. $29 = 2 \times 15 - 1$, so $15^2 = 225$.
4. $36 = 2^2 \times 3^2$ has $3 \times 3 = 9$ factors.
5. $0.3 \times 0.3 = 0.09$.
6. $300^2 = 90\,000$: four zeros.
7. $9^2 = 81$ ends in 1.
8. $45 = 3^2 \times 5$: multiply by 5, giving $225 = 15^2$.
9. $81^2 = 6561$.
10. $24^3 = 13824$.
11. LCM $= 120 = 2^3 \times 3 \times 5$; times 30 gives $3600 = 60^2$.
12. $50^2 - 49^2 = 2 \times 49 + 1 = 99$.
13. Only $7^3$ ends in 3.
14. $45^3 = 91125$.
15. $10^2 + 10 = 110$.
16. (b) $16\,000 = 2^7 \times 5^3$ is not a cube, but it has three zeros, so R
    does not explain A.
17. (a) $2^6 \times 3^3 = (2^2 \times 3)^3 = 12^3$, and R is why.
18. (c) $7744 = 88^2$; R is false, since 14 ends in 4.
19. (d) $(-4)^2 = 16$, so A is false; R is true.
20. The 12th odd number is $2 \times 12 - 1 = 23$; the sum is $12^2 = 144$.
21. $-7$, since $(-7)^3 = -343$.
22. No. The two 2s cannot be dealt into three piles.
23. $1250 = 2 \times 5^4$. Multiply by $2^2 \times 5^2 = 100$:
    $125\,000 = 2^3 \times 5^6 = 50^3$. Cube root **50**.
24. **77.** See the key.
25. Side $45$ m; fencing $180$ m.
26. $2^2 \times 3^4 \times 7^2$ has each prime an even number of times; the root
    is $2 \times 3^2 \times 7 = 126$.
27. $400 = 20^2 = 190 + 210$, the 19th and 20th triangular numbers.
28. $125$ cubes; $27$ unpainted; $54$ painted on exactly one face. (The rest:
    8 corners with three faces, $12 \times 3 = 36$ with two;
    $8 + 36 + 54 + 27 = 125$.)
29. $32 \times 18 = 576 = 24^2$, so the side is 24 m. Fencing: $2 \times (32 + 18)
    = 100$ m against $4 \times 24 = 96$ m, so **4 m** less.
30. (a) 6, 7, 11 (b) 127 (c) edge 6, with 34 left over.
31. (a) 13 m, 17 m, 20 m (b) $15^2 - 13^2 = 56$ m² (c) between 17 m and 18 m,
    nearer 17 m, since $300 - 289 = 11$ and $324 - 300 = 24$.
