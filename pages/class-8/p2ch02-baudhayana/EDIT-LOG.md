# Class 8 · Mathematics II · Chapter 2 — Two Squares Make One

Language edit, 24 pages (p001–p014 chapter proper, p101–p110 Beyond the Book).
Build after editing: 24 pages, 0 stranded openers, no label collisions, every
option row fits. All 36 answers in Stage 4 checked against the questions — all
correct, including every triple, every root and the two "not enough is known"
traps.

11 fixes in 24 pages, and every one of them a single word. This is the best
chapter in the book so far and it is worth saying why, since the rest is being
measured against it:

- **The theorem is derived, twice, and named for Baudhāyana first.** The
  doubling rule is proved by counting four triangles (p002) before any algebra;
  the general theorem is proved by counting one square two ways (p007) and
  spends Part I Chapter 4's $(a+b)^2$ to do it. The Śulbasūtra is quoted at
  1.9 and 1.12, dated to around 800 BCE, and Pythagoras is placed "some three
  centuries later" — accurately, and without either overclaiming or the usual
  silence.
- **It knows the difference between a construction and a number.** p004: "a
  rule you can carry out with a cord and two pegs is worth more on a building
  site than a decimal". Then it gives Baudhāyana's own fractional value for
  $\sqrt2$ and checks it: right to five decimal places, "a fifth of a hair's
  breadth" on a ten-metre altar. I verified that sum — $1 + \tfrac13 +
  \tfrac{1}{12} - \tfrac{1}{408} = 1.4142157\ldots$ — and it is correct.
- **§ 2.8 is honest about what a hard question looks like.** Fermat's margin,
  three hundred years, Wiles at ten and at forty-one, and the closing point:
  two squares can be cut up and laid over a third, and there is no such picture
  for cubes. A Class 8 reader is told plainly that nobody can tell which
  questions are easy by looking at them.

## FIXED

| before | after | check |
|---|---|---|
| **p004** Q3 "when the side is trebled" | "when the side is tripled" | L1 — matches the *triple* used after Part I Chapters 1, 2 and 7 were edited |
| **p005** "It can be cornered." | "It can be trapped." | L3 — and *trapped* is the chapter's own word in the very next sentence. (An earlier version of this log said the fix also closed a pre-existing 1.1mm overflow on that page. Re-tested in a scratch copy with *cornered* restored: built page 5 runs 1.1mm into the bottom margin either way. The overflow is pre-existing and untouched.) |
| **p010** "if the three sides happen to satisfy $a^2+b^2=c^2$" | "…happen to make $a^2+b^2=c^2$ true" | L1 — *satisfy* is jargon |
| **p012** Q3 "Check both answers satisfy $a^2+b^2=c^2$" | "Check that both answers make $a^2+b^2=c^2$ true" | L1 |
| **p107** Q10 "If every side is trebled" | "If every side is tripled" | L1 |
| **p110** "Trebling every side treble the hypotenuse" | "Tripling every side triples the hypotenuse" | L1 — and the original does not parse |
| **p110** "$8$, $15$, $17$ satisfies $a^2+b^2=c^2$" | "…makes $a^2+b^2=c^2$ true" | L1 |
| **p110** "the commonest way to lose a mark" | "the most common way to lose a mark" | L1 |

## FLAGGED

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p010 § 2.6.2 vs p011 § 2.7 | M1 | "Two **Baudhāyana triples** went by on the way: $(3,4,5)$ across the floor and $(5,12,13)$ up to the corner." The term is defined on the next page — "Three whole numbers with $a^2+b^2=c^2$ are called a **Baudhāyana triple**" — in § 2.7, which is where the whole idea is introduced. So the reader meets the term one page before it exists, in the sentence that closes a worked example. | Either move that sentence into § 2.7 or say "two sets of whole numbers you will meet by name on the next page". A one-page forward reference, and the only one in the chapter. |
| p110 (built page 24) | — | Runs 0.8mm into the bottom margin. **Pre-existing** — I verified by reverting all four of this page's word changes and rebuilding, and the overflow is identical. Under the 12mm clipping threshold, so nothing is cut. | Recorded so it is not later attributed to the language pass. Five such pages now across the two volumes. |
| p012 | M2 | The triple-machine identity is given as one line: $(m^2-n^2)^2 + (2mn)^2 = m^4 - 2m^2n^2 + n^4 + 4m^2n^2 = m^4 + 2m^2n^2 + n^4 = (m^2+n^2)^2$. Expanding $(m^2-n^2)^2$ needs Part I Chapter 4's square-of-a-difference applied to squares rather than to letters — $a = m^2$, $b = n^2$ — which is exactly the substitution Part I § 4.6 warns is the hard step ("Writing down what $a$ and $b$ are before starting is the difference between using an identity and misremembering one"). Here nothing is written down; three expansions happen in one line. | Name the substitution, or split the line. The chapter is careful everywhere else; this is the one place it goes fast. |
