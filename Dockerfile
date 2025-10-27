# ---------- Builder ----------
FROM node:20-alpine AS builder

# allow installing bash for scripts if desired (optional)
RUN apk add --no-cache bash

WORKDIR /app

# Install pnpm/yarn if you use them - this example uses npm (default)
# Copy package files first to leverage build cache
COPY package*.json ./
# If using package-lock.json, it's already included above
RUN npm ci --silent

# Copy the rest of the source
COPY . .

# Accept VITE_* build args and create .env.production for Vite
# Provide defaults where helpful (these can be overridden at build time)
ARG VITE_DEFAULT_AVATAR=""
ARG VITE_BASE_URL_RAW=""
ARG VITE_BASE_URL=""
ARG VITE_WS_BASE_URL=""
ARG VITE_YJS_BASE_URL=""

# Write an .env.production file that Vite will use at build time
RUN printf '%s\n' \
  "VITE_DEFAULT_AVATAR=${VITE_DEFAULT_AVATAR}" \
  "VITE_BASE_URL_RAW=${VITE_BASE_URL_RAW}" \
  "VITE_BASE_URL=${VITE_BASE_URL}" \
  "VITE_WS_BASE_URL=${VITE_WS_BASE_URL}" \
  "VITE_YJS_BASE_URL=${VITE_YJS_BASE_URL}" \
  > .env.production

# Build the app
RUN npm run build

# ---------- Production image ----------
FROM nginx:stable-alpine AS production

# Add small tweaks: create /var/cache/nginx and expose
RUN mkdir -p /var/cache/nginx

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a custom nginx config to support SPA routing (fallback to index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Optional: copy healthcheck script (or use Docker HEALTHCHECK)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- --timeout=2 http://localhost/ || exit 1

EXPOSE 80

# run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
