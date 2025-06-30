# Studio fragrance - AI-Powered Fragrance Recommendation Platform

## Overview

Studio fragrance is a modern web application that provides personalized fragrance recommendations using AI technology. The platform features a sleek Korean-language interface designed to help users discover their perfect scent through intelligent recommendation algorithms.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query for server state management
- **Animations**: Framer Motion for smooth animations
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Development**: Hot reloading with Vite integration
- **Build System**: ESBuild for production builds

### Data Storage Layer
- **Current Implementation**: TypeORM + PostgreSQL database
- **Database Entities**: User, SiteContent with TypeORM migration system
- **Storage Interface**: DatabaseStorage with TypeORM repository pattern
- **Schema Management**: TypeORM migrations with CLI tools (./migrate.sh)
- **Production**: Docker network with PostgreSQL container and data persistence

## Key Components

### Frontend Components
1. **Landing Page Architecture**
   - Hero section with brand messaging
   - Brand story section with AI recommendation focus
   - Company history timeline
   - Mission/Vision/Core Values display
   - Contact information section

2. **UI System**
   - Complete shadcn/ui component library
   - Custom cursor implementation
   - Toast notification system
   - Mobile-responsive design

3. **Animation System**
   - Framer Motion integration
   - Intersection Observer for scroll-triggered animations
   - Smooth scrolling navigation

### Backend Components
1. **Express Server**
   - Middleware for JSON parsing and logging
   - Error handling middleware
   - Development-optimized request logging

2. **Database Layer**
   - TypeORM with PostgreSQL connection
   - DatabaseStorage implementation with repository pattern
   - User and SiteContent entity management
   - TypeORM migration system for schema management

3. **Development Tools**
   - Vite middleware integration
   - Hot module replacement
   - Runtime error overlay

## Data Flow

1. **Client-Side Rendering**: React components render the user interface
2. **API Communication**: TanStack Query manages server state and API calls
3. **Backend Processing**: Express server handles API requests
4. **Data Storage**: Storage interface abstracts database operations
5. **Real-time Updates**: Query invalidation ensures fresh data

## External Dependencies

### Core Technologies
- **Package Manager**: pnpm (migrated from npm)
- **Database**: PostgreSQL with TypeORM (Docker containerized)
- **Fonts**: Custom Korean fonts (LINE Seed KR family)
- **Icons**: Lucide React icons
- **Development**: Replit environment with hot reloading
- **Container**: Docker Compose with PostgreSQL and app services

### Development Tools
- **Replit Integration**: Cartographer plugin and runtime error modal
- **TypeScript**: Full type safety across the stack
- **ESLint/Prettier**: Code quality and formatting (configured via shadcn/ui)

## Deployment Strategy

### Development Environment
- Vite dev server with hot reloading
- Express server with middleware integration
- PostgreSQL database with TypeORM auto-sync

### Production Build
- Vite builds optimized frontend bundle
- ESBuild compiles backend to single file
- Static assets served from Express
- Docker containerized with PostgreSQL database

### Docker Network Configuration
- PostgreSQL container: studiofragrance_db
- Application container: studiofragrance_app
- Network: studiofragrance_network
- Persistent volume: studiofragrance_postgres_data

### Environment Configuration
- `NODE_ENV` for environment detection (development/production)
- Simplified configuration with minimal environment variables
- Future-ready for database integration when needed

