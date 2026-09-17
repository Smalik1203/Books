# Class 9 · Mathematics I · Chapter 4 — Exploring Algebraic Identities

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set — *Exercise Set 4.2, Q1* — so it can be used beside the book
without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file.** A question renumbered in the book and
not here is how this goes wrong.

A proof is set out one statement to a line, with its reason, as Class 9
papers expect.

---

## 4.1 Introduction

### Think and Reflect

1. Other patterns of the same kind (answers will vary). One worked instance:
   take **four** consecutive squares, add the first and the last, and take
   away the middle two. With $n^2, (n + 1)^2, (n + 2)^2, (n + 3)^2$:
   - $n^2 + (n + 3)^2 = 2n^2 + 6n + 9$
   - $(n + 1)^2 + (n + 2)^2 = 2n^2 + 6n + 5$
   - the difference is always $4$. From $\{1, 4, 9, 16\}$: $1 + 16 - 4 - 9 = 4$.

## 4.2 Visualising Identities

### Think and Reflect

1. The two sides differ only by $2ab$, since $(a + b)^2 = a^2 + b^2 + 2ab$.
   - (i) $(a + b)^2 < a^2 + b^2$ exactly when $ab < 0$: one of $a$, $b$ is
     positive and the other negative.
   - (ii) $(a + b)^2 > a^2 + b^2$ exactly when $ab > 0$: $a$ and $b$ are both
     positive or both negative.
   - (iii) They are equal exactly when $ab = 0$, that is, when $a = 0$ or
     $b = 0$.

### Exercise Set 4.1

1. - (i) $(7x + 4y)^2 = 49x^2 + 56xy + 16y^2$
   - (ii) $\left(\tfrac{7}{5}x + \tfrac{3}{2}y\right)^2 = \tfrac{49}{25}x^2 + \tfrac{21}{5}xy + \tfrac{9}{4}y^2$
   - (iii) $(2.5p + 1.5q)^2 = 6.25p^2 + 7.5pq + 2.25q^2$
   - (iv) $\left(\tfrac{3}{4}s + 8t\right)^2 = \tfrac{9}{16}s^2 + 12st + 64t^2$
   - (v) $\left(\tfrac{x}{y} + \tfrac{1}{2}\right)^2 = \tfrac{x^2}{y^2} + \tfrac{x}{y} + \tfrac{1}{4}$
   - (vi) $\left(\tfrac{1}{x} + \tfrac{2}{y}\right)^2 = \tfrac{1}{x^2} + \tfrac{4}{xy} + \tfrac{4}{y^2}$

2. - (i) $64^2 = (60 + 4)^2 = 3600 + 480 + 16 = 4096$
   - (ii) $105^2 = (100 + 5)^2 = 10000 + 1000 + 25 = 11025$
   - (iii) $205^2 = (200 + 5)^2 = 40000 + 2000 + 25 = 42025$

## 4.3 Factorisation Using Identities

### Think and Reflect

1. Replacing $b$ by $-b$ gives $(a - b)^2 = a^2 - 2ab + b^2$, since
   $(-b)^2 = b^2$ and $2a(-b) = -2ab$.

### Exercise Set 4.2

1. - (i) $9x^2 + 24xy + 16y^2 = (3x + 4y)^2$
   - (ii) $4s^2 + 20st + 25t^2 = (2s + 5t)^2$
   - (iii) $49x^2 + 28xy + 4y^2 = (7x + 2y)^2$
   - (iv) $64p^2 + \tfrac{32}{3}pq + \tfrac{4}{9}q^2 = \left(8p + \tfrac{2}{3}q\right)^2$
   - (v) $3a^2 + 4ab + \tfrac{4}{3}b^2 = \tfrac{1}{3}\left(9a^2 + 12ab + 4b^2\right) = \tfrac{1}{3}(3a + 2b)^2$
   - (vi) $\tfrac{9}{5}s^2 + 6sv + 5v^2 = \tfrac{1}{5}\left(9s^2 + 30sv + 25v^2\right) = \tfrac{1}{5}(3s + 5v)^2$

   In (v) and (vi) the common factor taken out is a fraction. Written as
   $3\left(a + \tfrac{2}{3}b\right)^2$ and $5\left(\tfrac{3}{5}s + v\right)^2$
   the answers are the same.

