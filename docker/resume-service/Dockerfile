FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY services/resume-service ./services/resume-service
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm --filter shared build && pnpm --filter resume-service db:generate && pnpm --filter resume-service build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm
COPY --from=builder /app /app
EXPOSE 3009
CMD ["node", "services/resume-service/dist/index.js"]
