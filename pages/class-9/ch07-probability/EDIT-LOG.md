# Class 9 · Mathematics I · Chapter 7 — The Measure of Chance

## Solved examples in examination formats, 23 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 15 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-9/ch07-probability/`.

Source `build/jee-class9.mjs`; check `build/check-jee-class9.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p115; the answers stage still opens a fresh page.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) $\frac{9}{20}$ |
| 2 | Single correct | (b) $0.55$ |
| 3 | Single correct | (c) 0.65 |
| 4 | Single correct | (d) 0.4 |
| 5 | Single correct | (a) $\frac{9}{25}$ |
| 6 | Single correct | (b) 15 |
| 7 | Multiple correct | (a), (b), (c) |
| 8 | Multiple correct | (a), (c) |
| 9 | Multiple correct | (a), (c), (d) |
| 10 | Multiple correct | (a), (b), (c) |
| 11 | Numerical answer | 420 |
| 12 | Numerical answer | 30 |
| 13 | Numerical answer | 9 |
| 14 | Matching | (c) P–3, Q–4, R–2, S–1 |
| 15 | Matching | (b) P–4, Q–2, R–3, S–1 |


## Brought to the Class 7 standard, 17 September 2026

Phase 5 of `PLAN-MATHS-CONSISTENCY.md`, worked against the Class 9 brief with
Chapter 6 as the model. Page move, examples, Beyond the Book and answers were
done in one pass, and every check was run on the chapter.

**Pages: 28 before (18 body + 10 Beyond, Crown Quarto), 36 after (18 body +
18 Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`, and the body was
refitted once. After the refit the § 7.3 head was stranded at the foot of
page 13 (4.8 lines under it), so it and its paragraph were settled onto page
14 by hand.

**All seven body examples set as steps.** Each was a question, a lead-in and
a `.work` table with wide labels and the result in a `.chip`, then a *So …*
line. Each is now *Solution*, Steps and *Answer*: the wide label became the
`.work__why`, the chip value joined its step (*$\dfrac{8}{50}$, which is
0.16*), and the *So …* line became the Answer row. A lead-in that frames the
problem stays before *Solution* (Examples 1, 2, 4, 5, 6, 7); Example 3 keeps
its lead-in and the spelled-out word, and *There are 11 letters…* became its
Step 1. A remark that is not a step stays at the foot of its panel.
Example 2's lead-in (*The possible outcomes are 1, …, 6 — six of them. The
favourable ones …*) moved into Steps 1 and 2.

**Reason chips:** the body had none; its chips held values, and the ones in
the examples were folded into their steps. The four chips left are the
probabilities in p015's event table (`$\tfrac36 = \tfrac12$` and so on),
which mark values, not reasons.

**Verified** by `build/check-body-maths.mjs`: 67 expressions and 161
numbers, none lost and none added.

**Fig. 7.3 redrawn.** Its middle deck was two cards of one colour and one of
the other, placed at *even chance*, which is $\tfrac13$ or $\tfrac23$, not
$\tfrac12$; its leader lines met the bar at 0.11, 0.5 and 0.98; and its
`aria-label` said *four decks* over three. Now three decks of four cards —
none, two and four red — with leaders meeting the bar at 0, ½ and 1
(checked from the coordinates by `check-numbers.mjs`). The label text is
unchanged; the `aria-label` now says *three decks of four cards*.

**A colour word that did not match the page.** The prose and caption said
*purple* and *green*, but the mulberry palette prints `dg-fill-c-soft` as a
pale rose and `dg-fill-b-soft` as a pale green, so no card was purple. The
"purple" cards are now `dg-fill-c`, a solid red that also reads dark in
greyscale, and *purple* → *red* in the prose (five times), the caption and
the `aria-label`.

