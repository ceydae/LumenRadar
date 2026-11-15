# Lumen Radar landing

React, TypeScript, and Vite.

```sh
npm ci
npm run dev
```

Development and preview use `http://127.0.0.1:3050`. Build and check with:

```sh
npm run lint
npm run build
npm run preview
```

To serve the production build locally, run `npm start`.

From the repository root, start the landing page, API, and PostgreSQL:

```sh
docker compose up
```

The default root setup runs Vite with hot reload. Source edits update the running app automatically.
For production, run `docker compose -f compose.prod.yaml up -d --build` from the root.
Production serves the compiled `dist/` files without source mounts or file watchers.

Both images use `node:24-bookworm-slim`, matching the API, and run as the `node` user.
Docker publishes the landing page only on `127.0.0.1:3050`.
The container listens on its internal network interface so Docker can forward requests.

Inside `apps/landing`, use `docker compose -f compose.yaml -f compose.dev.yaml up` for development,
or `docker compose up -d --build` for production.
