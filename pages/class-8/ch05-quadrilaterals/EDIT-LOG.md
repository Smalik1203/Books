# Class 8 · Mathematics I · Chapter 5 — Four Sides, One Sum

## Syllabus audit fixes, 17 September 2026

From "Audit Class 8 Maths I Beyond". Every finding was confirmed against the
pages; only Beyond was changed.

| finding | what was done |
|---|---|
| Example 14, rhombus side 25 and diagonal 14 (Pythagoras) | replaced by a square: $OA = 2x + 1$, $OB = x + 4$; find $x$ (3), each diagonal (14 cm) and $\angle AOB$ (90°). Now Example 15. The audit's suggestion (a rectangle, $OB$ and angles) was not used: Examples 14 and 16 already work the rectangle |
| Practice Q10, rhombus perimeter from diagonals 18 and 24 (Pythagoras) | same numbers, now asks for $AO$ and $\angle AOB$ (9 cm and 90°); key stays (d); its *why the options are wrong* and `ANSWERS.md` rewritten. The audit's suggestion (a 60° rhombus's shorter diagonal) was **rejected**: it is body Exercise Set 5.6 Q10 |
| Practice Q28, rhombus side from diagonals 30 and 16 (Pythagoras) | now gives $\angle OAB = 28^\circ$ and asks for $AO$, $BO$, $\angle AOB$ and $\angle ABO$ (15, 8, 90°, 62°); the *four triangles the same* part kept |
| Practice Q29(a), length of a gate's diagonal brace (Pythagoras) | replaced, not dropped: the brace makes 37° with the bottom edge; find the angles of each triangle (90°, 37°, 53°, the top one through alternate angles). (b) and (c) unchanged |
| Stage 1 Q8, counting divisors of 360 from its prime powers (not taught) | the try is unchanged; the explanation now lists the divisors of 360 in pairs (12 pairs, 24 divisors, less 1 and 2 = 22), and the closing paragraph says why pairing misses none |
| four rods close only if the longest is less than the other three (Stage 1 Q3, Example 17, Practice Q12, Q19) | recast to use only the three-rod rule, as instructed, without touching the body. Q3: the diagonal $BD$ gives $20 < AB + BD$ and $BD < BC + CD$, so $20 < 12$. Example 17 (now 18): which braces $BD$ fit a frame 5, 6, 4, 7 (only 9 cm). Q12: which length could the diagonal $AC$ of a quadrilateral 3, 4, 6, 8 be (5 cm; key stays (d)). Q19: R now reads *a diagonal cuts a quadrilateral into two triangles, and in a triangle each side is shorter than the other two together* (key stays (a)) |
| gap: no example on convex and concave (§5.2.1) | **Example 5** added under Type 2: four angles of a pentagon 90°, 90°, 90°, 70°; the fifth is 200°, so the pentagon is concave. It does not answer Exercise Set 5.1 Q6–Q7 |

Examples 5–18 became 6–19; nothing else cites an example number. **Solved
Examples: 19** (was 18); worked examples in the chapter 26.
`check-numbers.mjs` updated (Stage 1 Q3 and Q8, Examples 5, 15, 18, key 28
and 29a, MCQ 10 and 12, AR 19; the four-rod `closes` rule replaced by the
triangle rule); every new value was broken on purpose and caught. 529
claims hold.

`refit … bridge` left Q31 alone before Answers; Q30 was moved to its page by
hand. Short pages in Beyond: page 31 (50%, the page before the case-based
pair) and page 32 (70%, the two case-based questions, before Answers, which
opens a fresh page).

**Not changed, for the coordinator:** the body uses Pythagoras at p016
Example 7 and Exercise Set 5.6 Q2–Q4.

**Pages: 33 before → 34 after** (18 body + 16 Beyond).

## Brought to the Class 7 standard, 17 September 2026

Phase 3 of `PLAN-MATHS-CONSISTENCY.md`, done against the Chapter 1 model. The
chapter was read whole before anything was changed, and every check below
was run on the chapter, not on a page.

