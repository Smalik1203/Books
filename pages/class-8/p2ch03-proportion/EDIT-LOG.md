# Class 8 · Mathematics II · Chapter 3 — What Stays the Same

## Solved examples in examination formats, 23 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 16 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-8/p2ch03-proportion/`.

Source `build/jee-class8.mjs`; check `build/check-jee-class8.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p113; the answers stage still opens a fresh page.

Fitting, same day. Practice p111: its last block moved to p112 (settle.mjs), which had room; no words changed.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) 12 |
| 2 | Single correct | (b) ₹490 |
| 3 | Single correct | (c) ₹1400 |
| 4 | Single correct | (d) 225 km |
| 5 | Single correct | (a) 5 hours |
| 6 | Single correct | (b) 6 hours |
| 7 | Multiple correct | (a), (b), (d) |
| 8 | Multiple correct | (a), (b) |
| 9 | Multiple correct | (a), (b), (c) |
| 10 | Multiple correct | (a), (b), (c), (d) |
| 11 | Numerical answer | 12 |
| 12 | Numerical answer | 2160 |
| 13 | Numerical answer | 3.2 |
| 14 | Matching | (c) P–2, Q–3, R–4, S–1 |
| 15 | Matching | (a) P–3, Q–4, R–1, S–2 |

## Syllabus audit fixes, 17 September 2026

Two findings from the Beyond the Book syllabus audit, both the same method
(combining $a : b$ and $b : c$ through a common $b$, which the body never
does), both confirmed and fixed. **Pages: 26 before (13 body + 13 Beyond),
26 after.** 16 Solved Examples, unchanged in number.

| finding | what was done |
|---|---|
| Example 6 (Type 3), *$a : b = 3 : 4$ and $b : c = 6 : 5$, find $a : b : c$* (borderline) | Replaced with a Type 3 example the body teaches (§3.3) and no example worked: are two concrete batches, $6 : 9 : 15$ and $4 : 6 : 10$, the same mix? Matching quotients all $1.5$, both reduce to $2 : 3 : 5$ |
| Practice Q14, *$a : b = 2 : 3$, $b : c = 4 : 5$, find $a : c$* (borderline) | Replaced with an MCQ of the same form on the value of one part: $a : b : c = 2 : 3 : 5$ and $b = 12$, find $a + c$. Options $20$, $40$, $28$, $7$; the key stays (c). Its *why the other options are wrong* row rewritten |

`ANSWERS.md` Q14 working and `check-numbers.mjs` (Example 6 quotients,
simplest forms and rows; Q14 solver) follow. Breaking the Example 6 answer,
its Step 1 quotient, and Q14's right option each fails the check.

`refit … bridge` kept Beyond at 13 pages; 0 stranded openers. Page 11 (body, untouched)
and page 25 still run 1.6 mm and 1.1 mm into the margin, as before. Answers
opens page 25.

## Brought to the Class 7 standard, 17 September 2026

Phase 3 of `PLAN-MATHS-CONSISTENCY.md`, done against Chapter 1 of
Mathematics I as the model. The chapter was read whole before anything was
changed, and every check below was run on the chapter.

**Pages: 23 before (13 body + 10 Beyond, Crown Quarto), 26 after (13 body +
13 Beyond, 196 × 276).** The body kept its length on the taller page, since
stepping the examples took back what the page gave. Beyond grew by three: its
first stage now carries its own explanations, and it gains sixteen stepped
examples.

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`. The body was
refitted once, after the examples were stepped.

**All ten body examples set as steps.** *Solution*, a step to a
`.work__row`, an *Answer* row, the reason in a `.work__why`. The old wide
labels (*cross-multiply*, *one part*, *inverse*, *so*) became the reasons.
Example 3's lead-in (*White is 5 parts … one part is 2 litres*) became its
first two steps; Example 5's closing check (*20 + 30 + 60 = 110*) became a
step; Example 10 gained a first step, *there are now 100 students*. The
remarks after Examples 1, 2, 3, 4, 6, 8 and 10 stay as paragraphs, and the
question-framing lines before Examples 6 and 8 stay where they were.
`build/check-example-stepping.mjs`: 10 examples, 0 lost mathematics.

