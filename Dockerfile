FROM node:24-alpine3.20 AS base

FROM base AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY ./package.json ./pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm i --frozen-lock

FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./

COPY . ./
EXPOSE 3000
CMD [ "npm", "run", "dev" ]

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . ./

RUN corepack enable pnpm && pnpm run build

FROM base AS prod
WORKDIR /app

# Uncomment when clerk removed
# ENV NODE_ENV=production

RUN addgroup --system --gid 900 verdant
RUN adduser --system --uid 900 nextjs

COPY --from=builder /app/public/ ./public/
COPY --from=builder --chown=nextjs:verdant /app/.next/standalone ./
COPY --from=builder --chown=nextjs:verdant /app/.next/static ./.next/static/

USER nextjs

EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD [ "node", "server.js" ]
