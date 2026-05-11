import Investment from '#models/investment'
import InvestmentType from '#models/investment_type'

export default class InvestmentRepository {
  async findAllTypes() {
    return InvestmentType.all()
  }

  async findTypeById(id: number) {
    return InvestmentType.find(id)
  }

  async create(data: {
    contaId: number
    tipoInvestimentoId: number
    valor: number
    status: 'ACTIVE'
  }) {
    return Investment.create(data as any)
  }

  async findByContaId(contaId: number) {
    return Investment.query()
      .where('conta_id', contaId)
      .preload('investmentType')
      .orderBy('created_at', 'desc')
  }

  async findByIdAndContaId(id: number, contaId: number) {
    return Investment.query()
      .where('id', id)
      .where('conta_id', contaId)
      .where('status', 'ACTIVE')
      .preload('investmentType')
      .first()
  }

  async findById(id: number) {
    return Investment.find(id)
  }

  async rescue(investment: Investment) {
    investment.status = 'RESCUED' as any
    return investment.save()
  }
}
