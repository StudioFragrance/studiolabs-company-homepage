import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminUserTable1751260113000 implements MigrationInterface {
    name = 'AddAdminUserTable1751260113000'

    public async up(queryRunner: QueryRunner): Promise<void> {
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

        // 기본 관리자 사용자 추가
        await queryRunner.query(`
            INSERT INTO "admin_users" ("email", "name", "note") 
            VALUES ('partis98@studiolabs.co.kr', '배성준', '시스템 기본 관리자')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "admin_users"`);
    }
}