// Regenerates favicon and app-router icon assets from the source logo.
// Source: public/images/logo-green-pin-warehouse.png (1024x1024)
// Outputs:
//   app/icon.png         (192x192, used by Next.js for <link rel="icon"> auto-injection)
//   app/apple-icon.png   (180x180, used by Next.js for <link rel="apple-touch-icon">)
//   app/favicon.ico      (multi-size 16/32/48, valid ICO with PNG-encoded entries)
//   public/favicon-32x32.png, public/favicon-192x192.png (optional explicit references)
//
// Run with: node scripts/generate-favicons.mjs

import { promises as fs } from "node:fs"
import path from "node:path"
import sharp from "sharp"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..")
const SRC = path.join(ROOT, "public", "images", "logo-green-pin-warehouse.png")

async function pngBuffer(size) {
  return sharp(SRC)
    .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .ensureAlpha()                       // force RGBA — Next.js Turbopack rejects RGB-only PNGs inside ICO
    .png({ compressionLevel: 9, force: true })
    .toBuffer()
}

// Build a valid multi-size ICO file with PNG-encoded entries (Vista+).
// Format: ICONDIR (6 bytes) + N * ICONDIRENTRY (16 bytes) + concatenated PNG data.
function buildIco(pngs) {
  const ICONDIR_SIZE = 6
  const ENTRY_SIZE = 16
  const header = Buffer.alloc(ICONDIR_SIZE)
  header.writeUInt16LE(0, 0)            // reserved
  header.writeUInt16LE(1, 2)            // type = 1 (icon)
  header.writeUInt16LE(pngs.length, 4)  // image count

  const entries = []
  let offset = ICONDIR_SIZE + ENTRY_SIZE * pngs.length
  for (const { size, data } of pngs) {
    const entry = Buffer.alloc(ENTRY_SIZE)
    entry.writeUInt8(size === 256 ? 0 : size, 0)  // width (0 = 256)
    entry.writeUInt8(size === 256 ? 0 : size, 1)  // height
    entry.writeUInt8(0, 2)             // palette
    entry.writeUInt8(0, 3)             // reserved
    entry.writeUInt16LE(1, 4)          // color planes
    entry.writeUInt16LE(32, 6)         // bits per pixel
    entry.writeUInt32LE(data.length, 8)  // bytes in resource
    entry.writeUInt32LE(offset, 12)    // image data offset
    entries.push(entry)
    offset += data.length
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)])
}

async function write(filePath, buffer) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, buffer)
  console.log(`  wrote ${path.relative(ROOT, filePath)} (${buffer.length} bytes)`)
}

async function main() {
  console.log(`source: ${path.relative(ROOT, SRC)}`)

  const [p16, p32, p48, p180, p192] = await Promise.all([
    pngBuffer(16),
    pngBuffer(32),
    pngBuffer(48),
    pngBuffer(180),
    pngBuffer(192),
  ])

  const ico = buildIco([
    { size: 16, data: p16 },
    { size: 32, data: p32 },
    { size: 48, data: p48 },
  ])

  await write(path.join(ROOT, "app", "favicon.ico"), ico)
  await write(path.join(ROOT, "app", "icon.png"), p192)
  await write(path.join(ROOT, "app", "apple-icon.png"), p180)
  await write(path.join(ROOT, "public", "favicon-32x32.png"), p32)
  await write(path.join(ROOT, "public", "favicon-192x192.png"), p192)

  console.log("done.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
