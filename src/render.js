import { EXTRA_SOURCE_LINKS, OFFICIAL_SOURCES, PUBLIC_CASES } from "./cases.js";
import { LANGUAGES, getStrings } from "./i18n.js";
import { assessCandidate, INTERVIEW_PROMPTS, SIGNAL_CATEGORIES, SIGNALS } from "./scoring.js";

const SOURCE_BY_ID = new Map([
  ...OFFICIAL_SOURCES.map((source) => [source.id, source]),
  ...Object.entries(EXTRA_SOURCE_LINKS).map(([id, source]) => [id, source]),
]);

export function renderHome({ language = "en", reportsEnabled = true, approvedReports = [], origin = "https://kimchicanary.xyz" } = {}) {
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
            <a href="#cases">${escapeHtml(t.watchlist || "Watchlist")}</a>
            <a href="/methodology">Methodology</a>
            <a href="/kit">Hiring kit</a>
            <a href="#reports">${escapeHtml(t.reportSuspect)}</a>
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
                <a class="button secondary" href="/kit">Print hiring kit</a>
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
            <div class="watchlist-tools">
              <label>
                Search watchlist
                <input id="case-search" type="search" autocomplete="off" placeholder="Name, alias, case, indicator, source..." />
              </label>
              <span id="case-count">${PUBLIC_CASES.length} official source groups</span>
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
      <svg viewBox="0 0 900 260" role="img" aria-label="Cartoon glove bonks a fake resume and proxy laptop">
        <defs>
          <filter id="bonkShadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="8" dy="10" stdDeviation="0" flood-color="#101418" flood-opacity="0.18" />
          </filter>
        </defs>
        <g class="fake-stack" filter="url(#bonkShadow)">
          <rect x="386" y="66" width="238" height="128" rx="8" fill="#fffdf8" stroke="#101418" stroke-width="5" />
          <rect x="412" y="91" width="102" height="13" fill="#101418" />
          <rect x="412" y="118" width="172" height="10" fill="#d7d2c4" />
          <rect x="412" y="141" width="132" height="10" fill="#d7d2c4" />
          <rect x="412" y="164" width="156" height="10" fill="#d7d2c4" />
          <text x="412" y="187" fill="#b3261e" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="900">FAKE RESUME</text>
        </g>
        <g class="proxy-laptop">
          <rect x="690" y="112" width="132" height="78" rx="8" fill="#101418" />
          <rect x="707" y="128" width="98" height="44" fill="#f7f5ef" />
          <path d="M668 200h180l-20 22H688z" fill="#101418" />
          <text x="724" y="156" fill="#b3261e" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="900">PROXY</text>
        </g>
        <g class="bonk-glove" filter="url(#bonkShadow)">
          <path d="M58 154h86" stroke="#101418" stroke-width="26" stroke-linecap="round" />
          <path d="M110 123h62v66h-62c-18 0-32-15-32-33v-1c0-18 14-32 32-32Z" fill="#fffdf8" stroke="#101418" stroke-width="7" />
          <path d="M154 151c-12-49 23-82 73-73 12-22 47-24 68-3 13 13 18 30 15 47 37 3 63 29 61 63-3 44-41 70-92 66l-101 8c-40 3-72-27-74-67-1-22 15-39 50-41Z" fill="#c3201e" stroke="#101418" stroke-width="8" />
          <path d="M250 199c33-8 63-4 80 13-15 24-51 34-87 20-14-6-13-28 7-33Z" fill="#9f1715" stroke="#101418" stroke-width="7" />
          <path d="M174 130c34-16 84-16 126 1" fill="none" stroke="#e85a49" stroke-width="10" stroke-linecap="round" opacity="0.75" />
          <path d="M122 136h42" stroke="#d7d2c4" stroke-width="7" stroke-linecap="round" />
          <path d="M122 158h42" stroke="#d7d2c4" stroke-width="7" stroke-linecap="round" />
        </g>
        <g class="bonk-burst">
          <path d="M382 48l20 38 42-13-26 35 35 27-44 3-10 42-20-38-42 13 26-35-35-27 44-3z" fill="#ffd36a" stroke="#101418" stroke-width="5" />
          <text x="362" y="122" fill="#101418" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="950">BONK</text>
        </g>
      </svg>
    </div>
    <div class="bonk-copy">
      <strong>${escapeHtml(t.bonkTitle || "Fake resume? Bonk.")}</strong>
      <span>${escapeHtml(t.bonkCopy || "Receipts first. Vibes later. Laptops never ship to mystery addresses.")}</span>
    </div>
  </div>`;
}

export function renderAdmin({ reports = [], authenticated = false, csrfToken = "", loginError = "" } = {}) {
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
            <p>${authenticated ? "Approve only when an entry has official or independently verifiable public evidence. Keep weak reports private." : "Sign in with the admin token stored in Cloudflare secrets."}</p>
          </section>
          ${
            authenticated
              ? html`<form class="logout-form" method="post" action="/admin/logout"><button class="button secondary" type="submit">Sign out</button></form>
                <div class="admin-list">
                  ${reports.length === 0 ? html`<p class="empty">No reports in this view.</p>` : reports.map((report) => renderReport(report, csrfToken)).join("")}
                </div>`
              : html`<form class="report-form admin-login" method="post" action="/admin/login">
                  <label>
                    Admin token
                    <input required name="token" type="password" autocomplete="current-password" placeholder="Cloudflare ADMIN_TOKEN" />
                  </label>
                  <button class="button primary" type="submit">Sign in</button>
                  ${loginError ? html`<p class="form-status error">${escapeHtml(loginError)}</p>` : ""}
                </form>`
          }
        </main>
      </body>
    </html>`;
}

