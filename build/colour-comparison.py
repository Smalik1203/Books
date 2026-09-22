"""Build matched RGB / CMYK Science palette proof pages in one PDF."""
from pathlib import Path
import subprocess, sys, json
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ContentStream

root=Path(__file__).resolve().parent.parent
scratch=root/'tmp/pdfs/cmyk'
scratch.mkdir(parents=True,exist_ok=True)
for mode,name in [('rgb','existing'),('cmyk','converted')]:
    subprocess.run([sys.executable,str(root/'build/cmyk-proof.py'),'--mode',mode,
        '--output',str(scratch/f'{name}.pdf'),*sys.argv[1:]],check=True,cwd=root)
rgb=PdfReader(scratch/'existing.pdf');cmyk=PdfReader(scratch/'converted.pdf')
writer=PdfWriter();writer.clone_document_from_reader(cmyk)
writer.insert_page(rgb.pages[0],0)
writer.add_metadata({'/Title':'Science colour comparison','/Subject':'Page 1: existing sRGB colours. Page 2: CMYK using the embedded SWOP output profile.','/Author':'LearnLab'})
out=root/'output/pdf/Colour-comparison.pdf'
with out.open('wb') as f:writer.write(f)
pdf=PdfReader(out)
assert len(pdf.pages)==2
assert pdf.pages[0].extract_text().replace('RGB\n','')==pdf.pages[1].extract_text().replace('CMYK\n','')
for i,page in enumerate(pdf.pages):
    ops=ContentStream(page.get_contents(),pdf).operations
    assert not any(op in ((b'k',b'K') if i==0 else (b'rg',b'RG')) for _,op in ops)
assert pdf.pages[0]['/Resources']['/ColorSpace']['/DefaultRGB'][1]['/N']==3
assert pdf.trailer['/Root']['/OutputIntents'][0]['/DestOutputProfile']['/N']==4
subprocess.run(['pdftoppm','-png','-r','130',str(out),str(scratch/'comparison')],check=True,capture_output=True)
print('Verified two matched pages: RGB first, CMYK second; identical text except matching bold colour-space labels; embedded profiles retained.')
