# syntax=docker/dockerfile:1

# --- ETAPA 1: Build (Vite) ---
FROM node:20 AS builder
WORKDIR /app

# Instalar deps (incluye devDependencies para poder compilar)
COPY package*.json ./
RUN npm ci

# Copiar el resto y construir
COPY . .
RUN npm run build

# --- ETAPA 2: Runtime (Express) ---
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Instalar solo deps de producción (Express, @google/genai, etc.)
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar servidor y build ya compilado
COPY server.js ./
COPY --from=builder /app/dist ./dist

EXPOSE 8080

# Arrancar tu API/SPA con Express (escucha en 0.0.0.0:8080)
CMD ["node", "server.js"]
