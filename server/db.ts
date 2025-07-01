import 'dotenv/config';       // 👈 이 줄을 가장 위에 추가하세요!
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
  migrations: ["migrations/*.ts"],
  migrationsTableName: "migrations",
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

      // 마이그레이션 실행
      const pendingMigrations = await AppDataSource.showMigrations();
      if (pendingMigrations) {
        console.log("Running pending migrations...");
        const executedMigrations = await AppDataSource.runMigrations();
        if (executedMigrations.length > 0) {
          console.log(`Executed ${executedMigrations.length} migrations:`);
          executedMigrations.forEach(migration => {
            console.log(`- ${migration.name}`);
          });

          // 마이그레이션 실행 후에만 시드 데이터 생성
          console.log("Running initial data seeding after migrations...");
          await seedInitialData();
        } else {
          console.log("No pending migrations to run");
          // 마이그레이션이 없어도 시드 데이터는 확인
          await seedInitialData();
        }
      } else {
        // 마이그레이션 테이블 자체가 없으면 시드 데이터도 실행
        await seedInitialData();
      }
    }
  } catch (error) {
    console.error("Error during database initialization:", error);
    throw error;
  }
};

// 초기 데이터 시딩 함수
async function seedInitialData() {
  try {
    console.log("Checking for initial data...");

    // 사이트 콘텐츠 확인 및 생성
    const siteContentRepo = AppDataSource.getRepository(SiteContent);
    const existingContent = await siteContentRepo.count();

    if (existingContent === 0) {
      console.log("Creating initial site content...");

      // 기본 사이트 콘텐츠 생성
      const defaultContent = [
        {
          key: 'hero',
          data: {
            subtitle: "AI 기술로 완성하는",
            mainTitle: "당신만의 특별한 향기",
            description: "첨단 AI 기술과 전문 조향사의 노하우가 만나 당신의 취향과 개성에 완벽하게 맞는 향수를 추천합니다.",
            ctaButton: {
              text: "향수 추천 받기",
              url: "/recommendation"
            },
            backgroundImage: "/hero-bg.jpg"
          }
        },
        {
          key: 'brandStory',
          data: {
            title: "Technology meets Artistry",
            quote: "AI가 만들어내는 새로운 향기의 경험",
            content: [
              "스튜디오프래그런스는 전통적인 조향 기법과 최신 AI 기술을 결합하여 개인 맞춤형 향수 추천 서비스를 제공합니다.",
              "우리의 독자적인 알고리즘은 개인의 취향, 라이프스타일, 그리고 감정까지 분석하여 가장 적합한 향수를 찾아드립니다.",
              "각각의 향수는 단순한 제품이 아닌, 당신만의 이야기를 담은 특별한 향기입니다."
            ],
            ctaButton: {
              text: "브랜드 스토리 더보기",
              url: "/about"
            },
            statistics: [
              {
                icon: "🤖",
                title: "AI 알고리즘",
                description: "10,000+ 향수 데이터 분석"
              },
              {
                icon: "👥",
                title: "만족도",
                description: "98% 고객 만족도 달성"
              },
              {
                icon: "🎯",
                title: "정확도",
                description: "95% 추천 정확도"
              }
            ]
          }
        }
      ];

      for (const content of defaultContent) {
        await siteContentRepo.save(content);
      }

      console.log("Initial site content created successfully");
    }

    // 관리자 사용자 확인 및 생성
    const adminUserRepo = AppDataSource.getRepository(AdminUser);
    const existingAdmin = await adminUserRepo.findOne({
      where: { email: 'partis98@studiolabs.co.kr' }
    });

    if (!existingAdmin) {
      console.log("Creating default admin user...");
      await adminUserRepo.save({
        email: 'partis98@studiolabs.co.kr',
        name: '배성준',
        note: '대표자',
        isActive: true
      });
      console.log("Default admin user created successfully");
    }

    console.log("Initial data seeding completed");
  } catch (error) {
    console.error("Error during initial data seeding:", error);
    // 시드 데이터 생성 실패해도 서버는 계속 실행
  }
}