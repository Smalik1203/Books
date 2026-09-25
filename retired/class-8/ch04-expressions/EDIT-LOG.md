# Class 8 · Mathematics I · Chapter 4 — A Rectangle, Cut in Two

## Solved examples in examination formats, 23 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 17 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-8/ch04-expressions/`.

Source `build/jee-class8.mjs`; check `build/check-jee-class8.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p113; the answers stage still opens a fresh page.

Fitting, same day. Body p018: “The trick, and it is the only one,” became “The trick, and the only one,”, to pull back a line that ran 5.3mm into the margin.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (b) 4 |
| 2 | Single correct | (c) $3a^2 + 10ab - 8b^2$ |
| 3 | Single correct | (d) 3481 |
| 4 | Single correct | (a) 15 |
| 5 | Single correct | (b) 7 |
| 6 | Single correct | (c) $y^2 - 4y - 21$ |
| 7 | Multiple correct | (a), (b) |
| 8 | Multiple correct | (a), (b), (c) |
| 9 | Multiple correct | (a), (b), (d) |
| 10 | Multiple correct | (a), (b), (c) |
| 11 | Numerical answer | 62.41 |
| 12 | Numerical answer | 4 |
| 13 | Numerical answer | 24 |
| 14 | Matching | (b) P–3, Q–2, R–4, S–1 |
| 15 | Matching | (d) P–4, Q–3, R–1, S–2 |


## Syllabus audit fixes, 17 September 2026

From "Audit Class 8 Maths I Beyond". One finding, confirmed against the
pages; only Beyond was changed.

| finding | what was done |
|---|---|
| Stage 1 Q5, $x + \frac1x = 4$, find $x^2 + \frac1{x^2}$: an identity used on an expression with $x$ in a denominator, which the body excludes (borderline) | replaced by a try of the same kind that keeps whole-number powers: $a^2 + b^2 = 20$ and $ab = 8$, find $a^4 + b^4$ without finding $a$ or $b$. Squaring what is given, with $a^2$ and $b^2$ in the places of $a$ and $b$, gives $400 - 2(ab)^2 = 272$; the numbers are 2 and 4; the other square gives $(a^2 - b^2)^2 = 144$. The audit's suggestion ($a + b = 4$, $ab = 1$, find $a^2 + b^2$) was **not** used: it is the body's own §4.7.2 example with other numbers, Exercise Set 4.6 Q5, and Stage 1 Q1 again |

`ANSWERS.md` and `check-numbers.mjs` (the conditional spans, and Stage 1 Q5
recomputed from the numbers and from the identity) updated; each new value
was broken on purpose and caught. 654 claims hold. No page break that
matters moved: Answers still opens a page.

**Pages: 36 before → 36 after** (22 body + 14 Beyond). No Solved Example
added (no gap was found).

## Brought to the Class 7 standard, 17 September 2026

Phase 3 of `PLAN-MATHS-CONSISTENCY.md`, done against Chapter 1 as the model.
I read the chapter whole before changing anything, and ran every check on the
whole chapter.

**Pages: 34 before (23 body + 11 Beyond, Crown Quarto), 36 after (22 body +
14 Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`. The body was
refitted once (`refit … body`: 23 → 21 pages), then pages 10–22 were placed by
hand (below).

**All ten body examples set as steps.** Each now has *Solution*, a step to a
`.work__row`, an *Answer* row, and the reason in a `.work__why`. The old wide
labels (`write out`, `gather $x^2$`, `$4x \times 2x^2$`, `here`) became Step
rows. Example 9's three results and Example 10's result moved into Answer rows.
The remarks after the working stay as paragraphs. `check-example-stepping`:
10 examples, 0 lost mathematics.

**Four figures reprinted beside the questions that name them.** This follows
the Class 6 Chapter 6 decision. At `HEAD` all four questions were already
overleaf from their figures, and the refit did not fix that:

