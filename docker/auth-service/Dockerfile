FROM node:18-alpine AS builder
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared ./packages/shared
COPY services/auth-service ./services/auth-service
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm --filter shared build && pnpm --filter auth-service db:generate && pnpm --filter auth-service build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
EXPOSE 4001
CMD ["pnpm", "--filter", "auth-service", "start"]
