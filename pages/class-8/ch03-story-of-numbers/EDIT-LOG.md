# Class 8 · Mathematics I · Chapter 3 — Ten Symbols, Every Number

## Solved examples in examination formats, 23 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 19 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-8/ch03-story-of-numbers/`.

Source `build/jee-class8.mjs`; check `build/check-jee-class8.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p114; the answers stage still opens a fresh page.

Fitting, same day. Body p010: “check it on the number $18$” became “check it on $18$”, to pull back a line that ran 2.6mm into the margin.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) MDCXLIX |
| 2 | Single correct | (b) 2496 |
| 3 | Single correct | (c) 6561 |
| 4 | Single correct | (d) 397 |
| 5 | Single correct | (a) 53 |
| 6 | Single correct | (b) $10201_{3}$ |
| 7 | Multiple correct | (a), (c) |
| 8 | Multiple correct | (a), (b), (d) |
| 9 | Multiple correct | (a), (c), (d) |
| 10 | Multiple correct | (a), (b), (c) |
| 11 | Numerical answer | 14 |
| 12 | Numerical answer | 6 |
| 13 | Numerical answer | 700309 |
| 14 | Matching | (b) P–2, Q–4, R–3, S–1 |
| 15 | Matching | (c) P–3, Q–4, R–2, S–1 |


## Syllabus audit fixes, 17 September 2026

From "Audit Class 8 Maths I Beyond". Every finding was confirmed against the
pages; only Beyond was changed.

| finding | what was done |
|---|---|
| Stage 1 Q6, which fractions come out exactly in base 12 (off-syllabus) | replaced by a base-12 try on whole numbers: 3 gross, 5 dozen and 7 eggs is 499, written $357$ in base 12; one egg more than 3 gross, 11 dozen and 11 is $400$ in base 12 (576). The closing remark on why twelve has been argued for now rests on sharing, not fractions. The audit's suggestion (2000 eggs in dozens, grosses and great gross) was not used: it is Practice Q27 |
| Practice Q18, A&R *¼ is exact in base 6* (off-syllabus) | A: *the base-4 numeral 33 stands for 15*; R: *the second place from the right is the sixteens place*; key stays (c). The audit's suggestion (*100 in base 6 is 36*) was not used: it is Q17's assertion |
| Practice Q9, which fraction does not end as a decimal (borderline) | question kept; the answer note and `ANSWERS.md` now work by division alone (1 ÷ 6 leaves remainder 4 at every step) |
| Stage 1 Q5 and Practice Q8, Q13, the digit-sum rule in base 7 and 8 (borderline) | Stage 1 Q5 is now an expanded-form try: what $10$ and $11$ stand for in bases 2, 5 and 9, and in which base $11$ is seven (6). Q8: the base-8 numeral $77$ (63; key stays (c)). Q13: the base-7 numeral $606$ (300; key stays (a)). The Answers closing paragraph's fourth *line* (the digit-sum rule) became *the numeral 10 is the base itself*. The audit's suggestion (121 in base 3 and base 5) was not used: it is Q11 |
| Practice Q26, binary addition with carrying (borderline) | now: write both in base 10, add, write the sum in base 2 ($13 + 7 = 20 = 10100_2$); key and `ANSWERS.md` rewritten |
| Stage 1 Q8 and Example 10, repeated division (borderline) | kept, with landmark-first shown alongside: a row $212 = 1 \times 125 + 3 \times 25 + 2 \times 5 + 2$ under Q8, and a sentence after Example 10 giving 100's digits largest landmark first |
| gap: no example on Chinese rod numerals (§3.6.2) | **Example 16** added under a new **Type 9 · Chinese rod numerals**: a numeral with one empty place read as 4032, with a note that three empty places (400 032) would lie the same way. It is described in words, as body Exercise Set 3.4 Q5 is, so no figure was drawn |

Examples 16–18 became 17–19 and Types 9–10 became 10–11; nothing else cites
them. **Solved Examples: 19** (was 18); worked examples in the chapter 23.
`check-numbers.mjs` updated (Stage 1 Q5, Q6, Q8; Examples 10, 16 and the
numbering; MCQ 8, 13 and Q9's note; AR 18; key 26; `ANSWERS.md` lines);
every new value was broken on purpose and caught. 438 claims hold.

**For the coordinator (body, not changed):** Fig. 3.5 (p012) is described
as vertical rods in the thousands and tens and horizontal in the hundreds
and units, while Exercise Set 3.4 Q5 reads *three uprights, then two bars,
then one upright* — uprights in the units, which is the historical
arrangement and the opposite of the figure. Example 16 was written so as
not to depend on which way the units lie.

**Pages: 32 before → 32 after** (16 body + 16 Beyond).

## Brought to the Class 7 standard, 17 September 2026

Phase 3 of `PLAN-MATHS-CONSISTENCY.md`, worked against Chapter 1 as the
model. The page move and the conversion were done in one pass. The chapter
was read whole before anything was changed, and every check below was run on
the chapter, not on a page.

**Pages: 32 before (19 body + 13 Beyond, Crown Quarto), 32 after (16 body +
16 Beyond, 196 × 276).** The taller page took three pages off the body.
Beyond grew by three: its first stage now carries its own explanations, it
has 18 solved examples where it had none, and the practice stage runs to 31
questions in six forms.

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`. The body was
refitted once, after the examples were stepped.

