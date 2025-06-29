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

# 모든 소스 코드 복사
COPY . .

# TypeScript 컴파일 및 클라이언트 빌드
RUN pnpm run build

# 엔트리포인트 스크립트 실행 권한 설정
RUN chmod +x docker-entrypoint.sh

# 빌드 결과 확인 (디버깅용)
RUN ls -la dist/

# 포트 노출
EXPOSE 5000

# 데이터베이스 대기 후 마이그레이션 실행 및 애플리케이션 시작
CMD ["./docker-entrypoint.sh"]