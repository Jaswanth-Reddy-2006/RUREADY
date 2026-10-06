FROM node:20-bookworm-slim AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY services/resume-service ./services/resume-service
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm --filter shared build && pnpm --filter resume-service db:generate && pnpm --filter resume-service build

FROM python:3.11-slim-bookworm AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install Node.js 20 runtime and required libraries for Docling & OCR
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    tesseract-ocr \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && npm install -g pnpm \
    && rm -rf /var/lib/apt/lists/*

COPY services/resume-service/requirements.txt ./services/resume-service/
RUN pip install --no-cache-dir -r ./services/resume-service/requirements.txt

COPY --from=builder /app /app
EXPOSE 3009
CMD ["node", "services/resume-service/dist/index.js"]
