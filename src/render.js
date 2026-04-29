import { EXTRA_SOURCE_LINKS, OFFICIAL_SOURCES, PUBLIC_CASES } from "./cases.js";
import { LANGUAGES, getStrings } from "./i18n.js";
import { assessCandidate, INTERVIEW_PROMPTS, SIGNAL_CATEGORIES, SIGNALS } from "./scoring.js";

const SOURCE_BY_ID = new Map([
  ...OFFICIAL_SOURCES.map((source) => [source.id, source]),
  ...Object.entries(EXTRA_SOURCE_LINKS).map(([id, source]) => [id, source]),
]);

export function renderHome({ language = "en", reportsEnabled = true, approvedReports = [], origin = "https://kimchicanary.com" } = {}) {
  const t = getStrings(language);
  const dir = language === "ar" ? "rtl" : "ltr";
  const initialAssessment = assessCandidate([]);
  const listedSubjects = PUBLIC_CASES.reduce((total, item) => total + item.names.length, 0);
  const officialPhotos = PUBLIC_CASES.reduce((total, item) => total + (item.photos?.length || 0), 0);
  const canonicalUrl = `${origin}/`;
  const ogImageUrl = `${origin}/og.png`;
  const description = "Kimchi Canary helps Web3 HR, security, and compliance teams screen DPRK remote IT worker fraud indicators with official-source guidance.";

  return html`<!doctype html>
    <html lang="${escapeHtml(language)}" dir="${dir}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="${escapeAttribute(description)}" />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        ${renderAlternateLinks(origin)}
        <meta property="og:title" content="Kimchi Canary | Web3 Hiring Risk Desk" />
        <meta property="og:description" content="${escapeAttribute(description)}" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${escapeAttribute(canonicalUrl)}" />
        <meta property="og:site_name" content="Kimchi Canary" />
        <meta property="og:image" content="${escapeAttribute(ogImageUrl)}" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Kimchi Canary Web3 hiring risk desk logo card" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kimchi Canary | Web3 Hiring Risk Desk" />
        <meta name="twitter:description" content="${escapeAttribute(description)}" />
        <meta name="twitter:image" content="${escapeAttribute(ogImageUrl)}" />
        <script type="application/ld+json">${jsonLd({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Kimchi Canary",
          url: canonicalUrl,
          description,
          inLanguage: LANGUAGES.map((item) => item.code),
          publisher: {
            "@type": "Organization",
            name: "Kimchi Canary",
          },
        })}</script>
        <title>Kimchi Canary | Web3 Hiring Risk Desk</title>
        <style>${styles()}</style>
      </head>
      <body>
        <header class="topbar">
          <a class="brand" href="/">
            <span class="brand-mark">KC</span>
            <span>Kimchi Canary</span>
          </a>
          <nav aria-label="Primary">
            <a href="#assessment">${escapeHtml(t.startAssessment)}</a>
            <a href="#reports">${escapeHtml(t.reportSuspect)}</a>
            <a href="#cases">Watchlist</a>
          </nav>
          <label class="language-picker">
            <span>${escapeHtml(t.language)}</span>
            <select id="language-select" aria-label="${escapeHtml(t.language)}">
              ${LANGUAGES.map(
                (item) => html`<option value="${item.code}" ${item.code === language ? "selected" : ""}>${escapeHtml(item.label)}</option>`,
              ).join("")}
            </select>
          </label>
        </header>

        <main>
          <section class="hero">
            <div class="hero-inner">
              <div class="logo-lockup" aria-label="Kimchi Canary logo">${renderKimchiLogo()}</div>
              <p class="eyebrow">${escapeHtml(t.eyebrow)}</p>
              <h1>${escapeHtml(t.title)}</h1>
              <p class="subtitle">${escapeHtml(t.subtitle)}</p>
              <p class="hero-copy">${escapeHtml(t.heroCopy)}</p>
              ${renderFraudBonk(t)}
              <div class="hero-actions">
                <a class="button primary" href="#assessment">${escapeHtml(t.startAssessment)}</a>
                <a class="button secondary" href="#cases">${escapeHtml(t.watchlist || "Watchlist")}</a>
              </div>
              <div class="stat-row" aria-label="Database scope">
                <span><strong>${PUBLIC_CASES.length}</strong> ${escapeHtml(t.verifiedSourceGroups || "verified source groups")}</span>
                <span><strong>${listedSubjects}</strong> ${escapeHtml(t.listedSubjects || "listed people/entities")}</span>
                <span><strong>${officialPhotos}</strong> ${escapeHtml(t.officialPhotos || "official photos")}</span>
              </div>
            </div>
          </section>

          <section class="trust-band" id="trust">
            <div class="section-head">
              <p class="eyebrow">${escapeHtml(t.trustTitle)}</p>
              <h2>${escapeHtml(t.trustCopy)}</h2>
            </div>
            <div class="trust-grid">
              ${(t.trustCards || []).map((card) => html`<article><strong>${escapeHtml(card.title)}</strong><p>${escapeHtml(card.copy)}</p></article>`).join("")}
            </div>
          </section>

          <section class="tool-grid" id="assessment">
            <div class="section-head">
              <p class="eyebrow">${escapeHtml(t.assessmentTitle)}</p>
              <h2>${escapeHtml(t.assessmentHeading || "Screen observed fraud indicators before access increases.")}</h2>
              <p>${escapeHtml(t.assessmentCopy)}</p>
              ${language !== "en" && t.translationNote ? html`<p class="translation-note">${escapeHtml(t.translationNote)}</p>` : ""}
            </div>
            <aside class="result-panel" id="result-panel" aria-live="polite">
              ${renderAssessment(initialAssessment, t)}
            </aside>
            <form class="questionnaire" id="questionnaire">
              ${SIGNAL_CATEGORIES.map((category) => renderCategory(category, t)).join("")}
            </form>
            ${renderInterviewPrompts(t)}
          </section>

          <section class="workflow">
            <div class="section-head">
              <p class="eyebrow">${escapeHtml(t.playbookEyebrow || "Operational playbook")}</p>
              <h2>${escapeHtml(t.playbookTitle || "Useful in real hiring, vendor review, and incident response.")}</h2>
            </div>
            <div class="steps">
              ${(t.workflowSteps || []).map(
                (step, index) => html`<article>
                  <span>${String(index + 1).padStart(2, "0")}</span>
                  <h3>${escapeHtml(step.title)}</h3>
                  <p>${escapeHtml(step.copy)}</p>
                </article>`,
              ).join("")}
            </div>
          </section>

          <section class="report-section" id="reports">
            <div class="section-head">
              <p class="eyebrow">${escapeHtml(t.reportTitle)}</p>
              <h2>${escapeHtml(t.reportCopy)}</h2>
              <p class="contact-note">Need native South Korean review for Korean-language, dialect, vocabulary, or claimed-background consistency? Contact <a href="mailto:dev.koriel@gmail.com">dev.koriel@gmail.com</a>.</p>
            </div>
            ${reportsEnabled ? renderReportForm(t) : renderDisabledReports()}
          </section>

          <section class="cases-section" id="cases">
            <div class="section-head">
              <p class="eyebrow">${escapeHtml(t.officialCases)}</p>
              <h2>${escapeHtml(t.casesCopy)}</h2>
            </div>
            <div class="case-list">
              ${PUBLIC_CASES.map(renderCase).join("")}
            </div>
          </section>

          ${approvedReports.length ? renderApprovedReports(approvedReports) : ""}

          <section class="sources-section" id="sources">
            <div class="section-head">
              <p class="eyebrow">${escapeHtml(t.sources)}</p>
              <h2>Primary references used for Kimchi Canary controls.</h2>
            </div>
            <div class="source-list">
              ${[...OFFICIAL_SOURCES, ...Object.values(EXTRA_SOURCE_LINKS)].map(renderSource).join("")}
            </div>
          </section>
        </main>

        <footer>
          <strong>Kimchi Canary</strong>
          <span>Operational guidance, not legal advice. Consult counsel for sanctions and employment-law decisions.</span>
        </footer>

        <script type="module">${clientScript(language)}</script>
      </body>
    </html>`;
}

