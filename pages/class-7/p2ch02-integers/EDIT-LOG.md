# Class 7 · Mathematics II · Chapter 2 — Operations with Integers

## Beyond the Book, rebuilt 15 September 2026

To DESIGN-MATHS.md §6a, *The shape since 15 September 2026*, on the model of
Class 7 Chapter 1. Only `p101`–`p110` were touched. The §5 rebuild of the
chapter body made the same day was **reverted at the user's request**; the
body is NCERT's structure, as refitted, and was not edited here. The reverted
rebuild is kept in the session scratchpad (`scratchpad/rebuilt/pages/class-7/p2ch02-integers/`).

**The four stages.**

1. **Using What You Know**: the existing stage, word for word; only its
   `.c-stage__for` line was deleted. Checked against git: the text is identical.
2. **Solved Examples**: 14 examples in five types, each Solution → Step → Answer
   with a two-to-four-word reason chip. Type 1 Subtracting integers (3) · Type 2
   The sign of a product (3) · Type 3 Products in everyday situations (3) ·
   Type 4 Dividing integers (2) · Type 5 Many factors and the properties (3).
3. **Practice**: one band, 33 questions. Choose the correct option 13 ·
   Assertion and reason 4 · Very short answer 4 · Short answer 5 · Long answer 5 ·
   Case-based 2. Letter key spread a 4, b 4, c 4, d 5 over the 17 lettered questions.
4. **Answers**: letter key 1–17, a trace row for 18–33, and *Why the other
   options are wrong* for 7, 8 and 17.

**Where it came from.**

| stage | from the reverted body rebuild | from the old Beyond the Book |
|---|---|---|
| Examples | its Examples 1–6, 10, 11, 14 → Examples 1, 2, 3, 4, 7, 5, 10, 11, 14 | Behind Each Answer Problems 1–5 → Examples 12, 13, 8, 9, 6 (options kept; Answer gives the letter) |
| Practice | End-of-chapter 1–4, 6, 8, 9–14, 16, 18, 19, 21, 22, 24–26, 28, 30–33 | Set A 7 → Q5; Set B 2, 4, 8 → Q8, 9, 10; Set C 2, 4, 5 → Q11, 13, 12 |
| new | | Q16, assertion–reason with answer (c), written so that the form has all four letters |

Options were reordered in Q2, 3, 4, 7, 8, 9, 10, 11, 12 and 13 to spread the key.

**Left out as duplicates of the chapter body.**

- Examples: Mala's test (110) and the mine-shaft lift ($-180$, $-120$) are the
  body's Examples 1 and 2. $(-1) \times a$ is always negative? repeats the
  body's *Multiplying by 1 and by $-1$* box. $(-1) \times (-2) \times \cdots
  \times (-10)$ repeats the body's ten and eleven factors of $-1$.
- Practice: fifteen and six factors of $-1$ (End 5, 15) and twenty (Set B 6),
  for the same reason. $\square \div (-7) = -6$ (End 7), $\square \times (-8) = 72$
  (Set B 5), "which integer times $-9$ gives $-72$" (End 17) and "product $-42$,
  one factor $-6$" (End 23) repeat Exercise Set 2.4 Q4, which has $\square \times (-8) = -56$.
  Three consecutive integers with product $-60$ (Set C 1) repeats Set 2.5 Q9.
  The machine $a - b \times c$ (Set C 7) is Set 2.5 Q7's rule. $1 - 2 + 3 - \cdots - 100$
  (Set C 3) is the carrom sum $1, -2, 3, \ldots, -10$. Four negative factors
  (Set B 1) repeats Set 2.5 Q2(c). The lift below ground rising 3 m a minute
  (Set B 7) repeats the lift example. The multiplication pattern (End 27) is
  the body's *Patterns in integer multiplication*, and the 3 × 3 grid (End 29)
  is the body's magic grid.

**Left out as near-duplicates inside the section.** Example 13 of the reverted
rebuild, $(-5) \times 17 \times (-2) \times (-1)$, is Stage 1's first question
with other numbers. Its Example 12 repeated Example 10's sign reasoning. From
the practice: Set A 1–4 and 8 (drills already covered by End 1, 2, 11, 13), A5
(End 12), A6 (the body's $(-1) \times a$ box), A9 (Example 13 with other
numbers), A10 (End 8), B3 (Q17), C6 (Q24), End 20 (Q9).