2. - (i) $79^2 = (80 - 1)^2 = 6400 - 160 + 1 = 6241$
   - (ii) $193^2 = (200 - 7)^2 = 40000 - 2800 + 49 = 37249$
   - (iii) $299^2 = (300 - 1)^2 = 90000 - 600 + 1 = 89401$

## 4.4 More Identities

### Think and Reflect

1. The nine pieces of Fig. 4.4 have areas $a^2$, $b^2$, $c^2$ down the
   diagonal, and $ab$, $bc$, $ca$ twice each either side of it. They add to
   $a^2 + b^2 + c^2 + 2ab + 2bc + 2ca$: every term of the identity, with
   each rectangle turning up twice.

### Exercise Set 4.3

1. - (i) $117^2 = (100 + 17)^2 = 10000 + 3400 + 289 = 13689$
   - (ii) $78^2 = (80 - 2)^2 = 6400 - 320 + 4 = 6084$
   - (iii) $198^2 = (200 - 2)^2 = 40000 - 800 + 4 = 39204$
   - (iv) $214^2 = (200 + 14)^2 = 40000 + 5600 + 196 = 45796$
   - (v) $1104^2 = (1100 + 4)^2 = 1210000 + 8800 + 16 = 1218816$
   - (vi) $1120^2 = (1000 + 100 + 20)^2 = 1000000 + 10000 + 400 + 200000 + 40000 + 4000 = 1254400$

2. - (i) $16y^2 - 24y + 9 = (4y - 3)^2$
   - (ii) $\tfrac{9}{4}s^2 + 6st + 4t^2 = \left(\tfrac{3}{2}s + 2t\right)^2$
   - (iii) $\tfrac{m^2}{9} + \tfrac{mk}{3} + \tfrac{k^2}{4} + 3nk + 2mn + 9n^2 = \left(\tfrac{m}{3} + \tfrac{k}{2} + 3n\right)^2$
   - (iv) $\tfrac{p^2}{16} - 2 + \tfrac{16}{p^2} = \left(\tfrac{p}{4} - \tfrac{4}{p}\right)^2$
   - (v) $9a^2 + 4b^2 + c^2 - 12ab - 4bc + 6ac = (3a - 2b + c)^2$
   - (vi) $\tfrac{4a^2}{9} - \tfrac{12ab}{5} + \tfrac{81b^2}{25} = \left(\tfrac{2a}{3} - \tfrac{9b}{5}\right)^2$

3. - (i) $(p + 3q + 7r)^2 = p^2 + 9q^2 + 49r^2 + 6pq + 42qr + 14pr$
   - (ii) $(3x - 2y + 4z)^2 = 9x^2 + 4y^2 + 16z^2 - 12xy - 16yz + 24xz$
   - (iii) $(2m - 5n - 3p)^2 = 4m^2 + 25n^2 + 9p^2 - 20mn + 30np - 12mp$
   - (iv) $(a - 2b - 5c)^2 = a^2 + 4b^2 + 25c^2 - 4ab + 20bc - 10ac$

4. **No.** Each of the three squares on the left gives one $a^2$, so the
   left side has $3a^2$ and the right side only $2a^2$. At $a = 1$,
   $b = 0$, $c = 0$ the left side is $3$ and the right side is $2$. In full,
   the left side is $3a^2 + 3b^2 + 3c^2 - 2ab - 2bc - 2ca$.

### Think and Reflect (the rearranged rectangle)

1. The rectangle is $(a + b)$ wide and $(a - b)$ tall. Its area is
   $(a + b)(a - b) = a^2 - b^2$, and adding the $b^2$ set aside gives $a^2$,
   the area of the original square.

### Think and Reflect (squares ending in 5)

1. - (i) $35^2 = 30 \times 40 + 25 = 1225$
   - (ii) $65^2 = 60 \times 70 + 25 = 4225$
   - (iii) $85^2 = 80 \times 90 + 25 = 7225$
   - (iv) $105^2 = 100 \times 110 + 25 = 11025$

   Every one ends in $25$. For any number ending in $5$, take $b = 5$: the
   two factors are multiples of ten, their product ends in $00$, and $25$ is
   added.

### Think and Reflect (Fig. 4.6)

1. Compared by area, the two rows state
   $(a + b + c)^2 + (a + b - c)^2 + (a - b + c)^2 + (a - b - c)^2 = (2a)^2 + (2b)^2 + (2c)^2$.
   Expanding the left side, every cross term appears twice with each sign
   and cancels, leaving $4a^2 + 4b^2 + 4c^2$. The figure is drawn with
   $a = 6$, $b = 3$, $c = 2$: $121 + 49 + 25 + 1 = 196 = 144 + 36 + 16$.

