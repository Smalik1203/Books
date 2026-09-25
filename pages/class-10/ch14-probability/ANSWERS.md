# Class 10 · Mathematics I · Chapter 14 — Probability

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set — *Exercise Set 14.1, Q2* — so it can be used beside the book
without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file**, which counts the outcomes of each
experiment itself. A question renumbered in the book and not here is how this
goes wrong.

Every probability is the number of favourable outcomes over the number of
equally likely outcomes, written in lowest terms.

---

## 14.1 Probability — A Theoretical Approach

### Questions in the running text

- *Are the outcomes a red ball and a blue ball equally likely?* (4 red, 1
  blue) No: there are 4 red balls and 1 blue ball, so a red ball is more
  likely. Each of the five balls is equally likely.
- *Are E and F elementary events?* (Example 3) No: E has 2 outcomes and F
  has 4.
- *Try to answer these two questions.* (i) $P(\text{getting } 8) = \frac{0}{6} = 0$,
  an impossible event. (ii) $P(\text{number less than } 7) = \frac{6}{6} = 1$,
  a sure event. Both are answered in the text that follows.
- *Check that P(W) + P(B) + P(R) = 1* (Example 8):
  $\frac{2}{9} + \frac{3}{9} + \frac{4}{9} = \frac{9}{9} = 1$.
- *Check that the number of possible outcomes was finite* in Examples 1–9:
  2, 3, 6, 52, 2, 365, 40, 9 and 4 outcomes.
- *Can the same idea give a probability as a ratio of areas?* Yes, when every
  point of the region is equally likely: Example 11 does it.

### Exercise Set 14.1

1. - (i) 1
   - (ii) 0; an impossible event
   - (iii) 1; a sure event, or a certain event
   - (iv) 1
   - (v) 0 and 1

2. - (i) No. Whether a car starts depends on its condition, so the two
     outcomes need not be equally likely.
   - (ii) No. It depends on the player's skill.
   - (iii) Yes. A guess is as likely to be right as wrong.
   - (iv) Yes, taken as equally likely here (see the flag in `EDIT-LOG.md`).

3. A fair coin gives a head or a tail with equal probability $\frac{1}{2}$,
   so neither team is favoured.

4. (b) $-1.5$. A probability is never negative. The others lie between 0
   and 1: $\frac{2}{3}$, 15% $= 0.15$ and 0.7.

5. $P(\text{not } E) = 1 - 0.05 = 0.95$.

6. - (i) 0: there is no orange-flavoured sweet, an impossible event.
   - (ii) 1: every sweet is lemon-flavoured, a sure event.

7. $1 - 0.992 = 0.008$.

8. 8 balls.
   - (i) $\frac{3}{8}$
   - (ii) $1 - \frac{3}{8} = \frac{5}{8}$

9. $5 + 8 + 4 = 17$ marbles.
   - (i) $\frac{5}{17}$
   - (ii) $\frac{8}{17}$
   - (iii) $\frac{5 + 8}{17} = \frac{13}{17}$

10. $100 + 50 + 20 + 10 = 180$ coins.
    - (i) $\frac{100}{180} = \frac{5}{9}$
    - (ii) $\frac{180 - 10}{180} = \frac{17}{18}$

11. $5 + 8 = 13$ fish; $P(\text{male}) = \frac{5}{13}$.

12. 8 equally likely outcomes.
    - (i) $\frac{1}{8}$
    - (ii) 1, 3, 5, 7: $\frac{4}{8} = \frac{1}{2}$
    - (iii) 3, 4, 5, 6, 7, 8: $\frac{6}{8} = \frac{3}{4}$
    - (iv) all 8: $\frac{8}{8} = 1$

13. - (i) 2, 3, 5: $\frac{3}{6} = \frac{1}{2}$
    - (ii) 3, 4, 5: $\frac{3}{6} = \frac{1}{2}$
    - (iii) 1, 3, 5: $\frac{3}{6} = \frac{1}{2}$

14. 52 outcomes.
    - (i) 2 red kings: $\frac{2}{52} = \frac{1}{26}$
    - (ii) 12 face cards: $\frac{12}{52} = \frac{3}{13}$
    - (iii) 6 red face cards: $\frac{6}{52} = \frac{3}{26}$
    - (iv) $\frac{1}{52}$
    - (v) 13 spades: $\frac{13}{52} = \frac{1}{4}$
    - (vi) $\frac{1}{52}$

