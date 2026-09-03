/* ============================================================
   Spine width.

   Bulk, not a design choice: half the leaves times the caliper
   of the stock, plus whatever the case adds. It is shared because
   the cover builder prints it and the studio shows it, and a
   spine computed in two places is a spine that will differ.
   ============================================================ */

export function spineWidth(meta) {
  const pages = Number(meta.pages);
  const caliper = Number(meta.paperCaliper);
  const allowance = Number(meta.caseAllowance ?? 0);
  const bulk = pages && caliper
    ? Math.round(((pages / 2) * caliper + allowance) * 10) / 10
    : null;

  /* A declared width wins — a printer quoting its own stock knows the
     bulk better than a caliper copied off a datasheet. But the bulk is
     still computed and reported beside it, because a spine declared
     once and then left while the book grew is exactly the spine that
     goes to press wrong, and nothing would otherwise say so. */
  if (meta.spineWidth != null) {
    return {
      mm: Number(meta.spineWidth),
      bulk,
      how: bulk == null
        ? 'declared in cover.json'
        : `declared in cover.json; ${pages}pp of this stock bulks to ${bulk}mm`,
    };
  }
  if (bulk == null) {
    return { mm: 16, bulk: null, how: 'FALLBACK — no pages/paperCaliper in cover.json' };
  }
  return { mm: bulk, bulk, how: `${pages}pp / 2 x ${caliper}mm + ${allowance}mm case` };
}
