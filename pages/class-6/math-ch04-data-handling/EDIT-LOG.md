# Class 6 · Mathematics I · Chapter 4 — Data Handling and Presentation

## Solved examples in examination formats, 20 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 12 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-6/math-ch04-data-handling/`.

Source `build/jee-class6.mjs`; check `build/check-jee-class6.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p114; the answers stage still opens a fresh page.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (c) 5 |
| 2 | Single correct | (a) 36 |
| 3 | Single correct | (c) 1 symbol = 6 items |
| 4 | Single correct | (d) 24 |
| 5 | Single correct | (b) 7 |
| 6 | Single correct | (d) The second count exceeds the first by 6 |
| 7 | Multiple correct | (a), (b), (d) |
| 8 | Multiple correct | (a), (c), (d) |
| 9 | Multiple correct | (a), (b), (d) |
| 10 | Multiple correct | (b), (c), (d) |
| 11 | Numerical answer | 48 |
| 12 | Numerical answer | 14 |
| 13 | Numerical answer | 7 |
| 14 | Matching | (a) P–4, Q–1, R–3, S–2 |
| 15 | Matching | (c) P–2, Q–1, R–4, S–3 |


## Brought to the Class 7 standard, 16 September 2026

Phase 1 of `PLAN-MATHS-CONSISTENCY.md`, following the model chapter
(`math-ch05-prime-time`), with Class 7's `p2ch05-data` as the nearest
pattern. Every page was read before anything changed. Every check was run on
the whole chapter.

**Pages: 31 before (23 body + 8 Beyond), 35 after (23 body + 12 Beyond).**

### What changed

**Palette.** `chapter.json` gains `"palette": "cobalt"`, placed where the
model places it. `palette-cobalt.css` sets `--teal: #234c79`, the same value
as `CHAPTER_ACCENTS[4]` in `build/build.mjs`. Nothing else in
`chapter.json` changed.

**All three body examples set as steps** (*Solution*, one step to a
`.work__row`, an *Answer* row, a short `.work__why`). The change is layout
only. `check-example-stepping.mjs`: 3 compared against `HEAD`, 0 lost
mathematics. Only Example 1 gains numbers, because its new Answer row
restates 50, 25 and 40 and the part labels 1 and 2.

Sentences that became rows or reasons, with every number kept:

| example | before | after |
|---|---|---|
| 1 | *…and half of 10 is 5. So $20 + 5 = 25$ children.* | Step 2 ends *…and half of 10 is 5*; Step 3 is *$20 + 5 = 25$ children* |
| 1 | *A child who never sleeps for 9 hours always sleeps for less than 9 hours. So the answer to (3) is 40 children.* | Step 4 is the first sentence, word for word. The second became the Answer row: *(1) 50 children (2) 25 children (3) 40 children* |
| 2 | *…marked one at a time. That is far too many. So take 1 unit of length for 10 runs.* | Step 1 ends *…marked one at a time*, with reason *far too many*; Step 2 is *So take 1 unit of length for 10 runs* |
| 2 | *Mark 0, 10, 20, … Then draw the bars. Fig. 4.12 shows the result.* | Step 5 *Mark 0, 10, 20, … Then draw the bars*; Answer *Fig. 4.12 shows the result.* |
| 3 | *…and mark ₹200, ₹400, and so on. Then work out the height of each bar.* | Step 3 ends *…and so on*. The last sentence became Step 4's reason, *bar heights* |
| 3 | *Drawing bars of these heights gives the bar graph in Fig. 4.13.* | the Answer row, word for word |

**Body layout, to keep a question with its figure** (§5a). At `HEAD`,
Exercise Set 4.6 Q10 was at the foot of p019, a recto, and its figure,
Fig. 4.17, was overleaf on p020. I moved Q10 to the head of p020, above its
figure. Page 20 then needed room, so I made two layout-only changes on it:
- **Table 4.12 now runs across the page:** a *Year* row and a *Number of
  tigers* row, with the same caption, cells and order.
- **Fig. 4.18 is one size step smaller** (`lg` → `md`).

No body sentence was reworded. No example, check or exercise was added.
`refit … body` was not run, because the body fitted after stepping. The
exercise set was not split.

