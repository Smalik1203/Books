# Class 8 · Mathematics I · Chapter 6 — The Same to Both Sides

## Brought to the Class 7 standard, 17 September 2026

Phase 3 of `PLAN-MATHS-CONSISTENCY.md`, worked by an agent against the
Chapter 1 model. The chapter was read whole before anything changed, and
every check below was run on the chapter.

**Pages: 29 before (17 body + 12 Beyond, Crown Quarto), 31 after (16 body +
15 Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`. The body was
refitted once, after the examples were stepped.

**All fourteen body examples set as steps.** *Solution*, a Step row for each
line of working, a *Check* row where the example had one (the old `check`
row with its `true` chip; *true* is now the `.work__why`), and an *Answer*
row. The old wide labels (`$-7$ both sides`, `expand both`, `the sentence`)
became the `.work__why` of their rows. Hints before the working (*What stands
in the way is the $+7$*) stay above *Solution*, as in the model. Three
closing sentences that began with the answer were turned so the Answer row
carries it: Examples 10, 11 and 12 (*So the son is 12 …* → Answer row, then
*Read it back against the words*). In Examples 13 and 14, *Which is false* /
*Which is true* followed a working line that is now followed by the Answer
row, so they read *The last line is false / true*. No example added, moved or
renumbered. `build/check-example-stepping.mjs`: 14 examples, 0 lost
mathematics.

**Page 16, the summary.** After the refit the summary missed page 16 by a few
millimetres and left it 38% full, with the summary alone on page 17. Items 7
and 11 were each tightened by one rendered line (*come off the two pans
together without anyone knowing what they weigh* → *come off both pans
without anyone knowing what they weigh*; *which is Chapter 4's identity
wearing an equals sign* → *an identity (Chapter 4)*; no fact changed), and the
summary was moved onto page 16 by hand. Page 16 now closes the body at 100%
and carries `data-close`; `p017.html` was deleted.

**Beyond the Book rebuilt to the four current stages** (§6a):

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 8 `.c-try` questions, answered in the next stage | **the same questions, each followed by its own explanation**, word for word except as below; `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | the worked answers to stage 1 | **17 stepped examples**, Examples 1–17, under seven `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, 34 questions | **one numbered run of 31**, all six forms, band carrying the numeral |
| 4 Answers & Takeaways → **Answers** | key and why the options are wrong | key, every other answer in `.work--trace` blocks, why the options are wrong for 10 questions; the *What to carry forward* paragraphs kept without their head |

The old Stage 2 was *The same questions, worked*, so its eight explanations
moved under their own questions, dropping only the `.c-solution` wrapper and
its title (*A letter that is not the unknown*, etc.). The Stage 1 advice
paragraphs that stood between the questions and the explanations (*The sixth
question is the one worth slowing down for …*) are kept word for word at the
end of Stage 1, as the model did. One pointer fixed: *Try each one before
turning the page* → *before reading what follows it*.

**Types in Solved Examples:** checking a solution; the letter on one side
(negative and fractional answers); letters on both sides; brackets;
fractions; from words to an equation (numbers, ages, money, angles); no
solution, every number, and a letter to choose. **Worked examples in the
chapter: 31** (14 body + 17 Beyond).

**Practice:** 14 multiple choice (answers b a c d a c d b b c a d d b —
a 3, b 4, c 3, d 4), 4 assertion–reason in the Class 7 form, 4 very short,
4 short, 3 long, 2 case-based. The old 34 multiple-choice questions were not
kept, and the run was written new: Set A was one-step drill, and Set C 1, 2,
6, 10 and 12 re-asked body Examples 13–14, Ex 6.6 Q6 and Stage 1's trick,
while Set C 5 printed Ex 6.6 Q9's answer.

### Give-aways found and fixed

| where | printed | answered | now |
|---|---|---|---|
| Stage 1, the *whole-number claim* explanation | *If $ax = b$ with $a$ and $b$ whole and $a$ not zero, the solution is $\frac{b}{a}$* | Exercise Set 6.2 Q9 (solve $ax = b$; what must be said about $a$) | paragraph deleted — the smallest edit; the explanation is complete without it |
| old Set C 5 | *Every linear equation has exactly one solution* judged false | Exercise Set 6.6 Q9 | question dropped with the old sets |
| old Answers C4 | points to *the seventh question of stage 1* | — (ordinal to a `.c-try`) | row dropped with the old sets |

`build/check-no-repeats.mjs` reports three pairs at 50–62%, each *same type,
different numbers*: practice Q12 and Beyond Example 13 against body Example 10
and Ex 6.5 Q4 (ages; different numbers and different relations), and Beyond
Example 17 against Ex 6.6 Q3 ($4(x + k) = 4x + 12$ against
$2x + k = 2x + 9$). Every number Beyond prints was also read against the
body's exercise list; none is a body answer.

**`ANSWERS.md` written** for every question the chapter sets: Exercise Sets
6.1–6.6, both Think and Reflects, Stage 1 (pointing to its explanations),
and the 31 practice questions with their working. *Answers will vary* items
(6.2 Q7, 6.6 Q5, the first Think and Reflect) carry a worked instance.

### Verified

`check-numbers.mjs` is kept beside the pages. It passes **575 claims**: 87
printed arithmetic identities; all 21 *Solve* examples (body and Beyond)
solved again by a linear solver, the Answer row read back, and **every
working line in the letter checked to hold at that answer** (or to keep the
none/every case); the word examples, Stage 1 and the practice answers
re-derived by search and read back out of the key one lettered part at a
time; every multiple-choice question has exactly one right option matching
the key; the assertion–reason letters derived; `ANSWERS.md`'s key equals the
page's; 109 *$equation$ gives $v = n$* lines in `ANSWERS.md` solved again;
and all 60 equations the body's exercises ask to be solved are answered
there. Statements printed to be judged false ($3 = 5$, $100 = 60$, …) are
listed, and checked to be false.

**Break tests — 11 caught, 0 missed:** body Example 3's Answer $x = 4$;
key 7 (d) → (a); `ANSWERS.md` $7 - 3t = 19$ gives $t = -5$; key 30 (c)
*6 ride tickets* (5 also appears in part (b)); Beyond Example 13's mother 36;
Stage 1's list ending 26; body Example 6's check $= 32$; Q9 option 36 → 32
(two right options); `ANSWERS.md` *7 pens and 15 pencils*; Beyond Example 5's
working line $5x = 25$; key 31 (a) *11 GB*. Two faults in the check itself
were fixed while writing it: the letter finder failed on a whole equation, so
nothing was being solved; and rounded solutions were compared too tightly.

**No wrong numbers found** in the old chapter or its old answer key.

**Fitting.** Nothing is clipped. Page 27 runs 1.1 mm into the bottom margin,
inside §5a's 3 mm; its question 16 was moved to page 28 by hand after a
two-column option row (a class no stylesheet defines, `c-parts--2`) was set
as one column. The *Why the other options are wrong* head and its first two
rows were moved from page 31 onto page 30 by hand (page 30: 76% → 90%).
`orphans`: 0 stranded openers in 31 pages. `check-labels`: no collisions.
`fit-options`: every option row fits. No body question names a figure, so
nothing needed reprinting. Proofs of pages 4, 17, 20, 21, 27, 29, 30, 31 were
read.

**Colour.** Pages 1, 3 and 6 were read in greyscale and simulated
colour-vision (`build/check-colour.mjs`). Fig. 6.1 marks the removed weights
by dashed outline as well as tint, and the bag carries its letter; Fig. 6.2 is
labels only. Nothing depends on hue alone.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 3 | 85% | Example 1, a panel |
| 4 | 72% | Example 3, a panel |
| 10 | 86% | Exercise Set 6.4's band |
| 11 | 76% | Example 10, a panel |
| 20 | 80% | the Solved Examples stage head |
| 21 | 85% | Example 4, a panel |
| 25 | 87% | a `Type` head with its example |
| 28 | 79% | the case-based questions |
| 29 | 67% | **the Answers stage, which always opens a page** |
| 31 | 68% | the last page |

### Flagged, not done

- Stage 1 keeps its ordinal references (*The sixth question*, *The last
  question*) to `.c-try` bands, and the coaching sentence *the move to reach
  for first*, because it is kept word for word.
- Examples 7 and 9 in the body end on $7x = 17$ with no division row; the
  Answer row carries $x = \frac{17}{7}$ as the old working did.
- Case-based Q30 (c) breaks between ₹ and 285 at the line end (the ₹ sits
  outside the maths span, as in the model).
- No *Did you know?* in this chapter; no facts need a source.

Language edit, 29 pages (p001–p017 chapter proper, p101–p112 Beyond the Book).
Build after editing: 29 pages, no overflow, 0 stranded openers, no label
collisions, every option row fits. All 34 answers in Stage 4 checked against the
questions — all correct.

12 fixes in 29 pages. The prose is as plain as Chapter 4's and the teaching is
the best in the volume on one particular count: it refuses to hand over
*transposition* as a rule. p005's Think and Reflect says outright that "moving
the $7$ across and changing its sign" describes nothing that happens, asks the
student what is really being done to both sides, and then asks why the shortcut
comes out true anyway. The summary repeats it. That is the single most-taught
piece of nonsense in Indian Class 8 algebra and this chapter dismantles it.

Two other things worth recording, because later chapters should copy them. Every
worked example ends with a check, and the check is always against *the equation
you were given* — with the reason stated (a line of your own working may already
carry the mistake). And § 6.7 treats "no solution" and "every number" as answers
rather than as failures, then shows both turning up in taxi fares.

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted. Every rupee amount written as `₹$…$` is wrapped in `<span class="nb">`, so the sign can no longer end a line with its number on the next. Nothing reflowed; `check-numbers.mjs` gives the same count of claims with and without the spans.

## FIXED

| before | after | check |
|---|---|---|
| **p001** "that single rule is what the chapter's title is" | "that single rule is the chapter's title" | L3 |
| **p004** "Dividing by zero is barred because it is barred everywhere, and the reason bites here in particular" | "Dividing by zero is not allowed, here or anywhere else, and the reason matters here in particular" | L1 — *barred* twice, then *bites* |
| **p005** "the commonest error in the whole chapter" | "the most common error in the whole chapter" | L1 |
| **p012** "Naming the unknown properly is not a formality." | "Naming the unknown properly is not just for show." | L1 |
| **p014** "Neither announces itself: both look like perfectly ordinary questions" | "Neither gives any warning: both look like…" | L3 |
| **p016** "These two cases are not a curiosity got up for a textbook." | "These two cases are not something invented for a textbook." | L3 |
| **p016** Q5 "one that every number satisfies" | "one that every number solves" | L1 |
| **p017** summary 4 "Division by zero is barred" | "Division by zero is not allowed" | L1 |
| **p105** solution title "One equation is enough to sink it" | "One equation is enough to disprove it" | L3 — and *disprove* is the word the solution's own first line uses |
| **p111** "Division by zero is barred everywhere" | "Division by zero is not allowed anywhere" | L1 |

No refitting needed.

**Left alone deliberately.** The *small print* metaphor for the
not-zero condition on division (p104, p112) — it is a contract image every
reader has met, it is used consistently in both places, and it carries the one
condition in the chapter that changes an answer.

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p001 | M1 | "A value that makes the two sides agree is a **solution** of the equation, and it is also called a **root**." Chapter 1 spent eleven pages on *root* meaning the number a square or cube came from, and fixed $\sqrt{\ }$ as its symbol. This is a second, unrelated meaning of the same word, introduced in one clause as an aside, in the same book and the same year. A student who has done Chapter 1 has every reason to read "the root of $2x = 6$" as $\sqrt{6}$ or $\sqrt{2}$. | Either drop *root* here — nothing in the chapter or its exercises uses it again, so it costs nothing — or say plainly that this is a different use of the word. The second is better if the word is wanted for Class 9. |
| p008, p016, p112 | M1 | The chapter solves in letters ($ax = b$ on p006 Q9, $ax + b = cx + d$ on p008 Q9) and finds conditions on the letters, which is good and unusual. But p105 then says the solution of $ax = b$ is "always a **rational** number, however awkward the coefficients". *Rational* is not defined anywhere in Class 8 — Class 9 Chapter 3 (The World of Numbers) is where it lands. | One word: "a fraction". The sentence needs nothing else. |
| p108 (built page 25), p110 (built page 27) | — | Two Beyond the Book pages are short: 83% with 35mm of white at the foot, and 86% with 29mm. **Not caused by this edit** — neither file was touched. Both are multiple-choice pages where the next question could not fit, so the white is held by a question block and not by prose. | `refit bridge` would close them, or the two sets can be rebalanced by hand. Recording it so it is not read later as a language edit. |
| p017 Q6 and Q7, p109 Q6 | C7 | Exercise 6.6 Q6 gives two taxi firms charging the same rate per kilometre and asks for the distance at which they cost the same — a *no solution* question, and a good one. But it sits in the exercise set for § 6.7, immediately under the section that explains exactly that case, and p109's multiple-choice Q6 is the same question again with the numbers changed. A student meeting Q6 straight after the section has been told the answer's shape twice. | Move one of the two into an earlier set, where the surprise still works. The content is right; only the placement gives it away. |
