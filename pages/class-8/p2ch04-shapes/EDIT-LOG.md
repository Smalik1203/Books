# Class 8 · Mathematics II · Chapter 4 — Taking a Shape Apart

Language edit, 22 pages (p001–p012 chapter proper, p101–p110 Beyond the Book).
Build after editing: 22 pages, 0 stranded openers, no label collisions, every
option row fits. All 36 answers in Stage 4 checked against the questions — all
correct, and I re-derived every fractal count and all six ant routes.

**3 fixes in 22 pages — the lowest of the whole book.** There is very little to
do here because the chapter is written plainly to begin with, and because its
two halves are joined by a single sentence on p001 that earns the title: "A fern
is a shape you cannot draw in full because it never ends; a box is a shape you
cannot draw in full because paper is flat. Both are handled the same way — by
taking the shape apart into pieces you already understand."

Three things worth recording as models:

- **The Koch key idea states the paradox without dressing it up**: "You could
  never walk its edge; you could paint its inside with one tin." Then the
  coastline paragraph turns it into something a reader can check — measure
  Britain in hundred-kilometre steps and in ten-kilometre steps and you get two
  answers, because "the question was not as clear as it looked".
- **§ 4.8 does not stop at the answer.** It works all three unfoldings of the
  ant's box, notices that the two short sides always add to 19 whichever way you
  unfold, and concludes that the most balanced pair wins — so the shortest route
  can be named before any arithmetic. That is a genuine piece of reasoning, not
  a worked example.
- **Euler's formula arrives without its name**, derived by counting a prism and
  a pyramid and then checked: $12 + 20 - 30 = 2$. A Class 8 reader gets the
  result and the check without a biography.

The Indian material is placed as fact, not decoration: Khajuraho's Kandariya
Mahadev (c. 1025 CE) with its towers repeated at three or four scales, and
Madurai, Hampi, Rameswaram and Varanasi named alongside. The laddu at the far
corner of the ant's box is the right kind of small touch.

## FIXED

| before | after | check |
|---|---|---|
| **p005** "The question was less well posed than it looked." | "The question was not as clear as it looked." | L1 — *well posed* is mathematicians' shorthand |
| **p005** "at scales that halve towards the centre until the drawing gives out" | "…until the drawing can go no further" | L3 — idiom |
| **p110** "the commonest way to go wrong" | "the most common way to go wrong" | L1 |

## FLAGGED

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p001 (built page 1) | — | Sits at 101% fill and **flickers**: the builder reported "runs 1.6mm into the bottom margin" on one run and nothing on the next, with the source unchanged between them (my three edits were in p005 and p110). So this page is exactly on the boundary of the overflow check, and which side it lands on varies between builds. Not caused by this edit — p001 was never touched. | One line out of p001 would settle it. Worth knowing that a page can pass or fail the same check on consecutive runs; the fill map reports 101% either way, so that is the number to trust. |
| p003 (built page 3) | — | 86% full, 29mm of white at the foot. Pre-existing; p003 untouched. | `refit body` or one more line of prose. Recorded so it is not read later as a language edit. |
| p002, p003, p004 | M1 | The area formulas are given as $\left(\tfrac89\right)^n$, $\left(\tfrac34\right)^n$ and $3\left(\tfrac43\right)^n$, and p002 says correctly that this is "Chapter 1's compounding, downwards". But a fraction raised to a power is new: Part I Chapter 2 § 2.2 squares and cubes fractions ($\left(\tfrac53\right)^2$, $\left(\tfrac46\right)^3$) and Chapter 1 of this volume uses decimal multipliers like $0.95^3$ — nowhere is $\left(\tfrac89\right)^n$ with a *letter* exponent established. | It is probably fine for a reader who has both chapters, but a half-line tying $\left(\tfrac89\right)^n$ to "eight ninths taken $n$ times" would cost nothing. The chapter says exactly that in words on p002; the formula just needs to be pinned to it. |
| p007 | C5 | "That is not a coincidence, and it holds for every solid of this kind." The claim is $F + V - E = 2$, and *every solid of this kind* is never pinned down — prisms and pyramids are the only families defined, but the summary states the rule for "a solid with flat sides", and Exercise 4.2 Q3 applies it to a solid with 8 faces and 12 vertices that is neither. | Either say which solids it covers, or say that it is being assumed and is proved elsewhere — the honest signpost Part I Chapter 5 uses for the triangle angle sum. A reader cannot otherwise tell whether it is a rule about prisms or a rule about solids. |
