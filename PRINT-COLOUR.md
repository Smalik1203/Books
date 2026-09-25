# Maths colour preparation — maplitho matte

Paper choice supplied by the user: **maplitho matte** (21 September 2026).
Treat this as uncoated paper, not matte-coated art paper.

## Provisional reference condition

Use **PSO Uncoated v3 (FOGRA52)** for provisional colour checks. This is a
reference for wood-free uncoated white paper, not a measured profile of the
user's specific stock or press. The printer's supplied ICC profile and ink
limit take precedence. Confirm the paper shade and printing process before
making production separations.

Official profile information and download:

- https://registry.color.org/profile-registry/PSOuncoated_v3_FOGRA52
- https://eci.org/doku.php_id=en_downloads.html

Keep downloaded profiles local under `build/_print-colour-checks/`; do not
redistribute the ECI profile as a repository asset. Its licence permits use
and embedding but restricts redistribution.

## Check performed

All 14 currently used maths palettes, including their deep, soft and tint
variants, were converted from sRGB through this ICC profile: **140 values**.
Relative colorimetric rendering with black-point compensation was used.
Maximum total ink coverage across these palette values was **261.6%**, below
this reference profile's **300%** limit. This does not measure whole-page ink
coverage, overprints, photographs, or a different printer's lower ink limit.

The paper-relative display simulation shows visible changes, especially in
dark brown and olive colours. It must not be presented as identical to the
screen original or as a prediction of the exact paper. RGB preview values
must not replace the source palette values: that would apply the simulation
again during conversion.

Re-run the check after palette changes, or with the printer's actual profile:

```powershell
python build/check-print-palettes.py --profile <printer-profile.icc> --pdfs
```

The script writes measured recipes and diagnostic values to
`build/_print-colour-checks/audit.json`, plus the side-by-side comparison in
`build/_print-colour-checks/index.html`. Colour differences are approximate
8-bit CIE76 diagnostics, not press acceptance tolerances. The preview does
not simulate absolute paper white.

## Current PDF status

The nine maths bleed PDFs contain RGB painting operations and have **no
CMYK output intent**. Chrome's PDF export and the `--bleed` flag do not perform
CMYK separation. These files are review/layout masters, not certified CMYK
or PDF/X delivery files.

Before press delivery:

1. Convert a copy with colour-managed prepress software using the printer's
   confirmed destination ICC profile; assigning a profile alone is not conversion.
2. Preserve small black text and neutral fine rules as black-only where
   appropriate; do not turn body text into four-colour rich black.
3. Inspect separations, total ink, transparency and overprint behaviour.
   Check small reversed text and pale panel/table tints on the actual stock.
4. Supply the printer's requested PDF/X format and output intent. Verify
   fonts, trim, bleed and page count after conversion.
5. Approve a physical proof on the specified maplitho paper before the run.

No palette has been recoloured solely to match an unconfirmed press profile.
No existing book PDF was silently replaced by a provisional CMYK conversion.
