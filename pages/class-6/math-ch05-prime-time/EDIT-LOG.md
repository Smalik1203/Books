# Class 6 · Mathematics I · Chapter 5 — Prime Time

## Brought to the Class 7 standard, 16 September 2026

Phase 1 of `PLAN-MATHS-CONSISTENCY.md`, worked by hand as the model for the
other nine Class 6 chapters. The chapter was read whole before anything was
changed, and every check below was run on the chapter, not on a page.

**Pages: 28 before (20 body + 8 Beyond), 32 after (21 body + 11 Beyond).**
The four extra pages are the cost of stepped examples and of a practice
stage that now runs to 31 questions in six forms. Beyond the Book is 11
pages, inside §6a's "ten or so".

### What changed

**A palette of its own.** `chapter.json` gains `"palette": "olive"`. Class 6
declared none, so its three working colours were the book's throughout; §11
item 1 and the plan's phase 1 move it to a palette per chapter, as Classes
7–10 have. The palette is chosen to match the chapter's own accent slot:
`palette-olive.css` sets `--teal: #564a02`, which is byte-identical to
`CHAPTER_ACCENTS[5]` in `build/build.mjs`. So the furniture accent and the
structure colour are the same colour rather than two, no stylesheet changed,
and the accent list's interleaving still keeps consecutive chapters about
140 degrees apart. **The rest of `maths-clear` is untouched** — ragged-right
setting, no hyphenation, and the outline tip disc all survive, checked on a
proof.

**All five body examples set as steps.** *Solution*, a step to a
`.work__row`, an *Answer* row, the reason in two to four words in a
`.work__why`. Layout only: no number, no question, no order, none of
NCERT's structure. Three sentences that were conclusions became a step row
or a reason — Example 1's two *so they are (not) co-prime* lines, and
Example 5's *we can multiply in any order*.

**Verified,** by a script that pulls every number and every maths span out
of each `.c-example` at `HEAD` and after the change and compares them.
Nothing was lost in any of the five. One example gains two mentions: the new
*Answer* row in Example 1 names 15, 39, 4 and 9 again, which the original
had no line for. That is the only direction the check tolerates, and it
reports the gains so they can be read.

**Beyond the Book rebuilt to the four current stages** (§6a):

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, explained in running text | **kept word for word**; only `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems solved in prose | **14 stepped examples**, Examples 1–14, under five `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, A/B/C | **one numbered run of 31**, all six forms, band carrying the numeral |
| 4 Answers & Takeaways → **Answers** | key plus why the options are wrong | same, renamed; `.c-stage__for` removed |

Nineteen worked examples in the chapter now (5 body + 14), against §5a's bar
of twelve. Every topic the chapter teaches is worked under a type: common
multiples and factors, primes and composites, prime factorisation,
co-primes, divisibility tests.

**Nothing repeats the body.** Checked by script, question against question,
not by eye. One repeat was found and removed: a practice question read *In
Jump Jackpot, Grumpy puts the treasures on 45 and 75 … which jump sizes land
on both?*, which is Exercise 5.2 Q7 with new numbers. It was replaced by one
that runs the idea backwards — the common factors are given and the second
treasure has to be found. The seven pairs that remain above 50% similarity
are all *same type, different instance*, which is what a Solved Example and
a practice question are for.

**`ANSWERS.md` written** for every question the chapter sets: the six
exercise sets, every Think and Reflect, and Beyond the Book's practice, with
the working, what a drawing must show, and a worked instance under each
*answers will vary*.

### Verified

`check-numbers.mjs` is kept beside the pages and re-derives **386 claims**
from first principles — trial division, divisor lists, common multiples —
and compares them with what is printed. It has three parts: every arithmetic
identity read off the pages and evaluated (144 of them); the claims
arithmetic cannot check, such as whether a factor is prime or a list of
factors complete; and every multiple-choice and assertion–reason question,
checked to have exactly one right option that matches the printed key. Part
D does the same for `ANSWERS.md`.

Two spans are not arithmetic and are skipped, both on p010, both containing
the chapter's own `???` placeholder. The script names them rather than
dropping them silently.

**Three wrong numbers were caught and fixed**, which is what the script is
for:

| where | printed | should be |
|---|---|---|
| Beyond, answer to Q27 | factors of 252 above 10 listed without **42** | 12, 14, 18, 21, 28, 36, **42**, 63, 84, 126, 252 |
| the script itself | `73□4` read as `7000 + 100d + 4` | the digit is in the tens place: `7304 + 10d` |
| the script itself | Q27's expected list typed by hand, so it drifted the moment the page was corrected | the answer rows are now read back **out of the page** |