**Changed.** End 18(c) was $(-6) \times (-5) \times (-2) = -60$, the same
product and pattern as Example 12; it is now $(-4) \times 7 \times (-3) = 84$
(Q22(c)). The case questions lost their *Case study* label and table captions
("Table 2.7" and "2.8" referred to tables that are not in the body), and now say
"The table". The Leh example no longer says it answers the chapter's opening
question, because the body does not open with it. Example 2's question and
Example 3's answer were tightened to fit a page: no number changed.

**Verification.** `scratchpad/beyond-p2ch02-integers/verify.mjs`, 116 checks,
0 failed. It covers every number in Stage 1, every example step, every option
(the letter is found by computing the value and locating it among the options),
every answer and every *why* row, including reused ones. No reused answer
turned out wrong.

**Fitting.** Written into `p101`, old `p102`–`p107` deleted, `refit.mjs … bridge`,
two tightenings, then `settle.mjs` moved answer row 20 from p109 to p110, which
had run 2.1 mm into the margin. Seven Beyond pages before, ten after. Builder:
all pages fit. Beyond fill `14:98% 15:98% 16:83% 17:91% 18:84% 19:98% 20:95%
21:93% 22:98% 23:79%`, and 23 is the last page. `orphans`: 0 stranded.
`fit-options`: every row fits. `check-labels`: no collisions. No `--head`/`--tail`;
every `p1xx` carries `data-bridge`.

**Flagged.** Pages 16 and 18 stay at 83% and 84%. Each is held by a whole
example (Example 8, 58 mm; Example 14, 52 mm) that no line of wording would
bring back. `gaps` also lists body pages 4, 5, 9, 12 and 13; the body was not
touched.

Written new from NCERT *Ganita Prakash*, Grade 7 Part II, Chapter 2,
*Operations with Integers* (textbook pages 24–46). Original LearnLab text in
NCERT's order of topics and questions; no sentence is carried over. Crown
Quarto, house design, palette `amethyst`. The source PDF has no answer key;
every answer below was worked here.

Sections: 2.1 A Quick Recap of Integers · 2.2 Multiplication of Integers ·
2.3 Division of Integers · 2.4 Expressions Using Integers. The source numbers
only the first two and runs *Division* and *Expressions* as subheads; they are
sections here so the chapter's second half has a structure a reader can find.
The five *Figure it Out* blocks are Exercise Sets 2.1–2.5; the source's
in-text carrom questions stay in the running text. *Terhüchü* is an `h3` after
the summary, spelled *Terhuchu* without the diacritic.

## Figures

Six figures from `fig2.mjs` (with `geo.mjs`) in the session scratchpad. Fig.
2.3 puts the source's four token pictures in one row; tokens carry + and −
marks rather than colour alone. Fig. 2.6, the Terhuchu board, is **drawn from
the description and the source picture**: the corner triangles and the starting
position (five coins on the near edge, four on the next row) are a clean
version, not a copy. The pattern machines and the magic grid are tables.

## Every printed number re-derived

