import api from '../api/axios'
import type { BankAccount } from '../types'

export const accountService = {
  async getBalance(): Promise<BankAccount> {
    const { data } = await api.get<BankAccount>('/balance')
    return data
  },
}