The script was then tested against injected errors rather than trusted:
changing `40 × 249 = 9960` to 9860, changing question 30's largest row
length from 42 to 21, changing 29(a) from 20 to 13, changing 31(b) from 24
minutes to 12, and changing an `ANSWERS.md` value — each was caught. A
whole-row check was **not** enough for a lettered answer (the 42 in part (b)
masked the wrong 42 in part (c)), so each part is now read out on its own.

**The prime puzzles are solved by the script**, and the chapter's claim that
*each puzzle has only one solution* is verified for all four, and for the
worked one on Fig. 5.12.

**Fitting.** Nothing is clipped. Page 29 runs 2.6 mm into the bottom margin,
inside §5a's 3 mm. Ten short pages, each held by a block that cannot move —
see below. `orphans`: 0 stranded openers in 32 pages. `check-labels`: no
collisions. `fit-options`: every option row fits.

**Colour.** Read in greyscale and under simulated deuteranopia, protanopia
and tritanopia. Nothing depends on hue alone: the two panels are told apart
by their labels and their shape, every term chip is also bold, and the
worked-example tab carries its word. Olive and the palette's action blue
stay distinct under all three simulations.

### Short pages, logged

`gaps` names the block holding each one open. None can be closed by the
packer, and §11 forbids closing the exercise-set ones by splitting the set.

| page | fill | held by |
|---|---|---|
| 12 | 75% | next page opens with a `.c-example` — a panel, never divided |
| 16 | 86% | a `.c-reflect` panel |
| 17 | 60% | an exercise band; `keepExerciseSets` holds the set whole (§11) |
| 20 | 48% | the `.c-summary`, indivisible by design |
| 24, 25 | 82% | a `.c-example` panel too tall for the gap |
| 26 | 85% | an `h3` that may not be stranded, and the example under it |
| 27 | 77% | the Practice band, whose set is kept whole |
| 30 | 83% | questions 28–31: **held by the Answers stage, which always opens a page** |

**Answers starts a fresh page** — decided 16 September 2026, after this
chapter showed the key to questions 17–27 printed under question 31 on the
same page, in view while that question was being worked. `refit` had put the
head back under question 31 when it was moved by hand, so the rule went into
`build/repack.mjs` (a `.c-stage` titled *Answers* always opens a page).

**Beyond's examples numbered from 1**, corrected the same day: they were
first numbered 6–19, on from the body's five, which is what the phase-1 brief
said. Every Class 7 chapter starts Beyond's examples again at Example 1, and
the Chapter 1 agent noticed the difference. `check-numbers.mjs` now checks
both runs — body 1–5, Beyond 1–14.

**Assertion–reason set in Class 7's form**, corrected the same day: the four
choices are stated once in a `<p class="c-practice__note">`, and each
question is two lines, *Assertion (A):* and *Reason (R):*, with no option
list. This chapter first printed an (a)–(d) list under every question, and
Chapters 7 and 10 copied it from here. `check-numbers.mjs` now also checks
that the assertion and reason printed under each number are the ones its
truth values were worked for — a reworded assertion fails it (tested).

The shorter questions left page 29 at 57%, so the division was refitted once
more: 12 pages became 11, question 31 moved up beside 28–30, and the
*Why the other options are wrong* head sits under the key with three of its
four notes. The last page holds the fourth note and the closing paragraph.
One build reported *overflow check did not report* — the measurement had not
run, with other chapters building at the same time; a rebuild measured every
page and all fit.

### Flagged

| what | why it is flagged |
|---|---|
| **`settle.mjs` on the last body page writes into the Bridge opener.** Pushing a block off p020 when there is no p021 landed the chapter's summary and tip inside `p101.html`, under the *Beyond the Book* band. | Recovered by hand, and `p101` restored from `HEAD`. A trap for anyone refitting a chapter body: check what `settle` wrote before building. |
| **`refit` prefers a 3.4 mm overflow to a 21st page.** Run on the body after the examples were stepped, it packs to 20 pages with page 20 over the bar, twice. | The 21st page was made by hand instead, with the summary and tip opening it. Do not re-run `refit … body` on this chapter without re-checking page 20. |

### Not changed

NCERT's structure in the chapter body. No example, check or exercise was
added inside it; the six exercise sets, every Think and Reflect, and every
figure are as they were. None of §5's unused components
(`.c-goals`, `.c-check`, `.c-fact`, `.c-mistake`, `.c-mindmap`, `.c-vocab`)
was introduced.
