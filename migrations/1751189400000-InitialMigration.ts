import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1751189400000 implements MigrationInterface {
    name = 'InitialMigration1751189400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Users 테이블 생성
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL, 
                "username" character varying NOT NULL, 
                "password" character varying NOT NULL, 
                CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), 
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);

        // Site Content 테이블 생성
        await queryRunner.query(`
            CREATE TABLE "site_content" (
                "id" SERIAL NOT NULL, 
                "key" character varying NOT NULL, 
                "data" jsonb NOT NULL, 
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
                CONSTRAINT "UQ_site_content_key" UNIQUE ("key"), 
                CONSTRAINT "PK_site_content_id" PRIMARY KEY ("id")
            )
        `);

        // 초기 사이트 콘텐츠 데이터 삽입
        await queryRunner.query(`
            INSERT INTO "site_content" ("key", "data") VALUES 
            ('hero', '{
                "subtitle": "AI 기반 개인 맞춤형 향수 추천",
                "title": "당신만의 완벽한 향기를 찾아드립니다",
                "description": "최첨단 AI 기술과 향수 전문가의 노하우를 결합하여, 당신의 개성과 취향에 완벽하게 맞는 향수를 추천해드립니다."
            }'),
            ('brandStory', '{
                "title": "AI 기술로 만나는 향수의 새로운 경험",
                "description": "Studio fragrance는 인공지능 기술과 향수 전문 지식을 결합하여 개인 맞춤형 향수 추천 서비스를 제공합니다.",
                "features": [
                    {
                        "title": "AI 맞춤 추천",
                        "description": "당신의 취향을 분석하여 완벽한 향수를 찾아드립니다"
                    },
                    {
                        "title": "전문가 큐레이션",
                        "description": "향수 전문가들이 엄선한 프리미엄 브랜드들"
                    },
                    {
                        "title": "개인화 서비스",
                        "description": "개인의 라이프스타일에 맞춘 향수 추천"
                    }
                ],
                "statistics": [
                    {
                        "number": "10,000+",
                        "label": "만족한 고객"
                    },
                    {
                        "number": "500+",
                        "label": "향수 데이터베이스"
                    },
                    {
                        "number": "95%",
                        "label": "추천 만족도"
                    }
                ]
            }'),
            ('companyHistory', '{
                "title": "Studio fragrance의 여정",
                "description": "향수와 기술의 만남으로 시작된 우리의 이야기를 소개합니다.",
                "timeline": [
                    {
                        "year": "2024",
                        "title": "서비스 론칭",
                        "description": "AI 기반 향수 추천 플랫폼 정식 출시"
                    },
                    {
                        "year": "2023",
                        "title": "기술 개발",
                        "description": "향수 추천 AI 알고리즘 개발 및 특허 출원"
                    },
                    {
                        "year": "2022",
                        "title": "회사 설립",
                        "description": "Studio fragrance 법인 설립 및 초기 팀 구성"
                    }
                ]
            }'),
            ('mvc', '{
                "mission": {
                    "title": "Mission",
                    "description": "AI 기술을 통해 모든 사람이 자신만의 완벽한 향기를 찾을 수 있도록 돕습니다."
                },
                "vision": {
                    "title": "Vision",
                    "description": "향수 선택의 새로운 기준을 제시하고, 개인 맞춤형 뷰티 산업을 선도합니다."
                },
                "coreValues": [
                    {
                        "title": "혁신",
                        "description": "최신 AI 기술로 향수 산업에 혁신을 가져옵니다"
                    },
                    {
                        "title": "개인화",
                        "description": "각 개인의 고유한 취향과 개성을 존중합니다"
                    },
                    {
                        "title": "품질",
                        "description": "엄선된 프리미엄 향수만을 추천합니다"
                    }
                ]
            }'),
            ('contact', '{
                "title": "문의하기",
                "description": "Studio fragrance에 대해 궁금한 점이 있으시면 언제든 연락해주세요.",
                "email": "contact@studiofragrance.com",
                "phone": "02-1234-5678",
                "address": "서울특별시 강남구 테헤란로 123",
                "businessHours": "평일 09:00 - 18:00"
            }')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "site_content"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}