export function renderMethodology({ origin = "https://kimchicanary.xyz" } = {}) {
  const canonicalUrl = `${origin}/methodology`;
  return html`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Kimchi Canary methodology for evidence-first DPRK remote IT worker fraud screening." />
        <link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <title>Methodology | Kimchi Canary</title>
        <style>${styles()}</style>
      </head>
      <body>
        ${renderSimpleTopbar()}
        <main class="page-main">
          <section class="section-head">
            <p class="eyebrow">Methodology</p>
            <h1>Evidence first. No nationality shortcuts.</h1>
            <p>Kimchi Canary is a risk triage desk for hiring, vendor review, and incident response. It helps teams preserve records and slow down access when independently verifiable fraud indicators appear.</p>
          </section>
          <section class="plain-grid">
            <article>
              <h2>What gets scored</h2>
              <p>Only observed operational indicators: identity mismatch, borrowed documents, remote-control tooling, impossible location patterns, shipping-route conflicts, payout anomalies, repository access behavior, and official public records.</p>
            </article>
            <article>
              <h2>What does not get scored</h2>
              <p>Nationality, ethnicity, fashion, accent, political speech, or discomfort on camera do not create a finding. Accent, dialect, or South Korea-specific details can only support a claim-consistency review when the candidate made that claim.</p>
            </article>
            <article>
              <h2>Public watchlist policy</h2>
              <p>Public entries are limited to official or equivalently reliable public records: FBI, DOJ, OFAC, sanctions notices, wanted pages, indictments, pleas, or sentencings. Allegations remain allegations unless a court or authority has resolved them.</p>
            </article>
            <article>
              <h2>Community reports</h2>
              <p>Reports are private by default. Approval requires a moderator review, a source or evidence summary, and enough detail for an employer to verify internally. Weak reports stay private or are rejected.</p>
            </article>
            <article>
              <h2>Corrections and removals</h2>
              <p>People or companies can request correction, extra context, or removal review by emailing <a href="mailto:dev.koriel@gmail.com">dev.koriel@gmail.com</a>. Include the case URL and the record you want corrected.</p>
            </article>
            <article>
              <h2>Operational caution</h2>
              <p>This is not legal advice and not an automated hiring decision system. Use it to guide due diligence, preserve evidence, and consult counsel for sanctions and employment-law decisions.</p>
            </article>
          </section>
        </main>
        ${renderFooter()}
      </body>
    </html>`;
}

