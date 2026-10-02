import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, r, g, b) {
  // Simple uncompressed or deflate PNG generator
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8 bit
  ihdr.writeUInt8(2, 9); // RGB (no alpha)
  ihdr.writeUInt8(0, 10); // deflate
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // no interlace

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    
    // crc calculation
    let crc = 0xFFFFFFFF;
    const combined = Buffer.concat([typeBuf, data]);
    for (let i = 0; i < combined.length; i++) {
      let byte = combined[i];
      for (let j = 0; j < 8; j++) {
        if ((crc ^ byte) & 1) {
          crc = (crc >>> 1) ^ 0xEDB88320;
        } else {
          crc = crc >>> 1;
        }
        byte = byte >>> 1;
      }
    }
    crcBuf.writeInt32BE(~crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // Scanlines: width * 3 bytes + 1 filter byte per line
  const rawData = Buffer.alloc(height * (width * 3 + 1));
  let offset = 0;
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.44;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter byte: None
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Gradient background + stylized paw center
      const t = y / height;
      let pr = Math.round(255 * (1 - t * 0.4) + 142 * (t * 0.4));
      let pg = Math.round(159 * (1 - t * 0.7) + 68 * (t * 0.7));
      let pb = Math.round(104 * (1 - t) + 173 * t);

      // Inner white paw graphic approx
      const inPawHeart = (dy > -radius * 0.1 && dy < radius * 0.7 && Math.abs(dx) < (radius * 0.65 - dy * 0.4));
      const inToe1 = Math.hypot(x - (cx - radius * 0.42), y - (cy - radius * 0.35)) < radius * 0.18;
      const inToe2 = Math.hypot(x - (cx - radius * 0.14), y - (cy - radius * 0.52)) < radius * 0.17;
      const inToe3 = Math.hypot(x - (cx + radius * 0.14), y - (cy - radius * 0.52)) < radius * 0.17;
      const inToe4 = Math.hypot(x - (cx + radius * 0.42), y - (cy - radius * 0.35)) < radius * 0.18;

      if (inPawHeart || inToe1 || inToe2 || inToe3 || inToe4) {
        rawData[offset++] = 255;
        rawData[offset++] = 255;
        rawData[offset++] = 255;
      } else {
        rawData[offset++] = pr;
        rawData[offset++] = pg;
        rawData[offset++] = pb;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPNG(192, 192, 255, 159, 104));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPNG(512, 512, 255, 159, 104));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, 255, 159, 104));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPNG(180, 180, 255, 159, 104));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPNG(32, 32, 255, 159, 104));

console.log('Successfully generated PWA icon set!');
