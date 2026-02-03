import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserFields1769956833610 implements MigrationInterface {
    name = 'AddUserFields1769956833610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "firstName" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastName" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "address_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_1b05689f6b6456680d538c3d2ea" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_1b05689f6b6456680d538c3d2ea"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "address_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);
    }

}
