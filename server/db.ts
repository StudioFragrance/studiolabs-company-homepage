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
        },
        {
          key: 'companyHistory',
          data: {
            title: "Our Journey",
            subtitle: "향기로 써내려가는 혁신의 역사",
            timeline: [
              {
                date: "2021.03",
                year: 2021,
                month: 3,
                icon: "🚀",
                title: "스튜디오프래그런스 창립",
                description: "AI 기반 향수 추천 서비스 개발 시작",
                isFuture: false
              },
              {
                date: "2021.09",
                year: 2021,
                month: 9,
                icon: "🧪",
                title: "첫 번째 AI 알고리즘 완성",
                description: "개인 맞춤형 향수 추천 엔진 1.0 출시",
                isFuture: false
              },
              {
                date: "2022.06",
                year: 2022,
                month: 6,
                icon: "🏆",
                title: "베타 서비스 론칭",
                description: "1,000명의 베타 사용자와 함께 서비스 검증",
                isFuture: false
              },
              {
                date: "2023.01",
                year: 2023,
                month: 1,
                icon: "🌟",
                title: "정식 서비스 오픈",
                description: "AI 향수 추천 플랫폼 공식 출시",
                isFuture: false
              },
              {
                date: "2024.Q2",
                year: 2024,
                month: 6,
                icon: "🔮",
                title: "글로벌 확장 예정",
                description: "아시아 시장 진출 및 다국어 서비스 계획",
                isFuture: true
              }
            ]
          }
        },
        {
          key: 'mvc',
          data: {
            title: "Philosophy",
            mission: {
              title: "Mission",
              description: "AI 기술을 통해 모든 사람이 자신만의 완벽한 향기를 찾을 수 있도록 돕는다",
              icon: "🎯"
            },
            vision: {
              title: "Vision",
              description: "향수 추천의 새로운 패러다임을 제시하여 글로벌 향수 시장을 혁신한다",
              icon: "🔭"
            },
            coreValues: {
              title: "Core Values",
              description: "개인화, 혁신, 품질을 통해 고객에게 최고의 향기 경험을 제공한다",
              icon: "💎"
            }
          }
        },
        {
          key: 'contact',
          data: {
            title: "Contact Us",
            email: "hello@studiofragrance.com",
            businessInquiry: {
              title: "비즈니스 문의",
              description: "협업 및 입점 제안을 위한 비즈니스 문의",
              buttonText: "비즈니스 문의하기",
              icon: "💼"
            },
            recruitment: {
              title: "채용 문의",
              description: "함께 성장할 인재를 찾고 있습니다",
              buttonText: "채용 정보 보기",
              icon: "👥",
              isActive: true,
              inactiveMessage: "현재 채용이 진행되지 않고 있습니다"
            },
            teamImage: "/team-image.jpg"
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