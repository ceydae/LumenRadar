# LumenRadar Docs

Polished documentation shell for the LumenRadar product suite.

## Quick start

```bash
# Development — serves on http://127.0.0.1:3053
npm run dev

# Production build
npm run build
npm start
```

## Ports

| App | URL |
|-----|-----|
| Landing | http://127.0.0.1:3050 |
| Dashboard | http://127.0.0.1:3051 |
| Docs | http://127.0.0.1:3053 |

## Docker

```bash
docker compose build docs
docker compose up -d docs
docker compose down
```

The container publishes port **3053** on the host and listens on `0.0.0.0` inside the container.

## Cross-app links

Set `NEXT_PUBLIC_LANDING_URL` and `NEXT_PUBLIC_DASHBOARD_URL` in the
environment to point the navbar links at the correct apps. Development
defaults are `http://127.0.0.1:3050` and `http://127.0.0.1:3051`.

## Design

- Colors and typography match the [dashboard's `DESIGN.md`](https://github.com/ceydae/LumenRadar/tree/main/apps/dashboard/DESIGN.md).
- Brand assets come from the [Lumen_Radar_Brand_Kit](https://github.com/ceydae/LumenRadar/tree/main/apps/Lumen_Radar_Brand_Kit).
- Light and dark modes are supported; the user's choice is persisted in
  `localStorage`.

## Adding documentation

Create `.mdx` files in `content/docs/` and extend the navigation in
`src/components/docs-layout.tsx`. The interface shell is ready to receive
real content.
