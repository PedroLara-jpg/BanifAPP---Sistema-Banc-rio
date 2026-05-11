import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Address from '#models/address'
import BankAccount from '#models/bank_account'
import Transaction from '#models/transaction'

const AGENCIA = '0042'

const clientsWithAccount = [
  {
    user: {
      nomeCompleto: 'Naruto Uzumaki',
      email: 'naruto@konoha.jp',
      senha: '123456',
      cpf: '111.222.333-44',
      role: 'CLIENT' as const,
    },
    address: { rua: 'Rua Hokage', numero: '1', cidade: 'Konoha', estado: 'AM' },
    account: { numeroConta: '11111-1', balance: 2500 },
    transactions: [
      { tipo: 'DEPOSIT' as const, valor: 2500, descricao: 'Depósito inicial' },
    ],
  },
  {
    user: {
      nomeCompleto: 'Mikasa Ackermann',
      email: 'mikasa@paradis.com',
      senha: '123456',
      cpf: '222.333.444-55',
      role: 'CLIENT' as const,
    },
    address: { rua: 'Rua das Muralhas', numero: '104', cidade: 'Paradis', estado: 'RS' },
    account: { numeroConta: '22222-2', balance: 8000 },
    transactions: [
      { tipo: 'DEPOSIT' as const, valor: 10000, descricao: 'Depósito inicial' },
      { tipo: 'WITHDRAW' as const, valor: 2000, descricao: 'Saque' },
    ],
  },
  {
    user: {
      nomeCompleto: 'Goku Son',
      email: 'goku@capsulecorp.com',
      senha: '123456',
      cpf: '333.444.555-66',
      role: 'CLIENT' as const,
    },
    address: { rua: 'Rua Kame', numero: '7', cidade: 'Paozu', estado: 'MT' },
    account: { numeroConta: '33333-3', balance: 50000 },
    transactions: [
      { tipo: 'DEPOSIT' as const, valor: 50000, descricao: 'Depósito inicial' },
    ],
  },
  {
    user: {
      nomeCompleto: 'Hinata Shoyo',
      email: 'hinata@karasuno.jp',
      senha: '123456',
      cpf: '444.555.666-77',
      role: 'CLIENT' as const,
    },
    address: { rua: 'Rua do Ginásio', numero: '10', cidade: 'Miyagi', estado: 'SC' },
    account: { numeroConta: '44444-4', balance: 1200 },
    transactions: [
      { tipo: 'DEPOSIT' as const, valor: 1500, descricao: 'Depósito inicial' },
      { tipo: 'WITHDRAW' as const, valor: 300, descricao: 'Saque' },
    ],
  },
]

const clientsWithoutAccount = [
  {
    user: {
      nomeCompleto: 'Levi Ackermann',
      email: 'levi@scouts.com',
      senha: '123456',
      cpf: '555.666.777-88',
      role: 'CLIENT' as const,
    },
    address: { rua: 'Rua Exploração', numero: '40', cidade: 'Stohess', estado: 'SP' },
  },
  {
    user: {
      nomeCompleto: 'Usagi Tsukino',
      email: 'usagi@sailor.jp',
      senha: '123456',
      cpf: '666.777.888-99',
      role: 'CLIENT' as const,
    },
    address: { rua: 'Rua Lua', numero: '20', cidade: 'Juuban', estado: 'RJ' },
  },
  {
    user: {
      nomeCompleto: 'Edward Elric',
      email: 'edward@elric.com',
      senha: '123456',
      cpf: '777.888.999-00',
      role: 'CLIENT' as const,
    },
    address: { rua: 'Rua Alquimia', numero: '3', cidade: 'Amestris', estado: 'MG' },
  },
  {
    user: {
      nomeCompleto: 'Rem Roswaal',
      email: 'rem@roswaal.com',
      senha: '123456',
      cpf: '888.999.000-11',
      role: 'CLIENT' as const,
    },
    address: { rua: 'Rua Crystaltear', numero: '15', cidade: 'Roswaal', estado: 'PR' },
  },
]

export default class AnimeClientsSeeder extends BaseSeeder {
  async run() {
    for (const data of clientsWithAccount) {
      const existing = await User.findBy('email', data.user.email)
      if (existing) continue

      const user = await User.create(data.user)
      await Address.create({ usuarioId: user.id, ...data.address })

      const account = await BankAccount.create({
        usuarioId: user.id,
        numeroConta: data.account.numeroConta,
        numeroAgencia: AGENCIA,
        balance: String(data.account.balance) as any,
      })

      for (const tx of data.transactions) {
        await Transaction.create({ contaId: account.id, ...tx } as any)
      }
    }

    for (const data of clientsWithoutAccount) {
      const existing = await User.findBy('email', data.user.email)
      if (existing) continue

      const user = await User.create(data.user)
      await Address.create({ usuarioId: user.id, ...data.address })
    }
  }
}
