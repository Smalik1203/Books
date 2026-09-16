# Class 7 · Mathematics I · Chapter 1 — Living with Large Numbers

## Beyond the Book, rebuilt 15 September 2026

**The chapter body is NCERT's structure, unchanged.** A rebuild of the body to
DESIGN-MATHS §5 (committed as c877580, with 14 worked examples, checks, key
ideas and end-of-chapter exercises added inside the chapter) was reverted the
same day at the user's request: the body keeps NCERT's structure, and the
Cengage-style additions belong in Beyond the Book. The body pages are the
pre-rebuild ones, refitted to the 196 × 276 page without a word changed. A
backup of the §5 version was kept in the session scratchpad.

**Beyond the Book is four stages, 12 pages.**

1. **Using What You Know** — the existing stage, word for word: five questions
   tried first and explained in running text, to show how the chapter's
   simple ideas become tricky questions. Kept as it is on purpose.
2. **Solved Examples** — 15 examples under six types (reading and writing
   large numbers 3; place value and button presses 2; comparing and ordering
   1; rounding off and estimating 4; quick products and digits in a product
   2; estimating with an assumption 3). Each is set as *Solution*, *Step 1*,
   *Step 2* … *Answer*, with a short reason as a chip. Sources: the reverted
   rebuild's worked examples (none of them in the body) and the old stage 2's
   worked problems, recast as steps.
3. **Practice** — one band carrying the stage numeral. 40 questions: 25
   multiple choice, 6 assertion–reason, 3 very short, 2 short, 2 long, 2
   case-based. Sources: the reverted rebuild's end-of-chapter questions that
   the body does not already set, and the old problem sets A–C with
   near-duplicates dropped. Questions 37–38 (long answer) are new.
4. **Answers** — the letter key, every other answer, and why the wrong options
   are wrong for questions 27, 30 and 31.

**Excluded as duplicates of the body:** the reverted rebuild's end questions
on lakhs in a billion, the +10,000/+100 buttons, coins, the albatross, the
godwit, eagles and Everest, the 10-digit numbers, 41 letters, the 9-digit swap,
crossing out digits, number names sharing no letter, the 1000th digit, the two
sets of cards, the seven number cards and the four toothpick questions — all in
the body's own End-of-Chapter Exercises. Its Example 1 (Estu's rice) is the
body's Example 1. Five examples first made from stage 1's questions were
removed when that stage was restored.

**Verified by script:** every number in the new long-answer questions and the
reused examples and questions (25 checks, all passing); the rest carry the
answers already verified in the reverted rebuild and the old key.

**Design changes made with this chapter, at the user's direction:** no line
under a stage head (`.c-stage__for` removed from these pages); the practice
stage named once, by its band with the numeral in `.c-practice__num`; no
*Case study* label under each case question; a case that opens a question sits
on the question's first line, its table flush left and its parts at body
leading (`css/structure.css`); a stage head with no subtext centres on its
mark (`css/bridge.css`).

**Fitting.** Question 38 was moved from the foot of page 25 to the head of page
26 by hand: repack had left page 25 running 8.2 mm into the margin. All pages
fit, no opener is stranded, every option row fits. Short pages remain in the
solved examples (pages 17–21, 76–82%, each held by the next whole example,
4–9 mm too tall for the space) and at page 26 (82%, held by the Answers stage
head).

Written new from NCERT *Ganita Prakash*, Grade 7 Part I, Chapter 1, *Large
Numbers Around Us* (textbook pages 1–23, answer key 24–38). Original LearnLab
text in NCERT's order of topics and questions; no sentence is carried over.
Crown Quarto, house design, palette `garnet` — the first Class 7 chapter, so
these three settings are the ones the rest of the volume follows.

Sections keep NCERT's numbering and order: 1.1 How Big Is a Lakh? · 1.2 The
Land of Tens · 1.3 Crores, Millions and Billions · 1.4 Exact and Approximate
Values · 1.5 Patterns in Products · 1.6 Did You Ever Wonder…? The toothpick
puzzle page closes the End-of-Chapter Exercises as Questions 15–18.

**Every printed number re-derived**, answer key included: Example 1; all
questions the chapter sets whose answers are fixed; the five Stage 1
explanations; the five Stage 2 solutions; all 24 multiple-choice answers and
the six trace rows. Among them — Chitti's 30 presses give 993 and 102; the
presses for any number differ from its digit sum by a multiple of 9; the
nearest neighbours of 3,87,69,957 and 29,05,32,481; 4,63,128 + 4,19,682 =
8,82,810 and 14,63,128 − 4,90,020 = 9,73,108, with every "more or less than"
part; 4832 × 67,915 = 32,81,65,280 (9 digits); 1 crore seconds ≈ 116 days;
140 crore × 40 cm = 5,60,000 km, 14 times round the equator; 125 × 32 × 25 =
1,00,000; 3,84,400 ÷ 250 ≈ 1538 days ≈ 4.2 years; 2344 is the only option
reachable in exactly 40 presses.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| six *Figure it Out* sets, and question lists printed as running text | Exercise Sets 1.1–1.13 and End-of-Chapter Exercises | Classes 8 and 9 give every question list a band; a list in running text cannot be split one question per block, so it cannot be fitted |
| *Math Talk*, *Try This* labels | Think and Reflect panels, or plain questions | the book's component library has no such labels (DESIGN-MATHS §4) |
| fill-in boxes for 999 → 1,00,000 | Table 1.1 with blanks, first row given | same exercise; a table is a component, a column of boxes is not |
| one table of twenty city populations | Tables 1.5 (ranks 1–10) and 1.6 (11–20) | at twenty rows it could follow nothing and held a page at 42%; Question 2 now asks for one title for both |
| "ten lakhs thirty thousand two hundred eighty five … 42 letters" | "ten lakh thirty thousand two hundred eighty five … 41 letters" | the chapter says *lakh* throughout; the count follows the wording |
| 125 × 72 hint "125 = 1000/8" | "125 = 1000 ÷ 8" | no fraction notation elsewhere in the chapter |
| Somu's building, height left to a picture | "a building with 10 floors" and Fig. 1.1 | the source's picture carried the floor count; the text has to |
| digits written without commas in Chitti's lists (40629, 367813) | 40,629 and 3,67,813 | the chapter has just taught the commas |

