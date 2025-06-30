#!/usr/bin/env tsx
import "reflect-metadata";
import { AppDataSource } from "../ormconfig";
import { exit } from "process";

const command = process.argv[2];

async function runMigrations() {
    try {
        await AppDataSource.initialize();
        console.log("데이터베이스 연결 성공");

        switch (command) {
            case "run":
                const migrations = await AppDataSource.runMigrations();
                if (migrations.length === 0) {
                    console.log("실행할 마이그레이션이 없습니다.");
                } else {
                    console.log(`${migrations.length}개의 마이그레이션이 실행되었습니다:`);
                    migrations.forEach(migration => {
                        console.log(`- ${migration.name}`);
                    });
                }
                break;

            case "revert":
                await AppDataSource.undoLastMigration();
                console.log("마지막 마이그레이션이 되돌려졌습니다.");
                break;

            case "show":
                const executed = await AppDataSource.query("SELECT * FROM migrations ORDER BY timestamp DESC");
                console.log("실행된 마이그레이션 목록:");
                executed.forEach((migration: any) => {
                    console.log(`- ${migration.name} (${new Date(migration.timestamp).toLocaleString()})`);
                });
                break;

            case "generate":
                console.log("마이그레이션 생성은 수동으로 진행해주세요.");
                console.log("migrations/ 폴더에 새 파일을 생성하고 timestamp를 포함한 이름을 사용하세요.");
                break;

            default:
                console.log("사용법:");
                console.log("tsx scripts/migration.ts run    - 마이그레이션 실행");
                console.log("tsx scripts/migration.ts revert - 마지막 마이그레이션 되돌리기");
                console.log("tsx scripts/migration.ts show   - 실행된 마이그레이션 목록");
                console.log("tsx scripts/migration.ts generate - 새 마이그레이션 생성 안내");
        }

        await AppDataSource.destroy();
        exit(0);
    } catch (error) {
        console.error("마이그레이션 실행 중 오류 발생:", error);
        await AppDataSource.destroy();
        exit(1);
    }
}

runMigrations();