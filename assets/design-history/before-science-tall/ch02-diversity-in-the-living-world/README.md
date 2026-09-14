# Diversity in the Living World

Class 6 · Science · Chapter 2 · Crown Quarto · science-editorial profile.

The 29 draft manuscript divisions have been composed into 28 fixed printed
pages. All ten activities and ten exercise questions are retained. Text,
tables, diagrams, captions and page furniture are coded SVG; only the
foreground illustrations are raster PNGs.

The supplied manuscript is preserved unchanged at
`assets/manuscripts/LearnLab_G6_Ch02_Diversity_in_the_Living_World.md`.
The edited reading copy, explicit replacement audit, page audit and added
reading notes live under `assets/manuscripts/` and `assets/design-history/`.

`build/compose-science-ch02.mjs` is the authoring compositor. It measures
vendored Spectral and Poppins before setting lines, keeps activity panels
whole and writes the fixed HTML sources. Preserve manual edits before
rerunning it. It is not a runtime reflow engine.

Blank observation rows and spaces for writing, drawing or pasted leaf prints
have been removed. The textbook supplies examples and asks pupils to make
their own records in a notebook. Activity numbers and titles share one forest-green
tab, matching the accepted Chapter 1 treatment.

## Editorial corrections

The source wording is retained except for the recorded science corrections,
notebook directions and additional reading context. Notable corrections:

- Banana leaves have a prominent midrib and parallel lateral veins. Sources:
  [Kew, Musa description](https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:327926-2/general-information)
  and [banana leaf anatomy research](https://onlinelibrary.wiley.com/doi/full/10.1111/j.1365-3040.2009.01941.x).
- Camels have padded, two-toed feet; humps store fat, and camels can sweat.
  [San Diego Zoo: Camel](https://zoo.sandiegozoo.org/animals/camel).
- Amphibians are an animal group; using land and water does not make a
  crocodile an amphibian. [AMNH: Amphibians](https://www.amnh.org/explore/ology/biodiversity/tree-of-life2/amphibians).
- Janaki Ammal's documented 1952 appointment was Officer on Special Duty.
  [Botanical Survey of India newsletter](https://bsi.gov.in/uploads/documents/publications/e-newslatter/english/BSI%20NEWSLETTER%20%20AUGUST%202014.pdf).
- Cheetahs were declared extinct in India in 1952; reintroduction began in
  2022. [Government of India announcement](https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1860055&lang=2&reg=48).
- Root depth is qualified; a young cereal seedling's roots develop over time.
  Adaptation is distinguished from an individual plant's growth response.
  The summary and related exercises have been corrected consistently.

## Artwork

Thirteen new transparent-background illustrations are stored in
`figures/class-6/science/ch02/`. Comparisons are illustrative, not scale
drawings. Captions remain live text. Leaf venation, seed anatomy and visible
root systems were inspected alongside the final page proofs.

## Rebuild and check

```sh
node build/compose-science-ch02.mjs
node build/build.mjs class-6/ch02-diversity-in-the-living-world --png --pdf --bleed
node build/check-reference-fit.mjs class-6/ch02-diversity-in-the-living-world --block=89,963
```

The builder checks the outer SVG sheet; the second check measures its text.
`assets/design-history/ch02-page-audit.json` records actual occupied height,
source divisions and rendered reading content for each page. Full-sheet
proofs must also be reviewed for labels, table legibility and visual balance.
