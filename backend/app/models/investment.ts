import { InvestimentoSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import BankAccount from '#models/bank_account'
import InvestmentType from '#models/investment_type'

export type InvestmentStatus = 'ACTIVE' | 'RESCUED'

export default class Investment extends InvestimentoSchema {
  static table = 'investimentos'

  @belongsTo(() => BankAccount, { foreignKey: 'contaId' })
  declare bankAccount: BelongsTo<typeof BankAccount>

  @belongsTo(() => InvestmentType, { foreignKey: 'tipoInvestimentoId' })
  declare investmentType: BelongsTo<typeof InvestmentType>
}
