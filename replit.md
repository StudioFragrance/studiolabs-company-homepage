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
- **Current Implementation**: In-memory storage (MemStorage)
- **Schema Design**: Drizzle ORM with PostgreSQL dialect (prepared for future use)
- **Storage Interface**: Abstract IStorage interface for easy database migration
- **Development**: All data stored in memory, resets on server restart

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

2. **Storage Layer**
   - Abstract IStorage interface
   - In-memory storage implementation
   - User CRUD operations (ready for database integration)

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
- **Data Storage**: In-memory storage (no external database currently)
- **Fonts**: Custom Korean fonts (LINE Seed KR family)
- **Icons**: Lucide React icons
- **Development**: Replit environment with hot reloading

### Development Tools
- **Replit Integration**: Cartographer plugin and runtime error modal
- **TypeScript**: Full type safety across the stack
- **ESLint/Prettier**: Code quality and formatting (configured via shadcn/ui)

## Deployment Strategy

### Development Environment
- Vite dev server with hot reloading
- Express server with middleware integration
- In-memory storage for rapid development

### Production Build
- Vite builds optimized frontend bundle
- ESBuild compiles backend to single file
- Static assets served from Express
- PostgreSQL database connection via environment variables

### Environment Configuration
- `NODE_ENV` for environment detection (development/production)
- Simplified configuration with minimal environment variables
- Future-ready for database integration when needed

## Changelog
- June 29, 2025: README.md 업데이트 완료 - 현재 인메모리 스토리지 사용 상태 반영, npm 명령어를 pnpm으로 변경
- June 29, 2025: 불필요한 환경변수 정리 완료 (PORT, DATABASE_URL, SESSION_SECRET 제거 - 현재 사용되지 않음)
- June 29, 2025: dotenv 설정 추가하여 환경변수를 .env 파일로 관리하도록 개선
- June 29, 2025: Successfully migrated from Replit Agent to standard Replit environment
- June 29, 2025: Removed Docker configuration files (Dockerfile, docker-compose.yml, .dockerignore) to simplify deployment strategy
- June 28, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language in Korean (한국어).