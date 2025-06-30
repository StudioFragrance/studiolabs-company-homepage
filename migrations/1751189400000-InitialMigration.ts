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

        // 참고: 초기 데이터는 scripts/seed-data.ts에서 관리됩니다
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "site_content"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}