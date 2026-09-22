"""Scoped figure-upgrade preservation and native-PDF verification (Chapters 6/7)."""
from pathlib import Path
from collections import Counter
from pypdf import PdfReader
from PIL import Image
import hashlib, html, json, re, subprocess

root = Path(__file__).resolve().parent.parent
history = root / 'assets/design-history/science-g7-figure-upgrade'
baseline = json.loads((history / 'ch06-07-baseline.json').read_text(encoding='utf-8'))
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
changed = {6: [3, 13], 7: [2, 5, 6, 7, 9, 12, 13, 17, 18, 19]}
report = {'scope': 'Chapters 6/7 task baseline; cross-chapter preservation delegated to parent', 'chapters': []}
for path, digest in baseline['unchanged'].items():
    assert sha(root / path) == digest, path
report['unchangedProtectedFiles'] = len(baseline['unchanged'])

for n, count in [(6, 18), (7, 19)]:
    prior = baseline['chapters'][str(n)]
    chapter = f"class-7/{prior['name']}"
    chapter_history = root / f'assets/design-history/science-g7-ch{n:02}'
    assets = json.loads((chapter_history / 'artwork.json').read_text(encoding='utf-8'))
    assert len(assets) == {6: 8, 7: 17}[n]
    dimensions = {}
    for asset in assets:
        path = root / asset['file']
        assert sha(path) == asset['sha256'], path
        with Image.open(path) as im:
            assert im.format == 'PNG' and im.mode == 'RGBA'
            assert list(im.size) == asset['pixels']
            assert im.getchannel('A').histogram()[0] / (im.width * im.height) > .1
            # Native panoramic art has a shorter side; preserve actual pixels,
            # require >1 MP, and verify exact embedded native dimensions below.
            assert im.width * im.height >= 1024 ** 2
            dimensions[asset['file']] = im.size
    pages = sorted((root / 'pages' / chapter).glob('p*.html'))
    assert len(pages) == count
    refs_per_page = []
    all_refs = set()
    for page in pages:
        source = page.read_text(encoding='utf-8')
        texts = sorted(html.unescape(re.sub('<[^>]+>', '', s)) for s in re.findall(r'<text\b[^>]*>(.*?)</text>', source, re.S))
        assert texts == prior['pages'][page.name]['texts'], ('Live text changed', page)
        if int(page.stem[1:]) not in changed[n]:
            assert sha(page) == prior['pages'][page.name]['sha256'], page
        refs = set(re.findall(r'<image\b[^>]*href="(?:\.\./)+(figures/[^"]+\.png)"', source))
        assert refs <= dimensions.keys(), refs - dimensions.keys()
        refs_per_page.append(refs)
        all_refs.update(refs)
    assert all_refs == dimensions.keys(), ('Unreferenced assets', dimensions.keys() - all_refs)
    current_map = json.loads((chapter_history / 'page-map.json').read_text(encoding='utf-8'))
    assert current_map == prior['pageMap'], 'Pagination or block geometry changed'
    result = {'chapter': chapter, 'pages': count, 'assets': len(assets), 'liveTextUnchanged': True,
              'pageMapUnchanged': True, 'unchangedPageBytes': count-len(changed[n]), 'exports': []}
    review = root / f'build/_class7-ch{n:02}-review/figure-upgrade'
    review.mkdir(parents=True, exist_ok=True)
    for suffix in ['', '-bleed']:
        file = root / 'build' / f'{chapter}{suffix}.pdf'
        assert file.stat().st_mtime >= max(p.stat().st_mtime for p in pages)
        pdf = PdfReader(file)
        assert len(pdf.pages) == count
        fonts, placements = set(), 0
        for index, page in enumerate(pdf.pages):
            mm = [float(v)*25.4/72 for v in [page.mediabox.width, page.mediabox.height]]
            expected = [209,292] if suffix else [189,272]
            assert all(abs(a-b)<.2 for a,b in zip(mm, expected))
            assert len(page.extract_text()) > 200
            resources = page['/Resources'].get_object()
            for ref in resources.get('/Font', {}).values():
                font = ref.get_object()
                assert font['/Subtype'] != '/Type3'
                fonts.add(str(font.get('/BaseFont')))
                for item in font.get('/DescendantFonts', [ref]):
                    fd = item.get_object().get('/FontDescriptor')
                    if fd:
                        assert any(k in fd.get_object() for k in ['/FontFile','/FontFile2','/FontFile3'])
            image_sizes = []
            for ref in resources.get('/XObject', {}).values():
                obj = ref.get_object()
                if obj.get('/Subtype') == '/Image':
                    assert '/SMask' in obj, 'Real PDF transparency required'
                    image_sizes.append((obj['/Width'], obj['/Height']))
            assert Counter(image_sizes) == Counter(dimensions[f] for f in refs_per_page[index]), (n, suffix, index+1, image_sizes, refs_per_page[index])
            placements += len(image_sizes)
        assert any('SourceSerif4' in f for f in fonts) and any('SourceSans3' in f for f in fonts)
        result['exports'].append({'file': str(file.relative_to(root)), 'sha256': sha(file),
                                  'nativeTransparentPageResources': placements, 'fonts': sorted(fonts)})
        # Fresh PDF renders for every changed reading page and representative bleed.
        for folio in (changed[n] if not suffix else [changed[n][0]]):
            prefix = review / f"{'bleed' if suffix else 'reading'}-p{folio:03}"
            subprocess.run(['pdftoppm', '-f', str(folio), '-l', str(folio), '-singlefile',
                            '-png', '-r', '120', str(file), str(prefix)], check=True, capture_output=True)
    result['pdfRenders'] = str(review.relative_to(root))
    report['chapters'].append(result)
    print(f'Chapter {n}: {count} pages; {len(assets)} native transparent assets; all live text and pagination preserved; reading/bleed PDFs verified.', flush=True)
(history / 'ch06-07-validation.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(f"Protected files unchanged: {report['unchangedProtectedFiles']}")
