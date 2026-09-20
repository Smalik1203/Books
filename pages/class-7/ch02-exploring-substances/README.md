# Class 7 Science — Chapter 2

**Exploring Substances: Acidic, Basic, and Neutral**

Twenty independent fixed print pages at 189 × 272 mm. Public subject and title
are unversioned; `profile: science-v2` selects the established internal compositor
styles only. This chapter neither changes older chapters nor creates a book card.

## Authoring

- `build/science-g7-ch02-content.mjs`: lesson, source IDs, glossary, summary,
  assessment and exploratory projects.
- `build/compose-science-g7-ch02.mjs`: measured live SVG type, complete panels,
  explicit comparison units and shared Science opener/pagination utilities.
- `css/palette-science-g7-ch02.css`: chapter-only green identity and small motif.
- `figures/class-7/science/ch02/`: ten native transparent PNG assets.
- `assets/design-history/science-g7-ch02/`: source coverage, image provenance,
  editorial ledger, measured bounds, preservation and PDF verification.

## Build and verify

```powershell
node build/compose-science-g7-ch02.mjs
node build/build.mjs class-7/ch02-exploring-substances --pdf --bleed --png
node build/audit-science-g7-ch02.mjs
node build/check-reference-fit.mjs class-7/ch02-exploring-substances --block=89,963
node build/check-science-g7-ch02.mjs
python build/verify-science-g7-ch02.py
```

The Python verifier uses pypdf, Pillow and Poppler. Its before-file snapshot is
a local review artifact in `build/_class7-ch02-review/before.json`; retain that
file to recheck this session's preservation claim. The regular content and bounds
checks do not depend on the local snapshot or on native image-generation paths.

All seven source activities are represented: six Investigate panels and the
safe recall/comparison version of Activity 2.2 in Think It Through. Two additional
thinking pauses address turmeric's limits and excess acid/base. All twelve source
questions remain, plus the carbonate question and three projects. No textbook
writing spaces, raster lettering or visible image-credit section is added.
