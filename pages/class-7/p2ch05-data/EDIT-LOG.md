# Class 7 · Mathematics II · Chapter 5 — Connecting the Dots…

## Beyond the Book, rebuilt 15 September 2026

The division was rebuilt to the shape in DESIGN-MATHS.md §6a, "The shape since
15 September 2026", on the model of Class 7 Chapters 1 and 8. The chapter body
(`p001`–`p025`) was not touched. The §5 body rebuild made earlier the same day
was reverted at the user's request; its pages are kept as a backup in the
session scratchpad (`scratchpad/rebuilt/pages/class-7/p2ch05-data/`), and only
its worked examples, end-of-chapter questions and `ANSWERS.md` were used here,
as source material.

**Pages:** eight (`p101`–`p108`, the ten-stage-era *Behind Each Answer* and
*Problem Sets* shape) → twelve (`p101`–`p112`), fitted with
`refit.mjs … bridge`.

### The four stages

| stage | what | from |
|---|---|---|
| 1 Using What You Know | the four tried-and-explained questions, **word for word** | the existing stage; only its `.c-stage__for` line deleted (copied by script, not retyped) |
| 2 Solved Examples | 15 examples in 6 types, stepped (Solution → Step → Answer, a reason as a `.chip`) | 11 from the reverted rebuild, 4 from the old *Behind Each Answer* |
| 3 Practice | one band, 36 questions in six forms | 25 from the reverted rebuild's end-of-chapter questions, 11 from the old Sets A–C |
| 4 Answers | letter key for 1–21, one `.work--trace` row for each of 22–36, and six rows of *Why the other options are wrong* | worked here |

**Examples per type:** 1 Statistical questions and statements 2 (Ex 1–2) ·
2 Finding and comparing means 3 (Ex 3–5) · 3 Finding the median and the range
3 (Ex 6–8) · 4 Outliers: the mean or the median? 2 (Ex 9–10) · 5 Double bar
graphs 3 (Ex 11–13) · 6 Reading a table of averages 2 (Ex 14–15).

- From the rebuild: statistical question (Ex 1), statement (Ex 2), cycle shop
  (Ex 3), library visitors (Ex 6), test marks median and range (Ex 8),
  workshop earnings (Ex 10), library books graph, reading it, Tanvi (Ex 11–13),
  Table 5.8 16-year-olds (Ex 14), Table 5.7 Rohit and Aman (Ex 15).
- From *Behind Each Answer*: Problems 4, 5, 2, 3 as Ex 4, 5, 7, 9, keeping
  their options; each Answer row gives the letter.
- Ex 11 carries its graph inside the example as **Fig. 5.14** (the body ends at
  Fig. 5.13), drawn to the example's data: 1 unit for 10 books, bars 45/30,
  60/55, 35/40, 50/70.

**Practice per form:** Choose the correct option 18 (Q1–18) · Assertion and
reason 3 (Q19–21) · Very short answer 4 (Q22–25) · Short answer 6 (Q26–31) ·
Long answer 3 (Q32–34) · Case-based 2 (Q35–36). Multiple-choice key 1–18:
a 5, b 4, c 5, d 4. Assertion–reason: a, c, d.

- From the rebuild (end-of-chapter numbering): 1–13, 15–22, 24–28 (as
  Q1, 2, 4, 5, 8, 9, 11, 19–27, 29–36).
- From the old sets: A5, A6, A7, A10, B4, B6, B7, C1, C2, C5, C7 (as Q6, 3, 10,
  7, 15, 13, 12, 17, 16, 14, 18).
- The fruit table of rebuild Q20 is set in the question's own words, not as a
  numbered table. The two case tables carry no caption and no *Case study*
  label.

### Left out

