# Studio Fragrance - AI 향수 추천 플랫폼

Studio Fragrance는 AI 기술을 활용한 개인 맞춤형 향수 추천 웹 애플리케이션입니다. 세련된 한국어 인터페이스를 통해 사용자가 완벽한 향수를 찾을 수 있도록 도와줍니다.

## 🚀 주요 기능

- **AI 기반 향수 추천**: 개인 취향을 분석하여 맞춤형 향수 추천
- **현대적인 UI**: React 18 + TypeScript + Tailwind CSS 기반 반응형 디자인
- **부드러운 애니메이션**: Framer Motion을 활용한 사용자 경험
- **모바일 최적화**: 모든 기기에서 완벽한 사용자 경험

## 🛠 기술 스택

### Frontend
- **React 18** - 모던 UI 라이브러리
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 중심 CSS 프레임워크
- **shadcn/ui** - 고품질 컴포넌트 라이브러리
- **Framer Motion** - 애니메이션 라이브러리
- **Wouter** - 경량 React 라우터
- **TanStack Query** - 서버 상태 관리

### Backend
- **Node.js** - JavaScript 런타임
- **Express.js** - 웹 프레임워크
- **TypeScript** - 풀스택 타입 안전성
- **Drizzle ORM** - 현대적인 TypeScript ORM

### 개발 도구
- **Vite** - 빠른 개발 서버 및 빌드 도구
- **ESBuild** - 고성능 번들러
- **PostCSS** - CSS 후처리

## 📦 설치 및 실행

### 시스템 요구사항
- Node.js 20 이상
- npm 또는 pnpm

### 로컬 개발 환경 설정

1. **저장소 클론**
   ```bash
   git clone <repository-url>
   cd studio-fragrance
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

4. **브라우저에서 확인**
   - http://localhost:5000 에서 애플리케이션 확인

### 사용 가능한 스크립트

```bash
# 개발 서버 실행 (포트 5000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 타입 체크
npm run check

# 데이터베이스 스키마 푸시 (데이터베이스 연결 시)
npm run db:push
```

## 🏗 프로젝트 구조

```
studio-fragrance/
├── client/                 # Frontend 소스
│   ├── src/
│   │   ├── components/     # React 컴포넌트
│   │   │   ├── ui/        # shadcn/ui 컴포넌트
│   │   │   └── *.tsx      # 페이지별 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── hooks/         # 커스텀 React 훅
│   │   ├── lib/           # 유틸리티 함수
│   │   └── assets/        # 정적 자산
│   └── index.html         # HTML 진입점
├── server/                # Backend 소스
│   ├── index.ts          # Express 서버 진입점
│   ├── routes.ts         # API 라우트
│   ├── storage.ts        # 데이터 저장 계층
│   └── vite.ts           # Vite 통합
├── shared/               # Frontend/Backend 공유 타입
│   └── schema.ts         # 데이터베이스 스키마
├── attached_assets/      # 첨부 자산
├── package.json         # 의존성 및 스크립트
├── vite.config.ts       # Vite 설정
├── tailwind.config.ts   # Tailwind CSS 설정
└── tsconfig.json        # TypeScript 설정
```

## 🌐 배포

### 개발 환경
- Vite 개발 서버 + Express API 서버
- 포트 5000에서 실행
- 핫 리로딩 지원

### 프로덕션 환경
1. **빌드 실행**
   ```bash
   npm run build
   ```

2. **정적 파일 배포** (선택사항)
   - `dist/public/` 폴더를 nginx 또는 다른 웹 서버에 배포

3. **서버 배포** (선택사항)
   ```bash
   npm start
   ```

## 🎨 UI 컴포넌트

프로젝트는 shadcn/ui를 기반으로 한 컴포넌트 라이브러리를 사용합니다:

- **네비게이션**: 반응형 메뉴
- **히어로 섹션**: 브랜드 메시지 
- **브랜드 스토리**: AI 추천 시스템 소개
- **회사 히스토리**: 타임라인 형태 연혁
- **미션/비전/핵심가치**: 브랜드 철학
- **연락처**: 문의 정보
- **커스텀 커서**: 독특한 사용자 경험

## 🔧 환경 변수

개발 환경에서 필요한 환경 변수:

```bash
NODE_ENV=development          # 환경 설정
DATABASE_URL=<db-url>        # 데이터베이스 연결 (선택사항)
REPL_ID=<replit-id>          # Replit 환경 (선택사항)
```

## 🤝 기여하기

1. 이슈를 생성하거나 기존 이슈 선택
2. 기능 브랜치 생성: `git checkout -b feature/amazing-feature`
3. 변경사항 커밋: `git commit -m 'Add some amazing feature'`
4. 브랜치에 푸시: `git push origin feature/amazing-feature`
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🆘 문제 해결

### 일반적인 문제

1. **포트 5000이 이미 사용 중**
   - 다른 프로세스가 포트를 사용하고 있는지 확인
   - `lsof -i :5000` 명령어로 확인

2. **의존성 설치 오류**
   - Node.js 버전 확인 (20 이상 필요)
   - `npm cache clean --force` 실행 후 재설치

3. **타입 에러**
   - `npm run check` 명령어로 타입 체크
   - TypeScript 설정 확인

### 개발 팁

- **핫 리로딩**: 파일 저장 시 자동으로 브라우저 새로고침
- **에러 오버레이**: 런타임 오류 발생 시 화면에 표시
- **개발자 도구**: React DevTools 확장 프로그램 사용 권장

---

**Studio Fragrance** - AI가 추천하는 당신만의 향수를 찾아보세요! 🌸