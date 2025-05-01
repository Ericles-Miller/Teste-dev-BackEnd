import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableUser1732889293308 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'gender',
            type: 'varchar',
          },
          {
            name: 'nameSet',
            type: 'varchar',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'givName',
            type: 'varchar',
          },
          {
            name: 'surName',
            type: 'varchar',
          },
          {
            name: 'streetAddress',
            type: 'varchar',
          },
          {
            name: 'city',
            type: 'varchar',
          },
          {
            name: 'emailAddress',
            type: 'varchar',
          },
          {
            name: 'tropicalZodiac',
            type: 'varchar',
          },
          {
            name: 'occupation',
            type: 'varchar',
          },
          {
            name: 'vehicle',
            type: 'varchar',
          },
          {
            name: 'countryFull',
            type: 'varchar',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
