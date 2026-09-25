# Class 9 · Mathematics I · Chapter 4 — Exploring Algebraic Identities

## Solved examples in examination formats, 23 September 2026

Stage 2 of Beyond the Book is now 15 solved examples in the order 6 single
correct, 4 multiple correct, 3 numerical answer and 2 matching, under the
contract in DESIGN-MATHS §6a. **This supersedes every description of Stage 2
further down this log**: the 18 examples it records, their `Type N` heads
and the reasons set in `.work__why` are gone. Stage 1, the practice
questions and the practice answers are unchanged, and are checked word for
word against the pre-edit snapshot in `build/_jee-backups/class-9/ch04-algebraic-identities/`.

Source `build/jee-class9.mjs`; check `build/check-jee-class9.mjs`,
which recomputes every option as well as the keyed one. The division was
refit and now runs p101–p112; the answers stage still opens a fresh page.

Also, same day. Fig. 4.11 belonged to the old examples; the practice figure after it, Fig. 4.12, became Fig. 4.11 (page and snapshot).

| Example | Format | Answer |
|---:|---|---|
| 1 | Single correct | (a) 23 |
| 2 | Single correct | (b) $(x - 7)(x + 5)$ |
| 3 | Single correct | (c) 27 |
| 4 | Single correct | (d) 16380 |
| 5 | Single correct | (a) 992016 |
| 6 | Single correct | (b) 60 |
| 7 | Multiple correct | (a), (b) |
| 8 | Multiple correct | (a), (b), (c) |
| 9 | Multiple correct | (a), (b), (d) |
| 10 | Multiple correct | (a), (b) |
| 11 | Numerical answer | 994011992 |
| 12 | Numerical answer | 13 |
| 13 | Numerical answer | 91 |
| 14 | Matching | (a) P–3, Q–4, R–1, S–2 |
| 15 | Matching | (d) P–4, Q–1, R–2, S–3 |


## Brought to the Class 7 standard, 17 September 2026

Phase 5 of `PLAN-MATHS-CONSISTENCY.md`, worked from the Class 9 brief with
Chapter 6 as the model. Page move, examples, Beyond the Book and answers were
done in one pass, and every check was run on the chapter.

**Pages: 43 before (31 body + 12 Beyond, Crown Quarto), 47 after (30 body +
17 Beyond, 196 × 276).**

### What changed

**The page.** `chapter.json` gains `"edition": "196x276"`, and the body was
refitted once.

**All seventeen body examples set as steps** (Examples 1–7 and 9–18; see
*Flagged* for the missing Example 8). Each is now *Solution*, Steps and
*Answer*, with a *Check* row where the old text checked the answer (Examples
14, 17, 18). Lead-ins that frame the problem stay as a paragraph before
*Solution* (Examples 7, 13, 17).
- Examples 1 and 2 are demonstrations whose rows ended in a result `.chip`.
  The chips stay chips — they mark a value, not a reason — inside the Step
  rows, and the old row labels (*from $\{1, 4, 9\}$:*, and the two sides of
  the identity) became `.work__why`.
- Example 12 never writes the factorised form; its *Answer* is the pair
  $-2$ and $-3$, as the text had it (flagged).
- The body had no reason chips: its seven chips are all results, so none
  changed class.

**Verified** by `build/check-body-maths.mjs`: 484 expressions and 112
numbers compared. It reports one change, `4.7` lost once, which is the repair
below and nothing else; before that repair it reported *no mathematics lost
or added*.

**Two repairs in the body.**
- **p015 printed the "What Fig. 4.7 shows" summary twice**, with the
  sentence *Factorising is the … hard one* cut in half around the second
  copy (a leftover of an old panel split). The duplicate is gone and the
  sentence is whole again.
- **Fig. 4.9 restored.** The text says *Fig. 4.9 shows those cuts on the
  three visible faces*, but the figure was dropped in commit 8df6880
  ("Finish the merge"). The cube is back from 89124da, geometry unchanged
  (cuts at $a : b = 100 : 60$ from the front bottom-left corner on all three
  faces, checked by `check-numbers.mjs`), without its old key and Think and
  Reflect, which the prose paragraph now replaces. Its two depth labels sat
  on the cut lines and were moved to the bottom-right edge with a tick.