export function renderHiringKit({ origin = "https://kimchicanary.xyz" } = {}) {
  const canonicalUrl = `${origin}/kit`;
  return html`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Printable Kimchi Canary hiring kit for Web3 HR and security teams." />
        <link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <title>Printable Hiring Kit | Kimchi Canary</title>
        <style>${styles()}</style>
      </head>
      <body>
        ${renderSimpleTopbar()}
        <main class="page-main kit-page">
          <section class="section-head">
            <p class="eyebrow">Printable hiring kit</p>
            <h1>Receipts first. Access later.</h1>
            <p>A short desk checklist for HR, security, founders, and vendor managers screening remote technical hires in crypto and Web3.</p>
            <button class="button primary print-button" type="button" onclick="window.print()">Print kit</button>
          </section>
          <section class="kit-grid">
            ${[
              ["Before interview", ["Verify identity, work authorization, school, and prior employment through independently sourced contacts.", "Require the candidate to explain their work setup, normal work hours, payroll/KYC route, and equipment delivery path.", "Flag reused resume text, repeated portfolios, duplicated profile photos, or shared payout details across applicants."]],
              ["Before laptop ships", ["Ship only to the address reconciled with verified identity records.", "Do not ship to a vendor, friend, hotel, mailbox, or last-minute alternate address without escalation.", "Keep MDM, EDR, logging, remote-access controls, and asset inventory ready before the device leaves."]],
              ["Before code access", ["Grant least privilege. Delay production, wallet, CI/CD, secrets, and signing-key access.", "Block unapproved VPN, proxy, KVM, remote desktop, and remote-control software.", "Watch for repository cloning, unusual off-hours access, and account logins from impossible locations."]],
              ["Crypto payroll reality", ["USDC or crypto payroll is normal in Web3; it is not a fraud signal by itself.", "Treat payment risk as contextual: mismatched KYC, third-party accounts, exchange pressure, tumbling requests, or inconsistent wallet ownership.", "Match payout accounts to the verified worker and preserve payroll/KYC records."]],
              ["If risk appears", ["Pause access expansion and preserve logs, interview records, documents, shipping records, and payout records.", "Ask neutral claim-specific questions. Avoid nationality tests or humiliating prompts.", "Escalate to legal, compliance, security, vendor owners, and relevant reporting channels when evidence supports it."]],
              ["The canary rule", ["One odd detail is a thread. Several independent conflicts are a rope.", "If the story needs a stranger's laptop, a borrowed identity, and a magic VPN, the bird is coughing.", "No witch hunts. Receipts or it stays private."]],
            ]
              .map(
                ([title, items]) => html`<article>
                  <h2>${escapeHtml(title)}</h2>
                  <ul>${items.map((item) => html`<li>${escapeHtml(item)}</li>`).join("")}</ul>
                </article>`,
              )
              .join("")}
          </section>
        </main>
        ${renderFooter()}
      </body>
    </html>`;
}