**All four body examples set as steps.** *Solution*, a step to a
`.work__row`, an *Answer* row, the reason in a `.work__why`. The old wide
labels (`$2367$`, `Cs`, `largest that fits`, `three coils`) became Step
rows, and Example 2's `.chip` answer became its Answer row. Remarks that are
not steps stay as paragraphs after the working (Example 2's *notice the
trading*, Example 3's *in Egyptian style* and *no landmark is ever needed
five or more times*, Example 4's *every symbol simply moves one place up*).
Example 1's check line became its Step 3. Verified by
`build/check-example-stepping.mjs`: 4 examples, no mathematics lost.

**Exercise Set 3.5 was numbered 1, 2, 3, 4, 3, 4, … 12.** It shipped that
way in the first commit: the second page of the set restarted at 3, so
Questions 3 and 4 were printed twice. The ten questions after the first four
are now numbered 5 to 14. No question was added, moved or reworded. It may be
that a head (*Exercise Set 3.6*) and two questions were lost when the
chapter was first fitted; nothing in the repository says so, so the smallest
repair was made. **Flagged below.**

**Fig. 3.6 and the question that names it.** After the refit, Fig. 3.6 printed
on page 15 (a recto) and Set 3.5 Q10, *Of the five ideas in Fig. 3.6*, on
page 16 (the verso behind it). Fixed by hand, not by a second refit: two
sentences on page 14 were each shortened by a rendered line
(*put it in a way that nobody has improved on* → *put it well*; *So the older
and more accurate name is the one Europe did not use, and modern textbooks
increasingly say* → *The older name is the more accurate one, and textbooks
now say*; no fact changed), which let the figure move back onto page 14.
Q5's six one-word parts were set in three columns (`c-parts--3`) instead of
one, and Q5–Q10 moved onto page 15. Figure and question now face. The
summary then fitted under Q11–Q14 on page 16, which closes the body at 94%
and carries `data-close`; the old page 17 was deleted.

**Beyond the Book rebuilt to the four current stages** (§6a):

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 8 `.c-try` questions, answered in the next stage | **the same questions, each followed by its own explanation**, word for word except as below; `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | the explanations of stage 1's questions | **18 stepped examples**, Examples 1–18, under ten `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, 30 questions | **one numbered run of 31**, all six forms, band carrying the numeral |
| 4 Answers & Takeaways → **Answers** | key and why the options are wrong | key, every other answer, why the options are wrong for 13 questions; the *carry forward* paragraphs kept without their head |

**Stage 2 was Stage 1's answers**, as in every Class 8 chapter (*The same
questions, worked*). The eight explanations were moved under their own
questions, word for word, dropping only the `.c-solution` wrapper and its
title. Pointing sentences corrected: *Try each before turning the page* →
*before reading what follows it*; *Both of those solutions* → *explanations*;
*Work through all eight before turning over … the solutions overleaf* →
*Keep whatever you wrote for each of the eight. Several of the explanations
above …*; and in the carry-forward paragraph *Twice in the solutions above* →
*Twice in the first stage*. The old stage 2 markup was irregular (solutions
opened at the wrong indentation and ran across page closes), so the stage was
rewritten by hand from the old text rather than by script.

**Three Stage 1 items changed**, because each answered a body question (the
no-give-away rule beats word for word):

