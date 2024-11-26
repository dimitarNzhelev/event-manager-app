# --- Builder Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN npm install -g pnpm && pnpm install

ENV SKIP_ENV_VALIDATION=true

COPY . .

RUN pnpm run build

# --- Production Stage ---
FROM node:20-alpine

WORKDIR /app
    
COPY --from=builder /app ./

RUN npm install -g pnpm

EXPOSE 3000

CMD ["sh", "-c", "pnpm run start"]
