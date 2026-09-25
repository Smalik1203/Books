# Class 8 · Mathematics II · Chapter 5 — Dots, and the Lines Between Them

## Solved examples in examination formats, 23 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 13 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-8/p2ch05-data/`.

Source `build/jee-class8.mjs`; check `build/check-jee-class8.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p113; the answers stage still opens a fresh page.

Fitting, same day. Practice p110: its last block moved to p111 (settle.mjs), which had room; no words changed. Fig. 5.9 belonged to the old examples and was the last figure in the chapter, so nothing was renumbered.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) 42 |
| 2 | Single correct | (b) 24.5 |
| 3 | Single correct | (c) 67.5 |
| 4 | Single correct | (d) 15.5 |
| 5 | Single correct | (a) 14 |
| 6 | Single correct | (b) 45.9 |
| 7 | Multiple correct | (a), (b), (c) |
| 8 | Multiple correct | (a), (b) |
| 9 | Multiple correct | (a), (b), (c) |
| 10 | Multiple correct | (a), (c) |
| 11 | Numerical answer | 17 |
| 12 | Numerical answer | 10 |
| 13 | Numerical answer | 43 |
| 14 | Matching | (d) P–3, Q–4, R–1, S–2 |
| 15 | Matching | (a) P–3, Q–4, R–2, S–1 |


## Brought to the Class 7 standard, 17 September 2026

Phase 3 of `PLAN-MATHS-CONSISTENCY.md`, worked against Class 8 Chapter 1 as
the model. The chapter was read whole before anything was changed; every
check below was run on the chapter.

**Pages: 29 before (17 body + 12 Beyond, Crown Quarto), 28 after (15 body +
13 Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`. The body was
refitted once (`refit … body`), which left page 6 at 48% (§ 5.6's head could
not take Example 4 under it) and a 54% page before the summary. The rest was
placed by hand with `unsettle`/`settle`, block by block, from page 6 to the
end: § 5.6 and Example 4 moved onto page 6; Exercise Set 5.1, § 5.7, Exercise
Set 5.2, § 5.8 and § 5.9 each pulled back a page; the summary and closing
paragraph now close page 15, which carries `data-close`. Stale `p016`,
`p017` deleted.

Prose trimmed at joins to close whole rendered lines (no fact changed):
§ 5.6's opening paragraph and Example 4's closing remark (one line each);
on page 11, *and it is worth seeing why* and the sentence *Every reading
would be carried correctly and the picture would describe a day nobody has
lived through* were cut, the steepness paragraph and the quarter-hour
paragraph each lost a line, and Example 6's Answer row was shortened to one
line. § 5.10: *wearing different clothes* (an idiom §10 names) became
*again*.

**All six body examples set as steps** — *Solution*, `Step` rows, an
*Answer* row, the reason in `.work__why`. The old wide labels (*below 9*,
*call it w*, *the recorded total* …) became Step rows or reasons. Remarks
stay as paragraphs after the working. Example 4's Step 1 reason was cut to
*$w$ is missing* so the long fraction stays on one line. Verified by
`build/check-example-stepping.mjs`: 6 examples, 0 lost mathematics.

**Figures and their questions.** Exercise Set 5.3 Q1 and Q3 use Fig. 5.4,
which prints four pages earlier; Q6 uses Fig. 5.6, which is overleaf. Both
figures are reprinted beside their questions, captioned *(repeated from
Section 5.8 / 5.10, for Exercise Set 5.3, …)*, not renumbered. Example 6 now
faces Fig. 5.4 (pages 10–11). Beyond's new Fig. 5.7 prints on page 22 and its
two examples on 22 and 23, facing.

**Colour.** Fig. 5.6 told its five activities apart by fill alone, and in
greyscale *eat*, *school* and *travel* were three close greys. The *eat*
boxes now carry a diagonal hatch and the *travel* boxes a paper-coloured
dot, in the strip and in the key, in both copies of the figure. Pages 1, 4,
8, 10, 12, 13, 15 and 22 were read in greyscale and under the three
colour-vision simulations: every other figure is a single series (one
line, one bar colour, one dot colour) with its values on the axes.