| item | why |
|---|---|
| rebuild Example 3, the hibiscus flowers (2, 7, 9, 4, 3) | **the body's Example 1** (p004) |
| rebuild end Q23, the number-lock code | **the body's closing puzzle** (p025) |
| old Set B5, months onions cost more in Wahapur | **the body** (Sampat, p005: "Wahapur in 5") |
| old Set C3, median of Aditi's Week 2 Sudoku times | **the body's** Exercise Set 5.4 (p023) |
| old Set C6, City 1's daylight in June, $564 \div 30$ | **the body** (p014) |
| old Set B8, CASC rockets in three years | **the body's** statement (d) on Fig. 5.7 (p014); values also read by eye |
| old Set B2, a family's heights with one short member | near-duplicate of **the body's** Poovizhi family (p006–p007) |
| old Problem 1, the missing fifth value from a mean | near-duplicate of **Stage 1's** first question |
| rebuild end Q14, frequency of 4; the "highest frequency" part of Q24 | frequency and mode are not taught in this chapter |
| rebuild Example 4, Sunita's savings with a ₹0 week | near-duplicate of Ex 4 (a 0 score and a match not played) |
| old A1, A2, A3, A4, A8, A9, B1, B3 | near-duplicates of questions kept (simple mean, odd and even median, statistical question, range, double bar graph, missing value, did-not-play) |
| old C4, Team A's runs from Fig. 5.9 | the figure's data is flagged (see Flagged) |

A search of `p001`–`p025` for each kept item's distinctive numbers and names
found none of them in the body. Ex 14 uses the same table as the body's
Table 5.8 statements, but asks a question they do not (the change for
16-year-olds from 1989 to 2019).

### Changed on the way in

- Old Set C7 said only that $x$ "is between 5 and 9", which leaves 5 and 7
  open to argument as medians; it now says "a number from 5 to 9", and the
  options are 8, 5.5, 6, 7, so exactly one cannot be the median.
- Old Set B6's option 16 had no mistake behind it; it is now 25, which is
  $100 \div 4$, with 40 not taken away.
- Letters were re-ordered in the reused multiple-choice questions to spread the
  key; stems and option texts were tightened in Ex 13–15 and Q15 to
  fit the pages.

No reused answer was wrong. Data: every set of values in Stages 2 and 3 is
made up, except Tables 5.7 and 5.8, whose values were read from the body's
tables (p019, p020). No real-world source is needed.

### Verification

`scratchpad/beyond-p2ch05-data/verify.mjs` recomputes every number in the
division from its data: all Stage 1 working, every example step, every
distractor it names, every multiple-choice key (each checked to have exactly
one correct option), all assertion–reason statements, every short, long and
case answer, and the six *why wrong* rows. It reads Fig. 5.14 back from the
SVG in the built pages — axis ticks, gridlines, the eight bar heights and bases,
colours and key — against the data, and checks each printed letter against the
computed key. **239 checks, 0 failures.**

Stage 1 was copied from the old `p101`/`p102` by `assemble.mjs` with only the
`.c-stage__for` line removed; the old pages are kept in `…/beyond-p2ch05-data/old/`.

### Checks

Builder (`build.mjs class-7/p2ch05-data`): 37 pages, all pages fit, no violations, nothing past the text block or into the bottom margin. Beyond the Book fill, pages 26–37: 26:95% 27:92% 28:86% 29:95% 30:89% 31:78% 32:94% 33:94% 34:99% 35:100% 36:96% 37:54% (the last page, exempt).

`orphans`: no stranded opener in Beyond the Book (the two it reports are body
pages 11 and 18). `fit-options`: every option row fits. `check-labels`: no
labels collide. No `--head`/`--tail`, no `.c-stage__for`, no case label, no
inline style; every `p1xx` carries `data-bridge`.

`gaps`: two Beyond pages are under 88%, and a whole example holds each one open. **Page 28** (86%) has 33 mm free, and Example 7 needs 57 mm. **Page 31** (78%) has 52 mm free; Example 15 measures 50 mm but does not pack into that space with the gap between blocks. The stems of Examples 13–15 were each shortened to try to close page 31. Closing either page further would mean cutting steps.

The answer line on Beyond the Book under *Every printed number re-derived* below describes the division before this rebuild. The key above replaces it.

Written new from NCERT *Ganita Prakash*, Grade 7 Part II, Chapter 5, *Connecting
the Dots…* (textbook pages 97–135). Original LearnLab text in NCERT's order of
topics and questions; no sentence is carried over. Crown Quarto, house design,
palette `mulberry`. The source PDF has no answer key; every answer below was
worked here.

