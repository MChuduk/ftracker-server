import { MigrationInterface, QueryRunner } from "typeorm";

export class addCurrencyEntity1679423824897 implements MigrationInterface {
    name = 'addCurrencyEntity1679423824897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."currency_type_enum" AS ENUM('BYN', 'USD', 'EUR')`);
        await queryRunner.query(`CREATE TABLE "currency" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."currency_type_enum" NOT NULL DEFAULT 'BYN', "BYN" integer NOT NULL, "USD" integer NOT NULL, "EUR" integer NOT NULL, CONSTRAINT "UQ_177e37176317b2cff94b542d9ce" UNIQUE ("type"), CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "currency"`);
        await queryRunner.query(`DROP TYPE "public"."currency_type_enum"`);
    }

}
