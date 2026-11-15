# Lumen Radar API

Express, TypeScript, Better Auth, and PostgreSQL. Discord is the only login provider.
Source code and tests live in `src/`. Build output goes to `dist/`.

## Run locally

Requires Node.js 24+ and PostgreSQL.

```sh
npm ci
cp .env.example .env
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

Put that generated value in `BETTER_AUTH_SECRET`. Set `DATABASE_URL` to your PostgreSQL database, then:

```sh
createdb lumen_radar
npm run db:migrate
npm run dev
```

The `.env` created during setup already has a generated secret and the working local database URL.
The API runs at `http://localhost:3000`. Swagger is at `/docs`, with the spec at `/openapi.json`.
Discord login returns 503 until both Discord credentials are set.

## Discord setup

Create an application in the [Discord Developer Portal](https://discord.com/developers/applications).
Copy its OAuth2 client ID and secret into `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET`.
Register this redirect URL exactly:

```text
http://localhost:3000/api/auth/callback/discord
```

`CLIENT_ORIGIN` is the frontend origin, currently `http://localhost:5173`.
Change it when your frontend runs elsewhere.

## Login

From the frontend:

```ts
const response = await fetch('http://localhost:3000/api/auth/sign-in/social', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'discord',
    callbackURL: window.location.origin,
    errorCallbackURL: window.location.origin,
  }),
});

if (!response.ok) throw new Error('Could not start Discord login.');
const { url } = await response.json();
window.location.assign(url);
```

After Discord redirects back, the browser has an HttpOnly session cookie. The database stores
the user's name, email, avatar, Discord account ID, encrypted OAuth tokens, and session.
Discord accounts without an email cannot sign in. The frontend receives an `error` query parameter
if approval is denied or the callback fails.

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/auth/sign-in/social` | Start Discord login |
| GET | `/api/auth/callback/discord` | Finish login, called by Discord |
| GET | `/api/auth/get-session` | Read the session and user, or null |
| GET | `/api/auth/token` | Get a signed JWT using the session cookie |
| GET | `/api/auth/jwks` | Public JWT verification keys |
| POST | `/api/auth/sign-out` | Delete the session and clear its cookie |

Sessions and JWTs each last seven days. Active sessions can renew. JWTs have issuer `BETTER_AUTH_URL`,
audience `lumen-radar`, and the user ID as `sub`. JWTs use Better Auth's JWT plugin and database-backed
signing keys. Sign-out revokes the session; an already issued JWT remains valid until it expires.
The JWT is separate from the session cookie. `/token` requires the cookie, not a JWT bearer token.

Use `credentials: 'include'` for session, token, and sign-out requests. The frontend and API should
share a site in production, for example `app.example.com` and `api.example.com`, so browser cookie
restrictions do not block the session.

## Build and checks

```sh
npm run check
npm run test:coverage
npm run build
NODE_ENV=production npm run db:migrate:prod
NODE_ENV=production npm start
```

Production requires HTTPS URLs and Discord credentials. Environment variables set by the host
take precedence over `.env`. The compiled server and migration command work without `tsx`.
No schema changes run automatically when the server starts.

Tests need PostgreSQL. They use `TEST_DATABASE_URL`, or `DATABASE_URL` if unset. Each integration
suite creates and drops its own random schema. The database role needs permission to create schemas.
Discord HTTP responses are mocked; PostgreSQL writes, sessions, JWT signatures, and expiry checks are real.
Use `npm run test:watch` while editing.

Auth setup follows Better Auth's [Express integration](https://better-auth.com/docs/integrations/express),
[PostgreSQL adapter](https://better-auth.com/docs/adapters/postgresql), and
[JWT plugin](https://better-auth.com/docs/plugins/jwt).
