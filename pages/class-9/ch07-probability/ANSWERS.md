# Class 9 · Mathematics I · Chapter 7 — The Measure of Chance

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set — *Exercise Set 7.2, Q1* — so it can be used beside the book
without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file.** A question renumbered in the book and
not here is how this goes wrong.

Where a question asks for your own trials or your own day, the answers vary;
one worked instance is given.

---

## 7.1 Introduction

### Think and Reflect

1. **No.** A fair coin has no reason to prefer either face, so every call —
   heads, tails, or a rule for choosing — is right half the time in the long
   run. No reason your friend gives can change the coin.

### Exercise Set 7.1

1. - (i) certain (in ordinary life, the sun rises every morning)
   - (ii) even chance: $P(\text{tails}) = \tfrac12$
   - (iii) impossible
   - (iv) more likely (for most students; answers may vary with the reason)
   - (v) certain: every face of a die is less than 7, so $P = \tfrac66 = 1$

2. - (i) $\tfrac12 = 0.5 = 50\%$
   - (ii) $0.2 = \tfrac15 = 20\%$
   - (iii) $60\% = \tfrac35 = 0.6$
   - (iv) $\tfrac38 = 0.375 = 37.5\%$

3. With 5 red of 10, $P(\text{red}) = \tfrac{5}{10} = \tfrac12$, an even
   chance. With 5 more red, $P(\text{red}) = \tfrac{10}{15} = \tfrac23$: it
   moves right, towards certain, because a larger share of the counters is
   red.

4. Answers vary. One instance: close to 0, that school is closed on a normal
   Monday; close to $\tfrac12$, that a coin tossed at lunch lands heads;
   close to 1, that the school bell rings at the end of the day.

5. $1.4$ is greater than 1, and no probability can be more than certain. The
   number is wrong whatever the weather.

## 7.2 Two Ways to Find It

### Think and Reflect

1. Not vowels: P, R, B, B, L, T, Y — 7 of the 11 letters, so
   $P(\text{not a vowel}) = \tfrac{7}{11}$, and $\tfrac{4}{11} + \tfrac{7}{11} = 1$.
   It must always happen: every outcome either belongs to the event or does
   not, and never both, so the two counts together are all the outcomes.
   Their probabilities are two shares of one whole.

2. **No.** The fifth roll is still $\tfrac16$ for a 4. The die has no memory
   of the four 4s. The fraction settles by dilution, not correction: the four
   early 4s become a smaller and smaller part of a growing total. This is the
   gambler's fallacy, which the chapter names straight after.

### Exercise Set 7.2

1. - (i) $\tfrac{12}{30} = \tfrac25$
   - (ii) $\tfrac{9}{30} \times 600 = 180$ yellow sweets, about

2. - (i) $\tfrac{12}{40} = \tfrac{3}{10}$
   - (ii) $\tfrac{16}{40} \times 800 = 320$ students, about

3. Answers vary. One instance: 11 heads and 9 tails; experimental
   probability $\tfrac{11}{20} = 0.55$, which is $0.05$ from $\tfrac12$. After
   200 tosses it should usually be closer, by the law of large numbers.

4. Answers vary. One instance: base 21, top 9, side 70, giving $0.21$,
   $0.09$ and $0.7$. **No**: a cup is not symmetrical, so there is no
   reasoning that gives these; they can only be measured.

5. $\tfrac36 = \tfrac12$. It is theoretical: it comes from counting three
   even faces out of six equally likely ones, and no die was rolled.

6. $\tfrac{22}{50} = 0.44$ and $\tfrac{31}{50} = 0.62$. Different counts in
   two sets of 50 tosses are ordinary for a fair coin, and neither result
   proves bias. To test the coin, toss it many more times and see where the
   proportion settles.

## 7.3 Outcomes, Listed

### Think and Reflect

1. $S = \{\text{HH}, \text{HT}, \text{TH}, \text{TT}\}$. The list
   $\{\text{HH}, \text{HT}, \text{TT}\}$ is **not** complete: with a rupee and a
   five-rupee coin, "rupee heads, five-rupee tails" and "rupee tails,
   five-rupee heads" are two different outcomes.

### Exercise Set 7.3

1. $S = \{1, 2, 3, 4, 5, 6\}$, $n(S) = 6$.