## 4.5 Factorising With Tiles

### Think and Reflect

1. The unit tiles must fill a block whose sides are the two parts of the
   split, so the two parts must multiply to $12$. $1 \times 6 = 6$ and
   $2 \times 5 = 10$ do not; only $3 \times 4 = 12$ closes up. So only the
   split $3x + 4x$ makes a rectangle, and $x^2 + 7x + 12 = (x + 3)(x + 4)$
   is the only way to factorise it with whole numbers.

2. - (i) $(x + 2)(x + 3) = x^2 + 5x + 6$: one $x^2$-tile, five $x$-tiles and
     six unit tiles in a $2$ by $3$ block.
   - (ii) $x^2 + 11x + 30 = (x + 5)(x + 6)$: the $11x$ split as $5x + 6x$
     puts the thirty unit tiles in a $5$ by $6$ block.

3. The constant is the product of the two numbers and the coefficient of $x$
   is their sum: $(x + a)(x + b) = x^2 + (a + b)x + ab$.

4. Fig. 4.8 has six $x^2$-tiles, $2 + 9 = 11$ $x$-tiles and three unit
   tiles, so $(2x + 3)(3x + 1) = 6x^2 + 11x + 3$. In general
   $(px + a)(qx + b) = (pq)x^2 + (pb + qa)x + ab$.

## 4.6 Factorising Without Tiles

### Exercise Set 4.4

1. - (i) $s^2 - 11s + 24 = (s - 3)(s - 8)$, since $-3 + (-8) = -11$ and $(-3)(-8) = 24$
   - (ii) $(3x - 7)(x + 1) = 3x^2 - 4x - 7$
   - (iii) $10x^2 - 11x - 6 = (2x - 3)(5x + 2)$
   - (iv) $6x^2 + 7x + 2 = (2x + 1)(3x + 2)$

2. - (i) $41^2 = (40 + 1)^2 = 1600 + 80 + 1 = 1681$
   - (ii) $27^2 = (30 - 3)^2 = 900 - 180 + 9 = 729$
   - (iii) $23 \times 17 = (20 + 3)(20 - 3) = 400 - 9 = 391$
   - (iv) $135^2 = (130 + 5)^2 = 16900 + 1300 + 25 = 18225$
   - (v) $97^2 = (100 - 3)^2 = 10000 - 600 + 9 = 9409$
   - (vi) $18 \times 29 = (20 - 2)(20 + 9) = 400 + 7 \times 20 - 18 = 522$
   - (vii) $34 \times 43 = (40 - 6)(40 + 3) = 1600 - 3 \times 40 - 18 = 1462$
   - (viii) $205^2 = (200 + 5)^2 = 40000 + 2000 + 25 = 42025$

   The difference of squares does not suit (vi) and (vii): the two numbers
   do not sit an equal whole distance either side of a round number. The
   product $(x + a)(x + b) = x^2 + (a + b)x + ab$ does, as shown.

3. - (i) $9a^2 + b^2 + 4c^2 - 6ab + 12ac - 4bc = (3a - b + 2c)^2$
   - (ii) $16s^2 + 25t^2 - 40st = (4s - 5t)^2$
   - (iii) $r^2 - r - 42 = (r - 7)(r + 6)$
   - (iv) $49g^2 + 14gh + h^2 = (7g + h)^2$
   - (v) $64u^2 + 121v^2 + 4w^2 - 176uv - 32uw + 44vw = (8u - 11v - 2w)^2$

## 4.7 Finding New Identities

### Running text

1. The second product: $(x + y)\left(x^2 - xy + y^2\right) = x^3 + y^3$.
   Only the signs of the middle terms differ, and they still cancel in pairs.

### Think and Reflect

1. **Yes.** $x^4 - y^4 = \left(x^2 - y^2\right)\left(x^2 + y^2\right) = (x - y)(x + y)\left(x^2 + y^2\right)$.
   Also $x^5 - y^5 = (x - y)\left(x^4 + x^3y + x^2y^2 + xy^3 + y^4\right)$.
   So $x - y$ divides $x^n - y^n$ for every counting number $n$. Putting
   $x = y$ makes $x^n - y^n$ zero, which is what a factor $x - y$ requires.

## 4.8 Simplifying Rational Expressions

