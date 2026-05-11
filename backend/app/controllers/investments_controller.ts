import type { HttpContext } from '@adonisjs/core/http'
import InvestmentService from '#services/investment_service'
import { createInvestmentValidator } from '#validators/investment_validator'

const investmentService = new InvestmentService()

export default class InvestmentsController {
  async types({ response }: HttpContext) {
    const result = await investmentService.getTypes()
    return response.ok(result)
  }

  async index({ auth, response }: HttpContext) {
    const result = await investmentService.getMyInvestments(auth.user!.id)
    return response.ok(result)
  }

  async store({ request, auth, response }: HttpContext) {
    const data = await request.validateUsing(createInvestmentValidator)
    const result = await investmentService.invest(auth.user!.id, data.tipoInvestimentoId, data.valor)
    return response.created(result)
  }

  async rescue({ params, auth, response }: HttpContext) {
    const result = await investmentService.rescue(params.id, auth.user!.id)
    return response.ok(result)
  }
}
