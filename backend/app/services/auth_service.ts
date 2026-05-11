import User from '#models/user'

export default class AuthService {
  async login(email: string, senha: string) {
    const user = await User.verifyCredentials(email, senha)

    const token = await User.accessTokens.create(user, ['*'], {
      name: 'login_token',
      expiresIn: '7 days',
    })

    return {
      token: token.value!.release(),
      user: {
        id: user.id,
        nomeCompleto: user.nomeCompleto,
        email: user.email,
        cpf: user.cpf,
        role: user.role,
      },
    }
  }

  async logout(user: User) {
    await User.accessTokens.delete(user, user.currentAccessToken!.identifier)
  }
}
