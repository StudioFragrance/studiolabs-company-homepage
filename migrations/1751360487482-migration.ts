import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751360487482 implements MigrationInterface {
    name = 'Migration1751360487482'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "site_content" ("id" SERIAL NOT NULL, "key" text NOT NULL, "data" jsonb NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_22c94a453d6f09969b9b99ee6b6" UNIQUE ("key"), CONSTRAINT "PK_a1362a1a095ab41c4347aea2c2d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" text NOT NULL, "password" text NOT NULL, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin_users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "name" character varying, "note" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_dcd0c8a4b10af9c986e510b9ecc" UNIQUE ("email"), CONSTRAINT "PK_06744d221bb6145dc61e5dc441d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "admin_users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "site_content"`);
    }

}