**Beyond the Book rebuilt to the four current stages** (§6a):

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 8 `.c-try` questions, answered in the next stage | **the same questions, each followed by its own explanation**, word for word except as below; `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | the worked answers to stage 1 | **13 stepped examples**, Examples 1–13, under nine `Type N ·` heads; new Fig. 5.7 |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, 36 questions | **one numbered run of 27**, all six forms, band carrying the numeral |
| 4 Answers & Takeaways → **Answers** | three keys, why-wrong paragraphs, *What to carry forward* | key, every other answer in `.work--trace`, why the options are wrong for 7 questions, one closing paragraph from *What to carry forward* |

Stage 2's *Behind Each Answer* held stage 1's own explanations, so they were
moved under their questions without their *Solution* titles. Its opening
sentence became stage 1's third paragraph (*Each is answered straight after
it …*). Changed in stage 1: *Try each before turning the page* → *before
reading what follows it*; *every one of these questions was answered by
taking the disguise off* → *most of*, since the rainfall and median
questions were not; *Example 3* → *Example 3 (section 5.4)*, twice, because
Beyond now has its own Example 3.

**One stage 1 item replaced** (no-give-away rule):

| was | answered | now |
|---|---|---|
| eleven values, median 20, four more values above 20: the median rises or stays, by an unknown amount | Exercise Set 5.1 Q7 (iii) *sometimes* and (iv) by its mirror | nine values with median and mean 20; two values below 20 raised by 4 and 5 and still below: median stays 20, mean becomes 21 |

**Old practice dropped because it repeated or answered the body:** Set A 10
(value between points is an estimate — Ex 5.3 Q3 (ii)), A 11 and B 12 (bar
axis from zero — Ex 5.3 Q4 (i)), A 12 (Example 1's numbers), B 1–3 (§ 5.4's
numbers), B 4 (Ex 5.1 Q4), B 5 (Ex 5.1 Q3), B 6 (Ex 5.1 Q6), B 9 (Example 3),
B 10 (Example 5), C 4 (Ex 5.1 Q5), C 6 (a hint for Ex 5.1 Q9), C 8 (Ex 5.2
Q5), C 9 (Ex 5.3 Q3 (iii)), C 10 (Ex 5.3 Q7), and A 3 (the mirror of Ex 5.1
Q7 (ii)); C 1–3, C 5 and B 8 repeated stage 1. Kept, reworded to new option
orders: A 1, A 2, A 4, A 5, A 6, A 7, A 8, A 9. Every number Beyond prints
was read against the body's exercise list; `build/check-no-repeats.mjs`
reports one pair above 50% (Example 9 against Ex 5.2 Q4: same type,
different numbers).

**Worked examples in the chapter: 19** (6 body + 13 Beyond). Types: the mean
as a balance point; including and removing values; changing every value;
finding and moving the median; a missing or wrong value; mean and median
from a frequency table (two); reading a line graph (two); a bar graph with a
cut axis; a picture read through its key.

**Practice: 27** — 10 multiple choice and 4 assertion–reason (the 14
letters are a 4, b 4, c 3, d 3), 4 very short, 4
short, 3 long, 2 case-based.

**`ANSWERS.md` written** for every question: the three exercise sets, the
in-text claims, the Think and Reflect (worked instance), stage 1 (pointing
to its explanations), and all 27 practice questions with working. Drawings:
what Ex 5.3 Q2 (i), Q7 and Practice 24 (a) must show.

### Wrong numbers found and fixed

| where | printed | the figure / arithmetic says | now |
|---|---|---|---|
| § 5.2 (p003) | 17 dragged to 37: the mean *would have to move nearly five places* | $(37 - 17) \div 4 = 5$ exactly | *move five places* |
| § 5.10 (p013) | *slept from midnight until half past five* | Fig. 5.6's sleep block runs to the 6 am tick (12 boxes) | *until six* |
| § 5.10 (p013) | *travelled twice, half an hour each way* | each travel block is 2 boxes, an hour | *an hour each way* |

The two § 5.10 errors mattered: Exercise Set 5.3 Q6 asks how long the
journey took *using Fig. 5.6*, and the prose and the figure disagreed. The
figure was taken as the record; the prose was corrected.

### Verified

`check-numbers.mjs` is kept beside the pages and passes **487 claims**:
151 printed identities evaluated (6 as printed roundings such as
$152 \div 30 = 5.07$; display maths is read before inline); every plotted
point re-read from its SVG — Fig. 5.1's dots and fulcrum, Fig. 5.2's two
rows, Fig. 5.3's strokes counted row by row against the thirty raw answers,
the tally labels and the table, Fig. 5.4's six readings against Example 6,
§ 5.8 and Exercise Set 5.3, Fig. 5.5's eight bars against both axes, Fig.
5.6's 48 boxes against the prose and Q6, Fig. 5.7 against Examples 10–11;
the two reprints are byte-identical to their originals. Body exercise
answers are computed (searches for $p$, $f$, $x$, brute-force checks of the
median claims) and read back out of `ANSWERS.md`; practice answers are read
back out of the key rows one lettered part at a time, with medians required
to *end* a part so a mean of the same value cannot hide them; every MCQ has
exactly one right option matching the key; AR letters derived; exercise and
practice numbering checked for repeats; `ANSWERS.md` key = page key.

**Break tests, all caught (13):** a Fig. 5.4 dot moved 31 → 32; key 8 (b) →
(c); `ANSWERS.md` Ex 5.2 Q6 $x = 18$; key 24 (c) 102.75 → 102.5; key 26 (c)
median 45 → 46 (missed by a whole-part check at first, because the mean in
the same part is 45 — the *ends on* check was added); Example 5 25.4 → 25.3;
*slept until half past five*; a travel block shortened in the SVG; Example
12 *4 times* → *5*; a Q7 option 8 → 9; practice `data-start` 5 repeated as
4; stage 1 $78 - 60 = 17$; `ANSWERS.md` key 13 (b) → (a).

**Fitting.** Nothing clipped. Page 4 runs 1.9 mm into the bottom margin,
inside 3 mm. `orphans`: 0 in 28 pages. `check-labels`: no collisions.
`fit-options`: every option row fits (Practice 9's option *the largest
frequency* was too wide for four columns and became *the range*).
The Why-wrong list was split into three `.work--trace` blocks so that its
head could start on the Answers page (page 27: 78% → 98%). Proofs read:
pages 6, 7, 8, 11, 12, 13, 14, 15, 16, 19, 22, 23, 24, 26, 27.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 12 | 87% | the Think and Reflect panel |
| 13 | 86% | Exercise Set 5.3's band, whose Q1 must keep the Fig. 5.4 reprint under it |
| 19 | 84% | Example 3, a panel |
| 22 | 86% | Example 11, a panel |
| 28 | 40% | the last page |

### Flagged, not done

- Page 12, § 5.9: *Look again at Fig. 5.4 and consider three claims* — the
  figure is on page 10, a page turn back. It is running text with the
  answers beside it, not a question, so it was not reprinted a third time.
- The earlier flags below still stand: p004's 5.07/152 paragraph borrows
  § 5.7's numbers before § 5.7; Ex 5.2 Q5 prints the two values it asks
  about; Ex 5.3 Q7 asks about the shape between yearly doublings, which the
  book never draws (`ANSWERS.md` answers it with $\sqrt{2}$, which Class 8
  has not met in this volume).
- Stage 1 keeps its coaching sentences (*the one to reach for*, *the other
  half of them had a second, shorter road*), because it is kept word for
  word.
- Practice 24 uses a fever in degrees Fahrenheit; the body's fever remark
  names no unit.
- No *Did you know?* in the chapter; no facts need a source.

---

Language edit, 29 pages (p001–p017 chapter proper, p101–p112 Beyond the Book).
Build after editing: 29 pages, all pages fit, 0 stranded openers, no label
collisions, every option row fits. All answers in Stage 4 checked against the
questions — all correct.

3 fixes in 29 pages, all the same word. There is nothing else to do to the
language, and the chapter is the strongest piece of statistics teaching in the
book. Three things are worth recording in detail, because they are unusual:

- **The mean is re-derived as a balance point and then proved unique.** p002
  shows that the distances below and above a proposed centre can only agree in
  one place, then gives the one-line algebra: adding $x - m$ over every value
  gives $(x_1 + \cdots + x_n) - nm$, which is zero exactly when $m$ is the sum
  over $n$. A Class 8 reader gets the fair-share mean they already know, a
  second picture of it, and a proof that the two are the same number.
- **§ 5.9 teaches reading a graph in two steps** — first what is given, then
  what follows — and then shows the same four sales figures twice, once on an
  axis from zero and once from 94, where the last bar looks five times the first
  on a rise of eight per cent. It states the rule ("never cut the axis of a bar
  graph") *and* the exception (a fever chart), which is more honest than most
  adult writing on the subject.
- **"Not settled" is taught as an answer.** p014 gives three claims about the
  temperature graph and marks two of them *not settled* — "guesses dressed as
  inferences" — then says plainly that this is "the answer a reader is least
  willing to give, because a graph looks so complete". That is the most
  valuable page in the chapter and possibly in the volume.

The closing line earns the whole chapter: "each of them is worth having because
it throws something away. Knowing what a summary has thrown away is the
difference between reading it and being told what to think by it."

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted. The stepping check was re-run with empty stand-ins for the deleted p016–p017, since the tool compares only page files that still exist: 6 examples, 0 lost.

## FIXED

| before | after | check |
|---|---|---|
| **p010** "forgetting it is the commonest mistake made with a frequency table" | "…the most common mistake…" | L1 |
| **p014** "a legitimate answer and the commonest correct one" | "…and the most common correct one" | L1 |
| **p106** MCQ option "the commonest value" | "the most common value" | L1 |

## FLAGGED

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p004 | C1 | "Thirty households averaging $5.07$ are joined by one of $8$. The new total is $152 + 8 = 160$ over $31$ households, which is $5.16$." Every number here — the 30, the 5.07, the 152 — comes from the frequency-table example in § 5.7, **six pages later**, and p004 does not say so or say what is being averaged. A reader meets a mean of 5.07 with no units and no source, and the total 152 arrives from nowhere. The arithmetic is right ($30 \times 5.07 \approx 152$, $160 \div 31 = 5.16$). | Either name what the 5.07 measures and where it comes from, or use a fresh pair of numbers here. As it stands this is the one paragraph in the chapter a reader cannot follow. |
| p010, p011 Q5 | C7 | § 5.7 works out the household mean as $5.07$ and the median as $5$, and then Exercise 5.2 Q5 asks: "For the household data of section 5.7 the mean is $5.07$ and the median is $5$. Which is the larger, and what is it about the shape of the table that makes it so?" The question hands over both numbers and the comparison, leaving only the explanation — which is fine — but it is the fourth time those two figures appear on facing pages. | Ask for the two values, or ask only for the shape. As written the question does most of itself. |
| p017 Q7 | M2 | "A quantity starts at $1$ and doubles every year for six years. Plot it as a line graph, and explain why joining the points with straight segments **overstates** the quantity at every moment in between." The claim is true and the reason is that doubling grows faster later in each year than earlier — but nothing in this chapter or in Mathematics II Chapter 1 establishes the shape of growth *between* two readings. The question asks a Class 8 student to reason about a curve the book never draws. | Either drop it or give the reader something to stand on: a half-year value, say, computed and plotted. The marked-hard flag does not make an unsupported step fair. |
| p105 (built page 22) | — | 84% full, 33mm of white at the foot. Pre-existing; p105 untouched by this edit. | Recorded so it is not attributed to the language pass. |


## 21 September 2026 — figure/table reference review

Reviewed this chapter in the all-maths reference audit. Figures and tables now use one chapter sequence, including Beyond the Book; captions and references were updated together. Questions, calculations and artwork were preserved. The chapter and its volume were rebuilt; detailed layout checks and any remaining warnings are recorded in build/_all-maths-reference-checks/.

## 24 September 2026 — NCERT title

The chapter now carries NCERT's own title, *Tales by Dots and Lines*, taken from the chapter's first page in the NCERT textbook, in place of the house title it had. Changed in `chapter.json` and the opener heading in `p001.html`; nothing else in the chapter uses the title.
