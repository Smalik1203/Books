# Class 6 · Mathematics I · Chapter 10 — The Other Side of Zero

## Solved examples in examination formats, 20 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 18 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-6/math-ch10-other-side-of-zero/`.

Source `build/jee-class6.mjs`; check `build/check-jee-class6.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p112; the answers stage still opens a fresh page.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) −1 |
| 2 | Single correct | (c) 12°C |
| 3 | Single correct | (c) 3 − (−8) |
| 4 | Single correct | (a) −4 |
| 5 | Single correct | (b) −3 |
| 6 | Single correct | (d) 7 |
| 7 | Multiple correct | (a), (c), (d) |
| 8 | Multiple correct | (a), (b), (c), (d) |
| 9 | Multiple correct | (a), (b), (d) |
| 10 | Multiple correct | (a), (b), (d) |
| 11 | Numerical answer | 11 |
| 12 | Numerical answer | 13 |
| 13 | Numerical answer | 11 |
| 14 | Matching | (a) P–3, Q–4, R–1, S–2 |
| 15 | Matching | (c) P–3, Q–4, R–1, S–2 |


## Syllabus audit fixes, 17 September 2026

The Beyond the Book audit made one finding here. I confirmed it and fixed it. The chapter body was not touched.

| finding | what I did |
|---|---|
| gap (minor): counting years across BCE, where there is no year 0. Exercise Set 10.18 Q1 asks this, but no example works it. | **New Example 13** under Type 5 (*Money, heights and temperature*): *How many years passed from 45 BCE to 30 CE?* <br>• Write 45 BCE as −45 and 30 CE as +30. <br>• 30 − (−45) = 75 (add the inverse). <br>• The number line counts 0, but no year was 0, so 75 − 1 = 74. <br>• A check counts in parts: 44 + 1 + 29 = 74. <br>It uses the chapter's own subtraction. It answers none of Q1's three parts (150 and 2200 years before this year, 320 years after 680 BCE). |

**Renumbering.** Old Examples 13–17 are now 14–18. `ANSWERS.md` (*eighteen examples, numbered 1 to 18*; the Stage 2 list) and `check-numbers.mjs` were updated to match.

**Fitting.** With the new example, the first refit gave 14 pages, and Example 18 sat alone on a page at 28%. Three trims to existing examples brought it back to 13:
- **Example 12:** its two steps became one (*Difference: 650 − (−80) = 650 + 80 = 730*), its question fits on one line, and its closing sentence (*the two distances add*) was cut.
- **Example 9:** the check row *(+4) + (−8) = −4* was cut. The Answer row still gives the result.
- **Example 11:** its question fits on one line (*At 4 a.m. it was −6 °C, and it grew 3 degrees warmer every hour…*).

Each trimmed example still passes its checks.

**A lone practice question before Answers was already there:** Q33 stood alone on p111 at 37%, before these fixes as well. `settle.mjs` moved Q32, with its *Case-based questions* sub-head, onto that page. Both case questions now share p111 (65%), and p110 is 63%. p109 runs 2.1 mm into the margin (within 3 mm; it did before). p113 is the tail of the Answers stage, on the last page.

**Pages: 38 before (25 body + 13 Beyond), 38 after (25 + 13).** Solved
Examples: 18 in Beyond (was 17).

**Checks.**
- `check-numbers.mjs` passes 825 checks. The new Example 13 is checked by:
  - reading the years off the question;
  - counting every real year from 45 BCE to 30 CE, skipping 0;
  - checking Step 1's integers, Step 2's difference, Step 3's *less one*, the check-in-parts sum, and the Answer row;
  - checking that `ANSWERS.md` agrees.
- 8 deliberate breaks were all caught, including a changed year, 75 left uncorrected, a wrong check sum, a misnumbered tab, and Example 12's merged step.
- `build.mjs --png`: all pages fit.
- `orphans`: 0.
- `fit-options`: clean.
- `check-labels`: clean.
- `check-no-repeats`: the new example raises no pair.

## Brought to the Class 7 standard, 16 September 2026

Phase 1 of `PLAN-MATHS-CONSISTENCY.md`, following the model chapter
(`math-ch05-prime-time`). The chapter was read whole, and checked against
NCERT's own chapter (`assets/sources/class-6/maths/Chapter 10.pdf`), before
anything was changed.

**Pages: 31 before (23 body + 8 Beyond), 38 after (25 body + 13 Beyond).**

### What changed

**A palette.** `chapter.json` gains `"palette": "amethyst"`, and nothing
else. `palette-amethyst.css` sets `--teal: #643761`, byte-identical to
`CHAPTER_ACCENTS[10]` in `build/build.mjs`.

