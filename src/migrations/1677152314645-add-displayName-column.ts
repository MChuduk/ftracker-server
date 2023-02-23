import { MigrationInterface, QueryRunner } from "typeorm";

export class addDisplayNameColumn1677152314645 implements MigrationInterface {
    name = 'addDisplayNameColumn1677152314645'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "displayName" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "displayName"`);
    }

}