| question | figure | now |
|---|---|---|
| Ex 4.3 Q9 (p010) | Fig. 4.1 (p008) | copy on p010 |
| Think and Reflect, § 4.5 (p012) | Fig. 4.2 (p011) | copy on p012, just above it |
| Ex 4.5 Q9 (p018) | Fig. 4.3 (p014) | copy on p018, after the question |
| Ex 4.5 Q10 (p018) | Fig. 4.5 (p015) | copy on p018, after the question |

The SVGs were copied, not redrawn. Each caption reads *(repeated from
Section 4.N, for …)* followed by a **shortened** form of the original caption.
Each `aria-label` is the original with *(repeated)* added. No later figure is
renumbered. To make page 18 fit, the Fig. 4.3 copy is set at `--sm` and the
Fig. 4.5 copy at `--md`, one step below their originals. `check-labels` finds
no collisions. `check-numbers.mjs` confirms that each copy draws the same
shapes as its original, and that each question is on its figure's page or
facing it.

**Hand placement of pages 10–22.** I measured every block and simulated the
breaks, rather than refitting a second time. One line was trimmed at the § 4.7
join: *the three results are arithmetic as well as algebra, and they are
quicker than the arithmetic you would otherwise do — provided you can see the
sum or the difference hiding in the numbers* became *the three results are
quick arithmetic too, if you can see the sum or the difference in the
numbers*. That let § 4.7's head and Example 9 fit on page 18, and the body
closes on page 22 rather than 23. Page 18 is 100% full and nothing is clipped.
`data-close` is on p022.

**Beyond the Book rebuilt to the four current stages** (§6a):

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 8 `.c-try` questions, explained in the next stage | **the same questions, each followed by its own explanation**, word for word except as below; `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | the explanations of stage 1 (*The same questions, worked*) | **17 stepped examples**, Examples 1–17, under eleven `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, 32 questions | **one numbered run of 31**, all six forms, band carrying the numeral |
| 4 Answers & Takeaways → **Answers** | key and why the options are wrong | the key, every other answer, why the options are wrong for 12 questions, and the *carry forward* paragraphs without their head |

The explanations were moved under their own questions, and only the
`.c-solution` wrappers and titles were dropped. *Try each one before turning
the page* became *before reading what follows it*. The three remarks on the
questions as a set now follow the last explanation.

### Give-aways found and fixed

| where | problem | now |
|---|---|---|
| Stage 1 Q7 | *$x^2 + y^2$ is always bigger than $2xy$*; its explanation proves Ex 4.6 Q10 word for word | the same kind with a different expression: *$(x + y)^2$ is always bigger than $4xy$*; equality at $x = y = 5$ (both sides 100) |
| closing paragraph | *including $a = 3$, $b = 7$ in a rectangle that cannot be drawn* answers Ex 4.5 Q10 | that clause deleted |
| Solved Example 10 | $49 - 16y^2$ sat beside Ex 4.5 Q3 (d), $(7 - k)(7 + k)$ | $81 - 4y^2$ |
| old Set B Q3, $103 \times 97$ | worked in body Example 9 | dropped |
| old Set B Q6, $\frac{85^2 - 15^2}{70}$ | its working answers Ex 4.6 Q3 (a) | dropped |
| old Set C Q8, $18 \times 22$ | is Ex 4.6 Q2 (c) | dropped |
| old Set C Q4, the coefficient of $x$ in $(x+a)(x+b)$ | answers Ex 4.4 Q6 | dropped |
| old Set B Q5, $(x+2)(x+3) - (x+1)(x+4)$ | its working prints half of Ex 4.4 Q3 (a) | dropped |
| draft practice: $(x+6)^2$, $(2y-3)(2y+3)$, $(n+1)^2 - n^2$, consecutive even numbers, $(a-b)^2 = (b-a)^2$ | each answered Ex 4.5 Q5 (a), Ex 4.5 Q3 (b), Ex 4.6 Q14, Ex 4.6 Q8, or Ex 4.5 Q8 | replaced before printing: $(x+9)^2$, $(3y-4)(3y+4)$, and new items |
| draft Example 14, $x + y = 9$ and $x^2 + y^2 = 53$ | would print 53, 81 and 14, which are Ex 4.6 Q6's answers | $x + y = 8$, $x^2 + y^2 = 34$ |

