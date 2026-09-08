FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared ./packages/shared
COPY services/analytics-service ./services/analytics-service
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm --filter analytics-service build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/services/analytics-service/dist ./dist
COPY --from=builder /app/services/analytics-service/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4004
CMD ["node", "dist/index.js"]
