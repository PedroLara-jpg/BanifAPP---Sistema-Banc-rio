import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contas_bancarias'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('usuario_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('usuarios')
        .onDelete('CASCADE')
      table.string('numero_conta', 20).notNullable().unique()
      table.string('numero_agencia', 10).notNullable()
      table.decimal('balance', 15, 2).notNullable().defaultTo(0)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
