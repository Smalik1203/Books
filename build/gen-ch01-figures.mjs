#!/usr/bin/env node
/* ============================================================
   Chapter 1 figures — coordinate planes and room plans.

     node build/gen-ch01-figures.mjs

   Every figure in this chapter is a coordinate grid or a plan
   drawn on one, and the arithmetic of laying out ticks, labels
   and furniture by hand is where the mistakes live. So the
   drawings are generated once, from the same helpers, and
   spliced into the page fragments at their <!--FIG:x--> marker.
   The page files stay the source of truth: the SVG lands in
   them, and this script is only how it got there.

   Everything it emits obeys the design system — no inline
   styles, no colours, no stroke widths, no font attributes.
   Only the .dg-* vocabulary from css/diagram.css.

   One rule holds every drawing together: a figure carries
   roughly 4.48 viewBox units per printed millimetre, the same
   density as the rest of the book, so a structural line is the
   same weight on every page.
   ============================================================ */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = path.join(ROOT, 'pages', 'class-9', 'ch01-coordinates');

/* Printed widths, in mm, of the figure scale — matched to the
   viewBox width so that units-per-mm stays constant. */
const VB = { full: 690, xl: 390, lg: 322 };

const n = (v) => Number(v.toFixed(2));

/* ---- A coordinate plane ------------------------------------
   Returns the projection functions plus the grid and the axes,
   so every plane in the chapter is ruled the same way. */
function plane(o) {
  const { xmin, xmax, ymin, ymax, unit, padL, padR, padT, padB } = o;
  const X = (x) => n(padL + (x - xmin) * unit);
  const Y = (y) => n(padT + (ymax - y) * unit);
  const w = padL + (xmax - xmin) * unit + padR;
  const h = padT + (ymax - ymin) * unit + padB;
  return { X, Y, w: n(w), h: n(h), ...o };
}

function grid(p) {
  const v = [];
  for (let x = Math.ceil(p.xmin); x <= p.xmax; x++) v.push(`M${p.X(x)} ${p.Y(p.ymin)} V${p.Y(p.ymax)}`);
  for (let y = Math.ceil(p.ymin); y <= p.ymax; y++) v.push(`M${p.X(p.xmin)} ${p.Y(y)} H${p.X(p.xmax)}`);
  return `<g class="dg-grid"><path d="${v.join(' ')}"/></g>`;
}

/* The axes are plain structural lines. The book keeps a single
   arrowhead for measurements and rearrangements, so an axis
   does not wear one — the ruled grid already says where it goes. */
function axes(p) {
  return [
    `<line class="dg-line" x1="${p.X(p.xmin)}" y1="${p.Y(0)}" x2="${p.X(p.xmax)}" y2="${p.Y(0)}"/>`,
    `<line class="dg-line" x1="${p.X(0)}" y1="${p.Y(p.ymin)}" x2="${p.X(0)}" y2="${p.Y(p.ymax)}"/>`,
  ].join('\n    ');
}

/* Tick numerals. skip lets a plan hide the numbers that would
   collide with a label sitting on the axis. */
function ticks(p, o = {}) {
  const { xstep = 1, ystep = 1, skipX = [], skipY = [], side = 'below' } = o;
  const out = [];
  for (let x = Math.ceil(p.xmin); x <= p.xmax; x += xstep) {
    if (x === 0 || skipX.includes(x)) continue;
    out.push(`<line class="dg-thin" x1="${p.X(x)}" y1="${n(p.Y(0) - 4)}" x2="${p.X(x)}" y2="${n(p.Y(0) + 4)}"/>`);
    out.push(`<text class="dg-label--sm" x="${p.X(x)}" y="${n(p.Y(0) + (side === 'below' ? 17 : -9))}" text-anchor="middle">${x < 0 ? '–' + Math.abs(x) : x}</text>`);
  }
  for (let y = Math.ceil(p.ymin); y <= p.ymax; y += ystep) {
    if (y === 0 || skipY.includes(y)) continue;
    out.push(`<line class="dg-thin" x1="${n(p.X(0) - 4)}" y1="${p.Y(y)}" x2="${n(p.X(0) + 4)}" y2="${p.Y(y)}"/>`);
    out.push(`<text class="dg-label--sm" x="${n(p.X(0) - 8)}" y="${n(p.Y(y) + 4)}" text-anchor="end">${y < 0 ? '–' + Math.abs(y) : y}</text>`);
  }
  return out.join('\n    ');
}

