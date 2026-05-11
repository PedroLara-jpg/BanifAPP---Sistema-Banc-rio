import BankAccount from '#models/bank_account'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default class AccountRepository {
  async findByUsuarioId(usuarioId: number) {
    return BankAccount.findBy('usuario_id', usuarioId)
  }

  async findByNumeroConta(numeroConta: string) {
    return BankAccount.findBy('numero_conta', numeroConta)
  }

  async findByIdWithRelations(id: number) {
    return BankAccount.query().where('id', id).preload('user').firstOrFail()
  }

  async create(
    data: { usuarioId: number; numeroConta: string; numeroAgencia: string; balance?: number },
    trx?: TransactionClientContract
  ) {
    return BankAccount.create(
      {
        usuarioId: data.usuarioId,
        numeroConta: data.numeroConta,
        numeroAgencia: data.numeroAgencia,
        balance: String(data.balance ?? 0) as any,
      },
      trx ? { client: trx } : undefined
    )
  }

  async updateBalance(account: BankAccount, newBalance: number) {
    account.balance = String(newBalance) as any
    return account.save()
  }

  async findAll() {
    return BankAccount.query().preload('user').orderBy('id', 'desc')
  }
}
