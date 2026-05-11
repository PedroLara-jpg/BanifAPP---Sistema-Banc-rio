import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'investimentos'

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
        .integer('tipo_investimento_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('tipos_investimentos')
        .onDelete('RESTRICT')
      table.decimal('valor', 15, 2).notNullable()
      table.enum('status', ['ACTIVE', 'RESCUED']).notNullable().defaultTo('ACTIVE')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
