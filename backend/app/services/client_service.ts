import UserRepository from '#repositories/user_repository'
import { Exception } from '@adonisjs/core/exceptions'

export default class ClientService {
  constructor(private userRepository: UserRepository = new UserRepository()) {}

  async createClient(data: {
    nomeCompleto: string
    email: string
    senha: string
    cpf: string
    endereco: { cidade: string; estado: string; rua: string; numero: string }
  }) {
    const existing = await this.userRepository.findByEmail(data.email)
    if (existing) {
      throw new Exception('E-mail já cadastrado.', { status: 422 })
    }

    const user = await this.userRepository.create({
      nomeCompleto: data.nomeCompleto,
      email: data.email,
      senha: data.senha,
      cpf: data.cpf,
      role: 'CLIENT',
    })

    const address = await this.userRepository.createAddress(user.id, data.endereco)

    return {
      user: {
        id: user.id,
        nomeCompleto: user.nomeCompleto,
        email: user.email,
        cpf: user.cpf,
        role: user.role,
      },
      endereco: {
        cidade: address.cidade,
        estado: address.estado,
        rua: address.rua,
        numero: address.numero,
      },
    }
  }

  async listClients() {
    const clients = await this.userRepository.findAllClients()
    return clients.map((c: any) => ({
      id: c.id,
      nomeCompleto: c.nomeCompleto,
      email: c.email,
      cpf: c.cpf,
      role: c.role,
      endereco: c.address
        ? {
            cidade: c.address.cidade,
            estado: c.address.estado,
            rua: c.address.rua,
            numero: c.address.numero,
          }
        : null,
      conta: c.bankAccount
        ? {
            numeroConta: c.bankAccount.numeroConta,
            numeroAgencia: c.bankAccount.numeroAgencia,
            balance: Number(c.bankAccount.balance),
          }
        : null,
    }))
  }
}
