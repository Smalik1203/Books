# Class 9 · Mathematics I · Chapter 5 — Exploring Circles

## Brought to the Class 7 standard, 17 September 2026

Phase 5 of `PLAN-MATHS-CONSISTENCY.md`, worked from the Chapter 6 model.
Page move, examples, Beyond the Book and answers were done in one pass, and
every check was run on the chapter.

**Pages: 47 before (34 body + 13 Beyond, Crown Quarto), 50 after (31 body +
19 Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`. The body was
refitted, and then refitted a second time after Fig. 5.8 was reprinted
beside Exercise Set 5.5 Q3 (the first fit left that page 31 mm over). Stale
body pages p032–p034 are gone; `data-close` is on p031.

**All thirteen body examples set as steps.** The working was inside each
panel as prose, `.eq` lines and `.work` rows with the result in a `.chip`.
Each is now *Solution*, Steps and *Answer*, with a *Check* row where the old
text checked the answer (Examples 3, 7, 12). A lead-in that frames the
problem stays as a paragraph before *Solution*; a remark that is not a step
stays at the foot. Example 1 (Jamuna's folds) has no question: its two folds
are Steps 1 and 2 and its last sentence is the *Answer*, words unchanged.
In Example 6 the Baudhāyana–Pythagoras sentence and its note moved to the
foot, as *Step 3 is the Baudhāyana–Pythagoras theorem…*.

**Every chip in the body is gone** (24, all in examples, all carrying a
result or a verdict — *on the circle*, *$8$ cm*). Verdicts became
`.work__why`; results went into the step (*…, which is $8$ cm*). The theorem
proofs outside the examples use `.work--list` statements with no chips and
were left as they are; the `.pop` congruence tags stay.

**Verified** by `build/check-body-maths.mjs`: 216 expressions and 106
numbers, none lost and none added.

**Language, fixed:** p005's five garbled `â` characters are em dashes again;
p006's paragraph split mid-sentence (*…$AB$ is a* / *diameter.*) is one
paragraph.

**Fig. 5.8 reprinted beside Exercise Set 5.5 Q3.** The question names
Fig. 5.8, which prints on page 17; the question is on page 20. The figure is
repeated after the question, captioned *(repeated from Section 5.7, for
Question 3)*, no renumbering. Exercise Set 5.2 Q2 and Fig. 5.5 face each
other (pages 10–11) and needed nothing.

**Figure labels moved**, in Fig. 5.8 and its reprint: *E* sat on the chord
$AB$ and *C* on the dashed perpendicular $CH$. Geometry unchanged.

**Every body figure checked against its text** from its coordinates
(Figs 5.1–5.14): points on their circles, circumcentres of Figs 5.4 and 5.5
where the text puts them (inside, outside, hypotenuse midpoint), equal
chords equal, midpoints and right angles in Figs 5.7 and 5.8, the longer
chord nearer in Fig. 5.9, $\angle ACB = 2\angle ADB$ in Fig. 5.11, equal
angles in Fig. 5.12, $E$ on both the circle and $AD$ in Fig. 5.13. All were
drawn right; none was redrawn.

**Beyond the Book rebuilt to the four stages:**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, each explained in running text | Q3 and Q5 kept word for word; **Q1, Q2 and Q4 replaced** (below); `.c-stage__for` removed; opening and closing paragraphs adjusted |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems | **16 stepped examples** under eight `Type` heads; old Problem 2 is Example 11 and Problem 5 is Example 14 unchanged; Problem 1 is Example 7 with new numbers; Problems 3 and 4 were replaced (Examples 4 and 13) |
| 3 Problem Sets → **Practice** | 3 sets, 25 questions | **one run of 31** in six forms |
| 4 Answers & Takeaways → **Answers** | key, four option notes, a closing paragraph | key, every other answer, why the options are wrong for seven |

**Stage 1 answered the body three times,** so each was replaced with a
question of the same kind:
- Q1 (a $30^\circ$ angle on the major arc, radius $8$, so the chord is $8$)
  answered Exercise Set 5.6 Q5 backwards → a $7$ cm chord seen at
  $150^\circ$ from the minor arc; find the radius ($7$ cm, through the
  reflex angle);
- Q2 (the $6$–$8$–$10$ triangle, radius $5$) was Example 3's triangle →
  sides $9$, $12$, $15$, radius $7.5$ cm;
- Q4 (the shortest chord through a point is the one at right angles to
  $OP$) was End-of-Chapter Q13's proof → a point $P$ on a $32$ cm chord of a
  $20$ cm circle with $AP = 7$; find $OP$ ($15$ cm) by drawing the
  perpendicular. **Fig. 5B.2 redrawn** for it, to scale.
Q3 now says *Example 10 in Section 5.8*, since Beyond has an Example 10 of
its own. The closing paragraph now introduces the solved examples.

**Other give-aways fixed:** old Problem 1 was End-of-Chapter Q8 with the
same numbers ($24$, $10$, $7$ apart, $r = 13$) → $24$ and $18$, $3$ apart,
$r = 15$, Fig. 5B.3 redrawn to scale; old Problem 3 was Exercise Set 5.3 Q5
and said so → Example 4 (equal chords, $\angle OCD$); old Problem 4's
rectangle-and-parallelogram options were Exercise Set 5.7 Q4's answer → the
isosceles trapezium; old Set A Q1 was End Q2, Q5 was End Q5, Q10 was
Exercise Set 5.6 Q1, Set B Q1 was End Q4's proof and Set B Q8 was Exercise
Set 5.7 Q5 — none of the old sets was kept. `check-no-repeats` reports five
pairs at 50–56%, each the same kind of question with different numbers or
run the other way.

**Audit findings (Ch05 table):**
- Stage 1's $6$–$8$–$10$ circumradius leaned on the converse of Pythagoras:
  the replacement ($9$–$12$–$15$) keeps the idea and now states the converse
  in one line as met in an earlier class, as the audit suggested.
- Problem 5 (two circles, common chord): kept as Example 14, citing
  Exercise Set 5.4 Q1 in its first step's reason, as the audit suggested.
- Gaps — symmetry, circles through points and where the circumcentre lies,
  Theorem 10: now Type 1 (Examples 1–3) and Example 12.
- The five `â` characters on p005: fixed (above).

**Worked examples in the chapter: 29** (13 body + 16 Beyond). Types:
symmetry and circles through given points; equal chords and the angles at
the centre; the perpendicular from the centre (an arch and a window); comparing chords by distance (Fig. 5B.3); angles subtended by an
arc (Fig. 5B.4, new); concyclic points and cyclic quadrilaterals;
two circles and their common chord (Fig. 5B.5); proofs (Fig. 5B.6, new).
Old Fig. 5B.5 (Set C3) went with its question.

**`ANSWERS.md` written** for Exercise Sets 5.1–5.7, the fourteen
end-of-chapter questions, the five Think and Reflect boxes, Stage 1, and all
31 practice questions.

### Verified

`check-numbers.mjs` passes **490 claims**. It evaluates 143 printed
identities (powers and square roots included), and checks each equation in
one unknown against the value the same block solves it to. It also:
- re-derives every body and Beyond example's Answer row, and the $r = 13$
  chord table on p021;
- reads every exercise answer back off `ANSWERS.md`, End Q8's radius found
  by search;
- tests Theorems 8 and 9, Stage 1 Q5 and Beyond Example 15 over many
  circles;
- measures Figs 5.1–5.14 and 5B.1–5B.6 from their coordinates;
- builds an isosceles trapezium, a kite and a right trapezium and tests
  each for a circle (Example 13);
- checks every multiple-choice question has exactly one right option,
  matching the key, and derives each assertion–reason letter;
- checks that `ANSWERS.md`'s key and practice working agree with the page.

**Break tests: 24 of 24 caught** (body answers and identities, Beyond steps
and answers, key letters, key rows a part at a time, options, `ANSWERS.md`
values and key, figure coordinates, Stage 1 values). The first run missed
three, each a wrong number added beside a right one (Beyond Example 8's
answer, key row 23, Exercise Set 5.4 Q4), so those are now checked as
phrases.

**Fitting:** nothing is clipped and nothing runs into the margin. `orphans`
finds 0 stranded openers, `check-labels` no collisions, and `fit-options`
passes. The lone Q31 on page 48 was balanced by moving Q30 across. I read
the proofs of pages 1, 20, 33, 34, 38, 40, 44 and 49 and moved labels in
Figs 5B.2 (the *7* sat on $OA$), 5B.3 (*18* and *24* on the circle) and
5B.6 (*A* on the arcs); Fig. 5B.6's caption said *dashed* of a line that
prints solid, and now names it $CBD$.

**Colour:** the figures are line drawings with lettered points; fills are
background only. Pages 2, 8, 10, 12, 17, 20, 33, 34, 38, 40, 43 and 44 were
run through `check-colour`.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 2, 9, 12, 24 | 82–87% | an example panel |
| 3, 5, 25 | 78–80% | a section head with its paragraph |
| 23 | 72% | Example 10, a panel |
| 30 | 65% | the chapter summary, a panel |
| 33 | 85% | Fig. 5B.2 |
| 34 | 72% | the Solved Examples stage head, which needs its first example |
| 36–38, 40, 42, 43 | 50–85% | a `Type` head with its example, or an example panel with its figure |
| 39 | 58% | Example 10 with Fig. 5B.4 (148 mm) |
| 47 | 51% | Q30, moved across so Q31 is not alone |
| 48 | 68% | **the Answers stage, which always opens a page** |
| 50 | 50% | the last page |

### Flagged, not done

- **Exercise Set 5.4 Q6 repeats Q3** word for word before asking more, and
  **Q7 is Example 8** with the same numbers. **Exercise Set 5.5 Q7 is half of
  Example 9**, **Exercise Set 5.6 Q6 is Example 10**, and **End-of-Chapter
  Q1 is Exercise Set 5.5 Q1** and **Q6 is Exercise Set 5.7 Q1**, word for
  word. Body questions, left; `ANSWERS.md` flags each.
- Exercise Set 5.2 Q6 (*how many such triangles*) is answered as
  *infinitely many, different in position*; it could be read otherwise.
- Stage 1 Q1 still shows that a chord equal to the radius subtends
  $60^\circ$ at the centre, which is the first half of Exercise Set 5.6 Q5;
  Example 5 shows the same thing, so it was judged no give-away.
- Stage 1 Q2 uses the converse of Pythagoras as known from an
  earlier class; confirm the earlier book teaches it.
- Examples 5 and 14 cite Exercise Set 5.4 Q1 (the perpendicular bisector of
  a chord passes through the centre) as a result, as the audit suggested.
- KaTeX breaks before a full stop after $100^\circ$ in Example 10's question
  (class-wide stylesheet matter).
- The chapter's historical remarks (Gudāhāndi rock paintings, Thales, the
  Śulbasūtra) have no source recorded.

Language edit, 47 pages (p001–p034 chapter proper, p101–p113 Beyond the Book) —
the longest chapter in the book. Build after editing: 47 pages, all pages fit,
0 stranded openers, no label collisions, every option row fits. Every worked
result re-derived — Examples 1–13, the four worked problems of Stage 1, the five
of Stage 2, and all 25 multiple-choice answers in Sets A, B and C. **Every
answer is correct**, including the odd-column table on p111 (the $40$ cm chord
at $20$ cm needs $r = \sqrt{800}$, where the other three all give $r = 25$),
Set C5's single chord, and Set C6's $B$, $C$, $E$, $F$.

**5 fixes in 47 pages.** Two of them — *earns its keep* and *commonest* — are
words this edit has now removed from six and five chapters respectively. The
language is otherwise clean, and the chapter is the best-constructed piece of
geometry in the book: twelve theorems, every one of them squeezed out of the
single sentence on p002, and the chapter says so on p033 without overclaiming.

Four things worth recording:

- **It refuses its own evidence, three times.** Example 1 has Jamuna find the
  centre by folding, then says folding "can never tell you *why* the creases
  meet at all". p018 measures two equal chords, gets equal distances, and asks
  "Is that convincing? It is the same trap as Jamuna's folded disc… A statement
  can hold in every case you have patience to try and still be false." The
  summary's eighth point is the whole method in one line: "Measuring confirms;
  only an argument explains. More than once in this chapter the measurements
  were right and still proved nothing at all."
- **It names the shapes of its own arguments.** p016 sets out the three facts
  about a chord — from the centre, through the midpoint, at a right angle — and
  observes that any two force the third. p028 names elimination as a method:
  "There were three places $D$ could be… and two of them have just been shown
  to be impossible. Nothing was proved about the third directly; it survives
  because it is the only one left."
- **It explains RHS properly, and says why it exists.** p016: two sides and a
  non-included angle usually fix nothing, "swing the third side about and there
  are commonly two different triangles" — but the right angle removes the second
  possibility, because Pythagoras fixes the remaining side. "RHS is really
  Pythagoras wearing the clothes of a congruence test."
- **It marks its debts and pays them.** p011's tip: "That last case is not a
  coincidence, and it is not proved here. Section 5.8 will hand it to you in a
  line." p026 pays half and says which half is missing. p031 has a subsection
  called *Closing an old debt*. No other chapter in the book keeps that kind of
  account.

It also states, on p007, the locus fact that Class 8 Part I Ch 5 p016 leans on
without stating — both halves, and why both are needed: "The first says that no
point of the line is missed out. The second says that no point outside it sneaks
in. Drop either half and 'the locus of' becomes the wrong phrase." That Class 8
flag stands, but the sentence it needs already exists here.

## FIXED

| before | after | check |
|---|---|---|
| **p002** "The word will earn its keep in Section 5.4" | "The word will matter in Section 5.4" | L1 — idiom; sixth chapter it has come out of |
| **p019** "Hence $AE = FH$, and doubling gives $AB = FG$." | "So $AE = FH$, and doubling gives…" | L1 |
| **p026** "It also earns its keep." | "It is useful, too." | L1 |
| **p029** "and consider the two opposite angles at $A$ and at $C$" | "and look at the two opposite angles…" | L1 |
| **p030** "catches the commonest slip here" | "catches the most common slip here" | L1 — fifth chapter for this word |

The p030 fix added a rendered line and took that page from 88% to 90%, which is
off the short-page boundary rather than towards it. No other fill figure moved.

**Considered and left: *determine*.** p009 "Three non-collinear points also
determine a triangle" and p027 "would not determine the triangle at all". Both
are the uniqueness sense — *fix, and fix uniquely* — not the "work out the value"
sense that L1 catches. *Find a triangle* would say something else, and the
chapter already uses the plain version alongside it on p008: "Two points, then,
are not enough to pin a circle down." Kept.

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p014, p016, p023, p024, p027, p029, p031, p102 | M1 | **The chapter's central proof needs Chapter 6, which comes next.** Chapter 6, *Lines and the Angles They Make*, introduces the term **exterior angle** (p015), proves the exterior-angle theorem (p016), proves that the angles of a triangle add to $180^\circ$ (p014, p020), covers linear pairs (§ "Angles That Come in Pairs") and introduces **reflex** angles (p002). Chapter 5 uses every one of those first: Theorem 9's proof on p024 turns entirely on "$\angle BCE$ is the exterior angle of $\triangle BCD$ at $C$, so $\angle BCE = \angle CBD + \angle CDB$"; the proofs of Theorems 10 and 12 (p029, p031) turn on the exterior angle again; p016 uses the linear pair; p023 uses *reflex* with no gloss; and the angle sum does the closing step of Example 5, Example 11 and the Stage 1 problem on p102. Nine of the twelve theorems rest on this. | Swap the two chapters — Chapter 6 assumes nothing from Chapter 5 — or, if the order is fixed, name the destination at each use the way p011's tip names Section 5.8. Chapter 5 is otherwise scrupulous about saying where a result comes from, which makes the silence here conspicuous. |
| p029, p031 | M1 | **The load-bearing step of two proofs is a result the next chapter states.** p029: "$\angle AEB$ is an exterior angle of $\triangle BED$, and an exterior angle is larger than either interior angle opposite it". p031 uses the same inequality ("so exceeds $\angle BCE$"). Theorems 10 and 12 are both proved by contradiction from it, so both proofs rest on it entirely. Chapter 6 p016 does state it, with its reason — "an exterior angle is greater than either interior opposite angle, since it is their sum and neither is zero" — immediately after proving the equality it follows from. So the result is properly argued; it is one chapter too late. | Nothing of its own: this is the row above, in its sharpest form. Chapter 6 already contains the sentence Chapter 5 needs, and swapping the chapters puts it where it is used. |
| p017, p022, p032, and p017→p020 | C7, M4 | **Four questions are printed twice, and in two places the answer is on the same page as the question.** (1) **p022, worst**: Exercise Set 5.5 Q7 — "A circle has radius $25$ cm. How far from the centre is a chord of length $14$ cm?" — is the second half of **Example 9 at the top of that same page**, which works it and prints $24$ cm. (2) **p032**: Exercise Set 5.7 Q1 and End-of-Chapter Q6 are word-for-word identical — "A cyclic quadrilateral has $\angle A = 75^\circ$ and $\angle B = 110^\circ$. Find $\angle C$ and $\angle D$" — and both appear on page 32, one above the other. (3) **p017**: Exercise Set 5.4 Q3 and Q6 open with the same sentence word for word; Q6 adds a second part. Same set, three questions apart. (4) **p017 Q7 → p020**: the starred Q7 ($r = 10$, chords $16$ and $12$, both arrangements) is worked out in full three pages later as Example 8, same numbers, without a word said. | Change the numbers or delete the repeat. Item (1) needs doing before print: the answer is set above the question. Item (4) is the pattern the chapter gets right elsewhere — p106's Problem 3 says "Exercise Set 5.3 asked why that fails, and here is the answer in numbers", which is exactly the sentence Example 8 and Problem 1 (see below) are missing. |
| p013, p015 | M1 | **SSS and SAS appear for the first time in the book as bare abbreviations.** p013: "So $\triangle CAB \cong \triangle CDE$, by **SSS**"; p015 the same, then SAS. Searched Class 8 and Class 9: *congruent* is used in Class 8 Part I Ch 5 and Part II Ch 7, but the strings SSS and SAS occur in no chapter before this one. RHS, which the chapter uses **third**, gets a full and very good paragraph on p016 explaining what it claims and why it holds. | One line each where SSS and SAS are first used, of the kind p016 already gives RHS. The inconsistency is what makes the gap visible: the reader is taught the least familiar of the three rules and handed the other two. |
| p017 Q2, p019 | M1 | ***Altitude* is used in an exercise instruction and is defined nowhere in the book.** Exercise Set 5.4 Q2: "Show that the **altitude** from $A$ to $BC$ passes through the centre." p019: "$CE$ and $CH$ are corresponding **altitudes** of congruent triangles." The word occurs once elsewhere in either class, in an `aria-label` on Class 8 Part II Ch 7 p005 — never in body text, never glossed. A student who does not have the word cannot begin Q2. | Either gloss it at first use or say *perpendicular from $A$ to $BC$*, which is the phrase the chapter uses everywhere else and which needs nothing. |
| p005–p010, p031, p034, p109 | M1 | ***Equidistant* is used twelve times and never introduced.** First use is p005, mid-proof: "every point of the circle would be equidistant from two different points". The chapter tags *locus*, *chord*, *subtend*, *diameter*, *minor arc*, *major arc*, *circumcircle*, *circumcentre*, *circumscribe*, *inscribed*, *arc*, *collinear*, *corollary*, *concyclic* and *cyclic quadrilateral* — fifteen terms — and leaves this one bare. It is load-bearing: the whole of Section 5.4 and Theorem 1 are stated in it. | A `<span class="term">` and four words at the first use. It should **not** be replaced: "the same distance from $A$ and $B$" is longer in all twelve places, and *equidistant* is the word the reader will meet in every exam paper. (In Class 8 Part I Ch 5 I did replace its single occurrence — there it was incidental, here it is the vocabulary of the section.) |
| p104 | C7 | **Beyond the Book Problem 1 is End-of-Chapter Q8 with the same numbers, solved in full, and does not say so.** p032 Q8: "Two parallel chords, of lengths $10$ cm and $24$ cm, lie on the same side of the centre and $7$ cm apart. Find the radius of the circle." p104 Problem 1 is that question as multiple choice, with the full working and $r = 13$. The same numbers then come back a third time in Set B Q5 (p110, Asha and Bala). | The clause p106 already uses. Stage 2 exists to explain questions the reader has tried, so re-using an end-of-chapter question is right — saying which one costs eight words and stops it reading as an oversight. |
| p022 Q2, p032 Q9 | M2 | **Two answers come out as surds in a chapter whose numbers are otherwise all Pythagorean triples.** Exercise Set 5.5 Q2: radius $7$, distance $6$, so the chord is $2\sqrt{13} \approx 7.21$ cm — the only question in that set of eight that does not resolve. End-of-Chapter Q9 is worse, because it is an instruction: "**Draw** a circle in which a chord of length $6$ cm stands $3$ cm from the centre. What must the radius be?" — $3\sqrt{2} \approx 4.24$ cm, to be set on a pair of compasses. Every worked example and every other exercise in the chapter uses 3-4-5, 5-12-13, 8-15-17, 7-24-25 or 20-21-29. | Either say the answer will not come out whole, or change the numbers. This is the same fault as Class 8 Part II Ch 7 Q9, and it has the same effect: a student who has met nothing but triples reads a surd as a mistake. |
| p001, p006 | C3 | "In earlier **grades** you worked with triangles and quadrilaterals" (p001) and "You met the answer in an earlier **grade**" (p006). Class 8's volumes say *Class*. This is the **fourth** Class 9 chapter with the same slip — Ch 1 (four places), Ch 2, Ch 4, now Ch 5. | One word, book-wide. See CROSS-CHAPTER.md. |
| p034, p113 | — | p034 is **57%** full (the twelve results plus the closing tip) and p113 is **45%** (four distractor notes). Both are exempt — p034 carries `data-close`, p113 is the last page — and both are reasonable closing leaves. **Not a fault**; recorded because the fill map makes them look like one. | Nothing, unless the twelve-result box would rather sit under the summary on p033, which is at 99%. |
