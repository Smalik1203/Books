# Class 10 · Mathematics I · Chapter 1 — Real Numbers

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set — *Exercise Set 1.1, Q2* — so it can be used beside the book
without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file.** A question renumbered in the book and
not here is how this goes wrong.

A proof is set out one statement to a line, with its reason, as Class 10
papers expect.

---

## 1.2 The Fundamental Theorem of Arithmetic

### The question in the running text

*Does the collection of all primes and all their products contain every
composite number?* Answered in the text that follows it: yes. Every factor
tree ends in primes, which is the Fundamental Theorem of Arithmetic
(Theorem 1.1). The two primes it asks the reader to check are prime:
3803 and 3607 have no prime factor up to their square roots (61 and 60).

### Exercise Set 1.1

1. - (i) $140 = 2^2 \times 5 \times 7$
   - (ii) $156 = 2^2 \times 3 \times 13$
   - (iii) $3825 = 3^2 \times 5^2 \times 17$
   - (iv) $5005 = 5 \times 7 \times 11 \times 13$
   - (v) $7429 = 17 \times 19 \times 23$

2. - (i) $26 = 2 \times 13$ and $91 = 7 \times 13$. HCF $= 13$, LCM
     $= 2 \times 7 \times 13 = 182$. Check: $13 \times 182 = 2366 = 26 \times 91$.
   - (ii) $510 = 2 \times 3 \times 5 \times 17$ and $92 = 2^2 \times 23$.
     HCF $= 2$, LCM $= 2^2 \times 3 \times 5 \times 17 \times 23 = 23460$.
     Check: $2 \times 23460 = 46920 = 510 \times 92$.
   - (iii) $336 = 2^4 \times 3 \times 7$ and $54 = 2 \times 3^3$. HCF $= 6$,
     LCM $= 2^4 \times 3^3 \times 7 = 3024$. Check:
     $6 \times 3024 = 18144 = 336 \times 54$.

3. - (i) $12 = 2^2 \times 3$, $15 = 3 \times 5$, $21 = 3 \times 7$: HCF $= 3$,
     LCM $= 2^2 \times 3 \times 5 \times 7 = 420$.
   - (ii) 17, 23 and 29 are primes: HCF $= 1$,
     LCM $= 17 \times 23 \times 29 = 11339$.
   - (iii) $8 = 2^3$, $9 = 3^2$, $25 = 5^2$: HCF $= 1$,
     LCM $= 2^3 \times 3^2 \times 5^2 = 1800$.

4. $\text{LCM}(306, 657) = \dfrac{306 \times 657}{9} = 22338$.

5. **No.** $6^n = 2^n \times 3^n$. A number ending with 0 is divisible by 5,
   and by the uniqueness of prime factorisation 5 cannot appear in $6^n$.

6. - $7 \times 11 \times 13 + 13 = 13 \times (7 \times 11 + 1) = 13 \times 78 = 1014$
   - $7 \times 6 \times 5 \times 4 \times 3 \times 2 \times 1 + 5 = 5 \times (7 \times 6 \times 4 \times 3 \times 2 \times 1 + 1) = 5 \times 1009 = 5045$

   Each has a factor (13, and 5) other than 1 and itself, so each is
   composite.

7. They meet again after $\text{LCM}(18, 12)$ minutes. $18 = 2 \times 3^2$ and
   $12 = 2^2 \times 3$, so the LCM is $2^2 \times 3^2 = 36$: **36 minutes**.

## 1.3 Revisiting Irrational Numbers

### Exercise Set 1.2

1. **$\sqrt{5}$ is irrational.**
   - Suppose $\sqrt{5} = \frac{a}{b}$, with $a$ and $b$ coprime integers and
     $b \neq 0$. *(assume it is rational)*
   - $b\sqrt{5} = a$, so $5b^2 = a^2$. *(squaring)*
   - 5 divides $a^2$, so 5 divides $a$. *(Theorem 1.2)*
   - $a = 5c$, so $5b^2 = 25c^2$, that is, $b^2 = 5c^2$.
   - 5 divides $b^2$, so 5 divides $b$. *(Theorem 1.2)*
   - 5 is a common factor of $a$ and $b$, which contradicts their being
     coprime. So $\sqrt{5}$ is irrational.