**All five body examples set as steps** — *Solution*, a step to a
`.work__row`, *Answer*, the reason in a `.work__why`. Layout only.
Body Example 1's three cases went into a lettered list above the working.
Body Example 2 keeps *first way* and *second way* as the reasons on its steps,
because Beyond's stage 1 refers to "the second way from Example 2" — the body's Example 2 (see Flagged).
Body Example 4's fifth step was shortened by one rendered line ("the 6 positive
tokens" → "the 6") to stop page 14 running 4.8 mm into the margin; no
number changed. `check-example-stepping.mjs`: 5 examples compared against
`HEAD`, 0 lost mathematics; body Examples 3 and 5 gain one mention each (0 and
20) from their new rows.

**Beyond the Book rebuilt to the four stages.**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, explained in running text | **kept word for word** (12 paragraphs, diffed against `HEAD`); only `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | 5 problems solved in prose | **17 stepped examples**, Beyond Examples 1–17, under seven `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, A/B/C, 24 questions | **one numbered run of 33** in six forms, the band carrying the numeral |
| 4 Answers & Takeaways → **Answers** | key and notes | key, every other answer in `work--trace`, six *why the other options are wrong* notes; opens its own page |

Types: 1 comparing and ordering · 2 adding · 3 subtracting · 4 tokens and
zero pairs · 5 money, heights and temperature · 6 integer grids ·
7 patterns with integers. **22 worked examples** in the chapter (5 + 17).

Practice: multiple choice 1–12, assertion–reason 13–16, very short 17–22,
short 23–28, long 29–31, case-based 32–33. Key: a 4, b 4, c 5, d 3.
The assertion–reason questions follow Class 7's form: the four choices are
printed once in a `<p class="c-practice__note">` naming Questions 13 to 16,
and each question is `<p>Assertion (A): …</p><p>Reason (R): …</p>` with no
option list of its own (the model chapter's form, copied at first, gave each
one four options).
Some of the old sets' questions were kept where they did not repeat the
body (old Set A 1–5, 7, 8, 10; old B1, B2; old C1, C2), and four old
problems became Beyond Examples 3, 6, 13 and 14.

**Nothing repeats the body.** `check-no-repeats.mjs`, judged pair by pair:

| pair | judgement |
|---|---|
| Beyond Ex 8, tokens for $(+2) - (+5)$ · Ex. 10.11 Q2 | same type, new instance — a worked example of an exercised type |
| Q15 A–R, order against distance from 0 · T&R, "which is further from 0, $-7$ or $+5$?" | the T&R asks for a distance; Q15 asks whether distance decides order. Different question; `check-no-repeats` no longer lists it |
| Beyond Ex 9 / Q7, pocket of tokens · Ex. 10.9 Q4 | different question: finding the split, finding a value |
| Beyond Ex 1, ordering · Ex. 10.7 Q2 | same type, new instance |
| Beyond Ex 2, 5 steps from $-3$ · T&R, 4 steps from 0 | a different starting point, and a second question |
| Q31, build an amazing grid · Ex. 10.16 Q3 | an extension of an open question, with a method given |
| Q22, Q27, Q28 — the three questions moved out of the body (below) | read one by one against the body: Q22's sequence is not one of Ex. 10.18 Q2's; nothing in the body asks for a rise in temperature; Q28's six expressions are its own, so it neither repeats nor works Ex. 10.17 Q4. `check-no-repeats` lists none of them |

