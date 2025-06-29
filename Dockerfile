FROM node:22-alpine as base

# KST 타임존 설정
ENV TZ=Asia/Seoul
RUN apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    apk del tzdata

RUN npm install -g pnpm

WORKDIR /app


FROM base as deps

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/var/pnpm/store pnpm install --frozen-lockfile

FROM base as build

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm run build

FROM base as publish

WORKDIR /app

# 런타임에 필요한 모든 파일 복사
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
COPY vite.config.ts ./

EXPOSE 5000
CMD ["node", "./dist/index.js"]