**Pages 9 to 13, placed by hand after the refit.** The refit left page 9 at
80% and page 10 at 77%, with § 3.7's head at the top of page 10 and
Example 8 held over. The head and its two opening paragraphs were moved back
to page 9; that ran 7.4 mm into the margin, so two lines were taken out at
the join (below). § 3.7.1's head and its opening working went back to
page 11, and Exercise Set 3.5 Q5–7 back to page 12, leaving the summary
alone on page 13, which carries `data-close`. Fill for pages 9–12 went from
80 / 77 / 93 / 93 to 99 / 90 / 87 / 83.

**Prose trimmed at the join (no fact changed):**

| where | before | after |
|---|---|---|
| p009, Fig. 3.2 caption | *… because 12 of the 40 students earned it, and the same fraction of 360° is 108.* | *… because 12 of the 40 students earned it.* (the next paragraph works the same fraction) |
| p009 | *Notice what the picture shows and what it hides. It shows shares — … It does not show how many students there were. The same chart would serve a class of four hundred with the same proportions. That is the whole point of a ratio, and the reason a pie chart is …* | *The picture shows shares — … It does not show how many students there were: the same chart would serve a class of four hundred. That is why a pie chart is …* (C8 as well) |
| p011 | *… the one people find hardest. It is worth going slowly.* | *… the one people find hardest.* (coaching register) |
| p012, Ex 3.5 Q2 | *…, and $x$ when $y = 48$.* | *…, and find $x$ when $y = 48$.* — KaTeX broke *y =* from *48* across a line |

**Beyond the Book rebuilt to the four current stages** (§6a):

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 8 `.c-try` questions, answered in the next stage | **the same questions, each followed by its own explanation**, word for word except as below; `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | the worked answers to stage 1 (*The same eight questions, worked*) | **16 stepped examples**, Examples 1–16, under eight `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, 36 questions | **one numbered run of 31**, all six forms, band carrying the numeral |
| 4 Answers & Takeaways → **Answers** | key and why five options are wrong; *What to carry forward* | key, every other answer in `.work--trace` blocks, why the options are wrong for 8 questions; the three *carry forward* habits kept as one closing paragraph without the head |

**Stage 1.** Each explanation moved under its own question, dropping only
the `.c-solution` wrapper and its *turn* title. Three edits: *Try each before
turning the page* became *Try each before reading what follows it*; the old
Stage 2 opening (*Each one begins the same way: decide, in a sentence, …*)
moved into Stage 1's opening as *Each explanation begins the same way …*,
without its first sentence (*The eight are answered below in the order they
were asked*); and one wrong number was corrected (below). Stage 1 answers no
body question: its eight were read against every exercise, and each is the
same type with different numbers at most (the taps question against Ex 3.5
Q4; the workers against Example 8).

**A wrong number corrected.** Stage 1's taps explanation said that reading
*two are shut off* as *two are left* *would have given three hundred and
twenty minutes*. Two taps give $240 \div 2 = 120$ minutes. It now says *a
hundred and twenty minutes*, and `check-numbers.mjs` computes it.

**The rupee sign.** Beyond now prints money as plain text (*₹1,680*), as
Class 7 does, so the sign cannot part from its number. The one span that
ended on an equals sign before the sign (*$16 \times 105 = $ ₹$1{,}680$*)
became *$16 \times 105 = 1680$, that is ₹1,680*.

**Give-aways and repeats found and removed.** The old Problem Sets repeated
the body and Stage 1 heavily. Dropped, not reworded: Set C 3 (the car, 4 h
at 60 km/h — **Exercise Set 3.5 Q7 word for word, with its answer in the
key**), Set C 4 (the garrison — **Exercise Set 3.5 Q5**), Set C 1, C 2 and
C 6 and Set B 12 (Stage 1's own questions), Set B 11 (Stage 1's wheels
turned round), Set C 12 (the map ratio made four times larger, whose
explanation answers Ex 3.3 Q3), and the question with *the side of a square*
option, which became assertion–reason Q19. Numbers that were body answers,
changed by reading value by value:

