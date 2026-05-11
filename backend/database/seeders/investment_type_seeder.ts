import { BaseSeeder } from '@adonisjs/lucid/seeders'
import InvestmentType from '#models/investment_type'

export default class InvestmentTypeSeeder extends BaseSeeder {
  async run() {
    const types = [
      {
        nome: 'Poupança',
        descricao: 'Investimento de baixo risco com rendimento mensal garantido.',
        taxaRendimento: '0.5000' as any,
      },
      {
        nome: 'Títulos do Governo',
        descricao: 'Títulos públicos federais com rentabilidade atrelada à taxa Selic.',
        taxaRendimento: '0.8000' as any,
      },
      {
        nome: 'Ações',
        descricao: 'Participação em empresas listadas na bolsa de valores. Risco variável.',
        taxaRendimento: '0.0000' as any,
      },
    ]

    for (const type of types) {
      const existing = await InvestmentType.findBy('nome', type.nome)
      if (!existing) {
        await InvestmentType.create(type)
      }
    }
  }
}
