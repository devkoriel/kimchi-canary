import { PUBLIC_CASES } from "./cases.js";
import { getStrings } from "./i18n.js";
import { renderAdmin, renderAssessment, renderHome, renderOgImage } from "./render.js";
import { assessCandidate, SIGNALS } from "./scoring.js";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

const PRODUCTION_ORIGIN = "https://kimchicanary.xyz";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const publicOrigin = isLocalHost(url.hostname) ? url.origin : PRODUCTION_ORIGIN;

    try {
      if ((request.method === "GET" || request.method === "HEAD") && url.pathname === "/") {
        const language = normalizeLanguage(url.searchParams.get("lang") || request.headers.get("accept-language"));
        const approvedReports = await listApprovedReports(env);
        const response = htmlResponse(renderHome({ language, reportsEnabled: Boolean(env.DB), approvedReports, origin: publicOrigin }));
        return request.method === "HEAD" ? new Response(null, { status: response.status, headers: response.headers }) : response;
      }

      if ((request.method === "GET" || request.method === "HEAD") && url.pathname === "/og.svg") {
        const response = svgResponse(renderOgImage());
        return request.method === "HEAD" ? new Response(null, { status: response.status, headers: response.headers }) : response;
      }

      if (request.method === "GET" && url.pathname === "/robots.txt") {
        return textResponse(renderRobots(publicOrigin));
      }

      if (request.method === "GET" && url.pathname === "/sitemap.xml") {
        return xmlResponse(renderSitemap(publicOrigin));
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

      if (request.method === "GET" && url.pathname === "/admin") {
        return renderAdminPage(request, env);
      }

      return new Response("Not found", { status: 404 });
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

  await env.DB.prepare(
    `insert into reports (
      reporter_email,
      organization,
      subject_name,
      source_url,
      narrative,
      status,
      created_at
    ) values (?, ?, ?, ?, ?, 'pending', datetime('now'))`,
  )
    .bind(report.reporterEmail, report.organization, report.subjectName, report.sourceUrl, report.narrative)
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
      `select id, subject_name, source_url, narrative, reviewed_at, created_at
       from reports
       where status = 'approved'
       order by reviewed_at desc, created_at desc
       limit 30`,
    ).all();

    return results || [];
  } catch {
    return [];
  }
}

async function updateReportStatus(request, env) {
  if (!env.DB || !env.ADMIN_TOKEN) {
    throw new PublicError("Admin moderation is not configured.", 503);
  }

  if (!isAuthorized(request, env.ADMIN_TOKEN)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const id = Number(new URL(request.url).pathname.split("/")[4]);
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new PublicError("Invalid report id.", 400);
  }

  const payload = await readBody(request);
  const status = normalizeString(payload.status, 20);
  const reviewerNote = normalizeString(payload.reviewerNote, 1000);
  if (!["approved", "rejected", "pending"].includes(status)) {
    throw new PublicError("Invalid moderation status.", 400);
  }

  await env.DB.prepare(
    `update reports
     set status = ?, reviewer_note = ?, reviewed_at = datetime('now')
     where id = ?`,
  )
    .bind(status, reviewerNote, id)
    .run();

  if (acceptsHtml(request)) {
    const url = new URL(request.url);
    return Response.redirect(`${url.origin}/admin?token=${encodeURIComponent(url.searchParams.get("token") || "")}`, 303);
  }

  return jsonResponse({ ok: true, status });
}

async function renderAdminPage(request, env) {
  if (!env.DB || !env.ADMIN_TOKEN) {
    return htmlResponse(renderAdmin({ reports: [], tokenPresent: false }), { status: 503 });
  }

  if (!isAuthorized(request, env.ADMIN_TOKEN)) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "www-authenticate": 'Bearer realm="kimchi-canary-admin"' },
    });
  }

  const { results } = await env.DB.prepare(
    `select id, reporter_email, organization, subject_name, source_url, narrative, status, created_at, reviewed_at, reviewer_note
     from reports
     order by created_at desc
     limit 100`,
  ).all();

  const url = new URL(request.url);
  return htmlResponse(renderAdmin({ reports: results || [], tokenPresent: true, token: url.searchParams.get("token") || "" }));
}

function validateReport(payload) {
  const reporterEmail = normalizeString(payload.reporterEmail, 320);
  const organization = normalizeString(payload.organization, 160);
  const subjectName = normalizeString(payload.subjectName, 200);
  const sourceUrl = normalizeString(payload.sourceUrl, 1000);
  const narrative = normalizeString(payload.narrative, 6000);

  if (!isEmail(reporterEmail)) {
    throw new PublicError("A valid reporter email is required.", 400);
  }

  if (subjectName.length < 2) {
    throw new PublicError("A suspect display name, handle, or profile URL is required.", 400);
  }

  if (narrative.length < 30) {
    throw new PublicError("Please include observed facts, dates, systems, and evidence details.", 400);
  }

  if (sourceUrl && !isHttpUrl(sourceUrl)) {
    throw new PublicError("Source URL must begin with http:// or https://.", 400);
  }

  if (payload.acknowledge !== "yes") {
    throw new PublicError("You must acknowledge the private moderation policy.", 400);
  }

  return { reporterEmail, organization, subjectName, sourceUrl, narrative };
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

function isAuthorized(request, expectedToken) {
  const url = new URL(request.url);
  const queryToken = url.searchParams.get("token");
  const authHeader = request.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";
  return timingSafeEqual(queryToken || bearer, expectedToken);
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
      "referrer-policy": "no-referrer-when-downgrade",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      ...(init.headers || {}),
    },
  });
}

function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      ...JSON_HEADERS,
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

function renderRobots(origin) {
  return `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;
}

function renderSitemap(origin) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
}

class PublicError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
