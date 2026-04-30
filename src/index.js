import { PUBLIC_CASES } from "./cases.js";
import { APPLE_TOUCH_ICON_PNG_BASE64, FAVICON_PNG_BASE64 } from "./favicon.generated.js";
import { LANGUAGES, getStrings } from "./i18n.js";
import { OG_IMAGE_PNG_BASE64 } from "./og-image.generated.js";
import { THREE_CORE_SOURCE, THREE_MODULE_SOURCE } from "./three.generated.js";
import {
  homeUrlForLanguage,
  renderAdmin,
  renderAssessmentPage,
  renderAssessment,
  renderCaseDetail,
  renderFaviconImage,
  renderHiringKit,
  renderHome,
  renderMethodology,
  renderOgImage,
  renderReportPage,
  renderWatchlistPage,
  renderWebManifest,
} from "./render.js";
import { assessCandidate, SIGNALS } from "./scoring.js";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

const PRODUCTION_ORIGIN = "https://kimchicanary.xyz";
const ADMIN_COOKIE = "kc_admin";
const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;
const NOINDEX_HEADERS = { "x-robots-tag": "noindex, nofollow, noarchive" };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const publicOrigin = isLocalHost(url.hostname) ? url.origin : PRODUCTION_ORIGIN;

    try {
      if ((request.method === "GET" || request.method === "HEAD") && url.pathname === "/") {
        const language = normalizeLanguage(url.searchParams.get("lang") || request.headers.get("accept-language"));
        const approvedReports = await listApprovedReports(env);
        const response = htmlResponse(renderHome({ language, reportsEnabled: Boolean(env.DB), approvedReports, origin: publicOrigin }), {
          headers: {
            "content-language": language,
            vary: "Accept-Language",
          },
        });
        return request.method === "HEAD" ? new Response(null, { status: response.status, headers: response.headers }) : response;
      }

      if ((request.method === "GET" || request.method === "HEAD") && url.pathname === "/og.svg") {
        const response = svgResponse(renderOgImage());
        return request.method === "HEAD" ? new Response(null, { status: response.status, headers: response.headers }) : response;
      }

      if ((request.method === "GET" || request.method === "HEAD") && url.pathname === "/og.png") {
        const response = pngResponse(OG_IMAGE_PNG_BASE64);
        return request.method === "HEAD" ? new Response(null, { status: response.status, headers: response.headers }) : response;
      }

      if ((request.method === "GET" || request.method === "HEAD") && url.pathname === "/favicon.svg") {
        const response = svgResponse(renderFaviconImage());
        return request.method === "HEAD" ? new Response(null, { status: response.status, headers: response.headers }) : response;
      }

      if ((request.method === "GET" || request.method === "HEAD") && ["/favicon.ico", "/favicon.png"].includes(url.pathname)) {
        const response = pngResponse(FAVICON_PNG_BASE64);
        return request.method === "HEAD" ? new Response(null, { status: response.status, headers: response.headers }) : response;
      }

      if ((request.method === "GET" || request.method === "HEAD") && url.pathname === "/apple-touch-icon.png") {
        const response = pngResponse(APPLE_TOUCH_ICON_PNG_BASE64);
        return request.method === "HEAD" ? new Response(null, { status: response.status, headers: response.headers }) : response;
      }

      if ((request.method === "GET" || request.method === "HEAD") && url.pathname === "/site.webmanifest") {
        const response = manifestResponse(renderWebManifest(publicOrigin));
        return request.method === "HEAD" ? new Response(null, { status: response.status, headers: response.headers }) : response;
      }

      if ((request.method === "GET" || request.method === "HEAD") && url.pathname === "/vendor/three.module.js") {
        const response = javascriptResponse(THREE_MODULE_SOURCE);
        return request.method === "HEAD" ? new Response(null, { status: response.status, headers: response.headers }) : response;
      }

      if ((request.method === "GET" || request.method === "HEAD") && url.pathname === "/vendor/three.core.min.js") {
        const response = javascriptResponse(THREE_CORE_SOURCE);
        return request.method === "HEAD" ? new Response(null, { status: response.status, headers: response.headers }) : response;
      }

      if (request.method === "GET" && url.pathname === "/robots.txt") {
        return textResponse(renderRobots(publicOrigin));
      }

      if (request.method === "GET" && url.pathname === "/sitemap.xml") {
        return xmlResponse(renderSitemap(publicOrigin));
      }

      if ((request.method === "GET" || request.method === "HEAD") && url.pathname === "/methodology") {
        const response = htmlResponse(renderMethodology({ origin: publicOrigin }), { headers: { "content-language": "en" } });
        return request.method === "HEAD" ? new Response(null, { status: response.status, headers: response.headers }) : response;
      }

      if ((request.method === "GET" || request.method === "HEAD") && url.pathname === "/assessment") {
        const language = normalizeLanguage(url.searchParams.get("lang") || request.headers.get("accept-language"));
        const response = htmlResponse(renderAssessmentPage({ language, origin: publicOrigin }), {
          headers: { "content-language": language, vary: "Accept-Language" },
        });
        return request.method === "HEAD" ? new Response(null, { status: response.status, headers: response.headers }) : response;
      }

      if ((request.method === "GET" || request.method === "HEAD") && url.pathname === "/watchlist") {
        const approvedReports = await listApprovedReports(env);
        const response = htmlResponse(renderWatchlistPage({ approvedReports, origin: publicOrigin }), { headers: { "content-language": "en" } });
        return request.method === "HEAD" ? new Response(null, { status: response.status, headers: response.headers }) : response;
      }

      if ((request.method === "GET" || request.method === "HEAD") && url.pathname === "/report") {
        const response = htmlResponse(renderReportPage({ reportsEnabled: Boolean(env.DB), origin: publicOrigin }), { headers: { "content-language": "en" } });
        return request.method === "HEAD" ? new Response(null, { status: response.status, headers: response.headers }) : response;
      }

      if ((request.method === "GET" || request.method === "HEAD") && url.pathname === "/kit") {
        const response = htmlResponse(renderHiringKit({ origin: publicOrigin }), { headers: { "content-language": "en" } });
        return request.method === "HEAD" ? new Response(null, { status: response.status, headers: response.headers }) : response;
      }

      if ((request.method === "GET" || request.method === "HEAD") && /^\/cases\/[a-z0-9-]+$/.test(url.pathname)) {
        const id = url.pathname.split("/")[2];
        const caseItem = PUBLIC_CASES.find((item) => item.id === id);
        if (!caseItem) {
          return new Response("Not found", { status: 404 });
        }
        const response = htmlResponse(renderCaseDetail({ caseItem, origin: publicOrigin }), { headers: { "content-language": "en" } });
        return request.method === "HEAD" ? new Response(null, { status: response.status, headers: response.headers }) : response;
      }

      if (request.method === "GET" && url.pathname === "/api/cases") {
        return jsonResponse({ cases: PUBLIC_CASES });
      }

      if (request.method === "POST" && url.pathname === "/api/assess") {
        const payload = await readJson(request);
        const language = normalizeLanguage(url.searchParams.get("lang") || "en");
        const assessment = assessCandidate(payload);
        return jsonResponse({
          assessment,
          html: renderAssessment(assessment, getStrings(language)),
        });
      }

      if (request.method === "POST" && url.pathname === "/api/reports") {
        return submitReport(request, env);
      }

      if (request.method === "GET" && url.pathname === "/api/reports/approved") {
        return jsonResponse({ reports: await listApprovedReports(env) });
      }

      if (request.method === "POST" && /^\/api\/admin\/reports\/\d+\/status$/.test(url.pathname)) {
        return updateReportStatus(request, env);
      }

      if (request.method === "POST" && url.pathname === "/admin/login") {
        return loginAdmin(request, env);
      }

      if (request.method === "POST" && url.pathname === "/admin/logout") {
        return logoutAdmin();
      }

      if ((request.method === "GET" || request.method === "HEAD") && url.pathname === "/admin") {
        const response = await renderAdminPage(request, env);
        return request.method === "HEAD" ? new Response(null, { status: response.status, headers: response.headers }) : response;
      }

      return new Response("Not found", { status: 404, headers: { ...NOINDEX_HEADERS, "content-type": "text/plain; charset=utf-8" } });
    } catch (error) {
      const message = error instanceof PublicError ? error.message : "Unexpected server error.";
      const status = error instanceof PublicError ? error.status : 500;
      return jsonResponse({ error: message }, { status });
    }
  },
};

