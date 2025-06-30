FROM node:24-alpine

# 작업 디렉토리 설정
WORKDIR /app

RUN npm install -g pnpm

# 전체 프로젝트 파일 복사
COPY . .

RUN pnpm install

# 프론트엔드 빌드
RUN pnpm run build

# 마이그레이션 컴파일 (TypeScript → JavaScript)
RUN npx tsc migrations/*.ts --outDir dist/migrations --target ES2020 --module ESNext --moduleResolution node

# 포트 노출
EXPOSE 5000

# 애플리케이션 실행
CMD ["pnpm", "start"]