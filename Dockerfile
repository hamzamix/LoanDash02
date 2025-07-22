# Stage 1: Build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Setup backend files
FROM node:20-alpine AS backend-build
WORKDIR /app
COPY server.js .
COPY db.json .

# Stage 3: Final image
FROM node:20-alpine
WORKDIR /app
COPY --from=frontend-build /app/frontend/dist ./dist
COPY --from=backend-build /app .

RUN npm install express
EXPOSE 8050
CMD ["node", "server.js"]