**Beyond the Book rebuilt to the four stages:**

| stage | before | after |
|---|---|---|
| 1 Using What You Know | 5 `.c-try`, each explained in running text | Q3 kept word for word; **Q1 replaced**, Q2, Q4 and Q5 corrected (below); opening and closing paragraphs updated; `.c-stage__for` removed |
| 2 Behind Each Answer → **Solved Examples** | 5 multiple-choice problems | **18 stepped examples** under eleven `Type` heads; old Problems 1, 2, 3, 5 are Examples 13, 7, 6, 18; old Problem 4 was removed |
| 3 Problem Sets → **Practice** | 3 sets, 25 questions | **one run of 33** in six forms (17 multiple choice, 4 assertion–reason, 3 very short, 4 short, 3 long, 2 case-based) |
| 4 Answers & Takeaways → **Answers** | key, three worked rows, three takeaways | key, every other answer, why the options are wrong for ten |

**Stage 1.**
- **Q1 replaced.** *If $x + y + z = 0$, find $x^3 + y^3 + z^3 - 3xyz$* is
  the case the body states on p023, and its explanation is the method End
  Q13 asks for. Now: *if $a + b + c = 0$, show $a^2 - bc = b^2 - ca$*, the
  same kind (a condition used directly inside an identity), explained in the
  same voice.
- **Q2 corrected (audit).** *$a + b = 5$, $ab = 7$, no whole numbers, still
  $a^2 + b^2 = 11$*: those numbers have no real solutions at all
  ($(a - b)^2 = -3$). Now $ab = 5$, which has real, non-whole solutions, and
  $a^2 + b^2 = 15$.
- **Q4 corrected (give-away).** It proved $x^2 + 5x + 6 = (x + 2)(x + 3)$,
  the product the p015 Think and Reflect asks for. Now
  $x^2 + 7x + 10 = (x + 2)(x + 5)$, with $18$ in place of $12$.
- **Q5 corrected (audit, borderline).** The inequality
  $a^2 + b^2 \geq 2ab$, the $a + \tfrac{1}{a} \geq 2$ paragraph and its
  figure (old Fig. 4B.3) are gone; the rectangle question stays, settled by
  $(x - y)^2 = -1$ as before.
- The opening said *eight identities*; the chapter's summary has eleven.
  Now *eleven*.
- Figures renumbered in order: old Fig. 4B.2 is **Fig. 4B.1** (there was no
  4B.1); old 4B.4 (the rectangle) is **Fig. 4B.2**, inside Example 6; old
  4B.6 (the field) is **Fig. 4B.3**; old 4B.5 (the number line) went with
  old Problem 4.

**Audit fixes** (the Class 9 Beyond audit, Ch04 table):
- **Set B Q8, rationalising $2 + \sqrt{3}$ (off-syllabus):** replaced by
  practice Q13, *$x + \tfrac{1}{x} = 4$, find $x^3 + \tfrac{1}{x^3}$*.
- **Set A Q9, $p + q = 10$, $p^3 + q^3 = 100$ (no real $p$, $q$):** now
  $p^3 + q^3 = 370$, so $pq = 21$ and the numbers are $3$ and $7$
  (practice Q7).
- **Stage 1 Q2 (no real solutions)** and **Stage 1 Q5 (inequality)**: above.
- **Set C Q1, $x^3 + y^3 + z^3 - 3xyz \geq 0$ (borderline):** replaced by a
  value question with a zero sum, practice Q14 ($x - y - z = 0$).
- **Problem 4's paragraph on products of $k$ consecutive numbers
  (borderline):** cut with the problem. Set C Q5 ($n^5 - n$), which leaned on
  it and on End Q12's answer, went too.
- **Coverage gaps:** splitting the middle term (Example 9, practice Q25),
  recognising $(a \pm b)^3$ (Example 11, Q28), simplifying rational
  expressions (Example 15, Q27), solving by factorising (Example 16, Q30)
  now each have a type.

