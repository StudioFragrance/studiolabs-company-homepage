#!/bin/bash
set -e

echo "🚀 Docker 컨테이너 시작 중..."

# 데이터베이스 연결 대기
echo "📡 데이터베이스 연결 대기 중..."
until pg_isready -h postgres -p 5432 -U postgres; do
  echo "데이터베이스가 준비될 때까지 대기..."
  sleep 2
done
echo "✅ 데이터베이스 연결 확인됨"

# 마이그레이션 실행
echo "🔧 데이터베이스 마이그레이션 실행 중..."
./migrate.sh run

# 시드 데이터 생성
echo "🌱 초기 데이터 시딩 중..."
tsx scripts/seed-data.ts

# 애플리케이션 시작
echo "🎯 애플리케이션 시작 중..."
exec pnpm start