import { ContasBancariaSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Transaction from '#models/transaction'
import Investment from '#models/investment'

export default class BankAccount extends ContasBancariaSchema {
  static table = 'contas_bancarias'

  @belongsTo(() => User, { foreignKey: 'usuarioId' })
  declare user: BelongsTo<typeof User>

  @hasMany(() => Transaction, { foreignKey: 'contaId' })
  declare transactions: HasMany<typeof Transaction>

  @hasMany(() => Investment, { foreignKey: 'contaId' })
  declare investments: HasMany<typeof Investment>
}
