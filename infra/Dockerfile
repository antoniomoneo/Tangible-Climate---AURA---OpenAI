# --- ETAPA 1: Build (Vite) ---
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Si falla la build del frontend, seguimos con la API igualmente:
RUN npm run build || echo "vite build falló; seguimos solo con API"

# --- ETAPA 2: Runtime (Express) ---
FROM node:20
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Copiamos API y, si existe, el frontend compilado
COPY server.js ./server.js
COPY --from=builder /app/dist ./dist

# Instala solo lo necesario para server.js (Express)
RUN npm install express

EXPOSE 8080
CMD ["node","server.js"]
