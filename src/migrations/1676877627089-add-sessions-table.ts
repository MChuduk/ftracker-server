import { MigrationInterface, QueryRunner } from "typeorm";

export class addSessionsTable1676877627089 implements MigrationInterface {
    name = 'addSessionsTable1676877627089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "refreshToken" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "refreshToken" SET NOT NULL`);
    }

}
