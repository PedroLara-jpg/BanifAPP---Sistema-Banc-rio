import { TransacoeSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import BankAccount from '#models/bank_account'

export type TransactionType =
  | 'DEPOSIT'
  | 'WITHDRAW'
  | 'PIX_SENT'
  | 'PIX_RECEIVED'
  | 'INVESTMENT'
  | 'INVESTMENT_RESCUE'

export default class Transaction extends TransacoeSchema {
  static table = 'transacoes'

  @belongsTo(() => BankAccount, { foreignKey: 'contaId' })
  declare bankAccount: BelongsTo<typeof BankAccount>
}
