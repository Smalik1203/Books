# duplicate 6

Independent editable copy of Class 6 Science Chapter 2, Diversity in the Living World.
Created at the user's request. Keep the original unchanged unless the user explicitly requests applying changes to it.

- Pages: pages/class-6/duplicate-6/ (25 copied printed pages).
- Illustrations: figures/class-6/science/duplicate-6/ (separate physical copies).
- Original: pages/class-6/ch02-diversity-in-the-living-world/ and figures/class-6/science/ch02/.
- The library title is duplicate 6; the printed chapter content, chapter number and science-tall edition are preserved.
- Its private opener styles are in `css/palette-duplicate-6.css`; keep edits scoped to its `duplicate6-` components. Page 1 uses larger, left-aligned copy with deliberate line breaks; do not run the production justification tool over it.
- `scienceVocabulary: september-2026-original` preserves this copy's feature labels after the production vocabulary changed. Other chapters still use the current contract by default.

Edit only the duplicate pages and duplicate illustrations for work on this copy. Do not run build/compose-science-ch02.mjs: it writes the original chapter. Do not modify shared stylesheets or shared compositors for duplicate-only requests; isolate any future style or compositor changes to this copy first. Never copy edits back to the original without explicit user instruction.

Build separately:

    node build/build.mjs class-6/duplicate-6
    node build/check-reference-fit.mjs class-6/duplicate-6 --block=89,963

This is a working copy, not an additional chapter in the production Science volume. The current class-wide binder discovers all chapter directories, so exclude or relocate this working copy before a production class-wide bind.
