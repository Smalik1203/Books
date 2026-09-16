# Class 7 · Mathematics II · Chapter 4 — Another Peek Beyond the Point

## Beyond the Book, rebuilt 15 September 2026

Rebuilt to the four-stage shape at the top of DESIGN-MATHS.md §6a. Only
`p101.html` up changed; the chapter body, `p001`–`p013`, was not touched. The
§5 body rebuild of the same day (worked examples, checks and end-of-chapter
exercises inside the chapter) was **reverted at the user's request**. Its pages
are kept in the session scratchpad, under `rebuilt/pages/class-7/p2ch04-decimals/`,
and some of its examples and questions were reused here.

**1 · Using What You Know.** The existing stage, word for word: four questions
tried in `.c-try` and explained in running text. Only its `.c-stage__for` line
was removed.

**2 · Solved Examples, 14.** Each is Solution, steps in `.work__row` with a
`.chip` reason, Answer; a multiple-choice one keeps its options and answers with
the letter.

| type | examples | from |
|---|---|---|
| 1 · Dividing by 10, 100 and 1000 | 3 | rebuild Ex 1, 3, 2 |
| 2 · Multiplying decimals | 4 | rebuild Ex 9 (0.047 changed to 0.058, since Stage 1 uses 0.047); old Problems 1 and 4; rebuild Ex 10 |
| 3 · Checking a product | 2 | rebuild Ex 11; old Problem 5 |
| 4 · Dividing decimals | 2 | old Problems 2 and 3 |
| 5 · Leap years | 3 | rebuild Ex 21 (years changed from 2028, 2100, 2400 to 2032, 2200, 2800, which Practice does not use); rebuild Ex 22, 23 |

**3 · Practice, 35 questions**, one run under one band.

