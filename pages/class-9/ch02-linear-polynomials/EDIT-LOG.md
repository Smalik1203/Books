# Class 9 · Mathematics I · Chapter 2 — Introduction to Linear Polynomials

## Solved examples in examination formats, 23 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 17 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-9/ch02-linear-polynomials/`.

Source `build/jee-class9.mjs`; check `build/check-jee-class9.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p114; the answers stage still opens a fresh page.

Also, same day. Fig. 2.14 belonged to the old examples; the practice figures after it were renumbered down by one (Fig. 2.15 and 2.16 became 2.14 and 2.15, in page and snapshot). Body p010: the auto-rickshaw example now reads “₹25 for 2 km and ₹15 for each further km. Find the fare for 10 km.”, to pull back a line that ran 2.1mm into the margin; the fare and working are unchanged.

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) 3 and $-3$ |
| 2 | Single correct | (b) 10 |
| 3 | Single correct | (c) 1 |
| 4 | Single correct | (d) 17 |
| 5 | Single correct | (a) $(0, 10)$ |
| 6 | Single correct | (b) $-4$ |
| 7 | Multiple correct | (a), (c) |
| 8 | Multiple correct | (a), (b), (c) |
| 9 | Multiple correct | (a), (b), (c), (d) |
| 10 | Multiple correct | (a), (b), (d) |
| 11 | Numerical answer | 9 |
| 12 | Numerical answer | 9 |
| 13 | Numerical answer | 115 |
| 14 | Matching | (c) P–4, Q–3, R–1, S–2 |
| 15 | Matching | (a) P–2, Q–4, R–3, S–1 |


## Brought to the Class 7 standard, 17 September 2026

Phase 5 of `PLAN-MATHS-CONSISTENCY.md`, worked from the Class 9 brief with
Chapter 6 as the model. Page move, examples, Beyond the Book and answers were
done in one pass, and every check was run on the chapter.

**Pages: 41 before (29 body + 12 Beyond, Crown Quarto), 45 after (28 body +
17 Beyond, 196 × 276).**

### What changed

**Rupee amounts held together** (added by the coordinator at acceptance): all 43 `₹$…$` amounts in the body were bare; each is now wrapped in `<span class="nb">`, as in Classes 8 and 10, so the sign never ends a line. No page re-broke.

**The page.** `chapter.json` gains `"edition": "196x276"`, and the body was
refitted once. A second refit (after three trims) packed worse — 29 pages and
more short ones — so it was thrown away and the first fit kept; the page
breaks round pages 10–19 were then placed by hand with `settle`/`unsettle`,
keeping every figure on the same sheet parity so nothing that faced its
question stopped facing it.

**All sixteen body examples set as steps** — *Solution*, Steps, *Answer*.
Class 9's working was already in the panels as prose, `.eq` lines and bare
`.work` lines; it is now one step to a row with the reason in a
`.work__why`. Remarks that are not steps stay at the foot of the panel.
- Examples 12–16 (the graphs) had their working and their figure *after*
  the panel. Both moved in: the working as steps, Figs 2.6–2.10 inside their
  own panel after the steps. Example 14's Fig. 2.8 came across from the next
  page.
- Example 4 was a statement, not a question (*A square has side $x$. Its
  perimeter is $4x$…*). It now asks *What is its perimeter?* and answers it.
- Examples 5, 7 and 8 set their table between Step 1 and the later steps;
  Examples 9 and 10 (which only ask for a table) have a one-row *Answer*,
  "the table below".
- Example 11's lead-in (*Each observation is a pair of values…*) stays as a
  paragraph before *Solution*.
- Every `₹$…$` written in a step is wrapped in `.nb`.
- There were no reason chips in this chapter's body, so nothing to change
  from `.chip`.

**Verified** by `build/check-body-maths.mjs`: 261 expressions and 104
numbers, none lost and none added (numbers gained: only figure numbers
restated in *Answer* rows).

**Graphs.** The seven graphs of § 2.6 had `aria-label="2.5"` … `"2.11"`,
the figure number and nothing else (flagged below in the language edit).
Each now describes its lines and points. Labels printing on a line were
moved after reading the proofs: Fig. 2.8's *y = ½x*, Fig. 2.9's *y = −⅓x*,
Fig. 2.10's *y = 2x + 1*, and Fig. 2.11's three line labels and its A and B.
No geometry changed: every body graph was measured from its coordinates by
`check-numbers.mjs` and every line and point is drawn to the equation printed
with it.

**Beyond the Book rebuilt to the four stages:**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, each explained in running text | Q2, Q3 and Q5 and the opening kept word for word; **Q1's numbers and Q4 replaced** (below); closing sentence now points at *the examples*; `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems | **17 stepped examples** under nine `Type` heads; old Problem 1 is Example 10, Problem 3 is Example 8, Problem 4 is Example 12, Problem 5 is Example 14 (with Fig. 2B.2); Problem 2 replaced by Example 7 |
| 3 Problem Sets → **Practice** | 3 sets, 25 questions, all multiple choice | **one run of 32** in six forms: 16 multiple choice, 4 assertion–reason, 3 very short, 4 short, 3 long, 2 case-based |
| 4 Answers & Takeaways → **Answers** | key, why four options are wrong, three takeaways | key, every other answer, why the options are wrong for eight |

