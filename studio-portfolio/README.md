# studio-portfolio

Standalone [Sanity Studio](https://www.sanity.io/) for **logansturrock.com**.

- **Project ID:** `aiajifvh`
- **Dataset:** `production`
- **Base path:** `/studio`

This Studio is intentionally standalone (not embedded in the static site). The
front-end (`../portfolio.html`) reads published content over the public Sanity
HTTP API from client-side JS — no token in the browser.

## Develop

```bash
cd studio-portfolio
npm install
npm run dev          # → http://localhost:3333/studio
```

The first time you open the Studio in the browser, you'll be asked to log in
with the Sanity account that owns project `aiajifvh`.

## Useful commands

```bash
npm run dev            # local Studio at /studio
npm run build          # production build (static, in ./dist)
npm run schema:deploy  # push schema to the Content Lake (for MCP/typegen)
npx sanity deploy      # deploy Studio to Sanity's hosting (*.sanity.studio)
npx sanity cors add <origin> --credentials   # manage CORS origins
```

## Schema

- `project` — a portfolio project (cover image, gallery, description, tags, year, order, external link).
- `siteSettings` — singleton for name/tagline, featured image, About, and contact email.
