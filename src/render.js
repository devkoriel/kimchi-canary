import { EXTRA_SOURCE_LINKS, OFFICIAL_SOURCES, PUBLIC_CASES } from "./cases.js";
import { LANGUAGES, getStrings } from "./i18n.js";
import { assessCandidate, INTERVIEW_PROMPTS, SIGNAL_CATEGORIES, SIGNALS } from "./scoring.js";

const SITE_NAME = "Kimchi Canary";
const SITE_DESCRIPTION = "Kimchi Canary helps Web3 HR, security, and compliance teams screen DPRK remote IT worker fraud indicators with official-source guidance.";
const DEFAULT_OG_ALT = "Kimchi Canary Web3 hiring risk desk logo card";
const CONTACT_EMAIL = "dev.koriel@gmail.com";
const LANGUAGE_LOCALES = {
  en: "en_US",
  ko: "ko_KR",
  ja: "ja_JP",
  zh: "zh_CN",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
  pt: "pt_BR",
  ru: "ru_RU",
  ar: "ar_AR",
  hi: "hi_IN",
};

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
  const canonicalUrl = homeUrlForLanguage(origin, language);
  const ogImageUrl = `${origin}/og.png`;
  const description = SITE_DESCRIPTION;

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
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="application-name" content="${SITE_NAME}" />
        <meta name="theme-color" content="#000403" />
        ${renderAlternateLinks(origin)}
        <meta property="og:title" content="Kimchi Canary | Web3 Hiring Risk Desk" />
        <meta property="og:description" content="${escapeAttribute(description)}" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${escapeAttribute(canonicalUrl)}" />
        <meta property="og:site_name" content="Kimchi Canary" />
        <meta property="og:locale" content="${escapeAttribute(LANGUAGE_LOCALES[language] || "en_US")}" />
        ${renderOgLocaleAlternates(language)}
        <meta property="og:image" content="${escapeAttribute(ogImageUrl)}" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="${DEFAULT_OG_ALT}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kimchi Canary | Web3 Hiring Risk Desk" />
        <meta name="twitter:description" content="${escapeAttribute(description)}" />
        <meta name="twitter:image" content="${escapeAttribute(ogImageUrl)}" />
        <meta name="twitter:image:alt" content="${DEFAULT_OG_ALT}" />
        <script type="application/ld+json">${jsonLd({
          "@context": "https://schema.org",
          "@graph": [organizationJsonLd(origin), websiteJsonLd(origin), webApplicationJsonLd(origin, description)],
        })}</script>
        <title>Kimchi Canary | Web3 Hiring Risk Desk</title>
        <style>${styles()}</style>
      </head>
      <body>
        <div class="site-loader" data-site-loader aria-hidden="true">
          <div class="loader-core">
            <div class="loader-logo">${renderKimchiLogo()}</div>
            <p class="loader-kicker">Web3 hiring risk desk</p>
            <strong>Kimchi Canary</strong>
            <span class="loader-line"><span></span></span>
            <p class="loader-status">Booting receipts. Calibrating canary. Bonking proxy fog.</p>
          </div>
        </div>
        ${renderShellChrome({ language, t, active: "home", showLanguage: true })}

        <main class="ops-main">
          <section class="hero">
            ${renderFlagDuel()}
            <div class="hero-inner">
              <p class="eyebrow">${escapeHtml(t.eyebrow)}</p>
              <h1><span>Kimchi</span><span class="hero-green">Canary</span></h1>
              <p class="subtitle">${escapeHtml(t.subtitle)}</p>
              <p class="hero-copy">${escapeHtml(t.heroCopy)}</p>
              <div class="hero-actions">
                <a class="button primary" href="/assessment">${escapeHtml(t.startAssessment)}</a>
                <a class="button secondary" href="/watchlist">${escapeHtml(t.watchlist || "Watchlist")}</a>
                <a class="button secondary" href="/report">${escapeHtml(t.reportSuspect)}</a>
                <a class="button secondary" href="/kit">Print hiring kit</a>
              </div>
              <div class="stat-row" aria-label="Database scope">
                <span><strong>${PUBLIC_CASES.length}</strong> ${escapeHtml(t.verifiedSourceGroups || "verified source groups")}</span>
                <span><strong>${listedSubjects}</strong> ${escapeHtml(t.listedSubjects || "listed people/entities")}</span>
                <span><strong>${officialPhotos}</strong> ${escapeHtml(t.officialPhotos || "official photos")}</span>
              </div>
            </div>
          </section>

          <section class="bonk-strip">
            ${renderFraudBonk(t)}
          </section>

          <section class="trust-band" id="trust">
            <div class="section-head">
              <p class="eyebrow">${escapeHtml(t.trustTitle)}</p>
              <h2>${escapeHtml(t.trustCopy)}</h2>
              ${renderSectionVisual("globe")}
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
              ${renderSectionVisual("radar")}
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
              ${renderSectionVisual("workflow")}
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
              ${renderSectionVisual("queue")}
            </div>
            ${reportsEnabled ? renderReportForm(t) : renderDisabledReports()}
          </section>

          <section class="cases-section" id="cases">
            <div class="section-head">
              <p class="eyebrow">${escapeHtml(t.officialCases)}</p>
              <h2>${escapeHtml(t.casesCopy)}</h2>
              ${renderSectionVisual("watchlist")}
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
              ${renderSectionVisual("sources")}
            </div>
            <div class="source-list">
              ${[...OFFICIAL_SOURCES, ...Object.values(EXTRA_SOURCE_LINKS)].map(renderSource).join("")}
            </div>
          </section>
        </main>

        ${renderFooter()}

        <script type="module">${clientScript(language)}</script>
      </body>
    </html>`;
}

export function renderOgImage() {
  return html`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="Kimchi Canary Web3 hiring risk desk">
    <defs>
      <pattern id="grid" width="38" height="38" patternUnits="userSpaceOnUse">
        <path d="M38 0H0v38" fill="none" stroke="#20f28f" stroke-opacity="0.18" stroke-width="1" />
      </pattern>
      <radialGradient id="ogGlow" cx="50%" cy="42%" r="62%">
        <stop offset="0" stop-color="#20f28f" stop-opacity="0.28" />
        <stop offset="0.48" stop-color="#062219" stop-opacity="0.9" />
        <stop offset="1" stop-color="#000403" />
      </radialGradient>
    </defs>
    <rect width="1200" height="630" fill="#000403" />
    <rect width="1200" height="630" fill="url(#ogGlow)" />
    <rect width="1200" height="630" fill="url(#grid)" opacity="0.72" />
    <path d="M-70 565C196 418 319 553 568 383 793 229 925 180 1288 242" fill="none" stroke="#20f28f" stroke-opacity="0.34" stroke-width="34" />
    <path d="M-70 561C196 418 319 553 568 383 793 229 925 180 1288 242" fill="none" stroke="#eafff6" stroke-opacity="0.24" stroke-width="3" />
    <rect x="66" y="58" width="1068" height="514" rx="24" fill="#020b08" fill-opacity="0.72" stroke="#20f28f" stroke-opacity="0.78" stroke-width="4" />
    ${renderLogoMark("ogLogo", "og-card-logo", 'x="88" y="132" width="270" height="270"')}
    <text x="400" y="154" fill="#20f28f" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="900" letter-spacing="4">WEB3 HIRING RISK DESK</text>
    <text x="400" y="270" fill="#eafff6" font-family="Georgia, 'Times New Roman', serif" font-size="88" font-weight="900">Kimchi Canary</text>
    <text x="400" y="342" fill="#c8ff5d" font-family="Inter, Arial, sans-serif" font-size="32" font-weight="900">DPRK remote IT worker fraud screening</text>
    <text x="400" y="404" fill="#b8e7d5" font-family="Inter, Arial, sans-serif" font-size="26">Official source watchlist, HR questionnaire,</text>
    <text x="400" y="442" fill="#b8e7d5" font-family="Inter, Arial, sans-serif" font-size="26">and private report moderation for Web3 teams.</text>
    <g font-family="Inter, Arial, sans-serif" font-size="22" font-weight="900">
      <rect x="400" y="494" width="214" height="50" rx="8" fill="#20f28f" stroke="#eafff6" stroke-opacity="0.72" stroke-width="2" />
      <text x="428" y="527" fill="#00150d">Evidence first</text>
      <rect x="636" y="494" width="236" height="50" rx="8" fill="#000403" stroke="#20f28f" stroke-opacity="0.78" stroke-width="2" />
      <text x="665" y="527" fill="#eafff6">Private reports</text>
    </g>
  </svg>`;
}

export function renderFaviconImage() {
  return renderLogoMark("faviconLogo", "", 'xmlns="http://www.w3.org/2000/svg" width="512" height="512"');
}

function renderFlagDuel() {
  return html`<section class="flag-duel" data-flag-duel aria-label="Interactive South Korean and North Korean flag animation">
    <canvas class="hero-webgl" data-webgl-hero aria-hidden="true"></canvas>
    <div class="flag-field" data-flag-field role="img" aria-label="South Korean and North Korean flags fluttering behind an interactive diagonal compliance scan" style="--split: 70%; --mx: 0px; --my: 0px; --cursor-x: 50%; --cursor-y: 50%;">
      <div class="flag-panel flag-panel-south" aria-hidden="true">
        <svg class="flag-art" viewBox="0 0 960 520" preserveAspectRatio="none">
          <rect width="960" height="520" fill="#f8fbff" />
          <g opacity="0.1">
            <path d="M0 82c154-54 286 40 438-7 188-58 302 30 522-36v481H0z" fill="#101418" />
            <path d="M0 298c165-48 292 52 464-2 180-56 318 22 496-30v254H0z" fill="#101418" />
          </g>
          <g transform="translate(480 260) scale(1.12)">
            <circle r="78" fill="#0047a0" />
            <path d="M-78 0a78 78 0 0 1 156 0c0 22-17 39-39 39S0 22 0 0s-17-39-39-39-39 17-39 39z" fill="#cd2e3a" />
            <path d="M78 0a78 78 0 0 1-156 0c0-22 17-39 39-39S0-22 0 0s17 39 39 39 39-17 39-39z" fill="#0047a0" />
          </g>
          <g fill="#101418">
            <g transform="translate(244 142) rotate(-34)">
              <rect x="-64" y="-30" width="128" height="13" />
              <rect x="-64" y="-7" width="128" height="13" />
              <rect x="-64" y="16" width="128" height="13" />
            </g>
            <g transform="translate(716 142) rotate(34)">
              <rect x="-64" y="-30" width="55" height="13" />
              <rect x="9" y="-30" width="55" height="13" />
              <rect x="-64" y="-7" width="128" height="13" />
              <rect x="-64" y="16" width="55" height="13" />
              <rect x="9" y="16" width="55" height="13" />
            </g>
            <g transform="translate(244 378) rotate(34)">
              <rect x="-64" y="-30" width="128" height="13" />
              <rect x="-64" y="-7" width="55" height="13" />
              <rect x="9" y="-7" width="55" height="13" />
              <rect x="-64" y="16" width="128" height="13" />
            </g>
            <g transform="translate(716 378) rotate(-34)">
              <rect x="-64" y="-30" width="55" height="13" />
              <rect x="9" y="-30" width="55" height="13" />
              <rect x="-64" y="-7" width="55" height="13" />
              <rect x="9" y="-7" width="55" height="13" />
              <rect x="-64" y="16" width="55" height="13" />
              <rect x="9" y="16" width="55" height="13" />
            </g>
          </g>
          <text x="46" y="462" fill="#101418" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="950" letter-spacing="3">SOUTH KOREA COMPLIANCE WIND</text>
        </svg>
      </div>
      <div class="flag-panel flag-panel-north" aria-hidden="true">
        <svg class="flag-art" viewBox="0 0 960 520" preserveAspectRatio="none">
          <rect width="960" height="520" fill="#024fa2" />
          <rect y="96" width="960" height="34" fill="#ffffff" />
          <rect y="390" width="960" height="34" fill="#ffffff" />
          <rect y="130" width="960" height="260" fill="#ed1c27" />
          <g opacity="0.16">
            <path d="M0 112c160-58 292 42 450-8 190-60 314 30 510-38v454H0z" fill="#101418" />
            <path d="M0 330c172-46 302 48 475-4 182-54 334 18 485-34v228H0z" fill="#101418" />
          </g>
          <circle cx="262" cy="260" r="96" fill="#ffffff" />
          <path d="M262 174l22 63 66 2-52 39 19 64-55-38-55 38 19-64-52-39 66-2z" fill="#ed1c27" />
          <text x="564" y="462" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="950" letter-spacing="3">PROXY FOG WARNING</text>
        </svg>
      </div>
      <div class="flag-shine" aria-hidden="true"></div>
      <div class="flag-wind wind-one" aria-hidden="true"></div>
      <div class="flag-wind wind-two" aria-hidden="true"></div>
      <div class="flag-particles" aria-hidden="true">
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
      <div class="flag-divider" aria-hidden="true"><span>SCAN</span></div>
    </div>
    <div class="flag-scoreboard" aria-hidden="true">
      <span>South Korea wind <strong data-flag-south>70</strong>%</span>
      <span>Proxy fog <strong data-flag-north>30</strong>%</span>
    </div>
    <div class="flag-reticle" aria-hidden="true"><span></span></div>
    <p id="flag-humor" class="flag-humor" data-flag-humor>South Korea is winning. The laptop farm has requested a recount from an undisclosed VPS.</p>
  </section>`;
}

function renderSectionVisual(kind) {
  const labels = {
    globe: "Global hiring shield online",
    radar: "Candidate signal radar armed",
    workflow: "Access gate tunnel synced",
    queue: "Private report vault sealed",
    watchlist: "Official-source scanner active",
    sources: "Evidence orbit locked",
  };
  const content = {
    globe: html`<div class="visual-object globe-object">
      <span class="earth-shell"><span class="continent continent-one"></span><span class="continent continent-two"></span><span class="continent continent-three"></span><span class="threat-node"></span></span>
      <span class="shield-ring ring-one"></span><span class="shield-ring ring-two"></span><span class="shield-plate plate-one"></span><span class="shield-plate plate-two"></span>
    </div>`,
    radar: html`<div class="visual-object radar-object">
      <span class="radar-base"></span><span class="radar-dish"></span><span class="radar-sweep"></span><span class="radar-blip blip-one"></span><span class="radar-blip blip-two"></span><span class="radar-blip blip-three"></span>
    </div>`,
    workflow: html`<div class="visual-object tunnel-object">
      <span class="tunnel-ring tunnel-one"></span><span class="tunnel-ring tunnel-two"></span><span class="tunnel-ring tunnel-three"></span><span class="gate-card gate-one">ID</span><span class="gate-card gate-two">KYC</span><span class="gate-card gate-three">SSH</span>
    </div>`,
    queue: html`<div class="visual-object vault-object">
      <span class="vault-body"><span class="vault-dial"></span><span class="vault-slot"></span></span><span class="sealed-report report-one"></span><span class="sealed-report report-two"></span><span class="sealed-report report-three"></span>
    </div>`,
    watchlist: html`<div class="visual-object scanner-object">
      <span class="photo-cube cube-one"></span><span class="photo-cube cube-two"></span><span class="photo-cube cube-three"></span><span class="scanner-beam"></span><span class="scanner-frame"></span>
    </div>`,
    sources: html`<div class="visual-object sources-object">
      <span class="source-core">SRC</span><span class="source-node source-one"></span><span class="source-node source-two"></span><span class="source-node source-three"></span><span class="source-orbit source-orbit-one"></span><span class="source-orbit source-orbit-two"></span>
    </div>`,
  };
  return html`<div class="section-visual section-visual-${kind}" aria-hidden="true">
    <canvas class="section-webgl" data-webgl-section="${escapeAttribute(kind)}"></canvas>
    <div class="visual-stage">
      ${content[kind] || content.globe}
      <span class="scan-line"></span>
      <span class="micro-dot dot-one"></span>
      <span class="micro-dot dot-two"></span>
      <span class="micro-dot dot-three"></span>
      <span class="micro-dot dot-four"></span>
      <span class="micro-dot dot-five"></span>
      <span class="micro-dot dot-six"></span>
      <span class="micro-label">${escapeHtml(labels[kind] || "Compliance defense animation")}</span>
    </div>
  </div>`;
}

function renderFraudBonk(t = getStrings("en")) {
  return html`<div class="fraud-bonk" aria-label="${escapeAttribute(t.bonkAria || "Cartoon fraud-screening animation")}">
    <div class="bonk-stage">
      <canvas class="bonk-webgl" data-webgl-bonk aria-hidden="true"></canvas>
      <svg viewBox="0 0 900 300" role="img" aria-label="Cartoon boxing glove bonks a fake resume away from a proxy laptop">
        <defs>
          <filter id="bonkShadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="10" dy="12" stdDeviation="0" flood-color="#101418" flood-opacity="0.16" />
          </filter>
          <linearGradient id="gloveRed" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#f14436" />
            <stop offset="0.55" stop-color="#c51f1d" />
            <stop offset="1" stop-color="#8d1110" />
          </linearGradient>
          <linearGradient id="paperGrad" x1="0" x2="1">
            <stop offset="0" stop-color="#fffdf8" />
            <stop offset="1" stop-color="#f0eadc" />
          </linearGradient>
        </defs>
        <g class="fake-stack" filter="url(#bonkShadow)">
          <rect x="396" y="68" width="246" height="142" rx="12" fill="url(#paperGrad)" stroke="#101418" stroke-width="6" />
          <path d="M612 68l30 30h-30z" fill="#d7d2c4" stroke="#101418" stroke-width="4" />
          <rect x="426" y="96" width="110" height="15" fill="#101418" />
          <rect x="426" y="126" width="176" height="11" fill="#d7d2c4" />
          <rect x="426" y="151" width="135" height="11" fill="#d7d2c4" />
          <rect x="426" y="176" width="160" height="11" fill="#d7d2c4" />
          <path d="M417 203h186" stroke="#b3261e" stroke-width="6" stroke-linecap="round" />
          <text x="426" y="199" fill="#b3261e" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="950">FAKE RESUME</text>
        </g>
        <g class="proxy-laptop">
          <rect x="692" y="118" width="134" height="86" rx="9" fill="#101418" />
          <rect x="710" y="136" width="98" height="48" fill="#fffdf8" />
          <rect x="720" y="145" width="78" height="8" fill="#d7d2c4" />
          <path d="M666 216h188l-24 24H690z" fill="#101418" />
          <path d="M724 216h74" stroke="#fffdf8" stroke-width="4" opacity="0.4" />
          <text x="728" y="166" fill="#b3261e" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="950">PROXY</text>
        </g>
        <g class="bonk-glove" filter="url(#bonkShadow)">
          <path d="M48 166h82" stroke="#101418" stroke-width="26" stroke-linecap="round" />
          <path d="M98 133h72v72h-72c-20 0-36-16-36-36s16-36 36-36Z" fill="#fffdf8" stroke="#101418" stroke-width="8" />
          <path d="M165 116c13-35 54-55 96-42 11-25 48-30 73-9 17 14 24 35 20 56 41 5 70 36 66 76-5 52-53 81-116 72l-103 9c-51 4-92-32-94-81-2-27 18-49 58-52Z" fill="url(#gloveRed)" stroke="#101418" stroke-width="9" />
          <path d="M169 145c-6-48 28-78 82-71" fill="none" stroke="#e85a49" stroke-width="11" stroke-linecap="round" opacity="0.72" />
          <path d="M249 216c42-12 78-7 99 14-18 30-65 42-108 25-18-7-17-32 9-39Z" fill="#8f1211" stroke="#101418" stroke-width="8" />
          <path d="M205 132c32 6 55 23 68 52" fill="none" stroke="#101418" stroke-width="5" opacity="0.28" />
          <path d="M305 122c28 15 42 38 42 70" fill="none" stroke="#101418" stroke-width="5" opacity="0.25" />
          <path d="M107 151h48" stroke="#d7d2c4" stroke-width="7" stroke-linecap="round" />
          <path d="M106 174h48" stroke="#d7d2c4" stroke-width="7" stroke-linecap="round" />
        </g>
        <g class="bonk-speedlines" aria-hidden="true">
          <path d="M334 94h52" />
          <path d="M318 134h64" />
          <path d="M330 244h60" />
        </g>
        <g class="bonk-burst">
          <path d="M376 42l24 45 50-15-31 41 42 31-53 4-12 50-24-45-50 15 31-41-42-31 53-4z" fill="#ffd36a" stroke="#101418" stroke-width="6" />
          <text x="352" y="126" fill="#101418" font-family="Inter, Arial, sans-serif" font-size="29" font-weight="950">BONK</text>
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
  const counts = reports.reduce(
    (accumulator, report) => ({
      ...accumulator,
      [report.status || "pending"]: (accumulator[report.status || "pending"] || 0) + 1,
    }),
    { pending: 0, approved: 0, rejected: 0 },
  );
  return html`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <title>Kimchi Canary Admin</title>
        <style>${styles()}</style>
      </head>
      <body class="admin-body ${authenticated ? "admin-auth-body" : "admin-login-body"}">
        ${authenticated ? renderAdminQueueTopbar() : ""}
        <main class="${authenticated ? "admin-shell" : "admin-login-screen"}">
          <canvas class="page-webgl admin-webgl-bg" data-webgl-page="admin" aria-hidden="true"></canvas>
          ${
            authenticated
              ? html`<aside class="admin-sidebar" aria-label="Report status filters">
                  <p class="eyebrow">Admin review desk</p>
                  <strong>Private queue</strong>
                  <a href="#pending">Pending <span>${escapeHtml(String(counts.pending || 0))}</span></a>
                  <a href="#approved">Approved <span>${escapeHtml(String(counts.approved || 0))}</span></a>
                  <a href="#rejected">Rejected <span>${escapeHtml(String(counts.rejected || 0))}</span></a>
                  <small>Receipts or it stays private.</small>
                </aside>
                <section class="admin-queue">
                  <div class="admin-hero">
                    <div>
                      <p class="eyebrow">Moderation queue</p>
                      <h1>Private reports awaiting review</h1>
                      <p>Approve only when a report has official or independently verifiable public evidence. Weak reports stay private. Allegations are not findings.</p>
                    </div>
                    <div class="vault-visual" aria-hidden="true">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                  <div class="admin-list">
                    ${reports.length === 0 ? html`<p class="empty">No reports in this view.</p>` : reports.map((report) => renderReport(report, csrfToken)).join("")}
                  </div>
                </section>
                <aside class="admin-review-panel" aria-label="Review protocol">
                  <p class="eyebrow">Review protocol</p>
                  <h2>Publish slowly.</h2>
                  <ul>
                    <li>Check source URL or evidence summary first.</li>
                    <li>Prefer official records before public listing.</li>
                    <li>Use reviewer notes for every approval or rejection.</li>
                    <li>Never publish private reporter contact details.</li>
                  </ul>
                  <span class="private-badge">Private by default</span>
                </aside>
                ${authenticated ? html`<form class="logout-form admin-mobile-logout" method="post" action="/admin/logout"><button class="button secondary" type="submit">Sign out</button></form>` : ""}`
              : html`<section class="section-head admin-login-head">
                  <div class="login-logo">${renderKimchiLogo()}</div>
                  <p class="eyebrow">Admin review desk</p>
                  <h1>Moderation requires receipts.</h1>
                  <p>Sign in with the Cloudflare ADMIN_TOKEN. Reports stay private until approved.</p>
                </section>
                <form class="report-form admin-login" method="post" action="/admin/login">
                  <label>
                    Admin token
                    <input required name="token" type="password" autocomplete="current-password" placeholder="Cloudflare ADMIN_TOKEN" />
                  </label>
                  <button class="button primary" type="submit">Sign in</button>
                  ${loginError ? html`<p class="form-status error">${escapeHtml(loginError)}</p>` : ""}
                  <div class="secure-badge" aria-label="Secure connection">Secure connection</div>
                  <p class="admin-login-foot">Receipts or it stays private.</p>
                </form>`
          }
        </main>
        <script type="module">${clientScript("en")}</script>
      </body>
    </html>`;
}

