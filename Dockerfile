# Multi-stage Dockerfile for Next.js 14 app (production)

# 1) Builder: install deps and build
FROM node:20-alpine AS builder
WORKDIR /app

# Install OS deps required for node-gyp if any native deps appear
RUN apk add --no-cache libc6-compat

# Install dependencies
COPY package.json pnpm-lock.yaml* package-lock.json* yarn.lock* ./

# Prefer pnpm if lockfile exists, else npm
RUN if [ -f pnpm-lock.yaml ]; then \
      corepack enable && corepack prepare pnpm@latest --activate && pnpm install --no-frozen-lockfile; \
    elif [ -f yarn.lock ]; then \
      corepack enable && corepack prepare yarn@stable --activate && yarn install --frozen-lockfile; \
    else \
      npm ci; \
    fi

# Copy source
COPY . .

# Build Next.js (standalone output enabled in next.config.mjs)
RUN if [ -f pnpm-lock.yaml ]; then \
      corepack enable && corepack prepare pnpm@latest --activate && pnpm build; \
    elif [ -f yarn.lock ]; then \
      corepack enable && corepack prepare yarn@stable --activate && yarn build; \
    else \
      npm run build; \
    fi

# 2) Runner: minimal image serving standalone server
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy standalone build output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Next.js listens on 3000 by default
EXPOSE 3000

# Use non-root user
USER nextjs

# Start the production server
CMD ["node", "server.js"]


