import api from '../api/axios'
import type { StatementResponse } from '../types'

export const statementService = {
  async getStatement(): Promise<StatementResponse> {
    const { data } = await api.get<StatementResponse>('/statement')
    return data
  },
}
