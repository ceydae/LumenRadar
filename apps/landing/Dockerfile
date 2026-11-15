FROM node:24-bookworm-slim AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS development

ENV NODE_ENV=development
ENV BROWSER=none
COPY . .
RUN chown -R node:node /app

USER node
EXPOSE 3050

CMD ["node", "node_modules/vite/bin/vite.js", "--host", "0.0.0.0", "--port", "3050", "--strictPort"]

FROM dependencies AS build

COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production
ENV NO_UPDATE_CHECK=1
WORKDIR /app

COPY --from=build --chown=node:node /app/package.json /app/package-lock.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist

USER node
EXPOSE 3050

CMD ["node", "node_modules/serve/build/main.js", "--single", "dist", "--listen", "tcp://0.0.0.0:3050", "--no-clipboard", "--no-port-switching"]
