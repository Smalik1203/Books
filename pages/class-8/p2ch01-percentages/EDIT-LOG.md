# Class 8 · Mathematics II · Chapter 1 — Out of Every Hundred

Language edit, 26 pages (p001–p016 chapter proper, p101–p110 Beyond the Book).
Build after editing: 26 pages, 0 stranded openers, no label collisions, every
option row fits. All 36 answers in Stage 4 checked against the questions — all
correct.

8 fixes in 26 pages. The chapter is well made and well localised: Surya mixing
paint, millet kanji at $2:7$, badam drink mixes, Kishanlal's sweaters, GST on a
bill the reader is told to go and check at home, ₹ and lakh throughout. It
teaches percentage change as a **multiplier** and then spends the rest of the
chapter on the one thing that actually confuses people — which amount the
percentage is *of*. § 1.8 (a rise and a fall do not cancel) and the Ariba/Arun
marbles paragraph are the clearest treatment of that I have seen at this level.

**One arithmetic error, and it is in a worked example.** See the first row of
FLAGGED. Everything else in the chapter computes correctly, including the
compound-interest table, the two-vases loss and the salt-solution questions.

## FIXED

| before | after | check |
|---|---|---|
| **p001** "a bank account does not pay you interest on the amount you first deposited for very long" | "a bank account soon stops paying interest on just the amount you first put in" | L3, L6 — the original has to be read twice to find the verb |
| **p005** "this is that rule earning its keep" | "this is that rule doing its work" | L1 — idiom; the same one was removed from Part I Chapter 1 |
| **p010** "and it is not arbitrary" | "and it is not an accident" | L1 |
| **p015** "What discount would have brought her out level?" | "What discount would have left her exactly even?" | L3 — idiom |
| **p110** "the single commonest slip in this chapter" | "the most common slip in this chapter" | L1 |

**Correction to an earlier version of this log.** It recorded that the p010 fix
had closed a pre-existing 1.6mm overflow on built page 10. It has not. Re-tested
properly — the chapter copied to a scratch directory, *an accident* reverted to
*arbitrary*, built, and the fill maps compared — page 10 runs 1.6mm into the
bottom margin either way, and so do pages 1 and 4, with page 25 at 1.3mm. **All
four are pre-existing and none is affected by this edit** ("an accident" is one
character longer than "arbitrary", so it could not have helped). Every figure is
under the 12mm clipping threshold, so nothing is cut. Recorded so the pass is
not credited with a repair it did not make.

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p013, Example 7 | C4 | **The answer is wrong by ₹10.** "A television bought for ₹21,000 loses 5% of its value every year… after 3 years $21{,}000 \times 0.95^3 =$ ₹18,015 (to the nearest rupee)." But $0.95^3 = 0.857375$ and $21{,}000 \times 0.857375 = 18{,}004.875$, which is **₹18,005** to the nearest rupee. The year-one figure in the same example (₹19,950) is right, so a reader who checks by multiplying three times — which is exactly what the chapter has just taught them to do — gets 19,950 → 18,952.50 → 18,004.88 and will not reach the printed answer. It is a number in a worked solution, so I have not changed it. | Correct to ₹18,005. Worth checking whether the same figure appears in any answer key or question elsewhere; it does not in this chapter. |
| p012, p105 | M1 | The chapter deliberately avoids the syllabus names, saying "if the interest is paid out every year" and "if the interest is left in the account", and its formulas are labelled "without compounding" and "with compounding". That is clearer than *simple* and *compound interest* and I would not touch it — except that p105, in Beyond the Book, then writes "**Simple interest** would have taken it to ₹15,000 in exactly five as well", using a term the chapter never introduces, once. A reader meets the exam's word for the first time in a solution, undefined. | Either introduce both names in § 1.7 alongside the plain phrasing (they are what every exam paper and bank form will call them), or remove the term from p105. The first is better: the plain wording is the teaching, the names are the vocabulary a student will be marked on. |
| p008 key idea, p110 | M1 | "**The base is where you started**", and later "Name the base out loud". This is the fourth distinct meaning of *base* in the book: the base of a power (Part I Ch 2), the base of a number system (Part I Ch 3), the base of a triangle or a cuboid (Part I Ch 7), and now the amount a percentage is taken of. Nothing acknowledges any of the others. | The chapter's own prose mostly says "the original amount", which is unambiguous and needs no gloss. Either use that consistently or note that *base* is being borrowed. See CROSS-CHAPTER.md. |
| p013 | C5 | "the exponent is doing exactly what the repeated multiplication did in the table opposite" — the exponent notation $p(1+r)^t$ is Part I Chapter 2's, and this is the first place in Mathematics II that spends it. Every other borrowing in this chapter is credited by name ("Chapter 6 of Part I said that anything may be done to an equation…", p005). This one is not. | Name it, as p005 does. A reader who has forgotten what an exponent counts has nowhere to look. |