| was | answered | now |
|---|---|---|
| digits of 1000 in **base 7**, with *the powers of seven are 1, 7, 49, 343, 2401* | Exercise Set 3.3 Q3 (the first six base-7 landmarks) | base **6**: $1000 = 4344_6$, powers of six, six symbols; the closing paragraph's $2626_7$ became $4344_6$ to match |
| convert **143** to base 5 by division | Example 3 (143 in base 5, worked in the body) | convert **212**: $212 = 1322_5$ |
| *the smallest base that works is 2, with symbols 0 and 1* | Exercise Set 3.5 Q7 (how many symbols base 2 needs) | *with symbols 0 and 1* deleted |

**Nothing else in Beyond repeats or answers the body.**
`build/check-no-repeats.mjs` reports two pairs at 50%, both *same type,
different numbers* (Example 6, Egyptian symbols for 40 506, against Set 3.3
Q1; Example 13, 4000 in sixties, against Set 3.4 Q1). Every value Beyond
prints was also read against the body's exercise list. One more give-away was
found that way and changed while writing: Example 18 first compared the
systems on **1888** and remarked that *eights are expensive*, which all but
answers Set 3.2 Q6 (3888, and the number below 4000 needing the most
symbols). It now uses **2764**. Of the old 30 problem-set questions, 14 were
kept. Two were dropped as recall of the body's own sentences (the
Mesopotamian base, where the first zero appears), and the rest for repeating
or answering the body or stage 1: base-5
landmarks, base-8 symbol count, which system is not place value, when a
placeholder is needed, the Mayan base, Egypt's seven symbols, base one, the
two-wedge readings, base-12 thirds, why division stops, the chief advantage,
*Arabic numerals*, the last idea of Fig. 3.6, and tally/Roman/Hindu for 3000.
One kept question was changed because it had three right answers: *digits add
to 18 in base 7* forces $666_7 = 342$, which is divisible by 6, 9 and 18. It
now reads *add to 12*, whose only sure divisor among the options is 6. The
old four-place question in base 6 moved to base 8, since Stage 1 Q1 is now
about four-place numerals in base 6.

**Worked examples in the chapter: 22** (4 body + 18 Beyond), against §5a's
twelve. Every topic is worked under a type: tallies and groups; writing and
reading Roman numerals; calculating with landmarks; Egyptian numerals; the
landmarks of a base; changing base; counting in sixties; the Mayan landmarks;
zero and expanded form; comparing the systems.

**Practice: 31 questions** — 15 multiple choice (key letters a 4, b 4, c 4,
d 3), 4 assertion–reason, 3 very short, 4 short, 3 long, 2 case-based.

**`ANSWERS.md` written** for every question the chapter sets: the five
exercise sets, both Think and Reflects, Stage 1 (pointing to its own
explanations), and the 31 practice questions with their working. Questions
that invite a choice or an invention carry a worked instance.

### Verified

`check-numbers.mjs` is kept beside the pages. It passes **407 claims**,
evaluating 179 printed identities on the pages and in `ANSWERS.md` (numerals
written in another base, such as $1322_{\,5}$, are read in that base, and a
division with a remainder is checked as $a = bq + r$). It also re-derives
what arithmetic alone cannot: every Roman numeral by rule, in both
directions, including every one `ANSWERS.md` prints; every base conversion;
places of sixty and Mayan places; the place counts in Examples 8, 13, 14 and
15, read back off the page; the Egyptian symbol counts; the number below 4000
with the longest Roman numeral; factor lists; and every practice answer, read
back out of the key one lettered part at a time. Every multiple-choice
question is solved (Q12–Q14 by enumeration) and must have exactly one right
option matching the key; every assertion–reason letter is derived; and
`ANSWERS.md`'s key must match the page's. The 7 spans it skips are words
inside maths (`\text{L}`, `n = 1`).

**Tested by breaking values on purpose, 14 breaks, all caught** after one
fix: a remainder in Example 1; the key letter for Q5; *MCCXXII* in
`ANSWERS.md`; row 30 (c)'s *59 s*; Example 1's body check line; Q12's right
option; `ANSWERS.md`'s key for Q13; $1322_5$ in `ANSWERS.md`; Example 18's
Roman count; row 31 (c)'s lamp count; 25 in base 8 in `ANSWERS.md`; row 24's
$340\,170$; the assertion–reason letter for Q18. **Missed at first:**
Example 15 changed to $280 = 13 \times 20 + 20$, which is still a true
identity. The Mayan, sixties and base-4 working rows are now read back off the
page against the computed place counts, and the change is caught.

**Two false alarms in the check, fixed:** divisions printed with a remainder
($83 \div 5 = 16$ remainder $3$) were read as equalities, and the binary
carries in `ANSWERS.md` ($1 + 1 = 10$) as decimal sums. The first is now
checked as a division; the second is written in words.

