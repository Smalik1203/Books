# Class 10 · Mathematics I · Chapter 8 — Introduction to Trigonometry

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set — *Exercise Set 8.1, Q2* — so it can be used beside the book
without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file.** A question renumbered in the book and
not here is how this goes wrong.

A proof is set out one statement to a line, with its reason, as Class 10
papers expect.

---

## 8.2 Trigonometric Ratios

### The questions in the running text

*Define the trigonometric ratios for the angle C (Fig. 8.5).*
In the right triangle ABC, right-angled at B, AB is opposite to C and BC is
adjacent to it:
$\sin C = \frac{AB}{AC}$, $\cos C = \frac{BC}{AC}$, $\tan C = \frac{AB}{BC}$,
$\operatorname{cosec} C = \frac{AC}{AB}$, $\sec C = \frac{AC}{BC}$,
$\cot C = \frac{BC}{AB}$.

*How do the ratios of $\angle A$ in $\triangle PAM$, $\triangle CAB$ and
$\triangle QAN$ compare (Fig. 8.6)?* They are the same. The text shows it for
$\triangle PAM$. For $\triangle QAN$:
- $\triangle QAN \sim \triangle CAB$ *(AA: the angle A is common, and the angles at N and B are right angles)*
- $\frac{QN}{BC} = \frac{AQ}{AC} = \frac{AN}{AB}$ *(corresponding sides are proportional)*
- so $\frac{QN}{AQ} = \frac{BC}{AC}$, which is $\sin A$, and the other ratios in the same way.

*Why is AB not $-2\sqrt{2}k$?* AB is a length, and a length is positive.

*Find the other ratios when $\sin A = \frac{1}{3}$.* With $BC = k$,
$AC = 3k$ and $AB = 2\sqrt{2}k$: $\cos A = \frac{2\sqrt{2}}{3}$,
$\tan A = \frac{1}{2\sqrt{2}}$, $\operatorname{cosec} A = 3$,
$\sec A = \frac{3}{2\sqrt{2}}$, $\cot A = 2\sqrt{2}$.

### The *Why?* rows in the examples

- **Example 5, Step 2:** $OQ = 1 + PQ$, from $OQ - PQ = 1$.
- **Example 5, Step 4:** take $PQ^2$ from both sides and put $OP = 7$. Then
  $2PQ = 48$, so $PQ = 24$.

### Exercise Set 8.1

1. $AC = \sqrt{24^2 + 7^2} = 25$ cm.
   - (i) $\sin A = \frac{7}{25}$, $\cos A = \frac{24}{25}$
   - (ii) $\sin C = \frac{24}{25}$, $\cos C = \frac{7}{25}$

2. In Fig. 8.13, $QR = \sqrt{13^2 - 12^2} = 5$ cm.
   $\tan P = \frac{QR}{PQ} = \frac{5}{12}$ and $\cot R = \frac{QR}{PQ} = \frac{5}{12}$,
   so $\tan P - \cot R = 0$.

3. Take $BC = 3k$ and $AC = 4k$. Then $AB = \sqrt{16k^2 - 9k^2} = \sqrt{7}k$,
   so $\cos A = \frac{\sqrt{7}}{4}$ and $\tan A = \frac{3}{\sqrt{7}}$.

4. $\cot A = \frac{8}{15}$. Take $AB = 8k$ and $BC = 15k$. Then
   $AC = \sqrt{64k^2 + 225k^2} = 17k$, so $\sin A = \frac{15}{17}$ and
   $\sec A = \frac{17}{8}$.

5. Take the adjacent side $12k$ and the hypotenuse $13k$. The opposite side is
   $\sqrt{169k^2 - 144k^2} = 5k$. So $\sin\theta = \frac{5}{13}$,
   $\cos\theta = \frac{12}{13}$, $\tan\theta = \frac{5}{12}$,
   $\operatorname{cosec}\theta = \frac{13}{5}$, $\cot\theta = \frac{12}{5}$.

6. **$\angle A = \angle B$.** As Example 2, with the cosine in place of the sine.
   - Take right triangles ACE, right-angled at E, and BDF, right-angled at F,
     with the angles A and B in them. *(one triangle for each angle)*
   - $\cos A = \frac{AE}{AC}$ and $\cos B = \frac{BF}{BD}$. *(the definition)*
   - $\frac{AE}{AC} = \frac{BF}{BD}$, so $\frac{AE}{BF} = \frac{AC}{BD} = k$, say. *(the cosines are equal)*
   - $CE = \sqrt{AC^2 - AE^2} = \sqrt{k^2BD^2 - k^2BF^2} = k \times DF$. *(the Pythagoras theorem, twice)*
   - So $\frac{AE}{BF} = \frac{AC}{BD} = \frac{CE}{DF}$.
   - $\triangle ACE \sim \triangle BDF$. *(SSS similarity, Theorem 6.4)*
   - So $\angle A = \angle B$. *(corresponding angles)*

