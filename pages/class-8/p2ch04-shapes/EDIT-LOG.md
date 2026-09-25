# Class 8 · Mathematics II · Chapter 4 — Taking a Shape Apart

## Solved examples in examination formats, 23 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 17 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-8/p2ch04-shapes/`.

Source `build/jee-class8.mjs`; check `build/check-jee-class8.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p113; the answers stage still opens a fresh page.

Fitting, same day. Practice p110: its last block moved to p111 (settle.mjs), which had room; no words changed.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) 6 cm |
| 2 | Single correct | (b) 7 |
| 3 | Single correct | (c) 18 |
| 4 | Single correct | (d) 12 |
| 5 | Single correct | (a) $125 \text{ cm}^3$ |
| 6 | Single correct | (b) an octagon |
| 7 | Multiple correct | (a), (b), (c) |
| 8 | Multiple correct | (a), (b), (d) |
| 9 | Multiple correct | (a), (c) |
| 10 | Multiple correct | (a), (c), (d) |
| 11 | Numerical answer | 15 |
| 12 | Numerical answer | 81 |
| 13 | Numerical answer | 5184 |
| 14 | Matching | (c) P–3, Q–4, R–1, S–2 |
| 15 | Matching | (b) P–2, Q–1, R–4, S–3 |


## Syllabus audit fixes, 17 September 2026

Two gap findings from the Beyond the Book syllabus audit, both confirmed and
fixed. **Pages: 25 before (11 body + 14 Beyond), 26 after (11 + 15).**

| finding | what was done |
|---|---|
| Gap (borderline): no Solved Example on nets beyond card area; body §4.7 and Practice Q22 need *which solid does a net make* | New Example 12 under Type 6, now headed *Nets: the card they use and the solid they make*: one pentagon with a triangle on each side folds into a pentagonal pyramid, 6 faces, 10 edges, 6 vertices, checked by $F + V - E = 2$. No figure needed. The cube-net half of the finding was not given an example: it needs a drawing, and a non-folding arrangement would answer Exercise Set 4.2 Q4 |
| Gap (minor): no example counts carpet holes with $H_{n+1} = H_n + R_n$ | Example 1 now also asks how many holes have been cut: Step 4 $H_2 = 1 + 8 = 9$, and Step 5 checks the area by the holes, $18 \times 18 + 8 \times 6 \times 6 = 612$ cm² and $2916 - 612 = 2304$ cm² (this replaces the *eight ninths, twice* check). Step 2 and step 3 hole counts are printed in the body already; step 4 and 5 (Exercise Set 4.1 Q2) are not touched |

Examples 12–16 became 13–17. **17 Solved Examples now (16 before).**
`check-numbers.mjs`: Example 1's holes and hole area, Example 12's counts,
and a new reader for every Beyond example's Answer row (17 of them);
breaking the hole count, the hole area and Example 12's edges each fails.
`ANSWERS.md` lists no Stage 2 answers, so nothing there changed.

Fitting: `refit … bridge` left Q31 alone on a page before Answers; blocks
were pulled back a page at a time, the Type 9 head moved off the foot of
page 20, and Q30 was moved over to join Q31, so the two case questions
share page 24. Short pages now: 19 (67%, Example 14 does not fit under
Example 13), 23 (61%) and 24 (62%). Answers opens page 25.

## Brought to the Class 7 standard, 17 September 2026

Phase 3 of `PLAN-MATHS-CONSISTENCY.md`, done against the Class 8 Chapter 1
model. The chapter was read whole before anything was changed; a backup of
the old pages is in the agent's scratch folder, not in the repo.

**Pages: 22 before (12 body + 10 Beyond, Crown Quarto), 25 after (11 body +
14 Beyond, 196 × 276).** The taller page took one page off the body. Beyond
grew by four: Stage 1 now carries its own explanations, Stage 2 is sixteen
new stepped examples, and the practice runs to 31 questions.

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`. The body was
refitted once (`refit … body`), after the examples were stepped. `p012.html`
is gone; `p011.html` closes the body and carries `data-close`.

