import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class MarketingEmailSent1719656976651 implements MigrationInterface {
    name = 'EmailSent1719656976651';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'marketing_email_sent',
              columns: [
                { name: 'id', type: 'character varying', isPrimary: true },
                { name: 'receiver_email', type: 'character varying'},
                { name: 'status', type: 'character varying'},
                { name: 'type', type: 'character varying'},
                { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()'},
                { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()'},
                { name: 'deleted_at', type: 'TIMESTAMP WITH TIME ZONE', isNullable: true}
              ],
            }),
            true
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('marketing_email_sent', true);
    }

}
