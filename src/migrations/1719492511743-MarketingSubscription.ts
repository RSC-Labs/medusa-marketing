import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class MarketingSubscription1719492511743 implements MigrationInterface {

    name = 'MarketingSubscription1719492511743';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'marketing_subscription',
              columns: [
                { name: 'id', type: 'character varying', isPrimary: true },
                { name: 'customer_id', type: 'character varying' },
                { name: 'email_type', type: 'character varying'},
                { name: 'target_id', type: 'character varying', isNullable: true},
                { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()'},
                { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()'},
                { name: 'deleted_at', type: 'TIMESTAMP WITH TIME ZONE', isNullable: true}
              ],
              foreignKeys: [
                {
                  columnNames: ['customer_id'],
                  referencedColumnNames: ['id'],
                  referencedTableName: 'public.customer',
                },
              ]
            }),
            true
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('marketing_subscription', true);
    }

}
