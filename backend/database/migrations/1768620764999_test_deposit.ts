import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    await this.db.rawQuery("UPDATE contas_bancarias SET balance = 5000.00 WHERE id = 1")
  }

  async down() {
    await this.db.rawQuery("UPDATE contas_bancarias SET balance = 0 WHERE id = 1")
  }
}
