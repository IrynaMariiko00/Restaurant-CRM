FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

ARG VITE_API_URL=https://accanto.adammudrak.pp.ua
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

FROM node:24-alpine
WORKDIR /app
RUN npm install -g serve@14
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
