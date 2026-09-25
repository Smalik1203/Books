# Class 9 · Mathematics I · Chapter 6 — Lines and the Angles They Make

## Solved examples in examination formats, 23 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 14 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-9/ch06-lines-and-angles/`.

Source `build/jee-class9.mjs`; check `build/check-jee-class9.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p114; the answers stage still opens a fresh page.

Also, same day. Practice p112: its last block moved to p113 (settle.mjs), which had room; no words changed.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) $67.5^\circ$ |
| 2 | Single correct | (b) $71^\circ$ |
| 3 | Single correct | (c) $145^\circ$ |
| 4 | Single correct | (d) $85^\circ$ |
| 5 | Single correct | (a) $84^\circ$ |
| 6 | Single correct | (b) $60^\circ$ |
| 7 | Multiple correct | (a), (b), (c) |
| 8 | Multiple correct | (a), (b), (d) |
| 9 | Multiple correct | (b), (c), (d) |
| 10 | Multiple correct | (a), (b) |
| 11 | Numerical answer | 108 |
| 12 | Numerical answer | 70 |
| 13 | Numerical answer | 30 |
| 14 | Matching | (d) P–3, Q–4, R–2, S–1 |
| 15 | Matching | (a) P–3, Q–4, R–1, S–2 |


## Brought to the Class 7 standard, 17 September 2026

Phase 5 of `PLAN-MATHS-CONSISTENCY.md`, worked by hand as the model for the
other seven Class 9 chapters. Page move, examples, Beyond the Book and
answers were done in one pass, and every check was run on the chapter.

**Pages: 30 before (20 body + 10 Beyond, Crown Quarto), 35 after (19 body +
16 Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`, and the body was
refitted once.

**All ten body examples set as steps.** Class 9's examples are not
question-only panels, as Class 10's were. The working is already inside
the panel, but as prose and `.eq` lines; Examples 5 and 7, and the proofs
outside the examples, use `.work` rows with the reason in a `.chip`.
Each example is now *Solution*, Steps and *Answer*, with a *Check* row where
the old text checked the answer. A remark that is not a step stays at the
foot of the panel. Example 10 (a proof) is one statement to a row.
- The coaching line in Example 5, *Take them one at a time, and name the
  reason each time*, went: the reason column now does what it said.
- Example 7's lead-in (*As it stands there is nothing to work with…*) stays,
  as a paragraph before *Solution*.
- The Think and Reflect after Example 7 said *the third line of the proof*;
  it now says *its Step 5*.

**Every reason chip in the body is now a `.work__why`**, including the
theorem proofs outside examples (vertically opposite angles, alternate and
co-interior angles, the angle sum, the exterior angle). Class 9 had 118
chips doing a reason's job and no `.work__why` at all. The class and the
words changed, nothing else. The proofs keep their bare row numbers.

**Verified** by `build/check-body-maths.mjs`: 216 expressions and 40
numbers, none lost and none added. The tool now treats a bare row number
(`<span class="work__label">1</span>`) as a label, because Example 7's rows
1–3 became Steps 1–3.

**Fig. 6.7 redrawn.** As drawn, A, E and C lay almost in a straight line, so
the figure showed $\angle AEC$ near $180^\circ$ and $\angle ECD$ near
$146^\circ$, against the example's $75^\circ$ and $31^\circ$. $E$ now sits
to the right of $A$ and $C$, and the drawn angles are $44^\circ$,
$31^\circ$ and $75^\circ$ (checked from the coordinates by
`check-numbers.mjs`). The text is unchanged.

**Fig. 6.3 reprinted inside Example 1.** The example names *Fig. 6.3
(right)*, which prints on page 3, a recto, with the example overleaf on
page 4. The right-hand half is repeated in the panel, captioned *(repeated
from Section 6.3, for Example 1)*, with no renumbering.

**Summary item 10:** *an hard figure* → *a hard figure*.