function renderAdminQueueTopbar() {
  return html`<header class="admin-queue-topbar">
    <a class="admin-queue-brand" href="/admin">
      <span class="topbar-logo">${renderBrandLogo()}</span>
      <strong>Kimchi Canary</strong>
      <span>Moderation Queue</span>
    </a>
    <form class="logout-form top-logout" method="post" action="/admin/logout">
      <button class="top-icon-button" type="submit">Sign out</button>
    </form>
  </header>`;
}

export function renderAssessmentPage({ language = "en", origin = "https://kimchicanary.xyz" } = {}) {
  const t = getStrings(language);
  const initialAssessment = assessCandidate([]);
  const canonicalUrl = `${origin}/assessment`;
  const title = "DPRK IT Worker Risk Assessment | Kimchi Canary";
  const description = "Interactive Web3 hiring risk assessment for observed DPRK remote IT worker fraud indicators, with evidence-first actions.";
  const ogImageUrl = `${origin}/og.png`;
  return html`<!doctype html>
    <html lang="${escapeHtml(language)}" dir="${language === "ar" ? "rtl" : "ltr"}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="${escapeAttribute(description)}" />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000403" />
        <meta property="og:title" content="${escapeAttribute(title)}" />
        <meta property="og:description" content="${escapeAttribute(description)}" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${escapeAttribute(canonicalUrl)}" />
        <meta property="og:site_name" content="${SITE_NAME}" />
        <meta property="og:image" content="${escapeAttribute(ogImageUrl)}" />
        <meta property="og:image:alt" content="${DEFAULT_OG_ALT}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${escapeAttribute(title)}" />
        <meta name="twitter:description" content="${escapeAttribute(description)}" />
        <meta name="twitter:image" content="${escapeAttribute(ogImageUrl)}" />
        <title>${escapeHtml(title)}</title>
        <style>${styles()}</style>
      </head>
      <body>
        ${renderSimpleTopbar("assessment")}
        <main class="ops-main assessment-page">
          <section class="section-head assessment-hero">
            <div>
              <p class="eyebrow">Assessment protocol</p>
              <h1>Active Assessment Protocol</h1>
              <p>${escapeHtml(t.assessmentHeading || "Screen observed fraud indicators before access increases.")}</p>
              <p class="system-note">Evidence first. Vibes are not evidence. USDC payroll is normal in Web3 and is not suspicious by itself.</p>
            </div>
            ${renderSectionVisual("radar")}
          </section>
          <section class="tool-grid workbench-grid" id="assessment">
            <aside class="result-panel" id="result-panel" aria-live="polite">
              ${renderAssessment(initialAssessment, t)}
            </aside>
            <form class="questionnaire" id="questionnaire">
              ${SIGNAL_CATEGORIES.map((category) => renderCategory(category, t)).join("")}
            </form>
            ${renderInterviewPrompts(t)}
          </section>
        </main>
        ${renderFooter()}
        <script type="module">${clientScript(language)}</script>
      </body>
    </html>`;
}

export function renderWatchlistPage({ approvedReports = [], origin = "https://kimchicanary.xyz" } = {}) {
  const canonicalUrl = `${origin}/watchlist`;
  const title = "Official-Source Watchlist | Kimchi Canary";
  const description = "Official-source DPRK remote IT worker fraud watchlist for Web3 hiring teams, with photos, source provenance, and correction policy.";
  const ogImageUrl = `${origin}/og.png`;
  return html`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="${escapeAttribute(description)}" />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000403" />
        <meta property="og:title" content="${escapeAttribute(title)}" />
        <meta property="og:description" content="${escapeAttribute(description)}" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${escapeAttribute(canonicalUrl)}" />
        <meta property="og:site_name" content="${SITE_NAME}" />
        <meta property="og:image" content="${escapeAttribute(ogImageUrl)}" />
        <meta property="og:image:alt" content="${DEFAULT_OG_ALT}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${escapeAttribute(title)}" />
        <meta name="twitter:description" content="${escapeAttribute(description)}" />
        <meta name="twitter:image" content="${escapeAttribute(ogImageUrl)}" />
        <title>${escapeHtml(title)}</title>
        <style>${styles()}</style>
      </head>
      <body>
        ${renderSimpleTopbar("watchlist")}
        <main class="ops-main watchlist-page">
          <section class="section-head dossier-head">
            <div>
              <p class="eyebrow">Threat watchlist</p>
              <h1>Official source watchlist.</h1>
              <p>Receipts first. Vibes later. Mystery laptop address denied boarding.</p>
            </div>
            ${renderSectionVisual("watchlist")}
          </section>
          <section class="policy-strip">
            <strong>Publication policy</strong>
            <p>Public entries are limited to official or equivalently reliable public records. Private reports are not published until approved with sufficient evidence. Corrections/removals: <a href="mailto:dev.koriel@gmail.com">dev.koriel@gmail.com</a>.</p>
            <small>No nationality shortcuts. Allegations remain allegations unless an authority or court has resolved them.</small>
          </section>
          <div class="watchlist-tools">
            <label>
              Search watchlist
              <input id="case-search" type="search" autocomplete="off" placeholder="Name, alias, case, source, indicator..." />
            </label>
            <span id="case-count">${PUBLIC_CASES.length} official source groups</span>
          </div>
          <section class="dossier-layout">
            <div class="case-list dossier-list">
              ${PUBLIC_CASES.map(renderCase).join("")}
              ${approvedReports.length ? approvedReports.map(renderApprovedReport).join("") : ""}
            </div>
            <aside class="dossier-side">
              <p class="eyebrow">Dossier details</p>
              <h2>Verify before action.</h2>
              <ul>
                <li>Open the official source record.</li>
                <li>Preserve identity, access, shipping, and payout records.</li>
                <li>Use the watchlist as a lead for due diligence, not an automatic hiring decision.</li>
              </ul>
              <span class="private-badge">Evidence first</span>
            </aside>
          </section>
        </main>
        ${renderFooter()}
        <script type="module">${clientScript("en")}</script>
      </body>
    </html>`;
}

export function renderReportPage({ reportsEnabled = true, origin = "https://kimchicanary.xyz" } = {}) {
  const t = getStrings("en");
  const canonicalUrl = `${origin}/report`;
  const title = "Submit a Private Report | Kimchi Canary";
  const description = "Privately submit suspected DPRK remote IT worker fraud evidence for moderator review before any public listing.";
  const ogImageUrl = `${origin}/og.png`;
  return html`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="${escapeAttribute(description)}" />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000403" />
        <meta property="og:title" content="${escapeAttribute(title)}" />
        <meta property="og:description" content="${escapeAttribute(description)}" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${escapeAttribute(canonicalUrl)}" />
        <meta property="og:site_name" content="${SITE_NAME}" />
        <meta property="og:image" content="${escapeAttribute(ogImageUrl)}" />
        <meta property="og:image:alt" content="${DEFAULT_OG_ALT}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${escapeAttribute(title)}" />
        <meta name="twitter:description" content="${escapeAttribute(description)}" />
        <meta name="twitter:image" content="${escapeAttribute(ogImageUrl)}" />
        <title>${escapeHtml(title)}</title>
        <style>${styles()}</style>
      </head>
      <body>
        ${renderSimpleTopbar("report")}
        <main class="ops-main report-page report-workbench">
          <section class="report-brief">
            <p class="eyebrow">Secure incident reporting</p>
            <h1>Secure Incident Reporting</h1>
            <p>Private by default. Published only after review.</p>
            <div class="report-assurance">
              <strong>Vault protocol</strong>
              <ul>
                <li>Reports are held in the secure vault and are not public upon submission.</li>
                <li>Moderators review evidence for provenance, authenticity, and source quality.</li>
                <li>Reporter identity is never published with a public listing.</li>
              </ul>
            </div>
            ${renderSectionVisual("queue")}
            <div class="policy-strip">
              <strong>Approval gate</strong>
              <p>Reports enter a moderation queue. I approve public listing only when evidence is sufficient and reviewable.</p>
              <small>Receipts or it stays private.</small>
            </div>
          </section>
          <section class="report-form-column" aria-label="Private report form">
            ${reportsEnabled ? renderReportForm(t) : renderDisabledReports()}
          </section>
        </main>
        ${renderFooter()}
        <script type="module">${clientScript("en")}</script>
      </body>
    </html>`;
}

export function renderMethodology({ origin = "https://kimchicanary.xyz" } = {}) {
  const canonicalUrl = `${origin}/methodology`;
  const title = "DPRK IT Worker Fraud Screening Methodology | Kimchi Canary";
  const description = "Evidence-first methodology for Web3 teams screening DPRK remote IT worker fraud without nationality shortcuts or public witch hunts.";
  const ogImageUrl = `${origin}/og.png`;
  return html`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="${escapeAttribute(description)}" />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000403" />
        <meta property="og:title" content="${escapeAttribute(title)}" />
        <meta property="og:description" content="${escapeAttribute(description)}" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="${escapeAttribute(canonicalUrl)}" />
        <meta property="og:site_name" content="${SITE_NAME}" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="${escapeAttribute(ogImageUrl)}" />
        <meta property="og:image:alt" content="${DEFAULT_OG_ALT}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${escapeAttribute(title)}" />
        <meta name="twitter:description" content="${escapeAttribute(description)}" />
        <meta name="twitter:image" content="${escapeAttribute(ogImageUrl)}" />
        <meta name="twitter:image:alt" content="${DEFAULT_OG_ALT}" />
        <script type="application/ld+json">${jsonLd({
          "@context": "https://schema.org",
          "@graph": [
            organizationJsonLd(origin),
            articleJsonLd({
              origin,
              path: "/methodology",
              title,
              description,
              datePublished: "2026-04-29",
              dateModified: latestContentDate(),
              keywords: ["DPRK IT worker fraud", "remote hiring risk", "Web3 hiring security", "sanctions compliance"],
            }),
            breadcrumbJsonLd(origin, [
              ["Home", "/"],
              ["Methodology", "/methodology"],
            ]),
          ],
        })}</script>
        <title>${escapeHtml(title)}</title>
        <style>${styles()}</style>
      </head>
      <body>
        ${renderSimpleTopbar("methodology")}
        <main class="ops-main page-main methodology-page">
          <canvas class="page-webgl" data-webgl-page="methodology" aria-hidden="true"></canvas>
          <section class="section-head methodology-hero">
            <p class="eyebrow">Methodology</p>
            <h1 aria-label="Evidence first. No nationality shortcuts.">Evidence first.<br /><span>No nationality shortcuts.</span></h1>
            <p>Kimchi Canary is a risk triage desk for hiring, vendor review, and incident response. It helps teams preserve records and slow down access when independently verifiable fraud indicators appear.</p>
          </section>
          <section class="methodology-layout">
            <aside class="method-nav" aria-label="Methodology sections">
              <a href="#scored">1. What gets scored</a>
              <a href="#not-scored">2. Excluded criteria</a>
              <a href="#watchlist-policy">3. Public watchlist</a>
              <a href="#community-reports">4. Community reports</a>
              <a href="#corrections">5. Corrections</a>
            </aside>
            <div class="method-content">
              <div class="method-intro">Our methodology is anchored in verifiable receipts, public sources, and repeatable operational checks. We do not rely on subjective vibes or generalized risk factors.</div>
              <div class="plain-grid two">
                <article id="scored">
                  <h2>What gets scored</h2>
                  <p>Only observed operational indicators: identity mismatch, borrowed documents, remote-control tooling, impossible location patterns, shipping-route conflicts, payout anomalies, repository access behavior, and official public records.</p>
                </article>
                <article id="not-scored" class="danger-panel">
                  <h2>What does not get scored</h2>
                  <p>Nationality, ethnicity, fashion, accent, political speech, or discomfort on camera do not create a finding. Accent, dialect, or South Korea-specific details can only support a claim-consistency review when the candidate made that claim.</p>
                </article>
              </div>
              ${renderSectionVisual("sources")}
              <div class="plain-grid two">
                <article id="watchlist-policy">
                  <h2>Public watchlist policy</h2>
                  <p>Public entries are limited to official or equivalently reliable public records: FBI, DOJ, OFAC, sanctions notices, wanted pages, indictments, pleas, or sentencings. Allegations remain allegations unless a court or authority has resolved them.</p>
                </article>
                <article id="community-reports">
                  <h2>Community reports</h2>
                  <p>Reports are private by default. Approval requires a moderator review, a source or evidence summary, and enough detail for an employer to verify internally. Weak reports stay private or are rejected.</p>
                </article>
                <article id="corrections">
                  <h2>Corrections and removals</h2>
                  <p>People or companies can request correction, extra context, or removal review by emailing <a href="mailto:dev.koriel@gmail.com">dev.koriel@gmail.com</a>. Include the case URL and the record you want corrected.</p>
                </article>
                <article>
                  <h2>Operational caution</h2>
                  <p>This is not legal advice and not an automated hiring decision system. Use it to guide due diligence, preserve evidence, and consult counsel for sanctions and employment-law decisions.</p>
                </article>
              </div>
            </div>
          </section>
        </main>
        ${renderFooter()}
        <script type="module">${clientScript("en")}</script>
      </body>
    </html>`;
}

export function renderHiringKit({ origin = "https://kimchicanary.xyz" } = {}) {
  const canonicalUrl = `${origin}/kit`;
  const title = "Web3 Remote Hiring Risk Checklist | Kimchi Canary";
  const description = "Printable hiring checklist for Web3 HR and security teams verifying identity, devices, access, and crypto payroll risk before onboarding.";
  const ogImageUrl = `${origin}/og.png`;
  return html`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="${escapeAttribute(description)}" />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000403" />
        <meta property="og:title" content="${escapeAttribute(title)}" />
        <meta property="og:description" content="${escapeAttribute(description)}" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="${escapeAttribute(canonicalUrl)}" />
        <meta property="og:site_name" content="${SITE_NAME}" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="${escapeAttribute(ogImageUrl)}" />
        <meta property="og:image:alt" content="${DEFAULT_OG_ALT}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${escapeAttribute(title)}" />
        <meta name="twitter:description" content="${escapeAttribute(description)}" />
        <meta name="twitter:image" content="${escapeAttribute(ogImageUrl)}" />
        <meta name="twitter:image:alt" content="${DEFAULT_OG_ALT}" />
        <script type="application/ld+json">${jsonLd({
          "@context": "https://schema.org",
          "@graph": [
            organizationJsonLd(origin),
            articleJsonLd({
              origin,
              path: "/kit",
              title,
              description,
              datePublished: "2026-04-29",
              dateModified: latestContentDate(),
              keywords: ["Web3 hiring checklist", "remote IT worker fraud", "crypto payroll risk", "DPRK IT worker indicators"],
            }),
            breadcrumbJsonLd(origin, [
              ["Home", "/"],
              ["Hiring kit", "/kit"],
            ]),
          ],
        })}</script>
        <title>${escapeHtml(title)}</title>
        <style>${styles()}</style>
      </head>
      <body>
        ${renderSimpleTopbar("kit")}
        <main class="ops-main page-main kit-page protocol-page">
          <canvas class="page-webgl" data-webgl-page="kit" aria-hidden="true"></canvas>
          <section class="protocol-head">
            <div>
              <p class="eyebrow">Printable hiring kit</p>
              <h1 aria-label="Receipts first. Access later.">Receipts first.</h1>
              <h2>Access later.</h2>
              <p>A short desk checklist for HR, security, founders, and vendor managers screening remote technical hires in crypto and Web3.</p>
            </div>
            <button class="button primary print-button" type="button" onclick="window.print()">Print protocol</button>
          </section>
          <section class="protocol-grid">
            <div class="protocol-checks">
              ${[
                ["Before interview", ["Verify identity, work authorization, school, and prior employment through independently sourced contacts.", "Require the candidate to explain their work setup, normal work hours, payroll/KYC route, and equipment delivery path.", "Flag reused resume text, repeated portfolios, duplicated profile photos, or shared payout details across applicants."]],
                ["Before laptop ships", ["Ship only to the address reconciled with verified identity records.", "Do not ship to a vendor, friend, hotel, mailbox, or last-minute alternate address without escalation.", "Keep MDM, EDR, logging, remote-access controls, and asset inventory ready before the device leaves."]],
                ["Before code access", ["Grant least privilege. Delay production, wallet, CI/CD, secrets, and signing-key access.", "Block unapproved VPN, proxy, KVM, remote desktop, and remote-control software.", "Watch for repository cloning, unusual off-hours access, and account logins from impossible locations."]],
              ]
                .map(
                  ([title, items]) => html`<article>
                    <h2>${escapeHtml(title)}</h2>
                    <ul>${items.map((item) => html`<li><input type="checkbox" aria-label="${escapeAttribute(item)}" /> <span>${escapeHtml(item)}</span></li>`).join("")}</ul>
                  </article>`,
                )
                .join("")}
            </div>
            <aside class="protocol-side">
              ${renderSectionVisual("workflow")}
              ${[
                ["Crypto payroll reality", "USDC or crypto payroll is normal in Web3. Treat payment risk as contextual: mismatched KYC, third-party accounts, exchange pressure, tumbling requests, or inconsistent wallet ownership."],
                ["If risk appears", "Pause access expansion, preserve logs, shipping records, interview records, documents, and payout records. Escalate to legal, compliance, security, and vendor owners when evidence supports it."],
                ["The canary rule", "Verify. Then trust. No witch hunts. Receipts or it stays private."],
              ]
                .map(([title, copy]) => html`<article><h2>${escapeHtml(title)}</h2><p>${escapeHtml(copy)}</p></article>`)
                .join("")}
            </aside>
          </section>
        </main>
        ${renderFooter()}
        <script type="module">${clientScript("en")}</script>
      </body>
    </html>`;
}