export { assessCandidate, SIGNALS };

async function submitReport(request, env) {
  if (!env.DB) {
    throw new PublicError("Report intake is not configured.", 503);
  }

  const payload = await readJson(request);
  const report = validateReport(payload);
  const reporterKey = await reportRateLimitKey(request, env, report.reporterEmail);
  await enforceReportRateLimit(env, reporterKey);

  await env.DB.prepare(
    `insert into reports (
      reporter_email,
      reporter_key,
      organization,
      subject_name,
      subject_profile_url,
      source_url,
      evidence_summary,
      evidence_type,
      contact_permission,
      narrative,
      status,
      created_at
    ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'))`,
  )
    .bind(
      report.reporterEmail,
      reporterKey,
      report.organization,
      report.subjectName,
      report.subjectProfileUrl,
      report.sourceUrl,
      report.evidenceSummary,
      report.evidenceTypes.join(","),
      report.contactPermission,
      report.narrative,
    )
    .run();

  return jsonResponse({
    ok: true,
    message: "Report received. It is private until reviewed and approved.",
  });
}

async function listApprovedReports(env) {
  if (!env.DB) {
    return [];
  }

  try {
    const { results } = await env.DB.prepare(
      `select id, subject_name, subject_profile_url, source_url, evidence_summary, evidence_type, narrative,
              reviewer_note, reviewer_confidence, reviewed_at, created_at
       from reports
       where status = 'approved'
       order by reviewed_at desc, created_at desc
       limit 30`,
    ).all();

    return results || [];
  } catch (error) {
    console.error("Failed to list approved reports", error);
    return [];
  }
}

