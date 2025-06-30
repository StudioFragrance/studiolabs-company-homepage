import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./server/entities/User";
import { SiteContent } from "./server/entities/SiteContent";
import { AdminUser } from "./server/entities/AdminUser";

// 환경 변수 로드
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// 환경에 따라 마이그레이션 경로 설정
const isProduction = process.env.NODE_ENV === 'production';
const migrationPaths = isProduction ? ["dist/migrations/*.js"] : ["migrations/*.ts"];

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [User, SiteContent, AdminUser],
  synchronize: false,
  migrationsTableName: "migrations",
  ssl: false,
});

export default AppDataSource;