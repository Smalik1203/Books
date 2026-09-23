# Measurement of Time and Motion — Class 7 Science, Chapter 8

## Current comparison-table revision · 23 September 2026

Current extent: **21 pages**. 5 explicit comparisons now use whole tables. The [cross-chapter review](../science-g7-comparison-tables/README.md) records current pagination, the before/after editorial ledger, preservation checks and PDF verification. Earlier initial-build counts and isolated preservation reports below are historical. For current PDFs, run `python build/verify-science-g7-comparison-tables.py 8`; the old per-chapter PDF verifier belongs to its original creation baseline.


Independent chapter at `pages/class-7/ch08-time-and-motion`. Public subject: Science. The internal profile name remains science-v2; it is not printed or exposed in the subject menu.

## Authoring and regeneration

- `build/science-g7-ch08-content.mjs`: manuscript, identifiable comparisons and protected teaching units.
- `build/science-g7-ch08-diagrams.mjs`: nine apparatus, instrument and assessment diagrams with live lettering.
- `build/compose-science-g7-ch08.mjs`: chapter-specific authoring, shared opener/feature-heading/pagination utilities.
- `css/palette-science-g7-ch08.css`: scoped indigo identity and approved soft teal investigation treatment.
- Six transparent painted PNGs under `figures/class-7/science/ch08/`; built-in image generation, reference style only. Exact prompts are in `image-prompts.json`, original generation paths and hashes in `artwork.json`.

Run from the repository root:

```text
node build/compose-science-g7-ch08.mjs
node build/record-science-g7-ch08.mjs
node build/build.mjs class-7/ch08-time-and-motion --pdf --bleed --png
node build/audit-science-v2.mjs class-7/ch08-time-and-motion assets/design-history/science-g7-ch08
node build/check-reference-fit.mjs class-7/ch08-time-and-motion --block=89,963
node build/check-science-g7-ch08.mjs
python build/verify-science-g7-ch08.py
```

Use the bundled Python runtime if system Python lacks pypdf or Pillow. The preservation verifier compares against the task baseline in `build/_class7-ch08-review/before.json`.

## Coverage and qualifications

20 pages: opener, 13 lesson pages, dedicated glossary and summary, two assessment pages and two project pages. Four original numbered activities, both pendulum-variable extensions, eleven questions and five projects are represented. Three reasoning panels examine calibration, repeated timing and sampled motion. Source coverage contains 40 traceable point mappings and nine correction records.

The water-clock and pendulum setups precede their observations. Timetable and repeated-trial samples are identified as illustrative. Both assessment tables were visually checked against the source PDF. Pendulum length, small-angle limitations, average versus current speed, measurement resolution, and the limits of sampled data are explicit.

## Verification

Both PDFs contain 20 pages with embedded Source Serif 4 and Source Sans 3 and live text. Reading trim is 189 × 272 mm. The existing press-sheet settings produce approximately 208.87 × 292.10 mm including bleed and slug. Every raster placement retains native alpha transparency and source resolution; no image frames were added.

All pages, the actual facing spreads, and the enlarged bleed opener were visually inspected. No clipped content, overlapping lettering, divided panels, detached headings or white slivers at top/side trim were found. Content retention, numerical checks, internal SVG bounds, opener/bleed audit and science regressions passed. The studio registers the chapter under Class 7 → Science. A hash comparison confirmed 2,870 pre-existing source, figure and stylesheet files unchanged.

Actual lesson occupancy averages 88.6%. Pages 2, 3, 4 and 13 retain space for protected investigations, figures or reasoning panels; page 14 ends the lesson before the dedicated reference sequence. Pages 8, 9 and 12 exceed the 96% target slightly but remain within the measured content block with footer clearance. Exact bounds and protected groups are recorded in `render-audit.json` and `occupancy-summary.json`. Type and artwork were not reduced, and paragraph gaps were not stretched to change page fill.

Chapter 7 was committed and pushed separately as `bf0134a`. Chapter 8 remains local and uncommitted for review.
