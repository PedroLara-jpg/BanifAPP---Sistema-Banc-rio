import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class UserSeeder extends BaseSeeder {
  async run() {
    const existing = await User.findBy('email', 'admin@banif.com')
    if (existing) return

    await User.create({
      nomeCompleto: 'Administrador BANIF',
      email: 'admin@banif.com',
      senha: 'admin123456',
      cpf: '000.000.000-00',
      role: 'MANAGER',
    })
  }
}
