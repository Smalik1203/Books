# Class 7 Science — Chapter 6

## Current comparison-table revision · 23 September 2026

Current extent: **19 pages**. 2 explicit comparisons now use whole tables. The [cross-chapter review](../science-g7-comparison-tables/README.md) records current pagination, the before/after editorial ledger, preservation checks and PDF verification. Earlier initial-build counts and isolated preservation reports below are historical. For current PDFs, run `python build/verify-science-g7-comparison-tables.py 6`; the old per-chapter PDF verifier belongs to its original creation baseline.


**Adolescence: A Stage of Growth and Change** is registered under Science at
`pages/class-7/ch06-adolescence`. Public titles contain no version label.

The chapter has 18 pages at 189 × 272 mm: an illustrated opener, twelve lesson
pages, dedicated keyword and summary pages, two assessment pages and one project
page. Source Serif 4 body text and Source Sans 3 headings retain the established
size and leading. The muted rose identity, sprout motif and soft teal Investigate
panels are scoped to this chapter; shared print settings are unchanged.

## Content and source coverage

The supplied Chapter 6 PDF has sixteen pages, printed 73–88. Its hash and location
are recorded in `source.json`; extraction is in `source-extraction.txt`.
`source-coverage.json` maps 38 substantive points, including all four source
activities, all ten assessment questions and all three projects. The compositor
writes the complete revised manuscript to `editorial-ledger.json` on regeneration.

The treatment uses anonymous or fictional classroom examples rather than requiring
personal disclosures. Three Think It Through pauses address inference from visible
traits, barriers to menstrual participation and preserving online evidence without
redistributing harm. Ten scientific/editorial corrections are explicit in the
coverage ledger. Primary medical, public-health and programme references are in
`scientific-references.json`, checked 22 September 2026.

## Artwork

Six new transparent RGBA PNG illustrations were generated with the built-in
`image_gen` tool using the approved painted 2D people reference. Full prompts and
original generated paths are in `image-prompts.json`. Selected production files
are under `figures/class-7/science/ch06/`: `opener.png`, `question-jar.png`,
`hygiene.png`, `movement.png`, `support.png` and `food-choices.png`.
`artwork.json` records native dimensions (1536 × 1024), alpha and hashes.

The opener is the dominant contextual scene. The jar illustration identifies a
classroom procedure inside its panel. Hygiene supplies are an identification
reference; movement and trusted support are contextual scenes. Food arrangements
are an assessment comparison, with a 320-unit image height selected to keep the
individual foods identifiable at print size. Contextual images use a 270-unit
height cap; the jar uses 215 units. These sizes are authored, not expanded by the
page-fitting process. Images have no frame, background rectangle or baked labels.
Four explanatory vector models have live labels: neck structures, cycle counting,
airway cross-sections and hormone signalling.

## Pagination and verification

Mean actual occupied lesson height is **93.49%**, measured inside the SVG rather
than from its full-sheet outer box. Two lesson exceptions remain:

- Page 8, 79.5%: the complete hygiene illustration and caption require 65 mm;
  45.1 mm remain.
- Page 11, 82.0%: the complete digital-behaviour table and guidance require
  89.5 mm; 38.3 mm remain.

The compositor records actual bounds, stable block IDs, comparison items and the
protected unit at each break. Independent topic bullets can break between complete
items; paired comparisons, bordered panels, tables and figure/caption units remain
whole. Type and paragraph gaps were not stretched or reduced to fit. Shorter
reference, assessment and closing pages preserve their distinct teaching roles.

The final review covered every reading-PDF page, every facing spread, the enlarged
opener and the bleed opener. No clipping, collided labels, divided panels, detached
headings or white slivers at the opener trim edges were found. The actual-bounds
audit verifies centred CHAPTER/numeral, title baseline alignment, safe text bounds,
motif clearance, header/image/body separation and full top/side bleed coverage.

Both PDFs contain 18 pages, embedded live fonts and six native PNG placements with
alpha masks. The reading trim is 189 × 272 mm; the existing press-sheet convention
adds 3 mm bleed and 7 mm crop-mark slug (nominal 209 × 292 mm). All 2,818 pre-existing
page, figure and stylesheet files match their pre-work hashes. Studio registration
under Class 7 → Science is verified. Ten science-contract regressions and the
food-investigation-order/retired-reference checks passed.

## Regeneration

```powershell
node build/compose-science-g7-ch06.mjs
node build/record-science-g7-ch06.mjs
node build/build.mjs class-7/ch06-adolescence --pdf --bleed --png
node build/audit-science-v2.mjs class-7/ch06-adolescence assets/design-history/science-g7-ch06
node build/check-reference-fit.mjs class-7/ch06-adolescence --block=89,963
node build/check-science-g7-ch06.mjs
python build/verify-science-g7-ch06.py
```

The PDF verifier uses the local studio on port 5180 and the preserved-file snapshot
at `build/_class7-ch06-review/before.json`. Review proofs are generated in that
scratch directory. The final exports are `build/class-7/ch06-adolescence.pdf` and
`build/class-7/ch06-adolescence-bleed.pdf`.

Before Chapter 6 authoring, the completed Chapter 5 was committed and pushed to
main as `0c1ebd7`. Chapter 6 is local and uncommitted for user review. Existing
unrelated scratch files were preserved.
