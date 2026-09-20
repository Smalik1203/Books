# Transparent cutout correction

The previous edit changed file encoding only. The user's screenshots clarified that the rectangular photographic backgrounds themselves must disappear. Fourteen supporting images were edited with the built-in image editor and saved as RGBA PNGs under `figures/class-7/science/ch01-v2/cutouts/`. The chapter now references those distinct paths, avoiding stale opaque-image caches.

The complete prompts and generated file paths are in `cutout-prompts.json`. Original photographs remain in `photos/`; source/licence provenance and derivative changes are recorded in `photographs.json`. These edited photographic derivatives include reconstructed edges and should not be described as pixel-identical source records. The contextual opener is unchanged.

Cutouts remove tables, walls, sky/track backgrounds and black rectangles. The lake keeps its scenery with an irregular silhouette and transparent edge fade. Three foreground runners are isolated. The dice retain their reflections; the glass retains the pencil, waterline and apparent displacement; the sundial retains its visible shadows; the circular Earth and eclipse retain dark areas belonging to the subjects. No 2D drawing replaces a photograph.

Visual review on white paper confirms that the surrounding rectangles are gone. All 14 assets have RGBA channels and substantial fully transparent areas. PDF checks now require each supporting image's embedded transparency mask, in addition to live fonts, native asset dimensions and the ten-page extent. Content retention, internal SVG bounds, protected pagination and science regressions pass. Every final reading PDF page and spread was inspected. Existing unversioned Class 7 Science naming remains in place.

All 769 protected pre-existing files remain byte-identical. No commit or push.
