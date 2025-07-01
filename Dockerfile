# Stage 1: 빌드 단계
FROM node:20-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# pnpm 설치
RUN npm install -g pnpm

# package.json과 pnpm-lock.yaml 복사
COPY package.json pnpm-lock.yaml ./

# 의존성 설치 (개발 의존성 포함)
RUN pnpm install --frozen-lockfile

# 소스 코드 복사
COPY . .

# TypeScript 컴파일 및 클라이언트 빌드
RUN pnpm run build

# TypeScript 프로젝트 전체를 컴파일 (ormconfig.ts 포함)
RUN npx tsc --project tsconfig.node.json

# Stage 2: 프로덕션 단계
FROM node:20-alpine AS production

# 작업 디렉토리 설정
WORKDIR /app

# pnpm 설치
RUN npm install -g pnpm

# package.json과 pnpm-lock.yaml 복사
COPY package.json pnpm-lock.yaml ./

# 프로덕션 의존성 설치 (tsx 포함을 위해 devDependencies도 설치)
RUN pnpm install --frozen-lockfile

# 필요한 스크립트와 설정 파일들 복사
COPY ormconfig.ts ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./
COPY scripts/ scripts/
COPY migrations/ migrations/
COPY server/ server/

# 빌드된 파일들 복사
COPY --from=builder /app/dist ./dist

# 포트 노출
EXPOSE 5000

# 데이터베이스 대기 후 마이그레이션 실행 및 애플리케이션 시작 (tsx 사용)
CMD ["sh", "-c", "echo 'Starting Studiolabs application...' && npx wait-on tcp:postgres:5432 -t 60000 && echo 'Running database migrations...' && npx tsx scripts/migration.ts run && echo 'Seeding initial data...' && npx tsx scripts/seed-data.ts && echo 'Starting the server...' && npx tsx server/index.ts"]