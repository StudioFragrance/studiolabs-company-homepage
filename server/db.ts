import "reflect-metadata";
import { DataSource } from "typeorm";
import { SiteContent } from "./entities/SiteContent";
import { User } from "./entities/User";
import { AdminUser } from "./entities/AdminUser";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [User, SiteContent, AdminUser],
  synchronize: false, // 마이그레이션을 통해서만 테이블 관리
  logging: process.env.NODE_ENV === 'development',
  migrations: [process.env.NODE_ENV === 'production' ? "dist/migrations/*.js" : "migrations/*.ts"],
  migrationsTableName: "migrations",
  ssl: false, // Docker 환경에서는 SSL 비활성화
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
      
      // 개발 환경에서만 자동으로 마이그레이션 실행
      if (process.env.NODE_ENV === 'development') {
        const pendingMigrations = await AppDataSource.showMigrations();
        if (pendingMigrations) {
          console.log("Running pending migrations...");
          const executedMigrations = await AppDataSource.runMigrations();
          if (executedMigrations.length > 0) {
            console.log(`Executed ${executedMigrations.length} migrations:`);
            executedMigrations.forEach(migration => {
              console.log(`- ${migration.name}`);
            });
          } else {
            console.log("No pending migrations to run");
          }
        }
      }
    }
  } catch (error) {
    console.error("Error during database initialization:", error);
    throw error;
  }
};