# Class 9 · Mathematics I · Chapter 3 — The World of Numbers

## Solved examples in examination formats, 23 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 16 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-9/ch03-world-of-numbers/`.

Source `build/jee-class9.mjs`; check `build/check-jee-class9.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p112; the answers stage still opens a fresh page.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) 44 |
| 2 | Single correct | (b) $\frac{13}{8}$ |
| 3 | Single correct | (c) It terminates after 4 places. |
| 4 | Single correct | (d) $\frac{41}{333}$ |
| 5 | Single correct | (a) $\frac{106}{45}$ |
| 6 | Single correct | (b) $(\sqrt{3} - \sqrt{2})(\sqrt{3} + \sqrt{2})$ |
| 7 | Multiple correct | (a), (d) |
| 8 | Multiple correct | (a), (c), (d) |
| 9 | Multiple correct | (a), (b), (d) |
| 10 | Multiple correct | (a), (b) |
| 11 | Numerical answer | 145 |
| 12 | Numerical answer | 9 |
| 13 | Numerical answer | 166464 |
| 14 | Matching | (d) P–3, Q–4, R–1, S–2 |
| 15 | Matching | (b) P–3, Q–4, R–2, S–1 |


## Brought to the Class 7 standard, 17 September 2026

Phase 5 of `PLAN-MATHS-CONSISTENCY.md`, worked from the Class 9 brief with
Chapter 6 as the model. Page move, examples, Beyond the Book and answers
were done in one pass, and every check was run on the chapter.

**Pages: 45 before (33 body + 12 Beyond, Crown Quarto), 48 after (31 body +
17 Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`, and the body was
refitted once (33 → 31 pages; stale p032–p033 went with the refit, and
`data-close` is on p031).

**All thirteen body examples set as steps.** Each is now *Solution*, Steps
and *Answer*, with a *Check* row where the old text checked the answer
(Examples 1, 3, 4, 5, 9, 10, 11, 12, 13). The working was already inside
every panel, as `.work` rows with wide text labels, `.work--centred` lines
and prose; it moved into the rows, with the old row label or the prose's
reason as the `.work__why`. Lead-ins that frame the question (Examples 1, 2,
3, 4, 5, 8, 9, 10, 11, 12, 13) stay as a paragraph before *Solution*;
remarks that are not steps stay at the foot of the panel.
- The 21 chips in the body all sat in examples. Most carried a row's
  result (*6 lots*, $\tfrac{9}{12}$, $2.667$), not a reason, so the result
  went into the row's maths and the old label became the reason. No chip is
  left in the body.
- Example 1's closing sentence now refers to the *Check* row it came from;
  Example 11's *which agrees with Example 7* became its *Check* row.
- p018: *not a good way to work out it* → *not a good way to work it out*
  (a slip from the language edit).

**Verified** by `build/check-body-maths.mjs`: 427 expressions and 185
numbers, none lost and none added; 13 examples before and after.