/* Axis names, set where they cannot land on a tick numeral. */
function axisNames(p, o = {}) {
  const { xAt = p.xmax, yAt = p.ymax } = o;
  return [
    `<text class="dg-note" x="${n(p.X(xAt) + 10)}" y="${n(p.Y(0) - 6)}">x-axis</text>`,
    `<text class="dg-note" x="${n(p.X(0) + 8)}" y="${n(p.Y(yAt) - 8)}">y-axis</text>`,
  ].join('\n    ');
}

/* A plotted point: a teal disc and its name. */
function dot(p, x, y, label, o = {}) {
  const { dx = 9, dy = -8, anchor = 'start' } = o;
  const bits = [`<circle class="dg-fill-teal" cx="${p.X(x)}" cy="${p.Y(y)}" r="4"/>`];
  if (label) bits.push(`<text class="dg-label" x="${n(p.X(x) + dx)}" y="${n(p.Y(y) + dy)}" text-anchor="${anchor}">${label}</text>`);
  return bits.join('\n    ');
}

const rect = (p, cls, x1, y1, x2, y2) =>
  `<rect class="${cls}" x="${p.X(Math.min(x1, x2))}" y="${p.Y(Math.max(y1, y2))}" width="${n(Math.abs(x2 - x1) * p.unit)}" height="${n(Math.abs(y2 - y1) * p.unit)}"/>`;

const note = (p, x, y, text, anchor = 'middle') =>
  `<text class="dg-note" x="${p.X(x)}" y="${n(p.Y(y) + 4)}" text-anchor="${anchor}">${text}</text>`;

const label = (p, x, y, text, o = {}) =>
  `<text class="dg-label${o.sm ? ' dg-label--sm' : ''}${o.onFill ? ' dg-label--on-fill' : ''}" x="${n(p.X(x) + (o.dx || 0))}" y="${n(p.Y(y) + (o.dy || 0))}" text-anchor="${o.anchor || 'middle'}">${text}</text>`;

/* A point that sits ON an axis gets its name in a lane of its
   own — a second row under the tick numerals, or a second column
   left of them. Sharing a lane with the numerals is what made the
   first proof read "B4" where it meant "B two" beside a 4. */
const xTag = (p, x, text, anchor = 'middle', dx = 0) =>
  `<text class="dg-label" x="${n(p.X(x) + dx)}" y="${n(p.Y(0) + 34)}" text-anchor="${anchor}">${text}</text>`;

const yTag = (p, y, text) =>
  `<text class="dg-label" x="${n(p.X(0) - 28)}" y="${n(p.Y(y) + 5)}" text-anchor="end">${text}</text>`;

/* The drawing carries the name it was spliced in under, so a
   re-run can find and replace it. Without that the marker is
   gone after the first splice and the script becomes one-shot. */
const svg = (w, h, aria, body) => (name) =>
  `<svg data-fig="${name}" viewBox="0 0 ${n(w)} ${n(h)}" role="img" aria-label="${aria}">\n    ${body}\n  </svg>`;

/* ============================================================
   The room. Reiaan's bedroom is 12 ft by 10 ft with its
   south-west corner at the origin; the bathroom is 6 ft by 9 ft
   immediately to its west, so it occupies negative x.
   ============================================================ */
const ROOM = {
  bed: [1, 5, 7, 8],
  wardrobe: [3, 0, 7, 2],
  bath: [-6, 0, 0, 9],
  shower: [-6, 5, -2, 9],
};

