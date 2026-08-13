FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/
COPY packages/database/package*.json ./packages/database/
COPY packages/shared/package*.json ./packages/shared/

RUN --mount=type=cache,target=/root/.npm npm ci

COPY apps/api ./apps/api
COPY packages/database ./packages/database
COPY packages/shared ./packages/shared
RUN DATABASE_URL="postgresql://arbora:password@localhost:5432/arbora" npm run gen:database
RUN npm run build:database
RUN npm run build:shared
RUN npm run build:api


FROM node:22-alpine AS production-dependencies

WORKDIR /app

COPY package*.json ./

COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/
COPY packages/database/package*.json ./packages/database/
COPY packages/shared/package*.json ./packages/shared/

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev \
      --workspace api \
      --workspace @arbora/database \
      --workspace @arbora/shared \
      --include-workspace-root=false

COPY packages/database/prisma ./packages/database/prisma
COPY packages/database/prisma.config.ts ./packages/database/prisma.config.ts

RUN DATABASE_URL="postgresql://arbora:password@localhost:5432/arbora" npm run gen:database


FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=production-dependencies /app/node_modules ./node_modules

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist

COPY --from=builder /app/packages/database/package.json ./packages/database/package.json
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=production-dependencies /app/packages/database/prisma ./packages/database/prisma
COPY --from=production-dependencies /app/packages/database/prisma.config.ts ./packages/database/prisma.config.ts

COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

EXPOSE 3001

CMD ["npm", "run", "start:prod", "--workspace", "api"]
