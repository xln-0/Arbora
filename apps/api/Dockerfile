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


FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist

COPY --from=builder /app/packages/database ./packages/database
COPY --from=builder /app/packages/shared ./packages/shared

EXPOSE 3001

CMD ["npm", "run", "start:prod", "--workspace", "api"]
