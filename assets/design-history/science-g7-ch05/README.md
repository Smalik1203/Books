# Class 7 Science Chapter 5

## Current comparison-table revision · 23 September 2026

Current extent: **20 pages**. 4 explicit comparisons now use whole tables. The [cross-chapter review](../science-g7-comparison-tables/README.md) records current pagination, the before/after editorial ledger, preservation checks and PDF verification. Earlier initial-build counts and isolated preservation reports below are historical. For current PDFs, run `python build/verify-science-g7-comparison-tables.py 5`; the old per-chapter PDF verifier belongs to its original creation baseline.


**Changes Around Us: Physical and Chemical** is registered under Class 7 → Science.
The twenty-page chapter uses the established 189 × 272 mm Science profile,
Source Serif 4 reading text, Source Sans 3 headings, left alignment and live SVG
lettering. Its muted violet identity is scoped to `.page--g7-ch05`; shared print
settings and earlier chapters are unchanged. Investigate retains the approved
soft teal header and wash; four substantial thinking panels use amber.

## Source and coverage

The supplied Chapter 5 PDF contains sixteen pages (printed 57–72). `source.json`
records its identity and hash. `source-coverage.json` maps 36 substantive source
units to stable manuscript IDs, including all eight activities, ten assessment
questions and five projects. It separately identifies focused additions and
scientific/safety corrections. `editorial-ledger.json` records the complete final
teaching sequence. The source PDF is unchanged.

The manuscript distinguishes observations from conclusions, reversibility from
new-substance formation, and weathering from erosion and deposition. No activity
is illustrated with its outcome before learners observe it. Teacher-controlled
gas transfer replaces a direct mouth-to-lime-water connection; heating remains
teacher-only. Primary verification references are in `scientific-references.json`.

## Artwork

Seven 1536 × 1024 RGBA PNGs are saved in `figures/class-7/science/ch05/`:
`opener.png`, `physical-objects.png`, `candles.png`, `weathering.png`,
`firefly.png`, `yeast.png`, and `chameleon.png`. They were generated with the
built-in image_gen tool in the approved warm painted 2D style. They are
illustrations, not documentary photographs. No image has a frame or a baked-in
rectangular background. The unused lime-water vignette is recorded as unselected
and is not a chapter asset. Full prompts and generation paths are in
`image-prompts.json`; native sizes and SHA-256 values are in `artwork.json`.

Seven chapter-local vector diagrams carry precise experimental relationships and
live instructional labels. They cover exhaled-air comparison, gas delivery,
focused sunlight, the fire triangle, the wax sequence, landscape processes and
the four assessment setups. The flask motif is restrained chapter furniture.

Art sizes reflect instructional roles: a dominant contextual opener, small
identification specimens, and readable paired comparisons/equipment. Pagination
does not resize them. Panel-owned setup diagrams and the candle illustration stay
inside their panels. Both illustrated projects retain their headings, complete
instructions, image and caption on one page.

## Pagination and verification

The sequence is one opener, thirteen lesson pages, separate Keywords and Summary
pages, two assessment pages and two project pages. The rendered lesson averages
88.015% occupied height. `render-audit.json` records actual content bounds;
`occupancy-summary.json` identifies the protected unit behind each shorter lesson
page. The final lesson page closes before the dedicated references. Page 19 ends
with the three short projects because the complete illustrated yeast project
moves to page 20; its lower space is intentional, not stretched spacing.

Final reading-page and facing-spread proofs were inspected for all twenty pages.
The opener bleed proof was checked for uninterrupted top/side coverage. Body
text, tables, diagram labels, illustrations and folios have no clipping or
collisions. The folios remain at least 3 mm inside trim. Both PDFs have twenty
pages, embedded live fonts, seven native transparent image placements and the
declared reading/bleed media sizes. `verification.json` records hashes and
confirms 1,260 existing page, figure and stylesheet files are unchanged, along
with public Science studio registration.

Validated commands:

```text
node build/compose-science-g7-ch05.mjs
node build/record-science-g7-ch05.mjs
node build/build.mjs class-7/ch05-physical-chemical-changes --pdf --bleed --png
node build/audit-science-v2.mjs class-7/ch05-physical-chemical-changes assets/design-history/science-g7-ch05
node build/check-reference-fit.mjs class-7/ch05-physical-chemical-changes --block=89,963
node build/check-science-g7-ch05.mjs
python build/verify-science-g7-ch05.py
```

The shared science suite also passed all ten contract regressions, the food
investigation-order checks and retired-reference checks. The build is local;
nothing has been committed or pushed.
