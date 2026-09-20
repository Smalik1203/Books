# Chapter 2 release review

## Scope

Built only Class 7 Science Chapter 2 from the supplied sixteen-page source PDF.
The source pages, illustrations, seven activities and twelve questions were
reviewed before composition. Every substantive teaching point is linked in
source-coverage.json; additions and corrections also live with manuscript IDs.
The prior completed work was pushed separately in commit 8c5b9a1. This chapter
is new local work and has not been committed or pushed.

## Layout and artwork

- 20 pages; 189 × 272 mm reading trim; established 3 mm bleed and 7 mm slug
  produce the existing approximately 209 × 292 mm press sheet.
- Full-width green opener, regular serif 2, semibold two-line title, centred
  CHAPTER label; its band covers top and side bleed. Image and body have distinct
  gutters and share the reading grid.
- Source Serif 4 body at the established size and leading, Source Sans 3 heads,
  left-aligned text, matching live feature icons and labels.
- Ten photorealistic generated PNG assets with genuine alpha transparency.
  Images have no border, frame or rectangular photographic backdrop. Native
  pixels and transparency masks survive PDF export. The colour comparison is
  marked illustrative; it is used again in the assessment.
- Six complete Investigate panels and three complete thinking panels; activity
  pictures stay inside their panels. Filtration artwork was corrected to show
  a supported funnel. No result-colour image is placed in an unperformed setup.
- Parallel comparison bullets, three framed tables with attached guidance and
  dedicated glossary/summary pages. Titles do not repeat on continuation pages.

## Page balance

Average measured occupied lesson height: 89.2%. The opener measures 95.8%.
The measure is actual rendered content, not the builder's outer-SVG 100%.
Short lesson pages and the responsible protected groups are recorded in
render-audit.json. Page 4 is the largest exception (81.4%): the next food heading
and complete thought panel cannot fit. Other short lessons measure 86.1–87.8%.
The last lesson page ends at 86.8% before the dedicated glossary. References,
assessment and final projects have deliberate lower margins. Type, artwork and
paragraph gaps were not enlarged to consume spare height.

Focused additions explain contaminated droppers, two-paper inference, food
concentrations, filtration, obscured indicator colours, plant/solution differences,
working controls, smell uncertainty, mixing, environmental comparisons and hidden
message controls. Each is placed at its relevant teaching point and marked as an
addition, rather than appended as unrelated page filler.

## Verification

Every full reading-PDF page was visually inspected, including the opener at a
larger scale and the bleed sheet. No clipping, text/figure collisions, detached
captions, divided panels or footer collisions were found. The small running
motif was moved wholly inside its ribbon. Reading and bleed exports have live
embedded fonts, native images and correct page count/size.

Content checks retain all seven source activities, all twelve assessment questions,
four closing explorations, ten definitions and nine summary points. Internal SVG
bounds checks and Science pagination/contract/chapter regressions pass. The local
preservation snapshot verifies 1,267 existing Class 6/7 pages, assets and styles
unchanged. The studio registers the chapter under Class 7 → Science.

For reproducible numeric results, consult verification.json and render-audit.json.
Image-generation prompts and paths are in image-prompts.json; the built-in tool
was used, with all final assets copied into the repository.