**All four body examples set as steps.** *Solution*, Step rows, an *Answer*
row, the reason in a `.work__why`. The old wide labels (*side*, *how many*,
*edges*, *so*, and Example 4's pairings `$10$ and $5+2$`) became Step rows;
Example 4's pairings moved into the `.work__why` so no maths span was lost.
Each example's closing remark stays as a paragraph after the working.
Verified by `build/check-example-stepping.mjs`: 4 examples, 0 lost
mathematics. The non-example working blocks in §§ 4.2, 4.6 and 4.8 are
running text and were left as they were.

**No body question names a figure**, so no figure had to be reprinted.
Exercise numbering runs 1, 2, 3 … in all three sets (checked by script).

**Beyond the Book rebuilt to the four current stages** (§6a):

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 8 `.c-try` questions, answered in the next stage | **the same eight, each followed by its own explanation**, word for word except as below; `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | the worked answers to stage 1 (*The same eight questions, worked*) | **16 stepped examples**, Examples 1–16, under nine `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, 36 questions | **one numbered run of 31**, all six forms, band carrying the numeral |
| 4 Answers & Takeaways → **Answers** | key, why the options are wrong, *What to carry forward* | key, every other answer in `.work--trace` blocks, why the options are wrong for 8 questions; the closing paragraph of *carry forward* kept without its head |

Stage 2's explanations were moved under their own questions, dropping only
the `.c-solution` wrapper and its title. Two sentences that pointed forward
were corrected: *Try each before turning the page* → *before reading what
follows it*, and *The eight are answered below in the order they were asked.
Notice how few pictures are needed* → *Look back over the eight and notice
how few pictures were needed* (moved to the end of the stage).

**Give-aways found and fixed** (the no-give-away rule beats word for word):

| where | printed | answered | now |
|---|---|---|---|
| Stage 1 Q1 | side 81, step 4: $8^4 = 4096$ | Ex 4.1 Q2 ($R_4$) | side 243, step 5: $8^5 = 32768$, *a little over half* |
| Stage 1 Q4 | cube of side 6: $\sqrt{180} \approx 13.4$ | Ex 4.2 Q6 (one of the three unfoldings of 8 × 6 × 4 is $\sqrt{180}$) | cube of side 5: $\sqrt{125} \approx 11.2$, 15 cm of edges, $\sqrt{75} \approx 8.7$ through the middle, *about two and a half centimetres* |
| Stage 1 Q5 | square top view and triangular front view: a square pyramid and a triangular prism share two views | Ex 4.3 Q6 (two different solids with the same front and top views) | **replaced** with an item of the same kind: the three views of a 3 × 2 × 1 cuboid and their sizes |
| Stage 1 Q7 | *for a 4 × 4 × 4 block … $2^3 = 8$ hidden* | Ex 4.3 Q4 (a 2 × 2 × 2 cube has 8 small cubes) | 5 × 5 × 5 block, $3^3 = 27$ hidden |

Dropped from the old Problem Sets because they repeated or answered the
body: cylinder's top view (Ex 4.3 Q1), cone's front view (Ex 4.3 Q2), three
cubes in a row (Ex 4.3 Q3), same front and side view (Ex 4.3 Q6), a cube's
faces + vertices − edges (Ex 4.2 Q2), a triangular prism's vertices
(Ex 4.2 Q2), 4096 squares (Ex 4.1 Q2), the rule applied to its own output
(the Think and Reflect), the triangle's area first below a half (its key
prints $\left(\tfrac34\right)^3$, Ex 4.1 Q4), the cube of side 6 (as above),
and the *single point* top-view item. The old key's option (b) of Set B Q3,
$\tfrac68$, had the same value as option (a); the rewritten question has
four different values. Practice Q21 was moved from step 3 to step 5 because
its answer, $\tfrac{1}{27}$, is printed by body Example 1. New examples and
questions were written so that none of their working prints a body answer
(for instance, triangle-area questions avoid step 3 and step 4, the carpet
avoids step 4, and no Beyond item names the solid of Ex 4.2 Q3 or the nets
of Ex 4.2 Q5).

`build/check-no-repeats.mjs` reports 16 pairs above 50%; every one was read
and is *same type, different numbers* (e.g. Practice Q23, carpet from 135 cm
at step 3, against body Example 1, carpet from 27 cm at step 3).

**Worked examples in the chapter: 20** (4 body + 16 Beyond), against §5a's
twelve. Every topic has a type: counting a carpet (with a plus-sign rule of
the same kind), the Sierpiński triangle and its area, the Koch snowflake,
prism and pyramid counts, faces + vertices − edges, nets and card, the
shortest route across a box, three views, isometric drawing.

**Practice: 31 questions** — 15 multiple choice (key letters a 4, b 4, c 4,
d 3), 4 assertion–reason (a, d, b, c), 3 very short, 4 short, 3 long,
2 case-based. The last practice page holds both case-based questions, so no
question stands alone before the Answers stage.

**`ANSWERS.md` written** for every question the chapter sets: the three
exercise sets (with what each drawing must show and worked instances where
answers vary), the Think and Reflect, Stage 1 (pointing to its explanations),
and the 31 practice questions with their working.

### Verified

