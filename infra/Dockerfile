# --- ETAPA 1: Build ---
FROM node:20 AS builder
WORKDIR /app

# Copiamos dependencias e instalamos
COPY package*.json ./
RUN npm install

# Copiamos el resto del código y construimos el frontend
COPY . .
RUN npm run build

# --- ETAPA 2: Runtime ---
FROM node:20
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Copiamos el resultado del build
COPY --from=builder /app ./

# Instalamos 'serve' para servir la carpeta dist
RUN npm install -g serve

# Exponemos el puerto 8080 (el que Cloud Run espera)
EXPOSE 8080

# Comando para