**Two wrong explanations found by reading the proofs and fixed:** the reason
row for Q5 said options (a) and (c) *read CD as more than five hundred* (544
reads it as 500), and Q15's option *2005* was not the digit-by-digit reading
of $2 \mid 0 \mid 5$; it is now *205*.

**Fitting.** Nothing is clipped, and nothing runs into the bottom margin.
`orphans`: 0 stranded openers in 32 pages. `check-labels`: no collisions.
`fit-options`: every option row fits. Beyond was refitted once; the Solved
Examples were then placed by hand (the two Type 5 examples were swapped and
renumbered so that the head and its shorter example fit the foot of page 23,
which had been 61%). Proofs of pages 4, 5, 8, 14–16, 21, 23, 24, 27 and 29–32
were read.

**Colour.** Pages 1, 2, 7, 10, 12 and 14 were read in greyscale and under
simulated deuteranopia, protanopia and tritanopia (`build/check-colour.mjs`).
The figures are single-colour line work with their values printed as labels,
so nothing depends on hue.

### Short pages, logged

Each is held by a block `gaps` names, which cannot move.

| page | fill | held by |
|---|---|---|
| 8 | 76% | Example 4, a panel |
| 25 | 79% | Type 8's head, which may not be stranded, and Example 15 under it |
| 26 | 78% | Type 10's head and Example 18 |
| 29 | 67% | the case-based questions, which open page 30 under their sub head |
| 30 | 60% | **the Answers stage, which always opens a page** |
| 32 | 78% | the last page |

### Flagged, not done

- **Exercise Set 3.5's numbering** (above): renumbered 5–14 as the smallest
  repair. Whether a separate *Exercise Set 3.6* was intended should be
  checked against the manuscript, if there is one.
- **Fig. 3.5 (Chinese rods)** sets the units and hundreds as horizontal bars
  and the tens and thousands as uprights. The usual account has it the other
  way round (units upright). It also writes 6 as six bars, where the rod
  system uses a crossing rod for five. Set 3.4 Q5 reads correctly either way.
  Needs a source before press.
- **Fig. 3.1's lower label** (*the same twenty-nine, gathered into fives*)
  sits very close under the gate strokes and reads crowded in the proof.
  `check-labels` does not report it.
- **Stage 1, Q3**, the four readings of a two-wedge numeral, prints pairs of
  numbers that look alike, which is the kind of answer Set 3.4 Q2 asks for.
  Kept, because the body's own text already gives such a pair (3605, 65,
  216 005) and the pairs differ; it is a judgement call. Its third reading,
  $7380$, puts the empty place at the end rather than in the gap.
- Stage 1 keeps its coaching sentences (*worth more than it looks*, *a move
  you will use far more often*), because it is kept word for word. §6a would
  not write them today.
- **Facts without a source in this log:** the Lebombo bone (29 notches, about
  40 000 years); the Gumulgal, Bakairi and San counting; the Roman system from
  a Greek one around the eighth century BCE; Egyptian numerals around
  3000 BCE; Mayan dates and the shell; Chinese rods from the third century CE;
  the Yajurveda, the Bakhshali manuscript, Āryabhaṭa (499 CE) and Brahmagupta
  (628 CE); al-Khwārizmī (c. 825) and al-Kindī (c. 830); Fibonacci; cities
  banning the numerals in ledgers; and the Laplace remark. The language edit
  below says the Indian material is sourced, but no sources are recorded
  here. §5a asks for them before press.

Language edit, 32 pages (p001–p019 chapter proper, p101–p113 Beyond the Book).
Build after editing: 32 pages, all pages fit, 0 stranded openers, no label
collisions, every option row fits. All 30 answers in Stage 4 checked against the
questions — all correct, including the four that turn on a base conversion.

This is the most history-heavy chapter so far, and history is where the register
slips: *chronological*, *arbitrary*, *perception*, *condescension*, *disputed*,
*millennia*, *unambiguously*, *much of a muchness*. None of it is maths
vocabulary, so all of it is a defect under the governing rule. The mathematical
content is careful and the Indian material is properly sourced (Yajurveda
Saṃhitā, Bakhshali manuscript, Āryabhaṭa 499 CE, Brahmagupta 628 CE), including
the point that *Arabic numerals* names the route and not the source.