**Beyond the Book rebuilt to the four stages:**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, each explained in running text | Q2 and the opening kept word for word; **Q1, Q3, Q4 and Q5 replaced** (below); `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems | **14 stepped examples** under eight `Type` heads; old Problem 3 is Example 11, Problem 1 is Example 5 and Problem 2 is Example 9, both with new numbers; Problems 4 and 5 were replaced |
| 3 Problem Sets → **Practice** | 3 sets, 25 questions | **one run of 31** in six forms |
| 4 Answers & Takeaways → **Answers** | key and why four options are wrong | key, every other answer, why the options are wrong for eight |

**Stage 1 answered the body four times,** so the no-give-away rule won
(DESIGN-MATHS §6a), and each item was replaced with one of the same kind:
- Q1 was Example 10 with $\angle A = 50^\circ$ → the angle between the
  bisector and the altitude from $A$, $\tfrac{1}{2}(\angle B - \angle C)$
  (Fig. 6B.2, new);
- Q3 was Exercise Set 6.2 Q6 and End-of-Chapter Q14 (bisectors of
  co-interior angles) → the four bisectors at a crossing make two
  perpendicular lines;
- Q4 was End-of-Chapter Q12 word for word (co-interior angles adding to
  $174^\circ$) → two parallel mirrors send a ray out parallel to itself
  (Fig. 6B.4, new);
- Q5 was End-of-Chapter Q11 (exterior bisectors) → one interior and one
  exterior bisector meet at $\tfrac{1}{2}\angle A$.
Q2's figure is renumbered Fig. 6B.3. The closing paragraph was rewritten to
describe the new five.

**Other give-aways fixed:** old Problem 2 was Exercise Set 6.3 Q2 (ratio
$2 : 3 : 4$), now $3 : 5 : 7$; old Problem 1's option (d) printed $x = 38$
and $91^\circ$, the answer to Exercise Set 6.1 Q3, now other numbers; old
Problem 4 was Example 10 with a number; old Problem 5 (equal co-interior
angles between parallels are $90^\circ$) half-answered Exercise Set 6.2
Q3 (ii) and was replaced; Set C Q3 is now Example 14 and left Practice.
`check-no-repeats` reports five pairs above 50%, each the same kind of
question with different numbers or a different pair of angles.

**Worked examples in the chapter: 24** (10 body + 14 Beyond). Every topic
has a type: complements and supplements; linear pairs, vertically opposite
angles and angles round a point; angles with parallel lines; proving lines
parallel, including through a third line (the audit's one gap for this
chapter); the angle sum; the exterior angle theorem; drawing a line that
was not given (Fig. 6B.5, new, $E$ outside the parallels); proofs.

**`ANSWERS.md` written** for Exercise Sets 6.1–6.3, the seventeen
end-of-chapter questions, the three Think and Reflect boxes, Stage 1, and
all 31 practice questions.

### Verified

`check-numbers.mjs` passes **320 claims**. It evaluates 88 printed
identities, and checks every equation in one unknown against the value the
same example, key row or `ANSWERS.md` item solves it to. It also:
- re-derives each body and Beyond example's Answer row;
- reads every exercise answer back off `ANSWERS.md`, including End Q13's
  count of ten by search;
- tests Example 10, End Q11 and Stage 1 Q1 and Q5 over hundreds of
  triangles;
- measures Figs 6.7, 6B.2, 6B.4 and 6B.5 from their coordinates against the
  angles they are printed with;
- checks every multiple-choice question has exactly one right option,
  matching the key, and derives each assertion–reason letter;
- checks that `ANSWERS.md`'s key and practice working agree with the page.

**Break tests: 13 of 13 caught** (body answers, a Beyond step, key letters,
key rows, a lettered part, an option, `ANSWERS.md` values and key, a figure
coordinate). The first run missed two:
- Example 12's $k$ was checked row by row, so the row that uses $k$ never
  saw the row that solves it. An example is now one block, and a letter
  solved twice in one block (Example 5's wrong-reading remark) is tried
  with each value;
- key row 26 still held "96" elsewhere after the break, so it is now
  checked as a phrase.

The check also found Example 2's remark set up a wrong reading without
finishing it; it now ends *gives $x = 26$*, which is option (d).

**Fitting:** nothing is clipped and nothing runs into the margin (page 32
ran 3.7 mm until its last question was settled forward). `orphans` finds 0
stranded openers, `check-labels` finds no collisions, and `fit-options`
passes. Two Beyond labels were moved by hand after reading the proofs
(Fig. 6B.2's 40°, Fig. 6B.5's 30° and ?). I read the proofs of pages 4, 12,
16, 20, 22, 29 and 34.

**Colour:** the figures are black line drawings with lettered points; no
meaning rests on a tint. Pages 4, 12, 20, 22 and 29 were run through
`check-colour`.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 5 | 87% | a Think and Reflect, a panel |
| 6 | 80% | Example 3, a panel |
| 7 | 83% | the § 6.5 head with its paragraph |
| 13 | 82% | Fig. 6.8 |
| 15 | 74% | Example 9, a panel |
| 16 | 86% | a Think and Reflect, a panel |
| 18 | 62% | the chapter summary, a panel |
| 19 | 48% | the last body page (`data-close`) |
| 23 | 68% | the Solved Examples stage head, which needs its first example under it |
| 24–26, 28 | 69–75% | a `Type` head with its example, or an example panel |
| 30, 33 | 80–83% | practice blocks too tall for the gap |
| 34 | 70% | **the Answers stage, which always opens a page** |
| 35 | 44% | the last page |

### Flagged, not done

- **End-of-Chapter Q4 is ambiguous.** With the usual lettering,
  $\angle AGH$ and $\angle GHD$ are alternate angles and equal, so a ratio
  of $5 : 4$ is impossible. `ANSWERS.md` answers it as co-interior
  ($100^\circ$, $80^\circ$) and says so. It needs a figure or a letter
  changed, which is a body edit.
- **End-of-Chapter Q14 repeats Exercise Set 6.2 Q6** word for word, then
  asks the reader to compare the two workings. A body question, left.
- **End-of-Chapter Q7's answers are thirds of a degree**
  ($63\tfrac{1}{3}^\circ$ and so on). Correct, but unusual for the form.
- **The chapter's historical remark** (p015, non-Euclidean geometries in
  the nineteenth century) has no source recorded.
- Stage 1's mirror question states the law of reflection as a given; it is
  not taught in this chapter.

Language edit, 30 pages (p001–p020 chapter proper, p101–p110 Beyond the Book).
Build after editing: 30 pages, all pages fit, 0 stranded openers, no label
collisions, every option row fits. Every answer re-derived — Examples 1–10, all
six Exercise Set 6.1 questions, six of 6.2, six of 6.3, seventeen end-of-chapter
questions, the five Stage 1 problems, the five worked problems of Stage 2, and
all 25 multiple-choice answers. **Every answer is correct**, including Example
10's $\angle QOR = 90^\circ + \tfrac{1}{2}\angle P$ and its mirror in
end-of-chapter Q11, Q13's count of ten triangles, Q15's forced $60^\circ$, and
Set C6.

**5 fixes in 30 pages**, and the register is the plainest in Class 9. The
standard defect words are simply absent: no *hence*, *thus*, *determine*,
*obtain*, *utilise*, *tabulate*, *arbitrary*, *commonest* or *earns its keep* in
thirty pages — and, alone among the Class 9 chapters so far, **not one "Grade"**.
It says *primary school* and *this chapter* and leaves it there.

Four things worth recording:

- **It says on page one what it will not accept as proof, and then keeps to
  it.** "A protractor can check a hundred triangles; it cannot check the
  hundred-and-first." Then p005, at the point where a textbook usually stops:
  "This is the point at which a textbook can either say 'you will find that they
  are always equal' and move on, or stop and ask *why*. We stop." And p014 on
  the torn paper corners: "a fine demonstration and not a proof. It shows that
  one triangle behaves that way. Here is why every triangle must."
- **It marks the axiom as an axiom and says why one is needed.** p009: "This one
  we do not prove… Something has to be assumed about parallel lines before
  anything can be deduced about them, and this is the cleanest thing to assume."
  Then p015 draws the consequence honestly: "the angle sum of a triangle rests
  on the axiom about parallels, and on nothing else. Change that axiom and the
  $180^\circ$ changes with it. That is not an idle remark."
- **It separates the names from the claims.** § 6.5 gives the four position
  words and then p009 warns: "Not one of these four names says anything about
  size… they apply just as well to the messy figure you get when $m$ and $n$ are
  nowhere near parallel. In that case corresponding angles are simply unequal,
  and there is nothing wrong with the figure." The tip beside it reads "Four
  position words, no promises."
- **It tests its own formula at the edges.** p017, after Example 10: equilateral
  gives $120^\circ$; flatten the triangle and $\angle QOR$ "falls towards
  $90^\circ$ without ever arriving"; open it out and it climbs towards
  $180^\circ$. "A formula that survives its own extreme cases is usually right,
  and one that does not is certainly wrong."

Two small things it gets right that most books do not: p003 makes
*complementary* a fact about numbers rather than a picture — "$30^\circ$ in
Delhi and $60^\circ$ in Chennai are complementary" — and p013's second Think and
Reflect asks what the four named pairs still tell you when the transversal is
perpendicular, with the hint that "the theorems are all still true — they have
simply stopped being informative. That is worth noticing about theorems in
general."

## FIXED

| before | after | check |
|---|---|---|
| **p004** "Why is this true? **Because** the two outer arms make a straight line, **so** turning from one of them to the other is a turn of $180^\circ$" | "Why is this true? The two outer arms make a straight line, so turning…" | L3 — *because … so* is a doubled conjunction; nobody says it at the board |
| **p010** "…supplementary rather than equal, **and** reading a co-interior pair as equal produces an answer that looks perfectly reasonable and is wrong." | "…supplementary rather than equal. Reading a co-interior pair as equal produces…" | L4 — two ideas in one sentence, split at the join |
| **p020** "turns an **intractable** figure into two ordinary ones" | "turns a **hard** figure into two ordinary ones" | L1 — and it is the chapter's own word: p013 says "turned one hard figure into two easy ones" |
| **p109** Set C Q3 option (d) "not determined" | "cannot be found" | L1 — the wording Chapter 5's option lists already use |

No fill figure moved except p020, 62% → 60%; it carries `data-close` and is
exempt.

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p012 vs p019 Q10 and Q12 | C4 | **Two end-of-chapter questions ask for the one thing the chapter says it will not do.** p012, Example 6: "For any other value of $x$ the lines meet somewhere, and the algebra even tells you on which side, **though we will not chase that here**." Then Q10: "Are $m$ and $n$ parallel? If they meet, **on which side of the transversal** do they meet?" And starred Q12: "Show that the two lines meet, and that they do so **on that same side** of the transversal." The argument does exist — Stage 1 gives it in full on **p103**, and gives it well ("On the other side the two angles would be $186^\circ$ between them, more than the whole angle sum, and no triangle could close") — but that is eighty-four pages of reading later, in Beyond the Book, after the exercises the student is doing. | The p103 argument is two sentences. Put it at Example 6, where the chapter raises the question and declines it, and the two questions become fair. Or, if it is meant to be withheld, drop *on which side* from both questions. As it stands the chapter withholds a method and then sets it. |
| p101, p102, p103 vs p014, p017, p019 | C7, M4 | **Four of the five Stage 1 questions are already in the chapter, and Stage 1 says they are not.** The stage opens "Every question below can be answered from that list alone. What is new is that the question no longer says which item to reach for." In fact: Try 1 (p101, bisectors of $\angle B$ and $\angle C$, $\angle BOC = 90^\circ + \tfrac{1}{2}\angle A$) **is Example 10 on p017**, worked in full with the same result; Try 3 (p102, bisectors of a co-interior pair meet at right angles) is Exercise Set 6.2 Q6 *and* end-of-chapter Q14; Try 4 (p103, co-interior angles adding to $174^\circ$) is end-of-chapter Q12, same number; Try 5 (p103, exterior bisectors) is end-of-chapter Q11, which itself says "Compare this with the result of Example 10". Then p104 sums up: "Not one of them named a result, and not one of them needed a result the chapter had not already proved" — true, and it does not mention that four of the five were already set. | Say so, in the clause Chapter 5 uses correctly on its p106: "Exercise Set 5.3 asked why that fails, and here is the answer in numbers." Stage 1 re-working questions the reader has tried is exactly what the stage is for; claiming they are new is what makes it a fault rather than a design. |
| p014 Q6 vs p019 Q14 | M4 | **The same proof is set twice, and its cross-reference is ambiguous.** Exercise Set 6.2 Q6: "Two parallel lines are cut by a transversal. Prove that the bisectors of a pair of co-interior angles meet at right angles." End-of-chapter Q14: the same sentence, plus "Compare your working with **Question 6** and say which property of the pair each proof rests on." But there is also an **end-of-chapter Q6** — "Prove that if a transversal cuts two parallel lines, the bisectors of a pair of corresponding angles are parallel to each other" — which is about bisectors too, and which makes "which property of the pair each proof rests on" read perfectly (corresponding angles are *equal*, co-interior are *supplementary*). Both readings are live, and the second is almost certainly the one meant. | Say which set: "Exercise Set 6.2, Question 6" or "Question 6 above". It is the only cross-reference in the chapter that does not name its set, and it lands on a plausible wrong question. |
| p019 Q7 | M2 | **The answers are recurring thirds, in a chapter where every other answer is whole.** "In triangle $ABC$, $\angle A - \angle B = 15^\circ$ and $\angle B - \angle C = 25^\circ$. Find all three angles." Then $3\angle B = 190^\circ$, giving $\angle B = 63\tfrac{1}{3}^\circ$, $\angle A = 78\tfrac{1}{3}^\circ$, $\angle C = 38\tfrac{1}{3}^\circ$. Every other angle in the chapter is a whole number of degrees except Example 8's $47.5^\circ$/$45^\circ$/$87.5^\circ$, which are halves and land cleanly. Two of the starred questions (Q13, Q15) are explicitly *about* whole numbers of degrees, so the reader has every reason to expect one here. | A student who gets $63.33\ldots$ will assume an arithmetic error and start again. Either warn that it does not come out whole, or change one difference — $\angle B - \angle C = 24^\circ$ gives $63^\circ$, $78^\circ$, $39^\circ$. (I have not changed it: it is a number.) |
| p010 | C5 | **A forward reference to chapters that do not exist.** "Every proof of parallelism in this book, and in **the chapters on quadrilaterals to come**, ends by producing a pair of equal corresponding angles." Class 9 runs: coordinates, linear polynomials, world of numbers, algebraic identities, circles, lines and angles, probability, sequences. There is no quadrilaterals chapter, here or later; the quadrilaterals chapter is **Class 8 Part I Chapter 5**, which the reader has already done. | Name Class 8 Part I Chapter 5 and put it in the past tense, or point at Class 10. This is the **fourth** dangling forward reference in Class 9 — Ch 1 cites chapters on integers and decimals that do not exist, Ch 2 cites "the chapter on linear equations" and mis-titles Ch 8, and now this. See CROSS-CHAPTER.md. |
| p019 | — | **The starred questions use a different markup convention from the rest of the chapter and half the book.** Q11–Q17 are marked with `<ol class="c-questions c-questions--starred">`; Chapter 5, Chapter 1 and the Class 8 volumes mark hard questions with `<li class="hard">`. Both classes are defined and both build clean, and Chapters 2, 3 and 4 also use `--starred`, so the book is split down the middle on this. **Not a language fault**; recorded because a reader comparing two chapters sees two different things meaning the same thing. | One convention. `--starred` marks a whole list and `hard` marks one item, so they are not interchangeable where a set mixes hard and ordinary questions — which is most sets. |
| p020, p030 | — | p020 is **60%** full (the ten-point summary) and p110 **79%**. Both are exempt — `data-close` and the last page. Not a fault; recorded so the fill map is not misread. | Nothing. |


## 21 September 2026 — figure/table reference review

Reviewed this chapter in the all-maths reference audit. Figures and tables now use one chapter sequence, including Beyond the Book; captions and references were updated together. Questions, calculations and artwork were preserved. The chapter and its volume were rebuilt; detailed layout checks and any remaining warnings are recorded in build/_all-maths-reference-checks/.
