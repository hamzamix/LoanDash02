FROM node:20 AS builder
WORKDIR /app
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

FROM node:20
WORKDIR /app
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY server.js .
COPY db.json .

RUN npm install express cors

EXPOSE 8050
CMD ["node", "server.js"]