**Other give-aways fixed.**
- **Old Problem 4 was End-of-Chapter Q12's answer** ($n^3 - n$ is a multiple
  of $6$). Removed; Example 17 (four consecutive numbers, plus 1, make a
  square) is the proof type instead.
- **Set B Q6** (solving $(x - 12)(x + 8) = 5$ factor by factor) is answered
  by p028's own paragraph. Removed.
- **Set B Q3** printed $(x + 2)(x + 3) = x^2 + 5x + 6$, the p015 Think and
  Reflect's answer. Now $(x + 2)(x + 5)$ (practice Q8).
- **Set B Q4** repeated Stage 1 Q2 with the same numbers. Now $a + b = 7$,
  $ab = 12$ with a false third statement (practice Q9).
- Set A Q10 (*differ by $4$, squares differ by $96$*) echoed Example 18's
  pool; removed.
- Old Fig. 4B.6's caption printed *the part left is $a^2 - b^2$*, which is
  the working of its own question. The caption now only describes the field.

`check-no-repeats` finds no Beyond question close to a body one. Every value
Beyond prints was read against the body's exercise lists by hand.

**Worked examples in the chapter: 35** (17 body + 18 Beyond). Types: squares
of sums and differences; the square of three terms; the difference of
squares; values without finding the letters; factorising by sum and
product; cubes of sums and differences; sums and differences of cubes;
three cubes; rational expressions; solving by factorising; proofs.

**`ANSWERS.md` written** for Exercise Sets 4.1–4.5, the thirteen
end-of-chapter questions, all fourteen Think and Reflect boxes, the running
text's one question, Stage 1, and all 33 practice questions.

### Verified

`check-numbers.mjs` passes **1,013 claims**. It evaluates 563 printed
statements, with a small LaTeX evaluator over complex numbers: arithmetic
directly; a statement with letters as an identity at three sets of random
values, or at the value its block solves a letter to, or under numbers that
satisfy the block's given conditions (each set of numbers is checked against
its conditions first). The statements printed in order to be false
(Stage 1's $(a + b)^3 = a^3 + b^3$, the practice options and reasons that are
wrong, Exercise Set 4.3 Q4) must not be identities. It also:
- re-derives each body and Beyond example's Answer row, the sum-and-product
  pairs by search, and $n^4 + 4$'s primes up to $n = 300$;
- checks that every exercise part printed on the page appears, with its
  answer, in `ANSWERS.md` — so the algebra of each answer is evaluated as an
  identity — and reads the numeric answers back;
- measures Figs 4.2, 4.6, 4.7, 4.8, 4.9, 4.11, 4B.2 and 4B.3 from their
  coordinates (tile counts, sides, the cut ratio);
- checks every multiple-choice question has exactly one right option,
  matching the key, and derives each assertion–reason letter;
- checks that `ANSWERS.md`'s key and practice working agree with the page.

**Break tests: 27 of 27 caught** (body and Beyond answers and steps, Stage 1
values, key letters, key rows and a lettered part, two options, the Q11
table, `ANSWERS.md` values, a factorised answer, the key, three figure
coordinates). The first run missed two: body Example 18's length and
Example 11's pair were looked for anywhere in the panel, where other numbers
matched; both are now checked as a phrase in their own row.

**Fitting:** nothing is clipped and nothing runs into the margin. `orphans`
finds 0 stranded openers, `check-labels` finds no collisions, `fit-options`
passes. Practice Q32 was settled onto the page with Q33 so that no page holds
one lone question. Example 13 of the first draft ($\frac{53^3 + 47^3}{\ldots}$)
was dropped because it held page 38 open; its type keeps Example 12. I read
the proofs of pages 1, 20, 31–33, 38, 44–46. `check-colour` was run on
pages 2, 9, 11, 13, 14, 16, 20, 26, 32, 35 and 44: every fill in the figures
is paired with a label or a key.

### Short pages, logged

