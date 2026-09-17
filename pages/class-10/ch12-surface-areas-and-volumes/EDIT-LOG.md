# Class 10 · Mathematics I · Chapter 12 — Surface Areas and Volumes

## Brought to the Class 7 standard, 17 September 2026

Phase 4 of `PLAN-MATHS-CONSISTENCY.md`, worked from the Class 10 Chapter 1
model. Page move, examples, Beyond the Book and answers were done in one
pass, and every check was run on the chapter.

**Pages: 18 before (11 body + 7 Beyond, Crown Quarto), 26 after (12 body +
14 Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`, and the body was
refitted once.

**All seven body examples set as steps.** Each was a question-only panel
with its working in `.work--list` blocks and prose after it, sometimes over
a page turn (Examples 1, 2, 3 and 5). The working now sits in its panel as
*Solution*, Steps and *Answer*, and the figure each example is drawn for
sits inside its panel, after the work rows (the Class 8 Chapter 1 pattern).
- Sentences that were steps became steps or their reasons. For example,
  *the height of the cone is the height of the top less … its radius*
  became Example 1 Step 3's reason, and *Let $h$ be … Then* became
  Example 4 Step 1.
- Remarks stay after their panel, word for word: Example 1's *Notice that …*,
  Example 2's *The hemisphere hides part of the top face …*, and Example 3's
  paragraph on the uncovered ring. In Example 6's remark, *less than this*
  became *less than the apparent capacity*, because the paragraph now
  follows the panel.
- Example 4 Step 1 states 1.45 m as 145 cm, and Step 4 gives the reason
  for the change of unit.
- `build/check-body-maths.mjs` reports **no mathematics lost or added**
  (88 expressions and 158 numbers). The only gains are the values restated
  in Answer rows, and 145, 10000 and 2.1 stated in steps.

**A question and its figure.** After the refit, Exercise Set 12.2 Q3 printed
on page 11 (a recto) and Fig. 12.15 on page 12, overleaf. The question was
moved by hand to the head of page 12, above its figure. Every other figure
prints on the same page as its question.

**Beyond the Book rebuilt to the four stages:**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, each explained in running text | **kept word for word**; `.c-stage__for` removed; two small repairs, below |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems in `.c-problem` / `.c-solution` | **14 stepped examples** under six `Type` heads; old Problems 1–3 are Examples 1, 2 and 6, with their options kept, and old Set B Q2 is Example 10 (old Problems 4 and 5, both melting or pouring, were replaced; see the follow-up) |
| 3 Problem Sets → **Practice** | 3 sets, 19 questions | **one run of 31** in the six forms (14 MCQ, 5 AR, 3 very short, 4 short, 3 long, 2 case-based) |
| 4 Answers & Takeaways → **Answers** | key, 11 why rows, closing paragraph | key, every other answer, why the options are wrong for 12 questions, the closing paragraph |

The types: surface area of joined solids; surface area when a part is cut
away; volume of joined solids; volume left when a part is removed (with a
proof); the capacity of a vessel; cost from a surface area. The chapter now has
**21 worked examples** (7 body + 14 Beyond). The board-style work is a
proof (Example 11, practice Q28), unit changes (cm³ to litres, g to kg,
cm² to m², kg to tonnes), a cost in rupees, and two case tables.

**Stage 1, two repairs.**
- Its fifth explanation ended *as in Question 5 of Exercise Set 12.1*. That
  pointed the reader at the body question the reasoning answers, so the
  clause was deleted.
- Its second explanation says *in Example 7*. Beyond now has an Example 7
  of its own, so this reads *in Example 7 of the chapter*, the model's
  wording.

**Give-aways removed** (every value Beyond printed was read against the
body's exercise answers):

| old item | the problem | fix |
|---|---|---|
| Set A Q2 | option (c) printed 374 cm², the answer to Ex 12.1 Q9, and the answer 220 matched Ex 12.1 Q6 (220 mm²) | slant height 15 cm: 330, 484, 154, 660 |
| Set A Q4 | the answer, 66 cm³, is the answer to Ex 12.2 Q2 | radius 6 cm: 264 |
| Set A Q5 | greatest diameter of a hemisphere on a cube, the first half of Ex 12.1 Q4 | replaced by the largest cone carved from a cube |
| Set B Q1 | cone of radius 3.5 cm and height 12 cm on a hemisphere: the solid of Ex 12.1 Q3, whose height 12 the question asks the reader to find | dropped |
| Set C Q3 | hemispheres scooped from both ends of a cylinder 10 cm high: Ex 12.1 Q9 with another radius, and its working | dropped |
| Set C Q4 | a repeat of Stage 1's fourth question | dropped |
| new Q23 (first draft) | a second cone-on-hemisphere toy, the type of Ex 12.1 Q3 | a hemisphere on a cylinder |

`check-no-repeats` now reports one pair above 50%: Example 2 (the old
Problem 2, a cone of height 4 cm on a hemisphere, asked for its area in
terms of $\pi$) against Ex 12.1 Q3. They are the same type with different
givens, and neither answers the other. It is kept, as the Chapter 1 model
kept such pairs.

**Wrong remarks in the old key, fixed.** The first three items were later
removed with the melting items (see the follow-up below):
- Old Problem 4 said option (d), 32 cones, *forgets the height*. Forgetting
  the height gives 96. The 32 comes from dividing by the base area alone,
  and the remark now says so.
- Old Set C Q1 said option (a), 12 cm, *uses a hemisphere*. A hemisphere
  gives 9 cm, which was option (c). The options are now 9, 18, 72 and 8,
  and each wrong one is explained (Q12).
- Old Set C Q2's option (b), 6, had no reading. It is now 4, which forgets
  the cone's $\frac{1}{3}$ (Q13).
- Old Set A Q4 option (c), 88, had no reading. It is now 1056, which takes
  the diameter as the radius (Q4).

**`ANSWERS.md` written** for Exercise Sets 12.1 and 12.2, the four questions
in the running text of 12.1 and 12.2, Stage 1, and all 31 practice
questions. Each answer names the value of $\pi$ it uses, and says where a
value is rounded. Q28's proof is set one statement to a line.

### Verified

`check-numbers.mjs` passes **561 claims**, evaluating 243 printed
identities, 10 statements skipped (counted after the follow-up below). It reads $\pi$ as a symbol:
- two sides that both carry $\pi$ are compared as expressions;
- a side with $\pi$ against a number uses the value that question declares
  (a trace row takes its practice question's value);
- a rounded decimal is allowed its own rounding, and no more;
- sides with $r$, $h$, $l$ are compared as algebra, at random values;
- spans split only by a unit that does not change (cm² … cm²) are read as
  one chain, and a change of unit is left as two statements.

It also re-derives:
- every body Answer row, from the question's own measurements;
- every Exercise Set answer in `ANSWERS.md`, including the rounding in
  12.1 Q8 (17.6 to 18), 12.2 Q3 (about 338) and 12.2 Q7 (1.131 m³);
- Stage 1's values, and every Solved Example;
- each practice answer read back from the key rows a lettered part at a
  time, as a phrase (*332.64 tonnes*, *about 2.43 litres*, *₹6330.24*),
  with the question's givens checked as printed;
- every multiple-choice question in Practice and in Solved Examples
  (exactly one right option, matching the key or the Answer row), and
  every assertion–reason letter;
- that every figure label is a measurement its question states, and that
  every question prints on its figure's page or facing it;
- that every `₹` set before maths is wrapped with its number;
- that the `ANSWERS.md` key and practice working match the page.

**Break tests: 28 of 28 caught** on a copy of the chapter (16 in the first
pass, 12 more for the follow-up). The breaks were
a body Answer, a body working row, a figure label, two Beyond Answers, a
declared value of $\pi$, a key letter, a key row, a lettered part, an
option, a question's given, an unwrapped rupee sign, and three
`ANSWERS.md` values plus its key. The first run missed a body working row:
*$= 3.14 \times 20.25$ cm² $= 63.585$* was two spans, so the check never
compared them. Spans are now joined across a unit that does not change.

**Fitting:** nothing is clipped. Page 25 runs 1.3 mm into the bottom
margin. `orphans` finds 0 stranded openers, `check-labels` finds no
collisions, and `fit-options` finds every option row fits.
- After the bridge refit, Beyond pages 14–17 were rebalanced by hand with
  `unsettle`. Example 2 lost a row (its two CSA steps are now one) so that
  it would fit on page 14.
- A fifth pull overran page 18 by 10 mm and was reverted.
- Practice Q30 was moved to page 24 so that Q31 does not stand alone
  before Answers.
- I read the proofs of pages 4, 6, 13, 18, 24 and 25.

**Colour:** pages 1–12 (every figure) were read in greyscale and
deuteranopia. The shaded hollows (Figs. 12.9, 12.11, 12.13, 12.14) are
also marked by shape and position, and the captions name them.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 1, 2 | 79%, 83% | figures (Fig. 12.3, Fig. 12.5) |
| 3 | 48% | Example 1, a panel of about 190 mm with its figure |
| 5 | 68% | Example 3, a panel of about 190 mm |
| 9 | 79% | Example 6, a panel |
| 10 | 73% | Example 7, a panel |
| 15, 16 | 71%, 76% | Solved Examples: example panels; Example 7 misses page 16 by about 7 mm |
| 18, 19 | 66%, 78% | a `Type` head with its example |
| 21 | 84% | a practice block with its sub-head |
| 23 | 60% | Q30 moved on, so that Q31 is not alone before Answers |
| 24 | 71% | **the Answers stage, which always opens a page** |
| 26 | 82% | the last page |

### Follow-up, 17 September 2026: melting and recasting removed

Decided by the user. *Conversion of solids* was dropped from the NCERT
Class 10 syllabus in 2023, and 12.2 and 12.3 never teach it. Beyond has to
go further without adding syllabus, so its six melting or pouring items
were replaced like for like with items on combined solids.

| item | was | now |
|---|---|---|
| Stage 1 Q3 | a sphere of radius 3 cm melted into a cylinder of radius 2 cm (9 cm) | a cylinder of radius 3 cm and height 10 cm with a cone on top, whole volume $96\pi$ cm³: how tall is the cone? (2 cm), explained in running text and still ending *no value of $\pi$ was needed* |
| Example 12 (MCQ) | a sphere melted into cones (b) | a glass with a raised conical bottom, actual capacity $99\pi$ cm³ (b) |
| Example 13 (MCQ) | a bowl of oil poured into bottles (d) | an oil can (cuboid with a cylindrical spout), capacity 15.09 litres (d) |
| Practice Q12 (MCQ) | a sphere melted into a cylinder (b) | the volume of a cone on a cylinder, 1078 cm³ (b) |
| Practice Q13 (MCQ) | a bowl poured into cones (c) | the total surface area of a cone on a cylinder, $60\pi$ cm² (c) |
| Practice Q19 (AR) | the volume of metal changes on melting (d) | a cylinder with a cone on top claimed as $24\pi$ cm³ (really $16\pi$) (d) |

- The Stage 1 word-for-word rule was overridden here, as it would be for
  a give-away. Its opening sentence said *a question may melt one solid
  into another*; it now reads *may give the whole solid and ask about one
  part*.
- *Type 5 · Filling and remaking* became *Type 5 · The capacity of a
  vessel*. There are still 14 examples, numbered 1–14.
- Every key letter is the same as before, so the key's spread is
  unchanged: a 4, b 5, c 4, d 6.
- The closing paragraph's *melted, joined or cut* became *joined or cut*.
- Why rows 12 and 13 and `ANSWERS.md` (Stage 1, Q12, Q13, Q19) were
  rewritten, and `check-numbers.mjs` re-derives every new value,
  including `ANSWERS.md`'s Stage 1 summary, which nothing checked before.
- **No give-aways.** Every new value was read against the body's exercise
  answers, and none matches. `check-no-repeats` still reports only the
  one pair noted above.
- **Grep:** a grep of the chapter for
  melt|recast|poured|remade|made into finds nothing.
- **No refit needed:** page breaks are unchanged, nothing is clipped, and
  orphans, fit-options, check-labels and check-body-maths are all clean.
- **Proofs read:** pages 19 and 22.

### Flagged, not done

- The old flags below still stand: Example 4's *total surface area*
  leaves out the base, and Ex 12.2 Q8 ignores the overlap of the neck and
  the sphere.
- Example 5 (a hole drilled through a cube) and practice Q25 use a
  cylindrical hole through a solid. That is a cut-away cylinder, which the
  chapter does not show, although its key idea covers it.

Written new from NCERT *Mathematics, Textbook for Class X* (reprint 2026-27),
Chapter 12, *Surface Areas and Volumes* (textbook pages 161–170). Original
LearnLab text in NCERT's order of topics, examples and questions; no sentence
is carried over. Crown Quarto, house design, palette `olive`. The source PDF
has no answer key; every answer below was worked here.

Sections: 12.1 Introduction · 12.2 Surface Area of a Combination of Solids ·
12.3 Volume of a Combination of Solids. *Exercise 12.1* and *12.2* are
Exercise Sets 12.1 and 12.2. The rule for each section is a `c-keyidea`; all
working is `.work--list` rows. The source's *12.4 Summary* is the chapter
summary.

## Figures

All 16 come from `fig12.mjs` in the session scratchpad (unfilled copy
`c12-src`) and are drawn from the source's pictures, not traced. Solids are
drawn with the book's three face tints and hidden edges dashed.

| figure | note |
|---|---|
| Fig. 12.2 | the truck is an outline; the container's joins are dashed |
| Figs. 12.4, 12.5 | the source's three stages are two: the pieces apart, and joined; the faces with a smiling face and stars on the cone are not drawn |
| Fig. 12.3 | the thought bubble is not drawn; *cylinder* and *hemisphere* label the two parts |
| Fig. 12.8 | the base of the cone seen from below is set beside the rocket, as in the source |
| Fig. 12.9 | the bird-bath is drawn to show its parts, not to scale (1.45 m against a 30 cm radius) |
| Fig. 12.15 | one gulab jamun with its measurements instead of a bowl of them |
| Fig. 12.16 | the block with its four openings; the source's second view with pens standing in the hollows is not drawn |

## Every answer worked

| where | answers |
|---|---|
| Examples 1–7 | as set out in the chapter, each re-derived: 39.6 cm²; 163.86 cm²; 63.585 cm² and 195.465 cm²; 3.3 m²; 1128.75 m³ and 827.15 m³; 196.25 cm³ and 163.54 cm³; 25.12 cm³ and 25.12 cm³. The source's values are all correct |
| Set 12.1 Q1–Q5 | 1 160 cm² (a cuboid 8 × 4 × 4) · 2 572 cm² (cylinder 6 cm high) · 3 214.5 cm² (cone height 12 cm, slant height 12.5 cm) · 4 7 cm; 332.5 cm² · 5 ${\frac{l^2}{4}(24 + \pi)}$ |
| Set 12.1 Q6–Q9 | 6 220 mm² · 7 44 m², ₹22000 · 8 17.6 cm², 18 cm² to the nearest cm² (slant height 2.5 cm) · 9 374 cm² |
| Set 12.2 Q1–Q4 | 1 $\pi$ cm³ · 2 ${21\pi = 66}$ cm³ (cylinder 8 cm long) · 3 about 338 cm³ (one gulab jamun is 25.05 cm³) · 4 523.53 cm³ (${525 - 4 \times 0.367}$) |
| Set 12.2 Q5–Q8 | 5 100 lead shots · 6 111532.8 cm³, 892.26 kg · 7 ${360000\pi}$ cm³, about 1131428.57 cm³ or 1.131 m³ · 8 ${321.39 + 25.12 = 346.51}$ cm³, so she is not quite correct |

Beyond the Book: Stage 1 — 112 cm²; ${1 : 2 : 3}$; 9 cm; 4 times and 8 times; up, by ${\pi r^2}$. Stage 2 — (b), (a), (c), (b), (d).
Set A b a a b c d c d; Set B a b c b a d; Set C b c a d d.

## What changed from the source, deliberately

| source | here | why |
|---|---|---|
| Example 1: "a cone surmounted by a hemisphere"; Example 7: "circumscribes the toy" | "a cone with a hemisphere on top of it"; "circumscribes the toy, that is, just encloses it" | L1; the term kept where it is the question's own |
| Example 1: "which surprisingly had no colour on it" | "It had no colour on it" | C8 |
| Example 3: "Denote radius of cone by r, ..." | "Let the radius, height and slant height of the cone be r, h and l ..." | L3 |
| Example 4: "hemispherical depression"; Exercise 12.1 Q5 and 12.2 Q4 | "hollow" | L1 |
| a rule for each section, given only in the prose | also as key ideas | structure |
| the instruction "Unless stated otherwise, take π = 22/7" above each exercise | the first sentence of Question 1 | the book has no text between a band and its first question |
| Exercise 12.2 Q1 had lost its number in the source | numbered 1 | typing |
| summary points "To determine the surface area of an object ..." | stated as results | a summary point should state the fact |
| line-sized additions: in 12.1 (the formulas are needed again; three examples of combined solids); in 12.3 (nothing is hidden inside when solids are joined); in Example 6 (what "apparent capacity" means; a customer gets less than the glass seems to hold); in Beyond the Book (the answers often need no value of π; Set B Q6 says the cone fits exactly on the cylinder) | added | fitting |
| Example 2: the sentence about the covered part of the top face | shorter | fitting |
| Example 7: "Hence, the required difference of the two volumes = 25.12 cm³" after the working that already gives it | not repeated | fitting: the chapter was closing on a page holding only the summary |
| Exercise 12.2 Q2: "Rachel, an engineering student"; "(Assume the outer and inner dimensions of the model to be nearly the same.)" | "Rachel"; "(Ignore the thickness of the sheet.)" | fitting; the assumption is unchanged |
| Figs. 12.14–12.16 | drawn shorter (wider viewBox, or cropped) | fitting, as above |

## Flagged

| location | code | what is wrong | what it needs |
|---|---|---|---|
| Example 4 | C4 | "total surface area of the bird-bath" leaves out the base of the cylinder (and the legs) without saying so | "the outer curved surface and the inner hollow" |
| Exercise 12.2 Q8 | C4 | the neck and the sphere overlap where they meet, and the question ignores the overlap; its answer (346.51 cm³) depends on that | a note that the neck is measured from the surface of the sphere |
| Exercise 12.1 Q8 | — | "to the nearest cm²" turns 17.6 into 18; the exact value with ${\pi = \frac{22}{7}}$ is 17.6 | none |
| Example 6 | M1 | "apparent capacity" is used without a meaning | the meaning now in the question |