export function renderCaseDetail({ caseItem, origin = "https://kimchicanary.xyz" } = {}) {
  const source = SOURCE_BY_ID.get(caseItem.sourceId);
  const canonicalUrl = `${origin}/cases/${caseItem.id}`;
  const names = caseItem.names.flatMap((person) => [person.name, ...person.aliases]).join(", ");
  const primaryName = caseItem.names[0]?.name || caseItem.title;
  const confidence = Math.min(99, 74 + caseItem.indicators.length * 3 + (caseItem.photos?.length ? 8 : 0));
  const title = `${caseItem.title} | Kimchi Canary`;
  const description = truncateDescription(caseItem.summary);
  const ogImageUrl = `${origin}/og.png`;
  return html`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="${escapeAttribute(description)}" />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000403" />
        <meta property="og:title" content="${escapeAttribute(title)}" />
        <meta property="og:description" content="${escapeAttribute(description)}" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="${escapeAttribute(canonicalUrl)}" />
        <meta property="og:site_name" content="${SITE_NAME}" />
        <meta property="og:locale" content="en_US" />
        <meta property="article:published_time" content="${escapeAttribute(caseItem.date)}" />
        <meta property="article:modified_time" content="${escapeAttribute(latestContentDate())}" />
        <meta property="og:image" content="${escapeAttribute(ogImageUrl)}" />
        <meta property="og:image:alt" content="${DEFAULT_OG_ALT}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${escapeAttribute(title)}" />
        <meta name="twitter:description" content="${escapeAttribute(description)}" />
        <meta name="twitter:image" content="${escapeAttribute(ogImageUrl)}" />
        <meta name="twitter:image:alt" content="${DEFAULT_OG_ALT}" />
        <script type="application/ld+json">${jsonLd({
          "@context": "https://schema.org",
          "@graph": [
            organizationJsonLd(origin),
            articleJsonLd({
              origin,
              path: `/cases/${caseItem.id}`,
              title,
              description,
              datePublished: caseItem.date,
              dateModified: latestContentDate(),
              keywords: ["DPRK IT worker fraud", "remote hiring fraud", ...caseItem.indicators],
              mentions: caseItem.names.map((person) => ({
                "@type": "Person",
                name: person.name,
                alternateName: person.aliases,
              })),
              citation: source?.url || caseItem.link,
            }),
            breadcrumbJsonLd(origin, [
              ["Home", "/"],
              ["Watchlist", "/#cases"],
              [caseItem.title, `/cases/${caseItem.id}`],
            ]),
          ],
        })}</script>
        <title>${escapeHtml(title)}</title>
        <style>${styles()}</style>
      </head>
      <body>
        ${renderSimpleTopbar("watchlist")}
        <main class="ops-main page-main case-detail-page">
          <canvas class="page-webgl" data-webgl-page="case" aria-hidden="true"></canvas>
          <section class="case-breadcrumb" aria-label="Breadcrumb">
            <a href="/watchlist">Dossiers</a>
            <span>/</span>
            <span>${escapeHtml(caseItem.id)}</span>
          </section>
          <section class="case-detail-head">
            <div>
              <p class="eyebrow">Official-source dossier</p>
              <h1>Subject: ${escapeHtml(primaryName)}</h1>
              <p class="case-status-line">Status: <span>${escapeHtml(caseItem.status)}</span> | Updated: <time datetime="${escapeHtml(caseItem.date)}">${escapeHtml(caseItem.date)}</time></p>
            </div>
            <div class="case-head-actions">
              <a class="button secondary" href="/watchlist">Back to watchlist</a>
              <a class="button primary" href="${escapeAttribute(caseItem.link)}" target="_blank" rel="noreferrer">Official case page</a>
            </div>
          </section>
          <article class="case-bento">
            <section class="case-identity glass-card">
              <div class="risk-chip">Official record</div>
              ${renderPhotos(caseItem.photos)}
              <div class="case-identity-body">
                <h2>Primary identity</h2>
                <div class="identity-grid">
                  <span>Record title</span><strong>${escapeHtml(caseItem.title)}</strong>
                  <span>Listed people/entities</span><strong>${escapeHtml(String(caseItem.names.length))}</strong>
                  <span>Source publisher</span><strong>${escapeHtml(source?.publisher || "Official source")}</strong>
                  <span>Search names</span><strong>${escapeHtml(names)}</strong>
                </div>
              </div>
            </section>
            <section class="case-note glass-card">
              <h2>Operational protocol</h2>
              <p>Allegations remain allegations unless an authority or court has resolved them. Treat this dossier as a lead for internal due diligence, not an automatic employment decision.</p>
              <a href="mailto:dev.koriel@gmail.com">Correction/removal request</a>
            </section>
            <section class="case-kpis">
              <article class="glass-card alert-card"><span>Threat level</span><strong>Elevated</strong></article>
              <article class="glass-card"><span>Verified sources</span><strong>${source ? "2" : "1"}</strong></article>
              <article class="glass-card"><span>Data confidence</span><strong>${confidence}%</strong></article>
              <article class="glass-card"><span>Last node scan</span><strong>Live</strong></article>
            </section>
            <section class="case-timeline glass-card">
              <div class="case-timeline-head">
                <h2>Official source timeline</h2>
                <span>Sort: chronological desc</span>
              </div>
              <div class="timeline-list">
                <article>
                  <time datetime="${escapeHtml(caseItem.date)}">${escapeHtml(caseItem.date)}</time>
                  <h3>${escapeHtml(caseItem.status)}</h3>
                  <p>${escapeHtml(caseItem.summary)}</p>
                  <div class="case-links">
                    <a href="${escapeAttribute(caseItem.link)}" target="_blank" rel="noreferrer">Official case page</a>
                    ${source ? html`<a href="${escapeAttribute(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.publisher)} source</a>` : ""}
                  </div>
                </article>
                <article>
                  <time datetime="${escapeHtml(source?.date || caseItem.date)}">${escapeHtml(source?.date || caseItem.date)}</time>
                  <h3>Observed indicators from source</h3>
                  <ul>${caseItem.indicators.map((indicator) => html`<li>${escapeHtml(indicator)}</li>`).join("")}</ul>
                </article>
                <article>
                  <time datetime="${escapeHtml(latestContentDate())}">${escapeHtml(latestContentDate())}</time>
                  <h3>Listed people/entities</h3>
                  <div class="names">
                    ${caseItem.names
                      .map((person) => html`<span>${escapeHtml(person.name)}${person.aliases.length ? html` <small>aka ${escapeHtml(person.aliases.join(", "))}</small>` : ""}</span>`)
                      .join("")}
                  </div>
                </article>
              </div>
            </section>
          </article>
        </main>
        ${renderFooter()}
        <script type="module">${clientScript("en")}</script>
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
        <input required name="subjectName" type="text" maxlength="200" placeholder="Name, handle, or profile" />
      </label>
      <label>
        Suspect profile URL
        <input name="subjectProfileUrl" type="url" placeholder="https://profile.example" />
      </label>
    </div>
    <div class="form-row">
      <label>
        Source or evidence URL
        <input name="sourceUrl" type="url" placeholder="Official source URL" />
      </label>
      <label>
        Evidence summary
        <input name="evidenceSummary" type="text" maxlength="2000" placeholder="One-line fact pattern" />
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
  return html`<article class="case-card watch-card" data-case-card data-search="${escapeAttribute(searchText)}">
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
      <a href="/cases/${escapeAttribute(item.id)}">View dossier</a>
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
  return html`<article class="case-card admin-report-card" id="report-${escapeAttribute(report.id)}" data-status="${escapeAttribute(report.status || "pending")}">
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
    <div class="evidence-meter" style="--evidence: ${report.source_url && report.evidence_summary ? 100 : report.source_url || report.evidence_summary ? 58 : 22}">
      <span>Evidence completeness</span>
      <strong>${report.source_url && report.evidence_summary ? "Strong" : report.source_url || report.evidence_summary ? "Partial" : "Weak"}</strong>
    </div>
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

function renderLogoMark(idPrefix = "kcLogo", className = "", attributes = "") {
  const classAttribute = className ? ` class="${escapeAttribute(className)}"` : "";
  return html`<svg${classAttribute} ${attributes} viewBox="0 0 512 512" role="img" aria-label="Kimchi Canary logo">
    <defs>
      <radialGradient id="${idPrefix}-bg" cx="50%" cy="38%" r="70%">
        <stop offset="0" stop-color="#11513a" />
        <stop offset="0.44" stop-color="#041c14" />
        <stop offset="1" stop-color="#000403" />
      </radialGradient>
      <linearGradient id="${idPrefix}-frame" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#eafff6" />
        <stop offset="0.18" stop-color="#20f28f" />
        <stop offset="0.58" stop-color="#061813" />
        <stop offset="1" stop-color="#c8ff5d" />
      </linearGradient>
      <linearGradient id="${idPrefix}-jar" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#fff8e5" />
        <stop offset="0.5" stop-color="#f3d9a6" />
        <stop offset="1" stop-color="#d59b55" />
      </linearGradient>
      <linearGradient id="${idPrefix}-kimchi" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#ff5a35" />
        <stop offset="0.58" stop-color="#d52220" />
        <stop offset="1" stop-color="#82100f" />
      </linearGradient>
      <linearGradient id="${idPrefix}-canary" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#ffe979" />
        <stop offset="0.55" stop-color="#ffc93d" />
        <stop offset="1" stop-color="#f29a1f" />
      </linearGradient>
      <linearGradient id="${idPrefix}-glass" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.86" />
        <stop offset="0.46" stop-color="#c2fff0" stop-opacity="0.28" />
        <stop offset="1" stop-color="#073328" stop-opacity="0.08" />
      </linearGradient>
      <filter id="${idPrefix}-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#20f28f" flood-opacity="0.42" />
      </filter>
      <filter id="${idPrefix}-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="10" dy="14" stdDeviation="8" flood-color="#000000" flood-opacity="0.42" />
      </filter>
    </defs>
    <rect x="22" y="22" width="468" height="468" rx="102" fill="url(#${idPrefix}-bg)" stroke="url(#${idPrefix}-frame)" stroke-width="10" filter="url(#${idPrefix}-glow)" />
    <rect x="42" y="42" width="428" height="428" rx="86" fill="none" stroke="#eafff6" stroke-opacity="0.18" stroke-width="2" />
    <path d="M72 118h368M72 196h368M72 274h368M72 352h368M118 72v368M196 72v368M274 72v368M352 72v368" stroke="#20f28f" stroke-opacity="0.13" stroke-width="3" />
    <circle cx="256" cy="256" r="184" fill="none" stroke="#20f28f" stroke-opacity="0.5" stroke-width="5" />
    <circle cx="256" cy="256" r="150" fill="none" stroke="#c8ff5d" stroke-opacity="0.16" stroke-width="2" stroke-dasharray="8 15" />
    <path d="M96 362c52 44 119 68 193 60 63-7 110-34 141-75" fill="none" stroke="#20f28f" stroke-width="12" stroke-linecap="round" opacity="0.92" />
    <path d="M134 390h244" stroke="#eafff6" stroke-width="14" stroke-linecap="round" opacity="0.96" />
    <g filter="url(#${idPrefix}-shadow)">
      <path d="M137 148h184l-22 68H159l-22-68Z" fill="#07120f" stroke="#eafff6" stroke-width="8" stroke-linejoin="round" />
      <path d="M168 164h122l-8 26H176l-8-26Z" fill="#eafff6" opacity="0.9" />
      <path d="M128 213c0-28 22-50 50-50h132c28 0 50 22 50 50v92c0 70-57 127-127 127s-127-57-127-127v-92Z" fill="url(#${idPrefix}-jar)" stroke="#eafff6" stroke-width="9" />
      <path d="M144 256c43-79 154-82 200-10 32 51 16 119-36 154-58 39-141 17-170-47-14-31-12-66 6-97Z" fill="url(#${idPrefix}-kimchi)" stroke="#130504" stroke-width="7" />
      <path d="M171 292c40-33 104-29 139 11" fill="none" stroke="#ffd36a" stroke-width="16" stroke-linecap="round" opacity="0.92" />
      <path d="M172 338c46 26 98 22 134-10" fill="none" stroke="#8dff91" stroke-width="15" stroke-linecap="round" opacity="0.86" />
      <path d="M193 238c23-20 59-26 94-12" fill="none" stroke="#ff8b6d" stroke-width="10" stroke-linecap="round" opacity="0.68" />
      <path d="M154 210c52-12 118-9 175 20" fill="none" stroke="url(#${idPrefix}-glass)" stroke-width="18" stroke-linecap="round" />
    </g>
    <g filter="url(#${idPrefix}-shadow)">
      <path d="M253 203c53 18 88 65 88 120 0 31-11 60-30 82 75-24 129-94 129-177 0-101-82-183-183-183v158Z" fill="url(#${idPrefix}-canary)" stroke="#07120f" stroke-width="9" />
      <path d="M331 196l72-35-23 78Z" fill="url(#${idPrefix}-canary)" stroke="#07120f" stroke-width="9" stroke-linejoin="round" />
      <path d="M286 148c26 9 48 25 66 45" fill="none" stroke="#fff8a8" stroke-width="8" stroke-linecap="round" opacity="0.54" />
      <circle cx="306" cy="214" r="14" fill="#07120f" />
      <circle cx="310" cy="210" r="4.5" fill="#ffffff" />
      <path d="M291 188h47c17 0 31 14 31 31v26" fill="none" stroke="#20f28f" stroke-width="9" stroke-linecap="round" />
      <path d="M339 246l42 13" stroke="#20f28f" stroke-width="8" stroke-linecap="round" />
      <circle cx="386" cy="261" r="10" fill="#20f28f" stroke="#00150d" stroke-width="4" />
      <path d="M376 112l-32 42M398 125l-44 38" stroke="#20f28f" stroke-width="6" stroke-linecap="round" opacity="0.84" />
    </g>
    <g fill="#ffffff">
      <circle cx="105" cy="140" r="5" />
      <circle cx="404" cy="139" r="4" />
      <circle cx="426" cy="302" r="5" />
      <circle cx="111" cy="299" r="4" />
      <circle cx="256" cy="92" r="4" />
      <circle cx="390" cy="379" r="3" />
      <circle cx="132" cy="407" r="3" />
    </g>
  </svg>`;
}

function renderKimchiLogo() {
  return renderLogoMark("heroLogo", "kimchi-logo");
}

function renderBrandLogo() {
  return renderLogoMark("brandLogo", "brand-kimchi-logo");
}

export function renderWebManifest(origin = "https://kimchicanary.xyz") {
  return JSON.stringify({
    name: SITE_NAME,
    short_name: "Kimchi Canary",
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#000403",
    theme_color: "#000403",
    icons: [
      {
        src: `${origin}/favicon.png`,
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: `${origin}/apple-touch-icon.png`,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  });
}

function renderAlternateLinks(origin) {
  const links = LANGUAGES.map(
    (item) => html`<link rel="alternate" hreflang="${escapeAttribute(item.code)}" href="${escapeAttribute(homeUrlForLanguage(origin, item.code))}" />`,
  );
  links.push(html`<link rel="alternate" hreflang="x-default" href="${escapeAttribute(`${origin}/`)}" />`);
  return links.join("");
}

function renderOgLocaleAlternates(currentLanguage) {
  return LANGUAGES.filter((item) => item.code !== currentLanguage)
    .map((item) => LANGUAGE_LOCALES[item.code])
    .filter(Boolean)
    .map((locale) => html`<meta property="og:locale:alternate" content="${escapeAttribute(locale)}" />`)
    .join("");
}

export function homeUrlForLanguage(origin, language) {
  return language === "en" ? `${origin}/` : `${origin}/?lang=${encodeURIComponent(language)}`;
}

function latestContentDate() {
  return PUBLIC_CASES.map((item) => item.date)
    .sort()
    .at(-1);
}

function organizationJsonLd(origin) {
  return {
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    name: SITE_NAME,
    url: `${origin}/`,
    email: CONTACT_EMAIL,
    logo: {
      "@type": "ImageObject",
      url: `${origin}/apple-touch-icon.png`,
      width: 180,
      height: 180,
    },
  };
}

function websiteJsonLd(origin) {
  return {
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    name: SITE_NAME,
    url: `${origin}/`,
    description: SITE_DESCRIPTION,
    inLanguage: LANGUAGES.map((item) => item.code),
    publisher: { "@id": `${origin}/#organization` },
  };
}

function webApplicationJsonLd(origin, description) {
  return {
    "@type": "WebApplication",
    "@id": `${origin}/#risk-assessment-tool`,
    name: "Kimchi Canary Web3 Hiring Risk Desk",
    url: `${origin}/`,
    description,
    applicationCategory: "SecurityApplication",
    operatingSystem: "Any web browser",
    isAccessibleForFree: true,
    publisher: { "@id": `${origin}/#organization` },
  };
}

function articleJsonLd({ origin, path, title, description, datePublished, dateModified, keywords = [], mentions = [], citation = "" }) {
  return {
    "@type": "Article",
    "@id": `${origin}${path}#article`,
    mainEntityOfPage: `${origin}${path}`,
    headline: title,
    description,
    image: [`${origin}/og.png`],
    author: { "@id": `${origin}/#organization` },
    publisher: { "@id": `${origin}/#organization` },
    datePublished,
    dateModified,
    keywords,
    ...(mentions.length ? { mentions } : {}),
    ...(citation ? { citation } : {}),
  };
}

function breadcrumbJsonLd(origin, items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${origin}${path}`,
    })),
  };
}

function truncateDescription(value) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  return normalized.length <= 158 ? normalized : `${normalized.slice(0, 155).trim()}...`;
}

function renderSimpleTopbar(active = "home") {
  return renderShellChrome({ active });
}

function renderShellChrome({ language = "en", t = getStrings(language), active = "home", showLanguage = false, admin = false } = {}) {
  const topItems = [
    ["watchlist", "Dossiers", "/watchlist"],
    ["assessment", "Assessments", "/assessment"],
    ["report", "Report Vault", "/report"],
    ["kit", "Hiring Kit", "/kit"],
    ["methodology", "Methodology", "/methodology"],
  ];
  return html`<header class="topbar ops-topbar">
      <a class="brand ops-wordmark" href="/" aria-label="Kimchi Canary home">
        <span class="topbar-logo">${renderBrandLogo()}</span>
        <span class="brand-word">KIMCHI CANARY</span>
      </a>
      <nav class="top-nav" aria-label="Primary">
        ${topItems
          .map(
            ([key, label, href]) => html`<a href="${href}" ${active === key ? 'aria-current="page"' : ""}>${label}</a>`,
          )
          .join("")}
      </nav>
      <div class="top-actions">
        ${showLanguage ? html`<label class="language-picker">
          <span>${escapeHtml(t.language)}</span>
          <select id="language-select" aria-label="${escapeHtml(t.language)}">
            ${LANGUAGES.map(
              (item) => html`<option value="${item.code}" ${item.code === language ? "selected" : ""}>${escapeHtml(item.label)}</option>`,
            ).join("")}
          </select>
        </label>` : ""}
        ${admin ? html`<form class="logout-form top-logout" method="post" action="/admin/logout"><button class="top-icon-button" type="submit">Sign out</button></form>` : ""}
        <a class="top-icon" href="/watchlist" aria-label="Search watchlist">⌕</a>
        <a class="top-icon" href="/methodology" aria-label="Security methodology">◆</a>
        <a class="top-icon" href="/report" aria-label="Report vault">▣</a>
        <a class="top-icon" href="/admin" aria-label="Admin terminal">⌘</a>
      </div>
    </header>
    ${renderSideNav(active)}`;
}

function renderSideNav(active = "home") {
  const items = [
    ["home", "Command", "/", "◇"],
    ["watchlist", "Intelligence", "/watchlist", "◈"],
    ["assessment", "Risk Matrix", "/assessment", "◎"],
    ["methodology", "Chain Proof", "/methodology", "⌬"],
    ["report", "Report Vault", "/report", "▣"],
    ["kit", "Hiring Kit", "/kit", "▤"],
  ];
  return html`<aside class="ops-sidebar" aria-label="Defense desk navigation">
    <div class="sidebar-brand">
      <div class="sidebar-logo">${renderBrandLogo()}</div>
      <div>
        <strong>Defense Desk</strong>
        <span>V.2.0.4-OPERATIONAL</span>
      </div>
    </div>
    <a class="sidebar-scan" href="/assessment">Initiate scan</a>
    <div class="sidebar-menu">
      <span class="sidebar-label">Command</span>
      ${items
        .map(
          ([key, label, href, icon]) => html`<a href="${href}" class="${active === key ? "is-active" : ""}" ${active === key ? 'aria-current="page"' : ""}><span>${icon}</span>${label}</a>`,
        )
        .join("")}
    </div>
    <div class="sidebar-bottom">
      <a href="/methodology">System logs</a>
      <a href="mailto:${CONTACT_EMAIL}">Support</a>
    </div>
  </aside>`;
}

function renderFooter() {
  return html`<footer>
    <div class="footer-inner">
      <strong>Kimchi Canary</strong>
      <span>Operational guidance, not legal advice. Consult counsel for sanctions and employment-law decisions.</span>
    </div>
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

    const siteLoader = document.querySelector("[data-site-loader]");
    let siteLoaderHidden = false;
    function hideSiteLoader() {
      if (!siteLoader || siteLoaderHidden) return;
      siteLoaderHidden = true;
      siteLoader.classList.add("is-loaded");
      window.setTimeout(() => siteLoader.remove(), 720);
    }
    window.addEventListener("load", () => window.setTimeout(hideSiteLoader, 1200), { once: true });
    window.setTimeout(hideSiteLoader, 3200);

    const flagDuel = document.querySelector("[data-flag-duel]");
    const flagField = document.querySelector("[data-flag-field]");
    const flagHumor = document.querySelector("[data-flag-humor]");
    const flagSouth = document.querySelector("[data-flag-south]");
    const flagNorth = document.querySelector("[data-flag-north]");
    const defaultFlagSplit = 70;
    const webglFlagState = { split: defaultFlagSplit / 100, pointerX: 0, pointerY: 0 };
    const flagLines = [
      "Compliance wind is winning. The proxy fog has opened a ticket with nobody.",
      "South Korea gained ground. The fake resume is sweating in 4K.",
      "Receipts advanced. The mystery laptop address is requesting emotional support.",
      "The diagonal moved. Somewhere, a VPN just claimed it was in Nebraska.",
      "Maximum canary mode. Vibes are being escorted from the building."
    ];
    function updateFlagSplit(value) {
      if (!flagField) return;
      const split = Math.max(38, Math.min(80, Number(value) || defaultFlagSplit));
      flagField.style.setProperty("--split", split + "%");
      webglFlagState.split = split / 100;
      if (flagSouth) flagSouth.textContent = String(Math.round(split));
      if (flagNorth) flagNorth.textContent = String(100 - Math.round(split));
      if (flagHumor) {
        const index = Math.min(flagLines.length - 1, Math.max(0, Math.floor((split - 38) / 9)));
        flagHumor.textContent = flagLines[index];
      }
    }
    function updateFlagFromPointer(event) {
      if (!flagField) return;
      const rect = flagField.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
      flagField.style.setProperty("--mx", ((x / rect.width) - 0.5) * 26 + "px");
      flagField.style.setProperty("--my", ((y / rect.height) - 0.5) * 18 + "px");
      flagField.style.setProperty("--cursor-x", x + "px");
      flagField.style.setProperty("--cursor-y", y + "px");
      webglFlagState.pointerX = x / rect.width * 2 - 1;
      webglFlagState.pointerY = -(y / rect.height * 2 - 1);
      updateFlagSplit(38 + (x / rect.width) * 42);
    }
    flagField?.addEventListener("pointermove", updateFlagFromPointer);
    flagField?.addEventListener("pointerleave", () => {
      flagField.style.setProperty("--mx", "0px");
      flagField.style.setProperty("--my", "0px");
      flagField.style.setProperty("--cursor-x", "50%");
      flagField.style.setProperty("--cursor-y", "50%");
      updateFlagSplit(defaultFlagSplit);
    });
    updateFlagSplit(defaultFlagSplit);

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      import("/vendor/three.module.js").then((THREE) => initKimchiCanaryWebgl(THREE)).catch(() => {});
    }

    function initKimchiCanaryWebgl(THREE) {
      const canvases = [
        ...document.querySelectorAll("[data-webgl-hero], [data-webgl-bonk], [data-webgl-section], [data-webgl-page]")
      ];
      if (!canvases.length) return;
      document.body.classList.add("webgl-ready");

      const scenes = [];
      const visible = new WeakMap();
      const observer = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
        for (const entry of entries) visible.set(entry.target, entry.isIntersecting);
      }, { rootMargin: "220px" }) : null;

      for (const canvas of canvases) {
        const item = canvas.matches("[data-webgl-hero]")
          ? createHeroWebgl(THREE, canvas)
          : canvas.matches("[data-webgl-bonk]")
            ? createBonkWebgl(THREE, canvas)
            : canvas.matches("[data-webgl-page]")
              ? createPageWebgl(THREE, canvas, canvas.dataset.webglPage || "page")
              : createSectionWebgl(THREE, canvas, canvas.dataset.webglSection || "globe");
        if (item) {
          scenes.push(item);
          visible.set(canvas, true);
          observer?.observe(canvas);
        }
      }

      function animate(now) {
        const time = now * 0.001;
        for (const item of scenes) {
          if (!visible.get(item.canvas)) continue;
          resizeWebgl(THREE, item);
          item.tick(time);
          item.renderer.render(item.scene, item.camera);
        }
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
      window.setTimeout(hideSiteLoader, 820);
    }

    function createRenderer(THREE, canvas) {
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
      if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
      if (THREE.AgXToneMapping) {
        renderer.toneMapping = THREE.AgXToneMapping;
        renderer.toneMappingExposure = 1.18;
      }
      return renderer;
    }

    function resizeWebgl(THREE, item) {
      const width = Math.max(1, item.canvas.clientWidth);
      const height = Math.max(1, item.canvas.clientHeight);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.65);
      const targetWidth = Math.floor(width * pixelRatio);
      const targetHeight = Math.floor(height * pixelRatio);
      if (item.canvas.width !== targetWidth || item.canvas.height !== targetHeight) {
        item.renderer.setSize(width, height, false);
        item.camera.aspect = width / height;
        item.camera.updateProjectionMatrix();
      }
    }

    function makeLights(THREE, scene) {
      scene.add(new THREE.AmbientLight(0x9fffd0, 0.75));
      const key = new THREE.DirectionalLight(0xffffff, 1.8);
      key.position.set(3, 4, 5);
      scene.add(key);
      const green = new THREE.PointLight(0x20f28f, 2.2, 8);
      green.position.set(-2, 1.5, 3);
      scene.add(green);
    }

    function makeParticles(THREE, count, spread) {
      const positions = new Float32Array(count * 3);
      for (let index = 0; index < count; index += 1) {
        positions[index * 3] = (Math.random() - 0.5) * spread;
        positions[index * 3 + 1] = (Math.random() - 0.5) * spread * 0.65;
        positions[index * 3 + 2] = (Math.random() - 0.5) * spread * 0.5;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        color: 0xeafff6,
        size: 0.026,
        transparent: true,
        opacity: 0.82,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      return new THREE.Points(geometry, material);
    }

    function makeStreaks(THREE, count, spread, color = 0x20f28f) {
      const positions = new Float32Array(count * 6);
      for (let index = 0; index < count; index += 1) {
        const base = index * 6;
        const x = (Math.random() - 0.5) * spread;
        const y = (Math.random() - 0.5) * spread * 0.55;
        const z = (Math.random() - 0.5) * spread * 0.45;
        const length = 0.16 + Math.random() * 0.42;
        positions[base] = x;
        positions[base + 1] = y;
        positions[base + 2] = z;
        positions[base + 3] = x + length;
        positions[base + 4] = y + length * 0.18;
        positions[base + 5] = z - length * 0.12;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      return new THREE.LineSegments(geometry, material);
    }

    function glowMaterial(THREE, color, opacity) {
      return new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
    }

    function createHeroWebgl(THREE, canvas) {
      const renderer = createRenderer(THREE, canvas);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0, 6.2);
      const vertex = [
        "uniform float uTime;",
        "uniform float uPointerX;",
        "uniform float uPointerY;",
        "varying vec2 vUv;",
        "void main(){",
        "vUv=uv;",
        "vec3 p=position;",
        "p.z += sin((p.x*2.2+uTime*1.4)*3.0)*0.09;",
        "p.z += sin((p.y*2.5-uTime*1.1)*4.0)*0.055;",
        "p.x += uPointerX*0.055*(1.0-abs(uv.x-0.5));",
        "p.y += uPointerY*0.04*(1.0-abs(uv.y-0.5));",
        "gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);",
        "}"
      ].join("\\n");
      const fragment = [
        "precision highp float;",
        "uniform float uTime;",
        "uniform float uKind;",
        "varying vec2 vUv;",
        "float box(vec2 p, vec2 c, vec2 s){vec2 d=abs(p-c)-s;return 1.0-step(0.0,max(d.x,d.y));}",
        "void main(){",
        "vec2 uv=vUv;",
        "vec3 color=vec3(0.0);",
        "float wave=sin((uv.x+uTime*.12)*24.0)*0.035;",
        "if(uKind<0.5){",
        "color=vec3(.94,.97,.99);",
        "vec2 q=(uv-vec2(.5,.5)); q.x*=1.45;",
        "float d=length(q);",
        "float disc=smoothstep(.165,.155,d);",
        "float top=step(0.0,q.y+0.025*sin(q.x*16.0));",
        "color=mix(color,vec3(.80,.12,.18),disc*top);",
        "color=mix(color,vec3(.02,.25,.62),disc*(1.0-top));",
        "float bars=0.0;",
        "bars+=box(uv,vec2(.23,.25),vec2(.095,.011))+box(uv,vec2(.23,.285),vec2(.095,.011))+box(uv,vec2(.23,.32),vec2(.095,.011));",
        "bars+=box(uv,vec2(.77,.25),vec2(.044,.011))+box(uv,vec2(.84,.25),vec2(.044,.011))+box(uv,vec2(.805,.285),vec2(.095,.011))+box(uv,vec2(.77,.32),vec2(.044,.011))+box(uv,vec2(.84,.32),vec2(.044,.011));",
        "bars+=box(uv,vec2(.23,.72),vec2(.095,.011))+box(uv,vec2(.19,.685),vec2(.044,.011))+box(uv,vec2(.27,.685),vec2(.044,.011))+box(uv,vec2(.23,.65),vec2(.095,.011));",
        "bars+=box(uv,vec2(.77,.72),vec2(.044,.011))+box(uv,vec2(.84,.72),vec2(.044,.011))+box(uv,vec2(.77,.685),vec2(.044,.011))+box(uv,vec2(.84,.685),vec2(.044,.011))+box(uv,vec2(.77,.65),vec2(.044,.011))+box(uv,vec2(.84,.65),vec2(.044,.011));",
        "color=mix(color,vec3(.02,.025,.025),clamp(bars,0.0,1.0));",
        "} else {",
        "color=vec3(.02,.22,.56);",
        "float white=step(.18,uv.y)*step(uv.y,.25)+step(.75,uv.y)*step(uv.y,.82);",
        "float red=step(.25,uv.y)*step(uv.y,.75);",
        "color=mix(color,vec3(.95,.98,1.0),white);",
        "color=mix(color,vec3(.82,.03,.08),red);",
        "vec2 q=(uv-vec2(.28,.5)); q.x*=1.45;",
        "float circle=smoothstep(.14,.13,length(q));",
        "color=mix(color,vec3(1.0),circle);",
        "float star=max(0.0,1.0-length(q*vec2(1.1,1.1))/.09);",
        "color=mix(color,vec3(.86,.03,.06),pow(star,0.45));",
        "}",
        "color += wave;",
        "float vignette=1.0-smoothstep(.2,.92,distance(uv,vec2(.5)));",
        "gl_FragColor=vec4(color*vignette,0.96);",
        "}"
      ].join("\\n");
      function flagMaterial(kind) {
        return new THREE.ShaderMaterial({
          uniforms: { uTime: { value: 0 }, uKind: { value: kind }, uPointerX: { value: 0 }, uPointerY: { value: 0 } },
          vertexShader: vertex,
          fragmentShader: fragment,
          transparent: true,
          side: THREE.DoubleSide
        });
      }
      const geometry = new THREE.PlaneGeometry(5.6, 3.15, 100, 56);
      const south = new THREE.Mesh(geometry, flagMaterial(0));
      const north = new THREE.Mesh(geometry, flagMaterial(1));
      south.position.set(-0.72, 0.06, 0.18);
      south.rotation.set(-0.08, -0.25, -0.08);
      north.position.set(0.95, -0.02, -0.28);
      north.rotation.set(0.04, 0.28, -0.08);
      scene.add(north, south);
      const divider = new THREE.Mesh(new THREE.BoxGeometry(0.045, 4.2, 0.045), new THREE.MeshBasicMaterial({ color: 0xc8ff5d }));
      divider.rotation.z = -0.22;
      scene.add(divider);
      const shield = new THREE.Group();
      shield.position.set(0.1, -0.05, -0.92);
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(2.72, 64, 32),
        new THREE.MeshBasicMaterial({
          color: 0x20f28f,
          wireframe: true,
          transparent: true,
          opacity: 0.075,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      dome.scale.y = 0.56;
      const haloA = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.008, 8, 160), glowMaterial(THREE, 0x20f28f, 0.42));
      const haloB = new THREE.Mesh(new THREE.TorusGeometry(1.64, 0.006, 8, 140), glowMaterial(THREE, 0xc8ff5d, 0.28));
      haloA.rotation.x = Math.PI / 2.22;
      haloA.rotation.z = -0.18;
      haloB.rotation.y = Math.PI / 3.5;
      haloB.rotation.x = Math.PI / 2.7;
      const scanBlade = new THREE.Mesh(new THREE.PlaneGeometry(0.035, 4.8, 1, 1), glowMaterial(THREE, 0xeafff6, 0.58));
      scanBlade.rotation.z = -0.22;
      shield.add(dome, haloA, haloB, scanBlade);
      scene.add(shield);
      const particles = makeParticles(THREE, 220, 8.4);
      const streaks = makeStreaks(THREE, 78, 8.8, 0x20f28f);
      scene.add(particles, streaks);
      return { canvas, renderer, scene, camera, tick(time) {
        south.material.uniforms.uTime.value = time;
        north.material.uniforms.uTime.value = time + 1.4;
        south.material.uniforms.uPointerX.value = webglFlagState.pointerX;
        south.material.uniforms.uPointerY.value = webglFlagState.pointerY;
        north.material.uniforms.uPointerX.value = -webglFlagState.pointerX * 0.55;
        north.material.uniforms.uPointerY.value = -webglFlagState.pointerY * 0.45;
        const splitX = (webglFlagState.split - 0.5) * 3.9;
        divider.position.x = splitX;
        divider.position.y = Math.sin(time * 1.2) * 0.06;
        scanBlade.position.x = splitX;
        scanBlade.scale.y = 0.88 + Math.sin(time * 2.1) * 0.08;
        south.scale.setScalar(1.04 + webglFlagState.split * 0.2);
        north.scale.setScalar(0.95 + (1 - webglFlagState.split) * 0.16);
        south.rotation.y = -0.25 + webglFlagState.pointerX * 0.06;
        north.rotation.y = 0.28 + webglFlagState.pointerX * 0.035;
        camera.position.x = webglFlagState.pointerX * 0.22;
        camera.position.y = webglFlagState.pointerY * 0.16;
        camera.lookAt(0, 0, 0);
        shield.rotation.z = Math.sin(time * 0.18) * 0.04;
        dome.rotation.y = time * 0.075;
        haloA.rotation.z = -0.18 + time * 0.11;
        haloB.rotation.z = time * -0.08;
        particles.rotation.z = time * 0.025;
        streaks.rotation.y = time * 0.035;
      }};
    }

    function createSectionWebgl(THREE, canvas, kind) {
      const renderer = createRenderer(THREE, canvas);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0, 5.2);
      makeLights(THREE, scene);
      const root = new THREE.Group();
      root.rotation.set(0.7, -0.25, -0.18);
      scene.add(root);
      const green = new THREE.MeshStandardMaterial({ color: 0x20f28f, emissive: 0x073d27, metalness: 0.45, roughness: 0.28 });
      const dark = new THREE.MeshStandardMaterial({ color: 0x020b08, emissive: 0x020b08, metalness: 0.55, roughness: 0.34 });
      const white = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x152018, metalness: 0.2, roughness: 0.22 });
      const red = new THREE.MeshStandardMaterial({ color: 0xff3158, emissive: 0x4a0010, metalness: 0.2, roughness: 0.3 });
      const gold = new THREE.MeshStandardMaterial({ color: 0xc8ff5d, emissive: 0x344500, metalness: 0.35, roughness: 0.25 });
      const parts = [];
      if (kind === "globe") {
        const globe = new THREE.Mesh(new THREE.SphereGeometry(0.82, 48, 24), new THREE.MeshStandardMaterial({ color: 0x0b7cff, emissive: 0x062044, roughness: 0.28, metalness: 0.18 }));
        const land = new THREE.Mesh(new THREE.IcosahedronGeometry(0.84, 1), new THREE.MeshStandardMaterial({ color: 0xc8ff5d, wireframe: true, transparent: true, opacity: 0.62 }));
        const shieldGrid = new THREE.Mesh(new THREE.SphereGeometry(1.08, 40, 20), new THREE.MeshBasicMaterial({ color: 0x20f28f, wireframe: true, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false }));
        const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.28, 0.015, 10, 100), green);
        const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.012, 10, 100), white);
        const ringC = new THREE.Mesh(new THREE.TorusGeometry(1.78, 0.007, 8, 128), glowMaterial(THREE, 0x20f28f, 0.34));
        ringA.rotation.x = Math.PI / 2.8;
        ringB.rotation.y = Math.PI / 3;
        ringC.rotation.x = Math.PI / 2.1;
        ringC.rotation.z = -0.36;
        const threat = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), red);
        threat.position.set(0.43, 0.25, 0.72);
        root.add(globe, land, shieldGrid, ringA, ringB, ringC, threat);
        parts.push(globe, land, shieldGrid, ringA, ringB, ringC, threat);
      } else if (kind === "radar") {
        const dish = new THREE.Mesh(new THREE.ConeGeometry(1.15, 0.42, 64, 1, true), green);
        dish.rotation.x = Math.PI / 2;
        dish.position.y = 0.2;
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.82, 0.28, 48), dark);
        base.position.y = -0.58;
        const sweep = new THREE.Mesh(new THREE.CircleGeometry(1.18, 64), new THREE.MeshBasicMaterial({ color: 0x20f28f, transparent: true, opacity: 0.22, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
        sweep.position.z = 0.18;
        const beam = new THREE.Mesh(new THREE.PlaneGeometry(0.035, 2.45), glowMaterial(THREE, 0xeafff6, 0.48));
        beam.position.z = 0.36;
        const blip = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), white);
        blip.position.set(0.54, 0.24, 0.5);
        root.add(dish, base, sweep, beam, blip);
        parts.push(dish, sweep, beam, blip);
      } else if (kind === "workflow") {
        for (let index = 0; index < 4; index += 1) {
          const torus = new THREE.Mesh(new THREE.TorusGeometry(1.4 - index * 0.25, 0.014, 8, 72), index % 2 ? white : green);
          torus.position.z = index * 0.34;
          root.add(torus);
          parts.push(torus);
        }
        const connector = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 2.35, 12), glowMaterial(THREE, 0x20f28f, 0.42));
        connector.rotation.z = Math.PI / 2;
        connector.position.set(0, -0.05, 0.82);
        root.add(connector);
        parts.push(connector);
        ["ID", "KYC", "SSH"].forEach((label, index) => {
          const box = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.3, 0.08), index === 1 ? gold : dark);
          box.position.set(-0.78 + index * 0.78, 0.15 - index * 0.18, 0.72 + index * 0.18);
          root.add(box);
          parts.push(box);
        });
      } else if (kind === "queue") {
        const vault = new THREE.Mesh(new THREE.BoxGeometry(1.38, 1.02, 0.48), dark);
        const dial = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.025, 12, 48), green);
        dial.position.z = 0.3;
        const scan = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.045), glowMaterial(THREE, 0x20f28f, 0.48));
        scan.position.set(0, 0.05, 0.62);
        for (let index = 0; index < 3; index += 1) {
          const report = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.38, 0.035), white);
          report.position.set(-0.85 + index * 0.78, -0.52 + index * 0.16, 0.48 + index * 0.16);
          report.rotation.z = -0.2 + index * 0.2;
          root.add(report);
          parts.push(report);
        }
        root.add(vault, dial, scan);
        parts.push(vault, dial, scan);
      } else if (kind === "watchlist") {
        for (let index = 0; index < 4; index += 1) {
          const card = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.72, 0.06), index === 2 ? gold : dark);
          card.position.set(-1.02 + index * 0.68, Math.sin(index) * 0.18, index * 0.15);
          card.rotation.y = -0.3 + index * 0.18;
          root.add(card);
          parts.push(card);
        }
        const beam = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.035, 0.035), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        const target = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.009, 8, 72), glowMaterial(THREE, 0xff3158, 0.58));
        target.position.set(0.35, -0.05, 0.98);
        beam.position.z = 0.92;
        root.add(beam, target);
        parts.push(beam, target);
      } else {
        const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.52, 0), green);
        const orbitA = new THREE.Mesh(new THREE.TorusGeometry(1.28, 0.012, 8, 88), white);
        const orbitB = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.012, 8, 88), green);
        orbitA.rotation.x = Math.PI / 2.6;
        orbitB.rotation.y = Math.PI / 3.2;
        root.add(core, orbitA, orbitB);
        parts.push(core, orbitA, orbitB);
        for (let index = 0; index < 4; index += 1) {
          const node = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12), index === 1 ? gold : white);
          node.position.set(Math.cos(index * 1.7) * 1.18, Math.sin(index * 1.7) * 0.66, 0.24);
          root.add(node);
          parts.push(node);
        }
      }
      const particles = makeParticles(THREE, 78, 3.45);
      const streaks = makeStreaks(THREE, 34, 3.7, kind === "watchlist" ? 0xff3158 : 0x20f28f);
      scene.add(particles, streaks);
      return { canvas, renderer, scene, camera, tick(time) {
        root.rotation.y = Math.sin(time * 0.4) * 0.18 - 0.18;
        root.rotation.x = 0.62 + Math.sin(time * 0.3) * 0.08;
        root.position.y = Math.sin(time * 0.8) * 0.05;
        for (let index = 0; index < parts.length; index += 1) {
          parts[index].rotation.z += 0.004 + index * 0.0008;
          parts[index].rotation.y += 0.003;
        }
        particles.rotation.y = time * 0.08;
        streaks.rotation.z = time * 0.05;
      }};
    }

    function createBonkWebgl(THREE, canvas) {
      const renderer = createRenderer(THREE, canvas);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 100);
      camera.position.set(0, 0, 5.4);
      makeLights(THREE, scene);
      const root = new THREE.Group();
      root.rotation.x = 0.2;
      scene.add(root);
      const red = new THREE.MeshStandardMaterial({ color: 0xc91d1b, emissive: 0x3a0707, roughness: 0.34, metalness: 0.12 });
      const white = new THREE.MeshStandardMaterial({ color: 0xf7fff9, roughness: 0.25, metalness: 0.12 });
      const dark = new THREE.MeshStandardMaterial({ color: 0x020b08, emissive: 0x03140f, roughness: 0.32, metalness: 0.45 });
      const green = new THREE.MeshStandardMaterial({ color: 0x20f28f, emissive: 0x083b27, roughness: 0.3, metalness: 0.4 });
      const glove = new THREE.Group();
      const palm = new THREE.Mesh(new THREE.SphereGeometry(0.48, 32, 20), red);
      palm.scale.set(1.5, 0.82, 0.7);
      glove.add(palm);
      for (let i = 0; i < 4; i += 1) {
        const knuckle = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), red);
        knuckle.position.set(-0.42 + i * 0.28, 0.32, 0.08);
        glove.add(knuckle);
      }
      const thumb = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 16), red);
      thumb.scale.set(1.05, 0.52, 0.58);
      thumb.position.set(0.44, -0.18, 0.14);
      thumb.rotation.z = -0.55;
      const seam = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.018, 12, 48), new THREE.MeshStandardMaterial({ color: 0x510808, emissive: 0x180202, roughness: 0.42 }));
      seam.position.set(0.28, -0.18, 0.5);
      seam.rotation.x = Math.PI / 2.2;
      glove.add(thumb, seam);
      const cuff = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.5, 0.42), white);
      cuff.position.set(-0.9, -0.05, -0.03);
      glove.add(cuff);
      glove.position.set(-1.25, -0.08, 0.55);
      root.add(glove);
      const resumeGroup = new THREE.Group();
      resumeGroup.position.set(0.35, 0.05, 0.1);
      const resume = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.72, 0.04), white);
      resumeGroup.add(resume);
      for (let index = 0; index < 4; index += 1) {
        const line = new THREE.Mesh(new THREE.BoxGeometry(index === 0 ? 0.44 : 0.68, 0.035, 0.026), index === 0 ? dark : green);
        line.position.set(-0.13 + index * 0.02, 0.2 - index * 0.14, 0.055);
        resumeGroup.add(line);
      }
      root.add(resumeGroup);
      const laptop = new THREE.Group();
      const screen = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.52, 0.05), dark);
      const base = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.08, 0.42), dark);
      base.position.set(0, -0.34, 0.2);
      const proxy = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.08, 0.02), green);
      proxy.position.set(0, -0.05, 0.08);
      laptop.add(screen, base, proxy);
      laptop.position.set(1.42, -0.02, -0.12);
      root.add(laptop);
      const burst = new THREE.Group();
      const burstRays = [];
      for (let index = 0; index < 12; index += 1) {
        const ray = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.52, 8), glowMaterial(THREE, index % 2 ? 0xc8ff5d : 0x20f28f, 0.64));
        ray.rotation.z = index * Math.PI / 6;
        ray.rotation.x = Math.PI / 2;
        ray.position.set(Math.cos(index * Math.PI / 6) * 0.18, Math.sin(index * Math.PI / 6) * 0.18, 0.62);
        burst.add(ray);
        burstRays.push(ray);
      }
      burst.position.set(0.85, 0.15, 0.18);
      root.add(burst);
      const particles = makeParticles(THREE, 96, 4.2);
      const streaks = makeStreaks(THREE, 46, 4.2, 0x20f28f);
      scene.add(particles, streaks);
      return { canvas, renderer, scene, camera, tick(time) {
        const hit = Math.max(0, Math.sin(time * 2.4));
        glove.position.x = -1.42 + hit * 0.7;
        glove.rotation.z = -0.18 + hit * 0.28;
        resumeGroup.rotation.z = hit * 0.24;
        resumeGroup.position.x = 0.35 + hit * 0.22;
        laptop.rotation.z = Math.sin(time * 2.4 + 1.2) * 0.025;
        burst.scale.setScalar(0.45 + hit * 1.25);
        burst.rotation.z = time * 0.9;
        for (const ray of burstRays) ray.material.opacity = 0.18 + hit * 0.62;
        root.rotation.y = Math.sin(time * 0.55) * 0.12;
        particles.rotation.z = time * 0.12;
        streaks.rotation.y = time * 0.09;
      }};
    }

    function createPageWebgl(THREE, canvas, kind) {
      const renderer = createRenderer(THREE, canvas);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
      camera.position.set(0, 0, 7.2);
      makeLights(THREE, scene);
      const root = new THREE.Group();
      root.position.set(1.7, 0.85, -0.2);
      scene.add(root);
      const green = new THREE.MeshStandardMaterial({ color: 0x20f28f, emissive: 0x063d27, metalness: 0.52, roughness: 0.22 });
      const white = new THREE.MeshStandardMaterial({ color: 0xeafff6, emissive: 0x102820, metalness: 0.25, roughness: 0.2 });
      const dark = new THREE.MeshStandardMaterial({ color: 0x020b08, emissive: 0x020b08, metalness: 0.6, roughness: 0.32 });
      const blue = new THREE.MeshStandardMaterial({ color: 0x33ccff, emissive: 0x062232, metalness: 0.32, roughness: 0.24 });
      const gold = new THREE.MeshStandardMaterial({ color: 0xc8ff5d, emissive: 0x344500, metalness: 0.32, roughness: 0.22 });
      const red = new THREE.MeshStandardMaterial({ color: 0xff3158, emissive: 0x4a0010, metalness: 0.18, roughness: 0.28 });
      const parts = [];
      function addPart(mesh) {
        root.add(mesh);
        parts.push(mesh);
        return mesh;
      }
      const shell = addPart(new THREE.Mesh(new THREE.SphereGeometry(1.78, 36, 18), new THREE.MeshBasicMaterial({ color: kind === "case" ? 0xff3158 : 0x20f28f, wireframe: true, transparent: true, opacity: 0.09, blending: THREE.AdditiveBlending, depthWrite: false })));
      if (kind === "methodology") {
        const core = addPart(new THREE.Mesh(new THREE.OctahedronGeometry(0.58, 1), green));
        const orbitA = addPart(new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.012, 8, 128), green));
        const orbitB = addPart(new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.01, 8, 108), white));
        const orbitC = addPart(new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.008, 8, 96), blue));
        orbitA.rotation.x = Math.PI / 2.42;
        orbitB.rotation.y = Math.PI / 3.2;
        orbitC.rotation.x = Math.PI / 2.8;
        for (let index = 0; index < 6; index += 1) {
          const node = addPart(new THREE.Mesh(new THREE.SphereGeometry(0.07 + index * 0.004, 16, 12), index % 3 === 0 ? gold : white));
          node.position.set(Math.cos(index * 1.05) * 1.28, Math.sin(index * 1.05) * 0.7, 0.22 * Math.sin(index));
        }
        core.scale.set(0.9, 1.25, 0.9);
      } else if (kind === "kit") {
        for (let index = 0; index < 6; index += 1) {
          const plate = addPart(new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.54, 0.035), index % 2 ? white : dark));
          plate.position.set(-0.55 + index * 0.23, -0.28 + index * 0.16, index * 0.12);
          plate.rotation.set(0.18, -0.32, -0.16 + index * 0.08);
        }
        const checkCore = addPart(new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.025, 12, 86), green));
        const stamp = addPart(new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.13, 0.06), gold));
        checkCore.position.set(0.32, 0.28, 0.98);
        stamp.position.set(0.08, -0.08, 1.05);
      } else if (kind === "case") {
        for (let index = 0; index < 4; index += 1) {
          const dossier = addPart(new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.82, 0.055), index === 0 ? red : dark));
          dossier.position.set(-0.8 + index * 0.54, Math.sin(index * 1.2) * 0.18, index * 0.16);
          dossier.rotation.y = -0.45 + index * 0.2;
        }
        const scanner = addPart(new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.035, 0.035), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.78, blending: THREE.AdditiveBlending })));
        const target = addPart(new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.012, 8, 90), glowMaterial(THREE, 0xff3158, 0.6)));
        scanner.position.z = 1.05;
        target.position.set(0.05, 0.02, 1.18);
      } else {
        const vault = addPart(new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.88, 0.52), dark));
        const dial = addPart(new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.028, 12, 72), green));
        const lock = addPart(new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.14, 32), gold));
        dial.position.z = 0.34;
        lock.position.set(0, 0, 0.42);
        lock.rotation.x = Math.PI / 2;
        for (let index = 0; index < 5; index += 1) {
          const shard = addPart(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.22, 0.035), index % 2 ? white : green));
          shard.position.set(Math.cos(index * 1.4) * 1.14, Math.sin(index * 1.4) * 0.62, 0.24 + index * 0.08);
          shard.rotation.z = index * 0.38;
        }
      }
      const particles = makeParticles(THREE, 160, 6.6);
      const streaks = makeStreaks(THREE, 70, 6.8, kind === "case" ? 0xff3158 : 0x20f28f);
      scene.add(particles, streaks);
      return { canvas, renderer, scene, camera, tick(time) {
        root.rotation.x = 0.58 + Math.sin(time * 0.32) * 0.08;
        root.rotation.y = time * 0.12;
        root.rotation.z = -0.18 + Math.sin(time * 0.24) * 0.08;
        shell.rotation.y = time * -0.09;
        for (let index = 0; index < parts.length; index += 1) {
          parts[index].rotation.y += 0.004 + index * 0.0007;
          parts[index].rotation.z += 0.002 + index * 0.0004;
        }
        particles.rotation.y = time * 0.045;
        streaks.rotation.z = time * 0.035;
      }};
    }

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
      --ink: #eafff6;
      --muted: #8ab8a7;
      --paper: #000403;
      --panel: #04130f;
      --panel-strong: #071d17;
      --line: rgba(63, 255, 178, 0.22);
      --accent: #20f28f;
      --accent-dark: #0ecf78;
      --danger: #ff3158;
      --gold: #c8ff5d;
      --green: #20f28f;
      --blue: #38d5ff;
      --shadow: 0 24px 70px rgba(0, 255, 149, 0.12);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    [id] { scroll-margin-top: 108px; }
    ::selection { background: rgba(32, 242, 143, 0.35); color: #ffffff; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      color: var(--ink);
      background: var(--paper);
      background-image:
        radial-gradient(circle at 18% 0%, rgba(32, 242, 143, 0.12), transparent 34%),
        radial-gradient(circle at 85% 12%, rgba(56, 213, 255, 0.08), transparent 30%),
        linear-gradient(90deg, rgba(32, 242, 143, 0.055) 1px, transparent 1px),
        linear-gradient(rgba(32, 242, 143, 0.045) 1px, transparent 1px);
      background-size: 38px 38px;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }
    a { color: inherit; }
    .site-loader {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: grid;
      place-items: center;
      padding: 28px;
      background:
        radial-gradient(circle at 50% 44%, rgba(32, 242, 143, 0.13), transparent 28%),
        linear-gradient(180deg, #000000 0%, #020806 100%);
      opacity: 1;
      transition: opacity 520ms ease, visibility 520ms ease;
    }
    .site-loader::before {
      content: "";
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(32, 242, 143, 0.07) 1px, transparent 1px),
        linear-gradient(90deg, rgba(32, 242, 143, 0.05) 1px, transparent 1px);
      background-size: 34px 34px;
      mask-image: radial-gradient(circle at 50% 48%, #000 0 42%, transparent 72%);
      animation: loaderGrid 5.5s linear infinite;
    }
    .site-loader.is-loaded {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    .loader-core {
      position: relative;
      width: min(88vw, 520px);
      display: grid;
      justify-items: center;
      gap: 13px;
      text-align: center;
      color: var(--ink);
      filter: drop-shadow(0 0 34px rgba(32, 242, 143, 0.22));
    }
    .loader-logo {
      width: min(44vw, 168px);
      min-width: 118px;
      animation: loaderLogo 1.7s ease-in-out infinite;
    }
    .loader-kicker,
    .loader-status {
      margin: 0;
      color: var(--muted);
      font-size: 11px;
      font-weight: 850;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      overflow-wrap: normal;
    }
    .loader-core strong {
      position: relative;
      display: inline-block;
      font-family: Georgia, "Times New Roman", serif;
      color: #eafff6;
      font-size: clamp(42px, 9vw, 78px);
      line-height: 0.86;
      letter-spacing: 0;
      text-shadow: 0 0 22px rgba(32, 242, 143, 0.34), 2px 0 rgba(56, 213, 255, 0.42), -2px 0 rgba(255, 49, 88, 0.32);
      animation: loaderGlitch 2.4s steps(2, end) infinite;
    }
    .loader-line {
      position: relative;
      display: block;
      width: min(100%, 360px);
      height: 4px;
      overflow: hidden;
      border: 1px solid rgba(32, 242, 143, 0.34);
      background: rgba(32, 242, 143, 0.08);
    }
    .loader-line span {
      display: block;
      width: 42%;
      height: 100%;
      background: linear-gradient(90deg, transparent, var(--accent), var(--gold), transparent);
      box-shadow: 0 0 20px rgba(32, 242, 143, 0.72);
      animation: loaderLine 1.05s cubic-bezier(0.5, 0, 0.2, 1) infinite;
    }
    @keyframes loaderGrid {
      0% { transform: translate3d(0, 0, 0); opacity: 0.8; }
      100% { transform: translate3d(34px, 34px, 0); opacity: 0.8; }
    }
    @keyframes loaderLogo {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-5px) scale(1.02); }
    }
    @keyframes loaderLine {
      0% { transform: translateX(-120%); }
      100% { transform: translateX(260%); }
    }
    @keyframes loaderGlitch {
      0%, 86%, 100% { transform: translate(0, 0); filter: none; }
      88% { transform: translate(-2px, 1px); filter: hue-rotate(18deg); }
      90% { transform: translate(3px, -1px); filter: hue-rotate(-18deg); }
      92% { transform: translate(-1px, 0); filter: none; }
    }
    .topbar {
      position: sticky;
      top: 0;
      z-index: 20;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 16px;
      min-height: 72px;
      padding: 14px clamp(18px, 4vw, 56px);
      border-bottom: 1px solid rgba(32, 242, 143, 0.22);
      background: rgba(0, 4, 3, 0.92);
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
      color: var(--ink);
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
    .brand-logo-mark {
      width: 42px;
      height: 42px;
      border: 0;
      background: transparent;
      color: inherit;
      box-shadow: none;
    }
    .brand-kimchi-logo {
      display: block;
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 0 13px rgba(32, 242, 143, 0.34));
    }
    nav {
      flex-wrap: wrap;
      justify-content: center;
      min-width: 0;
    }
    nav a, .language-picker {
      border: 1px solid rgba(32, 242, 143, 0.22);
      background: rgba(4, 19, 15, 0.82);
      color: var(--ink);
      padding: 9px 12px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 750;
      min-height: 42px;
      box-shadow: 0 0 0 rgba(32, 242, 143, 0);
      transition: border-color 160ms ease, color 160ms ease, background 160ms ease, box-shadow 160ms ease;
    }
    nav a:hover, .language-picker:hover {
      border-color: rgba(32, 242, 143, 0.72);
      background: rgba(8, 40, 30, 0.9);
      box-shadow: 0 0 22px rgba(32, 242, 143, 0.13);
    }
    nav a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
    }
    .language-picker { justify-self: end; }
    .language-picker select {
      width: auto;
      min-width: 126px;
      padding: 5px 8px;
      border: 0;
      background: transparent;
      font-weight: 800;
      color: var(--ink);
    }
    select, input, textarea {
      width: 100%;
      border: 1px solid var(--line);
      background: #020b08;
      color: var(--ink);
      padding: 11px 12px;
      font: inherit;
      border-radius: 4px;
    }
    ::placeholder { color: rgba(138, 184, 167, 0.72); }
    input:focus, textarea:focus, select:focus, .button:focus-visible, nav a:focus-visible {
      outline: 2px solid rgba(200, 255, 93, 0.9);
      outline-offset: 3px;
    }
    main {
      flex: 1 0 auto;
      overflow-x: clip;
    }
    .hero {
      position: relative;
      display: grid;
      place-items: center;
      min-height: calc(100svh - 72px);
      padding: clamp(34px, 5vw, 72px) clamp(18px, 5vw, 72px) clamp(96px, 12vw, 150px);
      border-bottom: 1px solid var(--line);
      text-align: center;
      overflow: hidden;
      background: #000403;
      isolation: isolate;
    }
    .bonk-strip {
      display: grid;
      place-items: center;
      padding: clamp(34px, 6vw, 72px) clamp(18px, 5vw, 72px);
      border-bottom: 1px solid var(--line);
      background:
        radial-gradient(circle at 50% 0%, rgba(32, 242, 143, 0.14), transparent 42%),
        linear-gradient(90deg, rgba(32, 242, 143, 0.06) 1px, transparent 1px),
        linear-gradient(rgba(32, 242, 143, 0.05) 1px, transparent 1px),
        #000403;
      background-size: 38px 38px;
    }
    .hero::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      background:
        radial-gradient(circle at 50% 26%, rgba(8, 255, 152, 0.22), rgba(8, 255, 152, 0.08) 30%, rgba(0, 4, 3, 0.76) 66%),
        linear-gradient(180deg, rgba(0, 4, 3, 0.2), rgba(0, 4, 3, 0.88));
      pointer-events: none;
    }
    .hero::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      background-image:
        linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
        linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
      background-size: 42px 42px;
      mix-blend-mode: overlay;
      opacity: 0.55;
      pointer-events: none;
    }
    .hero-inner {
      position: relative;
      z-index: 3;
      width: min(100%, 980px);
      display: grid;
      justify-items: center;
      text-shadow: 0 0 24px rgba(0, 255, 149, 0.22);
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
      filter: drop-shadow(0 0 24px rgba(32, 242, 143, 0.24));
    }
    .eyebrow {
      margin: 0 0 12px;
      color: var(--accent);
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
      text-wrap: balance;
    }
    h2 {
      max-width: 940px;
      font-size: clamp(30px, 4.4vw, 58px);
      line-height: 1.03;
      letter-spacing: 0;
      text-wrap: balance;
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
      overflow-wrap: anywhere;
    }
    .subtitle {
      max-width: 760px;
      color: var(--ink);
      font-size: clamp(22px, 3vw, 32px);
      line-height: 1.18;
      font-weight: 780;
      text-wrap: balance;
    }
    .hero-copy { max-width: 720px; text-wrap: pretty; }
    .hero .subtitle { color: #eafff6; }
    .hero .hero-copy {
      color: #b8e7d5;
      font-weight: 680;
    }
    .flag-duel {
      position: absolute;
      inset: 0;
      z-index: 0;
      overflow: hidden;
      color: white;
      text-shadow: none;
    }
    .hero-webgl {
      position: absolute;
      inset: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
      display: block;
      opacity: 0;
      transition: opacity 260ms ease;
    }
    .webgl-ready .hero-webgl { opacity: 1; }
    .flag-field {
      position: absolute;
      inset: -8% -5% -5%;
      cursor: crosshair;
      touch-action: none;
      --split: 70%;
      --mx: 0px;
      --my: 0px;
      --cursor-x: 50%;
      --cursor-y: 50%;
      background: #05070c;
      transform: translateZ(0);
      perspective: 900px;
      transform-style: preserve-3d;
    }
    .webgl-ready .flag-field {
      opacity: 0.12;
      filter: blur(0.4px) saturate(1.4);
    }
    .webgl-ready .flag-art,
    .webgl-ready .flag-panel::before,
    .webgl-ready .flag-panel::after,
    .webgl-ready .flag-shine,
    .webgl-ready .flag-wind,
    .webgl-ready .flag-particles span {
      animation: none;
    }
    .flag-panel {
      position: absolute;
      inset: 0;
      overflow: hidden;
      filter: saturate(1.2) contrast(1.08);
      transform-style: preserve-3d;
      backface-visibility: hidden;
    }
    .flag-panel::before,
    .flag-panel::after {
      content: "";
      position: absolute;
      inset: -12%;
      z-index: 2;
      pointer-events: none;
    }
    .flag-panel::before {
      background:
        repeating-linear-gradient(103deg, rgba(255, 255, 255, 0.28) 0 16px, rgba(255, 255, 255, 0.04) 18px 50px, rgba(0, 0, 0, 0.22) 52px 80px),
        radial-gradient(circle at 28% 22%, rgba(255, 255, 255, 0.42), transparent 36%);
      mix-blend-mode: overlay;
      animation: flagSpecular 6.2s ease-in-out infinite;
    }
    .flag-panel::after {
      background:
        linear-gradient(115deg, transparent 0 34%, rgba(255, 255, 255, 0.32) 43%, transparent 54%),
        radial-gradient(circle at 70% 65%, rgba(0, 0, 0, 0.38), transparent 44%);
      mix-blend-mode: soft-light;
      animation: flagGlow 8s ease-in-out infinite;
    }
    .flag-panel-south {
      clip-path: polygon(0 0, var(--split) 0, calc(var(--split) - 18%) 100%, 0 100%);
      z-index: 2;
      transform: translate3d(calc(var(--mx) * -0.18), calc(var(--my) * -0.12), 42px) rotateY(-7deg) rotateX(2deg);
    }
    .flag-panel-north {
      clip-path: polygon(var(--split) 0, 100% 0, 100% 100%, calc(var(--split) - 18%) 100%);
      z-index: 1;
      filter: saturate(1.12) contrast(1.12) brightness(0.86);
      transform: translate3d(calc(var(--mx) * 0.24), calc(var(--my) * 0.16), -28px) rotateY(9deg) rotateX(-2deg);
    }
    .flag-art {
      display: block;
      width: 110%;
      height: 110%;
      transform-origin: center;
      animation: flagSway 5.8s ease-in-out infinite, flagBreath 3.4s ease-in-out infinite;
      will-change: transform, filter;
    }
    .flag-panel-north .flag-art {
      animation-delay: -1.6s;
    }
    .flag-shine {
      position: absolute;
      inset: -15%;
      z-index: 3;
      background:
        linear-gradient(100deg, transparent 8%, rgba(255, 255, 255, 0.34) 23%, transparent 38%, rgba(255, 255, 255, 0.16) 56%, transparent 72%);
      mix-blend-mode: screen;
      animation: flagSweep 5s ease-in-out infinite;
      pointer-events: none;
    }
    .flag-wind {
      position: absolute;
      z-index: 3;
      inset: -20%;
      pointer-events: none;
      opacity: 0.55;
      mix-blend-mode: screen;
      background:
        repeating-linear-gradient(112deg, transparent 0 32px, rgba(255, 255, 255, 0.18) 34px 38px, transparent 42px 96px);
      filter: blur(0.3px);
      animation: flagWind 7.5s linear infinite;
    }
    .wind-two {
      opacity: 0.28;
      transform: rotate(-8deg);
      animation-duration: 11s;
      animation-direction: reverse;
      background:
        repeating-linear-gradient(74deg, transparent 0 42px, rgba(255, 211, 106, 0.2) 44px 48px, transparent 52px 112px);
    }
    .flag-particles {
      position: absolute;
      inset: 0;
      z-index: 5;
      pointer-events: none;
      overflow: hidden;
    }
    .flag-particles span {
      position: absolute;
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: #ffd36a;
      box-shadow: 0 0 18px rgba(255, 211, 106, 0.82);
      opacity: 0;
      animation: flagSpark 4.8s ease-in-out infinite;
    }
    .flag-particles span:nth-child(1) { left: calc(var(--split) - 12%); top: 18%; animation-delay: -0.2s; }
    .flag-particles span:nth-child(2) { left: calc(var(--split) - 5%); top: 34%; animation-delay: -1s; }
    .flag-particles span:nth-child(3) { left: calc(var(--split) - 15%); top: 56%; animation-delay: -1.8s; }
    .flag-particles span:nth-child(4) { left: calc(var(--split) + 1%); top: 70%; animation-delay: -2.4s; }
    .flag-particles span:nth-child(5) { left: calc(var(--split) - 10%); top: 82%; animation-delay: -3.2s; }
    .flag-particles span:nth-child(6) { left: calc(var(--split) - 2%); top: 47%; animation-delay: -4s; }
    .flag-divider {
      position: absolute;
      top: -20%;
      bottom: -20%;
      left: calc(var(--split) - 9%);
      z-index: 4;
      width: 7px;
      transform: rotate(10deg);
      transform-origin: center;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0), #fff, #ffd36a, rgba(255, 255, 255, 0));
      box-shadow: 0 0 36px rgba(255, 211, 106, 0.9), 0 0 96px rgba(255, 255, 255, 0.38);
      pointer-events: none;
    }
    .flag-divider span {
      position: absolute;
      top: 42%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-10deg);
      padding: 7px 9px;
      border: 2px solid rgba(255, 255, 255, 0.82);
      background: rgba(0, 4, 3, 0.84);
      color: #ffd36a;
      font-size: 11px;
      font-weight: 950;
      letter-spacing: 0.12em;
    }
    .flag-scoreboard,
    .flag-humor {
      position: absolute;
      z-index: 4;
      left: 50%;
      width: min(calc(100% - 36px), 760px);
      transform: translateX(-50%);
    }
    .flag-scoreboard {
      bottom: 76px;
      display: flex;
      justify-content: center;
      gap: 10px;
      pointer-events: none;
    }
    .flag-scoreboard span {
      border: 1px solid rgba(255, 255, 255, 0.32);
      background: rgba(0, 10, 7, 0.68);
      color: white;
      padding: 8px 11px;
      font-size: 12px;
      font-weight: 850;
      backdrop-filter: blur(10px);
    }
    .flag-scoreboard strong { color: #ffd36a; }
    .flag-reticle {
      position: absolute;
      z-index: 5;
      left: calc(var(--cursor-x, 50%));
      top: calc(var(--cursor-y, 50%));
      width: 74px;
      height: 74px;
      transform: translate(-50%, -50%);
      border: 1px solid rgba(255, 255, 255, 0.72);
      border-radius: 999px;
      box-shadow: 0 0 18px rgba(32, 242, 143, 0.4), inset 0 0 18px rgba(32, 242, 143, 0.16);
      pointer-events: none;
      opacity: 0.72;
      animation: reticlePulse 1.8s ease-in-out infinite;
    }
    .flag-reticle::before,
    .flag-reticle::after {
      content: "";
      position: absolute;
      inset: 50% auto auto 50%;
      width: 108px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.75), transparent);
      transform: translate(-50%, -50%);
    }
    .flag-reticle::after {
      width: 1px;
      height: 108px;
      background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.75), transparent);
    }
    .flag-reticle span {
      position: absolute;
      inset: 31px;
      border-radius: 999px;
      background: #ffffff;
      box-shadow: 0 0 14px rgba(255, 255, 255, 0.9), 0 0 32px rgba(32, 242, 143, 0.65);
    }
    .flag-humor {
      bottom: 8px;
      margin: 0;
      color: rgba(255, 255, 255, 0.86);
      font-size: 12px;
      line-height: 1.25;
      font-weight: 760;
      pointer-events: none;
      text-wrap: balance;
    }
    .fraud-bonk {
      width: min(100%, 700px);
      margin-top: 20px;
      border: 2px solid var(--ink);
      background: rgba(4, 19, 15, 0.88);
      box-shadow: 6px 6px 0 rgba(32, 242, 143, 0.92), 0 0 34px rgba(32, 242, 143, 0.16);
      overflow: hidden;
    }
    .bonk-stage {
      position: relative;
      min-height: 230px;
      background:
        radial-gradient(circle at 30% 22%, rgba(32, 242, 143, 0.12), transparent 36%),
        linear-gradient(90deg, rgba(32, 242, 143, 0.08) 1px, transparent 1px),
        linear-gradient(rgba(32, 242, 143, 0.06) 1px, transparent 1px),
        #020b08;
      background-size: 24px 24px;
      overflow: hidden;
    }
    .bonk-webgl {
      position: absolute;
      inset: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      display: block;
      opacity: 0;
      transition: opacity 240ms ease;
    }
    .bonk-stage svg {
      position: relative;
      z-index: 2;
      display: block;
      width: 100%;
      height: auto;
    }
    .webgl-ready .bonk-webgl { opacity: 1; }
    .webgl-ready .bonk-stage svg {
      opacity: 0.08;
      filter: blur(0.6px);
    }
    .webgl-ready .bonk-glove,
    .webgl-ready .fake-stack,
    .webgl-ready .proxy-laptop,
    .webgl-ready .bonk-burst,
    .webgl-ready .bonk-speedlines path {
      animation: none;
    }
    .bonk-glove {
      transform-origin: 250px 170px;
      animation: bonkGlove 2.7s cubic-bezier(0.5, 0, 0.2, 1) infinite;
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
    .bonk-speedlines path {
      fill: none;
      stroke: #20f28f;
      stroke-width: 7px;
      stroke-linecap: round;
      opacity: 0;
      animation: bonkLines 2.7s ease-in-out infinite;
    }
    .bonk-copy {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 14px;
      border-top: 2px solid var(--ink);
      background: #000403;
      text-align: left;
    }
    .bonk-copy strong {
      color: var(--danger);
      font-weight: 950;
      max-width: 150px;
      line-height: 1.05;
    }
    .bonk-copy span {
      color: var(--muted);
      font-weight: 750;
      max-width: 460px;
      line-height: 1.25;
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
      box-shadow: 4px 4px 0 rgba(32, 242, 143, 0.82);
      transition: transform 150ms ease, box-shadow 150ms ease, background 150ms ease;
    }
    .button:hover {
      transform: translate(-1px, -1px);
      box-shadow: 6px 6px 0 rgba(32, 242, 143, 0.78), 0 0 26px rgba(32, 242, 143, 0.16);
    }
    .button.primary { background: var(--accent); color: #00150d; }
    .button.secondary { background: #000403; color: var(--ink); }
    .button.danger { background: #2b1111; color: white; border-color: rgba(255, 49, 88, 0.68); }
    @keyframes bonkGlove {
      0%, 46%, 100% { transform: translateX(-58px) translateY(3px) rotate(-4deg); }
      56% { transform: translateX(92px) translateY(-2px) rotate(0deg) scale(1.02); }
      66% { transform: translateX(36px) translateY(5px) rotate(-7deg); }
    }
    @keyframes fakeWobble {
      0%, 52%, 100% { transform: rotate(0deg) translate(0, 0); }
      58% { transform: rotate(5deg) translate(18px, -3px); }
      66% { transform: rotate(-2.5deg) translate(-8px, 2px); }
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
    @keyframes bonkLines {
      0%, 44%, 76%, 100% { opacity: 0; transform: translateX(-18px); }
      54%, 64% { opacity: 0.65; transform: translateX(10px); }
    }
    @keyframes flagSway {
      0%, 100% { transform: translate3d(-2.2%, -1.2%, 0) skewX(-1.5deg) scale(1.04); }
      25% { transform: translate3d(-0.2%, 1.4%, 0) skewX(1.8deg) scale(1.065); }
      50% { transform: translate3d(1.8%, -0.6%, 0) skewX(-0.8deg) scale(1.045); }
      75% { transform: translate3d(0.4%, 1.2%, 0) skewX(1.3deg) scale(1.06); }
    }
    @keyframes flagBreath {
      0%, 100% { filter: drop-shadow(0 20px 28px rgba(0, 0, 0, 0.18)); }
      50% { filter: drop-shadow(0 34px 46px rgba(0, 0, 0, 0.3)); }
    }
    @keyframes flagSpecular {
      0%, 100% { transform: translateX(-8%) rotate(-1deg); opacity: 0.72; }
      45% { transform: translateX(7%) rotate(1deg); opacity: 0.96; }
      70% { transform: translateX(2%) rotate(-0.6deg); opacity: 0.78; }
    }
    @keyframes flagGlow {
      0%, 100% { transform: translateX(4%) translateY(-2%); opacity: 0.76; }
      50% { transform: translateX(-5%) translateY(2%); opacity: 1; }
    }
    @keyframes flagSweep {
      0%, 100% { transform: translateX(-18%) skewX(-8deg); opacity: 0.26; }
      45% { transform: translateX(18%) skewX(-8deg); opacity: 0.58; }
      70% { transform: translateX(2%) skewX(-8deg); opacity: 0.34; }
    }
    @keyframes flagWind {
      0% { transform: translateX(-12%) translateY(4%) rotate(0deg); }
      100% { transform: translateX(12%) translateY(-4%) rotate(0deg); }
    }
    @keyframes flagSpark {
      0%, 100% { opacity: 0; transform: translate3d(-18px, 24px, 0) scale(0.5); }
      22%, 56% { opacity: 1; }
      70% { opacity: 0; transform: translate3d(44px, -58px, 0) scale(1.25); }
    }
    @keyframes reticlePulse {
      0%, 100% { transform: translate(-50%, -50%) scale(0.92); opacity: 0.52; }
      50% { transform: translate(-50%, -50%) scale(1.04); opacity: 0.86; }
    }
    @keyframes visualFloat {
      0%, 100% { translate: 0 0 0; filter: drop-shadow(0 18px 28px rgba(0, 0, 0, 0.32)); }
      50% { translate: 0 -8px 18px; filter: drop-shadow(0 28px 44px rgba(32, 242, 143, 0.16)); }
    }
    @keyframes earthSpin {
      0% { transform: translateZ(42px) rotateX(-18deg) rotateY(0deg); }
      100% { transform: translateZ(42px) rotateX(-18deg) rotateY(360deg); }
    }
    @keyframes threatBlink {
      0%, 100% { opacity: 0.58; transform: scale(0.86); }
      50% { opacity: 1; transform: scale(1.18); }
    }
    @keyframes orbitOne {
      0% { transform: translate(-50%, -50%) translateZ(28px) rotateZ(-18deg) rotateY(0deg); }
      100% { transform: translate(-50%, -50%) translateZ(28px) rotateZ(-18deg) rotateY(360deg); }
    }
    @keyframes orbitTwo {
      0% { transform: translate(-50%, -50%) translateZ(14px) rotateZ(48deg) rotateY(0deg); }
      100% { transform: translate(-50%, -50%) translateZ(14px) rotateZ(48deg) rotateY(360deg); }
    }
    @keyframes sectionScan {
      0%, 100% { opacity: 0.2; transform: translateX(-142px) rotate(30deg); }
      45%, 58% { opacity: 0.92; transform: translateX(142px) rotate(30deg); }
    }
    @keyframes dotOrbit {
      0%, 100% { opacity: 0.34; filter: blur(0); }
      40% { opacity: 1; filter: blur(0.2px); }
      70% { opacity: 0.5; transform: translate(0, 0) scale(0.7); }
    }
    @keyframes radarSweep {
      0% { transform: translateX(-50%) translateZ(58px) rotateX(18deg) rotateZ(0deg); }
      100% { transform: translateX(-50%) translateZ(58px) rotateX(18deg) rotateZ(360deg); }
    }
    @keyframes tunnelPulse {
      0%, 100% { opacity: 0.42; filter: drop-shadow(0 0 8px rgba(32, 242, 143, 0.16)); }
      50% { opacity: 0.92; filter: drop-shadow(0 0 20px rgba(32, 242, 143, 0.42)); }
    }
    @keyframes dialSpin {
      0% { rotate: 0deg; }
      100% { rotate: 360deg; }
    }
    @keyframes reportFloat {
      0%, 100% { translate: 0 0; }
      50% { translate: 0 -10px; }
    }
    @keyframes cubeFloat {
      0%, 100% { translate: 0 0 0; }
      50% { translate: 0 -9px 18px; }
    }
    @keyframes scannerBeam {
      0%, 100% { translate: 0 -44px; opacity: 0.38; }
      50% { translate: 0 44px; opacity: 1; }
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
      background: rgba(4, 19, 15, 0.82);
      padding: 10px 12px;
      color: var(--muted);
      font-weight: 750;
      box-shadow: inset 0 0 22px rgba(32, 242, 143, 0.04);
    }
    .stat-row strong { color: var(--ink); }
    .trust-band, .tool-grid, .workflow, .report-section, .cases-section, .sources-section {
      padding: clamp(52px, 7vw, 88px) clamp(18px, 5vw, 72px);
      border-bottom: 1px solid var(--line);
    }
    .trust-band {
      background:
        radial-gradient(circle at 12% 18%, rgba(32, 242, 143, 0.16), transparent 36%),
        linear-gradient(135deg, #000403, #04130f 58%, #020806);
      color: var(--ink);
    }
    .trust-band .section-head, .tool-grid, .workflow, .report-section, .cases-section, .sources-section, .admin-main {
      width: min(100%, 1120px);
      margin: 0 auto;
    }
    .trust-band {
      display: grid;
      grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.1fr);
      align-items: start;
      gap: clamp(22px, 4vw, 52px);
    }
    .trust-band .section-head {
      width: auto;
      margin: 0;
    }
    .trust-band h2 {
      font-size: clamp(30px, 4vw, 54px);
      line-height: 1.04;
    }
    .trust-band h2 { color: var(--ink); }
    .trust-band p { color: #b8e7d5; }
    .trust-band .eyebrow { color: #ffd36a; }
    .trust-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
      margin-top: 0;
    }
    .trust-grid article {
      border: 1px solid rgba(32, 242, 143, 0.24);
      background: rgba(0, 4, 3, 0.42);
      padding: 18px;
      box-shadow: inset 0 0 34px rgba(32, 242, 143, 0.05);
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
    .section-head h2 {
      text-wrap: balance;
    }
    .section-head > p:not(.eyebrow) {
      max-width: 780px;
      text-wrap: pretty;
    }
    .section-visual {
      width: min(100%, 440px);
      min-height: 190px;
      margin-top: 22px;
      border: 1px solid rgba(32, 242, 143, 0.24);
      background:
        radial-gradient(circle at 50% 44%, rgba(32, 242, 143, 0.14), transparent 42%),
        linear-gradient(135deg, rgba(4, 19, 15, 0.86), rgba(0, 4, 3, 0.92));
      overflow: hidden;
      position: relative;
      box-shadow: inset 0 0 36px rgba(32, 242, 143, 0.06), 0 18px 44px rgba(0, 0, 0, 0.22);
    }
    .section-webgl {
      position: absolute;
      inset: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      display: block;
      opacity: 0;
      transition: opacity 240ms ease;
    }
    .webgl-ready .section-webgl { opacity: 1; }
    .trust-band .section-visual {
      width: min(100%, 520px);
      min-height: 220px;
      background:
        radial-gradient(circle at 50% 42%, rgba(32, 242, 143, 0.22), transparent 44%),
        linear-gradient(135deg, rgba(0, 4, 3, 0.68), rgba(4, 19, 15, 0.94));
    }
    .visual-stage {
      position: absolute;
      inset: 16px;
      z-index: 2;
      display: grid;
      place-items: center;
      perspective: 760px;
      transform-style: preserve-3d;
      transition: opacity 240ms ease;
    }
    .webgl-ready .visual-stage { opacity: 0.12; }
    .webgl-ready .micro-label { opacity: 1; }
    .webgl-ready .visual-object,
    .webgl-ready .earth-shell,
    .webgl-ready .threat-node,
    .webgl-ready .shield-ring,
    .webgl-ready .radar-sweep,
    .webgl-ready .tunnel-ring,
    .webgl-ready .vault-dial,
    .webgl-ready .report-card,
    .webgl-ready .scan-beam,
    .webgl-ready .source-node {
      animation: none;
    }
    .visual-object {
      position: relative;
      width: 270px;
      height: 150px;
      transform-style: preserve-3d;
      transform: rotateX(58deg) rotateZ(-18deg);
      animation: visualFloat 5.5s ease-in-out infinite;
    }
    .section-visual-radar .visual-object { transform: rotateX(62deg) rotateZ(-28deg); }
    .section-visual-workflow .visual-object { transform: rotateX(64deg) rotateZ(-9deg); }
    .section-visual-queue .visual-object { transform: rotateX(58deg) rotateZ(15deg); }
    .section-visual-watchlist .visual-object { transform: rotateX(54deg) rotateZ(-23deg); }
    .section-visual-sources .visual-object { transform: rotateX(65deg) rotateZ(34deg); }
    .earth-shell {
      position: relative;
      display: block;
      margin: 14px auto 0;
      width: 118px;
      height: 118px;
      border-radius: 999px;
      background:
        radial-gradient(circle at 34% 30%, rgba(255, 255, 255, 0.78), transparent 10%),
        radial-gradient(circle at 62% 70%, rgba(0, 4, 3, 0.38), transparent 30%),
        linear-gradient(125deg, #0b7cff, #18d99b 46%, #0a5bff);
      border: 1px solid rgba(255, 255, 255, 0.62);
      box-shadow: 0 0 34px rgba(32, 242, 143, 0.38), inset -18px -18px 30px rgba(0, 4, 3, 0.36);
      transform: translateZ(42px) rotateX(-18deg);
      animation: earthSpin 8.8s linear infinite;
      overflow: hidden;
    }
    .continent {
      position: absolute;
      display: block;
      border-radius: 55% 45% 50% 46%;
      background: rgba(200, 255, 93, 0.88);
      box-shadow: 0 0 12px rgba(200, 255, 93, 0.32);
    }
    .continent-one { width: 42px; height: 22px; left: 22px; top: 28px; transform: rotate(-18deg); }
    .continent-two { width: 32px; height: 28px; right: 22px; top: 48px; transform: rotate(28deg); }
    .continent-three { width: 46px; height: 20px; left: 36px; bottom: 24px; transform: rotate(13deg); }
    .threat-node {
      position: absolute;
      right: 31px;
      top: 42px;
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: var(--danger);
      box-shadow: 0 0 0 4px rgba(255, 49, 88, 0.18), 0 0 20px rgba(255, 49, 88, 0.82);
      animation: threatBlink 1.8s ease-in-out infinite;
    }
    .shield-ring {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 210px;
      height: 78px;
      border: 1px solid rgba(255, 255, 255, 0.66);
      border-radius: 999px;
      box-shadow: 0 0 22px rgba(32, 242, 143, 0.28);
    }
    .ring-one { transform: translate(-50%, -50%) translateZ(28px) rotateZ(-18deg); animation: orbitOne 5.7s linear infinite; }
    .ring-two { width: 250px; height: 92px; transform: translate(-50%, -50%) translateZ(14px) rotateZ(48deg); border-color: rgba(200, 255, 93, 0.48); animation: orbitTwo 7.4s linear infinite reverse; }
    .shield-plate {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 86px;
      height: 56px;
      border: 1px solid rgba(32, 242, 143, 0.78);
      background: rgba(32, 242, 143, 0.09);
      transform: translate(-50%, -50%) translateZ(70px) rotateZ(22deg) skewX(-10deg);
      box-shadow: 0 0 22px rgba(32, 242, 143, 0.32);
    }
    .plate-two { transform: translate(-38%, -28%) translateZ(86px) rotateZ(-18deg) skewX(12deg); opacity: 0.7; }
    .radar-base {
      position: absolute;
      left: 50%;
      bottom: 12px;
      width: 156px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0b3226, #020b08);
      border: 1px solid rgba(32, 242, 143, 0.52);
      transform: translateX(-50%) translateZ(0);
      box-shadow: 0 22px 34px rgba(0, 0, 0, 0.35);
    }
    .radar-dish {
      position: absolute;
      left: 50%;
      top: 22px;
      width: 168px;
      height: 104px;
      border-radius: 50% 50% 46% 46%;
      border: 2px solid rgba(234, 255, 246, 0.68);
      background: radial-gradient(circle at 50% 30%, rgba(32, 242, 143, 0.25), rgba(2, 11, 8, 0.22) 58%, rgba(0, 4, 3, 0.78));
      transform: translateX(-50%) translateZ(44px) rotateX(18deg);
      box-shadow: inset 0 -22px 34px rgba(0, 0, 0, 0.34), 0 0 38px rgba(32, 242, 143, 0.18);
    }
    .radar-sweep {
      position: absolute;
      left: 50%;
      top: 22px;
      width: 170px;
      height: 104px;
      border-radius: 50%;
      background: conic-gradient(from 80deg, rgba(32, 242, 143, 0.55), transparent 34%);
      transform: translateX(-50%) translateZ(58px) rotateX(18deg);
      animation: radarSweep 2.6s linear infinite;
      opacity: 0.82;
    }
    .radar-blip {
      position: absolute;
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: #ffffff;
      box-shadow: 0 0 18px rgba(255, 255, 255, 0.9), 0 0 26px rgba(32, 242, 143, 0.8);
      transform: translateZ(82px);
      animation: threatBlink 2s ease-in-out infinite;
    }
    .blip-one { left: 88px; top: 48px; }
    .blip-two { right: 82px; top: 76px; animation-delay: -0.6s; }
    .blip-three { left: 132px; bottom: 44px; animation-delay: -1.2s; }
    .tunnel-ring {
      position: absolute;
      left: 50%;
      top: 50%;
      border: 2px solid rgba(32, 242, 143, 0.55);
      border-radius: 14px;
      transform: translate(-50%, -50%) translateZ(20px) rotateZ(45deg);
      box-shadow: 0 0 24px rgba(32, 242, 143, 0.14);
      animation: tunnelPulse 3.8s ease-in-out infinite;
    }
    .tunnel-one { width: 220px; height: 120px; }
    .tunnel-two { width: 160px; height: 86px; transform: translate(-50%, -50%) translateZ(70px) rotateZ(45deg); animation-delay: -1s; }
    .tunnel-three { width: 94px; height: 52px; transform: translate(-50%, -50%) translateZ(120px) rotateZ(45deg); animation-delay: -2s; }
    .gate-card {
      position: absolute;
      display: grid;
      place-items: center;
      width: 58px;
      height: 36px;
      border: 1px solid rgba(234, 255, 246, 0.68);
      background: rgba(0, 4, 3, 0.82);
      color: var(--accent);
      font-size: 12px;
      font-weight: 950;
      transform: translateZ(150px);
      box-shadow: 0 0 20px rgba(32, 242, 143, 0.16);
    }
    .gate-one { left: 24px; top: 16px; }
    .gate-two { right: 22px; top: 54px; }
    .gate-three { left: 104px; bottom: 8px; }
    .vault-body {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 156px;
      height: 116px;
      border: 2px solid rgba(234, 255, 246, 0.72);
      border-radius: 18px;
      background: linear-gradient(145deg, #082c22, #020b08 70%);
      transform: translate(-50%, -50%) translateZ(58px);
      box-shadow: inset -18px -22px 34px rgba(0, 0, 0, 0.42), 0 0 34px rgba(32, 242, 143, 0.18);
    }
    .vault-dial {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 52px;
      height: 52px;
      border-radius: 999px;
      border: 2px solid var(--accent);
      transform: translate(-50%, -50%);
      box-shadow: 0 0 18px rgba(32, 242, 143, 0.4);
      animation: dialSpin 5.2s linear infinite;
    }
    .vault-dial::after {
      content: "";
      position: absolute;
      left: 50%;
      top: 2px;
      width: 3px;
      height: 20px;
      background: var(--accent);
    }
    .vault-slot {
      position: absolute;
      left: 30px;
      right: 30px;
      bottom: 18px;
      height: 6px;
      background: rgba(234, 255, 246, 0.68);
    }
    .sealed-report {
      position: absolute;
      width: 82px;
      height: 50px;
      border: 1px solid rgba(234, 255, 246, 0.62);
      background: linear-gradient(135deg, rgba(234, 255, 246, 0.16), rgba(32, 242, 143, 0.08));
      transform: translateZ(20px);
      animation: reportFloat 4.8s ease-in-out infinite;
    }
    .report-one { left: 10px; top: 22px; transform: translateZ(28px) rotateZ(-12deg); }
    .report-two { right: 18px; top: 14px; transform: translateZ(18px) rotateZ(16deg); animation-delay: -1s; }
    .report-three { right: 52px; bottom: 0; transform: translateZ(96px) rotateZ(-4deg); animation-delay: -2s; }
    .photo-cube {
      position: absolute;
      width: 72px;
      height: 86px;
      border: 1px solid rgba(234, 255, 246, 0.62);
      background:
        radial-gradient(circle at 50% 28%, rgba(234, 255, 246, 0.62), transparent 14%),
        linear-gradient(160deg, rgba(32, 242, 143, 0.14), rgba(0, 4, 3, 0.92));
      transform: translateZ(58px) rotateY(-18deg);
      box-shadow: 12px 14px 0 rgba(0, 0, 0, 0.26), 0 0 24px rgba(32, 242, 143, 0.12);
      animation: cubeFloat 4.2s ease-in-out infinite;
    }
    .cube-one { left: 38px; top: 28px; }
    .cube-two { left: 106px; top: 18px; transform: translateZ(92px) rotateY(18deg); animation-delay: -1s; }
    .cube-three { right: 42px; top: 36px; transform: translateZ(44px) rotateY(-8deg); animation-delay: -2s; }
    .scanner-beam {
      position: absolute;
      left: 24px;
      right: 24px;
      top: 62px;
      height: 3px;
      background: #ffffff;
      box-shadow: 0 0 18px rgba(255, 255, 255, 0.9), 0 0 34px rgba(32, 242, 143, 0.74);
      transform: translateZ(130px);
      animation: scannerBeam 2.4s ease-in-out infinite;
    }
    .scanner-frame {
      position: absolute;
      inset: 12px 20px;
      border: 2px solid rgba(32, 242, 143, 0.55);
      transform: translateZ(118px);
    }
    .source-core {
      position: absolute;
      left: 50%;
      top: 50%;
      display: grid;
      place-items: center;
      width: 76px;
      height: 76px;
      border-radius: 20px;
      border: 1px solid rgba(234, 255, 246, 0.7);
      background: linear-gradient(135deg, #073325, #000403);
      color: var(--accent);
      font-size: 14px;
      font-weight: 950;
      transform: translate(-50%, -50%) translateZ(80px) rotateZ(-34deg);
      box-shadow: 0 0 26px rgba(32, 242, 143, 0.2);
    }
    .source-orbit {
      position: absolute;
      left: 50%;
      top: 50%;
      border: 1px solid rgba(32, 242, 143, 0.5);
      border-radius: 999px;
      transform: translate(-50%, -50%) translateZ(30px);
      animation: orbitOne 6s linear infinite;
    }
    .source-orbit-one { width: 220px; height: 76px; }
    .source-orbit-two { width: 156px; height: 132px; animation-direction: reverse; }
    .source-node {
      position: absolute;
      width: 22px;
      height: 22px;
      border-radius: 999px;
      background: #ffffff;
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.88), 0 0 30px rgba(32, 242, 143, 0.68);
      transform: translateZ(122px);
    }
    .source-one { left: 40px; top: 28px; }
    .source-two { right: 34px; top: 64px; }
    .source-three { left: 128px; bottom: 20px; }
    .scan-line {
      position: absolute;
      width: 1px;
      height: 170px;
      background: linear-gradient(transparent, rgba(32, 242, 143, 0.88), transparent);
      box-shadow: 0 0 18px rgba(32, 242, 143, 0.72);
      transform: rotate(30deg);
      animation: sectionScan 4.2s ease-in-out infinite;
    }
    .micro-dot {
      position: absolute;
      width: 5px;
      height: 5px;
      border-radius: 999px;
      background: #ffffff;
      box-shadow: 0 0 12px rgba(255, 255, 255, 0.9), 0 0 20px rgba(32, 242, 143, 0.72);
      animation: dotOrbit 5.2s ease-in-out infinite;
    }
    .dot-one { transform: translate(-132px, -48px); animation-delay: -0.2s; }
    .dot-two { transform: translate(138px, -36px); animation-delay: -1s; }
    .dot-three { transform: translate(108px, 64px); animation-delay: -1.8s; }
    .dot-four { transform: translate(-106px, 72px); animation-delay: -2.6s; }
    .dot-five { transform: translate(0, -96px); animation-delay: -3.4s; }
    .dot-six { transform: translate(-10px, 100px); animation-delay: -4.2s; }
    .micro-label {
      position: absolute;
      left: 14px;
      bottom: 12px;
      max-width: calc(100% - 28px);
      color: rgba(234, 255, 246, 0.72);
      font-size: 11px;
      font-weight: 850;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      line-height: 1.25;
    }
    .section-visual-queue .ring-one { border-color: rgba(255, 49, 88, 0.42); }
    .section-visual-watchlist .scan-line { background: linear-gradient(transparent, rgba(255, 211, 106, 0.92), transparent); }
    .questionnaire {
      grid-area: questions;
      display: grid;
      gap: 14px;
    }
    fieldset {
      margin: 0;
      padding: 0;
      border: 1px solid var(--line);
      background: rgba(4, 19, 15, 0.82);
      box-shadow: inset 0 0 28px rgba(32, 242, 143, 0.035);
    }
    legend {
      display: grid;
      gap: 4px;
      padding: 12px 14px;
      width: 100%;
      border-bottom: 1px solid var(--line);
      background: rgba(32, 242, 143, 0.07);
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
      border-bottom: 1px solid rgba(32, 242, 143, 0.11);
      cursor: pointer;
      transition: background 140ms ease, border-color 140ms ease;
    }
    .signal:hover { background: rgba(32, 242, 143, 0.055); }
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
      background: conic-gradient(var(--accent) calc(var(--score) * 1%), #10251e 0);
      border: 2px solid var(--ink);
      box-shadow: 0 0 28px rgba(32, 242, 143, 0.16);
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
      background: rgba(4, 19, 15, 0.82);
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
      border: 1px solid rgba(32, 242, 143, 0.18);
      background: rgba(0, 4, 3, 0.56);
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
      box-shadow: inset 0 0 30px rgba(32, 242, 143, 0.035);
    }
    .steps h3, .case-card h3, .source-card h3 {
      text-wrap: balance;
    }
    .steps p, .case-card p, .source-card p {
      text-wrap: pretty;
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
      border-bottom: 1px solid rgba(32, 242, 143, 0.12);
      font-weight: 700;
      color: var(--muted);
    }
    .mini-check:nth-child(odd) { border-right: 1px solid rgba(32, 242, 143, 0.12); }
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
      background: rgba(4, 19, 15, 0.82);
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
    .watch-card {
      grid-template-columns: minmax(220px, 300px) minmax(0, 1fr);
      column-gap: 18px;
      align-items: start;
    }
    .watch-card .photo-strip {
      grid-row: 1 / span 7;
      grid-template-columns: repeat(auto-fit, minmax(82px, 1fr));
      max-height: 420px;
      overflow: auto;
      align-content: start;
      padding-right: 2px;
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
      background: rgba(0, 4, 3, 0.68);
      overflow: hidden;
    }
    .photo-tile img {
      display: block;
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      background: #020b08;
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
      background: rgba(0, 4, 3, 0.54);
    }
    .case-meta {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      color: var(--muted);
      font-size: 12px;
      font-weight: 850;
      text-transform: uppercase;
      line-height: 1.35;
    }
    details {
      border: 1px solid var(--line);
      background: rgba(0, 4, 3, 0.56);
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
      background: rgba(32, 242, 143, 0.08);
      font-weight: 850;
    }
    .case-links a {
      color: var(--blue);
      font-weight: 850;
    }
    .source-card {
      display: grid;
      gap: 8px;
      text-decoration: none;
      color: var(--ink);
      font-weight: 850;
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
      flex-shrink: 0;
      padding: 24px clamp(18px, 5vw, 72px);
      color: var(--muted);
      background: var(--panel);
    }
    .footer-inner {
      width: min(100%, 1120px);
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      gap: 14px;
    }
    .admin-main { padding: 48px clamp(18px, 5vw, 72px); }
    .logout-form { margin-bottom: 16px; }
    .admin-login { max-width: 520px; }
    .empty { color: var(--muted); }
    .page-main {
      width: min(100%, 1120px);
      margin: 0 auto;
      padding: clamp(48px, 7vw, 88px) clamp(18px, 5vw, 72px);
      position: relative;
      isolation: isolate;
      overflow: hidden;
    }
    .page-main > :not(.page-webgl) {
      position: relative;
      z-index: 1;
    }
    .page-webgl {
      position: absolute;
      inset: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
      display: block;
      opacity: 0;
      pointer-events: none;
      transition: opacity 240ms ease;
    }
    .webgl-ready .page-webgl { opacity: 0.42; }
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
    .hero h1 {
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      font-size: clamp(62px, 12vw, 148px);
      font-weight: 950;
      line-height: 0.82;
      text-transform: uppercase;
      text-shadow: 0 0 28px rgba(32, 242, 143, 0.28), 2px 0 rgba(56, 213, 255, 0.28), -2px 0 rgba(255, 49, 88, 0.18);
    }
    .loader-core strong,
    .page-main h1,
    .assessment-page h1,
    .watchlist-page h1,
    .report-page h1,
    .admin-main h1,
    .admin-shell h1 {
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      font-weight: 950;
      letter-spacing: 0;
    }
    .assessment-page,
    .watchlist-page,
    .report-page {
      width: min(100%, 1240px);
      margin: 0 auto;
      padding: clamp(42px, 6vw, 76px) clamp(18px, 5vw, 58px);
    }
    .assessment-hero,
    .dossier-head,
    .report-hero {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(320px, 460px);
      align-items: center;
      gap: clamp(22px, 4vw, 54px);
      max-width: none;
      margin-bottom: 22px;
      padding-bottom: 18px;
      border-bottom: 1px solid var(--line);
    }
    .assessment-hero h1,
    .dossier-head h1,
    .report-hero h1 {
      max-width: 860px;
      margin-bottom: 14px;
      font-size: clamp(44px, 6vw, 86px);
      line-height: 0.9;
    }
    .assessment-page .assessment-hero {
      align-items: end;
    }
    .assessment-page .assessment-hero h1 {
      max-width: 760px;
      font-size: clamp(34px, 4.2vw, 62px);
      line-height: 0.92;
    }
    .system-note,
    .policy-strip,
    .private-badge {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    }
    .system-note {
      max-width: 820px;
      color: var(--gold);
      font-size: 13px;
      font-weight: 850;
      text-transform: uppercase;
    }
    .policy-strip {
      display: grid;
      gap: 8px;
      margin: 0 0 18px;
      padding: 14px 16px;
      border: 1px solid rgba(32, 242, 143, 0.28);
      border-left: 4px solid var(--accent);
      background: linear-gradient(135deg, rgba(4, 19, 15, 0.92), rgba(0, 4, 3, 0.84));
      box-shadow: inset 0 0 34px rgba(32, 242, 143, 0.04);
    }
    .policy-strip p,
    .policy-strip small {
      margin: 0;
      line-height: 1.5;
    }
    .policy-strip strong {
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .workbench-grid {
      width: 100%;
      margin: 0;
      padding: 0;
    }
    .dossier-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(300px, 360px);
      gap: 18px;
      align-items: start;
    }
    .dossier-side,
    .admin-review-panel,
    .admin-sidebar {
      border: 1px solid var(--line);
      background: rgba(3, 11, 8, 0.9);
      box-shadow: inset 0 0 36px rgba(32, 242, 143, 0.045), 0 22px 60px rgba(0, 0, 0, 0.28);
    }
    .dossier-side {
      position: sticky;
      top: 94px;
      padding: 18px;
    }
    .dossier-side h2,
    .admin-review-panel h2 {
      margin-bottom: 12px;
      font-size: 26px;
    }
    .dossier-side ul,
    .admin-review-panel ul {
      display: grid;
      gap: 10px;
      margin: 0 0 18px;
      padding-left: 18px;
      color: var(--muted);
      line-height: 1.45;
    }
    .private-badge {
      display: inline-flex;
      align-items: center;
      width: fit-content;
      min-height: 28px;
      padding: 6px 9px;
      border: 1px solid rgba(200, 255, 93, 0.42);
      color: var(--gold);
      background: rgba(200, 255, 93, 0.08);
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .dossier-list .case-card,
    .admin-report-card {
      position: relative;
      background: linear-gradient(135deg, rgba(3, 11, 8, 0.96), rgba(1, 7, 5, 0.94));
    }
    .dossier-list .case-card::before,
    .admin-report-card::before {
      content: "";
      position: absolute;
      inset: 0 auto 0 0;
      width: 3px;
      background: linear-gradient(var(--accent), var(--gold));
      box-shadow: 0 0 18px rgba(32, 242, 143, 0.52);
    }
    .report-page > .report-form {
      max-width: 980px;
      margin: 0 auto;
    }
    .topbar-logo {
      display: inline-grid;
      place-items: center;
      width: 38px;
      height: 38px;
      flex: 0 0 auto;
      filter: drop-shadow(0 0 14px rgba(32, 242, 143, 0.34));
    }
    .topbar-logo .brand-kimchi-logo {
      width: 38px;
      height: 38px;
    }
    .glass-card {
      border: 1px solid var(--line);
      background: rgba(3, 11, 8, 0.86);
      box-shadow: inset 0 0 36px rgba(32, 242, 143, 0.04), 0 22px 58px rgba(0, 0, 0, 0.28);
      backdrop-filter: blur(12px);
    }
    .report-workbench {
      width: min(100%, 1280px);
      display: grid;
      grid-template-columns: minmax(320px, 0.86fr) minmax(0, 1.14fr);
      gap: clamp(24px, 4vw, 58px);
      align-items: start;
      position: relative;
      isolation: isolate;
      overflow: hidden;
    }
    .report-workbench::before,
    .methodology-page::before,
    .protocol-page::before,
    .case-detail-page::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background:
        radial-gradient(circle at 70% 8%, rgba(32, 242, 143, 0.12), transparent 34%),
        linear-gradient(90deg, rgba(32, 242, 143, 0.045) 1px, transparent 1px),
        linear-gradient(rgba(32, 242, 143, 0.04) 1px, transparent 1px);
      background-size: auto, 38px 38px, 38px 38px;
      opacity: 0.86;
    }
    .report-workbench > *,
    .methodology-page > :not(.page-webgl),
    .protocol-page > :not(.page-webgl),
    .case-detail-page > :not(.page-webgl),
    .admin-login-screen > :not(.page-webgl),
    .admin-shell > :not(.page-webgl) {
      position: relative;
      z-index: 1;
    }
    .report-brief {
      position: sticky;
      top: 96px;
      display: grid;
      gap: 18px;
      align-self: start;
    }
    .report-brief h1,
    .methodology-hero h1,
    .protocol-head h1,
    .case-detail-head h1 {
      max-width: 900px;
      font-size: clamp(42px, 6vw, 82px);
      line-height: 0.9;
      letter-spacing: -0.035em;
    }
    .report-brief > p:not(.eyebrow),
    .methodology-hero > p,
    .protocol-head p {
      max-width: 680px;
      font-size: 18px;
      line-height: 1.55;
    }
    .report-assurance,
    .report-form-column .report-form,
    .method-content article,
    .method-intro,
    .protocol-checks article,
    .protocol-side article {
      border: 1px solid var(--line);
      background: rgba(3, 11, 8, 0.88);
      box-shadow: inset 0 0 34px rgba(32, 242, 143, 0.04);
    }
    .report-assurance {
      padding: 18px;
      border-left: 4px solid var(--accent);
    }
    .report-assurance strong {
      display: block;
      margin-bottom: 10px;
      color: var(--accent);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .report-assurance ul,
    .protocol-checks ul,
    .timeline-list ul {
      display: grid;
      gap: 10px;
      margin: 0;
      padding-left: 18px;
      color: var(--muted);
      line-height: 1.5;
    }
    .report-form-column {
      min-width: 0;
    }
    .report-form-column .report-form {
      padding: clamp(18px, 3vw, 28px);
    }
    .methodology-page,
    .protocol-page,
    .case-detail-page {
      width: min(100%, 1280px);
      min-height: calc(100svh - 64px);
    }
    .methodology-hero {
      min-height: 300px;
      display: grid;
      align-content: end;
      padding: clamp(32px, 5vw, 70px) 0;
      border-bottom: 1px solid var(--line);
    }
    .methodology-hero h1 span {
      color: rgba(234, 255, 246, 0.48);
    }
    .methodology-layout {
      display: grid;
      grid-template-columns: 240px minmax(0, 1fr);
      gap: clamp(24px, 4vw, 56px);
      padding-top: clamp(36px, 5vw, 70px);
    }
    .method-nav {
      position: sticky;
      top: 98px;
      align-self: start;
      display: grid;
      gap: 14px;
      padding: 6px 0 6px 20px;
      border-left: 1px solid rgba(32, 242, 143, 0.26);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      font-size: 12px;
      text-transform: uppercase;
    }
    .method-nav a {
      color: rgba(234, 255, 246, 0.42);
      text-decoration: none;
    }
    .method-nav a:first-child,
    .method-nav a:hover {
      color: var(--accent);
    }
    .method-content {
      display: grid;
      gap: clamp(26px, 4vw, 48px);
      min-width: 0;
    }
    .method-intro {
      max-width: 900px;
      padding: 18px 20px;
      border-left: 3px solid var(--accent);
      color: rgba(234, 255, 246, 0.76);
      font-size: clamp(18px, 2vw, 22px);
      line-height: 1.55;
    }
    .method-content .section-visual {
      width: min(100%, 760px);
      min-height: 240px;
      margin: 0;
    }
    .danger-panel {
      border-color: rgba(255, 49, 88, 0.34) !important;
      box-shadow: inset 3px 0 0 rgba(255, 49, 88, 0.7), inset 0 0 34px rgba(255, 49, 88, 0.035) !important;
    }
    .protocol-head {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 24px;
      margin-bottom: clamp(30px, 5vw, 58px);
      padding-bottom: 24px;
      border-bottom: 1px solid var(--line);
    }
    .protocol-head h1 {
      margin-bottom: 0;
      text-transform: uppercase;
    }
    .protocol-head h2 {
      margin: 0 0 18px;
      color: rgba(234, 255, 246, 0.46);
      font-size: clamp(24px, 3.5vw, 44px);
      text-transform: uppercase;
    }
    .protocol-grid {
      display: grid;
      grid-template-columns: minmax(0, 2fr) minmax(300px, 0.95fr);
      gap: 24px;
      align-items: start;
    }
    .protocol-checks,
    .protocol-side {
      display: grid;
      gap: 18px;
      min-width: 0;
    }
    .protocol-checks article,
    .protocol-side article {
      padding: 20px;
    }
    .protocol-checks h2,
    .protocol-side h2 {
      margin-bottom: 14px;
      color: var(--accent);
      font-size: 18px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      text-transform: uppercase;
    }
    .protocol-checks li {
      display: grid;
      grid-template-columns: 18px minmax(0, 1fr);
      gap: 10px;
      align-items: start;
    }
    .protocol-checks input {
      width: 16px;
      height: 16px;
      margin: 2px 0 0;
      accent-color: var(--accent);
    }
    .protocol-side {
      position: sticky;
      top: 96px;
    }
    .protocol-side .section-visual {
      width: 100%;
      min-height: 260px;
      margin: 0;
    }
    .case-detail-page {
      width: min(100%, 1440px);
    }
    .case-breadcrumb {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 18px;
      color: rgba(234, 255, 246, 0.42);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      font-size: 12px;
      text-transform: uppercase;
    }
    .case-breadcrumb a {
      color: var(--accent);
      text-decoration: none;
    }
    .case-detail-head {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 18px;
      margin-bottom: 24px;
    }
    .case-status-line {
      color: rgba(234, 255, 246, 0.52);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      font-size: 13px;
    }
    .case-status-line span {
      color: var(--gold);
      font-weight: 900;
    }
    .case-head-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 10px;
    }
    .case-bento {
      display: grid;
      grid-template-columns: minmax(300px, 0.86fr) minmax(0, 1.44fr);
      grid-template-areas:
        "identity kpis"
        "identity timeline"
        "note timeline";
      gap: 18px;
      align-items: start;
    }
    .case-identity {
      grid-area: identity;
      position: relative;
      overflow: hidden;
    }
    .case-note {
      grid-area: note;
      padding: 18px;
      border-left: 4px solid var(--gold);
    }
    .case-note h2,
    .case-timeline h2 {
      margin-bottom: 10px;
      font-size: 22px;
    }
    .case-note a {
      color: var(--accent);
      font-weight: 850;
    }
    .risk-chip {
      position: absolute;
      top: 14px;
      right: 14px;
      z-index: 2;
      padding: 6px 9px;
      border: 1px solid rgba(200, 255, 93, 0.45);
      background: rgba(0, 4, 3, 0.72);
      color: var(--gold);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
    }
    .case-identity .photo-strip {
      grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
      gap: 0;
      background: #000;
    }
    .case-identity .photo-tile {
      border: 0;
      border-bottom: 1px solid var(--line);
    }
    .case-identity .photo-tile img {
      aspect-ratio: 1.18;
      filter: grayscale(0.2) contrast(1.08);
    }
    .case-identity .empty-photos {
      min-height: 220px;
      display: grid;
      place-items: center;
      border: 0;
      border-bottom: 1px solid var(--line);
      text-align: center;
    }
    .case-identity-body {
      padding: 20px;
    }
    .identity-grid {
      display: grid;
      grid-template-columns: 120px minmax(0, 1fr);
      gap: 12px 16px;
      align-items: start;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      font-size: 13px;
    }
    .identity-grid span {
      color: rgba(234, 255, 246, 0.38);
      text-transform: uppercase;
    }
    .identity-grid strong {
      min-width: 0;
      color: rgba(234, 255, 246, 0.82);
      overflow-wrap: anywhere;
    }
    .case-kpis {
      grid-area: kpis;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
    }
    .case-kpis article {
      padding: 16px;
      border-top: 2px solid var(--accent);
    }
    .case-kpis .alert-card {
      border-top-color: var(--danger);
    }
    .case-kpis span {
      display: block;
      margin-bottom: 8px;
      color: rgba(234, 255, 246, 0.42);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      font-size: 10px;
      text-transform: uppercase;
    }
    .case-kpis strong {
      color: var(--ink);
      font-size: clamp(20px, 2.4vw, 30px);
      line-height: 1;
    }
    .case-timeline {
      grid-area: timeline;
      padding: 22px;
    }
    .case-timeline-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: start;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(32, 242, 143, 0.16);
    }
    .case-timeline-head span,
    .timeline-list time {
      color: rgba(234, 255, 246, 0.42);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      font-size: 11px;
      text-transform: uppercase;
    }
    .timeline-list {
      display: grid;
      gap: 26px;
      margin-left: 10px;
      padding-left: 22px;
      border-left: 1px solid rgba(234, 255, 246, 0.16);
    }
    .timeline-list article {
      position: relative;
    }
    .timeline-list article::before {
      content: "";
      position: absolute;
      left: -29px;
      top: 4px;
      width: 11px;
      height: 11px;
      border-radius: 999px;
      background: var(--accent);
      box-shadow: 0 0 0 5px #000403, 0 0 18px rgba(32, 242, 143, 0.7);
    }
    .timeline-list article:first-child::before {
      background: var(--danger);
      box-shadow: 0 0 0 5px #000403, 0 0 18px rgba(255, 49, 88, 0.7);
    }
    .timeline-list h3 {
      margin: 7px 0 8px;
      font-size: 19px;
    }
    .timeline-list p {
      margin-bottom: 12px;
    }
    .admin-login-screen {
      min-height: calc(100svh - 72px);
      display: grid;
      place-items: center;
      align-content: center;
      gap: 20px;
      background:
        radial-gradient(circle at 50% 20%, rgba(32, 242, 143, 0.14), transparent 38%),
        linear-gradient(90deg, rgba(32, 242, 143, 0.04) 1px, transparent 1px),
        linear-gradient(rgba(32, 242, 143, 0.04) 1px, transparent 1px),
        #000;
      background-size: auto, 34px 34px, 34px 34px;
      position: relative;
      isolation: isolate;
      overflow: hidden;
      padding: clamp(32px, 5vw, 64px) 18px;
    }
    .admin-login-head {
      max-width: 600px;
      text-align: center;
    }
    .admin-login-head h1 {
      font-size: clamp(42px, 6vw, 74px);
      line-height: 0.9;
    }
    .login-logo {
      width: 136px;
      margin: 0 auto 16px;
    }
    .admin-login {
      width: min(100%, 520px);
      position: relative;
      border-color: rgba(32, 242, 143, 0.34);
      background: rgba(5, 14, 11, 0.86);
      backdrop-filter: blur(16px);
    }
    .admin-login::before,
    .admin-login::after {
      content: "";
      position: absolute;
      width: 12px;
      height: 12px;
      pointer-events: none;
    }
    .admin-login::before {
      top: -1px;
      left: -1px;
      border-top: 1px solid var(--accent);
      border-left: 1px solid var(--accent);
    }
    .admin-login::after {
      right: -1px;
      bottom: -1px;
      border-right: 1px solid var(--accent);
      border-bottom: 1px solid var(--accent);
    }
    .secure-badge {
      justify-self: center;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: rgba(234, 255, 246, 0.38);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      font-size: 11px;
      font-weight: 850;
      text-transform: uppercase;
    }
    .secure-badge::before {
      content: "▣";
      color: var(--accent);
    }
    .admin-login-foot {
      margin: 0;
      color: var(--gold);
      font-size: 12px;
      font-weight: 850;
      text-align: center;
      text-transform: uppercase;
    }
    .top-logout {
      margin: 0;
      justify-self: end;
    }
    .top-logout .button {
      min-height: 42px;
      padding: 8px 12px;
      box-shadow: none;
    }
    .admin-shell {
      width: 100%;
      min-height: 100svh;
      margin: 0;
      display: grid;
      grid-template-columns: 256px minmax(0, 1fr) 360px;
      gap: 18px;
      padding: 88px clamp(16px, 3vw, 38px) 28px;
      position: relative;
      isolation: isolate;
      overflow: hidden;
      background: #000;
    }
    .admin-queue-topbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 90;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 64px;
      padding: 0 24px;
      border-bottom: 1px solid rgba(32, 242, 143, 0.18);
      background: rgba(0, 0, 0, 0.92);
      backdrop-filter: blur(12px);
    }
    .admin-queue-brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      color: var(--ink);
      text-decoration: none;
    }
    .admin-queue-brand strong {
      color: var(--accent);
      font-size: 18px;
      text-transform: uppercase;
    }
    .admin-queue-brand span:last-child {
      padding-left: 12px;
      border-left: 1px solid rgba(32, 242, 143, 0.18);
      color: rgba(234, 255, 246, 0.52);
      font-size: 13px;
    }
    .admin-sidebar,
    .admin-review-panel {
      position: sticky;
      top: 96px;
      align-self: start;
      padding: 16px;
    }
    .admin-sidebar {
      display: grid;
      gap: 10px;
    }
    .admin-sidebar strong {
      font-size: 18px;
    }
    .admin-sidebar a {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      padding: 10px;
      border: 1px solid rgba(32, 242, 143, 0.18);
      color: var(--muted);
      text-decoration: none;
      font-weight: 850;
    }
    .admin-sidebar a:first-of-type {
      color: var(--ink);
      border-color: rgba(32, 242, 143, 0.52);
      background: rgba(32, 242, 143, 0.08);
    }
    .admin-sidebar small {
      color: var(--gold);
      line-height: 1.35;
    }
    .admin-queue {
      display: grid;
      gap: 16px;
      min-width: 0;
    }
    .admin-hero {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 240px;
      align-items: center;
      gap: 16px;
      padding: 18px;
      border: 1px solid var(--line);
      background: rgba(3, 11, 8, 0.9);
    }
    .admin-hero h1 {
      margin-bottom: 10px;
      font-size: clamp(34px, 5vw, 64px);
      line-height: 0.92;
    }
    .vault-visual {
      position: relative;
      min-height: 150px;
      border: 1px solid rgba(32, 242, 143, 0.24);
      background:
        radial-gradient(circle at 50% 50%, rgba(32, 242, 143, 0.22), transparent 42%),
        repeating-linear-gradient(90deg, rgba(32, 242, 143, 0.08) 0 1px, transparent 1px 18px),
        #000;
      overflow: hidden;
    }
    .vault-visual span {
      position: absolute;
      width: 74px;
      height: 46px;
      border: 1px solid rgba(234, 255, 246, 0.48);
      background: rgba(4, 19, 15, 0.88);
      box-shadow: 0 0 22px rgba(32, 242, 143, 0.2);
      transform: perspective(420px) rotateY(-22deg) rotateX(12deg);
      animation: vaultCard 4.5s ease-in-out infinite;
    }
    .vault-visual span:nth-child(1) { left: 20px; top: 68px; animation-delay: -0.4s; }
    .vault-visual span:nth-child(2) { left: 86px; top: 44px; animation-delay: -1.6s; }
    .vault-visual span:nth-child(3) { left: 146px; top: 82px; animation-delay: -2.8s; }
    @keyframes vaultCard {
      0%, 100% { transform: translateX(-8px) perspective(420px) rotateY(-24deg) rotateX(12deg); opacity: 0.54; }
      50% { transform: translateX(10px) perspective(420px) rotateY(18deg) rotateX(4deg); opacity: 1; }
    }
    .admin-report-card {
      gap: 10px;
    }
    .evidence-meter {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 8px;
      align-items: center;
      color: var(--muted);
      font-size: 12px;
      font-weight: 850;
      text-transform: uppercase;
    }
    .evidence-meter::after {
      content: "";
      grid-column: 1 / -1;
      height: 7px;
      border: 1px solid rgba(32, 242, 143, 0.24);
      background:
        linear-gradient(90deg, var(--accent) calc(var(--evidence) * 1%), rgba(32, 242, 143, 0.08) 0);
      box-shadow: 0 0 18px rgba(32, 242, 143, 0.14);
    }
    .moderation-buttons {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .ops-topbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 80;
      min-height: 64px;
      height: 64px;
      padding: 0 20px 0 10px;
      grid-template-columns: 250px minmax(0, 1fr) auto;
      border-bottom: 1px solid rgba(32, 242, 143, 0.2);
      background: rgba(0, 0, 0, 0.92);
      box-shadow: 0 0 20px rgba(32, 242, 143, 0.08);
    }
    .ops-wordmark {
      align-self: stretch;
      align-items: center;
      color: var(--accent);
      font-size: 15px;
      font-weight: 950;
      letter-spacing: -0.02em;
      text-transform: uppercase;
    }
    .brand-word {
      color: var(--accent);
      text-shadow: 0 0 10px rgba(32, 242, 143, 0.4);
    }
    .top-nav {
      gap: 22px;
      justify-content: center;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      text-transform: none;
    }
    .top-nav a {
      min-height: 0;
      padding: 0 0 4px;
      border: 0;
      border-bottom: 2px solid transparent;
      background: transparent;
      color: rgba(234, 255, 246, 0.42);
      font-size: 12px;
      font-weight: 600;
      box-shadow: none;
    }
    .top-nav a:hover,
    .top-nav a[aria-current="page"] {
      border-color: var(--accent);
      background: transparent;
      color: var(--accent);
      box-shadow: none;
    }
    .top-actions {
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      gap: 14px;
      min-width: 0;
      color: var(--accent);
    }
    .top-icon,
    .top-icon-button {
      display: inline-grid;
      place-items: center;
      min-width: 22px;
      min-height: 22px;
      border: 0;
      background: transparent;
      color: var(--accent);
      text-decoration: none;
      font: 850 13px/1 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      cursor: pointer;
    }
    .top-icon:hover,
    .top-icon-button:hover {
      color: var(--gold);
      text-shadow: 0 0 12px rgba(32, 242, 143, 0.6);
    }
    .top-icon-button {
      width: auto;
      padding: 7px 10px;
      border: 1px solid rgba(32, 242, 143, 0.28);
      text-transform: uppercase;
    }
    .top-logout,
    .admin-mobile-logout {
      margin: 0;
    }
    .ops-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 70;
      width: 256px;
      height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 82px 0 22px;
      border-right: 1px solid rgba(32, 242, 143, 0.2);
      background: #000;
      color: var(--ink);
      box-shadow: 16px 0 38px rgba(0, 0, 0, 0.32);
    }
    .sidebar-brand {
      display: grid;
      grid-template-columns: 42px minmax(0, 1fr);
      align-items: center;
      gap: 12px;
      padding: 0 22px 14px;
    }
    .sidebar-logo {
      width: 42px;
      height: 42px;
      filter: drop-shadow(0 0 14px rgba(32, 242, 143, 0.42));
    }
    .sidebar-logo .brand-kimchi-logo {
      width: 42px;
      height: 42px;
    }
    .sidebar-brand strong {
      display: block;
      color: var(--accent);
      font-size: 16px;
      line-height: 1;
      text-transform: uppercase;
    }
    .sidebar-brand span,
    .sidebar-label,
    .sidebar-bottom a,
    .sidebar-scan,
    .sidebar-menu a {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      text-transform: uppercase;
    }
    .sidebar-brand span {
      display: block;
      margin-top: 4px;
      color: rgba(32, 242, 143, 0.58);
      font-size: 9px;
      letter-spacing: 0.1em;
    }
    .sidebar-scan {
      margin: 0 22px 28px;
      padding: 10px 12px;
      border: 1px solid var(--accent);
      background: rgba(32, 242, 143, 0.08);
      color: var(--accent);
      text-align: center;
      text-decoration: none;
      font-size: 11px;
      font-weight: 850;
      letter-spacing: 0.1em;
    }
    .sidebar-scan:hover {
      background: rgba(32, 242, 143, 0.18);
      box-shadow: 0 0 18px rgba(32, 242, 143, 0.24);
    }
    .sidebar-menu {
      flex: 1;
      overflow-y: auto;
      display: grid;
      align-content: start;
      gap: 2px;
      scrollbar-width: thin;
    }
    .sidebar-label {
      padding: 0 22px 7px;
      color: rgba(234, 255, 246, 0.34);
      font-size: 10px;
      letter-spacing: 0.14em;
    }
    .sidebar-menu a {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 42px;
      padding: 12px 18px 12px 22px;
      border-left: 4px solid transparent;
      color: rgba(234, 255, 246, 0.36);
      text-decoration: none;
      font-size: 12px;
      font-weight: 850;
      letter-spacing: 0.08em;
      transition: transform 140ms ease, color 140ms ease, background 140ms ease, border-color 140ms ease;
    }
    .sidebar-menu a span {
      width: 18px;
      color: currentColor;
      text-align: center;
    }
    .sidebar-menu a:hover {
      color: rgba(234, 255, 246, 0.82);
      background: rgba(234, 255, 246, 0.04);
      transform: translateX(3px);
    }
    .sidebar-menu a.is-active {
      border-left-color: var(--accent);
      background: rgba(32, 242, 143, 0.1);
      color: var(--accent);
      transform: none;
    }
    .sidebar-bottom {
      display: grid;
      gap: 10px;
      padding: 18px 22px 0;
      border-top: 1px solid rgba(32, 242, 143, 0.1);
    }
    .sidebar-bottom a {
      color: rgba(234, 255, 246, 0.38);
      text-decoration: none;
      font-size: 10px;
      letter-spacing: 0.12em;
    }
    .sidebar-bottom a:hover {
      color: var(--accent);
    }
    .ops-main {
      width: auto;
      min-height: calc(100svh - 64px);
      margin-left: 256px;
      padding-top: 64px;
    }
    .ops-main.hero-only {
      padding-top: 64px;
    }
    .hero {
      min-height: min(921px, calc(100svh - 64px));
      place-items: center start;
      padding: clamp(70px, 8vw, 130px) clamp(28px, 6vw, 104px);
      text-align: left;
    }
    .hero-inner {
      width: min(100%, 960px);
      justify-items: start;
      margin-left: 0;
    }
    .hero .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--gold);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      letter-spacing: 0.16em;
    }
    .hero .eyebrow::before {
      content: "◎";
      color: var(--gold);
      animation: pulseDot 1.4s ease-in-out infinite;
    }
    .hero h1 {
      display: grid;
      gap: 0;
      margin: 0 0 18px;
      max-width: 900px;
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      font-size: clamp(64px, 8.4vw, 152px);
      font-weight: 950;
      line-height: 0.78;
      letter-spacing: -0.045em;
      text-transform: uppercase;
      text-wrap: balance;
      text-shadow: 0 0 24px rgba(32, 242, 143, 0.22);
    }
    .hero-green {
      color: var(--accent);
      text-shadow: 0 0 18px rgba(32, 242, 143, 0.48);
    }
    .hero .subtitle {
      max-width: 760px;
      margin-bottom: 22px;
      padding: 18px 22px;
      border: 1px solid rgba(32, 242, 143, 0.18);
      border-left: 3px solid var(--accent);
      background: rgba(10, 10, 10, 0.72);
      backdrop-filter: blur(12px);
      color: rgba(234, 255, 246, 0.92);
      font-size: clamp(19px, 2vw, 26px);
      font-weight: 600;
      line-height: 1.35;
    }
    .hero-copy {
      max-width: 660px;
      margin-bottom: 28px;
      color: rgba(234, 255, 246, 0.62);
    }
    .hero-actions {
      justify-content: flex-start;
    }
    .stat-row {
      justify-content: flex-start;
      margin-top: 30px;
    }
    .logo-lockup {
      display: none;
    }
    .assessment-page,
    .watchlist-page,
    .report-page,
    .page-main,
    .admin-main,
    .admin-shell {
      margin-left: 256px;
      padding-top: clamp(56px, 6vw, 88px);
    }
    .ops-main.assessment-page,
    .ops-main.watchlist-page,
    .ops-main.report-page,
    .ops-main.page-main,
    .ops-main.admin-main,
    .ops-main.admin-shell {
      margin-left: 256px;
      padding-top: clamp(104px, 8vw, 128px);
    }
    footer {
      margin-left: 256px;
      background: #000;
      border-top: 1px solid rgba(32, 242, 143, 0.14);
    }
    @keyframes pulseDot {
      0%, 100% { opacity: 0.45; transform: scale(0.92); }
      50% { opacity: 1; transform: scale(1.08); }
    }

    @media (max-width: 980px) {
      .ops-sidebar {
        display: none;
      }
      .ops-main,
      .assessment-page,
      .watchlist-page,
      .report-page,
      .page-main,
      .admin-main,
      .admin-shell,
      .ops-main.assessment-page,
      .ops-main.watchlist-page,
      .ops-main.report-page,
      .ops-main.page-main,
      .ops-main.admin-main,
      .ops-main.admin-shell,
      footer {
        margin-left: 0;
      }
      .ops-main {
        padding-top: 112px;
      }
      .topbar {
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
      }
      .ops-topbar {
        height: auto;
        min-height: 74px;
        grid-template-columns: minmax(0, 1fr) auto;
        padding: 12px 16px;
      }
      .top-actions {
        gap: 8px;
      }
      .top-icon:nth-last-child(-n + 2) {
        display: none;
      }
      nav {
        grid-column: 1 / -1;
        grid-row: 2;
        justify-content: flex-start;
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-bottom: 2px;
        scrollbar-width: thin;
      }
      nav a { flex: 0 0 auto; }
      .top-nav a {
        font-size: 11px;
      }
      .language-picker {
        grid-column: 2;
        grid-row: 1;
        justify-self: end;
        min-width: 220px;
      }
      .trust-band {
        grid-template-columns: 1fr;
      }
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
      .assessment-hero,
      .dossier-head,
      .report-hero,
      .report-workbench,
      .methodology-layout,
      .protocol-grid,
      .case-bento,
      .dossier-layout,
      .admin-shell,
      .admin-hero {
        grid-template-columns: 1fr;
      }
      .case-bento {
        grid-template-areas:
          "identity"
          "note"
          "kpis"
          "timeline";
      }
      .case-kpis {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .admin-sidebar,
      .admin-review-panel,
      .dossier-side,
      .report-brief,
      .method-nav,
      .protocol-side {
        position: static;
      }
      .protocol-head,
      .case-detail-head {
        flex-direction: column;
        align-items: stretch;
      }
      .case-head-actions {
        justify-content: flex-start;
      }
      .watch-card {
        grid-template-columns: 1fr;
      }
      .watch-card .photo-strip {
        grid-row: auto;
        max-height: none;
        overflow: visible;
      }
    }
    @media (max-width: 640px) {
      [id] { scroll-margin-top: 138px; }
      .ops-main {
        padding-top: 126px;
      }
      .topbar {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 10px;
        min-height: 0;
        padding: 12px 18px;
      }
      .brand-mark {
        width: 32px;
        height: 32px;
        font-size: 12px;
        box-shadow: 3px 3px 0 var(--ink);
      }
      .brand-logo-mark {
        width: 36px;
        height: 36px;
        box-shadow: none;
      }
      .brand { gap: 9px; }
      .brand-word {
        font-size: 13px;
      }
      .top-actions .top-icon {
        display: none;
      }
      .top-actions {
        grid-column: 2;
        grid-row: 1;
      }
      .top-nav {
        display: flex;
        grid-column: 1 / -1;
        grid-row: 2;
        grid-template-columns: none;
        justify-content: flex-start;
        gap: 8px;
        width: 100%;
        overflow-x: auto;
        padding: 2px 0 4px;
      }
      .top-nav a {
        flex: 0 0 auto;
        width: auto;
        min-width: max-content;
        min-height: 34px;
        padding: 8px 10px;
        border: 1px solid rgba(32, 242, 143, 0.2);
        border-bottom-color: rgba(32, 242, 143, 0.2);
        background: rgba(4, 19, 15, 0.68);
        font-size: 11px;
      }
      .top-nav a[aria-current="page"] {
        border-color: var(--accent);
      }
      .top-nav a:last-child {
        grid-column: auto;
      }
      nav {
        display: grid;
        grid-column: 1 / -1;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
        margin-inline: -2px;
        overflow-x: visible;
      }
      nav a {
        justify-content: center;
        min-width: 0;
        width: 100%;
        min-height: 38px;
        padding: 8px 6px;
        text-align: center;
        font-size: 12px;
        line-height: 1.15;
        white-space: normal;
      }
      nav a:last-child { grid-column: 1 / -1; }
      .language-picker {
        justify-self: end;
        min-width: 0;
        min-height: 38px;
        padding: 7px 10px;
      }
      .language-picker span { display: none; }
      .language-picker select {
        min-width: 112px;
        padding: 3px 4px;
      }
      .hero {
        min-height: calc(100svh - 150px);
        padding-top: 24px;
        padding-bottom: 124px;
      }
      .logo-lockup { width: 92px; min-width: 0; margin-bottom: 8px; }
      .eyebrow { margin-bottom: 8px; font-size: 11px; }
      h1 { font-size: 46px; line-height: 0.9; }
      .page-main h1 {
        font-size: 44px;
        line-height: 0.94;
      }
      .case-detail h1 {
        font-size: 42px;
        line-height: 0.95;
      }
      .admin-main h1 {
        font-size: 42px;
        line-height: 0.95;
      }
      .subtitle { font-size: 20px; }
      .hero-copy { font-size: 15px; }
      .fraud-bonk { box-shadow: 4px 4px 0 var(--ink); }
      .bonk-stage { min-height: 0; }
      .bonk-copy { flex-direction: column; }
      .flag-field { inset: -6% -38% -5%; }
      .flag-scoreboard {
        bottom: 82px;
        flex-direction: column;
        align-items: stretch;
        gap: 6px;
      }
      .flag-scoreboard span {
        text-align: center;
        padding: 6px 8px;
      }
      .flag-humor { bottom: 10px; font-size: 11px; }
      .flag-divider span { display: none; }
      .hero-actions {
        display: grid;
        grid-template-columns: 1fr;
        width: min(100%, 320px);
        margin-inline: auto;
      }
      .hero-actions .button {
        width: 100%;
        box-sizing: border-box;
      }
      .stat-row {
        display: grid;
        grid-template-columns: 1fr;
        width: 100%;
      }
      .form-row, .score-summary, .checkbox-grid, .watchlist-tools { grid-template-columns: 1fr; }
      .report-workbench,
      .methodology-page,
      .protocol-page,
      .case-detail-page {
        padding-left: 16px;
        padding-right: 16px;
      }
      .methodology-hero {
        min-height: 240px;
        padding-top: 20px;
      }
      .method-nav {
        display: flex;
        overflow-x: auto;
        padding: 0 0 10px;
        border-left: 0;
        border-bottom: 1px solid rgba(32, 242, 143, 0.18);
      }
      .method-nav a {
        flex: 0 0 auto;
      }
      .case-kpis {
        grid-template-columns: 1fr;
      }
      .identity-grid {
        grid-template-columns: 1fr;
      }
      .admin-queue-topbar {
        padding: 0 14px;
      }
      .admin-queue-brand span:last-child {
        display: none;
      }
      .assessment-page,
      .watchlist-page,
      .report-page,
      .admin-shell {
        padding: 24px 16px;
      }
      .assessment-hero h1,
      .dossier-head h1,
      .report-hero h1 {
        font-size: 42px;
        line-height: 0.95;
      }
      .moderation-buttons {
        grid-template-columns: 1fr;
      }
      .admin-hero {
        padding: 14px;
      }
      .mini-check:nth-child(odd) { border-right: 0; }
      .score-circle { margin: 0 auto; }
      .footer-inner, .case-meta { flex-direction: column; }
      .photo-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media print {
      body { background: #fff; color: #000; }
      .topbar, .print-button, footer, .hero-actions, .fraud-bonk, .flag-duel { display: none !important; }
      .page-main { width: 100%; padding: 0; }
      .kit-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
      .kit-grid article, .plain-grid article, .case-detail { break-inside: avoid; box-shadow: none; }
      a { color: #000; }
    }
    @media (prefers-reduced-motion: reduce) {
      .bonk-glove, .fake-stack, .proxy-laptop, .bonk-burst, .bonk-speedlines path,
      .flag-art, .flag-panel::before, .flag-panel::after, .flag-shine, .flag-wind, .flag-particles span,
      .visual-object, .earth-shell, .shield-ring, .radar-sweep, .radar-blip, .tunnel-ring,
      .vault-dial, .sealed-report, .photo-cube, .scanner-beam, .source-orbit, .micro-dot, .scan-line {
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
