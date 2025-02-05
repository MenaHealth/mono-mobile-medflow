# apps/web/Dockerfile

# Stage 1: Setup base
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat && apk update
WORKDIR /app

# Stage 2: Install dependencies
FROM base AS builder
RUN npm install -g pnpm@8.15.4 turbo@2.4.0

# Copy all files
COPY . .

# Prune the workspace for the web app using the recommended flag
RUN turbo prune --scope=web --docker

# Stage 3: Build the application
FROM base AS installer

# Declare build arguments for variable substitution
ARG MONGODB_URI
ARG NEXTAUTH_SECRET
ARG NEXT_PUBLIC_API_URL
ARG NEXTAUTH_URL
ARG DO_SPACES_CDN_ENDPOINT
ARG DO_SPACES_BUCKET
ARG DO_SPACES_ENDPOINT
ARG DO_SPACES_KEY
ARG DO_SPACES_REGION
ARG DO_SPACES_SECRET
ARG GMAIL_SENDER_EMAIL
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG JWT_REFRESH_SECRET
ARG JWT_SECRET
ARG MEDFLOW_KEY
ARG MEDFLOW_SENDGRID_KEY
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG TELEGRAM_BOT_TOKEN
ARG NEXTAUTH_URL_INTERNAL
ARG NODE_ENV

# Install dependencies
RUN npm install -g pnpm@8.15.4
RUN pnpm install --frozen-lockfile

# Create .env.local file for Next.js
RUN echo "MONGODB_URI=${MONGODB_URI}" > apps/web/.env.local \
    && echo "NEXTAUTH_SECRET=${NEXTAUTH_SECRET}" >> apps/web/.env.local \
    && echo "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" >> apps/web/.env.local \
    && echo "NEXTAUTH_URL=${NEXTAUTH_URL}" >> apps/web/.env.local \
    && echo "DO_SPACES_CDN_ENDPOINT=${DO_SPACES_CDN_ENDPOINT}" >> apps/web/.env.local \
    && echo "DO_SPACES_BUCKET=${DO_SPACES_BUCKET}" >> apps/web/.env.local \
    && echo "DO_SPACES_ENDPOINT=${DO_SPACES_ENDPOINT}" >> apps/web/.env.local \
    && echo "DO_SPACES_KEY=${DO_SPACES_KEY}" >> apps/web/.env.local \
    && echo "DO_SPACES_REGION=${DO_SPACES_REGION}" >> apps/web/.env.local \
    && echo "DO_SPACES_SECRET=${DO_SPACES_SECRET}" >> apps/web/.env.local \
    && echo "GMAIL_SENDER_EMAIL=${GMAIL_SENDER_EMAIL}" >> apps/web/.env.local \
    && echo "GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}" >> apps/web/.env.local \
    && echo "GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}" >> apps/web/.env.local \
    && echo "JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}" >> apps/web/.env.local \
    && echo "JWT_SECRET=${JWT_SECRET}" >> apps/web/.env.local \
    && echo "MEDFLOW_KEY=${MEDFLOW_KEY}" >> apps/web/.env.local \
    && echo "MEDFLOW_SENDGRID_KEY=${MEDFLOW_SENDGRID_KEY}" >> apps/web/.env.local \
    && echo "NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}" >> apps/web/.env.local \
    && echo "TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}" >> apps/web/.env.local \
    && echo "NEXTAUTH_URL_INTERNAL=${NEXTAUTH_URL_INTERNAL}" >> apps/web/.env.local


# Build the project (from the monorepo root)
RUN pnpm run build --filter=web
RUN ls -lah apps/web/.next || echo "❌ .next directory is missing"
RUN ls -lah apps/web/.next/standalone || echo "❌ .next/standalone directory is missing"

# Copy necessary files from builder
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/apps/web ./apps/web
COPY turbo.json .

# Stage 4: Run the application
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
USER nextjs

# Debug: Confirm files exist
RUN ls -lah /app/.next/standalone

# Copy built application
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Set environment variables for runtime
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV MONGODB_URI=${MONGODB_URI}
ENV DO_SPACES_CDN_ENDPOINT=${DO_SPACES_CDN_ENDPOINT}
ENV DO_SPACES_BUCKET=${DO_SPACES_BUCKET}
ENV DO_SPACES_ENDPOINT=${DO_SPACES_ENDPOINT}
ENV DO_SPACES_KEY=${DO_SPACES_KEY}
ENV DO_SPACES_REGION=${DO_SPACES_REGION}
ENV DO_SPACES_SECRET=${DO_SPACES_SECRET}
ENV GMAIL_SENDER_EMAIL=${GMAIL_SENDER_EMAIL}
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
ENV JWT_SECRET=${JWT_SECRET}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV MEDFLOW_KEY=${MEDFLOW_KEY}
ENV MEDFLOW_SENDGRID_KEY=${MEDFLOW_SENDGRID_KEY}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
ENV TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
ENV NEXTAUTH_URL_INTERNAL=${NEXTAUTH_URL_INTERNAL}

EXPOSE 3001
RUN ls -lah /app/.next/standalone
CMD ["node", ".next/standalone/server.js"]