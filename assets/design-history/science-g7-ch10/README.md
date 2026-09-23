# Class 7 Science — Chapter 10: Life Processes in Plants

## Current comparison-table revision · 23 September 2026

Current extent: **25 pages**. 2 explicit comparisons now use whole tables. The [cross-chapter review](../science-g7-comparison-tables/README.md) records current pagination, the before/after editorial ledger, preservation checks and PDF verification. Earlier initial-build counts and isolated preservation reports below are historical. For current PDFs, run `python build/verify-science-g7-comparison-tables.py 10`; the old per-chapter PDF verifier belongs to its original creation baseline.


Built from the supplied 16-page PDF (printed pages 137–152). The chapter has
25 pages at 189 × 272 mm, with the established Science typography, botanical
green identity, regular serif chapter number and soft teal Investigate panels.
The studio lists it under Class 7 → Science. Chapter 10 is local and uncommitted.
The preceding Chapter 9 work was committed and pushed as `f7786cf`.

## Teaching and illustrations

- All eight source activities are represented: growth conditions, leaf starch,
  variegation/light, carbon dioxide, pondweed gas collection, leaf microscopy,
  dye transport and germinating-seed respiration. Observations precede claims.
- Three Think It Through panels connect fair comparisons, evidence limits and
  simultaneous processes. The chapter retains ten assessment questions, three
  projects and both scientist profiles; it adds fourteen glossary definitions.
- Original tables distinguish recording instructions, given observations and
  predictions. Explicit distinctions use aligned comparison tables. Safety notes beside suitable
  apparatus remain inside complete investigation panels.
- Fourteen original painted 2D PNGs were generated with built-in imagegen.
  All retain real alpha transparency and native pixel dimensions in both PDFs.
  Illustrated children replace photographic people. There are no image frames;
  labels, equations and explanatory arrows remain live vector text.
- Corrections include flame-free ethanol heating, checked destarching, a matched
  enclosure control, initially water-filled gas tubes, source-to-sink sugar
  transport, controlled gas transfer, no classroom confinement of snails, and
  suitable humidity-loving plants for a closed bottle garden.
- Added explanations address destructive sampling, experimental controls,
  matter versus energy, microscopic evidence and net gas exchange. They are
  identified as additions in the coverage ledger, not attributed to the source.

`source-coverage.json` maps 40 substantive source points, additions and nine
correction groups. `scientific-references.json` lists consulted primary sources.
`image-prompts.json` records generation/edit prompts and provenance;
`artwork.json` records installed image dimensions and hashes.

## Regeneration

Run from the repository root:

```powershell
node build/record-science-g7-ch10.mjs
node build/compose-science-g7-ch10.mjs
node build/build.mjs class-7/ch10-life-processes-in-plants --pdf --png --bleed
node build/check-reference-fit.mjs class-7/ch10-life-processes-in-plants --block=89,963
node build/audit-science-v2.mjs class-7/ch10-life-processes-in-plants assets/design-history/science-g7-ch10
node build/check-science-g7-ch10.mjs
python build/verify-science-g7-ch10.py
```

Use the bundled Python/Poppler runtime for the PDF verifier. The verifier uses
the build-time preservation baseline in `build/_class7-ch10-review/before.json`;
its report is retained in `verification.json`. Generation assets are already
installed, so normal regeneration does not need the original imagegen paths.
Do not hand-edit the generated page HTML.

## Review and limits

All 25 final PDF pages, actual facing spreads and the bleed opener were reviewed.
The final checks found no SVG text overlap, escaped panel, clipped label or
folio closer than 3 mm to the trim. Both PDFs contain embedded Source Serif 4
and Source Sans 3 fonts, live text and native images with transparency masks.
Ten science-contract cases and the investigation-order regressions passed.
SHA-256 comparison verifies 2,964 pre-existing files are unchanged.

Mean actual occupied lesson height is **81.0%**, below the 88–96% target. The
target is not claimed as met. `occupancy-summary.json` and `render-audit.json`
identify each short page and the following protected activity, table, diagram
or heading group. Short scientist profiles and the numerical net-exchange
example stay intact. Dedicated glossary and summary pages retain white space.
No type was reduced, paragraph gaps stretched or art enlarged to fill gaps.
The generic builder measures the outer SVG; use the rendered audit for actual
content occupancy rather than its 100% wrapper-fill report.

Existing chapters, shared stylesheets and global print settings are unchanged.
No Chapter 11 or 12 content was created.
