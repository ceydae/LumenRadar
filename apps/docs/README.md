# Lumen Radar Docs

Next.js documentation app using Fumadocs UI, Core, and MDX. Four concise guides
cover the introduction, getting started, project overview, and data sources.
Content reflects the current dashboard: browser-local workspaces, project setup,
source selection, and empty reports while live collection is in development.

## Run locally

Use Node.js 22.22 or newer (required by the MDX file watcher).
From `apps/docs`:

```sh
npm ci
npm run dev
```

Docs serves at **http://127.0.0.1:3053/**. The development and start scripts
configure port 3053 directly. `/` renders the introduction directly. Production uses https://docs.lumenradar.com/.
Landing remains on 3050 and Dashboard on 3052.

```sh
npm run build
npm start
npm run typecheck
npm run lint
```

Copy `.env.example` to `.env.local` to customize `NEXT_PUBLIC_DASHBOARD_URL`.
It defaults to `http://127.0.0.1:3052` and is read at build time. The header's
only product navigation link is Dashboard, on both desktop and mobile.

## Docker

From the repository root, start the complete development stack:

```sh
docker compose up
```

For production, use `docker compose -f compose.prod.yaml up -d --build`.
Set `NEXT_PUBLIC_DASHBOARD_URL` before building to override the public Dashboard
link. The docs container binds to `0.0.0.0:3053`, while Compose publishes host
port **3053** on `127.0.0.1`.
The builder compiles `content/docs`; the standalone server includes those
routes and search. The runner copies `public`, including all brand assets.
`.source` is generated during installation/build and excluded from the build context.

Do not run a second server if port 3053 is occupied. Check its owner first;
the existing `lumen-radar-docs` container can be rebuilt with the commands above.
No fallback port is configured. Development explicitly binds to `0.0.0.0:3053`.

## Content and customization

`source.config.ts` defines the MDX collection. `src/lib/source.ts` supplies its
page tree, routes, TOC, pagination, and `/api/search` index. Page order lives in
`content/docs/meta.json`. Fumadocs generates `.source` during postinstall,
build, or typecheck; it is intentionally ignored by Git.

The layout uses Fumadocs' public header/container slots and sidebar options.
Search retains the built-in dialog and Ctrl/Cmd+K shortcut. The RootProvider
uses next-themes with system preference and persisted light/dark selection.

## Design sources

Primary source: `../landing/src/index.css`, reinforced by the header, hero,
and product sections. Exact palette values mapped to Fumadocs `--color-fd-*`:

| Role | Light | Dark |
| --- | --- | --- |
| Article background | `#ffffff` | `#04102a` (navy-950) |
| Sidebar / muted surface | `#f4f8fe` (ice-50) | `#071a3d` (navy-900) |
| Text | `#0b2757` (navy-800) | `#e8f0fc` (ice-100) |
| Muted text | `#4c629a` (muted-foreground) | `#9dbbf5` (blue-300) |
| Primary accent | `#244a97` (blue-600) | `#3fd6c9` (signal-400) |
| Border | `#d7e5f9` (ice-200) | `#123370` (navy-700) |
| Hover / secondary surface | `#e8f0fc` (ice-100) | `#0b2757` (navy-800) |
| Focus ring | `#3563c4` (blue-500) | `#3fd6c9` (signal-400) |

The landing imports **Plus Jakarta Sans Variable** for body/UI and **Space
Grotesk Variable** for display headings. Docs uses the same self-hosted
Fontsource families. `../dashboard/src/app/globals.css` confirms navy `#0b2757`,
blue `#244a97`, and Plus Jakarta Sans; its Brand component supplies the
reference for compact artwork proportions. Asset provenance is in
`public/brand/README.md`.

Both https://docs.lumixmarket.com/ and https://docs.blux.cc/ were visually
reviewed for hierarchy, sidebar density, article spacing, and genuine TOCs.
Their branding and product content are not used.

## Verification

Production build, typecheck, and ESLint pass. Browser smoke checks cover the
four root-level routes, legacy redirects, missing-page 404, sidebar state, previous/next
navigation, heading anchors, search results and keyboard shortcut, theme
persistence, light/dark logo variants, static assets, and mobile navigation.
Compose publishes host port 3053 with a container bind address of `0.0.0.0`.
Docker was not built or tested for the root-routing update. Rebuild an existing
container with the commands above to pick up the new routes.

The full-width layout uses Fumadocs' `--fd-layout-width: 100%`, a 268px sidebar,
fluid article region, and right-hand TOC. Prose alone has a reading-width limit;
the shell and previous/next navigation fill their available region. The global
focus rule excludes Fumadocs' search combobox, whose rounded dialog border
provides the focus indicator instead.

Desktop/mobile screenshots on port 3053 are in ignored `artifacts/correction/`.

The old `/docs` and `/docs/:path*` URLs permanently redirect (308) to `/` and
`/:path*`, preserving query parameters. Search remains at `/api/search`.
Canonical URLs use https://docs.lumenradar.com/ and each page
title follows `Page title - Lumen Radar Docs`.
