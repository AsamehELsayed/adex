# Base
FROM node:20-bookworm-slim AS base
WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 make g++ pkg-config && \
    rm -rf /var/lib/apt/lists/*

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Build app
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only what يحتاجه runtime
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=deps /app/node_modules ./node_modules
COPY next.config.mjs ./ 
COPY middleware.js ./ 

USER nextjs
EXPOSE 3000
CMD ["./node_modules/.bin/next", "start", "-p", "3000", "-H", "0.0.0.0"]