**Beyond the Book rebuilt to the four stages:**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, each explained in running text | Q4 and the opening kept word for word; **Q1, Q2, Q3 and Q5 replaced** (below); closing paragraph rewritten to describe the new five; `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems | **16 stepped examples** under nine `Type` heads; old Problem 1 is Example 13 (corrected), Problem 2 is Example 14 (corrected), Problem 5 is Example 6; Problems 3 and 4 were dropped (below) |
| 3 Problem Sets → **Practice** | 3 sets, 24 questions | **one run of 31** in six forms; old Set A Q1, Q4, Q6, Q8, Set B Q1, Q2, Q6 and Set C Q1, Q3, Q4, Q5 reused, the rest new |
| 4 Answers & Takeaways → **Answers** | key and why the options are wrong for four | key, every other answer, why the options are wrong for nine questions |

**Stage 1 gave the body away four times,** so the no-give-away rule won
(DESIGN-MATHS §6a), and each item was replaced with one of the same kind:
- Q1 ($\sqrt{2} + 1$) ended on *a rational number added to any irrational
  number gives an irrational number*, which is the answer to the body's
  Multiple-Choice Q15 → $3\sqrt{2}$, settled by closure under division; the
  second half (a sum of two irrationals) is kept word for word;
- Q2 ($\tfrac{7}{80}$) worked out the number of places from the larger power
  and then said *a denominator of $2^3 \times 5$ would give three places* —
  End-of-Chapter Q11 word for word, and the method of Q10 → $\tfrac{21}{150}$,
  where a student reads the $3$ in an unreduced denominator;
- Q3 ($\sqrt{2} + \sqrt{3}$) was the audit's borderline item: it needed
  Chapter 4's $(a + b)^2$ and $\sqrt{2}\sqrt{3} = \sqrt{6}$, neither taught
  here → a number whose square is $1 + \sqrt{2}$ is irrational, by closure
  alone (the audit's own suggestion, $3 - \sqrt{2}$, would itself answer
  Multiple-Choice Q15);
- Q5 (rationals between $\tfrac{1}{3}$ and $\tfrac{1}{2}$) printed
  $\tfrac{5}{12}$ and *over 120 there are nineteen*, the answer to Exercise
  Set 3.4 Q2 → the same student's claim about $\tfrac{2}{7}$ and
  $\tfrac{3}{7}$ ($\tfrac{5}{14}$, nine over 70).

**Other give-aways fixed:** old Problem 3 (*terminates after exactly four
places*) was Multiple-Choice Q14 with a 4 for a 3, and was dropped; old
Problem 4's option (d) printed $\sqrt{2} \times \sqrt{8} = 4$, the answer to
Multiple-Choice Q6, and the problem also leaned on Chapter 4 (audit), so it
was dropped and replaced by Example 10, which closure alone settles; old
Set A Q5 was Multiple-Choice Q5 with other numbers, Set A Q7 answered
Exercise Set 3.4 Q2 ($\tfrac{2}{5}$), Set A Q3 ($0.\overline{4} = \tfrac{4}{9}$)
half-answered Multiple-Choice Q3, Set B Q5 ($\tfrac{13}{125}$, *two places*)
answered End Q10, and Set C Q6 printed $0.\overline{9} = 1$ (Exercise Set 3.5
Q4, Multiple-Choice Q8) — all dropped. While writing: practice Q22 first
printed $\tfrac{1}{12}$, the answer to Exercise Set 3.3 Q5 (now
$\tfrac{5}{24}$); practice Q11 first used $\tfrac{7}{40}$, whose
$40 = 2^3 \times 5$ is End Q11's denominator (now $\tfrac{7}{16}$); and
Example 12's remark stating *the number of places is the larger power* was
cut, since End Q11 asks for that reason. `check-no-repeats` reports eight
pairs at 50%, each the same kind of question with other numbers (an
equation in $x$, a proof that a root is irrational, a decimal expansion, a
fraction from a repeating decimal).

**Audit findings (all five fixed):**
- **Wrong number, old Problem 1:** the remark said $\tfrac{123}{990}$ is the
  answer to $0.1\overline{23}$; it is $\tfrac{122}{990}$ ($\tfrac{123}{990}$
  is $0.1\overline{24}$). Example 13 now prints option (c) as
  $\tfrac{122}{990}$ and (b) as its reduced form $\tfrac{61}{495}$, so the
  remark is true.
- **Off-syllabus, Set A Q9** ($\sqrt{75} / \sqrt{3}$, dividing surds):
  replaced by practice Q9, $\sqrt{\tfrac{16}{25}}$, which needs only what a
  square root is.
- **Borderline, Stage 1 Q3:** replaced (above).
- **Borderline, Problem 4 options (b) and (d):** the problem was replaced by
  Example 10 (above).
- **Borderline, Set B Q3** (*between two rationals lies an irrational*,
  never taught): replaced by practice Q18, whose assertion is about
  rationals.
- **Coverage gap** (sign laws, absolute value, $\sqrt{n}$ on the line): Types
  1, 3 and 5 now work each; Example 8 constructs $\sqrt{13}$ with a new
  figure, Fig. 3B.1 (not $\sqrt{3}$ or $\sqrt{5}$, which a body Think and
  Reflect asks for).

**A second wrong number found:** old Problem 2's remark said option (d),
$\tfrac{235}{99}$, is $2.\overline{35}$. It is $2.\overline{37}$;
$2.\overline{35} = \tfrac{233}{99}$. Example 14 now prints (d) as
$\tfrac{233}{99}$.

**Worked examples in the chapter: 29** (13 body + 16 Beyond). The types:
integers and the laws of signs (with zero); working with rational numbers
(the equality law, the four operations); absolute value and distance;
rational numbers between two numbers; square roots on the number line;
rational or irrational (a proof that $\sqrt{6}$ is irrational, and closure);
terminating or repeating from the denominator; a repeating decimal as a
fraction; rational numbers close to an irrational one (Baudhāyana's
$\tfrac{577}{408}$ squared exactly, $\tfrac{22}{7}$ against Āryabhaṭa's
value).

**`ANSWERS.md` written** for Exercise Sets 3.1–3.5, the fourteen
end-of-chapter questions, the fifteen multiple-choice exercises, the seven
Think and Reflect boxes, the running-text question on p005, Stage 1, and all
31 practice questions.

### Verified

`check-numbers.mjs` passes **584 claims**. It evaluates 304 printed
identities — fractions, powers, square roots, absolute values, repeating
decimals and $\pi$, a letter the same block solves put back in, and a
truncated or rounded decimal allowed the error of its last digit — and 8
chains of $<$. It also:
- re-derives each body and Beyond example's Answer row, including the five
  Mādhava partial sums and the 500-term value $3.1396$;
- reads every exercise answer back off `ANSWERS.md`, including the
  thirteenths' two cycles, the full-reptend primes below 100 and Exercise
  Set 3.5 Q3 (vi) reduced exactly;
- measures Figs 3.2, 3.3, 3.4, 3.6, 3.7 (every spoke $\sqrt{n}$ and every
  edge 1 unit, within 0.5%) and 3B.1 from their coordinates;
- checks every multiple-choice question and example has exactly one right
  option, matching the key, derives each assertion–reason letter, and
  checks the wrong options the remarks explain;
- checks that `ANSWERS.md`'s key and practice working agree with the page.

**Break tests: 20 of 20 caught** (body answers, a Mādhava partial sum, a
Beyond step, two corrected options, key letters including an assertion–
reason one, key rows and a lettered part, practice options, a Stage 1 value,
Fig. 3B.1's point and leg, and five `ANSWERS.md` values and key). The first
full run found two faults in the check itself: a variable solved from a
truncated decimal ($x = 0.4545\ldots$) drifted when multiplied, so the check
now reads such a line as the repeating decimal its digits show; and a
fraction with a braced power in it was not read at all.

**Fitting:** nothing is clipped; the most any page runs into the margin is
1.6 mm (page 9). `orphans` finds 0 stranded openers, `check-labels` finds no
collisions, and `fit-options --fix` narrowed one option row (practice Q9).
Page 45 held one question before the case-based pair, so Q30 was settled
onto page 46 to sit with Q31 rather than leave Q31 alone before the Answers.
I read the proofs of pages 3, 32, 38, 46 and 47; on Fig. 3B.1, *O* was moved
off the ruler and the leg label *2* inside the triangle, and the caption's
$\sqrt{13}$ (which drops its radical sign in the italic caption) is now
*the square root of 13*, as Fig. 3.6's caption words it.

**Colour:** Fig. 3B.1 is a line drawing with lettered points; its fills
carry nothing. Pages 2, 5, 10, 11, 13, 15, 16, 27 and 38 were run through
`check-colour`.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 2 | 68% | Example 1, a panel |
| 3, 4, 12 | 80–86% | a § head, which may not be stranded |
| 8, 16, 19, 21, 22, 23 | 78–85% | the next example, a panel |
| 10, 13, 14 | 75–85% | an `h3` with its paragraph |
| 20 | 56% | Example 10, a panel |
| 27 | 80% | the End-of-Chapter band, which needs its questions under it |
| 31 | 49% | the last body page (`data-close`) |
| 34–37, 39, 40 | 74–84% | a `Type` head with its example, or an example panel |
| 38 | 56% | the Type 6 head, which needs Example 9 under it |
| 43 | 85% | a practice block too tall for the gap |
| 45 | 54% | the case-based pair, moved together (above) |
| 46 | 70% | **the Answers stage, which always opens a page** |
| 47 | 67% | the *Why the other options are wrong* rows, one block |
| 48 | 49% | the last page |

### Flagged, not done

- **End-of-Chapter Q13 says $k_2 - k_1 > n + 1$ is *needed*** to fit $n$
  numbers; $k_2 - k_1 \ge n + 1$ is enough. `ANSWERS.md` answers it and
  says so. A body edit.
- **Multiple-Choice Q6** ($\sqrt{2} \times \sqrt{8}$) needs
  $\sqrt{a}\sqrt{b} = \sqrt{ab}$, which the chapter never states; **End
  Q14** needs Chapter 4's $(x + y + z)^2$. Body questions, left.
- **The body's Multiple-Choice Q13** is an assertion–reason question in the
  old form (bold labels and four lettered choices). A body question, left.
- The p019 *as we have just seen* (sevenths) and p026 paragraph order flags
  below still stand.
- p032 (Stage 1's opening): KaTeX breaks $|a - b|$ across a line — the
  class-wide stylesheet issue, not fixed inline.
- The historical facts (Lebombo and Ishango bones, Baudhāyana, Āryabhaṭa,
  Mādhava, Lambert, Theodorus) have no source recorded here.

Language edit, 45 pages (p001–p033 chapter proper, p101–p112 Beyond the Book) —
the longest chapter in the book. Build after editing: 45 pages, all pages fit,
0 stranded openers, no label collisions, every option row fits. Every numerical
claim checked: Baudhāyana's $\tfrac{577}{408} = 1.4142156\ldots$, Āryabhaṭa's
$\tfrac{3927}{1250} = 3.1416$, all five partial sums of Mādhava's series, the
500-term value $3.1396$, $142857 \times 7 = 999999$, and the bridge's
$0.4\overline{27} = \tfrac{47}{110}$. All correct.

**3 fixes in 45 pages** — *computes* twice and *arbitrary* once. Nothing else in
the language needed touching, which given the length makes this the cleanest
chapter in the book by a wide margin.

It is also the best-argued. The organising claim is stated on p028 and earned on
every page before it: "Each stage was forced by a question the previous stage
could not answer. That is worth noticing, because it is how the subject grows:
not by decree, but because someone wrote down something the existing numbers
could not name." Then:

- **The √2 proof is laid out in seven numbered steps and then interrogated.**
  "Every step from 2 to 7 is forced; none of them can be the mistake. So the
  mistake is the only thing not forced — the assumption itself." Followed by the
  observation that the proof "never computes a single decimal place of $\sqrt2$.
  No amount of computing could have settled the question anyway."
- **The repeating-decimal method is shown failing.** p022 tries a one-place
  shift on $0.\overline{45}$, gets $9x = 4.0909\ldots$, and says: "Nothing is
  wrong with that line — it is perfectly true — but it has not got us
  anywhere." Very few textbooks spend a paragraph on a correct step that
  achieves nothing.
- **It warns against its own test.** p018: reading digits off a calculator
  "settles nothing: a hundred of them with no cycle are perfectly consistent
  with a cycle beginning at the hundred and first." And p026's tip: "A pattern
  you can describe is not the same as a cycle" — with $1.01001000100001\ldots$
  as the example.
- **The cycle-length ceiling is derived and then held to be a ceiling.** Dividing
  by $q$ there are only $q-1$ usable remainders, so the cycle cannot exceed
  $q-1$ — "That is a ceiling, not a forecast."

## FIXED

| before | after | check |
|---|---|---|
| **p015** "it never computes a single decimal place" | "it never works out a single decimal place" | L1 |
| **p018** "not a good way to compute it" | "not a good way to work it out" | L1 |
| **p105** "the options are rarely arbitrary" | "the options are rarely random" | L1 |

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p019 | C5 | "Sevenths reach it exactly — six digits, **as we have just seen**." Sevenths have not been seen. Example 7, immediately above, expands $\tfrac{3}{8}$ and $\tfrac{5}{11}$; $\tfrac17$ first appears on **p023**, four pages later, and its six-digit cycle is worked on p026. I checked every page from p001 to p019 for $\tfrac17$ and $0.142857$ — neither occurs. | Either move the sentence to p023, where the claim is actually established, or change it to a forward reference. As it stands the reader is told they have seen something they have not, in the middle of the one paragraph that distinguishes a ceiling from a forecast. |
| p026 | C3 | **A paragraph is stranded two sections downstream of what it explains.** § "A rational number with a secret" sets out the cyclic number $142857$ and says "Nothing was arranged here; it falls out of the long division by 7". The next heading, "What an irrational decimal looks like", then covers irrational expansions, the two-way test, and a second angle on the $\sqrt2$ proof. *Then* comes: "There is a reason the six digits behave so obligingly, and it is the $999999$ from earlier. Multiply the block by $7$ and you get $142857 \times 7 = 999999$ exactly…" — which belongs with the cyclic number, before the section changed subject. | Move it up, above the "What an irrational decimal looks like" heading. It is the explanation the earlier section promised and does not give. |
| p001 vs Class 8 Part I Ch 3 p002 | C3 | **The Lebombo bone has two different ages in one book.** Here: "about 35,000 years old". Class 8 Part I Chapter 3: "carries twenty-nine notches and is perhaps forty thousand years old". The provenance differs too — "found in the Lebombo mountains between South Africa and Eswatini" here, "found in South Africa" there. Both chapters give 29 notches and read them as a lunar tally, so this is the same artefact described twice with a 5,000-year discrepancy. | One figure, in both places. (Published estimates cluster around 41,000–43,000 years, so both numbers may want revisiting.) |
| p001–p005, p014–p015 vs Class 8 | C3 | **This chapter re-treads two Class 8 chapters without naming either.** Class 8 Part I Chapter 3 (Ten Symbols, Every Number) covers the pebble-matching herder, the Lebombo and Ishango bones, place value, śūnya, the Bakhshālī dot and Brahmagupta's rules — all of which appear again here. And Class 8 Part I Chapter 1's Beyond the Book already proves $\sqrt2$ irrational by the same contradiction, in a section the student has done. Neither is referenced. | The overlap may be deliberate revision, but it should say so. A reader who did Class 8 carefully is entitled to know which parts are a second pass and which are new — and the Class 8 √2 proof is the natural thing to build on rather than repeat. |
| book-wide | M1 | **Fractional powers are still undefined.** Class 8 Part I Chapter 4 p003 explains why $\sqrt{x}$ is not a polynomial by asserting "$\sqrt{x}$ is $x^{1/2}$", and I flagged there that nothing in Class 8 defines a power with a fraction in it. I have now searched every Class 9 chapter: **no fractional exponent appears anywhere in the book.** This chapter handles roots entirely in $\sqrt{\ }$ notation, which is correct and self-consistent — so the gap is not here, but the one line in Class 8 Ch 4 that depends on it is now confirmed to have nothing behind it. | Fix it in Class 8 Chapter 4 by dropping the $x^{1/2}$ half of that sentence. Nothing in either class needs the notation. |
| p029–p032 | — | **Markup inconsistency in the exercise sets.** Most question lists are wrapped in `<div class="c-practice c-practice--cont">`; p029's Q8–Q10, all four starred questions on p030, p031's Q9–Q13 and p032's Q14–Q15 are bare `<ol class="c-questions">` with no wrapper. The build passes and the pages fit, so this may render acceptably — but it is not what the rest of the book does, and the wrapper is what carries the exercise band. | Worth a look at a proof of pages 29–32 before print. I have not changed it: it is layout, not language. |
| p033 | — | The closing page of the chapter proper is **8% full** — one three-line tip box ("Next year the line is left behind altogether…"). It carries `data-close`, so the fill check exempts it, and the tip is a good closing note. | Either lift the tip onto p032, which is at 100%, or accept a near-empty leaf. Recording it because the fill map makes it look like an error and it is a choice. |


## 21 September 2026 — figure/table reference review

Reviewed this chapter in the all-maths reference audit. Figures and tables now use one chapter sequence, including Beyond the Book; captions and references were updated together. Questions, calculations and artwork were preserved. The chapter and its volume were rebuilt; detailed layout checks and any remaining warnings are recorded in build/_all-maths-reference-checks/.
