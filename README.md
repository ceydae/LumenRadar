# Lumen Radar

Start development from this folder:

```sh
docker compose up
```

Source edits reload the API and update the landing page and dashboard automatically. No `--watch` flag is needed.
Code is mounted read-only; each container keeps its own Linux dependencies.
After changing dependencies or a Dockerfile, run `docker compose up --build` again.

Start production with compiled builds and no file watchers or source mounts:

```sh
docker compose -f compose.prod.yaml up -d --build
```

Production requires HTTPS values for `BETTER_AUTH_URL` and `CLIENT_ORIGIN` in `apps/api/.env`.
Both modes use the existing PostgreSQL volume. Switching modes replaces the app containers.

View development status and logs:

```sh
docker compose ps
docker compose logs -f
```

Requires Docker Compose 2.20.3 or newer. The root Compose file includes the landing page,
API, dashboard, and PostgreSQL. It reads the API settings from `apps/api/.env`.
The project name stays `lumen-radar-api` to reuse the existing database volume.

| App | Local address |
| --- | --- |
| Landing | `http://127.0.0.1:3050` |
| API | `http://127.0.0.1:3051` |
| Dashboard | `http://127.0.0.1:3052` |

All published ports bind to `127.0.0.1`. PostgreSQL has no published port.
All apps use `node:24-bookworm-slim` and restart automatically after crashes.

Each app keeps its Dockerfile, production `compose.yaml`, development `compose.dev.yaml`,
and settings in its own folder. To add an app, include both files in the root `compose.yaml`:

```yaml
include:
  - path:
      - ./apps/<name>/compose.yaml
      - ./apps/<name>/compose.dev.yaml
```

Add its production `compose.yaml` to `compose.prod.yaml` too.
Use unique service and volume names across apps. Run the same root command after adding one.
See [Compose include](https://docs.docker.com/compose/how-tos/multiple-compose-files/include/)
for how app paths and environment files are resolved.
