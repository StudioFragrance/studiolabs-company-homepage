FROM node:22-alpine as base

# KST 타임존 설정
ENV TZ=Asia/Seoul
RUN apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    apk del tzdata

RUN npm install -g pnpm

WORKDIR /app


FROM base as build

WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/var/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build


FROM base as prod

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/var/pnpm/store pnpm install --prod --frozen-lockfile

FROM base as publish

WORKDIR /app

COPY --from=prod /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 5000
CMD ["node", "./dist/index.js"]