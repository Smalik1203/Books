#!/usr/bin/env python3
"""Recover a traced reference chapter's content from its geometry.

    python build/extract-reference-content.py <class>/<chapter> [--out FILE]

The food chapter is a tracing: 7,351 <text> elements, one word each,
every one carrying its own translate() and its own scale(). Nothing in
it says "paragraph" or "table cell" — those only exist as the fact that
some words happen to sit on the same baseline inside the same box.

That is why the chapter cannot be moved to another trim. There is no
text to re-flow, only ink to re-place, and re-placing it at a smaller
page size shrinks the type to 8pt rather than breaking the lines again.

So this reads the geometry back into content: words to lines, lines to
blocks, blocks to a role. What comes out is a JSON document per page
that a setter can pour onto a page of any size — and it is also the fix
for the tracing's own defect, since a re-set block has one left edge and
one size where the trace has a wobble of about 0.35mm and 3%.

It reads sources, writes JSON, and changes nothing.
"""

import argparse, glob, html, json, os, re, sys
from collections import defaultdict, Counter as collections_Counter

TEXT = re.compile(
    r'<text class="([^"]*)"[^>]*transform="translate\(([-\d.]+) ([-\d.]+)\) '
    r'scale\(([\d.]+)\)"[^>]*>(.*?)</text>', re.S)
RECT = re.compile(
    r'<rect class="([^"]*)" x="([-\d.]+)" y="([-\d.]+)" '
    r'width="([\d.]+)" height="([\d.]+)"')
IMAGE = re.compile(
    r'<image[^>]*href="([^"]+)"[^>]*x="([-\d.]+)" y="([-\d.]+)" '
    r'width="([\d.]+)" height="([\d.]+)"(?:[^>]*)>(?:<title>(.*?)</title>)?')
VIEWBOX = re.compile(r'viewBox="0 0 (\d+) (\d+)"')
FOLIO = re.compile(r'data-folio="(\d+)"')
REFPAGE = re.compile(r'data-reference-page="(\d+)"')

# A word sits on a line if its baseline is within this many units of it.
# The trace wobbles by about one unit inside a single paragraph, so the
# tolerance has to clear that without swallowing the next line: body
# leading here is 25-30 units.
BASELINE_TOL = 3.0
# Where a line is cut into cells. Estimating it from the gap between two
# words needs a width per word, and the trace carries none — guessing it
# from the character count split "Now analyse your completed table" in
# two. The page draws its own column boundaries as vertical rules, so
# those are used instead, and a line is cut only where it crosses one.
VRULE = re.compile(r'<line class="[^"]*" x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"')
# Two lines belong to one block while the step between them stays near
# the block's own leading and the left edge does not move far.
LEADING_SLOP = 0.28
LEFT_SLOP = 14.0


def unescape(s):
    return html.unescape(re.sub(r'<[^>]+>', '', s)).strip()


def load(path):
    src = open(path, encoding='utf-8').read()
    w, h = map(int, VIEWBOX.search(src).groups())
    words = []
    for cls, x, y, scale, body in TEXT.findall(src):
        t = unescape(body)
        if not t:
            continue
        words.append(dict(cls=cls.split(), x=float(x), y=float(y),
                          scale=float(scale), t=t))
    rects = [dict(cls=c.split(), x=float(x), y=float(y), w=float(w2), h=float(h2))
             for c, x, y, w2, h2 in RECT.findall(src)]
    # vertical rules: the column boundaries a table draws for itself
    columns = []
    for x1, y1, x2, y2 in VRULE.findall(src):
        x1, y1, x2, y2 = float(x1), float(y1), float(x2), float(y2)
        if abs(x1 - x2) < 0.5 and abs(y2 - y1) > 40:
            columns.append(dict(x=x1, top=min(y1, y2), bottom=max(y1, y2)))
    images = [dict(href=hr, x=float(x), y=float(y), w=float(w2), h=float(h2),
                   title=unescape(ti) if ti else None)
              for hr, x, y, w2, h2, ti in IMAGE.findall(src)]
    return dict(w=w, h=h, words=words, rects=rects, images=images, columns=columns,
                folio=int(FOLIO.search(src).group(1)),
                ref=int(REFPAGE.search(src).group(1)))


