import type { HttpContext } from '@adonisjs/core/http'
import PixService from '#services/pix_service'
import { pixValidator } from '#validators/pix_validator'

const pixService = new PixService()

export default class PixController {
  async transfer({ request, auth, response }: HttpContext) {
    const data = await request.validateUsing(pixValidator)
    const result = await pixService.transfer(auth.user!.id, data.numeroConta, data.valor)
    return response.ok(result)
  }
}
