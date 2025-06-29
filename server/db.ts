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
  synchronize: true, // 개발 환경에서만 사용, 운영에서는 false
  logging: false,
  ssl: {
    rejectUnauthorized: false
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