### Think and Reflect

1. $36s^2 - 12st + t^2 = (t - 6s)^2$, and $t^2 + 2ts - 48s^2 = (t + 8s)(t - 6s)$,
   since $8s + (-6s) = 2s$ and $8s \times (-6s) = -48s^2$. So the expression
   is $\dfrac{t - 6s}{t + 8s}$. The order of the letters matters: the
   numerator is $(6s - t)^2$, which is the same as $(t - 6s)^2$.

### Exercise Set 4.5

1. - (i) $\dfrac{3p^2 - 3pq - 18q^2}{3p^2 + 10pq + 8q^2} = \dfrac{3(p - 3q)(p + 2q)}{(3p + 4q)(p + 2q)} = \dfrac{3(p - 3q)}{3p + 4q}$
   - (ii) $\dfrac{n^3 - 3n^2m + 3nm^2 - m^3}{5m^2 - 10mn + 5n^2} = \dfrac{(n - m)^3}{5(n - m)^2} = \dfrac{n - m}{5}$
   - (iii) With $y = -v$ the numerator is $w^3 + y^3 + x^3 - 3wyx$ and the
     denominator is $w^2 + y^2 + x^2 - wy - yx - wx$, so
     $\dfrac{w^3 - v^3 + x^3 + 3wvx}{w^2 + v^2 + x^2 + wv + vx - wx} = w - v + x$.
   - (iv) $\dfrac{4y^2 - 20yz + 25z^2}{25z^2 - 4y^2} = \dfrac{(5z - 2y)^2}{(5z - 2y)(5z + 2y)} = \dfrac{5z - 2y}{5z + 2y}$
   - (v) $\dfrac{\left(x^2 + 6x - 7\right)\left(x^2 - 7x + 12\right)}{\left(x^2 - 6x + 8\right)\left(x^2 - 9\right)} = \dfrac{(x + 7)(x - 1)(x - 3)(x - 4)}{(x - 2)(x - 4)(x - 3)(x + 3)} = \dfrac{(x + 7)(x - 1)}{(x - 2)(x + 3)}$
   - (vi) $\dfrac{p^4 - 16}{p^2 - 4p + 4} = \dfrac{\left(p^2 + 4\right)(p + 2)(p - 2)}{(p - 2)^2} = \dfrac{\left(p^2 + 4\right)(p + 2)}{p - 2}$

2. At $x = 2$ the original is $\dfrac{4 + 10}{4 + 5} = \dfrac{14}{9}$, and
   her answer is $2$. She cancelled the **term** $x^2$, which is added to
   something top and bottom. Only a factor may be cancelled.

3. - (i) $\dfrac{x^2 - 9}{x^2 - x - 6} = \dfrac{(x - 3)(x + 3)}{(x - 3)(x + 2)} = \dfrac{x + 3}{x + 2}$; $x = 3$ and $x = -2$ are ruled out.
   - (ii) $\dfrac{2a^2 - 8}{a^2 + 4a + 4} = \dfrac{2(a - 2)(a + 2)}{(a + 2)^2} = \dfrac{2(a - 2)}{a + 2}$; $a = -2$ is ruled out.
   - (iii) $\dfrac{t^3 - 1}{t^2 - 1} = \dfrac{(t - 1)\left(t^2 + t + 1\right)}{(t - 1)(t + 1)} = \dfrac{t^2 + t + 1}{t + 1}$; $t = 1$ and $t = -1$ are ruled out.

## 4.9 Putting Factorisation to Work

### Think and Reflect

1. Trial finds one answer but does not show that it is the only one, and it
   works only when the answer is a whole number. With an area of $96.25$
   square metres, $12 \times 8 = 96$ and $13 \times 9 = 117$, so no whole
   number works: the length is a little over $12$ m, and trial of whole
   numbers never reaches it.

## End-of-Chapter Exercises

