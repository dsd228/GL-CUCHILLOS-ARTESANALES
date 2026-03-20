FROM node:20-alpine

WORKDIR /app

# Copiar dependencias primero (cache layer)
COPY package*.json ./
RUN npm install --omit=dev

# Copiar código
COPY server.js ./

# Puerto que expone el contenedor
EXPOSE 3000

# Variables de entorno requeridas (se setean en Render)
# MP_ACCESS_TOKEN=APP_USR-...
# FRONTEND_URL=https://gl-cuchillos.artesanales.workers.dev

CMD ["node", "server.js"]
