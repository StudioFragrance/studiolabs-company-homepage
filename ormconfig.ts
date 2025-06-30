import { DataSource } from "typeorm";
import dotenv from "dotenv";

// 환경 변수 로드
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// 환경에 따라 경로 설정 - Docker 프로덕션에서는 컴파일된 JS 파일 사용
const isProduction = process.env.NODE_ENV === 'production';
const entityPaths = isProduction ? ["dist/server/entities/*.js"] : ["server/entities/*.ts"];
const migrationPaths = isProduction ? ["dist/migrations/*.js"] : ["migrations/*.ts"];

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