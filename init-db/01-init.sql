-- 데이터베이스 초기화 스크립트
-- TypeORM이 synchronize: true로 설정되어 있어 테이블은 자동 생성됨

-- 초기 사용자 데이터 (필요한 경우)
-- INSERT INTO users (username, password) VALUES ('admin', 'hashed_password_here');

-- 필요한 확장 기능 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 초기 설정 완료 로그
DO $$
BEGIN
    RAISE NOTICE 'Database initialization completed for Studio fragrance';
END $$;