1. - (i) $(-3x + 4)^2 = 9x^2 - 24x + 16$
   - (ii) $(2s + 7)(2s - 7) = 4s^2 - 49$
   - (iii) $\left(p^2 + \tfrac{1}{2}\right)\left(p^2 - \tfrac{1}{2}\right) = p^4 - \tfrac{1}{4}$
   - (iv) $(2n + 7)(2n + 3) = 4n^2 + 20n + 21$
   - (v) $(s - 2t)\left(s^2 + 2st + 4t^2\right) = s^3 - 8t^3$
   - (vi) $\left(\tfrac{1}{2}r - \tfrac{4}{r}\right)^2 = \tfrac{1}{4}r^2 - 4 + \tfrac{16}{r^2}$
   - (vii) $(-3m + 4k - l)^2 = 9m^2 + 16k^2 + l^2 - 24mk + 6ml - 8kl$
   - (viii) $\left(xy - \tfrac{1}{3}\right)^3 = x^3y^3 - x^2y^2 + \tfrac{1}{3}xy - \tfrac{1}{27}$
   - (ix) $\left(\tfrac{7}{2}k - \tfrac{2}{3}m\right)^3 = \tfrac{343}{8}k^3 - \tfrac{49}{2}k^2m + \tfrac{14}{3}km^2 - \tfrac{8}{27}m^3$

2. - (i) $17 \times 21 = (19 - 2)(19 + 2) = 361 - 4 = 357$
   - (ii) $104 \times 96 = (100 + 4)(100 - 4) = 10000 - 16 = 9984$
   - (iii) $24 \times 16 = (20 + 4)(20 - 4) = 400 - 16 = 384$
   - (iv) $147^3 = (150 - 3)^3 = 3375000 - 202500 + 4050 - 27 = 3176523$
   - (v) $199^3 = (200 - 1)^3 = 8000000 - 120000 + 600 - 1 = 7880599$
   - (vi) $127^3 = (130 - 3)^3 = 2197000 - 152100 + 3510 - 27 = 2048383$
   - (vii) $(-107)^3 = -(100 + 7)^3 = -(1000000 + 210000 + 14700 + 343) = -1225043$
   - (viii) $(-299)^3 = -(300 - 1)^3 = -(27000000 - 270000 + 900 - 1) = -26730899$

3. - (i) $4y^2 + y + \tfrac{1}{16} = \left(2y + \tfrac{1}{4}\right)^2$
   - (ii) $9m^2 - \tfrac{n^2}{25} = \left(3m - \tfrac{n}{5}\right)\left(3m + \tfrac{n}{5}\right)$
   - (iii) $27b^3 - \tfrac{1}{64b^3} = \left(3b - \tfrac{1}{4b}\right)\left(9b^2 + \tfrac{3}{4} + \tfrac{1}{16b^2}\right)$
   - (iv) $x^2 + \tfrac{5x}{6} + \tfrac{1}{6} = \left(x + \tfrac{1}{2}\right)\left(x + \tfrac{1}{3}\right)$
   - (v) $27u^3 - \tfrac{27u^2}{5} + \tfrac{9u}{25} - \tfrac{1}{125} = \left(3u - \tfrac{1}{5}\right)^3$
   - (vi) $64y^3 + \tfrac{z^3}{125} = \left(4y + \tfrac{z}{5}\right)\left(16y^2 - \tfrac{4yz}{5} + \tfrac{z^2}{25}\right)$
   - (vii) $p^3 + q^3 + 27r^3 - 9pqr = (p + q + 3r)\left(p^2 + q^2 + 9r^2 - pq - 3qr - 3rp\right)$
   - (viii) $9m^2 - 12m + 4 = (3m - 2)^2$
   - (ix) $8x^3 - 27y^3 + z^3 + 18xyz = (2x - 3y + z)\left(4x^2 + 9y^2 + z^2 + 6xy + 3yz - 2zx\right)$
   - (x) $4x^2 + 9y^2 + 36z^2 + 12xy + 36yz + 24zx = (2x + 3y + 6z)^2$
   - (xi) $27u^3 - \tfrac{9u^2}{2} + \tfrac{u}{4} - \tfrac{1}{216} = \left(3u - \tfrac{1}{6}\right)^3$

4. - (i) $\dfrac{4x^2 + 4x + 1}{4x^2 - 1} = \dfrac{(2x + 1)^2}{(2x + 1)(2x - 1)} = \dfrac{2x + 1}{2x - 1}$
   - (ii) $\dfrac{(3a - 2b)^3}{9a^2 - 4b^2} = \dfrac{(3a - 2b)^3}{(3a - 2b)(3a + 2b)} = \dfrac{(3a - 2b)^2}{3a + 2b}$
   - (iii) $\dfrac{s^3 + 125t^3}{s^2 - 2st - 35t^2} = \dfrac{(s + 5t)\left(s^2 - 5st + 25t^2\right)}{(s - 7t)(s + 5t)} = \dfrac{s^2 - 5st + 25t^2}{s - 7t}$

