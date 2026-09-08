FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared ./packages/shared
COPY services/coding-interview-service ./services/coding-interview-service
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm --filter coding-interview-service build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/services/coding-interview-service/dist ./dist
COPY --from=builder /app/services/coding-interview-service/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4006
CMD ["node", "dist/index.js"]
