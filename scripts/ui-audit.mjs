import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:8791";
const outputDir = "/tmp/kimchi-canary-audit";
const pages = ["/", "/assessment", "/watchlist", "/report", "/methodology", "/kit", "/cases/kim-kwang-jin-team", "/admin"];
const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 1200 },
  { name: "wide", width: 2560, height: 1440 },
];

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch();
const failures = [];

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("ERR_BLOCKED_BY_RESPONSE.NotSameOrigin")) consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  for (const path of pages) {
    const url = `${baseUrl}${path}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(900);
    await page.waitForFunction(() => !document.querySelector("[data-site-loader]"), { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(450);
    await page.screenshot({
      path: `${outputDir}/${viewport.name}${path === "/" ? "-home" : path.replaceAll("/", "-")}.png`,
      fullPage: path !== "/",
    });

    const audit = await page.evaluate(() => {
      const root = document.documentElement;
      const visibleCanvasCount = Array.from(document.querySelectorAll("canvas")).filter((canvas) => {
        const rect = canvas.getBoundingClientRect();
        return rect.width > 4 && rect.height > 4 && rect.bottom > 0 && rect.top < window.innerHeight;
      }).length;
      const offenders = Array.from(document.querySelectorAll("body *"))
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            tag: element.tagName.toLowerCase(),
            className: String(element.className || ""),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
            text: String(element.textContent || "").trim().slice(0, 80),
          };
        })
        .filter((item) => item.width > 0 && (item.left < -2 || item.right > window.innerWidth + 2))
        .slice(0, 8);
      return {
        title: document.title,
        scrollWidth: root.scrollWidth,
        innerWidth: window.innerWidth,
        webglReady: document.body.classList.contains("webgl-ready"),
        visibleCanvasCount,
        offenders,
        favicon: Boolean(document.querySelector('link[rel="icon"][href="/favicon.svg"]')),
      };
    });

    if (!audit.title || audit.title.length < 8) failures.push(`${viewport.name} ${path}: missing title`);
    if (!audit.favicon) failures.push(`${viewport.name} ${path}: missing favicon link`);
    if (audit.scrollWidth > audit.innerWidth + 1) failures.push(`${viewport.name} ${path}: horizontal overflow ${audit.scrollWidth}/${audit.innerWidth} ${JSON.stringify(audit.offenders)}`);
    if (path === "/" && !audit.webglReady) failures.push(`${viewport.name} ${path}: WebGL did not initialize`);
    if (path === "/" && audit.visibleCanvasCount < 1) failures.push(`${viewport.name} ${path}: expected visible WebGL canvas`);
  }

  if (consoleErrors.length) failures.push(`${viewport.name}: console errors ${JSON.stringify(consoleErrors.slice(0, 6))}`);
  await page.close();
}

await browser.close();

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`UI audit passed. Screenshots: ${outputDir}`);