**Beyond the Book, rebuilt to the four stages.**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 7 `.c-try` | word for word, checked by script against `HEAD`, except for `.c-stage__for` and two sentences removed by the user's decision (see *Stage 1: two sentences removed*) |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems in prose | **12 stepped examples**, numbered **Beyond Example 1–12** as Class 7 numbers them, under six `Type N ·` heads |
| 3 Problem Sets → **Practice** | 3 multiple-choice sets, 21 questions | **one run of 30**, six forms; the band carries the numeral |
| 4 Answers & Takeaways → **Answers** | key and notes | on a fresh page: letter key 1–16, one `work--trace` per answer for 17–30, and *why the other options are wrong* for Q3, Q8, Q11 and Q15 |

The six types each cover a topic the chapter teaches:
- Type 1: tally marks and frequency tables (Beyond Ex 1–2)
- Type 2: reading a pictograph (Beyond Ex 3–4)
- Type 3: choosing a key (Beyond Ex 5–6)
- Type 4: reading a bar graph (Beyond Ex 7–8)
- Type 5: choosing a scale and drawing a bar graph (Beyond Ex 9–10)
- Type 6: graphs that mislead (Beyond Ex 11–12)

With the body's three, the chapter has **15 examples**.

**Five new figures**, Figs 4.23–4.27, numbered after the body's last. Each
is drawn only with the `diagram.css` classes the body's charts use. Each
sits inside its example's panel, so it cannot leave its question. Beyond
Ex 8 names Fig. 4.25 and prints on the same page (p106).
- **Fig. 4.23:** a coconut pictograph, with the key at 20 and half symbols.
- **Fig. 4.24:** the milk pictograph, with the key at 30. It is the drawing
  Beyond Ex 5 asks for.
- **Fig. 4.25:** a bar graph of science-fair visitors, 1 unit for 50.
- **Fig. 4.26:** a bar graph of bottles, 1 unit for 5.
- **Fig. 4.27:** a bar graph whose scale steps are drawn equal but stand
  for 10, 10, 30 and 50.

**Practice:**

| form | questions |
|---|---|
| multiple choice | Q1–12 (key a 3, b 3, c 3, d 3) |
| assertion–reason, set as Class 7 sets it | Q13–16 (key a, b, c, d) |
| very short answer | Q17–21 |
| short answer | Q22–26 |
| long answer | Q27–28 |
| case-based (no *Case study* label) | Q29–30 |

**Kept from the old division:**
- Problem 3 became Beyond Ex 9, unchanged.
- Old Set A2, A5 and A6 became Q2, Q5 and Q6.
- Old Set B3 became Q14.
- Old Set B7 became Q7.

The kept options were re-lettered to spread the key.

**Dropped from the old division, because each repeated or gave away the body:**

| old item | why |
|---|---|
| Set A1, 13 tally marks | the same drawing as Table 4.2's gujiya row, which is the answer to Exercise 4.2 Q1(iii) |
| Set B1 and Set C5, 27 and 33 with a key of 10 | they answer the Think and Reflect on 33 and 27 students |
| Set B5, Pooja's bar for 16 tickets | it is Exercise 4.6 Q2(iii)–(iv) |
| Set B6, girls in Class 5 and Class 6 | it is Exercise 4.6 Q7(ii) |
| Set B8 and Set C4, wickets times matches | they give the method Exercise 4.6 Q5(vi) asks for |
| Set C1, the capital of India | it is Exercise 4.1 Q5 |
| Set C2, the sapling total | it is Exercise 4.6 Q10(ii) |
| Set C3, the dog key | it is Exercise 4.6 Q8(i) |
| Set C6, tiger growth by period | its working sums to Exercise 4.6 Q11(iii) |
| Set C7, Everest against twice Elbrus | it answers the Think and Reflect on p023 |
| Set B4 and Problem 4, a scale not starting at 0 | a near-repeat of Stage 1's sixth question |
| Problem 1, dogs with a key of 6 | too close to Exercise 4.6 Q8 |
| Problem 2, the number of die rolls from their frequencies | near-repeat of Stage 1's goals question, and set beside Exercise 4.6 Q4's 30 rolls |
| Set A3, Set A4 and Set B2 | near-repeats of questions kept (Q3, Q4, Q13) |
| Problem 5, children join and a half symbol becomes whole | Exercise 4.6 Q7(iii) with new numbers |

