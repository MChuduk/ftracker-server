import { MigrationInterface, QueryRunner } from "typeorm";

export class addCurrencyEntity1679600344582 implements MigrationInterface {
    name = 'addCurrencyEntity1679600344582'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "currency" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."currency_type_enum" NOT NULL, "name" character varying NOT NULL, "color" character varying NOT NULL, "rate" numeric NOT NULL, CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "currency"`);
    }

}
