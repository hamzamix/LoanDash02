# Stage 1: Build frontend
FROM node:20 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Setup backend
FROM node:20 AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# Stage 3: Final image
FROM node:20
WORKDIR /app

# Copy built frontend files
COPY --from=frontend-build /app/frontend/dist ./dist

# Copy backend files
COPY --from=backend-build /app/backend .

RUN npm install --production

EXPOSE 3000

CMD ["node", "server.js"]
