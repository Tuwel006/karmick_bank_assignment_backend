import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1769762415460 implements MigrationInterface {
    name = 'InitialSchema1769762415460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "branches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "ifsc" character varying(11) NOT NULL, "address" character varying, "city" character varying, "state" character varying, "pincode" character varying, "phoneNumber" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8387ed27b3d4ca53ec3fc7b029c" UNIQUE ("name"), CONSTRAINT "UQ_1df99f6922bcdfd6acc97a53c5c" UNIQUE ("ifsc"), CONSTRAINT "PK_7f37d3b42defea97f1df0d19535" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "system_modules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7efe9f0198a23342871af637de1" UNIQUE ("name"), CONSTRAINT "PK_03181cfef75a5c51913b27419d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleId" character varying NOT NULL, "moduleId" character varying NOT NULL, "canGet" boolean NOT NULL DEFAULT false, "canCreate" boolean NOT NULL DEFAULT false, "canUpdate" boolean NOT NULL DEFAULT false, "canDelete" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "role_id" uuid, "module_id" uuid, CONSTRAINT "UQ_a51dd50d9b1a4f7db6c1c52bed3" UNIQUE ("role_id", "module_id"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "branchId" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "roleId" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "branch_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role_id" uuid`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD "branchId" uuid`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD "branch_id" uuid`);
        await queryRunner.query(`CREATE INDEX "IDX_80423474f2f93d3cc877a32bf7" ON "bank_accounts" ("branchId") `);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_f10931e7bb05a3b434642ed2797" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_738f46bb9ac6ea356f1915835d0" FOREIGN KEY ("module_id") REFERENCES "system_modules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_5a58f726a41264c8b3e86d4a1de" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD CONSTRAINT "FK_857203fb13222066f317ec93fa8" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP CONSTRAINT "FK_857203fb13222066f317ec93fa8"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_5a58f726a41264c8b3e86d4a1de"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_738f46bb9ac6ea356f1915835d0"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_f10931e7bb05a3b434642ed2797"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_80423474f2f93d3cc877a32bf7"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP COLUMN "branch_id"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP COLUMN "branchId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "branch_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roleId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "branchId"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TABLE "system_modules"`);
        await queryRunner.query(`DROP TABLE "branches"`);
    }

}
