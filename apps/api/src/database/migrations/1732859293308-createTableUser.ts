import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableUser1732859293308 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'Id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'Gender',
            type: 'varchar',
          },
          {
            name: 'NameSet',
            type: 'varchar',
          },
          {
            name: 'Title',
            type: 'varchar',
          },
          {
            name: 'GivName',
            type: 'varchar',
          },
          {
            name: 'SurName',
            type: 'varchar',
          },
          {
            name: 'StreetAddress',
            type: 'varchar',
          },
          {
            name: 'City',
            type: 'varchar',
          },
          {
            name: 'EmailAddress',
            type: 'varchar',
          },
          {
            name: 'TropicalZodiac',
            type: 'varchar',
          },
          {
            name: 'Occupation',
            type: 'varchar',
          },
          {
            name: 'Vehicle',
            type: 'varchar',
          },
          {
            name: 'CountryFull',
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