/* ---- Fig 1.1 — the plan, before any axes ------------------- */
function fig11() {
  const p = plane({ xmin: -6, xmax: 12, ymin: 0, ymax: 10, unit: 34, padL: 40, padR: 38, padT: 34, padB: 30 });
  const b = [
    rect(p, 'dg-fill-a-soft', 0, 0, 12, 10),
    rect(p, 'dg-fill-c-soft', ...ROOM.bath),
    rect(p, 'dg-fill-b-soft', ...ROOM.shower),
    rect(p, 'dg-fill-b-soft', ...ROOM.bed),
    rect(p, 'dg-fill-b-soft', ...ROOM.wardrobe),

    `<rect class="dg-line" x="${p.X(0)}" y="${p.Y(10)}" width="${12 * p.unit}" height="${10 * p.unit}"/>`,
    `<rect class="dg-line" x="${p.X(-6)}" y="${p.Y(9)}" width="${6 * p.unit}" height="${9 * p.unit}"/>`,
    `<rect class="dg-thin" x="${p.X(1)}" y="${p.Y(8)}" width="${6 * p.unit}" height="${3 * p.unit}"/>`,
    `<rect class="dg-thin" x="${p.X(3)}" y="${p.Y(2)}" width="${4 * p.unit}" height="${2 * p.unit}"/>`,
    `<rect class="dg-thin" x="${p.X(-6)}" y="${p.Y(9)}" width="${4 * p.unit}" height="${4 * p.unit}"/>`,

    note(p, 9.6, 4.6, 'Bedroom'),
    label(p, 9.6, 4.0, '12 ft × 10 ft', { sm: true, dy: 4 }),
    note(p, -3, 2.6, 'Bathroom'),
    label(p, -3, 2.0, '6 ft × 9 ft', { sm: true, dy: 4 }),
    note(p, -4, 7, 'Shower'),
    note(p, 4, 6.5, 'Bed'),
    note(p, 5, 1, 'Wardrobe'),

    // the two doorways, drawn as gaps in the wall with a swing
    `<line class="dg-ghost" x1="${p.X(0)}" y1="${p.Y(1.5)}" x2="${p.X(0)}" y2="${p.Y(4)}"/>`,
    `<path class="dg-ghost" d="M${p.X(0)} ${p.Y(4)} A ${2.5 * p.unit} ${2.5 * p.unit} 0 0 1 ${p.X(2.5)} ${p.Y(1.5)}"/>`,
    `<line class="dg-ghost" x1="${p.X(8)}" y1="${p.Y(0)}" x2="${p.X(11.5)}" y2="${p.Y(0)}"/>`,
    // the leaf swings about its hinge at D₁, so the arc is centred there
    `<path class="dg-ghost" d="M${p.X(11.5)} ${p.Y(0)} A ${3.5 * p.unit} ${3.5 * p.unit} 0 0 0 ${p.X(8)} ${p.Y(3.5)}"/>`,
    note(p, 9.7, 0.5, 'Door'),
    note(p, -1.2, 2.75, 'Door', 'end'),
  ];
  return svg(p.w, p.h,
    'A floor plan of a bedroom twelve feet by ten feet with a bed and a wardrobe, and a bathroom six feet by nine feet beside it containing a shower',
    b.filter(Boolean).join('\n    '));
}

/* ---- Fig 1.2 — the structure of the plane ------------------ */
function fig12() {
  const p = plane({ xmin: -7, xmax: 7, ymin: -5, ymax: 5, unit: 40, padL: 54, padR: 76, padT: 32, padB: 28 });
  const b = [
    grid(p), axes(p),
    ticks(p, { skipX: [4, 5], skipY: [] }),
    axisNames(p),
    dot(p, 4.5, 0, 'B (4.5, 0)', { dx: 8, dy: -10 }),
    dot(p, -2.9, 0, 'E (–2.9, 0)', { dx: -8, dy: -10, anchor: 'end' }),
    dot(p, 0, 4, 'H (0, 4)', { dx: 10, dy: 4 }),
    dot(p, 0, -4.5, 'G (0, –4.5)', { dx: 10, dy: 4 }),
    dot(p, 0, 0, 'O (0, 0)', { dx: -10, dy: 16, anchor: 'end' }),
  ];
  return svg(p.w, p.h,
    'A coordinate plane with the origin O, the point B at four point five zero on the x-axis, E at minus two point nine zero, H at zero four and G at zero minus four point five on the y-axis',
    b.join('\n    '));
}

