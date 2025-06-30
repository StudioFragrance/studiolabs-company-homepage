import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { AdminUser } from "./server/entities/AdminUser.ts";
import { SiteContent } from "./server/entities/SiteContent.ts";
import { User } from "./server/entities/User.ts";

// 환경 변수 로드
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [AdminUser, SiteContent, User],
  synchronize: false,
  migrationsTableName: "migrations",
});

export default AppDataSource;