7. With $\cot\theta = \frac{7}{8}$:
   - (i) $\frac{(1 + \sin\theta)(1 - \sin\theta)}{(1 + \cos\theta)(1 - \cos\theta)} = \frac{1 - \sin^2\theta}{1 - \cos^2\theta} = \frac{\cos^2\theta}{\sin^2\theta} = \cot^2\theta = \frac{49}{64}$
   - (ii) $\cot^2\theta = \frac{49}{64}$

8. **Yes.** $\cot A = \frac{4}{3}$, so $\tan A = \frac{3}{4}$. The sides are 3, 4
   and 5, so $\sin A = \frac{3}{5}$ and $\cos A = \frac{4}{5}$.
   - LHS: $\frac{1 - \frac{9}{16}}{1 + \frac{9}{16}} = \frac{7}{25}$
   - RHS: $\frac{16}{25} - \frac{9}{25} = \frac{7}{25}$

9. Take $BC = k$ and $AB = \sqrt{3}k$. Then $AC = 2k$, so
   $\sin A = \frac{1}{2}$, $\cos A = \frac{\sqrt{3}}{2}$, $\sin C = \frac{\sqrt{3}}{2}$
   and $\cos C = \frac{1}{2}$.
   - (i) $\sin A \cos C + \cos A \sin C = \frac{1}{4} + \frac{3}{4} = 1$
   - (ii) $\cos A \cos C - \sin A \sin C = \frac{\sqrt{3}}{4} - \frac{\sqrt{3}}{4} = 0$

10. $PR^2 - QR^2 = PQ^2 = 25$, and $PR + QR = 25$, so $PR - QR = 1$. Then
    $PR = 13$ cm and $QR = 12$ cm. So $\sin P = \frac{12}{13}$,
    $\cos P = \frac{5}{13}$ and $\tan P = \frac{12}{5}$.

11. - (i) **False.** In a right triangle whose sides next to the right angle
      are 12 and 5, the angle opposite 12 has $\tan A = \frac{12}{5}$, which
      is more than 1.
    - (ii) **True.** A right triangle with hypotenuse 12 and adjacent side 5
      exists (its third side is $\sqrt{119}$), and it has $\sec A = \frac{12}{5}$.
    - (iii) **False.** $\cos A$ is short for the cosine of A; the cosecant is
      written $\operatorname{cosec} A$.
    - (iv) **False.** $\cot A$ is one symbol; "cot" alone has no meaning.
    - (v) **False.** The hypotenuse is the longest side, so $\sin\theta$ is
      never more than 1, and $\frac{4}{3}$ is.

## 8.3 Trigonometric Ratios of Some Specific Angles

### The questions in the running text

- *BC = AB (Why?)* In $\triangle ABC$ the angles at A and C are equal, and the
  sides opposite equal angles are equal.
- *$\triangle ABD \cong \triangle ACD$ (Why?)* RHS: the hypotenuses AB and AC
  are equal (sides of an equilateral triangle), AD is common, and both
  triangles have a right angle at D.
- *$\cot 0^\circ$ is not defined (Why?)* $\tan 0^\circ = 0$, and division by
  0 is not defined. *$\operatorname{cosec} 0^\circ$ (Why?)* In the same way,
  $\sin 0^\circ = 0$.
- *Find the other ratios of $90^\circ$.* $\tan 90^\circ$ and $\sec 90^\circ$
  are not defined, since $\cos 90^\circ = 0$; $\operatorname{cosec} 90^\circ = 1$
  and $\cot 90^\circ = 0$.
- **Example 6, Step 3 (Why this ratio?)** $\sin 30^\circ$ uses AB, which is
  given, and AC, which is wanted.
- **Example 7, Step 3 (Why?)** The angles of the triangle add up to
  $180^\circ$, so $\angle QPR = 180^\circ - 90^\circ - 30^\circ = 60^\circ$.
- **Example 8, Steps 1 and 2 (Why?)** $\sin 30^\circ = \frac{1}{2}$ and
  $\cos 60^\circ = \frac{1}{2}$, and $A - B$ and $A + B$ lie between
  $0^\circ$ and $90^\circ$, where each value belongs to one angle only.