export function renderOgImage() {
  return html`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="Kimchi Canary Web3 hiring risk desk">
    <defs>
      <pattern id="grid" width="38" height="38" patternUnits="userSpaceOnUse">
        <path d="M38 0H0v38" fill="none" stroke="#ded8c8" stroke-width="1" />
      </pattern>
      <linearGradient id="kimchiRedOg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#f15a24" />
        <stop offset="1" stop-color="#a71916" />
      </linearGradient>
      <linearGradient id="glassOg" x1="0" x2="1">
        <stop offset="0" stop-color="#fff9ec" />
        <stop offset="1" stop-color="#f4d9b5" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="#f7f5ef" />
    <rect width="1200" height="630" fill="url(#grid)" opacity="0.6" />
    <rect x="70" y="64" width="1060" height="502" fill="#fffdf8" stroke="#101418" stroke-width="6" />
    <g transform="translate(98 150) scale(0.9)">
      <path d="M83 61h135l-12 48H95L83 61Z" fill="#101418" />
      <path d="M102 71h97l-7 24h-83l-7-24Z" fill="#f7f5ef" />
      <path d="M67 106c0-15 12-27 27-27h112c15 0 27 12 27 27v102c0 39-32 70-70 70h-26c-39 0-70-31-70-70V106Z" fill="url(#glassOg)" stroke="#101418" stroke-width="10" />
      <path d="M91 154c28-43 85-49 118-11 22 25 22 65-3 91-28 30-84 31-112 0-21-23-23-55-3-80Z" fill="url(#kimchiRedOg)" stroke="#101418" stroke-width="8" />
      <path d="M111 176c20-20 56-20 78 3" fill="none" stroke="#ffd36a" stroke-width="11" stroke-linecap="round" />
      <path d="M108 211c25 19 62 19 86-2" fill="none" stroke="#7bdc83" stroke-width="11" stroke-linecap="round" />
      <path d="M150 128c26 11 42 33 42 60 0 21-10 40-27 52 39-7 68-40 68-79 0-44-37-80-83-80v47Z" fill="#ffcc3d" stroke="#101418" stroke-width="8" />
      <path d="M187 128l32-14-10 34" fill="#ffcc3d" stroke="#101418" stroke-width="8" stroke-linejoin="round" />
      <circle cx="173" cy="135" r="7" fill="#101418" />
      <path d="M57 251h187" stroke="#101418" stroke-width="10" stroke-linecap="round" />
    </g>
    <text x="380" y="168" fill="#7f1611" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="900" letter-spacing="4">WEB3 HIRING RISK DESK</text>
    <text x="380" y="282" fill="#101418" font-family="Georgia, 'Times New Roman', serif" font-size="86" font-weight="900">Kimchi Canary</text>
    <text x="380" y="354" fill="#101418" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="800">DPRK remote IT worker fraud screening</text>
    <text x="380" y="414" fill="#5b6672" font-family="Inter, Arial, sans-serif" font-size="26">Official-source watchlist, HR questionnaire,</text>
    <text x="380" y="452" fill="#5b6672" font-family="Inter, Arial, sans-serif" font-size="26">and private report moderation for Web3 teams.</text>
    <g font-family="Inter, Arial, sans-serif" font-size="22" font-weight="800">
      <rect x="380" y="496" width="214" height="48" fill="#b3261e" stroke="#101418" stroke-width="4" />
      <text x="405" y="528" fill="#fff">Evidence first</text>
      <rect x="616" y="496" width="230" height="48" fill="#fffdf8" stroke="#101418" stroke-width="4" />
      <text x="641" y="528" fill="#101418">Private reports</text>
    </g>
  </svg>`;
}