One word mattered more than the rest: **p013's "Their bases are odd"**, about
the Mayan landmarks. In a maths book *odd* means not even, and a reader who
takes it that way gets a false statement about 1, 20, 360 and 7200. Now "Their
landmarks are strange."

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted. The renumbering of Exercise Set 3.5 is right: at the last commit the continuation page restarted at 3 after questions 1–4.

## FIXED

| before | after | check |
|---|---|---|
| **p001** "the story of how that wall was got round" | "the story of how people got round that wall" | L5 |
| "It is not a chronological history" | "It is not a history in date order" | L1 |
| "so the positions can be read without ambiguity" | "…without any doubt" | L1 |
| "it settles the herd without ever saying how many" | "it answers the question without ever saying how many" | L3 |
| **p003** "The choice is not arbitrary" | "The choice is not random" | L1 |
| "It is a fact about perception and not about arithmetic" | "It is a fact about how eyes work and not about arithmetic" | L1 |
| "The commonest group sizes in history" | "The most common group sizes in history" | L1 |
| **p004** "Something strange attaches to that system." | "There is something strange about that system." | L3 |
| "One suggestion is a common ancestry so old that the system travelled with the migrations." | "One idea is that the three peoples share a very old common ancestor, and the system travelled with them." | L2 |
| Q6 "say honestly what its worst limitation is" | "say honestly what it is worst at" | L1 |
| "The Roman system, which grew out of an older Greek one around the eighth century BCE and was used across Europe for the better part of two thousand years, does exactly that." | split into two sentences, verb first: "The Roman system does exactly that. It grew out of an older Greek one around the eighth century BCE, and was used across Europe for the better part of two thousand years." | L4, L6 — 33 words with the verb at the end |
| **p005** "One refinement is worth knowing." | "One extra rule is worth knowing." | L1 |
| "but the convention shortens the awkward cases" | "but the rule shortens the awkward cases" | L1 |
| **p006** heading "Where the Roman system gives out" | "Where the Roman system runs out" | L3 — and *runs out* is the chapter's own phrase |
| **p007** "It is easy to be condescending about this from where we sit, and the condescension would be misplaced." | "It is easy to look down on all of this from where we sit now, and it would be wrong to do so." | L2 — three hard words in one sentence |
| "for the better part of two millennia" | "for nearly two thousand years" | L1 |
| "briefly and unambiguously" | "briefly and with no room for doubt" | L1 |
| "MMCCCLXVII and 2367 are much of a muchness" | "…are about the same length" | L3 — idiom |
| **p008** "they are an arbitrary list" | "they are a list somebody just chose" | L1 |
| "landmarks were chosen by a rule rather than by taste" | "…rather than picked by hand" | L3 |
| "not an arbitrary list at all" | "not a chosen list at all" | L1 |
| "you do not have to consult anybody" | "you do not have to ask anybody" | L1 |
| **p009** "That last remark holds for every base." | "That last point is true for every base." | L1 |
| **p010** "without a single computation" | "without a single calculation" | L1 |
| "That is what a base buys" | "That is what a base gives you" | L3 |
| "so base ten has no special mathematical virtue" | "so there is nothing mathematically special about base ten" | L1 |
| "Which is not to say the choice is without consequences." | "That does not mean the choice makes no difference." | L3, L5 |
| **p011** "The way out is startling once you see it" | "The way out is surprising once you see it" | L1 |
| **p012** "Why sixty is disputed: … What is not disputed is that we still use it" | "Nobody is sure why sixty. It may have come … What is certain is that we still use it" | L1, L4 |
| "or from the convenience of a number with so many divisors" | "or from how neatly a number with so many divisors divides up" | L1 |
| **p013** "Their bases are odd." | "Their landmarks are strange." | C1 — *odd* has a maths meaning, and the sentence is about 1, 20, 360, 7200 |
| "generally thought to be their calendar intruding" | "generally thought that their calendar got in the way" | L1 |
| "they carry a refinement of their own" | "they have an extra trick of their own" | L1 |
| "would be ambiguous" | "would be unclear" | L1 |
| "has bought its clarity with a rule" | "has got its clarity from a rule" | L3 |
| **p014** "Everything the last section wanted is delivered by one further idea" | "One more idea gives everything the last section wanted" | L5 |
| **p015** "and no ambiguity at either end" | "and nothing to guess at either end" | L1 |
| "the earliest known instance" | "the earliest known example" | L1 |
| "computing with zero, not merely leaving room for it" | "calculating with zero, not just leaving room for it" | L1 |
| **p016** "Roman numerals were embedded in law" | "Roman numerals were built into law" | L1 |
| "for three centuries the new digits were resisted" | "for three centuries people resisted the new digits" | L5 |
| "put the achievement in a way that has not been bettered" | "put it in a way that nobody has improved on" | L1, L5 |
| **p019** summary 5 "they are an arbitrary list" | "they are just a list somebody chose" | L1 |
| summary 11 "Āryabhaṭa (499 CE) computed with it" | "…calculated with it" | L1 |
| **p102** "show that something is impossible or *ambiguous*" | "…impossible or *unclear*" | L1 |
| "If a question resists, do it in base 10 first" | "If you cannot get started, do it in base 10 first" | L3 |
| "the moment $2626_7$ is rewritten as…" | "the moment you rewrite $2626_7$ as…" | L5 |
| **p103** "the commonest error with bases" | "the most common error with bases" | L1 |
| "and it was got without dividing anything" | "and we got it without dividing anything" | L5 |
| **p104** "there is no fifth reason to prefer any of them" | "no reason to prefer any of them" | L3 — the original reads as a slip |
| "a placeholder is not a nicety" | "a placeholder is not a small extra" | L1 |
| "which is a manoeuvre you will use" | "which is a move you will use" | L1 |
| **p105** "so thirds join the club and fifths leave it" | "so thirds now work exactly and fifths no longer do" | L3 — idiom |
| **p112** "MMCCCLXVII and 2367 are much the same length" | "…are about the same length" | L1 — matches p007 |
| **p113** "the Mesopotamian numeral is ambiguous" | "the Mesopotamian numeral can be read more than one way" | L1 |

