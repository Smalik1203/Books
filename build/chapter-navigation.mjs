/* Chapter links stay inside the current library class and subject. */
export function chapterNeighbours(chapter, chapters) {
  const cls = chapter.target.split('/')[0];
  const siblings = chapters.filter((item) =>
    item.target.split('/')[0] === cls && item.subject === chapter.subject)
    .sort((a, b) => String(a.meta.number)
      .localeCompare(String(b.meta.number), 'en', { numeric: true }));
  const index = siblings.findIndex((item) => item.target === chapter.target);
  return {
    previous: index > 0 ? siblings[index - 1] : null,
    next: index >= 0 ? siblings[index + 1] || null : null,
  };
}
