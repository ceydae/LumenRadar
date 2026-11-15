FROM node:24-bookworm-slim AS dependencies

WORKDIR /app

COPY package.json package-lock.json* source.config.ts next.config.mjs ./
RUN npm ci --no-audit --no-fund

FROM dependencies AS development

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
COPY --chown=node:node . .
RUN npm run postinstall && \
    chown node:node /app && \
    chown -R node:node /app/.source

USER node
EXPOSE 3053

CMD ["node", "node_modules/next/dist/bin/next", "dev", "--hostname", "0.0.0.0", "--port", "3053"]

FROM dependencies AS build

ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_DASHBOARD_URL=http://127.0.0.1:3052
ENV NEXT_PUBLIC_DASHBOARD_URL=$NEXT_PUBLIC_DASHBOARD_URL
COPY . .

RUN npm run build

FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3053
ENV HOSTNAME=0.0.0.0
WORKDIR /app

COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

USER node
EXPOSE 3053

CMD ["node", "server.js"]
