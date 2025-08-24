# syntax=docker/dockerfile:1

# --- ETAPA 1: Build (Vite) ---
FROM node:20 AS builder
WORKDIR /app

# Instalar deps para construir (incluye devDependencies)
COPY package*.json ./
RUN npm install

# Copiar el resto y construir
COPY . .
RUN npm run build

# --- ETAPA 2: Runtime (Express) ---
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Instalar SOLO deps de producción para runtime
COPY package*.json ./
RUN npm install --omit=dev

# Copiar servidor y el build ya compilado
COPY server.js ./
COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD ["node", "server.js"]
