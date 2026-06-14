# maxdpi.github.io

Static portfolio site for **logansturrock.com**, with content managed in
[Sanity](https://www.sanity.io/) (project `aiajifvh`, dataset `production`).

The site itself is plain HTML/CSS/JS and ships as static files (no build step).
`portfolio.html` reads **published** content from Sanity over the public API,
client-side, with no token.

## Local development

One command runs both the static site and the Sanity Studio:

```bash
npm install      # first time only (installs dev tooling)
npm run dev
```

- **Static site:** http://localhost:8000/portfolio.html
- **Studio:** http://localhost:3333/studio

Run them individually with `npm run dev:site` or `npm run dev:studio`.

> The root `package.json` is **dev tooling only** (concurrently + http-server).
> It is not part of the production deploy — the site is served as static files.
> See `NETLIFY.md` for hosting plans and `studio-portfolio/README.md` for the
> Studio.

## Content

Edit content in the Studio (Site Settings + Projects). To re-seed sample
content from the local images:

```bash
cd studio-portfolio
npx sanity login            # once
node scripts/seed.mjs       # projects (K7, Maar) + siteSettings
node scripts/seed-settings.mjs   # starter About/tagline
```
