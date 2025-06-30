FROM node:24-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사 및 의존성 설치
COPY package*.json ./
RUN npm ci --only=production

# 전체 프로젝트 파일 복사
COPY . .

# 프론트엔드 빌드
RUN npm run build

# 포트 노출
EXPOSE 5000

# 애플리케이션 실행
CMD ["npm", "start"]