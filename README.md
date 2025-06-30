# Studiolabs Homepage - AI 향수 추천 플랫폼

AI 기술을 활용한 개인 맞춤형 향수 추천 웹 애플리케이션입니다.

## 기술 스택

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **데이터베이스**: TypeORM + PostgreSQL (Docker 네트워크 지원)
- **빌드 도구**: Vite, ESBuild (멀티스테이지 Docker 빌드)
- **상태 관리**: TanStack Query
- **애니메이션**: Framer Motion
- **보안**: Express Rate Limit, Helmet.js, 입력 검증
- **성능**: 메모리 캐싱 (5분 TTL), DB 쿼리 최적화
- **인증**: Naver Works OAuth 2.0

## 프로젝트 실행 방법

Studiolabs는 Docker를 사용하여 PostgreSQL 데이터베이스와 함께 실행됩니다.

### 필수 요구사항
- Docker
- Docker Compose

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd studiolabs-homepage
```

### 2. 환경 변수 설정
Docker 실행 전에 `.env.docker` 파일에서 실제 OAuth 키를 설정하세요:
```bash
# .env.docker 파일 편집
NAVER_WORKS_CLIENT_ID=실제_클라이언트_ID
NAVER_WORKS_CLIENT_SECRET=실제_클라이언트_시크릿
NAVER_WORKS_REDIRECT_URI=http://localhost:5000/auth/naver-works/callback
```

### 3. Docker로 전체 시스템 실행
```bash
# PostgreSQL과 애플리케이션을 함께 실행
docker compose up --build

# 백그라운드 실행
docker compose up -d --build
```

실행 과정에서 다음이 자동으로 실행됩니다:
- 📡 데이터베이스 연결 대기
- 🔧 마이그레이션 실행 (`./migrate.sh run`)
- 🌱 초기 데이터 시딩 (`scripts/seed-data.ts`)
- 🎯 웹 서버 시작

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

### 자동 설정
Docker 컨테이너가 시작될 때 다음 작업이 자동으로 실행됩니다:
1. 데이터베이스 연결 대기
2. 마이그레이션 실행 (테이블 생성)
3. 초기 데이터 시딩 (사이트 콘텐츠)
4. 웹 서버 시작

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

### 빌드 최적화
- **멀티스테이지 Docker 빌드**: 개발 의존성과 프로덕션 의존성 분리
- **Vite**: 빠른 개발 서버와 최적화된 프로덕션 빌드
- **ESBuild**: TypeScript 및 마이그레이션 파일 고속 컴파일

### 런타임 최적화
- **메모리 캐싱**: 5분 TTL로 DB 쿼리 결과 캐싱
- **TanStack Query**: 클라이언트 사이드 데이터 캐싱 및 무효화
- **데이터베이스 최적화**: 일관된 정렬 및 인덱스 활용

## 보안 강화

### API 보안
- **권한 기반 접근 제어**: 관리자 전용 API 보호
- **레이트 리미팅**: 일반 API 100회/15분, 관리자 API 30회/15분
- **입력 검증**: 파라미터 타입/길이 검증, 화이트리스트 기반 접근
- **보안 헤더**: Helmet.js를 통한 CSP, XSS 방지

### 인증 시스템
- **OAuth 2.0**: Naver Works를 통한 안전한 관리자 인증
- **세션 관리**: 안전한 세션 쿠키 및 토큰 관리

자세한 보안 감사 내용은 `SECURITY_AUDIT_REPORT.md`를 참조하세요.

## 프로젝트 아키텍처

### Docker 네트워크 구성
- **네트워크명**: `studiofragrance_network`
- **PostgreSQL 컨테이너**: `studiofragrance_db`
- **애플리케이션 컨테이너**: `studiofragrance_app`
- **내부 통신**: `postgres:5432` (컨테이너 간 통신)
- **외부 접근**: `localhost:5432` (PostgreSQL), `localhost:5000` (애플리케이션)

### 환경 변수

#### 기본 설정 (Docker Compose 자동 설정)
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres:postgres123@postgres:5432/studiofragrance
```

#### 관리자 인증 (선택사항)
Naver Works OAuth를 통한 관리자 페이지 접근:
```bash
NAVER_WORKS_CLIENT_ID=your_client_id
NAVER_WORKS_CLIENT_SECRET=your_client_secret
NAVER_WORKS_REDIRECT_URI=https://your-domain/auth/naver-works/callback
SESSION_SECRET=your_session_secret
```

`.env` 파일을 생성하여 환경 변수를 설정하면 Docker Compose에서 자동으로 로드됩니다.

### 데이터 지속성
- PostgreSQL 데이터는 `studiofragrance_postgres_data` Docker 볼륨에 저장
- 컨테이너 재시작 시에도 데이터 유지
- 완전 초기화: `docker compose down -v`

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.