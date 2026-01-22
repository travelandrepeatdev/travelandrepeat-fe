# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Copiar sólo los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./
RUN npm ci

# Copiar todo el proyecto y construir
COPY . .
RUN npm run build

# Etapa 2: Runtime (Producción)
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copiar sólo lo mínimo necesario
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

RUN npm ci --omit=dev

# Si usas TypeScript, no necesitas copiar el código fuente
# ya está compilado en .next

EXPOSE 3000

# Iniciar Next.js en modo producción
CMD ["npm", "run", "start"]
