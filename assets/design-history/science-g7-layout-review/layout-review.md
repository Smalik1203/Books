# Class 7 Science layout review

Completed 25 September 2026 across all twelve chapters. The revised chapters contain 284 pages, up from 277, with 69 numbered activities. Both reading and bleed PDFs have been rebuilt.

## Changes

- Enlarged illustrations proportionally within the available page space. Figure size is constrained by the remaining height as well as the text width; typography and shared styles are unchanged.
- Matched supplemental pictures to topic anchors, so repagination carries artwork with the relevant discussion. No supplemental picture repeats within a chapter.
- Rebalanced page breaks while keeping panels, tables, questions and projects whole. Labelled instructional diagrams retain their geometry.
- Added seven illustrations: olfactory sources, cell voltage, a closed paper-clip switch, rust-observation materials, a stomach cutaway, colon microbes, and lunar colours. Asset provenance and hashes are recorded in `generated-art.json`.
- Kept the Earth–Moon–Sun paragraph together in Chapter 1 and corrected the Chapter 2 opener's title clearance.
- Restored Chapter 9's existing authored summary, which the previous compositor omitted. Apart from that restoration and reviewed illustration captions, original reading text remains in order.

Some pages remain below the nominal fill target because the next complete activity, comparison, question or figure cannot fit, or because a section ends there. These exceptions are recorded in `verification.json`; filling them by dividing panels or reducing type was not used.

## Validation

All twelve chapter builds and rendered geometry audits pass: no reported collisions, panel escapes or bottom overflow, and footer clearance is retained. The PDFs were rendered and reviewed as page contact sheets, with changed figures inspected during revision.

Passed checks:

- `node build/check-science-g7-layout.mjs`: original teaching text and native pictures retained, protected components whole, geometry valid, and 1,090 Class 6/art/style files unchanged.
- `node build/check-science-g7-page-art.mjs`: 284 illustrated pages, 69 numbered activities, proportional figure sizes, reviewed topic anchors and no repeated supplementary images.
- `node build/check-science-regressions.mjs`: science contracts and investigation sequence.
- `node build/check-science-g6-format.mjs`: existing Class 6 format and regeneration checks.
- `git diff --check`: no whitespace errors.
- PDF inspection: all 24 PDFs are newer than their page sources and have the expected page counts and consistent sheet sizes. Details are in `pdf-verification.json`.

The older chapter-specific tests contain page-count and artwork-location assumptions from earlier editions. The new layout check validates preservation against the saved pre-edit pages rather than enforcing those obsolete folios.

## Chapter PDFs

Each link opens the reading PDF. Its press counterpart is beside it with `-bleed.pdf` in the filename.

1. [The Ever-Evolving World of Science — 11 pages](C:/CODEBASE/books/build/class-7/ch01-ever-evolving-world-of-science-v2.pdf)
2. [Exploring Substances — 22 pages](C:/CODEBASE/books/build/class-7/ch02-exploring-substances.pdf)
3. [Electricity: Circuits and their Components — 28 pages](C:/CODEBASE/books/build/class-7/ch03-electricity-circuits.pdf)
4. [The World of Metals and Non-metals — 30 pages](C:/CODEBASE/books/build/class-7/ch04-metals-non-metals.pdf)
5. [Changes Around Us — 23 pages](C:/CODEBASE/books/build/class-7/ch05-physical-chemical-changes.pdf)
6. [Adolescence — 22 pages](C:/CODEBASE/books/build/class-7/ch06-adolescence.pdf)
7. [Heat Transfer in Nature — 21 pages](C:/CODEBASE/books/build/class-7/ch07-heat-transfer-in-nature.pdf)
8. [Measurement of Time and Motion — 23 pages](C:/CODEBASE/books/build/class-7/ch08-time-and-motion.pdf)
9. [Life Processes in Animals — 30 pages](C:/CODEBASE/books/build/class-7/ch09-life-processes-in-animals.pdf)
10. [Life Processes in Plants — 27 pages](C:/CODEBASE/books/build/class-7/ch10-life-processes-in-plants.pdf)
11. [Light: Shadows and Reflections — 26 pages](C:/CODEBASE/books/build/class-7/ch11-light-shadows-reflections.pdf)
12. [Earth, Moon, and the Sun — 21 pages](C:/CODEBASE/books/build/class-7/ch12-earth-moon-sun.pdf)

## Rebuilding

```powershell
node build/compose-science-g7-layout.mjs
node build/proof-science-g7-layout.mjs
node build/check-science-g7-layout.mjs
node build/check-science-g7-page-art.mjs
```

The compositor and proof runner accept optional chapter numbers. `build/proof-science-g7-layout.py` creates PDF page proofs and contact sheets under `tmp/g7-layout/proofs/`.
