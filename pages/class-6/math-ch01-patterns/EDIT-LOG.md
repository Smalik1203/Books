# Class 6 · Mathematics I · Chapter 1 — Looking for Patterns

## The maths-v2 trial chapter, completed 26 September 2026

**This supersedes every description of By the Book and Beyond the Book
further down this log.** The chapter is the first in the maths-v2 design
(`css/maths-v2.css`, palette `prism`, edition `196x276-large`), 29 pages:

* **Body p001–p013**, NCERT's structure, ending on a **Summary** page
  (p013, `data-close`, `.c-summary`).
* **By the Book p090–p095**, written to BY-THE-BOOK.md: 50 questions —
  very short 10, short 10, long 10, assertion and reason 5, case-based 5,
  objective 10 — part heads with a rule, no marks lines.
* **Beyond the Book p101–p110**, by format: the tried-and-explained
  questions with no head, then Single correct · More than one correct ·
  Numerical answer · Matching · Paragraph-based, each two solved examples
  then its practice (4 · 4 · 3 · 2 · 2). Answers on a fresh page; the key
  is set in two-row runs so its pages fill.
* ANSWERS.md's By the Book and Beyond sections rewritten to match.

Checks at close: every arithmetic identity on every page recomputed (79,
none wrong); no lone word on any last line; no stranded opener; no label
collision; every option row fits. `check-numbers.mjs` still predates this
layout — it was patched past one crash but its figure, Beyond and booklet
sections describe the old chapter and it stops at §1.4's Example 1.
Short pages left by design: p021, p025 and p026 of Beyond (a whole example
or paragraph question waiting for the next page), p027 (the last practice
page before Answers opens fresh).

## Solved examples in examination formats, 20 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 19 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-6/math-ch01-patterns/`.

Source `build/jee-class6.mjs`; check `build/check-jee-class6.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p113; the answers stage still opens a fresh page.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (b) 37, 50 |
| 2 | Single correct | (d) 233 |
| 3 | Single correct | (a) 91 |
| 4 | Single correct | (c) 21 |
| 5 | Single correct | (b) Nonagon; 12 cm |
| 6 | Single correct | (d) 768 |
| 7 | Multiple correct | (a), (c) |
| 8 | Multiple correct | (b), (c), (d) |
| 9 | Multiple correct | (a), (d) |
| 10 | Multiple correct | (a), (b), (d) |
| 11 | Numerical answer | 625 |
| 12 | Numerical answer | 200 |
| 13 | Numerical answer | 6 |
| 14 | Matching | (c) P–2, Q–4, R–3, S–1 |
| 15 | Matching | (a) P–4, Q–3, R–1, S–2 |


## Syllabus audit fixes, 17 September 2026

The Beyond the Book syllabus audit made three findings about this chapter. All three were checked against the pages and fixed.
The body and Stage 1 were not touched.

**Pages: 21 before (10 body + 11 Beyond), 22 after (10 body + 12 Beyond).**

| finding | what was done |
|---|---|
| borderline: Beyond Ex 2 (1, 4, 10, 20, 35) needs gaps that are triangular numbers and the tetrahedral numbers, which the body never meets | Replaced with a question of the same kind: *What comes next: 2, 8, 18, 32, 50, …?* Halving each number gives the square numbers, so the answer is $2 \times 36 = 72$. Stage 1 Q4 already uses double the triangular numbers, so the audit's suggested sequence was not used |
| borderline: the n-th odd number is $2n - 1$, worked backwards as add 1 and halve (Ex 6–7, Practice Q3, Q7, Q20, Q22), is never stated | Stated once, from the picture, in a paragraph under the Type 3 head. The n-th L-shape of Fig. 1.5 has n dots on each arm and a shared corner, so it has $n + n - 1$ dots. To go back, add 1 and halve. The old note under Ex 6 that gave a second reason was removed |
| gap: cube numbers, and counting a regular polygon's sides (§1.3, §1.6) | Two examples added. **New Ex 6** (Type 2): a cube built from 64 small cubes, finding its layers, the small cubes in each layer, and the small cubes with no paint. **New Ex 15** (Type 6, first): a 72 cm wire bent into a regular polygon with 8 cm sides is a nonagon, and the same wire bent into a hexagon has 12 cm sides. The polygon example counts sides only. It does not say why a polygon has as many corners as sides, because Exercise Set 1.6 Q1 asks that |

**Renumbering.** Beyond now has **19 examples**, where it had 17. Old Examples 6–13 are now 7–14, and old Examples 14–17 are now 16–19. No running text refers to an example by number. `ANSWERS.md` stage 2 was renumbered and gained the two new answers. `check-numbers.mjs` B6 was rewritten for the new numbering, with checks on:

- the new Ex 2's sequence, halves, next square and answer
- the new Ex 6's cube number, each step and answer
- the Type 3 paragraph's three claims
- the new Ex 15's division, polygon name, prefix, hexagon side and answer

Each new value was changed on purpose in a scratch copy. All 13 changes were caught. The script now passes 625 checks and reports all clear.

**Refit.** `refit … bridge` was run once and gave 13 pages. Ex 2 and Ex 6 were then trimmed by one step each, and the refit was run a second time (checked with `--dry` first), which gave 12 pages.

- Page 18 (p108) holds Ex 18–19 and is **57% full**. Practice is a whole set under `keepExerciseSets`, so it starts on p109. This white is logged here, not padded.
- Pages 15 and 16 are 87% and 85% full. Each is held open by an example panel that will not fit in the space left.

**Checks.**

- The build fits all 22 pages.
- orphans: 0.
- fit-options: clean.
- check-labels: clean.
- check-no-repeats: nothing close.
- `data-bridge` is on p101–p112, and the Answers stage opens p112.

## Brought to the Class 7 standard, 16 September 2026

This is phase 1 of `PLAN-MATHS-CONSISTENCY.md`, following the model in
`math-ch05-prime-time`. The whole chapter was read before any change, and
every check below was run on the whole chapter.

**Pages: 18 before (10 body + 8 Beyond), 21 after (10 body + 11 Beyond).**
The body keeps its ten pages. Beyond the Book is 11 pages, within §6a's
"ten or so".

### What changed

**Palette.** `chapter.json` gains `"palette": "ember"`, from chapter 1's
slot in the mapping. `palette-ember.css` sets `--teal: #70391c`, which is
byte-identical to `CHAPTER_ACCENTS[1]` in `build/build.mjs`. Nothing else
in `chapter.json` changed.

