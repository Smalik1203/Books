# Class 6 Science — Chapter 6: Materials Around Us

An independent chapter authoring entry point using the shared Class 6/7 typography and 189 × 272 mm print edition. Existing chapters are not regenerated. The supplied PDF has 21 teaching pages and a final blank Notes page. Source references are PDF-page numbers; `source-coverage.json` records coverage and deliberate corrections.

All eight numbered activities are retained. Activity 6.3 is a reasoning task and uses Think It Through; the other seven use Investigate. Both learning games, all ten questions and four further projects remain. The chapter uses seven comparison tables, sixteen glossary definitions, a complete summary, and live labels over transparent painted PNGs. Historical material is contextualised and health instructions are adult-facing, not classroom recipes.

Artwork was produced with the built-in image generator. Exact briefs, saved project paths, hashes and alpha statistics are recorded in `artwork-prompts.json` and `artwork.json`. Contextual opener artwork is 874 units wide; material comparison strips are 235–300 units high; diagrams use live labels. Sizes follow the instructional role rather than page fill. Reference pages may end naturally, and the rendered audit records protected blocks causing shorter lesson pages.

```sh
node build/compose-science-g6-ch06.mjs
node build/record-science-g6-ch06.mjs
node build/build.mjs class-6/ch06-materials-around-us --pdf --bleed
node build/audit-science-g6-ch06.mjs
node build/check-science-g6-ch06.mjs
node build/check-reference-fit.mjs class-6/ch06-materials-around-us --block=89,963
node build/check-science-regressions.mjs
python build/proof-science-g6-ch06.py
```

The proof script renders every page from the final PDF with Poppler and checks both PDF page sizes, live text and image alpha masks. Generated PDFs and review sheets stay local under the repository ignore rules.
