# Class 7 Science · Chapter 7

**Heat Transfer in Nature** is an independent chapter under
`pages/class-7/ch07-heat-transfer-in-nature`. It uses the established 189 × 272 mm
Science edition, Source Serif 4 / Source Sans 3, a copper chapter identity and
the approved soft teal Investigate panels. Public labels say Science.

## Content and artwork

The supplied 16-page PDF is recorded by path and SHA-256 in `source.json`.
`source-coverage.json` maps 38 substantive source points, including all five
activities, ten assessment questions (all subparts) and three projects.
`editorial-ledger.json` stores the revised manuscript; corrections and the three
added Think It Through prompts are explicit. Scientific sources are recorded in
`scientific-references.json`.

Five native 1536 × 1024 transparent PNGs were created with the built-in image
generation tool, following the approved painted style. No photorealistic people,
rectangular image backgrounds or image frames are used. Exact prompts, style
reference and original generated paths are in `image-prompts.json`; final asset
paths, dimensions and hashes are in `artwork.json`. Eleven live SVG diagrams
provide apparatus, observations, circulation, groundwater and assessment labels.
Initial experiment diagrams do not show the predicted outcomes.

## Pagination and review

Final extent: **19 pages** — opener, 13 lesson pages, dedicated Keywords and
Summary pages, two assessment pages and one project page.

Mean actual occupied lesson height is **88.1%**. Five shorter lesson pages remain
and are recorded with actual bounds and protected-group heights in
`occupancy-summary.json` and `render-audit.json`:

- Page 2: conductor comparison and intervening explanation remain together downstream.
- Page 3: the next insulation sequence includes its complete materials illustration.
- Page 4: the next convection heading must stay with sufficient content and the whole cup investigation.
- Page 7: the temperature table and its recording guidance move whole.
- Page 8: the paired breeze model and caption move whole.

No type was reduced, paragraph spacing stretched or artwork enlarged to fill
these gaps. Glossary and summary remain dedicated reference pages. The first
draft's 21 pages were reduced through concise instructions and table editing;
the redundant extra water-cycle connection diagram was removed while retaining
the painted landscape and all process explanations.

Every exported page and all nine facing spreads were inspected. Diagram leader
collisions were corrected in the cup, bowl, aquifer and test-tube drawings.
The final enlarged opener/bleed proof has no white slivers at top or side trim.
Both PDFs keep embedded live fonts and five native transparent image placements.
Reading trim is 189 × 272 mm; press sheet is nominally 209 × 292 mm including
3 mm bleed and 7 mm slug. Footer text clears trim by at least 3 mm.

Content checks, internal SVG text bounds, rendered occupancy and science
regressions pass. The preservation snapshot verifies **2,844 existing files
unchanged**, and Git reports no modifications to pre-existing tracked files.
The chapter is registered under Class 7 → Science in the studio.

## Rebuild

```sh
node build/compose-science-g7-ch07.mjs
node build/record-science-g7-ch07.mjs
node build/build.mjs class-7/ch07-heat-transfer-in-nature --pdf --bleed --png
node build/audit-science-v2.mjs class-7/ch07-heat-transfer-in-nature assets/design-history/science-g7-ch07
node build/check-reference-fit.mjs class-7/ch07-heat-transfer-in-nature --block=89,963
node build/check-science-g7-ch07.mjs
python build/verify-science-g7-ch07.py
```

The PDF verifier expects the studio on port 5180 and the original preservation
snapshot in `build/_class7-ch07-review/before.json`. Proofs and facing-page review
images are kept in that scratch directory. Exports are in `build/class-7/`.

Before Chapter 7 authoring, Chapter 6 was committed and pushed to main as
`fb53c2b`. Chapter 7 remains local and uncommitted for review. Unrelated local
scratch files were preserved.
