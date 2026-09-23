# Class 7 Science: comparison tables

Revision: 23 September 2026. Explicit concept distinctions now use 35 framed tables across Chapters 1–10. This supersedes the earlier comparison-bullet treatment for these chapters.

The common renderer uses the existing chapter palette and table type scale, with live text, aligned criteria, top-aligned cells and white body cells. Longer paragraph cells receive extra padding. Tables and their explanatory notes remain whole. Scientific qualifications, activities, safety instructions, reference pages and assessment content are retained. Ordinary topic overviews and connected process narratives keep their existing roles.

## Extent and inventory

- Chapter 1: 10 → 10 pages; actual mean occupied lesson height 91.5%. Tables: Evaporation and condensation (p5).
- Chapter 2: 20 → 20 pages; actual mean occupied lesson height 89.3%. Tables: Group samples by both litmus observations (p3); Recognising acidic, basic and neutral samples (p4); Soil conditions and appropriate responses (p14).
- Chapter 3: 24 → 24 pages; actual mean occupied lesson height 89.9%. Tables: Incandescent lamps and LEDs (p8); Open and closed circuits (p13); Conducting and insulating parts (p18).
- Chapter 4: 23 → 23 pages; actual mean occupied lesson height 89.4%. Tables: Hardness and malleability (p3); Malleable and brittle behaviour (p4); Protecting iron from corrosion (p12); Products of magnesium and sulfur in air (p15).
- Chapter 5: 20 → 20 pages; actual mean occupied lesson height 88.8%. Tables: Two kinds of change in a candle (p11); Reversible and irreversible changes (p12); Useful and unwanted changes (p12); Physical and chemical weathering (p13).
- Chapter 6: 18 → 19 pages; actual mean occupied lesson height 87.1%. Tables: Puberty and adolescence (p5); Using and caring for menstrual pads (p10).
- Chapter 7: 19 → 19 pages; actual mean occupied lesson height 88.6%. Tables: Good and poor heat conductors (p3); Sea and land breezes (p8); Light and dark surfaces in sunlight (p9).
- Chapter 8: 20 → 21 pages; actual mean occupied lesson height 83.9%. Tables: How early clocks mark time (p2); Resolution and accuracy (p9); Comparing average speeds (p11); Uniform and non-uniform linear motion (p13); Speedometer and odometer (p14).
- Chapter 9: 23 → 24 pages; actual mean occupied lesson height 83.9%. Tables: Different ways of obtaining food (p2); Different roles in stomach secretions (p6); Contributions to digestion in the small intestine (p7); Egestion and excretion (p8); Food processing in ruminants and birds (p10); Inhalation and quiet exhalation (p14); Breathing and cellular respiration (p17); Gas exchange in different animals (p19).
- Chapter 10: 25 → 25 pages; actual mean occupied lesson height 81.1%. Tables: Xylem and phloem (p16); Photosynthesis and aerobic respiration (p18).

## Pagination exceptions

Chapters 6, 8 and 9 each gain one lesson page because a table is now an indivisible teaching unit. Other extents are unchanged. The compositor still chooses the fewest legal pages, preserves order, keeps headings with five lines, and does not change body type, illustration size or paragraph spacing. Short pages are documented in `pagination-exceptions.json` with the protected groups and measured remaining space. Chapters 6, 8, 9 and 10 fall below the 88% mean target; this is an explicit exception, not a claim that every page meets the target. Chapter 10 already had an 81% mean before this revision.

The Chapter 6 check records its reviewed 19-page extent and 87% minimum mean. Chapter 8 records 21 pages and 14 lesson pages, keeps every short-page explanation mandatory, and checks that the occupied-content budget of the original 13-page lesson has been retained. Neither check was changed to ignore clipping, lost content, broken tables or orphaned headings.

## Verification and regeneration

For each chapter, run its `compose-science-g7-chNN.mjs`, the normal builder with `--pdf --png --bleed`, `check-reference-fit.mjs <chapter> --block=89,963`, `audit-science-v2.mjs <chapter> <history>` and its chapter content check. Chapter 1 retains the `01-v2` internal suffix.

Then run:

```text
node build/check-science-g7-comparison-tables.mjs
python build/verify-science-g7-comparison-tables.py
```

The Python verifier checks both exports at 189 × 272 mm reading trim and 209 × 292 mm press-sheet size, live text and fonts, and every comparison cell on its intended page. Add `--render` for complete Poppler page proofs and contact sheets. `before-content.json` and `before-hashes.json` are the immutable pre-revision snapshots. The content checker verifies every original comparison sentence/item, unaffected teaching roles, all artwork/styles, all openers and 2,813 unrelated source files. Science contract and investigation-order regressions passed. Reading PDFs were reviewed as complete-page contact sheets with enlarged checks of the new tables; all internal SVG bounds and rendered collision/footer checks passed.

Initial per-chapter verification files describe their creation baselines. `pdf-verification.json`, current page maps/render audits, and this revision’s ledger are the current records. No commit or push was made for this revision.
