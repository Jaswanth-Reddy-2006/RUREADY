FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared ./packages/shared
COPY services/oral-interview-service ./services/oral-interview-service
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm --filter oral-interview-service build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/services/oral-interview-service/dist ./dist
COPY --from=builder /app/services/oral-interview-service/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4002
CMD ["node", "dist/index.js"]
