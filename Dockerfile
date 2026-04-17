# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Generate tsoa routes + swagger spec, then compile TypeScript
RUN npx tsoa spec-and-routes
RUN npx tsc -p tsconfig.build.json

# swagger.json is not a TS file — copy it manually to the dist tree
RUN cp app/config/swagger.json dist/config/swagger.json

# ── Production stage ──────────────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
