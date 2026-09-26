# ClassBridge videos

Narrated explainer films, one per chapter introduction, worked example and
question, rendered from code in the book's own colours, faces and
furniture. Class 6 Chapter 1 is the pilot and the model:
`scenes/class-6/ch01-patterns/`.

```bash
cd video
npm install                     # puppeteer-core, ffmpeg-static
pip install edge-tts            # the voice
node node_modules/ffmpeg-static/install.js   # if npm skipped the binary (it did here)

node render.mjs scenes/class-6/ch01-patterns/02-example-1.mjs            # one film
node render.mjs scenes/class-6/ch01-patterns                              # every film in a chapter
node render.mjs <scene> --still=4,20,61                                   # PNG frames, no film
node render.mjs <scene> --html                                            # page + narration; open with #play
node contact.mjs out/class-6/math-ch01-patterns/02-example-1              # stills on one sheet
```

Films land in `out/<class>/<chapter>/<id>.mp4` with an `.srt` beside them.
`out/` and `.cache/` are gitignored; the scene files are the source.

## How a film is made

A scene is one module: some markup, some CSS, and a list of **beats**.
A beat is one sentence or two of narration and the actions that go with it:

```js
{ say: 'Next, the six, and the four just after it. Six plus four is ten.',
  do: [['cls', '.n5', { c: 'g2', at: '15%' }],
       ['fadeUp', '.r2', { at: '75%' }]] }
```

The narration is spoken first (edge-tts, `en-IN-NeerjaExpressiveNeural`,
cached by its words in `.cache/`), and each beat lasts exactly as long as
its voice. An action's `at` is placed inside its own beat — seconds, a share
of the sentence (`'75%'`), or `'end-0.3'` — so **the picture waits for the
voice**, and rewording a sentence re-times everything after it without
touching a number.

`hold` adds silence after a beat's narration for an animation to finish;
`pause` (default 0.45s) is the breath between beats.

Actions (`stage/stage.js`): `fadeUp` `fadeIn` `fadeOut` `dim` `pop` `pulse`
`draw` (an SVG stroke drawn along its length) `wipe` `move` `count`, and
`cls`/`uncls` to switch a class on at a moment. `stagger` spaces the
elements a selector matches. The first action to touch an element sets its
starting state, so a dot that pops in at 40s is invisible before it — there
is no separate "hide" step.

The page is **seeked, not played**: `seek(t)` rebuilds every element's state
from nothing for the time `t`, so each frame is exact whatever order it is
rendered in. Headless Chrome seeks to every frame at 30 fps and ffmpeg
encodes them under the mixed narration. A 100-second film takes about three
minutes.

## Writing a scene

* **Maths is `$...$`**, set by KaTeX exactly as in the book. Write the
  markup with `String.raw` or `\times` arrives as a tab — the renderer
  refuses a collapsed escape rather than setting a blank.
* **The chapter's colour comes from its palette file**, through `source`
  (`class-6/math-ch01-patterns`). Never write a chapter colour into a scene.
* **Box colours mean what they mean in print**: sky examples, mauve
  exercise sets, berry key ideas and answers, sunflower and sky for two
  quantities in a diagram.
* **Say the maths as a teacher would say it aloud.** The voice reads text,
  not notation: "two times eleven, minus one", never "2 × 11 − 1".
* **Show why, not only what.** Every pilot film has one picture that
  explains the answer rather than restating it: the slanting lines of a
  6 × 6 square, the Monday column of a calendar, the L-shapes of odd
  numbers.
* **No word alone on a line**, as in print. `text-wrap: pretty` is on, but
  does not always act on two lines; tie the last two words with `.nb`.
* Check with `--still` and `contact.mjs` before rendering a film. Every
  layout fault in the pilot was visible on a still: a caption over a
  calendar row, a dot square under the question card, a checkerboard where
  there should have been slanting lines.
