# Class 6 · Mathematics I · Chapter 10 — The Other Side of Zero

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
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, A/B/C, 24 questions | **one numbered run of 30** in six forms, the band carrying the numeral |
| 4 Answers & Takeaways → **Answers** | key and notes | key, every other answer in `work--trace`, six *why the other options are wrong* notes; opens its own page |

Types: 1 comparing and ordering · 2 adding · 3 subtracting · 4 tokens and
zero pairs · 5 money, heights and temperature · 6 integer grids ·
7 patterns with integers. **22 worked examples** in the chapter (5 + 17).

Practice: multiple choice 1–12, assertion–reason 13–16, very short 17–21,
short 22–25, long 26–28, case-based 29–30. Key: a 4, b 4, c 5, d 3.
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
| Q28, build an amazing grid · Ex. 10.16 Q3 | an extension of an open question, with a method given |

**Removed as repeats:** Q15 as first written — A "the sum of two negative
integers is always negative", R "a positive plus a negative is always
negative". Those are the answers to two parts of Ex. 10.18 Q4 (the sign
question; the coordinator's note calls it Q5), so read strictly it repeats
the body. Replaced by A $-3 \gt -8$, R "$-3$ is further from 0 than $-8$
is": the order of integers against their distance from 0, a mistake no body
question asks about. Its key stays (c), and its *why* note was rewritten.
Q24 as first written (tokens, "how many zero pairs",
the same as Ex. 10.11 Q1 with new numbers) — replaced by a pocket worth 0
losing two negatives. Beyond Ex 15 as first written ("write the next three
numbers", the same as Ex. 10.18 Q7) — recast to ask for the 10th number.
Old stage 2's Leh temperature rise was not carried over (the same as
Ex. 10.18 Q6, Dras), nor old Set C's dice question (Ex. 10.17 Q3).

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

**`check-numbers.mjs` — 798 checks, exits 0.** 384 relations read off the
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
as two numbers of Q28; floors to mark (10.3 Q4) taken for sums; and a note's
distractor sum the note-reader missed (now counted). Old stages 2–4 were
replaced, not audited.

**Fitting.** `refit … body` once, then two figure fixes by hand;
`refit … bridge` twice (the second after the Answers-on-a-new-page rule),
then hand fixes: Beyond Ex 17 added to page 32 and the *why* block divided at
a row. When the assertion–reason questions lost their option lists, page 34
fell to 46%, so questions 12–30 were repacked by hand across pages 34–36,
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
| 21 | 38% | Exercise Set 10.18, a page on its own, kept whole |
| 25 | 57% | `data-close` — the chapter's last page |
| 30 | 85% | Beyond Ex 11, a panel |
| 32 | 85% | the practice run, which starts a page because it is taller than one |
| 35 | 78% | question 30, a case with a table (84 mm), which does not fit the 51 mm left |
| 36 | 37% | held by the Answers stage, which always opens a page |
| 38 | 19% | the last page |

**Resolved — Fig. 10.18.** NCERT's PDF text layer reads $-20, -7, -14,
-11$ for the first grid's last row, where this book prints $-17$. The
coordinator checked NCERT's PDF: the grid rises by 3 along each row and
falls by 9 down each column, and the game only works on grids built that
way, so $-17$ is the value the grid requires and the text layer's "$-7$" is
almost certainly a lost digit. `check-numbers.mjs` checks the printed grid
has that structure. Nothing to change.

### Flagged

| where | what | what it needs |
|---|---|---|
**One edit to Stage 1, made in review.** After Beyond's examples were numbered from 1, Stage 1's *the second way from Example 2* could be read as Beyond Example 2, a page later. It now reads *the second way from Example 2 in the chapter*. Stage 1 is otherwise word for word; the rule exists to keep its explanations, not an ambiguity the renumbering created.
| p001 → p002 | "Look at Fig. 10.2. Which shops are below the ground?" is on page 1; the figure is overleaf. Was so at `HEAD`; the opener cannot hold the figure | a decision for the opener |
| p015 → p016 | "Table 10.1 shows five days …" is overleaf from the table (the questions on it share its page) | acceptable; noted |
| Ex. 10.13 Q4, Q5 | facts: Everest 8,848.86 m (the 2020 China–Nepal survey); Challenger Deep about 10,935 m; Dead Sea shore about 430 m below sea level. Written from general knowledge, not from a source opened in this session | a recorded source (§5a *facts*) |
| Ex. 10.18 Q1 | the answer depends on the present year; `ANSWERS.md` works it for 2026 | the booklet's year |
| Ex. 10.17 Q5; Ex. 10.18 Q6, Q7 | not in NCERT's *Figure it Out*; added by an earlier pass | none; noted |
| terms (§10) | *ascending*, *descending*, *predecessor*, *successor* do not appear in the body; the body says "in order, from the smallest" | a terms pass on the body, outside this brief |

### Not changed

NCERT's structure in the body: no example, check or exercise added; every
set, Think and Reflect and figure kept in order. None of §5's unused
components introduced.
