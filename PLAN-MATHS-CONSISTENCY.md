# Bringing every maths class to one standard

Written 16 September 2026, after Class 7 was finished. **Class 7 is the
standard**; Classes 6, 8, 9 and 10 are to match it, so that nothing is in one
book and missing from another. This file is the plan of work. Start it by
saying which phase to begin.

**Phase 1 (Class 6) was done on 16 September 2026** — see *Phase 1, as it
went* at the end. Class 6 now matches Class 7 and goes one step further:
every chapter has its `ANSWERS.md` and a `check-numbers.mjs` beside it,
which Class 7 does not yet have.

The rules themselves are not repeated here — they are in `DESIGN-MATHS.md`
§5a (the bar a finished chapter clears), §5 (*The companions*), §6a's opening
block (the Beyond the Book shape), and §10 (language). Read those first.

## 1. Where each class stands

| class | chapters | page | Beyond the Book | examples in the chapters | answers |
|---|---|---|---|---|---|
| **6** | **10** | **196 × 276 ✓** | **current ✓** | **stepped ✓** | **ANSWERS.md ✓** |
| **7** | **15** | **196 × 276 ✓** | **current ✓** | **82, stepped ✓** | **none** |
| **8** | **14** | **196 × 276 ✓** | **current ✓** | **103, stepped ✓** | **ANSWERS.md ✓** |
| **9** | **8 (NCERT Part 1)** | **196 × 276, 7 of 8** | **current, 7 of 8** | **stepped, 7 of 8** | **ANSWERS.md, 7 of 8** |
| 10 | 14 | Crown Quarto | old shape | 117, prose | none |

61 chapters in all; 46 to bring up, and about six to write from nothing.

## 2. What "consistent" means here

Every maths chapter, in every class:

1. sits on the **196 × 276 page**;
2. keeps **NCERT's own structure** in the chapter body — no examples, checks
   or exercises added inside it;
3. sets **every worked example as steps** — *Solution*, a step to a
   `.work__row`, *Answer*, the reason in a `.work__why`. Classes 6–8 left
   a question-only panel whose working is in the running text alone.
   **Decided 17 September 2026 for Class 10, where 113 of 117 examples are
   of that kind: they are stepped too.** The working moves into the panel,
   a remark that is not a step stays after it, and a proof is set one
   statement to a row. `build/check-body-maths.mjs` proves nothing was
   lost, where `check-example-stepping` cannot;
4. ends with **Beyond the Book in the four stages**: Using What You Know
   (kept word for word where one exists), Solved Examples by type, Practice
   (one numbered run, all six examination forms, band carrying the numeral),
   Answers;
5. has an **`ANSWERS.md`** beside its pages answering every question the
   chapter sets, which is the source for the volume's answers booklet;
6. has **every printed number re-derived by a script** kept with the chapter;
7. clears the **fitting limits**: nothing clipped, nothing more than 3 mm into
   the bottom margin, no stranded opener, short pages logged and not padded.

And every volume has its **front and back matter** (§5, *The book*).

## 3. Order of work

Cheapest first, so the method is proved before the expensive classes.

- **Phase 1 — Class 6** (10 chapters). Already on the right page, so this is
  conversion only. Proves the recipe on a second class. **It also carries the
  colour change**: Class 6 is the one class whose chapters declare no
  `palette`, so its `maths-clear` profile holds the three working colours the
  same in every chapter and gives the chapter's own colour only to the
  furniture — the numeral block, the rule under the opener, the running head
  and the folio bar. Every other class moves its working colours per chapter,
  and that is the way the series goes: **each Class 6 chapter declares a
  `palette` of its own**, as Classes 7–10 do. Colour does not change how text
  breaks, so this needs no refit — but it does need a proof, because a palette
  that was never seen on these pages can put a pale accent behind small type.
  The rest of `maths-clear` stays: ragged-right setting with no hyphenation,
  and the outline tip disc. Pick the ten palettes as a set, so that no two
  chapters of one volume sit next to each other in the same hue.