2. **$3 + 2\sqrt{5}$ is irrational.**
   - Suppose $3 + 2\sqrt{5} = \frac{a}{b}$, with $a$, $b$ coprime integers
     and $b \neq 0$.
   - Then $\sqrt{5} = \dfrac{a - 3b}{2b}$. *(rearranging)*
   - The right-hand side is rational, since $a$ and $b$ are integers, so
     $\sqrt{5}$ would be rational.
   - This contradicts Q1, so $3 + 2\sqrt{5}$ is irrational.

3. - (i) If $\dfrac{1}{\sqrt{2}} = \frac{a}{b}$, then $\sqrt{2} = \frac{b}{a}$
     (with $a \neq 0$, since $\frac{1}{\sqrt{2}}$ is not 0), which is
     rational — contradicting Theorem 1.3.
   - (ii) If $7\sqrt{5} = \frac{a}{b}$, then $\sqrt{5} = \frac{a}{7b}$, which is
     rational — contradicting Q1.
   - (iii) If $6 + \sqrt{2} = \frac{a}{b}$, then $\sqrt{2} = \frac{a - 6b}{b}$,
     which is rational — contradicting Theorem 1.3.

### A Note to the Reader (the check it asks for)

With $p = 6$, $q = 72$, $r = 120$: $pqr = 51840$, $\text{HCF}(p, q, r) = 6$,
$\text{LCM}(p, q, r) = 360$; $\text{HCF}(6, 72) = 6$, $\text{HCF}(72, 120) = 24$,
$\text{HCF}(6, 120) = 6$; $\text{LCM}(6, 72) = 72$, $\text{LCM}(72, 120) = 360$,
$\text{LCM}(6, 120) = 120$.

- $\dfrac{51840 \times 6}{6 \times 24 \times 6} = 360$, the LCM.
- $\dfrac{51840 \times 360}{72 \times 360 \times 120} = 6$, the HCF.

---

## Beyond the Book

### Stage 1 · Using What You Know

Each of the five questions is answered in the running text that follows it
on the page: (1) LCM 720, and no pair has HCF 18 and LCM 380; (2) 625;
(3) 1085; (4) not always — $\sqrt{2} \times \sqrt{8} = 4$; (5) irrational.

### Stage 2 · Solved Examples

The 24 September 2026 examples, in examination formats. Each is worked in full on
its page; these are the keys.

1. (a) 4 *(single correct)*
2. (b) 360 *(single correct)*
3. (c) 153 *(single correct)*
4. (d) $3 + \sqrt{5}$ *(single correct)*
5. (a) 72 *(single correct)*
6. (b) $3^2 \times 5^2 \times 17$ *(single correct)*
7. (a), (b) *(multiple correct)*
8. (a), (c), (d) *(multiple correct)*
9. (a), (b), (d) *(multiple correct)*
10. (a), (b) *(multiple correct)*
11. 36 *(numerical answer)*
12. 288 *(numerical answer)*
13. 17 *(numerical answer)*
14. (a) P–4, Q–1, R–2, S–3 *(matching)*
15. (b) P–3, Q–4, R–2, S–1 *(matching)*

### Stage 3 · Practice

Multiple choice and assertion–reason, as the key prints it:
1 (a), 2 (d), 3 (c), 4 (b), 5 (a), 6 (d), 7 (b), 8 (c), 9 (b), 10 (a),
11 (c), 12 (b), 13 (d), 14 (d), 15 (c), 16 (a), 17 (c), 18 (d), 19 (b).

The working for each:

1. $3150 = 2 \times 3^2 \times 5^2 \times 7$.
2. $\text{HCF}(135, 225) = 3^2 \times 5 = 45$.
3. $\text{LCM}(12, 15, 20) = 2^2 \times 3 \times 5 = 60$.
4. $\dfrac{9 \times 459}{27} = 153$.
5. $\sqrt{12} = 2\sqrt{3}$ is irrational; the others are 7, $\frac{3}{4}$ and
   $\frac{1}{4}$.
