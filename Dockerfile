FROM node:lts-alpine3.19

# Override default config
ENV HTTP_PORT=80
ENV WS_PORT=8080

# Set timezone
ENV TZ=Europe/Paris
RUN apk add --no-cache tzdata

# Install nodemon globally
RUN npm install -g nodemon

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

COPY . .

HEALTHCHECK --interval=5s --timeout=10s --retries=5 --start-period=5s CMD ["curl", "-f", "http://localhost/ping"]

CMD ["npm", "start"]