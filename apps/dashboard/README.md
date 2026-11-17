# Lumen Radar

Next.js App Router and TypeScript starter.

## UI foundation

Animate UI, Motion, and Radix UI are installed. The root client provider
follows the system's reduced-motion preference. Tailwind CSS supplies the styling
foundation. Animate UI powers connection dialogs and metric tooltips.
It also powers chart metric tabs. On the MVP installation page, Animate UI's
Accordion handles the setup guide and CopyButton / CopyButtonIcon animate the
copy action and its success state. The existing provider respects reduced motion.
Plus Jakarta Sans is self-hosted through
Fontsource. Assets in `public/brand` and the favicons come from the supplied
Lumen Radar brand kit; the SVG viewBoxes are trimmed to remove export padding.

Use Animate UI's per-primitive imports when adding interactive components:
`@animate-ui/react/primitives/radix-ui/<primitive>`.

Documentation: https://animate-ui.com/docs

## Source structure

- `src/app`: Next.js routes and root providers. Pages render containers only.
- `src/containers`: screen composition, state, and sections combining components.
  `Dashboard` orchestrates `Sidebar`, `Header`, and `Overview`. Overview delegates
  each section to its own container.
- `src/components`: reusable presentation units, with no fixture imports.
- `src/data`: deterministic demo fixtures, separate from presentation.
- `src/types`: shared domain types.
- `src/constants`: navigation configuration.
- `src/utils`: class merging and number formatting.

The analytics Overview is commented out for the MVP. Other navigation items are
disabled until their pages are built. Authentication and project management use
the API. Website tracking, reports, and OpenTelemetry collection are not available yet.

## Discord sign-in and project flow

`/login` is the single entry page for new and returning users. It offers only
Continue with Discord; `/signup` redirects there. The client follows the contract
at http://localhost:3051/docs: POST `/api/auth/sign-in/social` with `provider`,
`callbackURL`, and `errorCallbackURL`, then navigate to the returned Discord URL.
The API creates accounts on first sign-in. Requests include credentials; the API's
HttpOnly cookie authenticates GET `/api/auth/get-session` and POST `/api/auth/sign-out`.

After sign-in, `/` shows the account's projects and a square Create Project tile.
Each account can have five projects. The API enforces this
limit under a transaction lock so concurrent requests cannot exceed it.
`/projects/new` collects the name, website URL, and Stellar description (200
characters maximum). The first step keeps an in-memory draft; the second step
offers Website analytics, with API analytics and Website & API disabled and labelled
Coming Soon. Only the final submission creates the project, sending `streamName`,
`websiteUrl`, `description`, and `mode: "web"` to POST `/api/projects`.
Reloading before submission discards the draft. Existing project setup routes
redirect to the project. `/onboarding` redirects to the new project route.
The client unwraps `{ projects }` and `{ project }` responses and maps API fields
to its interface model.

The project route reads GET `/api/projects/:id` using the API UUID. The route
keeps the selected project stable when the list refreshes or the page reloads.
Edit project reuses the details form in an Animate UI Dialog and saves through
PATCH `/api/projects/:id`. Delete project asks for confirmation in an Animate UI AlertDialog,
handles the empty 204 response, and returns to the project list after deletion.
These controls use the existing styles and do not add another navigation route.
The installation panel keeps its layout while settings are open; dialogs trap
focus, return it to their trigger on close, and respect reduced motion. Pending
requests keep the relevant dialog open, and failures leave the form available to retry.
Project errors retain the API status, code, and message. A 401 clears the current
session and project cache and returns the user to Discord sign-in. Sign-out also
clears cached projects; late responses cannot restore them. A project-limit
response refreshes the list so projects created in another tab are reflected.

`/projects/:id` opens that project's installation page. For the MVP, the overview
charts, metrics, connection dialog, and date filter are commented out in Dashboard
and Header. The page shows a brand banner, the installation panel, and an expandable
setup guide, without data-dependent widgets. The installation panel is labelled
Coming Soon: the current API does not provide a tracker endpoint. There is no
copyable script or collection request until the backend exposes that contract.

Sessions are checked on mount, window focus, and every minute. Old browser-local
sessions cannot authenticate. Sign-out clears the server session. Saved projects
are persisted by the API and every project request is scoped to the
authenticated user ID. Legacy browser-local project drafts are not imported.

Use http://localhost:3052 with the local API at http://localhost:3051. Set the API's
`CLIENT_ORIGIN=http://localhost:3052` and configure Discord credentials and the
callback URL in the API environment. `localhost` and `127.0.0.1` are different
cookie hosts; the dashboard redirects local 127.0.0.1 visits to localhost when
the API uses localhost. Use the same host for both apps. For other deployments, set
`NEXT_PUBLIC_API_URL` before building the dashboard (including Docker builds),
and match the API's `CLIENT_ORIGIN` to the dashboard origin. No JWT is persisted
in browser storage. API or OAuth failures appear with a retry option.

## Development

The installation script uses `NEXT_PUBLIC_UMAMI_URL` from the dashboard environment.
Copy `.env.example` to `.env.local` for local development. For deployment, set it
to the public analytics origin, such as `https://analytics.example.com` (without
`/script.js`), in `apps/dashboard/.env` for Docker Compose or in the build
environment. Next.js embeds this value at build time; rebuild and redeploy the
dashboard after changing it. From this directory, run
`docker compose up -d --build dashboard`. A missing value shows a configuration
error instead of generating a localhost tracking script.

```sh
npm install
npm run dev
```

Open http://localhost:3052. Both development and production scripts bind locally on port 3052.

## Docker

From the repository root, start all apps in development mode:

```sh
docker compose up
```

Dashboard source edits reload automatically. For production:

```sh
docker compose -f compose.prod.yaml up -d --build
```

Both dashboard images use `node:24-bookworm-slim` and run as the `node` user.
Docker publishes only `127.0.0.1:3052`. Production uses Next.js standalone output,
with no source mounts or watchers. Both modes restart automatically after crashes.

Inside `apps/dashboard`, use `docker compose -f compose.yaml -f compose.dev.yaml up` for development,
or `docker compose up -d --build` for production.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
node --test src/lib/session.test.mjs
node --experimental-strip-types --test src/lib/workspace.test.mjs
```

Use `npm start` to serve a production build.
