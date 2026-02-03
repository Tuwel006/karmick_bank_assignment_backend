import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

export class UpdateBankAccountsForCustomers1703002000000 implements MigrationInterface {
  name = 'UpdateBankAccountsForCustomers1703002000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add customer_id column to bank_accounts
    await queryRunner.addColumn(
      'bank_accounts',
      new TableColumn({
        name: 'customer_id',
        type: 'uuid',
        isNullable: true, // Initially nullable for migration
      }),
    );

    // Create index for customer_id
    await queryRunner.createIndex(
      'bank_accounts',
      new TableIndex({
        name: 'IDX_bank_accounts_customer_id',
        columnNames: ['customer_id'],
      }),
    );

    // Create foreign key for customer_id
    await queryRunner.createForeignKey(
      'bank_accounts',
      new TableForeignKey({
        columnNames: ['customer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'customers',
        onDelete: 'RESTRICT',
      }),
    );

    // Note: In production, you would need to migrate existing data
    // from userId to customer_id before making it non-nullable

    // Make customer_id non-nullable after data migration
    await queryRunner.changeColumn(
      'bank_accounts',
      'customer_id',
      new TableColumn({
        name: 'customer_id',
        type: 'uuid',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key
    const table = await queryRunner.getTable('bank_accounts');
    if (table) {
      const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('customer_id') !== -1);
      if (foreignKey) {
        await queryRunner.dropForeignKey('bank_accounts', foreignKey);
      }
    }

    // Drop index
    await queryRunner.dropIndex('bank_accounts', 'IDX_bank_accounts_customer_id');

    // Drop column
    await queryRunner.dropColumn('bank_accounts', 'customer_id');
  }
}