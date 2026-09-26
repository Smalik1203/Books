# Chapter 4 layout review — 26 September 2026

Scope: Class 6 Science, Exploring Magnets only. The 33-page starting version
is retained in `before.json`; the refit has 27 pages. `preserved.json` records
source hashes outside this chapter.

The refit places apparatus within complete activities and pairs each magnetic
game with its own illustration. The broken-magnet comparison uses the original
whole-magnet and two-piece cutouts in two rows. Iron filings have a larger
inspection view. Floating-model, ring-magnet and butterfly captions use normal
live caption text, independent of picture scaling. Explicit SVG clip paths keep
the game cutouts from exposing adjacent parts of the composite image.

Comparison cells use bullets. Thinking panels have equal 32-unit external gaps.
The redundant “How It Works” below “What Makes the Needle Work?” and the orphaned
generic opener heading were removed. Actual investigation explanations retain
their mechanism cues. The keyword reference retains all thirteen terms and adds
concise definitions. All seven activities, thinking-panel wording, original
teaching prose, safety instructions and native picture assets are preserved.
The retention ledger documents the separated comparison paragraphs, expanded
keywords and removed generic heading.

Validation:

- Chapter build: all 27 pages fit; no short-page warnings.
- Flow check: 88.0–99.5% occupied; intact panels, attached illustrations,
  comparison bullets, equal thinking gaps, clipped game pictures and live captions.
- Render audit: 27 pages, zero issues; preserved outside-chapter hashes unchanged.
- Retention check: 265 original text units; zero missing text or image assets
  after the explicit documented editorial transformations.
- Science contract regressions: ten cases passed, plus food-order regressions.
- Class 6 format check: all 334 illustrated science pages passed.
- All 27 pages were visually reviewed at 1300-pixel proof height. The opener,
  floating model, games, ring magnets and butterfly were reviewed again after
  visual corrections. Final page PNGs are under `build/class-6/ch04-review/`.

Outputs:

- `build/class-6/ch04-exploring-magnets.pdf` — 27 pages, nominal 189 × 272 mm trim.
- `build/class-6/ch04-exploring-magnets-bleed.pdf` — 27 press sheets, 208.87 × 292.10 mm.

The changes are local; no commit or push was made for this chapter.

Page 5 follow-up: replaced the recall-only material question with a coated-paper-clip puzzle requiring an alternative explanation and a distinguishing test, as requested. Moved the fair-comparison paragraph intact to page 6. Rebuilt trim and bleed PDFs; inspected pages 5 and 6. Chapter remains 27 pages; flow, source retention and science regression checks pass. The exact authorized wording change is recorded in the editorial ledger and retention revisions.

Caption alignment follow-up: Chapter 4 figure captions and the grouped games caption now use centred alignment, including the final line. Scope is limited to Chapter 4. Existing SVG captions already use middle anchors. Rebuilt both PDFs, verified all 27 pages fit, passed Chapter 4 flow and science regression checks, and visually checked the lodestone and ring-magnet proofs on pages 24 and 26.

Page 5 whitespace follow-up: pulled the complete existing fair-test paragraph (g6-4-038) from page 6 beneath the materials discussion. Both pages visually checked in the rebuilt PDF: page 5 fills 99%, page 6 fills 88%, with 27 pages retained. The compositor preserves this measured local pull. Content retention, Chapter 4 flow and science regression checks pass.

Page 20 follow-up: added a maze extension comparing magnet distances and asking how to distinguish weak attraction from a wall blocking the ball. The new paragraph follows the maze illustration and fills the page to 96%. Rebuilt trim and bleed PDFs; visually checked page 20. All 27 pages fit; content retention, Chapter 4 flow and science regression checks pass.

Page 13 enlargement: enlarged the needle-stroking and floating-compass pictures into a balanced two-column pair with live centred captions at the standard reading size. Page fill increased from 88% to 94%, with all 27 pages retained. Restored page 20 image sizes after the user clarified the intended page. Rebuilt PDFs, visually reviewed page 13, and passed flow, retention and science regression checks.

Page 20 text-flow follow-up: moved the maze extension into the same media block as its instructions and floated its illustration at the existing 400-unit width. Both paragraphs now flow alongside the image, with its centred caption below. Rebuilt both PDFs and visually checked page 20; all 27 pages fit and flow, retention and science regression checks pass.

Pages 20–21 follow-up: enlarged page 20's two game illustrations by 10% with matching 440-unit image columns; text remains connected beside the maze. Page 21 now wraps the clip and racing-car text around their images, adds a short clip observation prompt, and places the existing racing-car explanation with its activity. Printed fill is 96% and 95%. Both pages visually checked; rebuilt trim/bleed PDFs retain 27 pages. Flow, retention and science regression checks pass.
