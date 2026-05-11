import Transaction from '#models/transaction'
import type { TransactionType } from '#models/transaction'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default class TransactionRepository {
  async create(
    data: { contaId: number; tipo: TransactionType; valor: number; descricao?: string },
    trx?: TransactionClientContract
  ) {
    return Transaction.create(data as any, trx ? { client: trx } : undefined)
  }

  async findByContaId(contaId: number) {
    return Transaction.query()
      .where('conta_id', contaId)
      .orderBy('created_at', 'desc')
  }
}
