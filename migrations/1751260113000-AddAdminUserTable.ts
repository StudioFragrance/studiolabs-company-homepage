import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminUserTable1751260113000 implements MigrationInterface {
    name = 'AddAdminUserTable1751260113000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 테이블이 이미 존재하는지 확인
        const tableExists = await queryRunner.hasTable("admin_users");
        
        if (!tableExists) {
            await queryRunner.query(`
                CREATE TABLE "admin_users" (
                    "id" SERIAL NOT NULL, 
                    "email" varchar NOT NULL, 
                    "isActive" boolean NOT NULL DEFAULT true, 
                    "name" varchar, 
                    "note" varchar, 
                    "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
                    CONSTRAINT "UQ_admin_users_email" UNIQUE ("email"), 
                    CONSTRAINT "PK_admin_users_id" PRIMARY KEY ("id")
                )
            `);
        }

        // 기본 관리자 사용자가 이미 존재하는지 확인
        const adminExists = await queryRunner.query(`
            SELECT COUNT(*) as count FROM "admin_users" 
            WHERE "email" = 'partis98@studiolabs.co.kr'
        `);
        
        if (parseInt(adminExists[0].count) === 0) {
            await queryRunner.query(`
                INSERT INTO "admin_users" ("email", "name", "note") 
                VALUES ('partis98@studiolabs.co.kr', '배성준', '대표자')
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "admin_users"`);
    }
}