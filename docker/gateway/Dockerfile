FROM node:18-alpine AS builder
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared ./packages/shared
COPY gateway ./gateway
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm --filter shared build && pnpm --filter gateway build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
EXPOSE 4000
CMD ["pnpm", "--filter", "gateway", "start"]