**Stage 1 answered the body twice,** so the no-give-away rule won:
- Q4 used $(1, 5)$ and $(3, 11)$ — End-of-Chapter Q10's two points — and
  worked out their line, $y = 3x + 2$, which is End Q10 (i)'s answer. It is
  now $(2, 1)$, $(4, 7)$ and $(7, 19)$, the same question with the same
  structure (line $y = 3x - 5$, third point three units above it, second
  step 4 against 3). **Fig. 2B.1 redrawn** to the new points.
- Q1's table printed the rule $y = 3x + 2$ (End Q10's answer again). Its
  $y$ row is now $13, 19, 25, 31$ and the rule $y = 3x + 4$; the words are
  unchanged.
- Q5's remark about *the tank of Example 10* points at the method for that
  example's Think and Reflect but prints no answer; kept.

**Other give-aways fixed:**
- old Problem 2 was Example 8's own auto-rickshaw, whose table already shows
  the 1 km fare; replaced by a courier with the same trap (Example 7);
- old Set A Q9 (a $3$ m tank losing $0.5$ m a month is empty after $6$
  months) answered the Think and Reflect after Example 10; dropped;
- old Set A Q10 (the stage with $47$ tiles of $2n - 1$) is the Think and
  Reflect after the tile pattern word for word; now $3n + 2$ tiles (Q7);
- old Set A Q7 and Set B Q6 printed $y = 3x + 2$ (End Q10); now
  $y = 4x + 1$ with $y = 4x - 6$, and a table fitting $y = 3x + 3$;
- old Set B Q4 was End Q7 (a)'s line, $y = -3x + 4$, with its slope and
  intercept; now $y = -3x + 5$ (Q12), with a false third statement;
