import api from '../api/axios'
import type { Investment, InvestmentType } from '../types'

export const investmentService = {
  async getTypes(): Promise<InvestmentType[]> {
    const { data } = await api.get<InvestmentType[]>('/investments/types')
    return data
  },

  async getMyInvestments(): Promise<Investment[]> {
    const { data } = await api.get<Investment[]>('/investments')
    return data
  },

  async invest(tipoInvestimentoId: number, valor: number) {
    const { data } = await api.post('/investments', { tipoInvestimentoId, valor })
    return data
  },

  async rescue(id: number) {
    const { data } = await api.post(`/investments/${id}/rescue`)
    return data
  },
}
