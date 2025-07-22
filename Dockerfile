# 1. Build React frontend
FROM node:20 AS builder
WORKDIR /app
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# 2. Serve with Express
FROM node:20-slim
WORKDIR /app
COPY backend ./
COPY --from=builder /app/frontend/dist ./dist
RUN npm install --production

EXPOSE 8050
CMD ["node", "server.js"]