async function updateReportStatus(request, env) {
  if (!env.DB || !env.ADMIN_TOKEN) {
    throw new PublicError("Admin moderation is not configured.", 503);
  }

  const auth = await getAdminAuth(request, env.ADMIN_TOKEN);
  if (!auth.ok) {
    return new Response("Unauthorized", { status: 401 });
  }

  const id = Number(new URL(request.url).pathname.split("/")[4]);
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new PublicError("Invalid report id.", 400);
  }

  const payload = await readBody(request);
  if (auth.via === "cookie" && !(await verifyCsrfToken(payload.csrf, auth.session, env.ADMIN_TOKEN))) {
    throw new PublicError("Invalid moderation form token.", 403);
  }

  const status = normalizeString(payload.status, 20);
  const reviewerNote = normalizeString(payload.reviewerNote, 1000);
  const reviewerName = normalizeString(payload.reviewerName, 120);
  const reviewerConfidence = normalizeString(payload.reviewerConfidence, 30) || "reviewed";
  if (!["approved", "rejected", "pending"].includes(status)) {
    throw new PublicError("Invalid moderation status.", 400);
  }

  if (!["reviewed", "limited", "strong"].includes(reviewerConfidence)) {
    throw new PublicError("Invalid reviewer confidence.", 400);
  }

  if (status === "approved") {
    const report = await env.DB.prepare(
      `select source_url, evidence_summary, narrative
       from reports
       where id = ?`,
    )
      .bind(id)
      .first();

    const evidenceText = [report?.source_url, report?.evidence_summary, reviewerNote].filter(Boolean).join(" ");
    if (evidenceText.length < 20) {
      throw new PublicError("Approved reports need a source URL, evidence summary, or reviewer note.", 400);
    }
  }

  await env.DB.prepare(
    `update reports
     set status = ?, reviewer_note = ?, reviewer_name = ?, reviewer_confidence = ?, reviewed_at = datetime('now')
     where id = ?`,
  )
    .bind(status, reviewerNote, reviewerName, reviewerConfidence, id)
    .run();

  await env.DB.prepare(
    `insert into moderation_events (report_id, action, reviewer_note, reviewer_name, created_at)
     values (?, ?, ?, ?, datetime('now'))`,
  )
    .bind(id, status, reviewerNote, reviewerName)
    .run();

  if (acceptsHtml(request)) {
    const url = new URL(request.url);
    return Response.redirect(`${url.origin}/admin`, 303);
  }

  return jsonResponse({ ok: true, status });
}

