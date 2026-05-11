import db from '@adonisjs/lucid/services/db'
import AccountRepository from '#repositories/account_repository'
import InvestmentRepository from '#repositories/investment_repository'
import { Exception } from '@adonisjs/core/exceptions'

export default class InvestmentService {
  constructor(
    private accountRepository: AccountRepository = new AccountRepository(),
    private investmentRepository: InvestmentRepository = new InvestmentRepository()
  ) {}

  async getTypes() {
    const types = await this.investmentRepository.findAllTypes()
    return types.map((t: any) => ({
      id: t.id,
      nome: t.nome,
      descricao: t.descricao,
      taxaRendimento: Number(t.taxaRendimento),
    }))
  }

  async invest(usuarioId: number, tipoInvestimentoId: number, valor: number) {
    if (valor <= 0) {
      throw new Exception('O valor do investimento deve ser maior que zero.', { status: 422 })
    }

    const account = await this.accountRepository.findByUsuarioId(usuarioId)
    if (!account) {
      throw new Exception('Conta bancária não encontrada.', { status: 404 })
    }

    const type = await this.investmentRepository.findTypeById(tipoInvestimentoId)
    if (!type) {
      throw new Exception('Tipo de investimento não encontrado.', { status: 404 })
    }

    const currentBalance = Number(account.balance)
    if (currentBalance < valor) {
      throw new Exception('Saldo insuficiente para realizar o investimento.', { status: 422 })
    }

    await db.transaction(async (trx) => {
      account.useTransaction(trx)
      await this.accountRepository.updateBalance(account, currentBalance - valor)

      await trx.table('investimentos').insert({
        conta_id: account.id,
        tipo_investimento_id: tipoInvestimentoId,
        valor,
        status: 'ACTIVE',
        created_at: new Date(),
        updated_at: new Date(),
      })

      await trx.table('transacoes').insert({
        conta_id: account.id,
        tipo: 'INVESTMENT',
        valor,
        descricao: `Investimento em ${type.nome}`,
        created_at: new Date(),
        updated_at: new Date(),
      })
    })

    const updatedAccount = await this.accountRepository.findByUsuarioId(usuarioId)

    return {
      message: 'Investimento realizado com sucesso.',
      tipoInvestimento: type.nome,
      valor,
      novoSaldo: Number(updatedAccount!.balance),
    }
  }

  async getMyInvestments(usuarioId: number) {
    const account = await this.accountRepository.findByUsuarioId(usuarioId)
    if (!account) {
      throw new Exception('Conta bancária não encontrada.', { status: 404 })
    }

    const investments = await this.investmentRepository.findByContaId(account.id)

    return investments.map((inv: any) => ({
      id: inv.id,
      tipoInvestimento: inv.investmentType
        ? { id: inv.investmentType.id, nome: inv.investmentType.nome }
        : null,
      valor: Number(inv.valor),
      status: inv.status,
      createdAt: inv.createdAt,
    }))
  }

  async rescue(investmentId: number, usuarioId: number) {
    const account = await this.accountRepository.findByUsuarioId(usuarioId)
    if (!account) {
      throw new Exception('Conta bancária não encontrada.', { status: 404 })
    }

    const investment = await this.investmentRepository.findByIdAndContaId(investmentId, account.id)
    if (!investment) {
      throw new Exception('Investimento não encontrado ou já resgatado.', { status: 404 })
    }

    const valorResgate = Number(investment.valor)

    await db.transaction(async (trx) => {
      account.useTransaction(trx)
      investment.useTransaction(trx)

      await this.accountRepository.updateBalance(account, Number(account.balance) + valorResgate)
      await this.investmentRepository.rescue(investment)

      await trx.table('transacoes').insert({
        conta_id: account.id,
        tipo: 'INVESTMENT_RESCUE',
        valor: valorResgate,
        descricao: `Resgate de investimento #${investmentId}`,
        created_at: new Date(),
        updated_at: new Date(),
      })
    })

    const updatedAccount = await this.accountRepository.findByUsuarioId(usuarioId)

    return {
      message: 'Investimento resgatado com sucesso.',
      valorResgatado: valorResgate,
      novoSaldo: Number(updatedAccount!.balance),
    }
  }
}