export function renderFaviconImage() {
  return html`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" role="img" aria-label="Kimchi Canary favicon">
    <defs>
      <linearGradient id="faviconBg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#fffdf8" />
        <stop offset="1" stop-color="#f0d8b6" />
      </linearGradient>
      <linearGradient id="faviconRed" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#f15a24" />
        <stop offset="1" stop-color="#b3261e" />
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="96" fill="#101418" />
    <rect x="36" y="36" width="440" height="440" rx="76" fill="url(#faviconBg)" />
    <path d="M149 111h218l-18 71H167l-18-71Z" fill="#101418" />
    <path d="M181 127h154l-9 35H190l-9-35Z" fill="#f7f5ef" />
    <path d="M122 180c0-30 24-54 54-54h160c30 0 54 24 54 54v112c0 75-61 136-136 136s-136-61-136-136V180Z" fill="#fff7e8" stroke="#101418" stroke-width="22" />
    <path d="M162 266c34-70 124-86 178-33 44 43 42 116-3 158-52 48-144 37-176-27-16-33-15-66 1-98Z" fill="url(#faviconRed)" stroke="#101418" stroke-width="18" />
    <path d="M184 300c39-39 111-38 148 7" fill="none" stroke="#ffd36a" stroke-width="23" stroke-linecap="round" />
    <path d="M184 352c44 30 102 28 141-8" fill="none" stroke="#7bdc83" stroke-width="23" stroke-linecap="round" />
    <path d="M257 218c48 17 79 61 79 112 0 33-13 64-35 86 76-21 131-89 131-170 0-97-79-176-176-176v148Z" fill="#ffcc3d" stroke="#101418" stroke-width="18" />
    <path d="M329 206l72-36-24 76" fill="#ffcc3d" stroke="#101418" stroke-width="18" stroke-linejoin="round" />
    <circle cx="304" cy="227" r="16" fill="#101418" />
    <path d="M103 421h304" stroke="#101418" stroke-width="24" stroke-linecap="round" />
    </svg>`;
}

function renderFraudBonk(t = getStrings("en")) {
  return html`<div class="fraud-bonk" aria-label="${escapeAttribute(t.bonkAria || "Cartoon fraud-screening animation")}">
    <div class="bonk-stage">
      <svg viewBox="0 0 720 260" role="img" aria-label="Cartoon glove bonks a fake resume and proxy laptop">
        <defs>
          <filter id="bonkShadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="8" dy="10" stdDeviation="0" flood-color="#101418" flood-opacity="0.18" />
          </filter>
        </defs>
        <g class="fake-stack" filter="url(#bonkShadow)">
          <rect x="230" y="58" width="184" height="132" rx="8" fill="#fffdf8" stroke="#101418" stroke-width="5" />
          <rect x="252" y="82" width="86" height="13" fill="#101418" />
          <rect x="252" y="110" width="134" height="10" fill="#d7d2c4" />
          <rect x="252" y="132" width="104" height="10" fill="#d7d2c4" />
          <rect x="252" y="154" width="126" height="10" fill="#d7d2c4" />
          <text x="252" y="184" fill="#b3261e" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="900">FAKE RESUME</text>
        </g>
        <g class="proxy-laptop">
          <rect x="430" y="106" width="112" height="74" rx="8" fill="#101418" />
          <rect x="444" y="120" width="84" height="42" fill="#f7f5ef" />
          <path d="M414 190h146l-16 20H430z" fill="#101418" />
          <text x="448" y="148" fill="#b3261e" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="900">PROXY</text>
        </g>
        <g class="bonk-glove" filter="url(#bonkShadow)">
          <path d="M115 112c0-23 19-42 42-42h42c19 0 35 15 35 34v18h36c19 0 34 15 34 34 0 26-21 47-47 47H157c-23 0-42-19-42-42v-49Z" fill="#b3261e" stroke="#101418" stroke-width="7" />
          <path d="M151 73v-7c0-19 15-34 34-34s34 15 34 34v10" fill="#fffdf8" stroke="#101418" stroke-width="7" />
          <path d="M219 78v-5c0-18 15-33 33-33s33 15 33 33v54" fill="#fffdf8" stroke="#101418" stroke-width="7" />
          <path d="M304 148h82" stroke="#101418" stroke-width="12" stroke-linecap="round" />
        </g>
        <g class="bonk-burst">
          <path d="M421 45l18 34 37-12-22 31 30 24-38 2-8 37-18-34-37 12 22-31-30-24 38-2z" fill="#ffd36a" stroke="#101418" stroke-width="5" />
          <text x="406" y="116" fill="#101418" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="950">BONK</text>
        </g>
      </svg>
    </div>
    <div class="bonk-copy">
      <strong>${escapeHtml(t.bonkTitle || "Fake resume? Bonk.")}</strong>
      <span>${escapeHtml(t.bonkCopy || "Receipts first. Vibes later. Laptops never ship to mystery addresses.")}</span>
    </div>
  </div>`;
}

export function renderAdmin({ reports = [], tokenPresent = false, token = "" } = {}) {
  return html`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Kimchi Canary Admin</title>
        <style>${styles()}</style>
      </head>
      <body>
        <header class="topbar">
          <a class="brand" href="/"><span class="brand-mark">KC</span><span>Kimchi Canary</span></a>
        </header>
        <main class="admin-main">
          <section class="section-head">
            <p class="eyebrow">Moderation queue</p>
            <h1>Private reports awaiting review</h1>
            <p>${tokenPresent ? "Approve only when an entry has official or independently verifiable public evidence." : "Set ADMIN_TOKEN and pass ?token=... to access reports."}</p>
          </section>
          <div class="admin-list">
            ${reports.length === 0 ? html`<p class="empty">No reports in this view.</p>` : reports.map((report) => renderReport(report, token)).join("")}
          </div>
        </main>
      </body>
    </html>`;
}

