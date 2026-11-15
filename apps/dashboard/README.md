# Lumen Radar

Next.js App Router and TypeScript starter.

## UI foundation

Animate UI, Motion, and Radix UI are installed. The root client provider
follows the system's reduced-motion preference. Tailwind CSS supplies the styling
foundation. Animate UI powers connection dialogs and metric tooltips.
It also powers chart metric tabs. Plus Jakarta Sans is self-hosted through
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

The Overview includes date filters, chart metric selection, CSV export for available
data, and connection details. New projects start with empty reports. Other navigation
items are disabled until their pages are built. There is no backend, tracker, or
live OpenTelemetry collector.

## Local account and project flow

`/signup` collects a name, email, password, and password confirmation. It creates
a browser-local profile scoped to the normalized email and signs the user in.
Duplicate profiles and mismatched passwords show form errors.

Signed-in visitors without a completed project go to `/onboarding`. The two steps
collect project details and select website analytics, API analytics, or both.
API selections require a service name. Saved project drafts resume at source
selection, and the Back button preserves project fields. Completing setup opens
the dashboard with the user's project and sources marked Awaiting data. Selecting
a source does not install a tracker or establish a real connection.

`/login` accepts a valid email and a password of at least six characters. This is
browser-only flow state, not real authentication. Only a version and email are
stored in localStorage; the password is never stored or sent to a server. Signing
out clears that session record; the account's project remains saved. Reloads preserve the session and other tabs synchronize
sign-in/out. Client redirects send signed-out visitors to `/login` and signed-in
visitors to `/`. Workspace records are stored separately per email. These redirects
do not provide server-side access control, and login does not verify credentials.

Replace `src/lib/session.ts` and `src/hooks/useLocalSession.ts` when implementing
server authentication. The user-facing interface intentionally has no demo labels.

## Development

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3052. Both development and production scripts bind locally on port 3052.

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
```

Use `npm start` to serve a production build.