async function loginAdmin(request, env) {
  if (!env.DB || !env.ADMIN_TOKEN) {
    return htmlResponse(renderAdmin({ reports: [], authenticated: false, loginError: "Admin moderation is not configured." }), { status: 503, headers: NOINDEX_HEADERS });
  }

  const payload = await readBody(request);
  const token = normalizeString(payload.token, 2000);
  if (!timingSafeEqual(token, env.ADMIN_TOKEN)) {
    return htmlResponse(renderAdmin({ reports: [], authenticated: false, loginError: "Invalid admin token." }), { status: 401, headers: NOINDEX_HEADERS });
  }

  const session = await createAdminSession(env.ADMIN_TOKEN);
  const url = new URL(request.url);
  return new Response(null, {
    status: 303,
    headers: {
      location: `${url.origin}/admin`,
      "set-cookie": serializeCookie(ADMIN_COOKIE, session, ADMIN_SESSION_MAX_AGE_SECONDS),
    },
  });
}

function logoutAdmin() {
  return new Response(null, {
    status: 303,
    headers: {
      location: "/admin",
      "set-cookie": serializeCookie(ADMIN_COOKIE, "", 0),
    },
  });
}

async function renderAdminPage(request, env) {
  if (!env.DB || !env.ADMIN_TOKEN) {
    return htmlResponse(renderAdmin({ reports: [], authenticated: false, loginError: "Admin moderation is not configured." }), { status: 503, headers: NOINDEX_HEADERS });
  }

  const auth = await getAdminAuth(request, env.ADMIN_TOKEN);
  if (!auth.ok) {
    return htmlResponse(renderAdmin({ reports: [], authenticated: false }), {
      headers: { ...NOINDEX_HEADERS, "www-authenticate": 'Bearer realm="kimchi-canary-admin"' },
    });
  }

  const { results } = await env.DB.prepare(
    `select id, reporter_email, organization, subject_name, subject_profile_url, source_url, evidence_summary,
            evidence_type, contact_permission, narrative, status, created_at, reviewed_at, reviewer_note,
            reviewer_name, reviewer_confidence
     from reports
     order by created_at desc
     limit 100`,
  ).all();

  const csrfToken = auth.session ? await createCsrfToken(auth.session, env.ADMIN_TOKEN) : "";
  return htmlResponse(renderAdmin({ reports: results || [], authenticated: true, csrfToken }), { headers: NOINDEX_HEADERS });
}

function validateReport(payload) {
  const reporterEmail = normalizeString(payload.reporterEmail, 320);
  const organization = normalizeString(payload.organization, 160);
  const subjectName = normalizeString(payload.subjectName, 200);
  const subjectProfileUrl = normalizeString(payload.subjectProfileUrl, 1000);
  const sourceUrl = normalizeString(payload.sourceUrl, 1000);
  const evidenceSummary = normalizeString(payload.evidenceSummary, 2000);
  const evidenceTypes = normalizeEvidenceTypes(payload.evidenceTypes || payload.evidenceType);
  const contactPermission = payload.contactPermission === "yes" ? "yes" : "no";
  const narrative = normalizeString(payload.narrative, 6000);
  const website = normalizeString(payload.website, 200);

  if (website) {
    throw new PublicError("Unable to submit report.", 400);
  }

  if (!isEmail(reporterEmail)) {
    throw new PublicError("A valid reporter email is required.", 400);
  }

  if (subjectName.length < 2) {
    throw new PublicError("A suspect display name, handle, or profile URL is required.", 400);
  }

  if (narrative.length < 30) {
    throw new PublicError("Please include observed facts, dates, systems, and evidence details.", 400);
  }

  if (subjectProfileUrl && !isHttpUrl(subjectProfileUrl)) {
    throw new PublicError("Profile URL must begin with http:// or https://.", 400);
  }

  if (sourceUrl && !isHttpUrl(sourceUrl)) {
    throw new PublicError("Source URL must begin with http:// or https://.", 400);
  }

  if (!sourceUrl && evidenceSummary.length < 20) {
    throw new PublicError("Add a source URL or a short evidence summary so moderation can verify the report.", 400);
  }

  if (evidenceTypes.length === 0) {
    throw new PublicError("Select at least one evidence type.", 400);
  }

  if (payload.acknowledge !== "yes") {
    throw new PublicError("You must acknowledge the private moderation policy.", 400);
  }

  return { reporterEmail, organization, subjectName, subjectProfileUrl, sourceUrl, evidenceSummary, evidenceTypes, contactPermission, narrative };
}

