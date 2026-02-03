import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateCustomersTable1703001000000 implements MigrationInterface {
  name = 'CreateCustomersTable1703001000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create customers table
    await queryRunner.createTable(
      new Table({
        name: 'customers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'customer_number',
            type: 'varchar',
            length: '20',
            isUnique: true,
          },
          {
            name: 'first_name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'middle_name',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'date_of_birth',
            type: 'date',
          },
          {
            name: 'gender',
            type: 'enum',
            enum: ['MALE', 'FEMALE', 'OTHER'],
          },
          {
            name: 'marital_status',
            type: 'enum',
            enum: ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'],
            default: "'SINGLE'",
          },
          {
            name: 'nationality',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'occupation',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'annual_income',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '150',
            isUnique: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '15',
            isUnique: true,
          },
          {
            name: 'alternate_phone',
            type: 'varchar',
            length: '15',
            isNullable: true,
          },
          {
            name: 'aadhar_number',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'pan_number',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          {
            name: 'passport_number',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'driving_license_number',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'BLOCKED'],
            default: "'ACTIVE'",
          },
          {
            name: 'kyc_status',
            type: 'enum',
            enum: ['NOT_STARTED', 'PENDING', 'VERIFIED', 'REJECTED'],
            default: "'NOT_STARTED'",
          },
          {
            name: 'kyc_verified_at',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'kyc_remarks',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'emergency_contact_name',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'emergency_contact_phone',
            type: 'varchar',
            length: '15',
            isNullable: true,
          },
          {
            name: 'emergency_contact_relation',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'documents',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'branch_id',
            type: 'uuid',
          },
          {
            name: 'permanent_address_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'current_address_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.createIndex(
      'customers',
      new TableIndex({
        name: 'IDX_customers_customer_number',
        columnNames: ['customer_number'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'customers',
      new TableIndex({
        name: 'IDX_customers_email',
        columnNames: ['email'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'customers',
      new TableIndex({
        name: 'IDX_customers_phone',
        columnNames: ['phone'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'customers',
      new TableIndex({
        name: 'IDX_customers_branch_id',
        columnNames: ['branch_id'],
      }),
    );

    // Create foreign keys
    await queryRunner.createForeignKey(
      'customers',
      new TableForeignKey({
        columnNames: ['branch_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'branches',
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'customers',
      new TableForeignKey({
        columnNames: ['permanent_address_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'addresses',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'customers',
      new TableForeignKey({
        columnNames: ['current_address_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'addresses',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('customers');
  }
}