| where | printed | answered | now |
|---|---|---|---|
| old Set B 4 | 1 : 25,00,000, 8 cm is 200 km | Ex 3.3 Q1 (1 cm stands for 25 km) | dropped |
| old Set A 8 | 25% gets a slice of 90° | Ex 3.4 Q2 (sport 25%) | Q8: 40% gets 144° |
| old Set A 7 | 90° is a quarter | Ex 3.4 Q1 (90 of 360 said summer) | Q7: 60° is a sixth |
| old Set A 4 | $y = 12$ at $x = 4$, so $y = 21$ at $x = 7$ | Ex 3.1 Q2 (i) ($4 : 7 :: 12 : 21$) | Q4: $y = 18$ at $x = 6$; $x = 11$ |
| old Set B 8 | 3 : 5 and differ by 16: 24 and 40 | Ex 3.1 Q2 (iii) ($15 : 24 :: 25 : 40$) | Q13: 2 : 7, differ by 25: 10 and 35 |
| old Set A 11 | pens bought and their cost are direct | Ex 3.5 Q3 (i) (books bought and money spent) | Q11 asks which pair is **inverse** |
| draft Q11 option (d) | *a person's age and their weight* | echoed Ex 3.5 Q3 (iii) | *the number of equal boxes and their total weight* |
| draft Q31 (c) | 4 h 30 min, so 80 km/h | the value is Ex 3.5 Q7's answer | 4 h 48 min, so 75 km/h |
| draft Example 7 | ₹2,400 in 3 : 5 : 7 gives 480 | 480 is in Ex 3.2 Q6's answer | ₹3,000: 600, 1,000, 1,400 |

`build/check-no-repeats.mjs` reports 3 pairs at 50%, each judged *same type,
different numbers*: Q2 against Ex 3.1 Q1, Q10 against body Example 6, and
Q12 (taps 12 h and 6 h) against Ex 3.5 Q6 (6 h and 3 h).

**Worked examples in the chapter: 26** (10 body + 16 Beyond), against §5a's
twelve. Types: proportional ratios and the missing term; direct proportion
through the value of one; ratios with more than two terms (with combining
$a : b$ and $b : c$); dividing a whole; scale on a map or a plan; pie
charts; inverse proportion; working together (with a drain).

**Practice: 31 questions** — 15 multiple choice (answers spread a 3, b 3,
c 4, d 5), 4 assertion–reason (a, d, b, c), 3 very short, 4 short, 3 long,
2 case-based. Ten old multiple-choice questions were kept because they
repeat nothing (old A 1, A 2, A 3, A 5, A 6, A 9, A 10, B 7, C 7 and C 9,
some with their options re-ordered to spread the key); the other old ones
not named above were dropped to make room for the other five forms.

**`ANSWERS.md` written** for every question the chapter sets: the two
in-text questions (the batters; Lucknow to Kanpur), the Ram-and-Shyam
working, Exercise Sets 3.1–3.5, Stage 1 (pointing to its explanations), and
the 31 practice questions with their working. Two answers carry notes: Ex 3.1
Q5 takes a litre of water as 1000 g to give rice : water = 3 : 20, and Ex 3.3
Q3 accepts *four times* for lengths while saying the sheet is 16 times the
area.

### Verified

`check-numbers.mjs` is kept beside the pages. It passes **453 claims**: 194
printed identities evaluated on the pages and in `ANSWERS.md` (display maths
`$$…$$` taken out before inline `$…$`; ratio identities such as
$45 : 120 = 3 : 8$ checked for proportion; percentages read), every body
and Beyond example's Step and Answer rows read off the page and compared
number by number with a computation, every practice answer read back out of
the key (lettered parts one at a time), every multiple-choice question
solved with exactly one right option matching the key, every
assertion–reason letter derived, the practice numbering 1–31 and each body
exercise set's numbering, `ANSWERS.md`'s key against the page's, and every
body exercise answer in `ANSWERS.md`. The 89 spans it skips are algebra or
single values (`--skipped` lists them).

