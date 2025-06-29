#!/bin/bash

# TypeORM 마이그레이션 관리 스크립트

case "$1" in
    run)
        echo "마이그레이션을 실행합니다..."
        tsx scripts/migration.ts run
        ;;
    revert)
        echo "마지막 마이그레이션을 되돌립니다..."
        tsx scripts/migration.ts revert
        ;;
    show)
        echo "실행된 마이그레이션 목록을 조회합니다..."
        tsx scripts/migration.ts show
        ;;
    generate)
        echo "새 마이그레이션 생성 가이드:"
        echo "1. migrations/ 폴더에 새 파일 생성"
        echo "2. 파일명 형식: TIMESTAMP-MigrationName.ts"
        echo "3. 예시: $(date +%s)000-AddNewTable.ts"
        tsx scripts/migration.ts generate
        ;;
    *)
        echo "사용법: ./migrate.sh [run|revert|show|generate]"
        echo ""
        echo "명령어:"
        echo "  run     - 대기 중인 마이그레이션 실행"
        echo "  revert  - 마지막 마이그레이션 되돌리기"
        echo "  show    - 실행된 마이그레이션 목록 조회"
        echo "  generate- 새 마이그레이션 생성 가이드"
        echo ""
        echo "예시:"
        echo "  ./migrate.sh run"
        echo "  ./migrate.sh show"
        exit 1
        ;;
esac