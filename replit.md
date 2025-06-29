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