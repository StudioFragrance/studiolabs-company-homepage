#!/usr/bin/env tsx
import { AppDataSource } from "../ormconfig";
import { SiteContent } from "../server/entities/SiteContent";
import { exit } from "process";

async function seedData() {
    try {
        await AppDataSource.initialize();
        console.log("데이터베이스 연결 성공");

        const siteContentRepository = AppDataSource.getRepository(SiteContent);

        // 기존 데이터가 있는지 확인
        const existingContent = await siteContentRepository.count();
        
        if (existingContent > 0) {
            console.log("기존 사이트 콘텐츠가 있습니다. 시딩을 건너뜁니다.");
            await AppDataSource.destroy();
            exit(0);
        }

        console.log("초기 사이트 콘텐츠를 생성합니다...");

        // 기본 사이트 콘텐츠 데이터
        const contentData = [
            {
                key: 'hero',
                data: {
                    subtitle: "손쉽게 찾는 나를 위한 향",
                    mainTitle: {
                        line1: "당신의 취향을 읽다,",
                        line2: "완벽한 향을 건네다"
                    },
                    ctaButton: {
                        text: "향수 추천 받기",
                        url: "https://www.studiofragrance.co.kr"
                    },
                    backgroundImage: "https://images.unsplash.com/photo-1615611563049-e9c2d5c19bd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
                }
            },
            {
                key: 'brandStory',
                data: {
                    title: "AI가 골라주는 딱 맞는 향",
                    quote: "이게 나에게 맞는 향기일까?",
                    content: [
                        "수많은 기대와 망설임 속에서 나에게 꼭 맞는 향을 찾는 여정은 늘 쉽지 않았습니다.",
                        "어렵게 느껴졌던 향수의 세계, 그 막막함을 저희는 이해합니다.",
                        "Studio fragrance는 당신의 감각과 취향에 귀 기울입니다. 흩어져 있던 향들 속에서 당신만을 위한 향을 찾아, 당신의 손에 건네 드립니다."
                    ],
                    ctaButton: {
                        text: "Studio fragrance 바로가기",
                        url: "https://www.studiofragrance.co.kr"
                    },
                    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
                    statistics: [
                        {
                            icon: "fa-users",
                            title: "7,000명 이상 사람들이",
                            description: "향수를 추천받았어요"
                        },
                        {
                            icon: "fa-home",
                            title: "무료시향으로 집에서도",
                            description: "간편하게 체험"
                        }
                    ]
                }
            }
        ];

        // 데이터 저장
        for (const content of contentData) {
            const siteContent = new SiteContent();
            siteContent.key = content.key;
            siteContent.data = content.data;
            await siteContentRepository.save(siteContent);
            console.log(`- ${content.key} 콘텐츠 생성됨`);
        }

        console.log("초기 사이트 콘텐츠 생성이 완료되었습니다.");

        await AppDataSource.destroy();
        exit(0);
    } catch (error) {
        console.error("데이터 시딩 중 오류 발생:", error);
        await AppDataSource.destroy();
        exit(1);
    }
}

seedData();