# apps/web/Dockerfile

# ----- Stage 1: Build the Next.js App -----
FROM node:18-bullseye AS builder

# Set working directory
WORKDIR /app

# Copy the root package.json and package-lock.json
COPY ../../package.json ../../package-lock.json ./

# Copy all workspace packages
COPY ../../packages ./packages

# Copy the `apps/web/` folder
COPY . .

# Ensure the `lib/` folder inside `apps/web/` is copied
COPY lib ./lib

# Install all dependencies
RUN npm install

# Build the Next.js app
RUN npm run build


# ----- Stage 2: Run the Next.js App -----
FROM node:18-alpine

# Set production environment variable
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/lib ./lib

# Install only production dependencies
RUN npm install --only=production

# Expose the port (set here to 3001)
EXPOSE 3001

# Start Next.js app
CMD ["npm", "start"]