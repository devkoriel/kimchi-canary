import assert from "node:assert/strict";
import test from "node:test";
import worker from "../src/index.js";

test("serves crawl assets with multilingual alternates", async () => {
  const env = {};
  const robots = await worker.fetch(new Request("https://kimchicanary.xyz/robots.txt"), env);
  const robotsText = await robots.text();

  assert.equal(robots.headers.get("content-type"), "text/plain; charset=utf-8");
  assert.match(robotsText, /Disallow: \/admin/);
  assert.match(robotsText, /Disallow: \/api\//);
  assert.match(robotsText, /Sitemap: https:\/\/kimchicanary\.xyz\/sitemap\.xml/);

  const sitemap = await worker.fetch(new Request("https://kimchicanary.xyz/sitemap.xml"), env);
  const sitemapText = await sitemap.text();

  assert.equal(sitemap.headers.get("content-type"), "application/xml; charset=utf-8");
  assert.match(sitemapText, /xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/);
  assert.match(sitemapText, /<loc>https:\/\/kimchicanary\.xyz\/<\/loc>/);
  assert.match(sitemapText, /hreflang="ko" href="https:\/\/kimchicanary\.xyz\/\?lang=ko"/);
  assert.match(sitemapText, /<loc>https:\/\/kimchicanary\.xyz\/methodology<\/loc>/);
});

test("serves manifest and keeps private/API surfaces out of search", async () => {
  const env = {};
  const manifest = await worker.fetch(new Request("https://kimchicanary.xyz/site.webmanifest"), env);
  const manifestJson = await manifest.json();

  assert.equal(manifest.headers.get("content-type"), "application/manifest+json; charset=utf-8");
  assert.equal(manifestJson.name, "Kimchi Canary");
  assert.equal(manifestJson.theme_color, "#000403");
  assert.equal(manifestJson.icons.length, 2);

  const api = await worker.fetch(new Request("https://kimchicanary.xyz/api/cases"), env);
  assert.match(api.headers.get("x-robots-tag") || "", /noindex/);

  const admin = await worker.fetch(new Request("https://kimchicanary.xyz/admin"), env);
  assert.match(admin.headers.get("x-robots-tag") || "", /noindex/);
});

test("admin token login opens the private moderation queue", async () => {
  const adminToken = "not-a-secret-test-value";
  const env = {
    ADMIN_TOKEN: adminToken,
    DB: {
      prepare() {
        return {
          all: async () => ({
            results: [
              {
                id: 7,
                reporter_email: "reviewer@example.com",
                organization: "Example DAO",
                subject_name: "suspect-profile",
                subject_profile_url: "https://example.com/profile",
                source_url: "https://example.com/evidence",
                evidence_summary: "Public source and internal notes available.",
                evidence_type: "source,profile",
                contact_permission: "yes",
                narrative: "Observed facts with timestamps, source URL, and screening context.",
                status: "pending",
                created_at: "2026-04-30 12:00:00",
                reviewed_at: "",
                reviewer_note: "",
                reviewer_name: "",
                reviewer_confidence: "",
              },
            ],
          }),
        };
      },
    },
  };

  const login = await worker.fetch(
    new Request("https://kimchicanary.xyz/admin/login", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams([["token", adminToken]]),
    }),
    env,
  );
  const cookie = login.headers.get("set-cookie") || "";

  assert.equal(login.status, 303);
  assert.match(cookie, /kc_admin=/);

  const admin = await worker.fetch(new Request("https://kimchicanary.xyz/admin", { headers: { cookie } }), env);
  const html = await admin.text();

  assert.equal(admin.status, 200);
  assert.match(html, /Private reports awaiting review/);
  assert.match(html, /suspect-profile/);
  assert.match(html, /Approve/);
  assert.match(html, /Reject/);
});
