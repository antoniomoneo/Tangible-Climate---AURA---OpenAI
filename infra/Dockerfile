FROM node:20
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY . .

# Debug: mostrar qué hay en /app
RUN node -v && ls -la /app | tee /tmp/ls-root.txt

RUN npm install express

EXPOSE 8080

CMD ["sh","-lc","set -eux; echo PORT=$PORT; ls -la /app; node server.cjs"]
