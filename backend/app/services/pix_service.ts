import db from '@adonisjs/lucid/services/db'
import AccountRepository from '#repositories/account_repository'
import { Exception } from '@adonisjs/core/exceptions'

export default class PixService {
  constructor(private accountRepository: AccountRepository = new AccountRepository()) {}

  async transfer(originUsuarioId: number, numeroConta: string, valor: number) {
    if (valor <= 0) {
      throw new Exception('O valor do Pix deve ser maior que zero.', { status: 422 })
    }

    const originAccount = await this.accountRepository.findByUsuarioId(originUsuarioId)
    if (!originAccount) {
      throw new Exception('Conta de origem não encontrada.', { status: 404 })
    }

    if (originAccount.numeroConta === numeroConta) {
      throw new Exception('Não é possível transferir para a própria conta.', { status: 422 })
    }

    const destAccount = await this.accountRepository.findByNumeroConta(numeroConta)
    if (!destAccount) {
      throw new Exception('Conta de destino não encontrada.', { status: 404 })
    }

    const originBalance = Number(originAccount.balance)
    if (originBalance < valor) {
      throw new Exception('Saldo insuficiente para realizar o Pix.', { status: 422 })
    }

    await db.transaction(async (trx) => {
      originAccount.useTransaction(trx)
      destAccount.useTransaction(trx)

      await this.accountRepository.updateBalance(originAccount, originBalance - valor)
      await this.accountRepository.updateBalance(destAccount, Number(destAccount.balance) + valor)

      await trx.table('transacoes').insert({
        conta_id: originAccount.id,
        tipo: 'PIX_SENT',
        valor,
        descricao: `Pix enviado para conta ${destAccount.numeroConta}`,
        created_at: new Date(),
        updated_at: new Date(),
      })

      await trx.table('transacoes').insert({
        conta_id: destAccount.id,
        tipo: 'PIX_RECEIVED',
        valor,
        descricao: `Pix recebido da conta ${originAccount.numeroConta}`,
        created_at: new Date(),
        updated_at: new Date(),
      })
    })

    const updatedOrigin = await this.accountRepository.findByUsuarioId(originUsuarioId)

    return {
      message: 'Pix realizado com sucesso.',
      novoSaldo: Number(updatedOrigin!.balance),
      valor,
      contaDestino: numeroConta,
    }
  }
}
