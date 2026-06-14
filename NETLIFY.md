# Netlify deploy notes (not built yet)

This repo currently deploys via **GitHub Pages** (the `CNAME` file →
`logansturrock.com`). The eventual plan is to move hosting to **Netlify** so the
static site and the Sanity Studio can live behind one domain.

> Nothing here is wired up yet. This is a checklist for later — no deploy
> pipeline exists and the current GitHub Pages setup is untouched.

## Target layout

```
logansturrock.com/            → static site (index.html, portfolio.html, …) served from repo root
logansturrock.com/studio      → Sanity Studio (built from ./studio-portfolio)
```

## Static site (root)

- **Publish directory:** repo root (`.`)
- **Build command:** none (plain HTML/CSS/JS)
- The front-end reads **published** Sanity content over the public API from the
  browser — no token, no build step.

## Studio at `/studio`

The Studio is a standalone Vite app in `studio-portfolio/`. Two options:

1. **Sanity-hosted (simplest):** `cd studio-portfolio && npx sanity deploy` →
   serves at `https://<name>.sanity.studio`. Then (optionally) point
   `logansturrock.com/studio` at it with a Netlify redirect/proxy.
2. **Netlify-hosted at `/studio`:** build the Studio (`npm run build` in
   `studio-portfolio/`, output `dist/`) and publish it under the `/studio`
   path. Because `sanity.config.ts` already sets `basePath: '/studio'`, the
   routing matches. A monorepo-style Netlify config would build both:

   ```toml
   # netlify.toml (example — create when ready)
   [build]
     command = "cd studio-portfolio && npm ci && npm run build"
     publish = "."            # static site at root

   # Serve the built Studio under /studio
   [[redirects]]
     from = "/studio/*"
     to = "/studio/index.html"
     status = 200
   ```

   (You'd also copy `studio-portfolio/dist` into a root-level `/studio` folder
   during build, or use a second Netlify site — decide at build time.)

## Domain cutover (when ready)

1. Add the site in Netlify, connect this GitHub repo.
2. In Netlify **Domain settings**, add `logansturrock.com` (and `www`).
3. Update DNS at the registrar to Netlify (or use Netlify DNS).
4. **Remove the `CNAME` file** from the repo (it's GitHub-Pages-specific and
   will conflict) and disable GitHub Pages for the repo.
5. Add the production origin(s) to Sanity **CORS** (see below).

## Sanity CORS origins

The browser front-end fetches **anonymous, published** data (no credentials),
which the public API allows from any origin. Still, add explicit origins for
clarity / future credentialed use:

```bash
cd studio-portfolio
npx sanity cors add https://logansturrock.com
npx sanity cors add https://www.logansturrock.com
npx sanity cors add http://localhost:8000          # local static preview
```

Or via the dashboard: https://www.sanity.io/manage → project `aiajifvh` →
**API → CORS origins**.
