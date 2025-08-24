# --- ETAPA 1: Build (Vite) ---
FROM node:20 AS builder
WORKDIR /app

# Usa package.json de la raíz (el de Vite/React)
COPY package*.json ./
RUN npm install

COPY . .
# Si tu proyecto usa vite.config.ts con outDir distinto, igualmente compila aquí
RUN npm run build

# --- ETAPA 2: Runtime (sirve estáticos) ---
FROM node:20
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Copiamos solo el resultado del build
# ⚠️ Si tu outDir NO es "dist", cambia "dist" por tu carpeta (p. ej. "build")
COPY --from=builder /app/dist ./dist

# Instala 'serve' globalmente
RUN npm install -g serve

EXPOSE 8080

# Comando con trazas + escucha explícita en 0.0.0.0:PORT
CMD ["sh","-lc","set -eux; ls -la dist || true; echo PORT=$PORT; which serve; serve -s dist -l tcp://0.0.0.0:${PORT}"]