export function renderAssessment(assessment, t = getStrings("en")) {
  const levelText = t.levels?.[assessment.level] || { label: assessment.label, summary: assessment.summary };
  const evidenceItems = localizeEvidenceItems(assessment, t);
  return html`<div class="score-row">
      <span>${escapeHtml(t.result)}</span>
      <strong>${escapeHtml(levelText.label)}</strong>
    </div>
    <div class="score-summary">
      <div class="score-circle" style="--score: ${assessment.score}">
        <span>${escapeHtml(String(assessment.score))}</span>
        <small>${escapeHtml(t.score)}</small>
      </div>
      <p>${escapeHtml(levelText.summary)}</p>
    </div>
    <div class="result-columns">
      <div class="result-group">
        <h3>${escapeHtml(t.actions)}</h3>
        <ul>${assessment.actions.map((action) => html`<li>${escapeHtml(t.actionLabels?.[action.id] || action.label)}</li>`).join("")}</ul>
      </div>
      <div class="result-group">
        <h3>${escapeHtml(t.evidence)}</h3>
        <ul>${evidenceItems.slice(0, 6).map((item) => html`<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>
    </div>`;
}

function renderCategory(category, t = getStrings("en")) {
  const signals = SIGNALS.filter((signal) => signal.category === category.id);
  const label = t.categoryLabels?.[category.id] || category.label;
  const description = t.categoryDescriptions?.[category.id] || category.description;
  return html`<fieldset>
    <legend>
      <span>${escapeHtml(label)}</span>
      ${description ? html`<small>${escapeHtml(description)}</small>` : ""}
    </legend>
    ${signals
      .map(
        (signal) => html`<label class="signal">
          <input type="checkbox" name="signal" value="${escapeHtml(signal.id)}" />
          <span>
            <strong>${escapeHtml(t.signalLabels?.[signal.id] || signal.label)}</strong>
            <small>${escapeHtml(t.weightLabel || "Weight")} ${escapeHtml(String(signal.weight))}${signal.critical ? ` / ${escapeHtml(t.criticalLabel || "critical")}` : ""}</small>
          </span>
        </label>`,
      )
      .join("")}
  </fieldset>`;
}

function renderInterviewPrompts(t = getStrings("en")) {
  const promptGroups = t.interviewPromptGroups || INTERVIEW_PROMPTS;
  return html`<section class="prompt-bank" aria-label="${escapeAttribute(t.promptTitle || "Soft interview prompts")}">
    <div class="prompt-head">
      <p class="eyebrow">${escapeHtml(t.promptTitle || "Soft interview prompts")}</p>
      <h3>${escapeHtml(t.promptHeading || "Use these only when they are tied to the candidate's own claims.")}</h3>
      <p>${escapeHtml(t.promptCopy || "These prompts test consistency, liveness, and verifiable work history. They are not nationality tests.")}</p>
    </div>
    <div class="prompt-grid">
      ${promptGroups.map(
        (group) => html`<article>
          <h4>${escapeHtml(group.title)}</h4>
          <ul>${group.prompts.map((prompt) => html`<li>${escapeHtml(prompt)}</li>`).join("")}</ul>
        </article>`,
      ).join("")}
    </div>
  </section>`;
}

function localizeEvidenceItems(assessment, t) {
  if (!assessment.selectedSignals?.length) {
    return t.baselineEvidenceGaps || assessment.evidenceGaps;
  }

  return assessment.selectedSignals.map((signal) => {
    if (t.signalEvidence?.[signal.id]) return t.signalEvidence[signal.id];
    const label = t.signalLabels?.[signal.id] || signal.label;
    return t.evidenceTemplate ? t.evidenceTemplate.replace("{signal}", label) : signal.evidence;
  });
}

function renderReportForm(t) {
  return html`<form class="report-form" id="report-form">
    <div class="form-row">
      <label>
        Reporter email
        <input required name="reporterEmail" type="email" autocomplete="email" placeholder="security@example.com" />
      </label>
      <label>
        Organization
        <input name="organization" type="text" maxlength="160" placeholder="Company or security team" />
      </label>
    </div>
    <div class="form-row">
      <label>
        Suspect display name or handle
        <input required name="subjectName" type="text" maxlength="200" placeholder="Name, handle, vendor, or profile URL" />
      </label>
      <label>
        Source URL
        <input name="sourceUrl" type="url" placeholder="Official source, profile, or evidence URL" />
      </label>
    </div>
    <label>
      What happened?
      <textarea required name="narrative" rows="6" maxlength="6000" placeholder="List observed facts, dates, systems involved, and evidence you can provide privately."></textarea>
    </label>
    <label class="consent">
      <input required type="checkbox" name="acknowledge" value="yes" />
      <span>I understand this report is private and will not be published without review and sufficient evidence.</span>
    </label>
    <button class="button primary" type="submit">${escapeHtml(t.submitReport)}</button>
    <p class="form-status" id="report-status" role="status"></p>
  </form>`;
}

function renderDisabledReports() {
  return html`<div class="disabled">
    Report intake is not configured yet. Bind a D1 database and rerun migrations to enable private submissions.
  </div>`;
}

function renderCase(item) {
  const source = SOURCE_BY_ID.get(item.sourceId);
  return html`<article class="case-card">
    ${renderPhotos(item.photos)}
    <div class="case-meta">
      <span>${escapeHtml(item.status)}</span>
      <time datetime="${escapeHtml(item.date)}">${escapeHtml(item.date)}</time>
    </div>
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.summary)}</p>
    <details>
      <summary>${escapeHtml(String(item.names.length))} listed people/entities</summary>
      <div class="names">
        ${item.names
          .map((person) => html`<span>${escapeHtml(person.name)}${person.aliases.length ? html` <small>aka ${escapeHtml(person.aliases.join(", "))}</small>` : ""}</span>`)
          .join("")}
      </div>
    </details>
    <ul>${item.indicators.map((indicator) => html`<li>${escapeHtml(indicator)}</li>`).join("")}</ul>
    <div class="case-links">
      <a href="${escapeAttribute(item.link)}" target="_blank" rel="noreferrer">Official case page</a>
      ${source ? html`<a href="${escapeAttribute(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.publisher)}</a>` : ""}
    </div>
  </article>`;
}

function renderPhotos(photos = []) {
  if (!photos.length) {
    return html`<div class="photo-strip empty-photos"><span>Official record, no official photo published here</span></div>`;
  }

  return html`<div class="photo-strip">
    ${photos
      .map(
        (photo) => html`<figure class="photo-tile">
          <img src="${escapeAttribute(photo.url)}" alt="${escapeAttribute(photo.name)} official source photo" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.remove()" />
          <figcaption>${escapeHtml(photo.name)}</figcaption>
        </figure>`,
      )
      .join("")}
  </div>`;
}

function renderApprovedReports(reports) {
  return html`<section class="cases-section community-section">
    <div class="section-head">
      <p class="eyebrow">Reviewed community submissions</p>
      <h2>Approved reports from the private queue.</h2>
      <p>These are separate from official cases and should be treated as leads for internal review, not final legal findings.</p>
    </div>
    <div class="case-list">${reports.map(renderApprovedReport).join("")}</div>
  </section>`;
}

function renderApprovedReport(report) {
  return html`<article class="case-card community-card">
    <div class="case-meta">
      <span>Approved report</span>
      <time datetime="${escapeHtml(report.reviewed_at || report.created_at)}">${escapeHtml(report.reviewed_at || report.created_at)}</time>
    </div>
    <h3>${escapeHtml(report.subject_name)}</h3>
    <p>${escapeHtml(report.narrative)}</p>
    ${report.source_url ? html`<div class="case-links"><a href="${escapeAttribute(report.source_url)}" target="_blank" rel="noreferrer">Submitted source</a></div>` : ""}
  </article>`;
}

function renderSource(source) {
  return html`<a class="source-card" href="${escapeAttribute(source.url)}" target="_blank" rel="noreferrer">
    <span>${escapeHtml(source.publisher)} · ${escapeHtml(source.date)}</span>
    <strong>${escapeHtml(source.title)}</strong>
    ${source.note ? html`<small>${escapeHtml(source.note)}</small>` : ""}
  </a>`;
}

function renderReport(report, token) {
  const action = `/api/admin/reports/${encodeURIComponent(report.id)}/status${token ? `?token=${encodeURIComponent(token)}` : ""}`;
  return html`<article class="case-card">
    <div class="case-meta">
      <span>${escapeHtml(report.status)}</span>
      <time datetime="${escapeHtml(report.created_at)}">${escapeHtml(report.created_at)}</time>
    </div>
    <h3>${escapeHtml(report.subject_name)}</h3>
    <p>${escapeHtml(report.narrative)}</p>
    <p><strong>Reporter:</strong> ${escapeHtml(report.reporter_email)} ${report.organization ? `(${escapeHtml(report.organization)})` : ""}</p>
    ${report.source_url ? html`<a href="${escapeAttribute(report.source_url)}" target="_blank" rel="noreferrer">${escapeHtml(report.source_url)}</a>` : ""}
    ${report.reviewer_note ? html`<p><strong>Reviewer note:</strong> ${escapeHtml(report.reviewer_note)}</p>` : ""}
    <form class="moderation-form" method="post" action="${escapeAttribute(action)}">
      <label>
        Reviewer note
        <input name="reviewerNote" maxlength="1000" placeholder="Why this is approved, rejected, or kept pending" />
      </label>
      <div class="moderation-buttons">
        <button class="button secondary" name="status" value="pending" type="submit">Keep pending</button>
        <button class="button primary" name="status" value="approved" type="submit">Approve</button>
        <button class="button danger" name="status" value="rejected" type="submit">Reject</button>
      </div>
    </form>
  </article>`;
}

function renderKimchiLogo() {
  return html`<svg class="kimchi-logo" viewBox="0 0 300 300" role="img" aria-label="Kimchi jar canary logo">
    <defs>
      <linearGradient id="kimchiRed" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#f15a24" />
        <stop offset="1" stop-color="#a71916" />
      </linearGradient>
      <linearGradient id="glass" x1="0" x2="1">
        <stop offset="0" stop-color="#fff9ec" />
        <stop offset="1" stop-color="#f4d9b5" />
      </linearGradient>
    </defs>
    <path d="M83 61h135l-12 48H95L83 61Z" fill="#101418" />
    <path d="M102 71h97l-7 24h-83l-7-24Z" fill="#f7f5ef" />
    <path d="M67 106c0-15 12-27 27-27h112c15 0 27 12 27 27v102c0 39-32 70-70 70h-26c-39 0-70-31-70-70V106Z" fill="url(#glass)" stroke="#101418" stroke-width="10" />
    <path d="M91 154c28-43 85-49 118-11 22 25 22 65-3 91-28 30-84 31-112 0-21-23-23-55-3-80Z" fill="url(#kimchiRed)" stroke="#101418" stroke-width="8" />
    <path d="M111 176c20-20 56-20 78 3" fill="none" stroke="#ffd36a" stroke-width="11" stroke-linecap="round" />
    <path d="M108 211c25 19 62 19 86-2" fill="none" stroke="#7bdc83" stroke-width="11" stroke-linecap="round" />
    <path d="M150 128c26 11 42 33 42 60 0 21-10 40-27 52 39-7 68-40 68-79 0-44-37-80-83-80v47Z" fill="#ffcc3d" stroke="#101418" stroke-width="8" />
    <path d="M187 128l32-14-10 34" fill="#ffcc3d" stroke="#101418" stroke-width="8" stroke-linejoin="round" />
    <circle cx="173" cy="135" r="7" fill="#101418" />
    <path d="M57 251h187" stroke="#101418" stroke-width="10" stroke-linecap="round" />
  </svg>`;
}

function renderAlternateLinks(origin) {
  const links = LANGUAGES.map(
    (item) => html`<link rel="alternate" hreflang="${escapeAttribute(item.code)}" href="${escapeAttribute(`${origin}/?lang=${item.code}`)}" />`,
  );
  links.push(html`<link rel="alternate" hreflang="x-default" href="${escapeAttribute(`${origin}/`)}" />`);
  return links.join("");
}

function jsonLd(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function clientScript(language) {
  return `
    const language = ${JSON.stringify(language)};
    const languageSelect = document.querySelector("#language-select");
    languageSelect?.addEventListener("change", (event) => {
      const next = event.target.value;
      const url = new URL(window.location.href);
      url.searchParams.set("lang", next);
      window.location.href = url.toString();
    });

    const questionnaire = document.querySelector("#questionnaire");
    const resultPanel = document.querySelector("#result-panel");
    questionnaire?.addEventListener("change", async () => {
      const selectedSignals = [...questionnaire.querySelectorAll("input[name='signal']:checked")].map((item) => item.value);
      const response = await fetch("/api/assess?lang=" + encodeURIComponent(language), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ selectedSignals }),
      });
      const payload = await response.json();
      resultPanel.innerHTML = payload.html;
    });

    const reportForm = document.querySelector("#report-form");
    const reportStatus = document.querySelector("#report-status");
    reportForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(reportForm);
      const payload = Object.fromEntries(formData.entries());
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      reportStatus.textContent = result.message || (response.ok ? "Report received." : "Unable to submit report.");
      reportStatus.classList.toggle("error", !response.ok);
      if (response.ok) reportForm.reset();
    });
  `;
}

function styles() {
  return `
    :root {
      --ink: #101418;
      --muted: #5b6672;
      --paper: #f7f5ef;
      --panel: #fffdf8;
      --line: #d7d2c4;
      --accent: #b3261e;
      --accent-dark: #7f1611;
      --gold: #c79a27;
      --green: #126a4a;
      --blue: #244f8f;
      --shadow: 0 24px 70px rgba(16, 20, 24, 0.14);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      color: var(--ink);
      background: var(--paper);
      background-image: linear-gradient(90deg, rgba(16, 20, 24, 0.045) 1px, transparent 1px), linear-gradient(rgba(16, 20, 24, 0.04) 1px, transparent 1px);
      background-size: 38px 38px;
    }
    a { color: inherit; }
    .topbar {
      position: sticky;
      top: 0;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      min-height: 72px;
      padding: 14px clamp(18px, 4vw, 56px);
      border-bottom: 1px solid rgba(16, 20, 24, 0.12);
      background: rgba(247, 245, 239, 0.94);
      backdrop-filter: blur(14px);
    }
    .brand, nav, .language-picker {
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    .brand {
      text-decoration: none;
      font-weight: 850;
      letter-spacing: 0;
      white-space: nowrap;
    }
    .brand-mark {
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      border: 2px solid var(--ink);
      background: var(--accent);
      color: white;
      font-size: 13px;
      box-shadow: 4px 4px 0 var(--ink);
    }
    nav {
      flex-wrap: wrap;
      justify-content: center;
    }
    nav a, .language-picker {
      border: 1px solid rgba(16, 20, 24, 0.14);
      background: rgba(255, 253, 248, 0.72);
      padding: 9px 12px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 750;
    }
    .language-picker select {
      width: auto;
      min-width: 126px;
      padding: 5px 8px;
      border: 0;
      background: transparent;
      font-weight: 800;
    }
    select, input, textarea {
      width: 100%;
      border: 1px solid var(--line);
      background: #fff;
      color: var(--ink);
      padding: 11px 12px;
      font: inherit;
      border-radius: 4px;
    }
    main { overflow-x: clip; }
    .hero {
      display: grid;
      place-items: center;
      min-height: auto;
      padding: clamp(34px, 5vw, 62px) clamp(18px, 5vw, 72px) 42px;
      border-bottom: 1px solid var(--line);
      text-align: center;
    }
    .hero-inner {
      width: min(100%, 980px);
      display: grid;
      justify-items: center;
    }
    .logo-lockup {
      width: min(42vw, 230px);
      min-width: 154px;
      margin-bottom: 14px;
    }
    .kimchi-logo {
      display: block;
      width: 100%;
      height: auto;
      filter: drop-shadow(10px 14px 0 rgba(16, 20, 24, 0.12));
    }
    .eyebrow {
      margin: 0 0 12px;
      color: var(--accent-dark);
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    h1, h2, h3, p { margin-top: 0; }
    h1 {
      margin-bottom: 14px;
      font-family: Georgia, "Times New Roman", serif;
      font-size: clamp(58px, 10vw, 124px);
      line-height: 0.86;
      letter-spacing: 0;
    }
    h2 {
      max-width: 940px;
      font-size: clamp(30px, 4.4vw, 58px);
      line-height: 1.03;
      letter-spacing: 0;
    }
    h3 {
      margin-bottom: 8px;
      font-size: 19px;
      line-height: 1.2;
    }
    p {
      color: var(--muted);
      font-size: 16px;
      line-height: 1.6;
    }
    .subtitle {
      max-width: 760px;
      color: var(--ink);
      font-size: clamp(22px, 3vw, 32px);
      line-height: 1.18;
      font-weight: 780;
    }
    .hero-copy { max-width: 720px; }
    .fraud-bonk {
      width: min(100%, 700px);
      margin-top: 20px;
      border: 2px solid var(--ink);
      background: rgba(255, 253, 248, 0.84);
      box-shadow: 6px 6px 0 var(--ink);
      overflow: hidden;
    }
    .bonk-stage {
      min-height: 190px;
      background:
        linear-gradient(90deg, rgba(16, 20, 24, 0.06) 1px, transparent 1px),
        linear-gradient(rgba(16, 20, 24, 0.05) 1px, transparent 1px),
        #fff8e8;
      background-size: 24px 24px;
    }
    .bonk-stage svg {
      display: block;
      width: 100%;
      height: auto;
    }
    .bonk-glove {
      transform-origin: 330px 148px;
      animation: bonkGlove 2.4s cubic-bezier(0.5, 0, 0.2, 1) infinite;
    }
    .fake-stack {
      transform-origin: 320px 130px;
      animation: fakeWobble 2.4s ease-in-out infinite;
    }
    .proxy-laptop {
      transform-origin: 486px 170px;
      animation: proxyWobble 2.4s ease-in-out infinite;
    }
    .bonk-burst {
      opacity: 0;
      transform-origin: 430px 100px;
      animation: bonkBurst 2.4s ease-in-out infinite;
    }
    .bonk-copy {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 14px;
      border-top: 2px solid var(--ink);
      background: var(--panel);
      text-align: left;
    }
    .bonk-copy strong {
      color: var(--accent-dark);
      font-weight: 950;
    }
    .bonk-copy span {
      color: var(--muted);
      font-weight: 750;
    }
    .hero-actions, .case-links, .moderation-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .hero-actions {
      justify-content: center;
      margin-top: 18px;
    }
    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 46px;
      border: 2px solid var(--ink);
      padding: 12px 18px;
      font-weight: 850;
      text-decoration: none;
      cursor: pointer;
      border-radius: 4px;
      box-shadow: 4px 4px 0 var(--ink);
    }
    .button.primary { background: var(--accent); color: white; }
    .button.secondary { background: var(--panel); color: var(--ink); }
    .button.danger { background: #2b1111; color: white; }
    @keyframes bonkGlove {
      0%, 48%, 100% { transform: translateX(-28px) rotate(-5deg); }
      58% { transform: translateX(92px) rotate(2deg); }
      68% { transform: translateX(42px) rotate(-9deg); }
    }
    @keyframes fakeWobble {
      0%, 52%, 100% { transform: rotate(0deg) translate(0, 0); }
      58% { transform: rotate(5deg) translate(12px, 2px); }
      66% { transform: rotate(-3deg) translate(-6px, 0); }
    }
    @keyframes proxyWobble {
      0%, 54%, 100% { transform: translate(0, 0); }
      60% { transform: translate(14px, 4px) rotate(3deg); }
      70% { transform: translate(-5px, 0) rotate(-2deg); }
    }
    @keyframes bonkBurst {
      0%, 54%, 100% { opacity: 0; transform: scale(0.7) rotate(-8deg); }
      58%, 68% { opacity: 1; transform: scale(1) rotate(0deg); }
    }
    .stat-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin-top: 24px;
    }
    .stat-row span {
      border: 1px solid var(--line);
      background: rgba(255, 253, 248, 0.86);
      padding: 10px 12px;
      color: var(--muted);
      font-weight: 750;
    }
    .stat-row strong { color: var(--ink); }
    .trust-band, .tool-grid, .workflow, .report-section, .cases-section, .sources-section {
      padding: clamp(52px, 7vw, 88px) clamp(18px, 5vw, 72px);
      border-bottom: 1px solid var(--line);
    }
    .trust-band {
      background: var(--ink);
      color: white;
    }
    .trust-band .section-head, .tool-grid, .workflow, .report-section, .cases-section, .sources-section, .admin-main {
      width: min(100%, 1120px);
      margin: 0 auto;
    }
    .trust-band h2, .trust-band p { color: white; }
    .trust-band .eyebrow { color: #ffd36a; }
    .trust-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin-top: 28px;
    }
    .trust-grid article {
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.08);
      padding: 18px;
    }
    .trust-grid strong { display: block; margin-bottom: 8px; }
    .tool-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(320px, 380px);
      grid-template-areas:
        "head head"
        "questions result"
        "prompts prompts";
      align-items: start;
      gap: 20px;
    }
    .tool-grid > .section-head { grid-area: head; }
    .section-head { max-width: 960px; }
    .questionnaire {
      grid-area: questions;
      display: grid;
      gap: 14px;
    }
    fieldset {
      margin: 0;
      padding: 0;
      border: 1px solid var(--line);
      background: rgba(255, 253, 248, 0.84);
    }
    legend {
      display: grid;
      gap: 4px;
      padding: 12px 14px;
      width: 100%;
      border-bottom: 1px solid var(--line);
      background: rgba(16, 20, 24, 0.04);
      font-weight: 900;
    }
    legend small {
      color: var(--muted);
      font-size: 12px;
      font-weight: 650;
      line-height: 1.4;
    }
    .signal {
      display: grid;
      grid-template-columns: 20px minmax(0, 1fr);
      gap: 12px;
      padding: 14px;
      border-bottom: 1px solid rgba(16, 20, 24, 0.08);
      cursor: pointer;
    }
    .signal:last-child { border-bottom: 0; }
    .signal input, .consent input {
      width: 18px;
      margin-top: 3px;
      accent-color: var(--accent);
    }
    .signal strong {
      display: block;
      line-height: 1.35;
    }
    .signal small, .case-card small, .source-card small {
      display: block;
      margin-top: 4px;
      color: var(--muted);
      line-height: 1.4;
    }
    .result-panel {
      grid-area: result;
      position: sticky;
      top: 96px;
      align-self: start;
      z-index: 8;
      padding: 20px;
      border: 2px solid var(--ink);
      background: var(--panel);
      box-shadow: var(--shadow);
    }
    .score-row {
      display: flex;
      align-items: flex-start;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 14px;
      margin-bottom: 18px;
      font-weight: 850;
    }
    .score-summary {
      display: grid;
      grid-template-columns: 132px minmax(0, 1fr);
      align-items: center;
      gap: 18px;
    }
    .score-circle {
      position: relative;
      display: grid;
      place-items: center;
      align-content: center;
      gap: 4px;
      width: 132px;
      height: 132px;
      border-radius: 999px;
      background: conic-gradient(var(--accent) calc(var(--score) * 1%), #ebe4d6 0);
      border: 2px solid var(--ink);
    }
    .score-circle::before {
      content: "";
      position: absolute;
      inset: 18px;
      border-radius: 999px;
      background: var(--panel);
    }
    .score-circle span {
      position: relative;
      z-index: 1;
      line-height: 1;
      font-size: 40px;
      font-weight: 950;
    }
    .score-circle small {
      position: relative;
      z-index: 1;
      color: var(--muted);
      font-size: 12px;
      font-weight: 800;
    }
    .result-columns {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
      margin-top: 18px;
      padding-top: 18px;
      border-top: 1px solid var(--line);
    }
    .result-group ul, .case-card ul {
      display: grid;
      gap: 8px;
      margin: 0;
      padding-left: 18px;
      color: var(--muted);
      line-height: 1.5;
    }
    .result-panel .result-columns {
      grid-template-columns: 1fr;
    }
    .prompt-bank {
      grid-area: prompts;
      border: 1px solid var(--line);
      background: rgba(255, 253, 248, 0.84);
      padding: 18px;
    }
    .prompt-head {
      max-width: 900px;
      margin-bottom: 14px;
    }
    .prompt-head h3 {
      margin: 0;
      font-size: 24px;
    }
    .prompt-head p:last-child {
      margin: 8px 0 0;
      color: var(--muted);
      line-height: 1.55;
    }
    .contact-note {
      color: var(--muted);
      line-height: 1.55;
    }
    .translation-note {
      max-width: 780px;
      border-left: 4px solid var(--gold);
      padding-left: 12px;
      color: var(--muted);
      font-size: 14px;
    }
    .contact-note a {
      color: var(--blue);
      font-weight: 850;
    }
    .prompt-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
    }
    .prompt-grid article {
      border: 1px solid rgba(16, 20, 24, 0.1);
      background: #fff;
      padding: 16px;
    }
    .prompt-grid h4 {
      margin: 0 0 10px;
      font-size: 16px;
      line-height: 1.25;
    }
    .prompt-grid ul {
      display: grid;
      gap: 8px;
      margin: 0;
      padding-left: 18px;
      color: var(--muted);
      line-height: 1.45;
    }
    .steps, .trust-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
    }
    .trust-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .steps article, .case-card, .source-card, .report-form, .disabled {
      border: 1px solid var(--line);
      background: var(--panel);
      padding: 18px;
    }
    .steps span {
      color: var(--accent-dark);
      font-weight: 950;
    }
    .report-form, .moderation-form {
      display: grid;
      gap: 14px;
    }
    .form-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }
    label {
      display: grid;
      gap: 7px;
      color: var(--ink);
      font-weight: 820;
    }
    textarea { resize: vertical; }
    .consent {
      display: grid;
      grid-template-columns: 18px minmax(0, 1fr);
      align-items: start;
      font-weight: 650;
      color: var(--muted);
    }
    .form-status { min-height: 24px; margin: 0; font-weight: 800; color: var(--green); }
    .form-status.error { color: var(--accent-dark); }
    .case-list, .source-list, .admin-list {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
    }
    .case-card {
      display: grid;
      gap: 12px;
    }
    .photo-strip {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
      gap: 10px;
      align-items: stretch;
    }
    .photo-tile {
      min-width: 0;
      margin: 0;
      border: 1px solid var(--line);
      background: #fff;
    }
    .photo-tile img {
      display: block;
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      background: #e9e1d2;
    }
    .photo-tile figcaption {
      padding: 7px;
      color: var(--muted);
      font-size: 12px;
      font-weight: 800;
      line-height: 1.25;
    }
    .empty-photos {
      display: block;
      padding: 12px;
      border: 1px dashed var(--line);
      color: var(--muted);
      font-weight: 750;
      background: #fff;
    }
    .case-meta {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      color: var(--muted);
      font-size: 12px;
      font-weight: 850;
      text-transform: uppercase;
    }
    details {
      border: 1px solid var(--line);
      background: #fff;
      padding: 10px;
    }
    summary {
      cursor: pointer;
      font-weight: 850;
    }
    .names {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }
    .names span {
      padding: 7px 9px;
      border: 1px solid var(--line);
      background: #fffdf8;
      font-weight: 850;
    }
    .case-links a, .source-card {
      color: var(--blue);
      font-weight: 850;
    }
    .source-card {
      display: grid;
      gap: 8px;
      text-decoration: none;
    }
    .source-card span {
      color: var(--accent-dark);
      font-size: 12px;
      font-weight: 900;
      text-transform: uppercase;
    }
    .community-section { background: rgba(18, 106, 74, 0.08); }
    .community-card { border-color: rgba(18, 106, 74, 0.28); }
    footer {
      display: flex;
      justify-content: space-between;
      gap: 14px;
      padding: 24px clamp(18px, 5vw, 72px);
      color: var(--muted);
      background: var(--panel);
    }
    .admin-main { padding-top: 48px; padding-bottom: 48px; }
    .empty { color: var(--muted); }

    @media (max-width: 980px) {
      .topbar { align-items: stretch; flex-direction: column; }
      nav { justify-content: flex-start; }
      .tool-grid {
        grid-template-columns: 1fr;
        grid-template-areas:
          "head"
          "result"
          "questions"
          "prompts";
      }
      .result-panel {
        position: static;
      }
      .steps, .trust-grid, .result-columns, .prompt-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .topbar {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        padding: 14px 18px;
      }
      nav {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }
      nav a {
        justify-content: center;
        min-width: 0;
        padding: 8px 6px;
        text-align: center;
        font-size: 12px;
        line-height: 1.15;
      }
      .language-picker { min-height: 40px; padding: 8px 12px; }
      .hero { padding-top: 28px; padding-bottom: 34px; }
      .logo-lockup { width: 118px; min-width: 0; }
      h1 { font-size: 48px; }
      .subtitle { font-size: 21px; }
      .hero-copy { font-size: 15px; }
      .fraud-bonk { box-shadow: 4px 4px 0 var(--ink); }
      .bonk-copy { flex-direction: column; }
      .stat-row { display: none; }
      .form-row, .score-summary { grid-template-columns: 1fr; }
      .score-circle { margin: 0 auto; }
      .hero-actions, footer, .case-meta { flex-direction: column; }
      .photo-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (prefers-reduced-motion: reduce) {
      .bonk-glove, .fake-stack, .proxy-laptop, .bonk-burst {
        animation: none;
      }
      .bonk-burst { opacity: 1; }
    }
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function html(strings, ...values) {
  let output = strings[0];
  for (let index = 0; index < values.length; index += 1) {
    output += values[index] + strings[index + 1];
  }
  return output;
}