- old Set C Q6 was End Q13 with the numbers unchanged; dropped;
- two new values were changed after reading Beyond's numbers against the
  body's answers: Example 4's father was $35$ (End Q4's answer), now $33$;
  Example 6's $12$th row had $51$ seats (the tile count at Stage 26), now
  the $13$th row with $54$.
`check-no-repeats` finds no question in Beyond close to one in the body.

**Audit fixes** (the Class 9 Beyond audit, Ch02 table):
- *Set C Q5, $p(p(x)) = 4x + 9$* (borderline: composing a function) —
  dropped; its place is taken by the audit's suggestion, *find $p(x)$ from
  two conditions* (Practice Q25).
- *Gap: degree and coefficients (§ 2.1)* — Type 1, Examples 1 and 2.
- *Gap: word problems turned into a linear equation (§ 2.2)* — Type 3, an
  age problem and a coin problem (Examples 4 and 5).

**Wrong remarks found and fixed:** old Problem 1 said option (d), $10$,
*goes forward three steps instead of back two*; $7 + 3 \times 3 = 16$. It
is two steps back from $p(5)$ (Example 10). Old Problem 4 said option (a),
$15$, *adds $4$, the difference in $x$* and option (b), $16$, *adds the
slope only once*; neither matched its value. The options are now $14$,
$18$, $17$, $13$, each with a remark that produces it (Example 12).

**Worked examples in the chapter: 33** (16 body + 17 Beyond). Every topic has
a type: writing an expression and naming its parts; the value of a
polynomial; word problems to a linear equation; the $n$th term and which
term; a rule that holds on part of a table; growth and decay; $a$ and $b$
from two facts; points on a line; slope, intercept and crossings,
including a rearranged form; and two proofs (the constant difference is $a$;
equal slopes, different intercepts never meet).

**`ANSWERS.md` written** for Exercise Sets 2.1–2.6, the fourteen
end-of-chapter questions, all fifteen Think and Reflect boxes, Stage 1, and
all 32 practice questions.

### Verified

`check-numbers.mjs` passes **639 claims**. It evaluates 246 printed
identities (powers, fractions and function values included), checks every
equation in one unknown against the value the same block solves it to, and
tests any chain with letters left over as an identity at random values. It
also:
- re-derives each body example's Answer row and every table in the
  examples from the rule the example states;
- reads every exercise and Think and Reflect answer back off `ANSWERS.md`,
  including End Q6's two numbers by search;
- measures Figs 2.5–2.11, 2B.1, 2B.2 and 2B.4 from their coordinates: the
  tick labels sit at their values, every line is drawn on its printed
  equation, every labelled point sits where its label says and on its line
  (Fig. 2B.1's off-line point three units above it), and each plot label
  names its own line;
- counts the tiles of Figs 2.4 and 2B.3 and the hexagons of Fig. 2.12;
- re-derives each Beyond example's answer, and each option remark's value;
- checks every multiple-choice question has exactly one right option,
  matching the key, and derives each assertion–reason letter;
- reads the practice answers back out of the key rows a lettered part at a
  time, and checks that `ANSWERS.md`'s key and working agree with the page.

**Break tests: 23 of 23 caught** on the first run (body answers and table
cells, a figure's line end and a point label, Beyond steps and answers, an
option, key letters including an assertion–reason one, key rows and
lettered parts, Stage 1 values, a Fig. 2B.1 point, a tile removed from
Fig. 2B.3, and `ANSWERS.md` values, key and Think and Reflect).

**Fitting:** nothing is clipped; page 10 runs 1.3 mm and page 20 1.6 mm into
the bottom margin. `orphans` finds 0 stranded openers, `check-labels` finds
no collisions, and `fit-options` passes. Every question that names a figure
prints on the figure's page or facing it (the Think and Reflect on Fig. 2.8
is on page 21, facing the figure on page 20). I read the proofs of pages 1,
20, 22, 23, 24, 30, 38 and 41, and `check-colour` was run on pages 8,
17–20, 22–24, 30, 38 and 41: every line in a multi-line graph carries its
own label, so no line is told apart by colour alone.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 11 | 75% | the § 2.4 head, which needs its paragraphs under it |
| 15 | 79% | the Exercise Set 2.5 band with its first question |
| 16 | 59% | Fig. 2.5 |
| 17 | 85% | Example 12, a panel with its figure |
| 19 | 66% | Example 14, a panel with its figure |
| 21 | 60% | Example 15, a panel with its figure |
| 28 | 60% | the last body page (`data-close`) |
| 32–37 | 63–76% | a `Type` head with its example, or an example panel |
| 43 | 64% | **the Answers stage, which always opens a page** |
| 44 | 77% | the *Why the other options are wrong* head with its rows |
| 45 | 52% | the last page |

### Flagged, not done

- **Exercise Set 2.3 Q1** asks for the amount *at the end of each month
  from the second onwards*; the phrase is unclear. `ANSWERS.md` gives
  $500 + 150n$ for every month and says so.
- **The language edit's flags below still stand** (function notation never
  introduced; *the chapter on linear equations* does not exist in this book;
  *Sequences and Progressions* is called *What Comes Next*; the Class 8
  definitions of *degree*), except the graphs' alt text, now done.
- Practice Q16 (the candles) and Q28 (phone plans) set two linear
  expressions equal; the body does this only with one expression and a
  number (Example 6). Kept: it is one linear equation in one unknown.
- Stage 1 still carries the section's *Notice that …* sentences, which §10
  counts as coaching; kept word for word, as the brief requires.

Language edit, 41 pages (p001–p029 chapter proper, p101–p112 Beyond the Book) —
the longest chapter in the book so far. Build after editing: 41 pages, all pages
fit, 0 stranded openers, no label collisions, every option row fits. Every
worked value re-derived, including Example 11's telecom rule ($a = 20$,
$b = 150$), the Kelvin–Fahrenheit conversion in Q8, and the bridge's
$p(2) = 7$, $p(5) = 16 \Rightarrow p(0) = 1$.

8 fixes in 41 pages. The writing is excellent and the chapter's argument is the
best-organised in the book: it does not present $ax + b$ as a thing to
manipulate, it asks **why degree 1 deserves a chapter** and answers on p005 —
"degree $1$ is where several separate things coincide, and they stop coinciding
immediately afterwards." A linear polynomial steps by a constant, its graph is
straight, and two points determine it; none of the three is true of $x^2$. Then
every section pays that off, and p021 closes the loop by showing the constant
difference of a *list* and the steepness of a *picture* are the same number.

Two other things worth recording:

- **It names what it leaves loose.** p028 lists four threads — the equation in
  two unknowns, the measurement of slope, the $n$th term, and the even-handed
  form $ax + by + c$ that reaches vertical lines — and says which later chapter
  takes each. Then the closing paragraph gives the general claim: a polynomial
  of degree $n$ is fixed by $n+1$ observations, "and degree $1$ is simply the
  cheapest case there is."
- **p016 insists on the right word.** Two measurements determine $a$ and $b$
  only if they are *independent*: "Two readings taken at the same value of $x$
  say the same thing twice and settle nothing, however carefully they were
  measured."

## FIXED

