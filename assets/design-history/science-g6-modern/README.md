# Class 6 Science design migration

Chapters 1–4 are updated to the Class 7 typography, tall trim, opener and page furniture, soft investigation/thinking panels, left-aligned text and comparison tables. Current extents: 9, 28, 32 and 25 pages.

Chapter 10 is work in progress. The user stopped its work on 2026-09-23 to continue later. Its generated sources are retained; its final verification and PDF rebuild are outstanding. Do not include it in a completion claim or regenerate it when working only on Chapters 1–4.

## Verification

- All 1,080 original text units and every teaching image in Chapters 1–4 remain represented.
- All 94 pages pass body bounds, heading typography, image loading and internal SVG label bounds checks.
- Reading and bleed PDFs rebuilt at the established sheet sizes.
- Science contract and food investigation regressions pass.
- Hash checks confirm Class 7 pages, shared styles and artwork remain unchanged.
- Occupancy is not uniformly 88–96%. Whole investigations, diagrams, summaries and teaching groups cause shorter pages. Per-chapter `page-map.json` and `render-audit.json` record bounds and the protected next group. No type shrinking or artificial paragraph stretching was used.

## Regeneration

Run `node build/compose-science-g6-modern.mjs N` for one chapter, then the normal chapter builder with `--pdf --bleed`. Omitting N also includes the paused Chapter 10, so specify the chapter explicitly.

Run `node build/audit-science-g6-modern.mjs 1 2 3 4`, `python build/check-science-g6-retention.py 1 2 3 4`, `python build/proof-science-g6-modern.py 1 2 3 4` and `node build/check-science-regressions.mjs` for the completed scope.

The original sources are archived in `source-pages.json`; content extraction, editorial changes and composition are separate scripts. The per-chapter editorial ledger records transformations. Do not overwrite the original snapshot. No commit or push was made for this migration.
