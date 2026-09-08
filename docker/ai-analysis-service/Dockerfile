FROM node:18-alpine AS builder
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared ./packages/shared
COPY services/ai-analysis-service ./services/ai-analysis-service
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm --filter shared build && pnpm --filter ai-analysis-service db:generate && pnpm --filter ai-analysis-service build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
EXPOSE 4003
CMD ["pnpm", "--filter", "ai-analysis-service", "start"]
