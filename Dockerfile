# -------- Build stage --------
FROM node:18-alpine AS builder

# Set working dir
WORKDIR /app

# Install dependencies (copy only package manifests first to use layer cache)
COPY package.json package-lock.json ./

# Use npm ci for reproducible installs (fast and clean)
RUN npm ci --production=false

# Copy rest of source
COPY . .

# Build the app (Vite)
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN npm run build

# -------- Production stage --------
FROM nginx:stable-alpine AS runner

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (optional: included below). If you don't use a custom config, nginx default works but
# the SPA fallback (history API) won't be configured.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port (optional, containers usually use 80)
EXPOSE 80

# Healthcheck (optional)
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget -qO- http://localhost/ || exit 1

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