| page | fill | held by |
|---|---|---|
| 4, 7, 24 | 86%, 78%, 74% | an exercise band too tall for the gap |
| 6, 9, 13, 25 | 62–87% | a heading with its matter (§4.4, §4.5, §4.9 heads and *Back to the pattern*) |
| 11 | 79% | Śhrīdharāchārya's key idea, a panel |
| 12, 15 | 77%, 83% | Figs 4.6 and 4.8 |
| 14 | 83% | the *What Fig. 4.7 shows* summary |
| 17, 23 | 83% | Examples 11 and 16, panels |
| 27 | 86% | a Think and Reflect, a panel |
| 29 | 82% | the chapter summary |
| 30 | 73% | the last body page (`data-close`) |
| 32 | 80% | the Solved Examples stage head, which needs its first example |
| 33, 34, 39 | 68–73% | a `Type` head with its example |
| 36, 38, 40 | 77–81% | an example panel |
| 44 | 59% | Q32 settled forward, so Q33 is not alone before Answers |
| 45 | 76% | **the Answers stage, which always opens a page** |
| 46 | 72% | *Why the other options are wrong*, heading and rows |
| 47 | 63% | the last page |

### Flagged, not done

- **There is no Example 8.** The body runs Example 7, then Example 9, and
  git history has never had one. Renumbering is a body edit.
- **Figure numbers skip 4.3 and 4.10.** Fig. 4.10 (the eight pieces of the
  cube) was lost with Fig. 4.9 in 8df6880; the prose that replaced it reads
  well without it, so it was not restored.
- **Body Example 15 describes no real numbers.** Three real numbers with sum
  $10$ and $xy + yz + zx = 31$ cannot have product $25$ (the cubic
  $t^3 - 10t^2 + 31t - 25$ has one real root). The algebra and the $145$ are
  right; `check-numbers.mjs` verifies them with complex roots.
- **End-of-Chapter Q11 describes no real numbers** either: $a + b + c = 5$
  and $ab + bc + ca = 10$ force
  $(a - b)^2 + (b - c)^2 + (c - a)^2 = -10$. Answered as intended and
  flagged in `ANSWERS.md`. Both are the kind of item the audit asked to fix
  in Beyond; in the body they need a decision.
- **Body Example 12 stops at the pair $-2$ and $-3$** and never writes
  $x^2 - 5x + 6 = (x - 2)(x - 3)$. Adding it would add mathematics to the
  body.
- **End Q6 (i), $6a^2 - 24b^2$ as a volume**, is of degree 2, so one
  dimension has to be a plain number; `ANSWERS.md` says so.
- Stage 1 Q5 and Example 6 use Pythagoras, which this chapter does not
  teach (it is earlier-class knowledge).
- The body's value chips (Examples 1 and 2, p004) are kept as chips.

Language edit, 43 pages (p001–p031 chapter proper, p101–p112 Beyond the Book).
Build after editing: 43 pages, all pages fit, 0 stranded openers, no label
collisions, every option row fits. Every worked result re-derived, including
Example 15 (three numbers with sum 10, product 25, squares summing to 38 → cubes
sum to 145 — correct, via $xy+yz+zx = 31$), Example 16's cancellation, and
Śhrīdharāchārya's $55^2 = 60 \times 50 + 25$.

3 fixes in 43 pages. The mathematics is strong and the chapter's method is
consistent: no identity is ever announced. The first is read off an area
picture, the second comes from replacing $b$ with $-b$, the third from grouping
two terms into one, the fourth from multiplying the second by $(a+b)$ — and p010
says so explicitly: "Neither needed a fresh argument — and the identities still
to come are built the same way, from the ones you already have."

Three things worth recording:

- **It states the limits of its own picture.** p003, immediately after deriving
  $(a+b)^2$ from a square: "look at what that argument used: a picture of
  *lengths*. Every quantity in it had to be positive — you cannot draw a square
  whose side is $-2$ units. So the drawing proves the identity for positive $a$
  and $b$, and nothing more." Then it tests negatives and rationals, says "two
  successes prove nothing", and multiplies the bracket out.
- **p013 separates an illustration from a proof** in as many words: a
  drawn-to-scale figure "shows one case … a reader who measures the squares has
  checked exactly that case. What makes it a proof is the argument that the
  drawing is forced."