- **Phase 2 — the answers booklets**, Classes 6 and 7 first: write each
  chapter's `ANSWERS.md`, then set the booklet per volume.
- **Phase 3 — Class 8** (14 chapters, two volumes). First class to move page,
  so the page move and the conversion happen in one pass per chapter.
- **Phase 4 — Class 10** (14 chapters; split into two volumes on 17
  September 2026, Chapters 1–7 and 8–14, NCERT numbering kept). Same as Class 8. Examined class, so
  the model papers in phase 6 matter most here.
- **Phase 5 — Class 9**: convert the 8 chapters that exist. (The "missing ~6"
  are NCERT's unreleased Part 2 and are not written; see §9.)
- **Phase 6 — volume furniture** for all six volumes: contents, how to use the
  book, syllabus table, glossary and index, formula sheet, two model papers.
- **Phase 7 — bind, covers, cross-chapter notes**: re-measure every volume,
  set each cover's page count and spine, update `CROSS-CHAPTER.md`.

## 4. The recipe, per chapter

This is the sequence that worked for Class 7. One agent per chapter.

0. **Take the chapter whole.** Read every page of it before changing a line,
   and hold the whole lesson while you work: what it teaches, in what order,
   which example belongs to which topic, which figure a question depends on.
   The page files are pagination, not chapters — `p007.html` is where the
   chapter happened to break, and an edit judged from that one file is judged
   without its context. One agent owns one whole chapter, body and Beyond the
   Book, start to finish; never split a chapter across agents, and never work
   through it a page at a time. Every check at the end is run on the chapter,
   not on a page.
1. **Read** `CLAUDE.md`, `DESIGN-MATHS.md` §5a and §6a, and the nearest
   finished Class 7 chapter of the same kind (geometry, data, algebra) as the
   pattern.
2. **Page** (Classes 8, 9, 10 only): add `"edition": "196x276"` to
   `chapter.json`, then `refit.mjs <chapter> body`. No text changes.
3. **Examples**: set every body example as steps. Layout only — a script
   compares every number and maths span before and after, and re-derives the
   printed answers. A difference is a mistake to fix, never to log.
4. **Beyond the Book**: rebuild to the four stages, reusing what the old
   stages hold. Nothing may repeat a question or example the chapter sets:
   check phrase by phrase against the body.
5. **Answers**: write `ANSWERS.md` for every question the chapter sets, with
   the working, what a drawing must show, and a worked instance under an
   "answers will vary".
6. **Fit**: `refit … bridge`, build, then `orphans`, `fit-options`, `gaps`,
   `check-labels`. Refit once and read the fill line — **`refit` is not
   idempotent**, and a second run can pack worse.
7. **Log**: a dated section at the top of the chapter's `EDIT-LOG.md` saying
   what was done, what was verified, and what is flagged.
8. **Check before accepting** (do not trust the report): grep the chapter for
   `c-stage__for` (0), `c-case__label` (0), `c-practice__num` (1), stepped
   examples matching the example count, `data-bridge` on every `p1xx`,
   `data-close` on the last body page, and no page edited outside its scope.

## 5. Quality gates

- **Numbers.** No value is printed that a script has not re-derived. This is
  what makes the work delegable; three arithmetic errors shipped before it
  was the rule.
- **Figures and tables.** A question naming a figure uses the values printed
  on that figure. Three questions in Class 7 failed this and were caught by
  reading, not by a tool.
- **A question and its figure** print on the same page, or facing. Two got
  past everyone in Class 7 and were found by reading, not by a tool.
- **Colour is never the only carrier.** Check the chapter in greyscale and in
  a colour-vision simulation: a diagram's fills, a tinted mark and a coloured
  rule all have to survive both. Nothing in the pipeline checks this today.
- **Facts.** A *Did you know?* prints only with its source in `EDIT-LOG.md`.
  Class 7 still has about eight to check before press.
- **Language.** §10 throughout: plain explanation, exact rule, no coaching
  register.
- **The body is NCERT's.** If a change would move matter into or out of the
  chapter's own shape, stop and ask.

## 6. How it is run

- **Model:** Opus for every chapter — the user prefers the better output, and
  the judgement calls (panels that must be left alone, figure mismatches,
  when to stop fitting) are where a weaker model fails.
- **Concurrency:** four agents at a time. Each build starts a headless
  Chrome; the machine has had about 3 GB free.
- **Scope per agent:** one chapter, its own files only. Never `css/`,
  `build/*.mjs`, the design docs, covers, or another chapter.
- **Between waves:** check each finished chapter with the greps in §4.8, then
  start the next.
- **Commits:** one per class, at the end, after the class binds clean. Never
  commit the user's Science work; never commit a PDF.

## 7. Known traps

- **Backslashes are eaten** through a shell string: write files containing
  LaTeX with the Write tool, and put node scripts in a file rather than
  passing them with `-e`.
- **`refit` is not idempotent**, and can strand an opener it had fixed.
- **The chapter body is not to be restructured.** A §5-style rebuild of all
  fifteen Class 7 bodies was done and reverted on 15 September 2026.
- **`.chip` means a piece of an expression**, not a reason for a step.
- **Stepped examples cost pages**: Class 7 gained about 30 pages a volume,
  and short pages went up. Expect the same elsewhere, and re-measure covers.
- **A stale `.git/index.lock`** from an interrupted command will block git.
- **`settle.mjs` on a chapter's last body page writes into `p101.html`,**
  the Bridge opener, and reports success. Check what it wrote. On Beyond
  pages it can fail outright; `unsettle.mjs` works there.
- **`refit … body` can prefer a 3 mm overflow to an extra page,** and can
  separate a question from its figure. Check both after it, and place pages
  by hand when it breaks either.
- **"overflow check did not report"** means the build measured nothing —
  usually several chapters building at once. Rebuild before trusting it.
- **Beyond's examples are numbered from 1.** The phase-1 brief said to
  number on from the body, and four chapters had to be renumbered.
- **Assertion–reason is the Class 7 form:** the choices once, in a
  `<p class="c-practice__note">`, and two lines per question with no
  (a)–(d) list. The phase-1 model got this wrong and three chapters copied it.
- **The Answers stage opens a fresh page;** `repack.mjs` enforces it. Log the
  short page before it.
- **A Beyond item may not answer a body question**, not only repeat it. Read
  for this; `build/check-no-repeats.mjs` only finds wording.
- **A palette changes the colour words in the prose.** Class 6 Chapter 9
  said *the teal line*, which under its own palette printed dark green and,
  in greyscale, the same as every other line.
- **Agents sharing a scratchpad overwrite each other's backups.** Give each
  agent its own folder.
- **In Classes 8–10, the old Stage 2 is Stage 1's answers.** Every Class 8
  chapter's *Behind Each Answer* says *The same questions, worked*. Its
  explanations move under their own Stage 1 questions as running text, word
  for word, dropping only the *Solution* titles. They are not recast as
  Solved Examples. Solved Examples are then written new. Sentences that
  pointed *overleaf* are corrected. (Class 8 Chapter 1.)
- **A give-away can be a number, not a question.** Beyond printing
  $1000 = 10^3$ or $8^3 = 512$ answers a body exercise that asks whether
  1000 is a cube or for $\sqrt[3]{512}$. `check-no-repeats` cannot see
  this, because the wording differs. Read every value Beyond prints
  against the body's exercise list. Class 8 Chapter 1 had four.
- **Never pass a replacement string containing `$` through `node -e`.**
  `` $` `` in `String.replace` pastes the whole text before the match, and
  it silently duplicated a whole file once. Use the Edit tool.

## 8. Rough size

Class 7 took about 15–25 minutes an agent and 150–400k tokens a chapter, for
conversion plus a Beyond the Book rebuild. On that basis: Class 6 about 10
chapter-runs, Class 8 about 14, Class 10 about 14, Class 9 about 8 plus six
chapters of new writing, which is several times the cost of a conversion.
The furniture and the booklets are separate again.

## 9. Decisions

**Settled 16 September 2026: every class moves to 196 × 276.** Classes 8, 9
and 10 come off Crown Quarto, so the series is one page from Class 6 to Class
10 and nothing is in one book and missing from another. It re-breaks every
page in 36 chapters, which is why the page move is folded into each chapter's
own pass (§4.2) rather than run as a separate sweep: a chapter is moved,
converted and refitted once, not twice. `css/edition-196x276.css` already
exists and is what Classes 6 and 7 use; nothing new is needed in the
stylesheets. Two consequences to expect, both seen in Class 7: the figure
steps are scaled against the taller text block, so a chapter's figures pack
differently, and every volume gains pages, so every cover is re-measured in
phase 7.

Still to settle:

- **The answers booklet's form:** one booklet a volume, or one a class.
- ~~**Class 9's missing chapters:** which six, against which syllabus.~~
  **Settled 17 September 2026: none are written.** Class 9's eight chapters
  are the new NCERT book's Part 1, and NCERT has not released Part 2. Phase
  5 is the conversion of the eight and nothing more, until Part 2 exists.

## Phase 5, as it went

Started 17 September 2026. **Chapter 6 (Lines and Angles) was worked by
hand as the model**, and Chapters 1–5 and 7 by Opus agents against a brief
built from it, each checked by script (§4.8) and by reading proofs before it
was accepted. **Chapter 8 is not done**: its agent was stopped part-way at
the user's word, and its half-stepped pages are left uncommitted in the
working tree. Until it is finished, Class 9 has two trims and will not bind.

**What Class 9 needed that Class 10 did not:** its examples already carried
their working inside the panel, as prose, so stepping was a recast rather
than a move; and it set every step's reason in a `.chip` (118 of them) and
never in a `.work__why`. Reason chips became `.work__why`; chips marking a
result or a piece of an expression stayed. `check-body-maths.mjs` now reads
a bare numeric row label as a label.

**Stage 1 answered the body far more often than in other classes** — four
of five questions in Chapters 3, 4, 6 and 7 — and each such item was
replaced with one of the same kind. The syllabus audit's Class 9 findings
were fixed in the same pass (Chapter 3's 123/990, the surd and rationalising
items, Chapter 4's numbers with no real solution, Chapter 5's garbled
dashes).

**Figures drawn wrong and redrawn:** Fig. 6.7 (three points in a line
against a printed 75°), Fig. 7.3 (a deck at the wrong place on the scale,
and "purple" cards printing rose), Fig. 2B.1, 4B.3, 5B.2 and 5B.3 to new
values. Fig. 4.9, named in the text, had been lost in an earlier commit and
was restored. Every chapter's `check-numbers.mjs` measures its figures from
their coordinates.

**Wrong numbers found:** 235/99 printed as 2.(35) (Ch 3); a union of five
numbers called six (Ch 7). **Body repairs:** a duplicated summary panel
(Ch 4), filler Exercise 1.2 Q3 from commit bb264e3 (Ch 1), "Grade" for
"Class" (Ch 1), and 43 bare rupee amounts wrapped in `.nb` (Ch 2).

**Decided by the user:** no new Class 9 chapters until NCERT releases Part 2
(§9).

**Still open, for the user** (each in its chapter's log): Ch 4 has no
Example 8 and describes numbers that cannot exist in Example 15 and End
Q11; Ch 6 End Q4 is ambiguous as lettered and End Q14 repeats Ex 6.2 Q6;
Ch 1 End Q17 is non-NCERT filler; the converse of Pythagoras is cited as
Class 8 knowledge (Ch 1, Ch 5) unchecked; a square root in an italic
caption prints without its sign (a stylesheet fix); facts without sources.

## Phase 3, as it went

Done 17 September 2026. **Chapter 1 (The Shape of a Number) was worked by
hand as the model**: page moved, 12 body examples stepped, Beyond rebuilt
(11 → 16 pages: Stage 1 with its explanations, 18 examples, 31 practice
questions, answers), `ANSWERS.md` and `check-numbers.mjs` written. The other
thirteen chapters were done by Opus agents, four at a time, against a
written brief built from it, and each was checked by script (§4.8) before it
was accepted. Four agents were stopped by a usage limit part-way and resumed
from where they stood; none left a chapter half-changed.

**The class, after:** 14 chapters on 196 × 276; 103 body examples stepped;
238 Beyond examples; 431 practice questions; every chapter with
`ANSWERS.md` and a `check-numbers.mjs` — 7,113 claims in all, each script
break-tested. Mathematics I binds at 240 numbered pages, Mathematics II at
202, nothing more than 2.1 mm into a margin; the covers declare the edition
and 244 and 208 pages.

**Found and fixed along the way:** the deferred ₹18,015 (now ₹18,005); paper
*a tenth of a millimetre* against 0.001 cm (Ch 2); *taller than any
building* at 671 m (Ch 2); a model car's weight ratio (Ch 7); *three hundred
and twenty minutes* for 120 (II Ch 3); Manoj's day against Fig. 5.6 (II
Ch 5); *12% of the water on Earth is fresh* (II Ch 1, now *about 3%*,
unsourced); duplicated question numbers in Exercise Sets 2.2 and 3.5; about
thirty give-aways where Beyond printed a body answer.

**Tools and rules added:** every `₹$…$` is wrapped in `.nb`, so the sign
stays with its number — a chapter's `check-numbers.mjs` has to unwrap that
span before it reads text. A page holding one lone practice question before
the Answers stage is balanced by moving the question before it across.
`check-example-stepping` compares only page files that still exist, so when
a chapter loses body pages, re-run it with empty stand-ins for the deleted
files.

**Still open, class-wide** (each in its chapter's log): facts and history
without a source in every chapter; Pythagoras used in Mathematics I (Ch 5,
Ch 7) before Mathematics II teaches it; a rule promised and never stated
(Ch 2, $m^a/n^a$); KaTeX breaking before punctuation or inside $2n - 1$ (a
stylesheet fix, not an inline one); Stage 1's kept coaching sentences.

## Phase 1, as it went

## Phase 1, as it went

Done 16 September 2026. Chapters 5 and 8 by hand — 5 as the model, 8
because it has no worked examples and its answers are drawings — and the
other eight by Opus agents, four at a time, each checked by script and by
reading before it was accepted (§4.8, plus the tools below).

**Decided along the way:** each Class 6 chapter takes the palette whose
structure colour is the accent it already had (1 ember … 10 amethyst), so
the furniture and the headings are one colour; `ANSWERS.md` is written in
the chapter's own pass, not in phase 2; the Answers stage always opens a
fresh page.

**Tools added** under `build/`: `check-example-stepping.mjs` (stepping lost
no mathematics, robust to refitting), `check-no-repeats.mjs` (Beyond against
the body, question by question), `check-colour.mjs` (greyscale and
colour-vision proofs), `check-fills.mjs` (figures whose fills print as
near-identical greys — it over-reports; triage by eye).

**Every chapter's `check-numbers.mjs` was tested by breaking values on
purpose.** Two faults the tests found in the checks themselves are worth
carrying to the next class: an expected value typed by hand drifts from a
corrected page, so read answers back off the page; and a whole-row check lets
a wrong lettered part hide behind a right one, so check each part.

**Decided by the user afterwards:** body questions not in NCERT move to
Beyond's Practice (Chapter 10); a figure far from its question is reprinted
beside it (Chapter 6); where Stage 1 answers a body question, the
no-give-away rule wins, with the smallest edit (Chapters 2, 4, 9, and Class 7
to be checked); a question with two right answers is reworded (Chapter 6).
Still open: missing key ideas and terms; facts without a source.