export function renderCaseDetail({ caseItem, origin = "https://kimchicanary.xyz" } = {}) {
  const source = SOURCE_BY_ID.get(caseItem.sourceId);
  const canonicalUrl = `${origin}/cases/${caseItem.id}`;
  const names = caseItem.names.flatMap((person) => [person.name, ...person.aliases]).join(", ");
  return html`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="${escapeAttribute(caseItem.summary)}" />
        <link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta property="og:title" content="${escapeAttribute(`${caseItem.title} | Kimchi Canary`)}" />
        <meta property="og:description" content="${escapeAttribute(caseItem.summary)}" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="${escapeAttribute(canonicalUrl)}" />
        <meta property="og:image" content="${escapeAttribute(`${origin}/og.png`)}" />
        <title>${escapeHtml(caseItem.title)} | Kimchi Canary</title>
        <style>${styles()}</style>
      </head>
      <body>
        ${renderSimpleTopbar()}
        <main class="page-main">
          <article class="case-detail">
            <div class="case-meta">
              <span>${escapeHtml(caseItem.status)}</span>
              <time datetime="${escapeHtml(caseItem.date)}">${escapeHtml(caseItem.date)}</time>
            </div>
            <h1>${escapeHtml(caseItem.title)}</h1>
            <p class="subtitle">${escapeHtml(caseItem.summary)}</p>
            ${renderPhotos(caseItem.photos)}
            <section class="plain-grid two">
              <article>
                <h2>Listed people/entities</h2>
                <div class="names">
                  ${caseItem.names
                    .map((person) => html`<span>${escapeHtml(person.name)}${person.aliases.length ? html` <small>aka ${escapeHtml(person.aliases.join(", "))}</small>` : ""}</span>`)
                    .join("")}
                </div>
              </article>
              <article>
                <h2>Observed indicators from source</h2>
                <ul>${caseItem.indicators.map((indicator) => html`<li>${escapeHtml(indicator)}</li>`).join("")}</ul>
              </article>
            </section>
            <section class="case-card">
              <h2>Source record</h2>
              <p>${source ? `${escapeHtml(source.publisher)} · ${escapeHtml(source.date)} · ${escapeHtml(source.title)}` : "Official source linked below."}</p>
              <p>Search names: ${escapeHtml(names)}</p>
              <div class="case-links">
                <a href="${escapeAttribute(caseItem.link)}" target="_blank" rel="noreferrer">Official case page</a>
                ${source ? html`<a href="${escapeAttribute(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.publisher)} source</a>` : ""}
                <a href="/#cases">Back to watchlist</a>
              </div>
            </section>
          </article>
        </main>
        ${renderFooter()}
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
        <ul>${assessment.actions.map((action) => html`<li>${escapeHtml(t.actionLabels?.[action.id] || t.actionFallback || action.label)}</li>`).join("")}</ul>
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
            <strong>${escapeHtml(t.signalLabels?.[signal.id] || t.signalFallback || signal.label)}</strong>
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
    const label = t.signalLabels?.[signal.id] || t.signalFallback || signal.label;
    return t.evidenceTemplate ? t.evidenceTemplate.replace("{signal}", label) : signal.evidence;
  });
}

