FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared ./packages/shared
COPY services/payment-service ./services/payment-service
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm --filter payment-service build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/services/payment-service/dist ./dist
COPY --from=builder /app/services/payment-service/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4007
CMD ["node", "dist/index.js"]
