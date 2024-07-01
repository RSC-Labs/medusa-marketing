import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class MarketingEmailSettings1719492355639 implements MigrationInterface {
    name = 'MarketingEmailSettings1719492355639';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'marketing_email_settings',
              columns: [
                { name: 'id', type: 'character varying', isPrimary: true },
                { name: 'email_transport', type: 'character varying'},
                { name: 'email_template_type', type: 'character varying'},
                { name: 'email_template_name', type: 'character varying'},
                { name: 'email_type', type: 'character varying'},
                { name: 'email_subject', type: 'character varying'},
                { name: 'enabled', type: 'boolean'},
                { name: 'configuration', type: 'jsonb', isNullable: true},
                { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()'},
                { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()'},
                { name: 'deleted_at', type: 'TIMESTAMP WITH TIME ZONE', isNullable: true}
              ],
            }),
            true
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('marketing_email_settings', true);
    }

}