| where | answers |
|---|---|
| Set 2.1 | (a) 18, 9 (b) 8, $-4$ (c) 5, $-5$ (d) $-5$, 5 (e) $-4$, $-3$ (f) $-10$, 3 |
| Carrom | second movement 9; $1 - 2 + \cdots - 10 = -5$ · Fig. 2.2: (1) $a$ right, $b$ left, $b$ larger (2) $a$ right, $b$ left, $a$ larger (3) $a$ left, $b$ right, equal |
| Tokens | $7 - 18 = -11$ · $4 \times (-6) = -24$, $9 \times (-7) = -63$ |
| Set 2.2 | 1 $-6$, 10, 4, $-21$ · 2 $-56{,}088$, $56{,}088$, $-56{,}088$ |
| Set 2.3 | $-12$, 18, 5, $-32$, $-90$, $-170$ · blanks $-360$, $-360$, 14 |
| Examples | Mala 110; highest 250, lowest $-100$ · lift $-180$ m, $-120$ m |
| Magic grid | every choice gives $2 \times (-7) \times 3 \times 5 \times 4 \times (-2) \times 6 \times (-3) = -30{,}240$: row $i$, column $j$ holds $r_i \times c_j$ with $r = 2, -7, 3, 5$ and $c = 4, -2, 6, -3$ |
| Set 2.4 | 1 $-210$, 80, $-2$, 2 · 2 $-18^\circ$C · 3 (a) loss ₹1,000 (b) 4,000 bags · 4 $-9$, $-7$, 7, $-11$, $-56$, $-132$ |
| 2.4 | $-60$ · $25 \times (-6) \times 12 = -1800$ · distributive checks 10 and $-2$ · Machine 1 last $-13$ · Machine 2 is $-(a \times b) - c$, last $-111$ |
| Set 2.5 | 1 $-75$, 28, 30 · 2 $-3$, $-21$, 28 · 3 $-27$, 31, 1, $-1$, 0 · 4 4 · 5 $-21 \to 64 \to \cdots \to 1 \to -2 \to -1 \to 4 \to 2 \to 1$; $-6 \to -3 \to 10 \to 5 \to -14 \to -7 \to \cdots$; every run seen ends in the loop $1, -2, -1, 4, 2$ · 6 (a) 10 wrong, 25 questions (b) 15 wrong, 5 unanswered · 7 $a - b \times c$, $-70$ · 8 $8 + 4 \times (-5) = -12^\circ$C · 9 $-3, -2, -1$; 4, 5, 6 · 10 (a) 5 and 5 (b) 10 and 10 (c) 1 and 7 (d) 2 and 2 (e) 7 and 9 (f) 4 and 6 (g) 7 and 10 (h) yes, 122 and 2 (coins of $+13$ and $-9$) · 11 16, 16, 5, $-7$ · 12 (e) < (a) < (b) < (c) < (f) < (d) · 13 $-5{,}31{,}684$, $-5{,}32{,}108$, $-5{,}31{,}137$ · 14 $-5382$ · 15 max 60, $((-2) - (3 + 5)) \times (-6)$; min $-60$, $(3 - (-2) + 5) \times (-6)$ |

Beyond the Book: Stage 1 — negative, $-182$; 8 and $-3$; 3700; $-1683$. Stage 2
— (b), (a), (b), (c), (b). Set A b c b a c a c d a a; Set B b b c a b a a b;
Set C a b b c d c b.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| Collatz example $\ldots 11 \to 32 \to -16 \ldots$ | $11 \to -32$ | $11 \times (-3) + 1 = -32$; the source drops the sign |
| five factors of $-1$ "$= 1$" | $= -1$ | a slip; the next sentence says odd counts are negative |
| Set 2.5 Q11 (b) $32 \div ((-36) \times (-18))$, (c) $(25 \times (-12)) \div (45 \times (-27))$ | (b) $32 \div ((-36) \div (-18))$, (c) $(25 \times (-12)) \div (15 \times (-4))$ | as printed neither is an integer; **numbers changed, flagged** |
| Machine 2, fifth row result as printed | 2, from the rule $-(a \times b) - c$ | the source's picture could not be read with certainty |
| Q6(b) "Did he leave any unanswered?" | "Anil took the same test" | without the number of questions it cannot be answered |
| two identical magic grids | one grid | the second added nothing |
| *Math Talk*, *Try This* | plain questions | no such labels in the library |
| colour tokens (green, red) | + and − tokens | the house palette has no green/red pair to name, and the marks work in a mono proof |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| Set 2.5 Q11 (b), (c) | C4 | changed to integer answers (see above) | confirm the intended expressions |
| 2.4, distributive property | C6 | "will it always?" is asked; the token picture shows one case only (as in the source) | acceptable at this class |

## Checks

Builder: 14 body pages and 7 Beyond the Book pages, every page at 88% or more
except the closing pages. `gaps`, `orphans`, `check-labels`, `fit-options` and
the width probe report nothing. Proofs viewed; the carrom arrows, the token
bags and a stray bracket in Fig. 2.5 were redrawn after the first proof. Table
2.6 was set three groups wide so it fits beside its question.