function renderReportForm(t) {
  return html`<form class="report-form" id="report-form">
    <label class="trap" aria-hidden="true">
      Website
      <input name="website" type="text" autocomplete="off" tabindex="-1" />
    </label>
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
        Suspect profile URL
        <input name="subjectProfileUrl" type="url" placeholder="GitHub, LinkedIn, portfolio, vendor profile" />
      </label>
    </div>
    <div class="form-row">
      <label>
        Source or evidence URL
        <input name="sourceUrl" type="url" placeholder="Official source, case page, archived profile, or evidence URL" />
      </label>
      <label>
        Evidence summary
        <input name="evidenceSummary" type="text" maxlength="2000" placeholder="One-line fact pattern for moderator verification" />
      </label>
    </div>
    <fieldset class="evidence-fieldset">
      <legend>
        <span>Evidence type</span>
        <small>Select every category you can support with records.</small>
      </legend>
      <div class="checkbox-grid">
        ${[
          ["identity", "Identity or document mismatch"],
          ["profile", "Profile, resume, portfolio, or reused account"],
          ["device", "Device, proxy, VPN, KVM, or shipping path"],
          ["payment", "Payroll, USDC, wallet, exchange, or payout route"],
          ["interview", "Live interview, video, language, or work-history inconsistency"],
          ["access", "Repository, production, secrets, or system-access behavior"],
          ["official", "Official source or law-enforcement notice"],
          ["other", "Other independently verifiable evidence"],
        ]
          .map(
            ([value, label]) => html`<label class="mini-check">
              <input type="checkbox" name="evidenceType" value="${escapeAttribute(value)}" />
              <span>${escapeHtml(label)}</span>
            </label>`,
          )
          .join("")}
      </div>
    </fieldset>
    <label>
      What happened?
      <textarea required name="narrative" rows="6" maxlength="6000" placeholder="List observed facts, dates, systems involved, and evidence you can provide privately."></textarea>
    </label>
    <label class="consent">
      <input type="checkbox" name="contactPermission" value="yes" />
      <span>You may contact me for moderation follow-up. Do not publish my contact details.</span>
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
  const searchText = caseSearchText(item, source);
  return html`<article class="case-card" data-case-card data-search="${escapeAttribute(searchText)}">
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
      <a href="/cases/${escapeAttribute(item.id)}">Case detail</a>
      <a href="${escapeAttribute(item.link)}" target="_blank" rel="noreferrer">Official case page</a>
      ${source ? html`<a href="${escapeAttribute(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.publisher)}</a>` : ""}
    </div>
  </article>`;
}

function caseSearchText(item, source) {
  return [
    item.id,
    item.title,
    item.status,
    item.summary,
    item.date,
    source?.publisher,
    source?.title,
    ...item.indicators,
    ...item.names.flatMap((person) => [person.name, ...person.aliases]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
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
  const evidenceTypes = String(report.evidence_type || "")
    .split(",")
    .filter(Boolean)
    .join(", ");
  return html`<article class="case-card community-card">
    <div class="case-meta">
      <span>Approved report${report.reviewer_confidence ? ` · ${escapeHtml(report.reviewer_confidence)}` : ""}</span>
      <time datetime="${escapeHtml(report.reviewed_at || report.created_at)}">${escapeHtml(report.reviewed_at || report.created_at)}</time>
    </div>
    <h3>${escapeHtml(report.subject_name)}</h3>
    ${report.subject_profile_url ? html`<p><strong>Profile:</strong> <a href="${escapeAttribute(report.subject_profile_url)}" target="_blank" rel="noreferrer">${escapeHtml(report.subject_profile_url)}</a></p>` : ""}
    ${report.evidence_summary ? html`<p><strong>Evidence summary:</strong> ${escapeHtml(report.evidence_summary)}</p>` : ""}
    ${evidenceTypes ? html`<p><strong>Evidence type:</strong> ${escapeHtml(evidenceTypes)}</p>` : ""}
    <p>${escapeHtml(report.narrative)}</p>
    ${report.reviewer_note ? html`<p><strong>Reviewer note:</strong> ${escapeHtml(report.reviewer_note)}</p>` : ""}
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

function renderReport(report, csrfToken) {
  const action = `/api/admin/reports/${encodeURIComponent(report.id)}/status`;
  const evidenceTypes = String(report.evidence_type || "")
    .split(",")
    .filter(Boolean)
    .join(", ");
  return html`<article class="case-card">
    <div class="case-meta">
      <span>${escapeHtml(report.status)}</span>
      <time datetime="${escapeHtml(report.created_at)}">${escapeHtml(report.created_at)}</time>
    </div>
    <h3>${escapeHtml(report.subject_name)}</h3>
    <p>${escapeHtml(report.narrative)}</p>
    <p><strong>Reporter:</strong> ${escapeHtml(report.reporter_email)} ${report.organization ? `(${escapeHtml(report.organization)})` : ""}</p>
    ${report.contact_permission === "yes" ? html`<p><strong>Follow-up:</strong> Reporter granted private contact for moderation.</p>` : ""}
    ${report.subject_profile_url ? html`<p><strong>Profile:</strong> <a href="${escapeAttribute(report.subject_profile_url)}" target="_blank" rel="noreferrer">${escapeHtml(report.subject_profile_url)}</a></p>` : ""}
    ${report.evidence_summary ? html`<p><strong>Evidence summary:</strong> ${escapeHtml(report.evidence_summary)}</p>` : ""}
    ${evidenceTypes ? html`<p><strong>Evidence type:</strong> ${escapeHtml(evidenceTypes)}</p>` : ""}
    ${report.source_url ? html`<a href="${escapeAttribute(report.source_url)}" target="_blank" rel="noreferrer">${escapeHtml(report.source_url)}</a>` : ""}
    ${report.reviewer_note ? html`<p><strong>Reviewer note:</strong> ${escapeHtml(report.reviewer_note)}</p>` : ""}
    ${report.reviewer_name ? html`<p><strong>Reviewer:</strong> ${escapeHtml(report.reviewer_name)} ${report.reviewer_confidence ? `(${escapeHtml(report.reviewer_confidence)})` : ""}</p>` : ""}
    <form class="moderation-form" method="post" action="${escapeAttribute(action)}">
      <input type="hidden" name="csrf" value="${escapeAttribute(csrfToken)}" />
      <div class="form-row">
        <label>
          Reviewer name
          <input name="reviewerName" maxlength="120" placeholder="Internal reviewer or handle" />
        </label>
        <label>
          Reviewer confidence
          <select name="reviewerConfidence">
            <option value="reviewed">Reviewed lead</option>
            <option value="limited">Limited evidence</option>
            <option value="strong">Strong independent evidence</option>
          </select>
        </label>
      </div>
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

function renderSimpleTopbar() {
  return html`<header class="topbar">
    <a class="brand" href="/"><span class="brand-mark">KC</span><span>Kimchi Canary</span></a>
    <nav aria-label="Primary">
      <a href="/#assessment">Assessment</a>
      <a href="/#cases">Watchlist</a>
      <a href="/methodology">Methodology</a>
      <a href="/kit">Hiring kit</a>
      <a href="/#reports">Report</a>
    </nav>
  </header>`;
}

function renderFooter() {
  return html`<footer>
    <strong>Kimchi Canary</strong>
    <span>Operational guidance, not legal advice. Consult counsel for sanctions and employment-law decisions.</span>
  </footer>`;
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
      payload.evidenceTypes = formData.getAll("evidenceType");
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

    const caseSearch = document.querySelector("#case-search");
    const caseCount = document.querySelector("#case-count");
    const caseCards = [...document.querySelectorAll("[data-case-card]")];
    caseSearch?.addEventListener("input", () => {
      const query = caseSearch.value.trim().toLowerCase();
      let visible = 0;
      for (const card of caseCards) {
        const match = !query || card.dataset.search.includes(query);
        card.hidden = !match;
        if (match) visible += 1;
      }
      if (caseCount) caseCount.textContent = visible + " matching official source group" + (visible === 1 ? "" : "s");
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
      transform-origin: 250px 170px;
      animation: bonkGlove 2.8s cubic-bezier(0.5, 0, 0.2, 1) infinite;
    }
    .fake-stack {
      transform-origin: 504px 130px;
      animation: fakeWobble 2.8s ease-in-out infinite;
    }
    .proxy-laptop {
      transform-origin: 756px 170px;
      animation: proxyWobble 2.8s ease-in-out infinite;
    }
    .bonk-burst {
      opacity: 0;
      transform-origin: 392px 112px;
      animation: bonkBurst 2.8s ease-in-out infinite;
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
      0%, 48%, 100% { transform: translateX(-42px) rotate(-3deg); }
      58% { transform: translateX(92px) rotate(0deg); }
      68% { transform: translateX(46px) rotate(-5deg); }
    }
    @keyframes fakeWobble {
      0%, 52%, 100% { transform: rotate(0deg) translate(0, 0); }
      58% { transform: rotate(2deg) translate(9px, 1px); }
      66% { transform: rotate(-1.5deg) translate(-4px, 0); }
    }
    @keyframes proxyWobble {
      0%, 54%, 100% { transform: translate(0, 0); }
      60% { transform: translate(5px, 2px) rotate(1deg); }
      70% { transform: translate(-3px, 0) rotate(-1deg); }
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
        "prompts result";
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
      max-height: calc(100vh - 120px);
      overflow: auto;
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
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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
    .trap {
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
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
    .evidence-fieldset {
      padding: 0;
    }
    .checkbox-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0;
    }
    .mini-check {
      display: grid;
      grid-template-columns: 18px minmax(0, 1fr);
      align-items: start;
      gap: 8px;
      padding: 12px;
      border-bottom: 1px solid rgba(16, 20, 24, 0.08);
      font-weight: 700;
      color: var(--muted);
    }
    .mini-check:nth-child(odd) { border-right: 1px solid rgba(16, 20, 24, 0.08); }
    .mini-check input { width: 18px; margin-top: 3px; accent-color: var(--accent); }
    .form-status { min-height: 24px; margin: 0; font-weight: 800; color: var(--green); }
    .form-status.error { color: var(--accent-dark); }
    .case-list, .source-list, .admin-list {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
    }
    .watchlist-tools {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: end;
      gap: 14px;
      margin: 0 0 16px;
      padding: 14px;
      border: 1px solid var(--line);
      background: rgba(255, 253, 248, 0.84);
    }
    .watchlist-tools span {
      color: var(--muted);
      font-size: 13px;
      font-weight: 850;
      white-space: nowrap;
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
    .logout-form { margin-bottom: 16px; }
    .admin-login { max-width: 520px; }
    .empty { color: var(--muted); }
    .page-main {
      width: min(100%, 1120px);
      margin: 0 auto;
      padding: clamp(48px, 7vw, 88px) clamp(18px, 5vw, 72px);
    }
    .page-main h1 {
      max-width: 980px;
      margin-bottom: 18px;
      font-size: clamp(46px, 7vw, 92px);
      line-height: 0.92;
    }
    .plain-grid, .kit-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
      margin-top: 26px;
    }
    .plain-grid.two { margin-top: 18px; }
    .plain-grid article, .kit-grid article, .case-detail {
      border: 1px solid var(--line);
      background: var(--panel);
      padding: 18px;
    }
    .case-detail {
      display: grid;
      gap: 18px;
      padding: clamp(18px, 3vw, 28px);
    }
    .plain-grid h2, .kit-grid h2, .case-detail h2 {
      font-size: 24px;
      line-height: 1.1;
    }
    .plain-grid ul, .kit-grid ul {
      display: grid;
      gap: 8px;
      margin: 0;
      padding-left: 18px;
      color: var(--muted);
      line-height: 1.5;
    }
    .print-button { margin-top: 8px; }

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
        max-height: none;
        overflow: visible;
      }
      .steps, .trust-grid, .result-columns, .prompt-grid, .plain-grid, .kit-grid { grid-template-columns: 1fr; }
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
        grid-template-columns: repeat(2, minmax(0, 1fr));
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
      .form-row, .score-summary, .checkbox-grid, .watchlist-tools { grid-template-columns: 1fr; }
      .mini-check:nth-child(odd) { border-right: 0; }
      .score-circle { margin: 0 auto; }
      .hero-actions, footer, .case-meta { flex-direction: column; }
      .photo-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media print {
      body { background: #fff; color: #000; }
      .topbar, .print-button, footer, .hero-actions, .fraud-bonk { display: none !important; }
      .page-main { width: 100%; padding: 0; }
      .kit-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
      .kit-grid article, .plain-grid article, .case-detail { break-inside: avoid; box-shadow: none; }
      a { color: #000; }
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
