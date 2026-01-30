import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotificationTable1769762871212 implements MigrationInterface {
    name = 'AddNotificationTable1769762871212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('INFO', 'WARNING', 'ERROR', 'TRANSACTION')`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_status_enum" AS ENUM('UNREAD', 'READ')`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "type" "public"."notifications_type_enum" NOT NULL DEFAULT 'INFO', "title" character varying(255) NOT NULL, "message" text NOT NULL, "status" "public"."notifications_status_enum" NOT NULL DEFAULT 'UNREAD', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_692a909ee0fa9383e7859f9b40" ON "notifications" ("userId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_692a909ee0fa9383e7859f9b40"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
    }

}