**Tested by breaking values on purpose; all twelve caught:** Example 11's
$480 \times 0.3 = 144$ made 145; key letter 13 changed; `ANSWERS.md` key 7
changed; key 30 (c) *25 : 4* made *25 : 3*; key 31 (c) *so 75 km/h* made 76;
`ANSWERS.md` Ex 3.4 Q3 ₹9,800 made ₹9,600; a Q4 option 33 made 34;
Stage 1's *a hundred and twenty* made *three hundred and twenty*; body
Example 5's *30 sand* made 35; key 26 *food 120°* made 125°; a practice
`data-start` repeated; Beyond Example 5's answer 1.6 made 1.8.
**Three were missed by the first version of the check** — 31 (c) (the 75
also sits in the identity beside it), body Example 5's step and Beyond
Example 5's answer (step text with maths inside was not read). The check now
reads every example row and the closing phrase of keys 24, 28 and 31 (c),
and all three are caught.

**Fitting.** Nothing is clipped. Page 11 runs 1.6 mm and page 25 1.1 mm into
the bottom margin, inside §5a's 3 mm. `orphans`: 0 stranded openers in 26
pages. `check-labels`: no collisions. `fit-options`: every option row fits.
The two case tables were set across (a header row and a value row) so that
Q31 comes up onto page 24 instead of standing alone on a page of its own;
page 24 is 98% and the Answers stage opens page 25. Proofs of pages 2, 9,
11, 12, 14, 17, 18, 21–26 were read. Exercise Set 3.5 has no figure; no body
question names a figure, so none is a page turn from one.

**Colour.** Pages 1, 3 and 9 were read in greyscale and under simulated
deuteranopia, protanopia and tritanopia (`build/check-colour.mjs`). The pie
chart's slices are lettered A–E and fall to distinct greys. Fig. 3.1's bars
carry their ratio as a label and their segments in fixed order and length,
so nothing depends on hue alone.

### Short pages, logged

Each is held by a block `gaps` names, which the packer cannot move.

| page | fill | held by |
|---|---|---|
| 2 | 83% | § 3.3's head, which may not be stranded |
| 3 | 78% | Example 3, a panel (88 mm) |
| 5 | 84% | Example 5, a panel (65 mm) |
| 11 | 87% | § 3.7.1's second working block and its paragraph |
| 12 | 83% | the summary, indivisible |
| 13 | 50% | **the body's last page** (`data-close`) |
| 17, 18 | 86% | Solved Examples: the next example panel; a `Type` head with its example |
| 26 | 32% | the last page |

### Flagged, not done

- The existing flags below still stand: *Puneet* on p001/p003 against
  *Puneeth* on p010 (C3); the map scales never say what kind of map each is
  (M5); *bases turning up in new clothes* (M1, and an idiom); $1 \div 1.5$
  is never shown as $\tfrac23$ (M2).
- Example 4 adds 3 + 4.5 + 9 bags to get 16.5 bags of concrete. Mixed
  materials do not add by volume like that; it is NCERT's simplification and
  was left, as layout only was allowed.
- Stage 1 keeps its old coaching sentences (*worth remembering*, *Notice
  also*), because it is kept word for word. §6a would not write them today.
- Exercise Set 3.3 Q3 (*how many times larger*) can be read as lengths (4)
  or area (16); `ANSWERS.md` accepts both with a note. A rewording would
  settle it.
- Exercise Set 3.1 Q5 asks for a ratio of grams to litres; `ANSWERS.md`
  converts. A rewording would settle it.
- No *Did you know?* in the chapter, so no facts need a source.

Language edit, 23 pages (p001–p013 chapter proper, p101–p110 Beyond the Book).
Build after editing: 23 pages, all pages fit, 0 stranded openers, no label
collisions, every option row fits. All 36 answers in Stage 4 checked against the
questions — all correct.

