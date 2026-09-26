# Converting a maths chapter to maths-v2

The recipe, taken from Class 6 Chapter 1 (`pages/class-6/math-ch01-patterns`,
finished 26 September 2026). That chapter **is the model**: when this file and
the model disagree, open the model's pages and match them. Read first:
CLAUDE.md, DESIGN-MATHS §6a, and BY-THE-BOOK.md in full.

The design itself — colours, corners, header and footer, the opener, every
component's look — lives in `css/maths-v2.css` and `css/palette-prism.css`
and comes free with the settings in step 1. **A conversion changes page
sources and chapter files only.**

---

## Never

* Edit anything shared: `css/`, `build/`, CLAUDE.md, DESIGN-MATHS.md,
  BY-THE-BOOK.md, this file, or any other chapter. If the chapter needs
  something the design lacks, **stop and report it** — do not work round it
  with an inline style or a new class.
* Change NCERT's body: its sections, teaching order, examples and exercise
  questions stay (you may reword for plain English, and you may cut questions
  that an earlier redesign *added*, never NCERT's own).
* Commit, push, or create PDFs in the repo.
* Interrupt a refit (it deletes pages before it writes them).
* Add a tagline, strap, rubric or "how to answer" line under any head
  (the one exception is the assertion–reason key).
* Leave a word alone on the last line of anything.
* Use green, brown, side-bar callouts, pills or shadows. Every box already
  takes the design's one radius.

---

## 1. Settings — `chapter.json`

```json
"design": "maths-v2",
"palette": "prism-<name>",
"edition": "196x276-large",
"keepExerciseSets": true,
"accent": "<the palette's --teal>"
```

Each chapter has its own palette (CLAUDE.md, "Each maths-v2 chapter has
its own colour"). Class 6 uses indigo, rose, petrol, plum, steel, claret,
dusk, mauve, slate and heather for Chapters 1–10. A new class gets its own
set computed the same way — one OKLCH lightness and low chroma, only the
hue moving, no green or brown — never hand-picked hexes; each file copies
`palette-prism-indigo.css` and changes only the `--teal` family.

Keep `class`, `number`, `title`, `subject`, `startFolio`. The larger edition
re-breaks every page, so the body is refit in step 6.

## 2. The chapter body (p001 …)

* NCERT's structure, in plain English (short sentences, no idiom).
* **Every section has a key idea and a Think and Reflect.** Copy the markup
  from the model (p007 has both). A key idea is `.c-keyidea` with a
  `.c-keyidea__title` and either one `<p>` or a `ul.c-keyidea__points` of two
  one-line points. Think and Reflect keeps its `.c-reflect__icon` svg.
* **No exercise set may split across a page.** `keepExerciseSets` keeps each
  whole; if one is too long for any page, shorten wording or drop a question
  added by an earlier redesign (check EDIT-LOG.md), never NCERT's.
* **The chapter ends on a Summary page**: its own file after the last body
  page, carrying `data-close`, one `.c-summary` with a `.c-summary__title`
  "Summary" and an `<ol>` of 6–10 points, key terms in `<strong>`. Follow
  NCERT's own summary points, in our words, with a small example where it
  helps. Model: p013.

## 3. By the Book (p090 …, `data-board`)

Exactly as BY-THE-BOOK.md says, at this class's level (§4 of that file).
Mechanics, from the model's p090–p094:

* Opens with `.c-bridge` "By the Book". No "Practice questions" head.
* 50 questions, one numbered run, in this order and count: Very short answer
  10 · Short answer 10 · Long answer 10 · Assertion and reason 5 ·
  Case-based questions 5 · Objective questions 10.
* Each form opens with a `.c-practice__sub` inside the first block of the
  form. **No note line under it**, except the assertion–reason key, word for
  word as in the model.
* One question per `.c-practice` block; the first block of the division has
  no `data-start`, every later block `data-start="n"`.
* Case-based: passage and "Based on the above information, answer the
  following questions." inside `.c-case`; three parts in `.c-parts c-parts--1`
  (they number (i) (ii) (iii)).
* Objective: four options in `.c-parts c-parts--alpha c-parts--4` when they
  fit on one line; long options two across (`c-parts--alpha` alone).
* Reuse the chapter's existing board-form questions where they meet the
  guide; rewrite or replace the rest. Long answers are one modelled problem,
  never an (a)–(d) investigation. Spread assertion–reason and objective
  answers across (a)–(d).
* Aim for **five full pages**; the last page carries `data-close`.

## 4. Beyond the Book (p101 …, `data-bridge`)

From the model's p101–p110:

* Opens with `.c-bridge` "Beyond the Book", then the tried-and-explained
  questions (the old "Using What You Know") with **no stage head**, kept
  word for word.
* Then five parts, in order: Single correct · More than one correct ·
  Numerical answer · Matching · Paragraph-based. Each part is a standalone
  `<div class="c-practice__sub">…</div>` followed by **two solved examples**
  and then **its practice questions** (4 · 4 · 3 · 2 · 2 — fifteen, numbered
  1–15 through the division).
* Example tabs read "Example N" only. No "Choose one correct option" or
  similar line inside an example. Each example keeps Solution / Step rows /
  Answer; a Check row where it helps.
* From the chapter's existing 15 examples keep the best two single correct,
  two more than one correct, two numerical and two matching; **write two
  paragraph-based examples** (a passage in `.c-case`, then two or three parts
  in `.c-parts c-parts--1`, at least one with options and one numerical).
* The practice questions are **new**, in competitive formats (the chapter's
  old practice set was board forms; it has become By the Book).
* **Answers** stage: `.c-stage` with a `.c-stage__title` "Answers" and **no
  `.c-stage__num`**. Then `.c-practice__sub` "By the Book" and its key, then
  `.c-practice__sub` "Beyond the Book" and its key. Letters in `.c-answers`
  rows; worked answers in `.work.work--trace` blocks of **two rows each**.
  Model: the Answers pages at the end of p101–p110.

## 5. ANSWERS.md and EDIT-LOG.md

* ANSWERS.md: replace its end-of-chapter sections with "## By the Book"
  (all 50) and "## Beyond the Book" (tried and explained, the examples'
  keys, the practice keys) — the model's ANSWERS.md shows the shape. Update
  any exercise answers you renumbered.
* EDIT-LOG.md: a new top section "The maths-v2 conversion, <date>" saying
  what changed and what the checks returned.

## 6. Fit

```bash
node build/refit.mjs class-6/<chapter> body
node build/refit.mjs class-6/<chapter> board
node build/refit.mjs class-6/<chapter> bridge
node build/build.mjs class-6/<chapter>
```

* Every page ≥ 88% full except pages allowed to end short (the Summary and
  By the Book's last page, both `data-close`, and the chapter's last page).
* `node build/gaps.mjs class-6/<chapter>` names what holds a short page
  open. Close gaps by **editing wording at the join**, or by adding teaching
  that belongs there (a Check row, a third part to a paragraph-based
  example) — never padding, never dividing a panel.
* A page that runs into the margin after a refit: `node build/settle.mjs
  pages/class-6/<chapter> <n>`, then build.
* Build with `--png` only when you need to look at a page.

## 7. Checks — all must pass before you report

```bash
node build/build.mjs class-6/<chapter>            # "all pages fit", no "!"
node build/lone-words.mjs class-6/<chapter>       # 0 lone-word lines
node build/check-sums.mjs class-6/<chapter>       # 0 wrong
node build/orphans.mjs class-6/<chapter>          # 0 stranded
node build/check-labels.mjs class-6/<chapter>     # no labels collide
node build/fit-options.mjs class-6/<chapter>      # every option row fits
```

Also check by reading: every By the Book and Beyond answer is in the key and
is right (recompute every numerical answer and every single-correct option);
no exercise set is split across a page; the chapter's own
`check-numbers.mjs`, if it has one, either passes or is noted in EDIT-LOG as
out of date.

## 8. Report

* The fill map from the last build, and the output of every check.
* Page counts: body, By the Book, Beyond.
* Anything that needs a shared change (design, tool), with the page it
  affects — do not make it yourself.
* Any NCERT content you were unsure about keeping or rewording.