def to_lines(words, columns=()):
    """Words to baselines. The trace's own wobble is averaged out here:
    a line gets one y and one scale, which is the whole repair.

    Grouping is by baseline only, never by class. A line reading
    "Now <b>analyse</b> your completed table" is three classes on one
    baseline, and splitting on class turns it into two blocks whose
    words interleave wrongly — "Now your completed table" and, apart
    from it, "analyse".

    A line is then cut wherever it crosses one of the page's own vertical
    rules, which is how four table cells sharing a baseline become four
    cells again. Prose draws no such rules and so is never cut."""
    lines = []
    for w in sorted(words, key=lambda w: (w['y'], w['x'])):
        for ln in reversed(lines):
            if abs(ln['y'] - w['y']) <= BASELINE_TOL:
                ln['words'].append(w)
                break
        else:
            lines.append(dict(y=w['y'], words=[w]))

    out = []
    for ln in lines:
        ws = sorted(ln['words'], key=lambda w: w['x'])
        # the boundaries this line actually crosses
        edges = sorted(c['x'] for c in columns
                       if c['top'] - 2 <= ln['y'] <= c['bottom'] + 2
                       and ws[0]['x'] < c['x'] < ws[-1]['x'])
        cells, cur = [], [ws[0]]
        for prev, w in zip(ws, ws[1:]):
            if any(prev['x'] < e <= w['x'] for e in edges):
                cells.append(cur); cur = [w]
            else:
                cur.append(w)
        cells.append(cur)

        for cell in cells:
            ys = [w['y'] for w in cell]
            ss = [w['scale'] for w in cell]
            runs, run = [], dict(cls=cell[0]['cls'], words=[cell[0]['t']])
            for w in cell[1:]:
                if w['cls'] == run['cls']:
                    run['words'].append(w['t'])
                else:
                    runs.append(run); run = dict(cls=w['cls'], words=[w['t']])
            runs.append(run)
            out.append(dict(
                y=round(sum(ys) / len(ys), 2),
                x=round(min(w['x'] for w in cell), 2),
                right=round(max(w['x'] for w in cell), 2),
                scale=round(sum(ss) / len(ss), 5),
                cls=cell[0]['cls'],
                runs=[dict(cls=r['cls'], t=' '.join(r['words'])) for r in runs],
                text=' '.join(w['t'] for w in cell),
                wobble=round(max(ys) - min(ys), 2),
                sizeSpread=round((max(ss) / min(ss) - 1) * 100, 1) if min(ss) else 0.0,
            ))
    return sorted(out, key=lambda l: (l['y'], l['x']))


def to_blocks(lines):
    """Lines to blocks. A block is lines that keep one leading, one left
    edge and one size — which is also the definition of a paragraph."""
    blocks, cur = [], []

    def flush():
        if not cur:
            return
        ss = [l['scale'] for l in cur]
        blocks.append(dict(
            x=round(min(l['x'] for l in cur), 2),
            right=round(max(l['right'] for l in cur), 2),
            y=cur[0]['y'], bottom=cur[-1]['y'],
            scale=round(sum(ss) / len(ss), 5),
            leading=round((cur[-1]['y'] - cur[0]['y']) / (len(cur) - 1), 2) if len(cur) > 1 else None,
            cls=cur[0]['cls'],
            lines=[l['text'] for l in cur],
            runs=[r for l in cur for r in l['runs']],
            text=' '.join(l['text'] for l in cur),
            drift=dict(
                left=round(max(l['x'] for l in cur) - min(l['x'] for l in cur), 2),
                size=round((max(ss) / min(ss) - 1) * 100, 1) if min(ss) else 0.0),
        ))
        cur.clear()

    for ln in lines:
        if not cur:
            cur.append(ln); continue
        prev = cur[-1]
        step = ln['y'] - prev['y']
        if step <= BASELINE_TOL:          # a second cell on the same baseline
            flush(); cur.append(ln); continue
        same_size = abs(ln['scale'] - prev['scale']) / prev['scale'] < 0.09
        near_left = abs(ln['x'] - cur[0]['x']) < LEFT_SLOP
        if len(cur) == 1:
            plausible = same_size and near_left and 0 < step < prev['scale'] * 260
        else:
            lead = (prev['y'] - cur[0]['y']) / (len(cur) - 1)
            plausible = same_size and near_left and abs(step - lead) <= lead * LEADING_SLOP
        if plausible:
            cur.append(ln)
        else:
            flush(); cur.append(ln)
    flush()
    return blocks


def is_furniture(block, page):
    """The folio numeral is drawn like any other word, but it is the
    page talking about itself, not the chapter. Everything below the
    text block that is just a number is the foot."""
    t = block['text'].strip()
    if t.isdigit() and block['y'] > page['h'] * 0.94:
        return True
    return False


