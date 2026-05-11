import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transacoes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('conta_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('contas_bancarias')
        .onDelete('CASCADE')
      table
        .enum('tipo', ['DEPOSIT', 'WITHDRAW', 'PIX_SENT', 'PIX_RECEIVED', 'INVESTMENT', 'INVESTMENT_RESCUE'])
        .notNullable()
      table.decimal('valor', 15, 2).notNullable()
      table.string('descricao', 500).nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