2. - (i) $\{\text{H}1, \text{H}2, \text{H}3, \text{H}4, \text{H}5, \text{H}6, \text{T}1, \text{T}2, \text{T}3, \text{T}4, \text{T}5, \text{T}6\}$ — 12 outcomes, $2 \times 6 = 12$
   - (ii) $\{\text{red}, \text{green}, \text{blue}\}$
   - (iii) $\{\text{win}, \text{lose}, \text{draw}, \text{tie}\}$ — **flagged**: the
     answer depends on the format. A Test match can be won, lost, drawn or
     tied; a limited-overs match has no draw (win, lose, tie, no result).
     Either list is accepted with its reason.

3. - (i) $\{1, 3, 5\}$, $\tfrac36 = \tfrac12$
   - (ii) $\{5, 6\}$, $\tfrac26 = \tfrac13$
   - (iii) $\{5\}$, $\tfrac16$
   - (iv) $\{\ \}$, $0$

4. - (i) samosa–lassi, samosa–nimbu paani, dhokla–lassi, dhokla–nimbu paani,
     vada–lassi, vada–nimbu paani
   - (ii) 6, and $3 \times 2 = 6$

5. Probability 1: the event contains every outcome in the sample space.
   Probability 0: it contains no outcome — it is the empty set.

### Exercise Set 7.4

1. - (i) Three branches from the start (apple, orange, orange), and two from
     each (banana, mango). The two oranges are drawn as two branches.
   - (ii) $S = \{$apple–banana, apple–mango, orange 1–banana, orange 1–mango,
     orange 2–banana, orange 2–mango$\}$, $n(S) = 6$
   - (iii) $\tfrac16$

2. Taken as a box with the same number of pens of each colour, as the question
   intends. **Flagged**: the question does not say so.
   - (i) Three branches (red, blue, black), and three from each.
   - (ii) $3 \times 3 = 9$ outcomes.
   - (iii) Same colour: red–red, blue–blue, black–black, so $\tfrac39 = \tfrac13$.

3. - (i) $S = \{\text{HHH}, \text{HHT}, \text{HTH}, \text{HTT}, \text{THH}, \text{THT}, \text{TTH}, \text{TTT}\}$
   - (ii) HHT, HTH, THH: $\tfrac38$
   - (iii) every outcome except HHH: $\tfrac78$, or $1 - \tfrac18$

4. The second stage changes. With the pen not put back, the branches from each
   first colour show what is left in the box, so they differ from one first
   draw to another; if there is one pen of each colour, the colour already drawn has
   no branch at all. The first draw has changed what the second can be.

---

## Beyond the Book

### Stage 1 · Using What You Know

Each question is explained in the running text beneath it. The values it
reaches: Q1 8 blue; Q2 a run of eight heads is evidence of bias, not proof
(about 1 in 256 for a fair coin); Q3 the sums are not equally likely,
$P(\text{sum} = 2) = \tfrac{1}{36}$; Q4 $\{6, 8\}$, $\tfrac14$; Q5 the first
survey, $0.75$; Q6 exactly three heads, $\tfrac14$ against $\tfrac{1}{16}$;
Q7 just as likely, $\tfrac{12}{20} = \tfrac35$ both times; Q8 26 students;
Q9 $P(1) = \tfrac12$, $P(2) = \tfrac13$, $P(3) = \tfrac16$.

### Stage 2 · Solved Examples

The 23 September 2026 examples, in examination formats. Each is worked in full on
its page; these are the keys.

1. (a) $\frac{9}{20}$ *(single correct)*
2. (b) $0.55$ *(single correct)*
3. (c) 0.65 *(single correct)*
4. (d) 0.4 *(single correct)*
5. (a) $\frac{9}{25}$ *(single correct)*
6. (b) 15 *(single correct)*
7. (a), (b), (c) *(multiple correct)*
8. (a), (c) *(multiple correct)*
9. (a), (c), (d) *(multiple correct)*
10. (a), (b), (c) *(multiple correct)*
11. 420 *(numerical answer)*
12. 30 *(numerical answer)*
13. 9 *(numerical answer)*
14. (c) P–3, Q–4, R–2, S–1 *(matching)*
15. (b) P–4, Q–2, R–3, S–1 *(matching)*

### Stage 3 · Practice — the key, as the key prints it

