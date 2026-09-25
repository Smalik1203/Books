# Beyond the Book solved-example revision

Requested scope: all 61 mathematics chapters, Classes 6–10, in class order.
Each chapter must have 15 solved examples: six single-correct, four
multiple-correct, three numerical-answer and two matching-list questions.
Use the class's mathematical prerequisites. Keep the body, Stage 1, practice
questions and practice answers intact. Refit the bridge and rebuild each volume.

| Class | Chapters | Content status | Verification status |
|---|---:|---|---|
| 6 | 10 | 150 examples rewritten | Content and option checks passed; both volumes rebound with reading and bleed PDFs on 20 September |
| 7 | 15 | 225 examples rewritten, 23 September | Content, option and preservation checks passed for all 15 chapters; both volumes rebound with reading and bleed PDFs on 23 September |
| 8 | 14 | 210 examples rewritten, 23 September | Content, option and preservation checks passed for all 14 chapters; every page fits; both volumes rebound with reading and bleed PDFs on 23 September |
| 9 | 8 | 120 examples rewritten, 23 September (Chapter 8 after finishing its conversion) | Content, option and preservation checks passed for all 8 chapters; every page fits; volume rebound 23 September |
| 10 | 14 | 210 examples rewritten, 24 September | Content, option and preservation checks passed for all 14 chapters; every page fits (one 1.1mm margin run, Ch 11 p003, body); both volumes rebound with reading and bleed PDFs on 24 September |

Class 6 authored source is in `build/jee-class6.mjs`; the printed source
remains `pages/class-6/`. `build/check-jee-class6.mjs` checks counts, order,
answer keys, independently calculated numerical results, distinct options,
matching permutations, and preservation of the other stages. Editorial review
also covers every geometric statement, distractor and worked explanation.
The automatic checks do not prove the mathematical meaning of prose.

Class 7 follows the same pattern: `build/jee-class7.mjs [chapter]` installs,
`build/check-jee-class7.mjs [chapter]` checks. Its checker goes further than
Class 6's: each chapter's `verify()` recomputes every option, not only the
keyed one, so a distractor that happens to be correct fails the check. Class 7
writes maths in two ways — plain text with × and ÷ tied by no-break spaces,
and `$…$` only for letters and fractions. Inside `$…$` use `\\times` and
`\\div` in the JS source; the builder does not catch a lost backslash before
`div`, and one shipped to a proof before this note.

Class 8 (`build/jee-class8.mjs`, `build/check-jee-class8.mjs`) sets every
piece of maths in formula type, because its chapters are full of powers and
roots, and folds "Each entry has exactly one match." into a matching panel's
opening sentence. That saves the one line that let two matching panels share
a page, which six chapters needed. The checkers share one engine,
`build/jee-check.mjs`; a new class needs only its records.

**Class 9 Chapter 8 (Sequences) was first converted to the Class 7 shape**,
finishing the Phase 5 work stopped earlier: `build/convert-c9-ch08-bridge.mjs`
rebuilt its Beyond the Book from the old Behind Each Answer / Problem Sets
shape (details in its EDIT-LOG), and only then were its 15 examples added.
In Chapters 2 and 4 the example figures were not
the last in the chapter, so the practice figures after them were renumbered
down by one, in the pages and in the snapshot the checker compares against.

After a class is done, `build/jee-notes.mjs class-N "D Month YYYY"` brings
each chapter's `EDIT-LOG.md` (a dated entry with the new key) and
`ANSWERS.md` (its Stage 2 section) up to date from the pages. Classes 6, 7,
8 and 9 have been run.

`build/jee-refit-class.mjs class-6 [chapter]` runs the bridge refit, repairs option widths
if necessary and checks stranded headings. Logs are in `build/_jee-checks/`.
Some pages remain short because examples are indivisible panels and answers
start on a fresh page. Record clipping and margin overrun separately from fill.

The initial conversion exposed a fragment parser bug: mathematical `<` signs
could be mistaken for HTML tags. The revision's parser now masks TeX while
finding blocks. Original Stage 1 and practice material was restored from the
pre-edit snapshots and is compared by the content audit. Do not bypass that
preservation check when continuing the revision.