/* ---- Fig 1.3 — the room on axes ---------------------------- */
function fig13() {
  const p = plane({ xmin: -1, xmax: 13, ymin: -1, ymax: 11, unit: 38, padL: 86, padR: 72, padT: 30, padB: 34 });
  const b = [
    grid(p),
    rect(p, 'dg-fill-a-soft', 0, 0, 12, 10),
    rect(p, 'dg-fill-b-soft', ...ROOM.bed),
    rect(p, 'dg-fill-b-soft', ...ROOM.wardrobe),
    axes(p),
    ticks(p, { skipX: [12, 13], skipY: [-1, 9, 10, 11] }),
    axisNames(p, { xAt: 13 }),

    `<rect class="dg-line" x="${p.X(0)}" y="${p.Y(10)}" width="${12 * p.unit}" height="${10 * p.unit}"/>`,
    `<rect class="dg-thin" x="${p.X(1)}" y="${p.Y(8)}" width="${6 * p.unit}" height="${3 * p.unit}"/>`,
    `<rect class="dg-thin" x="${p.X(3)}" y="${p.Y(2)}" width="${4 * p.unit}" height="${2 * p.unit}"/>`,
    note(p, 4, 6.5, 'Bed'),
    note(p, 5, 1, 'Wardrobe'),

    // the two doorways
    `<line class="dg-dim" x1="${p.X(8)}" y1="${p.Y(0)}" x2="${p.X(11.5)}" y2="${p.Y(0)}"/>`,
    `<line class="dg-dim" x1="${p.X(0)}" y1="${p.Y(1.5)}" x2="${p.X(0)}" y2="${p.Y(4)}"/>`,

    dot(p, 0, 0, null),
    dot(p, 12, 0, 'A (12, 0)', { dx: 7, dy: 14 }),
    dot(p, 12, 10, 'B (12, 10)', { dx: 7, dy: -8 }),
    dot(p, 0, 10, 'C (0, 10)', { dx: 8, dy: -10 }),
    dot(p, 8, 0, null), dot(p, 11.5, 0, null),
    dot(p, 0, 1.5, null), dot(p, 0, 4, null),
    dot(p, 1, 5, null), dot(p, 7, 5, null), dot(p, 7, 8, null), dot(p, 1, 8, null),
    dot(p, 3, 0, null), dot(p, 7, 0, null), dot(p, 7, 2, null), dot(p, 3, 2, null),
    dot(p, 0, 9, null),

    xTag(p, 0, 'O (0, 0)', 'end', -6),
    xTag(p, 3, 'W₁'),
    xTag(p, 7, 'W₂'),
    xTag(p, 8.15, 'D₁'),
    xTag(p, 11.5, 'R₁'),
    yTag(p, 1.5, 'B₁'),
    yTag(p, 4, 'B₂'),
    yTag(p, 9, 'F'),
    label(p, 1, 5, 'S₁', { dx: -6, dy: 14, anchor: 'end' }),
    label(p, 7, 5, 'S₂', { dx: 8, dy: 14, anchor: 'start' }),
    label(p, 7, 8, 'S₃', { dx: 8, dy: -6, anchor: 'start' }),
    label(p, 1, 8, 'S₄', { dx: -6, dy: -6, anchor: 'end' }),
    label(p, 7, 2, 'W₃', { dx: 8, dy: -6, anchor: 'start' }),
    label(p, 3, 2, 'W₄', { dx: -6, dy: -6, anchor: 'end' }),
  ];
  return svg(p.w, p.h,
    'Reiaan’s room drawn on coordinate axes, with corners O, A, B and C, the bed, the wardrobe, the room door from D one to R one and the bathroom door from B one to B two',
    b.join('\n    '));
}

