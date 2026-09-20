# Illustrated revision — 20 September 2026

The user's follow-up requests the supporting visual references from the supplied PDF. All six source pages were visually compared with the V2 chapter; native image objects were also inspected. The original PDF contains several small or tiled pictures. New vector drawings preserve instructional clarity at enlargement, and a new painted running scene supplies the human context. No source watermark or decorative folio artwork is reproduced.

## What changed

Eleven visual groups now accompany the relevant topic text: fruit/stain, circuit, materials, ice/rocks, candle/water landscape, clock/sundial, runners, plant structures, mirrors, light/water setup, and day/night/eclipse. `illustration-coverage.json` identifies each source reference, treatment and fixed size. The original V2 opener and paper-plane investigation remain. The water landscape replaces the redundant abstract cards; the full evaporation/condensation explanation remains immediately adjacent.

The circuit uses distinct cell terminals and bulb base contacts. The spoon belongs to the circuit path. Its caption does not prescribe a glow, and nearby text explains why a dark lamp alone is insufficient evidence about the object. The mirror drawing uses a solid object, dashed image positions and two perpendicular reflecting surfaces. The eclipse drawing shows the Moon between Sun and Earth, with a shadow on Earth; it is explicitly not to scale. The light/water scene previews a teacher-led demonstration without a laser-handling task or required observation.

The illustrations are drawn at fixed instructional sizes. Each named topic retains its heading, image, caption and bullets as a complete unit. Different topics may fall on different pages. Body size and leading are unchanged. The chapter grows from eight to ten pages, with seven lesson pages rather than five.

## Visual and automated checks

All ten reading-PDF pages were inspected, including spreads 2–3, 4–5, 6–7 and 8–9. The updated circuit and eclipse were rechecked after correcting connection geometry and distinguishing shadow from light. The bleed opener was inspected: no white slivers at the top/side trim edges, and the original opener composition is preserved. The new running picture is clear at its 75.64 mm printed width; native 1536 × 1024 pixels provide approximately 516 ppi. Labels and line drawings remain live/vector.

The builder, 22-point source-retention check, 11-group visual-retention check, V2 pagination regressions, internal SVG fit check and rendered audit pass. All 366 lines fit without text collisions, artwork overlap or inconsistent leading. Panels are whole, captions remain with pictures, and folios are at least 3.3 mm inside trim.

Lesson occupancy is 92.5%, 92.4%, 89.1%, 86.8%, 96.5%, 87.8% and 92.2% (91.0% mean). Page 5 leaves the complete runners/topic unit for page 6. Page 7 leaves the following prose and complete Question the Answer sequence for page 8; the paginator balances that join without stretching gaps. These two small deviations below 88% have explicit protected-group records in `render-audit.json`. Page 6's 96.5% leaves 8.2 mm above the content boundary. Dedicated reference and final assessment pages remain intentional shorter pages.

Both PDF exports contain ten pages, embedded Source Serif 4 and Source Sans 3, and both native raster illustrations. Metadata and SHA256 values are in `verification.json`. Source-retention checks for both Class 6 V2 chapters, generic science regressions and the 769-file preservation snapshot pass. The studio reports Class 7 → Science V2 → Chapter 1, ten pages. No commit or push was made.
