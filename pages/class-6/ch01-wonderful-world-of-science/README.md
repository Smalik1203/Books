# The Wonderful World of Science

Class 6 Science, Chapter 1. Eight fixed Crown Quarto pages using the
`science-editorial` profile. The design, sources and verification process are
in [SCIENCE-TEMPLATE.md](../../../SCIENCE-TEMPLATE.md).

The manuscript is archived under `assets/manuscripts/`. Body wording is
preserved. Text and furniture are editable SVG; artwork is raster. Some
reused illustrations remain below 300 ppi at their placed size.

```sh
node build/build.mjs class-6/ch01-wonderful-world-of-science --png --pdf --bleed
node build/check-reference-fit.mjs class-6/ch01-wonderful-world-of-science --block=89,963
```

Run both and inspect full-page proofs. Outer-SVG fill cannot prove its text
fits. The chapter-specific `build/redesign-science-ch01.mjs` rewrites all
eight source pages; preserve manual changes before rerunning it.

The previous reconstruction is under
`assets/design-history/science-before-redesign/`. Its historical method is
in [IMAGE-TO-PAGE-WORKFLOW.md](../../../IMAGE-TO-PAGE-WORKFLOW.md).