**The body's one example set as steps.** Example 1 (p006) now reads
*Solution*, four step rows and an *Answer* row, with *the numbers left* as
the one reason. The sentence *You can add numbers in any order…* explains
rather than works, so it stays a paragraph after *Solution.*; *So the
pattern works for 6 as well* stays as the closing paragraph. The total and
$36 = 6 \times 6$ share the Answer row, which kept page 6 inside its text
block (a separate Step 5 row put it 1.9 mm into the margin).
`build/check-example-stepping.mjs`: **0 lost mathematics**, no gains.

**Beyond the Book rebuilt to the four current stages.**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, explained in running text | **kept word for word**; only `.c-stage__for` removed (text compared with `HEAD`: identical) |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems solved in prose | **17 stepped examples** (Beyond Examples 1–17) under six `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, A/B/C, 25 questions | **one numbered run of 30** in all six forms; the band carries the numeral |
| 4 Answers & Takeaways → **Answers** | key, and why the options are wrong | a letter key for 1–16, `work--trace` answers for 17–30, *why the other options are wrong* for Q4, 7, 15 and 16; starts a fresh page |

The chapter now has **18 worked examples** (1 in the body and 17 in
Beyond), against §5a's bar of twelve. The body had only one, so every
Beyond example is new. Every topic is worked under a type:

1. finding the rule of a sequence (Beyond Ex 1–3: squares plus 1, sums of
   triangular numbers, the 12th Virahānka number)
2. numbers as pictures of dots (Beyond Ex 4–5: a triangle from its bottom row, a
   hexagon ring by ring)
3. adding odd numbers (Beyond Ex 6–8: to 49, backwards from a total, a sum not
   starting at 1)
4. adding up and then down (Beyond Ex 9–10: backwards from 169, a top number
   written twice)
5. sequences that are connected (Beyond Ex 11–13: 1 to 20 from the up-and-down
   pattern, two neighbouring triangular numbers from their sum, powers of 2
   to 512)
6. counting in shape sequences (Beyond Ex 14–17: a tournament as a complete graph,
   stacked triangles from their count, Koch lines, the lines joining a
   hexagon's corners)

**Practice forms and their questions:**

| form | questions |
|---|---|
| multiple choice | 1–12 |
| assertion–reason | 13–16 |
| very short answer | 17–21 |
| short answer | 22–26 |
| long answer | 27–28 |
| case-based | 29–30 |

The key is a:4, b:4, c:4, d:4. Assertion–reason is in Class 7's form: the
four choices once in a `.c-practice__note`, then *Assertion (A):* and
*Reason (R):* with no option list. The case-based questions carry no *Case
study* label. No Beyond question names a figure; every value a question
needs is printed in the question.

**What was kept from the old stages 2 and 3.** A3, A7, A10, B1, B2, B3, B4,
B5, B6, B8, C2 and C6 survive as practice questions 1, 2, 12, 13, 14, 15,
6, 3, 4, 9, 7 and 8. Old B3's and B6's notes survive, rewritten, under
*why the other options are wrong*, and the old closing paragraph is kept.

**Old items dropped because they repeat the body:**

| old item | the body question it repeats |
|---|---|
| Problem 1 (sum of the first 15 odd numbers) | the Think and Reflect after Fig. 1.5 (first 10 and 100) |
| Problem 2 (both triangular and square) | Ex 1.3 Q3 |
| Problem 3 (stacked triangles, 5 rows) | Ex 1.6 Q7 (10 rows); Beyond Ex 15 runs it backwards instead |
| Problem 4 (complete graph, 7 points) | Ex 1.6 Q6 (8 points); Beyond Ex 14 runs it backwards instead |
| Problem 5, C5 (sum of powers of 2, plus 1) | Ex 1.4 Q6; Beyond Ex 13 applies the result to a longer sum |
| A1, A2, A4, A9 (next term of a Table 1.1 sequence) | Ex 1.2 Q2, Ex 1.3 Q4 |
| A6, A8 (sums printed in §1.4) | the §1.4 displays |
| C1 (adding up the All 1s) | Ex 1.4 Q3 |
| C3 (6 × 5th triangular + 1) | Ex 1.4 Q7 |
| C4 (8th stacked squares shape) | Ex 1.6 Q7 |

A5 (sides of an octagon), A11 (7-row triangle, read off Table 1.1) and B7
(10th square number) were dropped for room.

**Nothing repeats the body.** `build/check-no-repeats.mjs`: *no question in
the division is close to one in the body* (34 body questions, 74 Beyond
items). Judged by hand as well: Q7 (sum to 39) and Beyond Ex 6–8 are the
same type as the body's first-10 and first-100 Think and Reflect, but each
needs a step the body does not ask for (finding how many odd numbers, or
removing a part); Q8 and Beyond Ex 14 run Ex 1.6 Q6 backwards.

**`ANSWERS.md` written.** Exercise Sets 1.1 to 1.6, both Think and Reflect
boxes of §1.4 and the one after Fig. 1.4, Beyond's stage 1, the key with the
working behind every option, and answers 17–30. Every *answers will vary*
item has a worked instance, and every drawing question says what the
drawing must show.

### Verified

**`check-numbers.mjs`**, kept beside the pages: **597 checks passed, 0
failed**, exit 0. Four parts:

- **A** evaluates **173 arithmetic identities** from the pages and from
  `ANSWERS.md`, and skips none. Sums written with $\cdots$ are expanded from
  the terms printed either side of the dots (common difference, common
  ratio, or up-and-down), so $1 + 2 + \cdots + 20 + \cdots + 2 + 1 = 400$ is
  evaluated, not skipped.
- **B** re-derives what arithmetic cannot:
  - **every sequence from its rule** — twenty sequences are generated
    (Table 1.1's ten, hexagonal, Koch counts, rings, rectangle numbers,
    squares plus 1, sums of triangular numbers, and others). **Every printed
    run of three or more numbers** on every page and in `ANSWERS.md` (90 of
    them) must be a stretch of one of them, forwards or backwards. The seven
    that are not (for example *6, 10, 28, 36*, the even triangular numbers)
    are each produced by a computation;
  - **Table 1.1 term by term**, and the next three of each sequence in
    `ANSWERS.md`;
  - **every figure counted from its SVG**: dots per label in Figs 1.1 and
    1.2 and their row lengths; Fig. 1.3's cube sizes from the n × n faces;
    the opener sketch; Fig. 1.4's corners, copy corners and dashed joining
    lines (0, 1, 2, 4, 8); Fig. 1.5's L-shapes by layer (1, 3, … 11) and
    colours; Fig. 1.6's 27 cubes from three 3 × 3 faces and its 19 hexagon
    dots ($27 - 8$); Fig. 1.7's sides, names and equal side lengths;
    Fig. 1.8's points and lines, with every pair joined exactly once;
    Fig. 1.9's small squares and small triangles counted cell by cell from
    the drawn edges (up and down triangles separately); Fig. 1.10's
    straight lines (3, 12, 48, 192) and that every shape stays inside the
    first triangle's circle, as p008 claims;
  - the body's claims (6 dots make a triangle and 7 do not, 1225, Arjun's
    17, body Example 1's groups using every term once);
  - stage 1's five answers;
  - **all 18 examples' Answer rows, read back from the page**, and their
    step values. Beyond numbers its examples from 1, so the body's Example 1
    and Beyond's Example 1 share a label: every lookup is scoped to one
    division and every check is named *body Ex 1* or *Beyond Ex N*. The
    tabs themselves are checked: the body reads 1, Beyond reads 1 to 17;
  - **every practice answer, and each lettered part on its own**, read back
    from the page; the question's own numbers are tied to the question text.
- **C** reads each multiple-choice question's options off the page and
  checks that exactly one is right and that it is the printed key. The
  *must be true* statements are evaluated over ranges. Assertion–reason is
  graded from computed A and R, and each question is tied to the assertion
  and reason printed under its number.
- **D** checks `ANSWERS.md`: its key against the page's, every number of
  answers 17–30 against the page's row, and the exercise answers.

**The script was tested against injected errors.** Seven were introduced
together, and all seven were caught (11 failures, exit 1):

- Beyond Ex 8's $225 - 25 = 200$ → 210
- the answer to 29(b), 66 → 65
- key 9 (c) → (b)
- one grid line deleted from the 3 × 3 stacked square in Fig. 1.9
- `ANSWERS.md` Ex 1.2 Q3, 128 → 256
- Table 1.1's Virahānka 21 → 20
- Q16's assertion reworded to *… is 64.*

The files were then restored from copies and their checksums verified
identical to the copies. (A first attempt used `sed -i`, which silently
converted `p002.html` from CRLF to LF and failed to inject; that is why the
restore compared checksums.)

**Wrong numbers found and fixed.** No printed number in the chapter was
wrong, at `HEAD` or after. Three errors were caught in the checking itself:

| where | what was wrong | fixed to |
|---|---|---|
| `check-numbers.mjs` | the attribute reader matched `[a-z-]+`, so `x1`, `y1`, `x2`, `y2` were never read: Fig. 1.4's dashed lines, Fig. 1.8's lines and Fig. 1.9's grid all counted as 0 or as one lump | `[a-z0-9-]+`; every figure count now comes from its own shape |
| `check-numbers.mjs` | the $\cdots$ expander took the step for the second gap of an up-and-down sum from the whole run so far (+1), so $1 + 2 + 3 + \cdots + 10 + \cdots + 3 + 2 + 1$ would not expand | the step comes from the piece before the gap, or the piece after it when that piece is one term |
| `check-numbers.mjs` | the helpers for practice parts and example Answer rows printed the page's value under *computed* | labels corrected |

**Fitting.** Nothing is clipped, and no page runs into the bottom margin.

| check | result |
|---|---|
| build | *all pages fit* |
| `orphans` | 0 stranded openers in 21 pages |
| `fit-options` | every option row fits its columns |
| `check-labels` | no labels collide |
| `gaps` | every page is at least 88% full |

`refit … bridge` was run twice, each time after the content changed. After
the first run, the last page of practice held question 30 alone (29%) ahead
of the Answers page, so question 30's table became one sentence, question
29's table was turned on its side, and question 30 was moved by hand onto
the page before; Beyond went from 12 pages to 11. Beyond Ex 2 (then numbered Example 3) lost one row
and `unsettle` pulled it back onto page 12, and the second `refit` spread
the examples again. The Practice band then left page 17 at 56%, because
`keepExerciseSets` starts the whole practice run on a fresh page, so
Beyond Ex 17 (then Example 18) and its check paragraph were written into that page, and a
closing paragraph after Beyond Ex 14 filled page 16.

**Colour.** Pages 1, 3, 4, 5, 8 and 17 were run through
`build/check-colour.mjs`, and the greyscale proof of page 4 and the
deuteranopia proof of page 5 were looked at. The Fig. 1.4 copy corners stay
lighter than the originals in greyscale; the Fig. 1.5 L-shapes are
separated by drawn lines as well as by colour. Ember reads on the stage
numeral, the heads, the running head and the folio.

### Beyond renumbered to match Class 7

Beyond's Solved Examples were first numbered on from the body, Examples 2
to 18, as the brief said. Every Class 7 chapter starts Beyond's examples
again at Example 1, so they were renumbered to **Beyond Examples 1–17**
after the chapter was accepted; the body keeps its Example 1. Only the tab
labels changed, so no refit was needed. `check-numbers.mjs` now checks the
tab sequence in each division and names every example check *body Ex* or
*Beyond Ex*, and `ANSWERS.md` lists Beyond's examples under their own stage
heading by their own numbers. The script was tested by changing Beyond's
Example 5 tab to 6: it failed, and the tab was restored.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 10 | 37% | the chapter's close (`data-close`): the summary and tip end the body |

Pages 14 and 17 are at 88%, on the bar. Page 20, the last practice page
before the Answers stage, is at 95%.

### Flagged

| where | code | what | what it needs |
|---|---|---|---|
| p004, Ex 1.3 Q1 | §5a | *Copy the pictures in Figs. 1.1, 1.2 and 1.3* prints on page 4; the figures are on page 3, the other side of the same leaf. The question and its figures do not face each other. This was so at `HEAD`. | A body refit that puts the set beside the figures, or its own figure. Not done here, because the body keeps NCERT's structure and `keepExerciseSets` holds the set whole. |
| Fig. 1.4 caption | §5a | *The copy's corners are the second colour* makes colour the carrier. The two survive greyscale by value, but nothing else marks them. | A shape or label for the copy corners. Body figure left untouched. |
| body | §5a rules | Only two key ideas: *what mathematics does* and *odd numbers and squares*. The up-and-down rule, *the counting numbers add up to the triangular numbers*, and *neighbouring triangular numbers add up to a square* are shown working but never stated. | A `.c-keyidea` for each, in a language pass. |
| body | §10 terms | No *term* (of a sequence) and no *Fibonacci* beside *Virahānka numbers*, the word most school papers use. | Add at first use, in a language pass. |
| p001 | facts | Chandrayaan-3's landing, August 2023, has no source recorded. | A source line. (The landing was on 23 August 2023.) |
| p002 | facts | *Virahānka … more than 1300 years ago* has no source recorded. Dates for Virahānka are usually given as the 6th to 8th century. | A source, and a check of the claim against it. |
| stage 1, p101 | — | The first explanation relies on *the L-shapes of Fig. 1.5*, ten pages back. It explains a question and is not itself a question, and stage 1 is kept word for word. | Nothing now. |
| `refit` / `settle` traps | — | Neither was hit: `settle` was not used, and the body was not refitted. `refit … bridge` writes a scratch chapter `pages/class-6/_refit-math-ch01-patterns` and removes it. | — |

### Not changed

NCERT's structure in the chapter body is unchanged. No example, check or
exercise was added inside the body. The six exercise sets, every Think and
Reflect, and every figure are as they were. None of §5's unused components
was introduced. Table 1.1 keeps its number, which Chapter 3's Ex 3.9 Q8
refers to.


## 20 September 2026 — reference numbering and reading order

- Figures and tables now share one chapter sequence; caption labels and prose references were migrated together, including cross-chapter references within Class 6.
- Dependent text and diagrams are kept together with c-figure-context where the revised layout needs it. The final bound-book audit distinguishes facing pages from page turns.
- Source content was checked against build/_class6-reference-before. All questions, worked mathematics and illustrations were preserved. The Data Handling closing paragraph alone was shortened to avoid an isolated final page.
- Validation and mapping: build/_class6-reference-checks; reproducible source check: build/check-class6-reference-revision.mjs.
