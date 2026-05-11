import AccountRepository from '#repositories/account_repository'
import TransactionRepository from '#repositories/transaction_repository'
import { Exception } from '@adonisjs/core/exceptions'

export default class StatementService {
  constructor(
    private accountRepository: AccountRepository = new AccountRepository(),
    private transactionRepository: TransactionRepository = new TransactionRepository()
  ) {}

  async getStatement(usuarioId: number) {
    const account = await this.accountRepository.findByUsuarioId(usuarioId)
    if (!account) {
      throw new Exception('Conta bancária não encontrada.', { status: 404 })
    }

    const transactions = await this.transactionRepository.findByContaId(account.id)

    return {
      conta: {
        numeroConta: account.numeroConta,
        numeroAgencia: account.numeroAgencia,
        balance: Number(account.balance),
      },
      transacoes: transactions.map((t: any) => ({
        id: t.id,
        tipo: t.tipo,
        valor: Number(t.valor),
        descricao: t.descricao,
        createdAt: t.createdAt,
      })),
    }
  }
}
