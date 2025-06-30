#!/usr/bin/env tsx
import { AppDataSource } from "../server/db";
import { exit } from "process";

async function createBaseline() {
    try {
        await AppDataSource.initialize();
        console.log("데이터베이스 연결 성공");

        // 기존 테이블들이 있는지 확인
        const userTableExists = await AppDataSource.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            );
        `);

        const siteContentTableExists = await AppDataSource.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'site_content'
            );
        `);

        if (userTableExists[0].exists && siteContentTableExists[0].exists) {
            console.log("기존 테이블들이 감지되었습니다. 베이스라인 마이그레이션을 생성합니다...");
            
            // 초기 마이그레이션을 실행된 것으로 표시 (실제 테이블 생성은 건너뛰고 기록만)
            await AppDataSource.query(`
                INSERT INTO migrations (timestamp, name) 
                VALUES (1751189400000, 'InitialMigration1751189400000')
            `);
            
            console.log("베이스라인 마이그레이션이 생성되었습니다.");
            console.log("이제 ./migrate.sh run 명령으로 새로운 마이그레이션을 실행할 수 있습니다.");
        } else {
            console.log("기존 테이블이 없습니다. 일반 마이그레이션을 실행하세요:");
            console.log("./migrate.sh run");
        }

        await AppDataSource.destroy();
        exit(0);
    } catch (error) {
        console.error("베이스라인 생성 중 오류 발생:", error);
        await AppDataSource.destroy();
        exit(1);
    }
}

createBaseline();