| before | after | check |
|---|---|---|
| **p006** "so tabulate it" | "so make a table of it" | L1 |
| **p013** "Tabulate the cost as $d$ runs from $0$ to $5$" | "Make a table of the cost as…" | L1 |
| **p014** "Tabulate it." | "Make a table of it." | L1 |
| **p014** "Tabulate the height for $t$ from $0$ to $10$ months" | "Make a table of the height…" | L1 |
| **p015** "Tabulate its value…", "Tabulate the population…", "Tabulate the balance…" | "Make a table of…" ×3 | L1 |
| **p027** "Tabulate the number of matchsticks" | "Make a table of the number of matchsticks" | L1 |

All eight are the same word. *Tabulate* was removed from Class 8 Part I
Chapter 2's Beyond the Book for the same reason; this chapter uses it six times
as an instruction inside exercise questions, which is where it does most harm.

**Considered and left: "satisfy".** p016 has "a pair of values that must satisfy
the relation" and p018 has "coordinates satisfying $y = 2x + 1$". I changed the
first to *fit* and reverted it, for two reasons that reinforce each other: the
plain version dropped a rendered line and took p016 from 89% to 86% full, and
*satisfies an equation* is the standard term this reader will meet in every
exam paper from here on. It is the topic's own vocabulary, used consistently in
all three places, and it stays. (In Class 8 I did replace *satisfy* — but there
it appeared in bare instructions like "Check both answers satisfy
$a^2+b^2=c^2$", not in prose defining what a point on a line is.)

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p018, p019, p020, p021, p022, p023, p024 | C4 | **Seven graphs are invisible to a blind reader.** Every figure in § 2.6 carries `aria-label="2.5"`, `"2.6"`, … `"2.11"` — the figure number and nothing else. A screen reader announces "two point five". Every other figure in the chapter has a real description ("A rectangular garden, $w$ metres wide and $l$ metres long", "Three stages of a growing pattern of hexagons made from matchsticks"), so the fault is confined to the seven graphs — which are exactly the figures where the description carries the teaching. **Chapter 1 of this same book is built around Reiaan, who cannot see**, and asks the reader whether their school's doors admit a wheelchair. | Seven alt texts. The captions already say most of what is needed: "The graphs of $y = \frac12 x$, $y = x$ and $y = 2x$. Every one passes through the origin, and the larger $a$ is, the steeper the line." |
| p013 onwards, and p026–p027 | M1 | **Function notation is never introduced.** § 2.2 defines *function* in words — "feed it a number, and it hands one back" — and never shows how one is written. Then $C(d) = 100 + 60d$ appears on p013, $h(t)$ on p014, $b(x)$ on p015, and the last five end-of-chapter questions are built on $p(x)$, $q(x)$ and $f(x)$, including Q11's three conditions on $p(0)$, $p(x) - q(x)$ and $p(x) + q(x)$. A reader who has not met the bracket notation will read $p(x)$ as $p$ times $x$ — and in a chapter about coefficients that is a very easy mistake to make. | One short paragraph where *function* is defined, saying that $f(x)$ names the output for input $x$ and is not a multiplication. Everything else is already in place. |
| p021, p028 | C5 | "Slope is taken up properly in **the chapter on linear equations**", and again on p028, "The chapter on linear equations does." **There is no such chapter in this book.** Class 9 runs: coordinates, linear polynomials, world of numbers, algebraic identities, circles, lines and angles, probability, sequences. | Either name the real destination (Class 10, if that is what is meant) or drop the forward reference. Two readers in three will go looking. |
| p012, p028 | C5 | "Sequences of this kind are taken further in **the chapter on Sequences and Progressions**", and p028 "**Sequences and Progressions** takes that constant difference as the defining property". The chapter exists — it is Class 9 Chapter 8 — but it is called **What Comes Next**. A reader scanning the contents page for "Sequences and Progressions" will not find it. | Use the chapter's own title, or its number. |
| p002–p004 vs Class 8 Part I Ch 4 | C3 | *Terms*, *variables*, *coefficients*, *constant*, *polynomial* and *degree* are all defined here from scratch, and all six were defined in Class 8 Part I Chapter 4. The chapter opens "You have met algebraic expressions before" without saying where. Worse, *degree* now means two things: Class 8 defined it as the **sum** of the powers in a term (so $5x^2y$ has degree 3), while this chapter defines it as the **highest power** of the single variable. For univariate polynomials the two agree, and this chapter restricts itself to one variable — but nothing says so, and a reader who remembers the Class 8 rule will apply it. | Name Class 8 Chapter 4, and say that the definition is being narrowed because the chapter is about one variable. Two sentences. |


## 21 September 2026 — figure/table reference review

Reviewed this chapter in the all-maths reference audit. Figures and tables now use one chapter sequence, including Beyond the Book; captions and references were updated together. Questions, calculations and artwork were preserved. The chapter and its volume were rebuilt; detailed layout checks and any remaining warnings are recorded in build/_all-maths-reference-checks/.
