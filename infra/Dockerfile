# ===========================
#   Etapa 1: Build (Vite)
# ===========================
FROM node:20 AS builder
WORKDIR /app

# Instala dependencias del proyecto (frontend + lo que haga falta para build)
COPY package*.json ./
RUN npm install

# Copia el código y construye la SPA (si falla, seguimos con solo API)
COPY . .
RUN npm run build || echo "⚠️ build de Vite falló; se desplegará solo la API"

# ===========================
#   Etapa 2: Runtime (API)
# ===========================
FROM node:20
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Copia package.json y package-lock para instalar dependencias de producción
COPY package*.json ./
RUN npm ci --omit=dev

# Copiamos el servidor y (si existe) la SPA ya compilada
COPY server.cjs ./server.cjs
COPY --from=builder /app/dist ./dist

EXPOSE 8080

# Arranca la API (escucha en 0.0.0.0:$PORT para Cloud Run)
CMD ["node", "server.cjs"]
