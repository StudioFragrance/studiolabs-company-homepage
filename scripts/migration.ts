#!/usr/bin/env tsx
import "reflect-metadata";
import { AppDataSource } from "../server/db";
import { exit } from "process";
import { execSync } from "child_process";

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
                const migrationName = process.argv[3];
                if (!migrationName) {
                    console.error("❌ 마이그레이션 파일 이름을 입력해주세요.");
                    console.log("\n  예시: npx tsx scripts/migration.ts generate CreateUsersTable\n");
                    process.exit(1);
                }

                console.log(`... '${migrationName}' 마이그레이션 생성 중 ...`);

                try {
                    // TypeORM CLI의 migration:generate 명령어를 실행합니다.
                    const command = `npx tsx ./node_modules/typeorm/cli.js migration:generate -d server/db.ts migrations/${migrationName}`;
                    execSync(command, { stdio: "inherit", env: { ...process.env } });
                    console.log(`✅ 마이그레이션 파일이 성공적으로 생성되었습니다.`);
                } catch (error) {
                    // execSync는 실패 시 에러를 던지므로, 여기서 잡아줍니다.
                    console.error("\n🚨 마이그레이션 생성에 실패했습니다.");
                }
                break; // 👈 여기까지 교체

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