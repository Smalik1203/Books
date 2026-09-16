# Class 7 · Mathematics I · Chapter 5 — Parallel and Crossing Lines

## Beyond the Book, rebuilt 15 September 2026

**The chapter body is untouched.** A rebuild of the body to DESIGN-MATHS §5
(examples, checks, key ideas and end-of-chapter exercises added inside the
chapter) was reverted the same day at the user's request; a backup is in the
session scratchpad (`backup-class7-s5-rebuild`, and the rebuilt pages under
`rebuilt/`). No `p0xx.html` was edited for this rebuild. Only `p1xx.html`
changed.

**Beyond the Book is four stages, 10 pages (was 9), p101–p110.**

1. **Using What You Know**: the existing stage, word for word (checked by
   script against the old pages, before and after refit). Only its
   `.c-stage__for` line was deleted. Fig. 5.33 stays with it.
2. **Solved Examples**: 13 examples under five types, each set as
   *Solution*, *Step 1* … *Answer* with a short reason as a chip. The types
   are: linear pairs and vertically opposite angles, 4; parallel and
   perpendicular lines, 2; corresponding angles and the test for parallel
   lines, 4; interior angles on the same side, 2; a path that bends between
   parallel lines, 1.
   - Examples 1–3 and 5–7, 9 and 10 come from the reverted rebuild's
     Examples 1–8: 72° in Fig. 5.2, scissors, 4 times its neighbour,
     letters, rectangle, ∠1 = 70°, ladder, ∠4 = ∠6 = 108°.
   - Examples 4, 8, 11, 12 and 13 are the old stage 2's Problems 1, 2, 3, 5
     and 4, recast as steps. Each keeps its options, and its Answer row gives
     the letter.
   - Figs. 5.34 and 5.35 moved inside Examples 8 and 13, so a figure cannot
     be parted from its example. Their captions were renumbered to the new
     example numbers. No figure number clashes with the body, whose figures
     end at 5.32.
3. **Practice**: one band carrying the numeral 3, then one run of 32
   questions.

   | form | questions | numbers |
   |---|---|---|
   | multiple choice | 14 | 1–14 |
   | assertion and reason | 5 | 15–19 |
   | very short answer | 3 | 20–22 |
   | short answer | 4 | 23–26 |
   | long answer | 4 | 27–30 |
   | case-based | 2 | 31–32 |

   Sources: the reverted rebuild's end-of-chapter questions and the old
   Sets A–C. Case questions carry no *Case study* label, and the table has
   no caption. No question was written new.
4. **Answers**:
   - the letter key for 1–19;
   - a trace row for each of 20–32;
   - *Why the other options are wrong* for Questions 8, 14, 16 and 17.

   The old *Answers & Takeaways* closing paragraph and the stage 2 closing
   paragraph are gone.

**Wording brought into line with the body.** The body calls them *alternate
angles*, not *alternate interior angles*. It does not teach *adjacent* or
*supplementary*, so "any two adjacent angles" became "any two angles next to
each other". The class `hard` on the reverted Q26 was dropped, because no
question carries a difficulty mark.

**Excluded as duplicates of the body:**

- The reverted Examples 9–12, which are the body's Examples 1–4 in 5.8.
- End Q21, the set-square construction. It is Exercise Set 5.3 Q1–2.
- End Q6, the angle corresponding to ∠3, and Set A Q3, perpendicular lines
  making 90° each. The body states both in 5.6 and 5.2.
- Set A Q4, the railway rails, and Set A Q5, a transversal making 8 angles.
  The body states both in 5.3 and 5.5.
- End Q16, the name *transversal*, which is the body's definition.
- Set B Q2, three angles on a line. It is the form of Exercise Set 5.4
  Q1(i).
- Set C Q3, ∠DAC and ∠ADC to ∠CAB. It is the body's Example 4 with other
  numbers.

**Dropped as near-duplicates inside Beyond:**

