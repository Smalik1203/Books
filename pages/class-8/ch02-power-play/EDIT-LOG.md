# Class 8 · Mathematics I · Chapter 2 — When Multiplying Takes Over

## Brought to the Class 7 standard, 17 September 2026

Phase 3 of `PLAN-MATHS-CONSISTENCY.md`, done against the Chapter 1 model. The
page move and the conversion were done in one pass. I read the whole chapter
before changing anything, and every check below was run on the whole chapter.

**Pages: 34 before (22 body + 12 Beyond, Crown Quarto), 36 after (19 body +
17 Beyond, 196 × 276).** The taller page took three pages off the body.
Beyond grew by five, because Stage 1 now carries its own explanations, and
the chapter gained 21 solved examples and 31 practice questions.

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`. The body was
refitted once (`refit … body`), after the examples were stepped. It came out
at 87–100% on every page, so no hand-fitting was needed.

**All seven body examples set as steps.** Each now has *Solution*, one
`.work__row` per step, an *Answer* row, and the reason in a `.work__why`. The old wide labels (`$32400$`,
`top`, `then`, `letters`, `digits`) and the `.chip` answers became Step and
Answer rows. Two changes went beyond the rows themselves:
- Example 5's question listed nothing; its four expressions were in the
  labels. The question now names them, using the same maths spans.
- In Example 4, the remark *writing out a hundred twos…* moved after the
  working. In Example 6, the sentence *For the second the point moves the
  other way* moved before the Solution.

Remarks that are not steps stay as paragraphs after the working.
`build/check-example-stepping.mjs` reports 7 examples and no mathematics
lost.

**Exercise Set 2.2 renumbered after its first question 5.** The set was printed
1, 2, 3, 4, 5, 5, 6, 7 (flagged below since the language edit). The second
5, and the 6 and 7 after it, are now 6, 7 and 8. No sentence refers to them
by number.

**Opener table, 26 folds.** *taller than any building on earth* became
*taller than almost every building on earth*. The Burj Khalifa (828 m) and
Merdeka 118 (679 m) are both taller than 671 m. The number is unchanged.

**Beyond the Book rebuilt to the four current stages** (§6a):

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 8 `.c-try` questions, answered in the next stage; `.c-stage__for` | **the same questions, each followed by its own explanation**, word for word except as below; no `__for` |
| 2 Behind Each Answer → **Solved Examples** | the worked answers to stage 1 | **21 stepped examples**, Examples 1–21, under eleven `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, 27 questions | **one numbered run of 31**, all six forms, band carrying the numeral |
| 4 Answers & Takeaways → **Answers** | key, why the options are wrong, closing essay | key, every other answer in `.work--trace` blocks, why the options are wrong for 14 questions, and two closing paragraphs |

**Stage 2 held Stage 1's explanations, as in every Class 8 chapter.** Each
explanation moved under its own question, and only the `.c-solution` wrapper
and its title were dropped. Sentences that pointed elsewhere were corrected:
- *Try each before turning the page* → *before reading what follows it*
- *Every solution overleaf* → *Every explanation above*
- *met two solutions ago* → *met in the question on $7^{100}$*
- *Those two solutions* → *Those two explanations*

The remarks that followed the questions now come after the last
explanation, as in the model. They named the questions *the first three and
the fifth* and *the other three*, which did not match the questions even
before this pass. They now name the questions by content, as the questions on
$2^{60}$, $2^{100}$, $3^{500}$ and the rumour, and the questions on
$7^{100}$ and the fifth power. §10 warns against ordinal references to
`.c-try` bands.

**Two Stage 1 items changed, because each answered a body question** (the
no-give-away rule beats word for word):

