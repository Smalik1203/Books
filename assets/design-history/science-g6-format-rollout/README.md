# Class 6 Science formatting review

Applied the approved Class 7 typography and component treatment to all twelve Class 6 chapters. The final source contains 354 pages and 81 sequential Activity headings.

- Wide prose is justified without hyphenation or breaking words. Paragraph endings and narrow notes remain naturally set.
- Comparison and record tables use the shared lavender-grey treatment, rounded corners and measured spacing. Activities retain the soft teal treatment; thinking panels retain the shared amber treatment.
- Panels and tables remain whole. Added spacing is included in compositor measurements, rather than painted over existing page breaks.
- Captions use subtle semibold weight. Supplementary illustrations retain a 720 × 280 frame; existing instructional art is not reduced to recover space.
- `page-art.json` records the reviewed illustration choice and content anchors for each supplementary figure. Every page has teaching artwork. No supplementary asset is reused within a chapter, including byte-identical files with different names.
- `instructional-reuse.json` records the few intentional uses of an original measurement or observation figure in a question about that same figure. Crops of a single composite and stages within one lifecycle are also recorded explicitly.
- `summary-revisions.json` records exact old/new recap passages for the retention checker. Lesson content, safety instructions and scientific qualifications remain covered by the existing retention and chapter checks.
- `generated-art.json` records new illustration subjects and provenance. Unused or rejected alternatives remain in ignored local scratch storage.

Validation: all twelve trim and bleed PDFs rebuilt; 354 full-sheet Poppler proofs reviewed; the five modern chapter geometry audits and seven SVG chapter geometry audits passed. Class 6 format, content retention, chapter content and science regression checks passed. The Class 7 artwork check passed, and the preserved Class 7 source audit found no changes.

Reproduction tools: `compose-science-g6-all.mjs`, `proof-science-g6-format.mjs`, `proof-science-g6-format.py`, `check-science-g6-format.mjs` and `review-science-g6-format.py`. PDF files and page proofs remain local under existing ignore rules.
