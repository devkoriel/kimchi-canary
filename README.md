# Kimchi Canary

Kimchi Canary is a Cloudflare Worker site for Web3 HR, security, and compliance teams screening for DPRK remote IT worker fraud indicators.

The site is intentionally conservative:

- public cases are limited to official public sources such as FBI, DOJ, OFAC, or equivalent authorities
- private reports enter a moderation queue and are not published automatically
- the questionnaire scores observed facts and recommends next steps; it does not accuse a person
- South Korea-specific interview prompts are claim-specific consistency checks only; use them only when the candidate claims South Korea location, education, employment, or work authorization
- nationality-only screening, political loyalty tests, and humiliation prompts are explicitly excluded

## SEO Surface

The Worker serves:

- `/` with canonical, Open Graph, Twitter card, hreflang, and JSON-LD metadata
- `/og.png` as the first-party share card, generated from `/og.svg`
- `/favicon.ico`, `/favicon.svg`, `/favicon.png`, and `/apple-touch-icon.png`
- `/robots.txt`
- `/sitemap.xml`

## Local Development

```sh
npm install
npm run build:og
npm test
npm run dev
```

## D1 Setup

Create a D1 database and replace `database_id` in `wrangler.jsonc`:

```sh
npm run db:create
npm run db:migrate:remote
```

Set an admin token before deployment:

```sh
wrangler secret put ADMIN_TOKEN
```

Open `/admin?token=...` to view private reports.

Admin moderation supports three states:

- `pending` keeps a report private
- `approved` allows the report to appear as a reviewed community submission
- `rejected` keeps it out of the public site

Public watchlist entries in `src/cases.js` should stay limited to official or equivalently reliable public records. Do not add social-media accusations or unverified screenshots as public cases.

## Deployment

```sh
npm run deploy
```

The production domain is `kimchicanary.xyz`. Add the domain to Cloudflare DNS if it is not already in the authenticated Cloudflare account, then deploy the Worker route from `wrangler.jsonc`.

## GitHub Deployment

Pushes to `main` deploy through `.github/workflows/deploy.yml`. Add this GitHub Actions secret before relying on automatic deploys:

```text
CLOUDFLARE_API_TOKEN
```

The token needs permission to deploy Workers and read/update the D1 binding in the Cloudflare account.
