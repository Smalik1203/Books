# Food on Our Plate — redesigned science edition

Uses the shared `science-editorial` profile and `science-tall` edition:
189 × 272 mm final trim, muted ochre chapter palette, Spectral body text and
Poppins headings. Each HTML fragment is one printed page.

## Source and rebuild

The original 28-page traced reconstruction is preserved at
`assets/design-history/before-science-tall/ch03-food-on-our-plate/`.
`assets/manuscripts/ch03-extracted.json` is the lossless extraction from that
version. Do not re-extract it from the redesigned pages.

```sh
python build/prepare-science-food.py
node build/set-science-food.mjs
node build/build.mjs class-6/ch03-food-on-our-plate --png --pdf --bleed
node build/check-reference-fit.mjs class-6/ch03-food-on-our-plate --block=89,963
```

Preparation repairs the trace's reading order, collects activity steps,
attaches labels to artwork, converts empty recording grids into notebook
instructions, and reconstructs the six-step food journey. The setter measures
real font widths, preserves complete panels and balances fixed printed pages.
The long nutrient table is presented as illustrated entries. These operations
are reproducible in the two scripts; preserve manual changes before rerunning.

Existing images remain under `figures/reference/food/`. Some contain raster
labels and photographic backgrounds. This design pass does not constitute a
full scientific or production-image review. See `SCIENCE-TEMPLATE.md` for the
shared design and checks. The cover spine is set separately using final page
count and paper caliper.
