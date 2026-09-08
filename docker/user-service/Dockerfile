FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared ./packages/shared
COPY services/user-service ./services/user-service
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm --filter user-service build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/services/user-service/dist ./dist
COPY --from=builder /app/services/user-service/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4005
CMD ["node", "dist/index.js"]
