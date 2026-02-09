# ===== Build stage =====
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ===== Run stage =====
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=9090

# copy hasil build + kebutuhan runtime
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

EXPOSE 9090
CMD ["node", "dist/index.cjs"]
