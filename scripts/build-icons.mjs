// Rasterises the brand SVGs into every static asset slot the site references.
// sharp handles SVG -> PNG; the .ico container is assembled by hand because
// sharp cannot write ICO. Modern ICOs may hold PNG payloads directly, so each
// directory entry just points at a complete PNG.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const render = (svgPath, px, { background } = {}) => {
  const svg = readFileSync(svgPath);
  let pipe = sharp(svg, { density: 384 }).resize(px, px, {
    fit: "contain",
    background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
  });
  if (background) pipe = pipe.flatten({ background });
  return pipe.png().toBuffer();
};

const ico = (entries) => {
  const dir = Buffer.alloc(6 + entries.length * 16);
  dir.writeUInt16LE(0, 0); // reserved
  dir.writeUInt16LE(1, 2); // type: icon
  dir.writeUInt16LE(entries.length, 4);
  let offset = dir.length;
  entries.forEach(({ size, png }, i) => {
    const p = 6 + i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, p);
    dir.writeUInt8(size >= 256 ? 0 : size, p + 1);
    dir.writeUInt8(0, p + 2); // palette
    dir.writeUInt8(0, p + 3); // reserved
    dir.writeUInt16LE(1, p + 4); // colour planes
    dir.writeUInt16LE(32, p + 6); // bits per pixel
    dir.writeUInt32LE(png.length, p + 8);
    dir.writeUInt32LE(offset, p + 12);
    offset += png.length;
  });
  return Buffer.concat([dir, ...entries.map((e) => e.png)]);
};

const INK = { r: 5, g: 7, b: 11, alpha: 1 };

const markPath = `${ROOT}/public/images/logo/mark-on-dark.svg`;
const simplePath = `${ROOT}/public/images/logo/mark-simple-on-dark.svg`;
const ogPath = `${ROOT}/public/images/logo/og-card.svg`;

// Small sizes take the simplified cut — the comb-toothed antennae turn to mud
// below ~24px, and a fatter, blunter moth beats a faithful smudge.
const [f16, f32, f48, apple] = await Promise.all([
  render(simplePath, 16),
  render(simplePath, 32),
  render(simplePath, 48),
  render(markPath, 180, { background: INK }),
]);

writeFileSync(`${ROOT}/public/seo/favicon-16x16.png`, f16);
writeFileSync(`${ROOT}/public/seo/favicon-32x32.png`, f32);
writeFileSync(`${ROOT}/public/seo/apple-touch-icon.png`, apple);
writeFileSync(
  `${ROOT}/public/seo/favicon.ico`,
  ico([
    { size: 16, png: f16 },
    { size: 32, png: f32 },
    { size: 48, png: f48 },
  ]),
);

const og = await sharp(readFileSync(ogPath), { density: 192 })
  .resize(1200, 630)
  .flatten({ background: INK })
  .png()
  .toBuffer();
writeFileSync(`${ROOT}/public/seo/og.png`, og);

console.log(
  [
    `favicon-16x16.png  ${f16.length}b`,
    `favicon-32x32.png  ${f32.length}b`,
    `apple-touch-icon.png ${apple.length}b`,
    `favicon.ico        ${(f16.length + f32.length + f48.length + 54)}b`,
    `og.png             ${og.length}b`,
  ].join("\n"),
);
