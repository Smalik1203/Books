# Class 6 Science illustration and pagination review — 25 September 2026

Scope: all twelve Class 6 Science chapters, 356 printed pages. Class 7 sources,
styles and artwork were preserved and verified against `preserved-class7.json`.

## Changes

- Supplementary figures use their actual aspect ratio and available page height,
  up to 824 units wide and 540 units high, without reducing their former size.
- Small side illustrations, the millet photograph and the plant, vein and root
  comparisons were enlarged. Eligible single-image figures ending SVG pages can
  use the spare height without scaling caption type or diagram labels.
- Class 6 pagination fills earlier pages before balancing gaps. Ordinary
  paragraphs remain whole where practical; activity panels, tables and summaries
  remain protected. Reference sections and Beyond the Book retain their boundaries.
- Illustrations were reassigned to their subjects: animal observations and
  movement, leaf veins and stems, compass construction, magnetic applications,
  food comparisons, seed investigations and life-cycle exercises. The plant-size
  qualification stays beside the plant comparison. Question 3 in Magnets stays
  with its table. The vitamin caption is one continuous caption below its figure.
- Twenty new dimensional illustrations replace primitive containers or unrelated
  filler. `layout-artwork.json` records their provenance and hashes. Scientific
  labels on the four Materials diagrams remain editable vectors.
- The measurement maze is taller and its pencil larger. Flat measurement scales,
  maps, graphs and other diagrams whose geometry carries meaning remain vectors.

## Verification

- Rebuilt all twelve chapters through `build.mjs`, including trim and bleed PDFs.
- Rendered complete PDF sheets at the edition's 189 × 272 mm trim; reviewed every
  page on labelled contact sheets and inspected changed figures at page size.
- All 356 pages pass the figure-size, uniqueness and regeneration checks.
- All 188 modern pages pass the geometry audit; the seven SVG chapters pass
  their rendered-bounds and chapter-specific science checks.
- Retention audit: no missing teaching text or original instructional images in
  the five modern chapters. The seven SVG chapters retain their activities,
  questions, projects, definitions and protected components.
- Science contract, food investigation and diversity regressions pass.
- Class 7's 277-page illustration/regeneration check passes unchanged.

Some lower-page space remains where the next complete activity, table or teaching
unit cannot fit, and on closing/reference pages. No panel was divided and no type
size was reduced to fill those gaps. Builder fill percentages alone are not used
as evidence for SVG pages: full-page furniture can make those percentages read
100%; the content audits and rendered sheets are the checks used here.
