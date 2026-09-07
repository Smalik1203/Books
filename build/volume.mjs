/* ============================================================
   What a volume is called.

   A cover names a book: cover.json carries a `title` and, where a
   subject runs to more than one book, a `part`. A chapter names the
   same book in `chapter.json`'s `subject`. The two have to compose to
   the same string or nothing can be matched up — the binder would find
   no title page, and the studio would file a cover under the wrong
   subject.

   So the composition lives here, once, and both read it. It used to
   live in build.mjs alone, which is a CLI script with no exports, so
   the studio could not reach it and filed every cover under the class
   instead of the volume: choosing Science in Class 9 showed the
   Mathematics jacket.
   ============================================================ */

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V'];

/* "Mathematics" + part 1 -> "Mathematics I", which is what a chapter of
   that book carries as its subject. A book with no part keeps its bare
   title, so a one-volume subject such as Science needs no numeral. */
export const volumeName = (book) =>
  book.part ? `${book.title} ${ROMAN[Number(book.part)] || book.part}` : book.title;
