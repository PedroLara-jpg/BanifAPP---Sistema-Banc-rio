import type { HttpContext } from '@adonisjs/core/http'
import AccountService from '#services/account_service'
import { createAccountValidator } from '#validators/account_validator'

const accountService = new AccountService()

export default class AccountsController {
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createAccountValidator)
    const result = await accountService.createAccount(data)
    return response.created(result)
  }

  async balance({ auth, response }: HttpContext) {
    const result = await accountService.getBalance(auth.user!.id)
    return response.ok(result)
  }
}
