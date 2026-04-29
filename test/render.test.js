import assert from "node:assert/strict";
import test from "node:test";
import { LANGUAGES, getStrings } from "../src/i18n.js";
import { renderHome } from "../src/render.js";

test("only exposes languages with operational translations", () => {
  assert.deepEqual(
    LANGUAGES.map((language) => language.code),
    ["en", "ko", "zh"],
  );
});

test("renders localized Chinese questionnaire text", () => {
  const html = renderHome({ language: "zh", reportsEnabled: false, approvedReports: [], origin: "https://kimchicanary.xyz" });

  assert.match(html, /身份和文件/);
  assert.match(html, /候选人声称有韩国学历/);
  assert.match(html, /权重 14/);
  assert.match(html, /操作文本已本地化/);
  assert.doesNotMatch(html, /Name, address, education, work history/);
});

test("renders Korean localized score labels", () => {
  const strings = getStrings("ko");

  assert.equal(strings.levels.low.label, "낮은 관찰 리스크");
  assert.equal(strings.actionLabels.verifyDocuments.includes("신원"), true);
});

test("keeps sticky result CSS unblocked by the main layout", () => {
  const html = renderHome();

  assert.match(html, /main \{ overflow-x: clip; \}/);
  assert.match(html, /position: sticky/);
});
