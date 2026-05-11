import type { HttpContext } from '@adonisjs/core/http'
import ClientService from '#services/client_service'
import { createClientValidator } from '#validators/client_validator'

const clientService = new ClientService()

export default class ClientsController {
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createClientValidator)
    const result = await clientService.createClient(data)
    return response.created(result)
  }

  async index({ response }: HttpContext) {
    const clients = await clientService.listClients()
    return response.ok(clients)
  }
}
