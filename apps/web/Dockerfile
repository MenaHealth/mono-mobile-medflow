# apps/web/Dockerfile

# ------------- Stage 1: Build the Next.js App -------------
FROM node:18-bullseye AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json (and package-lock.json if available) first.
# This allows Docker to cache dependency installation.
COPY package*.json ./

# (Optional) If your build needs env vars, copy your env file.
# If you want to use a production-specific env file, adjust accordingly.
COPY .env ./

# Copy the rest of the application code.
COPY . .

# Install dependencies
RUN npm install

# Build the Next.js app
RUN npm run build


# ------------- Stage 2: Run the Next.js App -------------
FROM node:18-alpine

# Set the runtime environment variable
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy the built Next.js output and necessary files from the builder stage.
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/package*.json ./
# If your runtime code relies on the env file, copy it too.
COPY --from=builder /app/.env ./

# Install only production dependencies
RUN npm install --only=production

# Expose the port that Next.js listens on (default is 3000)
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]