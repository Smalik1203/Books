# Class 7 Science - Chapter 9: Life Processes in Animals

Built from the supplied 16-page Chapter 9 PDF (printed pages 121-136).
The independent edition contains 23 pages at 189 x 272 mm, with the established
Science typography, live labels, a scoped plum palette and soft teal Investigate
panels. No existing chapter, shared stylesheet or global print setting changed.

## Teaching and artwork

- Three source investigations: starch/amylase, bottle lung model and exhaled-air
  comparison. Observation precedes interpretation; apparatus captions show the
  initial state. Teacher-handled prepared enzyme and syringe transfers replace
  classroom saliva sampling and suction through lime water.
- Three Think It Through panels address test limitations, model mechanisms and
  connections among digestion, circulation and respiration.
- Fourteen glossary entries, twelve summary points, all ten source questions
  and all six projects remain represented. Question 9 retains the supplied
  A blue-black / B amber result, explicitly as given evidence.
- Fourteen original painted 2D PNG assets were produced with built-in imagegen.
  All have genuine alpha transparency and are embedded at native dimensions.
  Human figures are illustrated; no photographs of people are used. Apparatus,
  tissues and organisms have physical detail; arrows and lettering remain live.
  Figures are sized for their teaching role and never enlarged to fill a page.
- Source coverage, corrections, qualified health claims and reference URLs are
  recorded in `source-coverage.json` and `scientific-references.json`. Prompt
  records are `image-prompts.json`, `lime-image-prompt.json` and
  `breathing-image-prompt.json`; asset hashes are in `artwork.json`.

## Regeneration

Run from the repository root:

```powershell
node build/record-science-g7-ch09.mjs
node build/compose-science-g7-ch09.mjs
node build/build.mjs class-7/ch09-life-processes-in-animals --pdf --png --bleed
node build/check-reference-fit.mjs class-7/ch09-life-processes-in-animals --block=89,963
node build/audit-science-v2.mjs class-7/ch09-life-processes-in-animals assets/design-history/science-g7-ch09
node build/check-science-g7-ch09.mjs
python build/verify-science-g7-ch09.py
```

The PDF verifier uses the bundled Poppler path and the build-time preservation
baseline in `build/_class7-ch09-review/before.json`. Its results are retained in
`verification.json`; the ignored review directory contains the PDF renders.
The compositor is the source of pagination; do not edit generated page HTML.

## Verification and remaining page-balance exceptions

Final inspection covered all 23 PDF pages, all actual facing spreads and the
bleed opener. The reading and bleed PDFs have embedded Source Serif 4 and
Source Sans 3 fonts, live text and native transparent images. SVG measurement
found no text collisions, clipped labels or panel overflow; all folios clear
the trim by at least 3 mm. The ten science-contract regression cases and the
food-investigation sequence regressions passed. Studio registration is under
Class 7 -> Science. SHA-256 comparison confirms 2,925 existing files unchanged.

Actual mean occupied lesson height is **86.6%**. The 88-96% target is not met on
every page: intact activities, tables, anatomical diagrams and heading groups
prevent some joins. The short pages and the exact following groups are listed
in `occupancy-summary.json`, with measured bounds in `render-audit.json`.
The final lesson page ends before the separate glossary and summary; those
reference pages deliberately retain white space. Page 7 reaches 97.8%, while
remaining inside the verified content block with footer clearance. Text size,
line spacing and paragraph gaps were preserved throughout fitting.

No commit or push was made for Chapter 9.
