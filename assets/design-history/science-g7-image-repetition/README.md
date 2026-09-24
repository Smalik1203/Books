# Class 7 Science illustration review

Reviewed all 12 chapters (277 pages). Replaced repeated supplementary art on
115 pages, with distinct page-specific choices. Chapter 1 already had unique
contextual art. Replaced six standalone/review/project image placements in
Chapter 12 as well. Enlarged the undersized figures on Chapter 9 pages 23, 24,
26 and 27 to the standard 720 × 280 illustration area; captions sit below.
No body text, table, chapter pagination or chapter numbering was removed to fit art.

29 new illustrations were created using the built-in image-generation tool.
Final assets are in `figures/class-7/science/review/`; `generated-art.json` records
their subjects/prompts, style, saved filenames and generation provenance.
The diaphragm image uses the corrected v2 asset. Existing suitable illustrations
were reused from the book's library without modifying or shrinking their files.

`replacements.json` records the editorial selections. `page-art.json` binds each
selection to authored block IDs for future composition. `changes.json` records
the prior asset. `before.json` and `after.json` audit image content hashes rather
than filenames. The regeneration guard prevents cycling stock art onto new pages.

The remaining reuse is intentional: identical components within controlled
comparisons, the same apparatus needed by an assessment question, or Earth,
Moon and Sun in different labelled astronomical models. The exact approved
occurrences and reasons are in `approved-instructional-reuse.json`. Additional
reuse needs review; it does not pass merely because it is outside a supplement.

All 69 first-hand activity headings now use chapter-based numbering, including
the existing Activity 1.1. The source compositors preserve the labels on rebuild.

Validation: run `node build/check-science-g7-page-art.mjs` for image coverage,
hash repetition, approved diagram reuse, activity sequences, figure size and
regeneration selections. Run the science regressions, chapter builds and rendered
bounds audits too. PDF proofs of the 119 changed pages are kept under ignored
`tmp/science-image-review/proofs/` for visual inspection.