| was | answered | now |
|---|---|---|
| $2^{100}$ or $100^2$; the $n$ from which $2^n > n^2$ (table $n = 1$–$6$) | Ex 2.6 Q6 (c) outright; the reasoning answers Q6 (b) ($2^8$ or $8^2$); the table prints $2^6$ and $6^2$ (Ex 2.1 Q4 (c)) | $2^{60}$ or $60^3$; the $n$ from which $2^n > n^3$ stays true ($n = 10$, table $n = 1$–$10$) |
| rumour: each tells **three**, so $\times 4$; $4^{10} = 2^{20} = 1\,048\,576$ is past a million | Ex 2.2 Q8 ($2^{20}$ or $10^6$) | each tells **two**, so $\times 3$; $3^{12} = 531\,441$, $3^{13} = 1\,594\,323$: **13 hours** |

The new $n^3$ explanation also replaces the old reason, *which it has by
then*, which the language edit flagged as M3. The new reason is that
$11^3 = 1331$ is not even one and a half times 1000, and that the ratio only
falls.

**Other Beyond give-aways checked by reading.** I checked every value Beyond
prints against the body's exercise list. Old practice items that repeated or
answered the body were dropped, not reworded:
- $3^4$ (Ex 2.1 Q4 (a))
- $2^{-3}$ (the body's own tip)
- $10^0$
- $2^{10}$ as a power of 4 (Ex 2.2 Q5 asks $2^{12}$)
- 26-letter five-character passwords (Ex 2.5 Q4)
- $2^{20}$ closest to $10^6$ (Ex 2.2 Q8)
- $n^0 = 1$ holds for (the key idea, restated)
- the $\times 4$ rumour

New items were chosen to avoid body values:
- The quiz example uses $3^6$ rather than $2^8$, which is Ex 2.6 Q6 (b).
- The estimate example uses $2^{45}$, not $2^{20}$ or $2^{30}$, which are
  Ex 2.2 Q8 and Ex 2.6 Q10.
- The storage case asks for 1 TB rather than 1 GB.

`build/check-no-repeats.mjs` reports no question close to a body question.

**Worked examples in the chapter: 28** (7 body + 21 Beyond), against §5a's
twelve. Every topic has a type:
- powers of primes
- negative bases
- multiplying and a power of a power
- same exponent with different bases
- dividing
- zero and negative exponents
- expanded form with powers of ten
- standard form (writing, ordering, multiplying)
- counting the possibilities
- estimating
- the last digit of a power

**Practice: 31 questions** in all six forms: 15 multiple choice (key
letters a ×3, b ×4, c ×4, d ×4), 4 assertion–reason (one of each letter),
3 very short, 4 short, 3 long and 2 case-based. Eleven of the multiple-choice
questions are kept from the old sets, with their options re-lettered to spread
the key.

**`ANSWERS.md` written** for every question the chapter sets:
- Exercise Sets 2.1–2.7, with a worked instance for each *answers will vary*
- the three Think and Reflects
- Stage 1 (pointing to its own explanations)
- the 31 practice questions, with their working

### Verified

`check-numbers.mjs` is kept beside the pages. It passes **496 claims**:
- **Printed identities.** It evaluates 323 printed identities on the pages
  and in `ANSWERS.md`. A chain broken by $\approx$ is checked one exact run at
  a time.
- **Values the identities do not cover.** Every row of the opener table is
  re-derived from $0.001 \times 2^n$ cm, and so is the four-fifths claim. It
  checks the digit counts of $2^{100}$ and $3^{500}$ and the last digits of
  $7^{100}$, $3^{2024}$, $2^{88}$ and $3^{25} + 7^{25}$, using BigInt.
- **Searches.** It re-derives the Stage 1 $n^3$ table and the $n = 10$ search
  (checked to 200), the 13-hour rumour, and the rice figures.
- **Examples and answers.** It checks every Beyond example, every practice
  answer (read back out of the key, one lettered part at a time), and the
  body answers in `ANSWERS.md`. These include the day 29/28 pond, the
  10-digit dairy code, the $n = 24$ fold, and one billion seconds as
  31 years 9 months.
- **Multiple choice and keys.** Every multiple-choice question is solved and
  must have exactly one right option matching the key. The assertion–reason
  letters are derived. `ANSWERS.md`'s key must match the page's.

The 57 spans it skips are algebra; `--skipped` lists them.

**Tested by breaking values on purpose.** Ten values were changed one at a
time and each change was caught:
- Example 8's $5^3 = 125$ changed to 135
- key 7 changed to (c)
- `ANSWERS.md` key 12 changed to (d)
- the opener's 671 m changed to 681 m
- `ANSWERS.md`'s $n = 24$ changed to 23
- the Stage 1 table's 729 changed to 719
- key row 26's 4096 changed to 4086
- option 9 (d) changed from 5 to 7
- key 31 (b)'s 4096 songs changed to 4000
- Q30 (c)'s *11 hours* changed to 12

The last change was **missed** at first, because 11 also appears inside
$2^{11}$ in the same part. The hour count is now read on its own, and the
change is caught.

**Fixes in the checks themselves.** Exercise Set 2.2's four wrong statements,
printed to be explained, are listed as false on purpose, as are the two
$0^0$ lines. A leading minus is read as applying to the whole power
($-4^2 = -16$).

**A wrong number I wrote, caught while writing `ANSWERS.md`.** The billion
seconds first read *31 years and 8 months* and *early 1995*. $10^9 \div
(3.15 \times 10^7) = 31.75$, which is nearly 31 years 9 months: the end of
1994, counting back from September 2026. It was corrected before the file was
checked.

**Fitting.** Nothing is clipped, and nothing runs into the bottom margin.
- `orphans`: 0 stranded openers in 36 pages.
- `check-labels`: no collisions.
- `fit-options`: one list (Q10, whose options include *it cannot be
  decided*) was narrowed to two columns with `--fix`; every row now fits.
- Refitting the division once left the Answers stage's first page at 86%. I
  moved the *why* rows for 7 and 8 back onto it as their own `.work--trace`
  block, which took page 35 to 97%.

I read the proofs of pages 3, 5, 10 and 15 (the stepped examples) and of
every Beyond page (20–36).

**Colour.** Pages 1, 5 and 10 were read in greyscale and under simulated
deuteranopia (`build/check-colour.mjs`). Nothing depends on hue alone:
Fig. 2.1's levels carry their own labels and positions, and Fig. 2.2's
marked point is labelled $2^0$ and 1.

### Short pages, logged

Each is held by a block `gaps` names, which the packer cannot move.

| page | fill | held by |
|---|---|---|
| 5 | 87% | the `h3` 2.3.1, which may not be stranded |
| 25 | 80% | Example 5, a panel |
| 26 | 77% | the Type 5 head with Example 8 |
| 28 | 77% | the Type 8 head with Example 14 |
| 29 | 79% | the Type 9 head with Example 17 |
| 30 | 86% | Example 20, a panel |
| 34 | 71% | **the Answers stage, which always opens a page** |
| 36 | 62% | the last page |

### Flagged, not done

- **The paper thickness is still unresolved** (first row of FLAGGED below).
  The chapter's arithmetic uses $0.001$ cm, and the check re-derives every
  printed value from that. The sentence *a tenth of a millimetre* still
  contradicts it. The old closing paragraph that repeated *a tenth of a
  millimetre* was not carried into the new Answers stage.
- **Facts without a source in this log:**
  - the Moon at 384 400 km
  - the Burj Khalifa and Merdeka 118 heights (used for the table fix)
  - the stars in the galaxy, and the Sun–Earth and Sun–Saturn distances
  - the masses of the Earth, Moon, electron and proton
  - Avogadro's number, and the $9.5 \times 10^{15}$ m light-year
  - Mumbai's two crore
  - a rice grain at 0.025 g and the world rice harvest at
    $5 \times 10^8$ tonnes (Stage 1)

  §5a asks for a source for each before press.
- **Fig. 2.1 draws overlapping key circles.** Branches from neighbouring
  baskets meet at $x = 79/81$ and $x = 121/119$, so two pairs of the 27 keys
  print as clumps. Also, the circles for the 9 baskets are very pale in
  greyscale. The figure art was not changed in this pass.
- The storage case (Q31) takes 1 KB to be $2^{10}$ bytes and says so in the
  question. Some schools teach $10^3$.
- Stage 1 keeps the old coaching sentences (*the general recipe is worth
  keeping*, *the manoeuvre is different*), because it is kept word for word.
  §6a would not write them today.
- p008's *which we will state properly in a moment* introduces
  $\dfrac{m^a}{n^a} = \left(\dfrac{m}{n}\right)^a$, but no key idea ever
  states it (M3/C6). Stating it would add a key idea to the body, so it is
  left for an authoring pass.

---

Language edit, 34 pages (p001–p022 chapter proper, p101–p112 Beyond the Book).
Build after editing: 34 pages, all pages fit, 0 stranded openers, no label
collisions, every option row fits. All 27 answers in Stage 4 checked against the
questions — all correct.

Better written than Chapter 1 and much closer to the governing rule already: the
contexts are Indian (Mumbai's two crore, a dairy's milk packets, Damayanti's
ponds, Estu and Roxie), the notation is introduced before it is used, and $n^0$
and $n^{-a}$ are derived rather than announced. The language defects are
scattered rather than structural.

The serious problem in this chapter is not language. **The opening hook states a
paper thickness that contradicts every calculation in the chapter** — see the
first row of FLAGGED. Nothing downstream of it can be trusted until an author
decides which number is right.

**Coordinator, same day:** the paper thickness is settled. NCERT uses 0.001 cm and every calculation and the table here use it; the opener's *a tenth of a millimetre, which is ordinary printing paper* was the error (0.001 cm is a hundredth of a millimetre). p001 now reads *Its thickness is $0.001$ cm, a hundredth of a millimetre, and every fold doubles it.* Rebuilt; same fill, check-numbers passes.

### Accepted, 17 September 2026

Checked by script (PLAN §4.8) and accepted; the paper-thickness fix is recorded above.

## FIXED

| before | after | check |
|---|---|---|
| **p001** "it is the paper running out of give" | "it is the paper that cannot bend any more" | L3 |
| "nothing much appears to be going on right up until everything is" | "nothing much seems to be happening, until suddenly it all does" | L3 |
| **p002** "Each fold merely doubles" | "Each fold only doubles" | L1 |
| "the difference is easier to feel than to argue" | "…easier to see than to explain" | L3 |
| "The gap is not merely large; it is growing faster than any way of describing it." | "The gap is not just large; it grows wider at every step." | L3 — the original says nothing a reader can hold |
| "The raised number was never restricted to 2 and 3; it simply counts the copies." | "…was never limited to 2 and 3; it just counts the copies." | L1 |
| **p003** "which, after Chapter 1, is where the answers live" | "…is where the answers are" | L3 |
| "the first sign of what the notation buys" | "…what the notation gives you" | L3 |
| **p004** "That is not a technicality" | "That is not a small detail" | L1 |
| "because the answers alternate" | "because the answers change sign each time" | L1 |
| "separately from Chapter 1's remark about squares and cubes" | "separately from what Chapter 1 said about squares and cubes" | L1 |
| **p005** "so the diamonds number $3^7$" | "so there are $3^7$ diamonds" | L3 |
| **p006** "and taking the splits seriously gives the second law" | "and looking at those splits closely gives the second law" | L3 |
| **p007** "Had she used the tripling pond first the answer would be…" | "If she had used the tripling pond first, the answer would be…" | L3 — inverted conditional |
| "notice how carefully they divide the work between them" | "see how they divide the work between them" | C8, L1 |
| **p008** "which we can state properly in a moment: … , on the same argument with the pairs written as fractions" | "…which we will state properly in a moment: … . The argument is the same, with the pairs written as fractions." | L4, L6 |
| "The exclusion of $n = 0$ is not fussiness." | "Ruling out $n = 0$ is not being fussy." | L1 |
| **p009** "the answer turns out to be forced" | "the answer is decided for us" | L3 |
| **p010** "if we insisted that they went on holding" | "if we insisted that they kept working" | L3 — and matches the wording two paragraphs later |
| **p011** "Nothing further needs to be learnt about them" | "There is nothing more to learn about them" | L5 |
| "the laws become obvious rather than remembered" | "the laws become obvious instead of something to remember" | L5 |
| **p013** "exactly the sort of task at which eyes fail" | "exactly the kind of thing eyes are bad at" | L3 |
| **p014** "Nothing about the coefficients had to be examined." | "You did not have to look at the coefficients at all." | L5 |
| **p015** "One consequence catches people out." | "People often get one thing wrong here." | L3 |
| "What nobody may do is add digits that were never measured." | "What you must never do is…" | L5 |
| **p017** "the folded sheet again, in a different costume" | "the folded sheet again in another form" | L1 |
| **p018** "We need not evaluate $2^{46}$ exactly" | "We do not need to work out $2^{46}$ exactly" | L1, L5 |
| **p019** "and it was got without multiplying anything larger than 64" | "and we got it without multiplying…" | L5 |
| "That is what this chapter buys you." | "That is what this chapter gives you." | L3 |
| **p020** "a shade over $10^3$" | "a little over $10^3$" | L1 |
| "the second frequently cannot" | "the second often cannot" | L1 |
| **p021** "is outside anything experience has prepared us for" | "is outside anything we have ever seen" | L3, L6 |
| **p022** "The second outruns the first by margins that no intuition prepares you for" | "The second leaves the first far behind, by more than anyone can guess" | L1, L2 |
| "Neither is a convention chosen for convenience" | "Neither is a rule chosen to make life easy" | L1 |
| **p101** "Every question below yields to that." | "Every question below can be done with that." | L1 |
| "and then the comparison is free" | "and then the comparison is easy" | L3 |
| **p102** "the same manoeuvre in different clothes" | "the same move in different clothes" | L1 |
| "a calculator that will overflow anyway" | "a calculator that cannot hold the answer anyway" | L1 — *overflow* is a computing word |
| "A pattern spotted is a conjecture; a pattern explained is a result." | "A pattern you have spotted is only a guess; a pattern you have explained is a result." | L1, L5 — *conjecture* is taught nowhere in this book |
| "If a question resists, make it smaller." | "If you cannot get started, make the question smaller." | L3 |
| "which is where they earn their keep" | "which is where they do the most work" | L1 |
| **p103** "Tabulate:" | "Make a table:" | L1 |
| "$7^5$ ends in 7 — and round it goes" | "…— and the cycle starts again" | L3 |
| **p104** "from what had looked like a close-run thing" | "…a close contest" | L1 |
| **p105** "how a chain letter propagates" | "how a chain letter travels" | L1 |
| "Is it payable?" | "Could it be paid?" | L1 |
| **p106** "mathematicians decline to choose one" | "mathematicians do not choose either" | L1 |
| "let the existing laws go on holding" | "let the laws we already had keep working" | L3 |
| "Try six and the pattern is unmistakable." | "Try six of them and the pattern is clear." | L1 |
| "by reducing the exponent modulo the length of its cycle" | "by dividing the exponent by the length of its cycle and keeping the remainder" | M1 — *modulo* is years above Class 8 and appears nowhere else in the book |
| **p110** "the commonest error in the chapter" | "the most common error in the chapter" | L1 |
| **p111** "Three habits outlast the questions that carried them." | "Three habits will last longer than the questions that carried them." | L1 |
| "nearly always more productive than" | "nearly always more useful than" | L1 |

No page needed refitting — the build came back all-clear on the first rebuild.

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p001 prose vs p001 table, p002, p018, p019, p021 Q6 | C3, C4 | **The paper is a factor of ten too thick.** p001 says "Its thickness is a tenth of a millimetre, which is ordinary printing paper" — that is $0.01$ cm. Every calculation in the chapter uses $0.001$ cm: p002's "$0.001 \times 2 \times 2 \times \cdots$", p018's "$0.001 \times 2^n$ cm", p019's "Multiply by $0.001$", and Exercise 2.7 Q6's "A sheet of paper $0.001$ cm thick". The p001 table is consistent with $0.001$ cm and inconsistent with the sentence above it ($0.128$ cm at 7 folds is $0.001 \times 2^7$; a tenth of a millimetre gives $1.28$ cm). A student who believes the sentence and does the arithmetic gets $7.0 \times 10^6$ km at 46 folds — eighteen times the distance to the Moon, not "past the Moon, and most of the way back". And the sentence is right about paper: ordinary printing paper *is* about $0.1$ mm; $0.01$ mm is tissue-thin and not a real sheet. So either one sentence is wrong or the whole chapter's arithmetic is. | An author decision. Changing the sentence to "a hundredth of a millimetre" keeps every number but describes no real paper. Changing the paper to $0.1$ mm is honest but re-does the table, p002, p018, p019, Exercise 2.7 Q6, and the Moon claim that the chapter opens and closes on. I have changed neither, because both are numbers. |
| p001, table row 4 | C4 | "$26$ folds · $671$ m · **taller than any building on earth**". The Burj Khalifa is $828$ m and Merdeka 118 is $679$ m, both taller. The row is stated as fact in the first table of the chapter. | Either a truthful comparison at $671$ m (taller than almost every building; taller than the Statue of Unity) or a different fold count. Depends on how the row above resolves. |
| p009 Exercise 2.2 Q5 / p010 Q5 | C4 | **Two questions numbered 5.** p009 ends with `data-start="5"` ("Write $2^{12}$ as a power of $4$…") and p010 opens with `data-start="5"` ("Explain in one sentence each why these are wrong"), then continues 6 and 7. The set reads 1, 2, 3, 4, 5, 5, 6, 7. | Renumbering cascades through p010, so the author should take it: the second 5 becomes 6, and 6 and 7 become 7 and 8. |
| p110, B2 | C5 | "(b) keeps the exponent while changing the base, which doubles the exponent's worth by mistake." Not followable. The error being described is writing $4^{10}$ for $2^{10}$, and the reason it is wrong is that changing base $2$ to $4$ without halving the exponent squares the value. "Doubles the exponent's worth" says neither. | A plain statement of what goes wrong. I have not rewritten it because any clear version states a relation the line does not contain, which would be new explanation. |
| p103 | M3 | "each step doubles the first while the second grows by only $2n + 1$, and doubling wins the moment the total exceeds $2n+1$, which it has by then." The claim being proved is that $2^n \gt n^2$ for every $n \ge 5$, and this is the whole argument for it. "Which it has by then" is not a reason. | One extra line — at $n = 5$, $32 \gt 11$, and the gap only widens — or an honest admission that the table checks and does not prove. |
| p003 tip, and throughout | M1 | "$n^a$ means $n$ multiplied by itself $a$ times", and the tip's "$3 \times 4$ … is $4$ added to itself three times". Both are the standard schoolbook looseness (three copies, two multiplications; three additions of 4 is $4+4+4$ only if you start from nothing). Consistent with Chapter 1, so nothing here contradicts anything — but this is the chapter that defines powers properly, so it is the chapter where the looseness costs the most. | Same single book-wide decision recorded for Chapter 1. See CROSS-CHAPTER.md. |
