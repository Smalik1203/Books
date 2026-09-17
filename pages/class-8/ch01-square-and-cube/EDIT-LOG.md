# Class 8 · Mathematics I · Chapter 1 — The Shape of a Number

## Brought to the Class 7 standard, 17 September 2026

Phase 3 of `PLAN-MATHS-CONSISTENCY.md`, worked by hand as the model for the
other thirteen Class 8 chapters. Class 8 is the first class to move page, so
the page move and the conversion were done in one pass. The chapter was read
whole before anything was changed, and every check below was run on the
chapter, not on a page.

**Pages: 38 before (27 body + 11 Beyond, Crown Quarto), 40 after (24 body +
16 Beyond, 196 × 276).** The taller page took three pages off the body. Beyond
grew by five: its first stage now carries its own explanations, and the
practice stage runs to 31 questions in six forms.

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`. The body was
refitted once, after the examples were stepped, so it was moved and
converted in a single refit.

**All twelve body examples set as steps.** *Solution*, a step to a
`.work__row`, an *Answer* row, the reason in a `.work__why`. The old wide
labels (`$324$`, `from 25`, `LCM`) and the `.chip` answers became Step rows
and Answer rows. Where a sentence was a remark and not a step, it stays as a
paragraph after the working: Example 2's *it says five*, Example 6's *nothing
smaller will do*, Example 9's *answered by squaring*, Example 12's
*striking out three digits*. Example 8's Fig. 1.5 now follows the working
instead of splitting it. Verified by `build/check-example-stepping.mjs`:
12 examples, no mathematics lost.

**Page 24, the summary.** After the refit the summary missed the foot of
page 24 by 2 mm and left that page 33% full. Three of its items were
tightened by one line each (items 9, 10 and 13; no fact changed), and it was
moved onto page 24 by hand rather than by a second refit. Page 24 now closes
the body at 99% and carries `data-close`.

**Beyond the Book rebuilt to the four current stages** (§6a):

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 8 `.c-try` questions, answered in the next stage | **the same questions, each followed by its own explanation**, word for word except as below; `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | the worked answers to stage 1 | **18 stepped examples**, Examples 1–18, under eight `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, 27 questions | **one numbered run of 31**, all six forms, band carrying the numeral |
| 4 Answers & Takeaways → **Answers** | key and why the options are wrong | key, every other answer, why the options are wrong for 12 questions; the *carry forward* paragraph kept without its head |

**Class 8's Stage 2 was not a second set of problems.** Every Class 8
chapter's *Behind Each Answer* carries the line *The same questions, worked*:
it holds the explanations of Stage 1's own questions. Classes 6 and 7 put the
explanation straight after each question, which is the shape §6a describes.
So the explanations were moved under their questions rather than turned into
stepped examples, which the user has ruled out for Stage 1. Only their
*Solution* titles were dropped. Four sentences that pointed *overleaf* or
*turn the page* now point *below* or *read on*, and the note on which
questions share an idea was corrected for the replacements.

**Three Stage 1 items replaced**, because each answered a body question
(the decision of 16 September: the no-give-away rule beats word for word):

| was | answered | now |
|---|---|---|
| exactly three factors: the four smallest | Exercise Set 1.1 Q4 | exactly **five** factors: fourth powers of primes, 16 and 81 |
| square and cube below 1000; the next one | Exercise Set 1.6 Q15 | smallest $n$ with $2n$ a square and $3n$ a cube: 72 |
| digits in the cube of a two-digit number | Exercise Set 1.5 Q4 (c), (d) | digits in the **square** of a two-digit number: 3 or 4 |

The *carry forward* paragraph's third habit was rewritten to match
(*square-and-cube meant sixth power* became *read one prime at a time*).

**One printed claim corrected in Stage 1.** The sum-of-two-squares search
said *most numbers give no pair at all; 25, 34 and 45 each give exactly one*,
which reads as though those were the only three below 50. Thirteen others
give one (2, 5, 8, 10, 13, 17, 18, 20, 26, 29, 32, 37, 40, 41). Now *some,
such as 25, 34 and 45, give exactly one*.

**Nothing repeats or answers the body.** `build/check-no-repeats.mjs`
reports 12 pairs above 50%, every one *same type, different numbers*. The
check was also done by reading, number by number, and four more
give-aways were found and changed. The tool cannot see these, because the
wording differs:

| where | printed | answered | now |
|---|---|---|---|
| Example 15 | $3000 \div 3 = 1000 = 10^3$ | Ex 1.6 Q1 (is 1000 a cube) | 4375, divide by 35, $125 = 5^3$ |
| Example 1 | $64 = 8 \times 8$ is a square | Ex 1.6 Q1 (64) | locker 100 |
| key to Q2 | 1024 is $32^2$ | Ex 1.6 Q6 | option 1024 became 1296 |
| Q30 (c) | $8^3 = 512$ fits | Ex 1.5 Q1 ($\sqrt[3]{512}$) | 250 blocks, edge 6, 34 over |

The old multiple-choice questions that repeated the body were dropped, not
reworded: $\sqrt[3]{512}$, $\sqrt[3]{3375}$ and $\sqrt{1156}$ (asked or
worked in the body), $1024 = 2^{10}$ (Ex 1.6 Q6), $101 + \cdots + 199$
(its working prints Ex 1.6 Q4), the first number both square and cube
(Ex 1.6 Q15), and the squares below 10 000 (Ex 1.6 Q8). Fifteen
multiple-choice questions remain, with the answers spread over the letters
3, 4, 4, 4.

**Worked examples in the chapter: 30** (12 body + 18 Beyond), against §5a's
twelve. Every topic is worked under a type: factors and squares, last digits
and zeros, odd numbers and the gaps between squares (with the triangular
numbers), square roots by factorisation, trapping a root, cubes and cube
roots by factorisation (with negatives and decimals), cube roots from the
digits, and taking differences.

**`ANSWERS.md` written** for every question the chapter sets: the six
exercise sets, the three Think and Reflects, Stage 1 (pointing to its own
explanations), and the 31 practice questions with their working.

### Verified

`check-numbers.mjs` is kept beside the pages. It passes **513 claims**,
evaluating 372 printed identities on the pages and in `ANSWERS.md`,
including arithmetic runs such as $1 + 2 + \cdots + 19 = 190$. It also
re-derives by search or factorisation what arithmetic alone cannot check:
the open lockers, the numbers with five factors, the smallest $n$ in Stage 1
Q4, 1729 and 50 as the first numbers with two pairs, every
smallest-multiplier and smallest-divisor, and every body exercise answer in
`ANSWERS.md`. Every multiple-choice question is solved and must have exactly
one right option matching the key; every assertion–reason letter is
derived; and `ANSWERS.md`'s key must match the page's. The 30 spans it skips
are algebra, and `--skipped` lists them.

**Tested by breaking values on purpose.** Each of these was caught:
$\sqrt{1764}$ printed 44; key 14 changed to (b); Q30's leftover changed to 36;
$4104 = 729 + 3376$ in `ANSWERS.md`; 25 removed from Example 1's factor list
of 100; Q28's 54 changed to 56; a Q14 option changed to 46;
$1089 = 31^2$ in the body; Example 15's 125 changed to 135. Q31 (c)'s
*nearer 17* changed to *nearer 18* was **missed** at first, because 17 also
appears in part (a). Rows 30 and 31 are now checked one lettered part at a
time, and the change is caught.

**Two faults in the check itself**, fixed: the answer key was read past the
end of its list, picking up *30 (a)* from a working row; and Q19's
assertion $(-4)^2 = -16$, which is printed to be judged false, was reported
as a wrong identity. It is now listed as false on purpose.

**Fitting.** Nothing is clipped. Page 3 runs 1.3 mm into the bottom margin,
inside §5a's 3 mm. `orphans`: 0 stranded openers in 40 pages.
`check-labels`: no collisions. `fit-options`: every option row fits. The
answer lists were split into smaller `.work--trace` blocks so that
*Why the other options are wrong* can start under its head. That took page
39 from 64% to 91%. Proofs of pages 7, 12, 24, 25, 29, 36 and 39 were read. Example 3's closing remark left its full stop alone on a line; the sentence was turned round (same maths spans) to close it.

**Colour.** Pages 1, 2, 7, 9, 29 and 36 were read in greyscale and under simulated deuteranopia, protanopia and tritanopia (`build/check-colour.mjs`). Nothing depends on hue alone: the locker figure marks open lockers by shape as well as fill, the example tab and key-idea rules carry their words, and the stage marks carry numerals.

### Short pages, logged

Each is held by a block `gaps` names, which the packer cannot move.

| page | fill | held by |
|---|---|---|
| 1, 2 | 86% | a figure; an exercise band whose first question does not fit |
| 4 | 83% | Example 1, a panel |
| 10 | 80% | Example 4, a panel |
| 12 | 74% | an `h3`, which may not be stranded, and Example 8 under it |
| 13 | 74% | Example 9, a panel |
| 20 | 86% | Exercise Set 1.5's band |
| 29–34 | 74–84% | Solved Examples: each page is held by the next example panel or a `Type` head with its example |
| 37 | 86% | the case-based questions |
| 38 | 65% | **the Answers stage, which always opens a page** |
| 40 | 60% | the last page |

### Flagged, not done

- Stage 1 keeps the old coaching sentences (*the general move is worth
  keeping*, *worth recognising as a move*), because it is kept word for word.
  §6a would not write them today.
- The key idea on page 7 breaks $2n - 1$ across a line (KaTeX breaks at the minus). Not fixed: it needs a non-breaking maths span in the system, not an inline style.
- Stage 1 runs to four full pages. That is the cost of keeping each
  explanation whole under its question.
- The body's *Where the Words Came From* (§ 1.6) states historical facts:
  Babylonian tables around 1700 BCE, Āryabhaṭa in 499 CE, Brahmagupta in
  628 CE, *jidhr* and *radix*. So does the taxicab story. Neither carries a
  source in this log. §5a asks for one before press.



Language edit, 38 pages (p001–p027 chapter proper, p101–p111 Beyond the Book).
Build after editing: 38 pages, all pages fit, 0 stranded openers, no label
collisions, every option row fits.

The maths in this chapter is sound. Every answer key in Stage 4 was checked
against the questions and all 27 are correct. The defect is register: long
stretches are written in adult essay English — *manoeuvre*, *consolation
prize*, *earn its keep*, *what this buys you*, *casting about* — and three
terms (*parity*, *exponent*, *differencing*) are used as though taught when the
chapter never teaches them. *Exponent* belongs to Chapter 2.

### Accepted, 17 September 2026

Accepted as the model. No further change.

## FIXED

| before | after | check |
|---|---|---|
| **p001** "That is not a decorative fact." | "That is not a small point." | L1 |
| "however they are arranged" | "no matter how you arrange them" | L1 |
| "What settles it is one small question:" | "One small question settles it:" | L5 |
| **p002** "Which is the point: a question about a hundred lockers…" | "That is the point: …" | L3 |
| "a pattern we shall come back to" | "a pattern we will come back to" | L1 |
| Key-idea title "Squares, and why they are odd out" | "Squares, and why they are different" | L3 — idiom, and a pun on *odd* that a second-language reader reads as an error |
| **p003** "The name is older than the notation and comes from exactly where it looks like it comes from." | "The name is older than the notation, and it comes from just where you would expect." | L3 |
| "Writing 5 × 5 every time is tiresome, so it is shortened." | "…is slow, so we shorten it." | L1, L5 |
| **p004** "Nothing in the definition insists that n be a whole number." | "…says that n has to be a whole number." | L1 |
| "Keep the two ideas apart: squaring is something you do to any number, while a perfect square is a natural number that happens to be the result of squaring another." | two sentences; "A perfect square is a natural number that you get by squaring another." | L4, L1 |
| **p005** "be careful about what this buys you, because it is a one-way test" | "be careful about what this test can do, because it works only one way" | L3 |
| "worth collecting here, since both come from the same place and both save work later" | "worth knowing. Both come from the same place, and both save work later." | L4 |
| **p006** "**Squaring keeps parity.**" | "**Squaring keeps a number odd or even.**" | L1 — *parity* is never taught in this chapter or this class |
| "no square is ever the wrong parity for its root" | "there are no exceptions" | L1, M1 — also used *root* before § 1.3 defines it |
| **p007** "a habit worth acquiring, and it will earn its keep" | "a habit worth picking up, and it is useful" | L1 |
| "by how much does each one exceed the last?" | "by how much is each one bigger than the last?" | L1 |
| "A list that looks arbitrary can have differences that are perfectly orderly" | "A list that looks random can have differences that are in perfect order" | L1 |
| "grow in a lumpy, accelerating way" | "grow in uneven jumps, faster and faster" | L1 |
| "The reason is best seen rather than argued." | "The reason is easier to see in a picture." | L3 |
| "because the shape of the sum was recognised rather than the sum performed" | "because you saw the shape of the sum instead of doing the sum" | L5 |
| "The picture and the formula are worth keeping both." | "Keep both the picture and the formula." | L3 |
| **p008** "does not merely say *yes*" | "does not only say *yes*" | L1 |
| **p009** "the same manoeuvre" | "the same move" | L1 |
| "They start close together and draw apart for ever." | "…and get further and further apart." | L3 |
| **p011** "Since it would be tiresome to write both every time, the symbol … is defined to mean" | "Writing both every time would be slow, so the symbol … is taken to mean" | L1, L5 |
| "So much for what a root is." | "That is what a root is." | L3 |
| "It works, and it is honest, and for a six-digit number it is hopeless." | "…and it is honest, but for a six-digit number it is hopeless." | L3 |
| "Squaring doubles every exponent" | "Squaring doubles how many times each prime appears" | L1, M1 — *exponent* is Chapter 2's word |
| "so it is 32² and nothing else it could have been" | "so it is 32², and it could not have been anything else" | L3 |
| **p012** "a perfectly respectable ending" | "a perfectly good ending" | L1 |
| "The unpaired primes are worth staring at" | "…are worth a close look" | L3 |
| "why this third method displaces the other two" | "…replaces the other two" | L1 |
| "both do work proportional to the size of the number … Factorising does work proportional to the size of the *factors*" | "both take more work the bigger the number is … Factorising takes more work only when the *factors* are large" | L1, L6 |
| **p014** "a skill and not a consolation prize" | "a real skill and not second best" | L1 |
| "Two facts already established will corner a root" | "Two facts you already have will trap a root" | L1, L5 — *trap* is the chapter's own word two lines later |
| **p015** "a shape of argument" | "a kind of argument" | L1 |
| "hardly ever obliges by handing you a perfect square" | "hardly ever hands you a perfect square" | L1 |
| **p016** "the writing is shortened" | "we shorten the writing" | L5 |
| **p017** "Only 0, 1, 4, 5, 6 and 9 send themselves." | "…end their cubes in themselves." | L3 |
| "cubing keeps parity as squaring did" | "cubing keeps a number odd or even, as squaring did" | L1 |
| "Cubing is not restricted to whole numbers" | "…not limited to whole numbers" | L1 |
| **p018** "Cubes run from $-\infty$ to $\infty$" | "So cubes run both ways, far into the negative numbers and far into the positive" | M1 — the infinity symbol is years above Class 8 and is used nowhere else in the chapter |
| "Hardy, who received a good deal of unpromising post" | "Hardy, who got plenty of letters that led nowhere" | L2 |
| "Casting about for something to say, Hardy remarked that … — he hoped it was not a bad omen." | "Short of something to say, Hardy said that … He hoped it was not a bad sign." | L1, L4, L6 |
| "a small beginning on the same acquaintance" | "a small start on the same kind of friendship" | L1 |
| **p019** "you will have to run it on a few terms" | "you will have to carry it on a few more lines" | L3 |
| "Checking it is not beyond you: for each candidate, … whether the remainder is a cube too" | "You could check it yourself. For each number, … whether what is left is a cube too" | L1, L4 |
| "spaced evenly about n²" | "spread evenly around n²" | L1 |
| **p020** "that is the sort of coincidence that usually turns out not to be one" | "a coincidence like that usually turns out not to be a coincidence at all" | L3 |
| "the exponents double … the exponents treble" | "the count of each prime doubles … the count triples" | L1, M1 |
| "which is why it needs no remembering once you have seen it once" | "which is why you do not have to remember it once you have seen it" | L5 |
| **p021** "the one most often mangled" | "the one most often got wrong" | L1 |
| "Its two trailing zeros said as much before we started." | "…said so before we started." | L3 |
| **p022** "the largest cube not exceeding it" | "the largest cube that fits inside it" | L1 |
| "the answer's two digits can be found one at a time" | "you can find the two digits one at a time" | L5 |
| "Fed 4900 it would answer 10" | "Given 4900 it would answer 10" | L1 |
| **p023** heading "Differencing until it stops changing" | "Taking differences again and again" | L1 — *differencing* is a coined verb |
| caption "rounds of differencing" | "rounds of taking differences" | L1 |
| "Difference the fourth powers four times" | "Take differences of the fourth powers four times" | L1 |
| "differencing is the first thing to try … whenever a sequence has to be identified rather than remembered" | "taking differences is the first thing to try … whenever you have to work out a sequence rather than remember it" | L1, L5 |
| Ex 1.5 Q5 "Answer without evaluating the cubes." | "Answer without working out the cubes." | L1 |
| **p024** "They are not curiosities." | "They were not made for fun." | L3 |
| "how much earth a canal would displace" | "how much earth a canal would move" | L1 |
| "worth unpicking, because each of them is a picture" | "worth taking apart, because each one is a picture" | L1 |
| "defines it in exactly that double sense" | "defines it in both senses at once" | L1 |
| "the product of two equal quantities" | "the product of two equal numbers" | L1 |
| "from there its basis, cause or origin" | "from there the base, cause or origin" | L1 |
| "The usage is attested from at least the first century BCE." | "The word is used this way from at least the first century BCE." | L1 |
| **p025** "That plant metaphor then travelled." | "That plant picture then travelled." | L1 |
| "a stylised letter r for it" | "a curled letter r standing for it" | L1 |
| "reached for the same image" | "chose the same picture" | L1 |
| Ex 1.6 Q6 "Answer from the exponent alone, without evaluating a root." | "Answer from the ten 2s alone, without working out a root." | M1, L1 |
| **p026** Q14 "Difference the list 2, 9, 28, …" | "Take differences of the list 2, 9, 28, …" | L1 |
| Q18 "difference the five answers you get" | "take differences of the five answers you get" | L1 |
| **p027** summary 2 "only a square is its own partner" | "only a square has a factor that is its own partner" | C3 — p002 states it correctly; the summary garbled it into something false |
| summary 13 "Differencing a list repeatedly" | "Taking differences again and again" | L1 |
| **p101** "a square is the one number that is its own partner" | "a square is the one number with a factor that is its own partner" | C3 — same garble as the summary |
| "Squaring doubles every exponent in a prime factorisation and cubing trebles them" | "Squaring doubles how many times each prime appears, and cubing triples it" | L1, M1 |
| **p102** "Searching by hand is quite feasible if you organise it." | "You can search by hand if you organise it." | L1, L5 |
| "each has a lever in it" | "each has one idea that does the work" | L3 |
| "the chapter's central move applied twice over" | "the chapter's main move used twice over" | L1 |
| "If a question resists" | "If you cannot get started on a question" | L3 |
| "…and there is no gap to look at if you have not tried." | "If you have not tried, there is no gap to look at." | L4, L6 |
| "One further remark" | "One more remark" | L1 |
| **p103** "That manoeuvre" | "That move" | L1 |
| **p104** "every exponent must be even … every exponent must be a multiple of three … a number whose every exponent is a multiple of six" | "every prime must appear an even number of times … a multiple of three times … a number where every prime appears a multiple of six times" | M1 |
| "a question about exponents" | "a question about how often each prime appears" | M1 |
| "the arithmetic that followed was trivial … the reframing was the right one" | "…was easy … the new way of looking at it was the right one" | L1 |
| **p105** "one more 2 is bolted on" | "one more 2 is added on" | L1 |
| "at the same moment" | "at the same time" | L1 |
| **p106** "cubing preserves order" | "cubing keeps the order" | L1 |
| "§ 1.5.1 leaned on it without saying so" | "§ 1.5.1 used it without saying so" | L1 |
| "one you merely got tired of" | "one you just got tired of" | L1 |
| "Two were settled by an inequality, two by counting exponents" | "Two were settled by comparing sizes, two by counting primes" | L1, M1 — *inequality* is not a Class 8 word either |
| **p110** "making every exponent even" | "making the count of each prime even" | M1 |
| "Reading the exponent settles both halves" | "Counting the 2s settles both halves" | M1 |
| "both are what you get by miscounting the terms by one" | "both come from miscounting by one" | L1 |
| "this is the fence-post error, and it is the whole point of the question" | "counting an end is the mistake the question is looking for" | C1 — a named idiom the reader has no way to know, standing in for the explanation |
| **p111** "every exponent would have to be a multiple of 6" | "every prime would have to appear a multiple of 6 times" | M1 |
| "Three habits … outlast the questions that carried them" | "…will last longer than the questions that carried them" | L1 |

Three of these edits ran a page one line long (22, 33, 37 at 102%). Fixed by
tightening the same sentences further, not by cutting content — the rebuild is
back to the fill map the chapter had before the edit.

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p014, Example 8 | M2 | "$45^2 = (40 + 5)(40 + 5) = 1600 + 400 + 25 = 2025$". The $400$ is $2 \times 40 \times 5$ and no step shows it. Nothing in the chapter expands a bracket anywhere else, and a Class 8 reader has no way to see where the middle term came from — so the one line of the method that is not "look it up" is the line that is skipped. | Show the three products, or get $45^2$ by a method the chapter has already given (e.g. $44^2 + 89$ from § 1.2.2). |
| p006 | M2, M3 | "An odd number is $2k+1$, and its square is $4k^2 + 4k + 1$, which is odd." The expansion is asserted. p105 uses the same expression and does show $4k(k+1) + 1$, but neither place shows how $(2k+1)^2$ became $4k^2 + 4k + 1$. | A shown expansion, or fall back to "odd × odd is odd", which is all this paragraph needs. |
| p006, Exercise 1.2 Q5 | M1 | "Is $441$ odd or even? Is its square root odd or even?" — *square root* is defined in § 1.3, a page and a half later. p008 likewise says "The count of steps is the root" while still in § 1.2.2. | Move the question to Exercise 1.4, or introduce the word before § 1.2.2 uses it. |
| p103 | C3 | Solution title: "Adding **fifty** odd numbers by subtracting two squares". The sum is $51 + 53 + \cdots + 99$, which is twenty-five numbers, and the solution's own closing line says "Twenty-five numbers added by subtracting two you already knew." | The title is wrong. It is a number, so I have not touched it — author to change *fifty* to *twenty-five*. |
| p019 | C5, M3 | "A block of $n$ numbers spread evenly around $n^2$ adds up to $n \times n^2$." No reason is given, and this is the load-bearing step for the whole result that cubes are blocks of odd numbers. The paragraph after it checks one case, which is not the same thing. | One line of reason — pair each number above the middle with the one below it — or a figure that does the pairing. |
| p019 | C2 | "It is not hard to see why once you look at the middle of each block", then "The fourth averages $16$", then "The middle number is the key … it is worth checking it yourself on the fourth block." A block of even length has no middle number, and the fourth block, $13, 15, 17, 19$, is exactly the one the student is sent to check. The definition excludes the case used immediately after it. | Use *average* (or *middle value*) throughout, or send the student to an odd-length block. |
| p014, Fig. 1.5 | C7 | The caption reads "$1936$ falls in the shaded stretch, so its root is between $40$ and $45$", and the figure prints $45^2 = 2025$. At that point in the example the text has narrowed the root to $40$–$50$; narrowing it to $45$ is the step *after* the figure, and the example works $45^2$ two paragraphs later. The figure hands over the step the reader is about to take. | Draw and caption only what the step at that point has established. |
| p001, p003 (Exercise 1.1) | M5 | The chapter opens on a corridor of 100 numbered lockers that students open and shut. Locker corridors are not a fixture of Indian schools; the puzzle is the classic one and the text does explain the mechanics, but the setting is the first thing a reader meets in the book and it is furniture they have never seen. | Author's call: keep (it is self-contained) or re-skin to something on the ground here — a row of switches, a line of gates, numbered shutters in a market. The maths does not change. |
| p016, p024, p027 | M1 | "$n^3$ … the number you got by multiplying something by itself three times" (p024), and the summary's "A cube is a number multiplied by itself three times" (p027). Three copies multiplied is two multiplications. Consistent within the chapter and standard schoolbook usage, so not wrong in a way that misleads here — but Chapter 2 defines powers properly and will either have to repeat the looseness or contradict it. | One decision, taken once, for Chapter 1 and Chapter 2 together. See CROSS-CHAPTER.md. |