- End Q4 (letter T), because of Example 5.
- End Q17 (5 times), because of Example 3 and Q10.
- End Q12 (supplementary to 107°), because of Q2.
- Set A Q2 (linear pair 38°), because of Q2.
- Set A Q8 (interior 64°), because of Q7.
- Set A Q6 (corresponding 70°), because of Example 7 and Q22.
- Set A Q7 (two perpendiculars), because of Q18.
- Set A Q9 (alternate 57°), because of Q6.
- Set A Q10 and Set C Q1 (how many sizes), because of Q30.
- Set B Q3 (A/R: opposite angles add up to 180°), because of Q16.
- Set B Q8 (∠A = 65°), because of Q26 and Example 12.
- Set C Q5 (bend of 35° and 50°), because of Q11.

**Verified by script.** `beyond-ch05-parallel-lines/numbers.mjs` in the
session scratchpad ran 142 checks, all passing. It covers:

- every angle in every example step, question, answer and *Why* row,
  reused ones included, from a model of a transversal across two lines;
- the three Beyond figures, re-measured from their SVG coordinates (30°,
  45°, 75°; 65°; 40°, 25°, 65°);
- Q28 against a parallelogram drawn to ∠BAC = 42° and ∠ACB = 58°;
- Q27 and Q30 for several angle sizes;
- the letter key, derived from each option list.

No reused item was wrong.

**Fitting.** `refit bridge` from one page gave 12 pages with four short
example pages (68–81%). Measured block heights settled the changes:

- Example 2's question lost a line; Example 3 and the ladder example went
  from three steps to two.
- Type 3 was reordered to ∠1 = 70°, Fig. 5.34, ladder, 108° test.
- Answers 27 and 30 and *Why* row 8 were shortened. The *Why* rows for 12
  and 13 were cut to hold the answers to one page.
- Trace rows were set one block each.

Final build: 26 pages, all fit, no builder violations, no `--head`/`--tail`,
every `p1xx` carries `data-bridge`. Beyond fill:

    17:96%  18:100%  19:88%  20:99%  21:96%  22:92%  23:95%  24:97%  25:94%  26:97%

`orphans` found 0 stranded openers; `fit-options` found every option row
fits; `check-labels` found no collisions. `gaps` lists only body pages 4, 9,
14 and 15, which were short before and were not touched. Proofs of pages 18,
22, 25 and 26 were viewed. The stale `build/class-7/_refit-ch05-parallel-lines.html`
was deleted.

### Flagged

- **Body figures.** Examples 1, 7 and 10 and Questions 21, 22, 24, 25, 27,
  28, 29 and 31 use body figures (5.2, 5.14, 5.21, 5.24, 5.25) for their
  angle names. Fig. 5.14 is drawn with lines that are not quite parallel;
  only its numbering is used. Q28 takes Fig. 5.25's shape with angles
  other than those printed on it.
- **Example 3.** Step 2 wraps to two lines beside its chip.
- **Stale proofs.** `build/class-7/ch05-parallel-lines-proofs/` still holds
  p027–p034 from an older 34-page build; this build writes p001–p026 only.
- **Old key.** The *Beyond the Book: Stage 1 … Set C* answer line further
  down this log describes the old stage 2 and sets, and is superseded by
  this section.

---

Written new from NCERT *Ganita Prakash*, Grade 7 Part I, Chapter 5,
*Parallel and Intersecting Lines* (textbook pages 107–126). Original LearnLab
text in NCERT's order of topics and questions; no sentence is carried over.
Crown Quarto, house design, palette `teal`.

Sections keep NCERT's numbering, with plainer names where the source's were
riddles: 5.1 Lines That Cross (*Across the Line*) · 5.2 Perpendicular Lines ·
5.3 Lines That Do Not Meet (*Between Lines*) · 5.4 Parallel and Perpendicular
Lines by Folding (*… in Paper*) · 5.5 Transversals · 5.6 Corresponding Angles ·
5.7 Drawing Parallel Lines · 5.8 Alternate Angles · 5.9 Parallel Illusions.
The source's four *Figure it Out* blocks are Exercise Sets 5.1–5.4.

## Every figure is drawn new

The source's drawings do not survive text extraction, so all 35 figures were
drawn from computed geometry (`fig5.mjs` in the session scratchpad; each
angle in a figure is the angle it is labelled). Where a source figure carried
numbers that could not be read — Figs. 5.26–5.31 above all — the values were
**chosen here**, consistent with the drawing, and the answers below are for
these figures, not the textbook's answer key. Fig. 5.31 in particular is
reconstructed: a path M–N–O–P between parallel lines, 40°, 96° and 52° given.