function normalizeEvidenceTypes(value) {
  const values = Array.isArray(value) ? value : String(value || "").split(",");
  const allowed = new Set(["identity", "profile", "device", "payment", "interview", "access", "official", "other"]);
  return [...new Set(values.map((item) => normalizeString(item, 40)).filter((item) => allowed.has(item)))];
}

function normalizeLanguage(value) {
  const first = String(value || "en")
    .split(",")[0]
    .trim()
    .slice(0, 2)
    .toLowerCase();
  const supported = new Set(["en", "ko", "ja", "zh", "es", "fr", "de", "pt", "ru", "ar", "hi"]);
  return supported.has(first) ? first : "en";
}

async function readJson(request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new PublicError("Expected application/json.", 415);
  }

  try {
    return await request.json();
  } catch {
    throw new PublicError("Malformed JSON payload.", 400);
  }
}

async function readBody(request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return readJson(request);
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(await request.formData());
  }

  throw new PublicError("Expected application/json or form-urlencoded.", 415);
}

function normalizeString(value, maxLength) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

async function getAdminAuth(request, expectedToken) {
  const authHeader = request.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";
  if (timingSafeEqual(bearer, expectedToken)) {
    return { ok: true, via: "bearer", session: "" };
  }

  const session = getCookie(request, ADMIN_COOKIE);
  if (session && (await verifyAdminSession(session, expectedToken))) {
    return { ok: true, via: "cookie", session };
  }

  return { ok: false, via: "none", session: "" };
}

async function createAdminSession(secret) {
  const payload = `v1.${Date.now()}`;
  const signature = await hmacHex(secret, payload);
  return `${payload}.${signature}`;
}

async function verifyAdminSession(session, secret) {
  const parts = String(session || "").split(".");
  if (parts.length !== 3 || parts[0] !== "v1") {
    return false;
  }

  const createdAt = Number(parts[1]);
  if (!Number.isFinite(createdAt) || Date.now() - createdAt > ADMIN_SESSION_MAX_AGE_SECONDS * 1000) {
    return false;
  }

  const payload = `${parts[0]}.${parts[1]}`;
  const expectedSignature = await hmacHex(secret, payload);
  return timingSafeEqual(parts[2], expectedSignature);
}

async function createCsrfToken(session, secret) {
  return hmacHex(secret, `csrf:${session}`);
}

async function verifyCsrfToken(token, session, secret) {
  if (!session) {
    return false;
  }

  const expectedToken = await createCsrfToken(session, secret);
  return timingSafeEqual(token, expectedToken);
}

async function hmacHex(secret, payload) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return bytesToHex(new Uint8Array(signature));
}

async function reportRateLimitKey(request, env, reporterEmail) {
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
  const salt = env.RATE_LIMIT_SALT || env.ADMIN_TOKEN || "kimchi-canary-report-salt";
  const digest = await sha256Hex(`${salt}:${reporterEmail.toLowerCase()}:${ip}`);
  return digest.slice(0, 64);
}

async function enforceReportRateLimit(env, reporterKey) {
  const recent = await env.DB.prepare(
    `select count(*) as count
     from reports
     where reporter_key = ? and created_at > datetime('now', '-1 hour')`,
  )
    .bind(reporterKey)
    .first();

  if (Number(recent?.count || 0) >= 6) {
    throw new PublicError("Too many reports from this submitter. Please try again later.", 429);
  }
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(digest));
}

function bytesToHex(bytes) {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function getCookie(request, name) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = cookieHeader.split(";").map((item) => item.trim());
  const prefix = `${name}=`;
  const cookie = cookies.find((item) => item.startsWith(prefix));
  if (!cookie) {
    return "";
  }

  try {
    return decodeURIComponent(cookie.slice(prefix.length));
  } catch {
    return "";
  }
}

