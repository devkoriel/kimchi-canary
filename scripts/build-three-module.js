import { readFile, writeFile } from "node:fs/promises";

const sourcePath = new URL("../node_modules/three/build/three.module.min.js", import.meta.url);
const coreSourcePath = new URL("../node_modules/three/build/three.core.min.js", import.meta.url);
const outputPath = new URL("../src/three.generated.js", import.meta.url);
const source = await readFile(sourcePath, "utf8");
const coreSource = await readFile(coreSourcePath, "utf8");

await writeFile(
  outputPath,
  [
    `export const THREE_MODULE_SOURCE = ${JSON.stringify(source)};`,
    `export const THREE_CORE_SOURCE = ${JSON.stringify(coreSource)};`,
    "",
  ].join("\n"),
);