/* ---- Fig 1.4 — the four quadrants -------------------------- */
function fig14() {
  const p = plane({ xmin: -9, xmax: 8, ymin: -5, ymax: 4, unit: 36, padL: 26, padR: 52, padT: 28, padB: 24 });
  const b = [
    grid(p), axes(p),
    ticks(p, {}),
    axisNames(p),
    note(p, -6, 3.4, 'Quadrant II'),
    note(p, 5.2, 3.4, 'Quadrant I'),
    note(p, -6, -4.3, 'Quadrant III'),
    note(p, 5.2, -4.3, 'Quadrant IV'),
    dot(p, -5, 3, 'Q (–5, 3)', { dx: 9, dy: 5 }),
    dot(p, 3, -5, 'S (3, –5)', { dx: 9, dy: 5 }),
    dot(p, 0, 0, 'O (0, 0)', { dx: 9, dy: -8 }),
  ];
  return svg(p.w, p.h,
    'A coordinate plane with the four quadrants named, the point Q at minus five three in the second quadrant and S at three minus five in the fourth',
    b.join('\n    '));
}

/* ---- Fig 1.5 — room, bathroom and the dining room below ---- */
function fig15() {
  const p = plane({ xmin: -7, xmax: 13, ymin: -1, ymax: 11, unit: 27, padL: 78, padR: 72, padT: 30, padB: 34 });
  const b = [
    grid(p),
    rect(p, 'dg-fill-a-soft', 0, 0, 12, 10),
    rect(p, 'dg-fill-c-soft', ...ROOM.bath),
    rect(p, 'dg-fill-b-soft', ...ROOM.shower),
    rect(p, 'dg-fill-b-soft', ...ROOM.bed),
    rect(p, 'dg-fill-b-soft', ...ROOM.wardrobe),
    axes(p),
    ticks(p, { skipX: [12, 13], skipY: [-1, 9, 10, 11] }),
    axisNames(p, { xAt: 13 }),

    `<rect class="dg-line" x="${p.X(0)}" y="${p.Y(10)}" width="${12 * p.unit}" height="${10 * p.unit}"/>`,
    `<rect class="dg-line" x="${p.X(-6)}" y="${p.Y(9)}" width="${6 * p.unit}" height="${9 * p.unit}"/>`,
    `<rect class="dg-thin" x="${p.X(-6)}" y="${p.Y(9)}" width="${4 * p.unit}" height="${4 * p.unit}"/>`,
    `<rect class="dg-thin" x="${p.X(1)}" y="${p.Y(8)}" width="${6 * p.unit}" height="${3 * p.unit}"/>`,
    `<rect class="dg-thin" x="${p.X(3)}" y="${p.Y(2)}" width="${4 * p.unit}" height="${2 * p.unit}"/>`,

    note(p, 4, 6.5, 'Bed'),
    note(p, 5, 1, 'Wardrobe'),
    note(p, -4, 7, 'Shower'),
    note(p, -3, 2, 'Bathroom'),

    `<line class="dg-dim" x1="${p.X(8)}" y1="${p.Y(0)}" x2="${p.X(11.5)}" y2="${p.Y(0)}"/>`,
    `<line class="dg-dim" x1="${p.X(0)}" y1="${p.Y(1.5)}" x2="${p.X(0)}" y2="${p.Y(4)}"/>`,

    dot(p, 0, 0, null),
    dot(p, 12, 0, 'A (12, 0)', { dx: 7, dy: 14 }),
    dot(p, 12, 10, 'B (12, 10)', { dx: 7, dy: -8 }),
    dot(p, 0, 10, 'C (0, 10)', { dx: 8, dy: -8 }),
    dot(p, -6, 9, 'R', { dx: -8, dy: -6, anchor: 'end' }),
    dot(p, 0, 9, 'F', { dx: -6, dy: -6, anchor: 'end' }),
    dot(p, -6, 5, 'S', { dx: -8, dy: 5, anchor: 'end' }),
    dot(p, -2, 5, 'H', { dx: 7, dy: 14, anchor: 'start' }),
    dot(p, -2, 9, 'W', { dx: 6, dy: -6, anchor: 'start' }),
    dot(p, -6, 0, null),
    dot(p, 8, 0, null), dot(p, 11.5, 0, null),
    dot(p, 0, 1.5, null), dot(p, 0, 4, null),
    dot(p, 1, 5, null), dot(p, 7, 5, null), dot(p, 7, 8, null), dot(p, 1, 8, null),
    dot(p, 3, 0, null), dot(p, 7, 0, null), dot(p, 7, 2, null), dot(p, 3, 2, null),

    xTag(p, -6, 'P'),
    xTag(p, 0, 'O (0, 0)', 'end', -6),
    xTag(p, 3, 'W₁'),
    xTag(p, 6.85, 'W₂'),
    xTag(p, 8.15, 'D₁'),
    xTag(p, 11.5, 'R₁'),
    yTag(p, 1.5, 'B₁'),
    yTag(p, 4, 'B₂'),
    label(p, 1, 5, 'S₁', { dx: -5, dy: 13, anchor: 'end' }),
    label(p, 7, 5, 'S₂', { dx: 6, dy: 13, anchor: 'start' }),
    label(p, 7, 8, 'S₃', { dx: 6, dy: -5, anchor: 'start' }),
    label(p, 1, 8, 'S₄', { dx: -5, dy: -5, anchor: 'end' }),
    label(p, 7, 2, 'W₃', { dx: 6, dy: -5, anchor: 'start' }),
    label(p, 3, 2, 'W₄', { dx: -5, dy: -5, anchor: 'end' }),
  ];
  return svg(p.w, p.h,
    'Reiaan’s bedroom and the bathroom beside it, both drawn on coordinate axes, with the shower area S H W R in the bathroom and the bathroom corners O, F, R and P marked',
    b.join('\n    '));
}