**Nothing repeats the body.** `check-no-repeats.mjs` compared 117 body
questions with 75 in the division and printed no pair. I also judged the
closest pairs by reading. Each is *same type, different question*:
- Beyond Ex 1 and Q22 (make a frequency table) against Exercise 4.6 Q3.
- Beyond Ex 5 and Q28 (choose a key under a constraint) against Exercise
  4.6 Q8(i).
- Q27 (draw and read a bar graph) against Exercise 4.6 Q9.
- Q19 (ascending order, then the value seen most) against Exercise 4.3.

No Beyond example or practice question states a body answer. Stage 1 did,
twice, until the two sentences below were removed.

**`ANSWERS.md`** answers every question the chapter sets:
- all seven exercise sets;
- every Think and Reflect;
- the questions in the running text (Table 4.13, Figs 4.21–4.22, *try
  drawing Imran's graph this way*);
- Beyond's practice.

It gives the working, what each drawing or table must show, and a worked
instance under each *answers will vary*. Body parts use the page's (i),
(ii)… numbering. Beyond's examples are called *Beyond Example N*.

### Verified

**`check-numbers.mjs` exits 0 with 672 checks passed.** It sweeps 99
arithmetic identities from the pages and 92 from `ANSWERS.md`. No maths
span with an `=` was skipped. The script reads the data where it is printed:

- **Tables.** Every table cell is read: Tables 4.1–4.13 and the uncaptioned
  tables (Chinu's vehicles, Bumrah's wickets, the Mudhol Hounds, free time,
  and Beyond's tables).
- **Tally marks.** Every tally is counted stroke by stroke from the SVG and
  compared with its label. This covers Fig. 4.1 group by group, Table 4.2,
  Beyond Ex 1's table and Q1's tally.
- **Pictographs.** Every symbol is counted, with half symbols, row by row,
  and multiplied by the key printed on the figure. This covers Figs 4.2–4.7,
  4.15, 4.16, 4.23 and 4.24. Each figure is compared with its table, its
  prose and its aria-label.
- **Bar graphs.** Every bar is measured from its SVG coordinates against the
  figure's own axis ticks. This covers Figs 4.8–4.14, 4.17–4.21 and
  4.25–4.27. For each, the script checks:
  - the ticks lie on one straight scale; Fig. 4.27 must fail this, which is
    its point;
  - every bar stands on 0, and all bars are the same width;
  - every *1 unit length = N* note equals the step between grid lines.
- **Fig. 4.14** has no numbers, so it is read in grid units. The script
  computes which bars are wrong or missing (Indore and Sagar).
- **Fig. 4.18:** the wrong bars are computed against Table 4.12 (2006, 2010,
  2014 and 2018; 2014 and 2018 are swapped).
- **Fig. 4.21:** each triangle's apex is read against Table 4.13.
- **Fig. 4.22:** the peaks are measured. Everest is drawn 1.93 times as tall
  as Elbrus, against a true ratio of 1.57.
- **The prose** that reads the figures is checked: p004, p008, p011, p012,
  p013 and p023.
- **Worked examples.** The Answer row of body Example 1 and of every Beyond
  example, and the stepped claims inside them.
- **Practice answers.** Every answer row, 17–30, is read back from the page,
  one lettered part at a time, as a full number sequence.
- **Keys.** Each multiple-choice question has exactly one right option,
  matching the printed key; options and key are read from the page. The
  assertion–reason keys come from computed truth values, tied to the words
  printed under each number. The script also checks the key spread, the
  1–30 numbering, and the six forms and where each starts.
- **Placement.** Figures are numbered 4.1–4.27 in order, and tables 4.1–4.13.
  Every question, Think and Reflect, try band or example question that names
  a figure or table prints on the same page or on facing pages. The script
  derives folios from `chapter.json`.
- **`ANSWERS.md`.** Its values are recomputed from the pages and looked for
  in the file.

A Beyond example's question is read from `c-example__body`, not from the
tab, so a tab's number can never be read as data.

**The script was tested by breaking numbers on purpose**, each in a scratch
copy of the chapter. It exited 1 on all ten:
1. Fig. 4.17's Saturday bar redrawn from 60 to 50;
2. one stroke removed from Table 4.2's gujiya tally;
3. key 10 changed from (d) to (c);
4. `ANSWERS.md` 4450 → 4540;
5. Q23's answer 260 → 250;
6. Q29(c) alone, 4 → 5;
7. one coconut removed from Fig. 4.23's Wednesday row;
8. Q15's reason reworded;
9. Beyond Ex 7 answer (b) 150 → 250;
10. Table 4.5 Class II 35 → 40, which was caught against Figs 4.5 and 4.6.

**Wrong numbers found: none** in the printed chapter or the old division. Both
were re-derived in full, and every value matched. The errors were in my own
script, and I fixed each before relying on it:
- it read an example's tab number as data;
- it did not skip a leading *1 unit* in several questions;
- a bar read through two-decimal coordinates came back as 150.01 or 8848.17;
  readings are now snapped within what 0.01 of a drawing unit is worth on
  that axis;
- it did not read Fig. 4.16's aria-label, which spells its counts in words.

**Fitting.**
- The final build clips nothing and runs nothing into the margin.
- `orphans`: 0 stranded openers in 35 pages.
- `fit-options`: every option row fits.
- `check-labels`: no labels collide.
- `data-close` is on p023 only; `data-bridge` is on every p1xx; there is no
  `--head` or `--tail`.
- There are three `.c-stage` heads and one `c-practice__num`.
- `refit … bridge` was run on freshly generated Beyond pages after each
  content change. The final run packed 14 pages to 12.
- Answers opens folio 35 (p112). The page before it, p111, is 100% full, so
  no short page is left before Answers.

Stepped examples lost two page-length gaps. Beyond Ex 4 needed 84 mm with 88
mm free, and Beyond Ex 12 needed 95 mm with 96 mm free. I closed both by
setting their options in two columns. To fit question 30 on the third
practice page, I tightened Q13, Q17, Q23, Q26 and Q28 by whole lines, and
set Q10's options in four columns. For the same reason I dropped two parts
while writing: Q27(e) (*days over 40*) and Q30's pictograph part.

**Colour.** I ran `check-colour.mjs` on pages 1, 6, 18, 22, 27, 28, 29 and
31, and looked at four renders: p22 and p27 in greyscale, p6 and p18 under
deuteranopia.
- Every chart has a single series, so no bar is told apart by colour.
- Half symbols differ by shape.
- Fig. 4.21's coloured triangles each carry their name beneath.
- The tractor and girl symbols stay distinct by shape.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 19 | 72% | Exercise Set 4.6 Q10, which must print on the same page as Fig. 4.17 (§5a). `gaps` suggests `split-practice`, but that would put Q10 back overleaf from its figure; do not follow it |

Every other page is at 88% or more.

### Real-world data and sources

| data | source, or status |
|---|---|
| Fig. 4.10, population of India 1951–2001 (36, 44, 54, 68, 84, 102 crores) | NCERT *Ganita Prakash* Class 6 Ch. 4, from the Census of India (36.1, 43.9, 54.8, 68.3, 84.6, 102.9 crores). NCERT's values are truncated, not rounded — flagged |
| Table 4.12, tigers 2006–2022 (approx.) | NCERT, from the National Tiger Conservation Authority's *Status of Tigers in India* estimates: 1411, 1706, 2226, 2967, 3682 |
| Table 4.13, mountain heights | NCERT's values — Denali flagged |
| Exercise 4.7 Q2 answer, Nile and Amazon longest | *Encyclopaedia Britannica*, "Nile River" and "Amazon River"; no lengths printed, because sources differ |
| Fig. 4.9 Delhi traffic, Bumrah's wickets, Mudhol Hound villages, Ginnori library, Jamnagar kites | NCERT's own illustrative data, not sourced further |
| every value in Beyond the Book | made-up classroom data, set in made-up shops, classes and villages; no source needed |

No *Did you know?* was added.

### Flagged

| where | code | what is wrong | what it needs |
|---|---|---|---|
| Body Example 2 (p013) | §5a figures | Its Answer row, *Fig. 4.12 shows the result*, is on a recto, and Fig. 4.12 is overleaf on p014. The question does not name the figure; this was already so at `HEAD` | Accept, or re-fit p013–p014 |
| Fig. 4.10 | facts | NCERT truncates the census figures. 1971 is 54.8 crores, printed 54; 1991 is 84.6, printed 84; 2001 is 102.9, printed 102 | A decision on rounding; the numbers are NCERT's, so they were left alone |
| Table 4.13, Denali 6194 m | facts | The 2015 US Geological Survey measurement is 6190 m. 6194 m is the older figure. Everest is now 8848.86 m | A decision; the numbers are NCERT's, so they were left alone |
| Exercise 4.6 Q8(i) | C4 | *What would be a useful key?* has two good answers, 6 and 12 | `ANSWERS.md` gives both |
| `gaps.mjs` | tool | It does not know the figure-facing rule, and suggests splitting p020's Q10 back onto p019 | Do not follow it on this chapter |
| `refit … bridge` | tool | Its result depends on the pages it is given. I always ran it on freshly generated pages, from `scratchpad/gen-beyond.mjs` | Re-check p103–p112 after any future refit |

### Stage 1: two sentences removed, 16 September 2026

**The user's decision.** I had flagged a conflict: the rule that nothing in
Beyond answers a body question, against keeping Stage 1 word for word. The
user ruled that the first rule wins, and asked for the smallest edit that
works. Both flags above are cleared by this change.

| page | before | after | why |
|---|---|---|---|
| p101, the try about 27 books | *…and no reader could measure that. It is the same problem Jarina and Sangita met with 33 and 27 students.* | *…and no reader could measure that.* | It pointed the reader at the body's Think and Reflect about 33 or 27 students, and said the answer was the one just given |
| p102, the goals try | *So the total is $0 + 5 + 8 + 6 = 19$ goals. This is the question Mayank got wrong about Bumrah's wickets. Adding 0, 1, 2 and 3 gives only 6, because it forgets how many matches each number of goals happened in.* | *So the total is $0 + 5 + 8 + 6 = 19$ goals.* | The first sentence names Exercise 4.6 Q5. The second is Q5(v)'s answer with goals for wickets, so even without the names it still answers the question. It was deleted too |

Everything else in Stage 1 is unchanged. I read the whole stage again and
kept two passages:
- **p101:** *Its row would need a piece of a symbol smaller than a half.*
  It answers the try's own question about a key of 8, and names no body
  question.
- **p102:** the goals try works *count × frequency*. It is the try's own
  question, a worked analogue of the method Exercise 4.6 Q5(vi) asks for,
  on other data. Deleting it would remove the try. **Flagged** for the user,
  in case the analogue alone counts as giving Q5(vi) away.

`check-numbers.mjs` no longer computes $0 + 1 + 2 + 3$ for Stage 1. It now
also checks that Stage 1 names none of Mayank, Bumrah, Jarina or Sangita.
`ANSWERS.md` quoted neither sentence, so it did not change.

### Not changed

NCERT's structure in the chapter body. No example, check or exercise was
added. The seven exercise sets, every Think and Reflect, and Figs 4.1–4.22
are as they were, apart from Fig. 4.18's size step. None of §5's unused
components was introduced.


## 20 September 2026 — reference numbering and reading order

- Figures and tables now share one chapter sequence; caption labels and prose references were migrated together, including cross-chapter references within Class 6.
- Dependent text and diagrams are kept together with c-figure-context where the revised layout needs it. The final bound-book audit distinguishes facing pages from page turns.
- Source content was checked against build/_class6-reference-before. All questions, worked mathematics and illustrations were preserved. The Data Handling closing paragraph alone was shortened to avoid an isolated final page.
- Validation and mapping: build/_class6-reference-checks; reproducible source check: build/check-class6-reference-revision.mjs.
