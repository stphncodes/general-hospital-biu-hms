/**
 * Generates raster icons from src/app/icon.svg:
 *
 *   src/app/favicon.ico      16, 32 and 48 px (PNG-encoded ICO entries)
 *   src/app/apple-icon.png   180 px, white mark on the primary blue
 *
 * Next.js picks these files up automatically (App Router metadata files).
 * Run with `npm run icons` after changing the SVG.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const appDir = fileURLToPath(new URL("../src/app/", import.meta.url));
const svg = await readFile(`${appDir}icon.svg`);

// Mirrors --hms-primary / --hms-surface in globals.css.
const PRIMARY = "#15803d";
const SURFACE = "#ffffff";

async function png(size, source = svg) {
  return sharp(source, { density: 72 * (size / 32) * 2 })
    .resize(size, size)
    .png()
    .toBuffer();
}

/** Packs PNG images into a single .ico container (supported since Vista). */
function toIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  const entries = [];
  let offset = 6 + images.length * 16;
  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette colours
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += data.length;
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(
  icoSizes.map(async (size) => ({ size, data: await png(size) })),
);
await writeFile(`${appDir}favicon.ico`, toIco(icoImages));

// Apple touch icon: iOS ignores transparency, so render the mark in white on
// a solid primary square (iOS applies its own rounded mask).
const appleSvg = Buffer.from(
  svg
    .toString()
    .replaceAll(`fill="${PRIMARY}"`, `fill="${SURFACE}"`)
    .replace(`stroke="${SURFACE}"`, `stroke="${PRIMARY}"`),
);
const mark = await png(124, appleSvg);
const apple = await sharp({
  create: { width: 180, height: 180, channels: 4, background: PRIMARY },
})
  .composite([{ input: mark, top: 28, left: 28 }])
  .png()
  .toBuffer();
await writeFile(`${appDir}apple-icon.png`, apple);

process.stdout.write("Wrote favicon.ico (16/32/48) and apple-icon.png (180).\n");
