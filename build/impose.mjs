/* ============================================================
   Signature imposition — what the press sheet looks like.

   Two rules govern every saddle-folded signature, whatever the
   folder does:

     1. the two pages facing each other on one side of a sheet
        always sum to (pages in the signature + 1)
     2. the two sides of one leaf are consecutive

   A four-page unit therefore reads (S, 1), (2, S-1) on the
   outermost leaf-pair, (S-2, 3), (4, S-3) on the next, and so on
   inwards. Place each unit at the same grid position on both
   sides — mirrored, because turning a sheet over swaps left and
   right — and the result is a valid imposition.

   WHICH grid position each unit takes depends on the fold scheme,
   and folders differ. The arrangement below is a plain
   right-angle fold. The pairs it puts together are universal; the
   physical order of the units is not, so this is a tool for
   checking structure — page count, blanks, what shares a leaf —
   not a file to hand to a press.
   ============================================================ */

/* Grid of four-page units on one side of the sheet. */
function unitGrid(sigSize) {
  const units = sigSize / 4;
  const cols = units <= 2 ? 1 : 2;
  return { units, cols, rows: units / cols };
}

/* One signature, both sides, as cell grids ready to draw. */
export function imposeSignature(sigSize, offset, pageCount) {
  const { units, cols, rows } = unitGrid(sigSize);
  const front = [];
  const back = [];

  for (let i = 0; i < units; i++) {
    const row = Math.floor(i / cols);          // 0 = bottom of the sheet
    const col = i % cols;
    const inverted = row % 2 === 1;            // every other row turns over in the fold

    const pair = (a, b) => {
      // A row that folds upside down shows its pair reversed.
      const [l, r] = inverted ? [b, a] : [a, b];
      return [l, r].map((n) => ({
        page: n + offset,
        blank: n + offset > pageCount,
        inverted,
      }));
    };

    front.push({ row, col, cells: pair(sigSize - 2 * i, 1 + 2 * i) });
    back.push({ row, col: cols - 1 - col, cells: pair(2 + 2 * i, sigSize - 1 - 2 * i) });
  }

  return { units, cols, rows, front, back };
}

/* The whole chapter: how many signatures, how many blanks. */
export function impositionPlan(pageCount, sigSize, trimW, trimH) {
  const count = Math.ceil(pageCount / sigSize);
  const slots = count * sigSize;
  const { cols, rows } = unitGrid(sigSize);
  const signatures = [];
  for (let s = 0; s < count; s++) {
    signatures.push(imposeSignature(sigSize, s * sigSize, pageCount));
  }
  return {
    sigSize, count, slots, blanks: slots - pageCount,
    pageCols: cols * 2, pageRows: rows,
    sheetW: cols * 2 * trimW,
    sheetH: rows * trimH,
    signatures,
  };
}

/* The nearest standard parent sheet that swallows the imposed area. */
const PARENTS = [
  ['SRA3', 320, 450], ['B3', 353, 500], ['SRA2', 450, 640],
  ['B2', 500, 707], ['SRA1', 640, 900], ['B1', 707, 1000], ['B0', 1000, 1414],
];
export function fitsOn(w, h) {
  for (const [name, pw, ph] of PARENTS) {
    if ((w <= pw && h <= ph) || (w <= ph && h <= pw)) {
      const waste = 1 - (w * h) / (pw * ph);
      return { name, w: pw, h: ph, waste: Math.round(waste * 1000) / 10 };
    }
  }
  return null;
}

/* ---- Checks -------------------------------------------------
   A layout that breaks either rule is not an imposition. Run
   them rather than trusting the arithmetic above. */
export function verify(plan, pageCount) {
  const problems = [];
  for (const [s, sig] of plan.signatures.entries()) {
    const off = s * plan.sigSize;
    const sum = plan.sigSize + 1;
    for (const side of ['front', 'back']) {
      for (const u of sig[side]) {
        const [a, b] = u.cells.map((c) => c.page - off);
        if (a + b !== sum) problems.push(`${side} pair ${a}+${b} is not ${sum}`);
      }
    }
    // a unit sits at the same row on both sides; its leaf pages must be consecutive
    for (const f of sig.front) {
      const b = sig.back.find((x) => x.row === f.row && x.col === plan.pageCols / 2 - 1 - f.col);
      if (!b) { problems.push('no matching unit on the back'); continue; }
      const pairs = [[f.cells[0].page, b.cells[1].page], [f.cells[1].page, b.cells[0].page]];
      for (const [x, y] of pairs) {
        if (Math.abs(x - y) !== 1) problems.push(`leaf ${x}/${y} is not consecutive`);
      }
    }
  }
  return problems;
}