- **It says when a search legitimately fails.** p017: "It does not mean you have
  made a mistake; it means the quadratic does not factorise over the whole
  numbers, and plenty do not. $x^2 + x + 1$ is one. Knowing that a search can
  honestly come up empty is part of knowing how to conduct it."

## FIXED

| before | after | check |
|---|---|---|
| **p007** "The second identity earns its keep the same way the first did." | "The second identity does its work the same way the first did." | L1 — idiom; removed from four chapters now |
| **p013** "cannot be drawn to arbitrary sizes" | "cannot be drawn to any size you like" | L1 |
| **p023** "That identity looks forbidding, but it earns its keep." | "That identity looks worse than it is, but it is worth having." | L1, L2 — two hard words in one short sentence |

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| **p015** | C4 | **A summary box is printed twice, and the duplicate cuts a sentence in half.** The box "What Fig. 4.7 shows" appears at lines 5–18 and again, word for word, at lines 23–34. Between them the prose reads "Multiplying out is the easy direction: you always can. **Factorising is the**" — and the sentence resumes *after* the second box with "**hard one, because you are being asked to find** the two numbers that fit". So a reader meets a broken sentence, a repeated box, and then the other half of the sentence. This is the worst production fault I have found in the book. I have **not** fixed it, for one reason worth knowing before you do: page 15 currently builds at 94% fill, so deleting the duplicate box will leave it around 70% and the chapter body will need a refit. That is a layout decision, not a language one. | Delete the **second** box (lines 23–34) — that rejoins the sentence and leaves the first box where it reads correctly — then `node build/refit.mjs class-9/ch04-algebraic-identities body`. I checked the rest of the chapter for the same fault: p015 is the only page with a duplicated block. |
| p008 → p009 | C3 | **A generalisation arrives before the thing it generalises.** p008 derives $(a+b+c)^2$ purely algebraically, by grouping $d = b+c$ — no picture, no construction. p009 then opens: "**The same construction** works for any number of letters. Cut a square of side $a+b+c+d$ at three places along each edge and sixteen pieces come out…" There has been no construction. The three-letter picture (Fig. 4.4, nine pieces) is introduced two paragraphs *later*, as "The picture behind it is the one from Section 4.2, grown by a term." | Move the nine-piece paragraph and Fig. 4.4 above the sixteen-piece one. Then "the same construction" has something to refer to, and the order runs two letters → three → any number. |
| p002, p011 | C3 | "You already know several identities from **earlier grades**" (p002) and "In **Grade 8** you met one more identity" (p011). The Class 8 volumes say *Class*. This is the second Class 9 chapter with the same slip — Chapter 1 has Grade 8, 9 and 10 in four places. | One word, book-wide. *Class* is the Indian usage and what the earlier volumes already use. See CROSS-CHAPTER.md. |
| p011 vs Class 8 Part I Ch 4 | C3 | p011 says the difference of squares is the identity "you met in Grade 8", which is right — Class 8 Part I Chapter 4 § 4.6.3 derives it by cutting a corner from a square and rearranging the L-shape. But Class 8 taught **three** identities in that chapter ($(a+b)^2$, $(a-b)^2$, $a^2-b^2$), and this chapter re-derives the first two from scratch while crediting only the third to Class 8. | Say which of the four are revision and which are new. The chapter's own method — build each identity from the one before — makes that easy to state in a sentence. |
| p012 | M5 | Śhrīdharāchārya's squaring method is dated "750 CE" in the key-idea title and the method is given correctly, but no source is named for it, unlike every other attribution in the chapter (Baudhāyana's Śulbasūtra, Āryabhaṭa's *āsanna*, Mādhava's series are all placed in a text elsewhere in this book). | A text or a treatise, as the other attributions have. As it stands a reader cannot follow it up, and the date is doing the work a citation should. |


## 21 September 2026 — figure/table reference review

Reviewed this chapter in the all-maths reference audit. Figures and tables now use one chapter sequence, including Beyond the Book; captions and references were updated together. Questions, calculations and artwork were preserved. The chapter and its volume were rebuilt; detailed layout checks and any remaining warnings are recorded in build/_all-maths-reference-checks/.
