# Bringing every maths class to one standard

Written 16 September 2026, after Class 7 was finished. **Class 7 is the
standard**; Classes 6, 8, 9 and 10 are to match it, so that nothing is in one
book and missing from another. This file is the plan of work. Start it by
saying which phase to begin; nothing here has been started yet.

The rules themselves are not repeated here — they are in `DESIGN-MATHS.md`
§5a (the bar a finished chapter clears), §5 (*The companions*), §6a's opening
block (the Beyond the Book shape), and §10 (language). Read those first.

## 1. Where each class stands

| class | chapters | page | Beyond the Book | examples in the chapters | answers |
|---|---|---|---|---|---|
| 6 | 10 | 196 × 276 ✓ | old shape | 35, prose | none |
| **7** | **15** | **196 × 276 ✓** | **current ✓** | **82, stepped ✓** | **none** |
| 8 | 14 | Crown Quarto | old shape | 96, prose | none |
| 9 | 8 of ~14 | Crown Quarto | old shape | 85, prose | none |
| 10 | 14 | Crown Quarto | old shape | 117, prose | none |

61 chapters in all; 46 to bring up, and about six to write from nothing.

## 2. What "consistent" means here

Every maths chapter, in every class:

1. sits on the **196 × 276 page**;
2. keeps **NCERT's own structure** in the chapter body — no examples, checks
   or exercises added inside it;
3. sets **every worked example as steps** — *Solution*, a step to a
   `.work__row`, *Answer*, the reason in a `.work__why` — except a
   question-only panel whose working is in the running text, which is left
   alone;
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
- **Phase 4 — Class 10** (14 chapters). Same as Class 8. Examined class, so
  the model papers in phase 6 matter most here.
- **Phase 5 — Class 9**: convert the 8 chapters that exist, then **write the
  missing ~6** to §5a. This is authoring, not conversion, and is the one
  phase where the work is new mathematics.
- **Phase 6 — volume furniture** for all six volumes: contents, how to use the
  book, syllabus table, glossary and index, formula sheet, two model papers.
- **Phase 7 — bind, covers, cross-chapter notes**: re-measure every volume,
  set each cover's page count and spine, update `CROSS-CHAPTER.md`.

## 4. The recipe, per chapter

This is the sequence that worked for Class 7. One agent per chapter.

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
- **Class 9's missing chapters:** which six, against which syllabus.
