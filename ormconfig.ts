import { DataSource } from "typeorm";
import { User } from "./server/entities/User";
import { SiteContent } from "./server/entities/SiteContent";
import dotenv from "dotenv";

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
  entities: [User, SiteContent],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  migrations: ["migrations/*.ts"],
  migrationsTableName: "migrations",
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
});

export default AppDataSource;