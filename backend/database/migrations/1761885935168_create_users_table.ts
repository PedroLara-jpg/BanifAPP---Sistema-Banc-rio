import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'usuarios'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('nome_completo', 255).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('senha').notNullable()
      table.string('cpf', 14).notNullable().unique()
      table.enum('role', ['MANAGER', 'CLIENT']).notNullable().defaultTo('CLIENT')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