| form | count | from |
|---|---|---|
| Choose the correct option | 21 | rebuild end-of-chapter 1–8 (6 recast as *not* a leap year); old Set A 5, 7, 10; Set B 1, 2, 3, 7, 8; Set C 1, 3, 5, 6, 7 |
| Assertion and reason | 4 | rebuild 9, 10; old Set B 6 with a new reason (true, but not the reason: key b); new, 2400 and every year divisible by 100 (key c) |
| Very short answer | 4 | rebuild 12, 13, 14; new, 0.45 times what is 45 |
| Short answer | 2 | rebuild 23, 24 |
| Long answer | 2 | new: a 12.5 m by 8.4 m garden; a 562.5 L tank with a leak |
| Case-based | 2 | rebuild 29 (Shalini's stall, its table set without caption or *Case study* label), 30 (the tailor) |

Options were reordered so the multiple-choice key runs a 5, b 5, c 6, d 5, and
the four assertion–reason keys are a, d, b, c.

**4 · Answers.** The letter key for 1–25, a row for each of 26–35, and *Why the
other options are wrong* for 7, 14, 16, 17 and 24. The old stage's closing
paragraph of three things to keep went with its name, *Answers & Takeaways*.

**Left out as already in the chapter body.** Rebuild Examples 4–8 and 12–19
(body Examples 1–13); rebuild end-of-chapter 16–22 and 25–28 (Exercise Set 4.4);
old Set A 1, $0.7 \times 0.6$ (Set 4.1 Q9); Set A 9, 0.05 kg in grams (the spices
question in 4.1); Set B 4, $10 \div 3$ (worked in *Does this ever end?*); Set C 2,
1461 against 1460.9688 (both worked in 4.4); Set C 4, digits into boxes (Set 4.4
Q10).

**Left out as near-duplicates.** Rebuild Ex 20, $2.4 \div 0.06$ (the move of
Example 10); rebuild 11, the 2100 assertion, and 15, $25 \div 0.05$ (Q8's move); old
Set A 2 ($3.45 \times 100$, like Q2), A 3 ($56.2 \div 10$, like Q3 and Q27), A 4
($\frac{3}{8}$, like Q6 and Stage 1's $\frac{1}{8}$), A 6 ($9 \div 0.3$, like Q8),
A 8 ($5 \div 4$, like Q6); Set B 5, ribbon pieces of 0.15 m (like Q31 and Stage
1's glasses).

**Numbers.** `scratchpad/beyond-p2ch04-decimals/verify.mjs` checks every example
step, every option (exactly one correct, at the letter printed), each assertion
and reason, and every short, long and case answer, in BigInt fractions: 148
checks, none failed. No reused answer was wrong.

**Fitting.** Seven old pages became nine, `p101`–`p109`, each carrying `data-bridge`. To close short pages, rows were
folded in Examples 1–8, 13 and 14; the questions of Examples 8 and 14 and
Practice 19 and 22 were cut to one line; Question 7's options went into two
columns; the tailor's case text was cut so that "m." no longer stands alone
on a line. Builder fill for Beyond, folios 14–22: 85, 100, 97, 95, 98, 96,
101, 87, 87 (last). No `!` overflow; folio 20 (`p107`) runs 1.6 mm into the
bottom margin. `orphans`: 0 stranded openers. `fit-options`: every option row
fits. `check-labels`: no collisions. No `--head`/`--tail`, no inline style.

**Flagged.** `p101` is 85%: Stage 1 fills it word for word, and Stage 2's head,
Type 1 head and Example 1 need more than the 34 mm left. `p108` is 87%: the
Answers head and key need about 40 mm against 31 mm left. The refit packer
measures practice pages about 2 mm short, which is why `p107` sits in the
margin.

Written new from NCERT *Ganita Prakash*, Grade 7 Part II, Chapter 4, *Another
Peek Beyond the Point* (textbook pages 67–96). Original LearnLab text in
NCERT's order of topics and questions; no sentence is carried over. Crown
Quarto, house design, palette `moss`. The source PDF has no answer key; every
answer below was worked here.

Sections: 4.1 A Quick Recap of Decimals · 4.2 Multiplying Decimals (*Decimal
Multiplication*) · 4.3 Dividing Decimals (*Decimal Division*) · 4.4 Look
Before You Leap. The source's subheads are `h3`; its four *Figure it Out*
blocks are Exercise Sets 4.1–4.4.

## Figures and tables

Two figures from `fig4.mjs` in the session scratchpad: the rectangle of
Example 4 and the two number lines of Set 4.4 Q2. The number lines are **redrawn**
with arrows at the sixth of ten marks, so the answers are 3.16 and 2.162.
The source's place-value pictures of long division (tokens of hundreds, tens and
ones shared into four groups) are set as numbered steps; its three leap-year
flowcharts are set as rules in words. Tables 4.1–4.7 carry the fraction game,
the place splits, the decimal-place counts, the product relationships, and the
×10, ÷10 and $a \div b$ grids. *Hidato*, the closing puzzle, is left out: its
grids could not be read reliably.

## Every printed number re-derived

| where | answers |
|---|---|
| 4.1 | Table 4.1: 0.04, 0.067, 4.57, 0.71, 0.43, 0.09 · spices 0.05, 0.1, 0.025, 0.25 kg · Table 4.2: 0.0847, 1.73, 0.023 |
| Examples 1–5 | ₹47.50 · 93.75 km · 9.924 km · 75.81 sq cm · 7.192 |
| Set 4.1 | 1 2.4, 2.1, 0.45 · 2 164.04, 15.651, 0.09936 · 3 4.95 m, 495 cm · 4 ₹70.25, change ₹29.75 · 5 5.22 cm · 6 ₹127.125; yes, trailing zeros do not change a decimal · 7 ₹320 · 8 21.6, 2.16, 2.16, 0.0216, 0.000216, 21.6; less than 1: (d), (e) · 9 (b) 0.42, (d) 0.0042 · 10 57, 570, 5700; 230.2, 2302, 23020; 9.2, 92, 920; 3.06, 30.6, 306; 246.7, 2467, 24670 |
| 4.3 | 0.39 m, 0.039 m = 3.9 cm = 39 mm · Table 4.6: 2.11, 0.211, 0.0211, 0.00211; 0.013, 0.0013, 0.00013, 0.000013; 214.6, 21.46, 0.2146, 0.02146; 5.8, 0.58, 0.058, 0.00058 · Examples 7–13: 14.5 m, 7.25 m; 331; 331.25; 29.625; 2.375 kg; 0.012; 50.4 km/h; 3.6, 36 |
| Set 4.2 | 1 3.6, 103.75, 608.5, 603.375 · 2 (a) (iii) 381.5 (b) (iii) 445.875 · 3 33, 3.3, 0.33, 0.033 · 4 15.75, 1.575, 0.1575, 0.01575, 0.001575 |
| Never-ending | $10 \div 9 = 1.111\ldots$, $100 \div 11 = 9.0909\ldots$ · $142857 \times 1$ to 6 are its rotations; $\times 7 = 999999$ · $1 \div 17 = 0.\overline{0588235294117647}$ · $128 \div 0.4 = 320$ |
| Set 4.3 | 1 0.4, 3.25, 0.08, 0.625 · 2 20.7, 3.8 · 3 18.72, 156, 1.2, 0.01872 · 4 1000, 0.1, 10, 0.1, 10, 100 · 5 1.64, 16.4, 164; yes · 6 0.8 m · 7 17.4 cm · 8 375 mL · 9 18.6 km · 10 0.9 kg · 11 0.03125, 0.00032; $2 \times 5 = 10$ |
| 4.4 | 24.22 days · 1461 and 1460.9688 · 36,525 and 36,524.22 · 36,524 · 3,65,240 and 3,65,242.2 · 3,65,242 · 10,000 years: $2500 - 100 + 25 = 2425$ leap years, 36,52,425 days against 36,52,422, 3 days too many |
| Set 4.4 | 1 chips (₹0.302 a gram against ₹0.336) · 2 3.16, 2.162 · 3 ₹85 · 4 64 books, no space left, 16 books do not fit · 5 5500, 0.35, 145, 0.068, 9020, 0.1255 · 6 2.5; $60.25 \div 3.5 = 17.214285\ldots$, never ending ($\frac{241}{14}$) · 7 e.g. $0.6 \times 4$, $1.2 \times 2$; $2.9 \times 5$, $0.5 \times 29$ · 8 21, 21, 2100, 0.21, 2100, 0.021 · 9 rows 37: 41, 4.1, 0.41, 0.041, 410; 3.7: 410, 41, 4.1, 0.41, 4100; 0.37: 4100, 410, 41, 4.1, 41000; 0.037: 41000, 4100, 410, 41, 410000; 370: 4.1, 0.41, 0.041, 0.0041, 41 · 10 (a) $82.0 \times 5.4 = 442.8$ (b) $45.8 \times 0.2 = 9.16$ (c) e.g. $54.0 \times 2.8 = 151.2$ (d) $20.5 \times 4.8 = 98.4$ (e) $45.8 \times 0.2 = 9.16$, the smallest possible (all by search) · 11 (f) < (c) < (a) < (e) < (d) < (b) |

Beyond the Book: Stage 1 — $48 \div 0.98$; 0.1081; 14; 0.125. Stage 2 — (a),
(d), (c), (b), (c). Set A b c a c b d c a c c; Set B b a b c d a b b; Set C b a
b c b c b.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| Set 4.3 Q2 $24.86 \div 1.2$, $5.728 \div 1.52$ | $24.84 \div 1.2$, $5.776 \div 1.52$ | as printed neither division ends; **numbers changed, flagged** |
| Set 4.3 Q9 234.45 km | 234.36 km | as printed the division does not end; **flagged** |
| Set 4.4 Q8 (f) repeats (b), $7.56 \div 0.36$ | $0.756 \div 36$ | a duplicate part |
| Set 4.4 Q11, operation signs lost in the extraction | $\times$ and $\div$ as set | read from the pattern of the options |
| "364.2422 days" in the closing question | 365.2422 | a slip |
| Set 4.3 Q4, the symbols garbled | division throughout, with $\times$ in (d)–(f) | the intended pairing of $\div 10$ with $\times 0.1$ |
| *Math Talk*, *Try This* | plain questions | no such labels in the library |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| Set 4.3 Q2 and Q9 | C4 | changed so the divisions end (see above) | confirm the intended numbers |
| Set 4.4 Q6 | M2 | Sridharacharya's second quotient never ends; the question now says so | a teacher may accept $17\frac{3}{14}$ |
| Set 4.4 Q1 | C4 | "which is cheaper" needs a price per gram, which the chapter does not model | the stem now asks per gram |

## Checks

Builder: every page at 88% or more except the closing pages. `gaps`,
`orphans`, `check-labels`, `fit-options` and the width probe report nothing.
Fitting took line-sized edits: sentences added to the recap, four Set 4.1
questions and the leap-year count; Example 7 and the divisor rule trimmed; one
sentence cut from the opening of Beyond the Book.
