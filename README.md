# Studio Fragrance - AI 향수 추천 플랫폼

AI 기술을 활용한 개인 맞춤형 향수 추천 웹 애플리케이션입니다.

## 기술 스택

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **데이터 저장**: 인메모리 스토리지 (MemStorage)
- **빌드 도구**: Vite, ESBuild
- **상태 관리**: TanStack Query
- **애니메이션**: Framer Motion

## 로컬 개발 환경 설정

### 1. 의존성 설치
```bash
pnpm install
```

### 2. 환경 변수 설정
`.env.example` 파일을 `.env`로 복사하고 필요한 값들을 설정하세요:
```bash
cp .env.example .env
```

`.env` 파일 예시:
```
NODE_ENV=development
```

### 3. 개발 서버 실행
```bash
pnpm run dev
```

개발 서버는 `http://localhost:5000`에서 실행됩니다.

**참고**: 
- 로컬 환경: `localhost:5000`
- Replit/클라우드 환경: `0.0.0.0:5000`

## 배포 환경 실행 방법

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd studio-fragrance
```

### 2. 의존성 설치
```bash
pnpm install
```

### 3. 환경 변수 설정
`.env.example` 파일을 `.env`로 복사하고 프로덕션 값으로 설정:
```bash
cp .env.example .env
```

`.env` 파일에서 다음 값을 설정:
```
NODE_ENV=production
```

### 4. 프로젝트 빌드
```bash
pnpm run build
```

### 5. 프로덕션 서버 실행
```bash
pnpm start
```

서버는 포트 5000에서 실행됩니다 (환경변수 PORT로 변경 가능).

**환경별 호스트 차이:**
- 로컬 환경: `localhost:5000`
- Replit/클라우드 환경: `0.0.0.0:5000`

## Docker를 사용한 배포

Docker를 사용하여 배포하는 경우, 다음 사항들을 고려하세요:

### Dockerfile 작성 시 권장사항
- Node.js 20 이상 사용
- pnpm 패키지 매니저 사용
- `pnpm install --frozen-lockfile` 사용하여 프로덕션 의존성 설치
- 멀티 스테이지 빌드로 이미지 크기 최적화
- 포트 5000 노출
- .env 파일을 컨테이너에 복사하거나 환경 변수로 설정

### 환경 변수
컨테이너 실행 시 .env 파일을 마운트하거나 다음 환경 변수를 설정하세요:
```bash
-e NODE_ENV=production
```

## 프로젝트 구조

```
├── client/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/     # UI 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   └── hooks/         # 커스텀 훅
├── server/                # Express 백엔드
│   ├── index.ts          # 서버 진입점
│   ├── routes.ts         # API 라우트
│   └── storage.ts        # 데이터 저장소
├── shared/               # 공유 타입 및 스키마
└── package.json
```

## 데이터 저장

현재 프로젝트는 **인메모리 스토리지(MemStorage)**를 사용하여 데이터를 저장합니다.
- 서버 재시작 시 데이터가 초기화됩니다
- 개발 단계에 적합한 간단한 저장 방식입니다
- 향후 PostgreSQL 데이터베이스로 전환 가능하도록 인터페이스가 설계되어 있습니다

### 데이터베이스로 전환 (선택사항)
PostgreSQL을 사용하려면:
1. `DATABASE_URL` 환경변수 설정
2. 스키마 적용: `pnpm run db:push`
3. `server/storage.ts`에서 실제 데이터베이스 연결 구현

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

## 문제 해결

### 포트 충돌
다른 포트 사용:
```bash
PORT=8080 npm start
```

### 데이터베이스 연결 실패
- `DATABASE_URL` 환경 변수가 올바르게 설정되었는지 확인
- PostgreSQL 서버가 실행 중인지 확인
- 네트워크 연결 상태 확인

### 빌드 오류
```bash
# 노드 모듈 재설치
rm -rf node_modules package-lock.json
npm install
```

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.