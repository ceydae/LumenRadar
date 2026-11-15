# Lumen Radar

Run all configured apps from this folder:

```sh
docker compose up -d --build
```

View status and logs:

```sh
docker compose ps
docker compose logs -f
```

Requires Docker Compose 2.20.3 or newer. The root Compose file currently includes the API
and PostgreSQL. It reads the API settings from `apps/api/.env`.
The project name stays `lumen-radar-api` to reuse the existing database volume.

Each app keeps its own Dockerfile, Compose file, and `.env`. To add an app, create
`apps/<name>/compose.yaml` and add its path to the root `include` list:

```yaml
include:
  - path: ./apps/api/compose.yaml
  - path: ./apps/<name>/compose.yaml
```

Use unique service and volume names across apps. Run the same root command after adding one.
See [Compose include](https://docs.docker.com/compose/how-tos/multiple-compose-files/include/)
for how app paths and environment files are resolved.
