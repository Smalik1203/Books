# Class 9 · Mathematics I · Chapter 8 — What Comes Next

Language edit, 32 pages (p001–p022 chapter proper, p101–p110 Beyond the Book).
Build after editing: 32 pages, all pages fit, 0 stranded openers, no label
collisions, every option row fits. Every number re-derived — Examples 1–9, all
six exercise sets including the fourteen questions of Set 8.6, the eight Stage 1
questions and their Stage 2 solutions, and all 27 multiple-choice answers.
**All 27 answers are correct**, including Set B6's fence-post 34, Set C7's
$y^2 = xz$, and Set C8's GP at position 9 against the AP at 256. Example 4's
fifth term ($870 \times 869 = 756\,030$), Example 9's bounce table to three
decimals, $3^{10} = 59\,049$ and $3^{20}$ as "more than three thousand million"
all check out.

**6 fixes in 32 pages**, five of them one word each: *computing*, *computed* and
*Determine* twice. Like Chapters 6 and 7 there is no "Grade" anywhere, and the
register is plain throughout.

Four things worth recording:

- **The first section pays for itself twice over.** The triangular and square
  numbers are each shown to be a running total of a list the reader already has,
  and then: "sequences are not a collection of tricks to be memorised one at a
  time, but a small number of ideas that keep reappearing." That claim is then
  honoured — § 8.5 finds the triangular numbers again in $\tfrac{n(n+1)}{2}$
  ("the two pictures are the same picture"), and p105 finds the square numbers
  again in a recursion, "the picture from the first section of the chapter
  written as algebra".
- **It teaches that a rule can be absent.** p006 sets the primes as a sequence
  with no known explicit rule and is careful about what is missing: "Nobody
  doubts what the primes are… The rule that is missing is a shortcut from
  position to term — a way of naming the thousandth prime without finding the
  nine hundred and ninety-nine before it." Then: "the ones in this chapter are
  the well-behaved minority."
- **Virahāṅka is given the sequence and the reason for it.** p009 places it in
  the *Vṛttajātisamuchaya*, seventh century, and gives the metrical argument in
  one sentence — a rhythm of length $n$ ends in a short syllable, leaving $n-1$,
  or a long one, leaving $n-2$ — so the recursion is derived, not asserted. Then
  Gopāla, Hemachandra, and Fibonacci "some five hundred years behind".
- **It says out loud that reading a pattern is a judgement.** p105: a question
  showing a few terms and asking what comes next "is strictly speaking
  unanswerable, and why it is asked anyway. What is really wanted is the
  *simplest* rule that fits — and simplest is a judgement, not a calculation."
  Followed by why three terms beat two: "now the two tests can disagree."