### Exercise Set 8.2

1. - (i) $\sin 60^\circ \cos 30^\circ + \sin 30^\circ \cos 60^\circ = \frac{3}{4} + \frac{1}{4} = 1$
   - (ii) $2\tan^2 45^\circ + \cos^2 30^\circ - \sin^2 60^\circ = 2 + \frac{3}{4} - \frac{3}{4} = 2$
   - (iii) $\frac{\cos 45^\circ}{\sec 30^\circ + \operatorname{cosec} 30^\circ} = \frac{\frac{1}{\sqrt{2}}}{\frac{2}{\sqrt{3}} + 2} = \frac{\sqrt{3}}{2\sqrt{2}(1 + \sqrt{3})} = \frac{3\sqrt{2} - \sqrt{6}}{8}$
   - (iv) $\frac{\sin 30^\circ + \tan 45^\circ - \operatorname{cosec} 60^\circ}{\sec 30^\circ + \cos 60^\circ + \cot 45^\circ} = \frac{3\sqrt{3} - 4}{3\sqrt{3} + 4} = \frac{43 - 24\sqrt{3}}{11}$
   - (v) $\frac{5\cos^2 60^\circ + 4\sec^2 30^\circ - \tan^2 45^\circ}{\sin^2 30^\circ + \cos^2 30^\circ} = \frac{5}{4} + \frac{16}{3} - 1 = \frac{67}{12}$

2. - (i) **(a)** $\frac{2\tan 30^\circ}{1 + \tan^2 30^\circ} = \frac{\sqrt{3}}{2}$, which is $\sin 60^\circ$.
   - (ii) **(d)** $\frac{1 - \tan^2 45^\circ}{1 + \tan^2 45^\circ} = 0$.
   - (iii) **(a)** At $0^\circ$ both sides are 0. At $30^\circ$ and $45^\circ$
     the right side is 1 and $\sqrt{2}$ but the left is $\frac{\sqrt{3}}{2}$
     and 1; at $60^\circ$ the right side is $\sqrt{3}$, more than any sine.
   - (iv) **(c)** $\frac{2\tan 30^\circ}{1 - \tan^2 30^\circ} = \sqrt{3}$, which is $\tan 60^\circ$.

3. $A + B = 60^\circ$ and $A - B = 30^\circ$, so $A = 45^\circ$ and $B = 15^\circ$.

4. - (i) **False.** With $A = B = 30^\circ$: $\sin 60^\circ = \frac{\sqrt{3}}{2}$,
     but $\sin 30^\circ + \sin 30^\circ = 1$.
   - (ii) **True**, for $\theta$ from $0^\circ$ to $90^\circ$: the sines of
     $0^\circ$, $30^\circ$, $45^\circ$, $60^\circ$, $90^\circ$ are 0,
     $\frac{1}{2}$, $\frac{1}{\sqrt{2}}$, $\frac{\sqrt{3}}{2}$, 1.
   - (iii) **False.** $\cos\theta$ falls from 1 to 0 over the same range.
   - (iv) **False.** $\sin 0^\circ = 0$ but $\cos 0^\circ = 1$; the two are
     equal only at $45^\circ$.
   - (v) **True.** $\cot 0^\circ = \frac{\cos 0^\circ}{\sin 0^\circ}$, and
     $\sin 0^\circ = 0$.

## 8.4 Trigonometric Identities

### The questions in the running text

- *Is (3) true for $A = 0^\circ$?* Yes: $1 + 0 = 1$, and $\sec^2 0^\circ = 1$.
- **Example 9, Step 3 (Why?)** A is acute, so $\cos A$ is positive and the
  negative root is left out.

### Exercise Set 8.3

1. - $\sin A = \frac{1}{\operatorname{cosec} A} = \frac{1}{\sqrt{1 + \cot^2 A}}$
   - $\tan A = \frac{1}{\cot A}$
   - $\sec A = \sqrt{1 + \tan^2 A} = \frac{\sqrt{1 + \cot^2 A}}{\cot A}$

2. - $\cos A = \frac{1}{\sec A}$
   - $\tan A = \sqrt{\sec^2 A - 1}$
   - $\sin A = \tan A \cos A = \frac{\sqrt{\sec^2 A - 1}}{\sec A}$
   - $\cot A = \frac{1}{\sqrt{\sec^2 A - 1}}$
   - $\operatorname{cosec} A = \frac{\sec A}{\sqrt{\sec^2 A - 1}}$