## Changelog
- June 30, 2025: **시드 데이터 완전성 보장** - 누락된 companyHistory, mvc, contact 콘텐츠 추가하여 모든 페이지 섹션 완성. 처음 실행 시 5개 핵심 콘텐츠(hero, brandStory, companyHistory, mvc, contact) 자동 생성 확인
- June 30, 2025: **처음 실행 시나리오 테스트 완료** - 깨끗한 데이터베이스에서 마이그레이션 → 시드 데이터 생성 순서 수정. 초기 실행 시 모든 시스템 정상 작동 검증 완료
- June 30, 2025: **Docker 정적 파일 서빙 경로 문제 해결** - Vite 빌드 출력이 dist/public/에 생성되므로 COPY 명령을 /app/dist/public/ → /app/server/public/로 수정. index.html 파일 위치 오류 해결
- June 30, 2025: **Docker 필수 설정 파일 누락 문제 해결** - vite.config.ts, postcss.config.js, tailwind.config.ts, components.json, client/ 디렉토리 복사 추가. server/vite.ts에서 필요한 모든 설정 파일들이 Docker 환경에서 접근 가능하도록 구성 완료
- June 30, 2025: **Docker ESNext + ESM 런타임 실행 구조 완성** - tsx 직접 실행으로 TypeScript 컴파일 과정 제거. ESNext + ESM 모던 구조 유지하면서 Docker 환경에서 모듈 해결 문제 완전 회피. 개발/프로덕션 환경 일관성 확보
- June 30, 2025: **Docker TypeScript 마이그레이션 문제 해결** - Docker 환경에서 .ts 파일 실행 오류 해결. 프로덕션에서는 컴파일된 JavaScript 파일 사용하도록 ormconfig 및 Dockerfile 수정. 불필요한 DOCKER 환경변수 제거로 코드 간소화
- June 30, 2025: **환경별 세션 보안 설정 완성** - 개발환경에서는 HTTP 허용, 프로덕션에서는 HTTPS만 허용하도록 환경별 세션 쿠키 설정 구현. sameSite 정책도 환경에 따라 자동 조정
- June 30, 2025: **Docker 세션 쿠키 문제 해결** - Docker 환경에서 세션 ID 불일치 문제를 세션 설정 최적화로 해결. secure: false, sameSite: lax, 명시적 쿠키 이름 설정으로 크로스 컨테이너 세션 유지 보장
- June 30, 2025: **커스텀 State Store OAuth 시스템 완성** - passport-oauth2의 state 검증 실패 문제를 커스텀 state store로 해결. 세션 강제 저장, 상세 디버깅 로그, Docker 환경 호환성 구현. Replit 환경에서 정상 작동 확인
- June 30, 2025: **Docker 환경 OAuth 설정 완료** - Docker에서 콜백 URL localhost 문제와 state 검증 실패 해결. 동적 콜백 URL 생성, 환경별 state 설정, Docker Compose 환경 변수 추가. DOCKER_OAUTH_SETUP.md 가이드 문서 작성
- June 30, 2025: **네이버웍스 OAuth 인증 문제 해결** - 도커 초기 실행 후 "사용자 정보를 가져올 수 없습니다" 오류를 원래 설정 복원으로 해결. state 파라미터와 OAuth 라우트를 기본 passport 방식으로 되돌려 정상 작동 확인. OAUTH_TROUBLESHOOTING_REPORT.md 문서 작성
- June 30, 2025: **Docker 마이그레이션 중복 실행 문제 해결** - 테이블 존재 여부 확인 로직 추가로 기존 데이터가 있는 환경에서도 안전한 배포 가능
- June 30, 2025: **Docker 배포 완전 최적화 완료** - 엔티티 파일 복사, reflect-metadata 설정, 환경 파일 포함, TypeScript 경로 단순화로 Docker 배포 안정성 보장
- June 30, 2025: **네이버웍스 조직 구성원 목록 기능 완성** - OAuth 토큰 세션 저장, 여러 API 엔드포인트 자동 시도, name 객체 문자열 변환, React 렌더링 오류 해결. 관리자 추가 시 조직 구성원 선택 가능
- June 30, 2025: **대표자 계정 삭제 방지 시스템 구축** - 웹 콘솔에서 대표자 계정 삭제 불가하도록 백엔드/프론트엔드 이중 보호 구현
- June 30, 2025: **seed-data에 기본 관리자 권한 자동 생성 추가** - Docker 배포와 개발 환경에서 partis98@studiolabs.co.kr (배성준/대표자) 권한이 자동으로 생성되도록 개선
- June 30, 2025: **데이터베이스 기반 관리자 권한 시스템 구축 완료** - AdminUser 테이블 생성, 관리자 사용자 CRUD API, 웹 관리 인터페이스, 권한 검증을 데이터베이스 기반으로 전환. 초기 관리자: partis98@studiolabs.co.kr (배성준/대표자)
- June 30, 2025: **네이버웍스 권한 없는 사용자 오류 처리 개선 완료** - requireAdmin 미들웨어 강화, OAuth 콜백에서 권한 검증, 로그인 페이지 상세 오류 메시지, 관리자 페이지 권한 검증, 마우스 포인터 문제 완전 해결
- June 30, 2025: **프로젝트 전면 최적화 완료** - 멀티스테이지 Dockerfile, TypeScript 오류 수정, 불필요한 파일 정리, 마이그레이션/Seed 데이터 업데이트, README.md 전면 개편
- June 30, 2025: **API 보안 및 성능 최적화 완료** - 권한 기반 접근 제어, 입력 검증, 레이트 리미팅, 보안 헤더, 메모리 캐싱 시스템 구축. SECURITY_AUDIT_REPORT.md 생성
- June 30, 2025: **사용자 정보 표시 문제 해결** - 네이버웍스 name 객체를 문자열로 변환하는 로직 완성, 관리자 페이지 마우스 포인터 효과 제거
- June 30, 2025: **관리자 페이지 편집 기능 완전 구현** - 모든 주요 섹션(히어로, 브랜드 스토리, 회사 연혁, 철학, 연락처) 편집기 완료, 실시간 미리보기와 데이터 저장 기능 정상 작동
- June 30, 2025: **연락처 편집기 구현 완료** - ContactEditor 컴포넌트 추가, 협업/입점 문의 및 채용 정보 편집 기능, Switch 컴포넌트로 채용 활성화 토글 구현
- June 30, 2025: **철학(MVC) 편집기 구현 완료** - MVCEditor 컴포넌트 추가, 미션/비전/핵심가치 편집 기능, 3열 그리드 미리보기 디자인
- June 30, 2025: **API 요청 매개변수 순서 오류 해결** - apiRequest 함수 호출 시 method, url, data 순서로 수정하여 저장 기능 정상화
- June 29, 2025: **siteConfig 파일 완전 삭제** - 모든 컴포넌트가 데이터베이스에서 직접 콘텐츠 로드, 정적 설정 파일 제거로 완전한 동적 CMS 구축
- June 29, 2025: **siteConfig 파일 정리 완료** - 사용되지 않는 company 섹션 제거로 설정 파일 간소화
- June 29, 2025: **프론트엔드 타입 안전성 개선** - HeroSection의 mainTitle 접근 시 null 체크 추가
- June 29, 2025: **Docker 자동 데이터 시딩 추가** - 컨테이너 시작 시 초기 사이트 콘텐츠 자동 생성으로 빈 웹사이트 문제 해결
- June 29, 2025: **TypeScript 마이그레이션 컴파일 문제 해결** - Docker 빌드에서 마이그레이션 파일을 JS로 컴파일하도록 수정
- June 29, 2025: **Docker SSL 연결 오류 해결** - PostgreSQL 컨테이너에서 SSL 비활성화로 연결 문제 해결
- June 29, 2025: **Docker 엔트리포인트 최적화** - 별도 스크립트 대신 CMD에서 직접 실행으로 파일 경로 문제 해결
- June 29, 2025: **README.md를 Docker 중심 가이드로 완전 개편** - 마이그레이션 관리 및 컨테이너 운영 중심 문서화
- June 29, 2025: **프로젝트 파일 정리 완료** - 불필요한 파일 제거 (storage.ts, attached_assets, shared/schema.ts, init-db)
- June 29, 2025: TypeORM 마이그레이션 시스템 구축 완료 - synchronize 비활성화, CLI 도구 및 베이스라인 마이그레이션 생성
- June 29, 2025: 마이그레이션 관리 도구 추가 - ./migrate.sh 스크립트로 run/revert/show/generate 기능 제공
- June 29, 2025: 기존 테이블 베이스라인 처리 완료 - synchronize로 생성된 테이블을 마이그레이션 시스템에 통합
- June 29, 2025: Docker 네트워크 및 PostgreSQL 마이그레이션 완료 - TypeORM + PostgreSQL로 완전 전환, Docker Compose 배포 환경 구축
- June 29, 2025: Docker Compose 설정 완료 - PostgreSQL 컨테이너와 앱 컨테이너 간 네트워크 통신 구성
- June 29, 2025: README.md에 Docker 네트워크 배포 가이드 추가 - 컨테이너 관리 및 트러블슈팅 섹션 포함
- June 29, 2025: 환경별 호스트 바인딩 개선 - 프로덕션/Docker 환경에서 0.0.0.0 자동 사용
- June 29, 2025: TypeORM 설정 최적화 - Docker 네트워크 연결 타임아웃 및 SSL 설정 개선
- June 29, 2025: 중앙 집중식 사이트 콘텐츠 관리 시스템 구축 완료 - shared/siteConfig.ts로 모든 텍스트 콘텐츠 통합 관리
- June 29, 2025: 모든 React 컴포넌트를 설정 파일 기반으로 리팩토링 완료 (Hero, BrandStory, CompanyHistory, MVC, Contact, Footer)
- June 29, 2025: 배포 후 데이터 변경 가능한 구조 완성 - 코드 수정 없이 siteConfig.ts 파일만 편집하여 콘텐츠 관리 가능
- June 29, 2025: Successfully migrated from Replit Agent to standard Replit environment
- June 28, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language in Korean (한국어).