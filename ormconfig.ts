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

// Docker 환경에서는 항상 컴파일된 마이그레이션 사용
const migrationPaths = process.env.DOCKER_ENV === 'true' ? ["dist/migrations/*.js"] : ["migrations/*.ts"];

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [User, SiteContent, AdminUser],
  synchronize: false,
  migrationsTableName: "migrations",
  ssl: false,
});

export default AppDataSource;