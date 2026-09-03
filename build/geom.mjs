/* Authoring-time coordinate helper. NOT part of the book pipeline —
   nothing under pages/ depends on it. Run it to compute path data for a
   figure, paste the numbers into the page file.

   SVG screen convention: y grows downward, so a mathematical angle t is
   (cx + r cos t, cy - r sin t).

   usage:  node build/geom.mjs
*/
export const P = (x, y) => ({ x: +x.toFixed(2), y: +y.toFixed(2) });
export const on = (cx, cy, r, deg) => {
  const t = (deg * Math.PI) / 180;
  return P(cx + r * Math.cos(t), cy - r * Math.sin(t));
};
export const mid = (a, b) => P((a.x + b.x) / 2, (a.y + b.y) / 2);
export const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/* foot of the perpendicular from p to the line through a and b */
export const foot = (p, a, b) => {
  const dx = b.x - a.x, dy = b.y - a.y;
  const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy);
  return P(a.x + t * dx, a.y + t * dy);
};

/* the point equidistant from three non-collinear points */
export const circumcentre = (a, b, c) => {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  const ux = ((a.x ** 2 + a.y ** 2) * (b.y - c.y) + (b.x ** 2 + b.y ** 2) * (c.y - a.y) + (c.x ** 2 + c.y ** 2) * (a.y - b.y)) / d;
  const uy = ((a.x ** 2 + a.y ** 2) * (c.x - b.x) + (b.x ** 2 + b.y ** 2) * (a.x - c.x) + (c.x ** 2 + c.y ** 2) * (b.x - a.x)) / d;
  return P(ux, uy);
};

/* the perpendicular bisector of ab, as a segment of half-length len */
export const perpBisector = (a, b, len) => {
  const m = mid(a, b);
  const dx = b.x - a.x, dy = b.y - a.y;
  const n = Math.hypot(dx, dy);
  const ux = -dy / n, uy = dx / n;
  return [P(m.x - ux * len, m.y - uy * len), P(m.x + ux * len, m.y + uy * len)];
};

/* extend a beyond b by len */
export const extend = (a, b, len) => {
  const n = Math.hypot(b.x - a.x, b.y - a.y);
  return P(b.x + ((b.x - a.x) / n) * len, b.y + ((b.y - a.y) / n) * len);
};

/* where the ray a->b next meets the circle (cx,cy,r) */
export const rayHitsCircle = (a, b, cx, cy, r) => {
  const dx = b.x - a.x, dy = b.y - a.y;
  const fx = a.x - cx, fy = a.y - cy;
  const A = dx * dx + dy * dy, B = 2 * (fx * dx + fy * dy), C = fx * fx + fy * fy - r * r;
  const disc = Math.sqrt(B * B - 4 * A * C);
  const t = Math.max((-B + disc) / (2 * A), (-B - disc) / (2 * A));
  return P(a.x + t * dx, a.y + t * dy);
};

export const d = (...pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ');
export const show = (label, v) => console.log(label.padEnd(16), JSON.stringify(v));