3. - (i) **(b)** $9\sec^2 A - 9\tan^2 A = 9(\sec^2 A - \tan^2 A) = 9$
   - (ii) **(c)** In sines and cosines the product is
     $\frac{(\sin\theta + \cos\theta)^2 - 1}{\sin\theta\cos\theta} = \frac{2\sin\theta\cos\theta}{\sin\theta\cos\theta} = 2$
   - (iii) **(d)** $(\sec A + \tan A)(1 - \sin A) = \frac{(1 + \sin A)(1 - \sin A)}{\cos A} = \frac{\cos^2 A}{\cos A} = \cos A$
   - (iv) **(d)** $\frac{1 + \tan^2 A}{1 + \cot^2 A} = \frac{\sec^2 A}{\operatorname{cosec}^2 A} = \tan^2 A$

4. Each proof, one statement to a line.
   - (i)
     - $\text{LHS} = \left(\frac{1 - \cos\theta}{\sin\theta}\right)^2 = \frac{(1 - \cos\theta)^2}{\sin^2\theta}$ *(in sines and cosines)*
     - $= \frac{(1 - \cos\theta)^2}{(1 - \cos\theta)(1 + \cos\theta)}$ *($\sin^2\theta = 1 - \cos^2\theta$)*
     - $= \frac{1 - \cos\theta}{1 + \cos\theta} = \text{RHS}$ *(cancelling)*
   - (ii)
     - $\text{LHS} = \frac{\cos^2 A + (1 + \sin A)^2}{(1 + \sin A)\cos A}$ *(a common denominator)*
     - $= \frac{2 + 2\sin A}{(1 + \sin A)\cos A}$ *($\sin^2 A + \cos^2 A = 1$)*
     - $= \frac{2}{\cos A} = 2\sec A = \text{RHS}$
   - (iii)
     - $\frac{\tan\theta}{1 - \cot\theta} = \frac{\sin^2\theta}{\cos\theta(\sin\theta - \cos\theta)}$ and $\frac{\cot\theta}{1 - \tan\theta} = \frac{-\cos^2\theta}{\sin\theta(\sin\theta - \cos\theta)}$ *(in sines and cosines)*
     - $\text{LHS} = \frac{\sin^3\theta - \cos^3\theta}{\sin\theta\cos\theta(\sin\theta - \cos\theta)}$ *(a common denominator)*
     - $= \frac{\sin^2\theta + \sin\theta\cos\theta + \cos^2\theta}{\sin\theta\cos\theta}$ *(difference of two cubes)*
     - $= \frac{1 + \sin\theta\cos\theta}{\sin\theta\cos\theta} = 1 + \sec\theta\operatorname{cosec}\theta = \text{RHS}$
   - (iv)
     - $\text{LHS} = \frac{1}{\sec A} + 1 = \cos A + 1$
     - $\text{RHS} = \frac{1 - \cos^2 A}{1 - \cos A} = 1 + \cos A$ *(difference of two squares)*
     - so LHS = RHS.
   - (v)
     - $\text{LHS} = \frac{\cot A - 1 + \operatorname{cosec} A}{\cot A + 1 - \operatorname{cosec} A}$ *(dividing through by $\sin A$)*
     - the numerator is $(\cot A + \operatorname{cosec} A) - (\operatorname{cosec}^2 A - \cot^2 A)$ *($\operatorname{cosec}^2 A - \cot^2 A = 1$)*
     - and $(\cot A + \operatorname{cosec} A) - (\operatorname{cosec}^2 A - \cot^2 A) = (\cot A + \operatorname{cosec} A)(1 - \operatorname{cosec} A + \cot A)$ *(taking out the common factor)*
     - so $\text{LHS} = \operatorname{cosec} A + \cot A = \text{RHS}$ *(cancelling $\cot A + 1 - \operatorname{cosec} A$)*
   - (vi)
     - $\frac{1 + \sin A}{1 - \sin A} = \frac{(1 + \sin A)^2}{1 - \sin^2 A} = \frac{(1 + \sin A)^2}{\cos^2 A}$ *(multiplying above and below by $1 + \sin A$)*
     - $\text{LHS} = \frac{1 + \sin A}{\cos A}$ *(both are positive for an acute angle)*
     - $= \sec A + \tan A = \text{RHS}$
   - (vii)
     - $1 - 2\sin^2\theta = 1 - 2(1 - \cos^2\theta) = 2\cos^2\theta - 1$
     - $\text{LHS} = \frac{\sin\theta(1 - 2\sin^2\theta)}{\cos\theta(2\cos^2\theta - 1)} = \frac{\sin\theta}{\cos\theta}$ *(cancelling)*
     - $= \tan\theta = \text{RHS}$
   - (viii)
     - $\text{LHS} = \sin^2 A + 2 + \operatorname{cosec}^2 A + \cos^2 A + 2 + \sec^2 A$ *(expanding; $\sin A \operatorname{cosec} A = 1$)*
     - $= 5 + \operatorname{cosec}^2 A + \sec^2 A$ *($\sin^2 A + \cos^2 A = 1$)*
     - $= 5 + (1 + \cot^2 A) + (1 + \tan^2 A) = 7 + \tan^2 A + \cot^2 A = \text{RHS}$
   - (ix)
     - $\text{LHS} = \frac{1 - \sin^2 A}{\sin A} \times \frac{1 - \cos^2 A}{\cos A} = \frac{\cos^2 A}{\sin A} \times \frac{\sin^2 A}{\cos A} = \sin A\cos A$
     - $\text{RHS} = \frac{1}{\frac{\sin A}{\cos A} + \frac{\cos A}{\sin A}} = \frac{\sin A\cos A}{\sin^2 A + \cos^2 A} = \sin A\cos A$
     - so LHS = RHS.
   - (x)
     - $\frac{1 + \tan^2 A}{1 + \cot^2 A} = \frac{\sec^2 A}{\operatorname{cosec}^2 A} = \frac{\sin^2 A}{\cos^2 A} = \tan^2 A$
     - $\frac{1 - \tan A}{1 - \cot A} = \frac{1 - \tan A}{\frac{\tan A - 1}{\tan A}} = -\tan A$, so its square is $\tan^2 A$
     - so all three are equal.

