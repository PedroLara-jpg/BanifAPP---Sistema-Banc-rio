import { TiposInvestimentoSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Investment from '#models/investment'

export default class InvestmentType extends TiposInvestimentoSchema {
  static table = 'tipos_investimentos'

  @hasMany(() => Investment, { foreignKey: 'tipoInvestimentoId' })
  declare investments: HasMany<typeof Investment>
}