5. - (i) $25a^2 - 30ab + 9b^2 = (5a - 3b)^2$: length and breadth both
     $5a - 3b$, a square.
   - (ii) $36s^2 - 49t^2 = (6s - 7t)(6s + 7t)$: length $6s + 7t$, breadth
     $6s - 7t$.

6. Answers will vary with how the constant is shared out. One set each:
   - (i) $6a^2 - 24b^2 = 6(a - 2b)(a + 2b)$: $6$, $a - 2b$ and $a + 2b$
   - (ii) $3ps^2 - 15ps + 12p = 3p(s - 1)(s - 4)$: $3p$, $s - 1$ and $s - 4$

   **Flagged:** (i) is of degree 2, so as a volume it needs one dimension to
   be a plain number, as here.

7. The outer square has side $40 + 2s$, so the path has area
   $(40 + 2s)^2 - 40^2 = 160s + 4s^2 = 4s(s + 40)$ square metres.

8. $x + \tfrac{1}{x} = \tfrac{10}{3}$ gives $3x^2 - 10x + 3 = 0$, that is
   $(3x - 1)(x - 3) = 0$. The number is $3$ or $\tfrac{1}{3}$, and each is
   the reciprocal of the other.

9. $2x^2 + 7x + 3 = (2x + 1)(x + 3)$, so the length is $x + 3$ hastas.

10. Since both are factors, $px^2 + 5x + r = p(x - 2)\left(x - \tfrac{1}{2}\right)$.
    - $p(x - 2)\left(x - \tfrac{1}{2}\right) = px^2 - \tfrac{5}{2}px + p$ (multiplying out)
    - the constant terms agree, so $r = p$
    - (the $x$ terms give $-\tfrac{5}{2}p = 5$, so in fact $p = r = -2$)

11. - $a^2 + b^2 + c^2 = (a + b + c)^2 - 2(ab + bc + ca) = 25 - 20 = 5$
    - $a^3 + b^3 + c^3 - 3abc = (a + b + c)\left(a^2 + b^2 + c^2 - ab - bc - ca\right)$ (identity)
    - $a^3 + b^3 + c^3 - 3abc = 5(5 - 10) = -25$

    **Flagged:** no real $a$, $b$, $c$ satisfy both conditions, since
    $(a - b)^2 + (b - c)^2 + (c - a)^2 = 2(5 - 10) = -10$ would be negative.
    The algebra is right; the question describes no real numbers. It is a
    body question and is left as printed.

12. - $n^3 - n = n\left(n^2 - 1\right) = (n - 1)n(n + 1)$ (difference of squares)
    - these are three consecutive whole numbers
    - of any two consecutive numbers one is even, so the product has a factor $2$
    - of any three consecutive numbers one is a multiple of $3$, so the product has a factor $3$
    - $2$ and $3$ have no common factor, so $6$ divides $n^3 - n$

13. - (i) $x + y = -4$ means $x + y + 4 = 0$. So $x^3 + y^3 + 4^3 = 3 \times x \times y \times 4 = 12xy$,
      and $x^3 + y^3 - 12xy + 64 = 0$.
    - (ii) $x = 2y + 6$ means $x + (-2y) + (-6) = 0$. So
      $x^3 + (-2y)^3 + (-6)^3 = 3 \times x \times (-2y) \times (-6) = 36xy$, and
      $x^3 - 8y^3 - 36xy - 216 = 0$.

---

## Beyond the Book

### Stage 1 · Using What You Know

Each question is explained in the running text beneath it. The values it
reaches: Q1, given $a + b + c = 0$,
$\left(a^2 - bc\right) - \left(b^2 - ca\right) = 0$, checked with
$1, 2, -3$ (both sides $7$); Q2 $a^2 + b^2 = 13$ and $a^3 + b^3 = 35$, and
$a^2 + b^2 = 15$ when $ab = 5$; Q3
$x^4 + 4y^4 = \left(x^2 + 2y^2 - 2xy\right)\left(x^2 + 2y^2 + 2xy\right)$;
Q4 the first is not an identity ($8$ against $2$), the second is; Q5 no such
rectangle, since $(x - y)^2 = -1$.

### Stage 3 · Practice — the key, as the key prints it

