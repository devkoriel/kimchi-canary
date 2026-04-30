import assert from "node:assert/strict";
import test from "node:test";
import { LANGUAGES, getStrings } from "../src/i18n.js";
import {
  renderAdmin,
  renderAssessmentPage,
  renderCaseDetail,
  renderHiringKit,
  renderHome,
  renderMethodology,
  renderReportPage,
  renderWatchlistPage,
} from "../src/render.js";
import { PUBLIC_CASES } from "../src/cases.js";

test("exposes the broad language set with operational translations", () => {
  assert.deepEqual(
    LANGUAGES.map((language) => language.code),
    ["en", "ko", "ja", "zh", "es", "fr", "de", "pt", "ru", "ar", "hi"],
  );
});

test("non-English pages localize primary questionnaire chrome", () => {
  for (const language of LANGUAGES.filter((item) => item.code !== "en")) {
    const html = renderHome({ language: language.code, reportsEnabled: false, approvedReports: [], origin: "https://kimchicanary.xyz" });

    assert.doesNotMatch(html, /Screen observed fraud indicators before access increases\./, language.code);
    assert.doesNotMatch(html, /Name, address, education, work history/, language.code);
    assert.doesNotMatch(html, /Candidate refuses live video/, language.code);
    assert.doesNotMatch(html, /Pause onboarding or privileged access/, language.code);
    assert.doesNotMatch(html, /Fake resume\? Bonk\./, language.code);
  }
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

  assert.match(html, /main \{\s+flex: 1 0 auto;\s+overflow-x: clip;/);
  assert.match(html, /position: sticky/);
  assert.match(html, /"prompts result"/);
  assert.match(html, /max-height: calc\(100vh - 120px\)/);
  assert.doesNotMatch(html, /"prompts prompts"/);
});

test("adds operational trust surfaces and searchable watchlist", () => {
  const html = renderHome({ origin: "https://kimchicanary.xyz" });

  assert.match(html, /href="\/methodology"/);
  assert.match(html, /href="\/kit"/);
  assert.match(html, /href="\/assessment"/);
  assert.match(html, /href="\/watchlist"/);
  assert.match(html, /href="\/report"/);
  assert.match(html, /id="case-search"/);
  assert.match(html, /data-case-card/);
  assert.match(html, /View dossier/);
});

test("renders methodology, printable kit, assessment, watchlist, report, and case detail pages", () => {
  const methodology = renderMethodology({ origin: "https://kimchicanary.xyz" });
  const kit = renderHiringKit({ origin: "https://kimchicanary.xyz" });
  const assessment = renderAssessmentPage({ origin: "https://kimchicanary.xyz" });
  const watchlist = renderWatchlistPage({ origin: "https://kimchicanary.xyz" });
  const report = renderReportPage({ origin: "https://kimchicanary.xyz" });
  const detail = renderCaseDetail({ caseItem: PUBLIC_CASES[0], origin: "https://kimchicanary.xyz" });

  assert.match(methodology, /Evidence first\. No nationality shortcuts\./);
  assert.match(methodology, /Corrections and removals/);
  assert.match(kit, /Printable hiring kit/);
  assert.match(kit, /USDC or crypto payroll is normal in Web3/);
  assert.match(assessment, /Active Assessment Protocol/);
  assert.match(assessment, /Screen observed fraud indicators before access increases\./);
  assert.match(watchlist, /Official source watchlist/);
  assert.match(report, /Private by default\. Published only after review\./);
  assert.match(detail, /Listed people\/entities/);
  assert.match(detail, /Official case page/);
});

test("renders complete public SEO metadata", () => {
  const home = renderHome({ language: "ko", origin: "https://kimchicanary.xyz" });
  const methodology = renderMethodology({ origin: "https://kimchicanary.xyz" });
  const kit = renderHiringKit({ origin: "https://kimchicanary.xyz" });
  const detail = renderCaseDetail({ caseItem: PUBLIC_CASES[0], origin: "https://kimchicanary.xyz" });

  assert.match(home, /rel="canonical" href="https:\/\/kimchicanary\.xyz\/\?lang=ko"/);
  assert.match(home, /hreflang="en" href="https:\/\/kimchicanary\.xyz\/"/);
  assert.match(home, /twitter:image:alt/);
  assert.match(home, /"@graph"/);
  assert.match(home, /"WebApplication"/);

  for (const html of [methodology, kit, detail]) {
    assert.match(html, /meta name="robots" content="index,follow,max-image-preview:large"/);
    assert.match(html, /meta property="og:site_name" content="Kimchi Canary"/);
    assert.match(html, /meta name="twitter:card" content="summary_large_image"/);
    assert.match(html, /"BreadcrumbList"/);
    assert.match(html, /"Article"/);
  }

  assert.match(detail, /meta property="article:published_time" content="2025-06-24"/);
});

test("renders favicon links on every html page", () => {
  const pages = [
    renderHome({ origin: "https://kimchicanary.xyz" }),
    renderAssessmentPage({ origin: "https://kimchicanary.xyz" }),
    renderWatchlistPage({ origin: "https://kimchicanary.xyz" }),
    renderReportPage({ origin: "https://kimchicanary.xyz" }),
    renderMethodology({ origin: "https://kimchicanary.xyz" }),
    renderHiringKit({ origin: "https://kimchicanary.xyz" }),
    renderCaseDetail({ caseItem: PUBLIC_CASES[0], origin: "https://kimchicanary.xyz" }),
    renderAdmin(),
  ];

  for (const html of pages) {
    assert.match(html, /rel="icon" href="\/favicon\.ico"/);
    assert.match(html, /rel="icon" href="\/favicon\.svg"/);
    assert.match(html, /rel="apple-touch-icon" href="\/apple-touch-icon\.png"/);
  }
});
