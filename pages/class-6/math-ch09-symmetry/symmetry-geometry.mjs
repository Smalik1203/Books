/* Geometry for check-numbers.mjs: reads a figure out of its SVG and finds
   its symmetries by moving the drawn points and comparing the result with
   what was drawn.

   A figure is a list of sampled points, each tagged with the class it was
   drawn in (an outline, a thin division, a fill of one role or another),
   and a list of the primitives those points came from. A move is a
   symmetry when every moved point lands on a primitive of the SAME class,
   within a small tolerance. Fills are compared by their outline and their
   class, so a shaded half cannot be carried onto a light one.

   Nothing here knows what any figure is meant to show. */

import fs from 'node:fs';

/* ---- reading an SVG ------------------------------------------- */

const num = (s) => Number(s);
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`));
  return m ? m[1] : null;
};
const pairs = (s) => s.trim().split(/\s+/).map(p => p.split(',').map(num));

/* Classes that are never part of the figure itself: the paper, the
   helpers that mark a line or a centre, measurements and labels. */
const SKIP = /^(dg-grid|dg-note|dg-label|dg-dim|dg-dim-label|dg-move|dg-tick|dg-axis)$/;

/* An SVG arc, endpoint form, turned into points. */
function arcPoints(x1, y1, rx, ry, rot, large, sweep, x2, y2) {
  // circles only (rx == ry, no rotation) — all this chapter draws
  const r = rx;
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
  const d2 = dx * dx + dy * dy;
  const rr = Math.max(r, Math.sqrt(d2));
  let f = Math.sqrt(Math.max(0, rr * rr / d2 - 1));
  if (large === sweep) f = -f;
  const cx = (x1 + x2) / 2 + f * dy;
  const cy = (y1 + y2) / 2 - f * dx;
  let a1 = Math.atan2(y1 - cy, x1 - cx);
  let a2 = Math.atan2(y2 - cy, x2 - cx);
  let da = a2 - a1;
  if (sweep && da < 0) da += 2 * Math.PI;
  if (!sweep && da > 0) da -= 2 * Math.PI;
  const n = Math.max(8, Math.ceil(Math.abs(da) * rr / 1.5));
  const out = [];
  for (let i = 0; i <= n; i++) {
    const a = a1 + da * i / n;
    out.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
  }
  return out;
}

function pathPolylines(d) {
  const toks = d.match(/[MLHVAZmlhvaz]|-?\d*\.?\d+(?:e-?\d+)?/g);
  const lines = [];
  let cur = null, x = 0, y = 0, sx = 0, sy = 0, i = 0, cmd = null;
  const nextNum = () => num(toks[i++]);
  while (i < toks.length) {
    if (/[A-Za-z]/.test(toks[i])) cmd = toks[i++];
    switch (cmd) {
      case 'M': x = nextNum(); y = nextNum(); sx = x; sy = y; cur = [[x, y]]; lines.push(cur); cmd = 'L'; break;
      case 'L': x = nextNum(); y = nextNum(); cur.push([x, y]); break;
      case 'H': x = nextNum(); cur.push([x, y]); break;
      case 'V': y = nextNum(); cur.push([x, y]); break;
      case 'A': {
        const rx = nextNum(), ry = nextNum(), rot = nextNum(), la = nextNum(), sw = nextNum();
        const x2 = nextNum(), y2 = nextNum();
        const pts = arcPoints(x, y, rx, ry, rot, la, sw, x2, y2);
        cur.push(...pts.slice(1));
        x = x2; y = y2; break;
      }
      case 'Z': case 'z': cur.push([sx, sy]); x = sx; y = sy; break;
      default: throw new Error(`path command ${cmd} not handled`);
    }
  }
  return lines;
}

/* Every drawn element of an SVG, in source order. */
export function elements(svg) {
  const out = [];
  for (const m of svg.matchAll(/<(polygon|polyline|line|circle|path|text)\b([^>]*?)\/?>(?:([^<]*)<\/text>)?/g)) {
    const [, kind, rest, text] = m;
    const tag = ' ' + rest;
    const cls = attr(tag, 'class') || '';
    const el = { kind, cls };
    if (kind === 'polygon') { el.pts = pairs(attr(tag, 'points')); el.closed = true; }
    else if (kind === 'polyline') { el.pts = pairs(attr(tag, 'points')); el.closed = false; }
    else if (kind === 'line') el.pts = [[num(attr(tag, 'x1')), num(attr(tag, 'y1'))], [num(attr(tag, 'x2')), num(attr(tag, 'y2'))]];
    else if (kind === 'circle') { el.c = [num(attr(tag, 'cx')), num(attr(tag, 'cy'))]; el.r = num(attr(tag, 'r')); }
    else if (kind === 'path') el.lines = pathPolylines(attr(tag, 'd'));
    else if (kind === 'text') { el.at = [num(attr(tag, 'x')), num(attr(tag, 'y'))]; el.text = text; }
    out.push(el);
  }
  return out;
}

/* The SVG of a numbered figure, found by its caption, in any page. */
export function figureSvg(dir, fignum) {
  for (const f of fs.readdirSync(dir).filter(f => /^p\d+\.html$/.test(f)).sort()) {
    const html = fs.readFileSync(`${dir}/${f}`, 'utf8');
    for (const fig of html.matchAll(/<figure>([\s\S]*?)<\/figure>/g)) {
      const cap = fig[1].match(/<span class="fignum">Fig\. ([\d.]+)<\/span>/);
      if (cap && cap[1] === fignum) {
        const svg = fig[1].match(/<svg[\s\S]*?<\/svg>/)[0];
        return { svg, page: f, caption: fig[1].match(/<figcaption>([\s\S]*?)<\/figcaption>/)[1] };
      }
    }
  }
  throw new Error(`no figure ${fignum} in ${dir}`);
}

/* ---- a figure as primitives ----------------------------------- */

/* A primitive is a segment {a, b, cls} or a circle {c, r, cls}. */
export function primitives(els, keep = () => true) {
  const prims = [];
  const seg = (a, b, cls) => {
    if (Math.hypot(a[0] - b[0], a[1] - b[1]) > 1e-9) prims.push({ a, b, cls });
  };
  for (const e of els) {
    if (e.kind === 'text') continue;
    const cls = e.cls;
    if (SKIP.test(cls) || !keep(e)) continue;
    if (e.pts) {
      for (let i = 0; i + 1 < e.pts.length; i++) seg(e.pts[i], e.pts[i + 1], cls);
      if (e.closed) seg(e.pts[e.pts.length - 1], e.pts[0], cls);
    } else if (e.c) prims.push({ c: e.c, r: e.r, cls });
    else if (e.lines) for (const l of e.lines) for (let i = 0; i + 1 < l.length; i++) seg(l[i], l[i + 1], cls);
  }
  return prims;
}

/* Where an element sits, for sorting it into a panel. */
export function centreOf(e) {
  if (e.c) return e.c;
  if (e.at) return e.at;
  const pts = e.pts || e.lines.flat();
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
}

/* The class a symmetry must preserve. Outlines drawn twice (a fill and
   then its outline) are one thing; the two strokes are kept apart only
   where the chapter uses them for different things. */
export const role = (cls) => {
  if (cls === 'dg-line' || cls === 'dg-plot') return 'line';
  if (cls === 'dg-thin') return 'thin';
  if (cls === 'dg-hidden' || cls === 'dg-ghost') return 'dashed';
  return cls.replace(/-soft$/, '-soft');
};

function samples(prims, step = 1) {
  const pts = [];
  for (const p of prims) {
    const r = role(p.cls);
    if (p.a) {
      const L = Math.hypot(p.b[0] - p.a[0], p.b[1] - p.a[1]);
      const n = Math.max(1, Math.ceil(L / step));
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        pts.push({ x: p.a[0] + (p.b[0] - p.a[0]) * t, y: p.a[1] + (p.b[1] - p.a[1]) * t, r, w: L / (n + 1) });
      }
    } else {
      const L = 2 * Math.PI * p.r;
      const n = Math.max(12, Math.ceil(L / step));
      for (let i = 0; i < n; i++) {
        const a = 2 * Math.PI * i / n;
        pts.push({ x: p.c[0] + p.r * Math.cos(a), y: p.c[1] + p.r * Math.sin(a), r, w: L / n });
      }
    }
  }
  return pts;
}

function distToPrim(x, y, p) {
  if (p.c) return Math.abs(Math.hypot(x - p.c[0], y - p.c[1]) - p.r);
  const [ax, ay] = p.a, [bx, by] = p.b;
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - ax - t * dx, y - ay - t * dy);
}

/* A figure, ready to be moved. */
export function figure(prims, { step = 1, tol = 0.35 } = {}) {
  const pts = samples(prims, step);
  // a coarse grid of primitives by role, so a lookup is quick
  const G = 6, cells = new Map();
  const key = (r, i, j) => `${r}|${i}|${j}`;
  for (const p of prims) {
    const r = role(p.cls);
    let x0, x1, y0, y1;
    if (p.a) { x0 = Math.min(p.a[0], p.b[0]); x1 = Math.max(p.a[0], p.b[0]); y0 = Math.min(p.a[1], p.b[1]); y1 = Math.max(p.a[1], p.b[1]); }
    else { x0 = p.c[0] - p.r; x1 = p.c[0] + p.r; y0 = p.c[1] - p.r; y1 = p.c[1] + p.r; }
    for (let i = Math.floor((x0 - tol) / G); i <= Math.floor((x1 + tol) / G); i++)
      for (let j = Math.floor((y0 - tol) / G); j <= Math.floor((y1 + tol) / G); j++) {
        const k = key(r, i, j);
        if (!cells.has(k)) cells.set(k, []);
        cells.get(k).push(p);
      }
  }
  const onFigure = (x, y, r) => {
    const list = cells.get(key(r, Math.floor(x / G), Math.floor(y / G)));
    return !!list && list.some(p => distToPrim(x, y, p) <= tol);
  };
  let W = 0, cx = 0, cy = 0;
  for (const p of pts) { W += p.w; cx += p.x * p.w; cy += p.y * p.w; }
  const cs = corners(prims);
  return { prims, pts, onFigure, corners: cs.sharp, vertices: cs.all, centroid: [cx / W, cy / W], tol };
}

/* The corners of a figure: every end of a segment where the drawing does
   not simply carry straight on. A leaning blade can be laid over its own
   mirror image so that every point lands near an edge, while its corners
   land beside one another; so corners must land on corners as well. */
function corners(prims) {
  const ends = [];
  for (const p of prims) {
    if (!p.a) continue;
    const r = role(p.cls);
    const d = Math.atan2(p.b[1] - p.a[1], p.b[0] - p.a[0]);
    ends.push({ x: p.a[0], y: p.a[1], r, d });
    ends.push({ x: p.b[0], y: p.b[1], r, d: d + Math.PI });
  }
  const groups = [];
  for (const e of ends) {
    const g = groups.find(g => g.r === e.r && Math.hypot(g.x - e.x, g.y - e.y) < 0.05);
    if (g) g.dirs.push(e.d); else groups.push({ x: e.x, y: e.y, r: e.r, dirs: [e.d] });
  }
  const out = [];
  for (const g of groups) {
    if (g.dirs.length === 0) continue;
    // two directions pointing (nearly) opposite ways: the drawing runs on
    const uniq = [];
    for (const d of g.dirs) if (!uniq.some(u => Math.abs(Math.sin(u - d)) < 1e-6 && Math.cos(u - d) > 0)) uniq.push(d);
    const straight = uniq.length === 2 && Math.cos(uniq[0] - uniq[1]) < Math.cos(Math.PI * 150 / 180);
    if (!straight) out.push(g);
  }
  return { sharp: out, all: groups };
}

/* Does the move carry the figure onto itself? Every point must land on
   the figure — a move keeps lengths, so that covers all of it — and every
   corner on a corner. */
export function fits(F, move) {
  for (const p of F.pts) {
    const [x, y] = move(p.x, p.y);
    if (!F.onFigure(x, y, p.r)) return false;
  }
  for (const c of F.corners) {
    const [x, y] = move(c.x, c.y);
    if (!F.vertices.some(k => k.r === c.r && Math.hypot(k.x - x, k.y - y) <= F.tol)) return false;
  }
  return true;
}

export const reflectIn = ([px, py], deg) => {
  const t = deg * Math.PI / 180, c = Math.cos(2 * t), s = Math.sin(2 * t);
  return (x, y) => {
    const dx = x - px, dy = y - py;
    return [px + dx * c + dy * s, py + dx * s - dy * c];
  };
};
/* Clockwise on the page: SVG's y axis points down. */
export const turnBy = ([px, py], deg) => {
  const t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
  return (x, y) => {
    const dx = x - px, dy = y - py;
    return [px + dx * c - dy * s, py + dx * s + dy * c];
  };
};

/* Lines of symmetry: every line through the centre that fits. A line of
   symmetry of a bounded figure passes through the centre of its drawn
   length, so no other line need be tried. Directions are tried every
   quarter degree; neighbouring hits are one line. */
export function linesOfSymmetry(F, about = F.centroid) {
  const hits = [];
  for (let q = 0; q < 720; q++) {
    const deg = q / 4;
    if (fits(F, reflectIn(about, deg))) hits.push(deg);
  }
  // merge runs (a line found at 44.75, 45 and 45.25 is one line)
  const lines = [];
  for (const h of hits) {
    const last = lines[lines.length - 1];
    if (last && h - last[last.length - 1] <= 0.5) last.push(h); else lines.push([h]);
  }
  if (lines.length > 1 && lines[0][0] === 0 && 180 - lines[lines.length - 1].slice(-1)[0] <= 0.5)
    lines[0].unshift(...lines.pop());
  if (hits.length > 600) return { count: Infinity, dirs: [] };
  return { count: lines.length, dirs: lines.map(l => l[Math.floor(l.length / 2)]) };
}

/* The angles of symmetry: every turn of 360/n degrees that fits, for n up
   to 72. The order is the number of angles, 360 included. A figure that
   fits every turn tried is a circle's kind of figure. */
export function angles(F, about = F.centroid) {
  const ok = [];
  for (let n = 1; n <= 72; n++) if (fits(F, turnBy(about, 360 / n))) ok.push(n);
  const order = Math.max(...ok);
  if (ok.length > 60) return { order: Infinity, smallest: 0 };
  return { order, smallest: 360 / order };
}

export function symmetries(prims, opts = {}) {
  const F = figure(prims, opts);
  const about = opts.about || F.centroid;
  return { lines: linesOfSymmetry(F, about).count, order: angles(F, about).order, F, about };
}