Refit note: cutting the p007 sentences dropped that page from 88% to 85% — one
rendered line — and the builder reported it short. The white there is held by
§ 3.5's heading on the next page, which may not be stranded at the foot, so
repacking cannot close it. Rewritten at fuller length in plain words instead;
p007 is back at 88% and the chapter's fill map is otherwise unchanged.

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p017 Exercise 3.5 / p018 | C4 | **Two questions numbered 3, and two numbered 4.** p017 runs 1, 2, 3, 4 and p018 opens again at `data-start="3"` ("Which of these systems are place value systems"), then 4, 5, … 12. So the set reads 1, 2, 3, 4, 3, 4, 5, … A student told to "do question 4" has two of them. | Renumbering cascades through ten questions on p018, so the author should take it: p018's blocks become 5 to 14. Note this is the second chapter running with a duplicated exercise number — Chapter 2's Set 2.2 has two question 5s. Worth checking every chapter before print rather than one at a time. |
| p016 | C6 | The Laplace passage is given as the chapter's closing judgement — "put it in a way that nobody has improved on" — and then paraphrased in the book's own voice with no quotation marks and no citation. As it stands a reader cannot tell which words are Laplace's and which are ours, and the paraphrase is doing the work of a quotation. | Either quote him properly with a source, or drop the attribution and make the point in the book's own voice. A judgement this strong should be traceable. |
| p013 | M1 | "Between the third and tenth centuries CE the Maya wrote numbers with a dot for $1$ and a bar for $5$, making every number up to $19$." Then Exercise 3.4 Q4 asks the student to "Write $77$ and $361$ in Mayan style" — but $361$ needs three places under landmarks $1, 20, 360$, and the chapter never shows a Mayan numeral with more than one place, nor the shell placeholder in use. The worked figure for the Maya is on the chapter opener only. | Either a worked two-place Mayan numeral in § 3.6.2, or drop $361$ from the question. As written the second half of Q4 asks for something never demonstrated. |
| p010 | M1 | "Multiplying by anything else works the same way, using the distributive law". The name is used without a reminder of what it says, and this book does not teach it — Chapter 4 (A Rectangle, Cut in Two) is where distribution over addition gets its treatment. | A half-line gloss, or a forward reference to Chapter 4. Class 7 met the property, but not under a name this chapter can lean on unexplained. |
| p003, Fig. 3.2 | C7 | The caption reads "Most people see the first two immediately and have to count the last two", which answers the figure's own question ("how many in each, without counting?") before the reader has tried it. | Move the observation into the text after the figure, or make the caption name the boxes without reporting the result. |

## 24 September 2026 — NCERT title

The chapter now carries NCERT's own title, *A Story of Numbers*, taken from the chapter's first page in the NCERT textbook, in place of the house title it had. Changed in `chapter.json` and the opener heading in `p001.html`; nothing else in the chapter uses the title.
