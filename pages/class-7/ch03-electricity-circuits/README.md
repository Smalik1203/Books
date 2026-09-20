# Electricity: Circuits and their Components

Class 7 → Science, Chapter 3. Independent content and assets following the established Science print design, at 189 × 272 mm. `science-v2` is only the internal renderer profile; no public version label is used.

Source: `C:/Books/6-10 Books/7/7 Science/Chapter 3.pdf`.

Author in `build/science-g7-ch03-content.mjs`, not the generated `pNNN.html` pages. Electrical models live in `build/science-g7-ch03-diagrams.mjs`. Chapter identity rules are scoped in `css/palette-science-g7-ch03.css`; older chapters and global print settings are untouched.

Rebuild:

```sh
node build/compose-science-g7-ch03.mjs
node build/build.mjs class-7/ch03-electricity-circuits --pdf --bleed --png
node build/audit-science-g7-ch03.mjs
node build/check-reference-fit.mjs class-7/ch03-electricity-circuits --block=89,963
node build/check-science-g7-ch03.mjs
```

`build/verify-science-g7-ch03.py` verifies PDF sizes, embedded text and fonts, image alpha, older-file preservation, and studio registration, then renders final PDF pages and spread proofs. The before snapshot belongs under the ignored review directory.

All eleven source activities and questions and four projects remain represented. Setup and observation precede explanations. Current limiting, LED ratings, tester controls and other scientific qualifications are documented in `assets/design-history/science-g7-ch03/academic-review.md`. Generated-image provenance and exact prompts are recorded beside the source-coverage ledger and measured page audit.
