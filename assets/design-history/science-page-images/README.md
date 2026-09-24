# A content image on every Science page

User request, 24 September 2026: check all twelve chapters in Class 6 and all
twelve in Class 7, and include at least one content image on every page.
Header artwork and feature icons do not satisfy this requirement.

The original 531 pages included 256 without a content image. The revised
chapters contain 590 pages, all illustrated. Existing teaching copy, questions,
qualifications and instructional images remain. Pagination preserves reading
type sizes and complete panels, tables and questions. The extra pages allow
space for illustrations without squeezing text.

The shared compositor reserves 220 SVG units only for otherwise unillustrated
pages, using a 180-unit identification illustration and a normal-size caption.
The topic catalogue reuses existing transparent PNG artwork. Eight new painted
PNG cutouts were made with built-in image generation; original locations,
hashes, alpha measurements and prompts are recorded here. Existing images keep
their size. The dense food summary places its small image beside its opening
paragraph. The long diversity glossary uses two complete reference panels.

Rebuilds reproduce the illustrations. The main builder rejects unillustrated
Class 6/7 Science pages. Chapter counts and reading-folio sequences are checked.
Whitespace caused by complete reference pages and protected learning blocks is
retained; new images do not change the text scale or stretch paragraph spacing.

## Verification

- `python build/check-science-page-images.py`: every source page, image assets,
  transparency and all original teaching text/image references.
- `node build/verify-science-page-images.mjs`: all 24 reading/bleed builds,
  rendered collisions, panel bounds, folios and reference fits. Optional chapter
  arguments rebuild just those chapters and preserve the remaining audit results.
- `python build/check-science-pdf-images.py`: embedded PDF images, page counts
  and 189 × 272 mm reading trim.
- `node build/check-science-v2-pagination.mjs`: protected pagination and image
  reservation; decorative icons do not count.
- Nineteen chapter-specific source checks, the five modern Class 6 retention
  checks, and science contract/investigation-order checks pass.

All 24 reading PDFs were rendered with Poppler. Contact sheets were inspected
across every chapter, including dense references and exercise pages; temporary
proof images remain under `tmp/science-image-proofs/`. Reports here are the
durable evidence. The immutable source snapshot is `source-pages.json`.
