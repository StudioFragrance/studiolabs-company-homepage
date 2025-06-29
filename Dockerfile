# Node.js 기반 이미지 사용
FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /app

# pnpm 설치
RUN npm install -g pnpm

# package.json과 pnpm-lock.yaml 복사
COPY package.json pnpm-lock.yaml ./

# 의존성 설치
RUN pnpm install --frozen-lockfile

# 소스 코드 복사
COPY . .

# TypeScript 컴파일 및 클라이언트 빌드
RUN pnpm run build

# 마이그레이션 파일을 dist 폴더로 복사
RUN mkdir -p dist/migrations
RUN cp migrations/*.ts dist/migrations/

# 포트 노출
EXPOSE 5000

# 프로덕션 환경에서 애플리케이션 실행
CMD ["node", "dist/server/index.js"]