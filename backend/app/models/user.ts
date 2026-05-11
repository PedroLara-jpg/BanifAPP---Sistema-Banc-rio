import { UsuarioSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Address from '#models/address'
import BankAccount from '#models/bank_account'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'senha',
})

export default class User extends compose(UsuarioSchema, AuthFinder) {
  static table = 'usuarios'

  static accessTokens = DbAccessTokensProvider.forModel(User)

  declare currentAccessToken?: AccessToken

  @hasOne(() => Address, { foreignKey: 'usuarioId' })
  declare address: HasOne<typeof Address>

  @hasOne(() => BankAccount, { foreignKey: 'usuarioId' })
  declare bankAccount: HasOne<typeof BankAccount>
}
