/* ---- png ---------------------------------------------------
   Just enough PNG to cut rows off the bottom of a screenshot.

   Headless Chrome captures the window, and the window is taller
   than the viewport by a margin that is the browser's business,
   not ours (see windowPad in build.mjs). Asking for the taller
   window is what makes Chrome paint the foot of the page at all;
   this takes the empty strip back off, so a proof is the sheet and
   nothing else.

   Only what Chrome writes is handled: 8 bits a channel, no
   interlacing. Anything else is left alone rather than mangled.
   ------------------------------------------------------------ */
import { readFile, writeFile } from 'node:fs/promises';
import { deflateSync, inflateSync } from 'node:zlib';

const SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const CHANNELS = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };

const TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) c = TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return ~c >>> 0;
}
function chunk(type, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, 'latin1');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, crc]);
}

/* Keep the top `rows` scanlines of a PNG, in place.
   Returns false if the file is a kind this does not handle. */
export async function cropHeight(file, rows) {
  const png = await readFile(file);
  if (!png.subarray(0, 8).equals(SIG)) return false;

  let i = 8, ihdr = null, idat = [];
  while (i + 8 <= png.length) {
    const len = png.readUInt32BE(i);
    const type = png.toString('latin1', i + 4, i + 8);
    const data = png.subarray(i + 8, i + 8 + len);
    if (type === 'IHDR') ihdr = Buffer.from(data);
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    i += 12 + len;
  }
  if (!ihdr) return false;

  const w = ihdr.readUInt32BE(0), h = ihdr.readUInt32BE(4);
  const depth = ihdr[8], colour = ihdr[9], interlace = ihdr[12];
  if (depth !== 8 || interlace !== 0 || !CHANNELS[colour]) return false;
  if (rows >= h) return true;                    // nothing to take off

  // Each scanline is one filter byte and then the pixels. A filter
  // only ever refers to the row above, so keeping a prefix of the
  // rows keeps every reference it needs — the bytes can be cut
  // without decoding the filters at all.
  const stride = 1 + w * CHANNELS[colour];
  const raw = inflateSync(Buffer.concat(idat)).subarray(0, rows * stride);

  const head = Buffer.from(ihdr);
  head.writeUInt32BE(rows, 4);
  await writeFile(file, Buffer.concat([
    SIG, chunk('IHDR', head), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0)),
  ]));
  return true;
}