The off-by-one is handled better here than anywhere else in the book. It is
named where the formula is introduced ("That single offset is where most
mistakes with APs are made"), it gets its own summary point, and p104 meets it
from the other side and says so: "there are $127$ *steps* but $128$ *multiples*
… It is the same off-by-one as the $n-1$ in $t_n = a + (n-1)d$."

## FIXED

| before | after | check |
|---|---|---|
| **p004** "without **computing** any other term first" | "without **finding** any other term first" | L1 |
| **p007** Ex 8.2 Q3 "**Determine** whether $97$ and $172$ are terms" | "**Find out** whether…" | L1 — an exercise instruction, where a heavy word does most harm |
| **p017** "Three ratios were **computed**, not one." | "Three ratios were **taken**, not one." | L1 — and *take* is the chapter's own verb: "take differences, and take ratios" two paragraphs earlier |
| **p021** Ex 8.6 Q8 "**Determine** the AP whose third term is $16$" | "**Find** the AP whose third term is $16$" | L1 |
| **p101** "Answer without **computing** any term." | "Answer without **finding** any term." | L1 |
| **p108** Set B Q3 "**Consider** the sequence $1, 4, 9, 16, \ldots$" | "**Take** the sequence $1, 4, 9, 16, \ldots$" | L1 |

Every fix is the same length or shorter, and no fill figure moved.

**Considered and left: *determined*.** p006 — "a sequence can be completely
determined and still have no explicit rule" — is the uniqueness sense, as in
Chapter 5. *Found* would say something else. Kept.

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| **p018** | C4 | **Two counts are wrong, one of them by a whole stage.** The paragraph comparing the two patterns says: "The doubling pattern reaches eighty-one **before its sixth stage** and a thousand **before its ninth**." The doubling pattern of Fig. 8.6 is $3, 6, 12, 24, 48, 96, 192, 384, 768, 1536$ — so it stands at $48$ at stage five and first reaches $81$ **at** stage six, and it stands at $768$ at stage nine and first passes a thousand **at stage ten**. The AP half of the same sentence is right ($4n-3$ gives $81$ at stage 21 and $1001$ at stage 251, matching "about twenty" and "about two hundred and fifty"). I checked the one reading that would rescue it — running totals rather than terms — and it does not: the totals reach $81$ by stage five but a thousand only at stage nine, and in any case the Think and Reflect above asks "Where does the doubling pattern of Fig. 8.6 **reach** 81?", which is about the stage count, not a sum. I have not changed it — they are numbers. | "at its sixth stage and a thousand at its tenth". The paragraph's conclusion — that a GP overtakes any AP eventually — is right and is not affected; only the two stage numbers are wrong. |
| p021 | — | **The end-of-chapter exercises are filed as the tail of the geometric-progression set.** Exercise Set 8.6 is § 8.6's exercise set, and its questions 1–6 are about GPs. Questions **7–14 are the chapter's end-of-chapter exercises** — first term of an AP, an AP from two facts, three-digit multiples of 7, multiples of 4, bacteria doubling, an AP from two sums, the smallest $n$ with $S_n > 1000$, and writing $100$ as a run of consecutives — and they are numbered 7 to 14 *inside the GP set*, with no band of their own. **Every other Class 9 chapter has an "End-of-Chapter Exercises" band** (Ch 1 p014, Ch 2 p026, Ch 3 p029, Ch 4 p029, Ch 5 p032, Ch 6 p018); Ch 7 has none and needs none, since its four sets are genuinely per-section. Here the questions exist and the band does not. They are also eight `<li>` in one `<ol>`, where questions 1–6 of the same set each have their own `c-practice--cont` block. | An `End-of-Chapter Exercises` band before question 7, and the numbering restarted at 1. That also stops a reader hunting § 8.6 for the GP question about bacteria and finding an AP question about salary. |
| p110 Set A | — | **Seven answers in a row are (c), and neither (a) nor (d) is ever the answer.** The Set A key runs (b) (b) (b) (c) (c) (c) (c) (c) (c) (c). Every one is correct — I re-derived all ten — but a student who marks (c) for the whole set scores 7 out of 10 without reading a question, and options (a) and (d) are never right once in ten questions. The other chapters do not do this: Ch 6's Set A key is c, b, a, d, b, c, a, d, c, a. | Reorder the options in six or seven of the ten. Nothing else changes: the mathematics, the distractors and the notes all stay as they are. |
| p101, p102 vs p021 | C7, M4 | **Three of the eight Stage 1 questions are already in the chapter, and Stage 1 says none of them is.** The stage opens "Every question below can be answered from that list. What is new is that none of them says which item to reach for." But Try 2 ("The third term of an AP is $16$ and the seventh exceeds the fifth by $12$") is Exercise Set 8.6 question 8 word for word; Try 4 ("How many three-digit numbers are divisible by $7$?") is question 9; Try 7 ("Find all the ways of writing $100$ as a sum of two or more consecutive natural numbers") is question 14. Set C Q9 then puts Stage 1's own first question ($2, 6, 12, 20$) back a third time, after p103 has answered it. This is the third chapter with the fault — Ch 5 and Ch 6 both do it — and Ch 7, which does not, shows it is avoidable. | The clause Ch 5 uses correctly on its p106: name the exercise being answered. Stage 2 re-working questions the reader has tried is the stage's purpose; claiming they are new is the fault. |
| p102 | C4 | **Ordinal back-references to questions that carry no numbers.** p102 discusses "the third and the sixth", then "The seventh", then "The eighth". All four references are correct — third is the GP with $r = \tfrac12$, sixth the two sequences beginning $3, 6$, seventh the sum-to-100, eighth the GP with product $-1$. But the eight questions sit in `.c-try` bands, which `css/bridge.css` defines as a rule above and below with **no counter**, and they straddle a page turn (five on p101, three on p102). A reader must count eight unnumbered bands across two pages, having had no reason to start counting. Stage 2 then answers them under titles rather than numbers, so there is nothing to match against. **Chapter 7 p102 has exactly the same fault**, with nine bands. | Number the `.c-try` bands in this stage, or refer to them by subject as Stage 2's own titles do. Two chapters now; it is a component gap rather than an authoring slip. |
| p021 Q14 vs p102 | C4 | **The chapter's version of a question is missing the words that make it answerable.** Exercise Set 8.6 question 14: "Find all the ways of writing $100$ as a sum of consecutive natural numbers." The Beyond the Book version on p102 says "a sum of **two or more** consecutive natural numbers" — and p106's solution needs that restriction, since it ends "The other cases give no whole $a$, **or the single term $100$ itself**." Without *two or more*, $100 = 100$ is a legitimate answer and "all the ways" is three, not two. | *two or more*, copied from the bridge's own wording four pages later. |
| p022 vs p014 | — | **The summary drops a result the chapter states and uses.** p014 states the general AP sum in Āryabhaṭa's form — "take the first term and the last, halve their sum, and multiply by how many terms there are" — and is explicit that it is not a fact about the naturals: "It is a fact about any AP… and you will meet it again in that form." It is met again, on p106, where it does the whole of the consecutive-sum problem. The summary lists only $1 + 2 + \cdots + n = \tfrac{n(n+1)}{2}$. (Every exercise needing a sum can also be reached from the naturals formula — Ex 8.5 Q2 is $3(S_{33} - S_3)$ and Set C Q2 is $5(S_{19} - S_1)$ — so nothing is unanswerable; it is the summary that is short.) | One summary point, in the chapter's own words. It is the most useful formula in the chapter after the $n$th term, and it is the one a reader will look for. |
| p012, p018, p022 vs Class 9 Ch 2 | C3 | **Chapter 2 points twice at this chapter, and this chapter never looks back.** Ch 2 p012 and p028 both say sequences of this kind "are taken further in the chapter on Sequences and Progressions", and p028 that it "takes that constant difference as the defining property" — which is exactly what § 8.4 does. Ch 8 § 8.4.1 then plots an AP, finds a straight line, and explains it — "a constant step sideways always buys the same step upwards, and that is exactly what a straight line is" — which is Ch 2's whole subject, from its own p005: "A linear polynomial steps by a constant, its graph is straight". Neither page mentions the other, and Ch 8 makes no reference to any other chapter of the book. (Ch 2 also calls this chapter by a title it does not have; that is flagged in Ch 2's log.) | A clause in § 8.4.1 naming Chapter 2. The two chapters prove the same thing from opposite ends and a reader who has done both is entitled to be told. |
| p109 Set C | — | Questions 9 and 10 are two `<li>` in one `<ol data-start="9">`, where questions 1–8 of the same set each have their own `c-practice--cont` block — the same markup inconsistency as p021's questions 7–14, and the same one flagged in Ch 3 at p029–p032. The build passes and the pages fit. | Worth a look at a proof of pages 21 and 109 before print. Not language. |
| p022, p110 | — | p022 is **66%** full (the eleven-point summary) and carries `data-close`; p110 is the last page at 85%. Both exempt, both reasonable closing leaves. Not a fault. | Nothing. |