---

## Beyond the Book

### Stage 1 · Using What You Know

Each of the five questions is answered in the running text that follows it
on the page: (1) $\tan\theta = \frac{1}{\sqrt{3}}$; (2) shown, by multiplying
by $\sqrt{2} + 1$; (3) $\theta = 60^\circ$ or $0^\circ$; (4) no — the sum is at
least 2, and equals 2 only at $45^\circ$; (5) $\sec\theta - \tan\theta = \frac{1}{p}$
and $\sec\theta = \frac{p^2 + 1}{2p}$.

### Stage 3 · Practice

Multiple choice and assertion–reason, as the key prints it:
1 (b), 2 (a), 3 (c), 4 (d), 5 (c), 6 (b), 7 (d), 8 (c), 9 (a), 10 (d),
11 (a), 12 (b), 13 (a), 14 (b), 15 (d), 16 (a), 17 (d), 18 (b), 19 (c).

The working for each:

1. $\sin 30^\circ + \cos 60^\circ = \frac{1}{2} + \frac{1}{2} = 1$.
2. $\cos A = \sqrt{1 - \frac{1089}{4225}} = \frac{56}{65}$.
3. $\operatorname{cosec}^2\theta - \cot^2\theta = 1$, from $1 + \cot^2\theta = \operatorname{cosec}^2\theta$.
4. $\cos 90^\circ + \sin 0^\circ + \tan 0^\circ = 0 + 0 + 0 = 0$.
5. $\tan 60^\circ = \sqrt{3}$, so $A = 60^\circ$.
6. $\cos Z = \frac{YZ}{XZ}$: YZ is adjacent to Z and XZ is the hypotenuse.
7. $\sec 60^\circ \times \cos 60^\circ = 2 \times \frac{1}{2} = 1$.
8. $\frac{\sqrt{3}}{2}$, which is $\cos 30^\circ$; the others are more than 1 or negative.
9. The sides are 1, 2 and $\sqrt{5}$, so $\sin A \cos A = \frac{2}{5}$.
10. $AB = 5$ and $BC = 5\sqrt{3}$, so $AB + BC = 5(1 + \sqrt{3})$ cm.
11. $1 - 2\sin^2 30^\circ = \frac{1}{2}$, which is $\cos 60^\circ$, and $1 - 2\sin 30^\circ = 0$: only Kiran is right.
12. $\operatorname{cosec}\theta + \cot\theta = \frac{5}{2}$, so $\operatorname{cosec}\theta = \frac{29}{20}$, $\cot\theta = \frac{21}{20}$ and $\cos\theta = \frac{21}{29}$.
13. $3\sin^2\theta = 3$, so $\sin\theta = 1$ and $\theta = 90^\circ$.
14. $\frac{\sqrt{3} - \frac{1}{\sqrt{3}}}{2} = \frac{1}{\sqrt{3}}$.
15. $(\sin^2\theta + \cos^2\theta)^3 = 1$.
16. (a) $\frac{1}{\sqrt{2}} + \frac{1}{\sqrt{2}} = \sqrt{2}$, and R gives those values.
17. (d) $2\tan 30^\circ = \frac{2}{\sqrt{3}}$, not $\sqrt{3}$; R is true.
18. (b) A is the identity $\sec^2 A - \tan^2 A = 1$; R is true but does not explain it.
19. (c) $\cos 0^\circ = \sec 0^\circ = 1$; but $\cos 60^\circ = \frac{1}{2}$ and $\sec 60^\circ = 2$.
20. $\operatorname{cosec}^2 60^\circ - \cot^2 30^\circ = \frac{4}{3} - 3 = -\frac{5}{3}$.
21. $\cos\theta = \frac{\sqrt{3}}{2}$, so $\theta = 30^\circ$ and $\tan\theta = \frac{1}{\sqrt{3}}$.
22. $(1 + \cot^2\theta)(1 - \cos^2\theta) = \operatorname{cosec}^2\theta \times \sin^2\theta = 1$.
23. $\tan F = \frac{DE}{EF} = \frac{1}{\sqrt{3}}$, so $\angle F = 30^\circ$.
24. $\cos\theta = \frac{11}{61}$; the third side is $\sqrt{61^2 - 11^2} = 60$, so $\sin\theta = \frac{60}{61}$ and $\cot\theta = \frac{11}{60}$.
25. - $(\sin\theta + \cos\theta)^2 = \sin^2\theta + 2\sin\theta\cos\theta + \cos^2\theta$ *(expanding)*
    - $(\sin\theta - \cos\theta)^2 = \sin^2\theta - 2\sin\theta\cos\theta + \cos^2\theta$ *(expanding)*
    - adding, the middle terms cancel: $2(\sin^2\theta + \cos^2\theta) = 2$ *(the first identity)*