Sections: 5.1 Of Questions and Statements · 5.2 Representative Values · 5.3
Visualising Data · 5.4 Data Detective. The source's subheads are `h3`; its four
*Figure it Out* blocks are Exercise Sets 5.1–5.4. *Math Talk* and *Try This*
prompts are plain questions, as in Chapters 1–4.

## Figures and tables

Thirteen figures from `fig5.mjs` in the session scratchpad, **every one redrawn
from the source's picture, with values read off it**: the onion dot plot (5.1),
the two families (5.2), the first Class 5 (5.3), the minute estimates (5.4), the
second Class 5 (5.5), the onion columns (5.6), rocket launches (5.7), daylight
(5.8, drawn from Table 5.5 divided by days in the month), runs per over (5.9),
animal speeds (5.10), electric vehicles (5.11, set as horizontal bars so the
state names fit), pockets (5.12) and skyscrapers (5.13). Dot plots mark the mean
with a solid line and the median with a dashed one.

The source's blank dot-plot grids (stories, newspaper, palm trees, babies,
Sudoku) are set as instructions to draw a dot plot on a stated number line.
Left out: the twelve small dot plots of *Telling Tall Tales* (their means are
kept as Table 5.7), the scatter of 19-year-olds' heights in 30 countries (no
value could be read reliably), the cartoons, photographs and the statement
bubbles (the statements are kept as lists), and the colour-blind note on hatched
bars.

## Every printed number re-derived

| where | answers |
|---|---|
| 5.1 | statistical: (a) (b) (c) (g); not: (d) (e); (f) depends on what "best" is measured by |
| 5.2 | Shubman 22, Yashasvi 24 · guavas 6 and 5 · hibiscus 5 · onion totals 458, 450; means 38 and a sixth, 37.5; medians 37, 38.5 · families 164.33 and 160.2; medians 164.5, 170; without 118 mean 170.75, median 171.5 · stories mean $122 \div 15$, median 6; without 40 mean $82 \div 14$, median 5.5 · newspaper mean $128 \div 7$, median 18 · Class 5: whole class 144.5 and 145, boys 142.94 and 144, girls 146.91 and 148; 15 students and 8 boys above 144.5 · minute: A 33 children, $1921 \div 33 = 58.21$, median 60; B 28 children, $1660 \div 28 = 59.29$, median 59.5 · $388 \div 11$ · $232 \div 6$ |
| Set 5.1 | 1 5 · 4 both total 122 s in 7 runs: the same average · 5 1859 |
| Set 5.2 | 1 37, 38.5 · 2 20 answers, mean 3.6, median 2 · 3 mean $1621 \div 29$ (about 55.9), median 56, 13 trees shorter · 4 (a) no, the largest value is 20.5 (b) no · 5 boys mean 3.43, median 3.45; girls mean 3.35, median 3.4 · 6 whole 141.22 and 142.5, boys 142.06 and 143.5, girls 140.14 and 140 · 7 means 240.38 and 42.42: about 6 times |
| 5.3 | rockets: justified (b) (c) (d) (e), not (a) (f); rising every year: SpaceX, ISRO, Galactic Energy; 2023 total about 220, (b) · daylight June 564 ÷ 30 = 18.8 h, about 3/4 of a day; December 6.0 h · cricket: Team B batted second and won in the 18th over, no wicket lost; Team A over 12: 15; Team B fewest in over 4; target 152 needs twenty bars added |
| Set 5.3 | 1 (a) guidelines every 16 km/h (c) e.g. swift 170 and pronghorn 88, sailfish 109 and flying fish 56 (d) $109 \div 26$ is about 4; the graph shows too few animals to say "fastest" · 2 Class 5 a 13, w 6, n 4, s 2; Class 9 s 9, a 8, w 6, n 2 · 3 e.g. Day 1 February or November, Day 2 May or June · 4 (d) about 20,000 (e) about 4 times (f) no, each bar is one year's registrations |
| 5.4 | statements: (a) yes (b) no, 143.2 < 148 (c) yes, 159 > 158.9 (d) cannot tell from averages (e) no, girls are taller at 11 and 12 in every year, at 10 in 2009 and 2019, and at 5 in 2019 (f) not shown · most growth in 2019: boys 12→13 (6.2 cm), girls 10→11 (5.8 cm) |
| Set 5.4 | 1 boys mean 4.7, median 5; girls mean 38 ÷ 11, median 4: only (b) is true · 2 (a) 12.5 (b) C by 3 (did not play), 32 ÷ 3; B by 4 (0 is a score), 4.5 (c) A · 3 mean 73 and median 78.5; mean $681 \div 9$ and median 79 · 5 median 115 cm, age about 6 (see Flagged) · 7 (d) · 8 (a) about 320, 170, 40 (b) (i) yes, of the cities shown (ii) only of the 20 cities shown (iii) cannot tell, the graph counts buildings · 10 Week 1 mean 360, median 360; Week 2 mean 278.75, median 275 |
| Puzzle | 415 |

