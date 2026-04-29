import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { renderFaviconImage, renderOgImage } from "../src/render.js";

const ogOutputPath = new URL("../src/og-image.generated.js", import.meta.url);
const faviconOutputPath = new URL("../src/favicon.generated.js", import.meta.url);
const ogPng = await sharp(Buffer.from(renderOgImage()))
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toBuffer();
const faviconSvg = Buffer.from(renderFaviconImage());
const faviconPng = await sharp(faviconSvg)
  .resize(64, 64)
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toBuffer();
const appleTouchIconPng = await sharp(faviconSvg)
  .resize(180, 180)
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toBuffer();

await mkdir(new URL("../src/", import.meta.url), { recursive: true });
await writeFile(
  ogOutputPath,
  `export const OG_IMAGE_PNG_BASE64 = ${JSON.stringify(ogPng.toString("base64"))};\n`,
);
await writeFile(
  faviconOutputPath,
  [
    `export const FAVICON_PNG_BASE64 = ${JSON.stringify(faviconPng.toString("base64"))};`,
    `export const APPLE_TOUCH_ICON_PNG_BASE64 = ${JSON.stringify(appleTouchIconPng.toString("base64"))};`,
    "",
  ].join("\n"),
);