15. - (i) 5 cards: $\frac{1}{5}$
    - (ii) 4 cards are left. (a) $\frac{1}{4}$ (b) the queen is gone: $\frac{0}{4} = 0$

16. $12 + 132 = 144$ pens; $\frac{132}{144} = \frac{11}{12}$.

17. - (i) $\frac{4}{20} = \frac{1}{5}$
    - (ii) 19 bulbs are left, 4 of them defective: $\frac{19 - 4}{19} = \frac{15}{19}$

18. 90 discs.
    - (i) 10 to 90 is 81 numbers: $\frac{81}{90} = \frac{9}{10}$
    - (ii) 1, 4, 9, 16, 25, 36, 49, 64, 81: $\frac{9}{90} = \frac{1}{10}$
    - (iii) 5, 10, …, 90 is 18 numbers: $\frac{18}{90} = \frac{1}{5}$

19. - (i) two faces show A: $\frac{2}{6} = \frac{1}{3}$
    - (ii) $\frac{1}{6}$

20. Area of the rectangle $= 3 \times 2 = 6$ m²; area of the circle
    $= \pi \times 0.5^2 = \frac{\pi}{4}$ m². So the probability is
    $\frac{\pi}{4} \div 6 = \frac{\pi}{24}$.

21. $144 - 20 = 124$ good pens.
    - (i) $\frac{124}{144} = \frac{31}{36}$
    - (ii) $\frac{20}{144} = \frac{5}{36}$

22. - (i) From Table 14.3, the numbers of outcomes for the sums 2 to 12 are
      1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, so the probabilities are
      $\frac{1}{36}$, $\frac{2}{36}$, $\frac{3}{36}$, $\frac{4}{36}$,
      $\frac{5}{36}$, $\frac{6}{36}$, $\frac{5}{36}$, $\frac{4}{36}$,
      $\frac{3}{36}$, $\frac{2}{36}$, $\frac{1}{36}$.
    - (ii) No. The 11 sums are not equally likely: a sum of 7 has 6 outcomes
      and a sum of 2 has 1.

23. The 8 outcomes are HHH, HHT, HTH, THH, HTT, THT, TTH, TTT. Hanif wins on
    HHH and TTT, so $P(\text{loses}) = 1 - \frac{2}{8} = \frac{6}{8} = \frac{3}{4}$.

24. 36 outcomes; 5 fails to come up on $5 \times 5 = 25$ of them.
    - (i) $\frac{25}{36}$
    - (ii) $1 - \frac{25}{36} = \frac{11}{36}$

25. - (i) Not correct. The equally likely outcomes are HH, HT, TH and TT,
      so *one of each* has probability $\frac{2}{4} = \frac{1}{2}$, and two
      heads and two tails have $\frac{1}{4}$ each.
    - (ii) Correct. 1, 3 and 5 are odd, 3 of the 6 equally likely outcomes,
      so the probability is $\frac{3}{6} = \frac{1}{2}$.

---

## Beyond the Book

### Stage 1 · Using What You Know

Each of the five questions is answered in the running text that follows it
on the page: (1) $\frac{3}{4}$; (2) $\frac{7}{13}$; (3) $\frac{3}{8}$;
(4) 18 blue balls; (5) $\frac{1}{3}$.

### Stage 2 · Solved Examples

The 24 September 2026 examples, in examination formats. Each is worked in full on
its page; these are the keys.

1. (a) $\frac{1}{2}$ *(single correct)*
2. (b) $\frac{3}{4}$ *(single correct)*
3. (c) $\frac{1}{13}$ *(single correct)*
4. (d) 0.65 *(single correct)*
5. (a) $\frac{5}{36}$ *(single correct)*
6. (b) $\frac{3}{8}$ *(single correct)*
7. (a), (b), (d) *(multiple correct)*
8. (a), (b), (c) *(multiple correct)*
9. (a), (b) *(multiple correct)*
10. (a), (b), (c), (d) *(multiple correct)*
11. 6 *(numerical answer)*
12. 5 *(numerical answer)*
13. 0.95 *(numerical answer)*
14. (c) P–3, Q–4, R–2, S–1 *(matching)*
15. (d) P–4, Q–1, R–3, S–2 *(matching)*

