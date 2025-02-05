# apps/web/Dockerfile

# Stage 1: Setup base
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat && apk update
WORKDIR /app

# Stage 2: Install dependencies and build
FROM base AS builder
RUN npm install -g pnpm@8.15.4 turbo@2.4.0

# Copy all files
COPY . .

# Install dependencies and build
RUN pnpm install --no-frozen-lockfile
RUN pnpm run build --filter=web

# Stage 3: Run the application
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

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

USER nextjs

EXPOSE 3001

CMD ["node", "server.js"]