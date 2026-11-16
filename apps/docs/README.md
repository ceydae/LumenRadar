# Lumen Radar Docs

User documentation for teams managing Stellar projects through the Lumen Radar
dashboard. The public collection lives in `content/docs` and covers introduction,
getting started, projects, website preparation, tracker installation and
verification, API tracking, analytics interpretation, and troubleshooting.

The guides distinguish supported dashboard tasks from installation prerequisites
that the dashboard does not yet supply. Customer integration examples belong in
the website guides. Service administration and internal API instructions do not
belong in this collection.

## Content and navigation

Fumadocs MDX supplies page bodies, descriptions, heading anchors, tables of
contents, previous/next navigation, and search entries. Update `meta.json` when
adding or removing guides. Search at `/api/search` is generated from the same
source collection; there is no separate editorial search index to maintain.

Documentation lives at the site root, with no `/docs` prefix. Local preview uses
`http://127.0.0.1:3053/`; production canonicals use
`https://docs.lumenradar.com/`. Titles follow `Page title - Lumen Radar Docs`.
`next.config.mjs` preserves old root and `/docs` links through redirects,
including removed analytics-administration and metrics pages.

## App and design

Keep the Fumadocs layout and search components, official assets in `public/brand`,
navy/blue palette, self-hosted Plus Jakarta Sans and Space Grotesk fonts,
full-width responsive shell, and light/dark theme behavior. The header's only
product navigation link is Dashboard. Its destination is defined in
`src/lib/links.ts` using the existing configuration.

## Local checks

Run these from this directory with the installed dependencies:

```sh
npm run typecheck
npm run lint
npm run build
```

Do not start another server when the existing preview is running. A running
production preview may contain an older build; local checks do not refresh it.
Working notes and verification artifacts belong in the ignored `artifacts/`
directory, outside the public content collection.
