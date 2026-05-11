// This controller is not used in BANIF. Client registration is handled by ClientsController.
import type { HttpContext } from '@adonisjs/core/http'

export default class NewAccountController {
  async store({ response }: HttpContext) {
    return response.notFound({ message: 'Use POST /clients para cadastrar clientes.' })
  }
}
