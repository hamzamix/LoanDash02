# Step 1: Build frontend
FROM node:20 AS builder
WORKDIR /frontend
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

# Step 2: Serve with Express
FROM node:20-slim
WORKDIR /app
COPY server ./
COPY --from=builder /frontend/dist ./dist
RUN npm install --omit=dev
EXPOSE 8050
CMD ["node", "server.js"]