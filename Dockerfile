FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 9090
CMD ["npm","run","dev"]
