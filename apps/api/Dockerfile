FROM node:24-bookworm-slim AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm i

FROM dependencies AS development

ENV NODE_ENV=development
COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
COPY tests ./tests
COPY vitest.config.ts eslint.config.js ./

USER node
EXPOSE 3051

CMD ["sh", "-c", "node --import=tsx src/database/migrate.ts && exec node node_modules/tsx/dist/cli.mjs watch src/server.ts"]

FROM dependencies AS build

COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build && npm prune --omit=dev

FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build --chown=node:node /app/package.json /app/package-lock.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist

USER node
EXPOSE 3051

CMD ["sh", "-c", "node dist/database/migrate.js && exec node dist/server.js"]
