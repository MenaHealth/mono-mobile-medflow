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

## Stage 3: Build the application
 #FROM base AS installer
 #COPY --from=builder /app/out/json/ .
 #COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
 #COPY --from=builder /app/apps/web/lib/appbuilder-react-3.0.30-1-bZWPdTGmSr.tgz ./apps/web/lib/
 #RUN npm install -g pnpm@8.15.4
 #
 ## Install dependencies
 #RUN pnpm install --frozen-lockfile
 #
 ## Copy source code
 #COPY --from=builder /app/out/full/ .
 #COPY --from=builder /app/apps/web ./apps/web
 #COPY turbo.json .
 #
 ## Create a temporary .env.local file for Next.js to pick up during the build.
 #RUN echo "MONGODB_URI=${MONGODB_URI}" > apps/web/.env.local \
 #    && echo "NEXTAUTH_SECRET=${NEXTAUTH_SECRET}" >> apps/web/.env.local \
 #    && echo "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" >> apps/web/.env.local \
 #    && echo "NEXTAUTH_URL=${NEXTAUTH_URL}" >> apps/web/.env.local \
 #    && echo "DO_SPACES_CDN_ENDPOINT=${DO_SPACES_CDN_ENDPOINT}" >> apps/web/.env.local \
 #    && echo "DO_SPACES_BUCKET=${DO_SPACES_BUCKET}" >> apps/web/.env.local \
 #    && echo "DO_SPACES_ENDPOINT=${DO_SPACES_ENDPOINT}" >> apps/web/.env.local \
 #    && echo "DO_SPACES_KEY=${DO_SPACES_KEY}" >> apps/web/.env.local \
 #    && echo "DO_SPACES_REGION=${DO_SPACES_REGION}" >> apps/web/.env.local \
 #    && echo "DO_SPACES_SECRET=${DO_SPACES_SECRET}" >> apps/web/.env.local \
 #    && echo "GMAIL_SENDER_EMAIL=${GMAIL_SENDER_EMAIL}" >> apps/web/.env.local \
 #    && echo "GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}" >> apps/web/.env.local \
 #    && echo "GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}" >> apps/web/.env.local \
 #    && echo "JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}" >> apps/web/.env.local \
 #    && echo "JWT_SECRET=${JWT_SECRET}" >> apps/web/.env.local \
 #    && echo "MEDFLOW_KEY=${MEDFLOW_KEY}" >> apps/web/.env.local \
 #    && echo "MEDFLOW_SENDGRID_KEY=${MEDFLOW_SENDGRID_KEY}" >> apps/web/.env.local \
 #    && echo "NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}" >> apps/web/.env.local \
 #    && echo "TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}" >> apps/web/.env.local \
 #    && echo "NEXTAUTH_URL_INTERNAL=${NEXTAUTH_URL_INTERNAL}" >> apps/web/.env.local
 #
 ## Build the project
 #RUN pnpm run build --filter=web
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

# Copy environment variables from build stage
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

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "apps/web/server.js"]



