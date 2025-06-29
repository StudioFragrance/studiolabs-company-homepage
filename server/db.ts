import "reflect-metadata";
import { DataSource } from "typeorm";
import { SiteContent } from "./entities/SiteContent";
import { User } from "./entities/User";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [User, SiteContent],
  synchronize: true, // TypeORM이 자동으로 테이블 생성
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  // Docker 네트워크 연결을 위한 추가 설정
  connectTimeoutMS: 60000,
  extra: {
    connectionLimit: 10,
  }
});

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Database connection established");
    }
  } catch (error) {
    console.error("Error during database initialization:", error);
    throw error;
  }
};