import User from '#models/user'
import Address from '#models/address'

export default class UserRepository {
  async findByEmail(email: string) {
    return User.findBy('email', email)
  }

  async findByIdWithRelations(id: number) {
    return User.query()
      .where('id', id)
      .preload('address')
      .preload('bankAccount')
      .firstOrFail()
  }

  async findAllClients() {
    return User.query()
      .where('role', 'CLIENT')
      .preload('address')
      .preload('bankAccount')
      .orderBy('id', 'desc')
  }

  async create(data: {
    nomeCompleto: string
    email: string
    senha: string
    cpf: string
    role: 'MANAGER' | 'CLIENT'
  }) {
    return User.create(data)
  }

  async createAddress(
    usuarioId: number,
    data: { cidade: string; estado: string; rua: string; numero: string }
  ) {
    return Address.create({ usuarioId, ...data })
  }

  async findById(id: number) {
    return User.find(id)
  }
}