6. $5^n$ has no factor 2, so it never ends with 0.
7. A common factor of $n$ and $n + 1$ divides their difference, 1.
8. Theorem 1.2.
9. $\text{HCF}(65, 117) = 13$.
10. $\text{LCM}(9, 12, 15) = 180$ minutes after 8 a.m. is 11:00 a.m.
11. $(\sqrt{2} + \sqrt{3})^2 = 5 + 2\sqrt{6}$.
12. $n = 2$: only $c$ can supply $3^2$.
13. $2\sqrt{3} \times \sqrt{3} = 2 \times 3 = 6$, so only Lata is right: Kiran's
    $2\sqrt{3}$ is not rational.
14. $\text{HCF}(2, 4) = 2$.
15. $\text{HCF}(360, 450) = 90$ cm.
16. (a) $5 \times 7 \times 11 + 7 = 7 \times 56$.
17. (c) $\sqrt{3} \times \sqrt{12} = \sqrt{36} = 6$; R is false.
18. (d) $2 \times 24 = 48$ but $4 \times 6 \times 8 = 192$; R is true for two
    numbers.
19. (b) $8^n = 2^{3n}$ has no factor 5; that 8 is not prime does not explain it.
20. $1001 = 7 \times 11 \times 13$.
21. $\dfrac{23 \times 1449}{161} = 207$. Check: $161 = 7 \times 23$ and
    $207 = 3^2 \times 23$ give HCF 23 and LCM $3^2 \times 7 \times 23 = 1449$.
22. $2^2 \times 3 = 12$.
23. $120 = 2^3 \times 3 \times 5$, $144 = 2^4 \times 3^2$,
    $204 = 2^2 \times 3 \times 17$. HCF $= 12$, LCM $= 12240$.
24. As Exercise Set 1.2 Q1, with 11 for 5: $11b^2 = a^2$; 11 divides $a$;
    $a = 11c$ gives $b^2 = 11c^2$; 11 divides $b$ — a contradiction.
25. $\sqrt{5} = \dfrac{2b - a}{3b}$ would be rational — a contradiction.
26. $850 = 2 \times 5^2 \times 17$, $680 = 2^3 \times 5 \times 17$; HCF
    $= 170$ litres.
27. $18 - 8 = 24 - 14 = 30 - 20 = 10$, so the number plus 10 is a common
    multiple of 18, 24 and 30. LCM $= 360$. **350**, then **710**. Check:
    350 leaves 8, 14 and 20.
28. - Suppose $\sqrt{6} = \frac{a}{b}$, $a$ and $b$ coprime, $b \neq 0$.
    - $6b^2 = a^2$, so 2 divides $a^2$, so 2 divides $a$. *(Theorem 1.2)*
    - $a = 2c$ gives $6b^2 = 4c^2$, that is, $3b^2 = 2c^2$.
    - 2 divides $3b^2$. 2 does not divide 3, so by the uniqueness of prime
      factorisation 2 divides $b^2$, and so 2 divides $b$.
    - 2 divides both $a$ and $b$ — a contradiction. So $\sqrt{6}$ is
      irrational.
29. $391 = 17 \times 23$ and $544 = 2^5 \times 17$, so **17** fruits a box;
    $23 + 32 = 55$ boxes.
30. (a) $48 = 2^4 \times 3$, $72 = 2^3 \times 3^2$, $108 = 2^2 \times 3^3$
    (b) $2^4 \times 3^3 = 432$ seconds (c) 7:07:12 a.m. (d) 8 times: 432
    seconds × 8 is 3456 seconds, before 8:00, and × 9 is 3888, after it.
31. (a) $60 = 2^2 \times 3 \times 5$, $84 = 2^2 \times 3 \times 7$,
    $108 = 2^2 \times 3^3$ (b) 12 (c) $5 + 7 + 9 = 21$ groups.
