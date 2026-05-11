import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth_service'
import { loginValidator } from '#validators/login_validator'

const authService = new AuthService()

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const data = await request.validateUsing(loginValidator)

    try {
      const result = await authService.login(data.email, data.senha)
      return response.ok(result)
    } catch {
      return response.unauthorized({ message: 'Credenciais inválidas.' })
    }
  }

  async logout({ auth, response }: HttpContext) {
    await authService.logout(auth.user!)
    return response.ok({ message: 'Logout realizado com sucesso.' })
  }

  async me({ auth, response }: HttpContext) {
    const user = auth.user!
    return response.ok({
      id: user.id,
      nomeCompleto: user.nomeCompleto,
      email: user.email,
      cpf: user.cpf,
      role: user.role,
    })
  }
}
