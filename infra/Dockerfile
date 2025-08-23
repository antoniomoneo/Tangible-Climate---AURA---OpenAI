# /infra/Dockerfile  (mínimo estable)
FROM node:20
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# copia el servidor
COPY server.cjs ./server.cjs

# instala solo lo necesario
RUN npm install express

EXPOSE 8080
CMD ["node", "server.cjs"]