1 (c) &nbsp; 2 (d) &nbsp; 3 (a) &nbsp; 4 (b) &nbsp; 5 (b) &nbsp; 6 (c) &nbsp; 7 (d) &nbsp; 8 (d) &nbsp; 9 (c) &nbsp; 10 (a) &nbsp; 11 (d) &nbsp; 12 (a) &nbsp; 13 (c) &nbsp; 14 (a) &nbsp; 15 (b) &nbsp; 16 (d) &nbsp; 17 (b) &nbsp; 18 (c) &nbsp; 19 (a) &nbsp; 20 (c) &nbsp; 21 (b) &nbsp; 22 (d)

### The working for each

1. $\tfrac{27}{60} = 0.45$.
2. $\tfrac54 = 1.25$, more than 1.
3. $1 - 0.7 = 0.3$.
4. C appears twice in six letters: $\tfrac26 = \tfrac13$.
5. $3 + 4 = 7$ of 12 counters are not blue: $\tfrac{7}{12}$.
6. $(2, 6), (3, 5), (4, 4), (5, 3), (6, 2)$: $\tfrac{5}{36}$.
7. 3 red of the 9 left: $\tfrac39 = \tfrac13$.
8. $\{3, 4, 6, 8, 9, 12\}$: $\tfrac{6}{12} = \tfrac12$.
9. $200 - 92 = 108$, and $\tfrac{108}{200} = 0.54$.
10. $1 - \tfrac{25}{36} = \tfrac{11}{36}$.
11. TTT, HTT, THT, TTH: $\tfrac48 = \tfrac12$.
12. $\tfrac{x}{5 + x} = \tfrac27$ gives $7x = 10 + 2x$, so $x = 2$.
13. $10 + 6 - 2 = 14$ numbers: $\tfrac{14}{30} = \tfrac{7}{15}$.
14. A, E, I, O, U: $\tfrac{5}{26}$.
15. $2 \times 2 \times 6 = 24$.
16. $\tfrac{310}{500} = 0.62$, from the trials.
17. Sums 10, 11, 12 come $3 + 2 + 1 = 6$ ways: $\tfrac{6}{36} = \tfrac16$.
18. (ii) and (iii); 530 heads in 1000 does not prove bias.
19. (a): $\tfrac36 = \tfrac12$, and R is the count that gives it.
20. (c): A is true; R is false, since a theoretical probability does not depend on trials.
21. (b): MATHS has one vowel in five letters, $\tfrac15$; R is true but does not explain A.
22. (d): A is false, since an even chance promises nothing about any two trials; R is true.
23. $\tfrac{9}{40} = 0.225$, or $22.5\%$.
24. $\{4, 8, 12, 16, 20\}$: $\tfrac{5}{20} = \tfrac14$.
25. 4 S in 11 letters: $\tfrac{4}{11}$.
26. Blue is $1 - \tfrac14 - \tfrac13 = \tfrac{5}{12}$, and $10 \div \tfrac{5}{12} = 24$ balls: 6 red, 8 white, 10 blue.
27. 9 pairs; odd products at $(1, 1), (1, 3), (3, 1), (3, 3)$; $P(\text{even}) = 1 - \tfrac49 = \tfrac59$.
28. $\tfrac{90}{250} = 0.36$; $0.36 \times 8000 = 2880$ with a pet, $8000 - 2880 = 5120$ without.
29. (a) $\tfrac{6}{40} = \tfrac{3}{20}$ (b) $\tfrac{4}{40} = \tfrac{1}{10}$ (c) $\tfrac{10}{40} = \tfrac14$
30. (a) 36 entries (b) $\tfrac{5}{36}$ (c) $\tfrac{15}{36} = \tfrac{5}{12}$ (d) $\tfrac{9}{36} = \tfrac14$
31. (a) $0.15$, $0.18$, $0.16$, $0.17$, $0.19$, $0.15$ (b) face 5, about $0.02$ from $\tfrac16 \approx 0.167$ (c) no; the gaps are ordinary for 300 rolls (d) $\tfrac16 \times 1200 = 200$
32. (a) $\tfrac{30}{120} = \tfrac14$ (b) $\tfrac{78}{120} = \tfrac{13}{20}$ (c) $\tfrac{36}{120} \times 900 = 270$ (d) a sample that is not random may favour one snack
33. (a) $\tfrac{4}{20} = \tfrac15$ (b) $1 - \tfrac15 = \tfrac45$ (c) $\tfrac15 \times 200 = 40$ (d) 12 green, since $\tfrac{16}{32} = \tfrac12$