I checked every number Beyond prints against the body's exercise answers by
reading. `check-no-repeats` reports one pair at 60%: Example 10 against
Ex 4.5 Q5. Both are the same type with different expressions, so the pair
stands.

**Worked examples in the chapter: 27** (10 body + 17 Beyond). Every topic has
a type: terms, coefficients and degree (with what counts as a polynomial);
adding and subtracting; multiplying by one term; multiplying two brackets; the
three identities; identities read backwards; identities as arithmetic;
$(x+a)(x+b)$; values found without the letters; identity or equation; making
a square.

**Multiple-choice key letters:** a ×4, b ×5, c ×5, d ×5, counting the four
assertion–reason questions.

**`ANSWERS.md` written.** It covers the six exercise sets, the three Think and
Reflects, Stage 1 (pointing to its explanations), and all 31 practice
questions with their working. Where an answer can vary, a worked instance is
given (Ex 4.1 Q7–Q9, Ex 4.2 Q8, Ex 4.3 Q6). It also says what the drawings in
Ex 4.3 Q7 and Ex 4.5 Q9 must show.

### Verified

`check-numbers.mjs` is kept beside the pages and passes **647 claims**. It
contains a small LaTeX parser, and checks the chapter in four ways:

- **Identities and conditional statements.** 359 spans with `=`, on the pages
  and in `ANSWERS.md`, are checked. An identity must agree at random values of
  its letters. A statement true only for particular values is listed with
  those values and checked at them. A statement printed as false (the
  $(a+b)^2 = a^2 + b^2$ error, Rohan's slip, the assertions meant to be false)
  must really be false. The 94 spans skipped are all bare definitions such as
  $x = 1$ or $a = 3x$.
- **Answers worked from their questions.** Every body exercise answer in
  `ANSWERS.md` is worked from the question as the page prints it, one lettered
  part at a time. Degrees, coefficients and term counts come from an exact
  polynomial expansion. So do every body and Beyond example's Answer row, and
  every practice answer, which is read back out of the key rows.
- **Multiple choice.** Each question has exactly one right option, and it
  matches the key. The assertion–reason letters are derived.
- **The two keys.** `ANSWERS.md`'s key equals the page's key.

**Tested by breaking values on purpose.** I made 15 breaks, and all 15 are now
caught:
- body Example 9's $102^2 = 10404$
- key letter 7
- Ex 4.4 Q1 (c) in `ANSWERS.md`
- key 30 (c)
- Beyond Example 14's $xy = 15$
- practice Q10 option (a)
- a Stage 1 working line
- the `ANSWERS.md` key line
- the body's $672$
- Ex 4.1 Q5 (b) in `ANSWERS.md`
- Example 13's second answer
- a body exercise question changed with its answer left alone
- key 26's area
- practice 29 in `ANSWERS.md`
- a sign in body Example 5

The body's $672$ was **missed** at first, because the check had that value
typed in rather than read off the page. It now reads the sentence from the
page.

**Four faults in the check itself were found and fixed:**
- Display maths (`$$…$$`) put the inline span reader out of step, so on
  several pages the text between spans was being read as maths.
- A root was being tokenised as the letter *S*.
- A regex took *4 + k = 11* for the answer *k = 7*.
- An answer's trailing remark span was taken as the answer.

**Fitting.** Nothing is clipped. `orphans`: 0 stranded openers in 36 pages.
`check-labels`: no collisions. `fit-options`: every option row fits.
Practice Q26, Q28 and the Q31 case intro were each shortened by one rendered
line, with no change to what is asked. That brought Q31 onto page 34, so page
35 is not held open by one question. I read the proofs of pages 18, 31 and 35
closely, and checked the other Beyond pages and the stepped examples.

**Colour.** `check-colour.mjs` was run on pages 1, 8, 10, 11, 12, 14, 15 and
18. Page 14 (Figs 4.3 and 4.4) was read in greyscale: every piece carries its
area label, so no fill carries meaning alone.

### Short pages, logged

Each is held by a block `gaps` names, which the packer cannot move.

| page | fill | held by |
|---|---|---|
| 1 | 75% | the opener; § 4.2's head needs its opening |
| 5 | 80% | Example 3, a panel |
| 7 | 78% | § 4.4.2's head with Fig. 4.1 |
| 8 | 87% | Example 5, a panel |
| 10 | 67% | § 4.5's head, which must bring its paragraph and Fig. 4.2; the Fig. 4.1 reprint took the room |
| 22 | 56% | the last body page (the summary) |
| 26–30 | 74–85% | Solved Examples: each page is held by the next example panel or by a `Type` head with its example |
| 36 | 76% | the last page |

### Flagged, not done

- **The reprinted captions are shortened** so that each fits in one or two
  lines. The originals keep their full captions.
- **Two reprints are set smaller than their originals** (Fig. 4.3 at `sm`,
  Fig. 4.5 at `md`). The coordinator may prefer the same size, which would cost
  page 18's fit and one body page.
- **Stage 1 keeps its old commentary sentences** (*the single most useful
  thing the identities do*) and its ordinal reference *the sixth and the
  seventh*, because it is kept word for word.
- **The body flags from the language edit below are still open:**
  - p003's $x^{1/2}$;
  - the undefined word *cut* in Ex 4.3 Q6 and Q7;
  - the forward reference to *Class 9's work on factorisation*;
  - the repeated paragraph in § 4.6.
- **Ex 4.6 Q11** says *a multiple of 4 for every $x$ and $y$*. That is true
  only for whole numbers, and `ANSWERS.md` says so.
- **§ 4.2.1's Greek and Latin word origins** are a fact with no source
  recorded here.

---

Language edit, 34 pages (p001–p023 chapter proper, p101–p111 Beyond the Book).
Build after editing: 34 pages, all pages fit, 0 stranded openers, no label
collisions, every option row fits. All 32 answers in Stage 4 checked against the
questions — all correct.

**The cleanest chapter in the volume so far.** 18 fixes in 34 pages, against 101
in Chapter 1. The sentences are already short, the instructions already address
the student, the contexts are Indian (₹12 pens, Rohan, Anjali, Priya, Imran),
and every identity is proved by an area picture before it is named. Two
sentences were the only real offenders — p005's "One value proving nothing is
why the rule is worth trusting instead", which is not a sentence a teacher would
say, and p007's "that asymmetry".

Worth recording what this chapter does right, since the rest of the book is
being measured against it: it introduces *identity* as a word for a statement
true for every value, contrasts it with an equation on its own page (§ 4.7.3),
and then spends § 4.8 showing one number reached three ways. The check-by-
substituting-1 habit is taught with its limitation stated — "disagreement at one
value is proof of an error", agreement is not proof — which is the honest
version and rare in a Class 8 book.

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted. Every rupee amount written as `₹$…$` is wrapped in `<span class="nb">`, so the sign can no longer end a line with its number on the next. Nothing reflowed; `check-numbers.mjs` gives the same count of claims with and without the spans.

## FIXED

| before | after | check |
|---|---|---|
| **p002** "the numerical factor is the term's coefficient" | "the factor that is a number is the term's coefficient" | L1 |
| "the single commonest slip in this chapter" | "the most common slip in this chapter" | L1 |
| "Two conventions save ink" | "Two habits of writing save ink" | L1 |
| **p005** "One value proving nothing is why the rule is worth trusting instead." | "One value can never prove an answer right, which is why the rule is worth trusting instead." | L3 — the original is not a sentence anyone would say aloud |
| **p006** "Taking away a parcel of two things" | "Taking away a bundle of two things" | L1 |
| "not merely of the first thing it happens to meet" | "not just the first thing it meets" | L1 |
| **p007** "and that asymmetry is what makes the test worth its few seconds" | "and that one-way test is what makes it worth its few seconds" | L1 |
| **p009** "every term inside has been used, and the bracket has been paid for term by term" | "…and nothing inside has been left out" | L3 |
| **p010** "One case of this deserves its own mention" | "One case of this is worth a mention of its own" | L1 |
| **p013** Q4 "say by how much the area exceeds $x^2$ square metres" | "say how much bigger the area is than $x^2$ square metres" | L1 |
| **p015** "The commonest error in algebra" | "The most common error in algebra" | L1 |
| "squaring destroys the order" | "squaring loses the order" | L1 |
| **p019** "Any two numbers equally spaced about a round number have a product one can do in the head" | "Any two numbers the same distance either side of a round number have a product you can do in your head" | L1, L5 — and *the same distance either side* is the chapter's own phrase eight lines earlier |
| **p023** summary 1 "a term's numerical factor is its coefficient" | "the factor of a term that is a number is its coefficient" | L1 |
| **p101** "A number $x$ satisfies $x + \frac{1}{x} = 4$" | "For a number $x$, $x + \frac{1}{x} = 4$" | L1 — *satisfies* is jargon here |

No refitting needed; the fill map is unchanged and every page still fits.

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p003 | M1 | "$\dfrac{5}{x}$ is $5x^{-1}$, and $\sqrt{x}$ is $x^{1/2}$, and neither $-1$ nor $\tfrac12$ is a whole number." The fractional exponent $x^{1/2}$ has not been taught and will not be: Chapter 2 § 2.4 is explicit that its three laws now hold "for every **integer** exponent", and nothing in Class 8 defines a power with a fraction in it. So the reason given for $\sqrt{x}$ not being a polynomial rests on notation the reader has no way to read. (The $5x^{-1}$ half is fine — negative exponents are Chapter 2 § 2.4.) | Either drop the $\sqrt{x} = x^{1/2}$ half and rule out roots by saying so, or gloss it as something Class 9 will define. As written this is the one line in the chapter a careful student cannot follow. |
| p014 | C3 | Two paragraphs, three lines apart, make the same point in almost the same words. First: "They are not new mathematics, since you could expand any of them from Fig. 4.2 in half a minute. They are worth learning by heart anyway, because they turn up so often that recognising one is faster than doing it." Third: "All three could be got from § 4.5 by multiplying out, and none of them is a new rule. They are worth learning by name anyway, for the reason that a much-used result always is: recognising one on sight saves the multiplying…" | One of them should go. The second is the better paragraph — it adds "lets you run it backwards", which the first does not — but deleting a paragraph is the author's call, not mine. |
| p010, Exercise 4.3 Q6 / p022 | M1 | p010 Q6 says "Use the distributive law to work out each of these in your head, and write down **the cut** you used" — *the cut* meaning where the rectangle is divided. The word is used as though it were established vocabulary, and p011 Q7 leans on it again ("Label both cuts"), but nothing defines it; § 4.1 says "draw a line down it" and Fig. 4.1 says "divided by a vertical line". | One sentence in § 4.4.2 naming the line a *cut*, or change the two questions to say "where you divided the rectangle". The idea is fine; only the word is undeclared. |
| p017 | C5 | "That is the whole of Class 9's work on factorisation." A forward reference stated as fact, with no section or chapter named, in the middle of the one paragraph that teaches reading an identity backwards. A student cannot check it and a teacher cannot plan from it. | Name the Class 9 chapter, or drop the sentence — the paragraph works without it. |


## 21 September 2026 — figure/table reference review

Reviewed this chapter in the all-maths reference audit. Figures and tables now use one chapter sequence, including Beyond the Book; captions and references were updated together. Questions, calculations and artwork were preserved. The chapter and its volume were rebuilt; detailed layout checks and any remaining warnings are recorded in build/_all-maths-reference-checks/.
