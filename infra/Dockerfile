# --- ETAPA 1: Build (usa el package.json de la raíz) ---
FROM node:20 AS builder
WORKDIR /app

# Usa las dependencias del proyecto (las que mantiene AI Studio)
COPY package*.json ./
RUN npm install

# Copia el código y compila con Vite
COPY . .
RUN npm run build

# --- ETAPA 2: Runtime (sirve dist con 'serve') ---
FROM node:20
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Copiamos SOLO lo construido y lo necesario
COPY --from=builder /app/dist ./dist

# Instala 'serve' globalmente (no toca tu package.json de la raíz)
RUN npm install -g serve

EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
