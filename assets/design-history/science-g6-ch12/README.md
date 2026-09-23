# Class 6 Science Chapter 12: Beyond Earth

Twenty pages in the shared Science edition, 189 × 272 mm. All 23 instructional pages of the supplied PDF are mapped in `source-coverage.json`; its final blank Notes page is omitted. Four numbered investigations, eleven review questions, five projects and an original book-closing reflection are included. Scientific corrections and current primary references are recorded separately.

## Rebuild

```powershell
node build/record-science-g6-ch12.mjs
node build/compose-science-g6-ch12.mjs
node build/build.mjs class-6/ch12-beyond-earth --pdf --bleed
node build/audit-science-g6-ch12.mjs
node build/check-science-g6-ch12.mjs
node build/check-reference-fit.mjs class-6/ch12-beyond-earth --block=89,963
node build/check-science-regressions.mjs
```

Run `build/proof-science-g6-ch12.py` with the bundled Python runtime to verify PDF dimensions, live text and embedded image soft masks, then render every page with Poppler.

## Artwork and diagrams

Eight new illustrations were generated with the built-in image generator: the painted Ladakhi observing scene, refracting telescope, inner-planet row, outer-planet row, comet, galaxy, lunar lander/rover and conceptual observatory. The Sun and Moon reuse the established Class 7 Chapter 12 illustrations. All ten files are genuine RGBA PNGs; original paths, dimensions, hashes and transparent-pixel percentages are in `artwork.json`. Generation prompts are in `image-prompts.json`. No raster background-removal or repainting script was used.

Illustrations are sized for their instructional role: contextual opener; telescope 310 units beside observing instructions; Sun 240 and Moon 280 beside prose; planet rows 220; lander 290; comet 250; galaxy 300; observatory within its complete project. The summary repeats the galaxy at 220 units. None has a frame or rectangular background. Planet rows explicitly disclaim scale; lander and observatory are conceptual illustrations, not engineering diagrams or photographs of named sites.

Real star fields derive from the Bright Star Catalogue, fifth revised edition, J2000 coordinates. The downloaded extract and parsed coordinates are retained. The northern field uses a polar projection; the Orion/Taurus field uses a small-region sky projection. Both show selected stars, with qualitative brightness sizes and imaginary guide lines. Exercise fields use exactly the same positions without guide lines or names. The invented pattern activity is explicitly not a real sky map. All diagram labels remain selectable text.

The chapter opener uses the established 54-unit title and regular serif number, with a globe, Moon and Sun confined to the right-hand artwork column.

## Release review

All twenty page proofs were inspected, with full-size checks of the opener, both labelled star maps, planetary comparisons and assessment layouts. The glossary and summary have dedicated pages. No split panels, clipped text, escaped labels or image/text collisions were found.

Natural lower margins remain when complete figures, panels, tables, questions or paragraphs prevent further packing. `page-map.json` records these protected breaks and actual occupied heights; the outer SVG's 100% builder fill is not treated as content occupancy. Type, paragraph gaps and artwork were not inflated to fill these margins.

Checks passed: source retention, four activity sequences, eleven complete questions, five complete extensions, matching reference/exercise star coordinates, asset hashes and PNG transparency, rendered bounds, 609 lines within the reading measure, shared science regressions, sequential folios and trim/bleed PDF geometry. PDFs remain ignored and are copied to `output/pdf/` for distribution.
