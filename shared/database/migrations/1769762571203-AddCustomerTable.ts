import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCustomerTable1769762571203 implements MigrationInterface {
    name = 'AddCustomerTable1769762571203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."customers_customertype_enum" AS ENUM('INDIVIDUAL', 'BUSINESS')`);
        await queryRunner.query(`CREATE TYPE "public"."customers_kycstatus_enum" AS ENUM('PENDING', 'VERIFIED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "customerType" "public"."customers_customertype_enum" NOT NULL DEFAULT 'INDIVIDUAL', "firstName" character varying(100) NOT NULL, "middleName" character varying(100), "lastName" character varying(100) NOT NULL, "dateOfBirth" date, "gender" character varying(10), "panNumber" character varying(20), "aadharNumber" character varying(20), "kycStatus" "public"."customers_kycstatus_enum" NOT NULL DEFAULT 'PENDING', "address" text, "city" character varying(100), "state" character varying(100), "pincode" character varying(10), "country" character varying(100), "alternatePhone" character varying(15), "alternateEmail" character varying(150), "occupation" character varying(200), "annualIncome" numeric(18,2), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f7e14b68115252ad1553a22b12f" UNIQUE ("panNumber"), CONSTRAINT "UQ_1eba4397cf3113ca47a3b516686" UNIQUE ("aadharNumber"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b8512aa9cef03d90ed5744c94d" ON "customers" ("userId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_b8512aa9cef03d90ed5744c94d"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TYPE "public"."customers_kycstatus_enum"`);
        await queryRunner.query(`DROP TYPE "public"."customers_customertype_enum"`);
    }

}
