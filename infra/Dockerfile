# /infra/Dockerfile  (debug mínimo)
FROM node:20
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Copiamos el server mínimo
COPY server.cjs ./server.cjs

# Instalamos solo express
RUN npm install express

EXPOSE 8080
CMD ["node", "server.cjs"]