## Every printed number re-derived

| where | answers |
|---|---|
| 5.1 in text | $\angle a = 120^\circ$ gives $\angle b = \angle d = 60^\circ$, $\angle c = 120^\circ$ |
| Set 5.1 | linear pairs $a,b$ · $b,c$ · $c,d$ · $d,a$; vertically opposite $a,c$ and $b,d$ |
| 5.2 | four equal angles are $360^\circ \div 4 = 90^\circ$ each |
| Fig. 5.5 | FG, FH meet at the endpoint F at 115° · AB and CD cross between their endpoints · L, an endpoint of KL, is the middle of IJ · ST and UV would meet if extended · OP and QR would not |
| Fig. 5.6 | $a \parallel d$ · $b \parallel e$ · $c \parallel f$ · $g \parallel h$ |
| 5.4 folding | opposite edges parallel · neighbouring edges perpendicular · one fold: three parallel lines, the fold perpendicular to the upright edges · a fold at right angles to the creases is perpendicular to them · the diagonal: yes |
| Set 5.2 | 1–4 open · 5: line $c$ |
| 5.5 | at most four measures; $\angle 2 = \angle 4$, so the five cannot all differ |
| Set 5.3 | open (a set square slid along a ruler, or two perpendicular folds) |
| 5.8 in text | $\angle d = 120^\circ$ · Ex 1: $\angle 2 = \angle 4 = \angle 8 = 135^\circ$, $\angle 1 = \angle 3 = \angle 5 = \angle 7 = 45^\circ$ · Ex 2: $\angle b = 60^\circ \ne 70^\circ$, not parallel · Ex 3: $\angle 6 = 130^\circ$ · Ex 4: $\angle CAB = 55^\circ$, $\angle BCD = 120^\circ$, $\angle ABC = 60^\circ$ |
| Set 5.4 Q1 | $a = 48^\circ$ · $b = 52^\circ$ · $c = 81^\circ$ · $d = 99^\circ$ · $e = 69^\circ$ · $f = 48^\circ$ · $g = 122^\circ$ · $h = 75^\circ$ · $i = 54^\circ$ · $j = 97^\circ$ |
| Set 5.4 Q2 | (i) $138^\circ$ (ii) $118^\circ$ (iii) $70^\circ + 35^\circ = 105^\circ$ (iv) $100^\circ - 77^\circ = 23^\circ$ |
| Set 5.4 Q3 | (i) $x = 25^\circ$, $y = 155^\circ$ (ii) $x = 78^\circ - 53^\circ = 25^\circ$ |
| Set 5.4 Q4 | $\angle GEH = 45^\circ$ · $\angle FED = 78^\circ$ · $\angle HEF = 57^\circ$ |
| Set 5.4 Q5 | $x = 125^\circ$ · $y = 125^\circ$ |
| Set 5.4 Q6 | $\angle NOP = 56^\circ + 52^\circ = 108^\circ$ |

Beyond the Book: Stage 1 — 75° and 105°; 72° + 118° = 190°, not parallel;
30° + 45° = 75°; no crossing has 60°, 60° and 100°. Stage 2 — (a); (b) 65°;
(a) parallel; (c) 65°; (d) 110°. Set A b c d a c b c d a b; Set B a b d a c b
d b; Set C a c a b c d b.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| section names *Across the Line*, *Between Lines* | Lines That Cross, Lines That Do Not Meet | a heading a reader can find the idea under |
| — | Think and Reflect after the proof (acute or obtuse linear pairs) and after Fig. 5.17 (test Fig. 5.13 with a transversal) | closes the white on two pages; both use only what the page has just shown |
| — | the corresponding-angles *test* stated in words after Fig. 5.17 | the chapter uses it from 5.7 on and never said it as a test |
| — | Exercise Set 5.3 Question 2 | a second construction, and a line for a short page |
| — | Example 3 closes with the alternate-angle route | shows 5.8's new fact at work, and a line for the page |

## Checks

Builder: 18 body pages, 9 Beyond the Book, every page at 88% or more; the
closing page carries `data-close`. Page 20 sets 0.8 mm into the foot margin,
far inside the 12 mm clipping limit, and was left. `check-labels`, `orphans`, `fit-options` and the width probe
report nothing. Every page proof was viewed.