/* ---- Fig 1.6 / 1.7 — triangle ADM -------------------------- */
function triangle(withFoot) {
  const p = plane({ xmin: -1, xmax: 10, ymin: -1, ymax: 7, unit: 28, padL: 34, padR: 52, padT: 28, padB: 30 });
  const b = [
    grid(p), axes(p),
    ticks(p, {}),
    axisNames(p, { xAt: 10 }),
  ];
  if (withFoot) {
    b.push(`<path class="dg-fill-a-soft" d="M${p.X(3)} ${p.Y(4)} L${p.X(3)} ${p.Y(1)} L${p.X(7)} ${p.Y(1)} Z"/>`);
    b.push(`<line class="dg-thin" x1="${p.X(3)}" y1="${p.Y(4)}" x2="${p.X(3)}" y2="${p.Y(1)}"/>`);
    b.push(`<line class="dg-thin" x1="${p.X(3)}" y1="${p.Y(1)}" x2="${p.X(7)}" y2="${p.Y(1)}"/>`);
    b.push(`<path class="dg-thin" d="M${p.X(3)} ${p.Y(1.35)} h${n(0.35 * p.unit)} v${n(0.35 * p.unit)}"/>`);
  }
  b.push(`<path class="dg-line" d="M${p.X(3)} ${p.Y(4)} L${p.X(7)} ${p.Y(1)} L${p.X(9)} ${p.Y(6)} Z"/>`);
  b.push(dot(p, 3, 4, 'A (3, 4)', { dx: -8, dy: -8, anchor: 'end' }));
  b.push(dot(p, 7, 1, 'D (7, 1)', { dx: 8, dy: 16 }));
  b.push(dot(p, 9, 6, 'M (9, 6)', { dx: 6, dy: -8, anchor: 'end' }));
  if (withFoot) b.push(dot(p, 3, 1, 'C (3, 1)', { dx: -8, dy: 14, anchor: 'end' }));
  return svg(p.w, p.h,
    'Triangle A D M in the first quadrant with A at three four, D at seven one and M at nine six' +
    (withFoot ? ', and the right angle at C at three one below A' : ''),
    b.join('\n    '));
}

