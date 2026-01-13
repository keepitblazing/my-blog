# Build stage
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist

# uploads 폴더 생성
RUN mkdir -p /app/uploads

EXPOSE 4000

CMD ["node", "dist/main.js"]
