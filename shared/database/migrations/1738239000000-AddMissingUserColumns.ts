import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingUserColumns1738239000000 implements MigrationInterface {
    name = 'AddMissingUserColumns1738239000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if columns exist before adding them
        const branchIdExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'users' 
            AND column_name = 'branch_id'
        `);

        const roleIdExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'users' 
            AND column_name = 'role_id'
        `);

        if (branchIdExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "users" ADD "branch_id" uuid`);
            console.log('✅ Added branch_id column to users table');
        } else {
            console.log('ℹ️  branch_id column already exists');
        }

        if (roleIdExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "users" ADD "role_id" uuid`);
            console.log('✅ Added role_id column to users table');
        } else {
            console.log('ℹ️  role_id column already exists');
        }

        // Add foreign key constraints if columns were added
        if (branchIdExists.length === 0) {
            await queryRunner.query(`
                ALTER TABLE "users" 
                ADD CONSTRAINT "FK_5a58f726a41264c8b3e86d4a1de" 
                FOREIGN KEY ("branch_id") 
                REFERENCES "branches"("id") 
                ON DELETE NO ACTION 
                ON UPDATE NO ACTION
            `);
        }

        if (roleIdExists.length === 0) {
            await queryRunner.query(`
                ALTER TABLE "users" 
                ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" 
                FOREIGN KEY ("role_id") 
                REFERENCES "roles"("id") 
                ON DELETE NO ACTION 
                ON UPDATE NO ACTION
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "FK_5a58f726a41264c8b3e86d4a1de"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "role_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "branch_id"`);
    }
}
