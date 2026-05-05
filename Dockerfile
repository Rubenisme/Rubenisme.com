# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM oven/bun:1 AS build
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# ── Stage 2: Serve ───────────────────────────────────────────────────────────
# nginx-unprivileged runs as non-root on port 8080
FROM nginxinc/nginx-unprivileged:alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
