# Class 9 · Mathematics I · Chapter 7 — The Measure of Chance

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
