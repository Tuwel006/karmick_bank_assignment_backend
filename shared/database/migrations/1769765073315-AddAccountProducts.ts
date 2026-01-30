import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAccountProducts1769765073315 implements MigrationInterface {
    name = 'AddAccountProducts1769765073315'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP CONSTRAINT "FK_857203fb13222066f317ec93fa8"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" RENAME COLUMN "branch_id" TO "productId"`);
        await queryRunner.query(`CREATE TYPE "public"."account_products_producttype_enum" AS ENUM('SAVINGS', 'CURRENT', 'CHILDS_SAVINGS', 'BUSINESS_STARTUP')`);
        await queryRunner.query(`CREATE TABLE "account_products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "code" character varying(20) NOT NULL, "description" text, "productType" "public"."account_products_producttype_enum" NOT NULL DEFAULT 'SAVINGS', "minDailyBalance" numeric(18,2) NOT NULL DEFAULT '0', "minMonthlyAverageBalance" numeric(18,2) NOT NULL DEFAULT '0', "dailyTransactionLimit" numeric(18,2), "monthlyTransactionLimit" numeric(18,2), "minTransactionAmount" numeric(18,2), "maxTransactionAmount" numeric(18,2), "interestRate" numeric(5,2) NOT NULL DEFAULT '0', "allowsOverdraft" boolean NOT NULL DEFAULT false, "overdraftLimit" numeric(18,2) NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e5fc336ea6db7d652327e98a826" UNIQUE ("name"), CONSTRAINT "UQ_52033fba3408fbef12c46933d70" UNIQUE ("code"), CONSTRAINT "PK_e35c444147b608f74b553d1e8f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_44da1ee78c99ed158d15358284" ON "bank_accounts" ("productId") `);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD CONSTRAINT "FK_80423474f2f93d3cc877a32bf78" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD CONSTRAINT "FK_44da1ee78c99ed158d153582843" FOREIGN KEY ("productId") REFERENCES "account_products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP CONSTRAINT "FK_44da1ee78c99ed158d153582843"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP CONSTRAINT "FK_80423474f2f93d3cc877a32bf78"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_44da1ee78c99ed158d15358284"`);
        await queryRunner.query(`DROP TABLE "account_products"`);
        await queryRunner.query(`DROP TYPE "public"."account_products_producttype_enum"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" RENAME COLUMN "productId" TO "branch_id"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD CONSTRAINT "FK_857203fb13222066f317ec93fa8" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