## Errors found in the source's answer key

Not printed anywhere in this chapter — the chapter proper carries no
answers — but recorded because a teacher using the key will meet them.

| question (source numbering) | key says | correct | note |
|---|---|---|---|
| End set Q3, 9-digit number where swapping any two digits gives a bigger one | 987654312, "try more" | **123456789, and it is the only one** | swapping digits in places *i* < *j* gives a bigger number only if the left digit is smaller, so every pair must increase left to right; nine distinct digits from 1–9 in increasing order is one number. The key's answer gets *smaller* when its first two digits are swapped |
| End set Q9(a), largest sum from two sets of 1–9 cards | 99,88,776 + 65,544 = 1,00,54,320 | **99,87,654 + 87,654 = 1,00,75,308** | the five places the two numbers share should each take a matching pair, largest first |
| End set Q10(c) | (1,50,000 × 4) − (4000 × 5) | — | there is no 4 card |
| End set Q10(d), (e) | uses × 20 and × 14 | — | 20 is a card but 14 is not; (e) is invalid |
| p. 13 Q6, Patna to Mumbai | "multiply by 7.39" | about 7 | fine as arithmetic; the question asks for a rough multiple |

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| 1.5 facts, plastic waste | M5 | 52,00,00,00,000 ÷ 130 = 4 crore tonnes (40 million). Published estimates of global plastic waste are several hundred million tonnes a year. The number is the source's and has not been changed. | check against the source NCERT cites, or drop the fact |
| 1.5 facts, Amazon | M5 | 6400 × 62,500 = 40 crore litres a second. The usual figure for the Amazon's mean discharge is a little over 20 crore. The source's number, unchanged. | check, or say "up to" |
| 1.5 facts, Purandaradāsa | C6 | 4,75,000 songs "according to legend" is the source's wording and is kept as legend; the question about songs a year now supplies the 60 years it needs | nothing, unless the legend is to go |
| End-of-Chapter Q5, two number names with no letter in common | C4 | the source sets it with no answer, and none is printed here; counting far enough by hand is long | a hint, or accept it as the open question it is |
| End-of-Chapter Q6(c), the 5000th digit 5 | M2 | the key gives 13995 with no working; nothing in the chapter prepares this count | leave starred, as it is |
| Exercise Set 1.6 Q4, why fewest presses show place value | C5 | answered nowhere in the chapter; Beyond the Book Stage 1 gives the reason (trades of 9) for the related question | nothing — it is starred and the explanation follows in the division |

## Beyond the Book

Four stages, 8 pages. Stage 1 five tries: the 20-press question, the digit
count of 4832 × 67,915, rounding before adding, India in a line round the
equator, 25 × 64 × 125. Stage 2 five problems: 3 billion in crore, the
nearest ten lakh, 125 × 88, digits of a 6-digit × 4-digit product, counting to
a crore. Sets A (10), B (8, three assertion–reason), C (6, tiered). No named
method, no coaching vocabulary, no examination named.

## Fitting

`keepExerciseSets` was tried from Class 6 and removed: it is a Class 6 setting,
Classes 8 and 9 let a set continue overleaf, and here it left pages at 27–32%.
Gaps were closed by editing the prose at the join, by moving Fig. 1.1 to
`--md`, by splitting the city table, and by adding a closing observation after
Stage 2 Problems 2 and 3 — the design's own "plain observation" after a
solution. Nothing was padded: every line added while fitting says something
the chapter needed —

- the census paragraph before Tables 1.5–1.6 (what a census is, how often it
  is held, reading two of the numbers in lakhs and crores), and the line under
  the tables telling the reader to answer by rounding, which is the source's
  own instruction, "answer … by approximation";
- "Ten years have 365 × 10 = 3650 days" in *A lakh days*;
- "And how many lakhs make one million?" after the zeros questions in 1.3;
- a second half to End-of-Chapter Q4 — the smallest number left after striking
  out 10 digits (1112312345; the largest is 5534512345).

Lines cut while fitting: the seed-bank and "at home" paragraphs of 1.1, the
1.2 introduction (two paragraphs made one), the rounding paragraphs of 1.4,
the lead-in to *How long is a product?*, Stage 1's rounding explanation, one
sentence of the equator explanation, three trace rows' length, and B7's trace
row (B7's answer stays in the key). The summary went from seven points to six
by merging the million/billion point into the first.

`orphans`, `check-labels` and `fit-options` all clean; `fit-options --fix`
narrowed six option lists once, early.
