# Chapter 2 V2 production record

The V2 pilot is a separate edition under `pages/class-6/ch02-diversity-in-the-living-world-v2/`, with subject `Science V2`. The current Science chapter is not replaced. The shared builder has one additive profile stylesheet hook; V2 styles are scoped to `.page--science-v2`.

## Build

```text
node build/compose-science-ch02-v2.mjs
node build/build.mjs class-6/ch02-diversity-in-the-living-world-v2 --pdf --bleed
node build/check-science-v2.mjs
node build/check-science-v2-pagination.mjs
node build/check-reference-fit.mjs class-6/ch02-diversity-in-the-living-world-v2 --block=89,963
node build/audit-science-v2.mjs
node build/check-science-regressions.mjs
```

The source manuscript is revised through the existing editorial corrections, then composed independently. Do not run the justification scripts on V2: all body and comparison text now has a natural right edge.

The current chapter has 29 pages: one designed opener, 23 lesson pages, dedicated glossary and summary pages, and three pages of assessment and further investigations. The earlier 28-page refinement was followed by the user-requested teaching enrichment described below. The trim remains 189 × 272 mm. The reusable opener uses a straight-edged forest-green band, a subtle vector gradient, an integrated number column and live white title. The garden and introduction align with the reading column, with deliberate 36-unit white gutters separating the three sections. The garden keeps its complete content and natural aspect ratio at the reading-column width. The band extends through the edition's top and side bleed. The opening invitation has its own emphasis; folios sit at least 3 mm inside the trim. See [opener-system.md](opener-system.md) for the component, palette roles, long-title behaviour and adoption checks.

`science-v2-comparisons.mjs` owns parallel comparison bullets; `science-v2-prose.mjs` owns concise editorial rewrites. The five thinking pauses cover field-observation limits, plant classification, prediction versus evidence, animal grouping, and a fair conservation comparison. Activities keep their safety instructions, materials and investigative sequence. Tables label sample records and separate predictions from observations; captions and missing-data legends stay attached.

`science-v2-cues.mjs` owns the V2-only panel headings. Investigate and Think It Through use matching vector magnifier and head/question-mark icons on a 24-unit grid, with the same 32-unit viewport, rounded 2-unit stroke, optical alignment and label gap. The label baseline is 43 units below the panel top. The compact icons share the title's role colour and remain crisp in print; this refinement preserves all panel body positions and page breaks.

The retention trail is deliberately independent of the new layout:

- `teaching-baseline.json` is frozen from the earlier V2 atoms. Do not regenerate it from the revised chapter.
- `refinement-ledger.json` maps complete original passages and table cells to their replacements. Every replacement must appear in print.
- `atoms.json` identifies source blocks; comparison entries identify individual alternatives and bullets. Original teaching points, investigation directions, table rows and cells, glossary definitions, summary points and assessment questions are checked.
- `page-map.json` records allocated block bounds, source pages and explicit keep relationships.
- `render-audit.json` records actual rendered bounds, footer clearance, text collisions, panel bounds and each short-page exception. Allocated height includes normal trailing spacing, so it is slightly larger than visible content height.

The compositor minimises page count, then balances bottom gaps. It does not stretch paragraph spacing, shrink body type, or split bordered panels. The 88–96% lesson occupancy range is a target, not a blanket pass claim: some complete illustrated units and investigations require a lower fill, and a few nearly full pages retain a complete unit. The rendered audit names the following protected block and intervening prose for every page below 88% visible occupancy. Glossary, summary, chapter opener and final exercise closure retain their separate roles.

## Teaching enrichment and page balance

The requested enrichment adds 20 short explanations and assessment extensions (931 words), anchored to their teaching passages in `build/science-v2-enrichment.mjs`. These include counting kinds versus individuals, interpreting relationship arrows, repeatable grouping rules, tracing stems and veins, comparing same-aged seedlings, reading prediction columns, recording movement sequences, overlapping animal groups, and connecting a feature to its function. The prediction-table explanation stays with its table. No new feature boxes or textbook writing spaces were added.

`enrichment-ledger.json` records each addition's exact anchor, teaching purpose, text and any factual reference. Font measurement includes all new words before composition. Retention checks verify every addition, its sequence, and the table relationship, alongside the frozen original teaching baseline. The original opener, glossary and summary text remain unchanged, as do the existing investigation steps, safety instructions and five thinking pauses.

Actual lesson occupancy rose from 86.9% to 91.1% on average. Pages below 88% fell from 14 of 22 to 4 of 23; the remaining short lesson pages are 3, 8, 15 and 18, at roughly 86–88%, with protected-unit explanations in `render-audit.json`. The largest lesson bottom gap fell from 47.9 mm to 33.2 mm. The added instruction extends the chapter from 28 to 29 pages. Original type size, paragraph spacing and artwork sizes are preserved; the dedicated summary and final page retain natural lower whitespace.

## Artwork

New PNGs were generated with the built-in image-generation tool, inspected, and copied into the project. Briefs:

- `figures/class-6/science/ch02-v2/opener-v2.png`: wide, naturalistic gouache school-garden scene in India, with layered vegetation, a mango tree, hibiscus, tulsi, crow, butterfly and ants; people small in the distance; no generated lettering. Original generation: `exec-9e423291-696f-4d08-b037-b24ba2fb5741.png`.
- `figures/class-6/science/ch02-v2/forms-v2.png`: transparent botanical comparison of tomato herb, rose shrub and mango tree, left to right, with visible stem structure, natural proportions and complete silhouettes; no lettering. Original generation: `exec-10d90d25-67c6-46d6-9547-f70d435e37c3.png`.
- `figures/class-6/science/ch02-v2/root-setup-v2.png`: transparent practical setup showing unsprouted chana and wheat on cotton in separate trays; no roots or shoots, so the picture does not reveal an investigation's result. Original generation: `exec-3bee050d-f36a-4d01-a4f3-e07c52f83e67.png`.

Original generations are retained under the task's `C:/Users/shoai/.codex/generated_images/01a08f44-e225-7cf0-9a45-5f0bbac193fa/` directory. Other scientifically checked illustrations are independent copies in the V2 asset directory, not mutable links into V1. The V2 chapter does not claim every specimen has been newly illustrated.

## Typography

Source Serif 4 and Source Sans 3 are vendored from Adobe's official `adobe-fonts/source-serif` and `adobe-fonts/source-sans` release branches. SIL Open Font Licence files accompany them. TrueType releases are used for standard PDF font embedding. Body is 24 sheet units with 32-unit leading, approximately 12.2/16.3 pt at this trim; narrow comparisons keep a natural right edge.

## Print status

The deliverables are RGB reading and bleed PDFs for review. The 1536-pixel opener is approximately 248 effective ppi at its reading-column placement, below the design brief's preferred 300 ppi. It is not artificially upsampled. A physical colour proof and printer-specific colour conversion remain necessary before press approval. Do not describe these files as a certified press master.

Current PDF page proofs and facing spreads are under `build/_enrichment-review/`. Automated fit checks are necessary but do not replace reading and visual inspection.
