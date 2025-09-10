# Stage 1: Build the React app
FROM oven/bun:1.1.34 AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the project
COPY . .

# Build the Vite app
RUN bun run build


# Stage 2: Serve with a lightweight web server (nginx)
FROM nginx:stable-alpine AS runner

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static files
RUN rm -rf ./*

# Copy build output from builder
COPY --from=builder /app/dist ./

# Copy custom nginx config (optional, good for React SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
