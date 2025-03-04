FROM node:20.11.0 AS base

# ********************* 初期化レイヤー ********************* #
FROM base AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci
# ********************* 初期化レイヤー ********************* #


# ********************* ビルドレイヤー ********************* #
# FROM base AS builder

# ENV NODE_ENV=production
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# RUN apt-get update && apt-get upgrade openssl -y \
#   && apt-get clean \
#   && rm -rf /var/lib/apt/lists/*

# RUN npm run prisma:generate
# RUN npm run build
# ********************* ビルドレイヤー ********************* #


# ********************* サーバー実行レイヤー ********************* #
FROM base AS runner

ENV NODE_ENV=production
WORKDIR /app

RUN apt-get update && apt-get upgrade openssl -y && apt-get clean && rm -rf /var/lib/apt/lists/*

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# RUN mkdir .next
# RUN chown -R nextjs:nodejs .next

# COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# RUN npm run prisma:generate
# RUN npm run build

# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next/static ./.next/static
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next/standalone ./

COPY .env.production .env

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run prisma:generate
RUN npm run build

# USER nextjs
EXPOSE 80
ENV HOSTNAME="0.0.0.0"

CMD [ "npm", "run", "start", "-p", "80" ]
# ********************* サーバー実行レイヤー ********************* #