# Class 10 · Mathematics I · Chapter 1 — Real Numbers

Written new from NCERT *Mathematics, Textbook for Class X* (reprint 2026-27),
Chapter 1, *Real Numbers* (textbook pages 1–9). Original LearnLab text in
NCERT's order of topics, examples and questions; no sentence is carried over.
Crown Quarto, house design, palette `cobalt` — the first chapter of Class 10,
so no palette is taken yet in this class. The source PDF has no answer key;
every answer below was worked here.

Sections: 1.1 Introduction · 1.2 The Fundamental Theorem of Arithmetic ·
1.3 Revisiting Irrational Numbers. The source's *Exercise 1.1* and
*Exercise 1.2* are Exercise Sets 1.1 and 1.2. Theorems 1.1–1.3 are
`c-keyidea` blocks, their proofs running text; the proof of Theorem 1.3 is
stepped working with a reason on every line. The source's *1.4 Summary* is
the chapter summary (not a numbered section, as in every other chapter), and
its *Note to the Reader* is a `c-reflect`.

## The one figure

Fig. 1.1, the factor tree for 32760, is drawn new from `fig1.mjs` in the
session scratchpad: the same splits as the source (2, 2, 2, 3, 3, 5, 7 and
13), with each prime boxed. The source's portrait of Gauss is left out; his
note is running text.

## Every answer worked

| where | answers |
|---|---|
| 1.2 products | 1771 · 5313 · 10626 · $2^3 \times 3 \times 7^3 = 8232$ · 21252; $123456789 = 3^2 \times 3803 \times 3607$, and 3803 and 3607 were checked prime |
| Examples 1–4 | no $n$ · HCF 2, LCM 60 · HCF 4, LCM 9696 · HCF 6, LCM 360; $6 \times 72 \times 120 = 51840 \neq 2160$ |
| Set 1.1 | 1 (i) $2^2 \times 5 \times 7$ (ii) $2^2 \times 3 \times 13$ (iii) $3^2 \times 5^2 \times 17$ (iv) $5 \times 7 \times 11 \times 13$ (v) $17 \times 19 \times 23$ · 2 (i) HCF 13, LCM 182 (ii) HCF 2, LCM 23460 (iii) HCF 6, LCM 3024 · 3 (i) HCF 3, LCM 420 (ii) HCF 1, LCM 11339 (iii) HCF 1, LCM 1800 · 4 22338 · 5 no: $6^n = 2^n \times 3^n$ has no 5 · 6 $13 \times 78 = 1014$ and $5 \times 1009 = 5045$ · 7 36 minutes |
| Set 1.2 | proofs; each follows Theorem 1.3 or Examples 6–7 |
| Note to the Reader | both formulas checked on 6, 72, 120: $51840 \times 6 \div 864 = 360$ and $51840 \times 360 \div 3110400 = 6$; both hold in general (the exponents of each prime satisfy max = sum − pairwise mins + min, and the same with max and min exchanged) |

Beyond the Book: Stage 1 — LCM 720, and no pair has HCF 18 with LCM 380
(18 does not divide 380; a pair with the first property is 90 and 144);
625; 1085; no ($\sqrt{2} \times \sqrt{8} = 4$); irrational. Stage 2 — (b),
(c), (d), (b), (c). Set A a b c b c d d c; Set B d c c b a b; Set C b b d b c.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| 1.1 promises Euclid's division algorithm and a study of terminating decimal expansions | not mentioned | neither is in this edition of the chapter; an introduction that promises them contradicts the pages after it |
| the Gauss note: "an equivalent version of Theorem 1.2" | Theorem 1.1 | the note is about the Fundamental Theorem of Arithmetic |
| Note to the Reader: "(see Example 8)" | Example 4 | the chapter has seven examples; the product of 6, 72 and 120 is in Example 4 |
| proof of Theorem 1.2 marked "*Not from the examination point of view" | printed without the mark | the book names no examination |
| "discussed in some detail in Appendix 1" | the method is described in one sentence where it is first used | this book has no appendix |
| *1.4 Summary* as a numbered section | the summary component, five points | house style; the source's third point, "To prove that √2, √3 are irrationals", is a topic, not a result, and the HCF–LCM results the chapter states were missing |
| Example 5's working, "a = 3c" on a line of its own | joined to the next line | fitting; nothing is lost |
| the factorisation of 32760 run into a sentence | two lines of working under the figure | a long product in a justified line either breaks at a × or opens the word spaces into holes |
| a paragraph on how a factor tree ends, and a sentence reading the powers in Example 2 | added | each closes a short page; both say what the figure and the example already show |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| 1.2, HCF × LCM | M3 | "for any two positive integers a and b, HCF × LCM = a × b" is stated after one example and never shown; the reason (for each prime, the smaller power plus the larger power is the sum of the two powers) is one line | a sentence of reason, if the class is to be shown it |
| 1.3 opening | C6 | "√p is irrational for every prime p" is claimed; only p = 2 and p = 3 are proved, and p = 5 is an exercise | none if the general case is left as a remark |
| 1.2, 123456789 | C4 | "check that 3803 and 3607 are primes" means trial division by every prime up to 61, which the chapter does not show how to do | a hint, or accept it as a stretch |
| Note to the Reader | C6 | the two formulas for three numbers are stated without any reason, and a reader checking them has no way to see why they hold | none; the note is an aside |
| Stage 2, Problem 4 and Set B Q3 | — | Set B Q3 (c) needs $\sqrt{6}$ irrational only for the reader's own interest; the question asks for the value, so no proof is needed | none |
