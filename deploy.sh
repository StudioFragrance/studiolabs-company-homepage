#!/bin/bash

# Studio Fragrance - Docker 배포 및 설정 스크립트
# PostgreSQL과 앱을 Docker Compose로 실행하고 마이그레이션/시드 데이터를 적용합니다.

set -e  # 오류 발생 시 스크립트 중단

echo "🚀 Studio Fragrance Docker 배포 시작..."

# 1. 기존 컨테이너 정리 및 빌드
echo "📦 Docker 컨테이너 빌드 중..."
docker compose down --volumes --remove-orphans 2>/dev/null || true
docker compose up --build -d

# 2. 컨테이너 상태 확인
echo "⏳ 컨테이너 시작 대기 중..."
sleep 10

# PostgreSQL 컨테이너 헬스체크 대기
echo "🔍 PostgreSQL 헬스체크 대기 중..."
timeout=60
counter=0
while [ $counter -lt $timeout ]; do
    if docker exec studiofragrance_db pg_isready -U postgres -d studiofragrance >/dev/null 2>&1; then
        echo "✅ PostgreSQL 준비 완료"
        break
    fi
    echo "⏳ PostgreSQL 대기 중... ($counter/$timeout)"
    sleep 2
    counter=$((counter + 2))
done

if [ $counter -ge $timeout ]; then
    echo "❌ PostgreSQL 헬스체크 타임아웃"
    exit 1
fi

# 앱 컨테이너 대기
echo "⏳ 앱 컨테이너 시작 대기 중..."
sleep 5

# 컨테이너 상태 확인
if ! docker ps | grep -q "studiofragrance_app"; then
    echo "❌ 앱 컨테이너가 실행되지 않았습니다."
    docker compose logs app
    exit 1
fi

if ! docker ps | grep -q "studiofragrance_db"; then
    echo "❌ PostgreSQL 컨테이너가 실행되지 않았습니다."
    docker compose logs postgres
    exit 1
fi

# 3. 마이그레이션 실행
echo "🔄 데이터베이스 마이그레이션 실행 중..."
if docker exec studiofragrance_app npx typeorm migration:run -d ormconfig.ts; then
    echo "✅ 마이그레이션 완료"
else
    echo "❌ 마이그레이션 실패"
    docker exec studiofragrance_app npx typeorm migration:show -d ormconfig.ts || true
    exit 1
fi

# 4. 시드 데이터 실행
echo "🌱 시드 데이터 실행 중..."
if docker exec studiofragrance_app npx tsx scripts/seed-data.ts; then
    echo "✅ 시드 데이터 적용 완료"
else
    echo "❌ 시드 데이터 적용 실패"
    exit 1
fi

# 5. 서비스 상태 확인
echo "🔍 서비스 상태 확인 중..."
sleep 3

# 포트 5000 확인
if curl -f -s http://localhost:5000 >/dev/null; then
    echo "✅ 앱이 localhost:5000에서 정상 실행 중"
else
    echo "⚠️  localhost:5000 응답 없음, 컨테이너 로그 확인 중..."
    docker compose logs --tail=20 app
fi

# 6. 완료 메시지
echo ""
echo "🎉 Studio Fragrance 배포 완료!"
echo ""
echo "📋 서비스 정보:"
echo "   - 웹 애플리케이션: http://localhost:5000"
echo "   - PostgreSQL: localhost:5433"
echo ""
echo "🛠️  유용한 명령어:"
echo "   - 로그 확인: docker compose logs -f"
echo "   - 앱 로그만: docker compose logs -f app"
echo "   - DB 로그만: docker compose logs -f postgres"
echo "   - 컨테이너 중지: docker compose down"
echo "   - 완전 삭제: docker compose down --volumes"
echo ""
echo "🔧 DB 관리 명령어:"
echo "   - 마이그레이션 생성: docker exec studiofragrance_app npx typeorm migration:generate -d ormconfig.ts migrations/NewMigration"
echo "   - 마이그레이션 실행: docker exec studiofragrance_app npx typeorm migration:run -d ormconfig.ts"
echo "   - 마이그레이션 되돌리기: docker exec studiofragrance_app npx typeorm migration:revert -d ormconfig.ts"
echo "   - 시드 데이터 재실행: docker exec studiofragrance_app npx tsx scripts/seed-data.ts"