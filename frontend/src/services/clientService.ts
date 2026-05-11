import api from '../api/axios'
import type { Client } from '../types'

interface CreateClientData {
  nomeCompleto: string
  email: string
  senha: string
  cpf: string
  endereco: { cidade: string; estado: string; rua: string; numero: string }
}

interface CreateAccountData {
  usuarioId: number
  numeroConta: string
  numeroAgencia: string
  initialBalance?: number
}

export const clientService = {
  async createClient(data: CreateClientData) {
    const { data: res } = await api.post('/clients', data)
    return res
  },

  async listClients(): Promise<Client[]> {
    const { data } = await api.get<Client[]>('/clients')
    return data
  },

  async createAccount(data: CreateAccountData) {
    const { data: res } = await api.post('/accounts', data)
    return res
  },
}
