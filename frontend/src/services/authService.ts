import api from '../api/axios'
import type { User } from '../types'

interface LoginResponse {
  token: string
  user: User
}

export const authService = {
  async login(email: string, senha: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, senha })
    return data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>('/auth/me')
    return data
  },
}