6 fixes in 23 pages. The chapter is built on one idea stated in its title —
something refuses to change while two quantities move — and it holds that line
all the way through: the quotient holds still in direct proportion, the product
holds still in inverse, and § 3.7 opens by writing the *wrong* proportion for a
journey at 30 and 60 km/h, getting six hours, and saying plainly that it is
nonsense. That is the right way round: the reader is shown the trap before the
rule.

Contexts are local throughout — idli batter at $2:1$, Viswanath's spice mix,
concrete at $1:1.5:3$, a library of Odia, Hindi and English books, a purse of
₹10, ₹5, ₹2 and ₹1 coins, Lucknow to Kanpur, and maps in the Indian numbering
system ($1:60{,}00{,}000$, read as sixty lakh).

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted. *Puneeth* on p009 is now *Puneet*, as on p001 and p003: one name, one spelling. Every rupee amount written as `₹$…$` is wrapped in `<span class="nb">`, so the sign can no longer end a line with its number on the next. Nothing reflowed; `check-numbers.mjs` gives the same count of claims with and without the spans.

## FIXED

| before | after | check |
|---|---|---|
| **p001** "In the last section it is something else — and finding out what tells you which kind of relationship you are looking at." | "…— and working out what stays the same tells you which kind of relationship you are looking at." | L3, L6 — the original cannot be parsed on first reading: *finding out what* has no object until the reader back-tracks |
| **p002** "the equation $ad = bc$ has one unknown in it and gives it up at once" | "…and can be solved at once" | L3 — idiom |
| **p003** "it is worth asking whether the situation deserves it" | "it is worth asking whether the situation fits it" | L3 |
| **p008** "which grade was commonest" | "which grade was most common" | L1 |

## FLAGGED

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p010 vs p001, p003 | C3 | **The same character's name is spelled two ways.** p001 and p003 have *Puneet* — "Puneet grinds four with two", "Puneet has only two chillies" — and p010 opens § 3.7 with "**Puneeth's** father rides from Lucknow to Kanpur". The chapter's other recurring name, Viswanath, is spelled consistently. Either it is one boy spelled two ways or two boys with nearly the same name, and a reader cannot tell which. | One spelling. It is a proper noun, so I have not picked for you. |
| p007 § 3.5 | M5 | "$1 : 60{,}00{,}000$… one centimetre stands for $60$ km" is right, and the worked example is right, but the section never says **which** map. A reader who goes looking at the scale bar of an atlas will find $1:60{,}00{,}000$ on a full-page map of India and nothing like it on a district sheet, and the exercises then jump to $1:25{,}00{,}000$, $1:50$, $1:200$ and $1:50{,}000$ without saying what kind of thing is drawn at each. | A clause naming the scales: a country on one page, a classroom plan, a model ship, a walking map. The arithmetic is fine; the reader has nothing to picture. |
| p011 | M1 | "which is Chapter 1's warning about **bases** turning up in new clothes". The word is being borrowed from Mathematics II Chapter 1 (where it meant the amount a percentage is taken of) into a chapter that does not otherwise use it. That is the fifth sense of *base* in this book. | Chapter 1's own prose mostly says "the original amount"; the same phrase works here. See CROSS-CHAPTER.md — this wants one pass across the book, not a patch here. |
| p012 § 3.7.1 | M2 | The working-together method turns Shyam's hour and a half into a rate of $\tfrac{1}{1.5} = \tfrac23$ of a unit per hour. Dividing 1 by a decimal to get a fraction is the one arithmetic step in the chapter that is not shown, and it is the step the whole method rests on. Everything after it is addition and the rule of three. | One line: $1.5 = \tfrac32$, so $1 \div \tfrac32 = \tfrac23$. |

## 24 September 2026 — NCERT title

The chapter now carries NCERT's own title, *Proportional Reasoning-2*, taken from the chapter's first page in the NCERT textbook, in place of the house title it had. Changed in `chapter.json` and the opener heading in `p001.html`; nothing else in the chapter uses the title.
