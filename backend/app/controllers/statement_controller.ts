import type { HttpContext } from '@adonisjs/core/http'
import StatementService from '#services/statement_service'

const statementService = new StatementService()

export default class StatementController {
  async index({ auth, response }: HttpContext) {
    const result = await statementService.getStatement(auth.user!.id)
    return response.ok(result)
  }
}
