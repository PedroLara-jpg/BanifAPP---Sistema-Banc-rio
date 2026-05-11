import db from '@adonisjs/lucid/services/db'
import AccountRepository from '#repositories/account_repository'
import UserRepository from '#repositories/user_repository'
import TransactionRepository from '#repositories/transaction_repository'
import { Exception } from '@adonisjs/core/exceptions'

export default class AccountService {
  constructor(
    private accountRepository: AccountRepository = new AccountRepository(),
    private userRepository: UserRepository = new UserRepository(),
    private transactionRepository: TransactionRepository = new TransactionRepository()
  ) {}

  async createAccount(data: {
    usuarioId: number
    numeroConta: string
    numeroAgencia: string
    initialBalance?: number
  }) {
    const user = await this.userRepository.findById(data.usuarioId)
    if (!user) {
      throw new Exception('Usuário não encontrado.', { status: 404 })
    }
    if (user.role !== 'CLIENT') {
      throw new Exception('Somente clientes podem ter contas bancárias.', { status: 422 })
    }

    const existingAccount = await this.accountRepository.findByUsuarioId(data.usuarioId)
    if (existingAccount) {
      throw new Exception('Usuário já possui uma conta bancária.', { status: 422 })
    }

    const existingNumber = await this.accountRepository.findByNumeroConta(data.numeroConta)
    if (existingNumber) {
      throw new Exception('Número de conta já está em uso.', { status: 422 })
    }

    const initialBalance = data.initialBalance ?? 0

    const account = await db.transaction(async (trx) => {
      const newAccount = await this.accountRepository.create(
        {
          usuarioId: data.usuarioId,
          numeroConta: data.numeroConta,
          numeroAgencia: data.numeroAgencia,
          balance: initialBalance,
        },
        trx
      )

      if (initialBalance > 0) {
        await this.transactionRepository.create(
          {
            contaId: newAccount.id,
            tipo: 'DEPOSIT',
            valor: initialBalance,
            descricao: 'Depósito inicial',
          },
          trx
        )
      }

      return newAccount
    })

    return {
      id: account.id,
      usuarioId: account.usuarioId,
      numeroConta: account.numeroConta,
      numeroAgencia: account.numeroAgencia,
      balance: Number(account.balance),
    }
  }

  async getBalance(usuarioId: number) {
    const account = await this.accountRepository.findByUsuarioId(usuarioId)
    if (!account) {
      throw new Exception('Conta bancária não encontrada.', { status: 404 })
    }

    return {
      numeroConta: account.numeroConta,
      numeroAgencia: account.numeroAgencia,
      balance: Number(account.balance),
    }
  }
}