**p011 Think and Reflect:** *Think carefully before turning the page* →
*before reading on*. After the refit its answer (*The gambler's fallacy*) is
on the same page.

**Beyond the Book rebuilt to the four stages:**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 9 `.c-try`, explanations in Stage 2 | the explanations moved under their own questions, word for word, *Solution* titles dropped; Q1–Q5 kept; **Q6–Q9 replaced** (below); `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | *The same questions, worked* | **15 new stepped examples** under nine `Type` heads, one new figure (Fig. 7B.1) |
| 3 Problem Sets → **Practice** | 3 sets, 25 questions | **one run of 33** in six forms: 18 multiple choice, 4 assertion–reason, 3 very short, 4 short, 2 long, 2 case-based |
| 4 Answers & Takeaways → **Answers** | key and why seven options are wrong | key (letters a 5, b 5, c 6, d 6), every other answer in two trace blocks, why the options are wrong for nine |

**Stage 1's old explanations answered the body three times,** so the
no-give-away rule won, and each item was replaced with one of the same kind;
a fourth (Q9) was replaced for the audit:
- Q6, three coins (*exactly two heads or three heads*), printed the
  three-coin sample space and $\tfrac38$, which is Exercise Set 7.4 Q3 (i)
  and (ii) → **four coins**, exactly three heads against four heads
  ($\tfrac14$ against $\tfrac{1}{16}$), with the same two closing paragraphs
  adjusted;
- Q7, the pens drawn without putting back, explained why the second draw
  depends on the first, which is Exercise Set 7.4 Q4's answer → the same box,
  but the question is whether the unseen second pen is as likely to be blue
  as the first, settled by listing the 20 ordered pairs ($\tfrac{12}{20}$
  both times). This also follows the audit (*found by recounting*);
- Q8, the complement, said *why* $P(\text{not } E) = 1 - P(E)$ holds, which
  is p008's Think and Reflect, and printed $1 - \tfrac18 = \tfrac78$ for at
  least one head in three tosses, which is Exercise Set 7.4 Q3 (iii) → a
  class of 40 with $P(\text{glasses}) = 0.35$, counted two ways (26), and
  *not a multiple of 7* from 1 to 50 ($\tfrac{43}{50}$);
- Q9, the spinner with unequal sectors, read probability from area, which the
  body never teaches (audit, borderline) → the audit's own suggestion, a die
  marked 1, 1, 1, 2, 2, 3 ($\tfrac12$, $\tfrac13$, $\tfrac16$). The closing
  paragraph that described it as *set on a spinner* now says *set on a die*.

**Kept, and judged:** Q2 (eight heads in a row) is near Exercise Set 7.2 Q6
(two runs of 50 tosses, one student says the coin is biased). They are
different questions — a run against a fair coin's odds, and the spread
between two samples — and Q2's explanation does not answer Q6's numbers.

**Other give-aways fixed:** old Set A Q2 ($P(\text{odd})$ on a die) was
Exercise Set 7.3 Q3 (i), Q5 (two coins, $n(S)$) was body Example 7, Q8 (one
die, $n(S)$) was Exercise Set 7.3 Q1, Q10 (the probabilities add to 1) was
p009's text; all dropped. Old Set B Q2 (the gambler's fallacy as
assertion–reason) was body Example 6 — dropped. Old Set B Q4
($P(\text{sum} = 7)$) printed Stage 1's own value — now a sum of 8. Old Set C
Q6's remark would have printed 12 for one coin and a die, the size asked in
Exercise Set 7.3 Q2 (i) — no remark is printed for it now. Old Set C Q2's
options $\tfrac38$ and $\tfrac78$ are the Exercise Set 7.4 Q3 answers — now
$\tfrac14$ and $\tfrac58$. `check-no-repeats` reports three pairs above 50%,
each the same kind of question on different data (ASSESSMENT and MISSISSIPPI
against body Example 3's PROBABILITY; a canteen survey against Exercise Set
7.2 Q2).

**Audit findings (from *Audit Class 9 maths Beyond*):**

| finding | what was done |
|---|---|
| or-events with overlap (*even and > 5*, *multiple of 3 or 4*, *divisible by 3 or 5*) — borderline | kept, and every answer now lists the outcomes: Stage 1 Q4's union is printed as a set, practice Q8's why-row lists $\{3, 4, 6, 8, 9, 12\}$, Q13's names 15 and 30; **Type 7 · Events as sets** (Example 11) works *and* and *or* with the sets written out |
| a 52-card deck (a heart; a face card) — borderline | both replaced: a bag of counters (practice Q5) and 26 alphabet cards (Q14) |
| a spinner with unequal sectors — borderline | replaced by a die with repeated faces (Stage 1 Q9) |
| drawing without replacement — borderline | kept, settled by recounting: Stage 1 Q7 by listing pairs, practice Q7 by counting what is left |
| gap: estimating a population from a sample | **Type 5 · From a sample to a population**: Example 8 (faulty bulbs in a batch of 12000) and Example 9 (choosing the sample); practice Q28 and Q32 (c) |

**A wrong number, fixed:** Stage 1 Q4's explanation said *An or would have
given six — the union*. The union of $\{2, 4, 6, 8\}$ and $\{6, 7, 8\}$ has
**five** numbers; it now says *five — the union $\{2, 4, 6, 7, 8\}$*.

**Worked examples in the chapter: 22** (7 body + 15 Beyond). Every topic has
a type: the scale and its three forms; experimental probability; theoretical
probability by counting (repeated letters, primes); finding a count from a
probability; from a sample to a population; what many trials do; events as
sets; two stages, listed and by tree (Fig. 7B.1, new); the opposite event.

**`ANSWERS.md` written** for Exercise Sets 7.1–7.4, the four Think and
Reflect boxes, Stage 1, and all 33 practice questions.

### Verified

`check-numbers.mjs` passes **518 claims**. It evaluates 165 printed
identities (fractions, decimals, percentages, and approximations to the
rounding they print), checking an equation in one unknown against the value
its block solves it to. It also:
- re-derives every body and Beyond example's Answer row by listing the
  sample space (the letters of PROBABILITY and ASSESSMENT, the primes to 25,
  two and four coins, two dice, ordered pairs of pens);
- checks every step that prints a value beside its maths (*which is*,
  *about*);
- checks the p014 sample spaces against their $n(S)$, and p015's event table
  set by set;
- reads every exercise answer back off `ANSWERS.md`;
- measures Fig. 7.3 (each deck's share of red against where its leader meets
  the bar), Fig. 7.4 (widths against 20, 15, 10, 5 of 50) and Fig. 7B.1 (six
  paths, each sum right);
- checks every multiple-choice question has exactly one right option,
  matching the key, and derives each assertion–reason letter;
- checks that `ANSWERS.md`'s key, practice working and Stage 1 values agree
  with the page.

**Break tests: 19 of 19 caught** (body answers, a body step, Fig. 7.3's
leader and a card's colour, Beyond answers, Fig. 7B.1's sum, Stage 1 values
and a verdict, key letters including an assertion–reason, key rows and a
lettered part, an option, `ANSWERS.md` values and key). The first run missed
one: Example 5's step value was found in its Answer row as well, so the
check now reads every *which is* / *about* value against its own step.

**Fitting:** nothing is clipped; page 20 runs 0.8 mm and page 35 1.3 mm into
the margin (page 32 ran 3.7 mm until its first short-answer question was
settled forward). `orphans` finds 0 stranded openers, `check-labels` finds no
collisions, and `fit-options` passes. I read the proofs of pages 4, 6, 29,
34 and 35.

**Colour:** pages 2, 3, 4, 9, 12, 16 and 29 were run through `check-colour`.
Fig. 7.3's red cards read dark against pale green in greyscale; Fig. 7.4's
four shares are named beneath the bar; the trees are line drawings.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 1–3 | 75–83% | the next page opens with an `h3`, which needs its matter under it |
| 4 | 76% | Exercise Set 7.1's band with Q1 (five parts), too tall for the gap |
| 7 | 64% | Example 3, a panel |
| 8 | 82% | the § 7.2.3 head with Example 4 |
| 13 | 61% | the § 7.3 head, moved over so it is not stranded |
| 14 | 86% | the § 7.3.1 head |
| 15 | 74% | Example 7 with Fig. 7.6, a panel |
| 18 | 41% | the last body page (`data-close`) |
| 23–29 | 72–86% | a `Type` head with its example, or an example panel |
| 33 | 74% | the case-based question 32, too tall for the gap |
| 34 | 73% | **the Answers stage, which always opens a page** |
| 35 | 60% | *Why the other options are wrong* with its rows |
| 36 | 55% | the last page |

### Flagged, not done

- **Exercise Set 7.3 Q2 (iii)** (*the result of a cricket match for one
  team*) depends on the format: a Test can be drawn, a limited-overs match
  cannot. `ANSWERS.md` accepts either list with its reason.
- **Exercise Set 7.4 Q2** does not say how many pens of each colour the box
  holds; the tree and the $\tfrac13$ assume equal numbers. `ANSWERS.md` says
  so.
- **Exercise Set 7.4 Q4** raises drawing without replacement, which the
  chapter never works; its answer is descriptive.
- **The Moksha Patam paragraph and Fig. 7.5** (p012–p013) have no source
  recorded.
- Stage 1 keeps its coaching sentences (*Try each one before you read on*;
  *This is the flaw that made the first survey worth taking*), word for
  word.

Language edit, 28 pages (p001–p018 chapter proper, p101–p110 Beyond the Book).
Build after editing: 28 pages, all pages fit, 0 stranded openers, no label
collisions, every option row fits. Every number re-derived — Examples 1–7, all
four exercise sets, the nine Stage 1 questions and their Stage 2 solutions, and
all 25 multiple-choice answers. **All 25 answers are correct**, including Set C1
($\tfrac{11}{36}$ by way of the complement), C4 ($\tfrac{7}{15}$ after removing
15 and 30 from the double count) and C6 ($2\times2\times6 = 24$).

**2 fixes in 28 pages**, and the defect-word scan came back almost empty: no
*hence*, *thus*, *determine*, *obtain*, *utilise*, *tabulate*, *arbitrary*,
*commonest*, *earns its keep* or *respectively* in twenty-eight pages, and — as
in Chapter 6 — **no "Grade"**. The register is the plainest in the book.

Four things worth recording:

- **It says what probability *is* in the first line and then keeps to it.** "A
  ruler measures length, a jug measures volume, and probability measures how
  likely something is." Then the reason a number beats a word: "Is 'quite
  likely' more or less than 'a good chance'? Two people will not agree, and
  there is no way to settle it."
- **It distinguishes randomness from ignorance, which almost no school book
  does.** p002: "there is no fact of the matter until the slip is drawn.
  Contrast that with a sealed envelope holding tomorrow's timetable: the answer
  already exists, and you simply have not seen it… Probability handles the first
  kind. It is the mathematics of situations that are genuinely unsettled, not of
  secrets."
- **It marks the assumption under the formula, and shows the formula failing.**
  p007: "Put a lump of lead under the 6 and the formula still gives $\tfrac16$,
  and is wrong. Divide favourable by possible and you have assumed the outcomes
  are equally likely. Nothing in the arithmetic ever checks that they are." Then
  p104 builds a whole worked problem on exactly that: the sums of two dice look
  like a complete sample space and are not equally likely. "This is the most
  useful mistake in the chapter, because it is invisible."
- **Bias is handled honestly twice.** p010: "a biased sample gives a confident
  wrong answer", and "Asking 50 students at random beats asking 500 who all
  queued at the same stall, because the queue has already sorted them by what
  they like." p105 pushes it further: the repair-shop survey "does not give a
  vague answer; it gives a precise answer to a different question" — and then
  says what question that is, and grants that the survey answers it.

Two other things: the gambler's fallacy gets the right mechanism rather than a
slogan — "Not by correction, but by dilution. The three extra 6s are never
cancelled — they simply become a smaller and smaller part of a growing total" —
and the Moksha Patam pages place Snakes and Ladders properly, with the point
that the die had to be fair "or the moral would not land".

## FIXED

| before | after | check |
|---|---|---|
| **p001** "Consider three questions:" | "Here are three questions:" | L1, L5 — an instruction to nobody, where the chapter elsewhere addresses the student directly |
| **p004** "adding purple **counters** one at a time" | "adding purple **cards** one at a time" | L3 — the passage is about a deck of cards, says *cards* four times, and changes the noun in the last sentence; *counters* is a different apparatus two pages later in Exercise 7.1 Q3 |

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| **p104** | C4 | **A count is wrong.** The spinner solution finishes: "'Even' holds four of the eight numbers and 'greater than 5' holds three, but only two numbers are in both… An ***or*** would have given **six** — the union, with 6 and 8 counted once each rather than twice." The union of $\{2,4,6,8\}$ and $\{6,7,8\}$ is $\{2,4,6,7,8\}$ — **five**, not six. The sentence's own arithmetic says five: four plus three is seven, less the two counted twice. (The six may have wandered in from Set B Q6, where the union of the multiples of 3 and of 4 up to 12 really is six.) I have not changed it — it is a number. | *five*, and $\tfrac58$ if the fraction is wanted. This is the only arithmetic error I have found in either Class 9 volume outside Class 8 Part II Ch 1's Example 7. |
| p014, p017, p107 | M1, C3 | **One word is used for two different things, four pages apart.** p010 introduces *sample* in its statistical sense and builds a section on it: "The 50 students are a **sample**; the 1500 are the **population**." Then p014: "the number of outcomes in it is the ***sample size***, written $n(S)$." For two coins that makes the *sample size* 4. A reader who has just learned that a sample is the 50 students will read $n(S)$ as the number of trials, which is the one confusion this chapter cannot afford — the whole of § 7.2 turns on telling trials apart from outcomes. The non-standard term then propagates: Exercise 7.3 Q1 asks for "$n(S)$", and Set A Q5 asks "the **sample size** $n(S)$ is". Standard usage is *the size of the sample space*, and the chapter uses that phrasing itself in Set A Q8 — "The sample space of a single roll of a die has **size**". | Drop *sample size* and say *the size of the sample space*, which is already in the book one page away in the question set. Three occurrences. |
| p018 summary vs p001–p017 | C6, M1 | **The summary claims a result the chapter never states.** Point 8 of "What this chapter established": "an event and its opposite share the whole: $P(\text{not } E) = 1 - P(E)$." The chapter proper never states that rule and never uses the notation. What it has is p008's Think and Reflect, which *asks* the student to find it ("Add your answer to $P(\text{vowel})$… You should get 1. Why must that always happen?"), and p009's remark that the probabilities of all the outcomes add to 1. The rule itself is first written down in the summary, and first proved on **p106**, in Beyond the Book. Set A Q6 then tests it. | Either state it in § 7.3.2, where events and subsets are being defined and the one-line argument is immediately available, or change the summary to say it follows from the total being 1 rather than that the chapter established it. As it stands a student who worked through the chapter meets a formula in the summary that was never on a page. |
| p011 vs p011–p012 | C6 | **An overclaim the chapter contradicts on its own next page.** p011, closing the law of large numbers: "What the law promises is the direction, not the speed — that more evidence **moves you towards the answer, never away from it**." More evidence certainly can move you away: the same page says "Ten rolls of a fair die can easily give three 4s, suggesting $0.3$", the Think and Reflect beside it is built on four 4s in four rolls, and p012's answer is that the run is *not* cancelled, only diluted. What the law promises is convergence in the long run, not a monotone approach. | "…that more evidence takes you closer in the long run, however it wanders on the way." The chapter has the honest version two paragraphs later; it only needs the claim to match it. |
| p102 vs p101 | C4 | **Back-references to questions that carry no numbers.** p102 discusses "the third and the seventh" and then "The ninth", and all three references are correct — third is the two-dice sum, seventh the pens, ninth the weighted spinner. But the nine questions sit in `.c-try` bands, which are rules above and below with no counter (see `css/bridge.css`), and they run across a page turn: four on p101, five on p102. To find the seventh a reader must count nine unnumbered boxes over two pages, having no reason to have been counting. Stage 2 then answers them under titles rather than numbers, so there is nothing to match against either. | Either number the `.c-try` bands in this stage or refer to them by their subject, as Stage 2's own solution titles do — "the two dice", "the pens", "the weighted spinner". The titles exist; the ordinals do not. |
| p104 | M1 | ***Union* is used once and never introduced.** The spinner solution ends "…the union, with 6 and 8 counted once each rather than twice". Nothing in either class defines *union*; § 7.3.2 introduces *event* as "a subset of the sample space" and stops there. The set-theory words the chapter needs elsewhere — *and*, *or*, *not* — it handles in English, and well. | Say *the two sets put together*, or define it. One word, in the same sentence as the count that needs correcting above. |
| p017 Exercise 7.4 Q1 | — | **A question that works only because the chapter warned about it, and is worth checking on a proof.** Basket A holds one apple and two oranges, Basket B one banana and one mango; the question asks for the sample space, $n(S)$, and $P(\text{apple and banana})$. Listed by *kind* the space has four entries and the answer comes out $\tfrac14$, which is wrong; listed by *fruit* it has six and the answer is $\tfrac16$, which is right. The chapter has armed the student for exactly this — p008's tip reads "Count outcomes, not names. Two Bs are two outcomes, however alike they look on the page" — so this is good design, not a fault. **Recorded because it is the one question in the chapter where a reasonable reader can produce a tidy wrong answer**, and because there is no answer key to catch it. | Nothing, unless an answer is wanted. If one is added, give both counts and say why six is the right one. |
| p109 Set C4 | — | **Two options are the same number, and the note names only one of them.** Q4's options are (a) $\tfrac{8}{15}$, (b) $\tfrac{7}{15}$, (c) $\tfrac{16}{30}$, (d) $\tfrac13$ — and $\tfrac{16}{30} = \tfrac{8}{15}$, so (a) and (c) are one distractor in two forms. That is a device the chapter uses deliberately elsewhere: Set B Q5 offers $\tfrac25$ and $\tfrac{4}{10}$, and p110's note says so outright — "Options (b) and (c) are both $\tfrac25$". Here p110 says only "Option (c) is the uncorrected count", so a student who computes $\tfrac{16}{30}$ and reduces it — which every fraction habit demands, and which p003 has taught them is the same number "wearing three coats" — lands on (a) and finds it unmentioned. | One clause, matching Set B's: "Options (a) and (c) are the same number, the uncorrected count." |
| p018, p110 | — | p018 is **87%** full and carries `data-close`; p110 is the last page at 95%. `gaps` reports every page at least 88% full, so nothing is short. Not a fault; recorded because 87 on the fill line reads like one. | Nothing. |


## 21 September 2026 — figure/table reference review

Reviewed this chapter in the all-maths reference audit. Figures and tables now use one chapter sequence, including Beyond the Book; captions and references were updated together. Questions, calculations and artwork were preserved. The chapter and its volume were rebuilt; detailed layout checks and any remaining warnings are recorded in build/_all-maths-reference-checks/.

## 24 September 2026 — NCERT title

The chapter now carries NCERT's own title, *The Mathematics of Maybe: Introduction to Probability*, taken from the chapter's first page in the NCERT textbook, in place of the house title it had. Changed in `chapter.json` and the opener heading in `p001.html`; nothing else in the chapter uses the title.
