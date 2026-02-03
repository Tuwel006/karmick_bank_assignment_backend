import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAddressRelations1769956714398 implements MigrationInterface {
    name = 'AddAddressRelations1769956714398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."addresses_type_enum" AS ENUM('permanent', 'temporary', 'office')`);
        await queryRunner.query(`CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "address_line_1" character varying NOT NULL, "address_line_2" character varying, "landmark" character varying, "city" character varying NOT NULL, "state" character varying NOT NULL, "pincode" character varying NOT NULL, "country" character varying NOT NULL, "type" "public"."addresses_type_enum" NOT NULL DEFAULT 'permanent', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "branches" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "branches" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "branches" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "branches" DROP COLUMN "pincode"`);
        await queryRunner.query(`ALTER TABLE "branches" ADD "address_id" uuid`);
        await queryRunner.query(`ALTER TABLE "branches" ADD CONSTRAINT "FK_c03aef26af49e109f784a101ecd" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branches" DROP CONSTRAINT "FK_c03aef26af49e109f784a101ecd"`);
        await queryRunner.query(`ALTER TABLE "branches" DROP COLUMN "address_id"`);
        await queryRunner.query(`ALTER TABLE "branches" ADD "pincode" character varying`);
        await queryRunner.query(`ALTER TABLE "branches" ADD "state" character varying`);
        await queryRunner.query(`ALTER TABLE "branches" ADD "city" character varying`);
        await queryRunner.query(`ALTER TABLE "branches" ADD "address" character varying`);
        await queryRunner.query(`DROP TABLE "addresses"`);
        await queryRunner.query(`DROP TYPE "public"."addresses_type_enum"`);
    }

}
