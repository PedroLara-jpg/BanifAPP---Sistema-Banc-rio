import { EnderecoSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Address extends EnderecoSchema {
  static table = 'enderecos'

  @belongsTo(() => User, { foreignKey: 'usuarioId' })
  declare user: BelongsTo<typeof User>
}
