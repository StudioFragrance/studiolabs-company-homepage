import { DataSource } from "typeorm";
import dotenv from "dotenv";

// 환경 변수 로드
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// 환경에 따라 엔티티 경로 설정 - Docker에서는 TypeScript 파일 직접 사용
const isProduction = process.env.NODE_ENV === 'production';
const entityPaths = ["server/entities/*.ts"]; // Docker에서 tsx로 실행
const migrationPaths = ["migrations/*.ts"]; // Docker에서 tsx로 실행

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: entityPaths,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  migrations: migrationPaths,
  migrationsTableName: "migrations",
  ssl: false, // Docker 환경에서는 SSL 비활성화
});

export default AppDataSource;