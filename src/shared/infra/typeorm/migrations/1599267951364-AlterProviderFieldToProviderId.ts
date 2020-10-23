import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from 'typeorm';

export default class AlterProviderFieldToProviderId1599267951364
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // deletar coluna provider
        await queryRunner.dropColumn('appointments', 'provider');

        // adicionar coluna provider_id
        await queryRunner.addColumn(
            'appointments',
            new TableColumn({
                name: 'provider_id',
                type: 'uuid',
                isNullable: true,
            }),
        );

        // adicionar uma foreign key ligando o provider (user) ao agendamento
        await queryRunner.createForeignKey(
            'appointments',
            new TableForeignKey({
                // Identificacao da FK, para quando precisar deletar
                name: 'AppointmentProvider',
                columnNames: ['provider_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                // RESTRICT, SET NULL ou CASCADE
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // reverso do metodo up
        await queryRunner.dropForeignKey('appointments', 'AppointmentProvider');

        await queryRunner.dropColumn('appointments', 'provider_id');

        await queryRunner.addColumn(
            'appointments',
            new TableColumn({
                name: 'provider',
                type: 'varchar',
            }),
        );
    }
}