/* ---- Fig 1.8 — the general case ---------------------------- */
function fig18() {
  const w = VB.xl, h = 250;
  const ax = 80, ay = 40, dx = 330, dy = 190;
  const b = [
    `<path class="dg-fill-a-soft" d="M${ax} ${ay} L${ax} ${dy} L${dx} ${dy} Z"/>`,
    `<line class="dg-line" x1="${ax}" y1="${ay}" x2="${dx}" y2="${dy}"/>`,
    `<line class="dg-thin" x1="${ax}" y1="${ay}" x2="${ax}" y2="${dy}"/>`,
    `<line class="dg-thin" x1="${ax}" y1="${dy}" x2="${dx}" y2="${dy}"/>`,
    `<path class="dg-thin" d="M${ax} ${dy - 14} h14 v14"/>`,
    `<line class="dg-dim" x1="${ax - 26}" y1="${ay}" x2="${ax - 26}" y2="${dy}" marker-start="url(#dg-arrow)" marker-end="url(#dg-arrow)"/>`,
    `<text class="dg-dim-label" x="${ax - 34}" y="${(ay + dy) / 2}" text-anchor="middle" transform="rotate(-90 ${ax - 34} ${(ay + dy) / 2})">y₂ – y₁</text>`,
    `<line class="dg-dim" x1="${ax}" y1="${dy + 28}" x2="${dx}" y2="${dy + 28}" marker-start="url(#dg-arrow)" marker-end="url(#dg-arrow)"/>`,
    `<text class="dg-dim-label" x="${(ax + dx) / 2}" y="${dy + 48}" text-anchor="middle">x₂ – x₁</text>`,
    `<circle class="dg-fill-teal" cx="${ax}" cy="${ay}" r="4"/>`,
    `<circle class="dg-fill-teal" cx="${dx}" cy="${dy}" r="4"/>`,
    `<circle class="dg-fill-teal" cx="${ax}" cy="${dy}" r="4"/>`,
    `<text class="dg-label" x="${ax - 6}" y="${ay - 10}" text-anchor="start">A (x₁, y₁)</text>`,
    `<text class="dg-label" x="${dx + 6}" y="${dy + 18}" text-anchor="end">D (x₂, y₂)</text>`,
    `<text class="dg-label" x="${ax - 8}" y="${dy + 20}" text-anchor="middle">F (x₁, y₂)</text>`,
  ];
  return svg(w, h,
    'A right-angled triangle with the segment A D as its hypotenuse, a vertical leg of length y two minus y one and a horizontal leg of length x two minus x one',
    b.join('\n    '));
}

/* ---- Fig 1.9 — the triangle reflected in the y-axis -------- */
function fig19() {
  const p = plane({ xmin: -10, xmax: 10, ymin: -1, ymax: 7, unit: 30, padL: 44, padR: 46, padT: 30, padB: 32 });
  const tri = (s) => `<path class="dg-line" d="M${p.X(3 * s)} ${p.Y(4)} L${p.X(7 * s)} ${p.Y(1)} L${p.X(9 * s)} ${p.Y(6)} Z"/>`;
  const b = [
    grid(p), axes(p),
    ticks(p, {}),
    axisNames(p, { xAt: 10 }),
    `<path class="dg-fill-a-soft" d="M${p.X(-3)} ${p.Y(4)} L${p.X(-3)} ${p.Y(1)} L${p.X(-7)} ${p.Y(1)} Z"/>`,
    tri(1), tri(-1),
    dot(p, 3, 4, 'A (3, 4)', { dx: -8, dy: 5, anchor: 'end' }),
    dot(p, 7, 1, 'D (7, 1)', { dx: 7, dy: 16 }),
    dot(p, 9, 6, 'M (9, 6)', { dx: 6, dy: -8, anchor: 'end' }),
    dot(p, -3, 4, 'A′ (–3, 4)', { dx: 8, dy: 5, anchor: 'start' }),
    dot(p, -7, 1, 'D′ (–7, 1)', { dx: -7, dy: 16, anchor: 'end' }),
    dot(p, -9, 6, 'M′ (–9, 6)', { dx: -6, dy: -8, anchor: 'start' }),
    dot(p, -3, 1, 'C′', { dx: -7, dy: 15, anchor: 'end' }),
  ];
  return svg(p.w, p.h,
    'Triangle A D M in the first quadrant and its mirror image A prime D prime M prime on the other side of the y-axis',
    b.join('\n    '));
}