Beyond the Book: Stage 1 — 13; 80; both rise by 5; yes, the fifth number is 40.
Stage 2 — (b), (c), (d), (a), (c). Set A c a c d d c a a b d; Set B c d a b a c b
c; Set C b a c b a a d.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| Shubman's average "110 ÷ 5 = 21" | 22 | arithmetic slip |
| whole-class mean 144.4 | 144.5 | $4046 \div 28 = 144.5$ exactly |
| second section, boys' median 143 | 143.5 | 18 values, 9th 143 and 10th 144 |
| second section, whole-class dot plot | redrawn from the boys' and girls' plots | the source's plot has four values of 150 and heights up to 158 that neither of the other plots contains |
| runs per over, blue team over 19: 17 | Team A over 19: 5 | as drawn, the team batting second (18 overs, no wicket) ends on 152 against a first innings of 163, so it cannot have stopped; with 5, Team A makes 151 and Team B reaches 152 in its 18th over. **Flagged** |
| City 1 June "about 17–18 hours" | about 19 hours | $564 \div 30 = 18.8$ |
| Vishal: "3 numbers in the 50s" | "3 of its prices are ₹50 or more" | Wahapur has 53, 52 and 60 |
| Averages as 142.05, 146.9, 59.28 | 142.06, 146.91, 59.29 | cut short in the source |
| Sudoku dot plot line 200–400 | 200–420 | one time is 410 |
| newspaper dot plot line 0–25 | 0–30 | one value is 26 |
| Mahāvīrācārya etc. with diacritics | Mahaviracharya, Sripati, Bhaskaracharya, Ganesha | the body face would fall back to a third face for the marked letters; *samikarana* is read from a garbled extraction |
| "Grade" | Class | house usage |
| Set 5.4 Q9, a blank table of estimates | an instruction to make the table | the empty rows held two pages half open |
| onion prices and daylight hours, one row of twelve months | two halves, January–June over July–December | twelve month columns ran up to 17 mm past the measure |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| Fig. 5.9 | C4 | the source graph cannot be a real match (see above); one bar changed | confirm or replace the data |
| Set 5.4 Q5 | C4 | 17 students cannot make two groups of equal size, and five of them are 115 cm, the median | a teacher may accept "use the median, and put the 115 cm students where needed" |
| Figs. 5.7, 5.10, 5.11, 5.13 | C6 | values read by eye from the source's pictures | check against the original data before print |
| 5.4 | M5 | the scatter of heights in 30 countries is left out | redraw if the data can be had |
| 5.1 (f) | C4 | "best bowler" has no single measure, so it is not clearly statistical or not | none; a discussion question |

## Checks

Builder: every page at 88% or more except the two closing pages (the puzzle,
and the last page of Beyond the Book). `gaps`, `orphans`, `check-labels`,
`fit-options` and the width probe report nothing. Fitting took line-sized
edits found with the block search: sentences added to the opening guess, the second
cricket series, the fair share, averages around us, the stories, the daylight
table and graph, the school means, two Set 5.1 questions, and in Beyond the
Book the last stage 1 answer, two solutions and two Set B stems; one sentence
on describing data trimmed. `fit-options` narrowed six option lists in the
problem sets.
