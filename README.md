# Studio Fragrance - AI 향수 추천 플랫폼

AI 기술을 활용한 개인 맞춤형 향수 추천 웹 애플리케이션입니다.

## 기술 스택

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **데이터베이스**: TypeORM + PostgreSQL (Docker 네트워크 지원)
- **빌드 도구**: Vite, ESBuild
- **상태 관리**: TanStack Query
- **애니메이션**: Framer Motion

## 프로젝트 실행 방법

Studio Fragrance는 Docker를 사용하여 PostgreSQL 데이터베이스와 함께 실행됩니다.

### 필수 요구사항
- Docker
- Docker Compose

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd studio-fragrance
```

### 2. Docker로 전체 시스템 실행
```bash
# PostgreSQL과 애플리케이션을 함께 실행
docker compose up --build

# 백그라운드 실행
docker compose up -d --build
```

### 3. 애플리케이션 접속
애플리케이션이 시작되면 `http://localhost:5000`에서 접속할 수 있습니다.

### 4. 시스템 중지
```bash
# 모든 서비스 중지
docker compose down

# 데이터베이스 데이터까지 완전 삭제
docker compose down -v
```

## 데이터베이스 마이그레이션 관리

### 자동 마이그레이션
Docker 컨테이너가 시작될 때 자동으로 마이그레이션이 실행됩니다.

### 수동 마이그레이션 명령어
컨테이너가 실행 중일 때 다음 명령어로 마이그레이션을 관리할 수 있습니다:

```bash
# 대기 중인 마이그레이션 실행
docker compose exec app tsx scripts/migration.ts run

# 마지막 마이그레이션 되돌리기
docker compose exec app tsx scripts/migration.ts revert

# 실행된 마이그레이션 목록 조회
docker compose exec app tsx scripts/migration.ts show
```

### 새 마이그레이션 생성
새로운 데이터베이스 변경사항이 필요한 경우:

1. `migrations/` 폴더에 새 파일 생성
2. 파일명 형식: `TIMESTAMP-MigrationName.ts`
3. 예시: `1751190000000-AddNewTable.ts`

```typescript
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewTable1751190000000 implements MigrationInterface {
    name = 'AddNewTable1751190000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 변경사항 적용 SQL
        await queryRunner.query(`CREATE TABLE "new_table" ...`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 변경사항 되돌리기 SQL
        await queryRunner.query(`DROP TABLE "new_table"`);
    }
}
```

## 개발 및 배포 관리

### 로그 확인
```bash
# 전체 로그 확인
docker compose logs -f

# 특정 서비스 로그
docker compose logs -f app
docker compose logs -f postgres
```

### 서비스 관리
```bash
# PostgreSQL만 실행
docker compose up -d postgres

# 애플리케이션만 재시작
docker compose restart app

# 특정 서비스 재빌드
docker compose build --no-cache app
```

### 데이터 관리
```bash
# 데이터베이스 데이터 유지하며 재시작
docker compose restart

# 데이터베이스 데이터까지 완전 초기화
docker compose down -v
```

## 트러블슈팅

### 일반적인 문제 해결

**빌드 오류 발생 시:**
```bash
# 캐시 제거 후 재빌드
docker compose build --no-cache
docker compose up
```

**데이터베이스 연결 실패 시:**
```bash
# PostgreSQL 상태 확인
docker compose ps postgres
docker compose logs postgres

# 애플리케이션 로그 확인
docker compose logs app | grep -i "database"
```

**포트 충돌 시:**
`docker-compose.yml` 파일에서 포트 변경:
```yaml
ports:
  - "8080:5000"  # 로컬 8080 → 컨테이너 5000
```

## 프로젝트 구조

```
├── client/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/     # UI 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   └── hooks/         # 커스텀 훅
├── server/                # Express 백엔드
│   ├── entities/         # TypeORM 엔터티
│   ├── index.ts          # 서버 진입점
│   ├── routes.ts         # API 라우트
│   ├── db.ts            # 데이터베이스 연결
│   └── storage-typeorm.ts # TypeORM 저장소
├── migrations/           # TypeORM 마이그레이션
├── scripts/             # 유틸리티 스크립트
├── shared/             # 공유 설정
└── package.json
```

## 데이터베이스 관리

현재 프로젝트는 **TypeORM + PostgreSQL**을 사용하여 데이터를 관리합니다.

### 데이터베이스 구조

**엔터티:**
- `User`: 사용자 정보 (id, username, password)
- `SiteContent`: 사이트 콘텐츠 관리 (id, key, data, createdAt, updatedAt)

**주요 특징:**
- TypeORM 마이그레이션을 통한 안전한 스키마 관리
- JSON 타입으로 유연한 콘텐츠 저장
- 환경별 데이터베이스 연결 설정 자동화



### 데이터베이스 API

**사이트 콘텐츠 관리:**
```bash
GET /api/site-content/:key      # 특정 콘텐츠 조회
GET /api/site-content           # 전체 콘텐츠 조회
POST /api/site-content          # 새 콘텐츠 생성
PUT /api/site-content/:key      # 콘텐츠 업데이트
```

### 콘텐츠 관리 시스템

사이트의 모든 텍스트 콘텐츠는 데이터베이스에서 동적으로 관리됩니다:
- Hero 섹션 (제목, 부제목, 설명)
- 브랜드 스토리 및 통계
- 회사 히스토리 타임라인
- 미션/비전/핵심가치
- 연락처 정보

데이터베이스 오류 시 `shared/siteConfig.ts`의 기본값으로 폴백합니다.

## 주요 기능

- AI 기반 향수 추천 시스템
- 사용자 개인화 프로필
- 반응형 한국어 인터페이스
- 브랜드 스토리 및 회사 히스토리
- 실시간 데이터 업데이트

## 성능 최적화

- Vite를 통한 빠른 빌드
- 코드 스플리팅 및 지연 로딩
- TanStack Query를 통한 효율적인 데이터 캐싱
- 프로덕션 빌드에서 최적화된 번들 크기

## 프로젝트 아키텍처

### Docker 네트워크 구성
- **네트워크명**: `studiofragrance_network`
- **PostgreSQL 컨테이너**: `studiofragrance_db`
- **애플리케이션 컨테이너**: `studiofragrance_app`
- **내부 통신**: `postgres:5432` (컨테이너 간 통신)
- **외부 접근**: `localhost:5432` (PostgreSQL), `localhost:5000` (애플리케이션)

### 환경 변수
Docker Compose에서 자동 설정:
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres:postgres123@postgres:5432/studiofragrance
POSTGRES_DB=studiofragrance
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
```

### 데이터 지속성
- PostgreSQL 데이터는 `studiofragrance_postgres_data` Docker 볼륨에 저장
- 컨테이너 재시작 시에도 데이터 유지
- 완전 초기화: `docker compose down -v`

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.