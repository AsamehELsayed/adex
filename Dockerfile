FROM node:20-bookworm-slim AS base
WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      python3 make g++ pkg-config && \
    rm -rf /var/lib/apt/lists/*

FROM base AS deps
COPY package.json package-lock.json ./
COPY .npmrc* ./
RUN npm ci --legacy-peer-deps

FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY next.config.mjs ./ 
COPY middleware.js ./

USER nextjs
EXPOSE 3000
ENV PORT=3000

# ✅ Use the proper start command
CMD ["npm", "run", "start"]
