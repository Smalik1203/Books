/* ============================================================
   Spine width.

   Bulk, not a design choice: half the leaves times the caliper
   of the stock, plus whatever the case adds. It is shared because
   the cover builder prints it and the studio shows it, and a
   spine computed in two places is a spine that will differ.
   ============================================================ */

export function spineWidth(meta) {
  if (meta.spineWidth != null) {
    return { mm: Number(meta.spineWidth), how: 'declared in cover.json' };
  }
  const pages = Number(meta.pages);
  const caliper = Number(meta.paperCaliper);
  if (!pages || !caliper) {
    return { mm: 16, how: 'FALLBACK — no pages/paperCaliper in cover.json' };
  }
  const allowance = Number(meta.caseAllowance ?? 0);
  const mm = (pages / 2) * caliper + allowance;
  return {
    mm: Math.round(mm * 10) / 10,
    how: `${pages}pp / 2 x ${caliper}mm + ${allowance}mm case`,
  };
}