function serializeCookie(name, value, maxAge) {
  return `${name}=${encodeURIComponent(value)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
}

function isLocalHost(hostname) {
  return ["localhost", "127.0.0.1", "0.0.0.0"].includes(hostname);
}

function acceptsHtml(request) {
  const accept = request.headers.get("accept") || "";
  return accept.includes("text/html");
}

function timingSafeEqual(left, right) {
  const leftValue = String(left || "");
  const rightValue = String(right || "");
  if (!leftValue || !rightValue || leftValue.length !== rightValue.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < leftValue.length; index += 1) {
    mismatch |= leftValue.charCodeAt(index) ^ rightValue.charCodeAt(index);
  }
  return mismatch === 0;
}

function htmlResponse(body, init = {}) {
  return new Response(body, {
    ...init,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "cross-origin-opener-policy": "same-origin",
      "content-security-policy":
        "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'; form-action 'self'",
      ...(init.headers || {}),
    },
  });
}

function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      ...JSON_HEADERS,
      "x-robots-tag": "noindex, noarchive",
      ...(init.headers || {}),
    },
  });
}

function svgResponse(body) {
  return new Response(body, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=86400",
      "x-content-type-options": "nosniff",
    },
  });
}

function pngResponse(base64Body) {
  return new Response(base64ToBytes(base64Body), {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=86400",
      "x-content-type-options": "nosniff",
    },
  });
}

function javascriptResponse(body) {
  return new Response(body, {
    headers: {
      "content-type": "text/javascript; charset=utf-8",
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
    },
  });
}

function textResponse(body) {
  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
      "x-content-type-options": "nosniff",
    },
  });
}

function xmlResponse(body) {
  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
      "x-content-type-options": "nosniff",
    },
  });
}

function manifestResponse(body) {
  return new Response(body, {
    headers: {
      "content-type": "application/manifest+json; charset=utf-8",
      "cache-control": "public, max-age=86400",
      "x-content-type-options": "nosniff",
    },
  });
}

function renderRobots(origin) {
  return `User-agent: *
Disallow: /admin
Disallow: /api/
Allow: /

Sitemap: ${origin}/sitemap.xml
`;
}

function renderSitemap(origin) {
  const latestDate = latestPublicDate();
  const homeAlternates = [
    ...LANGUAGES.map((language) => [language.code, homeUrlForLanguage(origin, language.code)]),
    ["x-default", `${origin}/`],
  ];
  const urls = [
    ...LANGUAGES.map((language) => ({
      loc: homeUrlForLanguage(origin, language.code),
      changefreq: "weekly",
      priority: language.code === "en" ? "1.0" : "0.9",
      lastmod: latestDate,
      alternates: homeAlternates,
    })),
    { loc: `${origin}/assessment`, changefreq: "weekly", priority: "0.9", lastmod: latestDate },
    { loc: `${origin}/watchlist`, changefreq: "weekly", priority: "0.9", lastmod: latestDate },
    { loc: `${origin}/report`, changefreq: "monthly", priority: "0.7", lastmod: latestDate },
    { loc: `${origin}/methodology`, changefreq: "monthly", priority: "0.8", lastmod: latestDate },
    { loc: `${origin}/kit`, changefreq: "monthly", priority: "0.8", lastmod: latestDate },
    ...PUBLIC_CASES.map((item) => ({ loc: `${origin}/cases/${item.id}`, changefreq: "monthly", priority: "0.7", lastmod: item.date })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (item) => `  <url>
    <loc>${xmlEscape(item.loc)}</loc>
${(item.alternates || [])
  .map(([hreflang, href]) => `    <xhtml:link rel="alternate" hreflang="${xmlEscape(hreflang)}" href="${xmlEscape(href)}" />`)
  .join("\n")}
    <lastmod>${xmlEscape(item.lastmod)}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
}

function latestPublicDate() {
  return PUBLIC_CASES.map((item) => item.date)
    .sort()
    .at(-1);
}

function xmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function base64ToBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

class PublicError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
