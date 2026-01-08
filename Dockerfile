FROM node:20-bookworm-slim AS base

# Set working directory
WORKDIR /app

# Install system dependencies needed for native modules (mysql2, sqlite3)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      python3 make g++ pkg-config && \
    rm -rf /var/lib/apt/lists/*

FROM base AS deps

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
# Copy .npmrc if it exists to respect legacy-peer-deps setting
COPY .npmrc* ./

RUN npm ci --legacy-peer-deps

FROM base AS builder

ENV NODE_ENV=production

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Next.js app
RUN npm run build

FROM base AS runner

ENV NODE_ENV=production

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only the necessary files for running the app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY next.config.mjs ./
COPY middleware.js ./

USER nextjs

# Next.js listens on port 3000 by default
EXPOSE 3000

# Set the port for the container (can be overridden by environment)
ENV PORT=3000

CMD ["npm", "start"]


