# Etapa 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Runtime + Nginx
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Instalar Nginx
RUN apk update && apk add --no-cache nginx

# Crear directorio para PID
RUN mkdir -p /run/nginx

# Copiar archivos de la app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Crear configuración Nginx en puerto 3000
RUN mkdir -p /etc/nginx/conf.d

COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 3000;

    server_name tyr-fe;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# EXPOSE solo tu puerto 3000
EXPOSE 3000

# Startup: Next.js en 3001 + Nginx en 3000
CMD ["sh", "-c", "PORT=3001 npm run start & nginx -g 'daemon off;'"]