`check-numbers.mjs` is kept beside the pages. It passes **385 claims**,
evaluating 217 printed equalities and approximations on the pages and in
`ANSWERS.md` (display maths taken out before inline maths; each `≈` checked
to its printed decimal places). It also re-derives what arithmetic cannot:
fractal counts built step by step, the holes drawn in Figs 4.1 and 4.2 and
the corners of Fig. 4.3's star (12 and 48), Fig. 4.6's labels against the
12 × 4 × 3 box, every unfolding of every box, views computed from sets of
cubes (Fig. 4.7, Stage 1 Q5, Example 14, Practice Q29, Ex 4.3 Q3), hidden
cubes, visible edges of an isometric cuboid, the first step past a
threshold (Ex 4.1 Q6: step 9, since $\left(\tfrac43\right)^8 \approx 9.99$),
every practice answer read back out of the key one lettered part at a time,
every multiple-choice question solved (exactly one right option, matching the
key), the assertion–reason letters, the key's spread, the numbering of every
exercise set and of the practice run, and `ANSWERS.md`'s key against the
page's. The 37 spans it skips are algebra (`--skipped` lists them).

**Tested by breaking values on purpose — 11 of 11 caught:** $8^5$ printed
32767 in Stage 1; key 26 changed to 16 cm; $H_4 = 586$ in `ANSWERS.md`; key
30 (a) side 4 cm (a lettered part in words); key letter 9 changed to (a);
`ANSWERS.md` key 7 changed to (c); Fig. 4.6's 12 label changed to 13; Q2's
right option changed to 1.5 cm; practice `data-start` 25 changed to 24; key
29's side view changed to 2 squares; Example 13's edge walk printed 42.

**Three faults in the check itself**, found on its first run and fixed: an
expected order typed by hand for the § 4.8 unfoldings; the Q29 view counts
read from the first number in a sentence rather than the last; and key
31 (c) could not be read part by part because its working opened a bracket,
so the row was reworded ($96 + 12 + 72 = 180$, and $2 \times 180 = 360$).

**Wrong numbers found:** none in the old pages. The old log's C5 flag says
Ex 4.2 Q3's solid (8 faces, 12 vertices) is *neither a prism nor a pyramid*;
that is not so — a hexagonal prism has those counts (now in `ANSWERS.md`).

**Fitting.** Nothing is clipped; the build reports all pages fit.
`orphans`: 0 stranded openers in 25 pages. `check-labels`: no collisions.
`fit-options`: every option row fits. Three key rows that split an equation
across a line were held together with `.nb`. Proofs of pages 2, 7, 8, 9, 15,
22 and 24 were read.

**Colour.** Pages 1, 3, 4, 6, 7, 9 and 10 were checked in greyscale and under
simulated deuteranopia, protanopia and tritanopia (`build/check-colour.mjs`).
The fractal figures are one fill against white, the solids use the three
face tints with outlines, and every view in Fig. 4.7 and every side of
Fig. 4.6 is named in text; nothing depends on hue alone.

### Short pages, logged

Each is held by a block `gaps` names, which the packer cannot move.

| page | fill | held by |
|---|---|---|
| 2 | 76% | § 4.3's `h2`, whose paragraph (four lines) is too short to go under it before Fig. 4.2 |
| 6 | 82% | § 4.7's `h2`, the same way before Fig. 4.5 |
| 11 | 58% | the last body page (`data-close`) |
| 14 | 80% | the Solved Examples stage head, which needs an example under it |
| 15 | 78% | the *Type 2* `h3` and Example 3 under it |
| 23 | 62% | **the Answers stage, which always opens a page**; the page holds the two case-based questions |
| 25 | 34% | the last page |

### Flagged, not done

- Stage 1 keeps old coaching sentences such as *the slip this question is
  watching for*, because it is kept word for word. §6a would not write them
  today.
- § 4.5 states historical facts (Kandariya Mahadev c. 1025 CE, Sierpiński
  1916, von Koch 1904, Fulani blankets, Escher's *Smaller and Smaller*) with
  no source in this log. §5a asks for one before press.
- The body's claim that there are exactly eleven cube nets, and Example 9's
  *icosahedron*, are stated, not derived; both are standard.
- The C5 and M1 flags below still stand (which solids *faces + vertices −
  edges = 2* covers; $\left(\tfrac89\right)^n$ with a letter exponent).
- Example 2 of Stage 2 introduces a plus-sign fractal the body does not
  draw. It is described in words only; a small figure would help.


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

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted.

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


## 21 September 2026 — figure/table reference review

Reviewed this chapter in the all-maths reference audit. Figures and tables now use one chapter sequence, including Beyond the Book; captions and references were updated together. Questions, calculations and artwork were preserved. The chapter and its volume were rebuilt; detailed layout checks and any remaining warnings are recorded in build/_all-maths-reference-checks/.

## 24 September 2026 — NCERT title

The chapter now carries NCERT's own title, *Exploring Some Geometric Themes*, taken from the chapter's first page in the NCERT textbook, in place of the house title it had. Changed in `chapter.json` and the opener heading in `p001.html`; nothing else in the chapter uses the title.