/* ---- A timeline for the history ---------------------------- */
function timeline() {
  const w = VB.full, h = 176;
  const items = [
    ['c. 2600 BCE', 'Sindhu–Sarasvatī', 'streets on a grid'],
    ['c. 800 BCE', 'Baudhāyana', 'two directions, one theorem'],
    ['c. 499 CE', 'Āryabhaṭa', 'the sky mapped'],
    ['c. 628 CE', 'Brahmagupta', 'zero and the negatives'],
    ['c. 1000 CE', 'Al-Bīrūnī', 'coordinates across Asia'],
    ['1637 CE', 'Descartes', 'two numbers, any point'],
  ];
  const y = 74, x0 = 92, x1 = w - 92;
  const step = (x1 - x0) / (items.length - 1);
  const b = [`<line class="dg-line" x1="${x0}" y1="${y}" x2="${x1}" y2="${y}"/>`];
  items.forEach(([when, who, what], i) => {
    const x = n(x0 + i * step);
    const up = i % 2 === 0;
    b.push(`<circle class="dg-fill-teal" cx="${x}" cy="${y}" r="5"/>`);
    b.push(`<line class="dg-thin" x1="${x}" y1="${y}" x2="${x}" y2="${up ? y - 20 : y + 20}"/>`);
    const ty = up ? y - 30 : y + 42;
    b.push(`<text class="dg-dim-label" x="${x}" y="${ty}" text-anchor="middle">${when}</text>`);
    b.push(`<text class="dg-label" x="${x}" y="${up ? ty - 16 : ty + 16}" text-anchor="middle">${who}</text>`);
    b.push(`<text class="dg-note" x="${x}" y="${up ? ty - 32 : ty + 32}" text-anchor="middle">${what}</text>`);
  });
  return svg(w, h,
    'A timeline running from the Sindhu-Sarasvati grid cities through Baudhayana, Aryabhata, Brahmagupta and Al-Biruni to Descartes',
    b.join('\n    '));
}

/* ---- Splice ------------------------------------------------ */
const FIGURES = {
  'timeline': timeline(),
  '1.1': fig11(),
  '1.2': fig12(),
  '1.3': fig13(),
  '1.4': fig14(),
  '1.5': fig15(),
  '1.6': triangle(false),
  '1.7': triangle(true),
  '1.8': fig18(),
  '1.9': fig19(),
};

const files = (await readdir(PAGES)).filter(f => /^p\d+\.html$/.test(f)).sort();
const placed = new Set();
for (const f of files) {
  const file = path.join(PAGES, f);
  const src = await readFile(file, 'utf8');
  let out = src;
  for (const [name, make] of Object.entries(FIGURES)) {
    const body = make(name);
    const marker = `<!--FIG:${name}-->`;
    const already = new RegExp(`<svg data-fig="${name.replace('.', '\\.')}"[\\s\\S]*?</svg>`);
    if (out.includes(marker)) { out = out.split(marker).join(body); placed.add(name); }
    else if (already.test(out)) { out = out.replace(already, () => body); placed.add(name); }
  }
  if (out !== src) await writeFile(file, out);
}
const missing = Object.keys(FIGURES).filter(k => !placed.has(k));
console.log(`  ${placed.size} figure(s) in ${files.length} page(s)`);
if (missing.length) console.warn(`  ! never placed: ${missing.join(', ')}`);
