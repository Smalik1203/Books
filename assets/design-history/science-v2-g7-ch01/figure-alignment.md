# Chapter 1 figure alignment pilot

The September 24 review requested better alignment between supporting images and
the prose, with subtly heavier captions. This change applies only to Class 7
Science Chapter 1.

- Centre each single side illustration and its caption on the 336-unit right
  column (axis 795). Retain the paired material labels beneath their own objects.
- Use two equal 421-unit columns with a 32-unit gutter for paired observations;
  each caption shares its image's column axis.
- Set captions in the existing Source Sans 3 semibold face (600).
- Preserve every image's dimensions, aspect ratio, PNG bytes, caption wording,
  body text coordinates, justified lines, page breaks and folios.

`build/science-g7-ch01-figure-layout.mjs` applies these explicit placements to
existing pages and to newly composed pages. The justification audit uses the same
documented placement changes on its historical baseline; all text-preservation,
furniture, prose-position and other-chapter guards remain active.
