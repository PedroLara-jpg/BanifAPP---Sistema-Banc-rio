import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'enderecos'

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
      table.string('cidade', 100).notNullable()
      table.string('estado', 2).notNullable()
      table.string('rua', 255).notNullable()
      table.string('numero', 20).notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
