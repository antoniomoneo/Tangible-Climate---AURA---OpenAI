# --- ETAPA 1: Build (Vite) ---
FROM node:20 AS builder
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código y compilar el frontend
COPY . .
RUN npm run build || echo "vite build falló, seguimos solo con API"

# --- ETAPA 2: Runtime (Express API) ---
FROM node:20
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Copiar el API y el frontend compilado (si existe)
COPY server.js ./server.js
COPY --from=builder /app/dist ./dist

# Instalar solo lo que necesita server.js
RUN npm install express node-fetch

EXPOSE 8080

CMD ["node","server.js"]
