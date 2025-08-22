# --- ETAPA 1: El "Constructor" (El Chef) ---
# Usamos una imagen de Node.js para tener las herramientas de compilación
FROM node:18-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias e instalamos
COPY package*.json ./
RUN npm install

# Copiamos todo el código fuente de tu proyecto
COPY . .

# ¡El paso clave! Compilamos el proyecto.
# Esto crea la carpeta /app/dist con los archivos optimizados.
RUN npm run build


# --- ETAPA 2: El "Servidor" (El Camarero) ---
# Usamos una imagen de servidor web ligera como Nginx para servir los archivos
FROM nginx:1.25-alpine

# Copiamos SOLAMENTE el resultado de la compilación (la carpeta 'dist') 
# desde la etapa anterior al directorio público de Nginx.
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponemos el puerto 80, que es el puerto por defecto de Nginx
EXPOSE 80

# El comando por defecto de la imagen de Nginx se encargará de iniciar el servidor
CMD ["nginx", "-g", "daemon off;"]