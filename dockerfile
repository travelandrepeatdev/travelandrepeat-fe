# Etapa 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

# Copiar sólo los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copiar todo el proyecto y construir
COPY . .
RUN npm run build

# Etapa 2: Runtime + Nginx
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Instalar Nginx
RUN apk update && apk add --no-cache nginx

# Crear directorio necesario para pid
RUN mkdir -p /run/nginx

# Copiar archivos de la app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# ---------- NGINX CONFIG ----------
# Agregamos Nginx con hostname "tyr-fe"
RUN mkdir -p /etc/nginx/sites-enabled

COPY <<EOF /etc/nginx/sites-enabled/tyr-fe.conf
server {
    listen 80;
    server_name tyr-fe;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Sustituir default.conf
RUN rm -f /etc/nginx/conf.d/default.conf

# Exponer los puertos
EXPOSE 80

# ---------- STARTUP ----------
# Inicia Node + Nginx
CMD ["sh", "-c", "nginx && npm run start"]