**Pages: 30 before (19 body + 11 Beyond, Crown Quarto), 33 after (18 body +
15 Beyond, 196 × 276).** The taller page took one page off the body even
with the examples stepped. Beyond grew by four: Stage 1 now carries its own
explanations, there are 18 solved examples, and the practice runs to 31
questions in six forms.

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`. The body was
refitted once, after the examples were stepped (`refit … body`, 19 pages in,
18 out); refit removed the old `p019`. `data-close` is on `p018`, the summary.

**All seven body examples set as steps.** *Solution*, a step to a
`.work__row`, an *Answer* row, the reason in a `.work__why`. The old wide
labels (*set up*, *divide*, *the turns*, *opposite*, *gather*…) became Step
rows. Example 4, whose working was a prose sentence inside the panel, is now
two steps and an Answer (*No …*); its closing remark on the twenty-one
divisors stays as a paragraph. Example 5's *Check:* sum became Step 4.
Example 6's lead sentence (*opposite sides, so they are equal*) became Step
1's reason, and its *5(5) − 6 = 19* check became Step 5. Example 7's
hypotenuse sentence became Steps 1–2. Remarks that are not steps stay as
paragraphs after the working (Examples 2, 3, 4, 5, 6, 7). Verified by
`build/check-example-stepping.mjs`: 7 examples, 0 lost mathematics.

**One body question reworded, for its figure.** After the refit, Exercise
Set 5.5 Q9 (*In Fig. 5.8, is O the same distance …*) fell on page 14 and
Fig. 5.8 on page 13 — overleaf, not facing. The figure could not be reprinted
beside it (page 14 is 94% full) and the pages could not be moved without a
refit. The question needs nothing printed on the figure, so it now reads
*The diagonals of a parallelogram meet at O. Is O the same distance …* — same
question, no figure named. Exercise Set 5.4 Q8 names Fig. 5.6, and they sit
on facing pages 10 and 11.

**Beyond the Book rebuilt to the four current stages** (§6a):

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 8 `.c-try` questions, answered in the next stage | **the same questions, each followed by its own explanation**, word for word except as below; `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | the worked answers to stage 1 (*The same questions, worked*) | **18 stepped examples**, Examples 1–18, under eight `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, 34 questions | **one numbered run of 31**, all six forms, band carrying the numeral |
| 4 Answers & Takeaways → **Answers** | key and why the options are wrong for 16 | key; every other answer in `.work--trace` blocks; why the options are wrong for 10 questions; the *carry forward* paragraphs kept without their head |

The eight types: polygons and their diagonals; the angle sum of a polygon;
each angle of a regular polygon; exterior angles; naming a quadrilateral from
what is given; angles and sides of a parallelogram; diagonals of a rhombus,
a rectangle and a square; three rods and four. **Worked examples in the
chapter: 25** (7 body + 18 Beyond). Every section of the chapter has a type.

**Stage 1.** The old Stage 2 was *The same questions, worked*, so each
explanation was moved under its own question as running text, word for word,
dropping only the `.c-solution` wrapper and its title. The two old closing
paragraphs (*The fourth and fifth questions …*, *For the rest …*) now close
the stage. The paragraph *The last question has a short answer …* is advice
for before trying, so it moved to the stage's opening. *Try each one before
turning the page* now reads *before reading what follows it*.

**Old practice not carried over.** The 34 questions of Sets A–C were
replaced, not reworded, because several repeated or answered the body (below)
and the rest were all one form. Two were kept in spirit as new questions with
new numbers (rods that will not close; the rhombus from its diagonals).

### Give-aways found and fixed

`build/check-no-repeats.mjs` reports 35 pairs at 50% or more; every one was
read and is *same type, different numbers* (regular-polygon angles, sides
from an angle sum, rhombus diagonals). Reading every value Beyond prints
against the body's exercise list found these, which the tool cannot see:

| where | printed | answered | now |
|---|---|---|---|
| Stage 1 Q7 | *only three regular polygons fill a point: triangle, square, hexagon* | Ex 5.3 Q10, word for word | replaced by one of the same kind: a triangle, a hexagon and two copies of a third polygon meet at a point — the third is the square |
| Stage 1 Q5, explanation | *the diagonal joining the other two vertices falls outside … the one from the reflex vertex to the vertex opposite lies inside* | Ex 5.1 Q7 (*which one, and why*) | the two identifying phrases deleted: *one of its diagonals falls outside … the other one lies inside*; *the reflex angle is divided* became *the angles at its two ends are divided* |
| old A3, A11, C7, C9 | decagon exterior $36^\circ$; 12-gon exterior $30^\circ$; 20-gon $162^\circ$ and $18^\circ$; octagon $135^\circ$ | Ex 5.3 Q1 (iii); Ex 5.2 Q4 (iii), Q7; Ex 5.2 Q4 (iv), Ex 5.3 Q4; Ex 5.2 Q4 (i), Ex 5.3 Q6 | dropped |
| old B2, B7, C5 | ratio $1:2:3:4$; exterior a fifth of interior; $1000^\circ$ | Ex 5.2 Q5; Ex 5.3 Q7; Ex 5.2 Q3 (iv) | dropped |
| old B1 | $144^\circ$ gives 10 sides | Ex 5.2 Q10 (nearest value below $145^\circ$) | dropped |

The new questions were chosen to avoid every regular-polygon value the body
asks for (8, 9, 10, 12, 18, 20 and 72 sides; exterior angles of 45, 30, 18,
5; 11 sides for Ex 5.2 Q10) and every diagonal count it asks for (6, 8, 10,
12 sides; 35 diagonals). A first draft of the Stage 1 replacement used a
square, a hexagon and a regular 12-gon; that prints $150^\circ$ for the
12-gon, which answers Ex 5.2 Q4 (iii) and Q7, and was not used.

Multiple-choice key: 15 questions, letters spread a 3, b 4, c 4, d 4;
assertion–reason 16 (d), 17 (c), 18 (b), 19 (a).

**`ANSWERS.md` written** for every question the chapter sets: the six
exercise sets (with what each drawing must show and a worked instance where
answers vary), the Think and Reflect, Stage 1 (pointing to its own
explanations), and the 31 practice questions with their working.

### Verified

`check-numbers.mjs` is kept beside the pages. It passes **509 claims**. It
evaluates 236 printed identities on the pages and in `ANSWERS.md`, 39 of
them equations in one letter checked by putting in the value the working
goes on to find; checks that every *= 110, so 110°* restates the value its
working reached; re-derives the angle-sum table, the body examples' Answer
rows, every body exercise answer in `ANSWERS.md` (read back set by set and
part by part), the Stage 1 results (by search: the only $n$ with equal sums,
the third tiling polygon, the 22 whole-number angles), all 18 Beyond Answer
rows, and every practice answer read back out of the key one lettered part
at a time. Every multiple-choice question is solved and must have exactly
one right option matching the key; the assertion–reason letters are derived;
`ANSWERS.md`'s key must match the page's. The spans it skips are angle
names, labels and the formulae in $n$; `--skipped` lists them.

**Tested by breaking values on purpose** (in a scratch copy): Example 3's
$5x = 440$ changed to 450; key 13 changed to (b); `ANSWERS.md` 5.5 Q1 (iii)
52 → 62; key 30 (c) 85 → 75; Beyond Example 14's answer 48 → 46; practice
Q14's option 13 → 14; the angle-sum table's heptagon 900 → 960; `ANSWERS.md`
5.3 Q3's 125 → 135; `ANSWERS.md` 5.1 Q4 (iii) 35 → 36; `ANSWERS.md` key
5 (c) → (d); key 27's restated sum 6120 → 6210. **All eleven caught — but
three only after the check was fixed.** The first run missed 5.5 Q1 (iii)
and 5.3 Q3, because the changed number still appeared elsewhere in the same
item (the other angle of the pair; the check-sum line), and missed key 27,
because 6120 was still in the identity before it. Those items are now
compared as exact ordered lists, and the *so N°* restatement is checked
everywhere.

**No wrong number found.** Every value in the body, the old key and the new
material re-derives. $147\tfrac{3}{11}^\circ$ (Ex 5.2 Q10, nearest above
145) is in `ANSWERS.md` only.

**Fitting.** `build.mjs --png`: all 33 pages fit, nothing clipped or into
the margin. `orphans`: 0 stranded openers. `check-labels`: no collisions.
`fit-options`: every option row fits. Proofs of pages 6, 9, 13, 16, 21, 22,
30, 31 and 32 were read. Stage 1's last question sits at the foot of page 21
with its explanation overleaf on page 22; `.c-try` is not an opener, and the
space under it is the room for the attempt, so it was left.

**Colour.** Pages 1, 2, 3, 5, 8, 10, 13, 15 and 17 were run through
`build/check-colour.mjs`; 8 and 13 were read in greyscale and deuteranopia.
The figures are black line drawings: equal angles are marked by single and
double arcs, equal segments by single and double ticks, and every figure's
parts are named in text. Nothing depends on hue.

### Short pages, logged

Each is held by a block `gaps` names, which the packer cannot move.

| page | fill | held by |
|---|---|---|
| 1 | 78% | the opener; the next page opens with § 5.2's `h2` |
| 2 | 82% | § 5.2.2's `h3`, which may not be stranded |
| 5 | 86% | Example 1, a panel |
| 6 | 76% | Exercise Set 5.2's band, which needs five lines under it |
| 15 | 82% | Example 7, a panel |
| 17 | 67% | the summary box, indivisible |
| 18 | 67% | the last body page (`data-close`) |
| 23 | 83% | a `Type` head with its example |
| 25 | 87% | a `Type` head with its example |
| 33 | 50% | the last page |

### Flagged, not done

- **Pythagoras, still ahead of its volume** (see the older flag below). The
  body uses it in Example 7 and Ex 5.6 Q2–Q4. Beyond now uses it in the same
  way in Example 14 and practice Q10, Q28 and Q29 (a), so that the chapter's
  own diagonal questions are worked; if the author moves the body's, these
  move with them.
- **Fig. 5.8's caption answers Ex 5.5 Q9** (C7): *It is not generally the
  same distance from all four vertices — that happens only in a rectangle.*
  Not changed; a body caption.
- **Ex 5.6 Q1 (iii)** (*diagonals cross at right angles*): `ANSWERS.md`
  includes the kite, which is true, but the body never states it of a kite.
  And Q1 (ii) is also true of an isosceles trapezium, which the chapter does
  not name. Worth a line in the body or a narrower question.
- **Ex 5.5 Q9 reworded** (above) — the author may prefer Fig. 5.8 reprinted
  beside it after a hand-fit instead.
- Beyond Example 10 uses the converse *interior angles on the same side add
  to 180°, so the lines are parallel*, from Class 7; the chapter uses only
  the forward direction.
- Stage 1 keeps its old coaching sentences (*the habit worth forming*, *the
  move worth keeping*) and its reference *The count of divisors comes from
  Chapter 2*, because it is kept word for word.
- Page 13: KaTeX breaks the line before *, and at B*, leaving a comma at a
  line start. Pre-existing.
- The chapter carries no *Did you know?*; the dropped Stage 1 item's
  *floor tiles and honeycombs* and old *bathroom floors* went with it. No
  facts need sources.

---

Language edit, 30 pages (p001–p019 chapter proper, p101–p111 Beyond the Book).
Build after editing: 30 pages, 0 stranded openers, no label collisions, every
option row fits. All 34 answers in Stage 4 checked against the questions — all
correct, including the three that need Pythagoras and the divisor count in C1.

13 fixes in 30 pages. As clean as Chapter 4, and for the same reasons: the
argument is carried by pictures, the family of quadrilaterals is presented as
conditions stacking rather than six shapes to memorise, and § 5.8 ties the whole
chapter back to the four pinned rods it opened with. The one fact it has to
assume — that a triangle's angles add to $180^\circ$ — is signposted honestly on
p004 as "assumed here and proved in Class 9".

That honesty is what makes the main flag below stand out: the same chapter uses
Pythagoras in a worked example and five exercise questions without any such
note, and Pythagoras is taught in **Mathematics II**, the volume after this one.

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted. The rewording of Exercise Set 5.5 Q9 is kept in place of a reprint of Fig. 5.8, because the figure's caption states the answer.

## FIXED

| before | after | check |
|---|---|---|
| **p006** "The formula runs backwards just as readily." | "…just as easily." | L1 |
| **p014** "$\angle A$ and $\angle B$ are co-interior and add to a straight angle" | "…are interior angles on the same side and add to a straight angle" | M1 — *co-interior* is British usage the book never introduces; the replacement is the phrasing Class 7 met |
| **p016** "a point equidistant from the two ends of a segment" | "a point the same distance from the two ends of a segment" | L1 |
| **p018** "a roof truss, a pylon, a crane jib or the frame of a bicycle" | "…a crane's arm…" | L1 — *jib* is trade vocabulary |
| **p101** "the rule that four lengths must satisfy" | "the rule that four lengths must obey" | L1 |
| **p103** "So the two curves cross once, and they cross at four." | "So the two totals meet once, and they meet at four." | C1 — nothing here is a curve; both sums are straight-line counts, and the word invites a picture the chapter never draws |
| **p103** "It is the triangle inequality with one more rod" | "It is the three-rod rule with one more rod added" | M1 — the rule is Class 7's, but the name is not, and the plain version is already stated in the sentence before |
| **p110** "the commonest slip in this set" | "the most common slip in this set" | L1 |
| **p110** "That is the commonest wrong answer in a set like this" | "That is the most common wrong answer…" | L1 |

**Considered and left.** p012's "The six names are a convenience, not a
classification" — *classification* is a heavy word, but the plain rewrite ran
p012 one line long and the sentence that follows it ("Most quadrilaterals have
no name at all") already does the explaining. Reverted; the page is back at 98%.

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p017 Example 7, Exercise 5.6 Q2–Q5, and Set B Q4 and Q8 | M1 | **Pythagoras is used five pages before the book teaches it, and in the wrong volume.** Example 7 finds the side of a rhombus from its diagonals with "each side is the hypotenuse of a right-angled triangle whose legs are half of each diagonal", then $8^2 + 6^2 = 100$. Exercise 5.6 Q2, Q3, Q4 and Q5 all need the same theorem, as do two of the multiple-choice questions. Class 8 **Mathematics II** Chapter 2 (Two Squares Make One) is where Baudhāyana's theorem is taught — a different book, later in the year. The word *hypotenuse* also arrives unglossed. Contrast p004, which says plainly of the triangle angle sum: "One fact is assumed here and proved in Class 9." | Either the same one-line signpost here, or move these questions to after Mathematics II Chapter 2. This is a sequencing decision across two volumes, so it is the author's. |
| p016 | M3 | The rhombus diagonal proof turns on a result never stated: "a point equidistant from the two ends of a segment lies on its perpendicular bisector." That locus fact is the whole load-bearing step for *the diagonals of a rhombus meet at right angles*, and it appears once, mid-sentence, as though the reader had it. | State it as a result before using it, or prove the right angle from the congruent triangles the chapter has already built — which is how the rectangle case two paragraphs later is done. |
| p003 | C5 | "Counting them is a piece of Chapter 2's arithmetic." Chapter 2 is powers and standard form; its counting section (§ 2.6) is about independent choices multiplying, which is not what counting diagonals does — the $n(n-3)$ count needs the halving-for-double-counting move, and that appears nowhere in Chapter 2. The reference sends a reader to the wrong place. | Drop the reference or name the actual idea. The argument given right after it is complete and needs no borrowing. |
| p008, built page 8 | — | Page 8 runs 1.9mm into the bottom margin. **Not caused by this edit** — p008.html was not touched. It is under the builder's 12mm clipping threshold, so nothing is cut off, but it was shipping that way before today. | One line out of p008, or leave it; recording it so it is not mistaken for a language edit later. |
| p013 | M2 | "So triangles $ABC$ and $CDA$ have two pairs of equal angles and the side $AC$ between them in common. That makes them congruent." The criterion is ASA, and the chapter neither names it nor says which of the Class 7 criteria is being used. A student who has forgotten the criteria cannot check the step, and the step is the one everything about the parallelogram rests on. | Name the criterion. One phrase. |
