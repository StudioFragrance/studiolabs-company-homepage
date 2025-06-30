FROM node:24-alpine

# 작업 디렉토리 설정
WORKDIR /app

RUN npm install -g pnpm

# 전체 프로젝트 파일 복사
COPY . .

RUN pnpm install

# 프론트엔드 빌드
RUN pnpm run build

# 스크립트 실행 권한 부여
RUN chmod +x migrate.sh docker-entrypoint.sh

# PostgreSQL 클라이언트 설치 (pg_isready 사용)
RUN apk add --no-cache postgresql-client

# 포트 노출
EXPOSE 5000

# Docker 엔트리포인트 스크립트 실행
ENTRYPOINT ["./docker-entrypoint.sh"]