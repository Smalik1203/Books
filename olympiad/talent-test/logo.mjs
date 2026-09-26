/* ============================================================
   The Galaxy Olympiad Academy seal, drawn rather than pasted.

   The 2025-26 paper carried it as a 204-pixel bitmap with the year
   baked into the ring, so it printed soft and could not be reused.
   This is the same seal as vector: the green ring, the name round
   the top, the bar mark and wordmark in the middle, a clover either
   side, and the session year round the foot, which is a parameter.

   Faces are the paper's own (Montserrat), so the seal only renders
   right inside a page that loads talent-test.css.
   ============================================================ */

const GREEN = '#063c29';
const RED = '#c8102e';
const SALMON = '#e8766c';
const CLOVER = '#5cae4f';

const pt = (cx, cy, r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [(cx + r * Math.cos(a)).toFixed(2), (cy - r * Math.sin(a)).toFixed(2)];
};

// A clover: four round leaves about a point.
const clover = (x, y) => [[-2.6, -2.6], [2.6, -2.6], [-2.6, 2.6], [2.6, 2.6]]
  .map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="2.9" fill="${CLOVER}"/>`).join('');

// A bar of the mark, its top cut on a slant as in the original.
const bar = (x, top, bottom, fill, w = 4) =>
  `<path d="M${x} ${top + 2.2}L${x + w} ${top}V${bottom}H${x}Z" fill="${fill}"/>`;

export function seal(year, id = 'seal') {
  const c = 100;
  // Name round the top: baseline on r 71, from 196° over the top to −16°.
  const [ax, ay] = pt(c, c, 71, 196);
  const [bx, by] = pt(c, c, 71, -16);
  // Year round the foot, read left to right with its tops inward.
  const [yx, yy] = pt(c, c, 81.5, 224);
  const [zx, zy] = pt(c, c, 81.5, 316);
  return `<svg class="seal" viewBox="0 0 200 200" role="img" aria-label="Galaxy Olympiad Academy, ${year}">
<defs>
  <path id="${id}-top" d="M${ax} ${ay}A71 71 0 1 1 ${bx} ${by}"/>
  <path id="${id}-foot" d="M${yx} ${yy}A81.5 81.5 0 0 0 ${zx} ${zy}"/>
</defs>
<circle cx="${c}" cy="${c}" r="97" fill="#fff"/>
<circle cx="${c}" cy="${c}" r="93.5" fill="none" stroke="${GREEN}" stroke-width="7"/>
<circle cx="${c}" cy="${c}" r="59" fill="none" stroke="#111" stroke-width="2.8"/>
<text class="seal-ring" font-size="15.2" fill="#111"><textPath href="#${id}-top" startOffset="50%" text-anchor="middle">GALAXY OLYMPIAD TALENT TEST</textPath></text>
<text class="seal-year" font-size="14" fill="${RED}"><textPath href="#${id}-foot" startOffset="50%" text-anchor="middle">${year}</textPath></text>
${clover(33, 138)}${clover(167, 138)}
<g>
  ${bar(80.5, 71, 94, '#9e1b32')}
  ${bar(88.5, 66, 99, '#1b1b1b')}
  ${bar(97.5, 58, 78, SALMON)}
  ${bar(97.5, 81, 101, RED)}
  ${bar(106.5, 66, 99, '#1b1b1b')}
  ${bar(114.5, 71, 94, SALMON)}
</g>
<text class="seal-word" x="${c}" y="118" font-size="17" fill="${RED}" text-anchor="middle" letter-spacing="2.4">GALAXY</text>
<text class="seal-sub" x="${c + 1}" y="131" font-size="10" fill="#111" text-anchor="middle" letter-spacing="2.2">Olympiad</text>
<text class="seal-sub" x="${c + 1}" y="142" font-size="8.6" fill="#111" text-anchor="middle" letter-spacing="1.8">Academy</text>
</svg>`;
}