def classify(block, page):
    """A role, from the block's size and what box it sits in."""
    body = page['bodyScale']
    s = block['scale']
    cls = set(block['cls'])
    inside = None
    for r in page['rects']:
        if (r['x'] - 4 <= block['x'] and block['right'] <= r['x'] + r['w'] + 60
                and r['y'] - 6 <= block['y'] <= r['y'] + r['h'] + 6):
            if inside is None or r['w'] * r['h'] < inside['w'] * inside['h']:
                inside = r
    box = ' '.join(inside['cls']) if inside else None

    if s > body * 1.9:
        role = 'title'
    elif s > body * 1.35:
        role = 'heading'
    elif s > body * 1.12:
        role = 'subheading'
    elif s < body * 0.86:
        role = 'caption'
    else:
        role = 'body'

    if inside is not None:
        if 'food-table-head' in inside['cls'] or 'food-table-side' in inside['cls']:
            role = 'tablecell'
        elif any(c.startswith('food-row-') for c in inside['cls']):
            role = 'tablecell'
        elif any(c in inside['cls'] for c in
                 ('food-prompt', 'food-panel', 'food-paper', 'food-blue-paper',
                  'food-green-panel', 'food-red-panel')):
            role = 'panel-' + role
    if re.match(r'^\d+[.)]\s', block['text']):
        role = 'listitem'
    return role, box


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('chapter')
    ap.add_argument('--out', default=None)
    a = ap.parse_args()

    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    src = os.path.join(root, 'pages', *a.chapter.split('/'))
    files = sorted(glob.glob(os.path.join(src, 'p[0-9]*.html')))
    if not files:
        sys.exit('no page files under pages/%s' % a.chapter)

    pages, total_words, total_blocks = [], 0, 0
    for f in files:
        page = load(f)
        lines = to_lines(page['words'], page['columns'])
        # the body size is the commonest line size, to the nearest 1%
        tally = defaultdict(int)
        for l in lines:
            tally[round(l['scale'], 3)] += len(l['text'].split())
        page['bodyScale'] = max(tally.items(), key=lambda kv: kv[1])[0] if tally else 0.17
        blocks = to_blocks(lines)
        furniture = [b for b in blocks if is_furniture(b, page)]
        blocks = [b for b in blocks if not is_furniture(b, page)]
        for b in blocks:
            b['role'], b['box'] = classify(b, page)
        total_words += sum(len(l['text'].split()) for l in lines)
        total_blocks += len(blocks)
        pages.append(dict(
            file=os.path.basename(f), folio=page['folio'], ref=page['ref'],
            sheet=[page['w'], page['h']], bodyScale=page['bodyScale'],
            blocks=blocks, furniture=[b['text'] for b in furniture],
            images=page['images'],
            rects=[r for r in page['rects']],
        ))

    doc = dict(chapter=a.chapter, pages=pages,
               words=total_words, blocks=total_blocks)

    """Every word of the source has to come out the other side. The
    extraction is only worth building on if it is lossless, and the
    cheap way to know is to count the bag of words both ways: the
    source's <text> elements against the blocks' own text."""
    losses = []
    for f2, page_doc in zip(files, pages):
        src_words = sorted(w for el in load(f2)['words'] for w in el['t'].split())
        out_words = sorted(
            w for b in page_doc['blocks'] for w in b['text'].split())
        out_words += sorted(w for t in page_doc['furniture'] for w in t.split())
        if sorted(src_words) != sorted(out_words):
            missing = list((collections_Counter(src_words) - collections_Counter(out_words)).elements())
            added = list((collections_Counter(out_words) - collections_Counter(src_words)).elements())
            losses.append((os.path.basename(f2), missing, added))
    doc['lossless'] = not losses
    out = a.out or os.path.join(root, 'build', '_extract',
                                a.chapter.replace('/', '-') + '.json')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, 'w', encoding='utf-8') as fh:
        json.dump(doc, fh, indent=1, ensure_ascii=False)

    # A chapter this cannot read must say so. Reporting "lossless" for a
    # chapter whose text it never found is the same lie check-food-reference
    # tells when it is handed a chapter and ignores it.
    if total_words == 0:
        print('%s: no traced text found.' % a.chapter)
        print('   This reads word-level transform="translate() scale()" tracings.')
        print('   A chapter set as x/y text with tspan lines is already content;')
        print('   there is nothing here to recover. Nothing written.')
        os.remove(out)
        sys.exit(2)

    roles = defaultdict(int)
    for p in pages:
        for b in p['blocks']:
            roles[b['role']] += 1
    print('%s: %d pages, %d words, %d blocks' % (a.chapter, len(pages), total_words, total_blocks))
    for r, n in sorted(roles.items(), key=lambda kv: -kv[1]):
        print('   %-18s %3d' % (r, n))
    if losses:
        print('  NOT lossless — the re-set would drop text:')
        for name, missing, added in losses[:6]:
            if missing:
                print('   %s missing %d: %s' % (name, len(missing), ' '.join(missing[:12])))
            if added:
                print('   %s gained  %d: %s' % (name, len(added), ' '.join(added[:12])))
    else:
        print('   lossless        every source word appears exactly once')
    print(' -> %s' % os.path.relpath(out, root))
    if losses:
        sys.exit(1)


if __name__ == '__main__':
    main()
