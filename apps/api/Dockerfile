FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

COPY apps ./apps
COPY packages ./packages

RUN npm ci
RUN npm run gen:database
RUN npm run build:database
RUN npm run build:shared
RUN npm run build:api


FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/apps/api/dist ./dist

COPY --from=builder /app/packages/database ./packages/database
COPY --from=builder /app/packages/shared ./packages/shared

EXPOSE 3001

CMD ["node", "dist/index.js"]