### Stage 3 · Practice

Multiple choice and assertion–reason, as the key prints it:
1 (a), 2 (b), 3 (c), 4 (d), 5 (d), 6 (b), 7 (a), 8 (c), 9 (b), 10 (d),
11 (c), 12 (b), 13 (d), 14 (a), 15 (c).

The working for each:

1. 1 and 2: $\frac{2}{6} = \frac{1}{3}$.
2. E, A, I, A, I, O are 6 of the 11 letters: $\frac{6}{11}$.
3. 10 primes up to 30: $\frac{10}{30} = \frac{1}{3}$.
4. Only TT: $\frac{1}{4}$.
5. 2 black aces and 2 red kings: $\frac{4}{52} = \frac{1}{13}$.
6. $4 + 6 = 10$ of 15 balls: $\frac{10}{15} = \frac{2}{3}$.
7. 0.0001, the value nearest 0.
8. 6 doubles, so $\frac{36 - 6}{36} = \frac{30}{36} = \frac{5}{6}$.
9. 2, 4, …, 24 is 12 numbers: $\frac{12}{25}$.
10. The multiples of 6 up to 40 are 6, 12, 18, 24, 30, 36: $\frac{6}{40} = \frac{3}{20}$.
11. Multiples of 3: 3, 6. Not factors of 6: 4, 5. Each is $\frac{2}{6} = \frac{1}{3}$, so both are right.
12. (b) No product of two numbers from 1 to 6 is 13; R is true but does not
    explain A.
13. (d) Sunday or Monday is $\frac{2}{7}$; R is true.
14. (a) $\frac{26}{52} = \frac{1}{2}$, and R is the reason.
15. (c) $\frac{4}{9}$ is right; red and green are not equally likely.
16. 1, 2, 3, 4, 6: $\frac{5}{6}$.
17. 14 multiples of 7 up to 100: $\frac{14}{100} = \frac{7}{50}$.
18. 2, 3, 4, 5 of spades and of clubs: $\frac{8}{52} = \frac{2}{13}$.
19. $\frac{240}{250} = \frac{24}{25}$.
20. (5, 5), (5, 6), (6, 5), (6, 6): $\frac{4}{36} = \frac{1}{9}$.
21. (i) 8 primes: $\frac{8}{20} = \frac{2}{5}$ (ii) 6 numbers: $\frac{6}{20} = \frac{3}{10}$ (iii) only 20: $\frac{1}{20}$
22. The 12 outcomes are H1, H2, H3, H4, H5, H6, T1, T2, T3, T4, T5, T6.
    Favourable: the 6 heads, T5 and T6, so $\frac{8}{12} = \frac{2}{3}$.
23. 44 cards are left. (i) $\frac{11}{44} = \frac{1}{4}$ (ii) $\frac{8}{44} = \frac{2}{11}$ (iii) $\frac{18}{44} = \frac{9}{22}$
24. (i) $\frac{12}{36} = \frac{1}{3}$ (ii) $\frac{9}{36} = \frac{1}{4}$
25. $p = 3(1 - p)$ gives $p = \frac{3}{4}$. Check: $\frac{3}{4} = 3 \times \frac{1}{4}$.
26. (i) $\frac{8}{36} = \frac{2}{9}$ (ii) $\frac{6}{36} = \frac{1}{6}$ (iii) $\frac{7}{36}$ (iv) $\frac{6}{36} = \frac{1}{6}$
27. 17 cards. (i) $\frac{10}{17}$ (ii) $\frac{1}{17}$ (iii) $\frac{2}{17}$ (iv) $\frac{14}{17}$
28. (i) 20 coins of ₹1 and 15 of ₹2, so $60 - 20 - 15 = 25$ coins of ₹5
    (ii) $\frac{35}{70} = \frac{1}{2}$
29. 100 tokens. (a) $\frac{15}{100} = \frac{3}{20}$ (b) $\frac{90}{100} = \frac{9}{10}$ (c) $\frac{55}{100} = \frac{11}{20}$ (d) $\frac{14}{99}$
30. (a) $\frac{5}{12}$ (b) $\frac{7}{12}$ (c) $\frac{8}{12} = \frac{2}{3}$ (d) No:
    the 12 sectors are the equally likely outcomes, and only 1 shows ₹50,
    so the probability is $\frac{1}{12}$.