26. - $\sec^2\theta + \operatorname{cosec}^2\theta = 2 + \tan^2\theta + \cot^2\theta$ *(the second and third identities)*
    - $= \tan^2\theta + 2\tan\theta\cot\theta + \cot^2\theta = (\tan\theta + \cot\theta)^2$ *($\tan\theta\cot\theta = 1$)*
    - both sides of the identity are positive, so taking the square root proves it.
27. $\cos 30^\circ = \frac{\sqrt{3}}{2}$ and $\sin 90^\circ = 1$, so $A - B = 30^\circ$ and $A + B = 90^\circ$: **$A = 60^\circ$, $B = 30^\circ$**.
28. - $(1 + \cos\theta - \sin\theta)(1 + \sin\theta) = 1 + \cos\theta + \sin\theta\cos\theta - \sin^2\theta$ *(expanding)*
    - $= \cos^2\theta + \cos\theta + \sin\theta\cos\theta$ *($1 - \sin^2\theta = \cos^2\theta$)*
    - $= \cos\theta(1 + \cos\theta + \sin\theta)$ *(taking out $\cos\theta$)*
    - dividing both sides by $\cos\theta(1 + \cos\theta - \sin\theta)$, which is not zero, gives the identity.
29. - $m^2 - n^2 = (m + n)(m - n) = 2\tan\theta \times 2\sin\theta = 4\tan\theta\sin\theta$
    - $mn = \tan^2\theta - \sin^2\theta = \tan^2\theta(1 - \cos^2\theta) = \tan^2\theta\sin^2\theta$
    - so $4\sqrt{mn} = 4\tan\theta\sin\theta$ (both factors are positive), which is $m^2 - n^2$.
30. (a) $12\sqrt{2}$ cm (b) $20\sin 30^\circ = 10$ cm and $20\cos 30^\circ = 10\sqrt{3}$ cm (c) $\frac{10}{10\sqrt{3}} \times \frac{10\sqrt{3}}{10} = 1$ (d) $\frac{1}{2} \times 12 \times 12 = 72$ cm².
31. (a) $\sin A = \frac{0.5}{1}$, so $30^\circ$ (b) $\sqrt{1 - 0.25} = \frac{\sqrt{3}}{2}$ m (c) $\tan B = 1$, so $45^\circ$ (d) $0.5\sqrt{2} = \frac{1}{\sqrt{2}}$ m.
