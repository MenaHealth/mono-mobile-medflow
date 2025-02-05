# apps/web/Dockerfile

# Stage 1: Setup base
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# Stage 2: Install dependencies
FROM base AS builder
RUN npm install -g pnpm@8.15.4 turbo@2.4.0

# Copy all files
COPY . .

# Prune the workspace for the web app
RUN turbo prune web --docker

# Stage 3: Build the application
FROM base AS installer
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/apps/web/lib/appbuilder-react-3.0.30-1-bZWPdTGmSr.tgz ./apps/web/lib/
RUN npm install -g pnpm@8.15.4

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY --from=builder /app/out/full/ .
COPY --from=builder /app/apps/web ./apps/web
COPY turbo.json .

# Set environment variables for build
ARG MONGODB_URI
ENV MONGODB_URI=${MONGODB_URI}
ENV NEXT_PUBLIC_MONGODB_URI=${MONGODB_URI}

# Build the project
RUN MONGODB_URI=${MONGODB_URI} pnpm run build --filter=web

# Stage 4: Run the application
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy built application
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Set environment variables for runtime
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV MONGODB_URI=${MONGODB_URI}

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "apps/web/server.js"]