1 (b) &nbsp; 2 (c) &nbsp; 3 (a) &nbsp; 4 (d) &nbsp; 5 (c) &nbsp; 6 (b) &nbsp; 7 (a) &nbsp; 8 (b) &nbsp; 9 (d) &nbsp; 10 (c) &nbsp; 11 (a) &nbsp; 12 (d) &nbsp; 13 (a) &nbsp; 14 (b) &nbsp; 15 (c) &nbsp; 16 (d) &nbsp; 17 (a) &nbsp; 18 (a) &nbsp; 19 (d) &nbsp; 20 (b) &nbsp; 21 (c)

### The working for each

1. $103 \times 97 = 10000 - 9 = 9991$.
2. $x^2 + \tfrac{1}{x^2} = 25 - 2 = 23$.
3. $27a^3 + 8b^3 = (3a + 2b)\left(9a^2 - 6ab + 4b^2\right)$, the sum of cubes.
4. $x^2 \pm 12x + 36 = (x \pm 6)^2$, so $k = 12$ and $k = -12$.
5. $x^3 - \tfrac{1}{x^3} = 27 + 9 = 36$.
6. $\dfrac{(587 + 413)(587 - 413)}{587 - 413} = 587 + 413 = 1000$.
7. $370 = 1000 - 30pq$, so $pq = 21$ (the numbers are $3$ and $7$).
8. (i) and (iii); (ii) is an equation, true only at $x = -2$ and $x = -5$.
9. (i) and (ii): $49 - 24 = 25$, $49 - 48 = 1$, but $343 - 252 = 91$.
10. For every $x$ except $2$, where the left side is not defined.
11. $(x - 3)(x - 4)$ gives $12$, $6$, $2$, $0$ at $x = 0, 1, 2, 3$.
12. Exactly when $a = 0$, $b = 0$ or $a = -b$, since the difference is $3ab(a + b)$.
13. $x^3 + \tfrac{1}{x^3} = 64 - 12 = 52$.
14. $x + (-y) + (-z) = 0$, so $x^3 - y^3 - z^3 = 3xyz$.
15. $(-c)(-a)(-b) = -abc$.
16. $45 = 45 \times 1 = 15 \times 3 = 9 \times 5$: $(23, 22)$, $(9, 6)$, $(7, 2)$, so $3$.
17. $a^2 - b^2 = 84 \times 12 = 1008$.
18. (a): R is the reason A holds, since $b - a = -(a - b)$.
19. (d): A fails at $1, 2, 3$ ($36$ against $18$); R is the identity.
20. (b): both true; A comes from the difference of squares, not from R.
21. (c): A is true; R is false, since $x^3 - 1 = (x - 1)\left(x^2 + x + 1\right)$.
22. $2000 \times 4 = 8000$.
23. $k = 49$.
24. $100 - 2 + 0.01 = 98.01$.
25. $2x^2 - x - 15 = (x - 3)(2x + 5)$.
26. $a + b = 7$, $a - b = 3$, so $a = 5$ and $b = 2$.
27. $\dfrac{x - 3}{x - 4}$, with $x = 4$ and $x = -4$ ruled out.
28. $125x^3 - 75x^2 + 15x - 1 = (5x - 1)^3$.
29. One statement to a line:
    - $(a + b + c)^3 - a^3 = (b + c)\left[(a + b + c)^2 + a(a + b + c) + a^2\right]$ (difference of cubes)
    - $b^3 + c^3 = (b + c)\left(b^2 - bc + c^2\right)$ (sum of cubes)
    - $(a + b + c)^2 + a(a + b + c) + a^2 - \left(b^2 - bc + c^2\right) = 3a^2 + 3ab + 3ac + 3bc$ (expanding)
    - $3a^2 + 3ab + 3ac + 3bc = 3(a + b)(a + c)$ (grouping)
    - so $(a + b + c)^3 - a^3 - b^3 - c^3 = 3(a + b)(b + c)(c + a)$
30. $x^2 + 2x - 168 = 0$, $(x + 14)(x - 12) = 0$, $x = 12$: the numbers are $12$ and $14$.
31. (a) $4xy$ (b) $4xy = 96$, so $xy = 24$ (the numbers are $8$ and $3$).
32. (a) $2x^2 + 7x + 6$ (b) $(2x + 3)(x + 2)$ (c) $23$ cm by $12$ cm (d) no, since no pair has product $14$ and sum $7$
33. (a) $1728$ (b) $600$ (c) $120$ (d) $1000 + 600 + 120 + 8 = 1728$
