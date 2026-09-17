# Chapter 2 V2 production record

The V2 pilot is a separate edition under `pages/class-6/ch02-diversity-in-the-living-world-v2/`, with subject `Science V2`. The current Science chapter is not replaced. The shared builder has one additive profile stylesheet hook; V2 styles are scoped to `.page--science-v2`.

## Build

```text
node build/compose-science-ch02-v2.mjs
node build/build.mjs class-6/ch02-diversity-in-the-living-world-v2
node build/justify-science-prose.mjs class-6/ch02-diversity-in-the-living-world-v2
node build/build.mjs class-6/ch02-diversity-in-the-living-world-v2 --pdf --bleed
node build/check-science-v2.mjs
node build/check-reference-fit.mjs class-6/ch02-diversity-in-the-living-world-v2 --block=89,963
node build/check-science-regressions.mjs
```

The source manuscript is revised through the existing editorial corrections, then composed independently. `atoms.json` records the semantic blocks; `page-map.json` records placement. Full prose retention is checked against the semantic blocks. V2 adds the conservation evidence questions from the latest V1 revision and a concise relationship comparison.

## Artwork

New PNGs were generated with the built-in image-generation tool, inspected, and copied into the project. Briefs:

- `figures/class-6/science/ch02-v2/opener-v2.png`: wide, naturalistic gouache school-garden scene in India, with layered vegetation, a mango tree, hibiscus, tulsi, crow, butterfly and ants; people small in the distance; no generated lettering. Original generation: `exec-9e423291-696f-4d08-b037-b24ba2fb5741.png`.
- `figures/class-6/science/ch02-v2/forms-v2.png`: transparent botanical comparison of tomato herb, rose shrub and mango tree, left to right, with visible stem structure, natural proportions and complete silhouettes; no lettering. Original generation: `exec-10d90d25-67c6-46d6-9547-f70d435e37c3.png`.
- `figures/class-6/science/ch02-v2/root-setup-v2.png`: transparent practical setup showing unsprouted chana and wheat on cotton in separate trays; no roots or shoots, so the picture does not reveal an investigation's result. Original generation: `exec-3bee050d-f36a-4d01-a4f3-e07c52f83e67.png`.

Original generations are retained under the task's `C:/Users/shoai/.codex/generated_images/01a08f44-e225-7cf0-9a45-5f0bbac193fa/` directory. Other scientifically checked illustrations are independent copies in the V2 asset directory, not mutable links into V1. The V2 chapter does not claim every specimen has been newly illustrated.

## Typography

Source Serif 4 and Source Sans 3 are vendored from Adobe's official `adobe-fonts/source-serif` and `adobe-fonts/source-sans` release branches. SIL Open Font Licence files accompany them. TrueType releases are used for standard PDF font embedding. Body is 24 sheet units with 32-unit leading, approximately 12.2/16.3 pt at this trim; narrow comparisons keep a natural right edge.

## Print status

The deliverables are RGB reading and bleed PDFs for review. The 1536-pixel opener is approximately 200 effective ppi at its full-width placement, below the design brief's preferred 300 ppi. It is not artificially upsampled. A physical colour proof and printer-specific colour conversion remain necessary before press approval. Do not describe these files as a certified press master.

Full-page PNG proofs are under `tmp/pdfs/ch2-v2-proof/`. Automated fit checks are necessary but do not replace reading and visual inspection.
