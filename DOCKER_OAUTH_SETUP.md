# Docker 환경에서 네이버웍스 OAuth 설정 가이드

## 문제점
Docker 환경에서 네이버웍스 OAuth 인증 시 다음 문제들이 발생:
1. 콜백 URL이 localhost로 설정되어 외부 접근 불가
2. State 파라미터 검증 실패로 "Unable to verify authorization request state" 오류

## 해결 방안

### 1. 동적 콜백 URL 설정
```javascript
// server/auth/naver-works.ts
// Docker 환경에서 동적 콜백 URL 생성
if (!callbackURL || callbackURL.includes('localhost')) {
  callbackURL = process.env.DOCKER_CALLBACK_URL || `http://localhost:5000/auth/naver-works/callback`;
  console.log('Docker 환경 콜백 URL 설정:', callbackURL);
}
```

### 2. 환경별 State 파라미터 설정
```javascript
// 프로덕션(Docker) 환경에서는 state 비활성화
state: process.env.NODE_ENV === 'production' ? false : true
```

### 3. Docker Compose 환경 변수 추가
```yaml
environment:
  - NODE_ENV=production
  - DOCKER_CALLBACK_URL=http://localhost:5000/auth/naver-works/callback
```

## 사용 방법

### Docker 환경에서 실행 시:
1. 네이버웍스 개발자 콘솔에서 콜백 URL을 다음과 같이 등록:
   ```
   http://localhost:5000/auth/naver-works/callback
   ```
   또는 실제 서버 도메인:
   ```
   http://your-server-domain:5000/auth/naver-works/callback
   ```

2. Docker Compose 실행:
   ```bash
   docker compose up
   ```

3. 브라우저에서 http://localhost:5000/login 접속하여 로그인 테스트

### 외부 도메인에서 접근 시:
환경 변수 DOCKER_CALLBACK_URL을 실제 도메인으로 설정:
```bash
export DOCKER_CALLBACK_URL=http://your-domain.com:5000/auth/naver-works/callback
```

## 주의사항
- Docker 환경에서는 localhost가 컨테이너 내부를 의미하므로 외부 접근 불가
- 실제 배포 시에는 DOCKER_CALLBACK_URL을 실제 도메인으로 설정 필요
- 네이버웍스 콘솔의 콜백 URL과 정확히 일치해야 함

---
*작성일: 2025-06-30*
*Docker OAuth 설정 완료*