**Removed as repeats:** Q15 as first written — A "the sum of two negative
integers is always negative", R "a positive plus a negative is always
negative". Those are the answers to two parts of Ex. 10.18 Q4 (the sign
question; the coordinator's note calls it Q5), so read strictly it repeats
the body. Replaced by A $-3 \gt -8$, R "$-3$ is further from 0 than $-8$
is": the order of integers against their distance from 0, a mistake no body
question asks about. Its key stays (c), and its *why* note was rewritten.
Q25 (then Q24) as first written (tokens, "how many zero pairs",
the same as Ex. 10.11 Q1 with new numbers) — replaced by a pocket worth 0
losing two negatives. Beyond Ex 15 as first written ("write the next three
numbers", the same as what was then Ex. 10.18 Q7 and is now Practice Q22) —
recast to ask for the 10th number. Old stage 2's Leh temperature rise was
not carried over; the reason given then — that it repeated the body's Dras
question — no longer holds, since Dras is now Practice Q27, but a Leh rise
beside it would repeat it inside the practice run, so it stays out. Old Set
C's dice question stays out too (the same as Ex. 10.17 Q3).

**`ANSWERS.md` written** for every question: all 19 exercise sets, every
Think and Reflect, and Beyond's stages 1 and 3.

**Beyond renumbered to match Class 7.** Beyond's Solved Examples were first
numbered on from the body (6–22), as the brief said; every Class 7 chapter
starts them again at 1, so they are now **Beyond Examples 1–17** and the
body keeps 1–5. This log calls them *Beyond Ex N* and *body Example N*.
`check-numbers.mjs` checks both tab sequences, looks each example up in its
own half, and names every per-example check *body Ex N* or *Beyond Ex N*;
a missing or misnumbered tab is a named failure. `ANSWERS.md` lists them
under *Stage 2 · Solved Examples* with their own numbers. No page text named
a Beyond example by number. Tested: Beyond's tab 9 changed to 19 — the
script failed by name, exit 1; restored.

### Verified

**`check-numbers.mjs` — 814 checks, exits 0.** 384 relations read off the
pages and `ANSWERS.md` and evaluated with a parser that takes `-`, `−` and
`\text{–}` as the same sign and brackets round negatives as brackets.
Named, not dropped: 20 spans that are a bare sign used as a word
("Target $-$ Starting $=$ …"), 14 spans with a `?` or a blank, and 2 spans
**printed false on purpose and checked to be false** — Riya's mistake in
stage 1 and the assertion of Q16.

Beyond arithmetic, it reads **every figure**: each number-line label
against its position (Figs. 10.1, 10.3, 10.5, 10.6, 10.13, 10.14, the mine
in 10.4), each jump's label against its ends, every token counted
(10.7–10.12, 10.19), the floors of Fig. 10.2 against the text and
`ANSWERS.md`, and every grid (10.15–10.18) with every possible game
played. Every worked example's *Answer* row is read back and compared;
every practice answer is read part by part; options and key are both read
off the page, and each choice question has exactly one right option.
`ANSWERS.md` is checked to answer every expression an exercise sets (70
parts, 4 missing addends, 3 blank subtractions, 12 comparisons).

**Tested by breaking it.** Six errors put in and taken out again: a
practice answer (₹115 → ₹105), Fig. 10.3's label H moved one mark, an
`ANSWERS.md` value (+7 → +1), the key for Q9 (c → b), body Example 5's $-22$ →
$-20$, and a **sign only** in Beyond Ex 2 ($-8$ → 8). All six caught, exit 1;
restored and compared byte for byte. After Q15 was replaced, two more:
its key letter (c → d) and its reason's numbers swapped (so R became true)
— both caught, exit 1, both restored.

**Wrong numbers.** None found in the printed body or in stage 1. The script
itself had five mistakes, each caught by running it: an expected $-22$ typed
as 22; Q9's temperatures read from the wrong position; "a 3 by 3 grid" read
as two numbers of the grid question (now Q31); floors to mark (10.3 Q4) taken for sums; and a note's
distractor sum the note-reader missed (now counted). Old stages 2–4 were
replaced, not audited.

**Fitting.** `refit … body` once, then two figure fixes by hand;
`refit … bridge` twice (the second after the Answers-on-a-new-page rule),
then hand fixes: Beyond Ex 17 added to page 32 and the *why* block divided at
a row. When the assertion–reason questions lost their option lists, page 34
fell to 46%, so questions 12–30 (now 12–33) were repacked by hand across pages 34–36,
each page taking as many as fit; the Answers stage still opens page 37, and
page 36 holds only practice.
**Do not re-run either refit without re-checking figures 10.11 and 10.17.**
Final build: all pages fit, nothing in the margin. `orphans` 0 stranded in
38 pages; `fit-options` every row fits; `check-labels` no collisions.

**Figures and their questions.** The body refit put Fig. 10.11 overleaf
from the text that describes it, and Fig. 10.17 overleaf from Exercise 10.16
Q1, which is played on it. Both fixed by moving blocks: the two
$(+5) - (+6)$ paragraphs now sit above Fig. 10.11 on page 14, and the
amazing-grid section now shares page 20 with Exercise 10.16. That cost a
page (Exercise 10.17 now stands alone).

**Colour.** Greyscale and deuteranopia/protanopia/tritanopia proofs of pages
1, 2, 12, 16, 17, 20, 27 read. The tokens turn from green/red to
purple/olive under deuteranopia but every token carries its + or − sign;
the cross-section's points are lettered; nothing relies on hue alone.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 13 | 86% | the two $(+5) - (+6)$ paragraphs, moved to share page 14 with Fig. 10.11 |
| 15 | 86% | a Think and Reflect panel (30 mm), which stays with Table 10.1 |
| 18 | 84% | Exercise Set 10.15, kept whole (§11) |
| 19 | 41% | the amazing-grid section, moved whole to share page 20 with Exercise 10.16 |
| 20 | 84% | Exercise Set 10.17, kept whole |
| 21 | 33% | Exercise Set 10.17 alone: Exercise Set 10.18, nearly a page, is kept whole and cannot join it |
| 22 | 81% | the §10.5 heading, which needs about 48 mm with the lines under it; 44 mm are left |
| 25 | 57% | `data-close` — the chapter's last page |
| 30 | 85% | Beyond Ex 11, a panel |
| 32 | 85% | the practice run, which starts a page because it is taller than one |
| 36 | 37% | question 33 alone, held by the Answers stage, which always opens a page |
| 38 | 29% | the last page |

**Resolved — Fig. 10.18.** NCERT's PDF text layer reads $-20, -7, -14,
-11$ for the first grid's last row, where this book prints $-17$. The
coordinator checked NCERT's PDF: the grid rises by 3 along each row and
falls by 9 down each column, and the game only works on grids built that
way, so $-17$ is the value the grid requires and the text layer's "$-7$" is
almost certainly a lost digit. `check-numbers.mjs` checks the printed grid
has that structure. Nothing to change.

**Three questions moved out of the body, 16 September 2026.** Exercise
10.17 Q5 and Exercise 10.18 Q6 and Q7 were not NCERT's; an earlier pass had
added them. By the user's decision the chapter body is NCERT's alone, so
they now sit in Beyond's Practice:

| was | now | form |
|---|---|---|
| Ex. 10.18 Q7, the sequence $5, 2, -1, -4, \ldots$ | **Q22** | very short answer |
| Ex. 10.18 Q6, Dras, $-16$ °C to 7 °C | **Q27** | short answer |
| Ex. 10.17 Q5, pairs of inverse values | **Q28** | short answer |

Exercise 10.17 now ends at Q4 and Exercise 10.18 at Q5, NCERT's string of
100 tokens. Q5 had said "In Question 4" and used that question's eight
expressions; finding its pairs meant working Exercise 10.17 Q4, so in
Practice it carries six expressions of its own ($7 - 11$ and so on) and
stands alone. The run is 33 questions; 1–16 and the key are unchanged, and
the answer rows, `data-start` numbers, `ANSWERS.md` and
`check-numbers.mjs` were renumbered with it. Nothing else in the body or
`ANSWERS.md` referred to the three by number. The body kept its 25 pages
(`data-close` stays on page 25); Practice was packed by hand onto pages
34–36, and the Answers page's *why* notes were divided after note 8 so the
key page does not overrun. Tested: Q27's printed answer changed from 23 to
25 — caught three ways, exit 1; restored.

### Flagged

| where | what | what it needs |
|---|---|---|
**One edit to Stage 1, made in review.** After Beyond's examples were numbered from 1, Stage 1's *the second way from Example 2* could be read as Beyond Example 2, a page later. It now reads *the second way from Example 2 in the chapter*. Stage 1 is otherwise word for word; the rule exists to keep its explanations, not an ambiguity the renumbering created.
| p001 → p002 | "Look at Fig. 10.2. Which shops are below the ground?" is on page 1; the figure is overleaf. Was so at `HEAD`; the opener cannot hold the figure | a decision for the opener |
| p015 → p016 | "Table 10.1 shows five days …" is overleaf from the table (the questions on it share its page) | acceptable; noted |
| Ex. 10.13 Q4, Q5 | facts: Everest 8,848.86 m (the 2020 China–Nepal survey); Challenger Deep about 10,935 m; Dead Sea shore about 430 m below sea level. Written from general knowledge, not from a source opened in this session | a recorded source (§5a *facts*) |
| Ex. 10.18 Q1 | the answer depends on the present year; `ANSWERS.md` works it for 2026 | the booklet's year |
| terms (§10) | *ascending*, *descending*, *predecessor*, *successor* do not appear in the body; the body says "in order, from the smallest" | a terms pass on the body, outside this brief |

### Not changed

NCERT's structure in the body: no example, check or exercise added; every
set, Think and Reflect and figure kept in order. None of §5's unused
components introduced.


## 20 September 2026 — reference numbering and reading order

- Figures and tables now share one chapter sequence; caption labels and prose references were migrated together, including cross-chapter references within Class 6.
- Dependent text and diagrams are kept together with c-figure-context where the revised layout needs it. The final bound-book audit distinguishes facing pages from page turns.
- Source content was checked against build/_class6-reference-before. All questions, worked mathematics and illustrations were preserved. The Data Handling closing paragraph alone was shortened to avoid an isolated final page.
- Validation and mapping: build/_class6-reference-checks; reproducible source check: build/check-class6-reference-revision.mjs.
